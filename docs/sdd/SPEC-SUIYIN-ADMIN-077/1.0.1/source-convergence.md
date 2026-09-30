---
ledger_id: CONVERGENCE-SUIYIN-ADMIN-077
spec_id: SPEC-SUIYIN-ADMIN-077
spec_version: 1.0.1
status: verified
prepared_by: Codex
prepared_at: 2026-09-30
---

# 艺星、画美与傲丽咨询称谓及角色 — Source Convergence Ledger

## 1. 收敛摘要

- **源规格**：`SPEC-SUIYIN-ADMIN-077@1.0.1`，implemented；继承`076@1.0.1`，账号入口固定“碎银账号”。
- **触发**：2026-09-30房总要求本轮原型完整推送，目标tag `v2026093001-admin-accounts-menu`。
- **当前规则**：仅六个现有艺星及画美西安、傲丽西安的系统人员词汇改咨询；原销售角色默认线上咨询，新增现场咨询、科室助理，其他角色/多选/权限及九个非目标租户保持。
- **历史和来源**：原始采集JSON、共享schema、稳定字段标识、交易指标、用户自由文本及不可变历史SDD保留原文，通过明确tenant Profile展示当前称谓。
- **工程边界**：077本轮无工程建单/交接授权。用户要求的两张工程Issue仅对应076截图中的时间入口和菜单胶囊，不因完整推送扩大到人员改岗或真实授权。

## 2. Source Ledger

当前文件路径以`suiyin-admin/`仓根为准。updated表示当前消费/显示/维护入口已采用新规则；不将原始采集源改写成未采事实。

| Source ID | Old Source | Conflict / Superseded Rule | Resolution | Evidence | Remaining |
|---|---|---|---|---|---|
| S001 | 076@1.0.0/1.0.1 §3.2销售相关业务词非目标 | §4.1-1：上轮不处理人员称谓与本轮八租户咨询要求范围不同 | updated | 当前README/CLAUDE/主PRD/design分别指向076账号和077人员/角色矩阵；077保持精确依赖，不改其他076规则；Q001 | none |
| S002 | 076旧碎银账号管理名称及原salesManage默认销售管理 | §4.1-2：用户最终名称已改碎银账号 | updated | 076@1.0.1和当前账号文档均为碎银账号；displayText先处理oldTitles，normalize链兼容两旧名；Q005/Q007 | none |
| S003 | prototype/data各租户JSON、共享form-schemas、content/forms/options及各专用视图源词 | §4.1-3：源label/字段仍称销售，不能全局替换键值或客户文本 | updated | admin-account-profile提供displayText，导航/content与专用视图展示调用；保留source身份和键。当前PRD/流程共享词在文件入口明确tenant覆盖，六艺星专属段原位改咨询；Q001/Q002/Q003 | none |
| S004 | 原账号权限角色与本地角色目录、旧销售缓存 | §4.1-4：销售与客服/网咨/接待等不能都归并为三岗位 | updated | roleValue精确将旧销售映射线上咨询，roleOptions/normalizeRoles保留其他角色/多选；打开/取消不迁写，保存失败保草稿。当前PRD/design写明边界；Q003/Q007 | none |
| S005 | 两新租户缺乏真实人员/菜单来源 | §4.1-5：改称谓不能解释为已采人员或获得艺星权限 | updated | 当前所有入口明确not-captured与独立三路由框架，077不新增真实人员或授权；Q001/Q004及076租户证据 | none |
| S006 | role页面深圳captured、其他五艺星reference | §4.1-6：参考目录不能当作各店真实角色权限 | updated | 只读源状态证明深圳captured、五店reference；代码新增岗位标prototypeOnly且权限菜单空，当前SPEC/PRD说明三岗位为原型规则、不猜其他角色映射；Q003/Q007 | none |
| S007 | 商品销售人数、销售额/金额/量/收入与自由文本 | §4.1-7：交易指标或用户文字不是人员称谓 | updated | displayText显式保留交易词，展示端不改用户业务值；当前README/CLAUDE/design和新PRD说明边界，Q004/Q007只读探针确认指标保持 | none |
| S008 | 当前共享业务文档的销售称谓 | 不能把九个非目标租户通用词误读为八租户新界面规则 | updated | 当前共享文档首段明确077覆盖，目标租户专属段原位改咨询；非目标租户仍有效的销售称谓继续保留，Q001逐条判读残留 | none |
| S009 | 历史Issue标题及docs/sdd/history/handoffs | 历史旧名、原角色和当时范围不能被用作八租户当前显示规则 | intentional-history | 旧Issue题目为既有工程引用不更名；已版本化SDD保持不可变，Q006/Q008无旧包改写，当前入口直链077@1.0.1 | none |

