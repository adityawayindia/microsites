/* DigiDr promotional banner. Configuration never bypasses the campaign schedule. */
(function (window, document) {
  "use strict";
  const selector = "#digidrBannerModule, .digidr-banner-module";
  function safeURL(value) {
    if (!value || value === "#") return "";
    if (value.startsWith("#")) return value;
    try { const url = new URL(value, document.baseURI); return ["https:", "http:"].includes(url.protocol) ? value : ""; }
    catch { return value.startsWith("assets/") ? value : ""; }
  }
  const banner = {
    enabled: true,
    schedule: { enabled: true, startDate: "", endDate: "" },
    getElement() { return document.querySelector(selector); },
    isWithinSchedule() {
      if (!this.schedule.enabled) return true;
      const now = Date.now(), { startDate, endDate } = this.schedule;
      const start = startDate ? Date.parse(startDate) : -Infinity;
      const end = endDate ? Date.parse(endDate) : Infinity;
      return !Number.isNaN(start) && !Number.isNaN(end) && start <= end && now >= start && now <= end;
    },
    setSchedule(config = {}) {
      const el = this.getElement();
      ["enabled", "startDate", "endDate"].forEach(key => {
        if (Object.prototype.hasOwnProperty.call(config, key)) this.schedule[key] = key === "enabled" ? config[key] === true : (config[key] || "");
      });
      if (el) { el.dataset.bannerStart = this.schedule.startDate; el.dataset.bannerEnd = this.schedule.endDate; }
      this.init();
    },
    setBanner(config = {}) {
      const el = this.getElement(); if (!el) return;
      const keys = { src: "bannerSrc", srcMobile: "bannerSrcMobile", alt: "bannerAlt", href: "bannerHref" };
      Object.entries(keys).forEach(([key, attr]) => {
        if (Object.prototype.hasOwnProperty.call(config, key)) el.dataset[attr] = config[key] || "";
      });
      if (Object.prototype.hasOwnProperty.call(config, "active")) el.dataset.bannerActive = config.active === true ? "true" : "false";
      this.init();
    },
    show() { this.setBanner({ active: true }); },
    hide() { this.setBanner({ active: false }); },
    async loadFromEndpoint(endpointUrl) {
      if (!safeURL(endpointUrl)) { this.hide(); return; }
      try {
        const response = await fetch(endpointUrl, { credentials: "omit" });
        if (!response.ok) throw new Error("Banner unavailable");
        const data = await response.json();
        if (!data || typeof data !== "object") throw new Error("Invalid banner response");
        if ("startDate" in data || "start_date" in data || "endDate" in data || "end_date" in data) {
          this.setSchedule({ startDate: data.startDate ?? data.start_date ?? "", endDate: data.endDate ?? data.end_date ?? "" });
        }
        this.setBanner({
          src: data.src || data.banner_image || data.imageUrl || "",
          srcMobile: data.srcMobile || data.banner_image_mobile || data.imageUrlMobile || data.src_mobile || data.imageUrl_mobile || "",
          alt: data.alt || data.banner_alt || data.altText || "Clinic banner",
          href: data.href || data.target_url || data.linkUrl || "",
          active: typeof data.active === "boolean" ? data.active : data.status === "active"
        });
      } catch { this.hide(); }
    },
    init() {
      const el = this.getElement(); if (!el) return;
      if (el.hasAttribute("data-banner-start")) this.schedule.startDate = el.dataset.bannerStart;
      if (el.hasAttribute("data-banner-end")) this.schedule.endDate = el.dataset.bannerEnd;
      const img = el.querySelector(".digidr-banner-img"), source = el.querySelector("source"), link = el.querySelector(".digidr-banner-link");
      const src = safeURL(el.dataset.bannerSrc), mobile = safeURL(el.dataset.bannerSrcMobile);
      el.hidden = !this.enabled || el.dataset.bannerActive !== "true" || !this.isWithinSchedule() || !src || !mobile;
      if (src && img && img.getAttribute("src") !== src) img.src = src;
      if (mobile && source) source.srcset = mobile;
      if (img) { img.alt = el.dataset.bannerAlt || "Clinic banner"; img.onerror = () => { el.hidden = true; }; }
      if (link) {
        const href = safeURL(el.dataset.bannerHref);
        if (href) { link.href = href; link.removeAttribute("tabindex"); if (/^https?:/i.test(href)) { link.target = "_blank"; link.rel = "noopener noreferrer"; } else { link.removeAttribute("target"); link.removeAttribute("rel"); } }
        else { link.removeAttribute("href"); link.removeAttribute("target"); link.removeAttribute("rel"); link.setAttribute("tabindex", "-1"); }
      }
    }
  };
  window.DigiDrBanner = banner;
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => banner.init());
  else banner.init();
})(window, document);
