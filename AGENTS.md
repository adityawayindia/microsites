# DigiDr Microsites — AGENTS.md (Pixel-Level Design Spec)

> **Single source of truth for this workspace.** This file states both the rules (why,
> and the non-negotiables) and the exact numbers — grounded in what ENT-1
> (`ENT/microsite-ent-1/`) actually ships today, treated as the canonical reference
> implementation. Where ENT-1's own code disagreed with itself, the conflict is called
> out explicitly and resolved below; ENT-1's code has not yet been patched to match —
> that is a separate follow-up pass. New and edited microsites should match these
> numbers unless a specialty's content genuinely requires a deviation.
>
> Values are desktop-first unless a breakpoint is named. "Same as body" means 18px,
> matching the sitewide `p, li, a` rule.

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
· [8. Journey](#8-consultation-journey-4-step-timeline) · [9. Testimonials](#9-testimonials-carousel)
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
· [26. CSS Gotchas](#26-known-css-gotchas) · [27. New Microsite Checklist](#27-new-microsite-build-checklist)

---

## 0. Canonical Breakpoint Scale

ENT-1's shipped code uses an ad hoc set of breakpoints (1400, 1100, 1030, 980, 900, 768,
760, 640, 620, 560, 480, 360 — twelve values, several only a few dozen px apart). That is
**not** the standard going forward. New/edited work should snap to this reduced scale
wherever possible:

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
§3.2 for why. `1200px` is what ENT-1's own content (6 nav links + full CTA label)
actually requires; a lighter header (fewer links, shorter CTA) could safely use a lower
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

**Testimonials (§9)**

| Element | Size |
|---|---|
| Stars label / quote text | 18px / 18px |

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
  --button: var(--accent);
  --button-hover: var(--accent-dark);

  /* Radius scale — fixed structurally, not a color, applies to every microsite as-is */
  --radius-xl: 28px;   /* cards: service, testimonial, philosophy image frame, popups */
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

The reference site's own inline comment claims the accent is "CTA-only," but its
shipped code uses `--accent` (there: a coral/amber hue) far more broadly: service-card
icon backgrounds, philosophy pillar icons, contact-item icons, step-circle fills,
calendar selected-date state, footer top border, hero equalizer bars. **This broader
usage is the accepted standard** — read §1.1's "accent strictly for CTAs" as meaning
*don't use accent as a large background fill or section-wide decorative wash*; small
icon accents, badges, and state indicators are fine and are how the 30% brand / 10%
accent balance actually reads on the page. What is **not** acceptable: accent color as
a full card background, a full section background, or body text color.

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

- One `.container` width for every page and every footer variant. (ENT-1's legal-page
  footer currently uses a separate `width: min(1240px, 92%)` — that is a bug to fix,
  not a second standard; there is only one container width sitewide.)
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

(ENT-1 currently also has a redundant, slightly conflicting `≤640px` rule block for
brand-role/avatar sizing that the later `≤1200px`-family block overrides in the
cascade — collapse these into one block when editing a site's CSS; don't carry the
duplicate forward into new sites.)

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

Reset `margin-left: 0` on `.nav-links` inside the mobile dropdown breakpoint (`≤1200px`
per §3.2's corrected value — not the stale `1030px` ENT-1 originally shipped) — once
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
breakpoint finally rescues it. On ENT-1 (6 nav links, full "Book Appointment" label)
this crush zone measured **1030px–1180px** — the site's hamburger breakpoint had been
set to `1030px`, comfortably inside its own crush zone rather than above it.

**Fix:** the hamburger/mobile breakpoint must sit *above* this crush zone, not at an
arbitrary round number. Measure it, don't guess it:

1. Load the page at full desktop width and shrink the viewport in ~10–15px steps.
2. Watch `.brand-name`'s rendered width (or just watch for the name visibly shrinking
   while nav-links stays full width) — note the width where it first starts shrinking
   below its natural size.
3. Set the hamburger breakpoint at least ~20px above that measured point, as a safety
   margin. On ENT-1 the crush started at `1180px`; the breakpoint was moved from
   `1030px` to `1200px`, which eliminates the crush zone entirely — the header now
   snaps cleanly from full-width desktop nav directly to the compact mobile/hamburger
   layout with no in-between crushed state.
4. Re-test with a longer doctor name (near the `.brand-name` 15ch cap) — a heavier
   name or a nav with more links pushes the crush zone's start wider still, so the
   safe breakpoint number is specific to each microsite's actual header content, not a
   fixed constant to copy from ENT-1 without re-checking.

This is a structural class of bug, not a one-time fix — check for it on every new or
edited microsite header, especially ones with more nav links, a longer brand name, or
a wider CTA label than ENT-1's.

---

## 4. Hero Section

| Element | Value |
|---|---|
| Section padding | `0` (all vertical rhythm lives in `.hero-layout`, not the section itself) |
| `.hero-layout` | grid `1.05fr 0.95fr`, `gap:56px`, `padding-top:36px`, `padding-bottom:40px` |
| `h1` (doctor name) | `clamp(36px, 5.2vw, 58px)`, weight 800, line-height `1.05` |
| Credentials / reg-id / languages lines | `18px` each |
| Expert/specialty badge | padding `9px 18px 9px 14px`, font `18px` (corrected — ENT-1 currently ships `16px`) |
| Stats grid | 3 columns, `gap:14px`, `margin-bottom:22px` |
| Stat box | padding `18px 14px`, `--radius-lg` (20px); icon `30px`; number `26px` weight 800; label `18px` (corrected — ENT-1 currently ships `16px`) |
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
`+`/`%`/`k` suffixes) — this is non-negotiable and is exactly how
ENT-1 implements it (`data-count-to` / `data-suffix` attributes).

