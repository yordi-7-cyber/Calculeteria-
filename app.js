// ===== THEME TOGGLE =====
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

function setTheme(t) {
  html.setAttribute('data-theme', t);
  themeToggle.textContent = t === 'dark' ? '🌙' : '☀️';
  localStorage.setItem('theme', t);
}

themeToggle.addEventListener('click', () => {
  setTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});

setTheme(localStorage.getItem('theme') || 'dark');

// ===== MODE TABS =====
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.mode-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('mode-' + tab.dataset.mode).classList.add('active');
  });
});

// ===== HISTORY =====
let history = JSON.parse(localStorage.getItem('calcHistory') || '[]');

function saveHistory(type, expr, result) {
  const entry = { type, expr, result, time: new Date().toLocaleString() };
  history.unshift(entry);
  if (history.length > 100) history.pop();
  localStorage.setItem('calcHistory', JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  const list = document.getElementById('historyList');
  if (!history.length) {
    list.innerHTML = '<div class="empty-history">No calculations yet 😴<br>Go crunch some numbers!</div>';
    return;
  }
  list.innerHTML = history.map(h => `
    <div class="history-item">
      <div class="h-type">${h.type}</div>
      <div class="h-expr">${h.expr}</div>
      <div class="h-result">= ${h.result}</div>
      <div class="h-time">${h.time}</div>
    </div>
  `).join('');
}

const historyBtn = document.getElementById('historyBtn');
const historyPanel = document.getElementById('historyPanel');
const closeHistory = document.getElementById('closeHistory');
const clearHistory = document.getElementById('clearHistory');

historyBtn.addEventListener('click', () => {
  historyPanel.classList.toggle('open');
  renderHistory();
});
closeHistory.addEventListener('click', () => historyPanel.classList.remove('open'));
clearHistory.addEventListener('click', () => {
  history = [];
  localStorage.removeItem('calcHistory');
  renderHistory();
});

renderHistory();

// ===== STANDARD CALCULATOR =====
let stdExpr = '';
let stdLastOp = false;

const stdExprEl = document.getElementById('stdExpr');
const stdResultEl = document.getElementById('stdResult');

function stdUpdate() {
  stdExprEl.textContent = stdExpr || '0';
}

function stdEval() {
  try {
    const expr = stdExpr.replace(/÷/g, '/').replace(/×/g, '*').replace(/−/g, '-');
    const result = Function('"use strict"; return (' + expr + ')')();
    if (!isFinite(result)) return 'Error';
    return parseFloat(result.toFixed(10)).toString();
  } catch { return 'Error'; }
}

document.querySelectorAll('#mode-standard .btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const action = btn.dataset.action;
    const val = btn.dataset.val;

    if (action === 'ac') { stdExpr = ''; stdLastOp = false; stdResultEl.textContent = ''; stdUpdate(); return; }
    if (action === 'sign') {
      if (stdExpr && !isNaN(stdExpr)) stdExpr = (parseFloat(stdExpr) * -1).toString();
      stdUpdate(); return;
    }
    if (action === 'percent') {
      if (stdExpr) stdExpr = (parseFloat(stdEval()) / 100).toString();
      stdUpdate(); return;
    }
    if (action === 'dot') {
      const parts = stdExpr.split(/[+\-×÷]/);
      const last = parts[parts.length - 1];
      if (!last.includes('.')) stdExpr += '.';
      stdUpdate(); return;
    }
    if (action === 'num') {
      if (stdLastOp) { stdLastOp = false; }
      stdExpr += val;
      stdResultEl.textContent = stdEval() !== stdExpr ? '= ' + stdEval() : '';
      stdUpdate(); return;
    }
    if (action === 'op') {
      if (!stdExpr) return;
      const ops = ['+', '-', '×', '÷'];
      const lastChar = stdExpr.slice(-1);
      if (ops.includes(lastChar)) stdExpr = stdExpr.slice(0, -1);
      stdExpr += val;
      stdLastOp = true;
      stdResultEl.textContent = '';
      stdUpdate(); return;
    }
    if (action === 'eq') {
      if (!stdExpr) return;
      const result = stdEval();
      saveHistory('Standard', stdExpr, result);
      stdExpr = result;
      stdResultEl.textContent = '';
      stdLastOp = false;
      stdUpdate(); return;
    }
  });
});

