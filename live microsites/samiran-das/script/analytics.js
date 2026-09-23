window.trackEvent = function trackEvent(eventName, params) {
  if (typeof gtag === "function") {
    gtag("event", eventName, {
      page_path: window.location.pathname,
      ...params,
    });
  }
  if (typeof clarity === "function") {
    clarity("event", eventName);
  }
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
