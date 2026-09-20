/* SPEC-SUIYIN-ADMIN-053@1.0.0 — saved tenant snapshots, no production requests. */
'use strict';
window.AdminSalesUsage=(()=>{
 const route='salesMessageUsage';
 function day(value=new Date()){const p=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date(value));return ['year','month','day'].map(k=>p.find(x=>x.type===k).value).join('-');}
 const offset=(date,n)=>new Date(Date.parse(date+'T12:00:00Z')+n*86400000).toISOString().slice(0,10);
 const validDate=value=>/^\d{4}-\d{2}-\d{2}$/.test(value)&&Number.isFinite(Date.parse(value+'T00:00:00Z'))&&new Date(value+'T00:00:00Z').toISOString().slice(0,10)===value;
 function validate(query){if(!validDate(query.start)||!validDate(query.end))return '请选择完整、有效的统计日期';if(query.start>query.end)return '开始日期不能晚于结束日期';return '';}
 function filterGroups(data,query){if(validate(query))throw Error(validate(query));if(data.state!=='captured'||query.start!==data.sampleDate||query.end!==data.sampleDate)return [];return data.groups.map(g=>({...g,departments:g.departments.filter(d=>!query.department||d.id===query.department)})).filter(g=>g.departments.length);}
 function totals(groups){return groups.reduce((s,g)=>{s.users++;for(const d of g.departments){s.messages+=d.messages;s.friends+=d.friends;}return s;},{users:0,messages:0,friends:0});}
 function csv(groups){const quote=v=>'"'+String(v).replace(/^[=+@-]/,"'$&").replaceAll('"','""')+'"';return '\ufeff'+[['#','销售','部门','消息数','聊天好友数'],...groups.flatMap((g,i)=>g.departments.map(d=>[i+1,g.sales,d.name,d.messages,d.friends]))].map(r=>r.map(quote).join(',')).join('\r\n');}
 function validateData(data,tenant){
  if(data.tenantId!==tenant||data.route!==route||!['captured','not-captured'].includes(data.state)||!Array.isArray(data.groups)||!Array.isArray(data.departmentOptions))throw Error('Invalid tenant snapshot');
  const ids=new Set(),departments=new Set(data.departmentOptions.map(d=>d.id));
  for(const g of data.groups){if(!g.id.startsWith(tenant+'-sale-')||ids.has(g.id)||!Array.isArray(g.departments)||!g.departments.length)throw Error('Invalid group');ids.add(g.id);for(const d of g.departments)if(!d.id.startsWith(tenant+'-dept-')||!departments.has(d.id)||!Number.isSafeInteger(d.messages)||d.messages<0||!Number.isSafeInteger(d.friends)||d.friends<0)throw Error('Invalid department');}
  if(data.state==='captured'&&!validDate(data.sampleDate))throw Error('Invalid sample date');
  if(data.state==='not-captured'&&(data.groups.length||data.departmentOptions.length))throw Error('Unexpected unsourced records');
  return data;
 }
 function render(){
  const A=window.Admin,{node,button}=A,root=node('div','page usage-page');A.$('app').replaceChildren(root);
  const permitted=window.AdminMenuState.visible(A.tenantInfo,window.AdminMenuState.read(A.tenantInfo,A.navStorageKey(A.tenant))).flatMap(g=>g.children||[g]).some(m=>m.route===route);
  if(!permitted){root.append(node('div','error-card','当前菜单不可见，请联系管理员检查菜单配置。'));return true;}
  let data=null,groups=[],mode='single',submitted=null,sortKey='',direction='none',busy=false,loadError=false;
  const params=new URLSearchParams(location.search);let failOnce=params.get('qa')==='1'&&params.get('usageState')==='error';
  const form=node('form','card filter-panel usage-filters');form.noValidate=true;
  const dateField=node('div','field usage-date-field');dateField.append(node('span','','统计时间'));
  const dates=node('div','usage-date-fields'),modes=node('div','usage-date-modes');modes.setAttribute('role','radiogroup');modes.setAttribute('aria-label','统计日期方式');
  for(const [value,text]of[['single','单日'],['range','范围']]){const label=node('label'),r=node('input');r.type='radio';r.name='usage-date-mode';r.value=value;r.checked=value===mode;r.onchange=()=>{if(!r.checked)return;mode=value;calendar?.close();if(mode==='single')end.value=start.value;else if(!validDate(end.value))end.value=validDate(start.value)?start.value:day();syncMode();};label.append(r,document.createTextNode(text));modes.append(label);}
  const dateBox=node('div','usage-date-control'),openDate=button('',()=>{}),start=node('input'),end=node('input'),to=node('span','usage-date-separator','至');
  openDate.dataset.dateOpen='';openDate.className='usage-date-open';openDate.setAttribute('aria-label','打开统计日期日历');openDate.innerHTML='<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M7 3v4m10-4v4M3 10h18" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>';
  for(const [input,label]of[[start,'开始日期'],[end,'结束日期']]){input.type='text';input.placeholder='YYYY-MM-DD';input.inputMode='numeric';input.maxLength=10;input.autocomplete='off';input.setAttribute('aria-label',label);input.setAttribute('aria-describedby','usage-date-error');}
  dateBox.append(openDate,start,to,end);
  const quick=node('div','quick-dates');['今天','昨天','前天'].forEach((text,i)=>{const b=button(text,()=>{calendar?.close();start.value=end.value=offset(day(),-i);markQuick();submit();});b.dataset.offset=String(-i);quick.append(b);});
  dates.append(modes,dateBox,quick);dateField.append(dates);form.append(dateField);
  const departmentField=node('label','field usage-department-field'),department=node('select');department.setAttribute('aria-label','部门');department.append(new Option('选择部门',''));departmentField.append(node('span','','部门'),A.searchableSelect(department,'部门'));form.append(departmentField);
  const actions=node('div','filter-actions'),search=button('搜索',()=>{},'primary'),reset=button('重置',resetAll),exportButton=button('导出',exportAll);search.type='submit';search.onclick=null;actions.append(search,reset,exportButton);form.append(actions);
  const error=node('p','filter-error');error.id='usage-date-error';error.hidden=true;error.setAttribute('role','alert');form.append(error);form.onsubmit=e=>{e.preventDefault();submit();};
  const results=node('section','usage-results');results.setAttribute('aria-live','polite');results.setAttribute('aria-label','销售使用统计结果');
  const source=node('p','usage-source');root.append(form,results,source);
  const calendar=window.AdminUsageDatePicker?.attach({host:dateBox,start,end,getMode:()=>mode,onChange:()=>{if(mode==='single')end.value=start.value;markQuick();}});
  start.addEventListener('input',()=>{if(mode==='single')end.value=start.value;markQuick();});end.addEventListener('input',markQuick);
  function syncMode(){to.hidden=end.hidden=mode!=='range';end.disabled=busy||mode!=='range';dateBox.classList.toggle('is-range',mode==='range');modes.querySelectorAll('input').forEach(r=>r.checked=r.value===mode);calendar?.refresh();markQuick();}
  function markQuick(){quick.querySelectorAll('button').forEach(b=>{const active=start.value===end.value&&start.value===offset(day(),Number(b.dataset.offset));b.classList.toggle('selected',active);b.setAttribute('aria-pressed',String(active));});}
  function setBusy(value){busy=value;form.querySelectorAll('button,input,select').forEach(c=>c.disabled=value);if(!value)syncMode();results.setAttribute('aria-busy',String(value));}
  function ordered(){if(!sortKey)return [...groups];return [...groups].sort((a,b)=>(totals([a])[sortKey]-totals([b])[sortKey])*(direction==='ascending'?1:-1)||a.order-b.order);}
  function summary(state){const header=node('div','usage-heading');header.append(node('h2','','销售碎银发送消息统计'));if(state==='success'||state==='empty'){const t=totals(groups);header.append(node('span','usage-summary','使用人数：'+t.users.toLocaleString('en-US')+' 人 · 合计：消息 '+t.messages.toLocaleString('en-US')+' 条 · 好友 '+t.friends.toLocaleString('en-US')+' 个'));}return header;}
  function state(){if(loadError)return 'error';if(!data)return 'loading';if(data.state==='not-captured')return 'not-captured';if(submitted.start!==data.sampleDate||submitted.end!==data.sampleDate)return 'no-snapshot';return groups.length?'success':'empty';}
  function draw(){
   const current=busy?'loading':state();results.dataset.state=current;results.replaceChildren(summary(current));exportButton.disabled=busy||current!=='success';
   if(current==='loading'){const message=node('div','usage-status','正在加载…');message.setAttribute('role','status');results.append(message);return;}
   if(current==='error'){const box=node('div','usage-status');box.append(node('p','','统计数据加载失败'),button('重试',load));results.append(box);return;}
   if(current==='not-captured'||current==='no-snapshot'){const box=node('div','usage-status');box.append(node('p','',current==='not-captured'?'本租户销售使用统计尚未采集':'所选日期尚无完整的本地样本'));
    box.append(node('p','usage-status-note',current==='not-captured'?'采集后展示本租户销售、部门和统计结果。':'目前仅保留 '+data.sampleDate+' 的样本；未采集的日期不能作为零使用统计。'));results.append(box);return;}
   const wrap=node('div','table-wrap usage-table-wrap'),table=node('table','usage-table'),cols=node('colgroup'),head=node('thead'),header=node('tr');
   const widths=['72px','234px','270px','212px','232px',''];widths.forEach(w=>{const col=node('col');if(w)col.style.width=w;cols.append(col);});
   const labels=['#','销售','部门','消息数','聊天好友数',''];labels.forEach((label,i)=>{const th=node('th',i===3||i===4?'usage-numeric':'',label);th.scope='col';if(i===3||i===4){const key=i===3?'messages':'friends';th.dataset.sort=key;th.tabIndex=0;th.setAttribute('aria-sort',sortKey===key?direction:'none');const indicators=node('span','usage-sort-arrows');indicators.setAttribute('aria-hidden','true');indicators.append(node('i','up'),node('i','down'));th.append(indicators);const toggle=()=>{if(busy)return;direction=sortKey===key&&direction==='ascending'?'descending':'ascending';sortKey=key;draw();results.querySelector('th[data-sort="'+key+'"]')?.focus();};th.onclick=toggle;th.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle();}};}header.append(th);});head.append(header);table.append(cols,head);
   const appendData=(row,label,messages,friends)=>{row.append(node('td','',label),node('td','usage-numeric',messages.toLocaleString('en-US')),node('td','usage-numeric',friends.toLocaleString('en-US')),node('td','usage-spacer',''));};
   ordered().forEach((g,index)=>{const body=node('tbody');body.dataset.salesId=g.id;const count=g.departments.length+(g.departments.length>1?1:0);g.departments.forEach((d,i)=>{const row=node('tr');row.dataset.departmentId=d.id;if(i===0){const rank=node('td','usage-group-cell',String(index+1)),sales=node('td','usage-group-cell',g.sales);rank.rowSpan=sales.rowSpan=count;row.append(rank,sales);}appendData(row,d.name,d.messages,d.friends);body.append(row);});if(g.departments.length>1){const subtotal=node('tr','usage-subtotal'),t=totals([g]);appendData(subtotal,'合计',t.messages,t.friends);body.append(subtotal);}table.append(body);});
   if(current==='success'){const foot=node('tfoot'),row=node('tr'),t=totals(groups);row.append(node('td','',''),node('td','',''));appendData(row,'合计',t.messages,t.friends);foot.append(row);table.append(foot);}else{const body=node('tbody'),row=node('tr'),cell=node('td','usage-empty','暂无数据');cell.colSpan=6;row.append(cell);body.append(row);table.append(body);}
   wrap.append(table);results.append(wrap);
  }
  function readQuery(){return {start:start.value.trim(),end:mode==='single'?start.value.trim():end.value.trim(),department:department.value};}
  async function submit(){if(busy||!data)return;const query=readQuery(),message=validate(query);error.hidden=!message;error.textContent=message;start.setAttribute('aria-invalid',String(!!message));end.setAttribute('aria-invalid',String(!!message));if(message)return;calendar?.close();submitted=query;setBusy(true);draw();await new Promise(r=>setTimeout(r,120));groups=filterGroups(data,submitted);setBusy(false);draw();}
  function resetAll(){if(busy||!data)return;calendar?.close();mode='single';sortKey='';direction='none';start.value=end.value=data.sampleDate||day();department.value='';department.dispatchEvent(new Event('change',{bubbles:true}));error.hidden=true;start.removeAttribute('aria-invalid');end.removeAttribute('aria-invalid');syncMode();submit();}
  function exportAll(){if(busy||state()!=='success')return;const rows=ordered(),blob=new Blob([csv(rows)],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob),a=node('a');a.href=url;a.download=A.tenant+'-销售使用统计-'+submitted.start+(submitted.end!==submitted.start?'_'+submitted.end:'')+'.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);A.toast('已导出 '+rows.reduce((n,g)=>n+g.departments.length,0)+' 条部门明细');}
  async function load(){
   setBusy(true);loadError=false;draw();
   try{if(failOnce){failOnce=false;throw Error('QA failure');}const response=await fetch('data/sales-usage/'+encodeURIComponent(A.tenant)+'.json');if(!response.ok)throw Error('Snapshot unavailable');data=validateData(await response.json(),A.tenant);
    department.replaceChildren(new Option('选择部门',''));for(const d of data.departmentOptions)department.append(new Option(d.name,d.id));department.title=data.departmentOptionsLabel||'仅含本租户样本部门';department.dispatchEvent(new Event('change',{bubbles:true}));
    if(!submitted){start.value=end.value=data.sampleDate||day();submitted=readQuery();}groups=filterGroups(data,submitted);
    source.textContent=data.state==='captured'?'样本日期：'+data.sampleDate+' · '+A.tenantInfo.name+' · 部门选项仅含样本中出现的部门':'本租户尚未采集统计样本';
   }catch{data=null;loadError=true;}
   finally{setBusy(false);draw();}
  }
  syncMode();load();return true;
 }
 const previous=window.AdminViews;if(window.Admin)window.AdminViews={...previous,render(){return window.Admin.route===route?render():previous?.render?.();}};
 return {day,validDate,validate,filterGroups,totals,csv,render};
})();
