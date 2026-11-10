/* Shared modal accessibility: one active focus scope, inert background and focus return. */
window.DigiDrDialog = (() => {
  const stack = [];
  const saved = new Map();
  let bodyOverflow = '';
  const focusable = root => [...root.querySelectorAll('a[href],button,input,select,textarea,[tabindex]')]
    .filter(e => !e.disabled && e.tabIndex >= 0 && !e.closest('[hidden],[inert]') && e.getClientRects().length && getComputedStyle(e).visibility !== 'hidden');
  function restoreInert() { saved.forEach((value, el) => { el.inert = value; }); saved.clear(); }
  function sync() {
    restoreInert();
    const active = stack.at(-1)?.root;
    if (!active) { document.body.style.overflow = bodyOverflow; return; }
    document.body.style.overflow = 'hidden';
    function isolate(parent) {
      [...parent.children].forEach(el => {
        if (['SCRIPT','STYLE','LINK'].includes(el.tagName) || el === active) return;
        if (el.contains(active)) isolate(el);
        else { saved.set(el, el.inert); el.inert = true; }
      });
    }
    isolate(document.body);
  }
  document.addEventListener('keydown', e => {
    const root = stack.at(-1)?.root;
    if (!root || e.key !== 'Tab') return;
    const items = focusable(root), first = items[0], last = items.at(-1);
    if (!first) { e.preventDefault(); root.focus(); return; }
    if (e.shiftKey && (document.activeElement === first || !root.contains(document.activeElement))) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && (document.activeElement === last || !root.contains(document.activeElement))) {
      e.preventDefault(); first.focus();
    }
  }, true);
  return {
    open(root, focus, returnTo) {
      if (!stack.length) bodyOverflow = document.body.style.overflow;
      if (!stack.some(item => item.root === root)) stack.push({root, returnTo: returnTo || document.activeElement});
      sync();
      (focus || focusable(root)[0] || root).focus({preventScroll:true});
    },
    close(root, restoreFocus = true) {
      const idx = stack.findIndex(item => item.root === root);
      if (idx < 0) return;
      const [item] = stack.splice(idx, 1);
      sync();
      if (restoreFocus && item.returnTo?.isConnected && !item.returnTo.closest('[inert]')) item.returnTo.focus({preventScroll:true});
    },
    top: () => stack.at(-1)?.root
  };
})();

// GA4 tracking lives in script/analytics.js (window.trackEvent + the
// data-ga-event click delegation). Loaded before this file on every page.

// Always start fresh on load/refresh: reset scroll position and strip any
// URL hash left over from in-page nav so a reload never resumes mid-page.
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

const inboundHash = window.location.hash;
if (inboundHash) {
  history.replaceState(null, '', window.location.pathname + window.location.search);
  requestAnimationFrame(() => { try {document.querySelector(inboundHash)?.scrollIntoView({block:'start'});} catch (_) {} });
} else { window.scrollTo(0,0); }

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

if (menuToggle && mainNav) {
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

document.addEventListener('keydown', event => {
  if(event.key === 'Escape' && mainNav?.classList.contains('open')) {
    mainNav.classList.remove('open'); menuToggle.setAttribute('aria-expanded','false'); menuToggle.focus();
  }
});

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
    section.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    history.replaceState(null, '', location.pathname + location.search);
    if (link.classList.contains('skip-link')) section.focus({preventScroll:true});
});

/* Hero: show only the year in "Practising since"; hide the fellowship line when empty */
(function () {
  var since = document.querySelector('[data-practising-since]');
  if (since) {
    var m = since.textContent.match(/\b(?:19|20)\d{2}\b/);
    if (m) since.textContent = m[0];
  }
  var fel = document.querySelector('[data-hero-fellowship]');
  if (fel && (!fel.textContent.replace(/Fellowship:/i, "").trim() || fel.textContent.indexOf("{{") !== -1)) { fel.hidden = true; fel.style.display = "none"; }
})();

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
    if (!template.includes(",")) return String(value);
    return value.toLocaleString("en-US");
  }

  function animateCount(el) {
    const original = el.textContent;
    const parsed = parseTarget(original);
    if (!parsed) return;

    const { target, prefix, suffix } = parsed;

    if (prefersReducedMotion) {
      el.textContent = prefix + suffix;
      return;
    }

    el.textContent = "0" + suffix;

    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / DURATION, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);
      el.textContent = formatWithCommas(current, prefix) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  statEls.forEach((el) => observer.observe(el));
})();

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
    if(currentIdx === -1) galleryTrigger = galleryImages[index]?.closest(".gallery-item");
    currentIdx = index;
    const img = galleryImages[currentIdx];
    if (img) {
      lightboxImage.src = img.src;
      lightboxImage.alt = img.alt || "Enlarged gallery image";
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      window.DigiDrDialog.open(lightbox,closeBtn,galleryTrigger);
    }
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImage.removeAttribute("src");
    window.DigiDrDialog.close(lightbox);
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
    trigger.addEventListener("click", () => openLightbox(idx));
    trigger.addEventListener("keydown", e => { if(e.key === 'Enter' || e.key === ' '){e.preventDefault();openLightbox(idx);} });
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

