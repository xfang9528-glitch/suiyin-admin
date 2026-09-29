---
handoff_id: HANDOFF-SUIYIN-ADMIN-073
spec_id: SPEC-SUIYIN-ADMIN-073
spec_version: 1.0.0
status: issued
prepared_by: "Codex"
prepared_at: 2026-09-29
actual_issue_creation: true
---

# 工具管理与辅助线管理 — Issue Handoff

## 1. 交接摘要

- 源规格：[SPEC-SUIYIN-ADMIN-073@1.0.0](https://github.com/xfang9528-glitch/suiyin-admin/blob/v2026092902-admin-tools-guide-lines/docs/sdd/SPEC-SUIYIN-ADMIN-073/1.0.0/spec.md)。
- 用户问题：艺星客户需要调整咨询时使用的默认和门店专属医美辅助线，却不能在后台自行上传、替换或移除，只能等待工程师处理；原话术入口也需要迁到统一工具目录。
- 完成后变化：所有租户从工具管理进入原话术页；艺星客户可在后台维护本租户辅助线分类、图片、顺序和启停，并保存、预览自己的配置。
- 本次已创建[Admin Issue #442](https://github.com/PetWebOrg/suiyin-admin/issues/442)，负责人王梓先（build996），状态status:todo。生产测试保持planned，原型通过不等于生产验收通过。

## 2. Source Contract

唯一行为真源为上述精确版本SPEC；Constitution为prototype-sdd@1.4.1。远端固定tag：v2026092902-admin-tools-guide-lines。SPEC-ID@version → R-ID → AC-ID → I001 → Test ID → 生产CI/人工证据。

## 3. Issue Slices

| Slice ID | Issue Title | Target Repo | Tenant | Platform | Reporter | Rules | Acceptance | Test IDs | User Problem | User Outcome | Issue Ref | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| I001 | feat(tools): 实现工具管理导航与艺星辅助线自助维护（艺星客户可以自行上传、替换和删除本租户的医美辅助线） | PetWebOrg/suiyin-admin | 佰智德三 | PC | 房昕 | R001、R002、R003、R004、R005、R006、R007、R008、R009、R010、R011 | AC-R001-01、AC-R002-01、AC-R003-01、AC-R004-01、AC-R005-01、AC-R006-01、AC-R007-01、AC-R008-01、AC-R009-01、AC-R010-01、AC-R011-01 | T-R001-01、T-R002-01、T-R003-01、T-R003-02、T-R004-01、T-R004-02、T-R005-01、T-R006-01、T-R006-02、T-R007-01、T-R007-02、T-R008-01、T-R008-02、T-R009-01、T-R010-01、T-R010-02、T-R011-01 | 艺星客户需要调整咨询时使用的默认和门店专属医美辅助线，却不能在后台自行上传、替换或移除，只能等待工程师处理；原话术入口也需要迁到统一工具目录。 | 所有租户从工具管理进入原话术页；艺星客户可在后台维护本租户辅助线分类、图片、顺序和启停，并保存、预览自己的配置。 | https://github.com/PetWebOrg/suiyin-admin/issues/442 | created |

## 4. 工程实施边界与开工核实

本次只创建 PetWebOrg/suiyin-admin 的 I001，负责人王梓先（@build996），提出环境为佰智德三、提出人房昕。提出环境是需求来源，不是把辅助线开放给佰智德三：业务范围仍为所有艺星租户；工具/话术适用于所有租户。

- 本单实现 Admin 导航、编辑、上传交互、真实服务读写对接及管理页内PC效果预览；不得把原型localStorage保存当作生产持久化。原型的静态边界R011继续约束原型证据，生产反馈以真实服务回执为准。
- 开工先核实后端接口、鉴权、素材存储、配置版本和失败原子性；接口缺口或迁移工作列明依赖并走相应仓的正式流程，不授权在Admin任务跨仓直推。
- 初始化必须按各租户当前真实可见清单逐项对账，保留默认和专属内容；16类/129条/123文件是现有本地演示样本，不能用来覆盖各店生产数据。已配置为空不是未初始化。
- 服务端以登录身份和权限判定租户，不能信任客户端tenant字段；共享素材采用条目独立引用，不可因替换或删除一个引用影响其他分类/租户。
- 多管理者并发更新的版本/冲突处理由Phase 1明确并测试，禁止无提示覆盖他人的已保存配置。PNG生产限制、失败取证信息与资源生命周期需核实，10MiB仅为原型演示上限。
- 当前初始图最长边480、上传演示副本最长边960，仅用于浏览器预览。生产存储应核实并保留原始PNG、透明度和尺寸，缩略图另作展示，不能把原型轻量副本当生产原始素材迁移。
- PC真实消费端、配置刷新时效及存量迁移为跨端依赖。关联故事[flutter-suiyin#7584](https://github.com/PetWebOrg/flutter-suiyin/issues/7584)只作背景，不新增PC单、不变更其负责人/状态。本Admin单验收不等于PC已更新；要宣告客户PC可用，须补真实租户联调和客户端生效证据。
- 执行正式 Issue → worktree → Phase 1/2/3 → PR → 房总review；本交付不授予生产主分支直推权限。若真实约束改变已批准业务规则，先回SPEC审核。

## 5. Handoff Gate

- [x] 源SPEC为implemented，版本锁定1.0.0。
- [x] 所有11条MUST及11个AC均分配I001。
- [x] 来源环境、平台、提出人和负责人已明确。
- [x] 17个测试ID已对应测试合同。
- [x] 用户明确授权完整推送及建单；创建前后使用github-issue门禁。
- 生产实现/测试尚未开始，不标记verified或released。

## 6. Change Control

SPEC版本变化会使本合同过期；生产实现和测试只在对应正式工作区执行。所有需求变化先回源SPEC，Issue不另立行为版本。
