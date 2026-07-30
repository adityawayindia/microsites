async function compressImage(file) {
    const bitmap = await createImageBitmap(file);
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

    const AUTO_INTERVAL = 4000;
    let currentIndex = 0;
    let autoTimer = null;
    let touchStartX = 0;
    let touchEndX = 0;

    function getCardsPerView() {
        const w = window.innerWidth;
        if (w <= 640) return 1;
        return 2;
    }

    function getMaxIndex() {
        return Math.max(0, totalCards - getCardsPerView());
    }

    function goTo(index, { restartAuto = true } = {}) {
        const max = getMaxIndex();
        currentIndex = ((index % (max + 1)) + (max + 1)) % (max + 1);
        const targetCard = cards[currentIndex];
        const offset = targetCard ? -targetCard.offsetLeft : 0;
        track.style.transform = `translateX(${offset}px)`;
        updateDots();
        if (restartAuto) startAutoPlay();
    }

    function nextSlide() {
        const max = getMaxIndex();
        goTo(currentIndex >= max ? 0 : currentIndex + 1);
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

    function startAutoPlay() {
        stopAutoPlay();
        if (getMaxIndex() < 1) return;
        autoTimer = setInterval(nextSlide, AUTO_INTERVAL);
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
        } else {
            startAutoPlay();
        }
    }, { passive: true });

    touchTarget.addEventListener("mouseenter", stopAutoPlay);
    touchTarget.addEventListener("mouseleave", startAutoPlay);

    window.addEventListener("resize", () => {
        goTo(Math.min(currentIndex, getMaxIndex()), { restartAuto: true });
    });

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) stopAutoPlay();
        else startAutoPlay();
    });

    goTo(0);
})();

// Gallery Lightbox
(function () {
    const lightbox = document.getElementById("galleryLightbox");
    const lightboxImage = document.getElementById("galleryLightboxImage");
    const closeBtn = document.getElementById("galleryLightboxClose");
    const backdrop = document.getElementById("galleryLightboxBackdrop");
    const galleryImages = document.querySelectorAll(".gallery-item img");

    if (!lightbox || !lightboxImage || galleryImages.length === 0) return;

    function openLightbox(src, alt) {
        lightboxImage.src = src;
        lightboxImage.alt = alt || "Enlarged gallery image";
        lightbox.classList.add("is-open");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    }

    function closeLightbox() {
        lightbox.classList.remove("is-open");
        lightbox.setAttribute("aria-hidden", "true");
        lightboxImage.src = "";
        document.body.style.overflow = "";
    }

    galleryImages.forEach((img) => {
        img.style.cursor = "zoom-in";
        img.addEventListener("click", () => openLightbox(img.src, img.alt));
    });

    if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
    if (backdrop) backdrop.addEventListener("click", closeLightbox);

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
            closeLightbox();
        }
    });
})();

