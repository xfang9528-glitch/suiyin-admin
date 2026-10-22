// #4746 管理后台弱口令强制改密：无头浏览器自检
// 用法：在仓根目录 `node serve.js`（端口 5200）后执行
//   BASE=http://127.0.0.1:5200 OUT=<截图目录，可省略> CHROME=<Chrome 可执行文件> node check-weak-password.cjs
// 依赖 playwright-core（NODE_PATH 指向已安装它的 node_modules 即可）。
// 收集 pageerror 与 console error；任一断言失败或出现 JS 错误则退出码非 0。
// 浏览器自动请求的 /favicon.ico 404 不是页面错误（login_v1.0.html 在 master 上同样存在），单独列出不计入。
const {chromium} = require('playwright-core');
const path = require('path');
const fs = require('fs');
const BASE = (process.env.BASE || 'http://127.0.0.1:5200') + '/prototype/';
const OUT = process.env.OUT || '';
const EXE = process.env.CHROME || process.env.HOME + '/Library/Caches/ms-playwright/chromium-1243/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';
const results = [];
const errors = [];
const notes = [];
const ok = (name, cond, extra = '') => { results.push({name, pass: !!cond, extra}); console.log((cond ? 'PASS ' : 'FAIL ') + name + (extra ? ' — ' + extra : '')); };

