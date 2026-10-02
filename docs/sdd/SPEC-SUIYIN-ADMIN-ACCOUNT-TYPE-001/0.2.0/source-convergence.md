---
ledger_id: CONVERGENCE-SUIYIN-ADMIN-ACCOUNT-TYPE-001
spec_id: SPEC-SUIYIN-ADMIN-ACCOUNT-TYPE-001
spec_version: 0.2.0
status: verified
prepared_by: "Codex"
prepared_at: 2026-10-02
---

# 全部账号状态 — Source Convergence Ledger

## 1. 收敛摘要

- **源规格**：`SPEC-SUIYIN-ADMIN-ACCOUNT-TYPE-001@0.2.0`，implemented；房总明确要求完整推送和创建Admin工程Issue。
- **当前规则**：账号在创建时已确定个微或企微；统计为个微、企微、汇总，在线与掉线名单只含两类；没有第三业务分类。总览状态、汇总和名单取对应环境完整快照。
- **范围**：本次规格的旧提案、原对齐证据、原型当前PRD/流程/设计和该页的历史验收说明。其他页面或已发布的旧版本SDD保持各自范围，不批量改写历史。
- **路径约定**：下表`repo/`为本原型仓根目录；`local/`为本地同名feature目录。公开版本仅包含当前合同、脱敏静态投影及公开验证汇总；raw captures、内部报告和连接资料保留本地。
- **工程边界**：正式Admin必须按稳定账号ID读取已保存的创建类型；无ID时的精确名称多重集合只用于静态采集构建。43环境、画美174和代理118是验收样例数量，不是生产常量。

## 2. Source Ledger

| Source ID | Old Source | Conflict / Superseded Rule | Resolution | Evidence | Remaining |
|---|---|---|---|---|---|
| S001 | local/spec.md §4 E006、§14的0.1.0记录；local/verification.md末尾0.1.0历史段 | 旧方案把采集缺口作为“待核对”第三分类，并显示已核实比例 | superseded | spec E009、R004及Q001明确撤销；verification在历史段之前明确写“第三分类语义已被用户纠正撤销”；当前组件无该分类字符串 | none |
| S002 | local/captures/bzds-account-types.json与原完整总览的cxy-佰智德三状态差异 | 明细的登录中不能覆盖总览掉线；类型证据和状态证据用途不同 | updated | spec §4.1、R003与INV003；repo/prd/all-account-status.md“来源、状态与失败”明确明细只补固定创建类型 | none |
| S003 | local/../admin-all-account-alignment-2026-10-02/captures/account-status-snapshot.json画美171条旧快照 | 旧名单与新类型明细不匹配，不能按相似姓名硬连或混用新名单与旧汇总 | intentional-history | 旧快照保留为原采集历史；local/classification-report.json rowReplacements记录画美整行174/104/70与新旧时间；spec E010和verification最新段明确整行替换 | none |
| S004 | local/verification.md的0.2.0补齐前及0.1.0验收段；旧组件截图 | 旧19个未知、后续15个缺口及画面不能冒作当前完整结果 | superseded | 最新verification开头明确43行/1139账号全部wx/qw、15个旧槽位经用户确认；历史段前均明确已被上方完整结果取代；旧截图不进入本次公开验收图 | none |
| S005 | repo/prd/admin-live-reference.md“页面与交互”“用户结果与范围” | 原通用账号状态描述不足；“画美/傲丽真实后台仍未采集”过宽 | updated | 当前家族表加入全部账号状态专用行并链接repo/prd/all-account-status.md；原位置改为独立业务页原范围与本次平台微信账号采集范围分开 | none |
| S006 | repo/flowcharts/admin-live-reference.md“入口、租户与证据” | 全部路由都走通用样本回退会误导为bzds专用页可退回旧演示或未采分类 | updated | 路由判断新增bzds全部账号状态专用分支，链接repo/flowcharts/all-account-status.md；失败保留正确页或通用重试，不回退旧演示；父路由8项隔离fixture记录于component-integration-verification.json | none |
| S007 | repo/docs/design-spec.md“列表和统计表”“碎银账号、咨询称谓与菜单状态”“状态与验收” | 通用来源状态不能外推为微信业务类型；人员账号待采口径不能覆盖本次微信账号快照 | updated | 当前“全部账号状态”专节明确两类+汇总、40px页签加14px间距、160/210px列、长标签换行与表头下组标题；人员账号段澄清两类账号库存；来源提示仅对原页面生效 | none |
| S008 | repo/docs/verification/admin-live-reference.md“2026-09-27修复与保留内容” | 旧54px页签、固定y179及“未采代理页”不再是当前bzds页基线 | superseded | 原位置已明确为2026-09-27历史，直接链接0.2.0合同和当前设计；代理页本轮118卡及新页签几何以最新验证为准 | none |
| S009 | repo/prototype/admin-domain-views.js中的旧代理未采fallback；旧通用bzds内容样本 | 旧通用演示不能在专用组件校验失败后接管bzds目标路由 | updated | allAccountStatus在bzds且专用组件存在时直接交由组件并return；component-integration-verification.json覆盖首次失败与重绘失败不串旧数据；其他租户保留原fallback，非本次分类范围 | none |
| S010 | local/captures/historical-account-provider-evidence.json与用户确认补充来源 | 历史固定类型不能同时带入旧在线状态；用户确认不能被写成当日线上采集 | updated | spec E011/E012、verification最新段、PRD来源段区分3条历史provider与15条确认槽位；builder只补固定类型；公开报告只保留来源类别汇总和隐私投影不变量 | none |

