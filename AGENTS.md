# DigiDr Microsites — AGENTS.md (Pixel-Level Design Spec)

> **Single source of truth for this workspace.** This file states the rules (why, and the
> non-negotiables), the exact numbers, and, in **Appendix A**, the reference markup, CSS and
> JavaScript for every standard component. It is self-contained: a microsite can be built and
> checked from this file alone (with [verification.md](verification.md) for the audit), without
> opening any other microsite. [parameterization.md](parameterization.md) is only needed to turn a
> finished site into a backend template. New and edited microsites should match these numbers
> unless a specialty's content genuinely requires a deviation.
>
> Values are desktop-first unless a breakpoint is named. "Same as body" means 18px,
> matching the sitewide `p, li, a` rule.

> **Design may vary slightly; required elements may not.** A microsite's visual design (layout
> details, spacing, imagery, section styling, wording) can differ a little from the Appendix A
> reference code and from the pixel values below. What must always remain is the required content and behaviour: the
> sections and elements in §21 and §31–§43 (including the FAQ, contact, gallery, footer, booking
> modal with its info tooltip and consent panel, chatbot, legal pages with the Back button, and
> the GA4 and Clarity events), mobile responsiveness (§31), and the global rules (colour contrast,
> 18px body text, no overflow). Where a design choice would remove or break a required element,
> keep the element.

> **Building a new microsite from scratch? Don't read top to bottom.** Sections 0–17
> below are per-component pixel specs (header, hero, about, etc.) — useful once you're
> mid-build, but not the place to start cold. Read **§20 (folder structure) → §21 (full
> page-section list) → §27 (build checklist)** first; §27 then points you back into the
> rest of the document in the actual order you'll need it.

