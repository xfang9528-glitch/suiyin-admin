/* SPEC-SUIYIN-ADMIN-054: current bzds configuration pages, local HTML only. */
'use strict';
(()=>{
 const A=window.Admin,V=window.AdminViews;if(A.tenant!=='bzds'||!['auditDict','labelMenu','esIndex'].includes(A.route))return;
 const previous=V.render,{node}=A;let collapsed=new Set(),sort={index:-1,asc:true};
 const labelRows=window.AdminPlatformLabelRows||[];
 function action(label,row){A.action(label,row);}
 function button(label,run,cls=''){const b=A.button(label,run,'platform-button '+cls);if(label==='同步标签'&&!b.querySelector('.button-icon')){const svg=window.AdminLiveUI?.buttonIcons?.['刷新'];if(svg){const icon=node('span','button-icon');icon.innerHTML=svg;icon.setAttribute('aria-hidden','true');b.prepend(icon);}}return b;}
 function heading(label,actions=[]){const h=node('header','platform-heading');h.append(node('h2','',label));const tools=node('div','platform-toolbar');actions.forEach(([label,cls])=>tools.append(button(label,()=>action(label),cls)));h.append(tools);return h;}
 function initData(){
  if(A.model.platformSourceRevision==='2026-09-27')return;
  if(A.route==='labelMenu'){const local=A.model.tables[0].rows.filter(r=>r.id.startsWith('local-'));A.model.tables[0].rows=[...local,...labelRows.map((r,i)=>({id:'label-source-'+i,cells:r.cells,actions:['编辑','删除','记录'],sourceDepth:r.depth,sourceParent:r.parent,sourceExpandable:r.expandable}))];}
  if(A.route==='esIndex')A.model.tables[0].rows=A.model.tables[0].rows.filter(r=>r.id.startsWith('local-'));
  A.model.platformSourceRevision='2026-09-27';
 }
 function table(headers,rows,kind,renderCell,widths){
  const wrap=node('div','platform-table-wrap '+kind),table=node('table','platform-table'),cols=node('colgroup'),head=node('thead'),tr=node('tr');
  headers.forEach((label,i)=>{cols.append(node('col'));const th=node('th');th.append(node('div','platform-cell',label));if(kind==='platform-environments'&&i<2){const b=button(label,()=>{sort={index:i,asc:sort.index===i?!sort.asc:true};render();},'platform-sort');b.append(node('span','platform-sort-glyph'));th.replaceChildren(b);}tr.append(th);});head.append(tr);table.append(cols,head);const body=node('tbody');
  rows.forEach((r,index)=>{const tr=node('tr');tr.dataset.rowId=r.id;headers.forEach((label,i)=>{const td=node('td'),cell=node('div','platform-cell');renderCell(cell,r,i,index);td.append(cell);tr.append(td);});body.append(tr);});table.append(body);wrap.append(table);
  if(!rows.length)wrap.append(node('div','platform-table-empty',kind==='platform-tasks'?'暂无进行中的任务':'暂无数据'));
  const resize=()=>{if(!wrap.isConnected)return;const size=widths(Math.round(wrap.getBoundingClientRect().width));[...cols.children].forEach((c,i)=>c.style.width=size[i]+'px');table.style.width=size.reduce((a,b)=>a+b,0)+'px';};requestAnimationFrame(resize);new ResizeObserver(resize).observe(wrap);return wrap;
 }
 function audit(){const root=node('section','platform-page platform-audit');root.append(heading('日志字典管理'));const pane=node('div','platform-audit-pane');const t=A.model.tables[0];pane.append(table(t.headers,t.rows,'platform-dictionary',(cell,r,i)=>{if(i===t.headers.length-1)cell.append(button('管理',()=>action('管理',r),'is-link'));else cell.textContent=r.cells[i]||'';},w=>{const weights=[150,150,100,160,160],remaining=w-120,sum=720,result=weights.map(x=>Math.floor(remaining*x/sum));result[0]+=remaining-result.reduce((a,b)=>a+b,0);return[...result,120];}));root.append(pane);return root;}
 function labelVisible(r,all){let parent=r.sourceParent;while(parent!==null&&parent!==undefined){if(collapsed.has('label-source-'+parent))return false;parent=all.find(x=>x.id==='label-source-'+parent)?.sourceParent;}return true;}
 function labels(){const root=node('section','platform-page platform-labels');root.append(heading('客户标签管理',[['创建','is-primary'],['同步标签',''],['全部记录','']]));const t=A.model.tables[0];root.append(table(t.headers,t.rows.filter(r=>labelVisible(r,t.rows)),'platform-label-tree',(cell,r,i)=>{
  if(i===0){cell.style.paddingLeft=(12+(r.sourceDepth||0)*16)+'px';if(r.sourceExpandable){const toggle=button('',()=>{collapsed.has(r.id)?collapsed.delete(r.id):collapsed.add(r.id);render();},'platform-tree-toggle');toggle.setAttribute('aria-label',(collapsed.has(r.id)?'展开':'收起')+'当前行');toggle.setAttribute('aria-expanded',String(!collapsed.has(r.id)));toggle.append(node('span','platform-tree-arrow'));cell.append(toggle);}else cell.append(node('span','platform-tree-placeholder'));cell.append(document.createTextNode(r.cells[i]||''));}
  else if(i===t.headers.length-1){const actions=node('div','platform-row-actions');for(const label of ['编辑','删除','记录'])actions.append(button(label,()=>action(label,r),'is-link '+(label==='删除'?'is-danger':label==='记录'?'is-muted':'')));cell.append(actions);}
  else cell.textContent=r.cells[i]||'';
 },()=>[200,200,200,100,100,120,100,80,150]));return root;}
 function environmentDetails(row){const dl=node('dl','detail-grid');A.model.tables[1].headers.slice(0,2).forEach((h,i)=>dl.append(node('dt','',h),node('dd','',row.cells[i]||'')));const body=node('section');body.append(node('p','form-note','本地环境样本；真实索引列表展开内容本次尚未采集。'),dl);A.showDialog('环境索引详情',body,[{label:'关闭',run:A.closeDialog}]);}
 function indexPage(){const root=node('section','platform-page platform-index');root.append(heading('索引任务管理 ('+A.model.tables[1].rows.length+')',[['创建索引','is-blue']]));const task=A.model.tables[0];root.append(table(task.headers,task.rows,'platform-tasks',(cell,r,i)=>cell.textContent=r.cells[i]||'',w=>[140,120,160,90,180,Math.max(180,w-860),170]));const env=A.model.tables[1],rows=[...env.rows];if(sort.index>=0)rows.sort((a,b)=>String(a.cells[sort.index]).localeCompare(String(b.cells[sort.index]),'zh-CN')*(sort.asc?1:-1));root.append(table(env.headers,rows,'platform-environments',(cell,r,i)=>{if(i===2)cell.append(button('索引列表',()=>environmentDetails(r),'is-link'));else cell.textContent=r.cells[i]||'';},w=>[200,200,Math.max(150,w-400)]));return root;}
 function render(){initData();document.body.classList.add('admin-platform-content');A.$('app').replaceChildren(A.route==='auditDict'?audit():A.route==='labelMenu'?labels():indexPage());return true;}
 A.$('dialog').addEventListener('close',()=>setTimeout(render,0));
 V.render=()=>render()||previous?.();
})();
