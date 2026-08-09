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
  - **Body/Paragraph Text (p, li):** Minimum `16px` everywhere, styled in a very dark contrast color (e.g., `#0f172a`, `#2c3531`) for optimal legibility.
  - **Metadata, Badges, and Pills (.pill, .step-number, tag labels):** `12px` to `13px` for secondary details.
- **Large Screen Typography Scaling:** To prevent body text and subheadings from looking too small on wider viewports, all stylesheets must append media queries scaling up text sizing starting at viewport widths of `1400px` (body/paragraphs to 18px, subtitles to 20px) and `1900px` (body/paragraphs to 20px, subtitles to 22px).
- **Generic Sub-headings:** Section subheadings, subtitle paragraphs, badges, and introductory kickers must remain generic. They must *never* contain specific doctor names (e.g. "Dr. Sarah Smith") or explicit years of experience (e.g. "20+ years"). Keep names and years of experience restricted to main section headings (`h1`), detailed paragraphs, list items, or footer elements.
- **Colour Palette:** Use curated, specialty-appropriate colours (HSL preferred). Avoid plain red/blue/green.
- **Micro-animations:** Include subtle hover effects and transitions on interactive elements.
- **Responsiveness:** All layouts must be fully responsive from 320px mobile up to 1440px desktop.
- **No Placeholders:** If an image is needed, generate one using the image generation tool rather than leaving a placeholder URL.
- **SEO:** Every page must have a unique `<title>`, `<meta name="description">`, a single `<h1>`, and semantic HTML5 elements.

---

## 8. File Naming & Link Conventions

- CSS lives exclusively in `styles/style.css` — no inline styles for layout rules.
- JS lives exclusively in `script/index.js`.
- Internal links between pages use **relative paths** (e.g., `blog.html`, `index.html#about`).
- Doctor profile images go in the `assets/` folder.
- Do **not** delete any file without explicit user approval.
