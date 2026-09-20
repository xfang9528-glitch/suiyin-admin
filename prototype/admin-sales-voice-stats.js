/* SPEC-SUIYIN-ADMIN-052@1.1.1. Synthetic, tenant-isolated, browser-local statistics. */
'use strict';
window.AdminVoiceStats = (() => {
  const route = 'salesVoiceStats';
  const zone = 'Asia/Shanghai';
  function day(value = new Date()) {
    const d = new Date(value);
    if (!Number.isFinite(d.getTime())) return '';
    const p = new Intl.DateTimeFormat('en-CA', {timeZone:zone, year:'numeric', month:'2-digit', day:'2-digit'}).formatToParts(d);
    return ['year','month','day'].map(k => p.find(x => x.type === k).value).join('-');
  }
  const offsetDay = (date, offset) => new Date(Date.parse(date + 'T12:00:00Z') + offset * 86400000).toISOString().slice(0,10);
  function validDate(value) {
    return /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value+'T00:00:00Z')) && new Date(value+'T00:00:00Z').toISOString().slice(0,10) === value;
  }
  function validate(query) {
    if (!validDate(query.start) || !validDate(query.end)) return '请选择完整的统计日期';
    if (query.start > query.end) return '开始日期不能晚于结束日期';
    return '';
  }
  // Deduplicate globally BEFORE applying date/department filters: repeated callbacks may cross midnight.
  function aggregate(data, query) {
    const error = validate(query);
    if (error) throw Error(error);
    const first = new Map();
    for (const e of data.events) {
      if (e.tenantId !== data.tenantId || e.type !== 'transform' || e.status !== 'succeeded' || !e.enteredTransform || !e.taskId || !Number.isFinite(Date.parse(e.at))) continue;
      const old = first.get(e.taskId);
      if (!old || Date.parse(e.at) < Date.parse(old.at)) first.set(e.taskId, e);
    }
    const inCoverage = query.end >= data.coverage.start && query.start <= data.coverage.end;
    if (!inCoverage) return [];
    const rows = data.sales.filter(s => (!query.department || s.departmentId === query.department) && s.authorized !== false)
      .map(s => ({...s, count:0}));
    const rowMap = new Map(rows.map(r => [r.salesId+'\u0000'+r.departmentId, r]));
    for (const event of first.values()) {
      const date = day(event.at);
      if (date < query.start || date > query.end || date < data.coverage.start || date > data.coverage.end) continue;
      const row = rowMap.get(event.salesId+'\u0000'+event.departmentId);
      if (row) row.count++;
    }
    return rows;
  }
  function fixture(tenantId, today = day()) {
    const sector = tenantId.startsWith('yestar') ? ['咨询一组','咨询二组','客户服务'] : ['销售一组','销售二组','客户服务'];
    const departments = sector.map((name,i) => ({id:tenantId+'-dept-'+i, name}));
    const names = ['陈欣','李悦','王宁','赵婉','林晨','周可','吴桐','张晴','刘璐','徐思','孙妍','朱一','胡昕','何雨','郭琪','高颖','罗茜','郑萱','梁菲','宋安','唐言','谢佳','韩静','许悠','邓岚','陈欣'];
    const sales = names.map((name,i) => ({salesId:tenantId+'-sale-'+i, name, departmentId:departments[i%3].id, department:departments[i%3].name}));
    const events = [], seed = [...tenantId].reduce((n,c) => n+c.charCodeAt(0),0);
    const add = (s, taskId, date, time, status='succeeded', type='transform', account='a') => events.push({tenantId, taskId, salesId:s.salesId, departmentId:s.departmentId, accountId:tenantId+'-'+account, enteredTransform:type==='transform', type, status, at:date+'T'+time+'+08:00'});
    for (let d = -2; d <= 0; d++) {
      const date = offsetDay(today,d);
      sales.forEach((s,i) => {
        const count = i === 24 ? 0 : (seed+i*7+Math.floor(Date.parse(date+'T00:00:00Z')/86400000)*3)%18;
        for (let j=0; j<count; j++) {
          const task = tenantId+'-task-'+date+'-'+i+'-'+j;
          if (j===0) add(s,task,date,'08:40:00','failed');
          add(s,task,date,'09:'+String(j).padStart(2,'0')+':00','succeeded','transform',j%2?'b':'a');
          if (j===0) { add(s,task,date,'10:00:00'); add(s,task,date,'11:00:00','succeeded','play'); }
        }
        add(s,tenantId+'-failed-'+d+'-'+i,date,'12:00:00','failed');
        add(s,tenantId+'-cancel-'+d+'-'+i,date,'12:30:00','cancelled');
      });
    }
    // A repeated success callback on the next day must not turn one task into two uses.
    for (let d=-2; d<=1; d++) {
      const date=offsetDay(today,d), previous=offsetDay(date,-1);
      add(sales[0],tenantId+'-cross-'+date,previous,'23:59:00');
      add(sales[0],tenantId+'-cross-'+date,date,'00:01:00');
      // A task started yesterday but first successful today belongs to today's count.
      add(sales[1],tenantId+'-retry-cross-'+date,previous,'23:58:00','failed');
      add(sales[1],tenantId+'-retry-cross-'+date,date,'00:02:00');
    }
    return {tenantId, departments, sales, events, coverage:{start:offsetDay(today,-2), end:today}};
  }
  function csv(rows) {
    const safe = value => '"'+String(value).replace(/^[=+@-]/,"'$&").replaceAll('"','""')+'"';
    return '\ufeff'+[['序号','销售','部门','变声使用次数'], ...rows.map((r,i) => [i+1,r.name,r.department,r.count])].map(r => r.map(safe).join(',')).join('\r\n');
  }
  function render() {
    const A = window.Admin, {node,button} = A;
    const root = node('div','page voice-stats-page');
    A.$('app').replaceChildren(root);
    const q = new URLSearchParams(location.search), qa = q.get('qa') === '1';
    const override = window.AdminMenuState.read(A.tenantInfo,A.navStorageKey(A.tenant));
    const allowed = window.AdminMenuState.visible(A.tenantInfo,override).flatMap(g => g.children||[g]).some(x => x.route===route);
    if (!allowed || (qa && q.get('voiceState')==='denied')) {
      const denied = node('section','error-card'); denied.setAttribute('role','status');
      denied.append(node('h2','','当前菜单不可见'),node('p','','此入口已隐藏或不在当前可见范围内，请联系管理员检查菜单配置。'));
      root.append(denied); return true;
    }
    const today = day();let data = fixture(A.tenant,today);
    let submitted = {start:today, end:today, department:''};
    let rows = aggregate(data,submitted), page=1, size=20, direction='none', busy=false, failed=false;
    let failNext = qa && q.get('voiceState') === 'error';
    const emptyDemo = qa && q.get('voiceState') === 'empty';
    const form = node('form','card filter-panel voice-filters'); form.noValidate=true;
    const dates = node('div','field voice-dates'), label=node('span','','统计时间');
    const dateBox=node('div','voice-date-inputs usage-date-control is-range');
    const start=node('input'), end=node('input'), to=node('span','','至');
    start.type=end.type='text';start.placeholder=end.placeholder='YYYY-MM-DD';start.inputMode=end.inputMode='numeric';start.maxLength=end.maxLength=10;start.value=end.value=today;
    start.setAttribute('aria-label','开始日期');end.setAttribute('aria-label','结束日期');
    start.required=end.required=true;
    const openDate=button('',()=>{});openDate.className='usage-date-open';openDate.dataset.dateOpen='';openDate.setAttribute('aria-label','打开统计日期日历');openDate.innerHTML='<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M7 3v4m10-4v4M3 10h18" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>';to.className='usage-date-separator';dateBox.append(openDate,start,to,end);
    const quick=node('div','quick-dates');
    ['今天','昨天','前天'].forEach((text,i) => {
      const b=button(text,() => {start.value=end.value=offsetDay(day(),-i);markQuick();submit();});b.dataset.offset=String(-i);quick.append(b);
    });
    dates.append(label,dateBox);form.append(quick,dates);
    const depLabel=node('label','field');depLabel.append(node('span','','部门'));
    const dep=node('select');dep.setAttribute('aria-label','部门');dep.append(new Option('全部部门',''));
    data.departments.forEach(d=>dep.append(new Option(d.name,d.id)));const depControl=A.searchableSelect(dep,'部门');depControl.style.width='220px';depLabel.append(depControl);form.append(depLabel);
    const actions=node('div','filter-actions'), search=button('搜索',submit,'primary'), reset=button('重置',resetAll), exportButton=button('导出',exportAll);
    search.type='submit';search.onclick=null;actions.append(search,reset,exportButton);form.append(actions);
    const error=node('p','filter-error');error.hidden=true;error.setAttribute('role','alert');form.append(error);
    form.onsubmit=e=>{e.preventDefault();submit();};
    const note=node('div','voice-note');
    note.append(node('span','','按成功生成的独立变声任务计次；失败、试听及同一任务重试不重复计数。'));
    note.append(button('口径说明',() => A.showDialog('销售变声统计口径',node('p','form-note','每个独立变声任务首次成功生成计 1 次，按成功时间（北京时间）归入统计日期，并归属发起任务的销售和当时部门。同一任务失败后重试成功仍为 1 次；重复回调、试听和取消不增加次数，不要求消息发送成功。多个工作账号按同一销售身份汇总，同名销售不合并。'),[{label:'关闭',run:A.closeDialog}]),'link'));
    const result=node('section','voice-results');result.setAttribute('aria-label','销售变声统计结果');
    const source=node('p','voice-source','合成演示数据 · 示例日期 '+data.coverage.start+' 至 '+data.coverage.end+' · '+A.tenantInfo.name);
    root.append(form,note,result,source);
    function draft(){return {start:start.value,end:end.value,department:dep.value};}
    function markQuick(){quick.querySelectorAll('button').forEach(b=>{const selected=start.value===end.value&&start.value===offsetDay(day(),Number(b.dataset.offset));b.classList.toggle('selected',selected);b.setAttribute('aria-pressed',String(selected));});}
    const calendar=window.AdminUsageDatePicker?.attach({host:dateBox,start,end,getMode:()=>'range',onChange:markQuick});start.oninput=markQuick;end.oninput=markQuick;
    function setBusy(value){busy=value;result.setAttribute('aria-busy',String(value));form.querySelectorAll('button,input,select').forEach(c=>c.disabled=value);}
    function sorted(){return direction==='none'?[...rows]:[...rows].sort((a,b)=>(a.count-b.count)*(direction==='ascending'?1:-1)||a.salesId.localeCompare(b.salesId));}
    function draw(){
      result.replaceChildren();result.dataset.state=busy?'loading':failed?'error':'success';
      if(busy){const load=node('div','voice-loading','正在统计…');load.setAttribute('role','status');result.append(load);}
      if(failed){
        const problem=node('div','voice-error');problem.setAttribute('role','alert');
        problem.append(node('strong','','加载失败，请重试'),node('p','','未更新统计结果，请重试本次查询。'),button('重试',()=>run(submitted)));
        result.append(problem);exportButton.disabled=true;return;
      }
      if(!rows.length){result.dataset.state=busy?'loading':'empty';result.append(A.empty('暂无数据','所选条件没有演示记录，请调整日期或部门。'));exportButton.disabled=true;return;}
      exportButton.disabled=busy;
      const ordered=sorted(), wrap=node('div','table-wrap voice-table-wrap'), table=node('table'), cap=node('caption','sr-only','销售变声统计'), head=node('thead'), tr=node('tr'), body=node('tbody');
      const cols=node('colgroup');['72px','28%','30%',''].forEach(w=>{const c=node('col');if(w)c.style.width=w;cols.append(c);});
      ['#','销售','部门','变声使用次数'].forEach((title,i)=>{
        const th=node('th',i===3?'num voice-number':'',title);th.scope='col';
        if(i===3){th.setAttribute('aria-sort',direction);th.tabIndex=busy?-1:0;th.dataset.sort='count';if(direction!=='none')th.append(document.createTextNode(direction==='ascending'?' ↑':' ↓'));const toggle=()=>{if(busy)return;direction=direction==='ascending'?'descending':'ascending';page=1;draw();result.querySelector('[data-sort]')?.focus();};th.onclick=toggle;th.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle();}};}
        tr.append(th);
      });head.append(tr);
      ordered.slice((page-1)*size,page*size).forEach((r,i)=>{const row=node('tr');row.dataset.salesId=r.salesId;[String((page-1)*size+i+1),r.name,r.department,String(r.count)].forEach((c,j)=>row.append(node('td',j===3?'num voice-number':'',c)));body.append(row);});
      const foot=node('tfoot'), totalRow=node('tr'), totalLabel=node('td','','筛选合计');totalLabel.colSpan=3;totalRow.append(totalLabel,node('td','num voice-number',String(rows.reduce((n,r)=>n+r.count,0))));foot.append(totalRow);
      table.append(cap,cols,head,body,foot);wrap.append(table);result.append(wrap);
      const pager=node('div','pager'), count=node('span','summary','共 '+rows.length+' 条 · '+submitted.start+(submitted.start===submitted.end?'':' 至 '+submitted.end));
      const sizes=node('select');sizes.setAttribute('aria-label','每页条数');[10,20,50,100].forEach(n=>sizes.append(new Option(n+' 条/页',n,false,n===size)));sizes.disabled=busy;sizes.onchange=()=>{size=Number(sizes.value);page=1;draw();};
      const maxPage=Math.ceil(rows.length/size),prev=button('‹',()=>{page--;draw();}),next=button('›',()=>{page++;draw();});prev.setAttribute('aria-label','上一页');next.setAttribute('aria-label','下一页');prev.disabled=busy||page===1;next.disabled=busy||page>=maxPage;
      pager.append(count,sizes,prev);const from=Math.max(1,Math.min(page-2,maxPage-4));for(let n=from;n<=Math.min(maxPage,from+4);n++){const b=button(String(n),()=>{page=n;draw();},n===page?'selected':'');b.disabled=busy;if(n===page)b.setAttribute('aria-current','page');pager.append(b);}pager.append(next,node('span','hint',page+' / '+maxPage+' 页'));result.append(pager);
    }
    async function run(query){
      if(busy)return;
      if(data.coverage.end!==day()){
        data=fixture(A.tenant,day());
        source.textContent='合成演示数据 · 示例日期 '+data.coverage.start+' 至 '+data.coverage.end+' · '+A.tenantInfo.name;
      }
      submitted={...query};failed=false;setBusy(true);draw();
      await new Promise(resolve=>setTimeout(resolve,180));
      try { if(failNext){failNext=false;throw Error('synthetic failure');}rows=emptyDemo?[]:aggregate(data,submitted);page=1; }
      catch {failed=true;}
      finally {setBusy(false);draw();}
    }
    function submit(){if(busy)return;calendar?.refresh();const value=draft(),message=validate(value);error.hidden=!message;error.textContent=message;if(message){start.setAttribute('aria-invalid','true');return;}start.removeAttribute('aria-invalid');markQuick();run(value);}
    function resetAll(){if(busy)return;calendar?.refresh();start.value=end.value=day();dep.value='';dep.dispatchEvent(new Event('change',{bubbles:true}));direction='none';error.hidden=true;start.removeAttribute('aria-invalid');markQuick();run(draft());}
    function exportAll(){if(busy||failed||!rows.length)return;const blob=new Blob([csv(sorted())],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob),link=node('a');link.href=url;link.download=A.tenant+'-销售变声统计-'+submitted.start+'_'+submitted.end+'.csv';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);A.toast('已导出全部 '+rows.length+' 条筛选结果（合成演示数据）');}
    markQuick();draw();if(failNext||emptyDemo)run(submitted);
    return true;
  }
  const previous=window.AdminViews;
  if(window.Admin)window.AdminViews={...previous,render(){return window.Admin.route===route?render():previous?.render?.();}};
  return {day,offsetDay,validDate,validate,aggregate,fixture,csv,render};
})();
