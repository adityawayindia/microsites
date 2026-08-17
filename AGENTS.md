# DigiDr Microsites — AI Agent Guidelines

> **Scope:** These rules apply to ALL microsites in this workspace and to every future microsite created here.
> **Priority:** These rules override any default behaviour. Follow them without exception.

---

## 1. Project Overview

This workspace contains multiple doctor-specialty microsites, each in its own folder:

| Folder | Specialty |
|---|---|
| `microsite-ayurvedic` | Ayurvedic Medicine |
| `microsite-cardiology` | Cardiology |
| `microsite-dentist` | Dentistry |
| `microsite-gastroenterology` | Gastroenterology |
| `microsite-general-medicine` | General Medicine |
| `microsite-homeopathy` | Homeopathy |
| `microsite-intensivist` | Intensivist / Critical Care |
| `microsite-neurology` | Neurology |
| `microsite-oncology` | Oncology |
| `microsite-orthopedics` | Orthopedics |
| `microsite-pediatrician` | Pediatrics |

Each microsite follows the same file structure:
```
microsite-<specialty>/
  index.html          ← Main page
  blog.html           ← Blog listing
  blog-detail.html    ← Single blog post
  privacy-policy.html
  terms-of-service.html
  styles/
    style.css         ← All styling lives here
  script/
    index.js
  assets/             ← Images and media
```

### 1.1 Standard Page Sections

The main page (`index.html`) of each microsite is structured into the following sequential sections:
1. **Header / Navigation:** Sticky header containing the doctor's name, specialty role, navigation links, and a prominent Booking Call-to-Action button.
2. **Hero Section:** High-impact landing zone displaying the doctor's portrait, core values, quick credentials/languages, key practice statistics (experience, patients), and direct call-to-actions.
3. **About Section:** Highly highlighted professional bio detailing the doctor's credentials and clinical expertise (no icons, premium typography, executive design).
4. **Services Section:** A responsive grid showing the core clinical services offered, styled with custom pills and informative descriptions.
5. **Care Philosophy Section:** Split-screen trust section illustrating the practice's clinical approach (e.g. Preventive, Evidence-Based, Shared Decisions) next to a generic medical workspace flat-lay image.
6. **Consultation Journey Section:** A 4-step process timeline explaining the consultation workflow, using animated circles with outer dotted rings that rotate and glow on hover.
7. **Testimonials Section:** Carousel slider showing patient reviews, star ratings, quotes, and patient avatars.
8. **Practice Gallery Section:** Grid showcasing high-quality images of the clinic or hospital facility.
9. **Booking Modal:** Integrated popup form for choosing preferred date, time slot, entering details, and uploading medical files.
10. **Footer:** Final branding, social links, terms/privacy links, page links, and copyright text.

---

## 2. Mandatory Responsive Text & Auto-Height Rules

### Why This Exists
Doctor names, clinic addresses, badge text, and service descriptions are dynamic and can be long. Without these rules, long text overflows containers, breaks layouts, or causes horizontal scrollbars — especially on mobile.

### Rule 1 — No Hard Text Overflow
**Every text element must allow natural wrapping.** Never apply `white-space: nowrap` to any heading, badge, pill, chip, name, or paragraph that could contain dynamic or long content.

✅ Always use:
```css
overflow-wrap: break-word;
word-break: break-word;
white-space: normal;
```

❌ Never use on dynamic content containers:
```css
white-space: nowrap; /* Only acceptable for single-line UI labels where content length is guaranteed short */
```

### Rule 2 — Flex & Grid Child Shrink Defense
All flex and grid children must have `min-width: 0` so they can shrink below their content size instead of overflowing their parent.

Without this, a flex child with long text will push siblings out of frame instead of wrapping internally.

```css
min-width: 0; /* Required on ALL flex/grid children */
```

### Rule 3 — Auto-Height Parent Containers
All card components, hero elements, badges, and chips must expand vertically when their content wraps. Never use a fixed height on these elements.

✅ Always use:
```css
height: auto !important;
min-height: fit-content;
max-width: 100%;
```

