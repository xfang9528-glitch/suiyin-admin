---
ledger_id: CONVERGENCE-SUIYIN-ADMIN-060
spec_id: SPEC-SUIYIN-ADMIN-060
spec_version: 1.1.0
status: verified
prepared_by: Codex
prepared_at: 2026-09-21
---

# 平台菜单 — 来源收敛

## 1. 收敛摘要

用户明确完整推送；060@1.1.0替换平台手工排序和不联动侧栏的旧假设，不修改普通menu的操作合同或历史快照字节。

## 2. Source Ledger

| Source ID | Old Source | Conflict / Superseded Rule | Resolution | Evidence | Remaining |
|---|---|---|---|---|---|
| S001 | docs/design-spec.md Shell与菜单；prd/admin-live-reference.md 页面家族 | 普通与平台统一描述为只影响本租户；平台人工排序入口 | updated | 原句分开普通menu与平台allMenu，平台拖动/自动顺序及全租户联动直接写入现行段落 | none |
| S002 | flowcharts/admin-live-reference.md 数据展示与菜单管理同步 | 所有菜单确认后只有同租户侧栏路径 | updated | 原图按普通/平台分支，平台保存走全租户即时更新；新增专用流程 | none |
| S003 | README.md、CLAUDE.md 与主PRD交付边界 | 所有修改仅限对应租户路由 | updated | 原位置明确平台共享导航例外和库存/权限隔离，登记060精确入口 | none |
| S004 | 060@1.0.0的R007/INV005、旧验证记录 | 不自动联动侧栏的AI范围误判 | superseded | 当前spec@1.1.0和verification顶部已声明E008取代，历史结果仅说明当时验证范围 | none |
| S005 | docs/sdd/SPEC-SUIYIN-ADMIN-051/1.1.0 与052历史版本快照 | 手工排序和同租户菜单语义 | intentional-history | README合同表声明060仅替代平台范围，历史批准快照不重写 | none |
| S006 | 原平台父级级联及来源截图/JSON | 旧编辑可到更深层；真实后台截图不含新拖动 | intentional-history | R004保留深层禁用，不拍平；截图/JSON为历史，本次新增不声称实站已有 | none |

## 3. Search Proof

| Search ID | Pattern / Old Term | Scope | Command / Method | Result | Evidence |
|---|---|---|---|---|---|
| Q001 | 只影响本租户、修改仅联动本租户、同租户侧栏、排序 | 当前README/CLAUDE/PRD/流程/设计 | rg -n -e 本租户 -e 侧栏 -e 排序 -e 060 定向复核 | 普通menu限定清楚，平台按060；0 active conflicts | source-search.txt |
| Q002 | 不自动同步、不联动、无其他租户传播 | 本规格及历史验证/远端历史快照 | rg -n 定向搜索并人工分类 | 当前规则已替换，余项只作带版本历史 | spec.md §4.1、verification.md |
| Q003 | 三级、真实后台、原始编号 | 源规格与原型控制器 | R004与原18项拖动检查对照 | 更深分支保留；新交互为用户批准原型新增 | evidence/results.json |

## 4. Verification Gate

各冲突均有当前规则、处置及证据；无待定项。结构校验与定向搜索另存交付证据。

**结论**：verified
**审核人**：Codex（按用户明确纠偏机械收敛）
**审核日期**：2026-09-21

## 5. Change Control

仅对060@1.1.0有效，新增冲突或升版需重做收敛。
