/* SPEC-SUIYIN-ADMIN-071@1.3.1: real file:// UI integration and source-binding checks. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),vm=require('node:vm'),assert=require('node:assert/strict');
const {pathToFileURL}=require('node:url');
let chromium;try{({chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright'));}catch(_){throw Error('Install Playwright or set PLAYWRIGHT_MODULE to its installed module.');}
const root=path.resolve(process.env.PROTOTYPE_ROOT||process.cwd()),relative='prototype/_shell_inline.html',file=path.join(root,relative);
if(!fs.existsSync(file))throw Error('Run in the prototype repository or set PROTOTYPE_ROOT; build prototype/_shell_inline.html first.');
const fileUrl=pathToFileURL(file).href,hash=value=>crypto.createHash('sha256').update(value).digest('hex'),plain=value=>JSON.parse(JSON.stringify(value)),normalize=value=>value.replace(/\r\n/g,'\n');
const tenants=[['yestar-sz','深圳'],['yestar','成都'],['yestar-bj','北京'],['yestar-gz','广州'],['yestar-hz','杭州'],['yestar-jx','嘉兴']];
const events=[['visit','first','首次到店'],['visit','latest','最近一次到店'],['purchase','first','首次购买'],['purchase','latest','最近一次购买'],['redemption','first','首次划扣'],['redemption','latest','最近一次划扣']];
const sourceFiles=['prototype/admin-revisit-rules-model.js','prototype/admin-revisit-rules.js','prototype/admin-revisit-rules.css','prototype/admin-menu-state.js','prototype/data/navigation-snapshot.json',...tenants.map(([id])=>'prototype/data/content/'+id+'.json')];
const sourceHashes=Object.fromEntries(sourceFiles.map(p=>[p,hash(fs.readFileSync(path.join(root,p)))]));
const registrySandbox={};vm.createContext(registrySandbox);vm.runInContext(fs.readFileSync(path.join(root,sourceFiles[0]),'utf8'),registrySandbox);const expectedRegistry=registrySandbox.RevisitRuleModel;
const uiSandbox={window:{}};vm.createContext(uiSandbox);vm.runInContext(fs.readFileSync(path.join(root,sourceFiles[1]),'utf8').replaceAll('new URLSearchParams(location.search)','new URLSearchParams(window.__ADMIN_INLINE_PARAMS__||location.search)'),uiSandbox);
const expectedMount=normalize(uiSandbox.window.AdminRevisitRules.mount.toString()),nav=JSON.parse(fs.readFileSync(path.join(root,'prototype/data/navigation-snapshot.json'),'utf8'));
const results=[],errors=[],externalRequests=[],screenshots=[];let browser,context,page,frame,active='setup';
const key=(id,qa=true)=>(qa?'admin-qa-':'')+'admin-revisit-rules:v2:'+id;
const report={spec:'SPEC-SUIYIN-ADMIN-071@1.3.1',file:relative,artifactClass:'static-html',transport:'file:',httpBlocked:true,sourceHashes,results,screenshots};
async function ready(){await page.locator('.frame-wrap:not([hidden]) iframe').waitFor();frame=await(await page.locator('.frame-wrap:not([hidden]) iframe').elementHandle()).contentFrame();await frame.locator('body[data-content-ready="true"]').waitFor();}
async function open(id,route='revisitRules',qa=true){await page.goto(fileUrl+'?tenant='+id+'&page='+route+(qa?'&qa=1':''));await ready();}
async function reload(){await page.reload();await ready();}
async function check(name,fn){active=name;await fn();results.push({name,status:'PASS'});console.log('PASS '+name);}
async function edit(){await frame.getByRole('button',{name:'编辑',exact:true}).first().click();}
async function choose(label,value){const labelText=await frame.locator('select[aria-label="'+label+'"] option[value="'+value+'"]').innerText();await frame.getByRole('combobox',{name:label,exact:true}).click();await frame.getByRole('option',{name:labelText,exact:true}).click();}
async function save(){await frame.getByRole('button',{name:'保存整条规则',exact:true}).click();await frame.locator('.rr-table').waitFor();}
async function cancel(){await frame.getByRole('button',{name:'取消',exact:true}).click();const discard=frame.getByRole('button',{name:'放弃并返回',exact:true});if(await discard.isVisible())await discard.click();await frame.locator('.rr-table').waitFor();}
const readKeys=()=>frame.evaluate(()=>Object.fromEntries(Object.entries(localStorage).filter(([k])=>k.includes('admin-revisit-rules:'))));
const stored=id=>frame.evaluate(k=>JSON.parse(localStorage.getItem(k)),key(id));
const raw=id=>frame.evaluate(k=>localStorage.getItem(k),key(id));
function equalExcept(before,after,except){const clean=x=>Object.fromEntries(Object.entries(x).filter(([k])=>!except.includes(k)));assert.deepEqual(clean(after),clean(before));}
async function shot(name,tenant){await frame.locator('#toast.visible').waitFor({state:'hidden'});await page.locator('.frame-wrap:not([hidden]) iframe').screenshot({path:path.join(__dirname,name)});screenshots.push({path:name,tenant,scope:'content iframe; synthetic QA fixtures; natural controls'});}
(async()=>{try{
 browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{channel:'chrome'})});
 context=await browser.newContext({viewport:{width:1512,height:982},locale:'zh-CN'});await context.route(/^https?:/i,r=>r.abort());
 context.on('page',p=>p.on('pageerror',error=>errors.push(error.message)));context.on('request',r=>{const url=r.url();if(/^https?:/i.test(url))externalRequests.push({protocol:new URL(url).protocol,origin:new URL(url).origin});else if(/^file:/i.test(url)&&url.split('?')[0]!==fileUrl)externalRequests.push({protocol:'file:',asset:path.basename(new URL(url).pathname)});});
 page=await context.newPage();await open('yestar-sz');
 await check('file内嵌当前模型/界面、六租户数据和菜单与产品源码一致，无外链资源',async()=>{
  assert.equal(normalize(await frame.evaluate(()=>RevisitRuleModel.forTenant.toString())),normalize(expectedRegistry.forTenant.toString()));assert.equal(normalize(await frame.evaluate(()=>AdminRevisitRules.mount.toString())),expectedMount);
  for(const[id]of tenants){const m=expectedRegistry.forTenant(id),expected=plain({fields:m.fields,anchors:m.anchors,groups:m.groups,permissions:m.permissions,rules:m.seedRules(),fixtures:m.getFixtures()});assert.equal(expected.anchors.length,12,'model retains 12 anchors; UI expands events to 15 options');
   const actual=await frame.evaluate(id=>{const m=RevisitRuleModel.forTenant(id);return{fields:m.fields,anchors:m.anchors,groups:m.groups,permissions:m.permissions,rules:m.seedRules(),fixtures:m.getFixtures()};},id);assert.deepEqual(actual,expected);
   assert.deepEqual(await page.evaluate(id=>__ADMIN_INLINE_DATA__['data/navigation-snapshot.json'].tenants.find(t=>t.id===id).menu,id),nav.tenants.find(t=>t.id===id).menu);
   const menu=JSON.parse(fs.readFileSync(path.join(root,'prototype/data/content/'+id+'.json'),'utf8')).menu;assert.deepEqual(await page.evaluate(id=>__ADMIN_INLINE_DATA__['data/content/'+id+'.json'].menu,id),menu);
  }
  assert.equal(await page.locator('script[src],link[rel="stylesheet"][href]').count(),0);assert.equal(await frame.locator('script[src],link[rel="stylesheet"][href]').count(),0);assert.ok(await page.locator('.frame-wrap:not([hidden]) iframe').getAttribute('srcdoc'));
 });
 const normalBaseline=await frame.evaluate(ids=>{const data={};for(const id of ids){const r=RevisitRuleModel.forTenant(id).seedRules();r[0].name=id+'普通保留';const k='admin-revisit-rules:v2:'+id,v=JSON.stringify(r);localStorage.setItem(k,v);data[k]=v;}return data;},tenants.map(([id])=>id));
 for(let i=0;i<tenants.length;i++){const[id,city]=tenants[i],[anchor,occurrence,label]=events[i];await check(id+'：15项与21/26维度，事件及人工/AI等级保存刷新、启停和隔离',async()=>{
  const before=await readKeys();await open(id);assert.equal(await page.locator('#navigation [data-route="revisitRules"]').count(),1);assert.equal(await frame.title(),'回访规则 · '+city+'艺星');await edit();
  assert.equal(await frame.locator('select[aria-label="添加选中条件"] option').count(),22);assert.equal(await frame.locator('select[aria-label="添加排除条件"] option').count(),27);
  const options=await frame.locator('select[aria-label="回访基准日期"] option').evaluateAll(o=>o.map(x=>({value:x.value,label:x.textContent})));assert.equal(options.length,15);for(const[a,o,l]of events)assert.deepEqual(options.find(x=>x.value===a+':'+o),{value:a+':'+o,label:l});
  assert.equal(options.filter(o=>['visit','purchase','redemption'].includes(o.value)).length,0);assert.equal(options.find(o=>o.value==='appointment').label,'预约日期');assert.equal(await frame.getByRole('combobox',{name:'事件取值',exact:true}).count(),0);
  const initial=plain(expectedRegistry.forTenant(id).seedRules()[0]);await frame.getByLabel('规则名称',{exact:true}).fill(city+'离线规则');await choose('回访基准日期',anchor+':'+occurrence);await save();let saved=(await stored(id))[0];assert.equal(saved.anchor,anchor);assert.equal(saved.anchorOccurrence,occurrence);assert.equal('gradeSource'in saved,false);assert.deepEqual(saved.scope,initial.scope);assert.deepEqual(saved.nodes,initial.nodes);assert.equal(saved.runAt,initial.runAt);
  await reload();await edit();assert.equal(await frame.locator('select[aria-label="回访基准日期"]').inputValue(),anchor+':'+occurrence);assert.equal(await frame.getByRole('combobox',{name:'回访基准日期',exact:true}).innerText(),label);
  await choose('回访基准日期','grade-A');assert.equal(await frame.locator('select[aria-label="等级来源"]').inputValue(),'manual');await save();await reload();await edit();assert.equal(await frame.locator('select[aria-label="等级来源"]').inputValue(),'manual');await choose('等级来源','ai');await save();await reload();await edit();assert.equal(await frame.locator('select[aria-label="等级来源"]').inputValue(),'ai');saved=(await stored(id))[0];assert.equal(saved.anchor,'grade-A');assert.equal(saved.gradeSource,'ai');assert.equal('anchorOccurrence'in saved,false);
  if(id==='yestar-jx')await shot('inline-grade-ai.png',id);await cancel();await frame.getByRole('button',{name:'启用',exact:true}).click();assert.equal((await stored(id))[0].enabled,true);await reload();await frame.getByRole('button',{name:'暂停',exact:true}).click();assert.equal((await stored(id))[0].enabled,false);equalExcept(before,await readKeys(),[key(id)]);
 });}
 await check('file同一context六租户互不覆盖，QA存储与普通存储严格隔离',async()=>{
  for(const[id,city]of tenants){await open(id);assert.equal(await frame.locator('.rr-rule-name').innerText(),city+'离线规则');assert.equal((await stored(id))[0].gradeSource,'ai');}
  const actual=await readKeys();for(const[k,v]of Object.entries(normalBaseline))assert.equal(actual[k],v);
  const before=await readKeys();await open('yestar-sz','revisitRules',false);assert.equal(await frame.locator('.rr-rule-name').innerText(),'yestar-sz普通保留');await edit();await choose('回访基准日期','redemption:latest');await save();equalExcept(before,await readKeys(),[key('yestar-sz',false)]);
 });
 await check('file旧六种事件pair原样回显，打开和修改后取消不迁写',async()=>{
  await open('yestar-sz');for(const[anchor,occurrence]of events){const rule=plain(expectedRegistry.forTenant('yestar-sz').seedRules()[0]);rule.anchor=anchor;rule.anchorOccurrence=occurrence;rule.name='既有事件规则';await frame.evaluate(({k,rule})=>localStorage.setItem(k,JSON.stringify([rule])),{k:key('yestar-sz'),rule});await reload();const before=await raw('yestar-sz');await edit();assert.equal(await frame.locator('select[aria-label="回访基准日期"]').inputValue(),anchor+':'+occurrence);await cancel();assert.equal(await raw('yestar-sz'),before);await edit();await choose('回访基准日期',anchor+':'+(occurrence==='first'?'latest':'first'));await cancel();assert.equal(await raw('yestar-sz'),before);}
 });
 await check('file缺失/无效次数不默选，阻止保存；显式选项可修复并刷新',async()=>{
  for(const[anchor,value]of [['visit',undefined],['purchase','invalid'],['redemption','']]){const rule=plain(expectedRegistry.forTenant('yestar-sz').seedRules()[0]);rule.anchor=anchor;if(value!==undefined)rule.anchorOccurrence=value;await frame.evaluate(({k,rule})=>localStorage.setItem(k,JSON.stringify([rule])),{k:key('yestar-sz'),rule});await reload();const before=await raw('yestar-sz');await edit();assert.equal(await frame.locator('select[aria-label="回访基准日期"]').inputValue(),'');await frame.getByRole('button',{name:'保存整条规则',exact:true}).click();assert.ok((await frame.locator('.rr-form-error').innerText()).trim());assert.equal(await raw('yestar-sz'),before);await choose('回访基准日期',anchor+':first');await save();await reload();assert.equal((await stored('yestar-sz'))[0].anchorOccurrence,'first');}
 });
 await check('file直接下拉上下截图及1120窄窗，无多余事件控件或横向溢出',async()=>{
  await edit();await choose('回访基准日期','purchase:first');await frame.evaluate(()=>window.scrollTo(0,0));await frame.getByRole('combobox',{name:'回访基准日期',exact:true}).click();await frame.getByRole('option',{name:'末次咨询日期',exact:true}).scrollIntoViewIfNeeded();await shot('inline-event-options-top.png','yestar-sz');await frame.getByRole('option',{name:'最近一次划扣',exact:true}).scrollIntoViewIfNeeded();await shot('inline-event-options-bottom.png','yestar-sz');await page.keyboard.press('Escape');await page.setViewportSize({width:1120,height:820});await frame.evaluate(()=>window.scrollTo(0,0));const size=await frame.evaluate(()=>({scroll:document.documentElement.scrollWidth,width:document.documentElement.clientWidth}));assert.ok(size.scroll<=size.width+2);assert.equal(await frame.getByRole('combobox',{name:'事件取值',exact:true}).count(),0);await shot('inline-event-options-narrow.png','yestar-sz');await cancel();await page.setViewportSize({width:1512,height:982});
 });
 await check('file六店旧统计保持独立，非艺星无新入口且直接内容路由拒绝',async()=>{
  for(const[id]of tenants){await open(id,'revisitStats');assert.equal(await page.locator('#navigation [data-route="revisitStats"]').getAttribute('aria-current'),'page');assert.equal(await frame.locator('.rr-root').count(),0);}
  const before=await readKeys(),denied=nav.tenants.filter(t=>!tenants.some(([id])=>id===t.id));for(const t of denied){await open(t.id,'revisitRules');assert.equal(await page.locator('#navigation [data-route="revisitRules"]').count(),0);assert.equal(await frame.locator('.rr-root').count(),0);}
  for(const id of [...denied.map(t=>t.id),'unknown-tenant']){await page.evaluate(id=>{document.getElementById('inline-negative-probe')?.remove();const f=document.createElement('iframe');f.id='inline-negative-probe';f.srcdoc=__ADMIN_INLINE_FRAME__('tenant='+id+'&route=revisitRules&qa=1');document.body.append(f);},id);const probe=await(await page.locator('#inline-negative-probe').elementHandle()).contentFrame();await probe.locator('body[data-content-ready]').waitFor();assert.equal(await probe.locator('.rr-root').count(),0);}
  assert.deepEqual(await readKeys(),before);report.deniedDirectRoutes=denied.length+1;
 });
 await check('file没有外部请求或脚本异常，执行期间源码字节未变化',async()=>{assert.deepEqual(errors,[]);assert.deepEqual(externalRequests,[]);for(const[p,sha]of Object.entries(sourceHashes))assert.equal(hash(fs.readFileSync(path.join(root,p))),sha,p);});
 report.status='PASS';
}catch(error){results.push({name:active,status:'FAIL',error:String(error.message).replaceAll(root,'[prototype]').replaceAll(__dirname,'[checks]')});report.status='FAIL';console.error('FAIL '+active+': '+error.message);process.exitCode=1;
}finally{report.verifiedAt=new Date().toISOString();report.browser=browser?await browser.version():null;const bytes=fs.readFileSync(file);report.bytes=bytes.length;report.sha256=hash(bytes);report.passed=results.filter(r=>r.status==='PASS').length;report.total=results.length;report.errors=errors;report.externalRequests=externalRequests;fs.writeFileSync(path.join(__dirname,'inline-event-options-results.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({status:report.status,passed:report.passed,total:report.total,sha256:report.sha256}));await browser?.close();}
})().catch(error=>{console.error(error.message);process.exitCode=1;});
