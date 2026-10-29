# Microsite Parameterization Playbook

How to convert any finished, non-parameterized microsite into a Mustache-style template that
the DigiDr backend renders for each doctor. Everything needed is in this file: the placeholder
vocabulary, the markup patterns, the head and SEO files, the JavaScript that is allowed to
change, the shared files a template may be missing (Appendix P), and the checks to run. No other
microsite and no other document is needed.

> **JavaScript scope: only three things change during a conversion.** The stat counter (§4),
> the chatbot widget (§4a) and the booking/appointment code (§4b, §4c). Do not modify any
> other `script/*.js` code until the backend team's code is available for it (analytics,
> banner and auto-open-modal, see §5).

Conversion history for this workspace (which templates are done, what was found on the live
sites) is kept separately in [parameterization-log.md](parameterization-log.md).

---

## 0. Conventions

**Naming convention:** once a template is fully parameterized, its folder gets the suffix
`-param` (e.g. `<Specialty>/microsite-<specialty>-1` → `<Specialty>/microsite-<specialty>-1-param`).
A folder without `-param` has not been converted. Rename in the same commit that finishes the
conversion.

The suffix is a **repo folder name only**. GCS asset URLs inside the pages
(`https://storage.googleapis.com/microsite_buck/microsite-<specialty>-<n>/assets/…`) point at the
bucket folder, which is not renamed. Leave those URLs unchanged.

Rules that apply to every conversion:
- **Calendar must use `availableDays`.** Piece 1 of §4b only loads the days; the date-picker
  `render()` must also disable days not in the set:
  `const isUnconfiguredDay = availableDays && availableDays.size > 0 && !availableDays.has(dayName);`
  then `if (cellDate < today || isUnconfiguredDay)`. Loading without this lets patients pick
  days the doctor doesn't work. (The §4c code already does this.)
- **Remove demo `<option>`s from `#preferredTime`.** Keep only
  `<option value="">Select Time Slot</option>`; the slots API fills the rest. Demo values would
  otherwise be submitted as a `SlotId` if the slots call fails.
- **Template-owned images** (About/Philosophy photos, etc.) use the GCS bucket URL for that
  template's bucket folder, not relative `assets/` paths (which break under `{{path}}` serving).
  `{{path}}` stays for CSS/JS only. If images are deliberately kept in the local `assets/`
  folder, they must be reachable at `assets/…` wherever the page is served.
- **Disabled-social CSS:** if the template has no `.is-disabled` / `data-tooltip` styling for
  social icons, add the block in §1.1 (it dims the glyph and surface, not the whole element, so
  the "Not Enabled" tooltip stays readable). Also add `html, body { overflow-x: clip; }` so the
  hidden tooltip of the last icon in a row can't cause sideways scroll.
- **Page links use `{{slug}}`, no `.html`.** Every relative link to another page (nav, logo,
  footer, legal-page back button, consent modal) is `/{{slug}}/<page-name>`, e.g. `/{{slug}}`,
  `/{{slug}}/#services`, `/{{slug}}/privacy-policy`, `/{{slug}}/terms-of-service`. See §6.
- **Hero registration line:** `Medical Regd. No.: {{mci}}` inside `{{#hasmic}}`.
- **Blog pages:** removed from every microsite; there is no Blog nav link and no `{{#hasBlog}}`.
- **Verify each template** by rendering it with sample data (long name, `15+`, `20,000+`, some
  `has*`/`no*` flags each way, some `has_`/`no_` section texts each way) and checking no `{{…}}`
  is left and every section opens/closes in balance.

---

## 1. Placeholder vocabulary (160 total)

Syntax: `{{var}}` for values, `{{#flag}}…{{/flag}}` for sections that show or hide.

### Doctor
`full_name`, `speciality`, `introduction`, `education`,
`awards`, `experience`, `totalpatient`, `languages`, `council`, `mci`, `profile`

- `experience` and `totalpatient` are **strings**, e.g. `15` or `15+`.
- Qualification line pattern: `{{awards}},{{education}}`.
- Registration: `{{#hasmic}}…Medical Regd. No.: {{mci}}…{{/hasmic}}`.
- **Hero stat tiles** (Practising Since, Languages, Consultation Modes, in that order). The three tiles use `{{practising_since}}` (the year,
  with `data-practising-since`), `{{languages_count}}` and `{{consultation_modes_count}}`, each
  with `data-counter` (§4). These three are not in the 160-key count above; confirm with the
  backend team that it sends them for every doctor.
- **Fellowships (placeholder `{{fellowship}}`, flag `hasFellowship`).
  Shown ONLY when the backend sends a value:** the line is `<p data-hero-fellowship>` wrapped in
  `<!-- {{#hasFellowship}} -->…<!-- {{/hasFellowship}} -->` (comment-wrapped so an unsupported
  tag never leaks as text), and a small script at the end of `script/index.js` (§4, "Hero
  year and fellowship script") sets `hidden` plus inline `display: none` on it (the inline style
  is needed because classes like `.hero-credentials { display: flex }` would otherwise override
  `hidden`) when the value is empty or the `{{fellowship}}` tag came through unrendered. Never
  hardcode a fellowship in a param site.
  `fellowship` is **one string** holding every fellowship, e.g.
  `FACR (Fellow of the American College of Radiology), USA; EDiR (European Diploma in Radiology), Europe`.
  Each entry already contains a comma, so the backend should separate entries with a
  semicolon. The "Fellowship:" label is fixed template text; the backend sends the value
  only. Rendered as a second `hero-credentials` line under the qualifications line (icon
  `fa-award`); it wraps, so any number of entries is safe. Not counted in the total above.
- **Privacy policy "Who We Are" line:** `Dr. {{full_name}}, {{awards}},{{education}}{{#hasmic}}, Registration No. {{mci}}, {{council}}{{/hasmic}}`.
- **JSON-LD:** `"image": "{{profile}}"`. `{{profile}}` is already a full URL (it's used as
  `<img src="{{profile}}">`), so never prefix it with a domain or folder.

### Clinic and contact
`clinicname`, `address`, `city`, `district`, `state`, `pincode`, `phone`, `code`,
`email`, `whatsapp`, `website`

- Phone pattern: `<a href="tel:+{{code}}{{phone}}">+{{code}}-{{phone}}</a>`.
- Address pattern: `<strong>{{clinicname}}</strong><br />{{address}}<br />{{district}}, {{state}} - {{pincode}}`.

### Social links (both Facebook flags are required)
| Flag pair | URL placeholder | Meaning |
|---|---|---|
| `hasFacebook` / `noFacebook` | `{{facebook}}` | Facebook **profile** |
| `hasFacebookPage` / `noFacebookPage` | `{{facebookpage}}` | Facebook **page** |
| `hasInstagram` / `noInstagram` | `{{instagram}}` | |
| `hasLinkedin` / `noLinkedin` | `{{linkedin}}` | |
| `hasTwitter` / `noTwitter` | `{{twitter}}` | |
| `hasYoutube` / `noYoutube` | `{{youtube}}` | |
| `hasWebsite` / `noWebsite` | `{{website}}` | |
| `hasWhatsapp` / `noWhatsapp` | `{{whatsapp}}` | bare number, see §5a |

`has*` renders the `<a>` link. `no*` renders the disabled `<span>` ("Not Enabled"
tooltip). Used in the header, hero and footer of index, privacy and terms. Never swap the two
Facebook mappings: `hasFacebook` → `{{facebook}}`, `hasFacebookPage` → `{{facebookpage}}`.

**Hero social row**, in this order (FB Profile, FB Page, Instagram, X, LinkedIn,
Website, WhatsApp, YouTube):

```html
<div class="social-links" aria-label="Social media links">
  {{#hasFacebook}}<a href="{{facebook}}" class="social" aria-label="Facebook Profile" data-tooltip="Facebook Profile" data-ga-event="hero_social_link_click" data-ga-label="Facebook Profile"><i class="fa-brands fa-facebook"></i></a>{{/hasFacebook}}
  {{#noFacebook}}<span class="social is-disabled" aria-label="Facebook not linked" data-tooltip="Not Enabled" aria-disabled="true" tabindex="-1"><i class="fa-brands fa-facebook"></i></span>{{/noFacebook}}

  {{#hasFacebookPage}}<a href="{{facebookpage}}" class="social" aria-label="Facebook Page" data-tooltip="Facebook Page" data-ga-event="hero_social_link_click" data-ga-label="Facebook Page"><i class="fa-brands fa-facebook-f"></i></a>{{/hasFacebookPage}}
  {{#noFacebookPage}}<span class="social is-disabled" aria-label="Facebook page not linked" data-tooltip="Not Enabled" aria-disabled="true" tabindex="-1"><i class="fa-brands fa-facebook-f"></i></span>{{/noFacebookPage}}

  {{#hasInstagram}}<a href="{{instagram}}" class="social" aria-label="Instagram" data-tooltip="Instagram" data-ga-event="hero_social_link_click" data-ga-label="Instagram"><i class="fa-brands fa-instagram"></i></a>{{/hasInstagram}}
  {{#noInstagram}}<span class="social is-disabled" aria-label="Instagram not linked" data-tooltip="Not Enabled" aria-disabled="true" tabindex="-1"><i class="fa-brands fa-instagram"></i></span>{{/noInstagram}}

  {{#hasTwitter}}<a href="{{twitter}}" class="social" aria-label="X" data-tooltip="X (Twitter)" data-ga-event="hero_social_link_click" data-ga-label="Twitter"><i class="fa-brands fa-x-twitter"></i></a>{{/hasTwitter}}
  {{#noTwitter}}<span class="social is-disabled" aria-label="X not linked" data-tooltip="Not Enabled" aria-disabled="true" tabindex="-1"><i class="fa-brands fa-x-twitter"></i></span>{{/noTwitter}}

  {{#hasLinkedin}}<a href="{{linkedin}}" class="social" aria-label="LinkedIn" data-tooltip="LinkedIn" data-ga-event="hero_social_link_click" data-ga-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>{{/hasLinkedin}}
  {{#noLinkedin}}<span class="social is-disabled" aria-label="LinkedIn not linked" data-tooltip="Not Enabled" aria-disabled="true" tabindex="-1"><i class="fa-brands fa-linkedin-in"></i></span>{{/noLinkedin}}

  {{#hasWebsite}}<a href="{{website}}" class="social" aria-label="Website" data-tooltip="Website" data-ga-event="hero_social_link_click" data-ga-label="Website"><i class="fa-solid fa-globe"></i></a>{{/hasWebsite}}
  {{#noWebsite}}<span class="social is-disabled" aria-label="Website not linked" data-tooltip="Not Enabled" aria-disabled="true" tabindex="-1"><i class="fa-solid fa-globe"></i></span>{{/noWebsite}}

  {{#hasWhatsapp}}<a href="https://wa.me/91{{whatsapp}}" class="social" aria-label="WhatsApp" data-tooltip="WhatsApp" data-ga-event="hero_social_link_click" data-ga-label="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>{{/hasWhatsapp}}
  {{#noWhatsapp}}<span class="social is-disabled" aria-label="WhatsApp not linked" data-tooltip="Not Enabled" aria-disabled="true" tabindex="-1"><i class="fa-brands fa-whatsapp"></i></span>{{/noWhatsapp}}

  {{#hasYoutube}}<a href="{{youtube}}" class="social" aria-label="YouTube" data-tooltip="YouTube" data-ga-event="hero_social_link_click" data-ga-label="YouTube"><i class="fa-brands fa-youtube"></i></a>{{/hasYoutube}}
  {{#noYoutube}}<span class="social is-disabled" aria-label="YouTube not linked" data-tooltip="Not Enabled" aria-disabled="true" tabindex="-1"><i class="fa-brands fa-youtube"></i></span>{{/noYoutube}}
</div>
```

**Footer social row** (index and both legal pages): the same 8 pairs inside `.footer-social`,
without the `social` class (`<a href="{{facebook}}" aria-label="Facebook Profile" data-tooltip="Facebook Profile" data-ga-event="footer_social_link_click" data-ga-label="Facebook Profile">…</a>`
and `<span class="is-disabled" aria-label="Facebook not linked" data-tooltip="Not Enabled" aria-disabled="true" tabindex="-1">…</span>`).
Disabled spans carry no `data-ga-event`, so they never fire analytics.

**Keep the template's own icon classes.** The patterns above show the minimum markup. If a
template already styles its icons through extra classes (e.g. `class="social social-facebook"`
in the hero, `class="footer-social-icon footer-social-facebook"` in the footer), keep those
classes on both the `<a>` and the disabled `<span>` (`class="footer-social-icon footer-social-facebook is-disabled"`),
or the icons lose their size and colours. Only the href, the has/no wrapping, `aria-label`,
`data-tooltip` and the GA attributes come from the pattern.

### 1.1 Disabled-social CSS (add to `styles/style.css` if missing)

Adapt the selectors if the hero social wrapper uses a different class. The colours are the
site's tokens (`--bg-2`, `--border`, `--muted`, `--text`, `--radius-sm`, `--font-body`); map them
in `:root` if the template names them differently.

```css
/* ============================================================
   Disabled social icons + "Not Enabled" tooltip (parameterized template).
   Dim the glyph and surface, not the whole element, so the tooltip
   stays readable. Tooltip labels are short fixed strings.
   ============================================================ */
.hero-section .social.is-disabled,
.footer-social > span.is-disabled { cursor: not-allowed; }
.hero-section .social.is-disabled,
.hero-section .social.is-disabled:hover {
  background: var(--bg-2);
  border-color: var(--border);
  color: var(--muted);
  transform: none;
}
.footer-social > span.is-disabled {
  width: 36px; height: 36px;
  display: flex; align-items: center; justify-content: center;
  border-radius: var(--radius-sm);
  background: hsla(0,0%,100%,0.06);
  border: 1px solid hsla(0,0%,100%,0.16);
  color: #fff;
  font-size: 18px;
  min-width: 0;
}
.hero-section .social.is-disabled > i,
.footer-social > span.is-disabled > i { opacity: 0.4; }

.hero-section .social[data-tooltip],
.footer-social > [data-tooltip] { position: relative; }
.hero-section .social[data-tooltip]::after,
.footer-social > [data-tooltip]::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%) translateY(4px);
  background: var(--text);
  color: #ffffff;
  font-family: var(--font-body);
  font-size: 16px;
  font-weight: 600;
  line-height: 1.3;
  white-space: nowrap; /* fixed short labels ("Not Enabled", network names), not dynamic content */
  padding: 6px 10px;
  border-radius: 6px;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: opacity 0.18s ease, transform 0.18s ease;
  z-index: 20;
}
.hero-section .social[data-tooltip]::before,
.footer-social > [data-tooltip]::before {
  content: "";
  position: absolute;
  bottom: calc(100% + 1px);
  left: 50%;
  transform: translateX(-50%);
  border: 5px solid transparent;
  border-top-color: var(--text);
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: opacity 0.18s ease;
  z-index: 20;
}
.hero-section .social[data-tooltip]:hover::after,
.hero-section .social[data-tooltip]:hover::before,
.hero-section .social[data-tooltip]:focus-visible::after,
.hero-section .social[data-tooltip]:focus-visible::before,
.footer-social > [data-tooltip]:hover::after,
.footer-social > [data-tooltip]:hover::before,
.footer-social > [data-tooltip]:focus-visible::after,
.footer-social > [data-tooltip]:focus-visible::before {
  opacity: 1;
  visibility: visible;
}
.hero-section .social[data-tooltip]:hover::after,
.hero-section .social[data-tooltip]:focus-visible::after,
.footer-social > [data-tooltip]:hover::after,
.footer-social > [data-tooltip]:focus-visible::after { transform: translateX(-50%) translateY(0); }
```

### System
`slug`, `path`, `micrositeId`, `userid`, `date`

- `{{date}}`: "Effective Date" on privacy-policy.html and terms-of-service.html.
- `{{path}}`: prefix for script and style URLs (`{{path}}/styles/style.css`,
  `{{path}}/script/index.js`).
- `<body data-micrositeid="{{micrositeId}}" data-slug="{{slug}}">`.
- The booking form carries `data-userid="{{userid}}"`, `data-address="{{address}}"`,
  `data-clinicname="{{clinicname}}"`, `data-district="{{district}}"`, `data-state="{{state}}"`,
  `data-pincode="{{pincode}}"` and `data-city="{{city}}"`.

### Banner
`{{#has_banner}}` with `banner_src`, `banner_src_mobile`, `banner_alt`,
`banner_start`, `banner_end`. Wrap the whole banner module in
`{{#has_banner}}…{{/has_banner}}` with `data-banner-active="true"`, and put the fields into
`data-banner-start`, `data-banner-end`, `data-banner-src`, `data-banner-src-mobile`,
`data-banner-alt`, the `<source srcset>` and the `<img src>`/`alt`. Full markup, CSS and JS:
Appendix P.2.

### Loops
| Loop | Fields |
|---|---|
| `{{#services}}` | `title`, `description` (no `icon`, see below) |
| `{{#images}}` | `image` |

`title`, `description`, `rating`, `stars_html` and `profile_picture` are **loop
fields only**. They never appear outside their loop.

