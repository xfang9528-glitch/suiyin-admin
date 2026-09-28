/* Run the existing HTTP comparison harness, separately from file:// evidence. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const base=(process.env.PROTOTYPE_BASE_URL||'http://127.0.0.1:8148').replace(/\/+$/,'');
let browser;const errors=[];
(async()=>{try{
 browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{channel:'chrome'})});
 const context=await browser.newContext({viewport:{width:1512,height:1100},locale:'zh-CN'}),page=await context.newPage();
 page.on('pageerror',error=>errors.push(error.message));
 await page.goto(base+'/prototype/_inline-check.html');await page.locator('#run').click();
 await page.locator('#report[data-complete="true"]').waitFor({timeout:180000});
 const result=JSON.parse(await page.locator('#report').innerText());
 const detailed=await page.evaluate(()=>results);
 const relevant=detailed.filter(item=>item.name.startsWith('071 '));
 const source=await (await context.request.get(base+'/prototype/_inline-check.html')).body();
 const report={spec:'SPEC-SUIYIN-ADMIN-071@1.2.0',verifiedAt:new Date().toISOString(),mode:'HTTP comparison harness; separate from true file:// test',file:'prototype/_inline-check.html',sha256:crypto.createHash('sha256').update(source).digest('hex'),...result,revisit:{total:relevant.length,passed:relevant.filter(item=>item.passed).length,failed:relevant.filter(item=>!item.passed)},scriptErrors:errors};
 fs.writeFileSync(path.join(__dirname,'inline-check-page-results.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
 if(result.failed.length||errors.length||!relevant.length||relevant.some(item=>!item.passed))process.exitCode=1;
}finally{await browser?.close();}})().catch(error=>{console.error(error.message);process.exitCode=1;});
