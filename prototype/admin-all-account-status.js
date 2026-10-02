/* Read-only rendering of the captured platform account status page. */
'use strict';
window.AdminAllAccountStatus = (() => {
  // Fixture completeness is a development contract, never an account type or
  // a customer-facing collection state. Check before replacing the current UI.
  function validateData(data = window.AdminAllAccountStatusData) {
    const issues = [];
    const warnings = [];
    if (!Array.isArray(data?.wechat)) return {valid: false, issues: ['wechat must be an array'], warnings};
    data.wechat.forEach((row, rowIndex) => {
      for (const kind of ['online', 'offline']) {
        const names = row?.[kind];
        const types = row?.accountTypes?.[kind] ?? (Array.isArray(names) && names.length === 0 ? [] : null);
        if (!Array.isArray(names) || !Array.isArray(types) || names.length !== types.length) {
          issues.push(`wechat[${rowIndex}].${kind}: account names and types must have matching lengths`);
          continue;
        }
        for (let index = 0; index < names.length; index++) {
          if (types[index] !== 'wx' && types[index] !== 'qw') issues.push(`wechat[${rowIndex}].accountTypes.${kind}[${index}]: expected wx or qw`);
        }
      }
      if (!Array.isArray(row?.counts) || row.counts.length !== 3 || Array.from(row.counts).some(value => !Number.isInteger(value) || value < 0)) {
        issues.push(`wechat[${rowIndex}].counts: expected three non-negative integers`);
      } else if (Array.isArray(row.online) && Array.isArray(row.offline)) {
        const listedCounts = [row.online.length + row.offline.length, row.online.length, row.offline.length];
        if (listedCounts.some((value, index) => value !== row.counts[index])) warnings.push(`wechat[${rowIndex}]: source totals and account list counts differ; source totals are preserved`);
      }
    });
    return {valid: issues.length === 0, issues, warnings};
  }

  function readFailure(A) {
    const app = A.$('app');
    // A failed refresh must keep the last valid page and its scroll/tab state.
    if (app.querySelector('.account-status-live')) return false;
    if (!app.querySelector('[data-account-status-error]')) {
      const error = A.node('div', 'error-card');
      error.dataset.accountStatusError = '';
      error.append(A.node('h2', '', '页面读取失败'), A.node('p', '', '请重新加载本地页面。'), A.button('重试', () => location.reload(), 'primary'));
      app.replaceChildren(error);
    }
    return false;
  }

  function render() {
    const A = window.Admin;
    const sourceData = window.AdminAllAccountStatusData;
    if (!A || A.route !== 'allWeChatStatus' || A.tenant !== 'bzds') return false;
    if (sourceData?.tenant !== A.tenant || !Array.isArray(sourceData.wechat) || !Array.isArray(sourceData.proxy)) {
      console.error('[AdminAllAccountStatus] Invalid local account-status fixture; rendering skipped.');
      return readFailure(A);
    }
    const validation = validateData(sourceData);
    if (!validation.valid) {
      console.error('[AdminAllAccountStatus] Invalid local account-type fixture; rendering skipped.', validation.issues);
      return readFailure(A);
    }
    if (validation.warnings.length) console.warn('[AdminAllAccountStatus] Local snapshot count diagnostics.', validation.warnings);
    // The last successful page stays usable if a later local-data reload fails.
    const data = structuredClone(sourceData);

    const {node} = A;
    const root = node('div', 'page source-all-account-status account-status-live');
    root.dataset.capturedAt = data.capturedAt || '';
    const tabs = node('div', 'account-status-tabs');
    tabs.setAttribute('role', 'tablist');
    tabs.setAttribute('aria-label', '账号类型');
    const panel = node('section', 'account-status-panel');
    panel.id = 'account-status-panel';
    panel.setAttribute('role', 'tabpanel');
    let current = 0;
    let order = 0;
    const scrollPositions = [0, 0];
    let releaseScroll = () => {};

    function scrollbar(wrap, headerHeight = 0) {
      releaseScroll();
      const rail = node('div', 'account-status-scrollbar');
      const thumb = node('div', 'account-status-scrollbar-thumb');
      rail.style.top = headerHeight + 'px';
      rail.setAttribute('aria-hidden', 'true');
      rail.append(thumb);
      panel.append(rail);
      const update = () => {
        const range = wrap.scrollHeight - wrap.clientHeight;
        rail.hidden = range <= 1;
        const height = Math.max(24, rail.clientHeight * wrap.clientHeight / wrap.scrollHeight);
        thumb.style.height = height + 'px';
        thumb.style.transform = `translateY(${range > 0 ? wrap.scrollTop / range * (rail.clientHeight - height) : 0}px)`;
      };
      const observer = new ResizeObserver(update);
      observer.observe(wrap);
      observer.observe(wrap.firstElementChild);
      wrap.addEventListener('scroll', update, {passive: true});
      let drag;
      thumb.onpointerdown = event => {
        drag = {y: event.clientY, top: wrap.scrollTop};
        thumb.setPointerCapture(event.pointerId);
        event.preventDefault();
      };
      thumb.onpointermove = event => {
        if (!drag) return;
        const travel = rail.clientHeight - thumb.offsetHeight;
        if (travel > 0) wrap.scrollTop = drag.top + (event.clientY - drag.y) / travel * (wrap.scrollHeight - wrap.clientHeight);
      };
      thumb.onpointerup = thumb.onpointercancel = () => { drag = null; };
      rail.onpointerdown = event => {
        if (event.target === thumb) return;
        const travel = rail.clientHeight - thumb.offsetHeight;
        if (travel > 0) wrap.scrollTop = (event.clientY - rail.getBoundingClientRect().top - thumb.offsetHeight / 2) / travel * (wrap.scrollHeight - wrap.clientHeight);
      };
      releaseScroll = () => { observer.disconnect(); wrap.removeEventListener('scroll', update); rail.remove(); };
      requestAnimationFrame(update);
    }

    function badge(value, kind) {
      return node('span', 'account-status-badge account-status-badge-' + kind, String(value));
    }

    function accountGroups(row) {
      const groups = {wx: {online: [], offline: []}, qw: {online: [], offline: []}};
      for (const kind of ['online', 'offline']) {
        row[kind].forEach((name, index) => {
          const type = row.accountTypes[kind][index];
          groups[type][kind].push(name);
        });
      }
      const count = group => [group.online.length + group.offline.length, group.online.length, group.offline.length];
      return {groups, count};
    }

    function accountStatistics(row, classification) {
      const cell = node('div', 'account-status-cell account-status-statistics');
      const grid = node('div', 'account-status-stat-grid');
      grid.setAttribute('role', 'table');
      grid.setAttribute('aria-label', (row.environment || '未命名环境') + '账号统计');
      const headings = node('div', 'account-status-stat-row account-status-stat-head');
      headings.setAttribute('role', 'row');
      for (const label of ['类型', '总数', '在线', '掉线']) {
        const heading = node('span', '', label);
        heading.setAttribute('role', 'columnheader');
        headings.append(heading);
      }
      grid.append(headings);
      const {groups, count} = classification;
      const appendCounts = (type, label, values) => {
        const line = node('div', 'account-status-stat-row' + (type === 'total' ? ' account-status-stat-summary' : ''));
        line.dataset.accountType = type;
        line.setAttribute('role', 'row');
        const name = node('span', 'account-status-stat-label', label);
        name.setAttribute('role', 'rowheader');
        line.append(name);
        values.forEach((value, index) => {
          const item = badge(value, ['total', 'online', 'offline'][index]);
          item.setAttribute('role', 'cell');
          item.setAttribute('aria-label', label + '，' + ['总数', '在线', '掉线'][index] + ' ' + value);
          line.append(item);
        });
        grid.append(line);
      };
      for (const [type, label] of [['wx', '个微'], ['qw', '企微']]) {
        appendCounts(type, label, count(groups[type]));
      }
      appendCounts('total', '汇总', row.counts);
      cell.append(grid);
      return cell;
    }

    function accountList(kind, classification) {
      const cell = node('div', 'account-status-cell account-status-account-groups');
      const {groups} = classification;
      for (const [type, label] of [['wx', '个微'], ['qw', '企微']]) {
        const names = groups[type][kind];
        const group = node('div', 'account-status-account-group');
        group.dataset.accountType = type;
        const title = node('div', 'account-status-group-heading');
        title.append(node('span', '', label));
        title.append(node('span', 'account-status-group-count', String(names.length)));
        group.append(title);
        const badges = node('div', 'account-status-badges account-status-name-badges');
        for (const name of names) badges.append(badge(name, kind));
        if (!names.length) badges.append(node('span', 'account-status-empty-group', '无账号'));
        group.append(badges);
        cell.append(group);
      }
      return cell;
    }

    function drawWechat() {
      const wrap = node('div', 'account-status-table-scroll');
      const table = node('table', 'account-status-table');
      const colgroup = node('colgroup');
      for (let i = 0; i < 4; i++) colgroup.append(node('col'));
      const head = node('thead');
      const header = node('tr');
      ['环境名称', '账号统计', '在线帐号', '掉线帐号'].forEach((label, index) => {
        const th = node('th');
        th.scope = 'col';
        const cell = node('div', 'account-status-cell');
        if (index === 0) {
          th.setAttribute('aria-sort', order === 1 ? 'ascending' : order === 2 ? 'descending' : 'none');
          const sort = node('button', 'account-status-sort');
          sort.type = 'button';
          sort.append(node('span', '', label));
          const arrows = node('span', 'account-status-sort-arrows');
          arrows.setAttribute('aria-hidden', 'true');
          const ascending = node('i', 'account-status-sort-up' + (order === 1 ? ' active' : ''));
          const descending = node('i', 'account-status-sort-down' + (order === 2 ? ' active' : ''));
          arrows.append(ascending, descending);
          sort.append(arrows);
          sort.setAttribute('aria-label', '环境名称，' + (order === 1 ? '升序' : order === 2 ? '降序' : '原始顺序') + '，点击切换排序');
          const setOrder = next => {
            order = next;
            releaseScroll();
            panel.replaceChildren();
            drawWechat();
            panel.querySelector('.account-status-sort')?.focus({preventScroll: true});
          };
          sort.onclick = () => setOrder(order === 0 ? 1 : order === 1 ? 2 : 0);
          ascending.onclick = event => { event.stopPropagation(); setOrder(order === 1 ? 0 : 1); };
          descending.onclick = event => { event.stopPropagation(); setOrder(order === 2 ? 0 : 2); };
          cell.append(sort);
        } else cell.textContent = label;
        th.append(cell);
        header.append(th);
      });
      head.append(header);
      const body = node('tbody');
      const rows = data.wechat.map((row, index) => ({row, index}));
      if (order) rows.sort((a, b) => ((a.row.environment < b.row.environment ? -1 : a.row.environment > b.row.environment ? 1 : 0) * (order === 1 ? 1 : -1)) || a.index - b.index);
      for (const {row} of rows) {
        const classification = accountGroups(row);
        const tr = node('tr');
        const environment = node('td');
        environment.append(node('div', 'account-status-cell', row.environment));
        const counts = node('td');
        counts.append(accountStatistics(row, classification));
        tr.append(environment, counts);
        for (const kind of ['online', 'offline']) {
          const td = node('td');
          td.append(accountList(kind, classification));
          tr.append(td);
        }
        body.append(tr);
      }
      table.append(colgroup, head, body);
      wrap.append(table);
      panel.append(wrap);
      scrollbar(wrap, 40);
    }

    function drawProxy() {
      const scroll = node('div', 'account-status-proxy-scroll');
      const cards = node('div', 'account-status-proxy-grid');
      for (const row of data.proxy) {
        const card = node('article', 'account-status-proxy-card');
        const name = node('div', 'account-status-proxy-name', row.name);
        name.title = row.name;
        const counts = node('div', 'account-status-proxy-counts');
        for (const kind of ['online', 'offline']) {
          const count = node('span', 'account-status-proxy-count');
          count.setAttribute('aria-label', (kind === 'online' ? '在线' : '掉线') + ' ' + row[kind]);
          const dot = node('i', 'account-status-dot account-status-dot-' + kind);
          dot.setAttribute('aria-hidden', 'true');
          count.append(dot, node('span', '', String(row[kind])));
          counts.append(count);
        }
        card.append(name, counts);
        cards.append(card);
      }
      scroll.append(cards);
      panel.append(scroll);
      scrollbar(scroll);
    }

    function select(index, focus = false) {
      if (current === index && panel.firstElementChild) return;
      const previousScroll = panel.querySelector('.account-status-table-scroll,.account-status-proxy-scroll');
      if (previousScroll) scrollPositions[current] = previousScroll.scrollTop;
      current = index;
      tabButtons.forEach((tab, i) => {
        tab.classList.toggle('selected', i === current);
        tab.setAttribute('aria-selected', String(i === current));
        tab.tabIndex = i === current ? 0 : -1;
      });
      panel.setAttribute('aria-labelledby', tabButtons[current].id);
      releaseScroll();
      panel.replaceChildren();
      current === 0 ? drawWechat() : drawProxy();
      panel.querySelector('.account-status-table-scroll,.account-status-proxy-scroll').scrollTop = scrollPositions[current];
      if (focus) tabButtons[current].focus();
    }

    const tabButtons = ['微信账号', '代理账号'].map((label, index) => {
      const tab = node('button', 'account-status-tab', label);
      tab.type = 'button';
      tab.id = 'account-status-tab-' + index;
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-controls', panel.id);
      tab.onclick = () => select(index);
      tab.onkeydown = event => {
        let next;
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') next = 1 - current;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = 1;
        else return;
        event.preventDefault();
        select(next, true);
      };
      tabs.append(tab);
      return tab;
    });

    root.append(tabs, panel);
    A.$('app').replaceChildren(root);
    select(0);
    return true;
  }
  return {render, validateData};
})();
