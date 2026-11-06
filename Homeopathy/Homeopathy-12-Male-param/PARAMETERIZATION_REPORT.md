# Homeopathy-12-Male — Parameterization and Smoke-Test Report

**Run date:** 5 November 2026  
**Executed by:** ChatGPT, using source inspection, Python, Node.js and headless Chromium  
**Input build:** `Homeopathy-12-Male-Step2.zip`  
**Governing conversion document:** `parameterization(20261105-101144).md`  
**Output folder:** `Homeopathy-12-Male-param`

## Release decision

The parameterized source has been produced and its controlled tests passed. **Live production acceptance is not complete.** The retained Step 2 booking implementation is a documented exception to the playbook's byte-for-byte booking-code requirement and needs backend-owner approval. The shared chatbot is an exact copy of the latest playbook.

No real appointments were created and no confirmation emails were sent. Numeric doctor IDs, registration text, names and contact details used in QA are synthetic fixtures, not verified production configuration.

## Automated results

| Suite | Assertions | Passed | Failed |
|---|---:|---:|---:|
| Static and source checks | 184 | 184 | 0 |
| Main browser smoke suite | 692 | 692 | 0 |
| Interaction and grid regressions | 92 | 92 | 0 |
| Optional-field follow-up | 26 | 26 | 0 |
| Local HTTP multipart round trip | 3 | 3 | 0 |
| **Total** | **997** | **997** | **0** |

These counts are individual automated assertions, not 997 distinct user journeys or a claim that every production integration passed. The separately listed reference exception and unverified production checks are not counted as passes.

## Parameterization outcome

| Area | Outcome | Evidence |
|---|---|---|
| Naming | `-param` folder suffix applied | Output directory |
| Vocabulary | 139 used value/section keys checked against the supplied vocabulary and documented extra hero fields | `handoff/field-map.json`; static-results.json |
| Conditional coverage | All 79 used sections exercised as both truthy and falsy across fixtures | `field-map.json` branch coverage |
| Doctor and clinic identity | Name, specialty, biography, qualifications, registration, languages, clinic and contact values use placeholders | `index.html:14`; `index.html:423` |
| Registration and fellowship | Optional registration uses `hasmic`; fellowship uses comment-wrapped `hasFellowship` and the shared empty-value guard | `index.html:106`; `index.html:107` |
| Hero statistics | Text-driven shared counter; year normalization; suffix preservation; reduced-motion behavior | `script/index.js:79`; `script/index.js:980` |
| Section text | 25 title/subtitle/pillar/process fallback pairs; exact backend pillar-2 spellings | `index.html:238`; field-map.json |
| Services | `services` loop with `title`/`description`; fixed Homeopathy icon | `index.html:181` |
| Gallery | `images` loop; source image URL is configurable; lightbox hooks retained | `index.html:334` |
| Social links | Eight independent enabled/disabled pairs; correct Facebook profile/page mappings; independent India WhatsApp number | `index.html:116` |
| Banners | Optional whole-module section; desktop/mobile images, alt text and date window | `index.html:90` |
| Page paths | Slug-based public paths without `.html`; CSS/JS use `path` | `index.html:34`; `privacy-policy.html:13` |
| Static imagery | About/header/footer/philosophy imagery remains template-owned; only hero profile uses `profile` | `index.html:155`; static-results.json |
| Local asset resolution | Explicit page base plus `/slug/assets/*` deployment mapping; no unperformed GCS upload claimed | `index.html:4`; handoff README |
| Legal and SEO | Doctor/contact/effective-date fields and the six requested template files converted | Both legal pages, robots.txt, sitemap.xml, llms.txt |
| Visitor count | Exact supplied inline visitor script on all three pages; body microsite ID dynamic | `index.html:633` |
| FAQ | Byte-identical to corrected Step 2 | static-results.json |
| Shared chatbot | Byte-identical to §4a; API slug read from body; no suggestion-chip implementation added | `script/chatbot.js`; static-results.json |
| Protected scripts | `analytics.js`, `banner-module.js`, and non-scoped parts of `index.js` unchanged | SHA-256 manifest; protected-region comparison |
| Booking reference | **EXCEPTION:** existing Step 2 implementation retained, not the exact §4b/§4c block | `script/index.js:249`; exception section below |

