// --- CONFIGURATION & CONSTANTS ---
const daily_cal_target = 2400;
const historical_deficit_offset = 0; // Reset to 0 for a clean slate
const kcal_per_kg = 7700;

// --- STATE ---
let selectedDate = new Date();
let currentMonth = new Date();
let db;
let allEntriesMap = new Map(); // DateString -> Consumed Amount

// --- INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
  updateHeaderDate();
  initDB();
  setupInputListener();
});

// --- INDEXED DB SETUP ---
function initDB() {
  const request = indexedDB.open("CalorieTrackerDB", 1);

  request.onupgradeneeded = (event) => {
    db = event.target.result;
    if (!db.objectStoreNames.contains("DailyEntries")) {
      db.createObjectStore("DailyEntries", { keyPath: "date" });
    }
  };

  request.onsuccess = (event) => {
    db = event.target.result;
    loadAllData();
  };

  request.onerror = (event) => console.error("Database error:", event.target.errorCode);
}

// --- DATA LOADING & CALCULATION ---
function loadAllData() {
  const transaction = db.transaction(["DailyEntries"], "readonly");
  const store = transaction.objectStore("DailyEntries");
  const request = store.getAll();

  request.onsuccess = () => {
    allEntriesMap.clear();
    let cumulativeDeficit = historical_deficit_offset;

    request.result.forEach(entry => {
      allEntriesMap.set(entry.date, entry.consumed);
      cumulativeDeficit += (daily_cal_target - entry.consumed);
    });

    updateCumulativeUI(cumulativeDeficit);
    renderCalendar();
    loadSelectedDayUI();
  };
}

// --- UI UPDATES ---
function updateCumulativeUI(totalDeficit) {
  const kgLost = (totalDeficit / kcal_per_kg).toFixed(2);
  document.getElementById('ui-cum-kcal').innerText = `${totalDeficit.toLocaleString()} kcal`;
  document.getElementById('ui-cum-kg').innerText = `${kgLost}kg`;
}

function loadSelectedDayUI() {
  const dateStr = formatDate(selectedDate);
  const inputEl = document.getElementById('calorie-input');

  if (allEntriesMap.has(dateStr)) {
    inputEl.value = allEntriesMap.get(dateStr);
  } else {
    inputEl.value = '';
  }
  updateStatusText();
}

// --- CALENDAR LOGIC ---
function renderCalendar() {
  const grid = document.getElementById('calendar-grid');
  grid.innerHTML = '';

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Calculate start day (0 = Mon, ..., 6 = Sun) to align with UI mockup
  let startDay = new Date(year, month, 1).getDay();
  startDay = startDay === 0 ? 6 : startDay - 1;

  // Empty slots for alignment
  for (let i = 0; i < startDay; i++) {
    const emptySlot = document.createElement('div');
    grid.appendChild(emptySlot);
  }

  const selectedDateStr = formatDate(selectedDate);

  for (let day = 1; day <= daysInMonth; day++) {
    const loopDate = new Date(year, month, day);
    const loopDateStr = formatDate(loopDate);

    const btn = document.createElement('button');
    btn.className = 'day-btn';
    btn.innerText = day;

    if (allEntriesMap.has(loopDateStr)) {
      btn.classList.add('has-data');
    }

    if (loopDateStr === selectedDateStr) {
      btn.classList.add('selected');
    }

    btn.onclick = () => {
      selectedDate = loopDate;
      renderCalendar();
      loadSelectedDayUI();
    };

    grid.appendChild(btn);
  }
}

// --- INPUT HANDLING ---
function setupInputListener() {
  document.getElementById('calorie-input').addEventListener('input', updateStatusText);
}

function updateStatusText() {
  const val = parseInt(document.getElementById('calorie-input').value);
  const statusEl = document.getElementById('status-text');

  if (isNaN(val)) {
    statusEl.innerHTML = `<span style="color: var(--text-muted)">Daily target: ${daily_cal_target}</span>`;
    return;
  }

  const diff = daily_cal_target - val;
  if (diff > 0) {
    statusEl.innerHTML = `<span class="deficit-text">${diff} kcal deficit</span>`;
  } else if (diff < 0) {
    statusEl.innerHTML = `<span class="surplus-text">${Math.abs(diff)} kcal surplus</span>`;
  } else {
    statusEl.innerHTML = `<span class="deficit-text">Perfect Maintenance</span>`;
  }
}

// --- CRUD OPERATIONS ---
function saveData() {
  const inputVal = parseInt(document.getElementById('calorie-input').value);
  if (isNaN(inputVal)) return;

  const dateStr = formatDate(selectedDate);
  const transaction = db.transaction(["DailyEntries"], "readwrite");
  const store = transaction.objectStore("DailyEntries");

  store.put({ date: dateStr, consumed: inputVal });

  transaction.oncomplete = () => loadAllData();
}

function resetData() {
  const dateStr = formatDate(selectedDate);
  const transaction = db.transaction(["DailyEntries"], "readwrite");
  const store = transaction.objectStore("DailyEntries");

  store.delete(dateStr);

  transaction.oncomplete = () => {
    document.getElementById('calorie-input').value = '';
    loadAllData();
  };
}

// --- UTILITIES ---
function formatDate(d) {
  const offset = d.getTimezoneOffset();
  d = new Date(d.getTime() - (offset * 60 * 1000));
  return d.toISOString().split('T')[0];
}

function updateHeaderDate() {
  const today = new Date();
  const day = today.getDate();
  const monthStr = today.toLocaleString('default', { month: 'long' });

  const getOrdinal = (n) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  document.getElementById('header-date').innerText = `${getOrdinal(day)} ${monthStr}`;
}