---
ledger_id: CONVERGENCE-SUIYIN-ADMIN-071
spec_id: SPEC-SUIYIN-ADMIN-071
spec_version: 1.3.1
status: verified
prepared_by: "Codex"
prepared_at: 2026-09-28
---

# 回访规则 — Source Convergence Ledger

## 1. 收敛摘要

- **源规格**：`SPEC-SUIYIN-ADMIN-071@1.3.1`，状态approved；本次依据E029进入交付阶段，不改变E023–E028已批准的R001–R019及24项验收。
- **触发**：房总2026-09-28在15项基准的本地验证后明确完整推送（E029）；E020/E022分别是1.1.0/1.2.0历史授权，不代替本次授权。
- **当前实现**：六个现有艺星租户沿用`聊天管理 → 回访规则`（`revisitRules`）与多节点模型。现有下拉提供5日期、4等级、6个首次/最近一次事件选项，共15项；仅等级保留人工/AI来源小控件，事件不再另选次数。模型继续用原anchor和anchorOccurrence配对表达三类事件，21项选中/26项排除、节点复制、账号范围、每日时间及启停均保留。
- **菜单与历史决定**：E019撤回的移动至群发管理、改称群发规则及全租户增加仍不实施；E021确定的六艺星范围不再扩张。原群发叶子页、旧回访统计、六店menu及德三唯一allMenu定义保持。1.0/1.1/1.2/1.3历史合同及已发布包不回写；旧1.2收敛与验证已逐字备份至history/1.2.0。
- **完成含义**：本账本只确认本次来源引用与现行静态合同已收敛，不确认远端分支、tag、SDD包、部署或通知已成功。完整推送完成必须由实际回执证明。
- **来源边界**：旧PC设计与历史业务草稿仅作为被引用对象核查。本次未修改PC仓或业务草稿；它们在原页面的行为不因071改变，不能被071继承为调度、分配或统计能力。`updated`行明确指出本次更新的071引用或Admin现行文档；`intentional-history`仅用于已明确隔离的历史引用/快照。
- **隐私**：私聊原文、账号标识和MCP原始返回不进入本账本、原型mock或交付包。只保留经抽象的业务条件与本地合成验证。

为使本机核查可重复，以下路径简称固定为：

| 简称 | 绝对路径 |
|---|---|
| SPEC | https://github.com/xfang9528-glitch/suiyin-admin/tree/v2026092803-admin-revisit-anchors/docs/sdd/SPEC-SUIYIN-ADMIN-071/1.3.1 |
| ADMIN | https://github.com/xfang9528-glitch/suiyin-admin/tree/v2026092803-admin-revisit-anchors |
| PC | https://github.com/xfang9528-glitch/suiyin-pc-chat/tree/master |
| YPC | https://github.com/xfang9528-glitch/yestar-pc-chat/tree/master |
| OLD-BUSINESS | OLD-BUSINESS (local-only historical draft) |

## 2. Source Ledger

§4.1既有部门、草稿、时间、组合、提交守卫、旧调度、未来名单、来源、节点模型、统计与菜单冲突继续对应S001–S012；实体来源及历史授权对应S016/S017，状态、隐私与菜单升级对应S013–S015。新增基准、E028直接事件选项、预约名称、独立事件历史、存储兼容及E029授权对应S018–S023。按冲突主题映射，避免新增条目改变段落序号。