**Contents:** [0. Breakpoints](#0-canonical-breakpoint-scale) · [0.1 Global Body
Text](#01-global-body-text-rule) · [0.2 Typography Size Reference](#02-typography-size-reference-all-font-sizes-in-one-place)
· [1. Global Tokens](#1-global-tokens) · [1.1 Colour & Contrast](#11-colour-proportion--contrast-rule-hard-bound-mandatory)
· [2. Container](#2-container--page-grid) ·
[3. Header](#3-header--navigation) · [4. Hero](#4-hero-section) · [5. About](#5-about-section)
· [6. Services](#6-services-section) · [7. Philosophy](#7-care-philosophy-split-screen)
· [8. Journey](#8-consultation-journey-4-step-timeline) · [9. Testimonials (removed)](#9-testimonials-removed)
· [10. Gallery](#10-practice-gallery) · [11. Booking Modal](#11-booking-modal) ·
[12. Footer](#12-footer) · [13. Chatbot](#13-chatbot-widget) · [14. Banner Module](#14-banner-module-promotional-hero-banner)
· [15. Buttons](#15-button-standards-unified-scale) · [16. Overlays](#16-overlay--backdrop-colors-unified)
· [17. Images/Lighthouse](#17-images--lighthouse--performance-checklist) · [18. Structural
Additions](#18-two-structural-additions-beyond-the-original-10-section-list-contact--lightbox)
· [18.1 Contact Spec](#181-contact-section--full-spec) · [19. Section Padding](#19-section-vertical-rhythm-summary) · [20. Folder Structure](#20-project-folder-structure--file-conventions)
· [20.1 Text Rule Rationale](#201-why-the-responsive-text-rules-exist-and-their-exceptions)
· [21. Section Build Order](#21-standard-page-section-order-full-build-list) · [22. Global
CSS Block](#22-mandatory-global-css-block-copy-paste) · [23. Grid Centering
Code](#23-grid-centering-copy-paste-code-services--gallery) · [24. Read More
Code](#24-read-more-toggle-copy-paste-code) · [25. Phone Input](#25-phone-input-standard-intl-tel-input-copy-paste)
· [26. CSS Gotchas](#26-known-css-gotchas) · [27. Clarity](#27-microsoft-clarity-analytics-standard-shared-project-mandatory)
· [28. New Microsite Checklist](#28-new-microsite-build-checklist) · [29–45](#29-robotstxt-sitemapxml--llmstxt-per-microsite-draft-mandatory)
· [Appendix A. Reference Code](#appendix-a-reference-code-copy-paste)

---

## 0. Canonical Breakpoint Scale

Don't accumulate an ad hoc set of breakpoints a few dozen px apart (e.g. 1030, 980, 900,
768, 760, 640, 620…). New/edited work should snap to this reduced scale wherever possible:

| Breakpoint | Purpose |
|---|---|
| `1400px` (min-width) | Large-screen type scaling ceiling (body/subtitle → 18px max) |
| `1200px` (max-width) | Header switches to hamburger menu (see §3.2 — this must be verified per site, not assumed) |
| `1100px` (max-width) | Two-column layouts collapse to one column; 3-col grids → 2-col |
| `640px` (max-width) | Single-column mobile layout; grids → 1 col; carousels → 1 visible |
| `480px` (max-width) | Small-phone type/spacing reduction pass |

Component-specific in-between values (e.g. hero collapsing at 980px, stats grid at
560px) are acceptable when a specific element genuinely needs its own cutoff, but
default to the five values above before inventing a new one.

**The header/hamburger breakpoint is content-dependent, not a fixed constant** — see
§3.2 for why. `1200px` is what a typical header (5–6 nav links + the full "Book
Appointment" label) requires; a lighter header (fewer links, shorter CTA) could safely use a lower
number, and a heavier one might need higher. Verify empirically per microsite rather
than copying `1200px` blindly.

### 0.1 Global Body Text Rule

Every `<p>`, `<a>`, and `<li>` on every page is **18px**, with no exceptions — this
includes header nav links, footer quick links, footer legal links, and inline body
links, not just paragraph and list text. `<ul>`/`<ol>` carry no text themselves, so
this applies to the `<li>` items inside them. Dark color (`--text`, never pure black).

The only exemption: CTA buttons styled as `<a>` tags (e.g. "Book Appointment") follow
button sizing (§15), not this rule. Metadata/badges/pills/kickers are **18px** too —
this overrides the older 16px convention for that category; keep every badge/pill/kicker
at the same 18px scale as body text rather than a separate smaller size.

### 0.2 Typography Size Reference (all font-sizes, in one place)

Every text size used anywhere on the site, grouped by area. Full context for each
(padding, color, weight, etc.) lives in that area's own numbered section — this table
is a lookup index, not a replacement for those sections.

**Headings**

| Element | Size |
|---|---|
| `h1` (hero doctor name) | `clamp(36px, 5.2vw, 58px)` |
| `h2` section titles (About/Services/etc.) | `32–38px` (About's is `34px` → `30px` at `≤480px`) |
| `h3` card/step headings | `20–22px` desktop, `20px` at `≤480px` |

**Global body text (§0.1)**

| Element | Size |
|---|---|
| `p`, `a`, `li` — everywhere, no exceptions | **18px** |
| Badges / pills / metadata / kickers | **18px** |

**Header (§3)**

| Element | Desktop | `≤1200px` | `≤480px` |
|---|---|---|---|
| `.brand-name` | 18px | 17px | 16px |
| `.brand-role` | 18px | 15px | 14px |
| `.nav-links a` | 18px | — | — |
| Header CTA (`.cta-btn`) | 18px | 15px | 13px |

**Hero (§4)**

| Element | Size |
|---|---|
| Credentials / reg-id / languages | 18px |
| Expert/specialty badge | 18px |
| Stat number | 26px |
| Stat label | 18px |
| Hero secondary button | 18px |

**About (§5)**

| Element | Size |
|---|---|
| Lede/intro paragraph | 22px |
| Bio paragraphs | 18px |
| Read More toggle button | 18px |

**Services (§6)**

| Element | Size |
|---|---|
| Card `h3` | 22px → 20px at `≤480px` |
| Card `p` | 18px |

**Care Philosophy (§7)**

| Element | Size |
|---|---|
| Floating badge `strong` / `span` | 18px / 18px |
| Pillar `h3` / `p` | 18px / 18px |

**Consultation Journey (§8)**

| Element | Size |
|---|---|
| Step-number chip | 13px |
| Step `h3` | 20px |
| Step `p` | 18px |

**Booking Modal (§11)**

| Element | Size |
|---|---|
| Tabs (Clinic Visit / Online) | 16px |
| Inputs / select / textarea | 16px |
| Error text | 16px |
| Calendar day cells | 16px |
| Upload button | **18px** (button scale, not form-control scale) |
| Submit button | **18px** (button scale, not form-control scale) |
| Confirmation popup heading | 22px |
| Confirmation popup body / OK button | 16px |

**Footer (§12)**

| Element | Size |
|---|---|
| Tagline / social label | 18px |
| Links heading (`h4`) | 18px |
| Footer nav links | 18px |
| Copyright row | 18px |

**Chatbot (§13)**

| Element | Size |
|---|---|
| FAB label text | 16px |
| Bot/agent name | 16px |
| Suggestion chips | 16px |
| Message bubble text | 16px |
| Timestamp | 16px |
| Input textarea | 16px |
| Footer/disclaimer | 16px → 14px on desktop |

**Buttons (§15 — the unified scale)**

| Role | Size |
|---|---|
| Every CTA-weight button (primary, header, modal, small/inline) | 18px |
| Compact secondary-dialog button only (e.g. confirmation popup OK) | 16px |

---

## 1. Global Tokens

> **Colors are placeholders.** Every color below is a *role*, not a fixed value — each
> specialty/microsite picks its own hue(s) to fill these roles. What must carry over
> unchanged is the **token structure**: the same variable names, the same 60/30/10 role
> split, the same radius scale, and the same shadow scale shape. Only the actual
> hue/saturation/lightness numbers vary per site.

```css
:root {
  /* Neutral base (60%) — placeholder values, pick per specialty */
  --bg: hsl(<brand-hue>, <low-sat>%, <96-98>%);
  --bg-2: hsl(<brand-hue>, <low-sat>%, <93-95>%);
  --bg-3: hsl(<secondary-hue>, <mid-sat>%, <95-97>%);   /* alternate section tint, §11 alternating bands */
  --surface: #ffffff;
  --surface-2: hsl(<brand-hue>, <low-sat>%, 99%);
  --border: hsl(<brand-hue>, <low-mid-sat>%, <83-87>%);
  --border-light: hsl(<brand-hue>, <low-mid-sat>%, <89-92>%);

  /* Text — dark charcoal role, never pure black, must hit AA 4.5:1 on --bg/--surface */
  --text: hsl(<brand-hue>, <20-35>%, <10-14>%);
  --muted: hsl(<brand-hue>, <10-18>%, <28-32>%);

  /* Brand (30%) — placeholder hue(s), specialty-appropriate; curated HSL, avoid plain red/blue/green */
  --brand: hsl(<brand-hue>, <mid-high-sat>%, <22-30>%);
  --brand-dark: hsl(<brand-hue>, <mid-high-sat>%, <13-18>%);
  --brand-light: hsl(<brand-hue>, <mid-sat>%, <88-92>%);
  --brand-2: hsl(<secondary-hue>, <mid-sat>%, <30-38>%);
  --brand-2-dark: hsl(<secondary-hue>, <mid-sat>%, <20-25>%);
  --brand-2-light: hsl(<secondary-hue>, <mid-sat>%, <89-93>%);

  /* Accent (10%, interactive only — see §1.2) — placeholder hue, must contrast AA against --surface */
  --accent: hsl(<accent-hue>, <high-sat>%, <40-48>%);
  --accent-dark: hsl(<accent-hue>, <high-sat>%, <32-38>%);
  --accent-light: hsl(<accent-hue>, <mid-sat>%, <94-96>%);
  --accent-rgb: <r>, <g>, <b>;   /* --accent as an RGB triplet, for rgba() tints (chatbot.css, A.6) */
  --button: var(--accent);
  --button-hover: var(--accent-dark);

  /* Radius scale — fixed structurally, not a color, applies to every microsite as-is */
  --radius-xl: 28px;   /* cards: service, philosophy image frame, popups */
  --radius-lg: 20px;   /* hero-stat-box, gallery items, philosophy badge */
  --radius-md: 16px;
  --radius-sm: 12px;
  --radius-pill: 999px; /* all buttons/pills/badges */

  /* Shadows — same shape/opacity structure every site, tinted with that site's own hues */
  --shadow-card: 0 4px 18px hsla(<brand-hue>, 40%, 18%, .10);
  --shadow-hover: 0 12px 30px hsla(<brand-hue>, 40%, 18%, .16);
  --shadow-brand: 0 16px 36px hsla(<brand-hue>, 55%, 16%, .24);
  --shadow-accent: 0 14px 30px hsla(<accent-hue>, 65%, 35%, .30);
  --shadow-brand-2: 0 14px 30px hsla(<secondary-hue>, 40%, 22%, .24);

  --font-heading: 'Outfit', 'Inter', sans-serif;   /* Google Fonts only — Inter, Roboto, or Outfit preferred */
  --font-body: 'Inter', sans-serif;
}
```

Pick real hue/saturation/lightness numbers per specialty; verify every text/background
pairing against WCAG AA 4.5:1 (§1.1) once real values are chosen — don't ship
the placeholder ranges above as literal CSS.

### 1.1 Colour Proportion & Contrast Rule (Hard-Bound, Mandatory)

This rule is hard-bound and non-negotiable — it applies to every microsite, every page,
and every future edit. Don't override it based on visual preference or a specific brand
ask; reconcile the brand palette to fit these constraints instead.

**The 60-30-10 rule.** Every page's colour usage breaks down as:
- **60% — Neutral base:** white, off-white, or light gray for main backgrounds.
- **30% — Brand colour:** the specialty's primary brand colour(s), used for headers,
  cards, and sub-elements — push this further than just section accents (§11): section
  backgrounds, card surfaces, headings, and dividers should all carry brand colour, not
  just a couple of buttons on an otherwise all-white page.
- **10% — Accent colour:** a bold, contrasting colour used strictly for interactive
  elements — CTA buttons and important links (see §1.2 for the one carved-out
  exception: small icon/badge accents). Never spread it into large decorative fills.

**Semantic colours stay fixed** regardless of brand palette: green = success, red =
error, blue = clickable link (unless already styled as a CTA button per §15).

**Text & readability:**
- Dark charcoal (`--text`, e.g. `#333`/`#222`-range) instead of pure black, on light
  backgrounds.
- Body text at least 16px (in practice, 18px everywhere per §0.1).
- Line-height 1.5–1.6× for body copy.
- Every text/background pairing must meet **WCAG AA — 4.5:1 minimum** contrast for
  normal text. Verify with the WebAIM contrast-checker logic (or equivalent) before
  finalizing any brand/accent colour, especially text on brand- or accent-coloured
  surfaces.

**How to apply:** assign the 60/30/10 roles first, then pick HSL values that satisfy
the contrast requirement — not the other way around. When adding a new CTA, badge, or
link colour, check it isn't silently expanding the 10% accent share into a background
or card fill. If an existing microsite's palette drifts from this ratio or fails
contrast, fix it as part of any styling work touching that area — don't leave a known
contrast failure in place.

### 1.2 Accent-color scope (the one exception to "CTAs only")

In practice `--accent` is used more broadly than CTAs alone: service-card
icon backgrounds, philosophy pillar icons, contact-item icons, step-circle fills,
calendar selected-date state, footer top border, hero decorative bars. **This broader
usage is the accepted standard** — read §1.1's "accent strictly for CTAs" as meaning
*don't use accent as a large background fill or section-wide decorative wash*; small
icon accents, badges, and state indicators are fine and are how the 30% brand / 10%
accent balance actually reads on the page. What is **not** acceptable: accent color as
a full card background, a full section background, or body text color.

(For the booking modal specifically, §37 is stricter: the brand colour is reserved for
primary actions there; tabs, upload, and close use neutral or outline styling.)

---

## 2. Container & Page Grid

```css
.container {
  max-width: 1480px;
  margin: 0 auto;
  padding: 0 24px;
}
@media (min-width: 768px) {
  .container { width: min(1480px, 92%); }
}
```

- One `.container` width for every page and every footer variant. A narrower legal-page
  footer container (e.g. `width: min(1240px, 92%)`) is a bug to fix, not a second
  standard; there is only one container width sitewide.
- Inner text blocks (bio copy, subtitles, form labels) still constrain to ~65–75ch via
  their own `max-width`, independent of the container.

---

## 3. Header / Navigation

| Element | Value |
|---|---|
| Header position | `sticky; top:0; z-index:500` |
| Header shadow | `0 2px 20px hsla(<brand-hue>,45%,25%,.08)` — tint with the site's own brand hue, static (not scroll-triggered) |
| `.navbar` padding | `10px` top/bottom, `20px` gap between brand/nav/actions (rendered header height ≈78px, governed by the two-line brand-text block, not the 46px avatar) |
| `.avatar` (logo circle) | `46px × 46px`, `2px solid var(--brand-dark)` border |
| `.brand-name` | `18px`, weight 700, `max-width:15ch` + ellipsis |
| `.brand-role` | `18px` |
| `.nav-links a` | `18px`, padding `8px 14px`, pill hover background, gap `6px` between links |
| Header CTA (`.cta-btn`) | padding `9px 18px`, font `18px`, pill radius, `--shadow-accent` |
| Hamburger icon | `24px × 2px` bars, `5px` gap, `6px` padding |

**Responsive collapse — snap to the §0 scale:**
- `≤1200px` (verify per site, see §3.2): hamburger menu appears; `.nav-links` becomes
  an absolute dropdown; navbar compresses to `min-height:60px`, `padding:8px 16px`;
  hamburger button `38px × 38px`; CTA padding `9px 16px` / font `15px` /
  `min-height:38px`; `.brand-name` `17px`, `.brand-role` `15px`.
- `≤480px`: `.brand-name` `16px`, `.brand-role` `14px`, CTA text `13px`, CTA padding
  `8px 12px`.
- `≤360px`: `.brand-role` hidden entirely; CTA padding `8px 10px`.

Keep all header sizing for the collapsed state in this one `≤1200px`-family block. A
second, conflicting block (e.g. a separate `≤640px` brand-role/avatar rule that the later
block overrides in the cascade) is dead weight: collapse it into one block when editing a
site's CSS, and don't carry it into new sites.

### 3.1 Nav-links auto-shift when the CTA is hidden (mandatory)

`.nav-links` carries `margin-left: auto` on desktop. In a flex `.navbar` (brand →
nav-links → nav-actions), an auto left-margin on `nav-links` absorbs all free space
*before* it, pushing nav-links and everything after it flush to the right edge as one
group — with no `:has()`, JS, or extra wrapper markup required.

**Why this matters:** if a microsite's CTA (`.cta-btn` / "Book Appointment") is removed
from the DOM or hidden (`<a id="openBookingBtn" hidden>` — see the accompanying
`.cta-btn[hidden] { display: none; }` override, needed because the class's own
`display: inline-flex` would otherwise beat the browser's default `[hidden]` styling),
`nav-actions` collapses to zero visible width on desktop. Because `nav-links` already
owns the auto-margin, it automatically becomes the rightmost element and hugs the right
edge — it does **not** stay stranded in the middle of the header the way it would under
a plain `justify-content: space-between` layout (where a 3-item flex row keeps the
middle item roughly centered regardless of the last item's width).

Reset `margin-left: 0` on `.nav-links` inside the mobile dropdown breakpoint (`≤1200px`,
or whatever value §3.2's measurement gives) — once
`.nav-links` becomes `position: absolute; left:0; right:0`, the auto margin is
irrelevant to layout but should be neutralized for clarity.

Apply this same auto-margin pattern to every microsite's header, whether or not that
specific site currently plans to hide its CTA — it costs nothing when the CTA is
present and makes "sometimes no booking CTA" a supported, zero-JS configuration.

### 3.2 The desktop-nav crush zone (bug class — verify on every microsite)

**Definition:** a "crush zone" (or dead zone) is a range of viewport widths, strictly
between the full-desktop layout and the hamburger breakpoint, where the header is
broken in a third way that's neither the desktop nor the mobile design — not a
hamburger-menu bug, not a full-desktop bug.

**Symptom:** somewhere in that range, the doctor's name shrinks to a sliver (e.g.
"D...") while the nav links sit crammed right next to it.

**Root cause:** `.navbar` is a flex row of `brand` → `nav-links` → `nav-actions`.
`nav-links`'s links are `white-space: nowrap`, so that box can't shrink below its
intrinsic content width. `.nav-actions` is explicitly `flex-shrink: 0`. That leaves
`.brand` — which has no `min-width` and default `flex-shrink: 1` — as the *only* item
absorbing 100% of any shortfall. As the viewport narrows past the point where the full
row still fits, `.brand`'s box (and therefore `.brand-name`'s truncated text) gets
squeezed continuously smaller, all the way down to a few px, before the hamburger
breakpoint finally rescues it. With 6 nav links and the full "Book Appointment" label, this
crush zone measured **1030px–1180px**, so a hamburger breakpoint set at `1030px` sat
comfortably inside its own crush zone rather than above it.

**Fix:** the hamburger/mobile breakpoint must sit *above* this crush zone, not at an
arbitrary round number. Measure it, don't guess it:

1. Load the page at full desktop width and shrink the viewport in ~10–15px steps.
2. Watch `.brand-name`'s rendered width (or just watch for the name visibly shrinking
   while nav-links stays full width) — note the width where it first starts shrinking
   below its natural size.
3. Set the hamburger breakpoint at least ~20px above that measured point, as a safety
   margin. In the example above the crush started at `1180px`, so the breakpoint goes
   to `1200px`, which eliminates the crush zone entirely — the header snaps cleanly
   from full-width desktop nav directly to the compact mobile/hamburger layout with no
   in-between crushed state.
4. Re-test with a longer doctor name (near the `.brand-name` 15ch cap) — a heavier
   name or a nav with more links pushes the crush zone's start wider still, so the
   safe breakpoint number is specific to each microsite's actual header content, not a
   fixed constant to copy without re-checking.

This is a structural class of bug, not a one-time fix — check for it on every new or
edited microsite header, especially ones with more nav links, a longer brand name, or
a wider CTA label than the example above.

---

## 4. Hero Section

| Element | Value |
|---|---|
| Section padding | `0` (all vertical rhythm lives in `.hero-layout`, not the section itself) |
| `.hero-layout` | grid `1.05fr 0.95fr`, `gap:56px`, `padding-top:36px`, `padding-bottom:40px` |
| `h1` (doctor name) | `clamp(36px, 5.2vw, 58px)`, weight 800, line-height `1.05` |
| Credentials / reg-id / languages lines | `18px` each |
| Fellowship line (optional) | Same `hero-credentials` style as the qualifications line, directly beneath it: `fa-award` icon + `Fellowship: <value>`. One plain text node (no inner `<span>` — the global `span { color }` reset turns it black). Multiple fellowships come as one string, separated by `;`; the line wraps, never clamps. |
| Glass/translucent hero tiles | Stat boxes and social buttons must have an **opaque** fill (tint layered over the solid hero colour) when a decorative scan line/sweep animates behind the hero — a semi-transparent tile lets the animation show through and looks like it is on top of the content. |
| Expert/specialty badge | padding `9px 18px 9px 14px`, font `18px` |
| Stats grid | 3 columns, `gap:14px`, `margin-bottom:22px` |
| Stat box | padding `18px 14px`, `--radius-lg` (20px); icon `30px`; number `26px` weight 800; label `18px` |
| Hero portrait | `max-width:380px`, `aspect-ratio:3/4`, `8px solid #fff` border, `2px` outline offset `7px` |
| Hero secondary action button | padding `13px 28px`, font `18px`, solid `var(--accent)` background, white text, pill — see §15, no outline/ghost buttons |
| Social icon row | `gap:10px`; each icon `46px × 46px` circle, `19px` glyph |
| Floating decorative icons | `62px × 62px` circle, inner glyph `30px` (throat variant `26px`) |

**Breakpoints:**
- `≥901px`: hero-visual right-aligns.
- `≤980px`: hero collapses to a single column; `padding-top:28px` / `padding-bottom:32px`;
  gap `40px`; portrait shrinks to `max-width:260px`; float icons shrink to `50px`.
- `≤560px`: stats grid drops from 3 to 2 columns.

Stat numbers **must** animate as live counters (IntersectionObserver threshold `0.4`,
`1400ms` cubic-ease-out, triggers once, respects `prefers-reduced-motion`, preserves
`+`/`%`/`k` suffixes) — this is non-negotiable. Use the shared counter in Appendix A.13:
mark each number with `data-counter`, and the script reads the target and suffix from the
element's own text (`15+`, `20k+`, `20,000+`). Don't use `data-count-to` / `data-suffix`
attributes: they show the wrong number once the page is templated (parameterization.md §4).

Hero markup: Appendix A.3.

---

## 5. About Section

| Element | Value |
|---|---|
| Section padding | `20px 0` (same at all breakpoints) |
| `.about-layout` | grid `0.58fr 1.42fr`, `gap:48px` → collapses to 1 column at `≤1100px` |
| `h2` (`.about-title`) | `34px`, weight 800 → `30px` at `≤480px` |
| Lede/intro paragraph | `22px`, weight 700, line-height `1.5`, left border `4px solid var(--accent)`, `padding-left:18px` |
| Bio paragraphs | `18px`, line-height `1.6`, `text-align:justify` |
| Photo frame | `aspect-ratio:4/5`, `5px solid var(--surface)` border, capped `max-width:340px` and centered at `≤1100px` |

**Read More toggle** — copy the code in §24 verbatim. Clamp value: `7` lines via
`-webkit-line-clamp`. Toggle button font-size `18px` (matching body text, per §0.1).

---

## 6. Services Section

| Element | Value |
|---|---|
| Section padding | `20px 0` |
| Header block | `max-width:700px`, `margin-bottom:48px` |
| Grid | `repeat(12, minmax(0,1fr))`, `gap:26px` |
| Card span (desktop) | `span 4` → **3 per row** |
| Card | `--radius-xl` (28px), padding `30px 28px 26px`, `--shadow-card` |
| Icon | `54px × 54px` circle, `20px` glyph |
| Card `h3` | `22px` → `20px` at `≤480px` |
| Card `p` | `18px` |

**Card headings vs. body (applies to every card on the site).** A card's heading (`h3`/`h4`)
must be visibly **bolder and larger** than the body text inside the same card: weight 600–700+
and a bigger size than its 18px paragraph (e.g. 20–22px), on services, philosophy pillars,
journey steps, contact items, FAQ questions and any other card. A heading the same size and weight
as its text is a FAIL. Never nest a card inside a bigger card: sub-items inside a card get a
divider (`border-top`/spacing/icon row), not their own bordered or shadowed mini-card.

**Leftover-row centering** (copy verbatim from §23 — this is mandatory):
- 1 leftover card → `grid-column: 3 / span 8` (widened to 2 card-widths, centered).
- 2 leftover cards → `grid-column: 3 / span 4` and `7 / span 4` (both normal width,
  shifted inward as a centered pair).
- **Breakpoints**: `≤1100px` → 2 per row (`span 6`, leftover centered at `4 / span 6`).
  `≤640px` → 1 per row (`grid-column: 1 / -1` for every card, leftover or not).
- Verify against 4/5/6/7-card totals before shipping — regressions are invisible at 6.

---

## 7. Care Philosophy (Split-Screen)

| Element | Value |
|---|---|
| Section padding | `20px 0` |
| Layout | grid `0.9fr 1.1fr`, `gap:56px` → 1 column at `≤1100px` |
| Image frame | `max-width:460px`, fixed `height:440px`, `5px solid var(--brand-dark)` border, `--radius-xl` |
| Floating credential badge | padding `14px 18px`, `--radius-lg`; icon `40px × 40px` (`16px` glyph); label `strong` `18px` / `span` `18px` |
| Pillars list | `gap:26px`, `margin-top:30px`; connecting rail `2px` dashed via `repeating-linear-gradient` |
| Pillar icon | `52px × 52px` circle, `19px` glyph; index badge `20px × 20px`, `10px` numeral |
| Pillar `h3` / `p` | `18px` / `18px` |

---

## 8. Consultation Journey (4-Step Timeline)

| Element | Value |
|---|---|
| Section padding | `20px 0`; header `margin-bottom:56px` |
| Timeline container | `max-width:900px`; connecting line `2px` |
| Step grid | `1fr 84px 1fr`, `column-gap:32px`; steps stack with `margin-top:44px` between them |
| Step-number chip | `26px × 26px` circle, `13px` numeral |
| Step circle (main icon) | `64px × 64px`, `3px` border, `24px` glyph |
| Hover animation | `transform: scale(1.06)` on the step circle — **no rotation/glow**, despite earlier design notes describing "rotate and glow on hover." Treat scale-only as the accepted implementation unless a specific microsite wants to add a rotating dotted ring instead. |
| Step `h3` / `p` | `20px` / `18px` |

**Breakpoint `≤900px`** (one cutoff, per §0 — not a separate 760px one): rail
moves to `left:27px`; grid becomes `56px 1fr`, `column-gap:20px`; step gap tightens to
`36px`; step circle shrinks to `56px` (glyph `20px`).

Accent color: set the step colour once (Appendix A.6 uses `--accent` for every step), or
genuinely vary it per step (e.g. alternate `--accent`/`--brand`). Don't write duplicate
per-`nth-child` rules that all resolve to the same value — that is dead code.

Markup and CSS for the default Journey design: Appendix A.6. Care Philosophy (§7): Appendix A.5.

---

## 9. Testimonials (removed)

**No microsite has a Testimonials section.** Do not add one, and do not add a
"Testimonials" link to the header, mobile menu, or footer nav. The section number is kept
only so existing cross-references (§N) stay stable. Parameterized builds must not emit
`{{#testimonials}}`, `testimonial_title`, or `testimonial_subtitle`.

---

## 10. Practice Gallery

| Element | Value |
|---|---|
| Section padding | `20px 0` |
| Grid | 12-track system (`repeat(12, minmax(0,1fr))`, `gap:18px`), same mechanism as Services §6 — 3 per row desktop (`span 4`), 2 per row at `≤1100px` (`span 6`), stays 2-column down to smallest widths (no forced single-column gallery) |
| Item | `aspect-ratio:4/3`, `--radius-lg`, `--shadow-card`; hover: image `scale(1.08)` |

**Leftover-row centering is mandatory here too** — copy the exact same §23 code used
for Services, applied to `.gallery-item` instead of `.service-card`: 1 leftover item
widens to `span 8` and centers; 2 leftover items stay `span 4` each, shifted to columns
3 and 7. At `≤1100px`, reset to `span 6` and re-center a lone leftover at `4 / span 6`.
A gallery with 6 items will never visibly exercise this —
verify with 4/5/7 test images before shipping, same caveat as the services grid.
| **Lightbox** | overlay `z-index:600`; content `max-width:min(1100px,92vw)`, `max-height:82dvh`, `radius:18px`; close button `40px × 40px` (`26px` glyph); nav arrows `50px × 50px` (`36px` glyph) → `44px × 44px` (`28px` glyph) relocated below image at `≤768px`; supports keyboard arrows + Escape |
| Lightbox backdrop | see §16 for the unified overlay-color ruling — use `--overlay-backdrop`, not a one-off value |

`dvh` above means **dynamic viewport height** — like `vh`, but it recalculates when a
mobile browser's address bar/toolbar shows or hides, so a modal sized with `dvh` won't
be clipped or leave a gap as the browser chrome appears/disappears. Prefer `dvh` over
`vh` for any full-height overlay; only fall back to `vh` inside an `@supports not
(height: 1dvh)` block for older browsers (see §13.2 for that fallback pattern).

---

## 11. Booking Modal

| Element | Value |
|---|---|
| Overlay z-index | `700`; padding around dialog `20px` |
| Dialog | `width:min(600px,96vw)`, `max-height:90dvh`, `radius:20px` |
| Header | sticky, padding `20px 32px 0`, `2px solid var(--border)` bottom border |
| Close (×) | `28px` glyph, icon-only hit area |
| Tabs (Clinic Visit / Online) | padding `10px 20px`, font `16px` — form-control scale, see the font-size ruling below |
| Form body | `gap:12px`, padding `0 32px 32px` |
| Inputs/selects/textarea | padding `11px 14px`, `1.5px` border, `10px` radius, font `16px` — form-control scale |
| Error text | `16px`, fixed semantic error red (e.g. `#dc2626`) — semantic colors don't vary by brand palette, per §1.1 |
| Calendar popover | `radius:14px`, padding `14px`, `min-width:280px`; day cells `aspect-ratio:1/1`, `16px`; nav buttons `30px × 30px` |
| Upload button | padding `9px 18px`, pill, font `18px` — button scale, see ruling below |
| Upload preview thumb/icon | `42px × 42px`; remove button `30px × 30px` |
| Consent checkbox | `18px × 18px` |
| **Submit button** | full width, padding `14px`, pill, font `18px` — button scale, see ruling below, weight 700 |
| Loader spinner | `46px × 46px`, `4px` border |
| Confirmation popup | width `380px`, padding `34px 30px`, `--radius-xl`; icon `52px`; heading `22px`; body `16px`; OK button padding `11px 34px`, font `16px` |

**Font-size ruling (resolved, stated once):** this modal has two distinct type scales.
**Form controls** (inputs/selects/textareas, tabs, calendar, labels, confirmation-popup
body/OK button) stay at **16px** — an accepted distinct "form-field" scale, smaller
than body copy by design, matching typical dense-form conventions. **Buttons that read
as the modal's primary action** (submit, upload) instead follow the sitewide **18px**
button standard (§15); a 16px submit or upload button is a bug to fix. The confirmation-popup
OK button stays at 16px since it's a
compact secondary dialog, not a primary CTA context — see §15's own table for the same
exception stated from the button side.

At `≤640px`: form fields go single-column; header/footer padding reduces to `18px`/`24px`.

**Font must match the site, not the browser's default UI font (mandatory).** `input`,
`select`, `textarea`, and `button` do **not** inherit `font-family` from `body` by
default in any browser — without an explicit override they silently render in the
OS/browser's UI font instead of `var(--font-heading)`/`var(--font-body)`, which reads
as a jarring, obviously-wrong font swap the moment a user clicks into a field. Every
form control and button inside the booking modal (`.booking-field input/select/
textarea`, `.booking-tab`, `.booking-submit-btn`, `.booking-upload-btn`, the calendar
nav buttons) must carry `font-family: inherit;` so it picks up the body's font. The
Appendix A.10 CSS does this — keep it that way on every new field
or button added to the form, since it's the kind of omission that's invisible in a
design mock and only shows up once real text is typed into a live input.

**Consent checkbox label (mandatory, exact wording).** Every microsite's booking modal
— on `index.html` — uses this label, verbatim:

```html
<label for="consentCheckbox">I agree to the Privacy Policy and consent to Dr. {{full_name}} and DigiDr using my details to provide my consultation. I can withdraw consent or request data deletion at info@digidr.app.</label>
```

- The doctor name follows the page's own convention: `Dr. {{full_name}}` on param/live
  builds, the site's hardcoded `Dr. <Name>` on non-param sites, `Dr. [Doctor Name]` in
  the Appendix A.10 reference markup. Never use a name different from the one in the page's
  `.brand-name`.
- Do not reintroduce the old "I consent to share my provided details with the doctor."
  wording or the longer "technology provider … corrected or erased" variant.
- "Privacy Policy" is plain text (no link) unless a link is requested explicitly.
- Keep the `consentCheckbox` id and the `if (!consentGiven)` validation in
  `script/index.js` untouched — only the label text changes.

---

## 12. Footer

One footer spec for every page (marketing pages and legal pages alike — two divergent
`.site-footer` rule blocks are a bug). Markup and CSS: Appendix A.11.

| Element | Value |
|---|---|
| `.site-footer` | padding `32px 0 0`, `4px solid var(--accent)` top border |
| `.footer-inner` | `max-width:760px`, two-column `grid-template-columns:minmax(0, max-content) minmax(0, max-content)` (plain `max-content` tracks can't shrink, so a long doctor name overflows the page), `gap:36px` → 1 column at `≤640px` |
| Logo/avatar | reuses header `.avatar`, `46px` |
| Tagline / social label | `18px` |
| **Social icons** | **`36px × 36px`** circle, everywhere — this is the single standard, legal-page footers included (a `42px` legal-page variant is a bug) |
| Links group heading (`h4`) | `18px`, weight 800, uppercase |
| Footer nav links | `18px` |
| Copyright row | `18px`, padding `14px 24px`, `1px solid` faint light divider (e.g. `hsla(0,0%,100%,.14)` on a dark footer background — invert to a dark-on-light divider if the footer background is light) |
| Visitor badge | padding `10px 18px`, the same on every page (§44) |

Breakpoints: `≤1100px` → 2-column grid; `≤640px` → 1-column, social icons become a
4-per-row grid.

---

## 13. Chatbot Widget

Full spec below. The complete stylesheet is Appendix A.16 and the script (`chatbot.js`,
identical on every microsite) is Appendix A.19. Chatbot colors follow the same
placeholder rule as §1: define
`--chatbot-primary: var(--accent)` and `--chatbot-primary-hover: var(--accent-dark)` so
the widget automatically inherits that site's own accent hue rather than hardcoding one.

### 13.1 Collapsed bubble (FAB)

| Element | Value |
|---|---|
| Position | `fixed; bottom:40px; right:28px; z-index:9999` |
| Expanded-label state | `min-width:100px`, `height:50px`, padding `7px 16px 7px 10px`, pill radius |
| Icon-only collapsed state | `54px × 54px`, padding `5px` |
| FAB image | `32px × 32px` (expanded) / `36px × 36px` (collapsed icon-only) |
| Label text | `16px` |
| Notification badge | `18px × 18px` circle, `9px` numeral, fixed alert-red background (not brand-tinted — a notification dot should read as "new/urgent" consistently across every microsite) |

Desktop (`≥769px`): nudge right edge to `right:44px`.
Mobile (`≤480px`): wrap positioned `left/right:16px; bottom:28px`; expanded-label state
`min-width:98px`, `height:52px`; collapsed icon-only `56px × 56px`.

### 13.2 Expanded chat window

| Breakpoint | Width | Height |
|---|---|---|
| Base / mobile-first default | `400px` (max `calc(100vw - 24px)`) | `min(580px, calc(100dvh - 110px))`, max `620px` |
| `≥769px` (desktop) | `340px` | `min(420px, calc(100dvh - 110px))`, max `440px` |
| `≤480px` | `100%` | `calc(100dvh - 96px)`, radius `20px 20px 8px 8px` |
| Landscape phone (`max-height:500px and max-width:480px`) | — | `calc(100dvh - 84px)` |

Note the inversion: the un-media-queried base rule is actually the *mobile* sizing
(taller window), and the `≥769px` query shrinks it down for desktop. Keep this pattern
when copying to a new microsite — don't "fix" it into a conventional mobile-first scale
without checking both breakpoints render correctly.

### 13.3 Chat window internals

| Element | Value |
|---|---|
| Header padding | `16px 18px` (base) → `10px 14px` (desktop) → `10px 16px` (landscape mobile) |
| Header accent underline | `3px` |
| Header avatar | `44px × 44px` (base) → `40px × 40px` (landscape mobile) |
| Bot/agent name | `16px` |
| Close button | `36px × 36px`, `22px` glyph |
| Suggestion chips | padding `9px 16px`, pill radius, `16px` text |
| Suggestion nav arrows | `26px × 26px`, `10px` glyph |
| Message area padding | `20px 18px 12px`, `gap:14px` |
| Message avatar | `32px × 32px` |
| Message bubble | padding `12px 16px`, `20px` radius (near corner `6px`), font `16px`, line-height `1.5` |
| Timestamp | `16px` |
| Typing indicator dots | `6px × 6px` |
| Input wrap | padding `10px 16px`, `16px` radius, `min-height:48px` |
| Textarea | font `16px`, `max-height:100px` |
| Send button | `44px × 44px`, `14px` radius, `18px × 18px` icon |
| Footer/disclaimer | `16px`, padding `4px 16px 12px` (base) → `2px 14px 8px` (desktop) |

**Contrast note:** bot and user message bubbles both use a white `#ffffff` fill,
distinguished only by text color (`var(--text)` bot vs `var(--accent-dark)` user) and a
subtle shadow/border tint, relying on left/right alignment as the primary visual cue.
Acceptable as-is (alignment is a valid distinguishing signal), but if a future
microsite's chat messages don't have a strong left/right alignment split, give bot vs.
user bubbles distinct background tints instead of relying on text color alone.

**Font must match the site, not the browser's default UI font (mandatory).** The
chatbot is a separately-authored module (`chatbot.css`) layered on top of the page, so
it's easy for it to quietly drift onto a generic sans-serif instead of the specialty's
own type. Same root cause as the booking modal above: `<button>` and `<textarea>` don't
inherit `font-family` from `body`. The Appendix A.16 stylesheet gets this right, and the
pattern must be kept exactly:
- Plain text elements inside the widget (header name, timestamps, footer disclaimer)
  inherit correctly already, since they're `<p>`/`<span>`/`<div>` — no action needed.
- Every **interactive, text-bearing** element needs an explicit override:
  `.chatbot-fab { font-family: inherit; }` (a `<button>`), and
  `.chatbot-suggestion-chip`, `.chatbot-msg-bubble`, `.chatbot-input` all set
  `font-family: var(--font-body, 'Inter', sans-serif);` — the `var(...)` form (rather
  than plain `inherit`) is deliberate here because the message bubbles and chips can be
  generated/re-parented by the chat script after initial load, so tying them directly
  to the site's font token (with a same-family fallback) is more robust than relying on
  inheritance from whatever happens to be their DOM parent at that moment.
- Icon-only controls (`.chatbot-send-btn`, `.chatbot-header-close`) carry no text, so
  they don't need a font-family override — don't add one just for completeness.

---

## 14. Banner Module (Promotional Hero Banner)

`banner-module.css`/`banner-module.js` inject a
single promotional image directly above the hero content, driven by data attributes on
the container (`data-banner-active`, `data-banner-start`/`-end` for scheduling,
`data-banner-src`/`-src-mobile`, `data-banner-href`).

| Element | Value |
|---|---|
| Desktop image | `16 / 2.5` aspect-ratio |
| Mobile image (`≤768px`) | `16 / 5` aspect-ratio, separate `<source>` swapped via `<picture>` |
| Container padding/radius | reduced at `≤768px` (site's standard `.container` gutters apply) |

**Integration pattern (keep exactly):**
- Use `<picture>` with a `media="(max-width:768px)"` `<source>` pointing at the
  mobile-specific image, falling back to the desktop `<img>` — never rely on CSS
  `object-fit` alone to adapt a single asset across that aspect-ratio change.
- `data-banner-active="false"` hides the banner entirely (no active campaign) —
  every microsite should ship with a working inactive state, not just an active demo.
- `loading="eager"` on the banner image (it's above-the-fold, unlike gallery/about
  images which should stay `loading="lazy"`).

Markup, `banner-module.css` and `banner-module.js`: Appendix A.17.

---

## 15. Button Standards (Unified Scale)

> **Superseded in part by §34 and §37 (latest rules win):** primary actions (CTAs, Submit /
> Review, I Agree) keep the solid fill below. Secondary controls (the booking-modal tabs,
> upload button, and close button) use neutral or outline styling, and the About Read More
> toggle is a subtle text link. Wherever this section says "every button is solid", read it as
> "every *primary* button is solid".

**Every button uses the primary/accent color as a solid background — no outline-only or
ghost-button variants, anywhere.** That includes the hero's "secondary" CTA: it is a solid
`--button` fill, not a transparent/outline button that fills in only on hover. There is
no visually distinct "secondary" button style; if a page needs two buttons
side by side with different emphasis, differentiate with size/placement (e.g. a filled
primary next to a smaller filled button), not with fill-vs-outline.

Don't let CTA buttons drift into many different padding pairs and font sizes. Use this
scale — **every row below is a solid `--button`-background fill**:

| Button role | Padding | Font-size | Radius | Example |
|---|---|---|---|---|
| Primary CTA (large) | `14px 30px` | `18px` | pill | Hero CTA, contact CTA |
| Header/nav CTA | `9px 18px` | `18px` | pill | "Book Appointment" in header |
| Modal/dialog primary button | `14px` (full width) | `18px` | pill | Booking submit |
| Small/inline button | `9px 18px` | `18px` | pill | Upload button |
| Compact dialog button | `11px 34px` | `16px` | pill | Confirmation-popup OK (small secondary dialog only) |

Rule of thumb: **any button whose label is meant to be read as a call-to-action uses
18px**, matching body/link text. Only genuinely secondary, low-emphasis controls inside
a compact confirmation dialog (not the main booking flow) may use 16px.

All buttons share the same fill/hover pattern: `--button`/`--button-hover` solid
background, white text, with `--shadow-accent`-family shadow, `3px` lift + shadow
deepen on hover (hover darkens to `--button-hover`, it never inverts to
outline/transparent).

**Known gotcha reminder** (§26): if a button label is wrapped in a
`<span>` (e.g. `<span class="cta-text-desktop">`), the global reset's `span { color: ...
}` rule beats inherited button text color — always add an explicit
`.your-btn-class span { color: #fff; }` override and verify with `getComputedStyle`.

---

## 16. Overlay / Backdrop Colors (Unified)

Don't give different full-screen overlays different backdrop colors. **Use one token,
defined in `:root` with the §1 tokens, everywhere:**

```css
--overlay-backdrop: rgba(<near-black-or-brand-dark>, 0.7);
```

This is a neutral dark overlay independent of the specialty's brand palette — a
near-black or a very dark tint of `--brand-dark` both work; opacity around `0.7` is the
target (anywhere between `.6` and `.85` reads fine, but pick one). Use this single token
for the booking-modal backdrop, the gallery-lightbox backdrop, and any future
full-screen overlay (confirmation popups, image viewers). Don't let different
components on the same page invent their own overlay darkness.

---

## 17. Images & Lighthouse / Performance Checklist

Apply to every microsite:

1. **Local assets over hotlinked images.** Portrait, about, philosophy and gallery photos
   are served from `assets/`. Don't hotlink stock photos (e.g. Unsplash URLs with
   query-string sizing such as `?w=1400&q=80`); download them and serve them locally — hotlinking
   a third party is a Lighthouse and reliability risk (no caching control, dependent on
   an external host staying up, no control over compression).
2. **Explicit dimensions or `aspect-ratio`.** Every content image needs either
   width/height attributes or a CSS `aspect-ratio` (as gallery/about/philosophy frames
   already do) to prevent layout shift (CLS) while loading.
3. **`loading="lazy"` on everything below the fold** (about photo, philosophy photo,
   gallery images). The hero
   portrait and the promotional banner image are above-the-fold and should stay
   `loading="eager"` (or omit the attribute, which defaults to eager).
4. **Compress and size-match before upload.** Don't ship a 1400px-wide source image
   into a 460px display frame (as the philosophy image frame does) — generate/export at
   roughly the largest size the layout will ever display it at (accounting for standard
   2x/3x pixel-density variants only where the design genuinely needs crispness on
   retina, e.g. the hero portrait).
5. **Prefer modern formats** (WebP/AVIF) with a JPEG/PNG fallback where the target
   browser support requires it; this workspace currently ships plain PNG/JPG — flag as
   a future improvement rather than a blocking requirement for now.
6. **Preconnect + font-display:swap** for Google Fonts (`rel="preconnect"` +
   `&display=swap`, as in Appendix A.1) — keep on every microsite.
7. **No placeholder or broken external image URLs** — generate real images per
   the existing "No Placeholders" rule (generate real images, never a placeholder
   URL); this checklist just adds the
   performance dimension on top of that content rule.

---

## 18. Two Structural Additions Beyond the Original 10-Section List (Contact & Lightbox)

The core section order is:

Header → Hero (+ optional promotional banner) → About → Services → Care Philosophy →
Consultation Journey → **Contact** → Practice Gallery (+ lightbox) →
Booking Modal → Footer

(The canonical build list in §21 now also includes the FAQ section after the Gallery, per
§39. Where this list and §21 differ, §21 wins.) Two things below
extend an earlier, shorter 10-section version of this list:
- **Contact section** (id `#contact-us`) sits between Consultation Journey and
  Practice Gallery — a dedicated address/phone/email card, separate from the footer and
  separate from the booking modal. Treat this as a mandatory standard section
  going forward, positioned exactly there in the sequence. Section padding: `20px 0`,
  same as every other section per §19.
- **Gallery lightbox** is part of the standard Gallery section, not optional — every
  gallery grid should be click-to-enlarge with keyboard nav support, matching §10 above.

### 18.1 Contact Section — Full Spec

| Element | Value |
|---|---|
| Section padding | `20px 0` |
| Card | `--radius-xl`, `1px solid var(--border)` (no top border — sits flush under the section header), `--shadow-card`, padding `36px 56px` (→ `32px 20px` at `≤640px`) |
| Header block | centered, `max-width:640px`, `margin: 0 auto 28px` |
| Header `h2` | `34px` |
| Header `p` | `18px` |
| Grid | flex, `flex-wrap:wrap`, centered, `gap:24px`, `max-width:900px` centered in the card |
| Each contact item | `flex:1 1 380px`, `max-width:420px`, centered text → `flex-basis:100%` (stacks) at `≤1100px` |
| Item icon | `52px × 52px` circle, `20px` glyph, solid `var(--accent)` fill |
| Item `h3` | `18px` |
| Item `p` / `a` | `18px` / `18px` (link weight 700) |
| Divider between items | `1px` wide, full-height, `var(--border-light)` — **only rendered when there are 2+ items** (`:has(.contact-item + .contact-item)`), hidden with a single item |

Breakpoints: `≤1100px` — items stack full-width (divider becomes irrelevant since items
are no longer side-by-side); `≤640px` — card padding tightens to `32px 20px`.

---

## 19. Section Vertical Rhythm Summary

Every top-level section uses **`20px 0`** padding, desktop and mobile alike (no
separate mobile override needed for this value).

| Section | Padding |
|---|---|
| About | **20px 0** |
| Services | **20px 0** |
| Philosophy | **20px 0** |
| Consultation Journey | **20px 0** |
| Contact | **20px 0** |
| Gallery | **20px 0** |

Any section shipping a different value is a bug to fix, not a valid variant.

---

## 20. Project Folder Structure & File Conventions

Specialty folders in this workspace — this table is the **single canonical list**
of specialties. `Tag slug` is the exact string used as the Clarity
`clarity('set', 'specialty', '<slug>')` value (§27) — always reuse the slug below for
a given specialty, never invent a new spelling/casing for the same specialty. `Services icon`
is the one Font Awesome icon (`fa-solid <icon>`) used on every Services card for that
specialty (§6; parameterization.md §1 "Loops"):

| Folder | Specialty | Tag slug | Services icon |
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

When adding a brand-new specialty not listed above: add it to this table first (folder
name, display name, a lowercase-hyphenated tag slug and a Services icon), in the same commit
that adds the folder — don't let a new specialty slug get invented ad hoc in a microsite's code.

Each specialty lives in its own folder, one subfolder per microsite variant:

```
<Specialty>/microsite-<specialty>-<n>/
  index.html
  privacy-policy.html
  terms-of-service.html
  robots.txt           ← SEO draft, see §29
  sitemap.xml           ← SEO draft, see §29
  llms.txt              ← LLM-discovery draft, see §29
  styles/
    style.css        ← ALL CSS lives here, no inline layout styles
    chatbot.css       ← chatbot widget styles (§13, Appendix A.16), separate file
    banner-module.css ← promotional banner styles (§14, Appendix A.17), separate file
    legal.css         ← legal-page styles (§41, Appendix A.12), loaded only by the legal pages
  script/
    index.js          ← ALL JS lives here (counters, carousel, modal, grid logic, read-more)
    chatbot.js
    banner-module.js
    analytics.js      ← GA4 + Clarity event tracking (§40), loaded before index.js
  assets/              ← images and media (doctor photo, about/philosophy photos, icons)
```

- CSS lives exclusively in `styles/style.css` (plus the separately-loaded
  `chatbot.css`/`banner-module.css`/`legal.css` module files) — never inline
  `style="..."` for layout rules.
- JS lives exclusively in `script/index.js` (plus `chatbot.js`/`banner-module.js`/`analytics.js`).
  The only inline `<script>` blocks allowed are the Clarity and GA4 snippets in `<head>` (§27, §40).
- Internal links between pages use relative paths (`privacy-policy.html`, `index.html#about`),
  never absolute URLs.
- Doctor/clinic images go in `assets/`; prefer local assets over hotlinked images (§17).
- **Never delete a file without explicit user approval.**
- Test every new/edited layout with long doctor names and long specialty text before
  calling it done (this is what surfaces bugs like the header crush zone in §3.2).

### 20.1 Why the Responsive-Text Rules Exist, and Their Exceptions

Doctor names, clinic addresses, badge text, and service descriptions are dynamic and
can be long. Without the four rules below (baked into the §22 global CSS block), long
text overflows containers, breaks layouts, or causes horizontal scrollbars — especially
on mobile. Each rule defends against a specific failure mode:

- **Rule 1 — No Hard Text Overflow.** Never apply `white-space: nowrap` to any heading,
  badge, pill, chip, name, or paragraph that could contain dynamic/long content — use
  `overflow-wrap: break-word; word-break: break-word; white-space: normal;` instead.
  `nowrap` is only acceptable for single-line UI labels where content length is
  guaranteed short (see exceptions table below).
- **Rule 2 — Flex & Grid Child Shrink Defense.** All flex/grid children need
  `min-width: 0` so they can shrink below their content size instead of overflowing
  their parent. Without it, a flex child with long text pushes siblings out of frame
  instead of wrapping internally — this is the same mechanism behind the header crush
  zone in §3.2, just manifesting as a sideways overflow instead of a squeeze.
  `min-width: 0` on some elements and *not* others is exactly how that crush zone bug
  happens — the goal here is unbounded shrink where wrapping is fine, not everywhere.
- **Rule 3 — Auto-Height Parent Containers.** Cards, hero elements, badges, and chips
  must expand vertically when content wraps — never a fixed height. Use
  `height: auto !important; min-height: fit-content; max-width: 100%;`.
- **Rule 4 — Social Icon Rows Must Wrap.** Any row of social icons (header, hero,
  footer) is a flex container and must include `flex-wrap: wrap`, or the row silently
  overflows its pill/card container on narrow viewports instead of dropping icons to a
  second line.

**Special cases & exceptions** — situations where the rules above deliberately don't
apply:

| Situation | Exception |
|---|---|
| Hero `h1` with a doctor's name that must stay on one line on desktop only | Apply `white-space: nowrap` **only** in the desktop base style; the mobile media query must reset it to `white-space: normal` so it wraps on small screens. |
| Icon-only buttons or nav items | `white-space: nowrap` is fine — content is a fixed icon, not dynamic text. |
| Code snippets / `<pre>` / `<code>` blocks | `word-break`/`overflow-wrap` don't apply — use `overflow-x: auto` instead. |
| Fixed-height decorative elements (background blobs, SVG shapes) | Fixed heights are acceptable **only** for purely decorative, non-text elements. |

---

## 21. Standard Page Section Order (Full Build List)

`index.html`'s sections, in order, each with its own numbered spec above:

| # | Section | Purpose | Spec |
|---|---|---|---|
| 1 | Header / Nav | Sticky header: doctor name, specialty role, nav links, booking CTA | §3, §32, A.2 |
| 2 | Hero | Portrait, credentials, key stats (animated counters), languages, social links, CTAs | §4, §33, A.3 |
| 3 | About | Executive bio — no icons, premium typography, Read More toggle if long | §5, §24 |
| 4 | Services | Responsive 12-track grid of core clinical services | §6, §23 |
| 5 | Social Media widget | "From My Social Media" Facebook-posts carousel, straight after Services; hidden entirely when there are no posts (optional section) | §30, §30.1, A.4 |
| 6 | Care Philosophy | Split-screen: image + floating badge, 3 pillars with connecting rail | §7, A.5 |
| 7 | Consultation Journey | 4-step animated timeline | §8, A.6 |
| 8 | Contact | Dedicated address/phone/email card (mandatory section) | §18.1, §35, A.7 |
| 9 | Practice Gallery | Grid + lightbox, 12-track centering same as Services | §10, §23, A.8 |
| 10 | FAQ | Accordion of at least 5 specialty-specific questions, straight after the Gallery (`#faq`) | §39, A.9 |
| 11 | Booking Modal | Popup form: date/time, file upload, phone input, consent | §11, §25, §37, A.10 |
| 12 | Footer | Branding, social links, quick/legal links, visitor badge, copyright | §12, §36, §44, A.11 |

"A.n" is the reference markup and CSS in Appendix A.

Plus two persistent overlays present on every page load (not scroll sections):
**Chatbot widget** (§13) and, only on the homepage hero, the optional **promotional
banner module** (§14).

Every page also needs: a unique `<title>`, `<meta name="description">`, exactly one
`<h1>`, and semantic HTML5 elements throughout (`<header>`, `<section>`, `<article>`,
`<footer>`, `<nav>`) — this applies to `privacy-policy.html` and `terms-of-service.html` too, not just `index.html`.

---

## 22. Mandatory Global CSS Block (Copy-Paste)

Every microsite's `styles/style.css` must include this block near the top, immediately
after the `:root { }` token declarations (§1). Search for the `DigiDr Global` comment
marker before adding it to an existing site — skip if already present, never duplicate.

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
  color: var(--text);
}

.about-section p,
.about-intro p,
.about-story p,
.about-story-new p {
  text-align: justify;
  line-height: 1.8;
  color: var(--text);
  hyphens: auto;
}

/* Rule 2: Flex & Grid Child Shrink Defense — add every new component class
   used as a flex/grid child to this list */
.hero-content, .hero-visual, .hero-topbar, .hero-stats, .hero-stat, .hero-actions,
.about-aside, .about-content, .service-card, .service-body, .contact-card,
.contact-item, .brand-text, .navbar,
.container, .nav-links, .nav-actions {
  min-width: 0;
}

/* Rule 3: Parent Container Auto-Height Expansion — add every new card/badge/
   chip class to this list */
.hero-badge, .hero-reg, .hero-title, .hero-subtitle, .hero-stats, .hero-stat,
.hero-chip, .service-card, .contact-card, .about-story,
.card, article, aside {
  height: auto !important;
  min-height: fit-content;
  max-width: 100%;
}
```

**Rule 4 (social icon rows)** isn't a single reusable block since each site names its
social wrapper differently — but every such container, whatever its class name (footer
social row, hero social row, header social row) must include:

```css
.footer-social, .social-links, .hero-social {
  display: flex;
  flex-wrap: wrap; /* required — prevents overflow at narrow viewport widths */
  gap: 10px;
}
```

---

## 23. Grid Centering — Copy-Paste Code (Services & Gallery)

The exact reusable pattern behind §6 and §10's leftover-row centering. Copy verbatim,
swap only the class name (`.service-card` ↔ `.gallery-item`), and **do not reorder the
rules** — the reset and the centering override are equal specificity and depend on
source order:

```css
.services-grid { /* or .gallery-grid */
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 26px; /* 18px for gallery */
  align-items: stretch;
  justify-content: center;
}

.service-card { /* or .gallery-item */
  grid-column: span 4;
  min-width: 0;
}

/* Final row holds ONE leftover card (total count leaves remainder 1 when
   divided by 3): widen it to two
   card-widths (span 8 = 2x4 tracks + the gap between) and centre it. */
.service-card:last-child:nth-child(3n + 1) {
  grid-column: 3 / span 8;
}

/* Final row holds TWO leftover cards (total count leaves remainder 2 when
   divided by 3): keep both at normal
   card width and shift the pair inward so it centres on the row. */
.service-card:nth-last-child(2):nth-child(3n + 1) {
  grid-column: 3 / span 4;
}
.service-card:last-child:nth-child(3n + 2) {
  grid-column: 7 / span 4;
}

@media (max-width: 1100px) {
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
  /* 1 per row (Services only — Gallery stays 2-column, see §10) */
  .service-card,
  .service-card:last-child:nth-child(odd),
  .service-card:last-child:nth-child(3n + 1),
  .service-card:nth-last-child(2):nth-child(3n + 1),
  .service-card:last-child:nth-child(3n + 2) {
    grid-column: 1 / -1;
  }
}
```

Card content centering (pairs with the grid above — needed because `align-items:
stretch` gives every card in a row equal height):

```css
.service-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 12px;
}
.service-card .service-icon { margin: 0 auto; }
.service-card-title, .service-card-desc { text-align: center; }
```

Verify against totals of **4, 5, 6, and 7** cards/images before shipping — the leftover
rules are dormant at 6 (an even multiple of the row size) and a regression is invisible
there.

---

## 24. Read More Toggle — Copy-Paste Code

Add to any About-section bio long enough to plausibly exceed 7 lines. Before adding,
search `styles/style.css` for the `Read More toggle` comment marker and `script/index.js`
for `DigiDrReadMore` — skip if already present.

**HTML** (wrap the existing bio paragraph(s), don't alter the bio text itself):

```html
<div class="about-story-new read-more-wrap">
  <div class="read-more-content">
    <p>...existing bio paragraph(s), unchanged...</p>
  </div>
  <button type="button" class="read-more-btn" aria-expanded="false" data-ga-event="read_more_click">
    <span>Read More</span>
    <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
  </button>
</div>
```

**CSS** (swap `--button`/`--button-hover` if the site uses different variable names):

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
  font-size: 18px; /* matches body text, per §0.1 — not 16px */
}
.read-more-btn span { color: var(--button, #0f766e); }
.read-more-btn i { transition: transform 0.3s ease; }
.read-more-btn:hover span,
.read-more-btn:hover i,
.read-more-btn:hover { color: var(--button-hover, #0f766e); }
.read-more-wrap.is-expanded .read-more-btn i { transform: rotate(180deg); }
```

**JS** (a self-contained IIFE — an "Immediately Invoked Function Expression," a
function wrapped in parens and called right away so its variables stay private and
don't leak into or collide with anything else in `index.js` — append verbatim to the
end of `script/index.js`, don't
rewrite or inline it elsewhere):

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

Behavior notes: the button **auto-hides** if the bio already fits in 7 lines
(`scrollHeight` vs `clientHeight` check) — test with both a short bio (button should
NOT appear) and a long one (button should appear and toggle). Re-checks on resize
(debounced 200ms). If multiple bio paragraphs exist, keep them all inside the single
`.read-more-content` wrapper — don't create one wrapper per paragraph.

---

## 25. Phone Input Standard (intl-tel-input, Copy-Paste)

Every booking-modal phone field uses **intl-tel-input v29.2.2** via jsDelivr CDN — no
bundler, plain `<script>`/`<link>` tags.

**HTML** (load the library's CSS/JS before `styles/style.css`/`script/index.js` so site
overrides win the cascade; the phone field itself stays a plain input):

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/intl-tel-input@29.2.2/dist/css/intlTelInput.css" />
<script src="https://cdn.jsdelivr.net/npm/intl-tel-input@29.2.2/dist/js/intlTelInput.min.js"></script>

<input type="tel" id="phone" name="phone" placeholder="Enter mobile number" autocomplete="tel" required />
```

**JS** (inside the booking-modal logic in `script/index.js`):

```js
iti = window.intlTelInput(form.phone, {
  initialCountry: "in",
  countryOrder: ["in"],        // pins India to the top of the list
  separateDialCode: true,
  loadUtils: () => import("https://cdn.jsdelivr.net/npm/intl-tel-input@29.2.2/dist/js/utils.js"),
});
iti.promise.then(() => { phoneUtilsReady = true; });
```

- Validate with `iti.isValidNumber()` / `iti.getValidationError()` (real per-country
  rules via libphonenumber, not a hand-rolled regex) — guard every call behind
  `phoneUtilsReady` since utils load asynchronously.
- In the form's `submit` handler, `await iti.promise` before the final validation pass
  so a fast submit can't race the utils download.
- `strictMode` (on by default) already blocks non-digit keystrokes.
- On `form.reset`, call `iti.setNumber(""); iti.setSelectedCountry("in");`.

**Required CSS** (adapt `--border`/`--surface` to the site's own tokens):

```css
.iti { display: block; width: 100%; --iti-border-color: var(--border); --iti-country-selector-bg: var(--surface); }
.iti__country-selector { border-radius: 12px; max-width: none; }        /* see §26 gotcha #1 */
.iti__dial-code { font-size: 15px; }
.booking-field .iti__search-input { padding-left: calc(1em + 24px); padding-right: 14px; padding-top: 8px; padding-bottom: 8px; } /* see §26 gotcha #3 */
.booking-field .iti__tel-input.is-invalid { border-color: #dc2626; box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.15); }
```

**Full Name field** in the same form is letters-only (sanitized live, apostrophes/
hyphens/spaces allowed):

```js
form.fullName?.addEventListener("input", () => {
  const el = form.fullName;
  const sanitized = el.value.replace(/[^A-Za-z\s.'-]/g, "");
  if (sanitized !== el.value) el.value = sanitized;
});
```
paired with: `if (!/^[A-Za-z\s.'-]+$/.test(value)) return "Name should contain only letters.";`

---

## 26. Known CSS Gotchas

The §22 global reset applies to *every* element of a given tag type, including ones a
JS widget injects or nests inside an already-styled component. Three recurring failure
modes, in order of how often they bite. (Two of them turn on **CSS specificity** — the
browser's rule for which of two conflicting selectors wins, scored as three numbers:
`(ID count, class/attribute count, element-tag count)`; a higher first number always
wins, then the second, then the third. `.foo` scores `(0,1,0)`; `.foo input` scores
`(0,1,1)` and beats it, regardless of which rule appears later in the file.)

1. **`max-width: 100%` collapses absolutely-positioned widget panels.** Any `<div>` a
   library positions `absolute` inside an auto-width parent gets its width squashed
   back to the parent's shrink-wrapped size, because percentage `max-width` resolves
   against that ancestor. Symptom: a dropdown/panel renders ~1 character wide. Fix:
   `.iti__country-selector { max-width: none; }` — a single-class selector beats the
   reset's element-type selector, no `!important` needed.
2. **`<span>` text inside a colored button renders in the wrong color.** `color: #fff`
   on a button only sets it by inheritance on child `<span>`s; the reset's
   `span { color: var(--text) }` directly matches the span and wins (a directly-matched
   rule beats a merely-inherited value at equal specificity). Any button/pill whose
   label is wrapped in a `<span>` needs an explicit override:
   `.your-btn-class span { color: #ffffff; }`. Verify with
   `getComputedStyle(span).color`, not just the button's own computed color — they can
   legitimately differ.
3. **`.booking-field input { padding }` collides with a nested widget input** (e.g. a
   search box with a left-aligned icon). The `.booking-field input` selector
   (specificity 0,1,1) beats a widget's own single-class padding rule (0,1,0). Fix with
   a more specific override, e.g. `.booking-field .iti__search-input { padding-left:
   ...; padding-right: ...; }` (see §25).

**Takeaway:** whenever integrating a third-party widget or adding a new colored button,
check rendered results with actual computed styles, not just a screenshot mid-transition
— the global reset can silently override sub-elements even when the outer container
looks correct.

---

## 27. Microsoft Clarity Analytics Standard (Shared Project, Mandatory)

All microsites share **one** Microsoft Clarity project ("DigiDr Microsites", project ID
`ymqvcvdc4v`) rather than a separate Clarity project per microsite. At 1000+ microsites,
one-project-per-site does not scale (no bulk/API project creation in Clarity); instead,
every microsite loads the same project ID and self-identifies via two custom tags.

**Snippet** (place in `<head>`, immediately after the Clarity IIFE's closing
`</script>`):

```html
<!-- Microsoft Clarity -->
<script type="text/javascript">
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "ymqvcvdc4v");
</script>
<script>
    if (typeof clarity === "function") {
      clarity('set', 'microsite', '{{slug}}');
      clarity('set', 'specialty', '<tag-slug-from-§20-table>');
    }
</script>
```

- **Never** generate or hardcode a new per-site Clarity project ID (no more
  `CLARITY_ID_<DOCTOR_NAME>` placeholders) — always the single shared ID above.
- `microsite` tag value: should be the templated `{{slug}}` variable (already available
  on `<body data-slug="{{slug}}">` in every page). **Current exception:** the backend
  does not yet resolve `{{slug}}` for already-deployed live microsites, so for those,
  hardcode the site's actual live URL slug instead (e.g. `https://digidr.app/drraj` →
  `clarity('set', 'microsite', 'drraj')`) — note the live slug can differ from the
  folder name. Switch back to `{{slug}}` once the backend resolves it for these pages.
- `specialty` tag value: must be one of the exact tag slugs in the §20 specialty table
  (e.g. `dentist`, `ent`, `oncology`) — never invent a new spelling for an existing
  specialty, and add new specialties to that table first (§20).
- Apply to every page that loads Clarity (`index.html`, `privacy-policy.html`,
  and `terms-of-service.html`).
- This reuses Clarity's built-in Filters panel for per-site and per-specialty session
  filtering/rollups inside the one shared project — no additional dashboard setup
  required.

---

## 28. New Microsite Build Checklist

Working order for building a new microsite from this file alone:

1. Create the folder structure (§20) and the page shell (Appendix A.1), including the shared
   Clarity snippet + `microsite`/`specialty` tags on every page (§27).
2. Pick real HSL values for every `:root` token (§1), verify AA 4.5:1 contrast before
   finalizing.
3. Add the mandatory global CSS block (§22) right after the `:root` block.
4. Set up `.container` (§2) and the header (§3), including the nav-links auto-shift
   pattern (§3.1) and a measured (not guessed) hamburger breakpoint (§3.2).
5. Build each page section in order (§21), pulling exact values from that section's
   spec (§4–§10, §18.1) and the reference markup/CSS in Appendix A (A.2–A.11) as you go.
   Put the shared page JavaScript (Appendix A.13) into `script/index.js`.
6. Wire up the Services and Gallery grids using the copy-paste centering code (§23);
   test with 4/5/6/7 items each.
7. Add the Read More toggle to the About bio if it's long enough (§24).
8. Build the Booking Modal (§11, Appendix A.10) with the phone input standard (§25). Its
   JavaScript is Appendix A.18 (A)–(C), copied verbatim.
9. Add the Chatbot widget (§13: `chatbot.js` from Appendix A.19, `chatbot.css` from
   Appendix A.16) and the promotional Banner Module (§14, Appendix A.17), inactive unless a
   campaign is running.
10. Apply the unified Button Standard (§15) and the unified Overlay token (§16) across
    every button/modal/lightbox on the site.
11. Run the Images/Lighthouse checklist (§17).
12. Test: long doctor names and long specialty text everywhere: full responsive range
    320px–1440px (§0); the header crush zone specifically (§3.2); grid counts of
    4/5/6/7 (§6, §10, §23); Read More with both a short and long bio (§24); form-field
    and chatbot fonts actually match the site font, not the browser default (§11, §13);
    check for the known gotchas (§26) on every third-party widget and colored button; every
    icon renders and is visible on its background at every width (§45).
13. Add `robots.txt`, `sitemap.xml`, and `llms.txt` at the microsite folder root (§29,
    Appendix A.15).
14. Apply the mobile-responsiveness mandate (§31) while building every section, and the
    header, hero, about, contact, and gallery content rules (§32–§35).
15. Build the footer once (Appendix A.11) and reuse it identically on all three pages,
    compact (§36), with the live visitor counter (§44).
16. Add the booking-modal info tooltip, consent panel, and button-colour rules (§37, Appendix
    A.10), and the chatbot layout and two-line footer note (§38).
17. Add the FAQ section after the Gallery and use the default Philosophy / Journey / FAQ
    designs unless a new design is made (§39, Appendix A.5, A.6, A.9).
18. Add GA4 + `analytics.js` (Appendix A.14) and every event in §40 (on top of Clarity, §27).
19. Copy the exact Privacy Policy and Terms of Service text, with the Back button (§41,
    page markup and `legal.css` in Appendix A.12).
20. Check content accuracy and template hygiene (§42), then run the audit in
    `verification.md` (§43).

---

## 29. robots.txt, sitemap.xml & llms.txt (Per-Microsite Draft, Mandatory)

Every microsite folder root ships three plain-text/XML files, copied from Appendix A.15 and
adjusted only where noted below.
These are **drafts**, not final production files: at 1000+ microsites there is no
per-microsite domain — every microsite is served as a path under one shared domain
(`digidr.app/{{slug}}/`), and `robots.txt`/`sitemap.xml`/`llms.txt` only take effect
when served at that domain's root. The backend team is responsible for merging every
microsite's draft into one combined file served at `digidr.app/robots.txt`,
`digidr.app/sitemap.xml`, and `digidr.app/llms.txt`.

- Base domain is **`digidr.app`** — never invent a different domain or a
  per-microsite subdomain.
- Use the **`{{slug}}`** placeholder in place of the real slug, exactly like
  `index.html`/`privacy-policy.html`/etc. — the backend's template resolver applies to
  every served file, not just HTML pages, so `robots.txt`/`sitemap.xml`/`llms.txt`
  render with the real slug the same way `data-slug="{{slug}}"` does. **Exception:**
  already-deployed live microsites hardcode the real
  resolved slug instead, matching the same live-site exception already documented for
  the Clarity `microsite` tag (§27) — because the backend does not yet re-render those
  pages from source.
- `llms.txt` follows the [llmstxt.org](https://llmstxt.org) convention: an H1 with the
  doctor's name, a one-line blockquote summary, then an `## Pages` section linking the
  profile, privacy policy, and terms of service.
- Every file carries a top comment explaining the draft/merge caveat above — keep that
  comment intact when copying to a new microsite so it isn't lost.
- **robots.txt:**
  ```
  User-agent: *
  Allow: /

  Sitemap: https://digidr.app/sitemap.xml
  ```
- **sitemap.xml:** one `<url>` per live page (home, privacy policy, terms of service),
  `changefreq`/`priority` as in Appendix A.15
  (home: monthly/1.0, legal pages: yearly/0.3).
- **llms.txt:** pull `{{full_name}}`/`{{speciality}}` from the same placeholders already
  used in `index.html`'s `<title>`/meta tags — don't invent new copy.

---

## 30. Social Media Carousel — Alignment & Button Visibility (Mandatory)

Applies to the "From My Social Media" Facebook-embed carousel
(`.social-media-track`, `.social-carousel-prev`/`-next`). The alignment and button
visibility rule below is mandatory for every microsite; the complete widget logic
(API, filters, SDK, card look, skeletons, hide-when-empty) is in §30.1 below, and the full
markup, CSS and JavaScript are in Appendix A.4.

- **Cards fit** → centred, prev/next buttons **hidden**.
  **Cards overflow** → left-aligned (first card beside the prev button), buttons
  **shown**.
- **Alignment (CSS):** `.social-media-track` uses `justify-content: safe center;` —
  never plain `center`. Keep `width: max-content; min-width: 100%; max-width: none;`.
- **Visibility (JS):** at the top of `syncButtons()` in `script/index.js`:
  ```js
  // Nothing to page through when every card already fits.
  const fits = carousel.scrollWidth <= carousel.clientWidth + 1;
  prevBtn.hidden = fits;
  nextBtn.hidden = fits;
  ```
  Leave the existing `disabled` logic below it untouched.
- **Required CSS** (the prev/next button class — `.social-carousel-btn` in Appendix A.4, or
  an older shared `.carousel-btn` — is `display: flex`, which would otherwise defeat `[hidden]`):
  ```css
  .social-carousel-prev[hidden],
  .social-carousel-next[hidden] { display: none; }
  ```
- Test with 2 posts and with 5+ posts, at desktop and ≤900px.

### 30.1 Facebook Post Widget — Full Logic (Single Doctor)

Portable notes on how to render a carousel of live Facebook post embeds for **one
specific doctor**, identified by a `slug` passed in directly (no doctor-list lookup).
The complete implementation that follows these rules is Appendix A.4.

**Goal.** Given a single known `slug`, fetch that doctor's Facebook posts from the
per-doctor API, filter/sort them, and render up to N cards as live embeds via the
official Facebook JS SDK (`FB.XFBML.parse`), with manual prev/next paging — without
ever breaking an already-rendered embed.

#### APIs involved

Base URL: `https://digidrapi.digidr.app`

| # | Endpoint | Used by | Purpose |
|---|----------|---------|---------|
| 1 | `GET /api/MicrositeSocialFeed` | Multi-doctor version only | Lists all doctors with a connected social feed. **Not used** in this single-doctor variant. |
| 2 | `GET /api/MicrositeSocialFeed/{slug}?limit={n}` | This variant | Returns one doctor's Facebook post feed(s), given their `slug`. This is the only API this widget calls. |

Example request for API #2:
```
GET https://digidrapi.digidr.app/api/MicrositeSocialFeed/dr-jane-doe?limit=3
```

Expected shape (fields actually used by the widget; `message` is the post text, used
for the #DigiDr filter in rule 4a):
```json
{
  "success": true,
  "feeds": [
    {
      "platform": "facebook",
      "accountName": "Dr. Jane Doe Clinic",
      "posts": [
        { "permalink": "https://www.facebook.com/.../posts/123", "message": "New clinic hours #DigiDr", "createdAt": "2026-09-10T12:00:00Z" },
        { "permalink": "https://www.facebook.com/.../videos/456", "message": "Watch our video", "createdAt": "2026-09-05T09:00:00Z" }
      ]
    }
  ]
}
```
A doctor can have more than one `feeds` entry (multiple connected accounts); only
entries with `platform === "facebook"` are used.

#### Key difference from the multi-doctor version

The original widget calls a **list API** (`/api/MicrositeSocialFeed`) to discover many
doctors, then fetches one post from each. This variant skips that entirely: the `slug`
is a fixed config value (hardcoded, from a URL param, from page data — whatever fits
the app), and only the **per-doctor API** is called:

```js
const DOCTOR_SLUG = 'dr-jane-doe'; // <-- set this per deployment/page

const url = API_BASE + '/api/MicrositeSocialFeed/' +
    encodeURIComponent(DOCTOR_SLUG) + '?limit=' + POSTS_PER_ACCOUNT;
```

**On the DigiDr live microsites** the slug comes from the page, never a hardcoded
string: only the HTML pages are templated (see `parameterization.md`), so a literal
`{{slug}}` inside `script/index.js` would never be replaced. Read it from
`<body data-slug="{{slug}}">` instead, and treat an unreplaced placeholder as unset:

```js
const RAW_SLUG = (document.body.dataset.slug || "").trim();
const DOCTOR_SLUG = RAW_SLUG.includes("{{") ? "" : RAW_SLUG;
```

The slug is the microsite's real URL slug, which often differs from the folder name
(e.g. a folder `jane-doe` served at `drjane`, `jane-doe-3` or `dr-jane-doe`).
`GET /api/MicrositeSocialFeed` lists them all.

Since there's only one doctor, "one post per owner" no longer applies — instead, show
that doctor's **N most recent qualifying posts** (across all their connected Facebook
accounts, if they have more than one).

#### Core rules

1. **No doctor-list step — the slug is given, not discovered.**
   Do not call the list endpoint at all. Fail fast (hide the section — see rule 11) if
   `DOCTOR_SLUG` is unset/blank, rather than silently calling an API with an empty
   slug.

2. **Cap the number of cards shown at once.**
   `MAX_CARDS = 5` (tune as needed) — the doctor's N most recent posts across all
   their Facebook accounts, not one-per-account. Keeps the embed count (and
   SDK/iframe cost) bounded even if a doctor has many accounts or a very active feed.

3. **Block video posts entirely.**
   Facebook video posts autoplay inside Facebook's own cross-origin iframe, which the
   host page cannot mute, pause, or control. Rather than show an autoplaying video in
   a small carousel card, video permalinks are filtered out before rendering:
   ```js
   function isVideoPermalink(url) {
       return /\/videos\//i.test(url);
   }
   ```
   Detection is done by URL shape (`/videos/` vs `/posts/` in the permalink) since the
   API response has no explicit post-type field.

4. **Only show recent posts.**
   Posts older than a window (`MAX_POST_AGE_DAYS = 183`, about 6 months) are dropped
   so the feed never looks abandoned. A missing or unparseable `createdAt` is treated
   as "too old" rather than shown blindly (fail closed, not open).

4a. **Only show posts tagged #DigiDr.**
   A post qualifies only if its `message` contains the hashtag `#DigiDr` in any
   casing (`#digidr`, `#DIGIDR`, …). It is matched as a whole hashtag, so `#DigiDrX`
   and a bare "DigiDr" without the `#` do not count. A missing `message` fails
   closed. This is an internal filter on the API data — there is no filter button or
   any other UI for it.
   ```js
   const DIGIDR_TAG = /#digidr(?!\w)/i;
   function hasDigiDrTag(message) {
       return typeof message === 'string' && DIGIDR_TAG.test(message);
   }
   // inside the post loop, after the isRecent() check:
   if (!hasDigiDrTag(post.message)) return;
   ```
   Because the tag and age filters discard most posts, request a deeper page from the
   API: `POSTS_PER_ACCOUNT = 50` (the server caps it; `limit` is per connected
   account).

5. **Merge posts across the doctor's accounts, then sort newest-first.**
   A doctor can have more than one connected Facebook account (multiple `feeds`
   entries in the API response). Flatten all `platform === 'facebook'` posts from
   every account into one list, filter (video / stale), sort by `createdAt`
   descending, then slice to `MAX_CARDS`:
   ```js
   function fetchDoctorPosts(slug) {
       const url = API_BASE + '/api/MicrositeSocialFeed/' +
           encodeURIComponent(slug) + '?limit=' + POSTS_PER_ACCOUNT;

       return fetchJson(url).then(function (data) {
           if (!data || data.success === false || !Array.isArray(data.feeds)) return [];

           const entries = [];
           data.feeds.forEach(function (feed) {
               if (!feed || feed.platform !== 'facebook' || !Array.isArray(feed.posts)) return;
               feed.posts.forEach(function (post) {
                   if (!post || !post.permalink) return;
                   if (isVideoPermalink(post.permalink)) return;
                   if (!isRecent(post.createdAt)) return;
                   if (!hasDigiDrTag(post.message)) return;
                   entries.push({
                       accountName: (feed.accountName || '').trim(),
                       permalink: post.permalink,
                       createdAt: post.createdAt || ''
                   });
               });
           });

           entries.sort(function (a, b) {
               return new Date(b.createdAt) - new Date(a.createdAt);
           });
           return entries.slice(0, MAX_CARDS);
       }).catch(function () {
           return []; // API/network failure -> empty state, not a crash
       });
   }
   ```

6. **Never clone or re-parent a rendered embed.**
   Once `FB.XFBML.parse()` builds an iframe for a `.fb-post` div, cloning that node
   renders blank, and re-parenting it reloads/breaks the iframe. So: build the full
   card DOM once, append it, and never touch it again. Any carousel paging must
   operate on the *container* (e.g. `scrollLeft`/transform), never on the individual
   cards:
   ```js
   // Posts Carousel — manual, button-driven paging.
   // Cards hold live Facebook embeds, which must never be cloned (a cloned embed
   // renders blank) nor re-parented (that reloads the iframe). So the DOM is built
   // once and left alone: paging only changes the container's scrollLeft, which
   // the browser handles natively without touching any card.
   ```

7. **Lazy-load the Facebook SDK, once, only when needed.**
   The SDK script (`connect.facebook.net/.../sdk.js`) is only injected when the
   carousel is about to be used, and only once (`fbSdkPromise` memoized). Loading is
   deferred until the carousel nears the viewport via `IntersectionObserver`
   (`rootMargin: '400px 0px'`), so it doesn't cost anything on pages/users who never
   scroll to it. The paint watchdog (`watchCards()`) starts with the SDK, not when
   the cards are built — otherwise its deadline would expire before a slow scroller
   ever reaches the section and every card would turn into a fallback link. Only the
   SDK is lazy: the small feed request runs at page load (rule 11).

8. **Pin the Graph API version explicitly, and don't let it go stale.**
   ```js
   window.FB.init({ xfbml: false, version: FB_GRAPH_VERSION }); // e.g. 'v23.0'
   ```
   Deprecated Graph API versions don't fail loudly — the SDK still builds iframes,
   but Facebook redirects the request to a login page, so every embed silently
   renders blank. If embeds go blank with no console error, check this version first.
   `xfbml: false` at init time is intentional: parsing is triggered manually later
   (`FB.XFBML.parse(carousel)`) after the cards exist in the DOM, not automatically
   on page load.

9. **Build each embed with a real `<div class="fb-post">`, not an iframe src.**
   The Facebook plugin URL responds with `X-Frame-Options: DENY`, so it can never be
   used as a direct iframe `src`. The only supported path is the SDK's XFBML div
   (`data-href`, `data-width`, `data-show-text`), parsed by `FB.XFBML.parse()`.

10. **Always render a non-JS fallback link inside the embed div.**
    A `<blockquote class="fb-xfbml-parse-ignore">` with a plain link to the post is
    nested inside the `.fb-post` div. If the SDK fails to load or is blocked (ad
    blockers, cookie restrictions), the fallback link is what's left visible instead
    of an empty box.

11. **Show the section only when there are posts; otherwise hide it entirely.**
    - The feed is fetched **at page load** (not when the section scrolls into view),
      so the show/hide decision is normally made before the visitor gets there and
      the section never collapses under them mid-read.
    - `fetchJson` retries a failed request once after a short delay (network blips
      are common on mobile).
    - Wait up to **`FEED_TIMEOUT_MS = 7000`** (7 s) for an answer, showing the
      skeleton cards meanwhile.
    - **Hide the whole section** (`hideSection()`: `hidden` + inline
      `display: none`, since templates may set `display` on `<section>`) when: the
      slug is unset, no Facebook feed is connected, the feed has zero qualifying
      posts after filtering (all videos / older than `MAX_POST_AGE_DAYS` / not
      tagged #DigiDr), the API fails, or there is no answer within 7 s.
    - The decision is **final**: a reply that arrives after the 7 s timeout is
      ignored and the section stays hidden (no late pop-in / layout shift).
    - There is no "Posts are taking a moment to load…" empty-state message any more
      — a doctor without posts simply has no social section.

12. **Read the embed width from CSS, not a hardcoded constant.**
    ```js
    const raw = getComputedStyle(carousel).getPropertyValue('--post-card-width');
    ```
    So the pixel width the SDK needs (`data-width`) always matches the actual card
    size defined in CSS, with a sane fallback (`300`) if the custom property is
    missing.

13. **Manual carousel paging moves by whole visible "pages", not one card.**
    Step size = (card width + gap) × number of fully-visible cards, so a click never
    leaves a card half-cut-off at the edge:
    ```js
    function stepSize() {
        const card = items[0];
        const gap = parseFloat(getComputedStyle(carousel).columnGap) || 0;
        const span = card.offsetWidth + gap;
        const perPage = Math.max(1, Math.floor(carousel.clientWidth / span));
        return span * perPage;
    }
    ```

14. **Card look is fixed — identical on every microsite.**
    The section header (kicker, `h2`, subtitle), the prev/next buttons and the
    section band colour follow each microsite's own palette, but the **cards
    themselves are identical everywhere**. Never remap these values to the local
    theme:

    | Property | Value |
    |---|---|
    | Card size (desktop, >1100px) | `--post-card-width: 300px; --post-card-height: 400px` |
    | Card size (tablet, 641–1100px) | `300px × 400px` |
    | Card size (mobile, ≤640px) | `280px × 375px` (Facebook's embed floor is ~250px) |
    | Gap between cards | `30px` |
    | Corner radius | `24px` |
    | Surface | `#ffffff` |
    | Border | `1px solid hsl(155, 18%, 85%)` |
    | Shadow | `0 4px 18px hsla(168, 40%, 18%, 0.10)` |
    | Overflow | `hidden` on the card **and** on `.fb-post` — the post is **clipped, never scrolled** |
    | Bottom fade | `44px` linear-gradient, transparent → `#ffffff` (skipped on fallback cards) |

    The card height is deliberately fixed (`height: var(--post-card-height)
    !important`), overriding the global auto-height rule: Facebook sizes its iframe to
    the post's content (one long post measured ~3700px), so an auto-height card would
    stretch the whole row. Do **not** add an inner scrollbar (it traps swipes on
    mobile inside a horizontal carousel) and do **not** add a "View on Facebook"
    button over the card.

15. **Skeleton loading — never a blank card or an empty band.**
    Loading is shown in two phases, both using the same skeleton that mirrors a
    Facebook post (round 44px avatar + two name lines, a large image block, two text
    lines), shimmering between `hsl(150, 24%, 94%)` and `hsl(150, 25%, 99%)`:

    1. **Before the API responds:** `showSkeletons()` fills the track with 3
       placeholder cards (`.social-post-card.is-placeholder`) and sets
       `aria-busy="true"` on the track. It runs at init, together with the feed
       request, and stays up for at most 7 s (rule 11) before the section either
       shows its posts or is hidden.
    2. **After the cards are built, until Facebook paints:** each real card gets the
       same skeleton (`buildSkeleton()`) as an absolutely positioned layer *behind*
       the `.fb-post` (`z-index: 0`). It is hidden with
       `.social-post-card.is-loaded .social-post-skeleton { display: none; }` when
       the card settles — the card DOM is still built once and never cloned or
       re-parented (rule 6).

    `renderPosts()` clears the placeholders (`track.innerHTML = ""`) immediately
    before inserting the real cards and removes `aria-busy`. Skeletons are
    `aria-hidden="true"`, and the shimmer animation is disabled under
    `prefers-reduced-motion: reduce`.

16. **Integrating into a microsite whose CSS has a global reset — gotchas.**
    - The DigiDr global reset sets `div { max-width: 100% }`. The track uses
      `width: max-content; min-width: 100%; justify-content: safe center` (centred
      while the posts fit, left-aligned once they overflow — never plain `center`,
      see rule 17), so it **must** also set `max-width: none` — otherwise the track
      is capped at the carousel width and centring pushes the first cards off the
      left edge, where they can never be scrolled to.
    - A stylesheet you start from may still carry CSS for an old mock social section
      (`.social-post-card` hover lift, flex layout,
      `.social-media-carousel { overflow: hidden }`) and `index.js` an old "Social Media
      Carousel" JS IIFE. Append the widget CSS at the **end** of `style.css`, scope
      card rules under `.social-media-section`, and reset
      `transform`/`transition`/hover. The old IIFE is harmless (it exits when the
      track has no cards at load).
    - Give the prev/next buttons their own class (`.social-carousel-btn`) instead of
      reusing a generic `.carousel-btn` (any left over from the removed testimonials
      carousel), whose rules differ per template.
    - Facebook embeds don't load from `file://` (unique origin) — test over
      `http(s)`.

17. **Alignment and prev/next visibility follow whether the cards fit.**
    (This is the mandatory §30 rule above, restated with its rationale.)
    - Posts fit the carousel → cards are **centred** and the prev/next buttons are
      **hidden**. Posts overflow → cards are **left-aligned** (first card next to the
      prev button) and the buttons are **shown**.
    - Alignment is pure CSS: `.social-media-track { justify-content: safe center; }`.
      `safe` makes the browser fall back to start alignment on overflow; plain
      `center` must not be used.
    - Visibility is JS, inside `syncButtons()` (runs after the SDK loads, on scroll
      and on resize):
      ```js
      const fits = carousel.scrollWidth <= carousel.clientWidth + 1;
      prevBtn.hidden = fits;
      nextBtn.hidden = fits;
      ```
      The `+ 1` absorbs sub-pixel rounding. Keep the existing `disabled` logic after
      it.
    - `.carousel-btn` sets `display: flex`, which defeats `[hidden]`, so the
      stylesheet must also contain:
      ```css
      .social-carousel-prev[hidden],
      .social-carousel-next[hidden] { display: none; }
      ```
    - Test with 2 posts (centred, no buttons) **and** 5+ posts (left-aligned, buttons
      visible), at desktop and ≤900px.

#### Order of operations (summary)

1. At page load: validate `DOCTOR_SLUG` (unset → hide the section, stop).
2. Show 3 skeleton placeholder cards (`aria-busy="true"`), start the 7 s timeout, and
   call the per-doctor API directly (`/api/MicrositeSocialFeed/{slug}`) — no list API
   involved.
3. Flatten posts across all of that doctor's Facebook accounts → drop videos → drop
   stale posts → sort newest-first → slice to `MAX_CARDS`.
4. Zero posts, API failure or the 7 s timeout → hide the section (final). Otherwise
   clear the placeholders and build DOM for each card (skeleton layer + embed div +
   fallback link), insert once.
5. `IntersectionObserver` sees the section near the viewport → start the paint
   watchdog → lazy-load Facebook SDK (memoized) → `FB.init` with a pinned version →
   `FB.XFBML.parse(container)`.
6. Init manual carousel paging (container-level scroll only, cards untouched).

#### Porting checklist

- [ ] Supply `DOCTOR_SLUG` from your config/route/page data — validate it's non-empty
      before calling the API.
- [ ] Set `MAX_CARDS`, `MAX_POST_AGE_DAYS` (183), `POSTS_PER_ACCOUNT` (50) for your
      case.
- [ ] Keep the #DigiDr hashtag filter (rule 4a) — posts without the tag must not
      render.
- [ ] Keep the video-permalink filter (or equivalent) if autoplay-without-control is
      unacceptable in your layout.
- [ ] Memoize SDK loading; gate it behind `IntersectionObserver` if the widget isn't
      always above the fold.
- [ ] Pin `FB_GRAPH_VERSION` and note it needs periodic bumping.
- [ ] Never clone/re-parent a card holding a parsed `.fb-post` embed.
- [ ] Always include the `fb-xfbml-parse-ignore` fallback link.
- [ ] Hide the whole section — never a blank or empty band — on missing slug, no
      connected feed, zero qualifying posts, API failure, or no answer within 7 s; a
      late reply must not bring it back (rule 11).
- [ ] Fetch the feed at page load; keep only the SDK behind `IntersectionObserver`.
- [ ] Slug read from `<body data-slug="{{slug}}">`, not hardcoded in the JS.
- [ ] Cards match the fixed rule 14 spec — 300×400 / 280×375, 24px
      radius, clipped with the 44px fade, no inner scroll.
- [ ] Skeleton loading in both phases (rule 15); test with a slow network.
- [ ] Track has `max-width: none` (rule 16); test with 5 posts, not just 2 — the
      clipping bug is invisible when the posts fit.
- [ ] Verify over `http(s)` at 1440px and 390px: cards render, Next pages the
      carousel, no horizontal page overflow.
- [ ] Track uses `justify-content: safe center`, buttons hide via `hidden` when the
      cards fit, and the `[hidden]` CSS rule is present (rule 17); test with 2 posts
      and with 5+.

---

## 31. Mobile Responsiveness (Mandatory, Applies to Everything)

Every microsite must be fully mobile-responsive. This covers every page (`index.html`,
`privacy-policy.html`, `terms-of-service.html`) and every element: header and mobile menu,
hero, every section, booking modal, consent panel, chatbot, and footer.

- Works from **320px to 1440px+** on phones, tablets, and desktops (breakpoints per §0).
- No horizontal scroll, no clipped or overlapping content, no unreadable text at any width.
- Tap targets are at least **44px** high and wide.
- Build mobile behaviour as you build each section, not as a final pass. Test every new
  section at 320, 375, 768, 1024, 1440, and 1900px before moving on.
- Stress-test with a very long doctor name (50+ characters), long qualification and specialty
  text, a long address, and a long email: nothing may overflow, and cards must grow.

---

## 32. Header Additions (Portrait & Clean URLs)

- **Circular portrait.** The header shows the doctor's professional portrait in a circular frame
  (`border-radius: 50%`, `object-fit: cover`), using a real image from `assets/` (never a
  placeholder). It reuses the header `.avatar` element (see §12 for the shared size).
- **No hash in the URL.** Navigating with header links must not leave `#home`, `#about`,
  `#gallery`, etc. in the address bar. In `script/index.js`, intercept nav-link clicks:
  `preventDefault()`, scroll smoothly with `scrollIntoView({ behavior: "smooth" })` to the target
  section, then `history.replaceState(null, "", location.pathname + location.search)` to strip the
  hash. Apply the same behaviour to the logo link, the mobile-menu links, and the footer
  quick links. Keep each link's `href="#section"` so it still works without JavaScript.
- **Short CTA label on phones.** The header "Book Appointment" button reads **"Appointment"** in
  phone view. Use two spans (full header markup: Appendix A.2):
  ```html
  <a href="#" class="cta-btn" id="openBookingBtn" data-ga-event="book_appointment_click" data-ga-label="Navbar">
    <span class="cta-text-desktop">Book Appointment</span>
    <span class="cta-text-mobile">Appointment</span>
  </a>
  ```
  ```css
  .cta-text-mobile { display: none; }
  @media (max-width: <the mobile-menu breakpoint from §3.2>) {
    .cta-text-desktop { display: none; }
    .cta-text-mobile { display: inline; }
  }
  ```
  Both spans need the explicit white text colour override from §26 (the global `span { color }`
  reset), and the button must still fit the header without wrapping or overflow at 320px.

---

## 33. Hero Content Rules

Keep the hero lean: no redundant text, extra taglines, or secondary descriptions. The design
elements specified in §4 (specialty badge, floating decorative icons, stat tiles, portrait
frame) stay as they are. Build this content:

**Profile details**: four separate lines, each with its own icon, in this order:

| # | Line | Notes |
|---|---|---|
| 1 | Qualification | graduation-cap icon |
| 2 | **Medical Regd. No.** | label is exactly "Medical Regd. No." (never "MCI") |
| 3 | Fellowship | optional, see the fellowship rule in §4; skip the line entirely if the doctor has none |
| 4 | Languages | language icon |

**Statistics cards**: exactly three, in this order:
1. **Practising Since**: the year only (e.g. `2009`)
2. **Languages**: a count
3. **Consultation Modes**: a count

All three animate as live counters as specified in §4.

**Social icons**: one row, in this order, with each icon linking to a real URL and carrying an
`aria-label`: Facebook Profile, Facebook Page, Instagram, X, LinkedIn, Website, WhatsApp,
YouTube. The row must have `flex-wrap: wrap` (see §22).

**Content cleanup**: no redundant text. Do not add extra taglines, secondary descriptions, or
duplicate paragraphs. The hero contains the doctor name (h1), the profile lines, the stats, the
social row, and the call-to-action buttons.

---

## 34. About "Read More" Styling

The Read More / Read Less toggle uses the code in §24 verbatim, with this styling rule: it is
a **subtle text link or secondary element** (transparent background, no fill, no pill, a
chevron icon), clearly distinct from the primary call-to-action button design. It must never
look like a primary button. Auto-hide behaviour stays as in §24.

---

## 35. Contact & Gallery Content Rules

**Contact section** (`#contact-us`, layout per §18.1) contains exactly:
- **Address**: the clinic's full address, shown in whatever form the doctor supplies it.
- **Contact details**: phone number (`tel:` link) and email address (`mailto:` link).
- **Action**: a "Book Appointment" button that opens the booking modal.

No WhatsApp number or other extra contact items in this section.

**Gallery section** (grid per §10): an **image grid only**. No captions, titles, or
descriptive text overlays on any item. Keep meaningful `alt` text on every image, use real
images (no placeholders), and keep the lightbox from §10. Free, copyright-free images need no
image credits anywhere on the page.

---

## 36. Footer Consistency & Compactness

- The footer follows §12 and uses the **Appendix A.11** markup and CSS exactly in layout and
  hierarchy (column structure, order, classes).
- **Identical on all three pages.** The footer on `index.html`, `privacy-policy.html`, and
  `terms-of-service.html` uses the same markup, content, links, and styling. The only allowed
  difference is link targets that must resolve to `index.html#…` on the legal pages.
- **Compact.** The padding, spacing and font sizes of §12, and only the rows and columns in
  Appendix A.11 (brand column with tagline and social icons; Quick Links, Legal and the visitor
  badge; copyright row; disclaimer). Do not add extra rows, large blocks, or tall padding. It stays
  compact on mobile too (stacked columns, tight spacing, no oversized gaps).
- No image credits line.

---

## 37. Booking Modal Additions (Info Tooltip, Consent Panel, Button Colours)

These additions sit on top of §11 and §25.

**Online Consultation info icon and tooltip.** Place an "i" info icon inside the Online
Consultation tab. Hovering or keyboard-focusing it shows a tooltip with this exact text (also
opens on tap for mobile):

> Online consultations are governed by the Telemedicine Practice Guidelines, 2020. They are not for emergencies, and the doctor may advise an in-person visit where an examination is needed.

Use the Appendix A.10 markup: `.booking-tab-info` inside the tab, a `.booking-tab-tip` element
with `role="tooltip"` and `hidden`, and `aria-describedby` on the tab.

**Patient Consent & Data Privacy panel.** Ticking the consent checkbox opens a
"Patient Consent & Data Privacy" panel inside the modal flow (`#consentModal`; markup and CSS in
Appendix A.10, JS in the booking-modal IIFE of Appendix A.18 (C)):
- The panel's dialog scrolls. The **I Agree** button starts **disabled**, with the hint
  "Please read the full notice to continue", and enables only once the patient has scrolled to the
  bottom (8px slack).
- Clicking **I Agree** closes the panel and returns to the booking form with the checkbox
  ticked. Closing the panel in any other way returns to the form with the checkbox unticked.
  Entered form data is preserved and the form is never reset.
- The panel contains the notice sections "How we protect your information", "Your rights",
  "Questions or Complaints" (Compliance Officer, DigiDr.app, `info@digidr.app`), the closing
  confirmation sentence, and links to the Privacy Policy and Terms. The full text is in the
  Appendix A.10 markup; copy it verbatim.

**Button colours.** The primary brand colour is reserved for primary actions only (for
example the Submit / Review button and I Agree). The tabs, upload button, close button, and
other secondary controls use neutral or outline styles (see §1.1 and §1.2).

**Removed text.** Do not include the demo line "Try the appointment form. This is a sample
clinic; your request stays in this browser and is not sent." anywhere.

The consent label wording stays exactly as defined in §11.

---

## 38. Chatbot Layout & Footer Note

The chatbot follows §13 with these additions:
- **Layout and size must be fully visible at every width** (1440, 768, and 375px). Nothing
  clipped: header, avatar, message bubbles, quick-reply chips (wrap or scroll cleanly), input, and
  send button. The panel stays inside the viewport (`max-height` with `overflow-y: auto` on the
  messages area).
- **Footer note.** The text at the bottom of the chat window is exactly two lines:

  > Informational only, not medical advice.
  > Consult your doctor.

  Build it with a line break: `Informational only, not medical advice.<br>Consult your doctor.`
- Replies are on-topic for the doctor's specialty, never give medical advice, and point visitors
  to booking or "consult your doctor". No other doctor's or specialty's wording.

---

## 39. Care Philosophy, Consultation Journey & FAQ: Static Sections and Default Designs

**Section order.** This extends §21. The home page order is Header → Hero → About → Services → Social Media widget (optional, §30) →
Care Philosophy → Consultation Journey → Contact → Practice Gallery → **FAQ** → Booking Modal →
Footer. The FAQ section (`#faq`) comes straight after the Gallery and gets a nav link.

**Static sections with their own design.** Care Philosophy, Consultation Journey, and any
other section can have a design of its own (layout, imagery, wording). Such a design is static,
fixed content: it does not have to match the default designs below. It must still be present, in the correct order,
responsive (§31), accessible, readable (AA contrast, 18px body text), consistent with the
specialty, and free of overflow and leftover wording from another specialty.

**Default designs (use these when no new design is made).** Copy the reference design in
Appendix A.5 (Care Philosophy), A.6 (Consultation Journey) and A.9 (FAQ) and change only the
wording for the specialty. Layout, classes, icons, element order, and counts stay.
Kickers stay generic (no doctor names or "20+ years" claims).

- **Care Philosophy**: `section.philosophy-section#philosophy`. Split-screen layout inside
  `.container.philosophy-layout`.
  - Left (`.philosophy-visual`): a framed photo (`.philosophy-img-frame`, lazy-loaded,
    descriptive alt text) with a small badge on it (`.philosophy-badge`: round icon, bold line,
    short second line).
  - Right (`.philosophy-content`): a kicker with an icon and the text "Care Philosophy", an h2
    title, a one-line subtitle, and **three** pillars (`.philosophy-pillar`). Each pillar has a
    round icon with a small index number (01, 02, 03), an h3 heading, and a one-sentence
    description.
- **Consultation Journey**: `section.process-section#process`. A decorative background layer
  (`.process-bg`, `aria-hidden`), then a centred header with a kicker (route icon and the text
  "Consultation Journey"), an h2 ("What to Expect"), and a one-line subtitle. Below it, a
  vertical alternating (zig-zag) timeline of exactly **four** steps (`.process-step`). Each step
  has a round marker with an icon and a card with a large step number (01–04), an h3 heading,
  and a one-sentence description. The steps are: 1) Appointment Booking, 2) a diagnostic or
  evaluation step, 3) a personalised treatment plan, 4) recovery and follow-up.
- **FAQ**: `section.faq-section#faq`. A header with an h2 ("Frequently Asked Questions") and a
  one-line subtitle, then an accordion (`.faq-list`) of at least **five** questions
  (`.faq-item`). Each item has a button (`.faq-question`: question text plus a chevron icon,
  `aria-expanded` set) and a collapsible answer (`.faq-answer` > `.faq-answer-inner` > `p`). The
  first item is open by default (`is-active`). Opening an item closes the others and rotates the
  chevron, and it works with Enter/Space. Use the shared "FAQ accordion" block in Appendix A.13
  unchanged. Write questions and answers specific to the doctor's specialty (conditions treated,
  referral, what to bring, online vs clinic visit); never leave another specialty's wording.

---

## 40. Analytics: Google Analytics (GA4) + Microsoft Clarity Events

Clarity follows §27. GA4 is added on top of it.

**Setup (every page: `index.html`, `privacy-policy.html`, `terms-of-service.html`):**
- Add the GA4 `gtag.js` snippet in `<head>` once per page, with the microsite's own Measurement
  ID. Never leave `G-XXXXXXXXXX` in a finished microsite.
- Add `script/analytics.js` (Appendix A.14, verbatim) and load it
  **before** `script/index.js`. It defines `window.trackEvent(name, params)`, which sends
  `gtag("event", …)` with `page_path` and also `clarity("event", name)`, each guarded with
  `typeof … === "function"` so an ad-blocker never causes errors. It also installs a delegated
  click listener for `data-ga-event` (label from `data-ga-label`, else `aria-label`, else the first
  60 characters of the text).
- Load GA4 and Clarity exactly once per page.

**Declarative events**: add these `data-ga-event` attributes in `index.html` (give every element
a `data-ga-label` where several elements share an event):

| Element | `data-ga-event` |
|---|---|
| Header nav links (About, Services, Contact, Gallery, FAQ) | `nav_link_click` |
| Header "Book Appointment" CTA, and every other Book CTA | `book_appointment_click` |
| Hero social icons | `hero_social_link_click` |
| About Read More button | `read_more_click` |
| Contact phone link | `phone_number_click` |
| Contact email link | `email_click` |
| Booking tab: Clinic Visit | `clinic_visit_tab_click` |
| Booking tab: Online Consultation | `online_consult_tab_click` |
| Report upload button | `upload_report_click` |
| Footer link columns | `footer_nav_link_click` |
| Footer social icons | `footer_social_link_click` |

**Programmatic events**: fired from `script/index.js` through `window.trackEvent?.()`
(consent events use a small `trackConsentEvent` helper that sends the same GA4 + Clarity pair):

| Event | Fires when | Params |
|---|---|---|
| `consent_checkbox_click` | the consent checkbox is toggled | `checked` |
| `consent_modal_open` | the consent panel opens | none |
| `consent_scrolled_to_bottom` | the patient reaches the bottom of the notice (once) | none |
| `consent_agreed` / `consent_dismissed` | the panel closes via I Agree / any other way | `method` (`agree_button`, `close_button`, `backdrop`, `escape_key`), `scrolled_to_bottom` |
| `report_uploaded` | a valid report file is chosen | none |
| `booking_submitted` | the booking form is submitted successfully | `appointment_type` |

**Rules:** one event per action (no double-firing); disabled social icons (no link) never fire an
event or navigate; no event may carry patient-entered data (name, phone, email, symptoms, file
names); the legal pages load analytics too and must not throw.

---

## 41. Privacy Policy & Terms of Service (Exact Text)

Both legal pages use the exact text below, with only these changes: replace
`[Doctor/Clinic Name]` with the doctor's name, fill in the contact card (email, phone, address),
and in Privacy Policy section 1 replace `[Qualifications]`, `[Registration No.]` and `[Council]`
with this doctor's own details (e.g. "MBBS, MD, Registration No. 12345, Karnataka Medical
Council"). The effective date stays `[Insert Date]` unless told otherwise.

Page structure (both pages): a visible **"Back to Home" link** at the top of the article (arrow
icon, links to `index.html`, class `blog-detail-back-link`), the small label "Legal Information",
the h1 title, a lead sentence, the effective-date line, then the body. Headings are h2 and lists
use the `legal-list` class. The contact section uses a `legal-contact-card`. Both pages use the
shared footer (§36) and carry the Clarity and GA4 snippets (§27, §40). Page markup and
`styles/legal.css`: Appendix A.12.

### 41.1 Privacy Policy text

**Title (h1):** Privacy Policy

**Lead:** We respect patient privacy and handle personal information with care, transparency, and
appropriate safeguards.

**Effective Date:** [Insert Date]

This Privacy Policy explains how personal information is collected, used, stored, and protected when
you use this website and its consultation and appointment services.

**1) Who We Are**

This is the personal microsite of **[Doctor/Clinic Name]**, [Qualifications], Registration No.
[Registration No.], [Council]. It is hosted on technology provided by DigiDr (digidr.app).

[Doctor/Clinic Name] decides why and how your details are used for your consultation and is the Data
Fiduciary under the Digital Personal Data Protection Act, 2023 ("DPDP Act"). DigiDr provides the
technology and handles your details only on the doctor's instructions. DigiDr is not a healthcare
provider.

**2) Information We Collect**

We may collect the following categories of information:
- Contact details (name, email, phone number)
- Appointment details (preferred date and time, reason for visit)
- Documents you upload through forms (for example, reports and prescriptions)
- Website usage data (browser type, pages viewed, device and basic analytics)

Please share only what is needed for your visit. Do not upload government ID numbers or payment card
details through the forms.

**3) How We Use Your Information, and Your Consent**

Your information is used to:
- Schedule and manage appointments
- Respond to inquiries and provide support
- Send messages about your appointment
- Improve the website using anonymous, combined usage data
- Meet legal, medical, and regulatory obligations

When you submit a booking or inquiry form, you consent to your details being used to arrange and
provide your consultation. You can withdraw your consent at any time by writing to us. Withdrawal
does not affect use made before you withdrew, and we may keep records that the law requires. We send
no promotional messages without your separate consent. Your submitted health details are never used
to improve the website.

**4) Medical Privacy**

We treat all health-related information with strict confidentiality. Any data shared through this
website is handled with appropriate safeguards and is accessed only by authorised personnel as
needed for care, administration, or legal compliance. DigiDr personnel can access it only where
needed to run, secure, or support the service.

**5) AI-Assisted Content**

Where health education on this site is drafted with AI, it is reviewed and approved by
[Doctor/Clinic Name] before publication and labelled as AI-assisted. Details you submit in forms or
documents are not used to create public content.

**6) Sharing of Information**

We do not sell personal data and we do not use it for advertising. We may share information only when
necessary with:
- Authorised staff and healthcare professionals involved in your care
- Service providers, including DigiDr as the technology provider, and hosting, appointment,
  or communication tools
- Government or legal authorities when required by law

Where a service provider stores data outside India, this is done in line with the DPDP Act.

**7) Data Retention**

We retain personal information only for as long as required to provide services, maintain records,
and comply with applicable laws and medical record policies. When data is no longer needed and no law
requires us to keep it, it is deleted or made anonymous.

**8) Data Security**

We use reasonable technical and organisational measures to protect personal information. However, no
website or transmission method is completely secure, and absolute security cannot be guaranteed. If a
personal data breach affects you, we will inform you and the Data Protection Board of India as the
law requires.

**9) Cookies and Analytics**

This website may use cookies or analytics tools to understand usage patterns and improve
functionality. You can change your browser settings to control cookie preferences.

**10) Your Rights**

Under the DPDP Act, you have the right to:
- Get a summary of the personal data we hold about you
- Correct or update your data
- Ask for your data to be erased
- Withdraw your consent
- Have your grievance addressed
- Nominate another person to exercise your rights if you die or cannot act

To use any of these rights, write to [Doctor/Clinic Name] using the details below, or to DigiDr at
info@digidr.app (mailto link). If your grievance is not resolved, you may complain to the Data
Protection Board of India.

**11) Children**

If the patient is under 18, the booking must be made by a parent or lawful guardian, who gives
consent for the child. We do not track or target children with advertising.

**12) Third-Party Links**

Our site may contain links to third-party platforms. We are not responsible for the privacy practices
of external sites and recommend reviewing their policies separately.

**13) Updates to This Policy**

We may update this Privacy Policy periodically. The latest version will always be posted on this page
with the effective date. For changes that affect how your details are used, we will tell you where we
hold your contact details.

**14) Contact Us**

Contact card:
- [Doctor/Clinic Name] (bold)
- Email: [Insert Email]
- Phone: [Insert Phone Number]
- Address: [Insert Clinic Address]

To report an error or a concern about this site, or to raise a privacy grievance with DigiDr, write to
info@digidr.app (mailto link).

### 41.2 Terms of Service text

**Title (h1):** Terms of Service

**Lead:** These terms describe how visitors may use this website and clarify medical-service
limitations.

**Effective Date:** [Insert Date]

These Terms of Service ("Terms") govern your use of the website and services provided by
**[Doctor/Clinic Name]** ("we", "our", "us"). By using this website, you agree to these Terms.

**1) Website Purpose**

This website is intended to provide general information about medical services, clinic details,
educational content, and appointment request options.

**2) No Emergency Service**

This website is not an emergency platform. If you are facing a medical emergency, call local
emergency services or visit the nearest emergency facility immediately.

**3) Medical Disclaimer**

Content on this website is for informational purposes only and does not replace professional medical
advice, diagnosis, or treatment. Always consult a qualified healthcare professional for personal
medical concerns.

**4) Appointment Requests**

