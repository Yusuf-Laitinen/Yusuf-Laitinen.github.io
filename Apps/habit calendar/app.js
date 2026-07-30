
// --- CONFIGURATION & CONSTANTS ---
const daily_cal_target = 2700;
const historical_deficit_offset = 0; // Reset to 0 for a clean slate
const kcal_per_kg = 7700;

// --- STATE ---
let selectedDate = new Date();
let currentMonth = new Date();
currentMonth.setDate(1);
let allEntriesMap = new Map(); // DateString -> Consumed Amount
let currentGranularity = 'day';
let db;

// --- INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
  updateHeaderDate();
  setupInputListener();
  initDB();
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

    if (document.getElementById('page-trends').classList.contains('active')) {
      renderChart();
    }
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

// --- PAGE NAVIGATION ---
function goToPage(page) {
  document.getElementById('page-today').classList.toggle('active', page === 'today');
  document.getElementById('page-trends').classList.toggle('active', page === 'trends');
  if (page === 'trends') {
    renderChart();
  }
}

// --- MONTH NAVIGATION ---
function changeMonth(delta) {
  const next = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + delta, 1);
  const now = new Date();
  const realCurrent = new Date(now.getFullYear(), now.getMonth(), 1);
  if (next > realCurrent) return; // don't allow navigating into the future
  currentMonth = next;
  renderCalendar();
}