| Source ID | Old Source | Conflict / Superseded Rule | Resolution | Evidence | Remaining |
|---|---|---|---|---|---|
| S001 | SPEC/spec.md §4.1部门范围、E011及0.1.0/0.1.1历史记录 | 曾把部门理解为人员范围；渠道与账号不能按员工组织树或父子互斥方式解释 | updated | 当前R001/AC-R001-01统一账号群组和工作号；本次重读PC checkedChannels/checkedAccounts及Admin scopeIds，仍取渠道OR账号并受本tenant管理权限限制。Q004仅为原型默认；源码搜索Q001和同SHA六租户18项结果共同确认 | none |
| S002 | SPEC/spec.md §4.1第2项；YPC/annex/design-spec-v1.0.md §18.5:835的确定/取消描述 | 来源设计文档与当前PC即时回填不一致 | updated | 当前SPEC明确本页采用即时更新草稿、整条保存/取消。PC/prototype/prototype_v1.0.html:46899、46961等实际调用bcFpUpdateChannelText；当前六租户Chrome及深圳兼容验证通过。该处更新本页继承口径，不回写PC页面 | none |
| S003 | SPEC/spec.md §4.1相对时间；PC固定日期匹配 | 固定日期无法独立表示每天重算的第N天 | updated | 当前R004保留共同基准和每好友唯一到期节点，附加固定日期仍AND；本次重读evaluate/daysSinceAnchor并核对checks/v1.3.0/sz-compatibility-results.json的25项结果绑定当前同SHA模型，不伪称本轮重跑 | none |
| S004 | SPEC/spec.md §4.1消息方向；PC双方消息mock | 双方均发生的AND不能当成任一方发生的OR | updated | 当前R005和深圳种子分别配置inbound/outbound排除；本次源码搜索Q004确认both用threeAnd、排除用threeOr；同SHA的1.3.0深圳25项覆盖48小时、双方AND、未知及未来消息，继承有效 | none |
| S005 | SPEC/spec.md §4.1提交守卫；PC设计与群发提交 | 群发至少选一位好友守卫不能阻断有效但当天0命中的规则保存 | updated | 当前R008明确0命中可保存；旧[1.1浏览器证据][H11-browser]保留实际零结果保存记录，当前同SHA模型25项继续覆盖合法零命中；本次Q005核对PC两条精确守卫仍保留，不修改群发逻辑 | none |
| S006 | SPEC/spec.md §4.1第6项与E009的历史引用；OLD-BUSINESS §B/§D（原文件状态draft） | 旧回访类型、20:00兜底、兼职逾期与8分钟重分没有本次共同批准合同 | intentional-history | 当前§4.1和§11明确不继承、不改旧稿；旧文件:3标draft，:65、70、96分别保留旧机制；当前071规则与Admin模块均无这些调度/分配实现。本行仅保留历史来源引用，非全局废止旧业务稿 | none |
| S007 | SPEC/spec.md §4.1第7项与E009的PC历史参考；PC/annex/design-spec-v1.0.md §59.12:2712 | 旧未来30天模拟名单不能代表回访日已确定真实客户 | intentional-history | 当前R012及AC-R012-01明确只作合成日期试算，不生成真实PC名单；旧日期分布明确位于Mock数据规范。本次不改PC日程，其未来mock不作为本页名单证据 | none |
| S008 | SPEC/spec.md §4.1来源；ADMIN现行README及设计/验收说明 | 新管理页不能被计入实站采集或冒充已观察能力 | updated | 本次JSON实际统计15租户/802入口/89路由，六回访均mock且prototypeOnly；源采集口径仍783=741可见+42隐藏，扩展13AI+6回访。现行文档更新071@1.3.1和15选项；本轮只新增演示基准，未实采历史接口 | none |
| S009 | SPEC/spec.md §4.1第9项、E013/E014/E015及history/1.0.0/spec.snapshot.md | 0.2.0至1.0.0以每节点独立顶层规则并整条复制 | intentional-history | 当前§4.1原位置已标被E016/E018替代；旧SPEC/Plan/Tasks/verification仅在history/1.0.0；history/1.0.0/verification.md明确旧脚本不能证明新模型，现行原型使用nodes结构 | none |
| S010 | SPEC/spec.md §4.1节点与旧v1/v2浏览器配置 | 新模型不能按名称或相同条件静默合并旧数据，旧验证不能代替变化部分验证 | updated | UI继续按tenant分v1/v2键并仅显式导入；[1.2六租户浏览器证据][H12-browser]为历史隔离基线。当前checks/v1.3.1/event-option-ui-results.json实际7项覆盖旧合法事件pair回显、取消不迁写和非法pair显式修复；同SHA模型25项与旧5日期兼容继续有效 | none |
| S011 | SPEC/spec.md §4.1旧回访统计；ADMIN revisitStats | 回访统计不等于回访规则；旧统计颜色、统计口径与计数不能跨页继承 | updated | 独立revisitStats与revisitRules路由持续保留；现行design-spec分别限定旧统计蓝色和新规则绿色。本次只扩基准选项，不修改旧统计的字段、样本、权限或菜单 | none |
| S012 | SPEC/spec.md §4.1最终菜单决定；E019/E021 | 撤回移动或全租户扩张不能误读成取消后续明确批准的六艺星范围 | updated | 本次JSON重读仍只有六艺星各1个revisitRules，成都/北京group-9，其余group-10，德三allMenu唯一平台定义不增加业务入口。其余9租户不新增；1.3.1没有菜单文件变化，现行6文档仍为六艺星 | none |
| S013 | SPEC/spec.md §6.4/§10及Plan/Tasks历史日常阶段描述 | 已完成静态实现和新发布授权不能仍被描述为待实施或始终禁止发布 | updated | 原位置更新到1.3.1当前静态实现与E029交付授权；1.3.0/1.3.1日常阶段禁止发布保留为历史事实。实际7项UI检查和同SHA模型证据已具备；远端/部署/通知仍须真实回执，不由本地PASS推断 | none |
| S014 | SPEC/spec.md E004及本地研究材料引用 | 研究材料不应成为公开SDD、mock或真实能力证据 | updated | 当前E004/§8.3保留业务抽象并明确私聊原文及MCP原始返回留本机；Plan §11及Tasks交付边界排除原始材料。当前模型fixture与验证结果使用demo-f*等合成标识；本轮收敛没有读取或复制私聊原文 | none |
| S015 | ADMIN菜单revision兼容及1.2.0新增五租户库存 | 新功能不能恢复已删项、覆盖排序/改名/隐藏或额外复制平台定义 | updated | 本次无菜单业务变更；Q013重读仍按saved.dataRevision选baselines，JSON库存仍802/89。旧[1.2菜单66项][H12-menu]保留52项迁移+14项范围检查，明确仅为不变菜单的历史基线，未声称本轮重跑 | none |
| S016 | SPEC/spec.md §4.1实体来源；五店reference与深圳示例 | reference不是当地实采目录，深圳实体或共用可变模型不能冒充本店事实 | updated | 本次重读五店massMessageListYx仍reference/sampleTenant深圳；六店wechatStatus为本店captured但不提供事件接口证明，客户页广州/杭州/嘉兴仍reference成都。当前每tenant独立closure/实体/权限和合成事件；同SHA六租户18项验证继承，六店下拉另实际7项覆盖 | none |
| S017 | 1.1.0 E020、1.2.0 E022及旧交付合同 | 旧交付授权和完成记录不能直接成为新版本发布授权或新验收 | intentional-history | 1.1/1.2已发布包与history保存原阶段事实；旧1.2来源收敛和verification本次先按原字节备份，SHA见convergence-search-source.json。本期范围与发布分别按E023–E028及E029，新结果不回写旧证据 | none |