Appointment forms and contact requests do not guarantee confirmed appointments. Confirmation is
subject to availability and direct communication from the clinic.

**5) User Responsibilities**

When using this site, you agree to:
- Provide accurate and complete information
- Not submit false, misleading, or harmful content
- Not attempt unauthorised access, data extraction, or misuse of website systems
- Use the website only for lawful purposes

**6) Intellectual Property**

Unless stated otherwise, all website content (text, graphics, branding, and layout) belongs to
[Doctor/Clinic Name] and is protected by applicable intellectual property laws. Reproduction or
commercial use requires prior written permission.

**7) Third-Party Tools and Links**

This website may use third-party services (for example, analytics, communication tools, maps, or
social platforms) and may contain external links. We are not responsible for third-party content,
terms, or privacy practices.

**8) Limitation of Liability**

To the extent permitted by law, [Doctor/Clinic Name] is not liable for any direct, indirect,
incidental, or consequential losses arising from use of this website, reliance on its content, or
inability to access services.

**9) Privacy**

Your use of this site is also governed by our Privacy Policy. Please review it to understand how
personal information is collected and handled.

**10) Changes to Terms**

We may revise these Terms from time to time. Updated terms will be posted on this page with a new
effective date. Continued use of the website means acceptance of the revised Terms.

