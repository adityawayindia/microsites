# Parameterization guide

## 1. Rendering and identity

The production folder is `Homeopathy-13-Male-param`. The suffix identifies a parameterized source folder; it is not a change to any previously published asset bucket.

The backend must render `index.html`, `privacy-policy.html`, `terms-of-service.html`, `robots.txt`, `sitemap.xml` and `llms.txt`. Source templates must never be published without rendering.

| Input | Use and required format |
| --- | --- |
| `full_name` | Name without the `Dr.` prefix; used in branding, metadata, consent and legal text |
| `speciality` | Display specialty; spelling intentionally follows the backend contract |
| `awards`, `education` | Qualifications in the prescribed `awards,education` order; provide both to avoid an empty qualification separator |
| `introduction` | Plain-text biography; newlines are displayed as paragraph-like breaks; HTML is escaped |
| `languages` | Human-readable language list |
| `mci`, `council`, `hasmic` | Registration and council; show registration only when `hasmic` is true |
| `practising_since` | Year or a date containing a four-digit year; the hero displays the year |
| `languages_count`, `consultation_modes_count` | Stat strings; counters preserve suffixes and separators |
| `fellowship`, `hasFellowship` | One string for all entries, separated by semicolons; never a hardcoded fellowship |
| `profile` | Full URL for the hero portrait and social/structured-data images |
| `clinicname`, `address`, `city`, `district`, `state`, `pincode` | Clinic details, booking attributes and structured data |
| `code`, `phone`, `email` | Clinic contact data; `code` excludes `+`; clinic phone and WhatsApp are separate fields |
| `slug` | Public path component, lowercase letters/digits/hyphens; no leading or trailing slash |
| `path` | Template static-resource base, no trailing slash; used for CSS and JavaScript only |
| `userid` | Registered DigiDr doctor ID, used by the appointment APIs |
| `micrositeId` | Registered microsite ID, used by the visitor endpoint |
| `date` | Approved legal effective date |

`experience` and `totalpatient` remain supported data fields but this design does not display an experience or total-patient stat. They are not substituted for the three required hero tiles.

Only the hero portrait is dynamic. About, Philosophy, header and footer imagery remain template-owned. Header/footer portrait assets must be approved for the doctor's deployment; the supplied sample portrait must not be represented as another real physician.

## 2. Section text and fallbacks

For every key below, send its value plus **both** `has_<key>` and `no_<key>` booleans. When the value is present, `has_` is true and `no_` false. When absent, use an empty string, `has_` false and `no_` true. The original section wording is the fallback.

| Area | Content keys |
| --- | --- |
| About | `about_section_title`, `about_section_subtitle` |
| Services | `service_section_title`, `service_section_subtitle` |
| Philosophy header | `philosophy_section_title`, `philosophy_section_subtitle` |
| Philosophy first pillar | `philosophy_section_pillar_text_1`, `philosophy_section_pillar_subtext_1` |
| Philosophy second pillar | `philosophy_section_pillor_text_2`, `philosophy_section_piller_subtext_2` |
| Philosophy third pillar | `philosophy_section_pillar_text_3`, `philosophy_section_pillar_subtext_3` |
| Journey header | `process_section_about_title`, `process_section_about_subtitle` |
| Journey steps | `process_section_step_body_text_1` through `_4`, `process_section_step_body_subtext_1` through `_4` |
| Gallery | `gallery_section_title`, `gallery_section_subtitle` |
| Contact | `contact_us_subtitle` |

The `pillor` and `piller` spellings are intentional backend keys. Do not correct them. The counts remain three Philosophy pillars and four Journey steps. Section kickers and the entire FAQ are fixed template content.

## 3. Services, gallery and social channels

`services` is an array of objects containing `title` and `description` only. The icon is fixed to `fa-mortar-pestle` in the template. `images` is an array of objects containing `image`, an absolute URL or a root-relative image path. Do not add unsupported loop fields. Empty arrays produce no cards; they do not fabricate default services or gallery items.

| Flag pair | Value |
| --- | --- |
| `hasFacebook` / `noFacebook` | `facebook`: Facebook profile URL |
| `hasFacebookPage` / `noFacebookPage` | `facebookpage`: Facebook page URL |
| `hasInstagram` / `noInstagram` | `instagram` |
| `hasTwitter` / `noTwitter` | `twitter` |
| `hasLinkedin` / `noLinkedin` | `linkedin` |
| `hasWebsite` / `noWebsite` | `website` |
| `hasWhatsapp` / `noWhatsapp` | `whatsapp`: bare ten-digit India number |
| `hasYoutube` / `noYoutube` | `youtube` |

Enabled channels render an external link. Disabled channels render a non-link span with the `Not Enabled` tooltip and no analytics click attribute. The order is Facebook profile, Facebook page, Instagram, X, LinkedIn, website, WhatsApp and YouTube.

WhatsApp links are built as `https://wa.me/91` plus the independent `whatsapp` value. Do not send a complete URL or a country prefix in that field. The sample social URLs use a reserved `.invalid` host and are not production destinations.

## 4. Promotional banners

`has_banner` controls whether the complete banner module exists. An enabled module needs `banner_src`, `banner_src_mobile`, `banner_alt`, `banner_start` and `banner_end`. Supply desktop and mobile artwork separately. Dates should be ISO timestamps with an explicit offset. Empty dates mean an open schedule boundary; use intentional values, not a historical sample campaign.

Existing `DigiDrBanner` methods remain available for an approved integration to set a destination, schedule or active state. No `banner_href` placeholder was invented because it is absent from the allowed vocabulary. The existing banner script is unchanged from Step 2, including expiry enforcement, safe destinations and inactive-endpoint handling.

## 5. Branding and deployment settings

