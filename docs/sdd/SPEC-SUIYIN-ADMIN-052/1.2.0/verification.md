# 验证记录 — SPEC-SUIYIN-ADMIN-052@1.2.0

日期：2026-09-20。状态：implemented；最新 USER E012 的筛选完整复用已实现，当前本地 Chrome 检查通过。

## 本轮筛选结果

- [8/8 筛选检查](evidence/voice-verification.json)通过；覆盖 1528px 和 1080px 两宽、单日/范围、单月/双月弹层、草稿与取消、快捷日即时查询、非法范围、重置、部门选择、全筛选 CSV、15 租户身份及脚本错误。
- [几何与样式记录](evidence/voice-geometry.json)逐控件对比尺寸、位置、字体、颜色、边距与边框。1528px 的两种日期模式截图与本地销售使用统计各自 PNG 字节相同：单日 f6e5882ea1fed45cbfbd570250aea16544e0581f6325a55e34e69847866c0cac，范围 1b905777a1bd61b627a18e46f49276f743120545534fadac34e4759dee267151。
- 截图比较仅把使用统计的日期草稿改为变声当天，没有提交使用统计新查询、没有改写冻结来源。变声仍按当前运行日生成本租户独立任务演示，使用统计仍读取本租户采集；业务计数、分页、权限和菜单不变。
- [15 租户检查](evidence/voice-tenant-checks.json)均 success；独立复核包含真实变声表内滚动、日期/部门浮层位于冻结表头之上、口径弹窗及排序/分页重渲染。

## 本次覆盖与边界

- 验证对象为已安装的本地静态管理原型，Google Chrome 实际渲染和滚动；没有访问或修改生产业务。
- 当前全入口矩阵：752 个入口，620 个入口含表、665 张表、333 个具备滚动与表头冻结条件的实测场景；冻结失败、页面失败和脚本错误均为 0。短表、空态或无表路由只检查其适用状态，未把未滚动场景冒充滚动通过。
- 专项冻结检查 30 条记录中 22 条为实际断言，另 8 条为结构盘点；22/22 断言通过。独立复核 9/9 通过，涵盖日历/部门浮层、弹窗、表尾、重复渲染和多个独立表格。
- 嵌套多层表头与审计弹窗长表边界使用临时 DOM 布局夹具，未修改业务 JSON、本地存储或采集资料；夹具只证明布局边界。
- 本轮已取得完整推送授权，源码/inline/新版本合同一起交付；这里的本地测试记录不代替远端 commit/tag/部署回执。原始业务证据缺口仍按各页标识保留，本次不宣称所有实站页面逐像素一致。

## 可复核证据

| 证据 | 结果 | 文件 |
|---|---|---|
| 全入口真实 Chrome 盘点与滚动 | 752 入口、665 表、333 滚动；0 失败 | [all-page-table-check.json](evidence/all-page-table-check.json) |
| 表头冻结专项 | 30 记录，其中 22/22 断言通过 | [sticky-runtime-report.json](evidence/sticky-runtime-report.json) |
| 独立边界复核 | 9/9 | [sticky-independent-review.json](evidence/sticky-independent-review.json) |
| 安装后 Shell 预览 | 使用/AI 下滑后表头 top=0；无错误 | [preview-check.json](evidence/preview-check.json) |
| 实现字节冻结 | 五个目标文件符合安装摘要 | [installed-voice.json](evidence/installed-voice.json)、[installed-sticky-entrypoint.json](evidence/installed-sticky-entrypoint.json) |

## 历史记录

此前发布检查保留在 [052 旧版本包](https://github.com/xfang9528-glitch/suiyin-admin/blob/v2026092002-admin-pixel-alignment/docs/sdd/SPEC-SUIYIN-ADMIN-052/1.1.2/verification.md)，不计作本轮验证。
