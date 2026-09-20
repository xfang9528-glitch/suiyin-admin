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