| S018 | history/1.2.0/spec.snapshot.md的5日期基准及当前§4.1 | 旧5日期不能继续限定用户明确扩展后的基准，也不能把基准增加算成新增筛选维度 | updated | R016保留旧5日期ID，另有4等级与6直接事件选项；UI15项，模型12类基准及参数配对。fields仍21/26；当前7项UI与同SHA36项基准模型结果分别证明显示层和计算层 | none |
| S019 | history/1.3.0/spec.snapshot.md和旧二级事件取值控件 | 先选事件再选次数已被E028要求的六个直接选项替代 | superseded | UI:168起flatMap生成首次/最近一次到店、购买、划扣，移除独立事件取值控件；现行文档原位置同步15项；旧1.3.0 UI 9项结果只作被替代交互的历史，新UI7项为当前证据 | none |
| S020 | 旧appointment基准标签“未次预约日期”及字段目录 | 新下拉应明确预约日期，但不能重复新增或把日期变成预约创建时间 | updated | model.js:55保留条件来源拼写，:81独立anchors中appointment显示预约日期，仍读dates.appointment；旧ID/计算不迁移，当前7项UI与同SHA36项包含预约兼容；不扩改期/取消/逐条预约行为 | none |
| S021 | 当前等级快照、旧AI历次分析mock、SPEC049@1.1.1三类记录与当前§4.1 | 当前等级不等于成为日期；购买收款与划扣核销独立；已有PC mock不证明六店真实接口 | updated | resolveAnchor:156起分别读取gradeManual/gradeAI与visit/purchase/redemption；未知不猜、空历史none、未来不提前、同值不重置、最近真正进入后不隐式检查当前等级。049:323–329仅提供记录语义，实际导入合同仍延期；本轮合成事件与36项同SHA证据不冒充真实来源 | none |
| S022 | 旧5日期规则与1.3.0 event anchor/anchorOccurrence存储 | UI拆成六项不能使旧合法配对失效，不能打开即改写或将非法参数默认为latest | updated | UI:172–175按旧pair回显，非法pair明确待选择；:193–205仅用户显式选择才写对应pair/清除无关参数。当前7项UI包含保存刷新、取消不迁写、非法pair阻存和修复；v1/v2/tenant/QA键均保留 | none |
| S023 | SPEC/Plan/Tasks的1.3.1日常阶段禁令及E029 | 用户本次完整推送授权应覆盖新交付动作，不能沿用E022或预写远端成功 | updated | 当前E029单独授权1.3.1文档、inline、来源收敛、版本化SDD与原型仓交付；Tasks交付项按回执推进。本账本和verification仅确认本地证据；远端分支/tag/部署/通知不在本账本完成判定内 | none |