// ===== SCIENTIFIC CALCULATOR =====
let sciExpr = '';
let sciPendingOp = null;
let sciLastOp = false;

const sciExprEl = document.getElementById('sciExpr');
const sciResultEl = document.getElementById('sciResult');

function sciUpdate() { sciExprEl.textContent = sciExpr || '0'; }

function sciEval() {
  try {
    const expr = sciExpr.replace(/÷/g, '/').replace(/×/g, '*').replace(/−/g, '-');
    const result = Function('"use strict"; return (' + expr + ')')();
    if (!isFinite(result)) return 'Error';
    return parseFloat(result.toFixed(10)).toString();
  } catch { return 'Error'; }
}

function factorial(n) {
  n = Math.floor(Math.abs(n));
  if (n > 170) return Infinity;
  if (n <= 1) return 1;
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

document.querySelectorAll('#mode-scientific .btn-sci').forEach(btn => {
  btn.addEventListener('click', () => {
    const sci = btn.dataset.sci;
    const cur = parseFloat(sciEval());
    let result;
    const deg = cur * Math.PI / 180;

    switch (sci) {
      case 'sin': result = parseFloat(Math.sin(deg).toFixed(10)); sciExpr = result.toString(); break;
      case 'cos': result = parseFloat(Math.cos(deg).toFixed(10)); sciExpr = result.toString(); break;
      case 'tan': result = parseFloat(Math.tan(deg).toFixed(10)); sciExpr = result.toString(); break;
      case 'log': result = parseFloat(Math.log10(cur).toFixed(10)); sciExpr = result.toString(); break;
      case 'ln': result = parseFloat(Math.log(cur).toFixed(10)); sciExpr = result.toString(); break;
      case 'sqrt': result = parseFloat(Math.sqrt(cur).toFixed(10)); sciExpr = result.toString(); break;
      case 'cbrt': result = parseFloat(Math.cbrt(cur).toFixed(10)); sciExpr = result.toString(); break;
      case 'sq': result = cur * cur; sciExpr = result.toString(); break;
      case 'cube': result = cur * cur * cur; sciExpr = result.toString(); break;
      case 'inv': result = parseFloat((1 / cur).toFixed(10)); sciExpr = result.toString(); break;
      case 'pi': sciExpr += Math.PI.toString(); sciUpdate(); return;
      case 'e': sciExpr += Math.E.toString(); sciUpdate(); return;
      case 'fact': result = factorial(cur); sciExpr = result.toString(); break;
      case 'pow': sciExpr += '**'; sciUpdate(); return;
      case 'abs': result = Math.abs(cur); sciExpr = result.toString(); break;
    }
    saveHistory('Scientific', sci + '(' + cur + ')', sciExpr);
    sciUpdate();
  });
});

document.querySelectorAll('#mode-scientific .btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const action = btn.dataset.action;
    const val = btn.dataset.val;
    if (!action || action.startsWith('sci-') === false) return;

    if (action === 'sci-ac') { sciExpr = ''; sciResultEl.textContent = ''; sciUpdate(); return; }
    if (action === 'sci-sign') {
      if (sciExpr && !isNaN(sciExpr)) sciExpr = (parseFloat(sciExpr) * -1).toString();
      sciUpdate(); return;
    }
    if (action === 'sci-percent') {
      if (sciExpr) sciExpr = (parseFloat(sciEval()) / 100).toString();
      sciUpdate(); return;
    }
    if (action === 'sci-dot') {
      const parts = sciExpr.split(/[+\-×÷\*\*]/);
      const last = parts[parts.length - 1];
      if (!last.includes('.')) sciExpr += '.';
      sciUpdate(); return;
    }
    if (action === 'sci-num') {
      sciExpr += val;
      sciResultEl.textContent = sciEval() !== sciExpr ? '= ' + sciEval() : '';
      sciUpdate(); return;
    }
    if (action === 'sci-op') {
      if (!sciExpr) return;
      const ops = ['+', '-', '×', '÷'];
      const lastChar = sciExpr.slice(-1);
      if (ops.includes(lastChar)) sciExpr = sciExpr.slice(0, -1);
      sciExpr += val;
      sciResultEl.textContent = '';
      sciUpdate(); return;
    }
    if (action === 'sci-eq') {
      if (!sciExpr) return;
      const result = sciEval();
      saveHistory('Scientific', sciExpr, result);
      sciExpr = result;
      sciResultEl.textContent = '';
      sciUpdate(); return;
    }
  });
});

