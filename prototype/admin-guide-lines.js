/* SPEC-SUIYIN-ADMIN-073@1.0.0 — local, tenant-isolated guide-line drafts. */
'use strict';
window.AdminGuideLinesUI=(()=>{
 let disposePrevious;
 const imageSource=src=>window.__ADMIN_INLINE_ASSETS__?.[src]||src;
 async function render(A){
  if(A?.route!=='guideLineManage')return;
  disposePrevious?.();
  const M=window.AdminGuideLineModel,app=A.$('app'),tenant=A.tenant;
  const node=A.node,button=A.button,copy=value=>M.clone(value);
  let saved=null,draft=null,selected=null,queue=[],epoch=0,alive=true,saving=false,error='',leavePromise=null,dialogCleanup=null,drag=null;
  let failNext=0,processingDelay=0;
  const qa=new URLSearchParams(location.search).get('qa')==='1';
  const pending=q=>q.status==='validating'||q.status==='processing';
  const unresolved=()=>queue.filter(q=>pending(q)||q.status==='failed');
  const dirty=()=>!!draft&&(JSON.stringify(draft)!==JSON.stringify(saved)||unresolved().length>0);
  const category=id=>draft?.categories.find(c=>c.id===id);
  const current=()=>category(selected);
  const originLabel=origin=>({default:'初始素材',system:'初始素材',store:'门店素材',demo:'演示来源',local:'本地添加',user:'本地添加',upload:'本地添加','系统默认':'系统默认','门店专属':'门店素材','030-local-demo':'演示来源'}[origin]||'演示来源');
  const empty=(title,detail,action)=>{const el=node('div','gl-empty');el.append(node('div','gl-empty-icon','▧'),node('strong','',title),node('p','',detail));if(action)el.append(action);return el;};
  const action=(text,run,cls='')=>{const b=button(text,run,cls);b.disabled=saving;return b;};
  function changed(message){error='';draw();if(message)A.toast(message);}
  function present(title,body,buttons,onDismiss){
   dialogCleanup?.();if(A.$('dialog').open)A.closeDialog();
   const frame=window.frameElement,d=A.$('dialog'),oldStyle=app.getAttribute('style');let cleaned=false;
   if(frame){const r=frame.getBoundingClientRect();app.style.cssText=`position:fixed;left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px`;document.body.classList.add('menu-modal-open');frame.classList.add('menu-dialog-layer');}
   const cleanup=()=>{if(cleaned)return;cleaned=true;d.classList.remove('gl-dialog');if(frame){oldStyle===null?app.removeAttribute('style'):app.setAttribute('style',oldStyle);document.body.classList.remove('menu-modal-open');frame.classList.remove('menu-dialog-layer');}if(dialogCleanup===cleanup)dialogCleanup=null;onDismiss?.();};
   dialogCleanup=cleanup;A.showDialog(title,body,buttons);d.classList.add('gl-dialog');const size=frame?parent:window;
   d.style.setProperty('--dialog-width','520px');d.style.setProperty('--dialog-left',Math.max(16,(size.innerWidth-Math.min(520,size.innerWidth-32))/2)+'px');d.style.setProperty('--dialog-top',Math.max(16,Math.min(size.innerHeight*.18,120))+'px');
   d.addEventListener('close',cleanup,{once:true});return d;
  }
  function confirm(title,text,onConfirm){const body=node('div','gl-confirm');body.append(node('p','',text));present(title,body,[{label:'取消',run:A.closeDialog},{label:'确认删除',cls:'danger',run:()=>{A.closeDialog();onConfirm();}}]);}
  function nameEditor(kind,id){
   const c=current(),existing=kind==='category'?category(id):c?.items.find(i=>i.id===id);
   const body=node('form','gl-form'),field=node('label','gl-name-field'),input=node('input'),feedback=node('p','gl-form-error');
   input.value=existing?.name||'';input.maxLength=kind==='category'?60:120;input.placeholder=kind==='category'?'请输入分类名称':'请输入管理名称';input.setAttribute('aria-label',kind==='category'?'分类名称':'管理名称');
   field.append(node('span','',kind==='category'?'分类名称 *':'管理名称 *'),input);body.append(field,feedback);
   if(kind==='image')body.append(node('p','gl-muted','管理名称仅在后台显示，不修改图片中的线条或文字。'));
   const submit=()=>{const name=input.value.trim();if(!name){feedback.textContent=kind==='category'?'请填写分类名称':'请填写管理名称';input.focus();return;}
    if(kind==='category'&&draft.categories.some(x=>x.id!==id&&x.name.trim()===name)){feedback.textContent='当前租户已有同名分类，请换一个名称';input.focus();return;}
    if(existing)existing.name=name;else{const added={id:M.uid('category'),name,enabled:true,origin:'local',items:[]};draft.categories.push(added);selected=added.id;}
    A.closeDialog();changed();
   };
   body.onsubmit=e=>{e.preventDefault();submit();};present((existing?'编辑':'新增')+(kind==='category'?'分类':'图片管理名称'),body,[{label:'取消',run:A.closeDialog},{label:'确定',cls:'primary',run:submit}]);
  }
  function deleteCategory(c){
   const count=queue.filter(q=>q.categoryId===c.id&&pending(q)).length;
   confirm('删除分类',`删除“${c.name}”及其中 ${c.items.length} 张图片？${count?'该分类正在处理的图片也会取消。':''}此操作先保留在草稿中，保存后才更新本地配置。`,()=>{
    queue.filter(q=>q.categoryId===c.id).forEach(q=>q.token++);queue=queue.filter(q=>q.categoryId!==c.id);
    const i=draft.categories.indexOf(c);draft.categories.splice(i,1);selected=draft.categories[Math.min(i,draft.categories.length-1)]?.id||null;changed();
   });
  }
  function deleteImage(c,item){confirm('移除图片',`从“${c.name}”移除“${item.name}”？其他分类中使用的同一张图片不受影响。`,()=>{queue.filter(q=>q.categoryId===c.id&&q.replaceItemId===item.id).forEach(q=>q.token++);queue=queue.filter(q=>!(q.categoryId===c.id&&q.replaceItemId===item.id));c.items=c.items.filter(i=>i.id!==item.id);changed();});}
  function move(list,id,to,focusSelector){const from=list.findIndex(x=>x.id===id);if(from<0||to<0||to>=list.length||from===to)return;list.splice(to,0,list.splice(from,1)[0]);changed('顺序已调整，保存后更新本地配置');if(focusSelector)app.querySelector(focusSelector)?.focus();}
  function sorting(el,type,id,list){
   el.draggable=true;el.dataset.sortId=id;
   el.ondragstart=e=>{if(saving){e.preventDefault();return;}drag={type,id,list};e.dataTransfer.effectAllowed='move';e.dataTransfer.setData('text/plain',id);el.classList.add('is-dragging');};
   el.ondragend=()=>{drag=null;app.querySelectorAll('.is-drop-target,.is-dragging').forEach(x=>x.classList.remove('is-drop-target','is-dragging'));};
   el.ondragover=e=>{if(drag?.type!==type||drag.list!==list||drag.id===id)return;e.preventDefault();e.dataTransfer.dropEffect='move';el.classList.add('is-drop-target');};
   el.ondragleave=()=>el.classList.remove('is-drop-target');
   el.ondrop=e=>{e.preventDefault();if(drag?.type===type&&drag.list===list)move(list,drag.id,list.findIndex(x=>x.id===id));drag=null;};
  }
  function handle(label,type,id,list){const h=action('⠿',()=>A.toast('拖动调整顺序，或按住 Alt 后按上、下方向键'),'gl-drag-handle');h.title=label+'；Alt + ↑ / ↓ 调整顺序';h.setAttribute('aria-label',h.title);h.dataset.sortHandle=id;h.onkeydown=e=>{if(e.altKey&&['ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();move(list,id,list.findIndex(x=>x.id===id)+(e.key==='ArrowUp'?-1:1),`[data-sort-handle="${id}"]`);}};return h;}
  function chooseFiles(categoryId,replaceItemId=null,retryEntry=null){
   const input=node('input');input.type='file';input.accept='image/png,.png';input.multiple=!replaceItemId&&!retryEntry;input.hidden=true;app.append(input);
   input.onchange=()=>{const files=Array.from(input.files||[]);input.remove();if(!files.length)return;if(retryEntry){retryEntry.file=files[0];retryEntry.name=files[0].name;retryEntry.status='queued';retryEntry.error='';processEntry(retryEntry);}else enqueue(files,categoryId,replaceItemId);};
   input.addEventListener('cancel',()=>input.remove(),{once:true});input.click();
  }
  function enqueue(files,categoryId,replaceItemId=null){
   if(!alive||saving||!category(categoryId))return;
   if(replaceItemId&&queue.some(q=>q.replaceItemId===replaceItemId&&q.categoryId===categoryId&&pending(q))){A.toast('这张图片正在处理，请稍候');return;}
   // A failed replacement is superseded by reselecting; the old image remains until success.
   if(replaceItemId){queue.filter(q=>q.categoryId===categoryId&&q.replaceItemId===replaceItemId).forEach(q=>q.token++);queue=queue.filter(q=>!(q.categoryId===categoryId&&q.replaceItemId===replaceItemId));}
   files.forEach(file=>{const q={id:M.uid('queue'),categoryId,replaceItemId,file,name:file.name,status:'queued',error:'',token:0,outputId:M.uid('image')};queue.push(q);processEntry(q);});
  }
  async function processEntry(q){
   if(pending(q)||!queue.includes(q))return;
   const token=++q.token,operationEpoch=epoch,valid=()=>alive&&epoch===operationEpoch&&q.token===token&&queue.includes(q)&&category(q.categoryId)&&(!q.replaceItemId||category(q.categoryId).items.some(i=>i.id===q.replaceItemId));
   q.status='validating';q.error='';draw();
   try{
    await new Promise(resolve=>setTimeout(resolve,40));if(!valid())return;
    if(q.file.size>10*1024*1024)throw new Error('图片超过 10MiB，请压缩后重新选择');
    if(!/\.png$/i.test(q.file.name)||q.file.type&&q.file.type!=='image/png')throw new Error('只支持透明 PNG，请重新选择 PNG 图片');
    q.status='processing';draw();if(processingDelay)await new Promise(resolve=>setTimeout(resolve,processingDelay));if(!valid())return;
    if(failNext>0){failNext--;q.exampleFailure=true;throw new Error('这张图片处理失败，请重试或重新选择');}
    const result=await M.imageFromFile(q.file);if(!valid())return;
    const c=category(q.categoryId);if(q.replaceItemId){const item=c.items.find(i=>i.id===q.replaceItemId);Object.assign(item,{src:result.src,width:result.width,height:result.height,origin:'local'});}
    else if(!c.items.some(i=>i.id===q.outputId))c.items.push({id:q.outputId,name:result.name||q.name.replace(/\.png$/i,''),src:result.src,width:result.width,height:result.height,origin:'local'});
    q.status='success';q.exampleFailure=false;q.file=null;changed();
   }catch(e){if(!valid())return;q.status='failed';q.error=e.message||'图片处理失败，请重试或重新选择';draw();}
  }
  function removeQueue(q){q.token++;q.status='cancelled';queue=queue.filter(x=>x!==q);changed('已移除待处理图片');}
  function queuePanel(c){
   const own=queue.filter(q=>q.categoryId===c.id);if(!own.length)return null;
   const panel=node('section','gl-upload-queue');panel.setAttribute('aria-label','图片处理结果');panel.setAttribute('aria-live','polite');
   const head=node('div','gl-queue-head');head.append(node('strong','',`图片处理结果（${own.length}）`));if(own.some(q=>q.status==='success'))head.append(action('清除完成记录',()=>{queue=queue.filter(q=>q.categoryId!==c.id||q.status!=='success');draw();},'link'));panel.append(head);
   own.forEach(q=>{const row=node('div','gl-queue-row '+q.status),info=node('div','gl-queue-info'),controls=node('div','gl-queue-actions');
    info.append(node('strong','',q.name),node('span','',q.status==='success'?'已处理，等待保存':q.status==='validating'?'正在校验…':q.status==='processing'?'正在处理…':q.error));
    if(q.status==='failed'){controls.append(action('重试',()=>processEntry(q),'link'),action('重新选择',()=>chooseFiles(q.categoryId,q.replaceItemId,q),'link'));if(qa&&q.exampleFailure)controls.append(action('查看示例信息',()=>{const body=node('div','gl-confirm');body.append(node('p','','此项为演示失败；没有发送到真实上传服务。'),node('p','',`示例编号：${q.id}`),node('p','','点击“重试”可以继续本地处理。'));present('处理结果说明',body,[{label:'关闭',run:A.closeDialog}]);},'link'));}
    if(q.status!=='success')controls.append(action(pending(q)?'取消':'移除',()=>removeQueue(q),'link danger'));
    row.append(info,controls);panel.append(row);
   });return panel;
  }
  function card(c,item,index){
   const el=node('article','gl-image-card');el.dataset.imageId=item.id;sorting(el,'image',item.id,c.items);
   const top=node('div','gl-image-meta');top.append(handle('图片排序','image',item.id,c.items),node('span','gl-origin',originLabel(item.origin)));
   const media=node('div','gl-thumbnail'),img=node('img');img.src=imageSource(item.src);img.alt=item.name;img.loading='lazy';img.draggable=false;
   img.onerror=()=>{media.replaceChildren(node('span','','图片加载失败'),action('重新加载',()=>{media.replaceChildren(img);img.src=imageSource(item.src);},'link'));};media.append(img);
   const label=node('div','gl-image-label');label.append(node('strong','',item.name),node('small','',`${item.width} × ${item.height} px`));
   const controls=node('div','gl-card-actions');controls.append(action('改名',()=>nameEditor('image',item.id),'link'),action('替换',()=>chooseFiles(c.id,item.id),'link'),action('移除',()=>deleteImage(c,item),'link danger'));
   const order=node('div','gl-card-order');const up=action('↑',()=>move(c.items,item.id,index-1),'gl-order-button'),down=action('↓',()=>move(c.items,item.id,index+1),'gl-order-button');up.disabled=saving||index===0;down.disabled=saving||index===c.items.length-1;up.title='上移';down.title='下移';up.setAttribute('aria-label','上移 '+item.name);down.setAttribute('aria-label','下移 '+item.name);order.append(up,down);controls.append(order);el.append(top,media,label,controls);return el;
  }
  function draw(){
   if(!alive||!draft)return;
   const oldList=app.querySelector('.gl-category-list')?.scrollTop||0,oldContent=app.querySelector('.gl-content-scroll')?.scrollTop||0;
   const page=node('section','gl-page'),header=node('header','gl-page-head'),heading=node('div','gl-heading'),title=node('h1','','辅助线管理'),state=node('span','gl-draft-state'+(dirty()?' is-dirty':''),saving?'正在保存…':dirty()?'有未保存更改':'本地配置');
   title.append(state);heading.append(title,node('p','',`${A.tenantInfo?.name||tenant} · 修改只保存在此浏览器，尚未与真实 PC 联通。`));
   const commands=node('div','gl-main-actions'),saveButton=action(saving?'保存中…':'保存更改',()=>save(),'primary');saveButton.disabled=saving||!dirty();saveButton.dataset.action='save';
   commands.append(action('预览 PC 效果',()=>{if(!window.AdminGuideLinePreview){A.toast('预览暂不可用，请稍后重试');return;}window.AdminGuideLinePreview.open({categories:copy(draft.categories),dirty:dirty(),tenantLabel:A.tenantInfo?.name||tenant});}),saveButton);header.append(heading,commands);page.append(header);
   const note=node('div','gl-source-note',(draft.sourceNote||'当前初始素材为本地演示来源，不代表本店最新生产清单。')+' 初始分类和图片均可编辑。');page.append(note);
   if(error){const msg=node('div','gl-page-error');msg.setAttribute('role','alert');msg.append(node('span','',error),action('关闭提示',()=>{error='';draw();},'link'));page.append(msg);}
   const workspace=node('div','gl-workspace'),sidebar=node('aside','gl-categories'),sidehead=node('div','gl-side-head');sidehead.append(node('strong','','分类'),action('＋ 新增',()=>nameEditor('category'),'link'));sidebar.append(sidehead);
   const list=node('div','gl-category-list');list.setAttribute('aria-label','辅助线分类');
   draft.categories.forEach(c=>{const row=node('div','gl-category'+(c.id===selected?' active':''));row.dataset.categoryId=c.id;sorting(row,'category',c.id,draft.categories);
    const pick=action('',()=>{selected=c.id;draw();},'gl-category-pick');pick.setAttribute('aria-pressed',String(c.id===selected));pick.append(node('span','gl-category-name',c.name),node('small','',`${c.items.length} 张${c.enabled?'':' · 已停用'}`));row.append(handle('分类排序','category',c.id,draft.categories),pick);list.append(row);
   });if(!draft.categories.length)list.append(node('p','gl-muted gl-side-empty','尚无分类'));sidebar.append(list,node('p','gl-sort-note','拖动 ⠿ 排序，或聚焦后按 Alt + ↑ / ↓'));workspace.append(sidebar);
   const main=node('main','gl-main'),c=current();if(!c){main.append(empty('当前配置为空','添加分类后，即可批量添加透明 PNG 辅助线。已删除的分类不会自动恢复。',action('新增分类',()=>nameEditor('category'),'primary')));}
   else{
    const toolbar=node('div','gl-content-head'),info=node('div','gl-category-heading'),name=node('h2','',c.name);name.append(node('span','gl-origin',originLabel(c.origin)));info.append(name,node('p','',`${c.items.length} 张图片 · ${c.enabled?'已启用，可在 PC 效果预览中选择':'已停用，PC 效果预览中不展示'}`));
    const actions=node('div','gl-category-actions'),toggle=action(c.enabled?'停用':'启用',()=>{c.enabled=!c.enabled;changed();},c.enabled?'':'gl-enable');toggle.setAttribute('aria-label',(c.enabled?'停用':'启用')+'分类');actions.append(toggle,action('改名',()=>nameEditor('category',c.id)),action('删除分类',()=>deleteCategory(c),'danger'),action('批量添加 PNG',()=>chooseFiles(c.id),'primary'));toolbar.append(info,actions);main.append(toolbar);
    const scroll=node('div','gl-content-scroll');if(!draft.categories.some(x=>x.enabled))scroll.append(node('div','gl-disabled-note','全部分类已停用。启用分类后，才会出现在 PC 效果预览中。'));
    const upload=queuePanel(c);if(upload)scroll.append(upload);
    if(c.items.length){const grid=node('div','gl-image-grid');c.items.forEach((item,i)=>grid.append(card(c,item,i)));scroll.append(grid);}else scroll.append(empty('这个分类还没有图片','支持透明 PNG，每张不超过 10MiB；批量添加后可调整顺序。',action('选择 PNG 图片',()=>chooseFiles(c.id),'primary')));
    main.append(scroll);
   }
   workspace.append(main);page.append(workspace);app.replaceChildren(page);app.querySelector('.gl-category-list').scrollTop=oldList;if(app.querySelector('.gl-content-scroll'))app.querySelector('.gl-content-scroll').scrollTop=oldContent;
   document.body.dataset.guideReady='true';document.body.dataset.guideDirty=String(dirty());
  }
  async function save(){
   if(!draft||saving)return false;
   if(unresolved().length){error='还有图片正在处理或处理失败。请先重试、重新选择或移除这些图片，再保存。';selected=unresolved()[0].categoryId;draw();return false;}
   const validation=M.validate(draft);if(!validation.ok){error=validation.error||'请检查分类和图片信息后重试';draw();return false;}
   saving=true;error='';draw();const snapshot=copy(draft),saveEpoch=epoch;
   try{const result=await M.save(tenant,snapshot);if(!alive||epoch!==saveEpoch)return false;if(!result?.ok)throw new Error(result?.error||'本地保存失败，请重试');saved=copy(snapshot);queue=[];A.toast('已保存到本地原型，未与真实 PC 同步');return true;}
   catch(e){if(alive&&epoch===saveEpoch)error=(e.message||'本地保存失败')+'；草稿已保留，请重试。';return false;}
   finally{if(alive&&epoch===saveEpoch){saving=false;draw();}}
  }
  function discard(){epoch++;queue.forEach(q=>q.token++);queue=[];draft=copy(saved);if(!category(selected))selected=draft.categories[0]?.id||null;error='';draw();}
  function requestLeave(){
   if(leavePromise)return leavePromise;
   if(!dirty()){window.AdminGuideLinePreview?.close?.();dialogCleanup?.();A.closeDialog();return Promise.resolve(true);}
   window.AdminGuideLinePreview?.close?.();
   leavePromise=new Promise(resolve=>{
    let settled=false;const finish=value=>{if(settled)return;settled=true;resolve(value);};
    const body=node('div','gl-confirm');body.append(node('p','','当前辅助线配置有未保存更改。离开前要保存吗？'),node('p','gl-muted','放弃更改后，重新打开只恢复上一次本地保存的配置。'));const feedback=node('p','gl-form-error');body.append(feedback);
    let d;d=present('离开辅助线管理',body,[{label:'继续编辑',run:()=>{finish(false);A.closeDialog();}},{label:'放弃更改',cls:'danger',run:()=>{discard();finish(true);A.closeDialog();}},{label:'保存并离开',cls:'primary',run:async()=>{
     d.querySelectorAll('button').forEach(b=>b.disabled=true);const ok=await save();if(ok){finish(true);A.closeDialog();}else{feedback.textContent=error;d.querySelectorAll('button').forEach(b=>b.disabled=false);}
    }}],()=>finish(false));
   }).finally(()=>{leavePromise=null;});return leavePromise;
  }
  const beforeUnload=e=>{if(dirty()){e.preventDefault();e.returnValue='';}};window.addEventListener('beforeunload',beforeUnload);
  disposePrevious=()=>{alive=false;epoch++;queue.forEach(q=>q.token++);dialogCleanup?.();window.removeEventListener('beforeunload',beforeUnload);};
  window.AdminGuideLinesPage={isDirty:dirty,requestLeave,save};
  if(qa)window.AdminGuideLinesQA={getState:()=>({saved:copy(saved),draft:copy(draft),dirty:dirty(),queue:queue.map(({file,...q})=>copy(q))}),failNextProcessing:(count=1)=>{failNext=count;},setProcessingDelay:ms=>{processingDelay=Math.max(0,Number(ms)||0);},enqueue:(files,categoryId=selected,replaceItemId)=>enqueue(Array.from(files),categoryId,replaceItemId)};
  else delete window.AdminGuideLinesQA;
  document.body.classList.add('guide-lines-content');
  if(!M?.isEligible(tenant)){app.replaceChildren(empty('当前租户未开放辅助线管理','请从工具管理进入当前租户可用的功能。'));document.body.dataset.guideReady='true';return;}
  async function load(){app.replaceChildren(node('div','gl-loading','正在读取辅助线配置…'));try{const config=await M.load(tenant);if(!alive)return;if(!config||!Array.isArray(config.categories))throw new Error('没有可读取的辅助线配置');saved=copy(config);draft=copy(config);selected=draft.categories[0]?.id||null;draw();}catch(e){if(!alive)return;const failed=empty('辅助线配置读取失败',e.message||'请稍后重试，现有本地配置不会被覆盖。',action('重新读取',load));app.replaceChildren(failed);document.body.dataset.guideReady='error';}}
  await load();
 }
 return {render};
})();
