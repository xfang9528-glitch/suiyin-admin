# Source search evidence

日期：2026-09-30（Asia/Shanghai）。目标发布tag：`v2026093001-admin-accounts-menu`。工作目录：`E:/AI 项目/佰智德三/碎银原型/suiyin-admin`。

本文保存实际rg命令及输出；退出码1表示无命中。`--max-columns-preview`仅节略长源码行，其作用点已另读完整函数。来源快照、历史规格和业务数据中的旧词不作为现行显示规则。搜索不证明远端发布或生产上线。

## Q001 — 当前人员称谓与租户Override

命令：

```text
rg -n -e 销售 -e 咨询 -e 三类岗位 README.md CLAUDE.md docs/design-spec.md prd/admin-account-menu-status.md flowcharts/admin-account-menu-status.md prd/admin-live-reference.md flowcharts/admin-live-reference.md prd/tenant-menu-drag.md flowcharts/tenant-menu-drag.md prd/platform-menu-drag.md flowcharts/platform-menu-drag.md prd/ai-assisted-message-stats.md flowcharts/ai-assisted-message-stats.md prd/friend-list.md flowcharts/friend-list.md prd/language-manage.md flowcharts/language-manage.md
```

退出码：0。

```text
flowcharts/admin-account-menu-status.md:1:# 碎银账号、咨询岗位与菜单状态流程
flowcharts/admin-account-menu-status.md:16:    Profile -->|是| Consult[系统人员称谓为咨询 移除两处时间入口]
flowcharts/admin-account-menu-status.md:17:    Profile -->|否| Original[保留原销售称谓 角色与时间设置]
flowcharts/admin-account-menu-status.md:18:    Consult --> Roles[原销售回显线上咨询 提供三类岗位多选]
flowcharts/admin-account-menu-status.md:27:八租户为六个现有艺星及画美西安、傲丽西安。时间入口移除覆盖账号顶部、系统设置及可达表单；历史值不回填、不校验、不随新表单提交。上班记录、在线状态和离开状态可转交保持。用户文本、销售额等指标及其他九租户称谓不改；新增岗位不自动授权。
flowcharts/admin-account-menu-status.md:54:用户本轮工程授权仅覆盖时间入口移除和胶囊两项；账号命名、两新租户及咨询岗位均为本次原型交付范围，不自动扩为工程实施任务。
docs/design-spec.md:3:更新：2026-09-30。新租户、碎银账号名称、时间入口与菜单胶囊执行[076@1.0.1](sdd/SPEC-SUIYIN-ADMIN-076/1.0.1/spec.md)；八租户咨询术语与岗位执行[077@1.0.1](sdd/SPEC-SUIYIN-ADMIN-077/1.0.1/spec.md)。下文跨租户组件说明中的销售为非目标租户原称谓，指定八租户系统人员用语显示为咨询；销售额等业务指标、用户文本和内部数据键不改。
docs/design-spec.md:7:更新：2026-09-28。六个现有艺星租户回访规则执行[071@1.3.1](sdd/SPEC-SUIYIN-ADMIN-071/1.3.1/README.md)，属于用户批准的新设计。2026-09-27录音/喜报三新页、对应入口迁移及本地演示边界继续执行[REFRESH-001@0.2.0](sdd/SPEC-SUIYIN-ADMIN-REFRESH-001/0.2.0/README.md)。各租户菜单拖动及平台/租户优先级执行068@1.0.0；平台拖动继续执行060@1.1.0。预约图表执行062@1.0.0；基线为 051@1.1.0；销售变声统计执行 052@1.2.0，销售使用统计执行 053@1.0.2，全管理页对齐执行 054@1.0.0、055@1.1.0、056@1.0.0；AI费用、分类趋势与专属模型执行058@1.2.0。沿用已确认的使用/变声筛选及 055 R005 全管理表格冻结；[四页发布勘误](sdd/pixel-correction-20260920.md) 保留截图呈现与来源边界。本文替代旧主按钮一律青绿、通用列表和统一分页等推断；不改变各业务统计口径。
docs/design-spec.md:62:| 销售使用/变声统计主操作 | #00c4af，依据2026-09-20用户提供的使用统计实站截图；变声沿用该参照 |
docs/design-spec.md:105:## 碎银账号、咨询称谓与菜单状态
docs/design-spec.md:107:全部租户`salesManage`默认入口、标题、页签与普通/平台菜单行统一显示「碎银账号」。旧`sales`链接仍到同一页，明确自定义菜单名保留。八个目标租户为深圳、成都、北京、广州、杭州、嘉兴艺星及画美西安、傲丽西安；姓名、手机号、微信昵称、筛选、表头、弹窗及统计人员文案称「咨询」。复用既有字体、列宽和弹窗结构，不改字段键与稳定身份。
docs/design-spec.md:109:权限角色继续多选，提供线上咨询、现场咨询、科室助理；原销售回显线上咨询，管理员、财务、渠道主管等保留。打开和取消不写旧数据，保存/刷新一致；失败保留原值和草稿。新增岗位不默认授予菜单权限。两新租户账号与业务区仍待采集，不伪造人员。
docs/design-spec.md:121:实体下拉按当前租户和页面上下文取值；不从参考表格或别的租户借入销售、部门、账号、门店。枚举与业务实体分开。保留搜索、清空、禁用项、回填、Escape 和溢出行为，缺少选项时说明未采集。
docs/design-spec.md:123:日期为可输入文本与共用静态日历，单日一个月，区间两个月。起止作为整体控件布局，手工输入可校验；首次范围选择不自动提交查询，Escape 或外部点击取消未完成选择，重置清除旧弹层。销售使用与销售变声统计完整共用单日/范围分段、日期输入和弹层。单日一个输入，范围两个输入；范围切回单日取开始日并归并起止。模式或输入只修改草稿；快捷日立即查询且保留模式，重置回单日今天并提交。两页日期初值分别来自本租户快照日与合成事件运行日，不能为视觉一致改写来源。
docs/design-spec.md:129:销售使用统计采用专用六列表；1486px源视口下列宽约72 / 228 / 263 / 207 / 226 / 150px，其他宽度按实际容器分配，避免旧最小宽度强制造成横向溢出；消息数、聊天好友数右对齐。正文行约 40.1px，只保留横向边线；部门为 20px 高的蓝色标签（背景 #ecf5ff、边框 #d9ecff、文字 #409eff）。同销售跨部门用组与 rowspan 表示，多部门有小计，小计背景 #f6f8fa，tfoot 全表合计保留在最后。排序整组移动，不拆散明细；没有分页。
docs/design-spec.md:133:销售变声统计保留与使用统计共享的分段、日历、快捷日、部门与搜索/重置/导出，并补回本轮已见的销售姓名筛选，1486px源视口下为两行120px筛选区。历史同结构筛选截图字节一致仅适用于2026-09-20版本，不能作为本轮新增姓名框后的整区相同声明。业务列仍是序号、销售、部门、变声使用次数，保留次数排序、20 条默认分页及全筛选导出；使用统计的消息/好友列及无分页结构不迁入变声页。
docs/design-spec.md:141:列表一行代表一条规则，按名称/目的、账号范围、回访基准与节点概览、每日筛选、状态、编辑/启停/试算呈现；第3/5/7天显示为同一行内的节点入口。整页编辑上方设置共享名称、目的、基准和每日时间，账号范围先显示已选摘要，展开后继续使用群组/账号两列选择，保留搜索、多选和当前结果全选。群组与单账号取并集；若只要部分账号，先取消群组。这里的群组是渠道归属，不额外增加咨询部门选择。
docs/design-spec.md:143:回访基准保留当前位置、宽度与现有编辑结构，在同一下拉直接列15项：末次咨询日期、添加日期、建档日期、预约日期、末次回访日期；成为A/B/C/D级；首次到店、最近一次到店、首次购买、最近一次购买、首次划扣、最近一次划扣。等级选择后仅显示人工/AI小控件，初值人工；六个事件选项自身已明确次数，不再显示“事件取值”下拉。21/26条件选择器保持原目录，不能混入新事件基准。
docs/design-spec.md:151:保存到当前tenant的v2键，QA另用独立前缀；切换租户不能串读账号、规则或试算结果。深圳原API、稳定ID和v1/v2键及内容保持兼容，其他五店不读取深圳存储初始化。原5日期无需新参数且ID不变，appointment仅在基准显示为预约日期，原筛选拼写保留。合法旧事件配对回显为6个直接选项，打开或取消不写存储；非法/缺失次数显示“请选择有效的回访基准”并要求显式修复，不默认成首次或最近一次。v1只读保留并经明确选择开始新版或逐条导入草稿；唯一日期relative-day才可转出基准与单节点，附加条件保留，歧义说明原因。损坏或存储失败先报错与重试，不静默替换或先报成功；新增菜单按缓存revision对应的已发布基线迁移，保留本地删除、隐藏、改名与排序，不重激活深圳既有迁移。咨询接待权限交集仅是后续PC合同，规则不授予权限；本页不接真实权限、客户数据、定时任务、发送、共享存储或PC名单实现。
docs/design-spec.md:165:- **拉新记录**：本轮7租户各自已采确认空态；32px控件，具体字段和列宽按本租户来源。深圳历史日期260px、微信号240px、重复添加/好友状态各120px仅用于对应布局。查询、重置、绿色描边导出位于第二行。七列表格充满余下视口，白色空态和右下分页保留。列宽按当前实测结果，不复用销售使用表；好友弹层与触发器对齐。微信号及重复添加仅展示已采选项，不能补猜。
docs/design-spec.md:167:- **AI 辅助统计**：快捷日期置前，单行筛选可真实水平滚动；日期 320px、部门 140px、账号关键词 180px。控件约 24px，维度为相邻分段按钮，绿色搜索为 #07c160。九列表格以灰表头、约 41.8px 正文行和水平边线呈现；销售名加粗，多部门以灰色多行标签显示，辅助率含绿色进度条与百分比。截图部分样本说明放于结果末尾，不另加顶部标题或汇总卡。
docs/design-spec.md:173:- 聊天：全部聊天与销售接待查询各自保留筛选及初态；销售接待未查询前不显示伪造结果。演示会话显式区分。
docs/design-spec.md:174:- 销售统计：恢复 12 指标、4 排行及相应图表槽；8 处明细未采集的图表显示说明，不绘制猜测走势。
flowcharts/admin-live-reference.md:3:更新：2026-09-30。账号名称、八租户时间入口、菜单胶囊和咨询岗位见[本轮流程](admin-account-menu-status.md)，执行076@1.0.1与077@1.0.1。下列跨租户流程中的销售称谓在指定八租户显示为咨询；稳定身份、计算口径和其他租户称谓保持。
flowcharts/admin-live-reference.md:40:原始快照中的加载中不能判成确认空态。新窗口被浏览器阻止时提供目标链接。参考内容不授权跨租户借入实体选项；销售使用统计和 AI辅助统计没有参考租户数据回退。四页旧默认视图保留为历史，见 [2026-09-20发布勘误](../docs/sdd/pixel-correction-20260920.md)。
flowcharts/admin-live-reference.md:164:    Included -. 后续PC权限合同 .-> Permission[与咨询当前账号接待权限取交集]
flowcharts/admin-live-reference.md:220:## 销售变声统计
flowcharts/admin-live-reference.md:238:    Time --> Aggregate[发起销售稳定身份及事件部门汇总]
flowcharts/admin-live-reference.md:244:单日仅显示开始日；范围显示起止日，切回单日以开始日归并起止。日期和部门编辑、模式切换不提前查询；非法范围保留已有结果。多工作账号归属同一销售，消息发送是否成功不改变计数。读取错误显示重试，不能将失败显示为全员 0。两页筛选一致不混用数据：变声基于本租户合成事件的运行日，使用统计基于本租户快照日。
flowcharts/admin-live-reference.md:246:## 销售使用统计
flowcharts/admin-live-reference.md:250:    Entry[销售使用统计] --> Model{本租户专用快照}
flowcharts/admin-live-reference.md:256:    Complete -->|是| Groups[销售组及部门明细]
flowcharts/admin-live-reference.md:257:    Groups --> Sort[按销售组汇总排序 组内不拆散]
flowcharts/admin-live-reference.md:312:    Route[选择领域路由] --> Chat[聊天按各自初态 销售接待先查询]
flowcharts/admin-live-reference.md:314:    Route --> Dashboard[销售统计12指标及4排行]
CLAUDE.md:3:更新：2026-09-30。[076@1.0.1](docs/sdd/SPEC-SUIYIN-ADMIN-076/1.0.1/README.md)登记画美/傲丽两西安租户、全部租户「碎银账号」名称、八租户时间入口移除与菜单状态胶囊；[077@1.0.1](docs/sdd/SPEC-SUIYIN-ADMIN-077/1.0.1/README.md)定义八租户咨询称谓及线上咨询、现场咨询、科室助理三类岗位。两新租户只有独立最小框架，真实账号/业务仍待采集，不扩散艺星回访及辅助线能力。见[产品说明](prd/admin-account-menu-status.md)与[流程](flowcharts/admin-account-menu-status.md)。
CLAUDE.md:9:2026-09-27新增录音/喜报三页及对应入口迁移由[REFRESH-001@0.2.0](docs/sdd/SPEC-SUIYIN-ADMIN-REFRESH-001/0.2.0/README.md)承接；当前基线为 SPEC-SUIYIN-ADMIN-051@1.1.0；本轮销售变声统计 052@1.2.0、使用统计纠偏 053@1.0.2、全页对齐 054@1.0.0、055@1.1.0、056@1.0.0 分别拥有自己的行为范围；AI费用、分类趋势与专属模型执行 058@1.2.0。预约记录总量、每日柱形与期间累计折线执行062@1.0.0；仅现有四个入口，保留默认列表及全量筛选，源样本与合成演示分离。先读 README.md、docs/design-spec.md 和相应版本化 SDD。050 仅在未被后续合同替代的导航范围内适用。当前筛选与表头冻结见 [验收记录](docs/verification/filters-sticky-20260920.md)；上一轮四页截图纠偏与证据边界见 [发布勘误](docs/sdd/pixel-correction-20260920.md) 和 [实测记录](docs/verification/pixel-correction-20260920.md)。
CLAUDE.md:22:- `admin-account-profile.js`：076默认账号名称与八租户时间字段能力；077八租户系统称谓与角色适配。按tenant和稳定route处理，保留字段键、自由文本、统计口径和其他角色，不全仓替换销售。
CLAUDE.md:46:5. 实体选项严格租户及页面边界。来源说明区分本租户采样、部分样本、参考、演示、未采集；加载中不是确认空态。销售使用与 AI 专用统计不跨租户回退。深圳 AI 为 22 行截图部分样本，多部门缺分配时不向首部门归数；拉新仅对已采日期及条件显示真实零条。
CLAUDE.md:47:6. 变声首次成功独立任务计 1，失败/试听/同任务重试不重复计。其日期与部门继续复用使用统计的单日/范围、日历、快捷日和搜索/重置/导出，本轮追加源已见销售姓名框；模式和输入为草稿，快捷日立即查询并保留当前模式，重置回单日今天。两页保留各自来源，不用样本日替换运行日。使用统计无分页，销售组排序不拆散小计，CSV 不重复计合计；变声保留次数分页与全筛选导出。
CLAUDE.md:51:10. 既有销售变声工程已创建 [管理页销售变声统计 #401](https://github.com/PetWebOrg/suiyin-admin/issues/401)：深圳艺星 / ZHONG / PC，负责人陈宣宇（cxy-chenxuanyu），绑定 052@1.2.0。工程覆盖生产租户注册表中全部适用租户；本原型 15 个租户仅为验证清单，不能限制生产范围。状态与测试映射以远端 Handoff 为准；此授权不等于在本仓流程中实现生产代码或将全部表格冻结扩成另一个工程任务。
CLAUDE.md:57:13. 原5日期anchor ID与计算保持，appointment基准显示“预约日期”，21/26条件的源拼写“未次预约日期”保留；不改成预约创建时间。旧事件的anchor与anchorOccurrence合法配对映射到6个直接选项，打开/取消不迁写；次数缺失或非法显示“请选择有效的回访基准”，必须显式修复，不默改首次或最近一次。回访存储使用 `admin-revisit-rules:v2:<tenant>`，六艺星的账号、人员、地区、好友、规则与状态均按tenant隔离，不把其他租户或深圳的实体作为缺省值。新增五店使用独立合成示例并明确标识；深圳既有模型API、稳定ID及原存储键和值保持兼容。`qa=1`使用独立 `admin-qa-` 前缀；旧v1键只读保留，不静默清除或自动合并。逐条导入只有唯一明确的日期relative-day条件才能转为基准与单节点，其余条件保留，先成为未启用草稿；不明确时说明原因。保存失败不改变已存规则，损坏数据先重试或明确恢复。咨询结果按当前账号接待权限可见是合同，不代表PC名单界面、真实调度、共享持久化或发送已经实施。
CLAUDE.md:63:16. 话术使用2026-09-29本轮15租户数据，1246分类节点、42已采列表分类、155列表样本、48已采详情和16媒体占位。同名分类保留不同身份，搜索保留匹配祖先；不默认选首条。未采分类/正文/部门/销售/商品选项分别保留`not-captured`，不填其他租户内容或把缺失当空值事实。当前冻结树内`n0`等ID稳定；后续重新采集若改变节点顺序，必须处理身份迁移，不按新序号盲合并旧本地修改。`captureRevision`更新采用字段级本地覆盖，保存、取消、刷新和租户隔离继续校验。`sanitize-public-data.mjs --check`必须检查独立话术数据，不能将其再次替换为统一演示文本。
CLAUDE.md:69:19. 076/077目标租户为 `yestar-sz,yestar,yestar-bj,yestar-gz,yestar-hz,yestar-jx,huamei-xian,aoli-xian`。账号顶部与系统设置不显示或提交上下班时间，旧配置保留但不回填UI；其他九租户保持。系统人员称谓使用咨询，销售额、销售金额、销售量、销售收入等指标及用户文本不改。旧销售角色显示为线上咨询，三类岗位可多选，其他角色保留；打开/取消不迁写，失败保留草稿，不吞并原多角色。
prd/ai-assisted-message-stats.md:3:2026-09-30术语适配：按[077@1.0.1](../docs/sdd/SPEC-SUIYIN-ADMIN-077/1.0.1/spec.md)，六艺星及画美/傲丽的系统人员称谓显示为咨询，其他租户仍为销售；下文共享业务定义与历史采集值不改。画美/傲丽仅有最小待采集框架，不据此新增本页权限、数据或菜单。
prd/ai-assisted-message-stats.md:11:管理者需要区分销售消息来自 AI 直发、AI 参考还是手动录入，了解团队 AI 使用构成。此统计只描述使用量，不证明客户等级、到店率、成交率或 AI 因果效果。
prd/ai-assisted-message-stats.md:13:新增的 [AI费用统计](ai-cost-stats.md) 执行058@1.2.0，以业务分析任务和独立对客费用记录展示用量与金额。本页仍只统计销售消息来源，AI直发/AI参考不能作为模型调用次数或直接乘价换算费用；两页保留各自入口、筛选、来源与权限语义。
prd/ai-assisted-message-stats.md:17:1. 对象为当前租户、查询日期内，销售在单聊发出的文本消息。
prd/ai-assisted-message-stats.md:31:- 九列保留序号、销售账号、所属部门、AI 直发、AI 参考、手动文本、AI 辅助合计、AI 辅助率、成功消息总数。销售名加粗，部门灰标签可换行，辅助率显示绿色条与百分比；成功消息总数另列，不是辅助率分母。
README.md:5:2026-09-30按[076@1.0.1](docs/sdd/SPEC-SUIYIN-ADMIN-076/1.0.1/README.md)与[077@1.0.1](docs/sdd/SPEC-SUIYIN-ADMIN-077/1.0.1/README.md)新增画美医美-西安、傲丽医美-西安；全部租户账号入口统一为「碎银账号」。六个现有艺星及这两租户的系统人员称谓为「咨询」，原销售角色回显为「线上咨询」，另有「现场咨询」「科室助理」可多选，其他角色和既有权限保留。同一八租户移除账号顶部与系统设置的上下班时间入口；上班记录、在线状态和「离开状态可转交」保持。普通/平台菜单状态在表内直接选「显示 / 隐藏」并保存，失败回滚，原作用范围不变。两新租户只有独立最小原型框架，真实菜单、账号和业务资料待采集，不扩散艺星回访或辅助线能力。见[产品说明](prd/admin-account-menu-status.md)与[流程](flowcharts/admin-account-menu-status.md)。
README.md:25:账号群组表示渠道归属；应回访好友仅对具有其所属账号接待权限的咨询可见。当前仅交付管理页和权限行为合同，PC真实名单、真实定时筛选、自动发送及执行质检均未实施。示例试算使用本租户独立的固定合成数据，已排除、未入选和无法判断分别显示；新增五店不借用深圳账号、人员或好友充当该店事实。规则只在当前浏览器按租户保存；深圳既有稳定ID、用户规则和菜单调整保留，新版v2与旧版v1分开，旧规则只读保留，可明确开始新版示例或逐条导入未启用草稿，不自动猜测合并。
README.md:40:| 专用统计及主列表尾差 | 初轮107项、最终补充81项几何通过；后者包括厚全商品榜、成都拉群、瑞熙小周统计、销售管理及全部账号状态 |
README.md:49:| [077@1.0.1](docs/sdd/SPEC-SUIYIN-ADMIN-077/1.0.1/README.md) | 八租户咨询称谓与三类岗位；原销售默认线上咨询，多选与其他角色保留，不定义岗位差异权限 |
README.md:55:| [053@1.0.2](docs/sdd/SPEC-SUIYIN-ADMIN-053/1.0.2/README.md) | 销售使用统计分组、日期、部门、小计/合计及租户隔离 |
README.md:63:变声页保留本轮已见的人员姓名筛选（八目标租户称咨询，其余称销售），仍按稳定销售身份计次，姓名相同不合并。销售使用统计只读取本租户专用快照；未知日期或未采集时保留表头与说明，不补0或借其他租户总量。工作账号样本汇总不冒充跨账号去重人数。
README.md:73:原型发布不等于生产上线。073的既有Admin工程Issue为[#442](https://github.com/PetWebOrg/suiyin-admin/issues/442)，负责人王梓先（`build996`），提出环境佰智德三、提出人房昕，当前为`status:todo`；执行以[073交接合同](docs/sdd/SPEC-SUIYIN-ADMIN-073/1.0.0/issue-handoff.md)与[Test Contract](docs/sdd/SPEC-SUIYIN-ADMIN-073/1.0.0/test-contract.md)为准。既有销售变声[#401](https://github.com/PetWebOrg/suiyin-admin/issues/401)、AI费用[#402](https://github.com/PetWebOrg/suiyin-admin/issues/402)、预约图表[#404](https://github.com/PetWebOrg/suiyin-admin/issues/404)、租户菜单[#432](https://github.com/PetWebOrg/suiyin-admin/issues/432)仍由各自精确合同承接。当前17租户是原型验证清单，不是生产白名单；本轮工程只交接时间入口移除与菜单状态胶囊，两新租户登记和077术语/角色不扩为工程任务。不更新开发进度表。
prd/admin-live-reference.md:3:更新：2026-09-30。账号及菜单变化见[碎银账号、咨询与菜单状态](admin-account-menu-status.md)，执行076@1.0.1与077@1.0.1。下文跨租户统计说明沿用非目标租户销售称谓；六艺星及画美/傲丽系统人员文案改为咨询，业务口径、数据键与用户文本不变。
prd/admin-live-reference.md:7:更新：2026-09-28。六个现有艺星租户回访规则执行 [071@1.3.1](../docs/sdd/SPEC-SUIYIN-ADMIN-071/1.3.1/README.md)。2026-09-27录音/喜报三页、对应入口迁移及本地演示边界继续执行 [REFRESH-001@0.2.0](../docs/sdd/SPEC-SUIYIN-ADMIN-REFRESH-001/0.2.0/README.md)；既有页面刷新继续原合同。各租户菜单拖动与导航联动执行068@1.0.0，平台拖动继续按060@1.1.0；预约记录图表按062@1.0.0。本文件汇总已批准合同，不另立业务规则：051@1.1.0 为十五租户基线；052@1.2.0 为销售变声统计；053@1.0.2 为销售使用统计；054@1.0.0、055@1.1.0、056@1.0.0 为全管理页证据对齐；058@1.2.0 为AI费用、分类趋势与专属模型。版本化合同从 [README](../README.md) 进入；四页截图恢复的历史边界见 [2026-09-20 发布勘误](../docs/sdd/pixel-correction-20260920.md)。
prd/admin-live-reference.md:27:| 销售统计仪表盘 | 12 项指标、4 张排行榜、相应图表区域与快照日期 | 8 处图表缺逐点数据，只显示未采集提示；其他日期或实体无样本不编数 |
prd/admin-live-reference.md:32:| 全部聊天、销售接待查询 | 各自筛选和初始状态；销售接待在查询前等待条件 | 公开演示会话与采集事实分开，不搬运敏感客户聊天，不真实发送 |
prd/admin-live-reference.md:84:| 原有日期（5项） | 末次咨询日期、添加日期、建档日期、预约日期、末次回访日期；原ID和日期值语义保持 |
prd/admin-live-reference.md:101:| 日期（5项） | 末次咨询日期、添加日期、建档日期、未次预约日期、末次回访日期 |
prd/admin-live-reference.md:112:咨询可见合同为“应回访好友集合 ∩ 当前咨询有接待权限的账号”；无账号接待权限就不能看到其好友，失去权限后也不能凭历史生成结果继续访问，多名有权咨询均可见。当前交付管理页和该权限合同；PC名单界面、真实调度、权限服务、共享数据库、发送、执行质检和完成状态协作仍未实施。
prd/admin-live-reference.md:114:## 销售变声统计
prd/admin-live-reference.md:116:行为合同：[052@1.2.0](../docs/sdd/SPEC-SUIYIN-ADMIN-052/1.2.0/spec.md)。原15个登记租户在「数据展示」拥有变声统计菜单定义（八目标租户称咨询，其余称销售；新两租户不补未采菜单），位置在销售使用统计附近；可见性继续受既有父级及权限配置约束，不自动开通变声账号。
prd/admin-live-reference.md:118:- 日期与部门筛选继续复用销售使用统计：统计时间、单日/范围分段、对应日期输入和日历、今天/昨天/前天、部门、搜索/重置/导出；字段顺序、颜色、图标、尺寸、间距、焦点和取消反馈一致。单日只显示一个日期，范围显示起止日期；范围切回单日取开始日并将起止归为同日。
prd/admin-live-reference.md:119:- 本轮补回来源已见的销售姓名框；姓名按本地包含匹配筛选，重名销售仍按稳定身份区分。模式和日期、部门、姓名编辑只改草稿，搜索才提交；快捷日按 Asia/Shanghai 运行当日计算，立即查询并保留当前模式。重置回单日、今天、全部授权部门及默认排序并立即查询。非法日期不覆盖旧结果，日历 Escape 或外部点击取消不提交。
prd/admin-live-reference.md:120:- 表格展示序号、销售、部门、变声使用次数；次数数值排序，默认每页 20 条，导出包含全部筛选结果。
prd/admin-live-reference.md:122:- 以首次成功自然日、发起销售稳定身份及当时部门归属汇总，多工作账号归同一销售；不按显示名合并，不因转组改写历史。
prd/admin-live-reference.md:123:- 有效零次数、无匹配销售、加载、失败重试和无权限分别表达。页面全部使用有来源说明的合成事件，不表示真实使用量。
prd/admin-live-reference.md:127:## 销售使用统计
prd/admin-live-reference.md:129:行为合同：[053@1.0.2](../docs/sdd/SPEC-SUIYIN-ADMIN-053/1.0.2/spec.md)。原页标题为「销售碎银发送消息统计」，展示使用人数及消息/好友合计，六个物理列为序号、销售、部门、消息数、聊天好友数、空白弹性列。
prd/admin-live-reference.md:131:同销售的部门明细和小计保持相邻；排序以销售组汇总为对象，不拆散组，全表合计固定在最后。没有额外汇总卡、分页、列设置或刷新。CSV 仅导出当前筛选明细，不重复包含小计与总计。
prd/admin-live-reference.md:157:参考样本必须标明参考租户，合成内容必须标演示。来源随适用页面通过说明控件、结果末尾注记或缺采提示表达，专用页不为展示来源另加多余顶部卡片。下拉实体选项严格按当前租户及页面上下文解析，不因为展示了参考表格就导入该参考租户的销售、部门、账号或门店。未采集、采集时加载中、业务空态和读取失败分别说明。
prd/admin-live-reference.md:171:本次完整推送交付静态 HTML、文档、离线单文件与版本化 SDD。写操作仅影响当前浏览器：普通业务按租户/路由隔离，平台 allMenu 配置作为全部租户侧栏的共享本地规则；不接真实写接口，不修改生产仓，不更新开发进度表。用户授权的销售变声统计生产仓执行 Issue 已创建：[管理页销售变声统计 #401](https://github.com/PetWebOrg/suiyin-admin/issues/401)，提出环境深圳艺星、提出人 ZHONG、平台 PC，负责人陈宣宇（cxy-chenxuanyu）。工程覆盖生产注册表中全部适用租户；当时15租户只是该合同的原型验证范围，不是生产白名单。精确合同为 052@1.2.0，执行映射见 [工程交付合同](../docs/sdd/SPEC-SUIYIN-ADMIN-052/1.2.0/issue-handoff.md)。本次全管理页冻结随原型发布，不自动扩大该 Issue 的范围。版本、远端提交与 Pages 结果以独立发布回执为准。
prd/admin-live-reference.md:173:AI费用统计另按058工程交付合同承接管理页实现，提出环境佰智德三、提出人房昕、负责人陈宣宇；不复用销售变声Issue或未确认计费口径。实际工程Issue与测试状态见 [058 Handoff](../docs/sdd/SPEC-SUIYIN-ADMIN-058/1.2.0/issue-handoff.md)。
flowcharts/language-manage.md:3:2026-09-30术语适配：按[077@1.0.1](../docs/sdd/SPEC-SUIYIN-ADMIN-077/1.0.1/spec.md)，六艺星及画美/傲丽的系统人员称谓显示为咨询，其他租户仍为销售；下文共享业务定义与历史采集值不改。画美/傲丽仅有最小待采集框架，不据此新增本页权限、数据或菜单。
flowcharts/language-manage.md:50:分类显示状态来自本轮图标采样，未在真实后台点击隐藏/删除/保存；图中操作均为本地反馈。部门、销售和商品候选项按本租户已采范围提供，未采字段不转换成“全部”或其他租户选项。新增本地内容与源样本分开，媒体仅占位。
flowcharts/friend-list.md:3:2026-09-30术语适配：按[077@1.0.1](../docs/sdd/SPEC-SUIYIN-ADMIN-077/1.0.1/spec.md)，六艺星及画美/傲丽的系统人员称谓显示为咨询，其他租户仍为销售；下文共享业务定义与历史采集值不改。画美/傲丽仅有最小待采集框架，不据此新增本页权限、数据或菜单。
flowcharts/friend-list.md:34:参考内容必须说明来源，不借入其他租户销售或账号。当前保留已知入口不等于分类 Popover、完整高级筛选或账号级联已完成；不得沿用旧流程中的合成分类人数。独立关键词区按来源放置，其与高级条件的完整实站组合语义仍需展开采集核对。
prd/admin-account-menu-status.md:1:# 碎银账号、咨询岗位与菜单状态
prd/admin-account-menu-status.md:3:更新：2026-09-30。行为真源为[076@1.0.1](../docs/sdd/SPEC-SUIYIN-ADMIN-076/1.0.1/spec.md)与[077@1.0.1](../docs/sdd/SPEC-SUIYIN-ADMIN-077/1.0.1/spec.md)，[交互流程](../flowcharts/admin-account-menu-status.md)与[设计规范](../docs/design-spec.md#碎银账号咨询称谓与菜单状态)汇总同一合同。所有写入仅为当前浏览器本地原型；本页不表示生产功能已实现。
prd/admin-account-menu-status.md:7:管理员可以切换画美医美-西安、傲丽医美-西安，从统一的「碎银账号」入口维护账号；指定医美租户使用咨询岗位称谓，不再看到不需要的时间设置。菜单显示状态可在当前表行直接选择，无需先打开编辑弹窗。
prd/admin-account-menu-status.md:12:| 深圳、成都、北京、广州、杭州、嘉兴艺星；画美西安、傲丽西安 | 系统人员称谓用咨询；账号权限角色提供线上咨询、现场咨询、科室助理；账号与系统设置的上下班时间入口移除 |
prd/admin-account-menu-status.md:13:| 其他9个既有租户 | 人员仍用销售，角色和上下班时间设置保持 |
prd/admin-account-menu-status.md:23:## 咨询称谓与角色
prd/admin-account-menu-status.md:25:目标八租户的系统文案覆盖姓名筛选、表头、创建/修改弹窗、手机号、微信昵称、相关菜单、统计和提示。入口仍为碎银账号；人员字段显示咨询姓名、咨询名称、咨询手机号、咨询微信昵称，编辑标题为修改咨询。
prd/admin-account-menu-status.md:27:原角色值「销售」默认回显为「线上咨询」；权限角色保持多选，提供「线上咨询、现场咨询、科室助理」。管理员、财务、渠道主管以及客服、网咨、接待等其他既有角色保留，不凭名称推测岗位映射。新增两类岗位不默认授予菜单权限，也不重新分配客户。创建/编辑回填与保存刷新一致；取消和打开不迁写旧数据，失败保留草稿及原已存状态供重试。
prd/admin-account-menu-status.md:29:只改系统人员称谓和明确角色值。人员姓名、微信昵称、聊天正文、历史业务记录、用户自定义菜单名等自由文本不做批量替换；销售额、销售金额、销售量、销售收入及商品销售人数等业务指标含义保持。内部字段键、角色稳定身份、路由和统计计算不因显示文案改变。
prd/language-manage.md:3:2026-09-30术语适配：按[077@1.0.1](../docs/sdd/SPEC-SUIYIN-ADMIN-077/1.0.1/spec.md)，六艺星及画美/傲丽的系统人员称谓显示为咨询，其他租户仍为销售；下文共享业务定义与历史采集值不改。画美/傲丽仅有最小待采集框架，不据此新增本页权限、数据或菜单。
prd/language-manage.md:15:分类弹窗保留已采名称、所属分类、展示范围、备注及相关销售/部门控件。未采既有分类的展示范围不默认写成“全部展示”；新增分类的本地初值不被描述为线上事实。话术弹窗保留标题、分类、商品类目、所属部门、备注与内容表格；内容仅有文本、图片、视频。已采文本保留经脱敏的模板正文，媒体保留尺寸和占位；文件选择仅用于本地演示，不上传真实服务。
prd/language-manage.md:17:编辑草稿与已存数据分离，取消或Escape关闭不保存；必填失败保留草稿。保存、隐藏、排序、删除确认与操作记录均发生在当前浏览器。未采详情打开后明确提示，不能把说明项或未知类型转换成话术正文。部门、销售、商品候选项仅取该租户实际已采选项；未知保持空列表及未采状态，不借用其他租户。
prd/friend-list.md:3:2026-09-30术语适配：按[077@1.0.1](../docs/sdd/SPEC-SUIYIN-ADMIN-077/1.0.1/spec.md)，六艺星及画美/傲丽的系统人员称谓显示为咨询，其他租户仍为销售；下文共享业务定义与历史采集值不改。画美/傲丽仅有最小待采集框架，不据此新增本页权限、数据或菜单。
prd/friend-list.md:23:- 销售、部门、分组和账号等实体选项来自当前租户及页面；缺选项不从其他租户补齐。普通好友九租户和艺星六租户均已按各自源结构验证。BZDS微信号下拉仅三个已见账号，保留搜索、取消全选和Shift范围勾选；草稿提交后才筛选，重置恢复当前本地样本。北京独立保留模板警示与禁用项。
flowcharts/ai-assisted-message-stats.md:3:2026-09-30术语适配：按[077@1.0.1](../docs/sdd/SPEC-SUIYIN-ADMIN-077/1.0.1/spec.md)，六艺星及画美/傲丽的系统人员称谓显示为咨询，其他租户仍为销售；下文共享业务定义与历史采集值不改。画美/傲丽仅有最小待采集框架，不据此新增本页权限、数据或菜单。
flowcharts/ai-assisted-message-stats.md:23:    Mode -->|销售账号| Accounts[账号明细]
flowcharts/ai-assisted-message-stats.md:36:    Message[候选销售消息] --> Tenant{属于当前租户}
```