## 3. Search Proof

以下均为2026-10-02在上述限定路径的实际搜索与读取结果；检索式分项列出，避免扫描无关客户数据。原始结果仅本地核对，不将raw账号采集输出复制到公开包。

| Search ID | Pattern / Old Term | Scope | Command / Method | Result | Evidence |
|---|---|---|---|---|---|
| Q001 | 待核对、仅含已核实、unknown | 专用JS/CSS及本次PRD/流程 | 分别执行rg -n各词并读取命中上下文 | JS/CSS无旧分类文案；PRD/流程命中仅为明确撤销说明；spec/verification命中属于禁止规则或已标注历史 | S001、S004；repo/prd/all-account-status.md §用户结果与范围及当前R004 |
| Q002 | 54px页签、未采代理、代理账号状态尚未采集、演示工作号 | 现行design/PRD、repo验收说明、父路由 | rg -n逐词搜索，检查allAccountStatus分支先后 | 当前文档只保留带替代链接的历史说明；旧fallback仅其他租户可继续使用，bzds专用组件存在时不进入 | S006、S008、S009；父路由和8项隔离fixture |
| Q003 | 画美/傲丽由用户明确新增、真实后台仍未采集、两新租户账号与业务区 | 总PRD及design对应原段 | 原位置精确文字替换后再检索 | 过宽旧句已移除；保留独立人员账号/业务页边界，微信总览另按当前合同 | S005、S007；repo/prd/admin-live-reference.md用户结果与范围 |
| Q004 | 171、174、previousCounts、whole-row-replacement | spec E010、classification-report前部、verification最新段 | 读取限定头部与rowReplacements；对照旧快照来源记录 | 整行换代有前后计数和时间；旧171仅历史来源，当前174不宣称生产常量 | S003；当前verification画美条目及spec §4.1 |
| Q005 | 登录中、历史、用户确认、15 | spec §4/8、verification最新段、当前产品来源说明 | 阅读对应证据用途，核对新旧状态与来源类别 | 总览状态未由明细覆盖；历史provider仅补类型；用户确认独立登记，不冒称实时采得 | S002、S010；spec E011/E012、PRD来源段 |
| Q006 | 数量排序、无ID、master/docs/sdd | 当前Handoff/Test和本页PRD/流程/design | rg -n及逐条核对合同Oracle | 不新增数量排序；无ID匹配明确仅静态构建；Handoff外链固定v2026100201-admin-account-type-status标签 | issue-handoff.md §2/4；test-contract.md T-R003-01/T-R006-01 |

## 4. Verification Gate

- [x] 源SPEC为implemented、版本0.2.0，当前六条规则仍有效。
- [x] §4.1全部冲突来源已登记；旧提案、状态冲突、整行快照及固定类型来源分别处理。
- [x] 每项Resolution合法、Evidence非空，Remaining均为none。
- [x] 搜索覆盖第三类、旧页签/代理提示、过宽未采口径、快照替换及工程误用边界。
- [x] 本轮`validate-source-convergence.mjs`结构和收敛检查已执行；10项来源、6项搜索证据齐全。远端发布/链接回读另由主交付流程验收。

**结论**：verified。当前规则与旧来源已收敛；该结论不表示原型已发布或生产已实现。  
**审核人**：Codex（文档、实现分支与证据核对）  
**审核日期**：2026-10-02

## 5. Change Control

- SPEC升版后本账本stale；新增冲突来源须登记并重跑校验。
- 本次因用户明确完整推送而同步当前PRD、流程和设计；不改历史发布包，也不把原型发布等同生产实现。
- 原始DOM、真实采集截图、历史账号证据和用户确认名单均留本地；公开投影、脱敏截图和汇总按本轮隐私处理发布。
