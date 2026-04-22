/* ============================================================
   GRILL MASTER AFRICAN RESTAURANT
   Main JavaScript — v3.0  (speed-optimised)
   ============================================================ */

(function () {
  'use strict';

  /* ============================================================
     1. PRELOADER
     ─ Minimum 900 ms display, then fade out
     ============================================================ */
  const preloader = document.getElementById('preloader');
  if (preloader) {
    const MIN = 900;
    const t0  = Date.now();
    window.addEventListener('load', () => {
      const wait = Math.max(0, MIN - (Date.now() - t0));
      setTimeout(() => {
        preloader.classList.add('fade-out');
        // Remove from DOM after transition to free memory
        preloader.addEventListener('transitionend', () => preloader.remove(), { once: true });
      }, wait);
    });
  }

  /* ============================================================
     2. CUSTOM CURSOR  (desktop / fine-pointer only)
     ─ Dot follows mouse instantly; ring uses lightweight lerp
     ============================================================ */
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');

  if (dot && ring && window.matchMedia('(pointer: fine)').matches) {
    let mx = 0, my = 0, rx = 0, ry = 0, rafCursor;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top  = my + 'px';
    }, { passive: true });

    const tickCursor = () => {
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      rafCursor = requestAnimationFrame(tickCursor);
    };
    tickCursor();

    // Hover enlarge on interactive elements
    document.addEventListener('mouseover', e => {
      if (e.target.closest('a, button, .dish-card, .menu-card, .bev-card, .filter-btn'))
        ring.classList.add('hovered');
    });
    document.addEventListener('mouseout', e => {
      if (e.target.closest('a, button, .dish-card, .menu-card, .bev-card, .filter-btn'))
        ring.classList.remove('hovered');
    });
  }

  /* ============================================================
     3. NAVBAR — scroll behaviour
     ============================================================ */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const isHome = !!document.querySelector('.hero');

    if (!isHome) {
      // Inner pages: always solid — class already set in HTML (.scrolled)
      navbar.classList.add('scrolled');
    } else {
      const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 55);
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }
  }

  /* ============================================================
     4. MOBILE MENU
     ============================================================ */
  const toggle  = document.getElementById('navToggle');
  const menu    = document.getElementById('mobileMenu');
  const overlay = document.getElementById('mobileOverlay');
  const closer  = document.getElementById('mobileClose');

  const openMenu  = () => { menu?.classList.add('open'); overlay?.classList.add('active'); toggle?.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const closeMenu = () => { menu?.classList.remove('open'); overlay?.classList.remove('active'); toggle?.classList.remove('open'); document.body.style.overflow = ''; };

  toggle?.addEventListener('click', () => menu?.classList.contains('open') ? closeMenu() : openMenu());
  closer?.addEventListener('click', closeMenu);
  overlay?.addEventListener('click', closeMenu);
  document.addEventListener('keydown', e => e.key === 'Escape' && closeMenu());

  /* ============================================================
     5. INTERSECTION OBSERVER — scroll reveal
     ─ Single shared observer for all reveal classes
     ============================================================ */
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('vis');
      revealObs.unobserve(e.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' });

  document.querySelectorAll('.reveal, .reveal-l, .reveal-r, .stagger')
    .forEach(el => revealObs.observe(el));

  /* ============================================================
     6. MENU FILTER TABS
     ─ Hides/shows cards; stagger re-entrance animation
     ============================================================ */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const menuCards  = document.querySelectorAll('.menu-card, .bev-card');

  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        let idx = 0;

        menuCards.forEach(card => {
          const match = filter === 'all' || card.dataset.category === filter;
          if (match) {
            card.classList.remove('hidden');
            card.style.opacity   = '0';
            card.style.transform = 'translateY(20px)';
            // Stagger via timeout
            const delay = idx * 50;
            setTimeout(() => {
              card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
              card.style.opacity    = '1';
              card.style.transform  = 'translateY(0)';
            }, delay);
            idx++;
          } else {
            card.classList.add('hidden');
            card.style.cssText = '';
          }
        });
      });
    });
  }

  /* ============================================================
     7. FOOTER YEAR
     ============================================================ */
  document.querySelectorAll('#current-year')
    .forEach(el => { el.textContent = new Date().getFullYear(); });

  /* ============================================================
     8. SMOOTH ANCHOR SCROLL
     ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); closeMenu(); }
    });
  });

  /* ============================================================
     9. LAZY IMAGE FADE-IN
     ─ Lightweight — no library needed
     ============================================================ */
  const imgObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const img = e.target;
      img.style.opacity = '1';
      imgObs.unobserve(img);
    });
  }, { threshold: 0.05 });

  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    img.style.opacity    = '0';
    img.style.transition = 'opacity 0.5s ease';
    if (img.complete) { img.style.opacity = '1'; }
    else              { imgObs.observe(img); }
  });

  /* ============================================================
     10. GALLERY — respect reduced-motion preference
     ============================================================ */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const gw = document.querySelector('.gallery-wrapper');
    if (gw) gw.style.animationPlayState = 'paused';
  }

})();
