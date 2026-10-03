// ===== Constants & State =====
const STORAGE_KEY = 'ebv_transactions';
const THEME_KEY = 'ebv_theme';
const LIMIT_KEY = 'ebv_limit';
const CATEGORY_COLORS = { Food: '#22c55e', Transport: '#3b82f6', Fun: '#f97316' };

// ===== Storage helpers (safe) =====
function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

function store(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('Local Storage unavailable:', e);
  }
}

let transactions = load(STORAGE_KEY, []);
let limit = Number(load(LIMIT_KEY, 0)) || 0;
let chart = null;

// ===== DOM =====
const form = document.getElementById('transaction-form');
const nameInput = document.getElementById('item-name');
const amountInput = document.getElementById('amount');
const categoryInput = document.getElementById('category');
const errorEl = document.getElementById('form-error');
const listEl = document.getElementById('transaction-list');
const emptyEl = document.getElementById('empty-msg');
const balanceEl = document.getElementById('total-balance');
const sortEl = document.getElementById('sort');
const limitEl = document.getElementById('limit');
const themeBtn = document.getElementById('theme-toggle');

// ===== Helpers =====
const formatMoney = (n) => '$' + n.toFixed(2);

function getSorted() {
  const list = [...transactions];
  switch (sortEl.value) {
    case 'amount-desc': return list.sort((a, b) => b.amount - a.amount);
    case 'amount-asc': return list.sort((a, b) => a.amount - b.amount);
    case 'category': return list.sort((a, b) => a.category.localeCompare(b.category));
    default: return list.sort((a, b) => b.id - a.id);
  }
}

// ===== Rendering =====
function renderBalance() {
  const total = transactions.reduce((sum, t) => sum + t.amount, 0);
  balanceEl.textContent = formatMoney(total);
}

function renderList() {
  listEl.innerHTML = '';
  emptyEl.style.display = transactions.length ? 'none' : 'block';

  getSorted().forEach((t) => {
    const li = document.createElement('li');
    li.className = 'item' + (limit > 0 && t.amount > limit ? ' over-limit' : '');

    const info = document.createElement('div');
    const name = document.createElement('div');
    name.className = 'item-name';
    name.textContent = t.name;
    const amount = document.createElement('div');
    amount.className = 'item-amount';
    amount.textContent = formatMoney(t.amount);
    const cat = document.createElement('div');
    cat.className = 'item-category';
    cat.textContent = t.category;
    info.append(name, amount, cat);

    const del = document.createElement('button');
    del.className = 'btn-delete';
    del.type = 'button';
    del.textContent = 'Delete';
    del.addEventListener('click', () => deleteTransaction(t.id));

    li.append(info, del);
    listEl.appendChild(li);
  });
}

function renderChart() {
  if (typeof Chart === 'undefined') return; // Chart.js failed to load

  const labels = Object.keys(CATEGORY_COLORS);
  const data = labels.map((c) =>
    transactions.filter((t) => t.category === c).reduce((s, t) => s + t.amount, 0)
  );
  const textColor =
    document.documentElement.getAttribute('data-theme') === 'dark' ? '#f9fafb' : '#1f2937';

  if (!chart) {
    chart = new Chart(document.getElementById('chart'), {
      type: 'pie',
      data: {
        labels,
        datasets: [{ data, backgroundColor: labels.map((c) => CATEGORY_COLORS[c]) }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: textColor } } },
      },
    });
  } else {
    chart.data.datasets[0].data = data;
    chart.options.plugins.legend.labels.color = textColor;
    chart.update();
  }
}

function render() {
  renderBalance();
  renderList();
  try {
    renderChart();
  } catch (e) {
    console.warn('Chart error:', e);
  }
}

// ===== Actions =====
function addTransaction(e) {
  e.preventDefault();
  const name = nameInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const category = categoryInput.value;

  if (!name || isNaN(amount) || amount <= 0 || !category) {
    errorEl.textContent = 'Please fill in all fields with a valid amount.';
    return;
  }

  errorEl.textContent = '';
  transactions.push({ id: Date.now(), name, amount, category });
  store(STORAGE_KEY, transactions);
  form.reset();
  render();
}

function deleteTransaction(id) {
  transactions = transactions.filter((t) => t.id !== id);
  store(STORAGE_KEY, transactions);
  render();
}

// ===== Dark / Light mode =====
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  store(THEME_KEY, theme);
  render();
}

themeBtn.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

// ===== Events & Init =====
form.addEventListener('submit', addTransaction);
sortEl.addEventListener('change', renderList);
limitEl.addEventListener('input', () => {
  limit = parseFloat(limitEl.value) || 0;
  store(LIMIT_KEY, limit);
  renderList();
});

limitEl.value = limit || '';
applyTheme(load(THEME_KEY, 'light'));