**11) Governing Law**

These Terms are governed by the laws applicable in the jurisdiction where the clinic operates, unless
otherwise required by local regulations.

**12) Contact Details**

Contact card:
- [Doctor/Clinic Name] (bold)
- Email: [Insert Email]
- Phone: [Insert Phone Number]
- Address: [Insert Clinic Address]

---

## 42. Content Accuracy, Specialty Fit & Template Hygiene

- All copy (services, FAQs, journey steps, chatbot replies, alt text, meta tags) matches the
  doctor's specialty. Keep the doctor's name, gender and pronouns ("Dr." and the correct
  he/she), qualification, registration number, and clinic details consistent across the hero,
  about, footer, legal pages, booking consent label, chatbot, and meta tags.
- No medical claims such as guaranteed cures, and no unverifiable "20+ years" claims outside the
  h1, paragraphs, list items, and footer. Sub-headings, badges, and kickers stay generic.
- **No "trust" wording (mandatory, every page, no exceptions).** Never use *trust*, *trusted*,
  *trusting*, *trustworthy*, *entrust*, *reliable*, *reliability*, *dependable*, *rely on* or
  *count on* (any casing or form) anywhere in a microsite's visible or indexed text: headings,
  kickers, badges, body copy, services, FAQ, journey steps, CTAs, alt text, `<title>`, meta and
  Open Graph descriptions, JSON-LD, `llms.txt`, the chatbot welcome text, and the legal pages.
  Phrases like "care you can trust", "a trusted name", "reliable diagnosis" or "a doctor you can
  count on" are the typical offenders: say what the doctor does instead (e.g. "Expert
  orthopaedic care, clinic visits and online consultations"). Code comments and class names are
  not page text and are exempt. Check with
  `grep -inE "trust|reliab|dependab|rely on|count on" *.html llms.txt` before finishing.
