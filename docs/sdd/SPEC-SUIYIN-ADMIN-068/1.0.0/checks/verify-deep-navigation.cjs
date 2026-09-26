const {chromium}=require('C:/Users/georg/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'),assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 try{
  const context=await browser.newContext(),page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  const model=JSON.parse(fs.readFileSync('E:/AI 项目/佰智德三/碎银原型/suiyin-admin/prototype/data/content/yestar-sz.json','utf8')).menu;
  const rows=model.tables[0].rows,first=rows.find(r=>r.tree.key==='customerGroupList');assert(first&&first.tree.depth===1);
  const next=rows[rows.indexOf(first)+1];assert.equal(next.tree.depth,1);next.tree.depth=2;
  await context.addInitScript(model=>{if(!sessionStorage.getItem('deep-seeded')){localStorage.setItem('admin-qa:v1:yestar-sz:menu',JSON.stringify(model));sessionStorage.setItem('deep-seeded','1');}},model);
  await page.goto('http://127.0.0.1:8148/prototype/_shell.html?tenant=yestar-sz&page='+next.tree.key+'&qa=1');
  await page.frameLocator('.frame-wrap:not([hidden]) iframe').locator('body[data-content-ready="true"]').waitFor();
  assert.equal(await page.locator('[data-route="undefined"]').count(),0);
  assert.equal(await page.locator('#navigation [data-route="'+next.tree.key+'"]').isVisible(),true);
  assert.ok(await page.locator('#navigation details details [data-route="'+next.tree.key+'"]').count());
  assert.deepEqual(errors,[]);
  const result={status:'PASS',route:next.tree.key,checks:['historical depth retained','no undefined route','ancestors revealed','page opened'],errors};
  fs.writeFileSync(__dirname+'/deep-navigation-results.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
