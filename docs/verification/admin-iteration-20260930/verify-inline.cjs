const {chromium}=require('C:/Users/georg/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'),path=require('path'),assert=require('node:assert/strict'),{pathToFileURL}=require('url');
const repo='E:/AI 项目/佰智德三/碎银原型/suiyin-admin',http='http://127.0.0.1:5200/prototype/',results=[],pageErrors=[],externalRequests=[];let browser;
const pass=name=>{results.push({name,passed:true});console.log('PASS '+name);};
function watch(page){page.on('pageerror',e=>pageErrors.push(e.message));page.on('request',r=>{if(!/^(http:\/\/127\.0\.0\.1:5200\/|file:|data:|about:)/.test(r.url()))externalRequests.push(r.url());});}
async function shell(page,base,tenant,route){await page.goto(base+'?tenant='+tenant+'&page='+route+'&qa=1');const frame=page.frameLocator('#panel-'+route+' iframe');await frame.locator('body[data-content-ready=true]').waitFor();return (await page.locator('#panel-'+route+' iframe').elementHandle()).contentFrame();}
(async()=>{browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});try{
 let context=await browser.newContext({viewport:{width:1480,height:1000}}),page=await context.newPage();watch(page);await page.goto(http+'_inline-check.html');await page.locator('#run').click();
 const timer=setInterval(async()=>{try{console.log('SELF-CHECK '+await page.locator('#report').innerText());}catch{}},30000);
 try{await page.waitForFunction(()=>document.querySelector('#report').dataset.complete==='true',null,{timeout:360000});}finally{clearInterval(timer);}
 const existing=await page.evaluate(()=>results);results.push(...existing);console.log('SELF-CHECK DONE '+JSON.stringify({passed:existing.filter(x=>x.passed).length,failed:existing.filter(x=>!x.passed)}));assert.ok(existing.every(x=>x.passed),'existing inline check failed');await context.close();
 const targetIds=['yestar-sz','yestar','yestar-bj','yestar-gz','yestar-hz','yestar-jx','huamei-xian','aoli-xian'];
 for(const transport of ['http','file']){
  context=await browser.newContext({viewport:{width:1480,height:900}});page=await context.newPage();watch(page);page.setDefaultTimeout(15000);
  const base=transport==='http'?http+'_shell_inline.html':pathToFileURL(repo+'/prototype/_shell_inline.html').href;
  for(const tenant of targetIds){
   const f=await shell(page,base,tenant,'salesManage');assert.equal(await page.locator('[data-route="salesManage"]').innerText(),'碎银账号');assert.equal(await f.evaluate(()=>Admin.tenant),tenant);assert.equal(await f.evaluate(()=>new URLSearchParams(window.__ADMIN_INLINE_PARAMS__).get('qa')),'1');
   if(tenant==='huamei-xian'||tenant==='aoli-xian'){const text=await f.locator('#app').innerText();assert.match(text,/待采集/);for(const name of ['线上咨询','现场咨询','科室助理'])assert.ok(text.includes(name));assert.equal(await f.evaluate(()=>Admin.getTable().rows.length),0);}
   else{assert.ok((await f.locator('th').allTextContents()).includes('咨询姓名'));await f.evaluate(()=>Admin.edit(Admin.getTable().rows[0]));assert.match(await f.locator('#dialogTitle').innerText(),/咨询/);const choices=await f.evaluate(()=>Admin.optionsFor('权限角色','edit'));for(const name of ['线上咨询','现场咨询','科室助理'])assert.ok(choices.includes(name));assert.ok(!choices.includes('销售'));await f.locator('#dialogFooter button').filter({hasText:/取\s*消/}).click();}
   assert.equal(await page.evaluate(()=>performance.getEntriesByType('resource').length),0);assert.equal(await f.evaluate(()=>performance.getEntriesByType('resource').length),0);pass(transport+' '+tenant+' consultation labels, three roles and offline data');
  }
  let f=await shell(page,base,'bzds','salesManage');assert.ok((await f.locator('th').allTextContents()).includes('销售姓名'));pass(transport+' non-target BZDS retains sales terminology');
  for(const [tenant,route]of [['yestar-sz','menu'],['bzds','allMenu']]){
   f=await shell(page,base,tenant,route);const id=await f.evaluate(()=>Admin.getTable().rows.find(r=>Admin.route==='allMenu'?r.cells[Admin.getTable().headers.indexOf('菜单路由')]==='salesManage':r.tree?.key==='salesManage').id),opt=value=>f.locator('[data-row-id="'+id+'"] .menu-status-option[data-value="'+value+'"]');
   await opt('隐藏').click();assert.equal(await opt('隐藏').getAttribute('aria-checked'),'true');await page.waitForFunction(()=>!document.querySelector('#navigation [data-route="salesManage"]'));
   f=await shell(page,base,tenant,route);assert.equal(await opt('隐藏').getAttribute('aria-checked'),'true');await opt('显示').click();await page.waitForFunction(()=>!!document.querySelector('#navigation [data-route="salesManage"]'));
   const before=await f.evaluate(()=>JSON.stringify(Admin.model));await f.evaluate(()=>{window.qaSet=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k==='admin-qa:v1:'+Admin.tenant+':'+Admin.route)throw new DOMException('quota','QuotaExceededError');return window.qaSet.call(this,k,v);};});await opt('隐藏').click();assert.equal(await opt('显示').getAttribute('aria-checked'),'true');assert.equal(await f.evaluate(()=>JSON.stringify(Admin.model)),before);await f.evaluate(()=>Storage.prototype.setItem=window.qaSet);assert.equal(await page.evaluate(()=>performance.getEntriesByType('resource').length),0);assert.equal(await f.evaluate(()=>performance.getEntriesByType('resource').length),0);pass(transport+' '+tenant+'/'+route+' capsule save/reload/navigation/rollback offline');
  }
  await context.close();
 }
 assert.deepEqual(pageErrors,[]);assert.deepEqual(externalRequests,[]);pass('zero script errors and external requests');
}catch(e){results.push({name:'runner failure',passed:false,error:e.stack});console.error(e.stack);process.exitCode=1;}finally{const report={at:new Date().toISOString(),browser:await browser.version(),inlineSha256:require('crypto').createHash('sha256').update(fs.readFileSync(repo+'/prototype/_shell_inline.html')).digest('hex'),isolatedContexts:true,qaOnly:true,passed:results.filter(x=>x.passed).length,failed:results.filter(x=>!x.passed).length,results,pageErrors,externalRequests};fs.writeFileSync(path.join(__dirname,'inline-results.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({passed:report.passed,failed:report.failed,pageErrors,externalRequests}));await browser.close();}})();
