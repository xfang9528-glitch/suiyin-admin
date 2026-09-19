/* Menus are hierarchical configuration pages, not paginated search tables.
 * Source: full-content/menu-parity/source-*.json. Writes are browser-local only. */
'use strict';
window.AdminMenu=(()=>{
 const A=window.Admin,{node,button}=A,platform=A.route==='allMenu',matches=['menu','allMenu'].includes(A.route),collapsed=new Set();
 const arrow='<svg viewBox="0 0 1024 1024" aria-hidden="true"><path fill="currentColor" d="M340.864 149.312a30.59 30.59 0 0 0 0 42.752L652.736 512 340.864 831.872a30.59 30.59 0 0 0 0 42.752 29.12 29.12 0 0 0 41.728 0L714.24 534.336a32 32 0 0 0 0-44.672L382.592 149.376a29.12 29.12 0 0 0-41.728 0z"/></svg>';
 const get=(r,label)=>r.cells[A.getTable().headers.indexOf(label)]??r.extra?.[label]??'';
 const rowDepth=r=>r.tree?.depth??0;
 let resizeObservers=[];
 function present(title,body,buttons,kind='edit'){
  const frame=window.frameElement,dialog=A.$('dialog');
  if(frame){const r=frame.getBoundingClientRect(),app=A.$('app');app.style.cssText=`position:fixed;left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px`;document.body.classList.add('menu-modal-open');frame.classList.add('menu-dialog-layer');}
  A.showDialog(title,body,buttons);dialog.classList.remove('menu-delete-dialog','menu-audit-dialog');
  const size=window.frameElement?parent:window;
  if(kind==='delete'){dialog.classList.add('menu-delete-dialog');dialog.style.setProperty('--dialog-width','420px');dialog.style.setProperty('--dialog-left',Math.max(16,(size.innerWidth-420)/2)+'px');dialog.style.setProperty('--dialog-top',Math.max(16,(size.innerHeight-128)/2-20)+'px');}
  if(kind==='audit'){dialog.classList.add('menu-audit-dialog');dialog.style.setProperty('--dialog-width',size.innerWidth*.8+'px');dialog.style.setProperty('--dialog-left',size.innerWidth*.1+'px');dialog.style.setProperty('--dialog-top','105.7px');dialog.style.height=Math.max(280,size.innerHeight-211.4)+'px';}
  dialog.addEventListener('close',()=>{dialog.style.height='';dialog.classList.remove('menu-delete-dialog','menu-audit-dialog');if(frame){A.$('app').style.cssText='';document.body.classList.remove('menu-modal-open');frame.classList.remove('menu-dialog-layer');}},{once:true});
 }
 function override(){try{return JSON.parse(localStorage.getItem(A.navStorageKey(A.tenant))||'null');}catch{return null;}}
 function audit(row,field,before,after,type='UPDATE'){
  if(String(before)===String(after))return;
  (A.model.auditRecords??=[]).unshift({rowId:row.id,object:get(row,'菜单名称'),time:new Date().toLocaleString('sv-SE'),actor:'房昕',type,field,before:String(before),after:String(after),source:'local'});
 }
 function setValue(row,field,value){const i=A.getTable().headers.indexOf(field);const old=i>=0?row.cells[i]:row.extra?.[field]||'';audit(row,field,old,value);if(i>=0)row.cells[i]=value;(row.extra??={})[field]=value;}
 function notifyNav(){if(!platform)parent.postMessage({type:'admin-navigation-updated',tenant:A.tenant},location.origin);}
 function updateNavigation(row,values){
  if(platform)return;
  const t=A.tenantInfo,all=t.menu.flatMap(g=>[g,...(g.children||[])]),item=all.find(i=>(i.route||i.id)===row.tree?.key);
  if(!item)return;
  const saved=override()||{},key=item.route||item.id;saved.enabled??=window.AdminMenuState.defaultEnabled(t);saved.display??={};saved.order??={};saved.superPermission??={};
  if(values['菜单状态']!==undefined){saved.display[key]=values['菜单状态'];const routes=(item.children||[item]).map(c=>c.route);saved.enabled=values['菜单状态']==='隐藏'?saved.enabled.filter(r=>!routes.includes(r)):[...new Set([...saved.enabled,...routes.filter(r=>{const child=all.find(c=>c.route===r);return saved.display[r]!=='隐藏'&&(saved.display[r]!==undefined||child?.display!=='隐藏');})])];}
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
   for(const [label,map]of [['菜单状态',saved.display],['排序',saved.order],['超级权限',saved.superPermission]])if(map?.[key]!==undefined){const i=A.getTable().headers.indexOf(label);row.cells[i]=label==='超级权限'?(map[key]?'是':'否'):String(map[key]);}
  }
 }
 function render(){
  if(!matches)return false;resizeObservers.forEach(o=>o.disconnect());resizeObservers=[];syncOverride();document.body.classList.add('menu-content');
  const root=node('section','menu-page'+(platform?' platform-menu-page':'')),head=node('header','menu-page-header'),title=node('h1','',platform?'平台菜单管理':'菜单管理'),actions=node('div','menu-header-actions');head.append(title,actions);
  (platform?['新增','同步菜单','复制菜单','增量更新菜单','批量删减菜单','全部记录']:['全部记录']).forEach(label=>actions.append(button(label,()=>label==='全部记录'?logs():label==='新增'?edit():A.action(label),label==='新增'?'primary':'')));
  const wrap=node('div','menu-table-wrap'),table=node('table','menu-tree-table'),colgroup=node('colgroup'),thead=node('thead'),headrow=node('tr'),tbody=node('tbody'),data=A.getTable();table.setAttribute('aria-label',platform?'平台菜单树':'租户菜单树');
  const widths=platform?[200,200,150,240,100,100,100,80,150]:[200,150,150,150,0,150];
  data.headers.forEach((h,i)=>{const col=node('col');if(widths[i])col.style.width=widths[i]+'px';colgroup.append(col);const th=node('th','',h);if(h==='操作')th.className='menu-actions-head';if(!h)th.className='menu-flex-space';headrow.append(th);});thead.append(headrow);table.append(colgroup,thead,tbody);if(platform)table.style.minWidth=widths.reduce((a,b)=>a+b,0)+'px';
  const stack=[];
  data.rows.forEach((row,index)=>{
   const depth=rowDepth(row);while(stack.length&&stack.at(-1).depth>=depth)stack.pop();const isHidden=stack.some(s=>collapsed.has(s.id));const children=row.tree?.hasChildren??(data.rows[index+1]&&rowDepth(data.rows[index+1])>depth);if(children)stack.push({id:row.id,depth});
   const tr=node('tr');tr.dataset.rowId=row.id;tr.dataset.depth=String(depth);tr.hidden=isHidden;
   data.headers.forEach((header,i)=>{
    const td=node('td'),cell=node('div','menu-cell');if(i===0){cell.classList.add('menu-name-cell');cell.style.paddingLeft=12+16*depth+'px';if(children){const toggle=button('',()=>{collapsed.has(row.id)?collapsed.delete(row.id):collapsed.add(row.id);const scroll=wrap.scrollTop;render();document.querySelector('.menu-table-wrap').scrollTop=scroll;document.querySelector('[data-row-id="'+row.id+'"] .menu-tree-toggle')?.focus();},'menu-tree-toggle');toggle.innerHTML=arrow;toggle.setAttribute('aria-label',(collapsed.has(row.id)?'展开':'收起')+row.cells[0]);toggle.setAttribute('aria-expanded',String(!collapsed.has(row.id)));cell.append(toggle);}else cell.append(node('span','menu-tree-placeholder'));cell.append(document.createTextNode(row.cells[i]||''));}
    else if(header==='超级权限')cell.append(switchControl(row));
    else if(header==='操作'){td.className='menu-actions-cell';const group=node('div','menu-row-actions');['编辑','删除','记录'].forEach(label=>group.append(button(label,()=>label==='编辑'?edit(row):label==='记录'?logs(row):remove(row),'link '+(label==='删除'?'danger':label==='记录'?'menu-record':''))));cell.append(group);}
    else if(!header){td.className='menu-flex-space';}
    else cell.textContent=row.cells[i]||'';
    td.append(cell);tr.append(td);
   });tbody.append(tr);
  });wrap.append(table);const viewport=node('div','menu-table-viewport');viewport.append(wrap);root.append(head,viewport);A.$('app').replaceChildren(root);scrollbars(viewport,wrap);return true;
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
  const form=node('form','form-grid menu-edit-form'),inputs={};let parentValue;
  if(!platform){['菜单名称','菜单状态','超级权限','排序'].forEach(label=>inputs[label]=field(form,label,get(row,label),{required:label==='菜单名称',disabled:label==='菜单名称',radio:label==='菜单状态'?['显示','隐藏']:null}));}
  else{
   ['菜单名称','平台菜单名称','唯一标识','菜单状态','菜单路由','菜单图标','父级菜单','排序','备注信息','菜单类型'].forEach(label=>{
    if(label==='父级菜单'){parentValue=parentPicker(row,form);return;}
    const value=row?(label==='唯一标识'?(row.extra?.唯一标识||get(row,'菜单路由').replace(/[A-Z]/g,m=>'_'+m.toLowerCase())||'menu_'+row.id.replaceAll('-','_')):get(row,label)):label==='菜单状态'?'显示':label==='菜单类型'?'菜单':label==='排序'?'0':'';
    inputs[label]=field(form,label,label==='菜单类型'?'菜单':value,{required:['菜单名称','唯一标识'].includes(label),radio:label==='菜单状态'?['显示','隐藏']:label==='菜单类型'?['菜单']:null});
   });
  }
  const save=()=>{
   if(!form.reportValidity())return;
   const target=row||{id:'local-'+crypto.randomUUID(),cells:A.getTable().headers.map(()=>''),actions:['编辑','删除','记录'],extra:{},tree:{depth:0,hasChildren:false}};
   const values={};Object.entries(inputs).forEach(([label,input])=>values[label]=input.dataset.single?input.querySelector('input:checked')?.value||'':input.type==='checkbox'?(input.checked?'是':'否'):input.value);
   if(values['菜单类型'])values['菜单类型']='menu';
   Object.entries(values).forEach(([k,v])=>setValue(target,k,v));
   if(platform){const rows=A.getTable().rows,parentId=parentValue(),p=rows.find(r=>r.id===parentId),oldDepth=rowDepth(target),depth=p?rowDepth(p)+1:0,changedParent=!row||(target.extra.parentId??target.tree.parentId??'')!==parentId;target.extra.parentId=parentId;target.tree.parentId=parentId;if(changedParent){let branch=[target];if(row){const start=rows.indexOf(row);let end=start+1;while(end<rows.length&&rowDepth(rows[end])>oldDepth)end++;branch=rows.splice(start,end-start);}for(const item of branch)item.tree.depth+=depth-oldDepth;let index=p?rows.indexOf(p)+1:rows.length;if(p)while(index<rows.length&&rowDepth(rows[index])>rowDepth(p))index++;rows.splice(index,0,...branch);rows.forEach((item,i)=>item.tree.hasChildren=!!rows[i+1]&&rowDepth(rows[i+1])>rowDepth(item));}}
   updateNavigation(target,values);if(!row&&!platform)A.getTable().rows.push(target);A.persist('编辑菜单',values['菜单名称']);A.closeDialog();render();notifyNav();A.toast('修改成功 · 已保存到本地');
  };
  const profile=window.AdminLiveUI.profiles[A.route];profile.edit={...profile.edit,title:row?'修改菜单':'新增菜单',width:platform?800:Math.max(500,(window.frameElement?parent.innerWidth:innerWidth)*.5),columns:platform?2:3,labelWidth:140};
  present(row?'修改菜单':'新增菜单',form,[{label:'确 定',cls:'primary',run:save},{label:'取 消',run:A.closeDialog}]);form.onsubmit=e=>{e.preventDefault();save();};
 }
 function remove(row){
  const body=node('div','menu-delete-message');body.innerHTML='<svg viewBox="0 0 1024 1024" aria-hidden="true"><path fill="currentColor" d="M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896m0 192a58.43 58.43 0 0 0-58.24 63.744l23.36 256.384a35.072 35.072 0 0 0 69.76 0l23.296-256.384A58.43 58.43 0 0 0 512 256m0 512a51.2 51.2 0 1 0 0-102.4 51.2 51.2 0 0 0 0 102.4"/></svg><p>确认删除菜单?</p>';
  present('警告',body,[{label:'取消',run:A.closeDialog},{label:'确定',cls:'primary',run:()=>{
   const rows=A.getTable().rows,index=rows.indexOf(row);let end=index+1;while(end<rows.length&&rowDepth(rows[end])>rowDepth(row))end++;
   A.snapshot();const removed=rows.splice(index,end-index);updateNavigation(row,{'菜单状态':'隐藏'});audit(row,'菜单',get(row,'菜单名称'),'已删除','DELETE');A.persist('删除菜单',get(row,'菜单名称'));A.closeDialog();render();notifyNav();A.toast('已删除 '+removed.length+' 个本地菜单');
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
