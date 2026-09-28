/* SPEC-SUIYIN-ADMIN-071: read-only source migration checks; no browser or Git required.
 * Usage: node menu-migration-071.cjs [prototype-repo-root] [result-json]
 * All edits below are synthetic in-memory copies of versioned menu defaults.
 */
'use strict';
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const assert = require('node:assert/strict'), crypto = require('node:crypto');
function locate(start) {
  for (let dir = path.resolve(start); ; dir = path.dirname(dir)) {
    if (fs.existsSync(path.join(dir, 'prototype/admin-menu-state.js'))) return dir;
    if (path.dirname(dir) === dir) return null;
  }
}
const root = process.argv[2] ? path.resolve(process.argv[2]) : locate(process.cwd()) || locate(__dirname);
if (!root) throw Error('Provide the prototype repository root as the first argument.');
const output = process.argv[3] ? path.resolve(process.argv[3]) : path.join(__dirname, 'menu-migration-071-results.json');
const results = [], files = {};
const clone = value => structuredClone(value);
function read(file) { const text = fs.readFileSync(path.join(root, file), 'utf8'); files[file] = crypto.createHash('sha256').update(text).digest('hex'); return text; }
function check(name, action) { action(); results.push({ name, status: 'PASS' }); console.log('PASS ' + name); }
function indexed(rows) {
  const map = new Map(), stack = [];
  for (const row of rows) {
    const depth = Number(row.tree?.depth) || 0;
    while (stack.length && stack.at(-1).depth >= depth) stack.pop();
    map.set(row.id, { row, parent: stack.at(-1)?.row.id || '', depth });
    stack.push({ row, depth });
  }
  return map;
}
function parentOf(rows, id) { return indexed(rows).get(id)?.parent; }
function childIds(rows, parent) { return [...indexed(rows)].filter(([, entry]) => entry.parent === parent).map(([id]) => id); }
function savedFrom(source, revision, baseline) {
  const saved = clone(source); saved.dataRevision = revision;
  saved.tables[0] = { ...saved.tables[0], headers: clone(baseline.headers), rows: clone(baseline.rows) };
  saved.history = [{ action: 'Synthetic local edit for migration regression' }];
  return saved;
}
let failure;
try {
  const code = read('prototype/admin-menu-state.js');
  const boundary = code.indexOf('/* SPEC-SUIYIN-ADMIN-060@1.1.0');
  assert.ok(boundary > 0, 'menu migration module boundary exists');
  const context = { window: {}, structuredClone }; vm.createContext(context); vm.runInContext(code.slice(0, boundary), context);
  const state = context.window.AdminMenuState, refresh = context.window.AdminMenuRefresh;
  for (const [tenant, route] of [['yestar-sz', 'menu'], ['bzds', 'allMenu']]) {
    const source = JSON.parse(read('prototype/data/content/' + tenant + '.json'))[route];
    const baselineEntries = Object.entries(source.menuRefresh.baselines || {});
    assert.ok(baselineEntries.length, tenant + ' has revision-specific defaults');
    const [revision, baseline] = baselineEntries[0];
    const oldIds = new Set(source.menuRefresh.previousRows.map(row => row.id));
    const addedInRefresh = baseline.rows.filter(row => !oldIds.has(row.id) && !row.tree?.hasChildren);
    const targetId = addedInRefresh.find(row => row.cells[0] === '喜报设置')?.id || addedInRefresh[0]?.id;
    assert.ok(targetId, tenant + ' has a page added in the preceding refresh');
    const baselineBytes = JSON.stringify(baseline), sourceBytes = JSON.stringify(source);
    const saved = () => savedFrom(source, revision, baseline);
    check(tenant + ': deleted preceding-refresh row stays deleted', () => {
      const local = saved(); local.tables[0].rows = local.tables[0].rows.filter(row => row.id !== targetId);
      const before = JSON.stringify(local), result = refresh.merge(source, local);
      assert.ok(!result.tables[0].rows.some(row => row.id === targetId));
      assert.ok(result.tables[0].rows.some(row => row.id === '0-revisitRules'));
      assert.equal(JSON.stringify(local), before);
    });
    check(tenant + ': preceding-refresh row reorder survives', () => {
      const local = saved(), rows = local.tables[0].rows, parent = parentOf(rows, targetId);
      const from = rows.findIndex(row => row.id === targetId), [target] = rows.splice(from, 1);
      rows.splice(rows.findIndex(row => row.id === parent) + 1, 0, target);
      const expected = childIds(rows, parent), result = refresh.merge(source, local);
      assert.equal(childIds(result.tables[0].rows, parent).filter(id => expected.includes(id)).join('|'), expected.join('|'));
    });
    check(tenant + ': local rename survives', () => {
      const local = saved(); local.tables[0].rows.find(row => row.id === targetId).cells[0] = '本地合成改名';
      const result = refresh.merge(source, local);
      assert.equal(result.tables[0].rows.find(row => row.id === targetId).cells[0], '本地合成改名');
    });
    check(tenant + ': local hidden state survives', () => {
      const local = saved(), column = local.tables[0].headers.indexOf('菜单状态'); assert.ok(column >= 0);
      local.tables[0].rows.find(row => row.id === targetId).cells[column] = '隐藏';
      const result = refresh.merge(source, local);
      assert.equal(result.tables[0].rows.find(row => row.id === targetId).cells[column], '隐藏');
    });
    check(tenant + ': explicit cross-parent move survives', () => {
      const local = saved(), rows = local.tables[0].rows, oldParent = parentOf(rows, targetId);
      const destination = rows.find(row => !row.tree?.depth && row.id !== oldParent);
      const [target] = rows.splice(rows.findIndex(row => row.id === targetId), 1);
      target.tree = { ...target.tree, depth: 1, parentId: destination.id, parentKey: destination.tree?.key || null };
      rows.splice(rows.findIndex(row => row.id === destination.id) + 1, 0, target);
      const result = refresh.merge(source, local);
      assert.equal(parentOf(result.tables[0].rows, targetId), destination.id);
    });
    check(tenant + ': older pre-refresh state still receives added defaults', () => {
      const oldBaseline = { headers: source.menuRefresh.previousHeaders, rows: source.menuRefresh.previousRows };
      const local = savedFrom(source, source.menuRefresh.previousRevision || 'pre-refresh', oldBaseline);
      const result = refresh.merge(source, local);
      for (const row of addedInRefresh) assert.ok(result.tables[0].rows.some(item => item.id === row.id), row.id);
      assert.ok(result.tables[0].rows.some(row => row.id === '0-revisitRules'));
    });
    check(tenant + ': migration is idempotent and does not mutate source snapshots', () => {
      const result = refresh.merge(source, saved());
      assert.equal(JSON.stringify(refresh.merge(source, result)), JSON.stringify(result));
      assert.equal(JSON.stringify(source), sourceBytes); assert.equal(JSON.stringify(baseline), baselineBytes);
    });
  }
  const nav = JSON.parse(read('prototype/data/navigation-snapshot.json'));
  const tenant = nav.tenants.find(item => item.id === 'yestar-sz');
  const group = tenant.menu.find(item => item.children?.some(child => child.route === 'revisitRules'));
  const key = group.route || group.id;
  const saved = { enabled: state.defaultEnabled(tenant).filter(route => route !== 'revisitRules'), appliedMigrations: { 'sales-voice-stats-v1': true, 'ai-cost-stats-v1': true, 'live-menu-refresh-20260927': true }, labels: { [key]: '本地聊天改名' }, order: { [key]: 998 } };
  check('Shenzhen new route joins visible old defaults without changing rename/order', () => {
    const before = JSON.stringify(saved), result = state.migrate(tenant, saved);
    assert.ok(result.enabled.includes('revisitRules')); assert.equal(JSON.stringify(result.labels), JSON.stringify(saved.labels));
    assert.equal(JSON.stringify(result.order), JSON.stringify(saved.order)); assert.equal(JSON.stringify(saved), before);
    assert.equal(JSON.stringify(state.migrate(tenant, result)), JSON.stringify(result));
  });
  check('hidden parent, hidden route and fully disabled branch remain hidden', () => {
    assert.ok(!state.migrate(tenant, { ...saved, display: { [key]: '隐藏' } }).enabled.includes('revisitRules'));
    assert.ok(!state.migrate(tenant, { ...saved, display: { revisitRules: '隐藏' } }).enabled.includes('revisitRules'));
    assert.ok(!state.migrate(tenant, { ...saved, enabled: saved.enabled.filter(route => !group.children.some(child => child.route === route)) }).enabled.includes('revisitRules'));
  });
  check('other fourteen tenant inventories do not acquire revisitRules', () => {
    function walk(nodes) { return (nodes || []).flatMap(node => [node, ...walk(node.children)]); }
    for (const other of nav.tenants.filter(item => item.id !== 'yestar-sz')) {
      assert.ok(!walk(other.menu).some(node => node.route === 'revisitRules'));
      assert.ok(!state.migrate(other, undefined).enabled.includes('revisitRules'));
    }
  });
} catch (error) { failure = { message: error.message, stack: error.stack }; process.exitCode = 1; console.error(error.message); }
const report = { spec: 'SPEC-SUIYIN-ADMIN-071@1.1.0', at: new Date().toISOString(), runtime: process.version, mode: 'read-only Node VM; synthetic in-memory edits', passed: results.length, results, sourceSha256: files, ...(failure ? { failure } : {}) };
fs.writeFileSync(output, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ passed: results.length, failed: Boolean(failure), output }));
