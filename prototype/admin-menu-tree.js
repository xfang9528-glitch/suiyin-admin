/* Menus are hierarchical configuration pages, not paginated search tables.
 * Source: full-content/menu-parity/source-*.json. Writes are browser-local only. */
'use strict';
window.AdminMenu=(()=>{
 const A=window.Admin,{node,button}=A,platform=A.route==='allMenu',matches=['menu','allMenu'].includes(A.route),collapsed=new Set();
 const arrow='<svg viewBox="0 0 1024 1024" aria-hidden="true"><path fill="currentColor" d="M340.864 149.312a30.59 30.59 0 0 0 0 42.752L652.736 512 340.864 831.872a30.59 30.59 0 0 0 0 42.752 29.12 29.12 0 0 0 41.728 0L714.24 534.336a32 32 0 0 0 0-44.672L382.592 149.376a29.12 29.12 0 0 0-41.728 0z"/></svg>';
 const get=(r,label)=>r.cells[A.getTable().headers.indexOf(label)]??r.extra?.[label]??'';
 const rowDepth=r=>r.tree?.depth??0;
 const sortable=matches&&(!platform||A.tenant==='bzds');
 let resizeObservers=[];
 // View memory is independent of the saved menu model and tenant-isolated.
 const viewKey=(new URLSearchParams(location.search).get('qa')==='1'?'admin-qa-menu-view:v1:':'admin-menu-view:v1:')+A.tenant+':'+A.route;
 const contentKey=(new URLSearchParams(location.search).get('qa')==='1'?'admin-qa:v1:':'admin-content:v1:')+A.tenant+':'+A.route;
 let memoryMessage='',loadedStamp='',tenantWarnings=[],conflictIds=new Set();
 const linkedScope=platform?'全租户':'本租户';
 const stateStamp=()=>[contentKey,window.AdminPlatformMenu.key,A.navStorageKey(A.tenant)].map(key=>{try{return localStorage.getItem(key)||'';}catch{return '';}}).join('\u0000');
 function memoryHint(){
  const hint=node('span','menu-memory-hint');hint.setAttribute('role','status');
  try{const saved=JSON.parse(localStorage.getItem(contentKey)||'null');const restored=saved?.tenant===A.tenant&&saved?.route===A.route&&saved?.history?.length;hint.textContent=memoryMessage||tenantWarnings[0]||(restored?'已恢复本地设置 · '+linkedScope+'导航联动':'修改后联动'+(platform?'所有租户':'本租户')+'导航（本地原型）');hint.title=tenantWarnings.join('；')||(restored?'最近保存：'+saved.history[0].time+'；排序与归属应用于'+linkedScope+'导航，刷新后保留。':'本地记忆按当前浏览器、访问地址和租户分别保存。');}catch{hint.textContent='浏览器本地存储不可用';hint.classList.add('save-error');}
  return hint;
 }
 function reportMemory(message,error=false){memoryMessage=message;const hint=document.querySelector('.menu-memory-hint');if(hint){hint.textContent=message;hint.classList.toggle('save-error',error);}}
 let viewLoaded=false,viewMemory={scrollTop:0,scrollLeft:0,collapsed:[]},viewTimer;
 function rememberView(){
  if(!matches||moving?.active)return;const wrap=document.querySelector('.menu-table-wrap');
  if(!wrap||!wrap.clientHeight||wrap.dataset.restoringView==='true'||document.body.classList.contains('menu-modal-open'))return;
  viewMemory={scrollTop:wrap.scrollTop,scrollLeft:wrap.scrollLeft,collapsed:[...collapsed]};
  try{localStorage.setItem(viewKey,JSON.stringify(viewMemory));}catch{}
 }
 function loadView(){
  if(viewLoaded){rememberView();return;}viewLoaded=true;
  try{const saved=JSON.parse(localStorage.getItem(viewKey)||'null');if(saved&&Array.isArray(saved.collapsed)){viewMemory={scrollTop:Math.max(0,Number(saved.scrollTop)||0),scrollLeft:Math.max(0,Number(saved.scrollLeft)||0),collapsed:saved.collapsed};const ids=new Set(rows().map(r=>r.id));saved.collapsed.filter(id=>ids.has(id)).forEach(id=>collapsed.add(id));}}catch{}
 }
 function restoreView(wrap){
  wrap.dataset.restoringView='true';const saved={...viewMemory};
  const restore=()=>{if(wrap.dataset.restoringView!=='true'||!wrap.clientHeight)return;wrap.scrollTop=saved.scrollTop;wrap.scrollLeft=saved.scrollLeft;delete wrap.dataset.restoringView;};
  const observer=new ResizeObserver(restore);observer.observe(wrap);resizeObservers.push(observer);restore();requestAnimationFrame(restore);
  wrap.addEventListener('scroll',()=>{clearTimeout(viewTimer);viewTimer=setTimeout(rememberView,80);},{passive:true});
 }
 if(matches){window.addEventListener('pagehide',rememberView);document.addEventListener('visibilitychange',()=>{if(document.hidden)rememberView();});}
 // SPEC-SUIYIN-ADMIN-060. Targets are previews; the model changes only on drop.
 let moving=null,undoMove=null,committing=false;
 const rows=()=>A.getTable().rows;
 const nameOf=id=>rows().find(r=>r.id===id)?.cells[0]||'一级菜单';
 function structure(list=rows()){
  const parents=new Map(),positions=new Map(),groups=new Map(),stack=[];
  for(const row of list){while(stack.length&&rowDepth(stack.at(-1))>=rowDepth(row))stack.pop();const parentId=stack.at(-1)?.id||'';parents.set(row.id,parentId);if(!groups.has(parentId))groups.set(parentId,[]);groups.get(parentId).push(row);positions.set(row.id,groups.get(parentId).length);stack.push(row);}
  return {parents,positions,groups};
 }
 function branchOf(id,list=rows()){
  const start=list.findIndex(r=>r.id===id);if(start<0)return [];let end=start+1;while(end<list.length&&rowDepth(list[end])>rowDepth(list[start]))end++;return list.slice(start,end);
 }
 function moveDisabled(row){
  if(!platform&&conflictIds.has(row.id))return '菜单配置存在重复身份或路由，请先整理配置';
  if(A.model.readOnly||A.model.editable===false||row.readOnly||row.disabled||row.editable===false||!row.actions?.includes('编辑'))return '当前菜单不可编辑';
  const map=structure(),rootId=rowDepth(row)===0?row.id:map.parents.get(row.id);
  if(!platform&&branchOf(rootId).some(item=>conflictIds.has(item.id)))return '此分支存在菜单配置冲突，请先整理配置';
  if(rowDepth(row)>1||branchOf(rootId).some(r=>rowDepth(r)>1))return '此分支含三级菜单，请先通过编辑整理层级';
  return '';
 }
 function renumber(){
  const data=A.getTable(),map=structure(),orderIndex=data.headers.indexOf('排序');
  data.rows.forEach((row,i)=>{row.tree??={depth:0};row.tree.parentId=map.parents.get(row.id);if(!platform)row.tree.parentKey=data.rows.find(parent=>parent.id===row.tree.parentId)?.tree?.key||null;row.tree.hasChildren=!!data.rows[i+1]&&rowDepth(data.rows[i+1])>rowDepth(row);if(row.extra&&Object.hasOwn(row.extra,'parentId'))row.extra.parentId=row.tree.parentId;if(orderIndex>=0)row.cells[orderIndex]=String(map.positions.get(row.id));if(row.extra&&Object.hasOwn(row.extra,'排序'))row.extra['排序']=String(map.positions.get(row.id));});
 }
 function visibleRows(){
  const stack=[];document.querySelectorAll('.menu-tree-table tbody tr[data-row-id]').forEach(tr=>{const row=rows().find(r=>r.id===tr.dataset.rowId);if(!row)return;while(stack.length&&rowDepth(stack.at(-1))>=rowDepth(row))stack.pop();tr.hidden=stack.some(r=>collapsed.has(r.id));const toggle=tr.querySelector('.menu-tree-toggle');if(toggle){const open=!collapsed.has(row.id);toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',(open?'收起':'展开')+row.cells[0]);}stack.push(row);});
 }
 function rowElement(id){return [...document.querySelectorAll('.menu-tree-table tbody tr[data-row-id]')].find(tr=>tr.dataset.rowId===id);}
 function targetFor(parentId,beforeId=null){return {parentId,beforeId};}
 function allowedTarget(source,target){
  if(!target)return false;if(rowDepth(source)===0)return target.parentId==='';
  const p=rows().find(r=>r.id===target.parentId);return !!p&&rowDepth(p)===0&&!moveDisabled(p);
 }
 function targetText(source,target){
  if(!allowedTarget(source,target))return rowDepth(source)===0?'一级只能在一级之间排序':'二级请移入可编辑的一级菜单';
  const position=target.beforeId?'放在「'+nameOf(target.beforeId)+'」前':'放在末尾';return (rowDepth(source)===0?'一级菜单 · ':'移入「'+nameOf(target.parentId)+'」· ')+position;
 }
 function applyMove(id,target){
  const list=rows(),source=list.find(r=>r.id===id);if(!source||moveDisabled(source)||!allowedTarget(source,target))return false;
  const branch=branchOf(id),ids=new Set(branch.map(r=>r.id)),rest=list.filter(r=>!ids.has(r.id));let index;
  if(target.beforeId){index=rest.findIndex(r=>r.id===target.beforeId);if(index<0||structure(rest).parents.get(target.beforeId)!==target.parentId)return false;}
  else if(target.parentId){const parent=rest.find(r=>r.id===target.parentId);if(!parent)return false;index=rest.indexOf(parent)+branchOf(parent.id,rest).length;}
  else index=rest.length;
  const oldParent=structure().parents.get(id),next=[...rest.slice(0,index),...branch,...rest.slice(index)];
  if(oldParent===target.parentId&&next.every((row,i)=>row.id===list[i].id))return false;
  A.getTable().rows=next;source.tree.parentId=target.parentId;if(source.extra)source.extra.parentId=target.parentId;renumber();return true;
 }
 function rollbackModel(snapshot){const model=A.model;Object.keys(model).forEach(k=>delete model[k]);Object.assign(model,snapshot);}
 function savedMove(id,target){
  if(!platform&&refreshExternal())return false;
  const before=structuredClone(A.model),oldRows=structuredClone(rows()),oldMap=structure(),source=rows().find(r=>r.id===id);if(!source||!applyMove(id,target))return false;
  if(!platform)A.model.menuLayout=window.AdminTenantMenu.captureMove(oldRows,rows(),before.menuLayout,id);
  const map=structure(),oldParent=oldMap.parents.get(id),newParent=map.parents.get(id),label=p=>p?nameOf(p):'一级菜单';
  audit(source,'位置',label(oldParent)+' / 第'+oldMap.positions.get(id)+'项',label(newParent)+' / 第'+map.positions.get(id)+'项');
  committing=true;let success;try{success=A.persist('移动菜单',source.cells[0],{strict:true});}finally{committing=false;}
  if(!success){rollbackModel(before);reportMemory('保存失败，原设置已保留',true);A.toast('未能保存，菜单顺序已恢复，请重试');return false;}
  undoMove={rows:oldRows,layout:structuredClone(before.menuLayout),expected:moveSignature(),id};loadedStamp=stateStamp();if(newParent)collapsed.delete(newParent);reportMemory('已保存到本地 · '+linkedScope+'导航联动');notifyNav();A.toast(platform?'菜单顺序已保存到本地':'已保存，本租户导航已更新（本地原型）');return true;
 }
 function moveSignature(){return JSON.stringify(rows().map(row=>[row.id,rowDepth(row),row.cells]));}
 function undoLastMove(){
  if(!platform&&refreshExternal())return;if(!undoMove||moving)return;if(undoMove.expected!==moveSignature()){undoMove=null;render();return;}
  const before=structuredClone(A.model),entry=undoMove,source=rows().find(r=>r.id===entry.id),map=structure();A.getTable().rows=structuredClone(entry.rows);renumber();const restored=structure();
  if(!platform){if(entry.layout===undefined)delete A.model.menuLayout;else A.model.menuLayout=structuredClone(entry.layout);}
  audit(source,'位置',(map.parents.get(entry.id)?nameOf(map.parents.get(entry.id)):'一级菜单')+' / 第'+map.positions.get(entry.id)+'项',(restored.parents.get(entry.id)?nameOf(restored.parents.get(entry.id)):'一级菜单')+' / 第'+restored.positions.get(entry.id)+'项','UNDO');
  committing=true;let success;try{success=A.persist('撤销移动',source.cells[0],{strict:true});}finally{committing=false;}
  if(!success){rollbackModel(before);reportMemory('保存失败，原设置已保留',true);A.toast('未能保存，菜单顺序已恢复，请重试');return;}
  undoMove=null;loadedStamp=stateStamp();reportMemory('已保存到本地 · '+linkedScope+'导航联动');if(restored.parents.get(entry.id))collapsed.delete(restored.parents.get(entry.id));render();notifyNav();focusHandle(entry.id);A.toast('已撤销上次移动 · 已保存到本地');
 }
 function focusHandle(id){const handle=rowElement(id)?.querySelector('.menu-drag-handle');handle?.focus({preventScroll:true});handle?.scrollIntoView({block:'nearest',inline:'nearest'});}
 function announce(message){const live=document.getElementById('menu-move-status');if(live&&live.textContent!==message)live.textContent=message;}
 function repaintTarget(){
  const m=moving;if(!m?.active)return;document.querySelectorAll('.menu-drop-parent').forEach(tr=>tr.classList.remove('menu-drop-parent'));m.line.hidden=true;
  const text=targetText(m.source,m.target);m.hint.textContent=text;announce(m.source.cells[0]+'，'+text);m.ghost.classList.toggle('invalid',!allowedTarget(m.source,m.target));
  if(!allowedTarget(m.source,m.target))return;
  let anchor=m.target.beforeId?rowElement(m.target.beforeId):null,after=false;
  if(m.target.parentId)rowElement(m.target.parentId)?.classList.add('menu-drop-parent');
  if(!anchor){const group=m.target.parentId?branchOf(m.target.parentId):rows();anchor=[...group].reverse().map(r=>rowElement(r.id)).find(tr=>tr&&!tr.hidden);after=true;}
  if(!anchor||anchor.hidden)return;const r=anchor.getBoundingClientRect(),w=m.wrap.getBoundingClientRect(),header=m.wrap.querySelector('thead').getBoundingClientRect(),y=after?r.bottom:r.top;
  if(y<header.bottom||y>w.bottom)return;m.line.hidden=false;m.line.style.cssText=`left:${w.left+(rowDepth(m.source)?32:0)}px;top:${y-1}px;width:${Math.max(0,w.width-(rowDepth(m.source)?32:0)-4)}px`;
 }
 function setPointerTarget(){
  const m=moving;if(!m?.active||m.keyboard)return;const w=m.wrap.getBoundingClientRect(),header=m.wrap.querySelector('thead').getBoundingClientRect();let target=null,hover='';
  if(m.x>=w.left&&m.x<=w.right&&m.y>=header.bottom&&m.y<w.bottom){
   const tr=[...m.wrap.querySelectorAll('tbody tr[data-row-id]')].find(tr=>{if(tr.hidden)return false;const r=tr.getBoundingClientRect();return m.y>=r.top&&m.y<r.bottom;});
   if(tr){const hit=rows().find(r=>r.id===tr.dataset.rowId),map=structure(),r=tr.getBoundingClientRect();
    if(!m.ids.has(hit.id)){
     if(rowDepth(m.source)===0){const root=rowDepth(hit)===0?hit:rows().find(row=>row.id===map.parents.get(hit.id));if(root&&rowDepth(root)===0){const roots=map.groups.get('')||[],next=roots[roots.indexOf(root)+1];target=targetFor('',rowDepth(hit)===0&&m.y<r.top+r.height/2?root.id:next?.id||null);if(target.beforeId&&m.ids.has(target.beforeId)){const following=roots[roots.indexOf(m.source)+1];target.beforeId=following?.id||null;}}}
     else if(rowDepth(hit)===0){target=targetFor(hit.id);hover=hit.id;}
     else if(rowDepth(hit)===1){const siblings=(map.groups.get(map.parents.get(hit.id))||[]).filter(row=>row.id!==m.source.id),next=siblings[siblings.indexOf(hit)+1];target=targetFor(map.parents.get(hit.id),m.y<r.top+r.height/2?hit.id:next?.id||null);}
    }else target=m.origin;
   }else if(m.y>([...m.wrap.querySelectorAll('tbody tr')].filter(tr=>!tr.hidden).at(-1)?.getBoundingClientRect().bottom||Infinity))target=rowDepth(m.source)===0?targetFor(''):null;
  }
  m.target=target;
  if(hover!==m.hover){clearTimeout(m.hoverTimer);m.hover=hover;if(hover&&collapsed.has(hover)&&allowedTarget(m.source,target))m.hoverTimer=setTimeout(()=>{if(moving!==m)return;collapsed.delete(hover);visibleRows();repaintTarget();},600);}
  repaintTarget();
 }
 function dragFrame(time){
  const m=moving;if(!m?.active||m.keyboard)return;const w=m.wrap.getBoundingClientRect(),top=m.wrap.querySelector('thead').getBoundingClientRect().bottom,dt=Math.min(32,time-(m.lastTime||time));m.lastTime=time;
  if(m.x>=w.left&&m.x<=w.right&&m.y>=top&&m.y<=w.bottom){const speed=m.y<top+40?-Math.min(1,(top+40-m.y)/40):m.y>w.bottom-40?Math.min(1,(m.y-w.bottom+40)/40):0;if(speed){m.wrap.scrollTop+=speed*dt*.55;setPointerTarget();}}
  m.ghost.style.left=Math.max(8,Math.min(innerWidth-310,m.x+16))+'px';m.ghost.style.top=Math.max(8,Math.min(innerHeight-85,m.y+18))+'px';m.raf=requestAnimationFrame(dragFrame);
 }
 function activateMove(){
  const m=moving;if(!m||m.active)return;m.active=true;m.target=m.origin;document.body.classList.add('menu-is-moving');
  m.ghost=node('div','menu-drag-ghost');const title=node('strong','',m.source.cells[0]);m.ghost.append(title,node('span','menu-drag-count',rowDepth(m.source)===0?'一级菜单 · 携带 '+(m.ids.size-1)+' 个二级菜单':'二级菜单'));
  m.hint=node('span','menu-drag-destination');m.ghost.append(m.hint);m.line=node('div','menu-drop-line');m.line.hidden=true;document.body.append(m.ghost,m.line);m.handle.setAttribute('aria-pressed','true');
  for(const id of m.ids)rowElement(id)?.classList.add('menu-drag-source');
  if(!m.keyboard)m.raf=requestAnimationFrame(dragFrame);else{m.ghost.classList.add('keyboard');m.ghost.style.cssText='right:18px;top:8px';}repaintTarget();
 }
 function beginMove(row,handle,event,keyboard=false){
  if(!platform&&refreshExternal())return;
  if(moving||moveDisabled(row)||A.$('dialog').open)return;const map=structure(),siblings=map.groups.get(map.parents.get(row.id))||[],next=siblings[siblings.indexOf(row)+1];
  const wrap=document.querySelector('.menu-table-wrap');moving={source:row,handle,wrap,keyboard,active:false,x:event?.clientX||0,y:event?.clientY||0,startX:event?.clientX||0,startY:event?.clientY||0,pointerId:event?.pointerId,collapsed:new Set(collapsed),ids:new Set(branchOf(row.id).map(r=>r.id)),origin:targetFor(map.parents.get(row.id),next?.id||null),target:null};
  if(keyboard)activateMove();else{event.preventDefault();handle.focus({preventScroll:true});handle.setPointerCapture(event.pointerId);}
 }
 function finishMove(cancel=false){
  const m=moving;if(!m)return;moving=null;clearTimeout(m.hoverTimer);cancelAnimationFrame(m.raf);if(m.handle.hasPointerCapture?.(m.pointerId))m.handle.releasePointerCapture(m.pointerId);
  m.ghost?.remove();m.line?.remove();document.body.classList.remove('menu-is-moving');document.querySelectorAll('.menu-drag-source,.menu-drop-parent').forEach(tr=>tr.classList.remove('menu-drag-source','menu-drop-parent'));m.handle.setAttribute('aria-pressed','false');
  let success=false;if(m.active&&!cancel&&allowedTarget(m.source,m.target))success=savedMove(m.source.id,m.target);
  if(!success){collapsed.clear();m.collapsed.forEach(id=>collapsed.add(id));visibleRows();}
  if(m.active){const scroll=m.wrap.scrollTop,left=m.wrap.scrollLeft;render();const wrap=document.querySelector('.menu-table-wrap');wrap.scrollTop=scroll;wrap.scrollLeft=left;focusHandle(m.source.id);announce(success?'移动完成，'+targetText(m.source,m.target):'移动已取消，顺序保持不变');}
 }
 function keyboardMove(event,row,handle){
  if(!moving){if(event.key===' '||event.key==='Enter'){event.preventDefault();beginMove(row,handle,null,true);}return;}
  const m=moving;if(!m.keyboard)return;if(['Escape','Enter',' ','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Tab'].includes(event.key))event.preventDefault();
  if(event.key==='Escape'||event.key==='Tab'){finishMove(true);return;}if(event.key==='Enter'||event.key===' '){finishMove();return;}
  const map=structure();let parentId=m.target.parentId,siblings=(map.groups.get(parentId)||[]).filter(r=>!m.ids.has(r.id)),index=m.target.beforeId?siblings.findIndex(r=>r.id===m.target.beforeId):siblings.length;
  if(event.key==='ArrowUp')index=Math.max(0,index-1);else if(event.key==='ArrowDown')index=Math.min(siblings.length,index+1);
  else if(rowDepth(m.source)===1&&(event.key==='ArrowLeft'||event.key==='ArrowRight')){const roots=(map.groups.get('')||[]).filter(r=>!moveDisabled(r)),current=roots.findIndex(r=>r.id===parentId),next=roots[Math.max(0,Math.min(roots.length-1,current+(event.key==='ArrowLeft'?-1:1)))];if(next){parentId=next.id;siblings=(map.groups.get(parentId)||[]).filter(r=>!m.ids.has(r.id));index=Math.min(index,siblings.length);}}
  else return;
  m.target=targetFor(parentId,siblings[index]?.id||null);if(parentId)collapsed.delete(parentId);visibleRows();(rowElement(m.target.beforeId||parentId)||rowElement((map.groups.get('')||[]).at(-1)?.id))?.scrollIntoView({block:'nearest',inline:'nearest'});repaintTarget();
 }
 function dragHandle(row){
  const reason=moveDisabled(row),b=button('',()=>{},'menu-drag-handle');b.innerHTML='<svg viewBox="0 0 16 20" aria-hidden="true"><g fill="currentColor"><circle cx="5" cy="4" r="1.5"/><circle cx="11" cy="4" r="1.5"/><circle cx="5" cy="10" r="1.5"/><circle cx="11" cy="10" r="1.5"/><circle cx="5" cy="16" r="1.5"/><circle cx="11" cy="16" r="1.5"/></g></svg>';
  b.disabled=!!reason;b.title=reason||'拖动调整顺序；也可按空格开始，方向键移动，回车确认';b.setAttribute('aria-label','移动'+row.cells[0]);b.setAttribute('aria-describedby','menu-drag-help');b.setAttribute('aria-pressed','false');b.onpointerdown=e=>{if(e.button===0&&e.isPrimary)beginMove(row,b,e);};b.onkeydown=e=>keyboardMove(e,row,b);b.ondragstart=e=>e.preventDefault();return b;
 }
 if(sortable){
  document.addEventListener('pointermove',e=>{const m=moving;if(!m||m.keyboard||e.pointerId!==m.pointerId)return;m.x=e.clientX;m.y=e.clientY;if(!m.active&&Math.hypot(m.x-m.startX,m.y-m.startY)>=6)activateMove();if(m.active){e.preventDefault();setPointerTarget();}},{passive:false});
  document.addEventListener('pointerup',e=>{if(moving&&!moving.keyboard&&e.pointerId===moving.pointerId){if(moving.active)setPointerTarget();finishMove();}});
  document.addEventListener('pointercancel',()=>finishMove(true));document.addEventListener('keydown',e=>{if(moving&&e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();finishMove(true);}else if(moving?.keyboard&&e.target!==moving.handle)keyboardMove(e,moving.source,moving.handle);},true);
  document.addEventListener('click',e=>{if(moving?.active){e.preventDefault();e.stopImmediatePropagation();}},true);
  document.addEventListener('admin-model-changed',()=>{if(!platform)loadedStamp=stateStamp();if(!committing){undoMove=null;document.querySelector('.menu-undo-move')?.remove();}});
  window.addEventListener('blur',()=>finishMove(true));window.addEventListener('pagehide',()=>finishMove(true));window.addEventListener('resize',()=>finishMove(true));document.addEventListener('visibilitychange',()=>{if(document.hidden)finishMove(true);});
  if(window.frameElement?.parentElement)new MutationObserver(()=>{if(window.frameElement.parentElement.hidden)finishMove(true);}).observe(window.frameElement.parentElement,{attributes:true,attributeFilter:['hidden']});
 }
 function present(title,body,buttons,kind='edit'){
  const frame=window.frameElement,dialog=A.$('dialog');
  if(frame){const r=frame.getBoundingClientRect(),app=A.$('app');app.style.cssText=`position:fixed;left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px`;document.body.classList.add('menu-modal-open');frame.classList.add('menu-dialog-layer');}
  A.showDialog(title,body,buttons);dialog.classList.remove('menu-delete-dialog','menu-audit-dialog');
  const size=window.frameElement?parent:window;
  if(kind==='delete'){dialog.classList.add('menu-delete-dialog');dialog.style.setProperty('--dialog-width','420px');dialog.style.setProperty('--dialog-left',Math.max(16,(size.innerWidth-420)/2)+'px');dialog.style.setProperty('--dialog-top',Math.max(16,(size.innerHeight-128)/2-20)+'px');}
  if(kind==='audit'){dialog.classList.add('menu-audit-dialog');dialog.style.setProperty('--dialog-width',size.innerWidth*.8+'px');dialog.style.setProperty('--dialog-left',size.innerWidth*.1+'px');dialog.style.setProperty('--dialog-top','105.7px');dialog.style.height=Math.max(280,size.innerHeight-211.4)+'px';}
  dialog.addEventListener('close',()=>{dialog.style.height='';dialog.classList.remove('menu-delete-dialog','menu-audit-dialog');if(frame){A.$('app').style.cssText='';document.body.classList.remove('menu-modal-open');frame.classList.remove('menu-dialog-layer');}},{once:true});
 }
 function override(){return window.AdminMenuState.read(A.tenantInfo,A.navStorageKey(A.tenant));}
 function audit(row,field,before,after,type='UPDATE'){
  if(String(before)===String(after))return;
  (A.model.auditRecords??=[]).unshift({rowId:row.id,object:get(row,'菜单名称'),time:new Date().toLocaleString('sv-SE'),actor:'房昕',type,field,before:String(before),after:String(after),source:'local'});
 }
 function setValue(row,field,value){const i=A.getTable().headers.indexOf(field);const old=i>=0?row.cells[i]:row.extra?.[field]||'';audit(row,field,old,value);if(i>=0)row.cells[i]=value;(row.extra??={})[field]=value;}
 function notifyNav(){if(!platform)parent.postMessage({type:'admin-navigation-updated',tenant:A.tenant},location.origin);}
 function refreshExternal(){
  if(platform||!A.model||!loadedStamp||loadedStamp===stateStamp())return false;
  loadedStamp=stateStamp();finishMove(true);undoMove=null;
  if(A.$('dialog').open)A.closeDialog();
  const latest=window.AdminTenantMenu.read(A.tenant);if(latest)rollbackModel(latest);
  memoryMessage='菜单设置已更新，请按最新列表重新调整';render();A.toast(memoryMessage);return true;
 }
 if(matches&&!platform)window.addEventListener('storage',event=>{if(event.key===null||[contentKey,window.AdminPlatformMenu.key,A.navStorageKey(A.tenant)].includes(event.key))queueMicrotask(refreshExternal);});
 function updateNavigation(row,values){
  if(platform)return;
  const t=A.tenantInfo,all=t.menu.flatMap(g=>[g,...(g.children||[])]),key=row.tree?.key;
  if(!key)return;
  const saved=override()||{};saved.enabled??=window.AdminMenuState.defaultEnabled(t);saved.display??={};saved.order??={};saved.superPermission??={};
  if(values['菜单状态']!==undefined){saved.display[key]=values['菜单状态'];const keys=new Set(branchOf(row.id).map(r=>r.tree?.key));keys.add(key);const routes=all.filter(item=>item.route&&keys.has(item.route)).map(item=>item.route);saved.enabled=values['菜单状态']==='隐藏'?saved.enabled.filter(r=>!routes.includes(r)):[...new Set([...saved.enabled,...routes.filter(r=>{const child=all.find(c=>c.route===r);return saved.display[r]!=='隐藏'&&(saved.display[r]!==undefined||child?.display!=='隐藏');})])];}
  if(values['排序']!==undefined)saved.order[key]=Number(values['排序']);
  if(values['超级权限']!==undefined)saved.superPermission[key]=values['超级权限']==='是';
  localStorage.setItem(A.navStorageKey(A.tenant),JSON.stringify(saved));
 }
 function switchControl(row){
  const b=button('',()=>{const value=get(row,'超级权限')==='是'?'否':'是';setValue(row,'超级权限',value);updateNavigation(row,{'超级权限':value});A.persist('修改超级权限',get(row,'菜单名称'));b.setAttribute('aria-checked',String(value==='是'));A.toast('修改成功 · 已保存到本地');},'menu-permission-switch');
  b.setAttribute('role','switch');b.setAttribute('aria-label',get(row,'菜单名称')+'超级权限');b.setAttribute('aria-checked',String(get(row,'超级权限')==='是'));b.title='超级权限';b.append(node('span'));return b;
 }
 function syncOverride(){
  if(platform)return;const saved=override();if(!saved)return;
  for(const row of A.getTable().rows){const key=row.tree?.key;if(!key)continue;
   for(const [label,map]of [['菜单状态',saved.display],['超级权限',saved.superPermission]])if(map?.[key]!==undefined){const i=A.getTable().headers.indexOf(label);row.cells[i]=label==='超级权限'?(map[key]?'是':'否'):String(map[key]);}
  }
 }
 function render(){
  if(!platform&&matches&&refreshExternal())return true;
  if(!matches)return false;loadView();resizeObservers.forEach(o=>o.disconnect());resizeObservers=[];syncOverride();
  if(!platform){const resolved=window.AdminTenantMenu.resolve(A.tenantInfo,A.model,override());A.getTable().rows=resolved.rows;tenantWarnings=resolved.warnings;conflictIds=new Set(resolved.conflictIds);loadedStamp=stateStamp();}
  document.body.classList.add('menu-content');if(sortable)document.body.classList.add('menu-sortable');
  const root=node('section','menu-page'+(platform?' platform-menu-page':'')),head=node('header','menu-page-header'),title=node('h1','',platform?'平台菜单管理':'菜单管理'),actions=node('div','menu-header-actions');head.append(title,actions);
  (platform?['新增','同步菜单','复制菜单','增量更新菜单','批量删减菜单','全部记录']:['全部记录']).forEach(label=>actions.append(button(label,()=>label==='全部记录'?logs():label==='新增'?edit():A.action(label),label==='新增'?'primary':'')));
  const wrap=node('div','menu-table-wrap'),table=node('table','menu-tree-table'),colgroup=node('colgroup'),thead=node('thead'),headrow=node('tr'),tbody=node('tbody'),data=A.getTable();table.setAttribute('aria-label',platform?'平台菜单树':'租户菜单树');
  const widths=platform?[200,200,150,240,100,100,100,80,150]:[200,150,150,150,0,150];
  data.headers.forEach((h,i)=>{const col=node('col');if(widths[i])col.style.width=widths[i]+'px';colgroup.append(col);const th=node('th','',sortable&&h==='排序'?'顺序':h);if(h==='操作')th.className='menu-actions-head';if(!h)th.className='menu-flex-space';headrow.append(th);});thead.append(headrow);table.append(colgroup,thead,tbody);if(platform)table.style.minWidth=widths.reduce((a,b)=>a+b,0)+'px';
  const stack=[],sequence=sortable?structure().positions:null;
  data.rows.forEach((row,index)=>{
   const depth=rowDepth(row);while(stack.length&&stack.at(-1).depth>=depth)stack.pop();const isHidden=stack.some(s=>collapsed.has(s.id));const children=row.tree?.hasChildren??(data.rows[index+1]&&rowDepth(data.rows[index+1])>depth);if(children)stack.push({id:row.id,depth});
   const tr=node('tr');tr.dataset.rowId=row.id;tr.dataset.depth=String(depth);tr.hidden=isHidden;
   data.headers.forEach((header,i)=>{
    const td=node('td'),cell=node('div','menu-cell');if(i===0){cell.classList.add('menu-name-cell');cell.style.paddingLeft=12+16*depth+'px';if(sortable)cell.append(dragHandle(row));if(children){const toggle=button('',()=>{collapsed.has(row.id)?collapsed.delete(row.id):collapsed.add(row.id);const scroll=wrap.scrollTop,left=wrap.scrollLeft;render();const nextWrap=document.querySelector('.menu-table-wrap');nextWrap.scrollTop=scroll;nextWrap.scrollLeft=left;document.querySelector('[data-row-id="'+row.id+'"] .menu-tree-toggle')?.focus({preventScroll:true});},'menu-tree-toggle');toggle.innerHTML=arrow;toggle.setAttribute('aria-label',(collapsed.has(row.id)?'展开':'收起')+row.cells[0]);toggle.setAttribute('aria-expanded',String(!collapsed.has(row.id)));cell.append(toggle);}else cell.append(node('span','menu-tree-placeholder'));const text=node('span','menu-name-text',row.cells[i]||'');text.title=row.cells[i]||'';cell.append(text);}
    else if(header==='超级权限')cell.append(switchControl(row));
    else if(header==='操作'){td.className='menu-actions-cell';const group=node('div','menu-row-actions');['编辑','删除','记录'].forEach(label=>group.append(button(label,()=>label==='编辑'?edit(row):label==='记录'?logs(row):remove(row),'link '+(label==='删除'?'danger':label==='记录'?'menu-record':''))));cell.append(group);}
    else if(!header){td.className='menu-flex-space';}
    else cell.textContent=sortable&&header==='排序'?String(sequence.get(row.id)):row.cells[i]||'';
    td.append(cell);tr.append(td);
   });tbody.append(tr);
  });wrap.append(table);const viewport=node('div','menu-table-viewport');viewport.append(wrap);root.append(head);if(sortable){const tools=node('div','menu-sort-tools'),help=node('span','','拖动调整顺序，二级菜单可移入其他一级');help.id='menu-drag-help';tools.append(help);if(undoMove)tools.append(button('撤销上次移动',undoLastMove,'link menu-undo-move'));tools.append(memoryHint());root.append(tools);const status=node('span','menu-move-status');status.id='menu-move-status';status.setAttribute('role','status');status.setAttribute('aria-live','polite');root.append(status);}root.append(viewport);A.$('app').replaceChildren(root);scrollbars(viewport,wrap);restoreView(wrap);return true;
 }
 function scrollbars(viewport,wrap){
  for(const horizontal of [false,true]){const rail=node('div','menu-scroll-rail '+(horizontal?'horizontal':'vertical')),thumb=node('div','menu-scroll-thumb');rail.append(thumb);viewport.append(rail);const update=()=>{const view=horizontal?wrap.clientWidth:wrap.clientHeight,full=horizontal?wrap.scrollWidth:wrap.scrollHeight,length=horizontal?rail.clientWidth:rail.clientHeight;rail.hidden=full<=view+1;const size=Math.max(24,length*view/full),pos=(horizontal?wrap.scrollLeft:wrap.scrollTop)/(full-view)*(length-size);thumb.style[horizontal?'width':'height']=size+'px';thumb.style.transform=horizontal?'translateX('+pos+'px)':'translateY('+pos+'px)';};wrap.addEventListener('scroll',update,{passive:true});const observer=new ResizeObserver(update);observer.observe(wrap);resizeObservers.push(observer);thumb.onpointerdown=e=>{e.preventDefault();thumb.setPointerCapture(e.pointerId);const start=horizontal?e.clientX:e.clientY,scroll=horizontal?wrap.scrollLeft:wrap.scrollTop;thumb.onpointermove=ev=>{const delta=(horizontal?ev.clientX:ev.clientY)-start,full=horizontal?wrap.scrollWidth:wrap.scrollHeight,view=horizontal?wrap.clientWidth:wrap.clientHeight,length=horizontal?rail.clientWidth:rail.clientHeight,size=horizontal?thumb.offsetWidth:thumb.offsetHeight;wrap[horizontal?'scrollLeft':'scrollTop']=scroll+delta*(full-view)/(length-size);};thumb.onpointerup=()=>thumb.onpointermove=null;};requestAnimationFrame(update);}
 }
 function field(form,label,value,options={}){
  const f=A.fieldControl({label,required:options.required,stepper:label==='排序',options:options.radio,controls:[{type:options.radio?'radio':label==='超级权限'?'checkbox':label==='排序'?'number':'text'}]},value,form);
  const input=f.querySelector('[data-field]');input?.setAttribute('aria-label',label);
  if(options.disabled)input.disabled=true;
  if(input?.type==='number'){input.min='';input.style.textAlign='center';}
  if(input?.type==='checkbox')input.checked=value==='是';
  form.append(f);return input;
 }
 function parentPicker(row,form){
  const holder=node('label','field');holder.append(node('span','','父级菜单'));const wrap=node('div','menu-parent-picker'),trigger=button('',()=>{if(pop.matches(':popover-open'))pop.hidePopover();else{pop.showPopover();const r=trigger.getBoundingClientRect();pop.style.left=r.left+'px';pop.style.top=Math.min(r.bottom+6,innerHeight-pop.offsetHeight-10)+'px';}},'menu-parent-trigger'),pop=node('div','menu-parent-options');pop.popover='auto';pop.setAttribute('role','menu');trigger.setAttribute('aria-label','父级菜单');trigger.setAttribute('aria-haspopup','menu');
  let value=row?.extra?.parentId??row?.tree?.parentId??'';const rows=A.getTable().rows,selected=rows.find(r=>r.id===value);trigger.textContent=selected?.cells[0]||'请选择';
  const choose=(r)=>{value=r?.id||'';trigger.textContent=r?.cells[0]||'请选择';pop.hidePopover();};
  const unavailable=new Set();if(row){const start=rows.indexOf(row);unavailable.add(row.id);for(let i=start+1;i<rows.length&&rowDepth(rows[i])>rowDepth(row);i++)unavailable.add(rows[i].id);}
  const candidates=rows.filter(r=>rowDepth(r)===0);
  candidates.forEach(r=>{const line=node('div','menu-parent-row'),pick=button(r.cells[0],()=>choose(r));pick.setAttribute('role','menuitemradio');pick.setAttribute('aria-checked',String(r.id===value));pick.disabled=unavailable.has(r.id);const radio=node('span','menu-parent-radio');pick.prepend(radio);line.append(pick);if(r.tree?.hasChildren){const exp=button('›',()=>{children.hidden=!children.hidden;exp.setAttribute('aria-expanded',String(!children.hidden));},'menu-parent-expand');exp.setAttribute('aria-label','展开'+r.cells[0]);exp.setAttribute('aria-expanded','false');line.append(exp);const children=node('div','menu-parent-children');children.hidden=true;let next=rows.indexOf(r)+1;while(next<rows.length&&rowDepth(rows[next])>rowDepth(r)){const child=rows[next++],b=button(child.cells[0],()=>choose(child));b.disabled=unavailable.has(child.id);b.setAttribute('role','menuitemradio');b.setAttribute('aria-checked',String(child.id===value));children.append(b);}pop.append(line,children);}else pop.append(line);});
  pop.append(button('清空',()=>choose(null),'link'));wrap.append(trigger,pop);holder.append(wrap);form.append(holder);return()=>value;
 }
 function edit(row){
  if(row)row=rows().find(item=>item.id===row.id); // A failed transaction may have replaced the model's row objects.
  rememberView();
  const form=node('form','form-grid menu-edit-form'),inputs={};let parentValue;
  if(!platform){['菜单名称','菜单状态','超级权限'].forEach(label=>inputs[label]=field(form,label,get(row,label),{required:label==='菜单名称',disabled:label==='菜单名称',radio:label==='菜单状态'?['显示','隐藏']:null}));const holder=node('label','field');holder.append(node('span','','顺序'),node('span','menu-order-note','由列表拖动调整'));form.append(holder);}
  else{
   ['菜单名称','平台菜单名称','唯一标识','菜单状态','菜单路由','菜单图标','父级菜单','排序','备注信息','菜单类型'].forEach(label=>{
    if(sortable&&label==='排序'){const holder=node('label','field');holder.append(node('span','','顺序'),node('span','menu-order-note',row?'由列表拖动调整':'自动追加到所属菜单末尾'));form.append(holder);return;}
    if(label==='父级菜单'){parentValue=parentPicker(row,form);return;}
    const value=row?(label==='唯一标识'?(row.extra?.唯一标识||get(row,'菜单路由').replace(/[A-Z]/g,m=>'_'+m.toLowerCase())||'menu_'+row.id.replaceAll('-','_')):get(row,label)):label==='菜单状态'?'显示':label==='菜单类型'?'菜单':label==='排序'?'0':'';
    inputs[label]=field(form,label,label==='菜单类型'?'菜单':value,{required:['菜单名称','唯一标识'].includes(label),radio:label==='菜单状态'?['显示','隐藏']:label==='菜单类型'?['菜单']:null});
   });
  }
  const save=()=>{
   if(!form.reportValidity())return;
   if(row)row=rows().find(item=>item.id===row.id);
   const before=platform?structuredClone(A.model):null;
   const target=row||{id:'local-'+crypto.randomUUID(),cells:A.getTable().headers.map(()=>''),actions:['编辑','删除','记录'],extra:{},tree:{depth:0,hasChildren:false}};
   const values={};Object.entries(inputs).forEach(([label,input])=>values[label]=input.dataset.single?input.querySelector('input:checked')?.value||'':input.type==='checkbox'?(input.checked?'是':'否'):input.value);
   if(values['菜单类型'])values['菜单类型']='menu';
   Object.entries(values).forEach(([k,v])=>setValue(target,k,v));
   if(platform){const rows=A.getTable().rows,parentId=parentValue(),p=rows.find(r=>r.id===parentId),oldDepth=rowDepth(target),depth=p?rowDepth(p)+1:0,changedParent=!row||(target.extra.parentId??target.tree.parentId??'')!==parentId;target.extra.parentId=parentId;target.tree.parentId=parentId;if(changedParent){let branch=[target];if(row){const start=rows.indexOf(row);let end=start+1;while(end<rows.length&&rowDepth(rows[end])>oldDepth)end++;branch=rows.splice(start,end-start);}for(const item of branch)item.tree.depth+=depth-oldDepth;let index=p?rows.indexOf(p)+1:rows.length;if(p)while(index<rows.length&&rowDepth(rows[index])>rowDepth(p))index++;rows.splice(index,0,...branch);rows.forEach((item,i)=>item.tree.hasChildren=!!rows[i+1]&&rowDepth(rows[i+1])>rowDepth(item));}}
   updateNavigation(target,values);if(!row&&!platform)A.getTable().rows.push(target);if(sortable)renumber();
   const saved=A.persist('编辑菜单',values['菜单名称'],{strict:platform});
   if(platform&&!saved){rollbackModel(before);reportMemory('保存失败，原设置已保留',true);A.toast('未能保存，原设置已保留，请重试');return;}
   reportMemory('已保存到本地 · '+linkedScope+'导航联动');A.closeDialog();render();notifyNav();A.toast('修改成功 · 已保存到本地');
  };
  const profile=window.AdminLiveUI.profiles[A.route];profile.edit={...profile.edit,title:row?'修改菜单':'新增菜单',width:platform?800:Math.max(500,(window.frameElement?parent.innerWidth:innerWidth)*.5),columns:platform?2:3,labelWidth:140};
  present(row?'修改菜单':'新增菜单',form,[{label:'确 定',cls:'primary',run:save},{label:'取 消',run:A.closeDialog}]);form.onsubmit=e=>{e.preventDefault();save();};
 }
 function remove(row){
  const body=node('div','menu-delete-message');body.innerHTML='<svg viewBox="0 0 1024 1024" aria-hidden="true"><path fill="currentColor" d="M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896m0 192a58.43 58.43 0 0 0-58.24 63.744l23.36 256.384a35.072 35.072 0 0 0 69.76 0l23.296-256.384A58.43 58.43 0 0 0 512 256m0 512a51.2 51.2 0 1 0 0-102.4 51.2 51.2 0 0 0 0 102.4"/></svg><p>确认删除菜单?</p>';
  present('警告',body,[{label:'取消',run:A.closeDialog},{label:'确定',cls:'primary',run:()=>{
   row=rows().find(item=>item.id===row.id);if(!row)return;
   const rows=A.getTable().rows,index=rows.indexOf(row);let end=index+1;while(end<rows.length&&rowDepth(rows[end])>rowDepth(row))end++;
   const before=structuredClone(A.model);A.snapshot();const removed=rows.splice(index,end-index);updateNavigation(row,{'菜单状态':'隐藏'});audit(row,'菜单',get(row,'菜单名称'),'已删除','DELETE');if(sortable)renumber();
   if(!A.persist('删除菜单',get(row,'菜单名称'),{strict:platform})&&platform){rollbackModel(before);reportMemory('保存失败，原设置已保留',true);A.toast('未能保存，原设置已保留，请重试');return;}
   A.closeDialog();render();notifyNav();A.toast('已删除 '+removed.length+' 个本地菜单');
  }}],'delete');
 }
 function logs(row){
  const title=row?get(row,'菜单名称')+' - 编辑记录':'全部编辑记录',records=(A.model.auditRecords||[]).filter(r=>!row||r.rowId===row.id),body=node('div','menu-audit');
  if(row&&!records.length)body.append(node('p','menu-audit-empty','暂无编辑记录'));
  else{
   const table=node('table','menu-audit-table'),thead=node('thead'),tr=node('tr'),tbody=node('tbody'),colgroup=node('colgroup');[170,120,100,150,0,0].forEach(w=>{const col=node('col');if(w)col.style.width=w+'px';colgroup.append(col);});['编辑时间','编辑人','编辑类型','编辑字段','旧值','新值'].forEach(h=>tr.append(node('th','',h)));thead.append(tr);table.append(colgroup,thead,tbody);
   const draw=(page=1,size=10)=>{tbody.replaceChildren();records.slice((page-1)*size,page*size).forEach(r=>{const tr=node('tr');['time','actor','type','field','before','after'].forEach(k=>tr.append(node('td','',r[k]||'')));tbody.append(tr);});};draw();body.append(table);if(!records.length)body.append(node('p','menu-audit-empty','暂无数据'));
   const pagination=node('div','menu-audit-pagination'),size=node('select');size.setAttribute('aria-label','编辑记录每页条数');[10,20,50,100].forEach(n=>size.append(new Option(n+'条/页',n)));let page=1;const prev=button('‹',()=>{page--;draw(page,Number(size.value));update();}),current=button('1',()=>{}),next=button('›',()=>{page++;draw(page,Number(size.value));update();});const update=()=>{prev.disabled=page===1;next.disabled=page*Number(size.value)>=records.length;current.textContent=page;};size.onchange=()=>{page=1;draw(page,Number(size.value));update();};update();pagination.append(size,prev,current,next,node('span','','共 '+records.length+' 条'));body.append(pagination);
  }
  present(title,body,[],row?'edit':'audit');if(row){const width=800;A.$('dialog').style.setProperty('--dialog-width',width+'px');A.$('dialog').style.setProperty('--dialog-left',Math.max(16,(innerWidth-width)/2)+'px');}
 }
 return {matches,render,edit,logs};
})();
