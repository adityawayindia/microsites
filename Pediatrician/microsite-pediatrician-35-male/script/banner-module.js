/**
 * DigiDr Modular Banner System — Client & Backend API Module
 * ============================================================
 * Provides an easy, developer-friendly interface for backend integration.
 * 
 * Features:
 * 1. Global Manual On/Off Toggle (`DigiDrBanner.enabled`)
 * 2. Automated Date & Time Scheduling (`DigiDrBanner.schedule`)
 * 3. HTML Data-Attributes or Programmatic JS API
 */

(function (window, document) {
  'use strict';

  var DEFAULT_SELECTOR = '#digidrBannerModule, .digidr-banner-module';

  var DigiDrBanner = {
    // 1. GLOBAL MANUAL TOGGLE: Set to false to force-disable the banner system instantly
    enabled: true,

    // 2. DATE & TIME SCHEDULING CONFIGURATION:
    // Allows scheduling banners for any specific timeframe in the future.
    // Format: ISO 8601 string or Date format (e.g., 'YYYY-MM-DDTHH:mm:ss+05:30')
    schedule: {
      enabled: true, // Set to false to bypass schedule checks and rely only on manual toggle
      startDate: '2026-08-11T00:00:00+05:30', // Campaign Start (Today)
      endDate: '2026-08-15T23:59:59+05:30'    // Campaign End (15 August 11:59 PM IST)
    },

    /**
     * Check if current time falls within scheduled start and end dates
     * @returns {boolean}
     */
    isWithinSchedule: function () {
      if (!this.schedule || !this.schedule.enabled) {
        return true;
      }

      var now = new Date();

      if (this.schedule.startDate) {
        var start = new Date(this.schedule.startDate);
        if (!isNaN(start.getTime()) && now < start) {
          return false;
        }
      }

      if (this.schedule.endDate) {
        var end = new Date(this.schedule.endDate);
        if (!isNaN(end.getTime()) && now > end) {
          return false;
        }
      }

      return true;
    },

    /**
     * Programmatically update schedule parameters for future campaigns
     * @param {Object} scheduleConfig
     * @param {string|Date} [scheduleConfig.startDate]
     * @param {string|Date} [scheduleConfig.endDate]
     * @param {boolean} [scheduleConfig.enabled]
     */
    setSchedule: function (scheduleConfig) {
      if (!scheduleConfig) return;
      if (typeof scheduleConfig.enabled !== 'undefined') {
        this.schedule.enabled = !!scheduleConfig.enabled;
      }
      if (scheduleConfig.startDate) {
        this.schedule.startDate = scheduleConfig.startDate;
      }
      if (scheduleConfig.endDate) {
        this.schedule.endDate = scheduleConfig.endDate;
      }
      this.init();
    },

    /**
     * Get target DOM element(s)
     */
    getElement: function () {
      return document.querySelector(DEFAULT_SELECTOR);
    },

    /**
     * Update banner content & visibility dynamically
     * @param {Object} config
     * @param {string} [config.src] - Desktop Image URL
     * @param {string} [config.srcMobile] - Mobile Image URL
     * @param {string} [config.alt] - Accessible alt text
     * @param {string} [config.href] - Destination click URL
     * @param {boolean} [config.active] - Visible state (true|false)
     */
    setBanner: function (config) {
      if (!config) return;
      var el = this.getElement();
      if (!el) return;

      // Handle global disabled toggle
      if (!this.enabled) {
        el.style.display = 'none';
        el.setAttribute('data-banner-active', 'false');
        return;
      }

      var img = el.querySelector('#digidrBannerImg, .digidr-banner-img');
      var link = el.querySelector('#digidrBannerLink, .digidr-banner-link');
      var sourceMobile = el.querySelector('source');

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

      if (config.srcMobile && sourceMobile) {
        sourceMobile.srcset = config.srcMobile;
        el.setAttribute('data-banner-src-mobile', config.srcMobile);
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
     * @param {string} endpointUrl - API URL returning { src, alt, href, active, startDate, endDate }
     */
    loadFromEndpoint: function (endpointUrl) {
      var self = this;
      if (!endpointUrl) return;

      fetch(endpointUrl)
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data) {
            if (data.startDate || data.endDate) {
              self.setSchedule({
                startDate: data.startDate || data.start_date,
                endDate: data.endDate || data.end_date
              });
            }
            self.setBanner({
              src: data.src || data.banner_image || data.imageUrl,
              srcMobile: data.srcMobile || data.banner_image_mobile || data.imageUrlMobile || data.src_mobile || data.imageUrl_mobile,
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
     * Initialize data attributes and schedule checks on load
     */
    init: function () {
      var el = this.getElement();
      if (!el) return;

      // 1. Handle global manual toggle
      if (!this.enabled) {
        el.style.display = 'none';
        return;
      }

      // Read schedule override attributes from HTML if present
      var dataStart = el.getAttribute('data-banner-start');
      var dataEnd = el.getAttribute('data-banner-end');
      if (dataStart) this.schedule.startDate = dataStart;
      if (dataEnd) this.schedule.endDate = dataEnd;

      // 2. Handle Date & Time Schedule window check
      if (!this.isWithinSchedule()) {
        el.style.display = 'none';
        return;
      }

      var active = el.getAttribute('data-banner-active');
      var src = el.getAttribute('data-banner-src');
      var srcMobile = el.getAttribute('data-banner-src-mobile');
      var alt = el.getAttribute('data-banner-alt');
      var href = el.getAttribute('data-banner-href');

      // Safety check: if active is true but no image is set, hide container to avoid broken image display
      if (active === 'true' && !src && !srcMobile) {
        el.style.display = 'none';
        return;
      }

      if (active === 'false') {
        el.style.display = 'none';
      } else {
        el.style.display = '';
      }

      var img = el.querySelector('#digidrBannerImg, .digidr-banner-img');
      var link = el.querySelector('#digidrBannerLink, .digidr-banner-link');
      var sourceMobile = el.querySelector('source');

      if (src && img && img.getAttribute('src') !== src) {
        img.src = src;
      }
      if (srcMobile && sourceMobile) {
        sourceMobile.srcset = srcMobile;
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
