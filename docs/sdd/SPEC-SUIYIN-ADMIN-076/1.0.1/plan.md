---
plan_for: SPEC-SUIYIN-ADMIN-076
spec_version: 1.0.1
status: approved
artifact_class: static-html
exception_status: not-required
exception_approved_by: none
exception_approved_at: none
operational_profile: none
last_updated: 2026-09-30
---

# Prototype Plan — 西安租户、碎银账号及菜单状态

## 1. Constitution Check

| 原则 | 结论 | 证据 |
|---|---|---|
| 用户结果优先 | PASS | 076审核摘要及房总“执行” |
| 事实与推断分离 | PASS | 两正式网址USER，未采菜单保留缺口 |
| 逻辑先于界面 | PASS | 8条规则、11个AC、Q002/Q003已批准 |
| 状态完整 | PASS | 原值、提交、无变化、失败恢复、导航及旧存储 |
| 平台与租户边界 | PASS | 17租户独立，8租户删时间，艺星专属不扩散 |
| 真实能力承诺 | PASS | 仅浏览器本地保存 |
| 运行类型与生产隔离 | PASS | 既有纯HTML/JS/CSS及静态JSON，无真实业务服务 |
| 精确依赖与证据闭环 | PASS | SPEC精确锁定051/055/060/068/073 |

## 2. Artifact Boundary

- **运行类型**：static-html。
- **为什么**：仅修改既有HTML原型资源、静态数据和浏览器本地演示配置，本地HTTP服务只读取静态文件。
- **有状态信号**：无。无真实认证、服务端业务API、共享持久化、数据库、migration或正式在线业务入口。
- **例外**：not-required。
- **Operational Profile**：none。
- **生产边界**：不进入Flutter / React / Go生产仓；不执行真实后台写入。

## 3. 复用地图

| 类型 | 复用对象 | 路径/组件 | 理由 | 调整 |
|---|---|---|---|---|
| HTML | Shell与内容页 | prototype/_shell.html、admin-content.html | 已有租户路由和内嵌框架 | 按需接入局部规则 |
| Component | 菜单模型/树表 | admin-menu-state.js、admin-menu-tree.js/css | 保留身份、父级、排序及保存链 | 胶囊、严格提交与失败恢复 |
| Component | 领域配置 | admin-domain-views.js | 时间设置有两入口 | 指定租户显式限制 |
| Mock | 各租户静态数据 | data/navigation-snapshot.json、data/content | 沿用原15租户来源 | 两新租户只登记已知来源/明确待采 |

## 4. 文件与路由

所有下列文件位于`E:/AI 项目/佰智德三/碎银原型/suiyin-admin`；规格和验证证据位于本目录。

| 文件 | 路由/页面 | 动作 | 规则 |
|---|---|---|---|
| prototype/data/navigation-snapshot.json、data/content/新租户.json | 两新租户 | 登记独立环境和待采内容；不复制其他业务行 | R001 R002 |
| prototype/admin-navigation.js、admin-menu-state.js、admin-content.js及名称来源 | salesManage/menu/allMenu | 保留route及覆盖语义，默认名称迁移 | R003 |
| prototype/admin-domain-views.js及按需的表单过滤 | salesManage/setting | 租户条件移除两个时间入口 | R004 |
| prototype/admin-menu-tree.js/css | menu/allMenu | 行内胶囊、提交、状态及回滚 | R005 R006 R007 R008 |
| 本目录验证脚本/verification.md/截图 | 本地验证 | 适量浏览器回归与完整Shell截图 | 全部 |

## 5. 信息结构

保留原导航层级、账号页内容及普通六列/平台九列表。胶囊位于原“菜单状态”列。新租户来源说明持续可见；未采区不显示其他租户样本。既有编辑/删除/记录继续原入口。

## 6. 交互实现

| 触发 | 默认态 | 进行中 | 成功 | 失败 | 取消/重试 | 规则 |
|---|---|---|---|---|---|---|
| 选租户 | 原选择器 | 静态读取 | 对应身份 | 明确读取失败 | 重试 | R001 R002 |
| 切换胶囊 | 当前值选中 | 禁重复 | 本地保存并联动 | 回旧值及记录 | 再次选择 | R005 R006 R007 |
| 重复选当前项 | 已选 | 无 | 无额外写入 | N/A | N/A | R005 |
| 刷新/旧链接 | 已存状态 | 读取 | 保留route和自定义状态 | 不清空旧值 | 重新载入 | R003 R006 |

## 7. Mock 方案

旧15租户保留既有脱敏来源。新租户复用公共框架，已知名称/网址记录用户来源；未采菜单/业务内容明确待采集，不克隆艺星权限。为了验证指定的账号页、菜单页和系统设置，可登记明确标为原型待采的最小范围入口，使用独立稳定ID、空业务行和显著待采提示；不得冒充线上完整菜单库存。获取实际本租户只读资料后可替换对应待采项。

## 8. 验证计划

| 验收 | 操作路径 | 预期 | 视觉 |
|---|---|---|---|
| AC-R001-01/R002-01 | 17租户与两新租户入口 | 身份唯一、无串数据、缺来源提示 | 新租户完整Shell |
| AC-R003-01 | salesManage、sales旧链接、menu/allMenu及旧本地缓存 | 默认名一致，自定义保留 | 页签/标题/菜单 |
| AC-R004-01/02 | 六艺星+两新租户与其余九租户 | 两入口移除/保留，无其他业务删除 | 账号页和设置 |
| AC-R005-01/02 | 点选/键盘、重复点击、编辑取消 | 一致且无额外记录 | 胶囊焦点 |
| AC-R006-01/02 | 普通/平台父子隐藏、多窗口、刷新 | 原优先级及导航一致 | 子项与页签 |
| AC-R007-01 | 注入本地写入失败/外部状态更新 | 回滚且无假成功 | 错误反馈 |
| AC-R008-01 | 滚动、窄窗、拖动 | 原表格与交互正常 | 完整Shell截图 |

## 9. 风险与回退

改名需覆盖旧缓存但不覆盖明确自定义名称；胶囊不得走非严格保存造成失败仍更新导航；新租户不得由未知ID回退深圳。只修改对应源文件，保留原本地配置；验证使用qa隔离键与独立浏览器环境，不清用户真实本地配置。修复后只重测受影响路径及必要相关回归。

## 10. 预览计划

复用`node serve.js`的5200静态服务。Google Chrome打开`http://localhost:5200/prototype/_shell.html?tenant=huamei-xian&page=menu`，同时提供账号页与傲丽链接。使用独立自动化Chrome验证并保存完整Shell截图，用户预览不带qa参数。
