# AI费用统计：82天样本与专属模型本地验收

日期：2026-09-20；SPEC-SUIYIN-ADMIN-058@1.2.0；运行类型static-html。已完成本地实现、独立复算和Chrome验收，未发布。

## 实现

- 固定覆盖2026-07-01至2026-09-20，共82天；每租户、每类别稳定波动，刷新不漂移。保留9月18–20日原黄金值。
- 四列表格为分析项目、专属模型、分析次数、费用。深圳采用星瞳/星鉴/星程/星语；画像与上下文共用星鉴。萌爪和佰智德三沿用碎银·用途命名，其他10个reference来源显示演示配置。
- 模型名称参考当前同租户AI模型管理；合成事件/费用保留各自model快照。汇总展示查询记录内模型，不由当前配置覆盖历史；部分缺失保留已知及另有模型待确认；无记录显示明确标识的演示配置和无调用/未启用。
- 单类趋势注释与每日提示同步模型信息，全部类别不强归一个模型。默认今天、查询/重置/类别与表格边界不变。
- 一次全量身份去重后建立日桶，表格和趋势共用，避免按82天重复扫描全量记录。仍保留真实零、未知、缺日、失败费用、跨日及租户隔离语义。
- 13个aiCostStats描述项同步1.2.0版本元信息，不改模型管理数据或菜单。

## 实际验证

| 检查 | 结果 | 证据 |
|---|---|---|
| 主线程逻辑 | 7项PASS；82天稳定性、日期有效、日/月/范围及六种分类两指标复算、模型来源/未知/零、原三日黄金 | evidence/models-1.2.0/checks.json logic |
| 主线程Chrome | 11项PASS；四列、82日曲线、模型提示、图表不改表格、缺日范围压缩、窄窗横向滚动、重置及模型QA | 同上 ui |
| 租户 | 13个正确名称/来源，2个无入口不展示 | 同上 tenants |
| 独立黄金验收 | 34项PASS；自造82天可人工复算样本、A/B历史与当前C隔离、多模型/部分未知/跨租户、跨日去重等；最终生成器调整后主线程再次运行通过 | .research/ai-cost-20260920/review-models-check.cjs |
| 原有计算/交互回归 | 10项计算、17项Chrome、15租户、4旧页PASS | evidence/models-1.2.0/base-regression/checks.json |
| 页面脚本错误 | 0 | 两份checks.json |
| 数据检查 | 15租户/765页面/11263行，身份单元格2381、秘密检查36，failures=[] | sanitize-public-data.mjs --check |
| 合同门禁 | 19规则/24AC、3个精确依赖、static-html边界PASS | validate-spec.mjs / validate-plan-boundary.mjs |

本机Chrome端到端性能（含操作与预设加载反馈；不是生产接口性能）：

- 82-day-query：266 ms
- 82-day-query：235 ms
- 82-day-query：260 ms
- metric-and-category：167 ms
- metric-and-category：161 ms
- metric-and-category：158 ms

均小于批准的1秒阈值。最终真实演示样本深圳共9236条事件、8417条费用记录，独立分析8415次、已知金额842544100微元；最终prepare约52ms，全期汇总不足1ms。金额为合成演示且仍有待确认部分。

## 视觉与预览

- [完整范围与模型列](evidence/models-1.2.0/preview.png)
- [Shell完整范围](evidence/models-1.2.0/full-range-shell.png)
- [单类模型提示](evidence/models-1.2.0/model-tooltip.png)
- [窄窗](evidence/models-1.2.0/narrow-scrolled.png)

已打开可见Google Chrome，通过实际日期控件选中2026-07-01至2026-09-20；回读82个图点及4个列标题。用户关闭该预览窗口时本地浏览器控制进程随之退出。

预览入口：http://127.0.0.1:8148/prototype/_shell.html?tenant=yestar-sz&page=aiCostStats。

## 边界

本轮数据及费用为合成，模型名来自本地配置证据；不证明82天真实调用、实际扣费、独占训练或自研基座。Q002–Q004继续延期。上述本地看图阶段未commit/push/tag、未更新inline/完整PRD/设计规范、未创建工程Issue/新增通知；后续E020完整交付见下。1.1.0历史文档与检查保留在history/和evidence/trend-1.1.0/。

## E020完整交付冻结记录

用户已授权完整推送并指定陈宣宇实施。管理页真实Issue为[#402](https://github.com/PetWebOrg/suiyin-admin/issues/402)，提出人房昕、环境佰智德三、平台PC，已分配cxy-chenxuanyu。PRD/流程/设计规范与当前导航已同步；19R/24AC工程追踪见Handoff/Test Contract，生产测试为planned。

本次生成完整单文件；实际发布构建验收见[evidence/delivery-inline/checks.json](evidence/delivery-inline/checks.json)。修正旧_inline-check把聊天默认确认空态误判失败的验收断言，聊天本体未变。当前专项验证覆盖佰智德三/深圳目录版和单文件：四列五行、82个日点、模型名称、费用与类别切换、表格不被筛选、两版结果一致及脚本错误。

本包在提交前冻结；git master/tag、Cloudflare对应SHA及通知送达回执需在推送后真实验证，不预填成功。静态原型发布不代表生产实现。陈宣宇Q002–Q004截至2026-09-20 20:02北京时间仍未回复，Issue要求开工核实并附可核验证据。
