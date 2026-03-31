// ── TICKER: Yahoo Finance via allorigins proxy ──
const INDICES = [
  { symbol: '^GSPC',  label: 'S&P 500' },
  { symbol: '^DJI',   label: 'DOW JONES' },
  { symbol: '^IXIC',  label: 'NASDAQ' },
  { symbol: '^RUT',   label: 'RUSSELL 2000' },
  { symbol: '^VIX',   label: 'VIX' },
  { symbol: '^TNX',   label: '10-YR YIELD' },
];

function buildTickerHTML(items) {
  // Build one set, then duplicate for seamless loop
  const set = items.map(({ label, price, change, changePct, up }) => {
    const dir = up ? '▲' : '▼';
    const cls = up ? 'up' : 'down';
    const sign = up ? '+' : '';
    return `<span class="ticker-item">
      <span class="ticker-symbol">${label}</span>
      <span class="ticker-price">${price}</span>
      <span class="ticker-change ${cls}">${dir} ${sign}${changePct}%</span>
    </span>`;
  }).join('');
  return set + set; // duplicate for infinite scroll
}

function formatPrice(val, symbol) {
  if (symbol === '^TNX') return val.toFixed(3) + '%';
  if (val >= 10000) return val.toLocaleString('en-US', { maximumFractionDigits: 2 });
  return val.toFixed(2);
}

async function fetchIndex(symbol) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1d`;
  const proxy = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
  const res = await fetch(proxy);
  const outer = await res.json();
  const data = JSON.parse(outer.contents);
  const meta = data.chart.result[0].meta;
  const price = meta.regularMarketPrice;
  const prev  = meta.chartPreviousClose || meta.previousClose;
  const change = price - prev;
  const changePct = ((change / prev) * 100).toFixed(2);
  return {
    label: INDICES.find(i => i.symbol === symbol)?.label || symbol,
    price: formatPrice(price, symbol),
    change: change.toFixed(2),
    changePct,
    up: change >= 0,
  };
}

async function loadTicker() {
  try {
    const results = await Promise.all(INDICES.map(i => fetchIndex(i.symbol)));
    const track = document.getElementById('ticker');
    track.innerHTML = buildTickerHTML(results);
    // Adjust animation speed based on content width
    track.style.animationDuration = (results.length * 6) + 's';
  } catch (err) {
    const track = document.getElementById('ticker');
    track.innerHTML = `<span style="color:rgba(255,255,255,0.4);font-family:var(--font-mono);font-size:0.76rem;padding:0 2rem;">
      Market data unavailable — please check back later.
    </span>`;
    console.warn('Ticker load failed:', err);
  }
}

loadTicker();
// Refresh every 5 minutes
setInterval(loadTicker, 5 * 60 * 1000);

// ── SCROLL REVEAL ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Form submit handler
function handleSubmit(btn) {
  const inputs = btn.closest('.recruitment-form-card').querySelectorAll('input, select');
  let valid = true;
  inputs.forEach(i => { if (!i.value) valid = false; });
  if (!valid) {
    btn.textContent = '⚠ Please fill out all fields';
    btn.style.background = '#F87171';
    btn.style.color = 'white';
    setTimeout(() => { btn.textContent = 'Submit Application →'; btn.style.background = ''; btn.style.color = ''; }, 2000);
    return;
  }
  btn.textContent = '✓ Submitted! We\'ll be in touch soon.';
  btn.style.background = '#4ADE80';
  btn.style.color = '#14532D';
  btn.disabled = true;
}

// Active nav link highlight on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current
      ? 'var(--gold-light)' : '';
  });
}, { passive: true });