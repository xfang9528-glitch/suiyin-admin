/* SPEC-SUIYIN-ADMIN-071@1.2.0: reproduce the 14 source audits and 52 migration checks.
 * Usage: node menu-extension-verification.cjs [prototype-repo-root] [result-json]
 * SUIYIN_ADMIN_REPO may provide the repository root. All test edits stay in memory.
 * The 1.1 checker in ../menu-migration-071.cjs is read, expanded in memory, and
 * executed without overwriting its source or historical result file.
 */
'use strict';
const fs = require('node:fs'), path = require('node:path'), cp = require('node:child_process');
const vm = require('node:vm'), assert = require('node:assert/strict'), crypto = require('node:crypto');
const baselineRef = 'afcf240333b5a1923c58bbdaaa1dab177850eb92';
function locate(start) {
  for (let dir = path.resolve(start); ; dir = path.dirname(dir)) {
    if (fs.existsSync(path.join(dir, 'prototype/admin-menu-state.js'))) return dir;
    if (path.dirname(dir) === dir) return null;
  }
}
const conventional = path.resolve(__dirname, '../../../../../佰智德三/碎银原型/suiyin-admin');
const root = process.argv[2] || process.env.SUIYIN_ADMIN_REPO || locate(process.cwd()) ||
  (fs.existsSync(path.join(conventional, 'prototype/admin-menu-state.js')) ? conventional : null);
