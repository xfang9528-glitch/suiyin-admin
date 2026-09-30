---
handoff_id: HANDOFF-SUIYIN-ADMIN-076
spec_id: SPEC-SUIYIN-ADMIN-076
spec_version: 1.0.1
status: issued
prepared_by: "Codex"
prepared_at: 2026-09-30
actual_issue_creation: true
---

# 指定租户时间入口移除与菜单状态胶囊 — Issue Handoff

## 1. 交接摘要

- **源规格**：`SPEC-SUIYIN-ADMIN-076@1.0.1`。
- **用户问题**：全部艺星与画美、傲丽仍能看到不再需要的上下班时间设置；管理员切换菜单可见性时还需进入编辑弹窗。
- **完成后变化**：指定租户不再出现上下班时间配置；菜单表格可直接选择显示或隐藏，保存失败恢复此前状态。
- **本次工程授权**：房总2026-09-30明确要求完整推送，并给王争建立截图中第3、4项功能的 Issue。仅创建 I001、I002，目标仓 `PetWebOrg/suiyin-admin`，负责人王争（`@kitesky`）。
- **提出环境与提出人**：佰智德三 / 房昕。提出环境用于来源与通知，不等于时间设置要从佰智德三移除。
- **状态边界**：已创建并回读核对 I001 #448 与 I002 #449，`actual_issue_creation: true`；两张均指派 @kitesky，状态 status:todo。HTML原型已实现不代表生产实现或上线。
- **其余发布内容**：R001–R003仅以 I003 记录原型交付覆盖；`SPEC-SUIYIN-ADMIN-077` 的咨询称谓与岗位角色只随本次原型发布，不在这两张工程 Issue 范围内，不创建第三张 Issue。

## 2. Source Contract