## 3. Search Proof

Q001–Q016是原1.2.0真实搜索记录，以下明确哪些为历史证据、哪些已在1.3.1重新核对；不把旧结果改称新测试。本轮实际rg、JSON库存与源码SHA见checks/v1.3.1/convergence-search-source.json；现行文档及公开包检查另见Q017–Q024。路径简称按§1展开，行号为对应记录当时定位。

| Search ID | Pattern / Old Term | Scope | Command / Method | Result | Evidence |
|---|---|---|---|---|---|
| Q001 | 部门、checkedChannels、checkedAccounts | SPEC/spec.md与PC/prototype两份源文件 | `rg -n -e checkedChannels -e checkedAccounts -e bcFpUpdateChannelText prototype_v1.0.html`，读取yestar-friend-picker.js:116–145 | 当前渠道/账号各自集合且OR匹配；SPEC已排除员工部门解释，没有本页活动冲突 | PC:46855–46982；yestar-friend-picker.js:136；S001 |
| Q002 | 底部确定/取消、即时回填 | YPC/annex/design-spec-v1.0.md与PC实现 | `rg -n -e 账号级联 -e '确定.*取消' design-spec-v1.0.md`，读取§18.5并对照bcFpUpdateChannelText调用 | 835行确有来源设计差异，071原位置已明确选择当前即时草稿口径；未声称PC源文档已被修改 | YPC:835；PC:46899/46959/46982；S002 |
| Q003 | relative-day、node.day、固定日期 | ADMIN/prototype/admin-revisit-rules-model.js与[1.2旧包结果][H12] | `rg -n -e relative-day -e node.day -e 'function evaluate' admin-revisit-rules-model.js`并读取模型结果 | 到期节点与附加日期条件各自存在，25项深圳模型场景在当前源码上重新通过 | model.js:330起；sz-compatibility-results.json；S003 |
| Q004 | 双方发过消息、both、threeAnd、threeOr | PC/prototype/yestar-friend-picker.js及ADMIN模型 | `rg -n -e 双方发过消息 -e both -e threeAnd -e threeOr`，对照两侧计算 | both保留双方AND，深圳独立两项排除OR；消息未知不当0，未来消息不计，无活动冲突 | PC:128；ADMIN模型:299/374；本版深圳兼容结果；S004 |
| Q005 | 请先勾选至少一位好友、请至少选择一位好友、零结果保存 | PC群发实现与SPEC/checks结果 | `rg -n -e 请先勾选 -e 请至少选择一位好友 prototype_v1.0.html yestar-friend-picker.js`，读取[1.1旧节点浏览器结果][H11-browser] | PC两条守卫完整保留；规则0命中保存独立验收通过 | PC:46104/46134；picker:245–246；浏览器结果第5组；S005 |
| Q006 | 20:00、兼职、8分钟、draft | OLD-BUSINESS与当前SPEC §4.1/§11 | `rg -n -e 20:00 -e 兼职 -e '8.*分钟' -e Status chat-revisit.md`并核查当前模块无对应机制 | 仅作为明确隔离的历史业务引用，不进入071的调度或分配能力 | OLD-BUSINESS:3/65/70/96；S006 |
| Q007 | 未来30天、+30、Mock数据规范 | PC/annex/design-spec-v1.0.md §59.12与SPEC R012 | `rg -n -F -e '均匀分布 -7 ~ +30' design-spec-v1.0.md`及当前AC-R012-01 | -7至+30天明确属旧PC模拟分布；071当前试算没有真实未来名单承诺 | PC:2712；SPEC R012、§10；S007 |
| Q008 | prototypeOnly、mock、802、89 | ADMIN导航及当前六文档 | 本轮Node JSON.parse遍历navigation-snapshot.json每租户route；记录源码hash | 实际15租户/802入口/89路由；六回访均mock/prototypeOnly，源实采口径仍783=741+42，未新增来源采集 | convergence-search-source.json.inventory；S008 |
| Q009 | 独立规则、顶层、1.0.0、v1、v2 | SPEC/history、history/1.0.0/verification.md及ADMIN当前模块 | `rg -n -e legacy -e 'v1:' -e 'v2:' admin-revisit-rules.js`并读本版模型/浏览器结果 | 旧对象模型只作历史；当前多节点仍兼容深圳v1/v2，新增五租户不读深圳存储，实际15组Chrome流程通过 | UI:25–26/69起；[1.2旧浏览器结果][H12-browser]；S009/S010 |
| Q010 | 仅深圳、revisitStats、群发规则、15项 | ADMIN现行六文档及当前路由 | 本轮全仓Markdown rg，排除docs/sdd与docs/history不可变包；逐条读六文档 | 六艺星范围和独立旧统计保留；改名/移动/非艺星扩展均不实施，新增仅15项直接基准 | convergence-search-docs.json；S011/S012 |
| Q011 | 日常禁止发布、E020/E022/E029、source-convergence | SPEC当前spec/plan/tasks | 本轮rg实际核查完整推送和E029，排除历史快照 | 日常禁令已标历史，当前依据E029；旧E020/E022不替代新授权，远端任务须回执 | convergence-search-source.json Q021；S013/S017/S023 |
| Q012 | 私聊原文、MCP原始返回、demo-f | 当前SPEC/Plan/Tasks与ADMIN模型fixture | 核查当前四份收敛文档的数据边界并读既有模型合成样本；不打开研究原文 | 本轮文档只含业务抽象和合成验证定位，原始证据不属于发布文件清单 | SPEC E004/§8.3；Plan §11；模型getFixtures与demo-f样本；S014 |
| Q013 | baselines、previousRows、dataRevision、revisitRules | ADMIN菜单状态及导航 | 本轮重读menu-state.js基线逻辑及导航库存；核对本轮菜单文件无diff | 菜单机制和802/89保持；[1.2菜单66项][H12-menu]为历史基线，不作本轮重跑 | convergence-search-source.json Q013/inventory；S015 |
| Q014 | reference、sampleTenant、createModel、forTenant | 六店content及ADMIN模型 | 本轮Node读取六店3类页面state/sampleTenant，rg核对工厂及白名单 | 五店群发reference深圳；客户页广州/杭州/嘉兴reference成都；各店账号页captured不证明事件API。合成模型独立，18项同SHA结果继承 | convergence-search-source.json.sourceStatus/hash；checks/v1.3.0/tenant-model-results.json；S016 |
| Q015 | 历史快照、1.2账本字节备份 | SPEC/history与当前合同 | 本轮复制旧1.2账本/verification时仅当目标不存在才复制，并比较SHA | 两份旧1.2文件字节一致，旧历史不覆盖；当前合同另为1.3.1 | convergence-search-source.json.snapshots；S017 |
| Q016 | 旧版071链接、12项、仅深圳回访、事件取值 | ADMIN全仓现行Markdown，排除不可变包 | 本轮rg并核查命中上下文，记录六文档SHA | 现行071链接均指1.3.1；旧1.1/1.2/1.3.0仅历史说明/证据，12项指旧统计/弹层，事件取值仅说明已移除，无活动冲突 | convergence-search-docs.json；S008/S012/S018/S019 |

