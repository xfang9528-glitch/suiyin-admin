# 碎银管理后台 HTML 原型

这是十五租户的静态管理后台原型，用于对照真实页面、评审操作和统计规则。当前范围为 **15 个租户、765 个租户页面入口、85 种路由**。数据包含本租户脱敏采样、标明来源的参考样本和合成演示；不是实时后台，所有修改只影响本地原型。

- [预约记录组合图](https://suiyin-admin.pages.dev/prototype/_shell.html?tenant=yestar-sz&page=appointmentRecords&appointmentDemo=1&appointmentView=chart)（完整合成演示） · [产品说明](prd/appointment-chart.md) · [交互流程](flowcharts/appointment-chart.md) · [062交付包](docs/sdd/SPEC-SUIYIN-ADMIN-062/1.0.0/README.md)
- [在线管理页](https://suiyin-admin.pages.dev/prototype/_shell.html?tenant=yestar-sz&page=wechatStatus)
- [AI费用统计](https://suiyin-admin.pages.dev/prototype/_shell.html?tenant=bzds&page=aiCostStats) · [费用产品说明](prd/ai-cost-stats.md) · [费用交互流程](flowcharts/ai-cost-stats.md)
- [销售变声统计](https://suiyin-admin.pages.dev/prototype/_shell.html?tenant=yestar-sz&page=salesVoiceStats) · [销售使用统计](https://suiyin-admin.pages.dev/prototype/_shell.html?tenant=yestar-sz&page=salesMessageUsage) · [菜单管理](https://suiyin-admin.pages.dev/prototype/_shell.html?tenant=yestar-sz&page=menu)
- [离线单文件](prototype/_shell_inline.html)：由主线生成，包含所需静态数据和资源。历史单文件检查见 [筛选与冻结运行记录](docs/verification/filters-sticky-20260920/inline-runtime-report.json)；本次重新生成后的实际结果见 [062 验收记录](docs/sdd/SPEC-SUIYIN-ADMIN-062/1.0.0/verification.md)；上一轮另见 [058 验收记录](docs/sdd/SPEC-SUIYIN-ADMIN-058/1.2.0/verification.md)，旧报告不代替当前生成物验证。完整人工断网验收与实站像素验收仍分别保留。
- [产品说明](prd/admin-live-reference.md) · [交互流程](flowcharts/admin-live-reference.md) · [设计规范](docs/design-spec.md) · [验收与已知边界](docs/verification/admin-live-reference.md)

上一轮新增「AI管理 → AI费用统计」，覆盖已有 AI 管理父级的 13 个租户。单日/范围查询五类分析的次数、客户费用、专属模型和分类趋势；2026-07-01 至 2026-09-20 共 82 天均为固定合成样本。未知费用、缺日期和参考模型配置明确说明，不作为真实扣费或历史调用证据。行为合同为 [058@1.2.0](docs/sdd/SPEC-SUIYIN-ADMIN-058/1.2.0/README.md)，远端发布和工程状态以交付回执为准。

既有已交付范围：所有租户新增「数据展示 → 销售变声统计」，同步对应菜单管理和已有平台菜单定义。按独立变声任务首次成功生成计次，失败、试听及同任务重试不重复计，消息发送成功与否不影响该次数。筛选与销售使用统计完整一致：统计时间、单日/范围、日期日历、今天/昨天/前天、部门、搜索/重置/导出，保留各自日期和数据来源。

销售使用统计使用专用分组表，保留销售、部门、小计与全表合计，不强加分页或汇总卡。4 个租户具有本租户采集，其他 11 个明确显示未采集；不借用其他租户的销售或部门补数。

上一轮 `v2026092002-admin-pixel-alignment`：依据用户提供的四张深圳实站对照图，修正销售使用统计、拉新记录、消息占比、AI 辅助统计及共享白色内容背景；使用/变声主操作为青绿，AI 搜索为绿色。四页的专用结构和数据边界见 [发布勘误](docs/sdd/pixel-correction-20260920.md) 与 [截图纠偏记录](docs/verification/pixel-correction-20260920.md)。

上一轮发布 `v2026092003-admin-voice-filters-sticky`：销售变声筛选和销售使用统计共用同一控件结构及交互；所有管理表格在所属滚动区域内冻结表头，包括普通列表、专用统计、菜单树表和弹窗表格。横向滚动时列对齐，表格退出可见区后表头随之退出。见 [筛选与冻结验收记录](docs/verification/filters-sticky-20260920.md)。

当前保留 15 租户、85 路由、765 入口，其中 AI费用统计新增 13 个入口；另外 2 个租户不新增 AI 管理父级。深圳拉新记录恢复已确认空态；AI辅助统计仅展示本租户截图中完整可见的 22 行部分样本，不再借用其他租户。使用统计与消息占比保留各自注明日期的旧快照，不用截图柱高或其他日期补数。

其他管理页继续按各自证据保留菜单树、聊天、配置、销售仪表盘和好友结构。来源说明区分本租户采样、参考样本、演示与未采集；参考样本机制不适用于使用统计与 AI辅助统计的数据回退。

本次预约记录保留列表并增加总量与柱线组合图，覆盖深圳、广州、杭州、嘉兴的既有入口，统计所有已应用筛选结果。原样本与完整演示明确分开；工程提出环境深圳艺星、提出人李愉，负责人陈宣宇。

当前合同如下，051 为基线，后续合同仅替代各自范围内的旧实现：

| 合同 | 内容 |
|---|---|
| [051@1.1.0](docs/sdd/SPEC-SUIYIN-ADMIN-051/1.1.0/README.md) | 十五租户、Shell、领域页面及公开样本基线 |
| [052@1.2.0](docs/sdd/SPEC-SUIYIN-ADMIN-052/1.2.0/README.md) | 全租户销售变声统计及 DR-095 菜单同步 |
| [053@1.0.2](docs/sdd/SPEC-SUIYIN-ADMIN-053/1.0.2/README.md) | 销售使用统计结构与租户隔离 |
| [054@1.0.0](docs/sdd/SPEC-SUIYIN-ADMIN-054/1.0.0/README.md) | 全管理页证据矩阵与对齐路线 |
| [055@1.1.0](docs/sdd/SPEC-SUIYIN-ADMIN-055/1.1.0/README.md) | 共享筛选、控件与来源；所有管理表格表头冻结 |
| [056@1.0.0](docs/sdd/SPEC-SUIYIN-ADMIN-056/1.0.0/README.md) | 聊天、配置及仪表盘结构 |
| [062@1.0.0](docs/sdd/SPEC-SUIYIN-ADMIN-062/1.0.0/README.md) | 预约列表/图表、每日预约柱形及期间累计折线、全量筛选与来源边界 |
| [058@1.2.0](docs/sdd/SPEC-SUIYIN-ADMIN-058/1.2.0/README.md) | AI费用、分类趋势、82天演示样本与专属模型 |

上一轮本地 Chrome 检查覆盖 752 个入口、665 张表格及 333 个实际滚动场景，冻结失败和脚本错误均为 0；筛选专项 8/8、冻结专项 22 项断言及独立复核 9/9 通过。同日期、同视口下两页单日及范围筛选截图分别字节一致。这些检查证明本地筛选一致性与表头行为；上一轮四页截图的边缘、排序图标和实站滚动细节仍待继续迭代，不代表全部页面已逐像素验收。

本地预览在仓根运行 `python -m http.server 8148 --bind 127.0.0.1`，再用 Google Chrome 打开 `http://127.0.0.1:8148/prototype/_shell.html?tenant=bzds&page=aiCostStats`。正常演示状态按租户和路由隔离；验收使用独立 QA 存储。

发布版本以 [release.json](release.json)、远端提交和交付回执为准；文档中的候选状态不代表已上传。历史独立页面及其文件仍用于追溯，[旧主题与导航](docs/history/before-admin-live-reference/README.md)、[旧好友页](docs/history/before-admin-wide-alignment/README.md) 均不作为当前 Shell 的实现指令。原型发布不等于生产端上线。既有销售变声工程 Issue 已创建：[管理页销售变声统计 #401](https://github.com/PetWebOrg/suiyin-admin/issues/401)，负责人陈宣宇（cxy-chenxuanyu），提出环境深圳艺星、提出人 ZHONG、平台 PC。工程范围覆盖生产租户注册表中全部适用租户；15 个租户只是本原型覆盖清单，不是生产白名单。交付映射见 [052 工程交付合同](docs/sdd/SPEC-SUIYIN-ADMIN-052/1.2.0/issue-handoff.md)。全管理页冻结随本次原型发布，不因此扩大该工程 Issue 到全管理页改造；不更新开发进度表。

AI费用统计工程执行以 [058 Handoff](docs/sdd/SPEC-SUIYIN-ADMIN-058/1.2.0/issue-handoff.md) 和 [Test Contract](docs/sdd/SPEC-SUIYIN-ADMIN-058/1.2.0/test-contract.md) 为入口；提出环境佰智德三、提出人房昕，负责人陈宣宇。真实 Issue 编号及交付状态由实际建单回执登记，不复用销售变声 #401。

AI费用统计工程Issue已建立：[#402](https://github.com/PetWebOrg/suiyin-admin/issues/402)，陈宣宇（cxy-chenxuanyu），提出人房昕、环境佰智德三、平台PC。原型发布标签 `v2026092004-admin-ai-cost-stats`；实现与生产验收待正式工程流程。

预约图表工程Issue已建立：[#404](https://github.com/PetWebOrg/suiyin-admin/issues/404)，负责人陈宣宇（cxy-chenxuanyu），提出环境深圳艺星、提出人李愉、平台PC。交付标签 v2026092101-admin-appointment-chart；原型已实现，生产实现待正式工程流程。
