---
test_contract_id: TEST-CONTRACT-SUIYIN-ADMIN-071
spec_id: SPEC-SUIYIN-ADMIN-071
spec_version: 1.3.1
status: draft
prepared_by: "Codex"
prepared_at: 2026-09-28
---

# 艺星回访规则管理与联动 — Test Contract

## 1. 测试摘要

- **源规格**：[SPEC-SUIYIN-ADMIN-071@1.3.1](https://github.com/xfang9528-glitch/suiyin-admin/blob/v2026092803-admin-revisit-anchors/docs/sdd/SPEC-SUIYIN-ADMIN-071/1.3.1/spec.md)，锁定v2026092803-admin-revisit-anchors。
- **对应Handoff**：[HANDOFF-SUIYIN-ADMIN-071](https://github.com/xfang9528-glitch/suiyin-admin/blob/v2026092804-admin-revisit-handoff/docs/handoffs/SPEC-SUIYIN-ADMIN-071/1.3.1/20260928/issue-handoff.md)；补充目录与tag目前是发布计划，需发布回读。
- **测试分配**：I001管理页18规则/23AC/23Test；I002后续PC1规则/1AC/1Test。I002仅planned，本次不创建真实Issue。
- **真实任务**：[管理页Issue #438](https://github.com/PetWebOrg/suiyin-admin/issues/438)，仅I001已建单并指派chinaszzt；I002仍无Issue。
- **证据状态**：全部生产Test为planned；现有模型/Chrome/file测试及截图是静态原型参考，不能代替生产CI和真实数据联调结果。
- **边界**：本文件定义测什么及Oracle；框架和实际测试路径在目标生产仓正式流程中决定。下列路径是明确的计划位置，不声称文件已经存在。

## 2. Strategy

- I001目标仓PetWebOrg/suiyin-admin；真实编辑/保存/启停的服务联动、权限和失败恢复使用集成/e2e/security测试；不假定原型已有生产API。
- 计算与事件边界允许固定合成夹具并明确时区/时刻/身份。Q002/Q003/Q004/Q008仅原型默认，正式工程开工先核实；未确认不能因fixture PASS而直接用于生产计算。
- 所有24项AC均可进行机器可判定验证，使用automated；窄窗、字段可读性及无多余二级事件控件另保留截图作为人工复核材料，不能替代矩阵中的自动判定。
- 当生产数据源无法区分缺失与完整空历史时，结果只能标未知/未接通，不可用快照或其他事件填补。不访问或复制原始私聊。
- I001的运行设置是配置能力；测试替身验证没有真实调度、PC名单生成、发送或重分配调用。I002只规划读取权限测试，不自行实施。
- R008虽然在规格表也引用AC-R015-03，稳定AC归属仍为R015，因此节点增删测试归T-R015-03，避免错误映射。

## 3. Coverage Matrix

| Test ID | Slice ID | Rule | Acceptance | Layer | Automation | Target Repo | Planned Test Path | Oracle | CI Evidence | Manual Reason |
|---|---|---|---|---|---|---|---|---|---|---|
| T-R001-01 | I001 | R001 | AC-R001-01 | e2e | automated | PetWebOrg/suiyin-admin | tests/revisit-rules/integration/r001-01.spec.ts | 账号甲/乙分属渠道A/B；通过同一群组→工作号控件分别保存规则后，各规则仅含所选群组或指定部分账号，摘要可区分两者，不出现咨询师部门字段。 | planned | — |
| T-R002-01 | I001 | R002 | AC-R002-01 | parameterized | automated | PetWebOrg/suiyin-admin | tests/revisit-rules/integration/r002-01.spec.ts | 六艺星分别展开两侧条件，逐项对照源SPEC§6.3：21项选中、26项排除均有入口、字段类型/选项归属正确；新增事件基准不混入条件目录。 | planned | — |
| T-R003-01 | I001 | R003 | AC-R003-01 | domain | automated | PetWebOrg/suiyin-admin | tests/revisit-rules/domain/r003-01.spec.ts | 给定等级A且需求甲的选中条件及我方/对方近2天消息排除夹具，只有两项选中均满足且两项排除均不命中时入选；任一排除命中不能再被加回。同一字段多选OR，空条件不参与。消息口径生产核实见G002。 | planned | — |
| T-R004-01 | I001 | R004 | AC-R004-01 | domain | automated | PetWebOrg/suiyin-admin | tests/revisit-rules/domain/r004-01.spec.ts | 按Q002演示夹具，9月24日添加且共同基准为添加日期，第3/5天节点在9月27/28/29日依次命中节点A/无/节点B；不依赖前节点完成或中途消息；附加日期条件继续AND，节点天数不重复配置。生产时间口径先核实。 | planned | — |
| T-R005-01 | I001 | R005 | AC-R005-01 | domain | automated | PetWebOrg/suiyin-admin | tests/revisit-rules/domain/r005-01.spec.ts | 深圳样本第5天到期，仅对方或仅我方存在近2天消息时均排除；之后第7天仍按原添加日计算；空白新规则不自动附加深圳排除；48小时及消息类型仅按核实后的生产口径验收。 | planned | — |
| T-R006-01 | I001 | R006 | AC-R006-01 | integration | automated | PetWebOrg/suiyin-admin | tests/revisit-rules/integration/r006-01.spec.ts | 合法规则保存后未启用，单独启用才更新启用状态；每日时间为整条规则共享，无节点启停/运行时刻；北京时间当前时刻已过01:00时，下次计划为次日01:00，不补跑今日。不以计划展示证明调度已运行。 | planned | — |
| T-R007-01 | I001 | R007 | AC-R007-01 | integration | automated | PetWebOrg/suiyin-admin | tests/revisit-rules/integration/r007-01.spec.ts | 已启用规则编辑时，取消及模拟写入失败后读回的规则内容、身份和启用状态与原版相同；失败草稿保留可重试；成功保存才替换同一规则，重复提交不生成第二条。新版本按下次计划使用的配置约定保存，不要求本单运行调度。 | planned | — |
| T-R008-01 | I001 | R008 | AC-R008-01 | e2e | automated | PetWebOrg/suiyin-admin | tests/revisit-rules/integration/r008-01.spec.ts | 必填及节点合法而夹具命中0人时允许保存，显示明确0人；加载失败、无权限、未知数据分别标明，不显示为0。空账号范围、非法或重复节点阻止保存；仅范围+节点+排除可保存，无需额外等级筛选或勾选好友。 | planned | — |
| T-R009-01 | I001 | R009 | AC-R009-01 | security | automated | PetWebOrg/suiyin-admin | tests/revisit-rules/security/r009-01.spec.ts | 已选当前渠道账号1后搜索账号2，当前结果全选只改变可见结果且清空搜索保留账号1；节点所在账号条件不能扩出共同范围；跨租户账号ID被拒绝或排除且不返回其数据；动态群组生产含义先核实G003。 | planned | — |
| T-R010-01 | I001 | R010 | AC-R010-01 | security | automated | PetWebOrg/suiyin-admin | tests/revisit-rules/security/r010-01.spec.ts | 消息/事件关键字段缺失的对象标无法判断及原因；账号群组或账号失效后明确展示并阻止带失效配置启用；不回退全部账号、不把缺失当无联系或从未到店，客户端参数不能授予额外权限。 | planned | — |
| T-R011-01 | I001 | R011 | AC-R011-01 | e2e | automated | PetWebOrg/suiyin-admin | tests/revisit-rules/integration/r011-01.spec.ts | 编辑和保存后摘要逐项一致展示共同范围、基准、节点、排除、运行时间与状态；固定夹具试算标日期+运行时刻并给各行入选/排除/未知理由，结果确定可复现且明确为示例，不冒充真实人数。 | planned | — |
| T-R012-01 | I001 | R012 | AC-R012-01 | contract | automated | PetWebOrg/suiyin-admin | tests/revisit-rules/integration/r012-01.spec.ts | 保存/启用/示例试算只改变配置或运行固定夹具；在集成替身记录中不产生实际调度、PC名单生成、发送、客户重分配调用。未来示例不显示为已确定正式名单，执行时刻文案为筛选时间而非发送时间。 | planned | — |
| T-R013-01 | I001 | R013 | AC-R013-01 | parameterized | automated | PetWebOrg/suiyin-admin | tests/revisit-rules/integration/r013-01.spec.ts | 六艺星均进入本租户回访规则，非艺星无新增入口且强制直接路由不返回艺星页面数据；旧群发原入口、筛选及零选人守卫保持，切换租户不串账号、选项、规则或状态。 | planned | — |
| T-R013-02 | I001 | R013 | AC-R013-02 | parameterized | automated | PetWebOrg/suiyin-admin | tests/revisit-rules/integration/r013-02.spec.ts | 六租户聊天管理和各自菜单管理各有且仅有一个revisitRules；深圳/广州/杭州/嘉兴沿用group-10、成都/北京沿用group-9；德三allMenu仅一份平台定义；已有名称、排序、隐藏、删除、权限调整不被重置，不自动分发非艺星。 | planned | — |
| T-R013-03 | I001 | R013 | AC-R013-03 | security | automated | PetWebOrg/suiyin-admin | tests/revisit-rules/security/r013-03.spec.ts | 在甲租户保存启用规则并复制节点后，切到其余五租户刷新，各自规则/实体/试算仅属当前tenant，深圳既有数据不变；跨tenant账号ID不能扩大权限或命中其他租户好友，合成数据不冒充真实实体。 | planned | — |
| T-R014-01 | I002 | R014 | AC-R014-01 | security | automated | PetWebOrg/flutter-suiyin | test/revisit/revisit_access_contract_test.dart | 仅后续I002：夹具账号甲乙均有应回访对象；A仅甲权限、B仅乙权限、C两者权限时读取集合分别为甲/乙/并集；撤销A的甲权限后后续读取不得返回甲对象，同一联系人跨账号仍按账号下身份隔离。不要求本单生成PC名单。 | planned | — |
| T-R015-01 | I001 | R015 | AC-R015-01 | integration | automated | PetWebOrg/suiyin-admin | tests/revisit-rules/integration/r015-01.spec.ts | 在第5天节点复制第3天条件后，将目标排除2天改3天：目标仍第5天、来源仍第3天且2天条件未变；共同账号范围/基准/运行时间/启停及节点身份均不变，顶层仍一条规则。 | planned | — |
| T-R015-02 | I001 | R015 | AC-R015-02 | integration | automated | PetWebOrg/suiyin-admin | tests/revisit-rules/integration/r015-02.spec.ts | 目标有条件时先展示仅替换选中/排除的范围；取消复制草稿不变，确认只更新目标草稿；取消整条编辑恢复已存内容，成功整条保存才生效；重复保存不新增规则/节点，复制不携带结果或执行记录。 | planned | — |
| T-R015-03 | I001 | R015 | AC-R015-03 | e2e | automated | PetWebOrg/suiyin-admin | tests/revisit-rules/integration/r015-03.spec.ts | 列表仅一条规则且摘要显示3/5/7节点；支持在草稿新增、改天数、改条件、移除，至少保留一个合法节点、按天数排序、同一基准不重复天数；取消编辑恢复被删节点。 | planned | — |
| T-R016-01 | I001 | R016 | AC-R016-01 | e2e | automated | PetWebOrg/suiyin-admin | tests/revisit-rules/integration/r016-01.spec.ts | 原位基准下拉精确15项：旧5日期ID、4等级、6个首次/最近事件；appointment仅更名预约日期不加重复项。等级显示人工/AI控件，事件无二次次数选择；21/26条件与共同设置/节点布局保持。 | planned | — |
| T-R017-01 | I001 | R017 | AC-R017-01 | domain | automated | PetWebOrg/suiyin-admin | tests/revisit-rules/domain/r017-01.spec.ts | 分别给到店/购买/划扣9月20日、24日和未来28日独立历史，9月27日01:00第3天节点：首次取20日不命中、最近取24日命中；先排除晚于运行时刻的事件，不以另一事件类型回退；附加条件继续参与。 | planned | — |
| T-R017-02 | I001 | R017 | AC-R017-02 | domain | automated | PetWebOrg/suiyin-admin | tests/revisit-rules/domain/r017-02.spec.ts | 所选历史缺失/损坏为未知，明确完整空或仅未来记录为未入选；等于运行时刻的有效事件可用、当天较晚事件不可用，过去事件仍按首次/最近选择；按Q002演示北京时间自然日差和当天第0天，不推断生产数据完整性。 | planned | — |
| T-R018-01 | I001 | R018 | AC-R018-01 | domain | automated | PetWebOrg/suiyin-admin | tests/revisit-rules/domain/r018-01.spec.ts | Q008演示夹具人工B→A(20日)、A→B(24日)、B→A(25日)、A→A(26日)，28日第3天取25日；AI只读AI历史；当前变B不隐式排除，需显式当前等级条件；未来不用、快照不替代历史、缺失/坏值未知、完整无进入事件不入选。生产默认先核实G004。 | planned | — |
| T-R019-01 | I001 | R019 | AC-R019-01 | integration | automated | PetWebOrg/suiyin-admin | tests/revisit-rules/integration/r019-01.spec.ts | 旧5日期无新参数按原ID恢复；6个合法事件pair各自回显15项中的正确选项，打开/取消不迁写；缺失/非法来源或次数阻止保存且保留草稿，只有显式选择可修复；成功保存刷新保持摘要与配对，失败不改已存内容；节点复制不改共同基准，tenant及QA隔离不变。 | planned | — |

## 4. Test Data & Profiles

| Data ID | Tenant / Profile | 前置数据 | 隐私处理 | 覆盖 Test IDs |
|---|---|---|---|---|
| D001 | 六艺星授权账号目录 | 每店独立群组A/B、稳定账号1/2及无权/失效/跨tenant账号；动态群组移入移出场景按Q004核实后使用 | 合成稳定身份，不借用深圳实体充其他门店 | T-R001-01、T-R009-01、T-R010-01、T-R013-01、T-R013-02、T-R013-03 |
| D002 | 六艺星配置目录 | 21/26字段清单、15基准UI项、12内部模型类型、等级人工/AI、6事件pair、无额外字段的旧5日期规则 | 合成规则、明确演示标记；无真实客户记录 | T-R002-01、T-R016-01、T-R019-01 |
| D003 | 深圳计算样本 | 9月24日添加；3/5/7节点；双向消息分别在运行时前48小时边界、边界内外以及未来；空/未知消息分别标明 | 固定夹具，不读取私聊；Q002/Q003仍待生产核实 | T-R003-01、T-R004-01、T-R005-01、T-R008-01、T-R011-01 |
| D004 | 配置服务联调 | 已保存已启用规则、编辑草稿、写入失败替身、重复提交、失效账号、各tenant独立存储 | 正式测试环境使用最小必要脱敏数据；替身失败可重复 | T-R006-01、T-R007-01、T-R008-01、T-R010-01、T-R012-01、T-R015-01、T-R015-02、T-R015-03、T-R019-01 |
| D005 | 三类事件与双来源等级 | 每类独立20/24/28日历史；缺失/损坏/完整空/只有未来；等于运行时刻和当天较晚；人工20/24/25/26日状态变化，AI不同历史 | 合成历史，完整性状态显式；不把演示来源当真实数据接通 | T-R017-01、T-R017-02、T-R018-01、T-R019-01 |
| D006 | 后续PC权限计划 | 甲乙账号各有应回访对象；A仅甲、B仅乙、C双权限；A撤权；同名联系人跨账号 | 后续最小合成/脱敏对象，当前不建立真实名单 | T-R014-01 |

实际生产联调数据及完整性来源由正式工程流程记录。没有某门店来源时不能沿用其他门店实体或无声回退全量；五店提出环境不改变六店适用矩阵。

## 5. CI Gates

- I001的PR必须运行其23项Test IDs；Test ID或AC-ID至少以测试名称、注释或报告标签一种方式可机器检索。计划路径可按生产仓约定调整，但稳定ID与Oracle不变。
- 测试结果须绑定生产commit、目标环境、租户范围和失败原因；保存成功必须有真实服务读回证据，模拟成功或localStorage PASS不够。
- G001–G004生产口径和G005来源/权限核实未闭合时，不把相关演示模型测试标为生产语义已通过；要在工程记录中区分fixture Oracle、真实接口兼容和生产业务结论。
- 对未知、零人、无权限、坏配置分别断言；仅看总人数不足以通过权限/事件测试。至少覆盖当前权限撤销、跨tenant账号、事件运行时刻截断和取消失败恢复。
- I002不随I001自动运行或发布；后续正式授权后再建立PC测试实现与CI门。其planned状态和无Issue Ref是本次边界。
- Handoff/Test Contract整体verified或任一Slice released时，现行校验要求全部测试实际证据；不能用本轮原型成果或未实施I002的planned值通过闭环。I001局部完成先在真实Issue留证，不谎报整个合同已verified/released。
- 源SPEC变化导致本合同stale；业务Oracle争议须回源审核，不能改测试期望迁就实现。

## 6. Evidence

| Evidence ID | Test IDs | 类型 | 位置 | 保留时机 |
|---|---|---|---|---|
| EV001 | T-R001-01、T-R002-01、T-R003-01、T-R004-01、T-R005-01、T-R006-01、T-R007-01、T-R008-01、T-R009-01、T-R010-01、T-R011-01、T-R012-01、T-R013-01、T-R013-02、T-R013-03、T-R015-01、T-R015-02、T-R015-03、T-R016-01、T-R017-01、T-R017-02、T-R018-01、T-R019-01 | 计划生产CI及联调记录 | planned；创建Issue后在实际PR/CI artifact回链 | PR与工程验收 |
| EV002 | T-R014-01 | 后续PC权限CI计划 | planned；I002后续另行授权创建后填写 | 后续PC实施 |
| EV003 | T-R016-01、T-R017-01、T-R017-02、T-R018-01、T-R019-01 | 静态原型参考，不是生产完成证据 | [已发布1.3.1原型证据目录](https://github.com/xfang9528-glitch/suiyin-admin/tree/v2026092803-admin-revisit-anchors/docs/sdd/SPEC-SUIYIN-ADMIN-071/1.3.1/checks) | 保留原版本冻结引用 |

## 7. Change Control

源SPEC版本或规则变化后本合同stale。仅补工程测试位置/实际证据不能改变Oracle；规则变更先回源审批。新增Handoff/Test Contract独立发布在`docs/handoffs/SPEC-SUIYIN-ADMIN-071/1.3.1/20260928/`，不修改已发布66文件SDD快照。生产代码、测试、CI及发布仅在对应正式工作区按Issue/worktree/Phase/PR/review执行；本合同不构成当前AI项目跨仓实施授权。
