/* SPEC-SUIYIN-ADMIN-058@1.2.0. Fixed synthetic samples; no billing requests. */
'use strict';
window.AdminAICostStats = (() => {
  const route='aiCostStats',sampleStart='2026-07-01',sampleEnd='2026-09-20';
  const projects=[
    {id:'label',name:'客户标签分析',note:'识别客户标签',modelKey:'insight'},
    {id:'profile',name:'客户画像分析',note:'整理客户画像',modelKey:'lens'},
    {id:'context',name:'AI上下文整理',note:'整理聊天上下文',modelKey:'lens'},
    {id:'progress',name:'沟通进度分析',note:'分析沟通与跟进情况',modelKey:'path'},
    {id:'assist',name:'AI辅助回复',note:'按使用触发的回复辅助',modelKey:'talk'}
  ];
  const catalog=[
    {id:'insight',brand:'星瞳',english:'StarInsight',purpose:'客户标签洞察模型'},
    {id:'lens',brand:'星鉴',english:'StarLens',purpose:'客户画像超智模型'},
    {id:'path',brand:'星程',english:'StarPath',purpose:'客户沟通进度分析模型'},
    {id:'talk',brand:'星语',english:'StarTalk',purpose:'图灵聊天辅助模型'}
  ];
  const formatter=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'});
  const day=(value=new Date())=>{const d=new Date(value);return Number.isFinite(+d)?formatter.format(d):'';};
  const offset=(date,n)=>new Date(Date.parse(date+'T12:00:00Z')+n*86400000).toISOString().slice(0,10);
  const dates=Array.from({length:82},(_,i)=>offset(sampleStart,i));
  const validDate=v=>/^\d{4}-\d{2}-\d{2}$/.test(v||'')&&Number.isFinite(Date.parse(v+'T00:00:00Z'))&&new Date(v+'T00:00:00Z').toISOString().slice(0,10)===v;
  function validate(q){if(!validDate(q.start)||!validDate(q.end))return '请选择完整、有效的统计日期';return q.start>q.end?'开始日期不能晚于结束日期':'';}
  function money(micros){if(micros>0&&micros<10000)return '小于0.01';return (micros/1000000).toLocaleString('zh-CN',{minimumFractionDigits:2,maximumFractionDigits:2});}
  function resolveModels(tenantId,page){
    // Standalone fixture callers use the verified naming map. The UI always supplies its own page.
    const source=page===undefined?(['yestar-sz','mengzhua','bzds'].includes(tenantId)?'captured':'reference'):page?.state;
    const rows=page?.tables?.[0]?.rows||[],headers=page?.tables?.[0]?.headers||[],nameIndex=headers.indexOf('模型名称');
    return Object.fromEntries(catalog.map(m=>{
      const generic='碎银·'+m.purpose;
      let fullName=tenantId==='yestar-sz'?m.brand+' ('+m.english+')·'+m.purpose:generic;
      if(page!==undefined){
        if(!page||page.tenant!==tenantId||!['captured','reference'].includes(source))return [m.id,null];
        const matches=rows.map(r=>r.cells?.[nameIndex]).filter(n=>n===generic||n?.includes('('+m.english+')'));
        if(matches.length!==1)return [m.id,null];fullName=matches[0];
      }
      return [m.id,{id:m.id,tenantId,name:fullName.includes(m.english)?m.brand+' '+m.english:fullName,fullName,purpose:m.purpose,version:null,source}];
    }));
  }
  function fixture(tenantId,scenario='',modelPage){
    const seed=[...tenantId].reduce((s,c)=>s+c.charCodeAt(0),0),models=resolveModels(tenantId,modelPage);
    const data={tenantId,coverageDates:[...dates],dataThrough:'2026-09-20 17:00（北京时间）',projectCoverageComplete:false,
      projects:projects.map(p=>({...p,state:'enabled',feeCoverage:'known',configuredModel:models[p.modelKey]})),events:[],charges:[]};
    const snapshots=Object.fromEntries(data.projects.map(p=>[p.id,p.configuredModel]));
    const model=project=>snapshots[project]?{...snapshots[project]}:null;
    const event=(taskId,project,at,status='succeeded')=>data.events.push({tenantId,taskId,project,at,status,model:model(project)});
    const charge=(id,taskId,project,at,amountMicros)=>data.charges.push({id,tenantId,taskId,project,at,amountMicros,currency:'CNY',basis:'demo_customer_fee',model:model(project)});
    dates.forEach((date,di)=>projects.forEach((p,pi)=>{
      // Keep the original three-day examples reproducible while extending prior months.
      const legacy=di>=79,li=di-79,weekday=new Date(date+'T12:00:00Z').getUTCDay();
      const weekly=[.76,.96,1.08,1.03,1.17,1.24,.87][weekday];
      const wave=1+.16*Math.sin((di+seed%19+pi*3)/6)+.10*Math.cos((di+pi)/2.7);
      const base=[25,16,12,20,30][pi],jitter=((seed+di*11+pi*17)%13)-6;
      const n=legacy?(li===0&&pi===2?0:8+(seed+li*5+pi*7)%24):Math.max(1,Math.round(base*weekly*wave*(.85+di/280)+jitter));
      for(let i=0;i<n;i++){
        const id=tenantId+'-'+p.id+'-'+date+'-'+i,at=date+'T10:'+String(i).padStart(2,'0')+':00+08:00';
        event(id,p.id,at);
        const micros=legacy?(12000+pi*14000+(i%4)*3500)*(1+li):(12000+pi*14000+(i%7)*3100)*(1+(di+pi)%3);
        charge(id+'-charge',id,p.id,at,micros);
        if(i===0){event(id,p.id,date+'T11:00:00+08:00');event(id,p.id,date+'T09:59:00+08:00','failed');}
      }
    }));
    const cross=tenantId+'-cross-day';event(cross,'context','2026-09-19T23:58:00+08:00','failed');event(cross,'context',sampleEnd+'T00:02:00+08:00');event(cross,'context',sampleEnd+'T00:03:00+08:00');
    charge(cross+'-a',cross,'context','2026-09-19T23:58:00+08:00',22000);charge(cross+'-b',cross,'context',sampleEnd+'T00:02:00+08:00',32000);
    const failed=tenantId+'-failed';event(failed,'assist',sampleEnd+'T12:00:00+08:00','failed');charge(failed+'-charge',failed,'assist',sampleEnd+'T12:00:00+08:00',13000);
    const pending=data.charges.find(c=>c.project==='assist'&&c.at.startsWith('2026-09-19'));if(pending)pending.amountMicros=null;
    if(scenario==='zero'){data.events=[];data.charges=[];}
    if(scenario==='unknown'){data.projects.forEach(p=>p.feeCoverage='unknown');data.charges.forEach(c=>c.amountMicros=null);}
    if(scenario==='supplier')data.charges.forEach(c=>c.basis='supplier_cost');
    if(scenario==='disabled'){data.projects.find(p=>p.id==='context').state='disabled';data.events=data.events.filter(e=>e.project!=='context');data.charges=data.charges.filter(c=>c.project!=='context');}
    if(scenario==='small'){data.charges=[];charge(tenantId+'-tiny','tiny','label',sampleEnd+'T12:00:00+08:00',1500);}
    if(scenario==='unclassified')charge(tenantId+'-other','other','unmapped',sampleEnd+'T12:00:00+08:00',250000);
    if(scenario==='unknown-count')event('','label',sampleEnd+'T12:00:00+08:00');
    if(scenario==='model-unknown')for(const r of [...data.events,...data.charges])r.model=null;
    if(scenario==='model-partial'){data.events.find(e=>e.project==='label'&&e.at.startsWith(sampleEnd)).model=null;}
    if(scenario==='model-multiple'){data.events.find(e=>e.project==='assist'&&e.at.startsWith(sampleEnd)).model={...models.lens};}
    return data;
  }
  const modelIdentity=m=>JSON.stringify([m.id,m.name,m.version??null,m.source,m.tenantId]);
  function blank(data){return {rows:data.projects.map(p=>({...p,count:0,countUnknown:false,amountMicros:0,feeUnknown:p.feeCoverage!=='known',knownCharges:0,unknownCharges:0,recordCount:0,models:[],modelUnknown:false})),unclassifiedCount:0,unclassifiedMicros:0,unclassifiedUnknown:false,unclassifiedKnownCharges:0,unclassifiedTaskCount:0,unclassifiedCountUnknown:false};}
  function prepare(data){
    const coverageDates=[...new Set(data.coverageDates)].sort(),coverage=new Set(coverageDates),daily=new Map(coverageDates.map(d=>[d,blank(data)]));
    const rowMaps=new Map([...daily].map(([d,b])=>[d,new Map(b.rows.map(r=>[r.id,r]))]));
    const first=new Map(),fees=new Map(),unidentified=[];
    function observe(row,record){
      if(!row)return;row.recordCount++;
      const m=record.model;if(!m?.id||!m.name||m.tenantId!==data.tenantId){row.modelUnknown=true;return;}
      if(!row.models.some(old=>modelIdentity(old)===modelIdentity(m)))row.models.push({...m});
    }
    for(const e of data.events){
      if(e.tenantId!==data.tenantId)continue;const date=day(e.at);if(!date)continue;
      if(coverage.has(date))observe(rowMaps.get(date).get(e.project),e);
      if(e.status!=='succeeded')continue;
      if(!e.taskId){if(coverage.has(date)){const row=rowMaps.get(date).get(e.project);if(row)row.countUnknown=true;else daily.get(date).unclassifiedCountUnknown=true;}continue;}
      const old=first.get(e.taskId);if(!old||Date.parse(e.at)<Date.parse(old.at))first.set(e.taskId,{...e,date});
    }
    for(const e of first.values()){if(!coverage.has(e.date))continue;const row=rowMaps.get(e.date).get(e.project);if(row)row.count++;else daily.get(e.date).unclassifiedTaskCount++;}
    for(const c of data.charges){
      if(c.tenantId!==data.tenantId)continue;const date=day(c.at);if(!date)continue;
      if(!c.id){unidentified.push({...c,date});continue;}
      const old=fees.get(c.id);if(!old||Date.parse(c.at)<Date.parse(old.at))fees.set(c.id,{...c,date});
    }
    for(const c of [...fees.values(),...unidentified]){
      if(!coverage.has(c.date))continue;const b=daily.get(c.date),row=rowMaps.get(c.date).get(c.project);
      const known=!!c.id&&c.currency==='CNY'&&c.basis==='demo_customer_fee'&&Number.isSafeInteger(c.amountMicros)&&c.amountMicros>=0;
      if(!row){b.unclassifiedCount++;if(known){b.unclassifiedMicros+=c.amountMicros;b.unclassifiedKnownCharges++;}else b.unclassifiedUnknown=true;continue;}
      observe(row,c);if(known){row.amountMicros+=c.amountMicros;row.knownCharges++;}else{row.feeUnknown=true;row.unknownCharges++;}
    }
    return {tenantId:data.tenantId,coverageDates,coverage,daily};
  }
  function aggregate(data,query,prepared=prepare(data)){
    const invalid=validate(query);if(invalid)throw Error(invalid);
    if(prepared.tenantId!==data.tenantId)throw Error('Tenant mismatch');
    const covered=prepared.coverageDates.filter(d=>d>=query.start&&d<=query.end),requestedDays=(Date.parse(query.end+'T00:00:00Z')-Date.parse(query.start+'T00:00:00Z'))/86400000+1;
    const summary=blank(data),rows=summary.rows,rowMap=new Map(rows.map(r=>[r.id,r]));
    for(const date of covered){const b=prepared.daily.get(date);
      for(const from of b.rows){const row=rowMap.get(from.id);for(const key of ['count','amountMicros','knownCharges','unknownCharges','recordCount'])row[key]+=from[key];for(const key of ['countUnknown','feeUnknown','modelUnknown'])row[key]||=from[key];for(const m of from.models)if(!row.models.some(old=>modelIdentity(old)===modelIdentity(m)))row.models.push({...m});}
      for(const key of ['unclassifiedCount','unclassifiedMicros','unclassifiedKnownCharges','unclassifiedTaskCount'])summary[key]+=b[key];
      for(const key of ['unclassifiedUnknown','unclassifiedCountUnknown'])summary[key]||=b[key];
    }
    const amountMicros=rows.reduce((s,r)=>s+r.amountMicros,0),count=rows.reduce((s,r)=>s+r.count,0),missingDates=[];
    if(requestedDays<=366)for(let date=query.start;date<=query.end;date=offset(date,1))if(!prepared.coverage.has(date))missingDates.push(date);
    return {...summary,count,amountMicros,covered,missingDates,missingDays:requestedDays-covered.length,countUnknown:rows.some(r=>r.countUnknown),unknownProjects:rows.filter(r=>r.feeUnknown).length,projectCoverageComplete:data.projectCoverageComplete,
      complete:covered.length===requestedDays&&data.projectCoverageComplete&&!rows.some(r=>r.feeUnknown||r.countUnknown)&&!summary.unclassifiedCount&&!summary.unclassifiedTaskCount&&!summary.unclassifiedCountUnknown};
  }
  function modelInfo(row){
    if(!row)return {models:[],pending:true,configured:false,note:'模型待确认'};
    if(row.recordCount)return {models:row.models,pending:row.modelUnknown,configured:false,note:row.modelUnknown?(row.models.length?'另有模型待确认':'模型待确认'):''};
    return {models:row.configuredModel?[row.configuredModel]:[],pending:!row.configuredModel,configured:true,note:row.configuredModel?'演示配置 · '+(row.state==='disabled'?'未启用':'当期无调用'):'模型待确认'};
  }
  function modelText(info){const names=info.models.map(m=>m.name+(m.version?' '+m.version:''));return [...names,info.note].filter(Boolean).join('；');}
  function trend(data,query,{metric='count',project='all',prepared=prepare(data)}={}){
    const invalid=validate(query);if(invalid)throw Error(invalid);if(prepared.tenantId!==data.tenantId)throw Error('Tenant mismatch');
    const days=(Date.parse(query.end+'T00:00:00Z')-Date.parse(query.start+'T00:00:00Z'))/86400000+1;
    const calendar=days<=366?Array.from({length:days},(_,i)=>offset(query.start,i)):[...new Set([query.start,...prepared.coverageDates.filter(d=>d>=query.start&&d<=query.end),query.end])].sort();
    const points=calendar.map(date=>{
      const daily=prepared.daily.get(date);if(!daily)return {date,state:'missing',value:null,model:null};
      const selected=daily.rows.filter(r=>project==='all'||r.id===project),info=project==='all'?null:modelInfo(selected[0]);
      const rows=selected.filter(r=>!(r.state==='disabled'&&!r.count&&!r.countUnknown&&!r.knownCharges&&!r.unknownCharges));
      if(!rows.length)return {date,state:'disabled',value:null,model:info};
      const unknown=rows.some(r=>metric==='fee'?r.feeUnknown:r.countUnknown),hasKnown=rows.some(r=>metric==='fee'?(!r.feeUnknown||r.knownCharges>0):(!r.countUnknown||r.count>0));
      const value=rows.reduce((s,r)=>s+(metric==='fee'?r.amountMicros:r.count),0);
      return {date,state:unknown?(hasKnown?'partial':'unknown'):'complete',value:hasKnown?value:null,model:info};
    });
    return {points,days,metric,project,start:query.start,end:query.end};
  }
  function render() {
    const A=window.Admin,{node,button}=A,params=new URLSearchParams(location.search),qa=params.get('qa')==='1';
    const scenario=qa?params.get('costState')||'':'';
    const root=node('div','page ai-cost-page');A.$('app').replaceChildren(root);
    const saved=window.AdminMenuState.read(A.tenantInfo,A.navStorageKey(A.tenant));
    const allowed=window.AdminMenuState.visible(A.tenantInfo,saved).flatMap(g=>g.children||[g]).some(m=>m.route===route);
    if(!allowed||scenario==='denied'){
      const box=node('section','error-card');box.setAttribute('role','status');box.append(node('h2','','无查看权限'),node('p','','当前菜单已隐藏或不在可见范围内，请联系管理员检查菜单配置。'));root.append(box);return true;
    }
    const data=fixture(A.tenant,scenario,A.allPages.aiEntModelConfig??null),prepared=prepare(data);
    let mode='single',busy=false,failed=false,failNext=scenario==='error',applied={start:day(),end:day()},result;
    let metric='count',project='all',chartObserver;
    const form=node('form','card filter-panel usage-filters ai-cost-filters');form.noValidate=true;
    const dateField=node('div','field usage-date-field');dateField.append(node('span','','统计时间'));
    const fields=node('div','usage-date-fields'),modes=node('div','usage-date-modes');modes.setAttribute('role','radiogroup');modes.setAttribute('aria-label','统计日期方式');
    for(const [value,title]of[['single','单日'],['range','范围']]){
      const label=node('label'),radio=node('input');radio.type='radio';radio.name='ai-cost-date-mode';radio.value=value;radio.checked=value===mode;
      radio.onchange=()=>{if(!radio.checked)return;calendar?.close();mode=value;if(mode==='single'||!validDate(end.value))end.value=start.value;syncMode();};
      label.append(radio,node('span','usage-mode-caption',title));modes.append(label);
    }
    const box=node('div','usage-date-control'),open=button('',()=>{}),start=node('input'),end=node('input'),separator=node('span','usage-date-separator','至');
    open.className='usage-date-open';open.dataset.dateOpen='';open.setAttribute('aria-label','打开统计日期日历');
    open.innerHTML='<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M7 3v4m10-4v4M3 10h18" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>';
    for(const [input,label]of[[start,'开始日期'],[end,'结束日期']]){input.type='text';input.inputMode='numeric';input.maxLength=10;input.autocomplete='off';input.placeholder='YYYY-MM-DD';input.value=day();input.setAttribute('aria-label',label);input.setAttribute('aria-describedby','ai-cost-date-error');}
    box.append(open,start,separator,end);
    const quick=node('div','quick-dates');['今天','昨天','前天'].forEach((title,i)=>{const b=button(title,()=>{calendar?.close();start.value=end.value=offset(day(),-i);markQuick();submit();});b.dataset.offset=-i;quick.append(b);});
    fields.append(modes,box,quick);dateField.append(fields);form.append(dateField);
    const actions=node('div','filter-actions'),search=button('搜索',()=>{},'primary'),reset=button('重置',resetAll);search.type='submit';search.onclick=null;reset.querySelector('.button-icon')?.remove();actions.append(search,reset);form.append(actions);
    const error=node('p','filter-error');error.id='ai-cost-date-error';error.hidden=true;error.setAttribute('role','alert');form.append(error);form.onsubmit=e=>{e.preventDefault();submit();};
    const section=node('section','ai-cost-results');section.setAttribute('aria-label','AI费用统计结果');section.setAttribute('aria-live','polite');
    const source=node('p','ai-cost-source','演示数据，费用口径待确认 · 样本日期 '+sampleStart+' 至 '+sampleEnd+'（82天） · '+A.tenantInfo.name);
    root.append(form,section,source);
    const calendar=window.AdminUsageDatePicker.attach({host:box,start,end,getMode:()=>mode,onChange:()=>{if(mode==='single')end.value=start.value;markQuick();}});
    start.addEventListener('input',()=>{if(mode==='single')end.value=start.value;markQuick();});end.addEventListener('input',markQuick);
    function syncMode(){separator.hidden=end.hidden=mode!=='range';end.disabled=busy||mode!=='range';box.classList.toggle('is-range',mode==='range');modes.querySelectorAll('input').forEach(r=>r.checked=r.value===mode);calendar.refresh();markQuick();}
    function markQuick(){quick.querySelectorAll('button').forEach(b=>{const yes=start.value===end.value&&start.value===offset(day(),Number(b.dataset.offset));b.classList.toggle('selected',yes);b.setAttribute('aria-pressed',String(yes));});}
    function readQuery(){return {start:start.value.trim(),end:mode==='single'?start.value.trim():end.value.trim()};}
    function setBusy(value){busy=value;form.querySelectorAll('button,input').forEach(c=>c.disabled=value);if(!value)syncMode();section.setAttribute('aria-busy',String(value));}
    function amountCell(row){
      const cell=node('td','ai-cost-number');
      if(row.state==='disabled'&&!row.amountMicros&&!row.feeUnknown){cell.append(node('span','ai-cost-muted','未启用'));return cell;}
      cell.append(node('span',row.feeUnknown&&!row.amountMicros?'ai-cost-pending':'',row.feeUnknown&&!row.amountMicros?'费用待确认':money(row.amountMicros)));
      if(row.feeUnknown&&row.amountMicros)cell.append(node('small','ai-cost-pending','已确认部分，另有费用待确认'));
      return cell;
    }
    function modelCell(row){
      const cell=node('td','ai-cost-model-cell'),info=modelInfo(row);cell.dataset.modelState=info.configured?'configured':info.pending?'pending':'recorded';
      for(const m of info.models){
        const item=node('div','ai-cost-model-item'),title=node('span','ai-cost-model-name',m.name+(m.version?' '+m.version:''));
        const tag=node('span','ai-cost-model-tag',m.source==='reference'?'演示配置':'专属模型');
        item.append(title,tag);
        if(m.name!==m.fullName)item.append(node('small','ai-cost-model-purpose',row.id==='context'?'用于AI上下文整理':m.purpose));
        cell.append(item);
      }
      if(info.note)cell.append(node('small',info.pending?'ai-cost-pending':'ai-cost-muted',info.note));
      return cell;
    }
    function createTrend(){
      const card=node('section','ai-cost-trend');card.setAttribute('aria-label','使用趋势');
      const header=node('div','ai-cost-trend-header'),title=node('h3','','使用趋势'),controls=node('div','ai-cost-trend-controls');
      const metrics=node('div','ai-cost-trend-metrics');metrics.setAttribute('role','group');metrics.setAttribute('aria-label','趋势指标');
      const metricButtons=[];
      for(const [id,label] of [['count','分析次数'],['fee','费用']]){
        const b=button(label,()=>{metric=id;drawPlot();});b.dataset.metric=id;metrics.append(b);metricButtons.push(b);
      }
      const category=node('label','ai-cost-trend-category'),select=node('select');select.setAttribute('aria-label','趋势类别');
      for(const p of [{id:'all',name:'全部已列项目'},...data.projects]){const opt=node('option','',p.name);opt.value=p.id;select.append(opt);}select.value=project;
      select.onchange=()=>{project=select.value;drawPlot();};category.append(node('span','','类别'),select);controls.append(metrics,category);header.append(title,controls);
      const caption=node('div','ai-cost-trend-caption'),seriesLabel=node('span','ai-cost-trend-series'),note=node('span','','类别仅影响图表，明细表保留全部类别');caption.append(seriesLabel,note);
      const plot=node('div','ai-cost-trend-plot'),foot=node('div','ai-cost-trend-foot'),hint=node('span','ai-cost-trend-hint');
      foot.innerHTML='<span class="ai-cost-trend-legend"><i></i>完整数据</span><span class="ai-cost-trend-legend is-partial"><i></i>已确认部分</span>';
      foot.append(hint);card.append(header,caption,plot,foot);
      let activeIndex=null;
      const svgNode=(tag,attrs={},text)=>{const el=document.createElementNS('http://www.w3.org/2000/svg',tag);Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,String(v)));if(text!==undefined)el.textContent=text;return el;};
      function drawPlot(){
        metricButtons.forEach(b=>{const yes=b.dataset.metric===metric;b.classList.toggle('selected',yes);b.setAttribute('aria-pressed',String(yes));});
        const s=trend(data,applied,{metric,project,prepared}),name=project==='all'?'全部已列项目':data.projects.find(p=>p.id===project).name;
        const unit=metric==='fee'?'元':'次',metricName=metric==='fee'?'费用':'分析次数';
        seriesLabel.textContent=name+' · '+metricName+'（'+unit+'）';
        if(project!=='all'){const info=modelInfo(result.rows.find(r=>r.id===project));seriesLabel.append(node('span','ai-cost-trend-model','专属模型：'+modelText(info)+(info.models.some(m=>m.source==='reference')?'（演示配置）':'')));}
        hint.textContent=s.days===1?'单日仅显示一个点，选择日期范围查看多日趋势':'缺数据不补零；可聚焦图表，用左右方向键逐日查看';
        plot.replaceChildren();plot.dataset.metric=metric;plot.dataset.project=project;plot.dataset.start=s.start;plot.dataset.end=s.end;
        const width=Math.max(260,plot.clientWidth||card.clientWidth||600),height=238,left=58,right=20,top=25,bottom=36,pw=width-left-right,ph=height-top-bottom;
        const svg=svgNode('svg',{viewBox:`0 0 ${width} ${height}`,width:'100%',height,role:'group','aria-label':name+' '+metricName+'，按天趋势'});
        const values=s.points.filter(p=>p.value!==null).map(p=>metric==='fee'?p.value/1000000:p.value),peak=Math.max(0,...values);
        const rough=(peak||1)/4,scale=10**Math.floor(Math.log10(rough)),step=Math.max(metric==='count'?1:0,[1,2,5,10].find(n=>n*scale>=rough)*scale),ceiling=Math.ceil((peak||1)/step)*step;
        const x=i=>s.days===1?left+pw/2:left+(i/(s.days-1))*pw;
        const index=date=>Math.round((Date.parse(date+'T00:00:00Z')-Date.parse(s.start+'T00:00:00Z'))/86400000);
        const y=p=>top+ph-(metric==='fee'?p.value/1000000:p.value)/ceiling*ph;
        for(let v=0;v<=ceiling+step/100;v+=step){const yy=top+ph-v/ceiling*ph;svg.append(svgNode('line',{x1:left,x2:width-right,y1:yy,y2:yy,class:'ai-cost-trend-grid'}),svgNode('text',{x:left-10,y:yy+4,'text-anchor':'end',class:'ai-cost-trend-axis'},v.toLocaleString('zh-CN',{maximumFractionDigits:8})));}
        svg.append(svgNode('text',{x:left-10,y:12,'text-anchor':'end',class:'ai-cost-trend-axis'},unit));
        const tickCount=Math.min(s.days,Math.max(2,Math.floor(pw/90))),ticks=new Set(Array.from({length:tickCount},(_,i)=>tickCount===1?0:Math.round(i*(s.days-1)/(tickCount-1))));
        for(const i of ticks){const date=offset(s.start,i),label=s.start.slice(0,4)===s.end.slice(0,4)?date.slice(5).replace('-','/'):date.replaceAll('-','/');svg.append(svgNode('text',{x:x(i),y:height-10,'text-anchor':i===0&&s.days>1?'start':i===s.days-1&&s.days>1?'end':'middle',class:'ai-cost-trend-axis'},label));}
        let segment=[];
        function flush(){if(segment.length>1)svg.append(svgNode('path',{d:segment.map((p,i)=>(i?'L':'M')+x(index(p.date))+','+y(p)).join(' '),class:'ai-cost-trend-line','data-dates':segment.map(p=>p.date).join(',')}));segment=[];}
        for(const p of s.points){if(p.state!=='complete'){flush();continue;}if(segment.length&&index(p.date)-index(segment.at(-1).date)!==1)flush();segment.push(p);}flush();
        for(const p of s.points){if(p.value===null)continue;svg.append(svgNode('circle',{cx:x(index(p.date)),cy:y(p),r:p.state==='partial'?5:s.days>30?2.5:4,class:'ai-cost-trend-point '+(p.state==='partial'?'is-partial':''),'data-date':p.date,'data-state':p.state,'data-value':p.value}));}
        const guide=svgNode('line',{y1:top,y2:top+ph,class:'ai-cost-trend-guide',visibility:'hidden'});svg.append(guide);
        const hit=svgNode('rect',{x:left,y:top,width:pw,height:ph,fill:'transparent',tabindex:0,role:'slider','aria-label':'趋势日期，左右方向键逐日查看，Home和End跳到首尾日期','aria-valuemin':0,'aria-valuemax':s.days-1,'aria-valuenow':0,class:'ai-cost-trend-hit'});svg.append(hit);
        const tooltip=node('div','ai-cost-trend-tooltip');tooltip.hidden=true;tooltip.id='ai-cost-trend-tooltip';tooltip.setAttribute('role','tooltip');hit.setAttribute('aria-describedby',tooltip.id);
        const byDate=new Map(s.points.map(p=>[p.date,p]));
        function describe(p){
          if(p.state==='missing')return '缺少演示样本，不代表零使用';
          if(p.state==='disabled')return '未启用，无历史记录';
          if(p.state==='unknown')return metricName+'待确认';
          const value=metric==='fee'?money(p.value):p.value.toLocaleString('zh-CN');
          return p.state==='partial'?'已确认部分 '+value+' '+unit+'，另有'+metricName+'待确认':value+' '+unit+' · 已列范围数据完整';
        }
        function show(i){
          activeIndex=Math.max(0,Math.min(s.days-1,i));const date=offset(s.start,activeIndex),p=byDate.get(date)||{date,state:'missing',value:null};
          guide.setAttribute('x1',x(activeIndex));guide.setAttribute('x2',x(activeIndex));guide.setAttribute('visibility','visible');
          const modelLabel=project==='all'?'多个专属模型':p.model?modelText(p.model)+(p.model.models.some(m=>m.source==='reference')?'（演示配置）':''):'模型信息暂无样本';
          tooltip.replaceChildren(node('strong','',date),node('div','',name+' · '+metricName),node('div','ai-cost-tooltip-model',modelLabel),node('div',p.state==='partial'?'ai-cost-pending':'',describe(p)));tooltip.dataset.date=date;tooltip.dataset.state=p.state;tooltip.hidden=false;
          tooltip.style.left=Math.max(4,Math.min(width-tooltip.offsetWidth-4,x(activeIndex)+12))+'px';tooltip.style.top='12px';
          hit.setAttribute('aria-valuenow',activeIndex);hit.setAttribute('aria-valuetext',date+'，'+name+'，'+metricName+'，'+modelLabel+'，'+describe(p));
        }
        function hide(){tooltip.hidden=true;guide.setAttribute('visibility','hidden');}
        hit.addEventListener('mousemove',e=>{const b=svg.getBoundingClientRect(),xx=(e.clientX-b.left)*width/b.width;show(s.days===1?0:Math.round((xx-left)/pw*(s.days-1)));});
        hit.addEventListener('mouseleave',()=>{if(document.activeElement!==hit)hide();});
        hit.addEventListener('focus',()=>show(activeIndex??0));hit.addEventListener('blur',hide);
        hit.addEventListener('keydown',e=>{const current=activeIndex??0;if(['ArrowLeft','ArrowRight','Home','End','Escape'].includes(e.key)){e.preventDefault();if(e.key==='Escape')hide();else show(e.key==='Home'?0:e.key==='End'?s.days-1:current+(e.key==='ArrowLeft'?-1:1));}});
        plot.append(svg,tooltip);
        if(!values.length){const empty=node('div','ai-cost-trend-empty',s.points.some(p=>p.state==='unknown')?metricName+'待确认':s.points.some(p=>p.state==='disabled')?'该类别未启用，暂无历史记录':'所选日期暂无演示样本');plot.append(empty);}
      }
      // Draw after mounting so labels and tooltip use the actual available width.
      let lastWidth=0;chartObserver=new ResizeObserver(()=>{if(!root.isConnected){chartObserver?.disconnect();return;}const w=plot.clientWidth;if(Math.abs(w-lastWidth)>1){lastWidth=w;drawPlot();}});chartObserver.observe(plot);
      return card;
    }
    function draw(){
      chartObserver?.disconnect();chartObserver=null;
      section.replaceChildren();section.dataset.state=busy?'loading':failed?'error':result?.covered.length?'success':'no-sample';
      const heading=node('div','ai-cost-heading'),h=node('h2','','AI费用统计'),badge=node('span','ai-cost-demo','演示数据');h.append(badge);
      heading.append(h,node('span','ai-cost-applied',applied.start+(applied.start===applied.end?'':' 至 '+applied.end)));section.append(heading);
      if(busy){section.append(node('div','ai-cost-status','正在统计…'));return;}
      if(failed){const box=node('div','ai-cost-status');box.setAttribute('role','alert');box.append(node('strong','','暂时无法加载，请重试'),button('重试',()=>run(applied)));section.append(box);return;}
      if(!result?.covered.length){const box=node('div','ai-cost-status');box.append(node('strong','','所选日期暂无本地演示样本'),node('p','','当前样本为'+sampleStart+'至'+sampleEnd+'，未覆盖日期不代表没有使用AI。'));section.append(box);return;}
      if(result.missingDays){
        section.dataset.state='partial';const coverage=node('p','ai-cost-coverage');coverage.dataset.coverage='partial';
        const missing=result.missingDates.length<=5&&result.missingDates.length?result.missingDates.join('、')+'缺少样本':result.missingDays+'天缺少样本';
        const spans=[];for(const date of result.covered){const last=spans.at(-1);if(last&&offset(last.end,1)===date)last.end=date;else spans.push({start:date,end:date});}
        coverage.textContent='已覆盖'+spans.map(s=>s.start+(s.start===s.end?'':' 至 '+s.end)).join('、')+'；'+missing+'。以下次数与费用仅为已覆盖部分。';section.append(coverage);
      }
      section.append(createTrend());
      const wrap=node('div','table-wrap ai-cost-table-wrap'),table=node('table','ai-cost-table'),cap=node('caption','sr-only','AI费用统计，金额单位人民币元'),cols=node('colgroup'),head=node('thead'),hr=node('tr'),body=node('tbody');
      ['25%','35%','16%','24%'].forEach(w=>{const c=node('col');c.style.width=w;cols.append(c);});
      ['分析项目','专属模型','分析次数','费用（元）'].forEach((s,i)=>{const th=node('th',i>1?'ai-cost-number':'',s);th.scope='col';hr.append(th);});head.append(hr);table.append(cap,cols,head);
      for(const row of result.rows){
        const tr=node('tr');tr.dataset.project=row.id;const name=node('td');name.append(node('span','ai-cost-project',row.name),node('small','ai-cost-muted',row.note));
        const count=node('td','ai-cost-number',row.countUnknown?'待确认':row.state==='disabled'&&!row.count?'未启用':row.count.toLocaleString('zh-CN'));count.dataset.count=String(row.count);
        tr.append(name,modelCell(row),count,amountCell(row));body.append(tr);
      }
      const foot=node('tfoot'),total=node('tr'),label=node('td','','已列项目合计'),count=node('td','ai-cost-number',result.countUnknown?'次数待确认':result.count.toLocaleString('zh-CN'));
      label.colSpan=2;
      if(result.missingDays)label.append(node('small','ai-cost-muted','仅已覆盖日期'));
      const cost=amountCell({amountMicros:result.amountMicros,feeUnknown:result.unknownProjects>0,state:'enabled'});cost.dataset.totalMicros=result.amountMicros;
      if(result.unknownProjects)cost.append(node('small','ai-cost-pending',result.unknownProjects+'项费用待确认'));
      total.append(label,count,cost);foot.append(total);table.append(body,foot);wrap.append(table);section.append(wrap);
      const notes=node('div','ai-cost-notes');
      const amounts=result.unknownProjects?(result.amountMicros?'已确认费用 '+money(result.amountMicros)+' 元，'+result.unknownProjects+' 项待确认。':'费用待确认。'):'已列项目费用 '+money(result.amountMicros)+' 元。';
      notes.append(node('p','',amounts+'其他AI项目的费用归属仍在核实，当前合计不代表全部AI费用。'));
      if(result.unclassifiedCount)notes.append(node('p','ai-cost-pending',(result.unclassifiedKnownCharges?'未归类费用'+(result.unclassifiedUnknown?'已确认部分':'')+'：'+money(result.unclassifiedMicros)+' 元'+(result.unclassifiedUnknown?'，另有金额待确认':''):'未归类费用待确认')+'，未重复计入上方项目。'));
      if(result.unclassifiedTaskCount||result.unclassifiedCountUnknown)notes.append(node('p','ai-cost-pending','未归类分析：'+(result.unclassifiedTaskCount?result.unclassifiedTaskCount+'次':'次数待确认')+(result.unclassifiedTaskCount&&result.unclassifiedCountUnknown?'，另有次数待确认':'')+'，尚未计入上方项目。'));
      notes.append(node('p','','分析次数按首次成功的独立分析计数；一次分析可能多次调用，费用不能直接按次数换算。'));
      notes.append(node('p','','金额为演示值，非客户实际扣费；最终计次和收费口径待确认。金额按完整精度汇总，显示四舍五入可能有微小差异。'));
      notes.append(node('p','','模型名称参考本租户AI模型管理，调用与费用均为合成演示数据；不代表历史实际使用。'));
      notes.append(node('p','ai-cost-muted','样本截至 '+data.dataThrough));section.append(notes);
      window.AdminTableSticky?.refresh();
    }
    async function run(query){
      if(busy)return;applied={...query};failed=false;result=null;setBusy(true);draw();
      await new Promise(resolve=>setTimeout(resolve,140));
      try{if(failNext){failNext=false;throw Error('synthetic failure');}result=aggregate(data,applied,prepared);}catch{failed=true;}finally{setBusy(false);draw();}
    }
    function submit(){if(busy)return;const query=readQuery(),message=validate(query);error.hidden=!message;error.textContent=message;start.setAttribute('aria-invalid',String(!!message));end.setAttribute('aria-invalid',String(!!message));if(message)return;calendar.close();run(query);}
    function resetAll(){if(busy)return;calendar.close();mode='single';metric='count';project='all';start.value=end.value=day();error.hidden=true;start.removeAttribute('aria-invalid');end.removeAttribute('aria-invalid');syncMode();run(readQuery());}
    syncMode();run(applied);return true;
  }
  const previous=window.AdminViews;
  if(window.Admin)window.AdminViews={...previous,render(){return window.Admin.route===route?render():previous?.render?.();}};
  return {projects,sampleStart,sampleEnd,day,offset,validDate,validate,money,resolveModels,fixture,prepare,aggregate,modelInfo,modelText,trend,render};
})();