// ===== BMI CALCULATOR =====
let bmiIsMetric = true;

document.getElementById('bmiMetric').addEventListener('click', () => {
  bmiIsMetric = true;
  document.getElementById('bmiMetric').classList.add('active');
  document.getElementById('bmiImperial').classList.remove('active');
  document.getElementById('weightUnit').textContent = 'kg';
  document.getElementById('heightUnit').textContent = 'cm';
  document.getElementById('bmiResult').style.display = 'none';
});

document.getElementById('bmiImperial').addEventListener('click', () => {
  bmiIsMetric = false;
  document.getElementById('bmiImperial').classList.add('active');
  document.getElementById('bmiMetric').classList.remove('active');
  document.getElementById('weightUnit').textContent = 'lb';
  document.getElementById('heightUnit').textContent = 'in';
  document.getElementById('bmiResult').style.display = 'none';
});

document.getElementById('calcBmi').addEventListener('click', () => {
  let weight = parseFloat(document.getElementById('bmiWeight').value);
  let height = parseFloat(document.getElementById('bmiHeight').value);
  const age = parseInt(document.getElementById('bmiAge').value) || null;

  if (!weight || !height || weight <= 0 || height <= 0) {
    alert('Yo! Enter valid weight and height first 😅');
    return;
  }

  if (!bmiIsMetric) {
    weight = weight * 0.453592;
    height = height * 2.54;
  }

  const heightM = height / 100;
  const bmi = weight / (heightM * heightM);
  const bmiRounded = parseFloat(bmi.toFixed(1));

  let label, color, advice;
  if (bmi < 18.5) {
    label = 'Underweight 🦴'; color = '#60a5fa';
    advice = 'You might wanna eat a bit more, buddy. Your bones are showing! Try adding more protein and healthy fats to your diet.';
  } else if (bmi < 25) {
    label = 'Normal Weight 🏆'; color = '#4ade80';
    advice = 'You\'re absolutely killing it! Your weight is in the healthy range. Keep doing whatever you\'re doing — it\'s working!';
  } else if (bmi < 30) {
    label = 'Overweight 🍔'; color = '#f5c518';
    advice = 'A little extra padding never hurt anyone, but maybe ease up on the midnight snacks. Some cardio and balanced meals will do wonders!';
  } else if (bmi < 35) {
    label = 'Obese Class I 🛋️'; color = '#f97316';
    advice = 'Time to get off that couch! Consult a doctor for a personalized plan. Small changes add up — start with a 20-min walk daily.';
  } else {
    label = 'Obese Class II+ 🚨'; color = '#f87171';
    advice = 'Please talk to a healthcare professional ASAP. Your health is the priority. You\'ve got this — one step at a time!';
  }

  // BMI bar position (range 10-45 mapped to 0-100%)
  const pct = Math.min(Math.max(((bmi - 10) / 35) * 100, 2), 98);

  document.getElementById('bmiScore').textContent = bmiRounded;
  document.getElementById('bmiScore').style.color = color;
  document.getElementById('bmiLabel').textContent = label;
  document.getElementById('bmiLabel').style.color = color;
  document.getElementById('bmiMarker').style.left = pct + '%';
  document.getElementById('bmiAdvice').textContent = advice;
  document.getElementById('bmiResult').style.display = 'block';

  const expr = `Weight: ${weight.toFixed(1)}kg, Height: ${heightM.toFixed(2)}m${age ? ', Age: ' + age : ''}`;
  saveHistory('BMI', expr, `${bmiRounded} (${label})`);
});

