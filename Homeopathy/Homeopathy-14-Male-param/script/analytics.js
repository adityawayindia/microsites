// Privacy-safe GA4 + Clarity event adapter. Configuration remains in each page head.
window.trackEvent = function(eventName, params = {}) {
  const safe = {page_path: location.pathname};
  for (const key of ['label','appointment_type','checked','method','scrolled_to_bottom']) {
    if (Object.prototype.hasOwnProperty.call(params,key)) safe[key] = params[key];
  }
  if (typeof window.gtag === 'function') window.gtag('event',eventName,safe);
  if (typeof window.clarity === 'function') window.clarity('event',eventName);
};
document.addEventListener('click', event => {
  const el = event.target instanceof Element ? event.target.closest('[data-ga-event]') : null;
  if (!el || el.matches(':disabled,[aria-disabled="true"],.social-disabled') || el.closest('[inert]')) return;
  // Capture runs before a CTA opens a dialog and makes its background inert.
  window.trackEvent(el.dataset.gaEvent,{label:el.dataset.gaLabel||el.getAttribute('aria-label')||el.textContent.trim().slice(0,60)});
}, true);
