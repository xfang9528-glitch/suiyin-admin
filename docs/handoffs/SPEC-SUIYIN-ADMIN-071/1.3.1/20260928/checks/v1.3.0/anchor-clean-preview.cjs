/* Clean screenshots in a fresh Chrome context; never use a personal profile. */
'use strict';
const fs=require('node:fs'),path=require('node:path');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const base=(process.env.PROTOTYPE_BASE_URL||'http://127.0.0.1:8148').replace(/\/+$/,'');
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{channel:'chrome'})});
 const context=await browser.newContext(),page=await context.newPage();await page.setViewportSize({width:1512,height:982});
 await page.goto(base+'/prototype/_shell.html?tenant=yestar-sz&page=revisitRules&qa=1',{waitUntil:'networkidle'});
 const f=page.frameLocator('.frame-wrap:not([hidden]) iframe');await f.locator('.rr-root').waitFor();await f.getByRole('button',{name:'编辑',exact:true}).first().click();
 async function choose(label,value){const text=await f.locator('select[aria-label="'+label+'"] option[value="'+value+'"]').innerText();await f.getByRole('combobox',{name:label,exact:true}).click();await f.getByRole('option',{name:text,exact:true}).click();}
 async function shot(name){await f.locator('#toast.visible').waitFor({state:'hidden'});await page.locator('.frame-wrap:not([hidden]) iframe').screenshot({path:path.join(__dirname,name)});}
 await choose('回访基准日期','grade-A');await choose('等级来源','ai');await f.locator('body').evaluate(()=>window.scrollTo(0,0));await shot('anchor-grade-ai-editor.png');
 await f.getByRole('combobox',{name:'回访基准日期',exact:true}).click();await shot('anchor-dropdown-options.png');await f.getByRole('option',{name:'划扣',exact:true}).scrollIntoViewIfNeeded();await shot('anchor-dropdown-new-options.png');await page.keyboard.press('Escape');
 await page.setViewportSize({width:1120,height:820});await f.locator('body').evaluate(()=>window.scrollTo(0,0));await shot('anchor-grade-narrow.png');
 const names=await f.locator('select[aria-label="回访基准日期"] option').allTextContents();
 const report={spec:'SPEC-SUIYIN-ADMIN-071@1.3.0',verifiedAt:new Date().toISOString(),scope:'fresh disposable Chrome context, QA draft only; no save',anchorOptions:names,screenshots:['anchor-grade-ai-editor.png','anchor-dropdown-options.png','anchor-dropdown-new-options.png','anchor-grade-narrow.png'],dropdown:'existing scroll behavior retained; top and bottom states jointly show all 12 choices',toast:'waited for natural hidden state; no DOM masking or CSS injection'};
 fs.writeFileSync(path.join(__dirname,'anchor-clean-preview-results.json'),JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify({options:names.length,saved:false,screenshots:report.screenshots}));
 await browser.close();
})().catch(error=>{console.error(error.message);process.exit(1);});