判读：共享流程保留非目标九租户的销售称谓，并在对应当前入口明确077覆盖；目标八租户当前人员用语为咨询。历史Issue标题和原角色映射说明保留旧词，非活跃冲突。

## Q002 — 系统展示源中的旧销售词

命令：

```text
rg -l -F 销售 prototype/data
```

退出码：0。

```text
prototype/data\button-states.js
prototype/data\navigation-snapshot.json
prototype/data\language-manage.json
prototype/data\form-schemas.js
prototype/data\content\aoli-xian.json
prototype/data\content\bzds.json
prototype/data\content\crrm.json
prototype/data\live-ui-reference.js
prototype/data\current-list-layout.js
prototype/data\content\forms.json
prototype/data\content\hqjd.json
prototype/data\sales-dashboard\bzds.json
prototype/data\sales-dashboard\hqjd.json
prototype/data\sales-dashboard\crrm.json
prototype/data\content\huamei-xian.json
prototype/data\content\jbfs.json
prototype/data\sales-dashboard\mengzhua.json
prototype/data\content\mengzhua.json
prototype/data\sales-usage\crrm.json
prototype/data\sales-usage\hqjd.json
prototype/data\sales-dashboard\ruixi-kh-xiaowen.json
prototype/data\sales-dashboard\yestar-bj.json
prototype/data\sales-dashboard\rxxz.json
prototype/data\sales-usage\ruixi-kh-xiaowen.json
prototype/data\sales-usage\yestar-bj.json
prototype/data\sales-dashboard\yestar-gz.json
prototype/data\sales-dashboard\jbfs.json
prototype/data\sales-dashboard\yestar-hz.json
prototype/data\sales-dashboard\yestar-jx.json
prototype/data\sales-usage\rxxz.json
prototype/data\sales-dashboard\yestar.json
prototype/data\sales-dashboard\yestar-sz.json
prototype/data\sales-usage\yestar-gz.json
prototype/data\sales-dashboard\ykjl.json
prototype/data\sales-usage\yestar-hz.json
prototype/data\sales-dashboard\yzhb.json
prototype/data\sales-usage\yestar-jx.json
prototype/data\sales-usage\yzhb.json
prototype/data\sales-usage\ykjl.json
prototype/data\sales-usage\yestar.json
prototype/data\content\options.json
prototype/data\content\ruixi-kh-xiaowen.json
prototype/data\content\yestar-bj.json
prototype/data\content\yestar-gz.json
prototype/data\content\yestar-hz.json
prototype/data\content\yestar-jx.json
prototype/data\content\rxxz.json
prototype/data\content\yzhb.json
prototype/data\content\ykjl.json
prototype/data\content\yestar.json
prototype/data\content\yestar-sz.json
```

