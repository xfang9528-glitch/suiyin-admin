/* Shared local menu visibility. Full inventory stays separate from visible navigation. */
'use strict';
window.AdminMenuState={
 defaultEnabled(tenant){return tenant.menu.filter(g=>g.display!=='隐藏').flatMap(g=>g.children?g.children.filter(c=>c.display!=='隐藏').map(c=>c.route):[g.route]);},
 visible(tenant,override){
  const enabled=new Set(override?.enabled??this.defaultEnabled(tenant));
  const decorate=item=>({...item,label:override?.labels?.[item.route||item.id]||item.label});
  const order=items=>items.map(decorate).sort((a,b)=>{const av=override?.order?.[a.route||a.id],bv=override?.order?.[b.route||b.id];return av===undefined&&bv===undefined?0:(bv??b.sort??0)-(av??a.sort??0);});
  return order(tenant.menu).map(g=>g.children?{...g,children:order(g.children).filter(c=>enabled.has(c.route))}:g).filter(g=>g.children?g.children.length:enabled.has(g.route));
 }
};
