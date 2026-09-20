---
plan_for: SPEC-SUIYIN-ADMIN-052
spec_version: 1.1.1
status: implemented
artifact_class: static-html
exception_status: not-required
exception_approved_by: none
exception_approved_at: none
operational_profile: none
last_updated: 2026-09-20
---

> 发布范围补充（2026-09-20）：用户在上述实施验收之后明确“完整推送”，授权当前管理后台静态原型、必要派生单文件及文档的提交、推送、tag和预览发布。此补充不改R-ID/AC、计数或租户规则，不批准生产实现、工程Issue或工程指派；静态原型交付通知按既有流程。合同仍为implemented，Chrome当前线上视觉与缺采集项保持未完成。远端成功须由实际发布回执证明。


# Prototype Plan — 所有租户销售变声统计

## 1. Constitution Check

| 原则 | 结论 | 证据 |
|---|---|---|
| 用户结果与逻辑合同 | PASS | SPEC 052@1.1.1 已获房总批准 |
| 来源与精确依赖 | PASS | 051@1.1.0，DR-095；合成样本标识 |
| 状态与平台 | PASS | 管理页沿用当前青绿样式，查询/空/错/重试/取消 |
| 租户与能力边界 | PASS | 十五租户静态文件、本地状态；不访问真实业务 |

## 2. Artifact Boundary

- **运行类型**：static-html。
- **为什么**：仅 HTML/CSS/JS 与静态合成样本；浏览器本地配置保持既有方式。
- **有状态信号**：无；没有认证、服务端写接口、共享持久化、数据库或 migration。
- **例外**：not-required。
- **Operational Profile**：none。
- **生产边界**：不进入 Flutter / React / Go 生产仓，不实现真实埋点或后台接口。

## 3. 复用地图

| 类型 | 复用对象 | 调整 |
|---|---|---|
| Shell | _shell.html、admin-navigation.js | 新路由由原导航数据驱动 |
| 页面 | admin-content.html、Admin 工具、admin-live-ui.css | 增加专用变声统计模块与局部样式 |
| 菜单树 | admin-menu-tree.js / admin-menu-state.js | 更新静态库存与新增入口迁移 |
| 数据 | navigation-snapshot.json、15 份 content JSON | 唯一 salesVoiceStats、明确合成来源 |

## 4. 文件与路由

文件均位于 prototype/。

| 文件 | 动作 | 对应规则 |
|---|---|---|
| data/navigation-snapshot.json、data/content/*.json（15 租户） | 新增导航、settings、menu、bzds allMenu 及页面注册 | R001 R004 R005 |
| admin-menu-state.js、admin-menu-tree.js（如需） | 新 route 的旧覆盖迁移，保留已有选择 | R004 R005 |
| admin-sales-voice-stats.js/css、admin-content.html | 独立日期、部门、去重计数、排序分页导出及状态 | R002 R003 R006 R007 |
| 本次 evidence 报告及工作目录 check-voice-core/check-voice-dom/check-menu-data 脚本 | 固定事实、DOM 与菜单库存核验；无生产测试体系 | R001–R007 |

## 5. 信息结构

沿用现管理页：常显开始/结束日期与快捷日（不设模式切换）、部门、搜索/重置/导出；计次说明；表格（序号、销售、部门、变声使用次数）；全筛选合计及分页。只读统计无任务详情和失败次数新指标。

## 6. 交互实现

编辑条件不提交；搜索合法后进入加载并禁用重复操作，成功替换结果，失败保留已提交条件供重试；重置今天/全部部门/默认排序。导出全筛选集合。日期按 Asia/Shanghai；首次成功去重在日期过滤前执行，防止重复回调跨日计数。

菜单同步使用相同稳定 route/tree.key。已有覆盖进行一次新增 route 迁移，同时尊重隐藏父级和已经明确保存的新项隐藏。菜单数据版本变化保留用户已有编辑。

## 7. Mock 方案

每租户独立合成销售、部门、任务，基于运行日构造三日及跨日事实；同名不同 ID、多账号归一销售、重复回调、失败后成功、仅失败、试听、取消、未配置、零次数均覆盖。不包含语音内容或真实客户资料。事件失败重试仅是复算事实，不增加任务诊断页面。

## 8. 验证计划

| 验收 | 操作与预期 | 视觉 |
|---|---|---|
| AC-R001-01 / AC-R004-01 | 15 租户导航/settings/menu、bzds allMenu 一致；隐藏恢复排序及旧覆盖 | Chrome 统计/菜单 |
| AC-R002-01 / AC-R002-02 | 日期/部门/重置/范围非法、数值排序、分页与全量导出 | Chrome 操作 |
| AC-R003-01 / AC-R003-02 | 手工固定任务事实去重、跨日、零值、稳定 ID、租户隔离 | 表格样本 |
| AC-R005-01 / AC-R006-01 | 隐藏/直接路由、空与错误重试、未提交条件 | Chrome 状态 |
| AC-R007-01 | JS/JSON 与原菜单回归、同风格/横向滚动/焦点 | 实际截图 |

## 9. 风险与回退

旧存储可能掩盖新入口，采取只迁移新 route 的版本标识，不重置原菜单偏好；专用模块只响应 salesVoiceStats，旧业务渲染保持。回退限本轮新增文件和精确修改；不覆盖用户改动。所有数字明确为合成演示。

## 10. 预览计划

复用或启动本地静态服务，Chrome 打开 https://suiyin-admin.pages.dev/prototype/_shell.html?tenant=yestar-sz&page=salesVoiceStats ，抽查 bzds/jbfs 等非艺星租户与菜单管理。实施阶段仅本地迭代；后续“完整推送”授权派生单文件与当前静态原型提交、推送及预览发布。

1.1.0 纠偏：所有按钮/快捷日期/表格/分页直接继承 admin-live-ui.css，与销售使用统计共用；日期通过同日起止表达单日。R002/R007 更新，不改计数实现。

1.1.1 参照纠偏：与053统计页共享主按钮蓝色、右对齐和日历；直接区间不显示单日/范围选项。旧1.1.0颜色证据保留历史，本轮复验另记录。
