/** Freeze staged delivery bytes so both GitHub and Pages can be verified exactly. */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const git=(...args)=>execFileSync('git',['-c','safe.directory='+root.replaceAll('\\','/'),'-C',root,...args],{maxBuffer:24*1024*1024});
const tag=process.argv[2];
if(!tag||!/^[a-zA-Z0-9._-]+$/.test(tag))throw Error('usage: node prototype/build_release_manifest.mjs <release-tag>');
const files=git('ls-files','-z').toString().split('\0').filter(p=>p&&p!=='release.json'&&!p.startsWith('.github/')&&!p.startsWith('.')&&p!=='serve.js');
const hashes=Object.fromEntries(files.map(p=>[p,crypto.createHash('sha256').update(git('show',':'+p)).digest('hex')]));
const manifest={tag,spec:'SPEC-SUIYIN-ADMIN-054@1.0.0',baseline:'SPEC-SUIYIN-ADMIN-051@1.1.0',specs:['SPEC-SUIYIN-ADMIN-052@1.1.1','SPEC-SUIYIN-ADMIN-053@1.0.0','SPEC-SUIYIN-ADMIN-054@1.0.0','SPEC-SUIYIN-ADMIN-055@1.0.0','SPEC-SUIYIN-ADMIN-056@1.0.0'],runtime:'static-html',coverage:{tenants:15,routes:84,tenantRoutes:752},generatedAt:new Date().toISOString(),files:hashes};
fs.writeFileSync(path.join(root,'release.json'),JSON.stringify(manifest,null,2)+'\n');
console.log(JSON.stringify({tag,files:files.length,output:'release.json'}));
