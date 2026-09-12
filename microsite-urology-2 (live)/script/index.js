const API_BASE = "https://digidrapi.digidr.app";
//const API_BASE = "https://localhost:7088";
async function compressImage(file) {

    console.log("compressImage started");

    const bitmap = await createImageBitmap(file);

    console.log("bitmap created");

    let width = bitmap.width;
    let height = bitmap.height;

    const maxWidth = 800;
    const maxHeight = 800;

    if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(bitmap, 0, 0, width, height);

    const blob = await new Promise(resolve =>
        canvas.toBlob(resolve, "image/jpeg", 0.5)
    );

    return new File(
        [blob],
        file.name.replace(/\.[^/.]+$/, "") + ".jpg",
        { type: "image/jpeg" }
    );
}

function blobToFile(blob, fileName) {
    return new File([blob], fileName, { type: "image/jpeg" });
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
}

// Testimonials Carousel
(function () {
    const track = document.getElementById("testimonialsTrack");
    const carousel = document.getElementById("testimonialsCarousel");
    const dotsContainer = document.getElementById("carouselDots");
    const prevBtn = document.querySelector(".carousel-btn--prev");
    const nextBtn = document.querySelector(".carousel-btn--next");
    const cards = track ? track.querySelectorAll(".testimonial-card") : [];
    const totalCards = cards.length;

    if (!track || totalCards === 0) return;

    const AUTO_INTERVAL = 9999;
    let currentIndex = 0;
    let autoTimer = null;
    let touchStartX = 0;
    let touchEndX = 0;

    function getCardsPerView() {
        const w = window.innerWidth;
        if (w <= 640) return 1;
        if (w <= 900) return 2;
        return 3;
    }

    function getMaxIndex() {
        return Math.max(0, totalCards - getCardsPerView());
    }

    function goTo(index) {
        currentIndex = Math.max(0, Math.min(index, getMaxIndex()));
        const targetCard = cards[currentIndex];
        const offset = targetCard ? -targetCard.offsetLeft : 0;
        track.style.transform = `translateX(${offset}px)`;
        updateDots();
        resetAutoPlay();
    }

    function updateDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = "";
        const maxIndex = getMaxIndex();
        for (let i = 0; i <= maxIndex; i++) {
            const dot = document.createElement("button");
            dot.type = "button";
            dot.className = "carousel-dot" + (i === currentIndex ? " active" : "");
            dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
            dot.addEventListener("click", () => goTo(i));
            dotsContainer.appendChild(dot);
        }
    }

    function resetAutoPlay() {
        if (autoTimer) clearInterval(autoTimer);
        autoTimer = setInterval(() => {
            const max = getMaxIndex();
            if (currentIndex >= max) {
                goTo(0);
            } else {
                goTo(currentIndex + 1);
            }
        }, AUTO_INTERVAL);
    }

    function stopAutoPlay() {
        if (autoTimer) {
            clearInterval(autoTimer);
            autoTimer = null;
        }
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", () => goTo(currentIndex - 1));
    }
    if (nextBtn) {
        nextBtn.addEventListener("click", () => goTo(currentIndex + 1));
    }

    const carouselWrap = carousel?.closest(".testimonials-carousel-wrap");
    const touchTarget = carouselWrap || carousel || track;

    touchTarget.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoPlay();
    }, { passive: true });

    touchTarget.addEventListener("touchend", (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) goTo(currentIndex + 1);
            else goTo(currentIndex - 1);
        }
        resetAutoPlay();
    }, { passive: true });

    touchTarget.addEventListener("mousedown", () => stopAutoPlay());
    touchTarget.addEventListener("mouseup", () => resetAutoPlay());
    touchTarget.addEventListener("mouseleave", () => resetAutoPlay());

    // NOTE: the date-picker init used to live here and referenced an out-of-scope
    // `form` variable belonging to the (separate) booking-modal IIFE below, which
    // threw a ReferenceError on every page load and silently broke this carousel's
    // own goTo(0)/updateDots() calls further down. It now lives in its own IIFE
    // (see initDatePicker below) and looks up the form itself.

    window.addEventListener("resize", () => {
        goTo(Math.min(currentIndex, getMaxIndex()));
        updateDots();
    });

    goTo(0);
    updateDots();
})();

