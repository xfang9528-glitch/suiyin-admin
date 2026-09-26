# SPEC-068 完整推送：离线单文件检查

- 2026-09-26 用户已授权完整推送；本检查只构建现有单文件并验证，不修改产品 JavaScript。
- 构建命令：`node "E:/AI 项目/佰智德三/碎银原型/suiyin-admin/prototype/build_admin_inline.mjs"`。
- 输出：`prototype/_shell_inline.html`，7,495,320 bytes，包含 78 份 JSON 与 5 个素材。
- SHA256：`2410d6dd907331bab601e1cf7a6907ec9d9afd18476f736c609548d73923b4e7`。
- 验收器：`checks/verify-inline-068.cjs`；完成时间 `2026-09-26T11:35:15.959Z`。
- 浏览器：Google Chrome 153.0.8010.54，独立 context，`file://` 打开，`qa=1`，HTTP/HTTPS 全部阻断。

实际结果 **8/8 PASS，0 pageerror，0 外部网络或其他外部文件依赖请求**：

1. 深圳普通 menu 离线加载、六列与全行手柄。
2. 深圳普通 menu 真实一级整组、二级组内、二级跨组移动；每步侧栏父级和顺序一致，原页面库存保持。
3. 深圳撤销、重新移动、刷新后表格与导航保持保存值。
4. 佰智德三普通 menu 离线加载、六列与全行手柄。
5. 佰智德三普通 menu 三类真实指针拖动及对应侧栏投影。
6. 佰智德三撤销、重新移动、刷新恢复。
7. 平台 allMenu 保留九列，一级移动/撤销、跨组移动、整组隐藏恢复与刷新；同 context 普通 menu 实时跟随。
8. 单文件全流程无脚本错误，无 HTTP/HTTPS 及额外 file 依赖。

已实际查看 `inline-068-yestar-sz.png`、`inline-068-bzds.png`、`inline-068-platform.png`；普通六列/平台九列、手柄、侧栏、保存恢复提示均清楚，没有明显错位。

原始机器结果见 `inline-068-results.json`。这组检查补充现有 29 情景，不将离线原型验收当成生产或线上认证页面验收。构建与验收没有使用用户 Chrome profile，没有 Git 提交、推送、部署或通知副作用。