## 3. Search Proof

实际命令/结果、源文件命中清单及只读VM探针见[source-search-evidence.md](./source-search-evidence.md)。探针使用合成角色选项验证算法，不主张新租户具备真实管理员/财务目录。

| Search ID | Pattern / Old Term | Scope | Command / Method | Result | Evidence |
|---|---|---|---|---|---|
| Q001 | 销售、咨询、三类岗位 | 17份当前README/维护/产品/流程/design文件 | rg -n并逐段判读tenant覆盖、历史标题和业务定义 | 无当前八租户旧称谓规则冲突；共享源词明确九租户默认，当前指向077 | source-search-evidence.md Q001 |
| Q002 | 原采集销售字段与选项 | prototype/data | rg -l列出保留来源 | 来源与稳定字段保留，展示投影承接，不改客户自由文本 | source-search-evidence.md Q002 |
| Q003 | displayText、usesConsultation、roleValue/Options、normalizeRoles | account-profile/content/navigation | rg -n核对真实调用点并读源码 | 显式八租户，原销售精确映射，其他角色与多选保持 | source-search-evidence.md Q003 |
| Q004 | 商品销售人数、销售额、销售金额、销售量、销售收入、自由文本、待采 | Profile与当前入口文档 | rg -n及VM只读函数探针 | 交易词保持，未知资料不补造，077不新增真实授权 | source-search-evidence.md Q004/Q007 |
| Q005 | 销售管理、碎银账号管理 | 当前17份文档与Profile | rg -n及VM旧名投影 | 当前账号入口均碎银账号；旧名仅兼容输入/明确历史 | source-search-evidence.md Q005/Q007 |
| Q006 | 历史销售/角色词、旧包变更 | docs/sdd、docs/history、docs/handoffs | rg -l与git diff --name-only | intentional-history only，已跟踪旧快照无改写 | source-search-evidence.md Q006/Q008 |
| Q007 | captured/reference角色来源与非目标对照 | 六艺星源role、八目标Profile与bzds | 只读JSON状态提取和Node VM合成选项探针 | 深圳captured、五店reference；八目标为三岗位，bzds仍销售；不推断真实权限 | source-search-evidence.md Q007 |

## 4. Verification Gate

- [x] 源SPEC implemented，1.0.1与076@1.0.1依赖有效。
- [x] §4.1七类冲突及历史残留全部在Source Ledger覆盖。
- [x] Resolution合法且Evidence来自实际检索和只读核对。
- [x] Remaining全部none。
- [x] Search Proof覆盖旧词、账号名、角色映射、参考目录、交易指标及历史包。
- [x] 已运行validate-source-convergence.mjs且无error。

**结论**：verified

**审核人**：Codex（按房总已批准077与完整推送授权完成当前来源核对）

**审核日期**：2026-09-30

## 5. Change Control

该账本只证明当前文档与原型展示规则来源一致，不证明原型远端发布或生产角色迁移完成。后续角色权限差异、其他角色映射或真实改岗均需新证据和明确范围；077版本或依赖变动后重新校验。旧SDD和采集源不为消除关键词而改写。