// Booking date picker (moved out of the testimonials carousel IIFE â€” it has
// nothing to do with testimonials, and previously crashed on load because it
// referenced a `form` variable that didn't exist in that scope)

let iti = null;
let phoneUtilsReady = false;

function initPhonePlugin() {
    const form = document.getElementById("bookingForm");
    const phoneInputEl = form?.phone;
    if (!phoneInputEl || !window.intlTelInput) return;

    iti = window.intlTelInput(phoneInputEl, {
        initialCountry: "in",
        countryOrder: ["in"],
        separateDialCode: true,
        loadUtils: () => import("https://cdn.jsdelivr.net/npm/intl-tel-input@29.2.2/dist/js/utils.js"),
    });

    iti.promise.then(() => { phoneUtilsReady = true; }).catch(() => { });

    form.addEventListener("reset", () => {
        iti?.setNumber("");
        iti?.setSelectedCountry("in");
    });
}

initPhonePlugin();

(function initDatePicker() {
    const form = document.getElementById("bookingForm");
    const trigger = document.getElementById("preferredDateText");
    const hiddenInput = document.getElementById("preferredDate");
    const field = document.getElementById("preferredDateField");
    const calendar = document.getElementById("preferredDateCalendar");
    if (!form || !trigger || !hiddenInput || !field || !calendar) return;

    const titleEl = calendar.querySelector("[data-cal-title]");
    const gridEl = calendar.querySelector("[data-cal-grid]");
    const prevBtn = calendar.querySelector("[data-cal-prev]");
    const nextBtn = calendar.querySelector("[data-cal-next]");
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const BOOKING_WINDOW_DAYS = 30;
    const maxBookableDate = new Date(today);
    maxBookableDate.setDate(maxBookableDate.getDate() + BOOKING_WINDOW_DAYS);

    let viewDate = new Date(today.getFullYear(), today.getMonth(), 1);
    let selectedDate = null;

    const doctorId = form.dataset.userid;
    let availableDays = null;

    async function loadAvailableDays(type) {
        try {
            const res = await fetch(`${API_BASE}/api/Patient_Appointment/getavailabledays?userid=${doctorId}&type=${type}`);
            const days = await res.json();
            availableDays = new Set((days || []).map(d => d.toLowerCase()));
        } catch (err) {
            console.warn("Failed to load available days:", err.message);
            availableDays = null;
        }
        render();
    }

    // booking-modal IIFE calls this whenever the clinic/online tab changes
    window.__onAppointmentTypeChange = loadAvailableDays;
    loadAvailableDays("offline");

    function pad(n) { return String(n).padStart(2, "0"); }
    function formatISO(d) { return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }
    function formatDisplay(d) { return `${pad(d.getDate())} ${monthNames[d.getMonth()].slice(0, 3)} ${d.getFullYear()}`; }
    function isSameDay(a, b) {
        return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
    }

    function render() {
        if (!titleEl || !gridEl) return;
        titleEl.textContent = `${monthNames[viewDate.getMonth()]} ${viewDate.getFullYear()}`;
        gridEl.innerHTML = "";

        const firstDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
        const startOffset = firstDay.getDay();
        const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();

        for (let i = 0; i < startOffset; i++) {
            const spacer = document.createElement("span");
            spacer.className = "booking-calendar-day booking-calendar-day--empty";
            gridEl.appendChild(spacer);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const cellDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "booking-calendar-day";
            btn.textContent = String(day);

            const dayName = cellDate.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
            const isUnconfiguredDay = availableDays && availableDays.size > 0 && !availableDays.has(dayName);

            const isOutsideWindow = cellDate > maxBookableDate;

            if (cellDate < today || isUnconfiguredDay) {
                btn.disabled = true;
                btn.classList.add("is-disabled");
            }
            if (isSameDay(cellDate, today)) btn.classList.add("is-today");
            if (isSameDay(cellDate, selectedDate)) btn.classList.add("is-selected");

            btn.addEventListener("click", () => {
                selectedDate = cellDate;
                hiddenInput.value = formatISO(cellDate);
                trigger.value = formatDisplay(cellDate);
                hiddenInput.dispatchEvent(new Event("change", { bubbles: true }));
                close();
            });

            gridEl.appendChild(btn);
        }
        if (nextBtn) {
            const firstOfNextMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
            nextBtn.disabled = firstOfNextMonth > maxBookableDate;
            nextBtn.classList.toggle("is-disabled", nextBtn.disabled);
        }
        // Also stop navigating before the current month
        if (prevBtn) {
            const lastOfPrevMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 0);
            prevBtn.disabled = lastOfPrevMonth < new Date(today.getFullYear(), today.getMonth(), 1);
            prevBtn.classList.toggle("is-disabled", prevBtn.disabled);
        }
    }

    prevBtn?.addEventListener("click", (event) => {
        event.stopPropagation();
        if (prevBtn.disabled) return; // NEW guard
        viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
        render();
    });

    nextBtn?.addEventListener("click", (event) => {
        event.stopPropagation();
        if (nextBtn.disabled) return; // NEW guard
        viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
        render();
    });

    function open() {
        calendar.hidden = false;
        field.classList.add("is-open");
        render();
        document.addEventListener("click", onOutsideClick);
    }

    function close() {
        calendar.hidden = true;
        field.classList.remove("is-open");
        document.removeEventListener("click", onOutsideClick);
    }

    function onOutsideClick(event) {
        if (!field.contains(event.target)) close();
    }

    trigger.addEventListener("click", () => {
        calendar.hidden ? open() : close();
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !calendar.hidden) close();
    });

    //document.addEventListener("keydown", (event) => {
    //    if (event.key === "Escape" && !calendar.hidden) close();
    //});

    form.addEventListener("reset", () => {
        selectedDate = null;
        trigger.value = "";
        hiddenInput.value = "";
        viewDate = new Date(today.getFullYear(), today.getMonth(), 1);
        close();
    });
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
            document.body.style.overflow = "hidden";
        }
    }

    function closeLightbox() {
        lightbox.classList.remove("is-open");
        lightbox.setAttribute("aria-hidden", "true");
        lightboxImage.src = "";
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
        img.addEventListener("click", () => openLightbox(idx));
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

// Social Media Carousel
(function () {
    const track = document.getElementById("socialMediaTrack");
    const carousel = document.getElementById("socialMediaCarousel");
    const dotsContainer = document.getElementById("socialCarouselDots");
    const prevBtn = document.querySelector(".social-carousel-prev");
    const nextBtn = document.querySelector(".social-carousel-next");
    const cards = track ? track.querySelectorAll(".social-post-card") : [];
    const totalCards = cards.length;

    if (!track || totalCards === 0) return;

    const AUTO_INTERVAL = 5000;
    let currentIndex = 0;
    let autoTimer = null;
    let touchStartX = 0;
    let touchEndX = 0;

    function getCardsPerView() {
        const w = window.innerWidth;
        if (w <= 640) return 1;
        if (w <= 900) return 2;
        return 3;
    }

    function getMaxIndex() {
        return Math.max(0, totalCards - getCardsPerView());
    }

    function goTo(index) {
        currentIndex = Math.max(0, Math.min(index, getMaxIndex()));
        const targetCard = cards[currentIndex];
        const offset = targetCard ? -targetCard.offsetLeft : 0;
        track.style.transform = `translateX(${offset}px)`;
        updateDots();
        resetAutoPlay();
    }

    function updateDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = "";
        const maxIndex = getMaxIndex();
        for (let i = 0; i <= maxIndex; i++) {
            const dot = document.createElement("button");
            dot.type = "button";
            dot.className = "carousel-dot" + (i === currentIndex ? " active" : "");
            dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
            dot.addEventListener("click", () => goTo(i));
            dotsContainer.appendChild(dot);
        }
    }

    function resetAutoPlay() {
        if (autoTimer) clearInterval(autoTimer);
        autoTimer = setInterval(() => {
            const max = getMaxIndex();
            if (currentIndex >= max) {
                goTo(0);
            } else {
                goTo(currentIndex + 1);
            }
        }, AUTO_INTERVAL);
    }

    function stopAutoPlay() {
        if (autoTimer) {
            clearInterval(autoTimer);
            autoTimer = null;
        }
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", () => goTo(currentIndex - 1));
    }
    if (nextBtn) {
        nextBtn.addEventListener("click", () => goTo(currentIndex + 1));
    }

    const carouselWrap = carousel?.closest(".social-media-carousel-wrap");
    const touchTarget = carouselWrap || carousel || track;

    touchTarget.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoPlay();
    }, { passive: true });

    touchTarget.addEventListener("touchend", (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) goTo(currentIndex + 1);
            else goTo(currentIndex - 1);
        }
        resetAutoPlay();
    }, { passive: true });

    touchTarget.addEventListener("mousedown", () => stopAutoPlay());
    touchTarget.addEventListener("mouseup", () => resetAutoPlay());
    touchTarget.addEventListener("mouseleave", () => resetAutoPlay());

    window.addEventListener("resize", () => {
        goTo(Math.min(currentIndex, getMaxIndex()));
        updateDots();
    });

    goTo(0);
    updateDots();
})();

