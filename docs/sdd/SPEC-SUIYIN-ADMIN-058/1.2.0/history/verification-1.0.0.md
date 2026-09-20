# AI费用统计本地验收

日期：2026-09-20；SPEC-SUIYIN-ADMIN-058@1.0.0；运行类型static-html。状态：本地已实现并通过检查，未发布。

## 实现结果

现有13租户AI管理下新增aiCostStats，与租户menu/settings和bzds平台allMenu同步；jbfs/hqjd不新增父目录。费用页为单日/范围及五项目三列表，日期控件、菜单状态与冻结表头复用既有模块。初始为上海今天，样本固定2026-09-18至20日。

所有新次数、金额为按租户键生成的合成样本。费用未知、分类未完整、日期缺失分别表达，不接入真实收费或供应商成本。Q002–Q004按批准方案延期，未被实施状态误标为实际账务已确认。

## 实际检查结果

| 检查 | 结果 | 证据 |
|---|---|---|
| SPEC及Plan门禁 | PASS，批准记录完整、3个精确依赖有效、static-html边界通过 | validate-spec.mjs / validate-plan-boundary.mjs执行输出 |
| 菜单结构与迁移 | 13入口、13页面、13租户树、1平台定义；67个迁移/幂等/隐藏案例通过，二次运行0文件变更 | .research/ai-cost-20260920/prepare-menu-integration.mjs执行输出 |
| 独立关键逻辑复算 | 10项通过：首次成功去重、跨日、失败费用、同ID费用去重、租户隔离、成本隔离、停用历史未知、缺ID、未归类、缺日期与小额 | evidence/checks.json logic |
| Chrome页面检查 | 17项通过：入口、草稿/提交、非法日期、重置、日历Escape、快捷日模式、窄窗、真实滚动冻结、QA异常和直链隐藏门禁 | evidence/checks.json ui |
| 全登记租户 | 13个费用页成功渲染且说明包含各自租户；2个无入口租户拒绝加载、不展示费用数据 | evidence/checks.json tenants |
| 既有页回归 | salesMessageUsage、salesVoiceStats、aiAssistStats、menu正常，无新费用renderer误接 | evidence/checks.json regressions |
| 脚本错误 | 0 | evidence/checks.json errors |
| 公开数据检查 | 15租户、765页面、11263行、2381身份单元格、36秘密检查，failures=[] | sanitize-public-data.mjs --check |

这里的765是当前全原型租户页面组合数（原752+13），不是本次新页面数量或全站视觉验收数量。

## 视觉证据

- [默认单日](evidence/default.png)：1480×1050，AI管理已展开，五类/三列/合计及演示标识。
- [范围含缺失日期](evidence/partial-range.png)：9月17–20日，缺17日、已覆盖部分与1项费用待确认。
- [窄窗范围](evidence/narrow-range.png)：900×700，时间区自动换行，页面无水平溢出。
- 1480×650实际页面滚动：表头top=0，启用原冻结模块，未新增强制表内滚动。

发现并修复的窄窗问题：日期字段原flex宽度导致快捷日越过右边界，现限定字段最大宽度并换行；添加页面scrollWidth检查。范围日期标题与长金额状态允许换行。

## 独立复核与修复

只读审查发现并复现三项组合边界：停用项目历史未知费用未计入未知合计；未归类成功业务任务被丢弃；未归类全未知金额显示0.00。均已修复并由原审查agent复跑通过；主线程同步覆盖在逻辑复算中。

## 业务与交付边界

- 陈宣宇核实消息已送达并回读；截至2026-09-20 18:11:34北京时间检查仍未回复。费用示例不能当作实际扣费或正式报价。
- 未查询生产执行日志/账单；本地演示门禁不代表生产鉴权。
- 未commit/push/tag，未更新inline/完整PRD/设计规范，未创建工程Issue或发送交付通知。
- 预览：http://127.0.0.1:8148/prototype/_shell.html?tenant=yestar-sz&page=aiCostStats。
