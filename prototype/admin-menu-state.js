/* Shared local menu visibility. Full inventory stays separate from visible navigation. */
'use strict';
window.AdminMenuState={
 defaultEnabled(tenant){return tenant.menu.filter(g=>g.display!=='隐藏').flatMap(g=>g.children?g.children.filter(c=>c.display!=='隐藏').map(c=>c.route):[g.route]);},
 migrate(tenant,override){
  const migration='sales-voice-stats-v1',route='salesVoiceStats';
  if(override?.appliedMigrations?.[migration])return override;
  const saved=structuredClone(override||{}),parent=tenant.menu.find(g=>g.children?.some(c=>c.route===route));
  const hadEnabled=Array.isArray(saved.enabled);
  if(!hadEnabled)saved.enabled=this.defaultEnabled(tenant);
  if(parent&&hadEnabled&&!saved.enabled.includes(route)&&saved.display?.[route]!=='隐藏'){
   const parentKey=parent.route||parent.id,parentShown=(saved.display?.[parentKey]??parent.display)!=='隐藏';
   // A legacy selection with no enabled children means this branch was hidden.
   const hasVisibleSibling=parent.children.some(c=>c.route!==route&&saved.enabled.includes(c.route)&&(saved.display?.[c.route]??c.display)!=='隐藏');
   if(parentShown&&hasVisibleSibling)saved.enabled.push(route);
  }
  saved.appliedMigrations={...saved.appliedMigrations,[migration]:true};
  saved.menuDataRevision=tenant.menuDataRevision||'2026-09-20-menu-sales-voice-stats-v1';
  return saved;
 },
 read(tenant,storageKey){
  let saved;try{saved=JSON.parse(localStorage.getItem(storageKey)||'null');}catch{}
  const migrated=this.migrate(tenant,saved);
  if(JSON.stringify(migrated)!==JSON.stringify(saved)){try{localStorage.setItem(storageKey,JSON.stringify(migrated));}catch{}}
  return migrated;
 },
 visible(tenant,override){
  override=this.migrate(tenant,override);
  const enabled=new Set(override.enabled),shown=item=>(override.display?.[item.route||item.id]??item.display)!=='隐藏';
  const decorate=item=>({...item,label:override.labels?.[item.route||item.id]||item.label});
  const order=items=>items.map(decorate).sort((a,b)=>{const av=override.order?.[a.route||a.id],bv=override.order?.[b.route||b.id];return av===undefined&&bv===undefined?0:(bv??b.sort??0)-(av??a.sort??0);});
  return order(tenant.menu).filter(shown).map(g=>g.children?{...g,children:order(g.children).filter(c=>shown(c)&&enabled.has(c.route))}:g).filter(g=>g.children?g.children.length:enabled.has(g.route));
 }
};

/* SPEC-SUIYIN-ADMIN-058: ai-cost-stats-v1 migration. */
(() => {
 const state=window.AdminMenuState,previous=state.migrate;
 state.migrate=function(tenant,override){
  const migrated=previous.call(this,tenant,override),migration='ai-cost-stats-v1',route='aiCostStats';
  if(migrated?.appliedMigrations?.[migration])return migrated;
  const parent=tenant.menu.find(group=>group.children?.some(child=>child.route===route));
  if(!parent)return migrated;
  const saved=structuredClone(migrated||{}),hadEnabled=Array.isArray(override?.enabled);
  const wasEnabled=hadEnabled&&override.enabled.includes(route);
  if(!Array.isArray(saved.enabled))saved.enabled=this.defaultEnabled(tenant);
  if(!wasEnabled){
   saved.enabled=saved.enabled.filter(item=>item!==route);
   const parentKey=parent.route||parent.id,parentShown=(saved.display?.[parentKey]??parent.display)!=='隐藏';
   const child=parent.children.find(item=>item.route===route),childShown=(saved.display?.[route]??child.display)!=='隐藏';
   const siblingShown=parent.children.some(item=>item.route!==route&&saved.enabled.includes(item.route)&&(saved.display?.[item.route]??item.display)!=='隐藏');
   if(parentShown&&childShown&&(!hadEnabled||siblingShown))saved.enabled.push(route);
  }
  saved.appliedMigrations={...saved.appliedMigrations,[migration]:true};
  saved.menuDataRevision=tenant.menuDataRevision||'2026-09-20-menu-ai-cost-stats-v1';
  return saved;
 };
})();

/* SPEC-SUIYIN-ADMIN-060@1.1.0: one local platform definition, all tenant sidebars.
 * Project only existing tenant routes; never copy another tenant's page inventory. */
