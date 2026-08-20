/* khailunhao.github.io — progressive enhancement only.
   Every word on the page is in index.html; this file adds behaviour.
   Nothing here is required to read the site. */
(() => {
  'use strict';

  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  /* ---------------- theme ---------------- */
  const dots = $$('[data-theme-pick]');

  function setTheme(name, persist) {
    document.documentElement.dataset.theme = name;
    dots.forEach(d => d.setAttribute('aria-pressed', String(d.dataset.themePick === name)));
    if (persist) { try { localStorage.setItem('theme', name); } catch (e) {} }
  }

  let stored = null;
  try { stored = localStorage.getItem('theme'); } catch (e) {}
  setTheme(stored || document.documentElement.dataset.theme || 'light', false);

  dots.forEach(d => d.addEventListener('click', () => setTheme(d.dataset.themePick, true)));

  // Follow the OS only while the visitor has not picked a side themselves.
  const mq = matchMedia('(prefers-color-scheme: dark)');
  mq.addEventListener('change', e => {
    let picked = null;
    try { picked = localStorage.getItem('theme'); } catch (err) {}
    if (!picked) setTheme(e.matches ? 'dark' : 'light', false);
  });

  /* ---------------- scroll progress ---------------- */
  const bar = $('#progress');
  let ticking = false;

  function paintProgress() {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    bar.style.width = (max > 0 ? (doc.scrollTop / max) * 100 : 0).toFixed(2) + '%';
    ticking = false;
  }

  addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(paintProgress); }
  }, { passive: true });
  paintProgress();

  /* ---------------- workshop filter ---------------- */
  const cards     = $$('#project-grid .card');
  const emptyNote = $('#empty-note');

  $$('[data-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      const want = btn.dataset.filter;

      $$('[data-filter]').forEach(b => {
        const on = b === btn;
        b.classList.toggle('is-on', on);
        b.setAttribute('aria-pressed', String(on));
      });

      let visible = 0;
      cards.forEach(card => {
        const show = want === 'everything' || card.dataset.kind === want;
        card.hidden = !show;
        if (show) visible++;
        if (!show) closeCard(card);
      });

      emptyNote.hidden = visible > 0;
    });
  });

  /* ---------------- project cards ---------------- */
  function paintCard(card, open) {
    card.classList.toggle('is-open', open);
    $('.detail', card).hidden = !open;
    const more = $('.more', card);
    more.setAttribute('aria-expanded', String(open));
    more.textContent = open ? '– less' : '+ more about this';
  }

  const closeCard = card => paintCard(card, false);

  function toggleCard(card) {
    const open = !card.classList.contains('is-open');
    // One card at a time, same as the mockup.
    cards.forEach(c => { if (c !== card) closeCard(c); });
    paintCard(card, open);
  }

  cards.forEach(card => {
    // The head is a mouse affordance; ".more" is the keyboard-reachable control.
    $('.card-head', card).addEventListener('click', () => toggleCard(card));
    $('.more', card).addEventListener('click', () => toggleCard(card));
  });

  /* ---------------- ideas checklist ---------------- */
  $$('.idea').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.setAttribute('aria-pressed', btn.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
    });
  });

  /* ---------------- copy email ---------------- */
  const toast = $('#toast');
  let toastTimer;

  function flash(msg) {
    toast.textContent = msg;
    toast.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-on'), 1800);
  }

  $$('.copy-email').forEach(btn => {
    btn.addEventListener('click', async () => {
      const email = btn.dataset.email;
      try {
        await navigator.clipboard.writeText(email);
        flash('copied to clipboard ✓');
      } catch (e) {
        // Clipboard blocked (insecure context, denied permission) — fall back to mail.
        location.href = 'mailto:' + email;
      }
    });
  });

  /* ---------------- active dot on the side nav ---------------- */
  const links = new Map();
  $$('.sidenav a[href^="#"]').forEach(a => links.set(a.getAttribute('href').slice(1), a));

  const targets = [...links.keys()].map(id => document.getElementById(id)).filter(Boolean);

  if (targets.length && 'IntersectionObserver' in window) {
    const seen = new Set();
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => e.isIntersecting ? seen.add(e.target.id) : seen.delete(e.target.id));
      links.forEach((a, id) => a.classList.toggle('is-active', seen.has(id)));
    }, { rootMargin: '-40% 0px -55% 0px' });
    targets.forEach(t => io.observe(t));
  }
})();
