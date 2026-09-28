---
plan_for: SPEC-SUIYIN-ADMIN-071
spec_version: 1.3.0
status: approved
artifact_class: static-html
exception_status: not-required
exception_approved_by: none
exception_approved_at: none
operational_profile: none
last_updated: 2026-09-28
---

# Prototype Plan — 原位补齐回访基准

> E023–E027直接批准本轮选项、首次/最近一次、人工/AI、预约日期和原位修改范围。六艺星及已有节点行为不变；1.2.0合同逐字保存在history/1.2.0/。本轮不发布。

## 1. Constitution Check

| 原则 | 结论 | 证据 / 例外理由 |
|---|---|---|
| 用户结果优先 | PASS | 在已有回访基准选择起算事件，不重做页面 |
| 事实与推断分离 | PASS | 事件历史仅合成；Q008明确演示默认，不猜真实发生时间 |
| 逻辑先于界面 | PASS | E023–E027明确用户范围，R016–R019约束新增行为 |
| 状态完整 | PASS | 旧规则、草稿、保存/取消、失败、未知、未发生分别处理 |
| 租户与运行边界 | PASS | 六艺星独立本地模型，static-html，不接生产服务 |
| 精确依赖 | PASS | 沿用SPEC原065/055/068精确依赖 |

## 2. Artifact Boundary

- **运行类型**：static-html。
- **为什么**：仅现有静态规则页、本地合成事件与浏览器存储；没有真实事件接口。
- **有状态信号**：仅已有浏览器本地演示保存，无服务端业务写入。
- **例外**：not-required；Operational Profile为none。
- **边界**：不进入生产仓，不改PC名单，不改菜单、21/26条件或整体布局；不更新PRD/流程图/设计规范、inline、远端SDD，不commit/push/tag。E022只属于1.2.0历史完整推送。

## 3. 复用地图

| 类型 | 复用对象 | 路径 / 组件 | 复用理由 | 调整 |
|---|---|---|---|---|
| UI | 当前回访基准下拉、摘要与整条草稿 | admin-revisit-rules.js | 用户截图指明原位置 | 补选项及最小来源/次数控件 |
| Model | 六tenant独立工厂及节点计算 | admin-revisit-rules-model.js | 保留身份、权限与旧规则 | 独立基准目录和事件时间解析 |
| Mock | 本租户固定样本 | 同上 | 不接真实客户 | 增加独立合成历史事件 |

## 4. 文件与路由

路径相对原型仓 https://github.com/xfang9528-glitch/suiyin-admin/tree/v2026092803-admin-revisit-anchors。

| 文件 | 路由 / 页面 | 动作 | 对应规则 |
|---|---|---|---|
| prototype/admin-revisit-rules-model.js | revisitRules | 12项独立基准目录、事件解析、验证与摘要，旧日期兼容及固定样本 | R004、R010、R013、R016–R019 |
| prototype/admin-revisit-rules.js | revisitRules | 原下拉选项、条件附属控件、草稿保存恢复及帮助说明 | R007、R011、R015–R019 |
| prototype/admin-revisit-rules.css | 现有编辑页 | 仅必要的局部控件宽度与窄窗适配，不重排整体布局 | R016 |

导航、其他内容JSON、既有群发与统计均不改；源码只使用本地静态数据。

## 5. 信息与数据结构