判读：原采集源、字段键和选项名留存；这是展示投影输入，不能通过全量字符串替换重写客户文本、稳定身份或真实采集记录。

## Q003 — 运行时术语及角色投影入口

命令：

```text
rg -n --max-columns 360 --max-columns-preview -e displayText -e usesConsultation -e consultationRoles -e roleValue -e roleOptions -e normalizeRoles prototype/admin-account-profile.js prototype/admin-content.js prototype/admin-navigation.js
```

退出码：0。

```text
prototype/admin-account-profile.js:8: const usesConsultation=id=>noDutyTime.has(id);
prototype/admin-account-profile.js:10: function displayText(id,text){
prototype/admin-account-profile.js:11:  if(!usesConsultation(id)||typeof text!=='string')return text;
prototype/admin-account-profile.js:15: const consultationRoles=Object.freeze(['线上咨询','现场咨询','科室助理']);
prototype/admin-account-profile.js:16: function roleValue(id,value){
prototype/admin-account-profile.js:17:  if(!usesConsultation(id))return value;
prototype/admin-account-profile.js:18:  if(Array.isArray(value))return [...new Set(value.map(v=>roleValue(id,v)))];
prototype/admin-account-profile.js:21: function roleOptions(id,options=[],includeDefaults=true){
prototype/admin-account-profile.js:22:  if(!usesConsultation(id))return options;
prototype/admin-account-profile.js:24:  for(const option of options){const item=typeof option==='string'?{text:option}:option;for(const text of String(roleValue(id,item.text)||'').split(/[、\n]/).filter(Boolean)){
prototype/admin-account-profile.js:27:  for(const text of includeDefaults?consultationRoles:[])if(!seen.has(text))result.push({text,disabled:false});
prototype/admin-account-profile.js:28:  return [...consultationRoles.flatMap(role=>result.filter(item=>item.text===role)),...result.filter(item=>!consultationRoles.includes(item.text))];
prototype/admin-account-profile.js:30: function normalizeRoles(page,id=page?.tenant){
prototype/admin-account-profile.js:31:  if(!page||!usesConsultation(id)||!['salesManage','role'].includes(page.route))return page;
prototype/admin-account-profile.js:35:   for(const row of table.rows||[]){row.cells[index]=roleValue(id,row.cells[index]);if(row.extra&&Object.hasOwn(row.extra,header))row.extra[header]=roleValue(id,row.extra[header]);}
prototype/admin-account-profile.js:36:   if(page.route==='role'&&!page.consultationRolesVersion)for(const role of consultationRoles){
prototype/admin-account-profile.js:39:    table.rows.push({id:id+'-consultation-role-'+consultationRoles.indexOf(role),cells,actions:['编辑','删除'],extra:{'角色名称':role,'权限菜单':[]},prototypeOnly:true});
prototype/admin-account-profile.js:42:  if(page.route==='role')page.consultationRolesVersion=1;
prototype/admin-account-profile.js:68: return {title,removesDutyTime,usesConsultation,displayText,consultationRoles,roleValue,roleOptions,normalizeRoles,isDutyTime,fieldAllowed,normalizeTenant,normalizePage,normalizeOverride,pending};
prototype/admin-navigation.js:29: return window.AdminAccountProfile.displayText(tenant.id,value);
prototype/admin-content.js:8:const uiText=text=>window.AdminAccountProfile.displayText(tenant,text);
prototype/admin-content.js:9:const consultRoles=()=>window.AdminAccountProfile.usesConsultation(tenant)&&['salesManage','role'].includes(route);
prototype/admin-content.js:62: if(window.AdminAccountProfile.usesConsultation(tenant)&&forRoute==='salesManage'&&norm(label)==='权限角色'){
prototype/admin-content.js:65:  let options=window.AdminAccountProfile.roleOptions(tenant,[...(capture?.options||[]),...values]);
prototype/admin-content.js:67:   if(catalog?.tenant===tenant&&catalog.route==='role'&&catalog.consultationRolesVersion&&catalog.history?.length){
prototype/admin-content.js:69:    if(t){const names=t.rows.filter(r=>catalog.state!=='reference'||known.has(r.cells[i])||r.prototypeOnly||r.id.startsWith('local-')||r.extra?.['角色名称']).map(r=>r.cells[i]);if(catalog.state==='reference'){const baseline=allPages?.role?.tables?.find(t=>t.headers.includes('角色名称')),bi=baseline?.headers.indexOf('角色名称'),referenceNames=new Set(baseline?.rows.map(r [... omitted end of long line]
prototype/admin-content.js:170: }if(await window.AdminRevisitRules?.mount?.(tenant,route))return;if(await window.AdminRefreshPages?.mount?.(tenant,route))return;const responses=await Promise.all(['data/content/'+tenant+'.json','data/content/forms.json','data/navigation-snapshot.json','data/content/options.json'].map(p=>fetch(p).then(r=>{if(!r.ok)throw Error(p);return r.json();})));[allPag [... omitted end of long line]
```

