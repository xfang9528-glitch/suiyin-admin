# AI分析任务与费用口径盘点

调查日：2026-09-20；项目：管理页AI费用统计。本文为规格取证，非生产运行报告或正式报价。

## 1. 已确认到什么程度

- 当前原型：逐项读取 suiyin-admin 的导航、内容JSON和最新SDD。
- 后端：使用gh CLI只读读取PetWebOrg/suiyin-go远端main，冻结提交 `567bdff857d68c3c0ad4a11d9e907734ffe9ee5e`（提交时间2026-09-20 17:16:24北京时间）。未进入或修改生产仓。
- 调度代码证明每日扫描定义；未查询生产集群Job、当日执行日志和实际账单，不能称所有租户今天均执行或已产生指定费用。
- 已于2026-09-20 17:54北京时间飞书私聊陈宣宇，消息送达并按message_id回读验证；仍待回复。私聊凭据与原始记录仅在本机 `.research/ai-cost-20260920/`，不进入公开原型包。

## 2. 每日调度与按需项目

| 项目 | scene | 已确认触发定义 | 证据与限制 |
|---|---|---|---|
| 客户标签分析 | label_analysis | 北京时间每日02:00扫描 | 模板开启cronEnabled且满足消息等门槛才创建分析，不等于每客户每日1次 |
| 客户画像分析 | customer_profile | 北京时间每日02:30扫描 | 同上，运行记录未取证 |
| AI上下文整理 | ai_context | 北京时间每日04:00扫描 | 用户原清单的遗漏项，与画像共享模型名不能视为同一个任务 |
| 沟通进度分析/聊天质检 | chat_score | 北京时间每日05:30扫描 | 按客户×人设计算，也有手动/批量分析入口 |
| AI辅助回复 | ai_reply、customer_chat、group_chat等 | 使用时触发；本次未发现独立每日扫描 | 生成/请求不等于成功发送，未采用草稿也可能消耗资源 |

四个每日调度都有最多4分钟的租户错峰。部署定义的UTC cron按北京时间换算；不能把配置时刻说成每次实际完成时刻。

直接证据：