- 唯一行为真源：[SPEC-SUIYIN-ADMIN-076@1.0.1](https://github.com/xfang9528-glitch/suiyin-admin/blob/master/docs/sdd/SPEC-SUIYIN-ADMIN-076/1.0.1/spec.md)。
- [Test Contract](https://github.com/xfang9528-glitch/suiyin-admin/blob/master/docs/sdd/SPEC-SUIYIN-ADMIN-076/1.0.1/test-contract.md)。
- Constitution：`prototype-sdd@1.4.1`。
- [本次截图授权范围](https://github.com/xfang9528-glitch/suiyin-admin/blob/master/docs/verification/admin-iteration-20260930/requested-engineering-scope.png)。截图第3项对应 I001，第4项对应 I002。
- 原型与生产边界：SPEC中的浏览器本地保存约束静态原型。正式 Admin 落地必须核实并复用生产现有保存、鉴权和租户模型，以真实服务回执判定成功；原型 localStorage 不能作为生产持久化。API或后端缺口单独列依赖，不能扩大本工作区权限。
- 仅在正式生产工作区按 Issue → worktree → Phase 1/2/3 → PR → 房总review 实现；本交接不授权跨仓直推或生产配置修改。

## 3. Issue Slices

| Slice ID | Issue Title | Target Repo | Tenant | Platform | Reporter | Rules | Acceptance | Test IDs | User Problem | User Outcome | Issue Ref | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| I001 | feat(admin): 移除全部艺星及画美、傲丽的上下班时间配置入口（艺星、画美、傲丽管理页不再出现上下班时间设置） | PetWebOrg/suiyin-admin | 佰智德三 | PC | 房昕 | R004 | AC-R004-01、AC-R004-02 | T-R004-01、T-R004-02 | 指定租户仍显示已不需要的时间选项 | 账号页和系统设置均不再出现上下班时间配置，记录和转交功能保持 | https://github.com/PetWebOrg/suiyin-admin/issues/448 | created |
| I002 | feat(admin): 菜单状态支持行内显示隐藏胶囊与失败回滚（在菜单表中直接选择显示或隐藏，保存失败会恢复原状态） | PetWebOrg/suiyin-admin | 佰智德三 | PC | 房昕 | R005、R006、R007、R008 | AC-R005-01、AC-R005-02、AC-R006-01、AC-R006-02、AC-R007-01、AC-R008-01 | T-R005-01、T-R005-02、T-R005-03、T-R006-01、T-R006-02、T-R007-01、T-R008-01、T-R008-02 | 修改菜单显示状态需逐行进入编辑弹窗，失败结果不便核对 | 普通及平台菜单在表格直接切换可见性，导航按原范围更新，失败回原值 | https://github.com/PetWebOrg/suiyin-admin/issues/449 | created |
| I003 | docs(prototype): 记录新增租户与账号入口原型交付范围（可切换画美和傲丽环境，并通过碎银账号入口评审账号页） | xfang9528-glitch/suiyin-admin | 佰智德三 | PC | 房昕 | R001、R002、R003 | AC-R001-01、AC-R002-01、AC-R003-01 | T-R001-01、T-R002-01、T-R003-01 | 原型缺少新租户入口，账号页默认称谓需统一 | 原型已提供独立环境和碎银账号名称，未采业务资料如实提示 | — | planned |

I003 是 `prototype-delivered` 范围记录；表中 `planned` 仅为追踪合同状态，不代表待创建第三张 Issue，也不是生产交付承诺。R001–R003的静态验证证据见原型 verification.md；不把这些原型结果替代 I001/I002 的生产验证。

## 4. Issue Drafts

### I001 — 指定租户上下班时间入口移除

#### 用户问题

全部艺星、画美和傲丽的管理员在账号页及系统设置中仍看到不再需要的上下班时间选项，容易误以为还需维护这些配置。

#### 完成后用户能感受到的变化

这些租户的账号页顶部、系统设置及相关弹窗不再出现上下班时间设置；上班记录、在线状态和“离开状态可转交”继续照常使用。

#### Source Contract

- Rules：R004；Acceptance：AC-R004-01、AC-R004-02；Tests：T-R004-01、T-R004-02。
- 独立建单正文：[issue-body-time.md](./issue-body-time.md)。

#### In Scope

- 覆盖全部正式艺星租户及 `huamei-xian`、`aoli-xian`。原型六个艺星是验收样例，生产按正式租户归属核对，不写死六店名单，不凭中文名称片段判定。
- 同时移除账号页顶部自动下班时间、系统设置同义配置行和全部可达新增/编辑入口。旧缓存或旧配置不得重新补出默认04:00/旧时间，隐藏字段不参与新的校验或提交。
- 其他租户的时间设置保留；上班记录、在线/工作状态和“离开状态可转交”不变。
- 只移除配置入口，不额外删除历史记录或配置，不推断为停用已有后台调度；如生产执行逻辑也需改变，应回源确认范围。

#### Out of Scope

- 新增生产租户、账号名称及咨询岗位角色改造、菜单状态胶囊、修改排班或转交业务。
- 未经授权的跨仓实现或数据迁移。

#### 验收与测试

- 全部适用租户及非适用对照租户参数化验收，覆盖两处入口、可达表单、旧配置回填及原功能回归。
- 生产CI/人工证据尚未生成，保持 planned，PR保留 R/AC/Test ID。

#### Metadata

- 租户：佰智德三；平台：PC；代码仓：PetWebOrg/suiyin-admin；提出人：房昕；负责人：王争（@kitesky）。

### I002 — 菜单状态行内胶囊

#### 用户问题

管理员只想调整菜单显示或隐藏，也要先进入编辑弹窗；逐项设置费步骤，保存失败时需要明确知道状态是否生效。

#### 完成后用户能感受到的变化

普通菜单和平台菜单可在表格直接点“显示 / 隐藏”，保存成功后导航立即按原作用范围更新；失败时恢复原值并可重试。

#### Source Contract

- Rules：R005、R006、R007、R008；Acceptance：AC-R005-01、AC-R005-02、AC-R006-01、AC-R006-02、AC-R007-01、AC-R008-01。
- Tests：T-R005-01、T-R005-02、T-R005-03、T-R006-01、T-R006-02、T-R007-01、T-R008-01、T-R008-02。
- 独立建单正文：[issue-body-menu.md](./issue-body-menu.md)。

#### In Scope

- 普通 menu 和佰智德三 allMenu 共用“显示 / 隐藏”双段胶囊。点不同值立即提交，提交中阻止重复操作；点已选值无操作，不增加记录或成功提示。
- 选项始终有文字、选中态与键盘焦点；点击不触发拖动或树展开。编辑弹窗读取同一状态，取消不保存。
- 普通配置只影响本租户，平台配置沿用原平台范围；父节点隐藏整支导航，恢复父节点不解除子项独立隐藏；平台限制不能被租户设置绕过。隐藏行仍在表中可恢复。
- 保存后导航、当前隐藏页回退、刷新及已有跨窗口同步沿用现有规则，不重置身份、排序、父级、权限和明确的自定义值。
- 失败恢复原值及相关记录，不传播成功导航；提示“未能保存，菜单状态已恢复，请重试”。读取外部更新后操作，不用旧整树覆盖新配置。
- 保留普通六列、平台九列表格、冻结表头、树/拖动/滚动；在1280px和1480px视口核对控件可读性。

#### Out of Scope

- 新权限、新角色、扩大菜单作用范围、上下班设置删除、新增批量修改或新确认流程。
- 将原型本地保存当作生产已生效；未经正式流程扩展后端API或部署。

#### 验收与测试

- 自动化验证值切换、重复无操作、编辑取消、权限/父子/平台限制、失败回滚、跨窗口/刷新和外部更新。
- 视觉检查的人工理由、Oracle及证据位置见 Test Contract；不能只用脚本结果宣称胶囊布局已通过。
- 生产实现须核对现有保存接口的原子性及并发更新处理；有缺口时先列依赖，不悄悄改变业务规则。

#### Metadata

- 租户：佰智德三；平台：PC；代码仓：PetWebOrg/suiyin-admin；提出人：房昕；负责人：王争（@kitesky）。

### I003 — 原型覆盖记录，不创建工程 Issue

- R001–R003覆盖两个独立租户、待采集说明及“碎银账号”默认名称。
- 仅为完整追踪保留，静态原型已实现。本次用户未授权把这些内容或077咨询岗位角色纳入工程建单。
- 用户问题、结果和元信息见切片表；测试 T-R001-01、T-R002-01、T-R003-01留作原型合同，不交给王争额外实现。

## 5. Handoff Gate

- [x] 源 SPEC 状态为 implemented，锁定 `SPEC-SUIYIN-ADMIN-076@1.0.1`。
- [x] 所有8条MUST规则和11条AC分配到切片，只有I001/I002获工程建单授权。
- [x] 每个切片具有用户问题、结果、有效metadata及对应Test ID。
- [x] 已运行 `validate-traceability.mjs`，8条MUST / 11条AC / 3个切片 / 13个Test ID，0 error、0 warning。
- [x] 生产证据保持 planned，不标记 verified/released。
- [x] 房总明确授权给王争建立截图两个功能Issue；创建流程由主代理按github-issue执行。
- [x] 已创建并回读I001 #448 / I002 #449，元信息、标签、指派和正文SDD回链均通过校验；远端SDD可访问性随发布验证。

## 6. Change Control

- SPEC版本或行为变化后本合同自动stale，先更新合同并重新校验。
- 工程Issue不得成为第二份需求真源；新规则回SPEC审核。
- 原型发布与生产实现分开报告；生产CI、PR、实际租户验收尚待正式工作流完成。
