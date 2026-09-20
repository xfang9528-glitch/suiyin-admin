---
handoff_id: HANDOFF-SUIYIN-ADMIN-058
spec_id: SPEC-SUIYIN-ADMIN-058
spec_version: 1.2.0
status: issued
prepared_by: "Codex"
prepared_at: 2026-09-20
actual_issue_creation: true
---

# AI费用统计、分类趋势与专属模型展示 — Issue Handoff

## 1. 交接摘要

- **源规格**：`SPEC-SUIYIN-ADMIN-058@1.2.0`，当前为 implemented；此状态只表示静态原型已实现。
- **用户问题**：佰智德三的客户管理员无法集中看清每天各项 AI 分析用了多少次、费用花在哪里，也不能按类别查看一段时间内的变化和对应模型。
- **完成后变化**：在「AI管理 → AI费用统计」按单日或日期范围查看分析项目、专属模型、分析次数、费用和分类趋势；缺失、未核算与已知零值有明确区别。
- **目标仓范围**：`PetWebOrg/suiyin-admin`，PC网页管理页；只创建一个实现切片 I001。
- **提出环境 / 提出人**：佰智德三 / 房昕，由用户本轮明确指定；已指派陈宣宇（GitHub：cxy-chenxuanyu）。
- **本次授权**：用户已明确要求完整推送并给陈宣宇在管理页代码仓建立实现 Issue。E020已登记授权；真实 [Issue #402](https://github.com/PetWebOrg/suiyin-admin/issues/402) 已创建并指派cxy-chenxuanyu，`actual_issue_creation: true`。这不表示生产已实施或测试通过。

## 2. Source Contract

- 唯一行为真源：[SPEC-SUIYIN-ADMIN-058@1.2.0](https://github.com/xfang9528-glitch/suiyin-admin/blob/v2026092004-admin-ai-cost-stats/docs/sdd/SPEC-SUIYIN-ADMIN-058/1.2.0/spec.md)。本文件与 [Test Contract](https://github.com/xfang9528-glitch/suiyin-admin/blob/v2026092004-admin-ai-cost-stats/docs/sdd/SPEC-SUIYIN-ADMIN-058/1.2.0/test-contract.md) 随同一版本包发布，不能成为第二份需求真源。
- Constitution：`prototype-sdd@1.4.1`。
- 精确依赖：`SPEC-SUIYIN-ADMIN-051@1.1.0`、`SPEC-SUIYIN-ADMIN-053@1.0.2`、`SPEC-SUIYIN-ADMIN-055@1.1.0`。
- 佰智德三是提出环境和主要验收环境；不把源 SPEC 的适用范围缩成单租户。13个已有 AI管理入口的租户保持本租户权限、数据和名称；`jbfs`、`hqjd` 不新增父菜单。
- 原型的 `static-html`、本地权限模拟及82天合成样本均是原型运行边界；生产页面的真实数据查询、鉴权和工程实现必须在目标仓的正式 Issue → 独立 worktree → Phase 1/2/3 → PR → 房总 review 流程完成。
- 正式 Issue 必须直接链接已发布版本包内的 SPEC、Handoff、Test Contract。版本包锁定tag `v2026092004-admin-ai-cost-stats`；以下远端合同链接已按交付位置填写，仍须推送后验证可访问性，未发布候选不构成远端交付完成证据。

### 2.1 正式数据上线前的核实条件

| 项目 | 必须取得的可核验证据 | 未确认时的行为 | 核实负责人 |
|---|---|---|---|
| Q002 实际项目、次数与业务身份 | 实际启用项目、每日/按需触发、独立分析ID、成功条件、重试/手动重跑规则及字段示例 | 保持待确认；不得拿消息发送数或模型请求数冒充分析次数，也不得凭模型配置宣称每日已执行 | 陈宣宇 |
| Q003 对客费用口径 | 客户收费来源、单价单位、生效时间、币种/换算、减免和失败重试收费规则，以及可对账的脱敏记录 | 缺失金额显示待确认；不自定价格、不乘推测倍率，不把供应商成本或混合历史cost叫实际扣费 | 陈宣宇 |
| Q004 时效与覆盖 | 真实数据粒度、记录截止、历史覆盖、租户覆盖、时区及跨日费用归属日 | 明示截止与覆盖缺口；不得补0、编造历史账单或按原型固定日期假定生产覆盖 | 陈宣宇 |

上述问题不阻止创建 I001 或准备页面及合同测试；正式数字上线与生产验收闭环前必须留下答复、字段及对账证据。若核实结果改变已批准行为，先回源 SPEC 审核更新；不可在 Issue 中擅自重新定义规则。若目标仓依赖的服务缺少字段或鉴权，由正式工程流程登记依赖并申请对应仓授权，本交付不授权跨生产仓修改。

### 2.2 原型条款进入工程时的边界

- R008、R010、R016 中的本地 Mock、固定2026-07-01至2026-09-20和原型无真实接口，仅用于原型参照及工程测试夹具。生产页面不得返回、缓存回填或展示这82天合成数据为客户账单；不能把查询范围永久限制在该固定日期。
- 工程自动化可以使用隔离且明确标识的82天测试数据，验证日/月/范围复算、类别趋势、零/未知与性能。实际客户记录的数量、金额、覆盖日期与截止时间必须来自经核实的真实来源。
- 历史模型展示来自分析/费用记录携带的当时模型身份和名称快照；当前配置不能覆盖历史。缺失显示待确认，多模型并列，部分未知保留已知名称及待确认提示；无调用时可以显示明确标识的配置，不能暗示已经发生调用。
- 深圳的星系列和其他租户的碎银·用途是已核对的原型名称依据；10份 reference 只证明演示来源。生产不得据此为未核验的租户配置模型，也不新增版本、自研基座、专门训练或租户独占承诺。

## 3. Issue Slices

| Slice ID | Issue Title | Target Repo | Tenant | Platform | Reporter | Rules | Acceptance | Test IDs | User Problem | User Outcome | Issue Ref | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| I001 | feat(ai): 实现AI费用统计、分类趋势和专属模型展示（客户可以按天查看AI分析次数、费用、趋势和专属模型） | PetWebOrg/suiyin-admin | 佰智德三 | PC网页管理页 | 房昕 | R001、R002、R003、R004、R005、R006、R007、R008、R009、R010、R011、R012、R013、R014、R015、R016、R017、R018、R019 | AC-R001-01、AC-R002-01、AC-R002-02、AC-R003-01、AC-R004-01、AC-R004-02、AC-R005-01、AC-R005-02、AC-R006-01、AC-R006-02、AC-R006-03、AC-R007-01、AC-R008-01、AC-R009-01、AC-R010-01、AC-R011-01、AC-R012-01、AC-R013-01、AC-R014-01、AC-R015-01、AC-R016-01、AC-R017-01、AC-R018-01、AC-R019-01 | T-R001-01、T-R002-01、T-R002-02、T-R003-01、T-R004-01、T-R004-02、T-R005-01、T-R005-02、T-R006-01、T-R006-02、T-R006-03、T-R007-01、T-R008-01、T-R009-01、T-R010-01、T-R011-01、T-R012-01、T-R013-01、T-R014-01、T-R015-01、T-R016-01、T-R017-01、T-R018-01、T-R019-01 | 看不清各类AI每天的用量、费用、变化及使用的模型 | 可按日期查看各类分析次数、费用、对应模型和使用趋势，并识别未确认部分 | https://github.com/PetWebOrg/suiyin-admin/issues/402 | created |

## 4. Issue Drafts

### I001 — feat(ai): 实现AI费用统计、分类趋势和专属模型展示（客户可以按天查看AI分析次数、费用、趋势和专属模型）

#### 用户问题

佰智德三的客户管理员查看 AI 使用情况时，现有标签、画像和辅助统计分散，不能直接回答某天或一段时间内做了哪些分析、用了多少次、费用花在哪里，以及各项目由什么模型提供。把消息发送数、模型请求数或供应商成本混用，会让客户误解用量与费用。

#### 完成后用户能感受到的变化

可以在 AI管理中打开 AI费用统计，选择单日或日期范围，看清各类分析的次数、费用和对应模型；通过折线图查看每天的变化并单独查看某一类别。金额或历史不完整时有明确说明，不再把缺数据误看成零费用。

#### Source Contract

- SPEC：`SPEC-SUIYIN-ADMIN-058@1.2.0`，以 [源规格](https://github.com/xfang9528-glitch/suiyin-admin/blob/v2026092004-admin-ai-cost-stats/docs/sdd/SPEC-SUIYIN-ADMIN-058/1.2.0/spec.md) 为唯一行为合同。
- Rules：R001–R019；Acceptance 和 Test IDs 的完整清单见本文件 I001 行。
- Tests：[Test Contract](https://github.com/xfang9528-glitch/suiyin-admin/blob/v2026092004-admin-ai-cost-stats/docs/sdd/SPEC-SUIYIN-ADMIN-058/1.2.0/test-contract.md)，24个稳定测试ID全部属于 I001。
- 原型参考：[原型实际验收](https://github.com/xfang9528-glitch/suiyin-admin/blob/v2026092004-admin-ai-cost-stats/docs/sdd/SPEC-SUIYIN-ADMIN-058/1.2.0/verification.md)，其数据、金额、权限和模型历史均有明确静态演示边界。

#### In Scope

- AI管理二级入口、菜单库存与路由一致，遵守既有父级及显式隐藏配置。
- 日期草稿/已提交查询分离；单日、日期范围、快捷日期和重置；无部门、人员、账号或模型筛选扩展。
- 四列明细：分析项目、专属模型、分析次数、费用；五类核心项目与已列项目合计；全精度汇总、未知及覆盖状态。
- 一张按日趋势图，切换次数/费用和全部已列项目/单类；类别只改变图表，表格与图表共用已提交日期和底层数据。
- 独立业务分析与模型请求分离、失败/重试/跨日记录、部分及全部未知、缺日、未启用、单点、加载失败及重试。
- 历史模型快照、同类多模型、模型未知、本租户名称与参考来源边界；不更改模型配置。
- 正式数据接入前完成Q002–Q004核实；数据/权限/错误/可访问性/窄窗/冻结表头的测试合同和生产证据。

#### Out of Scope

- 新定价、扣费、充值、退款、供应商账单、成本利润管理、模型训练或配置编辑。
- 把演示模型与82天Mock转为生产账单，或对外宣称原型权限已验证生产鉴权。
- 未列入 SPEC 的项目扩容、模型筛选、小时/月粒度、预测、多指标双轴、导出和预算告警。
- 本工作区直接修改或直推生产仓；任何未经授权的跨仓实现。

#### 验收与测试

- 覆盖 I001 所列全部24个AC，按对应 `T-Rxxx-xx` 留下生产测试记录；不能用原型截图代替目标仓 CI、真实数据对账或实际鉴权证据。
- `Q002–Q004` 证据、真实数据身份与历史模型字段未闭合时，不得把正式费用和历史承诺标成已验收。
- PR / CI 测试名、标签、注释或报告至少有一种可检索的 Test ID / AC-ID。
- 本合同的生产测试均为 planned；Handoff为issued、I001为created，真实Issue已回链。生产完成前不使用verified或released。

#### Metadata

- 租户：佰智德三（提出环境，tenant key `bzds`）。
- 平台：PC网页管理页。
- 代码仓：PetWebOrg/suiyin-admin。
- 提出人：房昕。
- 负责人：陈宣宇（cxy-chenxuanyu），已由正式创建回读确认。
- Issue Ref：https://github.com/PetWebOrg/suiyin-admin/issues/402。

## 5. Handoff Gate

- [x] 源 SPEC 为 `SPEC-SUIYIN-ADMIN-058@1.2.0 / implemented`，并保留原型与生产边界。
- [x] 单一 I001 分配全部19条 MUST 规则与24个AC，metadata来自本轮明确指示。
- [x] 每个AC回链一个存在的 Test ID；所有生产测试保留 planned。
- [x] 用户已明确授权；真实Issue #402已创建并分配cxy-chenxuanyu，本合同不触发额外通知。
- [x] `validate-traceability.mjs`已通过：19 MUST、24 AC、1 Slice、24 Tests；errors=0、warnings=0，阶段preparation。
- [x] 已填真实Issue Ref、actual_issue_creation与创建/分配状态；DR-072正式建单校验及发布后回读由交付流程留证。
- [ ] 版本化远端包可访问，真实 Issue 已直接回链 SPEC、Handoff、Test Contract。
- [ ] 上线前Q002–Q004及生产测试、鉴权、真实数据对账完成；此项未完成不阻止准备合同或创建Issue。

## 6. Change Control

- SPEC版本或业务规则变化使本文件与 Test Contract 立即 stale；须先更新源合同及受影响ID，再重跑追踪校验。
- 真实Issue后续状态变化须以远端回读为准；本文件不代替正式工程Phase、PR或房总review。
- 生产证据完整后才可把合同改为 verified；I001 released 还必须有真实 Issue Ref 和 `actual_issue_creation: true`。
- 不创建或同步开发进度表；本文件不触发任何通知。
