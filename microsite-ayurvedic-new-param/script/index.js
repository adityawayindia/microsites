/* Ayurveda-02: audited navigation, dialogs and booking.
   No demo fetch interception. Live booking requires a clinic-owned account.
   Never send entered health information to analytics. */
const API_BASE = "https://digidrapi.digidr.app";
const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Clean in-page URLs, including incoming legal-page anchors.
(function initNavigation() {
  const menu = document.getElementById("mainNav");
  const toggle = document.getElementById("menuToggle");
  function closeMenu() { menu?.classList.remove("open"); toggle?.setAttribute("aria-expanded", "false"); }
  toggle?.addEventListener("click", () => {
    const open = menu.classList.toggle("open"); toggle.setAttribute("aria-expanded", String(open));
  });
  document.addEventListener("click", event => {
    const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
    if (link) {
      let url;
      try { url = new URL(link.getAttribute("href"), document.baseURI); } catch { return; }
      if (url.origin === location.origin && url.pathname === location.pathname && url.hash.length > 1) {
        const section = document.getElementById(decodeURIComponent(url.hash.slice(1)));
        if (section) {
          event.preventDefault(); closeMenu();
          section.scrollIntoView({behavior: reduceMotion() ? "auto" : "smooth", block: "start"});
          try { history.replaceState(null, "", location.pathname + location.search); } catch { /* opaque local QA origin */ }
          if (link.classList.contains("skip-link")) section.focus({preventScroll:true});
        }
      }
    }
    if (!menu?.contains(event.target) && !toggle?.contains(event.target)) closeMenu();
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && menu?.classList.contains("open")) { closeMenu(); toggle?.focus(); }
  });
  const initialHash = location.hash;
  if (initialHash) {
    requestAnimationFrame(() => {
      document.getElementById(decodeURIComponent(initialHash.slice(1)))?.scrollIntoView({behavior:"auto"});
      try { history.replaceState(null, "", location.pathname + location.search); } catch {}
    });
  }
  const header = document.querySelector(".site-header");
  if (header && "ResizeObserver" in window) new ResizeObserver(() => {
    document.documentElement.style.setProperty("--header-height", `${header.getBoundingClientRect().height}px`);
  }).observe(header);
})();

// Common keyboard and background-isolation behavior for all overlaid dialogs.
(function initDialogAccessibility() {
  let active = null, rootTrigger = null;
  const previousInert = new Map();
  const visible = el => !!el && el.getClientRects().length > 0 && getComputedStyle(el).visibility !== "hidden";
  function focusables(root) {
    return [...root.querySelectorAll('a[href],button,input,select,textarea,[tabindex]')]
      .filter(el => !el.disabled && el.tabIndex >= 0 && visible(el) && !el.closest('[hidden],[inert]'));
  }
  function topDialog() {
    return document.querySelector("#customPopup") ||
      document.querySelector("#consentModal.is-open") ||
      document.querySelector("#bookingModal.is-open") ||
      document.querySelector("#galleryLightbox.is-open") ||
      document.querySelector("#chatbotFabWrap.is-open #chatbotWindow");
  }
  function sync() {
    const next = topDialog();
    if (next === active) return;
    if (!active && next) rootTrigger = document.activeElement;
    previousInert.forEach((value, el) => { el.inert = value; }); previousInert.clear();
    active = next;
    document.body.classList.toggle("modal-open", !!active);
    if (active) {
      for (const child of document.body.children) {
        if (child === active || child.contains(active) || /^(SCRIPT|STYLE|LINK)$/.test(child.tagName)) continue;
        previousInert.set(child, child.inert); child.inert = true;
      }
      if (!active.contains(document.activeElement)) {
        const target = focusables(active)[0] || active;
        if (!target.hasAttribute("tabindex") && target === active) target.setAttribute("tabindex", "-1");
        target.focus({preventScroll:true});
      }
    } else if (rootTrigger?.isConnected) rootTrigger.focus({preventScroll:true});
  }
  new MutationObserver(sync).observe(document.body, {subtree:true,childList:true,attributes:true,attributeFilter:["class","hidden"]});
  document.addEventListener("keydown", event => {
    if (!active || event.key !== "Tab") return;
    const calendar = active.querySelector("#preferredDateCalendar:not([hidden])");
    const root = calendar || active;
    const items = focusables(root), first = items[0], last = items.at(-1);
    if (!first) { event.preventDefault(); root.focus(); return; }
    if (!root.contains(document.activeElement)) { event.preventDefault(); first.focus(); }
    else if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }, true);
  window.DigiDrDialogs = {sync};
})();

