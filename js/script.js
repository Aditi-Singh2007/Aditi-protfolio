/**
 * Portfolio Website — script.js
 * Aditi Kumari | 2026
 *
 * Features:
 *  1. Navbar scroll effect & active link highlighting
 *  2. Hamburger mobile menu
 *  3. Dark / Light mode toggle (persisted to localStorage)
 *  4. Typing text animation (hero tagline)
 *  5. Intersection Observer — reveal animations
 *  6. Animated skill bars + counter
 *  7. Animated stat counters
 *  8. Scroll-to-top button
 *  9. Contact form validation
 */

'use strict';

/* ============================================================
   1. NAVBAR — Scroll Effect & Active Link
============================================================ */
(function initNavbar() {
  const navbar     = document.getElementById('navbar');
  const navLinks   = document.querySelectorAll('.nav-link');
  const sections   = document.querySelectorAll('main section[id]');

  function onScroll() {
    // Scrolled style
    navbar.classList.toggle('scrolled', window.scrollY > 30);

    // Scroll-to-top button
    const scrollTopBtn = document.getElementById('scroll-top');
    if (scrollTopBtn) {
      scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
    }

    // Active nav link based on scroll position
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) current = section.getAttribute('id');
    });

    navLinks.forEach(link => {
      link.classList.toggle(
        'active',
        link.getAttribute('href') === `#${current}`
      );
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  // Smooth scroll on nav-link click
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      // Close mobile menu if open
      const navLinksContainer = document.getElementById('nav-links');
      const hamburger = document.getElementById('hamburger');
      if (navLinksContainer) navLinksContainer.classList.remove('open');
      if (hamburger) {
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  });
})();


/* ============================================================
   2. HAMBURGER MENU
============================================================ */
(function initHamburger() {
  const hamburger      = document.getElementById('hamburger');
  const navLinksContainer = document.getElementById('nav-links');
  if (!hamburger || !navLinksContainer) return;

  hamburger.addEventListener('click', () => {
    const isOpen = navLinksContainer.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen.toString());
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!hamburger.contains(e.target) && !navLinksContainer.contains(e.target)) {
      navLinksContainer.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
})();


/* ============================================================
   3. DARK / LIGHT MODE TOGGLE
============================================================ */
(function initTheme() {
  const toggle   = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const html      = document.documentElement;

  const saved = localStorage.getItem('theme') || 'light';
  html.setAttribute('data-theme', saved);
  updateIcon(saved);

  toggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next    = current === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateIcon(next);
  });

  function updateIcon(theme) {
    if (!themeIcon) return;
    themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  }
})();


/* ============================================================
   4. TYPING TEXT ANIMATION (Hero Tagline)
============================================================ */
(function initTyped() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const phrases = [
    'MS Excel & Tally Prime Specialist',
    'Data Entry Expert',
    'Business Analytics Enthusiast',
    'BBA Graduate',
    'Problem Solver'
  ];

  let phraseIndex  = 0;
  let charIndex    = 0;
  let isDeleting   = false;
  let isPaused     = false;

  const TYPING_SPEED   = 65;
  const DELETING_SPEED = 35;
  const PAUSE_DURATION = 1800;

  function type() {
    const phrase = phrases[phraseIndex];

    if (isDeleting) {
      el.textContent = phrase.substring(0, charIndex--);
      if (charIndex < 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(type, 400);
        return;
      }
      setTimeout(type, DELETING_SPEED);
    } else {
      el.textContent = phrase.substring(0, ++charIndex);
      if (charIndex === phrase.length) {
        isDeleting = true;
        setTimeout(type, PAUSE_DURATION);
        return;
      }
      setTimeout(type, TYPING_SPEED);
    }
  }

  setTimeout(type, 700);
})();


/* ============================================================
   5. INTERSECTION OBSERVER — Reveal Animations
============================================================ */
(function initReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;

      // Stagger children in the same parent
      const delay = Array.from(
        entry.target.parentElement.querySelectorAll('.reveal')
      ).indexOf(entry.target);

      entry.target.style.transitionDelay = `${delay * 0.08}s`;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealEls.forEach(el => observer.observe(el));
})();


