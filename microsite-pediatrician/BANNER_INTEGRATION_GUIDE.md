# 🔌 DigiDr Modular Banner System — Backend Integration Guide

The DigiDr single-image banner system is structured as a **modular, self-contained component** designed for seamless backend integration (PHP, Node.js, Python/Django, ASP.NET, Laravel, or REST APIs).

---

## 1. Component Files

| File Path | Description |
|---|---|
| [`styles/banner-module.css`](file:///e:/Wayindia/DigiDr/Microsites/microsite-pediatrician/styles/banner-module.css) | Standalone responsive banner stylesheet (4.5:1 desktop / 2.2:1 mobile). |
| [`script/banner-module.js`](file:///e:/Wayindia/DigiDr/Microsites/microsite-pediatrician/script/banner-module.js) | Lightweight Client & API module (`window.DigiDrBanner`). |
| [`index.html`](file:///e:/Wayindia/DigiDr/Microsites/microsite-pediatrician/index.html) | Contains the HTML container `#digidrBannerModule` inside `.hero-section`. |

---

## 2. Integration Options for Backend Developers

### Option A: Server-Side Rendering (PHP / Blade / EJS / Django / ASP.NET)

Replace the data attributes or inner tags directly with database variables:

```html
<div 
  class="digidr-banner-module" 
  id="digidrBannerModule"
  data-banner-active="<?= !empty($banner['image_url']) ? 'true' : 'false' ?>"
  data-banner-src="<?= htmlspecialchars($banner['image_url']) ?>"
  data-banner-alt="<?= htmlspecialchars($banner['alt_text']) ?>"
  data-banner-href="<?= htmlspecialchars($banner['target_url'] ?? '#') ?>"
>
  <div class="container digidr-banner-container">
    <a href="<?= htmlspecialchars($banner['target_url'] ?? '#') ?>" class="digidr-banner-link" id="digidrBannerLink">
      <div class="digidr-banner-wrap">
        <img
          src="<?= htmlspecialchars($banner['image_url']) ?>" 
          alt="<?= htmlspecialchars($banner['alt_text']) ?>"
          class="digidr-banner-img"
          id="digidrBannerImg"
          loading="eager"
        />
      </div>
    </a>
  </div>
</div>
```

---

### Option B: Client-Side JS API (AJAX / Fetch)

If fetching banner data dynamically from an API:

```javascript
// Method 1: Pass object configuration directly
DigiDrBanner.setBanner({
  src: 'https://your-domain.com/uploads/banners/special-promo.jpg',
  alt: 'Pediatric Care Summer Health Campaign',
  href: 'https://your-domain.com/booking?campaign=summer',
  active: true // Set to false to automatically hide the banner container
});

// Method 2: Fetch directly from a REST API endpoint
DigiDrBanner.loadFromEndpoint('/api/v1/doctor/banner-config');
```

---

### Option C: Quick Helper Functions

```javascript
DigiDrBanner.show(); // Display the banner
DigiDrBanner.hide(); // Hide the banner cleanly from the layout
```
