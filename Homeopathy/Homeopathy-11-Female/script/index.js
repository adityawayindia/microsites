// Shared focus and background-inert handling for booking, consent, review, lightbox and chat.
window.DigiDrDialogs = (() => {
  let active = null;
  let inertNodes = [];
  const selector = 'a[href],button:not([disabled]),input:not([type="hidden"]):not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
  const focusables = root => Array.from(root.querySelectorAll(selector)).filter(el => el.getClientRects().length && !el.closest('[inert]') && getComputedStyle(el).visibility !== 'hidden');
  function activate(root, preferred) {
    inertNodes.forEach(([el, was]) => { el.inert = was; }); inertNodes = []; active = root;
    if (!root) { document.body.style.overflow = ''; return; }
    let node = root;
    while (node && node !== document.body) {
      Array.from(node.parentElement?.children || []).forEach(sibling => {
        if (sibling !== node && !['SCRIPT','STYLE','LINK'].includes(sibling.tagName)) {
          inertNodes.push([sibling, sibling.inert]); sibling.inert = true;
        }
      });
      node = node.parentElement;
    }
    document.body.style.overflow = 'hidden';
    root.setAttribute('tabindex', '-1');
    (preferred || focusables(root)[0] || root).focus({ preventScroll: true });
  }
  document.addEventListener('keydown', event => {
    if (!active || event.key !== 'Tab') return;
    const els = focusables(active), first = els[0], last = els.at(-1);
    if (!first) { event.preventDefault(); active.focus(); return; }
    if (event.shiftKey && (document.activeElement === first || !els.includes(document.activeElement))) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && (document.activeElement === last || !els.includes(document.activeElement))) { event.preventDefault(); first.focus(); }
  });
  document.addEventListener('focusin', event => {
    if (active && !active.contains(event.target)) (focusables(active)[0] || active).focus({ preventScroll: true });
  });
  return { activate, get active() { return active; } };
})();

// GA4 tracking lives in script/analytics.js (window.trackEvent + the
// data-ga-event click delegation). Loaded before this file on every page.

// Always start fresh on load/refresh: reset scroll position and strip any
// URL hash left over from in-page nav so a reload never resumes mid-page.
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

const initialHash = window.location.hash;
if (window.location.hash) {
  history.replaceState(null, "", window.location.pathname + window.location.search);
}

if (initialHash && initialHash !== "#") {
  requestAnimationFrame(() => {
    const target = document.getElementById(decodeURIComponent(initialHash.slice(1)));
    target?.scrollIntoView({ block: "start" });
  });
} else window.scrollTo(0, 0);

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

if (menuToggle && mainNav) {
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&mainNav.classList.contains('open')){mainNav.classList.remove('open');menuToggle.setAttribute('aria-expanded','false');menuToggle.focus();}});
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

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
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
    section.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    if (hash === "#main") section.focus({ preventScroll: true });
    history.replaceState(null, "", location.pathname + location.search);
});

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
    return template.includes(",") ? value.toLocaleString("en-US") : String(value);
  }

  function animateCount(el) {
    const original = el.textContent;
    const parsed = parseTarget(original);
    if (!parsed) return;
    const { target, prefix, suffix } = parsed;
    if (prefersReducedMotion) { el.textContent = prefix + suffix; return; }
    el.textContent = "0" + suffix;
    const started = performance.now();
    function tick(now) {
      const progress = Math.min((now - started) / DURATION, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = formatWithCommas(Math.round(target * eased), prefix) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { animateCount(entry.target); obs.unobserve(entry.target); }
    });
  }, { threshold: 0.4 });

  statEls.forEach((el) => observer.observe(el));
})();

