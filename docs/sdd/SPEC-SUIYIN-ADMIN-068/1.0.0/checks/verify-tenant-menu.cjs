/* SPEC-068 local prototype acceptance. Isolated Chrome + qa=1; no user profile. */
const { chromium } = require('C:/Users/georg/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const base = 'http://127.0.0.1:8148/prototype/';
const repo = 'E:/AI 项目/佰智德三/碎银原型/suiyin-admin';
const results = [], errors = [];
let browser, context, page, frame;
const row = (id, f = frame) => f.locator(`[data-row-id="${id}"]`);
const handle = (id, f = frame) => row(id, f).locator('.menu-drag-handle');
const table = (f = frame) => f.evaluate(() => structuredClone(Admin.getTable()));
const model = (f = frame) => f.evaluate(() => structuredClone(Admin.model));
const ids = data => data.rows.map(r => r.id);
const roots = data => data.rows.filter(r => (r.tree?.depth || 0) === 0);
const keyOf = (r, data) => r.tree?.key || r.cells[data.headers.indexOf('菜单路由')] || '';
function parent(data, id) { let root = ''; for (const r of data.rows) { if (r.id === id) return (r.tree?.depth || 0) ? root : ''; if (!(r.tree?.depth || 0)) root = r.id; } }
const children = (data, id) => data.rows.filter(r => parent(data, r.id) === id);
const byKey = (data, key) => data.rows.find(r => keyOf(r, data) === key);
const key = (tenant = 'yestar-sz', route = 'menu') => `admin-qa:v1:${tenant}:${route}`;
async function settle(p = page) { await p.waitForTimeout(160); }
async function ready(p, route = 'menu') { await p.frameLocator('.frame-wrap:not([hidden]) iframe').locator('body[data-content-ready="true"]').waitFor(); return p.frames().find(f => f.url().includes('admin-content.html') && new URL(f.url()).searchParams.get('route') === route); }
async function open(tenant, route = 'menu') {
 const p = await context.newPage(); p.on('pageerror', e => errors.push(`${tenant}/${route}: ${e.message}`));
 await p.goto(`${base}_shell.html?tenant=${tenant}&page=${route}&qa=1`); return { p, f: await ready(p, route) };
}
async function reset(tenant = 'yestar-sz') { await context?.close(); context = await browser.newContext({ viewport: { width: 1500, height: 1050 } }); ({ p: page, f: frame } = await open(tenant)); }
async function nav(p = page) { return p.evaluate(() => [...document.querySelectorAll('#navigation>ul>li')].map(li => ({ label: li.querySelector('summary>span:last-child,.nav-button>span:last-child')?.textContent, routes: [...li.querySelectorAll('[data-route]')].map(b => b.dataset.route) }))); }
const routeInventory = n => n.flatMap(g => g.routes).sort();
function projected(data, visibleRoutes) {
 const visible = new Set(visibleRoutes);
 return roots(data).map(r => [keyOf(r, data), ...children(data, r.id).map(c => keyOf(c, data))].filter(k => visible.has(k))).filter(routes => routes.length);
}
async function assertProjection(p = page, f = frame) {
 const n = await nav(p), data = await table(f);
 assert.deepEqual(n.map(g => g.routes), projected(data, routeInventory(n)), 'sidebar must use table parent and sibling order');
}
async function drag(from, to, position = .5, { drop = true, p = page, f = frame } = {}) {
 await handle(from, f).evaluate(e => e.scrollIntoView({ block: 'center', inline: 'nearest' })); const a = await handle(from, f).boundingBox();
 await p.mouse.move(a.x + a.width / 2, a.y + a.height / 2); await p.mouse.down();
 await row(to, f).evaluate(e => e.scrollIntoView({ block: 'center', inline: 'nearest' })); const b = await row(to, f).boundingBox();
 await p.mouse.move(b.x + 100, b.y + b.height * position, { steps: 12 }); if (drop) { await p.mouse.up(); await settle(p); }
}
async function status(id, value, { p = page, f = frame } = {}) {
 await row(id, f).getByRole('button', { name: '编辑', exact: true }).click(); await f.locator('#dialog').getByText(value, { exact: true }).click();
 await f.getByRole('button', { name: '确 定', exact: true }).click(); await settle(p);
}
function sameBusiness(before, after) {
 const clean = (r, data) => { r = structuredClone(r); delete r.tree; const order = data.headers.indexOf('排序'); if (order >= 0) r.cells.splice(order, 1); if (r.extra) { delete r.extra.parentId; delete r.extra['排序']; if (!Object.keys(r.extra).length) delete r.extra; } return r; };
 assert.deepEqual(after.rows.map(r => clean(r, after)).sort((a,b) => a.id.localeCompare(b.id)), before.rows.map(r => clean(r, before)).sort((a,b) => a.id.localeCompare(b.id)), 'movement must preserve every business field and row identity');
}
async function check(name, run, tenant = 'yestar-sz') {
 if (process.env.TENANT_CHECK_FILTER && !name.includes(process.env.TENANT_CHECK_FILTER)) return;
 const start = Date.now();
 try { await reset(tenant); await run(); results.push({ name, status: 'PASS', ms: Date.now() - start }); console.log('PASS ' + name); }
 catch (error) { results.push({ name, status: 'FAIL', error: error.stack, ms: Date.now() - start }); console.error('FAIL ' + name + ': ' + error.message); await page?.screenshot({ path: path.join(__dirname, `failure-${results.length}.png`) }).catch(() => {}); await page?.mouse.up().catch(() => {}); }
}
async function stored(k, f = frame) { return f.evaluate(k => localStorage.getItem(k), k); }
async function injectFailure(f = frame) { await f.evaluate(() => { window.qaSetItem = Storage.prototype.setItem; Storage.prototype.setItem = function(k, v) { if (k === `admin-qa:v1:${Admin.tenant}:${Admin.route}`) throw new DOMException('QA quota', 'QuotaExceededError'); return window.qaSetItem.call(this, k, v); }; }); }
async function restoreFailure(f = frame) { await f.evaluate(() => Storage.prototype.setItem = window.qaSetItem); }

(async () => {
 browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
 const snapshot = JSON.parse(await fs.readFile(path.join(repo, 'prototype/data/navigation-snapshot.json'), 'utf8'));
 for (const tenant of snapshot.tenants) await check(`matrix:${tenant.id} · six columns, three moves and sidebar`, async () => {
  const before = await table(), initialNav = await nav(), visible = new Set(routeInventory(initialNav));
  assert.equal(await frame.locator('thead th').count(), 6); assert.equal(await frame.locator('.menu-drag-handle').count(), before.rows.length);
  assert.equal(await frame.locator('thead th').nth(3).innerText(), '顺序');
  const group = roots(before).find(r => children(before, r.id).filter(c => visible.has(keyOf(c, before))).length >= 2);
  assert.ok(group, 'existing visible sibling group');
  const siblings = children(before, group.id).filter(r => visible.has(keyOf(r, before)) && keyOf(r, before) !== 'menu');
  assert.ok(siblings.length >= 2); const target = roots(before).find(r => r.id !== group.id && visible.has(keyOf(r, before))) || roots(before).find(r => r.id !== group.id && children(before, r.id).some(c => visible.has(keyOf(c, before))));
  await row(group.id).getByRole('button', { name: '编辑', exact: true }).click(); assert.equal(await frame.locator('#dialog input[aria-label="排序"]').count(), 0); assert.match(await frame.locator('.menu-order-note').innerText(), /拖动/); await frame.getByRole('button', { name: '取 消', exact: true }).click();
  await drag(siblings[1].id, siblings[0].id, .2); assert.ok(children(await table(), group.id).findIndex(r => r.id === siblings[1].id) < children(await table(), group.id).findIndex(r => r.id === siblings[0].id)); await assertProjection();
  const orderBeforeRoot = children(await table(), group.id).map(r => r.id); await drag(group.id, target.id, .2); assert.deepEqual(children(await table(), group.id).map(r => r.id), orderBeforeRoot); await assertProjection();
  await drag(siblings[1].id, target.id); assert.equal(parent(await table(), siblings[1].id), target.id); assert.equal(children(await table(), target.id).at(-1).id, siblings[1].id); await assertProjection();
  assert.deepEqual(routeInventory(await nav()), routeInventory(initialNav)); sameBusiness(before, await table());
  assert.match(await frame.locator('.menu-memory-hint').innerText(), /本租户/);
  if (tenant.id === 'yestar-sz') await page.screenshot({ path: path.join(__dirname, 'verified-tenant-default.png') });
 }, tenant.id);

 await check('persistence · undo, refresh, reopen and prior fields', async () => {
  const source = byKey(await table(), 'customerGroupList'), target = byKey(await table(), 'salesManage');
  await frame.evaluate(() => { const r = Admin.getTable().rows.find(r => r.tree.key === 'customerGroupList'); r.extra = { ...r.extra, qaPriorRemark: '保留已有字段' }; Admin.persist('已有修改'); });
  await settle();
  const before = await table(), beforeModel = await model(); await drag(source.id, target.id); const moved = await table();
  assert.equal((await model()).auditRecords.length, beforeModel.auditRecords.length + 1); await frame.locator('.menu-undo-move').click(); await settle();
  assert.deepEqual(ids(await table()), ids(before)); assert.equal((await table()).rows.find(r => r.id === source.id).extra.qaPriorRemark, '保留已有字段'); assert.equal((await model()).auditRecords.length, beforeModel.auditRecords.length + 2); await assertProjection();
  await drag(source.id, target.id); await row(target.id).getByRole('button', { name: '编辑', exact: true }).click(); await frame.getByRole('button', { name: '取 消', exact: true }).click(); assert.equal(await frame.locator('.menu-undo-move').count(), 1);
  const saved = await table(); await page.reload(); frame = await ready(page); assert.deepEqual(await table(), saved); assert.equal(await frame.locator('.menu-undo-move').count(), 0); await assertProjection();
  const fresh = await open('yestar-sz'); assert.deepEqual(await table(fresh.f), saved); await assertProjection(fresh.p, fresh.f); await fresh.p.close();
 });

 await check('windows · same tenant live update, isolation and stale undo', async () => {
  const twin = await open('yestar-sz'), other = await open('yestar'), platform = await open('bzds', 'allMenu');
  const otherTable = await table(other.f), otherNav = await nav(other.p), platformModel = await model(platform.f), before = await table();
  let reloads = 0; for (const p of [page, twin.p]) p.on('request', r => { if (r.isNavigationRequest() && r.frame() === p.mainFrame()) reloads++; });
  await twin.f.evaluate(() => window.qaPreserve = 'kept'); const a = byKey(before, 'customerGroupList'), target = byKey(before, 'salesManage');
  await drag(a.id, target.id); await assertProjection(twin.p, twin.f); assert.deepEqual(ids(await table(twin.f)), ids(await table())); assert.equal(await twin.f.evaluate(() => window.qaPreserve), 'kept'); assert.equal(reloads, 0);
  assert.deepEqual(await table(other.f), otherTable); assert.deepEqual(await nav(other.p), otherNav); assert.deepEqual(await model(platform.f), platformModel);
  const twinTable = await table(twin.f), b = byKey(twinTable, 'uploadCustomerList'); await drag(b.id, target.id, .5, { p: twin.p, f: twin.f }); await settle(); assert.equal(await frame.locator('.menu-undo-move').count(), 0); await assertProjection();
  assert.match(await frame.locator('#toast').innerText(), /菜单设置已更新|最新/);
 });

 await check('failure · failed move and undo preserve saved model and remote window', async () => {
  const twin = await open('yestar-sz'), data = await table(), a = byKey(data, 'customerGroupList'), target = byKey(data, 'salesManage');
  const before = await model(), navBefore = await nav(), savedBefore = await stored(key()); await injectFailure(); await drag(a.id, target.id);
  assert.deepEqual(await model(), before); assert.equal(await stored(key()), savedBefore); assert.deepEqual(await nav(), navBefore); assert.deepEqual(await nav(twin.p), navBefore); assert.match(await frame.locator('#toast').innerText(), /未能保存/); assert.equal(await frame.locator('.menu-undo-move').count(), 0);
  await restoreFailure(); await drag(a.id, target.id); const moved = await model(), savedMoved = await stored(key()), movedNav = await nav();
  await injectFailure(); await frame.locator('.menu-undo-move').click(); await settle(); assert.deepEqual(await model(), moved); assert.equal(await stored(key()), savedMoved); assert.deepEqual(await nav(twin.p), movedNav); assert.equal(await frame.locator('.menu-undo-move').count(), 1);
  await restoreFailure(); await frame.locator('.menu-undo-move').click(); await settle(); assert.deepEqual(ids(await table()), ids(before.tables[0])); await assertProjection();
 });

 await check('cancel-keyboard · no-op, escape, outside, blur and keyboard', async () => {
  const data = await table(), a = byKey(data, 'customerGroupList'), target = byKey(data, 'salesManage'), before = await model();
  await drag(a.id, a.id); assert.deepEqual(await model(), before); await drag(a.id, target.id, .5, { drop: false }); await page.keyboard.press('Escape'); await page.mouse.up(); assert.deepEqual(await model(), before);
  await drag(a.id, target.id, .5, { drop: false }); await page.mouse.move(600, 180); await page.mouse.up(); assert.deepEqual(await model(), before);
  await drag(a.id, target.id, .5, { drop: false }); await frame.evaluate(() => dispatchEvent(new Event('blur'))); await page.mouse.up(); assert.deepEqual(await model(), before);
  await handle(a.id).focus(); await page.keyboard.press('Space'); await page.keyboard.press('ArrowUp'); await page.keyboard.press('Enter'); assert.notDeepEqual(ids(await table()), ids(data)); await assertProjection();
  const moved = await model(); await handle(a.id).focus(); await page.keyboard.press('Enter'); await page.keyboard.press('ArrowRight'); await page.keyboard.press('Escape'); assert.deepEqual(await model(), moved);
 });

 await check('disabled · readonly, legacy depth and empty', async () => {
  const data = await table(), group = roots(data).find(r => children(data, r.id).length > 1), child = children(data, group.id)[1];
  await frame.evaluate(id => { for (const row of Admin.getTable().rows) { delete row.tree.menuResolved; delete row.tree.menuOriginParentKey; delete row.tree.menuOriginDepth; } const r = Admin.getTable().rows.find(r => r.id === id); r.tree.depth = 2; AdminMenu.render(); }, child.id);
  assert.equal(await handle(group.id).isDisabled(), true); assert.equal(await handle(child.id).isDisabled(), true); assert.equal((await table()).rows.find(r => r.id === child.id).tree.depth, 2);
  await frame.evaluate(() => Admin.persist('QA 保留旧三级')); await settle(); const deepRoute = keyOf(child, data);
  assert.ok(routeInventory(await nav()).includes(deepRoute)); assert.equal(await page.locator('#navigation [data-route="undefined"]').count(), 0);
  await page.evaluate(() => document.querySelectorAll('#navigation details').forEach(d => d.open = true)); await page.locator(`#navigation [data-route="${deepRoute}"]`).click(); await ready(page, deepRoute); await page.evaluate(() => openPage('menu')); await ready(page);
  await frame.evaluate(() => { Admin.model.readOnly = true; AdminMenu.render(); }); assert.equal(await frame.locator('.menu-drag-handle:not(:disabled)').count(), 0);
  await frame.evaluate(() => { Admin.getTable().rows = []; AdminMenu.render(); }); assert.equal(await frame.locator('.menu-drag-handle').count(), 0);
 });

 await check('platform-first · preexisting platform order is table and sidebar baseline', async () => {
  const platform = await open('bzds', 'allMenu'); await drag('0-6', '0-0', .5, { p: platform.p, f: platform.f }); await settle();
  assert.equal(parent(await table(), byKey(await table(), 'customerGroupList').id), byKey(await table(), 'salesManage').id); await assertProjection();
  const friend = parent(await table(), byKey(await table(), 'uploadCustomerList').id); await drag(byKey(await table(), 'customerGroupList').id, friend); await assertProjection();
  const other = await open('yestar'); const n = await nav(other.p); assert.ok(n.find(g => g.routes.includes('salesManage')).routes.includes('customerGroupList')); assert.ok(!(await nav()).find(g => g.routes.includes('salesManage')).routes.includes('customerGroupList'));
 });

 await check('platform-later · local group and parent survive, untouched parent follows', async () => {
  const data = await table(), customer = byKey(data, 'customerGroupList'), add = byKey(data, 'uploadCustomerList'), sales = byKey(data, 'salesManage');
  await drag(customer.id, sales.id); const friend = parent(await table(), add.id); const localOrder = children(await table(), friend).map(r => keyOf(r, data));
  const platform = await open('bzds', 'allMenu'); await drag('0-6', '0-10', .5, { p: platform.p, f: platform.f }); await settle();
  assert.equal(parent(await table(), customer.id), sales.id); await assertProjection();
  await drag('0-7', '0-10', .5, { p: platform.p, f: platform.f }); await settle(); assert.equal(parent(await table(), add.id), byKey(await table(), 'languageManage').id); await assertProjection();
  assert.deepEqual(children(await table(), friend).map(r => keyOf(r, data)), localOrder.filter(k => k !== 'uploadCustomerList'));
  const other = await open('yestar'); assert.ok((await nav(other.p)).find(g => g.routes.includes('languageManage')).routes.includes('customerGroupList'));
  await status('0-10', '隐藏', platform); assert.ok(!routeInventory(await nav()).includes('customerGroupList'), 'platform current ancestor hidden suppresses locally moved route');
  await status('0-10', '显示', platform); assert.ok(routeInventory(await nav()).includes('customerGroupList')); assert.equal(parent(await table(), customer.id), sales.id); await assertProjection();
 });

 await check('platform-order · adjusted lists retain order and untouched groups inherit', async () => {
  const data = await table(), a = byKey(data, 'customerGroupList'), b = byKey(data, 'uploadCustomerList'), friend = parent(data, a.id), sales = byKey(data, 'salesManage');
  await drag(b.id, a.id, .2); await drag(friend, sales.id, .2, { drop: false });
  if (process.env.TENANT_CHECK_DEBUG) console.log('ROOT_PREVIEW', await frame.locator('.menu-drag-ghost').allTextContents(), await frame.locator('#toast').innerText());
  await page.mouse.up(); await settle();
  assert.equal(roots(await table())[0].id, friend, 'tenant root must move before platform changes');
  const customized = await table(), childOrder = children(customized, friend).map(r => r.id), rootOrder = roots(customized).map(r => r.id), platform = await open('bzds', 'allMenu');
  await drag('0-6', '0-5', .2, { p: platform.p, f: platform.f }); await drag('0-3', '0-10', .8, { p: platform.p, f: platform.f });
  assert.deepEqual(children(await table(), friend).map(r => r.id), childOrder); assert.deepEqual(roots(await table()).map(r => r.id), rootOrder); await assertProjection();
  const platformData = await table(platform.f), pA = byKey(platformData, 'wechatStatus'), pB = byKey(platformData, 'wechatLaxin'); assert.ok(pA && pB);
  await drag(pB.id, pA.id, .2, { p: platform.p, f: platform.f }); const current = await table(), aNow = byKey(current, 'wechatStatus'), bNow = byKey(current, 'wechatLaxin');
  assert.ok(ids(current).indexOf(bNow.id) < ids(current).indexOf(aNow.id)); await assertProjection();
  const other = await open('yestar'), otherData = await table(other.f); assert.ok(ids(otherData).indexOf(byKey(otherData, 'wechatLaxin').id) < ids(otherData).indexOf(byKey(otherData, 'wechatStatus').id)); await assertProjection(other.p, other.f);
 });

 await check('invalid-parent · unavailable local target falls back then returns', async () => {
  const data = await table(), a = byKey(data, 'customerGroupList'), target = byKey(data, 'salesManage'); await drag(a.id, target.id);
  const platform = await open('bzds', 'allMenu'); const original = await table(platform.f);
  await platform.f.evaluate(() => { Admin.getTable().rows = Admin.getTable().rows.filter(r => r.id !== '0-0'); Admin.persist('QA 平台删除目标', '', { strict: true }); AdminMenu.render(); }); await settle();
  const fallback = await table(); assert.notEqual(parent(fallback, a.id), target.id); assert.ok(routeInventory(await nav()).includes('customerGroupList')); assert.ok(!routeInventory(await nav()).includes('salesManage')); await assertProjection();
  await platform.f.evaluate(rows => { Admin.getTable().rows = rows; Admin.persist('QA 平台恢复目标', '', { strict: true }); AdminMenu.render(); }, original.rows); await settle();
  assert.equal(parent(await table(), a.id), target.id); assert.ok(routeInventory(await nav()).includes('salesManage')); await assertProjection();
 });

 await check('external-drag · incoming update cancels current drag', async () => {
  const twin = await open('yestar-sz'), data = await table(), a = byKey(data, 'customerGroupList'), target = byKey(data, 'salesManage');
  await drag(a.id, target.id, .5, { drop: false }); assert.equal(await frame.locator('.menu-drag-ghost').count(), 1);
  await twin.f.evaluate(() => { Admin.getTable().rows.find(r => r.tree.key === 'customerGroupList').extra = { qaConcurrent: 'latest' }; Admin.persist('QA 另一窗口更新'); }); await settle(); await page.mouse.up();
  assert.equal(await frame.locator('.menu-drag-ghost').count(), 0); assert.equal(parent(await table(), a.id), parent(data, a.id)); assert.equal(byKey(await table(), 'customerGroupList').extra.qaConcurrent, 'latest'); assert.equal(await frame.locator('.menu-undo-move').count(), 0);
 });

 await check('duplicate-route · conflict preserves inventory and disables related rows', async () => {
  const data = await table(), a = byKey(data, 'customerGroupList'), b = byKey(data, 'uploadCustomerList');
  await frame.evaluate(({ a, b }) => { const rows = Admin.getTable().rows; rows.find(r => r.id === b).tree.key = rows.find(r => r.id === a).tree.key; AdminMenu.render(); }, { a: a.id, b: b.id });
  assert.equal((await table()).rows.length, data.rows.length); assert.equal(await handle(a.id).isDisabled(), true); assert.equal(await handle(b.id).isDisabled(), true); assert.match(await handle(a.id).getAttribute('title'), /冲突|重复/);
 });

 await check('legacy-settings · old numeric order, labels and hidden fields remain', async () => {
  const data = await table(), sales = byKey(data, 'salesManage'), customer = byKey(data, 'customerGroupList'), initialPermission = customer.cells[1];
  await frame.evaluate(() => { const key = 'admin-qa-nav:yestar-sz', old = JSON.parse(localStorage.getItem(key)); old.order = { ...old.order, salesManage: -999 }; old.labels = { ...old.labels, salesManage: '旧名称保留' }; old.display = { ...old.display, customerGroupList: '隐藏' }; localStorage.setItem(key, JSON.stringify(old)); }); await settle();
  await page.reload(); frame = await ready(page); const current = await table(), navigation = await nav();
  assert.equal(navigation.at(-1).routes[0], 'salesManage'); assert.equal(navigation.at(-1).label, '旧名称保留'); assert.ok(!routeInventory(navigation).includes('customerGroupList')); assert.equal(byKey(current, 'customerGroupList').cells[1], initialPermission); assert.ok(!(await model()).menuLayout, 'old numeric settings are not a new explicit drag override'); await assertProjection();
 });

 await check('duplicate-hidden · conflicted rows cannot revive platform-hidden pages', async () => {
  const data = await table(), a = byKey(data, 'customerGroupList'), b = byKey(data, 'uploadCustomerList'), sales = byKey(data, 'salesManage'), script = byKey(data, 'languageManage');
  await drag(sales.id, script.id, .8); assert.ok(ids(await table()).indexOf(sales.id) > ids(await table()).indexOf(script.id));
  await frame.evaluate(({ a, b }) => { const rows = Admin.getTable().rows; rows.find(r => r.id === b).tree.key = rows.find(r => r.id === a).tree.key; Admin.persist('QA 重复路由'); AdminMenu.render(); }, { a: a.id, b: b.id }); await settle();
  const platform = await open('bzds', 'allMenu'); await status('0-3', '隐藏', platform);
  assert.equal((await table()).rows.length, data.rows.length); assert.ok(!routeInventory(await nav()).includes('customerGroupList')); assert.ok(!routeInventory(await nav()).includes('yxCustomerList'));
  assert.ok((await nav()).findIndex(g => g.routes.includes('salesManage')) > (await nav()).findIndex(g => g.routes.includes('languageManage')), 'unrelated local root order retained even under duplicate-route conflict');
 });

 await check('scroll-touch · hover expand, edge scroll, frozen header and touch', async () => {
  const data = await table(), a = byKey(data, 'customerGroupList'), target = roots(data).find(r => r.id !== parent(data, a.id) && children(data, r.id).length > 1), child = children(data, target.id)[0];
  await row(target.id).locator('.menu-tree-toggle').click(); await drag(a.id, target.id, .5, { drop: false }); await page.waitForTimeout(680); assert.equal(await row(child.id).isVisible(), true); await page.screenshot({ path: path.join(__dirname, 'verified-tenant-drag.png') }); await page.keyboard.press('Escape'); await page.mouse.up(); assert.equal(await row(child.id).isVisible(), false);
  await handle(a.id).scrollIntoViewIfNeeded(); const h = await handle(a.id).boundingBox(), w = await frame.locator('.menu-table-wrap').boundingBox(), header = await frame.locator('thead th').first().boundingBox();
  await page.mouse.move(h.x + h.width / 2, h.y + h.height / 2); await page.mouse.down(); await page.mouse.move(w.x + 100, w.y + w.height - 8, { steps: 12 }); await page.waitForTimeout(800); assert.ok(await frame.locator('.menu-table-wrap').evaluate(e => e.scrollTop) > 100); assert.ok(Math.abs((await frame.locator('thead th').first().boundingBox()).y - header.y) < 2); await page.keyboard.press('Escape'); await page.mouse.up();
  const sales = byKey(await table(), 'salesManage'); await handle(a.id).scrollIntoViewIfNeeded(); const s = await handle(a.id).boundingBox(); await row(sales.id).scrollIntoViewIfNeeded(); const t = await row(sales.id).boundingBox(); await handle(a.id).scrollIntoViewIfNeeded();
  const ss = await handle(a.id).boundingBox(), tt = await row(sales.id).boundingBox(), cdp = await context.newCDPSession(page), x = ss.x + ss.width / 2, y = ss.y + ss.height / 2;
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y, id: 0, radiusX: 2, radiusY: 2, force: 1 }] });
  for (let i = 1; i <= 12; i++) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x + (tt.x + 100 - x) * i / 12, y: y + (tt.y + tt.height / 2 - y) * i / 12, id: 0, radiusX: 2, radiusY: 2, force: 1 }] });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await cdp.detach(); assert.equal(parent(await table(), a.id), sales.id); await assertProjection();
 });
 const report = { at: new Date().toISOString(), url: base + '_shell.html?tenant=yestar-sz&page=menu&qa=1', browser: await browser.version(), isolatedContext: true, qaKeysOnly: true, filter: process.env.TENANT_CHECK_FILTER || null, tenants: snapshot.tenants.map(t => t.id), results, errors };
 await fs.writeFile(path.join(__dirname, process.env.TENANT_CHECK_FILTER ? 'tenant-menu-filtered-results.json' : 'tenant-menu-results.json'), JSON.stringify(report, null, 2));
 console.log(JSON.stringify({ passed: results.filter(r => r.status === 'PASS').length, failed: results.filter(r => r.status === 'FAIL').length, errors }));
 await browser.close(); if (results.some(r => r.status === 'FAIL') || errors.length) process.exitCode = 1;
})().catch(async error => { console.error(error); await browser?.close(); process.exitCode = 1; });