- When building from an existing microsite, remove all of its leftover wording: its doctor
  name(s) and specialty terms, plus "Lorem", "TODO", "example.com" and every unreplaced `[…]`
  placeholder from Appendix A (the legal-page `[Insert …]` fields excepted until the doctor
  supplies them). Every nav link target id must exist.
- No blog pages, links, or files (blog was removed project-wide).
- Accessibility: every image has alt text (decorative ones `alt=""`), every icon-only
  link/button has an `aria-label`, form fields have labels, the booking and consent modals have
  `role="dialog"` and `aria-modal`, and the page is fully keyboard navigable. External links use
  `rel="noopener noreferrer"` and `target="_blank"`; internal links are relative.
- No console errors, no 404s, no mixed content.
- If the microsite is a new specialty, add it to the §20 table in the same change.

---

## 43. Post-Build Verification

After building or editing a microsite, run the audit in [verification.md](verification.md). It
turns the rules in this file into a PASS/FAIL checklist: header, hero, about,
contact, gallery, footer, booking modal, chatbot, legal pages, global CSS, structure,
responsiveness, booking logic, analytics events, and SEO/accessibility. Fix every FAIL before
calling the microsite done. It is written for microsites **before** parameterization.

---

## 44. Visitor Counter — Live Backend (Mandatory, All Pages)

The footer "No. of Visitor" badge must show the real count from the DigiDr API — never the
localStorage placeholder, never a hard-coded number (e.g. "500"). Put this inline script before
`</body>` on **`index.html`, `privacy-policy.html` and `terms-of-service.html`** (every page whose
footer has the badge), verbatim:

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
- `<body data-micrositeid="…">`: `{{micrositeId}}` on parameterized sites; on non-parameterized
  copies use the folder name (`microsite-<specialty>-<n>`) — it must be an ID the backend knows.
- The count element carries `id="visitorCount"` (initial text `0`), inside
  `.footer-visitor-badge`:
  `<strong|span class="footer-visitor-badge-count" id="visitorCount">0</strong>`.
- Badge markup is static in the HTML, and `style.css` must contain the `.footer-visitor-badge`
  rules (markup and CSS in Appendix A.11). New sites have no other visitor-count code. If an
  older `script/index.js` still has the localStorage visitor placeholder, it must return early
  when `.footer-visitor-badge` exists, or it injects its own styles and overwrites the real count.
- Legal pages need the script too — a badge without it stays at 0.

---

## 45. Icon Visibility (Mandatory, Every Page)

Every icon must actually render and be clearly visible on its background, at every width
(320–1440px+). Check this on every new or edited microsite, on all three pages. It covers:
header (avatar, hamburger), hero (credential/registration/fellowship/language icons, stat-tile
icons, social icons, floating decorative icons), Services, Philosophy pillars and badge, Journey
step circles, Contact items, FAQ chevrons, the Facebook carousel prev/next buttons, gallery
lightbox controls, the booking modal (close ×, info "i", calendar arrows, date and select
icons, upload/preview icons), the consent panel, the footer social icons and visitor badge, the
legal-page Back arrow, and the chatbot (FAB logo, avatar, close ×, send icon).

- **The glyph must load.** Font Awesome 6.7.2 (`all.min.css`, §A.1) is linked on every page, and
  every class is a real FA 6 icon in the right family (`fa-brands` for social networks,
  `fa-solid` for the rest). A wrong or missing class renders as an empty box or nothing; there
  is no console error, so check by eye and with `getComputedStyle(i, '::before').content`
  (must not be `"none"`/empty).
- **Contrast.** Icon colour vs its own background must meet **3:1** (WCAG 1.4.11, non-text
  contrast); icons that carry meaning on their own (social, close, send, info) should aim for
  4.5:1. Watch white icons on light tints, brand-coloured icons on brand-coloured circles, and
  icons on dark bands (Journey, footer).
- **The colour reset gotcha (§26).** The global reset colours `span`/`a`/`p` with `var(--text)`.
  An `<i>` inside a coloured circle, button or link can inherit dark text colour and vanish on a
  dark fill. Set the icon colour explicitly on the icon (`.contact-item-icon i { color: #fff; }`),
  as Appendix A does, and verify with `getComputedStyle(icon).color`.
- **Not hidden, clipped or squashed.** No `opacity: 0`, `visibility: hidden` or `display: none`
  left on a visible state; not cut off by `overflow: hidden` parents; not shrunk to 0 by flex
  (`flex-shrink: 0` on icon boxes). Icon boxes keep their §-specified sizes (e.g. 46px hero
  social, 36px footer social, 52px contact).
- **Disabled social icons** (param sites) are dimmed but still visible (glyph opacity ~0.4, not
  0), and their "Not Enabled" tooltip is readable.
- **Hover and focus states** keep the icon visible (an icon that turns the same colour as its
  hover background is a FAIL).
- **SVG icons** (chatbot send icon, decorative SVGs) use `currentColor` or a colour that
  contrasts with their button; the chatbot send icon needs the §A.16 `stroke: currentColor` fix
  on a white button.
- Decorative icons carry `aria-hidden="true"`; icon-only buttons/links carry an `aria-label`.

---

## Appendix A. Reference Code (Copy-Paste)

Everything a new microsite needs that the numbered sections above describe but don't spell out
in full: page markup, component CSS, shared JavaScript and the shared module files. With this
appendix and §24, §25 and §44, a microsite can be built without opening any other microsite or
document.

How to use it:
- **Markup** uses bracketed placeholders: `[Doctor Name]`, `[Specialty]`, `[Qualifications]`,
  `[Registration No.]`, `[Languages]`, `[Clinic Name]`, `[Address]`, `[Phone]`, `[Email]`,
  `[specialty-icon]` (the §20 table's Services icon), `<tag-slug>` (the §20 tag slug), and so on.
  Replace every one; §42 and verification.md check that none are left. Doctor-specific wording in
  the default sections (Philosophy, Journey, FAQ) is written as `[…]` prompts: write real,
  specialty-specific copy there.
- **CSS** uses only the §1 token names (`--brand`, `--brand-dark`, `--brand-2`, `--accent`,
  `--accent-rgb`, `--bg`, `--bg-2`, `--bg-3`, `--surface`, `--border`, `--text`, `--muted`, the
  radius and shadow scales, `--overlay-backdrop` from §16). Set those tokens per site and the blocks
  pick up the palette. A site may restyle a component (the design may vary, see the top of this
  file), but must keep the class names, ids and `data-*` hooks, because the JavaScript reads them.
- **JavaScript** goes into `script/index.js` in this order: the booking helpers and the phone/date
  picker (A.18 (A) and (B)), the A.13 page blocks, the gallery lightbox (A.8),
  the booking-modal IIFE (A.18 (C), which also runs the consent panel and the
  Online Consultation tooltip), the Read More toggle (§24), the FAQ accordion (A.13), the contact
  cleanup (A.13), the booking-success event hook (A.13), the Facebook posts carousel (A.4), and the hero year/fellowship script (A.13).
  `index.js` declares `const API_BASE` once at the top (part of A.18 (A)).

---

### A.1 Page shell (`index.html`)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Microsoft Clarity (§27) -->
  <script type="text/javascript">
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "ymqvcvdc4v");
  </script>
  <script>
    if (typeof clarity === "function") {
      clarity('set', 'microsite', '{{slug}}');
      clarity('set', 'specialty', '<tag-slug>');
    }
  </script>

  <!-- Google tag (gtag.js) (§40) — replace G-XXXXXXXXXX with this microsite's GA4 Measurement ID -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
  </script>

  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Dr. [Doctor Name] | [Specialty] — [Short practice description]</title>
  <meta name="description" content="[One or two sentences: the doctor, the specialty and the main services.]" />
  <link rel="icon" type="image/svg+xml" href="[favicon: an SVG data URI or assets/favicon.svg]" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="https://digidr.app/{{slug}}/" />

  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Dr. [Doctor Name] | [Specialty]" />
  <meta property="og:description" content="Dr. [Doctor Name], [Specialty]." />
  <meta property="og:image" content="assets/[doctor-photo].jpg" />
  <meta property="og:image:type" content="image/jpeg" />
  <meta property="og:image:alt" content="Dr. [Doctor Name], [Specialty]" />
  <meta property="og:locale" content="en_US" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Dr. [Doctor Name] | [Specialty]" />
  <meta name="twitter:description" content="Dr. [Doctor Name], [Specialty]." />
  <meta name="twitter:image" content="assets/[doctor-photo].jpg" />

  <!-- Fonts (§1, §17 item 6) -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
    integrity="sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg=="
    crossorigin="anonymous" referrerpolicy="no-referrer" />

  <!-- Library CSS before site CSS so site overrides win (§25) -->
  <link rel="stylesheet" href="./styles/banner-module.css" />
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/intl-tel-input@29.2.2/dist/css/intlTelInput.css" />
  <link rel="stylesheet" href="./styles/style.css" />
  <link rel="stylesheet" href="./styles/chatbot.css" id="chatbot-css" />

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Physician",
    "name": "Dr. [Doctor Name]",
    "medicalSpecialty": "[schema.org MedicalSpecialty, e.g. Dermatologic]",
    "image": "https://digidr.app/{{slug}}/assets/[doctor-photo].jpg",
    "url": "https://digidr.app/{{slug}}/",
    "telephone": "+91-[Phone]",
    "email": "[Email]",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "[Street address]",
      "addressLocality": "[City]",
      "addressRegion": "[State]",
      "postalCode": "[Pincode]",
      "addressCountry": "IN"
    }
  }
  </script>
</head>
<body data-micrositeid="microsite-<specialty>-<n>" data-slug="{{slug}}">

  <!-- Header (A.2) · Hero (A.3) · About (§5, §24) · Services (§6, §23) · Social Media (A.4)
       · Care Philosophy (A.5) · Consultation Journey (A.6) · Contact (A.7) · Gallery + lightbox (A.8)
       · FAQ (A.9) · Booking + consent modals (A.10) · Footer (A.11) -->

  <script src="./script/banner-module.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/intl-tel-input@29.2.2/dist/js/intlTelInput.min.js"></script>
  <script src="./script/analytics.js"></script>
  <script src="./script/index.js"></script>
  <script src="./script/chatbot.js" defer></script>
  <!-- Visitor counter: the §44 inline script, verbatim, goes here, last -->
</body>
</html>
```

`data-micrositeid` is the folder name on a non-parameterized site (§44). The legal pages use the
same `<head>` with their own `<title>`/description, `<meta name="robots" content="noindex, follow" />`,
a canonical of `https://digidr.app/{{slug}}/privacy-policy.html` (or `terms-of-service.html`), no
JSON-LD and no banner/intl-tel-input files, plus `./styles/legal.css` after `style.css` (A.12).

### A.2 Header

```html
<header class="site-header">
  <div class="container navbar">
    <a href="#home" class="brand" aria-label="Dr. [Doctor Name]">
      <span class="avatar">
        <img src="assets/[doctor-photo].jpg" alt="Dr. [Doctor Name]" />
      </span>
      <span class="brand-text">
        <span class="brand-name" title="Dr. [Doctor Name]">Dr. [Doctor Name]</span>
        <span class="brand-role">[Specialty]</span>
      </span>
    </a>

    <nav class="nav-links" id="mainNav" aria-label="Main Navigation">
      <a href="#about" data-ga-event="nav_link_click" data-ga-label="About">About</a>
      <a href="#services" data-ga-event="nav_link_click" data-ga-label="Services">Services</a>
      <a href="#contact-us" data-ga-event="nav_link_click" data-ga-label="Contact">Contact</a>
      <a href="#gallery" data-ga-event="nav_link_click" data-ga-label="Gallery">Gallery</a>
      <a href="#faq" data-ga-event="nav_link_click" data-ga-label="FAQ">FAQ</a>
    </nav>

    <div class="nav-actions">
      <a href="#" class="cta-btn" id="openBookingBtn" data-ga-event="book_appointment_click" data-ga-label="Navbar">
        <span class="cta-text-desktop">Book Appointment</span>
        <span class="cta-text-mobile">Appointment</span>
      </a>
      <button class="menu-toggle" id="menuToggle" aria-label="Toggle navigation menu" aria-expanded="false" aria-controls="mainNav">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
</header>
```

Sizes and breakpoints: §3, §3.1, §3.2, §32. The mobile menu adds `.open` to `#mainNav` (A.13).
Every element with class `cta-btn` opens the booking modal.

### A.3 Hero content

```html
<section class="hero-section" id="home">
  <!-- Optional promotional banner module (§14, A.17) goes first, inside the section -->

  <div class="container hero-layout">
    <div class="hero-content">
      <h1 class="hero-title">Dr. [Doctor Name]</h1>
      <p class="hero-credentials"><i class="fa-solid fa-graduation-cap" aria-hidden="true"></i> [Qualifications]</p>
      <p class="hero-reg-id"><i class="fa-solid fa-id-card" aria-hidden="true"></i> Medical Regd. No.: [Registration No.]</p>
      <!-- Only if the doctor has fellowships (§4, §33); one plain text node, no inner <span> -->
      <p class="hero-credentials" data-hero-fellowship><i class="fa-solid fa-award" aria-hidden="true"></i> Fellowship: [Fellowship 1; Fellowship 2]</p>
      <p class="languages"><i class="fa-solid fa-language" aria-hidden="true"></i> <strong>Languages:</strong> [English &bull; Hindi]</p>

      <div class="hero-stats-grid">
        <article class="hero-stat-box">
          <i class="fa-solid fa-briefcase-medical" aria-hidden="true"></i>
          <strong class="stat-card-num" data-practising-since data-counter>[2012]</strong>
          <span>Practising since</span>
        </article>
        <article class="hero-stat-box">
          <i class="fa-solid fa-language" aria-hidden="true"></i>
          <strong class="stat-card-num" data-counter>[3]</strong>
          <span>Languages</span>
        </article>
        <article class="hero-stat-box">
          <i class="fa-solid fa-laptop-medical" aria-hidden="true"></i>
          <strong class="stat-card-num" data-counter>[2]</strong>
          <span>Consultation modes</span>
        </article>
      </div>

      <div class="social-links" aria-label="Social media links">
        <a href="[facebook-profile-url]" class="social" aria-label="Facebook Profile" target="_blank" rel="noopener noreferrer" data-ga-event="hero_social_link_click" data-ga-label="Facebook Profile"><i class="fa-brands fa-facebook"></i></a>
        <a href="[facebook-page-url]" class="social" aria-label="Facebook Page" target="_blank" rel="noopener noreferrer" data-ga-event="hero_social_link_click" data-ga-label="Facebook Page"><i class="fa-brands fa-facebook-f"></i></a>
        <a href="[instagram-url]" class="social" aria-label="Instagram" target="_blank" rel="noopener noreferrer" data-ga-event="hero_social_link_click" data-ga-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
        <a href="[x-url]" class="social" aria-label="X" target="_blank" rel="noopener noreferrer" data-ga-event="hero_social_link_click" data-ga-label="X"><i class="fa-brands fa-x-twitter"></i></a>
        <a href="[linkedin-url]" class="social" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer" data-ga-event="hero_social_link_click" data-ga-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>
        <a href="[website-url]" class="social" aria-label="Website" target="_blank" rel="noopener noreferrer" data-ga-event="hero_social_link_click" data-ga-label="Website"><i class="fa-solid fa-globe"></i></a>
        <a href="https://wa.me/91[whatsapp-number]" class="social" aria-label="WhatsApp" target="_blank" rel="noopener noreferrer" data-ga-event="hero_social_link_click" data-ga-label="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>
        <a href="[youtube-url]" class="social" aria-label="YouTube" target="_blank" rel="noopener noreferrer" data-ga-event="hero_social_link_click" data-ga-label="YouTube"><i class="fa-brands fa-youtube"></i></a>
      </div>

      <div class="hero-actions">
        <a href="#" class="cta-btn hero-cta-btn" data-ga-event="book_appointment_click" data-ga-label="Hero">Book Appointment</a>
      </div>
    </div>

    <div class="hero-visual">
      <div class="hero-portrait">
        <img src="assets/[doctor-photo].jpg" alt="Dr. [Doctor Name], [Specialty], portrait" class="hero-image" loading="eager" />
      </div>
      <!-- Optional floating decorative icons (§4): <div class="hero-float-icon" aria-hidden="true">…</div> -->
    </div>
  </div>
</section>
```

The §33 order of profile lines is Qualification, Medical Regd. No., Fellowship, Languages; the
§33 social order is the one above. Stat tiles count up via `data-counter` (A.13); the year tile
also carries `data-practising-since`. Values: §4.

### A.4 Social Media widget ("From My Social Media")

Rules: §30 and §30.1. Markup, straight after Services:

```html
<section class="social-media-section" id="social-media">
  <div class="container">
    <div class="services-header social-media-header">
      <span class="services-kicker social-media-kicker">
        <i class="fa-solid fa-share-nodes" aria-hidden="true"></i> Latest Updates
      </span>
      <h2 class="services-title social-media-title">From My Social Media</h2>
      <p class="services-subtitle social-media-subtitle">
        My latest posts and practical health guidance, shared directly from the clinic.
      </p>
    </div>

    <div class="social-media-carousel-wrap">
      <button type="button" class="social-carousel-btn social-carousel-prev" aria-label="Previous posts">
        <i class="fa-solid fa-chevron-left" aria-hidden="true"></i>
      </button>
      <button type="button" class="social-carousel-btn social-carousel-next" aria-label="Next posts">
        <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
      </button>

      <div class="social-media-carousel" id="socialMediaCarousel">
        <div class="social-media-track" id="socialMediaTrack"></div>
      </div>
    </div>
  </div>
</section>
```

CSS (append at the **end** of `style.css`, §30.1 rule 16). The card values are the fixed §30.1
rule 14 spec and are written as literals on purpose: never remap them to the site palette. Only
the section band, kicker/title and the prev/next buttons use site tokens.

```css
/* Social media — live Facebook post embeds (AGENTS.md §30, §30.1) */
.social-media-section { position: relative; padding: 20px 0; background: var(--surface); }
.social-media-section[hidden] { display: none; }
.social-media-header { text-align: center; margin: 0 auto 48px; max-width: 700px; }
.social-media-subtitle { margin-left: auto; margin-right: auto; }

.social-media-carousel-wrap {
  position: relative;
  max-width: 100%;
  margin: 0 auto;
  padding: 0 56px;
  min-width: 0;
}

/* --post-card-width is read by the JS to size the SDK embed (data-width),
   so the iframe Facebook builds always matches the real card width. */
.social-media-carousel {
  --post-card-width: 300px;
  --post-card-height: 400px;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.social-media-carousel::-webkit-scrollbar { display: none; }

/* Centred while the posts fit; scrolls (via the carousel) once they don't.
   max-width: none beats the global div { max-width: 100% } reset — without it
   the track is capped at the carousel width and centring pushes the first
   cards off the left edge, where they can never be scrolled to. */
.social-media-track {
  display: flex;
  gap: 30px;
  align-items: flex-start;
  width: max-content;
  min-width: 100%;
  max-width: none;
  justify-content: safe center;
}

/* Every card is locked to one height. Facebook sizes its iframe to the post's
   own content (one long post measured ~3700px), so the card clips the embed
   instead of growing or scrolling — a deliberate exception to the global
   auto-height rule. */
.social-media-section .social-post-card {
  position: relative;
  flex: 0 0 var(--post-card-width);
  min-width: 0;
  max-width: 100%;
  height: var(--post-card-height) !important;
  min-height: 0;
  background: #ffffff;
  border: 1px solid hsl(155, 18%, 85%);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 4px 18px hsla(168, 40%, 18%, 0.10);
  transform: none;
  transition: none;
}
.social-media-section .social-post-card:hover { transform: none; }

/* Skeleton: placeholder cards before the feed arrives, then the same skeleton
   behind each embed until Facebook paints its iframe. */
.social-post-skeleton {
  position: absolute;
  inset: 0;
  z-index: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background: #ffffff;
}
.social-post-card.is-loaded .social-post-skeleton { display: none; }
.social-post-skeleton .sk {
  display: block;
  border-radius: 8px;
  background: linear-gradient(100deg, hsl(150, 24%, 94%) 30%, hsl(150, 25%, 99%) 50%, hsl(150, 24%, 94%) 70%);
  background-size: 220% 100%;
  animation: social-post-shimmer 1.4s ease-in-out infinite;
}
.social-post-skeleton .sk-head { display: flex; align-items: center; gap: 12px; }
.social-post-skeleton .sk-avatar { flex: 0 0 44px; width: 44px; height: 44px; border-radius: 50%; }
.social-post-skeleton .sk-lines { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 8px; }
.social-post-skeleton .sk-line { height: 12px; width: 100%; }
.social-post-skeleton .sk-w80 { width: 80%; }
.social-post-skeleton .sk-w60 { width: 60%; }
.social-post-skeleton .sk-w40 { width: 40%; }
.social-post-skeleton .sk-media { flex: 1 1 auto; min-height: 0; border-radius: 12px; }
@keyframes social-post-shimmer {
  from { background-position: 180% 0; }
  to   { background-position: -80% 0; }
}
@media (prefers-reduced-motion: reduce) {
  .social-post-skeleton .sk { animation: none; }
}

/* The embed is clipped by the fixed-height card — no scrolling. */
.social-post-card .fb-post { position: relative; z-index: 1; height: 100%; overflow: hidden; }

/* 44px bottom fade makes the cut look deliberate. */
.social-post-card:not(.is-fallback)::after {
  content: "";
  position: absolute;
  left: 0; right: 0; bottom: 0;
  height: 44px;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0), #ffffff 100%);
  z-index: 2;
  pointer-events: none;
}

/* The SDK writes fixed inline widths onto its own wrappers; cap them. */
.social-post-card .fb-post,
.social-post-card .fb-post span,
.social-post-card .fb-post iframe { max-width: 100% !important; }

/* Link card shown when the embed is blocked or never paints. */
.social-post-fallback {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  height: 100%;
  padding: 24px;
  text-align: center;
  background: var(--bg-2);
}
.social-post-fallback i { font-size: 34px; color: var(--brand); }
.social-post-fallback span {
  font-size: 18px;
  font-weight: 600;
  color: var(--brand-dark);
  overflow-wrap: break-word;
  word-break: break-word;
  white-space: normal;
}
.social-post-fallback:hover span { color: var(--accent-dark); }
.social-post-card .fb-xfbml-parse-ignore { margin: 0; padding: 20px; }
.social-post-card .fb-xfbml-parse-ignore a {
  font-size: 18px;
  font-weight: 600;
  color: var(--brand-dark);
  overflow-wrap: break-word;
  word-break: break-word;
  white-space: normal;
}

/* Prev/next buttons — their own class, not a shared .carousel-btn (§30.1 rule 16). */
.social-carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 3;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--surface);
  border: 2px solid var(--brand);
  color: var(--brand);
  font-size: 16px;
  cursor: pointer;
  transition: border-color 0.2s ease, color 0.2s ease;
}
.social-carousel-prev { left: 0; }
.social-carousel-next { right: 0; }
.social-carousel-btn:hover { border-color: var(--accent); color: var(--accent-dark); }
/* The button class sets display:flex, which would otherwise defeat [hidden]. */
.social-carousel-prev[hidden],
.social-carousel-next[hidden] { display: none; }
.social-carousel-prev:disabled,
.social-carousel-next:disabled { opacity: 0.4; cursor: default; pointer-events: none; }

@media (max-width: 640px) {
  .social-media-carousel { --post-card-width: 280px; --post-card-height: 375px; }
}

@media (max-width: 900px) {
  /* Prev/next move to a row below the track instead of floating over the cards. */
  .social-media-carousel-wrap {
    padding: 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      "carousel carousel"
      "prev next";
    justify-items: center;
    row-gap: 18px;
  }
  #socialMediaCarousel { grid-area: carousel; width: 100%; min-width: 0; }
  .social-carousel-prev { grid-area: prev; position: static; transform: none; justify-self: end; margin-right: 8px; }
  .social-carousel-next { grid-area: next; position: static; transform: none; justify-self: start; margin-left: 8px; }
}
```

