// --- Database Configuration ---
const DB_NAME = 'CalorieDeficitDB';
const DB_VERSION = 1;
const STORE_NAME = 'dailyStatus';
let db = null;

function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = event.target.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: 'date' });
      }
    };
  });
}

function getDayStatus(dateStr) {
  return new Promise((resolve) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(dateStr);
    request.onsuccess = () => resolve(request.result ? request.result.status : null);
    request.onerror = () => resolve(null);
  });
}

function saveDayStatus(dateStr, status) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    let request;
    if (status === null) {
      request = store.delete(dateStr);
    } else {
      request = store.put({ date: dateStr, status: status });
    }

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

// --- App State & Navigation Logic ---
const state = {
  currentDate: new Date(),
  selectedDateStr: null,
  selectedStatus: null
};

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// DOM Cache
const homeView = document.getElementById('home-view');
const dayView = document.getElementById('day-view');
const calendarGrid = document.getElementById('calendar-grid');
const monthYearTitle = document.getElementById('month-year-title');
const selectedDateTitle = document.getElementById('selected-date-title');

const btnDeficit = document.getElementById('btn-deficit');
const btnNot = document.getElementById('btn-not');
const btnReset = document.getElementById('btn-reset');
const btnSave = document.getElementById('btn-save');

function init() {
  initDB().then(() => {
    renderCalendar();
    setupEventListeners();
  }).catch(err => console.error("Database initialization failed", err));
  
  registerServiceWorker();
}

function navigateTo(viewName) {
  if (viewName === 'home') {
    dayView.classList.add('hidden');
    homeView.classList.remove('hidden');
    renderCalendar();
  } else if (viewName === 'day') {
    homeView.classList.add('hidden');
    dayView.classList.remove('hidden');
    updateDayViewUI();
  }
}

// --- Calendar Rendering Logic ---
async function renderCalendar() {
  calendarGrid.innerHTML = '';
  const year = state.currentDate.getFullYear();
  const month = state.currentDate.getMonth();

  monthYearTitle.textContent = `${months[month]} ${year}`;

  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  // Empty padded cells for days of previous month
  for (let i = 0; i < firstDayIndex; i++) {
    const emptyCell = document.createElement('div');
    emptyCell.classList.add('calendar-day', 'empty');
    calendarGrid.appendChild(emptyCell);
  }

  // Populate actual calendar days
  for (let day = 1; day <= totalDays; day++) {
    const dayCell = document.createElement('div');
    dayCell.classList.add('calendar-day');
    dayCell.textContent = day;

    // ISO Format: YYYY-MM-DD
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    dayCell.dataset.date = dateStr;

    const status = await getDayStatus(dateStr);
    if (status === 'deficit') {
      dayCell.classList.add('state-deficit');
    } else if (status === 'not') {
      dayCell.classList.add('state-not');
    } else {
      dayCell.classList.add('state-none');
    }

    dayCell.addEventListener('click', () => handleDayClick(dateStr, day, month, year));
    calendarGrid.appendChild(dayCell);
  }
}

// --- Day Selection & Action Logic ---
async function handleDayClick(dateStr, day, month, year) {
  state.selectedDateStr = dateStr;
  selectedDateTitle.textContent = `${day} ${months[month]} ${year}`;
  
  const currentStatus = await getDayStatus(dateStr);
  state.selectedStatus = currentStatus;
  
  navigateTo('day');
}

function updateDayViewUI() {
  btnDeficit.classList.remove('active');
  btnNot.classList.remove('active');

  if (state.selectedStatus === 'deficit') {
    btnDeficit.classList.add('active');
  } else if (state.selectedStatus === 'not') {
    btnNot.classList.add('active');
  }
}

function setupEventListeners() {
  btnDeficit.addEventListener('click', () => {
    state.selectedStatus = 'deficit';
    updateDayViewUI();
  });

  btnNot.addEventListener('click', () => {
    state.selectedStatus = 'not';
    updateDayViewUI();
  });

  btnReset.addEventListener('click', () => {
    state.selectedStatus = null;
    updateDayViewUI();
  });

  btnSave.addEventListener('click', async () => {
    await saveDayStatus(state.selectedDateStr, state.selectedStatus);
    navigateTo('home');
  });
}

// --- Service Worker Registration ---
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js')
        .then(reg => console.log('Service Worker registered.', reg))
        .catch(err => console.error('Service Worker dynamic registration failed.', err));
    });
  }
}

document.addEventListener('DOMContentLoaded', init);