---
handoff_id: HANDOFF-SUIYIN-ADMIN-060
spec_id: SPEC-SUIYIN-ADMIN-060
spec_version: 1.1.0
status: issued
prepared_by: Codex
prepared_at: 2026-09-21
actual_issue_creation: true
---

# 平台菜单拖动与全租户联动 — 工程交接

## 1. 交接摘要

菜单多时逐条改排序号难以维护，调整后的结构和隐藏也必须在各租户侧栏及刷新后保持一致。完成后可直接拖一级整组和二级跨组，立即看到全租户导航变化。

用户明确授权完整推送并建 Issue 给梁晨（vvphp）；提出环境佰智德三、提出人房昕、平台 PC 管理页。生产实现当前未开始，原型结果不代替生产验收。

## 2. Source Contract

唯一行为真源：[SPEC-SUIYIN-ADMIN-060@1.1.0](https://github.com/xfang9528-glitch/suiyin-admin/blob/v2026092103-admin-menu-drag-global/docs/sdd/SPEC-SUIYIN-ADMIN-060/1.1.0/spec.md)，[测试合同](https://github.com/xfang9528-glitch/suiyin-admin/blob/v2026092103-admin-menu-drag-global/docs/sdd/SPEC-SUIYIN-ADMIN-060/1.1.0/test-contract.md)；Constitution prototype-sdd@1.4.1。实施范围为生产全部适用租户，原型的 15 租户仅为验证集合。

## 3. Issue Slices

| Slice ID | Issue Title | Target Repo | Tenant | Platform | Reporter | Rules | Acceptance | Test IDs | User Problem | User Outcome | Issue Ref | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| I001 | feat(menu): 实现平台菜单拖动排序与全租户导航联动（可以直接拖动菜单调整各租户导航，隐藏和排序在刷新后保留） | PetWebOrg/suiyin-admin | 佰智德三 | PC | 房昕 | R001、R002、R003、R004、R005、R006、R007、R008、R009 | AC-R001-01、AC-R002-01、AC-R003-01、AC-R004-01、AC-R005-01、AC-R006-01、AC-R006-02、AC-R007-01、AC-R008-01、AC-R009-01、AC-R009-02 | T-R001-01、T-R002-01、T-R003-01、T-R004-01、T-R005-01、T-R006-01、T-R006-02、T-R007-01、T-R008-01、T-R009-01、T-R009-02、T-R005-02 | 菜单多时逐条修改排序号难操作，导航与修改结果不一致 | 拖动菜单即可整理各租户导航，显示与位置刷新后保持 | https://github.com/PetWebOrg/suiyin-admin/issues/408 | created |

## 4. 工程切片与边界

- 只读定位到生产 src/views/platform/menu.vue、src/api/platform/menu/index.ts/types.ts；现有 MenuForm 包含 id、pid、sort、status，现有接口包括 POST /v1/menu/list、PUT /v1/menu/:id 与独立 sync/add/remove。尚未证明这些接口提供整组重排原子提交、全租户刷新或并发保护，不能凭接口名声称已具备。
- 梁晨在正式 Issue → worktree → Phase → PR → 房总 review 内实现前端交互并核对服务端契约；如需后端切片在正式工程流程关联，不在原型工作区跨仓写代码。
- 生产使用真实稳定菜单 ID 与服务端持久化。一次移动要一致保存父级、同层顺序和操作记录，失败回滚；并发或旧版本不得静默覆盖新树。刷新/重新登录读取成功保存值，撤销按同一提交规则处理。原型的 localStorage、QA 数据和模拟成功提示不能代替正式保存。
- 平台排序、归属、隐藏作用于全部适用租户；保留各租户已授权库存、独立隐藏和业务数据，不能按同名文本合并或因平台显示而开通新页面。前端隐藏不等于服务端授权。
- 已打开侧栏及时刷新，仍可见的页面保留状态。未加载、空态、只读、取消、非法层级、旧三级、保存失败、撤销、长表、键盘/触控全部按 AC 验证。
- 不重构同步/复制/增量按钮，不增加批量拖动、任意层级树编辑或新角色规则。

## 5. Handoff Gate

- [x] 规格已批准并实现，全部 MUST/AC 已分配。
- [x] 环境、平台、提出人和负责人已由当前任务及指令明确。
- [x] Test IDs 完整，生产证据保持 planned。
- [x] 已有真实建单授权；创建前后运行 DR-072 机器门禁。

## 6. Change Control

SPEC 升版使交付与测试合同 stale；需求变化回源审核。生产 PR/CI 保留 Test ID 或 AC-ID 和截图，不能以本地原型测试标记生产 released。
