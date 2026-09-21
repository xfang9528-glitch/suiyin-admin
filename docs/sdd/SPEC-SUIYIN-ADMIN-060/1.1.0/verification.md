# 平台菜单拖动排序验收记录

日期：2026-09-21。合同：SPEC-SUIYIN-ADMIN-060@1.0.0。

> 当前实施合同已升级为 1.1.0；下列 1.0.0 内容保留为历史验证记录，其中“不联动侧栏”的范围已由本轮用户纠偏取代。当前结果见文末 1.1.0 全租户联动。

## 实际结果

- SPEC 结构与精确依赖校验通过；Plan static-html 边界校验通过。
- admin-menu-tree.js、admin-content.js 通过 node --check；git diff --check 无错误。
- 使用已安装的 Google Chrome，由 Playwright 在独立上下文运行，1500×1050 视口，现有本地静态服务 8148。全部用例使用 qa=1 本地键，未清理或修改用户日常浏览器存储。
- checks/verify-menu-drag.cjs 的 18 组检查全部通过，浏览器 pageerror 为 0。实际结果与浏览器版本见 checks/results.json。

## 行为证据

| R / AC | 已验证 |
|---|---|
| R001 / AC-R001-01 | 102 个手柄，九列保持，顺序自动编号；编辑/新增无手工排序号，新建一级追加为第 23 项 |
| R002 / AC-R002-01 | 展开/收起一级都携带全部二级，子项身份、归属及顺序保持；拖到其他组的二级行会放在完整目标分支之后 |
| R003 / AC-R003-01 | 同名异 ID 二级组内重排，二级跨一级指定位置/末尾及空一级接收；原一级移空仍保留 |
| R004 / AC-R004-01 | 原位置、表外放下、Escape 不写入；取消恢复临时展开状态；已有三级保留且禁用相关分支拖动 |
| R005 / AC-R005-01 | 真实鼠标移动驱动边缘自动滚动超过 100px；悬停收起一级后展开；表头冻结、横向滚动时第一列手柄仍可见 |
| R006 / AC-R006-01 | 移动保存、一次撤销、刷新完整回读，保留旧备注；编辑取消保留撤销，实际编辑使其失效 |
| R006 / AC-R006-02 | 模拟目标 localStorage 配额异常；移动和撤销写入失败均还原完整模型，不添加虚假成功记录；撤销失败保留重试 |
| R007 / AC-R007-01 | 移动前后业务字段相同；只有 bzds/allMenu 的 QA 键改变；普通 menu 无新手柄、仍保留原排序列；其他租户值不变 |
| R008 / AC-R008-01 | Space、方向键、Enter、Escape 完成组内、跨组、一级及取消；CDP 触控事件完成真实 Pointer Events 拖放；只读和空态无可用手柄 |

截图已查看：checks/verified-default.png、checks/verified-cross-parent-drag.png（同状态早期截图 cross-parent-drag.png）、checks/verified-horizontal-scroll.png。截图与检查是本地静态原型证据，不代表真实后台上线或生产接口验收。

首轮隔离用例人为将导航 enabled 置空，触发既有 Shell 卸载当前页，导致后续 3 个测试上下文失败。修正验证夹具，保留有效导航后完整重跑，最终结果 18/18，无代码运行错误；保留旧失败截图仅供诊断，以 results.json 为最终结果。

## 变更范围

本任务修改原型仓以下四个文件：

- prototype/admin-menu-tree.js：本页树拖动、键盘、保存事务、撤销、自动编号及编辑入口适配。
- prototype/admin-menu-tree.css：本页手柄、落点、拖影、轻提示和横向固定名称列。
- prototype/admin-content.js：本地保存增加可选 strict 返回值及模型变更事件，旧调用保持默认行为。
- prototype/admin-navigation.js：侧栏视图记忆与即时重绘；保留原始导航快照和仍可见页面的 iframe。

未改变静态源数据文件；无 inline 构建、commit/push/tag、发布、工程 Issue、飞书通知或生产仓写入。

