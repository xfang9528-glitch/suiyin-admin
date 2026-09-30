# Source search evidence

日期：2026-09-30（Asia/Shanghai）。目标发布tag：`v2026093001-admin-accounts-menu`。工作目录：`E:/AI 项目/佰智德三/碎银原型/suiyin-admin`。

本文保存实际rg命令及输出；退出码1表示无命中。`--max-columns-preview`仅节略长源码行，其作用点已另读完整函数。来源快照、历史规格和业务数据中的旧词不作为现行显示规则。搜索不证明远端发布或生产上线。

## Q001 — 当前账号名称与旧词

命令：

```text
rg -n -e 销售管理 -e 碎银账号管理 README.md CLAUDE.md docs/design-spec.md prd/admin-account-menu-status.md flowcharts/admin-account-menu-status.md prd/admin-live-reference.md flowcharts/admin-live-reference.md prd/tenant-menu-drag.md flowcharts/tenant-menu-drag.md prd/platform-menu-drag.md flowcharts/platform-menu-drag.md prd/ai-assisted-message-stats.md flowcharts/ai-assisted-message-stats.md prd/friend-list.md flowcharts/friend-list.md prd/language-manage.md flowcharts/language-manage.md
```

退出码：0。

```text
README.md:40:| 专用统计及主列表尾差 | 初轮107项、最终补充81项几何通过；后者包括厚全商品榜、成都拉群、瑞熙小周统计、销售管理及全部账号状态 |
```

判读：当前维护/设计默认账号名不再为旧名。唯一销售管理命中是README的2026-09-27验收记录，保留原采集历史命名。

## Q002 — 当前租户与待采集边界

命令：

```text
rg -n -e 17.*814 -e 待采集 -e 15.*租户 README.md CLAUDE.md docs/design-spec.md prd/admin-account-menu-status.md flowcharts/admin-account-menu-status.md prd/admin-live-reference.md flowcharts/admin-live-reference.md prd/tenant-menu-drag.md flowcharts/tenant-menu-drag.md prd/platform-menu-drag.md flowcharts/platform-menu-drag.md prd/ai-assisted-message-stats.md flowcharts/ai-assisted-message-stats.md prd/friend-list.md flowcharts/friend-list.md prd/language-manage.md flowcharts/language-manage.md
```

退出码：0。