// Booking Modal (frontend demo ? no API)
(function () {
    const modal = document.getElementById("bookingModal");
    const dialog = modal?.querySelector(".booking-modal-dialog");
    const backdrop = document.getElementById("bookingModalBackdrop");
    const closeBtn = document.getElementById("bookingModalClose");
    const form = document.getElementById("bookingForm");
    const clinicTab = document.getElementById("clinicVisitTab");
    const onlineTab = document.getElementById("onlineConsultTab");
    const openTriggers = document.querySelectorAll(".cta-btn");

    let compressedFile = null;
    let appointmentType = "offline";

    if (!modal || !dialog || !form) return;

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
        const isClinic = active === "clinic";
        clinicTab.classList.toggle("is-active", isClinic);
        onlineTab.classList.toggle("is-active", !isClinic);
        clinicTab.setAttribute("aria-selected", String(isClinic));
        onlineTab.setAttribute("aria-selected", String(!isClinic));
        appointmentType = isClinic ? "offline" : "online";
    }

    clinicTab?.addEventListener("click", () => setActiveTab("clinic"));
    onlineTab?.addEventListener("click", () => setActiveTab("online"));

    function showError(name, message) {
        const errorEl = form.querySelector(`.booking-error[data-error-for="${name}"]`);
        if (errorEl) errorEl.textContent = message || "";
    }

    function clearErrors() {
        form.querySelectorAll(".booking-error").forEach((el) => {
            el.textContent = "";
        });
    }

    function validateEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    function validatePhone(value) {
        return /^[6-9][0-9]{9}$/.test(value);
    }

    function validateDateNotPast(value) {
        if (!value) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return new Date(value) >= today;
    }

    const preferredDateInput = document.getElementById("preferredDate");
    const reportInput = document.getElementById("report");
    const filePreviewDiv = document.getElementById("filePreview");
    const bookingLoader = document.getElementById("bookingLoader");
    const submitBtn = document.getElementById("submitBtn");

    // Custom modern date picker (replaces native browser calendar)
    (function initDatePicker() {
        const trigger = document.getElementById("preferredDateText");
        const hiddenInput = document.getElementById("preferredDate");
        const field = document.getElementById("preferredDateField");
        const calendar = document.getElementById("preferredDateCalendar");
        if (!trigger || !hiddenInput || !field || !calendar) return;

        const titleEl = calendar.querySelector("[data-cal-title]");
        const gridEl = calendar.querySelector("[data-cal-grid]");
        const prevBtn = calendar.querySelector("[data-cal-prev]");
        const nextBtn = calendar.querySelector("[data-cal-next]");
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        let viewDate = new Date(today.getFullYear(), today.getMonth(), 1);
        let selectedDate = null;

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

                if (cellDate < today) {
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
        }

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

        prevBtn?.addEventListener("click", (event) => {
            event.stopPropagation();
            viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1);
            render();
        });

        nextBtn?.addEventListener("click", (event) => {
            event.stopPropagation();
            viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1);
            render();
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && !calendar.hidden) close();
        });

        form.addEventListener("reset", () => {
            selectedDate = null;
            trigger.value = "";
            hiddenInput.value = "";
            viewDate = new Date(today.getFullYear(), today.getMonth(), 1);
            close();
        });
    })();

    reportInput?.addEventListener("change", (e) => {
        const file = e.target.files[0];
        filePreviewDiv.innerHTML = "";
        compressedFile = null;
        if (!file) return;

        const isImage = file.type.startsWith("image/");
        const isPdf = file.type === "application/pdf";

        if (isImage) {
            filePreviewDiv.innerHTML = `
                <div class="preview-container">
                    <div style="text-align: center; padding: 20px;">
                        <p style="margin: 0; color: #666;">Compressing image...</p>
                    </div>
                </div>
            `;

            (async function () {
                try {
                    compressedFile = await compressImage(file);
                    const previewReader = new FileReader();
                    previewReader.onload = (event) => {
                        filePreviewDiv.innerHTML = `
                        <div class="preview-container">
                            <img src="${event.target.result}" alt="Preview" class="preview-image" />
                            <div class="preview-info">
                                <p class="preview-name">${file.name}</p>
                                <p class="preview-size">${(compressedFile.size / 1024).toFixed(2)} KB</p>
                            </div>
                        </div>`;
                    };
                    previewReader.readAsDataURL(compressedFile);
                } catch (err) {
                    console.error("Compression error:", err);
                    filePreviewDiv.innerHTML = `
                    <div class="preview-container">
                        <div style="text-align: center; padding: 20px; color: #f44336;">
                            <p>Error compressing image. Please try another file.</p>
                        </div>
                    </div>`;
                }
            })();
        } else if (isPdf) {
            compressedFile = file;
            filePreviewDiv.innerHTML = `
                <div class="preview-container">
                    <div class="preview-pdf"><i class="fa-solid fa-file-pdf"></i></div>
                    <div class="preview-info">
                        <p class="preview-name">${file.name}</p>
                        <p class="preview-size">${(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                </div>`;
        }
    });

    let isSubmitting = false;

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (isSubmitting) return;

        clearErrors();

        const fullName = form.fullName.value.trim();
        const email = form.email.value.trim();
        const phone = form.phone.value.trim();
        const preferredDate = form.preferredDate.value;
        const preferredTime = form.preferredTime.value;
        const reason = form.reason.value.trim();
        const report = form.report.value.trim();

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
        } else if (!validatePhone(phone)) {
            showError("phone", "Please enter a valid 10-digit phone number.");
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
        if (!report) {
            showError("report", "Please upload a report image or PDF.");
            isValid = false;
        }

        if (!isValid) return;

        isSubmitting = true;
        submitBtn.disabled = true;
        submitBtn.style.display = "none";
        filePreviewDiv.style.display = "none";
        bookingLoader.setAttribute("aria-hidden", "false");

        await new Promise((resolve) => setTimeout(resolve, 900));

        const msg = appointmentType === "online"
            ? "Your online consultation has been booked successfully. (Demo mode)"
            : "Your clinic appointment has been booked successfully at Hope Cancer Care Centre. (Demo mode)";

        showPopup(msg, true);
        form.reset();
        filePreviewDiv.innerHTML = "";
        clearErrors();
        compressedFile = null;
        closeModal();

        isSubmitting = false;
        submitBtn.disabled = false;
        submitBtn.style.display = "block";
        filePreviewDiv.style.display = "block";
        bookingLoader.setAttribute("aria-hidden", "true");
    });

    function showPopup(message, success = true) {
        document.getElementById("customPopup")?.remove();

        const popup = document.createElement("div");
        popup.id = "customPopup";
        popup.innerHTML = `
    <div style="
        position:fixed; top:0; left:0; width:100%; height:100%;
        background:rgba(0,0,0,.5); display:flex; justify-content:center;
        align-items:center; z-index:999999;">
        <div style="
            background:#fff; width:380px; max-width:90%; border-radius:12px;
            padding:30px; text-align:center; box-shadow:0 10px 30px rgba(0,0,0,.3);
            font-family:Sora,sans-serif;">
            <div style="font-size:65px; margin-bottom:15px; color:${success ? "#0f766e" : "#dc3545"};">
                <i class="fa-solid ${success ? "fa-circle-check" : "fa-circle-xmark"}"></i>
            </div>
            <h2 style="margin:0 0 15px; color:#142824;">${success ? "Success" : "Error"}</h2>
            <p style="margin:0 0 25px; color:#5a6f6a; line-height:1.5;">${message}</p>
            <button id="popupOkBtn" style="
                background:${success ? "#0f766e" : "#dc3545"}; color:#fff; border:none;
                padding:10px 35px; border-radius:999px; cursor:pointer; font-size:15px;">
                OK
            </button>
        </div>
    </div>`;

        document.body.appendChild(popup);
        document.getElementById("popupOkBtn").onclick = () => popup.remove();
    }
})();