Colors and fonts remain editable through the template's existing CSS tokens and font link. They are not invented per-doctor backend variables. FAQ content, small kickers, static imagery and banner destination are not expanded into unsupported Mustache keys.

## Render and responsive checks

Default, all-enabled, all-empty, partial-contact and long-content data were rendered on all three pages at **390 and 1440px**: 30 page/configuration/viewport cases. Each page was also checked at **320, 375, 768, 1024 and 1900px**: 15 additional cases.

The rendered text and serialized DOM were scanned for unresolved braces, including titles, metadata, attributes, image/link URLs, data attributes and JSON-LD. No stray placeholders were found in these test cases. All branches were also tested statically. Empty qualification/contact values were checked for orphan separators.

The checks found no horizontal page overflow, duplicate IDs or missing locally supplied image/CSS/JS resources in the tested states. Local photos were decoded, including lazy-loaded images. External resources were substituted as described below; this is not a blanket claim that every CDN or public URL was verified.

Service and gallery loops were tested with **4, 5, 6 and 7 items** at **320, 390, 900 and 1440px**, including last-row centering. Menu behavior, FAQ keyboard operation, Read More/Read Less, gallery keyboard navigation, disabled-social tooltips and social analytics hooks were rechecked.

## Appointment booking

Both clinic (`offline`) and online flows were exercised at **320, 390, 768 and 1440px**. Tests included opening, valid inputs, calendar selection, time slots, consent, review, editing, confirmation, success popup, dismissal and focus restoration.

The browser's real `fetch` and `FormData` implementation constructed the request. API calls were intercepted before reaching DigiDr, and their actual multipart bytes were decoded. Confirmed fields: `DoctorId`, `FullName`, `Phone`, `Email`, `Date`, `Type`, `Day`, `SlotId`, `Time`, `Reason`; `Upload` was checked when present.

The following additional branches passed:

- Required fields, malformed email/phone and short reason block progression; no consent blocks submission even when submit is triggered programmatically.
- The consent notice requires scrolling before agreement; closing without agreement leaves it unchecked and preserves entered details.
- Returned weekdays constrain the calendar; no working days or no slots prevents a booking; switching modes clears old date/slot selections and ignores late slot responses.
- Online-only and clinic-only configurations select and submit the correct mode; neither mode hides all booking CTAs.
- Review can be edited; no appointment POST is sent until Confirm; repeated confirm clicks send one POST.
- Clinic confirmation contains the rendered clinic address. Nested and top-level online response shapes work, including a present or absent `meetLink`.
- Conflict, malformed-success, wrong-type and HTTP-error responses do not show a false confirmation or emit a success event; the draft remains available.
- PDF upload is included in the multipart body; JPEG/PNG conversion to JPEG runs in the browser; invalid types and files exceeding 5 MB are rejected.
- Successful booking events occur once with the expected mode; the tested analytics payloads contain no entered patient name, phone, email, reason or report filename.

Positive phone tests used an explicitly documented validator stub. A separate missing-library test passed fail-closed behavior. **The actual intl-tel-input 29.2.2/libphonenumber rules and dropdown were not validated here.**

A separate Node.js `fetch` test sent real HTTP multipart requests to a local Python mock server in each mode. The receiver decoded all fields and an attached PDF. This verifies a local HTTP serialization round trip, not browser served-page navigation or live DigiDr acceptance.

## Banner, Facebook and chatbot

| Component | Passed in controlled testing | Not established |
|---|---|---|
| Banner | No-banner DOM removal; active display; mobile/desktop source selection; expired/future/invalid schedules; manual off; missing image configuration; inactive API response | Live campaign service and deployed asset hosting |
| Facebook | Two/seven input posts; five-card cap; date/video/hashtag filters; responsive dimensions; centering/arrows; paging without cloning; loading skeletons; API failure; seven-second timeout; SDK-unavailable fallback | Actual connected account data and live Facebook iframe rendering |
| Chatbot | Open/close; input; empty-send disabled; Enter and Shift+Enter; correct slug and multipart Message; all four reply fields; escaped display; fallback on error; welcome shown once; responsive layout and focus return | Live model replies, doctor-context accuracy, shared icon availability and real mobile keyboard behavior |
| Visitor count | The supplied inline code renders a controlled count on all pages | Registered live microsite count |
| Analytics | Local event hooks and tested booking/social events | GA4 collection, Clarity delivery, consent/masking configuration and dashboards |

