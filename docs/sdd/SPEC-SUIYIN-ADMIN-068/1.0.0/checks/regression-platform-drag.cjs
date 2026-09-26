/* 068 regression: ordinary menu now has handles/automatic sequence by approved R001; all platform assertions unchanged. */
/* Local prototype acceptance checks. Uses an isolated Chrome context and QA keys. */
const {chromium}=require('C:/Users/georg/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const path=require('node:path');
const base='http://127.0.0.1:8148/prototype/';
const key='admin-qa:v1:bzds:allMenu';
const results=[],errors=[];let browser,context,page,frame;
const row=id=>frame.locator(`[data-row-id="${id}"]`);
const handle=id=>row(id).locator('.menu-drag-handle');
const model=()=>frame.evaluate(()=>structuredClone(Admin.model));
const table=()=>frame.evaluate(()=>structuredClone(Admin.getTable()));
const ids=data=>data.rows.map(r=>r.id);
const children=(data,id)=>data.rows.filter(r=>r.tree.parentId===id).map(r=>r.id);
async function ready(){await page.frameLocator('iframe').locator('body[data-content-ready="true"]').waitFor();frame=page.frames().find(f=>f.url().includes('admin-content.html'));}
async function reset(){await context?.close();context=await browser.newContext({viewport:{width:1500,height:1050}});page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));await page.goto(base+'_shell.html?tenant=bzds&page=allMenu&qa=1');await ready();}
async function drag(from,to,{position='middle',drop=true}={}){
 await handle(from).scrollIntoViewIfNeeded();const s=await handle(from).boundingBox();await page.mouse.move(s.x+s.width/2,s.y+s.height/2);await page.mouse.down();
 await row(to).scrollIntoViewIfNeeded();const t=await row(to).boundingBox();await page.mouse.move(t.x+100,t.y+t.height*(position==='before'?.22:position==='after'?.78:.5),{steps:12});
 if(drop)await page.mouse.up();
}
async function test(name,run){try{await reset();await run();results.push({name,status:'PASS'});console.log('PASS '+name);}catch(e){results.push({name,status:'FAIL',error:e.stack});console.error('FAIL '+name+' '+e.message);await page.screenshot({path:path.join(__dirname,'failure-'+results.length+'.png')});await page.mouse.up().catch(()=>{});}}
function sameBusiness(before,after){
 const fields=row=>{const copy=structuredClone(row);delete copy.tree;copy.cells.splice(6,1);if(copy.extra){delete copy.extra.parentId;delete copy.extra['排序'];if(!Object.keys(copy.extra).length)delete copy.extra;}return copy;};
 assert.deepEqual(after.rows.map(fields).sort((a,b)=>a.id.localeCompare(b.id)),before.rows.map(fields).sort((a,b)=>a.id.localeCompare(b.id)));
}
(async()=>{
 browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 context=await browser.newContext({viewport:{width:1500,height:1050}});page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 await test('AC-R001-01 · 102 handles, nine columns, automatic order and no numeric form',async()=>{
  assert.equal(await frame.locator('.menu-drag-handle').count(),102);assert.equal(await frame.locator('thead th').count(),9);assert.equal(await frame.locator('thead th').nth(6).innerText(),'顺序');
  assert.equal(await row('0-0').locator('td').nth(6).innerText(),'1');assert.equal(await row('0-1').locator('td').nth(6).innerText(),'2');
  await row('0-1').getByRole('button',{name:'编辑',exact:true}).click();assert.equal(await frame.locator('#dialog input[aria-label="排序"]').count(),0);assert.match(await frame.locator('.menu-order-note').innerText(),/拖动/);await frame.getByRole('button',{name:'取 消',exact:true}).click();
  await page.screenshot({path:path.join(__dirname,'verified-default.png')});
 });
 await test('AC-R002-01 · expanded root moves with all children',async()=>{
  const before=await table(),branch=['0-3',...children(before,'0-3')];await drag('0-3','0-0',{position:'before'});const after=await table();
  assert.deepEqual(ids(after).slice(0,branch.length),branch);assert.deepEqual(children(after,'0-3'),children(before,'0-3'));sameBusiness(before,after);
  assert.equal((await model()).auditRecords.length,(await frame.evaluate(()=>Admin.source.auditRecords?.length||0))+1);
 });
 await test('AC-R002-01 · collapsed root carries hidden children',async()=>{
  const before=await table();await row('0-3').locator('.menu-tree-toggle').click();assert.equal(await row('0-4').isVisible(),false);await drag('0-3','0-0',{position:'before'});
  assert.deepEqual(ids(await table()).slice(0,7),['0-3',...children(before,'0-3')]);assert.equal(await row('0-4').isVisible(),false);
 });
 await test('AC-R003-01 · same-name children reorder by ID',async()=>{
  const before=await table();await drag('0-5','0-4',{position:'before'});const after=await table();assert.deepEqual(children(after,'0-3').slice(0,2),['0-5','0-4']);sameBusiness(before,after);
 });
 await test('AC-R003-01 · child crosses parent with one record',async()=>{
  const before=await table();await drag('0-2','0-3',{drop:false});assert.match(await frame.locator('.menu-drag-ghost').innerText(),/移入「好友管理」/);await page.screenshot({path:path.join(__dirname,'verified-cross-parent-drag.png')});await page.mouse.up();
  const after=await table();assert.equal(after.rows.find(r=>r.id==='0-2').tree.parentId,'0-3');assert.equal(children(after,'0-3').at(-1),'0-2');assert.equal(after.rows.find(r=>r.id==='0-1').tree.hasChildren,false);sameBusiness(before,after);assert.equal(await frame.locator('.menu-undo-move').count(),1);
 });
 await test('AC-R003-01 · empty root receives child and original root remains',async()=>{
  await drag('0-2','0-0');const data=await table();assert.deepEqual(children(data,'0-0'),['0-2']);assert.equal(data.rows.find(r=>r.id==='0-0').tree.hasChildren,true);assert.equal(data.rows.find(r=>r.id==='0-1').tree.hasChildren,false);assert.equal(data.rows.length,102);
 });
 await test('AC-R004-01 · hover expands collapsed target and Escape restores it',async()=>{
  await row('0-3').locator('.menu-tree-toggle').click();const before=await model(),stored=await frame.evaluate(k=>localStorage.getItem(k),key);await drag('0-2','0-3',{drop:false});await page.waitForTimeout(700);assert.equal(await row('0-4').isVisible(),true);await page.keyboard.press('Escape');await page.mouse.up();
  assert.deepEqual(await model(),before);assert.equal(await row('0-4').isVisible(),false);assert.equal(await frame.evaluate(k=>localStorage.getItem(k),key),stored);
 });
 await test('AC-R004-01 · same position and outside-table release are no-ops',async()=>{
  const before=await model();await drag('0-2','0-2');assert.deepEqual(await model(),before);await drag('0-2','0-3',{drop:false});await page.mouse.move(600,210,{steps:5});await page.mouse.up();assert.deepEqual(await model(),before);
 });
 await test('AC-R005-01 · real edge autoscroll, frozen header, horizontal handles',async()=>{
  const s=await handle('0-2').boundingBox(),w=await frame.locator('.menu-table-wrap').boundingBox(),header=await frame.locator('thead').boundingBox();await page.mouse.move(s.x+12,s.y+14);await page.mouse.down();await page.mouse.move(w.x+100,w.y+w.height-8,{steps:12});await page.waitForTimeout(900);
  assert.ok(await frame.locator('.menu-table-wrap').evaluate(n=>n.scrollTop)>100);assert.ok(Math.abs((await frame.locator('thead th').first().boundingBox()).y-header.y)<2);await page.keyboard.press('Escape');await page.mouse.up();
  await frame.locator('.menu-table-wrap').evaluate(n=>{n.scrollTop=0;n.scrollLeft=n.scrollWidth;});assert.ok((await handle('0-0').boundingBox()).x>=w.x);await page.screenshot({path:path.join(__dirname,'verified-horizontal-scroll.png')});
 });
 await test('AC-R006-01 · persist, undo, refresh, preserve prior edits',async()=>{
  await frame.evaluate(()=>{Admin.getTable().rows.find(r=>r.id==='0-0').cells[7]='保留已有备注';Admin.persist('已有修改');});const before=await table();await drag('0-2','0-3');await frame.locator('.menu-undo-move').click();assert.deepEqual(ids(await table()),ids(before));assert.equal((await table()).rows.find(r=>r.id==='0-0').cells[7],'保留已有备注');
  await drag('0-2','0-3');const moved=await table();await page.reload();await ready();assert.deepEqual(await table(),moved);assert.equal(await frame.locator('.menu-undo-move').count(),0);
 });
 await test('AC-R006-02 · failed move and failed undo rollback atomically',async()=>{
  const fail=()=>frame.evaluate(()=>{window.originalSetItem=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k==='admin-qa:v1:bzds:allMenu')throw new DOMException('quota','QuotaExceededError');return window.originalSetItem.call(this,k,v);};});
  const restore=()=>frame.evaluate(()=>Storage.prototype.setItem=window.originalSetItem);
  const before=await model();await fail();await drag('0-2','0-3');assert.deepEqual(await model(),before);assert.match(await frame.locator('#toast').innerText(),/未能保存/);assert.equal(await frame.locator('.menu-undo-move').count(),0);await restore();
  await drag('0-2','0-3');const moved=await model();await fail();await frame.locator('.menu-undo-move').click();assert.deepEqual(await model(),moved);assert.equal(await frame.locator('.menu-undo-move').count(),1);await restore();await frame.locator('.menu-undo-move').click();assert.deepEqual(ids(await table()),ids(before.tables[0]));
 });
 await test('AC-R006-01 · cancelled edit keeps undo, actual edit invalidates it',async()=>{
  await drag('0-2','0-3');await row('0-3').getByRole('button',{name:'编辑',exact:true}).click();await frame.getByRole('button',{name:'取 消',exact:true}).click();assert.equal(await frame.locator('.menu-undo-move').count(),1);
  await row('0-3').getByRole('button',{name:'编辑',exact:true}).click();await frame.locator('[aria-label="菜单名称"]').fill('好友管理测试');await frame.getByRole('button',{name:'确 定',exact:true}).click();assert.equal(await frame.locator('.menu-undo-move').count(),0);
 });
 await test('AC-R007-01 · ordinary menu and other tenant storage remain isolated',async()=>{
  await frame.evaluate(()=>{localStorage.setItem('admin-qa:v1:yestar-sz:menu','sentinel-other');});const before=await frame.evaluate(()=>Object.fromEntries(Object.keys(localStorage).filter(k=>!['admin-qa:v1:bzds:allMenu','admin-qa-menu-view:v1:bzds:allMenu','admin-qa-shell-view:v1:bzds'].includes(k)).map(k=>[k,localStorage.getItem(k)])));await drag('0-2','0-3');
  assert.deepEqual(await frame.evaluate(()=>Object.fromEntries(Object.keys(localStorage).filter(k=>!['admin-qa:v1:bzds:allMenu','admin-qa-menu-view:v1:bzds:allMenu','admin-qa-shell-view:v1:bzds'].includes(k)).map(k=>[k,localStorage.getItem(k)]))),before);
  const other=await context.newPage();await other.goto(base+'admin-content.html?tenant=yestar-sz&route=menu&qa=1');await other.locator('body[data-content-ready="true"]').waitFor();assert.equal(await other.locator('.menu-drag-handle').count(),67);assert.ok((await other.locator('thead').innerText()).includes('顺序'));await other.close();
 });
 await test('AC-R008-01 · keyboard same-parent, cross-parent, root and cancellation',async()=>{
  await handle('0-5').focus();await page.keyboard.press('Space');await page.keyboard.press('ArrowUp');await page.keyboard.press('Enter');assert.equal(children(await table(),'0-3')[0],'0-5');
  await handle('0-2').focus();await page.keyboard.press('Space');await page.keyboard.press('ArrowRight');await page.keyboard.press('Enter');assert.equal((await table()).rows.find(r=>r.id==='0-2').tree.parentId,'0-3');
  await handle('0-3').focus();await page.keyboard.press('Space');await page.keyboard.press('ArrowUp');await page.keyboard.press('Enter');assert.equal((await table()).rows.filter(r=>r.tree.depth===0)[1].id,'0-3');
  const before=await model();await handle('0-3').focus();await page.keyboard.press('Space');await page.keyboard.press('ArrowDown');await page.keyboard.press('Escape');assert.deepEqual(await model(),before);
 });
 await test('AC-R004/008 · legacy third level, readonly and empty state',async()=>{
  await frame.evaluate(()=>{const r=Admin.getTable().rows.find(r=>r.id==='0-5');r.tree.depth=2;r.tree.parentId='0-4';AdminMenu.render();});assert.equal(await handle('0-3').isDisabled(),true);assert.equal(await handle('0-5').isDisabled(),true);assert.equal((await table()).rows.find(r=>r.id==='0-5').tree.depth,2);
  await frame.evaluate(()=>{Admin.model.readOnly=true;AdminMenu.render();});assert.equal(await frame.locator('.menu-drag-handle:not(:disabled)').count(),0);await frame.evaluate(()=>{Admin.getTable().rows=[];AdminMenu.render();});assert.equal(await frame.locator('.menu-drag-handle').count(),0);
 });
 await test('AC-R001-01 · new root appends with automatic sequence',async()=>{
  await frame.getByRole('button',{name:'新增',exact:true}).click();await frame.locator('[aria-label="菜单名称"]').fill('本地新增测试');await frame.locator('[aria-label="唯一标识"]').fill('local_menu_append_test');assert.equal(await frame.locator('#dialog input[aria-label="排序"]').count(),0);await frame.getByRole('button',{name:'确 定',exact:true}).click();
  const data=await table();assert.equal(data.rows.at(-1).cells[0],'本地新增测试');assert.equal(data.rows.at(-1).tree.depth,0);assert.equal(data.rows.at(-1).cells[6],'23');
 });
 await test('AC-R002-01 · root dropped over child goes after entire target group',async()=>{
  await drag('0-0','0-6');const data=await table(),position=ids(data).indexOf('0-0');assert.ok(position>ids(data).indexOf('0-9'));assert.equal(data.rows[position+1].id,'0-10');assert.equal(data.rows.find(r=>r.id==='0-0').tree.depth,0);
 });
 await test('AC-R008-01 · touch drag shares parent and save semantics',async()=>{
  const s=await handle('0-2').boundingBox(),t=await row('0-3').boundingBox(),cdp=await context.newCDPSession(page),x=s.x+s.width/2,y=s.y+s.height/2;
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y,id:0,radiusX:2,radiusY:2,force:1}]});
  for(let i=1;i<=12;i++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+(t.x+100-x)*i/12,y:y+(t.y+t.height/2-y)*i/12,id:0,radiusX:2,radiusY:2,force:1}]});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await cdp.detach();assert.equal((await table()).rows.find(r=>r.id==='0-2').tree.parentId,'0-3');
 });
 assert.deepEqual(errors,[]);await fs.writeFile(path.join(__dirname,'platform-drag-results.json'),JSON.stringify({at:new Date().toISOString(),browser:await browser.version(),url:base+'_shell.html',results,errors},null,2));
 console.log(JSON.stringify({passed:results.filter(r=>r.status==='PASS').length,failed:results.filter(r=>r.status==='FAIL').length,errors}));
 await browser.close();if(results.some(r=>r.status==='FAIL'))process.exitCode=1;
})().catch(async e=>{console.error(e);await browser?.close();process.exitCode=1;});
