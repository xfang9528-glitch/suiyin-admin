---
plan_for: SPEC-SUIYIN-ADMIN-051
spec_version: 1.1.0
status: implemented
artifact_class: static-html
exception_status: not-required
exception_approved_by: none
exception_approved_at: none
operational_profile: none
last_updated: 2026-09-29
---

# Prototype Plan — 既有话术管理页来源纠偏

本计划记录051@1.1.0已有行为在2026-09-29话术页的实施落点，不新增或改写规格。用户“执行”授权纠偏；本轮“完整推送”授权文档和发布。旧051、054、056及071等版本化文件保持不变。

## 1. Constitution Check

| 原则 | 结论 | 证据 / 例外理由 |
|---|---|---|
| 用户结果优先 | PASS | 对应租户恢复分类、列表、表单与本地可操作反馈 |
| 事实与推断分离 | PASS | captured/not-captured、来源时间、独立候选项、媒体占位 |
| 逻辑先于界面 | PASS | 继承051 R002–R006、R008–R010，不另设业务合同 |
| 状态完整 | PASS | 默认未选、已采空、未采、失败、禁用、编辑草稿、取消、保存和回滚 |
| 平台与租户边界 | PASS | 15租户各自树及样本，本地存储隔离 |
| 真实能力承诺 | PASS | 原型本地编辑，不发送、不上传、不写来源环境 |
| 运行类型与生产隔离 | PASS | HTML/CSS/JS与静态JSON；未接真实认证、服务或共享数据库 |
| 精确依赖与证据闭环 | PASS | 051@1.1.0字节副本、原R/AC映射及本轮公开验收 |

## 2. Artifact Boundary

- **运行类型**：static-html。静态JSON加载、本地浏览器存储与离线内嵌资源不构成真实业务服务。
- **有状态信号**：无真实登录/API、共享持久化、数据库或migration；只有当前浏览器Mock状态。
- **例外**：not-required；Operational Profile：none。
- **生产边界**：仅本HTML原型仓；不进入Flutter、React、Go生产仓。本轮不创建工程Issue、不更新开发进度表。

## 3. 复用地图

| 类型 | 复用对象 | 路径 / 组件 | 复用理由 | 需要调整 |
|---|---|---|---|---|
| HTML | 既有Shell、内容入口与弹窗 | prototype/_shell.html、admin-content.html/js | 保留租户导航与本地动作边界 | 挂载话术专用模块 |
| Token | 来源SVG、后台字体与表格基础 | prototype/admin-language-manage.css | 保留密度与本页颜色 | 本页树、搜索、六列和弹窗几何 |
| Component | 专用话术树与表单 | prototype/admin-language-manage.js | 领域结构不能由通用列表代替 | 取消、保存、失败回滚、记录与源更新 |
| Mock | 本轮分租户数据 | prototype/data/language-manage.json | 安全模板与结构尽量取实采 | 未采状态、脱敏和媒体占位 |

## 4. 文件与路由

| 文件 | 路由 / 页面 | 动作 | 对应规则 |
|---|---|---|---|
| prototype/admin-language-manage.js、prototype/admin-language-manage.css | languageManage | 专用树、六列表格、分类/话术/记录弹窗及状态 | R004 R005 |
| prototype/admin-domain-views.js、prototype/admin-content.html | languageManage | 将既有路由交给专用模块 | R005 |
| prototype/data/language-manage.json、prototype/sanitize-public-data.mjs | languageManage | 分租户结构化样本及公开审计 | R003 R006 R008 R010 |
| prototype/_shell.html、prototype/admin-navigation.css、prototype/admin-navigation.js | 现有Shell | 话术浮层恢复及对应源警示/滚动布局 | R004 R005 |
| prototype/_shell_inline.html、prototype/_inline-check.html | 静态离线与验收入口 | 生成内嵌样本并回归 | R009 |
| README.md、CLAUDE.md、index.html、prd、flowcharts、docs | 文档与SDD | 本轮来源收敛及发布入口 | R009 |

实际变更以本轮提交为准；表内路径仅包含静态原型及其文档，范围不含额外业务实现。私有只读采集与构建原料不进入公开仓。

## 5. 信息结构