// ===== CURRENCY CONVERTER =====
// All rates relative to USD — April 2026 approximate mid-market rates
const rates = {
  // 🇪🇹 Ethiopia & East Africa — FIRST because we rep Addis!
  ETB: 156.0,   // 🇪🇹 Ethiopian Birr  (1 USD ≈ 156 ETB)
  // African currencies
  KES: 129.5,   // 🇰🇪 Kenyan Shilling
  UGX: 3720,    // 🇺🇬 Ugandan Shilling
  TZS: 2680,    // 🇹🇿 Tanzanian Shilling
  RWF: 1380,    // 🇷🇼 Rwandan Franc
  DJF: 177.7,   // 🇩🇯 Djiboutian Franc (neighbor!)
  SOS: 571,     // 🇸🇴 Somali Shilling  (neighbor!)
  EGP: 50.5,    // 🇪🇬 Egyptian Pound
  NGN: 1610,    // 🇳🇬 Nigerian Naira
  GHS: 15.8,    // 🇬🇭 Ghanaian Cedi
  ZAR: 18.6,    // 🇿🇦 South African Rand
  MAD: 9.95,    // 🇲🇦 Moroccan Dirham
  XOF: 603,     // 🌍 West African CFA Franc
  XAF: 603,     // 🌍 Central African CFA Franc
  SDG: 601,     // 🇸🇩 Sudanese Pound   (neighbor!)
  // Major world currencies
  USD: 1,       // 🇺🇸 US Dollar
  EUR: 0.92,    // 🇪🇺 Euro
  GBP: 0.79,    // 🇬🇧 British Pound
  AED: 3.67,    // 🇦🇪 UAE Dirham (popular for Ethiopian diaspora)
  SAR: 3.75,    // 🇸🇦 Saudi Riyal   (popular for Ethiopian diaspora)
  CNY: 7.24,    // 🇨🇳 Chinese Yuan
  JPY: 151.5,   // 🇯🇵 Japanese Yen
  INR: 83.4,    // 🇮🇳 Indian Rupee
  CAD: 1.36,    // 🇨🇦 Canadian Dollar
  AUD: 1.53,    // 🇦🇺 Australian Dollar
  CHF: 0.90,    // 🇨🇭 Swiss Franc
  KRW: 1340,    // 🇰🇷 South Korean Won
  BRL: 5.05,    // 🇧🇷 Brazilian Real
  MXN: 17.2,    // 🇲🇽 Mexican Peso
  IDR: 15800,   // 🇮🇩 Indonesian Rupiah
  TRY: 38.2,    // 🇹🇷 Turkish Lira
};

