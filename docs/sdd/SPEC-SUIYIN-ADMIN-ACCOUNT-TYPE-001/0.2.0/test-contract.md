---
test_contract_id: TEST-CONTRACT-SUIYIN-ADMIN-ACCOUNT-TYPE-001
spec_id: SPEC-SUIYIN-ADMIN-ACCOUNT-TYPE-001
spec_version: 0.2.0
status: draft
prepared_by: "Codex"
prepared_at: 2026-10-02
---

# 全部账号状态按个微和企微分别展示 — Test Contract

## 1. 测试摘要

- **源规格**：`SPEC-SUIYIN-ADMIN-ACCOUNT-TYPE-001@0.2.0`。
- **对应 Handoff**：`HANDOFF-SUIYIN-ADMIN-ACCOUNT-TYPE-001`，I001；目标 `PetWebOrg/suiyin-admin`，工程平台 PC，页面 Admin。
- **目标**：把两类统计、名单完整性、失败处理和原交互保持变为可判断的验收。
- **边界**：以下生产仓测试为 planned；此处不创建生产测试或宣称生产 CI 通过。现有静态原型检查只作设计/样例参考，不能替代正式工程证据。

## 2. Strategy

统计和条目归属采用 domain/contract 测试；源数据身份、环境隔离及状态口径采用 integration 测试；页签、排序与失败恢复采用 e2e；已有权限采用 security；零值矩阵采用 parameterized。长名单的阅读感受保留独立 visual 人工项，同时可机器判定的遮挡和滚动状态由自动化覆盖。

`Planned Test Path` 是工程计划入口，具体框架和后缀由生产仓正式实现选择；变更实际路径时保留 Test ID 和 Oracle。正式Admin必须按稳定账号ID读取创建时已保存的类型；R003缺ID时的精确名称多重集合核对只用于静态Mock采集构建，不作为生产身份匹配方案，不把静态采集builder部署成生产依赖。

## 3. Coverage Matrix

| Test ID | Slice ID | Rule | Acceptance | Layer | Automation | Target Repo | Planned Test Path | Oracle | CI Evidence | Manual Reason |
|---|---|---|---|---|---|---|---|---|---|---|
| T-R001-01 | I001 | R001 | AC-R001-01 | e2e | automated | PetWebOrg/suiyin-admin | tests/all-account-status/category-layout | bzds 统计顺序个微、企微、汇总；三列总数/在线/掉线分别为3/3/0、5/0/5、8/3/5；在线、掉线名单均依个微、企微排列并显示组数 | planned | — |
| T-R002-01 | I001 | R002 | AC-R002-01 | domain | automated | PetWebOrg/suiyin-admin | tests/all-account-status/count-and-membership | 各类总数等于在线加掉线，名单条数等于各计数，两类逐列和等于原汇总；输出条目多重集合与输入完全相同，重名不去重、不跨状态列 | planned | — |
| T-R003-01 | I001 | R003 | AC-R003-01 | integration | automated | PetWebOrg/suiyin-admin | tests/all-account-status/type-identity-and-snapshot | 生产按同环境稳定ID读取创建类型，不用名称或位置匹配；同名两个cxy2保留、同名不同类型按各自身份保留；异环境同名不能互补；明细状态不同不覆盖总览；快照整体换代不混旧名单和新汇总；缺ID名称多重集合仅另作静态构建证据审查 | planned | — |
| T-R004-01 | I001 | R004 | AC-R004-01 | contract | automated | PetWebOrg/suiyin-admin | tests/all-account-status/required-type-and-failure | wx/qw覆盖每条账号且数组长度一致；缺、非法类型或非法计数格式时拒绝分组；来源汇总与名单条数不符时保留来源汇总并记录内部诊断，不静默配平、不丢账号、不显示第三类；首次读取失败显示通用失败/重试，重绘失败保留正确DOM，父路由不回退旧演示数据 | planned | — |
| T-R005-01 | I001 | R005 | AC-R005-01 | parameterized | automated | PetWebOrg/suiyin-admin | tests/all-account-status/confirmed-empty | 覆盖个微空、企微空、两类全空及某状态列空；确认0显示0与无账号；空环境可无类型数组且保留两类和汇总；有账号却缺类型不解释为空 | planned | — |
| T-R006-01 | I001 | R006 | AC-R006-01 | e2e | automated | PetWebOrg/suiyin-admin | tests/all-account-status/navigation-scroll-sort | 环境名称排序依原始、升序、降序、原始切换，同值稳定；页签键盘可达且返回恢复各自滚动；长表头固定、类型组标题不盖表头；代理卡片及其状态保持，其他租户原行为保持 | planned | — |
| T-R006-02 | I001 | R006 | AC-R006-01 | security | automated | PetWebOrg/suiyin-admin | tests/all-account-status/access-boundary | 有权角色查看既有平台范围；无权限及其他租户入口不因本功能获得bzds名单；新统计和分类动作不发写请求、不新增授权、不跨环境复用类型 | planned | — |
| T-R006-03 | I001 | R006 | AC-R006-01 | visual | manual | PetWebOrg/suiyin-admin | artifacts/all-account-status/visual-review | 在约1440px桌面和窄窗检查密集环境行、超过一屏的名单及长名称；分类与数字可横向比较，文字不断义截断，滚动中所属类型可读且表头不遮挡，代理页布局不回退 | review-required | 字体栅格、中文长名折行与长列表阅读负担不能只靠DOM断言；评审逐场景记录通过/差异、视口、版本与脱敏截图到本行计划目录并附PR链接 |

