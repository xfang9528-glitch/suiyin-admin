# SPEC-SUIYIN-ADMIN-076@1.0.1 — 本地原型验收

日期：2026-09-30（Asia/Shanghai）。范围为用户批准的静态Admin迭代，未连接真实业务接口；本地结果与远端发布验证分别记录。

## 完成情况

- 登记画美医美-西安huamei-xian和傲丽医美-西安aoli-xian，租户总数17。两个新租户各自有账号、菜单、设置的最小原型入口；菜单骨架可操作，账号/设置真实业务内容明确待采集。
- salesManage默认名称通过共享profile按稳定route迁移，覆盖导航、页签、内容标题及普通/平台菜单；旧sales链接与明确自定义名称保留。
- 六个现有艺星及两新租户不再提供上下班时间设置；其他九租户保留。既有离开转交、上班记录、在线状态及旧保存值没有删除。
- 普通menu与bzds/allMenu提供显示/隐藏双段胶囊，严格本地保存、失败恢复、审计、刷新与多窗口导航联动；保持平台/父级约束及独立隐藏。

## 实际检查

| 证据 | 结果 | 覆盖 |
|---|---|---|
| account-results.json / verify-account.cjs | 60 PASS，0 FAIL | 17租户逐项账号、系统设置、菜单；新租户隔离/待采；旧缓存、默认/自定义名、旧链接、保留历史配置；两种视口 |
| menu-results.json / verify-menu-status.cjs | 17 PASS，0 FAIL | 无变化、行内保存、键盘焦点、编辑取消、普通双键及平台写失败、父子隐藏、只读、跨窗、平台上限及隐藏祖先、当前业务页回退 |
| drag-results.json / verify-drag.cjs | 2 PASS，0 FAIL | 普通与平台菜单键盘拖动、保存、撤销继续可用 |
| 独立只读审查 | 无阻塞问题 | Node VM核对17租户与旧缓存，history/config/menuLayout及自定义名保留；新增数据未借用其他租户 |
| JS语法与git diff --check | PASS | 修改脚本可解析，无空白错误 |
| SPEC和Plan校验 | PASS | 精确版本和static-html边界 |

检查使用独立headless Google Chrome、qa=1存储命名空间，不清空用户现有浏览器配置。账号矩阵没有外部网络请求；两套浏览器检查均无未捕获脚本错误。

首次验收脚本错误地要求打开深圳原本隐藏的dutyRecord；该页面原隐藏配置保持，改用原已显示的成都入口，并以Shell页签/时间状态表头核对。原通用列表不在正文重复显示页签标题，因此同步纠正该测试定位。只重跑未完成后段，之前通过的矩阵保留；初次报告保存在account-results-initial.json。此为测试假设修正，没有为通过测试改变页面业务。

额外平台祖先用例最初选中了深圳本已独立隐藏的专家管理，最终可见性断言不符合基线。改用已显示的数据展示/拉新记录后通过；未修改该独立隐藏配置。最终三份报告共79项PASS，0 FAIL。

## 视觉与预览

- huamei-menu-1480.png：1480×900完整Shell。
- huamei-menu-1280.png：1280×720完整Shell，无外层横向溢出，胶囊和操作列可见。
- aoli-xian-menu.png：傲丽独立菜单页。
- aoli-account-pending.png：账号页明确待采集，不伪装真实空数据。

本地静态服务：`node serve.js`，端口5200。已向Google Chrome打开深圳账号页、傲丽菜单页和画美菜单页。用户预览使用localhost且不带qa；验收使用127.0.0.1和qa隔离。

- http://localhost:5200/prototype/_shell.html?tenant=yestar-sz&page=salesManage
- http://localhost:5200/prototype/_shell.html?tenant=huamei-xian&page=menu
- http://localhost:5200/prototype/_shell.html?tenant=aoli-xian&page=menu

## 尚未采集及交付边界

两个新租户的真实完整菜单、账号和设置资料未采集。现有最小入口与4行菜单表是本次批准的原型骨架，页面持续显示来源说明；不表示线上库存、真实权限或已接入真实数据。以后取得本租户可读资料后再补齐。初次日常迭代止于本地原型。2026-09-30用户随后授权完整推送与两项工程建单，后续发布验证见下文；生产实现仍待正式流程。

## 2026-09-30 完整发布补充

- 用户批准最终账号入口名“碎银账号”；076与077统一使用1.0.1精确版本。
- 发布前重新运行账号60项、菜单17项、拖动2项，全部通过；公开样本脱敏校验17租户、777页、11345行，无失败。
- 最新单文件自检301项、本轮HTTP和file://追加23项，共324 PASS、0 FAIL；0脚本错误、0外部请求。
- 单文件SHA-256：`d41f537d341721252f09f4baf224dc3b1a0709230ba5293f94e93727bafd86e0`。报告见发布仓docs/verification/admin-iteration-20260930/inline-results.json。
- 已建立生产待办#448（移除时间入口）和#449（菜单状态胶囊），均为王争/kitesky、提出人房昕、提出环境佰智德三。生产测试Evidence保持planned。
- 发布tag：`v2026093001-admin-accounts-menu`。远端commit、tag、文件回读和部署/通知回执由独立发布报告保存，不提前视为成功。
