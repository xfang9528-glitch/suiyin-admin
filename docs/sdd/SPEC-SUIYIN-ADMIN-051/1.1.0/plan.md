---
plan_for: SPEC-SUIYIN-ADMIN-051
spec_version: 1.1.0
status: approved
artifact_class: static-html
exception_status: not-required
exception_approved_by: none
exception_approved_at: none
operational_profile: none
last_updated: 2026-09-19
---

# 实施计划

runtime_type: static-html

沿用现有 shell 和内容页面资产。共享表格、筛选、弹层和反馈组件；为每个实际路由保存独立页面定义及本租户采样数据。复杂页面使用专用渲染与交互，不用通用列表覆盖所有页面。

真实样本只来自 Chrome 中当前已授权租户的可见页面；缺少本租户明细时优先复用保留租户已有记录或原型既有 Mock，标注样本来源，剩余字段采用本地补充样本。采样文件只写本地；浏览器不读取隐藏应用状态、不直接调用真实 API。真实页面的创建/编辑入口仅查看字段并取消。

页面的保存、状态切换、删除等模拟操作写入按 tenant + route 分隔的 localStorage。金额、消息数、人数、来源标签等不能凭样本外推成全量事实。真实账号登录、发消息等仅演示流程和本地结果，不连接真实服务。

验收：菜单路由和内容矩阵对账；所有 JS 语法、静态资源与 JSON 校验；Chrome 按页面家族验证布局、筛选、分页、详情、表单及租户隔离；无法访问者单独登记。

## 4. 文件与路由

所有运行文件均位于 `佰智德三/碎银原型/suiyin-admin/prototype/`。

| 文件 | 用途 |
|---|---|
| `_shell.html`、`admin-navigation.js/css` | 沿用青绿框架、租户导航和多页签，接入实际内容 |
| `admin-content.html/js/css` | 表格、筛选、详情、表单、校验、保存和撤销 |
| `admin-domain-views.js` | 图表、话术、预约、群发和配置 |
| `admin-chat.js` | 销售和人设筛选、只读会话 |
| `admin-extra-flows.js` | 批量操作、平台菜单差异预览和联动 |
| `data/content/*.json` | 按租户分隔的脱敏快照与合成样本 |
| `admin-expanded-flows.js/css` | 实际展开选项、群发创建、商品预览、销售统计与 AI 汇总；旧 AI 独立页不再作为 Shell 入口 |
| `data/content/options.json` | 实际打开控件后采集的 25 组选项，保留禁用状态 |
| `_filled-check.html` | 737 个入口的默认内容/查询/选项检查及 20 项展开交互检查 |
| `_content-check.html`、`_workflow-check.html` | 本地浏览器验收；QA 数据使用独立存储前缀 |
| `admin-live-ui.css`、`admin-live-controls.js`、`data/live-ui-reference.js` | 原站计算样式、SVG、下拉与控件配置；R004/R005/R010 |
| `admin-page-editors.js` | 专家/案例整页编辑及版本专用表单；R004/R005 |
| `admin-menu-state.js`、`admin-menu-tree.js/css` | 完整库存与可见导航分离、树表/开关/菜单弹窗和本地联动；R002/R003/R005 |
| `_menu-parity-check.html` | 十五租户及平台菜单的54项专用验收；不替代全页视觉 |
| `_shell_inline.html` | 完整推送时从主线生成的离线静态单文件，嵌入内容页、资源与JSON；R009 |

## 5. 运行边界

临时本地 HTTP 服务只提供静态文件；本地存储不共享到服务器。没有服务端身份系统、数据库或云端持久化。跨租户切换使用独立参数与存储键。

## 6. 菜单纠偏与验证落点

菜单管理及平台菜单采用专用树表，R005/AC-R005-01 不允许通用搜索/分页替代；恢复开关、层级、固定动作及空白弹性列。普通名称只读，允许负数排序；平台父级选择禁止循环。截图跨租户差异须分别核对，不用成都配置覆盖深圳。

数据校验覆盖 737 个组合；菜单操作54项、关键回归22项另记。视觉使用同租户同视口原站/原型矩形与 Chrome 人工观察，当前精确结论只覆盖菜单及已记录页面，不扩大为所有路由。

## 7. 完整推送授权与产物

2026-09-19 用户已明确“完整推送”。允许同步本仓 PRD、流程、设计、单文件和版本化 SDD，再在当前 HTML 原型仓 direct-master commit/push/tag。此交付授权不改变 static-html 运行性质；不包含生产仓、真实业务写入或新建工程 Issue，不更新开发进度表。

版本化包为 docs/sdd/SPEC-SUIYIN-ADMIN-051/1.1.0/，包含 spec、plan、tasks、source-convergence、README及机器清单；050阶段包与009/042精确依赖入口同仓可达。公开证据仅保留必要脱敏摘要，原始客户数据和浏览器捕获不上传。最终是否完成以远端分支/tag、版本文件可达、无ahead与预览核验为准。
