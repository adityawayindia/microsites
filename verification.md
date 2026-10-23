# Microsite Verification Prompt

Use this after generating a microsite (from ENT-2 + AGENTS.md). Paste the prompt below into
the agent and replace `<PATH>` with the new microsite folder.

---

You have just generated the microsite at `<PATH>`. Audit it against the checklist below,
using the ENT-2 microsite as the reference (`ENT/microsite-ent-2`), AGENTS.md and CLAUDE.md.

**The design may differ slightly from ENT-2, but the required elements must remain.** Do not fail
a microsite for small visual differences (layout details, spacing, imagery, section styling,
wording). Fail it when a required element, section, behaviour or event is missing or broken: any
item in this checklist that isn't marked as allowed to vary.

**The site must be fully mobile-responsive.** Every page (index, privacy-policy, terms-of-service)
and every element (header and menu, hero, all sections, booking modal, consent panel, chatbot,
footer) must work from 320px to 1440px+ on phones, tablets and desktops. There must be no
horizontal scroll, clipped or overlapping content, or unreadable text, and tap targets must be at
least 44px. Check this throughout the audit, not only in section N.

## RULES FOR THE AUDIT

- Verify by reading the actual files (index.html, privacy-policy.html, terms-of-service.html,
  styles/style.css, script/index.js). Use grep and diffs. Do not rely on memory of what you wrote.
- For every item, record PASS or FAIL with file:line evidence.
- For anything that needs runtime behaviour (modal flow, tooltip, chatbot layout, URL hash),
  open the page in a browser at 1440px, 768px and 375px and test it. If you can't, mark the item
  "UNVERIFIED (needs browser)". Never mark it PASS. Do the browser-only items last.
- Fix every FAIL, then re-verify. Where ENT-2 is the reference, copy its structure, markup and
  text, changing only doctor-specific data.
- Do not commit or push unless told to.
- **Sections with their own design:** Care Philosophy, Consultation Journey and any other section the
  new microsite deliberately designs differently (layout, imagery, wording) are static, fixed content.
  They may look different from ENT-2 and must not be flagged as a mismatch with it. For these
  sections, check only that they are present, in the correct order, responsive, accessible, readable
  (AA contrast, 18px body text), consistent with the specialty and the rest of the checklist, and
  free of leftover ENT-2 or other-specialty wording and of overflow.
- **Default design (when no new design is made):** if the microsite does not give Care Philosophy,
  Consultation Journey or FAQ a new design, they must use the ENT-2 design below, with only the wording
  changed to fit the specialty.
  - *Care Philosophy* (`section.philosophy-section#philosophy`): a split-screen layout inside
    `.container.philosophy-layout`. The left side (`.philosophy-visual`) has a framed photo
    (`.philosophy-img-frame`, lazy-loaded, descriptive alt text) with a small badge on it
    (`.philosophy-badge`: round icon, bold line, short second line). The right side
    (`.philosophy-content`) has a kicker with an icon and the text "Care Philosophy", an h2 title, a
    one-line subtitle, and three pillars (`.philosophy-pillar`). Each pillar has a round icon with a
    small index number (01, 02, 03), an h3 heading and a one-sentence description.
  - *Consultation Journey* (`section.process-section#process`): a background layer
    (`.process-bg`, decorative, `aria-hidden`), then a centred header with a kicker (route icon and
    the text "Consultation Journey"), an h2 title ("What to Expect") and a one-line subtitle. Below
    it is a vertical, alternating (zig-zag) timeline of exactly 4 steps (`.process-step`). Each
    step has a round marker with an icon and a card with a large step number (01–04), an h3 heading
    and a one-sentence description. The four steps are: 1) Appointment Booking, 2) a diagnostic or
    evaluation step, 3) a personalised treatment plan, 4) recovery and follow-up.
  - For all three sections, the layout, classes, icons, element order and counts (3 pillars, 4 steps) stay
    as in ENT-2. The photo, badge text, kicker, titles, subtitles, headings and descriptions are
    rewritten for the doctor's specialty, and no ENT wording is left over. The kickers stay generic
    (no doctor names or "20+ years" claims). FAQ questions and answers are rewritten for the specialty.
  - *FAQ* (`section.faq-section#faq`, placed straight after the Gallery on the home page): a header
    with an h2 ("Frequently Asked Questions") and a one-line subtitle, then an accordion
    (`.faq-list`) of questions (`.faq-item`). Each item has a button (`.faq-question`, with the
    question text and a chevron icon, `aria-expanded` set) and a collapsible answer
    (`.faq-answer` > `.faq-answer-inner` > `p`). The first item is open by default
    (`is-active`). Clicking an item opens it and closes the others, and the chevron rotates.
    The accordion JS is the shared "FAQ accordion" block at the end of `script/index.js`. Copy it
    and don't rewrite it.