```html
<div class="services-grid">
  {{#services}}
  <article class="service-card">
    <div class="service-icon"><i class="fa-solid <specialty-icon>" aria-hidden="true"></i></div>
    <h3>{{title}}</h3>
    <p>{{description}}</p>
  </article>
  {{/services}}
</div>

<div class="gallery-grid">
  {{#images}}
  <figure class="gallery-item">
    <img src="{{image}}" alt="Gallery image" loading="lazy" />
  </figure>
  {{/images}}
</div>
```

**Services icon:** one fixed Font Awesome icon for the whole Services section, hardcoded in the
template, never a `{{icon}}` loop field. Use the icon for the template's specialty in the §3.4 table. The backend can then add or remove services without supplying
an icon.

### Other flags
`{{#hasmic}}`, `{{#has_banner}}`

### Section text with fallback (has_/no_ pairs)
```html
{{#has_X}}{{X}}{{/has_X}}
{{#no_X}}Fallback text written for this microsite{{/no_X}}
```

| Section | Keys (X) |
|---|---|
| About | `about_section_title`, `about_section_subtitle` |
| Services | `service_section_title`, `service_section_subtitle` |
| Philosophy | `philosophy_section_title`, `philosophy_section_subtitle` |
| Philosophy pillars (exactly 3) | `philosophy_section_pillar_text_1`, `philosophy_section_pillar_subtext_1`, `philosophy_section_pillor_text_2`, `philosophy_section_piller_subtext_2`, `philosophy_section_pillar_text_3`, `philosophy_section_pillar_subtext_3` |
| Process | `process_section_about_title`, `process_section_about_subtitle` |
| Process steps (exactly 4) | `process_section_step_body_text_1…4`, `process_section_step_body_subtext_1…4` |
| Gallery | `gallery_section_title`, `gallery_section_subtitle` |
| Contact | `contact_us_subtitle` |

> ⚠️ The pillar 2 keys are spelled `pillor_text_2` and `piller_subtext_2` in the
> backend. Copy them **exactly as spelled**; do not "fix" the spelling.

The fallback text is the microsite's current text for that element. Example:

```html
<h2 class="about-title">
  {{#has_about_section_title}}{{about_section_title}}{{/has_about_section_title}}
  {{#no_about_section_title}}Expert Care, Built Around the Patient{{/no_about_section_title}}
</h2>
```

### Syntax and scope rules
- No other Mustache syntax is used: no `{{{ }}}`, `{{> }}`, `{{^ }}` or `{{! }}`.
- Only the HTML pages (and `robots.txt`, `sitemap.xml`, `llms.txt`, §3.3) contain
  placeholders. JS, CSS and JSON files contain none, so JavaScript reads page data from the
  DOM (`document.body.dataset.slug`, `form.dataset.userid`), never from a `{{…}}` literal.
- No placeholder is used inside an `id`.
- The backend may support keys beyond this list; confirm with the backend team before using one.

### Ids and classes the JavaScript needs
Placeholders are plain text substitution, so they work with any class name or HTML structure,
but the scripts look for specific hooks. Template markup must keep them:
- `index.js`: `#bookingForm`, `#bookingModal`, `#preferredDate`, `#preferredTime`,
  `#clinicVisitTab`, `#onlineConsultTab`, `.cta-btn`, `.faq-item`, `.read-more-*`,
  `.social:not(.is-disabled)`, `[data-cal-*]`, `[data-counter]`, `[data-practising-since]`,
  `[data-hero-fellowship]`, `[data-contact-info]` (full list for booking in §4c).
- `banner-module.js`: `#digidrBannerImg` / `.digidr-banner-img`, `#digidrBannerLink`.
- `chatbot.js`: needs no page markup except `<link id="chatbot-css">` (§4a). It creates all its
  own `chatbot*` elements.

---

## 2. Decisions

| # | Topic | Decision |
|---|---|---|
| 1 | Doctor name outside the FAQ | Every hardcoded name becomes `Dr. {{full_name}}`. There is no surname placeholder. |
| 2 | FAQ section | **Left exactly as it is** in the template, hardcoded names included. The real questions and answers will be provided later. |
| 3 | Hero stat tiles | `{{practising_since}}`, `{{languages_count}}`, `{{consultation_modes_count}}` (§1). Older templates whose third tile is a hardcoded figure (e.g. 98%) keep it hardcoded. |
| 4 | Stat counters | Every template gets the shared text-based counter (§4). |
| 5 | Made-up social-media sections | A hand-written mock `<section id="social-media">` (static fake posts) is **commented out**, together with any nav or footer link to `#social-media`. The live Facebook-posts widget (an empty `#socialMediaTrack` that the JS fills from the DigiDr social-feed API, reading `<body data-slug>`) is a different thing and stays. |
| 6 | Section kickers / small labels | Kept **as they are** (no placeholder exists). |
| 7 | Facebook | Both flags kept: `hasFacebook` → `{{facebook}}` (profile), `hasFacebookPage` → `{{facebookpage}}` (page), each with its `no*` state. |
| 8 | Extra specialty sections | A section unique to one template (e.g. a technology section) stays hardcoded there. Not added to other microsites. |
| 9 | JavaScript | Only three JS changes are in scope: the stat counter (§4), `chatbot.js` (§4a) and the booking code in `index.js` (§4b). Analytics, banner and `auto-open-modal.js` wait for the backend team (§5). |
| 10 | `chatbot.js` `BOT_ICON` | Hardcoded literal, **not** a placeholder: one shared URL for every template (§4a). |
| 11 | Services `{{icon}}` | Dropped from the `{{#services}}` loop. One fixed Font Awesome icon per specialty, hardcoded in the template. Loop is `title` + `description` only. |

---

## 3. Head, meta and SEO files

Every page is served at `https://digidr.app/{{slug}}/…` with **no `.html`** (§0 "Page links").
Use exactly those URLs in the canonical tag, `og:url`, JSON-LD, `sitemap.xml` and `llms.txt`,
so search engines and LLM crawlers see the same URLs the pages link to. Never leave a
`www.example.com` (or other placeholder) domain or a "TODO: replace with live production
domain" comment in a converted template.

### 3.1 `index.html` `<head>`

Keep the head's order and the analytics snippets; change these lines (the description wording
stays specific to the template's specialty, with the doctor's name and specialty templated):

```html
<!-- Clarity tags: microsite is always {{slug}}; specialty is the template's tag slug (§3.4) -->
<script>
  if (typeof clarity === "function") {
    clarity('set', 'microsite', '{{slug}}');
    clarity('set', 'specialty', '<tag-slug>');
  }
</script>

<title>Dr. {{full_name}} | {{speciality}} — [short practice description]</title>
<meta name="description" content="Dr. {{full_name}}, {{speciality}} — [the template's main services, in one sentence]." />
<meta name="robots" content="index, follow" />
<link rel="canonical" href="https://digidr.app/{{slug}}/" />

<meta property="og:type" content="website" />
<meta property="og:url" content="https://digidr.app/{{slug}}/" />
<meta property="og:title" content="Dr. {{full_name}} | {{speciality}}" />
<meta property="og:description" content="Dr. {{full_name}}, {{speciality}}." />
<meta property="og:image" content="{{profile}}" />
<meta property="og:image:type" content="image/jpeg" />
<meta property="og:image:alt" content="Dr. {{full_name}}, {{speciality}}" />
<meta property="og:locale" content="en_US" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Dr. {{full_name}} | {{speciality}}" />
<meta name="twitter:description" content="Dr. {{full_name}}, {{speciality}}." />
<meta name="twitter:image" content="{{profile}}" />

<!-- Library CSS first, then site CSS, all site files under {{path}} -->
<link rel="stylesheet" href="{{path}}/styles/banner-module.css" />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/intl-tel-input@29.2.2/dist/css/intlTelInput.css" />
<link rel="stylesheet" href="{{path}}/styles/style.css" />
<link rel="stylesheet" href="{{path}}/styles/chatbot.css" id="chatbot-css" />

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Physician",
  "name": "Dr. {{full_name}}",
  "medicalSpecialty": "[schema.org MedicalSpecialty for the template, e.g. Otolaryngologic]",
  "image": "{{profile}}",
  "url": "https://digidr.app/{{slug}}/",
  "telephone": "+{{code}}-{{phone}}",
  "email": "{{email}}",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "{{address}}",
    "addressLocality": "{{city}}",
    "addressRegion": "{{state}}",
    "postalCode": "{{pincode}}",
    "addressCountry": "IN"
  }
}
</script>
```

And at the end of `<body>`, in this order (the visitor script, §5b, comes last):

```html
<script src="{{path}}/script/banner-module.js"></script>
<script src="https://cdn.jsdelivr.net/npm/intl-tel-input@29.2.2/dist/js/intlTelInput.min.js"></script>
<script src="{{path}}/script/analytics.js"></script>
<script src="{{path}}/script/index.js"></script>
<script src="{{path}}/script/chatbot.js" defer></script>
```

intl-tel-input v29.2.2 (CSS and JS) must load before `index.js`; the booking code calls
`window.intlTelInput` (§4c). Keep the GA4 `gtag.js` snippet as it is: the Measurement ID is not a
placeholder. `{{profile}}` is already a full URL; never prefix it.

### 3.2 Legal pages `<head>`

`privacy-policy.html` (for `terms-of-service.html`, swap "Privacy Policy" → "Terms of Service",
`privacy-policy` → `terms-of-service`, and use its own description):

```html
<title>Privacy Policy | Dr. {{full_name}}</title>
<meta name="description" content="Privacy policy for Dr. {{full_name}}'s practice, covering how patient and website data is collected, used, and protected." />
<meta name="robots" content="noindex, follow" />
<link rel="canonical" href="https://digidr.app/{{slug}}/privacy-policy" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Dr. {{full_name}}" />
<meta property="og:title" content="Privacy Policy | Dr. {{full_name}}" />
<meta property="og:description" content="Privacy policy for Dr. {{full_name}}'s practice, covering how patient and website data is collected, used, and protected." />
<meta property="og:url" content="https://digidr.app/{{slug}}/privacy-policy" />
<meta property="og:image" content="{{profile}}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Privacy Policy | Dr. {{full_name}}" />
<meta name="twitter:image" content="{{profile}}" />
<link rel="stylesheet" href="{{path}}/styles/style.css" />
<link rel="stylesheet" href="{{path}}/styles/chatbot.css" id="chatbot-css" />
<link rel="stylesheet" href="{{path}}/styles/legal.css" />
```

The legal pages have no JSON-LD. They load `analytics.js`, `index.js` and `chatbot.js` with
`{{path}}` and end with the visitor script (§5b). In the body: the effective date is `{{date}}`,
the Privacy Policy "Who We Are" line follows §1, the Back link is
`<a href="/{{slug}}" class="blog-detail-back-link">`, and the contact card uses `{{clinicname}}`,
`{{email}}`, `+{{code}}-{{phone}}` and the §1 address pattern.

### 3.3 `robots.txt`, `sitemap.xml`, `llms.txt`

These three files are templated like the HTML pages (the backend renders `{{slug}}` in them too).
They are per-microsite drafts: the backend team merges every microsite's copy into one file at
`digidr.app/robots.txt`, `/sitemap.xml` and `/llms.txt`. Keep the top comment that says so.

`robots.txt`:

```
# NOTE: robots.txt only takes effect at the domain root (digidr.app/robots.txt).
# This file is a per-microsite draft — backend team must merge all microsites'
# rules into ONE robots.txt served at digidr.app/robots.txt, and point the
# Sitemap line at the single combined sitemap (see sitemap.xml note in this folder).
# Path below assumes this microsite is served at digidr.app/{{slug}}/

User-agent: *
Allow: /

Sitemap: https://digidr.app/sitemap.xml
```

`sitemap.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!--
  NOTE: A sitemap.xml only takes effect once, at the domain root
  (digidr.app/sitemap.xml). This file is a per-microsite draft listing only
  this doctor's pages — backend team must merge every microsite's <url>
  entries into ONE combined sitemap.xml served at digidr.app/sitemap.xml.
  Path below assumes this microsite is served at digidr.app/{{slug}}/
-->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://digidr.app/{{slug}}/</loc>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://digidr.app/{{slug}}/privacy-policy</loc>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>https://digidr.app/{{slug}}/terms-of-service</loc>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
</urlset>
```

`llms.txt` (llmstxt.org format: H1 name, one-line blockquote, `## Pages`):

```
# NOTE: llms.txt (see llmstxt.org) only takes effect at the domain root
# (digidr.app/llms.txt). This file is a per-microsite draft — backend team
# must merge every microsite's entry into ONE combined llms.txt served at
# digidr.app/llms.txt, one line per doctor under the "Doctors" section below.
# Path below assumes this microsite is served at digidr.app/{{slug}}/

# Dr. {{full_name}}

> Dr. {{full_name}}, {{speciality}}, on DigiDr. Book a consultation online.

- Specialty: {{speciality}}
- Book a consultation: https://digidr.app/{{slug}}/

## Pages

- [Profile](https://digidr.app/{{slug}}/): Dr. {{full_name}}'s profile — about, services, care philosophy, consultation journey, and practice gallery.
- [Privacy Policy](https://digidr.app/{{slug}}/privacy-policy)
- [Terms of Service](https://digidr.app/{{slug}}/terms-of-service)
```

### 3.4 Specialty tag slugs and Services icons

The Clarity `specialty` tag (§3.1) and the fixed Services icon (§1 "Loops") per specialty. Never
invent a new spelling for a specialty that is already listed; a new specialty gets a
lowercase-hyphenated slug and an icon added here (and in AGENTS.md §20) in the same change.

| Folder | Specialty | Clarity tag slug | Services icon (`fa-solid …`) |
|---|---|---|---|
| `microsite-ayurvedic` | Ayurvedic Medicine | `ayurvedic` | `fa-leaf` |
| `microsite-cardiology` | Cardiology | `cardiology` | `fa-heart-pulse` |
| `microsite-dentist` | Dentistry | `dentist` | `fa-tooth` |
| `microsite-ent` | ENT (Ear, Nose & Throat) | `ent` | `fa-ear-listen` |
| `microsite-gastroenterology` | Gastroenterology | `gastroenterology` | `fa-pills` |
| `microsite-general-medicine` | General Medicine | `general-medicine` | `fa-stethoscope` |
| `microsite-general-physician` | General Physician | `general-medicine` | `fa-stethoscope` |
| `microsite-homeopathy` | Homeopathy | `homeopathy` | `fa-mortar-pestle` |
| `microsite-intensivist` | Intensivist / Critical Care | `intensivist` | `fa-heart-circle-bolt` |
| `microsite-neurology` | Neurology | `neurology` | `fa-brain` |
| `microsite-oncology` | Oncology | `oncology` | `fa-ribbon` |
| `microsite-orthopedics` | Orthopedics | `orthopedics` | `fa-bone` |
| `microsite-pediatrician` | Pediatrics | `pediatrician` | `fa-child-reaching` |
| `microsite-plastic-surgery` | Plastic & Cosmetic Surgery | `plastic-surgery` | `fa-wand-magic-sparkles` |
| `microsite-radiology` | Radiology | `radiology` | `fa-x-ray` |
| `microsite-urology` | Urology | `urology` | `fa-droplet` |

Clarity project ID is always the shared `ymqvcvdc4v`; never a per-site ID.

---

## 4. Stat counters

**Why:** a counter that counts up to a hardcoded `data-count-to` value shows the wrong number
once the HTML is templated. With `{{experience}}` = 22 and `data-count-to="15"` the page would
display "15+", and a `data-suffix="k+"` would turn "20000" into "20000k+". The counter must
read its target from the rendered text instead.

### Approach
1. One shared counter script (a self-contained IIFE) in `script/index.js`. It replaces any
   older counter rather than duplicating it.
2. Each stat number element gets a `data-counter` hook, whatever its class name.
3. The target comes from the element's **own text**:
   - `15` → 15 → "15"
   - `15+` → 15 → "15+"
   - `20k+` → 20 → "20k+"
   - `20,000+` → 20000 → "20,000+" (commas kept)
   - Text that doesn't start with a number is left untouched.
4. The real value is in the HTML first, so it shows without JavaScript. The script sets it to
   0 only once the counter is set up, then counts up when the stat scrolls into view. It runs
   once. With `prefers-reduced-motion`, it jumps straight to the final value.
5. Remove `data-count-to` and `data-suffix` everywhere.
6. Hardcoded experience or patient numbers ("12+ Years", "8k+ Children Treated") become
   `{{experience}}` / `{{totalpatient}}`. The label text stays.

### Rules for the counter JavaScript
- Append the counter IIFE below to `script/index.js`, marked with the `// DigiDr Stat Counter`
  comment. Check for that marker first, so it is never added twice.
- If the template has an older counter (e.g. an `// Animated Stat Counters` IIFE that reads
  `data-count-to`), remove only that IIFE. Change nothing else in the file.
- Do not touch the analytics or banner code, or any other script file (§5).
- Test with `15`, `15+`, `20k+`, `20,000+`, an empty value and a non-numeric value, and with
  reduced motion turned on.

### Counter code (append verbatim)

