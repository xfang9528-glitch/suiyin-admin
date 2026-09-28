# 验证版本

当前实施版本为SPEC-SUIYIN-ADMIN-071@1.1.0：一条规则内多个节点。

- `nodes-model-verification.cjs`：1.1.0节点模型的独立业务断言。
- `nodes-preview.cjs`：1.1.0规则列表及节点编辑截图。
- 其他`nodes-*`：本次新增浏览器流程及结果。
- `browser-preview.cjs`：与数据结构无关的路由冒烟，参数可为`massMessageListYx`。

`model-verification.cjs`、`browser-interactions.cjs`、`editor-controls.cjs`及原`revisitRules-*`截图是1.0.0独立规则首版的历史验证，不适用于新节点模型；历史成功记录不能证明1.1.0已验证。保留它们用于对照，当前结果以`nodes-*`和根目录`verification.md`为准。

## 1.1.0完整推送检查

公开包仅包含当前nodes检查、verify-inline-071、menu-migration-071及对应结果；不复制旧截图、失败截图或私聊证据。

从原型仓根目录运行：

```sh
node docs/sdd/SPEC-SUIYIN-ADMIN-071/1.1.0/checks/nodes-model-verification.cjs
node docs/sdd/SPEC-SUIYIN-ADMIN-071/1.1.0/checks/nodes-browser-verification.cjs
node docs/sdd/SPEC-SUIYIN-ADMIN-071/1.1.0/checks/verify-inline-071.cjs
node docs/sdd/SPEC-SUIYIN-ADMIN-071/1.1.0/checks/menu-migration-071.cjs
```

浏览器检查需已有Google Chrome及可解析的Playwright；可用PLAYWRIGHT_MODULE和CHROME_PATH指定。nodes-browser默认服务地址http://127.0.0.1:8148，可由PROTOTYPE_BASE_URL覆盖。inline检查直接打开file协议，拦截HTTP请求。脚本从原型仓根目录运行，或设置PROTOTYPE_ROOT；不安装依赖，不清除正常用户存储。详细结果与已知历史菜单限制见../verification.md。
