# 071 六艺星租户本地验收

本目录为 `SPEC-SUIYIN-ADMIN-071@1.2.0` 的新增本地证据。2026-09-28 执行；不覆盖 1.1.0 历史结果，也不表示已发布、生产定时任务或 PC 名单已实现。

| 检查 | 实际结果 | 覆盖 |
| --- | --- | --- |
| `tenant-model-verification.cjs` | 18/18 PASS | 六租户注册、21/26 维度、17 个合成场景、独立账号/人员/地区/权限、拒绝外租户实体、工厂返回值隔离 |
| `sz-compatibility-verification.cjs` | 25/25 PASS | 从 1.1.0 继承的深圳模型场景在本次 1.2.0 实现上重新执行；日期、48 小时、未知、AND/OR、节点复制与权限 |
| `tenant-browser-verification.cjs` | 15/15 PASS | 同一 Chrome context 六租户 shell/菜单、选项、保存/启停/刷新、QA 与普通模式隔离、实际切租户、新旧深圳存储、非艺星拒绝、1120 窄窗 |
| `verify-inline-tenants.cjs` | 12/12 PASS | 真正 file:// 离线运行；当前产品源码/模型数据/菜单绑定、六店字段及保存启停、QA/普通模式隔离、旧统计独立、非艺星拒绝、唯一平台登记、零外部请求/脚本异常 |
| `verify-inline-check-page.cjs` | 137/137 PASS，其中本期回访 32/32 | HTTP 综合自检保留其他功能并追加本期；仅代表此次执行结果，不追溯改写旧记录 |

`*-results.json` 记录实际时间和当前源文件 SHA-256。`menu-extension-*` 为并行菜单验收产物，结果由对应报告独立记录。

## 复跑

两个 Node 模型检查没有第三方依赖。从原型仓根目录执行本目录脚本；若脚本放在仓外且当前目录不是原型仓，设置 `PROTOTYPE_ROOT` 为原型仓目录。脚本会查找 `prototype/admin-revisit-rules-model.js`。

```powershell
node '<checks-directory>/tenant-model-verification.cjs'
node '<checks-directory>/sz-compatibility-verification.cjs'
```

浏览器检查需要已启动的静态预览服务、Google Chrome 和 Playwright。默认服务为 `http://127.0.0.1:8148`；可用 `PROTOTYPE_BASE_URL` 改写。`PLAYWRIGHT_MODULE` 可指向已安装模块；未设置时使用 `require('playwright')`。默认启动 `channel: 'chrome'`，可用 `CHROME_PATH` 指向 Chrome 可执行文件。

```powershell
node '<checks-directory>/tenant-browser-verification.cjs'
```

完整推送阶段先从原型仓根目录运行 `node prototype/build_admin_inline.mjs`。单文件检查使用相同的 Playwright/Chrome 配置以及 `PROTOTYPE_ROOT`，直接打开本机 `prototype/_shell_inline.html` 的 `file://` 地址，并阻止所有 HTTP(S) 请求。

```powershell
node '<checks-directory>/verify-inline-tenants.cjs'
```

`verify-inline-check-page.cjs` 另行运行 `prototype/_inline-check.html` 的 HTTP 综合对照检查，使用 `PROTOTYPE_BASE_URL`。该检查包含历史其他功能，结果与本期 file:// 验收分开记录，不能把旧功能局限写成本期回访规则失败，也不能将其隐去。

浏览器始终使用新的临时 context，不连接个人 Chrome profile。普通模式和 QA 模式的 localStorage 都只在该临时 context 中写入合成测试数据，运行结束关闭浏览器。脚本不会安装依赖、启动服务、修改产品源码或生成单文件。

## 截图与数据范围

- `tenant-*-list.png`：六租户列表各一张。
- `tenant-yestar-editor.png`、`tenant-yestar-jx-editor.png`：成都与嘉兴编辑页。
- `tenant-yestar-narrow.png`：1120 宽视窗中的成都编辑页。
- 以上 9 张均只截内容 iframe，不含主壳账号姓名；规则名、人员和账号均为明确合成验收数据。
- 已视检成都列表、嘉兴编辑页和成都窄窗，未见遮挡、横向溢出或保存按钮不可达。
- `inline-yestar-editor.png`、`inline-yestar-jx-list.png` 为本次真正 file:// 的成都编辑页和嘉兴列表；仅内容 iframe，已视检。
- 脚本、结果只用仓内相对路径和通用环境变量；没有私人 Windows 路径、原始聊天、凭据或真实联系人。截图可作为静态原型验收证据，不代表实站采样。

验收本身不构成发布授权。用户随后以 E022 明确授权 1.2.0 完整推送，目标 tag 为 `v2026092802-admin-revisit-tenants`；真实 commit/push/tag 及远端回读结果由主任务的发布回执记录。旧已发布 SDD 仍不回写，生产代码不在本次范围。
