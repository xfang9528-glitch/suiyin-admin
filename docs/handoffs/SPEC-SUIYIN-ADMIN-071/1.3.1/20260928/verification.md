# 六艺星回访规则静态原型验证

- SPEC：SPEC-SUIYIN-ADMIN-071@1.3.1，2026-09-28；本次完整推送依据E029。
- 范围：深圳、成都、北京、广州、杭州、嘉兴六个现有艺星；原回访基准下拉15个直接选项，事件不再二次选择次数，等级仍选人工/AI。
- 运行类型：static-html；本浏览器按tenant/QA隔离的合成规则与历史，不接真实调度、CRM/等级接口、PC名单或发送。
- 旧1.2来源收敛和本验证已先按字节存入history/1.2.0；既有1.0/1.1/1.2/1.3合同、旧checks及已发布包保持原样。

## 当前证据与继承边界

| 检查 | 结果 | 证据与执行边界 |
|---|---|---|
| 15项直选Chrome交互 | 7/7 PASS；脚本异常0，外部请求0 | checks/v1.3.1/event-option-ui-results.json；本版UI实际执行，覆盖六租户、六事件配对、保存/刷新/取消、非法配置显式修复、等级来源及窄窗 |
| 真正file协议离线单文件 | 13/13 PASS；脚本异常0，外部请求0 | checks/v1.3.1/inline-event-options-results.json；HTTP请求阻断后实际从file入口验证，与HTTP检查页分开 |
| HTTP综合单文件检查页 | 155/155 PASS，其中回访50/50；脚本异常0 | checks/v1.3.1/inline-check-page-results.json；本版实际执行，不沿用旧137/137 |
| 当前模型与原证据绑定 | 79/79既有模型用例可继承；本轮SHA核对PASS | checks/v1.3.1/model-evidence-binding.json；明确不是模型重跑，原结果仍在checks/v1.3.0 |
| 新基准模型语义 | 36/36 PASS，原执行版本1.3.0 | checks/v1.3.0/anchor-model-results.json；当前模型字节相同，覆盖人工/AI、首次/最近一次、未来/非法/空历史、等级变化、北京时间边界及旧维度 |
| 六租户模型隔离 | 18/18 PASS，原执行版本1.3.0 | checks/v1.3.0/tenant-model-results.json；当前同SHA，覆盖账号/实体/选项/权限与闭包独立 |
| 深圳既有节点与筛选 | 25/25 PASS，原执行版本1.3.0 | checks/v1.3.0/sz-compatibility-results.json；当前同SHA，涵盖节点复制、48小时、双方AND、选中AND/排除OR与旧5日期 |
| 不变菜单的历史基线 | 1.2.0的66/66 PASS：52迁移、14范围/schema；不是本轮重跑 | [1.2.0固定版本菜单结果][H12-menu]；本次无菜单变更，当前库存重读仍15租户/802入口/89路由 |
| 公开样本审计 | PASS：15租户、771数据页、11314行、2456身份单元格、36敏感字段，失败0 | 本轮prototype/sanitize-public-data.mjs --check；由主代理实际执行，不能据此声称真实来源接口已接通 |
| 来源收敛 | 当前六文档已原位同步，旧证据与现行交互分开 | source-convergence.md及checks/v1.3.1/convergence-search-*.json；覆盖所有§4.1冲突 |
| SPEC/Plan/来源收敛校验 | 三项PASS，零error/零warning；19规则、24验收、0开放问题 | checks/v1.3.1/convergence-search-validators.json；账本23来源、24搜索，static-html边界通过 |

原1.3.0的9项UI结果保留历史，不能替代当前15项直选验收；1.2.0的15项Chrome、12项file及137项HTTP结果也不作为本轮重跑。当前范围用本版7项UI、13项file和155项HTTP证据证明，模型则以相同源码SHA继承79项原执行结果。

## 源码和单文件绑定

| 文件 | SHA-256 |
|---|---|
| prototype/admin-revisit-rules-model.js | e5f01e95983b3288735eb31e3eed9a908114365e1e946b13e126b084ce24aac7 |
| prototype/admin-revisit-rules.js | d82845e1c6306d5b02d744c93f030b1f04336e7a7b01f89846323373f4abba94 |
| prototype/admin-revisit-rules.css | cf6a132a0d7d71ed1ac64e7bb5922993cc4550f37a03a375460423116571f5ad |
| prototype/_shell_inline.html | d61e8c5006c2c238b98868b75966ab13c68c6ceb4de108af195a4eccde402f87 |
| prototype/_inline-check.html | 87265b32238e0809adabbb7054f72bf138f963242780e90c6585b01a4c1130e5 |

