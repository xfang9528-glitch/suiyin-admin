---
test_contract_id: TEST-CONTRACT-SUIYIN-ADMIN-062
spec_id: SPEC-SUIYIN-ADMIN-062
spec_version: 1.0.0
status: approved
prepared_by: Codex
prepared_at: 2026-09-21
---

# 预约记录组合图 — Test Contract

## 1. 测试摘要

源规格 [SPEC-SUIYIN-ADMIN-062@1.0.0](https://github.com/xfang9528-glitch/suiyin-admin/blob/v2026092101-admin-appointment-chart/docs/sdd/SPEC-SUIYIN-ADMIN-062/1.0.0/spec.md)，切片 I001。原型已测试的30项仅证明本地静态行为，以下为生产执行合同，CI Evidence 为 planned；不得据此宣布生产完成。

## 2. Strategy

计算、边界、筛选与分页接口采用自动化；页面交互和权限用集成/E2E。现有生产预约组件和API已带测试入口，具体落地框架由正式工程流程决定。

## 3. Coverage Matrix

| Test ID | Slice ID | Rule | Acceptance | Layer | Automation | Target Repo | Planned Test Path | Oracle | CI Evidence | Manual Reason |
|---|---|---|---|---|---|---|---|---|---|---|
| T-R001-01 | I001 | R001 | AC-R001-01 | integration | automated | PetWebOrg/suiyin-admin | src/views/doctor-management/appointment-records.test.ts | 默认列表；切图表后筛选结果不变，切回保留原页码、列和详情。 | planned | — |
| T-R002-01 | I001 | R002 | AC-R002-01 | unit | automated | PetWebOrg/suiyin-admin | src/api/appointment/index.test.ts | 同客户两个不同预约ID计2；重复ID不重复；跨UTC边界按上海预约日计数。 | planned | — |
| T-R003-01 | I001 | R003 | AC-R003-01 | unit | automated | PetWebOrg/suiyin-admin | src/views/doctor-management/appointment-records.test.ts | 2/0/3条对应柱形2/0/3、累计2/2/5、总数5；双轴从0且单位条，鼠标/键盘提示一致。 | planned | — |
| T-R004-01 | I001 | R004 | AC-R004-01 | integration | automated | PetWebOrg/suiyin-admin | src/views/doctor-management/appointment-records.test.ts | 预约日期与创建时间取交集；项目/科室/医生/院区/创建人/当前部门/客户同时生效；超过20条时切页总量不变；草稿未查询不生效。 | planned | — |
| T-R005-01 | I001 | R005 | AC-R005-01 | unit | automated | PetWebOrg/suiyin-admin | src/api/appointment/index.test.ts | 首尾自然日包含，范围外排除；完整数据零日补0；单日一柱一点；无条件无隐含30天限制。 | planned | — |
| T-R006-01 | I001 | R006 | AC-R006-01 | integration | automated | PetWebOrg/suiyin-admin | src/views/doctor-management/appointment-records.test.ts | 空匹配为0；请求失败不为0且可重试；缺日期单列且不借创建时间补；启用日期条件后缺日期排除。 | planned | — |
| T-R006-02 | I001 | R006 | AC-R006-02 | integration | automated | PetWebOrg/suiyin-admin | src/views/doctor-management/appointment-records.test.ts | 倒置或半填日期阻止查询并保留上次结果；长区间每一天可滚动及键盘访问。 | planned | — |
| T-R007-01 | I001 | R007 | AC-R007-01 | integration | automated | PetWebOrg/suiyin-admin | src/api/appointment/index.test.ts | 分页20条而total293时聚合必须基于全部匹配；无完整桶不得伪造零/总趋势；演示数据不得进入生产结果。 | planned | — |
| T-R008-01 | I001 | R008 | AC-R008-01 | security | automated | PetWebOrg/suiyin-admin | src/views/doctor-management/appointment-records.test.ts | 四个已有租户分别验权；切租户不携旧实体/结果；禁止越权接口及直链读取统计；无入口不新增。 | planned | — |
| T-R003-02 | I001 | R003 | AC-R003-01 | visual | manual | PetWebOrg/suiyin-admin | PR 附件/appointment-chart-visual | 在1513px和1060px宽度核对条形、累计折线、双轴、中文标签及提示不遮挡，附同条件截图。 | planned | 文字可读性与视觉层级需人审；将截图与判断记入PR附件。 |

## 4. Test Data & Profiles

只用脱敏或虚构测试数据：同客户两个ID、重复ID、跨上海午夜、2/0/3零日、21条以上分页、创建日异于预约日、缺日期、空查询、失败重试、365日长区间；四租户各有本租户与越权对照身份。测试数据不写入真实预约。

## 5. CI Gates

PR 必须运行全部自动化 Test IDs，测试名或报告中保留 AC-ID/Test ID；请求参数、权限和全量桶与列表一致。人工视觉附截图和判定。后端接口有改动时补关联合同/接口测试证据，不以静态原型代替。未满足不得关闭验收为 released。

## 6. Evidence

原型证据：verification.md、evidence/checks.json、evidence/appointment-chart.png。生产证据在对应 PR/CI 形成后追加链接；当前生产未实现且未验收。

## 7. Change Control

源规格变化使本合同 stale；不以修改测试 Oracle 静默改变业务规则。原型工作区不跨仓实现生产测试。
