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

  window.addEventListener("resize", () => {
    goTo(Math.min(currentIndex, getMaxIndex()));
    updateDots();
  });

  goTo(0);
  updateDots();
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

    // Consent checkbox logic
    const consentCheckbox = document.getElementById("consentCheckbox");
    const submitBtnEl = document.getElementById("submitBtn") || form.querySelector(".booking-submit-btn");

    if (consentCheckbox && submitBtnEl) {
        submitBtnEl.disabled = !consentCheckbox.checked;

        consentCheckbox.addEventListener("change", () => {
            submitBtnEl.disabled = !consentCheckbox.checked;
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

  const clinicTab = document.getElementById("clinicVisitTab");
  const onlineTab = document.getElementById("onlineConsultTab");
  const openTriggers = document.querySelectorAll(".cta-btn");

  if (!modal || !dialog || !form) return;

  function setBodyScroll(disable) {
    document.body.style.overflow = disable ? "hidden" : "";
  }

  function openModal() {
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    setBodyScroll(true);
    form.fullName?.focus();
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

  clinicTab?.addEventListener("click", () => setActiveTab("clinic"));
  onlineTab?.addEventListener("click", () => setActiveTab("online"));

  const fieldValidators = {
    fullName(value) {
      if (!value) return "Please enter your full name.";
      if (value.length < 3) return "Name should be at least 3 characters.";
      if (!/^[A-Za-z\s.'-]+$/.test(value)) return "Name should contain only letters.";
      return "";
    },
    email(value) {
      if (!value) return "Please enter your email address.";
      if (!validateEmail(value)) return "Please enter a valid email address.";
      return "";
    },
    phone(value) {
      if (!value) return "Please enter your phone number.";
      if (!iti || !phoneUtilsReady) return "";
      if (!iti.isValidNumber()) return getPhoneErrorMessage(iti.getValidationError());
      return "";
    },
    preferredDate(value) {
      if (!value) return "Please select a preferred date.";
      if (!validateDateNotPast(value)) return "Date cannot be in the past.";
      return "";
    },
    preferredTime(value) {
      if (!value) return "Please select a time slot.";
      return "";
    },
    reason(value) {
      if (!value || value.length < 10) {
        return "Please provide a brief description (min 10 characters).";
      }
      return "";
    },
    report(file) {
      if (!file) return "";
      const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
      const maxFileSizeInBytes = 5 * 1024 * 1024;
      if (!allowedTypes.includes(file.type)) {
        return "Only JPEG, PNG, or PDF files are allowed.";
      }
      if (file.size > maxFileSizeInBytes) {
        return "File size should be less than 5 MB.";
      }
      return "";
    },
  };

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
    markFieldState(name, Boolean(message));
  }

  function clearErrors() {
    form.querySelectorAll(".booking-error").forEach((el) => {
      el.textContent = "";
    });
    ["fullName", "email", "phone", "preferredDate", "preferredTime", "reason", "report"].forEach((name) =>
      markFieldState(name, false)
    );
  }

  function validateEmail(value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  }

  let iti = null;
  let phoneUtilsReady = false;

  function getPhoneErrorMessage(errorCode) {
    if (!window.intlTelInput) return "Please enter a valid phone number.";
    const { VALIDATION_ERROR } = window.intlTelInput;
    switch (errorCode) {
      case VALIDATION_ERROR.INVALID_COUNTRY_CODE: return "Invalid country code.";
      case VALIDATION_ERROR.TOO_SHORT: return "Phone number is too short.";
      case VALIDATION_ERROR.TOO_LONG: return "Phone number is too long.";
      default: return "Please enter a valid phone number.";
    }
  }

  function initPhonePlugin() {
    const phoneInputEl = form.phone;
    if (!phoneInputEl || !window.intlTelInput) return;

    iti = window.intlTelInput(phoneInputEl, {
      initialCountry: "in",
      countryOrder: ["in"],
      separateDialCode: true,
      loadUtils: () => import("https://cdn.jsdelivr.net/npm/intl-tel-input@29.2.2/dist/js/utils.js"),
    });

    iti.promise.then(() => { phoneUtilsReady = true; }).catch(() => {});

    phoneInputEl.addEventListener("countrychange", () => {
      if (phoneInputEl.value.trim()) validateField("phone");
    });

    form.addEventListener("reset", () => {
      iti?.setNumber("");
      iti?.setSelectedCountry("in");
    });
  }

  function setDateConstraints() {
    const dateInput = form.preferredDate;
    if (!dateInput) return;
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    dateInput.min = `${yyyy}-${mm}-${dd}`;
  }

  function validateField(name) {
    if (!fieldValidators[name]) return true;

    const value = name === "report" ? form.report.files[0] : form[name].value.trim();
    const message = fieldValidators[name](value);
    showError(name, message);
    return !message;
  }

  function bindRealtimeValidation() {
    const textFields = ["fullName", "email", "phone", "reason"];
    textFields.forEach((name) => {
      const field = form[name];
      if (!field) return;
      field.addEventListener("input", () => validateField(name));
      field.addEventListener("blur", () => validateField(name));
    });

    ["preferredDate", "preferredTime", "report"].forEach((name) => {
      const field = form[name];
      if (!field) return;
      field.addEventListener("change", () => validateField(name));
    });
  }

  function setA11yAttributes() {
    form.querySelectorAll(".booking-error").forEach((errorEl) => {
      const fieldName = errorEl.getAttribute("data-error-for");
      if (!fieldName) return;
      const errorId = `booking-error-${fieldName}`;
      errorEl.id = errorId;
      errorEl.setAttribute("aria-live", "polite");
      const field = form[fieldName];
      const fieldElement = Array.isArray(field) ? field[0] : field;
      if (fieldElement) {
        fieldElement.setAttribute("aria-describedby", errorId);
      }
    });
  }

  form.fullName?.addEventListener("input", () => {
    const el = form.fullName;
    const sanitized = el.value.replace(/[^A-Za-z\s.'-]/g, "");
    if (sanitized !== el.value) el.value = sanitized;
  });

  initPhonePlugin();
  setDateConstraints();
  bindRealtimeValidation();
  setA11yAttributes();

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

  window.addEventListener("resize", setDateConstraints);

  form.addEventListener("reset", () => {
    clearErrors();
    setDateConstraints();
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearErrors();

    if (iti) {
      try { await iti.promise; } catch (e) {}
    }

    const fieldsToValidate = ["fullName", "email", "phone", "preferredDate", "preferredTime", "reason", "report"];
    const invalidFields = fieldsToValidate.filter((name) => !validateField(name));
    const isValid = invalidFields.length === 0;

    if (!isValid) {
      const firstInvalid = form[invalidFields[0]];
      const firstInvalidElement = Array.isArray(firstInvalid) ? firstInvalid[0] : firstInvalid;
      firstInvalidElement?.focus();
      return;
    }

    alert("Your appointment request has been submitted.");
    form.reset();
    closeModal();
  });
  function validateDateNotPast(value) {
    if (!value) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const chosen = new Date(value);
    return chosen >= today;
  }
})();

// ============================================================
//  Scattered Toy Decorations — Pediatric Child-Friendly Theme
// ============================================================
(function scatterToys() {
  const TOYS = [
    { emoji: "🦆", label: "duck" },
    { emoji: "🧸", label: "teddy bear" },
    { emoji: "🚂", label: "toy train" },
    { emoji: "🎀", label: "bow" },
    { emoji: "🌈", label: "rainbow" },
    { emoji: "🎈", label: "balloon" },
    { emoji: "⭐", label: "star" },
    { emoji: "🚗", label: "toy car" },
    { emoji: "🎯", label: "target ball" },
    { emoji: "🪀", label: "yo-yo" },
    { emoji: "🦋", label: "butterfly" },
    { emoji: "🌻", label: "sunflower" },
    { emoji: "🐥", label: "chick" },
    { emoji: "🎠", label: "carousel" },
    { emoji: "🌟", label: "glowing star" },
  ];

  const COUNT = 16;

  function randBetween(a, b) {
    return a + Math.random() * (b - a);
  }

  function getObstacles() {
    // Collect bounding rectangles of all visible main section cards & text containers
    const selectors = [
      ".container",
      ".hero-main-card",
      ".about-lead",
      ".about-description",
      ".service-card",
      ".contact-card",
      ".testimonial-card",
      ".philosophy-content",
      ".philosophy-visual",
      ".process-header",
      ".process-grid",
      ".gallery-header",
      ".gallery-grid",
      "header",
      "footer"
    ];

    const obstacles = [];
    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) {
          const scrollY = window.scrollY || window.pageYOffset;
          const scrollX = window.scrollX || window.pageXOffset;
          // Add 24px safety margin buffer around every content element
          obstacles.push({
            left: r.left + scrollX - 24,
            right: r.right + scrollX + 24,
            top: r.top + scrollY - 24,
            bottom: r.bottom + scrollY + 24
          });
        }
      });
    });
    return obstacles;
  }

  function hitsObstacle(x, y, sizePx, obstacles) {
    const toyR = {
      left: x,
      right: x + sizePx,
      top: y,
      bottom: y + sizePx
    };

    return obstacles.some(obs => {
      return !(
        toyR.right < obs.left ||
        toyR.left > obs.right ||
        toyR.bottom < obs.top ||
        toyR.top > obs.bottom
      );
    });
  }

  function placeToys() {
    // Only scatter if screen is wide enough to have empty margin space (>= 1240px)
    if (window.innerWidth < 1240) return;

    const obstacles = getObstacles();
    const docH = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      4000
    );

    const layer = document.createElement("div");
    layer.className = "toys-scatter-layer";
    layer.setAttribute("aria-hidden", "true");
    document.body.appendChild(layer);

    const startY = 750;
    const endY = docH - 450;
    const totalH = endY - startY;
    const bandH = totalH / COUNT;

    const winW = window.innerWidth;

    for (let i = 0; i < COUNT; i++) {
      const toy = TOYS[i % TOYS.length];
      const sizeRem = randBetween(1.8, 2.4);
      const sizePx = sizeRem * 16;
      const opacity = 1.0;
      const rotate = randBetween(-15, 15);

      // Try placing in left gutter or right gutter
      let placed = false;
      let attempts = 0;

      while (!placed && attempts < 25) {
        attempts++;
        const isLeft = Math.random() > 0.5;
        // Random X position strictly inside outer margin whitespace
        const x = isLeft
          ? randBetween(8, Math.max(12, winW * 0.08))
          : randBetween(winW - Math.max(12, winW * 0.08) - sizePx, winW - sizePx - 8);

        const y = startY + i * bandH + randBetween(-bandH * 0.3, bandH * 0.3);

        if (!hitsObstacle(x, y, sizePx, obstacles)) {
          const el = document.createElement("span");
          el.className = "toy-scatter-item";
          el.textContent = toy.emoji;
          el.setAttribute("title", toy.label);
          el.style.cssText = [
            `left:${Math.round(x)}px`,
            `top:${Math.round(y)}px`,
            `font-size:${sizeRem.toFixed(2)}rem`,
            `opacity:${opacity.toFixed(3)}`,
            `transform:rotate(${rotate.toFixed(1)}deg)`,
          ].join(";");

          layer.appendChild(el);
          placed = true;
        }
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", placeToys);
  } else {
    setTimeout(placeToys, 200);
  }
})();

/* ==========================================================================
   DigiDr Visitor Counter (frontend placeholder)
   No backend yet — count is tracked in this browser via localStorage and
   is NOT shared across visitors/devices. Starts at 0; each new browser
   session on this site adds 50. Swap getVisitorCount() for a real API
   call once the backend endpoint exists.
   ========================================================================== */
(function () {
  var STORAGE_KEY = "digidrVisitorCount";
  var SESSION_KEY = "digidrVisitorCounted";
  var STYLE_ID = "digidr-visitor-badge-style";

  function getVisitorCount() {
    var stored = parseInt(localStorage.getItem(STORAGE_KEY), 10);
    var count = isNaN(stored) ? 0 : stored;

    if (!sessionStorage.getItem(SESSION_KEY)) {
      count += 50;
      localStorage.setItem(STORAGE_KEY, String(count));
      sessionStorage.setItem(SESSION_KEY, "1");
    }

    return count;
  }

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = [
      ".footer-visitor-badge{display:inline-flex;align-items:center;flex-wrap:wrap;justify-content:center;gap:8px;margin-top:16px;padding:10px 18px;border-radius:999px;background:rgba(255,255,255,0.16);border:1px solid rgba(255,255,255,0.32);box-shadow:0 2px 10px rgba(0,0,0,0.28);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);font-size:16px;line-height:1.4;max-width:100%;transition:background .25s ease,border-color .25s ease,transform .25s ease;}",
      ".footer-visitor-badge:hover{background:rgba(255,255,255,0.24);border-color:rgba(255,255,255,0.44);transform:translateY(-1px);}",
      ".footer-visitor-badge .footer-visitor-badge-icon{font-size:16px;color:#ffffff;}",
      ".footer-visitor-badge .footer-visitor-badge-label{white-space:nowrap;color:#f1f5f9;font-weight:500;}",
      ".footer-visitor-badge .footer-visitor-badge-count{font-weight:700;color:#ffffff;font-variant-numeric:tabular-nums;}",
      "@media (max-width:480px){.footer-visitor-badge{font-size:16px;padding:9px 14px;gap:6px;margin-top:12px;}}"
    ].join("");
    document.head.appendChild(style);
  }

  function findSocialContainer(footer) {
    return (
      footer.querySelector(".peds2-footer-social") ||
      footer.querySelector(".alt-footer-social") ||
      footer.querySelector(".footer-social") ||
      footer.querySelector('[class*="footer-social"]')
    );
  }

  function renderVisitorCounter() {
    var footer = document.querySelector("footer");
    if (!footer || footer.querySelector(".footer-visitor-badge")) return;

    var social = findSocialContainer(footer);
    if (!social || !social.parentNode) return;

    injectStyles();

    var count = getVisitorCount();

    var badge = document.createElement("div");
    badge.className = "footer-visitor-badge";
    badge.setAttribute("role", "status");
    badge.setAttribute(
      "aria-label",
      "No. of Visitor: " + count.toLocaleString("en-US")
    );

    var icon = document.createElement("i");
    icon.className = "fa-solid fa-users footer-visitor-badge-icon";
    icon.setAttribute("aria-hidden", "true");

    var label = document.createElement("span");
    label.className = "footer-visitor-badge-label";
    label.textContent = "No. of Visitor:";

    var countEl = document.createElement("span");
    countEl.className = "footer-visitor-badge-count";
    countEl.textContent = count.toLocaleString("en-US");

    badge.appendChild(icon);
    badge.appendChild(label);
    badge.appendChild(countEl);

    social.insertAdjacentElement("afterend", badge);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderVisitorCounter);
  } else {
    renderVisitorCounter();
  }
})();
