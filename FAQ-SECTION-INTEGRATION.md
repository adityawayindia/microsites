# FAQ Section — Integration Guide (Copy-Paste)

This document explains what the FAQ section is, and gives the exact copy-paste HTML,
CSS, and JS needed to add it to any other microsite. It was first built and verified on
`Urologist/microsite-urology-1`.

## What is this feature?

A "Frequently Asked Questions" accordion section, placed **between the Gallery section
and the Footer** on `index.html`. Each question is a button; clicking it expands a
smoothly-animated answer panel below it and rotates the chevron icon. Only one answer is
open at a time (opening a new one closes the previous one). It's fully theme-aware (uses
the microsite's own CSS variables, not hardcoded colors) and responsive down to 320px.

## Where it goes

Insert the section markup right after the gallery lightbox markup (`</div>` that closes
`#galleryLightbox`) and before the `<!-- ====== BOOKING MODAL ====== -->` comment. This
places it visually between Gallery and Footer without interfering with the booking modal
(which is an overlay, not a section).

Also add a nav link (`<a href="#faq">FAQ</a>`) next to the other section links in the
header `nav` and the footer nav, matching the existing pattern for Gallery/Testimonials.

## 1. HTML — paste before the booking modal comment

```html
<!-- ====== FAQ SECTION ====== -->
<section class="faq-section" id="faq">
  <div class="container">
    <div class="faq-header">
      <h2 class="faq-title">Frequently Asked Questions</h2>
      <p class="faq-subtitle">
        Answers to the questions patients ask most before their first visit.
      </p>
    </div>

    <div class="faq-list">
      <div class="faq-item is-active">
        <button type="button" class="faq-question" aria-expanded="true">
          <span>Question text goes here?</span>
          <i class="fa-solid fa-chevron-down faq-icon" aria-hidden="true"></i>
        </button>
        <div class="faq-answer">
          <div class="faq-answer-inner">
            <p>Answer text goes here.</p>
          </div>
        </div>
      </div>

      <!-- Repeat .faq-item blocks for each Q&A. Only the FIRST item should
           have "is-active" on .faq-item and aria-expanded="true" on the
           button — all others start collapsed (no is-active, aria-expanded="false"). -->
    </div>
  </div>
</section>
```

Recommended starter set (5 questions, tailor wording to the specialty):
1. What conditions do you treat?
2. Do I need a referral to book a consultation?
3. What should I bring to my first appointment?
4. Do you offer online consultations?
5. Is emergency/urgent care available?

**Important:** every `<p>` must sit inside a `.faq-answer-inner` wrapper, which sits
inside `.faq-answer`. Skipping the inner wrapper reintroduces a text-clipping bug (see
Gotcha below).

## 2. CSS — paste at the end of `styles/style.css`

Uses the microsite's own tokens (`--bg-3`, `--sky`, `--sky-dark`, `--sky-light`,
`--muted`, `--text`, `--surface`, `--border-light`, `--radius-lg`) so it automatically
matches each microsite's palette — no manual recoloring needed as long as those
variables exist in `:root`. If a microsite uses differently-named tokens, swap them here
only.

```css
/* ============================================================
   FAQ SECTION — universal .faq-* classes, gallery(--bg) ↔ FAQ(--bg-3)
   alternation per AGENTS.md §2 branded-band pattern. Accordion state
   is class-driven (.faq-item.is-active); JS only toggles it.
   ============================================================ */
.faq-section {
  padding: 10px 0;
  background: var(--bg-3);
}

.faq-header {
  text-align: center;
  margin: 0 auto 40px;
  max-width: 700px;
}

.faq-title {
  font-size: 34px;
  font-weight: 800;
  color: var(--sky-dark);
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
  border-color: var(--sky);
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
  color: var(--sky);
  background: var(--sky-light);
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
  background: var(--sky);
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
    font-size: 17px;
  }

  .faq-answer-inner > p {
    padding: 0 18px 18px;
    font-size: 17px;
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

If the microsite's section-background alternation up to Gallery ends on `--bg` (as in
urology-1), keep FAQ on `--bg-3` so it reads as a distinct band before the footer. If a
microsite's Gallery already sits on `--bg-3` (or `--bg-2`), pick whichever token the
Gallery section is *not* using, to keep the alternating pattern intact.

**Section padding rule:**
The FAQ section's top and bottom padding must always be **`10px 0`** (`padding: 10px 0;` at all breakpoints, matching AGENTS.md section vertical rhythm standards). Do not add larger vertical section padding or mobile padding overrides that exceed `10px 0`.

## 3. JS — paste at the end of `script/index.js`

Self-contained IIFE, no dependencies on the Read More script or anything else in the
file. Uses event delegation so it works regardless of how many `.faq-item`s exist.

```js
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

## 4. Nav links

Header nav (add next to the Gallery link):

```html
<a href="#faq" data-ga-event="nav_link_click" data-ga-label="FAQ">FAQ</a>
```

Footer nav (add next to the Gallery link):

```html
<a href="#faq" data-ga-event="footer_nav_link_click" data-ga-label="FAQ">FAQ</a>
```

## Gotcha: don't put `overflow: hidden` directly on the `<p>`

The accordion animates `grid-template-rows` from `0fr` to `1fr` on `.faq-answer`. If
`overflow: hidden` (or the answer text) is placed directly on the `<p>` instead of on a
separate `.faq-answer-inner` wrapper div, the browser can clip the paragraph text —
visible as answers cutting off mid-sentence, especially on longer answers. Always keep
the structure `.faq-answer > .faq-answer-inner > p`, and put `overflow: hidden` only on
`.faq-answer-inner`.

## Before marking a microsite done

1. Section sits between Gallery and Footer, using the microsite's own CSS variables (not
   the urology palette hardcoded).
2. Section top and bottom padding is strictly 10px (`padding: 10px 0;` at all breakpoints).
3. FAQ background alternates against whatever the Gallery section's background is.
4. Body/answer text is 18px, AA contrast against `--bg-3` (or whichever band FAQ sits on).
5. Nav + footer nav links added.
6. Test: click each question — one opens at a time, chevron rotates, text is never
   clipped (test with a long answer especially).
7. Test at 320px, 480px, 900px, 1440px+ widths.