- Finish with a table: Item | Status | Evidence | Fix applied. List unverified items separately.

---

## A. HEADER
1. The header shows a circular frame with the doctor's professional portrait
   (`border-radius: 50%`, `object-fit: cover`, a real image that exists in assets/).
2. Clicking nav links must not leave `#home`, `#about`, `#gallery` etc. in the URL. Check the JS:
   `preventDefault`, smooth `scrollIntoView`, and `history.replaceState` to strip the hash. The
   logo link and footer links must behave the same way.

## B. HERO
3. The profile details are four separate lines, each with an icon, in this order: Qualification,
   Medical Regd. No. (label must be "Medical Regd. No.", not "MCI"), Fellowship
   (`<p class="hero-credentials">`, no inner span; skip only if the doctor has none), Languages.
4. There are exactly three stat cards: Practising Since (year only), Languages (count),
   Consultation Modes (count). Numbers animate as counters (IntersectionObserver, once only,
   `prefers-reduced-motion` respected, suffixes preserved).
5. The social row contains these icons in this order: FB Profile, FB Page, Instagram, X, LinkedIn,
   Website, WhatsApp, YouTube. It has `flex-wrap: wrap`, and every link has a real href and an
   aria-label.
6. No redundant text or secondary descriptions. Remove extra taglines and duplicate paragraphs;
   keep the h1, the profile lines, the stats, the socials and the CTA.

## C. ABOUT
7. The Read More / Read Less toggle follows AGENTS.md §24 verbatim: 7-line clamp, auto-hides when
   the text fits. It is styled as a subtle text link or secondary element (transparent background,
   no filled button, not the primary CTA style), with a chevron.

## D. CONTACT
8. A Contact section exists with:
   - the clinic's full address, and
   - contact details: phone number (`tel:` link) and email address (`mailto:` link),
   - plus a Book Appointment button that opens the modal.
   Icons match ENT-2.

## E. GALLERY
9. The gallery is an image grid only. There are no captions, titles, overlays or descriptive text
   on the items. Keep meaningful alt text. Images are real, not placeholders.

## F. FOOTER
10. The footer layout and hierarchy mirror ENT-2 exactly (column structure, order, classes).
10a. The footer is the same on all three pages (index, privacy-policy, terms-of-service): identical
    markup, content, links and styling, differing only where ENT-2 itself differs (for example
    in-page anchors resolving to `index.html#...` on the legal pages). Diff the footer block across
    the three files.
10b. The footer is compact, exactly like ENT-2: the same height, padding, spacing, font sizes and
    number of rows and columns. It adds no extra rows, large blocks or tall padding. Compare
    rendered footer height against ENT-2 at 1440px, 768px and 375px. It must also stay compact on
    mobile (stacked columns with tight spacing, no oversized gaps).
11. There are no image credits for free or copyright-free images.

## G. APPOINTMENT MODAL
12. An "i" info icon sits next to the Online Consultation toggle.
13. Hovering or focusing the icon shows a tooltip with the exact text from ENT-2. It must also work
    on keyboard focus and on tap for mobile.