判读：仅显式八tenant启用。旧销售角色精确映射线上咨询；新增现场咨询、科室助理；其他既有角色、多选与身份保持。

## Q004 — 自由文本与交易指标边界

命令：

```text
rg -n --max-columns 360 --max-columns-preview -e 商品销售人数 -e 销售额 -e 销售金额 -e 销售量 -e 销售收入 -e 自由文本 -e 待采 prototype/admin-account-profile.js README.md CLAUDE.md docs/design-spec.md prd/admin-account-menu-status.md
```

退出码：0。

```text
prd/admin-account-menu-status.md:21:画美使用`huamei-xian.wecarepet.com`，傲丽使用`aoli-xian.wecarepet.com`，标识由用户提供的后台网址确认。两者各有碎银账号、菜单管理、系统设置三个原型路由及独立存储；真实菜单、账号、组织、权限和业务数据尚未采集。待采集不同于真实零条，不复制其他租户人员或样本填满。当前导航为17租户、814入口、90种路由；原15租户2026-09-27的741已采可见页、42源隐藏页口径保持，新增六入口不算实站采集成果。 [... omitted end of long line]
prd/admin-account-menu-status.md:29:只改系统人员称谓和明确角色值。人员姓名、微信昵称、聊天正文、历史业务记录、用户自定义菜单名等自由文本不做批量替换；销售额、销售金额、销售量、销售收入及商品销售人数等业务指标含义保持。内部字段键、角色稳定身份、路由和统计计算不因显示文案改变。 [... omitted end of long line]
docs/design-spec.md:3:更新：2026-09-30。新租户、碎银账号名称、时间入口与菜单胶囊执行[076@1.0.1](sdd/SPEC-SUIYIN-ADMIN-076/1.0.1/spec.md)；八租户咨询术语与岗位执行[077@1.0.1](sdd/SPEC-SUIYIN-ADMIN-077/1.0.1/spec.md)。下文跨租户组件说明中的销售为非目标租户原称谓，指定八租户系统人员用语显示为咨询；销售额等业务指标、用户文本和内部数据键不改。 [... omitted end of long line]
docs/design-spec.md:11:当前导航登记17租户、814个页面入口、90种路由；源队列783个入口中741可见页已采、42保持源隐藏。原型扩展包含13个已有AI管理父级租户的AI费用统计、6个现有艺星回访规则和6个辅助线管理，另有画美/傲丽各3个待采集原型入口，均不计入实站采集；工具管理是结构父级，不计业务路由。2026-09-18 保存的 UI 资料覆盖 61 种路由、19 种编辑弹窗、2 种整页编辑；65 个菜单名称、64 个按钮名称拥有 SVG 映射，这些数量不是唯一图形数，也不表示所有租户已采集。 [... omitted end of long line]
docs/design-spec.md:82:- 既有15租户品牌、SVG图标和分组按2026-09-27来源呈现；画美/傲丽使用用户确认名称与明确的待采集公共框架；客户端采样页脚为v2026092601。该版本是来源画面字段，不是原型发布tag。锦帛索引警示按宽度自然换行：宽屏40px正文＋10px下边距，窄屏64px正文＋10px下边距、主体y199，不固定警示高度。 [... omitted end of long line]
docs/design-spec.md:109:权限角色继续多选，提供线上咨询、现场咨询、科室助理；原销售回显线上咨询，管理员、财务、渠道主管等保留。打开和取消不写旧数据，保存/刷新一致；失败保留原值和草稿。新增岗位不默认授予菜单权限。两新租户账号与业务区仍待采集，不伪造人员。
CLAUDE.md:3:更新：2026-09-30。[076@1.0.1](docs/sdd/SPEC-SUIYIN-ADMIN-076/1.0.1/README.md)登记画美/傲丽两西安租户、全部租户「碎银账号」名称、八租户时间入口移除与菜单状态胶囊；[077@1.0.1](docs/sdd/SPEC-SUIYIN-ADMIN-077/1.0.1/README.md)定义八租户咨询称谓及线上咨询、现场咨询、科室助理三类岗位。两新租户只有独立最小框架，真实账号/业务仍待采集，不扩散艺星回访及辅助线能力。见[产品说明](prd/admin-account-menu-status.md)与[流程](flowcharts/admin-account-menu-status.md)。 [... omitted end of long line]
CLAUDE.md:22:- `admin-account-profile.js`：076默认账号名称与八租户时间字段能力；077八租户系统称谓与角色适配。按tenant和稳定route处理，保留字段键、自由文本、统计口径和其他角色，不全仓替换销售。
CLAUDE.md:42:1. 2026-09-30当前导航登记17租户、814页面入口、90路由；783个源队列入口中741可见已采、42保持隐藏，另有13个AI费用、6个现有艺星回访规则、6个辅助线管理及两新租户各3个待采集框架入口；工具管理仅为结构父级，不计业务route。不从平台目录或PC注册表新增环境，辅助线按显式艺星能力登记开放；平台定义不授予非艺星业务权限。796/88、802/89和808/90分别只对应09-27、09-28、09-29历史基线。新租户不借用既有租户业务样本或艺星专属权限。 [... omitted end of long line]
CLAUDE.md:69:19. 076/077目标租户为 `yestar-sz,yestar,yestar-bj,yestar-gz,yestar-hz,yestar-jx,huamei-xian,aoli-xian`。账号顶部与系统设置不显示或提交上下班时间，旧配置保留但不回填UI；其他九租户保持。系统人员称谓使用咨询，销售额、销售金额、销售量、销售收入等指标及用户文本不改。旧销售角色显示为线上咨询，三类岗位可多选，其他角色保留；打开/取消不迁写，失败保留草稿，不吞并原多角色。 [... omitted end of long line]
prototype/admin-account-profile.js:13:  return text.replace(/商品销售人数|销售额|销售金额|销售量|销售收入|销售/g,word=>word==='销售'?'咨询':word);
README.md:3:这是十七租户的静态管理后台原型，用于对照真实页面、评审操作和统计规则。2026-09-30 按当前导航登记 **17 个租户、814 个租户×页面入口、90 种路由**。其中783个入口属于2026-09-27源环境采集队列，741个可见页面已有有效DOM和截图，42个保持源隐藏状态；另有13个既有AI费用、6个艺星回访规则、6个艺星辅助线管理和画美/傲丽各3个待采集原型入口。工具管理是结构父级，不计业务路由；新增原型不计入实站采集页数，采集覆盖不等于全部页面、全部状态逐像素一致。 [... omitted end of long line]
README.md:5:2026-09-30按[076@1.0.1](docs/sdd/SPEC-SUIYIN-ADMIN-076/1.0.1/README.md)与[077@1.0.1](docs/sdd/SPEC-SUIYIN-ADMIN-077/1.0.1/README.md)新增画美医美-西安、傲丽医美-西安；全部租户账号入口统一为「碎银账号」。六个现有艺星及这两租户的系统人员称谓为「咨询」，原销售角色回显为「线上咨询」，另有「现场咨询」「科室助理」可多选，其他角色和既有权限保留。同一八租户移除账号顶部与系统设置的上下班时间入口；上班记录、在线状态和「离开状态可转交」保持。普通/平台菜单状态在表内直接选「显示 / 隐藏」并保存，失败回滚，原作用范围不变。两新租户只有独立最小原型框架，真实菜单、账号和业务资料待采集，不扩散艺星回 [... omitted end of long line]
```

