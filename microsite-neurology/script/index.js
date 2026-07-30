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
    img.addEventListener("click", () => {
      openLightbox(img.src, img.alt);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", closeLightbox);
  }

  if (backdrop) {
    backdrop.addEventListener("click", closeLightbox);
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
      closeLightbox();
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
      return "";
    },
    email(value) {
      if (!value) return "Please enter your email address.";
      if (!validateEmail(value)) return "Please enter a valid email address.";
      return "";
    },
    phone(value) {
      if (!value) return "Please enter your phone number.";
      if (!validatePhone(value)) return "Please enter a valid phone number.";
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

  function validatePhone(value) {
    const sanitizedValue = value.replace(/[()\s-]/g, "");
    const phoneRegex = /^\+?[0-9]{7,15}$/;
    return phoneRegex.test(sanitizedValue);
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

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearErrors();

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

