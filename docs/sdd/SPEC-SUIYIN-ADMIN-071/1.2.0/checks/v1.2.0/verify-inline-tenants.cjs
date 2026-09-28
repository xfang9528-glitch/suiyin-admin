/* SPEC-SUIYIN-ADMIN-071@1.2.0: actual file:// checks for the six-tenant build. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),vm=require('node:vm'),assert=require('node:assert/strict');
const {pathToFileURL}=require('node:url');
let chromium;try{({chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'));}catch(_){throw Error('Install Playwright or set PLAYWRIGHT_MODULE to an existing module.');}
const root=path.resolve(process.env.PROTOTYPE_ROOT||process.cwd()),relative='prototype/_shell_inline.html',file=path.join(root,relative);
if(!fs.existsSync(file))throw Error('Run from the prototype repository or set PROTOTYPE_ROOT. Build prototype/_shell_inline.html first.');
const fileUrl=pathToFileURL(file).href,hash=value=>crypto.createHash('sha256').update(value).digest('hex'),plain=value=>JSON.parse(JSON.stringify(value)),normalize=value=>value.replace(/\r\n/g,'\n');
const tenants=[['yestar-sz','深圳'],['yestar','成都'],['yestar-bj','北京'],['yestar-gz','广州'],['yestar-hz','杭州'],['yestar-jx','嘉兴']];
const sourceFiles=['prototype/admin-revisit-rules-model.js','prototype/admin-revisit-rules.js','prototype/admin-menu-state.js','prototype/data/navigation-snapshot.json',...tenants.map(([id])=>'prototype/data/content/'+id+'.json')];
const sourceHashes=Object.fromEntries(sourceFiles.map(p=>[p,hash(fs.readFileSync(path.join(root,p)))]));
const registrySandbox={};vm.createContext(registrySandbox);vm.runInContext(fs.readFileSync(path.join(root,sourceFiles[0]),'utf8'),registrySandbox);
const expectedRegistry=registrySandbox.RevisitRuleModel;
const uiSandbox={window:{}};vm.createContext(uiSandbox);vm.runInContext(fs.readFileSync(path.join(root,sourceFiles[1]),'utf8').replaceAll('new URLSearchParams(location.search)','new URLSearchParams(window.__ADMIN_INLINE_PARAMS__||location.search)'),uiSandbox);
const expectedMount=normalize(uiSandbox.window.AdminRevisitRules.mount.toString());
const nav=JSON.parse(fs.readFileSync(path.join(root,'prototype/data/navigation-snapshot.json'),'utf8'));
const results=[],errors=[],externalRequests=[],screenshots=[];let browser,context,page,frame,active='setup';
const key=(id,qa=true)=>(qa?'admin-qa-':'')+'admin-revisit-rules:v2:'+id;
async function ready(p){await p.locator('.frame-wrap:not([hidden]) iframe').waitFor();const element=await p.locator('.frame-wrap:not([hidden]) iframe').elementHandle();const f=await element.contentFrame();await f.locator('body[data-content-ready="true"]').waitFor();return f;}
async function open(tenant,route='revisitRules',qa=true){await page.goto(fileUrl+'?tenant='+tenant+'&page='+route+(qa?'&qa=1':''));frame=await ready(page);return frame;}
async function check(name,fn){active=name;await fn();results.push({name,status:'PASS'});console.log('PASS '+name);}
const readKeys=()=>frame.evaluate(()=>Object.fromEntries(Object.entries(localStorage).filter(([k])=>k.includes('admin-revisit-rules:'))));
const stored=id=>frame.evaluate(k=>JSON.parse(localStorage.getItem(k)),key(id));
function equalExcept(before,after,except){const clean=x=>Object.fromEntries(Object.entries(x).filter(([k])=>!except.includes(k)));assert.deepEqual(clean(after),clean(before));}
async function take(name,tenant){await page.locator('.frame-wrap:not([hidden]) iframe').screenshot({path:path.join(__dirname,name)});screenshots.push({path:name,tenant,scope:'content iframe; synthetic data only'});}
const report={spec:'SPEC-SUIYIN-ADMIN-071@1.2.0',file:relative,artifactClass:'static-html',httpBlocked:true,sourceHashes,results,screenshots};
(async()=>{try{
 browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{channel:'chrome'})});
 context=await browser.newContext({viewport:{width:1512,height:982},locale:'zh-CN'});await context.route(/^https?:/i,r=>r.abort());
 context.on('page',p=>p.on('pageerror',error=>errors.push(error.message)));
 context.on('request',r=>{const requested=r.url();if(/^https?:/i.test(requested))externalRequests.push({protocol:new URL(requested).protocol,origin:new URL(requested).origin});else if(/^file:/i.test(requested)&&requested.split('?')[0]!==fileUrl)externalRequests.push({protocol:'file:',asset:path.basename(new URL(requested).pathname)});});
 page=await context.newPage();await open('yestar-sz');
 await check('单文件内嵌当前模型/界面函数、六租户合成数据及菜单，与产品源文件一致',async()=>{
  assert.equal(normalize(await frame.evaluate(()=>RevisitRuleModel.forTenant.toString())),normalize(expectedRegistry.forTenant.toString()));
  assert.equal(normalize(await frame.evaluate(()=>AdminRevisitRules.mount.toString())),expectedMount);
  for(const [id]of tenants){const model=expectedRegistry.forTenant(id),expected=plain({fields:model.fields,groups:model.groups,permissions:model.permissions,rules:model.seedRules(),fixtures:model.getFixtures()});const actual=await frame.evaluate(id=>{const m=RevisitRuleModel.forTenant(id);return{fields:m.fields,groups:m.groups,permissions:m.permissions,rules:m.seedRules(),fixtures:m.getFixtures()};},id);assert.deepEqual(actual,expected);
   const expectedNav=nav.tenants.find(t=>t.id===id).menu;const embeddedNav=await page.evaluate(id=>__ADMIN_INLINE_DATA__['data/navigation-snapshot.json'].tenants.find(t=>t.id===id).menu,id);assert.deepEqual(embeddedNav,expectedNav);
   const expectedMenu=JSON.parse(fs.readFileSync(path.join(root,'prototype/data/content/'+id+'.json'),'utf8')).menu;assert.deepEqual(await page.evaluate(id=>__ADMIN_INLINE_DATA__['data/content/'+id+'.json'].menu,id),expectedMenu);
  }
  assert.equal(await page.locator('script[src],link[rel="stylesheet"][href]').count(),0);assert.equal(await frame.locator('script[src],link[rel="stylesheet"][href]').count(),0);assert.ok(await page.locator('.frame-wrap:not([hidden]) iframe').getAttribute('srcdoc'));
 });
 const normalBaseline=await frame.evaluate(ids=>{const data={};for(const id of ids){const rules=RevisitRuleModel.forTenant(id).seedRules();rules[0].name=id+'离线普通保留';const k='admin-revisit-rules:v2:'+id,v=JSON.stringify(rules);localStorage.setItem(k,v);data[k]=v;}return data;},tenants.map(([id])=>id));
 for(const [id,city]of tenants)await check(id+'：file入口与21/26维度、独立保存、启停和刷新',async()=>{
  const before=await readKeys();await open(id);assert.equal(await page.locator('#navigation [data-route="revisitRules"]').count(),1);assert.equal(await frame.locator('.rr-table tbody tr').count(),1);assert.equal(await frame.title(),'回访规则 · '+city+'艺星');
  await frame.getByRole('button',{name:'编辑',exact:true}).click();assert.equal(await frame.locator('select[aria-label="添加选中条件"] option').count(),22);assert.equal(await frame.locator('select[aria-label="添加排除条件"] option').count(),27);
  await frame.getByLabel('规则名称',{exact:true}).fill(city+'离线独立规则');await frame.getByLabel('节点说明',{exact:true}).fill(city+'离线独立节点');
  if(id==='yestar')await take('inline-yestar-editor.png',id);
  await frame.getByRole('button',{name:'保存整条规则',exact:true}).click();await frame.locator('.rr-table').waitFor();assert.equal((await stored(id))[0].name,city+'离线独立规则');
  await frame.getByRole('button',{name:'启用',exact:true}).click();assert.equal((await stored(id))[0].enabled,true);await page.reload();frame=await ready(page);assert.equal((await stored(id))[0].nodes[0].note,city+'离线独立节点');await frame.getByRole('button',{name:'暂停',exact:true}).click();assert.equal((await stored(id))[0].enabled,false);equalExcept(before,await readKeys(),[key(id)]);
  if(id==='yestar-jx')await take('inline-yestar-jx-list.png',id);
 });
 await check('file同一context回看六租户，规则互不覆盖且QA不修改普通模式存储',async()=>{
  for(const [id,city]of tenants){await open(id);assert.equal(await frame.locator('.rr-rule-name').innerText(),city+'离线独立规则');}
  const actual=await readKeys();for(const[k,v]of Object.entries(normalBaseline))assert.equal(actual[k],v);
 });
 await check('file普通模式修改只影响自身，不覆盖任何QA或其他租户规则',async()=>{
  const before=await readKeys();await open('yestar-sz','revisitRules',false);assert.equal(await frame.locator('.rr-rule-name').innerText(),'yestar-sz离线普通保留');
  await frame.getByRole('button',{name:'编辑',exact:true}).click();await frame.getByLabel('规则名称',{exact:true}).fill('深圳离线普通独立修改');await frame.getByRole('button',{name:'保存整条规则',exact:true}).click();await frame.locator('.rr-table').waitFor();equalExcept(before,await readKeys(),[key('yestar-sz',false)]);
 });
 await check('file六租户旧回访统计仍为独立路由；非艺星无新入口且强制内容路由拒绝',async()=>{
  for(const [id]of tenants){await open(id,'revisitStats');assert.equal(await page.locator('#navigation [data-route="revisitStats"]').getAttribute('aria-current'),'page');assert.equal(await frame.locator('.rr-root').count(),0);}
  const before=await readKeys(),denied=nav.tenants.filter(t=>!tenants.some(([id])=>id===t.id));
  for(const t of denied){await open(t.id,'revisitRules');assert.equal(await page.locator('#navigation [data-route="revisitRules"]').count(),0);assert.equal(await frame.locator('.rr-root').count(),0);}
  for(const id of [...denied.map(t=>t.id),'unknown-tenant']){
   await page.evaluate(id=>{document.getElementById('inline-negative-probe')?.remove();const f=document.createElement('iframe');f.id='inline-negative-probe';f.srcdoc=__ADMIN_INLINE_FRAME__('tenant='+id+'&route=revisitRules&qa=1');document.body.append(f);},id);
   const handle=await page.locator('#inline-negative-probe').elementHandle(),probe=await handle.contentFrame();await probe.locator('body[data-content-ready]').waitFor();assert.equal(await probe.locator('.rr-root').count(),0);assert.equal(await probe.getByRole('button',{name:'＋ 新建规则',exact:true}).count(),0);
  }
  assert.deepEqual(await readKeys(),before);report.deniedDirectRoutes=denied.length+1;
 });
 await check('file内嵌菜单登记六店一致，德三平台定义只一份',async()=>{
  for(const[id]of tenants){await open(id,'menu');const rows=await frame.evaluate(()=>Admin.getTable().rows);assert.equal(rows.filter(r=>r.tree?.key==='revisitRules').length,1,id);}
  await open('bzds','allMenu');assert.equal((await frame.evaluate(()=>Admin.getTable().rows)).filter(r=>r.tree?.key==='revisitRules').length,1);
 });
 await check('file没有外部资源请求或脚本异常，验收期间源文件未变化',async()=>{assert.deepEqual(errors,[]);assert.deepEqual(externalRequests,[]);for(const[p,sha]of Object.entries(sourceHashes))assert.equal(hash(fs.readFileSync(path.join(root,p))),sha,p);});
 report.status='PASS';
}catch(error){results.push({name:active,status:'FAIL',error:String(error.message).replaceAll(root,'[prototype]').replaceAll(__dirname,'[checks]')});report.status='FAIL';console.error('FAIL '+active+': '+error.message);process.exitCode=1;
}finally{report.verifiedAt=new Date().toISOString();report.browser=browser?await browser.version():null;const bytes=fs.readFileSync(file);report.bytes=bytes.length;report.sha256=hash(bytes);report.passed=results.filter(r=>r.status==='PASS').length;report.total=results.length;report.errors=errors;report.externalRequests=externalRequests;fs.writeFileSync(path.join(__dirname,'inline-tenants-results.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({status:report.status,passed:report.passed,total:report.total,sha256:report.sha256}));await browser?.close();}
})().catch(error=>{console.error(error.message);process.exitCode=1;});
