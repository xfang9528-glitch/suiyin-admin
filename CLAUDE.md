# 碎银 Admin 原型维护入口

当前基线为 SPEC-SUIYIN-ADMIN-051@1.1.0；本轮销售变声统计 052@1.1.2、使用统计纠偏 053@1.0.1、全页对齐 054/055/056@1.0.0 分别拥有自己的行为范围。先读 README.md、docs/design-spec.md 和相应版本化 SDD。050 仅在未被后续合同替代的导航范围内适用。本轮四页截图纠偏与证据边界见 [发布勘误](docs/sdd/pixel-correction-20260920.md) 和 [实测记录](docs/verification/pixel-correction-20260920.md)。

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
- `admin-stats-date-picker.js/css`、`admin-filter-calendars.js/css`：日期输入、选择、草稿和取消。
- `admin-new-added-records.js/css`、`admin-message-stats-aligned.js/css`、`admin-ai-stats-aligned.js/css`：深圳拉新空态、消息单卡图表、AI 同租户专用统计。
- `admin-pixel-parity.css`、`admin-voice-pixel.css`：共享白色内容背景与使用/变声颜色纠偏；页面几何仍各自负责。
- `admin-sales-dashboard.js/css`、`admin-appointment-aligned.js`、`admin-customer-source-controls.js`：领域纠偏。
- `admin-live-ui.css`、`data/live-ui-reference.js`、`data/form-schemas.js`、`data/button-states.js`、`data/page-evidence.js`：来源样式、表单、按钮与证据边界。
- `data/navigation-snapshot.json`、`data/content/`、`data/sales-usage/`、`data/sales-dashboard/`、`data/ai-stats/`：分租户数据；`data/new-added-records.js` 仅保存深圳拉新已知默认空态。以实际加载引用为准，不能把旧通用内容矩阵当作专用模块的有效来源。
- `_shell_inline.html`：生成的单文件，不手工修改派生产物。

## 当前约定

1. 15 租户、752 页面入口、84 路由为当前登记范围；不从平台目录或 PC ENV_ORDER 增加环境。
2. 同名菜单按稳定 route/identity 区分；可见导航与完整库存分开。DR-095：数据展示新增项同次补齐适用租户菜单管理和已有平台定义，验证本租户联动。
3. Shell 青绿不等于各页主按钮青绿。回访保留截图蓝色；2026-09-20 用户提供使用统计实站截图后，使用/变声主操作修正为 #00c4af。AI 搜索为 #07c160；其他页面按各自证据保留。
4. 字段、按钮、日期、列对齐、分页按来源，禁止无条件加汇总卡、工具栏或分页。菜单、聊天、配置、图表、好友页保留专用结构。
5. 实体选项严格租户及页面边界。来源说明区分本租户采样、部分样本、参考、演示、未采集；加载中不是确认空态。销售使用与 AI 专用统计不跨租户回退。深圳 AI 为 22 行截图部分样本，多部门缺分配时不向首部门归数；拉新仅对已采日期及条件显示真实零条。
6. 变声首次成功独立任务计 1，失败/试听/同任务重试不重复计；日期直接区间。销售使用统计保留原单日/范围，无分页，销售组排序不拆散小计；CSV不重复计合计。
7. AI 统计业务继续 009@1.0.0，工作账号触达继续 042@1.0.0；不能以视觉修复改指标。人工操作和视觉按真实覆盖报告，DOM通过不能证明全部像素一致。
8. 本轮已有四页独立本地 Chrome 截图、锚点测量与交互证据；当前实站在线复核未完成，仍有边缘、排序图标和滚动误差。Chrome 连接缺口、未采集展开/图表和离线 file 检查见验收记录；不要用本地检查或发布成功宣称实站像素验收完成。

旧主题、菜单及好友独立页已归档，只解释历史。当前指令以本文件、设计规范和对应精确版本合同为准。
