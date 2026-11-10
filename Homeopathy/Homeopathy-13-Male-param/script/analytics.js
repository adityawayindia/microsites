// One event per user action. Never include patient-entered content in analytics.
(function () {
  if (window.__digidrAnalyticsBound) return;
  window.__digidrAnalyticsBound = true;
  const keys = new Set(['label','checked','method','scrolled_to_bottom','appointment_type']);
  window.trackEvent = function (name, params = {}) {
    const safe = {page_path:window.location.pathname};
    Object.entries(params || {}).forEach(([key,value]) => {if(keys.has(key))safe[key]=value;});
    if (typeof window.gtag === 'function') window.gtag('event',name,safe);
    if (typeof window.clarity === 'function') window.clarity('event',name);
  };
  document.addEventListener('click', event => {
    if (!(event.target instanceof Element)) return;
    const el = event.target.closest('[data-ga-event]');
    if (!el || el.disabled || el.getAttribute('aria-disabled') === 'true') return;
    if (el.tagName === 'A' && !el.hasAttribute('href')) return;
    window.trackEvent(el.dataset.gaEvent,{label:el.dataset.gaLabel || el.getAttribute('aria-label') || el.textContent.trim().slice(0,60)});
  });
})();