JavaScript (a self-contained IIFE, append to `script/index.js`; it reads the slug from
`<body data-slug>` and hides the whole section when there is nothing to show):

```javascript
// Facebook Posts Carousel — live embeds from the DigiDr social feed API.
// Cards hold Facebook SDK embeds, which must never be cloned (a cloned embed
// renders blank) nor re-parented (that reloads the iframe). So the DOM is built
// once and left alone: paging only changes the container's scrollLeft, which
// the browser handles natively without touching any card.
(function () {
    // Slug comes from <body data-slug="{{slug}}"> — only HTML pages are templated.
    // An unreplaced "{{slug}}" counts as unset, so the section is hidden.
    const RAW_SLUG = (document.body.dataset.slug || "").trim();
    const DOCTOR_SLUG = RAW_SLUG.includes("{{") ? "" : RAW_SLUG;
    const API_BASE = "https://digidrapi.digidr.app";
    const FB_GRAPH_VERSION = "v23.0"; // Deprecated versions render blank, not errors — bump periodically.
    const MAX_CARDS = 5;
    const MAX_POST_AGE_DAYS = 183; // ~6 months
    const POSTS_PER_ACCOUNT = 50; // The filters below drop most posts, so ask for a deeper page.
    const FEED_TIMEOUT_MS = 7000; // No answer by then → section stays hidden, even if a reply arrives later.

    const section = document.getElementById("social-media");
    const carousel = document.getElementById("socialMediaCarousel");
    const track = document.getElementById("socialMediaTrack");
    const prevBtn = document.querySelector(".social-carousel-prev");
    const nextBtn = document.querySelector(".social-carousel-next");

    if (!section || !carousel || !track) return;

    // The section only shows when the doctor has posts to display. No connected
    // feed, no qualifying posts, an API failure, an unset slug or no answer within
    // FEED_TIMEOUT_MS all hide the whole section, so the page flows straight on.
    function hideSection() {
        section.hidden = true;
        section.style.display = "none"; // Templates may set display on <section>, beating [hidden].
    }

    if (!DOCTOR_SLUG) {
        hideSection();
        return;
    }

    function fetchJson(url) {
        const attempt = () => fetch(url, { credentials: "omit" }).then((r) => {
            if (!r.ok) throw new Error("HTTP " + r.status);
            return r.json();
        });
        // One retry — short network blips are common on mobile.
        return attempt().catch(
            () => new Promise((res) => setTimeout(res, 800)).then(attempt)
        );
    }

    function isVideoPermalink(url) {
        return /\/videos\//i.test(url);
    }

    function isRecent(createdAt) {
        const t = Date.parse(createdAt);
        if (isNaN(t)) return false; // Fail closed — unknown age is treated as stale.
        return (Date.now() - t) / 86400000 <= MAX_POST_AGE_DAYS;
    }

    // Only posts whose text carries the #DigiDr hashtag (any casing) are shown.
    const DIGIDR_TAG = /#digidr(?!\w)/i;
    function hasDigiDrTag(message) {
        return typeof message === "string" && DIGIDR_TAG.test(message);
    }

    function fetchDoctorPosts(slug) {
        const url = API_BASE + "/api/MicrositeSocialFeed/" +
            encodeURIComponent(slug) + "?limit=" + POSTS_PER_ACCOUNT;

        return fetchJson(url).then((data) => {
            if (!data || data.success === false || !Array.isArray(data.feeds)) return [];

            const entries = [];
            data.feeds.forEach((feed) => {
                if (!feed || feed.platform !== "facebook" || !Array.isArray(feed.posts)) return;
                feed.posts.forEach((post) => {
                    if (!post || !post.permalink) return;
                    if (isVideoPermalink(post.permalink)) return;
                    if (!isRecent(post.createdAt)) return;
                    if (!hasDigiDrTag(post.message)) return;
                    entries.push({
                        accountName: (feed.accountName || "").trim(),
                        permalink: post.permalink,
                        createdAt: post.createdAt || ""
                    });
                });
            });

            entries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            return entries.slice(0, MAX_CARDS);
        }).catch(() => []);
    }

    let fbSdkPromise = null;
    function loadFbSdk() {
        if (fbSdkPromise) return fbSdkPromise;
        fbSdkPromise = new Promise((resolve, reject) => {
            const s = document.createElement("script");
            s.src = "https://connect.facebook.net/en_US/sdk.js";
            s.async = true;
            s.defer = true;
            s.crossOrigin = "anonymous";
            s.onload = () => {
                if (!window.FB) return reject(new Error("FB missing"));
                // xfbml:false — parsing is triggered manually once the cards exist.
                window.FB.init({ xfbml: false, version: FB_GRAPH_VERSION });
                resolve(window.FB);
            };
            s.onerror = () => reject(new Error("SDK blocked"));
            document.body.appendChild(s);
        });
        return fbSdkPromise;
    }

    function embedWidth() {
        const raw = getComputedStyle(carousel).getPropertyValue("--post-card-width");
        return parseInt(raw, 10) || 300;
    }

    // The SDK reports success even when the embed is empty: with the plugin
    // iframe blocked (tracker blockers, third-party-cookie restrictions), it
    // still sets fb-xfbml-state="rendered", fires xfbml.render, AND removes the
    // nested fallback blockquote — leaving a 0px iframe in a blank card. So a
    // card only counts as loaded if its iframe actually has height; otherwise we
    // swap in our own link card, which the SDK cannot strip.
    function settleCard(card) {
        if (card.dataset.settled) return;

        const frame = card.querySelector("iframe");
        if (frame && frame.getBoundingClientRect().height > 40) {
            card.dataset.settled = "1";
            card.classList.add("is-loaded");
            return;
        }
        if (!card.dataset.deadline || Date.now() < +card.dataset.deadline) return;

        card.dataset.settled = "1";
        card.classList.add("is-loaded", "is-fallback");
        card.textContent = "";

        const link = document.createElement("a");
        link.className = "social-post-fallback";
        link.href = card.dataset.permalink || "#";
        link.target = "_blank";
        link.rel = "noopener noreferrer";

        const icon = document.createElement("i");
        icon.className = "fa-brands fa-facebook";
        icon.setAttribute("aria-hidden", "true");

        const label = document.createElement("span");
        label.textContent = card.dataset.account
            ? "View this post from " + card.dataset.account + " on Facebook"
            : "View this post on Facebook";

        link.append(icon, label);
        card.appendChild(link);
    }

    function settleAll() {
        track.querySelectorAll(".social-post-card").forEach(settleCard);
    }

    // Poll briefly: a blocked embed never fires an event we could listen for.
    function watchCards() {
        const deadline = Date.now() + 6000;
        track.querySelectorAll(".social-post-card").forEach((card) => {
            card.dataset.deadline = String(deadline);
        });
        const timer = setInterval(() => {
            settleAll();
            const pending = track.querySelectorAll(".social-post-card:not([data-settled])");
            if (!pending.length) clearInterval(timer);
        }, 400);
    }

    // Skeleton that mirrors a Facebook post (avatar + name, image, text lines).
    // Used for placeholder cards while the feed loads, and layered behind each
    // real embed until its iframe paints; hidden via .is-loaded, never moved.
    function buildSkeleton() {
        const skel = document.createElement("div");
        skel.className = "social-post-skeleton";
        skel.setAttribute("aria-hidden", "true");
        skel.innerHTML =
            '<div class="sk-head"><span class="sk sk-avatar"></span>' +
            '<span class="sk-lines"><span class="sk sk-line sk-w60"></span>' +
            '<span class="sk sk-line sk-w40"></span></span></div>' +
            '<span class="sk sk-media"></span>' +
            '<span class="sk sk-line"></span>' +
            '<span class="sk sk-line sk-w80"></span>';
        return skel;
    }

    function showSkeletons() {
        track.innerHTML = "";
        track.setAttribute("aria-busy", "true");
        for (let i = 0; i < 3; i++) {
            const card = document.createElement("div");
            card.className = "social-post-card is-placeholder";
            card.appendChild(buildSkeleton());
            track.appendChild(card);
        }
    }

    function buildCard(entry, width) {
        const card = document.createElement("article");
        card.className = "social-post-card";
        card.dataset.permalink = entry.permalink;
        if (entry.accountName) card.dataset.account = entry.accountName;

        const embed = document.createElement("div");
        embed.className = "fb-post";
        embed.setAttribute("data-href", entry.permalink);
        embed.setAttribute("data-width", String(width));
        embed.setAttribute("data-show-text", "true");

        // Visible if the SDK is blocked by an ad blocker or cookie restrictions.
        const fallback = document.createElement("blockquote");
        fallback.className = "fb-xfbml-parse-ignore";
        fallback.setAttribute("cite", entry.permalink);
        const link = document.createElement("a");
        link.href = entry.permalink;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = entry.accountName
            ? "View this post from " + entry.accountName + " on Facebook"
            : "View this post on Facebook";
        fallback.appendChild(link);

        embed.appendChild(fallback);
        card.appendChild(buildSkeleton());
        card.appendChild(embed);
        return card;
    }

    function initPaging() {
        if (!prevBtn || !nextBtn) return;

        function stepSize() {
            const card = track.firstElementChild;
            if (!card) return carousel.clientWidth;
            const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
            const span = card.offsetWidth + gap;
            const perPage = Math.max(1, Math.floor(carousel.clientWidth / span));
            return span * perPage;
        }

        function syncButtons() {
            // Nothing to page through when every card already fits.
            const fits = carousel.scrollWidth <= carousel.clientWidth + 1;
            prevBtn.hidden = fits;
            nextBtn.hidden = fits;
            const maxScroll = carousel.scrollWidth - carousel.clientWidth - 1;
            prevBtn.disabled = carousel.scrollLeft <= 0;
            nextBtn.disabled = carousel.scrollLeft >= maxScroll;
        }

        prevBtn.addEventListener("click", () => {
            carousel.scrollBy({ left: -stepSize(), behavior: "smooth" });
        });
        nextBtn.addEventListener("click", () => {
            carousel.scrollBy({ left: stepSize(), behavior: "smooth" });
        });

        carousel.addEventListener("scroll", syncButtons, { passive: true });
        window.addEventListener("resize", syncButtons);
        syncButtons();
    }

    function embedPosts() {
        watchCards();
        loadFbSdk().then((FB) => {
            FB.Event.subscribe("xfbml.render", settleAll);
            FB.XFBML.parse(track, settleAll);
            initPaging();
        }).catch(() => {
            // SDK never loaded — settle immediately into link cards.
            track.querySelectorAll(".social-post-card").forEach((card) => {
                card.dataset.deadline = "0";
            });
            settleAll();
            initPaging();
        });
    }

    function renderPosts(entries) {
        const width = embedWidth();
        const frag = document.createDocumentFragment();
        entries.forEach((entry) => frag.appendChild(buildCard(entry, width)));
        track.innerHTML = ""; // drop the placeholder skeletons
        track.appendChild(frag);
        track.removeAttribute("aria-busy");

        // The Facebook SDK (and the paint watchdog) still wait until the section
        // nears the viewport; only the small feed request runs at page load.
        if ("IntersectionObserver" in window) {
            const io = new IntersectionObserver((seen, obs) => {
                if (seen.some((e) => e.isIntersecting)) {
                    obs.disconnect();
                    embedPosts();
                }
            }, { rootMargin: "400px 0px" });
            io.observe(section);
        } else {
            embedPosts();
        }
    }

    // The feed is fetched at page load, not when the section scrolls into view,
    // so a doctor without posts has the section hidden before the visitor gets
    // there — it never collapses under them mid-read.
    showSkeletons();

    let decided = false;
    const timeout = setTimeout(() => {
        if (decided) return;
        decided = true;
        hideSection();
    }, FEED_TIMEOUT_MS);

    fetchDoctorPosts(DOCTOR_SLUG).then((entries) => {
        if (decided) return; // Late reply — the section is already hidden.
        decided = true;
        clearTimeout(timeout);
        if (!entries.length) {
            hideSection();
            return;
        }
        renderPosts(entries);
    });
})();

```

### A.5 Care Philosophy (default design, §7, §39)

```html
<section class="philosophy-section" id="philosophy">
  <div class="container philosophy-layout">
    <div class="philosophy-visual">
      <div class="philosophy-img-frame">
        <img src="assets/[philosophy-photo].jpg" alt="[Descriptive alt text: what the photo shows, tied to the specialty]" loading="lazy" />
      </div>
      <div class="philosophy-badge">
        <div class="philosophy-badge-icon"><i class="fa-solid fa-stethoscope" aria-hidden="true"></i></div>
        <div class="philosophy-badge-text">
          <strong>[Two-word value, e.g. Evidence-Led]</strong>
          <span>[Short second line, e.g. Diagnosis &amp; Care]</span>
        </div>
      </div>
    </div>

    <div class="philosophy-content">
      <span class="philosophy-kicker">
        <i class="fa-solid fa-heart-pulse" aria-hidden="true"></i> Care Philosophy
      </span>
      <h2 class="philosophy-title">[Title, e.g. A Careful Approach to Every Diagnosis]</h2>
      <p class="philosophy-subtitle">[One-line subtitle for the specialty.]</p>

      <div class="philosophy-pillars">
        <div class="philosophy-pillar">
          <div class="pillar-icon"><i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i><span class="pillar-index">01</span></div>
          <div class="pillar-body">
            <h3>[Pillar 1 heading]</h3>
            <p>[One sentence.]</p>
          </div>
        </div>
        <div class="philosophy-pillar">
          <div class="pillar-icon"><i class="fa-solid fa-book-medical" aria-hidden="true"></i><span class="pillar-index">02</span></div>
          <div class="pillar-body">
            <h3>[Pillar 2 heading]</h3>
            <p>[One sentence.]</p>
          </div>
        </div>
        <div class="philosophy-pillar">
          <div class="pillar-icon"><i class="fa-solid fa-handshake" aria-hidden="true"></i><span class="pillar-index">03</span></div>
          <div class="pillar-body">
            <h3>[Pillar 3 heading]</h3>
            <p>[One sentence.]</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
```

```css
/* Care Philosophy — image + floating badge left, connected-rail pillars right */
.philosophy-section { padding: 20px 0; background: var(--bg); }
.philosophy-layout {
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: 56px;
  align-items: center;
}
.philosophy-content { min-width: 0; }

.philosophy-visual { position: relative; min-width: 0; display: flex; justify-content: center; }
.philosophy-img-frame {
  position: relative;
  width: 100%;
  max-width: 460px;
  height: 440px; /* image frame, not a text card: a fixed height is allowed here (§7) */
  border-radius: var(--radius-xl);
  overflow: hidden;
  border: 5px solid var(--brand-dark);
  z-index: 1;
}
.philosophy-img-frame img { width: 100%; height: 100%; object-fit: cover; display: block; }

.philosophy-badge {
  position: absolute;
  right: 6%;
  bottom: -28px;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: calc(100% - 24px);
  padding: 14px 18px;
  background: var(--surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-card);
}
.philosophy-badge-icon {
  flex-shrink: 0;
  width: 40px; height: 40px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 50%;
  background: var(--brand-dark);
  color: #ffffff;
  font-size: 16px;
}
.philosophy-badge-icon i { color: #ffffff; }
.philosophy-badge-text { min-width: 0; display: flex; flex-direction: column; line-height: 1.3; }
.philosophy-badge-text strong { font-family: var(--font-heading); font-size: 18px; font-weight: 700; color: var(--brand-dark); }
.philosophy-badge-text span { font-size: 18px; color: var(--muted); }

.philosophy-pillars {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 26px;
  margin-top: 30px;
}
/* Dashed connecting rail behind the icon nodes */
.philosophy-pillars::before {
  content: "";
  position: absolute;
  top: 26px;
  bottom: 26px;
  left: 25px;
  width: 2px;
  background: repeating-linear-gradient(180deg, var(--border) 0 6px, transparent 6px 12px);
  z-index: 0;
}
.philosophy-pillar {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 20px;
  min-width: 0;
  z-index: 1;
}
.philosophy-pillar:nth-child(1) { --pillar-color: var(--brand); }
.philosophy-pillar:nth-child(2) { --pillar-color: var(--brand-2); }
.philosophy-pillar:nth-child(3) { --pillar-color: var(--accent); }
.pillar-icon {
  position: relative;
  width: 52px; height: 52px;
  flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  border-radius: 50%;
  background: var(--pillar-color, var(--brand));
  color: #ffffff;
  font-size: 19px;
}
.pillar-icon i { color: #ffffff; }
.pillar-index {
  position: absolute;
  bottom: -4px;
  right: -4px;
  width: 20px; height: 20px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 50%;
  background: var(--surface);
  border: 1px solid var(--pillar-color, var(--brand));
  color: var(--pillar-color, var(--brand));
  font-size: 10px;
  font-weight: 700;
  line-height: 1;
}
.pillar-body { min-width: 0; padding-top: 4px; }
.philosophy-pillar h3 { font-size: 20px; font-weight: 700; color: var(--brand-dark); margin: 0 0 6px; }
.philosophy-pillar p { font-size: 18px; color: var(--muted); margin: 0; }

@media (max-width: 1100px) {
  .philosophy-layout { grid-template-columns: 1fr; }
  .philosophy-visual { margin-bottom: 44px; }
  .philosophy-badge { right: auto; left: 50%; transform: translateX(-50%); }
}
```

The pillar `h3` is 20px here so it reads clearly bolder and larger than the 18px pillar text
(card-heading rule, §6); §7's table lists 18px/18px, and either is acceptable as long as the
heading is visibly heavier. Check the `.pillar-index` contrast (10px numeral) against its
background once the palette is chosen.

### A.6 Consultation Journey (default design, §8, §39)

```html
<section class="process-section" id="process">
  <div class="process-bg" aria-hidden="true"></div>
  <div class="container">
    <div class="process-header">
      <span class="process-kicker">
        <i class="fa-solid fa-route" aria-hidden="true"></i> Consultation Journey
      </span>
      <h2 class="process-title">What to Expect</h2>
      <p class="process-subtitle">[One line, e.g. A clear, reassuring 4-step process for complete [specialty] care.]</p>
    </div>

    <div class="process-timeline">
      <div class="process-step">
        <div class="process-step-marker">
          <div class="step-circle"><i class="fa-solid fa-calendar-check" aria-hidden="true"></i></div>
        </div>
        <div class="process-step-card">
          <span class="step-number" aria-hidden="true">01</span>
          <h3>Appointment Booking</h3>
          <p>Book online or by phone for a clinic visit or online consultation.</p>
        </div>
      </div>

      <div class="process-step">
        <div class="process-step-marker">
          <div class="step-circle"><i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i></div>
        </div>
        <div class="process-step-card">
          <span class="step-number" aria-hidden="true">02</span>
          <h3>[Diagnostic or evaluation step, e.g. Diagnostic Evaluation]</h3>
          <p>[One sentence naming the specialty's real examinations or tests.]</p>
        </div>
      </div>

      <div class="process-step">
        <div class="process-step-marker">
          <div class="step-circle"><i class="fa-solid fa-clipboard-user" aria-hidden="true"></i></div>
        </div>
        <div class="process-step-card">
          <span class="step-number" aria-hidden="true">03</span>
          <h3>Personalised Treatment Plan</h3>
          <p>[One sentence on the treatment options this specialty offers.]</p>
        </div>
      </div>

      <div class="process-step">
        <div class="process-step-marker">
          <div class="step-circle"><i class="fa-solid fa-circle-check" aria-hidden="true"></i></div>
        </div>
        <div class="process-step-card">
          <span class="step-number" aria-hidden="true">04</span>
          <h3>Recovery &amp; Follow-Up</h3>
          <p>[One sentence on follow-up and long-term support.]</p>
        </div>
      </div>
    </div>
  </div>
</section>
```

```css
/* Consultation Journey — dark brand band, vertical zig-zag timeline */
.process-section { position: relative; padding: 20px 0; background: var(--brand-dark); overflow: hidden; }
.process-header { text-align: center; margin-bottom: 56px; }
.process-header .process-subtitle { max-width: 700px; margin-left: auto; margin-right: auto; }

/* Decorative layer: soft accent/brand glows over a deep brand gradient.
   A site may add a faint specialty line-art pattern as an extra background layer. */
.process-bg {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(ellipse 65% 55% at 12% 15%, rgba(var(--accent-rgb), 0.20), transparent 60%),
    radial-gradient(ellipse 60% 60% at 88% 85%, rgba(255, 255, 255, 0.08), transparent 58%),
    linear-gradient(160deg, var(--brand) 0%, var(--brand-dark) 70%);
  z-index: 0;
}
.process-section .container { position: relative; z-index: 1; }

/* On the dark band, headings and text flip to light ink (check AA 4.5:1). */
.process-section .process-kicker { --kicker-fg: #ffffff; }
.process-section .process-title { color: #ffffff; }
.process-section .process-subtitle { color: rgba(255, 255, 255, 0.88); }

.process-timeline { position: relative; max-width: 900px; margin: 0 auto; }
.process-timeline::before {
  content: "";
  position: absolute;
  left: 50%;
  top: 6px;
  bottom: 6px;
  width: 2px;
  background: hsla(0, 0%, 100%, 0.25);
  transform: translateX(-50%);
  z-index: 0;
}

.process-step {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 84px 1fr;
  align-items: center;
  column-gap: 32px;
  min-width: 0;
  text-align: left;
}
.process-step + .process-step { margin-top: 44px; }
.process-step-marker { grid-column: 2; justify-self: center; z-index: 1; }
.process-step-card { grid-column: 3; min-width: 0; }
.process-step:nth-child(even) .process-step-card { grid-column: 1; grid-row: 1; text-align: right; }
.process-step:nth-child(even) .step-number { margin-left: auto; margin-right: 0; }

.step-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  margin: 0 0 12px;
  border-radius: 50%;
  background: var(--accent);
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
  line-height: 1;
}
.step-circle {
  position: relative;
  z-index: 1;
  width: 64px; height: 64px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 50%;
  background: var(--accent);
  border: 3px solid #ffffff;
  color: #ffffff;
  font-size: 24px;
  transition: transform 0.2s ease;
}
.step-circle i { color: #ffffff; }
.process-step:hover .step-circle { transform: scale(1.06); }

.process-step h3 { font-size: 20px; font-weight: 700; margin: 0 0 8px; color: #ffffff; }
.process-step p { font-size: 18px; color: rgba(255, 255, 255, 0.92); margin: 0; }

@media (prefers-reduced-motion: reduce) {
  .step-circle { transition: none; }
  .process-step:hover .step-circle { transform: none; }
}

/* ≤900px (§8): the zig-zag collapses to one left-aligned column. */
@media (max-width: 900px) {
  .process-timeline::before { left: 27px; transform: none; }
  .process-step { grid-template-columns: 56px 1fr; column-gap: 20px; }
  .process-step + .process-step { margin-top: 36px; }
  .process-step-marker { grid-column: 1; }
  .process-step-card,
  .process-step:nth-child(even) .process-step-card { grid-column: 2; text-align: left; }
  .process-step:nth-child(even) .step-number { margin-left: 0; margin-right: auto; }
  .step-circle { width: 56px; height: 56px; font-size: 20px; }
}
```

White text on `--accent` (step numbers and circles) must pass AA 4.5:1; pick an accent that does,
or darken these two fills to `--accent-dark`.

### A.7 Contact

```html
<section class="contact-section" id="contact-us">
  <div class="container">
    <div class="contact-card">
      <div class="contact-header">
        <h2>Contact Us</h2>
        <p>[One line, e.g. Expert [specialty] care, clinic visits and online consultations. Schedule a consultation today.]</p>
      </div>

      <div class="contact-grid">
        <div class="contact-item">
          <div class="contact-item-icon"><i class="fa-solid fa-location-dot" aria-hidden="true"></i></div>
          <h3>Address</h3>
          <p>
            <strong>[Clinic Name]</strong><br />
            [Address line]<br />
            [District], [State] - [Pincode]
          </p>
        </div>

        <div class="contact-divider"></div>

        <div data-contact-info class="contact-item">
          <div class="contact-item-icon"><i class="fa-solid fa-phone" aria-hidden="true"></i></div>
          <h3>Contact Information</h3>
          <p>
            <a data-contact-phone href="tel:+91[Phone]" data-ga-event="phone_number_click">+91-[Phone]</a><br />
            <a data-contact-email href="mailto:[Email]" data-ga-event="email_click">[Email]</a>
          </p>
        </div>
      </div>

      <div class="contact-actions">
        <a href="#" class="cta-btn contact-cta-btn" data-ga-event="book_appointment_click" data-ga-label="Contact">Book Appointment</a>
      </div>
    </div>
  </div>
</section>
```

```css
.contact-section { padding: 20px 0; background: var(--surface); }
.contact-card {
  background: var(--surface);
  border-radius: var(--radius-xl);
  border: 1px solid var(--border);
  box-shadow: var(--shadow-card);
  padding: 36px 56px;
}
.contact-header { text-align: center; max-width: 640px; margin: 0 auto 28px; }
.contact-header h2 { font-size: 34px; font-weight: 700; color: var(--brand-dark); margin: 0 0 12px; }
.contact-header p { color: var(--muted); font-size: 18px; margin: 0; }
.contact-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  gap: 24px;
  max-width: 900px;
  margin: 0 auto;
}
.contact-item { text-align: center; padding: 0 4px; min-width: 0; }
.contact-grid .contact-item { flex: 1 1 380px; max-width: 420px; }
.contact-divider { display: none; width: 1px; align-self: stretch; background: var(--border-light); }
.contact-grid:has(.contact-item + .contact-item) .contact-divider { display: block; }
.contact-item-icon {
  width: 52px; height: 52px;
  margin: 0 auto 14px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 50%;
  background: var(--accent);
  color: #ffffff;
  font-size: 20px;
}
.contact-item-icon i { color: #ffffff; }
.contact-item h3 { font-size: 18px; font-weight: 700; margin: 0 0 8px; color: var(--brand-dark); }
.contact-item p { font-size: 18px; color: var(--muted); margin: 0; }
.contact-item a { font-size: 18px; color: var(--brand-dark); font-weight: 700; }
.contact-actions { display: flex; justify-content: center; margin-top: 28px; }

@media (max-width: 1100px) {
  .contact-grid .contact-item { flex-basis: 100%; max-width: 100%; }
}
@media (max-width: 640px) {
  .contact-card { padding: 32px 20px; }
}
```

`.contact-cta-btn` uses the §15 primary CTA size (`14px 30px`, 18px). The contact cleanup in A.13
drops an empty phone or email line, and the whole contact-information item when both are empty.

### A.8 Practice Gallery and lightbox

```html
<section class="gallery-section" id="gallery">
  <div class="container">
    <div class="gallery-header">
      <h2 class="gallery-title">A Look Inside My Practice</h2>
      <p class="gallery-subtitle">[One line about the clinic and its facilities.]</p>
    </div>

    <div class="gallery-grid">
      <figure class="gallery-item">
        <img src="assets/gallery-1.jpg" alt="[What the photo shows, e.g. Clinic reception and waiting area]" loading="lazy" width="1200" height="900" />
      </figure>
      <!-- …one <figure class="gallery-item"> per photo; no captions (§35) -->
    </div>
  </div>
</section>

<div class="gallery-lightbox" id="galleryLightbox" aria-hidden="true">
  <div class="gallery-lightbox-backdrop" id="galleryLightboxBackdrop"></div>
  <figure class="gallery-lightbox-content">
    <img src="" alt="Enlarged gallery image" id="galleryLightboxImage" />
  </figure>
  <button class="gallery-lightbox-close" id="galleryLightboxClose" aria-label="Close image">&times;</button>
</div>
```

Grid CSS: §23 (swap `.service-card` for `.gallery-item`, gap 18px, 2 columns below 1100px). Item and
lightbox CSS:

