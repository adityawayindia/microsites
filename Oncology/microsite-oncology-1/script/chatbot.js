(function () {
    /* ── Config ── */
    var BOT_NAME = 'Assistant';
    var BOT_ICON = './assets/chatbot-icon.svg';

    var WELCOME_MSG = "Hi there! 👋 I'm your Assistant. How can I help you today?";

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
        return '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M22 2L11 13" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>';
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
            '<div class="chatbot-window" id="chatbotWindow" style="display:none;" role="dialog" aria-modal="true" aria-label="' + BOT_NAME + ' chat window">' +

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

                /* Messages */
                '<div class="chatbot-messages" id="chatbotMessages" role="log" aria-live="polite" aria-label="Chat messages"></div>' +

                /* Input */
                '<div class="chatbot-input-area">' +
                    '<div class="chatbot-input-wrap">' +
                        '<textarea class="chatbot-input" id="chatbotInput" placeholder="Type your message…" rows="1" aria-label="Type your message"></textarea>' +
                    '</div>' +
                    '<button class="chatbot-send-btn" id="chatbotSendBtn" aria-label="Send message" disabled>' + svgSend() + '</button>' +
                '</div>' +

                /* Footer */
                '<div class="chatbot-footer">Informational only, not medical advice.<br>Consult your doctor</div>' +

            '</div>' +

            /* FAB */
            '<button class="chatbot-fab" id="chatbotFab" aria-label="Open Assistant" aria-expanded="false" aria-controls="chatbotWindow">' +
                '<img class="chatbot-fab-logo" src="' + BOT_ICON + '" alt="" aria-hidden="true">' +
                '<span class="chatbot-fab-text">Ask Doctor</span>' +
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
        isOpen = true;
        wrap.classList.add('is-open');
        fab.setAttribute('aria-expanded', 'true');
        if (backdrop) backdrop.setAttribute('aria-hidden', 'false');
        window_.style.display = 'flex';
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

        /* Focus input after animation */
        setTimeout(function () { inputEl.focus(); }, 330);
    }

    function closeChat() {
        isOpen = false;
        wrap.classList.remove('is-open');
        fab.setAttribute('aria-expanded', 'false');
        fab.setAttribute('aria-label', 'Open Assistant');
        if (backdrop) backdrop.setAttribute('aria-hidden', 'true');
        window_.classList.add('is-closing');

        setTimeout(function () {
            window_.style.display = 'none';
            window_.classList.remove('is-closing');
            if (fab && fab.focus) fab.focus();
        }, 220);
    }

    function sendMessage(text) {
        text = text.trim();
        if (!text) return;

        /* Hide suggestions after first interaction */
        if (suggWrap) suggWrap.style.display = 'none';

        addMessage(text, 'user');
        inputEl.value = '';
        inputEl.style.height = 'auto';
        sendBtn.disabled = true;

        /* Simulate typing → placeholder for AI integration */
        showTyping();
        setTimeout(function () {
            hideTyping();
            addMessage(
                "Thanks for your message! Our team will get back to you shortly. For immediate assistance, please call or visit our support page.",
                'bot'
            );
        }, 1200);
    }

    /* ── Auto-resize textarea ── */
    inputEl.addEventListener('input', function () {
        sendBtn.disabled = !inputEl.value.trim();
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
        if (!isOpen) openChat();
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

    initScrollCollapse();

})();
