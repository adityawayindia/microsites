# 🔌 DigiDr Modular Banner System — Integration Guide

The DigiDr banner system is structured as a **modular, self-contained component** designed for seamless backend integration (PHP, Node.js, Python, ASP.NET, Laravel, or REST APIs) with built-in time-scheduling and responsive layout scaling.

---

## 1. Component Files

| File Path | Description |
|---|---|
| [`styles/banner-module.css`](file:///f:/microsites/microsite-pediatrician/styles/banner-module.css) | Component responsive layout stylesheet. |
| [`script/banner-module.js`](file:///f:/microsites/microsite-pediatrician/script/banner-module.js) | Light JS controller & API module with schedule controls (`window.DigiDrBanner`). |
| [`index.html`](file:///f:/microsites/microsite-pediatrician/index.html) | Contains the HTML container `#digidrBannerModule` inside `.hero-section`. |

---

## 2. Image Ratio Specifications

To prevent layout distortion and ensure optimal readability:
* **Desktop View**: The layout allows the image to scale naturally to full width (`width: 100%`) with a hard `max-height: 220px` cap (approx **16:3** or wider aspect ratio is recommended for graphic assets).
* **Mobile View (≤ 768px)**: Enforces a strict **16:5** aspect ratio to prevent banner elements from becoming too small or illegible on mobile screens.

---

## 3. Integration & Scheduling Options

### Option A: Server-Side Rendering (Recommended / Fool-Proof)

The backend developer can output database variables directly into the template data attributes. The JS module automatically parses these dates, performs system clock checks, and handles display rendering:

```html
<div class="digidr-banner-module single-image-banner-section" id="digidrBannerModule"
  aria-label="Main Clinic Banner" 
  data-banner-active="<?= !empty($banner['image_url']) ? 'true' : 'false' ?>"
  data-banner-start="<?= htmlspecialchars($banner['start_date']) ?>" 
  data-banner-end="<?= htmlspecialchars($banner['end_date']) ?>" 
  data-banner-src="<?= htmlspecialchars($banner['image_url']) ?>"
  data-banner-src-mobile="<?= htmlspecialchars($banner['image_mobile_url']) ?>" 
  data-banner-alt="<?= htmlspecialchars($banner['alt_text']) ?>"
  data-banner-href="<?= htmlspecialchars($banner['target_url'] ?? '#') ?>">
  <div class="container digidr-banner-container single-image-banner-container">
    <a href="<?= htmlspecialchars($banner['target_url'] ?? '#') ?>" class="digidr-banner-link" id="digidrBannerLink" aria-label="Clinic Promo Banner">
      <div class="digidr-banner-wrap single-image-banner-wrap">
        <picture>
          <source media="(max-width: 768px)" srcset="<?= htmlspecialchars($banner['image_mobile_url']) ?>" />
          <img src="<?= htmlspecialchars($banner['image_url']) ?>" alt="<?= htmlspecialchars($banner['alt_text']) ?>"
            class="digidr-banner-img single-image-banner-img" id="digidrBannerImg" loading="eager" />
        </picture>
      </div>
    </a>
  </div>
</div>
```

---

### Option B: Quick Manual Override Toggle

For urgent programmatic control, you can toggle the system globally by editing `script/banner-module.js`:

```javascript
var DigiDrBanner = {
  // GLOBAL MANUAL TOGGLE: Set to false to force-disable the banner system instantly
  enabled: true, 
  
  // Default fallback schedule
  schedule: {
    enabled: true,
    startDate: '2026-08-11T00:00:00+05:30', 
    endDate: '2026-08-15T23:59:59+05:30'
  },
  ...
```

---

### Option C: Client-Side JS API (Programmatic Updates)

Use JS helper methods to set campaigns, schedule windows, or fetch configuration dynamically:

```javascript
// 1. Programmatically schedule a future campaign
DigiDrBanner.setSchedule({
  startDate: '2026-09-01T00:00:00+05:30',
  endDate: '2026-09-10T23:59:59+05:30',
  enabled: true
});

// 2. Set banner assets directly
DigiDrBanner.setBanner({
  src: 'assets/autumn-promo-desktop.png',
  srcMobile: 'assets/autumn-promo-mobile.png',
  alt: 'Autumn Wellness Campaign',
  href: 'https://your-site.com/promo',
  active: true
});

// 3. Load dynamically from a REST API endpoint
DigiDrBanner.loadFromEndpoint('/api/v1/doctor/banner-config');
```
