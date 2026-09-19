/** Freeze staged delivery bytes so both GitHub and Pages can be verified exactly. */
import fs from 'node:fs';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
const tag=process.argv[2];
if(!tag||!/^[a-zA-Z0-9._-]+$/.test(tag))throw Error('usage: node prototype/build_release_manifest.mjs <release-tag>');
const files=execFileSync('git',['ls-files','-z'],{encoding:'utf8'}).split('\0').filter(p=>p&&p!=='release.json'&&!p.startsWith('.github/')&&!p.startsWith('.')&&p!=='serve.js');
const hashes=Object.fromEntries(files.map(p=>[p,crypto.createHash('sha256').update(execFileSync('git',['show',':'+p],{maxBuffer:24*1024*1024})).digest('hex')]));
const manifest={tag,spec:'SPEC-SUIYIN-ADMIN-051@1.1.0',runtime:'static-html',generatedAt:new Date().toISOString(),files:hashes};
fs.writeFileSync('release.json',JSON.stringify(manifest,null,2)+'\n');
console.log(JSON.stringify({tag,files:files.length,output:'release.json'}));