The playbook supplies no per-doctor color, font, favicon, GA4-ID or API-base placeholder. These remain explicit deployment/design settings, not invented Mustache fields.

| Setting | Where to configure |
| --- | --- |
| Main aubergine palette | `styles/style.css` first `:root` block: `--ink`, `--ink-2`, `--sky-dark`, `--sky-light` |
| Secondary moss palette | `--teal`, `--teal-dark`, `--teal-light` |
| Copper actions | `--amber`, `--amber-dark`, `--amber-light`, `--amber-rgb`, `--amber-dark-rgb` |
| Neutrals and text | `--bg`, `--bg-2`, `--bg-3`, `--surface`, `--text`, `--muted`, border tokens |
| Fonts | `--font-heading`, `--font-display`, `--font-body`, plus matching Google Fonts links on all three pages |
| Favicon | The SVG data URI in each page's `rel=icon` link |
| GA4 | Actual `data-ga-measurement-id` on all three `html` elements; blank disables GA4 |
| Clarity | Shared project `ymqvcvdc4v`; dynamic microsite tag and fixed `homeopathy` specialty tag |
| API base | Shared approved endpoint literals; not a doctor-specific template field |

Review contrast after changing brand colors. Changing a token does not automatically recolor SVG artwork: banner/decorative SVG palettes are separate static asset content. No font files are distributed in this package.

## 6. Asset and route contract

This build deliberately uses the playbook's **local-asset option**, not an unverified GCS upload. Every page includes a base of `/<slug>/`, so relative template images resolve to `/<slug>/assets/` even on a slashless doctor or legal route.

Serve these paths:

```text
/<slug>/                    -> rendered index.html
/<slug>/privacy-policy      -> rendered privacy-policy.html
/<slug>/terms-of-service    -> rendered terms-of-service.html
/<slug>/assets/*            -> this template's assets/*
<path>/styles/*             -> this template's styles/*
<path>/script/*             -> this template's script/*
<path>/assets/*             -> this template's assets/* (CSS background URLs)
```

The last mapping is required because CSS resolves its background images relative to the stylesheet URL. Do not put `path` into About images or introduce new asset placeholders. Production must support the base element in its CSP, for example an appropriate `base-uri 'self'` policy. Test the actual host's policies; no CSP was changed here.

Canonical, social and discovery URLs use `https://digidr.app/<slug>/...`, without `.html`. Domain-level discovery files must be merged by the backend team; the delivered files remain per-microsite drafts.

## 7. Template escaping and data validation

Use standard HTML escaping for visible text and attribute values. Use context-appropriate JSON string escaping inside JSON-LD rather than inserting HTML entity text there. Reject unapproved URL schemes and invalid slugs upstream. No triple braces, inverted sections, partials, dynamic IDs or executable HTML values are used.

The preview renderer validates section balance, required accessed values, complementary flags, URL formats and stray delimiters. It separately serializes JSON string values so quotes, apostrophes and ampersands survive correctly. A production renderer must provide equivalent context handling; this helper does not prove the behaviour of the deployed DigiDr renderer.

The `hasFellowship` markers are comment-wrapped, and the supplied guard also hides an empty or unresolved fellowship line. Required backend confirmation remains: all doctors must receive `practising_since`, `languages_count` and `consultation_modes_count`, and optional fellowship support must match the agreed contract.

## 8. Integration behaviour and explicit reference differences

### Booking

The corrected Step 2 booking implementation is retained rather than replaced wholesale. It uses the playbook's four endpoints and multipart field names, DOM-provided doctor/clinic values, nested or top-level result `type` and `meetLink`, consent gating, mode-specific confirmations and success analytics.

**This differs from the playbook's line-for-line booking-copy requirement.** The differences are deliberate and require backend review before release:

* Unavailable, failed or empty working-day responses leave no bookable dates instead of enabling all days. The 30-day window is enforced.
* Slot responses are validated; stale responses cannot overwrite a later date or consultation mode. Slot IDs must have been supplied by the API.
* Phone validation waits for utilities and fails closed when they are unavailable; submitted phone numbers include the selected country code.
* The existing review step, modal focus handling, file restrictions, safe text-only confirmation rendering and no-false-success behaviour are preserved.
* HTTP failures, explicit rejection, missing confirmation type or a mismatched type preserve entered data rather than resetting the form. Weekday names use the locally selected date, avoiding UTC date shifts.
* Mode-specific success copy now uses the parameterized clinic address components; online copy distinguishes a returned meeting link from a response without one.

These are behaviour-preserving safeguards, not claims that the code is byte-identical to the reference. Endpoint acceptance, backend persistence, duplicate protection and email delivery still require staging verification.

### Shared chatbot

`script/chatbot.js` is copied exactly from the supplied playbook, including the common icon URL, literal welcome text and API reply handling. It posts `Message` to `MicrositeChat?slug=...`. The previous local information guide is replaced.

The supplied shared code intentionally contains no suggestion-chip rendering. It also does not implement a full dialog focus trap, request cancellation/timeout or an in-flight message guard, and its empty-reply fallback implies that a team will respond. These shared-code limitations are not silently patched client-side. The backend must supply accurate, doctor-aware replies and appropriate operational expectations. Review these items with the shared-widget owner before launch.

### Unchanged scripts and privacy

`analytics.js`, `banner-module.js` and `auto-open-modal.js` remain byte-for-byte unchanged. The auto-open script is not loaded. The Facebook feed implementation remains unchanged. The visitor script is the exact playbook version on all three pages.

All page bodies are conservatively marked `data-clarity-mask=true`, covering dynamically appended chat and form content. Verify actual masking settings in Clarity before handling patient information. No patient-entered values are intentionally passed to event analytics.