// Disabled social controls remain focusable for their status tooltip but never navigate.
document.addEventListener("click", (event) => {
  const disabled = event.target instanceof Element ? event.target.closest('[aria-disabled="true"]') : null;
  if (disabled) event.preventDefault();
});

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
  let galleryTrigger = null;

  function openLightbox(index) {
    currentIdx = index;
    const img = galleryImages[currentIdx];
    if (img) {
      lightboxImage.src = img.src;
      lightboxImage.alt = img.alt || "Enlarged gallery image";
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      window.DigiDrDialogs.activate(lightbox, closeBtn);
    }
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImage.removeAttribute("src");
    window.DigiDrDialogs.activate(null);
    galleryTrigger?.focus({preventScroll:true});
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
    const trigger = img.closest(".gallery-item") || img;
    trigger.setAttribute("role", "button");
    trigger.tabIndex = 0;
    trigger.setAttribute("aria-label", "Enlarge image: " + img.alt);
    const open = () => { galleryTrigger = trigger; openLightbox(idx); };
    trigger.addEventListener("click", open);
    trigger.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); open(); }
    });
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

// Booking Modal & Form Validation — DigiDr endpoint contract from AGENTS.md A.18.
// No synthetic availability, times, or success responses are used by this site.
(function () {
  const API_BASE = 'https://digidrapi.digidr.app';
  const $ = id => document.getElementById(id);
  const modal = $('bookingModal'), form = $('bookingForm');
  if (!modal || !form) return;
  const consent = $('consentModal'), review = $('bookingReviewModal');
  const checkbox = $('consentCheckbox'), submit = $('submitBtn'), status = $('bookingStatus');
  const clinicTab = $('clinicVisitTab'), onlineTab = $('onlineConsultTab');
  const dateInput = $('preferredDate'), dateDisplay = $('preferredDateText'), slots = $('preferredTime');
  const calendar = $('preferredDateCalendar'), dateField = $('preferredDateField');
  const doctorId = (form.dataset.userid || '').trim();
  const configured = Boolean(doctorId && !doctorId.includes('{{') && doctorId !== 'Homeopathy-11-Female');
  let type = 'offline', availableDays = new Set(), modes = {offline: true, online: true};
  let daysSequence = 0, slotsSequence = 0, loadingDays = false, posting = false;
  let consentAccepted = false, consentRead = false, returnFocus = null, snapshot = null;
  let iti = null, phoneUtilsReady = false, phonePromise = Promise.resolve(false), previewUrl = null;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const lastDate = new Date(today); lastDate.setDate(lastDate.getDate() + 30);
  let month = new Date(today.getFullYear(), today.getMonth(), 1);
  const iso = date => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
  const parseDate = value => /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(value + 'T00:00:00') : new Date(NaN);
  const weekday = date => date.toLocaleDateString('en-US', {weekday:'long'}).toLowerCase();
  const track = (name, params) => window.trackEvent?.(name, params);
  const setStatus = text => { status.textContent = text; };
  function show(root, focus) {
    [modal, consent, review].forEach(el => { el.classList.remove('is-open'); el.setAttribute('aria-hidden','true'); });
    root.classList.add('is-open'); root.setAttribute('aria-hidden','false');
    window.DigiDrDialogs.activate(root, focus);
  }
  function closeBooking() {
    if (posting) return;
    closeCalendar(); toggleInfo(false);
    [modal, consent, review].forEach(el => { el.classList.remove('is-open'); el.setAttribute('aria-hidden','true'); });
    window.DigiDrDialogs.activate(null);
    returnFocus?.focus({preventScroll:true});
  }
  document.querySelectorAll('.cta-btn,[data-open-booking]').forEach(trigger => {
    trigger.addEventListener('click', event => {
      event.preventDefault(); returnFocus = trigger; show(modal, $('bookingModalClose'));
      if (!configured) setStatus('Online booking is not configured yet. Please contact the clinic to arrange a consultation.');
    });
  });
  $('bookingModalClose').addEventListener('click',closeBooking);
  $('bookingModalBackdrop').addEventListener('click',closeBooking);
  function error(name, message) {
    const el = form.querySelector(`[data-error-for="${name}"]`);
    if (el) el.textContent = message;
    const field = name === 'preferredDate' ? dateDisplay : form.elements.namedItem(name);
    field?.setAttribute('aria-invalid', message ? 'true' : 'false');
    field?.classList.toggle('is-invalid', Boolean(message));
  }
  form.querySelectorAll('[data-error-for]').forEach(el => {
    const name = el.dataset.errorFor; el.id = 'booking-error-' + name; el.setAttribute('aria-live','polite');
    const field = name === 'preferredDate' ? dateDisplay : form.elements.namedItem(name);
    field?.setAttribute('aria-describedby', el.id);
  });
  async function request(path, options = {}) {
    const abort = new AbortController(); const timer = setTimeout(() => abort.abort(),10000);
    try {
      const response = await fetch(API_BASE + path, {...options, signal: abort.signal});
      let data; try { data = await response.json(); } catch { throw new Error('invalid-response'); }
      if (!response.ok || data?.success === false) throw new Error('request-rejected');
      return data;
    } finally { clearTimeout(timer); }
  }
  function resetSlots(label = 'Select Time Slot') {
    slots.replaceChildren(new Option(label,'')); slots.disabled = true;
  }
  function resetDate() {
    slotsSequence++; dateInput.value = ''; dateDisplay.value = ''; closeCalendar(); resetSlots();
    error('preferredDate',''); error('preferredTime','');
  }
  function canChoose(date) {
    return configured && !loadingDays && date >= today && date <= lastDate && availableDays.has(weekday(date));
  }
  async function loadDays() {
    const sequence = ++daysSequence;
    availableDays = new Set(); loadingDays = true; resetDate(); renderCalendar();
    if (!configured) { loadingDays = false; return; }
    setStatus('Checking appointment availability…');
    try {
      const data = await request(`/api/Patient_Appointment/getavailabledays?userid=${encodeURIComponent(doctorId)}&type=${type}`);
      if (sequence !== daysSequence) return;
      if (!Array.isArray(data)) throw new Error('invalid-days');
      availableDays = new Set(data.filter(day => typeof day === 'string').map(day => day.toLowerCase()));
      setStatus(availableDays.size ? '' : 'No appointment days are currently available for this consultation type.');
    } catch {
      if (sequence === daysSequence) setStatus('Appointment availability could not be loaded. Please try again or contact the clinic.');
    } finally {
      if (sequence === daysSequence) { loadingDays = false; renderCalendar(); }
    }
  }
  async function loadSlots() {
    const sequence = ++slotsSequence, selectedDate = dateInput.value, selectedType = type;
    resetSlots('Loading time slots…');
    if (!canChoose(parseDate(selectedDate))) { resetSlots(); return; }
    const data = new FormData(); data.append('UserId',doctorId);data.append('Date',selectedDate);data.append('Type',type);
    try {
      const rows = await request('/api/Patient_Appointment/getslots',{method:'POST',body:data});
      if (sequence !== slotsSequence || selectedDate !== dateInput.value || selectedType !== type) return;
      if (!Array.isArray(rows)) throw new Error('invalid-slots');
      resetSlots();
      rows.forEach(row => { if (row && row.id != null && typeof row.label === 'string') {
        const option = new Option(row.label,String(row.id)); option.dataset.label = row.label;slots.add(option);
      }});
      slots.disabled = slots.options.length === 1;
      if (slots.disabled) resetSlots('No Slots Available');
      error('preferredTime',slots.disabled ? 'No time slots are available for this date. Please choose another date.' : '');
    } catch {
      if (sequence !== slotsSequence) return;
      resetSlots('Time slots unavailable');error('preferredTime','Time slots could not be loaded. Please select the date again.');
    }
  }
  dateInput.addEventListener('change',loadSlots);
  function selectType(next, focus = false) {
    if (!modes[next] || posting) return;
    const changed = next !== type; type = next;
    [clinicTab, onlineTab].forEach(tab => {
      const selected = (tab === clinicTab ? 'offline' : 'online') === type;
      tab.classList.toggle('is-active',selected);tab.setAttribute('aria-selected',String(selected));tab.tabIndex = selected ? 0 : -1;
    });
    form.setAttribute('aria-labelledby', type === 'online' ? 'onlineConsultTab' : 'clinicVisitTab');
    if (focus) (type === 'online' ? onlineTab : clinicTab).focus();
    if (changed) loadDays();
  }
  clinicTab.addEventListener('click',() => selectType('offline'));
  onlineTab.addEventListener('click',() => selectType('online'));
  [clinicTab,onlineTab].forEach(tab => tab.addEventListener('keydown',event => {
    if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
    event.preventDefault();
    const target = event.key === 'Home' ? 'offline' : event.key === 'End' ? 'online' : type === 'offline' ? 'online' : 'offline';
    if (modes[target]) (target === 'online' ? onlineTab : clinicTab).click();
    (type === 'online' ? onlineTab : clinicTab).focus();
  }));
  const info = $('onlineConsultInfo'), tip = $('onlineConsultTip');
  function toggleInfo(visible) { tip.hidden = !visible;info.setAttribute('aria-expanded',String(visible)); }
  info.addEventListener('pointerenter',event => { if(event.pointerType === 'mouse') toggleInfo(true); });
  info.addEventListener('pointerleave',event => { if(event.pointerType === 'mouse' && document.activeElement !== info) toggleInfo(false); });
  info.addEventListener('focus',() => toggleInfo(true));
  info.addEventListener('blur',() => toggleInfo(false));
  info.addEventListener('click',() => toggleInfo(true));
  document.addEventListener('click',event => { if (!info.contains(event.target) && !tip.contains(event.target)) toggleInfo(false); });
  // Consent: only the enabled I Agree action grants consent. No programmatic checkbox bypass.
  const consentDialog = consent.querySelector('.consent-modal-dialog');
  function updateSubmit() { submit.disabled = !consentAccepted || !checkbox.checked || posting; }
  function openConsent() {
    consentAccepted = false; checkbox.checked = false; consentRead = false;
    $('consentAgreeBtn').disabled = true;$('consentModalFooter').classList.remove('is-read');
    show(consent,$('consentModalClose'));consentDialog.scrollTop=0;updateSubmit();
    track('consent_modal_open');requestAnimationFrame(checkRead);
  }
  function checkRead() {
    if (!consent.classList.contains('is-open') || consentRead) return;
    if(consentDialog.scrollHeight - consentDialog.scrollTop - consentDialog.clientHeight <= 8) {
      consentRead=true;$('consentAgreeBtn').disabled=false;$('consentModalFooter').classList.add('is-read');track('consent_scrolled_to_bottom');
    }
  }
  function closeConsent(agreed, method) {
    consentAccepted = Boolean(agreed && consentRead);checkbox.checked=consentAccepted;
    track(consentAccepted?'consent_agreed':'consent_dismissed',{method,scrolled_to_bottom:consentRead});
    show(modal,checkbox);updateSubmit();error('consentCheckbox','');
  }
  checkbox.addEventListener('click',event => {
    if (checkbox.checked) {
      event.preventDefault();
      if(event.isTrusted) track('consent_checkbox_click',{checked:true});
      openConsent();
    }
  });
  checkbox.addEventListener('change',event => {
    if (!event.isTrusted) return;
    if(!checkbox.checked) { consentAccepted=false;track('consent_checkbox_click',{checked:false});updateSubmit(); }
  });
  consentDialog.addEventListener('scroll',checkRead,{passive:true});window.addEventListener('resize',checkRead);
  $('consentAgreeBtn').addEventListener('click',() => {if(consentRead)closeConsent(true,'agree_button');});
  $('consentModalClose').addEventListener('click',() => closeConsent(false,'close_button'));
  $('consentModalBackdrop').addEventListener('click',() => closeConsent(false,'backdrop'));
  // Date picker: local dates, working days, a real 30-day window and stale-response protection.
  dateDisplay.setAttribute('aria-expanded','false');dateDisplay.setAttribute('aria-controls','preferredDateCalendar');
  dateDisplay.setAttribute('aria-haspopup','dialog');calendar.setAttribute('role','dialog');calendar.setAttribute('aria-label','Choose an appointment date');
  function renderCalendar() {
    const title=calendar.querySelector('[data-cal-title]'),grid=calendar.querySelector('[data-cal-grid]');
    title.textContent=month.toLocaleDateString('en-US',{month:'long',year:'numeric'});grid.replaceChildren();
    for(let i=0;i<month.getDay();i++){const blank=document.createElement('span');blank.className='booking-calendar-day booking-calendar-day--empty';blank.setAttribute('aria-hidden','true');grid.append(blank);}
    const total=new Date(month.getFullYear(),month.getMonth()+1,0).getDate();
    for(let day=1;day<=total;day++){
      const date=new Date(month.getFullYear(),month.getMonth(),day),button=document.createElement('button');
      button.type='button';button.className='booking-calendar-day';button.textContent=day;button.dataset.date=iso(date);
      button.setAttribute('aria-label',date.toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'}));
      button.disabled=!canChoose(date);button.classList.toggle('is-disabled',button.disabled);
      button.classList.toggle('is-selected',iso(date)===dateInput.value);button.classList.toggle('is-today',iso(date)===iso(today));
      button.addEventListener('click',()=>{dateInput.value=iso(date);dateDisplay.value=date.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'});dateInput.dispatchEvent(new Event('change',{bubbles:true}));error('preferredDate','');closeCalendar();dateDisplay.focus();});
      grid.append(button);
    }
    calendar.querySelector('[data-cal-prev]').disabled=month<=new Date(today.getFullYear(),today.getMonth(),1);
    calendar.querySelector('[data-cal-next]').disabled=new Date(month.getFullYear(),month.getMonth()+1,1)>lastDate;
  }
  function closeCalendar(){calendar.hidden=true;dateField.classList.remove('is-open');dateDisplay.setAttribute('aria-expanded','false');}
  function openCalendar(){calendar.hidden=false;dateField.classList.add('is-open');dateDisplay.setAttribute('aria-expanded','true');renderCalendar();}
  dateDisplay.addEventListener('click',()=>calendar.hidden?openCalendar():closeCalendar());
  dateDisplay.addEventListener('keydown',event=>{if(['Enter',' ','ArrowDown'].includes(event.key)){event.preventDefault();openCalendar();calendar.querySelector('button:not(:disabled)')?.focus();}});
  calendar.querySelector('[data-cal-prev]').addEventListener('click',()=>{month=new Date(month.getFullYear(),month.getMonth()-1,1);renderCalendar();});
  calendar.querySelector('[data-cal-next]').addEventListener('click',()=>{month=new Date(month.getFullYear(),month.getMonth()+1,1);renderCalendar();});
  document.addEventListener('click',event=>{if(!dateField.contains(event.target))closeCalendar();});
  // Required real library; fail closed while its utilities are unavailable.
  if (typeof window.intlTelInput === 'function') {
    iti=window.intlTelInput(form.phone,{initialCountry:'in',countryOrder:['in'],separateDialCode:true,
      loadUtils:()=>import('https://cdn.jsdelivr.net/npm/intl-tel-input@29.2.2/dist/js/utils.js')});
    phonePromise=iti.promise.then(()=>{phoneUtilsReady=true;return true;}).catch(()=>false);
    form.phone.addEventListener('countrychange',()=>{if(form.phone.value)validate('phone');});
  }
  form.fullName.addEventListener('input',()=>{form.fullName.value=form.fullName.value.replace(/[^\p{L}\p{M} '\u2019-]/gu,'');});
  const validators={
    fullName:()=>!form.fullName.value.trim()?'Please enter your full name.':!/^\p{L}[\p{L}\p{M} '\u2019-]*$/u.test(form.fullName.value.trim())?'Use letters, spaces, apostrophes or hyphens only.':'',
    email:()=>!form.email.value.trim()?'Please enter your email address.':!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.value.trim())?'Please enter a valid email address.':'',
    phone:()=>!form.phone.value.trim()?'Please enter your phone number.':!iti||!phoneUtilsReady?'Phone validation is unavailable. Please reload or contact the clinic.':!iti.isValidNumber()?'Please enter a valid phone number.':'',
    preferredDate:()=>!dateInput.value?'Please select a preferred date.':!canChoose(parseDate(dateInput.value))?'Please choose an available date within the next 30 days.':'',
    preferredTime:()=>!slots.value||slots.disabled?'Please select an available time slot.':'',
    reason:()=>form.reason.value.trim().length<10?'Please provide a brief description (min 10 characters).':'',
    report:()=>{const f=form.report.files[0];return !f?'':!['image/jpeg','image/png','application/pdf'].includes(f.type)?'Only JPEG, PNG, or PDF files are allowed.':f.size>5*1024*1024?'File size must not exceed 5 MB.':'';},
    consentCheckbox:()=>!consentAccepted||!checkbox.checked?'Please read and agree to the consent notice.':''
  };
  function validate(name){const message=validators[name]();error(name,message);return !message;}
  ['fullName','email','phone','reason'].forEach(name=>{form[name].addEventListener('blur',()=>validate(name));form[name].addEventListener('input',()=>{if(form[name].getAttribute('aria-invalid')==='true')validate(name);});});
  slots.addEventListener('change',()=>validate('preferredTime'));
  function clearPreview(){if(previewUrl)URL.revokeObjectURL(previewUrl);previewUrl=null;$('reportPreview').classList.remove('is-visible');$('reportPreviewThumb').removeAttribute('src');}
  form.report.addEventListener('change',()=>{
    clearPreview();if(!validate('report'))return;const file=form.report.files[0];if(!file)return;
    $('reportPreviewName').textContent=file.name;$('reportPreviewSize').textContent=`${(file.size/1024).toFixed(1)} KB`;
    const image=file.type.startsWith('image/');$('reportPreviewThumb').hidden=!image;$('reportPreviewIcon').hidden=image;
    if(image){previewUrl=URL.createObjectURL(file);$('reportPreviewThumb').src=previewUrl;$('reportPreviewThumb').alt='Selected report preview';}
    $('reportPreview').classList.add('is-visible');track('report_uploaded');
  });
  $('reportPreviewRemove').addEventListener('click',()=>{form.report.value='';clearPreview();error('report','');});
  form.querySelector('.booking-upload-btn').addEventListener('keydown',event=>{if(['Enter',' '].includes(event.key)){event.preventDefault();event.currentTarget.click();}});
  async function compress(file){
    if(!file||!file.type.startsWith('image/'))return file;
    const bitmap=await createImageBitmap(file);const ratio=Math.min(1,800/bitmap.width,800/bitmap.height);
    const canvas=document.createElement('canvas');canvas.width=Math.round(bitmap.width*ratio);canvas.height=Math.round(bitmap.height*ratio);
    const context=canvas.getContext('2d');context.fillStyle='#fff';context.fillRect(0,0,canvas.width,canvas.height);context.drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close();
    const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',0.5));if(!blob)throw new Error('image-compression');
    return new File([blob],file.name.replace(/\.[^.]+$/,'')+'.jpg',{type:'image/jpeg'});
  }
  function readSnapshot(){return {type,name:form.fullName.value.trim(),phone:iti.getNumber(),email:form.email.value.trim(),date:dateInput.value,
    slotId:slots.value,time:slots.selectedOptions[0].dataset.label,reason:form.reason.value.trim(),file:form.report.files[0]||null};}
  form.addEventListener('submit',async event=>{
    event.preventDefault();if(posting)return;
    await Promise.race([phonePromise,new Promise(resolve=>setTimeout(resolve,5000))]);
    const invalid=Object.keys(validators).filter(name=>!validate(name));
    if(invalid.length){(invalid[0]==='preferredDate'?dateDisplay:form[invalid[0]])?.focus();return;}
    if(!configured){setStatus('Online booking is not configured yet. Please contact the clinic.');return;}
    snapshot=readSnapshot();const dl=$('bookingReviewDetails');dl.replaceChildren();
    const rows=[['Consultation',type==='online'?'Online Consultation':'Clinic Visit'],['Full name',snapshot.name],['Phone',snapshot.phone],['Email',snapshot.email],['Date',dateDisplay.value],['Time',snapshot.time],['Reason',snapshot.reason],['Report',snapshot.file?snapshot.file.name:'No report attached']];
    if(type==='offline')rows.push(['Clinic',[form.dataset.clinicname,form.dataset.address,form.dataset.district,form.dataset.state,form.dataset.pincode].filter(Boolean).join(', ')]);
    rows.forEach(([label,value])=>{const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;dd.textContent=value;dl.append(dt,dd);});
    $('bookingReviewError').textContent='';show(review,$('bookingReviewEdit'));
  });
  function backToForm(){if(!posting)show(modal,submit);}
  ['bookingReviewEdit','bookingReviewClose','bookingReviewBackdrop'].forEach(id=>$(id).addEventListener('click',backToForm));
  $('bookingReviewConfirm').addEventListener('click',async()=>{
    if(posting||!snapshot||!consentAccepted||!checkbox.checked)return;
    posting=true;updateSubmit();$('bookingReviewConfirm').disabled=true;$('bookingReviewEdit').disabled=true;
    $('bookingReviewConfirm').textContent='Submitting…';$('bookingReviewError').textContent='';
    try{
      const data=new FormData();const values={DoctorId:doctorId,FullName:snapshot.name,Phone:snapshot.phone,Email:snapshot.email,Date:snapshot.date,Type:snapshot.type,Day:parseDate(snapshot.date).toLocaleDateString('en-US',{weekday:'long'}),SlotId:snapshot.slotId,Time:snapshot.time,Reason:snapshot.reason};
      Object.entries(values).forEach(([key,value])=>data.append(key,value));
      if(snapshot.file)data.append('Upload',await compress(snapshot.file));
      const result=await request('/api/Patient_Appointment/patient_appointment',{method:'POST',body:data});
      const acceptedType=result?.data?.type??result?.type;
      if(acceptedType!==snapshot.type||result?.error)throw new Error('unconfirmed-response');
      window.__trackBookingSuccess?.(snapshot.type);
      const confirmedType=snapshot.type;form.reset();consentAccepted=false;checkbox.checked=false;clearPreview();resetDate();
      iti?.setNumber('');iti?.setSelectedCountry('in');snapshot=null;
      showConfirmation(confirmedType);
    }catch{
      $('bookingReviewError').textContent='We could not confirm this booking. Your details are still here. Before trying again, check with the clinic whether the request was received.';
    }finally{
      posting=false;$('bookingReviewConfirm').disabled=false;$('bookingReviewEdit').disabled=false;$('bookingReviewConfirm').textContent='Confirm Appointment';updateSubmit();
    }
  });
  function showConfirmation(confirmedType){
    review.classList.remove('is-open');review.setAttribute('aria-hidden','true');
    const overlay=document.createElement('div');overlay.id='bookingPopup';overlay.className='booking-popup-overlay';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-labelledby','bookingPopupTitle');
    overlay.innerHTML='<div class="booking-popup"><div class="booking-popup-icon"><i class="fa-solid fa-circle-check" aria-hidden="true"></i></div><h2 id="bookingPopupTitle">Appointment booked</h2><p></p><button type="button" class="booking-popup-ok">OK</button></div>';
    overlay.querySelector('p').textContent=confirmedType==='online'?'Your online consultation booking was accepted. Please check the appointment details provided by the clinic.':'Your clinic visit booking was accepted. Please check the appointment details provided by the clinic.';
    document.body.append(overlay);window.DigiDrDialogs.activate(overlay,overlay.querySelector('button'));
    function dismiss(){overlay.remove();window.DigiDrDialogs.activate(null);returnFocus?.focus({preventScroll:true});document.removeEventListener('keydown',escapePopup);}
    function escapePopup(e){if(e.key==='Escape'){e.preventDefault();dismiss();}}
    overlay.querySelector('button').addEventListener('click',dismiss);overlay.addEventListener('click',e=>{if(e.target===overlay)dismiss();});document.addEventListener('keydown',escapePopup);
  }
  document.addEventListener('keydown',event=>{
    if(event.key!=='Escape'||posting)return;
    if(consent.classList.contains('is-open')){event.preventDefault();closeConsent(false,'escape_key');}
    else if(review.classList.contains('is-open')){event.preventDefault();backToForm();}
    else if(modal.classList.contains('is-open')){
      event.preventDefault();if(!tip.hidden)toggleInfo(false);else if(!calendar.hidden){closeCalendar();dateDisplay.focus();}else closeBooking();
    }
  });
  resetSlots();updateSubmit();renderCalendar();
  if(configured){
    (async()=>{try{
      const data=await request(`/api/Patient_Appointment/getappointment?userid=${encodeURIComponent(doctorId)}`);
      modes={offline:data.offline===true,online:data.online===true};clinicTab.hidden=!modes.offline;onlineTab.hidden=!modes.online;info.hidden=!modes.online;
      if(!modes.offline&&!modes.online){document.querySelectorAll('.cta-btn').forEach(el=>el.hidden=true);setStatus('Online appointment requests are not currently available.');return;}
      type=modes.offline?'offline':'online';selectType(type);await loadDays();
    }catch{availableDays=new Set();setStatus('Appointment availability could not be loaded. Please contact the clinic.');}})();
  }
})();

// Booking success is emitted only after an accepted API response.
window.__trackBookingSuccess = function (type) {
  window.trackEvent?.("booking_submitted", { appointment_type: type === "offline" ? "clinic" : type });
};

(function () {
  function checkTruncation(wrap) {
    var btn = wrap.querySelector(".read-more-btn");
    var content = wrap.querySelector(".read-more-content");
    if (!btn || !content) return;

    if (wrap.classList.contains("is-expanded")) { btn.style.display = ""; return; }
    var isTruncated = wrap.classList.contains("is-expanded") || content.scrollHeight > content.clientHeight + 2;
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
    const MAX_POST_AGE_DAYS = 183;
    const POSTS_PER_ACCOUNT = 50;
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
        return /\/(?:videos|reel|reels|watch)(?:\/|\?|$)/i.test(url);
    }

    function isRecent(createdAt) {
        const t = Date.parse(createdAt);
        if (isNaN(t)) return false; // Fail closed — unknown age is treated as stale.
        const age = (Date.now() - t) / 86400000;
        return age >= 0 && age <= MAX_POST_AGE_DAYS;
    }

    const DIGIDR_TAG = /#digidr(?!\w)/i;
    function hasDigiDrTag(message) { return typeof message === "string" && DIGIDR_TAG.test(message); }
    function safeFacebookUrl(value) {
      try { const u = new URL(value); return u.protocol === "https:" && (u.hostname === "facebook.com" || u.hostname.endsWith(".facebook.com")); } catch { return false; }
    }
    function fetchDoctorPosts(slug) {
        const url = API_BASE + "/api/MicrositeSocialFeed/" +
            encodeURIComponent(slug) + "?limit=" + POSTS_PER_ACCOUNT;

        return fetchJson(url).then((data) => {
            if (!data || data.success === false || !Array.isArray(data.feeds)) return [];

            const entries = [];
            const seen = new Set();
            data.feeds.forEach((feed) => {
                if (!feed || feed.platform !== "facebook" || !Array.isArray(feed.posts)) return;
                feed.posts.forEach((post) => {
                    if (!post || !safeFacebookUrl(post.permalink) || seen.has(post.permalink)) return;
                    if (!hasDigiDrTag(post.message)) return;
                    if (isVideoPermalink(post.permalink)) return;
                    if (!isRecent(post.createdAt)) return;
                    seen.add(post.permalink);
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
            const fits = carousel.scrollWidth <= carousel.clientWidth + 1;
            prevBtn.hidden = nextBtn.hidden = fits;
            prevBtn.disabled = carousel.scrollLeft <= 0;
            nextBtn.disabled = carousel.scrollLeft >= carousel.scrollWidth - carousel.clientWidth - 1;
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

/* Hero: show only the year in "Practising since" */
(function () {
  document.querySelectorAll("[data-practising-since]").forEach(function (el) {
    var m = el.textContent.match(/(?:19|20)\d{2}/);
    if (m) el.textContent = m[0];
  });
})();
