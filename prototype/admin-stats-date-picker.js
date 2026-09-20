/* Reconstructed static calendar control; not a verified pixel clone of the live site. */
(function () {
  'use strict';
  const parse = value => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return null;
    const date = new Date(value + 'T12:00:00Z');
    return Number.isFinite(+date) && date.toISOString().slice(0, 10) === value ? date : null;
  };
  const iso = date => date.toISOString().slice(0, 10);
  const move = (value, n) => { const d = parse(value); d.setUTCDate(d.getUTCDate() + n); return iso(d); };
  const today = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text) n.textContent = text; return n; };
  function attach({ host, start, end, getMode, onChange }) {
    const panel = el('div', 'usage-calendar');
    panel.setAttribute('popover', 'manual'); panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', '选择统计日期');
    panel.id = 'usage-calendar-' + Math.random().toString(36).slice(2); panel.hidden = true;
    document.body.append(panel);
    const triggers = [...new Set([start, end, ...host.querySelectorAll('[data-date-open]')])];
    triggers.forEach(n => { n.setAttribute('aria-haspopup', 'dialog'); n.setAttribute('aria-controls', panel.id); n.setAttribute('aria-expanded', 'false'); });
    let opened = false, trigger, originals, first = null, focusDate, month;
    const isRange = () => getMode() === 'range';
    const button = (text, label, action, cls = '') => {
      const b = el('button', cls, text); b.type = 'button'; b.setAttribute('aria-label', label); b.addEventListener('click', action); return b;
    };
    function position() {
      const box = host.getBoundingClientRect(), width = Math.min(isRange() ? 594 : 298, Math.max(0, window.innerWidth - 16));
      panel.style.width = width + 'px'; panel.style.maxHeight = Math.max(0, window.innerHeight - 16) + 'px';
      panel.style.left = Math.max(8, Math.min(box.left, window.innerWidth - width - 8)) + 'px';
      const height = panel.getBoundingClientRect().height, below = box.bottom + 6;
      panel.style.top = Math.max(8, Math.min(below + height > window.innerHeight - 8 ? box.top - height - 6 : below, window.innerHeight - height - 8)) + 'px';
    }
    function close(restore = true, returnFocus = false) {
      if (!opened) return;
      if (restore) { start.value = originals[0]; end.value = originals[1]; }
      opened = false; first = null;
      if (panel.hidePopover) { try { panel.hidePopover(); } catch (_) {} }
      panel.hidden = true; triggers.forEach(n => n.setAttribute('aria-expanded', 'false'));
      document.removeEventListener('pointerdown', outside, true); document.removeEventListener('keydown', escape, true);
      window.removeEventListener('resize', position); window.removeEventListener('scroll', position, true);
      if (returnFocus && trigger?.isConnected) trigger.focus();
    }
    function outside(event) { if (!panel.contains(event.target) && !host.contains(event.target)) close(); }
    function escape(event) { if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); close(true, true); } }
    function pick(value) {
      if (isRange() && !first) { first = value; focusDate = value; render(true); return; }
      const values = isRange() ? [first, value].sort() : [value, value];
      start.value = values[0]; end.value = values[1]; close(false, true);
      if (onChange) onChange({ start: values[0], end: values[1] });
    }
    function focusDay() { panel.querySelector('[data-date="' + focusDate + '"]')?.focus(); }
    function render(restoreFocus = false) {
      panel.replaceChildren(); panel.classList.toggle('usage-calendar-range', isRange());
      const head = el('div', 'usage-calendar-navigation');
      function shift(n) { month.setUTCMonth(month.getUTCMonth() + n); focusDate = iso(month); render(); panel.querySelector('[data-shift="' + n + '"]').focus(); }
      for (const [n, text, label] of [[-1, '‹', '上个月'], [1, '›', '下个月']]) { const b = button(text, label, () => shift(n)); b.dataset.shift = n; head.append(b); }
      panel.append(head);
      const months = el('div', 'usage-calendar-months');
      for (let index = 0; index < (isRange() ? 2 : 1); index++) {
        const current = new Date(+month); current.setUTCMonth(current.getUTCMonth() + index);
        const year = current.getUTCFullYear(), m = current.getUTCMonth(), section = el('section', 'usage-calendar-month');
        section.append(el('div', 'usage-calendar-title', year + ' 年 ' + (m + 1) + ' 月'));
        const grid = el('div', 'usage-calendar-grid'); grid.setAttribute('role', 'group'); grid.setAttribute('aria-label', year + '年' + (m + 1) + '月');
        ['日', '一', '二', '三', '四', '五', '六'].forEach(text => grid.append(el('span', 'usage-calendar-weekday', text)));
        const offset = current.getUTCDay(), days = new Date(Date.UTC(year, m + 1, 0, 12)).getUTCDate();
        for (let cell = 0; cell < 42; cell++) {
          const day = cell - offset + 1;
          if (day < 1 || day > days) { grid.append(el('span', 'usage-calendar-blank')); continue; }
          const value = iso(new Date(Date.UTC(year, m, day, 12))), b = button(String(day), '选择 ' + value, () => pick(value), 'usage-calendar-day');
          b.dataset.date = value; b.tabIndex = value === focusDate ? 0 : -1;
          const lo = first || (parse(start.value) ? start.value : ''), hi = first || (parse(end.value) ? end.value : lo);
          const selected = value === lo || (isRange() && value === hi);
          b.classList.toggle('is-selected', selected); b.setAttribute('aria-pressed', String(selected));
          b.classList.toggle('is-between', isRange() && value > lo && value < hi);
          if (value === today()) { b.classList.add('is-today'); b.setAttribute('aria-current', 'date'); }
          b.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); pick(value); return; }
            const step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[event.key];
            if (!step) return; event.preventDefault(); focusDate = move(value, step);
            const target = parse(focusDate), last = new Date(+month); last.setUTCMonth(last.getUTCMonth() + (isRange() ? 2 : 1));
            if (target < month || target >= last) month = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth(), 1, 12));
            render(true);
          });
          grid.append(b);
        }
        section.append(grid); months.append(section);
      }
      panel.append(months); panel.append(el('div', 'usage-calendar-hint', isRange() ? (first ? '请选择结束日期' : '请选择开始日期和结束日期') : '请选择日期'));
      position(); if (restoreFocus) focusDay();
    }
    function open(event) {
      if (event.currentTarget.disabled || start.disabled || (isRange() && end.disabled)) return;
      if (opened) return;
      trigger = event.currentTarget; originals = [start.value, end.value]; first = null;
      focusDate = parse(trigger === end ? end.value : start.value) ? (trigger === end ? end.value : start.value) : today();
      const date = parse(focusDate); month = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1, 12));
      opened = true; panel.hidden = false; render();
      if (panel.showPopover) { try { panel.showPopover(); } catch (_) {} }
      position(); triggers.forEach(n => n.setAttribute('aria-expanded', 'true'));
      document.addEventListener('pointerdown', outside, true); document.addEventListener('keydown', escape, true);
      window.addEventListener('resize', position); window.addEventListener('scroll', position, true);
      if (event.type === 'keydown' || ![start, end].includes(trigger)) focusDay();
      else trigger.focus();
    }
    triggers.forEach(n => {
      n.addEventListener('click', open);
      n.addEventListener('keydown', event => { if (event.key === 'ArrowDown') { event.preventDefault(); if (opened) focusDay(); else open(event); } });
    });
    [start, end].forEach(input => input.addEventListener('input', () => close(false)));
    return { close: () => close(), refresh: () => { if (opened) { close(false); } } };
  }
  window.AdminUsageDatePicker = { attach };
})();
