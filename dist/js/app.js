/* ============================================================
   VERA HERITAGE — Main Application JS
   Handles: animations, scroll effects, counters, particles, nav
   ============================================================ */

'use strict';

/* --- Dark Mode --- */
(function() {
  const saved = localStorage.getItem('vera-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (saved === 'dark' || (!saved && prefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();

function toggleDarkMode() {
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  localStorage.setItem('vera-theme', isDark ? 'light' : 'dark');
}

/* --- Page Loader --- */
window.addEventListener('load', () => {
  const loader = document.getElementById('pageLoader');
  if (loader) {
    setTimeout(() => loader.classList.add('hidden'), 800);
    setTimeout(() => { loader.style.display = 'none'; }, 1500);
  }
  initAll();
});

function initAll() {
  initNav();
  initScrollAnimations();
  initCounters();
  initParticles();
  initHeroAnimations();
  initDestBars();
}

/* --- Navigation scroll behaviour --- */
function initNav() {
  const nav = document.getElementById('mainNav');
  if (!nav) return;

  const isHeroPage = document.getElementById('hero') !== null;

  function updateNav() {
    const scrolled = window.scrollY > 60;
    if (isHeroPage) {
      nav.classList.toggle('scrolled', scrolled);
      nav.classList.toggle('dark', !scrolled);
    } else {
      nav.classList.add('scrolled');
    }
  }

  updateNav();
  window.addEventListener('scroll', updateNav, { passive: true });
}

/* --- Intersection Observer for scroll animations --- */
function initScrollAnimations() {
  const options = { threshold: 0.12, rootMargin: '0px 0px -40px 0px' };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        // Stagger children if parent has .stagger
        if (entry.target.classList.contains('stagger')) {
          const children = entry.target.children;
          Array.from(children).forEach((child, i) => {
            child.style.animationDelay = `${i * 0.1}s`;
          });
        }
        observer.unobserve(entry.target);
      }
    });
  }, options);

  const targets = document.querySelectorAll(
    '.fade-up, .scale-in, .text-reveal, .char-animate, .stagger, .section-eyebrow, .section-title'
  );
  targets.forEach(el => observer.observe(el));
}

/* --- Animated counters --- */
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));
}

function animateCounter(el) {
  const target = parseFloat(el.dataset.target || el.textContent);
  const duration = 2000;
  const start = performance.now();
  const isFloat = String(target).includes('.');

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = target * eased;
    el.textContent = isFloat
      ? current.toFixed(1)
      : Math.round(current).toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = isFloat ? target.toFixed(1) : target.toLocaleString();
  }

  requestAnimationFrame(update);
}

/* --- Floating particles (hero) --- */
function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const count = 20;
  const colors = ['#C9A84C', '#8B5BC7', '#DFC075', '#AB82DC', '#fff'];

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 4 + 2;
    p.style.cssText = `
      width:${size}px;
      height:${size}px;
      left:${Math.random() * 100}%;
      bottom:-10px;
      background:${colors[Math.floor(Math.random() * colors.length)]};
      animation-delay:${Math.random() * 8}s;
      animation-duration:${6 + Math.random() * 6}s;
    `;
    container.appendChild(p);
  }
}

/* --- Hero text stagger animations --- */
function initHeroAnimations() {
  // Stagger hero elements in
  const order = ['heroEyebrow', 'heroHeadline', 'heroSub', 'heroCtas', 'heroLogo'];
  order.forEach((id, i) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    setTimeout(() => {
      el.style.transition = 'opacity 0.8s ease, transform 0.8s cubic-bezier(0,0.6,0.4,1)';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 300 + i * 150);
  });

  // Hero stat pills
  const pills = document.querySelectorAll('.hero-stat-pill');
  pills.forEach((pill, i) => {
    pill.style.opacity = '0';
    pill.style.transform = 'translateY(16px)';
    setTimeout(() => {
      pill.style.transition = 'opacity 0.7s ease, transform 0.7s cubic-bezier(0,0.6,0.4,1)';
      pill.style.opacity = '1';
      pill.style.transform = 'translateY(0)';
    }, 1000 + i * 180);
  });
}

