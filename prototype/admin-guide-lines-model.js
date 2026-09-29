/* SPEC-SUIYIN-ADMIN-073@1.0.0 — browser-local tenant configuration. */
'use strict';
window.AdminGuideLineModel=(()=>{
 const registry=new Map(),clone=value=>structuredClone(value);
 const prefix=new URLSearchParams(location.search).get('qa')==='1'?'admin-qa-guide-lines:v1:':'admin-guide-lines:v1:';
 const key=tenant=>prefix+tenant;
 const uid=()=> 'local-'+(globalThis.crypto?.randomUUID?.()||Date.now().toString(36)+'-'+Math.random().toString(36).slice(2));
 const registerTenant=tenant=>{if(tenant?.id)registry.set(tenant.id,clone(tenant));};
 const isEligible=tenant=>registry.get(tenant)?.capabilities?.guideLineManage===true;
 function safeImage(src){return typeof src==='string'&&(/^assets\/guide-lines\/[a-zA-Z0-9._-]+\.png$/.test(src)||/^data:image\/png;base64,[a-zA-Z0-9+/=]+$/.test(src));}
 function validate(config){
  if(!config||config.version!==1||typeof config.tenant!=='string'||!Array.isArray(config.categories))return {ok:false,error:'配置格式不正确，请保留当前更改并重新载入。'};
  const categoryIds=new Set(),names=new Set(),itemIds=new Set();
  for(const category of config.categories){
   const name=String(category.name||'').trim();
   if(!name)return {ok:false,error:'请填写分类名称。'};
   if(name.length>60)return {ok:false,error:'分类名称不能超过60个字。'};
   if(names.has(name))return {ok:false,error:'已存在同名分类，请使用不同的名称。'};names.add(name);
   if(!category.id||categoryIds.has(category.id)||!Array.isArray(category.items)||typeof category.enabled!=='boolean')return {ok:false,error:'分类结构不正确，不能保存。'};categoryIds.add(category.id);
   for(const item of category.items){
    if(!item.id||itemIds.has(item.id))return {ok:false,error:'辅助线条目重复，请移除重复项后重试。'};itemIds.add(item.id);
    if(!String(item.name||'').trim())return {ok:false,error:'请填写辅助线的管理名称。'};
    if(String(item.name).length>120)return {ok:false,error:'辅助线名称不能超过120个字。'};
    if(!safeImage(item.src)||!Number.isFinite(item.width)||!Number.isFinite(item.height)||item.width<=0||item.height<=0)return {ok:false,error:'有图片尚未准备好，请处理失败项后保存。'};
   }
  }
  return {ok:true};
 }
 async function ensure(tenant){
  if(!registry.has(tenant)){const r=await fetch('data/navigation-snapshot.json');if(!r.ok)throw Error('租户信息读取失败，请重新载入。');const n=await r.json();n.tenants?.forEach(registerTenant);}
  if(!isEligible(tenant))throw Error('当前租户未开放辅助线管理。');
 }
 async function load(tenant){
  await ensure(tenant);let raw;
  try{raw=localStorage.getItem(key(tenant));}catch{throw Error('浏览器无法读取本地配置，请允许本地存储后重试。');}
  if(raw!==null){let saved;try{saved=JSON.parse(raw);}catch{throw Error('本地配置无法读取，已保留原数据。请检查浏览器存储后重试。');}
   if(saved.tenant!==tenant)throw Error('配置租户不匹配，已阻止读取。');const valid=validate(saved);if(!valid.ok)throw Error(valid.error);return clone(saved);
  }
  const source=window.AdminGuideLinesData;if(!source?.categories)throw Error('初始辅助线样例读取失败，请重新载入。');
  return {version:1,tenant,sourceNote:source.source.note,categories:clone(source.categories)};
 }
 async function save(tenant,config){
  if(!isEligible(tenant)||config?.tenant!==tenant)return {ok:false,error:'当前租户不能保存这份配置。'};
  const valid=validate(config);if(!valid.ok)return valid;
  // Write the complete copy once; setItem failures leave the old stored value intact.
  const next=clone(config);next.savedAt=new Date().toISOString();
  try{localStorage.setItem(key(tenant),JSON.stringify(next));return {ok:true,config:clone(next)};}catch{return {ok:false,error:'本地保存失败，浏览器存储空间不足或不可用。更改已保留，请重试。'};}
 }
 async function imageFromFile(file){
  if(!file)throw Error('请重新选择图片。');
  if(file.size>10*1024*1024)throw Error('图片超过10MiB，请选择较小的PNG图片。');
  const signature=new Uint8Array(await file.slice(0,8).arrayBuffer());
  if(signature.length!==8||![137,80,78,71,13,10,26,10].every((v,i)=>signature[i]===v))throw Error('格式不支持，请选择PNG图片。');
  const url=URL.createObjectURL(file);
  try{
   const img=new Image();img.src=url;try{await img.decode();}catch{throw Error('图片无法读取，请重新选择完整的PNG图片。');}
   const width=img.naturalWidth,height=img.naturalHeight;if(!width||!height)throw Error('图片没有有效尺寸，请重新选择。');
   const scale=Math.min(1,960/Math.max(width,height));const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(width*scale));canvas.height=Math.max(1,Math.round(height*scale));
   canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);
   return {src:canvas.toDataURL('image/png'),width,height,name:file.name.replace(/\.png$/i,'').slice(0,120)||'新增辅助线'};
  }finally{URL.revokeObjectURL(url);}
 }
 return {registerTenant,isEligible,load,save,validate,clone,uid,imageFromFile,key};
})();
