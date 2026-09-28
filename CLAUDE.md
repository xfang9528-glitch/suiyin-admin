# 碎银 Admin 原型维护入口

2026-09-28回访规则执行[071@1.2.0](docs/sdd/SPEC-SUIYIN-ADMIN-071/1.2.0/README.md)：深圳、成都、北京、广州、杭州、嘉兴六个现有艺星租户各自提供「聊天管理 → 回访规则」，`revisitRules`为合成原型扩展。共享规则设置与多个独立时间节点是当前模型；1.0.0“每节点一条顶层规则”的方案已被替代。用户此前撤回的移动到群发、增加群发规则和向全部系统租户扩展仍不实施；本次明确授权六艺星补齐，非艺星不加入口。

2026-09-27新增录音/喜报三页及对应入口迁移由[REFRESH-001@0.2.0](docs/sdd/SPEC-SUIYIN-ADMIN-REFRESH-001/0.2.0/README.md)承接；当前基线为 SPEC-SUIYIN-ADMIN-051@1.1.0；本轮销售变声统计 052@1.2.0、使用统计纠偏 053@1.0.2、全页对齐 054@1.0.0、055@1.1.0、056@1.0.0 分别拥有自己的行为范围；AI费用、分类趋势与专属模型执行 058@1.2.0。预约记录总量、每日柱形与期间累计折线执行062@1.0.0；仅现有四个入口，保留默认列表及全量筛选，源样本与合成演示分离。先读 README.md、docs/design-spec.md 和相应版本化 SDD。050 仅在未被后续合同替代的导航范围内适用。当前筛选与表头冻结见 [验收记录](docs/verification/filters-sticky-20260920.md)；上一轮四页截图纠偏与证据边界见 [发布勘误](docs/sdd/pixel-correction-20260920.md) 和 [实测记录](docs/verification/pixel-correction-20260920.md)。

## 运行与交付

- 纯 HTML/CSS/JavaScript、静态 JSON/资源及本地演示，不接真实认证或写 API。
- 真实后台只读；查看或展开后取消，不保存、删除、发送或发布。
- 只维护本仓，不进入 Flutter / React / Go 生产仓。
- 日常仅迭代原型并尝试 Google Chrome 预览；明确“完整推送”才同步 PRD、流程、设计、单文件和远端 SDD，并按工作区规则 direct-master commit/push/tag。
- 不创建、更新或对账 APP/PC 开发进度表；工程 Issue 需另行明确指令。以真实远端回执判定交付，不把本机检查当部署。

## 主线结构

- `prototype/_shell.html`、`admin-navigation.js/css`、`admin-menu-state.js`：租户、导航、页签、菜单本地覆盖。
- `admin-content.html/js/css`：内容入口、来源表单、筛选及列表基础。
- `admin-domain-views.js`、`admin-expanded-flows.js`、`admin-extra-flows.js`、`admin-chat.js`、`admin-page-editors.js`：领域结构与本地交互。
- `admin-menu-tree.js/css`：普通及平台菜单专用树表。
- `admin-sales-voice-stats.js/css`、`admin-sales-usage.js/css`：独立变声计数、使用统计分组和租户隔离。
- `admin-ai-cost-stats.js/css`：AI费用统计、82天固定合成样本、模型快照及分类趋势；路由 aiCostStats。
- `admin-revisit-rules-model.js`、`admin-revisit-rules.js/css`：按tenant创建独立回访模型、合成条件计算与规则内节点编辑；`revisitRules`只匹配 `yestar-sz`、`yestar`、`yestar-bj`、`yestar-gz`、`yestar-hz`、`yestar-jx`，未知租户不回退深圳。
- `admin-stats-date-picker.js/css`、`admin-filter-calendars.js/css`：日期输入、选择、草稿和取消。
- `admin-table-sticky.js/css`：所有当前 Shell 管理表格在所属滚动区内冻结表头，支持多层表头、横向对齐、弹窗及重绘。
- `admin-new-added-records.js/css`、`admin-message-stats-aligned.js/css`、`admin-ai-stats-aligned.js/css`：7租户当日已采拉新空态、消息单卡图表、AI同租户专用统计。
- `admin-pixel-parity.css`、`admin-voice-pixel.css`：共享白色内容背景与使用/变声颜色纠偏；页面几何仍各自负责。
- `admin-sales-dashboard.js/css`、`admin-appointment-aligned.js`、`admin-customer-source-controls.js`：领域纠偏。
- `admin-live-ui.css`、`data/live-ui-reference.js`、`data/form-schemas.js`、`data/button-states.js`、`data/page-evidence.js`：来源样式、表单、按钮与证据边界。
- `data/navigation-snapshot.json`、`data/content/`、`data/sales-usage/`、`data/sales-dashboard/`、`data/ai-stats/`：分租户数据；`data/new-added-records.js`保存7租户各自已采日期与确认空态。以实际加载引用为准，不能把旧通用内容矩阵当作专用模块的有效来源。
- `_shell_inline.html`：生成的单文件，不手工修改派生产物。

