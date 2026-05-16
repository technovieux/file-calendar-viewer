// File data
let files = [];
let currentMonth = new Date();
let selectedFile = null;
let selectedDate = null;

// Color by file type
const typeColors = {
    pdf: '#E74C3C',
    jpg: '#3498DB',
    jpeg: '#9B59B6',
    png: '#27AE60',
    doc: '#F39C12',
    txt: '#95A5A6'
};

const typeIcons = {
    pdf: '📄',
    jpg: '🖼️',
    jpeg: '📸',
    png: '🖼️',
    doc: '📋',
    txt: '📝'
};

// Load file data
async function loadFiles() {
    try {
        const response = await fetch('files-data.json');
        files = await response.json();
        initialize();
    } catch (error) {
        console.error('Error loading files:', error);
        files = [];
        initialize();
    }
}

// Initialize the application
function initialize() {
    renderHistogram();
    renderCalendar();
    renderLegend();
    updateCalendarTitle();
}

// Render histogram
function renderHistogram() {
    const histogram = document.getElementById('histogram');
    histogram.innerHTML = '';

    // Count files by date
    const dateCount = {};
    files.forEach(file => {
        dateCount[file.date] = (dateCount[file.date] || 0) + 1;
    });

    // Sort dates
    const sortedDates = Object.keys(dateCount).sort();

    if (sortedDates.length === 0) {
        histogram.innerHTML = '<p style="color: white; text-align: center; width: 100%;">No files</p>';
        return;
    }

    const maxCount = Math.max(...Object.values(dateCount));

    sortedDates.forEach(date => {
        const count = dateCount[date];
        const percentage = (count / maxCount) * 100;
        
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = percentage + '%';
        bar.innerHTML = `
            <div class="bar-value">${count}</div>
            <div class="bar-label">${new Date(date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })}</div>
        `;
        bar.addEventListener('click', () => filterByDate(date));
        histogram.appendChild(bar);
    });
}

// Filter by date and navigate to calendar
function filterByDate(date) {
    selectedDate = date;
    
    // Navigate to the month of the date
    const dateObj = new Date(date);
    if (currentMonth.getFullYear() !== dateObj.getFullYear() || 
        currentMonth.getMonth() !== dateObj.getMonth()) {
        currentMonth = new Date(dateObj.getFullYear(), dateObj.getMonth());
        updateCalendarTitle();
        renderCalendar();
    }
    
    // Display files of the selected day
    displayFilesOfDay(date);
    
    // Highlight the day in the calendar
    setTimeout(() => {
        const calendarDays = document.querySelectorAll('.calendar-day');
        calendarDays.forEach(day => day.style.outline = 'none');
        
        const day = dateObj.getDate();
        const targetDay = Array.from(calendarDays).find(d => 
            d.classList.contains('has-files') && 
            d.querySelector('.day-number') && 
            d.querySelector('.day-number').textContent === String(day)
        );
        
        if (targetDay) {
            targetDay.style.outline = '3px solid #FFD700';
        }
    }, 50);
}

// Display files for a specific day
function displayFilesOfDay(date) {
    selectedDate = date;
    const filesOfDay = files.filter(f => f.date === date);
    
    // Navigate to the month of the date if not already there
    const dateObj = new Date(date);
    if (currentMonth.getFullYear() !== dateObj.getFullYear() || 
        currentMonth.getMonth() !== dateObj.getMonth()) {
        currentMonth = new Date(dateObj.getFullYear(), dateObj.getMonth());
        updateCalendarTitle();
        renderCalendar();
    }
    
    // Update the selected day info
    document.getElementById('selectedDayInfo').textContent = 
        dateObj.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    
    // Render the files for the selected day in column 2
    const filesList = document.getElementById('filesList');
    filesList.innerHTML = '';
    
    if (filesOfDay.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'Aucun fichier';
        li.style.cursor = 'default';
        li.style.opacity = '0.5';
        filesList.appendChild(li);
        return;
    }
    
    filesOfDay.forEach(file => {
        const li = document.createElement('li');
        li.className = file === selectedFile ? 'active' : '';
        
        const icon = document.createElement('span');
        icon.className = 'file-icon';
        icon.textContent = typeIcons[file.type] || '📄';
        
        const nameDiv = document.createElement('div');
        nameDiv.style.flex = '1';
        nameDiv.style.minWidth = '0';
        nameDiv.innerHTML = `
            <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${file.name}</div>
            <div style="font-size: 0.75em; opacity: 0.7;">${file.size}</div>
        `;
        
        li.appendChild(icon);
        li.appendChild(nameDiv);
        li.addEventListener('click', () => selectFile(file));
        
        filesList.appendChild(li);
    });
    
    // Highlight the day in the calendar
    setTimeout(() => {
        const calendarDays = document.querySelectorAll('.calendar-day');
        calendarDays.forEach(day => day.style.outline = 'none');
        
        const day = dateObj.getDate();
        const targetDay = Array.from(calendarDays).find(d => 
            d.classList.contains('has-files') && 
            d.querySelector('.day-number') && 
            d.querySelector('.day-number').textContent === String(day)
        );
        
        if (targetDay) {
            targetDay.style.outline = '3px solid #FFD700';
        }
    }, 50);
}

