# Microsite Parameterization Plan

Plan for converting every specialty template into a Mustache-style template, using
**only the placeholders that already exist in the live microsites**
(`live microsites/*` and `microsite-urology-* (live)`).

> Status: plan finalized; conversion in progress — 11 of 27 templates done (see §0).
> **JavaScript is out of scope for now, with three exceptions: the stat counter (§4),
> the chatbot widget (§4a), and the booking/appointment code (§4b).** Apart from
> those three, do not modify any `script/*.js` file until the backend team's actual
> code is available for the rest (analytics/banner — see §5).

---

## 0. Conversion status

**Naming convention:** once a template is fully parameterized, its folder gets the
suffix `-param` (e.g. `Urologist/microsite-urology-1` →
`Urologist/microsite-urology-1-param`). A folder without `-param` has not been
converted yet. Rename in the same commit that finishes the conversion.

The suffix is a **repo folder name only**. GCS asset URLs inside the pages
(`https://storage.googleapis.com/microsite_buck/microsite-urology-1/assets/…`) point
at the bucket folder, which is not renamed — leave those URLs unchanged.

### Done (11)
| Template folder | Notes |
|---|---|
| `Ayurvedic/microsite-ayurvedic-1-param` | |
| `Ayurvedic/microsite-ayurvedic-2-param` | |
| `Cardiology/microsite-cardiology-1-param` | |
| `Gastroenterology/microsite-gastroenterology-1-param` | |
| `Gastroenterology/microsite-gastroenterology-2-param` | |
| `Pediatrician/microsite-pediatrician-2-param` | |
| `Pediatrician/microsite-pediatrician-3-param` | |
| `Pediatrician/microsite-pediatrician-4-param` | |
| `Radiology/microsite-radiology-1-param` | Calendar now honours `availableDays`; demo time slots removed (2026-09-25). |
| `Urologist/microsite-urology-1-param` | Done 2026-09-25. |
| `Urologist/microsite-urology-2-param` | Done 2026-09-25. Own hero layout (`uro-hero-*`); rest of the page matches Urology-1. |

### Not started (16)
Default Template, Dentist-1, Dentist-2-assigned, ENT-1, ENT-2, General Medicine-1,
General Medicine-2-assigned, Homeopathy, Intensivist-1, Intensivist-2-assigned,
Neurology-1, Oncology-1-assigned, Oncology-2, Orthopedics-1,
Pediatrician-1-assigned, Pediatrician-5 (work pending).

### Conventions settled while converting (apply to every remaining template)
- **Calendar must use `availableDays`.** Piece 1 of §4b only loads the days; the
  date-picker `render()` must also disable days not in the set, as samiran-das does:
  `const isUnconfiguredDay = availableDays && availableDays.size > 0 && !availableDays.has(dayName);`
  then `if (cellDate < today || isUnconfiguredDay)`. Loading without this lets
  patients pick days the doctor doesn't work.
- **Remove demo `<option>`s from `#preferredTime`.** Keep only
  `<option value="">Select Time Slot</option>`; the slots API fills the rest. Demo
  values would otherwise be submitted as a `SlotId` if the slots call fails.
- **Template-owned images** (About/Philosophy photos, etc.) use the GCS bucket URL
  for that template, not relative `assets/` paths (which break under `{{path}}`
  serving). `{{path}}` stays for CSS/JS only.
- **Disabled-social CSS:** if a template has no `.is-disabled` / `data-tooltip`
  styling for social icons, add it (dim the icon glyph and surface, not the whole
  element, so the "Not Enabled" tooltip stays readable).
- **Hero MCI line:** `MCI Regd. No.: {{mci}}` inside `{{#hasmic}}`.
- **Blog pages:** stay commented out; not converted (only the nav link is wrapped in
  `{{#hasBlog}}`).
- **Verify each template** by rendering it with sample data (long name, `15+`,
  `20,000+`, some `has*`/`no*` flags each way, some `has_`/`no_` section texts each
  way) and checking no `{{…}}` is left and every section opens/closes in balance.

---

## 1. Placeholder vocabulary (160 total, union of all 6 live sites)

Syntax: `{{var}}` for values, `{{#flag}}…{{/flag}}` for sections that show or hide.