## 当前约定

1. 2026-09-28当前导航登记15租户、802页面入口、89路由；783个源队列入口中741可见已采、42保持隐藏，另有13个批准AI费用扩展和6个现有艺星回访规则合成入口；不从平台目录或 PC ENV_ORDER 增加环境。796入口/88路由仅为2026-09-27刷新时基线。
2. 同名菜单按稳定 route/identity 区分；菜单表与导航由同一有效完整树派生，隐藏库存独立保留。DR-095：数据展示新增项同次补齐适用租户菜单管理和已有平台定义。普通 menu 按 068@1.0.0 在全部 15 租户支持一级整组、二级组内/跨组拖动，六列顺序只读，编辑不再输入排序号；成功、撤销、刷新联动本租户侧栏。060@1.1.0 的平台拖动继续有效；平台提供默认顺序与归属，租户明确调整过的同级列表及被跨组移动项的父级按 068 优先，其余继续跟平台。平台当前祖先链隐藏/删除及原权限独立生效，不能通过跨组绕过。旧060版本包保持历史，不用于否定068的限定覆盖。原型15租户是验证清单，不是生产白名单。
3. Shell 青绿不等于各页主按钮青绿。既有回访统计 `revisitStats` 的搜索保留截图蓝色；新增回访规则 `revisitRules` 按071新设计使用 #07c160 主操作，不冒充实站采样。2026-09-20 用户提供使用统计实站截图后，使用/变声主操作修正为 #00c4af。AI 搜索为 #07c160；其他页面按各自证据保留。
4. 字段、按钮、日期、列对齐、分页按来源，禁止无条件加汇总卡、工具栏或分页。菜单、聊天、配置、图表、好友页保留专用结构。
5. 实体选项严格租户及页面边界。来源说明区分本租户采样、部分样本、参考、演示、未采集；加载中不是确认空态。销售使用与 AI 专用统计不跨租户回退。深圳 AI 为 22 行截图部分样本，多部门缺分配时不向首部门归数；拉新仅对已采日期及条件显示真实零条。
6. 变声首次成功独立任务计 1，失败/试听/同任务重试不重复计。其日期与部门继续复用使用统计的单日/范围、日历、快捷日和搜索/重置/导出，本轮追加源已见销售姓名框；模式和输入为草稿，快捷日立即查询并保留当前模式，重置回单日今天。两页保留各自来源，不用样本日替换运行日。使用统计无分页，销售组排序不拆散小计，CSV 不重复计合计；变声保留次数分页与全筛选导出。
7. AI辅助消息统计业务继续 009@1.0.0，工作账号触达继续 042@1.0.0；不能以视觉修复改指标。人工操作和视觉按真实覆盖报告，DOM通过不能证明全部像素一致。
8. 所有管理表格表头在各自滚动可见区顶部冻结，表格结束后退出；多行表头整体保留且不覆盖，横向与正文同步，原排序/选择/焦点仍可操作。短表不造滚动，空态不造行，不改字段、数据和分页；日历、下拉及弹窗层级保持可用。
9. 本轮15租户导航与741个可见源页已采，395个通用列表、15租户好友及专用页面按记录范围验证；当前结果见[公开摘要](docs/verification/live-refresh-20260927/README.md)。752入口等旧数字只作历史。未采图表点和展开状态仍未知，不用本地检查或发布成功宣称全部状态像素一致。
10. 既有销售变声工程已创建 [管理页销售变声统计 #401](https://github.com/PetWebOrg/suiyin-admin/issues/401)：深圳艺星 / ZHONG / PC，负责人陈宣宇（cxy-chenxuanyu），绑定 052@1.2.0。工程覆盖生产租户注册表中全部适用租户；本原型 15 个租户仅为验证清单，不能限制生产范围。状态与测试映射以远端 Handoff 为准；此授权不等于在本仓流程中实现生产代码或将全部表格冻结扩成另一个工程任务。

11. AI费用统计按 058@1.2.0：13 个已有 AI 父级的租户追加同一 aiCostStats；jbfs/hqjd不新增父级。四列为分析项目、专属模型、分析次数、费用；固定 2026-07-01 至 09-20 共 82 天。类别只影响趋势，表格保持五类；金额未知不为零，业务次数不等于模型请求或辅助消息数。模型使用记录快照；10份reference配置标演示，不编版本或独占训练能力。工程执行只回链058 Handoff，不复用052的Issue授权和范围。

12. 回访071@1.2.0：整条规则共用名称/目的、账号群组与账号、回访基准、每日时间和启停；节点只设非重复的第N天、说明及独立21项选中/26项排除。选中AND、排除OR；节点到期与附加日期约束共同满足，不依赖上一节点完成。复制只替换目标节点条件，目标时间/身份/说明和共享设置不变；有旧条件明确确认替换，保存整条才生效。不得恢复顶层逐节点规则或整套复制入口。至少一个节点、失败与取消守卫保留。

13. 回访存储使用 `admin-revisit-rules:v2:<tenant>`，六艺星的账号、人员、地区、好友、规则与状态均按tenant隔离，不把其他租户或深圳的实体作为缺省值。新增五店使用独立合成示例并明确标识；深圳既有模型API、稳定ID及原存储键和值保持兼容。`qa=1`使用独立 `admin-qa-` 前缀；旧v1键只读保留，不静默清除或自动合并。逐条导入只有唯一明确的日期relative-day条件才能转为基准与单节点，其余条件保留，先成为未启用草稿；不明确时说明原因。保存失败不改变已存规则，损坏数据先重试或明确恢复。销售结果按当前账号接待权限可见是合同，不代表PC名单界面、真实调度、共享持久化或发送已经实施。

14. 六艺星各自 `menu` 和侧栏均登记一次 `revisitRules`，成都/北京挂 `group-9`，深圳/广州/杭州/嘉兴挂 `group-10`；德三 `allMenu` 复用已有唯一平台定义，不重复插入，也不因此向非艺星开放。新增五店菜单迁移按缓存revision对应的已发布完整基线比较，保留更老fallback、删除、隐藏、改名与排序；沿用 `revisit-rules-v1` 迁移标记，深圳既有用户选择不重新激活。

旧主题、菜单及好友独立页已归档，只解释历史。当前指令以本文件、设计规范和对应精确版本合同为准。

AI费用统计工程Issue已建立：[#402](https://github.com/PetWebOrg/suiyin-admin/issues/402)，陈宣宇（cxy-chenxuanyu），提出人房昕、环境佰智德三、平台PC。原型发布标签 `v2026092004-admin-ai-cost-stats`；实现与生产验收待正式工程流程。