if (!root) throw Error('Provide the prototype repository root or set SUIYIN_ADMIN_REPO.');
const repo = path.resolve(root);
const output = path.resolve(process.argv[3] || path.join(__dirname, 'menu-extension-results.json'));
const clone = structuredClone, audits = [], sourceSha256 = {};
const hash = text => crypto.createHash('sha256').update(text).digest('hex');
function readText(file) {
  const text = fs.readFileSync(path.join(repo, file), 'utf8'); sourceSha256[file] = hash(text); return text;
}
const read = file => JSON.parse(readText(file));
const head = file => JSON.parse(cp.execFileSync('git', ['show', baselineRef + ':' + file], {
  cwd: repo, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024,
}));
function check(name, action) { action(); audits.push({ name, status: 'PASS' }); console.log('PASS ' + name); }
const allRoutes = tenant => tenant.menu.flatMap(group => group.children || [group]).map(child => child.route);
const allowed = ['yestar-sz', 'yestar', 'yestar-bj', 'yestar-gz', 'yestar-hz', 'yestar-jx'];
const added = allowed.slice(1);
let migrationReport, inventory, failure;
try {
  const navPath = 'prototype/data/navigation-snapshot.json', nav = read(navPath), old = head(navPath);
  check('navigation schema and only five scoped additive changes', () => {
    assert.equal(nav.tenants.length, 15);
    const normalized = clone(nav);
    for (const tenant of normalized.tenants) {
      if (added.includes(tenant.id)) {
        const group = tenant.menu.find(item => item.children?.some(child => child.route === 'revisitRules'));
        assert.equal(group.label, '聊天管理');
        const entry = group.children.find(child => child.route === 'revisitRules');
        assert.equal(entry.contentStatus, 'mock');
        assert.equal(entry.liveEvidence.spec, 'SPEC-SUIYIN-ADMIN-071@1.2.0');
        assert.equal(entry.liveEvidence.liveObserved, false);
        group.children = group.children.filter(child => child.route !== 'revisitRules');
        tenant.menuDataRevision = old.tenants.find(item => item.id === tenant.id).menuDataRevision;
      }
      assert.equal(allRoutes(tenant).filter(route => route === 'revisitRules').length, tenant.id === 'yestar-sz' ? 1 : 0);
    }
    assert.deepEqual(normalized, old);
  });
  const code = readText('prototype/admin-menu-state.js'), context = { window: {}, structuredClone };
  vm.createContext(context); vm.runInContext(code.slice(0, code.indexOf('/* SPEC-SUIYIN-ADMIN-060@1.1.0')), context);
  const state = context.window.AdminMenuState;
  for (const id of allowed) {
    const tenant = nav.tenants.find(item => item.id === id);
    const group = tenant.menu.find(item => item.children?.some(child => child.route === 'revisitRules'));
    const prior = {
      enabled: state.defaultEnabled(tenant).filter(route => route !== 'revisitRules'),
      appliedMigrations: { 'sales-voice-stats-v1': true, 'ai-cost-stats-v1': true, 'live-menu-refresh-20260927': true },
      labels: { [group.id]: '本地改名' }, order: { [group.id]: 998 },
    };
    check(id + ' visibility migration preserves hide/order/labels and is idempotent', () => {
      const migrated = state.migrate(tenant, prior);
      assert(migrated.enabled.includes('revisitRules'));
      assert.equal(JSON.stringify(migrated.labels), JSON.stringify(prior.labels));
      assert.equal(JSON.stringify(migrated.order), JSON.stringify(prior.order));
      assert(!prior.enabled.includes('revisitRules'));
      assert.equal(JSON.stringify(state.migrate(tenant, migrated)), JSON.stringify(migrated));
      for (const override of [
        { display: { [group.id]: '隐藏' } }, { display: { revisitRules: '隐藏' } },
        { enabled: prior.enabled.filter(route => !group.children.some(child => child.route === route)) },
      ]) assert(!state.migrate(tenant, { ...prior, ...override }).enabled.includes('revisitRules'));
      const applied = { ...prior, appliedMigrations: { ...prior.appliedMigrations, 'revisit-rules-v1': true } };
      assert(!state.migrate(tenant, applied).enabled.includes('revisitRules'));
    });
  }
  check('all nine non-Yestar tenants retain no route or enabled migration', () => {
    for (const tenant of nav.tenants.filter(item => !allowed.includes(item.id))) {
      assert(!allRoutes(tenant).includes('revisitRules'));
      assert(!state.migrate(tenant, undefined).enabled.includes('revisitRules'));
    }
  });
  for (const id of added) {
    const file = 'prototype/data/content/' + id + '.json', data = read(file), before = head(file);
    const page = data.menu, oldPage = before.menu, revision = oldPage.dataRevision;
    check(id + ' menu schema, exact HEAD baseline, text and unrelated content preserved', () => {
      const parent = page.tables[0].rows.find(row => row.cells[0] === '聊天管理');
      const newRows = page.tables[0].rows.filter(row => row.tree?.key === 'revisitRules');
      assert.equal(newRows.length, 1);
      assert.equal(newRows[0].tree.parentId, parent.id); assert.equal(newRows[0].tree.parentKey, parent.tree.key);
      assert.equal(newRows[0].source, 'SPEC-SUIYIN-ADMIN-071@1.2.0');
      assert(newRows[0].prototypeOnly); assert.equal(newRows[0].evidence.liveObserved, false);
      assert.equal(new Set(page.tables[0].rows.map(row => row.id)).size, page.tables[0].rows.length);
      assert(page.tables[0].rows.every(row => row.cells.length === page.tables[0].headers.length));
      assert.equal(page.text, [page.label, page.tables[0].headers.join('\t'),
        ...page.tables[0].rows.map(row => row.cells.join('\t'))].join('\n'));
      assert.deepEqual(page.menuRefresh.baselines[revision], { headers: oldPage.tables[0].headers, rows: oldPage.tables[0].rows });
      const normalized = clone(data); normalized.menu = clone(oldPage); assert.deepEqual(normalized, before);
      const normalizedPage = clone(page);
      normalizedPage.tables[0].rows = normalizedPage.tables[0].rows.filter(row => row.tree?.key !== 'revisitRules');
      normalizedPage.dataRevision = oldPage.dataRevision; normalizedPage.text = oldPage.text;
      normalizedPage.menuRefresh = oldPage.menuRefresh; assert.deepEqual(normalizedPage, oldPage);
    });
  }
  check('Shenzhen and platform source byte-equivalent to HEAD', () => {
    for (const id of ['yestar-sz', 'bzds']) {
      const file = 'prototype/data/content/' + id + '.json'; assert.deepEqual(read(file), head(file));
    }
  });
  const migrationPath = path.resolve(__dirname, '../menu-migration-071.cjs');
  const migrationSource = fs.readFileSync(migrationPath, 'utf8');
  sourceSha256['check-dependency:../menu-migration-071.cjs'] = hash(migrationSource);
  const migration = migrationSource
    .replace("[['yestar-sz', 'menu'], ['bzds', 'allMenu']]", JSON.stringify(allowed.map(id => [id, 'menu']).concat([['bzds', 'allMenu']])))
    .replace('other fourteen tenant inventories do not acquire revisitRules', 'other nine non-Yestar tenant inventories do not acquire revisitRules')
    .replace("item.id !== 'yestar-sz'", '!' + JSON.stringify(allowed) + '.includes(item.id)')
    .replace('SPEC-SUIYIN-ADMIN-071@1.1.0', 'SPEC-SUIYIN-ADMIN-071@1.2.0');
  const safeFs = { ...fs, writeFileSync: (_file, text) => { migrationReport = JSON.parse(text); } };
  const migrationContext = {
    console: { log: value => { if (typeof value === 'string' && value.startsWith('PASS ')) console.log(value); }, error: console.error },
    structuredClone, require: name => name === 'node:fs' ? safeFs : require(name),
    process: { argv: ['node', 'memory-check', repo], version: process.version, cwd: () => repo }, __dirname,
  };
  vm.createContext(migrationContext); vm.runInContext(migration, migrationContext);
  assert(!migrationReport.failure, JSON.stringify(migrationReport.failure));
  inventory = { tenants: nav.tenants.length, entries: nav.tenants.flatMap(allRoutes).length,
    uniqueRoutes: new Set(nav.tenants.flatMap(allRoutes)).size };
} catch (error) {
  failure = { message: error.message, stack: error.stack }; process.exitCode = 1; console.error(error.message);
}
const report = {
  spec: 'SPEC-SUIYIN-ADMIN-071@1.2.0', at: new Date().toISOString(), runtime: process.version,
  mode: 'read-only source audit and Node VM; synthetic in-memory edits',
  baselineRef, baselineMeaning: 'Published HEAD used in the original audit; frozen for later reproduction',
  schemaAndScopeChecks: audits.length, migrationChecks: migrationReport?.passed || 0,
  passed: audits.length + (migrationReport?.passed || 0), status: failure ? 'FAIL' : 'PASS',
  audits, migrations: migrationReport?.results || [], inventory,
  sourceSha256: { ...sourceSha256, ...migrationReport?.sourceSha256 },
  ...(failure ? { failure } : {}),
};
fs.writeFileSync(output, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ status: report.status, sourceAudits: audits.length,
  migrationChecks: migrationReport?.passed || 0, inventory, output }));