// Currency display names & flags
const currencyMeta = {
  ETB: { flag: '🇪🇹', name: 'Ethiopian Birr' },
  KES: { flag: '🇰🇪', name: 'Kenyan Shilling' },
  UGX: { flag: '🇺🇬', name: 'Ugandan Shilling' },
  TZS: { flag: '🇹🇿', name: 'Tanzanian Shilling' },
  RWF: { flag: '🇷🇼', name: 'Rwandan Franc' },
  DJF: { flag: '🇩🇯', name: 'Djiboutian Franc' },
  SOS: { flag: '🇸🇴', name: 'Somali Shilling' },
  EGP: { flag: '🇪🇬', name: 'Egyptian Pound' },
  NGN: { flag: '🇳🇬', name: 'Nigerian Naira' },
  GHS: { flag: '🇬🇭', name: 'Ghanaian Cedi' },
  ZAR: { flag: '🇿🇦', name: 'South African Rand' },
  MAD: { flag: '🇲🇦', name: 'Moroccan Dirham' },
  XOF: { flag: '🌍', name: 'West African CFA' },
  XAF: { flag: '🌍', name: 'Central African CFA' },
  SDG: { flag: '🇸🇩', name: 'Sudanese Pound' },
  USD: { flag: '🇺🇸', name: 'US Dollar' },
  EUR: { flag: '🇪🇺', name: 'Euro' },
  GBP: { flag: '🇬🇧', name: 'British Pound' },
  AED: { flag: '🇦🇪', name: 'UAE Dirham' },
  SAR: { flag: '🇸🇦', name: 'Saudi Riyal' },
  CNY: { flag: '🇨🇳', name: 'Chinese Yuan' },
  JPY: { flag: '🇯🇵', name: 'Japanese Yen' },
  INR: { flag: '🇮🇳', name: 'Indian Rupee' },
  CAD: { flag: '🇨🇦', name: 'Canadian Dollar' },
  AUD: { flag: '🇦🇺', name: 'Australian Dollar' },
  CHF: { flag: '🇨🇭', name: 'Swiss Franc' },
  KRW: { flag: '🇰🇷', name: 'South Korean Won' },
  BRL: { flag: '🇧🇷', name: 'Brazilian Real' },
  MXN: { flag: '🇲🇽', name: 'Mexican Peso' },
  IDR: { flag: '🇮🇩', name: 'Indonesian Rupiah' },
  TRY: { flag: '🇹🇷', name: 'Turkish Lira' },
};

// Build currency select options dynamically
function buildCurrencyOptions(selectId, defaultVal) {
  const sel = document.getElementById(selectId);
  sel.innerHTML = Object.keys(currencyMeta).map(code => {
    const m = currencyMeta[code];
    return `<option value="${code}" ${code === defaultVal ? 'selected' : ''}>${m.flag} ${code} — ${m.name}</option>`;
  }).join('');
}

buildCurrencyOptions('currFrom', 'ETB'); // Default FROM = Ethiopian Birr 🇪🇹
buildCurrencyOptions('currTo', 'USD');   // Default TO = USD

document.getElementById('calcCurr').addEventListener('click', () => {
  const amount = parseFloat(document.getElementById('currAmount').value);
  const from = document.getElementById('currFrom').value;
  const to = document.getElementById('currTo').value;

  if (!amount || isNaN(amount)) { alert('Enter a valid amount! 💸'); return; }

  const inUSD = amount / rates[from];
  const result = inUSD * rates[to];
  const rounded = parseFloat(result.toFixed(4));
  const rate = parseFloat((rates[to] / rates[from]).toFixed(6));

  document.getElementById('currResult').value = rounded;
  const fromMeta = currencyMeta[from];
  const toMeta = currencyMeta[to];
  document.getElementById('rateNote').textContent =
    `${fromMeta.flag} 1 ${from} = ${toMeta.flag} ${rate} ${to}  ·  Rates approximate, April 2026`;

  saveHistory('💸 Currency', `${amount} ${from} → ${to}`, `${rounded} ${to}`);
});

document.getElementById('swapCurr').addEventListener('click', () => {
  const fromSel = document.getElementById('currFrom');
  const toSel = document.getElementById('currTo');
  const tmp = fromSel.value;
  fromSel.value = toSel.value;
  toSel.value = tmp;
});

