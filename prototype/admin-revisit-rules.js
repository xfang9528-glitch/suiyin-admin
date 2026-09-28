/* SPEC-SUIYIN-ADMIN-071: isolated, synthetic, browser-only revisit rule editor. */
(function () {
  'use strict';
  const clone = value => JSON.parse(JSON.stringify(value));
  const el = (tag, cls, text) => { const node = document.createElement(tag); if (cls) node.className = cls; if (text !== undefined) node.textContent = text; return node; };
  const btn = (text, action, cls = '') => { const node = el('button', cls, text); node.type = 'button'; node.onclick = action; return node; };
  const select = (items, value, label, change) => { const node = el('select'); node.setAttribute('aria-label', label); items.forEach(item => node.add(new Option(item.label, item.value))); node.value = value; node.onchange = () => change(node.value); return node; };
  const input = (type, value, label, change) => { const node = el('input'); node.type = type; node.value = value ?? ''; node.setAttribute('aria-label', label); node.oninput = () => change(node.value); return node; };
  const check = (text, checked, change, disabled = false) => { const label = el('label', 'rr-check'); const node = el('input'); node.type = 'checkbox'; node.checked = checked; node.disabled = disabled; node.onchange = () => change(node.checked); label.append(node, el('span', '', text)); return label; };

  function mount(tenant, route) {
    if (route !== 'revisitRules') return false;
    const registry = window.RevisitRuleModel;
    if (!registry?.supportedTenants?.some(item => item.id === tenant)) return false;
    const app = document.getElementById('app');
    const M = registry.forTenant(tenant);
    app.classList.add('rr-root');
    document.body.classList.add('rr-page-active');
    app.setAttribute('aria-busy', 'false');
    document.body.dataset.contentReady = 'true';
    if (!M) { app.replaceChildren(el('div', 'rr-error', '回访规则未能载入，请刷新后重试。')); return true; }
    document.title = '回访规则 · ' + M.tenantLabel;

    const prefix = new URLSearchParams(location.search).get('qa') === '1' ? 'admin-qa-' : '';
    const key = prefix + 'admin-revisit-rules:v2:' + tenant;
    const legacyKey = prefix + 'admin-revisit-rules:v1:' + tenant;
    const accounts = M.groups.flatMap(group => group.accounts.map(account => ({ ...account, groupId: group.id })));
    let rules = [], draft = null, mode = 'list', filterText = '', filterState = 'all', storageError = '', scopeGroup = M.groups[0]?.id;
    let main, summaryPanel, formError, saveButton, scopeContent, nodeHost, nodeTabs, selectedNodeId;
    let migrationPending = false, legacyRules = [], legacyError = '', scopeSummary;
    let submitLock = false;
    const toast = text => window.Admin?.toast ? window.Admin.toast(text) : (() => { const n = el('div', 'rr-toast', text); document.body.append(n); setTimeout(() => n.remove(), 3500); })();
    const closeDialog = () => window.Admin.closeDialog();
    const dialog = (title, content, buttons) => window.Admin.showDialog(title, content, buttons || [{ label: '关闭', run: closeDialog }]);
    const field = (title, control, hint, required = false) => { const node = el('label', 'rr-field' + (required ? ' rr-required' : '')); node.append(el('span', 'rr-label', title), control); if (hint) node.append(el('small', 'rr-muted', hint)); return node; };
    const chip = text => el('span', 'rr-chip', text);
    const nameOf = id => accounts.find(account => account.id === id)?.name || '失效账号（' + id + '）';
    const groupOf = id => M.groups.find(group => group.id === id)?.name || '失效群组（' + id + '）';
    const idsInScope = rule => [...new Set([...(rule.scope.accountIds || []), ...M.groups.filter(group => rule.scope.groupIds.includes(group.id)).flatMap(group => group.accounts.map(account => account.id))])];
    const safeSummary = rule => { try { return M.summary(rule); } catch (_) { return { scope: '请检查账号范围', anchor: '基准待完善', nodes: '节点待完善', schedule: '时间待完善' }; } };
    const activeNode = () => draft?.nodes.find(node => node.id === selectedNodeId) || draft?.nodes[0];
    const nodeLabel = node => node.day === '' ? '待设时间' : '第 ' + node.day + ' 天';
    const sortedNodes = nodes => [...nodes].sort((a, b) => (a.day === '' ? Infinity : Number(a.day)) - (b.day === '' ? Infinity : Number(b.day)));
    const validConditions = value => Array.isArray(value) && value.every(condition => condition && typeof condition.field === 'string' && typeof condition.op === 'string' && Array.isArray(condition.values));

    function isStoredShape(value) {
      return Array.isArray(value) && value.every(rule => rule && typeof rule.id === 'string' && typeof rule.name === 'string' && typeof rule.purpose === 'string' && typeof rule.enabled === 'boolean' && typeof rule.runAt === 'string' && typeof rule.anchor === 'string' && rule.scope && Array.isArray(rule.scope.groupIds) && Array.isArray(rule.scope.accountIds) && Array.isArray(rule.nodes) && rule.nodes.length && rule.nodes.every(node => node && typeof node.id === 'string' && typeof node.day === 'string' && typeof node.note === 'string' && validConditions(node.include) && validConditions(node.exclude)) && new Set(rule.nodes.map(node => node.id)).size === rule.nodes.length) && new Set(value.map(rule => rule.id)).size === value.length;
    }
    function read() {
      try {
        const saved = localStorage.getItem(key);
        const legacy = localStorage.getItem(legacyKey); legacyRules = []; legacyError = '';
        if (legacy !== null) { try { const value = JSON.parse(legacy); if (!Array.isArray(value)) throw Error('invalid'); legacyRules = value; } catch (_) { legacyError = '旧版规则无法解析，原始数据仍保留。可以开始新版示例，但不能自动导入。'; } }
        migrationPending = saved === null && legacy !== null;
        if (saved === null) rules = migrationPending ? [] : M.seedRules();
        else { const parsed = JSON.parse(saved); if (!isStoredShape(parsed)) throw new Error('invalid'); rules = parsed; }
        storageError = '';
      } catch (_) { storageError = '本页保存的数据暂时无法读取。原数据已保留，请重试，或明确恢复本页示例。'; }
    }
    function persist(next) {
      try { localStorage.setItem(key, JSON.stringify(next)); rules = next; storageError = ''; migrationPending = false; return true; }
      catch (_) { toast('保存失败，原规则未改变。请检查浏览器存储后重试。'); return false; }
    }
    function restore() {
      const content = el('div', 'rr-modal');
      content.append(el('p', '', '恢复后，将用一条包含第 3、5、7 天节点的示例替换本页新版规则。旧版规则与其他管理页面的数据保持不变。'));
      dialog('恢复本页示例', content, [{ label: '取消', run: closeDialog }, { label: '确认恢复', cls: 'primary', run: () => { if (persist(M.seedRules())) { closeDialog(); draft = null; mode = 'list'; renderList(); toast('已恢复本页示例'); } } }]);
    }
    function legacyDraft(source) {
      if (!source || typeof source.name !== 'string' || !source.scope || !Array.isArray(source.scope.groupIds) || !Array.isArray(source.scope.accountIds) || !validConditions(source.include) || !validConditions(source.exclude)) return { error: '旧规则结构不完整，不能无损导入。' };
      const candidates = source.include.filter(condition => condition.op === 'relative-day' && M.fields.some(field => field.id === condition.field && field.type === 'date'));
      if (candidates.length !== 1 || !/^\d+$/.test(String(candidates[0].value))) return { error: '需要且只能有一个明确的日期“第 N 天”条件，才能确定回访基准和节点；不会替你猜测或合并。' };
      const anchor = candidates[0], rule = M.emptyRule(), node = M.emptyNode();
      rule.name = source.name + ' · 导入'; rule.purpose = String(source.purpose || ''); rule.scope = clone(source.scope); rule.anchor = anchor.field; rule.runAt = source.runAt || '01:00'; rule.enabled = false;
      node.day = String(anchor.value); node.note = ''; node.include = clone(source.include.filter(condition => condition !== anchor)); node.exclude = clone(source.exclude); rule.nodes = [node];
      return { rule };
    }
    function viewLegacy() {
      const content = el('div', 'rr-modal rr-legacy'); content.append(el('p', 'rr-muted', '旧规则只读保留。逐条导入会创建一个未保存、未启用的新草稿，不会自动把旧规则合并。'));
      if (legacyError) content.append(el('p', 'rr-error-text', legacyError));
      legacyRules.forEach((source, index) => {
        const box = el('section', 'rr-legacy-item'); box.append(el('h3', '', source?.name || '旧规则 ' + (index + 1)), el('p', 'rr-muted', source?.purpose || '未填写目的'));
        const details = el('details'); details.append(el('summary', '', '查看旧规则配置'));
        const scope = source?.scope;
        const scopeText = scope && Array.isArray(scope.groupIds) && Array.isArray(scope.accountIds) ? [...scope.groupIds.map(id => groupOf(id) + '全部账号'), ...scope.accountIds.map(nameOf)].join('、') || '未选账号' : '账号范围格式无法识别';
        const describe = conditions => { if (!Array.isArray(conditions)) return '条件格式无法识别'; if (!conditions.length) return '未设置'; return conditions.map(condition => { try { return M.describeCondition(condition); } catch (_) { return '有一项条件无法识别，请保留旧数据核查'; } }).join('；'); };
        [['账号范围', scopeText], ['选中条件', describe(source?.include)], ['排除条件', describe(source?.exclude)], ['每日筛选', source?.runAt || '未设置'], ['旧版状态', source?.enabled ? '已启用（仅旧版本地状态）' : '未启用']].forEach(([label, value]) => { const row = el('p', 'rr-legacy-detail'); row.append(el('strong', '', label + '：'), document.createTextNode(String(value))); details.append(row); });
        box.append(details); const candidate = legacyDraft(source); if (candidate.error) box.append(el('p', 'rr-error-text', candidate.error)); else box.append(btn('导入为新草稿', () => { closeDialog(); edit(candidate.rule, true); }, 'primary')); content.append(box);
      });
      if (!legacyRules.length && !legacyError) content.append(el('p', '', '旧版没有保存的规则。'));
      dialog('查看旧版规则', content);
    }
    function help() {
      const content = el('div', 'rr-modal rr-help');
      [
        ['规则每天重新选人', '保存的是账号范围与筛选条件。每天到设定时刻，按当日条件判断谁应回访；每日筛选时间不是消息发送时间。'],
        ['两种时间分开设置', '“添加后第 3 天”决定今天选谁；“每天 01:00”决定何时筛选。示例以添加当天为第 0 天，按北京时间的自然日计算。'],
        ['选中与排除', '选中条件需全部满足，同一维度内多个选项满足任一即可；排除条件命中任一就排除。账号范围本身也是选中条件，可以只选账号再设置排除。'],
        ['近期消息的演示口径', '近 2 天按运行时刻向前 48 小时演示；计入成功的普通、群发及手机同步消息，系统或失败消息不计。实际上线口径仍待确认。'],
        ['账号群组与账号', '群组和单独账号取并集；勾选群组即覆盖该组所有演示账号。如只需部分账号，先取消群组，再选择账号。长期群组成员变化的业务口径另行确认。'],
        ['一条规则，多个节点', '名称、目的、账号范围、回访基准和每日时间共用；第 3、5、7 天等节点分别设置选中与排除。节点只在各自到期时判断，不要求先完成上一节点。'],
        ['复制节点条件', '在目标节点选择来源节点，只替换选中与排除，不改变目标的第几天、说明或共享设置；确认后也只进入草稿。后续改动互不联动，保存整条规则才生效。'],
        ['销售可见范围', '筛出的好友只对有其所属账号接待权限的销售可见。规则本身不授予权限；多人都有权限时均可见，执行和完成状态另行设计。'],
        ['本地演示', '本页仅使用当前租户的合成账号、人员、地区选项与好友，通用医美选项用于演示，不代表门店实际标签库。规则按租户分别保存在当前浏览器；切换租户不会复制规则。不连接真实客户、不运行定时任务，也不发送消息。示例人数不代表真实业务人数。']
      ].forEach(([title, text]) => { content.append(el('h3', '', title), el('p', '', text)); });
      dialog('回访规则说明', content);
    }
    function header(title, subtitle, actions) {
      const node = el('header', 'rr-page-head'); const text = el('div'); const line = el('div', 'rr-title-line');
      line.append(el('h1', '', title), el('span', 'rr-demo', '本地演示')); text.append(line, el('p', 'rr-muted', subtitle));
      const right = el('div', 'rr-actions'); right.append(btn('规则说明', help, 'rr-text-button'), ...actions); node.append(text, right); return node;
    }
    function renderList() {
      mode = 'list'; draft = null;
      const create = btn('＋ 新建规则', () => edit(null), 'primary'); create.disabled = Boolean(storageError || migrationPending);
      app.replaceChildren(header('回访规则', '按账号群组配置规则，每天筛选当日应回访的好友。', [create]));
      if (storageError) {
        const error = el('div', 'rr-error'); error.setAttribute('role', 'alert'); error.append(el('p', '', storageError), btn('重新读取', () => { read(); renderList(); }), btn('恢复本页示例', restore)); app.append(error); return;
      }
      if (migrationPending) {
        const notice = el('section', 'rr-migration rr-card'); notice.append(el('h2', '', '规则已改为「一条规则，多个时间节点」'), el('p', 'rr-muted', '检测到旧版浏览器规则。旧数据会保留，请选择查看并逐条导入，或开始新版示例。不会自动合并旧规则。'));
        const actions = el('div', 'rr-actions'); actions.append(btn('查看旧规则 / 逐条导入', viewLegacy), btn('开始新版示例', () => { if (persist(M.seedRules())) renderList(); }, 'primary')); notice.append(actions); if (legacyError) notice.append(el('p', 'rr-error-text', legacyError)); app.append(notice); return;
      }
      const card = el('section', 'rr-card'); const toolbar = el('div', 'rr-list-toolbar');
      const search = input('search', filterText, '搜索回访规则', value => { filterText = value; renderRows(); }); search.placeholder = '搜索规则名称、目的'; search.className = 'rr-search';
      const state = select([{ label: '全部状态', value: 'all' }, { label: '已启用', value: 'on' }, { label: '未启用', value: 'off' }], filterState, '规则状态', value => { filterState = value; renderRows(); });
      toolbar.append(search, state, btn('重置', () => { filterText = ''; filterState = 'all'; renderList(); }), el('span', 'rr-spacer'), el('span', 'rr-muted', '一条规则可包含多个节点，节点条件独立设置'));
      main = el('div', 'rr-list-results'); card.append(toolbar, main); app.append(card);
      const foot = el('footer', 'rr-list-foot'); foot.append(el('span', 'rr-muted', '筛选结果按工作账号接待权限进入销售回访列表。')); if (legacyRules.length || legacyError) foot.append(btn('查看旧版规则', viewLegacy, 'rr-text-button')); foot.append(btn('恢复示例', restore, 'rr-text-button')); app.append(foot);
      renderRows();
    }
    function renderRows() {
      const visible = rules.filter(rule => (!filterText || (rule.name + ' ' + rule.purpose).toLowerCase().includes(filterText.toLowerCase())) && (filterState === 'all' || rule.enabled === (filterState === 'on')));
      main.replaceChildren();
      if (!visible.length) {
        const empty = el('div', 'rr-empty'); empty.append(el('div', 'rr-empty-symbol', '◷'), el('h3', '', rules.length ? '没有符合条件的规则' : '还没有回访规则'), el('p', 'rr-muted', rules.length ? '调整关键词或状态，查看其他规则。' : '先确定账号范围，再组合选中与排除条件。'), btn(rules.length ? '清空筛选' : '新建规则', () => rules.length ? (filterText = '', filterState = 'all', renderList()) : edit(null), 'primary')); main.append(empty); return;
      }
      const wrap = el('div', 'rr-table-wrap'); const table = el('table', 'rr-table'); const thead = el('thead'); const tr = el('tr');
      ['规则名称', '账号范围', '回访节点', '每天筛选', '状态', '操作'].forEach(title => tr.append(el('th', '', title))); thead.append(tr); table.append(thead);
      const tbody = el('tbody'); visible.forEach(rule => {
        const summary = safeSummary(rule), errors = M.validate(rule); const row = el('tr'); row.dataset.ruleId = rule.id;
        const name = el('td', 'rr-name-cell'); const nameButton = btn(rule.name, () => edit(rule), 'rr-rule-name'); name.append(nameButton, el('p', 'rr-muted', rule.purpose || '未填写回访目的'));
        const scope = el('td', 'rr-scope-cell'); scope.append(el('p', '', summary.scope), el('small', 'rr-muted', idsInScope(rule).length + ' 个账号'));
        const conditions = el('td', 'rr-condition-cell'); conditions.append(el('p', 'rr-anchor-label', summary.anchor)); const nodes = el('div', 'rr-node-chips'); sortedNodes(rule.nodes).forEach(node => nodes.append(btn(nodeLabel(node), () => edit(rule, false, node.id), 'rr-node-chip'))); conditions.append(nodes, el('small', 'rr-muted', rule.nodes.length + ' 个节点 · 分别设置选中与排除'));
        const run = el('td', 'rr-time-cell'); run.append(el('strong', 'rr-run-time', rule.runAt), el('small', 'rr-muted', '北京时间'));
        const state = el('td', 'rr-state-cell'); state.append(el('span', 'rr-status ' + (errors.length ? 'invalid' : rule.enabled ? 'enabled' : ''), errors.length ? '配置待检查' : rule.enabled ? '已启用' : '未启用')); if (rule.enabled && !errors.length) state.append(el('small', 'rr-next', '下次 ' + M.nextRun(rule)));
        const actions = el('td', 'rr-table-actions'); actions.append(btn('编辑', () => edit(rule), 'rr-text-button'), btn(rule.enabled ? '暂停' : '启用', () => toggle(rule), 'rr-text-button'), btn('试算', () => trial(rule), 'rr-text-button'));
        row.append(name, scope, conditions, run, state, actions); tbody.append(row);
      }); table.append(tbody); wrap.append(table); main.append(wrap, el('div', 'rr-result-count', '共 ' + visible.length + ' 条规则 · 已启用 ' + visible.filter(rule => rule.enabled).length + ' 条'));
    }
    function toggle(rule) {
      if (!rule.enabled) { const errors = M.validate(rule); if (errors.length) { const body = el('div', 'rr-modal'); body.append(el('p', '', '请完善以下配置后再启用：')); errors.forEach(error => body.append(el('p', 'rr-error-text', error))); dialog('暂时无法启用', body, [{ label: '取消', run: closeDialog }, { label: '编辑规则', cls: 'primary', run: () => { closeDialog(); edit(rule); } }]); return; } }
      const next = clone(rules); next.find(item => item.id === rule.id).enabled = !rule.enabled;
      if (persist(next)) { renderRows(); toast(rule.enabled ? '规则已暂停' : '规则已启用，将从下次计划时间开始筛选（本地演示）'); }
    }
    function edit(rule, imported = false, targetNodeId = null) {
      mode = imported ? 'import' : rule ? 'edit' : 'new'; draft = rule ? clone(rule) : M.emptyRule(); submitLock = false; selectedNodeId = targetNodeId || sortedNodes(draft.nodes)[0]?.id;
      scopeGroup = M.groups.find(group => draft.scope.groupIds.includes(group.id) || group.accounts.some(account => draft.scope.accountIds.includes(account.id)))?.id || M.groups[0]?.id;
      app.replaceChildren(header(imported ? '导入回访规则草稿' : rule ? '编辑回访规则' : '新建回访规则', '账号与运行设置共用；各时间节点分别配置选中和排除条件。', [btn('返回列表', cancel)]));
      const layout = el('div', 'rr-editor-layout'); const form = el('form', 'rr-editor-form'); form.noValidate = true; form.onsubmit = event => { event.preventDefault(); save(); };
      const base = section('规则设置', '以下设置对这条规则内的所有时间节点生效。', '01'); const grid = el('div', 'rr-two-fields');
      const name = input('text', draft.name, '规则名称', value => { draft.name = value; updateSummary(); }); name.maxLength = 60; name.placeholder = '例如：添加好友后回访'; name.id = 'rr-rule-name';
      const purpose = input('text', draft.purpose, '回访目的', value => { draft.purpose = value; updateSummary(); }); purpose.maxLength = 200; purpose.placeholder = '例如：了解新加好友需求，建立初次联系';
      grid.append(field('规则名称', name, '', true), field('回访目的', purpose)); base.body.append(grid);
      const shared = el('div', 'rr-shared-timing');
      const anchors = M.fields.filter(item => item.type === 'date' && item.include).map(item => ({ value: item.id, label: item.label }));
      const anchor = select(anchors, draft.anchor, '回访基准日期', value => { draft.anchor = value; updateSummary(); updateNodeTabs(); });
      const time = input('time', draft.runAt, '每天筛选时间', value => { draft.runAt = value; updateSummary(); }); time.required = true; time.className = 'rr-time-input';
      shared.append(field('回访基准', anchor, '', true), field('每天筛选时间', time, '', true), el('p', 'rr-muted', '基准当天为第 0 天 · 北京时间')); base.body.append(shared);
      const scope = el('details', 'rr-scope-fold'); scope.open = !draft.scope.groupIds.length && !draft.scope.accountIds.length; scopeSummary = el('summary'); scopeContent = el('div', 'rr-scope-expanded'); scope.append(scopeSummary, scopeContent); base.body.append(scope); form.append(base.node); renderScope();
      const nodes = section('回访节点', '同一规则内分别到期、分别筛选；可复制条件，再独立调整。', '02'); nodes.node.classList.add('rr-nodes-section');
      nodeTabs = el('div', 'rr-node-tabs'); nodeTabs.setAttribute('role', 'tablist'); nodeTabs.setAttribute('aria-label', '回访时间节点'); nodeHost = el('div', 'rr-node-editor'); nodes.body.append(nodeTabs, nodeHost); form.append(nodes.node);
      const aside = el('aside', 'rr-summary'); aside.append(el('h2', '', '规则摘要'), el('p', 'rr-muted', '保存前核对选人范围与时间。')); summaryPanel = el('div'); aside.append(summaryPanel);
      formError = el('div', 'rr-form-error'); formError.setAttribute('role', 'alert'); formError.hidden = true;
      saveButton = btn('保存整条规则', save, 'primary'); saveButton.id = 'rr-save'; const footer = el('div', 'rr-savebar'); footer.append(formError, el('div', 'rr-save-note', mode === 'edit' && draft.enabled ? '全部节点的修改将在下次筛选生效' : '所有节点一起保存，保存后再单独启用')); const actions = el('div', 'rr-actions'); actions.append(btn('取消', cancel), btn('查看示例试算', () => trial(draft)), saveButton); footer.append(actions);
      layout.append(form, aside); app.append(layout, footer); renderNode(); updateSummary(); window.scrollTo(0, 0); name.focus({ preventScroll: true });
    }
    function updateNodeTabs() {
      if (!nodeTabs || !draft) return; nodeTabs.replaceChildren();
      sortedNodes(draft.nodes).forEach(node => { const tab = btn(nodeLabel(node), () => { selectedNodeId = node.id; renderNode(); updateSummary(); }, 'rr-node-tab' + (node.id === selectedNodeId ? ' active' : '')); tab.dataset.nodeId = node.id; tab.setAttribute('role', 'tab'); tab.setAttribute('aria-selected', String(node.id === selectedNodeId)); const count = node.include.length + node.exclude.length; tab.append(el('small', '', count ? count + ' 条条件' : '仅按到期时间')); nodeTabs.append(tab); });
      const add = btn('＋ 新增节点', () => { const node = M.emptyNode(); draft.nodes.push(node); selectedNodeId = node.id; renderNode(); updateSummary(); nodeHost.querySelector('[aria-label="节点天数"]')?.focus(); }, 'rr-add-node'); nodeTabs.append(add);
    }
    function renderNode() {
      updateNodeTabs(); const node = activeNode(); if (!node) return; selectedNodeId = node.id; nodeHost.replaceChildren(); nodeHost.dataset.nodeId = node.id;
      const tools = el('div', 'rr-node-toolbar'); const title = el('div'); title.append(el('h3', '', nodeLabel(node) + '的回访条件'), el('p', 'rr-muted', '仅编辑当前节点，其他节点条件保持不变。')); const actions = el('div', 'rr-actions'); const copy = btn('复制其他节点条件', copyNode, 'rr-text-button'); copy.disabled = draft.nodes.length < 2; const remove = btn('移除节点', removeNode, 'rr-text-button rr-delete-node'); remove.disabled = draft.nodes.length <= 1; actions.append(copy, remove); tools.append(title, actions); nodeHost.append(tools);
      const meta = el('div', 'rr-node-meta'); const day = input('number', node.day, '节点天数', value => { node.day = value; updateNodeTabs(); updateSummary(); title.querySelector('h3').textContent = nodeLabel(node) + '的回访条件'; }); day.min = '0'; day.max = '36500'; day.step = '1'; day.placeholder = '填写天数';
      const dayWrap = el('div', 'rr-day-input'); dayWrap.append(el('span', '', '基准后第'), day, el('span', '', '天')); const note = input('text', node.note, '节点说明', value => { node.note = value; updateSummary(); }); note.placeholder = '例如：了解初步需求，可不填'; note.maxLength = 200; meta.append(field('回访时间点', dayWrap, '', true), field('节点说明', note)); nodeHost.append(meta);
      nodeHost.append(conditionSection('include'), conditionSection('exclude'));
    }
    function removeNode() {
      const target = activeNode(); if (draft.nodes.length <= 1) { toast('至少保留一个回访节点'); return; }
      const content = el('div', 'rr-modal'); content.append(el('p', '', '移除' + nodeLabel(target) + '及其选中、排除条件？只修改当前草稿，保存整条规则后才生效。'));
      dialog('移除回访节点', content, [{ label: '取消', run: closeDialog }, { label: '确认移除', run: () => { draft.nodes = draft.nodes.filter(node => node.id !== target.id); selectedNodeId = sortedNodes(draft.nodes)[0].id; closeDialog(); renderNode(); updateSummary(); } }]);
    }
    function copyNode() {
      const target = activeNode(), choices = sortedNodes(draft.nodes.filter(node => node.id !== target.id)); if (!choices.length) return;
      let sourceId = choices[0].id; const content = el('div', 'rr-modal'); const preview = el('div', 'rr-copy-preview');
      function update() { const source = draft.nodes.find(node => node.id === sourceId), summary = M.nodeSummary(source); preview.replaceChildren(el('p', '', '选中：' + summary.include), el('p', '', '排除：' + summary.exclude)); }
      const choose = select(choices.map(node => ({ value: node.id, label: nodeLabel(node) + (node.note ? ' · ' + node.note : '') })), sourceId, '复制来源节点', value => { sourceId = value; update(); });
      content.append(field('从哪个节点复制', choose), el('p', 'rr-copy-note', '仅替换当前节点的选中和排除；' + nodeLabel(target) + '、节点说明和规则共享设置保持不变。'));
      if (target.include.length || target.exclude.length) content.append(el('p', 'rr-copy-warning', '当前节点已有条件，确认后将替换这些条件。取消则全部保留。'));
      content.append(preview); update();
      dialog('复制其他节点条件', content, [{ label: '取消', run: closeDialog }, { label: target.include.length || target.exclude.length ? '确认替换条件' : '复制条件', cls: 'primary', run: () => { const source = draft.nodes.find(node => node.id === sourceId); const copied = M.copyNodeConditions(source, target); draft.nodes = draft.nodes.map(node => node.id === target.id ? copied : node); closeDialog(); renderNode(); updateSummary(); toast('条件已复制到' + nodeLabel(copied) + '草稿，后续修改互不影响'); } }]);
    }
    function section(title, description, number) { const node = el('section', 'rr-card rr-section'); const head = el('div', 'rr-section-head'); const text = el('div'); text.append(el('h2', '', title), el('p', 'rr-muted', description)); head.append(el('span', 'rr-step', number), text); const body = el('div', 'rr-section-body'); node.append(head, body); return { node, body }; }
    function renderScope() {
      scopeContent.replaceChildren(); const chosen = el('div', 'rr-chosen');
      if (scopeSummary) scopeSummary.replaceChildren(el('span', 'rr-label', '账号范围'), el('span', 'rr-scope-caption', safeSummary(draft).scope), el('span', 'rr-scope-change', '选择账号 ⌄'));
      draft.scope.groupIds.forEach(id => chosen.append(chip(groupOf(id) + ' · 全部账号'))); draft.scope.accountIds.forEach(id => chosen.append(chip(nameOf(id))));
      if (!chosen.childNodes.length) chosen.append(el('span', 'rr-muted', '请选择账号群组或工作账号'));
      chosen.append(el('span', 'rr-spacer'), el('span', 'rr-muted', '覆盖 ' + idsInScope(draft).length + ' 个账号'), btn('清空', () => { draft.scope = { groupIds: [], accountIds: [] }; renderScope(); updateSummary(); }, 'rr-text-button'));
      const picker = el('div', 'rr-account-picker'); const groups = el('div', 'rr-group-list'); groups.append(el('div', 'rr-picker-caption', '账号群组 / 渠道'));
      M.groups.forEach(group => { const row = el('div', 'rr-group-row' + (group.id === scopeGroup ? ' active' : '')); const c = check('', draft.scope.groupIds.includes(group.id), checked => { draft.scope.groupIds = checked ? [...draft.scope.groupIds, group.id] : draft.scope.groupIds.filter(id => id !== group.id); renderScope(); updateSummary(); }); c.querySelector('input').setAttribute('aria-label', '选择整个' + group.name + '群组'); const navigate = btn(group.name + '（' + group.accounts.length + '）', () => { scopeGroup = group.id; renderScope(); }, 'rr-group-name'); row.append(c, navigate, el('span', 'rr-group-arrow', '›')); groups.append(row); });
      const pane = el('div', 'rr-account-pane'); const group = M.groups.find(item => item.id === scopeGroup); const selectedGroup = draft.scope.groupIds.includes(scopeGroup); const search = input('search', '', '搜索当前群组账号', value => renderAccounts(value)); search.placeholder = '搜索当前群组账号'; search.className = 'rr-account-search';
      const list = el('div', 'rr-account-list'); const actions = el('div', 'rr-account-actions'); let searchValue = '';
      function visibleAccounts() { return (group?.accounts || []).filter(account => account.name.toLowerCase().includes(searchValue.toLowerCase())); }
      function renderAccounts(value) {
        searchValue = value; list.replaceChildren(); actions.replaceChildren(); const visible = visibleAccounts();
        const all = check('全选当前结果（' + visible.length + '）', visible.length > 0 && visible.every(account => selectedGroup || draft.scope.accountIds.includes(account.id)), checked => { const selected = new Set(draft.scope.accountIds); visible.forEach(account => checked ? selected.add(account.id) : selected.delete(account.id)); draft.scope.accountIds = [...selected]; renderAccounts(searchValue); updateChosen(); updateSummary(); }, selectedGroup || !visible.length); actions.append(all);
        if (!visible.length) list.append(el('div', 'rr-account-empty', '当前群组无匹配账号'));
        visible.forEach(account => list.append(check(account.name, selectedGroup || draft.scope.accountIds.includes(account.id), checked => { draft.scope.accountIds = checked ? [...draft.scope.accountIds, account.id] : draft.scope.accountIds.filter(id => id !== account.id); renderAccounts(searchValue); updateChosen(); updateSummary(); }, selectedGroup)));
      }
      function updateChosen() { const replacement = el('div', 'rr-chosen'); draft.scope.groupIds.forEach(id => replacement.append(chip(groupOf(id) + ' · 全部账号'))); draft.scope.accountIds.forEach(id => replacement.append(chip(nameOf(id)))); if (!replacement.childNodes.length) replacement.append(el('span', 'rr-muted', '请选择账号群组或工作账号')); replacement.append(el('span', 'rr-spacer'), el('span', 'rr-muted', '覆盖 ' + idsInScope(draft).length + ' 个账号'), btn('清空', () => { draft.scope = { groupIds: [], accountIds: [] }; renderScope(); updateSummary(); }, 'rr-text-button')); scopeContent.firstChild.replaceWith(replacement); }
      pane.append(search, actions, list); picker.append(groups, pane); scopeContent.append(chosen, picker, el('p', 'rr-note', selectedGroup ? '当前已选择整个群组。如只需部分账号，先取消左侧群组，再勾选右侧账号。' : '群组与单独账号取并集；切换群组、搜索或全选当前结果，都保留其他已选账号。')); renderAccounts('');
    }
    function conditionSection(side) {
      const include = side === 'include'; const sec = section(include ? '选中条件' : '排除条件', include ? '节点到期后，以下附加条件也需全部满足（且）。' : '节点到期后，以下任一条件命中（或）即排除。', include ? '且' : '或');
      const rows = el('div', 'rr-condition-rows'); const addRow = el('div', 'rr-add-condition');
      const available = M.fields.filter(item => item[side]);
      const choose = select([{ value: '', label: '＋ 添加' + (include ? '选中' : '排除') + '条件（' + available.length + ' 个维度）' }, ...available.map(item => ({ value: item.id, label: item.label }))], '', '添加' + (include ? '选中' : '排除') + '条件', value => {
        if (!value) return; const def = M.fields.find(item => item.id === value); activeNode()[side].push({ field: value, op: def.type === 'date' ? 'date-range' : def.type === 'days' ? 'within-days' : 'in', values: [], value: def.type === 'days' ? '2' : '', start: '', end: '', min: '', max: '' }); choose.value = ''; draw(); updateNodeTabs(); updateSummary(); rows.lastElementChild?.querySelector('input,select,summary')?.focus();
      }); addRow.append(choose); if (include) addRow.append(el('small', 'rr-muted', '第几天已在节点设置；日期筛选为附加限制'));
      function draw() { rows.replaceChildren(); if (!activeNode()[side].length) rows.append(el('div', 'rr-no-conditions', include ? '没有额外选中条件，按共享账号范围和当前节点到期时间筛选。' : '暂不排除任何好友。可按近期消息、状态等添加条件。')); activeNode()[side].forEach((condition, index) => rows.append(conditionRow(condition, side, index, draw))); }
      draw(); sec.body.append(rows, addRow); return sec.node;
    }
    function conditionRow(condition, side, index, redraw) {
      const row = el('div', 'rr-condition-row'); const def = M.fields.find(item => item.id === condition.field); row.dataset.conditionField = condition.field;
      row.append(el('span', 'rr-logic', index === 0 ? '当' : side === 'include' ? '且' : '或'), el('span', 'rr-condition-name', def?.label || '失效维度'));
      const values = el('div', 'rr-condition-values');
      if (!def) values.append(el('span', 'rr-error-text', '该维度不可用，请移除后重新选择。'));
      else if (def.type === 'date') {
        const ops = [{ value: 'relative-day', label: '回访日前第 N 天' }, { value: 'within-days', label: '近 N 天内' }, { value: 'relative-range', label: '回访日前天数范围' }, { value: 'date-range', label: '固定日期范围' }, { value: 'on', label: '指定日期' }];
        if (condition.field === 'added') ops[0].label = '添加后的第 N 天';
        values.append(select(ops, condition.op, def.label + '判断方式', value => { condition.op = value; condition.value = value === 'on' ? '' : '3'; condition.start = ''; condition.end = ''; condition.min = ''; condition.max = ''; redraw(); updateSummary(); }));
        if (condition.op === 'relative-range') {
          const first = input('number', condition.min, def.label + '最小天数', value => { condition.min = value; updateSummary(); }); first.min = '0'; first.placeholder = '起始'; const last = input('number', condition.max, def.label + '最大天数', value => { condition.max = value; updateSummary(); }); last.min = '0'; last.placeholder = '结束'; values.append(first, el('span', 'rr-muted', '至'), last, el('span', 'rr-unit', '天'));
        } else if (condition.op === 'date-range') {
          values.append(input('date', condition.start, def.label + '开始日期', value => { condition.start = value; updateSummary(); }), el('span', 'rr-muted', '至'), input('date', condition.end, def.label + '结束日期', value => { condition.end = value; updateSummary(); }));
        } else {
          const value = input(condition.op === 'on' ? 'date' : 'number', condition.value, def.label + (condition.op === 'on' ? '指定日期' : '天数'), value => { condition.value = value; updateSummary(); }); if (condition.op !== 'on') { value.min = condition.op === 'within-days' ? '1' : '0'; value.step = '1'; } values.append(value); if (condition.op !== 'on') values.append(el('span', 'rr-unit', '天'));
        }
      } else if (def.type === 'days') {
        const value = input('number', condition.value, def.label + '近几天', value => { condition.value = value; updateSummary(); }); value.min = '1'; value.step = '1'; values.append(el('span', '', '近'), value, el('span', '', '天内'));
        if (def.id === 'both') values.append(el('small', 'rr-muted', '双方都发过消息'));
      } else {
        const picker = el('details', 'rr-multi'); const summary = el('summary'); const display = () => summary.textContent = condition.values.length ? condition.values.map(value => def.type === 'account' ? nameOf(value) : value).join('、') : '请选择' + def.label; display();
        const options = el('div', 'rr-multi-options');
        function refreshOptions() {
          const choices = def.type === 'account' ? accounts.filter(account => idsInScope(draft).includes(account.id)).map(account => ({ value: account.id, label: account.name })) : def.options.map(option => ({ value: option, label: option }));
          options.replaceChildren();
          const search = input('search', '', '搜索' + def.label + '选项', value => { [...options.querySelectorAll('label')].forEach(label => { label.hidden = !label.textContent.toLowerCase().includes(value.toLowerCase()); }); }); search.placeholder = '搜索选项'; options.append(search);
          if (!choices.length) options.append(el('p', 'rr-muted', '请先选择账号范围'));
          choices.forEach(choice => options.append(check(choice.label, condition.values.includes(choice.value), checked => { condition.values = checked ? [...condition.values, choice.value] : condition.values.filter(value => value !== choice.value); display(); updateSummary(); })));
          const invalid = condition.values.filter(value => !choices.some(choice => choice.value === value)); invalid.forEach(value => options.append(check('已失效 / 超出范围：' + (def.type === 'account' ? nameOf(value) : value), true, checked => { if (!checked) { condition.values = condition.values.filter(item => item !== value); refreshOptions(); display(); updateSummary(); } })));
        }
        refreshOptions(); picker.addEventListener('toggle', () => { if (picker.open) refreshOptions(); });
        picker.append(summary, options); values.append(picker, el('small', 'rr-muted', '可多选，任一符合'));
      }
      const remove = btn('×', () => { activeNode()[side].splice(index, 1); redraw(); updateNodeTabs(); updateSummary(); }, 'rr-remove'); remove.setAttribute('aria-label', '移除' + (def?.label || '失效') + '条件'); row.append(values, remove); return row;
    }
    function updateSummary() {
      if (!summaryPanel || !draft) return; const summary = safeSummary(draft); summaryPanel.replaceChildren();
      if (scopeSummary) scopeSummary.replaceChildren(el('span', 'rr-label', '账号范围'), el('span', 'rr-scope-caption', summary.scope), el('span', 'rr-scope-change', '选择账号 ⌄'));
      summaryPanel.append(el('div', 'rr-summary-name', draft.name.trim() || '未命名规则'));
      if (draft.purpose) summaryPanel.append(el('p', 'rr-summary-purpose', draft.purpose));
      [['共享账号范围', summary.scope], ['共同回访基准', summary.anchor], ['每天筛选', draft.runAt ? draft.runAt + ' · 北京时间' : '请设置时间']].forEach(([title, value]) => { const item = el('div', 'rr-summary-item'); item.append(el('h3', '', title), el('p', '', value)); summaryPanel.append(item); });
      const overview = el('div', 'rr-summary-item rr-summary-nodes'); overview.append(el('h3', '', draft.nodes.length + ' 个回访节点'));
      sortedNodes(draft.nodes).forEach(node => { const summary = M.nodeSummary(node), row = el('div', 'rr-mini-node' + (node.id === selectedNodeId ? ' active' : '')); row.append(btn(nodeLabel(node), () => { selectedNodeId = node.id; renderNode(); updateSummary(); nodeHost.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }, 'rr-text-button'), el('p', '', node.note || summary.include), el('small', '', summary.exclude)); overview.append(row); }); summaryPanel.append(overview);
      const note = el('div', 'rr-summary-note'); note.append(el('strong', '', draft.enabled && mode === 'edit' ? '保持已启用' : '保存后未启用'), el('p', '', draft.enabled && mode === 'edit' ? '本次修改从下次计划筛选生效。' : '保存后，在规则列表中单独启用。')); summaryPanel.append(note, el('p', 'rr-permission-note', '销售仅能看到其有接待权限账号下的应回访好友。'));
    }
    function cancel() {
      const original = mode === 'edit' ? rules.find(rule => rule.id === draft.id) : null;
      if (original && JSON.stringify(original) === JSON.stringify(draft)) { renderList(); return; }
      const content = el('div', 'rr-modal'); content.append(el('p', '', '当前草稿尚未保存。离开后将丢弃本次修改，已保存规则保持不变。'));
      dialog('放弃本次编辑？', content, [{ label: '继续编辑', run: closeDialog }, { label: '放弃并返回', run: () => { closeDialog(); renderList(); } }]);
    }
    function save() {
      if (submitLock || !draft) return; const errors = M.validate(draft);
      formError.replaceChildren(); formError.hidden = !errors.length;
      if (errors.length) { errors.forEach(error => formError.append(el('div', '', error))); formError.scrollIntoView({ block: 'nearest' }); if (!draft.name.trim()) document.getElementById('rr-rule-name')?.focus(); return; }
      submitLock = true; saveButton.disabled = true;
      const saved = clone(draft); saved.name = saved.name.trim(); saved.purpose = saved.purpose.trim();
      saved.nodes = sortedNodes(saved.nodes);
      if (mode !== 'edit') { saved.id = 'rr-' + crypto.randomUUID(); saved.enabled = false; }
      const next = mode === 'edit' ? rules.map(rule => rule.id === saved.id ? saved : rule) : [...rules, saved];
      if (persist(next)) { renderList(); toast(saved.enabled ? '修改已保存，下次筛选使用新配置' : '规则已保存，可在列表中启用'); } else { submitLock = false; saveButton.disabled = false; formError.hidden = false; formError.append(el('div', '', '保存失败，草稿仍在，可重试；原规则未改变。')); }
    }
    function trial(rule) {
      const errors = M.validate(rule); if (errors.length) { const content = el('div', 'rr-modal'); content.append(el('p', '', '请先完善规则，再查看示例试算。')); errors.forEach(error => content.append(el('p', 'rr-error-text', error))); dialog('规则尚未完整', content); return; }
      const body = el('div', 'rr-modal rr-trial'); const controls = el('div', 'rr-trial-controls'); const date = input('date', '2026-09-27', '示例回访日期', () => draw()); controls.append(field('示例回访日', date), el('p', 'rr-muted', '仅以合成样本演示条件计算，不代表已生成真实名单。')); const results = el('div'); body.append(controls, results);
      function draw() {
        results.replaceChildren(); if (!/^\d{4}-\d{2}-\d{2}$/.test(date.value)) { results.append(el('p', 'rr-error-text', '请选择有效的示例日期')); return; }
        let result; try { result = M.evaluate(rule, date.value); } catch (_) { results.append(el('p', 'rr-error-text', '示例数据暂时无法判断，请检查日期与配置。')); return; }
        if (result.errors?.length) { results.append(el('p', 'rr-error-text', '本次试算未完成，请检查以下配置：')); result.errors.forEach(error => results.append(el('p', 'rr-error-text', error))); return; }
        results.append(el('p', 'rr-trial-at', '试算基准：' + result.date + ' ' + rule.runAt + '（北京时间）'));
        const metrics = el('div', 'rr-trial-metrics'); [['范围内', result.counts.scope, ''], ['应回访', result.counts.included, 'good'], ['已排除', result.counts.excluded, ''], ['未入选', result.rows.filter(row => row.status === 'not-matched').length, ''], ['无法判断', result.counts.unknown, 'warn']].forEach(([title, count, cls]) => { const box = el('div', cls); box.append(el('span', '', title), el('strong', '', String(count))); metrics.append(box); }); results.append(metrics);
        const wrap = el('div', 'rr-trial-table'); const table = el('table'); const head = el('tr'); ['示例好友', '所属账号', '到期节点', '结果', '判断原因'].forEach(title => head.append(el('th', '', title))); const thead = el('thead'); thead.append(head); table.append(thead); const tbody = el('tbody');
        const labels = { included: '应回访', excluded: '已排除', 'not-matched': '未入选', unknown: '无法判断' };
        result.rows.forEach(item => { const tr = el('tr'); const status = el('td'); status.append(el('span', 'rr-trial-status ' + item.status, labels[item.status] || item.status)); tr.append(el('td', '', item.friend.name), el('td', '', nameOf(item.friend.accountId)), el('td', '', item.nodeDay != null ? '第 ' + item.nodeDay + ' 天' : '—'), status, el('td', '', item.reasons.join('；'))); tbody.append(tr); });
        if (!result.rows.length) { const tr = el('tr'); const td = el('td', 'rr-trial-empty', '当前范围内没有可试算的样本'); td.colSpan = 5; tr.append(td); tbody.append(tr); }
        table.append(tbody); wrap.append(table); results.append(wrap, el('p', 'rr-note', '“无法判断”表示关键数据缺失，不会当成“未联系”入选。试算人数为 0 也不影响合法规则保存。'));
      }
      draw(); dialog('示例试算 · ' + rule.name, body);
    }
    read(); renderList(); return true;
  }
  window.AdminRevisitRules = { mount };
})();
