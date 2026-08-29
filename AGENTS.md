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

---

## 11. Layout, Branding & Interaction Additions

- **Main container width:** Do not cap the site's main container at `1280px`. Use a
  modern wider measure — `1440px`–`1600px` — for the outer `.container`/wrapper, so the
  layout doesn't look cramped on large monitors. Keep inner text blocks constrained to
  a readable measure (~65–75ch) even when the outer container is wider.
- **Alternating section backgrounds:** Give top-level sections alternating background
  treatments (e.g. white/off-white ↔ a light tint of the brand colour) so the page
  reads as distinct branded bands rather than one flat surface. This is part of how the
  60% neutral / 30% brand split (Section 7.1) should actually show up on the page —
  don't leave the brand colour confined to small UI elements only.
- **Section headings stay bold and large.** `h2` section titles must use a bold weight
  (600–700+) at the 32–38px scale from Section 7 — never regular/light weight regardless
  of design trend.
- **Card headings vs. card body:** Inside any card component, the heading (`h3`/`h4`)
  must be visually bold and clearly larger than the paragraph/body text inside that same
  card — never the same size/weight as the body copy.
- **Never nest a card inside a bigger card.** If a card needs to present multiple
  sub-items, do not wrap each sub-item in its own bordered/shadowed "card" inside the
  outer card — that produces a card-in-card look. Instead, separate sub-items with a
  simple divider (`border-top`/`hr`-style rule), spacing, or an icon/label row inside the
  single outer card.
- **Push the 60-30-10 rule further into the visible design**, not just CTAs: use the 60%
  neutral and 30% brand colours generously across section backgrounds, card surfaces,
  headings, and dividers, reserving the 10% accent strictly for interactive elements as
  already specified in Section 7.1. Don't let the palette read as "mostly white with a
  couple of coloured buttons."