(async () => {
  const browser = await chromium.launch({executablePath: EXE});
  const ctx = await browser.newContext({viewport: {width: 1440, height: 900}, deviceScaleFactor: 1});
  const open = async (url) => {
    const p = await ctx.newPage();
    p.on('pageerror', e => errors.push(url + ' pageerror: ' + e.message));
    p.on('console', m => { if (m.type() === 'error') ((m.location().url || '').endsWith('/favicon.ico') ? notes : errors).push(url + ' console: ' + m.text() + ' @ ' + (m.location().url || '')); });
    p.on('dialog', d => { p.__lastDialog = d.message(); d.accept(); });
    await p.goto(BASE + url);
    await p.waitForTimeout(400);
    return p;
  };
  const shot = async (p, name) => { if (OUT) { await p.waitForTimeout(300); await p.screenshot({path: path.join(OUT, name)}); } };
  const text = (p, sel) => p.$eval(sel, e => e.textContent.trim()).catch(() => null);
  const visible = (p, sel) => p.$eval(sel, e => !!(e.offsetWidth || e.offsetHeight) && getComputedStyle(e).display !== 'none' && !e.hidden).catch(() => false);
  const errText = p => p.$$eval('#viewForce .f-err', es => es.map(e => e.textContent));
  const login = async p => { await p.click('#viewLogin .btn-primary'); await p.waitForTimeout(800); };
  const fill2 = async (p, a, b) => { await p.fill('#forceNew', a); await p.fill('#forceConfirm', b ?? a); };

  // ---- 回归：原登录 / 忘记密码 ----
  {
    const p = await open('login_v1.0.html');
    ok('登录框 maxlength=20', await p.$eval('#loginPwd', e => e.maxLength) === 20);
    ok('登录框占位符不再写 6-16 位', !(await p.$eval('#loginPwd', e => e.placeholder)).includes('6-16'));
    await p.click('.forgot-link'); await p.waitForTimeout(100);
    ok('忘记密码第 1 步可见 + 返回登录', await visible(p, '#viewStep1') && (await text(p, '#backBar')) === '‹ 返回登录');
    await p.click('#viewStep1 .btn-primary');
    ok('忘记密码第 2 步可见，新密码框 maxlength=20', await visible(p, '#viewStep2') && await p.$eval('#newPwd1', e => e.maxLength) === 20);
    await p.click('#viewStep2 .btn-primary');
    ok('忘记密码第 3 步「重置成功」', await visible(p, '#viewStep3') && (await text(p, '#viewStep3 .success-msg')).includes('已成功重置密码'));
    await p.goto(BASE + 'login_v1.0.html'); await p.waitForTimeout(200);
    await p.click('.forgot-link'); await p.click('#backBar');
    ok('忘记密码「返回登录」回登录页', await visible(p, '#viewLogin') && !(await visible(p, '#backBar')));
    await login(p);
    ok('无演示参数时登录进入 Shell', p.url().includes('_shell.html'));
    await p.close();
  }

  // ---- 提示期即强制：登录直达第 2 步 ----
  for (const [reason, expect, file] of [['weak', '你的密码过于简单，容易被他人登录，请修改后继续使用', '01-forced-warn-step2.png'], ['security', '为保障账号安全，管理员账号需要修改一次密码', '02-forced-security.png'], ['default', '你的密码过于简单', null], ['unknown-x', '你的密码过于简单', null]]) {
    const p = await open('login_v1.0.html?qa=1&pwState=warn&pwReason=' + reason);
    await login(p);
    const reasonText = await text(p, '#forceReason');
    ok('warn/' + reason + ' 登录后直达强制改密第 2 步', await visible(p, '#forcePane2') && await p.$eval('#forceSteps .step-item:nth-child(1)', e => e.classList.contains('done')), reasonText);
    ok('warn/' + reason + ' 原因文案', reasonText.startsWith(expect));
    ok('warn/' + reason + ' 左上为「退出登录」、常驻提示', (await text(p, '#backBar')) === '‹ 退出登录' && (await text(p, '#forceTip')) === '请不要和同事使用同一个密码');
    if (file) await shot(p, file);
    await p.close();
  }
  {
    const p = await open('login_v1.0.html?qa=1&pwState=enforced');
    await login(p);
    ok('enforced 登录后同样直达第 2 步', await visible(p, '#forcePane2'));
    await p.click('#backBar');
    ok('退出登录回登录页且内存清空', await visible(p, '#viewLogin') && await p.evaluate(() => memOld) === '');
    await p.close();
  }

  // ---- 强度规则 6 条，按顺序只显示第一条 ----
  {
    const p = await open('login_v1.0.html?qa=1&pwState=warn');
    await p.fill('#loginPwd', 'Old12345'); await login(p);
    const cases = [
      ['abc 123', 'abc 123', '密码只能包含英文字母、数字和英文符号，不能有空格'],
      ['Ab1234', 'Ab1234', '密码长度需为 8–20 位'],
      ['abcdefgh', 'abcdefgh', '密码需同时包含字母和数字'],
      ['ab621527x', 'ab621527x', '密码不能包含手机号'],
      ['Old12345', 'Old12345', '新密码不能与旧密码相同'],
      ['suiyin2026', 'suiyin2027', '两次输入的密码不一致'],
    ];
    for (const [a, b, msg] of cases) {
      await fill2(p, a, b); await p.click('#forceSubmit');
      const errs = await errText(p);
      ok('规则：' + msg, errs.length === 1 && errs[0] === msg, errs.join('|'));
      if (msg === '密码长度需为 8–20 位') { await p.click('#forcePane2 .eye-btn'); await shot(p, '03-rule-length.png'); await p.click('#forcePane2 .eye-btn'); }
    }
    await fill2(p, 'suiyin2026'); await p.waitForTimeout(50);
    ok('改对后报错实时消失', (await errText(p)).length === 0);
    ok('新密码框 maxlength=20', await p.$eval('#forceNew', e => e.maxLength) === 20 && await p.$eval('#forceConfirm', e => e.maxLength) === 20);
    await p.click('#forceSubmit'); await p.waitForTimeout(200);
    ok('提交成功进入第 3 步「修改成功」', await visible(p, '#forcePane3') && await p.$eval('#forceSteps .step-item:nth-child(3)', e => e.classList.contains('active')) && !(await visible(p, '#backBar')));
    await shot(p, '05-success.png');
    await p.waitForTimeout(3300);
    ok('成功倒计时后进入系统', p.url().includes('_shell.html'));
    await p.close();
  }

  // ---- 40020 三种 ----
  for (const [code, msg] of [['40020', '密码太常见，请换一个'], ['40020-default', '新密码不能是默认密码或手机号'], ['40020-used', '新密码不能与以前用过的密码相同']]) {
    const p = await open('login_v1.0.html?qa=1&pwState=warn&pwResult=' + code);
    await login(p); await fill2(p, 'Aa123456'); await p.click('#forceSubmit');
    const errs = await errText(p);
    ok(code + ' 标在新密码框', errs[0] === msg && await p.$eval('#forceNew', e => e.parentNode.classList.contains('err')), errs.join('|'));
    if (code === '40020') await shot(p, '04-e40020.png');
    await p.click('#forceSubmit'); await p.waitForTimeout(100);
    ok(code + ' 只演示一次，再次提交成功', await visible(p, '#forcePane3'));
    await p.close();
  }

  // ---- 旧密码错误 code 401：回第 1 步并清内存 ----
  {
    const p = await open('login_v1.0.html?qa=1&pwState=warn&pwResult=401');
    await login(p); await fill2(p, 'suiyin2026'); await p.click('#forceSubmit');
    const errs = await errText(p);
    ok('401 回第 1 步旧密码框标红', await visible(p, '#forcePane1') && errs[0] === '旧密码错误，或密码刚在其他设备上修改过' && await p.$eval('#forceOld', e => e.parentNode.classList.contains('err')));
    ok('401 清掉内存旧密码', await p.evaluate(() => memOld) === '');
    ok('第 1 步手机号只读遮罩', await p.$eval('#forcePhone', e => e.disabled && e.value === '185****1527'));
    await shot(p, '06-e401-step1.png');
    await p.click('#forceNext');
    ok('第 1 步空旧密码提示', (await errText(p))[0] === '请输入旧密码');
    await p.fill('#forceOld', 'Old12345'); await p.click('#forceNext');
    ok('输入旧密码回第 2 步、新密码草稿保留', await visible(p, '#forcePane2') && await p.$eval('#forceNew', e => e.value) === 'suiyin2026');
    await p.click('#forceSubmit'); await p.waitForTimeout(100);
    ok('401 后重新提交成功', await visible(p, '#forcePane3'));
    await p.close();
  }

  // ---- 428 进入：从第 1 步开始 ----
  {
    const p = await open('login_v1.0.html?qa=1&pwState=428');
    ok('428 打开即强制改密第 1 步', await visible(p, '#forcePane1') && await p.$eval('#forceSteps .step-item:nth-child(1)', e => e.classList.contains('active')) && (await text(p, '#backBar')) === '‹ 退出登录');
    await shot(p, '07-from428-step1.png');
    await p.fill('#forceOld', 'Old12345'); await p.click('#forceNext');
    await fill2(p, 'Old12345'); await p.click('#forceSubmit');
    ok('428 输入的旧密码参与规则 5', (await errText(p))[0] === '新密码不能与旧密码相同');
    await p.close();
  }

  // ---- 42900 倒计时，不自动重发 ----
  {
    const p = await open('login_v1.0.html?qa=1&pwState=warn&pwResult=42900&retryAfterSec=3');
    await login(p); await fill2(p, 'suiyin2026'); await p.click('#forceSubmit'); await p.waitForTimeout(100);
    const b = await p.$eval('#forceSubmit', e => ({d: e.disabled, t: e.textContent, o: e.style.opacity}));
    ok('42900 按钮禁用 + 「请 n 秒后重试」', b.d && b.t === '请 3 秒后重试' && b.o === '0.8', JSON.stringify(b));
    ok('42900 话术同步倒计时', (await text(p, '#forceCdHint')) === '当前登录人数较多，请 3 秒后重试');
    await shot(p, '08-e42900.png');
    await p.waitForTimeout(3300);
    const b2 = await p.$eval('#forceSubmit', e => ({d: e.disabled, t: e.textContent}));
    ok('42900 结束后恢复「确认修改」且未自动重发', !b2.d && b2.t === '确认修改' && await visible(p, '#forcePane2') && !(await visible(p, '#forceCdHint')));
    await p.close();
  }

  // ---- 50020 / 网络错误 / 5xx：回登录页 + toast ----
  for (const [code, msg, file] of [['50020', '密码已修改，请用新密码登录', null], ['neterr', '密码可能已修改成功，请用新密码登录', '09-neterr-login.png'], ['5xx', '密码可能已修改成功，请用新密码登录', null]]) {
    const p = await open('login_v1.0.html?qa=1&pwState=warn&pwResult=' + code);
    await login(p); await fill2(p, 'suiyin2026'); await p.click('#forceSubmit'); await p.waitForTimeout(150);
    ok(code + ' 回登录页 + toast', await visible(p, '#viewLogin') && (await text(p, '#toast')) === msg && await visible(p, '#toast') && await p.evaluate(() => memOld) === '');
    if (file) await shot(p, file);
    await p.close();
  }

  // ---- 401 password_changed ----
  {
    const p = await open('login_v1.0.html?qa=1&pwState=password_changed');
    ok('password_changed 登录页提示', await visible(p, '#viewLogin') && (await text(p, '#toast')) === '密码已被修改，请向使用该账号的同事获取新密码');
    await shot(p, '10-password-changed.png');
    await p.close();
  }

  // ---- 42910 三种锁 ----
  for (const [k, msg] of [['lock-account', '该账号在当前网络登录失败次数过多，请 15 分钟后再试，或联系管理员重置密码'], ['lock-ip', '当前网络登录失败次数过多，请 15 分钟后再试，或换个网络（如改用手机流量）'], ['lock-gate', '登录请求较多，请稍后再试']]) {
    const p = await open('login_v1.0.html?qa=1&pwState=' + k);
    await p.fill('#loginPwd', '12345678'); await login(p);
    ok('42910 ' + k, (await text(p, '#toast')) === msg && await visible(p, '#viewLogin') && !(await p.$eval('#viewLogin .btn-primary', e => e.disabled)));
    if (k === 'lock-account') await shot(p, '11-lock-account.png');
    await p.close();
  }

  // ---- qa 未开启时演示参数无效 ----
  {
    const p = await open('login_v1.0.html?pwState=428');
    ok('无 qa=1 时 pwState 不生效', await visible(p, '#viewLogin'));
    await p.close();
  }

  // ---- Shell 碎银账号 → 重置密码确认弹窗 ----
  {
    const p = await open('_shell.html?tenant=yestar-sz&page=salesManage');
    await p.waitForSelector('iframe.page-frame[src*="route=salesManage"]', {timeout: 15000});
    const f = await (await p.$('iframe.page-frame[src*="route=salesManage"]')).contentFrame();
    await f.waitForSelector('button[data-source-label="重置密码"]', {timeout: 15000});
    const btn = await f.$('button[data-source-label="重置密码"]');
    await btn.click(); await p.waitForTimeout(400);
    const dlg = await f.$eval('#dialog', d => ({open: d.open, cls: d.className, title: d.querySelector('#dialogTitle').textContent, msg: d.querySelector('.menu-delete-message p')?.textContent, inputs: d.querySelectorAll('input,textarea').length, buttons: [...d.querySelectorAll('footer button')].map(b => b.textContent.trim())}));
    ok('重置密码弹 .menu-delete-dialog 确认框', dlg.open && dlg.cls.includes('menu-delete-dialog') && dlg.title === '重置密码', JSON.stringify(dlg));
    ok('确认框定稿文案、无新密码输入框', dlg.msg.includes('重置后新密码为该账号手机号后 6 位，对方下次登录必须先修改密码；此操作会记录审计日志') && dlg.inputs === 0 && dlg.buttons.join(',') === '取消,确定');
    await shot(p, '12-shell-reset-confirm.png');
    await f.click('#dialogFooter button:has-text("取消")'); await p.waitForTimeout(200);
    ok('取消关闭弹窗', !(await f.$eval('#dialog', d => d.open)));
    await btn.click(); await p.waitForTimeout(300);
    await f.click('#dialogFooter button:has-text("确定")'); await p.waitForTimeout(300);
    ok('确定后关闭并 #toast 回显', !(await f.$eval('#dialog', d => d.open)) && (await f.$eval('#toast', t => t.textContent)) === '重置成功，对方下次登录需先修改密码' && await f.$eval('#toast', t => t.classList.contains('visible')));
    await shot(p, '13-shell-reset-toast.png');
    // 回归：同页编辑弹窗仍是表单
    await f.click('button[data-source-label="编辑"]'); await p.waitForTimeout(300);
    const edit = await f.$eval('#dialog', d => ({open: d.open, cls: d.className, inputs: d.querySelectorAll('input,select,textarea').length}));
    ok('回归：碎银账号「编辑」仍是表单弹窗', edit.open && !edit.cls.includes('menu-delete-dialog') && edit.inputs > 0, JSON.stringify({open: edit.open, cls: edit.cls}));
    await p.close();
  }
  {
    const p = await open('_shell.html?tenant=yestar-sz&page=menu');
    await p.waitForSelector('iframe.page-frame[src*="route=menu&"]', {timeout: 15000});
    const f = await (await p.$('iframe.page-frame[src*="route=menu&"]')).contentFrame();
    await f.waitForSelector('button:has-text("删除")', {timeout: 15000});
    await f.click('button:has-text("删除")'); await p.waitForTimeout(300);
    const d = await f.$eval('#dialog', d => ({open: d.open, cls: d.className, msg: d.querySelector('.menu-delete-message p')?.textContent}));
    ok('回归：菜单管理「确认删除菜单?」不受影响', d.open && d.cls.includes('menu-delete-dialog') && d.msg === '确认删除菜单?', JSON.stringify(d));
    await f.click('#dialogFooter button:has-text("取消")');
    await p.close();
  }

  // ---- 碎银账号旧页 sales_v1.0.html ----
  {
    const p = await open('sales_v1.0.html');
    await p.click('button:has-text("重置密码")'); await p.waitForTimeout(200);
    ok('sales_v1.0 重置确认为定稿文案、不提短信', (p.__lastDialog || '').includes('重置后新密码为该账号手机号后 6 位，对方下次登录必须先修改密码；此操作会记录审计日志') && !(p.__lastDialog || '').includes('短信'), p.__lastDialog);
    ok('sales_v1.0 确定后 toast 回显', (await text(p, '#toast')) === '重置成功，对方下次登录需先修改密码');
    await p.close();
  }

  await browser.close();
  const failed = results.filter(r => !r.pass);
  const summary = `${results.length - failed.length}/${results.length} passed; JS errors: ${errors.length}`;
  console.log('\n' + summary);
  errors.forEach(e => console.log('  ' + e));
  if (notes.length) console.log('notes (not counted):\n  ' + [...new Set(notes)].join('\n  '));
  if (process.env.REPORT) fs.writeFileSync(process.env.REPORT, results.map(r => (r.pass ? 'PASS ' : 'FAIL ') + r.name).join('\n') + '\n\n' + summary + '\n' + errors.join('\n') + (notes.length ? '\nnotes (not counted):\n' + [...new Set(notes)].join('\n') : '') + '\n');
  process.exit(failed.length || errors.length ? 1 : 0);
})();