- [CronJob定义：标签、画像、上下文、沟通进度](https://github.com/PetWebOrg/suiyin-go/blob/567bdff857d68c3c0ad4a11d9e907734ffe9ee5e/admin/manifests/10-admin.yaml#L1053)（分别L1053、L1094、L1135、L1176）。
- [定时路由与错峰](https://github.com/PetWebOrg/suiyin-go/blob/567bdff857d68c3c0ad4a11d9e907734ffe9ee5e/admin/router/schedule.go#L77)。
- [场景枚举](https://github.com/PetWebOrg/suiyin-go/blob/567bdff857d68c3c0ad4a11d9e907734ffe9ee5e/db/models/ai_prompt_template.go#L14)。

## 3. 其他可能产生费用的能力

| 候选项目 | 已有证据 | 未确认点 | 首版处理建议 |
|---|---|---|---|
| 朋友圈评论 | moment_comment场景；StarTalk配置 | 实际触发、用量记录及收费归属 | 确认后单列或纳入辅助，不能双算 |
| 客服能力分析 | service_ability场景；StarPath配置 | 是否独立调用/每日执行、与沟通进度关系 | 暂不凭名称增加费用行 |
| 线下沟通分析 | offline_comm场景；StarEcho配置 | 启用范围、触发、客户收费 | 待陈宣宇确认 |
| 语音转写纠错 | asr_correction及统一用量记录路径 | 是否与转写分账、是否另按时长收费 | 待陈宣宇确认 |
| 人设声线统一、咨询录音转写 | 9月18日页面有StarTone/StarTranscribe启用配置 | 当前文档为display_only，不能证明普通AI任务/cron/收费链路已开通 | 只列调查候选，不凭配置填次数和金额 |

[display_only边界](https://github.com/PetWebOrg/suiyin-go/blob/567bdff857d68c3c0ad4a11d9e907734ffe9ee5e/docs/frontend-ai-display-only.md#L3)：界面显示不等于实际任务执行能力。

本地模型快照位置：`suiyin-admin/prototype/data/content/yestar-sz.json:23278`，采集于2026-09-18 08:55:48 UTC；StarPath L23314、StarEcho L23327、StarTalk L23340、StarInsight L23353、StarLens L23366、StarTone L23379、StarTranscribe L23392。它证明历史配置，而不是今日调用或账单。

## 4. 次数不能混用

| 名称 | 含义 | 已有证据 | 不可替代的量 |
|---|---|---|---|
| 业务分析次数 | 业务任务量；标签统计使用distinct task_id | [标签统计](https://github.com/PetWebOrg/suiyin-go/blob/567bdff857d68c3c0ad4a11d9e907734ffe9ee5e/admin/service/ai_label_stats.go#L66) | 不等于每个模型请求；是否只算成功待确认 |
| 模型调用次数 | 每次真实HTTP请求一条用量记录，包括重试 | [请求记录入口](https://github.com/PetWebOrg/suiyin-go/blob/567bdff857d68c3c0ad4a11d9e907734ffe9ee5e/db/aiusage/http.go#L51) | 分段/汇总/重试可让一个任务多次调用 |
| AI辅助发送数 | 成功发出的AI直发/AI参考消息 | [发送来源正式口径](https://github.com/PetWebOrg/suiyin-go/blob/567bdff857d68c3c0ad4a11d9e907734ffe9ee5e/docs/frontend-ai-assist-stats.md#L13) | 未发送草稿不在其中，不能拿它当付费调用数 |

本地 `aiLabelStats` 与 `aiChatQuality` 的深圳填充数据为mock，不可用作当前运行量。原始深圳标签统计采集还处于loading；某个租户某天的0不能推广为所有租户0。

SPEC R004的“首次成功独立业务任务”是本次AI提案，不是已证明全场景统一使用的收费口径。需要陈宣宇确认业务ID覆盖、成功条件、手动重跑及自动重试。

## 5. 已有费用基础与不能直接使用的字段

[已关闭且标记shipped的Issue #3560](https://github.com/PetWebOrg/suiyin-go/issues/3560)（2026-09-06）明确供应商采购成本与客户收费隔离、失败有用量照记、未知价格不冒充零。关闭/合并不替代线上实际数据覆盖验证。

当前main的[platform_ai_usage_log模型](https://github.com/PetWebOrg/suiyin-go/blob/567bdff857d68c3c0ad4a11d9e907734ffe9ee5e/db/models/platform_ai_usage_log.go#L10)包含：

- 归属/分类：scene、domain、enterpriseId、taskId、stage。
- 供应商/模型快照：provider、configuredProvider、requestedModel、modelName、modelId。
- 用量：inputTokens、cacheHitTokens、outputTokens、cacheCreationTokens。
- 请求/用量状态：startedAt、createdAt、httpStatus、requestStatus、usageStatus。
- 成本：supplierCost、costStatus、costRuleId、costCurrency、costRates。

`supplierCost`为可空数值，nil表示未核算。`cost`注释是“历史兼容口径（客户收费/旧估值）”。因此不能直接把`sum(cost)`叫客户实付，也不能把`sum(supplierCost)`叫客户扣费。

代码可确认的计算结构：

1. [客户收费路径](https://github.com/PetWebOrg/suiyin-go/blob/567bdff857d68c3c0ad4a11d9e907734ffe9ee5e/admin/service/ai_task_provider.go#L80)：输入Token×规则InputPrice＋输出Token×规则OutputPrice。规则按企业/模型查找。**实际单价、单位、减免、扣账字段和适用场景仍待陈宣宇确认，不能据此给出每次多少钱。**
2. [供应商成本核算](https://github.com/PetWebOrg/suiyin-go/blob/567bdff857d68c3c0ad4a11d9e907734ffe9ee5e/db/aiusage/price.go#L53)：（未缓存输入×输入单价＋缓存输入×缓存单价＋输出×输出单价）÷1,000,000。供应商、实际模型、价格生效时间、缓存/峰谷/币种参与匹配；已含缓存的输入不能再次全部重复计价，输出所含思考Token不重复累计。
3. [供应商价格模型](https://github.com/PetWebOrg/suiyin-go/blob/567bdff857d68c3c0ad4a11d9e907734ffe9ee5e/db/models/platform_ai_supplier_price.go#L8)明确单价为每百万Token且与客户收费表独立。

可据现有字段判断按企业、日期、scene具备汇总基础；不能由此保证所有历史请求都已入账、有可靠价格、为人民币或已归属业务任务。

## 6. 原型入口与复用范围

当前导航由主线程重新读取验证：15个登记租户中13个有AI管理父目录；jbfs显示名“锦帛美学”、hqjd显示名“厚全鸡蛋”均无该父级。不能用过时别名或在费用需求中擅自开通父菜单。

- 多数父级id为group-12；crrm/ykjl为group-10；rxxz/yestar/yestar-bj/yzhb为group-11。按租户定位父级，校验已有aiEntModelConfig/aiChatQuality与父标题。
- 现有共同子路由：promptTemplate、aiEntModelConfig、asrLexicon、aiChatQuality。
- 新路由候选aiCostStats无冲突；保持当前菜单显示/隐藏与本地override保护。
- 批准后需同步navigation-snapshot中menu/settings、对应租户content中的menu树、既有平台allMenu定义及本地菜单状态迁移。不能只加侧栏链接。
- 现行Shell由admin-navigation.js:21打开admin-content.html；旧ai_prompt_v1.0.html的定时文案只作历史来源。
- 日期复用admin-sales-usage.js及admin-stats-date-picker；表头复用admin-table-sticky；不把销售页的部门/导出等额外动作一并带入。

## 7. 已发给陈宣宇的核实范围

1. 实际在跑的完整任务、定时/事件/手动触发、哪些租户启用。
2. 业务分析、模型调用、失败、重试、缓存和手动重跑怎样计数与收费。
3. 对客人民币金额的真实来源、公式、单价单位、生效时间和脱敏换算例子；成本与客户扣费分开。
4. 记录粒度、日期归属、更新延迟、历史覆盖与尚不能核算的部分。

状态：已送达且回读；截至当前检查无答复。若后续取得回复，先验证并更新SPEC中的Q002–Q004；若改变已批准规则则按审核流程修订。