---

## 5. About Section

| Element | Value |
|---|---|
| Section padding | `36px 0` (→ `32px` top only at `≤640px`) |
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
| Section padding | `36px 0` |
| Header block | `max-width:700px`, `margin-bottom:48px` |
| Grid | `repeat(12, minmax(0,1fr))`, `gap:26px` |
| Card span (desktop) | `span 4` → **3 per row** |
| Card | `--radius-xl` (28px), padding `30px 28px 26px`, `--shadow-card` |
| Icon | `54px × 54px` circle, `20px` glyph |
| Card `h3` | `22px` → `20px` at `≤480px` |
| Card `p` | `18px` |

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
| Section padding | `36px 0` |
| Layout | grid `0.9fr 1.1fr`, `gap:56px` → 1 column at `≤1100px` |
| Image frame | `max-width:460px`, fixed `height:440px`, `5px solid var(--brand-dark)` border, `--radius-xl` |
| Floating credential badge | padding `14px 18px`, `--radius-lg`; icon `40px × 40px` (`16px` glyph); label `strong` `18px` / `span` `18px` (corrected — ENT-1 currently ships `16px`/`14px`) |
| Pillars list | `gap:26px`, `margin-top:30px`; connecting rail `2px` dashed via `repeating-linear-gradient` |
| Pillar icon | `52px × 52px` circle, `19px` glyph; index badge `20px × 20px`, `10px` numeral |
| Pillar `h3` / `p` | `18px` / `18px` |

---

## 8. Consultation Journey (4-Step Timeline)

| Element | Value |
|---|---|
| Section padding | `36px 0`; header `margin-bottom:56px` |
| Timeline container | `max-width:900px`; connecting line `2px` |
| Step grid | `1fr 84px 1fr`, `column-gap:32px`; steps stack with `margin-top:44px` between them |
| Step-number chip | `26px × 26px` circle, `13px` numeral |
| Step circle (main icon) | `64px × 64px`, `3px` border, `24px` glyph |
| Hover animation | `transform: scale(1.06)` on the step circle — **no rotation/glow**, despite earlier design notes describing "rotate and glow on hover." Treat scale-only as the accepted implementation unless a specific microsite wants to add a rotating dotted ring instead. |
| Step `h3` / `p` | `20px` / `18px` |

