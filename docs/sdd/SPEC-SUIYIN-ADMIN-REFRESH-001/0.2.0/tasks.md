# Tasks — 真实后台新增页面静态对齐

> Spec: SPEC-SUIYIN-ADMIN-REFRESH-001@0.2.0

> Plan: plan.md

> Status: static-implementation-verified; remote publication receipt is separate

## Phase 1 — 证据与复用

- [x] T001 读取已批准合同、精确依赖、静态边界；本轮后续“完整推送”只授权归档与静态发布（R001 R005 R006）。
- [x] T002 完成15租户导航、完整库存及25新页证据矩阵，补齐rxxz，稳定身份不重编号（R001，AC-R001-01）。
- [x] T003 准备tenant+route独立合成样本，区分已采空态与未知（R003 R006）。

## Phase 2 — 三个新页面

- [x] T004 录音筛选、分页、详情抽屉、转写/分析页签与无媒体提示（R003 R004 R006 R010；对应十条AC中的03/04/06/10）。
- [x] T005 喜报双类型四项设置、选图/颜色可见校验、保存重读与隔离（R005 R008，AC-R008-01）。
- [x] T006 喜报列表筛选、新增双类型、只读详情、取消/保存和未采编辑提示（R004 R005 R006 R009，AC-R009-01）。

## Phase 3 — 菜单与既有能力

- [x] T007 新导航、menu/allMenu库存与三方旧状态迁移；显式隐藏/删除/父组/排序/权限及058扩展保留（R001 R002，AC-R002-01）。
- [x] T008 055表头冻结、062既有预约图表及其他已批准能力回归；本轮原有页面视觉修正仍由054/055承接（R002 R007）。

## Phase 4 — 验证与发布准备

- [x] T009 25新页、专用面板、rxxz增量、迁移、无外部请求及同视口实测验证，聚合结果见verification.md（R001–R010）。
- [x] T010 Google Chrome本地预览，保留未采编辑/枚举、真实媒体和整图像素差分边界（R006 R007）。
- [x] T011 完整推送后规范化同版本SPEC/Plan/Tasks并将当前文档冲突登记于source-convergence.md（R001 R002 R007）。
- [x] T012 版本化包和递归依赖快照准备；校验与脱敏清单见checks/validation-results.json（R005 R006）。

## 交付边界

原型实现及本地检查已完成；commit/push/tag、inline最终检查、远端逐文件回读由主任务按明确“完整推送”授权完成并另发回执。此包不创建Issue、Handoff或Test Contract，不修改生产仓，不创建或更新APP/PC开发进度表。未采证据的延期项见SPEC Q001，不把延期内容计为完成。