14. Ticking the consent checkbox opens a "Patient Consent & Data Privacy" panel inside the modal.
    The patient must scroll to the bottom before the "I agree" button enables. Clicking it closes
    the panel and leaves the checkbox ticked. Closing without agreeing leaves the checkbox unticked.
    Compare markup and JS with ENT-2.
15. The primary brand colour is reserved for primary actions only (e.g. Submit/Review). The toggle,
    upload button, close button and secondary controls use neutral or outline styles.
16. The text "Try the appointment form. This is a sample clinic; your request stays in this browser
    and is not sent." is absent (grep for "sample clinic" and "not sent").
17. The consent label text is exactly as in CLAUDE.md, with the correct doctor name.

## H. CHATBOT
18. The chat panel layout and size are correct at 1440px, 768px and 375px. Nothing is clipped: the
    header, avatar, message bubble, quick-reply chips (wrapping or scrolling cleanly, not cut off),
    input and send button are all fully visible. The panel fits inside the viewport (`max-height`
    with `overflow-y: auto` on the messages area).
19. The footer note reads exactly: "Informational only, not medical advice." then a line break, then
    "Consult your doctor." (two lines).

## I. PRIVACY POLICY & TERMS OF SERVICE
20. The body content of both pages is identical to ENT-2 (full text in the Appendix), with only the doctor name, clinic and
    contact details swapped. Run a diff against ENT-2 and list any differences that aren't
    doctor-specific data.
21. A visible Back button or link exists on both pages (to index.html), styled like ENT-2.

## J. GLOBAL REGRESSION (CLAUDE.md)
22. Clarity snippet (project `ymqvcvdc4v`) plus microsite/specialty tags are on every page.
23. The §22 global CSS block is present once. There is no `nowrap` on dynamic text, no fixed
    heights on cards, `min-width: 0` on flex/grid children, and `flex-wrap` on all social rows.
    p/li/a are 18px, with AA contrast.
24. The Services grid uses the 12-track system (§23). The social carousel follows §30 if present.
    Each page has a unique title and meta description, and a single h1.
25. No broken links, no missing assets, no console errors.

## K. PROJECT STRUCTURE & COMPLETENESS
26. The folder contains exactly: index.html, privacy-policy.html, terms-of-service.html,
    robots.txt, sitemap.xml, llms.txt, styles/style.css, script/index.js and assets/. All CSS is in
    style.css and all JS in index.js (plus chatbot.js, banner-module.js and analytics.js). No inline
    layout styles and no inline scripts, apart from the Clarity and GA4 snippets.
27. The index.html section order is: Header/Nav → Hero → About → Services → Care Philosophy
    (split-screen) → Consultation Journey (4-step timeline) → Contact → Practice Gallery → FAQ →
    Booking Modal → Footer (the FAQ comes straight after the Gallery). Every nav link's target id
    exists, including `#faq`. Section designs may differ from ENT-2 (see the rule above).
27a. The FAQ section exists after the Gallery, with at least 5 questions and answers that are specific to
    this doctor and specialty (what is treated, referral, what to bring, online vs clinic visit, fees/timing
    only if known). Test the accordion: the first item is open on load, one open at a time, keyboard
    operable (Enter/Space), `aria-expanded` updates, and long answers wrap without overflow.
28. robots.txt, sitemap.xml and llms.txt follow AGENTS.md §29. URLs and doctor details match this
    microsite, with no leftover ENT-2 or other-specialty text.
29. No blog pages, links or files exist (blog was removed project-wide). grep for "blog" in the
    HTML and nav.
30. No leftover strings from the source template. grep for the old doctor name, the old specialty,
    "ENT", "Ananya", "Heart Care Guide", "Lorem", "TODO", "example.com" and any `{{ }}` template tags.

