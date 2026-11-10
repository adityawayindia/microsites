// Event delivery is guarded; parameters never include patient form values.
window.trackEvent = function trackEvent(eventName, params = {}) {
  const safe = {};
  ["label", "checked", "method", "scrolled_to_bottom", "appointment_type"].forEach(key => {
    if (Object.prototype.hasOwnProperty.call(params, key)) safe[key] = params[key];
  });
  if (typeof gtag === "function") gtag("event", eventName, { page_path: window.location.pathname, ...safe });
  if (typeof clarity === "function") clarity("event", eventName);
};
document.addEventListener("click", event => {
  const el = event.target instanceof Element ? event.target.closest("[data-ga-event]") : null;
  if (!el || el.matches('[disabled],[aria-disabled="true"],.is-disabled,.social-disabled')) return;
  window.trackEvent(el.dataset.gaEvent, {
    label: el.dataset.gaLabel || el.getAttribute("aria-label") || el.textContent.trim().slice(0, 60)
  });
});
