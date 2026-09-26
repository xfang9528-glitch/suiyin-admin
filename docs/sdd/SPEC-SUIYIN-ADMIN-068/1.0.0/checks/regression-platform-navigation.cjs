/* Actual Chrome, isolated storage, exact daily URL; never touches the user's Chrome profile. */
const {chromium}=require('C:/Users/georg/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const path=require('node:path');
const repo='E:/AI 项目/佰智德三/碎银原型/suiyin-admin';
const base='http://127.0.0.1:8148/prototype/';
const url=base+'_shell.html?tenant=bzds&page=allMenu';
const results=[],errors=[],pages=new Map();let browser,context,page,frame;
const row=id=>frame.locator(`[data-row-id="${id}"]`);
async function wait(){await page.waitForTimeout(180);}
async function nav(p){return p.evaluate(()=>[...document.querySelectorAll('#navigation>ul>li')].map(li=>({label:li.querySelector('summary>span:last-child,.nav-button>span:last-child')?.textContent,routes:[...li.querySelectorAll('[data-route]')].map(b=>b.dataset.route)})));}
const routes=n=>n.flatMap(g=>g.routes).sort();
async function check(name,run){await run();results.push({name,status:'PASS'});console.log('PASS '+name);}
async function drag(from,to,position=.5){await row(from).locator('.menu-drag-handle').scrollIntoViewIfNeeded();const a=await row(from).locator('.menu-drag-handle').boundingBox();await page.mouse.move(a.x+a.width/2,a.y+a.height/2);await page.mouse.down();await row(to).scrollIntoViewIfNeeded();const b=await row(to).boundingBox();await page.mouse.move(b.x+100,b.y+b.height*position,{steps:10});await page.mouse.up();await wait();}
async function status(id,value){await row(id).getByRole('button',{name:'编辑',exact:true}).click();await frame.locator('#dialog').getByText(value,{exact:true}).click();await frame.getByRole('button',{name:'确 定',exact:true}).click();await wait();}
(async()=>{
 browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});context=await browser.newContext({viewport:{width:1500,height:1050}});
 const snapshot=JSON.parse(await fs.readFile(path.join(repo,'prototype/data/navigation-snapshot.json'),'utf8'));
 for(const tenant of snapshot.tenants.filter(t=>!process.env.PLATFORM_CHECK_FAST||['bzds','yestar-sz'].includes(t.id))){const p=await context.newPage();pages.set(tenant.id,p);p.on('pageerror',e=>errors.push(tenant.id+': '+e.message));await p.goto(base+'_shell.html?tenant='+tenant.id+'&page='+(tenant.id==='bzds'?'allMenu':'menu'));await p.frameLocator('.frame-wrap:not([hidden]) iframe').locator('body[data-content-ready="true"]').waitFor();}
 page=pages.get('bzds');frame=page.frames().find(f=>f.url().includes('route=allMenu&'));const before=new Map();for(const [id,p]of pages)before.set(id,await nav(p));
 let reloads=0;for(const p of pages.values())p.on('request',r=>{if(r.isNavigationRequest()&&r.frame()===p.mainFrame())reloads++;});
 await frame.evaluate(()=>window.navigationToken='keep-editor');
 await check('R009: root reorder propagates live to all 15 open tenant sidebars',async()=>{
  await drag('0-1','0-10',.8);
  for(const [id,p]of pages){const n=await nav(p);assert.deepEqual(routes(n),routes(before.get(id)),id+' inventory');const e=n.findIndex(g=>g.routes.includes('expertList'));if(e>=0)assert.ok(n.findIndex(g=>g.routes.includes('languageManage'))<e,id+' expert moved after script');}
  assert.equal(reloads,0);assert.equal(await frame.evaluate(()=>window.navigationToken),'keep-editor');
 });
 await check('R009: undo restores root order in other windows without document reload',async()=>{
  await frame.getByRole('button',{name:'撤销上次移动',exact:true}).click();await wait();for(const [id,p]of pages){const n=await nav(p);if(routes(n).includes('expertList'))assert.ok(n.findIndex(g=>g.routes.includes('expertList'))<n.findIndex(g=>g.routes.includes('languageManage')),id);}
 });
 await check('R003/R009: child reparent reaches every eligible tenant and preserves page routes',async()=>{
  await drag('0-2','0-3');
  for(const [id,p]of pages){const n=await nav(p);assert.deepEqual(routes(n),routes(before.get(id)),id+' inventory');if(routes(n).includes('expertList')){const g=n.find(g=>g.routes.includes('expertList'));assert.ok(g.routes.includes('customerGroupList'),id+' expert belongs to friends');assert.ok(!n.some(g=>g.label==='专家管理'),id+' empty group omitted');}}
 });
 await check('R007: same-name platform routes do not hide another tenant variant',async()=>{
  await status('0-4','隐藏');assert.equal(await page.locator('#navigation [data-route="customerManagement"]').count(),0);assert.equal(await pages.get('yestar-sz').locator('#navigation [data-route="yxCustomerList"]').count(),1);await status('0-4','显示');
 });
 await check('R009: hide/show root affects its current children across all 15 tenants',async()=>{
  await status('0-3','隐藏');for(const [id,p]of pages){const r=routes(await nav(p));assert.ok(!r.includes('customerGroupList'),id);assert.ok(!r.includes('expertList'),id);}
  await status('0-3','显示');for(const [id,p]of pages)assert.deepEqual(routes(await nav(p)),routes(before.get(id)),id+' restored inventory');
 });
 await check('R009: failed platform save keeps every sidebar at the last saved state',async()=>{
  const saved=[];for(const p of pages.values())saved.push(await nav(p));await frame.evaluate(()=>{window.realSet=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k==='admin-content:v1:bzds:allMenu')throw new DOMException('quota','QuotaExceededError');return window.realSet.call(this,k,v);};});
  await status('0-3','隐藏');assert.match(await frame.locator('#toast').innerText(),/未能保存/);let i=0;for(const p of pages.values())assert.deepEqual(await nav(p),saved[i++]);await frame.evaluate(()=>Storage.prototype.setItem=window.realSet);await frame.getByRole('button',{name:'取 消',exact:true}).click();
 });
 await check('R009: reload and newly opened tenant use the saved cross-parent structure',async()=>{
  const tenant=[...before].find(([id,n])=>id!=='bzds'&&routes(n).includes('expertList'))?.[0]||'bzds';
  const p=pages.get(tenant),saved=await nav(p);await p.reload();await p.locator('#navigation [data-route="expertList"]').waitFor({state:'attached'});assert.deepEqual(await nav(p),saved);
  const fresh=await context.newPage();await fresh.goto(base+'_shell.html?tenant='+tenant+'&page=menu');await fresh.locator('#navigation [data-route="expertList"]').waitFor({state:'attached'});assert.deepEqual(await nav(fresh),saved);await fresh.close();
 });
 await check('R007: tenant-specific hidden setting remains effective under platform show',async()=>{
  const p=pages.get('yestar-sz');await p.evaluate(()=>{const key='admin-nav-override:yestar-sz',s=JSON.parse(localStorage.getItem(key));s.display={...s.display,customerGroupList:'隐藏'};localStorage.setItem(key,JSON.stringify(s));dispatchEvent(new StorageEvent('storage',{key}));});await wait();assert.equal(await p.locator('#navigation [data-route="customerGroupList"]').count(),0);assert.equal(await page.locator('#navigation [data-route="customerGroupList"]').count(),1);
 });
 await check('R009: existing version 1.0 saved configuration is adopted on first load',async()=>{
  const legacy=JSON.parse(await fs.readFile(path.join(repo,'prototype/data/content/bzds.json'),'utf8')).allMenu;
  const rows=legacy.tables[0].rows,branch=rows.splice(rows.findIndex(r=>r.id==='0-1'),2),destination=rows.findIndex(r=>r.id==='0-10')+1;rows.splice(destination,0,...branch);rows.find(r=>r.id==='0-0').cells[4]='隐藏';legacy.history=[{action:'移动菜单',object:'专家管理',time:'2026-09-21'}];
  const other=await browser.newContext({viewport:{width:1500,height:1050}});await other.addInitScript(saved=>{if(!localStorage.getItem('admin-content:v1:bzds:allMenu'))localStorage.setItem('admin-content:v1:bzds:allMenu',JSON.stringify(saved));},legacy);
  const p=await other.newPage();await p.goto(url);await p.locator('#navigation [data-route="expertList"]').waitFor({state:'attached'});const n=await nav(p);assert.ok(!routes(n).includes('salesManage'));assert.ok(n.findIndex(g=>g.routes.includes('expertList'))>n.findIndex(g=>g.routes.includes('languageManage')));await p.frameLocator('.frame-wrap:not([hidden]) iframe').locator('body[data-content-ready="true"]').waitFor();await p.screenshot({path:path.join(__dirname,'platform-legacy-restored.png')});await other.close();
 });
 await page.screenshot({path:path.join(__dirname,'platform-navigation-linked.png')});assert.deepEqual(errors,[]);
 await fs.writeFile(path.join(__dirname,process.env.PLATFORM_CHECK_FAST?'platform-navigation-fast-results.json':'platform-navigation-results.json'),JSON.stringify({at:new Date().toISOString(),url,browser:await browser.version(),tenants:[...pages.keys()],isolatedContext:true,results,errors},null,2));await browser.close();console.log(JSON.stringify({passed:results.length,tenants:pages.size,errors}));
})().catch(async e=>{console.error(e);for(const [id,p]of pages){console.error(id,JSON.stringify(await p.evaluate(()=>({state:document.querySelector('.shell-state')?.innerText,nav:document.getElementById('navigation')?.innerText,platform:JSON.parse(localStorage.getItem('admin-content:v1:bzds:allMenu'))?.tables[0].rows.filter(r=>['0-1','0-2','0-3'].includes(r.id)).map(r=>({id:r.id,name:r.cells[0],status:r.cells[4],tree:r.tree})),local:JSON.parse(localStorage.getItem('admin-nav-override:'+new URLSearchParams(location.search).get('tenant')))}))));}console.error('PAGE_ERRORS',errors);await page?.screenshot({path:path.join(__dirname,'platform-navigation-failure.png')});await browser?.close();process.exitCode=1;});