| Q017 | anchors、appointment、grade-A/B/C/D、21/26 | ADMIN模型/UI及SPEC R016 | rg读取独立anchors与UI flatMap，对照当前UI结果 | 12类模型基准映射15项下拉，原5日期与21/26筛选不变 | convergence-search-source.json Q017/Q018；当前UI7项；S018/S020 |
| Q018 | anchorOccurrence、selectedValue、gradeSource、事件取值 | ADMIN当前UI | rg定位:168–205并核对7项Chrome结果 | 六直接事件选项读写原pair，独立事件控件移除；合法旧pair恢复、非法不静默修复 | convergence-search-source.json Q018；event-option-ui-results.json；S019/S022 |
| Q019 | resolveAnchor、stamp大于at、from等于to、invalid、empty | ADMIN当前模型 | rg读取解析函数，核对当前SHA与1.3.0三份模型结果 | 同SHA36+18+25组继承；未来截断、混合坏历史unknown、等级变化不隐式筛当前值均有实际证据 | convergence-search-source.json Q019/hash；checks/v1.3.0三份模型结果；S021 |
| Q020 | 划扣、独立收款、完整历史、真实导入合同 | SPEC049@1.1.1，仅公开行为合同 | rg读取049相应行，不读私聊/MCP原始材料 | 购买与划扣核销独立，真实导入合同延期；未将PC mock或AI分析时间当真实六店接口 | convergence-search-source.json Q020；S021 |
| Q021 | E029、1.3.1、完整推送 | 当前SPEC/Plan/Tasks | 本轮rg及原位置逐项核对 | 当前单独授权交付，未写远端成功；旧授权和日常禁止发布均保留历史语境 | convergence-search-source.json Q021；S023 |
| Q022 | 071版本入口、15项、首次/最近一次、二级事件取值 | README/CLAUDE/PRD/流程/设计/验收六文档 | 文件SHA加全仓Markdown实际rg，逐条核对旧词 | 六文档当前行为原位收敛；有意历史与无关统计/弹层数量均解释，不新增业务合同 | convergence-search-docs.json；S018–S023 |
| Q023 | 当前模型/UI/CSS与旧证据SHA | ADMIN当前源码及checks/v1.3.0/v1.3.1 | SHA-256与结果JSON逐一比对 | 模型e5f01e95与36+18+25结果完全一致，UI d82845e1与本版7项一致；旧1.3.0 UI hash不同，明确不代替15项验收 | convergence-search-source.json.hashes；verification.md；S018/S019/S022 |
| Q024 | 本机路径、聊天/账号标识、凭据形状 | 预定公开合同/历史及1.3.0/1.3.1检查文本 | 只读扫描候选48文本文件，不打开研究资料；只记文件/行号/类别 | 25处本机路径需公开副本规范化；聊天/账号标识与凭据形状命中0。canonical与历史原字节保留，原始研究/通知回执不在包内 | convergence-search-public-package.json；S014/S023 |

