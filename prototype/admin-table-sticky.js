/* Freeze real table headers without changing each page's scrolling layout.
   A horizontal-only overflow wrapper blocks native vertical sticky positioning;
   moving the original thead also covers that case and retains its event handlers. */
(() => {
  'use strict';
  if (window.AdminTableSticky) return;

  const headers = new Map();
  let pending = 0;
  let discover = true;
  const resize = new ResizeObserver(() => schedule());

  function schedule(rescan = false) {
    discover ||= rescan;
    if (!pending) pending = requestAnimationFrame(update);
  }

  function findHeaders() {
    for (const [head, state] of headers) {
      if (!head.isConnected || head.parentElement?.tHead !== head) {
        resize.unobserve(state.table);
        headers.delete(head);
      }
    }
    document.querySelectorAll('table > thead').forEach(head => {
      if (headers.has(head) || head.closest('[contenteditable="true"]')) return;
      const table = head.parentElement;
      head.dataset.adminTableSticky = '';
      headers.set(head, { table, offset: 0 });
      resize.observe(table);
    });
  }

  function update() {
    pending = 0;
    if (discover) { discover = false; findHeaders(); }
    const changes = [];
    for (const [head, state] of headers) {
      const bounds = head.getBoundingClientRect();
      if (!bounds.width || !bounds.height) continue;
      const tableBounds = state.table.getBoundingClientRect();
      const naturalTop = bounds.top - state.offset;
      let visibleTop = 0;
      // Every clipping ancestor contributes its inner border edge. This handles
      // nested table/dialog scrollports as well as document scrolling, without
      // assuming that overflow:auto actually has vertical overflow.
      for (let el = state.table.parentElement; el && el !== document.documentElement; el = el.parentElement) {
        const css = getComputedStyle(el);
        if (css.overflowY !== 'visible' && el !== document.body) {
          visibleTop = Math.max(visibleTop, el.getBoundingClientRect().top + el.clientTop);
        }
      }
      const limit = Math.max(0, tableBounds.bottom - naturalTop - bounds.height);
      const offset = Math.min(limit, Math.max(0, visibleTop - naturalTop));
      if (Math.abs(offset - state.offset) > 0.01) changes.push([head, state, offset]);
    }
    // Batch writes after geometry reads; transformations do not resize tables,
    // so neither this observer nor the scheduler creates a perpetual loop.
    changes.forEach(([head, state, offset]) => {
      state.offset = offset;
      head.style.setProperty('--admin-table-header-offset', `${offset}px`);
    });
  }

  new MutationObserver(() => schedule(true)).observe(document.body, { childList: true, subtree: true });
  document.addEventListener('scroll', () => schedule(), { capture: true, passive: true });
  window.addEventListener('resize', () => schedule(), { passive: true });
  document.fonts?.ready.then(() => schedule());
  window.AdminTableSticky = Object.freeze({ refresh: () => schedule(true) });
  schedule(true);
})();
