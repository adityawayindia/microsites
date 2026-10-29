# Parameterization Log (this workspace)

Workspace history for the parameterization work: which templates have been converted,
what was found on the live sites, and how the reference code was verified. It was moved
out of [parameterization.md](parameterization.md) so that file is a generic playbook that
works without any specific template. Nothing here is needed to convert a microsite; it
records what happened in this repo. Section numbers in quotes (e.g. "§4b") refer to
parameterization.md.

---

## 1. Conversion status

> Status: plan finalized; conversion in progress — 19 of 31 templates done (see §0).

### Done (19)
| Template folder | Notes |
|---|---|
| `Ayurvedic/microsite-ayurvedic-1-param` | |
| `Ayurvedic/microsite-ayurvedic-2-param` | |
| `Cardiology/microsite-cardiology-1-param` | |
| `Gastroenterology/microsite-gastroenterology-1-param` | |
| `Gastroenterology/microsite-gastroenterology-2-param` | |
| `ENT/microsite-ent-2-param` | Done 2026-10-21. Built from ENT-2 (non-parameterized copy kept at `ENT/microsite-ent-2`). Booking/chatbot/analytics/counter JS taken from Radiology-2-param (ENT-2 had only the demo booking code); privacy/terms pages use the current Radiology-2-param legal text with ENT head/fonts/footer. Services use one fixed icon (`fa-head-side-cough`); stat tiles use `{{practising_since}}`, `{{languages_count}}`, `{{consultation_modes_count}}`; FAQ kept as is; About/Philosophy photos use the `microsite-ent-2` GCS folder; Facebook-posts carousel JS omitted (no social-media section). Added the shared disabled-social CSS and a `form?.` null guard on the consent line so `index.js` no longer throws on the legal pages. |
| `ENT/microsite-ent-3-param` | Done 2026-10-21. Same conversion as ENT-2-param (non-parameterized copy kept at `ENT/microsite-ent-3`): navy/rose theme, no About photo, rounded UI, dark photo hero. One fixed services icon (`fa-ear-listen`); the philosophy photo uses the byte-identical `microsite-ent-2` GCS copy (no `microsite-ent-3` bucket folder yet — upload one and repoint if wanted). Hero disabled-social CSS tuned for the dark hero. |
| `General Physician/microsite-general-physician-1-param-assigned` | Done 2026-09-29. Folder renamed to `-param`. Services tag pills dropped (loop is title + description only); philosophy image uses the byte-identical `microsite-general-medicine-1` bucket copy. |
| `General Physician/microsite-general-physician-2-param` | Done 2026-09-29. Same conversion as General Physician-1 (identical JS; blue-theme CSS). Folder renamed to `-param`. |
| `General Physician/microsite-general-physician-3-param` | Done 2026-10-21. New design (indigo / linen / pine palette, Fraunces + Figtree, arch portrait, clinic-photo journey band, split contact card), parameterized from the start; there is no non-parameterized copy. Booking/chatbot/analytics/counter JS, legal pages and the visitor counter come from ENT-2-param (head, fonts, favicon and footer retargeted). Services use one fixed icon (`fa-stethoscope`); stat tiles use `{{practising_since}}`, `{{languages_count}}`, `{{consultation_modes_count}}`; FAQ kept as written. The About and Philosophy photos and the Journey background (CSS) are linked to the local `assets/` folder at the owner's request (not the bucket convention in the Conventions list above — if served under `{{path}}` they must be reachable at `assets/…`, otherwise repoint to the bucket). Verified by rendering with Mustache (long name / all flags on, and short name / all flags off): no unresolved tags, balanced sections, no JS errors, no overflow at 320–1440px, fellowship line hides when empty, disabled-social tooltips work. Added `html, body { overflow-x: clip }` so the hidden tooltip of the last social icon cannot cause sideways scroll. |
| `Dentist/microsite-dentist-3-param` | Done 2026-10-26. New design (mint / pine / raspberry palette, Fraunces + Figtree, arch portrait, clinic-photo hero, rounded cards), parameterized from the non-parameterized copy kept at `Dentist/microsite-dentist-3`. Booking/chatbot/analytics/counter/banner JS and the legal-page body text come from General Physician-3-param; the legal pages keep this site's own head and footer. Services use one fixed icon (`fa-tooth`); stat tiles use `{{practising_since}}`, `{{languages_count}}`, `{{consultation_modes_count}}` (all with `data-counter`); FAQ kept as written; contact section has a `.js-book-trigger` Book Appointment button (opens the modal and is hidden with the other CTAs when no mode is available); the Facebook-posts carousel is kept. Added the disabled-social/tooltip CSS and `html, body { overflow-x: clip }`, the send-icon `currentColor` rule, and keyboard focus for the Online Consultation info note. The About/Philosophy photos and the hero background are linked to the local `assets/` folder (as in General Physician-3-param) rather than the bucket convention. Verified by rendering with Mustache (everything on / everything off, 60+ character name): no unresolved tags, balanced sections, no overflow at 320–1440px, fellowship and MCI lines hide when empty. |
| `Dentist/microsite-dentist-1-param` | Done 2026-10-26. Built from `Dentist/microsite-dentist-1` (non-parameterized copy kept). Booking/chatbot/analytics/counter/banner JS taken from ENT-2-param; the booking modal markup was updated to match it (report preview block, empty time-slot select, `data-city` etc.). Services use one fixed icon (`fa-tooth`); stat tiles use `{{practising_since}}`, `{{languages_count}}`, `{{consultation_modes_count}}` (all `data-counter`); FAQ kept as written. Hero social order is FB Profile, FB Page, Instagram, X, LinkedIn, Website, WhatsApp, YouTube with has/no pairs and tooltips in hero, footer and legal footers. About/Philosophy photos are not parameterized (the philosophy image is still the local `assets/philosophy-workspace.jpg`; no bucket folder exists yet). No social-media section, no contact Book button. Disabled-social/tooltip, upload-preview and booking-popup CSS appended. Verified by rendering with Mustache (everything on / everything off, long name): no unresolved tags. Not yet checked in a browser. |
| `General Medicine/microsite-general-medicine-1-param` | Done 2026-10-26. Built from `General Medicine/microsite-general-medicine-1` (non-parameterized copy kept) in its blue theme. Booking/chatbot/analytics/counter/banner JS and the booking-modal markup (upload preview, `data-city`, GA attributes) taken from Dentist-1-param; the hero stat counter regex and the `form?.` null guard keep `index.js` error-free on the legal pages. Services use one fixed icon (`fa-stethoscope`, tag pills dropped); stat tiles use `{{practising_since}}`, `{{languages_count}}`, `{{consultation_modes_count}}` (all `data-counter`); hero reg line is `Medical Regd. No.: {{mci}}` inside `{{#hasmic}}`; fellowship line comment-wrapped; FAQ and kickers kept as written. Hero social order is FB Profile, FB Page, Instagram, X, LinkedIn, Website, WhatsApp, YouTube with has/no pairs in hero, footer and legal footers; visitor badge + `#visitorCount` script added. About/Philosophy photos and the hero background stay on the local `assets/` folder (not the bucket convention); no social-media section, no contact-section Book button beyond the existing CTA. Appended the disabled-social/tooltip, upload-preview and booking-popup CSS, `html, body { overflow-x: clip }`, and wrap rules so long doctor names no longer overflow the header or h1. Verified by rendering with a small Mustache-style renderer (everything on / everything off, 60+ character name): no unresolved tags, balanced sections, no new console errors; checked in headless Chrome at 1400px and 375px (index) and 375px (privacy). Not checked: booking flow against the live API, the legal-page footers at 375px by eye. |
| `General Medicine/microsite-general-medicine-3-param` | Done 2026-10-26. New design (deep-ocean / leaf / coral palette, Bricolage Grotesque + Nunito Sans, doctor's-desk photo hero with ECG trace, four-across journey timeline), parameterized from the non-parameterized copy kept at `General Medicine/microsite-general-medicine-3`. Booking/chatbot/analytics/counter/banner JS, the legal-page body text and the visitor counter come from Dentist-3-param; the head, fonts, favicon and footer are retargeted. Services use one fixed icon (`fa-stethoscope`); stat tiles use `{{practising_since}}`, `{{languages_count}}`, `{{consultation_modes_count}}` (all `data-counter`); FAQ kept as written; contact section has a `.js-book-trigger` Book Appointment button; the Facebook-posts carousel is kept. Disabled-social/tooltip CSS (tuned for the dark hero), `html, body { overflow-x: clip }` and the send-icon `currentColor` rule added. The hero background (CSS) and the About/Philosophy photos are linked to the local `assets/` folder (as in Dentist-3-param), not the bucket convention. Verified by rendering with Mustache (everything on / everything off, 60+ character name): no unresolved tags, balanced sections, no overflow at 320–1900px on all three pages, fellowship and MCI lines hide when empty. |
| `Pediatrician/microsite-pediatrician-2-param` | |
| `Pediatrician/microsite-pediatrician-3-param` | Re-verified 2026-09-29 and fixed: hero Facebook Page disabled icon was gated on `noFacebook` (now `noFacebookPage`); footer + legal-page WhatsApp now `https://wa.me/91{{whatsapp}}`; MCI line colon; `{{awards}},{{education}}`; contact address in the §6 pattern; legal canonical/`og:url` without `.html`; disabled-social + tooltip CSS added (hero spans now carry `data-tooltip`). |
| `Pediatrician/microsite-pediatrician-4-param` | Re-verified 2026-09-29; same fixes as Pediatrician-3 (cloned markup). |
| `Radiology/microsite-radiology-1-param` | Calendar now honours `availableDays`; demo time slots removed (2026-09-25). Later changes: hero scan sweep over the portrait and the hero specialty badge removed; hero stat tiles/social buttons made opaque so the background scan line cannot show through; static "500" visitor badge removed and the live badge moved under the Legal links; "within 24 hours" and "same day" wording removed from fallbacks, taglines and FAQ; new `{{#hasFellowship}}{{fellowship}}` hero line. A non-parameterized copy exists at `Radiology/microsite-radiology-1`. |
| `Radiology/microsite-radiology-2-param` | Done 2026-10-16. Built from Radiology-1-param plus the Radiology-2 differences (fonts, light hero CSS, no About photo, shorter About fallback, philosophy photo). Disabled-social/tooltip CSS added. A non-parameterized copy exists at `Radiology/microsite-radiology-2`. |
| `Urologist/microsite-urology-1-param` | Done 2026-09-25. |
| `Urologist/microsite-urology-2-param` | Done 2026-09-25. Own hero layout (`uro-hero-*`); rest of the page matches Urology-1. |

### Not started (13)
Default Template, Dentist-2-assigned, ENT-1,
General Medicine-2-assigned, Homeopathy, Intensivist-1, Intensivist-2-assigned,
Neurology-1, Oncology-1-assigned, Oncology-2, Orthopedics-1,
Pediatrician-1-assigned, Pediatrician-5 (work pending).

---

## 2. How the placeholder vocabulary was checked

### Verification (checked with scripts)

**Completeness.** All 160 distinct placeholders used by the 6 live sites and the 2
`microsite-urology-* (live)` sites are documented above. None are missing and none
are extra.
- No other syntax is used: no `{{{ }}}`, `{{> }}`, `{{^ }}` or `{{! }}`.
- Only the HTML pages contain placeholders. The live JS, CSS, XML, TXT and JSON
  files contain none.
- "Complete" means complete compared with the live sites. The backend may support
  keys that no live site uses yet; confirm this with the backend team.


**`{{icon}}` history.**
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

**JSON-LD problem found on a live site:**
**Problem found:** the JSON-LD in `live microsites/dhara-sharma/index.html` has
`"image": "https://www.example.com/ent-1/{{profile}}"`. `{{profile}}` is already a
full URL (it's used as `<img src="{{profile}}">`), so this should be `"{{profile}}"`.

---

## 3. Decisions as originally recorded (with template names)

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

## 4. Live-site Facebook fix (HTML only, done)

The swap is **only in the hero social row of index.html**. The footer, privacy,
terms pages are already correct.

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

## 5. Stat counters: state before the rollout

### Current state
| Group | Microsites |
|---|---|
| Markup and JS present | ENT-1, ENT-2, Oncology-2, Pediatrician-5, Radiology-1, Urology-1, Urology-2 |
| Markup present, no JS | live dhara-sharma |
| Neither (stats as plain text) | all other templates |

**Current problem:** the existing JS counts up to the hardcoded `data-count-to` value
instead of the rendered text. So `{{experience}}` = 22 would display as "15+", and a
`data-suffix="k+"` would turn "20000" into "20000k+".

Counter checklist item for the live site:
- [ ] Live dhara-sharma: the same steps (markup and script).

---

## 6. Chatbot: live-site checks and rollout notes

**Checked against all 6 live sites (script-verified):** the code block below matches
every live `script/chatbot.js` line for line, apart from the `BOT_ICON` line.
The only other difference is whitespace: the blank line under
`/* ── Suggestion chips ── */` has 4 trailing spaces on samir-shah and none on the
others. Whitespace doesn't matter.

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

### `BOT_ICON` decision (history)
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

### Chatbot rollout checklist as run in this workspace
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
- [ ] **Send icon visible.** `chatbot.js` hardcodes `stroke="white"` on the send
      icon. If the template styles `.chatbot-send-btn` with a white background, add
      this to `styles/chatbot.css` (don't edit `chatbot.js`):
      `.chatbot-send-btn svg path { stroke: currentColor; }`. Added 2026-09-25 to
      Cardiology-1, Pediatrician-2/3/4, Radiology-1 and Urology-1/2. Ayurvedic-1/2
      and Gastroenterology-1/2 use a coloured button, so white is already correct.

---

## 7. Booking code: provenance and verification

**Checked against the live sites (script-verified, re-checked 2026-10-28 on all 8 live
`index.js` files):** every code line of the block below is in the `script/index.js` of the
live sites, including the consent-checkbox check. The only lines not found live are the 4
section labels (`//Available days section`, `// Appointment section`, `//Slots section`,
`//Patient appointment section`). The backend team added those to mark the pieces;
they're optional. **Correction (2026-10-28):** the block's submit handler now reads
`result?.data?.type ?? result?.type` and `result?.data?.meetLink ?? result?.meetLink`, as
the live sites do, because the API nests its reply under `data`; the earlier flat
`result?.type` / `result?.meetLink` lines were out of date. The complete code is in §4c. **The live sites need no booking changes. This rollout is for the
templates only.**

The rest of each live `index.js` differs from site to site (250–500 lines between any
two). This section covers only the booking pieces, not the whole file.

Where the 4 pieces sit in the reference live file (`live microsites/samiran-das/script/index.js`):

| Piece | Goes inside | samiran-das lines |
|---|---|---|
| 1. `loadAvailableDays` | `initDatePicker` IIFE, straight after `const doctorId = form.dataset.userid; let availableDays = null;`. Followed by `window.__onAppointmentTypeChange = loadAvailableDays; loadAvailableDays("offline");` | ~236–253 |
| 2. Appointment availability | Booking-modal IIFE, straight after the `doctorId` / `clinic*` / tab declarations and `let isOnlineAvailable`, `isOfflineAvailable`, `compressedFile` | ~615–681 |
| 3. Slots `change` handler | Booking-modal IIFE, after `preferredDateInput` / `preferredTimeSelect` are declared (~904–905) | ~1011–1053 |
| 4. `let isSubmitting` + submit handler | Booking-modal IIFE, after the slots handler | ~1056–1226 |

### Booking rollout checklist as run in this workspace
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
- [ ] **Verify the booking system after parameterization (mandatory).** Once the template
      is parameterized (placeholders in the HTML, `-param` folder), run the verification
      in §4c "Verify the booking system after parameterization" and record the result in
      the template's row in §0. Do not mark a template Done until it passes.
- [ ] **Live sites: nothing to do.** All 6 already contain every line.

### Comparison with the other live sites and verification record
**Checked against the other live sites (script-verified, 2026-10-28):**
- Lines 87–277 (phone plugin + `initDatePicker`) are byte-identical on samiran-das,
  Raj-kumar, anurag-choudhury, deepak-dabkara, samir-shah and dhara-sharma.
- The `Booking Modal & Form Validation` IIFE (samiran-das lines 477–1257) is identical on
  Raj-kumar, anurag-choudhury, deepak-dabkara and samir-shah except for analytics hooks:
  they call `window.trackEvent?.("consent_checkbox_click", { checked })` and
  `window.trackEvent?.("report_uploaded")` (samiran-das sends a `file_type` param instead),
  and samir-shah also defines `window.__trackBookingSuccess` inside the modal IIFE.
  On the other live sites `window.__trackBookingSuccess` is defined in a separate
  analytics block later in `index.js` (samiran-das line 1339, outside the code below), and
  the booking submit handler calls it as `window.__trackBookingSuccess?.(type)`. That
  analytics block is not part of this section (analytics is §5 / AGENTS.md §40). Keep the
  `?.` calls so the booking works when the hook is absent.
- nirav-rada and dr-ashok-s-gowda were not compared line by line (their `initDatePicker` /
  booking-modal blocks sit at different places in the file, or are absent); samiran-das is
  the reference.

**VERIFICATION STATUS — verified twice; the booking code below is working.**
This is the booking code from the live microsites. It was checked in two separate passes
on 2026-10-28, and both passed:
1. **Pass 1 — static check + mocked-API run, all 8 live microsites** (Raj-kumar,
   anurag-choudhury, deepak-dabkara, dhara-sharma, dr-ashok-s-gowda, nirav-rada,
   samir-shah, samiran-das): `node --check` syntax OK on every file; the four booking
   pieces compared against §4b (identical, apart from the `data` nesting fixed above);
   then each site's real `index.html` + `index.js` run in jsdom with a mocked `fetch`.
   Scenarios: clinic booking, online booking with a reply nested under `data`, consent
   unticked (request correctly blocked), online-only, clinic-only and neither mode offered.
   Result: no JavaScript errors, correct availability / slots / `patient_appointment`
   calls, correct confirmation popup.
2. **Pass 2 — real HTTP round trip.** The same code was run against a local server that
   decodes the request. The server received a `multipart/form-data` POST to
   `/api/Patient_Appointment/patient_appointment` with `DoctorId`, `FullName`, `Phone`,
   `Email`, `Date`, `Type`, `Day`, `SlotId`, `Time` and `Reason` (plus `Upload` when a
   report is attached), for both clinic and online bookings, and the page showed the right
   confirmation popup. No JavaScript errors.

**Limits of that verification:** the real DigiDr backend was not called (a test booking
would create a real appointment), so acceptance of the request by the live API is still
to be confirmed with one test booking on a staging backend or an agreed live doctor. The
phone library (intl-tel-input) was stubbed, and calendar clicks, file-picker dialogs and
layout were driven by script, not in a real browser.

**Known gap (all live sites):** no live `index.html` has a
`.booking-error[data-error-for="consentCheckbox"]` element, so the "Please provide consent
to proceed." message has nowhere to show. The booking is still blocked correctly; add that
error element to the markup if the message should be visible.

The §4c headings named their source lines in that file: (A) samiran-das lines 1–43, (B) lines
87–277, (C) lines 477–1257.

---

## 8. Live-site JavaScript survey (analytics, banner, auto-open-modal)

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

## 9. Visitor counter rollout status

Status (2026-09-25): present in all 11 parameterized templates. Radiology-1 and
Urology-1/2 were added last: badge at the top of `.footer-bottom-row`, placeholder
JS switched to the early-return guard.

Radiology-1 (updated): the badge now sits under the Privacy Policy / Terms of Service
links inside the Legal column (`.footer-links-group`), not in `.footer-bottom-row`. The
static "No. of Visitor: 500" duplicate was removed from `index.html` — only the live
`#visitorCount` badge remains.

---

## 10. WhatsApp link: live-site findings and rollout

**What was actually found on the 6 live sites (corrects this section's earlier,
wrong claim that all 42 live WhatsApp icons use `{{whatsapp}}`):** the live sites
are **internally inconsistent** between page types —
- `index.html` (hero + footer, all 6 sites, 12 icons): unconditional
  `href="https://wa.me/{{code}}{{phone}}"` — no `{{#hasWhatsapp}}`/`{{#noWhatsapp}}`
  gating at all, and built from the clinic phone, not a WhatsApp number. This is a
  bug matching the one found and fixed in the Ayurvedic-1 template (§6/checklist) —
  **still present on live sites, not yet fixed there.**
- `privacy-policy.html`, `terms-of-service.html`
  (all 6 sites, 30 icons): already `{{#hasWhatsapp}}<a href="{{whatsapp}}">…`,
  matching the "own field" decision above, but missing the `https://wa.me/` prefix
  now that `{{whatsapp}}` is confirmed to be a bare number — currently broken links.
- One stray `href="#"` on dhara-sharma's `index.html` (unclear whether that's a third
  inconsistency or a copy-paste leftover — not yet investigated).

**Rollout:**
- [x] Every template converted so far (Ayurvedic-1, Ayurvedic-2): `index.html`,
      `privacy-policy.html`, `terms-of-service.html` — WhatsApp icon wrapped in
      `{{#hasWhatsapp}}`/`{{#noWhatsapp}}`, `href="https://wa.me/91{{whatsapp}}"`. Apply the same rule to every template converted from here on.
- [x] Live sites (done 2026-09-24): all 6 `index.html` files fixed — dropped the
      unconditional `https://wa.me/{{code}}{{phone}}` construction (which also had
      no has/no gating), replaced with `{{#hasWhatsapp}}<a
      href="https://wa.me/91{{whatsapp}}">…{{/hasWhatsapp}}` +
      `{{#noWhatsapp}}<span …>…{{/noWhatsapp}}`, matching each site's own existing
      class names and `data-ga-label` style. All 6 sites' `privacy-policy.html` and
      `terms-of-service.html` got the `https://wa.me/91` prefix added.
- [x] dhara-sharma's `index.html` stray `href="#"` WhatsApp icon (line 242,
      investigated): it's inside an HTML comment (dead scaffold markup, never
      rendered), not a second live icon. No action needed.

---

## 11. Template-specific conversion items

**Template-specific**
- [ ] ENT-1, Neurology-1, Pediatrician-1: comment out `<section id="social-media">`
      and any `#social-media` links.
- [ ] Intensivist-1: keep the `technology` section and the "ICU Availability" /
      "Family Briefings" contact blocks hardcoded.
- [ ] ENT-1 / ENT-2: both sample doctor names in each ("Sarah Jenkins" plus "Anand" or
      "Khanna") become `Dr. {{full_name}}` outside the FAQ.
