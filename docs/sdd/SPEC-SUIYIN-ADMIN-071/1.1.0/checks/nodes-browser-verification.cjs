let chromium;
try { ({chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright')); }
catch (_) { throw new Error('Playwright is required. Install it in this checkout with npm install --no-save playwright, or set PLAYWRIGHT_MODULE to an existing Playwright module.'); }
const fs=require('node:fs'),assert=require('node:assert/strict');
const baseUrl=(process.env.PROTOTYPE_BASE_URL || 'http://127.0.0.1:8148').replace(/\/+$/, '');
const shell=baseUrl+'/prototype/_shell.html?tenant=yestar-sz&page=revisitRules&qa=1';
const direct=baseUrl+'/prototype/admin-content.html?tenant=yestar-sz&route=revisitRules&qa=1';
const key='admin-qa-admin-revisit-rules:v2:yestar-sz',oldKey='admin-qa-admin-revisit-rules:v1:yestar-sz';
const results=[];
(async()=>{const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH ? {executablePath:process.env.CHROME_PATH} : {channel:'chrome'})});let page;
try{
 const context=await browser.newContext({viewport:{width:1512,height:982},locale:'zh-CN'});page=await context.newPage();const errors=[],external=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(!r.url().startsWith(baseUrl+'/')&&!r.url().startsWith('data:'))external.push(r.url());});
 await page.goto(shell,{waitUntil:'networkidle'});const f=page.frameLocator('.frame-wrap:not([hidden]) iframe');
 const row=f.locator('tr[data-rule-id="demo-added-followup"]');await row.waitFor();
 const stored=()=>page.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);
 const node=id=>f.locator('button[data-node-id="'+id+'"]');const modal=f.locator('dialog');
 const save=()=>f.getByRole('button',{name:'保存整条规则',exact:true}).click();
 assert.equal(await f.locator('.rr-table tbody tr').count(),1);assert.equal(await row.getByRole('button',{name:'复制',exact:true}).count(),0);
 await row.getByRole('button',{name:'试算',exact:true}).click();assert.equal(await f.locator('.rr-trial-status.included').count(),5);assert.equal(await f.locator('.rr-trial-status.excluded').count(),5);assert.equal(await f.locator('.rr-trial-status.unknown').count(),2);
 assert.ok((await f.locator('.rr-trial').innerText()).includes('第5天节点到期'));await page.locator('.frame-wrap:not([hidden]) iframe').screenshot({path:__dirname+'/nodes-trial.png'});await modal.getByRole('button',{name:'关闭',exact:true}).click();
 results.push('列表一条规则、三节点合并试算及原因');

 await row.getByRole('button',{name:'编辑',exact:true}).click();
 assert.equal(await f.locator('select[aria-label="添加选中条件"] option').count(),22);assert.equal(await f.locator('select[aria-label="添加排除条件"] option').count(),27);assert.equal(await f.locator('button[data-node-id]').count(),3);
 await f.getByLabel('我方发过消息近几天',{exact:true}).fill('4');await node('day-5').click();assert.equal(await f.getByLabel('我方发过消息近几天',{exact:true}).inputValue(),'2');
 await f.getByLabel('节点说明',{exact:true}).fill('第五天独立说明');await f.getByRole('button',{name:'复制其他节点条件',exact:true}).click();assert.ok((await modal.innerText()).includes('第 5 天'));
 await page.locator('.frame-wrap:not([hidden]) iframe').screenshot({path:__dirname+'/nodes-copy.png'});await modal.getByRole('button',{name:'取消',exact:true}).click();assert.equal(await f.getByLabel('我方发过消息近几天',{exact:true}).inputValue(),'2');
 await f.getByRole('button',{name:'复制其他节点条件',exact:true}).click();await modal.getByRole('button',{name:'确认替换条件',exact:true}).click();
 assert.equal(await f.getByLabel('节点天数',{exact:true}).inputValue(),'5');assert.equal(await f.getByLabel('节点说明',{exact:true}).inputValue(),'第五天独立说明');assert.equal(await f.getByLabel('我方发过消息近几天',{exact:true}).inputValue(),'4');
 await f.getByLabel('我方发过消息近几天',{exact:true}).fill('1');await node('day-3').click();assert.equal(await f.getByLabel('我方发过消息近几天',{exact:true}).inputValue(),'4');await save();
 let data=await stored();assert.equal(data.length,1);assert.equal(data[0].runAt,'01:00');assert.equal(data[0].nodes[1].day,'5');assert.equal(data[0].nodes[1].note,'第五天独立说明');assert.equal(data[0].nodes[1].exclude[0].value,'1');assert.equal(data[0].nodes[0].exclude[0].value,'4');
 results.push('完整21/26字段、复制取消/替换只改条件且后续独立');

 await row.getByRole('button',{name:'编辑',exact:true}).click();await f.getByRole('button',{name:'＋ 新增节点',exact:true}).click();await f.getByLabel('节点天数',{exact:true}).fill('5');await save();assert.ok((await f.locator('.rr-form-error').innerText()).includes('不能重复'));assert.equal((await stored())[0].nodes.length,3);
 await f.getByLabel('节点天数',{exact:true}).fill('9');await save();data=await stored();assert.deepEqual(data[0].nodes.map(n=>n.day),['3','5','7','9']);assert.equal(data.length,1);
 await row.getByRole('button',{name:'编辑',exact:true}).click();
 for(let i=0;i<3;i++){await f.getByRole('button',{name:'移除节点',exact:true}).click();await modal.getByRole('button',{name:'确认移除',exact:true}).click();}
 assert.equal(await f.getByRole('button',{name:'移除节点',exact:true}).isDisabled(),true);assert.equal(await f.getByRole('button',{name:'复制其他节点条件',exact:true}).isDisabled(),true);
 await f.getByRole('button',{name:'取消',exact:true}).click();await modal.getByRole('button',{name:'放弃并返回',exact:true}).click();assert.equal((await stored())[0].nodes.length,4);
 results.push('新增/重复日期阻断/排序、至少一个节点、整条取消恢复');

 await row.getByRole('button',{name:'启用',exact:true}).click();assert.equal((await stored())[0].enabled,true);await page.reload({waitUntil:'networkidle'});await row.waitFor();assert.equal((await stored())[0].nodes.length,4);await row.getByRole('button',{name:'暂停',exact:true}).click();assert.equal((await stored())[0].enabled,false);
 results.push('规则整体启停、刷新保存全部节点');

 await f.getByRole('button',{name:'＋ 新建规则',exact:true}).click();await save();assert.ok((await f.locator('.rr-form-error').innerText()).includes('规则名称'));
 await f.getByLabel('规则名称',{exact:true}).fill('零命中新增规则');
 const scope=f.locator('details').first();if(!await scope.evaluate(e=>e.open))await scope.locator('summary').click();
 await f.getByLabel('选择整个自媒体群组',{exact:true}).check();await f.getByLabel('节点天数',{exact:true}).fill('999');
 await f.getByRole('combobox',{name:'添加排除条件',exact:true}).click();await f.getByRole('option',{name:'对方发过消息',exact:true}).click();
 await f.getByRole('button',{name:'查看示例试算',exact:true}).click();assert.equal(await f.locator('.rr-trial-status.included').count(),0);await modal.getByRole('button',{name:'关闭',exact:true}).click();await save();
 data=await stored();assert.equal(data.length,2);assert.equal(data[1].nodes[0].include.length,0);assert.equal(data[1].enabled,false);results.push('新建必填、只按节点时间和排除、零结果保存');

 await row.getByRole('button',{name:'编辑',exact:true}).click();await page.setViewportSize({width:1120,height:820});await page.locator('.frame-wrap:not([hidden]) iframe').screenshot({path:__dirname+'/nodes-narrow.png'});
 const widths=await f.locator('#app').evaluate(()=>({scroll:document.documentElement.scrollWidth,width:document.documentElement.clientWidth}));assert.ok(widths.scroll<=widths.width+2,JSON.stringify(widths));await f.getByRole('button',{name:'保存整条规则',exact:true}).scrollIntoViewIfNeeded();assert.equal(await f.getByRole('button',{name:'保存整条规则',exact:true}).isVisible(),true);results.push('窄窗无页面横向溢出且保存可达');

 const old={id:'old-day3',name:'旧第3天',purpose:'旧目的',scope:{groupIds:['media'],accountIds:['douyin-01']},include:[{field:'added',op:'relative-day',value:'3',values:[]},{field:'grade',op:'in',values:['A级']}],exclude:[{field:'outbound',op:'within-days',value:'2',values:[]}],runAt:'02:15',enabled:true};
 const legacyContext=await browser.newContext();const legacy=await legacyContext.newPage();await legacy.addInitScript(({k,v})=>localStorage.setItem(k,JSON.stringify(v)),{k:oldKey,v:[old]});await legacy.goto(direct,{waitUntil:'networkidle'});
 assert.equal(await legacy.evaluate(k=>localStorage.getItem(k),key),null);await legacy.getByRole('button',{name:'查看旧规则 / 逐条导入',exact:true}).click();await legacy.getByRole('button',{name:'导入为新草稿',exact:true}).click();assert.equal(await legacy.getByLabel('节点天数',{exact:true}).inputValue(),'3');assert.equal(await legacy.getByLabel('每天筛选时间',{exact:true}).inputValue(),'02:15');await legacy.getByRole('button',{name:'保存整条规则',exact:true}).click();
 const migrated=await legacy.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);assert.equal(migrated.length,1);assert.equal(migrated[0].enabled,false);assert.notEqual(migrated[0].id,old.id);assert.equal(migrated[0].nodes[0].include[0].field,'grade');assert.deepEqual(await legacy.evaluate(k=>JSON.parse(localStorage.getItem(k)),oldKey),[old]);results.push('旧规则显式导入保留附加条件/时刻/范围，v1原内容不变');

 const corruptContext=await browser.newContext();const corrupt=await corruptContext.newPage();await corrupt.goto(direct,{waitUntil:'networkidle'});await corrupt.evaluate(k=>localStorage.setItem(k,'{broken'),key);await corrupt.reload({waitUntil:'networkidle'});assert.ok((await corrupt.locator('#app').innerText()).includes('原数据已保留'));assert.equal(await corrupt.getByRole('button',{name:'＋ 新建规则',exact:true}).isDisabled(),true);assert.equal(await corrupt.evaluate(k=>localStorage.getItem(k),key),'{broken');
 await corrupt.getByRole('button',{name:'恢复本页示例',exact:true}).click();await corrupt.getByRole('button',{name:'确认恢复',exact:true}).click();assert.equal((await corrupt.evaluate(k=>JSON.parse(localStorage.getItem(k)),key))[0].nodes.length,3);results.push('损坏新版存储不覆盖及显式恢复');

 const deniedContext=await browser.newContext();const denied=await deniedContext.newPage();await denied.addInitScript(()=>{const base=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k.includes('admin-revisit-rules:v2:'))throw new DOMException('full','QuotaExceededError');return base.call(this,k,v);};});await denied.goto(direct,{waitUntil:'networkidle'});await denied.getByRole('button',{name:'编辑',exact:true}).click();await denied.getByLabel('节点天数',{exact:true}).fill('4');await denied.getByRole('button',{name:'保存整条规则',exact:true}).click();assert.ok((await denied.locator('.rr-form-error').innerText()).includes('保存失败'));assert.equal(await denied.getByLabel('节点天数',{exact:true}).inputValue(),'4');assert.equal(await denied.evaluate(k=>localStorage.getItem(k),key),null);results.push('写入失败仍留草稿不假成功');
 assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
 const result={verifiedAt:new Date().toISOString(),results,errors,externalRequests:external.length};fs.writeFileSync(__dirname+'/nodes-browser-results.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
}catch(e){if(page)await page.screenshot({path:__dirname+'/nodes-failure.png',fullPage:true});throw e;}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