判读：商品销售人数等交易词不属于人员称谓，源码显式保护；用户自由文本与未知角色不猜改，两新租户待采资料不补造。

## Q005 — 旧账号默认名称检索

命令：

```text
rg -n -e 销售管理 -e 碎银账号管理 README.md CLAUDE.md docs/design-spec.md prd/admin-account-menu-status.md flowcharts/admin-account-menu-status.md prd/admin-live-reference.md flowcharts/admin-live-reference.md prd/tenant-menu-drag.md flowcharts/tenant-menu-drag.md prd/platform-menu-drag.md flowcharts/platform-menu-drag.md prd/ai-assisted-message-stats.md flowcharts/ai-assisted-message-stats.md prd/friend-list.md flowcharts/friend-list.md prd/language-manage.md flowcharts/language-manage.md
```

退出码：0。

```text
README.md:40:| 专用统计及主列表尾差 | 初轮107项、最终补充81项几何通过；后者包括厚全商品榜、成都拉群、瑞熙小周统计、销售管理及全部账号状态 |
```

判读：当前账号入口统一碎银账号；销售管理仅剩明确历史验收记录。076旧名字由用户明确纠正及076@1.0.1覆盖，077保留相同入口。

## Q006 — 不可变历史的销售与角色词

命令：

```text
rg -l -e 销售 -e 碎银账号管理 docs/sdd docs/history docs/handoffs
```

