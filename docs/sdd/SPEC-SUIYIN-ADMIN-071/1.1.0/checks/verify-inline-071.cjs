/* Real file:// verification of the self-contained SPEC-071 prototype. */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {pathToFileURL}=require('node:url');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=path.resolve(process.env.PROTOTYPE_ROOT||process.cwd());
const file=path.join(root,'prototype/_shell_inline.html'),url=pathToFileURL(file).href;
const results=[],errors=[],externalRequests=[];
const key='admin-qa-admin-revisit-rules:v2:yestar-sz';
let browser,context,page,frame;
async function ready(p){const element=await p.locator('.frame-wrap:not([hidden]) iframe').elementHandle();const f=await element.contentFrame();await f.locator('body[data-content-ready="true"]').waitFor();return f;}
async function open(tenant,route){const p=await context.newPage();p.on('pageerror',e=>errors.push(e.message));await p.goto(`${url}?tenant=${tenant}&page=${route}&qa=1`);return {p,f:await ready(p)};}
async function check(name,fn){await fn();results.push({name,status:'PASS'});console.log('PASS '+name);}
async function report(failure){const bytes=fs.readFileSync(file);fs.writeFileSync(path.join(__dirname,'inline-071-results.json'),JSON.stringify({verifiedAt:new Date().toISOString(),browser:await browser.version(),file:'prototype/_shell_inline.html',sha256:crypto.createHash('sha256').update(bytes).digest('hex'),bytes:bytes.length,httpBlocked:true,results,errors,externalRequests,...(failure?{failure:String(failure)}:{})},null,2)+'\n');}
(async()=>{try{
 browser=await chromium.launch(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH,headless:true}:{channel:'chrome',headless:true});
 context=await browser.newContext({viewport:{width:1512,height:982},locale:'zh-CN'});
 await context.route(/^https?:/i,r=>r.abort());
 context.on('request',r=>{if(/^https?:/i.test(r.url())||(/^file:/i.test(r.url())&&r.url().split('?')[0]!==url))externalRequests.push(r.url());});
 ({p:page,f:frame}=await open('yestar-sz','revisitRules'));
 const row=()=>frame.locator('[data-rule-id="demo-added-followup"]');
 const store=()=>frame.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);
 await check('离线菜单进入单条规则与三节点合并试算',async()=>{
  assert.equal(await page.locator('#navigation [data-route="revisitRules"]').count(),1);
  await row().getByRole('button',{name:'试算',exact:true}).click();
  assert.equal(await frame.locator('.rr-trial-status.included').count(),5);
  assert.equal(await frame.locator('.rr-trial-status.unknown').count(),2);
  await frame.locator('dialog').getByRole('button',{name:'关闭',exact:true}).click();
 });
 await check('离线节点复制仅替换筛选、独立编辑与整条保存',async()=>{
  await row().getByRole('button',{name:'编辑',exact:true}).click();
  assert.equal(await frame.locator('select[aria-label="添加选中条件"] option').count(),22);
  assert.equal(await frame.locator('select[aria-label="添加排除条件"] option').count(),27);
  await frame.getByLabel('我方发过消息近几天',{exact:true}).fill('4');
  await frame.locator('[data-node-id="day-5"]').click();
  await frame.getByRole('button',{name:'复制其他节点条件',exact:true}).click();
  await frame.locator('dialog').getByRole('button',{name:'确认替换条件',exact:true}).click();
  assert.equal(await frame.getByLabel('节点天数',{exact:true}).inputValue(),'5');
  assert.equal(await frame.getByLabel('我方发过消息近几天',{exact:true}).inputValue(),'4');
  await frame.getByLabel('我方发过消息近几天',{exact:true}).fill('1');
  await frame.getByRole('button',{name:'保存整条规则',exact:true}).click();
  const data=await store();assert.equal(data.length,1);assert.deepEqual(data[0].nodes.map(n=>n.day),['3','5','7']);
  assert.equal(data[0].nodes[0].exclude[0].value,'4');assert.equal(data[0].nodes[1].exclude[0].value,'1');
 });
 await check('离线整体启停与刷新恢复',async()=>{
  await row().getByRole('button',{name:'启用',exact:true}).click();assert.equal((await store())[0].enabled,true);
  await page.reload();frame=await ready(page);assert.equal((await store())[0].nodes[1].exclude[0].value,'1');
  await row().getByRole('button',{name:'暂停',exact:true}).click();assert.equal((await store())[0].enabled,false);
  await frame.locator('body').screenshot({path:path.join(__dirname,'inline-071-list.png')});
 });
 await check('离线重复节点阻断与取消恢复',async()=>{
  await row().getByRole('button',{name:'编辑',exact:true}).click();
  await frame.getByRole('button',{name:'＋ 新增节点',exact:true}).click();await frame.getByLabel('节点天数',{exact:true}).fill('5');
  await frame.getByRole('button',{name:'保存整条规则',exact:true}).click();assert.match(await frame.locator('.rr-form-error').innerText(),/不能重复/);
  await frame.getByRole('button',{name:'取消',exact:true}).click();await frame.locator('dialog').getByRole('button',{name:'放弃并返回',exact:true}).click();
  assert.equal((await store())[0].nodes.length,3);
 });
 await check('菜单管理与德三平台登记一致，其他租户没有回访规则入口',async()=>{
  for(const [tenant,route] of [['yestar-sz','menu'],['bzds','allMenu']]){const {p,f}=await open(tenant,route);const model=await f.evaluate(()=>Admin.getTable());const entry=model.rows.filter(r=>r.id==='0-revisitRules');assert.equal(entry.length,1);assert.equal(entry[0].tree.key,'revisitRules');await p.close();}
  const {p,f}=await open('yestar-hz','menu');assert.equal(await p.locator('#navigation [data-route="revisitRules"]').count(),0);assert.equal(await f.locator('[data-row-id="0-revisitRules"]').count(),0);await p.close();
 });
 await check('单文件没有外部请求或脚本错误',async()=>{assert.deepEqual(errors,[]);assert.deepEqual(externalRequests,[]);});
 await report();console.log(JSON.stringify({passed:results.length,errors,externalRequests}));
}catch(error){if(browser)await report(error);throw error;}finally{await browser?.close();}})().catch(error=>{console.error(error);process.exitCode=1;});
