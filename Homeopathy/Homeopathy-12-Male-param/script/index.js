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

// GA4 tracking lives in script/analytics.js (window.trackEvent + the
// data-ga-event click delegation). Loaded before this file on every page.

// Always start fresh on load/refresh: reset scroll position and strip any
// URL hash left over from in-page nav so a reload never resumes mid-page.
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

const incomingHash = window.location.hash;
if (incomingHash) {
  requestAnimationFrame(() => {
    let anchor; try { anchor = decodeURIComponent(incomingHash.slice(1)); } catch { anchor = ""; }
    const target = document.getElementById(anchor);
    if (target) target.scrollIntoView({ block: "start" });
    history.replaceState(null, "", window.location.pathname + window.location.search);
  });
} else { window.scrollTo(0, 0); }

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

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && mainNav.classList.contains("open")) {
      mainNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.focus();
    }
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
    if (link.classList.contains("skip-link")) { section.setAttribute("tabindex", "-1"); section.focus({ preventScroll: true }); }
    section.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    if (window.location.hash) history.replaceState(null, "", location.pathname + location.search);
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
  let lightboxTrigger = null;

  function openLightbox(index) {
    if (!lightbox.classList.contains("is-open")) lightboxTrigger = document.activeElement;
    currentIdx = index;
    const img = galleryImages[currentIdx];
    if (img) {
      lightboxImage.src = img.src;
      lightboxImage.alt = img.alt || "Enlarged gallery image";
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      closeBtn?.focus();
    }
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImage.removeAttribute("src");
    requestAnimationFrame(() => lightboxTrigger?.focus());
    document.body.style.overflow = "";
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
    trigger.setAttribute("tabindex", "0");
    trigger.setAttribute("aria-label", "Open image: " + (img.alt || "practice gallery image"));
    trigger.addEventListener("click", () => openLightbox(idx));
    trigger.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox(idx);
      }
    });
  });

  if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
  if (backdrop) backdrop.addEventListener("click", closeLightbox);
  if (prevBtn) prevBtn.addEventListener("click", (e) => { e.stopPropagation(); showPrev(); });
  if (nextBtn) nextBtn.addEventListener("click", (e) => { e.stopPropagation(); showNext(); });

  document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("is-open")) return;
    if (event.key === "Tab") {
      const nodes = [...lightbox.querySelectorAll("button")].filter(el => el.getClientRects().length);
      const first = nodes[0], last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    } else if (event.key === "Escape") {
      closeLightbox();
    } else if (event.key === "ArrowLeft") {
      showPrev();
    } else if (event.key === "ArrowRight") {
      showNext();
    }
  });
})();