// ===== UNIT CONVERTER =====
const unitDefs = {
  length: {
    units: ['Meter', 'Kilometer', 'Mile', 'Foot', 'Inch', 'Centimeter', 'Millimeter', 'Yard', 'Nautical Mile'],
    toBase: { Meter:1, Kilometer:1000, Mile:1609.344, Foot:0.3048, Inch:0.0254, Centimeter:0.01, Millimeter:0.001, Yard:0.9144, 'Nautical Mile':1852 }
  },
  weight: {
    units: ['Kilogram', 'Gram', 'Pound', 'Ounce', 'Ton', 'Milligram', 'Stone'],
    toBase: { Kilogram:1, Gram:0.001, Pound:0.453592, Ounce:0.0283495, Ton:1000, Milligram:0.000001, Stone:6.35029 }
  },
  temp: {
    units: ['Celsius', 'Fahrenheit', 'Kelvin'],
    toBase: null // special handling
  },
  area: {
    units: ['Square Meter', 'Square Kilometer', 'Square Mile', 'Square Foot', 'Acre', 'Hectare', 'Square Inch'],
    toBase: { 'Square Meter':1, 'Square Kilometer':1e6, 'Square Mile':2589988.11, 'Square Foot':0.092903, Acre:4046.86, Hectare:10000, 'Square Inch':0.00064516 }
  },
  speed: {
    units: ['m/s', 'km/h', 'mph', 'knot', 'ft/s'],
    toBase: { 'm/s':1, 'km/h':0.277778, 'mph':0.44704, 'knot':0.514444, 'ft/s':0.3048 }
  }
};

let currentUType = 'length';

function populateUnitSelects(type) {
  const def = unitDefs[type];
  const fromSel = document.getElementById('unitFromSel');
  const toSel = document.getElementById('unitToSel');
  fromSel.innerHTML = def.units.map(u => `<option value="${u}">${u}</option>`).join('');
  toSel.innerHTML = def.units.map((u, i) => `<option value="${u}" ${i===1?'selected':''}>${u}</option>`).join('');
}

function convertTemp(val, from, to) {
  let celsius;
  if (from === 'Celsius') celsius = val;
  else if (from === 'Fahrenheit') celsius = (val - 32) * 5/9;
  else celsius = val - 273.15;

  if (to === 'Celsius') return celsius;
  if (to === 'Fahrenheit') return celsius * 9/5 + 32;
  return celsius + 273.15;
}

document.querySelectorAll('.utab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.utab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentUType = tab.dataset.utype;
    populateUnitSelects(currentUType);
    document.getElementById('unitTo').value = '';
  });
});

document.getElementById('calcUnit').addEventListener('click', () => {
  const val = parseFloat(document.getElementById('unitFrom').value);
  const from = document.getElementById('unitFromSel').value;
  const to = document.getElementById('unitToSel').value;

  if (isNaN(val)) { alert('Enter a value to convert! 📐'); return; }

  let result;
  if (currentUType === 'temp') {
    result = convertTemp(val, from, to);
  } else {
    const def = unitDefs[currentUType];
    result = (val * def.toBase[from]) / def.toBase[to];
  }

  const rounded = parseFloat(result.toFixed(8));
  document.getElementById('unitTo').value = rounded;
  saveHistory('Unit', `${val} ${from} → ${to}`, `${rounded} ${to}`);
});

document.getElementById('swapUnit').addEventListener('click', () => {
  const fromSel = document.getElementById('unitFromSel');
  const toSel = document.getElementById('unitToSel');
  const tmp = fromSel.value;
  fromSel.value = toSel.value;
  toSel.value = tmp;
  const fromVal = document.getElementById('unitFrom').value;
  const toVal = document.getElementById('unitTo').value;
  document.getElementById('unitFrom').value = toVal;
  document.getElementById('unitTo').value = fromVal;
});

// Init unit selects
populateUnitSelects('length');

