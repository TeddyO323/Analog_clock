document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const clockCanvas = document.getElementById('analogClock');
    const ctx = clockCanvas.getContext('2d');
    const digitalTime = document.getElementById('digitalTime');
    const timezoneLabel = document.getElementById('timezoneLabel');
    const timezoneSelect = document.getElementById('timezoneSelect');
    const timezoneSearch = document.getElementById('timezoneSearch');
    const timezoneTable = document.getElementById('timezoneTable');
    const faceColor = document.getElementById('faceColor');
    const borderColor = document.getElementById('borderColor');
    const hourColor = document.getElementById('hourColor');
    const minuteColor = document.getElementById('minuteColor');
    const secondColor = document.getElementById('secondColor');
    const saveSettings = document.getElementById('saveSettings');

    // Clock settings
    let settings = {
        timezone: moment.tz.guess(),
        faceColor: '#f8fafc',
        borderColor: '#4f46e5',
        hourColor: '#1e40af',
        minuteColor: '#dc2626',
        secondColor: '#10b981'
    };

    // Initialize the app
    function init() {
        loadSettings();
        populateTimezones();
        updateClock();
        setInterval(updateClock, 1000);
        setupEventListeners();
    }

    // Load settings from localStorage
    function loadSettings() {
        const savedSettings = localStorage.getItem('clockSettings');
        if (savedSettings) {
            settings = JSON.parse(savedSettings);
            applySettingsToUI();
        }
    }

    // Apply settings to UI
    function applySettingsToUI() {
        faceColor.value = settings.faceColor;
        borderColor.value = settings.borderColor;
        hourColor.value = settings.hourColor;
        minuteColor.value = settings.minuteColor;
        secondColor.value = settings.secondColor;
        
        // Find and select the current timezone in dropdown
        if (timezoneSelect.options.length > 0) {
            for (let i = 0; i < timezoneSelect.options.length; i++) {
                if (timezoneSelect.options[i].value === settings.timezone) {
                    timezoneSelect.selectedIndex = i;
                    break;
                }
            }
        }
    }

    // Save settings to localStorage
    function saveClockSettings() {
        settings.faceColor = faceColor.value;
        settings.borderColor = borderColor.value;
        settings.hourColor = hourColor.value;
        settings.minuteColor = minuteColor.value;
        settings.secondColor = secondColor.value;
        settings.timezone = timezoneSelect.value;
        
        localStorage.setItem('clockSettings', JSON.stringify(settings));
        
        // Show confirmation
        const toast = document.createElement('div');
        toast.className = 'fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg';
        toast.textContent = 'Settings saved!';
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
    }

    // Populate timezone dropdown and table
    function populateTimezones() {
        const timezones = moment.tz.names();
        
        // Populate dropdown
        timezones.forEach(tz => {
            const option = document.createElement('option');
            option.value = tz;
            option.textContent = tz;
            timezoneSelect.appendChild(option);
        });
        
        // Populate table
        updateTimezoneTable(timezones);
    }

    // Update timezone table with search results
    function updateTimezoneTable(timezones, searchTerm = '') {
        timezoneTable.innerHTML = '';
        
        const filteredZones = searchTerm 
            ? timezones.filter(tz => tz.toLowerCase().includes(searchTerm.toLowerCase()))
            : timezones;
        
        filteredZones.forEach(tz => {
            const row = document.createElement('tr');
            row.className = 'border-b border-gray-100 hover:bg-indigo-50 cursor-pointer';
            row.addEventListener('click', () => {
                settings.timezone = tz;
                timezoneSelect.value = tz;
                saveClockSettings();
            });
            
            const tzCell = document.createElement('td');
            tzCell.className = 'py-2';
            tzCell.textContent = tz;
            
            const timeCell = document.createElement('td');
            timeCell.className = 'py-2';
            timeCell.textContent = moment().tz(tz).format('HH:mm:ss');
            
            const offsetCell = document.createElement('td');
            offsetCell.className = 'py-2';
            offsetCell.textContent = moment.tz(tz).format('Z');
            
            row.appendChild(tzCell);
            row.appendChild(timeCell);
            row.appendChild(offsetCell);
            timezoneTable.appendChild(row);
        });
        
        // Update table times every second
        setInterval(() => {
            const rows = timezoneTable.querySelectorAll('tr');
            rows.forEach(row => {
                const tz = row.cells[0].textContent;
                row.cells[1].textContent = moment().tz(tz).format('HH:mm:ss');
            });
        }, 1000);
    }

    // Update the clock display
    function updateClock() {
        const now = moment().tz(settings.timezone);
        const hours = now.hours();
        const minutes = now.minutes();
        const seconds = now.seconds();
        
        // Update digital display
        digitalTime.textContent = now.format('HH:mm:ss');
        timezoneLabel.textContent = settings.timezone;
        
        // Draw analog clock
        drawClock(hours, minutes, seconds);
    }

    // Draw the analog clock
    function drawClock(hours, minutes, seconds) {
        const radius = clockCanvas.width / 2;
        ctx.clearRect(0, 0, clockCanvas.width, clockCanvas.height);
        
        // Draw clock face
        ctx.beginPath();
        ctx.arc(radius, radius, radius - 10, 0, 2 * Math.PI);
        ctx.fillStyle = settings.faceColor;
        ctx.fill();
        ctx.strokeStyle = settings.borderColor;
        ctx.lineWidth = 8;
        ctx.stroke();
        
        // Draw clock numbers
        ctx.font = radius * 0.15 + 'px Arial';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#333';
        for (let i = 1; i <= 12; i++) {
            const angle = i * Math.PI / 6;
            const textRadius = radius * 0.85;
            const x = radius + Math.sin(angle) * textRadius;
            const y = radius - Math.cos(angle) * textRadius;
            ctx.fillText(i.toString(), x, y);
        }
        
        // Draw hour hand
        const hourAngle = (hours % 12 + minutes / 60) * Math.PI / 6;
        drawHand(hourAngle, radius * 0.5, 8, settings.hourColor);
        
        // Draw minute hand
        const minuteAngle = minutes * Math.PI / 30;
        drawHand(minuteAngle, radius * 0.7, 5, settings.minuteColor);
        
        // Draw second hand
        const secondAngle = seconds * Math.PI / 30;
        drawHand(secondAngle, radius * 0.8, 2, settings.secondColor);
        
        // Draw center circle
        ctx.beginPath();
        ctx.arc(radius, radius, radius * 0.05, 0, 2 * Math.PI);
        ctx.fillStyle = settings.borderColor;
        ctx.fill();
    }

    // Draw a clock hand
    function drawHand(angle, length, width, color) {
        const radius = clockCanvas.width / 2;
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.strokeStyle = color;
        ctx.moveTo(radius, radius);
        ctx.lineTo(
            radius + Math.sin(angle) * length,
            radius - Math.cos(angle) * length
        );
        ctx.stroke();
    }

    // Set up event listeners
    function setupEventListeners() {
        timezoneSelect.addEventListener('change', function() {
            settings.timezone = this.value;
            updateClock();
        });
        
        timezoneSearch.addEventListener('input', function() {
            updateTimezoneTable(moment.tz.names(), this.value);
        });
        
        saveSettings.addEventListener('click', saveClockSettings);
        
        // Color pickers
        [faceColor, borderColor, hourColor, minuteColor, secondColor].forEach(picker => {
            picker.addEventListener('input', function() {
                updateClock();
            });
        });
    }

    // Start the app
    init();
});
