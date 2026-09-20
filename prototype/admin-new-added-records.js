/* Restore the observed recruitment record page without synthetic rows. */
'use strict';
window.AdminNewAddedRecords = (() => {
  const route = 'newAddedRecords';
  const validDate = value => /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value + 'T00:00:00Z')) && new Date(value + 'T00:00:00Z').toISOString().slice(0, 10) === value;
  function observation(source, query) {
    if (!validDate(query.start) || !validDate(query.end) || query.start > query.end) return null;
    return source.observations.find(item => query.start === item.date && query.end === item.date && Object.entries(item.filters).every(([key, value]) => query[key] === value)) || null;
  }
  function render() {
    const A = window.Admin, source = window.AdminNewAddedRecordSources?.[A.tenant];
    if (!source || A.route !== route || source.tenant !== A.tenant || source.route !== route) return false;
    const {node, button} = A;
    const root = node('div', 'page newadded-page');
    root.dataset.snapshotDate = source.defaultDate;
    root.title = '艺星深圳拉新记录 · 本地留存的页面快照';
    const form = node('form', 'newadded-filters');
    form.noValidate = true;
    const fields = node('div', 'newadded-filter-fields');
    const dateField = node('div', 'field required newadded-date-field');
    dateField.append(node('span', '', '拉新时间'));
    const dateBox = node('div', 'source-filter-range newadded-date-control');
    dateBox.dataset.filterGroup = '拉新时间';
    const start = node('input'), end = node('input');
    for (const [input, label, edge] of [[start, '开始日期', 'start'], [end, '结束日期', 'end']]) {
      input.type = 'date'; input.value = source.defaultDate; input.required = true;
      input.setAttribute('aria-label', label); input.dataset.rangeEdge = edge;
      input.dataset.filter = label;
    }
    dateBox.append(start, node('span', 'source-range-separator', '至'), end);
    dateField.append(dateBox); fields.append(dateField);
    function selector(label, choices, kind, required = false, complete = true) {
      const field = node('label', 'field newadded-' + kind + '-field' + (required ? ' required' : ''));
      const select = node('select'); select.setAttribute('aria-label', label); select.dataset.filter = kind;
      choices.forEach(({value, label: text}) => select.append(new Option(text, value)));
      const control = A.searchableSelect(select, label);
      control.classList.add('newadded-select');
      control.dataset.popupMinWidth = kind === 'account' ? '240' : '120';
      if (!complete) {
        control.dataset.optionsCapture = 'partial';
        control.title = '当前只展示已采集的选项';
      }
      field.append(node('span', '', label), control); fields.append(field);
      return select;
    }
    const account = selector('微信号', source.accountOptions, 'account', true, source.accountOptionsComplete);
    const repeated = selector('重复添加', source.repeatedOptions, 'repeated', false, source.repeatedOptionsComplete);
    const friend = selector('好友状态', source.friendOptions, 'friend', false, source.friendOptionsComplete);
    const actions = node('div', 'newadded-actions');
    const search = button('查询', () => {}, 'primary'); search.type = 'submit'; search.onclick = null;
    const reset = button('重置', resetQuery), exportButton = button('导出表格', exportEmpty, 'newadded-export');
    reset.querySelector('.button-icon')?.remove();
    actions.append(search, reset, exportButton);
    const error = node('p', 'filter-error'); error.hidden = true; error.setAttribute('role', 'alert');
    form.append(fields, actions, error);
    const results = node('section', 'newadded-results'); results.setAttribute('aria-label', '拉新记录');
    const wrap = node('div', 'newadded-table-wrap');
    const table = node('table', 'newadded-table'), colgroup = node('colgroup'), head = node('thead'), header = node('tr');
    for (const column of source.columns) {
      const col = node('col'); col.style.width = column.width + 'px'; colgroup.append(col);
      const th = node('th', '', column.label); th.scope = 'col'; header.append(th);
    }
    table.style.minWidth = source.columns.reduce((sum, column) => sum + column.width, 0) + 'px';
    head.append(header); table.append(colgroup, head, node('tbody'));
    const status = node('div', 'newadded-empty', '暂无数据'); status.setAttribute('role', 'status');
    wrap.append(table, status); results.append(wrap);
    const pager = node('div', 'newadded-pager');
    const pageSize = node('select'); pageSize.setAttribute('aria-label', '每页条数');
    [20, 50, 100].forEach(size => pageSize.append(new Option(size + '条/页', String(size))));
    const prev = button('‹', () => {}), current = button('1', () => {}, 'selected'), next = button('›', () => {});
    prev.setAttribute('aria-label', '上一页'); next.setAttribute('aria-label', '下一页'); prev.disabled = next.disabled = true;
    const total = node('span', 'newadded-total', '共 0 条');
    pager.append(A.searchableSelect(pageSize, '每页条数'), prev, current, next, total);
    root.append(form, results, pager); A.$('app').replaceChildren(root);
    window.AdminFilterCalendars?.enhance(form);
    let submitted;
    function queryValue() { return {start: start.value.trim(), end: end.value.trim(), account: account.value, repeated: repeated.value, friend: friend.value}; }
    function paint() {
      const item = observation(source, submitted);
      results.dataset.state = item?.state || 'not-captured';
      if (item) {
        status.textContent = '暂无数据'; total.textContent = '共 0 条';
        results.dataset.observation = item.source; exportButton.disabled = false; pager.hidden = false;
      } else {
        status.textContent = '当前筛选条件暂无已采集的页面样本';
        results.removeAttribute('data-observation'); exportButton.disabled = true; pager.hidden = true;
      }
    }
    function submit() {
      const query = queryValue();
      const message = !validDate(query.start) || !validDate(query.end) ? '请选择完整、有效的拉新时间' : query.start > query.end ? '开始日期不能晚于结束日期' : '';
      error.hidden = !message; error.textContent = message;
      if (message) return;
      window.AdminFilterCalendars?.close(); submitted = query; paint();
    }
    function resetQuery() {
      window.AdminFilterCalendars?.close(); start.value = end.value = source.defaultDate;
      [account, repeated, friend].forEach(select => { select.value = ''; select.dispatchEvent(new Event('change', {bubbles: true})); });
      error.hidden = true; submit();
    }
    function exportEmpty() {
      if (!submitted || !observation(source, submitted)) return;
      const csv = '\ufeff' + source.columns.map(column => '"' + column.label.replaceAll('"', '""') + '"').join(',') + '\r\n';
      const url = URL.createObjectURL(new Blob([csv], {type: 'text/csv;charset=utf-8'})), link = node('a');
      link.href = url; link.download = A.tenant + '-拉新记录-' + submitted.start + '.csv'; link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000); A.toast('已导出 0 条拉新记录');
    }
    form.onsubmit = event => { event.preventDefault(); submit(); };
    submitted = queryValue(); paint(); return true;
  }
  const previous = window.AdminViews;
  window.AdminViews = {...previous, render() { return render() || previous?.render?.(); }};
  return {render, observation, validDate};
})();
