# SPEC-SUIYIN-ADMIN-WEAK-PASSWORD-4746@0.1.0 弱口令强制改密（管理后台原型）

状态：原型实现，待协调者统一开 PR。
来源：
- 后端单 suiyin-go#4746；前端单 [PetWebOrg/suiyin-admin#557](https://github.com/PetWebOrg/suiyin-admin/issues/557)
- 方案定稿 `erio-mind/decisions/design/4746-weak-password-design-v3/final.md`（「接口契约」「强度规则」「客户端跳转」三节及文末「附」）
- 设计稿 `erio-mind/decisions/design/4746-weak-password-design-v3/mockups/admin.html`（复用映射见同目录 `README.md`「管理后台」表）

产品说明：[prd/weak-password.md](../../../../prd/weak-password.md)；流程：[flowcharts/weak-password.md](../../../../flowcharts/weak-password.md)。

## 范围

只改原型：`prototype/login_v1.0.html`（强制改密、42910、长度上限）、`admin-content.js` + `admin-menu-tree.js/css`（Shell 碎银账号重置密码确认）、`sales_v1.0.html`（旧页重置确认文案）、重新生成 `_shell_inline.html`。不接真实认证，不新增独立 html 入口。

## 规则

| # | 规则 |
|---|---|
| R1 | 登录返回需要改密时，warn 与 enforced 都进入强制改密页（D2），出口只有改密成功和「退出登录」 |
| R2 | 强制改密页沿用「忘记密码」三步流程的卡片、绿色标题、步骤条、胶囊输入框、主按钮；步骤为 校验身份 / 设置密码 / 修改成功；左上为「‹ 退出登录」 |
| R3 | 原因说明用 `.source-index-alert` 黄色提示条：security 显示定稿原文，其余 reason 显示通用文案 |
| R4 | 登录直达从第 2 步开始（旧密码在内存）；428 进入从第 1 步输入旧密码开始（附第 3 条） |
| R5 | 6 条强度规则按顺序只显示第一条没过的；手机号用 18515621527；常驻提示「请不要和同事使用同一个密码」 |
| R6 | 40020 标在新密码框；code 401 回第 1 步、旧密码框标红、清内存旧密码、保留新密码草稿 |
| R7 | 42900：按钮用「登录中...」同款禁用写法，显示「请 n 秒后重试」并同步话术，倒计时结束恢复，不自动重发 |
| R8 | 成功：第 3 步 `.success-icon` + 倒计时进入系统 |
| R9 | 50020 回登录页提示「密码已修改，请用新密码登录」；网络错误 / 5xx 不静默登录，回登录页提示「密码可能已修改成功，请用新密码登录」（附 admin 网络错误条）；均清内存旧密码 |
| R10 | 旧凭证 401 `password_changed`：回登录页并提示「密码已被修改，请向使用该账号的同事获取新密码」（附第 4 条） |
| R11 | 42910 三种锁在登录页用 `#toast` 提示 |
| R12 | 登录框与改密框 `maxlength` ≥ 20（附第 6 条），去掉「6-16位字母加数字」占位符 |
| R13 | 重置密码确认：`.menu-delete-dialog`，文案逐字用附第 5 条；不弹新密码输入框，不提短信；确定后 `#toast` 回显；Shell 与 `sales_v1.0.html` 两处一致 |
| R14 | 原「忘记密码」流程、登录进 Shell、碎银账号编辑、菜单管理删除确认不受影响 |

## 演示入口

沿用本仓 `qa=1` + 状态参数写法，见产品说明「演示入口」表。`pwState`：`warn` / `enforced` / `428` / `password_changed` / `lock-account` / `lock-ip` / `lock-gate`；`pwReason`：`default` / `weak` / `security` / 其他；`pwResult`：`ok` / `40020` / `40020-default` / `40020-used` / `401` / `42900` / `50020` / `neterr` / `5xx`（错误只返回一次）；`retryAfterSec`。

## 偏离设计稿

| 位置 | 设计稿 | 原型 | 原因 |
|---|---|---|---|
| 401 password_changed | 回登录页，无提示 | 加提示「密码已被修改，请向使用该账号的同事获取新密码」 | 定稿附第 4 条 |
| 重置密码确认文案 | 「…重置后该账号下次登录必须先修改密码，此操作会记录审计日志。」 | 首行「确认重置「姓名」的登录密码？」，第二行逐字用附第 5 条 | 定稿附第 5 条；保留设计稿首行指明对象 |
| 确认框高度 | 单行 | `.menu-delete-message` 加 `weak-pw-reset` 修饰：高度自适应、图标顶对齐 | 定稿文案两行放不进原 24px 单行 |
| 登录 / 忘记密码占位符 | 只画了改密框 | 登录框「请输入密码」、忘记密码新密码框「请输入新密码（8-20位，含字母和数字）」「请再次输入新密码」，均 `maxlength=20` | 附第 6 条，原「6-16位字母加数字」与新规则冲突 |
| 登录页 toast | 设计稿 `.toast` 绝对定位 | 登录页新增 `#toast`，样式同 `admin-content.css` 的 `#toast`，显示 4 秒 | 登录页原本没有 toast；42910 等长文案 2.6 秒读不完 |
| 42900 禁用透明度 | 0.6 | 0.8 | 与原型登录按钮「登录中...」一致 |
| 确认框期间来源标注 | — | 弹窗铺满 Shell 时隐藏列表左下角固定的「本租户采样」标注 | 否则会跑到侧栏左下角（同 `refresh-source` 做法） |

warn 但 `enforceAt=null` 的变体：管理后台不弹提醒框、不显示日期（提示期即强制），该变体在 admin 无可见差异。
