/* ========= 通用编辑/创建弹窗工具 v1 =========
   使用：
   const m = createEditModal({
     title: '修改销售',
     fields: [
       { label:'销售名称', key:'name', type:'text', placeholder:'请输入销售名称' },
       { label:'权限角色', key:'role', type:'select', options:['管理员','销售经理','销售'] },
       ...
     ],
     onSubmit: (data) => { console.log(data); }
   });
   m.open(rowData);  // 打开并填充已有数据
*/
function createEditModal({ title, fields, onSubmit, width = 560 }) {
  const id = 'em_' + Math.random().toString(36).slice(2, 8);
  const fieldsHtml = fields.map(f => {
    if (f.type === 'select') {
      return `
        <div class="form-row" data-key="${f.key}">
          <label>${f.required ? '<span class="req">*</span>' : ''}${f.label}</label>
          <select class="em-input" data-key="${f.key}">
            <option value="">${f.placeholder || '请选择'}</option>
            ${(f.options || []).map(o => `<option value="${typeof o === 'string' ? o : o.value}">${typeof o === 'string' ? o : o.label}</option>`).join('')}
          </select>
        </div>`;
    }
    if (f.type === 'textarea') {
      return `
        <div class="form-row" data-key="${f.key}">
          <label>${f.required ? '<span class="req">*</span>' : ''}${f.label}</label>
          <textarea class="em-input" data-key="${f.key}" placeholder="${f.placeholder || ''}"></textarea>
        </div>`;
    }
    if (f.type === 'switch') {
      return `
        <div class="form-row" data-key="${f.key}">
          <label>${f.label}</label>
          <label class="switch"><input type="checkbox" class="em-input" data-key="${f.key}"><span class="switch-slider"></span></label>
        </div>`;
    }
    if (f.type === 'tags') {
      return `
        <div class="form-row" data-key="${f.key}">
          <label>${f.required ? '<span class="req">*</span>' : ''}${f.label}</label>
          <div class="em-tags" data-key="${f.key}">
            ${(f.options || []).map(o => `<label style="margin-right:10px;font-size:12.5px;"><input type="checkbox" value="${o}"> ${o}</label>`).join('')}
          </div>
        </div>`;
    }
    if (f.type === 'radio') {
      return `
        <div class="form-row" data-key="${f.key}">
          <label>${f.required ? '<span class="req">*</span>' : ''}${f.label}</label>
          <div data-key="${f.key}">
            ${(f.options || []).map((o,i) => `<label style="margin-right:14px;font-size:13px;"><input type="radio" name="em-${id}-${f.key}" value="${typeof o==='string'?o:o.value}" ${i===0?'checked':''}> ${typeof o==='string'?o:o.label}</label>`).join('')}
          </div>
        </div>`;
    }
    if (f.type === 'image') {
      return `
        <div class="form-row" data-key="${f.key}">
          <label>${f.required ? '<span class="req">*</span>' : ''}${f.label}</label>
          <div style="display:flex;gap:8px;align-items:center;">
            <div style="width:80px;height:80px;border:1.5px dashed #d0d7de;border-radius:6px;display:flex;align-items:center;justify-content:center;color:var(--text-3);font-size:11.5px;">+ 上传</div>
            <div style="font-size:11.5px;color:var(--text-3);">JPG / PNG，建议 750×750，≤ 2MB</div>
          </div>
        </div>`;
    }
    if (f.type === 'rich') {
      return `
        <div class="form-row" data-key="${f.key}">
          <label>${f.required ? '<span class="req">*</span>' : ''}${f.label}</label>
          <div style="border:1px solid #d0d7de;border-radius:4px;">
            <div style="padding:6px 10px;border-bottom:1px solid var(--border);font-size:12px;color:var(--text-3);">B / I / U · 链接 · 图片 · 视频 · 列表（占位）</div>
            <textarea class="em-input" data-key="${f.key}" style="border:none;min-height:120px;width:100%;outline:none;padding:8px 10px;font-family:inherit;" placeholder="${f.placeholder || '请输入富文本内容'}"></textarea>
          </div>
        </div>`;
    }
    // text / number / tel
    return `
      <div class="form-row" data-key="${f.key}">
        <label>${f.required ? '<span class="req">*</span>' : ''}${f.label}</label>
        <input class="em-input" data-key="${f.key}" type="${f.type || 'text'}" placeholder="${f.placeholder || ''}" ${f.suffix ? `style="display:inline-block;width:calc(100% - 40px);"` : ''}>
        ${f.suffix ? `<span style="margin-left:6px;color:var(--text-3);font-size:13px;">${f.suffix}</span>` : ''}
      </div>`;
  }).join('');

  const html = `
    <div class="modal-mask" id="${id}-mask">
      <div class="modal" style="width:${width}px;">
        <div class="modal-header">
          <span>${title}</span>
          <button class="modal-close" id="${id}-close">✕</button>
        </div>
        <div class="modal-body">${fieldsHtml}</div>
        <div class="modal-footer">
          <button class="btn" id="${id}-cancel">取消</button>
          <button class="btn primary" id="${id}-ok">确认</button>
        </div>
      </div>
    </div>
  `;
  const wrap = document.createElement('div');
  wrap.innerHTML = html;
  document.body.appendChild(wrap.firstElementChild);

  const mask = document.getElementById(`${id}-mask`);
  document.getElementById(`${id}-close`).onclick = close;
  document.getElementById(`${id}-cancel`).onclick = close;
  document.getElementById(`${id}-ok`).onclick = submit;

  function close() { mask.classList.remove('show'); }
  function open(data = {}) {
    fields.forEach(f => {
      const el = mask.querySelector(`[data-key="${f.key}"].em-input`) || mask.querySelector(`[data-key="${f.key}"]`);
      if (!el) return;
      const v = data[f.key];
      if (f.type === 'switch') {
        const cb = mask.querySelector(`input[data-key="${f.key}"]`);
        if (cb) cb.checked = !!v;
      } else if (f.type === 'radio') {
        const r = mask.querySelector(`input[name="em-${id}-${f.key}"][value="${v}"]`);
        if (r) r.checked = true;
      } else if (f.type === 'tags') {
        const arr = Array.isArray(v) ? v : [];
        mask.querySelectorAll(`.em-tags[data-key="${f.key}"] input`).forEach(cb => {
          cb.checked = arr.includes(cb.value);
        });
      } else if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') {
        el.value = v == null ? '' : v;
      }
    });
    mask.classList.add('show');
  }
  function submit() {
    const data = {};
    fields.forEach(f => {
      if (f.type === 'switch') {
        data[f.key] = mask.querySelector(`input[data-key="${f.key}"]`)?.checked || false;
      } else if (f.type === 'radio') {
        data[f.key] = mask.querySelector(`input[name="em-${id}-${f.key}"]:checked`)?.value || '';
      } else if (f.type === 'tags') {
        data[f.key] = Array.from(mask.querySelectorAll(`.em-tags[data-key="${f.key}"] input:checked`)).map(c => c.value);
      } else {
        data[f.key] = mask.querySelector(`[data-key="${f.key}"].em-input`)?.value || '';
      }
    });
    if (onSubmit) onSubmit(data);
    close();
  }
  return { open, close };
}
