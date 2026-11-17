/* Accessible dialog stack shared by booking, consent, lightbox and chat. */
window.DigiDrDialog = (() => {
  const stack = [];
  const inertBefore = new Map();
  let originalOverflow = '';
  const focusables = (root) => [...root.querySelectorAll('a[href],button,input,select,textarea,[tabindex]')]
    .filter(el => !el.disabled && el.tabIndex >= 0 && !el.closest('[inert]') && el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden');
  function sync() {
    inertBefore.forEach((value, el) => { el.inert = value; });
    inertBefore.clear();
    if (!stack.length) { document.body.style.overflow = originalOverflow; return; }
    let branch = stack[stack.length - 1].el;
    while (branch.parentElement && branch !== document.body) {
      for (const sibling of branch.parentElement.children) {
        if (sibling === branch || /^(SCRIPT|STYLE|LINK)$/.test(sibling.tagName)) continue;
        inertBefore.set(sibling, sibling.inert);
        sibling.inert = true;
      }
      branch = branch.parentElement;
    }
    document.body.style.overflow = 'hidden';
  }
  function open(el, options = {}) {
    if (stack.some(item => item.el === el)) return;
    if (!stack.length) originalOverflow = document.body.style.overflow;
    stack.push({ el, returnTo: options.returnTo || document.activeElement, onEscape: options.onEscape });
    sync();
    const first = options.initial || focusables(el)[0] || el;
    if (first === el) el.tabIndex = -1;
    first.focus({ preventScroll: true });
  }
  function close(el) {
    const index = stack.findIndex(item => item.el === el);
    if (index < 0) return;
    const [item] = stack.splice(index, 1);
    sync();
    if (item.returnTo?.isConnected && !item.returnTo.closest('[inert]')) item.returnTo.focus({preventScroll:true});
  }
  document.addEventListener('keydown', event => {
    const top = stack[stack.length - 1];
    if (!top) return;
    if (event.key === 'Escape' && top.onEscape) {
      event.preventDefault(); event.stopImmediatePropagation(); top.onEscape(); return;
    }
    if (event.key !== 'Tab') return;
    const list = focusables(top.el);
    if (!list.length) { event.preventDefault(); top.el.focus(); return; }
    const first = list[0], last = list[list.length - 1];
    if (event.shiftKey && (document.activeElement === first || !top.el.contains(document.activeElement))) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && (document.activeElement === last || !top.el.contains(document.activeElement))) {
      event.preventDefault(); first.focus();
    }
  }, true);
  document.addEventListener('focusin', event => {
    const top = stack[stack.length - 1];
    if (top && !top.el.contains(event.target)) (focusables(top.el)[0] || top.el).focus();
  });
  return {open, close};
})();

// GA4 tracking lives in script/analytics.js (window.trackEvent + the
// data-ga-event click delegation). Loaded before this file on every page.

// Always start fresh on load/refresh: reset scroll position and strip any
// URL hash left over from in-page nav so a reload never resumes mid-page.
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

const initialHash = window.location.hash;
if (initialHash) {
  const destination = document.getElementById(decodeURIComponent(initialHash.slice(1)));
  requestAnimationFrame(() => destination?.scrollIntoView({block:'start'}));
  history.replaceState(null, '', window.location.pathname + window.location.search);
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
    if (window.location.hash) history.replaceState(null, '', window.location.pathname + window.location.search);
    if (link.classList.contains('skip-link')) section.focus({preventScroll:true});
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

  lightbox.setAttribute("role","dialog"); lightbox.setAttribute("aria-modal","true"); lightbox.setAttribute("aria-label","Practice gallery image viewer");
  let currentIdx = -1;
  let galleryOpener = null;

  function openLightbox(index) {
    if (currentIdx < 0) galleryOpener = document.activeElement;
    currentIdx = index;
    const img = galleryImages[currentIdx];
    if (img) {
      lightboxImage.src = img.src;
      lightboxImage.alt = img.alt || "Enlarged gallery image";
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      window.DigiDrDialog.open(lightbox, {initial:closeBtn, returnTo:galleryOpener, onEscape:closeLightbox});
    }
  }

  function closeLightbox() {
    window.DigiDrDialog.close(lightbox);
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImage.removeAttribute("src");

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
    trigger.tabIndex = 0; trigger.setAttribute('role','button'); trigger.setAttribute('aria-label','Enlarge: '+img.alt);
    trigger.addEventListener('click', () => openLightbox(idx));
    trigger.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(idx); } });
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

