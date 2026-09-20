---
test_contract_id: TEST-CONTRACT-SUIYIN-ADMIN-058
spec_id: SPEC-SUIYIN-ADMIN-058
spec_version: 1.2.0
status: draft
prepared_by: "Codex"
prepared_at: 2026-09-20
---

# AI费用统计、分类趋势与专属模型展示 — Test Contract

## 1. 测试摘要

- **源规格**：`SPEC-SUIYIN-ADMIN-058@1.2.0`，见 [spec.md](https://github.com/xfang9528-glitch/suiyin-admin/blob/v2026092004-admin-ai-cost-stats/docs/sdd/SPEC-SUIYIN-ADMIN-058/1.2.0/spec.md)。
- **对应交接**：`HANDOFF-SUIYIN-ADMIN-058`，单一 I001，见 [issue-handoff.md](https://github.com/xfang9528-glitch/suiyin-admin/blob/v2026092004-admin-ai-cost-stats/docs/sdd/SPEC-SUIYIN-ADMIN-058/1.2.0/issue-handoff.md)。
- **目标仓 / 平台 / 提出环境**：`PetWebOrg/suiyin-admin` / PC网页管理页 / 佰智德三；提出人房昕，负责人陈宣宇（cxy-chenxuanyu）；真实 [Issue #402](https://github.com/PetWebOrg/suiyin-admin/issues/402)。
- **覆盖**：19条 MUST、24个AC、24个稳定Test ID。本文定义验收Oracle；正式工程流程选择目标仓已有框架和实际测试位置。
- **当前状态**：全部生产测试为 planned。原型本地验证是设计参考，不能代替生产CI、实际鉴权、真实收费对账或上线证明。

## 2. Strategy

- 计算、去重、金额精度、模型身份与日期归属使用 domain 测试；数据边界使用 contract 测试；交互、异常与权限使用 e2e/security；租户命名与来源使用 parameterized。
- 全部24项均可给出机器判定Oracle，因此计划 automated。表头对齐、窄窗、断线形态和品牌标记采用DOM几何、状态与截图基线，原型视觉参考仍需工程review确认，不能让截图基线自动批准业务变更。
- `Planned Test Path` 是计划逻辑位置，未断言目标仓存在这些目录或使用某种框架；进入正式工程 Phase 1 后可对齐真实目录，保留Test ID、AC-ID与Oracle。
- 真实调用/收费字段、计数、币种、时效与数据覆盖依赖Q002–Q004。没有已核实数据时允许在隔离测试中验证待确认表现，不允许把这些测试说成真实账单已通过。
- R008/R010/R016的固定Mock和static-html仅在原型或测试环境适用。生产读真实授权数据且保持只读统计，不加载固定82天Mock、不把缺失历史回填为模拟费用，也不强制真实客户历史恰好覆盖82天。

## 3. Coverage Matrix

| Test ID | Slice ID | Rule | Acceptance | Layer | Automation | Target Repo | Planned Test Path | Oracle | CI Evidence | Manual Reason |
|---|---|---|---|---|---|---|---|---|---|---|
| T-R001-01 | I001 | R001 | AC-R001-01 | e2e | automated | PetWebOrg/suiyin-admin | tests/spec058/navigation | 在13个现有父级下页面/菜单/已有平台定义身份一致，显式隐藏及隐藏父级不被新功能覆盖；jbfs/hqjd无新增入口；直链不能绕过可见权限 | planned | — |
| T-R002-01 | I001 | R002 | AC-R002-01 | e2e | automated | PetWebOrg/suiyin-admin | tests/spec058/date-query | 冻结上海时钟验证默认今天；日期首尾均计入；编辑草稿不改变旧图表及已应用日期，搜索成功后同批更新 | planned | — |
| T-R002-02 | I001 | R002 | AC-R002-02 | e2e | automated | PetWebOrg/suiyin-admin | tests/spec058/date-boundaries | 空/非法/倒序日期不提交；Escape取消未完成选择并返焦点；快捷日立即查询且保留模式；重置为今天单日及默认图表选择 | planned | — |
| T-R003-01 | I001 | R003 | AC-R003-01 | contract | automated | PetWebOrg/suiyin-admin | tests/spec058/project-scope | 五核心项目可辨识且归类互斥，日调度定义不冒充当日已执行；按需辅助不标每日自动；未启用与零分开；正式项目/启用映射须有Q002证据 | planned | — |
| T-R004-01 | I001 | R004 | AC-R004-01 | domain | automated | PetWebOrg/suiyin-admin | tests/spec058/business-identity | 同一分析多请求及重试仅首次成功计1；另一成功业务ID再加1；手动新ID且成功才增加；不可靠身份保留待确认，不用发送数替代；Q002不同结论先回SPEC | planned | — |
| T-R004-02 | I001 | R004 | AC-R004-02 | domain | automated | PetWebOrg/suiyin-admin | tests/spec058/cross-day | 全记录先按可靠身份去重再分日；失败次数0但已确认费用不清零；跨日首次成功只计1，费用保留原发生日；同费用ID重复不加总且不搬日，实际归属以Q004证据闭合 | planned | — |
| T-R005-01 | I001 | R005 | AC-R005-01 | contract | automated | PetWebOrg/suiyin-admin | tests/spec058/customer-fee-source | 只有供应商成本或混合旧cost且无可靠客户收费记录时显示费用待确认；缺价格/币种/换算亦未知；无自定单价或倍率；真实来源与单位须有Q003记录 | planned | — |
| T-R005-02 | I001 | R005 | AC-R005-02 | domain | automated | PetWebOrg/suiyin-admin | tests/spec058/zero-tiny-fee | 已确认0显示0.00，正数小于0.01显示小于0.01；失败/重试费用取核实后的收费记录，不能由成功次数推算或归零 | planned | — |
| T-R006-01 | I001 | R006 | AC-R006-01 | domain | automated | PetWebOrg/suiyin-admin | tests/spec058/partial-total | 1.23+0.50+0与1项未知显示已确认1.73元且1项待确认；全未知不显示0；次数与金额完整性独立；先全精度汇总再显示两位 | planned | — |
| T-R006-02 | I001 | R006 | AC-R006-02 | domain | automated | PetWebOrg/suiyin-admin | tests/spec058/classification-coverage | 其他场景待核实或有未归类任务/费用时不称全部AI总量；未归类金额和次数独立说明且不消失、不重复入五类；全未知未归类费用不显示0.00 | planned | — |
| T-R006-03 | I001 | R006 | AC-R006-03 | integration | automated | PetWebOrg/suiyin-admin | tests/spec058/date-coverage | 测试覆盖7月1日至9月20日而查询6月30日至9月20日时，6月30日保留缺口；仅汇总已覆盖部分并同时标注次数/费用覆盖，不把缺日补0 | planned | — |
| T-R007-01 | I001 | R007 | AC-R007-01 | security | automated | PetWebOrg/suiyin-admin | tests/spec058/tenant-isolation | 切租户清除旧结果/模型/合计；数据与日期状态隔离；跨租户同任务/费用ID不串用，缓存拒绝错租户；权限不足及直链不泄露记录；正式鉴权以真实服务响应验证 | planned | — |
| T-R008-01 | I001 | R008 | AC-R008-01 | contract | automated | PetWebOrg/suiyin-admin | tests/spec058/demo-boundary | 隔离演示/测试显著标样本；零、未启用、无覆盖和未知不混淆；生产构建及实际查询不引入固定合成账单，真实日期与截止由核实来源提供 | planned | — |
| T-R009-01 | I001 | R009 | AC-R009-01 | e2e | automated | PetWebOrg/suiyin-admin | tests/spec058/loading-retry | 加载有反馈并阻止重复提交；失败同时移除旧图和旧表结果，独立错误不变成无使用；重试使用已应用筛选，不读取未提交草稿 | planned | — |
| T-R010-01 | I001 | R010 | AC-R010-01 | visual | automated | PetWebOrg/suiyin-admin | tests/spec058/sticky-layout | 复用现有Shell与日期表格；纵横滚动/重绘后表头及金额列对齐，日历在上层；统计页不触发扣费或写入操作；原型静态限制不作为生产接口已接通证据 | planned | — |
| T-R011-01 | I001 | R011 | AC-R011-01 | e2e | automated | PetWebOrg/suiyin-admin | tests/spec058/trend-controls | 默认次数/全部已列项目；切费用或单类立即只重绘图表，名称/单位一致，表格五行与合计不变；日期不重置且草稿不生效 | planned | — |
| T-R012-01 | I001 | R012 | AC-R012-01 | domain | automated | PetWebOrg/suiyin-admin | tests/spec058/trend-reconciliation | 全量去重后上海自然日聚合；全部仅五类，单类对应一行；每日可确认次数及原精度已知金额之和等于对应表值；未知/未归类不偷偷并入或当完整 | planned | — |
| T-R013-01 | I001 | R013 | AC-R013-01 | e2e | automated | PetWebOrg/suiyin-admin | tests/spec058/trend-gaps | 未覆盖6月30日在横轴占位且断线，不跨缺口连接或插值；已知0绘零点，未启用无历史不绘0；单日仅一个点并提示选范围，不补邻近日 | planned | — |
| T-R014-01 | I001 | R014 | AC-R014-01 | integration | automated | PetWebOrg/suiyin-admin | tests/spec058/trend-unknown | 已知1.23加未知为孤立空心部分点，全部未知无数值点但可读提示；已知0加未知仍为空心0；不可靠次数同理；部分底层值仍参与复算 | planned | — |
| T-R015-01 | I001 | R015 | AC-R015-01 | e2e | automated | PetWebOrg/suiyin-admin | tests/spec058/trend-accessibility | 鼠标与键盘可读每个日期含缺日/未知的类别、指标、数值及完整性；次数轴整数、费用元；同批加载失败重试；窄窗控件可用、坐标不溢出、日历不被遮挡 | planned | — |
| T-R016-01 | I001 | R016 | AC-R016-01 | integration | automated | PetWebOrg/suiyin-admin | tests/spec058/82-day-fixture | 隔离测试夹具固定82天且同租户稳定，逐日/月/范围复算及类别周内波动成立；冻结时钟默认今天；Chrome连续3次82天查询及切换每次新图可用小于1秒并留环境/耗时；绝不把夹具接成生产账单 | planned | — |
| T-R017-01 | I001 | R017 | AC-R017-01 | parameterized | automated | PetWebOrg/suiyin-admin | tests/spec058/model-column | 四列表头/顺序正确；深圳映射星瞳、星鉴、星鉴、星程、星语，画像与上下文不虚构独立模型；bzds及萌爪保持碎银用途名；共享模型不合并行或重复计费 | planned | — |
| T-R018-01 | I001 | R018 | AC-R018-01 | domain | automated | PetWebOrg/suiyin-admin | tests/spec058/model-history | 历史A/B快照不被当前C覆盖；单类图旁及每日提示取相应记录模型；多模型并列；身份失联/部分缺失保留已知加待确认；无调用只可明确标配置及无调用/未启用；模型信息不改变金额或归类 | planned | — |
| T-R019-01 | I001 | R019 | AC-R019-01 | parameterized | automated | PetWebOrg/suiyin-admin | tests/spec058/model-provenance | 原型/测试的深圳与bzds/萌爪名称及10份reference分别保留来源，reference标演示配置；生产不把reference直接当实配；无版本不补号，不新增自研/独占/训练承诺；窄窗换行/横滚及冻结四列保持对齐 | planned | — |

## 4. Test Data & Profiles

| Data ID | Tenant / Profile | 前置数据 | 隐私处理 | 覆盖 Test IDs |
|---|---|---|---|---|
| D001 | bzds主验收及13有入口/2无入口配置 | 现有父菜单与隐藏覆盖；独立租户权限/日期状态；无入口jbfs/hqjd | 人工合成身份，不复制客户账单或私聊 | T-R001-01、T-R007-01 |
| D002 | bzds及第二租户 | 同任务多次成功/失败、手动新ID、跨日首次成功、跨日费用重复、同ID不同租户 | 独立测试记录，原始ID不引用客户 | T-R003-01、T-R004-01、T-R004-02、T-R007-01 |
| D003 | bzds费用边界 | 1.23/0.50/0/未知、0.0015元、成本来源、未知币种、已知0加未知、未归类任务与费用、6月30日缺口 | 合成金额仅用于测试，真实收费口径另由Q003闭合 | T-R005-01、T-R005-02、T-R006-01、T-R006-02、T-R006-03、T-R008-01、T-R013-01、T-R014-01 |
| D004 | 固定82天、任意测试租户 | i=0至81，第i天成功数1+i%3、费用1000000+i×1000微元；全期163次/85321000微元；7月61次/31465000，8月62次/32426000，9月1至20日40次/21430000 | 完全自造的独立黄金输入；不得用作生产结果 | T-R012-01、T-R016-01 |
| D005 | 深圳captured、bzds/萌爪captured、10reference | July模型A、August模型B、当前配置C，部分记录缺模型/身份失联，另有无调用/未启用、共享模型和多模型 | 不复制供应商接口、凭证、客户聊天或调用原文 | T-R017-01、T-R018-01、T-R019-01 |
| D006 | PC网页管理页、窄窗/键盘 | 冻结上海时间，日期草稿/日历取消、异步加载及一次失败重试，长表/横滚、单点/断线/未知日期 | UI测试隔离账户及合成响应，截图隐藏敏感信息 | T-R002-01、T-R002-02、T-R009-01、T-R010-01、T-R011-01、T-R013-01、T-R014-01、T-R015-01 |

### 4.1 真实来源证据的最低内容

- Q002：实际任务/启用范围、独立业务ID、成功条件和重跑计数；样例至少包含失败、自动重试及手动重跑。
- Q003：可对账的客户收费记录及金额字段、单价单位/生效时间、币种和换算规则；成本表与客户费用清楚分离。
- Q004：时区、跨日归属、实际截止时间、历史/租户覆盖、更新延迟；缺字段、缺日、延迟必须有机器可读或明确可判定的未知状态。
- 负责人陈宣宇在正式工程流程保留脱敏答复和字段/对账证据；不得把私聊全文或生产凭证放进公开原型包。结论改变规则时先走SPEC变更，测试不得自行更改Oracle。

## 5. CI Gates

- I001 PR须落实上述24项测试，保留可检索Test ID/AC-ID；计划路径由目标仓现行框架落地，不在本工作区写生产测试或CI。
- 原型对齐测试、隔离接口夹具、实际鉴权验证及真实费用对账分别留证；只有合成响应通过不能证明正式接口正确。
- Q002–Q004是正式数字上线与证据闭环前的核实条件；可先实现只读页面和未知态，但不宣称尚未核实的正式金额/历史已经验收。
- 固定82天与小于1秒是原型/隔离夹具验收条件，不自动构成真实生产API的SLA或历史保存期限；生产性能约束在正式工程环境依既有合同记录，不得因此回避页面冻结问题。
- 所有CI Evidence当前均为 planned；真实生产报告具备后才替换。SPEC版本/Oracle变化须先更新合同并重跑追踪校验。
- released须同时满足真实Issue Ref、`actual_issue_creation: true`、verified Handoff与verified Test Contract。不得用原型验收报告将本合同提前标verified。

## 6. Evidence

### 6.1 已有原型证据：仅供设计及复现参考

| Evidence ID | 关联范围 | 类型 | 位置 | 限制 |
|---|---|---|---|---|
| PEV001 | R001–R019的静态原型 | 本地验收说明 | [verification.md](https://github.com/xfang9528-glitch/suiyin-admin/blob/v2026092004-admin-ai-cost-stats/docs/sdd/SPEC-SUIYIN-ADMIN-058/1.2.0/verification.md) | 已实现原型，不是生产测试通过证明 |
| PEV002 | 跨月、模型、趋势、租户及性能 | 原型Chrome/逻辑检查 | [models检查](https://github.com/xfang9528-glitch/suiyin-admin/blob/v2026092004-admin-ai-cost-stats/docs/sdd/SPEC-SUIYIN-ADMIN-058/1.2.0/evidence/models-1.2.0/checks.json) | 合成用量和费用，真实数据来源仍需Q002–Q004 |
| PEV003 | 日期/聚合/菜单与既有页回归 | 原型回归 | [base回归](https://github.com/xfang9528-glitch/suiyin-admin/blob/v2026092004-admin-ai-cost-stats/docs/sdd/SPEC-SUIYIN-ADMIN-058/1.2.0/evidence/models-1.2.0/base-regression/checks.json) | 本地隐藏及Mock不证明服务端鉴权 |
| PEV004 | 四列、趋势及模型提示 | 原型截图 | [完整范围](https://github.com/xfang9528-glitch/suiyin-admin/blob/v2026092004-admin-ai-cost-stats/docs/sdd/SPEC-SUIYIN-ADMIN-058/1.2.0/evidence/models-1.2.0/preview.png)、[模型提示](https://github.com/xfang9528-glitch/suiyin-admin/blob/v2026092004-admin-ai-cost-stats/docs/sdd/SPEC-SUIYIN-ADMIN-058/1.2.0/evidence/models-1.2.0/model-tooltip.png) | 视觉参照；不宣称真实历史调用或独占训练 |

本节证据在同一版本包内随附后才成为可访问远端资料；不要把本机.research脚本路径当成工程师可访问的交付证据。原型通过数量以verification的实际记录为准，不与下面生产planned状态混写。

### 6.2 待取得的生产证据

| Evidence ID | 关联范围 | 类型 | 位置 | 保留时机 |
|---|---|---|---|---|
| EV001 | 全部24个Test ID | 目标仓CI报告及测试环境说明 | planned；I001的PR/CI artifacts中替换真实URL | PR验收 |
| EV002 | T-R003-01、T-R004-01、T-R004-02、T-R005-01、T-R005-02、T-R006-01、T-R006-03 | Q002–Q004脱敏字段、日期及收费对账证据 | planned；正式Issue/PR中保存可访问记录 | 正式数字上线前 |
| EV003 | T-R001-01、T-R007-01 | 真实权限不足及跨租户访问验证 | planned；目标仓CI或受控验收记录 | PR验收 |
| EV004 | T-R010-01、T-R015-01、T-R016-01、T-R019-01 | 目标仓浏览器几何/截图及操作耗时 | planned；截图和运行环境随CI artifact保留 | PR验收 |

## 7. Change Control

- SPEC版本或规则变化后本合同立即stale；代码或测试框架迁移不能悄悄改变业务Oracle。
- 对生产能力的新增承诺、实际计费或模型历史规则有争议，先回源SPEC与Q002–Q004，不在测试里写一个方便通过的新答案。
- 本文件只准备工程合同；不创建Issue、不执行通知、不在本工作区修改生产代码。
