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
      startDate: null,
      endDate: null
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
      var el = this.getElement();
      for (var entry of [['startDate', 'data-banner-start'], ['endDate', 'data-banner-end']]) {
        var key = entry[0];
        if (typeof scheduleConfig[key] === 'undefined') continue;
        this.schedule[key] = scheduleConfig[key] || null;
        if (el) el.setAttribute(entry[1], this.schedule[key] || '');
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

      var attributes = {
        src: 'data-banner-src', srcMobile: 'data-banner-src-mobile',
        alt: 'data-banner-alt', href: 'data-banner-href', active: 'data-banner-active'
      };
      Object.keys(attributes).forEach(function (key) {
        if (typeof config[key] !== 'undefined') {
          el.setAttribute(attributes[key], config[key] == null ? '' : String(config[key]));
        }
      });
      this.init();
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

      return fetch(endpointUrl)
        .then(function (res) { if (!res.ok) throw new Error('HTTP ' + res.status); return res.json(); })
        .then(function (data) {
          if (data) {
            function field(names) {
              for (var name of names) {
                if (Object.prototype.hasOwnProperty.call(data, name)) return data[name];
              }
              return undefined;
            }
            var start = field(['startDate', 'start_date']);
            var end = field(['endDate', 'end_date']);
            if (start !== undefined || end !== undefined) {
              self.setSchedule({ startDate: start, endDate: end });
            }
            self.setBanner({
              src: field(['src', 'banner_image', 'imageUrl']),
              srcMobile: field(['srcMobile', 'banner_image_mobile', 'imageUrlMobile', 'src_mobile', 'imageUrl_mobile']),
              alt: field(['alt', 'banner_alt', 'altText']),
              href: field(['href', 'target_url', 'linkUrl']),
              active: typeof data.active !== 'undefined' ? data.active : (data.status ? data.status === 'active' : true)
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
      if (dataStart !== null) this.schedule.startDate = dataStart || null;
      if (dataEnd !== null) this.schedule.endDate = dataEnd || null;

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

      var desktop = src || srcMobile;
      if (desktop && img && img.getAttribute('src') !== desktop) img.src = desktop;
      if (sourceMobile) {
        if (srcMobile) sourceMobile.srcset = srcMobile;
        else sourceMobile.removeAttribute('srcset');
      }
      if (img) img.alt = alt || '';
      if (link) {
        if (href && href !== '#') link.href = href;
        else link.removeAttribute('href');
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
