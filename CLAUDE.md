# 碎银 Admin 原型维护入口

当前主线：SPEC-SUIYIN-ADMIN-051@1.1.0，十五租户真实界面对照与完整内容迭代。实施前先读 README.md、docs/design-spec.md、docs/sdd/SPEC-SUIYIN-ADMIN-051/1.1.0/spec.md；导航阶段合同 050 只在未被 051 明确替代的范围内适用。

## 运行与交付

- 纯 HTML/CSS/JavaScript、静态 JSON/资源、本地 Mock；不引入生产框架，不接真实认证或写 API。
- 对真实后台只读取页面、展开控件后取消，不能保存配置、删除或发送。
- 只维护本仓 HTML 原型，不跨 Flutter / React / Go 生产仓。
- 未收到明确“完整推送”时只迭代原型并打开 Chrome；收到后同步 PRD/流程/设计/单文件/远端 SDD，再按工作区规则 direct-master commit/push/tag。
- 不创建、更新或对账 APP/PC 开发进度表。生产 Issue 需另行明确指令。

## 主线结构

- prototype/_shell.html：租户导航、页签、iframe 内容。
- prototype/admin-navigation.js/css 与 admin-menu-state.js：身份、菜单显示与本地覆盖。
- prototype/admin-content.html/js/css：内容入口和基础表单/列表。
- prototype/admin-domain-views.js、admin-expanded-flows.js、admin-extra-flows.js、admin-chat.js、admin-page-editors.js：领域页面。
- prototype/admin-menu-tree.js/css：普通及平台菜单专用树表。
- prototype/admin-live-ui.css、data/live-ui-reference.js：原网页实采样式、SVG、控件配置。
- prototype/data/navigation-snapshot.json、data/content/：按租户/路由分隔数据。
- prototype/_shell_inline.html：由主线生成的离线单文件，不手工改派生产物。

## 当前约定

1. 十五租户按本次范围固定，不能从平台全量目录或 PC ENV_ORDER 自动增加环境。碎银私域及截图排除项不出现。
2. 同名菜单按 route/identity 区分，不能按中文名合并。可见导航与完整菜单库存分开。
3. 主线采用原站青绿 #00c4af，品牌 #00af9c，顶栏60px、侧栏240px，具体页面按实采配置；以 docs/design-spec.md 为现行设计入口。
4. 菜单管理必须保留树、权限开关、固定操作及原站空白弹性列，不套用通用搜索/分页表。
5. Mock 本租户采样优先，参考/合成数据有来源标识。状态按 tenant + route 隔离，公开包不得带敏感聊天、原始凭据或客户联系信息。
6. AI 默认演示数据非空，但业务统计定义继续按 009@1.0.0；工作账号触达按 042@1.0.0，不混用人数、消息与统计边界。
7. 数据校验不能替代人工视觉；同租户同视口比较，报告实际覆盖和已知差异。

旧微信绿/公众号白头、旧租户列表、统一占位等约定已归档至 docs/history/before-admin-live-reference/，只解释旧页面，不作为当前 Shell 指令。