```text
flowcharts/admin-account-menu-status.md:12:    New -->|是| Pending[仅本租户最小框架 业务待采集]
prd/admin-account-menu-status.md:21:画美使用`huamei-xian.wecarepet.com`，傲丽使用`aoli-xian.wecarepet.com`，标识由用户提供的后台网址确认。两者各有碎银账号、菜单管理、系统设置三个原型路由及独立存储；真实菜单、账号、组织、权限和业务数据尚未采集。待采集不同于真实零条，不复制其他租户人员或样本填满。当前导航为17租户、814入口、90种路由；原15租户2026-09-27的741已采可见页、42源隐藏页口径保持，新增六入口不算实站采集成果。
flowcharts/language-manage.md:3:2026-09-30术语适配：按[077@1.0.1](../docs/sdd/SPEC-SUIYIN-ADMIN-077/1.0.1/spec.md)，六艺星及画美/傲丽的系统人员称谓显示为咨询，其他租户仍为销售；下文共享业务定义与历史采集值不改。画美/傲丽仅有最小待采集框架，不据此新增本页权限、数据或菜单。
docs/design-spec.md:11:当前导航登记17租户、814个页面入口、90种路由；源队列783个入口中741可见页已采、42保持源隐藏。原型扩展包含13个已有AI管理父级租户的AI费用统计、6个现有艺星回访规则和6个辅助线管理，另有画美/傲丽各3个待采集原型入口，均不计入实站采集；工具管理是结构父级，不计业务路由。2026-09-18 保存的 UI 资料覆盖 61 种路由、19 种编辑弹窗、2 种整页编辑；65 个菜单名称、64 个按钮名称拥有 SVG 映射，这些数量不是唯一图形数，也不表示所有租户已采集。
docs/design-spec.md:17:2026-09-29话术页从「工具管理 → 话术管理」进入，继续使用同一`languageManage`及`admin-language-manage.js/css`与`data/language-manage.json`，按15租户本轮来源保留树与按钮状态。原一级入口由工具父级承接，不并列重复话术，也不恢复原先隐藏项。当前结构不再使用通用话术文本、去重平铺列表或默认首条编辑器。行为见[话术产品说明](../prd/language-manage.md)，证据见[本轮验收](verification/language-parity-20260929/README.md)。
docs/design-spec.md:34:有原话术入口的既有15租户在原一级话术位置展示工具父级，话术为二级；艺星能力有效的租户另有辅助线二级。侧栏、普通菜单、平台定义、旧链接及页签恢复按073的同一稳定身份迁移，其他菜单布局和合法自定义归属不变；父级没有可见子项时不制造空入口。平台定义仅用于登记，不能授予非艺星业务访问。
docs/design-spec.md:82:- 既有15租户品牌、SVG图标和分组按2026-09-27来源呈现；画美/傲丽使用用户确认名称与明确的待采集公共框架；客户端采样页脚为v2026092601。该版本是来源画面字段，不是原型发布tag。锦帛索引警示按宽度自然换行：宽屏40px正文＋10px下边距，窄屏64px正文＋10px下边距、主体y199，不固定警示高度。
docs/design-spec.md:109:权限角色继续多选，提供线上咨询、现场咨询、科室助理；原销售回显线上咨询，管理员、财务、渠道主管等保留。打开和取消不写旧数据，保存/刷新一致；失败保留原值和草稿。新增岗位不默认授予菜单权限。两新租户账号与业务区仍待采集，不伪造人员。
docs/design-spec.md:187:2026-09-27真实DOM/截图与本地Google Chrome采用同CSS视口及DPR。395个通用列表指定几何检查、15租户好友及专用统计的测量均在记录范围内通过，容差1 CSS px。字体栅格、业务行内容和未采展开不以全图像素相同验收；已批准的055冻结、菜单拖动和预约图表继续保留。详见[当前验收](verification/admin-live-reference.md)和[公开聚合摘要](verification/live-refresh-20260927/README.md)。752入口/665表格等数字仅在[2026-09-20历史记录](verification/filters-sticky-20260920.md)适用。
flowcharts/friend-list.md:3:2026-09-30术语适配：按[077@1.0.1](../docs/sdd/SPEC-SUIYIN-ADMIN-077/1.0.1/spec.md)，六艺星及画美/傲丽的系统人员称谓显示为咨询，其他租户仍为销售；下文共享业务定义与历史采集值不改。画美/傲丽仅有最小待采集框架，不据此新增本页权限、数据或菜单。
README.md:3:这是十七租户的静态管理后台原型，用于对照真实页面、评审操作和统计规则。2026-09-30 按当前导航登记 **17 个租户、814 个租户×页面入口、90 种路由**。其中783个入口属于2026-09-27源环境采集队列，741个可见页面已有有效DOM和截图，42个保持源隐藏状态；另有13个既有AI费用、6个艺星回访规则、6个艺星辅助线管理和画美/傲丽各3个待采集原型入口。工具管理是结构父级，不计业务路由；新增原型不计入实站采集页数，采集覆盖不等于全部页面、全部状态逐像素一致。
README.md:5:2026-09-30按[076@1.0.1](docs/sdd/SPEC-SUIYIN-ADMIN-076/1.0.1/README.md)与[077@1.0.1](docs/sdd/SPEC-SUIYIN-ADMIN-077/1.0.1/README.md)新增画美医美-西安、傲丽医美-西安；全部租户账号入口统一为「碎银账号」。六个现有艺星及这两租户的系统人员称谓为「咨询」，原销售角色回显为「线上咨询」，另有「现场咨询」「科室助理」可多选，其他角色和既有权限保留。同一八租户移除账号顶部与系统设置的上下班时间入口；上班记录、在线状态和「离开状态可转交」保持。普通/平台菜单状态在表内直接选「显示 / 隐藏」并保存，失败回滚，原作用范围不变。两新租户只有独立最小原型框架，真实菜单、账号和业务资料待采集，不扩散艺星回访或辅助线能力。见[产品说明](prd/admin-account-menu-status.md)与[流程](flowcharts/admin-account-menu-status.md)。
README.md:7:2026-09-29的[073@1.0.0](docs/sdd/SPEC-SUIYIN-ADMIN-073/1.0.0/README.md)把当时15租户原一级话术的位置改为「工具管理 → 话术管理」，保留原路由、隐藏/权限和本地话术状态；所有艺星另有「辅助线管理」，自行维护分类、透明PNG、顺序与启停，显式保存草稿并预览PC效果。现有默认和门店来源均可编辑，每个租户一套独立配置。初始16类129条123文件来自本地PC原型，明确为演示来源，不证明各店最新生产清单已经迁移。
README.md:9:2026-09-27按各租户来源刷新导航、品牌和专用页面，新增录音及喜报共25个租户×页面；2026-09-28回访规则覆盖深圳、成都、北京、广州、杭州、嘉兴六艺星并补齐15个回访基准，见071合同。数据包含本租户脱敏采样、明确标识的参考样本和合成演示；不是实时后台，所有修改只影响本地原型。
README.md:11:2026-09-29话术管理按15租户本轮来源重新对齐：保留各自1246个分类节点、真实父子关系、按钮状态和默认未选分类画面；已采42个已采列表分类、155条列表样本、48条话术详情，16项图片/视频采用占位符。分类、标题和安全模板正文尽量保留本租户内容；未采集的详情、范围和选项保持未知，不填统一话术。见[话术产品说明](prd/language-manage.md)、[051@1.1.0本轮交付补充](docs/sdd/SPEC-SUIYIN-ADMIN-051/1.1.0/deliveries/20260929-language-parity/README.md)与[验收范围](docs/verification/language-parity-20260929/README.md)。
README.md:35:| 当轮导航与完整库存 | 15租户；保留源隐藏项、平台限制和本地改名/隐藏/拖动覆盖；7项设置迁移检查通过 |
README.md:36:| 普通及艺星好友 | 15租户，381项几何、161项交互/控件检查通过 |
README.md:50:| [073@1.0.0](docs/sdd/SPEC-SUIYIN-ADMIN-073/1.0.0/README.md) | 原15租户工具父级及话术入口迁移；全部艺星辅助线分类/图片自助维护、租户隔离草稿、异常重试、离开守卫与PC效果预览；限定替代旧一级话术和固定库在Admin中的范围 |
flowcharts/ai-assisted-message-stats.md:3:2026-09-30术语适配：按[077@1.0.1](../docs/sdd/SPEC-SUIYIN-ADMIN-077/1.0.1/spec.md)，六艺星及画美/傲丽的系统人员称谓显示为咨询，其他租户仍为销售；下文共享业务定义与历史采集值不改。画美/傲丽仅有最小待采集框架，不据此新增本页权限、数据或菜单。
CLAUDE.md:3:更新：2026-09-30。[076@1.0.1](docs/sdd/SPEC-SUIYIN-ADMIN-076/1.0.1/README.md)登记画美/傲丽两西安租户、全部租户「碎银账号」名称、八租户时间入口移除与菜单状态胶囊；[077@1.0.1](docs/sdd/SPEC-SUIYIN-ADMIN-077/1.0.1/README.md)定义八租户咨询称谓及线上咨询、现场咨询、科室助理三类岗位。两新租户只有独立最小框架，真实账号/业务仍待采集，不扩散艺星回访及辅助线能力。见[产品说明](prd/admin-account-menu-status.md)与[流程](flowcharts/admin-account-menu-status.md)。
CLAUDE.md:5:2026-09-29工具管理及辅助线执行[073@1.0.0](docs/sdd/SPEC-SUIYIN-ADMIN-073/1.0.0/README.md)：当时15租户原一级话术位置迁为工具父级及二级话术；艺星能力登记有效的租户另有辅助线管理，每租户一套可编辑配置。话术页面继续[051@1.1.0交付补充](docs/sdd/SPEC-SUIYIN-ADMIN-051/1.1.0/deliveries/20260929-language-parity/README.md)的R002–R006、R008–R010，原路由、隐藏、权限和状态保持；15租户分类树、六列列表和弹窗由专用模块承接。[话术验收](docs/verification/language-parity-20260929/README.md)仅证明记录内几何，不外推全部状态逐像素一致。073新页面不冒充实站采样。
CLAUDE.md:7:2026-09-28回访规则执行[071@1.3.1](docs/sdd/SPEC-SUIYIN-ADMIN-071/1.3.1/README.md)：深圳、成都、北京、广州、杭州、嘉兴六个现有艺星租户各自提供「聊天管理 → 回访规则」，`revisitRules`为合成原型扩展。原基准下拉现有15个直接选项：5日期、4个成为A/B/C/D级和6个首次/最近一次到店/购买/划扣；事件不再使用二级“事件取值”控件，等级仍另选人工/AI。共享规则设置与多个独立时间节点是当前模型；1.0.0“每节点一条顶层规则”的方案已被替代。用户此前撤回的移动到群发、增加群发规则和向全部系统租户扩展仍不实施；六艺星补齐授权继续有效，本次只补基准，非艺星不加入口。
CLAUDE.md:42:1. 2026-09-30当前导航登记17租户、814页面入口、90路由；783个源队列入口中741可见已采、42保持隐藏，另有13个AI费用、6个现有艺星回访规则、6个辅助线管理及两新租户各3个待采集框架入口；工具管理仅为结构父级，不计业务route。不从平台目录或PC注册表新增环境，辅助线按显式艺星能力登记开放；平台定义不授予非艺星业务权限。796/88、802/89和808/90分别只对应09-27、09-28、09-29历史基线。新租户不借用既有租户业务样本或艺星专属权限。
CLAUDE.md:50:9. 2026-09-27的15租户导航与741个可见源页已采，395个通用列表、15租户好友及专用页面按记录范围验证；当前结果见[公开摘要](docs/verification/live-refresh-20260927/README.md)。752入口等旧数字只作历史。未采图表点和展开状态仍未知，不用本地检查或发布成功宣称全部状态像素一致。
CLAUDE.md:51:10. 既有销售变声工程已创建 [管理页销售变声统计 #401](https://github.com/PetWebOrg/suiyin-admin/issues/401)：深圳艺星 / ZHONG / PC，负责人陈宣宇（cxy-chenxuanyu），绑定 052@1.2.0。工程覆盖生产租户注册表中全部适用租户；本原型 15 个租户仅为验证清单，不能限制生产范围。状态与测试映射以远端 Handoff 为准；此授权不等于在本仓流程中实现生产代码或将全部表格冻结扩成另一个工程任务。
CLAUDE.md:63:16. 话术使用2026-09-29本轮15租户数据，1246分类节点、42已采列表分类、155列表样本、48已采详情和16媒体占位。同名分类保留不同身份，搜索保留匹配祖先；不默认选首条。未采分类/正文/部门/销售/商品选项分别保留`not-captured`，不填其他租户内容或把缺失当空值事实。当前冻结树内`n0`等ID稳定；后续重新采集若改变节点顺序，必须处理身份迁移，不按新序号盲合并旧本地修改。`captureRevision`更新采用字段级本地覆盖，保存、取消、刷新和租户隔离继续校验。`sanitize-public-data.mjs --check`必须检查独立话术数据，不能将其再次替换为统一演示文本。
prd/ai-assisted-message-stats.md:3:2026-09-30术语适配：按[077@1.0.1](../docs/sdd/SPEC-SUIYIN-ADMIN-077/1.0.1/spec.md)，六艺星及画美/傲丽的系统人员称谓显示为咨询，其他租户仍为销售；下文共享业务定义与历史采集值不改。画美/傲丽仅有最小待采集框架，不据此新增本页权限、数据或菜单。
flowcharts/admin-live-reference.md:7:其他领域：六个现有艺星租户回访规则执行 [071@1.3.1](../docs/sdd/SPEC-SUIYIN-ADMIN-071/1.3.1/README.md)。2026-09-27录音/喜报三新页、对应入口迁移与本地演示边界继续执行 [REFRESH-001@0.2.0](../docs/sdd/SPEC-SUIYIN-ADMIN-REFRESH-001/0.2.0/README.md)，既有页面刷新继续原合同。普通菜单与平台/租户优先级执行068@1.0.0，平台拖动继续060@1.1.0；预约记录图表按062@1.0.0。当前静态原型共17租户、814入口、90路由；783个源队列入口与741可见已采/42隐藏口径不变，另13个AI费用、6个艺星回访规则、6个辅助线管理及两新租户各3个待采集框架入口属于原型扩展。工具管理父级不计业务路由。其余合同为051@1.1.0、052@1.2.0、053@1.0.2、054@1.0.0、055@1.1.0、056@1.0.0、058@1.2.0，见[合同入口](../README.md)。以下流程均不写真实后台。
flowcharts/admin-live-reference.md:224:    Entry[原15租户 变声统计] --> Permission{菜单及父级允许}
flowcharts/admin-live-reference.md:374:2026-09-27已采15租户导航及741个可见源页。395个通用列表、好友、统计和专用模块分别按同视口及DPR进行指定几何/交互检查，见[公开聚合摘要](../docs/verification/live-refresh-20260927/README.md)。未观察的展开状态、图表点和筛选区间仍有边界，不能用结构或发布回执宣称741页所有状态逐像素一致。752入口等2026-09-20数字仅作历史。
prd/language-manage.md:3:2026-09-30术语适配：按[077@1.0.1](../docs/sdd/SPEC-SUIYIN-ADMIN-077/1.0.1/spec.md)，六艺星及画美/傲丽的系统人员称谓显示为咨询，其他租户仍为销售；下文共享业务定义与历史采集值不改。画美/傲丽仅有最小待采集框架，不据此新增本页权限、数据或菜单。
prd/language-manage.md:5:更新：2026-09-29。现有15租户均从「工具管理 → 话术管理」进入同一`languageManage`路由；导航层级按[073@1.0.0](../docs/sdd/SPEC-SUIYIN-ADMIN-073/1.0.0/spec.md)的R001–R003迁移，原链接、页签、本地话术数据、隐藏和权限保持。页面行为继续继承[051@1.1.0](../docs/sdd/SPEC-SUIYIN-ADMIN-051/1.1.0/spec.md)的R002–R006、R008–R010，[交付补充](../docs/sdd/SPEC-SUIYIN-ADMIN-051/1.1.0/deliveries/20260929-language-parity/README.md)保留话术纠偏的证据边界。
prd/language-manage.md:27:| 租户及分类树 | 15租户、1246节点；本轮采集，未合并旧快照冒充新来源 |
prd/language-manage.md:31:| 验证 | 26项本地行为与15租户几何检查；独立单文件225项检查，详见[实际验收](../docs/verification/language-parity-20260929/README.md) |
prd/language-manage.md:33:几何比较采用相同视口和DPR，已测锚点容差1 CSS px。它证明记录内的默认布局、树、表格与已测弹窗，不证明全部分类、所有内容及全部状态的整张截图像素相等。现有15租户是原型验证范围，不是生产租户白名单。
prd/friend-list.md:3:2026-09-30术语适配：按[077@1.0.1](../docs/sdd/SPEC-SUIYIN-ADMIN-077/1.0.1/spec.md)，六艺星及画美/傲丽的系统人员称谓显示为咨询，其他租户仍为销售；下文共享业务定义与历史采集值不改。画美/傲丽仅有最小待采集框架，不据此新增本页权限、数据或菜单。
prd/friend-list.md:30:本轮15租户好友专项381项几何及161项交互/控件检查通过，已按各自有效源截图在Google Chrome同视口和DPR对照，几何容差1 CSS px。旧156项结构检查仅证明上轮范围；未采完整展开和业务库存仍保留缺口，不能宣称所有状态逐像素一致。详情见 [验收摘要](../docs/verification/admin-live-reference.md)。既有23维PC级联、固定默认分页、合成分类人数及所有高级条件都可过滤等旧承诺不适用于当前主线。
prd/admin-live-reference.md:5:更新：2026-09-29。工具管理及艺星辅助线自助管理执行[073@1.0.0](../docs/sdd/SPEC-SUIYIN-ADMIN-073/1.0.0/spec.md)。既有15租户的原话术导航入口改为「工具管理 → 话术管理」，艺星另有「辅助线管理」；话术页面的领域结构、真实样本和本地交互仍继承051@1.1.0，见[话术管理](language-manage.md)及[交付补充](../docs/sdd/SPEC-SUIYIN-ADMIN-051/1.1.0/deliveries/20260929-language-parity/README.md)。下列其他领域沿用各自版本。
prd/admin-live-reference.md:13:范围为十七租户：佰智德三、锦帛美学、萌爪、诚如风险管理事务所、厚全鸡蛋、柚子烘焙；瑞熙小刘、小温、小周；艺星成都、深圳、北京、广州、杭州、嘉兴；画美医美-西安、傲丽医美-西安。当前导航库存为 **814 个租户页面入口、90 种路由**。其中783个为源环境队列，741个可见页有有效DOM与截图，42个按源隐藏；另有13个既有AI费用原型扩展、6个现有艺星回访规则及6个艺星辅助线管理入口，另有两新租户各3个待采集框架入口，扩展项不计入实站采集。「工具管理」是结构父级，不新增业务页面路由。其他截图排除项、碎银私域和不可访问环境不自动纳入；画美/傲丽由用户明确新增，真实后台仍未采集。各租户保留自己的可用入口、权限和独立显示配置；菜单表和侧栏按068共用有效完整树。平台allMenu提供默认顺序和归属，租户明确调过的同级列表及被移动项父级优先；073仅迁移工具/话术的指定层级，保留其他合法调整；平台当前祖先链隐藏/删除和既有权限始终约束可见导航。
prd/admin-live-reference.md:22:| 工具管理 → 话术管理 | 既有15租户原话术位置由工具父级承接，二级话术保留原route；本租户已采分类树、默认空态、末级六列表格与编辑继续原行为 | 15租户1246节点；42个已采列表分类155条列表样本、48详情；原隐藏、权限和本地状态保持，未采不当作空；见[专页说明](language-manage.md) |
prd/admin-live-reference.md:29:| 录音管理、喜报设置和记录 | 15租户录音管理、5租户喜报设置与5租户喜报记录，列表、详情抽屉和本地设置/新增弹窗 | 独立合成内容；不真实上传、播放客户录音或发布喜报 |
prd/admin-live-reference.md:39:有原话术入口的既有15租户把原一级话术的位置替换为「工具管理」，话术成为其二级，`languageManage`链接、页签恢复、状态键和原有内容保持兼容。普通菜单、平台定义和侧栏使用相同结构；工具父级按可见子项展示，原话术隐藏与权限继续有效。迁移不重复添加话术，也不把工具统一追加到菜单末尾。平台可登记辅助线定义，但定义存在不向佰智德三等非艺星租户开放业务数据。
prd/admin-live-reference.md:116:行为合同：[052@1.2.0](../docs/sdd/SPEC-SUIYIN-ADMIN-052/1.2.0/spec.md)。原15个登记租户在「数据展示」拥有变声统计菜单定义（八目标租户称咨询，其余称销售；新两租户不补未采菜单），位置在销售使用统计附近；可见性继续受既有父级及权限配置约束，不自动开通变声账号。
prd/admin-live-reference.md:135:当前可计算的专用数值样本保留深圳、锦帛、佰智德三和萌爪四租户；萌爪为确认空态。原15租户中的其余11租户没有迁入可计算的专用数值样本，继续显示缺样本说明，不引用深圳人员、部门或数量。页面结构已采与可计算数值样本可用分别记录；部门选项仅反映本租户样本观察，不承诺完整组织库存。
prd/admin-live-reference.md:167:数据、DOM、交互、视觉和远端发布分别记录结论。2026-09-27原15租户的导航及741个可见源页采集完成；395个通用列表实际几何检查、15租户好友、54个专用主体与统计尾差分别验证。几何容差1 CSS px，不把采集完成或本地结构通过解释为全部状态像素一致。当前数据与限制见 [2026-09-27公开摘要](../docs/verification/live-refresh-20260927/README.md)；[2026-09-20冻结记录](../docs/verification/filters-sticky-20260920.md)只证明当时范围。
prd/admin-live-reference.md:171:本次完整推送交付静态 HTML、文档、离线单文件与版本化 SDD。写操作仅影响当前浏览器：普通业务按租户/路由隔离，平台 allMenu 配置作为全部租户侧栏的共享本地规则；不接真实写接口，不修改生产仓，不更新开发进度表。用户授权的销售变声统计生产仓执行 Issue 已创建：[管理页销售变声统计 #401](https://github.com/PetWebOrg/suiyin-admin/issues/401)，提出环境深圳艺星、提出人 ZHONG、平台 PC，负责人陈宣宇（cxy-chenxuanyu）。工程覆盖生产注册表中全部适用租户；当时15租户只是该合同的原型验证范围，不是生产白名单。精确合同为 052@1.2.0，执行映射见 [工程交付合同](../docs/sdd/SPEC-SUIYIN-ADMIN-052/1.2.0/issue-handoff.md)。本次全管理页冻结随原型发布，不自动扩大该 Issue 的范围。版本、远端提交与 Pages 结果以独立发布回执为准。
```

