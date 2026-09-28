# SPEC-SUIYIN-ADMIN-071@1.3.1 交付包

六个现有艺星租户（深圳、成都、北京、广州、杭州、嘉兴）的「聊天管理 → 回访规则」可直接选择15个回访基准：原5日期（含预约日期）、成为A/B/C/D级，以及首次到店、最近一次到店、首次购买、最近一次购买、首次划扣、最近一次划扣。

三类事件的次数直接作为独立选项，不再显示第二个事件取值下拉；等级仍可选择人工/AI来源。摘要、示例试算及保存恢复使用相同配置。旧事件与次数配对正确回显，打开/取消不迁写；缺失或非法配置必须显式修复。各节点仍独立配置和复制21项选中/26项排除，共同账号范围、运行时间和接待权限合同保持。

- [行为合同](spec.md)、[实现计划](plan.md)、[任务记录](tasks.md)、[来源收敛](source-convergence.md)、[验证记录](verification.md)。
- [产品说明](../../../../prd/admin-live-reference.md)、[交互流程](../../../../flowcharts/admin-live-reference.md)、[设计规范](../../../design-spec.md)。
- [本版不可变交付入口](https://github.com/xfang9528-glitch/suiyin-admin/tree/v2026092803-admin-revisit-anchors/docs/sdd/SPEC-SUIYIN-ADMIN-071/1.3.1)。
- [深圳在线预览](https://suiyin-admin.pages.dev/prototype/_shell.html?tenant=yestar-sz&page=revisitRules)；页头可切换其他艺星，沿用既有Access登录。
- [单文件原型](../../../../prototype/_shell_inline.html)，下载后可离线打开。
- [当前15项UI与离线验证](checks/v1.3.1/README.md)、[同字节模型验证](checks/v1.3.0/README.md)。各结果记录实际时间与源码SHA，历史结果不冒充新UI验收。
- [旧1.2.0六租户/菜单交付证据](../1.2.0/README.md)保留为历史，不回写。

等级演示取所选来源最近一次真正进入目标级别的日期；重复同级评定不重置，后续等级变化不隐式增加当前等级条件。到店/购买/划扣分别在筛选时点之前选择首次/最近一次。按北京时间自然日差计算节点，当天为第0天；缺失或坏历史为无法判断，完整空历史为未发生，不借其他日期猜测。

账号、好友及新事件均为各tenant独立合成样本。这里只交付HTML静态原型；没有接入真实CRM/等级历史、定时任务、PC名单生成或发送。原始访谈、MCP返回、凭据和通知收件标识不在本包。

精确依赖：

- [SPEC-YESTAR-PC-065@1.1.0](https://github.com/xfang9528-glitch/suiyin-pc-chat/blob/v2026092201-yestar-friend-picker/docs/sdd/SPEC-YESTAR-PC-065/1.1.0/spec.md)：账号范围和筛选维度。
- [SPEC-SUIYIN-ADMIN-055@1.1.0](../../SPEC-SUIYIN-ADMIN-055/1.1.0/spec.md)：表格及浮层。
- [SPEC-SUIYIN-ADMIN-068@1.0.0](../../SPEC-SUIYIN-ADMIN-068/1.0.0/spec.md)：菜单身份、覆盖和隔离。

工程追踪为SPEC-ID@version → R-ID → AC-ID → Issue Slice → Test ID。本轮未请求工程交付，未创建Issue/Handoff/Test Contract；生产实现须另走正式工程流程。

本包在发布前冻结。tasks保留冻结时实际状态，远端commit/tag、部署与SCRUM送达以发布回执确认；本README不独自证明发布成功。旧模型与合同在history内仅作历史，不作为当前UI选项指令。

公开副本仅将本机路径规范化为原型仓/本包链接或明确的local-only历史来源别名；canonical与本机history原字节保持，业务文字不变，路径规范化文件清单在manifest中声明。早期历史文件中对当前本包的根链接仅用于定位来源类别，具体生效范围仍以该历史版本的标题和日期为准。