// Booking modal: DigiDr API contract from AGENTS.md A.18.
// Success is shown only after the server confirms the appointment type.
(function () {
  const API_BASE = "https://digidrapi.digidr.app";
  const modal = document.getElementById("bookingModal");
  const form = document.getElementById("bookingForm");
  if (!modal || !form) return;
  const $ = (id) => document.getElementById(id);
  const dialog = modal.querySelector(".booking-modal-dialog");
  const clinicTab = $("clinicVisitTab"), onlineTab = $("onlineConsultTab");
  const consent = $("consentCheckbox"), consentModal = $("consentModal");
  const consentDialog = consentModal?.querySelector(".consent-modal-dialog");
  const agree = $("consentAgreeBtn"), consentFooter = $("consentModalFooter");
  const submit = $("submitBtn"), loader = $("bookingLoader"), status = $("bookingStatus");
  const dateText = $("preferredDateText"), dateInput = $("preferredDate"), calendar = $("preferredDateCalendar");
  const timeSelect = $("preferredTime"), review = $("bookingReview"), confirm = $("confirmBookingBtn");
  const doctorId = (form.dataset.userid || "").trim();
  const configured = !!doctorId && !/\{\{|demo|\[|\]/i.test(doctorId);
  let appointmentType = "offline", availableDays = new Set(), allowedModes = {offline: true, online: true};
  let daysReady = false, daysRequest = 0, slotsRequest = 0, isSubmitting = false;
  let iti = null, phoneUtilsReady = false, trigger = null, previewURL = null, snapshot = null;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const lastDate = new Date(today); lastDate.setDate(today.getDate() + 30);
  let viewDate = new Date(today.getFullYear(), today.getMonth(), 1);
  const track = (name, params) => window.trackEvent?.(name, params);
  const iso = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  const fromISO = value => { if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null; const [y,m,d]=value.split("-").map(Number); const date=new Date(y,m-1,d); return iso(date)===value ? date : null; };
  const say = text => { if (status) status.textContent = text; };
  const focusable = root => [...root.querySelectorAll('a[href],button:not([disabled]),input:not([type="hidden"]):not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex="0"]')].filter(el=>el.getClientRects().length && !el.closest('[hidden]'));
  function lock(on) { document.body.classList.toggle("modal-open", on); }
  function clearSlots(label="Select Time Slot") { timeSelect.replaceChildren(new Option(label,"")); timeSelect.disabled = true; }
  function error(name, message="") {
    const el=form.querySelector(`[data-error-for="${name}"]`); if(el) el.textContent=message;
    const field=name==="preferredDate"?dateText:form.elements.namedItem(name);
    if(field){field.classList.toggle("is-invalid",!!message);field.setAttribute("aria-invalid",String(!!message));}
  }
  form.querySelectorAll(".booking-error").forEach(el=>{
    const name=el.dataset.errorFor; el.id="booking-error-"+name; el.setAttribute("aria-live","polite");
    (name==="preferredDate"?dateText:form.elements.namedItem(name))?.setAttribute("aria-describedby",el.id);
  });
  async function request(path, options={}) {
    const controller = new AbortController(), timer=setTimeout(()=>controller.abort(),12000);
    try {
      const response=await fetch(API_BASE+path,{...options,signal:controller.signal,credentials:"omit"});
      const text=await response.text(); let data; try{data=JSON.parse(text);}catch{throw new Error("Unexpected response. Please contact the clinic before trying again.");}
      if(!response.ok || data?.success===false) throw new Error("The clinic could not process this request. Please try again or contact the clinic.");
      return data;
    } finally {clearTimeout(timer);}
  }
  // Missing/failed utility loading must not accept arbitrary phone numbers.
  if(window.intlTelInput){
    try{
      iti=window.intlTelInput(form.phone,{initialCountry:"in",countryOrder:["in"],separateDialCode:true,
        loadUtils:()=>import("https://cdn.jsdelivr.net/npm/intl-tel-input@29.2.2/dist/js/utils.js")});
      iti.promise.then(()=>{phoneUtilsReady=true;}).catch(()=>{phoneUtilsReady=false;});
      form.phone.addEventListener("countrychange",()=>{if(form.phone.value)validate("phone");});
    }catch{phoneUtilsReady=false;}
  }
  function validate(name) {
    const value=(form.elements.namedItem(name)?.value||"").trim(); let message="";
    if(name==="fullName") {if(!value) message="Please enter your full name.";else if(!/^[\p{L}\p{M}][\p{L}\p{M} '-]*$/u.test(value))message="Use letters, spaces, apostrophes or hyphens only.";}
    if(name==="email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))message="Please enter a valid email address.";
    if(name==="phone") {
      if(!value)message="Please enter your phone number.";
      else if(!iti||!phoneUtilsReady)message="Phone validation is unavailable. Please reload or contact the clinic.";
      else if(!iti.isValidNumber())message="Please enter a valid phone number.";
    }
    if(name==="preferredDate") {
      const date=fromISO(value);
      if(!date || date<today || date>lastDate)message="Choose a date within the next 30 days.";
      else if(!daysReady || !availableDays.has(date.toLocaleDateString("en-US",{weekday:"long"}).toLowerCase()))message="Please select an available appointment day.";
    }
    if(name==="preferredTime" && (!value||timeSelect.disabled||!timeSelect.selectedOptions[0]?.dataset.label))message="Please select an available time slot.";
    if(name==="reason" && value.length<10)message="Please provide a brief description (min 10 characters).";
    if(name==="report") {
      const file=form.report.files[0];
      if(file && !["application/pdf","image/jpeg","image/png"].includes(file.type))message="Only JPEG, PNG or PDF files are allowed.";
      else if(file && file.size>5*1024*1024)message="Choose a file no larger than 5 MB.";
    }
    if(name==="consentCheckbox" && !consent.checked)message="Please provide consent to proceed.";
    error(name,message);return !message;
  }
  form.fullName.addEventListener("input",()=>{form.fullName.value=form.fullName.value.replace(/[^\p{L}\p{M} '-]/gu,"");validate("fullName");});
  ["email","phone","reason"].forEach(name=>form[name].addEventListener("input",()=>{if(name!=="phone"||phoneUtilsReady)validate(name);}));
  ["fullName","email","phone","reason"].forEach(name=>form[name].addEventListener("blur",()=>{ if (form[name].value.trim()) validate(name); }));
  timeSelect.addEventListener("change",()=>validate("preferredTime"));

  function closeCalendar(){calendar.hidden=true;$("preferredDateField").classList.remove("is-open");dateText.setAttribute("aria-expanded","false");}
  function renderCalendar(){
    calendar.querySelector("[data-cal-title]").textContent=viewDate.toLocaleDateString("en-US",{month:"long",year:"numeric"});
    const grid=calendar.querySelector("[data-cal-grid]");grid.replaceChildren();
    for(let i=0;i<viewDate.getDay();i++){const s=document.createElement("span");s.className="booking-calendar-day--empty";grid.append(s);}
    for(let d=1;d<=new Date(viewDate.getFullYear(),viewDate.getMonth()+1,0).getDate();d++){
      const date=new Date(viewDate.getFullYear(),viewDate.getMonth(),d), button=document.createElement("button");
      button.type="button";button.className="booking-calendar-day";button.textContent=d;
      button.setAttribute("aria-label",date.toLocaleDateString("en-US",{weekday:"long",day:"numeric",month:"long",year:"numeric"}));
      button.disabled=date<today||date>lastDate||!daysReady||!availableDays.has(date.toLocaleDateString("en-US",{weekday:"long"}).toLowerCase());
      button.classList.toggle("is-disabled",button.disabled);button.classList.toggle("is-today",iso(date)===iso(today));button.classList.toggle("is-selected",dateInput.value===iso(date));
      button.addEventListener("click",()=>{dateInput.value=iso(date);dateText.value=date.toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"});closeCalendar();dateText.focus();dateInput.dispatchEvent(new Event("change",{bubbles:true}));});
      grid.append(button);
    }
    calendar.querySelector("[data-cal-prev]").disabled=viewDate<=new Date(today.getFullYear(),today.getMonth(),1);
    calendar.querySelector("[data-cal-next]").disabled=new Date(viewDate.getFullYear(),viewDate.getMonth()+1,1)>lastDate;
  }
  function openCalendar(){calendar.hidden=false;$("preferredDateField").classList.add("is-open");dateText.setAttribute("aria-expanded","true");renderCalendar();calendar.querySelector(".booking-calendar-day:not([disabled])")?.focus();}
  dateText.setAttribute("aria-controls","preferredDateCalendar");dateText.setAttribute("aria-expanded","false");
  dateText.addEventListener("click",()=>calendar.hidden?openCalendar():closeCalendar());
  dateText.addEventListener("keydown",e=>{if(["Enter"," ","ArrowDown"].includes(e.key)){e.preventDefault();openCalendar();}});
  calendar.querySelectorAll(".booking-calendar-nav").forEach(btn=>btn.addEventListener("click",()=>{viewDate=new Date(viewDate.getFullYear(),viewDate.getMonth()+(btn.hasAttribute("data-cal-next")?1:-1),1);renderCalendar();}));
  calendar.addEventListener("keydown",e=>{if(e.key==="Escape"){e.stopPropagation();closeCalendar();dateText.focus();} });
  document.addEventListener("click",e=>{if(!$("preferredDateField").contains(e.target))closeCalendar();});
  function clearDate(){dateInput.value="";dateText.value="";closeCalendar();slotsRequest++;clearSlots();}
  async function loadAvailableDays(type){
    const seq=++daysRequest;daysReady=false;availableDays=new Set();
    if(!configured){say("Appointment booking is not configured yet. Please contact the clinic.");return;}
    say("Checking appointment availability…");
    try {
      const days=await request(`/api/Patient_Appointment/getavailabledays?userid=${encodeURIComponent(doctorId)}&type=${type}`);
      if(seq!==daysRequest||type!==appointmentType)return;
      if(!Array.isArray(days))throw new Error("Invalid availability");
      availableDays=new Set(days.filter(d=>typeof d==="string").map(d=>d.toLowerCase()));daysReady=true;
      say(availableDays.size?"":"No appointment days are currently available. Please contact the clinic.");
    }catch{if(seq===daysRequest)say("Appointment availability could not be loaded. Please contact the clinic or try again later.");}
    if(seq===daysRequest&&!calendar.hidden)renderCalendar();
  }
  window.__onAppointmentTypeChange=loadAvailableDays;
  async function loadModes(){
    if(!configured){await loadAvailableDays(appointmentType);return;}
    try{
      const modes=await request(`/api/Patient_Appointment/getappointment?userid=${encodeURIComponent(doctorId)}`);
      allowedModes={offline:modes.offline===true,online:modes.online===true};
      clinicTab.hidden=!allowedModes.offline;onlineTab.hidden=!allowedModes.online;
      if(!allowedModes.offline&&!allowedModes.online){document.querySelectorAll(".cta-btn,[data-open-booking]").forEach(el=>el.hidden=true);say("Appointments are not currently available.");return;}
      await selectType(allowedModes.offline?"offline":"online");
    }catch{daysReady=false;say("Appointment availability could not be loaded. Please contact the clinic.");}
  }
  async function selectType(type){
    if(isSubmitting||!allowedModes[type])return;
    if(appointmentType!==type){appointmentType=type;clearDate();error("preferredDate");error("preferredTime");}
    [clinicTab,onlineTab].forEach(tab=>{const selected=(tab===onlineTab)===(type==="online");tab.classList.toggle("is-active",selected);tab.setAttribute("aria-selected",String(selected));tab.tabIndex=selected?0:-1;});
    form.dataset.appointmentType=type;await loadAvailableDays(type);
  }
  clinicTab.addEventListener("click",()=>selectType("offline"));onlineTab.addEventListener("click",()=>selectType("online"));
  [clinicTab,onlineTab].forEach(tab=>tab.addEventListener("keydown",e=>{if(!["ArrowLeft","ArrowRight","Home","End"].includes(e.key))return;e.preventDefault();const tabs=[clinicTab,onlineTab].filter(el=>!el.hidden);const index=tabs.indexOf(tab);const next=e.key==="Home"?tabs[0]:e.key==="End"?tabs.at(-1):tabs[(index+(e.key==="ArrowRight"?1:-1)+tabs.length)%tabs.length];if(next){next.focus();next.click();}}));
  dateInput.addEventListener("change",async()=>{
    const seq=++slotsRequest, date=dateInput.value, type=appointmentType;clearSlots("Loading available times…");
    if(!validate("preferredDate")||!configured){clearSlots();return;}
    const data=new FormData();data.append("UserId",doctorId);data.append("Date",date);data.append("Type",type);
    try{
      const slots=await request("/api/Patient_Appointment/getslots",{method:"POST",body:data});
      if(seq!==slotsRequest||date!==dateInput.value||type!==appointmentType)return;
      if(!Array.isArray(slots))throw new Error("Invalid slots");clearSlots(slots.length?"Select Time Slot":"No Slots Available");
      slots.forEach(slot=>{if(slot.id==null||typeof slot.label!=="string")return;const option=new Option(slot.label,String(slot.id));option.dataset.label=slot.label;timeSelect.append(option);});
      timeSelect.disabled=timeSelect.options.length<2;
      if(timeSelect.disabled)error("preferredTime","No time slots are available for this date.");
    }catch{if(seq===slotsRequest){clearSlots("Unable to load times");error("preferredTime","Could not load available times. Choose the date again or contact the clinic.");}}
  });

  function openModal(e){if(e)e.preventDefault();trigger=e?.currentTarget||document.activeElement;modal.classList.add("is-open");modal.setAttribute("aria-hidden","false");lock(true);(review.hidden ? form.fullName : $("bookingReviewTitle")).focus();}
  function closeModal(){if(isSubmitting)return;closeCalendar();toggleTip(false);modal.classList.remove("is-open");modal.setAttribute("aria-hidden","true");lock(false);requestAnimationFrame(() => trigger?.focus());}
  document.querySelectorAll(".cta-btn,[data-open-booking]").forEach(el=>el.addEventListener("click",openModal));
  $("bookingModalClose").addEventListener("click",closeModal);$("bookingModalBackdrop").addEventListener("click",closeModal);
  function markRead(){if(!agree.disabled)return;agree.disabled=false;consentFooter.classList.add("is-read");track("consent_scrolled_to_bottom");}
  function checkRead(){if(!consentModal?.classList.contains("is-open")||!agree.disabled)return;if(consentDialog.scrollHeight-consentDialog.scrollTop-consentDialog.clientHeight<=8)markRead();}
  function openConsent(){
    modal.classList.remove("is-open");modal.setAttribute("aria-hidden","true");consentModal.classList.add("is-open");consentModal.setAttribute("aria-hidden","false");agree.disabled=true;consentFooter.classList.remove("is-read");consentDialog.scrollTop=0;$("consentModalClose").focus();requestAnimationFrame(checkRead);track("consent_modal_open");
  }
  function closeConsent(agreed,method){
    if(agreed&&agree.disabled)return;
    track(agreed?"consent_agreed":"consent_dismissed",{method,scrolled_to_bottom:!agree.disabled});
    consentModal.classList.remove("is-open");consentModal.setAttribute("aria-hidden","true");consent.checked=agreed;submit.disabled=!agreed;error("consentCheckbox");
    modal.classList.add("is-open");modal.setAttribute("aria-hidden","false");consent.focus();
  }
  // Use change rather than cancelling click: a cancelled checkbox click suppresses change.
  consent.addEventListener("change",event=>{
    if(!event.isTrusted)return;
    const checked=consent.checked;track("consent_checkbox_click",{checked});
    consent.checked=false;submit.disabled=true;if(checked)openConsent();
  });
  consentDialog?.addEventListener("scroll",checkRead,{passive:true});window.addEventListener("resize",checkRead);
  $("consentModalClose").addEventListener("click",()=>closeConsent(false,"close_button"));
  $("consentModalBackdrop").addEventListener("click",()=>closeConsent(false,"backdrop"));
  agree.addEventListener("click",()=>closeConsent(true,"agree_button"));
  const info=$("onlineConsultInfo"),tip=$("onlineConsultTip");
  function toggleTip(on){tip.hidden=!on;info.classList.toggle("is-open",on);}
  info.addEventListener("pointerenter",e=>{if(e.pointerType==="mouse")toggleTip(true);});info.addEventListener("pointerleave",e=>{if(e.pointerType==="mouse")toggleTip(false);});
  info.addEventListener("click",()=>toggleTip(tip.hidden));onlineTab.addEventListener("focus",()=>toggleTip(true));onlineTab.addEventListener("blur",()=>toggleTip(false));
  document.addEventListener("click",e=>{if(!onlineTab.contains(e.target)&&!tip.contains(e.target))toggleTip(false);});

  function previewFile(file){
    if(previewURL){URL.revokeObjectURL(previewURL);previewURL=null;}
    const preview=$("reportPreview"),thumb=$("reportPreviewThumb"),icon=$("reportPreviewIcon");
    preview.classList.toggle("is-visible",!!file);thumb.hidden=true;thumb.removeAttribute("src");icon.hidden=true;
    if(!file)return;$("reportPreviewName").textContent=file.name;$("reportPreviewSize").textContent=(file.size/1024).toFixed(1)+" KB";
    if(["image/jpeg","image/png"].includes(file.type)){previewURL=URL.createObjectURL(file);thumb.src=previewURL;thumb.alt="Selected report image preview";thumb.hidden=false;}else{icon.hidden=false;}
  }
  form.report.addEventListener("change",()=>{const file=form.report.files[0];if(!validate("report")){previewFile(null);return;}previewFile(file);if(file)track("report_uploaded");});
  $("reportPreviewRemove").addEventListener("click",()=>{form.report.value="";previewFile(null);error("report");});
  $("uploadReportBtn").addEventListener("click",()=>form.report.click());
  function restoreForm(){review.hidden=true;form.hidden=false;modal.querySelector(".booking-modal-tabs").hidden=false;$("editBookingBtn").disabled=false;submit.focus();}
  $("editBookingBtn").addEventListener("click",restoreForm);
  function valueRow(label,value){const dt=document.createElement("dt"),dd=document.createElement("dd");dt.textContent=label;dd.textContent=value;$("bookingReviewDetails").append(dt,dd);}
  function showReview(){
    $("bookingReviewStatus").textContent = "";
    snapshot={name:form.fullName.value.trim(),phone:iti.getNumber(),email:form.email.value.trim(),date:dateInput.value,slot:timeSelect.value,time:timeSelect.selectedOptions[0].dataset.label,reason:form.reason.value.trim(),type:appointmentType,file:form.report.files[0]};
    $("bookingReviewDetails").replaceChildren();
    [["Consultation",snapshot.type==="online"?"Online consultation":"Clinic visit"],["Name",snapshot.name],["Phone",snapshot.phone],["Email",snapshot.email],["Date",dateText.value],["Time",snapshot.time],["Reason",snapshot.reason],["Report",snapshot.file?.name||"No report attached"]].forEach(([l,v])=>valueRow(l,v));
    if(snapshot.type==="offline")valueRow("Clinic",[form.dataset.clinicname,form.dataset.address,form.dataset.district,form.dataset.state,form.dataset.pincode].filter(Boolean).join(", "));
    form.hidden=true;review.hidden=false;modal.querySelector(".booking-modal-tabs").hidden=true;toggleTip(false);dialog.scrollTop=0;$("bookingReviewTitle").focus();
  }
  form.addEventListener("submit",async e=>{
    e.preventDefault();if(isSubmitting)return;
    if(iti){try{await Promise.race([iti.promise,new Promise((_,reject)=>setTimeout(()=>reject(new Error("timeout")),8000))]);}catch{phoneUtilsReady=false;}}
    const invalid=["fullName","phone","email","preferredDate","preferredTime","reason","report","consentCheckbox"].filter(name=>!validate(name));
    if(invalid.length){(invalid[0]==="preferredDate"?dateText:invalid[0]==="report"?$("uploadReportBtn"):form.elements.namedItem(invalid[0]))?.focus();return;}
    if(!configured){say("Appointment booking is not configured yet. Please contact the clinic.");return;}
    showReview();
  });
  async function prepareUpload(file){
    if(!file||file.type==="application/pdf")return file;
    const bitmap=await createImageBitmap(file),scale=Math.min(1,800/bitmap.width,800/bitmap.height);
    const canvas=document.createElement("canvas");canvas.width=Math.max(1,Math.round(bitmap.width*scale));canvas.height=Math.max(1,Math.round(bitmap.height*scale));
    const ctx=canvas.getContext("2d");ctx.fillStyle="#fff";ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close();
    const blob=await new Promise(resolve=>canvas.toBlob(resolve,"image/jpeg",0.5));if(!blob)throw new Error("Could not prepare the report image. Please remove it or choose another file.");
    return new File([blob],file.name.replace(/\.[^.]+$/,".jpg"),{type:"image/jpeg"});
  }
  confirm.addEventListener("click",async()=>{
    if(isSubmitting||!snapshot||!configured||!consent.checked)return;isSubmitting=true;confirm.disabled=true;$("editBookingBtn").disabled=true;$("bookingReviewStatus").textContent="Sending your appointment request…";
    try{
      const s=snapshot,data=new FormData();
      Object.entries({DoctorId:doctorId,FullName:s.name,Phone:s.phone,Email:s.email,Date:s.date,Type:s.type,Day:fromISO(s.date).toLocaleDateString("en-US",{weekday:"long"}),SlotId:s.slot,Time:s.time,Reason:s.reason}).forEach(([k,v])=>data.append(k,v));
      const file=await prepareUpload(s.file);if(file)data.append("Upload",file);
      const result=await request("/api/Patient_Appointment/patient_appointment",{method:"POST",body:data});
      const type=result?.data?.type??result?.type;
      if(type!==s.type)throw new Error("We could not verify confirmation. Please contact the clinic before submitting again.");
      window.__trackBookingSuccess?.(type==="offline"?"clinic":"online");
      isSubmitting=false;form.reset();previewFile(null);clearDate();consent.checked=false;submit.disabled=true;restoreForm();closeModal();
      const meetLink = result?.data?.meetLink ?? result?.meetLink;
      showBookingPopup(type === "online"
        ? (meetLink ? "Your online consultation is confirmed. Please join 5 minutes before your scheduled time. Check your email for joining details." : "Your online consultation has been booked successfully. Contact the clinic for joining details.")
        : "Your clinic appointment is confirmed. Please attend at " + [form.dataset.clinicname, form.dataset.address, form.dataset.district, form.dataset.state, form.dataset.pincode].filter(Boolean).join(", ") + ". Please arrive 15 minutes before your scheduled appointment.", true);
    }catch(err){$("bookingReviewStatus").textContent=err.name==="AbortError"?"The request timed out. Please contact the clinic to check before retrying.":(err.message||"No confirmation was received. Please contact the clinic.");}
    finally{isSubmitting=false;confirm.disabled=false;$("editBookingBtn").disabled=false;}
  });
  form.addEventListener("reset",()=>{iti?.setNumber("");iti?.setSelectedCountry("in");form.querySelectorAll(".booking-error").forEach(el=>el.textContent="");previewFile(null);clearDate();});
  function showBookingPopup(message,success){
    const overlay=document.createElement("div");overlay.id="bookingPopup";overlay.className="booking-popup-overlay";overlay.setAttribute("role","dialog");overlay.setAttribute("aria-modal","true");overlay.setAttribute("aria-labelledby","bookingPopupTitle");
    overlay.innerHTML='<div class="booking-popup"><div class="booking-popup-icon"><i class="fa-solid fa-circle-check" aria-hidden="true"></i></div><h2 id="bookingPopupTitle">Appointment confirmed</h2><p></p><button type="button" class="booking-popup-ok">OK</button></div>';
    overlay.querySelector("p").textContent=message;document.body.append(overlay);lock(true);
    const remove=()=>{overlay.remove();lock(false);requestAnimationFrame(() => trigger?.focus());};overlay.querySelector("button").addEventListener("click",remove);overlay.addEventListener("click",e=>{if(e.target===overlay)remove();});overlay.addEventListener("keydown",e=>{if(e.key==="Escape"){e.stopPropagation();remove();}});overlay.querySelector("button").focus();
  }
  document.addEventListener("keydown",e=>{
    const active=$("bookingPopup")||(consentModal.classList.contains("is-open")?consentModal:modal.classList.contains("is-open")?modal:null);
    if(!active)return;
    if(e.key==="Tab"){const nodes=focusable(active),first=nodes[0],last=nodes.at(-1);if(!first)return;if(e.shiftKey&&(document.activeElement===first||!active.contains(document.activeElement))){e.preventDefault();last.focus();}else if(!e.shiftKey&&(document.activeElement===last||!active.contains(document.activeElement))){e.preventDefault();first.focus();}}
    if(e.key==="Escape"){
      e.preventDefault();if(!tip.hidden){toggleTip(false);return;}if(!calendar.hidden){closeCalendar();dateText.focus();return;}
      if(active===consentModal)closeConsent(false,"escape_key");else if(active===modal)closeModal();
    }
  });
  submit.textContent="Review Appointment";submit.disabled=true;clearSlots();loadModes();
})();

// GA4 booking_submitted: fired only after a successful API response.
window.__trackBookingSuccess = function (type) {
  window.trackEvent?.("booking_submitted", { appointment_type: type === "offline" ? "clinic" : type });
};

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
(function () {
  const footer = document.querySelector(".site-footer");
  if (!footer || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      document.body.classList.toggle("footer-in-view", entry.isIntersecting);
    });
  });
  observer.observe(footer);
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
        const age = Date.now() - t;
        return age >= 0 && age / 86400000 <= MAX_POST_AGE_DAYS;
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
            data.feeds.forEach((feed) => {
                if (!feed || feed.platform !== "facebook" || !Array.isArray(feed.posts)) return;
                feed.posts.forEach((post) => {
                    if (!post || !post.permalink) return;
                    try { const link = new URL(post.permalink); if (link.protocol !== "https:" || !/(^|\.)facebook\.com$/.test(link.hostname)) return; } catch { return; }
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
            carousel.scrollBy({ left: -stepSize(), behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
        });
        nextBtn.addEventListener("click", () => {
            carousel.scrollBy({ left: stepSize(), behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
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

// Prevent keyboard and assistive-technology access to content behind an open dialog.
(function overlayAccessibility() {
  const managed = new Map();
  let previous = null;
  function sync() {
    const active = document.getElementById("bookingPopup") ||
      document.querySelector("#consentModal.is-open,#bookingModal.is-open,#galleryLightbox.is-open,#chatbotFabWrap.is-open #chatbotWindow");
    if (active === previous) return;
    managed.forEach((value, el) => { el.inert = value; }); managed.clear();
    previous = active;
    document.body.classList.toggle("has-active-dialog", !!active);
    if (!active) return;
    let node = active;
    while (node.parentElement) {
      [...node.parentElement.children].forEach(sibling => {
        if (sibling === node || /^(SCRIPT|STYLE|LINK)$/.test(sibling.tagName)) return;
        managed.set(sibling, sibling.inert); sibling.inert = true;
      });
      node = node.parentElement;
      if (node === document.body) break;
    }
  }
  new MutationObserver(sync).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });
  sync();
})();
