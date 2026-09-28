/* Bind prior actual model results to unchanged 1.3.1 product bytes; does not rerun cases. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const root=path.resolve(process.env.PROTOTYPE_ROOT||process.cwd()),source='prototype/admin-revisit-rules-model.js';
if(!fs.existsSync(path.join(root,source)))throw Error('Run in the prototype repository or set PROTOTYPE_ROOT.');
const hash=x=>crypto.createHash('sha256').update(x).digest('hex'),sha256=hash(fs.readFileSync(path.join(root,source)));
const evidenceRoot=path.resolve(process.env.MODEL_EVIDENCE_ROOT||path.join(__dirname,'../v1.3.0'));
const files=['anchor-model-results.json','tenant-model-results.json','sz-compatibility-results.json'];
const evidence=files.map(file=>{const bytes=fs.readFileSync(path.join(evidenceRoot,file)),data=JSON.parse(bytes);assert.equal(data.source?.sha256||data.modelSha256,sha256,file+' source binding');const passed=data.passed,total=data.total??data.results.length;assert.equal(passed,total,file+' pass count');assert.ok(data.results.every(r=>r.status==='PASS'),file+' case states');return{file,originalSpec:data.spec,originalVerifiedAt:data.verifiedAt,sha256:hash(bytes),passed,total};});
const report={spec:'SPEC-SUIYIN-ADMIN-071@1.3.1',verifiedAt:new Date().toISOString(),status:'PASS',mode:'hash-bound reuse of actual 1.3.0 results; no model test rerun in this command',source:{path:source,sha256},evidence,passed:evidence.reduce((n,x)=>n+x.passed,0),total:evidence.reduce((n,x)=>n+x.total,0)};
fs.writeFileSync(path.join(__dirname,'model-evidence-binding.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({status:report.status,passed:report.passed,total:report.total,mode:report.mode}));
