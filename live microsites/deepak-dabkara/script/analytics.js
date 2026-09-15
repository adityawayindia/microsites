// GA4 analytics — all event tracking for this microsite lives in this file.
//
// 1) Declarative tracking: add data-ga-event="event_name" to any element and
//    clicks on it (or any nested icon/span inside it) are sent automatically.
//    Optional data-ga-label overrides the auto-derived label (element text).
//
// 2) Programmatic tracking: call window.trackEvent(name, params) from other
//    scripts (e.g. script/index.js) for events tied to form/app state that
//    can't be expressed as a plain click listener (consent toggles, file
//    uploads, form submissions).
window.trackEvent = function trackEvent(eventName, params) {
  if (typeof gtag !== "function") return;
  gtag("event", eventName, {
    page_path: window.location.pathname,
    ...params,
  });
};

document.addEventListener("click", (event) => {
  const el = event.target.closest("[data-ga-event]");
  if (!el) return;

  window.trackEvent(el.getAttribute("data-ga-event"), {
    label:
      el.getAttribute("data-ga-label") ||
      el.getAttribute("aria-label") ||
      el.textContent.trim().slice(0, 60),
  });
});