// Booking Modal & Form Validation
(function () {
    const modal = document.getElementById("bookingModal");
    const dialog = modal?.querySelector(".booking-modal-dialog");
    const backdrop = document.getElementById("bookingModalBackdrop");
    const closeBtn = document.getElementById("bookingModalClose");
    const form = document.getElementById("bookingForm");

    // Guard BEFORE touching form.dataset â€” previously this bailout ran too
    // late (after several form.dataset.* reads), so a page missing the
    // booking modal/form would throw instead of quietly skipping this IIFE.
    if (!modal || !dialog || !form) return;

    const consentCheckbox = document.getElementById("consentCheckbox");
    const submitBtnEl = document.getElementById("submitBtn") || form.querySelector(".booking-submit-btn");

    if (consentCheckbox && submitBtnEl) {
        submitBtnEl.disabled = !consentCheckbox.checked;

        consentCheckbox.addEventListener("change", () => {
            submitBtnEl.disabled = !consentCheckbox.checked;
            window.trackEvent?.("consent_checkbox_click", { checked: consentCheckbox.checked });
        });

        // Intercept disabled property sets to respect consent checkbox state
        const descriptor = Object.getOwnPropertyDescriptor(HTMLButtonElement.prototype, 'disabled');
        if (descriptor) {
            Object.defineProperty(submitBtnEl, 'disabled', {
                get() {
                    return descriptor.get.call(this);
                },
                set(val) {
                    if (!val && !consentCheckbox.checked) {
                        descriptor.set.call(this, true);
                    } else {
                        descriptor.set.call(this, val);
                    }
                },
                configurable: true
            });
        }
    }

    const doctorId = form.dataset.userid;
    const clinicName = form.dataset.clinicname;
    const clinicAddress = form.dataset.address;
    // Bug fix: the HTML only sets data-district (there is no data-city
    // attribute), so this used to always read as `undefined` and rendered
    // literally as "undefined" in the offline booking confirmation message.
    const clinicDistrict = form.dataset.district;
    const clinicState = form.dataset.state;
    const clinicPincode = form.dataset.pincode;
    const clinicTab = document.getElementById("clinicVisitTab");
    const onlineTab = document.getElementById("onlineConsultTab");
    const openTriggers = document.querySelectorAll(".cta-btn");

    let isOnlineAvailable = true;
    let isOfflineAvailable = true;
    let compressedFile = null;

    (async () => {
        try {

            const response = await fetch(`${API_BASE}/api/Patient_Appointment/getappointment?userid=${doctorId}`);

            if (!response.ok) {
                console.warn(`Appointment API returned ${response.status}, using defaults`);
                return;
            }

            const data = await response.json();

            isOnlineAvailable = data.online ?? true;
            isOfflineAvailable = data.offline ?? true;

            // hide online tab
            if (!isOnlineAvailable && onlineTab) {
                onlineTab.style.display = "none";
            }

            // hide offline tab
            if (!isOfflineAvailable && clinicTab) {
                clinicTab.style.display = "none";
            }

            // auto select available tab
            if (isOnlineAvailable && !isOfflineAvailable) {
                appointmentType = "online";
                setActiveTab("online");
                window.__onAppointmentTypeChange?.(appointmentType);
            }

            if (isOfflineAvailable && !isOnlineAvailable) {
                appointmentType = "offline";
                setActiveTab("clinic");
                window.__onAppointmentTypeChange?.(appointmentType);
            }

            // Hide all book appointment buttons if both are unavailable
            if (!isOnlineAvailable && !isOfflineAvailable) {
                document.querySelectorAll(".cta-btn").forEach(btn => {
                    btn.style.display = "none";
                });
            }

        } catch (err) {
            console.warn("Failed to fetch appointment availability:", err.message);
            // Keep defaults if API fails - don't break the page
        }
    })();

    function setBodyScroll(disable) {
        document.body.style.overflow = disable ? "hidden" : "";
    }

    function openModal() {
        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");
        setBodyScroll(true);
    }

    function closeModal() {
        modal.classList.remove("is-open");
        modal.setAttribute("aria-hidden", "true");
        setBodyScroll(false);
    }

    openTriggers.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            openModal();
        });
    });

    closeBtn?.addEventListener("click", closeModal);
    backdrop?.addEventListener("click", closeModal);

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && modal.classList.contains("is-open")) {
            closeModal();
        }
    });

    function setActiveTab(active) {
        if (!clinicTab || !onlineTab) return;
        if (active === "clinic") {
            clinicTab.classList.add("is-active");
            onlineTab.classList.remove("is-active");
            clinicTab.setAttribute("aria-selected", "true");
            onlineTab.setAttribute("aria-selected", "false");
        } else {
            clinicTab.classList.remove("is-active");
            onlineTab.classList.add("is-active");
            clinicTab.setAttribute("aria-selected", "false");
            onlineTab.setAttribute("aria-selected", "true");
        }
    }

    // Fix: previously these two tabs each had TWO click listeners attached
    // (one set here, an identical second set further down) which both called
    // setActiveTab redundantly. Consolidated into a single listener per tab
    // that both switches the UI and updates appointmentType.
    let appointmentType = "offline";

    clinicTab?.addEventListener("click", () => {
        setActiveTab("clinic");
        appointmentType = "offline";
        window.__onAppointmentTypeChange?.(appointmentType);
    });
    onlineTab?.addEventListener("click", () => {
        setActiveTab("online");
        appointmentType = "online";
        window.__onAppointmentTypeChange?.(appointmentType);
    });

    function markFieldState(name, hasError) {
        const field = form[name];
        const fieldElement = Array.isArray(field) ? field[0] : field;
        if (!fieldElement) return;
        fieldElement.classList.toggle("is-invalid", hasError);
        fieldElement.setAttribute("aria-invalid", hasError ? "true" : "false");
        if (name === "preferredDate") {
            const displayField = document.getElementById("preferredDateText");
            if (displayField) {
                displayField.classList.toggle("is-invalid", hasError);
                displayField.setAttribute("aria-invalid", hasError ? "true" : "false");
            }
        }
    }

    function showError(name, message) {
        const errorEl = form.querySelector(`.booking-error[data-error-for="${name}"]`);
        if (errorEl) {
            errorEl.textContent = message || "";
        }
    }

    function clearErrors() {
        form.querySelectorAll(".booking-error").forEach((el) => {
            el.textContent = "";
        });
    }

    function validateEmail(value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    }

    function validatePhone(value) {
        const phoneRegex = /^\+?[0-9\s-]{7,10}$/;
        return phoneRegex.test(value);
    }

    function validateDateNotPast(value) {
        if (!value) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const chosen = new Date(value);
        return chosen >= today;
    }

    const preferredDateInput = document.getElementById("preferredDate");
    const preferredTimeSelect = document.getElementById("preferredTime");
    const reportInput = document.getElementById("report");
    const filePreviewDiv = document.getElementById("filePreview");
    const bookingLoader = document.getElementById("bookingLoader");
    const submitBtn = document.getElementById("submitBtn");

    if (preferredDateInput) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, "0");
        const dd = String(today.getDate()).padStart(2, "0");
        preferredDateInput.setAttribute("min", `${yyyy}-${mm}-${dd}`);
    }

    // FILE PREVIEW
    reportInput?.addEventListener("change", (e) => {
        const file = e.target.files[0];
        filePreviewDiv.innerHTML = "";
        compressedFile = null;

        if (!file) return;

        window.trackEvent?.("report_uploaded");

        const isImage = file.type.startsWith("image/");
        const isPdf = file.type === "application/pdf";

        if (isImage) {
            // Show compression status
            filePreviewDiv.innerHTML = `
                <div class="preview-container">
                    <div style="text-align: center; padding: 20px;">
                        <p style="margin: 0; color: #666;">Compressing image...</p>
                    </div>
                </div>
            `;

            (async function () {
                try {
                    // Compress the image
                    console.time("compression");

                    compressedFile = await compressImage(file);

                    console.timeEnd("compression");

                    if (!compressedFile) {
                        throw new Error("Compression failed");
                    }

                    const fileName = file.name;
                    const originalSizeKB = (file.size / 1024).toFixed(2);
                    const compressedSizeKB = (compressedFile.size / 1024).toFixed(2);
                    const compressionPercent = Math.round(
                        ((file.size - compressedFile.size) / file.size) * 100
                    );

                    // Create preview from compressed blob
                    const previewReader = new FileReader();
                    previewReader.onload = (event) => {
                        filePreviewDiv.innerHTML = `
                        <div class="preview-container">
                            <img src="${event.target.result}" alt="Preview" class="preview-image" />
                            <div class="preview-info">
                                <p class="preview-name">${fileName}</p>
                                <p class="preview-size">${compressedSizeKB} KB</p>
                            </div>
                        </div>
                    `;
                    };
                    previewReader.readAsDataURL(compressedFile);

                } catch (err) {
                    console.error("Compression error:", err);
                    filePreviewDiv.innerHTML = `
                    <div class="preview-container">
                        <div style="text-align: center; padding: 20px; color: #f44336;">
                            <p>Error compressing image. Please try another file.</p>
                        </div>
                    </div>
                `;
                }
            })();

        } else if (isPdf) {
            // PDFs are not compressed, just show preview
            const fileSize = (file.size / 1024).toFixed(2);
            compressedFile = file; // Use original PDF

            filePreviewDiv.innerHTML = `
                <div class="preview-container">
                    <div class="preview-pdf">
                        <i class="fa-solid fa-file-pdf"></i>
                    </div>
                    <div class="preview-info">
                        <p class="preview-name">${file.name}</p>
                        <p class="preview-size">${fileSize} KB</p>
                    </div>
                </div>
            `;
        }
    });

    // LOAD SLOTS API
    preferredDateInput?.addEventListener("change", async () => {

        const selectedDate = preferredDateInput.value;

        if (!selectedDate) return;

        try {

            const formData = new FormData();

            formData.append("UserId", doctorId);
            formData.append("Date", selectedDate);
            formData.append("Type", appointmentType);

            const response = await fetch(`${API_BASE}/api/Patient_Appointment/getslots`, {
                method: "POST",
                body: formData
            });
            console.log(response);

            const slots = await response.json();

            preferredTimeSelect.innerHTML =
                `<option value="">Select Time Slot</option>`;

            if (!slots || slots.length === 0) {

                preferredTimeSelect.innerHTML =
                    `<option value="">No Slots Available</option>`;

                return;
            }

            slots.forEach(slot => {
                preferredTimeSelect.innerHTML +=
                    `<option value="${slot.id}" data-label="${slot.label}">${slot.label}</option>`;
            });

        } catch (err) {

            console.error(err);

        }
    });

    let isSubmitting = false;

    form.addEventListener("submit", async (event) => {

        event.preventDefault();

        if (isSubmitting) {
            return;
        }

        clearErrors();

        const fullName = form.fullName.value.trim();
        const email = form.email.value.trim();
        const phone = form.phone.value.trim();
        const preferredDate = form.preferredDate.value;
        const preferredTime = form.preferredTime.value;
        const selectedTimeOption = preferredTimeSelect.selectedOptions[0];
        const preferredTimeLabel = selectedTimeOption ? selectedTimeOption.dataset.label : "";
        const reason = form.reason.value.trim();
        //const report = form.report.value.trim();
        const consentGiven = form.consentCheckbox.checked;

        let isValid = true;

        if (!fullName) {
            showError("fullName", "Please enter your full name.");
            isValid = false;
        }

        if (!email) {
            showError("email", "Please enter your email address.");
            isValid = false;
        } else if (!validateEmail(email)) {
            showError("email", "Please enter a valid email address.");
            isValid = false;
        }

        if (!phone) {
            showError("phone", "Please enter your phone number.");
            isValid = false;
        } else if (iti && phoneUtilsReady && !iti.isValidNumber()) {
            showError("phone", "Please enter a valid phone number.");
            isValid = false;
        }

        if (!preferredDate) {
            showError("preferredDate", "Please select a preferred date.");
            isValid = false;
        } else if (!validateDateNotPast(preferredDate)) {
            showError("preferredDate", "Date cannot be in the past.");
            isValid = false;
        }

        if (!preferredTime) {
            showError("preferredTime", "Please select a time slot.");
            isValid = false;
        }

        if (!reason || reason.length < 10) {
            showError("reason", "Please provide a brief description (min 10 characters).");
            isValid = false;
        }

        //if (!report || report.length == 0) {
        //    showError("report", "Please provide a image");
        //    isValid = false;
        //}

        // Bug fix: the form has `novalidate`, so the native `required` on the
        // consent checkbox was never enforced and nothing here checked it â€”
        // users could submit without consenting. Now actually validated.
        if (!consentGiven) {
            showError("consentCheckbox", "Please provide consent to proceed.");
            isValid = false;
        }

        if (!isValid) return;

        isSubmitting = true;
        submitBtn.disabled = true;
        submitBtn.style.display = "none";
        filePreviewDiv.style.display = "none";
        bookingLoader.setAttribute("aria-hidden", "false");

        try {
            const formData = new FormData();

            formData.append("DoctorId", doctorId);
            formData.append("FullName", fullName);
            formData.append("Phone", phone);
            formData.append("Email", email);
            formData.append("Date", preferredDate);
            formData.append("Type", appointmentType);

            const dayName = new Date(preferredDate).toLocaleDateString("en-US", { weekday: "long" });

            formData.append("Day", dayName);
            formData.append("SlotId", preferredTime);
            formData.append("Time", preferredTimeLabel);
            formData.append("Reason", reason);

            // Use compressed file if available
            if (compressedFile) {
                formData.append("Upload", compressedFile);
            }

            const response = await fetch(`${API_BASE}/api/Patient_Appointment/patient_appointment`, {
                method: "POST",
                body: formData
            });

            let result;
            let rawText = await response.text();

            try {
                result = JSON.parse(rawText);
            } catch {
                result = null;
            }

            const appointmentTypeResult = result?.type;
            const addressMessage = result?.message;

            if (appointmentTypeResult === "online") {
                const meetLink = result?.meetLink;
                const msg = meetLink
                    ? `Your appointment is confirmed.<br/><br/>Please join 5 minutes before your scheduled time. Check your email for details.`
                    : "Your online consultation has been booked successfully.";
                showPopup(msg, true);
                window.__trackBookingSuccess?.("online");
            } else if (appointmentTypeResult === "offline") {
                const locationHtml = `
        <strong>Appointment Location:</strong><br/>
        ${clinicName || ""}<br/>
        ${clinicAddress || ""}<br/>
        ${clinicDistrict || ""}${clinicState ? ", " + clinicState : ""}${clinicPincode ? " â€“ " + clinicPincode : ""}
    `;
                const msg = `Hello ${fullName},<br/><br/>
    Your Appointment is Confirmed!<br/><br/>
    ${locationHtml}<br/><br/>
    Confirmation details have been sent to your registered email<br/>
    Please arrive 15 minutes before your scheduled appointment to complete any necessary check-in.
`;
                showPopup(msg, true);
                window.__trackBookingSuccess?.("offline");
            } else if (!response.ok) {
                showPopup(addressMessage || "Something went wrong while booking your appointment.", false);
                return;
            }

            form.reset();
            filePreviewDiv.innerHTML = "";
            clearErrors();
            compressedFile = null;
            closeModal();

        } catch (err) {
            console.error(err);
            alert("Something went wrong.");

        }
        finally {
            isSubmitting = false;
            submitBtn.disabled = false;
            submitBtn.style.display = "block";
            filePreviewDiv.style.display = "block";
            bookingLoader.setAttribute("aria-hidden", "true");
        }
    });

    function showPopup(message, success = true) {

        // Remove existing popup if any
        document.getElementById("customPopup")?.remove();

        const popup = document.createElement("div");

        popup.id = "customPopup";

        popup.innerHTML = `
    <div style="
        position:fixed;
        top:0;
        left:0;
        width:100%;
        height:100%;
        background:rgba(0,0,0,.5);
        display:flex;
        justify-content:center;
        align-items:center;
        z-index:999999;
    ">
        <div style="
            background:#fff;
            width:800px;
            max-width:90%;
            border-radius:12px;
            padding:30px;
            text-align:center;
            box-shadow:0 10px 30px rgba(0,0,0,.3);
            animation:popupScale .25s ease;
            font-family:Arial,sans-serif;
        ">

            <div style="
                font-size:65px;
                margin-bottom:15px;
                color:${success ? "#28a745" : "#dc3545"};
            ">
                <i class="fa-solid ${success ? "fa-circle-check" : "fa-circle-xmark"}"></i>
            </div>

            <h2 style="
                margin:0 0 15px;
                color:#333;
            ">
                ${success ? "Success" : "Error"}
            </h2>

            <p style="
                margin:0 0 25px;
                color:#666;
                line-height:1.5;
            ">
                ${message}
            </p>

            <button id="popupOkBtn"
                style="
                    background:${success ? "#28a745" : "#dc3545"};
                    color:#fff;
                    border:none;
                    padding:10px 35px;
                    border-radius:6px;
                    cursor:pointer;
                    font-size:15px;
                ">
                OK
            </button>

        </div>
    </div>
    `;

        document.body.appendChild(popup);

        document.getElementById("popupOkBtn").onclick = () => {
            popup.remove();
        };
    }

})();

