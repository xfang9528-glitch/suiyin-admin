/* SPEC-SUIYIN-ADMIN-076: route-based naming and explicit tenant time-setting policy. */
'use strict';
window.AdminAccountProfile=(()=>{
 const title='碎银账号',oldTitles=new Set(['销售管理','碎银账号管理']);
 const noDutyTime=new Set(['yestar-sz','yestar','yestar-bj','yestar-gz','yestar-hz','yestar-jx','huamei-xian','aoli-xian']);
 const name=value=>oldTitles.has(value)?title:value;
 const removesDutyTime=id=>noDutyTime.has(id);
 const usesConsultation=id=>noDutyTime.has(id);
 // Display only: callers keep source field keys, user text and entity names intact.
 function displayText(id,text){
  if(!usesConsultation(id)||typeof text!=='string')return text;
  if(oldTitles.has(text))return title;
  return text.replace(/商品销售人数|销售额|销售金额|销售量|销售收入|销售/g,word=>word==='销售'?'咨询':word);
 }
 const consultationRoles=Object.freeze(['线上咨询','现场咨询','科室助理']);
 function roleValue(id,value){
  if(!usesConsultation(id))return value;
  if(Array.isArray(value))return [...new Set(value.map(v=>roleValue(id,v)))];
  return typeof value==='string'?value.split(/([、\n])/).map(v=>v==='销售'?'线上咨询':v).join(''):value;
 }
 function roleOptions(id,options=[],includeDefaults=true){
  if(!usesConsultation(id))return options;
  const result=[],seen=new Set();
  for(const option of options){const item=typeof option==='string'?{text:option}:option;for(const text of String(roleValue(id,item.text)||'').split(/[、\n]/).filter(Boolean)){
   if(!seen.has(text)){result.push({...item,text});seen.add(text);}
  }}
  for(const text of includeDefaults?consultationRoles:[])if(!seen.has(text))result.push({text,disabled:false});
  return [...consultationRoles.flatMap(role=>result.filter(item=>item.text===role)),...result.filter(item=>!consultationRoles.includes(item.text))];
 }
 function normalizeRoles(page,id=page?.tenant){
  if(!page||!usesConsultation(id)||!['salesManage','role'].includes(page.route))return page;
  for(const table of page.tables||[]){
   const header=page.route==='salesManage'?'权限角色':'角色名称',index=table.headers.indexOf(header);
   if(index<0)continue;
   for(const row of table.rows||[]){row.cells[index]=roleValue(id,row.cells[index]);if(row.extra&&Object.hasOwn(row.extra,header))row.extra[header]=roleValue(id,row.extra[header]);}
   if(page.route==='role'&&!page.consultationRolesVersion)for(const role of consultationRoles){
    if(table.rows.some(row=>row.cells[index]===role))continue;
    const cells=table.headers.map(h=>h===header?role:/系统角色|超级管理员/.test(h)?'否':h==='备注信息'?'原型岗位；未新增权限':'');
    table.rows.push({id:id+'-consultation-role-'+consultationRoles.indexOf(role),cells,actions:['编辑','删除'],extra:{'角色名称':role,'权限菜单':[]},prototypeOnly:true});
   }
  }
  if(page.route==='role')page.consultationRolesVersion=1;
  return page;
 }
 const isDutyTime=label=>/(?:上下班|上班|下班).*时间|时间.*(?:上下班|上班|下班)/.test(String(label||''));
 function fieldAllowed(id,route,field){return !removesDutyTime(id)||!['salesManage','setting'].includes(route)||!isDutyTime([field.label,field.text,...(field.controls||[]).map(c=>c.placeholder)].join(' '));}
 function normalizeTenant(tenant){
  function visit(items){for(const item of items||[]){if(item.route==='salesManage'){item.label=name(item.label);item.platformLabel=name(item.platformLabel);}visit(item.children);}}
  visit(tenant?.menu);return tenant;
 }
 function normalizePage(page){
  if(!page)return page;
  if(page.route==='salesManage')page.label=name(page.label);
  if(['menu','allMenu'].includes(page.route))for(const table of page.tables||[]){
   const routeColumn=table.headers.indexOf('菜单路由'),nameColumn=table.headers.indexOf('菜单名称'),platformColumn=table.headers.indexOf('平台菜单名称');
   for(const row of table.rows||[]){
    if((row.tree?.key||row.tree?.route)!=='salesManage'&&row.cells[routeColumn]!=='salesManage')continue;
    if(nameColumn>=0)row.cells[nameColumn]=name(row.cells[nameColumn]);
    if(platformColumn>=0)row.cells[platformColumn]=name(row.cells[platformColumn]);
    if(row.tree)for(const key of ['menuLocalLabel','menuRenderedLabel'])if(key in row.tree)row.tree[key]=name(row.tree[key]);
    if(row.extra)for(const key of ['菜单名称','平台菜单名称'])if(key in row.extra)row.extra[key]=name(row.extra[key]);
   }
  }
  return page;
 }
 function normalizeOverride(override){if(override?.labels&&Object.hasOwn(override.labels,'salesManage'))override.labels.salesManage=name(override.labels.salesManage);return override;}
 const pending=page=>page?.state==='not-captured'||page?.captureStatus==='not-captured';
 return {title,removesDutyTime,usesConsultation,displayText,consultationRoles,roleValue,roleOptions,normalizeRoles,isDutyTime,fieldAllowed,normalizeTenant,normalizePage,normalizeOverride,pending};
})();