```javascript
// DigiDr Stat Counter
(function () {
  const statEls = document.querySelectorAll("[data-counter]");
  if (!statEls.length) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const DURATION = 1400;

  function parseTarget(text) {
    const match = text.trim().match(/^([\d,]+)(.*)$/);
    if (!match) return null;
    const target = parseInt(match[1].replace(/,/g, ""), 10);
    if (isNaN(target)) return null;
    return { target, prefix: match[1], suffix: match[2] || "" };
  }

  function formatWithCommas(value, template) {
    if (!template.includes(",")) return String(value);
    return value.toLocaleString("en-US");
  }

  function animateCount(el) {
    const original = el.textContent;
    const parsed = parseTarget(original);
    if (!parsed) return;

    const { target, prefix, suffix } = parsed;

    if (prefersReducedMotion) {
      el.textContent = prefix + suffix;
      return;
    }

    el.textContent = "0" + suffix;

    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / DURATION, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);
      el.textContent = formatWithCommas(current, prefix) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  statEls.forEach((el) => observer.observe(el));
})();
```

### Hero year and fellowship script (append verbatim)

Shows only the year in "Practising since" (the backend may send a full date) and hides the
fellowship line when it is empty or unrendered (§1):

```javascript
/* Hero: show only the year in "Practising since"; hide the fellowship line when empty */
(function () {
  var since = document.querySelector('[data-practising-since]');
  if (since) {
    var m = since.textContent.match(/\b(?:19|20)\d{2}\b/);
    if (m) since.textContent = m[0];
  }
  var fel = document.querySelector('[data-hero-fellowship]');
  if (fel && (!fel.textContent.replace(/Fellowship:/i, "").trim() || fel.textContent.indexOf("{{") !== -1)) { fel.hidden = true; fel.style.display = "none"; }
})();
```

### Counter checklist (per microsite)
- [ ] Stat numbers carry `data-counter` (and the practising-since tile `data-practising-since`).
- [ ] Remove `data-count-to` and `data-suffix`.
- [ ] Remove the old counter IIFE, if present.
- [ ] Remove any older "practising since" / fellowship script (e.g. a `/* Hero: show only the
      year in "Practising since" */` IIFE); the hero script below replaces it.
- [ ] Append the shared counter IIFE, if its marker isn't already there.
- [ ] Append the hero year/fellowship script, if missing.

---

## 4a. Chatbot widget (in scope, confirmed with the backend team)

The backend team provided the actual `chatbot.js`. It is **in scope**, alongside the stat
counter (§4) and the booking code (§4b).

### What's confirmed
- **The file is identical on every microsite.** `BOT_NAME` (`'Assistant'`), `BOT_ICON`,
  `API_BASE`, `WELCOME_MSG` and all logic are literals, not placeholders. `BOT_ICON` is one
  shared asset for every template:
  `https://storage.googleapis.com/microsite_buck/microsite-ent-1/assets/chatbot-icon.svg`
  (it happens to be hosted under that bucket folder, but it is the shared icon for all
  specialties; don't swap it per template).
- **Structure:** a self-contained IIFE. Its `injectCSS()` adds
  `<link id="chatbot-css" href="./styles/chatbot.css">` **only if no element with id
  `chatbot-css` exists yet**. It builds the widget as an HTML string and puts it in
  place of a `#chatbot-mount` element if one exists; otherwise it appends it to the
  end of `<body>`.
- **Send flow:** `sendMessage()` posts `FormData` (`Message`) to `POST
  {API_BASE}/api/MicrositeChat?slug={document.body.dataset.slug}` — a **new endpoint**
  not previously listed in this plan's API summary (only booking + analytics were
  known before). Reads the JSON response's `reply`/`message`/`answer`/`response`
  field (first non-empty one wins) as the bot's reply, with a generic fallback string
  if none of those are present or the request fails.
- **Other behavior:** typing indicator, auto-resizing textarea, Enter-to-send
  (Shift+Enter for newline), Escape/outside-click/close-button to close, a
  scroll-collapse effect on the floating action button, and a "Today" divider +
  welcome message shown once per page load (`hasOpened` guard).
- **Known incompleteness, carried over as-is:** the script declares and reads
  `SUGGESTIONS`, `suggWrap`, `suggestions`, `suggPrev`, `suggNext`, and calls
  `updateSuggArrows()` (guarded with `typeof === 'function'`, so it silently no-ops),
  but the `/* ── Suggestion chips ── */` section that would render and wire them up is
  empty in the deployed file. **Decision: implement the file exactly as confirmed,
  including this gap** — do not add chip-rendering code that the deployed file doesn't have.
  Still confirm with the backend team (open question 5 below) whether this is an
  intentional disable or a future feature, but that answer does not block rolling out
  this file as-is now.
- **Icon comment quirk:** the close button's icon comment says *"This microsite loads
  Font Awesome, not Material Symbols"* — a leftover per-site authoring note baked into
  the shared script; harmless (the icon markup itself, `fa-solid fa-xmark`, is
  consistent) and kept as-is since every template already loads Font Awesome.

### Exact code to implement in every microsite's `script/chatbot.js`

Copy verbatim. Nothing changes per microsite.

```javascript
(function () {
    /* ── Config ── */
    var BOT_NAME = 'Assistant';
    var BOT_ICON = 'https://storage.googleapis.com/microsite_buck/microsite-ent-1/assets/chatbot-icon.svg';
    var API_BASE = 'https://digidrapi.digidr.app';

    var WELCOME_MSG = "Hi there! 👋 I'm your Assistant. How can I help you today?";

    var SUGGESTIONS = [
        'What services do you offer?',
        'How to get started?',
        'Pricing plans',
        'Book a demo'
    ];

    /* ── Inject CSS ── */
    (function injectCSS() {
        if (document.getElementById('chatbot-css')) return;
        var link = document.createElement('link');
        link.id = 'chatbot-css';
        link.rel = 'stylesheet';
        link.href = './styles/chatbot.css';
        document.head.appendChild(link);
    })();

    /* ── Build HTML ── */
    function svgSend() {
        return '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22 2L11 13" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>';
    }

    function escHtml(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function getTime() {
        var d = new Date();
        var h = d.getHours(), m = d.getMinutes();
        var ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12 || 12;
        return h + ':' + (m < 10 ? '0' : '') + m + ' ' + ampm;
    }

    var widgetHTML =
        '<div class="chatbot-fab-wrap" id="chatbotFabWrap">' +

        '<div class="chatbot-backdrop" id="chatbotBackdrop" aria-hidden="true"></div>' +

        /* Chat window */
        '<div class="chatbot-window" id="chatbotWindow" style="display:none;" role="dialog" aria-modal="true" aria-label="' + BOT_NAME + ' chat window">' +

        /* Header */
        '<div class="chatbot-header">' +
        '<div class="chatbot-header-avatar">' +
        '<img src="' + BOT_ICON + '" alt="' + BOT_NAME + '">' +
        '</div>' +
        '<div class="chatbot-header-info">' +
        '<p class="chatbot-header-name">' + BOT_NAME + '</p>' +
        '</div>' +
        '<button type="button" class="chatbot-header-close" id="chatbotCloseBtn" aria-label="Close chat">' +
        /* This microsite loads Font Awesome, not Material Symbols */
        '<i class="fa-solid fa-xmark" aria-hidden="true"></i>' +
        '</button>' +
        '</div>' +

        /* Messages */
        '<div class="chatbot-messages" id="chatbotMessages" role="log" aria-live="polite" aria-label="Chat messages"></div>' +

        /* Input */
        '<div class="chatbot-input-area">' +
        '<div class="chatbot-input-wrap">' +
        '<textarea class="chatbot-input" id="chatbotInput" placeholder="Type your message…" rows="1" aria-label="Type your message"></textarea>' +
        '</div>' +
        '<button class="chatbot-send-btn" id="chatbotSendBtn" aria-label="Send message" disabled>' + svgSend() + '</button>' +
        '</div>' +

        /* Footer */
        '<div class="chatbot-footer">Informational only, not medical advice.<br>Consult your doctor</div>' +

        '</div>' +

        /* FAB */
        '<button class="chatbot-fab" id="chatbotFab" aria-label="Open Assistant" aria-expanded="false" aria-controls="chatbotWindow">' +
        '<img class="chatbot-fab-logo" src="' + BOT_ICON + '" alt="" aria-hidden="true">' +
        '<span class="chatbot-fab-text">Ask Doctor</span>' +
        '<span class="chatbot-badge" id="chatbotBadge" aria-label="1 new message">1</span>' +
        '</button>' +

        '</div>';

    /* ── Mount ── */
    var mount = document.getElementById('chatbot-mount');
    if (mount) {
        mount.outerHTML = widgetHTML;
    } else {
        var div = document.createElement('div');
        div.innerHTML = widgetHTML;
        document.body.appendChild(div.firstElementChild);
    }

    /* ── DOM References ── */
    var wrap = document.getElementById('chatbotFabWrap');
    var fab = document.getElementById('chatbotFab');
    var closeBtn = document.getElementById('chatbotCloseBtn');
    var backdrop = document.getElementById('chatbotBackdrop');
    var window_ = document.getElementById('chatbotWindow');
    var messagesEl = document.getElementById('chatbotMessages');
    var inputEl = document.getElementById('chatbotInput');
    var sendBtn = document.getElementById('chatbotSendBtn');
    var suggWrap = document.getElementById('chatbotSuggestionsWrap');
    var suggestions = document.getElementById('chatbotSuggestions');
    var suggPrev = document.getElementById('chatbotSuggPrev');
    var suggNext = document.getElementById('chatbotSuggNext');
    var badge = document.getElementById('chatbotBadge');

    var isOpen = false;
    var hasOpened = false;

    /* ── Helpers ── */
    function addMessage(text, sender) {
        /* sender: 'bot' | 'user' */
        var msgEl = document.createElement('div');
        msgEl.className = 'chatbot-msg ' + sender;

        if (sender === 'bot') {
            msgEl.innerHTML =
                '<div class="chatbot-msg-avatar"><img src="' + BOT_ICON + '" alt="bot"></div>' +
                '<div>' +
                '<div class="chatbot-msg-bubble">' + escHtml(text) + '</div>' +
                '<div class="chatbot-msg-time">' + getTime() + '</div>' +
                '</div>';
        } else {
            msgEl.innerHTML =
                '<div>' +
                '<div class="chatbot-msg-bubble">' + escHtml(text) + '</div>' +
                '<div class="chatbot-msg-time">' + getTime() + '</div>' +
                '</div>';
        }

        messagesEl.appendChild(msgEl);
        scrollToBottom();
    }

    function showTyping() {
        var el = document.createElement('div');
        el.className = 'chatbot-typing';
        el.id = 'chatbotTyping';
        el.innerHTML =
            '<div class="chatbot-msg-avatar"><img src="' + BOT_ICON + '" alt="bot"></div>' +
            '<div class="chatbot-typing-dots"><span></span><span></span><span></span></div>';
        messagesEl.appendChild(el);
        scrollToBottom();
    }

    function hideTyping() {
        var el = document.getElementById('chatbotTyping');
        if (el) el.remove();
    }

    function scrollToBottom() {
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function addDivider(label) {
        var el = document.createElement('div');
        el.className = 'chatbot-divider';
        el.textContent = label;
        messagesEl.appendChild(el);
    }

    function openChat() {
        isOpen = true;
        wrap.classList.add('is-open');
        fab.setAttribute('aria-expanded', 'true');
        if (backdrop) backdrop.setAttribute('aria-hidden', 'false');
        window_.style.display = 'flex';
        window_.classList.remove('is-closing');

        /* Chip widths are 0 while the window is display:none */
        if (typeof updateSuggArrows === 'function') updateSuggArrows();

        if (!hasOpened) {
            hasOpened = true;
            addDivider('Today');
            addMessage(WELCOME_MSG, 'bot');
        }

        /* Hide badge */
        if (badge) badge.style.display = 'none';

        /* Focus input after animation */
        setTimeout(function () { inputEl.focus(); }, 330);
    }

    function closeChat() {
        isOpen = false;
        wrap.classList.remove('is-open');
        fab.setAttribute('aria-expanded', 'false');
        fab.setAttribute('aria-label', 'Open Assistant');
        if (backdrop) backdrop.setAttribute('aria-hidden', 'true');
        window_.classList.add('is-closing');

        setTimeout(function () {
            window_.style.display = 'none';
            window_.classList.remove('is-closing');
            if (fab && fab.focus) fab.focus();
        }, 220);
    }

    /* ── Send message → real MicrositeChat API call ── */
    function sendMessage(text) {
        text = text.trim();
        if (!text) return;

        /* Hide suggestions after first interaction */
        if (suggWrap) suggWrap.style.display = 'none';

        addMessage(text, 'user');
        inputEl.value = '';
        inputEl.style.height = 'auto';
        sendBtn.disabled = true;

        var slug = document.body.dataset.slug || '';

        showTyping();

        var formData = new FormData();
        formData.append('Message', text);

        fetch(API_BASE + '/api/MicrositeChat?slug=' + encodeURIComponent(slug), {
            method: 'POST',
            body: formData
        })
            .then(function (res) {
                if (!res.ok) {
                    throw new Error('MicrositeChat request failed: ' + res.status);
                }
                return res.json();
            })
            .then(function (data) {
                hideTyping();
                var reply =
                    (data && (data.reply || data.message || data.answer || data.response)) ||
                    "Thanks for your message! Our team will get back to you shortly. For immediate assistance, please call or visit our support page.";
                addMessage(reply, 'bot');
            })
            .catch(function (err) {
                console.error('MicrositeChat error:', err);
                hideTyping();
                addMessage(
                    "Sorry, I'm having trouble responding right now. Please call or visit our support page for immediate assistance.",
                    'bot'
                );
            });
    }

    /* ── Auto-resize textarea ── */
    inputEl.addEventListener('input', function () {
        sendBtn.disabled = !inputEl.value.trim();
        inputEl.style.height = 'auto';
        inputEl.style.height = Math.min(inputEl.scrollHeight, 100) + 'px';
    });

    /* ── Send on Enter (Shift+Enter for newline) ── */
    inputEl.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!sendBtn.disabled) sendMessage(inputEl.value);
        }
    });

    /* ── Button events ── */
    fab.addEventListener('click', function () {
        if (!isOpen) openChat();
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', closeChat);
    }

    if (backdrop) {
        backdrop.addEventListener('click', closeChat);
    }

    sendBtn.addEventListener('click', function () {
        sendMessage(inputEl.value);
    });

    /* ── Suggestion chips ── */
    

    /* ── Close on Escape ── */
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && isOpen) closeChat();
    });

    /* ── Close on outside click ── */
    document.addEventListener('click', function (e) {
        if (isOpen && !wrap.contains(e.target)) {
            closeChat();
        }
    });

    /* ── Collapse/Expand FAB on scroll ── */
    function initScrollCollapse() {
        if (!fab) return;
        var lastScrollY = window.pageYOffset || document.documentElement.scrollTop;
        var ticking = false;
        var threshold = 10;

        function onScroll() {
            var currentScrollY = window.pageYOffset || document.documentElement.scrollTop;

            if (currentScrollY <= 50) {
                fab.classList.remove('is-collapsed');
                lastScrollY = currentScrollY;
                ticking = false;
                return;
            }

            var diff = currentScrollY - lastScrollY;
            if (Math.abs(diff) >= threshold) {
                if (diff > 0) {
                    fab.classList.add('is-collapsed');
                } else {
                    fab.classList.remove('is-collapsed');
                }
                lastScrollY = currentScrollY;
            }

            ticking = false;
        }

        window.addEventListener('scroll', function () {
            if (!ticking) {
                window.requestAnimationFrame(onScroll);
                ticking = true;
            }
        }, { passive: true });
    }

    initScrollCollapse();

})();
```

### Required markup (every page)
In `<head>`:
```html
<link rel="stylesheet" href="{{path}}/styles/chatbot.css" id="chatbot-css" />
```
At the end of `<body>`, with the other scripts:
```html
<script src="{{path}}/script/chatbot.js" defer></script>
```
- Keep `id="chatbot-css"` on the link. It stops `injectCSS()` from adding a second
  link with the wrong (`./`) path.
- `<body data-micrositeid="{{micrositeId}}" data-slug="{{slug}}">` (already required
  by §1 "System"). `sendMessage()` reads `document.body.dataset.slug`.
- Font Awesome must be loaded (for `fa-solid fa-xmark`).
- **No `#chatbot-mount` element.** The widget is always appended to `<body>`.

### Chatbot rollout checklist (per template)
- [ ] `script/chatbot.js` = the exact code above. Check the file on every template as part of
      its conversion; don't assume an older demo `chatbot.js` was already replaced.
- [ ] `styles/chatbot.css` exists. If the template has none, use the full stylesheet in
      Appendix P.4; don't redesign it.
- [ ] The `chatbot-css` link in `<head>` and the `chatbot.js` script tag at the end
      of `<body>` on every page, both with `{{path}}`.
