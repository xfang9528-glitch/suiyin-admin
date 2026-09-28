---
ledger_id: CONVERGENCE-SUIYIN-ADMIN-071
spec_id: SPEC-SUIYIN-ADMIN-071
spec_version: 1.2.0
status: verified
prepared_by: "Codex"
prepared_at: 2026-09-28
---

# 回访规则 — Source Convergence Ledger

## 1. 收敛摘要

- **源规格**：`SPEC-SUIYIN-ADMIN-071@1.2.0`，状态approved；本次只进入交付阶段，不改变E021已批准的R001–R015及19项验收。
- **触发**：房总2026-09-28在六艺星补齐和本地验证后再次明确完整推送（E022）；本次授权独立于1.1.0的E020。
- **当前实现**：深圳、成都、北京、广州、杭州、嘉兴六个现有艺星租户均提供`聊天管理 → 回访规则`（`revisitRules`）。一条规则含多个独立节点，共同范围/基准/每日时间/启停，节点复制仅替换条件。六租户menu各自登记，德三allMenu复用唯一平台定义，非艺星不新增。
- **菜单与历史决定**：E019撤回的移动至群发管理、改称群发规则及全租户增加仍不实施；E021明确将范围从深圳扩到现有六艺星。原群发叶子页与旧回访统计各自保留。1.1.0历史合同、收敛及验证保留在history/1.1.0，不回写。
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

§4.1前十二项依次映射S001–S012，第十三项实体来源对应S016，第十四项授权阶段对应S017；S013–S015补充当前实施状态、隐私及菜单升级边界。