### Rule 4 — Social Icon Rows Must Wrap

Any row of social media icons (header, hero, or footer) is a flex container and must include `flex-wrap: wrap`. Without it, the icon row silently overflows its pill/card container on narrow viewports instead of dropping extra icons to a second line.

```css
.footer-social,
.social-links,
.hero-social {
  display: flex;
  flex-wrap: wrap; /* required — prevents overflow at narrow widths */
  gap: 10px;
}
```

This applies to every such container regardless of its class name (e.g. `.footer-social`, `.peds2-footer-social`, `.peds4-footer-social`, `.alt-footer-social`) — check for `display: flex` on any social-icon wrapper and confirm `flex-wrap: wrap` is present.

---

## 3. Standard CSS Block to Include in Every `styles/style.css`

When creating a new microsite OR when editing an existing one that is missing these rules, ensure the following block is present near the **top of `styles/style.css`**, after any CSS variable/token declarations:

```css
/* ==========================================================================
   DigiDr Global — Responsive Text & Auto-Height Container Rules
   Apply to ALL microsites. Do not remove or override these.
   ========================================================================== */

*, *::before, *::after {
  box-sizing: border-box;
}

/* Rule 1: Universal Word Break & Text Wrapping */
h1, h2, h3, h4, h5, h6, p, span, a, li, button, label, div, strong, cite {
  overflow-wrap: break-word;
  word-break: break-word;
  max-width: 100%;
}

/* Rule 1.5: Line Height & Body Text Readability */
h1, h2, h3, h4, h5, h6 {
  line-height: 1.2;
  letter-spacing: -0.01em;
}

p, li, span, a, button, label {
  line-height: 1.6;
  color: #0f172a;
}

.about-section p,
.about-intro p,
.about-story p,
.about-story-new p {
  text-align: justify;
  line-height: 1.8;
  color: #0f172a;
  hyphens: auto;
}

/* Rule 2: Flex & Grid Child Shrink Defense */
.hero-content,
.hero-visual,
.hero-topbar,
.hero-stats,
.hero-stat,
.hero-actions,
.hero-v2-content,
.hero-v2-visual,
.hero-v2-topbar,
.hero-v2-stats,
.hero-v2-stat,
.hero-v2-actions,
.about-intro,
.about-story,
.about-story-new,
.service-card,
.service-card-new,
.service-body,
.service-body-new,
.contact-card,
.contact-card-new,
.contact-item,
.contact-item-new,
.testimonial-card,
.testimonial-card-new,
.testimonial-footer,
.brand-text,
.navbar,
.container {
  min-width: 0;
}

/* Rule 3: Parent Container Auto-Height Expansion */
.hero-badge,
.hero-reg,
.hero-title,
.hero-subtitle,
.hero-stats,
.hero-stat,
.hero-chip,
.hero-v2-badge,
.hero-v2-reg,
.hero-v2-title,
.hero-v2-subtitle,
.hero-v2-stats,
.hero-v2-stat,
.hero-v2-chip,
.service-card,
.service-card-new,
.testimonial-card,
.testimonial-card-new,
.contact-card,
.contact-card-new,
.about-story,
.about-story-new,
.card,
article,
aside {
  height: auto !important;
  min-height: fit-content;
  max-width: 100%;
}
```

---

## 4. When Editing Existing Microsites

Before making any CSS changes to an existing microsite:

1. **Check if the standard CSS block (Section 3) is already present** in `styles/style.css`. Search for `DigiDr Global` or `Auto-Height Container Rules`.
2. **If it is missing**, add it near the top of the file, right after any `:root { }` variable blocks.
3. **If it is already present**, do not duplicate it — just continue with your edits.

---

## 5. When Creating a New Microsite

When creating any new microsite from scratch:

1. Copy the folder structure from an existing microsite as a base.
2. **Always include the standard CSS block (Section 3) in `styles/style.css`** from the very start.
3. Add any new component class names used in the new microsite to the `min-width: 0` list (Rule 2) and the `height: auto` list (Rule 3) if they are flex/grid children or content cards.
4. Test with long doctor names and long specialty text to confirm no overflow occurs.

