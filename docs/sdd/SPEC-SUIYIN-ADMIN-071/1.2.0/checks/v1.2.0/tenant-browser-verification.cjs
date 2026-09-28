/* Run against the local static prototype using a fresh Chrome browser context.
 * Every stored name/person is synthetic. No real browser profile is opened.
 */
'use strict';
let chromium;
try { ({chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright')); }
catch (_) { throw Error('Install Playwright locally or set PLAYWRIGHT_MODULE to an existing module.'); }
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const base=(process.env.PROTOTYPE_BASE_URL||'http://127.0.0.1:8148').replace(/\/+$/,'');
const tenants=[['yestar-sz','深圳'],['yestar','成都'],['yestar-bj','北京'],['yestar-gz','广州'],['yestar-hz','杭州'],['yestar-jx','嘉兴']];
const key=(id,qa=true,version=2)=>(qa?'admin-qa-':'')+'admin-revisit-rules:v'+version+':'+id;
const url=(id,qa=true,shell=true)=>base+'/prototype/'+(shell?'_shell.html':'admin-content.html')+'?tenant='+id+'&'+(shell?'page':'route')+'=revisitRules'+(qa?'&qa=1':'');
const results=[],screenshots=[],errors=[],external=[];
const sha=value=>crypto.createHash('sha256').update(value).digest('hex');
let browser,page,activeTest='setup';
const report={spec:'SPEC-SUIYIN-ADMIN-071@1.2.0',artifactClass:'static-html',scenario:'same-origin fresh Chrome context; six isolated synthetic tenants',results,screenshots};
async function test(name,fn) {activeTest=name;await fn();results.push({name,status:'PASS'});console.log('PASS '+name);}
function watch(p) {p.on('pageerror',error=>errors.push(error.message));p.on('request',r=>{if(!r.url().startsWith(base+'/')&&!r.url().startsWith('data:'))external.push(new URL(r.url()).origin);});}
const readKeys=p=>p.evaluate(()=>Object.fromEntries(Object.entries(localStorage).filter(([k])=>k.includes('admin-revisit-rules:')).sort(([a],[b])=>a.localeCompare(b))));
const stored=(p,k)=>p.evaluate(k=>JSON.parse(localStorage.getItem(k)),k);
async function open(id,qa=true,shell=true,p=page) {await p.goto(url(id,qa,shell),{waitUntil:'networkidle'});const f=shell?p.frameLocator('.frame-wrap:not([hidden]) iframe'):p;await f.locator('#app.rr-root').waitFor();return f;}
async function edit(f) {await f.getByRole('button',{name:'编辑',exact:true}).first().click();}
async function save(f) {await f.getByRole('button',{name:'保存整条规则',exact:true}).click();await f.locator('.rr-table').waitFor();}
async function add(f,label) {await f.getByRole('combobox',{name:'添加选中条件',exact:true}).click();await f.getByRole('option',{name:label,exact:true}).click();}
async function cancel(f) {await f.getByRole('button',{name:'取消',exact:true}).click();const discard=f.getByRole('button',{name:'放弃并返回',exact:true});if(await discard.isVisible())await discard.click();await f.locator('.rr-table').waitFor();}
function equalExcept(before,after,except){const clean=value=>Object.fromEntries(Object.entries(value).filter(([k])=>!except.includes(k)));assert.deepEqual(clean(after),clean(before));}

(async()=>{
browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{channel:'chrome'})});
try {
  const context=await browser.newContext({viewport:{width:1512,height:982},locale:'zh-CN'});page=await context.newPage();watch(page);
  const sourcePaths=['prototype/admin-revisit-rules-model.js','prototype/admin-revisit-rules.js','prototype/admin-menu-state.js','prototype/data/navigation-snapshot.json'];
  report.sources=[];
  for(const p of sourcePaths){const response=await context.request.get(base+'/'+p);assert.equal(response.status(),200);report.sources.push({path:p,sha256:sha(await response.body())});}
  const nav=await (await context.request.get(base+'/prototype/data/navigation-snapshot.json')).json();
  await test('六租户导航/菜单表入口一致，其他租户导航不新增回访入口',async()=>{
    const leaves=items=>items.flatMap(item=>item.children?leaves(item.children):[item]);
    for(const [id] of tenants){
      const tenant=nav.tenants.find(item=>item.id===id),found=leaves(tenant.menu).filter(item=>item.route==='revisitRules');
      assert.equal(found.length,1,id);assert.equal(found[0].label,'回访规则');
      const chat=tenant.menu.find(item=>item.label==='聊天管理');assert.ok(chat&&leaves(chat.children).some(item=>item.route==='revisitRules'));
      const content=await (await context.request.get(base+'/prototype/data/content/'+id+'.json')).json();
      const rows=content.menu.tables[0].rows,menuRows=rows.filter(item=>item.tree?.key==='revisitRules');
      assert.equal(menuRows.length,1,id+' menu table');assert.equal(menuRows[0].cells[0],'回访规则');assert.equal(menuRows[0].prototypeOnly,true);
      const parent=rows.find(item=>item.id===menuRows[0].tree.parentId);assert.equal(parent.cells[0],'聊天管理');assert.equal(menuRows[0].tree.parentKey,chat.id);
    }
    for(const tenant of nav.tenants.filter(item=>!tenants.some(([id])=>id===item.id)))assert.equal(leaves(tenant.menu).filter(item=>item.route==='revisitRules').length,0,tenant.id);
  });
  await open('yestar-sz',true,false);
  // Seed normal-mode controls before modifying QA rules; all values come from synthetic models.
  const normalBaseline=await page.evaluate(ids=>{
    const snapshot={};for(const id of ids){const rules=RevisitRuleModel.forTenant(id).seedRules();rules[0].name=id+' 普通预览保留';rules[0].nodes[0].note='合成普通存储对照';const k='admin-revisit-rules:v2:'+id,v=JSON.stringify(rules);localStorage.setItem(k,v);snapshot[k]=v;}return snapshot;
  },tenants.map(([id])=>id));
  for(const [id,city] of tenants){
    await test(id+'：shell入口、21/26维度、当地账号/人员选项、保存启停与其他租户隔离',async()=>{
      const before=await readKeys(page),f=await open(id);
      assert.equal(await page.locator('#navigation button[data-route="revisitRules"]').count(),1);
      assert.equal(await page.locator('#navigation button[data-route="revisitRules"]').getAttribute('aria-current'),'page');
      assert.equal(await f.locator('body').evaluate(()=>document.title),'回访规则 · '+city+'艺星');
      assert.equal(await f.locator('.rr-table tbody tr').count(),1);
      await edit(f);assert.equal(await f.locator('select[aria-label="添加选中条件"] option').count(),22);assert.equal(await f.locator('select[aria-label="添加排除条件"] option').count(),27);
      await f.getByLabel('规则名称',{exact:true}).fill(city+' QA独立规则');await f.getByLabel('节点说明',{exact:true}).fill(city+'独立节点说明');
      const scope=f.locator('details.rr-scope-fold');await scope.locator('summary').click();
      const accountLabels=await scope.locator('.rr-account-list label').allTextContents();assert.equal(accountLabels.length,2);
      assert.ok(accountLabels.every(value=>value.includes('演示')&&(id==='yestar-sz'||value.includes(city))));await scope.locator('summary').click();
      for(const [fieldId,label] of [['developer','开发人'],['manager','客服经理'],['doctor','推荐医生'],['region','地区']]){
        await add(f,label);const picker=f.locator('.rr-condition-row[data-condition-field="'+fieldId+'"] details');await picker.locator('summary').click();
        const choices=await picker.locator('.rr-multi-options label').allTextContents();assert.ok(choices.length>0);
        if(fieldId!=='region')assert.ok(choices.every(value=>value.includes('演示')&&(id==='yestar-sz'||value.includes(city))));
        else assert.ok(choices.some(value=>value.includes(city)));
        if(fieldId==='developer')await picker.locator('input[type="checkbox"]').first().check();
        await picker.locator('summary').click();
      }
      if(['yestar','yestar-jx'].includes(id)){await f.getByLabel('规则名称',{exact:true}).scrollIntoViewIfNeeded();const screenshot='tenant-'+id+'-editor.png';await page.locator('.frame-wrap:not([hidden]) iframe').screenshot({path:path.join(__dirname,screenshot)});screenshots.push({tenant:id,path:screenshot,scope:'content iframe; synthetic rule and people only'});}
      await save(f);let saved=await stored(page,key(id));assert.equal(saved[0].name,city+' QA独立规则');assert.equal(saved[0].nodes[0].note,city+'独立节点说明');assert.equal(saved[0].nodes[0].include.find(item=>item.field==='developer').values.length,1);
      await f.getByRole('button',{name:'启用',exact:true}).click();assert.equal((await stored(page,key(id)))[0].enabled,true);
      await page.reload({waitUntil:'networkidle'});await f.getByRole('button',{name:'暂停',exact:true}).waitFor();assert.equal(await f.locator('.rr-rule-name').innerText(),city+' QA独立规则');
      await f.getByRole('button',{name:'暂停',exact:true}).click();assert.equal((await stored(page,key(id)))[0].enabled,false);
      equalExcept(before,await readKeys(page),[key(id)]);
      const screenshot='tenant-'+id+'-list.png';await page.locator('.frame-wrap:not([hidden]) iframe').screenshot({path:path.join(__dirname,screenshot)});screenshots.push({tenant:id,path:screenshot,scope:'content iframe; synthetic rule and people only'});
    });
  }
  await test('同一浏览器回看六租户，各自保存内容保留且普通模式六份对照不变',async()=>{
    for(const [id,city] of tenants){const f=await open(id);assert.equal(await f.locator('.rr-rule-name').innerText(),city+' QA独立规则');await edit(f);assert.equal(await f.getByLabel('节点说明',{exact:true}).inputValue(),city+'独立节点说明');await cancel(f);}
    const actual=await readKeys(page);for(const [k,v] of Object.entries(normalBaseline))assert.equal(actual[k],v);
  });
  await test('普通模式修改不影响QA，实际企业切换新页签保留回访入口并显示目标租户规则',async()=>{
    const before=await readKeys(page),f=await open('yestar-sz',false);
    assert.equal(await f.locator('.rr-rule-name').innerText(),'yestar-sz 普通预览保留');await edit(f);await f.getByLabel('规则名称',{exact:true}).fill('深圳普通独立修改');await save(f);
    await page.locator('#userTrigger').click();const targetName=nav.tenants.find(item=>item.id==='yestar-bj').name;
    const [popup]=await Promise.all([page.waitForEvent('popup'),page.getByRole('button',{name:targetName,exact:true}).click()]);watch(popup);await popup.waitForLoadState('networkidle');
    const purl=new URL(popup.url());assert.equal(purl.searchParams.get('tenant'),'yestar-bj');assert.equal(purl.searchParams.get('page'),'revisitRules');
    const target=popup.frameLocator('.frame-wrap:not([hidden]) iframe');await target.locator('.rr-rule-name').waitFor();assert.equal(await target.locator('.rr-rule-name').innerText(),'yestar-bj 普通预览保留');
    await edit(target);await target.getByLabel('规则名称',{exact:true}).fill('北京普通独立修改');await save(target);await popup.close();
    const after=await readKeys(page);equalExcept(before,after,[key('yestar-sz',false),key('yestar-bj',false)]);assert.equal(JSON.parse(after[key('yestar-sz',false)])[0].name,'深圳普通独立修改');
  });
  await test('非艺星和未知租户直接内容路由不挂载规则，也不写入回访存储',async()=>{
    const before=await readKeys(page);
    const denied=nav.tenants.filter(item=>!tenants.some(([id])=>id===item.id)).map(item=>item.id);
    for(const id of [...denied,'unknown-tenant']){
      await page.goto(url(id,true,false),{waitUntil:'networkidle'});assert.equal(await page.locator('#app.rr-root').count(),0,id);assert.equal(await page.getByRole('button',{name:'＋ 新建规则',exact:true}).count(),0,id);
    }
    assert.deepEqual(await readKeys(page),before);report.deniedTenantCount=denied.length+1;
  });
  await test('深圳既有v2稳定ID/启用/附加条件保存保留，取消草稿不修改旧数据',async()=>{
    const f=await open('yestar-sz',true,false),before=await readKeys(page);
    const prior=await page.evaluate(()=>{const r=RevisitRuleModel.seedRules()[0];r.name='深圳既有v2规则';r.enabled=true;r.runAt='02:35';r.nodes[0].note='原节点说明';r.nodes[0].include=[{field:'grade',op:'in',values:['A级'],value:'',start:'',end:'',min:'',max:''}];return[r];});
    const original=JSON.stringify(prior);await page.evaluate(({k,v})=>localStorage.setItem(k,v),{k:key('yestar-sz'),v:original});await page.reload({waitUntil:'networkidle'});
    await edit(f);await f.getByLabel('规则名称',{exact:true}).fill('取消草稿');await f.getByLabel('节点说明',{exact:true}).fill('取消的说明');await cancel(f);assert.equal(await page.evaluate(k=>localStorage.getItem(k),key('yestar-sz')),original);
    await edit(f);await f.getByLabel('回访目的',{exact:true}).fill('仅修改合成目的');await save(f);const saved=await stored(page,key('yestar-sz'));const expected=JSON.parse(original);expected[0].purpose='仅修改合成目的';assert.deepEqual(saved,expected);
    equalExcept(before,await readKeys(page),[key('yestar-sz')]);
  });
  await test('深圳v1仅显式导入；其他租户不读旧规则，附加日期/等级/排除/范围保留',async()=>{
    const legacyContext=await browser.newContext({viewport:{width:1512,height:982}}),legacy=await legacyContext.newPage();watch(legacy);await open('yestar-sz',true,false,legacy);
    const old={id:'old-sz-day3',name:'深圳合成旧规则',purpose:'旧目的',scope:{groupIds:['media'],accountIds:['douyin-01']},include:[{field:'added',op:'relative-day',value:'3',values:[]},{field:'grade',op:'in',values:['A级']},{field:'consulted',op:'date-range',start:'2026-09-01',end:'2026-09-26',values:[]}],exclude:[{field:'outbound',op:'within-days',value:'2',values:[]},{field:'status',op:'in',values:['异常']}],runAt:'02:15',enabled:true};
    const raw=JSON.stringify([old]);await legacy.evaluate(({k,v})=>localStorage.setItem(k,v),{k:key('yestar-sz',true,1),v:raw});
    let f=await open('yestar-bj',true,false,legacy);assert.equal(await f.locator('.rr-rule-name').innerText(),'添加好友后回访');assert.equal(await legacy.evaluate(k=>localStorage.getItem(k),key('yestar-bj')),null);
    f=await open('yestar-sz',true,false,legacy);assert.equal(await legacy.evaluate(k=>localStorage.getItem(k),key('yestar-sz')),null);
    await f.getByRole('button',{name:'查看旧规则 / 逐条导入',exact:true}).click();await f.getByRole('button',{name:'导入为新草稿',exact:true}).click();assert.equal(await f.getByLabel('节点天数',{exact:true}).inputValue(),'3');await save(f);
    const imported=(await stored(legacy,key('yestar-sz')))[0];assert.equal(imported.anchor,'added');assert.equal(imported.enabled,false);assert.notEqual(imported.id,old.id);assert.equal(imported.runAt,old.runAt);assert.deepEqual(imported.scope,old.scope);assert.deepEqual(imported.nodes[0].include,old.include.slice(1));assert.deepEqual(imported.nodes[0].exclude,old.exclude);
    assert.equal(await legacy.evaluate(k=>localStorage.getItem(k),key('yestar-sz',true,1)),raw);assert.equal(await legacy.evaluate(k=>localStorage.getItem(k),key('yestar-sz',false)),null);await legacyContext.close();
  });
  await test('跨租户账号写入候选规则不能保存，原数据与其他租户不变',async()=>{
    const f=await open('yestar-bj',true,false);
    const invalid=await page.evaluate(()=>{const r=RevisitRuleModel.forTenant('yestar-bj').seedRules()[0];r.scope={groupIds:[],accountIds:['media-01']};return[r];});
    await page.evaluate(({k,v})=>localStorage.setItem(k,JSON.stringify(v)),{k:key('yestar-bj'),v:invalid});await page.reload({waitUntil:'networkidle'});const before=await readKeys(page);
    await edit(f);await f.getByRole('button',{name:'保存整条规则',exact:true}).click();assert.ok((await f.locator('.rr-form-error').innerText()).includes('失效'));assert.deepEqual(await readKeys(page),before);
  });
  await test('1120宽成都编辑页无页面横向溢出，保存入口可达',async()=>{
    await page.setViewportSize({width:1120,height:820});const f=await open('yestar');await edit(f);
    const size=await f.locator('#app').evaluate(()=>({scroll:document.documentElement.scrollWidth,width:document.documentElement.clientWidth}));assert.ok(size.scroll<=size.width+2);
    await f.getByRole('button',{name:'保存整条规则',exact:true}).scrollIntoViewIfNeeded();assert.equal(await f.getByRole('button',{name:'保存整条规则',exact:true}).isVisible(),true);
    const screenshot='tenant-yestar-narrow.png';await page.locator('.frame-wrap:not([hidden]) iframe').screenshot({path:path.join(__dirname,screenshot)});screenshots.push({tenant:'yestar',path:screenshot,scope:'content iframe at viewport width 1120'});
  });
  await test('无浏览器脚本异常与外部网络请求',async()=>{assert.deepEqual(errors,[]);assert.deepEqual(external,[]);});
  report.status='PASS';
}catch(error){
  results.push({name:activeTest,status:'FAIL',error:error.message.replaceAll(__dirname,'[checks]').replaceAll(process.cwd(),'[cwd]')});report.status='FAIL';
  console.error('FAIL '+activeTest+': '+error.message);process.exitCode=1;
}finally{
  report.verifiedAt=new Date().toISOString();report.passed=results.filter(item=>item.status==='PASS').length;report.total=results.length;report.pageErrors=errors;report.externalRequests=external.length;
  fs.writeFileSync(path.join(__dirname,'tenant-browser-results.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({status:report.status,passed:report.passed,total:report.total,screenshots:screenshots.length}));if(browser)await browser.close();
}
})().catch(error=>{console.error(error.message);process.exitCode=1;});