| Source ID | Old Source | Conflict / Superseded Rule | Resolution | Evidence | Remaining |
|---|---|---|---|---|---|
| S001 | SPEC/spec.md §4.1第1项、E011及§14的0.1.0/0.1.1历史记录 | 曾把部门理解为人员范围；渠道与账号不能按员工组织树或父子互斥方式解释 | updated | 当前R001、AC-R001-01及§6.4统一为账号群组/工作号；PC/prototype/yestar-friend-picker.js:136为渠道OR账号；ADMIN/prototype/admin-revisit-rules-model.js:80–85按本tenant共同集合取范围并受管理权限限制。动态成员取法仅为Q004原型默认，不升格为生产决定 | none |
| S002 | SPEC/spec.md §4.1第2项；YPC/annex/design-spec-v1.0.md §18.5:835的确定/取消描述 | 来源设计文档与当前PC即时回填不一致 | updated | 当前SPEC明确本页采用即时更新草稿、整条保存/取消。PC/prototype/prototype_v1.0.html:46899、46961等实际调用bcFpUpdateChannelText；当前六租户Chrome及深圳兼容验证通过。该处更新本页继承口径，不回写PC页面 | none |
| S003 | SPEC/spec.md §4.1第3项；PC/prototype/yestar-friend-picker.js:133固定日期匹配 | 固定日期无法独立表示每天重算的第N天 | updated | 当前R004与§6.4规定共同日期基准和唯一到期节点，固定日期保留为附加AND条件；ADMIN/prototype/admin-revisit-rules-model.js:330起逐好友匹配节点；checks/v1.2.0/sz-compatibility-results.json包含基准切换及附加时间AND的本版重跑记录 | none |
| S004 | SPEC/spec.md §4.1第4项；PC/prototype/yestar-friend-picker.js:128双方消息mock | 双方均发生的AND不能当成任一方发生的OR | updated | 当前R005、AC-R003-01及深圳种子分别配置inbound/outbound排除；model.js:299用threeAnd判断both，:374排除用threeOr；1.2.0深圳兼容验证包含48小时、任一方向、双方AND、未知及未来消息 | none |
| S005 | SPEC/spec.md §4.1第5项；PC/annex/design-spec-v1.0.md:1556与yestar-friend-picker.js:245–246 | 群发至少选一位好友守卫不能阻断有效但当天0命中的规则保存 | updated | 当前R008与§7.4明确0命中可保存；nodes-browser-results.json的新建/零结果验收通过；PC原有两条精确提示仍在原实现，不修改群发守卫 | none |
| S006 | SPEC/spec.md §4.1第6项与E009的历史引用；OLD-BUSINESS §B/§D（原文件状态draft） | 旧回访类型、20:00兜底、兼职逾期与8分钟重分没有本次共同批准合同 | intentional-history | 当前§4.1和§11明确不继承、不改旧稿；旧文件:3标draft，:65、70、96分别保留旧机制；当前071规则与Admin模块均无这些调度/分配实现。本行仅保留历史来源引用，非全局废止旧业务稿 | none |
| S007 | SPEC/spec.md §4.1第7项与E009的PC历史参考；PC/annex/design-spec-v1.0.md §59.12:2712 | 旧未来30天模拟名单不能代表回访日已确定真实客户 | intentional-history | 当前R012及AC-R012-01明确只作合成日期试算，不生成真实PC名单；旧日期分布明确位于Mock数据规范。本次不改PC日程，其未来mock不作为本页名单证据 | none |
| S008 | SPEC/spec.md §4.1第8项；ADMIN现行README及设计/验收来源说明 | 新管理页不能被计入实站采集或冒充已观察能力 | updated | 当前导航实读为15租户/802入口/89路由，802=783源队列+13AI扩展+6回访扩展；六个revisitRules均为mock、prototypeOnly:true、liveObserved:false，源采集仍741可见+42隐藏。README:3、design-spec:7、docs/verification/admin-live-reference.md:7已同步；旧796/797库存只在历史区说明，071只说明静态实现 | none |
| S009 | SPEC/spec.md §4.1第9项、E013/E014/E015及history/1.0.0/spec.snapshot.md | 0.2.0至1.0.0以每节点独立顶层规则并整条复制 | intentional-history | 当前§4.1原位置已标被E016/E018替代；旧SPEC/Plan/Tasks/verification仅在history/1.0.0；checks/README.md明确旧脚本不能证明新模型，现行原型使用nodes结构 | none |
| S010 | SPEC/spec.md §4.1第10项与旧v1浏览器配置 | 新模型不能按名称或相同条件静默合并旧数据，旧验证不能替代新版本范围验证 | updated | 当前§6.4记录实际v2与六租户隔离；ADMIN/prototype/admin-revisit-rules.js:25–26按tenant分键，:69起显式旧规则导入；checks/v1.2.0/tenant-browser-results.json验证深圳v1/v2兼容及其他租户不读取深圳状态；25项深圳兼容场景在1.2源码上重跑通过 | none |
| S011 | SPEC/spec.md §4.1第11项；ADMIN旧revisitStats及回访样式来源 | 回访统计不等于回访规则；旧统计颜色、统计口径与计数不能跨页继承 | updated | 当前§7.3/§10明确独立路由；ADMIN/prototype/admin-content.js:13仍将revisitStats列为统计页；docs/design-spec.md:18–19将旧统计蓝色与新规则绿色分别限定；新增规则只继承Shell、表格及菜单机制 | none |
| S012 | SPEC/spec.md §4.1第12项、E019/E021；1.1.0现行文档的仅深圳范围 | E019的撤回不能被误读为永久禁止E021明确要求的六艺星补齐；也不能扩成全部租户 | updated | 六艺星已有且只有一个revisitRules：成都/北京group-9，深圳/广州/杭州/嘉兴group-10；各自menu同步，德三allMenu仅1项。ADMIN模型:9–18白名单、UI:14–16挂载限制；9个非艺星及unknown访问负向验证通过。现行文档更新为六艺星，1.1只在历史中保留 | none |
| S013 | SPEC/spec.md旧§6.4、§10及Plan/Tasks的日常阶段描述 | 已实现内容和新的发布授权仍被描述为待实施或禁止发布 | updated | 原位置更新为六租户本地验证完成及E022新授权，版本仍1.2.0/approved。Tasks保留已完成T001–T008与仍需回执的T009–T011，旧阶段禁令作为历史事实，不将本地PASS当远端成功 | none |
| S014 | SPEC/spec.md E004及本地研究材料引用 | 研究材料不应成为公开SDD、mock或真实能力证据 | updated | 当前E004/§8.3保留业务抽象并明确私聊原文及MCP原始返回留本机；Plan §11及Tasks交付边界排除原始材料。当前模型fixture与验证结果使用demo-f*等合成标识；本轮收敛没有读取或复制私聊原文 | none |
| S015 | ADMIN/prototype/admin-menu-state.js的菜单缓存兼容机制及新增五租户menu库存 | 新入口不能恢复已删项、覆盖旧排序/改名/隐藏或绕过权限；不应为每个租户复制平台定义 | updated | 当前menu-state.js:12–14按saved.dataRevision选择rows/headers基线；新增五租户都保存9/27已发布revision准确快照，成都70→71、北京60→61、广州69→70、杭州74→75、嘉兴69→70。深圳与德三保持71/105行及已有定义；checks/v1.2.0/menu-extension-results.json中52项迁移+14项范围/schema检查共66项PASS | none |
| S016 | SPEC/spec.md §4.1第13项；五店massMessageListYx的reference及深圳示例实体 | reference不是当地实采目录，直接复制深圳实体或共用可变模型会伪造来源或串租户 | updated | 五店JSON实际均state:reference、sampleTenant:yestar-sz；当前model.js:17每tenant独立closure，:21新店ID带tenant前缀，:65起按本店合成地区/人员选项，fixtures和权限独立，深圳旧ID保留。UI:104明确合成与标签库边界；18项模型及15项Chrome验证通过 | none |
| S017 | SPEC/spec.md §4.1第14项；1.1.0 E020授权及1.2.0日常阶段记录 | 上一轮授权不能充当新发布许可，日常阶段禁令也不能覆盖用户随后明确的E022 | updated | 当前E020/E021/E022分别说明历史交付、日常补齐和本次完整推送；SPEC/Plan/Tasks原位置同步E022。history/1.1.0及已发布1.1包保持原样，当前来源账本对应1.2.0；远端、部署、通知任务保持未完成直至真实回执 | none |