---

## 6. Special Cases & Exceptions

| Situation | Rule |
|---|---|
| Hero title (`h1`) with a doctor's name that must stay on one line on desktop only | Apply `white-space: nowrap` **only** in the desktop base style. The mobile media query (≤900px) **must** reset it to `white-space: normal` so it wraps on small screens. |
| Icon-only buttons or nav items | `white-space: nowrap` is acceptable since content is a fixed icon, not dynamic text. |
| Code snippets / `<pre>` / `<code>` blocks | `word-break` and `overflow-wrap` do not apply — use `overflow-x: auto` instead. |
| Fixed-height decorative elements (e.g., background blobs, SVG shapes) | Fixed heights are acceptable **only** for purely decorative, non-text elements. |

---

## 7. Design & Aesthetic Standards

All microsites must follow these design principles:

- **Typography:** Use Google Fonts (Inter, Roboto, or Outfit preferred). Never use browser-default fonts. Adhere to the following exact type scale to maintain clean hierarchy:
  - **Section Titles (h2):** `32px` to `38px` for clear heading prominence.
  - **Card/Feature Headings (h3):** `22px` on desktop, scaled down to `20px` on mobile (`<= 480px`).
  - **Body/Paragraph Text (p, li, a):** Mandatory `18px` on every `<p>`, `<li>`, and `<a>` tag everywhere in the site (no exceptions, no smaller sizes) — this includes header nav links, footer quick links, footer legal links, and inline body/content links, not just paragraph and list text. Styled in a very dark contrast color (e.g., `#0f172a`, `#2c3531`) for optimal legibility, except where a link's own styling requires a different (still accessible) color per the CTA/accent rules below. CTA buttons styled as `<a>` tags (e.g. "Book Appointment") are exempt — they follow button sizing, not body-copy sizing.
  - **Metadata, Badges, and Pills (.pill, .step-number, tag labels):** `16px` for secondary details.
- **Large Screen Typography Scaling:** To prevent body text and subheadings from looking too small on wider viewports, all stylesheets must append a media query starting at a viewport width of `1400px` that scales body/paragraphs and subtitles up to `18px`. This is the industry-standard ceiling for body copy (16px baseline per WCAG/Material/Tailwind conventions, ~18px as the typical upper bound) — do not scale further at `1900px` or above. The real fix for wide viewports is constraining line length (`max-width`/measure, ~45-75 characters per line), not inflating font size past 18px.
- **Generic Sub-headings:** Section subheadings, subtitle paragraphs, badges, and introductory kickers must remain generic. They must *never* contain specific doctor names (e.g. "Dr. Sarah Smith") or explicit years of experience (e.g. "20+ years"). Keep names and years of experience restricted to main section headings (`h1`), detailed paragraphs, list items, or footer elements.
- **Section Vertical Spacing:** Top-level page sections (About, Services, Philosophy, Journey, Testimonials, Gallery, Contact, etc.) must use `padding: 64px 0;`, not `100px 0;` or larger. Two adjacent sections with `100px` padding each stack into a ~200px dead-space gap, which reads as a layout bug (especially on mobile, where no separate media-query override typically reduces it). If a section needs more breathing room for a genuinely large visual (e.g. a full-bleed hero), scale it deliberately rather than reusing the generic `100px` value out of habit.
- **Colour Palette:** Use curated, specialty-appropriate colours (HSL preferred). Avoid plain red/blue/green.
- **Micro-animations:** Include subtle hover effects and transitions on interactive elements.
- **Responsiveness:** All layouts must be fully responsive from 320px mobile up to 1440px desktop.
- **No Placeholders:** If an image is needed, generate one using the image generation tool rather than leaving a placeholder URL.
- **SEO:** Every page must have a unique `<title>`, `<meta name="description">`, a single `<h1>`, and semantic HTML5 elements.

---

