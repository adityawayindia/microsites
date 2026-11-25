(() => {
  const storageKey = "digidr:google-nmt:testing-norma:language";
  const languages = {
    en: { label: "Website language", notice: "Translation notice", error: "Could not load this language. Please try again." },
    hi: { label: "वेबसाइट की भाषा", notice: "अनुवाद के बारे में", error: "भाषा लोड नहीं हो सकी। कृपया फिर कोशिश करें।" },
    bn: { label: "ওয়েবসাইটের ভাষা", notice: "অনুবাদ সম্পর্কে", error: "ভাষাটি লোড করা যায়নি। আবার চেষ্টা করুন।" },
    or: { label: "ୱେବସାଇଟର ଭାଷା", notice: "ଅନୁବାଦ ବିଷୟରେ", error: "ଭାଷା ଲୋଡ୍ ହୋଇପାରିଲା ନାହିଁ। ପୁଣି ଚେଷ୍ଟା କରନ୍ତୁ।" }
  };
  const attributes = ["alt", "title", "placeholder", "aria-label", "data-tooltip", "content"];
  const selector = ["[data-l10n]", "[data-message-group]", ...attributes.map(a => "[data-l10n-" + a + "]")].join(",");
  const originals = new WeakMap();
  let active = "en";
  let request = 0;
  let english, catalog;
  let syncPicker;
  let credit;

  // Classic script catalogs also work when this static site is opened from a local folder.
  const catalogs = Object.create(null);
  const loading = new Map();
  function load(lang) {
    if (catalogs[lang]) return Promise.resolve(catalogs[lang]);
    if (loading.has(lang)) return loading.get(lang);
    const promise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "./locales/" + lang + ".js";
      script.onload = () => catalogs[lang] ? resolve(catalogs[lang]) : reject(new Error("Invalid language catalog"));
      script.onerror = () => reject(new Error("Language file unavailable"));
      document.head.appendChild(script);
    }).finally(() => loading.delete(lang));
    loading.set(lang, promise);
    return promise;
  }

  function lookup(dictionary, key) {
    const [group, field] = key.split(".");
    return dictionary?.[group]?.[field];
  }

  function fill(text, element) {
    return text.replace(/\{\{(\w+)\}\}/g, (token, key) => element?.dataset[key] ?? catalog?.display_facts?.[key] ?? token);
  }

  function message(group, source) {
    if (active === "en") return source;
    const field = Object.keys(english[group] || {}).find(key => english[group][key] === source);
    return catalog[group]?.[field] ?? source;
  }

  function setMessage(element, group, source) {
    element.dataset.messageGroup = group;
    element.dataset.messageSource = source;
    element.textContent = message(group, source);
  }

  function renderElement(element) {
    if (element.hasAttribute("data-message-group")) {
      const text = message(element.dataset.messageGroup, element.dataset.messageSource);
      if (element.textContent !== text) element.textContent = text;
    }
    for (const name of attributes) {
      const key = element.getAttribute("data-l10n-" + name);
      if (!key) continue;
      const value = lookup(catalog, key) ?? lookup(english, key);
      if (value !== undefined) element.setAttribute(name, fill(value, element));
    }
    const key = element.dataset.l10n;
    if (!key || element.hasAttribute("data-message-group")) return;
    if (active === "en") {
      const original = originals.get(element);
      if (original) {
        element.replaceChildren(...original);
        originals.delete(element);
      }
      return;
    }
    const text = lookup(catalog, key);
    if (text === undefined) return;
    if (!originals.has(element)) originals.set(element, Array.from(element.childNodes));
    const original = originals.get(element);
    // Keep links to the clinic's email and phone interactive wherever their tokens move.
    const links = original.filter(node => node.nodeName === "A");
    const parts = text.split(/(\{\{\w+\}\})/g).map(part => {
      const value = fill(part, element);
      return links.find(link => part.startsWith("{{") && link.textContent === value)?.cloneNode(true) ?? value;
    });
    element.replaceChildren(...parts);
  }

  function render(root) {
    if (root.matches?.(selector)) renderElement(root);
    for (const element of root.querySelectorAll(selector)) renderElement(element);
  }

  async function selectLanguage(lang) {
    if (!Object.prototype.hasOwnProperty.call(languages, lang)) lang = "en";
    const version = ++request;
    const picker = document.getElementById("siteLanguage");
    const status = document.getElementById("languageStatus");
    status.textContent = "";
    try {
      if (lang !== "en") {
        const [base, translated] = await Promise.all([load("en"), load(lang)]);
        if (version !== request) return;
        english = base;
        catalog = translated;
      } else {
        catalog = english;
      }
      active = lang;
      document.documentElement.lang = lang;
      credit.hidden = lang === "en";
      credit.lastElementChild.textContent = languages[lang].notice;
      picker.value = lang;
      picker.setAttribute("aria-label", languages[lang].label);
      render(document);
      try { localStorage.setItem(storageKey, lang); } catch {}
      const url = new URL(location.href);
      if (location.protocol !== "file:" && url.searchParams.has("lang") && url.searchParams.get("lang") !== lang) {
        url.searchParams.set("lang", lang);
        history.replaceState(history.state, "", url);
      }
      for (const link of document.querySelectorAll('a[href^="index.html"], a[href^="privacy-policy.html"], a[href^="terms-of-service.html"]')) {
        const target = new URL(link.href);
        if (lang === "en") target.searchParams.delete("lang");
        else target.searchParams.set("lang", lang);
        link.setAttribute("href", target.pathname.split("/").pop() + target.search + target.hash);
      }
      document.dispatchEvent(new Event("site-language-change"));
      window.DigiDrReadMore?.init();
    } catch {
      if (version !== request) return;
      picker.value = active;
      status.textContent = languages[active].error;
    } finally {
      if (version === request) syncPicker();
    }
  }

  function installPicker(select) {
    const root = select.parentElement;
    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "language-trigger";
    trigger.setAttribute("aria-haspopup", "listbox");
    trigger.setAttribute("aria-expanded", "false");
    const menu = document.createElement("div");
    menu.id = select.id + "-options";
    menu.className = "language-menu";
    menu.setAttribute("role", "listbox");
    menu.hidden = true;
    trigger.setAttribute("aria-controls", menu.id);

    const rows = Array.from(select.options, option => {
      const row = document.createElement("button");
      row.type = "button";
      row.tabIndex = -1;
      row.className = "language-option";
      row.setAttribute("role", "option");
      row.lang = option.lang;
      row.textContent = option.text;
      row.addEventListener("click", () => {
        close(true);
        select.value = option.value;
        select.dispatchEvent(new Event("change", { bubbles: true }));
      });
      menu.append(row);
      return row;
    });

    function sync() {
      const option = select.selectedOptions[0];
      trigger.textContent = option.text;
      trigger.lang = option.lang;
      trigger.setAttribute("aria-label", languages[active].label + " · " + option.text);
      menu.setAttribute("aria-label", languages[active].label);
      rows.forEach((row, i) => row.setAttribute("aria-selected", String(i === select.selectedIndex)));
    }

    function positionMenu() {
      if (menu.hidden) return;
      menu.classList.remove("align-start");
      if (menu.getBoundingClientRect().left < 8) menu.classList.add("align-start");
    }

    function open() {
      menu.hidden = false;
      positionMenu();
      root.classList.add("is-open");
      trigger.setAttribute("aria-expanded", "true");
      rows[select.selectedIndex].focus({ preventScroll: true });
    }

    function close(restoreFocus = false) {
      if (menu.hidden) return;
      root.classList.remove("is-open");
      trigger.setAttribute("aria-expanded", "false");
      if (restoreFocus) trigger.focus({ preventScroll: true });
      menu.hidden = true;
    }

    trigger.addEventListener("click", () => menu.hidden ? open() : close());
    trigger.addEventListener("keydown", event => {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        open();
      }
    });
    menu.addEventListener("keydown", event => {
      const index = rows.indexOf(document.activeElement);
      let next;
      switch (event.key) {
        case "ArrowDown": next = (index + 1) % rows.length; break;
        case "ArrowUp": next = (index + rows.length - 1) % rows.length; break;
        case "Home": next = 0; break;
        case "End": next = rows.length - 1; break;
        case "Escape": event.preventDefault(); event.stopPropagation(); close(true); return;
        case "Tab": close(true); return;
        default:
          if (event.key.length !== 1 || event.key === " " || event.altKey || event.ctrlKey || event.metaKey) return;
          next = rows.findIndex(row => row.textContent.toLowerCase().startsWith(event.key.toLowerCase()));
          if (next < 0) return;
      }
      event.preventDefault();
      rows[next].focus();
    });
    document.addEventListener("pointerdown", event => {
      if (!root.contains(event.target)) close();
    });
    root.addEventListener("focusout", event => {
      if (!root.contains(event.relatedTarget)) close();
    });
    window.addEventListener("resize", positionMenu);
    root.append(trigger, menu);
    select.hidden = true;
    sync();
    return sync;
  }

  window.micrositeLanguage = { message, setMessage, catalogs };
  document.addEventListener("DOMContentLoaded", () => {
    const picker = document.getElementById("siteLanguage");
    credit = document.createElement("div");
    credit.className = "translation-credit";
    credit.hidden = true;
    credit.innerHTML = '<a href="https://translate.google.com/" lang="en"><img src="assets/google-translate-attribution.svg" alt="Powered by Google Translate" width="176" height="16"></a> <a href="https://docs.cloud.google.com/translate/attribution#disclaimer"></a>';
    document.querySelector(".hero-content .social-links, .legal-language-row").after(credit);
    const available = new Set(Object.keys(languages));
    syncPicker = installPicker(picker);
    picker.addEventListener("change", () => selectLanguage(picker.value));
    // Booking and chat insert new, explicitly marked labels after the page loads.
    new MutationObserver(records => {
      if (active === "en") return;
      for (const record of records) {
        for (const node of record.addedNodes) if (node.nodeType === 1 && node.isConnected) render(node);
      }
    }).observe(document.body, { subtree: true, childList: true });
    function restorePreference() {
      let remembered = "en";
      try { remembered = localStorage.getItem(storageKey) || "en"; } catch {}
      const requested = new URLSearchParams(location.search).get("lang");
      selectLanguage(available.has(requested) ? requested : available.has(remembered) ? remembered : "en");
    }
    restorePreference();
    window.addEventListener("pageshow", event => {
      if (event.persisted) restorePreference();
    });
  });
})();