判读：当前17租户/814入口/90路由；15租户命中均为既有来源、09-27/28/29历史验收或未向新租户扩散的模块范围。两新租户只各3框架入口，不计入741实采页。

## Q003 — 源快照旧名称与运行时承接

命令：

```text
rg -l -e 销售管理 -e 碎银账号管理 prototype/data
```

退出码：0。

```text
prototype/data\content\bzds.json
prototype/data\content\crrm.json
prototype/data\content\hqjd.json
prototype/data\content\jbfs.json
prototype/data\content\mengzhua.json
prototype/data\live-ui-reference.js
prototype/data\navigation-snapshot.json
prototype/data\content\ruixi-kh-xiaowen.json
prototype/data\content\rxxz.json
prototype/data\content\yestar-gz.json
prototype/data\content\yestar-bj.json
prototype/data\content\yestar-hz.json
prototype/data\content\yestar-jx.json
prototype/data\content\yestar-sz.json
prototype/data\content\yestar.json
prototype/data\content\yzhb.json
prototype/data\content\ykjl.json
```

判读：这些文件是本租户原始来源或表单/选项证据。保留原字段名和身份，通过admin-account-profile按route迁移默认显示名，旧缓存同样承接，不全局篡改源数据。

## Q004 — 时间入口与缓存守卫