## 3. Search Proof

以下搜索于2026-09-28在工作区实际执行。命令中的路径简称按§1展开；`:行号`为核查时定位，不将搜索命中本身当作业务批准。

| Search ID | Pattern / Old Term | Scope | Command / Method | Result | Evidence |
|---|---|---|---|---|---|
| Q001 | 部门、checkedChannels、checkedAccounts | SPEC/spec.md与PC/prototype两份源文件 | `rg -n -e checkedChannels -e checkedAccounts -e bcFpUpdateChannelText prototype_v1.0.html`，读取yestar-friend-picker.js:116–145 | 当前渠道/账号各自集合且OR匹配；SPEC已排除员工部门解释，没有本页活动冲突 | PC:46855–46982；yestar-friend-picker.js:136；S001 |
| Q002 | 底部确定/取消、即时回填 | YPC/annex/design-spec-v1.0.md与PC实现 | `rg -n -e 账号级联 -e '确定.*取消' design-spec-v1.0.md`，读取§18.5并对照bcFpUpdateChannelText调用 | 835行确有来源设计差异，071原位置已明确选择当前即时草稿口径；未声称PC源文档已被修改 | YPC:835；PC:46899/46959/46982；S002 |
| Q003 | relative-day、node.day、固定日期 | ADMIN/prototype/admin-revisit-rules-model.js与checks/v1.2.0结果 | `rg -n -e relative-day -e node.day -e 'function evaluate' admin-revisit-rules-model.js`并读取模型结果 | 到期节点与附加日期条件各自存在，25项深圳模型场景在当前源码上重新通过 | model.js:330起；sz-compatibility-results.json；S003 |
| Q004 | 双方发过消息、both、threeAnd、threeOr | PC/prototype/yestar-friend-picker.js及ADMIN模型 | `rg -n -e 双方发过消息 -e both -e threeAnd -e threeOr`，对照两侧计算 | both保留双方AND，深圳独立两项排除OR；消息未知不当0，未来消息不计，无活动冲突 | PC:128；ADMIN模型:299/374；本版深圳兼容结果；S004 |
| Q005 | 请先勾选至少一位好友、请至少选择一位好友、零结果保存 | PC群发实现与SPEC/checks结果 | `rg -n -e 请先勾选 -e 请至少选择一位好友 prototype_v1.0.html yestar-friend-picker.js`，读取nodes-browser-results.json | PC两条守卫完整保留；规则0命中保存独立验收通过 | PC:46104/46134；picker:245–246；浏览器结果第5组；S005 |
| Q006 | 20:00、兼职、8分钟、draft | OLD-BUSINESS与当前SPEC §4.1/§11 | `rg -n -e 20:00 -e 兼职 -e '8.*分钟' -e Status chat-revisit.md`并核查当前模块无对应机制 | 仅作为明确隔离的历史业务引用，不进入071的调度或分配能力 | OLD-BUSINESS:3/65/70/96；S006 |
| Q007 | 未来30天、+30、Mock数据规范 | PC/annex/design-spec-v1.0.md §59.12与SPEC R012 | `rg -n -F -e '均匀分布 -7 ~ +30' design-spec-v1.0.md`及当前AC-R012-01 | -7至+30天明确属旧PC模拟分布；071当前试算没有真实未来名单承诺 | PC:2712；SPEC R012、§10；S007 |
| Q008 | prototypeOnly、liveObserved、802、89 | ADMIN导航、README.md、docs/design-spec.md | Node JSON.parse遍历navigation-snapshot.json每租户叶子route并统计唯一集合，读取六个revisitRules元数据；核查现行文档来源段 | 实际15租户/802入口/89路由；六回访均mock/prototypeOnly且liveObserved:false，源实采页口径不变 | 源库存783=741+42；合成扩展13+6；verification.md菜单段；S008 |
| Q009 | 独立规则、顶层、1.0.0、v1、v2 | SPEC/history、checks/README.md及ADMIN当前模块 | `rg -n -e legacy -e 'v1:' -e 'v2:' admin-revisit-rules.js`并读本版模型/浏览器结果 | 旧对象模型只作历史；当前多节点仍兼容深圳v1/v2，新增五租户不读深圳存储，实际15组Chrome流程通过 | UI:25–26/69起；checks/v1.2.0/tenant-browser-results.json；S009/S010 |
| Q010 | 仅深圳、只在深圳、不扩展其他租户、revisitStats、群发规则 | ADMIN/README.md、CLAUDE.md、prd/admin-live-reference.md、docs/design-spec.md、flowcharts/admin-live-reference.md及当前路由 | `rg -n -e '仅.*深圳' -e '只.*深圳' -e '不扩展.*其他租户' -e revisitStats -e 群发规则`并对照菜单/挂载限制 | 当前回访范围改为六艺星；原仅深圳文案只留1.1历史或其他页面自身范围，旧统计独立，改名/移动/非艺星扩展均不实施 | 现行五文档071段与UI:14–16；AC-R013-01/02；S011/S012 |
| Q011 | 未请求完整推送、未来Plan、未实现、E020/E021/E022、source-convergence | SPEC/spec.md、plan.md、tasks.md当前文件，不扫描历史快照 | `rg -n -e 完整推送 -e E022 -e '未来 Plan' -e 后续Plan须 -e 不代表1.1.0已实现 spec.md plan.md tasks.md`逐项核对阶段 | 过时待实施措辞已清理；日常未授权仅作历史事实，当前依据E022，远端任务仍保持未完成 | SPEC E022/§10；Plan §11；Tasks T008–T011；S013/S017 |
| Q012 | 私聊原文、MCP原始返回、demo-f | 当前SPEC/Plan/Tasks与ADMIN模型fixture | 核查当前四份收敛文档的数据边界并读既有模型合成样本；不打开研究原文 | 本轮文档只含业务抽象和合成验证定位，原始证据不属于发布文件清单 | SPEC E004/§8.3；Plan §11；模型getFixtures与demo-f样本；S014 |
| Q013 | baselines、previousRows、dataRevision、revisitRules | ADMIN/prototype/admin-menu-state.js及七份content JSON | `rg -n -e baselines -e previousRows admin-menu-state.js`；Node读取五新增tenant、深圳menu与德三allMenu基线/当前行数和revisitRules数量 | 五新增菜单各仅+1并保留精确revision基线；深圳71、德三105行不变，德三只1个平台定义；66项迁移/范围验收PASS | 9/27基线revision；五新增为70→71/60→61/69→70/74→75/69→70；menu-extension-results.json；S015 |
| Q014 | reference、sampleTenant、tenantProfiles、createModel、identity、forTenant | 五新增tenant的massMessageListYx及ADMIN模型/UI | Node读取五份JSON的state/sampleTenant；`rg -n -e createModel -e tenantProfiles -e identity admin-revisit-rules-model.js`并读取UI说明 | 五店群发均reference、sampleTenant=yestar-sz；新模型独立闭包/实体ID/权限/选项，UI明示合成且不冒充门店标签库；18项模型PASS | model.js:9–21/33–34/65起/252–255；UI:104；tenant-model-results.json；S016 |
| Q015 | 1.1.0历史快照、source-convergence、E022 | SPEC/history/1.1.0与当前四份合同 | 列出history/1.1.0；核对当前frontmatter版本、E022及Tasks交付勾选 | 历史SPEC/Plan/Tasks/收敛/验证均保留；当前合同和账本锁1.2.0，发布/部署/通知无预写成功 | history/1.1.0/spec.snapshot.md及原收敛；当前Tasks T009–T011；S017 |
| Q016 | 071旧版链接、797、仅深圳回访、1个深圳回访、yestar-sz加revisitRules | ADMIN全仓现行Markdown；排除docs/sdd和docs/history不可变包 | `rg -n --glob '*.md' --glob '!docs/sdd/**' --glob '!docs/history/**'`逐项用-e匹配上述旧词及071@1.1.0 | 仅2处有意历史命中：flowcharts:33记录1.0模型被1.1替代且1.2继承；docs/verification:54明确797属于1.1历史而当前802。当前071旧版链接和仅深圳入口指令0残留 | ADMIN/flowcharts/admin-live-reference.md:33；docs/verification/admin-live-reference.md:54；S008/S012 |

