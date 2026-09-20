# 碎银 Admin 原型维护入口

当前基线为 SPEC-SUIYIN-ADMIN-051@1.1.0；本轮销售变声统计 052@1.1.1、使用统计纠偏 053@1.0.0、全页对齐 054/055/056@1.0.0 分别拥有自己的行为范围。先读 README.md、docs/design-spec.md 和相应版本化 SDD。050 仅在未被后续合同替代的导航范围内适用。

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
- `admin-sales-dashboard.js/css`、`admin-appointment-aligned.js`、`admin-customer-source-controls.js`：领域纠偏。
- `admin-live-ui.css`、`data/live-ui-reference.js`、`data/form-schemas.js`、`data/button-states.js`、`data/page-evidence.js`：来源样式、表单、按钮与证据边界。
- `data/navigation-snapshot.json`、`data/content/`、`data/sales-usage/`、`data/sales-dashboard/`：分租户数据。以实际资源目录和加载引用为准。
- `_shell_inline.html`：生成的单文件，不手工修改派生产物。

## 当前约定

1. 15 租户、752 页面入口、84 路由为当前登记范围；不从平台目录或 PC ENV_ORDER 增加环境。
2. 同名菜单按稳定 route/identity 区分；可见导航与完整库存分开。DR-095：数据展示新增项同次补齐适用租户菜单管理和已有平台定义，验证本租户联动。
3. Shell 青绿不等于各页主按钮青绿。回访有用户截图蓝色证据；使用/变声暂按同后台蓝色参照，当前路由视觉仍待复核；账号保留直接采样青绿。
4. 字段、按钮、日期、列对齐、分页按来源，禁止无条件加汇总卡、工具栏或分页。菜单、聊天、配置、图表、好友页保留专用结构。
5. 实体选项严格租户及页面边界。可见来源说明区分本租户采样、参考样本、演示、未采集；加载中不是确认空态。销售使用统计不跨租户回退。
6. 变声首次成功独立任务计 1，失败/试听/同任务重试不重复计；日期直接区间。销售使用统计保留原单日/范围，无分页，销售组排序不拆散小计；CSV不重复计合计。
7. AI 统计业务继续 009@1.0.0，工作账号触达继续 042@1.0.0；不能以视觉修复改指标。人工操作和视觉按真实覆盖报告，DOM通过不能证明全部像素一致。
8. 当前 Chrome 连接缺口、未采集展开/图表和离线 file 检查见验收记录；不要用本地推断宣称实站完成。

旧主题、菜单及好友独立页已归档，只解释历史。当前指令以本文件、设计规范和对应精确版本合同为准。
