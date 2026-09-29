# 碎银管理后台 HTML 原型

这是十五租户的静态管理后台原型，用于对照真实页面、评审操作和统计规则。2026-09-29 按当前导航登记 **15 个租户、808 个租户×页面入口、90 种路由**。其中783个入口属于2026-09-27源环境采集队列，741个可见页面已有有效DOM和截图，42个保持源隐藏状态；另有13个既有AI费用原型扩展、6个艺星回访规则及6个艺星辅助线管理入口。工具管理是结构父级，不计业务路由；新增原型不计入实站采集页数，采集覆盖不等于全部页面、全部状态逐像素一致。

本轮[073@1.0.0](docs/sdd/SPEC-SUIYIN-ADMIN-073/1.0.0/README.md)把全部租户原一级话术的位置改为「工具管理 → 话术管理」，保留原路由、隐藏/权限和本地话术状态；所有艺星另有「辅助线管理」，自行维护分类、透明PNG、顺序与启停，显式保存草稿并预览PC效果。现有默认和门店来源均可编辑，每个租户一套独立配置。初始16类129条123文件来自本地PC原型，明确为演示来源，不证明各店最新生产清单已经迁移。

2026-09-27按各租户来源刷新导航、品牌和专用页面，新增录音及喜报共25个租户×页面；2026-09-28回访规则覆盖深圳、成都、北京、广州、杭州、嘉兴六艺星并补齐15个回访基准，见071合同。数据包含本租户脱敏采样、明确标识的参考样本和合成演示；不是实时后台，所有修改只影响本地原型。

2026-09-29话术管理按15租户本轮来源重新对齐：保留各自1246个分类节点、真实父子关系、按钮状态和默认未选分类画面；已采42个已采列表分类、155条列表样本、48条话术详情，16项图片/视频采用占位符。分类、标题和安全模板正文尽量保留本租户内容；未采集的详情、范围和选项保持未知，不填统一话术。见[话术产品说明](prd/language-manage.md)、[051@1.1.0本轮交付补充](docs/sdd/SPEC-SUIYIN-ADMIN-051/1.1.0/deliveries/20260929-language-parity/README.md)与[验收范围](docs/verification/language-parity-20260929/README.md)。