## 4. Verification Gate

- [x] 源SPEC仍为1.2.0/approved，锁定的065@1.1.0、055@1.1.0、068@1.0.0依赖有效。
- [x] §4.1前十二项逐条映射S001–S012，新增第十三/十四项对应S016/S017；状态、隐私与菜单迁移另列S013–S015。
- [x] 每行Resolution合法且Evidence非空；跨页面来源明确保留自身作用域，没有假称已修改其他仓。
- [x] Remaining全部为none；后续生产口径Q002–Q005是已批准的原型默认/延期，不是本次来源冲突的未处理项。
- [x] Search Proof覆盖每类旧术语、历史对象模型、最终菜单决定及来源/交付状态。
- [x] 已运行validate-spec.mjs、validate-plan-boundary.mjs及validate-source-convergence.mjs，结果无error。

**结论**：verified（本地来源收敛；不是远端交付完成）
**审核人**：Codex（按房总已批准1.2.0及E021/E022核对）
**审核日期**：2026-09-28

## 5. Change Control

- 源SPEC行为或版本变化后，本账本立即stale；任何新增来源必须补入并重新验证。
- 本次仅修正实施/交付事实，不改已批准R-ID、AC-ID、版本、租户或运行边界。
- 1.0.0和1.1.0历史快照、已发布版本包及原验证不回写；旧PC设计、统计和业务草稿不作为071实现的旁路合同。
- 本次依据E022完整推送授权；E020只属于1.1.0。远端分支/tag/SDD/部署与通知必须分别读取实际结果，Tasks只在有证据后勾选。
- 本期不创建Issue、Handoff或Test Contract，不更新APP/PC开发进度表，不进入生产仓。