退出码：0。

```text
docs/history\before-admin-wide-alignment\prd--friend-list.md
docs/history\before-admin-wide-alignment\flowcharts--friend-list.md
docs/handoffs\SPEC-SUIYIN-ADMIN-071\1.3.1\20260928\issue-handoff.md
docs/history\before-admin-live-reference\docs--design-spec.md
docs/handoffs\SPEC-SUIYIN-ADMIN-071\1.3.1\20260928\spec.md
docs/history\before-admin-live-reference\flowcharts--v1.1-sitemap.md
docs/history\before-admin-live-reference\CLAUDE.md
docs/sdd\pixel-correction-20260920.md
docs/history\before-admin-live-reference\prd--v1.1-modules-overview.md
docs/handoffs\SPEC-SUIYIN-ADMIN-071\1.3.1\20260928\history\1.3.1-preview\spec.snapshot.md
docs/sdd\dependencies\SPEC-SUIYIN-ADMIN-042\1.0.0\spec.md
docs/sdd\dependencies\SPEC-SUIYIN-ADMIN-009\1.0.0\spec.md
docs/sdd\SPEC-SUIYIN-ADMIN-REFRESH-001\0.2.0\spec.md
docs/sdd\SPEC-SUIYIN-ADMIN-REFRESH-001\0.2.0\source-search.json
docs/handoffs\SPEC-SUIYIN-ADMIN-071\1.3.1\20260928\history\1.3.0\spec.snapshot.md
docs/handoffs\SPEC-SUIYIN-ADMIN-071\1.3.1\20260928\history\1.1.0\verification.md
docs/sdd\SPEC-SUIYIN-ADMIN-054\1.0.0\verification.md
docs/handoffs\SPEC-SUIYIN-ADMIN-071\1.3.1\20260928\history\1.1.0\spec.snapshot.md
docs/sdd\SPEC-SUIYIN-ADMIN-054\1.0.0\tasks.md
docs/sdd\SPEC-SUIYIN-ADMIN-054\1.0.0\spec.md
docs/sdd\SPEC-SUIYIN-ADMIN-054\1.0.0\source-convergence.md
docs/sdd\SPEC-SUIYIN-ADMIN-054\1.0.0\roadmap.md
docs/sdd\SPEC-SUIYIN-ADMIN-052\1.2.0\verification.md
docs/sdd\SPEC-SUIYIN-ADMIN-052\1.1.1\verification.md
docs/sdd\SPEC-SUIYIN-ADMIN-058\1.2.0\inventory.md
docs/sdd\SPEC-SUIYIN-ADMIN-052\1.2.0\test-contract.md
docs/sdd\SPEC-SUIYIN-ADMIN-052\1.1.1\tasks.md
docs/sdd\SPEC-SUIYIN-ADMIN-052\1.2.0\tasks.md
docs/sdd\SPEC-SUIYIN-ADMIN-052\1.1.1\spec.md
docs/sdd\SPEC-SUIYIN-ADMIN-052\1.2.0\spec.md
docs/sdd\SPEC-SUIYIN-ADMIN-052\1.2.0\source-search.json
docs/sdd\SPEC-SUIYIN-ADMIN-052\1.2.0\source-convergence.md
docs/handoffs\SPEC-SUIYIN-ADMIN-071\1.3.1\20260928\history\1.2.0\verification.md
docs/sdd\SPEC-SUIYIN-ADMIN-051\1.1.0\public-data-audit.md
docs/sdd\SPEC-SUIYIN-ADMIN-068\1.0.0\source-search.txt
docs/sdd\SPEC-SUIYIN-ADMIN-051\1.1.0\plan.md
docs/sdd\SPEC-SUIYIN-ADMIN-052\1.2.0\README.md
docs/handoffs\SPEC-SUIYIN-ADMIN-071\1.3.1\20260928\checks\v1.3.0\sz-compatibility-verification.cjs
docs/handoffs\SPEC-SUIYIN-ADMIN-071\1.3.1\20260928\history\1.2.0\spec.snapshot.md
docs/handoffs\SPEC-SUIYIN-ADMIN-071\1.3.1\20260928\checks\v1.3.0\sz-compatibility-results.json
docs/handoffs\SPEC-SUIYIN-ADMIN-071\1.3.1\20260928\history\1.0.0\verification.md
docs/sdd\SPEC-SUIYIN-ADMIN-052\1.2.0\plan.md
docs/sdd\SPEC-SUIYIN-ADMIN-052\1.2.0\issue-handoff.md
docs/handoffs\SPEC-SUIYIN-ADMIN-071\1.3.1\20260928\history\1.0.0\spec.snapshot.md
docs/sdd\SPEC-SUIYIN-ADMIN-052\1.1.1\README.md
docs/handoffs\SPEC-SUIYIN-ADMIN-071\1.3.1\20260928\history\1.0.0\plan.md
docs/sdd\SPEC-SUIYIN-ADMIN-052\1.1.1\plan.md
docs/sdd\SPEC-SUIYIN-ADMIN-058\1.2.0\spec.md
docs/sdd\SPEC-SUIYIN-ADMIN-058\1.2.0\source-search.json
docs/sdd\SPEC-SUIYIN-ADMIN-058\1.2.0\history\spec-1.1.0.md
docs/sdd\SPEC-SUIYIN-ADMIN-058\1.2.0\history\spec-1.0.0.md
docs/sdd\SPEC-SUIYIN-ADMIN-058\1.2.0\history\plan-1.1.0.md
docs/sdd\SPEC-SUIYIN-ADMIN-058\1.2.0\history\plan-1.0.0.md
docs/sdd\SPEC-SUIYIN-ADMIN-052\1.2.0\evidence\all-page-table-check.json
docs/handoffs\SPEC-SUIYIN-ADMIN-071\1.3.1\20260928\checks\v1.3.1\convergence-search-source.json
docs/sdd\SPEC-SUIYIN-ADMIN-058\1.2.0\plan.md
docs/sdd\SPEC-SUIYIN-ADMIN-052\1.2.0\decisions\DR-095-admin-data-display-menu-management-parity.md
docs/sdd\SPEC-SUIYIN-ADMIN-052\1.2.0\current-document-search.json
docs/handoffs\SPEC-SUIYIN-ADMIN-071\1.3.1\20260928\checks\v1.3.1\convergence-search-docs.json
docs/sdd\SPEC-SUIYIN-ADMIN-052\1.1.1\decisions\DR-095-admin-data-display-menu-management-parity.md
docs/sdd\SPEC-SUIYIN-ADMIN-073\1.0.0\source-search.txt
docs/sdd\SPEC-SUIYIN-ADMIN-054\1.0.0\evidence\evidence-audit\matrix.json
docs/sdd\SPEC-SUIYIN-ADMIN-052\1.1.2\current-document-search.json
docs/sdd\SPEC-SUIYIN-ADMIN-052\1.2.0\evidence\sticky-COVERAGE.md
docs/sdd\SPEC-SUIYIN-ADMIN-052\1.1.2\decisions\DR-095-admin-data-display-menu-management-parity.md
docs/sdd\SPEC-SUIYIN-ADMIN-052\1.2.0\evidence\sticky-runtime-report.json
docs/sdd\SPEC-SUIYIN-ADMIN-054\1.0.0\docs-source-search.json
docs/sdd\SPEC-SUIYIN-ADMIN-052\1.1.2\plan.md
docs/sdd\SPEC-SUIYIN-ADMIN-052\1.1.2\source-search.json
docs/sdd\SPEC-SUIYIN-ADMIN-052\1.1.2\spec.md
docs/sdd\SPEC-SUIYIN-ADMIN-052\1.1.2\tasks.md
docs/sdd\SPEC-SUIYIN-ADMIN-053\1.0.2\current-document-search.json
docs/sdd\SPEC-SUIYIN-ADMIN-053\1.0.2\plan.md
docs/sdd\SPEC-SUIYIN-ADMIN-053\1.0.2\verification.md
docs/sdd\SPEC-SUIYIN-ADMIN-062\1.0.0\spec.md
docs/sdd\SPEC-SUIYIN-ADMIN-062\1.0.0\source-search.txt
docs/sdd\SPEC-SUIYIN-ADMIN-053\1.0.0\verification.md
docs/sdd\SPEC-SUIYIN-ADMIN-053\1.0.2\spec.md
docs/sdd\SPEC-SUIYIN-ADMIN-053\1.0.2\source-convergence.md
docs/sdd\SPEC-SUIYIN-ADMIN-053\1.0.2\source-search.json
docs/sdd\SPEC-SUIYIN-ADMIN-053\1.0.0\spec.md
docs/sdd\SPEC-SUIYIN-ADMIN-053\1.0.1\spec.md
docs/sdd\SPEC-SUIYIN-ADMIN-056\1.0.0\verification.md
docs/sdd\SPEC-SUIYIN-ADMIN-056\1.0.0\tasks.md
docs/sdd\SPEC-SUIYIN-ADMIN-056\1.0.0\spec.md
docs/sdd\SPEC-SUIYIN-ADMIN-053\1.0.1\plan.md
docs/sdd\SPEC-SUIYIN-ADMIN-053\1.0.0\README.md
docs/sdd\SPEC-SUIYIN-ADMIN-056\1.0.0\source-convergence.md
docs/sdd\SPEC-SUIYIN-ADMIN-053\1.0.0\plan.md
docs/sdd\SPEC-SUIYIN-ADMIN-060\1.1.0\source-search.txt
docs/sdd\SPEC-SUIYIN-ADMIN-053\1.0.1\current-document-search.json
docs/sdd\SPEC-SUIYIN-ADMIN-055\1.1.0\current-document-search.json
docs/sdd\SPEC-SUIYIN-ADMIN-055\1.1.0\plan.md
docs/sdd\SPEC-SUIYIN-ADMIN-071\1.3.1\spec.md
docs/sdd\SPEC-SUIYIN-ADMIN-056\1.0.0\evidence\evidence-audit\matrix.json
docs/sdd\SPEC-SUIYIN-ADMIN-055\1.1.0\README.md
docs/sdd\SPEC-SUIYIN-ADMIN-055\1.0.0\verification.md
docs/sdd\SPEC-SUIYIN-ADMIN-055\1.0.0\tasks.md
docs/sdd\SPEC-SUIYIN-ADMIN-055\1.1.0\source-convergence.md
docs/sdd\SPEC-SUIYIN-ADMIN-055\1.0.0\spec.md
docs/sdd\SPEC-SUIYIN-ADMIN-055\1.1.0\source-search.json
docs/sdd\SPEC-SUIYIN-ADMIN-055\1.1.0\spec.md
docs/sdd\SPEC-SUIYIN-ADMIN-055\1.1.0\tasks.md
docs/sdd\SPEC-SUIYIN-ADMIN-055\1.1.0\evidence\sticky-COVERAGE.md
docs/sdd\SPEC-SUIYIN-ADMIN-071\1.3.1\history\1.3.1-preview\spec.snapshot.md
docs/sdd\SPEC-SUIYIN-ADMIN-071\1.2.0\verification.md
docs/sdd\SPEC-SUIYIN-ADMIN-055\1.1.0\evidence\sticky-runtime-report.json
docs/sdd\SPEC-SUIYIN-ADMIN-055\1.1.0\evidence\all-page-table-check.json
docs/sdd\SPEC-SUIYIN-ADMIN-071\1.1.0\verification.md
docs/sdd\SPEC-SUIYIN-ADMIN-071\1.2.0\spec.md
docs/sdd\SPEC-SUIYIN-ADMIN-071\1.3.1\history\1.2.0\verification.md
docs/sdd\SPEC-SUIYIN-ADMIN-071\1.1.0\history\1.0.0\plan.md
docs/sdd\SPEC-SUIYIN-ADMIN-071\1.3.1\history\1.2.0\spec.snapshot.md
docs/sdd\SPEC-SUIYIN-ADMIN-071\1.1.0\spec.md
docs/sdd\SPEC-SUIYIN-ADMIN-055\1.0.0\evidence\evidence-audit\matrix.json
docs/sdd\SPEC-SUIYIN-ADMIN-071\1.3.1\history\1.3.0\spec.snapshot.md
docs/sdd\SPEC-SUIYIN-ADMIN-071\1.1.0\history\1.0.0\verification.md
docs/sdd\SPEC-SUIYIN-ADMIN-071\1.1.0\history\1.0.0\spec.snapshot.md
docs/sdd\SPEC-SUIYIN-ADMIN-071\1.2.0\history\1.0.0\plan.md
docs/sdd\SPEC-SUIYIN-ADMIN-071\1.2.0\history\1.0.0\spec.snapshot.md
docs/sdd\SPEC-SUIYIN-ADMIN-071\1.3.1\history\1.1.0\verification.md
docs/sdd\SPEC-SUIYIN-ADMIN-071\1.2.0\history\1.1.0\verification.md
docs/sdd\SPEC-SUIYIN-ADMIN-071\1.2.0\history\1.0.0\verification.md
docs/sdd\SPEC-SUIYIN-ADMIN-071\1.1.0\checks\nodes-model-verification.cjs
docs/sdd\SPEC-SUIYIN-ADMIN-071\1.2.0\checks\v1.2.0\sz-compatibility-results.json
docs/sdd\SPEC-SUIYIN-ADMIN-071\1.3.1\history\1.1.0\spec.snapshot.md
docs/sdd\SPEC-SUIYIN-ADMIN-071\1.2.0\checks\v1.2.0\sz-compatibility-verification.cjs
docs/sdd\SPEC-SUIYIN-ADMIN-071\1.2.0\history\1.1.0\spec.snapshot.md
docs/sdd\SPEC-SUIYIN-ADMIN-071\1.3.1\checks\v1.3.1\convergence-search-docs.json
docs/sdd\SPEC-SUIYIN-ADMIN-071\1.1.0\checks\nodes-preview.json
docs/sdd\SPEC-SUIYIN-ADMIN-071\1.1.0\checks\nodes-model-results.json
docs/sdd\SPEC-SUIYIN-ADMIN-071\1.3.1\checks\v1.3.1\convergence-search-source.json
docs/sdd\SPEC-SUIYIN-ADMIN-071\1.3.1\history\1.0.0\spec.snapshot.md
docs/sdd\SPEC-SUIYIN-ADMIN-071\1.3.1\history\1.0.0\verification.md
docs/sdd\SPEC-SUIYIN-ADMIN-071\1.3.1\history\1.0.0\plan.md
docs/sdd\SPEC-SUIYIN-ADMIN-071\1.3.1\checks\v1.3.0\sz-compatibility-results.json
docs/sdd\SPEC-SUIYIN-ADMIN-071\1.3.1\checks\v1.3.0\sz-compatibility-verification.cjs
```

