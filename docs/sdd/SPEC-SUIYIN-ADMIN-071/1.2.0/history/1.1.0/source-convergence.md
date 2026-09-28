---
ledger_id: CONVERGENCE-SUIYIN-ADMIN-071
spec_id: SPEC-SUIYIN-ADMIN-071
spec_version: 1.1.0
status: verified
prepared_by: "Codex"
prepared_at: 2026-09-28
---

# 回访规则 — Source Convergence Ledger

## 1. 收敛摘要

- **源规格**：`SPEC-SUIYIN-ADMIN-071@1.1.0`，状态approved；R001–R015与验收语义不变。
- **触发**：房总2026-09-28明确要求完整推送（E020）；§4.1包含历史对象模型、跨页面继承和菜单提议的冲突。
- **当前实现**：深圳`聊天管理 → 回访规则`（`group-10 / revisitRules`）；一条规则含多个独立节点，共同范围/基准/每日时间/启停；节点复制仅替换条件。深圳menu和德三allMenu保留同一稳定定义。其他租户没有新增入口。
- **最终菜单决定**：E019已撤回移动至群发管理、改称群发规则及全租户新增入口的提议；原群发叶子页与旧回访统计各自保留。
- **完成含义**：本账本只确认本次来源引用与现行静态合同已收敛，不确认远端分支、tag、SDD包、部署或通知已成功。完整推送完成必须由实际回执证明。
- **来源边界**：旧PC设计与历史业务草稿仅作为被引用对象核查。本次未修改PC仓或业务草稿；它们在原页面的行为不因071改变，不能被071继承为调度、分配或统计能力。`updated`行明确指出本次更新的071引用或Admin现行文档；`intentional-history`仅用于已明确隔离的历史引用/快照。
- **隐私**：私聊原文、账号标识和MCP原始返回不进入本账本、原型mock或交付包。只保留经抽象的业务条件与本地合成验证。

为使本机核查可重复，以下路径简称固定为：

| 简称 | 绝对路径 |
|---|---|
| SPEC | E:/AI 项目/prototype-sdd/specs/071-admin-revisit-rules |
| ADMIN | E:/AI 项目/佰智德三/碎银原型/suiyin-admin |
| PC | E:/AI 项目/佰智德三/碎银原型/suiyin-pc-chat |
| YPC | E:/AI 项目/艺星原型/yestar-pc-chat |
| OLD-BUSINESS | E:/AI 项目/yestar-progress/specs/business/chat-revisit.md |

## 2. Source Ledger

§4.1十二个条目依次映射S001–S012；S013–S015补充当前实施状态、数据来源及菜单升级保留边界。

