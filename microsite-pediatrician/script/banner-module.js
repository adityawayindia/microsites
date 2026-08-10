/**
 * DigiDr Modular Banner System — Client & Backend API Module
 * ============================================================
 * Provides an easy, developer-friendly interface for backend integration.
 * 
 * Usage Options for Backend Developers:
 * 1. HTML Data-Attributes (Server-Side Rendering):
 *    <div class="digidr-banner-module" data-banner-src="URL" data-banner-href="LINK" data-banner-active="true">
 * 
 * 2. Programmatic JS API (AJAX / REST API):
 *    DigiDrBanner.setBanner({
 *      src: 'https://cdn.example.com/banner.jpg',
 *      alt: 'Pediatric Care Offer',
 *      href: 'https://example.com/offer',
 *      active: true
 *    });
 * 
 * 3. Dynamic JSON Fetching:
 *    DigiDrBanner.loadFromEndpoint('/api/v1/doctor/banner');
 */

(function (window, document) {
  'use strict';

  var DEFAULT_SELECTOR = '#digidrBannerModule, .digidr-banner-module';

  var DigiDrBanner = {
    /**
     * Get target DOM element(s)
     */
    getElement: function () {
      return document.querySelector(DEFAULT_SELECTOR);
    },

    /**
     * Update banner content & visibility dynamically
     * @param {Object} config
     * @param {string} [config.src] - Image URL
     * @param {string} [config.alt] - Accessible alt text
     * @param {string} [config.href] - Destination click URL
     * @param {boolean} [config.active] - Visible state (true|false)
     */
    setBanner: function (config) {
      if (!config) return;
      var el = this.getElement();
      if (!el) return;

      var img = el.querySelector('#digidrBannerImg, .digidr-banner-img');
      var link = el.querySelector('#digidrBannerLink, .digidr-banner-link');

      if (typeof config.active !== 'undefined') {
        el.setAttribute('data-banner-active', config.active ? 'true' : 'false');
        if (!config.active) {
          el.style.display = 'none';
          return;
        } else {
          el.style.display = '';
        }
      }

      if (config.src && img) {
        img.src = config.src;
        el.setAttribute('data-banner-src', config.src);
      }

      if (config.alt && img) {
        img.alt = config.alt;
        el.setAttribute('data-banner-alt', config.alt);
      }

      if (typeof config.href !== 'undefined' && link) {
        if (config.href && config.href !== '#') {
          link.href = config.href;
          link.removeAttribute('tabindex');
          el.setAttribute('data-banner-href', config.href);
        } else {
          link.removeAttribute('href');
          el.setAttribute('data-banner-href', '#');
        }
      }
    },

    /**
     * Show banner
     */
    show: function () {
      this.setBanner({ active: true });
    },

    /**
     * Hide banner
     */
    hide: function () {
      this.setBanner({ active: false });
    },

    /**
     * Fetch banner data from a REST API endpoint
     * @param {string} endpointUrl - API URL returning { src, alt, href, active }
     */
    loadFromEndpoint: function (endpointUrl) {
      var self = this;
      if (!endpointUrl) return;

      fetch(endpointUrl)
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data) {
            self.setBanner({
              src: data.src || data.banner_image || data.imageUrl,
              alt: data.alt || data.banner_alt || data.altText,
              href: data.href || data.target_url || data.linkUrl,
              active: typeof data.active !== 'undefined' ? data.active : (data.status === 'active' || true)
            });
          }
        })
        .catch(function (err) {
          console.warn('[DigiDr Banner] Failed to load banner from endpoint:', err);
        });
    },

    /**
     * Initialize data attributes on load
     */
    init: function () {
      var el = this.getElement();
      if (!el) return;

      var active = el.getAttribute('data-banner-active');
      var src = el.getAttribute('data-banner-src');
      var alt = el.getAttribute('data-banner-alt');
      var href = el.getAttribute('data-banner-href');

      if (active === 'false') {
        el.style.display = 'none';
      }

      var img = el.querySelector('#digidrBannerImg, .digidr-banner-img');
      var link = el.querySelector('#digidrBannerLink, .digidr-banner-link');

      if (src && img && img.getAttribute('src') !== src) {
        img.src = src;
      }
      if (alt && img) {
        img.alt = alt;
      }
      if (href && link) {
        if (href !== '#') {
          link.href = href;
        }
      }
    }
  };

  // Auto-init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { DigiDrBanner.init(); });
  } else {
    DigiDrBanner.init();
  }

  // Export to global scope
  window.DigiDrBanner = DigiDrBanner;

})(window, document);