// ============================================================
//  Scattered Toy Decorations â€” Pediatric Child-Friendly Theme
// ============================================================


(function () {
    const micrositeId = document.body.dataset.micrositeid;
    if (!micrositeId) {
        return;
    }

    const SESSION_KEY = "digidr_session_id";
    let sessionId = sessionStorage.getItem(SESSION_KEY);
    if (!sessionId) {
        sessionId = (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`);
        sessionStorage.setItem(SESSION_KEY, sessionId);
    }

    function track(eventName, eventValue, platform) {
        const payload = JSON.stringify({
            micrositeId: Number(micrositeId),
            sessionId,
            eventName,
            eventValue: eventValue || null,
            platform: platform || null,
            page: window.location.pathname,
            referrer: document.referrer || null
        });

        const url = `${API_BASE}/api/MicrositeAnalytics/analytics/track`;

        // sendBeacon survives page navigation/unload; fetch is the fallback
        if (navigator.sendBeacon) {
            const blob = new Blob([payload], { type: "application/json" });
            navigator.sendBeacon(url, blob);
        } else {
            fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: payload,
                keepalive: true
            }).catch(() => { });
        }
    }

    // Page view â€” fires once per load
    track("page_view");

    // Book Appointment buttons (hero + contact section)
    document.querySelectorAll(".cta-btn").forEach((btn) => {
        btn.addEventListener("click", () => track("click_book_appointment"));
    });

    // Contact Now button
    document.querySelector(".contact-btn")?.addEventListener("click", () => {
        track("click_contact_now");
    });

    // Social icons (hero + footer) â€” skip disabled ones
    document.querySelectorAll(".social:not(.is-disabled), .footer-social-icon:not(.is-disabled)").forEach((el) => {
        const platform = [...el.classList]
            .find(c => c.startsWith("social-") && c !== "social")
            ?.replace("social-", "") || "unknown";
        el.addEventListener("click", () => track("click_social", platform));
    });

    // Phone / email links in contact section
    document.querySelectorAll('a[href^="tel:"]').forEach((el) => {
        el.addEventListener("click", () => track("click_phone"));
    });
    document.querySelectorAll('a[href^="mailto:"]').forEach((el) => {
        el.addEventListener("click", () => track("click_email"));
    });

    // Successful booking submission (fires from inside the existing booking form handler)
    window.__trackBookingSuccess = function (type) {
        track("booking_submitted", type);
        window.trackEvent?.("booking_submitted", { appointment_type: type });
    };

    let startTime = Date.now();
    window.addEventListener("beforeunload", () => {
        const seconds = Math.round((Date.now() - startTime) / 1000);
        track("time_on_page", seconds.toString());
    });
})();

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