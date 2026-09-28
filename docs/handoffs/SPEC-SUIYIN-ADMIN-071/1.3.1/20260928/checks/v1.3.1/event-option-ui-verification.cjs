/* Focused UI mapping checks; model semantics are unchanged from 1.3.0. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const base=(process.env.PROTOTYPE_BASE_URL||'http://127.0.0.1:8148').replace(/\/+$/,'');
const tenants=['yestar-sz','yestar','yestar-bj','yestar-gz','yestar-hz','yestar-jx'];
const events=[['visit','first','首次到店'],['visit','latest','最近一次到店'],['purchase','first','首次购买'],['purchase','latest','最近一次购买'],['redemption','first','首次划扣'],['redemption','latest','最近一次划扣']];
const key='admin-qa-admin-revisit-rules:v2:yestar-sz';
const results=[],errors=[],external=[],screenshots=[];let browser,page,frame,active='setup';
const report={spec:'SPEC-SUIYIN-ADMIN-071@1.3.1',artifactClass:'static-html',scope:'dropdown-to-existing-model-pair integration only',results,screenshots};
async function test(name,fn){active=name;await fn();results.push({name,status:'PASS'});console.log('PASS '+name);}
async function ready(){const el=await page.locator('.frame-wrap:not([hidden]) iframe').elementHandle();frame=await el.contentFrame();await frame.locator('.rr-table').waitFor();}
async function open(id='yestar-sz'){await page.goto(base+'/prototype/_shell.html?tenant='+id+'&page=revisitRules&qa=1',{waitUntil:'networkidle'});await ready();}
async function edit(){await frame.getByRole('button',{name:'编辑',exact:true}).first().click();}
async function choose(label,value){const option=frame.locator('select[aria-label="'+label+'"] option[value="'+value+'"]'),text=await option.innerText();await frame.getByRole('combobox',{name:label,exact:true}).click();await frame.getByRole('option',{name:text,exact:true}).click();}
async function save(){await frame.getByRole('button',{name:'保存整条规则',exact:true}).click();await frame.locator('.rr-table').waitFor();}
async function cancel(){await frame.getByRole('button',{name:'取消',exact:true}).click();const discard=frame.getByRole('button',{name:'放弃并返回',exact:true});if(await discard.isVisible())await discard.click();await frame.locator('.rr-table').waitFor();}
const readRaw=()=>frame.evaluate(k=>localStorage.getItem(k),key),read=async()=>JSON.parse(await readRaw());
const seed=()=>frame.evaluate(()=>RevisitRuleModel.forTenant('yestar-sz').seedRules()[0]);
async function put(rule){await frame.evaluate(({k,rule})=>localStorage.setItem(k,JSON.stringify([rule])),{k:key,rule});await page.reload({waitUntil:'networkidle'});await ready();}
async function reload(){await page.reload({waitUntil:'networkidle'});await ready();}
async function shot(name){await frame.locator('#toast.visible').waitFor({state:'hidden'});await page.locator('.frame-wrap:not([hidden]) iframe').screenshot({path:path.join(__dirname,name)});screenshots.push({path:name,scope:'content iframe; synthetic local QA draft; no style/DOM masking'});}
(async()=>{try{
 browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{channel:'chrome'})});
 const context=await browser.newContext({viewport:{width:1512,height:982},locale:'zh-CN'});page=await context.newPage();
 page.on('pageerror',error=>errors.push(error.message));page.on('request',r=>{if(!r.url().startsWith(base+'/')&&!r.url().startsWith('data:'))external.push(new URL(r.url()).origin);});
 report.sources=[];for(const file of ['prototype/admin-revisit-rules-model.js','prototype/admin-revisit-rules.js','prototype/admin-revisit-rules.css']){const response=await context.request.get(base+'/'+file);assert.equal(response.status(),200);report.sources.push({path:file,sha256:crypto.createHash('sha256').update(await response.body()).digest('hex')});}
 await test('六艺星均显示15项，六事件标签直接可选，无泛化事件或第二事件下拉',async()=>{
  for(const id of tenants){await open(id);await edit();const options=await frame.locator('select[aria-label="回访基准日期"] option').evaluateAll(items=>items.map(o=>({value:o.value,label:o.textContent})));
   assert.equal(options.length,15,id);for(const[anchor,occurrence,label]of events)assert.deepEqual(options.find(item=>item.value===anchor+':'+occurrence),{value:anchor+':'+occurrence,label});
   assert.equal(options.filter(item=>['visit','purchase','redemption'].includes(item.value)||['到店','购买','划扣'].includes(item.label)).length,0);assert.equal(await frame.getByRole('combobox',{name:'事件取值',exact:true}).count(),0);assert.equal(options.find(item=>item.value==='appointment').label,'预约日期');await cancel();
  }
 });
 await test('六事件选项逐一保存刷新，仍写原anchor与anchorOccurrence配对，不改节点/范围/时刻',async()=>{
  await open();const original=await seed();
  for(const[anchor,occurrence,label]of events){await edit();await choose('回访基准日期',anchor+':'+occurrence);assert.equal(await frame.getByRole('combobox',{name:'事件取值',exact:true}).count(),0);await save();const saved=(await read())[0];assert.equal(saved.anchor,anchor);assert.equal(saved.anchorOccurrence,occurrence);assert.equal('gradeSource'in saved,false);assert.deepEqual(saved.nodes,original.nodes);assert.deepEqual(saved.scope,original.scope);assert.equal(saved.runAt,original.runAt);await reload();await edit();assert.equal(await frame.locator('select[aria-label="回访基准日期"]').inputValue(),anchor+':'+occurrence);assert.equal(await frame.getByRole('combobox',{name:'回访基准日期',exact:true}).innerText(),label);await cancel();}
 });
 await test('既有六种pair正确回显，打开与修改后取消均不迁写原v2内容',async()=>{
  for(const[anchor,occurrence]of events){const rule=await seed();rule.anchor=anchor;rule.anchorOccurrence=occurrence;rule.name='既有事件规则';rule.nodes[0].note='既有节点说明';await put(rule);const before=await readRaw();await edit();assert.equal(await frame.locator('select[aria-label="回访基准日期"]').inputValue(),anchor+':'+occurrence);await cancel();assert.equal(await readRaw(),before);await edit();await choose('回访基准日期',anchor+':'+(occurrence==='first'?'latest':'first'));await cancel();assert.equal(await readRaw(),before);}
 });
 await test('缺失或非法次数不默选，原数据保留并阻止保存；复合选项可显式修复',async()=>{
  for(const[anchor,value]of [['visit',undefined],['purchase','invalid'],['redemption','']]){const rule=await seed();rule.anchor=anchor;if(value!==undefined)rule.anchorOccurrence=value;await put(rule);const before=await readRaw();await edit();assert.equal(await frame.locator('select[aria-label="回访基准日期"]').inputValue(),'');assert.match(await frame.getByRole('combobox',{name:'回访基准日期',exact:true}).innerText(),/请.*选择/);assert.equal(await frame.getByRole('combobox',{name:'事件取值',exact:true}).count(),0);await frame.getByRole('button',{name:'保存整条规则',exact:true}).click();assert.ok((await frame.locator('.rr-form-error').innerText()).trim());assert.equal(await readRaw(),before);await choose('回访基准日期',anchor+':first');await save();assert.equal((await read())[0].anchorOccurrence,'first');assert.equal((await read())[0].anchor,anchor);}
 });
 await test('等级仍支持人工/AI并可保存，切事件删等级来源且回日期无额外参数',async()=>{
  await edit();await choose('回访基准日期','grade-A');assert.equal(await frame.locator('select[aria-label="等级来源"]').inputValue(),'manual');await choose('等级来源','ai');await save();await reload();await edit();assert.equal(await frame.locator('select[aria-label="等级来源"]').inputValue(),'ai');await choose('等级来源','manual');await save();assert.equal((await read())[0].gradeSource,'manual');assert.equal('anchorOccurrence'in(await read())[0],false);await edit();await choose('回访基准日期','purchase:latest');await save();assert.equal('gradeSource'in(await read())[0],false);await edit();await choose('回访基准日期','appointment');await save();assert.equal('gradeSource'in(await read())[0],false);assert.equal('anchorOccurrence'in(await read())[0],false);
 });
 await test('干净下拉上下两屏与1120窄窗，无第二事件控件或横向溢出',async()=>{
  await reload();await edit();await choose('回访基准日期','purchase:first');await frame.evaluate(()=>window.scrollTo(0,0));await frame.getByRole('combobox',{name:'回访基准日期',exact:true}).click();
  await frame.getByRole('option',{name:'末次咨询日期',exact:true}).scrollIntoViewIfNeeded();await shot('event-options-top.png');await frame.getByRole('option',{name:'最近一次划扣',exact:true}).scrollIntoViewIfNeeded();await shot('event-options-bottom.png');await page.keyboard.press('Escape');
  await page.setViewportSize({width:1120,height:820});await frame.evaluate(()=>window.scrollTo(0,0));const size=await frame.evaluate(()=>({scroll:document.documentElement.scrollWidth,width:document.documentElement.clientWidth}));assert.ok(size.scroll<=size.width+2);assert.equal(await frame.getByRole('combobox',{name:'事件取值',exact:true}).count(),0);assert.equal(await frame.getByRole('button',{name:'保存整条规则',exact:true}).isVisible(),true);await shot('event-options-narrow.png');
 });
 await test('无脚本异常或外部请求',async()=>{assert.deepEqual(errors,[]);assert.deepEqual(external,[]);});
 report.status='PASS';
}catch(error){report.status='FAIL';results.push({name:active,status:'FAIL',error:error.message.replaceAll(__dirname,'[checks]').replaceAll(process.cwd(),'[cwd]')});console.error('FAIL '+active+': '+error.message);process.exitCode=1;
}finally{report.verifiedAt=new Date().toISOString();report.passed=results.filter(item=>item.status==='PASS').length;report.total=results.length;report.errors=errors;report.externalRequests=external.length;fs.writeFileSync(path.join(__dirname,'event-option-ui-results.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({status:report.status,passed:report.passed,total:report.total,screenshots:screenshots.length}));await browser?.close();}})().catch(error=>{console.error(error.message);process.exitCode=1;});
