# Read More Button — What Was Added, and Where

This document explains, in plain language, what the "Read More" feature is, how it works,
and exactly what code was added to each microsite's `index.html`, `styles/style.css`, and
`script/index.js` files.

## What is this feature?

On the "About the Doctor" section of each site, the doctor's bio paragraph(s) can be long.
Instead of showing all of it and making the page feel cluttered, we now:

1. **Show only the first ~7 lines** of the bio by default.
2. **Add a "Read More" button** below it, with a small down-arrow (chevron) icon.
3. When clicked, the button **expands the text to show everything**, and the button
   label changes to "Read Less" (with the arrow flipping upside down) so the user can
   collapse it again.
4. **If the bio is already short enough to fit in 7 lines**, the button doesn't show up
   at all — there's no point offering to "read more" when there's nothing more to read.
5. If the browser window is resized (e.g. rotating a phone, or resizing a desktop
   window), the page automatically re-checks whether the button should be shown or
   hidden, so it never looks broken at a different screen size.

## The 3 kinds of files every change touches

Every microsite is built from 3 file types, and this feature touches all 3:

- **`index.html`** — the actual text and structure of the page (this is what you see).
- **`styles/style.css`** — the visual styling (colors, spacing, the 7-line clipping,
  hover effects).
- **`script/index.js`** — the interactive behavior (what happens when you click the
  button, and the "is it worth showing this button?" check).

Below, each microsite has its own section showing exactly what was changed in each of
these 3 files, with the actual code.

---

## Intensivist — microsite-intensivist-1

### `index.html` (lines 176–204)

This is the About section's bio text, now wrapped in two extra `<div>`s (`read-more-wrap`
and `read-more-content`) and followed by the new button.

```html
<div class="about-story-new about-story-new--centered read-more-wrap">
  <div class="read-more-content">
    <p>
      Dr. Sarah Jenkins is a board-certified Intensivist with over 12 years of experience in managing high-acuity
      patients, respiratory failure, cardiac emergencies, and systemic infections. She specializes in intensive
      care
      coordination, hemodynamic monitoring, and multi-organ life support.
    </p>
    <p>
      Recognized for her swift decision-making and empathetic family consultations, Dr. Jenkins leads
      multidisciplinary ICU teams to deliver evidence-based, compassionate care when patients and their families
      need it most.
    </p>
    <p>
      Dr. Jenkins trained in critical care medicine at leading tertiary referral centers and has since
      contributed to protocol development for sepsis bundles, ventilator weaning, and post-cardiac-arrest care.
      She regularly mentors junior residents and nursing staff on early warning signs and rapid-response
      intervention, reinforcing a culture of vigilance across the ICU.
    </p>
    <p>
      Beyond bedside care, she works closely with surgical, cardiology, and nephrology teams to ensure smooth
      transitions for patients moving between departments, minimizing gaps in monitoring during the most
      critical stages of recovery.
    </p>
  </div>
  <button type="button" class="read-more-btn" aria-expanded="false">
    <span>Read More</span>
    <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
  </button>
</div>
```

### `styles/style.css` (lines 3204–3249)

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
  color: var(--accent, #0f766e);
  font-family: inherit;
  font-weight: 600;
  font-size: 16px;
}