```css
.gallery-section { padding: 20px 0; background: var(--bg); }
.gallery-header { text-align: center; margin: 0 auto 40px; max-width: 700px; }
.gallery-subtitle { margin-left: auto; margin-right: auto; }
.gallery-item {
  margin: 0;
  border-radius: var(--radius-lg);
  overflow: hidden;
  aspect-ratio: 4 / 3;
  box-shadow: var(--shadow-card);
}
.gallery-item img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
.gallery-item:hover img { transform: scale(1.08); }

.gallery-lightbox { position: fixed; inset: 0; display: none; align-items: center; justify-content: center; z-index: 600; }
.gallery-lightbox.is-open { display: flex; }
.gallery-lightbox-backdrop { position: absolute; inset: 0; background: var(--overlay-backdrop); }
/* The frame shrink-wraps the photo so it shows at its true aspect ratio. */
.gallery-lightbox-content {
  position: relative;
  z-index: 1;
  display: flex;
  width: fit-content;
  margin: 0;
  max-width: min(1100px, 92vw);
  max-height: 82vh;
  max-height: 82dvh;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.5);
}
.gallery-lightbox-content img { width: auto; height: auto; max-width: 100%; max-height: inherit; object-fit: contain; display: block; }
.gallery-lightbox-close {
  position: absolute; top: 16px; right: 20px; z-index: 2;
  width: 40px; height: 40px; border-radius: 999px; border: none;
  background: rgba(255, 255, 255, 0.9); color: var(--brand-dark);
  font-size: 26px; line-height: 1; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
}
.gallery-lightbox-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  width: 50px; height: 50px;
  border-radius: 50%;
  border: none;
  background: rgba(15, 23, 42, 0.75);
  color: #f9fafb;
  font-size: 36px;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  user-select: none;
}
.gallery-lightbox-prev { left: 24px; }
.gallery-lightbox-next { right: 24px; }
.gallery-lightbox-nav:hover { background: rgba(255, 255, 255, 0.95); color: var(--brand-dark); }

@media (max-width: 768px) {
  /* Prev/next move to a row below the image. */
  .gallery-lightbox-content { max-height: 68vh; max-height: 68dvh; }
  .gallery-lightbox-nav {
    top: auto;
    bottom: max(24px, env(safe-area-inset-bottom));
    transform: none;
    width: 44px; height: 44px;
    font-size: 28px;
    left: 50%;
  }
  .gallery-lightbox-prev { transform: translateX(calc(-100% - 10px)); }
  .gallery-lightbox-next { transform: translateX(10px); }
}
```

Lightbox JS (creates the prev/next buttons itself; Escape and arrow keys work):

```javascript
// Gallery Lightbox
(function () {
  const lightbox = document.getElementById("galleryLightbox");
  const lightboxImage = document.getElementById("galleryLightboxImage");
  const closeBtn = document.getElementById("galleryLightboxClose");
  const backdrop = document.getElementById("galleryLightboxBackdrop");
  const galleryImages = document.querySelectorAll(".gallery-item img");

  if (!lightbox || !lightboxImage || galleryImages.length === 0) return;

  // Create prev and next buttons dynamically if not present
  let prevBtn = document.getElementById("galleryLightboxPrev");
  let nextBtn = document.getElementById("galleryLightboxNext");
  if (!prevBtn) {
    prevBtn = document.createElement("button");
    prevBtn.id = "galleryLightboxPrev";
    prevBtn.className = "gallery-lightbox-nav gallery-lightbox-prev";
    prevBtn.setAttribute("aria-label", "Previous image");
    prevBtn.innerHTML = "&lsaquo;";
    lightbox.appendChild(prevBtn);
  }
  if (!nextBtn) {
    nextBtn = document.createElement("button");
    nextBtn.id = "galleryLightboxNext";
    nextBtn.className = "gallery-lightbox-nav gallery-lightbox-next";
    nextBtn.setAttribute("aria-label", "Next image");
    nextBtn.innerHTML = "&rsaquo;";
    lightbox.appendChild(nextBtn);
  }

  let currentIdx = -1;

  function openLightbox(index) {
    currentIdx = index;
    const img = galleryImages[currentIdx];
    if (img) {
      lightboxImage.src = img.src;
      lightboxImage.alt = img.alt || "Enlarged gallery image";
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImage.src = "";
    document.body.style.overflow = "";
    currentIdx = -1;
  }

  function showPrev() {
    if (currentIdx > 0) {
      openLightbox(currentIdx - 1);
    } else {
      openLightbox(galleryImages.length - 1);
    }
  }

  function showNext() {
    if (currentIdx < galleryImages.length - 1) {
      openLightbox(currentIdx + 1);
    } else {
      openLightbox(0);
    }
  }

  galleryImages.forEach((img, idx) => {
    img.style.cursor = "zoom-in";
    img.addEventListener("click", () => openLightbox(idx));
  });

  if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
  if (backdrop) backdrop.addEventListener("click", closeLightbox);
  if (prevBtn) prevBtn.addEventListener("click", (e) => { e.stopPropagation(); showPrev(); });
  if (nextBtn) nextBtn.addEventListener("click", (e) => { e.stopPropagation(); showNext(); });

  document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("is-open")) return;
    if (event.key === "Escape") {
      closeLightbox();
    } else if (event.key === "ArrowLeft") {
      showPrev();
    } else if (event.key === "ArrowRight") {
      showNext();
    }
  });
})();
```

### A.9 FAQ (default design, §39)

```html
<section class="faq-section" id="faq">
  <div class="container">
    <div class="faq-header">
      <h2 class="faq-title">Frequently Asked Questions</h2>
      <p class="faq-subtitle">Answers to the questions patients ask most before their first visit.</p>
    </div>

    <div class="faq-list">
      <div class="faq-item is-active">
        <button type="button" class="faq-question" aria-expanded="true">
          <span>What [specialty] conditions do you treat?</span>
          <i class="fa-solid fa-chevron-down faq-icon" aria-hidden="true"></i>
        </button>
        <div class="faq-answer">
          <div class="faq-answer-inner">
            <p>[Name the main conditions this doctor treats.]</p>
          </div>
        </div>
      </div>

      <div class="faq-item">
        <button type="button" class="faq-question" aria-expanded="false">
          <span>Do I need a referral to book a consultation?</span>
          <i class="fa-solid fa-chevron-down faq-icon" aria-hidden="true"></i>
        </button>
        <div class="faq-answer">
          <div class="faq-answer-inner">
            <p>No referral is required. You can book a clinic visit or an online consultation directly through this website, and we'll guide you on any further steps after your first appointment.</p>
          </div>
        </div>
      </div>

      <div class="faq-item">
        <button type="button" class="faq-question" aria-expanded="false">
          <span>What should I bring to my first appointment?</span>
          <i class="fa-solid fa-chevron-down faq-icon" aria-hidden="true"></i>
        </button>
        <div class="faq-answer">
          <div class="faq-answer-inner">
            <p>[The reports, scans or prescriptions relevant to this specialty], a valid ID, and a list of medicines you're currently taking.</p>
          </div>
        </div>
      </div>

      <div class="faq-item">
        <button type="button" class="faq-question" aria-expanded="false">
          <span>Do you offer online consultations?</span>
          <i class="fa-solid fa-chevron-down faq-icon" aria-hidden="true"></i>
        </button>
        <div class="faq-answer">
          <div class="faq-answer-inner">
            <p>Yes. Online consultations are available for follow-ups, report reviews, and initial assessments. Select "Online Consultation" when booking your appointment.</p>
          </div>
        </div>
      </div>

      <div class="faq-item">
        <button type="button" class="faq-question" aria-expanded="false">
          <span>Is emergency care available?</span>
          <i class="fa-solid fa-chevron-down faq-icon" aria-hidden="true"></i>
        </button>
        <div class="faq-answer">
          <div class="faq-answer-inner">
            <p>[Name the urgent warning signs for this specialty]: please go to the nearest emergency room immediately. For non-emergency concerns, book the earliest available slot.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
```

```css
/* ============================================================
   FAQ SECTION — universal .faq-* classes, gallery(--bg) ↔ FAQ(--bg-3)
   alternation (alternating branded section bands). Accordion state
   is class-driven (.faq-item.is-active); JS below only toggles it.
   ============================================================ */
.faq-section {
  padding: 20px 0;
  background: var(--bg-3);
  background-image: radial-gradient(circle, rgba(15, 23, 42, 0.12) 1px, transparent 1px); /* FAQ dotted background */
  background-size: 18px 18px;
}

.faq-header {
  text-align: center;
  margin: 0 auto 40px;
  max-width: 700px;
}

.faq-title {
  font-size: 34px;
  font-weight: 800;
  color: var(--brand-dark);
  margin: 10px 0 12px;
  letter-spacing: -0.02em;
}

.faq-subtitle {
  font-size: 18px;
  color: var(--muted);
  max-width: 640px;
  margin: 0 auto;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-width: 900px;
  margin: 0 auto;
}

.faq-item {
  background: var(--surface);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  min-width: 0;
  height: auto !important;
  min-height: fit-content;
  max-width: 100%;
  overflow: hidden;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.faq-item.is-active {
  border-color: var(--brand);
  box-shadow: 0 4px 16px rgba(8, 18, 32, 0.08);
}

.faq-question {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
  padding: 18px 22px;
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  font-size: 18px;
  font-weight: 700;
  color: var(--text);
  overflow-wrap: break-word;
  word-break: break-word;
  white-space: normal;
}

.faq-question span {
  min-width: 0;
  flex: 1;
}

.faq-icon {
  flex-shrink: 0;
  color: var(--brand);
  background: var(--brand-light);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: transform 0.25s ease, background 0.2s ease, color 0.2s ease;
}

.faq-item.is-active .faq-icon {
  transform: rotate(180deg);
  background: var(--brand);
  color: #fff;
}

.faq-answer {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.25s ease;
}

.faq-item.is-active .faq-answer {
  grid-template-rows: 1fr;
}

.faq-answer-inner {
  min-height: 0;
  overflow: hidden;
}

.faq-answer-inner > p {
  min-width: 0;
  margin: 0;
  padding: 0 22px 20px;
  font-size: 18px;
  line-height: 1.6;
  color: var(--muted);
  overflow-wrap: break-word;
  word-break: break-word;
  white-space: normal;
}

@media (max-width: 900px) {
  .faq-title {
    font-size: 30px;
  }

  .faq-question {
    padding: 16px 18px;
    font-size: 18px;
  }

  .faq-answer-inner > p {
    padding: 0 18px 18px;
    font-size: 18px;
  }
}

@media (max-width: 480px) {
  .faq-question {
    gap: 10px;
    padding: 14px;
  }

  .faq-icon {
    width: 28px;
    height: 28px;
    font-size: 12px;
  }

  .faq-answer-inner > p {
    padding: 0 14px 16px;
  }
}

@media (min-width: 1400px) {
  .faq-title {
    font-size: 38px;
  }
}
```

The JS is the FAQ accordion block in A.13.

### A.10 Booking modal and Patient Consent panel (§11, §25, §37)

This markup matches the ids and hooks the booking JavaScript reads (Appendix A.18). Don't rename them.

```html
<div class="booking-modal" id="bookingModal" aria-hidden="true" role="dialog" aria-modal="true" aria-label="Book an appointment">
  <div class="booking-modal-backdrop" id="bookingModalBackdrop"></div>
  <div class="booking-modal-dialog" role="document">
    <div class="booking-modal-header">
      <button class="booking-modal-close" id="bookingModalClose" aria-label="Close booking form">&times;</button>

      <div class="booking-modal-tabs" role="tablist" aria-label="Appointment type">
        <button type="button" class="booking-tab is-active" id="clinicVisitTab" role="tab" aria-selected="true" data-ga-event="clinic_visit_tab_click">Clinic Visit</button>
        <button type="button" class="booking-tab" id="onlineConsultTab" role="tab" aria-selected="false" data-ga-event="online_consult_tab_click" aria-describedby="onlineConsultTip">Online Consultation<span class="booking-tab-info" id="onlineConsultInfo" aria-hidden="true"><i class="fa-solid fa-circle-info"></i></span></button>
      </div>
      <div class="booking-tab-tip" id="onlineConsultTip" role="tooltip" hidden>Online consultations are governed by the Telemedicine Practice Guidelines, 2020. They are not for emergencies, and the doctor may advise an in-person visit where an examination is needed.</div>
    </div>

    <form id="bookingForm" class="booking-form" novalidate data-userid="[doctor user id]" data-address="[Address]" data-clinicname="[Clinic Name]" data-pincode="[Pincode]" data-state="[State]" data-district="[District]" data-city="[City]">
      <div class="booking-form-row">
        <div class="booking-field">
          <label for="fullName">Full Name</label>
          <input type="text" id="fullName" name="fullName" placeholder="Enter Your Full Name" required />
          <p class="booking-error" data-error-for="fullName"></p>
        </div>
        <div class="booking-field">
          <label for="phone">Phone</label>
          <input type="tel" id="phone" name="phone" placeholder="Enter mobile number" autocomplete="tel" required />
          <p class="booking-error" data-error-for="phone"></p>
        </div>
      </div>

      <div class="booking-form-row">
        <div class="booking-field">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" placeholder="your@email.com" required />
          <p class="booking-error" data-error-for="email"></p>
        </div>
        <div class="booking-field booking-field--date">
          <label for="preferredDateText">Preferred Date</label>
          <div class="booking-datepicker" id="preferredDateField">
            <div class="booking-input-with-icon">
              <input type="text" id="preferredDateText" class="booking-date-display" placeholder="Select a date" readonly autocomplete="off" />
              <i class="fa-solid fa-calendar-days booking-date-icon" aria-hidden="true"></i>
            </div>
            <input type="hidden" id="preferredDate" name="preferredDate" />
            <div class="booking-calendar" id="preferredDateCalendar" hidden>
              <div class="booking-calendar-header">
                <button type="button" class="booking-calendar-nav" data-cal-prev aria-label="Previous month"><i class="fa-solid fa-chevron-left"></i></button>
                <span class="booking-calendar-title" data-cal-title></span>
                <button type="button" class="booking-calendar-nav" data-cal-next aria-label="Next month"><i class="fa-solid fa-chevron-right"></i></button>
              </div>
              <div class="booking-calendar-weekdays">
                <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
              </div>
              <div class="booking-calendar-grid" data-cal-grid></div>
            </div>
          </div>
          <p class="booking-error" data-error-for="preferredDate"></p>
        </div>
      </div>

      <div class="booking-form-row">
        <div class="booking-field">
          <label for="preferredTime">Preferred Time</label>
          <div class="booking-select-wrap">
            <select id="preferredTime" name="preferredTime" required>
              <option value="">Select Time Slot</option>
            </select>
            <i class="fa-solid fa-chevron-down booking-select-icon" aria-hidden="true"></i>
          </div>
          <p class="booking-error" data-error-for="preferredTime"></p>
        </div>
      </div>

      <div class="booking-field">
        <label for="reason">Reason For Visit</label>
        <textarea id="reason" name="reason" rows="3" placeholder="Please describe your symptoms or reason for consultation..." required></textarea>
        <p class="booking-error" data-error-for="reason"></p>
      </div>

      <div class="booking-field booking-field--file">
        <label for="report">Upload Report</label>
        <div class="booking-upload-row">
          <label class="booking-upload-btn" for="report" data-ga-event="upload_report_click">Upload</label>
          <input type="file" id="report" name="report" accept=".jpg,.jpeg,.png,.pdf,image/*,application/pdf" />
          <span class="booking-upload-help">(JPEG, PNG, PDF file formats supported)</span>
        </div>
        <div class="booking-file-preview" id="filePreview"></div>
        <p class="booking-error" data-error-for="report"></p>
      </div>

      <div class="booking-field booking-consent-field">
        <input type="checkbox" id="consentCheckbox" name="consentCheckbox" required />
        <label for="consentCheckbox">I agree to the Privacy Policy and consent to Dr. [Doctor Name] and DigiDr using my details to provide my consultation. I can withdraw consent or request data deletion at info@digidr.app.</label>
      </div>
      <p class="booking-error" data-error-for="consentCheckbox"></p>

      <button type="submit" id="submitBtn" class="booking-submit-btn" disabled>Book Appointment</button>

      <div class="booking-loader" id="bookingLoader" aria-hidden="true">
        <div class="loader-spinner"></div>
        <p>Booking your appointment...</p>
      </div>
    </form>
  </div>
</div>

<!-- Patient Consent & Data Privacy panel (§37) -->
<div class="booking-modal consent-modal" id="consentModal" aria-hidden="true" role="dialog" aria-modal="true" aria-labelledby="consentModalTitle">
  <div class="booking-modal-backdrop" id="consentModalBackdrop"></div>
  <div class="booking-modal-dialog consent-modal-dialog" role="document">
    <div class="booking-modal-header consent-modal-header">
      <button class="booking-modal-close" id="consentModalClose" aria-label="Close consent notice">&times;</button>
      <h2 class="consent-modal-title" id="consentModalTitle">Patient Consent &amp; Data Privacy</h2>
    </div>

    <div class="consent-modal-body">
      <p>By submitting this form, I consent to <strong>digidr.app</strong> collecting and processing the personal and health information provided by me, including my <strong>name, phone number, email address, appointment details, symptoms/reason for consultation, and uploaded medical reports</strong>, for scheduling, managing, and facilitating my consultation with the doctor.</p>

      <h3>How we protect your information</h3>
      <ul>
        <li>Your personal and health information will be <strong>kept secure and confidential</strong> using appropriate safeguards.</li>
        <li>Your information will <strong>not be sold or shared for marketing or unrelated purposes</strong>.</li>
        <li>Information may be shared only where necessary to facilitate the requested healthcare service, with my authorisation, or where required or permitted by applicable law.</li>
        <li>Medical reports and health information will be handled only for legitimate healthcare and related service purposes.</li>
      </ul>

      <h3>Your rights</h3>
      <p>Subject to applicable law and necessary medical-record retention requirements, you may request <strong>access, correction, deletion, or withdrawal of consent</strong> regarding your personal information.</p>

      <h3>Questions or Complaints</h3>
      <p>For any privacy concern, complaint, or request relating to your personal data, you may contact:</p>
      <p class="consent-contact"><strong>Compliance Officer &ndash; DigiDr.app</strong><br /><strong>Email:</strong> <a href="mailto:info@digidr.app">info@digidr.app</a></p>

      <p>By clicking on I Agree button, I confirm that I have <strong>read and understood this consent notice and agree to the processing of my information for the purposes stated above.</strong></p>

      <p class="consent-modal-links"><a href="privacy-policy.html">Privacy Policy</a> | <a href="terms-of-service.html">Terms &amp; Conditions</a></p>
    </div>

    <div class="consent-modal-footer" id="consentModalFooter">
      <p class="consent-scroll-hint" id="consentScrollHint"><i class="fa-solid fa-arrow-down" aria-hidden="true"></i> Please read the full notice to continue</p>
      <button type="button" class="booking-submit-btn consent-agree-btn" id="consentAgreeBtn" disabled>
        <span class="consent-agree-label" id="consentAgreeLabel">I Agree</span>
      </button>
    </div>
  </div>
</div>
```

Booking modal CSS. Primary actions (Submit, I Agree) use the solid `--button` fill; tabs, the
upload button and the close button are neutral or outline (§37). Form controls are 16px; Submit
and Upload are 18px (§11). The §25 intl-tel-input overrides are included.

```css
/* Booking modal shell (also used by the consent panel) */
.booking-modal { position: fixed; inset: 0; display: none; align-items: center; justify-content: center; z-index: 700; padding: 20px; }
.booking-modal.is-open { display: flex; }
.booking-modal-backdrop { position: absolute; inset: 0; background: var(--overlay-backdrop); }
.booking-modal-dialog {
  position: relative;
  z-index: 1;
  background: var(--surface);
  border-radius: 20px;
  width: min(600px, 96vw);
  max-height: 90vh;
  max-height: 90dvh;
  overflow-y: auto;
  overflow-x: hidden;
  box-shadow: 0 24px 80px rgba(10, 25, 45, 0.35);
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.booking-modal-dialog::-webkit-scrollbar { display: none; }

/* Sticky header: close button + tabs stay pinned while the form scrolls */
.booking-modal-header {
  position: sticky; top: 0; z-index: 5;
  background: var(--surface);
  margin-bottom: 20px;
  padding: 20px 32px 0;
  border-bottom: 2px solid var(--border);
}
.booking-modal-close {
  position: absolute; top: 12px; right: 20px;
  min-width: 44px; min-height: 44px;
  background: none; border: none; font-size: 28px; line-height: 1;
  cursor: pointer; color: var(--muted);
}
.booking-modal-close:hover { color: var(--text); }

.booking-modal-tabs { display: flex; gap: 8px; margin-bottom: -2px; }
.booking-tab {
  position: relative;
  background: none; border: none; padding: 10px 20px;
  font-family: inherit; font-size: 16px; font-weight: 600; color: var(--muted); cursor: pointer;
  border-bottom: 3px solid transparent; margin-bottom: -2px;
}
.booking-tab.is-active { color: var(--brand-dark); border-bottom-color: var(--brand-dark); }

/* Online-consultation info icon + tooltip (hover on desktop, focus, tap on touch) */
.booking-tab-info {
  display: inline-flex; align-items: center; justify-content: center;
  width: 24px; height: 24px; margin-left: 4px; vertical-align: middle;
  font-size: 16px; color: inherit; opacity: 0.75; cursor: help; border-radius: 50%;
}
.booking-tab-info:hover, .booking-tab-info.is-open { opacity: 1; }
.booking-tab-tip {
  position: absolute; top: calc(100% + 8px); left: 16px; right: 16px; z-index: 6;
  padding: 12px 14px; border-radius: 10px;
  background: #0f172a; color: #fff; font-size: 16px; line-height: 1.5; text-align: left;
  box-shadow: 0 8px 24px rgba(10, 25, 45, 0.25);
  overflow-wrap: break-word; word-break: break-word; white-space: normal; min-width: 0; max-width: 100%;
}
.booking-tab-tip[hidden] { display: none; }

.booking-form { display: flex; flex-direction: column; gap: 12px; padding: 0 32px 32px; }
.booking-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.booking-field { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.booking-field label { font-size: 16px; font-weight: 600; color: var(--brand-dark); }
.booking-field input, .booking-field select, .booking-field textarea {
  width: 100%; padding: 11px 14px; border: 1.5px solid var(--border);
  border-radius: 10px; font-size: 16px; font-family: inherit; color: var(--text); background: var(--surface);
  outline: none;
}
.booking-field input:focus, .booking-field select:focus, .booking-field textarea:focus {
  border-color: var(--brand); box-shadow: 0 0 0 3px var(--brand-light);
}
.booking-field textarea { resize: vertical; }
.booking-error { margin: 0; font-size: 16px; color: #dc2626; }
.booking-error:empty { display: none; }

.booking-select-wrap { position: relative; }
.booking-select-wrap select { appearance: none; padding-right: 36px; }
.booking-select-icon { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: var(--muted); pointer-events: none; font-size: 16px; }

/* Phone field — intl-tel-input (§25, §26 gotchas 1 and 3) */
.iti { display: block; width: 100%; --iti-border-color: var(--border); --iti-country-selector-bg: var(--surface); }
.iti__country-selector { border-radius: 10px; max-width: none; }
.iti__selected-dial-code { font-size: 16px; color: var(--text); }
.iti__dial-code { font-size: 15px; }
.booking-field .iti__search-input { padding-left: calc(1em + 24px); padding-right: 14px; padding-top: 8px; padding-bottom: 8px; }
.booking-field .iti__tel-input.is-invalid { border-color: #dc2626; box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.15); }

/* Date picker */
.booking-datepicker { position: relative; }
.booking-input-with-icon { position: relative; }
.booking-date-display { cursor: pointer; }
.booking-field input.booking-date-display { padding-right: 40px; }
.booking-date-icon { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); color: var(--muted); pointer-events: none; font-size: 16px; }
.booking-calendar {
  position: absolute; top: calc(100% + 8px); left: 0; right: 0; z-index: 50;
  background: var(--surface);
  border: 1px solid var(--border-light);
  border-radius: 14px;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.16);
  padding: 14px;
  min-width: 280px;
}
.booking-calendar[hidden] { display: none; }
.booking-calendar-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
.booking-calendar-title { font-size: 16px; font-weight: 600; color: var(--text); }
.booking-calendar-nav {
  width: 30px; height: 30px; border-radius: 50%; border: none;
  background: var(--bg-2); color: var(--brand-dark);
  display: inline-flex; align-items: center; justify-content: center;
  font-family: inherit; font-size: 16px; cursor: pointer;
}
.booking-calendar-weekdays { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); text-align: center; font-size: 16px; font-weight: 600; color: var(--muted); margin-bottom: 4px; }
.booking-calendar-weekdays span { padding: 4px 0; }
.booking-calendar-grid { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 2px; }
.booking-calendar-day {
  width: 100%; min-width: 0; aspect-ratio: 1 / 1;
  border: none; background: transparent; border-radius: 50%;
  font-family: inherit; font-size: 16px; color: var(--text); cursor: pointer;
  display: inline-flex; align-items: center; justify-content: center;
}
.booking-calendar-day--empty { cursor: default; }
.booking-calendar-day:not(.is-disabled):not(.booking-calendar-day--empty):hover { background: var(--bg-2); }
.booking-calendar-day.is-today { border: 1.5px solid var(--brand-dark); font-weight: 700; color: var(--brand-dark); }
.booking-calendar-day.is-selected { background: var(--accent); color: #ffffff; font-weight: 700; }
.booking-calendar-day.is-disabled { color: #9ca3af; cursor: not-allowed; }

/* Upload: outline button (secondary control, §37), preview filled in by the booking JS */
.booking-field--file .booking-upload-row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
/* The upload button is a <label>, so it needs .booking-field in its selector to beat
   `.booking-field label { font-size: 16px }` above (specificity, §26). */
.booking-field .booking-upload-btn {
  flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center;
  padding: 9px 18px; border-radius: var(--radius-pill);
  background: var(--surface); border: 1.5px solid var(--brand-dark); color: var(--brand-dark) !important;
  font-family: inherit; font-size: 18px; font-weight: 600; cursor: pointer;
}
.booking-field .booking-upload-btn:hover { background: var(--brand-light); }
.booking-field--file input[type="file"] { display: none; }
.booking-upload-help { font-size: 16px; color: var(--muted); }
.booking-file-preview { display: block; width: 100%; margin-top: 8px; }
.booking-file-preview .preview-container {
  display: flex; align-items: flex-start; gap: 12px;
  padding: 12px; width: 100%;
  background: var(--surface-2); border: 1px solid var(--border); border-radius: 10px;
}
.booking-file-preview .preview-image { width: 70px; height: 70px; object-fit: cover; border-radius: 6px; flex-shrink: 0; }
.booking-file-preview .preview-pdf {
  width: 70px; height: 70px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  background: #fee2e2; border-radius: 6px; color: #dc2626; font-size: 28px;
}
.booking-file-preview .preview-info { display: flex; flex-direction: column; gap: 4px; flex: 1; min-width: 0; }
.booking-file-preview .preview-name { margin: 0; font-size: 16px; font-weight: 500; color: var(--text); word-break: break-word; line-height: 1.3; }
.booking-file-preview .preview-size { margin: 0; font-size: 16px; color: var(--muted); }

.booking-consent-field { display: flex !important; flex-direction: row !important; align-items: center; gap: 10px; }
.booking-consent-field input[type="checkbox"] { width: 18px; height: 18px; flex-shrink: 0; accent-color: var(--brand-dark); cursor: pointer; }
.booking-consent-field label { font-size: 16px; font-weight: 500; color: var(--text); cursor: pointer; max-width: none; }

/* Primary action: solid fill, 18px (§11, §15) */
.booking-submit-btn {
  width: 100%; padding: 14px; border: none; border-radius: var(--radius-pill);
  background: var(--button);
  font-family: inherit; color: #ffffff; font-size: 18px; font-weight: 700;
  cursor: pointer; transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
}
.booking-submit-btn:hover:not([disabled]) { background: var(--button-hover); transform: translateY(-2px); box-shadow: var(--shadow-accent); }
.booking-submit-btn[disabled] { background: hsl(218, 12%, 70%); cursor: not-allowed; }

.booking-loader {
  display: none; position: fixed; inset: 0; z-index: 20;
  background: rgba(255, 255, 255, 0.96);
  flex-direction: column; align-items: center; justify-content: center; gap: 16px;
}
.booking-loader[aria-hidden="false"] { display: flex; }
.booking-loader p { margin: 0; font-size: 16px; color: var(--brand-dark); font-weight: 600; }
.loader-spinner {
  width: 46px; height: 46px; border-radius: 50%;
  border: 4px solid var(--border); border-top: 4px solid var(--accent);
  animation: booking-spin 0.8s linear infinite;
}
@keyframes booking-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

@media (max-width: 640px) {
  .booking-form-row { grid-template-columns: 1fr; }
  .booking-modal-header { margin-bottom: 16px; padding: 6px 18px 0; }
  .booking-form { padding: 0 18px 24px; }
  /* The close button gets its own row above the tabs so it never crowds the info icon */
  .booking-modal-close { position: static; display: block; margin: 0 -8px 0 auto; width: 44px; height: 40px; }
  .booking-tab { padding: 10px 12px; }
}
```

