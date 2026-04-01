/**
 * CIC Investment Club Webpage Script
 * Optimized for performance and modular component loading.
 */

document.addEventListener('DOMContentLoaded', () => {
  "use strict";

  // --- COMPONENT LOADER ---
  const sections = [
    { id: 'nav-container', file: 'nav.html' },
    { id: 'ticker-container', file: 'ticker.html' },
    { id: 'hero-container', file: 'hero.html' },
    { id: 'about-container', file: 'about.html' },
    { id: 'team-container', file: 'team.html' },
    { id: 'activities-container', file: 'activities.html' },
    { id: 'events-container', file: 'events.html' },
    { id: 'insights-container', file: 'insights.html' },
    { id: 'tools-container', file: 'tools.html' },
    { id: 'gallery-container', file: 'gallery.html' },
    { id: 'resources-container', file: 'resources.html' },
    { id: 'recruitment-container', file: 'recruitment.html' },
    { id: 'contact-container', file: 'contact.html' },
    { id: 'footer-container', file: 'footer.html' }
  ];

  async function loadComponent({ id, file }) {
    try {
      const response = await fetch(`./sections/${file}`);
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
    };

    function updateCalculator() {
      if (!calcInputs.initial) return;
      const P = parseFloat(calcInputs.initial.value) || 0;
      const PMT = parseFloat(calcInputs.monthly.value) || 0;
      const t = parseInt(calcInputs.years.value);
      const r = parseFloat(calcInputs.rate.value) / 100;
      const n = 12;
      const nt = n * t;
      const rn = r / n;
      const principalGrowth = P * Math.pow(1 + rn, nt);
      const contributionsGrowth = PMT * ((Math.pow(1 + rn, nt) - 1) / rn);
      const total = principalGrowth + contributionsGrowth;
      const totalContributions = P + (PMT * 12 * t);
      const totalInterest = total - totalContributions;

      calcDisplays.years.textContent = t;
      calcDisplays.rate.textContent = Math.round(r * 100);
      calcDisplays.total.textContent = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(total);
      calcDisplays.contrib.textContent = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(totalContributions);
      calcDisplays.interest.textContent = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(totalInterest);
    }

    if (calcInputs.initial) {
      [calcInputs.initial, calcInputs.monthly, calcInputs.years, calcInputs.rate].forEach(input => {
        input.addEventListener('input', updateCalculator);
      });
      updateCalculator();
    }
  }
});