## 4. Verification Gate

- [x] 源SPEC为1.3.1/approved，065@1.1.0、055@1.1.0、068@1.0.0精确依赖不变。
- [x] §4.1全部冲突按主题映射S001–S023；旧17项保留作用域与历史证据，新条目覆盖15项、预约、事件及授权。
- [x] 当前六份主文档已原位收敛，不将历史记录、旧UI测试或模型内部12类解释成当前UI12项。
- [x] Remaining均为none；Q002–Q005/Q008为明示原型默认或延期，不冒充真实生产合同。
- [x] 历史菜单及单文件证据以固定tag远端链接引用；本地模型同SHA继承和本版UI实际检查明确区分。
- [x] 已运行SPEC、Plan边界及Source Convergence三项校验，零error。

**结论**：verified（本地来源收敛；远端交付不由本账本宣称完成）
**审核人**：Codex（依据E023–E029及当前静态证据）
**审核日期**：2026-09-28

## 5. Change Control

- 源SPEC行为或版本变化后，本账本stale；新增来源须补入并重新验证。
- 本次1.3.1完整推送由E029单独授权，不再改变已批准行为或版本；E020/E022仅属于历史交付。
- 1.0/1.1/1.2/1.3原始快照、旧检查及已发布包保持不变。旧1.2账本与验证已按字节保存，当前文件另行维护。
- 公开副本须规范化本机路径为仓内链接或固定版本远端入口，保留可审计的转换说明，不复制研究原文、账号标识、凭据、通知回执。
- 远端branch/tag/SDD、部署与通知必须分别读取实际回执；Tasks仅在证据存在后勾选。本地PASS不是发布成功。
- 本期不创建Issue/Handoff/Test Contract，不更新APP/PC开发进度表，不进入生产仓。

