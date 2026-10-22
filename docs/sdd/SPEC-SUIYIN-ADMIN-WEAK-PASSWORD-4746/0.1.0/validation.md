# validation · WEAK-PASSWORD-4746@0.1.0

## 自检

脚本：[checks/check-weak-password.cjs](checks/check-weak-password.cjs)，本次结果：[checks/last-run.txt](checks/last-run.txt)。

```
node serve.js            # 仓根目录，端口 5200
NODE_PATH=<含 playwright-core 的 node_modules> OUT=<截图目录> REPORT=<结果文件> \
  node docs/sdd/SPEC-SUIYIN-ADMIN-WEAK-PASSWORD-4746/0.1.0/checks/check-weak-password.cjs
```

视口 1440×900，Chrome for Testing（headless）。结果 **64/64 通过，JS 错误 0**（收集 `pageerror` 与 console error）。唯一 console 404 是浏览器自动请求的 `/favicon.ico`：`login_v1.0.html` 在 master 上就没有 icon 链接，与本次无关，单独列出不计入。

覆盖：

- 回归：登录框 / 忘记密码三步 / 返回登录 / 无演示参数登录进 Shell；碎银账号「编辑」仍为表单弹窗；菜单管理「确认删除菜单?」不变
- 强制改密：warn 与 enforced 登录直达第 2 步；reason default / weak / security / 未知值文案；退出登录清内存
- 6 条规则逐条只显示第一条，改对后实时消失，`maxlength=20`
- 40020 三种、code 401（回第 1 步、清内存、草稿保留、重新提交成功）、428 进入第 1 步且旧密码参与规则 5、42900 倒计时恢复且不自动重发、成功倒计时进 Shell
- 50020、网络错误、5xx、password_changed 回登录页 toast；42910 三种锁；无 `qa=1` 时演示参数不生效
- Shell 碎银账号重置：`.menu-delete-dialog`、定稿文案、无输入框、取消关闭、确定后 `#toast` 回显；`sales_v1.0.html` 确认文案与 toast

另手动验证 `_shell_inline.html`（file://）碎银账号重置确认与 toast，0 错误。

## 配色核对

```
git diff master -- prototype ':!prototype/_shell_inline.html' | grep '^+' | grep -oiE '#[0-9a-f]{3,8}\b|rgba?\([^)]*\)'
```

`_shell_inline.html` 是单行派生产物，整行都会被算作新增，故排除，以其源文件为准。新增色值均为本仓已有色：

| 色值 | 用途 | 本仓已有出处 |
|---|---|---|
| `#e6a23c` `#fdf6ec` | 原因说明提示条、42900 话术 | `_shell.html` `.source-index-alert` |
| `#f56c6c` | 报错红 | `_admin_list.css` 等（Element 错误红） |
| `#253d49eb` `#0002` | 登录页 `#toast` | `admin-content.css` `#toast` |
| `#8a96a3` | 常驻提示 | `login_v1.0.html` `.forgot-link` |
| `#07c160` `#a78bfa` `#60a5fa` `#f59e0b` | 成功态散点 | `login_v1.0.html` 原第 3 步散点（原样复制） |

`#4746` 为注释里的单号，不是色值。

## 截图（evidence/，1200 宽）

| 文件 | 说明 |
|---|---|
| `01-forced-warn-step2.png` | 登录直达强制改密第 2 步，通用原因提示条，左上「退出登录」 |
| `03-rule-length.png` | 强度规则第 2 条报错（新密码 Ab1234） |
| `07-from428-step1.png` | 428 进入第 1 步，手机号只读，输入旧密码 |
| `08-e42900.png` | 42900 按钮禁用「请 3 秒后重试」+ 话术倒计时 |
| `11-lock-account.png` | 42910 账号锁 toast |
| `12-shell-reset-confirm.png` | Shell 碎银账号重置密码确认框 |
