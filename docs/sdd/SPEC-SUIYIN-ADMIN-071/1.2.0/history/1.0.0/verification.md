# 本地静态原型验证

- 日期：2026-09-27；SPEC-SUIYIN-ADMIN-071@1.0.0。
- 目标：现有 suiyin-admin HTML 原型，深圳艺星的「聊天管理 → 回访规则」。
- 预览：http://127.0.0.1:8148/prototype/_shell.html?tenant=yestar-sz&page=revisitRules 。已通过系统启动命令打开 Google Chrome。
- 范围：配置列表、独立规则复制、账号群组及账号范围、完整21/26项条件、相对/固定日期、01:00等每日运行设置、保存与启停、示例试算。

## 实际验证

1. `checks/model-verification.cjs`：10组集合及边界断言通过。固定第3天示例：范围13、应回访3、排除3、未入选5、未知2。覆盖复制深拷贝、自然日节点、48小时边界、未来消息、双方AND、账号权限收窄、无额外选中条件、零结果、无效日期及北京时间次日计算。结果见`checks/model-results.json`。
2. `checks/browser-interactions.cjs`：8组浏览器流程通过。覆盖真实控件、新建校验、取消、复制修改不影响原规则、启停、刷新、群组/单账号/搜索全选、试算原因、零人保存、1120px窄窗、损坏存储不覆盖及写入失败保留草稿。`pageerror=[]`、外部请求0。结果见`checks/browser-results.json`。
3. `checks/editor-controls.cjs`：固定日期操作符与摘要、账号条件随范围改变更新、地区多选保存通过，浏览器错误0。
4. 导航增量迁移经独立审查：旧改名、隐藏、父级与排序保持，旧缓存并入新增入口，已隐藏及取消整组不复活，重复迁移幂等；Google Chrome中深圳显示一次入口，广州无该入口。仅深圳菜单库存新增页面，平台库存登记稳定菜单身份。
5. `checks/browser-preview.cjs`：新页与旧`massMessageListYx`均正常渲染，错误0；新页独立CSS/JS，旧群发内容未修改。
6. SPEC结构与Plan运行边界验证通过；新脚本语法及`git diff --check`通过。

## 视觉证据

- `checks/revisitRules-list.png`：默认规则列表。
- `checks/revisitRules-editor.png`：规则信息、账号选择与摘要。
- `checks/revisitRules-conditions.png`：选中/排除条件及每日筛选时间。
- `checks/revisitRules-trial.png`：五类统计与逐人判断原因。
- `checks/revisitRules-narrow.png`：1120px窄窗编辑页面。

## 交付边界

本轮为可交互的本地静态原型。规则存储在当前浏览器；测试使用独立QA键，不污染普通预览。合成数据不含访谈私聊记录。启用仅模拟状态，不运行真实定时任务，不产生真实PC回访名单，不发送消息。销售权限仅在合成模型与产品说明中验证，未接实际权限接口或改PC页面。

未请求完整推送；未生成单文件、未发布、未commit/push/tag、未创建Issue或通知。