## 7.1 Colour Proportion & Text Contrast Rule (Hard-Bound, Mandatory)

> **This rule is hard-bound and non-negotiable.** It applies to every microsite, every page, and every future edit. Do not override it based on visual preference or a specific brand ask — reconcile the brand palette to fit these constraints instead.

### The 60-30-10 Rule
Every page's colour usage must break down as:
- **60% — Neutral base:** White, off-white, or light gray for main backgrounds. Keeps the page clean and spacious.
- **30% — Brand colour:** The specialty's primary brand colour, used for headers, cards, and sub-elements.
- **10% — Accent colour:** A bold, contrasting colour used **strictly** for interactive elements — CTA buttons and important links. Do not spread the accent colour into decorative or non-interactive areas; it loses meaning if overused.

**Semantic colours stay consistent** regardless of brand palette: green = success, red = error, blue = clickable link (unless the link is already styled as a CTA button).

### Text Colour & Readability
- Use dark charcoal (`#333333` or `#222222`) instead of pure black (`#000000`) on light backgrounds, to reduce eye strain. (This workspace's existing `#0f172a` token already satisfies this — do not swap it for pure black.)
- Body text must be **at least 16px**.
- Line height must be **1.5–1.6×** the font size for body copy.
- Every text/background pairing must meet **WCAG AA contrast — 4.5:1 minimum** for normal text. Verify with the WebAIM Contrast Checker logic (or equivalent calculation) before finalizing a colour choice, especially for text on brand-coloured or accent-coloured surfaces.

### How to Apply
- When picking or reviewing a specialty's colour palette (Section 7's "curated, specialty-appropriate colours"), assign roles first (60/30/10), then pick HSL values that satisfy the contrast requirement — not the other way around.
- When adding a new CTA, badge, or link colour, check it isn't silently expanding the 10% accent share into a background or card fill.
- If an existing microsite's palette drifts from this ratio or fails contrast, flag it and fix it as part of any styling work touching that area — don't leave a known contrast failure in place.

---

## 8. File Naming & Link Conventions

- CSS lives exclusively in `styles/style.css` — no inline styles for layout rules.
- JS lives exclusively in `script/index.js`.
- Internal links between pages use **relative paths** (e.g., `blog.html`, `index.html#about`).
- Doctor profile images go in the `assets/` folder.
- Do **not** delete any file without explicit user approval.

---

## 9. Known Gotcha — Global Reset Rules Fight Third-Party Widgets & `<span>` Text Colour

The Section 3 global reset (`h1, h2, h3, ..., span, a, li, button, label, div, ... { ... }` and `p, li, span, a, button, label { color: var(--text) / #0f172a; }`) is workspace-wide and applies to **every** element of those tag types, including ones injected by a JS widget or nested inside an already-styled button. Two concrete failure modes hit repeatedly while building the booking-modal phone field (see Section 10) and while unifying CTA button colours:

1. **`max-width: 100%` collapses absolutely-positioned widget panels.** Any `<div>` that a library positions `absolute` inside an `auto`-width parent (shrink-to-fit) gets its intended (often JS-set inline) width squashed back down to the parent's shrink-wrapped size, because percentage `max-width` resolves against that auto-sized ancestor. Symptom: a dropdown/panel renders at ~1 character wide. Fix: override `max-width: none` on the specific widget class, e.g. `.iti__country-selector { max-width: none; }`. A single-class selector always beats the reset's element-type selector on specificity, so no `!important` or reordering is needed.
2. **`<span>` text inside a coloured button renders in the wrong colour.** Setting `color: #fff` on a button (`.cta-btn { color: #fff }`) only sets it by *inheritance* on child `<span>`s. The reset's `span { color: var(--text) }` rule directly matches the `<span>`, and an explicit (even low-specificity) rule always beats a merely-inherited value — so button label spans silently render in the dark body-text colour instead of white. **Any time a button/pill's visible label is wrapped in a `<span>` (a common pattern here, e.g. `<span class="cta-text-desktop">`), add an explicit override**: `.your-btn-class span { color: #ffffff; }`. Verify with `getComputedStyle(span).color`, not just the button's own computed color — they can legitimately differ.
3. **`.booking-field input { padding: 11px 14px }` collides with any nested `<input>` that needs custom padding** (e.g. a search box with a left-aligned icon). If a widget's search input lands inside `.booking-field`, this rule's higher specificity (`.booking-field input` = 0,1,1) beats the widget's own single-class padding rule (0,1,0). Fix with a more specific override, e.g. `.booking-field .iti__search-input { padding-left: ...; padding-right: ...; }`.

