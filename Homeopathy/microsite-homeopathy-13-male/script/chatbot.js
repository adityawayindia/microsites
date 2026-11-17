(function () {
    /* ── Config ── */
    var BOT_NAME = 'Dr. Kamat Assistant';
    var BOT_ICON = 'https://storage.googleapis.com/digidr/chatbot-icon.svg';

    var WELCOME_MSG = "Hello. I can help with clinic services, appointment options and practical visit information. For personal medical advice, please consult the doctor.";

    /* ── Inject CSS ── */
    (function injectCSS() {
        if (document.getElementById('chatbot-css')) return;
        var link = document.createElement('link');
        link.id   = 'chatbot-css';
        link.rel  = 'stylesheet';
        link.href = './styles/chatbot.css';
        document.head.appendChild(link);
    })();

    /* ── Build HTML ── */
    function svgSend() {
        return '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22 2L11 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>';
    }

    function escHtml(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function getTime() {
        var d = new Date();
        var h = d.getHours(), m = d.getMinutes();
        var ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12 || 12;
        return h + ':' + (m < 10 ? '0' : '') + m + ' ' + ampm;
    }

    var widgetHTML =
        '<div class="chatbot-fab-wrap" id="chatbotFabWrap">' +

            '<div class="chatbot-backdrop" id="chatbotBackdrop" aria-hidden="true"></div>' +

            /* Chat window */
            '<div class="chatbot-window" id="chatbotWindow" hidden data-clarity-mask="true" role="dialog" aria-modal="true" aria-label="' + BOT_NAME + ' chat window">' +

                /* Header */
                '<div class="chatbot-header">' +
                    '<div class="chatbot-header-avatar">' +
                        '<img src="' + BOT_ICON + '" alt="' + BOT_NAME + '">' +
                    '</div>' +
                    '<div class="chatbot-header-info">' +
                        '<p class="chatbot-header-name">' + BOT_NAME + '</p>' +
                    '</div>' +
                    '<button type="button" class="chatbot-header-close" id="chatbotCloseBtn" aria-label="Close chat">' +
                        /* This microsite loads Font Awesome, not Material Symbols */
                        '<i class="fa-solid fa-xmark" aria-hidden="true"></i>' +
                    '</button>' +
                '</div>' +

                /* Quick replies: local informational responses, not messages to the clinic. */
                '<div class="chatbot-suggestions-wrap" id="chatbotSuggestionsWrap">' +
                  '<div class="chatbot-suggestions" id="chatbotSuggestions">' +
                    '<button type="button" class="chatbot-suggestion-chip">Appointments</button>' +
                    '<button type="button" class="chatbot-suggestion-chip">What to bring</button>' +
                    '<button type="button" class="chatbot-suggestion-chip">Online visits</button>' +
                    '<button type="button" class="chatbot-suggestion-chip">Homeopathy</button>' +
                  '</div>' +
                '</div>' +
                /* Messages */
                '<div class="chatbot-messages" id="chatbotMessages" role="log" aria-live="polite" aria-label="Chat messages"></div>' +

                /* Input */
                '<div class="chatbot-input-area">' +
                    '<div class="chatbot-input-wrap">' +
                        '<textarea class="chatbot-input" id="chatbotInput" placeholder="Type your message…" rows="1" maxlength="1000" aria-label="Type your message"></textarea>' +
                    '</div>' +
                    '<button class="chatbot-send-btn" id="chatbotSendBtn" aria-label="Send message" disabled>' + svgSend() + '</button>' +
                '</div>' +

                /* Footer */
                '<div class="chatbot-footer">Informational only, not medical advice.<br>Consult your doctor.</div>' +

            '</div>' +

            /* FAB */
            '<button class="chatbot-fab" id="chatbotFab" aria-label="Open Assistant" aria-expanded="false" aria-controls="chatbotWindow">' +
                '<img class="chatbot-fab-logo" src="' + BOT_ICON + '" alt="" aria-hidden="true">' +
                '<span class="chatbot-fab-text">Clinic Assistant</span>' +
                '<span class="chatbot-badge" id="chatbotBadge" aria-label="1 new message">1</span>' +
            '</button>' +

        '</div>';

    /* ── Mount ── */
    var mount = document.getElementById('chatbot-mount');
    if (mount) {
        mount.outerHTML = widgetHTML;
    } else {
        var div = document.createElement('div');
        div.innerHTML = widgetHTML;
        document.body.appendChild(div.firstElementChild);
    }

    /* ── DOM References ── */
    var wrap        = document.getElementById('chatbotFabWrap');
    var fab         = document.getElementById('chatbotFab');
    var closeBtn    = document.getElementById('chatbotCloseBtn');
    var backdrop    = document.getElementById('chatbotBackdrop');
    var window_     = document.getElementById('chatbotWindow');
    var messagesEl  = document.getElementById('chatbotMessages');
    var inputEl     = document.getElementById('chatbotInput');
    var sendBtn     = document.getElementById('chatbotSendBtn');
    var suggWrap    = document.getElementById('chatbotSuggestionsWrap');
    var suggestions = document.getElementById('chatbotSuggestions');
    var suggPrev    = document.getElementById('chatbotSuggPrev');
    var suggNext    = document.getElementById('chatbotSuggNext');
    var badge       = document.getElementById('chatbotBadge');

    var isOpen = false;
    var hasOpened = false;
    var closeTimer = null;
    var replyTimer = null;
    var busy = false;

    /* ── Helpers ── */
    function addMessage(text, sender) {
        /* sender: 'bot' | 'user' */
        var msgEl = document.createElement('div');
        msgEl.className = 'chatbot-msg ' + sender;

        if (sender === 'bot') {
            msgEl.innerHTML =
                '<div class="chatbot-msg-avatar"><img src="' + BOT_ICON + '" alt="bot"></div>' +
                '<div>' +
                    '<div class="chatbot-msg-bubble">' + escHtml(text) + '</div>' +
                    '<div class="chatbot-msg-time">' + getTime() + '</div>' +
                '</div>';
        } else {
            msgEl.innerHTML =
                '<div>' +
                    '<div class="chatbot-msg-bubble">' + escHtml(text) + '</div>' +
                    '<div class="chatbot-msg-time">' + getTime() + '</div>' +
                '</div>';
        }

        messagesEl.appendChild(msgEl);
        scrollToBottom();
    }

    function showTyping() {
        var el = document.createElement('div');
        el.className = 'chatbot-typing';
        el.id = 'chatbotTyping';
        el.innerHTML =
            '<div class="chatbot-msg-avatar"><img src="' + BOT_ICON + '" alt="bot"></div>' +
            '<div class="chatbot-typing-dots"><span></span><span></span><span></span></div>';
        messagesEl.appendChild(el);
        scrollToBottom();
    }

    function hideTyping() {
        var el = document.getElementById('chatbotTyping');
        if (el) el.remove();
    }

    function scrollToBottom() {
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function addDivider(label) {
        var el = document.createElement('div');
        el.className = 'chatbot-divider';
        el.textContent = label;
        messagesEl.appendChild(el);
    }

    function openChat() {
        clearTimeout(closeTimer);
        isOpen = true;
        wrap.classList.add('is-open');
        fab.setAttribute('aria-expanded', 'true');
        if (backdrop) backdrop.setAttribute('aria-hidden', 'false');
        window_.hidden = false;
        window_.classList.remove('is-closing');

        /* Chip widths are 0 while the window is display:none */
        if (typeof updateSuggArrows === 'function') updateSuggArrows();

        if (!hasOpened) {
            hasOpened = true;
            addDivider('Today');
            addMessage(WELCOME_MSG, 'bot');
        }

        /* Hide badge */
        if (badge) badge.style.display = 'none';

        window.DigiDrDialog.open(window_, {initial:closeBtn, returnTo:fab, onEscape:closeChat});
    }

    function closeChat() {
        if (!isOpen) return;
        isOpen = false;
        window.DigiDrDialog.close(window_);
        wrap.classList.remove('is-open');
        fab.setAttribute('aria-expanded', 'false');
        fab.setAttribute('aria-label', 'Open Assistant');
        if (backdrop) backdrop.setAttribute('aria-hidden', 'true');
        window_.classList.add('is-closing');

        closeTimer = setTimeout(function () {
            if (isOpen) return;
            window_.hidden = true;
            window_.classList.remove('is-closing');
            if (fab && fab.focus) fab.focus();
        }, 220);
    }

    function responseFor(text) {
        const t=text.toLowerCase();
        if (/emergen|chest pain|breath|suicid|self.harm/.test(t)) return "This assistant cannot assess emergencies. Seek immediate help from local emergency services. For other personal medical questions, consult your doctor.";
        if (/appoint|book/.test(t)) return "Use Book Appointment on the home page to select a clinic or online visit. A booking is confirmed only after the booking service accepts it. This chat does not book appointments or send messages to the clinic.";
        if (/bring|report|medicine|prescription/.test(t)) return "For your homeopathy consultation, have your current medicine list and relevant reports ready. The FAQ on the home page explains preparation. Consult your doctor for advice about medicines.";
        if (/online|video/.test(t)) return "The booking form has an Online Consultation option when the clinic enables it. The doctor may recommend an in-person visit. This assistant cannot assess whether an online consultation is suitable for you.";
        if (/homeopath|service|treat|cure/.test(t)) return "The Services section describes Dr. Kamat's homeopathy consultations and follow-up options. This assistant does not recommend remedies, diagnose conditions or promise results. Please consult your doctor.";
        return "This is an automated guide to clinic information, not a doctor or a monitored inbox. Your message is not sent to the clinic. Use Book Appointment on the home page for a consultation, and consult your doctor for personal medical advice.";
    }
    function sendMessage(text) {
        text = text.trim().slice(0,1000);
        if (!text || busy) return;
        busy=true;
        addMessage(text,'user');inputEl.value='';inputEl.style.height='auto';sendBtn.disabled=true;
        eventTrack('chatbot_send_click');
        showTyping();
        clearTimeout(replyTimer);
        replyTimer=setTimeout(function(){hideTyping();addMessage(responseFor(text),'bot');busy=false;sendBtn.disabled=!inputEl.value.trim();},300);
    }
    function eventTrack(name){window.trackEvent?.(name);}

    /* ── Auto-resize textarea ── */
    inputEl.addEventListener('input', function () {
        sendBtn.disabled = busy || !inputEl.value.trim();
        inputEl.style.height = 'auto';
        inputEl.style.height = Math.min(inputEl.scrollHeight, 100) + 'px';
    });

    /* ── Send on Enter (Shift+Enter for newline) ── */
    inputEl.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!sendBtn.disabled) sendMessage(inputEl.value);
        }
    });

    /* ── Button events ── */
    fab.addEventListener('click', function () {
        if (!isOpen) {openChat();eventTrack('chatbot_open_click');}
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', closeChat);
    }

    if (backdrop) {
        backdrop.addEventListener('click', closeChat);
    }

    sendBtn.addEventListener('click', function () {
        sendMessage(inputEl.value);

    });

    /* ── Suggestion chips ── */
    if (suggestions) {
        suggestions.addEventListener('click', function (e) {
            var chip = e.target.closest('.chatbot-suggestion-chip');
            if (!chip) return;
            sendMessage(chip.textContent);
        });
    }

    /* ── Suggestion chips: left/right arrow scroll + swipe ── */
    function updateSuggArrows() {
        if (!suggPrev || !suggNext) return;
        var maxScroll = suggestions.scrollWidth - suggestions.clientWidth;
        var atStart = suggestions.scrollLeft <= 6;
        var atEnd = suggestions.scrollLeft >= maxScroll - 6;

        suggPrev.disabled = atStart;
        suggNext.disabled = atEnd || maxScroll <= 6;

        /* Hide the whole arrow row when there's nothing to scroll (e.g. wide window) */
        if (suggWrap) suggWrap.classList.toggle('chatbot-suggestions-wrap--no-scroll', maxScroll <= 1);
    }

    function scrollSuggestions(direction) {
        var chip = suggestions.querySelector('.chatbot-suggestion-chip');
        var step = chip ? chip.getBoundingClientRect().width + 8 : 160;
        suggestions.scrollBy({ left: direction * step * 2, behavior: 'smooth' });
    }

    if (suggPrev && suggNext) {
        suggPrev.addEventListener('click', function () { scrollSuggestions(-1); });
        suggNext.addEventListener('click', function () { scrollSuggestions(1); });
        suggestions.addEventListener('scroll', updateSuggArrows, { passive: true });
        window.addEventListener('resize', updateSuggArrows);
        updateSuggArrows();
    }

    /* ── Close on Escape ── */
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && isOpen) closeChat();
    });

    /* ── Close on outside click ── */
    document.addEventListener('click', function (e) {
        if (isOpen && !wrap.contains(e.target)) {
            closeChat();
        }
    });

    /* ── Collapse/Expand FAB on scroll ── */
    function initScrollCollapse() {
        if (!fab) return;
        var lastScrollY = window.pageYOffset || document.documentElement.scrollTop;
        var ticking = false;
        var threshold = 10;

        function onScroll() {
            var currentScrollY = window.pageYOffset || document.documentElement.scrollTop;

            if (currentScrollY <= 50) {
                fab.classList.remove('is-collapsed');
                lastScrollY = currentScrollY;
                ticking = false;
                return;
            }

            var diff = currentScrollY - lastScrollY;
            if (Math.abs(diff) >= threshold) {
                if (diff > 0) {
                    fab.classList.add('is-collapsed');
                } else {
                    fab.classList.remove('is-collapsed');
                }
                lastScrollY = currentScrollY;
            }

            ticking = false;
        }

        window.addEventListener('scroll', function () {
            if (!ticking) {
                window.requestAnimationFrame(onScroll);
                ticking = true;
            }
        }, { passive: true });
    }

    if (window.visualViewport) {
        const updateViewport=()=>{
            const viewport=window.visualViewport;
            const keyboard=isOpen && window.innerWidth<=768 && window.innerHeight-viewport.height>120;
            wrap.classList.toggle('is-kb-open',keyboard);
            wrap.style.setProperty('--chatbot-vvh',viewport.height+'px');
            wrap.style.setProperty('--chatbot-kb-offset',Math.max(0,window.innerHeight-viewport.height-viewport.offsetTop)+'px');
        };
        window.visualViewport.addEventListener('resize',updateViewport);
        window.visualViewport.addEventListener('scroll',updateViewport);
    }
    initScrollCollapse();

})();
