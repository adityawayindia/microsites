/* DigiDr configurable clinic banner. Public methods are shared across microsites. */
(function () {
  'use strict';

  const selector = '#digidrBannerModule, .digidr-banner-module';
  const has = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
  const banner = {
    enabled: true,
    schedule: { enabled: true, startDate: null, endDate: null },
    getElement() { return document.querySelector(selector); },

    isWithinSchedule() {
      if (!this.schedule || !this.schedule.enabled) return true;
      const now = Date.now();
      const start = Date.parse(this.schedule.startDate);
      const end = Date.parse(this.schedule.endDate);
      return (!Number.isFinite(start) || now >= start) && (!Number.isFinite(end) || now <= end);
    },

    setSchedule(settings) {
      if (!settings) return;
      if (has(settings, 'enabled')) this.schedule.enabled = Boolean(settings.enabled);
      const element = this.getElement();
      // Replace a previous campaign window, including when clearing a boundary.
      for (const [key, attribute] of [['startDate', 'bannerStart'], ['endDate', 'bannerEnd']]) {
        if (!has(settings, key)) continue;
        this.schedule[key] = settings[key] || null;
        if (element) element.dataset[attribute] = settings[key] || '';
      }
      this.init();
    },

    setBanner(settings) {
      const element = this.getElement();
      if (!element || !settings) return;
      const data = element.dataset;
      if (has(settings, 'active')) data.bannerActive = String(Boolean(settings.active));
      if (has(settings, 'src')) {
        data.bannerSrc = settings.src || '';
        if (!has(settings, 'srcMobile')) data.bannerSrcMobile = data.bannerSrc;
      }
      if (has(settings, 'srcMobile')) data.bannerSrcMobile = settings.srcMobile || '';
      if (has(settings, 'alt')) data.bannerAlt = settings.alt || '';
      if (has(settings, 'href')) data.bannerHref = settings.href || '#';
      this.init();
    },

    show() { this.setBanner({ active: true }); },
    hide() { this.setBanner({ active: false }); },

    async loadFromEndpoint(endpointUrl) {
      if (!endpointUrl) return;
      try {
        const response = await fetch(endpointUrl);
        if (!response.ok) throw new Error('Banner request returned HTTP ' + response.status);
        const data = await response.json();
        if (!data) return;
        this.setSchedule({
          startDate: data.startDate || data.start_date || null,
          endDate: data.endDate || data.end_date || null
        });
        this.setBanner({
          src: data.src || data.banner_image || data.imageUrl || '',
          srcMobile: data.srcMobile || data.banner_image_mobile || data.imageUrlMobile || data.src_mobile || data.imageUrl_mobile || '',
          alt: data.alt || data.banner_alt || data.altText || '',
          href: data.href || data.target_url || data.linkUrl || '#',
          active: has(data, 'active') ? data.active : !data.status || data.status === 'active'
        });
      } catch (error) {
        this.hide();
        console.warn('[DigiDr Banner] Unable to load campaign:', error.message);
      }
    },

    init() {
      const element = this.getElement();
      if (!element) return;
      const data = element.dataset;
      this.schedule.startDate = data.bannerStart || null;
      this.schedule.endDate = data.bannerEnd || null;
      const desktop = data.bannerSrc || data.bannerSrcMobile;
      const mobile = data.bannerSrcMobile || desktop;
      const show = Boolean(desktop) && this.enabled && this.isWithinSchedule() && data.bannerActive !== 'false';
      element.style.display = show ? '' : 'none';
      if (!show) return;

      const image = element.querySelector('#digidrBannerImg, .digidr-banner-img');
      const source = element.querySelector('picture source');
      const link = element.querySelector('#digidrBannerLink, .digidr-banner-link');
      if (image) {
        if (image.getAttribute('src') !== desktop) image.src = desktop;
        image.alt = data.bannerAlt || '';
      }
      if (source && source.getAttribute('srcset') !== mobile) source.srcset = mobile;
      if (link) {
        if (data.bannerHref && data.bannerHref !== '#') {
          link.setAttribute('href', data.bannerHref);
          link.removeAttribute('tabindex');
        } else {
          link.removeAttribute('href');
          link.setAttribute('tabindex', '-1');
        }
      }
    }
  };

  window.DigiDrBanner = banner;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => banner.init(), { once: true });
  } else {
    banner.init();
  }
})();
