# 碎银 Admin 原型维护入口

当前基线为 SPEC-SUIYIN-ADMIN-051@1.1.0；本轮销售变声统计 052@1.2.0、使用统计纠偏 053@1.0.2、全页对齐 054@1.0.0、055@1.1.0、056@1.0.0 分别拥有自己的行为范围；AI费用、分类趋势与专属模型执行 058@1.2.0。先读 README.md、docs/design-spec.md 和相应版本化 SDD。050 仅在未被后续合同替代的导航范围内适用。当前筛选与表头冻结见 [验收记录](docs/verification/filters-sticky-20260920.md)；上一轮四页截图纠偏与证据边界见 [发布勘误](docs/sdd/pixel-correction-20260920.md) 和 [实测记录](docs/verification/pixel-correction-20260920.md)。

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
- `admin-stats-date-picker.js/css`、`admin-filter-calendars.js/css`：日期输入、选择、草稿和取消。
- `admin-table-sticky.js/css`：所有当前 Shell 管理表格在所属滚动区内冻结表头，支持多层表头、横向对齐、弹窗及重绘。
- `admin-new-added-records.js/css`、`admin-message-stats-aligned.js/css`、`admin-ai-stats-aligned.js/css`：深圳拉新空态、消息单卡图表、AI 同租户专用统计。
- `admin-pixel-parity.css`、`admin-voice-pixel.css`：共享白色内容背景与使用/变声颜色纠偏；页面几何仍各自负责。
- `admin-sales-dashboard.js/css`、`admin-appointment-aligned.js`、`admin-customer-source-controls.js`：领域纠偏。
- `admin-live-ui.css`、`data/live-ui-reference.js`、`data/form-schemas.js`、`data/button-states.js`、`data/page-evidence.js`：来源样式、表单、按钮与证据边界。
- `data/navigation-snapshot.json`、`data/content/`、`data/sales-usage/`、`data/sales-dashboard/`、`data/ai-stats/`：分租户数据；`data/new-added-records.js` 仅保存深圳拉新已知默认空态。以实际加载引用为准，不能把旧通用内容矩阵当作专用模块的有效来源。
- `_shell_inline.html`：生成的单文件，不手工修改派生产物。

## 当前约定

1. 15 租户、765 页面入口、85 路由为当前登记范围；不从平台目录或 PC ENV_ORDER 增加环境。
2. 同名菜单按稳定 route/identity 区分；可见导航与完整库存分开。DR-095：数据展示新增项同次补齐适用租户菜单管理和已有平台定义，验证本租户联动。
3. Shell 青绿不等于各页主按钮青绿。回访保留截图蓝色；2026-09-20 用户提供使用统计实站截图后，使用/变声主操作修正为 #00c4af。AI 搜索为 #07c160；其他页面按各自证据保留。
4. 字段、按钮、日期、列对齐、分页按来源，禁止无条件加汇总卡、工具栏或分页。菜单、聊天、配置、图表、好友页保留专用结构。
5. 实体选项严格租户及页面边界。来源说明区分本租户采样、部分样本、参考、演示、未采集；加载中不是确认空态。销售使用与 AI 专用统计不跨租户回退。深圳 AI 为 22 行截图部分样本，多部门缺分配时不向首部门归数；拉新仅对已采日期及条件显示真实零条。
6. 变声首次成功独立任务计 1，失败/试听/同任务重试不重复计。其筛选完整复用使用统计的单日/范围、日历、快捷日、部门和搜索/重置/导出；模式和输入为草稿，快捷日立即查询并保留当前模式，重置回单日今天。两页保留各自来源，不用样本日替换运行日。使用统计无分页，销售组排序不拆散小计，CSV 不重复计合计；变声保留次数分页与全筛选导出。
7. AI辅助消息统计业务继续 009@1.0.0，工作账号触达继续 042@1.0.0；不能以视觉修复改指标。人工操作和视觉按真实覆盖报告，DOM通过不能证明全部像素一致。
8. 所有管理表格表头在各自滚动可见区顶部冻结，表格结束后退出；多行表头整体保留且不覆盖，横向与正文同步，原排序/选择/焦点仍可操作。短表不造滚动，空态不造行，不改字段、数据和分页；日历、下拉及弹窗层级保持可用。
9. 上一轮 752 入口盘点、665 张表格和 333 个实际滚动场景无失败，筛选对比与独立冻结复核见验收记录。上一轮四页像素和当前实站在线复核缺口保留，不用本地检查或发布成功宣称实站像素验收完成。
10. 既有销售变声工程已创建 [管理页销售变声统计 #401](https://github.com/PetWebOrg/suiyin-admin/issues/401)：深圳艺星 / ZHONG / PC，负责人陈宣宇（cxy-chenxuanyu），绑定 052@1.2.0。工程覆盖生产租户注册表中全部适用租户；本原型 15 个租户仅为验证清单，不能限制生产范围。状态与测试映射以远端 Handoff 为准；此授权不等于在本仓流程中实现生产代码或将全部表格冻结扩成另一个工程任务。

11. AI费用统计按 058@1.2.0：13 个已有 AI 父级的租户追加同一 aiCostStats；jbfs/hqjd不新增父级。四列为分析项目、专属模型、分析次数、费用；固定 2026-07-01 至 09-20 共 82 天。类别只影响趋势，表格保持五类；金额未知不为零，业务次数不等于模型请求或辅助消息数。模型使用记录快照；10份reference配置标演示，不编版本或独占训练能力。工程执行只回链058 Handoff，不复用052的Issue授权和范围。

旧主题、菜单及好友独立页已归档，只解释历史。当前指令以本文件、设计规范和对应精确版本合同为准。

AI费用统计工程Issue已建立：[#402](https://github.com/PetWebOrg/suiyin-admin/issues/402)，陈宣宇（cxy-chenxuanyu），提出人房昕、环境佰智德三、平台PC。原型发布标签 `v2026092004-admin-ai-cost-stats`；实现与生产验收待正式工程流程。
