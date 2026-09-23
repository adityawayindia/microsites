# Microsite Parameterization Plan

Plan for converting every specialty template into a Mustache-style template, using
**only the placeholders that already exist in the live microsites**
(`live microsites/*` and `microsite-urology-* (live)`).

> Status: plan finalized, no files edited yet.
> **JavaScript is out of scope for now, with one exception: the stat counter (§4).**
> Apart from the counter, do not modify any `script/*.js` file until the backend
> team's actual code is available.

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
| `{{#services}}` | `icon`, `title`, `description` |
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
1. **`{{icon}}` is part of a class name:** `class="fa-solid {{icon}}"` in the services
   loop. Templates must keep exactly that pattern and load a Font Awesome version
   that has the icons the backend sends.
2. **`{{stars_html}}` is backend-generated HTML** inside
   `<div class="testimonial-stars" aria-label="{{rating}} out of 5 stars">`. Its
   classes aren't known (probably `<i class="fa-solid fa-star">`). Each template's
   CSS must style it. **To confirm with the backend team.**
3. **The live JS needs specific ids and classes.** This matters for the deferred
   JavaScript phase:
   - `index.js`: `#bookingForm`, `#bookingModal`, `#preferredDate`,
     `#testimonialsTrack`, `.testimonial-card`, `.faq-item`, `.read-more-*`,
     `.social:not(.is-disabled)`, `[data-cal-*]`, and others.
   - `banner-module.js`: `#digidrBannerImg` / `.digidr-banner-img`,
     `#digidrBannerLink`.
   - `chatbot.js`: `#chatbot-mount` and the `chatbot*` ids.

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
| 4 | Stat counters | Counter added to **all templates and live dhara-sharma** (see §4). **In scope now**; it is the only JavaScript change allowed. |
| 5 | Made-up social-media sections | **Comment out** `<section id="social-media">` in ENT-1, Neurology-1 and Pediatrician-1, plus any nav or footer links pointing to `#social-media`. Not worked on further for now. |
| 6 | Section kickers / small labels | Kept **as they are in each microsite** (no placeholder exists). |
| 7 | Facebook | Both flags kept: `hasFacebook` → `{{facebook}}` (profile), `hasFacebookPage` → `{{facebookpage}}` (page), each with its `no*` state. |
| 8 | Technology section | Kept as hardcoded content in **Intensivist-1 only**. Not added to any other microsite. |
| 9 | Swapped Facebook links in live sites | Fix the 4 swapped `href` values (see §3). |
| 10 | JavaScript | **Not touched for now**, except for the stat counter (§4). Everything else will be done once the backend team's code is available (see §5). |

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

## 4. Stat counters (in scope: the only JavaScript change allowed now)

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
- Do not touch the booking, analytics, banner or chatbot code, or any other script
  file (§5).
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

## 5. JavaScript: deferred until the backend code is available

What the repo shows, for reference only (**do not implement yet**):

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
  | `chatbot.js` | Different on every live site, probably per-doctor settings |
  | `auto-open-modal.js` | Present everywhere but **not loaded by any HTML page** |

Open questions for the backend team:
1. Is the repo copy of the live JS the same as what's deployed?
2. Does the backend add any scripts to the page when it renders it? For example, is
   that how `auto-open-modal.js` gets loaded?
3. What differs per site in `chatbot.js`?
4. Which request and response fields do the booking and analytics APIs require?

---

## 5a. WhatsApp link (to review tomorrow)

**Live sites:** every WhatsApp icon (42 across all live sites) uses
`href="{{whatsapp}}"` with no `https://wa.me/` prefix. So the backend sends the
**entire link**, not just the phone number. The icon is inside the
`{{#hasWhatsapp}}` / `{{#noWhatsapp}}` pair, like the other social icons.

**Templates:**
- 116 WhatsApp icons use `href="#"`.
- 4 in Cardiology-1 (`index.html`, `blog.html`, `blog-detail.html`) use a hardcoded
  `https://wa.me/<number>`.

**Planned rule:** match the live sites, replacing both kinds above:
```html
{{#hasWhatsapp}}<a href="{{whatsapp}}" …><i class="fa-brands fa-whatsapp"></i></a>{{/hasWhatsapp}}
{{#noWhatsapp}}<span class="… is-disabled" … data-tooltip="Not Enabled">…</span>{{/noWhatsapp}}
```

**Open question for the backend team:** is `{{whatsapp}}` a full link (e.g.
`https://wa.me/919876543210`) or only a number?
- **Full link:** keep `href="{{whatsapp}}"` (the current live pattern).
- **Number only:** both live sites and templates must use
  `href="https://wa.me/{{whatsapp}}"`, and the live WhatsApp links are currently
  broken.

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
- [ ] Services: title and subtitle pairs, cards become a `{{#services}}` loop.
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

**Do not touch:** `script/*.js`, except for the counter IIFE (see §4 and §5).