The absence of quick-reply chips is intentional under the latest playbook. The delivered shared chatbot has no chip-rendering implementation. Backend-generated replies must obtain the correct doctor details from the slug; no client-side substitution of backend reply placeholders has been added.

## Corrections made during this conversion

1. Converted doctor content, loops, social states, section fallbacks, banner fields, form datasets, legal dates and public-page/SEO paths.
2. Replaced the local demonstration chatbot with the exact supplied API-backed shared widget and retained the existing responsive stylesheet.
3. Replaced the counter and year/fellowship logic with the supplied shared blocks.
4. Added the required `filePreview` hook around the existing upload preview without removing its Step 2 controls.
5. Preserved Step 2 booking safeguards, made online confirmation meetLink-aware, and cleared stale progress/error text when creating a new review.
6. Removed orphan punctuation when legal credentials are absent and omitted missing phone/email properties from JSON-LD.
7. Added safe context-aware sample rendering, long/empty/escaped data fixtures, a field map, input schema and a synthetic local preview server.

## Booking-code conformance exception

The playbook requests exact equality for four reference booking pieces. This build does **not** meet that equality requirement. Its existing reviewed Step 2 module was retained because replacing it would remove the review/edit step and protective behavior already delivered.

Retained behavior includes strict response/HTTP validation before confirmation, fail-closed phone and availability checks, a 30-day calendar limit, local-date weekday handling, safe DOM construction, stale-response protection, report validation and accessible overlays. The same documented endpoint family and multipart field vocabulary are used. The event layer retains the existing `clinic` analytics label for offline bookings.

This exception is visible in the handoff and must be approved by the backend owner. It must not be described as a line-for-line match or an unconditional playbook-compliance pass.

## Environment and limits

Normal browser navigation to the local served website was blocked with `ERR_BLOCKED_BY_ADMINISTRATOR`; CDN downloads from the container were unavailable. Browser tests therefore used isolated Chromium documents with intercepted resources and API responses.

Google Fonts were replaced by empty CSS, so screenshots use system fallback text fonts. Font Awesome **6.7.2** came from a locally installed package. The shared chatbot icon was substituted with a supplied local icon for layout testing. The actual shared image URL remains unchanged in the delivered script. No font files or test substitutes are included in production source.

Console capture includes parser-blocking `document.write` warnings produced by isolated page injection. Deliberate negative API/chat cases also emit expected request errors. Successful controlled flows recorded no uncaught JavaScript exceptions or console errors. Production console cleanliness, actual external resource loading and cross-page browser navigation still require staging checks.

No axe or Lighthouse score is reported. Real mobile keyboards, Safari behavior, live accessibility outcomes, actual email delivery, saved appointments and live account integrations remain unverified.

## Deployment acceptance gates

Provide verified doctor/clinic data, real `userid` and `micrositeId`, the actual slug and published assets. Confirm the three hero-stat fields and optional fellowship contract. Supply a genuine GA4 Measurement ID through the established deployment mechanism; no fake ID or unsupported placeholder was inserted. Review the booking-code exception, fixed template imagery, legal effective date and analytics masking.

Configure the local asset routing or migrate the fixed assets to a verified template bucket. Preserve the `-param` distinction in the repository, without renaming a bucket implicitly. Ensure production JSON-LD receives JSON-safe values. Merge the three SEO drafts using the shared domain-root process.

Complete explicitly authorized staging bookings for both offered modes, verify backend records and emails, and check the real phone widget, Google Fonts, Facebook embeds, shared chatbot icon, backend chat context, visitor count and analytics delivery before release.

## Evidence and reproduction

The QA evidence archive includes final result JSON, captured requests/console messages, final logs, screenshots, source comparison inputs and executable test scripts. `qa/README.md` documents the controlled substitutions and reproduction commands. `handoff/README.md` explains a safe preview that mocks DigiDr endpoints rather than creating real appointments.

Input ZIP SHA-256: `05a494b0adfabcc7ea3b92b7b9e4199121e02ce40f9a735e1d46b9827636c6bb`  
Playbook SHA-256: `f70833dbed3c5e7bcd7c7924e7ea9245f6c7940e6dc12c093c1d6080c07d0e44`