命令：

```text
rg -n --max-columns 360 --max-columns-preview -e removesDutyTime -e fieldAllowed -e isDutyTime -e oldTitles -e normalizePage -e normalizeOverride prototype/admin-account-profile.js prototype/admin-domain-views.js prototype/admin-content.js prototype/admin-menu-state.js
```

退出码：0。

```text
prototype/admin-account-profile.js:4: const title='碎银账号',oldTitles=new Set(['销售管理','碎银账号管理']);
prototype/admin-account-profile.js:6: const name=value=>oldTitles.has(value)?title:value;
prototype/admin-account-profile.js:7: const removesDutyTime=id=>noDutyTime.has(id);
prototype/admin-account-profile.js:12:  if(oldTitles.has(text))return title;
prototype/admin-account-profile.js:45: const isDutyTime=label=>/(?:上下班|上班|下班).*时间|时间.*(?:上下班|上班|下班)/.test(String(label||''));
prototype/admin-account-profile.js:46: function fieldAllowed(id,route,field){return !removesDutyTime(id)||!['salesManage','setting'].includes(route)||!isDutyTime([field.label,field.text,...(field.controls||[]).map(c=>c.placeholder)].join(' '));}
prototype/admin-account-profile.js:51: function normalizePage(page){
prototype/admin-account-profile.js:66: function normalizeOverride(override){if(override?.labels&&Object.hasOwn(override.labels,'salesManage'))override.labels.salesManage=name(override.labels.salesManage);return override;}
prototype/admin-account-profile.js:68: return {title,removesDutyTime,usesConsultation,displayText,consultationRoles,roleValue,roleOptions,normalizeRoles,isDutyTime,fieldAllowed,normalizeTenant,normalizePage,normalizeOverride,pending};
prototype/admin-domain-views.js:8: A.renderTablePage();const root=$('app').firstElementChild,filter=root.querySelector('.filter-panel'),source=(A.source.forms||[]).flatMap(f=>f.fields||[]),config=A.model.config||{},bar=node('div','sales-reception-settings'),time=window.AdminAccountProfile.removesDutyTime(A.tenant)?null:node('input'),check=node('input');root.classList.add('source-sales-manage [... omitted end of long line]
prototype/admin-domain-views.js:35:function settingsPage(){const root=layout(),c=card('系统设置');const options=(A.model.tables[0]?.rows||[]).filter(row=>!window.AdminAccountProfile.removesDutyTime(A.tenant)||!window.AdminAccountProfile.isDutyTime(row.cells[0]));options.forEach(r=>{const line=node('div','toolbar');line.append(node('span','',r.cells[0]),node('span','spacer'),button('设置',()=>settin [... omitted end of long line]
prototype/admin-menu-state.js:123:  const migrated=window.AdminAccountProfile.normalizeOverride(this.migrate(tenant,saved));
prototype/admin-menu-state.js:224:  window.AdminAccountProfile.normalizePage(model);
prototype/admin-menu-state.js:307:  if(!pending.has(id))pending.set(id,fetch('data/content/'+encodeURIComponent(id)+'.json').then(r=>{if(!r.ok)throw Error('租户菜单配置读取失败');return r.json();}).then(data=>{if(!Array.isArray(data.menu?.tables?.[0]?.rows))throw Error('租户菜单配置无效');window.AdminAccountProfile.normalizePage(data.menu);sources.set(id,clone(data.menu));return clone(data.menu);}).catch(erro [... omitted end of long line]
prototype/admin-menu-state.js:312:  window.AdminAccountProfile.normalizePage(saved);
prototype/admin-content.js:36:function filterForms(){const forms=window.AdminFormSchemas?.resolve(source,tenant,route,window.AdminLiveUI?.profiles[route]?.filters||[])||source.forms||[];return forms.map(form=>({...form,fields:(form.fields||[]).filter(field=>window.AdminAccountProfile.fieldAllowed(tenant,route,field))}));}
prototype/admin-content.js:170: }if(await window.AdminRevisitRules?.mount?.(tenant,route))return;if(await window.AdminRefreshPages?.mount?.(tenant,route))return;const responses=await Promise.all(['data/content/'+tenant+'.json','data/content/forms.json','data/navigation-snapshot.json','data/content/options.json'].map(p=>fetch(p).then(r=>{if(!r.ok)throw Error(p);return r.json();})));[allPag [... omitted end of long line]
```

