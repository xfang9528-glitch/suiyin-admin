/* Conversation routes keep their own captured structure. Conversation bodies are synthetic and never sent. */
'use strict';
window.AdminChat={render(){
 const A=window.Admin,{node,button}=A,isAll=A.route==='allChat',root=node('div','page '+(isAll?'all-chat-page':'sales-reception-page')),head=A.pageHead();root.append(head);
 const sales=A.pageData('salesManage')?.tables?.[0],accounts=A.pageData('wechatStatus')?.tables?.[0],customers=(A.pageData('yxCustomerList')||A.pageData('customerManagement'))?.tables?.[0];
 const values=(table,label)=>[...new Set((table?.rows||[]).map(row=>row.cells[table.headers.indexOf(label)]).filter(Boolean))];
 const salesNames=values(sales,'销售姓名'),accountNames=values(accounts,'人设名称');
 const day=date=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).format(date);
 const sampleDay=day(new Date(A.source.capturedAt)),today=()=>day(new Date());
 const rows=(customers?.rows||[]).slice(0,30),h=customers?.headers||[];
 const contacts=rows.map((row,index)=>({id:row.id,name:row.cells[h.indexOf('微信昵称')]||row.cells[h.indexOf('好友名称')]||'演示客户 '+(index+1),sales:row.cells[h.indexOf('专属销售')]||salesNames[index%Math.max(1,salesNames.length)]||'演示销售',account:row.cells[h.indexOf('所在账号')]||accountNames[index%Math.max(1,accountNames.length)]||'演示工作账号',date:day(new Date(Date.parse(sampleDay+'T12:00:00+08:00')-(index%7)*86400000)),search:row.cells.join(' ')}));
 const list=node('aside','chat-list'),pane=node('div','chat-pane'),title=node('div','chat-title'),messages=node('div','messages'),footer=node('div','compose'),panel=node('section','card'),split=node('div','chat-layout');
 footer.append(node('p','hint','只读查看 · 演示对话正文为合成内容。'));pane.append(title,messages,footer);split.append(list,pane);panel.append(split);
 let selected,demo=false;
 function open(contact){selected=contact.id;title.replaceChildren(node('strong','',contact.name),node('small','hint',contact.sales+' · '+contact.account));messages.replaceChildren(node('div','chat-date',contact.date+' · 合成演示对话'));[{text:'您好，我想了解服务和预约安排。',time:'09:30',mine:false},{text:'您好，请告诉我您方便的时间，我可以为您介绍预约流程。',time:'09:32',mine:true},{text:'我先确认一下时间，稍后联系您。',time:'09:35',mine:false}].forEach(message=>{const item=node('div','message'+(message.mine?' mine':''));item.append(node('div','bubble',message.text),node('small','hint',message.time));messages.append(item);});list.querySelectorAll('.contact').forEach(item=>item.classList.toggle('active',item.dataset.id===selected));}
 function showContacts(matched){matched.forEach(contact=>{const item=button('',()=>open(contact),'contact');item.dataset.id=contact.id;item.append(node('span','avatar',contact.name[0]));const text=node('span','',contact.name);text.append(node('small','',contact.sales+' · '+contact.date));item.append(text);list.append(item);});if(!matched.length)list.append(A.empty('没有匹配会话','调整查询条件。'));else open(matched.find(contact=>contact.id===selected)||matched[0]);}
 // These initial states are structural metadata from each tenant's 2026-09-18 capture;
 // the public prototype intentionally omits actual customer chat text.
 const capturedConversationState={'yestar-sz':'empty',bzds:'private-list',jbfs:'private-list',mengzhua:'private-list'};
 function emptyAll(){title.textContent='请选择客户';const state=capturedConversationState[A.tenant];messages.replaceChildren(A.empty(state==='empty'?'暂无聊天内容':state==='private-list'?'会话样本未公开':'此租户会话尚未采集',state==='empty'?'':'可切换到本地演示会话。'));list.replaceChildren();}
 if(isAll){
  const search=node('input');search.type='search';search.placeholder='昵称/手机/客户名/聊天内容';search.setAttribute('aria-label',search.placeholder);const searchBox=node('div','all-chat-search');searchBox.append(search);list.before(searchBox);
  const toggle=button('查看本地演示会话',()=>{demo=!demo;toggle.textContent=demo?'返回采集初始状态':'查看本地演示会话';draw();},'link');head.append(toggle);
  function draw(){emptyAll();list.prepend(searchBox);if(!demo){footer.hidden=true;return;}footer.hidden=false;const keyword=search.value.trim();list.append(node('div','chat-list-heading','本地演示会话'));showContacts(contacts.filter(contact=>contact.search.includes(keyword)||contact.name.includes(keyword)));}
  search.oninput=draw;root.append(panel);A.$('app').replaceChildren(root);draw();return;
 }
 const introduction=node('div','chat-introduction');introduction.append(node('p','','按销售或人设查看客户会话与具体对话'));root.append(introduction);
 const form=node('form','card filter-panel');
 function multi(label,options){const group=node('div','field'),caption=node('span','',label+' · 多选'),wrap=node('details','multi-filter'),summary=node('summary','','全部'+label),box=node('div','multi-options');wrap.append(summary);options.forEach(value=>{const item=node('label','check-field'),control=node('input');control.type='checkbox';control.value=value;item.append(control,document.createTextNode(value));box.append(item);});box.onchange=()=>{const count=box.querySelectorAll('input:checked').length;summary.textContent=count?'已选 '+count+' 项':'全部'+label;};wrap.append(box);group.append(caption,wrap);form.append(group);return box;}
 const salesPicker=multi('销售',salesNames),accountPicker=multi('人设',accountNames),period=node('select');['不限时间','今天','本月','自定义日期'].forEach(value=>period.append(new Option(value,value)));period.setAttribute('aria-label','聊天时间');const timeLabel=node('label','field');timeLabel.append(node('span','','聊天时间'),period);form.append(timeLabel);
 const dates=node('div','date-range');dates.hidden=true;const from=node('input'),to=node('input');from.type=to.type='date';from.setAttribute('aria-label','聊天开始日期');to.setAttribute('aria-label','聊天结束日期');dates.append(from,document.createTextNode('至'),to);form.append(dates);period.onchange=()=>dates.hidden=period.value!=='自定义日期';
 function draw(initial=true){
  if(period.value==='自定义日期'&&from.value&&to.value&&from.value>to.value){A.toast('开始日期不能晚于结束日期');return;}
  const read=element=>[...element.querySelectorAll('input:checked')].map(control=>control.value),sales=read(salesPicker),accounts=read(accountPicker),currentDay=today();
  const matched=contacts.filter(contact=>(!sales.length||sales.includes(contact.sales))&&(!accounts.length||accounts.includes(contact.account))&&(period.value!=='今天'||contact.date===currentDay)&&(period.value!=='本月'||contact.date.slice(0,7)===currentDay.slice(0,7))&&(period.value!=='自定义日期'||(!from.value||contact.date>=from.value)&&(!to.value||contact.date<=to.value)));
  list.replaceChildren(node('div','chat-list-heading','客户会话'),node('p','hint','按最近匹配时间排序'));title.textContent='聊天详情';messages.replaceChildren(A.empty('选择客户会话后查看具体对话','仅查看聊天记录'));footer.hidden=initial;
  if(initial){list.append(A.empty('选择筛选条件后，点击查询',''));return;}
  list.append(node('p','hint','本地演示 · '+matched.length+' 条'));showContacts(matched);
 }
 const actions=node('div','filter-actions');actions.append(button('重置',()=>{form.reset();dates.hidden=true;form.querySelectorAll('.multi-filter summary').forEach((summary,index)=>summary.textContent='全部'+(index?'人设':'销售'));draw(true);}),button('查询',()=>draw(false),'primary'));form.append(node('p','hint','未选择的筛选项覆盖权限范围内全部记录'),actions);form.onsubmit=event=>{event.preventDefault();draw(false);};root.append(form,panel);A.$('app').replaceChildren(root);draw(true);
}};