- [ ] `<body data-slug="{{slug}}">` is present.
- [ ] No suggestion-chip code added. Ship the file as it is.
- [ ] **Send icon visible.** `chatbot.js` hardcodes `stroke="white"` on the send icon. If the
      template styles `.chatbot-send-btn` with a white background, add this to
      `styles/chatbot.css` (don't edit `chatbot.js`):
      `.chatbot-send-btn svg path { stroke: currentColor; }`. A coloured send button needs
      nothing (white is already correct).

**Open issue — backend chat replies (not a template bug):** replies from
`api/MicrositeChat` can contain unfilled placeholders, e.g. *"Welcome to Dr.
[Doctor's Last Name]'s profile page"*, plus junk contact text. The template only
shows `WELCOME_MSG` itself; everything after that is the API reply printed verbatim,
so `{{full_name}}` can't be used there. Backend team to fix by passing the doctor's
real details for the slug into the chat prompt. Don't patch it client-side in
`chatbot.js`.

---

## 4b. Booking/appointment code (in scope, confirmed with the backend team)

The backend team provided the actual booking/appointment JS. It is **in scope**, alongside the
stat counter (§4) and the chatbot widget (§4a). The code below matches what runs on the
deployed DigiDr microsites, including the consent-checkbox check, and was verified on
2026-10-28 (details in parameterization-log.md). The 4 section-label comments
(`//Available days section`, etc.) are optional markers. The submit handler reads
`result?.data?.type ?? result?.type` and `result?.data?.meetLink ?? result?.meetLink` because
the API nests its reply under `data`.

### Where this code goes: 4 pieces, not one block
Unlike `chatbot.js` (§4a), this is **not a self-contained file or IIFE**. Don't paste
it as one top-level block. The 4 pieces sit in two IIFEs in `script/index.js` (both IIFEs are
given in full in §4c):

| Piece | Goes inside |
|---|---|
| 1. `loadAvailableDays` | `initDatePicker` IIFE, straight after `const doctorId = form.dataset.userid; let availableDays = null;`. Followed by `window.__onAppointmentTypeChange = loadAvailableDays; loadAvailableDays("offline");` |
| 2. Appointment availability | Booking-modal IIFE, straight after the `doctorId` / `clinic*` / tab declarations and `let isOnlineAvailable`, `isOfflineAvailable`, `compressedFile` |
| 3. Slots `change` handler | Booking-modal IIFE, after `preferredDateInput` / `preferredTimeSelect` are declared |
| 4. `let isSubmitting` + submit handler | Booking-modal IIFE, after the slots handler |

The pieces use variables and functions the two IIFEs declare themselves: `form`,
`doctorId`, `availableDays`, `render()`, `clinicName`, `clinicAddress`,
`clinicDistrict`, `clinicState`, `clinicPincode`, `clinicTab`, `onlineTab`,
`isOnlineAvailable`, `isOfflineAvailable`, `appointmentType`, `setActiveTab()`,
`preferredDateInput`, `preferredTimeSelect`, `submitBtn`, `filePreviewDiv`,
`bookingLoader`, `iti`, `phoneUtilsReady`, `compressedFile`, `showError()`,
`clearErrors()`, `validateEmail()`, `validateDateNotPast()`, `showPopup()`,
`closeModal()`, plus the top-level `API_BASE`. For a template with no booking integration,
copy the whole date-picker and booking-modal IIFEs from §4c (they include all of these), then
compare the 4 pieces against the block below. **Delete the template's old booking code**
(e.g. a `// Booking Modal (frontend demo — no API)` IIFE, and any separate date-picker IIFE) in
the same step. Two booking IIFEs on one page both bind the form and double-submit.

### The 4 pieces
1. **Available days** — `loadAvailableDays(type)`: `GET
   getavailabledays?userid=${doctorId}&type=${type}`, populates `availableDays` (a
   lowercased `Set`), then calls `render()`. On failure, falls back to
   `availableDays = null` and logs a warning (doesn't break the page). Lives in the
   date-picker IIFE, not the booking-modal IIFE — it's assigned to
   `window.__onAppointmentTypeChange` and invoked once up front with `"offline"`.
2. **Appointment availability (IIFE, runs on load)**: `GET
   getappointment?userid=${doctorId}` → `{ online, offline }` (both default `true` if
   missing). Hides the online/offline tab whose flag is `false`; if only one mode is
   available, auto-selects it via `setActiveTab()` and fires
   `window.__onAppointmentTypeChange?.(appointmentType)`; if neither is available,
   hides every `.cta-btn`. Non-OK response or fetch failure: logs a warning and keeps
   the default (both shown).
3. **Slots** — on `preferredDateInput` `change`: `POST getslots` with `FormData`
   (`UserId`, `Date`, `Type`), populates `#preferredTime` `<option>`s from the JSON
   array (`slot.id` / `slot.label`), or shows "No Slots Available" if the array is
   empty/missing.
4. **Booking submit** — `form.submit` handler: client-side validation (name, email,
   phone via `iti.isValidNumber()` gated on `phoneUtilsReady`, date not in the past,
   time slot chosen, reason ≥10 chars, **consent checkbox required**), then `POST
   patient_appointment` with `FormData` (`DoctorId`, `FullName`, `Phone`, `Email`,
   `Date`, `Type`, `Day` (computed weekday name), `SlotId`, `Time`, `Reason`, and
   `Upload` if a compressed file exists). Response `type` field (`"online"` /
   `"offline"`) drives a different success popup (`meetLink`-aware for online;
   clinic name/address/district/state/pincode for offline via
   `window.__trackBookingSuccess?.(type)`). Uses an `isSubmitting` guard to block
   double-submits, and a `finally` block that always re-enables the submit button and
   hides the loader.

**Consent check — required in every template:** the booking form has `novalidate`,
so the browser never enforces `required` on the consent checkbox. The
`if (!consentGiven)` block in piece 4 is the only thing that stops a booking without
consent. Every template must have it.

### Exact code (the 4 pieces, verbatim from the backend team)

```javascript
//Available days section
async function loadAvailableDays(type) {
        try {
            const res = await fetch(`${API_BASE}/api/Patient_Appointment/getavailabledays?userid=${doctorId}&type=${type}`);
            const days = await res.json();
            availableDays = new Set((days || []).map(d => d.toLowerCase()));
        } catch (err) {
            console.warn("Failed to load available days:", err.message);
            availableDays = null;
        }
        render();
    }

// Appointment section
(async () => {
        try {

            const response = await fetch(`${API_BASE}/api/Patient_Appointment/getappointment?userid=${doctorId}`);

            if (!response.ok) {
                console.warn(`Appointment API returned ${response.status}, using defaults`);
                return;
            }

            const data = await response.json();

            isOnlineAvailable = data.online ?? true;
            isOfflineAvailable = data.offline ?? true;

            // hide online tab
            if (!isOnlineAvailable && onlineTab) {
                onlineTab.style.display = "none";
            }

            // hide offline tab
            if (!isOfflineAvailable && clinicTab) {
                clinicTab.style.display = "none";
            }

            // auto select available tab
            if (isOnlineAvailable && !isOfflineAvailable) {
                appointmentType = "online";
                setActiveTab("online");
                window.__onAppointmentTypeChange?.(appointmentType);
            }

            if (isOfflineAvailable && !isOnlineAvailable) {
                appointmentType = "offline";
                setActiveTab("clinic");
                window.__onAppointmentTypeChange?.(appointmentType);
            }

            // Hide all book appointment buttons if both are unavailable
            if (!isOnlineAvailable && !isOfflineAvailable) {
                document.querySelectorAll(".cta-btn").forEach(btn => {
                    btn.style.display = "none";
                });
            }

        } catch (err) {
            console.warn("Failed to fetch appointment availability:", err.message);
            // Keep defaults if API fails - don't break the page
        }
    })();


//Slots section
preferredDateInput?.addEventListener("change", async () => {

        const selectedDate = preferredDateInput.value;

        if (!selectedDate) return;

        try {

            const formData = new FormData();

            formData.append("UserId", doctorId);
            formData.append("Date", selectedDate);
            formData.append("Type", appointmentType);

            const response = await fetch(`${API_BASE}/api/Patient_Appointment/getslots`, {
                method: "POST",
                body: formData
            });
            console.log(response);

            const slots = await response.json();

            preferredTimeSelect.innerHTML =
                `<option value="">Select Time Slot</option>`;

            if (!slots || slots.length === 0) {

                preferredTimeSelect.innerHTML =
                    `<option value="">No Slots Available</option>`;

                return;
            }

            slots.forEach(slot => {
                preferredTimeSelect.innerHTML +=
                    `<option value="${slot.id}" data-label="${slot.label}">${slot.label}</option>`;
            });

        } catch (err) {

            console.error(err);

        }
    });


//Patient appointment section

let isSubmitting = false;

    form.addEventListener("submit", async (event) => {

        event.preventDefault();

        if (isSubmitting) {
            return;
        }

        clearErrors();

        const fullName = form.fullName.value.trim();
        const email = form.email.value.trim();
        const phone = form.phone.value.trim();
        const preferredDate = form.preferredDate.value;
        const preferredTime = form.preferredTime.value;
        const selectedTimeOption = preferredTimeSelect.selectedOptions[0];
        const preferredTimeLabel = selectedTimeOption ? selectedTimeOption.dataset.label : "";
        const reason = form.reason.value.trim();
        //const report = form.report.value.trim();
        const consentGiven = form.consentCheckbox.checked;

        let isValid = true;

        if (!fullName) {
            showError("fullName", "Please enter your full name.");
            isValid = false;
        }

        if (!email) {
            showError("email", "Please enter your email address.");
            isValid = false;
        } else if (!validateEmail(email)) {
            showError("email", "Please enter a valid email address.");
            isValid = false;
        }

        if (!phone) {
            showError("phone", "Please enter your phone number.");
            isValid = false;
        } else if (iti && phoneUtilsReady && !iti.isValidNumber()) {
            showError("phone", "Please enter a valid phone number.");
            isValid = false;
        }

        if (!preferredDate) {
            showError("preferredDate", "Please select a preferred date.");
            isValid = false;
        } else if (!validateDateNotPast(preferredDate)) {
            showError("preferredDate", "Date cannot be in the past.");
            isValid = false;
        }

        if (!preferredTime) {
            showError("preferredTime", "Please select a time slot.");
            isValid = false;
        }

        if (!reason || reason.length < 10) {
            showError("reason", "Please provide a brief description (min 10 characters).");
            isValid = false;
        }

        //if (!report || report.length == 0) {
        //    showError("report", "Please provide a image");
        //    isValid = false;
        //}

        // Bug fix: the form has `novalidate`, so the native `required` on the
        // consent checkbox was never enforced and nothing here checked it —
        // users could submit without consenting. Now actually validated.
        if (!consentGiven) {
            showError("consentCheckbox", "Please provide consent to proceed.");
            isValid = false;
        }

        if (!isValid) return;

        isSubmitting = true;
        submitBtn.disabled = true;
        submitBtn.style.display = "none";
        filePreviewDiv.style.display = "none";
        bookingLoader.setAttribute("aria-hidden", "false");

        try {
            const formData = new FormData();

            formData.append("DoctorId", doctorId);
            formData.append("FullName", fullName);
            formData.append("Phone", phone);
            formData.append("Email", email);
            formData.append("Date", preferredDate);
            formData.append("Type", appointmentType);

            const dayName = new Date(preferredDate).toLocaleDateString("en-US", { weekday: "long" });

            formData.append("Day", dayName);
            formData.append("SlotId", preferredTime);
            formData.append("Time", preferredTimeLabel);
            formData.append("Reason", reason);

            // Use compressed file if available
            if (compressedFile) {
                formData.append("Upload", compressedFile);
            }

            const response = await fetch(`${API_BASE}/api/Patient_Appointment/patient_appointment`, {
                method: "POST",
                body: formData
            });

            let result;
            let rawText = await response.text();

            try {
                result = JSON.parse(rawText);
            } catch {
                result = null;
            }

            const appointmentTypeResult = result?.data?.type ?? result?.type; // API now nests details under `data`
            const addressMessage = result?.message;

            if (appointmentTypeResult === "online") {
                const meetLink = result?.data?.meetLink ?? result?.meetLink;
                const msg = meetLink
                    ? `Your appointment is confirmed.<br/><br/>Please join 5 minutes before your scheduled time. Check your email for details.`
                    : "Your online consultation has been booked successfully.";
                showPopup(msg, true);
                window.__trackBookingSuccess?.("online");
            } else if (appointmentTypeResult === "offline") {
                const locationHtml = `
        <strong>Appointment Location:</strong><br/>
        ${clinicName || ""}<br/>
        ${clinicAddress || ""}<br/>
        ${clinicDistrict || ""}${clinicState ? ", " + clinicState : ""}${clinicPincode ? " – " + clinicPincode : ""}
    `;
                const msg = `Hello ${fullName},<br/><br/>
    Your Appointment is Confirmed!<br/><br/>
    ${locationHtml}<br/><br/>
    Confirmation details have been sent to your registered email<br/>
    Please arrive 15 minutes before your scheduled appointment to complete any necessary check-in.
`;
                showPopup(msg, true);
                window.__trackBookingSuccess?.("offline");
            } else if (!response.ok) {
                showPopup(addressMessage || "Something went wrong while booking your appointment.", false);
                return;
            }

            form.reset();
            filePreviewDiv.innerHTML = "";
            clearErrors();
            compressedFile = null;
            closeModal();

        } catch (err) {
            console.error(err);
            alert("Something went wrong.");

        }
        finally {
            isSubmitting = false;
            submitBtn.disabled = false;
            submitBtn.style.display = "block";
            filePreviewDiv.style.display = "block";
            bookingLoader.setAttribute("aria-hidden", "true");
        }
    });
```

### Booking rollout checklist (per template)
- [ ] `script/index.js` has the date-picker IIFE and the booking-modal IIFE with every
      variable and function listed above (copy both from §4c if the template has no booking
      integration).
- [ ] The 4 pieces are in the places given in the table above and match the code
      block line for line (the 4 section-label comments are optional).
- [ ] The `if (!consentGiven)` check is present.
- [ ] The booking form has `data-userid`, `data-clinicname`, `data-address`,
      `data-district`, `data-state` and `data-pincode` (§1 "System").
- [ ] If the template already has part of this (e.g. no `getavailabledays`, or no booking-form
      data attributes), add only what's missing.
- [ ] Don't touch analytics or banner code (still deferred, §5). Chatbot is its own
      file (§4a).
- [ ] **Verify the booking system after parameterization (mandatory).** Once the template
      is parameterized (placeholders in the HTML, `-param` folder), run the verification
      in §4c "Verify the booking system after parameterization" and record the result
      (date, who ran it, what failed). Do not mark a template Done until it passes.

---

## 4c. Full booking system — reference code

§4b lists the four booking pieces. This section holds the **complete booking code** that runs
on the deployed microsites, so a template can be wired up from this file alone.

**Analytics hooks.** The booking-modal IIFE calls `window.trackEvent?.(…)` and
`window.__trackBookingSuccess?.(type)`. Both are optional: `trackEvent` comes from
`script/analytics.js` (Appendix P.3) and `__trackBookingSuccess` may be defined by a separate
analytics block. Keep the `?.` calls so the booking works when a hook is absent. **But define
`__trackBookingSuccess`**, or the GA4 `booking_submitted` event is never sent. Append this to
`index.js` if the template doesn't define it already:

```javascript
// GA4 booking_submitted (AGENTS.md §40). The booking code calls this after a successful
// booking with "online" or "offline"; without it the event is never sent.
window.__trackBookingSuccess = function (type) {
  window.trackEvent?.("booking_submitted", { appointment_type: type });
};
```
 Some deployed
copies send `window.trackEvent?.("report_uploaded")` without a `file_type` param; either form is
fine, as long as no patient-entered data is sent.

**Verification status: verified twice (2026-10-28), working.** A static check plus a mocked-API
run (clinic booking, online booking with a reply nested under `data`, consent unticked, online-only,
clinic-only and neither mode) and a real HTTP round trip against a local server that decoded the
multipart request. The real DigiDr backend was not called; acceptance by the live API still needs
one test booking on a staging backend or an agreed doctor. The phone library was stubbed and
calendar clicks / file pickers were driven by script, not a real browser. Full record in
parameterization-log.md.

**Consent error element.** Add `<p class="booking-error" data-error-for="consentCheckbox"></p>`
after the consent label if the "Please provide consent to proceed." message should be visible.
Without it the booking is still blocked correctly, but the message has nowhere to show.

**Where it goes in `script/index.js`, in this order:** (A) the top-level helpers, then
(B) the phone plugin and date-picker, then (C) the booking-modal IIFE. The four §4b
pieces are already inside (B) and (C). The code has no section-label comments (the
`//Available days section` style labels in §4b are optional); find the pieces by the
function and endpoint names.

### Required page markup (ids and hooks the code reads)

- `#bookingForm` with `data-userid`, `data-clinicname`, `data-address`, `data-district`,
  `data-state`, `data-pincode`, and `novalidate`.
- `#bookingModal` (with `.booking-modal-dialog`), `.cta-btn` (every element with this class
  opens the modal, and is hidden when no appointment mode is offered), `#clinicVisitTab`,
  `#onlineConsultTab`. The code does not read `#openBookingBtn`.
- Fields: `fullName`, `phone`, `email`, `preferredDate` (hidden input) plus the
  `.booking-datepicker` calendar (`[data-cal-title]`, `[data-cal-grid]`, `[data-cal-prev]`,
  `[data-cal-next]`), `#preferredTime` (only the `Select Time Slot` option), `reason`,
  `report` (file), `consentCheckbox`.
- `#submitBtn`, `#bookingLoader`, `#filePreview`, `.booking-error[data-error-for]`.
- Phone input: intl-tel-input v29.2.2 from jsDelivr, CSS and JS loaded before `index.js` (tags in §3.1).
- `<body data-slug>` / `<body data-micrositeid>` as in §1 "System".

### Booking behaviour summary

1. On load, `loadAvailableDays("offline")` fetches the weekdays the doctor works; the
   calendar disables every other day and every past date.
2. `getappointment` hides the Clinic / Online tab the doctor doesn't offer, auto-selects the
   only one left, and hides every `.cta-btn` when neither is offered.
3. Picking a date posts `getslots` and fills `#preferredTime` from `{ id, label }` rows.
4. Submit validates name, email, phone (`iti.isValidNumber()` gated on `phoneUtilsReady`),
   date, slot, reason (≥10 chars) and the **consent checkbox**, then posts
   `patient_appointment` and shows the clinic / online success popup.
5. Uploads are PDF/JPG/PNG up to 5 MB; images are shrunk by `compressImage` (max 800px,
   JPEG 0.5) before being sent as `Upload`.

### (A) Top-level helpers

```javascript
const API_BASE = "https://digidrapi.digidr.app";
//const API_BASE = "https://localhost:7088";
async function compressImage(file) {

    console.log("compressImage started");

    const bitmap = await createImageBitmap(file);

    console.log("bitmap created");

    let width = bitmap.width;
    let height = bitmap.height;

    const maxWidth = 800;
    const maxHeight = 800;

    if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(bitmap, 0, 0, width, height);

    const blob = await new Promise(resolve =>
        canvas.toBlob(resolve, "image/jpeg", 0.5)
    );

    return new File(
        [blob],
        file.name.replace(/\.[^/.]+$/, "") + ".jpg",
        { type: "image/jpeg" }
    );
}

function blobToFile(blob, fileName) {
    return new File([blob], fileName, { type: "image/jpeg" });
}
```

### (B) Phone plugin and date picker

Contains piece 1 (`loadAvailableDays`, §4b) plus the calendar `render()`.

```javascript
// Booking date picker (moved out of the testimonials carousel IIFE — it has
// nothing to do with testimonials, and previously crashed on load because it
// referenced a `form` variable that didn't exist in that scope)

let iti = null;
let phoneUtilsReady = false;

function initPhonePlugin() {
    const form = document.getElementById("bookingForm");
    const phoneInputEl = form?.phone;
    if (!phoneInputEl || !window.intlTelInput) return;

    iti = window.intlTelInput(phoneInputEl, {
        initialCountry: "in",
        countryOrder: ["in"],
        separateDialCode: true,
        loadUtils: () => import("https://cdn.jsdelivr.net/npm/intl-tel-input@29.2.2/dist/js/utils.js"),
    });

    iti.promise.then(() => { phoneUtilsReady = true; }).catch(() => { });

    form.addEventListener("reset", () => {
        iti?.setNumber("");
        iti?.setSelectedCountry("in");
    });
}

initPhonePlugin();

(function initDatePicker() {
    const form = document.getElementById("bookingForm");
    const trigger = document.getElementById("preferredDateText");
    const hiddenInput = document.getElementById("preferredDate");
    const field = document.getElementById("preferredDateField");
    const calendar = document.getElementById("preferredDateCalendar");
    if (!form || !trigger || !hiddenInput || !field || !calendar) return;

    const titleEl = calendar.querySelector("[data-cal-title]");
    const gridEl = calendar.querySelector("[data-cal-grid]");
    const prevBtn = calendar.querySelector("[data-cal-prev]");
    const nextBtn = calendar.querySelector("[data-cal-next]");
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const BOOKING_WINDOW_DAYS = 30;
    const maxBookableDate = new Date(today);
    maxBookableDate.setDate(maxBookableDate.getDate() + BOOKING_WINDOW_DAYS);

    let viewDate = new Date(today.getFullYear(), today.getMonth(), 1);
    let selectedDate = null;

    const doctorId = form.dataset.userid;
    let availableDays = null;

    async function loadAvailableDays(type) {
        try {
            const res = await fetch(`${API_BASE}/api/Patient_Appointment/getavailabledays?userid=${doctorId}&type=${type}`);
            const days = await res.json();
            availableDays = new Set((days || []).map(d => d.toLowerCase()));
        } catch (err) {
            console.warn("Failed to load available days:", err.message);
            availableDays = null;
        }
        render();
    }

    // booking-modal IIFE calls this whenever the clinic/online tab changes
    window.__onAppointmentTypeChange = loadAvailableDays;
    loadAvailableDays("offline");

    function pad(n) { return String(n).padStart(2, "0"); }
    function formatISO(d) { return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }
    function formatDisplay(d) { return `${pad(d.getDate())} ${monthNames[d.getMonth()].slice(0, 3)} ${d.getFullYear()}`; }
    function isSameDay(a, b) {
        return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
    }

    function render() {
        if (!titleEl || !gridEl) return;
        titleEl.textContent = `${monthNames[viewDate.getMonth()]} ${viewDate.getFullYear()}`;
        gridEl.innerHTML = "";

        const firstDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
        const startOffset = firstDay.getDay();
        const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();

        for (let i = 0; i < startOffset; i++) {
            const spacer = document.createElement("span");
            spacer.className = "booking-calendar-day booking-calendar-day--empty";
            gridEl.appendChild(spacer);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const cellDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "booking-calendar-day";
            btn.textContent = String(day);

            const dayName = cellDate.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
            const isUnconfiguredDay = availableDays && availableDays.size > 0 && !availableDays.has(dayName);

            const isOutsideWindow = cellDate > maxBookableDate;

            if (cellDate < today || isUnconfiguredDay) {
                btn.disabled = true;
                btn.classList.add("is-disabled");
            }
            if (isSameDay(cellDate, today)) btn.classList.add("is-today");
            if (isSameDay(cellDate, selectedDate)) btn.classList.add("is-selected");

            btn.addEventListener("click", () => {
                selectedDate = cellDate;
                hiddenInput.value = formatISO(cellDate);
                trigger.value = formatDisplay(cellDate);
                hiddenInput.dispatchEvent(new Event("change", { bubbles: true }));
                close();
            });

            gridEl.appendChild(btn);
        }
        if (nextBtn) {
            const firstOfNextMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
            nextBtn.disabled = firstOfNextMonth > maxBookableDate;
            nextBtn.classList.toggle("is-disabled", nextBtn.disabled);
        }
        // Also stop navigating before the current month
        if (prevBtn) {
            const lastOfPrevMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 0);
            prevBtn.disabled = lastOfPrevMonth < new Date(today.getFullYear(), today.getMonth(), 1);
            prevBtn.classList.toggle("is-disabled", prevBtn.disabled);
        }
    }

    prevBtn?.addEventListener("click", (event) => {
        event.stopPropagation();
        if (prevBtn.disabled) return; // NEW guard
        viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
        render();
    });

    nextBtn?.addEventListener("click", (event) => {
        event.stopPropagation();
        if (nextBtn.disabled) return; // NEW guard
        viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
        render();
    });

    function open() {
        calendar.hidden = false;
        field.classList.add("is-open");
        render();
        document.addEventListener("click", onOutsideClick);
    }

    function close() {
        calendar.hidden = true;
        field.classList.remove("is-open");
        document.removeEventListener("click", onOutsideClick);
    }

    function onOutsideClick(event) {
        if (!field.contains(event.target)) close();
    }

    trigger.addEventListener("click", () => {
        calendar.hidden ? open() : close();
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !calendar.hidden) close();
    });

    //document.addEventListener("keydown", (event) => {
    //    if (event.key === "Escape" && !calendar.hidden) close();
    //});

    // Full form reset, or just the date/time pair when the appointment type is switched.
    function clearSelectedDate() {
        selectedDate = null;
        trigger.value = "";
        hiddenInput.value = "";
        viewDate = new Date(today.getFullYear(), today.getMonth(), 1);
        close();
    }
    form.addEventListener("reset", clearSelectedDate);
    form.addEventListener("slotreset", clearSelectedDate);
})();

```

### (C) Booking modal and form validation

Contains pieces 2, 3 and 4 (§4b): appointment availability, slots, and the submit handler
with the consent check.

```javascript
// Booking Modal & Form Validation
(function () {
    const modal = document.getElementById("bookingModal");
    const dialog = modal?.querySelector(".booking-modal-dialog");
    const backdrop = document.getElementById("bookingModalBackdrop");
    const closeBtn = document.getElementById("bookingModalClose");
    const form = document.getElementById("bookingForm");

    // Guard BEFORE touching form.dataset — previously this bailout ran too
    // late (after several form.dataset.* reads), so a page missing the
    // booking modal/form would throw instead of quietly skipping this IIFE.
    if (!modal || !dialog || !form) return;

    const consentCheckbox = document.getElementById("consentCheckbox");
    const submitBtnEl = document.getElementById("submitBtn") || form.querySelector(".booking-submit-btn");

    if (consentCheckbox && submitBtnEl) {
        submitBtnEl.disabled = !consentCheckbox.checked;

        consentCheckbox.addEventListener("change", (event) => {
            submitBtnEl.disabled = !consentCheckbox.checked;
            // Programmatic syncs from the consent modal are reported by that
            // flow's own events — don't log them as user checkbox clicks.
            if (!event.isTrusted) return;
            window.trackEvent?.("consent_checkbox_click", { checked: consentCheckbox.checked });
        });

        // Intercept disabled property sets to respect consent checkbox state
        const descriptor = Object.getOwnPropertyDescriptor(HTMLButtonElement.prototype, 'disabled');
        if (descriptor) {
            Object.defineProperty(submitBtnEl, 'disabled', {
                get() {
                    return descriptor.get.call(this);
                },
                set(val) {
                    if (!val && !consentCheckbox.checked) {
                        descriptor.set.call(this, true);
                    } else {
                        descriptor.set.call(this, val);
                    }
                },
                configurable: true
            });
        }
    }

    const doctorId = form.dataset.userid;
    const clinicName = form.dataset.clinicname;
    const clinicAddress = form.dataset.address;
    // Bug fix: the HTML only sets data-district (there is no data-city
    // attribute), so this used to always read as `undefined` and rendered
    // literally as "undefined" in the offline booking confirmation message.
    const clinicDistrict = form.dataset.district;
    const clinicState = form.dataset.state;
    const clinicPincode = form.dataset.pincode;
    const clinicTab = document.getElementById("clinicVisitTab");
    const onlineTab = document.getElementById("onlineConsultTab");
    const openTriggers = document.querySelectorAll(".cta-btn");

    let isOnlineAvailable = true;
    let isOfflineAvailable = true;
    let compressedFile = null;

    (async () => {
        try {

            const response = await fetch(`${API_BASE}/api/Patient_Appointment/getappointment?userid=${doctorId}`);

            if (!response.ok) {
                console.warn(`Appointment API returned ${response.status}, using defaults`);
                return;
            }

            const data = await response.json();

            isOnlineAvailable = data.online ?? true;
            isOfflineAvailable = data.offline ?? true;

            // hide online tab
            if (!isOnlineAvailable && onlineTab) {
                onlineTab.style.display = "none";
            }

            // hide offline tab
            if (!isOfflineAvailable && clinicTab) {
                clinicTab.style.display = "none";
            }

            // auto select available tab
            if (isOnlineAvailable && !isOfflineAvailable) {
                appointmentType = "online";
                setActiveTab("online");
                window.__onAppointmentTypeChange?.(appointmentType);
            }

            if (isOfflineAvailable && !isOnlineAvailable) {
                appointmentType = "offline";
                setActiveTab("clinic");
                window.__onAppointmentTypeChange?.(appointmentType);
            }

            // Hide all book appointment buttons if both are unavailable
            if (!isOnlineAvailable && !isOfflineAvailable) {
                document.querySelectorAll(".cta-btn").forEach(btn => {
                    btn.style.display = "none";
                });
            }

        } catch (err) {
            console.warn("Failed to fetch appointment availability:", err.message);
            // Keep defaults if API fails - don't break the page
        }
    })();

    function setBodyScroll(disable) {
        document.body.style.overflow = disable ? "hidden" : "";
    }

    function openModal() {
        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");
        setBodyScroll(true);
    }

    function closeModal() {
        modal.classList.remove("is-open");
        modal.setAttribute("aria-hidden", "true");
        setBodyScroll(false);
    }

    openTriggers.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            openModal();
        });
    });

    closeBtn?.addEventListener("click", closeModal);
    backdrop?.addEventListener("click", closeModal);

    /* ---- Patient Consent modal --------------------------------------------
       Swaps places with the booking modal: opening it hides the booking form
       (entered data is preserved, the form is never reset) and closing it or
       clicking "I Agree" brings the booking form straight back. */
    const consentModal = document.getElementById("consentModal");
    const consentClose = document.getElementById("consentModalClose");
    const consentBackdrop = document.getElementById("consentModalBackdrop");
    const consentAgree = document.getElementById("consentAgreeBtn");
    const consentFooter = document.getElementById("consentModalFooter");
    const consentDialog = consentModal?.querySelector(".consent-modal-dialog");

    // GA4 + Clarity helper for the consent flow. Mirrors the shape used by the
    // delegated data-ga-event tracker, which can't cover these (the Agree button
    // starts disabled, and open/scroll/close aren't clicks on a tagged element).
    function trackConsentEvent(eventName, params) {
      if (typeof gtag === "function") {
        gtag("event", eventName, {
          page_path: window.location.pathname,
          ...params,
        });
      }
      if (typeof trackClarityEvent === "function") {
        trackClarityEvent(eventName);
      } else if (typeof clarity === "function") {
        clarity("event", eventName);
      }
    }

    // Button label always reads "I Agree" — only its disabled state changes.
    // The "Please read the full notice to continue" hint carries the instruction.
    // The dialog itself is the scroller (overflow-y: auto); the body is static.
    function markAsRead() {
      if (!consentAgree) return;
      consentAgree.disabled = false;
      consentFooter?.classList.add("is-read");
      trackConsentEvent("consent_scrolled_to_bottom");
    }

    function checkScrolledToBottom() {
      if (!consentDialog || !consentAgree || !consentAgree.disabled) return;
      const remaining =
        consentDialog.scrollHeight - consentDialog.scrollTop - consentDialog.clientHeight;
      // 8px slack absorbs sub-pixel rounding and zoom levels.
      if (remaining <= 8) markAsRead();
    }

    function resetConsentGate() {
      if (!consentAgree) return;
      consentAgree.disabled = true;
      consentFooter?.classList.remove("is-read");
    }

    function openConsentModal() {
      if (!consentModal) return;
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      consentModal.classList.add("is-open");
      consentModal.setAttribute("aria-hidden", "false");
      setBodyScroll(true);
      resetConsentGate();
      if (consentDialog) consentDialog.scrollTop = 0;
      // If the notice is short enough to need no scrolling, unlock immediately.
      requestAnimationFrame(checkScrolledToBottom);
      consentClose?.focus();
      trackConsentEvent("consent_modal_open");
    }

    function closeConsentModal(agreed, method) {
      if (!consentModal) return;
      // Captured before the gate resets, so we can see whether people who
      // dismissed the notice had actually read to the end.
      const hadRead = consentAgree ? !consentAgree.disabled : false;
      consentModal.classList.remove("is-open");
      consentModal.setAttribute("aria-hidden", "true");
      trackConsentEvent(agreed ? "consent_agreed" : "consent_dismissed", {
        method: method || "unknown",
        scrolled_to_bottom: hadRead,
      });
      if (consentCheckbox) {
        // Consent is granted only via "I Agree" — any other exit leaves it unticked.
        consentCheckbox.checked = !!agreed;
        consentCheckbox.dispatchEvent(new Event("change", { bubbles: true }));
      }
      // Return to the appointment form with all entered data intact.
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      setBodyScroll(true);
      consentCheckbox?.focus();
    }

    // Ticking the checkbox opens the notice; it only stays ticked after "I Agree".
    consentCheckbox?.addEventListener("click", (event) => {
      if (!consentModal) return;
      if (consentCheckbox.checked) {
        event.preventDefault();
        consentCheckbox.checked = false;
        openConsentModal();
      }
    });

    consentDialog?.addEventListener("scroll", checkScrolledToBottom, { passive: true });
    window.addEventListener("resize", checkScrolledToBottom);
    consentClose?.addEventListener("click", () => closeConsentModal(false, "close_button"));
    consentBackdrop?.addEventListener("click", () => closeConsentModal(false, "backdrop"));
    consentAgree?.addEventListener("click", () => closeConsentModal(true, "agree_button"));


    document.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") return;
        // Consent modal sits on top of the booking form — it closes first.
        if (consentModal?.classList.contains("is-open")) {
            closeConsentModal(false, "escape_key");
        } else if (modal.classList.contains("is-open")) {
            closeModal();
        }
    });

    // Slide the tab highlight under the active tab (measured, so it follows any tab width).
    const tabsBar = clinicTab?.parentElement;
    function moveTabIndicator() {
        const current = [clinicTab, onlineTab].find((t) => t?.classList.contains("is-active"));
        if (!tabsBar || !current || !current.offsetWidth) return;
        tabsBar.style.setProperty("--tab-left", current.offsetLeft + "px");
        tabsBar.style.setProperty("--tab-top", current.offsetTop + "px");
        tabsBar.style.setProperty("--tab-width", current.offsetWidth + "px");
        tabsBar.style.setProperty("--tab-height", current.offsetHeight + "px");
        tabsBar.classList.add("is-positioned");
    }
    if (tabsBar && "ResizeObserver" in window) new ResizeObserver(moveTabIndicator).observe(tabsBar);
    window.addEventListener("resize", moveTabIndicator);

    function setActiveTab(active) {
        if (!clinicTab || !onlineTab) return;
        const alreadyActive = (active === "clinic" ? clinicTab : onlineTab).classList.contains("is-active");
        if (active === "clinic") {
            clinicTab.classList.add("is-active");
            onlineTab.classList.remove("is-active");
            clinicTab.setAttribute("aria-selected", "true");
            onlineTab.setAttribute("aria-selected", "false");
        } else {
            clinicTab.classList.remove("is-active");
            onlineTab.classList.add("is-active");
            clinicTab.setAttribute("aria-selected", "false");
            onlineTab.setAttribute("aria-selected", "true");
        }
        moveTabIndicator();
        if (!alreadyActive) {
            // Available days/slots depend on the appointment type, so a date or slot chosen
            // under the other type must not carry over. Name, phone, email etc. are kept.
            form.dispatchEvent(new CustomEvent("slotreset"));
            const timeSelect = document.getElementById("preferredTime");
            if (timeSelect) timeSelect.innerHTML = '<option value="">Select Time Slot</option>';
            showError("preferredDate", "");
            showError("preferredTime", "");
            form.classList.remove("is-switching");
            void form.offsetWidth; // restart the animation
            form.classList.add("is-switching");
        }
    }

    // Fix: previously these two tabs each had TWO click listeners attached
    // (one set here, an identical second set further down) which both called
    // setActiveTab redundantly. Consolidated into a single listener per tab
    // that both switches the UI and updates appointmentType.
    let appointmentType = "offline";

    clinicTab?.addEventListener("click", () => {
        setActiveTab("clinic");
        appointmentType = "offline";
        window.__onAppointmentTypeChange?.(appointmentType);
    });
    // Telemedicine note: hover (mouse) or tap (touch) the info icon; Esc / outside tap closes.
    const infoIcon = document.getElementById("onlineConsultInfo");
    const infoTip = document.getElementById("onlineConsultTip");
    function toggleInfoTip(show) {
      if (!infoIcon || !infoTip) return;
      infoTip.hidden = !show;
      infoIcon.classList.toggle("is-open", show);
    }
    infoIcon?.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") toggleInfoTip(true); });
    infoIcon?.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") toggleInfoTip(false); });
    infoIcon?.addEventListener("click", () => toggleInfoTip(infoTip.hidden));
    document.addEventListener("click", (e) => { if (!infoIcon?.contains(e.target)) toggleInfoTip(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") toggleInfoTip(false); });

    onlineTab?.addEventListener("click", () => {
        setActiveTab("online");
        appointmentType = "online";
        window.__onAppointmentTypeChange?.(appointmentType);
    });

    function markFieldState(name, hasError) {
        const field = form[name];
        const fieldElement = Array.isArray(field) ? field[0] : field;
        if (!fieldElement) return;
        fieldElement.classList.toggle("is-invalid", hasError);
        fieldElement.setAttribute("aria-invalid", hasError ? "true" : "false");
        if (name === "preferredDate") {
            const displayField = document.getElementById("preferredDateText");
            if (displayField) {
                displayField.classList.toggle("is-invalid", hasError);
                displayField.setAttribute("aria-invalid", hasError ? "true" : "false");
            }
        }
    }

    function showError(name, message) {
        const errorEl = form.querySelector(`.booking-error[data-error-for="${name}"]`);
        if (errorEl) {
            errorEl.textContent = message || "";
        }
    }

    function clearErrors() {
        form.querySelectorAll(".booking-error").forEach((el) => {
            el.textContent = "";
        });
    }

    function validateEmail(value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    }

    function validatePhone(value) {
        const phoneRegex = /^\+?[0-9\s-]{7,10}$/;
        return phoneRegex.test(value);
    }

    function validateDateNotPast(value) {
        if (!value) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const chosen = new Date(value);
        return chosen >= today;
    }

    const preferredDateInput = document.getElementById("preferredDate");
    const preferredTimeSelect = document.getElementById("preferredTime");
    const reportInput = document.getElementById("report");
    const filePreviewDiv = document.getElementById("filePreview");
    const bookingLoader = document.getElementById("bookingLoader");
    const submitBtn = document.getElementById("submitBtn");

    if (preferredDateInput) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, "0");
        const dd = String(today.getDate()).padStart(2, "0");
        preferredDateInput.setAttribute("min", `${yyyy}-${mm}-${dd}`);
    }

    // FILE PREVIEW
    reportInput?.addEventListener("change", (e) => {
        const file = e.target.files[0];
        filePreviewDiv.innerHTML = "";
        compressedFile = null;

        if (!file) return;

        const isImage = file.type.startsWith("image/");
        const isPdf = file.type === "application/pdf";

        window.trackEvent?.("report_uploaded", {
            file_type: isPdf ? "pdf" : isImage ? "image" : "other"
        });

        if (isImage) {
            // Show compression status
            filePreviewDiv.innerHTML = `
                <div class="preview-container">
                    <div style="text-align: center; padding: 20px;">
                        <p style="margin: 0; color: #666;">Compressing image...</p>
                    </div>
                </div>
            `;

            (async function () {
                try {
                    // Compress the image
                    console.time("compression");

                    compressedFile = await compressImage(file);

                    console.timeEnd("compression");

                    if (!compressedFile) {
                        throw new Error("Compression failed");
                    }

                    const fileName = file.name;
                    const originalSizeKB = (file.size / 1024).toFixed(2);
                    const compressedSizeKB = (compressedFile.size / 1024).toFixed(2);
                    const compressionPercent = Math.round(
                        ((file.size - compressedFile.size) / file.size) * 100
                    );

                    // Create preview from compressed blob
                    const previewReader = new FileReader();
                    previewReader.onload = (event) => {
                        filePreviewDiv.innerHTML = `
                        <div class="preview-container">
                            <img src="${event.target.result}" alt="Preview" class="preview-image" />
                            <div class="preview-info">
                                <p class="preview-name">${fileName}</p>
                                <p class="preview-size">${compressedSizeKB} KB</p>
                            </div>
                        </div>
                    `;
                    };
                    previewReader.readAsDataURL(compressedFile);

                } catch (err) {
                    console.error("Compression error:", err);
                    filePreviewDiv.innerHTML = `
                    <div class="preview-container">
                        <div style="text-align: center; padding: 20px; color: #f44336;">
                            <p>Error compressing image. Please try another file.</p>
                        </div>
                    </div>
                `;
                }
            })();

        } else if (isPdf) {
            // PDFs are not compressed, just show preview
            const fileSize = (file.size / 1024).toFixed(2);
            compressedFile = file; // Use original PDF

            filePreviewDiv.innerHTML = `
                <div class="preview-container">
                    <div class="preview-pdf">
                        <i class="fa-solid fa-file-pdf"></i>
                    </div>
                    <div class="preview-info">
                        <p class="preview-name">${file.name}</p>
                        <p class="preview-size">${fileSize} KB</p>
                    </div>
                </div>
            `;
        }
    });

    // LOAD SLOTS API
    preferredDateInput?.addEventListener("change", async () => {

        const selectedDate = preferredDateInput.value;

        if (!selectedDate) return;

        try {

            const formData = new FormData();

            formData.append("UserId", doctorId);
            formData.append("Date", selectedDate);
            formData.append("Type", appointmentType);

            const response = await fetch(`${API_BASE}/api/Patient_Appointment/getslots`, {
                method: "POST",
                body: formData
            });
            console.log(response);

            const slots = await response.json();

            preferredTimeSelect.innerHTML =
                `<option value="">Select Time Slot</option>`;

            if (!slots || slots.length === 0) {

                preferredTimeSelect.innerHTML =
                    `<option value="">No Slots Available</option>`;

                return;
            }

            slots.forEach(slot => {
                preferredTimeSelect.innerHTML +=
                    `<option value="${slot.id}" data-label="${slot.label}">${slot.label}</option>`;
            });

        } catch (err) {

            console.error(err);

        }
    });

    let isSubmitting = false;

    form.addEventListener("submit", async (event) => {

        event.preventDefault();

        if (isSubmitting) {
            return;
        }

        clearErrors();

        const fullName = form.fullName.value.trim();
        const email = form.email.value.trim();
        const phone = form.phone.value.trim();
        const preferredDate = form.preferredDate.value;
        const preferredTime = form.preferredTime.value;
        const selectedTimeOption = preferredTimeSelect.selectedOptions[0];
        const preferredTimeLabel = selectedTimeOption ? selectedTimeOption.dataset.label : "";
        const reason = form.reason.value.trim();
        //const report = form.report.value.trim();
        const consentGiven = form.consentCheckbox.checked;

        let isValid = true;

        if (!fullName) {
            showError("fullName", "Please enter your full name.");
            isValid = false;
        }

        if (!email) {
            showError("email", "Please enter your email address.");
            isValid = false;
        } else if (!validateEmail(email)) {
            showError("email", "Please enter a valid email address.");
            isValid = false;
        }

        if (!phone) {
            showError("phone", "Please enter your phone number.");
            isValid = false;
        } else if (iti && phoneUtilsReady && !iti.isValidNumber()) {
            showError("phone", "Please enter a valid phone number.");
            isValid = false;
        }

        if (!preferredDate) {
            showError("preferredDate", "Please select a preferred date.");
            isValid = false;
        } else if (!validateDateNotPast(preferredDate)) {
            showError("preferredDate", "Date cannot be in the past.");
            isValid = false;
        }

        if (!preferredTime) {
            showError("preferredTime", "Please select a time slot.");
            isValid = false;
        }

        if (!reason || reason.length < 10) {
            showError("reason", "Please provide a brief description (min 10 characters).");
            isValid = false;
        }

        //if (!report || report.length == 0) {
        //    showError("report", "Please provide a image");
        //    isValid = false;
        //}

        // Bug fix: the form has `novalidate`, so the native `required` on the
        // consent checkbox was never enforced and nothing here checked it —
        // users could submit without consenting. Now actually validated.
        if (!consentGiven) {
            showError("consentCheckbox", "Please provide consent to proceed.");
            isValid = false;
        }

        if (!isValid) return;

        isSubmitting = true;
        submitBtn.disabled = true;
        submitBtn.style.display = "none";
        filePreviewDiv.style.display = "none";
        bookingLoader.setAttribute("aria-hidden", "false");

        try {
            const formData = new FormData();

            formData.append("DoctorId", doctorId);
            formData.append("FullName", fullName);
            formData.append("Phone", phone);
            formData.append("Email", email);
            formData.append("Date", preferredDate);
            formData.append("Type", appointmentType);

            const dayName = new Date(preferredDate).toLocaleDateString("en-US", { weekday: "long" });

            formData.append("Day", dayName);
            formData.append("SlotId", preferredTime);
            formData.append("Time", preferredTimeLabel);
            formData.append("Reason", reason);

            // Use compressed file if available
            if (compressedFile) {
                formData.append("Upload", compressedFile);
            }

            const response = await fetch(`${API_BASE}/api/Patient_Appointment/patient_appointment`, {
                method: "POST",
                body: formData
            });

            let result;
            let rawText = await response.text();

            try {
                result = JSON.parse(rawText);
            } catch {
                result = null;
            }

            const appointmentTypeResult = result?.data?.type ?? result?.type; // API now nests details under `data`
            const addressMessage = result?.message;

            if (appointmentTypeResult === "online") {
                const meetLink = result?.data?.meetLink ?? result?.meetLink;
                const msg = meetLink
                    ? `Your appointment is confirmed.<br/><br/>Please join 5 minutes before your scheduled time. Check your email for details.`
                    : "Your online consultation has been booked successfully.";
                showPopup(msg, true);
                window.__trackBookingSuccess?.("online");
            } else if (appointmentTypeResult === "offline") {
                const locationHtml = `
        <strong>Appointment Location:</strong><br/>
        ${clinicName || ""}<br/>
        ${clinicAddress || ""}<br/>
        ${clinicDistrict || ""}${clinicState ? ", " + clinicState : ""}${clinicPincode ? " – " + clinicPincode : ""}
    `;
                const msg = `Hello ${fullName},<br/><br/>
    Your Appointment is Confirmed!<br/><br/>
    ${locationHtml}<br/><br/>
    Confirmation details have been sent to your registered email<br/>
    Please arrive 15 minutes before your scheduled appointment to complete any necessary check-in.
`;
                showPopup(msg, true);
                window.__trackBookingSuccess?.("offline");
            } else if (!response.ok) {
                showPopup(addressMessage || "Something went wrong while booking your appointment.", false);
                return;
            }

            form.reset();
            filePreviewDiv.innerHTML = "";
            clearErrors();
            compressedFile = null;
            closeModal();

        } catch (err) {
            console.error(err);
            alert("Something went wrong.");

        }
        finally {
            isSubmitting = false;
            submitBtn.disabled = false;
            submitBtn.style.display = "block";
            filePreviewDiv.style.display = "block";
            bookingLoader.setAttribute("aria-hidden", "true");
        }
    });

    function showPopup(message, success = true) {

        // Remove existing popup if any
        document.getElementById("customPopup")?.remove();

        const popup = document.createElement("div");

        popup.id = "customPopup";

        popup.innerHTML = `
    <div style="
        position:fixed;
        top:0;
        left:0;
        width:100%;
        height:100%;
        background:rgba(0,0,0,.5);
        display:flex;
        justify-content:center;
        align-items:center;
        z-index:999999;
    ">
        <div style="
            background:#fff;
            width:800px;
            max-width:90%;
            border-radius:12px;
            padding:30px;
            text-align:center;
            box-shadow:0 10px 30px rgba(0,0,0,.3);
            animation:popupScale .25s ease;
            font-family:Arial,sans-serif;
        ">

            <div style="
                font-size:65px;
                margin-bottom:15px;
                color:${success ? "#28a745" : "#dc3545"};
            ">
                <i class="fa-solid ${success ? "fa-circle-check" : "fa-circle-xmark"}"></i>
            </div>

            <h2 style="
                margin:0 0 15px;
                color:#333;
            ">
                ${success ? "Success" : "Error"}
            </h2>

            <p style="
                margin:0 0 25px;
                color:#666;
                line-height:1.5;
            ">
                ${message}
            </p>

            <button id="popupOkBtn"
                style="
                    background:${success ? "#28a745" : "#dc3545"};
                    color:#fff;
                    border:none;
                    padding:10px 35px;
                    border-radius:6px;
                    cursor:pointer;
                    font-size:15px;
                ">
                OK
            </button>

        </div>
    </div>
    `;

        document.body.appendChild(popup);

        document.getElementById("popupOkBtn").onclick = () => {
            popup.remove();
        };
    }

})();
```


### Verify the booking system after parameterization (mandatory, every template)

Parameterizing a template changes the HTML (placeholders such as `{{userid}}`,
`{{clinicname}}`, `{{slug}}`) around the booking code, so a template that worked before
can stop working afterwards. After every conversion, and again after any later edit to the
booking markup or `script/index.js`, verify the booking system before calling the template
done:

1. **Static check.** `node --check script/index.js` passes. The four §4b pieces and the
   `if (!consentGiven)` check are present and match §4c (compare with whitespace and
   comments ignored; the only allowed differences are analytics calls). The booking form
   still has `data-userid`, `data-clinicname`, `data-address`, `data-district`,
   `data-state`, `data-pincode`, `novalidate`, and every id listed under "Required page
   markup" above. `{{userid}}` is rendered into `data-userid`, not left in the script.
2. **Render with sample data.** Substitute the placeholders (a numeric `userid`, a clinic
   name, address, district, state, pincode) so no `{{…}}` is left, as in the per-template
   verification in §0.
3. **Run the booking flow against a mock API** (jsdom or a real browser) and check:
   - On load, `getavailabledays` and `getappointment` are called with the doctor's
     `userid`; the calendar enables only the returned weekdays and no past dates.
   - Picking a date calls `getslots` and fills `#preferredTime`.
   - Valid details with consent ticked send exactly one `POST patient_appointment`
     (`multipart/form-data`) with `DoctorId`, `FullName`, `Phone`, `Email`, `Date`, `Type`,
     `Day`, `SlotId`, `Time`, `Reason` (and `Upload` when a report is attached), and the
     correct clinic or online confirmation popup appears.
   - Consent unticked: no request is sent.
   - Modes: online-only and clinic-only auto-select the single tab and send the matching
     `Type`; when neither is offered every `.cta-btn` is hidden.
   - No JavaScript errors on `index.html`, `privacy-policy.html` or
     `terms-of-service.html`.
4. **Real HTTP round trip (recommended).** Point `API_BASE` at a local server that decodes
   the multipart request and confirm the fields above actually arrive, as in the
   verification status of this section.
5. **One real test booking (before go-live).** The mocked checks cannot show that the live
   API accepts the request. Submit one test booking on a staging backend, or with an agreed
   doctor on the live one, and confirm it appears in the backend and the email is sent.

Record the date, who ran it, and anything that failed. A template whose booking has not
been verified this way is not Done.


---

## 5. JavaScript: analytics, banner and auto-open-modal (deferred)

Reference only (**do not implement yet**):

- The deployed microsites share one backend integration:
  - `API_BASE = "https://digidrapi.digidr.app"`
  - Booking: `api/Patient_Appointment/getavailabledays`, `getslots`,
    `getappointment`, `patient_appointment` (§4b, §4c)
  - Chat: `api/MicrositeChat?slug=` (§4a)
  - Analytics: `api/MicrositeAnalytics/analytics/track`
  - Visitor count: `api/Microsite/{micrositeId}/visit` (§5b)
  - Reads `data-userid`, `data-clinicname`, `data-address`, `data-district`,
    `data-state`, `data-pincode` (booking form) and `data-micrositeid` (`<body>`).
- Other script files:
  | File | Notes |
  |---|---|
  | `analytics.js` | GA4 + Clarity event helper (Appendix P.3). Leave as is during a conversion; add it if missing. |
  | `banner-module.js` | Shared banner script (Appendix P.2). Leave as is; add it if missing. |
  | `chatbot.js` | In scope, §4a |
  | `auto-open-modal.js` | Not loaded by any HTML page. Leave as is; don't add a `<script>` for it. |

**Still not covered:** `MicrositeAnalytics/analytics/track`, `banner-module.js`, and
`auto-open-modal.js`. Open questions for the backend team:
1. Is the repo copy of the analytics, banner and auto-open-modal JS the same as what's deployed?
2. Does the backend add any scripts to the page when it renders it? For example, is
   that how `auto-open-modal.js` gets loaded?
3. Which request and response fields does the analytics API require? (Booking: §4b. Chat:
   `api/MicrositeChat?slug=`, `FormData.Message` → `{reply|message|answer|response}`, §4a.)
4. Is the empty "Suggestion chips" section in `chatbot.js` an intentional disable or
   an unfinished feature to complete later? (See §4a.)

---

## 5b. Visitor counter (in scope, `index.html`, `privacy-policy.html` and `terms-of-service.html`)

This inline script goes at the end of **every page whose footer has the visitor badge**
(`index.html` and both legal pages), before `</body>`, verbatim
(the old empty-testimonials cleanup script was removed along with the section):

```html
<script>
    (function () {
        const micrositeId = document.body.dataset.micrositeid;
        const el = document.getElementById("visitorCount");
        if (!micrositeId || !el) return;

        fetch(`https://digidrapi.digidr.app/api/Microsite/${micrositeId}/visit`, {
            method: "POST"
        })
            .then(res => res.ok ? res.json() : Promise.reject(res.status))
            .then(data => {
                el.textContent = data.visitorCount.toLocaleString();
            })
            .catch(err => console.error("Visitor count error:", err));
    })();