判读：显式八租户集合分别约束账号顶部、设置行、可达表单；旧时间配置只保留历史值。其他九租户继续原样，不删除记录或转交动作。

## Q005 — 菜单状态当前合同与实现

命令：

```text
rg -n --max-columns 360 --max-columns-preview -e 胶囊 -e statusControl -e saveStatus -e statusSaving -e 未能保存，菜单状态 prd/tenant-menu-drag.md prd/platform-menu-drag.md flowcharts/tenant-menu-drag.md flowcharts/platform-menu-drag.md docs/design-spec.md prototype/admin-menu-tree.js
```

退出码：0。

```text
prototype/admin-menu-tree.js:22:  let memoryMessage='',loadedStamp='',tenantWarnings=[],conflictIds=new Set(),statusSaving=false;
prototype/admin-menu-tree.js:241:  function saveStatus(id,value,control){
prototype/admin-menu-tree.js:242:   if(statusSaving||moving||refreshExternal())return;
prototype/admin-menu-tree.js:245:   rememberView();statusSaving=true;control.setAttribute('aria-busy','true');control.querySelectorAll('button').forEach(b=>b.disabled=true);
prototype/admin-menu-tree.js:256:    statusSaving=false;loadedStamp=stateStamp();render();focusStatus(id,previous);
prototype/admin-menu-tree.js:257:    const message=restored?'未能保存，菜单状态已恢复，请重试':'未能保存，本地设置恢复失败，请刷新后重试';reportMemory(message,true);A.toast(message);return;
prototype/admin-menu-tree.js:259:   statusSaving=false;loadedStamp=stateStamp();undoMove=null;render();focusStatus(id,value);notifyNav();
prototype/admin-menu-tree.js:262:  function statusControl(row){
prototype/admin-menu-tree.js:267:    const b=button(option,()=>saveStatus(row.id,option,group),'menu-status-option');b.dataset.value=option;b.setAttribute('role','radio');b.setAttribute('aria-label',menuName(row)+'：'+option);b.setAttribute('aria-checked',String(value===option));b.tabIndex=value===option?0:-1;b.disabled=!!reason||statusSaving;
prototype/admin-menu-tree.js:268:    b.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(event.key))return;event.preventDefault();event.stopPropagation();const next=event.key==='Home'?'显示':event.key==='End'?'隐藏':option==='显示'?'隐藏':'显示';saveStatus(row.id,next,group);focusStatus(row.id,next);});
prototype/admin-menu-tree.js:297:     else if(header==='菜单状态')cell.append(statusControl(row));
docs/design-spec.md:3:更新：2026-09-30。新租户、碎银账号名称、时间入口与菜单胶囊执行[076@1.0.1](sdd/SPEC-SUIYIN-ADMIN-076/1.0.1/spec.md)；八租户咨询术语与岗位执行[077@1.0.1](sdd/SPEC-SUIYIN-ADMIN-077/1.0.1/spec.md)。下文跨租户组件说明中的销售为非目标租户原称谓，指定八租户系统人员用语显示为咨询；销售额等业务指标、用户文本和内部数据键不改。 [... omitted end of long line]
docs/design-spec.md:99:普通菜单状态按076使用胶囊；其树与拖动按 [068@1.0.0](sdd/SPEC-SUIYIN-ADMIN-068/1.0.0/spec.md) 保留名称、超级权限、状态、顺序、空白弹性列、操作六列；“顺序”为完整同层库存的只读 1…N，收起或隐藏不重排编号。名称左侧复用平台手柄，一级携全部子项移动，二级支持组内和跨一级移动，直接落在一级上追加末尾。空一级保留；携页一级接收子项后仍保留自身页面入口。编辑蓝、删除红、记录灰，名称继续只读；编辑中的数值排序框替换为“由列表拖动调整”。保留树、权限开关、显示/隐藏胶囊、固定右操作和空白，不增加通用筛选、分页、刷新或列设置。 [... omitted end of long line]
docs/design-spec.md:113:普通六列、平台九列的状态格使用「显示 / 隐藏」双段圆角胶囊，两段始终有文字、选中态和可见键盘焦点。点不同值直接保存，同值不提交不记操作，点击不触发树展开或拖动。失败恢复值与记录、保留导航并提示重试；成功联动原作用范围导航，编辑弹窗回显同一值。胶囊表达本行配置，父级/平台/原权限仍约束实际可见性；恢复父级不解除子项独立隐藏。窄窗保留控件及必要横向滚动，冻结表头、操作列、拖柄和展开继续可用。 [... omitted end of long line]
flowcharts/platform-menu-drag.md:3:平台交互合同：[060@1.1.0](../docs/sdd/SPEC-SUIYIN-ADMIN-060/1.1.0/spec.md)。其普通menu排除及无条件平台排序覆盖由[068@1.0.0](../docs/sdd/SPEC-SUIYIN-ADMIN-068/1.0.0/spec.md)限定替代，已发布060快照只保留原批准历史。状态交互由[076@1.0.1](../docs/sdd/SPEC-SUIYIN-ADMIN-076/1.0.1/spec.md)替换为表内显示/隐藏胶囊，沿用同一平台范围；见[状态流程](admin-account-menu-status.md#菜单状态直接保存)。 [... omitted end of long line]
flowcharts/tenant-menu-drag.md:3:合同：[SPEC-SUIYIN-ADMIN-068@1.0.0](../docs/sdd/SPEC-SUIYIN-ADMIN-068/1.0.0/spec.md)。普通menu作用当前租户；平台allMenu仍通过默认结构和可见性规则影响全部租户。状态由[076@1.0.1](../docs/sdd/SPEC-SUIYIN-ADMIN-076/1.0.1/spec.md)改为表内显示/隐藏胶囊，成功、同值、失败与范围见[状态流程](admin-account-menu-status.md#菜单状态直接保存)。 [... omitted end of long line]
prd/platform-menu-drag.md:7:- 保留九列表格、既有操作及固定表头。状态按[076@1.0.1](../docs/sdd/SPEC-SUIYIN-ADMIN-076/1.0.1/spec.md)使用「显示 / 隐藏」胶囊，点不同值直接保存，同值无操作；失败恢复原值和记录且不传播导航，编辑弹窗回显同一值。胶囊可键盘激活，不触发拖动；普通菜单复用同一控件但仅作用本租户。名称左侧独立手柄；顺序自动编号，新增默认追加同层末尾。 [... omitted end of long line]
prd/tenant-menu-drag.md:9:- 六列保持名称、超级权限、状态、同层顺序、空白弹性列、操作。名称前增加独立拖动手柄；顺序按完整同层库存只读显示1…N，编辑提示“由列表拖动调整”。普通菜单名称仍只读；状态按[076@1.0.1](../docs/sdd/SPEC-SUIYIN-ADMIN-076/1.0.1/spec.md)改为表内「显示 / 隐藏」胶囊，直接保存，失败恢复原值与记录。同值点击不写入，编辑弹窗共用同一状态；权限、删除与记录保留原范围。 [... omitted end of long line]
prd/tenant-menu-drag.md:14:胶囊支持键盘焦点和激活，点击不触发拖动或树展开。普通状态仅影响本租户，平台/父级限制与子项独立隐藏继续生效；点显示不代表绕过限制。见[状态流程](../flowcharts/admin-account-menu-status.md#菜单状态直接保存)。
```

