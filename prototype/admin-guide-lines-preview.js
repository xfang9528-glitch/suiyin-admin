/* SPEC-SUIYIN-ADMIN-073 R009–R011; inherits 030 image-object transforms.
 * Preview-only session: no storage, configuration writes, exports or remote APIs. */
'use strict';
window.AdminGuideLinePreview = (() => {
  const WIDTH = 800, HEIGHT = 600, TAU = Math.PI * 2;
  let current = null, sequence = 0;
  const element = (tag, cls, text) => {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    if (text !== undefined) el.textContent = text;
    return el;
  };
  const button = (label, action, cls = '') => {
    const el = element('button', 'aglp-button ' + cls, label);
    el.type = 'button'; el.onclick = action; return el;
  };
  const cloneObjects = objects => objects.map(object => ({ ...object }));
  const imageSource = src => window.__ADMIN_INLINE_ASSETS__?.[src] || src;
  const rotate = (x, y, angle) => ({ x: x * Math.cos(angle) - y * Math.sin(angle), y: x * Math.sin(angle) + y * Math.cos(angle) });
  const normalize = angle => ((angle % TAU) + TAU) % TAU;
  const isTextInput = target => target?.matches?.('input,textarea,select,[contenteditable="true"]');
  function announce(open) {
    if (parent === window) return;
    const origin = window.__ADMIN_INLINE_ORIGIN__ || location.origin;
    parent.postMessage({ type: 'admin-dialog-state', open }, origin === 'null' ? '*' : origin);
  }
  function permittedSource(src) {
    if (typeof src !== 'string' || !src.trim()) return false;
    if (/^data:image\/png;base64,/i.test(src)) return true;
    try {
      const url = new URL(src, document.baseURI);
      if (url.protocol === 'blob:') return url.origin === location.origin || url.origin === 'null';
      return ['http:', 'https:', 'file:'].includes(url.protocol) && url.origin === location.origin;
    } catch { return false; }
  }
  function close() {
    const state = current;
    if (!state || state.closing) return;
    state.closing = true; current = null;
    state.events.abort(); state.resize?.disconnect(); state.gesture = null;
    if (state.dialog.open) state.dialog.close();
    state.dialog.remove();
    if (state.frame) {
      state.frame.classList.toggle('menu-dialog-layer', state.previous.frameLayer);
      if (state.app) state.app.style.cssText = state.previous.appStyle;
    }
    document.body.classList.toggle('menu-modal-open', state.previous.bodyModal);
    document.documentElement.classList.toggle('aglp-frame-open', state.previous.rootClass);
    document.body.classList.toggle('aglp-frame-open', state.previous.bodyClass);
    document.documentElement.style.overflow = state.previous.rootOverflow;
    announce(!!document.querySelector('dialog[open]'));
    if (state.previous.focus?.isConnected) state.previous.focus.focus({ preventScroll: true });
    state.objects.length = 0; state.history.length = 0;
    if (typeof state.onClose === 'function') state.onClose();
  }
  function open({ categories = [], dirty = false, tenantLabel = '', onClose } = {}) {
    close();
    // Copy just the preview contract. Never mutate, reorder or persist the caller's items.
    const source = (Array.isArray(categories) ? categories : []).filter(c => c?.enabled === true).map(c => ({
      id: String(c.id ?? ''), name: String(c.name ?? ''),
      items: (Array.isArray(c.items) ? c.items : []).filter(item => item && item.enabled !== false).map(item => ({
        id: String(item.id ?? ''), src: imageSource(String(item.src ?? '')), width: Number(item.width), height: Number(item.height)
      }))
    }));
    const frame = window.frameElement, app = document.getElementById('app');
    const state = {
      id: ++sequence, source, onClose, frame, app, events: new AbortController(),
      objects: [], selected: null, history: [{ objects: [], selected: null }], gesture: null,
      previous: {
        focus: document.activeElement, frameLayer: frame?.classList.contains('menu-dialog-layer') || false,
        appStyle: app?.style.cssText || '', bodyModal: document.body.classList.contains('menu-modal-open'),
        rootClass: document.documentElement.classList.contains('aglp-frame-open'),
        bodyClass: document.body.classList.contains('aglp-frame-open'), rootOverflow: document.documentElement.style.overflow
      }
    };
    current = state;
    const dialog = state.dialog = element('dialog', 'aglp-dialog');
    dialog.setAttribute('aria-labelledby', 'aglp-title-' + state.id);
    dialog.setAttribute('aria-describedby', 'aglp-note-' + state.id);
    const head = element('header', 'aglp-head'), heading = element('div', 'aglp-heading');
    const title = element('h2', '', 'PC 效果预览'); title.id = 'aglp-title-' + state.id;
    const note = element('p', 'aglp-subtitle', (tenantLabel ? tenantLabel + ' · ' : '') + '本地预览');
    note.id = 'aglp-note-' + state.id; heading.append(title, note); head.append(heading);
    if (dirty) head.append(element('span', 'aglp-draft', '预览未保存的更改'));
    const exit = button('×', close, 'aglp-close'); exit.setAttribute('aria-label', '关闭 PC 效果预览'); head.append(exit);
    const toolbar = element('div', 'aglp-toolbar');
    const undo = state.undo = button('撤销', () => undoChange(state));
    undo.title = '撤销上一步（Ctrl+Z）';
    const remove = state.remove = button('删除', () => removeSelected(state));
    remove.setAttribute('aria-label', '删除选中的辅助线');
    toolbar.append(element('span', 'aglp-instruction', '拖动定位 · 拖角点等比缩放 · Shift 旋转吸附'), undo, remove);
    const body = element('div', 'aglp-body'), library = element('aside', 'aglp-library');
    library.setAttribute('aria-label', '医美工具');
    const tabs = state.tabs = element('div', 'aglp-categories');
    tabs.setAttribute('role', 'tablist'); tabs.setAttribute('aria-label', '辅助线分类'); tabs.setAttribute('aria-orientation', 'vertical');
    const content = element('section', 'aglp-tools'), grid = state.grid = element('div', 'aglp-grid');
    grid.id = 'aglp-tools-' + state.id; grid.setAttribute('role', 'tabpanel');
    content.append(grid); library.append(tabs, content);
    const well = state.well = element('div', 'aglp-canvas-well'), stage = state.stage = element('div', 'aglp-stage');
    stage.tabIndex = 0; stage.setAttribute('aria-label', '辅助线预览画布');
    stage.innerHTML = '<svg class="aglp-neutral-base" viewBox="0 0 800 600" aria-hidden="true"><rect width="800" height="600" fill="#4e5963"/><g fill="none" stroke="#8795a1" stroke-width="2.6" stroke-linecap="round"><path d="M317 429c-35-34-59-85-62-142-4-63 19-143 75-173 43-23 97-23 140 0 56 30 79 110 75 173-3 57-27 108-62 142-26 26-55 44-83 44s-57-18-83-44Z"/><path d="M336 464v33c0 11-61 22-97 52M464 464v33c0 11 61 22 97 52"/><path d="M291 252c21-12 47-11 68 0M441 252c21-11 47-12 68 0M305 272c14 7 28 7 41 0M454 272c13 7 27 7 41 0M400 274l-12 69c9 6 18 6 27 0M365 393c22 10 48 10 70 0M377 391c15-8 31-8 46 0"/></g></svg>';
    const objectLayer = state.objectLayer = element('div', 'aglp-objects');
    const selection = state.selection = element('div', 'aglp-selection'); selection.hidden = true;
    stage.append(objectLayer, selection); well.append(stage); body.append(library, well);
    const foot = element('footer', 'aglp-foot'), status = state.status = element('span', 'aglp-status', '选择辅助线，在中性轮廓上查看效果');
    status.setAttribute('role', 'status'); status.setAttribute('aria-live', 'polite');
    foot.append(status, element('span', 'aglp-foot-note', '预览操作不会修改配置'));
    dialog.append(head, toolbar, body, foot); document.body.append(dialog);
    if (frame) {
      const bounds = frame.getBoundingClientRect();
      if (app) app.style.cssText = `position:fixed;left:${bounds.left}px;top:${bounds.top}px;width:${bounds.width}px;height:${bounds.height}px`;
      frame.classList.add('menu-dialog-layer'); document.body.classList.add('menu-modal-open');
      document.documentElement.classList.add('aglp-frame-open'); document.body.classList.add('aglp-frame-open');
    }
    document.documentElement.style.overflow = 'hidden';
    installEvents(state); renderCategories(state); renderObjects(state);
    dialog.showModal(); announce(true); fitCanvas(state);
    state.resize = new ResizeObserver(() => fitCanvas(state)); state.resize.observe(well);
    exit.focus({ preventScroll: true });
    return { close };
  }
  function tell(state, message, error = false) {
    if (current !== state) return;
    state.status.textContent = message; state.status.classList.toggle('is-error', error);
  }
  function fitCanvas(state) {
    if (current !== state) return;
    const width = Math.max(80, Math.min(state.well.clientWidth - 24, (state.well.clientHeight - 24) * WIDTH / HEIGHT));
    state.stage.style.width = width + 'px'; state.stage.style.height = width * HEIGHT / WIDTH + 'px';
    renderSelection(state);
  }
  function renderCategories(state) {
    state.tabs.replaceChildren();
    if (!state.source.length) {
      state.grid.append(element('div', 'aglp-empty', '没有可预览的启用分类'));
      tell(state, '返回管理页启用分类后再预览'); return;
    }
    state.source.forEach((category, index) => {
      const tab = button(category.name, () => showCategory(state, index), 'aglp-category');
      tab.id = 'aglp-category-' + state.id + '-' + index; tab.title = category.name;
      tab.setAttribute('role', 'tab'); tab.setAttribute('aria-controls', state.grid.id);
      tab.onkeydown = event => {
        if (!['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? state.source.length - 1 : (index + (event.key === 'ArrowDown' ? 1 : -1) + state.source.length) % state.source.length;
        showCategory(state, next); state.tabs.children[next].focus();
      };
      state.tabs.append(tab);
    });
    showCategory(state, 0);
  }
  function showCategory(state, index) {
    if (current !== state) return;
    const category = state.source[index];
    [...state.tabs.children].forEach((tab, i) => { tab.setAttribute('aria-selected', String(i === index)); tab.tabIndex = i === index ? 0 : -1; });
    state.grid.setAttribute('aria-labelledby', state.tabs.children[index].id);
    state.grid.replaceChildren(); state.grid.scrollTop = 0;
    if (!category.items.length) { state.grid.append(element('div', 'aglp-empty', '此分类还没有辅助线')); return; }
    category.items.forEach(item => {
      const card = button('', () => {
        if (card.dataset.state === 'error') load();
        else if (card.dataset.state === 'ready') insert(state, item, image);
        else tell(state, '素材正在加载，请稍候');
      }, 'aglp-card');
      card.setAttribute('aria-label', '插入辅助线'); card.title = '插入辅助线';
      const thumb = element('span', 'aglp-thumb'), image = element('img'), message = element('span', 'aglp-card-state');
      image.alt = ''; image.draggable = false; image.decoding = 'async';
      thumb.append(image, message); card.append(thumb); state.grid.append(card);
      let request = 0;
      function load() {
        const token = ++request; card.dataset.state = 'loading'; card.setAttribute('aria-busy', 'true');
        card.setAttribute('aria-label', '正在加载辅助线'); message.textContent = '正在加载…';
        const failed = () => {
          if (current !== state || token !== request || !card.isConnected) return;
          card.dataset.state = 'error'; card.setAttribute('aria-busy', 'false');
          card.setAttribute('aria-label', '素材加载失败，点击重试'); message.textContent = '素材加载失败，点击重试';
        };
        image.onload = () => {
          if (current !== state || token !== request || !card.isConnected) return;
          if (!image.naturalWidth || !image.naturalHeight) { failed(); return; }
          card.dataset.state = 'ready'; card.setAttribute('aria-busy', 'false'); card.setAttribute('aria-label', '插入辅助线'); message.textContent = '';
        };
        image.onerror = failed;
        if (!permittedSource(item.src)) { image.removeAttribute('src'); failed(); return; }
        image.src = item.src;
      }
      load();
    });
  }
  function insert(state, item, image) {
    if (current !== state || state.gesture) return;
    const sourceWidth = Number.isFinite(item.width) && item.width > 0 ? item.width : image.naturalWidth;
    const sourceHeight = Number.isFinite(item.height) && item.height > 0 ? item.height : image.naturalHeight;
    const factor = Math.max(WIDTH, HEIGHT) * 0.35 / Math.max(sourceWidth, sourceHeight);
    const object = { id: 'preview-' + (++sequence), src: item.src, x: WIDTH / 2, y: HEIGHT / 2, width: sourceWidth * factor, height: sourceHeight * factor, defaultWidth: sourceWidth * factor, rotation: 0 };
    state.objects.push(object); state.selected = object.id; commit(state); renderObjects(state);
    state.stage.focus({ preventScroll: true }); tell(state, '辅助线已插入，可直接拖动调整');
  }
  function selected(state) { return state.objects.find(object => object.id === state.selected); }
  function position(state, node, object) {
    node.style.left = object.x / WIDTH * 100 + '%'; node.style.top = object.y / HEIGHT * 100 + '%';
    node.style.width = object.width / WIDTH * 100 + '%'; node.style.height = object.height / HEIGHT * 100 + '%';
    node.style.transform = 'translate(-50%,-50%) rotate(' + object.rotation + 'rad)';
  }
  function renderObjects(state) {
    state.objectLayer.replaceChildren();
    state.objects.forEach((object, index) => {
      const node = element('div', 'aglp-object'); node.dataset.objectId = object.id;
      node.style.zIndex = index + 1; node.tabIndex = 0; node.setAttribute('role', 'button'); node.setAttribute('aria-label', '选择辅助线对象');
      const image = element('img'); image.src = object.src; image.alt = ''; image.draggable = false; node.append(image);
      node.onfocus = () => { state.selected = object.id; renderSelection(state); };
      node.onpointerdown = event => beginGesture(state, object, 'drag', event);
      position(state, node, object); state.objectLayer.append(node);
    });
    renderSelection(state);
  }
  function renderSelection(state) {
    const object = selected(state); state.undo.disabled = state.history.length < 2; state.remove.disabled = !object;
    state.selection.hidden = !object; state.selection.replaceChildren();
    state.objectLayer.querySelectorAll('[data-object-id]').forEach(node => node.setAttribute('aria-pressed', String(node.dataset.objectId === state.selected)));
    if (!object) return;
    position(state, state.selection, object);
    const handles = { tl: '左上角', tr: '右上角', br: '右下角', bl: '左下角' };
    for (const [name, label] of Object.entries(handles)) {
      const handle = button('', () => {}, 'aglp-handle aglp-' + name); handle.setAttribute('aria-label', label + '等比缩放');
      handle.dataset.handle = name; handle.onpointerdown = event => beginGesture(state, object, 'scale', event, name); state.selection.append(handle);
    }
    const stem = element('span', 'aglp-rotate-stem');
    const rotation = button('↻', () => {}, 'aglp-rotate'); rotation.setAttribute('aria-label', '旋转辅助线');
    rotation.title = '拖动旋转；按住 Shift 每 15° 吸附'; rotation.onpointerdown = event => beginGesture(state, object, 'rotate', event);
    rotation.onkeydown = event => {
      if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault(); event.stopPropagation(); object.rotation = normalize(object.rotation + (event.key === 'ArrowRight' ? 1 : -1) * Math.PI / 12);
      commit(state); renderObjects(state); state.selection.querySelector('.aglp-rotate')?.focus();
    };
    const remove = button('×', () => removeSelected(state), 'aglp-object-delete'); remove.setAttribute('aria-label', '删除当前辅助线');
    remove.onpointerdown = event => event.stopPropagation(); state.selection.append(stem, rotation, remove);
  }
  function point(state, event) {
    const r = state.stage.getBoundingClientRect(); return { x: (event.clientX - r.left) * WIDTH / r.width, y: (event.clientY - r.top) * HEIGHT / r.height };
  }
  function constrain(state, object) {
    const cos = Math.abs(Math.cos(object.rotation)), sin = Math.abs(Math.sin(object.rotation));
    const halfW = (object.width * cos + object.height * sin) / 2, halfH = (object.width * sin + object.height * cos) / 2;
    const screenUnit = WIDTH / Math.max(1, state.stage.clientWidth);
    const visibleX = Math.min(32 * screenUnit, halfW * 2), visibleY = Math.min(32 * screenUnit, halfH * 2);
    object.x = Math.max(visibleX - halfW, Math.min(WIDTH - visibleX + halfW, object.x));
    object.y = Math.max(visibleY - halfH, Math.min(HEIGHT - visibleY + halfH, object.y));
  }
  function beginGesture(state, object, kind, event, handle) {
    if (current !== state || event.button !== 0 || state.gesture) return;
    event.preventDefault(); event.stopPropagation();
    state.selected = object.id; const start = point(state, event);
    const gesture = { id: object.id, pointerId: event.pointerId, kind, start, original: { ...object } };
    if (kind === 'rotate') gesture.startAngle = Math.atan2(start.y - object.y, start.x - object.x);
    if (kind === 'scale') {
      const signs = { tl: [-1,-1], tr: [1,-1], br: [1,1], bl: [-1,1] }[handle];
      gesture.sx = signs[0]; gesture.sy = signs[1];
      const offset = rotate(-gesture.sx * object.width / 2, -gesture.sy * object.height / 2, object.rotation);
      gesture.anchor = { x: object.x + offset.x, y: object.y + offset.y };
    }
    state.gesture = gesture; state.stage.setPointerCapture?.(event.pointerId); renderSelection(state);
  }
  function moveGesture(state, event) {
    const gesture = state.gesture;
    if (!gesture || event.pointerId !== gesture.pointerId) return;
    const object = state.objects.find(item => item.id === gesture.id), p = point(state, event), original = gesture.original;
    if (!object) return;
    event.preventDefault();
    if (gesture.kind === 'drag') { object.x = original.x + p.x - gesture.start.x; object.y = original.y + p.y - gesture.start.y; constrain(state, object); }
    else if (gesture.kind === 'rotate') {
      let angle = original.rotation + Math.atan2(p.y - original.y, p.x - original.x) - gesture.startAngle;
      if (event.shiftKey) angle = Math.round(angle / (Math.PI / 12)) * Math.PI / 12;
      object.rotation = normalize(angle);
    } else {
      const vector = rotate(p.x - gesture.anchor.x, p.y - gesture.anchor.y, -original.rotation), dx = gesture.sx * original.width, dy = gesture.sy * original.height;
      const projected = (vector.x * dx + vector.y * dy) / (dx * dx + dy * dy || 1);
      const factor = Math.max(original.defaultWidth * .1 / original.width, Math.min(original.defaultWidth * 5 / original.width, projected));
      object.width = original.width * factor; object.height = original.height * factor;
      const offset = rotate(dx * factor / 2, dy * factor / 2, original.rotation);
      object.x = gesture.anchor.x + offset.x; object.y = gesture.anchor.y + offset.y; constrain(state, object);
    }
    const node = state.objectLayer.querySelector('[data-object-id="' + object.id + '"]'); if (node) position(state, node, object);
    renderSelection(state);
  }
  function endGesture(state, event, cancel = false) {
    const gesture = state.gesture;
    if (!gesture || event.pointerId !== gesture.pointerId) return;
    state.gesture = null;
    if (state.stage.hasPointerCapture?.(gesture.pointerId)) state.stage.releasePointerCapture(gesture.pointerId);
    if (cancel) { const object = state.objects.find(item => item.id === gesture.id); if (object) Object.assign(object, gesture.original); }
    else commit(state);
    renderObjects(state);
  }
  function commit(state) {
    const latest = state.history.at(-1);
    if (JSON.stringify(latest?.objects) === JSON.stringify(state.objects)) return;
    state.history.push({ objects: cloneObjects(state.objects), selected: state.selected });
    if (state.history.length > 120) state.history.shift();
  }
  function undoChange(state) {
    if (state.gesture || state.history.length < 2) return;
    state.history.pop(); const previous = state.history.at(-1);
    state.objects = cloneObjects(previous.objects); state.selected = previous.selected;
    renderObjects(state); tell(state, '已撤销上一步预览操作');
  }
  function removeSelected(state) {
    if (!state.selected || state.gesture) return;
    state.objects = state.objects.filter(object => object.id !== state.selected); state.selected = null;
    commit(state); renderObjects(state); state.stage.focus({ preventScroll: true }); tell(state, '已删除选中的辅助线');
  }
  function installEvents(state) {
    const options = { signal: state.events.signal };
    state.dialog.addEventListener('cancel', event => { event.preventDefault(); close(); }, options);
    state.dialog.addEventListener('close', close, options);
    state.dialog.addEventListener('click', event => {
      if (event.target !== state.dialog) return;
      const r = state.dialog.getBoundingClientRect();
      if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) close();
    }, options);
    state.stage.addEventListener('pointerdown', event => {
      if (event.target === state.stage || event.target === state.objectLayer || event.target.closest?.('.aglp-neutral-base')) { state.selected = null; renderSelection(state); }
    }, options);
    document.addEventListener('pointermove', event => moveGesture(state, event), options);
    document.addEventListener('pointerup', event => endGesture(state, event), options);
    document.addEventListener('pointercancel', event => endGesture(state, event, true), options);
    document.addEventListener('keydown', event => {
      if (current !== state || isTextInput(event.target)) return;
      if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); close(); return; }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') { event.preventDefault(); undoChange(state); return; }
      if (['Delete', 'Backspace'].includes(event.key)) { event.preventDefault(); removeSelected(state); return; }
      const object = selected(state);
      if (!object || state.gesture || !['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key) || !state.stage.contains(event.target)) return;
      event.preventDefault(); const step = event.shiftKey ? 10 : 1;
      object.x += event.key === 'ArrowRight' ? step : event.key === 'ArrowLeft' ? -step : 0;
      object.y += event.key === 'ArrowDown' ? step : event.key === 'ArrowUp' ? -step : 0;
      constrain(state, object); commit(state); renderObjects(state); state.stage.focus({ preventScroll: true });
    }, options);
    window.addEventListener('message', event => {
      const expected = window.__ADMIN_INLINE_ORIGIN__ || location.origin;
      if (event.source === parent && event.origin === expected && event.data?.type === 'admin-dialog-close') close();
    }, options);
  }
  return { open, close };
})();