## L. CONTENT ACCURACY & SPECIALTY FIT
31. All copy, services, FAQs, journey steps, chatbot replies and alt text match this doctor's
    specialty. Check gender, pronouns (use "Dr." and the correct he/she), qualifications and clinic
    details for consistency across hero, about, footer, legal pages, modal consent label, chatbot
    and meta tags.
32. The services count and card content are real. Test the grid with 4, 5, 6 and 7 cards: a leftover
    row must be centred.
33. There are no medical claims such as guaranteed cures, and no unverifiable "20+ years" claims
    outside h1, paragraphs, list items and the footer. Sub-headings, badges and kickers stay generic.

## M. BRANDING, COLOUR & LAYOUT (AGENTS.md §1.1, §2, §6, §11, §15)
34. The colour split follows 60% neutral / 30% brand / 10% accent. The accent is used only on CTAs
    and key links.
35. Every text/background pair meets WCAG AA 4.5:1, including text on coloured surfaces, buttons,
    badges, the footer and the chatbot. Compute the ratios and list the lowest three.
36. Top-level sections alternate backgrounds (white/off-white ↔ brand tint). Section padding is
    `20px 0` with no separate mobile override.
37. The container is 1440–1600px wide, not 1280px, and text blocks keep a 65–75ch measure.
38. Typography: h2 is 32–38px and bold (600+); h3 is 22px (20px at ≤480px); p, li and a are 18px
    with dark text; badges are 16px; line-height 1.5–1.6; the 1400px media query caps at 18px.
    Fonts are Google Fonts (Inter, Roboto or Outfit).
39. Card h3/h4 headings are visibly bolder and larger than the card body text. No card is nested
    inside another card.
40. Cards, hover states and focus states are consistent. Focus rings are visible, and animations
    respect `prefers-reduced-motion`.

## N. RESPONSIVENESS & STRESS TESTS
41. No horizontal scroll and nothing clipped at 320, 375, 768, 1024, 1440 and 1900px. Take
    screenshots or measure `scrollWidth`.
42. Stress test: set a very long doctor name (50+ characters), a long specialty/qualification
    string, a long address and a long email. Nothing overflows, nothing is cut off, cards grow.
43. The header (portrait + nav + CTA) collapses properly. The mobile menu opens and closes, traps
    nothing, and closes on link click.
44. Images are optimised: width/height or aspect ratio set, below-the-fold images use
    `loading="lazy"`, the hero image is eager. No image is over about 500KB, and none is a
    placeholder.

## O. BOOKING FORM LOGIC
45. The phone input uses intl-tel-input v29.2.2 via the jsDelivr CDN, `initialCountry: "in"`, and
    `iti.isValidNumber()` gated on `phoneUtilsReady`. Invalid and empty numbers show an error.
46. The full name field accepts only letters, spaces, apostrophes and hyphens, and is sanitised
    live on input.
47. The date picker blocks past dates. Required fields are validated. File upload accepts
    PDF/JPG/PNG up to 5MB and shows a friendly error otherwise.
48. Toggling Clinic visit / Online consultation updates form state and labels. The submit flow works
    end to end (review step → confirmation). Escape and backdrop click close the modal, focus is
    trapped inside, and focus returns to the trigger on close. The body doesn't scroll behind the
    modal.
49. Computed-style check with `getComputedStyle`: button labels wrapped in `<span>` are white on
    coloured buttons (the global `span { color }` reset gotcha). Nested widget inputs aren't broken
    by `.booking-field input` padding. Widget dropdowns aren't collapsed by `max-width: 100%`.

## P. CHATBOT BEHAVIOUR
50. The launcher opens and closes the panel. Quick-reply chips work and answers are on-topic for
    this specialty. Input and send button work with Enter. The panel scrolls to the latest message,
    has a close button, and is keyboard accessible (aria-label, `aria-live` on the message area).
51. Chatbot replies contain no leftover ENT-2 text and no real medical advice. They point to
    booking or "consult your doctor".