判读：普通/平台状态入口已改胶囊，原编辑弹窗共享状态；当前文档原位替换状态指令，并保持父子/平台/权限边界。

## Q006 — 历史SDD与历史文档残留位置

命令：

```text
rg -l -e 销售管理 -e 15.*租户 -e 自动下班 docs/sdd docs/history docs/handoffs
```

退出码：0。

```text
docs/history\before-admin-live-reference\CLAUDE.md
docs/history\before-admin-live-reference\docs--design-spec.md
docs/handoffs\SPEC-SUIYIN-ADMIN-071\1.3.1\20260928\history\1.2.0\plan.md
docs/history\before-admin-live-reference\flowcharts--v1.1-sitemap.md
docs/handoffs\SPEC-SUIYIN-ADMIN-071\1.3.1\20260928\history\1.2.0\source-convergence.md
docs/handoffs\SPEC-SUIYIN-ADMIN-071\1.3.1\20260928\history\1.3.1-preview\spec.snapshot.md
docs/handoffs\SPEC-SUIYIN-ADMIN-071\1.3.1\20260928\history\1.3.0\spec.snapshot.md
docs/sdd\pixel-correction-20260920.md
docs/handoffs\SPEC-SUIYIN-ADMIN-071\1.3.1\20260928\history\1.1.0\source-convergence.md
docs/handoffs\SPEC-SUIYIN-ADMIN-071\1.3.1\20260928\history\1.0.0\spec.snapshot.md
docs/history\before-admin-live-reference\prd--v1.1-modules-overview.md
docs/handoffs\SPEC-SUIYIN-ADMIN-071\1.3.1\20260928\history\1.2.0\spec.snapshot.md
docs/handoffs\SPEC-SUIYIN-ADMIN-071\1.3.1\20260928\checks\v1.3.1\convergence-search-docs.json
docs/handoffs\SPEC-SUIYIN-ADMIN-071\1.3.1\20260928\history\1.1.0\spec.snapshot.md
docs/handoffs\SPEC-SUIYIN-ADMIN-071\1.3.1\20260928\history\1.1.0\verification.md
docs/handoffs\SPEC-SUIYIN-ADMIN-071\1.3.1\20260928\history\1.2.0\verification.md
docs/sdd\SPEC-SUIYIN-ADMIN-REFRESH-001\0.2.0\plan.md
docs/sdd\SPEC-SUIYIN-ADMIN-REFRESH-001\0.2.0\source-search.json
docs/handoffs\SPEC-SUIYIN-ADMIN-071\1.3.1\20260928\verification.md
docs/handoffs\SPEC-SUIYIN-ADMIN-071\1.3.1\20260928\spec.md
docs/handoffs\SPEC-SUIYIN-ADMIN-071\1.3.1\20260928\source-convergence.md
docs/sdd\SPEC-SUIYIN-ADMIN-071\1.3.1\verification.md
docs/sdd\SPEC-SUIYIN-ADMIN-071\1.3.1\spec.md
docs/sdd\SPEC-SUIYIN-ADMIN-071\1.3.1\source-convergence.md
docs/sdd\SPEC-SUIYIN-ADMIN-REFRESH-001\0.2.0\verification.md
docs/sdd\SPEC-SUIYIN-ADMIN-REFRESH-001\0.2.0\tasks.md
docs/sdd\SPEC-SUIYIN-ADMIN-REFRESH-001\0.2.0\spec.md
docs/sdd\SPEC-SUIYIN-ADMIN-052\1.2.0\issue-handoff.md
docs/sdd\SPEC-SUIYIN-ADMIN-053\1.0.2\tasks.md
docs/sdd\SPEC-SUIYIN-ADMIN-053\1.0.2\spec.md
docs/sdd\SPEC-SUIYIN-ADMIN-053\1.0.2\plan.md
docs/sdd\SPEC-SUIYIN-ADMIN-060\1.1.0\verification.md
docs/sdd\SPEC-SUIYIN-ADMIN-060\1.1.0\test-contract.md
docs/sdd\SPEC-SUIYIN-ADMIN-060\1.1.0\tasks.md
docs/sdd\SPEC-SUIYIN-ADMIN-060\1.1.0\spec.md
docs/sdd\SPEC-SUIYIN-ADMIN-060\1.1.0\source-search.txt
docs/sdd\SPEC-SUIYIN-ADMIN-060\1.1.0\README.md
docs/sdd\SPEC-SUIYIN-ADMIN-071\1.3.1\history\1.3.1-preview\spec.snapshot.md
docs/sdd\SPEC-SUIYIN-ADMIN-060\1.1.0\issue-handoff.md
docs/sdd\SPEC-SUIYIN-ADMIN-052\1.2.0\verification.md
docs/sdd\SPEC-SUIYIN-ADMIN-052\1.2.0\test-contract.md
docs/sdd\SPEC-SUIYIN-ADMIN-052\1.2.0\tasks.md
docs/sdd\SPEC-SUIYIN-ADMIN-052\1.2.0\spec.md
docs/sdd\SPEC-SUIYIN-ADMIN-052\1.2.0\source-search.json
docs/sdd\SPEC-SUIYIN-ADMIN-053\1.0.1\plan.md
docs/sdd\SPEC-SUIYIN-ADMIN-071\1.3.1\history\1.3.0\spec.snapshot.md
docs/sdd\SPEC-SUIYIN-ADMIN-053\1.0.1\tasks.md
docs/sdd\SPEC-SUIYIN-ADMIN-053\1.0.1\spec.md
docs/sdd\SPEC-SUIYIN-ADMIN-073\1.0.0\verification.md
docs/sdd\SPEC-SUIYIN-ADMIN-073\1.0.0\spec.md
docs/sdd\SPEC-SUIYIN-ADMIN-073\1.0.0\source-search.txt
docs/sdd\SPEC-SUIYIN-ADMIN-073\1.0.0\source-convergence.md
docs/sdd\SPEC-SUIYIN-ADMIN-073\1.0.0\README.md
docs/sdd\SPEC-SUIYIN-ADMIN-073\1.0.0\plan.md
docs/sdd\SPEC-SUIYIN-ADMIN-071\1.3.1\history\1.2.0\verification.md
docs/sdd\SPEC-SUIYIN-ADMIN-071\1.3.1\history\1.2.0\spec.snapshot.md
docs/sdd\SPEC-SUIYIN-ADMIN-071\1.3.1\history\1.2.0\source-convergence.md
docs/sdd\SPEC-SUIYIN-ADMIN-071\1.3.1\history\1.2.0\plan.md
docs/sdd\SPEC-SUIYIN-ADMIN-052\1.1.2\plan.md
docs/sdd\SPEC-SUIYIN-ADMIN-052\1.1.1\plan.md
docs/sdd\SPEC-SUIYIN-ADMIN-052\1.2.0\evidence\all-page-table-check.json
docs/sdd\SPEC-SUIYIN-ADMIN-071\1.3.1\history\1.1.0\verification.md
docs/sdd\SPEC-SUIYIN-ADMIN-071\1.3.1\history\1.1.0\spec.snapshot.md
docs/sdd\SPEC-SUIYIN-ADMIN-071\1.3.1\history\1.1.0\source-convergence.md
docs/sdd\SPEC-SUIYIN-ADMIN-071\1.3.1\history\1.0.0\spec.snapshot.md
docs/sdd\SPEC-SUIYIN-ADMIN-056\1.0.0\verification.md
docs/sdd\SPEC-SUIYIN-ADMIN-056\1.0.0\tasks.md
docs/sdd\SPEC-SUIYIN-ADMIN-056\1.0.0\spec.md
docs/sdd\SPEC-SUIYIN-ADMIN-051\1.1.0\deliveries\20260929-language-parity\tasks.md
docs/sdd\SPEC-SUIYIN-ADMIN-051\1.1.0\deliveries\20260929-language-parity\README.md
docs/sdd\SPEC-SUIYIN-ADMIN-051\1.1.0\deliveries\20260929-language-parity\plan.md
docs/sdd\SPEC-SUIYIN-ADMIN-056\1.0.0\evidence\evidence-audit\matrix.json
docs/sdd\SPEC-SUIYIN-ADMIN-051\1.1.0\public-data-audit.md
docs/sdd\SPEC-SUIYIN-ADMIN-053\1.0.0\plan.md
docs/sdd\SPEC-SUIYIN-ADMIN-053\1.0.0\verification.md
docs/sdd\SPEC-SUIYIN-ADMIN-053\1.0.0\tasks.md
docs/sdd\SPEC-SUIYIN-ADMIN-053\1.0.0\spec.md
docs/sdd\SPEC-SUIYIN-ADMIN-050\1.0.0\plan.md
docs/sdd\SPEC-SUIYIN-ADMIN-058\1.2.0\inventory.md
docs/sdd\SPEC-SUIYIN-ADMIN-071\1.1.0\verification.md
docs/sdd\SPEC-SUIYIN-ADMIN-071\1.1.0\spec.md
docs/sdd\SPEC-SUIYIN-ADMIN-071\1.1.0\source-convergence.md
docs/sdd\SPEC-SUIYIN-ADMIN-055\1.1.0\spec.md
docs/sdd\SPEC-SUIYIN-ADMIN-050\1.0.0\tasks.md
docs/sdd\SPEC-SUIYIN-ADMIN-050\1.0.0\spec.md
docs/sdd\SPEC-SUIYIN-ADMIN-055\1.1.0\evidence\all-page-table-check.json
docs/sdd\SPEC-SUIYIN-ADMIN-071\1.1.0\history\1.0.0\spec.snapshot.md
docs/sdd\SPEC-SUIYIN-ADMIN-058\1.2.0\history\spec-1.0.0.md
docs/sdd\SPEC-SUIYIN-ADMIN-058\1.2.0\history\spec-1.1.0.md
docs/sdd\SPEC-SUIYIN-ADMIN-058\1.2.0\source-convergence.md
docs/sdd\SPEC-SUIYIN-ADMIN-058\1.2.0\review-notes.md
docs/sdd\SPEC-SUIYIN-ADMIN-058\1.2.0\spec.md
docs/sdd\SPEC-SUIYIN-ADMIN-058\1.2.0\source-search.json
docs/sdd\SPEC-SUIYIN-ADMIN-058\1.2.0\tasks.md
docs/sdd\SPEC-SUIYIN-ADMIN-058\1.2.0\verification.md
docs/sdd\SPEC-SUIYIN-ADMIN-068\1.0.0\issue-handoff.md
docs/sdd\SPEC-SUIYIN-ADMIN-071\1.3.1\checks\v1.3.1\convergence-search-docs.json
docs/sdd\SPEC-SUIYIN-ADMIN-055\1.0.0\verification.md
docs/sdd\SPEC-SUIYIN-ADMIN-055\1.0.0\tasks.md
docs/sdd\SPEC-SUIYIN-ADMIN-055\1.0.0\spec.md
docs/sdd\SPEC-SUIYIN-ADMIN-055\1.0.0\source-convergence.md
docs/sdd\SPEC-SUIYIN-ADMIN-068\1.0.0\plan.md
docs/sdd\SPEC-SUIYIN-ADMIN-058\1.2.0\history\verification-1.0.0.md
docs/sdd\SPEC-SUIYIN-ADMIN-058\1.2.0\history\verification-1.1.0.md
docs/sdd\SPEC-SUIYIN-ADMIN-071\1.2.0\history\1.1.0\verification.md
docs/sdd\SPEC-SUIYIN-ADMIN-071\1.2.0\history\1.1.0\spec.snapshot.md
docs/sdd\SPEC-SUIYIN-ADMIN-071\1.2.0\history\1.1.0\source-convergence.md
docs/sdd\SPEC-SUIYIN-ADMIN-071\1.2.0\verification.md
docs/sdd\SPEC-SUIYIN-ADMIN-071\1.2.0\spec.md
docs/sdd\SPEC-SUIYIN-ADMIN-071\1.2.0\source-convergence.md
docs/sdd\SPEC-SUIYIN-ADMIN-071\1.2.0\plan.md
docs/sdd\SPEC-SUIYIN-ADMIN-062\1.0.0\verification.md
docs/sdd\SPEC-SUIYIN-ADMIN-068\1.0.0\verification.md
docs/sdd\SPEC-SUIYIN-ADMIN-062\1.0.0\source-search.txt
docs/sdd\SPEC-SUIYIN-ADMIN-068\1.0.0\test-contract.md
docs/sdd\SPEC-SUIYIN-ADMIN-068\1.0.0\tasks.md
docs/sdd\SPEC-SUIYIN-ADMIN-068\1.0.0\spec.md
docs/sdd\SPEC-SUIYIN-ADMIN-068\1.0.0\source-search.txt
docs/sdd\SPEC-SUIYIN-ADMIN-071\1.2.0\history\1.0.0\spec.snapshot.md
docs/sdd\SPEC-SUIYIN-ADMIN-054\1.0.0\docs-source-search.json
docs/sdd\SPEC-SUIYIN-ADMIN-054\1.0.0\roadmap.md
docs/sdd\SPEC-SUIYIN-ADMIN-054\1.0.0\source-convergence.md
docs/sdd\SPEC-SUIYIN-ADMIN-054\1.0.0\spec.md
docs/sdd\SPEC-SUIYIN-ADMIN-054\1.0.0\tasks.md
docs/sdd\SPEC-SUIYIN-ADMIN-054\1.0.0\verification.md
docs/sdd\SPEC-SUIYIN-ADMIN-055\1.0.0\evidence\evidence-audit\matrix.json
docs/sdd\SPEC-SUIYIN-ADMIN-068\1.0.0\checks\qa-evidence.md
docs/sdd\SPEC-SUIYIN-ADMIN-054\1.0.0\evidence\evidence-audit\matrix.json
docs/sdd\SPEC-SUIYIN-ADMIN-071\1.2.0\checks\v1.2.0\README.md
```

判读：命中文件属于已版本化规格或有日期的历史证据；不回写原批准合同。当前入口直接指向076@1.0.1及077@1.0.1。

## Q007 — 历史快照不可变检查

```text
git diff --name-only -- docs/sdd docs/history docs/handoffs
(no tracked historical file changes)
```

判读：搜索时未改写任何已跟踪历史SDD/历史文档。新076/077包由发布流程新增；既有版本不追溯改名。

## Q008 — 当前导航只读计数

方法：Node读取prototype/data/navigation-snapshot.json，遍历tenants[].menu及children，按具有route的节点计入口、按route去重计种类。

```json
{
  "tenants": 17,
  "entries": 814,
  "routes": 90,
  "newTenants": [
    {
      "tenant": "huamei-xian",
      "entries": 3
    },
    {
      "tenant": "aoli-xian",
      "entries": 3
    }
  ]
}
```

判读：与当前README/CLAUDE/PRD的17/814/90一致。新增六个入口是最小待采集原型框架，不计为真实页面采集。
