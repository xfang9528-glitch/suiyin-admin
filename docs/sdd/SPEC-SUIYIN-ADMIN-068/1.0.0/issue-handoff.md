---
handoff_id: HANDOFF-SUIYIN-ADMIN-068
spec_id: SPEC-SUIYIN-ADMIN-068
spec_version: 1.0.0
status: issued
prepared_by: "Codex"
prepared_at: 2026-09-26
actual_issue_creation: true
---

# 各租户菜单拖动排序与导航联动 — Issue Handoff

## 1. 交接摘要

- **源规格**：`SPEC-SUIYIN-ADMIN-068@1.0.0`，源状态 `implemented`；这里表示静态原型已实现。
- **用户问题**：各租户管理者在「系统管理 → 菜单管理」整理常用入口时，仍需逐项编辑排序数字；菜单表调整后，左侧导航也可能被平台顺序覆盖，无法按本租户习惯整理。
- **完成后变化**：各租户可直接拖动一级整组、二级组内及跨组菜单，左侧导航同步更新；本租户调整后的顺序保留，撤销、刷新和重新进入保持一致。
- **目标仓范围**：`PetWebOrg/suiyin-admin` 的正式网页管理端；单一执行切片 `I001`。
- **环境与实施范围**：Issue metadata 环境/租户为 **佰智德三**，平台为 **PC**，在本单明确指网页管理端；功能适用**全部系统租户**。原型登记的 15 个租户是已验证样本，不是生产租户白名单或实施上限。
- **提出人和安排对象**：均为 **房昕**；GitHub assignee 为 `xfang9528-glitch`，建单主流程已用团队表及目标仓 assignees endpoint `204` 唯一核实。
- **当前交付状态**：[PetWebOrg/suiyin-admin#432](https://github.com/PetWebOrg/suiyin-admin/issues/432) 已创建并分配给 `xfang9528-glitch`，2026-09-26 经 GH CLI 复读确认标题、负责人和 `OPEN` 状态。本 Handoff 为 `issued`，`actual_issue_creation: true`，I001 为校验器定义的 `created`；生产功能和生产测试仍待正式实施。

## 2. Source Contract

- 唯一行为真源：[SPEC-SUIYIN-ADMIN-068@1.0.0](https://github.com/xfang9528-glitch/suiyin-admin/blob/v2026092601-admin-tenant-menu-drag/docs/sdd/SPEC-SUIYIN-ADMIN-068/1.0.0/spec.md)。Issue 只承接执行，不能形成另一份业务规则。
- 测试合同：[TEST-CONTRACT-SUIYIN-ADMIN-068](https://github.com/xfang9528-glitch/suiyin-admin/blob/v2026092601-admin-tenant-menu-drag/docs/sdd/SPEC-SUIYIN-ADMIN-068/1.0.0/test-contract.md)。原型证据另见 [verification.md](https://github.com/xfang9528-glitch/suiyin-admin/blob/v2026092601-admin-tenant-menu-drag/docs/sdd/SPEC-SUIYIN-ADMIN-068/1.0.0/verification.md)，不替代生产测试。
- Constitution：`prototype-sdd@1.4.1`。
- 精确依赖沿用源 SPEC：`SPEC-SUIYIN-ADMIN-060@1.1.0`、`SPEC-SUIYIN-ADMIN-051@1.1.0`、`SPEC-SUIYIN-ADMIN-055@1.1.0`。
- 本文件与同版 SPEC、Plan、Tasks、Test Contract 一同进入原型 tag `v2026092601-admin-tenant-menu-drag` 的版本目录 `docs/sdd/SPEC-SUIYIN-ADMIN-068/1.0.0/`。#432 正文已回链该 tag 下的 SPEC、Handoff、Test Contract；完整推送主流程负责在远端发布后复核可访问性，不以本机路径或未发布地址作为交付完成证据。
- 源 SPEC 中的浏览器本地存储、静态 QA 和本地原型文案是演示运行边界，不是对生产存储技术的选型。正式实现由对应仓 Phase 1 核对既有持久化、权限和通知方式，在不改变 R/AC 的前提下确定适配方案；如必须新增业务规则或跨仓依赖，先回源 SPEC 审核。

### 已关闭工程基线与本单差异

[PetWebOrg/suiyin-admin#408](https://github.com/PetWebOrg/suiyin-admin/issues/408) 已关闭，只作为既有平台菜单前端拖动实现参考，不是本单待完成依赖。建单主流程复核到其 2026-09-26 最终授权范围已收窄：使用旧 `sort` / `pid` 接口、保留数字与父级输入，失败按顺序写入及回读处理，不承诺原子回滚，也不包含撤销或全租户实时联动。生产 #408 自身最终说明已替代其早期扩大的 060 工程范围，不能宣称上述能力已由 #408 完成。

本次房总又明确要求各租户菜单与导航联动，并批准 068 规则。I001 须按 068 设计达到验收所需的持久化、并发、失败恢复和撤销能力；不能照搬 #408 的收窄范围，也不能把原型 `localStorage` 当生产架构。若现有接口不能满足，Phase 1 必须先提交可审核的工程方案或明确阻塞及证据，不得静默删减验收或用假成功/假回滚交付。不得自动重新创建已删除的 #4072 后端任务；是否需要后端支持及如何拆分须在正式方案与授权中处理。

## 3. Issue Slices

| Slice ID | Issue Title | Target Repo | Tenant | Platform | Reporter | Rules | Acceptance | Test IDs | User Problem | User Outcome | Issue Ref | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| I001 | feat(menu): 为各租户菜单管理增加拖动排序与导航联动（管理者可以拖动整理本租户菜单，左侧导航同步更新并保留） | PetWebOrg/suiyin-admin | 佰智德三 | PC | 房昕 | R001、R002、R003、R004、R005、R006、R007、R008、R009 | AC-R001-01、AC-R002-01、AC-R003-01、AC-R004-01、AC-R005-01、AC-R005-02、AC-R006-01、AC-R006-02、AC-R006-03、AC-R007-01、AC-R008-01、AC-R009-01 | T-R001-01、T-R002-01、T-R002-02、T-R003-01、T-R004-01、T-R005-01、T-R005-02、T-R006-01、T-R006-02、T-R006-03、T-R007-01、T-R008-01、T-R009-01、T-R009-02 | 租户管理员只能逐项改数字整理菜单，且左侧导航可能不跟随自己的调整 | 可以直接拖动菜单顺序和分组，左侧导航同步更新并保留本租户调整 | https://github.com/PetWebOrg/suiyin-admin/issues/432 | created |

I001 的 `created` 表示真实 Issue 已创建并分配，不表示已开始生产实现或完成发布。Handoff 使用 `issued`；Slice 按校验器合法状态使用 `created`，不使用未定义的 `issued`。

## 4. Issued Issue Contract

### I001 — feat(menu): 为各租户菜单管理增加拖动排序与导航联动（管理者可以拖动整理本租户菜单，左侧导航同步更新并保留）

#### 用户问题

各租户管理者在「系统管理 → 菜单管理」整理常用入口时，平台菜单已有拖动交互，普通租户菜单仍需逐项填写排序数字。即使调整了菜单表，左侧导航仍可能按平台配置显示，用户不能确认调整是否生效，也难以保持本租户常用菜单的顺序。

#### 完成后用户能感受到的变化

各租户可以像平台菜单一样，直接拖动一级菜单整组、调整二级菜单顺序，或把二级菜单移到其他一级菜单下。左侧菜单随之更新；已调整的本租户顺序不会被平台后续排序覆盖，其他未调整部分继续跟随平台。撤销、刷新或重新进入后仍保持同一结果。

#### Source Contract

- SPEC：`SPEC-SUIYIN-ADMIN-068@1.0.0`，以本包 [spec.md](./spec.md) 的原文为验收依据。
- Rules：`R001、R002、R003、R004、R005、R006、R007、R008、R009`。
- Acceptance：`AC-R001-01、AC-R002-01、AC-R003-01、AC-R004-01、AC-R005-01、AC-R005-02、AC-R006-01、AC-R006-02、AC-R006-03、AC-R007-01、AC-R008-01、AC-R009-01`。
- Tests：本文件 §3 所列 14 个 Test IDs，判定标准见 [test-contract.md](./test-contract.md)。
- 真实 Issue：[PetWebOrg/suiyin-admin#432](https://github.com/PetWebOrg/suiyin-admin/issues/432)。远端 SPEC、Handoff、Test Contract 入口锁定 §2 所列 tag 与版本路径，发布可访问性由完整推送主流程复核。

#### In Scope

- 在**全部系统租户**的普通菜单管理复用平台拖动体验：一级整组、二级组内和跨一级移动；普通菜单保留六列和既有字段权限，顺序只读，不保留独立数字排序入口（R001、R002）。
- 菜单表和本租户左侧导航从同一有效结构派生；成功保存、撤销及同租户其他已开窗口及时联动，仍可见页面、页签和输入不被无故重建（R003）。
- 按租户及稳定菜单身份处理，保持本租户库存、名称、显示和超级权限；不改平台定义、其他租户及页面权限。异常重复身份/路由保留原数据并拒绝存在歧义的拖动（R004）。
- 成功移动、撤销、记录和覆盖信息一致保存；失败保持上次成功状态并可重试；刷新或后续数据变更清除旧撤销，折叠、滚动、打开后取消编辑不清除（R005）。
- 租户明确调整过的同级组保留顺序，跨组仅覆盖被移动项的父级及源/目标组顺序；未覆盖部分继续跟随平台。新增有效成员按平台有效顺序追加；失效目标覆盖保留但暂不应用、提示并回退有效默认，目标恢复后再次应用（R006）。
- 平台当前祖先链隐藏、删除和既有权限独立生效，租户移动及异常配置不能绕过；旧配置接续不把旧数字误认作新拖动意图，外部修改取消未提交动作并清旧撤销（R006、R007）。
- 保留非法落点、取消、原位、历史深层、空一级与携页一级边界；复用落点文字、拖影、悬停展开、边缘滚动、键盘、桌面触控及冻结表头（R008、R009）。

#### Out of Scope

- 平台批量同步、复制、增量更新、批量删减的规则改造；任意层级编辑、跨租户拖动和新增页面权限。
- APP、Flutter PC 聊天端或其他生产仓实施；本单 PC 标签仅指网页管理端。
- 新增跨设备同步承诺、恢复平台默认按钮或未经审核的业务规则。
- 将浏览器演示通过直接标为生产通过，或从原型工作区修改生产代码、测试和 CI。

#### 验收与测试

- 全部 9 条 MUST 规则、12 个 AC 均为本单验收范围，不能只交付拖动外观或只让表格变化。
- 生产覆盖应根据实际系统租户/Profile 注册源参数化；原型的 15 租户可作为样本参考，不得用固定名单限制产品能力。
- 按 Test Contract 运行 12 项机器判定测试和 2 项有证据的人工体验检查。生产测试路径是准备值，由正式仓 Phase 1 确认；调整路径或框架不改变 Test ID 和 Oracle。
- PR/CI 报告必须保留 Test ID 或 AC-ID。所有生产 Evidence 当前为 `planned`；原型 `verification.md` 仅作为设计和复现参考。
- 本单以实际用户结果验收；正式发布前不得宣称客户环境已上线。

#### Metadata

- 租户/环境：佰智德三。
- 平台：PC（网页管理端）。
- 代码仓：PetWebOrg/suiyin-admin。
- 提出人：房昕。
- 指定负责人：房昕；GitHub assignee：`xfang9528-glitch`，#432 远端复读已确认真实分配。
- 功能范围：全部系统租户；15 个租户仅为当前原型验证样本。

#### 正式实施边界

#432 由建单主流程按 `github-issue` Skill 创建并复读。领取后在 `PetWebOrg/suiyin-admin` 对应正式工作区使用独立 worktree，完成 **Phase 1 → Phase 2 → Phase 3 → PR → 房总 review**。本交付包不授权本原型 session 跨生产仓写代码，也不允许直推生产 `main`。

## 5. Handoff Gate

- [x] 源 SPEC 为 `implemented`，且 `spec_id` / `spec_version` 精确匹配。
- [x] 所有 9 条 MUST 规则和 12 个 AC 分配到 I001。
- [x] 用户问题、用户变化、租户、平台、代码仓和提出人明确。
- [x] I001 所引用的 14 个 Test ID 均存在于 Test Contract。
- [x] 房总已明确授权创建管理端实现 Issue；#432 已由建单主流程创建，本合同维护只做文件更新与 GitHub 只读核对。
- [x] `validate-traceability.mjs` 已于 2026-09-26 运行通过：9 MUST、12 AC、1 Slice、14 Test IDs，0 error、0 warning，阶段为 preparation。
- [x] 房昕 GitHub 登录已唯一核实为 `xfang9528-glitch`。
- [ ] 完整推送后复核远端 tag 中的合同直链可访问；由交付主流程确认。
- [x] #432 已创建并复读确认，Issue Ref 与 `actual_issue_creation: true` 已更新。
- [ ] 生产实现和测试通过后才可进入 `verified`；实际发布后才可标记 Slice `released`。

## 6. Change Control

- SPEC 版本或 R/AC 行为变化后，本 Handoff 与 Test Contract 自动视为 stale，更新并重跑追踪校验。
- 发现新的业务规则，先回源 SPEC 审核，不在 Issue 评论、测试或代码中自行定案。
- 只有真实建单收据才更新创建状态；只有生产 CI/人工证据才能替换生产 `planned`。本地原型结果不冒充生产完成。
- 本文件随 068 同版本合同包发布。后续 Issue Ref 与证据阶段更新须留下交付记录，已发布的历史快照不覆盖改写。
