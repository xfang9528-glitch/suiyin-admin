# 068 本地原型验收记录

对应 SPEC-SUIYIN-ADMIN-068@1.0.0，2026-09-26。范围为 suiyin-admin 静态 HTML 原型与本次已授权的原型发布、工程交接；未修改生产后台代码。

## 实现落点

- admin-menu-tree.js：15 租户普通 menu 复用平台手柄、三类移动、键盘/触控、长表反馈、撤销；普通菜单顺序只读。成功提示明确本租户，刷新恢复设置。
- admin-menu-state.js：平台基线、租户局部父级/同级列表覆盖与完整库存共同解析；表格与导航共用结果。平台隐藏/删除及祖先链独立生效，空组、独立页面、旧字段、失效目标恢复与历史更深分支均保留。
- admin-navigation.js：普通菜单保存通知和 storage 变更触发实时刷新，保留仍可见页面 iframe；历史更深分支递归显示和定位。
- admin-content.js：普通菜单初始渲染前加载共享基线。拖动及撤销将 menuLayout、行与记录写入同一内容键；不另写排序键。
- admin-menu-tree.css：复用原拖动样式，说明其适用平台及租户两种菜单；未更改原六列布局。

## 当前证据

| 检查 | 结果 | 证据 |
|---|---|---|
| SPEC 与 Plan | PASS，9规则/12验收，依赖精确有效 | validate-spec.mjs、validate-plan-boundary.mjs |
| 平台原拖动回归 | 18/18，0 pageerror | checks/regression-platform-drag.cjs、platform-drag-results.json |
| 平台全租户联动回归 | 最终版本9/9，覆盖15窗口，0 pageerror | checks/regression-platform-navigation.cjs、platform-navigation-results.json |
| 状态算法 | PASS；15租户初始/平台对旧算法一致，5种跨组目标×15租户、局部覆盖/旧字段/失效目标恢复、历史深层、平台改名恢复，以及异常身份保持平台隐藏与原有覆盖 | checks/state-check.cjs |
| 历史三级导航 | PASS，uploadCustomerList 三级入口保留、展开并真实打开，无undefined路由 | checks/verify-deep-navigation.cjs、deep-navigation-results.json |
| 租户浏览器全矩阵及专项 | 29/29 PASS，0 browser pageerror；Chrome 153.0.8010.54，含全部15租户与14项专项 | checks/verify-tenant-menu.cjs、tenant-menu-results.json、tested-product-files.sha256 |
| 视觉 | 已目视核对首屏与拖动中状态；六列、手柄、目标文字、插入线无明显错位 | checks/verified-tenant-default.png、verified-tenant-drag.png |

旧060回归中“普通menu无手柄、排序列为数字输入”断言由本次批准R001明确替代；本轮脚本只更新该预期，平台其他断言保持。初次直接运行旧脚本17/18，其中唯一失败就是这条旧范围断言，修订后的18项全部通过。

独立只读复核发现并修复两处边界：历史三级导航的两层Shell假设已替换为递归渲染/定位；异常重复身份不能再走绕过平台约束的兜底。异常模型整表保留，配置无法无歧义解析时全部拖动暂禁用并说明原因；侧栏安全库存仍应用已保存租户覆盖及平台隐藏/删除，不允许假成功或恢复已隐藏项。两处由独立复核确认关闭。

租户29场景涵盖15租户的一级整组/二级组内/跨组及侧栏投影、撤销/刷新/重开、旧设置、同租户多窗口、租户隔离、失败回滚、原位/取消/键盘、只读/三级/空态、平台先有配置/后续改归属/后续改顺序、失效目标恢复、外部修改取消拖动、异常重复身份、平台隐藏不能被异常配置绕过、触控/悬停/边缘滚动/冻结表头。首轮测试中预置状态后未等待事件稳定、用新版元数据伪造旧层级、目标行被表头遮住等夹具问题已修正，最终同一完整脚本全部通过。

静态检查：4份JS语法通过，git diff --check 通过。规格和Plan再次校验通过。最终测试文件hash绑定5份改动产品文件。完整推送阶段产品源码保持该次验收字节，另生成发布单文件并独立验证。

## 完整推送阶段单文件验收

`prototype/build_admin_inline.mjs` 重新构建 `_shell_inline.html`，7,495,320 bytes、78 JSON、5 assets；SHA256 `2410d6dd907331bab601e1cf7a6907ec9d9afd18476f736c609548d73923b4e7`。

Chrome 独立 context、file://、qa=1，并阻断 HTTP/HTTPS；8/8 PASS，0 pageerror，0 外部网络或额外 file 依赖请求。深圳及佰智德三普通 menu 完成一级、二级组内、跨组拖动，侧栏同步、撤销、刷新保存；平台 allMenu 完成九列、一级/跨组/撤销、隐藏恢复回归。三张截图已目视核对。见 checks/inline-068-evidence.md、inline-068-results.json、verify-inline-068.cjs 与 inline-068-*.png。

## 验证方法与限制

使用已安装 Google Chrome 的 Playwright 隔离上下文；新验收使用 qa=1 独立前缀，平台历史回归使用隔离浏览器自身存储。测试不读取或清除用户正常 Chrome 存储。当前普通页面人工预览用正常 Chrome 打开，本地服务地址：

http://127.0.0.1:8148/prototype/_shell.html?tenant=yestar-sz&page=menu&v=20260926-tenant-menu

本次完整推送已补充发布单文件和工程交接。真实工程任务为 [PetWebOrg/suiyin-admin#432](https://github.com/PetWebOrg/suiyin-admin/issues/432)，分配房昕（xfang9528-glitch），提出人房昕、提出环境佰智德三；生产实现与测试仍待工程流程。原型远端推送、部署及两条 SCRUM 通知以独立交付回执的真实结果为准。未更新开发进度表；本地交互通过不代表生产系统上线，跨设备共享不在原型范围。