| Source ID | Old Source | Conflict / Superseded Rule | Resolution | Evidence | Remaining |
|---|---|---|---|---|---|
| S001 | SPEC/spec.md §4.1第1项、E011及§14的0.1.0/0.1.1历史记录 | 曾把部门理解为人员范围；渠道与账号不能按员工组织树或父子互斥方式解释 | updated | 当前R001、AC-R001-01及§6.4统一为账号群组/工作号；PC/prototype/yestar-friend-picker.js:136为渠道OR账号；ADMIN/prototype/admin-revisit-rules-model.js:55–60按共同集合取范围并受管理权限限制。动态成员取法仅为Q004原型默认，不升格为生产决定 | none |
| S002 | SPEC/spec.md §4.1第2项；YPC/annex/design-spec-v1.0.md §18.5:835的确定/取消描述 | 来源设计文档与当前PC即时回填不一致 | updated | 当前SPEC明确本页采用即时更新草稿、整条保存/取消。PC/prototype/prototype_v1.0.html:46899、46959、46982实际调用bcFpUpdateChannelText；当前Chrome的整条取消、保存失败验收通过。该处更新本页继承口径，不回写PC页面 | none |
| S003 | SPEC/spec.md §4.1第3项；PC/prototype/yestar-friend-picker.js:132固定日期匹配 | 固定日期无法独立表示每天重算的第N天 | updated | 当前R004与§6.4规定共同日期基准和唯一到期节点，固定日期保留为附加AND条件；ADMIN/prototype/admin-revisit-rules-model.js:297起逐好友匹配节点；nodes-model-results.json包含基准切换及附加时间AND通过记录 | none |
| S004 | SPEC/spec.md §4.1第4项；PC/prototype/yestar-friend-picker.js:128双方消息mock | 双方均发生的AND不能当成任一方发生的OR | updated | 当前R005、AC-R003-01及深圳种子分别配置inbound/outbound排除；model.js:267用threeAnd判断both，节点排除用threeOr；模型验收包含48小时边界、任一方向、双方AND、未知及未来消息 | none |
| S005 | SPEC/spec.md §4.1第5项；PC/annex/design-spec-v1.0.md:1556与yestar-friend-picker.js:245–246 | 群发至少选一位好友守卫不能阻断有效但当天0命中的规则保存 | updated | 当前R008与§7.4明确0命中可保存；nodes-browser-results.json的新建/零结果验收通过；PC原有两条精确提示仍在原实现，不修改群发守卫 | none |
| S006 | SPEC/spec.md §4.1第6项与E009的历史引用；OLD-BUSINESS §B/§D（原文件状态draft） | 旧回访类型、20:00兜底、兼职逾期与8分钟重分没有本次共同批准合同 | intentional-history | 当前§4.1和§11明确不继承、不改旧稿；旧文件:3标draft，:65、70、96分别保留旧机制；当前071规则与Admin模块均无这些调度/分配实现。本行仅保留历史来源引用，非全局废止旧业务稿 | none |
| S007 | SPEC/spec.md §4.1第7项与E009的PC历史参考；PC/annex/design-spec-v1.0.md §59.12:2711 | 旧未来30天模拟名单不能代表回访日已确定真实客户 | intentional-history | 当前R012及AC-R012-01明确只作合成日期试算，不生成真实PC名单；旧日期分布明确位于Mock数据规范。本次不改PC日程，其未来mock不作为本页名单证据 | none |
| S008 | SPEC/spec.md §4.1第8项；ADMIN现行README及设计来源说明 | 新管理页不能被计入实站采集或冒充已观察能力 | updated | ADMIN/README.md:3明确797入口=783源队列+13AI扩展+1回访扩展；docs/design-spec.md:7同口径；navigation-snapshot.json中的revisitRules保留mock、prototypeOnly、liveObserved:false；071只说明本地实现 | none |
| S009 | SPEC/spec.md §4.1第9项、E013/E014/E015及history/1.0.0/spec.snapshot.md | 0.2.0至1.0.0以每节点独立顶层规则并整条复制 | intentional-history | 当前§4.1原位置已标被E016/E018替代；旧SPEC/Plan/Tasks/verification仅在history/1.0.0；checks/README.md明确旧脚本不能证明新模型，现行原型使用nodes结构 | none |
| S010 | SPEC/spec.md §4.1第10项与旧v1浏览器配置 | 新模型不能按名称或相同条件静默合并旧数据，旧验证也不能替代1.1验证 | updated | 当前§6.4记录实际v2实现；ADMIN/prototype/admin-revisit-rules.js:23–24分键，:67–86逐条无损映射/显式新草稿；nodes-browser-results.json验证导入保留附加条件、v1不变和损坏存储保护；25项模型与9组Chrome流程通过 | none |
| S011 | SPEC/spec.md §4.1第11项；ADMIN旧revisitStats及回访样式来源 | 回访统计不等于回访规则；旧统计颜色、统计口径与计数不能跨页继承 | updated | 当前§7.3/§10明确独立路由；ADMIN/prototype/admin-content.js:13仍将revisitStats列为统计页；docs/design-spec.md:18–19将旧统计蓝色与新规则绿色分别限定；新增规则只继承Shell、表格及菜单机制 | none |
| S012 | SPEC/spec.md §4.1第12项、E019；当前会话中已撤回的菜单提议 | 不能把撤回的群发规则/移动菜单/全租户入口落实为当前要求 | updated | ADMIN/README.md:19、prd/admin-live-reference.md:31、flowcharts/admin-live-reference.md:33均写最终边界；导航只在深圳group-10有revisitRules；深圳menu的0-revisitRules父级0-42，德三allMenu同key父级0-53；admin-revisit-rules.js:12只挂载深圳 | none |
| S013 | SPEC/spec.md旧§6.4、§10及plan.md/tasks.md旧实施阶段描述 | 尚未实现、未来Plan、未请求完整推送的字样与当前进度冲突 | updated | 原位置改为已实现/本地验证与E020授权；版本仍1.1.0/approved。Tasks分开已完成实施与仍须回执的远端交付任务，不把本地通过写成完整推送成功 | none |
| S014 | SPEC/spec.md E004及本地研究材料引用 | 研究材料不应成为公开SDD、mock或真实能力证据 | updated | 当前E004/§8.3保留业务抽象并明确私聊原文及MCP原始返回留本机；Plan §11及Tasks交付边界排除原始材料。当前模型fixture与验证结果使用demo-f*等合成标识；本轮收敛没有读取或复制私聊原文 | none |
| S015 | ADMIN/prototype/admin-menu-state.js旧previousRows单一基线；深圳menu和德三allMenu缓存 | 使用早于用户缓存revision的旧基线，可能把用户已删菜单误当新项恢复；新增回访入口不能重置旧菜单状态 | updated | 当前admin-menu-state.js:12–14先按saved.dataRevision取menuRefresh.baselines的rows/headers，缺省保留原兼容路径。两JSON已登记9/27来源revision，深圳70行/6列表头、平台104行/9列表头；当前各只多1个回访定义（71/105）。这是R013/068既有保留语义的实现修正，不新增行为；独立功能复测以verification.md实际记录为准 | none |