## 2026-09-21 本地记忆修复与追加回归

用户明确反馈排序和隐藏在刷新后回到初始值，并提供日常入口（不带 qa）。在独立 Chrome 上下文用该入口复查，修复前已能读回排序/隐藏模型，未在该独立上下文复现用户现有 Chrome 配置中的数据重置；不能据此推断用户原窗口的具体原因。实际确认视图未恢复、普通菜单更新触发整个 Shell 重载，以及平台编辑持久化失败后仍显示成功的缺陷。

已补齐：树表展开/收起和纵横滚动记忆；侧栏展开、滚动、收起状态和页签恢复；明确的本地保存/恢复状态；平台隐藏编辑写入失败时回滚、保留表单并明确提示重试。普通菜单隐藏/显示只更新侧栏，保留仍可见的当前页；基于不变原始快照恢复重新显示的菜单。平台 allMenu 的定义仍不自动同步到租户侧栏，遵循已批准的范围。

`checks/verify-menu-memory.cjs` 使用新建的隔离 Chrome 上下文、用户提供的完整无 qa URL，全部 6 项通过：

1. 排序与隐藏值在浏览器刷新后保持，显示「已恢复本地设置」。
2. 菜单折叠以及纵向 900 / 横向 50 的滚动偏移恢复。
3. 侧栏分组展开、滚动、整体收起状态及已开页签恢复。
4. 同一浏览器上下文重新开页，配置与视图恢复。
5. 注入 localStorage 写入失败，隐藏编辑还原原值，表单可重试，无虚假成功。
6. 普通租户菜单隐藏/重新显示即时改变侧栏，无顶层文档重载，当前 iframe 标记保留。

结果见 `checks/memory-results.json`。已查看 `checks/memory-restored.png`，本地恢复提示、隐藏值及原表格布局可读。随后重跑原有 `checks/verify-menu-drag.cjs`，18 项全部通过。最终 24 项通过，两个结果文件均无 pageerror。两套检查不访问用户 Chrome 个人配置，不清理其 localStorage。

工作树中同时出现的 admin-content.html 引用修改、admin-appointment-chart.css/js 属于其他工作，本任务保留，未修改或归为本次交付。

## 预览与限制

可访问的本地入口：http://127.0.0.1:8148/prototype/_shell.html?tenant=bzds&page=allMenu 。日常入口不带 qa 参数。

已通过 Computer Use 列出并选中标题为「佰智德三私域 · 管理后台原型 - Google Chrome」的窗口。在激活/读取状态阶段，工具报告无法以足够置信度判断当前 Windows 浏览器 URL，为执行其策略而中止本轮 Computer Use。随后停止桌面输入，未绕过限制；无法确认现有可见窗口已经刷新到最新页面。提供入口供用户直接打开。

核心交互已在本机 Google Chrome 的隔离浏览器上下文执行验证；桌面自动切页未完成，不能汇报已替用户打开最新页面。现有静态范围不扩展真实后台能力。

## 1.1.0 全租户联动（本轮用户纠偏）

用户明确平台列表必须与全部租户左侧导航联动。已替换 1.0.0 中错误的范围假设，版本 1.1.0 的 R007/R009 为当前合同。平台规则保存于原有 bzds/allMenu 本地键，各租户侧栏在自身菜单库存上派生读取，不逐租户复制配置。

- admin-menu-state.js：新增平台树投影。由原始路由绑定稳定平台 ID，组节点通过原始子路由归属映射；不按同名文字合并。按当前树排序、跨组并过滤平台隐藏，保留本租户独立隐藏和可用页面范围。
- admin-navigation.js：加载同一份平台基线；成功保存通知及跨窗口 storage 事件触发导航重绘。使用微任务刷新，后台页签不等待动画帧；仍可见页面的 iframe 保留。
- admin-content.js：平台保存成功与恢复样本后通知当前 Shell；继续复用单键提交，失败不传播。
- admin-menu-tree.js：提示全租户本地联动；删除保存失败回滚；失败后重试或重新编辑按稳定 ID 重新取当前行，避免回滚对象被旧表单引用。
- 现有 admin-menu-tree.css 的拖动样式保持。

