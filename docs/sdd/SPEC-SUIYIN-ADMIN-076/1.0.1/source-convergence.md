---
ledger_id: CONVERGENCE-SUIYIN-ADMIN-076
spec_id: SPEC-SUIYIN-ADMIN-076
spec_version: 1.0.1
status: verified
prepared_by: Codex
prepared_at: 2026-09-30
---

# 西安两租户、碎银账号与菜单状态 — Source Convergence Ledger

## 1. 收敛摘要

- **源规格**：`SPEC-SUIYIN-ADMIN-076@1.0.1`，implemented；绑定用户已确认的最终默认名称“碎银账号”。
- **触发**：2026-09-30房总要求完整推送，并给王争建立截图第3、4项的工程Issue。
- **目标**：当前维护、产品、流程与设计入口统一17租户、账号名称、指定八租户时间设置移除及行内菜单胶囊；保留各租户原数据、稳定身份和权限范围。
- **发布目标**：`v2026093001-admin-accounts-menu`。本账本只证明当前来源收敛，远端push/tag、Issue和通知分别以实际回执为准。
- **工程范围**：仅076 R004与R005–R008两切片；其他076内容及077称谓/角色随原型发布，不扩大到工程Issue。原型行为与生产完成分开记录。
- **历史边界**：已版本化SDD、历史验收、原始采集源保持事实原貌；旧名在运行时按route和tenant投影，不删除用户自定义名称或真实自由文本。

## 2. Source Ledger

当前文档及代码路径以`suiyin-admin/`仓根为准；本目录为076 canonical 工作规格。Resolution为updated的源已在原位置更新当前规则，或通过其正式读取入口的Profile迁移当前展示；原始采集证据不重写为新规则。

| Source ID | Old Source | Conflict / Superseded Rule | Resolution | Evidence | Remaining |
|---|---|---|---|---|---|
| S001 | 051@1.1.0及README/CLAUDE/主PRD/总流程的15租户基线 | §4.1-1：新画美/傲丽未登记；旧15/808/90不能继续充当当前总清单 | updated | 当前入口与prd/admin-account-menu-status.md原位明确17租户814入口90路由；source-search-evidence.md Q002/Q008核对JSON；既有15租户采集统计带日期保留 | none |
| S002 | prototype/data/navigation-snapshot.json、content各租户JSON、forms/schema及旧本地标签 | §4.1-2：salesManage原名销售管理，中间名碎银账号管理；字符串匹配可破坏旧链接/自定义名 | updated | admin-account-profile.js按稳定route迁移默认名并兼容两旧名；normalizeTenant/Page/Override在实际读取链调用；当前文档默认名碎银账号；Q001/Q003/Q004 | none |
| S003 | admin-domain-views.js账号顶部/系统设置及共享表单的04:00默认配置 | §4.1-3：所有租户展示时间配置与指定八租户移除矛盾 | updated | removesDutyTime显式八租户，账号顶部/设置行/fieldAllowed守卫已接入；当前PRD/design明确旧值不回填、不校验提交；上班记录、在线状态和离开转交及其余九租户保留；Q004 | none |
| S004 | 普通/平台菜单原文本状态与编辑弹窗；prd/flowcharts下tenant-menu-drag、platform-menu-drag | §4.1-4：状态须开弹窗，与行内直接提交矛盾 | updated | 两菜单PRD/流程原状态段已改胶囊并链接076；statusControl/saveStatus共用原模型，严格保存、同值无操作、失败回滚；Q005 | none |
| S005 | 073艺星辅助线、071艺星回访及15租户话术来源 | §4.1-5：新增医美租户不能自动继承艺星专属业务或其他店资料 | updated | 当前README/CLAUDE/主PRD/新PRD声明新租户只有独立三路由框架；073/071仍按既有艺星能力范围，话术源十五租户未外推；Q002及077只读Profile核对 | none |
| S006 | 新租户已存在正式网址与旧采集完成表述 | §4.1-6：网址确认不能被解读为已复制真实菜单/账号 | updated | huamei-xian与aoli-xian各自来源状态not-captured；当前文档明确待采与空数据不同，不算入741已采页面；Q002/Q008 | none |
| S007 | README历史验收表、docs/sdd既有版本、docs/history及docs/handoffs | 旧销售管理/15租户/旧状态交互与当前版本不同 | intentional-history | Q001唯一旧页面名命中属README日期明确的旧验收；Q006列出历史命中，Q007证实无已跟踪历史文件改写；当前入口直链076/077新版本 | none |
| S008 | 076原3.2非目标中的销售词范围与077新需求 | 原先未承接人员业务词改名，不能阻挡后续已批准077八租户称谓变更 | updated | 当前维护/产品/设计矩阵分别指向076账号入口与077人员/角色；077@1.0.1精确依赖076@1.0.1，未改变非目标租户与交易指标；Q001/Q002及077账本 | none |

## 3. Search Proof

实际命令、退出码、输出和判读见同目录[source-search-evidence.md](./source-search-evidence.md)。所有搜索在文档代理完成后执行，不以追加摘要代替旧段核对。

| Search ID | Pattern / Old Term | Scope | Command / Method | Result | Evidence |
|---|---|---|---|---|---|
| Q001 | 销售管理、碎银账号管理 | README/CLAUDE/design及当前PRD/流程 | rg -n对17份当前入口文档精确检索 | 无当前默认旧名；仅有日期明确的历史销售管理验收引用 | source-search-evidence.md Q001 |
| Q002 | 15租户、17/814、待采集 | 同当前文档与navigation-snapshot | rg -n并只读递归统计route | 当前17/814/90；15租户均属旧采集/既有模块；新租户各3框架入口，无虚报采集 | source-search-evidence.md Q002/Q008 |
| Q003 | 原始销售管理默认名 | prototype/data | rg -l并核对读取链normalize函数 | 旧词为保留来源输入，运行时依route正常化；自定义名保留 | source-search-evidence.md Q003/Q004 |
| Q004 | removesDutyTime、fieldAllowed、isDutyTime、旧名缓存 | account-profile/domain/content/menu-state | rg -n并读完整函数 | 显式八租户所有已知入口和共享可达表单受控，旧值不复活 | source-search-evidence.md Q004 |
| Q005 | 胶囊、statusControl、saveStatus、失败恢复 | 两菜单当前PRD/流程、design、menu-tree | rg -n并核对状态写入/回滚调用 | 当前入口已统一行内胶囊，范围与原模型一致 | source-search-evidence.md Q005 |
| Q006 | 历史旧名/15租户/自动下班及旧文件改写 | docs/sdd、docs/history、docs/handoffs | rg -l与git diff --name-only定向检查 | intentional-history only；已跟踪历史快照未改写 | source-search-evidence.md Q006/Q007 |

## 4. Verification Gate

- [x] 源SPEC为implemented，版本1.0.1有效。
- [x] §4.1六项冲突和用户最终账号名称在账本逐项覆盖。
- [x] Resolution合法且有实际命中/代码/文档证据。
- [x] Remaining全部none。
- [x] 搜索覆盖旧名、旧租户数、时间、菜单入口、数据来源与历史包。
- [x] 已运行validate-source-convergence.mjs且无error。

**结论**：verified

**审核人**：Codex（按房总已批准合同及完整推送授权进行当前来源核对）

**审核日期**：2026-09-30

## 5. Change Control

规格版本变更或发现新的旧来源时重新核验。本账本不证明生产功能已实现，也不替代GitHub远端包、实际Issue回链、push/tag及通知回执。历史包保持不可变；采集源旧词经展示投影使用，后续新增tenant必须独立登记和验证范围。