(function initGallery() {
  const box = document.getElementById("galleryLightbox");
  const image = document.getElementById("galleryLightboxImage");
  const items = [...document.querySelectorAll(".gallery-item")];
  if (!box || !image || !items.length) return;
  let index = 0, trigger;
  for (const [id, label, symbol] of [["galleryLightboxPrev","Previous image","‹"],["galleryLightboxNext","Next image","›"]]) {
    if (!document.getElementById(id)) { const btn=document.createElement("button");btn.id=id;btn.type="button";btn.className="gallery-lightbox-nav "+(id.endsWith("Prev")?"gallery-lightbox-prev":"gallery-lightbox-next");btn.setAttribute("aria-label",label);btn.textContent=symbol;box.append(btn); }
  }
  function show(i) { index=(i+items.length)%items.length;const source=items[index].querySelector("img");image.src=source.currentSrc||source.src;image.alt=source.alt; }
  function open(i, el) { trigger=el;show(i);box.classList.add("is-open");box.setAttribute("aria-hidden","false");window.DigiDrDialogs.sync(); }
  function close() { box.classList.remove("is-open");box.setAttribute("aria-hidden","true");image.removeAttribute("src");window.DigiDrDialogs.sync();trigger?.focus({preventScroll:true}); }
  items.forEach((el,i) => { el.addEventListener("click",()=>open(i,el));el.addEventListener("keydown",event=>{if(event.key==="Enter"||event.key===" "){event.preventDefault();open(i,el);}}); });
  document.getElementById("galleryLightboxClose")?.addEventListener("click",close);
  document.getElementById("galleryLightboxBackdrop")?.addEventListener("click",close);
  document.getElementById("galleryLightboxPrev").addEventListener("click",()=>show(index-1));
  document.getElementById("galleryLightboxNext").addEventListener("click",()=>show(index+1));
  document.addEventListener("keydown",event=>{if(!box.classList.contains("is-open"))return;if(event.key==="Escape")close();if(event.key==="ArrowLeft")show(index-1);if(event.key==="ArrowRight")show(index+1);});
})();