### Doctor
`full_name`, `speciality`, `specialist` (blog pages), `introduction`, `education`,
`awards`, `experience`, `totalpatient`, `languages`, `council`, `mci`, `profile`

- `experience` and `totalpatient` are **strings**, e.g. `15` or `15+`.
- Qualification line pattern: `{{awards}},{{education}}`.
- Registration: `{{#hasmic}}…MCI Regd. No.: {{mci}}…{{/hasmic}}`.

### Clinic and contact
`clinicname`, `address`, `city`, `district`, `state`, `pincode`, `phone`, `code`,
`email`, `whatsapp`, `website`

- Phone pattern: `<a href="tel:+{{code}}{{phone}}">+{{code}}-{{phone}}</a>`.

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
| `hasWhatsapp` / `noWhatsapp` | `{{whatsapp}}` | |

`has*` renders the `<a>` link. `no*` renders the disabled `<span>` ("Not Enabled"
tooltip). Used in the header, hero and footer of index, privacy, terms and the blog
pages.

### System
`slug`, `path`, `micrositeId`, `userid`, `date`

- `{{date}}`: "Effective Date" on privacy-policy.html and terms-of-service.html.
- `{{path}}`: prefix for script and style URLs.
- `<body data-micrositeid="{{micrositeId}}" data-slug="{{slug}}">`.
- The booking form carries `data-userid`, `data-address`, `data-clinicname`,
  `data-district`, `data-state` and `data-pincode`.

### Banner
`{{#has_banner}}` with `banner_src`, `banner_src_mobile`, `banner_alt`,
`banner_start`, `banner_end`

### Loops
| Loop | Fields |
|---|---|
| `{{#services}}` | `title`, `description` (see note below — `icon` dropped) |
| `{{#testimonials}}` | `patient_name`, `comment`, `profile_picture`, `rating`, `stars_html` |
| `{{#images}}` | `image` |
| `{{#blog}}` | `id`, `subject`, `blogimages`, `created` |
| `blogdetails` | `blogdetails.subject`, `blogdetails.body`, `blogdetails.blogimages`, `blogdetails.created` |

`title`, `description`, `rating`, `stars_html` and `profile_picture` are **loop
fields only**. They never appear outside their loop.

### Other flags
`{{#hasBlog}}` (Blog nav link), `{{#hasmic}}`, `{{#has_banner}}`

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
| Testimonials | `testimonial_title`, `testimonial_subtitle` |
| Gallery | `gallery_section_title`, `gallery_section_subtitle` |
| Contact | `contact_us_subtitle` |

> ⚠️ The pillar 2 keys are spelled `pillor_text_2` and `piller_subtext_2` in the
> backend. Copy them **exactly as spelled**; do not "fix" the spelling.

The fallback text is each template's current text for that element.

---

### Verification (checked with scripts)

**Completeness.** All 160 distinct placeholders used by the 6 live sites and the 2
`microsite-urology-* (live)` sites are documented above. None are missing and none
are extra.
- No other syntax is used: no `{{{ }}}`, `{{> }}`, `{{^ }}` or `{{! }}`.
- Only the HTML pages contain placeholders. The live JS, CSS, XML, TXT and JSON
  files contain none.
- "Complete" means complete compared with the live sites. The backend may support
  keys that no live site uses yet; confirm this with the backend team.

**Class-name compatibility.** Placeholders are plain text substitution, so they work
with any class name or HTML structure. No placeholder is used inside an `id`. The
exceptions:
1. **`{{icon}}` — dropped from the services loop (decision update).** The services
   loop used to receive a per-service `icon` field (`class="fa-solid {{icon}}"`),
   meaning the backend had to supply a matching Font Awesome class for every service
   row. **Changed:** every template now hardcodes one fixed Font Awesome icon for the
   whole Services section, chosen per specialty (e.g. Ayurvedic → `fa-leaf`,
   Dentist → `fa-tooth`, Cardiology → `fa-heart-pulse` — see the codebase's own
   specialty→icon mapping, not duplicated here). The `{{#services}}` loop is now
   `title` + `description` only. This means the backend team can add/remove services
   freely without ever supplying an icon — the template icon is fixed at build time,
   not sent per row. Confirmed and applied to Ayurvedic-1/2 (the only two templates
   that had already parameterized `{{icon}}`); the other templates were hardcoded
   per-card icons before this change and are now hardcoded to one shared icon
   instead, so no loop field was ever removed there.
