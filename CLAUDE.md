# DigiDr Microsites — CLAUDE.md

> Full source of truth: [AGENTS.md](AGENTS.md). This file is a condensed, actionable
> checklist for Claude Code when creating or editing microsites in this workspace.
> These rules override default behaviour — follow without exception.

## Project shape

Each specialty lives in its own folder (`<Specialty>/microsite-<specialty>-<n>/`) with an
identical structure:
```
index.html, blog.html, blog-detail.html, privacy-policy.html, terms-of-service.html
styles/style.css   ← all CSS lives here, no inline layout styles
script/index.js    ← all JS lives here
assets/            ← images/media
```

`index.html` section order: Header/Nav → Hero → About → Services → Care Philosophy
(split-screen) → Consultation Journey (4-step timeline) → Testimonials (carousel) →
Practice Gallery → Booking Modal → Footer.

## Non-negotiable CSS rules (every microsite)

1. **No hard text overflow.** Never `white-space: nowrap` on dynamic content (names,
   badges, descriptions). Use `overflow-wrap: break-word; word-break: break-word;
   white-space: normal;`. Exception: a desktop-only `h1` name that must reset to
   `white-space: normal` in the ≤900px media query.
2. **Flex/grid children need `min-width: 0`** so long text shrinks instead of pushing
   siblings out of frame.
3. **No fixed heights on cards/badges/hero elements.** Use
   `height: auto !important; min-height: fit-content; max-width: 100%;` so they expand
   when content wraps.
4. **Social icon rows must have `flex-wrap: wrap`** (header, hero, footer) — any class
   name, check every `display: flex` social wrapper.
5. Insert the **Section 3 standard CSS block from AGENTS.md** near the top of
   `styles/style.css`, right after `:root {}` tokens — check first for the
   `DigiDr Global` comment marker before adding, don't duplicate. Add any new
   component classes used to the `min-width: 0` / `height: auto` lists.

## Typography

- Google Fonts only (Inter, Roboto, or Outfit preferred).
- `h2` section titles: 32–38px. `h3` card headings: 22px desktop / 20px ≤480px.
- **`p`, `li`, `a` = 18px everywhere, no exceptions** (nav links, footer links, inline
  links included). Dark color (`#0f172a` or similar). CTA `<a>` buttons are exempt
  (button sizing, not body-copy sizing).
- Badges/pills/metadata: 16px.
- Add a `1400px` media query scaling body/subtitles up to 18px max — never scale
  further at 1900px+; control width via `max-width`/measure instead.
- Sub-headings/badges/kickers stay generic — no doctor names or "20+ years" claims
  outside `h1`, paragraphs, list items, or the footer.
- Section padding: `64px 0`, not `100px 0` (avoids ~200px dead-space stacking).

## Colour & contrast (hard-bound, Section 7.1 of AGENTS.md)

- **60% neutral base / 30% brand colour / 10% accent** (accent strictly for CTAs and
  important links — never decorative fills).
- Dark charcoal text (`#0f172a`/`#333`), never pure black.
- Body text ≥16px, line-height 1.5–1.6×.
- **WCAG AA 4.5:1 contrast minimum** on every text/background pairing — verify before
  finalizing any brand/accent colour, especially text on coloured surfaces.
- Semantic colours fixed regardless of brand: green=success, red=error, blue=link.

## Layout, branding & interaction (AGENTS.md §11)

- **Container width:** don't cap the main container at 1280px — use 1440–1600px for a
  modern wide layout. Keep inner text blocks to a readable ~65–75ch measure regardless.
- **Alternating section backgrounds:** top-level sections should alternate (e.g.
  white/off-white ↔ light brand-colour tint) so the page reads as branded bands, not one
  flat surface — this is how the 60/30 split should actually show up visually.
- **Section `h2` headings:** always bold (600–700+) at the 32–38px scale — never
  regular/light weight.
