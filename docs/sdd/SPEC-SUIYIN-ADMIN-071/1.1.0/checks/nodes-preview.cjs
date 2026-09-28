let chromium;
try { ({chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright')); }
catch (_) { throw new Error('Playwright is required. Install it in this checkout with npm install --no-save playwright, or set PLAYWRIGHT_MODULE to an existing Playwright module.'); }
const fs=require('node:fs');
const baseUrl=(process.env.PROTOTYPE_BASE_URL || 'http://127.0.0.1:8148').replace(/\/+$/, '');
(async()=>{const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH ? {executablePath:process.env.CHROME_PATH} : {channel:'chrome'})});try{
 const page=await browser.newPage({viewport:{width:1512,height:982},locale:'zh-CN'});const errors=[],external=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(!r.url().startsWith(baseUrl+'/')&&!r.url().startsWith('data:'))external.push(r.url());});
 await page.goto(baseUrl+'/prototype/_shell.html?tenant=yestar-sz&page=revisitRules&qa=1',{waitUntil:'networkidle'});
 const f=page.frameLocator('.frame-wrap:not([hidden]) iframe');await f.locator('body[data-content-ready="true"]').waitFor();
 await page.locator('.frame-wrap:not([hidden]) iframe').screenshot({path:__dirname+'/nodes-list.png'});const list=await f.locator('#app').innerText();
 await f.getByRole('button',{name:'编辑',exact:true}).first().click();
 await page.locator('.frame-wrap:not([hidden]) iframe').screenshot({path:__dirname+'/nodes-editor.png'});const editor=await f.locator('#app').innerText();
 const controls=await f.locator('#app').evaluate(root=>[...root.querySelectorAll('button,input,select,details')].map(e=>({tag:e.tagName,label:e.getAttribute('aria-label'),text:e.tagName==='BUTTON'?e.textContent:undefined,nodeId:e.getAttribute('data-node-id'),value:e.value})));
 fs.writeFileSync(__dirname+'/nodes-preview.json',JSON.stringify({errors,externalRequests:external.length,list,editor,controls},null,2));console.log(JSON.stringify({errors,externalRequests:external.length,list,editor,controls}));
 }finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
