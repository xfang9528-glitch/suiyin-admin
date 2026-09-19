/** Builds the current multi-tenant prototype as one self-contained HTML file. */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const files=(dir)=>fs.readdirSync(path.join(root,dir),{withFileTypes:true}).flatMap(d=>d.isDirectory()?files(dir+'/'+d.name):[dir+'/'+d.name]);
const types={'.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml'};
const assets=Object.fromEntries(files('assets').map(p=>[p,'data:'+(types[path.extname(p)]||'application/octet-stream')+';base64,'+fs.readFileSync(path.join(root,p)).toString('base64')]));
const embedAssets=text=>Object.entries(assets).reduce((out,[p,data])=>out.split(p).join(data),text);
const serial=value=>JSON.stringify(value).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
const data=Object.fromEntries(files('data').filter(p=>p.endsWith('.json')).map(p=>[p,JSON.parse(embedAssets(read(p)))]));
function offlineFetch(input){
 const raw=typeof input==='string'?input:input.url;
 const key=String(raw).split('?')[0].replace(/^\.\//,'');
 if(!Object.hasOwn(window.__ADMIN_INLINE_DATA__,key))return Promise.reject(new Error('离线资源未包含：'+key));
 return Promise.resolve(new Response(JSON.stringify(window.__ADMIN_INLINE_DATA__[key]),{status:200,headers:{'Content-Type':'application/json'}}));
}
function inlinePage(file){
 const scripts=[];
 let html=read(file).replace(/<link\s+rel=["']stylesheet["']\s+href=["']([^"']+)["']\s*\/?\s*>/gi,(_,p)=>'<style>\n'+embedAssets(read(p))+'\n</style>');
 html=html.replace(/<script\s+src=["']([^"']+)["'][^>]*>\s*<\/script>/gi,(_,p)=>{
  let code=embedAssets(read(p));
  // about:srcdoc has an opaque location.origin; use the inherited parent origin for messages.
  const origin="(window.__ADMIN_INLINE_ORIGIN__||location.origin)";
  code=code.replaceAll('location.origin',origin).replaceAll(','+origin+')',','+origin+"==='null'?'*':"+origin+')');
  if(p==='admin-content.js')code=code.replace('new URLSearchParams(location.search)','new URLSearchParams(window.__ADMIN_INLINE_PARAMS__||location.search)');
  if(p==='admin-navigation.js'){
   const needle="frame.src='admin-content.html?'+p;";
   if(!code.includes(needle))throw Error('Inline iframe adapter must be updated for navigation changes');
   code=code.replace(needle,'frame.srcdoc=window.__ADMIN_INLINE_FRAME__(p.toString());');
  }
  scripts.push('<script>\n'+code.replace(/<\/script/gi,'<\\/script')+'\n</script>');return '';
 });
 return embedAssets(html).replace('</body>',scripts.join('\n')+'\n</body>');
}
const child=inlinePage('admin-content.html');
const bootstrap=`window.__ADMIN_INLINE_DATA__=${serial(data)};window.fetch=${offlineFetch.toString()};window.__ADMIN_INLINE_FRAME__=function(params){const code='window.__ADMIN_INLINE_PARAMS__='+JSON.stringify(params)+';window.__ADMIN_INLINE_ORIGIN__=parent.location.origin;window.__ADMIN_INLINE_DATA__=parent.__ADMIN_INLINE_DATA__;window.fetch=parent.fetch.bind(parent);';return ${serial(child)}.replace('<head>','<head><script>'+code+'<'+ '/script>');};`;
let output=inlinePage('_shell.html');
// Install data before any shell scripts; all original scripts retain their order at body end.
output=output.replace('<body class="admin-shell">','<body class="admin-shell"><script>'+bootstrap+'<'+ '/script>');
fs.writeFileSync(path.join(root,'_shell_inline.html'),output);
console.log(JSON.stringify({output:'prototype/_shell_inline.html',jsonFiles:Object.keys(data).length,assets:Object.keys(assets).length,bytes:Buffer.byteLength(output)}));
