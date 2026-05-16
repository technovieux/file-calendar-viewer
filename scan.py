#!/usr/bin/env python3
import os
import json
from datetime import datetime
from pathlib import Path

FILES_DIR = Path(__file__).parent / 'files'
OUTPUT_FILE = Path(__file__).parent / 'files-data.json'

def get_file_icon(extension):
    icons = {
        'pdf': '📄',
        'jpg': '🖼️',
        'jpeg': '📸',
        'png': '🖼️',
        'gif': '🖼️',
        'doc': '📋',
        'docx': '📋',
        'txt': '📝',
        'zip': '📦',
        'rar': '📦'
    }
    return icons.get(extension.lower(), '📄')

def format_file_size(size_bytes):
    if size_bytes < 1024:
        return f'{size_bytes} B'
    elif size_bytes < 1024 * 1024:
        return f'{size_bytes / 1024:.2f} KB'
    else:
        return f'{size_bytes / (1024 * 1024):.2f} MB'

def scan_files():
    files_data = []
    
    if not FILES_DIR.exists():
        print(f'❌ Folder not found: {FILES_DIR}')
        return files_data
    
    print(f'🔍 Scanning folder: {FILES_DIR}')
    
    for file_path in FILES_DIR.iterdir():
        if not file_path.is_file():
            continue
        
        extension = file_path.suffix.lower().lstrip('.')
        stat = file_path.stat()
        size = format_file_size(stat.st_size)
        
        # Get modification date
        mod_time = datetime.fromtimestamp(stat.st_mtime)
        date_str = mod_time.strftime('%Y-%m-%d')
        
        files_data.append({
            'name': file_path.name,
            'type': extension or 'unknown',
            'date': date_str,
            'size': size,
            'icon': get_file_icon(extension)
        })
        
        print(f'✅ Added: {file_path.name} ({size})')
    
    # Sort by date (newest first)
    files_data.sort(key=lambda x: x['date'], reverse=True)
    
    # Save as JSON
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(files_data, f, ensure_ascii=False, indent=2)
    
    print(f'\n📊 {len(files_data)} file(s) found')
    print(f'💾 Saved to: {OUTPUT_FILE}')
    return files_data

if __name__ == '__main__':
    scan_files()
