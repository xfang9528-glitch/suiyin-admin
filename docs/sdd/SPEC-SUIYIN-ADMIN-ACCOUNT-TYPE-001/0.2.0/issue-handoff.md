---
handoff_id: HANDOFF-SUIYIN-ADMIN-ACCOUNT-TYPE-001
spec_id: SPEC-SUIYIN-ADMIN-ACCOUNT-TYPE-001
spec_version: 0.2.0
status: issued
prepared_by: "Codex"
prepared_at: 2026-10-02
actual_issue_creation: true
---

# 全部账号状态按个微和企微分别展示 — Issue Handoff

## 1. 交接摘要

- **源规格**：`SPEC-SUIYIN-ADMIN-ACCOUNT-TYPE-001@0.2.0`。
- **用户问题**：平台管理员只能看到环境账号合计，无法区分个微、企微分别有多少账号在线或掉线。
- **完成后变化**：每个环境先展示个微、企微数量，再展示汇总；在线、掉线账号也按创建时确定的类型分组。
- **目标仓范围**：`PetWebOrg/suiyin-admin`，工程平台字段为 `PC`，具体页面为 Admin 管理页 `allWeChatStatus`；环境佰智德三。
- **交付阶段**：正式 `github-issue` 流程已创建 [PetWebOrg/suiyin-admin#458](https://github.com/PetWebOrg/suiyin-admin/issues/458)，指派房昕；I001为created，`actual_issue_creation: true`。生产实现、CI和上线仍未完成，测试证据仍为planned。
- **负责人**：房昕，GitHub `xfang9528-glitch`；提出人房昕。

## 2. Source Contract

- 唯一行为真源：[同目录 SPEC](spec.md)，精确版本 `0.2.0`；依赖 `SPEC-SUIYIN-ADMIN-056@1.0.0`。
- Constitution：`prototype-sdd@1.4.1`。
- 发布目标 SPEC：[版本化合同](https://github.com/xfang9528-glitch/suiyin-admin/blob/v2026100201-admin-account-type-status/docs/sdd/SPEC-SUIYIN-ADMIN-ACCOUNT-TYPE-001/0.2.0/spec.md)。本文件固定发布目标，不据此宣称远端已可访问；完整推送后的回读结果由独立delivery receipt记录。
- 发布目标 Handoff：[交接合同](https://github.com/xfang9528-glitch/suiyin-admin/blob/v2026100201-admin-account-type-status/docs/sdd/SPEC-SUIYIN-ADMIN-ACCOUNT-TYPE-001/0.2.0/issue-handoff.md)；Test Contract：[测试合同](https://github.com/xfang9528-glitch/suiyin-admin/blob/v2026100201-admin-account-type-status/docs/sdd/SPEC-SUIYIN-ADMIN-ACCOUNT-TYPE-001/0.2.0/test-contract.md)。
- 允许拆分：本轮一个 `I001` 承接 R001–R006，避免统计、名单和来源校验分离后出现口径不一致。
- 禁止漂移：Issue 不另立需求；新增动作、权限、数据范围或接口能力须先回源 SPEC。正式Admin必须按稳定账号ID读取创建时已保存的类型；R003中缺ID时精确名称多重集合核对只用于静态Mock采集构建，不能用于生产身份匹配。静态采集builder不是生产运行架构。

## 3. Issue Slices

| Slice ID | Issue Title | Target Repo | Tenant | Platform | Reporter | Rules | Acceptance | Test IDs | User Problem | User Outcome | Issue Ref | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| I001 | feat(admin): 全部账号状态按个微和企微分别统计及分组（管理员可直接查看各环境两类账号的总数及在线和掉线名单） | PetWebOrg/suiyin-admin | 佰智德三 | PC | 房昕 | R001、R002、R003、R004、R005、R006 | AC-R001-01、AC-R002-01、AC-R003-01、AC-R004-01、AC-R005-01、AC-R006-01 | T-R001-01、T-R002-01、T-R003-01、T-R004-01、T-R005-01、T-R006-01、T-R006-02、T-R006-03 | 总览只有合计，管理员不能分别查看两类账号状态 | 平台管理员可以在同一张表里分别查看两类数量与名单，并核对汇总 | PetWebOrg/suiyin-admin#458 | created |

## 4. Issue Drafts

### I001 — feat(admin): 全部账号状态按个微和企微分别统计及分组（管理员可直接查看各环境两类账号的总数及在线和掉线名单）

#### 用户问题

佰智德三平台管理员在“平台管理 → 全部账号状态”检查各环境时，目前只有账号合计和混合名单，不能直接知道个微、企微各有多少在线或掉线，也难以对应到具体账号。

#### 完成后用户能感受到的变化

平台管理员可以在同一张表里分别查看每个环境个微、企微的总数、在线数和掉线数，最下方保留汇总；右侧在线和掉线名单也分别归到个微、企微。重名账号照常保留，长名单滚动时仍能辨认所属类型。

#### Source Contract

- SPEC：`SPEC-SUIYIN-ADMIN-ACCOUNT-TYPE-001@0.2.0`，使用 §2 中固定标签的发布目标；可访问性以delivery receipt中的发布后回读为准。
- Rules：`R001`、`R002`、`R003`、`R004`、`R005`、`R006`。
- Acceptance：`AC-R001-01`、`AC-R002-01`、`AC-R003-01`、`AC-R004-01`、`AC-R005-01`、`AC-R006-01`。
- Tests：`T-R001-01`、`T-R002-01`、`T-R003-01`、`T-R004-01`、`T-R005-01`、`T-R006-01`、`T-R006-02`、`T-R006-03`。

#### In Scope

- 保留环境行、在线及掉线两侧；统计依次个微、企微、汇总，每行列出总数/在线/掉线；名单只分个微、企微，组标题有数量。
- 类型取账号创建时已确定的个微或企微，正式Admin按稳定账号ID读取；同名不合并、不按名称、位置或别的环境推断身份。每条账号恰好归入一类，分类数量与原汇总一致。
- 某类已确认没有账号时显示 `0` 和“无账号”；缺失或非法数据不能默认个微、偷偷丢条目、显示第三分类或伪装为零。
- 保留原在线/掉线口径。原型整行快照刷新规则是证据对齐约束，生产端使用现有权威总览及创建类型，不把不同时间的状态拼成同一行。
- 保留排序三态、固定表头、页签各自滚动位置、代理页签、已有权限和其他租户行为；长名称可换行，滚动时类型标题不遮挡表头。
- 初次读取失败沿用读取失败/重试；重绘失败保留已有正确内容；不能落到旧演示名单或另一租户数据。

#### Out of Scope

- 改账号创建类型或在线/掉线业务定义；账号批量操作、自动同步、跨租户借用或新增权限。
- 把 Mock 快照数当作生产常量，或把原型的本地采集、确认台账放入产品操作界面。
- Flutter/Go 等其他生产仓实现；本工作区不写任何生产代码。正式工程必须另走 Issue → worktree → Phase → PR → 房总 review。

#### 验收与测试

- 按 SPEC §5 的六项 AC 和 Test Contract 的八项 Test ID 验收，测试名、PR 或 CI artifact 保留相应 ID。
- bzds 设计样例：个微 3/3/0、企微 5/0/5、汇总 8/3/5；两个 `cxy2` 均保留。画美174条、平台43环境及代理118卡同样只属于本轮验收快照，不能硬编码生产值；生产数据随真实库存和状态变化。
- 覆盖空环境、同名同类型、同名不同类型、缺/非法类型、数量不一致、长名单、长名称、初次失败、重绘失败及其他租户入口。
- 原型检查通过仅证明静态样例和交互；工程验收需生产仓实际测试、人工视觉证据及正式发布回执。

#### Metadata

- 租户：佰智德三。
- 平台：PC（Admin 管理页）；工程标签使用 `platform:PC`。
- 代码仓：PetWebOrg/suiyin-admin。
- 提出人：房昕。
- 指派人：房昕 / `xfang9528-glitch`。
- 来源：本轮用户直接指令；不虚构来源群或额外提出人。

## 5. Handoff Gate

- [x] 源 SPEC 为 implemented，锁定 `SPEC-SUIYIN-ADMIN-ACCOUNT-TYPE-001@0.2.0`。
- [x] R001–R006 及六项 AC 已分配到 I001，用户问题、变化和 metadata 已明确。
- [x] I001 引用的八项 Test ID 均在 Test Contract 中定义。
- [x] `validate-traceability.mjs`通过：6条MUST、6项AC、1个切片、8项测试；生产证据阶段为preparation。
- 原型远端版本包发布与上述链接回读另由delivery receipt验收，本合同不预填成功。
- [x] 已通过正式 `github-issue` 流程创建真实Issue #458、指派xfang9528-glitch，回填Issue Ref和`actual_issue_creation`；仓库后置门禁及发布链接回读由主交付链记录。
- [ ] 生产仓测试/人工证据完成前，不升级为 verified/released。

## 6. Change Control

- SPEC 版本或规则变化后本文件 stale，先更新受影响 Slice/Test ID，再重新校验。
- 已创建Issue #458；created不代表doing、released或生产验收通过，后续实际状态须由正式工程回执更新。
- 生产实现、测试、CI 和 PR 只在对应正式工作区完成；原型发布与工程上线分别记录。
- 公开仓只放经发布投影处理的账号名称、脱敏截图、汇总及必要脚本/合同；名称中的 11 位手机号遮罩，原始采集、连接配置及私人诊断保留本地。