</script>
```


Requirements:
- `<body data-micrositeid="{{micrositeId}}" ...>`.
- A footer element with `id="visitorCount"`, inside the `.footer-visitor-badge` markup (markup
  and CSS in Appendix P.1).
- The old localStorage visitor placeholder in `script/index.js` (if the template has one) must
  return early when `.footer-visitor-badge` already exists, or it overwrites the real count.
- Never a hardcoded count (e.g. "500") next to or instead of the live badge.

---

## 5a. WhatsApp link (resolved)

**`{{whatsapp}}` is confirmed: a bare number, no country code** (e.g. `9876543210`,
not `+919876543210` or a full `wa.me` link). Confirmed by the backend team
(2026-09-24).

**Decision: WhatsApp is its own field, not derived from `{{phone}}`.** A doctor's
WhatsApp number is a separate contact channel — potentially different from their
clinic phone, or absent entirely (hence `{{hasWhatsapp}}`/`{{noWhatsapp}}` existing
as their own flag pair, same as every other social link). Do not build the WhatsApp
link from `{{code}}{{phone}}`.

**The rule, everywhere a WhatsApp icon appears (hero, footer, on every page type):**
```html
{{#hasWhatsapp}}<a href="https://wa.me/91{{whatsapp}}" …><i class="fa-brands fa-whatsapp"></i></a>{{/hasWhatsapp}}
{{#noWhatsapp}}<span class="… is-disabled" … data-tooltip="Not Enabled">…</span>{{/noWhatsapp}}
```
`91` is hardcoded (India) — `{{whatsapp}}` carries no country code, and there is no
separate placeholder for one. If a future doctor is outside India this will need
revisiting; not a concern for the current roster.

The disabled state is the `{{#noWhatsapp}}` span shown in §1. Never build the link from
`{{code}}{{phone}}`, and never leave a bare `href="{{whatsapp}}"` without the `https://wa.me/91`
prefix (that is a broken link).

---

## 6. Per-template conversion checklist (HTML only)

For each `<Specialty>/microsite-*/` folder:

**All pages**
- [ ] Replace every hardcoded doctor name **outside the FAQ** with `Dr. {{full_name}}`.
- [ ] Replace the specialty display text with `{{speciality}}`.
- [ ] Header, hero and footer social rows: all 8 `has*` / `no*` pairs, with the
      correct Facebook mapping.
- [ ] Every doctor-name brand block (header, and the footer where it repeats the
      name) has `{{speciality}}` directly after `Dr. {{full_name}}`, with no
      hardcoded prefix such as "Board-Certified". Footers that only have the
      "Dr. {{full_name}}. All rights reserved" line don't need it.
- [ ] Every relative link to another page (nav, logo, footer, the legal pages'
      back button, the booking consent modal `.consent-modal-links`)
      uses `/{{slug}}/<page>` with no `.html`: `/{{slug}}`, `/{{slug}}/#about`,
      `/{{slug}}/privacy-policy`, `/{{slug}}/terms-of-service`.
      Never a bare `index.html` / `privacy-policy.html` / `terms-of-service.html`. Same-page `#anchor` links on index.html stay as they are.


**index.html**
- [ ] Hero: `{{profile}}`, `{{awards}},{{education}}`, `{{#hasmic}}{{mci}}`,
      `{{languages}}`, the stat tiles (§1 "Hero stat tiles"). Optional fellowship line:
      `{{#hasFellowship}}Fellowship: {{fellowship}}{{/hasFellowship}}` (comment-wrapped, §1).
- [ ] Banner block wrapped in `{{#has_banner}}` with the banner fields.
- [ ] About: title and subtitle has_/no_ pairs, `{{introduction}}`.
- [ ] Services: title and subtitle pairs, cards become a `{{#services}}` loop
      (`title` + `description` only — no `{{icon}}` field; icon is one fixed
      Font Awesome class per specialty, hardcoded in the template markup).
- [ ] Philosophy: title, subtitle and 3 pillar pairs (keep the backend spellings).
- [ ] Process: title, subtitle and 4 step pairs.
- [ ] Contact: `contact_us_subtitle` pair, `{{clinicname}}`, `{{address}}`,
      `{{district}}, {{state}} - {{pincode}}`, `+{{code}}-{{phone}}`, `{{email}}`.
- [ ] Gallery: title and subtitle pairs, images become an `{{#images}}` loop.
- [ ] FAQ: **leave unchanged.**
- [ ] Kickers: leave unchanged.
- [ ] `<body data-micrositeid="{{micrositeId}}" data-slug="{{slug}}">` and the booking
      form data attributes.
- [ ] Script and style URLs prefixed with `{{path}}`.
- [ ] `<head>`, end-of-body scripts and JSON-LD as in §3.1: `https://digidr.app/{{slug}}/`
      canonical and `og:url`, `{{profile}}` image, Clarity `microsite` = `{{slug}}` and
      `specialty` from §3.4. No `example.com` and no TODO comment left.

**privacy-policy.html / terms-of-service.html**
- [ ] Effective Date → `{{date}}` (currently "1 June 2026" or "[Insert Date]").
- [ ] Doctor name, contact details and social rows as above.
- [ ] `<head>` as in §3.2 (canonical and `og:url` without `.html`); Back link `/{{slug}}`.

**robots.txt / sitemap.xml / llms.txt**
- [ ] As in §3.3: `digidr.app` URLs with `{{slug}}`, no `.html`, top comment kept.


**Template-specific**
- [ ] Comment out any hand-written mock `<section id="social-media">` and its `#social-media`
      links (Decision 5).
- [ ] Keep sections unique to this template hardcoded (Decision 8).
- [ ] Templates with more than one sample doctor name (e.g. a different name in the About bio)
      convert every one of them to `Dr. {{full_name}}` outside the FAQ.

**Counter:** complete the counter checklist in §4.

**Chatbot:** complete the chatbot rollout checklist in §4a.

**Booking:** complete the booking rollout checklist in §4b, then verify the booking system after parameterization (§4c). A template is not Done until that verification passes.

**Do not touch:** `script/*.js`, except for the counter IIFE (§4), `chatbot.js`
(§4a), and the booking-modal splice (§4b) — analytics, banner, and
`auto-open-modal.js` stay deferred (§5).

---

## Appendix P. Shared files a template may be missing

A microsite built to the current standard already has all of these. Older templates may lack one
or more; add the missing ones verbatim during the conversion. Every colour is a site token
(`--brand`, `--brand-dark`, `--accent`, `--accent-dark`, `--accent-rgb` as an `r, g, b` triplet,
`--bg-2`, `--surface`, `--border`, `--text`, `--muted`, `--radius-sm`). If the template names its
tokens differently, map them in `:root` (e.g. `--accent: var(--amber);`) rather than editing
these files.

### P.1 Footer visitor badge (§5b)

Markup, on all three pages: inside the footer's right-hand column (under the Legal links) where
the footer has one, or, in an older single-column footer, directly before the copyright line:

```html
<div class="footer-visitor-badge" role="status">
  <i class="fa-solid fa-users footer-visitor-badge-icon" aria-hidden="true"></i>
  <span class="footer-visitor-badge-label">No. of Visitor:</span>
  <strong class="footer-visitor-badge-count" id="visitorCount">0</strong>
</div>
```

CSS for a dark footer (invert the light-on-dark colours if the footer background is light):

```css
.footer-visitor-badge {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-top: 6px;
  padding: 10px 18px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.10);
  border: 1px solid rgba(255, 255, 255, 0.28);
  font-size: 18px;
  line-height: 1.4;
  max-width: 100%;
  color: #ffffff !important;
}
.footer-visitor-badge i,
.footer-visitor-badge .footer-visitor-badge-icon { font-size: 16px; color: #ffffff !important; }
.footer-visitor-badge span,
.footer-visitor-badge .footer-visitor-badge-label { color: #f1f5f9 !important; font-weight: 500; }
.footer-visitor-badge .footer-visitor-badge-count { font-weight: 700; color: #ffffff !important; font-variant-numeric: tabular-nums; }
```

### P.2 Banner module, parameterized (§1 "Banner")

The first child of the hero section. The backend renders it only when the doctor has an active
banner:

```html
{{#has_banner}}
<div
  class="digidr-banner-module single-image-banner-section"
  id="digidrBannerModule"
  data-banner-active="true"
  data-banner-start="{{banner_start}}"
  data-banner-end="{{banner_end}}"
  aria-label="Main Clinic Banner"
  data-banner-src="{{banner_src}}"
  data-banner-src-mobile="{{banner_src_mobile}}"
  data-banner-alt="{{banner_alt}}"
  data-banner-href="#"
>
  <div class="container digidr-banner-container single-image-banner-container">
    <a href="#" class="digidr-banner-link" id="digidrBannerLink" aria-label="Clinic Promo Banner">
      <div class="digidr-banner-wrap single-image-banner-wrap">
        <picture>
          <source media="(max-width: 768px)" srcset="{{banner_src_mobile}}" />
          <img src="{{banner_src}}" alt="{{banner_alt}}" class="digidr-banner-img single-image-banner-img" id="digidrBannerImg" loading="eager" />
        </picture>
      </div>
    </a>
  </div>
</div>
{{/has_banner}}
```

`styles/banner-module.css`:

```css
/* ==========================================================================
   DigiDr Modular Banner System — Component Stylesheet
   ========================================================================== */

.digidr-banner-module {
  width: 100%;
  margin-top: 16px;
  padding: 10px 0 24px;
  background-color: transparent;
  min-width: 0;
  box-sizing: border-box;
  position: relative;
  z-index: 1; /* Elevate banner above absolute background patterns */
}

.digidr-banner-module[data-banner-active="false"] {
  display: none !important;
}

.digidr-banner-container {
  /* Width comes from shared .container so banner aligns with hero cards */
  min-width: 0;
  box-sizing: border-box;
  padding: 0;
}

.digidr-banner-link {
  display: block;
  width: 100%;
  text-decoration: none;
  color: inherit;
  outline: none;
  cursor: default;
}

.digidr-banner-link[href]:not([href="#"]) {
  cursor: pointer;
}

.digidr-banner-wrap {
  position: relative;
  width: 100%;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 12px 35px rgba(214, 51, 132, 0.14), 0 4px 15px rgba(0, 0, 0, 0.04);
  border: 3px solid #ffffff;
  background: #ffffff;
  height: auto !important;
  min-height: fit-content;
  max-width: 100%;
}

.digidr-banner-img {
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 2.5; /* Fixed banner ratio on desktop */
  object-fit: cover;
  object-position: center;
  display: block;
  transition: transform 0.4s ease, filter 0.3s ease;
  max-width: 100%;
}

.digidr-banner-link[href]:not([href="#"]):hover .digidr-banner-img,
.digidr-banner-wrap:hover .digidr-banner-img {
  transform: scale(1.012);
}

@media (max-width: 768px) {
  .digidr-banner-section,
  .digidr-banner-module {
    margin-top: 10px;
    padding: 10px 0 16px;
  }
  .digidr-banner-wrap {
    border-radius: 14px;
    border-width: 2px;
  }
  .digidr-banner-img {
    aspect-ratio: 16 / 5; /* Force 16:5 aspect ratio on mobile for readability */
    max-height: none;
  }
}
```

`script/banner-module.js`:

```javascript
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
```

### P.3 `script/analytics.js`

GA4 + Clarity event helper. Loaded before `index.js` on every page (§3.1); the booking code calls
`window.trackEvent?.(…)` from it.

```javascript
// GA4 analytics - all event tracking for this microsite lives in this file.
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
```

### P.4 `styles/chatbot.css` (§4a)

The stylesheet for `chatbot.js`. Colours come from `--accent`, `--accent-dark` and `--accent-rgb`.
The send-button rule near the end is the "send icon visible" fix from the §4a checklist.

```css
/* ============================================================
   Chatbot Widget
   ============================================================ */

/* Microsite primary colour (see --accent / --accent-dark in styles/style.css)
   — solid brand colour, no gradients. */
:root {
    --chatbot-primary: var(--accent, #f69c1e);
    --chatbot-primary-hover: var(--accent-dark, #a6520c);
}

/* ── Floating Action Button ── */
.chatbot-fab-wrap {
    position: fixed;
    bottom: 40px;
    right: 28px;
    left: auto;
    z-index: 9999;
}

.chatbot-fab {
    /* The FAB is absolutely positioned inside a zero-width fixed wrap, so the
       global reset's `button { max-width: 100% }` would resolve to 0 and clip
       the label. Size to content and opt out of that cap. */
    width: max-content;
    max-width: none;
    min-width: 100px;
    height: 50px;
    padding: 7px 16px 7px 10px;
    box-sizing: border-box;
    border-radius: 999px;
    /* <button> doesn't inherit font-family from the page by default — without
       this, the "Ask Doctor" label and badge render in the browser's UI font
       instead of the site's. */
    font-family: inherit;
    /* White pill with a brand-colour rim — professional, not candy-bright. */
    background: #ffffff;
    border: 2px solid var(--chatbot-primary);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    box-shadow:
        0 6px 16px -6px rgba(var(--accent-rgb, 246, 156, 30), 0.30),
        0 2px 6px rgba(15, 23, 42, 0.10);
    transition:
        background 0.15s ease,
        width 0.35s cubic-bezier(0.34, 1.25, 0.64, 1),
        min-width 0.35s cubic-bezier(0.34, 1.25, 0.64, 1),
        height 0.35s cubic-bezier(0.34, 1.25, 0.64, 1),
        padding 0.35s cubic-bezier(0.34, 1.25, 0.64, 1),
        gap 0.35s ease,
        transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
        box-shadow 0.25s ease,
        opacity 0.22s ease,
        visibility 0.22s ease;
    position: absolute;
    bottom: 0;
    right: 0;
    left: auto;
    overflow: visible;
    isolation: isolate;
}

.chatbot-fab.is-collapsed {
    min-width: 54px;
    width: 54px;
    height: 54px;
    padding: 5px;
    gap: 0;
}

.chatbot-fab:hover {
    transform: scale(1.06);
    background: #ffffff;
    border-color: var(--chatbot-primary-hover);
    box-shadow:
        0 8px 20px -6px rgba(var(--accent-rgb, 246, 156, 30), 0.38),
        0 3px 8px rgba(15, 23, 42, 0.12);
}

.chatbot-fab:focus-visible {
    outline: none;
    box-shadow:
        0 0 0 4px #ffffff,
        0 0 0 7px rgba(var(--accent-rgb, 246, 156, 30), 0.55),
        0 10px 26px -6px rgba(var(--accent-rgb, 246, 156, 30), 0.35);
}

.chatbot-fab:active {
    transform: scale(0.96);
}

.chatbot-fab img {
    width: 32px;
    height: 32px;
    object-fit: contain;
    border-radius: 50%;
    transition: width 0.3s ease, height 0.3s ease, opacity 0.2s ease;
    flex-shrink: 0;
    position: relative;
    z-index: 1;
}

.chatbot-fab.is-collapsed img {
    width: 36px;
    height: 36px;
}

.chatbot-fab-text {
    /* Brand colour on white pill. Set explicitly — the global
       reset's `span { color }` otherwise beats inherited button colour. */
    color: var(--chatbot-primary-hover);
    font-size: 16px;
    font-weight: 700;
    line-height: 1;
    letter-spacing: 0.01em;
    white-space: nowrap;
    position: relative;
    z-index: 1;
    max-width: 150px;
    opacity: 1;
    transition: max-width 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease;
    overflow: hidden;
    display: inline-block;
}

.chatbot-fab.is-collapsed .chatbot-fab-text {
    max-width: 0;
    opacity: 0;
}

.chatbot-fab-wrap.is-open .chatbot-fab {
    display: none;
}

/* ── Notification Badge ── */
.chatbot-badge {
    position: absolute;
    top: -4px;
    right: -4px;
    z-index: 2;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #FF4757;
    border: 2px solid #fff;
    font-size: 9px;
    font-weight: 700;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.chatbot-fab-wrap.is-open .chatbot-badge {
    display: none;
}

/* Mobile backdrop (blur when chat is open) */
.chatbot-backdrop {
    display: none;
}

@media (max-width: 768px) {
    .chatbot-backdrop {
        position: fixed;
        inset: 0;
        z-index: 0;
        background: rgba(15, 23, 42, 0.35);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.28s ease;
    }

    .chatbot-fab-wrap.is-open .chatbot-backdrop {
        display: block;
        opacity: 1;
        pointer-events: auto;
    }
}

@media (max-width: 768px) and (prefers-reduced-motion: reduce) {
    .chatbot-backdrop {
        backdrop-filter: none;
        -webkit-backdrop-filter: none;
        background: rgba(15, 23, 42, 0.5);
    }
}

/* ── Chat Window ── */
.chatbot-window {
    position: relative;
    z-index: 1;
    width: 400px;
    max-width: calc(100vw - 24px);
    max-height: min(620px, calc(100dvh - 110px));
    height: min(580px, calc(100dvh - 110px));
    background: #ffffff;
    border-radius: 24px;
    box-shadow:
        0 0 0 1px rgba(0, 0, 0, 0.04),
        0 24px 48px -12px rgba(var(--accent-rgb, 246, 156, 30), 0.15),
        0 12px 24px -8px rgba(0, 0, 0, 0.08);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transform-origin: bottom right;
    animation: chatbot-open 0.28s cubic-bezier(0.22, 1, 0.36, 1) both;
    border: none;
    isolation: isolate;
}

@keyframes chatbot-open {
    from { opacity: 0; transform: scale(0.92) translateY(12px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
}

.chatbot-window.is-closing {
    animation: chatbot-close 0.2s cubic-bezier(0.4, 0, 1, 1) both;
}

@keyframes chatbot-close {
    from { opacity: 1; transform: scale(1) translateY(0); }
    to   { opacity: 0; transform: scale(0.96) translateY(8px); }
}

/* Fallback for browsers without dvh */
@supports not (height: 1dvh) {
    .chatbot-window {
        max-height: min(600px, calc(100vh - 110px));
        height: min(560px, calc(100vh - 110px));
    }
}

/* ── Header ── */
.chatbot-header {
    background: #ffffff;
    padding: 16px 18px;
    display: flex;
    align-items: center;
    gap: 12px;
    flex-shrink: 0;
    position: relative;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.chatbot-header::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 3px;
    background: var(--chatbot-primary);
    opacity: 0.9;
}

.chatbot-header-avatar {
    width: 44px;
    height: 44px;
    padding: 0;
    border-radius: 50%;
    background: #ffffff;
    border: 1px solid rgba(var(--accent-rgb, 246, 156, 30), 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(var(--accent-rgb, 246, 156, 30), 0.08);
}

.chatbot-header-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
}

.chatbot-header-info {
    flex: 1;
    min-width: 0;
}

.chatbot-header-name {
    font-size: 16px;
    font-weight: 600;
    color: #111827;
    margin: 0;
    line-height: 1.25;
    letter-spacing: -0.02em;
}

.chatbot-header-close {
    margin-left: auto;
    width: 36px;
    height: 36px;
    border: none;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.06);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
    color: #374151;
    transition: background 0.15s ease, color 0.15s ease;
}

.chatbot-header-close:hover {
    background: rgba(var(--accent-rgb, 246, 156, 30), 0.1);
    color: var(--accent, #f69c1e);
}

.chatbot-header-close:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(var(--accent-rgb, 246, 156, 30), 0.25);
}

.chatbot-header-close i {
    font-size: 22px;
}

/* ── Suggested Quick Replies ── */
.chatbot-suggestions-wrap {
    display: flex;
    align-items: center;
    gap: 2px;
    flex-shrink: 0;
    background: var(--bg, #fff5f8);
    border-top: 1px solid rgba(var(--accent-rgb, 246, 156, 30), 0.1);
    padding-top: 12px;
}

.chatbot-suggestions-arrow {
    flex-shrink: 0;
    width: 26px;
    height: 26px;
    margin: 0 0 12px;
    border-radius: 50%;
    border: 1px solid rgba(var(--accent-rgb, 246, 156, 30), 0.22);
    background: #ffffff;
    color: var(--chatbot-primary-hover);
    font-size: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.15s ease, color 0.15s ease, opacity 0.15s ease;
}

.chatbot-suggestions-arrow--prev { margin-left: 16px; }
.chatbot-suggestions-arrow--next { margin-right: 16px; }

.chatbot-suggestions-arrow:hover:not(:disabled) {
    background: var(--accent, #f69c1e);
    color: #ffffff;
    border-color: var(--accent, #f69c1e);
}

.chatbot-suggestions-arrow:disabled {
    opacity: 0.3;
    cursor: default;
}

.chatbot-suggestions-wrap--no-scroll .chatbot-suggestions-arrow {
    display: none;
}

.chatbot-suggestions {
    padding: 0 4px;
    display: flex;
    gap: 8px;
    overflow-x: auto;
    flex-shrink: 1;
    min-width: 0;
    scrollbar-width: none;
    scroll-snap-type: x proximity;
    scroll-behavior: smooth;
}

.chatbot-suggestions::-webkit-scrollbar { display: none; }

.chatbot-suggestion-chip {
    white-space: nowrap;
    padding: 9px 16px;
    border-radius: 9999px;
    border: 1px solid rgba(var(--accent-rgb, 246, 156, 30), 0.22);
    background: #ffffff;
    color: var(--accent-dark, #a6520c);
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
    font-family: var(--font-body, 'Inter', sans-serif);
    margin-bottom: 12px;
    flex-shrink: 0;
    scroll-snap-align: start;
}

.chatbot-suggestion-chip:hover {
    background: var(--accent, #f69c1e);
    color: #ffffff;
    border-color: var(--accent, #f69c1e);
}

/* ── Messages Area ── */
.chatbot-messages {
    flex: 1;
    overflow-y: auto;
    padding: 20px 18px 12px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    scroll-behavior: smooth;
    background-color: var(--bg, #fff5f8);
    background-image: radial-gradient(rgba(var(--accent-rgb, 246, 156, 30), 0.12) 1px, transparent 1px);
    background-size: 14px 14px;
}

.chatbot-messages::-webkit-scrollbar {
    width: 4px;
}

.chatbot-messages::-webkit-scrollbar-track {
    background: transparent;
}

.chatbot-messages::-webkit-scrollbar-thumb {
    background: rgba(var(--accent-rgb, 246, 156, 30), 0.20);
    border-radius: 4px;
}

/* ── Message Bubble ── */
.chatbot-msg {
    display: flex;
    align-items: flex-end;
    gap: 10px;
    max-width: 90%;
    animation: chatbot-msg-in 0.3s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes chatbot-msg-in {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
}

.chatbot-msg.bot {
    align-self: flex-start;
}

.chatbot-msg.user {
    align-self: flex-end;
    flex-direction: row-reverse;
}

.chatbot-msg-avatar {
    width: 32px;
    height: 32px;
    padding: 0;
    border-radius: 50%;
    background: #ffffff;
    border: 1px solid rgba(var(--accent-rgb, 246, 156, 30), 0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    overflow: hidden;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

.chatbot-msg-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
}

.chatbot-msg-bubble {
    padding: 12px 16px;
    border-radius: 20px;
    font-size: 16px;
    line-height: 1.5;
    font-family: var(--font-body, 'Inter', sans-serif);
    word-break: break-word;
    letter-spacing: -0.01em;
}

.chatbot-msg.bot .chatbot-msg-bubble {
    background: #ffffff;
    color: #0f172a;
    border-bottom-left-radius: 6px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
    border: 1px solid rgba(15, 23, 42, 0.08);
}

.chatbot-msg.user .chatbot-msg-bubble {
    background: #ffffff;
    color: var(--accent-dark, #a6520c);
    border-bottom-right-radius: 6px;
    box-shadow: 0 2px 8px rgba(var(--accent-rgb, 246, 156, 30), 0.2);
    border: 1px solid rgba(var(--accent-rgb, 246, 156, 30), 0.3);
}

.chatbot-msg-time {
    font-size: 16px;
    color: #52606d;
    margin-top: 5px;
    text-align: right;
    padding: 0 2px;
    font-weight: 500;
}

.chatbot-msg.bot .chatbot-msg-time {
    text-align: left;
    /* padding-left: 46px; */
}

/* ── Typing Indicator ── */
.chatbot-typing {
    display: flex;
    align-items: flex-end;
    gap: 8px;
    align-self: flex-start;
}

.chatbot-typing-dots {
    background: #ffffff;
    border-radius: 20px;
    border-bottom-left-radius: 6px;
    padding: 14px 18px;
    display: flex;
    align-items: center;
    gap: 5px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
    border: none;
}

.chatbot-typing-dots span {
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #94a3b8;
    animation: chatbot-bounce 1.2s ease-in-out infinite;
}

.chatbot-typing-dots span:nth-child(2) { animation-delay: 0.2s; }
.chatbot-typing-dots span:nth-child(3) { animation-delay: 0.4s; }

@keyframes chatbot-bounce {
    0%, 80%, 100% { transform: translateY(0);   opacity: 0.4; }
    40%            { transform: translateY(-5px); opacity: 1;   }
}

/* ── Divider ── */
.chatbot-divider {
    align-self: center;
    font-size: 16px;
    color: #334155;
    font-weight: 600;
    margin: 2px 0 6px;
    flex-shrink: 0;
    padding: 4px 12px;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 9999px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

/* ── Input Area ── */
.chatbot-input-area {
    padding: 4px 16px 14px;
    background: var(--bg, #fff5f8);
    border-top: none;
    display: flex;
    align-items: flex-end;
    gap: 8px;
    flex-shrink: 0;
}

.chatbot-input-wrap {
    flex: 1;
    border: 2px solid rgba(var(--accent-rgb, 246, 156, 30), 0.22);
    border-radius: 16px;
    display: flex;
    align-items: flex-end;
    padding: 10px 16px;
    background: #ffffff;
    transition: background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
    min-height: 48px;
}

.chatbot-input-wrap:focus-within {
    background: #ffffff;
    border-color: var(--chatbot-primary);
    box-shadow: 0 0 0 3px rgba(var(--accent-rgb, 246, 156, 30), 0.1);
}

.chatbot-input {
    flex: 1;
    border: none;
    background: transparent;
    outline: none;
    font-size: 16px;
    color: #0f172a;
    font-family: var(--font-body, 'Inter', sans-serif);
    resize: none;
    line-height: 1.5;
    max-height: 100px;
    overflow-y: auto;
    scrollbar-width: none;
    padding: 0;
    min-height: 22px;
}

.chatbot-input::placeholder {
    color: #64748b;
}

.chatbot-input::-webkit-scrollbar { display: none; }

.chatbot-send-btn {
    width: 44px;
    height: 44px;
    border-radius: 14px;
    background: #ffffff;
    border: 2px solid var(--chatbot-primary);
    color: var(--chatbot-primary-hover);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 4px 12px -2px rgba(var(--accent-rgb, 246, 156, 30), 0.35);
    transition: background 0.15s ease, transform 0.15s ease, opacity 0.15s ease,
        box-shadow 0.15s ease, border-color 0.15s ease;
}

.chatbot-send-btn:hover:not(:disabled) {
    background: #ffffff;
    border-color: var(--chatbot-primary-hover);
    transform: scale(1.04);
    box-shadow: 0 6px 16px -2px rgba(var(--accent-rgb, 246, 156, 30), 0.45);
}

.chatbot-send-btn:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(var(--accent-rgb, 246, 156, 30), 0.35);
}

.chatbot-send-btn:active:not(:disabled) {
    transform: scale(0.96);
}

.chatbot-send-btn:disabled {
    opacity: 0.35;
    cursor: not-allowed;
    background: #d1d5db;
    box-shadow: none;
}

.chatbot-send-btn svg {
    width: 18px;
    height: 18px;
    fill: currentColor;
    margin-left: 2px;
}

/* chatbot.js hardcodes stroke="white" on the send icon; this button is white,
   so draw the icon in the button text colour instead. */
.chatbot-send-btn svg path {
    stroke: currentColor;
}

/* ── Footer ── */
.chatbot-footer {
    text-align: center;
    font-size: 16px;
    color: #52606d;
    padding: 4px 16px 12px;
    background: #ffffff;
    flex-shrink: 0;
    letter-spacing: 0.01em;
}

.chatbot-footer a {
    color: var(--accent-dark, #a6520c);
    text-decoration: none;
    font-weight: 600;
}

.chatbot-footer a:hover {
    text-decoration: underline;
}

/* Desktop: nudge FAB slightly inward from the right edge */
@media (min-width: 769px) {
    .chatbot-fab-wrap {
        right: 44px;
        left: auto;
    }

    .chatbot-window {
        width: 340px;
        height: min(420px, calc(100dvh - 110px));
        max-height: min(440px, calc(100dvh - 110px));
    }

    .chatbot-window .chatbot-header {
        padding: 10px 14px;
    }

    .chatbot-window .chatbot-footer {
        font-size: 14px;
        padding: 2px 14px 8px;
    }
}

@supports not (height: 1dvh) {
    @media (min-width: 769px) {
        .chatbot-window {
            height: min(420px, calc(100vh - 110px));
            max-height: min(440px, calc(100vh - 110px));
        }
    }
}

/* ── Mobile Responsive ── */
@media (max-width: 480px) {
    .chatbot-fab-wrap {
        left: 16px;
        right: 16px;
        bottom: 28px;
    }

    .chatbot-fab {
        min-width: 98px;
        height: 52px;
        padding: 8px 16px 8px 10px;
    }

    .chatbot-fab.is-collapsed {
        min-width: 56px;
        width: 56px;
        height: 56px;
        padding: 6px;
        gap: 0;
    }

    .chatbot-fab img {
        width: 32px;
        height: 32px;
    }

    .chatbot-fab.is-collapsed img {
        width: 36px;
        height: 36px;
    }

    .chatbot-fab-text {
        font-size: 16px;
    }

    .chatbot-window {
        width: 100%;
        max-width: 100%;
        height: calc(100dvh - 96px);
        max-height: calc(100dvh - 96px);
        border-radius: 20px 20px 8px 8px;
        transform-origin: bottom center;
    }

    /* Fallback for browsers without dvh */
    @supports not (height: 1dvh) {
        .chatbot-window {
            height: calc(100vh - 96px);
            max-height: calc(100vh - 96px);
        }
    }
}

/* Landscape on phones: shorten height to avoid overflow */
@media (max-height: 500px) and (max-width: 480px) {
    .chatbot-window {
        height: calc(100dvh - 84px);
        max-height: calc(100dvh - 84px);
    }

    @supports not (height: 1dvh) {
        .chatbot-window {
            height: calc(100vh - 84px);
            max-height: calc(100vh - 84px);
        }
    }

    .chatbot-header {
        padding: 10px 16px;
    }

    .chatbot-header-avatar {
        width: 40px;
        height: 40px;
    }
}

/* ── Site integration: keep the FAB out of the way of overlays ──
   The booking modal (z-index 120) and gallery lightbox (z-index 100) sit
   below the widget's 9999, so hide the launcher while either is open. */
body:has(.booking-modal.is-open) .chatbot-fab-wrap,
body:has(.gallery-lightbox.is-open) .chatbot-fab-wrap {
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
}
```
