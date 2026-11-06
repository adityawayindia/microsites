/* Join helper: drops empty parts and their separators (e.g. missing district/pincode). Reads data-p1..N, data-seps ("|"-separated, one per gap between parts), data-lead. */
(function () {
  document.querySelectorAll("[data-join]").forEach(function (el) {
    var seps = (el.getAttribute("data-seps") || ", ").split("|");
    var out = "";
    for (var i = 1; el.hasAttribute("data-p" + i); i++) {
      var v = (el.getAttribute("data-p" + i) || "").trim();
      if (!v || v.indexOf("{{") !== -1) continue;
      out += (out ? (seps[i - 2] !== undefined ? seps[i - 2] : seps[0]) : "") + v;
    }
    var text = out ? (el.getAttribute("data-lead") || "") + out : "";
    var last = el.lastChild;
    if (last && last.nodeType === 3) last.textContent = (el.querySelector("i") ? " " : "") + text;
    else if (!el.children.length) el.textContent = text;
  });
})();

/* Accessible overlay lifecycle: one active focus scope, inert background, return focus. */
window.DigiDrDialog = (function () {
  const stack = []; let inerted = []; let previousOverflow = '';
  const selector = 'a[href],button:not([disabled]),input:not([disabled]):not([type="hidden"]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
  function tabbable(root) { return [...root.querySelectorAll(selector)].filter(el => el.getClientRects().length && !el.closest('[inert]')); }
  function sync() {
    inerted.forEach(([el, value]) => { el.inert = value; }); inerted = [];
    const current = stack.at(-1);
    if (!current) { document.body.style.overflow = previousOverflow; return; }
    let node = current.root;
    while (node && node !== document.body) {
      for (const sibling of node.parentElement?.children || []) {
        if (sibling === node || /SCRIPT|STYLE|LINK/.test(sibling.tagName)) continue;
        inerted.push([sibling, sibling.inert]); sibling.inert = true;
      }
      node = node.parentElement;
    }
    document.body.style.overflow = 'hidden';
  }
  function open(root, focusTarget) {
    if (!root) return;
    if (!stack.some(x => x.root === root)) {
      if (!stack.length) previousOverflow = document.body.style.overflow;
      stack.push({ root, trigger: document.activeElement });
    }
    sync(); (focusTarget || tabbable(root)[0] || root).focus({ preventScroll: true });
  }
  function close(root, returnFocus = true) {
    const i = stack.findIndex(x => x.root === root); if (i < 0) return;
    const [item] = stack.splice(i, 1); sync();
    if (returnFocus && item.trigger?.isConnected && !item.trigger.closest('[inert]')) item.trigger.focus({ preventScroll: true });
  }
  document.addEventListener('keydown', event => {
    const current = stack.at(-1); if (!current || event.key !== 'Tab') return;
    const els = tabbable(current.root); if (!els.length) { event.preventDefault(); return; }
    const first = els[0], last = els.at(-1), active = document.activeElement;
    if (event.shiftKey && (active === first || !current.root.contains(active))) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && (active === last || !current.root.contains(active))) { event.preventDefault(); first.focus(); }
  });
  return { open, close };
})();

// GA4 tracking lives in script/analytics.js (window.trackEvent + the
// data-ga-event click delegation). Loaded before this file on every page.