/* --- Destination bars animate in --- */
function initDestBars() {
  const bars = document.querySelectorAll('.dest-fill');
  if (!bars.length) return;

  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const width = target.style.width;
        target.style.width = '0';
        setTimeout(() => {
          target.style.transition = 'width 1.2s cubic-bezier(0,0.6,0.4,1)';
          target.style.width = width;
        }, 200);
        barObserver.unobserve(target);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => barObserver.observe(bar));
}

/* --- Progress bar animation --- */
document.addEventListener('DOMContentLoaded', () => {
  const fills = document.querySelectorAll('.progress-fill, .attr-fill');
  const fillObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const w = el.style.width;
        el.style.width = '0';
        requestAnimationFrame(() => {
          setTimeout(() => {
            el.style.transition = 'width 1s cubic-bezier(0,0.6,0.4,1)';
            el.style.width = w;
          }, 100);
        });
        fillObs.unobserve(el);
      }
    });
  }, { threshold: 0.4 });
  fills.forEach(f => fillObs.observe(f));
});

/* --- Smooth scroll for anchor links --- */
document.addEventListener('click', e => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  const id = link.getAttribute('href').slice(1);
  const target = document.getElementById(id);
  if (target) {
    e.preventDefault();
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 80;
    const top = target.getBoundingClientRect().top + window.scrollY - navH - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  }
});

/* --- Chatbot toggle (global) --- */
let chatOpen = false;
let chatInitialized = false;

function toggleChat() {
  const win = document.getElementById('chatWindow');
  if (!win) return;
  chatOpen = !chatOpen;
  win.classList.toggle('open', chatOpen);
  if (chatOpen && !chatInitialized) {
    chatInitialized = true;
    setTimeout(() => initChatbot(), 300);
  }
  if (chatOpen) {
    const input = document.getElementById('chatInput');
    if (input) setTimeout(() => input.focus(), 350);
  }
}

function initChatbot() {
  const msgs = document.getElementById('chatMessages');
  if (!msgs || msgs.childElementCount > 0) return;
  appendBotMsg("Hello! I'm Vera AI, your ube sourcing assistant 🌿\n\nI can help with:\n• Product info & pricing\n• Order process & lead times\n• Certifications & traceability\n• Farmer & origin details\n• Supply chain questions\n\nWhat would you like to know?");
}

function appendBotMsg(text) {
  const msgs = document.getElementById('chatMessages');
  if (!msgs) return;

  // Show typing indicator
  const typing = document.createElement('div');
  typing.className = 'chat-msg bot typing-indicator';
  typing.innerHTML = `
    <div class="chat-avatar">🌿</div>
    <div class="chat-bubble" style="padding:10px 14px;">
      <div class="chat-typing">
        <div class="chat-dot"></div>
        <div class="chat-dot"></div>
        <div class="chat-dot"></div>
      </div>
    </div>`;
  msgs.appendChild(typing);
  msgs.scrollTop = msgs.scrollHeight;

  setTimeout(() => {
    typing.remove();
    const div = document.createElement('div');
    div.className = 'chat-msg bot';
    div.innerHTML = `
      <div class="chat-avatar">🌿</div>
      <div class="chat-bubble">${text.replace(/\n/g, '<br/>')}</div>`;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }, 900 + Math.random() * 600);
}