// Booking is deliberately fail-closed until production configuration is supplied.
(function initBooking() {
  const form = document.getElementById("bookingForm");
  const modal = document.getElementById("bookingModal");
  if (!form || !modal) return;
  const field = name => form.elements.namedItem(name);
  const status = document.getElementById("bookingStatus");
  const submit = document.getElementById("submitBtn");
  const consent = document.getElementById("consentCheckbox");
  const notice = document.getElementById("consentModal");
  const agree = document.getElementById("consentAgreeBtn");
  const noticeDialog = notice.querySelector(".consent-modal-dialog");
  const review = document.getElementById("bookingReview");
  const confirm = document.getElementById("confirmBookingBtn");
  const edit = document.getElementById("editBookingBtn");
  const reviewError = document.getElementById("reviewError");
  const typeLabel = document.getElementById("bookingModalTitle");
  const clinic = document.getElementById("clinicVisitTab");
  const online = document.getElementById("onlineConsultTab");
  const info = document.getElementById("onlineConsultInfo");
  const tip = document.getElementById("onlineConsultTip");
  const calendar = document.getElementById("preferredDateCalendar");
  const dateDisplay = document.getElementById("preferredDateText");
  const dateField = document.getElementById("preferredDate");
  const timeField = document.getElementById("preferredTime");
  const report = document.getElementById("report");
  const preview = document.getElementById("filePreview");
  const configReady = () => form.dataset.bookingEnabled === "true" && !!form.dataset.userid && !/^(demo|placeholder)/i.test(form.dataset.userid) && !/\x7b\x7b/.test(form.dataset.userid);
  let appointmentType = "offline", availableDays = new Set(), requestVersion = 0, slotsVersion = 0;
  let sending = false, validating = false, reviewing = false, uploadPending = false, validFile = null, fileURL = null;
  let uploadVersion = 0, consentRead = false, initiator = null;
  let iti = null, phoneUtilsReady = false;
  const maxBytes = 5 * 1024 * 1024;
  const today = new Date(); today.setHours(0,0,0,0);
  let viewDate = new Date(today.getFullYear(),today.getMonth(),1);
  const iso = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  const parseLocal = value => { const m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(value);if(!m)return null;const d=new Date(+m[1],+m[2]-1,+m[3]);return iso(d)===value?d:null; };
  const allowedDate = d => d && d>=today && availableDays.has(d.toLocaleDateString("en-US",{weekday:"long"}).toLowerCase());
  dateField.min = iso(today);

  async function requestJSON(path, options={}) {
    const controller = new AbortController();const timer=setTimeout(()=>controller.abort(),15000);
    try {
      const response=await fetch(API_BASE+path,{...options,signal:controller.signal});
      if(!response.ok)throw new Error("Service unavailable");
      return await response.json();
    } finally {clearTimeout(timer);}
  }
  function emit(name,params) {window.trackEvent?.(name,params);}
  function setError(name,message) {
    const el=document.getElementById("error-"+name);if(el)el.textContent=message||"";
    const input=name==="preferredDate"?dateDisplay:field(name);input?.setAttribute("aria-invalid",message?"true":"false");input?.classList.toggle("is-invalid",!!message);
  }
  function clearErrors() {form.querySelectorAll(".booking-error").forEach(el=>el.textContent="");form.querySelectorAll("[aria-invalid]").forEach(el=>{el.setAttribute("aria-invalid","false");el.classList.remove("is-invalid");});}
  function refreshSubmit() {submit.disabled=!consent.checked||sending||validating||uploadPending;}
  function setTip(show) {tip.hidden=!show;info.setAttribute("aria-expanded",String(show));}
  info.addEventListener("pointerenter",e=>{if(e.pointerType==="mouse")setTip(true);});
  info.addEventListener("pointerleave",e=>{if(e.pointerType==="mouse"&&document.activeElement!==info)setTip(false);});
  info.addEventListener("focus",()=>setTip(true));info.addEventListener("blur",()=>setTip(false));
  info.addEventListener("click",event=>{event.stopPropagation();setTip(true);});
  document.addEventListener("click",event=>{if(!info.contains(event.target)&&!tip.contains(event.target))setTip(false);});

  try {
    if (typeof window.intlTelInput === "function") {
      iti=window.intlTelInput(field("phone"),{initialCountry:"in",countryOrder:["in"],separateDialCode:true,loadUtils:()=>import("https://cdn.jsdelivr.net/npm/intl-tel-input@29.2.2/dist/js/utils.js")});
      iti.promise.then(()=>{phoneUtilsReady=true;}).catch(()=>{phoneUtilsReady=false;});
    }
  } catch {phoneUtilsReady=false;}

  function openModal(trigger) {
    initiator=trigger||document.activeElement;modal.classList.add("is-open");modal.setAttribute("aria-hidden","false");
    document.querySelector("#bookingModal .booking-modal-dialog").scrollTop=0;window.DigiDrDialogs.sync();
  }
  function closeModal() {
    if(sending)return;
    closeCalendar();setTip(false);modal.classList.remove("is-open");modal.setAttribute("aria-hidden","true");
    window.DigiDrDialogs.sync();initiator?.focus({preventScroll:true});
  }
  document.querySelectorAll('[data-ga-event="book_appointment_click"]').forEach(btn=>btn.addEventListener("click",e=>{e.preventDefault();openModal(btn);}));
  document.getElementById("bookingModalClose").addEventListener("click",closeModal);
  document.getElementById("bookingModalBackdrop").addEventListener("click",closeModal);

  function checkConsentScroll() {
    if(!notice.classList.contains("is-open")||consentRead)return;
    if(noticeDialog.scrollHeight-noticeDialog.scrollTop-noticeDialog.clientHeight<=8) {
      consentRead=true;agree.disabled=false;document.getElementById("consentModalFooter").classList.add("is-read");emit("consent_scrolled_to_bottom");
    }
  }
  function openConsent() {
    consent.checked=false;refreshSubmit();consentRead=false;agree.disabled=true;
    document.getElementById("consentModalFooter").classList.remove("is-read");
    modal.classList.remove("is-open");modal.setAttribute("aria-hidden","true");notice.classList.add("is-open");notice.setAttribute("aria-hidden","false");
    noticeDialog.scrollTop=0;window.DigiDrDialogs.sync();emit("consent_modal_open");requestAnimationFrame(checkConsentScroll);
  }
  function closeConsent(accepted,method) {
    if(accepted&&!consentRead)return;
    consent.checked=accepted;notice.classList.remove("is-open");notice.setAttribute("aria-hidden","true");modal.classList.add("is-open");modal.setAttribute("aria-hidden","false");
    emit(accepted?"consent_agreed":"consent_dismissed",{method,scrolled_to_bottom:consentRead});refreshSubmit();window.DigiDrDialogs.sync();consent.focus({preventScroll:true});
  }
  consent.addEventListener("change",()=>{emit("consent_checkbox_click",{checked:consent.checked});if(consent.checked)openConsent();else refreshSubmit();});
  noticeDialog.addEventListener("scroll",checkConsentScroll,{passive:true});window.addEventListener("resize",checkConsentScroll);
  agree.addEventListener("click",()=>closeConsent(true,"agree_button"));
  document.getElementById("consentModalClose").addEventListener("click",()=>closeConsent(false,"close_button"));
  document.getElementById("consentModalBackdrop").addEventListener("click",()=>closeConsent(false,"backdrop"));

  function resetDateAndSlots() {++slotsVersion;dateField.value="";dateDisplay.value="";timeField.replaceChildren(new Option("Select Time Slot",""));timeField.disabled=true;}
  async function loadAvailableDays(type = appointmentType) {
    const version=++requestVersion;availableDays=new Set();renderCalendar();
    if(!configReady())return;
    status.textContent="Checking clinic availability…";
    try {
      const data=await requestJSON(`/api/Patient_Appointment/getavailabledays?userid=${encodeURIComponent(form.dataset.userid)}&type=${type}`);
      if(version!==requestVersion)return;
      if(!Array.isArray(data))throw new Error("Invalid availability");
      availableDays=new Set(data.filter(d=>typeof d==="string").map(d=>d.toLowerCase()));
      status.textContent=availableDays.size?"Choose an available date to view appointment times.":"No dates are available. Please contact the clinic.";
    } catch {if(version===requestVersion)status.textContent="Availability could not be loaded. Please try again or contact the clinic.";}
    if(version===requestVersion)renderCalendar();
  }
  function setType(type) {
    appointmentType=type;const isClinic=type==="offline";
    clinic.classList.toggle("is-active",isClinic);online.classList.toggle("is-active",!isClinic);clinic.setAttribute("aria-pressed",String(isClinic));online.setAttribute("aria-pressed",String(!isClinic));
    typeLabel.textContent=isClinic?"Book a clinic visit":"Book an online consultation";
    field("reason").placeholder=isClinic?"Describe the reason for your clinic visit…":"Describe the reason for your online consultation…";
    setTip(false);resetDateAndSlots();closeCalendar();window.__onAppointmentTypeChange?.(appointmentType);
  }
  window.__onAppointmentTypeChange = loadAvailableDays;
  clinic.addEventListener("click",()=>setType("offline"));online.addEventListener("click",()=>setType("online"));
  async function loadModes() {
    if(!configReady()) {status.textContent="Online booking is awaiting clinic activation. Please contact the clinic directly.";return;}
    try {
      const data=await requestJSON(`/api/Patient_Appointment/getappointment?userid=${encodeURIComponent(form.dataset.userid)}`);
      if(!data || typeof data!=="object" || Array.isArray(data)) throw new Error("Invalid modes");
      const isOnlineAvailable = data.online ?? true;
      const isOfflineAvailable = data.offline ?? true;
      if(typeof isOnlineAvailable!=="boolean"||typeof isOfflineAvailable!=="boolean")throw new Error("Invalid modes");
      clinic.hidden=clinic.disabled=!isOfflineAvailable;
      online.hidden=online.disabled=!isOnlineAvailable;
      online.closest(".booking-online-option").hidden=!isOnlineAvailable;
      if(!isOnlineAvailable&&!isOfflineAvailable){
        document.querySelectorAll('.cta-btn, [data-ga-event="book_appointment_click"]').forEach(btn=>btn.hidden=true);
        status.textContent="Appointments are not currently available. Please contact the clinic.";return;
      }
      setType(isOfflineAvailable?"offline":"online");
    } catch {status.textContent="Appointment availability could not be loaded. Please contact the clinic.";}
  }

  function renderCalendar() {
    const title=calendar.querySelector("[data-cal-title]"), grid=calendar.querySelector("[data-cal-grid]");
    title.textContent=viewDate.toLocaleDateString("en-US",{month:"long",year:"numeric"});grid.replaceChildren();
    const offset=new Date(viewDate.getFullYear(),viewDate.getMonth(),1).getDay();
    for(let i=0;i<offset;i++){const spacer=document.createElement("span");spacer.className="booking-calendar-day--empty";spacer.setAttribute("aria-hidden","true");grid.append(spacer);}
    const days=new Date(viewDate.getFullYear(),viewDate.getMonth()+1,0).getDate();
    for(let day=1;day<=days;day++) {
      const date=new Date(viewDate.getFullYear(),viewDate.getMonth(),day), btn=document.createElement("button");
      btn.type="button";btn.className="booking-calendar-day";btn.textContent=day;btn.dataset.date=iso(date);btn.setAttribute("aria-label",date.toLocaleDateString("en-US",{weekday:"long",day:"numeric",month:"long",year:"numeric"}));
      btn.disabled=!allowedDate(date);btn.classList.toggle("is-disabled",btn.disabled);
      if(iso(date)===iso(today))btn.classList.add("is-today");
      if(iso(date)===dateField.value){btn.classList.add("is-selected");btn.setAttribute("aria-current","date");}
      btn.addEventListener("click",()=>{dateField.value=iso(date);dateDisplay.value=date.toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"});closeCalendar();dateDisplay.focus();dateField.dispatchEvent(new Event("change",{bubbles:true}));});grid.append(btn);
    }
    calendar.querySelector("[data-cal-prev]").disabled=viewDate<=new Date(today.getFullYear(),today.getMonth(),1);
    calendar.querySelector("[data-cal-next]").disabled=false;
  }
  function openCalendar() {renderCalendar();calendar.hidden=false;dateDisplay.setAttribute("aria-expanded","true");requestAnimationFrame(()=>{(calendar.querySelector(".booking-calendar-day:not(:disabled)")||document.getElementById("calendarClose")).focus();});}
  function closeCalendar() {calendar.hidden=true;dateDisplay.setAttribute("aria-expanded","false");}
  dateDisplay.addEventListener("click",()=>calendar.hidden?openCalendar():closeCalendar());
  dateDisplay.addEventListener("keydown",event=>{if(["Enter"," ","ArrowDown"].includes(event.key)){event.preventDefault();openCalendar();}});
  document.getElementById("calendarClose").addEventListener("click",()=>{closeCalendar();dateDisplay.focus();});
  for(const [sel,offset] of [["[data-cal-prev]",-1],["[data-cal-next]",1]]) calendar.querySelector(sel).addEventListener("click",()=>{viewDate=new Date(viewDate.getFullYear(),viewDate.getMonth()+offset,1);renderCalendar();});
  document.addEventListener("click",event=>{if(!calendar.contains(event.target)&&event.target!==dateDisplay)closeCalendar();});
  dateField.addEventListener("change",async()=>{
    const version=++slotsVersion;timeField.replaceChildren(new Option("Loading times…",""));timeField.disabled=true;
    if(!configReady()||!allowedDate(parseLocal(dateField.value))){timeField.replaceChildren(new Option("Select an available date",""));return;}
    const selectedDate=dateField.value,selectedType=appointmentType;
    try {
      const body=new FormData();body.append("UserId",form.dataset.userid);body.append("Date",selectedDate);body.append("Type",selectedType);
      const data=await requestJSON("/api/Patient_Appointment/getslots",{method:"POST",body});
      if(version!==slotsVersion||selectedType!==appointmentType||selectedDate!==dateField.value)return;
      if(!Array.isArray(data))throw new Error("Invalid slots");
      timeField.replaceChildren(new Option(data.length?"Select Time Slot":"No Slots Available",""));
      for(const slot of data){if(slot.id==null||typeof slot.label!=="string")continue;const option=new Option(slot.label,String(slot.id));option.dataset.label=slot.label;timeField.append(option);}
      timeField.disabled=timeField.options.length<2;
    } catch {if(version===slotsVersion){timeField.replaceChildren(new Option("Times unavailable",""));setError("preferredTime","Times could not be loaded. Please try another date or contact the clinic.");}}
  });

  field("fullName").addEventListener("input",event=>{event.target.value=event.target.value.replace(/[^\p{L}\p{M} '\-]/gu,"");});
  document.getElementById("uploadReportBtn").addEventListener("click",()=>report.click());
  function clearPreview(){if(fileURL){URL.revokeObjectURL(fileURL);fileURL=null;}preview.replaceChildren();validFile=null;}
  report.addEventListener("change",async()=>{
    const version=++uploadVersion,file=report.files[0];clearPreview();setError("report","");uploadPending=false;
    if(!file){refreshSubmit();return;}
    const isPDF=file.type==="application/pdf"&&/\.pdf$/i.test(file.name),isJPG=file.type==="image/jpeg"&&/\.jpe?g$/i.test(file.name),isPNG=file.type==="image/png"&&/\.png$/i.test(file.name);
    if(!(isPDF||isJPG||isPNG)){report.value="";setError("report","Please choose a PDF, JPG or PNG file.");refreshSubmit();return;}
    if(file.size>maxBytes||file.size===0){report.value="";setError("report","Please choose a nonempty file no larger than 5 MB.");refreshSubmit();return;}
    uploadPending=true;refreshSubmit();
    try {
      const bytes=new Uint8Array(await file.slice(0,8).arrayBuffer());
      const signatureOK=isPDF?String.fromCharCode(...bytes.slice(0,5))==="%PDF-":isJPG?bytes[0]===255&&bytes[1]===216&&bytes[2]===255:[137,80,78,71,13,10,26,10].every((n,i)=>bytes[i]===n);
      if(!signatureOK)throw new Error("Invalid content");
      if(version!==uploadVersion)return;validFile=file;
      const wrap=document.createElement("div");wrap.className="preview-container";
      if(!isPDF){fileURL=URL.createObjectURL(file);const img=document.createElement("img");img.src=fileURL;img.alt="Selected report preview";img.width=44;img.height=44;img.className="preview-image";wrap.append(img);}
      const label=document.createElement("p");label.className="preview-name";label.textContent=`${file.name} (${Math.ceil(file.size/1024)} KB)`;wrap.append(label);
      const remove=document.createElement("button");remove.type="button";remove.className="booking-secondary-btn";remove.textContent="Remove";remove.setAttribute("aria-label","Remove uploaded report");remove.addEventListener("click",()=>{++uploadVersion;report.value="";clearPreview();setError("report","");});wrap.append(remove);preview.append(wrap);
      emit("report_uploaded");
    } catch {if(version===uploadVersion){report.value="";setError("report","The file content does not match its format. Please choose another file.");}}
    finally {if(version===uploadVersion){uploadPending=false;refreshSubmit();}}
  });

  async function validate() {
    clearErrors();let valid=true;
    const invalid=(name,message)=>{setError(name,message);valid=false;};
    const fullName=field("fullName").value.trim();
    if(!fullName||!/^[\p{L}\p{M} '\-]+$/u.test(fullName)||!/[\p{L}]/u.test(fullName))invalid("fullName","Enter your full name using letters, spaces, apostrophes or hyphens.");
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field("email").value.trim()))invalid("email","Please enter a valid email address.");
    const phone=field("phone").value.trim();
    if(!phone)invalid("phone","Please enter your phone number.");
    else {
      try {
        if(!iti)throw new Error("Phone validation unavailable");
        let timer;try {await Promise.race([iti.promise,new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error("Phone validation timeout")),8000);})]);}finally{clearTimeout(timer);}
        if(!phoneUtilsReady)throw new Error("Phone validation unavailable");
        if(!iti.isValidNumber())invalid("phone","Please enter a valid phone number.");
      } catch {invalid("phone","Phone validation could not load. Please reconnect and try again, or contact the clinic.");}
    }
    if(!allowedDate(parseLocal(dateField.value)))invalid("preferredDate","Select an available date; past dates are not allowed.");
    if(!timeField.value||timeField.disabled)invalid("preferredTime","Please select an available time slot.");
    if(field("reason").value.trim().length<10)invalid("reason","Please provide a brief description (at least 10 characters).");
    if(uploadPending)invalid("report","Please wait for the file to finish validating.");
    if(report.files.length&&!validFile)invalid("report","Please remove or replace the invalid file.");
    if(!consent.checked)invalid("consentCheckbox","Please read and agree to the consent notice.");
    if(!valid)form.querySelector('[aria-invalid="true"]')?.focus();
    return valid;
  }
  function showReview(){
    const dl=document.getElementById("bookingReviewDetails");dl.replaceChildren();
    const details=[["Name",field("fullName").value],["Phone",iti.getNumber()],["Email",field("email").value],["Consultation",appointmentType==="offline"?"Clinic visit":"Online consultation"],["Date",dateDisplay.value],["Time",timeField.selectedOptions[0].textContent],["Reason",field("reason").value],["Report",validFile?validFile.name:"No report attached"]];
    for(const [label,value] of details){const dt=document.createElement("dt"),dd=document.createElement("dd");dt.textContent=label;dd.textContent=value;dl.append(dt,dd);}
    reviewing=true;reviewError.textContent="";form.hidden=true;review.hidden=false;document.querySelector(".booking-modal-tabs").hidden=true;review.focus();
  }
  function editDetails(){reviewing=false;review.hidden=true;form.hidden=false;document.querySelector(".booking-modal-tabs").hidden=false;field("fullName").focus();}
  edit.addEventListener("click",editDetails);confirm.addEventListener("click",()=>form.requestSubmit());

  function showConfirmation(result, type){
    const popup=document.createElement("div");popup.id="customPopup";popup.className="digidr-popup is-success";popup.setAttribute("role","dialog");popup.setAttribute("aria-modal","true");popup.setAttribute("aria-labelledby","customPopupTitle");
    popup.innerHTML='<div class="digidr-popup-card"><h2 id="customPopupTitle">Appointment confirmed</h2><p id="confirmationMessage"></p><p id="confirmationLocation"></p><button class="digidr-popup-ok" type="button" id="popupOkBtn">OK</button></div>';
    const payload=result?.data || result;
    popup.querySelector("#confirmationMessage").textContent=type==="online"
      ? (payload?.meetLink ? "Your appointment is confirmed. Please join 5 minutes before your scheduled time. Check your email for details." : "Your online consultation has been booked successfully.")
      : "Your appointment is confirmed. Confirmation details have been sent to your registered email. Please arrive 15 minutes before your scheduled appointment.";
    const location=popup.querySelector("#confirmationLocation");
    if(type==="offline") location.textContent="Appointment location: "+[form.dataset.clinicname,form.dataset.address,form.dataset.district,form.dataset.state,form.dataset.pincode].filter(Boolean).join(", ");
    else location.hidden=true;
    document.body.append(popup);window.DigiDrDialogs.sync();
    const close=()=>{popup.remove();window.DigiDrDialogs.sync();initiator?.focus({preventScroll:true});};
    document.getElementById("popupOkBtn").addEventListener("click",close);popup.addEventListener("click",e=>{if(e.target===popup)close();});
    popup.addEventListener("keydown",e=>{if(e.key==="Escape"){e.stopPropagation();close();}});
  }
  form.addEventListener("submit",async event=>{
    event.preventDefault();if(sending||validating)return;validating=true;refreshSubmit();
    try {
      if(!await validate())return;
      if(!reviewing){showReview();return;}
      if(!configReady()){reviewError.textContent="Booking is not yet activated. Please contact the clinic directly.";return;}
      sending=true;confirm.disabled=true;edit.disabled=true;document.getElementById("bookingLoader")?.setAttribute("aria-hidden","false");reviewError.textContent="Sending your appointment request…";
      const body=new FormData();
      const date=parseLocal(dateField.value);
      const values={DoctorId:form.dataset.userid,FullName:field("fullName").value.trim(),Phone:iti.getNumber(),Email:field("email").value.trim(),Date:dateField.value,Type:appointmentType,Day:date.toLocaleDateString("en-US",{weekday:"long"}),SlotId:timeField.value,Time:timeField.selectedOptions[0].textContent,Reason:field("reason").value.trim()};
      Object.entries(values).forEach(([key,value])=>body.append(key,value));if(validFile)body.append("Upload",validFile);
      const data=await requestJSON("/api/Patient_Appointment/patient_appointment",{method:"POST",body});
      const returnedType=data?.data?.type??data?.type;
      if(data?.success===false||!["online","offline"].includes(returnedType)||returnedType!==appointmentType)throw new Error("Unexpected appointment response");
      emit("booking_submitted",{appointment_type:appointmentType==="offline"?"clinic":"online"});
      sending=false;form.reset();review.hidden=true;form.hidden=false;document.querySelector(".booking-modal-tabs").hidden=false;reviewing=false;
      closeModal();showConfirmation(data,returnedType);
    } catch {reviewError.textContent="Your appointment could not be submitted. Your details are still here. Please try again or contact the clinic.";}
    finally {sending=false;validating=false;confirm.disabled=false;edit.disabled=false;document.getElementById("bookingLoader")?.setAttribute("aria-hidden","true");refreshSubmit();}
  });
  form.addEventListener("reset",()=>{++uploadVersion;clearPreview();uploadPending=false;resetDateAndSlots();closeCalendar();clearErrors();iti?.setNumber("");iti?.setSelectedCountry("in");requestAnimationFrame(refreshSubmit);});
  document.addEventListener("keydown",event=>{
    if(event.key!=="Escape"||document.getElementById("customPopup"))return;
    if(!tip.hidden){setTip(false);info.focus();return;}
    if(!calendar.hidden){closeCalendar();dateDisplay.focus();return;}
    if(notice.classList.contains("is-open")){closeConsent(false,"escape_key");return;}
    if(modal.classList.contains("is-open"))closeModal();
  });
  resetDateAndSlots();renderCalendar();loadModes();refreshSubmit();
})();

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

// DigiDr Stat Counter
// Counts each [data-counter] element up from 0 to the number in its own text
// (e.g. "15", "15+", "20k+", "20,000+"), keeping the suffix and commas.
// The real value is in the HTML, so it shows without JS; text that doesn't
// start with a number is left alone. Runs once, when the stat scrolls into
// view. With prefers-reduced-motion the final value is shown straight away.
(function () {
  var els = document.querySelectorAll("[data-counter]");
  if (!els.length) return;

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || !("IntersectionObserver" in window)) return;

  var DURATION = 1400;

  function parse(el) {
    var text = el.textContent.trim();
    var match = text.match(/^(\d[\d,]*(?:\.\d+)?)(.*)$/);
    if (!match) return null;
    var numText = match[1];
    var target = parseFloat(numText.replace(/,/g, ""));
    if (!isFinite(target)) return null;
    return {
      target: target,
      suffix: match[2],
      commas: numText.indexOf(",") !== -1,
      decimals: (numText.split(".")[1] || "").length,
      original: text
    };
  }

  function format(value, info) {
    var text = info.decimals ? value.toFixed(info.decimals) : String(Math.round(value));
    if (info.commas) {
      var parts = text.split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      text = parts.join(".");
    }
    return text + info.suffix;
  }

  function animate(el, info) {
    var start = null;
    function step(now) {
      if (start === null) start = now;
      var progress = Math.min((now - start) / DURATION, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = progress < 1 ? format(info.target * eased, info) : info.original;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      animate(entry.target, entry.target.__digidrCounter);
    });
  }, { threshold: 0.4 });

  els.forEach(function (el) {
    var info = parse(el);
    if (!info) return;
    el.__digidrCounter = info;
    el.textContent = format(0, info);
    observer.observe(el);
  });
})();


// Optional fellowship: hide empty or unresolved values, even against display:flex.
(function () {
  document.querySelectorAll("[data-hero-fellowship]").forEach(function (el) {
    var value=el.textContent.replace(/^\s*Fellowship:\s*/i, "").trim();
    var missing=!value || /\x7b\x7b|\x7d\x7d/.test(value);
    el.hidden=missing;
    if(missing)el.style.display="none";
  });
})();
