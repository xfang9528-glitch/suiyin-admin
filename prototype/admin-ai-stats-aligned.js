/* AI statistics: source layout, isolated tenant snapshots, SPEC-009 formulas. */
'use strict';
window.AdminAiStatsAligned=(()=>{
 const route='aiAssistStats';
 const day=()=>new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
 const offset=(d,n)=>new Date(Date.parse(d+'T12:00:00Z')+n*86400000).toISOString().slice(0,10);
 const valid=d=>/^\d{4}-\d\d-\d\d$/.test(d)&&Number.isFinite(Date.parse(d+'T00:00:00Z'))&&new Date(d+'T00:00:00Z').toISOString().slice(0,10)===d;
 const assisted=r=>r.direct+r.reference;
 const ratio=r=>{const n=assisted(r)+r.manual;return n?assisted(r)/n*100:null;};
 function validateData(data,tenant){
  if(data.tenant!==tenant||data.route!==route||!['captured','partial','not-captured'].includes(data.state)||!Array.isArray(data.rows))throw Error('统计样本租户不一致');
  if(data.state!=='not-captured'&&(!valid(data.start)||!valid(data.end)||data.start>data.end))throw Error('统计样本日期无效');
  const ids=new Set();for(const r of data.rows){if(!r.id.startsWith(tenant+':')||ids.has(r.id)||!Array.isArray(r.departments)||![r.direct,r.reference,r.manual,r.success].every(n=>Number.isSafeInteger(n)&&n>=0))throw Error('统计样本无效');ids.add(r.id);}
  if(data.state==='not-captured'&&data.rows.length)throw Error('未采集租户不能带入参考数据');return data;
 }
 function render(){
  const A=window.Admin,{node}=A,root=node('div','page ai-parity-page');A.$('app').replaceChildren(root);
  const visible=window.AdminMenuState.visible(A.tenantInfo,window.AdminMenuState.read(A.tenantInfo,A.navStorageKey(A.tenant))).flatMap(g=>g.children||[g]).some(m=>m.route===route);
  if(!visible){root.append(node('div','error-card','当前菜单不可见，请联系管理员检查菜单配置。'));return true;}
  const button=(label,fn,cls='')=>{const b=node('button',cls,label);b.type='button';b.onclick=fn;return b;};
  let data=null,busy=false,failed=false,query=null,dimension='account',sort='assisted',direction=-1;
  const scroll=node('div','ai-filter-scroll'),form=node('form','ai-filters');form.noValidate=true;scroll.append(form);
  const quick=node('div','ai-segment ai-quick-dates');
  for(const label of ['今天','昨天','本周','本月']){const b=button(label,()=>{const endDate=day();start.value=label==='今天'?endDate:label==='昨天'?offset(endDate,-1):label==='本月'?endDate.slice(0,8)+'01':offset(endDate,-((new Date(endDate+'T12:00:00Z').getUTCDay()+6)%7));end.value=label==='昨天'?start.value:endDate;markQuick();submit();});b.dataset.quick=label;quick.append(b);}
  const dates=node('div','ai-date-range'),calendarButton=button('',()=>{}),start=node('input'),end=node('input');
  calendarButton.className='ai-calendar-open';calendarButton.setAttribute('aria-label','打开统计日期日历');calendarButton.dataset.dateOpen='';calendarButton.innerHTML='<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M7 3v4m10-4v4M3 10h18" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>';
  for(const [i,label]of[[start,'开始日期'],[end,'结束日期']]){i.type='text';i.placeholder=label;i.setAttribute('aria-label',label);i.maxLength=10;i.autocomplete='off';i.oninput=markQuick;}
  dates.append(calendarButton,start,node('span','','至'),end);
  const dimensionField=node('div','ai-filter-field'),segments=node('div','ai-segment ai-dimensions');dimensionField.append(node('span','','维度'),segments);
  for(const [value,label]of[['account','按销售账号'],['dept','按部门']]){const b=button(label,()=>{dimension=value;markDimension();submit();});b.dataset.dimension=value;segments.append(b);}
  const departmentField=node('label','ai-filter-field ai-department'),department=node('select');department.setAttribute('aria-label','部门');department.append(new Option('全部部门',''));departmentField.append(node('span','','部门'),A.searchableSelect(department,'部门'));
  const keyword=node('input','ai-keyword');keyword.type='search';keyword.placeholder='销售账号 / 姓名';keyword.setAttribute('aria-label','销售账号 / 姓名');
  const search=button('搜索',()=>{},'ai-search'),reset=button('重置',resetAll,'ai-reset'),help=button('口径说明',explain,'ai-help');search.type='submit';search.onclick=null;search.prepend(node('span','ai-search-icon'));help.prepend(node('span','ai-info-icon','i'));
  form.append(quick,dates,dimensionField,departmentField,keyword,search,reset,help);form.onsubmit=e=>{e.preventDefault();submit();};
  const error=node('p','ai-validation');error.hidden=true;error.setAttribute('role','alert');
  const results=node('section','ai-result-surface');results.setAttribute('aria-live','polite');const source=node('p','ai-snapshot-note');root.append(scroll,error,results,source);
  const calendar=window.AdminUsageDatePicker?.attach({host:dates,start,end,getMode:()=> 'range',onChange:markQuick});
  function markQuick(){const today=day(),monday=offset(today,-((new Date(today+'T12:00:00Z').getUTCDay()+6)%7));quick.querySelectorAll('button').forEach(b=>{const label=b.dataset.quick;const active=label==='今天'?start.value===today&&end.value===today:label==='昨天'?start.value===offset(today,-1)&&end.value===start.value:label==='本周'?start.value===monday&&end.value===today:start.value===today.slice(0,8)+'01'&&end.value===today;b.classList.toggle('is-active',active);b.setAttribute('aria-pressed',String(active));});}
  function markDimension(){segments.querySelectorAll('button').forEach(b=>{b.classList.toggle('is-active',b.dataset.dimension===dimension);b.setAttribute('aria-pressed',String(b.dataset.dimension===dimension));});keyword.hidden=dimension!=='account';}
  function setBusy(value){busy=value;form.querySelectorAll('button,input,select').forEach(c=>c.disabled=value);results.setAttribute('aria-busy',String(value));}
  function readQuery(){return {start:start.value.trim(),end:end.value.trim(),department:department.value,keyword:dimension==='account'?keyword.value.trim().toLocaleLowerCase():'',dimension};}
  function filtered(){return data.rows.filter(r=>(!query.department||r.departments.includes(query.department))&&(!query.keyword||r.name.toLocaleLowerCase().includes(query.keyword)));}
  function rows(){const selected=filtered();if(query.dimension==='dept'){const groups=new Map();for(const r of selected){const name=r.departments[0]||'未分组';let g=groups.get(name);if(!g){g={id:A.tenant+':dept:'+name,name,departments:[name],accounts:0,direct:0,reference:0,manual:0,success:0,order:groups.size};groups.set(name,g);}g.accounts++;for(const key of ['direct','reference','manual','success'])g[key]+=r[key];}return [...groups.values()];}return selected;}
  function currentState(){if(busy)return 'loading';if(failed)return 'error';if(!data)return 'loading';if(data.state==='not-captured')return 'not-captured';if(query.start!==data.start||query.end!==data.end)return 'no-snapshot';if(query.dimension==='dept'&&data.rows.some(r=>r.departments.length>1)&&!data.departmentAllocationComplete)return 'department-not-captured';return 'ready';}
  function stateMessage(state){return {'loading':'正在加载…','not-captured':'本租户 AI 辅助统计尚未采集','no-snapshot':'所选日期尚无本租户统计样本','department-not-captured':'本租户部门维度统计尚未采集','error':'统计数据加载失败'}[state];}
  function draw(){
   const state=currentState();results.dataset.state=state;results.replaceChildren();source.hidden=true;
   if(state!=='ready'){const box=node('div','ai-state',stateMessage(state));if(state==='error')box.append(button('重试',load));results.append(box);if(state==='no-snapshot'||state==='department-not-captured'){const note=node('p','ai-state-note',state==='no-snapshot'?'本地保存的日期为 '+data.start+' 至 '+data.end+'。':'账号所属多个部门时，不能用账号汇总值推断各部门消息数。');box.append(note);}return;}
   const table=node('table','ai-table'),cols=node('colgroup');[60,200,150,120,120,120,130,170,140].forEach(width=>{const c=node('col');c.style.width=width+'px';cols.append(c);});table.append(cols);
   const head=node('thead'),tr=node('tr'),labels=query.dimension==='dept'?['#','部门','账号数','AI直发','AI参考','手动文本','AI辅助合计','AI辅助率','成功消息总数']:['#','销售账号','所属部门','AI直发','AI参考','手动文本','AI辅助合计','AI辅助率','成功消息总数'];
   labels.forEach((label,index)=>{const th=node('th',index>=3?'ai-centered':'',label);th.scope='col';if(index>=3){const key=['direct','reference','manual','assisted','ratio','success'][index-3];th.dataset.sort=key;th.tabIndex=0;th.setAttribute('aria-sort',sort===key?(direction===1?'ascending':'descending'):'none');const arrows=node('span','ai-sort-arrows');arrows.append(node('i','up'),node('i','down'));th.append(arrows);const change=()=>{direction=sort===key?-direction:-1;sort=key;draw();};th.onclick=change;th.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();change();}};}tr.append(th);});head.append(tr);table.append(head);
   const value=(r,key)=>key==='assisted'?assisted(r):key==='ratio'?(ratio(r)??-1):r[key];
   const ordered=rows().sort((a,b)=>(value(a,sort)-value(b,sort))*direction||a.order-b.order),body=node('tbody');
   for(const [index,r]of ordered.entries()){
    const row=node('tr');row.dataset.record=r.id;row.append(node('td','',String(index+1)),node('td','ai-sales-name',r.name));const dept=node('td','ai-dept-cell');if(query.dimension==='dept')dept.textContent=String(r.accounts);else dept.append(node('span','ai-dept-tag',r.departments.join(',')));row.append(dept,node('td','ai-centered ai-direct',String(r.direct)),node('td','ai-centered ai-reference',String(r.reference)),node('td','ai-centered',String(r.manual)),node('td','ai-centered ai-assist-total',assisted(r)+' 条'));
    const percentage=ratio(r),rate=node('td','ai-centered'),meter=node('div','ai-rate'),track=node('span','ai-rate-track'),fill=node('span','ai-rate-fill');fill.style.width=Math.min(100,percentage??0)+'%';track.append(fill);track.setAttribute('aria-hidden','true');meter.append(track,node('span','ai-rate-number',percentage===null?'—':percentage.toFixed(1)+'%'));rate.append(meter);row.append(rate,node('td','ai-centered ai-success',String(r.success)));body.append(row);
   }
   if(!ordered.length){const row=node('tr'),cell=node('td','ai-empty','暂无数据');cell.colSpan=9;row.append(cell);body.append(row);}table.append(body);const wrap=node('div','ai-table-scroll');wrap.append(table);results.append(wrap);
   source.hidden=false;source.textContent=data.state==='partial'?'截图样本：'+data.start+' 至 '+data.end+' · 仅已确认的 '+data.rows.length+' 条可见记录，非完整统计。':'本租户采样：'+data.start+' 至 '+data.end;source.dataset.source=data.source;
  }
  function submit(){if(busy||!data)return;const next=readQuery();let message='';if(!valid(next.start)||!valid(next.end))message='请选择完整、有效的统计日期';else if(next.start>next.end)message='开始日期不能晚于结束日期';error.textContent=message;error.hidden=!message;start.setAttribute('aria-invalid',String(!!message));end.setAttribute('aria-invalid',String(!!message));if(message)return;calendar?.close();query=next;draw();}
  function resetAll(){if(!data||busy)return;dimension='account';keyword.value='';department.value='';department.dispatchEvent(new Event('change',{bubbles:true}));start.value=data.start||day().slice(0,8)+'01';end.value=data.end||day();sort='assisted';direction=-1;markDimension();markQuick();submit();}
  function explain(){const box=node('div','ai-explanation');box.append(node('p','','AI辅助合计 = AI直发 + AI参考。'),node('p','','AI辅助率 = AI辅助合计 ÷（AI直发 + AI参考 + 手动文本）。分母为 0 时显示“—”。'),node('p','','仅统计发送成功并带来源标记的销售单聊文本。成功消息总数另列，不作为 AI 辅助率分母。'),node('p','','页面展示当前租户本地采样，未采集日期与部门维度不能当作零数据。'));A.showDialog('统计口径',box,[{label:'关闭',run:A.closeDialog}]);}
  async function load(){setBusy(true);failed=false;draw();try{const response=await fetch('data/ai-stats/'+encodeURIComponent(A.tenant)+'.json');if(!response.ok)throw Error('snapshot');data=validateData(await response.json(),A.tenant);department.replaceChildren(new Option('全部部门',''));for(const name of [...new Set(data.rows.flatMap(r=>r.departments))])department.append(new Option(name,name));department.dispatchEvent(new Event('change',{bubbles:true}));start.value=data.start||day().slice(0,8)+'01';end.value=data.end||day();query=readQuery();}catch{failed=true;}finally{setBusy(false);markQuick();markDimension();draw();}}
  markDimension();load();return true;
 }
 const previous=window.AdminViews;if(window.Admin)window.AdminViews={...previous,render(){return window.Admin.route===route?render():previous?.render?.();}};
 return {render,ratio,assisted,validateData};
})();