## Q. ANALYTICS, SEO & ACCESSIBILITY
52. Clarity: the snippet is copied verbatim from AGENTS.md §27 with project ID `ymqvcvdc4v` only.
    The `microsite` tag matches the slug and the `specialty` tag comes from the canonical §20 table.
    No new per-site Clarity ID.
53. Each page has a unique title and meta description, a canonical URL, Open Graph/Twitter tags, a
    single h1 and a logical heading order. JSON-LD (Physician/MedicalBusiness) is present if ENT-2
    has it, with correct data.
54. Accessibility: every image has alt text (decorative ones `alt=""`), every icon-only link/button
    has an aria-label, form fields have labels, the modal has `role="dialog"` and `aria-modal`,
    there is a skip link if ENT-2 has one, and the page is fully keyboard navigable. Run a quick
    axe/Lighthouse pass and report the scores.
55. No console errors or warnings, no 404s in the network tab, no mixed content. External links
    use `rel="noopener noreferrer"` and `target="_blank"`. Internal links are relative.

## R. WORKSPACE HYGIENE
56. If this is a new specialty, it is added to the AGENTS.md §20 table in the same change. Folder
    naming follows `<Specialty>/microsite-<specialty>-<n>/`.
57. No existing files were deleted, and no other microsite was modified unintentionally
    (`git status` / `git diff --stat`).

## S. ANALYTICS VERIFICATION: GOOGLE ANALYTICS (GA4) + MICROSOFT CLARITY

Reference for analytics: `ENT/microsite-ent-2-param` (the analytics setup is copied from it; `script/analytics.js`, the `data-ga-event` attributes in
index.html, and the consent/booking/upload calls in `script/index.js`).

**S1. Setup (every page: index, privacy-policy, terms-of-service)**
- The GA4 gtag.js snippet is in `<head>` and loads exactly once per page, with a Measurement ID
  that belongs to this microsite. A leftover `G-XXXXXXXXXX` is a FAIL unless the build is still a
  template.
- `script/analytics.js` is loaded before `script/index.js` on every page that uses events.
  `window.trackEvent(name, params)` sends `gtag("event", ...)` with `page_path` and also
  `clarity("event", name)`. Both calls are guarded with `typeof ... === "function"`.
- A delegated click listener reads `data-ga-event` (and an optional `data-ga-label`, falling back to
  `aria-label`, then the first 60 characters of the text).
- The Clarity snippet is copied verbatim from AGENTS.md §27, with project ID `ymqvcvdc4v` only. The
  `microsite` and `specialty` tags are set right after it (see item 52), on every page.
- No page loads GA4 or Clarity twice, and there are no console errors if an ad-blocker blocks
  either script (the guards must prevent crashes).

**S2. Declarative events (must exist in index.html with these exact names)**

| Element | `data-ga-event` | Expected count / label |
|---|---|---|
| Header nav links (About, Services, Contact, Gallery, FAQ) | `nav_link_click` | one per link, label = link name |
| Header "Book Appointment" CTA | `book_appointment_click` | label "Navbar"; every other Book CTA on the page also carries it with its own label |
| Hero social icons | `hero_social_link_click` | one per social icon (8) |
| About Read More button | `read_more_click` | 1 |
| Contact phone link | `phone_number_click` | 1 |
| Contact email link | `email_click` | 1 |
| Booking tab: Clinic Visit | `clinic_visit_tab_click` | 1 |
| Booking tab: Online Consultation | `online_consult_tab_click` | 1 |
| Report upload button | `upload_report_click` | 1 |
| Footer link columns | `footer_nav_link_click` | one per footer nav link |
| Footer social icons | `footer_social_link_click` | one per footer social icon |

**S3. Programmatic events (fired from `script/index.js`)**

