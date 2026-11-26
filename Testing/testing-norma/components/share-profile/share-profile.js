// Load with share-profile.css, then place <digidr-share-profile> on a profile page.
// Add with-whatsapp to show the WhatsApp sharing link alongside the native share button.
if (!customElements.get("digidr-share-profile")) {
  customElements.define("digidr-share-profile", class extends HTMLElement {
    connectedCallback() {
      const canonical = this.ownerDocument.querySelector('link[rel~="canonical"]');
      const profileUrl = canonical && canonical.href;
      if (this.childElementCount || !/^https?:\/\//i.test(profileUrl)) return;

      const whatsappAction = this.hasAttribute("with-whatsapp") ? `
        <a class="share-action whatsapp-share" href="https://wa.me/?text=${encodeURIComponent(profileUrl)}"
           target="_blank" rel="noopener noreferrer" title="Share profile" data-l10n-title="share.share_profile"
           data-ga-event="whatsapp_share_click" data-ga-label="WhatsApp">
          <i class="fa-brands fa-whatsapp" aria-hidden="true"></i><span class="action-name">WhatsApp</span>
        </a>` : "";
      this.innerHTML = `
        <button type="button" class="share-action" data-ga-event="share_profile_click" data-ga-label="Share profile">
          <i class="fa-solid fa-share-nodes" aria-hidden="true"></i>
          <span class="share-label" aria-live="polite" aria-atomic="true">
            <span class="share-default" data-l10n="share.share_profile">Share profile</span>
            <span class="share-copied" data-l10n="share.link_copied">Link copied</span>
            <span class="share-default compact-label" data-l10n="share.short_share">Share</span>
            <span class="share-copied compact-label" data-l10n="share.short_copied">Copied</span>
          </span>
        </button>
        ${whatsappAction}
        <label hidden><span data-l10n="share.copy_this_link_manually">Copy this link manually</span>
          <input type="text" readonly>
        </label>`;

      const button = this.querySelector("button");
      if (this.hasAttribute("side-rail")) {
        const number = (this.getAttribute("call-number") || "").trim();
        const canCall = /^\+?[\d]{6,15}$/.test(number);
        const call = document.createElement(canCall ? "a" : "button");
        call.className = "share-action call-action";
        call.innerHTML = '<i class="fa-solid fa-phone" aria-hidden="true"></i><span class="action-name"></span>';
        const name = call.querySelector(".action-name");
        if (canCall) {
          call.href = "tel:" + number;
          call.dataset.gaEvent = "phone_click";
          name.dataset.l10n = "share.call";
          name.textContent = "Call";
        } else {
          call.type = "button";
          call.setAttribute("aria-disabled", "true");
          name.dataset.l10n = "contact_us.phone_number_na";
          name.textContent = "Phone number: NA";
        }
        button.after(call);
      }
      const manualCopy = this.querySelector("label");
      const input = manualCopy.querySelector("input");
      const heading = this.ownerDocument.querySelector("h1");
      let resetTimer;
      let shareMenuOpen = false;

      input.addEventListener("blur", () => { manualCopy.hidden = true; });
      input.addEventListener("keydown", event => {
        if (event.key === "Escape") button.focus();
      });

      button.addEventListener("click", async () => {
        if (shareMenuOpen) return;
        clearTimeout(resetTimer);
        button.classList.remove("is-copied");
        manualCopy.hidden = true;

        if (typeof navigator.share === "function") {
          shareMenuOpen = true;
          try {
            const title = (heading && heading.textContent.trim()) || this.ownerDocument.title;
            await navigator.share({ title, url: profileUrl });
            return;
          } catch (error) {
            if (error.name === "AbortError") return;
          } finally {
            shareMenuOpen = false;
          }
        }

        try {
          await navigator.clipboard.writeText(profileUrl);
        } catch (clipboardError) {
          input.value = profileUrl;
          manualCopy.hidden = false;
          input.focus();
          input.select();
          return;
        }

        button.classList.add("is-copied");
        resetTimer = setTimeout(() => { button.classList.remove("is-copied"); }, 2000);
      });
    }
  });
}
