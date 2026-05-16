# 📅 File Viewer & Calendar

An interactive web app to explore and view the files in a directory using a modern calendar with a histogram.


![alt text](https://github.com/technovieux/file-calendar-viewer/files/image.png "Banner")


![Python](https://img.shields.io/badge/python-3.6%2B-blue)
![HTML5](https://img.shields.io/badge/HTML5-100%25-orange)

## ✨ 

- 📊 **Interactive histogram** - Visualization of the number of files by date
- 📅 **Dynamic calendar** - Select a day to view its files
- 🖼️ **Preview** - Direct image display
- 📥 **Download** - All files can be downloaded
- 🔄 **Automatic scan** - Files are detected automatically
- 📱 **Responsive interface** - Works on desktop and mobile

## 🚀 Quick Installation

### Prerequisites
- **Python 3.6+** (for the scan script)

### Steps

1. **Clone or download the project**
```bash
git clone https://github.com/technovieux/file-calendar-viewer.git
cd file-calendar-viewer
```

2. **Generate the file data**
```bash
python scan.py
```

3. **Open the site**
Double-click `index.html` OR start a local server:
```bash
python -m http.server 8000
```
Then go to `http://localhost:8000`

```


## 📁 Project Structure

```
file-calendar-viewer/
├── index.html           # Main page
├── styles.css           # Stylesheet
├── script.js            # JavaScript logic
├── scan.py              # Scan script (Python)
├── scan.bat             # Windows launcher
├── files-data.json      # Automatically generated data
├── files/               # 📁 Your file folder
│   ├── document.pdf
│   ├── image.jpg
│   └── ...
└── README.md            # Documentation
```

## 🎯 Usage

### Interface

1. **Column 1 - Calendar** 
   - Navigate by month/year using arrows
   - Days highlighted if files are present
   - Click on a day to view its files

2. **Column 2 - Files for the Day**
   - List of files for the selected day
   - Icons by file type
   - File size displayed

3. **Column 3 - View**
   - Image preview (JPG, JPEG, PNG)
   - Download other files
   - File details (type, date, size)

4. **Top - Histogram**
   - Click on a bar to view files from that day
   - Automatically navigates to the corresponding month

### Add/Edit Files

1. Add or remove files from the `files/` folder
2. Run the scan script:
   ```bash
   python scan.py
   ```
3. Refresh the web page (F5 or Cmd+R)

## 🛠️ Customization


### Add file types
Edit `scan.py` to add icons:
```python
typeIcons = {
    ‘pdf’: ‘📄’,
    ‘jpg’: ‘🖼️’,
    ‘mp4’: ‘🎬’,  # New
    # ...
}
```

### Change colors
Edit `styles.css`:
```css
.calendar-panel {
    background: #YOUR_COLOR;
}
```

## 📊 Technical Details

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Python 3 (scan only)
- **No external dependencies** - Lightweight and fast
- **Responsive**: Mobile-friendly

## 🔄 Automatic Scan

The `scan.py` script:
- Scans the `files/` folder
- Extracts the type, date, and size
- Automatically generates `files-data.json`
- Sorts by date (newest first)

## 📝 Notes

- Only **files** are listed (not folders)
- The date used is the **file modification** date
- The size is automatically formatted (B, KB, MB)
- Works on **Windows, Mac, and Linux**