单文件大小10,545,234 bytes；Chrome 153.0.8010.54。file验收比对内嵌模型/UI/CSS、菜单状态、导航及六店数据与当前产品源一致，执行期间源码未变化。模型内部仍是12类基准：5日期、4等级、3业务事件；UI将每个业务事件配对first/latest展开为6项，因此页面共15项，不将两种数量混用。

## 已验证的行为

六店原下拉均有首次/最近一次到店、购买、划扣6个明确选项，无独立事件取值控件；成为A/B/C/D级仍可选人工/AI，预约显示名为“预约日期”且保留appointment与原日期语义。节点选中21项、排除26项不增加事件字段，原规则布局及共享范围/运行时刻保留。

旧合法事件anchor/anchorOccurrence配对打开及取消不迁写，保存和刷新正确回显；缺失或非法配对不默选latest，保留原数据并阻止保存，只有显式选择才能修复。切换回日期会清理不适用参数。旧5日期规则不需新增字段；深圳旧ID、v1显式导入及v2键保持，其他店与QA状态互不覆盖。

模型证据覆盖人工与AI历史独立、首次/最近一次使用截至运行时已发生的对应事件、晚1毫秒不提前触发、日期按北京时间第0天起算。当前等级不能猜进入日期；同值评定不重置，离开D变A后原D事件仍可到期，只有显式等级条件才限制当前等级。坏历史与有效事件混合仍unknown，已知完整空历史为未入选，购买与划扣不互相填值。

离线Chrome实际检查六店保存、刷新、启停、tenant/QA隔离，以及6种旧事件配对与非法配置修复。六店旧回访统计继续独立；9个非艺星加unknown共10个直接路由拒绝挂载。1120窄窗无页面横向溢出。所有演示数据均合成，不将试算人数解释为业务量。

## 可视证据

本版多文件下拉正常滚动截图：checks/v1.3.1/event-options-top.png、event-options-bottom.png、event-options-narrow.png；独立Chrome context仅使用合成QA草稿，无隐藏DOM或样式遮挡。

本版file截图：checks/v1.3.1/inline-event-options-top.png、inline-event-options-bottom.png、inline-event-options-narrow.png、inline-grade-ai.png。截图及其范围在inline-event-options-results.json登记。预览仍复用8148服务；主代理打开Google Chrome到深圳revisitRules的1.3.1入口。此记录不把本地可见性当在线部署证据。

## 来源、隐私与交付边界

其他五店massMessageListYx为深圳reference；广州/杭州/嘉兴客户页为成都reference；各店账号页有本店样本也不等于完整权限目录或历史事件接口。因此新增历史仍按tenant独立合成，不借用深圳实体当其他店事实，不把PC AI历次分析mock当真实进入等级事件。

本期仅继承049@1.1.1中到店、独立收款和划扣核销相互独立的语义；不接其延期的真实导入合同，不从旧未到店/到店/成交状态推算时间，不新增商品筛选。缺失历史继续无法判断。

公开包预审只扫描预定合同、历史及验收文本，未打开私聊/MCP研究原文；检查输出只记路径类别与行号，不抄录敏感内容。canonical/history原字节不变，公开副本的本机路径另规范化为真实固定版本链接或明确local-only来源别名，记录转换及前后hash。原始研究、凭据和通知收件标识不纳入公开包。

E029授权本版完整推送。本文件只记录本地已执行检查及明确继承的旧证据；commit/tag、远端SDD可读性、Cloudflare部署与SCRUM通知仍由主代理读取实际回执后记录，不因本地PASS而视为成功。未创建工程Issue，不进入生产仓，不更新开发进度表。

[H12-menu]: https://github.com/xfang9528-glitch/suiyin-admin/blob/v2026092802-admin-revisit-tenants/docs/sdd/SPEC-SUIYIN-ADMIN-071/1.2.0/checks/v1.2.0/menu-extension-results.json