左320px分类区保留搜索、父子关系、同名节点和逐项按钮；初态未选分类，右侧提示选择无子分类的分类。末级列表六列，分类与话术编辑分别展开；未采内容有说明。媒体仅文本/图片/视频三种模式，其中图片和视频使用占位。

## 6. 交互实现

| 触发 | 默认态 | 进行中 | 成功 | 失败 | 取消 / 重试 | 规则 |
|---|---|---|---|---|---|---|
| 打开租户 | 默认未选分类 | 加载本租户样本 | 自有分类树 | 失败不当零条 | 原位重试 | R003 R008 |
| 搜索与选分类 | 草稿尚未提交 | 按按钮/Enter筛选 | 匹配及祖先、末级列表 | 未采单独说明 | 清空恢复树 | R004 R005 |
| 分类/话术编辑 | 已知字段回显，未知保留未知 | 本地草稿 | 校验并保存当前租户 | 保留草稿或回滚已存状态 | 取消/Escape不写 | R002 R004 |
| 删除/隐藏/排序 | 按节点按钮状态 | 本地确认或调整 | 本地记录及列表更新 | 保存失败回滚 | 取消保持原值 | R002 R004 |
| 样本版本更新 | 原基线与本地状态并存 | 以旧基线识别用户改动 | 新采内容与本地改动合并 | 不以通用模板兜底 | 保留可恢复状态 | R003 R006 |

## 7. Mock 方案

| 数据集 | 表达的场景 | 关键字段 | 敏感信息处理 |
|---|---|---|---|
| 独立language-manage.json | 15租户1246节点、42分类155列表、48详情、16媒体占位 | capturedAt、captureRevision、nodes、categories、字段级状态、租户选项 | 不发布源ID/DOM/媒体URL；联系方式和个人信息过滤 |
| 浏览器本地覆盖 | 新增、编辑、隐藏、排序及记录 | 按tenant隔离的草稿与已存基线 | 不含生产写回；新输入不是来源采集事实 |

不混入旧日期样本冒充新来源；源总量与公开记录数量分开。无详情证据的说明项清空内容并标未采集，不能改造成正文。再次清洗必须保持结构化数据不被八类旧模板覆盖。

## 8. 验证计划与实际结果

| 验收 ID | 操作路径 | 已执行结果 | 视觉检查 |
|---|---|---|---|
| AC-R003-01 | 15租户切换、保存与刷新、来源更新 | 自有树、隔离、更新合并与审计通过 | 同名北京双根保留 |
| AC-R004-01 | 搜索、空态、编辑取消、保存、删除确认、记录和存储失败 | 26项本地行为通过；独立运行9项通过 | 分类/话术/记录浮层关闭恢复 |
| AC-R005-01 | 15租户默认页与已采列表 | 记录内几何差≤1 CSS px | 对应来源视口/DPR；非整图全状态承诺 |
| AC-R006-01 | 已采空、未采分类、详情和媒体 | 155列表/48详情分开；未知不当空、16媒体占位 | 保留边界提示 |
| AC-R002-01、AC-R009-01 | HTTP目录、HTTP内联、file内联 | 独立协议/浮层/回滚检查通过；常规内联225项通过 | 不调用真实写服务 |

完整结果与数据/构建SHA见[本轮公开验收](../../../../../../docs/verification/language-parity-20260929/README.md)。本地校验不是远端发布证明。

## 9. 风险与回退

- 当前冻结树本地节点ID稳定；未来重新采集改变树序时需身份兼容，不盲目按序号合并。
- 未采分类、详情、候选项与未覆盖状态继续未知；16媒体均为占位，不代表真实文件可播放。
- 原通用话术函数及legacy页面文本保留兼容但不再是当前路由来源。回退应回到明确发布版本，不将模板重新冒充来源。
- 其他071、菜单、统计等既有合同保持原范围；发布失败不改变本地验收结论，也不宣称完整推送已完成。

## 10. 预览计划

仓根启动静态服务，Google Chrome打开`prototype/_shell.html?tenant=yestar-sz&page=languageManage`，核对默认空态、已采末级、取消与媒体占位，再切换佰智德三、萌爪与北京。单文件`prototype/_shell_inline.html`同时支持HTTP和文件协议；实际发布结果另取远端回执。