[H11-browser]: https://github.com/xfang9528-glitch/suiyin-admin/blob/v2026092801-admin-revisit-rules/docs/sdd/SPEC-SUIYIN-ADMIN-071/1.1.0/checks/nodes-browser-results.json
[H12]: https://github.com/xfang9528-glitch/suiyin-admin/tree/v2026092802-admin-revisit-tenants/docs/sdd/SPEC-SUIYIN-ADMIN-071/1.2.0
[H12-menu]: https://github.com/xfang9528-glitch/suiyin-admin/blob/v2026092802-admin-revisit-tenants/docs/sdd/SPEC-SUIYIN-ADMIN-071/1.2.0/checks/v1.2.0/menu-extension-results.json
[H12-browser]: https://github.com/xfang9528-glitch/suiyin-admin/blob/v2026092802-admin-revisit-tenants/docs/sdd/SPEC-SUIYIN-ADMIN-071/1.2.0/checks/v1.2.0/tenant-browser-results.json
[H12-model]: https://github.com/xfang9528-glitch/suiyin-admin/blob/v2026092802-admin-revisit-tenants/docs/sdd/SPEC-SUIYIN-ADMIN-071/1.2.0/checks/v1.2.0/tenant-model-results.json
[H12-sz]: https://github.com/xfang9528-glitch/suiyin-admin/blob/v2026092802-admin-revisit-tenants/docs/sdd/SPEC-SUIYIN-ADMIN-071/1.2.0/checks/v1.2.0/sz-compatibility-results.json