## 3. Search Proof

以下搜索于2026-09-28在工作区实际执行。命令中的路径简称按§1展开；`:行号`为核查时定位，不将搜索命中本身当作业务批准。

| Search ID | Pattern / Old Term | Scope | Command / Method | Result | Evidence |
|---|---|---|---|---|---|
| Q001 | 部门、checkedChannels、checkedAccounts | SPEC/spec.md与PC/prototype两份源文件 | `rg -n -e checkedChannels -e checkedAccounts -e bcFpUpdateChannelText prototype_v1.0.html`，读取yestar-friend-picker.js:116–145 | 当前渠道/账号各自集合且OR匹配；SPEC已排除员工部门解释，没有本页活动冲突 | PC:46855–46982；yestar-friend-picker.js:136；S001 |
| Q002 | 底部确定/取消、即时回填 | YPC/annex/design-spec-v1.0.md与PC实现 | `rg -n -e 账号级联 -e '确定.*取消' design-spec-v1.0.md`，读取§18.5并对照bcFpUpdateChannelText调用 | 835行确有来源设计差异，071原位置已明确选择当前即时草稿口径；未声称PC源文档已被修改 | YPC:835；PC:46899/46959/46982；S002 |
| Q003 | relative-day、node.day、固定日期 | ADMIN/prototype/admin-revisit-rules-model.js与nodes-model-results.json | `rg -n -e relative-day -e node.day -e 'function evaluate' admin-revisit-rules-model.js`并读取模型结果 | 到期节点与附加日期条件各自存在，相关25项模型检查全部通过 | model.js:145–147、271–278、297起；结果passed:25/failed:0；S003 |
| Q004 | 双方发过消息、both、threeAnd、threeOr | PC/prototype/yestar-friend-picker.js及ADMIN模型 | `rg -n -e 双方发过消息 -e both -e threeAnd -e threeOr`，对照两侧计算 | both保留双方AND，深圳独立两项排除OR；消息未知不当0，未来消息不计，无活动冲突 | PC:128；ADMIN模型:267及节点排除分支；nodes-model-results.json消息验收；S004 |
| Q005 | 请先勾选至少一位好友、请至少选择一位好友、零结果保存 | PC群发实现与SPEC/checks结果 | `rg -n -e 请先勾选 -e 请至少选择一位好友 prototype_v1.0.html yestar-friend-picker.js`，读取nodes-browser-results.json | PC两条守卫完整保留；规则0命中保存独立验收通过 | PC:46104/46134；picker:245–246；浏览器结果第5组；S005 |
| Q006 | 20:00、兼职、8分钟、draft | OLD-BUSINESS与当前SPEC §4.1/§11 | `rg -n -e 20:00 -e 兼职 -e '8.*分钟' -e Status chat-revisit.md`并核查当前模块无对应机制 | 仅作为明确隔离的历史业务引用，不进入071的调度或分配能力 | OLD-BUSINESS:3/65/70/96；S006 |
| Q007 | 未来30天、+30、Mock数据规范 | PC/annex/design-spec-v1.0.md §59.12与SPEC R012 | 读取PC规范:2703–2716及当前AC-R012-01 | -7至+30天明确属旧PC模拟分布；071当前试算没有真实未来名单承诺 | PC:2711；SPEC R012、§10；S007 |
| Q008 | prototypeOnly、liveObserved、797、89 | ADMIN导航、README.md、docs/design-spec.md | `rg -n -e revisitRules -e prototypeOnly -e liveObserved navigation-snapshot.json`并读取README/design来源段 | 新入口是深圳合成扩展，不占741实采页；当前15租户/797入口/89路由与文档一致 | ADMIN/README.md:3；design-spec.md:7；nav:1166起；S008 |
| Q009 | 独立规则、顶层、1.0.0、v1、v2 | SPEC/history、checks/README.md及ADMIN当前模块 | `rg -n -e legacy -e v1 -e v2 admin-revisit-rules.js`并读checks/README.md | 历史1.0限定只作对照；当前只有多节点种子；v1只读、显式导入不自动合并，9组Chrome流程均成功 | UI:23–24/50–52/67–86；nodes-browser-results.json；S009/S010 |
| Q010 | revisitStats、revisitRules、回访统计、群发规则、全租户 | ADMIN/README.md、prd/admin-live-reference.md、docs/design-spec.md、flowcharts/admin-live-reference.md及当前路由 | `rg -n -e revisitStats -e revisitRules -e 群发规则 -e 全租户`，对照导航/两份menu记录与mount限制 | 旧统计、新规则分路由；被撤回提议均以否定或历史方式出现；仅深圳入口、平台定义不自动授予其他租户 | design-spec.md:18–19/87；PRD:31；flowcharts:33；UI:12；S011/S012 |
| Q011 | 未请求完整推送、未来Plan、后续Plan须、不代表1.1.0已实现、入口建议、路由建议 | SPEC/spec.md、plan.md、tasks.md当前文件，不扫描历史快照 | `rg -n -e 未请求完整推送 -e '未来 Plan' -e 后续Plan须 -e 不代表1.1.0已实现 -e 入口建议 -e 路由建议 spec.md plan.md tasks.md` | 0命中；当前实施状态与授权已同步，远端任务仍待实际回执 | SPEC/spec.md §6.4/§10/E020；plan.md §11；tasks.md完整推送阶段；S013 |
| Q012 | 私聊原文、MCP原始返回、demo-f | 当前SPEC/Plan/Tasks与ADMIN模型fixture | 核查当前四份收敛文档的数据边界并读既有模型合成样本；不打开研究原文 | 本轮文档只含业务抽象和合成验证定位，原始证据不属于发布文件清单 | SPEC E004/§8.3；Plan §11；模型getFixtures与demo-f样本；S014 |
| Q013 | baselines、previousRows、previousHeaders、dataRevision | ADMIN/prototype/admin-menu-state.js及data/content/yestar-sz.json、bzds.json | `rg -n -e baselines -e previousRows -e previousHeaders admin-menu-state.js`；Node JSON.parse读取两菜单的revision、基线行/列数及当前行数 | 实际输出深圳基线70行/6列→当前71行、平台104行/9列→105行；两者均命中9/27来源revision，源码先按该revision取基线再兼容旧来源 | menu-state.js:12–14；revision为2026-09-27-live-menu-refresh-staging-v1-public-demo-identities-v1；S015 |