// ===== KEYBOARD SUPPORT =====
document.addEventListener('keydown', e => {
  const activeMode = document.querySelector('.mode-panel.active').id;
  if (activeMode !== 'mode-standard' && activeMode !== 'mode-scientific') return;

  const prefix = activeMode === 'mode-standard' ? '' : 'sci-';
  const key = e.key;

  if (key >= '0' && key <= '9') {
    document.querySelector(`[data-action="${prefix}num"][data-val="${key}"]`)?.click();
  } else if (key === '+') document.querySelector(`[data-action="${prefix}op"][data-val="+"]`)?.click();
  else if (key === '-') document.querySelector(`[data-action="${prefix}op"][data-val="-"]`)?.click();
  else if (key === '*') document.querySelector(`[data-action="${prefix}op"][data-val="×"]`)?.click();
  else if (key === '/') { e.preventDefault(); document.querySelector(`[data-action="${prefix}op"][data-val="÷"]`)?.click(); }
  else if (key === 'Enter' || key === '=') document.querySelector(`[data-action="${prefix}eq"]`)?.click();
  else if (key === 'Backspace') {
    if (activeMode === 'mode-standard') { stdExpr = stdExpr.slice(0, -1); stdUpdate(); }
    else { sciExpr = sciExpr.slice(0, -1); sciUpdate(); }
  } else if (key === 'Escape') {
    if (activeMode === 'mode-standard') { stdExpr = ''; stdResultEl.textContent = ''; stdUpdate(); }
    else { sciExpr = ''; sciResultEl.textContent = ''; sciUpdate(); }
  } else if (key === '.') document.querySelector(`[data-action="${prefix}dot"]`)?.click();
  else if (key === '%') document.querySelector(`[data-action="${prefix}percent"]`)?.click();
});


// ===== AUTH SYSTEM =====
const authOverlay = document.getElementById('authOverlay');
const successFlash = document.getElementById('successFlash');
const userBadge = document.getElementById('userBadge');
const userAvatar = document.getElementById('userAvatar');
const userNameEl = document.getElementById('userName');

// Simple local user store
function getUsers() { return JSON.parse(localStorage.getItem('calcUsers') || '{}'); }
function saveUsers(u) { localStorage.setItem('calcUsers', JSON.stringify(u)); }
function getSession() { return JSON.parse(localStorage.getItem('calcSession') || 'null'); }
function saveSession(u) { localStorage.setItem('calcSession', JSON.stringify(u)); }
function clearSession() { localStorage.removeItem('calcSession'); }

function showApp(user) {
  authOverlay.classList.add('hidden');
  userBadge.style.display = 'flex';
  const initials = user.name ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2) : user.email[0].toUpperCase();
  userAvatar.textContent = initials;
  userNameEl.textContent = user.name || user.email.split('@')[0];
}

function flashSuccess(cb) {
  successFlash.classList.add('flash');
  setTimeout(() => { successFlash.classList.remove('flash'); if (cb) cb(); }, 400);
}

// Check existing session
const session = getSession();
if (session) {
  showApp(session);
} 

// Panel toggle
document.getElementById('goSignup').addEventListener('click', () => {
  document.getElementById('signinPanel').classList.add('hidden-panel');
  document.getElementById('signupPanel').classList.remove('hidden-panel');
  document.querySelector('.auth-title').textContent = 'JOIN THE CLUB';
  document.querySelector('.auth-subtitle').textContent = 'Create your free account';
});
document.getElementById('goSignin').addEventListener('click', () => {
  document.getElementById('signupPanel').classList.add('hidden-panel');
  document.getElementById('signinPanel').classList.remove('hidden-panel');
  document.querySelector('.auth-title').textContent = 'CALCEVERYTHING';
  document.querySelector('.auth-subtitle').textContent = 'Sign in to save your calculations';
});

