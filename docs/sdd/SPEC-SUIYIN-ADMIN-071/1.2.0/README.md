# SPEC-SUIYIN-ADMIN-071@1.2.0 交付包

深圳、成都、北京、广州、杭州、嘉兴六个现有艺星租户均可在「聊天管理 → 回访规则」配置回访。每条规则共用账号群组/工作号范围、日期基准、每日筛选时间和启停；第3、5、7天等节点独立编辑，并可复制其他节点的选中、排除条件。

- [行为合同](spec.md)、[实现计划](plan.md)、[任务记录](tasks.md)、[来源收敛](source-convergence.md)、[验证记录](verification.md)。
- [产品说明](../../../../prd/admin-live-reference.md)、[交互流程](../../../../flowcharts/admin-live-reference.md)、[设计规范](../../../design-spec.md)。
- [固定版本交付入口](https://github.com/xfang9528-glitch/suiyin-admin/tree/v2026092802-admin-revisit-tenants/docs/sdd/SPEC-SUIYIN-ADMIN-071/1.2.0)。
- [在线成都预览](https://suiyin-admin.pages.dev/prototype/_shell.html?tenant=yestar&page=revisitRules)，在页头切换其他艺星；沿用既有Access登录，在线验收与部署结果以真实发布回执为准。
- [单文件原型](../../../../prototype/_shell_inline.html)：下载后可离线打开，选择任一现有艺星租户。

六家均继承21项选中、26项排除维度。各租户菜单管理同步同一稳定路由，德三平台继续只保留一个定义；非艺星不新增入口。菜单升级保留原隐藏、删除、改名、排序和权限设置。

各租户采用独立合成账号、人员、地区和好友，本浏览器规则按tenant隔离，不复制深圳保存规则到其他店。深圳既有实体ID与v1/v2存储保持兼容。其他五店的群发来源仅为reference，不能把深圳参考样本当成本店实际配置。试算与保存均为静态演示，不执行真实定时任务、PC名单生成、消息发送或真实权限接入。

[检查说明](checks/v1.2.0/README.md)及同目录脚本、结果、截图提供本轮实际证据；菜单扩展脚本依赖的上一版迁移检查以原字节保存在checks/menu-migration-071.cjs。1.1.0及更旧发布包保持历史，不回写成六店覆盖。原始访谈、MCP数据、凭据和通知收件标识未纳入本包。

精确依赖：

- [SPEC-YESTAR-PC-065@1.1.0](https://github.com/xfang9528-glitch/suiyin-pc-chat/blob/v2026092201-yestar-friend-picker/docs/sdd/SPEC-YESTAR-PC-065/1.1.0/spec.md)：筛选维度与账号范围。
- [SPEC-SUIYIN-ADMIN-055@1.1.0](../../SPEC-SUIYIN-ADMIN-055/1.1.0/spec.md)：表格与浮层。
- [SPEC-SUIYIN-ADMIN-068@1.0.0](../../SPEC-SUIYIN-ADMIN-068/1.0.0/spec.md)：菜单身份、覆盖和隔离。

工程追踪使用 SPEC-ID@version → R-ID → AC-ID → Issue Slice → Test ID。本轮未要求工程交付，未创建Issue、Handoff或Test Contract；原型验收不代表生产功能已实现。

此包在推送前冻结；tasks.md保留冻结时状态。远端commit/tag、Cloudflare与SCRUM送达以本次实际发布回执为准，不因本README而视为成功。
