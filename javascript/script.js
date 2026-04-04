/**
 * CIC Investment Club Webpage Script
 * Optimized for performance and modular component loading.
 */

document.addEventListener('DOMContentLoaded', () => {
  "use strict";

  // --- INITIALIZE THEME ---
  const savedTheme = localStorage.getItem('theme') || 'light';
  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  // --- COMPONENT LOADER ---
  const sections = [
    { id: 'nav-container', file: '../sections/nav.html' },
    { id: 'ticker-container', file: '../sections/ticker.html' },
    { id: 'hero-container', file: '../sections/hero.html' },
    { id: 'about-container', file: '../sections/about.html' },
    { id: 'team-container', file: '../sections/team.html' },
    { id: 'activities-container', file: '../sections/activities.html' },
    { id: 'events-container', file: '../sections/events.html' },
    { id: 'insights-container', file: '../sections/insights.html' },
    { id: 'tools-container', file: '../sections/tools.html' },
    { id: 'gallery-container', file: '../sections/gallery.html' },
    { id: 'resources-container', file: '../sections/resources.html' },
    { id: 'recruitment-container', file: '../sections/recruitment.html' },
    { id: 'contact-container', file: '../sections/contact.html' },
    { id: 'footer-container', file: '../sections/footer.html' }
  ];

  async function loadComponent({ id, file }) {
    try {
      const response = await fetch(`./html/sections/${file}`);
      if (!response.ok) throw new Error(`Could not load ${file}`);
      const html = await response.text();
      document.getElementById(id).innerHTML = html;
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  // Load all components, then initialize logic
  Promise.all(sections.map(loadComponent)).then(() => {
    document.body.classList.remove('is-loading');
    initializeSiteLogic();
  });

  function initializeSiteLogic() {
    // --- CONFIGURATION ---
    const INDICES = [
      { symbol: '^GSPC', label: 'S&P 500' },
      { symbol: '^DJI',  label: 'DOW JONES' },
      { symbol: '^IXIC', label: 'NASDAQ' },
      { symbol: '^RUT',  label: 'RUSSELL 2000' },
      { symbol: '^VIX',  label: 'VIX' },
      { symbol: '^TNX',  label: '10-YR YIELD' },
    ];

    // --- TICKER LOGIC ---
    const tickerTrack = document.getElementById('ticker');

    function formatPrice(val, symbol) {
      if (symbol === '^TNX') return val.toFixed(3) + '%';
      if (val >= 10000) return val.toLocaleString('en-US', { maximumFractionDigits: 2 });
      return val.toFixed(2);
    }

    function buildTickerHTML(items) {
      const content = items.map(({ label, price, changePct, up }) => {
        const dir = up ? '▲' : '▼';
        const cls = up ? 'up' : 'down';
        const sign = up ? '+' : '';
        return `
          <span class="ticker-item">
            <span class="ticker-symbol">${label}</span>
            <span class="ticker-price">${price}</span>
            <span class="ticker-change ${cls}">${dir} ${sign}${changePct}%</span>
          </span>`;
      }).join('');
      return content + content; // Duplicate for seamless looping
    }

    async function fetchIndex(symbol) {
      try {
        const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1d`;
        const proxy = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
        const res = await fetch(proxy);
        if (!res.ok) throw new Error('Proxy error');
        const outer = await res.json();
        const data = JSON.parse(outer.contents);
        const meta = data.chart.result[0].meta;
        const price = meta.regularMarketPrice;
        const prev = meta.chartPreviousClose || meta.previousClose;
        const change = price - prev;
        const changePct = ((change / prev) * 100).toFixed(2);

        return {
          label: INDICES.find(i => i.symbol === symbol)?.label || symbol,
          price: formatPrice(price, symbol),
          changePct,
          up: change >= 0,
        };
      } catch (err) {
        console.warn(`Failed to fetch ${symbol}:`, err);
        return null;
      }
    }

    async function loadTicker() {
      if (!tickerTrack) return;
      const results = (await Promise.all(INDICES.map(i => fetchIndex(i.symbol)))).filter(Boolean);
      
      if (results.length > 0) {
        tickerTrack.innerHTML = buildTickerHTML(results);
        tickerTrack.style.animationDuration = `${results.length * 6}s`;
      } else {
        tickerTrack.innerHTML = '<span class="ticker-error">Market data temporarily unavailable.</span>';
      }
    }

    loadTicker();
    setInterval(loadTicker, 5 * 60 * 1000);

    // --- SCROLL REVEAL ---
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    // --- FORM SUBMISSION (AJAX) ---
    const recruitmentForm = document.querySelector('#recruitment form');
    if (recruitmentForm) {
      recruitmentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;
        const button = form.querySelector('button[type="submit"]');
        const originalText = button.innerHTML;

        const inputs = form.querySelectorAll('input[required], select[required]');
        let isValid = true;
        inputs.forEach(input => {
          if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = '#F87171';
          } else {
            input.style.borderColor = '';
          }
        });

        if (!isValid) {
          button.innerHTML = '⚠ Please fill all fields';
          button.style.background = '#F87171';
          setTimeout(() => { 
            button.innerHTML = originalText;
            button.style.background = '';
          }, 2000);
          return;
        }

        button.disabled = true;
        button.innerHTML = '⌛ Submitting...';

        try {
          const formData = new FormData(form);
          const response = await fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
          });

          if (response.ok) {
            button.innerHTML = '✓ Application Sent!';
            button.style.background = '#4ADE80';
            button.style.color = '#14532D';
            form.reset();
          } else {
            throw new Error('Submission failed');
          }
        } catch (err) {
          button.disabled = false;
          button.innerHTML = '❌ Error. Try again?';
          button.style.background = '#F87171';
          setTimeout(() => { button.innerHTML = originalText; button.style.background = ''; }, 3000);
        }
      });
    }

    // --- NAVIGATION: SCROLL SPY & MOBILE MENU ---
    const sectionElements = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    const navElement = document.querySelector('nav');

    const highlightNav = () => {
      let current = '';
      const scrollPos = window.scrollY + 100;
      sectionElements.forEach(section => {
        if (scrollPos >= section.offsetTop) {
          current = section.getAttribute('id');
        }
      });
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
          link.classList.add('active');
        }
      });
    };

    window.addEventListener('scroll', highlightNav, { passive: true });

    // Mobile Menu Toggle
    const setupMobileMenu = () => {
      const navLinksContainer = document.querySelector('.nav-links');
      if (!navLinksContainer || !navElement) return;

      const toggleBtn = document.createElement('button');
      toggleBtn.className = 'mobile-menu-toggle';
      toggleBtn.innerHTML = '<span></span><span></span><span></span>';
      toggleBtn.setAttribute('aria-label', 'Toggle Navigation');
      
      navElement.appendChild(toggleBtn);

      toggleBtn.addEventListener('click', () => {
        navLinksContainer.classList.toggle('active');
        toggleBtn.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
      });

      navLinksContainer.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          navLinksContainer.classList.remove('active');
          toggleBtn.classList.remove('active');
          document.body.classList.remove('no-scroll');
        });
      });
    };

    setupMobileMenu();

    // --- BACK TO TOP ---
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
          backToTopBtn.classList.add('visible');
        } else {
          backToTopBtn.classList.remove('visible');
        }
      }, { passive: true });

      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // --- COMPOUND INTEREST CALCULATOR ---
    const calcInputs = {
      initial: document.getElementById('calc-initial'),
      monthly: document.getElementById('calc-monthly'),
      years: document.getElementById('calc-years'),
      rate: document.getElementById('calc-return'),
    };

    const calcDisplays = {
      years: document.getElementById('years-display'),
      rate: document.getElementById('return-display'),
      total: document.getElementById('calc-total'),
      contrib: document.getElementById('calc-contrib'),
      interest: document.getElementById('calc-interest'),
      chart: document.getElementById('calc-chart'),
    };

    let calcChart = null;

    function updateCalculator() {
      if (!calcInputs.initial) return;
      const P = parseFloat(calcInputs.initial.value) || 0;
      const PMT = parseFloat(calcInputs.monthly.value) || 0;
      const t = parseInt(calcInputs.years.value);
      const r = parseFloat(calcInputs.rate.value) / 100;
      const n = 12;
      
      // Calculate final results
      const nt = n * t;
      const rn = r / n;
      const total = P * Math.pow(1 + rn, nt) + PMT * ((Math.pow(1 + rn, nt) - 1) / rn);
      const totalContributions = P + (PMT * 12 * t);
      const totalInterest = total - totalContributions;

      // Update text displays
      calcDisplays.years.textContent = t;
      calcDisplays.rate.textContent = Math.round(r * 100);
      calcDisplays.total.textContent = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(total);
      calcDisplays.contrib.textContent = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(totalContributions);
      calcDisplays.interest.textContent = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(totalInterest);

      // --- Chart.js Integration ---
      const labels = [];
      const data = [];
      for (let i = 0; i <= t; i++) {
        labels.push(`Year ${i}`);
        const yearTotal = P * Math.pow(1 + rn, n * i) + PMT * ((Math.pow(1 + rn, n * i) - 1) / rn);
        data.push(Math.round(yearTotal));
      }

      if (calcChart) {
        calcChart.data.labels = labels;
        calcChart.data.datasets[0].data = data;
        calcChart.update('none'); // Update without animation for responsiveness
      } else if (calcDisplays.chart) {
        const ctx = calcDisplays.chart.getContext('2d');
        const goldGradient = ctx.createLinearGradient(0, 0, 0, 400);
        goldGradient.addColorStop(0, 'rgba(212, 175, 55, 0.4)');
        goldGradient.addColorStop(1, 'rgba(212, 175, 55, 0)');

        calcChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [{
              label: 'Total Balance',
              data: data,
              borderColor: '#d4af37',
              backgroundColor: goldGradient,
              fill: true,
              tension: 0.4,
              borderWidth: 3,
              pointRadius: 0,
              pointHoverRadius: 6,
              pointHoverBackgroundColor: '#d4af37',
              pointHoverBorderColor: '#fff',
              pointHoverBorderWidth: 2,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: 'rgba(10, 10, 10, 0.9)',
                titleFont: { family: 'DM Sans', size: 14 },
                bodyFont: { family: 'DM Mono', size: 12 },
                padding: 12,
                displayColors: false,
                callbacks: {
                  label: (context) => `Total: $${context.parsed.y.toLocaleString()}`
                }
              }
            },
            scales: {
              x: {
                grid: { display: false },
                ticks: { color: 'rgba(255,255,255,0.5)', font: { family: 'DM Mono', size: 10 } }
              },
              y: {
                grid: { color: 'rgba(255,255,255,0.05)' },
                ticks: { 
                  color: 'rgba(255,255,255,0.5)', 
                  font: { family: 'DM Mono', size: 10 },
                  callback: (value) => '$' + (value >= 1000 ? (value/1000).toFixed(0) + 'k' : value)
                }
              }
            }
          }
        });
      }
    }

    if (calcInputs.initial) {
      [calcInputs.initial, calcInputs.monthly, calcInputs.years, calcInputs.rate].forEach(input => {
        input.addEventListener('input', updateCalculator);
      });
      updateCalculator();
    }

    // --- STOCK WATCHLIST ---
    const watchlistInput = document.getElementById('watchlist-input');
    const watchlistAddBtn = document.getElementById('watchlist-add-btn');
    const watchlistItemsContainer = document.getElementById('watchlist-items');
    
    let watchlist = JSON.parse(localStorage.getItem('cic_watchlist')) || ['AAPL', 'NVDA', 'BTC-USD'];

    async function fetchStockData(symbol) {
      const proxy = 'https://api.allorigins.win/get?url=';
      const target = encodeURIComponent(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`);
      
      try {
        const response = await fetch(`${proxy}${target}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        if (!data || !data.contents) throw new Error('Empty proxy response');
        
        const parsed = JSON.parse(data.contents);
        if (!parsed.chart || !parsed.chart.result) throw new Error('Invalid Yahoo data');
        
        const result = parsed.chart.result[0];
        const price = result.meta.regularMarketPrice;
        const prevClose = result.meta.chartPreviousClose || result.meta.previousClose;
        
        if (price === undefined || prevClose === undefined) throw new Error('Missing price data');

        const change = price - prevClose;
        const changePercent = (change / prevClose) * 100;

        return {
          symbol: symbol.toUpperCase(),
          price: price.toFixed(2),
          change: change.toFixed(2),
          changePercent: changePercent.toFixed(2),
          isUp: change >= 0
        };
      } catch (error) {
        console.warn(`Error fetching data for ${symbol}:`, error);
        return null;
      }
    }

    async function renderWatchlist() {
      if (!watchlistItemsContainer) return;

      if (watchlist.length === 0) {
        watchlistItemsContainer.innerHTML = '<div class="watchlist-empty"><p>Your watchlist is empty. Add a symbol to start tracking.</p></div>';
        return;
      }

      // Show loading state
      const currentHTML = watchlistItemsContainer.innerHTML;
      if (!currentHTML || watchlistItemsContainer.querySelector('.watchlist-empty')) {
        watchlistItemsContainer.innerHTML = '<div class="watchlist-empty"><p>Updating prices...</p></div>';
      }
      
      const stocksData = await Promise.all(watchlist.map(symbol => fetchStockData(symbol)));
      
      watchlistItemsContainer.innerHTML = '';
      let hasValidStock = false;

      stocksData.forEach((stock) => {
        if (!stock) return;
        hasValidStock = true;
        
        const stockEl = document.createElement('div');
        stockEl.className = 'stock-item reveal';
        stockEl.innerHTML = `
          <div class="stock-main">
            <span class="stock-symbol">${stock.symbol}</span>
            <button class="stock-remove" data-symbol="${stock.symbol}" title="Remove">×</button>
          </div>
          <div class="stock-price-group">
            <span class="stock-price">$${stock.price}</span>
            <span class="stock-change ${stock.isUp ? 'up' : 'down'}">
              ${stock.isUp ? '▲' : '▼'} ${Math.abs(stock.change).toFixed(2)} (${Math.abs(stock.changePercent).toFixed(2)}%)
            </span>
          </div>
        `;
        watchlistItemsContainer.appendChild(stockEl);
        
        // Re-observe newly created elements
        if (typeof revealObserver !== 'undefined') {
          revealObserver.observe(stockEl);
        }
      });

      if (!hasValidStock && watchlist.length > 0) {
        watchlistItemsContainer.innerHTML = '<div class="watchlist-empty"><p>Could not fetch data for these symbols. Please check if they are correct.</p></div>';
      }

      // Add remove listeners
      document.querySelectorAll('.stock-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const symbolToRemove = e.target.getAttribute('data-symbol');
          watchlist = watchlist.filter(s => s !== symbolToRemove);
          localStorage.setItem('cic_watchlist', JSON.stringify(watchlist));
          renderWatchlist();
        });
      });
    }

    if (watchlistAddBtn) {
      watchlistAddBtn.addEventListener('click', async () => {
        const symbol = watchlistInput.value.trim().toUpperCase();
        if (!symbol) return;
        
        if (watchlist.includes(symbol)) {
          alert('This symbol is already in your watchlist.');
          return;
        }

        const originalBtnText = watchlistAddBtn.textContent;
        watchlistAddBtn.textContent = 'Verifying...';
        watchlistAddBtn.disabled = true;

        const isValid = await fetchStockData(symbol);
        
        if (isValid) {
          watchlist.push(symbol);
          localStorage.setItem('cic_watchlist', JSON.stringify(watchlist));
          watchlistInput.value = '';
          renderWatchlist();
        } else {
          alert(`Could not find symbol: ${symbol}. Please check the symbol and try again.`);
        }

        watchlistAddBtn.textContent = originalBtnText;
        watchlistAddBtn.disabled = false;
      });

      watchlistInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') watchlistAddBtn.click();
      });

      renderWatchlist();
      // Update every 60 seconds
      setInterval(renderWatchlist, 60000);
    }

    // --- DARK MODE TOGGLE ---
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';

    if (currentTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'dark') {
          document.documentElement.setAttribute('data-theme', 'light');
          localStorage.setItem('theme', 'light');
        } else {
          document.documentElement.setAttribute('data-theme', 'dark');
          localStorage.setItem('theme', 'dark');
        }
        
        // Update chart if it exists to adapt to new theme
        if (typeof updateCalculator === 'function') {
          // Force chart recreation to update gradients
          if (calcChart) {
            calcChart.destroy();
            calcChart = null;
          }
          updateCalculator();
        }
      });
    }
  }
});