## 4. Verification Gate

- [x] 源SPEC仍为1.1.0/approved，锁定的065@1.1.0、055@1.1.0、068@1.0.0依赖有效。
- [x] §4.1每个冲突来源均在S001–S012逐项记录，实施状态、隐私与菜单升级保留边界另列S013–S015。
- [x] 每行Resolution合法且Evidence非空；跨页面来源明确保留自身作用域，没有假称已修改其他仓。
- [x] Remaining全部为none；后续生产口径Q002–Q005是已批准的原型默认/延期，不是本次来源冲突的未处理项。
- [x] Search Proof覆盖每类旧术语、历史对象模型、最终菜单决定及来源/交付状态。
- [x] 已运行validate-spec.mjs、validate-plan-boundary.mjs及validate-source-convergence.mjs，结果无error。

**结论**：verified（本地来源收敛；不是远端交付完成）  
**审核人**：Codex（按房总已批准1.1.0及E019/E020核对）  
**审核日期**：2026-09-28

## 5. Change Control

- 源SPEC行为或版本变化后，本账本立即stale；任何新增来源必须补入并重新验证。
- 本次仅修正实施/交付事实，不改已批准R-ID、AC-ID、版本、租户或运行边界。
- 1.0.0历史快照及原验证不回写；旧PC设计、统计和业务草稿不作为071实现的旁路合同。
- E020授权完整推送；远端分支/tag/SDD/部署与通知必须分别读取实际结果，Tasks只在有证据后勾选。
- 本期不创建Issue、Handoff或Test Contract，不更新APP/PC开发进度表，不进入生产仓。
