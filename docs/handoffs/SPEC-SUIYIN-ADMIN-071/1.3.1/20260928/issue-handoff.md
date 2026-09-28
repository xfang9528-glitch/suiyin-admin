---
handoff_id: HANDOFF-SUIYIN-ADMIN-071
spec_id: SPEC-SUIYIN-ADMIN-071
spec_version: 1.3.1
status: issued
prepared_by: "Codex"
prepared_at: 2026-09-28
actual_issue_creation: true
---

# 艺星回访规则管理与联动 — Issue Handoff

## 1. 交接摘要

- **源规格**：[SPEC-SUIYIN-ADMIN-071@1.3.1](https://github.com/xfang9528-glitch/suiyin-admin/blob/v2026092803-admin-revisit-anchors/docs/sdd/SPEC-SUIYIN-ADMIN-071/1.3.1/spec.md)，固定为已发布的v2026092803-admin-revisit-anchors，不以后续master漂移替代。
- **用户问题**：运营每天重复拼选人条件，不同渠道、账号和回访目的需要重复维护；原有单次群发不能直接表达未来各时间节点的回访规则。
- **完成后变化**：管理者按本租户账号范围保存一条含多个节点的回访规则，各节点独立选中/排除；可选择明确的日期、等级或首次/最近事件基准，并单独启用或暂停配置。
- **本次真实建单范围**：仅I001管理页配置编辑、读写/启停联动和来源核实，目标PetWebOrg/suiyin-admin，负责人张拓（chinaszzt）。已创建[Issue #438](https://github.com/PetWebOrg/suiyin-admin/issues/438)，并回读确认负责人chinaszzt、五名提出人和标签。
- **后续计划**：I002仅保留PC按账号接待权限可见性的追踪，不创建第二条Issue，不授权生产代码实施。
- **合同状态**：issued；actual_issue_creation为true，仅I001对应真实Issue #438。生产测试均planned，已通过的静态原型证据不能替代生产CI或接口联调证据。

## 2. Source Contract

- 唯一行为真源：[已发布SPEC@1.3.1](https://github.com/xfang9528-glitch/suiyin-admin/blob/v2026092803-admin-revisit-anchors/docs/sdd/SPEC-SUIYIN-ADMIN-071/1.3.1/spec.md)；Constitution为prototype-sdd@1.4.1。依赖版本沿用源SPEC，不另创业务口径。
- 本次是工程交付补充合同，不追溯改写原型SPEC的历史Out of Scope。用户此次明确要求给张拓建单，授权创建交付合同及I001；不等于授权在AI项目工作区实现生产代码。
- 计划远端补充目录：`docs/handoffs/SPEC-SUIYIN-ADMIN-071/1.3.1/20260928/`；计划发布tag：`v2026092804-admin-revisit-handoff`。这两个位置当前是发布计划，不据此声称远端已存在。
- 补充合同链接：[Issue Handoff](https://github.com/xfang9528-glitch/suiyin-admin/blob/v2026092804-admin-revisit-handoff/docs/handoffs/SPEC-SUIYIN-ADMIN-071/1.3.1/20260928/issue-handoff.md)、[Test Contract](https://github.com/xfang9528-glitch/suiyin-admin/blob/v2026092804-admin-revisit-handoff/docs/handoffs/SPEC-SUIYIN-ADMIN-071/1.3.1/20260928/test-contract.md)，发布后需实际回读。
- 既有`docs/sdd/SPEC-SUIYIN-ADMIN-071/1.3.1/`的66文件冻结原样。不得在旧快照内补写当前Issue编号、Handoff或测试状态。
- 管理页与后续PC拆为I001/I002。后续新业务或生产口径不同于源SPEC时，先回源规格形成经批准的新版本，不能在Issue或代码中自行决定。

## 3. Issue Slices

| Slice ID | Issue Title | Target Repo | Tenant | Platform | Reporter | Rules | Acceptance | Test IDs | User Problem | User Outcome | Issue Ref | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| I001 | feat(revisit): 实现艺星回访规则管理与多节点筛选配置（管理者可以按账号和时间节点保存、编辑并启停回访规则） | PetWebOrg/suiyin-admin | 艺星 | PC | 客服一部-陈薇、李愉、美美美美娟、惠惠子🎀、班晓慧 | R001、R002、R003、R004、R005、R006、R007、R008、R009、R010、R011、R012、R013、R015、R016、R017、R018、R019 | AC-R001-01、AC-R002-01、AC-R003-01、AC-R004-01、AC-R005-01、AC-R006-01、AC-R007-01、AC-R008-01、AC-R009-01、AC-R010-01、AC-R011-01、AC-R012-01、AC-R013-01、AC-R013-02、AC-R013-03、AC-R015-01、AC-R015-02、AC-R015-03、AC-R016-01、AC-R017-01、AC-R017-02、AC-R018-01、AC-R019-01 | T-R001-01、T-R002-01、T-R003-01、T-R004-01、T-R005-01、T-R006-01、T-R007-01、T-R008-01、T-R009-01、T-R010-01、T-R011-01、T-R012-01、T-R013-01、T-R013-02、T-R013-03、T-R015-01、T-R015-02、T-R015-03、T-R016-01、T-R017-01、T-R017-02、T-R018-01、T-R019-01 | 不同渠道重复配置选人，难以统一维护各回访节点 | 管理者可以按账号和时间节点保存、编辑并启停回访规则 | https://github.com/PetWebOrg/suiyin-admin/issues/438 | created |
| I002 | feat(pc): 按账号接待权限读取应回访列表（只看到自己有接待权限账号下的应回访好友） | PetWebOrg/flutter-suiyin | 艺星 | PC | 客服一部-陈薇、李愉、美美美美娟、惠惠子🎀、班晓慧 | R014 | AC-R014-01 | T-R014-01 | 后续回访名单不能因共用规则而扩大账号访问范围 | 只看到有接待权限账号下的应回访好友 | — | planned |

I001包含18个R-ID和23个AC-ID；I002仅包含R014和1个AC-ID。全表覆盖源SPEC19个MUST/24项AC；I002的planned不是建单、排期、认领或生产实施授权。

## 4. Issue Drafts

### I001 — feat(revisit): 实现艺星回访规则管理与多节点筛选配置（管理者可以按账号和时间节点保存、编辑并启停回访规则）

#### 用户问题

管理者需要按不同渠道和工作号安排持续回访，目前每天重复筛人，时间节点与排除条件难以作为一套规则复用。需要先把一条规则内的多个节点配置清楚，保存后再决定启用，避免把配置当日好友固化为未来名单。

#### 完成后用户能感受到的变化

可在管理页选择账号范围，维护一条含多个时间节点的回访规则；节点之间可复制筛选条件再独立调整，明确选择日期、人工/AI等级或首次/最近一次到店、购买、划扣作为基准，并保存、启用或暂停这套配置。

#### Source Contract

- SPEC：[SPEC-SUIYIN-ADMIN-071@1.3.1](https://github.com/xfang9528-glitch/suiyin-admin/blob/v2026092803-admin-revisit-anchors/docs/sdd/SPEC-SUIYIN-ADMIN-071/1.3.1/spec.md)。
- Rules：R001、R002、R003、R004、R005、R006、R007、R008、R009、R010、R011、R012、R013、R015、R016、R017、R018、R019。
- Acceptance：AC-R001-01、AC-R002-01、AC-R003-01、AC-R004-01、AC-R005-01、AC-R006-01、AC-R007-01、AC-R008-01、AC-R009-01、AC-R010-01、AC-R011-01、AC-R012-01、AC-R013-01、AC-R013-02、AC-R013-03、AC-R015-01、AC-R015-02、AC-R015-03、AC-R016-01、AC-R017-01、AC-R017-02、AC-R018-01、AC-R019-01。
- Tests：T-R001-01、T-R002-01、T-R003-01、T-R004-01、T-R005-01、T-R006-01、T-R007-01、T-R008-01、T-R009-01、T-R010-01、T-R011-01、T-R012-01、T-R013-01、T-R013-02、T-R013-03、T-R015-01、T-R015-02、T-R015-03、T-R016-01、T-R017-01、T-R017-02、T-R018-01、T-R019-01，对应[Test Contract](https://github.com/xfang9528-glitch/suiyin-admin/blob/v2026092804-admin-revisit-handoff/docs/handoffs/SPEC-SUIYIN-ADMIN-071/1.3.1/20260928/test-contract.md)。

#### In Scope

- 六个已批准艺星租户的现有管理入口、规则列表及新建/编辑；五店提出环境不缩减北京适用范围。
- 同一规则共享账号群组/账号、回访基准、每日时间和启停；节点维护第N天及独立条件，至少一个、不重复，复制仅替换目标条件。
- 继承21项选中/26项排除，选中AND、同字段多选OR、排除OR及权限收窄；账号选择复用现有搜索/多选操作。
- 原位15项基准，事件选项直接表示首次/最近一次，保留既有anchor与anchorOccurrence配对；等级保留人工/AI来源，不增加事件次数二级下拉。
- 配置编辑、保存、读回、启停联动及失败恢复；范围/字段来源、数据完整性和权限真源核实。具体接口/存储实现由正式工程流程确定，不在此杜撰已有API。
- 摘要、计划时点和有明确合成标识的固定夹具试算；生产来源未核实前不展示为真实命中人数，不把状态保存成功写成已运行。
- 旧字段和合法事件pair兼容；原型v1/v2保护可作兼容Oracle，不把本机localStorage原文导入生产作为默认迁移方案。

#### Out of Scope

- R014的PC列表实施；实际定时调度、正式名单生成、补跑、跨规则去重、发送及执行前再排除检查。
- 销售分配/认领、完成状态共享、执行质检、话术与AI个性化内容、跨账号客户合并。
- Q005未确认的购买产品字段映射；新购买基准不等于按已购产品筛选。
- 非艺星新增入口、群发本体改造、重新设计布局；任何未经授权的跨仓生产代码和生产发布。

#### 开工核实与生产验收约束

以下核实点来自源SPEC已显式保留的缺口；不是新增业务规则，也不应反复追问已明确的节点层级和15项选择。

| Gate | 来源 | 正式工程阶段要核实的内容 | 当前允许的验证 |
|---|---|---|---|
| G001 | Q002 | 添加日第0/1天、北京时间自然日差、近两天48小时/自然日的生产口径 | 原型夹具按第0天、自然日差和滚动48小时运行；标演示口径，不能静默外推 |
| G002 | Q003 | 工作号整体消息来源、成功群发、手机同步、系统/失败/撤回消息的计入规则和完整性 | 使用明确标注的我方/对方消息夹具；无法取得完整数据时不把未知当没联系 |
| G003 | Q004 | 按群组选的动态成员范围与稳定指定账号ID、移入移出和权限失效的生产含义 | 先保存结构化范围，不用保存时账号快照冒充已确认长期语义 |
| G004 | Q008 | 等级最近一次进入、重复同级不重置、新选人工默认是否作为生产口径 | 人工/AI可选已确认；事件计算仅按已标注演示Oracle，生产默认未确认不擅定 |
| G005 | R010、R017–R019、§8 | 六店真实事件历史及完整性、账号下好友身份、时间字段；管理和只读权限真源；保存失败/重复提交的真实服务行为 | 来源明确前保留合成试算；仅有当前等级快照不能伪造历史 |
| G006 | Q005、§11 | “分产品”的现有字段映射及后续调度/PC/去重/质检边界 | 保留既有字段，不新增假数据字段，不实现后续切片 |

无法核实的项记录为未闭合依赖，禁止把原型默认或fixture PASS当生产口径已批准。核实产生新业务决定时按源SPEC变更控制处理；已确认的配置功能可继续实施。

#### 验收与测试

- PR/CI对应23个I001 Test IDs保留机器可检索标签、结果及证据链接。每项Oracle见Test Contract。
- 生产配置读写/权限使用正式测试环境与最小必要脱敏数据；计算可用固定夹具。原型本地测试证明交互参考正确，不证明生产数据接通。
- 本单“启用”只验收配置状态与计划时点约定，不把它升级为真实每日筛人任务；调用替身应证明未越入调度、名单、发送或客户重新分配链路。
- 未获得真实CI/联调证据前不填verified/released，不以可保存页面或合成试算宣称生产功能完成。

#### Metadata

- 租户：艺星
- 平台：PC
- 代码仓：PetWebOrg/suiyin-admin
- 负责人：张拓（chinaszzt）
- 标签：enhancement、P2、feat:contacts、status:todo、tenant:艺星、platform:PC
- 提出人：客服一部-陈薇、李愉、美美美美娟、惠惠子🎀、班晓慧
- 来源：房总2026-09-28当前对话明确指定五店及提出人；并已确认李愉、美美美美娟为完整昵称，班晓慧为已批准可见别名。

| 提出环境 | 对应完整昵称/批准别名 |
|---|---|
| 成都艺星 | 客服一部-陈薇 |
| 深圳艺星 | 李愉 |
| 杭州艺星 | 美美美美娟 |
| 广州艺星 | 惠惠子🎀 |
| 嘉兴艺星 | 班晓慧 |

上述五店是提出环境；功能适用范围仍按SPEC包含深圳、成都、北京、广州、杭州、嘉兴六店。北京不是本次提出环境，不虚构其提出人。

机器metadata与人类字段一致：

```json
{
  "tenant": "艺星",
  "platform": "PC",
  "repo": "PetWebOrg/suiyin-admin",
  "reporter": "客服一部-陈薇、李愉、美美美美娟、惠惠子🎀、班晓慧",
  "assignee": "chinaszzt",
  "labels": ["enhancement", "P2", "feat:contacts", "status:todo", "tenant:艺星", "platform:PC"],
  "proposal_environments": ["成都艺星", "深圳艺星", "杭州艺星", "广州艺星", "嘉兴艺星"]
}
```

### I002 — 后续PC权限可见性计划，当前不创建Issue

- Rules：R014；Acceptance：AC-R014-01；Tests：T-R014-01。
- 预期PC消费者目标仓：PetWebOrg/flutter-suiyin；无当前实施或跨仓写入授权，后续另走正式Issue/worktree/Phase/PR/review。
- 用户问题：共用回访规则不能使销售看到无接待权限工作账号下的客户。
- 用户结果：读取应回访列表时始终按当前接待权限与账号下好友身份收窄，撤权后不可继续读取。
- 本计划仅定义可见性Oracle；名单如何生成、执行/完成共享、分配和防重复仍另审。不能把多名有权销售均可见误写成独占认领。
- Issue Ref保持—、status保持planned；本次不创建第二单。

## 5. Handoff Gate

- [x] 源SPEC为approved，版本锁定1.3.1，不修改原66文件快照。
- [x] 所有19个MUST R-ID和24个AC-ID分配至I001/I002，23/1划分明确。
- [x] 每个Slice写明用户问题、结果、metadata及测试回链；I001仅创建一条真实Issue。
- [x] 原型默认、生产来源核实与R012配置阶段边界已明确。
- [x] 2026-09-28实际运行validate-traceability.mjs通过：19 MUST、24 AC、2 Slice、24 Test；preparation阶段，0 error、0 warning。此结果是合同结构校验，不是生产测试执行。
- [x] 已完成github-issue来源、查重、metadata及创建前后机器校验；真实Issue #438为OPEN/status:todo，指派chinaszzt。
- [x] 已回填I001真实Issue Ref和actual_issue_creation；I002仍无真实Issue，旧SDD快照不回写。
- [ ] verified/released时才填写生产实际证据。I001完成不自动关闭I002或把整个SPEC视为已落地。

## 6. Change Control

源SPEC版本变化时本合同stale；不得用Issue评论覆盖已批准Oracle。新生产默认须回源审核。生产实现/测试/CI/PR仅在正式工程工作区进行，本地AI项目只准备原型和合同。新补充目录与tag经实际发布回读后才能声称远端交付完成。