// --- CALENDAR LOGIC ---
function renderCalendar() {
  const grid = document.getElementById('calendar-grid');
  grid.innerHTML = '';

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  document.getElementById('month-label').innerText =
    currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

  const now = new Date();
  const realCurrent = new Date(now.getFullYear(), now.getMonth(), 1);
  document.getElementById('next-month-btn').classList.toggle('disabled', currentMonth.getTime() >= realCurrent.getTime());

  // Calculate start day (0 = Mon, ..., 6 = Sun) to align with UI mockup
  let startDay = new Date(year, month, 1).getDay();
  startDay = startDay === 0 ? 6 : startDay - 1;

  for (let i = 0; i < startDay; i++) {
    grid.appendChild(document.createElement('div'));
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
      const consumed = allEntriesMap.get(loopDateStr);
      btn.classList.add(consumed <= daily_cal_target ? 'day-deficit' : 'day-surplus');
    }
    if (loopDateStr === selectedDateStr) btn.classList.add('selected');

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

// --- EXPORT / IMPORT ---
function exportData() {
  const entries = Object.fromEntries(allEntriesMap);
  const payload = {
    app: 'DeficitTracker',
    version: 1,
    exportedAt: new Date().toISOString(),
    dailyTarget: daily_cal_target,
    entries
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `deficit-tracker-export-${formatDate(new Date())}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function triggerImport() {
  document.getElementById('import-file-input').click();
}

function handleImportFile(event) {
  const file = event.target.files[0];
  event.target.value = ''; // allow re-selecting the same file later
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    let entries;
    try {
      const data = JSON.parse(e.target.result);
      entries = (data && typeof data === 'object' && data.entries) ? data.entries : data;
    } catch (err) {
      alert('Could not read that file. Make sure it is a valid JSON export.');
      return;
    }

    const dateKeys = Object.keys(entries || {}).filter(k => /^\d{4}-\d{2}-\d{2}$/.test(k));
    if (dateKeys.length === 0) {
      alert('No valid entries found in that file.');
      return;
    }

    const transaction = db.transaction(["DailyEntries"], "readwrite");
    const store = transaction.objectStore("DailyEntries");
    let imported = 0;

    dateKeys.forEach(dateStr => {
      const consumed = parseInt(entries[dateStr]);
      if (!isNaN(consumed)) {
        store.put({ date: dateStr, consumed });
        imported++;
      }
    });

    transaction.oncomplete = () => {
      loadAllData();
      alert(`Imported ${imported} day${imported === 1 ? '' : 's'} of data.`);
    };
    transaction.onerror = () => {
      alert('Import failed. Please check the file and try again.');
    };
  };
  reader.readAsText(file);
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

// ================= TRENDS / GRAPH PAGE =================

function setGranularity(g) {
  currentGranularity = g;
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.gran === g);
  });
  renderChart();
}

function isoWeekKey(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = (d.getUTCDay() + 6) % 7; // Mon=0
  d.setUTCDate(d.getUTCDate() - dayNum + 3);
  const firstThursday = new Date(Date.UTC(d.getUTCFullYear(), 0, 4));
  const weekNum = 1 + Math.round(((d - firstThursday) / 86400000 - 3 + ((firstThursday.getUTCDay() + 6) % 7)) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNum).padStart(2, '0')}`;
}

// Build a time-ordered series of {label, deficit} at the chosen granularity.
// deficit = average daily (target - consumed) within that bucket.
function buildSeries(granularity) {
  const sortedDates = Array.from(allEntriesMap.keys()).sort();
  if (sortedDates.length === 0) return [];

  const buckets = new Map(); // key -> {sum, count, sortKey, label}

  sortedDates.forEach(dateStr => {
    const consumed = allEntriesMap.get(dateStr);
    const deficit = daily_cal_target - consumed;
    const d = new Date(dateStr + 'T00:00:00');

    let key, label, sortKey;
    if (granularity === 'day') {
      key = dateStr;
      sortKey = dateStr;
      label = d.toLocaleDateString('default', { day: 'numeric', month: 'short' });
    } else if (granularity === 'week') {
      key = isoWeekKey(d);
      sortKey = key;
      label = key.split('-W')[1] ? `Wk ${parseInt(key.split('-W')[1])}` : key;
    } else {
      key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      sortKey = key;
      label = d.toLocaleDateString('default', { month: 'short', year: '2-digit' });
    }

    if (!buckets.has(key)) buckets.set(key, { sum: 0, count: 0, sortKey, label });
    const b = buckets.get(key);
    b.sum += deficit;
    b.count += 1;
  });

  return Array.from(buckets.values())
    .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
    .map(b => ({ label: b.label, value: b.sum / b.count }));
}

// Simple trailing moving average smoothing.
function smoothSeries(series, windowSize) {
  return series.map((point, i) => {
    const start = Math.max(0, i - windowSize + 1);
    const slice = series.slice(start, i + 1);
    const avg = slice.reduce((s, p) => s + p.value, 0) / slice.length;
    return avg;
  });
}

// Least-squares linear regression over index -> value. Returns {slope, intercept}.
function linearRegression(values) {
  const n = values.length;
  if (n < 2) return { slope: 0, intercept: values[0] || 0 };
  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
  for (let i = 0; i < n; i++) {
    sumX += i; sumY += values[i]; sumXY += i * values[i]; sumXX += i * i;
  }
  const denom = (n * sumXX - sumX * sumX);
  const slope = denom === 0 ? 0 : (n * sumXY - sumX * sumY) / denom;
  const intercept = (sumY - slope * sumX) / n;
  return { slope, intercept };
}

function renderChart() {
  const wrap = document.getElementById('chart-wrap');
  const series = buildSeries(currentGranularity);

  // update active tab
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.gran === currentGranularity);
  });

  if (series.length === 0) {
    wrap.innerHTML = `<div class="empty-state">No data yet. Log a few days on the Today page to see your trend here.</div>`;
    document.getElementById('trend-summary').innerText = 'Log a few days to see your trend.';
    document.getElementById('trend-sub').innerText = '';
    return;
  }

  const windowSize = currentGranularity === 'day' ? 7 : currentGranularity === 'week' ? 3 : 2;
  const smoothed = smoothSeries(series, Math.min(windowSize, series.length));

  // Regression computed on the smoothed line (the "derivative of the smoothed snippet")
  // using the most recent portion of the data for a *current* rate of change.
  const recentCount = Math.max(3, Math.min(smoothed.length, currentGranularity === 'day' ? 14 : currentGranularity === 'week' ? 8 : 6));
  const recentSmoothed = smoothed.slice(smoothed.length - recentCount);
  const { slope, intercept } = linearRegression(recentSmoothed);
  const recentStartIndex = smoothed.length - recentCount;
  const trendAtStart = intercept + slope * 0;
  const trendAtEnd = intercept + slope * (recentCount - 1);

  // ---- SVG layout ----
  const W = 340, H = 200;
  const padL = 42, padR = 10, padT = 14, padB = 26;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const rawVals = series.map(p => p.value);
  const allVals = rawVals.concat(smoothed);
  let minV = Math.min(...allVals, 0);
  let maxV = Math.max(...allVals, 0);
  if (minV === maxV) { minV -= 100; maxV += 100; }
  const pad = (maxV - minV) * 0.12;
  minV -= pad; maxV += pad;

  const n = series.length;
  const xFor = i => n === 1 ? padL + plotW / 2 : padL + (i / (n - 1)) * plotW;
  const yFor = v => padT + plotH - ((v - minV) / (maxV - minV)) * plotH;

  // gridlines (4 horizontal bands)
  const gridCount = 4;
  let gridLines = '';
  let gridLabels = '';
  for (let g = 0; g <= gridCount; g++) {
    const v = minV + (g / gridCount) * (maxV - minV);
    const y = yFor(v);
    gridLines += `<line class="grid-line" x1="${padL}" y1="${y.toFixed(1)}" x2="${W - padR}" y2="${y.toFixed(1)}"/>`;
    gridLabels += `<text class="axis-label" x="${padL - 6}" y="${(y + 3).toFixed(1)}" text-anchor="end">${Math.round(v)}</text>`;
  }

  // zero line
  let zeroLine = '';
  if (minV < 0 && maxV > 0) {
    const y0 = yFor(0);
    zeroLine = `<line class="zero-line" x1="${padL}" y1="${y0.toFixed(1)}" x2="${W - padR}" y2="${y0.toFixed(1)}"/>`;
  }

  // x-axis labels (sparse: up to ~5 ticks)
  const tickEvery = Math.max(1, Math.ceil(n / 5));
  let xLabels = '';
  series.forEach((p, i) => {
    if (i % tickEvery === 0 || i === n - 1) {
      xLabels += `<text class="axis-label" x="${xFor(i).toFixed(1)}" y="${H - 6}" text-anchor="middle">${p.label}</text>`;
    }
  });

  // raw line + dots
  let rawPath = '';
  series.forEach((p, i) => {
    const x = xFor(i), y = yFor(p.value);
    rawPath += (i === 0 ? 'M' : 'L') + x.toFixed(1) + ',' + y.toFixed(1) + ' ';
  });
  let rawDots = '';
  series.forEach((p, i) => {
    rawDots += `<circle class="raw-dot" cx="${xFor(i).toFixed(1)}" cy="${yFor(p.value).toFixed(1)}" r="2"/>`;
  });

  // smoothed line
  let smoothPath = '';
  smoothed.forEach((v, i) => {
    const x = xFor(i), y = yFor(v);
    smoothPath += (i === 0 ? 'M' : 'L') + x.toFixed(1) + ',' + y.toFixed(1) + ' ';
  });

  // trend line, drawn only across the recent window used for the regression
  const trendX1 = xFor(recentStartIndex);
  const trendX2 = xFor(n - 1);
  const trendY1 = yFor(trendAtStart);
  const trendY2 = yFor(trendAtEnd);
  const trendPath = `M${trendX1.toFixed(1)},${trendY1.toFixed(1)} L${trendX2.toFixed(1)},${trendY2.toFixed(1)}`;

  wrap.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}">
      ${gridLines}
      ${zeroLine}
      <line class="axis-line" x1="${padL}" y1="${padT}" x2="${padL}" y2="${padT + plotH}"/>
      <line class="axis-line" x1="${padL}" y1="${padT + plotH}" x2="${W - padR}" y2="${padT + plotH}"/>
      ${gridLabels}
      ${xLabels}
      <path class="raw-line" d="${rawPath.trim()}"/>
      ${rawDots}
      <path class="smooth-line" d="${smoothPath.trim()}"/>
      <path class="trend-line" d="${trendPath}"/>
    </svg>
  `;

  // ---- Trend description ----
  const unit = currentGranularity === 'day' ? 'day' : currentGranularity === 'week' ? 'week' : 'month';
  const perDaySlope = currentGranularity === 'day' ? slope : currentGranularity === 'week' ? slope / 7 : slope / 30;
  const kgPerWeek = (perDaySlope * 7 / kcal_per_kg);

  const latestSmoothed = smoothed[smoothed.length - 1];
  const summaryEl = document.getElementById('trend-summary');
  const subEl = document.getElementById('trend-sub');

  const paceWord = latestSmoothed >= 0 ? 'deficit' : 'surplus';
  const paceClass = latestSmoothed >= 0 ? 'deficit' : 'surplus';
  const paceKcal = Math.abs(Math.round(latestSmoothed));

  let directionText;
  if (Math.abs(slope) < 1) {
    directionText = `and it's holding steady`;
  } else if (slope > 0) {
    directionText = `and deepening by about <span class="trend-rate deficit">${Math.abs(Math.round(perDaySlope))} kcal/day</span> each ${unit}`;
  } else {
    directionText = `and shrinking by about <span class="trend-rate surplus">${Math.abs(Math.round(perDaySlope))} kcal/day</span> each ${unit}`;
  }

  summaryEl.innerHTML = `Your smoothed average is currently a <span class="trend-rate ${paceClass}">${paceKcal} kcal/day ${paceWord}</span>, ${directionText}.`;

  const kgAbs = Math.abs(kgPerWeek).toFixed(2);
  let projectionText;
  if (Math.abs(slope) < 1) {
    projectionText = `At this steady pace, expect roughly ${(Math.abs(latestSmoothed) * 7 / kcal_per_kg).toFixed(2)} kg ${latestSmoothed >= 0 ? 'lost' : 'gained'} per week.`;
  } else {
    projectionText = `The trend line's slope implies your rate of ${latestSmoothed >= 0 ? 'loss' : 'gain'} is changing by about ${kgAbs} kg/week, per week — based on a linear fit to the last ${recentCount} ${unit}${recentCount > 1 ? 's' : ''} of the smoothed line.`;
  }
  subEl.innerText = projectionText;
}