最终实际验证：

| 记录 | 结果 | 范围 |
|---|---|---|
| checks/results.json | 18/18，通过，无 pageerror | 原拖动、撤销、失败、长表、键盘/触控、租户数据隔离 |
| checks/memory-results.json | 6/6，通过，无 pageerror | 日常无 qa 地址，刷新/重开/视图恢复及失败后再次编辑 |
| checks/platform-navigation-results.json | 9/9，通过，无 pageerror；15 个租户窗口 | 全租户根排序、撤销、二级跨组、同名路由、整组隐藏恢复、失败不传播、刷新重开、租户独立隐藏、旧 1.0.0 本地值接续 |
| checks/platform-destination-results.json | 2/2，通过 | 目标一级不在本租户时仅建立容器、不增加页面权限；有独立页面的一级接收二级时保留自身入口 |

15 租户为 yestar-sz、jbfs、mengzhua、bzds、crrm、hqjd、ykjl、ruixi-kh-xiaowen、rxxz、yestar、yestar-bj、yestar-gz、yestar-hz、yestar-jx、yzhb。测试分别比较各租户原有可见路由集合，没有将 bzds 的页面集合复制给其他租户。即时检查没有顶层文档重载，当前编辑 iframe 标记保留。全部测试使用隔离上下文，不修改用户现有 Chrome 本地数据。

过程发现并修复后台页签 rAF 延迟刷新及失败回滚后的旧行引用问题。一次重开测试错误地假设深圳默认显示专家菜单，修正为选择原本已显示该入口的租户后重跑全 15 租户；深圳原有隐藏设置保留。独立 VM 断言已转换跨上下文数组原型后比较路线集合；以上表中最终记录为准。已查看 platform-navigation-linked.png，树表、全租户联动提示与侧栏布局无错位。

此结果仅针对本地静态原型，同浏览器、同源的所有登记租户联动；不代表真实后台、跨浏览器或跨设备服务端同步。本轮未请求完整推送，无 inline、发布、提交、推送或通知。

最终预览：复用 8148 服务，通过已安装的 Google Chrome 正常启动命令打开 `/prototype/_shell.html?tenant=bzds&page=allMenu&v=20260921-global-menu`，命令退出 0。本轮未调用 Computer Use，也未读取用户窗口或修改其存储；可见窗口最终画面没有另行验证。


## 1.1.0 完整交付检查

2026-09-21 用户明确授权完整推送和为梁晨建工程Issue。当前源文档直接修正平台范围，历史SDD保留原版本并由060声明替代。

- 在隔离Chrome上下文以file://打开新生成的_shell_inline.html，阻断全部HTTP/HTTPS。6项检查通过：离线加载、一级拖动与撤销、二级跨组和隐藏恢复、刷新读取、另一适用租户实时/刷新联动、零脚本错误及零HTTP依赖。
- 原有33项Chrome与2项目标容器边界检查保留；合计39项Chrome和2项模型检查。
- 离线用例按租户原本显示范围选萌爪验证跨组；艺星深圳的专家分组原本独立隐藏，平台配置不会开通该入口。撤销检查以平台统一规则下的原根位置和路由集合为准，不把未经平台统一前的旧侧栏子项顺序当作最终合同。
- SPEC、Plan、来源收敛、追踪合同和远端SDD包均执行本地结构校验。所有生产测试证据仍为planned。
- 工程Issue：https://github.com/PetWebOrg/suiyin-admin/issues/408，负责人vvphp（梁晨），提出环境佰智德三、提出人房昕、平台PC。
- 发布标签：v2026092103-admin-menu-drag-global；精确远端提交、Cloudflare部署和两条SCRUM通知以本地delivery-receipt.json/实际GitHub记录为准，不将发布前检查伪称线上验收。
