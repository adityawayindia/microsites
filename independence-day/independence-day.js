/**
 * Independence Day Module — DigiDr Microsites
 * ============================================
 * Auto-activates: 10 Aug – 15 Aug (IST).
 * Drop-in: include CSS + this JS in any microsite.
 *
 * Features:
 *   - Executive High-Contrast Top Banner (injected inside .site-header)
 *   - Pole-Free Floating Flags (anchored safely, hides on scroll DOWN, shows on scroll UP, hides on booking modal)
 *   - Ashoka Chakra Badge (bottom-right, hides on booking modal)
 *   - Canvas Confetti & Firework Bursts
 *
 * URL params for testing:
 *   ?id_preview=1  → force-activate (ignores date)
 *   ?id_day15=1    → simulate 15 Aug (fireworks on load)
 */
(function () {
  'use strict';

  const CONFIG = {
    activateFrom:     { month: 8, day: 10 },
    activateTo:       { month: 8, day: 15 },
    confettiCount:    80,
    confettiDuration: 9000,
    headerSelector:   '.site-header',
  };

  /* ── URL overrides ── */
  const _p        = new URLSearchParams(window.location.search);
  const _force    = _p.get('id_preview') === '1';
  const _day15    = _p.get('id_day15')   === '1';

  /* ── Date check (IST) ── */
  function isActive() {
    if (_force || _day15) return true;
    const now = new Date();
    const ist = new Date(now.getTime() + (5.5 * 60 + now.getTimezoneOffset()) * 60000);
    const m = ist.getMonth() + 1, d = ist.getDate();
    return m === 8 && d >= CONFIG.activateFrom.day && d <= CONFIG.activateTo.day;
  }

  function isDay15() {
    if (_day15) return true;
    const now = new Date();
    const ist = new Date(now.getTime() + (5.5 * 60 + now.getTimezoneOffset()) * 60000);
    return ist.getMonth() + 1 === 8 && ist.getDate() === 15;
  }

  /* ── Booking Modal Detection ── */
  function isModalOpen() {
    if (document.body.style.overflow === 'hidden' || document.body.classList.contains('modal-open') || document.body.classList.contains('is-modal-open')) {
      return true;
    }
    const modals = document.querySelectorAll('#bookingModal, .modal, .booking-modal, [role="dialog"]');
    for (let i = 0; i < modals.length; i++) {
      const m = modals[i];
      if (
        m.classList.contains('is-open') ||
        m.classList.contains('active') ||
        m.classList.contains('open') ||
        m.classList.contains('show') ||
        m.getAttribute('aria-hidden') === 'false'
      ) {
        return true;
      }
    }
    return false;
  }

  /* ── Vector Ashoka Chakra SVG ── */
  function chakraSVG(size, color) {
    const c = color || '#ffffff';
    const r = size / 2, sw = Math.max(0.8, size * 0.04);
    const or = r * 0.88, ir = r * 0.14, sr = r * 0.80;
    const spokes = Array.from({ length: 24 }, (_, i) => {
      const a = (i / 24) * 2 * Math.PI;
      return `<line x1="${r}" y1="${r}" x2="${(r + sr * Math.sin(a)).toFixed(2)}" y2="${(r - sr * Math.cos(a)).toFixed(2)}" stroke="#06038D" stroke-width="${sw}" stroke-linecap="round"/>`;
    }).join('');
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <circle cx="${r}" cy="${r}" r="${(r*0.92).toFixed(2)}" fill="#ffffff" />
      <circle cx="${r}" cy="${r}" r="${or.toFixed(2)}" fill="none" stroke="#06038D" stroke-width="${sw}"/>
      ${spokes}
      <circle cx="${r}" cy="${r}" r="${ir.toFixed(2)}" fill="#06038D"/>
    </svg>`;
  }





  /* ══════════════════════════════════════════
     3. BOOKING MODAL CONTROL
     - Booking modal OPEN -> Hide Ashoka Chakra button
     ══════════════════════════════════════════ */
  function updateVisibility() {
    const badge = document.getElementById('id-chakra-badge');
    const modalActive = isModalOpen();

    if (modalActive) {
      if (badge) badge.classList.add('id-modal-hidden');
    } else {
      if (badge) badge.classList.remove('id-modal-hidden');
    }
  }

  function setupScrollAndModalListeners() {
    // MutationObserver to instantly detect modal open/close
    const observer = new MutationObserver(updateVisibility);
    observer.observe(document.body, { attributes: true, attributeFilter: ['style', 'class'], subtree: false });

    const modals = document.querySelectorAll('#bookingModal, .modal, .booking-modal, [role="dialog"]');
    modals.forEach(m => {
      observer.observe(m, { attributes: true, attributeFilter: ['class', 'style', 'aria-hidden'] });
    });
  }

  /* ══════════════════════════════════════════
     4. CONFETTI
     ══════════════════════════════════════════ */
  function launchConfetti(duration) {
    const canvas = document.createElement('canvas');
    canvas.id = 'id-confetti-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.appendChild(canvas);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const ctx = canvas.getContext('2d');
    const COLORS = ['#FF671F', '#046A38', '#ffffff', '#06038D', '#FFD700'];

    const particles = Array.from({ length: CONFIG.confettiCount }, () => ({
      x: Math.random() * canvas.width,
      y: -10 - Math.random() * canvas.height * 0.4,
      w: 5 + Math.random() * 7,
      h: 3 + Math.random() * 4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      vy: 1.0 + Math.random() * 1.8,
      vx: (Math.random() - 0.5) * 1.2,
      rot: Math.random() * Math.PI * 2,
      rotV: (Math.random() - 0.5) * 0.08,
      alpha: 0.6 + Math.random() * 0.4,
    }));

    const start = performance.now();
    let raf;

    (function draw(now) {
      const t = now - start;
      const fade = t > duration * 0.7 ? 1 - (t - duration * 0.7) / (duration * 0.3) : 1;
      if (fade <= 0) { canvas.remove(); return; }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.y += p.vy; p.x += p.vx; p.rot += p.rotV;
        if (p.y > canvas.height + 10) { p.y = -10; p.x = Math.random() * canvas.width; }
        ctx.save();
        ctx.globalAlpha = p.alpha * fade;
        ctx.fillStyle = p.color;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      raf = requestAnimationFrame(draw);
    })(performance.now());

    setTimeout(() => { cancelAnimationFrame(raf); canvas.remove(); }, duration + 400);
  }

  /* ══════════════════════════════════════════
     5. FIREWORKS
     ══════════════════════════════════════════ */
  function fireworkBurst(x, y) {
    const colors = ['#FF671F', '#046A38', '#06038D', '#FFD700', '#ffffff'];
    const wrap = document.createElement('div');
    wrap.className = 'id-firework';
    wrap.style.cssText = `left:${x}px;top:${y}px;`;
    document.body.appendChild(wrap);
    for (let i = 0; i < 20; i++) {
      const spark = document.createElement('div');
      spark.className = 'id-spark';
      const a = (i / 20) * 2 * Math.PI;
      const d = 50 + Math.random() * 80;
      const s = 2.5 + Math.random() * 3.5;
      spark.style.cssText = `--tx:${(Math.cos(a)*d).toFixed(1)}px;--ty:${(Math.sin(a)*d).toFixed(1)}px;width:${s}px;height:${s}px;background:${colors[i%colors.length]};animation-delay:${(Math.random()*0.15).toFixed(2)}s;`;
      wrap.appendChild(spark);
    }
    setTimeout(() => wrap.remove(), 1600);
  }

  function launchFireworks() {
    const W = window.innerWidth, H = window.innerHeight;
    [[W*.22, H*.28], [W*.72, H*.22], [W*.5, H*.38]].forEach(([x,y], i) => {
      setTimeout(() => fireworkBurst(x, y), i * 420);
    });
  }

  /* ══════════════════════════════════════════
     6. ASHOKA CHAKRA BADGE
     ══════════════════════════════════════════ */
  function createChakraBadge() {
    const SIZE = 48, r = 24;
    const spokes = Array.from({ length: 24 }, (_, i) => {
      const a = (i / 24) * 2 * Math.PI;
      return `<line x1="${r}" y1="${r}" x2="${(r+r*.80*Math.sin(a)).toFixed(2)}" y2="${(r-r*.80*Math.cos(a)).toFixed(2)}" stroke="#06038D" stroke-width="1.3" stroke-linecap="round"/>`;
    }).join('');

    const badge = document.createElement('div');
    badge.id = 'id-chakra-badge';
    badge.setAttribute('role', 'button');
    badge.setAttribute('tabindex', '0');
    badge.title = '🇮🇳 Click to celebrate!';
    badge.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
        <circle cx="${r}" cy="${r}" r="${r-1}" fill="none" stroke="#FF671F" stroke-width="2.5"/>
        <circle cx="${r}" cy="${r}" r="${r-3.5}" fill="none" stroke="#fff" stroke-width="2.5"/>
        <circle cx="${r}" cy="${r}" r="${r-6}" fill="none" stroke="#046A38" stroke-width="2.5"/>
        <g class="id-chakra-spin-el">
          <circle cx="${r}" cy="${r}" r="${(r*.70).toFixed(1)}" fill="#fff"/>
          <circle cx="${r}" cy="${r}" r="${(r*.70).toFixed(1)}" fill="none" stroke="#06038D" stroke-width="1.3"/>
          ${spokes}
          <circle cx="${r}" cy="${r}" r="${(r*.13).toFixed(1)}" fill="#06038D"/>
        </g>
      </svg>`;

    document.body.appendChild(badge);
    const celebrate = () => { launchFireworks(); launchConfetti(5000); };
    badge.addEventListener('click', celebrate);
    badge.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') celebrate(); });
  }

  /* ══════════════════════════════════════════
     INIT
     ══════════════════════════════════════════ */
  function init() {
    if (!isActive()) return;
    // createChakraBadge();
    setupScrollAndModalListeners();
    // setTimeout(() => launchConfetti(CONFIG.confettiDuration), 500);
    if (isDay15()) setTimeout(() => launchFireworks(), 700);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