**Breakpoint `≤900px`** (collapse ENT-1's separate 760px cutoff into this per §0): rail
moves to `left:27px`; grid becomes `56px 1fr`, `column-gap:20px`; step gap tightens to
`36px`; step circle shrinks to `56px` (glyph `20px`).

Accent color: ENT-1 hardcodes every step to `--accent` via duplicate per-`nth-child`
rules that all resolve to the same value — dead code. Either genuinely vary per-step
color (e.g. alternate `--accent`/`--brand`) or drop the redundant selectors; don't carry
the dead duplication into new sites.

---

## 9. Testimonials (Carousel)

| Element | Value |
|---|---|
| Section padding | `36px 0` |
| Carousel wrap | `max-width:1180px`, side padding `56px` (room for nav arrows) |
| Track gap | `22px` |
| Card width | `flex: 0 0 calc(33.333% - 15px)` (3 visible) → `50%` (2 visible) at `≤900px` → `100%` (1 visible) at `≤640px` |
| Card | padding `28px 24px`, `--radius-xl` |
| Avatar | `56px × 56px` circle, `2px solid var(--brand-dark)` |
| Stars / quote text | `18px` / `18px` |
| Nav arrow buttons | `44px × 44px` circle, `15px` glyph |
| Dot indicators | `10px × 10px`, active state `scale(1.2)` |
| Autoplay interval | `5000ms` |
| Swipe threshold | `50px` |

At `≤640px`, prev/next arrows relocate below the track (grid layout) rather than
overlapping the card edges.

---

## 10. Practice Gallery

| Element | Value |
|---|---|
| Section padding | `36px 0` |
| Grid | 12-track system (`repeat(12, minmax(0,1fr))`, `gap:18px`), same mechanism as Services §6 — 3 per row desktop (`span 4`), 2 per row at `≤1100px` (`span 6`), stays 2-column down to smallest widths (no forced single-column gallery) |
| Item | `aspect-ratio:4/3`, `--radius-lg`, `--shadow-card`; hover: image `scale(1.08)` |

**Leftover-row centering is mandatory here too** — copy the exact same §23 code used
for Services, applied to `.gallery-item` instead of `.service-card`: 1 leftover item
widens to `span 8` and centers; 2 leftover items stay `span 4` each, shifted to columns
3 and 7. At `≤1100px`, reset to `span 6` and re-center a lone leftover at `4 / span 6`.
A gallery with an even item count (ENT-1 ships 6) will never visibly exercise this —
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
button standard (§15) — ENT-1's current 16px submit/upload buttons are the outlier to
fix, not the new standard. The confirmation-popup OK button stays at 16px since it's a
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
nav buttons) must carry `font-family: inherit;` so it picks up the body's font. This is
already correct in the reference implementation — keep it that way on every new field
or button added to the form, since it's the kind of omission that's invisible in a
design mock and only shows up once real text is typed into a live input.

---

## 12. Footer

