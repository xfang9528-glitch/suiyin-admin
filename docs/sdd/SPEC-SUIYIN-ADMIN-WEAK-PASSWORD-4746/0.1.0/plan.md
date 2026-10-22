# plan · WEAK-PASSWORD-4746@0.1.0

本流程中共用任务书即批准，未另走房总审批。

1. 读定稿「接口契约 / 强度规则 / 客户端跳转 / 附」与设计稿 `admin.html`、`README.md` 管理后台表，确认复用组件：`login_v1.0.html` 忘记密码流程、`_shell.html` `.source-index-alert`、`admin-content.css` `#toast`、`admin-menu-tree` `.menu-delete-dialog`。
2. 找现有演示切换方式：本仓用 `qa=1` + `usageState` / `costState` 等 URL 参数，登录页沿用为 `pwState` / `pwReason` / `pwResult`。
3. 登录页：新增 `viewForce`（与忘记密码同结构），内联规则与文案常量（照设计稿 `PW`），错误处理、42900 倒计时、成功倒计时；登录按钮按 `pwState` 分支；新增 `#toast`；改 `maxlength` 与占位符。
4. Shell 碎银账号：`admin-content.js` 的「重置密码」从通用「新密码」表单拆出，调用 `AdminMenu.present(...,'delete')` 复用删除确认框；`admin-menu-tree.js` 导出 `present`；CSS 加两行修饰。
5. `sales_v1.0.html` 重置确认文案同步。
6. 重新生成 `_shell_inline.html`，验证单文件内同一交互。
7. 无头浏览器自检 `checks/check-weak-password.cjs`：全部状态、原流程回归、0 JS 错误；截图入 `evidence/`。
8. 文档：prd、flowcharts、本 SDD、README/CLAUDE 顶部一行。
