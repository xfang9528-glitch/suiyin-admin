---
handoff_id: HANDOFF-SUIYIN-ADMIN-062
spec_id: SPEC-SUIYIN-ADMIN-062
spec_version: 1.0.0
status: issued
prepared_by: Codex
prepared_at: 2026-09-21
actual_issue_creation: true
---

# 预约记录组合图 — 工程交接

## 1. 交接摘要

管理者目前需逐行阅读、翻页才能了解预约分布。保留列表，同时可查看预约总量、每日柱形和期间累计折线；两种展示共用全部筛选结果。

2026-09-21 房总明确授权完整推送并创建 Issue 交陈宣宇。提出环境深圳艺星，提出人李愉，平台 PC（Admin 管理页），GitHub 负责人 cxy-chenxuanyu。工程状态以实际 Issue 为准，原型验收不代替生产实现。

## 2. Source Contract

- 唯一行为合同：[SPEC-SUIYIN-ADMIN-062@1.0.0](https://github.com/xfang9528-glitch/suiyin-admin/blob/v2026092101-admin-appointment-chart/docs/sdd/SPEC-SUIYIN-ADMIN-062/1.0.0/spec.md)。
- [测试合同](https://github.com/xfang9528-glitch/suiyin-admin/blob/v2026092101-admin-appointment-chart/docs/sdd/SPEC-SUIYIN-ADMIN-062/1.0.0/test-contract.md)；Constitution prototype-sdd@1.4.1。
- 承接 R001–R008 及其全部验收。UI 首验深圳；复用已有深圳、广州、杭州、嘉兴预约记录入口，不新增菜单或跨租户汇总。
- 原型的样本/演示标识用于说明证据。工程必须读取当前权限内全部匹配记录的真实统计；不能复制318条演示或从前端分页推总量。

## 3. Issue Slices

| Slice ID | Issue Title | Target Repo | Tenant | Platform | Reporter | Rules | Acceptance | Test IDs | User Problem | User Outcome | Issue Ref | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| I001 | feat(appointment): 实现预约记录总量与柱线图（管理者可以快速查看预约总量和每日变化） | PetWebOrg/suiyin-admin | 深圳艺星 | PC | 李愉 | R001、R002、R003、R004、R005、R006、R007、R008 | AC-R001-01、AC-R002-01、AC-R003-01、AC-R004-01、AC-R005-01、AC-R006-01、AC-R006-02、AC-R007-01、AC-R008-01 | T-R001-01、T-R002-01、T-R003-01、T-R004-01、T-R005-01、T-R006-01、T-R006-02、T-R007-01、T-R008-01、T-R003-02 | 管理者需要逐行翻页才能判断预约量和日期分布 | 同页切换列表与图表即可看总量及每日变化 | https://github.com/PetWebOrg/suiyin-admin/issues/404 | created |

## 4. 工程切片与约束

- 已只读确认生产 master 的 src/views/doctor-management/appointment-records.vue、src/api/appointment/index.ts、src/api/appointment/types.ts，以及现有对应 .test.ts 文件；现有列表由 /v1/appointments 分页提供。尚未证明存在满足本规格的全量聚合接口。
- 负责人在正式 Issue → worktree → Phase → PR → review 流程内检查接口能力。需要后端聚合时关联后端切片；本交接不授权原型工作区直接修改生产仓，也不把接口存在视为已验证。
- 列表与总量/日期桶共用已提交的全部筛选（两类日期独立交集），以预约 ID 去重，按 appointmentTime 在 Asia/Shanghai 归日。total 必须独立于 page/pageSize。有效/删除记录范围继承现有列表，不新增业务含义。
- 部门沿用创建人当前部门口径。服务端必须基于登录者权限和租户隔离查询；仅隐藏按钮不能证明授权正确。
- 明确区分加载、无匹配、请求失败、未完整加载和缺失预约时间。已选日期范围内完整数据才补0；缺日期记录按 R006 可核对。禁止用 createdAt 补 appointmentTime。
- 默认列表、切换保留筛选和列表页码；长区间内部滚动，键盘可访问日期提示，保留详情和冻结表头。
- 不增加到院、成交、金额、同比环比、导出、点柱下钻或新增预约业务操作。

## 5. Handoff Gate

- [x] SPEC 已批准并实现；版本一致，全部 MUST 与 AC 已分配。
- [x] 用户问题、结果、租户、平台、提出人与负责人明确。
- [x] 测试合同列出全部对应 Test IDs，生产证据保留 planned。
- [x] 已获真实建单授权；创建前后继续执行 github-issue 用户导向门禁。
- 追踪校验见 verification.md；远端可达、实际 Issue 和通知以交付回执为准。

## 6. Change Control

SPEC 升版后本合同 stale；生产实现发现业务口径变化时回源审核。PR/CI 保留 Test ID/AC-ID、测试报告和截图，工程测试通过后再更新生产验收状态。
