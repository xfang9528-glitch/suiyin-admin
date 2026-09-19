# 碎银管理后台 HTML 原型

当前主线是基于真实管理后台的十五租户内容迭代：`SPEC-SUIYIN-ADMIN-051@1.1.0`。这是纯静态 HTML/CSS/JavaScript 原型，操作保存于当前浏览器，不能修改真实后台。

- [在线主入口](https://suiyin-admin.pages.dev/prototype/_shell.html?tenant=yestar-sz&page=wechatStatus)
- [深圳菜单管理](https://suiyin-admin.pages.dev/prototype/_shell.html?tenant=yestar-sz&page=menu) · [成都菜单管理](https://suiyin-admin.pages.dev/prototype/_shell.html?tenant=yestar&page=menu)
- [离线单文件](prototype/_shell_inline.html)：内嵌33份JSON、5个资源与内容页。HTTP场景验收；Chrome直接file://验证未执行（浏览器策略限制），不声称已完成断网验证。
- [完整内容 PRD](prd/admin-live-reference.md) · [交互流程](flowcharts/admin-live-reference.md) · [设计规范](docs/design-spec.md)
- [版本化 SDD](docs/sdd/SPEC-SUIYIN-ADMIN-051/1.1.0/README.md) · [导航阶段合同](docs/sdd/SPEC-SUIYIN-ADMIN-050/1.0.0/README.md) · [验收与已知边界](docs/verification/admin-live-reference.md)

覆盖十五租户、737 个租户路由组合、83 种路由。数据包含本租户脱敏采样、标明来源的参考样本和合成 Mock，不是实时全量数据。截图排除项、碎银私域和不可访问环境不纳入。

菜单管理使用专用树表，保留层级、显示状态、权限开关、编辑记录和固定操作列；本地修改会联动对应租户侧栏。原站有意空的备注和弹性列保留空值。其他业务页按列表、图表、配置、聊天、内容卡片等家族实现，按钮展开和下拉可操作。

本地预览可在仓根运行 `python -m http.server 8148 --bind 127.0.0.1`，再用 Chrome 打开 `http://127.0.0.1:8148/prototype/_shell.html?tenant=yestar-sz&page=menu`。正常演示状态按租户/路由隔离；验收页使用独立 QA 存储。

发布版本：`v2026091901-admin-live-reference`。版本文件是否已上传、Pages 是否已更新，以本次交付结果和远端提交为准，README 中的版本名本身不是上传成功证据。

历史独立页面仍保留用于追溯；2026 年 4–8 月共用菜单、旧主题和占位安排已退出当前 Shell 主线，见 [历史归档](docs/history/before-admin-live-reference/README.md)。本仓不承接生产端实现，也不自动创建工程 Issue 或开发进度表。