**Takeaway:** whenever integrating any third-party widget (or adding a new coloured button/pill) into these microsites, check its rendered result with actual computed styles (`getComputedStyle`), not just visual inspection of a screenshot mid-transition — the global reset can silently override specific sub-elements even when the outer container looks correct.

---

## 10. Phone Input — Country Code Dropdown Standard (intl-tel-input)

All 4 `Pediatrician` microsites' booking-modal phone fields use **[intl-tel-input](https://github.com/jackocnr/intl-tel-input) v29.2.2** via jsDelivr CDN (no bundler/npm install — plain `<script>`/`<link>` tags, matching this workspace's no-build-step convention). This is the standard pattern to replicate if other specialties get the same request.

**HTML** — the phone field stays a plain input; the library builds its own UI on top of it:
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/intl-tel-input@29.2.2/dist/css/intlTelInput.css" />
<!-- ...load before styles/style.css so site overrides win the cascade... -->
<script src="https://cdn.jsdelivr.net/npm/intl-tel-input@29.2.2/dist/js/intlTelInput.min.js"></script>
<!-- ...load before script/index.js -->

<input type="tel" id="phone" name="phone" placeholder="Enter mobile number" autocomplete="tel" required />
```

**JS** (inside the booking-modal IIFE in `script/index.js`):
```js
iti = window.intlTelInput(form.phone, {
  initialCountry: "in",
  countryOrder: ["in"],        // pins India to the top of the list
  separateDialCode: true,
  loadUtils: () => import("https://cdn.jsdelivr.net/npm/intl-tel-input@29.2.2/dist/js/utils.js"),
});
iti.promise.then(() => { phoneUtilsReady = true; });
```
- Validate with `iti.isValidNumber()` / `iti.getValidationError()` (backed by libphonenumber — real per-country rules, not a hand-rolled regex). Guard every call behind `phoneUtilsReady` (or `await iti.promise`) since utils load asynchronously.
- In the form's `submit` handler, `await iti.promise` before the final validation pass so a fast submit can't race the utils download.
- `strictMode` (on by default) already blocks non-digit keystrokes — no custom input-filtering needed for the phone field itself.
- On `form.reset`, call `iti.setNumber(""); iti.setSelectedCountry("in");` to restore the default state.

**Required CSS additions** per site (adapt to that site's own `--border`/`--surface` tokens):
```css
.iti { display: block; width: 100%; --iti-border-color: var(--border); --iti-country-selector-bg: var(--surface); }
.iti__country-selector { border-radius: 12px; max-width: none; }        /* fixes Gotcha #1 above */
.iti__dial-code { font-size: 15px; }                                    /* dial codes in the open list, 1px under body text */
.booking-field .iti__search-input { padding-left: calc(...); padding-right: calc(...); padding-top: 8px; padding-bottom: 8px; } /* fixes Gotcha #3 above */
.booking-field .iti__tel-input.is-invalid { border-color: #dc2626; box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.15); }
```

**Full Name field**, in the same booking form, is letters-only (digits/symbols stripped live as the user types, apostrophes/hyphens/spaces allowed for real names):
```js
form.fullName?.addEventListener("input", () => {
  const el = form.fullName;
  const sanitized = el.value.replace(/[^A-Za-z\s.'-]/g, "");
  if (sanitized !== el.value) el.value = sanitized;
});
```
paired with a matching validator: `if (!/^[A-Za-z\s.'-]+$/.test(value)) return "Name should contain only letters.";`