2. **`{{stars_html}}` is backend-generated HTML** inside
   `<div class="testimonial-stars" aria-label="{{rating}} out of 5 stars">`. Its
   classes aren't known (probably `<i class="fa-solid fa-star">`). Each template's
   CSS must style it. **To confirm with the backend team.**
3. **The live JS needs specific ids and classes.** This matters for the JavaScript
   work (§4a, §4b now; the rest later, §5):
   - `index.js`: `#bookingForm`, `#bookingModal`, `#preferredDate`,
     `#preferredTime`, `#clinicVisitTab`, `#onlineConsultTab`, `.cta-btn`,
     `#testimonialsTrack`, `.testimonial-card`, `.faq-item`, `.read-more-*`,
     `.social:not(.is-disabled)`, `[data-cal-*]`, and others.
   - `banner-module.js`: `#digidrBannerImg` / `.digidr-banner-img`,
     `#digidrBannerLink`.
   - `chatbot.js`: needs no page markup except `<link id="chatbot-css">` (see §4a).
     It creates all its own `chatbot*` elements.

   Template markup must match these hooks once the JS is brought over.

**Problem found:** the JSON-LD in `live microsites/dhara-sharma/index.html` has
`"image": "https://www.example.com/ent-1/{{profile}}"`. `{{profile}}` is already a
full URL (it's used as `<img src="{{profile}}">`), so this should be `"{{profile}}"`.

---

## 2. Decisions

| # | Topic | Decision |
|---|---|---|
| 1 | Doctor name outside the FAQ | Every hardcoded name ("Dr. Arjun Mehta", "Dr. Mehta", "Dr. Kapoor", …) becomes `Dr. {{full_name}}`, matching the live sites. There is no surname placeholder. |
| 2 | FAQ section | **Left exactly as it is** in each specialty template, hardcoded names included. The real questions and answers will be provided later. |
| 3 | Third hero stat | Stays **hardcoded per microsite** (e.g. 98%, 24h, 97%). |
| 4 | Stat counters | Counter added to **all templates and live dhara-sharma** (see §4). **In scope now.** |
| 5 | Made-up social-media sections | **Comment out** `<section id="social-media">` in ENT-1, Neurology-1 and Pediatrician-1, plus any nav or footer links pointing to `#social-media`. Not worked on further for now. |
| 6 | Section kickers / small labels | Kept **as they are in each microsite** (no placeholder exists). |
| 7 | Facebook | Both flags kept: `hasFacebook` → `{{facebook}}` (profile), `hasFacebookPage` → `{{facebookpage}}` (page), each with its `no*` state. |
| 8 | Technology section | Kept as hardcoded content in **Intensivist-1 only**. Not added to any other microsite. |
| 9 | Swapped Facebook links in live sites | Fix the 4 swapped `href` values (see §3). |
| 10 | JavaScript | Only three JS changes are in scope now: the stat counter (§4), `chatbot.js` (§4a) and the booking code in `index.js` (§4b). Analytics, banner and `auto-open-modal.js` wait for the backend team (§5). |
| 11 | `chatbot.js` `BOT_ICON` | Hardcoded literal, **not** a placeholder. One shared URL (`.../microsite-ent-1/assets/chatbot-icon.svg`) across all 21 non-live templates — no longer per-template GCS folder. Live sites unchanged, still per-site. |
| 12 | Live sites and the JS | The 6 live sites already match §4a and §4b exactly. Only the stat counter (§4) changes live JS, and only on dhara-sharma. |
| 13 | Services `{{icon}}` | Dropped from the `{{#services}}` loop. One fixed Font Awesome icon per specialty, hardcoded in the template — not sent per service by the backend. Loop is now `title` + `description` only. |

---

## 3. Live-site Facebook fix (HTML only)

The swap is **only in the hero social row of index.html**. The footer, privacy,
terms, blog and blog-detail pages are already correct.

| File | Line | Flag | Current href | Change to |
|---|---|---|---|---|
| `live microsites/samir-shah/index.html` | 193 | `hasFacebookPage` | `{{facebook}}` | `{{facebookpage}}` |
| `live microsites/samir-shah/index.html` | 196 | `hasFacebook` | `{{facebookpage}}` | `{{facebook}}` |
| `live microsites/samiran-das/index.html` | 218 | `hasFacebookPage` | `{{facebook}}` | `{{facebookpage}}` |
| `live microsites/samiran-das/index.html` | 221 | `hasFacebook` | `{{facebookpage}}` | `{{facebook}}` |

Change only the href values. The flags, aria-labels, tooltips, icons, GA attributes
and `no*` states on those lines are already correct. After the fix, re-check that
every Facebook link on both sites maps `hasFacebookPage` → `{{facebookpage}}` and
`hasFacebook` → `{{facebook}}`.

---

## 4. Stat counters (in scope)

### Current state
| Group | Microsites |
|---|---|
| Markup and JS present | ENT-1, ENT-2, Oncology-2, Pediatrician-5, Radiology-1, Urology-1, Urology-2 |
| Markup present, no JS | live dhara-sharma |
| Neither (stats as plain text) | all other templates |

**Current problem:** the existing JS counts up to the hardcoded `data-count-to` value
instead of the rendered text. So `{{experience}}` = 22 would display as "15+", and a
`data-suffix="k+"` would turn "20000" into "20000k+".

### Planned approach
1. One shared counter script (a self-contained IIFE) in each site's
   `script/index.js`. It replaces the old counter in the 7 templates that have one,
   rather than duplicating it.
2. Each stat number element gets a `data-counter` hook, whatever its class name.
3. The target comes from the element's **own text**:
   - `15` → 15 → "15"
   - `15+` → 15 → "15+"
   - `20k+` → 20 → "20k+"
   - `20,000+` → 20000 → "20,000+" (commas kept)
   - Text that doesn't start with a number is left untouched.
4. The real value is in the HTML first, so it shows without JavaScript. The script
   sets it to 0 only once the counter is set up, then counts up when the stat
   scrolls into view. It runs once. With `prefers-reduced-motion`, it jumps straight
   to the final value.
5. The hardcoded third stat uses the same mechanism. Remove `data-count-to` and
   `data-suffix` everywhere.
6. dhara-sharma: remove `data-count-to="15"` / `"20"`, add `data-counter`, add the
   script.
7. Hardcoded experience or patient numbers in templates ("12+ Years", "8k+ Children
   Treated") become `{{experience}}` / `{{totalpatient}}`. The label text stays per
   microsite.

### Rules for the counter JavaScript
- Add the counter as a self-contained IIFE **appended to the end** of
  `script/index.js`, marked with a comment (e.g. `// DigiDr Stat Counter`). Check
  for that marker first, so it is never added twice.
- In the 7 templates with the old counter, remove only the old
  `// Animated Stat Counters` IIFE. Change nothing else in the file.
- Do not touch the analytics or banner code, or any other script file (§5). (Booking
  and `chatbot.js` are handled separately — §4b and §4a — since they're now also in
  scope, but are distinct files/tasks from the counter.)
- Test with `15`, `15+`, `20k+`, `20,000+`, an empty value and a non-numeric value,
  and with reduced motion turned on.

### Counter checklist (per microsite)
- [ ] Stat numbers: `{{experience}}` / `{{totalpatient}}` plus the hardcoded third
      stat, each with `data-counter`.
- [ ] Remove `data-count-to` and `data-suffix`.
- [ ] Remove the old counter IIFE, if present.
- [ ] Append the shared counter IIFE, if its marker isn't already there.
- [ ] Live dhara-sharma: the same steps (markup and script).

---

## 4a. Chatbot widget (in scope: promoted from §5, confirmed with the backend team)

The backend team provided the actual `chatbot.js`. It is **in scope now**, alongside
the stat counter (§4) and the booking code (§4b).

**Checked against all 6 live sites (script-verified):** the code block below matches
every live `script/chatbot.js` line for line, apart from the `BOT_ICON` line.
The only other difference is whitespace: the blank line under
`/* ── Suggestion chips ── */` has 4 trailing spaces on samir-shah and none on the
others. Whitespace doesn't matter.

### What's confirmed
- **Only `BOT_ICON` differs per site.** `BOT_NAME` (`'Assistant'`), `API_BASE`,
  `WELCOME_MSG` and all logic are the same on every live site. `BOT_ICON` points at
  the chatbot icon in the GCS folder of the **template the site was built from**:

  | Live site | `BOT_ICON` folder |
  |---|---|
  | Raj-kumar | `microsite-intensivist-2` |
  | anurag-choudhury | `microsite-general-medicine-1` |
  | deepak-dabkara | `microsite-oncology-1` |
  | dhara-sharma | `microsite-ent-1` |
  | samir-shah | `microsite-pediatrician-1` |
  | samiran-das | `microsite-dentist-2` |

- **Structure:** a self-contained IIFE. Its `injectCSS()` adds
  `<link id="chatbot-css" href="./styles/chatbot.css">` **only if no element with id
  `chatbot-css` exists yet**. It builds the widget as an HTML string and puts it in
  place of a `#chatbot-mount` element if one exists; otherwise it appends it to the
  end of `<body>`.
- **How the live pages actually use it (verified on all 5 pages of all 6 sites):**
  - Every page links the stylesheet itself, in `<head>`:
    `<link rel="stylesheet" href="{{path}}/styles/chatbot.css" id="chatbot-css" />`.
    Because the `id` is already there, `injectCSS()` does nothing. **This link is
    required**: `injectCSS()` uses `./styles/chatbot.css`, which ignores `{{path}}`
    and would point to the wrong place once the backend serves the page.
  - Every page loads the script at the end of `<body>`:
    `<script src="{{path}}/script/chatbot.js" defer></script>`.
  - **No live page has a `#chatbot-mount` element.** The widget is always appended
    to `<body>`. Don't add a mount element.
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
  empty in every live site. **Decision: implement the file exactly as confirmed,
  including this gap** — do not add chip-rendering code that doesn't exist live.
  Still confirm with the backend team (open question 5 below) whether this is an
  intentional disable or a future feature, but that answer does not block rolling out
  this file as-is now.
- **Icon comment quirk:** the close button's icon comment says *"This microsite loads
  Font Awesome, not Material Symbols"* — a leftover per-site authoring note baked into
  the shared script; harmless (the icon markup itself, `fa-solid fa-xmark`, is
  consistent) and kept as-is since every template already loads Font Awesome.

### Decision (updated): `BOT_ICON` is now one shared URL across all templates
Superseded the original per-template-GCS-folder convention below. The backend team
confirmed a single shared icon asset for all templates:
`https://storage.googleapis.com/microsite_buck/microsite-ent-1/assets/chatbot-icon.svg`
(hosted under the `microsite-ent-1` folder, but used by every template regardless of
its own specialty/folder — it is not swapped per template anymore).

Still a hardcoded literal, not a `{{placeholder}}` — every template's
`script/chatbot.js` has this exact same `BOT_ICON` line now, verbatim, with no
per-template substitution needed. `BOT_NAME`, `API_BASE`, and `WELCOME_MSG` are also
literals (not placeholders), copied verbatim from the code below.

**Live sites are unchanged and out of scope for this update.** The 6 live sites (table
above) and the two `(live)` urology folders still use their own existing per-site GCS
`BOT_ICON` paths (e.g. `microsite-ayurvedic-1`, `microsite-dentist-2`, etc.) — those
were deliberately left alone, not migrated to the shared URL. Only the 21 non-live
templates (all specialty folders + `Default Template`) were switched to the shared
URL.

### Exact code to implement in every microsite's `script/chatbot.js`

Copy verbatim, including the `BOT_ICON` line — it is now identical across every
template, nothing to swap per microsite.

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

### Required markup (all 5 pages of every template, copied from the live sites)
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
- Font Awesome must be loaded (for `fa-solid fa-xmark`). Every template already
  loads it.
- **No `#chatbot-mount` element.** No live page has one.

### Chatbot rollout checklist (per template)
- [x] `script/chatbot.js` = the exact code above, `BOT_ICON` set to the shared URL
      (`.../microsite-ent-1/assets/chatbot-icon.svg`) — same on every template, no
      per-template substitution needed. **Correction (2026-09-25):** this was
      marked done for all 21 non-live templates, but Urology-1/2 still had the old
      demo `chatbot.js` until their conversion. Check the file on every template
      as part of its conversion rather than assuming it's done.
- [ ] `styles/chatbot.css` exists (copy it from a live site if the template has
      none; don't redesign it).
- [ ] The `chatbot-css` link in `<head>` and the `chatbot.js` script tag at the end
      of `<body>` on all 5 pages, both with `{{path}}`.
- [ ] `<body data-slug="{{slug}}">` is present.
- [ ] No suggestion-chip code added. Ship the file as it is.
- [ ] **Live sites: nothing to do.** All 6 already match this section exactly.

---

## 4b. Booking/appointment code (in scope: promoted from §5, confirmed with the backend team)

The backend team provided the actual booking/appointment JS. It is **in scope now**,
alongside the stat counter (§4) and the chatbot widget (§4a).

**Checked against all 6 live sites (script-verified):** every code line of the block
below is already in the `script/index.js` of all 6 live sites, including the
consent-checkbox check. The only lines not found live are the 4 section labels
(`//Available days section`, `// Appointment section`, `//Slots section`,
`//Patient appointment section`). The backend team added those to mark the pieces;
they're optional. **The live sites need no booking changes. This rollout is for the
templates only.**

The rest of each live `index.js` differs from site to site (250–500 lines between any
two). This section covers only the booking pieces, not the whole file.

### Where this code goes: 4 pieces, not one block
Unlike `chatbot.js` (§4a), this is **not a self-contained file or IIFE**. Don't paste
it as one top-level block. The 4 pieces sit in two IIFEs in `script/index.js`
(line numbers from `live microsites/samiran-das/script/index.js`, the reference file):

| Piece | Goes inside | samiran-das lines |
|---|---|---|
| 1. `loadAvailableDays` | `initDatePicker` IIFE, straight after `const doctorId = form.dataset.userid; let availableDays = null;`. Followed by `window.__onAppointmentTypeChange = loadAvailableDays; loadAvailableDays("offline");` | ~236–253 |
| 2. Appointment availability | Booking-modal IIFE, straight after the `doctorId` / `clinic*` / tab declarations and `let isOnlineAvailable`, `isOfflineAvailable`, `compressedFile` | ~615–681 |
| 3. Slots `change` handler | Booking-modal IIFE, after `preferredDateInput` / `preferredTimeSelect` are declared (~904–905) | ~1011–1053 |
| 4. `let isSubmitting` + submit handler | Booking-modal IIFE, after the slots handler | ~1056–1226 |

The pieces use variables and functions the two IIFEs declare themselves: `form`,
`doctorId`, `availableDays`, `render()`, `clinicName`, `clinicAddress`,
`clinicDistrict`, `clinicState`, `clinicPincode`, `clinicTab`, `onlineTab`,
`isOnlineAvailable`, `isOfflineAvailable`, `appointmentType`, `setActiveTab()`,
`preferredDateInput`, `preferredTimeSelect`, `submitBtn`, `filePreviewDiv`,
`bookingLoader`, `iti`, `phoneUtilsReady`, `compressedFile`, `showError()`,
`clearErrors()`, `validateEmail()`, `validateDateNotPast()`, `showPopup()`,
`closeModal()`, plus the top-level `API_BASE`. For a template with no booking
integration, copy the whole date-picker and booking-modal IIFEs from samiran-das
(they include all of these), then compare the 4 pieces against the block below.

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
consent. All 6 live sites already have it. Every template must have it too.

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

            const appointmentTypeResult = result?.type;
            const addressMessage = result?.message;

            if (appointmentTypeResult === "online") {
                const meetLink = result?.meetLink;
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
      variable and function listed above. The 26 templates with no booking
      integration copy both IIFEs from samiran-das.
- [ ] The 4 pieces are in the places given in the table above and match the code
      block line for line (the 4 section-label comments are optional).
- [ ] The `if (!consentGiven)` check is present.
- [ ] The booking form has `data-userid`, `data-clinicname`, `data-address`,
      `data-district`, `data-state` and `data-pincode` (§1 "System"). All 6 live
      sites have these.
- [ ] Cardiology-1: it already has part of this (no `getavailabledays`, no
      booking-form data attributes, see §5). Add only what's missing.
- [ ] Don't touch analytics or banner code (still deferred, §5). Chatbot is its own
      file (§4a).
- [ ] **Live sites: nothing to do.** All 6 already contain every line.

---

## 5. JavaScript: analytics, banner and auto-open-modal (deferred)

What the repo shows. The booking and chatbot parts are now in §4b and §4a. Everything
else here is reference only (**do not implement yet**):

- All 6 live `index.js` files share the same backend integration:
  - `API_BASE = "https://digidrapi.digidr.app"`
  - Booking: `api/Patient_Appointment/getavailabledays`, `getslots`,
    `getappointment`, `patient_appointment`
  - Analytics: `api/MicrositeAnalytics/analytics/track`
  - Reads `data-userid`, `data-clinicname`, `data-address`, `data-district`,
    `data-state`, `data-pincode` (booking form) and `data-micrositeid` (`<body>`).
- 26 of 27 template `index.js` files have **none** of this. Cardiology-1 has part of
  it (missing `getavailabledays` and the booking-form data attributes).
- Other live script files:
  | File | Notes |
  |---|---|
  | `analytics.js` | 3 versions across the live sites |
  | `banner-module.js` | Identical on 5 live sites; dhara-sharma's matches the template |
  | `chatbot.js` | Confirmed identical on every live site except `BOT_ICON` — now in scope, see §4a |
  | `auto-open-modal.js` | Present everywhere but **not loaded by any HTML page** |

**Booking/appointment code:** promoted to in-scope — see §4b. **Chatbot:** promoted
to in-scope — see §4a.

**Still not covered:** `MicrositeAnalytics/analytics/track`, `banner-module.js`, and
`auto-open-modal.js` — the open questions below about those still stand.

Open questions for the backend team:
1. Is the repo copy of the live JS the same as what's deployed? *(For booking and
   `chatbot.js`, the backend team's code matches the repo copy on all 6 live sites.
   Still open for analytics, banner and auto-open-modal.)*
2. Does the backend add any scripts to the page when it renders it? For example, is
   that how `auto-open-modal.js` gets loaded?
3. ~~What differs per site in `chatbot.js`?~~ **Answered — see §4a:** only `BOT_ICON`
   (a per-microsite asset URL). Everything else — including the incomplete
   suggestion-chip wiring — is identical across all 6 live sites.
4. Which request and response fields do the booking and analytics APIs require?
   *(Answered for booking — see §4b; answered for chat (`api/MicrositeChat?slug=`,
   `FormData.Message` → `{reply|message|answer|response}`) — see §4a; analytics still
   open.)*
5. Is the empty "Suggestion chips" section in `chatbot.js` an intentional disable or
   an unfinished feature to complete later? (See §4a.)
6. ~~Does the live `index.js` already have the consent-checkbox fix?~~ **Answered:**
   yes, on all 6 live sites (see §4b).

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

**What was actually found on the 6 live sites (corrects this section's earlier,
wrong claim that all 42 live WhatsApp icons use `{{whatsapp}}`):** the live sites
are **internally inconsistent** between page types —
- `index.html` (hero + footer, all 6 sites, 12 icons): unconditional
  `href="https://wa.me/{{code}}{{phone}}"` — no `{{#hasWhatsapp}}`/`{{#noWhatsapp}}`
  gating at all, and built from the clinic phone, not a WhatsApp number. This is a
  bug matching the one found and fixed in the Ayurvedic-1 template (§6/checklist) —
  **still present on live sites, not yet fixed there.**
- `privacy-policy.html`, `terms-of-service.html`, `blog.html`, `blog-detail.html`
  (all 6 sites, 30 icons): already `{{#hasWhatsapp}}<a href="{{whatsapp}}">…`,
  matching the "own field" decision above, but missing the `https://wa.me/` prefix
  now that `{{whatsapp}}` is confirmed to be a bare number — currently broken links.
- One stray `href="#"` on dhara-sharma's `index.html` (unclear whether that's a third
  inconsistency or a copy-paste leftover — not yet investigated).

**Rollout:**
- [x] Every template converted so far (Ayurvedic-1, Ayurvedic-2): `index.html`,
      `privacy-policy.html`, `terms-of-service.html` — WhatsApp icon wrapped in
      `{{#hasWhatsapp}}`/`{{#noWhatsapp}}`, `href="https://wa.me/91{{whatsapp}}"`.
      Blog pages are out of scope (disabled, see the blog-pages decision). Apply the
      same rule to every template converted from here on.
- [x] Live sites (done 2026-09-24): all 6 `index.html` files fixed — dropped the
      unconditional `https://wa.me/{{code}}{{phone}}` construction (which also had
      no has/no gating), replaced with `{{#hasWhatsapp}}<a
      href="https://wa.me/91{{whatsapp}}">…{{/hasWhatsapp}}` +
      `{{#noWhatsapp}}<span …>…{{/noWhatsapp}}`, matching each site's own existing
      class names and `data-ga-label` style. All 6 sites' `privacy-policy.html` and
      `terms-of-service.html`, plus 5 of 6 sites' `blog.html`/`blog-detail.html`
      (already `{{#hasWhatsapp}}<a href="{{whatsapp}}">`), got the `https://wa.me/91`
      prefix added.
- [ ] **dhara-sharma's `blog.html`/`blog-detail.html`: not fixed, needs separate
      work.** Every social icon on these two pages (all 8, not just WhatsApp) is
      hardcoded `href="#"` with no `{{#has*}}`/`{{#no*}}` gating at all — the whole
      footer social row on those two pages was never parameterized, unlike every
      other page on every other live site. Out of scope for this WhatsApp fix since
      it's not WhatsApp-specific; needs its own pass matching the rest of that
      site's markup.
- [x] dhara-sharma's `index.html` stray `href="#"` WhatsApp icon (line 242,
      investigated): it's inside an HTML comment (dead scaffold markup, never
      rendered), not a second live icon. No action needed.

