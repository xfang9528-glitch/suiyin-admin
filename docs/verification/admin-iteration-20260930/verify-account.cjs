const {chromium}=require('C:/Users/georg/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
const root='E:/AI 项目/佰智德三/碎银原型/suiyin-admin',base='http://127.0.0.1:5200/prototype/';
const snapshot=JSON.parse(fs.readFileSync(root+'/prototype/data/navigation-snapshot.json','utf8'));
const expectedOff=new Set(['yestar-sz','yestar','yestar-bj','yestar-gz','yestar-hz','yestar-jx','huamei-xian','aoli-xian']);
const remaining=process.env.CHECK_ONLY==='remaining';
const newIds=new Set(['huamei-xian','aoli-xian']),results=remaining?JSON.parse(fs.readFileSync(path.join(__dirname,'account-results.json'),'utf8')).results.filter(r=>r.status==='PASS'):[],errors=[],requests=[];
let browser,context,page;
function record(name){results.push({name,status:'PASS'});console.log('PASS '+name);}
async function frameFor(route){await page.locator('#panel-'+route+' iframe').waitFor();const frame=await (await page.locator('#panel-'+route+' iframe').elementHandle()).contentFrame();await frame.locator('body[data-content-ready="true"]').waitFor();return frame;}
async function open(tenant,route){await page.goto(base+'_shell.html?tenant='+tenant+'&page='+route+'&qa=1');return frameFor(route==='sales'?'salesManage':route);}
(async()=>{browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,ignoreDefaultArgs:['--hide-scrollbars']});context=await browser.newContext({viewport:{width:1480,height:900}});page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:5200/')&&!r.url().startsWith('data:'))requests.push(r.url());});page.setDefaultTimeout(12000);
try{
 let frame;
 if(!remaining){
 assert.equal(snapshot.tenants.length,17);assert.equal(new Set(snapshot.tenants.map(t=>t.id)).size,17);record('17 tenants: unique registered identities');
 for(const tenant of snapshot.tenants){
  let frame=await open(tenant.id,'salesManage');
  assert.match(await page.locator('#tab-salesManage').innerText(),/碎银账号/);assert.match(await frame.locator('h1').innerText(),/碎银账号/);assert.equal(await page.locator('[data-route="salesManage"]').innerText(),'碎银账号');
  assert.equal(await frame.locator('input[aria-label$="每日自动下班时间"]').count(),expectedOff.has(tenant.id)?0:1);
  if(!expectedOff.has(tenant.id))assert.equal(await frame.locator('input[aria-label="全体销售每日自动下班时间"]').count(),1);
  assert.equal(await frame.locator('input[placeholder="下班时间"]').count(),0);
  if(newIds.has(tenant.id)){assert.match(await frame.locator('#app').innerText(),/待采集/);assert.doesNotMatch(await frame.locator('#app').innerText(),/真实快照|1970|暂无数据/);assert.equal(await frame.evaluate(()=>Admin.model.tables.reduce((n,t)=>n+t.rows.length,0)),0);}
  else assert.equal(await frame.locator('input[aria-label="离开状态可转交"]').count(),1);
  record(tenant.id+': account label and duty-time scope');
  frame=await open(tenant.id,'setting');const text=await frame.locator('#app').innerText();assert.equal(/设置全体(?:销售|咨询)每日自动下班时间/.test(text),!expectedOff.has(tenant.id));if(!expectedOff.has(tenant.id))assert.match(text,/设置全体销售每日自动下班时间/);record(tenant.id+': system-setting time scope');
  frame=await open(tenant.id,'menu');const account=await frame.evaluate(()=>Admin.getTable().rows.find(r=>r.tree?.key==='salesManage'));
  assert.equal(account.cells[0],'碎银账号');assert.equal(await frame.locator('[data-row-id="'+account.id+'"] [role="radio"]').count(),2);
  if(newIds.has(tenant.id)){assert.match(await frame.locator('.menu-source-note').innerText(),/待采集/);assert.equal(await page.locator('[data-route="guideLineManage"],[data-route="revisitRules"]').count(),0);assert.equal(await frame.evaluate(()=>Admin.model.auditRecords?.length||0),0);await page.screenshot({path:path.join(__dirname,tenant.id+'-menu.png')});}
  record(tenant.id+': menu name, capsule and isolated scope');
 }
 frame=await open('bzds','allMenu');assert.equal(await frame.evaluate(()=>Admin.getTable().rows.find(r=>r.cells.includes('salesManage')).cells[0]),'碎银账号');assert.equal(await frame.evaluate(()=>Admin.getTable().rows.find(r=>r.cells.includes('salesManage')).cells[1]),'碎银账号');record('platform definition: both account names');
 // Seed a genuine pre-076 content model and navigation override, retaining all other fields.
 await open('yestar-sz','menu');await page.evaluate(async()=>{const d=await fetch('data/content/yestar-sz.json').then(r=>r.json());const row=d.menu.tables[0].rows.find(r=>r.tree.key==='salesManage');row.extra={...row.extra,qaMarker:'preserve'};d.menu.history=[{action:'旧配置',object:'preserve',time:'2026-09-29'}];localStorage.setItem('admin-qa:v1:yestar-sz:menu',JSON.stringify(d.menu));const key='admin-qa-nav:yestar-sz',o=JSON.parse(localStorage.getItem(key));o.labels={...o.labels,salesManage:'销售管理'};localStorage.setItem(key,JSON.stringify(o));});
 frame=await open('yestar-sz','menu');let data=await frame.evaluate(()=>({r:Admin.getTable().rows.find(r=>r.tree.key==='salesManage'),history:Admin.model.history}));assert.equal(data.r.cells[0],'碎银账号');assert.equal(data.r.extra.qaMarker,'preserve');assert.equal(data.history[0].action,'旧配置');record('old cache: default name migrates without losing custom fields/history');
 await page.evaluate(()=>{const k='admin-qa:v1:yestar-sz:menu',m=JSON.parse(localStorage.getItem(k));const row=m.tables[0].rows.find(r=>r.tree.key==='salesManage');row.cells[0]='咨询账号';if(row.tree.menuResolved){row.tree.menuLocalLabel='咨询账号';row.tree.menuRenderedLabel='咨询账号';}localStorage.setItem(k,JSON.stringify(m));const nk='admin-qa-nav:yestar-sz',n=JSON.parse(localStorage.getItem(nk));n.labels.salesManage='咨询账号';localStorage.setItem(nk,JSON.stringify(n));});
 frame=await open('yestar-sz','sales');assert.match(await page.locator('#tab-salesManage').innerText(),/咨询账号/);assert.equal(new URL(page.url()).searchParams.get('page'),'salesManage');record('old sales URL works with explicit custom name');
 frame=await open('yestar-sz','salesManage');await frame.evaluate(()=>{Admin.model.config={autoOffTime:'21:17',leaveTransfer:false};Admin.persist('旧配置');});frame=await open('yestar-sz','salesManage');assert.equal(await frame.locator('input[type="time"]').count(),0);await frame.locator('input[aria-label="离开状态可转交"]').check();await frame.getByRole('button',{name:'保存接待设置',exact:true}).click();assert.deepEqual(await frame.evaluate(()=>Admin.model.config),{autoOffTime:'21:17',leaveTransfer:true});record('removed duty value stays untouched while independent checkbox saves');
 }
 frame=await open('yestar','dutyRecord');assert.match(await page.locator('#tab-dutyRecord').innerText(),/上班记录/);assert.equal(await frame.evaluate(()=>Admin.getTable().headers.includes('时间')&&Admin.getTable().headers.includes('状态')),true);record('unrelated duty records remain in the existing visible tenant');
 await open('huamei-xian','menu');await page.getByRole('button',{name:'房昕',exact:false}).click();assert.equal(await page.locator('.tenant-choice').count(),17);assert.equal(await page.locator('.tenant-choice').filter({hasText:'画美医美-西安'}).count(),1);assert.equal(await page.locator('.tenant-choice').filter({hasText:'傲丽医美-西安'}).count(),1);await page.keyboard.press('Escape');record('tenant switcher shows both new tenants once');
 for(const viewport of [{width:1480,height:900},{width:1280,height:720}]){await page.setViewportSize(viewport);await open('huamei-xian','menu');assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);await page.screenshot({path:path.join(__dirname,'huamei-menu-'+viewport.width+'.png')});}record('new-tenant complete shell fits 1480 and 1280');
 await open('aoli-xian','salesManage');await page.screenshot({path:path.join(__dirname,'aoli-account-pending.png')});
 assert.deepEqual(errors,[]);assert.deepEqual(requests,[]);record('zero script errors and external requests');
}catch(e){results.push({name:'FAILED',status:'FAIL',error:e.stack});console.error(e.stack);await page.screenshot({path:path.join(__dirname,'account-failure.png')}).catch(()=>{});process.exitCode=1;}finally{fs.writeFileSync(path.join(__dirname,'account-results.json'),JSON.stringify({results,errors,externalRequests:requests},null,2));await browser.close();}})();
