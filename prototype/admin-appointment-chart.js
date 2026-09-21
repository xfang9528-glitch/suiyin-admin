/* SPEC-SUIYIN-ADMIN-062@1.0.0 — local appointment records and their shared chart. */
'use strict';
window.AdminAppointmentChart = (() => {
  const A = window.Admin, V = window.AdminViews;
  const {node, button} = A;
  const route = 'appointmentRecords';
  const tenants = new Set(['yestar-sz', 'yestar-gz', 'yestar-hz', 'yestar-jx']);
  const dayMs = 86400000;
  const shanghai = new Intl.DateTimeFormat('en-CA', {timeZone:'Asia/Shanghai', year:'numeric', month:'2-digit', day:'2-digit'});
  function validDay(value) {
    return /^\d{4}-\d{2}-\d{2}$/.test(value || '') && Number.isFinite(Date.parse(value+'T00:00:00Z')) && new Date(value+'T00:00:00Z').toISOString().slice(0,10) === value;
  }
  function dateOf(value) {
    const text = String(value || '').trim();
    if (!validDay(text.slice(0,10))) return '';
    if (text.length === 10) return text;
    const local = /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(:\d{2})?$/.test(text);
    if (local) {
      const parts = text.slice(11).split(':').map(Number);
      return parts[0] < 24 && parts[1] < 60 && (parts[2] || 0) < 60 ? text.slice(0,10) : '';
    }
    const instant = new Date(text);
    return /(?:Z|[+-]\d{2}:\d{2})$/.test(text) && Number.isFinite(+instant) ? shanghai.format(instant) : '';
  }
  const offset = (date, n) => new Date(Date.parse(date+'T00:00:00Z')+n*dayMs).toISOString().slice(0,10);
  const fields = {customer:'客户', start:'预约日期：开始日期', end:'预约日期：结束日期', project:'项目', department:'科室', doctor:'医生', campus:'院区', creator:'创建人', createdStart:'创建时间：开始日期', createdEnd:'创建时间：结束日期', creatorDepartment:'创建人部门'};
  function validate(filters) {
    for (const [start, end, label] of [[fields.start,fields.end,'预约日期'],[fields.createdStart,fields.createdEnd,'创建时间']]) {
      const a = filters[start] || '', b = filters[end] || '';
      if (!a && !b) continue;
      if (!validDay(a) || !validDay(b)) return {field:!validDay(a)?start:end, message:label+'请填写完整有效的开始、结束日期'};
      if (a > b) return {field:start, message:label+'的开始日期不能晚于结束日期'};
    }
    return null;
  }
  function records(table, tenant) {
    const seen = new Set(), headers = table.headers;
    return table.rows.flatMap(row => {
      if ((row.tenant || row.extra?.tenant) && (row.tenant || row.extra?.tenant) !== tenant) return [];
      const id = String(row.appointmentId || row.extra?.appointmentId || row.id || '');
      if (!id || seen.has(tenant+':'+id)) return [];
      seen.add(tenant+':'+id);
      const cell = name => row.cells[headers.indexOf(name)] || '';
      const combined = cell('科室 / 医生').split(/\s*\/\s*/);
      return [{id, tenant, row, customer:cell('客户姓名'), phone:cell('手机号'), project:cell('预约项目'),
        department:combined[0] === '-' ? '' : combined[0], doctor:combined[1] || '', campus:cell('院区'),
        day:dateOf(cell('预约时间')), createdDay:dateOf(cell('创建时间')), creator:cell('创建人'),
        creatorId:String(row.creatorId || row.extra?.creatorId || ''), creatorDepartment:row.extra?.['创建人当前部门'] || ''}];
    });
  }
  function select(records, filters) {
    const contains = (a,b) => String(a || '').toLocaleLowerCase().includes(String(b).toLocaleLowerCase());
    return records.filter(r => {
      for (const [key,value] of Object.entries(filters)) {
        if (!value) continue;
        if (key === fields.customer && !contains(r.customer+' '+r.phone,value)) return false;
        if (key === fields.creator && !contains(r.creator+' '+r.creatorId,value)) return false;
        for (const prop of ['project','department','doctor','campus','creatorDepartment']) if (key === fields[prop] && r[prop] !== value) return false;
        if (key === fields.start && (!r.day || r.day < value)) return false;
        if (key === fields.end && (!r.day || r.day > value)) return false;
        if (key === fields.createdStart && (!r.createdDay || r.createdDay < value)) return false;
        if (key === fields.createdEnd && (!r.createdDay || r.createdDay > value)) return false;
      }
      return true;
    });
  }
  function aggregate(rows, filters = {}, complete = true) {
    const counts = new Map(); let missing = 0;
    rows.forEach(r => r.day ? counts.set(r.day,(counts.get(r.day)||0)+1) : missing++);
    const dates = [...counts.keys()].sort();
    const start = filters[fields.start] || dates[0], end = filters[fields.end] || dates.at(-1);
    let cumulative = 0;
    const length = start && end ? Math.round((Date.parse(end+'T00:00:00Z')-Date.parse(start+'T00:00:00Z'))/dayMs)+1 : 0;
    // Counts are sparse; the view expands the requested dates, retaining explicit unknown days.
    const points = [];
    for (const [date, count] of [...counts].sort(([a],[b])=>a.localeCompare(b))) {
      cumulative += count; points.push({date,count,cumulative});
    }
    return {total:rows.length, missing, start, end, length, complete, points};
  }
  function series(result, from = 0, size = result.length) {
    const lookup = new Map(result.points.map(p=>[p.date,p]));
    const startDate = result.start ? offset(result.start,from) : '';
    let cumulative = result.points.filter(p=>p.date < startDate).at(-1)?.cumulative || 0;
    return Array.from({length:Math.max(0,Math.min(size,result.length-from))},(_,i)=>{
      const date = offset(result.start,from+i), found = lookup.get(date);
      if (found) cumulative = found.cumulative;
      return {date,count:found?.count ?? (result.complete?0:null),cumulative,known:!!found || result.complete};
    });
  }
  function fixture(tenant, table, scenario = '') {
    const cities = {'yestar-sz':'深圳','yestar-gz':'广州','yestar-hz':'杭州','yestar-jx':'嘉兴'};
    const city = cities[tenant], rows = [];
    const projects = ['眼部整形','注射填充','紧致抗衰','祛斑淡斑','鼻部整形'];
    let serial = 0;
    for (let d=0; d<42; d++) {
      const count = [5,16,31].includes(d) ? 0 : 4+(d*7+Math.floor(d/7)*3)%13;
      for (let i=0;i<count;i++) {
        serial++;
        const project = projects[(d+i)%5], department = ['整形医生','注射医生','皮肤医生','皮肤医生','整形医生'][(d+i)%5];
        const cells = {'客户姓名':'演示客户 '+String(serial).padStart(3,'0'),'手机号':'138****'+String(serial).padStart(4,'0'),
          '预约项目':project,'科室 / 医生':department+' / 演示医生'+['甲','乙','丙'][i%3], '院区':city+'艺星',
          '预约时间':offset('2026-09-01',d)+' '+String(9+i%10).padStart(2,'0')+':00',
          '创建人':'演示顾问'+['甲','乙','丙','丁'][i%4], '创建时间':offset('2026-09-01',d-2-i%6)+' 11:30:00','操作':'查看'};
        rows.push({id:'demo-'+tenant+'-'+serial,tenant,appointmentId:'demo-'+tenant+'-'+serial,creatorId:'demo-advisor-'+i%4,
          cells:table.headers.map(h=>cells[h] || ''),actions:['查看'],extra:{'创建人当前部门':i%2?'演示咨询二组':'演示咨询一组'}});
      }
    }
    if (scenario === 'zero') rows.length = 0;
    if (scenario === 'missing') rows.slice(0,3).forEach(r=>r.cells[table.headers.indexOf('预约时间')] = '');
    return {...table,rows};
  }

  let initialized = false, data = [], matched = [], applied = {}, mode = 'list', panel, root, resultHost, chartHost, notice, tabs, tooltip;
  let complete = false, reference = false, pending = false, revision = 0, scenario = '';
  function params() {
    const value = new URLSearchParams(location.search);
    // Resolve the parent origin without confusing the standalone builder's location.origin rewrite.
    try { if (parent !== window && new URL(parent.location.href).origin === location.origin) for (const [k,v] of new URLSearchParams(parent.location.search)) if (!value.has(k)) value.set(k,v); } catch {}
    return value;
  }
  function readFilters() {
    return Object.fromEntries([...panel.querySelectorAll('[data-filter]')].map(input=>[input.dataset.filter,input.value.trim()]));
  }
  function dirty() {
    notice.hidden = JSON.stringify(readFilters()) === JSON.stringify(applied);
    dismissTip();
  }
  function dismissTip() { if (tooltip) tooltip.hidden = true; }
  function prepareFilters() {
    panel = A.filterPanel();
    panel.classList.add('appt-filters');
    const creator = panel.querySelector('[data-filter="创建人 ID"]');
    if (creator) { creator.dataset.filter=fields.creator; creator.setAttribute('aria-label',fields.creator); creator.placeholder='输入姓名或 ID 搜索'; creator.closest('.field').querySelector(':scope > span').textContent=fields.creator; }
    for (const [prop,label] of Object.entries(fields)) {
      const input = [...panel.querySelectorAll('[data-filter]')].find(i=>i.dataset.filter===label);
      if (!input || !['project','department','doctor','campus','creatorDepartment'].includes(prop)) continue;
      const values = [...new Set(data.map(r=>r[prop]).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'zh-CN'));
      // Explicitly synthetic values belong only to the isolated demonstration dataset.
      if (complete && input.tagName === 'SELECT') {
        input.replaceChildren(new Option('请选择',''),...values.map(v=>new Option(v,v)));
        input.dispatchEvent(new Event('change',{bubbles:true}));
      }
    }
    const dep = [...panel.querySelectorAll('[data-filter]')].find(i=>i.dataset.filter===fields.creatorDepartment);
    if (dep) {
      const help=node('span','appt-department-help','按创建人当前部门筛选；调岗或人设分组变化会影响历史记录归属');
      dep.closest('.field').after(help);
    }
    panel.onsubmit = event => {event.preventDefault(); submit();};
    for (const b of panel.querySelectorAll('button')) if (b.textContent.trim()==='重置') b.onclick = reset;
    panel.addEventListener('input',dirty); panel.addEventListener('change',dirty);
    return panel;
  }
  function setBusy(value) {
    pending = value;
    resultHost.setAttribute('aria-busy',String(value)); chartHost.setAttribute('aria-busy',String(value));
    panel.querySelectorAll('.filter-actions button').forEach(b=>b.disabled=value);
    root.classList.toggle('appt-busy',value);
  }
  function submit() {
    if (pending) return;
    const candidate = readFilters(), error = validate(candidate), message = panel.querySelector('.filter-error');
    panel.querySelectorAll('[aria-invalid]').forEach(i=>i.removeAttribute('aria-invalid'));
    message.hidden = !error;
    if (error) {
      message.textContent=error.message;
      const field=[...panel.querySelectorAll('[data-filter]')].find(i=>i.dataset.filter===error.field);
      field?.setAttribute('aria-invalid','true'); field?.focus(); return;
    }
    window.AdminControls?.close(); window.AdminFilterCalendars?.close(); dismissTip();
    setBusy(true); const job=++revision;
    requestAnimationFrame(()=>setTimeout(()=>{
      if (job !== revision) return;
      applied=candidate; matched=select(data,applied);
      A.setTable(0); drawChart(); setBusy(false); dirty();
    },80));
  }
  function reset() {
    if (pending) return;
    window.AdminControls?.close(); window.AdminFilterCalendars?.close();
    panel.querySelectorAll('[data-filter]').forEach(input=>{input.value='';input.dispatchEvent(new Event('change',{bubbles:true}));});
    submit();
  }
  function switchView(next) {
    mode=next; dismissTip();
    resultHost.hidden=mode!=='list'; chartHost.hidden=mode!=='chart';
    for (const b of tabs.querySelectorAll('button')) { const active=b.dataset.view===mode; b.classList.toggle('selected',active); b.setAttribute('aria-pressed',String(active)); }
    if (mode==='chart') drawChart();
  }
  const ns='http://www.w3.org/2000/svg';
  function svgElement(tag,attributes={},text) {
    const el=document.createElementNS(ns,tag);
    for (const [k,v] of Object.entries(attributes)) el.setAttribute(k,String(v));
    if (text !== undefined) el.textContent=text;
    return el;
  }
  function niceMax(n) { const step=10**Math.floor(Math.log10(Math.max(1,n/5)));return Math.ceil(Math.max(1,n)/5/step)*step*5; }
  function showTip(point, element) {
    tooltip.replaceChildren(node('strong','',point.date),node('div','',point.known?'每日预约量：'+point.count+' 条':'每日预约量：未采到明细'),node('div','',(complete?'期间累计预约量：':'期间已采样累计：')+point.cumulative+' 条'));
    tooltip.hidden=false;
    const rect=element.getBoundingClientRect();
    tooltip.style.left=Math.max(8,Math.min(rect.left+rect.width/2+12,innerWidth-tooltip.offsetWidth-12))+'px';
    tooltip.style.top=Math.max(8,Math.min(rect.top+20,innerHeight-tooltip.offsetHeight-12))+'px';
  }
  function drawPlot(summary, host) {
    const visible = series(summary);
    const width=Math.max(850,host.clientWidth||0,visible.length*25+128),height=340;
    const margin={left:55,right:62,top:35,bottom:49};
    const plotWidth=width-margin.left-margin.right, plotHeight=height-margin.top-margin.bottom;
    const leftMax=niceMax(Math.max(1,...summary.points.map(p=>p.count))),rightMax=niceMax(Math.max(1,summary.total-summary.missing));
    const x=i=>margin.left+plotWidth*(i+.5)/visible.length;
    const y=(n,max)=>margin.top+plotHeight*(1-n/max);
    const svg=svgElement('svg',{viewBox:`0 0 ${width} ${height}`,width,height,role:'group','aria-label':(complete?'':'样本')+'每日预约量柱状图与期间累计预约量折线图'});
    svg.append(svgElement('text',{x:margin.left,y:16,class:'appt-axis-title'},'每日预约量（条）'),svgElement('text',{x:width-margin.right,y:16,'text-anchor':'end',class:'appt-axis-title'},'期间累计预约量（条）'));
    for (let i=0;i<=5;i++) {
      const yy=margin.top+plotHeight*i/5;
      svg.append(svgElement('line',{x1:margin.left,x2:width-margin.right,y1:yy,y2:yy,class:'appt-grid'}));
      svg.append(svgElement('text',{x:margin.left-12,y:yy+4,'text-anchor':'end',class:'appt-axis'},String(Math.round(leftMax*(5-i)/5))));
      svg.append(svgElement('text',{x:width-margin.right+12,y:yy+4,class:'appt-axis'},String(Math.round(rightMax*(5-i)/5))));
    }
    const barWidth=Math.min(22,plotWidth/visible.length*.5),lineSegments=[]; let current=[];
    visible.forEach((p,i)=>{
      if(p.known)current.push(`${x(i)},${y(p.cumulative,rightMax)}`);
      else if(current.length){lineSegments.push(current);current=[];}
      if(p.count !== null)svg.append(svgElement('rect',{x:x(i)-barWidth/2,y:y(p.count,leftMax),width:barWidth,height:plotHeight*p.count/leftMax,rx:2,class:'appt-bar','data-date':p.date,'data-count':p.count}));
      if (i%Math.max(1,Math.ceil(visible.length/14))===0 || i===visible.length-1) svg.append(svgElement('text',{x:x(i),y:height-23,'text-anchor':'middle',class:'appt-axis'},p.date.slice(5)));
    });
    if(current.length)lineSegments.push(current);
    lineSegments.forEach(segment=>svg.append(svgElement('polyline',{points:segment.join(' '),class:'appt-line'+(complete?'':' partial')})));
    visible.forEach((p,i)=>{
      if(p.known)svg.append(svgElement('circle',{cx:x(i),cy:y(p.cumulative,rightMax),r:3.5,class:'appt-point','data-cumulative':p.cumulative}));
      const hit=svgElement('rect',{x:x(i)-plotWidth/visible.length/2,y:margin.top,width:plotWidth/visible.length,height:plotHeight,tabindex:i===0?0:-1,role:'button',class:'appt-hit','aria-label':p.date+'，每日预约量'+(p.count===null?'未采到明细':p.count+'条')+'，期间'+(complete?'':'已采样')+'累计'+p.cumulative+'条'});
      hit.addEventListener('mouseenter',()=>showTip(p,hit)); hit.addEventListener('mouseleave',dismissTip);
      hit.addEventListener('focus',()=>showTip(p,hit)); hit.addEventListener('blur',dismissTip);
      hit.addEventListener('click',()=>{hit.focus();showTip(p,hit);});
      hit.addEventListener('keydown',event=>{
        if(event.key==='Escape')dismissTip();
        if(['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){
          event.preventDefault();const targets=[...svg.querySelectorAll('.appt-hit')];
          const index=event.key==='Home'?0:event.key==='End'?targets.length-1:Math.max(0,Math.min(targets.length-1,i+(event.key==='ArrowRight'?1:-1)));
          targets.forEach((t,j)=>t.setAttribute('tabindex',j===index?'0':'-1'));targets[index].focus();targets[index].scrollIntoView({block:'nearest',inline:'nearest'});
        }
      });
      svg.append(hit);
    });
    host.append(svg); host.addEventListener('scroll',dismissTip,{passive:true});
  }
  function drawChart() {
    dismissTip(); chartHost.replaceChildren();
    if (scenario==='error') {
      const e=A.empty('预约数据载入失败','请重新载入当前本地演示数据。');
      e.append(button('重新载入',()=>{scenario='';drawChart();},'primary'));chartHost.append(e);return;
    }
    if (reference) { chartHost.append(A.empty('当前租户暂无可统计样本','现有列表为深圳艺星参考展示，不代表当前租户预约结果。'));return; }
    const summary=aggregate(matched,applied,complete),header=node('div','appt-chart-heading'),metric=node('div','appt-total');
    metric.append(node('span','appt-total-label',complete?'预约总量':'样本预约量'));
    const value=node('div','appt-total-value');value.append(node('strong','',summary.total.toLocaleString('zh-CN')),node('span','','条'));metric.append(value);
    const context=node('div','appt-chart-context');context.append(node('strong','','预约量趋势'),node('span','',summary.start?summary.start+' 至 '+summary.end:'当前筛选范围'),node('small','','按预约日期统计 · 期间累计从范围起点计算'));
    header.append(metric,context);chartHost.append(header);
    const labels=node('div','appt-legend');
    for(const [cls,text] of [['bar','每日预约量'],['line','期间累计预约量']]){const item=node('span');item.append(node('i',cls),document.createTextNode(text));labels.append(item);}
    labels.append(node('small','','指向日期查看详情 · 键盘 ← → 切换日期'));chartHost.append(labels);
    if (!complete) chartHost.append(node('p','appt-data-note','仅依据已采样记录，非全部预约；未采到明细的日期留空，不代表当天没有预约。'));
    if (summary.missing) chartHost.append(node('p','appt-data-note','预约日期缺失 '+summary.missing+' 条，已计入总量，未绘入图表。'));
    if (applied[fields.creatorDepartment] && data.some(r=>!r.creatorDepartment)) chartHost.append(node('p','appt-data-note','部分样本缺少创建人当前部门，本次仅匹配已知部门的记录。'));
    if (!matched.length) { chartHost.append(A.empty(complete?'当前筛选暂无预约记录':'当前筛选暂无已采样记录',complete?'可调整筛选条件后重新查询。':'当前为部分采样，无法据此判断全部预约是否为零。'));return; }
    if (!summary.length) { chartHost.append(A.empty('暂无可绘制的预约日期','记录已计入总量，请查看列表中的预约时间。'));return; }
    const chart=node('div','appt-plot-scroll');chartHost.append(chart);
    drawPlot(summary,chart);
    chartHost.append(node('p','appt-footnote','柱形合计 '+(summary.total-summary.missing).toLocaleString('zh-CN')+' 条'+(summary.missing?' + 缺日期 '+summary.missing+' 条':'')+' · '+(complete?'与当前筛选的列表记录一致':'仅为样本统计')+'；预约量不等于实际到院量。'));
  }
  function render() {
    const q=params();scenario=q.get('qa')==='1'?q.get('appointmentScenario')||'':'';
    if (!initialized) {
      complete=q.get('appointmentDemo')==='1'; reference=!complete && A.source.state==='reference';
      if(complete)A.model.tables[0]=fixture(A.tenant,A.getTable(),scenario);
      data=records(A.getTable(),A.tenant);matched=data;
      mode=q.get('appointmentView')==='chart'?'chart':'list';initialized=true;
    }
    root=node('div','page table-page appt-page');
    if(scenario==='denied'){root.append(A.empty('无权查看预约记录','当前演示角色没有此页面权限。'));A.$('app').replaceChildren(root);return true;}
    root.append(prepareFilters());
    const strip=node('div','appt-viewbar');tabs=node('div','appt-views');tabs.setAttribute('role','group');tabs.setAttribute('aria-label','预约记录展示方式');
    for(const [id,label,icon] of [['list','列表','☷'],['chart','图表','▥']]) {
      const b=button('',()=>switchView(id));b.dataset.view=id;b.append(node('span','appt-view-icon',icon),document.createTextNode(label));tabs.append(b);
    }
    const origin=button(complete?'演示数据':reference?'参考样本':'本租户采样',()=>{
      A.showDialog('预约统计数据说明',node('p','form-note',complete?'当前为固定日期的完整合成演示数据，预约、客户、创建人和部门均用于原型体验。图表和列表使用相同数据，不代表真实业务量。':reference?'当前列表沿用深圳艺星参考样本，不计为本租户预约总量。':'当前只有本租户脱敏采样明细，图表统计全部本地匹配样本。历史分页总数不参与绘图，也不代表当前实时预约数。'),[{label:'关闭',run:A.closeDialog}]);
    },'appt-source');strip.append(tabs,origin);root.append(strip);
    notice=node('p','appt-draft-note','筛选条件已修改，查询后生效');notice.hidden=true;notice.setAttribute('role','status');root.append(notice);
    if(complete)root.append(node('p','appt-source-note','完整演示数据 · 2026-09-01 至 2026-10-12 · 图表与列表同步筛选'));
    resultHost=node('section','card appt-list');resultHost.id='results';chartHost=node('section','card appt-chart');
    tooltip=node('div','appt-tooltip');tooltip.hidden=true;tooltip.setAttribute('role','status');
    root.append(resultHost,chartHost,tooltip);A.$('app').replaceChildren(root);
    applied=readFilters();matched=select(data,applied);A.renderResults();switchView(mode);
    return true;
  }
  const previousRender=V.render,previousTransform=V.transformRows;
  V.render=()=>A.route===route&&tenants.has(A.tenant)?render():previousRender?.();
  V.transformRows=(rows,table)=>A.route===route&&initialized?matched.map(r=>r.row):(previousTransform?.(rows,table)||rows);
  let resizeTimer;
  window.addEventListener('resize',()=>{if(A.route===route&&chartHost&&mode==='chart'){dismissTip();clearTimeout(resizeTimer);resizeTimer=setTimeout(drawChart,100);}});
  document.addEventListener('keydown',event=>{if(event.key==='Escape')dismissTip();});
  document.addEventListener('scroll',dismissTip,true);
  return {validDay,dateOf,validate,records,select,aggregate,series,fixture,fields,
    get state(){return {applied:{...applied},mode,complete,reference,rows:matched.length,summary:aggregate(matched,applied,complete)};}};
})();
