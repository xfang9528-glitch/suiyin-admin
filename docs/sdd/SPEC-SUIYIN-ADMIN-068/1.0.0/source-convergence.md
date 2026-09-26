---
ledger_id: CONVERGENCE-SUIYIN-ADMIN-068
spec_id: SPEC-SUIYIN-ADMIN-068
spec_version: 1.0.0
status: verified
prepared_by: Codex
prepared_at: 2026-09-26
---

# 各租户菜单拖动 — Source Convergence Ledger

## 1. 收敛摘要

- **源规格**：`SPEC-SUIYIN-ADMIN-068@1.0.0`，用户已批准推荐优先级，当前状态为implemented。
- **触发**：房总明确要求“完整推送”，并授权为房昕建立工程Issue，提出环境佰智德三、提出人房昕。
- **目标**：普通menu复用拖动并联动本租户导航；平台提供默认结构，租户明确调整过的同级列表及被跨组移动项父级优先，平台隐藏/删除及既有权限独立生效。
- **边界**：本账本只收敛当前文档与原型来源，不改既有051/060不可变版本包；不把旧平台工程Issue #408或本地29项浏览器验收当作068生产已完成证据。远端发布和新工程Issue状态分别由交付回执、Handoff与Test Contract登记。

## 2. Source Ledger

原型仓路径以 `suiyin-admin/` 为根；本地工作规格以 `prototype-sdd/specs/` 为根。

| Source ID | Old Source | Conflict / Superseded Rule | Resolution | Evidence | Remaining |
|---|---|---|---|---|---|
| S001 | docs/sdd/SPEC-SUIYIN-ADMIN-060/1.1.0/spec.md §3；本地060规格 | §4.1-1：060明确排除普通menu，当前需求要求全部租户支持 | intentional-history | 060版本字节保留；README合同表、prd/platform-menu-drag.md和flowcharts/platform-menu-drag.md在当前入口声明普通menu范围由068替代；新租户PRD/流程指向068 | none |
| S002 | docs/sdd/SPEC-SUIYIN-ADMIN-060/1.1.0/spec.md R009；docs/design-spec.md Shell与菜单；CLAUDE.md 当前约定2 | §4.1-2：平台顺序与归属无条件覆盖租户，抵消租户拖动 | updated | 设计规范与CLAUDE原段改为平台默认结构、租户局部覆盖优先及独立隐藏/删除约束；060快照单独按S001保留历史 | none |
| S003 | prd/platform-menu-drag.md、flowcharts/platform-menu-drag.md；prd/admin-live-reference.md 范围/菜单行/DR-095；flowcharts/admin-live-reference.md 入口与菜单流程 | §4.1-2：全部租户按统一结构更新，流程缺少租户覆盖分支 | updated | 原描述和图节点已改为已调整同级顺序与移动项父级优先，其余跟平台；导航最终检查当前平台祖先链隐藏/删除和租户权限 | none |
| S004 | docs/design-spec.md 普通六列与窄排序框；flowcharts/admin-live-reference.md 普通menu编辑显示和排序；prd/admin-live-reference.md 仅平台拖动 | §4.1-3：普通菜单仍通过数字排序，拖动只给平台 | updated | 原段改成普通六列只读同层1…N、编辑提示由列表拖动调整、一级整组/二级组内及跨组；新增prd/tenant-menu-drag.md和flowcharts/tenant-menu-drag.md说明已批准行为 | none |
| S005 | docs/sdd/SPEC-SUIYIN-ADMIN-051/1.1.0/spec.md；docs/verification/admin-live-reference.md 历史菜单排序框记录；docs/history及旧模块目录跳转 | §4.1-3：历史采集和旧批准快照保留手工排序语义 | intentional-history | README声明051基线在068普通菜单范围被替代；历史验收明确当时/历史，旧模块文件明确指向现行PRD/流程，未被用于本次操作指令 | none |
| S006 | prototype/admin-menu-state.js、admin-navigation.js、admin-menu-tree.js、admin-content.js旧分离计算路径 | §4.1-4：表格、导航override和平台投影分别计算，可能分叉 | updated | verification.md记录AdminTenantMenu共享完整树、单键移动状态、跨窗刷新、平台祖先限制；checks/state-check.cjs及29/29 Chrome检查含失败/撤销/隐藏/失效父级/异常库存；原平台project回归保持 | none |
| S007 | README.md 合同入口/本地预览范围；CLAUDE.md 060当前约定 | §4.1-5：读者只进入旧包或本地SPEC，难以定位本次限定替代 | updated | README加入068、租户PRD/流程及当前优先级；CLAUDE原位置声明060保留范围；版本化目标固定docs/sdd/SPEC-SUIYIN-ADMIN-068/1.0.0，由发布步骤验证远端内容 | none |
| S008 | docs/design-spec.md及prd/admin-live-reference.md引用DR-095的登记与联动段落 | 可能误把默认父级一致理解为租户不能跨组，或把同租户联动扩大为全租户写入 | updated | 当前设计规范与主PRD的DR-095段原位限定为稳定身份、名称、路由和默认父级；本次拖动只改变本租户归属和顺序，原DR的新增库存与同租户联动要求保持，未改写决策原文 | none |