## 4. Test Data & Profiles

| Data ID | Tenant / Profile | 前置数据 | 隐私处理 | 覆盖 Test IDs |
|---|---|---|---|---|
| D001 | 佰智德三 / bzds设计样例 | wx在线3掉线0，qw在线0掉线5，两个同名cxy2均保留；汇总8/3/5 | CI用合成账号名及稳定ID，仅保留相同数量和重名关系 | T-R001-01、T-R002-01、T-R003-01 |
| D002 | 同名与隔离 | 同环境同名两条分别wx/qw且ID不同；另一环境同名不同类型；明细与总览状态不同；生产按稳定ID取类型 | 合成名称，禁止带账号凭据；无ID名称多重集合仅属另行保留的静态构建证据 | T-R002-01、T-R003-01、T-R006-02 |
| D003 | 非法数据与读取失败 | 缺类型、unknown、错位数组、负数/小数/字符串计数、计数与名单不符；先成功后非法重绘；首次非法且旧通用演示数据存在 | 隔离内存fixture，不修改真实账号来制造异常 | T-R004-01 |
| D004 | 确认零与空环境 | 两类全空且counts=[0,0,0]，accountTypes缺省；仅一类/一侧为空 | 合成无个人数据 | T-R005-01 |
| D005 | 密集长表与代理 | 多环境重名、原排序同值、超过一屏名单、很长中文名；代理快照参考118卡，包含两类状态 | 名称内11位手机号遮罩；118是此次原型快照不是生产固定总量 | T-R006-01、T-R006-03 |
| D006 | 权限与其他租户 | 有权平台管理员、无权限角色、其他租户路由；各自既有访问范围 | 使用生产仓专用测试身份，无真实凭据入库 | T-R006-02 |

真实账号创建时类型固定。原型中少量历史账号经用户明确确认个微，其来源是用户确认，不能在工程测试中宣称全部由当前线上明细采得。原始采集及确认台账留本地，公开证据仅保留脱敏投影、聚合结果和必要说明。

## 5. CI Gates

- PR 必须实现并运行 I001 对应七项自动化 Test ID；人工项逐场景有结果与截图，不用“看起来正常”代替 Oracle。
- Test ID 或 AC-ID 至少出现在测试名、报告标签、注释或 artifact 的一种机器可检索入口。
- 所有 MUST 规则和 AC 均须有覆盖；类型不完整、丢条目或错误回退旧数据时阻止验收通过。
- `validate-traceability.mjs` 必须确认精确版本、规则/验收/切片/测试引用一致。
- 本合同目前为 draft，CI Evidence 保留计划值。工程完成后替换为真实 CI artifact/PR 和人工证据，再升级 verified。
- released 必须有真实 Issue Ref、`actual_issue_creation: true`，且 Handoff/Test Contract 均 verified；原型 commit、tag 或本地测试不能替代生产发布。

## 6. Evidence

| Evidence ID | Test IDs | 类型 | 位置 | 保留时机 |
|---|---|---|---|---|
| EV001 | T-R001-01、T-R002-01、T-R003-01、T-R004-01、T-R005-01、T-R006-01、T-R006-02 | 计划生产CI报告 | 正式PR的CI artifact，待实现；记录commit、环境和Test ID | PR验收前 |
| EV002 | T-R006-03 | 计划人工视觉记录 | 正式PR附artifacts/all-account-status/visual-review下脱敏截图与判定，待验收 | PR验收前 |
| EV003 | T-R001-01、T-R002-01、T-R004-01、T-R005-01、T-R006-01 | 原型参考，非生产CI | 同版本包发布的静态组件/父路由检查脚本与脱敏汇总；实际通过数以主流程最终verification为准 | 原型完整推送 |

原型参考本地脚本为 `check-classification-preview.cjs` 和 `check-classification-integration.cjs`。其脚本/汇总随公开包的脱敏与可运行性检查后发布；原始capture、私人诊断、会话或连接配置不进入公开包。不得把历史 0.1.0 的“待核对”截图或预期当作当前验收。

## 7. Change Control

- SPEC 版本或规则变化后本合同 stale，重新核对 Oracle、数据与 Slice。
- 实现框架和路径可由工程决定，测试不能静默改变业务口径；争议先回源 SPEC。
- 生产自动化在生产仓正式流程中实现，本工作区仅交付静态原型及合同。