.read-more-btn span {
  color: var(--accent, #0f766e);
}

.read-more-btn i {
  transition: transform 0.3s ease;
}

.read-more-btn:hover span,
.read-more-btn:hover i,
.read-more-btn:hover {
  color: var(--accent-bright, #0f766e);
}

.read-more-wrap.is-expanded .read-more-btn i {
  transform: rotate(180deg);
}
```

*What each part does:*
- `-webkit-line-clamp: 7` — clips the text to 7 lines and hides the rest.
- `.is-expanded .read-more-content` — when the button is clicked, this class gets added
  and removes the clipping so the full text shows.
- `.read-more-btn` — styles the button using this site's brand colors (`--accent`).
- `:hover` — makes the button brighten slightly on mouse-over.
- `.is-expanded .read-more-btn i` — spins the arrow icon 180° when expanded.

### `script/index.js` (lines 859–905, end of file)

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

*What each function does:*
- **`checkTruncation(wrap)`** — measures whether the text actually got cut off. If the
  full text height (`scrollHeight`) is bigger than the visible clipped height
  (`clientHeight`), the text was truncated, so the button stays visible. Otherwise the
  button is hidden (`display: none`) because there's nothing more to reveal.
- **`bindToggle(wrap)`** — attaches the click behavior to the button (expand/collapse +
  swap the "Read More"/"Read Less" label). The `dataset.bound` check stops the same
  button from getting a duplicate click handler if this code runs more than once.
- **`initReadMore(root)`** — runs both functions above for every Read More section on
  the page. It's also saved on `window.DigiDrReadMore` so other code (e.g. a future
  backend that loads bio text dynamically) can re-run this check after new text is
  inserted into the page.
- **The bottom part** — runs `initReadMore()` once the page has loaded, and again
  (with a short 200ms delay to avoid running too often) whenever the browser window
  is resized.

---

## Intensivist — microsite-intensivist-2

### `index.html` (lines 213–240)

```html
<div class="iv-about-body read-more-wrap">
  <div class="read-more-content">
    <p>
      Dr. Sarah Jenkins is a board-certified Intensivist with over 12 years of experience managing high-acuity
      patients — respiratory failure, cardiac emergencies, septic shock and complex post-operative recoveries.
      Her practice is built around titrated, protocol-driven treatment: every infusion, ventilator setting and
      pressure reading reviewed against the patient in front of her, not the average patient.
    </p>
    <p>
      Known for swift decision-making and clear, unhurried family briefings, she leads multidisciplinary ICU
      teams that keep critical patients stable through the night and guide them safely back to the ward.
    </p>
    <p>
      Her training in critical care medicine at leading tertiary referral centers has shaped a practice
      grounded in protocol-driven precision — from sepsis bundles to ventilator weaning to post-cardiac-arrest
      management. She actively mentors junior residents and nursing staff on early warning signs, building a
      culture of vigilance that extends beyond her own shifts.
    </p>
    <p>
      She also works closely with surgical, cardiology, and nephrology teams to ensure seamless handoffs as
      patients move between departments, protecting continuity of monitoring during the most fragile stages of
      recovery.
    </p>
  </div>
  <button type="button" class="read-more-btn" aria-expanded="false">
    <span>Read More</span>
    <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
  </button>
</div>
```

### `styles/style.css` (lines 2479–2524)

Same as intensivist-1, except the colors use this site's own variables
(`--iv-deep` for the base color, `--iv` for hover) instead of `--accent`.

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
  color: var(--iv-deep, #0f766e);
  font-family: inherit;
  font-weight: 600;
  font-size: 16px;
}

.read-more-btn span {
  color: var(--iv-deep, #0f766e);
}

.read-more-btn i {
  transition: transform 0.3s ease;
}

.read-more-btn:hover span,
.read-more-btn:hover i,
.read-more-btn:hover {
  color: var(--iv, #0f766e);
}

.read-more-wrap.is-expanded .read-more-btn i {
  transform: rotate(180deg);
}
```

### `script/index.js` (lines 859–905, end of file)

Identical behavior to intensivist-1 — see the explanation above.

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

---

## General Medicine — microsite-general-medicine-1

### `index.html` (lines 269–281)

```html
<div class="about-story-new read-more-wrap" style="max-width: 880px; margin: 40px auto 0;">
  <div class="read-more-content">
    <p>
        Dr. Arjun Mehta is a board-certified General Medicine Consultant with over 12 years of experience in diagnosing complex health conditions, managing chronic illnesses like diabetes and hypertension, and treating infectious diseases. He specializes in comprehensive health screenings, preventive care, and lifestyle medicine.
    </p>
    <p>
        Recognized for his thorough diagnostic approach and empathetic consultations, Dr. Mehta works closely with patients and families to build personalized treatment plans that foster recovery and promote long-term well-being.
    </p>
  </div>
  <button type="button" class="read-more-btn" aria-expanded="false">
    <span>Read More</span>
    <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
  </button>
</div>
```

### `styles/style.css` (lines 6589–6634)

Colors here use `--button` (base) and `--accent` (hover).

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
  font-size: 16px;
}

.read-more-btn span {
  color: var(--button, #0f766e);
}

.read-more-btn i {
  transition: transform 0.3s ease;
}

.read-more-btn:hover span,
.read-more-btn:hover i,
.read-more-btn:hover {
  color: var(--accent, #0f766e);
}

.read-more-wrap.is-expanded .read-more-btn i {
  transform: rotate(180deg);
}
```

### `script/index.js` (lines 884–930, end of file)

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

---

## General Medicine — microsite-general-medicine-2

### `index.html` (lines 256–271)

```html
<div class="about-story-new read-more-wrap">
  <div class="read-more-content">
    <p>
      Dr. Arjun Mehta is a board-certified General Medicine Consultant with over 12 years of experience in
      diagnosing complex health conditions, managing chronic illnesses like diabetes and hypertension, and treating
      infectious diseases. He specializes in comprehensive health screenings, preventive care, and lifestyle
      medicine.
    </p>
    <p>
      Recognized for his thorough diagnostic approach and empathetic consultations, Dr. Mehta works closely with
      patients and families to build personalized treatment plans that foster recovery and promote long-term
      well-being.
    </p>
  </div>
  <button type="button" class="read-more-btn" aria-expanded="false">
    <span>Read More</span>
    <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
  </button>
</div>
```

### `styles/style.css` (lines 4218–4263)

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
  font-size: 16px;
}

.read-more-btn span {
  color: var(--button, #0f766e);
}

.read-more-btn i {
  transition: transform 0.3s ease;
}

.read-more-btn:hover span,
.read-more-btn:hover i,
.read-more-btn:hover {
  color: var(--accent, #0f766e);
}

.read-more-wrap.is-expanded .read-more-btn i {
  transform: rotate(180deg);
}
```

### `script/index.js` (lines 884–930, end of file)

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

---

## Oncology — microsite-oncology-1

> Note: this file has a pre-existing text problem where the em dash in "cancer care—from"
> shows up as garbled characters (`careâ€”from`). That existed before this change and was
> left as-is since fixing it wasn't part of this task.

### `index.html` (lines 171–189)

```html
<div class="about-description read-more-wrap">
  <div class="read-more-content">
    <p>
      Dr. Arjun Mehta is a leading medical oncologist with over 18 years of experience
      in diagnosing and treating solid tumors and hematologic malignancies. He combines
      evidence-based protocols with a patient-first approach, helping individuals and
      families navigate every stage of cancer care—from diagnosis and chemotherapy to
      immunotherapy, targeted therapy, and survivorship support.
    </p>
    <p>
      Known for clear communication and careful treatment planning, Dr. Mehta works
      closely with surgical and radiation oncology teams to deliver coordinated,
      personalized care in a calm and supportive clinical environment.
    </p>
  </div>
  <button type="button" class="read-more-btn" aria-expanded="false">
    <span>Read More</span>
    <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
  </button>
</div>
```

### `styles/style.css` (lines 4102–4147)

Colors use `--button` (base) and `--button-hover` (hover).

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
  font-size: 16px;
}

.read-more-btn span {
  color: var(--button, #0f766e);
}

.read-more-btn i {
  transition: transform 0.3s ease;
}

.read-more-btn:hover span,
.read-more-btn:hover i,
.read-more-btn:hover {
  color: var(--button-hover, #0f766e);
}

.read-more-wrap.is-expanded .read-more-btn i {
  transform: rotate(180deg);
}
```

### `script/index.js` (lines 843–889, end of file)

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

---

## Oncology — microsite-oncology-2

### `index.html` (lines 171–189)

```html
<div class="about-description read-more-wrap">
  <div class="read-more-content">
    <p>
      Dr. Arjun Mehta is a leading medical oncologist with over 18 years of experience
      in diagnosing and treating solid tumors and hematologic malignancies. He combines
      evidence-based protocols with a patient-first approach, helping individuals and
      families navigate every stage of cancer care—from diagnosis and chemotherapy to
      immunotherapy, targeted therapy, and survivorship support.
    </p>
    <p>
      Known for clear communication and careful treatment planning, Dr. Mehta works
      closely with surgical and radiation oncology teams to deliver coordinated,
      personalized care in a calm and supportive clinical environment.
    </p>
  </div>
  <button type="button" class="read-more-btn" aria-expanded="false">
    <span>Read More</span>
    <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
  </button>
</div>
```

### `styles/style.css` (lines 4082–4127)

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
  font-size: 16px;
}

.read-more-btn span {
  color: var(--button, #0f766e);
}

.read-more-btn i {
  transition: transform 0.3s ease;
}

.read-more-btn:hover span,
.read-more-btn:hover i,
.read-more-btn:hover {
  color: var(--button-hover, #0f766e);
}

.read-more-wrap.is-expanded .read-more-btn i {
  transform: rotate(180deg);
}
```

### `script/index.js` (lines 898–944, end of file)

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

---

## Pediatrician — microsite-pediatrician-1

> Note: apostrophes in "child's" show up as garbled characters (`childâ€™s`) in this file
> due to a pre-existing encoding issue — left as-is, not part of this task. Because of
> that, this block was inserted carefully using a text-editing tool that wouldn't disturb
> those already-broken characters further, which is why its indentation looks slightly
> different from the others below. It is still valid, working HTML.

### `index.html` (lines 204–221)

```html
<div class="about-description read-more-wrap">
  <div class="read-more-content">
  <p>
    Dr. Arjun Mehta is a board-certified pediatrician specializing in newborn, infant, child,
    and adolescent care. He treats common childhood illnesses, growth and nutrition concerns,
    respiratory infections, allergies, skin conditions, and developmental challenges with a calm
    and reassuring approach. Trained at leading institutions in India and abroad, Dr. Mehta blends
    evidence-based medicine with clear communication for parents. He takes time to explain
    every step of your child's care plan, so families feel informed and supported. Beyond treatment,
    Dr. Mehta is passionate about preventive pediatrics—ensuring vaccinations are on schedule,
    monitoring milestones, guiding healthy habits, and helping children thrive physically and emotionally.
    Many families trust him as their long-term partner in their child's health journey.
  </p>
  </div>
    <button type="button" class="read-more-btn" aria-expanded="false">
      <span>Read More</span>
      <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
    </button>
</div>
```

### `styles/style.css` (lines 4001–4046)

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
  font-size: 16px;
}

.read-more-btn span {
  color: var(--button, #0f766e);
}

.read-more-btn i {
  transition: transform 0.3s ease;
}

.read-more-btn:hover span,
.read-more-btn:hover i,
.read-more-btn:hover {
  color: var(--button-hover, #0f766e);
}

.read-more-wrap.is-expanded .read-more-btn i {
  transform: rotate(180deg);
}
```

### `script/index.js` (lines 1040–1086, end of file)

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

---

## Pediatrician — microsite-pediatrician-2

### `index.html` (lines 218–231)

```html
<div class="read-more-wrap">
  <div class="read-more-content">
    <p class="alt-about-body">
      Every Child Deserves Expert Care. Every Parent Deserves Peace of Mind.
    </p>
    <p class="alt-about-body">
      From newborns to adolescents, our approach focuses on healthy growth, preventing health problems, identifying concerns early, and helping parents make informed decisions at every stage of childhood.
    </p>
  </div>
  <button type="button" class="read-more-btn" aria-expanded="false">
    <span>Read More</span>
    <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
  </button>
</div>
```

### `styles/style.css` (lines 2015–2060)

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
  font-size: 16px;
}

.read-more-btn span {
  color: var(--button, #0f766e);
}

.read-more-btn i {
  transition: transform 0.3s ease;
}

.read-more-btn:hover span,
.read-more-btn:hover i,
.read-more-btn:hover {
  color: var(--button-hover, #0f766e);
}

.read-more-wrap.is-expanded .read-more-btn i {
  transform: rotate(180deg);
}
```

### `script/index.js` (lines 1051–1097, end of file)

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

---

## Pediatrician — microsite-pediatrician-3

### `index.html` (lines 242–262)

```html
<div class="read-more-wrap">
  <div class="read-more-content">
    <p>
      Dr. Arjun Mehta is a board-certified pediatrician specializing in newborn, infant, child, and
      adolescent care. He treats common childhood illnesses, growth and nutrition concerns, respiratory
      infections, allergies, skin conditions, and developmental challenges with a calm and reassuring
      approach. Trained at leading institutions in India and abroad, Dr. Mehta blends evidence-based
      medicine with clear communication for parents.
    </p>
    <p>
      He takes time to explain every step of your child's care plan, so families feel informed and
      supported. Beyond treatment, Dr. Mehta is passionate about preventive pediatrics—ensuring
      vaccinations are on schedule, monitoring milestones, guiding healthy habits, and helping children
      thrive physically and emotionally.
    </p>
  </div>
  <button type="button" class="read-more-btn" aria-expanded="false">
    <span>Read More</span>
    <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
  </button>
</div>
```

### `styles/style.css` (lines 1861–1906)

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
  font-size: 16px;
}

.read-more-btn span {
  color: var(--button, #0f766e);
}

.read-more-btn i {
  transition: transform 0.3s ease;
}

.read-more-btn:hover span,
.read-more-btn:hover i,
.read-more-btn:hover {
  color: var(--button-hover, #0f766e);
}

.read-more-wrap.is-expanded .read-more-btn i {
  transform: rotate(180deg);
}
```

### `script/index.js` (lines 1049–1095, end of file)

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

---

## Pediatrician — microsite-pediatrician-4

### `index.html` (lines 228–248)

```html
<div class="read-more-wrap">
  <div class="read-more-content">
    <p>
      Dr. Arjun Mehta is a board-certified pediatrician specializing in newborn, infant, child, and
      adolescent care. He treats common childhood illnesses, growth and nutrition concerns, respiratory
      infections, allergies, skin conditions, and developmental challenges with a calm and reassuring
      approach. Trained at leading institutions in India and abroad, Dr. Mehta blends evidence-based
      medicine with clear communication for parents.
    </p>
    <p>
      He takes time to explain every step of your child's care plan, so families feel informed and
      supported. Beyond treatment, Dr. Mehta is passionate about preventive pediatrics—ensuring
      vaccinations are on schedule, monitoring milestones, guiding healthy habits, and helping children
      thrive physically and emotionally.
    </p>
  </div>
  <button type="button" class="read-more-btn" aria-expanded="false">
    <span>Read More</span>
    <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
  </button>
</div>
```

### `styles/style.css` (lines 1798–1843)

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
  font-size: 16px;
}

.read-more-btn span {
  color: var(--button, #0f766e);
}

.read-more-btn i {
  transition: transform 0.3s ease;
}

.read-more-btn:hover span,
.read-more-btn:hover i,
.read-more-btn:hover {
  color: var(--button-hover, #0f766e);
}

.read-more-wrap.is-expanded .read-more-btn i {
  transform: rotate(180deg);
}
```

### `script/index.js` (lines 894–940, end of file)

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

---

## Gastroenterology — microsite-gastroenterology-1

### `index.html` (lines 225–241)

```html
<div class="about-story-new read-more-wrap">
  <div class="read-more-content">
    <p>
      Dr. Arjun Mehta is a board-certified Gastroenterologist with over 12 years of experience in diagnosing and
      treating complex digestive disorders, liver conditions, and inflammatory bowel diseases. He specializes in
      advanced diagnostic endoscopy, colonoscopy, and personalized gut health therapies.
    </p>
    <p>
      Recognized for his patient-centered approach and advanced clinical expertise, Dr. Mehta works closely with
      multidisciplinary medical teams to provide evidence-based care tailored to each patient's lifestyle and
      wellness goals.
    </p>
  </div>
  <button type="button" class="read-more-btn" aria-expanded="false">
    <span>Read More</span>
    <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
  </button>
</div>
```

### `styles/style.css` (lines 7108–7153)

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
  font-size: 16px;
}

.read-more-btn span {
  color: var(--button, #0f766e);
}

.read-more-btn i {
  transition: transform 0.3s ease;
}

.read-more-btn:hover span,
.read-more-btn:hover i,
.read-more-btn:hover {
  color: var(--button-hover, #0f766e);
}

.read-more-wrap.is-expanded .read-more-btn i {
  transform: rotate(180deg);
}
```

### `script/index.js` (lines 843–889, end of file)

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

---

## Gastroenterology — microsite-gastroenterology-2

### `index.html` (lines 226–242)

Same bio text and structure as gastroenterology-1.

```html
<div class="about-story-new read-more-wrap">
  <div class="read-more-content">
    <p>
      Dr. Arjun Mehta is a board-certified Gastroenterologist with over 12 years of experience in diagnosing and
      treating complex digestive disorders, liver conditions, and inflammatory bowel diseases. He specializes in
      advanced diagnostic endoscopy, colonoscopy, and personalized gut health therapies.
    </p>
    <p>
      Recognized for his patient-centered approach and advanced clinical expertise, Dr. Mehta works closely with
      multidisciplinary medical teams to provide evidence-based care tailored to each patient's lifestyle and
      wellness goals.
    </p>
  </div>
  <button type="button" class="read-more-btn" aria-expanded="false">
    <span>Read More</span>
    <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
  </button>
</div>
```

### `styles/style.css` (lines 2804–2849)

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
  font-size: 16px;
}

.read-more-btn span {
  color: var(--button, #0f766e);
}

.read-more-btn i {
  transition: transform 0.3s ease;
}

.read-more-btn:hover span,
.read-more-btn:hover i,
.read-more-btn:hover {
  color: var(--button-hover, #0f766e);
}

.read-more-wrap.is-expanded .read-more-btn i {
  transform: rotate(180deg);
}
```

### `script/index.js` (lines 823–869, end of file)

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

---

## Ayurvedic — microsite-ayurvedic-1

> Note: this file has a pre-existing text problem where em dashes show up as garbled
> characters (`concernsâ€”ranging`). That existed before this change and was left as-is.
> Because of that, this block was inserted carefully so as not to disturb those
> already-broken characters further, which is why its indentation looks slightly
> different from some of the others. It is still valid, working HTML.

### `index.html` (lines 179–196)

```html
<div class="about-story-new read-more-wrap" style="max-width: 880px; margin: 40px auto 0;">
  <div class="read-more-content">
  <p>
    Dr. Arjun Mehta is an Ayurvedic physician with over 12 years of experience in clinical practice,
    Panchakarma therapies, and constitutional (Prakriti) analysis. He specializes in chronic disease management,
    lifestyle modifications, and natural herb-based care plans tailored to each individual.
  </p>
  <p>
    Recognized for his thorough approach and clear treatment plans, Dr. Mehta helps patients manage
    long-term health concerns—ranging from metabolic disorders to musculoskeletal pain—with systematic,
    evidence-based Ayurvedic practices.
  </p>
  </div>
  <button type="button" class="read-more-btn" aria-expanded="false">
    <span>Read More</span>
    <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
  </button>
</div>
```

### `styles/style.css` (lines 5601–5646)

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
  font-size: 16px;
}

.read-more-btn span {
  color: var(--button, #0f766e);
}

.read-more-btn i {
  transition: transform 0.3s ease;
}

.read-more-btn:hover span,
.read-more-btn:hover i,
.read-more-btn:hover {
  color: var(--button-hover, #0f766e);
}

.read-more-wrap.is-expanded .read-more-btn i {
  transform: rotate(180deg);
}
```

### `script/index.js` (lines 831–877, end of file)

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

---

## Ayurvedic — microsite-ayurvedic-2

> Same pre-existing garbled-em-dash note as ayurvedic-1 applies here too.

### `index.html` (lines 178–195)

```html
<div class="about-story-new read-more-wrap" style="max-width: 880px; margin: 40px auto 0;">
  <div class="read-more-content">
  <p>
    Dr. Arjun Mehta is an Ayurvedic physician with over 12 years of experience in clinical practice,
    Panchakarma therapies, and constitutional (Prakriti) analysis. He specializes in chronic disease management,
    lifestyle modifications, and natural herb-based care plans tailored to each individual.
  </p>
  <p>
    Recognized for his thorough approach and clear treatment plans, Dr. Mehta helps patients manage
    long-term health concerns—ranging from metabolic disorders to musculoskeletal pain—with systematic,
    evidence-based Ayurvedic practices.
  </p>
  </div>
  <button type="button" class="read-more-btn" aria-expanded="false">
    <span>Read More</span>
    <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
  </button>
</div>
```

### `styles/style.css` (lines 5584–5629)

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
  font-size: 16px;
}

.read-more-btn span {
  color: var(--button, #0f766e);
}

.read-more-btn i {
  transition: transform 0.3s ease;
}

.read-more-btn:hover span,
.read-more-btn:hover i,
.read-more-btn:hover {
  color: var(--button-hover, #0f766e);
}

.read-more-wrap.is-expanded .read-more-btn i {
  transform: rotate(180deg);
}
```

### `script/index.js` (lines 831–877, end of file)

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

---

## Cardiology — microsite-cardiology-1

This site has 3 bio paragraphs instead of 2 — the code works the same either way, since
it clips the whole `.read-more-content` block by line count, not by paragraph count.

### `index.html` (lines 162–179)

```html
<div class="about-description read-more-wrap">
  <div class="read-more-content">
    <p>
      Dr. Arjun Mehta is a distinguished Interventional Cardiologist with over 18 years of clinical and academic excellence. He completed his MD in Internal Medicine from AIIMS New Delhi and his DM in Cardiology from KEM Hospital, Mumbai, before completing advanced fellowship training in Interventional Cardiology at the Cleveland Clinic, USA.
    </p>
    <p style="margin-top:12px;">
      Dr. Mehta specialises in the diagnosis and management of complex coronary artery disease, heart failure, arrhythmias, and hypertension. He has performed over 5,000 coronary angiographies and 3,000 percutaneous coronary interventions, earning recognition as one of Pune's most sought-after cardiac specialists. His patient-centric approach combining cutting-edge diagnostics with empathetic communication has made him a trusted name in cardiovascular medicine across Maharashtra.
    </p>
    <p style="margin-top:12px;">
      Dr. Mehta is an active member of the Cardiological Society of India (CSI), the American College of Cardiology (ACC), and the European Society of Cardiology (ESC). He regularly publishes research on preventive cardiology and speaks at national and international cardiac conferences.
    </p>
  </div>
  <button type="button" class="read-more-btn" aria-expanded="false">
    <span>Read More</span>
    <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
  </button>
</div>
```

### `styles/style.css` (lines 3536–3581)

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
  font-size: 16px;
}

.read-more-btn span {
  color: var(--button, #0f766e);
}

.read-more-btn i {
  transition: transform 0.3s ease;
}

.read-more-btn:hover span,
.read-more-btn:hover i,
.read-more-btn:hover {
  color: var(--button-hover, #0f766e);
}

.read-more-wrap.is-expanded .read-more-btn i {
  transform: rotate(180deg);
}
```

### `script/index.js` (lines 1262–1308, end of file)

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

---

## Orthopedics — microsite-orthopedics-1

> Note: same pre-existing garbled-em-dash issue as the Ayurvedic sites, in the second
> paragraph (`careâ€”from first`). Left as-is, not part of this task.

### `index.html` (lines 186–204)

```html
<div class="about-description read-more-wrap">
  <div class="read-more-content">
    <p>
        Dr. Kabir Malhotra is a leading orthopedic specialist with over 16 years of experience
        in joint replacement, sports injuries, fracture care, and spine-related concerns.
        He combines advanced treatment approaches with a patient-first approach, helping
        individuals return to movement with clarity, confidence, and lasting relief.
    </p>
    <p>
        Known for clear communication and structured rehabilitation planning, Dr. Malhotra
        works closely with physiotherapy teams to deliver coordinated care—from first
        consultation through recovery and long-term joint health.
    </p>
  </div>
  <button type="button" class="read-more-btn" aria-expanded="false">
    <span>Read More</span>
    <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
  </button>
</div>
```

### `styles/style.css` (lines 4145–4190)

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
  font-size: 16px;
}

.read-more-btn span {
  color: var(--button, #0f766e);
}

.read-more-btn i {
  transition: transform 0.3s ease;
}

.read-more-btn:hover span,
.read-more-btn:hover i,
.read-more-btn:hover {
  color: var(--button-hover, #0f766e);
}

.read-more-wrap.is-expanded .read-more-btn i {
  transform: rotate(180deg);
}
```

### `script/index.js` (lines 784–830, end of file)

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

---

## Homeopathy — microsite-homeopathy

### `index.html` (lines 183–200)

```html
<div class="about-story-new read-more-wrap" style="max-width: 880px; margin: 40px auto 0;">
  <div class="read-more-content">
    <p>
        Dr. Arjun Mehta is a board-certified Homeopathic Consultant with over 14 years of experience in classical homeopathy, focusing on gentle, long-term healing for chronic and acute conditions. He specializes in constitutional remedies that stimulate the body's natural defense mechanisms to cure from within.
    </p>
    <p>
        Recognized for his patient-centric approach, Dr. Mehta integrates traditional homeopathic methodologies with modern clinical insights. He works closely with patients to understand their complete health timeline, providing highly personalized treatments tailored to each individual's unique physical and emotional makeup.
    </p>
  </div>
  <button type="button" class="read-more-btn" aria-expanded="false">
    <span>Read More</span>
    <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
  </button>
</div>
```

### `styles/style.css` (lines 6398–6443)

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
  font-size: 16px;
}

.read-more-btn span {
  color: var(--button, #0f766e);
}

.read-more-btn i {
  transition: transform 0.3s ease;
}

.read-more-btn:hover span,
.read-more-btn:hover i,
.read-more-btn:hover {
  color: var(--button-hover, #0f766e);
}

.read-more-wrap.is-expanded .read-more-btn i {
  transform: rotate(180deg);
}
```

### `script/index.js` (lines 784–830, end of file)

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

---

## Neurology — microsite-neurology-1

> Note: this file has a pre-existing text problem — several apostrophes and hyphens
> show up as garbled characters (`highâ€‘stress`, `patientâ€™s`). That existed before this
> change and was left as-is. This bio is also a single long paragraph (not split into
> two like most other sites), which is fine — the clipping works the same either way.

### `index.html` (lines 177–194)

```html
<div class="about-description read-more-wrap">
  <div class="read-more-content">
    <p>
      Dr. Arjun Mehta is a board-certified neurologist specializing in the diagnosis and
      treatment of complex brain, spine, and nerve conditions, including stroke, epilepsy,
      migraine disorders, movement disorders, and neuropathies. He is known for his calm,
      reassuring approach in high‑stress situations. Trained at leading institutions in the United States and abroad, Dr. Mehta blends
      evidence‑based medicine with clear, honest communication. He takes time to explain
      every step of a patient's care plan, ensuring you and your family feel confident and
      informed about your neurological health. Beyond acute care, Dr. Mehta is passionate about preventive neurology—helping
      patients reduce stroke risk, manage chronic headaches, improve sleep, and address
      memory concerns early. Many families trust him as their long‑term partner for brain
      and nervous system health across generations.
    </p>
  </div>
  <button type="button" class="read-more-btn" aria-expanded="false">
    <span>Read More</span>
    <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
  </button>
</div>
```

### `styles/style.css` (lines 3626–3671)

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
  font-size: 16px;
}

.read-more-btn span {
  color: var(--button, #0f766e);
}

.read-more-btn i {
  transition: transform 0.3s ease;
}

.read-more-btn:hover span,
.read-more-btn:hover i,
.read-more-btn:hover {
  color: var(--button-hover, #0f766e);
}

.read-more-wrap.is-expanded .read-more-btn i {
  transform: rotate(180deg);
}
```

### `script/index.js` (lines 839–885, end of file)

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

---

## Default Template — microsite-default

This is the blank starter template used to create new microsites — its bio text is
still placeholder text (`Dr. [Doctor Name]`, `[X] years`). The Read More feature works
here too, exactly the same way, so every new microsite created from this template
already has it built in.

### `index.html` (lines 179–196)

```html
<div class="about-story-new read-more-wrap" style="max-width: 880px; margin: 40px auto 0;">
  <div class="read-more-content">
    <p>
      Dr. [Doctor Name] is a qualified physician with over [X] years of experience in clinical practice,
      diagnosis, and patient care. They specialize in comprehensive health management, preventive care,
      and treatment plans tailored to each individual.
    </p>
    <p>
      Recognized for a thorough approach and clear treatment plans, Dr. [Doctor Name] helps patients manage
      both routine and long-term health concerns with a systematic, evidence-based approach to medicine.
    </p>
  </div>
  <button type="button" class="read-more-btn" aria-expanded="false">
    <span>Read More</span>
    <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
  </button>
</div>
```

### `styles/style.css` (lines 5601–5646)

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
  font-size: 16px;
}

.read-more-btn span {
  color: var(--button, #0f766e);
}

.read-more-btn i {
  transition: transform 0.3s ease;
}

.read-more-btn:hover span,
.read-more-btn:hover i,
.read-more-btn:hover {
  color: var(--button-hover, #0f766e);
}

.read-more-wrap.is-expanded .read-more-btn i {
  transform: rotate(180deg);
}
```

### `script/index.js` (lines 832–878, end of file)

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

---

## Dentist — microsite-dentist-1

This site's About section uses a slightly different class name (`about-story`, not
`about-story-new`) — the Read More classes were added on top of it the same way.

### `index.html` (lines 189–206)

```html
<div class="about-story read-more-wrap">
  <div class="read-more-content">
    <p>
        Dr. Arjun Mehta is a dentist with over 12 years of experience in preventive dentistry,
        restorative care, root canal treatment, and smile aesthetics. He focuses on comfortable
        visits, modern techniques, and practical guidance patients can follow at home.
    </p>
    <p>
        Known for a calm chairside manner and transparent treatment plans, Dr. Mehta helps
        families and working professionals maintain healthy teeth—from routine cleanings through
        complex restorative work—with confidence and clarity.
    </p>
  </div>
  <button type="button" class="read-more-btn" aria-expanded="false">
    <span>Read More</span>
    <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
  </button>
</div>
```

### `styles/style.css` (lines 5169–5214)

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
  font-size: 16px;
}

.read-more-btn span {
  color: var(--button, #0f766e);
}

.read-more-btn i {
  transition: transform 0.3s ease;
}

.read-more-btn:hover span,
.read-more-btn:hover i,
.read-more-btn:hover {
  color: var(--button-hover, #0f766e);
}

.read-more-wrap.is-expanded .read-more-btn i {
  transform: rotate(180deg);
}
```

### `script/index.js` (lines 834–880, end of file)

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

---

## Dentist — microsite-dentist-2

Same `about-story` structure as dentist-1, different doctor/bio.

### `index.html` (lines 189–206)

```html
<div class="about-story read-more-wrap">
  <div class="read-more-content">
    <p>
        Dr. Rohan Kapoor is a dentist and orthodontist with over 9 years of experience in braces,
        clear aligners, bite correction, and general restorative care. He focuses on data-backed
        treatment planning, minimal chair time, and clear timelines patients can plan their lives around.
    </p>
    <p>
        Known for straight-talking consultations and a methodical approach to every case, Dr. Kapoor
        helps teens and adults move through treatment—from the first scan to the final retainer—without
        surprises along the way.
    </p>
  </div>
  <button type="button" class="read-more-btn" aria-expanded="false">
    <span>Read More</span>
    <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
  </button>
</div>
```

### `styles/style.css` (lines 5132–5177)

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
  font-size: 16px;
}

.read-more-btn span {
  color: var(--button, #0f766e);
}

.read-more-btn i {
  transition: transform 0.3s ease;
}

.read-more-btn:hover span,
.read-more-btn:hover i,
.read-more-btn:hover {
  color: var(--button-hover, #0f766e);
}

.read-more-wrap.is-expanded .read-more-btn i {
  transform: rotate(180deg);
}
```

### `script/index.js` (lines 834–880, end of file)

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

---

## Urologist — microsite-urology-1

This site's bio paragraphs weren't inside their own wrapper `<div>` before — they sat
directly next to the heading and lead paragraph inside `.about-content`. So a brand-new
`<div class="read-more-wrap">` was added around just the two bio paragraphs (the heading
and lead line above them were left untouched, outside the wrap).

### `index.html` (lines 221–242)

```html
<div class="about-content">
  <span class="about-kicker">About the Practice</span>
  <h2 class="about-title">Precise, Compassionate Urological Care</h2>
  <p class="about-description">
    Combining advanced surgical training with an unhurried, patient-first approach to every consultation.
  </p>
  <div class="read-more-wrap">
    <div class="read-more-content">
      <p>
        Dr. Arjun Mehta is a board-certified urologist specializing in the diagnosis and treatment of kidney,
        bladder, and prostate conditions in both men and women. He manages kidney stones, urinary tract
        infections, prostate enlargement, urologic cancers, and male infertility with a calm, evidence-based
        approach. Trained at leading institutions in India and abroad, Dr. Mehta blends surgical precision
        with clear communication for every patient.
      </p>
      <p>
        He takes time to explain every diagnosis and treatment option, so patients feel informed and in
        control of their care. Beyond treatment, Dr. Mehta is committed to minimally invasive and robotic
        techniques that reduce recovery time&mdash;helping patients return to their daily lives faster, with
        less pain and better long-term outcomes.
      </p>
    </div>
    <button type="button" class="read-more-btn" aria-expanded="false">
      <span>Read More</span>
      <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
    </button>
  </div>
</div>
```

### `styles/style.css` (lines 1983–2028)

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
  font-size: 16px;
}

.read-more-btn span {
  color: var(--button, #0f766e);
}

.read-more-btn i {
  transition: transform 0.3s ease;
}

.read-more-btn:hover span,
.read-more-btn:hover i,
.read-more-btn:hover {
  color: var(--button-hover, #0f766e);
}

.read-more-wrap.is-expanded .read-more-btn i {
  transform: rotate(180deg);
}
```

### `script/index.js` (lines 978–1024, end of file)

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

---

## Urologist — microsite-urology-2

Same structure and change as urology-1 — a brand-new `read-more-wrap` div added around
just the two bio paragraphs, leaving the heading and lead line untouched.

### `index.html` (lines 222–243)

```html
<div class="about-content">
  <span class="about-kicker">About the Practice</span>
  <h2 class="about-title">Precise, Compassionate Urological Care</h2>
  <p class="about-description">
    Combining advanced surgical training with an unhurried, patient-first approach to every consultation.
  </p>
  <div class="read-more-wrap">
    <div class="read-more-content">
      <p>
        Dr. Arjun Mehta is a board-certified urologist specializing in the diagnosis and treatment of kidney,
        bladder, and prostate conditions in both men and women. He manages kidney stones, urinary tract
        infections, prostate enlargement, urologic cancers, and male infertility with a calm, evidence-based
        approach. Trained at leading institutions in India and abroad, Dr. Mehta blends surgical precision
        with clear communication for every patient.
      </p>
      <p>
        He takes time to explain every diagnosis and treatment option, so patients feel informed and in
        control of their care. Beyond treatment, Dr. Mehta is committed to minimally invasive and robotic
        techniques that reduce recovery time&mdash;helping patients return to their daily lives faster, with
        less pain and better long-term outcomes.
      </p>
    </div>
    <button type="button" class="read-more-btn" aria-expanded="false">
      <span>Read More</span>
      <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>
    </button>
  </div>
</div>
```

### `styles/style.css` (lines 2001–2046)

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
  font-size: 16px;
}

.read-more-btn span {
  color: var(--button, #0f766e);
}

.read-more-btn i {
  transition: transform 0.3s ease;
}

.read-more-btn:hover span,
.read-more-btn:hover i,
.read-more-btn:hover {
  color: var(--button-hover, #0f766e);
}

.read-more-wrap.is-expanded .read-more-btn i {
  transform: rotate(180deg);
}
```

### `script/index.js` (lines 978–1024, end of file)

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

---

## Status: all microsites done

Every microsite in this workspace (22 total) now has the Read More feature on its About
section, using the exact same HTML pattern, CSS block, and JS block described above:

- Intensivist — microsite-intensivist-1, microsite-intensivist-2
- General Medicine — microsite-general-medicine-1, microsite-general-medicine-2
- Oncology — microsite-oncology-1, microsite-oncology-2
- Pediatrician — microsite-pediatrician-1, -2, -3, -4
- Gastroenterology — microsite-gastroenterology-1, microsite-gastroenterology-2
- Ayurvedic — microsite-ayurvedic-1, microsite-ayurvedic-2
- Cardiology — microsite-cardiology-1
- Orthopedics — microsite-orthopedics-1
- Homeopathy — microsite-homeopathy
- Neurology — microsite-neurology-1
- Default Template — microsite-default
- Dentist — microsite-dentist-1, microsite-dentist-2
- Urologist — microsite-urology-1, microsite-urology-2