One footer spec for every page (marketing pages and legal pages alike — do not
maintain two divergent `.site-footer` rule blocks; ENT-1 currently does and it's a bug):

| Element | Value |
|---|---|
| `.site-footer` | padding `32px 0 0`, `4px solid var(--accent)` top border |
| `.footer-inner` | `max-width:760px`, two-column `grid-template-columns:max-content max-content`, `gap:36px` → 1 column at `≤640px` |
| Logo/avatar | reuses header `.avatar`, `46px` |
| Tagline / social label | `18px` |
| **Social icons** | **`36px × 36px`** circle, everywhere — this is the single standard; ENT-1's legal-page footer currently uses `42px` and must be brought down to `36px` to match |
| Links group heading (`h4`) | `18px`, weight 800, uppercase |
| Footer nav links | `18px` |
| Copyright row | `18px`, padding `14px 24px`, `1px solid` faint light divider (e.g. `hsla(0,0%,100%,.14)` on a dark footer background — invert to a dark-on-light divider if the footer background is light) |
| Visitor badge | padding `10px 18px` (use this value consistently for both the static and JS-injected versions — ENT-1 currently ships `8px` in one and `10px` in the other) |

Breakpoints: `≤1100px` → 2-column grid; `≤640px` → 1-column, social icons become a
4-per-row grid.

---

## 13. Chatbot Widget

Full spec below, based on ENT-1's shipped
`chatbot.css`. Chatbot colors follow the same placeholder rule as §1: define
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
inherit `font-family` from `body`. The reference implementation gets this right and the
pattern must be copied exactly:
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

---

## 15. Button Standards (Unified Scale)

**Every button uses the primary/accent color as a solid background — no outline-only or
ghost-button variants, anywhere.** ENT-1 originally shipped one exception (the hero's
"secondary" CTA was a transparent/outline button, filling in only on hover) — that has
been corrected to a solid `--button` fill by default, same as every other CTA. There is
no longer a visually distinct "secondary" button style; if a page needs two buttons
side by side with different emphasis, differentiate with size/placement (e.g. a filled
primary next to a smaller filled button), not with fill-vs-outline.

Previously ENT-1 also had five different padding pairs and two font-sizes across
buttons that all read visually as "primary/secondary CTA." Going forward, use this
scale — **every row below is a solid `--button`-background fill**:

| Button role | Padding | Font-size | Radius | Example |
|---|---|---|---|---|
| Primary CTA (large) | `14px 30px` | `18px` | pill | Hero CTA, contact CTA |
| Header/nav CTA | `9px 18px` | `18px` | pill | "Book Appointment" in header |
| Modal/dialog primary button | `14px` (full width) | `18px` | pill | Booking submit |
| Small/inline button | `9px 18px` | `18px` | pill | Upload button, blog "Read More" |
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

ENT-1 currently uses two different backdrop colors for two different full-screen
overlays. **Standardize on one token, used everywhere:**

```css
--overlay-backdrop: rgba(<near-black-or-brand-dark>, 0.7);
```

This is a neutral dark overlay independent of the specialty's brand palette — a
near-black or a very dark tint of `--brand-dark` both work; opacity around `0.7` is the
target (ENT-1's own two values, `.6` and `.85`, straddle this). Use this single token
for the booking-modal backdrop, the gallery-lightbox backdrop, and any future
full-screen overlay (confirmation popups, image viewers). Don't let different
components on the same page invent their own overlay darkness.

---

## 17. Images & Lighthouse / Performance Checklist

Apply to every microsite:

1. **Local assets over hotlinked images.** ENT-1's own portrait/about/philosophy photos
   are local (`assets/`), but its testimonial avatars and gallery photos are hotlinked
   to Unsplash with query-string sizing (`?w=120&h=120&fit=crop`, `?w=1400&q=80`). For
   a new/edited microsite, download and serve these locally from `assets/` — hotlinking
   a third party is a Lighthouse and reliability risk (no caching control, dependent on
   an external host staying up, no control over compression).
2. **Explicit dimensions or `aspect-ratio`.** Every content image needs either
   width/height attributes or a CSS `aspect-ratio` (as gallery/about/philosophy frames
   already do) to prevent layout shift (CLS) while loading.
3. **`loading="lazy"` on everything below the fold** (about photo, philosophy photo,
   gallery images, testimonial avatars) — already ENT-1's practice, keep it. The hero
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
6. **Preconnect + font-display:swap** for Google Fonts (already ENT-1's practice via
   `rel="preconnect"` + `&display=swap`) — keep on every microsite.
7. **No placeholder or broken external image URLs** — generate real images per
   the existing "No Placeholders" rule (generate real images, never a placeholder
   URL); this checklist just adds the
   performance dimension on top of that content rule.

---

## 18. Two Structural Additions Beyond the Original 10-Section List (Contact & Lightbox)

ENT-1's actual section order is:

Header → Hero (+ optional promotional banner) → About → Services → Care Philosophy →
Consultation Journey → **Contact** → Testimonials → Practice Gallery (+ lightbox) →
Booking Modal → Footer

(This is also stated as the canonical 11-section build list in §21.) Two things below
extend an earlier, shorter 10-section version of this list:
- **Contact section** (id `#contact-us`) sits between Consultation Journey and
  Testimonials — a dedicated address/phone/email card, separate from the footer and
  separate from the booking modal. Treat this as a mandatory 11th standard section
  going forward, positioned exactly there in the sequence. Section padding: `36px 0`,
  same as every other section per §19.
- **Gallery lightbox** is part of the standard Gallery section, not optional — every
  gallery grid should be click-to-enlarge with keyboard nav support, matching §10 above.

### 18.1 Contact Section — Full Spec

| Element | Value |
|---|---|
| Section padding | `36px 0` |
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

Every top-level section uses **`36px 0`** padding, desktop and mobile alike (no
separate mobile override needed for this value — it's already tight enough).

| Section | Padding |
|---|---|
| About | **36px 0** |
| Services | **36px 0** |
| Philosophy | **36px 0** |
| Consultation Journey | **36px 0** |
| Contact | **36px 0** |
| Testimonials | **36px 0** |
| Gallery | **36px 0** |

Any section shipping a different value is a bug to fix, not a valid variant.

---

## 20. Project Folder Structure & File Conventions

Specialty folders in this workspace:

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

Each specialty lives in its own folder, one subfolder per microsite variant:

```
<Specialty>/microsite-<specialty>-<n>/
  index.html
  blog.html
  blog-detail.html
  privacy-policy.html
  terms-of-service.html
  styles/
    style.css        ← ALL CSS lives here, no inline layout styles
    chatbot.css       ← chatbot widget styles (§13), separate file
    banner-module.css ← promotional banner styles (§14), separate file
  script/
    index.js          ← ALL JS lives here (counters, carousel, modal, grid logic, read-more)
    chatbot.js
    banner-module.js
  assets/              ← images and media (doctor photo, about/philosophy photos, icons)
```

- CSS lives exclusively in `styles/style.css` (plus the two separately-loaded
  `chatbot.css`/`banner-module.css` files for those two modules) — never inline
  `style="..."` for layout rules.
- JS lives exclusively in `script/index.js` (plus `chatbot.js`/`banner-module.js`).
- Internal links between pages use relative paths (`blog.html`, `index.html#about`),
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
| 1 | Header / Nav | Sticky header: doctor name, specialty role, nav links, booking CTA | §3 |
| 2 | Hero | Portrait, credentials, key stats (animated counters), languages, social links, CTAs | §4 |
| 3 | About | Executive bio — no icons, premium typography, Read More toggle if long | §5, §24 |
| 4 | Services | Responsive 12-track grid of core clinical services | §6, §23 |
| 5 | Care Philosophy | Split-screen: image + floating badge, 3 pillars with connecting rail | §7 |
| 6 | Consultation Journey | 4-step animated timeline | §8 |
| 7 | Contact | Dedicated address/phone/email card (mandatory 11th section) | §18.1 |
| 8 | Testimonials | Carousel: avatar, stars, quote, autoplay + swipe | §9 |
| 9 | Practice Gallery | Grid + lightbox, 12-track centering same as Services | §10, §23 |
| 10 | Booking Modal | Popup form: date/time, file upload, phone input, consent | §11, §25 |
| 11 | Footer | Branding, social links, quick/legal links, visitor badge, copyright | §12 |

Plus two persistent overlays present on every page load (not scroll sections):
**Chatbot widget** (§13) and, only on the homepage hero, the optional **promotional
banner module** (§14).

Every page also needs: a unique `<title>`, `<meta name="description">`, exactly one
`<h1>`, and semantic HTML5 elements throughout (`<header>`, `<section>`, `<article>`,
`<footer>`, `<nav>`) — this applies to `blog.html`, `blog-detail.html`,
`privacy-policy.html`, and `terms-of-service.html` too, not just `index.html`.

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
.contact-item, .testimonial-card, .testimonial-footer, .brand-text, .navbar,
.container, .nav-links, .nav-actions {
  min-width: 0;
}

/* Rule 3: Parent Container Auto-Height Expansion — add every new card/badge/
   chip class to this list */
.hero-badge, .hero-reg, .hero-title, .hero-subtitle, .hero-stats, .hero-stat,
.hero-chip, .service-card, .testimonial-card, .contact-card, .about-story,
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
  <button type="button" class="read-more-btn" aria-expanded="false">
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

## 27. New Microsite Build Checklist

Working order for building a new microsite from this file alone:

1. Copy the folder structure from an existing microsite (§20).
2. Pick real HSL values for every `:root` token (§1), verify AA 4.5:1 contrast before
   finalizing.
3. Add the mandatory global CSS block (§22) right after the `:root` block.
4. Set up `.container` (§2) and the header (§3), including the nav-links auto-shift
   pattern (§3.1) and a measured (not guessed) hamburger breakpoint (§3.2).
5. Build each page section in order (§21), pulling exact values from that section's
   spec (§4–§10, §18.1) as you go.
6. Wire up the Services and Gallery grids using the copy-paste centering code (§23);
   test with 4/5/6/7 items each.
7. Add the Read More toggle to the About bio if it's long enough (§24).
8. Build the Booking Modal (§11) with the phone input standard (§25).
9. Add the Chatbot widget (§13) and, if the homepage needs one, the promotional Banner
   Module (§14).
10. Apply the unified Button Standard (§15) and the unified Overlay token (§16) across
    every button/modal/lightbox on the site.
11. Run the Images/Lighthouse checklist (§17).
12. Test: long doctor names and long specialty text everywhere: full responsive range
    320px–1440px (§0); the header crush zone specifically (§3.2); grid counts of
    4/5/6/7 (§6, §10, §23); Read More with both a short and long bio (§24); form-field
    and chatbot fonts actually match the site font, not the browser default (§11, §13);
    check for the known gotchas (§26) on every third-party widget and colored button.