function appendUserMsg(text) {
  const msgs = document.getElementById('chatMessages');
  if (!msgs) return;
  const div = document.createElement('div');
  div.className = 'chat-msg user';
  div.innerHTML = `
    <div class="chat-avatar" style="background:linear-gradient(135deg,var(--purple-500),var(--gold-500));">You</div>
    <div class="chat-bubble">${text}</div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function sendChat() {
  const input = document.getElementById('chatInput');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  appendUserMsg(text);
  appendBotMsg(getBotReply(text));
}

function sendQuick(text) {
  const qr = document.getElementById('quickReplies');
  if (qr) qr.style.display = 'none';
  appendUserMsg(text);
  appendBotMsg(getBotReply(text));
}

/* --- Tooltip on hover (for charts etc.) --- */
function showTooltip(el, text) {
  const tip = document.createElement('div');
  tip.style.cssText = `
    position:absolute;background:var(--ink);color:#fff;padding:6px 12px;
    border-radius:6px;font-size:.75rem;white-space:nowrap;pointer-events:none;
    z-index:100;transform:translateX(-50%);`;
  tip.textContent = text;
  el.style.position = 'relative';
  el.appendChild(tip);
  setTimeout(() => tip.remove(), 2000);
}

/* --- Simple chart drawing (Canvas) --- */
function drawPriceChart() {
  const canvas = document.getElementById('priceChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  canvas.width = canvas.offsetWidth * window.devicePixelRatio;
  canvas.height = canvas.offsetHeight * window.devicePixelRatio;
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

  const W = canvas.offsetWidth;
  const H = canvas.offsetHeight;

  // Mock price data USD/kg
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const prices = [14.2, 14.8, 15.1, 15.0, 15.6, 16.0, 15.8, 16.2, 16.5, 14.0, 12.5, 13.8];

  const padding = { top: 20, right: 20, bottom: 32, left: 48 };
  const chartW = W - padding.left - padding.right;
  const chartH = H - padding.top - padding.bottom;
  const minP = 11, maxP = 18;

  // Gradient fill
  const grad = ctx.createLinearGradient(0, padding.top, 0, H - padding.bottom);
  grad.addColorStop(0, 'rgba(107,53,168,0.18)');
  grad.addColorStop(1, 'rgba(107,53,168,0)');

  function xPos(i) { return padding.left + (i / (prices.length - 1)) * chartW; }
  function yPos(v) { return padding.top + chartH - ((v - minP) / (maxP - minP)) * chartH; }

  // Grid lines
  ctx.strokeStyle = '#EAE5D8';
  ctx.lineWidth = 1;
  [12, 14, 16, 18].forEach(v => {
    const y = yPos(v);
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(W - padding.right, y);
    ctx.stroke();
    ctx.fillStyle = '#7A6E8A';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`$${v}`, padding.left - 6, y + 4);
  });

  // Area fill
  ctx.beginPath();
  ctx.moveTo(xPos(0), yPos(prices[0]));
  prices.forEach((p, i) => {
    if (i === 0) return;
    const cpx = (xPos(i - 1) + xPos(i)) / 2;
    ctx.bezierCurveTo(cpx, yPos(prices[i - 1]), cpx, yPos(p), xPos(i), yPos(p));
  });
  ctx.lineTo(xPos(prices.length - 1), H - padding.bottom);
  ctx.lineTo(xPos(0), H - padding.bottom);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // Line
  ctx.beginPath();
  ctx.moveTo(xPos(0), yPos(prices[0]));
  prices.forEach((p, i) => {
    if (i === 0) return;
    const cpx = (xPos(i - 1) + xPos(i)) / 2;
    ctx.bezierCurveTo(cpx, yPos(prices[i - 1]), cpx, yPos(p), xPos(i), yPos(p));
  });
  ctx.strokeStyle = '#6B35A8';
  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';
  ctx.stroke();

  // Dots & month labels
  prices.forEach((p, i) => {
    const x = xPos(i), y = yPos(p);
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.strokeStyle = '#6B35A8';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#7A6E8A';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(months[i], x, H - padding.bottom + 16);
  });
}

// Draw chart when dashboard loads
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('priceChart')) {
    setTimeout(drawPriceChart, 600);
    window.addEventListener('resize', drawPriceChart);
  }
});
