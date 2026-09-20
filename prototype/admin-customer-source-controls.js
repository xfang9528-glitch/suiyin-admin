/* Preserve captured customer-page controls; uncollected expanded states are explicitly unavailable. */
'use strict';
(()=>{
 const A=window.Admin,V=window.AdminViews,previous=V.render,{node,button}=A;
 if(!['customerManagement','yxCustomerList'].includes(A.route))return;
 const text=element=>element.textContent.trim();
 const names=()=>[...new Set((A.source.buttons||[]).map(value=>typeof value==='string'?value:value.text).filter(Boolean))];
 const pending=label=>A.toast('“'+label+'”的展开状态尚未采集，当前仅还原已采集入口。');
 function enhance(){
  const root=document.querySelector('#app > .page'),filter=root?.querySelector('.filter-panel');if(!root||!filter)return;
  const labels=names(),ordinary=A.route==='customerManagement';
  const topLabels=labels.filter(label=>ordinary?/^(全部好友|来源信息$|好友信息$|用户信息$|购买信息$|创建虚拟好友$|全部记录$)/.test(label):/^(导出表格|全部记录)$/.test(label));
  let top=root.querySelector('.customer-source-top');if(!top&&topLabels.length){top=node('div','card toolbar customer-source-top');top.setAttribute('aria-label','好友管理顶部操作');filter.before(top);}
  if(top){for(const label of topLabels){let control=[...top.querySelectorAll('button')].find(item=>item.dataset.customerSourceAction===label);if(!control){control=[...root.querySelectorAll('.source-toolbar > button')].find(item=>text(item)===label);if(!control)control=button(label,()=>/^(全部好友|来源信息|好友信息|用户信息|购买信息)/.test(label)?pending(label):A.action(label),/^创建/.test(label)?'primary':'');control.dataset.customerSourceAction=label;if(/^(全部好友|来源信息|好友信息|用户信息|购买信息)/.test(label)){control.onclick=()=>pending(label);control.setAttribute('aria-expanded','false');control.title='此入口的展开状态尚未采集';}top.append(control);}
    root.querySelectorAll('.source-toolbar > button').forEach(item=>{if(text(item)===label)item.remove();});
   }
   root.querySelectorAll('.source-toolbar').forEach(toolbar=>{if(!toolbar.querySelector('button'))toolbar.hidden=true;});
  }
  if(ordinary)return;
  let actions=filter.querySelector('.filter-actions');if(!actions){actions=node('div','filter-actions');filter.append(actions);}
  for(const label of ['重置','执行筛选','搜索'].filter(name=>labels.includes(name))){let control=[...filter.querySelectorAll('button')].find(item=>text(item)===label);if(!control){control=[...root.querySelectorAll('.source-toolbar > button')].find(item=>text(item)===label)||button(label,()=>{},label==='重置'?'':'primary');if(label==='重置'){control.type='button';control.onclick=()=>A.action('重置');}else{control.type='submit';control.onclick=null;}actions.append(control);}root.querySelectorAll('.source-toolbar > button').forEach(item=>{if(text(item)===label)item.remove();});}
  if(labels.includes('展开')&&!actions.querySelector('[data-customer-expand]')){const expand=button('展开',()=>pending('展开'),'link');expand.dataset.customerExpand='';expand.setAttribute('aria-expanded','false');expand.title='高级筛选展开状态尚未采集';actions.prepend(expand);}
  const sourceInput=(A.source.inputs||[]).find(input=>input.placeholder&&/昵称.*备注名.*手机号.*卡号/.test(input.placeholder));
  if(sourceInput){
   let input=[...filter.querySelectorAll('input')].find(control=>control.placeholder===sourceInput.placeholder);if(!input){const field=node('div','field');field.append(node('span','','搜索好友'));input=node('input');input.type='text';input.placeholder=sourceInput.placeholder;input.setAttribute('aria-label','搜索好友');input.dataset.filter='搜索好友';input.value=sourceInput.value||'';field.append(input);filter.append(field);}
   let row=filter.querySelector('.customer-keyword-row');if(!row){row=node('div','customer-keyword-row');row.style.cssText='display:flex;align-items:center;gap:12px;width:100%';if(actions)actions.after(row);else filter.append(row);}
   const field=input.closest('.field')||input;if(field.parentElement!==row)row.append(field);
   const search=[...filter.querySelectorAll('button')].find(control=>text(control)==='搜索');if(search&&search.parentElement!==row)row.append(search);
  }
 }
 V.render=()=>{if(['customerManagement','yxCustomerList'].includes(A.route)){if(!previous())A.renderTablePage();enhance();return true;}return previous();};
 const observer=new MutationObserver(()=>enhance());observer.observe(A.$('app'),{childList:true,subtree:true});
 window.AdminCustomerSource={enhance};
})();