## 3. Search Proof

原始命令和输出见同包 `source-search.txt`；搜索时间2026-09-26，覆盖9个现行入口文件及指定历史来源。

| Search ID | Pattern / Old Term | Scope | Command / Method | Result | Evidence |
|---|---|---|---|---|---|
| Q001 | 窄排序框；编辑显示和排序；平台增加一级整组拖动；所有租户侧栏按统一结构即时更新；统一侧栏顺序、父级；平台allMenu的统一顺序 | README/CLAUDE/设计规范/通用及专用PRD/流程共9文件 | rg -n 多个-e逐项精确搜索 | exit=1，旧有效措辞0命中；0 active conflicts | source-search.txt Q001 |
| Q002 | 068；明确调整；同一有效；暂禁；平台当前祖先 | 同9个当前入口文件 | rg -n 多个-e核对替代规则落点并人工阅读上下文 | 当前入口均可定位068和局部覆盖；异常/隐藏/父级边界已记录 | source-search.txt Q002；新租户PRD/流程 |
| Q003 | 普通menu；普通菜单；平台顺序 | 已交付051和060版本化spec.md | rg -n定向查找并对照README合同表 | 剩余旧规则仅位于不可变历史快照；当前入口已明确限定替代 | source-search.txt Q003；README合同表 |
| Q004 | 排序框；旧原型；历史 | 旧验收记录及v1.1模块/流程重定向 | rg -n定向分类 | 仅带日期历史验收或明确旧原型入口，不是现行交互指令 | source-search.txt Q004 |
| Q005 | 共享有效树、平台隐藏、局部覆盖、旧设置、异常身份 | 状态检查与本轮verification.md | 核对已通过state-check、29项Chrome及旧平台18/9项回归证据 | 当前实现与新规则一致，历史测试的普通menu无手柄预期已明确替代 | verification.md 当前证据表；checks/state-check.cjs；checks/tenant-menu-results.json |

## 4. Verification Gate

- [x] 源SPEC状态和1.0.0版本仍有效。
- [x] §4.1的5类冲突及相关当前入口均在Source Ledger中。
- [x] 每行Resolution合法且Evidence非空。
- [x] Remaining全部为none。
- [x] Search Proof覆盖旧手工数字排序、平台无条件优先、旧范围排除和历史入口。
- [x] 已运行validate-source-convergence.mjs且无error。

**结论**：verified

**审核人**：Codex（按房总已批准068及完整推送授权进行来源收敛）

**审核日期**：2026-09-26

## 5. Change Control

本账本只对068@1.0.0有效；规格升版或新发现冲突必须重新收敛并校验。来源收敛通过证明本地文档与合同一致，不代表远端发布、真实Issue创建或生产验收完成。发布后须由交付流程确认版本化包可访问及Issue直接回链，旧051/060快照和旧Issue保持历史。
