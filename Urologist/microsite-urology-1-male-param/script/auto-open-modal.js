/**
 * ==========================================================================
 * DigiDr — Auto-Open Appointment Modal Module
 * ==========================================================================
 * Automatically opens the appointment modal (#bookingModal) after 1 minute (60s).
 * 
 * BACKEND INTEGRATION INSTRUCTIONS:
 * 1. Include this file via script tag in HTML:
 *    <script src="script/auto-open-modal.js"></script>
 * 2. Or copy this self-contained IIFE directly into your main JS bundle.
 * 3. Adjust AUTO_OPEN_DELAY_MS below to change the timer (default: 60000ms = 1 min).
 * ==========================================================================
 */

(function () {
    // Time delay in milliseconds (1 minute = 60000 ms)
    const AUTO_OPEN_DELAY_MS = 60000;
    const STORAGE_KEY = "digidr_auto_modal_opened";

    function autoOpenBookingModal() {
        // Prevent re-triggering if already shown in this session
        if (sessionStorage.getItem(STORAGE_KEY)) {
            return;
        }

        const modal = document.getElementById("bookingModal");
        if (!modal) return;

        // Do not interrupt if user has already opened the modal manually
        if (modal.classList.contains("is-open")) {
            sessionStorage.setItem(STORAGE_KEY, "true");
            return;
        }

        // Trigger modal open
        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";

        // Record that auto-open has triggered for this session
        sessionStorage.setItem(STORAGE_KEY, "true");
    }

    // Initialize timer once DOM is ready
    let autoTimer = null;

    function startTimer() {
        if (!sessionStorage.getItem(STORAGE_KEY)) {
            autoTimer = setTimeout(autoOpenBookingModal, AUTO_OPEN_DELAY_MS);
        }
    }

    if (document.readyState === "complete" || document.readyState === "interactive") {
        startTimer();
    } else {
        document.addEventListener("DOMContentLoaded", startTimer);
    }

    // Expose utility functions for backend / dynamic control if required
    window.DigiDrAutoModal = {
        open: autoOpenBookingModal,
        setDelay: function (ms) {
            if (autoTimer) clearTimeout(autoTimer);
            autoTimer = setTimeout(autoOpenBookingModal, ms);
        },
        resetSession: function () {
            sessionStorage.removeItem(STORAGE_KEY);
        }
    };
})();
