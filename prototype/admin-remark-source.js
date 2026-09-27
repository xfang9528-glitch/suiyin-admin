/* SPEC-SUIYIN-ADMIN-054: observed first-demand grouping, refreshed 2026-09-27. */
'use strict';
(()=>{
 const A=window.Admin,V=window.AdminViews;
 if(A.route!=='remark-demand-mappings')return;
 const previous=V.render,{node,button}=A;
 const captured=window.AdminRemarkCurrent?.[A.tenant];
 const expanded=new Set();
 let query='',status='',page=1,pageSize=10,resizeObserver;
 function groups(){
  if(!captured)return null;
  if(A.model.remarkSourceRevision==='2026-09-27-all-groups')return A.model.remarkGroups;
  const saved=new Map((A.model.remarkGroups||[]).map(g=>[g.name,g]));
  A.model.remarkGroups=captured.groups.map(g=>{const old=saved.get(g.name);return old?{...g,words:[...g.words,...old.words.filter(w=>!g.words.some(x=>x.value===w.value))]}:structuredClone(g)});
  A.model.remarkSourceRevision='2026-09-27-all-groups';
  return A.model.remarkGroups;
 }
 function historyDetail(){
  const h=captured.history,overlay=node('dialog','remark-history-overlay'),drawer=node('section','remark-history-drawer');overlay.setAttribute('aria-label','历史备注补匹配');
  const app=document.getElementById('app'),savedStyle=app.style.cssText,savedScroll=scrollY,focus=document.activeElement;
  const close=()=>overlay.close();overlay.addEventListener('close',()=>{app.style.cssText=savedStyle;document.body.classList.remove('menu-modal-open');window.frameElement?.classList.remove('menu-dialog-layer');parent.postMessage({type:'admin-dialog-state',open:false},location.origin);overlay.remove();window.scrollTo(0,savedScroll);focus?.focus()});
  const header=node('header');header.append(node('h2','','历史备注补匹配'),button('×',close));header.lastChild.setAttribute('aria-label','关闭此对话框');drawer.append(header);
  const body=node('div','remark-history-body');body.append(node('p','','只补空缺，不覆盖已有需求。历史补录成功过的客户会跳过；没有命中或需求冲突的客户仍保留为空。'),node('span','remark-history-state',h.state));
  const counts=node('div','remark-history-counts');h.counts.forEach((count,i)=>{const cell=node('div');cell.append(node('strong','',count),node('span','',['已扫描','已补录','已跳过'][i]));counts.append(cell)});body.append(counts);
  const list=node('dl');for(const [label,value] of [['发起人','工程师（演示）'],['创建时间',h.created],['最近进度',h.finished],['最近心跳',h.heartbeat],['结束时间',h.finished]])list.append(node('dt','',label),node('dd','',value));body.append(list);
  const skips=node('div','remark-history-skips'),skipRows=node('div','remark-history-skip-rows');skipRows.hidden=true;for(const [label,value] of [['需求冲突','1484'],['已有第一需求','4809'],['不符合客户范围','679'],['无有效备注','7674'],['未命中关键词','247721']]){const item=node('div');item.append(node('span','',label),node('span','',value));skipRows.append(item)}const skipToggle=button('查看跳过原因',()=>{skipRows.hidden=!skipRows.hidden;skipToggle.setAttribute('aria-expanded',String(!skipRows.hidden))},'remark-history-skip-toggle');skipToggle.setAttribute('aria-expanded','false');skipToggle.setAttribute('aria-label','查看跳过原因');skips.append(skipToggle,skipRows);body.append(skips,node('h4','','运行记录'));
  const table=node('table');const hr=node('tr');['创建时间','状态','补录'].forEach(x=>hr.append(node('th','',x)));const row=node('tr');[h.created,h.state,h.counts[1]].forEach(x=>row.append(node('td','',x)));table.append(hr,row);body.append(table);const pager=node('div','remark-history-pager');const prev=button('‹',()=>{}),next=button('›',()=>{});prev.disabled=next.disabled=true;prev.setAttribute('aria-label','历史记录上一页');next.setAttribute('aria-label','历史记录下一页');pager.append(prev,node('span','','1'),next);body.append(pager);drawer.append(body);overlay.append(drawer);overlay.onclick=e=>{if(e.target===overlay)close()};document.body.append(overlay);
  if(window.frameElement){const r=window.frameElement.getBoundingClientRect();app.style.cssText=`position:fixed;left:${r.left}px;top:${r.top-savedScroll}px;width:${r.width}px;height:${r.height}px;min-height:0;overflow:hidden`;document.body.classList.add('menu-modal-open');window.frameElement.classList.add('menu-dialog-layer');parent.postMessage({type:'admin-dialog-state',open:true},location.origin);}overlay.showModal();
 }
 function addWord(group){
  const form=node('form','remark-source-form'),words=node('textarea'),target=node('select'),enabled=node('input');
  words.placeholder='输入关键词，多个词可用顿号、逗号或换行分隔';words.required=true;words.setAttribute('aria-label','关键词');
  target.append(new Option(group.name,group.id));target.disabled=true;target.setAttribute('aria-label','第一需求');
  enabled.type='checkbox';enabled.checked=true;enabled.className='source-switch';enabled.setAttribute('role','switch');enabled.setAttribute('aria-label','启用');
  for(const [caption,control] of [['关键词',words],['第一需求',target],['启用',enabled]]){const field=node('label','remark-source-field');field.append(node('span','',caption),control);form.append(field);if(caption==='关键词')form.append(node('p','remark-source-help','按顿号（、）、中文逗号（，）、英文逗号（,）和换行拆分，自动去掉首尾空格、空项和重复词。'));}
  form.append(node('p','remark-source-help','相同关键词不能重复；相互包含的不同关键词只有对应同一目标时才能保存。失效目标可在列表停用或删除，编辑时需选择有效目标。'));
  const save=()=>{
   words.setCustomValidity('');if(!form.reportValidity())return;
   const values=[...new Set(words.value.split(/[、，,\r\n]+/).map(x=>x.trim()).filter(Boolean))];
   if(!values.length){words.setCustomValidity('请输入关键词');words.reportValidity();return;}
   const all=groups().flatMap(g=>g.words.map(w=>({...w,group:g.id})));
   const duplicate=values.find(value=>all.some(w=>w.value===value));
   const conflict=values.find(value=>all.some(w=>w.group!==group.id&&(w.value.includes(value)||value.includes(w.value))));
   if(duplicate||conflict){words.setCustomValidity(duplicate?'相同关键词不能重复':'相互包含的关键词需对应同一目标');words.reportValidity();return;}
   group.words.push(...values.map(value=>({value,enabled:enabled.checked})));A.persist('新增词条',group.name);A.closeDialog();render();A.toast('已保存到本地演示');
  };
  words.oninput=()=>words.setCustomValidity('');form.onsubmit=e=>{e.preventDefault();save();};
  A.showDialog('新增词条',form,[{label:'取消',run:A.closeDialog},{label:'保存',cls:'primary',run:save}]);
 }
 function render(){
  const data=groups();if(!data)return false;
  const root=node('section','remark-source-page'+(captured.warning?' has-warning':''));
  root.append(node('h2','','备注需求词库'),node('p','remark-source-intro','按第一需求补充备注中的映射词。关键词按字面包含匹配；停用词仍参与重复和冲突校验。'));
  if(captured.warning)root.append(node('div','remark-source-warning',captured.warning));
  const history=node('section','remark-source-history');history.append(node('span','','历史备注补匹配'),node('span','remark-source-muted',captured.history.state));
  if(captured.history.counts){history.append(node('small','remark-source-muted',`已扫描 ${captured.history.counts[0]} · 已补录 ${captured.history.counts[1]} · 已跳过 ${captured.history.counts[2]}`),button('查看详情',historyDetail,'remark-history-details'));}
  history.append(button('补匹配历史客户',()=>A.toast('此原型不执行真实客户历史补匹配。'),'remark-source-outline'));root.append(history);
  const card=node('section','remark-source-card'),form=node('form','remark-source-filters'),input=node('input'),select=node('select');
  input.value=query;input.placeholder='按字面包含搜索，区分大小写';input.setAttribute('aria-label','第一需求或关键词');
  select.append(new Option('全部',''),new Option('启用','enabled'),new Option('停用','disabled'));select.value=status;select.setAttribute('aria-label','状态');
  for(const [caption,control] of [['第一需求或关键词',input],['状态',select]]){const label=node('label');label.append(node('span','',caption),control);form.append(label);}
  const search=()=>{query=input.value;status=select.value;page=1;render();};form.onsubmit=e=>{e.preventDefault();search();};
  form.append(button('搜索',search,'primary'),button('重置',()=>{query='';status='';page=1;render();}),button('刷新',()=>render()));card.append(form);
  const rows=data.filter(g=>(!query||g.name.includes(query)||g.words.some(w=>w.value.includes(query)))&&(!status||g.words.some(w=>status==='enabled'?w.enabled:!w.enabled)));
  card.append(node('p','remark-source-count',`共 ${rows.length} 个第一需求`));
  const wrap=node('div','remark-source-table-wrap'),table=node('table','remark-source-table'),head=node('thead'),hr=node('tr');
  for(const name of ['第一需求','映射词汇','操作'])hr.append(node('th','',name));head.append(hr);table.append(head);const body=node('tbody');
  for(const group of rows.slice((page-1)*pageSize,page*pageSize)){
   const row=node('tr'),name=node('td','',group.name),terms=node('td');
   if(!group.words.length)terms.append(node('span','remark-source-muted','暂未添加映射词'));
   if(group.words.length){const tags=node('div','remark-source-words'+(expanded.has(group.id)?' is-expanded':''));for(const word of group.words){const tag=node('span','remark-source-word'+(word.enabled?'':' is-disabled'),word.value);tag.title=word.value;tags.append(tag);}terms.append(tags,button(expanded.has(group.id)?'收起':`展开全部（共 ${group.words.length} 个）`,()=>{expanded.has(group.id)?expanded.delete(group.id):expanded.add(group.id);render();},'remark-source-expand'));}
   const action=node('td');action.append(button('＋ 添加关键词',()=>addWord(group),'link'));row.append(name,terms,action);body.append(row);
  }
  if(!rows.length){const row=node('tr'),cell=node('td','remark-source-empty','暂无符合条件的第一需求');cell.colSpan=3;row.append(cell);body.append(row);}
  table.append(body);wrap.append(table);card.append(wrap);
  const pager=node('div','remark-source-pager'),size=node('select');[10,20,50].forEach(n=>size.append(new Option(n+'条/页',String(n))));size.value=String(pageSize);size.setAttribute('aria-label','每页条数');size.onchange=()=>{pageSize=Number(size.value);page=1;render();};
  const pages=Math.max(1,Math.ceil(rows.length/pageSize)),prev=button('‹',()=>{page--;render();}),next=button('›',()=>{page++;render();});prev.disabled=page===1;next.disabled=page===pages;prev.setAttribute('aria-label','上一页');next.setAttribute('aria-label','下一页');pager.append(node('span','',`共 ${rows.length} 条`),size,prev);for(let n=1;n<=pages;n++)pager.append(button(String(n),()=>{page=n;render();},page===n?'selected':''));pager.append(next);card.append(pager);
  root.append(card);A.$('app').replaceChildren(root);window.AdminControls?.enhance(root);resizeObserver?.disconnect();const resize=()=>{hr.firstChild.style.width=Math.round((table.clientWidth-150)*280/880)+'px'};resizeObserver=new ResizeObserver(resize);resizeObserver.observe(wrap);resize();return true;
 }
 V.render=()=>render()||previous?.();
})();