- **Stats must animate as live counters.** Any numeric stat (e.g. "100 patients", "15
  years") must count up from 0/1 to its target value when it scrolls into view, not
  render as static text. Implement with a small IntersectionObserver-triggered
  requestAnimationFrame (or `setInterval`) counter in `script/index.js` — trigger once
  per element, respect `prefers-reduced-motion` by skipping straight to the final value,
  and preserve any suffix (`+`, `%`, `k`) that was in the original static number.

---

## 12. Card & Grid Centering Rules (Services & Features)

To ensure clean visual balance across desktop and mobile grid layouts:

### 1. Grid Balancing & Centering Trailing/Single Cards

The services grid is **3 cards per row** (a 3x2 block for the usual six services),
dropping to 2 per row at `1200px` and 1 per row at `640px`. An incomplete final row
must be **centered on the row**, never left-aligned against an empty slot.

**Declare 12 tracks, not 3.** A card spans 4 tracks, which is exactly the same width
as `repeat(3, 1fr)` at the same gap — `4 tracks + 3 gaps == (W - 2*gap) / 3` — but the
extra grid lines are what make centering possible. With only 3 tracks there is no line
at the half-card offset, so a leftover row physically cannot be centered; that is why
the old `grid-column: 1 / -1` + `max-width` hack existed, and it is no longer used.

```css
.services-grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 26px;
  align-items: stretch;
  justify-content: center;
}

.service-card {
  grid-column: span 4;
  min-width: 0;
}

/* Final row holds ONE leftover card (total ≡ 1 mod 3): widen it to two
   card-widths (span 8 = 2x4 tracks + the gap between) and centre it. */
.service-card:last-child:nth-child(3n + 1) {
  grid-column: 3 / span 8;
}

/* Final row holds TWO leftover cards (total ≡ 2 mod 3): keep both at normal
   card width and shift the pair inward so it centres on the row. */
.service-card:nth-last-child(2):nth-child(3n + 1) {
  grid-column: 3 / span 4;
}

.service-card:last-child:nth-child(3n + 2) {
  grid-column: 7 / span 4;
}
```

Breakpoints re-map the spans. At 2-per-row a lone final card keeps its **normal
width** and is centered by starting on track 4 — do not make it full-row-wide there,
a banner-width card breaks the card rhythm:

```css
@media (max-width: 1200px) {
  /* 2 per row — reset the desktop leftover rules back to a plain half-row span. */
  .service-card,
  .service-card:last-child:nth-child(3n + 1),
  .service-card:nth-last-child(2):nth-child(3n + 1),
  .service-card:last-child:nth-child(3n + 2) {
    grid-column: span 6;
  }

  /* 2 per row means a lone last card happens exactly when the total is odd. */
  .service-card:last-child:nth-child(odd) {
    grid-column: 4 / span 6;
  }
}

@media (max-width: 640px) {
  /* 1 per row — every card, leftover or not, spans the full 12 tracks. */
  .service-card,
  .service-card:last-child:nth-child(odd),
  .service-card:last-child:nth-child(3n + 1),
  .service-card:nth-last-child(2):nth-child(3n + 1),
  .service-card:last-child:nth-child(3n + 2) {
    grid-column: 1 / -1;
  }
}
```

**Do not reorder these rules.** Inside each media query the grouped reset and the
centering rule are both specificity `(0,3,0)` and they overlap — an odd-total last
card matches `:nth-child(3n + 1)` *and* `:nth-child(odd)`. Correctness depends on the
centering rule coming **after** the reset in source order. Likewise the `640px` block
must stay after the `1200px` block, since both apply on a narrow viewport.

Verify changes against totals of **4, 5, 6 and 7** cards, not just the six that ship —
the leftover rules are dormant at 6 and a regression will not be visible.

### 2. Internal Card Content Centering
Card content (icons, headings, descriptions) in centered presentation variants must be
aligned to the center. Because `align-items: stretch` on the grid gives every card in a
row a shared height, also center the content block **vertically** (`justify-content`)
so short and long descriptions stay optically aligned:

```css
.service-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 12px;
}

.service-card .service-icon {
  margin: 0 auto;
}

.service-card-title,
.service-card-desc {
  text-align: center;
}
```

---

## 13. About-Section "Read More" Toggle (Standard, Mandatory)

The About section's bio paragraph(s) must clip to **7 lines** with a "Read More" /
"Read Less" toggle button, rather than always showing the full bio. Apply this to
every microsite — new or existing — whose About section has body copy long enough to
plausibly exceed 7 lines.

**Before adding:** search `styles/style.css` for the `Read More toggle` comment marker
and `script/index.js` for `DigiDrReadMore` — if present, this microsite already has it;
don't duplicate.

### 13.1 HTML structure

Wrap the existing bio paragraph(s) in two nested `<div>`s and add the button
immediately after, inside the same outer wrapper. Keep whatever classes the outer
wrapper already had (e.g. `about-story-new`, `about-description`) — just add
`read-more-wrap` alongside them:

```html
<div class="about-story-new read-more-wrap">
  <div class="read-more-content">
    <p>...existing bio paragraph(s), unchanged...</p>
  </div>
  <button type="button" class="read-more-btn" aria-expanded="false">
    <span>Read More</span>
    <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
  </button>
</div>
```

Don't alter the bio text itself — only wrap it.

### 13.2 CSS

Insert near the About-section styles in `styles/style.css`, marked with the
`Read More toggle` comment so re-runs can detect it. Use whatever CSS variables this
microsite already uses for its primary button colour (base) and its hover/accent
colour (hover) — fall back to `#0f766e` if neither var exists:

```css
/* Read More toggle (About section) */
.read-more-wrap .read-more-content {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 7;
  overflow: hidden;
}

.read-more-wrap.is-expanded .read-more-content {
  display: block;
  -webkit-line-clamp: unset;
  overflow: visible;
}

.read-more-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--button, #0f766e);
  font-family: inherit;
  font-weight: 600;
  font-size: 16px;
}

.read-more-btn span {
  color: var(--button, #0f766e);
}

.read-more-btn i {
  transition: transform 0.3s ease;
}

.read-more-btn:hover span,
.read-more-btn:hover i,
.read-more-btn:hover {
  color: var(--button-hover, #0f766e);
}

.read-more-wrap.is-expanded .read-more-btn i {
  transform: rotate(180deg);
}
```

### 13.3 JS

Append verbatim to the end of `script/index.js` (this is a self-contained IIFE — copy
it exactly, do not rewrite or inline it elsewhere):

```js
(function () {
  function checkTruncation(wrap) {
    var btn = wrap.querySelector(".read-more-btn");
    var content = wrap.querySelector(".read-more-content");
    if (!btn || !content) return;

    var isTruncated = content.scrollHeight > content.clientHeight + 2;
    btn.style.display = isTruncated ? "" : "none";
  }

  function bindToggle(wrap) {
    var btn = wrap.querySelector(".read-more-btn");
    var label = btn && btn.querySelector("span");
    if (!btn || btn.dataset.bound) return;
    btn.dataset.bound = "true";
    btn.addEventListener("click", function () {
      var expanded = wrap.classList.toggle("is-expanded");
      btn.setAttribute("aria-expanded", expanded ? "true" : "false");
      if (label) label.textContent = expanded ? "Read Less" : "Read More";
    });
  }

  function initReadMore(root) {
    (root || document).querySelectorAll(".read-more-wrap").forEach(function (wrap) {
      bindToggle(wrap);
      checkTruncation(wrap);
    });
  }

  window.DigiDrReadMore = { init: initReadMore, check: checkTruncation };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { initReadMore(); });
  } else {
    initReadMore();
  }

  function debounce(fn, wait) {
    var t;
    return function () {
      clearTimeout(t);
      t = setTimeout(fn, wait);
    };
  }

  window.addEventListener("resize", debounce(function () { initReadMore(); }, 200));
})();
```

### 13.4 Behaviour notes

- **7-line clamp** via `-webkit-line-clamp` — supported in all current evergreen
  browsers (Chrome, Edge, Safari, Firefox 68+) despite the `-webkit-` prefix; no
  fallback needed.
- **Button auto-hides when there's nothing to expand.** `checkTruncation` compares
  `scrollHeight` to `clientHeight`; if the bio already fits in 7 lines the button never
  renders. Always test with both a short bio (button should NOT appear) and a long one
  (button should appear and toggle correctly).
- **Re-checks on resize** (debounced 200ms) so rotating a phone or resizing a desktop
  window never leaves the button in a stale visible/hidden state.
- `window.DigiDrReadMore.init(root)` is exposed so any future dynamic content loader
  can re-run the check after injecting new bio text.
- If multiple bio paragraphs exist, keep them all inside the single
  `.read-more-content` wrapper — do not create one wrapper per paragraph.

