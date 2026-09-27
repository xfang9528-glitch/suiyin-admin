---
plan_for: SPEC-SUIYIN-ADMIN-REFRESH-001
spec_version: 0.2.0
status: implemented
artifact_class: static-html
exception_status: not-required
exception_approved_by: none
exception_approved_at: none
operational_profile: none
last_updated: 2026-09-27
---

# Prototype Plan — 真实后台新增页面静态对齐

本计划将本轮已经批准并完成的实施顺序规范化；行为仍由 spec.md 的十条规则约束。既有页面刷新继承054/055，菜单覆盖继承068，AI费用等已批准扩展保留。未新增范围或要求再次批准。

## 1. Constitution Check

| 原则 | 结论 | 证据 |
|---|---|---|
| 用户结果、事实与推断 | PASS | E001、逐租户证据；不把采集成功等同全像素验收 |
| 逻辑与状态 | PASS | R001–R010、十条AC，未采编辑和真实媒体明确延期 |
| 平台与租户 | PASS | Admin静态HTML；tenant+route隔离 |
| 真实能力承诺 | PASS | 本地演示提示，不虚报上传/播放/发送成功 |
| 运行类型与生产隔离 | PASS | 本地HTML/CSS/JS/JSON及资源，无业务服务 |
| 精确依赖与证据 | PASS | dependencies.json、verification.md |

## 2. Artifact Boundary

- 运行类型：static-html。浏览器只读取原型相对路径下的静态文件，演示修改仅在本浏览器按租户隔离保存。
- 无认证、服务端API、共享持久化、数据库、数据库迁移或正式在线业务入口。资料采集属于独立只读证据流程，不进入交付运行时。
- 例外：not-required；Operational Profile：none。
- 不进入 Flutter / React / Go 生产仓；原型发布不授权工程实现或创建Issue。

## 3. 复用地图

| 类型 | 对象 | 用途 |
|---|---|---|
| Shell | prototype/_shell.html、admin-navigation.js | 真实租户入口、菜单与页签 |
| 状态 | AdminMenuState、AdminTenantMenu、AdminPlatformMenu | 068三方覆盖与稳定身份迁移 |
| 组件 | 原有按钮、日期、表头冻结及本地资源 | 保留055行为，按本页证据几何覆盖 |
| 数据 | data/refresh-pages.json | 25个租户×新页的脱敏状态与字段 |

## 4. 文件与路由

| 文件 | 路由 / 页面 | 动作 | 对应规则 |
|---|---|---|---|
| prototype/admin-refresh-pages.js、admin-refresh-pages.css | recordingAdmin、goodNewsSettings、goodNewsRecords | 新增专用静态呈现 | R003 R004 R005 R006 R008 R009 R010 |
| prototype/data/refresh-pages.json | 25个已采租户页面 | 合成样本、来源数量与空态 | R001 R003 R006 |
| prototype/admin-content.html、admin-content.js | 既有入口 | 模块引用与早期分派 | R003 R006 |
| prototype/data/navigation-snapshot.json、data/content/*.json | 导航、menu、allMenu | 当前库存及稳定身份 | R001 R002 |
| prototype/admin-menu-state.js、admin-navigation.js | 菜单状态 | 保留显式局部覆盖的幂等合并 | R002 |
| prototype/admin-current-list-layout.js、data/current-list-layout.js | 既有通用页面 | 054/055范围的几何纠偏 | R007 |
| prototype/_shell_inline.html | 静态单文件 | 完整推送派生生成 | R005 R006 |

## 5. 信息结构

录音采用筛选、七列表格、分页和右侧详情抽屉；抽屉含元信息、转写文字/AI分析页签。喜报设置为医生/非医生两块独立配置。喜报记录为筛选、九列表格、新增双类型草稿和只读详情。未采编辑入口只说明待采，不进入通用编辑表单。

## 6. 交互实现

| 触发 | 结果与恢复 | 规则 |
|---|---|---|
| 查询、重置、分页 | 只操作当前租户本地样本，草稿与已应用筛选分开 | R004 |
| 详情打开/关闭 | 保留列表筛选；转写/分析仅切换已存结果 | R010 |
| 无本地音频播放/时间码 | 明确未提供文件，不请求真实媒体 | R006 R010 |
| 设置选图、颜色、距离与保存 | 两类型独立；按已见约束校验；仅保存本地演示 | R005 R008 |
| 新增切换类型、取消/保存 | 非医生不残留医生；取消不新增；保存只加本地行 | R005 R009 |
| 旧菜单状态遇到新快照 | 保留显式隐藏/删除、父级、排序及权限，补新增默认节点 | R001 R002 |

## 7. Mock 方案

列表身份、录音转写、AI分析文字和喜报内容使用合成值。数量/空态和素材有无来自各租户证据；不迁入原始客户记录、真实音频、媒体地址、账号或配置。已采详情结构允许按明确注明的bzds/深圳几何复用，不冒充各租户详情独立实采。

## 8. 验证计划及已执行结果

| 验收 | 已执行验证 | 结果 |
|---|---|---|
| AC-R001-01、AC-R002-01 | 15租户库存、25节点元信息、7个旧状态迁移检查及068原回归 | PASS |
| AC-R003-01、AC-R007-01 | 25个新页、同视口Shell弹层与几何；保留样本/未采边界 | PASS（仅列明维度） |
| AC-R004-01、AC-R005-01 | 查询/重置/分页、本地保存刷新及租户隔离 | PASS |
| AC-R006-01、AC-R010-01 | 无媒体提示、只读结果切换、关闭恢复及无外部请求 | PASS |
| AC-R008-01、AC-R009-01 | 双类型独立设置、图片/颜色校验、新增/取消及类型残留 | PASS |

脱敏聚合证据见 verification.md 和 checks/verification-summary.json；不将这些检查描述成全部741页所有状态100%像素相同。

## 9. 风险与回退

稳定route/group/row身份及显式覆盖保留；不清空旧本地模型。未采动作保持提示，来源失败与空态分开。原型回退通过原型仓既有版本或本地恢复入口完成，不涉及真实业务系统。

## 10. 预览计划

复用本机静态预览并在Google Chrome打开 prototype/_shell.html?tenant=rxxz&page=recordingAdmin 及五艺星喜报页；发布入口仍是静态原型。完整推送由主任务执行并核对远端branch/tag；本计划不声称远端已经成功，也不更新APP/PC开发进度表。
