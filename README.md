# 碎银管理后台 HTML 原型

这是十五租户的静态管理后台原型，用于对照真实页面、评审操作和统计规则。当前范围为 **15 个租户、752 个租户页面入口、84 种路由**。数据包含本租户脱敏采样、标明来源的参考样本和合成演示；不是实时后台，所有修改只影响本地原型。

- [在线管理页](https://suiyin-admin.pages.dev/prototype/_shell.html?tenant=yestar-sz&page=wechatStatus)
- [销售变声统计](https://suiyin-admin.pages.dev/prototype/_shell.html?tenant=yestar-sz&page=salesVoiceStats) · [销售使用统计](https://suiyin-admin.pages.dev/prototype/_shell.html?tenant=yestar-sz&page=salesMessageUsage) · [菜单管理](https://suiyin-admin.pages.dev/prototype/_shell.html?tenant=yestar-sz&page=menu)
- [离线单文件](prototype/_shell_inline.html)：由主线生成，包含所需静态数据和资源；直接 `file://` 与断网的 Chrome 人工验收尚未完成，HTTP 场景检查不能代替这两项。
- [产品说明](prd/admin-live-reference.md) · [交互流程](flowcharts/admin-live-reference.md) · [设计规范](docs/design-spec.md) · [验收与已知边界](docs/verification/admin-live-reference.md)

本轮所有租户新增「数据展示 → 销售变声统计」，同步对应菜单管理和已有平台菜单定义。按独立变声任务首次成功生成计次，失败、试听及同任务重试不重复计，消息发送成功与否不影响该次数。日期直接选择起止日，无额外单日/范围模式。

销售使用统计使用专用分组表，保留销售、部门、小计与全表合计，不强加分页或汇总卡。4 个租户具有本租户采集，其他 11 个明确显示未采集；不借用其他租户的销售或部门补数。

全管理页按原始证据恢复筛选、操作、表格及领域布局。菜单树、聊天、配置、销售仪表盘、好友页各自保留适用结构。来源按钮区分本租户采样、参考样本和演示；缺少图表明细或展开状态的地方明确提示未采集。

当前合同如下，051 为基线，后续合同仅替代各自范围内的旧实现：

| 合同 | 内容 |
|---|---|
| [051@1.1.0](docs/sdd/SPEC-SUIYIN-ADMIN-051/1.1.0/README.md) | 十五租户、Shell、领域页面及公开样本基线 |
| [052@1.1.1](docs/sdd/SPEC-SUIYIN-ADMIN-052/1.1.1/README.md) | 全租户销售变声统计及 DR-095 菜单同步 |
| [053@1.0.0](docs/sdd/SPEC-SUIYIN-ADMIN-053/1.0.0/README.md) | 销售使用统计结构与租户隔离 |
| [054@1.0.0](docs/sdd/SPEC-SUIYIN-ADMIN-054/1.0.0/README.md) | 全管理页证据矩阵与对齐路线 |
| [055@1.0.0](docs/sdd/SPEC-SUIYIN-ADMIN-055/1.0.0/README.md) | 共享筛选、表格、控件与来源 |
| [056@1.0.0](docs/sdd/SPEC-SUIYIN-ADMIN-056/1.0.0/README.md) | 聊天、配置及仪表盘结构 |

2026-09-20 全入口 DOM 检查为 752/752，通过范围是载入、运行时、租户绑定、选项来源及指定结构断言。当前 Chrome 连接不可用，不能据此声称全部页面与最新实站逐像素一致；未采集项和历史视觉证据见验收记录。

本地预览在仓根运行 `python -m http.server 8169 --bind 127.0.0.1`，再用 Google Chrome 打开 `http://127.0.0.1:8169/prototype/_shell.html?tenant=yestar-sz&page=salesVoiceStats`。正常演示状态按租户和路由隔离；验收使用独立 QA 存储。

发布版本以 [release.json](release.json)、远端提交和交付回执为准；文档中的候选状态不代表已上传。历史独立页面及其文件仍用于追溯，[旧主题与导航](docs/history/before-admin-live-reference/README.md)、[旧好友页](docs/history/before-admin-wide-alignment/README.md) 均不作为当前 Shell 的实现指令。原型发布不等于生产端上线，也不自动创建工程 Issue 或开发进度表。