/* ============================================================
   6. ANIMATED SKILL BARS
============================================================ */
(function initSkillBars() {
  const skillSection = document.getElementById('skills');
  if (!skillSection) return;

  let animated = false;

  const observer = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting || animated) return;
    animated = true;

    document.querySelectorAll('.skill-bar-item').forEach(item => {
      const fill       = item.querySelector('.skill-fill');
      const percentEl  = item.querySelector('.skill-percent');
      const target     = parseInt(item.dataset.level, 10);

      if (!fill || !percentEl || isNaN(target)) return;

      // Trigger CSS width transition
      requestAnimationFrame(() => {
        fill.style.width = `${target}%`;
      });

      // Animate the percentage counter
      let current = 0;
      const increment = target / 60;
      const interval  = setInterval(() => {
        current = Math.min(current + increment, target);
        percentEl.textContent = `${Math.round(current)}%`;
        if (current >= target) clearInterval(interval);
      }, 20);
    });

    observer.disconnect();
  }, { threshold: 0.3 });

  observer.observe(skillSection);
})();


/* ============================================================
   7. ANIMATED STAT COUNTERS
============================================================ */
(function initStatCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  let animated = false;

  const observer = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting || animated) return;
    animated = true;

    statNumbers.forEach(el => {
      const target    = parseInt(el.dataset.target, 10);
      if (isNaN(target)) return;

      let current     = 0;
      const step      = Math.max(1, Math.ceil(target / 50));
      const interval  = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current + (el.dataset.suffix || '+');
        if (current >= target) clearInterval(interval);
      }, 35);
    });

    observer.disconnect();
  }, { threshold: 0.4 });

  const aboutSection = document.getElementById('about');
  if (aboutSection) observer.observe(aboutSection);
})();


/* ============================================================
   8. SCROLL-TO-TOP BUTTON
============================================================ */
(function initScrollTop() {
  const btn = document.getElementById('scroll-top');
  if (!btn) return;
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* ============================================================
   9. CONTACT FORM VALIDATION
============================================================ */
(function initContactForm() {
  const form       = document.getElementById('contact-form');
  const successMsg = document.getElementById('form-success');
  const submitBtn  = document.getElementById('submit-btn');
  if (!form) return;

  const fields = {
    name: {
      el:    document.getElementById('name'),
      error: document.getElementById('name-error'),
      validate(val) {
        if (!val.trim()) return 'Name is required.';
        if (val.trim().length < 2) return 'Name must be at least 2 characters.';
        return '';
      }
    },
    email: {
      el:    document.getElementById('email'),
      error: document.getElementById('email-error'),
      validate(val) {
        if (!val.trim()) return 'Email is required.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return 'Please enter a valid email address.';
        return '';
      }
    },
    message: {
      el:    document.getElementById('message'),
      error: document.getElementById('message-error'),
      validate(val) {
        if (!val.trim()) return 'Message is required.';
        if (val.trim().length < 10) return 'Message must be at least 10 characters.';
        return '';
      }
    }
  };

  // Live validation on blur / input
  Object.values(fields).forEach(fieldDef => {
    if (!fieldDef.el) return;

    fieldDef.el.addEventListener('input', () => {
      const err = fieldDef.validate(fieldDef.el.value);
      setError(fieldDef, err);
    });

    fieldDef.el.addEventListener('blur', () => {
      const err = fieldDef.validate(fieldDef.el.value);
      setError(fieldDef, err);
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    let hasErrors = false;

    Object.values(fields).forEach(fieldDef => {
      if (!fieldDef.el) return;
      const err = fieldDef.validate(fieldDef.el.value);
      setError(fieldDef, err);
      if (err) hasErrors = true;
    });

    if (hasErrors) return;

    // Simulate form submission
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';

    setTimeout(() => {
      form.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      successMsg.classList.add('visible');
      setTimeout(() => successMsg.classList.remove('visible'), 5000);
    }, 1500);
  });

  function setError(fieldDef, message) {
    if (!fieldDef.el || !fieldDef.error) return;
    fieldDef.error.textContent = message;
    fieldDef.el.classList.toggle('error', !!message);
  }
})();
