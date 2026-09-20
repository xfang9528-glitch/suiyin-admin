/* Shared presentation for source date inputs. Source-specific labels and default values stay intact. */
'use strict';
(()=>{
 let previous=[];
 function close(){previous.forEach(x=>x.api.close());}
 function enhance(panel){
  for(const old of previous){old.api.close();old.panels.forEach(p=>p.remove());}previous=[];
  if(!window.AdminUsageDatePicker)return;
  const attach=(host,inputs,mode)=>{
   inputs.forEach(input=>{const value=input.value;input.type='text';input.value=value;input.dataset.sourceDate='true';input.inputMode='numeric';input.autocomplete='off';input.placeholder||='YYYY-MM-DD';});
   host.dataset.calendarReady='true';
   const trigger=document.createElement('button');trigger.type='button';trigger.className='source-date-trigger';trigger.dataset.dateOpen='true';trigger.setAttribute('aria-label','打开'+(host.dataset.filterGroup||inputs[0].getAttribute('aria-label')||'日期')+'日历');
   trigger.innerHTML='<svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M7 3v5m10-5v5M3 11h18" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>';
   if(mode==='range')host.prepend(trigger);else inputs[0].before(trigger);
   const existing=new Set(document.querySelectorAll('.usage-calendar'));
   const api=window.AdminUsageDatePicker.attach({host,start:inputs[0],end:inputs.at(-1),getMode:()=>mode,onChange:()=>{for(const input of inputs)input.dispatchEvent(new Event('change',{bubbles:true}));}});
   previous.push({api,panels:[...document.querySelectorAll('.usage-calendar')].filter(p=>!existing.has(p))});
  };
  for(const host of panel.querySelectorAll('.source-filter-range')){const dates=[...host.querySelectorAll('input[type=date]')];if(dates.length===2)attach(host,dates,'range');}
  for(const input of panel.querySelectorAll('input[type=date]')){const host=document.createElement('div');host.className='source-single-date';const width=input.style.width;input.before(host);host.append(input);if(width){host.style.width=width;input.style.width='';}attach(host,[input],'single');}
 }
 window.AdminFilterCalendars={enhance,close};
})();