判读：历史规格及采集记录保留原名字、原角色和当时范围；当前设计/维护入口均显式指向077的八租户Override。不重写旧版也不把其标题当新UI名称。

## Q007 — 只读运行时投影核对

探针参数：roleOptions传入合成选项[销售,管理员,财务,渠道主管]，仅验证精确映射与其余角色保留算法；不主张这些选项就是两新租户已采真实目录。

方法：Node VM只读加载 `prototype/admin-account-profile.js`，调用displayText、roleValue、roleOptions、removesDutyTime；无浏览器存储写入。

```json
[
  {
    "tenant": "yestar-sz",
    "term": "咨询姓名",
    "account": "碎银账号",
    "legacyRole": "线上咨询",
    "roles": [
      "线上咨询",
      "现场咨询",
      "科室助理",
      "管理员",
      "财务",
      "渠道主管"
    ],
    "metric": "商品销售人数 / 销售额",
    "removesDutyTime": true
  },
  {
    "tenant": "yestar",
    "term": "咨询姓名",
    "account": "碎银账号",
    "legacyRole": "线上咨询",
    "roles": [
      "线上咨询",
      "现场咨询",
      "科室助理",
      "管理员",
      "财务",
      "渠道主管"
    ],
    "metric": "商品销售人数 / 销售额",
    "removesDutyTime": true
  },
  {
    "tenant": "yestar-bj",
    "term": "咨询姓名",
    "account": "碎银账号",
    "legacyRole": "线上咨询",
    "roles": [
      "线上咨询",
      "现场咨询",
      "科室助理",
      "管理员",
      "财务",
      "渠道主管"
    ],
    "metric": "商品销售人数 / 销售额",
    "removesDutyTime": true
  },
  {
    "tenant": "yestar-gz",
    "term": "咨询姓名",
    "account": "碎银账号",
    "legacyRole": "线上咨询",
    "roles": [
      "线上咨询",
      "现场咨询",
      "科室助理",
      "管理员",
      "财务",
      "渠道主管"
    ],
    "metric": "商品销售人数 / 销售额",
    "removesDutyTime": true
  },
  {
    "tenant": "yestar-hz",
    "term": "咨询姓名",
    "account": "碎银账号",
    "legacyRole": "线上咨询",
    "roles": [
      "线上咨询",
      "现场咨询",
      "科室助理",
      "管理员",
      "财务",
      "渠道主管"
    ],
    "metric": "商品销售人数 / 销售额",
    "removesDutyTime": true
  },
  {
    "tenant": "yestar-jx",
    "term": "咨询姓名",
    "account": "碎银账号",
    "legacyRole": "线上咨询",
    "roles": [
      "线上咨询",
      "现场咨询",
      "科室助理",
      "管理员",
      "财务",
      "渠道主管"
    ],
    "metric": "商品销售人数 / 销售额",
    "removesDutyTime": true
  },
  {
    "tenant": "huamei-xian",
    "term": "咨询姓名",
    "account": "碎银账号",
    "legacyRole": "线上咨询",
    "roles": [
      "线上咨询",
      "现场咨询",
      "科室助理",
      "管理员",
      "财务",
      "渠道主管"
    ],
    "metric": "商品销售人数 / 销售额",
    "removesDutyTime": true
  },
  {
    "tenant": "aoli-xian",
    "term": "咨询姓名",
    "account": "碎银账号",
    "legacyRole": "线上咨询",
    "roles": [
      "线上咨询",
      "现场咨询",
      "科室助理",
      "管理员",
      "财务",
      "渠道主管"
    ],
    "metric": "商品销售人数 / 销售额",
    "removesDutyTime": true
  },
  {
    "tenant": "bzds",
    "term": "销售姓名",
    "legacyRole": "销售",
    "roles": [
      "销售",
      "管理员"
    ],
    "removesDutyTime": false
  }
]
```

角色目录源状态（只读JSON，不输出人员数据）：

```json
[
  {
    "tenant": "yestar-sz",
    "state": "captured",
    "referenceTenant": null,
    "captureStatus": null
  },
  {
    "tenant": "yestar",
    "state": "reference",
    "referenceTenant": null,
    "captureStatus": null
  },
  {
    "tenant": "yestar-bj",
    "state": "reference",
    "referenceTenant": null,
    "captureStatus": null
  },
  {
    "tenant": "yestar-gz",
    "state": "reference",
    "referenceTenant": null,
    "captureStatus": null
  },
  {
    "tenant": "yestar-hz",
    "state": "reference",
    "referenceTenant": null,
    "captureStatus": null
  },
  {
    "tenant": "yestar-jx",
    "state": "reference",
    "referenceTenant": null,
    "captureStatus": null
  }
]
```

判读：深圳role为captured，其余五艺星为reference；参考目录不声称各店真实授权。三岗位由077明确的原型规则提供，未新增真实权限。

## Q008 — 历史快照不可变检查

```text
git diff --name-only -- docs/sdd docs/history docs/handoffs
(no tracked historical file changes)
```

判读：当前没有已跟踪历史包改写；本次077无工程Handoff/Issue授权。
