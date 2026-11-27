/* Native sharing, with testing-norma's copy-link fallback; no custom menu. */
(() => {
  const buttons = document.querySelectorAll('[data-profile-share]');
  if (!buttons.length) return;
  // Never send file:, data:, unresolved template fields or credentials to Web Share.
  function publicUrl(raw) {
    if (!raw || /[{}]/.test(raw)) return null;
    try {
      const url = new URL(raw);
      return /^https?:$/.test(url.protocol) && !url.username && !url.password ? url.href : null;
    } catch (_) { return null; }
  }
  const canonical = document.querySelector('link[rel="canonical"]')?.href;
  const title = document.querySelector('.hero-identity h1')?.textContent.trim() || document.title;
  let sharing = false;
  function validateContactLink(selector, pattern, unavailableLabel) {
    const link = document.querySelector(selector);
    if (!link || pattern.test(link.getAttribute('href') || '')) return;
    link.removeAttribute('href');
    link.removeAttribute('data-ga-event');
    link.setAttribute('aria-disabled', 'true');
    link.setAttribute('aria-label', unavailableLabel);
    link.setAttribute('role', 'link');
    link.tabIndex = 0;
    const tooltip = link.querySelector('[data-disabled-label]');
    if (tooltip) tooltip.textContent = tooltip.dataset.disabledLabel;
    else link.title = unavailableLabel;
  }
  validateContactLink('[data-profile-call]', /^tel:\+[1-9]\d{5,14}$/, 'Call not enabled');
  validateContactLink('[data-profile-whatsapp]', /^https:\/\/wa\.me\/91\d{10}$/, 'WhatsApp not enabled');
  buttons.forEach(button => {
  const url = publicUrl(button.dataset.profileUrl) || publicUrl(canonical) || publicUrl(location.href.split(/[?#]/)[0]);
  const scope = button.closest('[data-share-scope]');
  const manualCopy = scope.querySelector('[data-profile-copy]');
  const input = manualCopy.querySelector('input');
  const status = scope.querySelector('[data-profile-share-status]');
  let resetTimer;
  input.addEventListener('blur', () => { manualCopy.hidden = true; });
  input.addEventListener('keydown', event => { if (event.key === 'Escape') button.focus(); });
  button.addEventListener('click', async () => {
    if (sharing) return;
    clearTimeout(resetTimer);
    manualCopy.hidden = true;
    status.textContent = '';
    button.dataset.tooltip = 'Share Profile';
    if (!url) {
      status.textContent = 'A public profile link is not configured yet.';
      button.dataset.tooltip = 'Profile link unavailable';
      return;
    }
    const data = { title, url };
    let canShare = typeof navigator.share === 'function' && window.isSecureContext;
    try { if (canShare && typeof navigator.canShare === 'function') canShare = navigator.canShare(data); }
    catch (_) { canShare = false; }
    if (canShare) {
      sharing = true;
      try {
        await navigator.share(data);
        return;
      } catch (error) {
        if (error.name === 'AbortError') return;
      } finally { sharing = false; }
    }
    try {
      await navigator.clipboard.writeText(url);
      status.textContent = 'Profile link copied.';
      button.dataset.tooltip = 'Link copied';
      resetTimer = setTimeout(() => { button.dataset.tooltip = 'Share Profile'; }, 2000);
    } catch (_) {
      input.value = url;
      manualCopy.hidden = false;
      status.textContent = 'Select and copy the profile link.';
      input.focus();
      input.select();
    }
  });
  });
})();