- **Card headings vs. body:** the card's `h3`/`h4` must be visibly bold and larger than
  the paragraph/body text inside that same card.
- **Never nest a card inside a bigger card.** Sub-items inside a card get a divider
  (`border-top`/spacing/icon row), not their own bordered/shadowed mini-card.
- **Push 60-30-10 further than just CTAs:** use the 60% neutral / 30% brand colours
  generously across section backgrounds, card surfaces, headings, and dividers — 10%
  accent stays strictly on interactive elements. Avoid "mostly white + a couple of
  coloured buttons."
- **Stats animate as live counters:** any numeric stat counts up from 0/1 to its target
  when scrolled into view (IntersectionObserver + rAF/`setInterval` in
  `script/index.js`), triggers once, respects `prefers-reduced-motion` (jump straight to
  final value), and preserves suffixes (`+`, `%`, `k`).
- **Services grid is 3-per-row on 12 tracks** (`repeat(12, minmax(0, 1fr))`, cards
  `span 4`) — 2 per row at 1200px, 1 per row at 640px. An incomplete final row must be
  centered, which is *only* possible with the 12-track system; never go back to
  `repeat(3, 1fr)` + `grid-column: 1 / -1`. Copy the block from **AGENTS.md §12.1**
  verbatim, keep its rule order, and test with 4/5/6/7 cards — the leftover rules are
  dormant at 6 cards, so regressions are invisible there.

## About-section "Read More" toggle (AGENTS.md §13, mandatory)

- Any About-section bio long enough to plausibly exceed 7 lines gets a **Read
  More/Read Less** toggle — clip via `-webkit-line-clamp: 7` on a `.read-more-content`
  wrapper inside a `.read-more-wrap` container, with a `.read-more-btn` (chevron icon)
  after it.
- Copy the CSS and JS blocks from **AGENTS.md §13.2/§13.3 verbatim** — swap only the
  button/hover CSS variables to match the microsite's existing palette. The JS is a
  self-contained IIFE appended to the end of `script/index.js`; don't rewrite it.
- Button **auto-hides** if the bio already fits in 7 lines (`scrollHeight` vs
  `clientHeight` check) — always test with both a short and a long bio.
- Before adding: check for the `Read More toggle` CSS comment and `DigiDrReadMore` in
  JS — skip if already present, don't duplicate.

## Other standards

- Fully responsive 320px–1440px.
- No placeholder images — generate real ones.
- Every page: unique `<title>`, `<meta name="description">`, single `<h1>`, semantic
  HTML5.
- Internal links use relative paths (`blog.html`, `index.html#about`).
- Never delete a file without explicit user approval.
- Test every new/edited layout with long doctor names and long specialty text.

## Known gotchas (see AGENTS.md §9–10 for full detail)

- The global reset's `max-width: 100%` can collapse absolutely-positioned third-party
  widget panels (e.g. dropdowns) — override `max-width: none` on the specific widget
  class.
- `span { color: ... }` in the global reset beats *inherited* button text color —
  explicitly override `.btn-class span { color: #fff; }` whenever a button label is
  wrapped in a `<span>`. Verify with `getComputedStyle`, not just a screenshot.
- `.booking-field input { padding }` can collide with nested widget inputs (e.g. a
  search box with an icon) — override with a more specific selector.
- Phone input standard: **intl-tel-input v29.2.2** via jsDelivr CDN, `initialCountry:
  "in"`, validate with `iti.isValidNumber()` gated on `phoneUtilsReady`. Full name
  field: letters/spaces/apostrophes/hyphens only, sanitized live on input.

## Before finishing any styling/layout task

1. Confirm the Section 3 global CSS block is present (or add it).
2. Confirm 18px body text + AA contrast pass.
3. Confirm no `nowrap` on dynamic text, no fixed heights on cards, `min-width: 0` on
   flex/grid children, `flex-wrap: wrap` on social rows.
4. If touching a third-party widget or coloured button, verify computed styles.
