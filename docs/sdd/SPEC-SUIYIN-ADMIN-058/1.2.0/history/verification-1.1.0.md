# AI费用统计与趋势图本地验收

日期：2026-09-20；SPEC-SUIYIN-ADMIN-058@1.1.0；static-html。已完成本地实现、Chrome预览及独立复核，未发布。

## 当前结果

费用表上方新增使用趋势，默认分析次数、全部已列项目；可切费用或五类之一。类别仅影响图表，表格五行及合计保持完整。图表沿用已提交的单日/日期范围；搜索保留指标/类别，重置恢复今天/次数/全部。

每日数据沿用同批独立业务事件及对客演示费用；任务与费用身份先全局去重再按天汇总。完整相邻点连实线；缺日断线、已知零画零点、部分已知画孤立空心点、全部未知或未启用无历史不绘数值点。鼠标与键盘均可查询没有数值点的日期。长范围按真实日期比例稀疏绘制，未生成虚构样本。

现有13租户AI管理入口沿用1.0.0；jbfs/hqjd不扩展。Q002–Q004继续按批准方案延期，次数和费用均为本地合成演示，不是实际客户账单或正式报价。

## 实际证据

| 检查 | 结果 | 证据 |
|---|---|---|
| 趋势核心计算 | 9项PASS；全部/五类两指标复算、跨日去重、0/未知/停用/缺日/隔离及长范围 | evidence/trend-1.1.0/checks.json logic |
| Chrome趋势交互 | 15项PASS；单点/断线、指标/分类/草稿/查询/重置、键盘提示、窄窗和冻结、异常恢复 | evidence/trend-1.1.0/checks.json ui |
| 原有逻辑回归 | 10项PASS；供应商成本隔离、小额、未知任务、失败费用、未归类等 | evidence/trend-1.1.0/base-regression/checks.json logic |
| 原有页面交互回归 | 17项PASS；日期/日历取消、隐藏门禁、QA状态及窄窗 | 同上 ui |
| 全登记租户 | 13费用页渲染；2个无入口租户不展示费用数据 | 同上 tenants |
| 旧页面 | salesMessageUsage、salesVoiceStats、aiAssistStats、menu均正常 | 同上 regressions |
| 独立只读复核 | 13项Node VM计算、10项Chrome交互PASS，无阻塞；布局与全租户未重复检查 | .research/ai-cost-20260920/review-trend-check.cjs、review-trend-browser.cjs |
| 页面脚本错误 | 主线程及独立Chrome均0 | 各检查输出 |
| 数据检查 | 15租户、765页面、11263行、2381身份单元格、36秘密检查，failures=[] | sanitize-public-data.mjs --check |
| SPEC/Plan | 15规则、20验收、3个精确依赖；static-html边界通过 | validate-spec.mjs、validate-plan-boundary.mjs |

这里的765是原型全租户页面组合数，不是全站视觉验收数。1.0.0的菜单67个迁移检查保持历史证据，本次未改菜单迁移代码。

## 固定复算

深圳租户9月18–20日全部已列项目次数为80、113、91，合计284。原精度已知费用为3.5675、10.011、11.118元，合计24.6965元；19日为部分已知，其他两日为已列范围完整。标签类别为18、23、28次，费用0.3035、0.783、1.449元。均仅为演示。

## 视觉证据

- [默认单日](evidence/trend-1.1.0/default.png)
- [三日次数趋势](evidence/trend-1.1.0/range-count.png)
- [费用部分点与键盘提示](evidence/trend-1.1.0/range-fee-partial.png)
- [900px窗口下单类别费用趋势](evidence/trend-1.1.0/narrow-category.png)

主线程已逐张视觉检查。窄窗实际内容区约620px，未发生页面水平溢出。新增图表后真实滚动表头仍冻结。公共控件会把select增强为combobox，验收采用真实点击选项，而非直接改隐藏select。

## 边界与预览

- 只修改本地静态原型及轻量SDD验收记录，未commit/push/tag、未生成inline或更新完整PRD/设计规范。
- 未创建工程Issue或新增对外通知；未接生产费用API、扣费、认证或共享持久化。
- 陈宣宇询价已送达；最近一次答复检查仍为2026-09-20 18:11:34北京时间未回复，本轮未再次检查，不能视为当前已确认价格。
- Google Chrome已打开：http://127.0.0.1:8148/prototype/_shell.html?tenant=yestar-sz&page=aiCostStats。
- 1.0.0历史文档见history/，原验收数据保留在evidence/checks.json。