- 12项基准独立于fields：末次咨询日期、添加日期、建档日期、预约日期、末次回访日期、成为A/B/C/D级、到店、购买、划扣。旧5个anchor ID保持consulted/added/filed/appointment/revisited；仅appointment基准显示名明确为预约日期，日期仍按原值，21/26筛选标签不改。
- 实现约定：M.anchors独立目录；新增ID为grade-A/grade-B/grade-C/grade-D及visit/purchase/redemption。gradeSource为manual或ai，仅等级适用；anchorOccurrence为first或latest，仅到店/购买/划扣适用。新选择初值人工/最近一次属于明示的演示默认，可修改。
- 等级统一取所选来源最近一次进入目标级别；from等于to不重置。后续等级变化不隐式添加当前等级条件。两来源互不回退。
- 事件先限定本tenant/账号/好友、类型及来源，排除晚于运行时点的记录，再取首次或最近一次。坏值/缺失历史unknown；完整空历史或截至时点未发生not-matched；未来事件不能覆盖过去事件。事件日为北京时间第0天，节点自然日差不变。
- 旧5日期无需新字段也可恢复，不自动写入新默认值或改变原存储键；新事件缺少/非法附属参数报错，不退回添加日期。摘要、试算理由、持久化必须一致。节点条件复制不改共同基准配置。

## 6. 交互实现

| 触发 | 默认态 | 进行中 | 成功 | 失败 | 取消 / 重试 | 规则 |
|---|---|---|---|---|---|---|
| 打开基准 | 原添加日期默认 | 原位12项选择 | 草稿摘要同步 | 不可用参数明示 | 不写存储 | R016、R019 |
| 选择等级 | 明示人工初值 | 人工/AI切换 | 来源及最近进入摘要 | 历史坏值未知 | 整条取消恢复 | R018、R019 |
| 选择业务事件 | 明示最近一次初值 | 首次/最近一次切换 | 发生次序摘要同步 | 未知与未发生区分 | 整条取消恢复 | R017、R019 |
| 保存/恢复 | 旧规则可读 | 校验整体草稿 | 保存后刷新一致 | 已存内容不变，可重试 | 保留旧v1原文 | R007、R019 |
| 试算 | 固定日期与事件 | 计算到期节点 | 显示事件日期与理由 | 不猜其他日期 | 可修改后重试 | R010、R017、R018 |

## 7. Mock 方案

每tenant继续独立创建目录与好友，保留深圳全部稳定ID和原5日期结果。增加人工/AI各自的等级转换与重复评定，到店/购买/划扣多次记录，以及缺失、坏值、空历史、过去+未来、同日较晚和恰好运行时点样本。均标合成，不接CRM；“划扣”可说明对应客户资料核销记录，但不继承049的PC接口/记录范围。Q005商品筛选延期不变。

## 8. 验证计划

- AC-R016-01：六tenant都有12项基准及适用小控件；旧5 ID、21/26字段和现有布局保持，预约不重复、不改为创建时间。
- AC-R017-01/02：三事件首次/最近一次、跨自然日、第0天、恰好时点及未来截断，缺失/坏值/空历史各自正确。
- AC-R018-01：人工/AI互不混用、再次进入取最近、重复同级不重置、当前等级改变不隐式排除。
- AC-R019-01：旧v2无附属字段兼容、旧v1保留、新选择保存刷新、取消/写失败、节点复制不改基准、tenant与QA隔离。
- Chrome检查原下拉、摘要、示例结果、保存恢复及窄窗；结果另记checks/v1.3.0/。既有1.2.0的18+25+66+15只作回归基线，不预写本轮PASS。

## 9. 风险与回退

1.2.0 spec.snapshot.md/plan.md/tasks.md已逐字保存history/1.2.0/。不改旧published包、source-convergence或旧验证。沿用tenant v2键，不因加载迁写旧规则；本轮失败保留草稿/原数据，不清除其他页面或租户状态。

## 10. 预览计划

实施后复用8148，Google Chrome打开现有_shell.html?tenant=<tenant>&page=revisitRules。默认展示原页面，展开回访基准验证全部新增选项；不新增页面、导航或另一个编辑布局。

## 11. 日常修改与发布边界

本轮只更新本地SPEC/Plan/Tasks、必要静态实现与实际验证。1.2.0完整推送已结束，E022不延用；source-convergence.md、verification.md和旧远端包仍按其原版本保留。除非用户再明确完整推送，不更新全量交付文档、不inline、不commit/push/tag、不发交付通知、不建Issue或开发进度表。
