/* ============================================================
   VERA HERITAGE — Dashboard JS
   Handles: chart init, portal-specific interactions
   ============================================================ */

'use strict';

function initDashboard() {
  setTimeout(drawPriceChart, 400);
  initPortalAI();
  animateDashboardKPIs();
}

/* --- Animate KPI numbers on load --- */
function animateDashboardKPIs() {
  document.querySelectorAll('.kpi-number').forEach(el => {
    const text = el.textContent.trim();
    const num = parseFloat(text.replace(/[^0-9.]/g, ''));
    if (!num || isNaN(num)) return;
    const suffix = text.replace(/[0-9.,]/g, '').trim();
    let start = null;
    const duration = 1200;

    function step(timestamp) {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(num * eased).toLocaleString() + (suffix ? ' ' + suffix : '');
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = text;
    }
    requestAnimationFrame(step);
  });
}
