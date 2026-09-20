/* SPEC-SUIYIN-ADMIN-056@1.0.0: saved sales dashboard structure, without fabricated chart points. */
'use strict';
(()=>{
 const A=window.Admin,V=window.AdminViews,{node,button,$}=A,render=V.render,onQuery=V.onQuery;
 let data,root,results,sequence=0,dateDefaultsSynced=false,initialDateValues=[];
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
  const note=node('p','dashboard-source',`${data.state==='reference'?'参考样本 · '+sampleTenant:'本租户采样'} · ${data.from} 至 ${data.to}。图表逐点数据尚未采集。`);
  results.append(note);
  const grid=node('div','source-sales-grid');
  data.metrics.forEach(metric=>{
   const card=node('section','card source-sales-card'),header=node('header'),title=node('h2','section-title',metric.label);
   header.append(title);
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
    else {const tr=node('tr'),td=node('td','source-sales-empty','暂无数据');td.colSpan=t?.headers.length||3;tr.append(td);body.append(tr);}
    table.append(body);card.append(table);
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
 V.render=()=>{
  if(A.route!=='salesStatsNew')return render();
  root=node('div','page source-sales-dashboard');root.append(A.pageHead(),A.filterPanel());results=node('section','source-sales-results');root.append(results);$('app').replaceChildren(root);initialDateValues=[...root.querySelectorAll('.source-filter-range[data-filter-group="统计时间"] input[data-range-edge]')].map(input=>input.value);load();return true;
 };
 V.onQuery=()=>{if(A.route==='salesStatsNew'){draw();return;}onQuery?.();};
})();
