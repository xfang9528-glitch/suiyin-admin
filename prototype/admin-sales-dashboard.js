/* SPEC-SUIYIN-ADMIN-056@1.0.0: saved sales dashboard structure, without fabricated chart points. */
'use strict';
(()=>{
 const A=window.Admin,V=window.AdminViews,{node,button,$}=A,render=V.render,onQuery=V.onQuery;
 let data,root,results,sequence=0,dateDefaultsSynced=false,initialDateValues=[];
 function info(title){const dot=node('span','source-stat-info','i');dot.title=title+'：只展示已保存快照，未采集的明细不补零';dot.setAttribute('aria-label',title+'统计说明');return dot;}
 function unavailableFilters(){
  return Object.entries(A.filters).some(([key,value])=>{
   if(/开始日期/.test(key))return value!==data.from;
   if(/结束日期/.test(key))return value!==data.to;
   if(!value)return false;
   if(key===data.granularity||key==='自然日'||key==='day')return value!==data.granularity;
   return true;
  });
 }
 function draw(){
  if(!data||!results)return;
  results.replaceChildren();
  if(data.state==='not-captured'||unavailableFilters()){
   results.dataset.state='no-snapshot';results.append(A.empty('该筛选条件尚无已采集快照','请重置查看已保存的样本；未采集不代表业务数据为零。'));return;
  }
  results.dataset.state='success';
  const sampleTenant=A.nav.tenants.find(t=>t.id===data.sampleTenant)?.name||data.sampleTenant;
  const note=node('p','dashboard-source',`${data.state==='reference'?'参考样本 · '+sampleTenant:data.state==='partial'?'本租户结构已采 · 指标未知':'本租户采样'} · ${data.from} 至 ${data.to}。图表逐点数据尚未采集。`);
  results.append(note);
  const grid=node('div','source-sales-grid');
  data.metrics.forEach(metric=>{
   const card=node('section','card source-sales-card'),header=node('header'),title=node('h2','section-title',metric.label);
   card.dataset.metric=metric.label;title.append(info(metric.label));header.append(title);
   if(metric.selector){
    const control=node('select');control.setAttribute('aria-label',metric.label+' · '+metric.selector);control.append(new Option(metric.selector,''));
    const choices=metric.selector==='选择门店'?A.optionsFor('门店'):[];
    choices.forEach(value=>control.append(new Option(value,value)));control.disabled=!choices.length;
    control.title=choices.length?'仅显示已采集门店选项；门店拆分数据未采集':'此控件的其他选项尚未采集';header.append(control);
    control.onchange=()=>{const hasFilter=!!control.value;card.querySelector('.source-sales-value').textContent=hasFilter?'—':metric.value??'—';for(const child of card.querySelectorAll('.source-sales-chart,.source-sales-ranking'))child.hidden=hasFilter;let state=card.querySelector('.source-sales-filter-note');if(!state){state=node('p','source-sales-filter-note');card.append(state);}state.textContent=hasFilter?'该门店的指标明细尚未采集':'';state.hidden=!hasFilter;};
   }
   card.append(header,node('strong','source-sales-value',metric.value??'—'));
   if(metric.table>=0){
    const t=data.tables[metric.table],table=node('table','source-sales-ranking'),head=node('thead'),tr=node('tr');
    const profile=window.AdminLiveUI?.profiles.salesStatsNew?.tables?.[metric.table];
    (t?.headers||[]).forEach((label,i)=>{const th=node('th','',label),column=profile?.columns?.[i];if(column){th.style.textAlign=column.align;th.style.width=column.width+'px';}tr.append(th);});head.append(tr);table.append(head);
    const body=node('tbody');
    if(t?.rows.length)t.rows.forEach(row=>{const tr=node('tr');if(profile?.rowHeight)tr.style.height=profile.rowHeight+'px';row.forEach((value,i)=>{const td=node('td','',value);if(i===1&&t.hasProductImage){td.classList.add('source-sales-product');const icon=node('span','source-product-image');icon.setAttribute('role','img');icon.setAttribute('aria-label','演示商品图片，原图未公开');icon.innerHTML='<svg viewBox="0 0 40 40" aria-hidden="true"><rect x="5" y="7" width="30" height="27" rx="3" fill="#eef2f5" stroke="#c5ccd3"/><circle cx="14" cy="16" r="3" fill="#c5ccd3"/><path d="m7 30 9-9 7 6 6-10 5 13" fill="#c5ccd3"/></svg>';td.prepend(icon);}td.style.textAlign=profile?.columns?.[i]?.align||'left';tr.append(td);});body.append(tr);});
    else {const tr=node('tr'),td=node('td','source-sales-empty',data.state==='partial'?'商品明细尚未采集':'暂无数据');td.colSpan=t?.headers.length||3;tr.append(td);body.append(tr);}
    table.append(body);const viewport=node('div','source-ranking-viewport');viewport.append(table);card.append(viewport);
   }else{
    const chart=node('div','source-sales-chart');chart.setAttribute('role','status');chart.append(node('span','','图表明细尚未采集'));card.append(chart);
   }
   grid.append(card);
  });
  results.append(grid);
 }
 async function load(){
  const current=++sequence;results.dataset.state='loading';results.setAttribute('aria-busy','true');results.replaceChildren(node('p','loading','正在载入统计快照…'));
  try{
   const response=await fetch('data/sales-dashboard/'+A.tenant+'.json');if(!response.ok)throw Error('data');
   const next=await response.json();if(next.tenantId!==A.tenant||next.route!=='salesStatsNew')throw Error('identity');
   if(current!==sequence)return;data=next;
   if(!dateDefaultsSynced){
    const inputs=[...root.querySelectorAll('.source-filter-range[data-filter-group="统计时间"] input[data-range-edge]')];
    const pristine=inputs.every((input,index)=>input.value===initialDateValues[index]);
    for(const form of A.source.forms||[])for(const field of form.fields||[])if(field.label==='统计时间')for(const [index,control]of (field.controls||[]).entries())if(index<2)control.value=index?data.to:data.from;
    if(pristine)inputs.forEach((input,index)=>input.value=(index?data.to:data.from)||'');
    dateDefaultsSynced=true;
   }
   Object.assign(A.source,{state:data.state,sampleTenant:data.sampleTenant,sampleSource:data.sampleSource,capturedAt:data.capturedAt,hasSupplementedData:false});
   A.model.tables=data.tables.map((t,ti)=>({headers:t.headers,rows:t.rows.map((cells,i)=>({id:'snapshot-'+ti+'-'+i,cells,actions:[]}))}));
   root.querySelector('.page-head')?.replaceWith(A.pageHead());draw();
  }catch{results.dataset.state='error';results.replaceChildren(A.empty('统计快照载入失败','请重试。'),button('重新载入',load,'primary'));}
  finally{if(current===sequence)results.removeAttribute('aria-busy');}
 }
 function ranking(){
  root=node('div','page source-sales-dashboard source-ranking-dashboard');root.append(A.pageHead(),A.filterPanel());results=node('section','source-sales-results');root.append(results);$('app').replaceChildren(root);drawRanking();
  root.querySelectorAll('.source-filter-range input').forEach(input=>input.addEventListener('change',()=>{A.filters[input.dataset.filter]=input.value;drawRanking();}));return true;
 }
 function hasUnsavedFilters(){const defaults=(A.source.forms||[]).flatMap(f=>f.fields||[]).flatMap(f=>f.controls||[]).map(c=>c.value).filter(Boolean);return Object.entries(A.filters).some(([key,value])=>value&&(!/日期/.test(key)||!defaults.includes(value)));}
 function drawRanking(){
  results.replaceChildren();const grid=node('div','source-sales-grid');['预付金额排名','预付客户数排名','交付金额排名'].forEach((label,index)=>{
   const card=node('section','card source-sales-card source-ranking-card'),header=node('header'),title=node('h2','section-title',label),select=node('select');title.append(info(label));select.append(new Option('销售',''));select.disabled=true;select.title='其他排名维度尚未采集';header.append(title,A.searchableSelect(select,label+'维度'));card.append(header);const wrap=node('div','source-ranking-viewport'),table=node('table','source-sales-ranking'),head=node('thead'),tr=node('tr'),body=node('tbody'),snapshot=A.model.tables[index];(snapshot?.headers||['排名','名称','数量']).forEach(h=>tr.append(node('th','',h)));head.append(tr);
   const rows=hasUnsavedFilters()?[]:snapshot?.rows||[];rows.forEach(row=>{const tr=node('tr');row.cells.forEach(value=>tr.append(node('td','',value)));body.append(tr);});table.append(head,body);wrap.append(table);if(!rows.length)wrap.append(node('div','source-ranking-empty',hasUnsavedFilters()?'该日期范围尚无已采集快照':'暂无数据'));card.append(wrap);grid.append(card);
  });results.append(grid);results.append(node('p','dashboard-source','已有脱敏排名样本；查询范围无对应快照时不沿用旧结果。'));
 }
 function legacyDashboard(){
  root=node('div','page source-sales-dashboard source-legacy-dashboard');root.append(A.pageHead(),A.filterPanel());results=node('section','source-sales-results');root.append(results);$('app').replaceChildren(root);normalizeLegacyFilters();drawLegacy();return true;
 }
 function normalizeLegacyFilters(){
  root.querySelectorAll('.filter-panel>.field').forEach(field=>{let label=field.querySelector(':scope>span')?.textContent||'';const input=field.querySelector(':scope>input');if(!label&&input&&/自然日/.test((input.getAttribute('aria-label')||'')+' '+input.placeholder+' '+input.value))label='自然日';field.dataset.sourceLabel=label;if(input&&['自然日','销售','来源'].includes(label)){const select=node('select');select.dataset.filter=input.dataset.filter;select.setAttribute('aria-label',label);select.append(new Option(label==='自然日'?'自然日':'请选择',''));if(label!=='自然日')A.optionsFor(label).forEach(value=>select.append(new Option(value,value)));else select.disabled=true;input.replaceWith(A.searchableSelect(select,label));}});
 }
 function drawLegacy(){
  results.replaceChildren();const layout=node('div','source-legacy-layout'),grid=node('div','source-sales-grid');
  const labels=['预付总额','交付总额','拉新人数','拉新分布','预付订单数','预付均值','交付人次','交付均值','获取客户信息人数','获取骑手信息人数','商品销售人数','商品交付鞍时','商品预付人数','商品预付金额','商品交付人数','商品交付金额'];
  labels.forEach((label,index)=>{const card=node('section','card source-sales-card'),head=node('header'),title=node('h2','section-title',label);title.append(info(label));head.append(title);if(!['拉新人数','获取客户信息人数'].includes(label)){const select=node('select');select.append(new Option(({拉新分布:'渠道',获取骑手信息人数:'全部',商品销售人数:'人数',商品交付鞍时:'鞍时'})[label]||'选择门店',''));select.disabled=true;head.append(A.searchableSelect(select,label+'维度'));}card.append(head,node('strong','source-sales-value','—'));if(index<12)card.append(node('div','source-sales-chart','图表明细尚未采集'));else{const wrap=node('div','source-ranking-viewport'),table=node('table','source-sales-ranking'),thead=node('thead'),tr=node('tr');['排名','商品名称',label].forEach(h=>tr.append(node('th','',h)));thead.append(tr);table.append(thead);wrap.append(table,node('div','source-ranking-empty','商品明细尚未采集'));card.append(wrap);}grid.append(card);});
  const conversion=node('section','card source-sales-card source-conversion-card'),head=node('h2','section-title','交易转化');head.append(info('交易转化'));conversion.append(head);const metrics=node('div','source-conversion-metrics');['拉新人数','商品销售人数','获取客户信息人数','获取骑手信息人数','商品预付人数','商品交付人数'].forEach(label=>{const item=node('div');item.append(node('span','',label),node('strong','source-sales-value','—'));metrics.append(item);});conversion.append(metrics,node('div','source-sales-chart','转化明细尚未采集'));
  layout.append(grid,conversion);results.append(layout,node('p','dashboard-source','本页按当前租户已采布局还原。指标与图表逐点数据尚未保存为可查询快照；不引用其他租户总量，不将未采集表示为零。'));
 }
 function workAccount(){
  const snapshotDate=(A.source.forms||[]).flatMap(f=>f.fields||[]).flatMap(f=>f.controls||[]).map(c=>c.value).find(v=>/^\d{4}-\d{2}-\d{2}$/.test(v))||'',snapshot=A.model.tables[0];
  let submitted={date:snapshotDate,department:''};
  root=node('div','page source-work-account');const header=node('section','card work-account-header'),titles=node('div'),title=node('h1','','工作账号触达与消息统计');titles.append(title,node('p','','按工作账号查看单日三类消息类型的触达人数与成功消息数'));header.append(titles,button('刷新',()=>{drawWork();A.toast('已重新显示本地快照');},'work-refresh'));
  const filters=node('form','work-account-filters'),dateField=node('div','work-date-field'),dateInput=node('input'),quick=node('div','work-quick-days');dateInput.type='date';dateInput.value=snapshotDate;dateInput.setAttribute('aria-label','统计日期');dateInput.style.width='220px';dateField.append(node('span','','统计日期'));
  ['今天','昨天','前天'].forEach((label,index)=>{const b=button(label,()=>{const day=new Date();day.setDate(day.getDate()-index);dateInput.value=day.getFullYear()+'-'+String(day.getMonth()+1).padStart(2,'0')+'-'+String(day.getDate()).padStart(2,'0');quick.querySelectorAll('button').forEach(n=>n.classList.toggle('primary',n===b));});quick.append(b);});dateField.append(quick,dateInput);
  const departmentField=node('label','work-department-field'),department=node('select');department.setAttribute('aria-label','部门');department.append(new Option('全部授权部门',''));[...new Set((snapshot?.rows||[]).map(row=>row.cells[1]))].forEach(value=>department.append(new Option(value,value)));departmentField.append(node('span','','部门'),A.searchableSelect(department,'部门'));const actions=node('div','work-filter-actions');const apply=()=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(dateInput.value)||!Number.isFinite(Date.parse(dateInput.value+'T12:00:00Z'))||new Date(dateInput.value+'T12:00:00Z').toISOString().slice(0,10)!==dateInput.value){A.toast('请选择有效统计日期');return;}submitted={date:dateInput.value,department:department.value};drawWork();};actions.append(button('搜索',apply,'primary'),button('重置',()=>{dateInput.value=snapshotDate;department.value='';department.dispatchEvent(new Event('change'));submitted={date:snapshotDate,department:''};quick.querySelectorAll('button').forEach(n=>n.classList.remove('primary'));drawWork();}));filters.onsubmit=e=>{e.preventDefault();apply();};filters.append(dateField,departmentField,actions);actions.lastElementChild.querySelector('.button-icon')?.remove();window.AdminFilterCalendars?.enhance(filters);header.append(filters);results=node('section','work-account-results');root.append(header,results,A.pageHead());$('app').replaceChildren(root);drawWork();return true;
  function drawWork(){
   results.replaceChildren();const available=submitted.date===snapshotDate,rows=available?(snapshot?.rows||[]).filter(row=>!submitted.department||row.cells[1]===submitted.department):[],note=node('div','work-snapshot-note',available?'本地已采快照 · 统计日期 '+snapshotDate+' · 非当前线上数据':'该日期尚无已采集快照；未采集不代表业务数据为零。');results.append(note);
   const summary=node('section','card work-account-summary'),heading=node('div','work-summary-heading');heading.append(node('strong','','当前本地样本汇总'),node('span','','账号触达人次小计，非跨账号去重人数'));summary.append(heading);const chips=node('div','work-summary-chips');[['S 碎银消息',3,4],['Q 微信消息',5,6],['B 碎银群发',7,8],['三类汇总',9,10]].forEach(([label,c,m])=>{const chip=node('div','work-summary-chip');chip.append(node('span','',label),node('strong','',(available?rows.reduce((sum,row)=>sum+A.num(row.cells[c]),0):'—')+' / '+(available?rows.reduce((sum,row)=>sum+A.num(row.cells[m]),0):'—')),node('small','','触达人次 / 成功消息数'));chips.append(chip);});summary.append(chips);results.append(summary);
   const card=node('section','card work-account-table-card'),wrap=node('div','work-account-table-wrap'),table=node('table'),cols=node('colgroup'),head=node('thead'),first=node('tr'),second=node('tr');[64,130,210,105,95,105,95,105,95,120,120,210].forEach(width=>{const col=node('col');col.style.width=width+'px';cols.append(col);});['#','部门','工作账号','S 碎银消息','Q 微信消息','B 碎银群发','C 去重触达','M 消息合计','数据状态'].forEach((label,index)=>{const th=node('th','',label);if(index>=3&&index<=5)th.colSpan=2;else th.rowSpan=2;first.append(th);});for(let i=0;i<3;i++)['触达人数','成功消息数'].forEach(label=>second.append(node('th','',label)));head.append(first,second);const body=node('tbody');rows.forEach(row=>{const tr=node('tr');row.cells.forEach((value,index)=>{const td=node('td','',index===11?'':value);if(index===11)String(value).split('\n').forEach(text=>td.append(node('span','work-data-status',text)));tr.append(td);});body.append(tr);});if(!rows.length){const tr=node('tr'),td=node('td','work-no-data',available?'暂无符合条件的本地样本':'该日期尚无已采集快照');td.colSpan=12;tr.append(td);body.append(tr);}table.append(cols,head,body);wrap.append(table);card.append(wrap);results.append(card);
  }
 }
 function compactStats(){
  const group=A.route==='groupInviteStats';if(group&&!A.source.pagination)A.source.pagination='20条/页 · 当前本地样本';A.renderTablePage();const root=$('app').firstElementChild;root.classList.add('source-compact-stats',group?'source-group-invite':'source-script-usage');
  const enhance=()=>{
   const filter=root.querySelector('.filter-panel');if(!filter)return;
   if(!filter.dataset.compactStats){filter.dataset.compactStats='true';filter.querySelectorAll(':scope>.field').forEach(field=>{const label=field.querySelector(':scope>span')?.textContent||'';field.dataset.sourceLabel=label;if(field.querySelector('.source-filter-range')){const quick=field.querySelector('.quick-dates');if(quick)field.prepend(quick);field.classList.add('compact-stat-date');}});
    filter.querySelectorAll('.filter-actions button').forEach(b=>{if(b.textContent.trim()==='重置')b.querySelector('.button-icon')?.remove();if(b.textContent.trim()==='口径说明')b.classList.add('compact-stats-help');});
    if(group&&A.tenant==='bzds'){const field=node('div','field compact-stat-groups');field.append(node('span','','群'));['私域拓客问候','拓客自我介绍'].forEach(label=>field.append(node('span','compact-stat-group','✓ '+label)));filter.querySelector('[data-source-label="维度"]')?.after(field);}
   }
   const table=root.querySelector('#results table');if(!table)return;const columns=table.querySelectorAll('col'),widths=group?[60,220,140,110,120,200,...Array(Math.max(0,columns.length-8)).fill(160),110,100]:[60,257,204,166,166,229,100];
   const baseWidth=widths.reduce((sum,width)=>sum+width,0),tableWidth=Math.max(baseWidth,root.clientWidth-24);if(group&&tableWidth>baseWidth){const extra=tableWidth-baseWidth;const accountExtra=Math.round(extra*220/360);widths[1]+=accountExtra;widths[2]+=extra-accountExtra;}
   columns.forEach((col,index)=>col.style.width=widths[index]+'px');table.style.width=tableWidth+'px';
   table.querySelectorAll('tbody tr').forEach(row=>{if(row.dataset.compactStats)return;row.dataset.compactStats='true';const department=row.cells[2];if(department){const text=department.textContent;department.replaceChildren(node('span','compact-department-tag',text));}const columns=[5];columns.forEach(index=>{const cell=row.cells[index];if(!cell)return;const text=cell.textContent,track=node('span','compact-rate-track'),fill=node('i');const percent=Number(text.match(/[\d.]+/)?.[0])||0;fill.style.width=Math.min(100,percent)+'%';track.append(fill);cell.replaceChildren(track,node('span','',text));cell.classList.add('compact-rate-cell');});});
  };
  let scheduled=false;const observer=new MutationObserver(()=>{if(scheduled)return;scheduled=true;queueMicrotask(()=>{scheduled=false;observer.disconnect();enhance();observer.observe(root,{childList:true,subtree:true});});});enhance();observer.observe(root,{childList:true,subtree:true});return true;
 }
 V.render=()=>{
  if(['scriptUsageStats','groupInviteStats'].includes(A.route))return compactStats();
  if(A.route==='workAccountDailyStats'&&A.tenant==='bzds')return workAccount();
  if(A.route==='salesRakingStats')return ranking();
  if(A.route==='salesStats'&&A.tenant==='hqjd')return legacyDashboard();
  if(A.route!=='salesStatsNew')return render();
  root=node('div','page source-sales-dashboard');root.append(A.pageHead(),A.filterPanel());results=node('section','source-sales-results');root.append(results);$('app').replaceChildren(root);initialDateValues=[...root.querySelectorAll('.source-filter-range[data-filter-group="统计时间"] input[data-range-edge]')].map(input=>input.value);load();return true;
 };
 V.onQuery=()=>{if(A.route==='salesStatsNew'){draw();return;}if(A.route==='salesRakingStats'){drawRanking();return;}if(A.route==='salesStats'&&root?.classList.contains('source-legacy-dashboard')){normalizeLegacyFilters();drawLegacy();return;}onQuery?.();};
})();