| Event | Fires when | Params |
|---|---|---|
| `consent_checkbox_click` | the consent checkbox is toggled | `checked` (true/false) |
| `consent_modal_open` | the Patient Consent & Data Privacy panel opens | none |
| `consent_scrolled_to_bottom` | the patient scrolls to the bottom of the consent text (once) | none |
| `consent_agreed` / `consent_dismissed` | the panel closes via "I Agree" / via close or backdrop | as in ENT-2 |
| `report_uploaded` | a valid report file is chosen | none |
| `booking_submitted` | the booking form is submitted successfully | `appointment_type` (clinic/online) |

**S4. How to verify**
1. Static: grep every `data-ga-event` and `trackEvent`/`trackConsentEvent` call. Diff the list with
   ENT-2-param. Report events that are missing, renamed, duplicated or misspelled. Every nav,
   social, footer and CTA element needs a `data-ga-event`, including any added or removed by this
   microsite's design.
2. Runtime: open the page with DevTools and the Network tab filtered to `collect` (GA4), or GA
   DebugView / Tag Assistant, plus a console hook such as
   `const g = window.gtag; window.gtag = (...a) => { console.log("gtag", ...a); return g(...a); }`.
   Click or perform every action in S2 and S3 and confirm each one produces exactly one event with
   the correct name, label and `page_path` (no double-firing, no missing events). Check that
   `clarity("event", ...)` is called too, and that the Clarity tags (`microsite`, `specialty`) are
   visible in the Clarity dashboard or via `window.clarity` calls.
3. Edge cases: the "I Agree" button starts disabled, so `consent_scrolled_to_bottom` must fire once
   when it enables (no repeats on further scrolling). Closing the consent panel without agreeing
   must fire `consent_dismissed`, not `consent_agreed`. Disabled social icons (no link) must not
   fire events or navigate. Events from links that open in a new tab must still be sent.
4. Legal pages: they load analytics.js and the Clarity snippet, and clicking their links or Back
   button must not throw. Their footer links still fire the footer events if they carry the
   attributes.
5. Privacy: no event carries patient-entered data (name, phone, email, symptoms or file names).
   Params are limited to the fields listed above.

**S5. Report**
Add a table: Event | Trigger | Found in code (file:line) | Fired at runtime (yes/no) | Notes. List
events present in ENT-2 but missing here, and events here that aren't in ENT-2.

---

## OUTPUT

Give the results table (Item | Status | Evidence | Fix applied), then a short list of the fixes you
made. List any item you couldn't verify separately.

---

## APPENDIX: REFERENCE TEXT FOR THE LEGAL PAGES (items 20 and 21)

This is the exact text from ENT-2. Compare the generated pages against it word for word. Allowed
differences: replace `[Doctor/Clinic Name]` with the doctor's name, fill in the contact card
(email, phone, address), and in Privacy Policy section 1 replace the qualification and registration
details ("MBBS, MS (ENT), Registration No. 71934, MCI") with this doctor's own. "Effective Date" stays
as `[Insert Date]` as in ENT-2 unless told otherwise. Anything else that differs is a FAIL.

Both pages share this structure: a "Back to Home" link (arrow icon, links to `index.html`), the
small label "Legal Information", the h1 title, a lead sentence, the effective date line, then the
body. Headings are h2 and lists use the `legal-list` class. The contact section uses a
`legal-contact-card`.

### Appendix A: Privacy Policy

**Title (h1):** Privacy Policy

**Lead:** We respect patient privacy and handle personal information with care, transparency, and
appropriate safeguards.

**Effective Date:** [Insert Date]

This Privacy Policy explains how personal information is collected, used, stored, and protected when
you use this website and its consultation and appointment services.

**1) Who We Are**

This is the personal microsite of **[Doctor/Clinic Name]**, MBBS, MS (ENT), Registration No. 71934,
MCI. It is hosted on technology provided by DigiDr (digidr.app).

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
- Trusted service providers, including DigiDr as the technology provider, and hosting, appointment,
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

### Appendix B: Terms of Service

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