---

## 6. Per-template conversion checklist (HTML only)

For each `<Specialty>/microsite-*/` folder:

**All pages**
- [ ] Replace every hardcoded doctor name **outside the FAQ** with `Dr. {{full_name}}`.
- [ ] Replace the specialty display text with `{{speciality}}` (blog pages:
      `{{specialist}}`).
- [ ] Header, hero and footer social rows: all 8 `has*` / `no*` pairs, with the
      correct Facebook mapping.
- [ ] `{{#hasBlog}}` around the Blog nav link.

**index.html**
- [ ] Hero: `{{profile}}`, `{{awards}},{{education}}`, `{{#hasmic}}{{mci}}`,
      `{{languages}}`, `{{experience}}`, `{{totalpatient}}`. The third stat stays
      hardcoded.
- [ ] Banner block wrapped in `{{#has_banner}}` with the banner fields.
- [ ] About: title and subtitle has_/no_ pairs, `{{introduction}}`.
- [ ] Services: title and subtitle pairs, cards become a `{{#services}}` loop
      (`title` + `description` only — no `{{icon}}` field; icon is one fixed
      Font Awesome class per specialty, hardcoded in the template markup).
- [ ] Philosophy: title, subtitle and 3 pillar pairs (keep the backend spellings).
- [ ] Process: title, subtitle and 4 step pairs.
- [ ] Contact: `contact_us_subtitle` pair, `{{clinicname}}`, `{{address}}`,
      `{{district}}, {{state}} - {{pincode}}`, `+{{code}}-{{phone}}`, `{{email}}`.