// Booking: DigiDr endpoint contract from AGENTS.md A.18; never simulate a successful request.
const API_BASE = 'https://digidrapi.digidr.app';
(function initBooking() {
  const form = document.getElementById('bookingForm');
  const modal = document.getElementById('bookingModal');
  if (!form || !modal) return;
  const $ = id => document.getElementById(id);
  const fields = form.elements;
  const clinicTab = $('clinicVisitTab'), onlineTab = $('onlineConsultTab');
  const submitBtn = $('submitBtn'), consent = $('consentCheckbox');
  const notice = $('bookingStatus'), loader = $('bookingLoader');
  const doctorId = (form.dataset.userid || '').trim();
  const configured = !!doctorId && !/[{}\[\]]/.test(doctorId);
  let type = 'offline', availableDays = new Set(), slotIds = new Set();
  let availableModes = {online:false, offline:false};
  let daysRequest = 0, slotsRequest = 0, daysLoading = false, isSubmitting = false;
  let iti = null, phoneUtilsReady = false, phoneInitPromise = Promise.resolve();
  let acceptedFile = null, previewURL = null;
  let consentGiven = false, consentRead = false, isValidating = false;
  const today = new Date(); today.setHours(0,0,0,0);
  const maxDate = new Date(today); maxDate.setDate(maxDate.getDate()+30);
  let viewDate = new Date(today.getFullYear(),today.getMonth(),1);
  const iso = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  const parseDate = s => { const parts=s.split('-').map(Number); return parts.length===3 ? new Date(parts[0],parts[1]-1,parts[2]) : new Date(NaN); };
  const event = (name, params) => window.trackEvent?.(name,params);
  const status = text => {notice.textContent=text;notice.hidden=!text;};
  const error = (name,text) => {
    const el=form.querySelector(`[data-error-for="${name}"]`); if(el)el.textContent=text;
    const control = name==='preferredDate' ? $('preferredDateText') : fields.namedItem(name);
    control?.classList.toggle('is-invalid',!!text);control?.setAttribute('aria-invalid',String(!!text));
  };
  form.querySelectorAll('[data-error-for]').forEach(el=>{
    el.id='booking-error-'+el.dataset.errorFor;el.setAttribute('aria-live','polite');
    const target=el.dataset.errorFor==='preferredDate'?$('preferredDateText'):fields.namedItem(el.dataset.errorFor);
    target?.setAttribute('aria-describedby',el.id);
  });
  const updateSubmit = () => {submitBtn.disabled=!consentGiven||isSubmitting;};
  async function request(path, options={}) {
    const controller=new AbortController(), timeout=setTimeout(()=>controller.abort(),10000);
    try {
      const response=await fetch(API_BASE+path,{credentials:'omit',...options,signal:controller.signal});
      if(!response.ok)throw new Error('Request unavailable');
      const data=await response.json();
      if(data?.success===false)throw new Error('Request not accepted');
      return data;
    } finally { clearTimeout(timeout); }
  }
  if (window.intlTelInput) {
    try {
      iti=window.intlTelInput(fields.phone,{initialCountry:'in',countryOrder:['in'],separateDialCode:true,
        loadUtils:()=>import('https://cdn.jsdelivr.net/npm/intl-tel-input@29.2.2/dist/js/utils.js')});
      phoneInitPromise=iti.promise.then(()=>{phoneUtilsReady=true;}).catch(()=>{});
    } catch { iti=null; }
  }
  function resetSlots() {
    slotsRequest++;slotIds.clear();fields.preferredTime.replaceChildren(new Option('Select Time Slot',''));
    fields.preferredTime.disabled=true;
  }
  function clearDate() {
    fields.preferredDate.value='';$('preferredDateText').value='';resetSlots();closeCalendar();
    error('preferredDate','');error('preferredTime','');
  }
  async function loadDays() {
    const sequence=++daysRequest;availableDays=new Set();daysLoading=true;renderCalendar();
    if(!configured){daysLoading=false;return;}
    try {
      const days=await request('/api/Patient_Appointment/getavailabledays?userid='+encodeURIComponent(doctorId)+'&type='+type);
      if(sequence!==daysRequest)return;
      if(!Array.isArray(days))throw new Error('Invalid schedule');
      availableDays=new Set(days.filter(d=>typeof d==='string').map(d=>d.toLowerCase()));
      status(availableDays.size?'':'No appointment days are currently available for this consultation mode.');
    } catch { if(sequence===daysRequest)status('Appointment availability could not be loaded. Please try again later.'); }
    finally {if(sequence===daysRequest){daysLoading=false;renderCalendar();}}
  }
  async function loadSlots() {
    resetSlots();const selected=fields.preferredDate.value, requestType=type, sequence=slotsRequest;
    if(!configured||!selected)return;
    fields.preferredTime.replaceChildren(new Option('Loading time slots…',''));
    try {
      const body=new FormData();body.append('UserId',doctorId);body.append('Date',selected);body.append('Type',requestType);
      const slots=await request('/api/Patient_Appointment/getslots',{method:'POST',body});
      if(sequence!==slotsRequest||selected!==fields.preferredDate.value||requestType!==type)return;
      if(!Array.isArray(slots))throw new Error('Invalid slots');
      fields.preferredTime.replaceChildren(new Option(slots.length?'Select Time Slot':'No Slots Available',''));
      for(const slot of slots){if(slot?.id==null||typeof slot.label!=='string')continue;
        const option=new Option(slot.label,String(slot.id));option.dataset.label=slot.label;
        fields.preferredTime.append(option);slotIds.add(String(slot.id));}
      fields.preferredTime.disabled=!slotIds.size;
    } catch {
      if(sequence===slotsRequest){fields.preferredTime.replaceChildren(new Option('Slots unavailable',''));error('preferredTime','Could not load times. Choose the date again or try later.');}
    }
  }
  function selectType(next, userAction=true) {
    if(next===type&&userAction)return;
    type=next;form.dataset.appointmentType=type;
    for(const [button,key] of [[clinicTab,'offline'],[onlineTab,'online']]){
      const active=key===type;button.classList.toggle('is-active',active);
      button.setAttribute('aria-selected',String(active));button.tabIndex=active?0:-1;
    }
    form.setAttribute('aria-labelledby',type==='offline'?'clinicVisitTab':'onlineConsultTab');
    clearDate();loadDays();
  }
  clinicTab.addEventListener('click',()=>selectType('offline'));
  onlineTab.addEventListener('click',()=>selectType('online'));
  for(const tab of [clinicTab,onlineTab])tab.addEventListener('keydown',e=>{
    if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
    e.preventDefault();const choices=[clinicTab,onlineTab].filter(t=>!t.hidden);
    const next=e.key==='Home'?choices[0]:e.key==='End'?choices.at(-1):choices.find(t=>t!==tab)||tab;
    next.focus();next.click();
  });
  async function loadAvailability(){
    if(!configured){status('Online booking is not enabled for this profile. No appointment request can be submitted.');return;}
    status('Loading appointment availability…');
    try {
      const modes=await request('/api/Patient_Appointment/getappointment?userid='+encodeURIComponent(doctorId));
      availableModes={online:modes.online===true,offline:modes.offline===true};
      clinicTab.hidden=!availableModes.offline;onlineTab.hidden=!availableModes.online;$('onlineConsultInfo').hidden=!availableModes.online;
      if(!availableModes.offline&&!availableModes.online){
        status('No appointment modes are currently available.');
        document.querySelectorAll('.cta-btn').forEach(el=>{el.hidden=true;});return;
      }
      selectType(availableModes.offline?'offline':'online',false);
    }catch{status('Appointment availability could not be loaded. Please try again later.');}
  }
  function openBooking(trigger){
    modal.classList.add('is-open');modal.setAttribute('aria-hidden','false');
    window.DigiDrDialog.open(modal,{initial:$('bookingModalClose'),returnTo:trigger,onEscape:()=>{
      if(!$('onlineConsultTip').hidden){toggleTip(false);return;}
      if(!$('preferredDateCalendar').hidden){closeCalendar();$('preferredDateText').focus();return;}
      closeBooking();
    }});
  }
  function closeBooking(){
    if(isSubmitting)return;
    closeCalendar();toggleTip(false);window.DigiDrDialog.close(modal);
    modal.classList.remove('is-open');modal.setAttribute('aria-hidden','true');
  }
  document.querySelectorAll('.cta-btn,[data-open-booking]').forEach(btn=>btn.addEventListener('click',e=>{e.preventDefault();openBooking(btn);}));
  $('bookingModalClose').addEventListener('click',closeBooking);$('bookingModalBackdrop').addEventListener('click',closeBooking);
  const info=$('onlineConsultInfo'),tip=$('onlineConsultTip');
  let tipPinned=false;
  function toggleTip(show){tip.hidden=!show;if(!show)tipPinned=false;info.setAttribute('aria-expanded',String(show));}
  info.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')toggleTip(true);});
  info.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse'&&!tipPinned)toggleTip(false);});
  info.addEventListener('focus',()=>toggleTip(true));
  info.addEventListener('blur',()=>{if(!tipPinned)toggleTip(false);});
  info.addEventListener('click',()=>{tipPinned=!tipPinned;toggleTip(tipPinned);});
  document.addEventListener('click',e=>{if(!info.contains(e.target)&&!tip.contains(e.target))toggleTip(false);});
  const consentModal=$('consentModal'),consentDialog=consentModal.querySelector('.consent-modal-dialog');
  const agree=$('consentAgreeBtn');
  function openConsent(){
    consentRead=false;agree.disabled=true;$('consentModalFooter').classList.remove('is-read');
    consentModal.classList.add('is-open');consentModal.setAttribute('aria-hidden','false');consentDialog.scrollTop=0;
    window.DigiDrDialog.open(consentModal,{initial:$('consentModalClose'),returnTo:consent,onEscape:()=>closeConsent(false,'escape_key')});
    event('consent_modal_open');requestAnimationFrame(checkRead);
  }
  function checkRead(){
    if(consentRead||!consentModal.classList.contains('is-open'))return;
    if(consentDialog.scrollHeight-consentDialog.scrollTop-consentDialog.clientHeight>8)return;
    consentRead=true;agree.disabled=false;$('consentModalFooter').classList.add('is-read');event('consent_scrolled_to_bottom');
  }
  function closeConsent(accepted,method){
    if(accepted&&!consentRead)return;
    consentGiven=!!accepted;consent.checked=consentGiven;updateSubmit();error('consentCheckbox','');
    event(accepted?'consent_agreed':'consent_dismissed',{method,scrolled_to_bottom:consentRead});
    window.DigiDrDialog.close(consentModal);consentModal.classList.remove('is-open');consentModal.setAttribute('aria-hidden','true');
  }
  consent.addEventListener('change',e=>{
    if(!e.isTrusted)return;
    event('consent_checkbox_click',{checked:consent.checked});
    if(consent.checked){consent.checked=false;consentGiven=false;updateSubmit();openConsent();}
    else{consentGiven=false;updateSubmit();}
  });
  consentDialog.addEventListener('scroll',checkRead,{passive:true});window.addEventListener('resize',checkRead);
  agree.addEventListener('click',()=>closeConsent(true,'agree_button'));
  $('consentModalClose').addEventListener('click',()=>closeConsent(false,'close_button'));
  $('consentModalBackdrop').addEventListener('click',()=>closeConsent(false,'backdrop'));
  function renderCalendar(){
    const grid=$('preferredDateCalendar').querySelector('[data-cal-grid]');
    $('preferredDateCalendar').querySelector('[data-cal-title]').textContent=viewDate.toLocaleDateString('en-IN',{month:'long',year:'numeric'});
    grid.replaceChildren();
    const days=new Date(viewDate.getFullYear(),viewDate.getMonth()+1,0).getDate();
    for(let i=0;i<viewDate.getDay();i++){const sp=document.createElement('span');sp.className='booking-calendar-day--empty';sp.setAttribute('aria-hidden','true');grid.append(sp);}
    for(let day=1;day<=days;day++){
      const d=new Date(viewDate.getFullYear(),viewDate.getMonth(),day),key=iso(d),btn=document.createElement('button');
      btn.type='button';btn.className='booking-calendar-day';
      const weekday=document.createElement('span');weekday.className='calendar-mobile-weekday';weekday.textContent=d.toLocaleDateString('en-IN',{weekday:'short'})+' ';
      btn.append(weekday,document.createTextNode(String(day)));btn.setAttribute('aria-label',d.toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'}));
      btn.disabled=daysLoading||d<today||d>maxDate||!availableDays.has(d.toLocaleDateString('en-US',{weekday:'long'}).toLowerCase());
      btn.classList.toggle('is-disabled',btn.disabled);btn.classList.toggle('is-selected',fields.preferredDate.value===key);
      btn.setAttribute('aria-pressed',String(fields.preferredDate.value===key));
      if(iso(today)===key)btn.classList.add('is-today');
      btn.addEventListener('click',()=>{fields.preferredDate.value=key;$('preferredDateText').value=d.toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'});closeCalendar();error('preferredDate','');loadSlots();$('preferredDateText').focus();});grid.append(btn);
    }
    $('preferredDateCalendar').querySelector('[data-cal-prev]').disabled=viewDate<=new Date(today.getFullYear(),today.getMonth(),1);
    $('preferredDateCalendar').querySelector('[data-cal-next]').disabled=new Date(viewDate.getFullYear(),viewDate.getMonth()+1,1)>maxDate;
  }
  function closeCalendar(){$('preferredDateCalendar').hidden=true;$('preferredDateText').setAttribute('aria-expanded','false');}
  function openCalendar(){$('preferredDateCalendar').hidden=false;$('preferredDateText').setAttribute('aria-expanded','true');renderCalendar();}
  $('preferredDateText').addEventListener('click',()=>{$('preferredDateCalendar').hidden?openCalendar():closeCalendar();});
  $('preferredDateText').addEventListener('keydown',e=>{if(['Enter',' ','ArrowDown'].includes(e.key)){e.preventDefault();openCalendar();$('preferredDateCalendar').querySelector('.booking-calendar-day:not(:disabled)')?.focus();}});
  for(const [selector,delta] of [['[data-cal-prev]',-1],['[data-cal-next]',1]])$('preferredDateCalendar').querySelector(selector).addEventListener('click',e=>{e.stopPropagation();viewDate.setMonth(viewDate.getMonth()+delta);renderCalendar();});
  document.addEventListener('click',e=>{if(!$('preferredDateField').contains(e.target))closeCalendar();});
  $('preferredDateCalendar').addEventListener('keydown',e=>{
    if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)||!e.target.matches('.booking-calendar-day'))return;
    e.preventDefault();const list=[...$('preferredDateCalendar').querySelectorAll('.booking-calendar-day:not(:disabled)')],i=list.indexOf(e.target);
    const cols=window.innerWidth<=480?4:7;const delta=e.key==='ArrowLeft'?-1:e.key==='ArrowRight'?1:e.key==='ArrowUp'?-cols:cols;
    list[Math.max(0,Math.min(list.length-1,i+delta))]?.focus();
  });
  function fileError(file){
    if(!file)return '';
    if(!['application/pdf','image/jpeg','image/png'].includes(file.type)||!(/\.(pdf|jpe?g|png)$/i.test(file.name)))return 'Choose a PDF, JPG or PNG file.';
    if(file.size>5*1024*1024)return 'Choose a file no larger than 5 MB.';
    if(!file.size)return 'The selected file is empty. Please choose another file.';
    return '';
  }
  function clearPreview(){
    if(previewURL)URL.revokeObjectURL(previewURL);previewURL=null;acceptedFile=null;
    $('reportPreview').classList.remove('is-visible');$('reportPreviewThumb').removeAttribute('src');$('reportPreviewThumb').hidden=true;$('reportPreviewIcon').hidden=true;
  }
  fields.report.addEventListener('change',()=>{
    clearPreview();const file=fields.report.files[0],message=fileError(file);error('report',message);
    if(!file||message)return;acceptedFile=file;
    $('reportPreviewName').textContent=file.name;$('reportPreviewSize').textContent=(file.size/1024).toFixed(1)+' KB';
    if(file.type==='application/pdf')$('reportPreviewIcon').hidden=false;
    else{previewURL=URL.createObjectURL(file);$('reportPreviewThumb').src=previewURL;$('reportPreviewThumb').alt='Selected report preview';$('reportPreviewThumb').hidden=false;}
    $('reportPreview').classList.add('is-visible');event('report_uploaded');
  });
  $('reportPreviewRemove').addEventListener('click',()=>{fields.report.value='';clearPreview();error('report','');});
  fields.fullName.addEventListener('input',()=>{fields.fullName.value=fields.fullName.value.replace(/[^\p{L}\p{M}\s'-]/gu,'');});
  async function validate(){
    await Promise.race([phoneInitPromise,new Promise(resolve=>setTimeout(resolve,5000))]);
    const messages={fullName:'',email:'',phone:'',preferredDate:'',preferredTime:'',reason:'',consentCheckbox:'',report:fileError(fields.report.files[0])};
    if(!/^[\p{L}\p{M}][\p{L}\p{M}\s'-]{1,99}$/u.test(fields.fullName.value.trim()))messages.fullName='Enter your full name using letters, spaces, apostrophes or hyphens.';
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.value.trim()))messages.email='Enter a valid email address.';
    if(!fields.phone.value.trim())messages.phone='Enter your phone number.';
    else if(!iti||!phoneUtilsReady)messages.phone='Phone validation is unavailable. Please reload and try again.';
    else if(!iti.isValidNumber())messages.phone='Enter a valid phone number for the selected country.';
    const chosen=parseDate(fields.preferredDate.value);
    if(!fields.preferredDate.value||isNaN(chosen)||chosen<today||chosen>maxDate||!availableDays.has(chosen.toLocaleDateString('en-US',{weekday:'long'}).toLowerCase()))messages.preferredDate='Choose an available date within the next 30 days.';
    if(!slotIds.has(fields.preferredTime.value))messages.preferredTime='Choose an available time slot.';
    if(fields.reason.value.trim().length<10)messages.reason='Please provide a brief description (min 10 characters).';
    if (!consentGiven || !consent.checked) messages.consentCheckbox='Please read and agree to the consent notice.';
    Object.entries(messages).forEach(([name,message])=>error(name,message));
    const first=Object.keys(messages).find(name=>messages[name]);
    if(first)(first==='preferredDate'?$('preferredDateText'):fields.namedItem(first))?.focus();
    return !first;
  }
  async function compressImage(file){
    if(!file||file.type==='application/pdf')return file;
    const bitmap=await createImageBitmap(file);const scale=Math.min(1,800/bitmap.width,800/bitmap.height);
    const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(bitmap.width*scale));canvas.height=Math.max(1,Math.round(bitmap.height*scale));
    const ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close();
    const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',0.7));if(!blob)throw new Error('Image unavailable');
    return new File([blob],file.name.replace(/\.[^.]+$/,'.jpg'),{type:'image/jpeg'});
  }
  function popup(title,content,actions){
    const overlay=document.createElement('div');overlay.className='booking-popup-overlay';overlay.id='bookingPopup';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-labelledby','bookingPopupTitle');
    const box=document.createElement('div');box.className='booking-popup';
    const h=document.createElement('h2');h.id='bookingPopupTitle';h.textContent=title;
    const body=document.createElement('div');body.className='booking-review';body.setAttribute('data-clarity-mask','true');
    for(const [label,value] of content){const p=document.createElement('p');const strong=document.createElement('strong');strong.textContent=label?label+': ':'';p.append(strong,document.createTextNode(value));body.append(p);}
    const controls=document.createElement('div');controls.className='booking-popup-actions';
    const close=()=>{window.DigiDrDialog.close(overlay);overlay.remove();};
    actions.forEach(action=>{const button=document.createElement('button');button.type='button';button.className=action.primary?'booking-popup-ok':'booking-popup-edit';button.textContent=action.label;button.addEventListener('click',()=>{close();action.run?.();});controls.append(button);});
    box.append(h,body,controls);overlay.append(box);document.body.append(overlay);
    overlay.addEventListener('click',e=>{if(e.target===overlay)close();});window.DigiDrDialog.open(overlay,{initial:controls.firstElementChild,onEscape:close});
  }
  async function submit(){
    if(isSubmitting||!await validate())return;
    if(!configured||!availableModes[type]){status('Online booking is not enabled for this profile. No appointment request can be submitted.');return;}
    isSubmitting=true;updateSubmit();loader.setAttribute('aria-hidden','false');
    let succeeded=false, meetLink='';
    try {
      const upload=await compressImage(acceptedFile),body=new FormData(),date=parseDate(fields.preferredDate.value);
      const values={DoctorId:doctorId,FullName:fields.fullName.value.trim(),Phone:iti.getNumber(),Email:fields.email.value.trim(),Date:fields.preferredDate.value,Type:type,Day:date.toLocaleDateString('en-US',{weekday:'long'}),SlotId:fields.preferredTime.value,Time:fields.preferredTime.selectedOptions[0]?.dataset.label||'',Reason:fields.reason.value.trim()};
      Object.entries(values).forEach(([key,value])=>body.append(key,value));if(upload)body.append('Upload',upload);
      const result=await request('/api/Patient_Appointment/patient_appointment',{method:'POST',body});
      const responseType=result?.data?.type??result?.type;
      if(!['online','offline'].includes(responseType)||responseType!==type)throw new Error('No confirmed appointment');
      meetLink = result?.data?.meetLink ?? result?.meetLink ?? '';
      window.__trackBookingSuccess?.(type);succeeded=true;
    } catch {
      status('We could not confirm the appointment. Your details are still in the form. Check with the clinic before retrying to avoid a duplicate request.');
    } finally {isSubmitting=false;loader.setAttribute('aria-hidden','true');updateSubmit();}
    if(succeeded){
      const mode=type;form.reset();clearPreview();consentGiven=false;consent.checked=false;clearDate();updateSubmit();iti?.setNumber('');iti?.setSelectedCountry('in');closeBooking();
      const location=[form.dataset.address,form.dataset.district,form.dataset.state,form.dataset.pincode].filter(Boolean).join(', ');
      const detail=mode==='online'
        ? (meetLink ? 'Your appointment is confirmed. Please join 5 minutes before your scheduled time. Check your email for details.' : 'Your online consultation has been booked successfully.')
        : 'Your clinic appointment is confirmed. Please arrive 15 minutes before your scheduled time.';
      popup('Appointment confirmed',[['',detail],...(mode==='offline'?[['Clinic',form.dataset.clinicname],['Address',location]]:[])],[{label:'OK',primary:true}]);
    }
  }
  form.addEventListener('submit',async e=>{
    e.preventDefault();if(isSubmitting || isValidating || document.getElementById('bookingPopup'))return;
    isValidating=true;
    let valid=false;
    try { valid=await validate(); } finally { isValidating=false; }
    if(!valid)return;
    if(!configured||!availableModes[type]){status('Online booking is not enabled for this profile. No appointment request can be submitted.');return;}
    popup('Review appointment',[
      ['Name',fields.fullName.value.trim()],['Consultation',type==='online'?'Online consultation':'Clinic visit'],['Date',$('preferredDateText').value],['Time',fields.preferredTime.selectedOptions[0]?.textContent||''],['Email',fields.email.value.trim()]
    ],[{label:'Edit details'},{label:'Confirm appointment',primary:true,run:submit}]);
  });
  fields.preferredDate.addEventListener('change',loadSlots);
  resetSlots();updateSubmit();loadAvailability();
})();

window.__trackBookingSuccess = function(type) { window.trackEvent?.('booking_submitted', {appointment_type:type === 'offline' ? 'clinic' : type}); };

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
        track.removeAttribute("aria-busy");
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
                    try {const u = new URL(post.permalink); if (u.protocol !== 'https:' || !/(^|\.)facebook\.com$/i.test(u.hostname)) return;} catch {return;}
                    if (isVideoPermalink(post.permalink)) return;
                    if (!isRecent(post.createdAt)) return;
                    if (!hasDigiDrTag(post.message)) return;
                    if (seen.has(post.permalink)) return; seen.add(post.permalink);
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
        if (track.dataset.pagingBound) return; track.dataset.pagingBound = "true";
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
            carousel.scrollBy({ left: -stepSize(), behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
        });
        nextBtn.addEventListener("click", () => {
            carousel.scrollBy({ left: stepSize(), behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
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
  const phoneDigits = phone ? phone.textContent.replace(/[^\d]/g, '') : '';
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

// Keyboard activation for the upload label and mobile-menu dismissal.
document.querySelector('.booking-upload-btn')?.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') {e.preventDefault();document.getElementById('report')?.click();}
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && mainNav?.classList.contains('open')) {mainNav.classList.remove('open');menuToggle.setAttribute('aria-expanded','false');menuToggle.focus();}
});
document.addEventListener('click', e => {
  const disabled=e.target.closest?.('[aria-disabled="true"]');if(disabled){e.preventDefault();e.stopPropagation();}
});