// Password visibility toggles
document.getElementById('togglePwd').addEventListener('click', function() {
  const inp = document.getElementById('signinPassword');
  inp.type = inp.type === 'password' ? 'text' : 'password';
  this.textContent = inp.type === 'password' ? '👁' : '🙈';
});
document.getElementById('togglePwd2').addEventListener('click', function() {
  const inp = document.getElementById('signupPassword');
  inp.type = inp.type === 'password' ? 'text' : 'password';
  this.textContent = inp.type === 'password' ? '👁' : '🙈';
});

// Remember me toggle
let rememberMe = false;
document.getElementById('rememberToggle').addEventListener('click', () => {
  rememberMe = !rememberMe;
  document.getElementById('rememberTrack').classList.toggle('on', rememberMe);
});

// Forgot password
document.getElementById('forgotBtn').addEventListener('click', () => {
  const email = document.getElementById('signinEmail').value.trim();
  if (!email) { alert('Enter your email first, then click Forgot Password 😅'); return; }
  alert(`📧 If "${email}" exists, a reset link would be sent! (Demo mode — no real email)`);
});

// Social sign in (demo)
document.getElementById('googleBtn').addEventListener('click', () => {
  const user = { name: 'Google User', email: 'user@gmail.com', provider: 'google' };
  saveSession(user);
  flashSuccess(() => showApp(user));
});
document.getElementById('githubBtn').addEventListener('click', () => {
  const user = { name: 'GitHub User', email: 'user@github.com', provider: 'github' };
  saveSession(user);
  flashSuccess(() => showApp(user));
});

// Sign In
document.getElementById('signinForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const email = document.getElementById('signinEmail').value.trim();
  const password = document.getElementById('signinPassword').value;
  const errEl = document.getElementById('signinError');
  const btn = document.getElementById('signinSubmit');

  if (!email || !password) { errEl.textContent = 'Fill in all fields!'; errEl.classList.add('show'); return; }

  btn.classList.add('loading');
  btn.textContent = 'SIGNING IN';

  setTimeout(() => {
    const users = getUsers();
    const user = users[email];
    if (!user || user.password !== btoa(password)) {
      errEl.textContent = 'Wrong email or password. Try again!';
      errEl.classList.add('show');
      btn.classList.remove('loading');
      btn.textContent = 'SIGN IN';
      return;
    }
    errEl.classList.remove('show');
    if (rememberMe) saveSession(user);
    else saveSession(user); // always save for demo
    flashSuccess(() => showApp(user));
  }, 900);
});

// Sign Up
document.getElementById('signupForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value;
  const errEl = document.getElementById('signupError');
  const btn = document.getElementById('signupSubmit');

  if (!name || !email || !password) { errEl.textContent = 'Fill in all fields!'; errEl.classList.add('show'); return; }
  if (password.length < 6) { errEl.textContent = 'Password needs at least 6 characters!'; errEl.classList.add('show'); return; }
  if (!/\S+@\S+\.\S+/.test(email)) { errEl.textContent = 'That email looks sus 🤔'; errEl.classList.add('show'); return; }

  btn.classList.add('loading');
  btn.textContent = 'CREATING';

  setTimeout(() => {
    const users = getUsers();
    if (users[email]) {
      errEl.textContent = 'That email is already taken!';
      errEl.classList.add('show');
      btn.classList.remove('loading');
      btn.textContent = 'CREATE ACCOUNT 🚀';
      return;
    }
    const user = { name, email, password: btoa(password) };
    users[email] = user;
    saveUsers(users);
    saveSession({ name, email });
    errEl.classList.remove('show');
    flashSuccess(() => showApp({ name, email }));
  }, 900);
});

// Sign out
userBadge.addEventListener('click', () => {
  if (confirm('Sign out? Your history stays saved locally 👋')) {
    clearSession();
    userBadge.style.display = 'none';
    authOverlay.classList.remove('hidden');
    document.getElementById('signinEmail').value = '';
    document.getElementById('signinPassword').value = '';
  }
});