// Render calendar
function renderCalendar() {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // First day of month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    // Days of week
    const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    dayNames.forEach(dayName => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day empty';
        dayHeader.innerHTML = `<strong>${dayName}</strong>`;
        dayHeader.style.borderColor = 'transparent';
        calendar.appendChild(dayHeader);
    });

    // Empty days before first day of month
    for (let i = 0; i < startingDayOfWeek; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        calendar.appendChild(emptyDay);
    }

    // Days of month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const filesOfDay = files.filter(f => f.date === dateStr);
        
        // Check if today
        const today = new Date();
        if (year === today.getFullYear() && 
            month === today.getMonth() && 
            day === today.getDate()) {
            dayElement.classList.add('today');
        }

        // Add files of the day
        if (filesOfDay.length > 0) {
            dayElement.classList.add('has-files');
            
            const dayNumberDiv = document.createElement('div');
            dayNumberDiv.className = 'day-number';
            dayNumberDiv.textContent = day;
            dayElement.appendChild(dayNumberDiv);

            const indicatorsDiv = document.createElement('div');
            indicatorsDiv.className = 'file-indicators';
            
            filesOfDay.forEach(file => {
                const indicator = document.createElement('div');
                indicator.className = 'file-indicator';
                indicator.style.backgroundColor = typeColors[file.type] || '#667eea';
                indicator.title = file.type;
                indicatorsDiv.appendChild(indicator);
            });
            
            dayElement.appendChild(indicatorsDiv);
        } else {
            dayElement.textContent = day;
        }

        dayElement.addEventListener('click', () => {
            if (filesOfDay.length > 0) {
                displayFilesOfDay(dateStr);
            }
        });

        calendar.appendChild(dayElement);
    }
}

// Render legend
function renderLegend() {
    const legend = document.getElementById('legend');
    legend.innerHTML = '';

    const usedTypes = new Set();
    files.forEach(file => usedTypes.add(file.type));

    Array.from(usedTypes).sort().forEach(type => {
        const count = files.filter(f => f.type === type).length;
        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item';
        
        const color = document.createElement('div');
        color.className = `legend-color ${type}`;
        
        const label = document.createElement('span');
        label.textContent = `${type.toUpperCase()} (${count})`;
        
        legendItem.appendChild(color);
        legendItem.appendChild(label);
        legend.appendChild(legendItem);
    });
}


// Select a file
function selectFile(file) {
    selectedFile = file;
    
    // Update title and details
    document.getElementById('fileName').textContent = file.name;
    
    const fileDetails = document.getElementById('fileDetails');
    fileDetails.innerHTML = `
        <div class="detail-item">
            <div class="detail-label">Type</div>
            <div class="detail-value">${file.type.toUpperCase()}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Date</div>
            <div class="detail-value">${new Date(file.date).toLocaleDateString('en-US')}</div>
        </div>
        <div class="detail-item">
            <div class="detail-label">Size</div>
            <div class="detail-value">${file.size}</div>
        </div>
    `;

    // File preview
    const filePreview = document.getElementById('filePreview');
    filePreview.innerHTML = '';

    if (['jpg', 'jpeg', 'png'].includes(file.type)) {
        const img = document.createElement('img');
        img.src = `files/${file.name}`;
        img.alt = file.name;
        img.onerror = () => {
            filePreview.innerHTML = '<p class="placeholder">Unable to load image</p>';
        };
        filePreview.appendChild(img);
    } else if (file.type === 'pdf') {
        const btn = document.createElement('a');
        btn.href = `files/${file.name}`;
        btn.target = '_blank';
        btn.className = 'nav-btn';
        btn.style.padding = '15px 30px';
        btn.style.fontSize = '1em';
        btn.textContent = '📥 Download PDF File';
        filePreview.appendChild(btn);
        
        const p = document.createElement('p');
        p.style.marginTop = '20px';
        p.textContent = '(PDF files cannot be previewed directly)';
        filePreview.appendChild(p);
    } else {
        const btn = document.createElement('a');
        btn.href = `files/${file.name}`;
        btn.download = file.name;
        btn.className = 'nav-btn';
        btn.style.padding = '15px 30px';
        btn.style.fontSize = '1em';
        btn.textContent = `📥 Download ${file.type.toUpperCase()}`;
        filePreview.appendChild(btn);
        
        const p = document.createElement('p');
        p.style.marginTop = '20px';
        p.textContent = `(${file.type.toUpperCase()} file - Preview not available)`;
        filePreview.appendChild(p);
    }

    // Update highlighting in column 2
    if (selectedDate) {
        displayFilesOfDay(selectedDate);
    }
}

// Update month/year title
function updateCalendarTitle() {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    
    const title = `${monthNames[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`;
    document.getElementById('currentMonth').textContent = title;
}

// Calendar navigation
document.getElementById('prevMonth').addEventListener('click', () => {
    currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1);
    updateCalendarTitle();
    renderCalendar();
});

document.getElementById('nextMonth').addEventListener('click', () => {
    currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1);
    updateCalendarTitle();
    renderCalendar();
});

// Load files on startup
document.addEventListener('DOMContentLoaded', loadFiles);