- [好友列表](https://suiyin-admin.pages.dev/prototype/_shell.html?tenant=bzds&page=customerManagement) · [录音管理](https://suiyin-admin.pages.dev/prototype/_shell.html?tenant=rxxz&page=recordingAdmin) · [喜报设置](https://suiyin-admin.pages.dev/prototype/_shell.html?tenant=yestar-hz&page=goodNewsSettings)
- 工具管理 → 话术管理：[深圳艺星](https://suiyin-admin.pages.dev/prototype/_shell.html?tenant=yestar-sz&page=languageManage) · [佰智德三](https://suiyin-admin.pages.dev/prototype/_shell.html?tenant=bzds&page=languageManage) · [萌爪](https://suiyin-admin.pages.dev/prototype/_shell.html?tenant=mengzhua&page=languageManage) · [话术交互流程](flowcharts/language-manage.md)
- 工具管理 → 辅助线管理：[深圳艺星](https://suiyin-admin.pages.dev/prototype/_shell.html?tenant=yestar-sz&page=guideLineManage) · [北京艺星](https://suiyin-admin.pages.dev/prototype/_shell.html?tenant=yestar-bj&page=guideLineManage) · [073交付合同](docs/sdd/SPEC-SUIYIN-ADMIN-073/1.0.0/README.md)
- 回访规则：[深圳](https://suiyin-admin.pages.dev/prototype/_shell.html?tenant=yestar-sz&page=revisitRules) · [成都](https://suiyin-admin.pages.dev/prototype/_shell.html?tenant=yestar&page=revisitRules) · [北京](https://suiyin-admin.pages.dev/prototype/_shell.html?tenant=yestar-bj&page=revisitRules) · [广州](https://suiyin-admin.pages.dev/prototype/_shell.html?tenant=yestar-gz&page=revisitRules) · [杭州](https://suiyin-admin.pages.dev/prototype/_shell.html?tenant=yestar-hz&page=revisitRules) · [嘉兴](https://suiyin-admin.pages.dev/prototype/_shell.html?tenant=yestar-jx&page=revisitRules) · [071@1.3.1交付合同](docs/sdd/SPEC-SUIYIN-ADMIN-071/1.3.1/README.md)
- [当前产品说明](prd/admin-live-reference.md) · [交互流程](flowcharts/admin-live-reference.md) · [设计规范](docs/design-spec.md)
- [2026-09-27刷新合同](docs/sdd/SPEC-SUIYIN-ADMIN-REFRESH-001/0.2.0/README.md) · [公开验证摘要](docs/verification/live-refresh-20260927/README.md) · [公开样本审计](docs/verification/live-refresh-20260927/public-data-audit.md)
- [验收与已知边界](docs/verification/admin-live-reference.md) · [离线单文件](prototype/_shell_inline.html)

## 艺星回访规则

按 [071@1.3.1](docs/sdd/SPEC-SUIYIN-ADMIN-071/1.3.1/README.md)，六个现有艺星租户各自提供「聊天管理 → 回访规则」；普通菜单同步本租户入口，德三平台菜单复用唯一对应定义，不向非艺星新增。一条“添加好友后回访”规则包含第3、5、7天等节点，名称、目的、账号群组/账号、回访基准和每日筛选时间共用；节点独立配置选中与排除，继承群发21项选中、26项排除维度。节点条件可复制，但目标天数、说明和共享设置不变；后续各自独立，保存整条规则才生效。回访基准在原下拉中直接选择15项：5个日期（含预约日期）、成为A/B/C/D级，以及首次/最近一次到店、购买、划扣6个独立选项；等级另选人工或AI，事件无需再选一次取值方式。

账号群组表示渠道归属；应回访好友仅对具有其所属账号接待权限的销售可见。当前仅交付管理页和权限行为合同，PC真实名单、真实定时筛选、自动发送及执行质检均未实施。示例试算使用本租户独立的固定合成数据，已排除、未入选和无法判断分别显示；新增五店不借用深圳账号、人员或好友充当该店事实。规则只在当前浏览器按租户保存；深圳既有稳定ID、用户规则和菜单调整保留，新版v2与旧版v1分开，旧规则只读保留，可明确开始新版示例或逐条导入未启用草稿，不自动猜测合并。

等级按所选来源最近一次真正进入目标等级起算，同级重复评定不重置；后来变为其他等级不会自动加上当前等级筛选。事件只使用截至运行时已发生的记录，未知或损坏历史显示无法判断，明确空历史或尚未发生则未入选；不从当前等级或其他日期猜测。原5日期与旧事件配置兼容，打开、取消不迁写旧存储。

此前撤回的是移动到群发、增加群发规则及向全部系统租户扩展的提议；六艺星已按后续明确授权补齐，非艺星不增加入口。1.0.0将时间节点拆成顶层规则的模型已由1.1.0替代，1.2.0继续沿用共享设置与独立节点；旧版仅保留为历史。

## 2026-09-27刷新实际验证

| 范围 | 结果 |
|---|---|
| 当前导航与完整库存 | 15租户；保留源隐藏项、平台限制和本地改名/隐藏/拖动覆盖；7项设置迁移检查通过 |
| 普通及艺星好友 | 15租户，381项几何、161项交互/控件检查通过 |
| 通用列表 | 410份布局配置中395页实际测量通过，15页由专用渲染器承接；覆盖64种路由＋表头组合 |
| 录音、喜报、质检、词库与平台专用主体 | 54个租户×页面通过；专用弹层12项交叉检查通过 |
| 备注需求词库及拉新 | 65项本地检查通过；需求组、警示空态、日期与导出边界按本租户保留 |
| 专用统计及主列表尾差 | 初轮107项、最终补充81项几何通过；后者包括厚全商品榜、成都拉群、瑞熙小周统计、销售管理及全部账号状态 |

同源视口与DPR对照采用1 CSS px几何容差；395个通用列表的表格起点纵向最大偏差0.006px、横向0px、宽度最大偏差0.409px。记录中的JS错误与外部请求均为0。上述分组可能覆盖相同页面，不相加作为独立页面数；截图行内容、头像、实时总量及未采曲线不纳入全图像素相等声明。

## 保留的行为合同

| 合同 | 当前职责 |
|---|---|
| [073@1.0.0](docs/sdd/SPEC-SUIYIN-ADMIN-073/1.0.0/README.md) | 全部租户工具父级及话术入口迁移；全部艺星辅助线分类/图片自助维护、租户隔离草稿、异常重试、离开守卫与PC效果预览；限定替代旧一级话术和固定库在Admin中的范围 |
| [071@1.3.1](docs/sdd/SPEC-SUIYIN-ADMIN-071/1.3.1/README.md) | 六个现有艺星租户回访规则；共享设置与独立时间节点、节点条件复制、15个回访基准、账号接待权限合同、独立合成数据与存储、旧配置兼容 |
| [REFRESH-001@0.2.0](docs/sdd/SPEC-SUIYIN-ADMIN-REFRESH-001/0.2.0/README.md) | 录音与喜报三新页面、对应入口迁移、本地演示及证据边界；既有页面继续各自原合同 |
| [051@1.1.0](docs/sdd/SPEC-SUIYIN-ADMIN-051/1.1.0/README.md)及[9月29日话术交付补充](docs/sdd/SPEC-SUIYIN-ADMIN-051/1.1.0/deliveries/20260929-language-parity/README.md) | 十五租户、Shell、领域页面及公开样本基线；话术树、末级列表、编辑表单与按租户采样，沿用既有R/AC |
| [052@1.2.0](docs/sdd/SPEC-SUIYIN-ADMIN-052/1.2.0/README.md) | 变声独立任务首次成功计次；失败、试听、重复回调不重复计 |
| [053@1.0.2](docs/sdd/SPEC-SUIYIN-ADMIN-053/1.0.2/README.md) | 销售使用统计分组、日期、部门、小计/合计及租户隔离 |
| [054@1.0.0](docs/sdd/SPEC-SUIYIN-ADMIN-054/1.0.0/README.md)、[055@1.1.0](docs/sdd/SPEC-SUIYIN-ADMIN-055/1.1.0/README.md)、[056@1.0.0](docs/sdd/SPEC-SUIYIN-ADMIN-056/1.0.0/README.md) | 页面证据、筛选与表头冻结、领域结构 |
| [060@1.1.0](docs/sdd/SPEC-SUIYIN-ADMIN-060/1.1.0/README.md)、[068@1.0.0](docs/sdd/SPEC-SUIYIN-ADMIN-068/1.0.0/README.md) | 平台默认结构、各租户菜单拖动、局部覆盖与同租户导航联动 |
| [062@1.0.0](docs/sdd/SPEC-SUIYIN-ADMIN-062/1.0.0/README.md) | 四个既有预约入口的列表/总量/柱线组合图 |
| [058@1.2.0](docs/sdd/SPEC-SUIYIN-ADMIN-058/1.2.0/README.md) | 13租户AI费用、82天固定合成样本、分类趋势与模型 |

菜单表与导航共用有效完整树。平台提供默认顺序和归属，租户明确调整的同级列表及被移动项父级优先；平台当前祖先链隐藏、删除和原权限始终生效。073只迁移指定工具/话术层级，其他合法覆盖保留，隐藏话术不复活；平台登记辅助线不授予非艺星业务权限。旧快照中的默认位置不当作用户明确拖动，也不删除已批准的拖动、预约图表和统计扩展。

变声页补回本轮已见的销售姓名筛选，仍按稳定销售身份计次，姓名相同不合并。销售使用统计只读取本租户专用快照；未知日期或未采集时保留表头与说明，不补0或借其他租户总量。工作账号样本汇总不冒充跨账号去重人数。

## 预览与发布边界

在仓根运行 `python -m http.server 8148 --bind 127.0.0.1`，用Google Chrome打开 `http://127.0.0.1:8148/prototype/_shell.html?tenant=yestar-sz&page=guideLineManage`，也可从工具管理进入话术。业务演示状态按租户与路由隔离；辅助线未解决队列和草稿均受离开保护，已保存为空不恢复默认。验收使用隔离浏览器或独立QA存储。单文件由生成器产出，不手工编辑。

真实后台只读；不接真实认证、发送、录音上传、共享数据库或生产写接口。原始客户截图、DOM捕获、连接配置和本机诊断资料不放入公开包。未采曲线点、其他筛选区间和未查看详情继续明确为未知或未采集。

本轮交付标签为 `v2026092902-admin-tools-guide-lines`，实际提交、单文件验收、tag推送和远端部署以 [release.json](release.json) 与发布回执为准；文档链接不单独证明已经部署。旧 [2026-09-20纠偏](docs/verification/pixel-correction-20260920.md)、[冻结验收](docs/verification/filters-sticky-20260920.md) 和版本化SDD仅证明各自当时范围。旧主题及好友独立页见 [历史入口](docs/history/before-admin-live-reference/README.md)，不作为当前Shell实现指令。

原型发布不等于生产上线。本次Admin工程Issue已创建为[#442](https://github.com/PetWebOrg/suiyin-admin/issues/442)，负责人王梓先（`build996`），提出环境佰智德三、提出人房昕，当前为`status:todo`；执行以[073交接合同](docs/sdd/SPEC-SUIYIN-ADMIN-073/1.0.0/issue-handoff.md)与[Test Contract](docs/sdd/SPEC-SUIYIN-ADMIN-073/1.0.0/test-contract.md)为准。既有销售变声[#401](https://github.com/PetWebOrg/suiyin-admin/issues/401)、AI费用[#402](https://github.com/PetWebOrg/suiyin-admin/issues/402)、预约图表[#404](https://github.com/PetWebOrg/suiyin-admin/issues/404)、租户菜单[#432](https://github.com/PetWebOrg/suiyin-admin/issues/432)仍由各自精确合同承接。15租户是原型验证清单，不是生产白名单；不更新开发进度表。