// Booking, consent, review and confirmation. API field names follow AGENTS.md A.18.
(function () {
  const form = document.getElementById('bookingForm');
  const modal = document.getElementById('bookingModal');
  if (!form || !modal) return;
  const $ = id => document.getElementById(id);
  const API_BASE = 'https://digidrapi.digidr.app';
  const doctorId = (form.dataset.userid || '').trim();
  const clinicTab = $('clinicVisitTab'), onlineTab = $('onlineConsultTab');
  const submit = $('submitBtn'), consent = $('consentCheckbox');
  const dateInput = $('preferredDate'), dateText = $('preferredDateText');
  const calendar = $('preferredDateCalendar'), calendarField = $('preferredDateField');
  const dateGrid = calendar.querySelector('[data-cal-grid]');
  const calendarTitle = calendar.querySelector('[data-cal-title]');
  const prevMonth = calendar.querySelector('[data-cal-prev]'), nextMonth = calendar.querySelector('[data-cal-next]');
  const time = $('preferredTime'), loader = $('bookingLoader');
  const consentModal = $('consentModal'), consentDialog = consentModal.querySelector('.consent-modal-dialog');
  const agree = $('consentAgreeBtn'), consentFooter = $('consentModalFooter');
  const review = $('bookingReview'), reviewList = $('bookingReviewList');
  const info = $('onlineConsultInfo'), tip = $('onlineConsultTip');
  const notice = $('bookingStatus');
  const today = new Date(); today.setHours(0,0,0,0);
  const limit = new Date(today); limit.setDate(limit.getDate() + 30);
  let viewDate = new Date(today.getFullYear(),today.getMonth(),1);
  let type = 'offline', availableDays = null, modesReady = false, allowedModes = {offline:false,online:false};
  let generation = 0, slotGeneration = 0, isSubmitting = false, activeTrigger = null;
  let iti = null, phoneUtilsReady = false, phonePromise = Promise.resolve();
  let previewURL = null, consentRead = false;
  const track = (name, params) => window.trackEvent?.(name,params);
  const iso = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  const parseDate = value => /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(value + 'T00:00:00') : new Date(NaN);
  const insideWindow = d => Number.isFinite(d.getTime()) && d >= today && d <= limit;
  const dayName = d => d.toLocaleDateString('en-US',{weekday:'long'}).toLowerCase();
  const dateAllowed = d => insideWindow(d) && (availableDays instanceof Set && availableDays.has(dayName(d)));
  function status(text) { notice.textContent = text || ''; }
  status('Checking appointment availability…');
  function error(name, message) {
    const el = form.querySelector(`[data-error-for="${name}"]`);
    if (el) { el.textContent = message || ''; el.id = 'booking-error-' + name; el.setAttribute('role','status'); }
    const input = name === 'preferredDate' ? dateText : form.elements.namedItem(name);
    if (input) { input.setAttribute('aria-invalid', String(Boolean(message))); input.classList.toggle('is-invalid',Boolean(message)); if(el) input.setAttribute('aria-describedby',el.id); }
  }
  function clearErrors() { form.querySelectorAll('[data-error-for]').forEach(el => error(el.dataset.errorFor,'')); }
  function phoneError() {
    if (!form.phone.value.trim()) return 'Please enter your phone number.';
    if (!iti || !phoneUtilsReady) return 'Phone validation is unavailable. Reconnect and reopen this page before submitting.';
    try { return iti.isValidNumber() ? '' : 'Please enter a valid phone number.'; }
    catch (_) { return 'Phone validation is unavailable. Please try again.'; }
  }
  if (typeof window.intlTelInput === 'function') {
    try {
      iti = window.intlTelInput(form.phone, {
        initialCountry:'in',countryOrder:['in'],separateDialCode:true,
        loadUtils:() => import('https://cdn.jsdelivr.net/npm/intl-tel-input@29.2.2/dist/js/utils.js')
      });
      phonePromise = iti.promise.then(() => {phoneUtilsReady=true;}).catch(() => {phoneUtilsReady=false;});
      form.phone.addEventListener('countrychange', () => { if(form.phone.value) error('phone',phoneError()); });
    } catch (_) { iti=null; }
  }
  function fileError(file) {
    if (!file) return '';
    const types = {'application/pdf':/\.pdf$/i,'image/jpeg':/\.jpe?g$/i,'image/png':/\.png$/i};
    if (!types[file.type]?.test(file.name)) return 'Only PDF, JPG or PNG files are allowed.';
    if (file.size > 5 * 1024 * 1024) return 'Please choose a file of 5 MB or smaller.';
    if (!file.size) return 'This file is empty. Please choose another file.';
    return '';
  }
  function validate(name) {
    const value = String(form.elements.namedItem(name)?.value || '').trim();
    let message='';
    if (name === 'fullName') message = !value ? 'Please enter your full name.' : !/^[\p{L}\p{M}\s'-]+$/u.test(value) ? 'Use letters, spaces, apostrophes or hyphens only.' : '';
    if (name === 'email') message = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Please enter a valid email address.';
    if (name === 'phone') message = phoneError();
    if (name === 'preferredDate') message = !value ? 'Please select a preferred date.' : !dateAllowed(parseDate(value)) ? 'Choose an available date within the next 30 days.' : '';
    if (name === 'preferredTime') message = !value || !time.querySelector(`option:checked`)?.dataset.label ? 'Please select an available time slot.' : '';
    if (name === 'reason') message = value.length < 10 ? 'Please provide a brief description (min 10 characters).' : '';
    if (name === 'report') message = fileError(form.report.files[0]);
    if (name === 'consentCheckbox') message = consent.checked && consentRead ? '' : 'Please read the notice and provide consent to proceed.';
    error(name,message); return !message;
  }
  function resetSlots(label='Select Time Slot') { time.replaceChildren(new Option(label,'')); time.disabled=true; }
  function closeCalendar() { calendar.hidden=true; calendarField.classList.remove('is-open'); dateText.setAttribute('aria-expanded','false'); }
  function clearDate() { dateInput.value='';dateText.value='';resetSlots();closeCalendar(); }
  function renderCalendar() {
    calendarTitle.textContent=viewDate.toLocaleDateString('en-US',{month:'long',year:'numeric'});
    dateGrid.replaceChildren();
    const first=new Date(viewDate.getFullYear(),viewDate.getMonth(),1);
    const count=new Date(viewDate.getFullYear(),viewDate.getMonth()+1,0).getDate();
    for(let i=0;i<first.getDay();i++){const s=document.createElement('span');s.className='booking-calendar-day--empty';dateGrid.append(s);}
    for(let n=1;n<=count;n++){
      const d=new Date(viewDate.getFullYear(),viewDate.getMonth(),n), button=document.createElement('button');
      button.type='button';button.className='booking-calendar-day';button.textContent=n;
      button.dataset.date=iso(d);button.disabled=!dateAllowed(d);
      button.classList.toggle('is-disabled',button.disabled);
      button.classList.toggle('is-today',iso(d)===iso(today));
      button.classList.toggle('is-selected',iso(d)===dateInput.value);
      button.setAttribute('aria-label',d.toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'}));
      button.setAttribute('aria-pressed',String(iso(d)===dateInput.value));
      button.addEventListener('click',()=>{dateInput.value=iso(d);dateText.value=d.toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'});closeCalendar();dateInput.dispatchEvent(new Event('change',{bubbles:true}));dateText.focus();});
      dateGrid.append(button);
    }
    prevMonth.disabled = new Date(viewDate.getFullYear(),viewDate.getMonth(),1) <= new Date(today.getFullYear(),today.getMonth(),1);
    nextMonth.disabled = new Date(viewDate.getFullYear(),viewDate.getMonth()+1,1) > limit;
  }
  function openCalendar(){renderCalendar();calendar.hidden=false;calendarField.classList.add('is-open');dateText.setAttribute('aria-expanded','true');}
  dateText.addEventListener('click',()=>calendar.hidden?openCalendar():closeCalendar());
  dateText.addEventListener('keydown',e=>{if(['Enter',' ','ArrowDown'].includes(e.key)){e.preventDefault();openCalendar();dateGrid.querySelector('button:not(:disabled)')?.focus();}});
  prevMonth.addEventListener('click',()=>{if(!prevMonth.disabled){viewDate=new Date(viewDate.getFullYear(),viewDate.getMonth()-1,1);renderCalendar();}});
  nextMonth.addEventListener('click',()=>{if(!nextMonth.disabled){viewDate=new Date(viewDate.getFullYear(),viewDate.getMonth()+1,1);renderCalendar();}});
  dateGrid.addEventListener('keydown',e=>{
    const delta={ArrowLeft:-1,ArrowRight:1,ArrowUp:-7,ArrowDown:7}[e.key];
    if(!delta)return;
    const cells=[...dateGrid.querySelectorAll('button')],index=cells.indexOf(document.activeElement);
    let next=index+delta;while(cells[next]?.disabled)next+=Math.sign(delta);
    if(cells[next]){e.preventDefault();cells[next].focus();}
  });
  document.addEventListener('click',e=>{if(!calendarField.contains(e.target))closeCalendar();});
  async function getJSON(path,options={}) {
    const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),10000);
    try{
      const response=await fetch(API_BASE+path,{...options,signal:controller.signal,credentials:'omit'});
      if(!response.ok)throw new Error('Request failed');
      return await response.json();
    }finally{clearTimeout(timeout);}
  }
  async function loadAvailableDays(){
    const ticket=++generation, selectedType=type;availableDays=null;renderCalendar();
    if(!doctorId || !modesReady)return;
    try{
      const data=await getJSON('/api/Patient_Appointment/getavailabledays?userid='+encodeURIComponent(doctorId)+'&type='+selectedType);
      if(ticket!==generation)return;
      availableDays=new Set(Array.isArray(data)?data.filter(d=>typeof d==='string').map(d=>d.toLowerCase()):[]);
      status(availableDays.size?'':'No appointment days are currently available for this consultation mode.');
    }catch(_){if(ticket===generation){availableDays=new Set();status('Availability could not be loaded. Please try again or contact the clinic.');}}
    renderCalendar();
  }
  function setType(next){
    if(modesReady && !allowedModes[next])return;
    const changed=next!==type;type=next;
    clinicTab.classList.toggle('is-active',type==='offline');onlineTab.classList.toggle('is-active',type==='online');
    [clinicTab,onlineTab].forEach(t=>t.setAttribute('aria-selected',String(t.classList.contains('is-active'))));
    if(changed){++slotGeneration;clearDate();error('preferredDate','');error('preferredTime','');loadAvailableDays();}
  }
  clinicTab.addEventListener('click',()=>setType('offline'));
  onlineTab.addEventListener('click',()=>setType('online'));
  [clinicTab,onlineTab].forEach(tab=>tab.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight'].includes(e.key)){const other=tab===clinicTab?onlineTab:clinicTab;if(!other.hidden){e.preventDefault();other.focus();other.click();}}}));
  async function loadModes(){
    if(!doctorId || doctorId.includes('{{')){status('Online booking is not configured. Please contact the clinic.');return;}
    try{
      const data=await getJSON('/api/Patient_Appointment/getappointment?userid='+encodeURIComponent(doctorId));
      allowedModes={offline:data.offline===true,online:data.online===true};modesReady=true;
      clinicTab.hidden=!allowedModes.offline;onlineTab.hidden=!allowedModes.online;info.hidden=!allowedModes.online;
      if(!allowedModes.offline&&!allowedModes.online){document.querySelectorAll('.cta-btn,[data-open-booking]').forEach(e=>e.hidden=true);status('Online booking is not available. Please contact the clinic.');availableDays=new Set();return;}
      setType(allowedModes.offline?'offline':'online');status('');await loadAvailableDays();
    }catch(_){status('Availability could not be loaded. Please try again or contact the clinic.');availableDays=new Set();}
  }
  dateInput.addEventListener('change',async()=>{
    error('preferredDate','');resetSlots('Loading time slots…');const ticket=++slotGeneration, chosenDate=dateInput.value, chosenType=type;
    if(!dateAllowed(parseDate(chosenDate))){resetSlots();return;}
    try{
      let slots;
      {const data=new FormData();data.append('UserId',doctorId);data.append('Date',chosenDate);data.append('Type',chosenType);slots=await getJSON('/api/Patient_Appointment/getslots',{method:'POST',body:data});}
      if(ticket!==slotGeneration||chosenDate!==dateInput.value||chosenType!==type)return;
      resetSlots();
      if(Array.isArray(slots))slots.forEach(slot=>{if(slot?.id==null||typeof slot.label!=='string')return;const option=new Option(slot.label,String(slot.id));option.dataset.label=slot.label;time.append(option);});
      if(time.options.length>1)time.disabled=false;else resetSlots('No Slots Available');
    }catch(_){if(ticket===slotGeneration){resetSlots('Unable to load slots');error('preferredTime','Time slots could not be loaded. Choose the date again to retry.');}}
  });
  function openModal(trigger){activeTrigger=trigger||document.activeElement;modal.classList.add('is-open');modal.setAttribute('aria-hidden','false');modal.querySelector('.booking-modal-dialog').scrollTop=0;window.DigiDrDialog.open(modal,$('bookingModalClose'),activeTrigger);}
  function closeModal(){if(isSubmitting)return;modal.classList.remove('is-open');modal.setAttribute('aria-hidden','true');closeCalendar();toggleTip(false);window.DigiDrDialog.close(modal);}
  document.querySelectorAll('.cta-btn,[data-open-booking]').forEach(button=>button.addEventListener('click',e=>{e.preventDefault();openModal(button);}));
  $('bookingModalClose').addEventListener('click',closeModal);$('bookingModalBackdrop').addEventListener('click',closeModal);
  function toggleTip(show){tip.hidden=!show;info.setAttribute('aria-expanded',String(show));}
  info.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')toggleTip(true);});
  info.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse'&&!info.matches(':focus'))toggleTip(false);});
  info.addEventListener('focus',()=>toggleTip(true));info.addEventListener('blur',()=>toggleTip(false));
  info.addEventListener('click',()=>toggleTip(true));
  document.addEventListener('click',e=>{if(!info.contains(e.target))toggleTip(false);});
  function openConsent(){
    consentRead=false;agree.disabled=true;consentFooter.classList.remove('is-read');consent.checked=false;submit.disabled=true;
    modal.classList.remove('is-open');modal.setAttribute('aria-hidden','true');
    consentModal.classList.add('is-open');consentModal.setAttribute('aria-hidden','false');
    consentDialog.scrollTop=0;window.DigiDrDialog.open(consentModal,$('consentModalClose'),consent);track('consent_modal_open');requestAnimationFrame(checkRead);
  }
  function checkRead(){
    if(!consentModal.classList.contains('is-open')||consentRead)return;
    if(consentDialog.scrollHeight-consentDialog.scrollTop-consentDialog.clientHeight<=8){consentRead=true;agree.disabled=false;consentFooter.classList.add('is-read');track('consent_scrolled_to_bottom');}
  }
  function closeConsent(accepted,method){
    if(accepted&&!consentRead)return;
    track(accepted?'consent_agreed':'consent_dismissed',{method,scrolled_to_bottom:consentRead});
    consent.checked=accepted;submit.disabled=!accepted;if(accepted)error('consentCheckbox','');
    consentModal.classList.remove('is-open');consentModal.setAttribute('aria-hidden','true');
    modal.classList.add('is-open');modal.setAttribute('aria-hidden','false');window.DigiDrDialog.close(consentModal);consent.focus();
  }
  consent.addEventListener('change',e=>{
    if(!e.isTrusted)return;track('consent_checkbox_click',{checked:consent.checked});
    if(consent.checked)openConsent();else{consentRead=false;submit.disabled=true;}
  });
  consentDialog.addEventListener('scroll',checkRead,{passive:true});window.addEventListener('resize',checkRead);
  $('consentModalClose').addEventListener('click',()=>closeConsent(false,'close_button'));
  $('consentModalBackdrop').addEventListener('click',()=>closeConsent(false,'backdrop'));
  agree.addEventListener('click',()=>closeConsent(true,'agree_button'));
  function renderReport(file){
    if(previewURL){URL.revokeObjectURL(previewURL);previewURL=null;}
    const box=$('reportPreview'),thumb=$('reportPreviewThumb'),icon=$('reportPreviewIcon');
    box.classList.toggle('is-visible',Boolean(file));thumb.hidden=true;thumb.removeAttribute('src');icon.hidden=true;
    if(!file)return;
    $('reportPreviewName').textContent=file.name;$('reportPreviewSize').textContent=(file.size/1024).toFixed(1)+' KB';
    if(file.type.startsWith('image/')){previewURL=URL.createObjectURL(file);thumb.src=previewURL;thumb.alt='Selected report preview';thumb.hidden=false;}else icon.hidden=false;
  }
  form.report.addEventListener('change',()=>{const file=form.report.files[0],message=fileError(file);error('report',message);renderReport(message?null:file);if(file&&!message)track('report_uploaded');});
  $('reportPreviewRemove').addEventListener('click',()=>{form.report.value='';renderReport(null);error('report','');});
  $('uploadReportBtn').addEventListener('click',()=>form.report.click());
  form.fullName.addEventListener('input',()=>{form.fullName.value=form.fullName.value.replace(/[^\p{L}\p{M}\s'-]/gu,'');});
  ['fullName','email','phone','reason'].forEach(name=>{form[name].addEventListener('blur',()=>validate(name));form[name].addEventListener('input',()=>{if(form[name].getAttribute('aria-invalid')==='true')validate(name);});});
  form.preferredTime.addEventListener('change',()=>validate('preferredTime'));
  function endReview(){if(isSubmitting)return;review.hidden=true;form.hidden=false;modal.querySelector('.booking-modal-header').hidden=false;submit.focus();}
  $('bookingEdit').addEventListener('click',endReview);
  function buildReview(){
    reviewList.replaceChildren();
    const entries=[['Consultation',type==='online'?'Online Consultation':'Clinic Visit'],['Name',form.fullName.value],['Phone',iti.getNumber()],['Email',form.email.value],['Date',dateText.value],['Time',time.selectedOptions[0]?.dataset.label||''],['Reason',form.reason.value],['Report',form.report.files[0]?.name||'No report attached']];
    entries.forEach(([title,value])=>{const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=title;dd.textContent=value;reviewList.append(dt,dd);});
    $('bookingConfirm').textContent='Confirm appointment request';
    $('reviewNotice').textContent='Check these details before sending your appointment request.';
    form.hidden=true;modal.querySelector('.booking-modal-header').hidden=true;review.hidden=false;modal.querySelector('.booking-modal-dialog').scrollTop=0;$('bookingEdit').focus();
  }
  form.addEventListener('submit',async e=>{
    e.preventDefault();if(isSubmitting||!review.hidden)return;
    // A stalled utility download must not bypass validation or block forever.
    await Promise.race([phonePromise,new Promise(resolve=>setTimeout(resolve,5000))]);
    clearErrors();const fields=['fullName','phone','email','preferredDate','preferredTime','reason','report','consentCheckbox'];
    const invalid=fields.filter(name=>!validate(name));
    if(invalid.length){(invalid[0]==='preferredDate'?dateText:form.elements.namedItem(invalid[0])).focus();return;}
    if((!doctorId||!modesReady||!allowedModes[type])){status('Booking is not available. Please contact the clinic.');return;}
    buildReview();
  });
  async function compressImage(file){
    if(file.type==='application/pdf')return file;
    const bitmap=await createImageBitmap(file),ratio=Math.min(1,800/bitmap.width,800/bitmap.height);
    const canvas=document.createElement('canvas');canvas.width=Math.round(bitmap.width*ratio);canvas.height=Math.round(bitmap.height*ratio);
    canvas.getContext('2d').drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close();
    const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',0.5));if(!blob)throw new Error('Image conversion failed');
    return new File([blob],file.name.replace(/\.[^.]+$/,'')+'.jpg',{type:'image/jpeg'});
  }
  function reset(){form.reset();consentRead=false;submit.disabled=true;renderReport(null);clearErrors();clearDate();iti?.setNumber('');iti?.setSelectedCountry('in');review.hidden=true;form.hidden=false;modal.querySelector('.booking-modal-header').hidden=false;}
  function showPopup(title,message,success){
    const overlay=document.createElement('div');overlay.id='bookingPopup';overlay.className='booking-popup-overlay';
    overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-labelledby','bookingPopupTitle');
    const box=document.createElement('div');box.className='booking-popup'+(success?'':' is-error');
    const h=document.createElement('h2');h.id='bookingPopupTitle';h.textContent=title;
    const text=document.createElement('p');text.textContent=message;const ok=document.createElement('button');ok.type='button';ok.className='booking-popup-ok';ok.textContent='OK';
    box.append(h,text,ok);overlay.append(box);document.body.append(overlay);window.DigiDrDialog.open(overlay,ok,success?activeTrigger:$('bookingConfirm'));
    function dismiss(){window.DigiDrDialog.close(overlay);overlay.remove();document.removeEventListener('keydown',key);}
    const key=e=>{if(e.key==='Escape'&&window.DigiDrDialog.top()===overlay){e.preventDefault();e.stopImmediatePropagation();dismiss();}};
    document.addEventListener('keydown',key,true);ok.addEventListener('click',dismiss);overlay.addEventListener('click',e=>{if(e.target===overlay)dismiss();});
  }
  $('bookingConfirm').addEventListener('click',async()=>{
    if(isSubmitting)return;
    const consentGiven=consent.checked && consentRead;
    if(!consentGiven){endReview();error('consentCheckbox','Please read the notice and provide consent to proceed.');return;}
    isSubmitting=true;$('bookingConfirm').disabled=true;$('bookingEdit').disabled=true;$('bookingReviewStatus').textContent='Sending your request…';loader.setAttribute('aria-hidden','false');
    try{
      const data=new FormData();data.append('DoctorId',doctorId);data.append('FullName',form.fullName.value.trim());data.append('Phone',iti.getNumber());data.append('Email',form.email.value.trim());data.append('Date',dateInput.value);data.append('Type',type);data.append('Day',parseDate(dateInput.value).toLocaleDateString('en-US',{weekday:'long'}));data.append('SlotId',time.value);data.append('Time',time.selectedOptions[0].dataset.label);data.append('Reason',form.reason.value.trim());
      if(form.report.files[0])data.append('Upload',await compressImage(form.report.files[0]));
      const result=await getJSON('/api/Patient_Appointment/patient_appointment',{method:'POST',body:data});
      const resultType=result?.data?.type??result?.type;
      const meetLink=result?.data?.meetLink??result?.meetLink;
      if(result?.success===false||resultType!==type)throw new Error('Appointment not confirmed');
      isSubmitting=false;reset();closeModal();
      const location=[form.dataset.clinicname,form.dataset.address,form.dataset.district,form.dataset.state,form.dataset.pincode].filter(Boolean).join(', ');
      showPopup('Appointment confirmed',type==='online'?(meetLink?'Your online consultation is confirmed. Please join 5 minutes before your scheduled time. Check your email for joining details.':'Your online consultation is confirmed. Contact the clinic for joining details.'):'Your clinic appointment is confirmed. Appointment location: '+location,true);
      window.__trackBookingSuccess?.(type);
    }catch(_){showPopup('Unable to confirm','The appointment could not be confirmed. Your details are still available. Contact the clinic before retrying to avoid a duplicate request.',false);}
    finally{isSubmitting=false;$('bookingConfirm').disabled=false;$('bookingEdit').disabled=false;$('bookingReviewStatus').textContent='';loader.setAttribute('aria-hidden','true');}
  });
  document.addEventListener('keydown',e=>{
    if(e.key!=='Escape')return;
    if(window.DigiDrDialog.top()===consentModal){closeConsent(false,'escape_key');return;}
    if(window.DigiDrDialog.top()!==modal)return;
    if(!tip.hidden){toggleTip(false);info.focus();return;}
    if(!calendar.hidden){closeCalendar();dateText.focus();return;}
    if(!review.hidden){endReview();return;}closeModal();
  });
  window.__onAppointmentTypeChange = loadAvailableDays;
  resetSlots();loadModes();
})();
window.__trackBookingSuccess = function(type){window.trackEvent?.('booking_submitted',{appointment_type:type});};


(function () {
  function checkTruncation(wrap) {
    var btn = wrap.querySelector(".read-more-btn");
    var content = wrap.querySelector(".read-more-content");
    if (!btn || !content) return;

    if (wrap.classList.contains("is-expanded")) { btn.style.display = ""; return; }
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

// Hide the chatbot launcher while the footer is on screen
// Facebook Posts Carousel — live embeds from the DigiDr social feed API.
// Cards hold Facebook SDK embeds, which must never be cloned (a cloned embed
// renders blank) nor re-parented (that reloads the iframe). So the DOM is built
// once and left alone: paging only changes the container's scrollLeft, which
// the browser handles natively without touching any card.
(function () {
    // Slug comes from the body data-slug attribute; only HTML pages are templated.
    // An unreplaced slug tag counts as unset, so the section is hidden.
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
        track?.removeAttribute("aria-busy");
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
        return t <= Date.now() && (Date.now() - t) / 86400000 <= MAX_POST_AGE_DAYS;
    }

    const DIGIDR_TAG = /#digidr(?!\w)/i;
    function hasDigiDrTag(message) {
        return typeof message === "string" && DIGIDR_TAG.test(message);
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
                    if (!post || !post.permalink) return;
                    try {const link = new URL(post.permalink);if(link.protocol !== 'https:' || !/(^|\.)facebook\.com$/i.test(link.hostname)) return;} catch (_) {return;}
                    if(seen.has(post.permalink)) return; seen.add(post.permalink);
                    if (isVideoPermalink(post.permalink)) return;
                    if (!isRecent(post.createdAt)) return;
                    if (!hasDigiDrTag(post.message)) return;
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

        }).catch(() => {
            // SDK never loaded — settle immediately into link cards.
            track.querySelectorAll(".social-post-card").forEach((card) => {
                card.dataset.deadline = "0";
            });
            settleAll();

        });
    }

    function renderPosts(entries) {
        const width = embedWidth();
        const frag = document.createDocumentFragment();
        entries.forEach((entry) => frag.appendChild(buildCard(entry, width)));
        track.innerHTML = ""; // drop the placeholder skeletons
        track.appendChild(frag);
        track.removeAttribute("aria-busy");
        initPaging();

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

// Local SVG rendering keeps icons visible when the icon CDN is blocked. No font binary is included.
(function(){
 const icons={"calendar-days":{"viewBox":"0 0 448 512","body":"<path d=\"M128 0c17.7 0 32 14.3 32 32l0 32 128 0 0-32c0-17.7 14.3-32 32-32s32 14.3 32 32l0 32 48 0c26.5 0 48 21.5 48 48l0 48L0 160l0-48C0 85.5 21.5 64 48 64l48 0 0-32c0-17.7 14.3-32 32-32zM0 192l448 0 0 272c0 26.5-21.5 48-48 48L48 512c-26.5 0-48-21.5-48-48L0 192zm64 80l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm128 0l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0zM64 400l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0zm112 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16z\"/>"},"calendar-check":{"viewBox":"0 0 448 512","body":"<path d=\"M128 0c17.7 0 32 14.3 32 32l0 32 128 0 0-32c0-17.7 14.3-32 32-32s32 14.3 32 32l0 32 48 0c26.5 0 48 21.5 48 48l0 48L0 160l0-48C0 85.5 21.5 64 48 64l48 0 0-32c0-17.7 14.3-32 32-32zM0 192l448 0 0 272c0 26.5-21.5 48-48 48L48 512c-26.5 0-48-21.5-48-48L0 192zM329 305c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-95 95-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L329 305z\"/>"},"phone":{"viewBox":"0 0 512 512","body":"<path d=\"M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z\"/>"},"circle-info":{"viewBox":"0 0 512 512","body":"<path d=\"M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336l24 0 0-64-24 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l48 0c13.3 0 24 10.7 24 24l0 88 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z\"/>"},"location-dot":{"viewBox":"0 0 384 512","body":"<path d=\"M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z\"/>"},"ear-listen":{"viewBox":"0 0 512 512","body":"<path d=\"M398.3 3.4c-15.8-7.9-35-1.5-42.9 14.3c-7.9 15.8-1.5 34.9 14.2 42.9l.4 .2c.4 .2 1.1 .6 2.1 1.2c2 1.2 5 3 8.7 5.6c7.5 5.2 17.6 13.2 27.7 24.2C428.5 113.4 448 146 448 192c0 17.7 14.3 32 32 32s32-14.3 32-32c0-66-28.5-113.4-56.5-143.7C441.6 33.2 427.7 22.2 417.3 15c-5.3-3.7-9.7-6.4-13-8.3c-1.6-1-3-1.7-4-2.2c-.5-.3-.9-.5-1.2-.7l-.4-.2-.2-.1c0 0 0 0-.1 0c0 0 0 0 0 0L384 32 398.3 3.4zM128.7 227.5c6.2-56 53.7-99.5 111.3-99.5c61.9 0 112 50.1 112 112c0 29.3-11.2 55.9-29.6 75.9c-17 18.4-34.4 45.1-34.4 78l0 6.1c0 26.5-21.5 48-48 48c-17.7 0-32 14.3-32 32s14.3 32 32 32c61.9 0 112-50.1 112-112l0-6.1c0-9.8 5.4-21.7 17.4-34.7C398.3 327.9 416 286 416 240c0-97.2-78.8-176-176-176C149.4 64 74.8 132.5 65.1 220.5c-1.9 17.6 10.7 33.4 28.3 35.3s33.4-10.7 35.3-28.3zM32 512a32 32 0 1 0 0-64 32 32 0 1 0 0 64zM192 352a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zM41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-64-64c-12.5-12.5-32.8-12.5-45.3 0zM208 240c0-17.7 14.3-32 32-32s32 14.3 32 32c0 13.3 10.7 24 24 24s24-10.7 24-24c0-44.2-35.8-80-80-80s-80 35.8-80 80c0 13.3 10.7 24 24 24s24-10.7 24-24z\"/>"},"file-circle-check":{"viewBox":"0 0 576 512","body":"<path d=\"M0 64C0 28.7 28.7 0 64 0L224 0l0 128c0 17.7 14.3 32 32 32l128 0 0 38.6C310.1 219.5 256 287.4 256 368c0 59.1 29.1 111.3 73.7 143.3c-3.2 .5-6.4 .7-9.7 .7L64 512c-35.3 0-64-28.7-64-64L0 64zm384 64l-128 0L256 0 384 128zM288 368a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm211.3-43.3c-6.2-6.2-16.4-6.2-22.6 0L416 385.4l-28.7-28.7c-6.2-6.2-16.4-6.2-22.6 0s-6.2 16.4 0 22.6l40 40c6.2 6.2 16.4 6.2 22.6 0l72-72c6.2-6.2 6.2-16.4 0-22.6z\"/>"},"instagram":{"viewBox":"0 0 448 512","body":"<path d=\"M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z\"/>"},"arrow-left":{"viewBox":"0 0 448 512","body":"<path d=\"M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z\"/>"},"arrow-down":{"viewBox":"0 0 384 512","body":"<path d=\"M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z\"/>"},"notes-medical":{"viewBox":"0 0 512 512","body":"<path d=\"M96 352L96 96c0-35.3 28.7-64 64-64l256 0c35.3 0 64 28.7 64 64l0 197.5c0 17-6.7 33.3-18.7 45.3l-58.5 58.5c-12 12-28.3 18.7-45.3 18.7L160 416c-35.3 0-64-28.7-64-64zM272 128c-8.8 0-16 7.2-16 16l0 48-48 0c-8.8 0-16 7.2-16 16l0 32c0 8.8 7.2 16 16 16l48 0 0 48c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-48 48 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-48 0 0-48c0-8.8-7.2-16-16-16l-32 0zm24 336c13.3 0 24 10.7 24 24s-10.7 24-24 24l-160 0C60.9 512 0 451.1 0 376L0 152c0-13.3 10.7-24 24-24s24 10.7 24 24l0 224c0 48.6 39.4 88 88 88l160 0z\"/>"},"youtube":{"viewBox":"0 0 576 512","body":"<path d=\"M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z\"/>"},"chevron-left":{"viewBox":"0 0 320 512","body":"<path d=\"M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z\"/>"},"graduation-cap":{"viewBox":"0 0 640 512","body":"<path d=\"M320 32c-8.1 0-16.1 1.4-23.7 4.1L15.8 137.4C6.3 140.9 0 149.9 0 160s6.3 19.1 15.8 22.6l57.9 20.9C57.3 229.3 48 259.8 48 291.9l0 28.1c0 28.4-10.8 57.7-22.3 80.8c-6.5 13-13.9 25.8-22.5 37.6C0 442.7-.9 448.3 .9 453.4s6 8.9 11.2 10.2l64 16c4.2 1.1 8.7 .3 12.4-2s6.3-6.1 7.1-10.4c8.6-42.8 4.3-81.2-2.1-108.7C90.3 344.3 86 329.8 80 316.5l0-24.6c0-30.2 10.2-58.7 27.9-81.5c12.9-15.5 29.6-28 49.2-35.7l157-61.7c8.2-3.2 17.5 .8 20.7 9s-.8 17.5-9 20.7l-157 61.7c-12.4 4.9-23.3 12.4-32.2 21.6l159.6 57.6c7.6 2.7 15.6 4.1 23.7 4.1s16.1-1.4 23.7-4.1L624.2 182.6c9.5-3.4 15.8-12.5 15.8-22.6s-6.3-19.1-15.8-22.6L343.7 36.1C336.1 33.4 328.1 32 320 32zM128 408c0 35.3 86 72 192 72s192-36.7 192-72L496.7 262.6 354.5 314c-11.1 4-22.8 6-34.5 6s-23.5-2-34.5-6L143.3 262.6 128 408z\"/>"},"file-prescription":{"viewBox":"0 0 384 512","body":"<path d=\"M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-288-128 0c-17.7 0-32-14.3-32-32L224 0 64 0zM256 0l0 128 128 0L256 0zM104 196l72 0c33.1 0 60 26.9 60 60c0 25.5-15.9 47.2-38.3 55.9l43 40.3 33.8-31c8.1-7.5 20.8-6.9 28.3 1.2s6.9 20.8-1.2 28.3L270 379.7l31.7 29.7c8.1 7.6 8.5 20.2 .9 28.3s-20.2 8.5-28.3 .9l-33.9-31.8-34.9 32c-8.1 7.5-20.8 6.9-28.3-1.2s-6.9-20.8 1.2-28.3l32.6-29.9-64.8-60.8c-.9-.8-1.6-1.7-2.3-2.6l-20 0 0 44c0 11-9 20-20 20s-20-9-20-20l0-64 0-80c0-11 9-20 20-20zm72 80c11 0 20-9 20-20s-9-20-20-20l-52 0 0 40 52 0z\"/>"},"clipboard-list":{"viewBox":"0 0 384 512","body":"<path d=\"M192 0c-41.8 0-77.4 26.7-90.5 64L64 64C28.7 64 0 92.7 0 128L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64l-37.5 0C269.4 26.7 233.8 0 192 0zm0 64a32 32 0 1 1 0 64 32 32 0 1 1 0-64zM72 272a24 24 0 1 1 48 0 24 24 0 1 1 -48 0zm104-16l128 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-128 0c-8.8 0-16-7.2-16-16s7.2-16 16-16zM72 368a24 24 0 1 1 48 0 24 24 0 1 1 -48 0zm88 0c0-8.8 7.2-16 16-16l128 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-128 0c-8.8 0-16-7.2-16-16z\"/>"},"file-pdf":{"viewBox":"0 0 512 512","body":"<path d=\"M0 64C0 28.7 28.7 0 64 0L224 0l0 128c0 17.7 14.3 32 32 32l128 0 0 144-208 0c-35.3 0-64 28.7-64 64l0 144-48 0c-35.3 0-64-28.7-64-64L0 64zm384 64l-128 0L256 0 384 128zM176 352l32 0c30.9 0 56 25.1 56 56s-25.1 56-56 56l-16 0 0 32c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-48 0-80c0-8.8 7.2-16 16-16zm32 80c13.3 0 24-10.7 24-24s-10.7-24-24-24l-16 0 0 48 16 0zm96-80l32 0c26.5 0 48 21.5 48 48l0 64c0 26.5-21.5 48-48 48l-32 0c-8.8 0-16-7.2-16-16l0-128c0-8.8 7.2-16 16-16zm32 128c8.8 0 16-7.2 16-16l0-64c0-8.8-7.2-16-16-16l-16 0 0 96 16 0zm80-112c0-8.8 7.2-16 16-16l48 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0 0 32 32 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0 0 48c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-64 0-64z\"/>"},"chevron-right":{"viewBox":"0 0 320 512","body":"<path d=\"M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z\"/>"},"mortar-pestle":{"viewBox":"0 0 512 512","body":"<path d=\"M504.3 11.1C493.3-1.6 474.5-3.7 461 6.2L252.3 160l144.9 0L502.6 54.6c11.8-11.8 12.6-30.8 1.6-43.5zM32 192c-17.7 0-32 14.3-32 32s14.3 32 32 32c0 82.5 43.4 147.7 123.9 176.2c-11.1 13.9-19.4 30.3-23.9 48.1C127.6 497.4 142.3 512 160 512l192 0c17.7 0 32.4-14.6 28.1-31.7c-4.5-17.8-12.8-34.1-23.9-48.1C436.6 403.7 480 338.5 480 256c17.7 0 32-14.3 32-32s-14.3-32-32-32L32 192z\"/>"},"xmark":{"viewBox":"0 0 384 512","body":"<path d=\"M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z\"/>"},"facebook-f":{"viewBox":"0 0 320 512","body":"<path d=\"M80 299.3V512H196V299.3h86.5l18-97.8H196V166.9c0-51.7 20.3-71.5 72.7-71.5c16.3 0 29.4 .4 37 1.2V7.9C291.4 4 256.4 0 236.2 0C129.3 0 80 50.5 80 159.4v42.1H14v97.8H80z\"/>"},"linkedin-in":{"viewBox":"0 0 448 512","body":"<path d=\"M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z\"/>"},"language":{"viewBox":"0 0 640 512","body":"<path d=\"M0 128C0 92.7 28.7 64 64 64l192 0 48 0 16 0 256 0c35.3 0 64 28.7 64 64l0 256c0 35.3-28.7 64-64 64l-256 0-16 0-48 0L64 448c-35.3 0-64-28.7-64-64L0 128zm320 0l0 256 256 0 0-256-256 0zM178.3 175.9c-3.2-7.2-10.4-11.9-18.3-11.9s-15.1 4.7-18.3 11.9l-64 144c-4.5 10.1 .1 21.9 10.2 26.4s21.9-.1 26.4-10.2l8.9-20.1 73.6 0 8.9 20.1c4.5 10.1 16.3 14.6 26.4 10.2s14.6-16.3 10.2-26.4l-64-144zM160 233.2L179 276l-38 0 19-42.8zM448 164c11 0 20 9 20 20l0 4 44 0 16 0c11 0 20 9 20 20s-9 20-20 20l-2 0-1.6 4.5c-8.9 24.4-22.4 46.6-39.6 65.4c.9 .6 1.8 1.1 2.7 1.6l18.9 11.3c9.5 5.7 12.5 18 6.9 27.4s-18 12.5-27.4 6.9l-18.9-11.3c-4.5-2.7-8.8-5.5-13.1-8.5c-10.6 7.5-21.9 14-34 19.4l-3.6 1.6c-10.1 4.5-21.9-.1-26.4-10.2s.1-21.9 10.2-26.4l3.6-1.6c6.4-2.9 12.6-6.1 18.5-9.8l-12.2-12.2c-7.8-7.8-7.8-20.5 0-28.3s20.5-7.8 28.3 0l14.6 14.6 .5 .5c12.4-13.1 22.5-28.3 29.8-45L448 228l-72 0c-11 0-20-9-20-20s9-20 20-20l52 0 0-4c0-11 9-20 20-20z\"/>"},"route":{"viewBox":"0 0 512 512","body":"<path d=\"M512 96c0 50.2-59.1 125.1-84.6 155c-3.8 4.4-9.4 6.1-14.5 5L320 256c-17.7 0-32 14.3-32 32s14.3 32 32 32l96 0c53 0 96 43 96 96s-43 96-96 96l-276.4 0c8.7-9.9 19.3-22.6 30-36.8c6.3-8.4 12.8-17.6 19-27.2L416 448c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0c-53 0-96-43-96-96s43-96 96-96l39.8 0c-21-31.5-39.8-67.7-39.8-96c0-53 43-96 96-96s96 43 96 96zM117.1 489.1c-3.8 4.3-7.2 8.1-10.1 11.3l-1.8 2-.2-.2c-6 4.6-14.6 4-20-1.8C59.8 473 0 402.5 0 352c0-53 43-96 96-96s96 43 96 96c0 30-21.1 67-43.5 97.9c-10.7 14.7-21.7 28-30.8 38.5l-.6 .7zM128 352a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zM416 128a32 32 0 1 0 0-64 32 32 0 1 0 0 64z\"/>"},"award":{"viewBox":"0 0 384 512","body":"<path d=\"M173.8 5.5c11-7.3 25.4-7.3 36.4 0L228 17.2c6 3.9 13 5.8 20.1 5.4l21.3-1.3c13.2-.8 25.6 6.4 31.5 18.2l9.6 19.1c3.2 6.4 8.4 11.5 14.7 14.7L344.5 83c11.8 5.9 19 18.3 18.2 31.5l-1.3 21.3c-.4 7.1 1.5 14.2 5.4 20.1l11.8 17.8c7.3 11 7.3 25.4 0 36.4L366.8 228c-3.9 6-5.8 13-5.4 20.1l1.3 21.3c.8 13.2-6.4 25.6-18.2 31.5l-19.1 9.6c-6.4 3.2-11.5 8.4-14.7 14.7L301 344.5c-5.9 11.8-18.3 19-31.5 18.2l-21.3-1.3c-7.1-.4-14.2 1.5-20.1 5.4l-17.8 11.8c-11 7.3-25.4 7.3-36.4 0L156 366.8c-6-3.9-13-5.8-20.1-5.4l-21.3 1.3c-13.2 .8-25.6-6.4-31.5-18.2l-9.6-19.1c-3.2-6.4-8.4-11.5-14.7-14.7L39.5 301c-11.8-5.9-19-18.3-18.2-31.5l1.3-21.3c.4-7.1-1.5-14.2-5.4-20.1L5.5 210.2c-7.3-11-7.3-25.4 0-36.4L17.2 156c3.9-6 5.8-13 5.4-20.1l-1.3-21.3c-.8-13.2 6.4-25.6 18.2-31.5l19.1-9.6C65 70.2 70.2 65 73.4 58.6L83 39.5c5.9-11.8 18.3-19 31.5-18.2l21.3 1.3c7.1 .4 14.2-1.5 20.1-5.4L173.8 5.5zM272 192a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM1.3 441.8L44.4 339.3c.2 .1 .3 .2 .4 .4l9.6 19.1c11.7 23.2 36 37.3 62 35.8l21.3-1.3c.2 0 .5 0 .7 .2l17.8 11.8c5.1 3.3 10.5 5.9 16.1 7.7l-37.6 89.3c-2.3 5.5-7.4 9.2-13.3 9.7s-11.6-2.2-14.8-7.2L74.4 455.5l-56.1 8.3c-5.7 .8-11.4-1.5-15-6s-4.3-10.7-2.1-16zm248 60.4L211.7 413c5.6-1.8 11-4.3 16.1-7.7l17.8-11.8c.2-.1 .4-.2 .7-.2l21.3 1.3c26 1.5 50.3-12.6 62-35.8l9.6-19.1c.1-.2 .2-.3 .4-.4l43.2 102.5c2.2 5.3 1.4 11.4-2.1 16s-9.3 6.9-15 6l-56.1-8.3-32.2 49.2c-3.2 5-8.9 7.7-14.8 7.2s-11-4.3-13.3-9.7z\"/>"},"x-twitter":{"viewBox":"0 0 512 512","body":"<path d=\"M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z\"/>"},"arrows-rotate":{"viewBox":"0 0 512 512","body":"<path d=\"M105.1 202.6c7.7-21.8 20.2-42.3 37.8-59.8c62.5-62.5 163.8-62.5 226.3 0L386.3 160 352 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l111.5 0c0 0 0 0 0 0l.4 0c17.7 0 32-14.3 32-32l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 35.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5zM39 289.3c-5 1.5-9.8 4.2-13.7 8.2c-4 4-6.7 8.8-8.1 14c-.3 1.2-.6 2.5-.8 3.8c-.3 1.7-.4 3.4-.4 5.1L16 432c0 17.7 14.3 32 32 32s32-14.3 32-32l0-35.1 17.6 17.5c0 0 0 0 0 0c87.5 87.4 229.3 87.4 316.7 0c24.4-24.4 42.1-53.1 52.9-83.8c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.5 62.5-163.8 62.5-226.3 0l-.1-.1L125.6 352l34.4 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L48.4 288c-1.6 0-3.2 .1-4.8 .3s-3.1 .5-4.6 1z\"/>"},"globe":{"viewBox":"0 0 512 512","body":"<path d=\"M352 256c0 22.2-1.2 43.6-3.3 64l-185.3 0c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64l185.3 0c2.2 20.4 3.3 41.8 3.3 64zm28.8-64l123.1 0c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64l-123.1 0c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zm112.6-32l-116.7 0c-10-63.9-29.8-117.4-55.3-151.6c78.3 20.7 142 77.5 171.9 151.6zm-149.1 0l-176.6 0c6.1-36.4 15.5-68.6 27-94.7c10.5-23.6 22.2-40.7 33.5-51.5C239.4 3.2 248.7 0 256 0s16.6 3.2 27.8 13.8c11.3 10.8 23 27.9 33.5 51.5c11.6 26 20.9 58.2 27 94.7zm-209 0L18.6 160C48.6 85.9 112.2 29.1 190.6 8.4C165.1 42.6 145.3 96.1 135.3 160zM8.1 192l123.1 0c-2.1 20.6-3.2 42-3.2 64s1.1 43.4 3.2 64L8.1 320C2.8 299.5 0 278.1 0 256s2.8-43.5 8.1-64zM194.7 446.6c-11.6-26-20.9-58.2-27-94.6l176.6 0c-6.1 36.4-15.5 68.6-27 94.6c-10.5 23.6-22.2 40.7-33.5 51.5C272.6 508.8 263.3 512 256 512s-16.6-3.2-27.8-13.8c-11.3-10.8-23-27.9-33.5-51.5zM135.3 352c10 63.9 29.8 117.4 55.3 151.6C112.2 482.9 48.6 426.1 18.6 352l116.7 0zm358.1 0c-30 74.1-93.6 130.9-171.9 151.6c25.5-34.2 45.2-87.7 55.3-151.6l116.7 0z\"/>"},"chevron-down":{"viewBox":"0 0 512 512","body":"<path d=\"M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z\"/>"},"whatsapp":{"viewBox":"0 0 448 512","body":"<path d=\"M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z\"/>"},"users":{"viewBox":"0 0 640 512","body":"<path d=\"M144 0a80 80 0 1 1 0 160A80 80 0 1 1 144 0zM512 0a80 80 0 1 1 0 160A80 80 0 1 1 512 0zM0 298.7C0 239.8 47.8 192 106.7 192l42.7 0c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0L21.3 320C9.6 320 0 310.4 0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7l42.7 0C592.2 192 640 239.8 640 298.7c0 11.8-9.6 21.3-21.3 21.3l-213.3 0zM224 224a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zM128 485.3C128 411.7 187.7 352 261.3 352l117.3 0C452.3 352 512 411.7 512 485.3c0 14.7-11.9 26.7-26.7 26.7l-330.7 0c-14.7 0-26.7-11.9-26.7-26.7z\"/>"},"laptop-medical":{"viewBox":"0 0 640 512","body":"<path d=\"M64 96c0-35.3 28.7-64 64-64l384 0c35.3 0 64 28.7 64 64l0 256-64 0 0-256L128 96l0 256-64 0L64 96zM0 403.2C0 392.6 8.6 384 19.2 384l601.6 0c10.6 0 19.2 8.6 19.2 19.2c0 42.4-34.4 76.8-76.8 76.8L76.8 480C34.4 480 0 445.6 0 403.2zM288 160c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16l0 48 48 0c8.8 0 16 7.2 16 16l0 32c0 8.8-7.2 16-16 16l-48 0 0 48c0 8.8-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16l0-48-48 0c-8.8 0-16-7.2-16-16l0-32c0-8.8 7.2-16 16-16l48 0 0-48z\"/>"},"share-nodes":{"viewBox":"0 0 448 512","body":"<path d=\"M352 224c53 0 96-43 96-96s-43-96-96-96s-96 43-96 96c0 4 .2 8 .7 11.9l-94.1 47C145.4 170.2 121.9 160 96 160c-53 0-96 43-96 96s43 96 96 96c25.9 0 49.4-10.2 66.6-26.9l94.1 47c-.5 3.9-.7 7.8-.7 11.9c0 53 43 96 96 96s96-43 96-96s-43-96-96-96c-25.9 0-49.4 10.2-66.6 26.9l-94.1-47c.5-3.9 .7-7.8 .7-11.9s-.2-8-.7-11.9l94.1-47C302.6 213.8 326.1 224 352 224z\"/>"},"id-card":{"viewBox":"0 0 576 512","body":"<path d=\"M0 96l576 0c0-35.3-28.7-64-64-64L64 32C28.7 32 0 60.7 0 96zm0 32L0 416c0 35.3 28.7 64 64 64l448 0c35.3 0 64-28.7 64-64l0-288L0 128zM64 405.3c0-29.5 23.9-53.3 53.3-53.3l117.3 0c29.5 0 53.3 23.9 53.3 53.3c0 5.9-4.8 10.7-10.7 10.7L74.7 416c-5.9 0-10.7-4.8-10.7-10.7zM176 192a64 64 0 1 1 0 128 64 64 0 1 1 0-128zm176 16c0-8.8 7.2-16 16-16l128 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-128 0c-8.8 0-16-7.2-16-16zm0 64c0-8.8 7.2-16 16-16l128 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-128 0c-8.8 0-16-7.2-16-16zm0 64c0-8.8 7.2-16 16-16l128 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-128 0c-8.8 0-16-7.2-16-16z\"/>"},"compass":{"viewBox":"0 0 512 512","body":"<path d=\"M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm50.7-186.9L162.4 380.6c-19.4 7.5-38.5-11.6-31-31l55.5-144.3c3.3-8.5 9.9-15.1 18.4-18.4l144.3-55.5c19.4-7.5 38.5 11.6 31 31L325.1 306.7c-3.2 8.5-9.9 15.1-18.4 18.4zM288 256a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z\"/>"},"facebook":{"viewBox":"0 0 512 512","body":"<path d=\"M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256C0 376 82.7 476.8 194.2 504.5V334.2H141.4V256h52.8V222.3c0-87.1 39.4-127.5 125-127.5c16.2 0 44.2 3.2 55.7 6.4V172c-6-.6-16.5-1-29.6-1c-42 0-58.2 15.9-58.2 57.2V256h83.6l-14.4 78.2H287V510.1C413.8 494.8 512 386.9 512 256h0z\"/>"}};
 function paint(root){root.querySelectorAll('i[class]:not(.has-local-icon)').forEach(el=>{
  const name=[...el.classList].map(c=>c.slice(3)).find(n=>icons[n]);if(!name)return;
  const data=icons[name];el.innerHTML='<svg class="local-icon" aria-hidden="true" focusable="false" viewBox="'+data.viewBox+'">'+data.body+'</svg>';el.classList.add('has-local-icon');el.setAttribute('aria-hidden','true');
 });}
 paint(document);
 new MutationObserver(records=>{if(records.some(r=>r.addedNodes.length))paint(document);}).observe(document.body,{childList:true,subtree:true});
})();