window.AdminPlatformMenu=(()=>{
 const qa=new URLSearchParams(location.search).get('qa')==='1';
 const key=(qa?'admin-qa:v1:':'admin-content:v1:')+'bzds:allMenu';
 let baseline,pending;
 function tree(model){
  const table=model?.tables?.[0];if(!Array.isArray(table?.rows)||!Array.isArray(table.headers))return null;
  const column=label=>table.headers.indexOf(label),routeColumn=column('菜单路由'),statusColumn=column('菜单状态');
  if(routeColumn<0||statusColumn<0)return null;
  const nodes=new Map(),byRoute=new Map(),stack=[];
  for(const [index,row]of table.rows.entries()){
   if(!row?.id||!Array.isArray(row.cells)||nodes.has(row.id))return null;
   const depth=row.tree?.depth??0;while(stack.length&&stack.at(-1).depth>=depth)stack.pop();
   const parent=stack.at(-1),item={id:row.id,parentId:parent?.id||'',rootId:parent?.rootId||row.id,depth,index,route:row.cells[routeColumn]||'',label:row.cells[0],display:row.cells[statusColumn]};
   nodes.set(item.id,item);if(item.route)byRoute.set(item.route,item);stack.push(item);
  }
  return {nodes,byRoute};
 }
 async function load(){
  if(!pending)pending=fetch('data/content/bzds.json').then(r=>{if(!r.ok)throw Error('平台菜单配置读取失败');return r.json();}).then(data=>{baseline=tree(data.allMenu);if(!baseline)throw Error('平台菜单配置无效');});
  return pending;
 }
 function read(){try{const saved=JSON.parse(localStorage.getItem(key)||'null');return saved?.tenant==='bzds'&&saved?.route==='allMenu'?tree(saved):null;}catch{return null;}}
 function project(tenant,visible,override={}){
  const current=read();if(!baseline||!current)return visible;
  const templates=new Map(),groupIds=new Map();
  for(const group of tenant.menu){
   // Snapshot group ids are tenant-local. Resolve them through their original route inventory.
   let id=baseline.byRoute.get(group.route)?.id;
   if(!id&&group.children){
    const votes=new Map();for(const child of group.children){const root=baseline.byRoute.get(child.route)?.rootId;if(root)votes.set(root,(votes.get(root)||0)+1);}
    const ranked=[...votes].sort((a,b)=>b[1]-a[1]);if(ranked[0]&&(!ranked[1]||ranked[0][1]>ranked[1][1]))id=ranked[0][0];
   }
   if(id){templates.set(id,group);groupIds.set(group.id,id);}
  }
  const buckets=new Map(),original=[];
  function bucket(id,fallback){
   if(buckets.has(id))return buckets.get(id);
   const definition=current.nodes.get(id),template=templates.get(id)||fallback;
   const base=definition?baseline.nodes.get(id):null;
   const group=template?{...template}:{id:'platform-'+id,label:definition.label,platformLabel:definition.label};
   if(definition&&(!base||definition.label!==base.label))group.label=definition.label;
   const result={id,group,definition,children:[],self:null};buckets.set(id,result);original.push(result);return result;
  }
  function shown(definition){
   const seen=new Set();while(definition){if(seen.has(definition.id)||definition.display==='隐藏')return false;seen.add(definition.id);if(!definition.parentId)return true;definition=current.nodes.get(definition.parentId);if(!definition)return false;}return false;
  }
  for(const group of visible){
   const groupId=groupIds.get(group.id);
   for(const leaf of group.children||[group]){
    const base=baseline.byRoute.get(leaf.route),definition=base?current.nodes.get(base.id):null;
    if(base&&(!definition||!shown(definition)))continue;
    const targetId=definition?.rootId||groupId||'tenant:'+group.id;
    const targetDefinition=current.nodes.get(targetId);
    if(targetDefinition&&!shown(targetDefinition))continue;
    const template=templates.get(targetId);
    if(template&&(override.display?.[template.route||template.id]??template.display)==='隐藏')continue;
    const target=bucket(targetId,groupId===targetId||!definition?group:null);
    const item={...leaf};if(definition&&definition.label!==base.label)item.label=definition.label;
    const entry={item,index:definition?.index??Number.MAX_SAFE_INTEGER};
    if(definition&&!definition.parentId&&!group.children)target.self=entry;
    else if(!definition&&!group.children&&!groupId)target.self=entry;
    else target.children.push(entry);
   }
  }
  // Keep unmatched tenant-specific groups in their slots; order known groups by the platform tree.
  const sorted=original.filter(b=>b.definition).sort((a,b)=>a.definition.index-b.definition.index);let next=0;
  return original.map(b=>b.definition?sorted[next++]:b).map(b=>{
   const children=b.children.sort((a,c)=>a.index-c.index).map(e=>e.item);
   if(b.self&&!children.length)return b.self.item;
   // A leaf can receive children. Retain its own page as the first entry in that group.
   if(b.self)children.unshift(b.self.item);
   const group={...b.group,children};delete group.route;return group;
  }).filter(g=>!g.children||g.children.length);
 }
 return {key,load,project};
})();
