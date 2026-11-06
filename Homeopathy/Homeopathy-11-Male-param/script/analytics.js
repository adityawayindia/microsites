// Only approved, non-patient event parameters may leave this module.
window.trackEvent = function(eventName, params = {}) {
  const safe = {page_path: window.location.pathname};
  for (const key of ['label','checked','method','scrolled_to_bottom','appointment_type']) {
    if (Object.prototype.hasOwnProperty.call(params,key)) safe[key] = params[key];
  }
  if (typeof window.gtag === 'function') window.gtag('event',eventName,safe);
  if (typeof window.clarity === 'function') window.clarity('event',eventName);
};
document.addEventListener('click',event=>{
  const el=event.target instanceof Element?event.target.closest('[data-ga-event]'):null;
  if(!el || el.disabled || el.getAttribute('aria-disabled')==='true' || el.classList.contains('is-disabled')) return;
  window.trackEvent(el.dataset.gaEvent,{label:el.dataset.gaLabel||el.getAttribute('aria-label')||el.textContent.trim().slice(0,60)});
});