// Navigate incoming legal-page anchors, then remove the fragment on HTTP deployments.
const initialHash = location.hash;
const prefersReducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
function stripHash() {
  if (/^https?:$/.test(location.protocol)) history.replaceState(null, '', location.pathname + location.search);
}
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
if (initialHash) {
  requestAnimationFrame(() => {
    const target = document.getElementById(decodeURIComponent(initialHash.slice(1)));
    target?.scrollIntoView({block:'start'}); stripHash();
  });
}

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
    section.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
    section.setAttribute('tabindex','-1'); section.focus({preventScroll:true}); stripHash();
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

  let currentIdx = -1;

  function openLightbox(index) {
    currentIdx = index;
    const img = galleryImages[currentIdx];
    if (img) {
      lightboxImage.src = img.src;
      lightboxImage.alt = img.alt || "Enlarged gallery image";
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      window.DigiDrDialog.open(lightbox, closeBtn);
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
    trigger.setAttribute('tabindex','0'); trigger.setAttribute('role','button');
    trigger.setAttribute('aria-label','Enlarge: '+img.alt);
    trigger.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '){e.preventDefault();openLightbox(idx);} });
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

/* Booking, consent, review and API confirmation. No fabricated slots or success. */
(function () {
  const form = document.getElementById('bookingForm');
  const modal = document.getElementById('bookingModal');
  if (!form || !modal) return;
  const $ = id => document.getElementById(id);
  const dialog = modal.querySelector('.booking-modal-dialog');
  const API_BASE = 'https://digidrapi.digidr.app';
  const doctorId = (form.dataset.userid || '').trim();
  const configured = !!doctorId && !/demo|\{\{|\[/.test(doctorId);
  const consent = $('consentCheckbox'), submit = $('submitBtn');
  const clinic = $('clinicVisitTab'), online = $('onlineConsultTab');
  const status = $('bookingStatus');
  const dateField = $('preferredDate'), dateText = $('preferredDateText'), time = $('preferredTime');
  const calendar = $('preferredDateCalendar');
  const consentModal = $('consentModal'), consentDialog = consentModal.querySelector('.consent-modal-dialog');
  const agree = $('consentAgreeBtn'), consentFooter = $('consentModalFooter');
  const info = $('onlineConsultInfo'), tip = $('onlineConsultTip');
  let type = 'offline', availableDays = new Set(), allowedModes = {online:true,offline:true};
  let consentAccepted = false, busy = false, iti = null, phoneUtilsReady = false;
  let availabilityVersion = 0, slotsVersion = 0, previewURL = '', lastTrigger = null;
  let selectedDate = '', viewDate = new Date(); viewDate.setDate(1);
  const today = () => { const d = new Date(); d.setHours(0,0,0,0); return d; };
  const iso = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  function parseDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
    const [y,m,d] = value.split('-').map(Number); const result = new Date(y,m-1,d);
    return iso(result) === value ? result : null;
  }
  const lastDate = () => { const d = today(); d.setDate(d.getDate()+30); return d; };
  function validDate(value) {
    const d = parseDate(value);
    return d && d >= today() && d <= lastDate() && availableDays.has(d.toLocaleDateString('en-US',{weekday:'long'}).toLowerCase());
  }
  function notice(text) { status.textContent = text; status.hidden = !text; }
  function error(name, message) {
    const el = form.querySelector(`[data-error-for="${name}"]`);
    if (el) el.textContent = message;
    const field = name === 'preferredDate' ? dateText : form.elements.namedItem(name);
    if (field) { field.classList.toggle('is-invalid',!!message); field.setAttribute('aria-invalid',String(!!message)); }
  }
  function clearErrors() { form.querySelectorAll('[data-error-for]').forEach(el => error(el.dataset.errorFor,'')); }
  function updateSubmit() { submit.disabled = busy || !consentAccepted || !consent.checked; }
  async function request(path, options = {}) {
    const controller = new AbortController(); const timer = setTimeout(() => controller.abort(), 10000);
    try {
      const response = await fetch(API_BASE + path, {...options,signal:controller.signal,credentials:'omit'});
      let data; try { data = await response.json(); } catch { throw new Error('invalid-response'); }
      if (!response.ok || data?.success === false) throw new Error('request-failed');
      return data;
    } finally { clearTimeout(timer); }
  }
  function resetSlots() {
    ++slotsVersion; dateField.value = ''; dateText.value = ''; selectedDate = '';
    time.replaceChildren(new Option('Select Time Slot','')); time.disabled = true;
    calendar.hidden = true; dateText.setAttribute('aria-expanded','false');
    error('preferredDate',''); error('preferredTime','');
  }
  async function loadAvailableDays() {
    const version = ++availabilityVersion; availableDays = new Set(); renderCalendar();
    if (!configured) { notice('Online booking is not connected for this profile. No appointment can be submitted.'); return; }
    notice('Checking appointment availability…');
    try {
      const data = await request(`/api/Patient_Appointment/getavailabledays?userid=${encodeURIComponent(doctorId)}&type=${type}`);
      if (version !== availabilityVersion) return;
      if (!Array.isArray(data)) throw new Error('invalid-days');
      availableDays = new Set(data.filter(x => typeof x==='string').map(x=>x.toLowerCase()));
      notice(availableDays.size ? '' : 'No appointment days are available for this consultation type.');
    } catch {
      if (version !== availabilityVersion) return;
      notice('Appointment availability could not be loaded. Please try again later.');
    }
    renderCalendar();
  }
  async function loadModes() {
    if (!configured) { loadAvailableDays(); return; }
    try {
      const data = await request(`/api/Patient_Appointment/getappointment?userid=${encodeURIComponent(doctorId)}`);
      if (typeof data.online !== 'boolean' || typeof data.offline !== 'boolean') throw new Error('invalid-modes');
      allowedModes = data; clinic.hidden = !data.offline; online.hidden = !data.online;
      if (!data.online && !data.offline) {
        document.querySelectorAll('.cta-btn,[data-open-booking]').forEach(el => { el.hidden = true; });
        notice('Appointments are currently unavailable.'); return;
      }
      if (!data.offline) switchType('online',false); else loadAvailableDays();
    } catch { notice('Appointment availability could not be loaded. Please try again later.'); }
  }
  function switchType(next, focus = false) {
    if (!allowedModes[next]) return;
    const changed = next !== type; type = next;
    [clinic,online].forEach(tab => {
      const active = tab === (next==='online' ? online : clinic);
      tab.classList.toggle('is-active',active); tab.setAttribute('aria-selected',String(active)); tab.tabIndex=active?0:-1;
    });
    form.setAttribute('aria-labelledby',next==='online'?'onlineConsultTab':'clinicVisitTab');
    $('reasonLabel').textContent = next==='online'?'Reason For Online Consultation':'Reason For Visit';
    if (changed) { resetSlots(); loadAvailableDays(); }
    if (focus) (next==='online'?online:clinic).focus();
  }
  clinic.addEventListener('click',() => switchType('offline'));
  online.addEventListener('click',() => switchType('online'));
  [clinic,online].forEach(tab => tab.addEventListener('keydown',e => {
    if (!['ArrowLeft','ArrowRight','Home','End'].includes(e.key)) return;
    e.preventDefault(); const next = e.key==='Home'?'offline':e.key==='End'?'online':type==='online'?'offline':'online';
    switchType(next,true);
  }));
  let tipPinned = false;
  function showTip(show) { tip.hidden = !show; info.classList.toggle('is-open',show); if(!show)tipPinned=false; }
  info.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')showTip(true);});
  info.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse'&&!tipPinned)showTip(false);});
  info.addEventListener('click',()=>{tipPinned=true;showTip(true);});
  online.addEventListener('focus',()=>showTip(true)); online.addEventListener('blur',()=>{if(!tipPinned)showTip(false);});
  document.addEventListener('click',e=>{ if(!info.contains(e.target)) showTip(false); });
  function openModal(trigger) {
    lastTrigger=trigger; modal.classList.add('is-open'); modal.setAttribute('aria-hidden','false');
    dialog.scrollTop=0; window.DigiDrDialog.open(modal,$('bookingModalClose'));
  }
  function closeModal() {
    showTip(false); calendar.hidden=true; dateText.setAttribute('aria-expanded','false');
    modal.classList.remove('is-open'); modal.setAttribute('aria-hidden','true'); window.DigiDrDialog.close(modal);
  }
  document.querySelectorAll('.cta-btn,[data-open-booking]').forEach(btn=>btn.addEventListener('click',e=>{e.preventDefault();openModal(btn);}));
  $('bookingModalClose').addEventListener('click',closeModal); $('bookingModalBackdrop').addEventListener('click',closeModal);
  function checkScrolledToBottom() {
    if (!consentModal.classList.contains('is-open') || !agree.disabled) return;
    if (consentDialog.scrollHeight-consentDialog.scrollTop-consentDialog.clientHeight<=8) {
      agree.disabled=false;consentFooter.classList.add('is-read');window.trackEvent?.('consent_scrolled_to_bottom');
    }
  }
  function openConsent() {
    modal.classList.remove('is-open');modal.setAttribute('aria-hidden','true');
    consentModal.classList.add('is-open');consentModal.setAttribute('aria-hidden','false');
    agree.disabled=true;consentFooter.classList.remove('is-read');consentDialog.scrollTop=0;
    window.DigiDrDialog.open(consentModal,$('consentModalClose'));window.trackEvent?.('consent_modal_open');
    requestAnimationFrame(checkScrolledToBottom);
  }
  function closeConsent(accepted,method) {
    const read=!agree.disabled; if(accepted && !read)return;
    consentAccepted=accepted&&read;consent.checked=consentAccepted;
    consentModal.classList.remove('is-open');consentModal.setAttribute('aria-hidden','true');
    modal.classList.add('is-open');modal.setAttribute('aria-hidden','false');
    window.DigiDrDialog.close(consentModal);consent.focus({preventScroll:true});updateSubmit();
    window.trackEvent?.(consentAccepted?'consent_agreed':'consent_dismissed',{method,scrolled_to_bottom:read});
  }
  consent.addEventListener('change',event=>{
    if(!event.isTrusted)return;
    window.trackEvent?.('consent_checkbox_click',{checked:consent.checked});
    if(consent.checked){consent.checked=false;consentAccepted=false;updateSubmit();openConsent();}
    else {consentAccepted=false;updateSubmit();}
  });
  consentDialog.addEventListener('scroll',checkScrolledToBottom,{passive:true});window.addEventListener('resize',checkScrolledToBottom);
  agree.addEventListener('click',()=>closeConsent(true,'agree_button'));
  $('consentModalClose').addEventListener('click',()=>closeConsent(false,'close_button'));
  $('consentModalBackdrop').addEventListener('click',()=>closeConsent(false,'backdrop'));
  function renderCalendar() {
    const grid=calendar.querySelector('[data-cal-grid]');grid.replaceChildren();
    calendar.querySelector('[data-cal-title]').textContent=viewDate.toLocaleDateString('en-US',{month:'long',year:'numeric'});
    const y=viewDate.getFullYear(),m=viewDate.getMonth(),n=new Date(y,m+1,0).getDate();
    for(let i=0;i<new Date(y,m,1).getDay();i++){const blank=document.createElement('span');blank.className='booking-calendar-day--empty';grid.append(blank);}
    for(let day=1;day<=n;day++){
      const d=new Date(y,m,day), value=iso(d), btn=document.createElement('button');btn.type='button';btn.className='booking-calendar-day';btn.textContent=day;
      btn.setAttribute('aria-label',d.toLocaleDateString('en-US',{weekday:'long',day:'numeric',month:'long',year:'numeric'}));
      btn.disabled=!validDate(value);btn.classList.toggle('is-disabled',btn.disabled);
      btn.classList.toggle('is-today',iso(today())===value);btn.classList.toggle('is-selected',selectedDate===value);
      btn.addEventListener('click',()=>{
        selectedDate=value;dateField.value=value;dateText.value=d.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'});
        calendar.hidden=true;dateText.setAttribute('aria-expanded','false');dateText.focus();dateField.dispatchEvent(new Event('change',{bubbles:true}));
      });grid.append(btn);
    }
    calendar.querySelector('[data-cal-prev]').disabled=new Date(y,m,1)<=new Date(today().getFullYear(),today().getMonth(),1);
    calendar.querySelector('[data-cal-next]').disabled=new Date(y,m+1,1)>lastDate();
  }
  function openCalendar(){calendar.hidden=false;dateText.setAttribute('aria-expanded','true');renderCalendar();}
  dateText.addEventListener('click',()=>{if(calendar.hidden)openCalendar();else {calendar.hidden=true;dateText.setAttribute('aria-expanded','false');}});
  dateText.addEventListener('keydown',e=>{if(['Enter',' ','ArrowDown'].includes(e.key)){e.preventDefault();openCalendar();calendar.querySelector('button.booking-calendar-day:not(:disabled)')?.focus();}});
  for(const [selector,offset]of [['[data-cal-prev]',-1],['[data-cal-next]',1]])calendar.querySelector(selector).addEventListener('click',()=>{viewDate=new Date(viewDate.getFullYear(),viewDate.getMonth()+offset,1);renderCalendar();});
  document.addEventListener('click',e=>{if(!$('preferredDateField').contains(e.target)){calendar.hidden=true;dateText.setAttribute('aria-expanded','false');}});
  dateField.addEventListener('change',async()=>{
    const version=++slotsVersion, requestedType=type, requestedDate=dateField.value;
    time.replaceChildren(new Option('Loading time slots…',''));time.disabled=true;
    if(!validDate(requestedDate)){error('preferredDate','Please select an available date.');return;}
    error('preferredDate','');
    const body=new FormData();body.append('UserId',doctorId);body.append('Date',requestedDate);body.append('Type',requestedType);
    try{
      const slots=await request('/api/Patient_Appointment/getslots',{method:'POST',body});
      if(version!==slotsVersion||type!==requestedType||dateField.value!==requestedDate)return;
      if(!Array.isArray(slots))throw new Error('invalid-slots');
      time.replaceChildren(new Option(slots.length?'Select Time Slot':'No Slots Available',''));
      slots.filter(s=>s&&s.id!=null&&typeof s.label==='string').forEach(s=>{const o=new Option(s.label,String(s.id));o.dataset.label=s.label;time.append(o);});
      time.disabled=time.options.length<2;
    }catch{if(version===slotsVersion){time.replaceChildren(new Option('Slots unavailable',''));error('preferredTime','Time slots could not be loaded. Please choose the date again.');}}
  });
  if(window.intlTelInput){
    iti=window.intlTelInput(form.phone,{initialCountry:'in',countryOrder:['in'],separateDialCode:true,loadUtils:()=>import('https://cdn.jsdelivr.net/npm/intl-tel-input@29.2.2/dist/js/utils.js')});
    iti.promise.then(()=>{phoneUtilsReady=true;}).catch(()=>{phoneUtilsReady=false;});
  }
  form.fullName.addEventListener('input',()=>{form.fullName.value=form.fullName.value.replace(/[^\p{L}\p{M}\s'’\-]/gu,'');});
  function validateFile(file){
    if(!file)return '';
    const allowed={'application/pdf':/\.pdf$/i,'image/jpeg':/\.jpe?g$/i,'image/png':/\.png$/i};
    if(!allowed[file.type]?.test(file.name))return 'Only JPEG, PNG, or PDF files are allowed.';
    if(file.size>5*1024*1024)return 'File size must not exceed 5 MB.';
    if(file.size===0)return 'The selected file is empty.';
    return '';
  }
  function preview(file){
    if(previewURL)URL.revokeObjectURL(previewURL);previewURL='';
    const thumb=$('reportPreviewThumb');thumb.hidden=true;thumb.removeAttribute('src');$('reportPreviewIcon').hidden=true;
    $('reportPreview').classList.toggle('is-visible',!!file);if(!file)return;
    $('reportPreviewName').textContent=file.name;$('reportPreviewSize').textContent=(file.size/1024).toFixed(1)+' KB';
    if(file.type.startsWith('image/')){previewURL=URL.createObjectURL(file);thumb.src=previewURL;thumb.alt='Selected report preview';thumb.hidden=false;}else $('reportPreviewIcon').hidden=false;
  }
  form.report.addEventListener('change',()=>{const file=form.report.files[0];const msg=validateFile(file);error('report',msg);preview(msg?null:file);if(file&&!msg)window.trackEvent?.('report_uploaded');});
  $('reportPreviewRemove').addEventListener('click',()=>{form.report.value='';preview(null);error('report','');});
  form.querySelectorAll('[data-error-for]').forEach(el=>{el.id='booking-error-'+el.dataset.errorFor;el.setAttribute('aria-live','polite');(el.dataset.errorFor==='preferredDate'?dateText:form.elements.namedItem(el.dataset.errorFor))?.setAttribute('aria-describedby',el.id);});
  function validate(){
    clearErrors();const errors={};const name=form.fullName.value.trim();
    if(!name||!/^\p{L}[\p{L}\p{M}\s'’\-]*$/u.test(name))errors.fullName='Please enter your name using letters, spaces, apostrophes or hyphens.';
    if(!form.phone.value.trim())errors.phone='Please enter your phone number.';
    else if(!iti||!phoneUtilsReady)errors.phone='Phone validation is unavailable. Please reload and try again.';
    else if(!iti.isValidNumber())errors.phone='Please enter a valid phone number.';
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.value.trim()))errors.email='Please enter a valid email address.';
    if(!validDate(dateField.value))errors.preferredDate='Please select an available date, within the next 30 days.';
    if(time.disabled||!time.value||![...time.options].some(o=>o.value===time.value&&o.dataset.label))errors.preferredTime='Please select an available time slot.';
    if(form.reason.value.trim().length<10)errors.reason='Please provide a brief description (min 10 characters).';
    const fileError=validateFile(form.report.files[0]);if(fileError)errors.report=fileError;
    const consentGiven = consent.checked && consentAccepted;
    if (!consentGiven)errors.consentCheckbox='Please read and agree to the consent notice.';
    Object.entries(errors).forEach(([name,msg])=>error(name,msg));
    const first=Object.keys(errors)[0];if(first)(first==='preferredDate'?dateText:form.elements.namedItem(first))?.focus();
    return !first;
  }
  let popup=null;
  function dismissPopup(restore=true){if(!popup)return;const current=popup;popup=null;current.remove();window.DigiDrDialog.close(current,restore);}
  function popupShell(title){
    const overlay=document.createElement('div');overlay.id='bookingPopup';overlay.className='booking-popup-overlay';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-labelledby','bookingPopupTitle');overlay.setAttribute('data-clarity-mask','true');
    const card=document.createElement('div');card.className='booking-popup';const h=document.createElement('h2');h.id='bookingPopupTitle';h.textContent=title;card.append(h);overlay.append(card);document.body.append(overlay);popup=overlay;return card;
  }
  function resultPopup(message,success){
    dismissPopup(false);const card=popupShell(success?'Appointment confirmed':'Unable to confirm appointment');
    const p=document.createElement('p');p.textContent=message;card.append(p);
    const ok=document.createElement('button');ok.type='button';ok.className='booking-popup-ok';ok.textContent='OK';ok.addEventListener('click',()=>{dismissPopup();if(success)lastTrigger?.focus();});card.append(ok);
    window.DigiDrDialog.open(popup,ok);
  }
  function review(){
    const card=popupShell('Review your appointment');
    const rows=[['Consultation',type==='online'?'Online Consultation':'Clinic Visit'],['Name',form.fullName.value.trim()],['Phone',iti.getNumber()],['Email',form.email.value.trim()],['Date',dateText.value],['Time',time.selectedOptions[0].text],['Reason',form.reason.value.trim()],['Report',form.report.files[0]?.name||'None attached']];
    const list=document.createElement('dl');list.className='booking-review-list';rows.forEach(([label,value])=>{const dt=document.createElement('dt');dt.textContent=label;const dd=document.createElement('dd');dd.textContent=value;list.append(dt,dd);});card.append(list);
    const actions=document.createElement('div');actions.className='booking-review-actions';
    const edit=document.createElement('button');edit.type='button';edit.className='booking-review-edit';edit.textContent='Edit details';edit.addEventListener('click',()=>dismissPopup());
    const confirm=document.createElement('button');confirm.type='button';confirm.id='confirmBookingBtn';confirm.className='booking-submit-btn';confirm.textContent='Confirm appointment';confirm.addEventListener('click',submitBooking);actions.append(edit,confirm);card.append(actions);window.DigiDrDialog.open(popup,edit);
  }
  async function compressImage(file) {
    const bitmap = await createImageBitmap(file);
    try {
      const ratio = Math.min(1, 800 / bitmap.width, 800 / bitmap.height);
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(bitmap.width * ratio));
      canvas.height = Math.max(1, Math.round(bitmap.height * ratio));
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('image-context');
      ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.5));
      if (!blob) throw new Error('image-compression');
      return new File([blob], file.name.replace(/\.[^/.]+$/, '') + '.jpg', {type:'image/jpeg'});
    } finally { bitmap.close?.(); }
  }
  async function submitBooking(){
    if(busy)return;
    // Revalidate immediately before transmission; review does not bypass consent or availability.
    if(!validate()){dismissPopup();return;}
    busy=true;updateSubmit();const confirm=$('confirmBookingBtn');confirm.disabled=true;confirm.textContent='Submitting…';
    popup.querySelector('.booking-review-edit').disabled=true;
    const body=new FormData();
    for(const [key,val]of Object.entries({DoctorId:doctorId,FullName:form.fullName.value.trim(),Phone:iti.getNumber(),Email:form.email.value.trim(),Date:dateField.value,Type:type,Day:parseDate(dateField.value).toLocaleDateString('en-US',{weekday:'long'}),SlotId:time.value,Time:time.selectedOptions[0].dataset.label,Reason:form.reason.value.trim()}))body.append(key,val);
    try{
      const upload = form.report.files[0];
      if (upload) body.append('Upload', upload.type.startsWith('image/') ? await compressImage(upload) : upload);
      const result=await request('/api/Patient_Appointment/patient_appointment',{method:'POST',body});
      const actual=result?.data?.type??result?.type;
      if(actual!==type)throw new Error('invalid-confirmation');
      const meetLink=result?.data?.meetLink??result?.meetLink;
      const onlineMessage=meetLink?'Your online consultation is confirmed. Please join 5 minutes before your scheduled time and check the clinic’s confirmation instructions.':'Your online consultation is confirmed. Please check the clinic’s confirmation instructions.';
      const message=type==='online'?onlineMessage:`Your clinic appointment is confirmed at ${form.dataset.clinicname}, ${form.dataset.address}, ${form.dataset.district}, ${form.dataset.state} ${form.dataset.pincode}.`;
      window.__trackBookingSuccess?.(type);
      dismissPopup(false);form.reset();closeModal();resultPopup(message,true);
    }catch{
      resultPopup('The booking could not be confirmed. Your details have been kept. Check with the clinic before retrying if a submission may already have reached it.',false);
    }finally{busy=false;updateSubmit();}
  }
  form.addEventListener('submit',async e=>{
    e.preventDefault();if(busy||popup)return;
    if(iti&&!phoneUtilsReady){let timer;try{await Promise.race([iti.promise,new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error('phone-timeout')),8000);})]);}catch{}finally{clearTimeout(timer);}}
    if(busy||popup||!validate())return;
    if(!configured){notice('Online booking is not connected for this profile. No appointment can be submitted.');return;}
    review();
  });
  form.addEventListener('reset',()=>{
    consentAccepted=false;consent.checked=false;resetSlots();preview(null);clearErrors();
    iti?.setNumber('');iti?.setSelectedCountry('in');setTimeout(updateSubmit,0);
  });
  document.addEventListener('keydown',e=>{
    if(e.key!=='Escape')return;
    if(popup){if(!busy)dismissPopup();return;}
    if(consentModal.classList.contains('is-open')){closeConsent(false,'escape_key');return;}
    if(!modal.classList.contains('is-open'))return;
    if(!tip.hidden){showTip(false);return;}
    if(!calendar.hidden){calendar.hidden=true;dateText.setAttribute('aria-expanded','false');dateText.focus();return;}
    closeModal();
  });
  dateField.min=iso(today());dateText.setAttribute('aria-controls','preferredDateCalendar');dateText.setAttribute('aria-expanded','false');
  updateSubmit();loadModes();
})();
window.__trackBookingSuccess = function(type){ window.trackEvent?.('booking_submitted',{appointment_type:type==='offline'?'clinic':type}); };


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
    // Slug comes from the rendered body data-slug attribute.
    // An unreplaced template token counts as unset, so the section is hidden.
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
        track.removeAttribute("aria-busy");
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
        return /\/(?:videos?|reels?|watch)(?:\/|\?|$)/i.test(url);
    }

    function isRecent(createdAt) {
        const t = Date.parse(createdAt);
        if (isNaN(t)) return false; // Fail closed — unknown age is treated as stale.
        const age = (Date.now() - t) / 86400000;
        return age >= 0 && age <= MAX_POST_AGE_DAYS;
    }

    function fetchDoctorPosts(slug) {
        const url = API_BASE + "/api/MicrositeSocialFeed/" +
            encodeURIComponent(slug) + "?limit=" + POSTS_PER_ACCOUNT;

        return fetchJson(url).then((data) => {
            if (!data || data.success === false || !Array.isArray(data.feeds)) return [];

            const entries = [];
            data.feeds.forEach((feed) => {
                if (!feed || feed.platform !== "facebook" || !Array.isArray(feed.posts)) return;
                feed.posts.forEach((post) => {
                    if (!post || !post.permalink) return;
                    if (typeof post.message !== 'string' || !/#digidr(?!\w)/i.test(post.message)) return;
                    try { const u=new URL(post.permalink); if(u.protocol!=='https:' || !/(^|\.)facebook\.com$/i.test(u.hostname)) return; } catch { return; }
                    if (isVideoPermalink(post.permalink)) return;
                    if (!isRecent(post.createdAt)) return;
                    entries.push({
                        accountName: (feed.accountName || "").trim(),
                        permalink: post.permalink,
                        createdAt: post.createdAt || ""
                    });
                });
            });

            entries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            return entries.filter((entry,i,all)=>all.findIndex(x=>x.permalink===entry.permalink)===i).slice(0, MAX_CARDS);
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
        if (!prevBtn || !nextBtn || track.dataset.pagingBound) return;
        track.dataset.pagingBound = "true";

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
  const phoneDigits = phone ? phone.textContent.replace(/\D/g, '') : '';
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

// Close the mobile menu with Escape without trapping focus.
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&mainNav?.classList.contains('open')){mainNav.classList.remove('open');menuToggle.setAttribute('aria-expanded','false');menuToggle.focus();}});

document.getElementById('reportUploadButton')?.addEventListener('click',()=>document.getElementById('report').click());
