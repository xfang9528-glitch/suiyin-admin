/* Clean captures of the unchanged native scroll interaction; no saved-rule writes. */
'use strict';
const path=require('node:path'),fs=require('node:fs');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const base=(process.env.PROTOTYPE_BASE_URL||'http://127.0.0.1:8148').replace(/\/+$/,'');
(async()=>{const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{channel:'chrome'})});try{
 const page=await browser.newPage({viewport:{width:1512,height:982},locale:'zh-CN'});await page.goto(base+'/prototype/_shell.html?tenant=yestar-sz&page=revisitRules&qa=1',{waitUntil:'networkidle'});
 const f=page.frameLocator('.frame-wrap:not([hidden]) iframe');await f.getByRole('button',{name:'编辑',exact:true}).first().click();
 await f.getByRole('combobox',{name:'回访基准日期',exact:true}).click();await f.getByRole('option',{name:'首次购买',exact:true}).click();await f.getByRole('combobox',{name:'回访基准日期',exact:true}).click();
 const shot=async name=>{await f.locator('#toast.visible').waitFor({state:'hidden'});await page.locator('.frame-wrap:not([hidden]) iframe').screenshot({path:path.join(__dirname,name)});};
 await f.getByRole('option',{name:'末次咨询日期',exact:true}).scrollIntoViewIfNeeded();await shot('event-options-top.png');
 await f.getByRole('option',{name:'最近一次划扣',exact:true}).scrollIntoViewIfNeeded();await shot('event-options-bottom.png');await page.keyboard.press('Escape');
 await page.setViewportSize({width:1120,height:820});await f.locator('body').evaluate(()=>window.scrollTo(0,0));await shot('event-options-narrow.png');
 const result={spec:'SPEC-SUIYIN-ADMIN-071@1.3.1',capturedAt:new Date().toISOString(),screenshots:['event-options-top.png','event-options-bottom.png','event-options-narrow.png'],method:'fresh Chrome context; normal dropdown scroll to first and last option; no style/DOM masking',saved:false};fs.writeFileSync(path.join(__dirname,'event-options-capture-results.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
}finally{await browser.close();}})().catch(error=>{console.error(error.message);process.exitCode=1;});
