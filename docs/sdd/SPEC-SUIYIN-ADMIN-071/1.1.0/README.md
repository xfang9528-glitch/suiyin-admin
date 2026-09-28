# SPEC-SUIYIN-ADMIN-071@1.1.0 交付包

管理者将“添加好友后回访”保存为一条规则，在规则内设置第3、5、7天等时间节点；各节点独立筛选，支持复制其他节点的选中和排除条件。规则统一账号群组/工作号范围、日期基准、每日筛选时间与启停状态。

- [行为合同](spec.md)、[实现计划](plan.md)、[任务记录](tasks.md)、[来源收敛](source-convergence.md)、[静态原型验证](verification.md)。
- [产品说明](../../../../prd/admin-live-reference.md)、[交互流程](../../../../flowcharts/admin-live-reference.md)、[设计规范](../../../design-spec.md)。
- [固定版本交付入口](https://github.com/xfang9528-glitch/suiyin-admin/tree/v2026092801-admin-revisit-rules/docs/sdd/SPEC-SUIYIN-ADMIN-071/1.1.0)。标签：`v2026092801-admin-revisit-rules`。
- [在线回访规则入口](https://suiyin-admin.pages.dev/prototype/_shell.html?tenant=yestar-sz&page=revisitRules)。使用既有访问登录；部署和在线验收状态以本次发布回执为准。
- [单文件原型](../../../../prototype/_shell_inline.html)：下载后可离线打开，选择深圳艺星 → 聊天管理 → 回访规则。

本次只增加深圳静态演示入口。深圳系统菜单及德三平台菜单登记使用同一 `revisitRules` 标识；其他租户未自动增加该页面。菜单位置按房总最终决定保留在聊天管理。

完整继承群发21项选中、26项排除维度。条件复制只替换目标节点两侧筛选，目标天数及说明不变；修改须保存整条规则才生效。原v1存储保留，导入由用户显式逐条选择，v2写入失败不覆盖原数据。

这是HTML静态原型交付：合成示例数据、本地浏览器存储与离线试算，不执行真实定时任务、不生成真实PC名单、不发送消息。按所属账号接待权限展示名单是已确定的后续PC合同，本轮只验证合成模型；真实权限和生产端尚未接入。添加日第0天、近期消息48小时等为原型演示默认，生产口径仍按SPEC待确认项处理。本次未要求工程交付，未创建新Issue、Handoff或Test Contract。

精确依赖：

- [SPEC-YESTAR-PC-065@1.1.0](https://github.com/xfang9528-glitch/suiyin-pc-chat/blob/v2026092201-yestar-friend-picker/docs/sdd/SPEC-YESTAR-PC-065/1.1.0/spec.md)：群发维度及账号范围；不继承人工名单至少一人的提交守卫。
- [SPEC-SUIYIN-ADMIN-055@1.1.0](../../SPEC-SUIYIN-ADMIN-055/1.1.0/spec.md)：Admin表格及浮层。
- [SPEC-SUIYIN-ADMIN-068@1.0.0](../../SPEC-SUIYIN-ADMIN-068/1.0.0/spec.md)：菜单身份与租户隔离。

[检查说明](checks/README.md)包含运行方法；25项模型、9组Chrome交互及6组真实file协议离线验收记录随包冻结。历史1.0.0快照仅记录被替代的独立规则方案，不作为当前验收依据。研究私聊原文、真实账号标识、MCP返回和发送凭据均未纳入本包。

本包在推送前冻结。远端commit/tag、部署状态及SCRUM通知的实际回执保存在本次交付记录中，不能由本README推断已成功发布。