Consent panel CSS (it reuses the `.booking-modal` shell above):

```css
/* ============================================================
   PATIENT CONSENT MODAL
   Reuses the .booking-modal shell; swapped in when the consent
   checkbox is clicked and swapped back out on close / "I Agree".
   Fonts inherit from the page; colours follow this microsite's
   existing booking-modal palette.
   ============================================================ */
.consent-modal-header { padding: 20px 32px 16px; margin-bottom: 0; }
.consent-modal-title {
  font-family: inherit; font-size: 26px; font-weight: 700; line-height: 1.3;
  color: var(--brand-dark); margin: 0; padding-right: 44px;
  overflow-wrap: break-word; word-break: break-word; white-space: normal;
}

.consent-modal-body { padding: 20px 32px 8px; min-width: 0; }
.consent-modal-body p,
.consent-modal-body li {
  font-size: 18px; line-height: 1.6; margin: 0 0 14px;
  overflow-wrap: break-word; word-break: break-word; white-space: normal;
}
.consent-modal-body h3 {
  font-family: inherit; font-size: 20px; font-weight: 700; line-height: 1.35;
  color: var(--brand-dark); margin: 22px 0 10px;
  overflow-wrap: break-word; word-break: break-word; white-space: normal;
}
.consent-modal-body ul { margin: 0 0 14px; padding-left: 22px; }
.consent-modal-body li { margin-bottom: 8px; }
.consent-modal-body strong { color: var(--brand-dark); }
.consent-contact {
  background: rgba(0, 0, 0, 0.04); border-radius: 10px; padding: 14px 16px;
}
.consent-modal-links { font-style: italic; }
.consent-modal-links a {
  font-size: 18px; color: var(--accent);
  text-decoration: underline; text-underline-offset: 2px;
}

/* Sticky action bar. Background inherits so tinted dialogs stay correct. */
.consent-modal-footer {
  position: sticky; bottom: 0; z-index: 5;
  background: inherit;
  padding: 16px 32px 24px;
  border-top: 1.5px solid rgba(0, 0, 0, 0.10);
  border-radius: 0 0 var(--radius-xl) var(--radius-xl);
}

/* Agree button is gated on reading: disabled until the notice is scrolled
   through. The label always reads "I Agree"; the hint above carries the
   instruction. */
.consent-agree-btn { width: 100%; margin-top: 0 !important; }
.consent-agree-btn span { color: #ffffff; }
.consent-agree-btn[disabled] { opacity: 0.55; cursor: not-allowed; }
.consent-agree-btn[disabled] span { color: #ffffff; }

.consent-scroll-hint {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  margin: 0 0 10px; font-size: 16px; font-weight: 600; line-height: 1.4;
  color: var(--accent); text-align: center; min-width: 0;
  overflow-wrap: break-word; word-break: break-word; white-space: normal;
}
.consent-scroll-hint i { flex-shrink: 0; animation: consentBounce 1.4s ease-in-out infinite; }
.consent-modal-footer.is-read .consent-scroll-hint { display: none; }

@keyframes consentBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(4px); }
}
@media (prefers-reduced-motion: reduce) {
  .consent-scroll-hint i { animation: none; }
}

@media (max-width: 640px) {
  .consent-modal-header { padding: 16px 18px 12px; }
  .consent-modal-title { font-size: 22px; padding-right: 40px; }
  .consent-modal-body { padding: 16px 18px 8px; }
  .consent-modal-body p, .consent-modal-body li { font-size: 18px; }
  .consent-modal-body h3 { font-size: 19px; }
  .consent-modal-body ul { padding-left: 20px; }
  .consent-modal-footer { padding: 14px 18px 20px; }
  .consent-scroll-hint { font-size: 15px; }
}
```

The JavaScript for the modal, tabs, availability, slots, upload preview, validation, submit, the
consent panel and the tooltip is the booking-modal IIFE in Appendix A.18 (C). The
confirmation popup is built by that code's `showPopup()` with inline styles, so it needs no CSS.

### A.11 Footer (§12, §36, §44)

Use this markup on **all three pages**. On the legal pages, the Quick Links point to
`index.html#about` etc. and the brand link to `index.html`; nothing else changes.

```html
<footer class="site-footer">
  <div class="footer-inner">
    <div class="footer-brand-col">
      <a href="#home" class="brand">
        <span class="avatar">
          <img src="assets/[doctor-photo].jpg" alt="Dr. [Doctor Name]" />
        </span>
        <span class="brand-text">
          <span class="brand-name">Dr. [Doctor Name]</span>
          <span class="brand-role">[Specialty]</span>
        </span>
      </a>
      <p class="footer-tagline">[One-line tagline for the practice.]</p>
      <div class="footer-social-wrap">
        <span class="footer-social-label">Follow me on:</span>
        <div class="footer-social">
          <a href="[facebook-profile-url]" aria-label="Facebook Profile" target="_blank" rel="noopener noreferrer" data-ga-event="footer_social_link_click" data-ga-label="Facebook Profile"><i class="fa-brands fa-facebook"></i></a>
          <a href="[facebook-page-url]" aria-label="Facebook Page" target="_blank" rel="noopener noreferrer" data-ga-event="footer_social_link_click" data-ga-label="Facebook Page"><i class="fa-brands fa-facebook-f"></i></a>
          <a href="[instagram-url]" aria-label="Instagram" target="_blank" rel="noopener noreferrer" data-ga-event="footer_social_link_click" data-ga-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
          <a href="[x-url]" aria-label="X" target="_blank" rel="noopener noreferrer" data-ga-event="footer_social_link_click" data-ga-label="X"><i class="fa-brands fa-x-twitter"></i></a>
          <a href="[linkedin-url]" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer" data-ga-event="footer_social_link_click" data-ga-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>
          <a href="[website-url]" aria-label="Website" target="_blank" rel="noopener noreferrer" data-ga-event="footer_social_link_click" data-ga-label="Website"><i class="fa-solid fa-globe"></i></a>
          <a href="https://wa.me/91[whatsapp-number]" aria-label="WhatsApp" target="_blank" rel="noopener noreferrer" data-ga-event="footer_social_link_click" data-ga-label="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>
          <a href="[youtube-url]" aria-label="YouTube" target="_blank" rel="noopener noreferrer" data-ga-event="footer_social_link_click" data-ga-label="YouTube"><i class="fa-brands fa-youtube"></i></a>
        </div>
      </div>
    </div>

    <div class="footer-right-col">
      <div class="footer-links-group">
        <h4>Quick Links</h4>
        <nav class="footer-nav" aria-label="Quick links">
          <a href="#about" data-ga-event="footer_nav_link_click" data-ga-label="About">About</a>
          <a href="#services" data-ga-event="footer_nav_link_click" data-ga-label="Services">Services</a>
          <a href="#contact-us" data-ga-event="footer_nav_link_click" data-ga-label="Contact">Contact</a>
          <a href="#gallery" data-ga-event="footer_nav_link_click" data-ga-label="Gallery">Gallery</a>
        </nav>
      </div>

      <div class="footer-links-group">
        <h4>Legal</h4>
        <nav class="footer-nav" aria-label="Legal">
          <a href="privacy-policy.html" data-ga-event="footer_nav_link_click" data-ga-label="Privacy Policy">Privacy Policy</a>
          <a href="terms-of-service.html" data-ga-event="footer_nav_link_click" data-ga-label="Terms of Service">Terms of Service</a>
        </nav>
      </div>

      <div class="footer-visitor-badge" role="status">
        <i class="fa-solid fa-users footer-visitor-badge-icon" aria-hidden="true"></i>
        <span class="footer-visitor-badge-label">No. of Visitor:</span>
        <strong class="footer-visitor-badge-count" id="visitorCount">0</strong>
      </div>
    </div>
  </div>

  <div class="footer-bottom-row">
    <p>&copy; 2026 Dr. [Doctor Name]. <span class="footer-rights">All rights reserved.</span></p>
  </div>
  <p class="footer-disclaimer">Information, not advice. Content on this site is for general public awareness. It is not medical advice, does not create a doctor–patient relationship and does not replace a consultation.<br>In an emergency, call 112 or go to the nearest hospital.</p>
</footer>
```

The `#visitorCount` number is filled by the §44 script. Footer CSS (dark brand footer; invert the
light-on-dark colours if the footer background is light):

```css
.site-footer { background: var(--brand-dark); color: rgba(255, 255, 255, 0.88); padding: 32px 0 0; border-top: 4px solid var(--accent); }

.footer-inner {
  max-width: 760px;
  margin: 0 auto;
  padding: 0 24px 28px;
  display: grid;
  /* minmax(0, …) lets a long doctor name wrap instead of pushing the column off-screen */
  grid-template-columns: minmax(0, max-content) minmax(0, max-content);
  justify-content: space-between;
  gap: 36px;
  align-items: start;
}

.footer-brand-col { display: flex; flex-direction: column; align-items: flex-start; text-align: left; gap: 14px; min-width: 0; }
.site-footer .brand { display: flex; align-items: center; gap: 12px; }
.site-footer .brand .brand-name { color: #ffffff; }
.site-footer .brand .brand-role { color: rgba(255, 255, 255, 0.82); }
.site-footer .brand .avatar { border-color: var(--accent); }
.footer-tagline { font-size: 18px; color: rgba(255, 255, 255, 0.85); margin: 0; max-width: 340px; line-height: 1.4; }

.footer-social-wrap { display: flex; flex-direction: column; align-items: flex-start; gap: 6px; min-width: 0; }
.footer-social-label { font-size: 18px; font-weight: 600; color: rgba(255, 255, 255, 0.85); }
.footer-social { display: flex; flex-wrap: wrap; justify-content: flex-start; gap: 8px; max-width: 344px; min-width: 0; }
.footer-social a {
  width: 36px; height: 36px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 50%;
  background: hsla(0, 0%, 100%, 0.09);
  border: 1px solid hsla(0, 0%, 100%, 0.16);
  color: #fff;
  transition: background 0.25s ease, border-color 0.25s ease;
}
.footer-social a i { color: #ffffff; }
.footer-social a:hover { background: var(--accent); border-color: var(--accent); }

.footer-right-col { display: flex; flex-direction: column; align-items: flex-start; gap: 16px; width: 100%; min-width: 0; }
.footer-links-group { display: flex; flex-direction: column; align-items: flex-start; gap: 8px; width: 100%; min-width: 0; }
.footer-links-group h4 {
  font-size: 18px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
}
.footer-nav { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 14px; max-width: 100%; min-width: 0; }
.footer-nav a { text-decoration: none; font-size: 18px; color: rgba(255, 255, 255, 0.85); }
.footer-nav a:hover { color: #ffffff; text-decoration: underline; }

/* Visitor badge (§44) — static markup, the count comes from the API */
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

.footer-bottom-row { border-top: 1px solid hsla(0, 0%, 100%, 0.14); text-align: center; padding: 14px 24px; }
.footer-bottom-row p { font-size: 18px; color: rgba(255, 255, 255, 0.8); margin: 0; }
/* The global reset's span { color } rule beats inherited colour (§26 gotcha 2). */
.footer-bottom-row p .footer-rights { color: inherit; }

/* Footer disclaimer */
footer .footer-disclaimer {
  position: relative;
  display: block;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  margin: 0;
  padding: 12px 24px 16px;
  box-sizing: border-box;
  text-align: center;
  font-size: 14px !important;
  line-height: 1.5;
  color: inherit;
  overflow-wrap: break-word;
  word-break: break-word;
  white-space: normal;
}

@media (max-width: 1100px) {
  .footer-inner { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 640px) {
  .footer-inner { grid-template-columns: 1fr; justify-items: start; }
  .footer-social { display: grid; grid-template-columns: repeat(4, 36px); gap: 8px; }
  .footer-rights { display: block; margin-top: 2px; }
}
```

### A.12 Legal pages (§41)

Body of `privacy-policy.html` (`terms-of-service.html` has the same shell with the §41.2 text).
The pages have no site header; the article opens with the Back link.

```html
<body data-micrositeid="microsite-<specialty>-<n>" data-slug="{{slug}}">
  <main class="legal-page">
    <section class="blog-detail-section legal-section">
      <div class="container">
        <article class="blog-detail-article legal-article">
          <a href="index.html" class="blog-detail-back-link">
            <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
            Back to Home
          </a>

          <p class="blog-detail-meta legal-meta">Legal Information</p>
          <h1 class="blog-detail-title legal-title">Privacy Policy</h1>
          <p class="legal-lead">We respect patient privacy and handle personal information with care, transparency, and appropriate safeguards.</p>
          <p class="legal-effective-date"><strong>Effective Date:</strong> [Insert Date]</p>

          <div class="blog-detail-content">
            <p>This Privacy Policy explains how personal information is collected, used, stored, and protected when you use this website and its consultation and appointment services.</p>

            <h2>1) Who We Are</h2>
            <p>This is the personal microsite of <strong>[Doctor/Clinic Name]</strong>, [Qualifications], Registration No. [Registration No.], [Council]. It is hosted on technology provided by DigiDr (digidr.app).</p>
            <!-- …the rest of §41.1, one <h2> per numbered heading, lists as <ul class="legal-list">… -->

            <h2>14) Contact Us</h2>
            <div class="legal-contact-card">
              <p><strong>[Doctor/Clinic Name]</strong></p>
              <p>Email: [Insert Email]</p>
              <p>Phone: [Insert Phone Number]</p>
              <p>Address: [Insert Clinic Address]</p>
            </div>
            <p>To report an error or a concern about this site, or to raise a privacy grievance with DigiDr, write to <a href="mailto:info@digidr.app">info@digidr.app</a>.</p>
          </div>
        </article>
      </div>
    </section>
  </main>

  <!-- Footer: A.11, with index.html# links -->

  <script src="./script/analytics.js"></script>
  <script src="./script/index.js"></script>
  <script src="./script/chatbot.js" defer></script>
  <!-- Visitor counter: the §44 inline script -->
</body>
```

`index.js` runs on the legal pages too, so every block in it must return early when its markup is
missing (the A.13 and §4c blocks already do). `styles/legal.css`:

```css
/* Legal Pages */
.legal-page {
  background: var(--bg);
}

.legal-section {
  padding-top: 56px;
}

.legal-article {
  max-width: 980px;
  margin: 0 auto;
  border: 1px solid #e5e7eb;
  border-radius: 22px;
  padding: 34px 36px 40px;
  background: #ffffff;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.08);
}

.legal-page .blog-detail-back-link {
  gap: 10px;
  margin-bottom: 22px;
  padding: 9px 14px;
  border-radius: 999px;
  border: 1px solid var(--button);
  background: #ffffff;
  color: var(--button);
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.01em;
  transition: all 0.2s ease;
}

.legal-page .blog-detail-back-link i {
  font-size: 12px;
}

.legal-page .blog-detail-back-link:hover {
  transform: translateY(-1px);
  border-color: var(--button);
  background: var(--button);
  color: #ffffff;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.16);
}

.legal-meta {
  margin-bottom: 10px;
}

.legal-title {
  margin-bottom: 8px;
}

.legal-lead {
  margin: 0 0 14px;
  color: #374151;
  font-size: 18px;
  line-height: 1.75;
  max-width: 74ch;
}

.legal-effective-date {
  margin: 0 0 24px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid var(--button);
  background: #ffffff;
  color: var(--button);
  font-size: 18px;
  font-weight: 600;
}

.legal-page .blog-detail-content {
  display: grid;
  gap: 12px;
}

.legal-page .blog-detail-content h2 {
  margin-top: 20px;
  margin-bottom: 0;
  padding-top: 14px;
  border-top: 1px solid #edf1f7;
  font-size: 22px;
  color: var(--button);
}

.legal-page .blog-detail-content h2:first-of-type {
  margin-top: 6px;
}

.legal-page .blog-detail-content p {
  margin: 0;
  color: #475569;
  font-size: 18px;
  line-height: 1.85;
}

.legal-list {
  margin: 0;
  padding-left: 22px;
  color: #4b5563;
}

.legal-list li {
  margin: 0 0 8px;
  line-height: 1.75;
}

.legal-contact-card {
  margin-top: 10px;
  padding: 18px 18px 8px;
  border-radius: 14px;
  border: 1px solid var(--button);
  background: #ffffff;
}

.legal-contact-card p {
  margin-bottom: 10px;
}

@media (max-width: 900px) {
  .legal-article {
    padding: 28px 24px 30px;
    border-radius: 18px;
  }
}

@media (max-width: 768px) {
  .legal-page .blog-detail-back-link {
    margin-bottom: 18px;
    padding: 8px 12px;
    font-size: 18px;
  }

  .legal-section {
    padding-top: 36px;
  }

  .legal-lead {
    font-size: 18px;
    line-height: 1.72;
  }

  .legal-effective-date {
    font-size: 18px;
    padding: 7px 11px;
  }

  .legal-page .blog-detail-content h2 {
    margin-top: 18px;
    padding-top: 12px;
    font-size: 19px;
  }
}
```

### A.13 Shared page JavaScript (`script/index.js`)

Load-time reset, smooth in-page scrolling without a `#hash` in the URL (§32), and the mobile menu:

```javascript
// Always start fresh on load/refresh: reset scroll position and strip any
// URL hash left over from in-page nav so a reload never resumes mid-page.
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

if (window.location.hash) {
  history.replaceState(null, "", window.location.pathname + window.location.search);
}

window.scrollTo(0, 0);

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Node)) return;

    const clickedInsideNav = mainNav.contains(target);
    const clickedToggle = menuToggle.contains(target);

    if (!clickedInsideNav && !clickedToggle && mainNav.classList.contains("open")) {
      mainNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
}

// In-page anchor links: smooth-scroll without writing #section to the address bar,
// and close the mobile menu once a nav link is chosen.
document.addEventListener("click", (event) => {
    const link = event.target instanceof Element ? event.target.closest('a[href^="#"]') : null;
    if (!link) return;
    const hash = link.getAttribute("href");
    if (!hash || hash.length < 2) return;
    let section = null;
    try { section = document.querySelector(hash); } catch (e) { return; }
    if (!section) return;

    event.preventDefault();
    if (menuToggle && mainNav && mainNav.classList.contains("open")) {
        mainNav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
    }
    section.scrollIntoView({ behavior: "smooth", block: "start" });
});
```

Because the click is intercepted, no hash is ever written; the load-time `replaceState` strips one
that arrives from another page (e.g. `index.html#about` from a legal page).

Stat counter (§4, §33). It reads the target from the element's own text (`15`, `15+`, `20k+`,
`20,000+`), so it works unchanged after parameterization:

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

FAQ accordion (§39):

```javascript
/* FAQ accordion — universal .faq-item / .faq-question / .faq-answer */
(function () {
  var faqList = document.querySelector(".faq-list");
  if (!faqList) return;

  faqList.addEventListener("click", function (e) {
    var btn = e.target.closest(".faq-question");
    if (!btn) return;

    var item = btn.closest(".faq-item");
    var isActive = item.classList.contains("is-active");

    faqList.querySelectorAll(".faq-item.is-active").forEach(function (openItem) {
      if (openItem !== item) {
        openItem.classList.remove("is-active");
        openItem.querySelector(".faq-question").setAttribute("aria-expanded", "false");
      }
    });

    item.classList.toggle("is-active", !isActive);
    btn.setAttribute("aria-expanded", String(!isActive));
  });
})();
```

Contact cleanup (drops an empty phone or email line, or the whole contact-information item):

```javascript
/* ==========================================================================
   Contact Information cleanup — the card shows only if the backend sends a
   phone number or an email. Empty lines are dropped; if both are empty the
   [data-contact-info] block is removed together with its divider, and an
   enclosing [data-contact-card] is removed too if nothing else is left in
   it. Call buttons marked [data-contact-phone-cta] are removed when there is
   no phone. The single-card layout is handled in styles/style.css.
   ========================================================================== */
(function initContactInfoCleanup() {
  const info = document.querySelector('[data-contact-info]');
  if (!info) return;

  const phone = info.querySelector('[data-contact-phone]');
  const email = info.querySelector('[data-contact-email]');

  // An empty phone renders as "91-" / "+91-" — require a real number after the
  // country code ("X" allowed so template placeholders like +91-XXXXXXXXXX stay).
  const phoneDigits = phone ? phone.textContent.split('-').slice(1).join('').replace(/[^\dXx]/g, '') : '';
  const hasPhone = phoneDigits.length >= 6;
  const hasEmail = !!email && /^[^\s@{}]+@[^\s@{}]+\.[^\s@{}]+$/.test(email.textContent.trim());

  if (!hasPhone) {
    document.querySelectorAll('[data-contact-phone-cta]').forEach((btn) => btn.remove());
  }

  if (hasPhone && hasEmail) return;

  if (!hasPhone && !hasEmail) {
    const card = info.closest('[data-contact-card]');
    [info.previousElementSibling, info.nextElementSibling].forEach((el) => {
      if (el && /divider/.test(el.className)) el.remove();
    });
    info.remove();
    if (card && !card.querySelector('a, button, [data-contact-keep]')) card.remove();
    return;
  }

  // Exactly one is missing — remove that line together with its adjoining <br>.
  const missing = hasPhone ? email : phone;
  if (!missing) return;
  const next = missing.nextElementSibling;
  const prev = missing.previousElementSibling;
  if (next && next.tagName === 'BR') next.remove();
  else if (prev && prev.tagName === 'BR') prev.remove();
  missing.remove();
})();
```

Booking success event (`booking_submitted`, §40). The booking code (A.18) only calls
`window.__trackBookingSuccess?.(type)`; this defines it. Put it anywhere in `index.js`:

```javascript
// GA4 booking_submitted (AGENTS.md §40). The booking code calls this after a successful
// booking with "online" or "offline"; without it the event is never sent.
window.__trackBookingSuccess = function (type) {
  window.trackEvent?.("booking_submitted", { appointment_type: type });
};
```

Hero year and fellowship (shows only the year in "Practising since"; hides an empty fellowship line):

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

The Read More toggle is in §24, the gallery lightbox in A.8, the Facebook carousel in A.4, and the
booking code in A.18 and the chatbot script in A.19.

### A.14 `script/analytics.js` (§40)

Load it before `index.js` on every page:

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

### A.15 `robots.txt`, `sitemap.xml`, `llms.txt` (§29)

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
    <loc>https://digidr.app/{{slug}}/privacy-policy.html</loc>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>https://digidr.app/{{slug}}/terms-of-service.html</loc>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
</urlset>
```

`llms.txt` (on a non-parameterized site, write the doctor's name and specialty in place of
`{{full_name}}`/`{{speciality}}`, and keep `{{slug}}`):

```
# NOTE: llms.txt (see llmstxt.org) only takes effect at the domain root
# (digidr.app/llms.txt). This file is a per-microsite draft — backend team
# must merge every microsite's entry into ONE combined llms.txt served at
# digidr.app/llms.txt, one line per doctor under the "Doctors" section below.
# Path below assumes this microsite is served at digidr.app/{{slug}}/

# Dr. {{full_name}}

> Dr. {{full_name}}, {{speciality}}, on DigiDr. Book a consultation online.

- Specialty: {{speciality}}
- Book a consultation: https://digidr.app/{{slug}}/#booking-modal

## Pages

- [Profile](https://digidr.app/{{slug}}/): Dr. {{full_name}}'s profile — about, services, care philosophy, consultation journey, and practice gallery.
- [Privacy Policy](https://digidr.app/{{slug}}/privacy-policy.html)
- [Terms of Service](https://digidr.app/{{slug}}/terms-of-service.html)
```

### A.16 `styles/chatbot.css` (§13, §38)

The widget's script is `script/chatbot.js`, given verbatim in Appendix A.19 (identical on
every microsite). Its stylesheet follows; the colours come from `--accent`/`--accent-dark`/
`--accent-rgb` (§1). The send-button rule near the end is needed because `chatbot.js` hardcodes a
white send icon and this stylesheet draws a white button.

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

### A.17 Banner module (§14)

Markup, as the first child of the hero section. `data-banner-active="false"` hides it:

```html
<div
  class="digidr-banner-module single-image-banner-section"
  id="digidrBannerModule"
  data-banner-active="false"
  data-banner-start="2026-01-01T00:00:00+05:30"
  data-banner-end="2026-12-31T23:59:59+05:30"
  aria-label="Main Clinic Banner"
  data-banner-src="assets/banner-desktop.jpg"
  data-banner-src-mobile="assets/banner-mobile.jpg"
  data-banner-alt="[Banner description]"
  data-banner-href="#"
>
  <div class="container digidr-banner-container single-image-banner-container">
    <a href="#" class="digidr-banner-link" id="digidrBannerLink" aria-label="Clinic Promo Banner">
      <div class="digidr-banner-wrap single-image-banner-wrap">
        <picture>
          <source media="(max-width: 768px)" srcset="assets/banner-mobile.jpg" />
          <img src="assets/banner-desktop.jpg" alt="[Banner description]" class="digidr-banner-img single-image-banner-img" id="digidrBannerImg" loading="eager" />
        </picture>
      </div>
    </a>
  </div>
</div>
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

### A.18 Booking JavaScript (`script/index.js`)

The complete booking code: phone plugin, date picker, availability, slots, upload preview,
validation, submit, the Patient Consent panel and the Online Consultation tooltip. Copy all three
parts verbatim into `script/index.js`, in the order given in the Appendix A introduction ((A) and
(B) first, (C) after the A.8 lightbox). The code has no `{{…}}` placeholders and runs unchanged on
param and non-param sites. It is the same code as parameterization.md §4c, verified against the
deployed microsites (2026-10-28). **The two copies must stay identical**: change both or neither.

**Non-param sites:** the booking form's `data-userid` must be the doctor's real DigiDr user id,
and `data-clinicname`, `data-address`, `data-district`, `data-state` and `data-pincode` the real
clinic details (Appendix A.10). The code calls the live DigiDr API with them, so a placeholder
value means no available days, no slots and a failed booking.

Ids and hooks the code reads (all present in the Appendix A.10 markup):

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
- Phone input: intl-tel-input v29.2.2 from jsDelivr (AGENTS.md §25) loaded before `index.js`.
- `<body data-slug="{{slug}}" data-micrositeid="…">` (Appendix A.1).

What it does:

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

#### (A) Top-level helpers (first lines of `index.js`; declares `API_BASE`)

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

#### (B) Phone plugin and date picker

The date picker loads the doctor's working days (`getavailabledays`) and disables every other day
and every past date.

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

#### (C) Booking modal, consent panel and form validation

Availability (`getappointment`), slots (`getslots`), upload preview, the consent panel, the
tooltip, validation (including the required consent check) and the submit (`patient_appointment`).

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

### A.19 `script/chatbot.js` (§13, §38)

Identical on every microsite; copy verbatim and change nothing. It builds the whole widget
itself and appends it to `<body>`. The page only needs the
`<link rel="stylesheet" href="./styles/chatbot.css" id="chatbot-css" />` in `<head>` (keep the
`id`, it stops the script injecting a second stylesheet link) and
`<script src="./script/chatbot.js" defer></script>` at the end of `<body>` (Appendix A.1), plus
`<body data-slug>` and Font Awesome. Don't add a `#chatbot-mount` element or suggestion-chip code.
Same code as parameterization.md §4a; **keep the two copies identical**.

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
