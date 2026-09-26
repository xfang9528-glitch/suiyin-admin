/* SPEC-068 full-push smoke: real file:// bundle, fresh Chrome contexts, qa=1. */
const { chromium } = require('C:/Users/georg/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('node:fs/promises'), path = require('node:path'), crypto = require('node:crypto'), assert = require('node:assert/strict');
const { pathToFileURL } = require('node:url');
const file = 'E:/AI 项目/佰智德三/碎银原型/suiyin-admin/prototype/_shell_inline.html';
const url = pathToFileURL(file).href, results = [], errors = [], externalRequests = [];
let browser, context, page, frame;
const row = (id, f = frame) => f.locator(`[data-row-id="${id}"]`);
const table = (f = frame) => f.evaluate(() => structuredClone(Admin.getTable()));
const roots = t => t.rows.filter(r => !r.tree.depth);
function parent(t, id) { let root = ''; for (const r of t.rows) { if (r.id === id) return r.tree.depth ? root : ''; if (!r.tree.depth) root = r.id; } }
const children = (t, id) => t.rows.filter(r => parent(t, r.id) === id);
const route = (r, t) => r.tree.key || r.cells[t.headers.indexOf('菜单路由')] || '';
const byKey = (t, key) => t.rows.find(r => route(r, t) === key);
const ids = t => t.rows.map(r => r.id);
async function ready(p = page) { const iframe = p.locator('.frame-wrap:not([hidden]) iframe'); await p.frameLocator('.frame-wrap:not([hidden]) iframe').locator('body[data-content-ready="true"]').waitFor(); return (await iframe.elementHandle()).contentFrame(); }
async function open(tenant, entry = 'menu') { const p = await context.newPage(); p.on('pageerror', e => errors.push(`${tenant}/${entry}: ${e.message}`)); await p.goto(`${url}?tenant=${tenant}&page=${entry}&qa=1`); return { p, f: await ready(p) }; }
async function reset(tenant) {
 await context?.close(); context = await browser.newContext({ viewport: { width: 1500, height: 1050 } });
 await context.route(/^https?:/i, r => r.abort());
 context.on('request', request => { const value = request.url(); if (/^https?:/i.test(value) || (/^file:/i.test(value) && value.split('?')[0] !== url)) externalRequests.push(value); });
 ({ p: page, f: frame } = await open(tenant));
}
async function settle(p = page) { await p.waitForTimeout(180); }
async function nav(p = page) { return p.evaluate(() => [...document.querySelectorAll('#navigation>ul>li')].map(li => ({ label: li.querySelector('summary>span:last-child,.nav-button>span:last-child')?.textContent, routes: [...li.querySelectorAll('[data-route]')].map(b => b.dataset.route) }))); }
const inventory = n => n.flatMap(g => g.routes).sort();
async function projection(p = page, f = frame) { const n = await nav(p), t = await table(f), visible = new Set(inventory(n)); const expected = roots(t).map(r => [route(r,t), ...children(t,r.id).map(c => route(c,t))].filter(k => visible.has(k))).filter(a => a.length); assert.deepEqual(n.map(g => g.routes), expected); }
async function drag(from, to, position = .5, p = page, f = frame) {
 const handle = row(from,f).locator('.menu-drag-handle'); await handle.evaluate(e => e.scrollIntoView({ block: 'center', inline: 'nearest' })); const s = await handle.boundingBox(); await p.mouse.move(s.x+s.width/2,s.y+s.height/2); await p.mouse.down();
 await row(to,f).evaluate(e => e.scrollIntoView({ block: 'center', inline: 'nearest' })); const t = await row(to,f).boundingBox(); await p.mouse.move(t.x+100,t.y+t.height*position,{ steps:12 }); await p.mouse.up(); await settle(p);
}
async function check(name, action) { await action(); results.push({ name, status: 'PASS' }); console.log('PASS '+name); }
async function saveResult(failure) {
 const bytes = await fs.readFile(file), report = { at: new Date().toISOString(), browser: await browser.version(), file, fileBytes: bytes.length, fileSha256: crypto.createHash('sha256').update(bytes).digest('hex'), isolatedContexts: true, qa: true, httpBlocked: true, results, errors, externalRequests, ...(failure ? { failure: failure.stack } : {}) };
 await fs.writeFile(path.join(__dirname,'inline-068-results.json'), JSON.stringify(report,null,2)+'\n');
}
(async () => {
 browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless:true });
 for (const tenant of ['yestar-sz','bzds']) {
  await reset(tenant); const baseline = await table(), beforeNav = await nav();
  await check(`${tenant}: offline ordinary menu load`, async () => { assert.equal(await frame.locator('thead th').count(),6); assert.equal(await frame.locator('.menu-drag-handle').count(),baseline.rows.length); assert.match(await frame.locator('.menu-memory-hint').innerText(),/本租户/); await projection(); });
  const visible = new Set(inventory(beforeNav)), group = roots(baseline).find(r => children(baseline,r.id).filter(c => visible.has(route(c,baseline))).length >= 2), siblings = children(baseline,group.id).filter(r => visible.has(route(r,baseline))), target = byKey(baseline,'salesManage');
  let moved, movedNav;
  await check(`${tenant}: all three pointer moves update navigation offline`, async () => {
   await drag(siblings[1].id,siblings[0].id,.2); assert.ok(children(await table(),group.id).findIndex(r => r.id===siblings[1].id)<children(await table(),group.id).findIndex(r => r.id===siblings[0].id)); await projection();
   const childOrder = children(await table(),group.id).map(r => r.id); await drag(group.id,target.id,.2); assert.equal(roots(await table())[0].id,group.id); assert.deepEqual(children(await table(),group.id).map(r => r.id),childOrder); await projection();
   await drag(siblings[1].id,target.id); assert.equal(parent(await table(),siblings[1].id),target.id); await projection(); assert.deepEqual(inventory(await nav()),inventory(beforeNav));
   moved = await table(); movedNav = await nav();
  });
  await check(`${tenant}: undo and reload retain saved table and navigation`, async () => {
   await frame.locator('.menu-undo-move').click(); await settle(); assert.equal(parent(await table(),siblings[1].id),group.id); await projection();
   await drag(siblings[1].id,target.id); assert.deepEqual(ids(await table()),ids(moved)); await page.reload(); frame = await ready(); assert.deepEqual(await table(),moved); assert.deepEqual(await nav(),movedNav); assert.equal(await frame.locator('.menu-undo-move').count(),0); await projection();
   await page.screenshot({ path:path.join(__dirname,`inline-068-${tenant}.png`) });
  });
 }
 await reset('bzds');
 await check('offline platform allMenu drag, undo, cross-parent and hide restore', async () => {
  const ordinaryBefore = await nav(), platform = await open('bzds','allMenu'); assert.equal(await platform.f.locator('thead th').count(),9); assert.ok(await platform.f.locator('.menu-drag-handle').count()>90);
  const platformBefore = await nav(platform.p); await drag('0-1','0-10',.8,platform.p,platform.f); let n = await nav(platform.p); assert.ok(n.findIndex(g=>g.routes.includes('expertList'))>n.findIndex(g=>g.routes.includes('languageManage'))); await projection();
  await platform.f.locator('.menu-undo-move').click(); await settle(); assert.deepEqual((await nav(platform.p)).map(g=>g.label),platformBefore.map(g=>g.label));
  await drag('0-2','0-3',.5,platform.p,platform.f); assert.ok((await nav(platform.p)).find(g=>g.routes.includes('expertList')).routes.includes('customerGroupList')); await projection(); assert.deepEqual(inventory(await nav()),inventory(ordinaryBefore));
  for (const value of ['隐藏','显示']) { await row('0-3',platform.f).getByRole('button',{name:'编辑',exact:true}).click(); await platform.f.locator('#dialog').getByText(value,{exact:true}).click(); await platform.f.getByRole('button',{name:'确 定',exact:true}).click(); await settle(); assert.equal(await page.locator('#navigation [data-route="expertList"]').count(),value==='显示'?1:0); }
  const saved = await nav(platform.p); await platform.p.reload(); platform.f = await ready(platform.p); assert.deepEqual(await nav(platform.p),saved); await platform.p.screenshot({path:path.join(__dirname,'inline-068-platform.png')});
 });
 await check('standalone bundle has zero external dependencies and runtime errors', async () => { assert.deepEqual(externalRequests,[]); assert.deepEqual(errors,[]); });
 await saveResult(); console.log(JSON.stringify({passed:results.length,errors,externalRequests})); await browser.close();
})().catch(async error => { console.error(error); if(browser)await saveResult(error); await page?.screenshot({path:path.join(__dirname,'inline-068-failure.png')}).catch(()=>{}); await browser?.close(); process.exitCode=1; });
