---
handoff_id: HANDOFF-SUIYIN-ADMIN-052
spec_id: SPEC-SUIYIN-ADMIN-052
spec_version: 1.2.0
status: issued
prepared_by: "Codex"
prepared_at: 2026-09-20
actual_issue_creation: true
---

# 销售变声统计 — Issue Handoff

## 1. 交接摘要

- **源规格**：SPEC-SUIYIN-ADMIN-052@1.2.0，状态 implemented。
- **用户问题**：管理者目前只能看到销售消息量和聊天好友数，无法知道每位销售实际使用变声多少次；单独增加统计入口又可能遗漏菜单管理配置。
- **完成后变化**：所有适用租户都能在数据展示中按日期和部门查看每位销售的变声使用次数，沿用销售使用统计的筛选方式；长表下滑仍能看到表头，并可在菜单管理中控制入口。
- **目标仓范围**：PetWebOrg/suiyin-admin；负责人陈宣宇（cxy-chenxuanyu）。
- **真实建单状态**：已创建 https://github.com/PetWebOrg/suiyin-admin/issues/401，工程未验收、未上线。

## 2. Source Contract

- 唯一行为真源：[SPEC-SUIYIN-ADMIN-052@1.2.0](spec.md)。Constitution：prototype-sdd@1.4.1。
- 052 R007 和 Prototype Plan 约束静态原型交付，不能被理解为让生产使用合成Mock。用户另外授权本 I001 走目标仓正式工程流程；真实事件/API必须在工程接入前核实。
- 辅助显示合同：[055@1.1.0](https://github.com/xfang9528-glitch/suiyin-admin/blob/v2026092003-admin-voice-filters-sticky/docs/sdd/SPEC-SUIYIN-ADMIN-055/1.1.0/spec.md) 的 R005 / AC-R005-01/02，仅 salesVoiceStats；不承接其他管理页工程改造。
- [DR-095](decisions/DR-095-admin-data-display-menu-management-parity.md) 与 [DR-093](decisions/DR-093-voice-transform-display-requires-tenant-and-account-config.md) 同包；新功能不得放开既有资格/权限。
- #389 是原型设计背景，不代替本工程Issue。SPEC版本或规则变化必须回源审核并重建追踪。

## 3. Issue Slices

| Slice ID | Issue Title | Target Repo | Tenant | Platform | Reporter | Rules | Acceptance | Test IDs | User Problem | User Outcome | Issue Ref | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| I001 | feat(admin): 实现销售变声统计与菜单管理同步（管理者可以按日期和部门查看每位销售的变声使用次数） | PetWebOrg/suiyin-admin | 深圳艺星 | PC | ZHONG | R001、R002、R003、R004、R005、R006、R007 | AC-R001-01、AC-R002-01、AC-R002-02、AC-R002-03、AC-R003-01、AC-R003-02、AC-R004-01、AC-R005-01、AC-R006-01、AC-R007-01 | T-R001-01、T-R002-01、T-R002-02、T-R002-03、T-R002-04、T-R003-01、T-R003-02、T-R004-01、T-R005-01、T-R006-01、T-R007-01、T-R007-02 | 管理者目前只能看到销售消息量和聊天好友数，无法知道每位销售实际使用变声多少次；单独增加统计入口又可能遗漏菜单管理配置。 | 所有适用租户都能在数据展示中按日期和部门查看每位销售的变声使用次数，沿用销售使用统计的筛选方式；长表下滑仍能看到表头，并可在菜单管理中控制入口。 | https://github.com/PetWebOrg/suiyin-admin/issues/401 | created |

Tenant 是提出环境，不限制实施范围。SPEC的十五租户是静态原型证据范围；用户E002已明确“所有租户”，工程I001须枚举生产注册表中的全部适用租户并保持现有资格和授权，不把15个原型键当生产白名单。

## 4. Issue Drafts

### I001 — feat(admin): 实现销售变声统计与菜单管理同步（管理者可以按日期和部门查看每位销售的变声使用次数）

## Meta

- 租户：深圳艺星
- 平台：PC
- 代码仓：suiyin-admin
- 提出人（群内昵称）：ZHONG

## 用户问题

管理者目前只能看到销售消息量和聊天好友数，无法知道每位销售实际使用变声多少次；单独增加统计入口又可能遗漏菜单管理配置。

## 完成后用户能感受到的变化

所有适用租户都能在数据展示中按日期和部门查看每位销售的变声使用次数，沿用销售使用统计的筛选方式；长表下滑仍能看到表头，并可在菜单管理中控制入口。

## 提出信息

- 提出环境：深圳艺星
- 提出人：ZHONG
- 平台：PC
- 页面：管理网页
- 代码仓：PetWebOrg/suiyin-admin
- 负责人：@cxy-chenxuanyu（陈宣宇）
- 实施范围：所有适用租户，依据生产租户注册表及既有资格/授权覆盖；深圳艺星是提出环境，不是唯一上线租户。原型已覆盖15个租户，属于证据清单，不是生产白名单。

## 唯一行为合同与原型

- [SPEC-SUIYIN-ADMIN-052@1.2.0](https://github.com/xfang9528-glitch/suiyin-admin/blob/v2026092003-admin-voice-filters-sticky/docs/sdd/SPEC-SUIYIN-ADMIN-052/1.2.0/spec.md)
- [Issue Handoff / I001](https://github.com/xfang9528-glitch/suiyin-admin/blob/v2026092003-admin-voice-filters-sticky/docs/sdd/SPEC-SUIYIN-ADMIN-052/1.2.0/issue-handoff.md)
- [Test Contract](https://github.com/xfang9528-glitch/suiyin-admin/blob/v2026092003-admin-voice-filters-sticky/docs/sdd/SPEC-SUIYIN-ADMIN-052/1.2.0/test-contract.md)
- [DR-095 菜单管理同步](https://github.com/xfang9528-glitch/suiyin-admin/blob/v2026092003-admin-voice-filters-sticky/docs/sdd/SPEC-SUIYIN-ADMIN-052/1.2.0/decisions/DR-095-admin-data-display-menu-management-parity.md)
- [表头冻结辅助合同055@1.1.0](https://github.com/xfang9528-glitch/suiyin-admin/blob/v2026092003-admin-voice-filters-sticky/docs/sdd/SPEC-SUIYIN-ADMIN-055/1.1.0/spec.md)：只承接本销售变声统计页的 R005 / AC-R005-01、AC-R005-02。
- [销售变声统计原型](https://suiyin-admin.pages.dev/prototype/_shell.html?tenant=yestar-sz&page=salesVoiceStats&v=v2026092003-admin-voice-filters-sticky)；[销售使用统计参照](https://suiyin-admin.pages.dev/prototype/_shell.html?tenant=yestar-sz&page=salesMessageUsage&v=v2026092003-admin-voice-filters-sticky)。原型数据为合成演示，不是生产真实使用量。
- 关联已有原型设计 Issue：#389。它是原型设计记录且明确不含开发，本单承接工程实现，不以其完成状态代替本单验收。

## 实施与验收范围

1. **入口与菜单管理**：在数据展示的销售使用统计附近新增“销售变声统计”。同步全部适用生产租户菜单库存、适用平台菜单定义，稳定菜单身份、名称、路由和父级一致。显示/隐藏、排序、取消和已有权限沿用现机制，配置仅影响本租户，不强制开启隐藏父级。
2. **筛选完全一致**：统计时间、单日/范围、日期日历、今天/昨天/前天、部门、搜索/重置/导出，与销售使用统计控件、顺序、尺寸、颜色及反馈一致。日期/模式/部门编辑不提前查询；搜索提交，快捷日与重置立即查询；重置回上海今天、单日、全部授权部门与默认排序。非法日期不覆盖上次结果。
3. **次数口径**：租户内独立变声任务首次成功生成计1，按首次成功时间的 Asia/Shanghai 自然日、任务发起销售稳定身份及事件发生时部门归属。重复回调、同任务重试成功不重复计；失败、录音取消、试听不计；多个工作账号归同一销售，不按显示名合并。是否发送成功不改变生成成功这一计数。
4. **表格和导出**：序号、销售、部门、变声使用次数；次数数值排序、分页与导出使用同一已提交筛选，导出全部筛选结果。该页表头在其滚动区域冻结，表尾退出，横向列对齐；排序/分页/筛选重绘后仍有效，日历、下拉和弹窗不被遮挡。
5. **隔离与状态**：仅当前租户和授权部门/销售。服务端接口同样执行授权校验；无权限、加载、失败/重试、无匹配结果与有效0分别表达。失败不能显示全0，重试沿用已提交条件；查询、刷新与导出不得增加次数。

覆盖 Rules：R001、R002、R003、R004、R005、R006、R007。

覆盖 Acceptance：AC-R001-01、AC-R002-01、AC-R002-02、AC-R002-03、AC-R003-01、AC-R003-02、AC-R004-01、AC-R005-01、AC-R006-01、AC-R007-01。

对应 Tests：T-R001-01、T-R002-01、T-R002-02、T-R002-03、T-R002-04、T-R003-01、T-R003-02、T-R004-01、T-R005-01、T-R006-01、T-R007-01、T-R007-02。

## 工程接入前核实与边界

- 先核实真实变声事件与统计API是否已经具备 tenantId、稳定salesId、事件departmentId、独立taskId、首次成功时间/状态及当前授权边界；确认去重、历史部门与上海跨日查询可以得到合同要求的结果。具体接口路径、埋点落点、字段实际名称和后端完成情况尚未调查，不预设已可用。
- 若数据源或接口缺失，在本Issue记录阻塞、证据及所需对接方，由正式工程流程协调；不得用普通消息数、试听次数、前端模拟量或原型合成值交差。本次不自动创建后端Issue，不推定前端页面能替代真实统计能力。
- 已覆盖的15个原型租户稳定键（证据清单，不限制生产范围）：yestar-sz、yestar、yestar-bj、yestar-gz、yestar-hz、yestar-jx、bzds、jbfs、mengzhua、crrm、hqjd、yzhb、ykjl、ruixi-kh-xiaowen、rxxz。已有租户/账号变声配置资格继续沿用 DR-093，不因统计菜单新增而放宽。
- 本Issue只实现销售变声统计功能及本页冻结，不承接全管理页表头改造，不修改销售使用统计原有消息口径，不增加语音发送/模型配置能力，不自动新建租户环境或做历史回填。
- 生产实现走目标代码仓既有 Issue → worktree → Phase → PR → review；Test Contract 当前为计划验收，原型本地通过不代表生产已实现或已上线。PR保留Test ID/AC-ID，并补真实CI、事件/接口集成及人工视觉证据后再验收。

## 已核实的工程参照

已只读核实目标仓现有 src/views/stats/sales_message_usage.test.ts、src/views/stats/ai_assist_stats.test.ts、src/views/admin/menu.vue、src/views/platform/menu.vue 与 vitest.config.ts。可复用现有统计筛选/菜单和 Vitest 模式；未发现已有 salesVoice 专用页面。测试合同路径是待实现计划，不表示生产测试已运行。

## 优先级

P2：常规功能实现，未指定紧急时限；按现有排期推进。

<!-- issue-meta
tenant: 深圳艺星
platform: PC
repo: suiyin-admin
reporter: ZHONG
-->


### Metadata

- 租户：深圳艺星
- 平台：PC
- 页面：管理网页
- 代码仓：PetWebOrg/suiyin-admin
- 提出人：ZHONG
- 负责人：cxy-chenxuanyu（陈宣宇）

## 5. Handoff Gate

- [x] 源 SPEC 状态与精确版本有效，所有7条MUST与10项AC均有Issue及测试映射。
- [x] I001 保留用户问题、完成后变化及用户原文metadata；实施范围不因提出环境缩小。
- [x] 所有测试在同包 Test Contract，生产证据保持 planned，不伪称已验收。
- [x] 本轮用户已明确授权真实建单，由根执行 github-issue 正式流程并回读。
- [x] validate-traceability.mjs 已通过（见 evidence/traceability.json）。

## 6. Change Control

SPEC版本变化后合同立即stale；生产实现/测试/CI/PR在目标仓正式流程完成。I001从created进入released前必须补实际证据、真实Issue回链，并使Handoff和Test Contract均为verified；原型报告不能替代生产CI。
