/* GA4 + Clarity event bridge. Only static UI labels and the documented event
   fields are allowed; never pass form values, filenames or chat text here. */
window.trackEvent = function trackEvent(name, params = {}) {
  const safe = {page_path: window.location.pathname};
  for (const key of ['label', 'checked', 'method', 'scrolled_to_bottom', 'appointment_type']) {
    if (Object.prototype.hasOwnProperty.call(params,key)) safe[key]=params[key];
  }
  if (typeof window.gtag === 'function') window.gtag('event',name,safe);
  if (typeof window.clarity === 'function') window.clarity('event',name);
};
document.addEventListener('click', event => {
  if (!(event.target instanceof Element)) return;
  const el=event.target.closest('[data-ga-event]');
  if (!el || el.disabled || el.getAttribute('aria-disabled')==='true') return;
  if (el.matches('a') && !el.getAttribute('href')) return;
  window.trackEvent(el.dataset.gaEvent,{label:el.dataset.gaLabel||el.getAttribute('aria-label')||el.textContent.trim().slice(0,60)});
});
// Disabled, unconfigured social links do not navigate or emit events.
document.addEventListener('click', event => {
  if (event.target instanceof Element && event.target.closest('a[aria-disabled="true"]')) event.preventDefault();
},true);