- [ ] Testimonials: title and subtitle pairs, cards become a `{{#testimonials}}` loop.
- [ ] Gallery: title and subtitle pairs, images become an `{{#images}}` loop.
- [ ] FAQ: **leave unchanged.**
- [ ] Kickers: leave unchanged.
- [ ] `<body data-micrositeid="{{micrositeId}}" data-slug="{{slug}}">` and the booking
      form data attributes.
- [ ] Script and style URLs prefixed with `{{path}}`.

**privacy-policy.html / terms-of-service.html**
- [ ] Effective Date → `{{date}}` (currently "1 June 2026" or "[Insert Date]").
- [ ] Doctor name, contact details and social rows as above.

**Template-specific**
- [ ] ENT-1, Neurology-1, Pediatrician-1: comment out `<section id="social-media">`
      and any `#social-media` links.
- [ ] Intensivist-1: keep the `technology` section and the "ICU Availability" /
      "Family Briefings" contact blocks hardcoded.
- [ ] ENT-1 / ENT-2: both sample doctor names in each ("Sarah Jenkins" plus "Anand" or
      "Khanna") become `Dr. {{full_name}}` outside the FAQ.

**Counter:** complete the counter checklist in §4.

**Chatbot:** complete the chatbot rollout checklist in §4a.

**Booking:** complete the booking rollout checklist in §4b.

**Do not touch:** `script/*.js`, except for the counter IIFE (§4), `chatbot.js`
(§4a), and the booking-modal splice (§4b) — analytics, banner, and
`auto-open-modal.js` stay deferred (§5).
