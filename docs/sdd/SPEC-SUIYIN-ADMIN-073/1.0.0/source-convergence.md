---
ledger_id: CONVERGENCE-SUIYIN-ADMIN-073
spec_id: SPEC-SUIYIN-ADMIN-073
spec_version: 1.0.0
status: verified
prepared_by: Codex
prepared_at: 2026-09-29
---

# 工具管理与艺星辅助线 — Source Convergence Ledger

## 1. 收敛摘要

- **源规格**：`SPEC-SUIYIN-ADMIN-073@1.0.0`，implemented；本账本只解释其已批准范围，不新增规则。
- **触发**：房总要求“完整推送”，并指定在Admin工程仓为王梓先建立实现Issue，提出环境佰智德三、提出人房昕。
- **目标**：当前入口统一为全部租户「工具管理 → 话术管理」，艺星增加辅助线自助管理；旧一级话术、全租户辅助线提案和固定PC素材库的范围不再被当作073实施规则。
- **工程记录**：Admin [#442](https://github.com/PetWebOrg/suiyin-admin/issues/442)已创建，负责人`build996`，状态todo；具体执行以073 Handoff/Test Contract为准，原型验收不等于生产完成。
- **历史边界**：旧030、051、060、068及已版本化SDD、历史验收包均保持不可变。030原PC合同继续解释其当时交付，073只继承分类、透明叠加和对象操作语义；不修改原PC实现，不把073当成生产实施授权。

## 2. Source Ledger

以下当前文档路径以`suiyin-admin/`仓根为准；073工作文档以本目录为准。外部旧工程故事保留历史来源，当前新Admin执行直接回链073和#442。

| Source ID | Old Source | Conflict / Superseded Rule | Resolution | Evidence | Remaining |
|---|---|---|---|---|---|
| S001 | 原型Issue #2早期正文；073 evidence.md Issue段 | §4.1-1：跨租户通用辅助线范围与当前仅艺星不一致 | superseded | 原型Issue #2开头已改为073当前决策，旧正文降为历史提案并关联Admin #442；delivery/prototype-issue-2-convergence.json记录远端回读verified；evidence.md原段同步明确替代 | none |
| S002 | Flutter故事#7584旧范围及默认叠加/覆盖未决项；073 evidence.md | §4.1-1/2：旧通用范围和初始化方案不能替代本租户既有内容全部可编辑决策 | superseded | evidence.md原来源段明确073 R003/R004限定替代；073 §4.1、主PRD“工具管理与艺星辅助线”和Admin #442指向当前合同。保留#7584外部故事，不声称改写Flutter实现或完成真实迁移 | none |
| S003 | SPEC-YESTAR-PC-030@1.1.0 §3.2原后台管理/自定义上传排除 | §4.1-3：原PC非目标被误用为本次Admin不得自助维护 | intentional-history | 030原版本及PC代码不改；evidence.md、prd/admin-live-reference.md及docs/design-spec.md在当前入口明确073承接Admin管理，030只继承相应PC展示/对象交互语义 | none |
| S004 | 030 R004原PPT来源、R015固定123文件/129条及两仓目录一致 | §4.1-4：旧固定库合同不适用于用户编辑后的独立配置 | intentional-history | 当前PRD、README、CLAUDE与design原位区分16类129条123文件为初始本地样本，允许各租户编辑后不同；073不扩散其他店素材，不伪称最新生产迁移，旧PC快照不改 | none |
| S005 | 030旧五城样例及PC注册表 | §4.1-5：样例未包含北京，不能限制“全部艺星” | intentional-history | 当前PRD、流程、设计和维护入口明确能力登记与六艺星验收、非艺星拒绝；evidence.md原PC来源段注明五城只是当时样例；当前导航核对6个guideLineManage入口 | none |
| S006 | README/CLAUDE、prd/admin-live-reference.md、prd/language-manage.md、flowcharts/admin-live-reference.md、flowcharts/language-manage.md、docs/design-spec.md原话术入口 | §4.1-6：页面直接作为领域/一级入口，没有工具父级迁移和旧状态兼容 | updated | 现有标题说明、主PRD页面表、话术进入句、两张总流程的入口/领域节点及设计原段已改为工具下二级话术；原route、隐藏/权限、页签和存储明确保留，未仅追加新章节 | none |
| S007 | prd/platform-menu-drag.md及prd/tenant-menu-drag.md默认结构与覆盖段 | §4.1-6：既有默认树与租户覆盖语义需说明本次指定入口迁移 | updated | 两文原段限定073迁移工具/话术，保留其他合法覆盖、独立隐藏和权限；平台定义登记不授予非艺星辅助线数据 | none |
| S008 | README/CLAUDE/主PRD/总流程/design当前802入口89路由；README无新增工程Issue表述 | 当前入口数与本次新增6辅助线、真实Admin #442不一致 | updated | 原位置更新15租户808入口90路由，工具父级不计业务route；源码JSON只读计数一致。README/CLAUDE工程段改为已创建#442及build996，状态todo，不伪报生产完成 | none |
| S009 | docs/sdd既有版本化包、docs/history、旧v1.1模块与流程历史入口 | 历史范围、旧菜单或固定数不能作为当前设计指令 | intentional-history | 本轮未改写已跟踪版本化SDD和history文件；现有历史入口已显式指向现行主PRD/流程。README合同表和CLAUDE明确073的限定替代，搜索剩余旧数仅为有日期的历史基线 | none |

## 3. Search Proof

实际命令和输出摘要保存在本目录`source-search.txt`，日期2026-09-29。当前文档检索覆盖README、CLAUDE、主PRD/话术PRD/两菜单PRD、总流程/话术流程及设计规范，逐项阅读命中上下文；不会把“原一级已迁移”等历史说明误判为仍有效的一级规则。

| Search ID | Pattern / Old Term | Scope | Command / Method | Result | Evidence |
|---|---|---|---|---|---|
| Q001 | 当前802入口89路由；本轮没有新增工程Issue | 9个当前文档 | rg -n使用多个-e精确检索旧肯定句 | 0命中，旧现行口径已原位移除 | source-search.txt Q001 |
| Q002 | 一级话术；工具管理；languageManage；隐藏 | 同9个当前文档 | rg -n逐项检索后检查上下文与原位diff | 命中均为新父子结构、兼容说明或明确历史，不存在第二个当前一级话术入口指令 | source-search.txt Q002；主PRD页面表及总流程原节点 |
| Q003 | 跨租户通用；全部可编辑；五城；123；129；后台管理 | 073 evidence.md、当前主PRD/design与030原spec | rg -n并对照073 §4.1六类冲突 | 旧提案在当前引用处明确被073替代；030固定库/五城/非目标仅解释其原PC交付，0 active conflicts | source-search.txt Q003；S001–S005 |
| Q004 | 808；90；073；442；build996 | README/CLAUDE/主PRD/总流程/design | rg -n当前入口检索及navigation-snapshot递归route计数 | 15租户808入口90路由，6个艺星辅助线；当前合同与真实工程入口一致 | source-search.txt Q004/Q005 |
| Q005 | 旧SDD与历史快照改写 | 已跟踪docs/sdd、docs/history及旧PC合同 | git diff --name-only定向检查；030保持只读 | 无已跟踪旧快照修改，本次只增加073新包，由发布负责人打包 | source-search.txt Q006 |
| Q006 | 保存失败；草稿；迟到；清空；真实PC | 当前主PRD、流程、设计、维护入口 | rg -n核对状态与能力边界 | 分类图片/队列/离开三选项/原生退出/已空不恢复/真实能力边界在各自当前位置说明 | source-search.txt Q007；对应R004–R011 |

## 4. Verification Gate

- [x] 源SPEC的1.0.0与implemented状态有效。
- [x] §4.1六类冲突及现行入口在Source Ledger逐项覆盖。
- [x] Resolution合法且Evidence非空。
- [x] Remaining全部为none。
- [x] 检索覆盖旧菜单、范围、初始化、固定目录数量、五城与历史来源。
- [x] 已运行validate-source-convergence.mjs且无error。

**结论**：verified

**审核人**：Codex（按房总已批准073与完整推送授权完成来源收敛）

**审核日期**：2026-09-29

## 5. Change Control

本账本绑定073@1.0.0；规格升版或新冲突发现后重新核验。来源收敛证明当前文档规则一致，不证明原型远端发布或生产实现已完成。073版本包、tag、远端访问与通知由实际发布回执闭合；旧PC及既有已发布版本快照保留，Flutter #7584仍只是相关旧故事，本轮正式Admin执行入口是#442。
