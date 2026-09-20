---
ledger_id: CONVERGENCE-SUIYIN-ADMIN-058
spec_id: SPEC-SUIYIN-ADMIN-058
spec_version: 1.2.0
status: verified
prepared_by: Codex
prepared_at: 2026-09-20
---

# AI费用统计 — Source Convergence Ledger

## 1. 收敛摘要

E020明确授权完整推送和管理页工程Issue。按SPEC §4.1收敛当前文档、旧样本范围、模型身份和费用语义；保持既有消息统计及历史版本，不把原型测试当成正式账务或生产执行证据。

## 2. Source Ledger

| Source ID | Old Source | Conflict / Superseded Rule | Resolution | Evidence | Remaining |
|---|---|---|---|---|---|
| S001 | README.md、CLAUDE.md、prd/admin-live-reference.md、flowcharts/admin-live-reference.md、docs/design-spec.md | 当前库存752/84及缺058入口 | updated | 更新765入口/85路由，新增13费用入口；旧752验收明确上一轮；source-search.json | none |
| S002 | SPEC §4.1、prd/ai-assisted-message-stats.md与009 | AI直发/参考/手动发送不等于分析或费用 | updated | 旧009规则保留，PRD补费用独立入口及不可换算边界；费用新PRD | none |
| S003 | inventory.md、SPEC §4.1及058费用表 | 供应商成本和客户扣费可能混淆 | updated | prd/ai-cost-stats.md金额段、Issue #402 Q003；未知不置0；费用聚合验证 | none |
| S004 | inventory.md及旧prototype/ai_prompt_v1.0.html | 旧每日时段不能证明所有任务/所有租户今日执行 | intentional-history | 旧独立页不在当前Shell加载链；inventory代码定义与运行证据分开；#402 Q002/Q004 | none |
| S005 | 051冻结采集来源及当前费用模块 | 新合成数据不能借旧快照冒充账单 | updated | 当前PRD、设计规范、页面样本声明；verification.md | none |
| S006 | navigation-snapshot.json、13租户content、admin-menu-state.js | 15登记租户不等于15个AI父级，父ID不同且隐藏状态不可重开 | updated | 13个aiCostStats、另2个缺入口；67菜单迁移断言与15租户验收 | none |
| S007 | history/spec-1.0.0.md、history/plan-1.0.0.md | 旧不做趋势 | intentional-history | 当前SPEC §4.1明确由1.1趋势及1.2合同取代，历史不作当前入口 | none |
| S008 | history/spec-1.1.0.md、history/plan-1.1.0.md、旧趋势截图 | 旧三天样本且无模型列 | intentional-history | 当前R016–R019及README指1.2；历史截图保留原版本目录，最新preview.png另列 | none |
| S009 | tasks.md T004、change-review-1.1.0/1.2.0.md | 三列、三天等旧词 | superseded | T004明确1.0历史并由T015四列替代；变更稿仅记录批准过程 | none |
| S010 | 13份aiEntModelConfig | 深圳品牌不能强加其他租户；10份reference非租户当前真实配置 | updated | 当前模型列按租户名称、参考标记及历史record快照；models-1.2.0/checks.json | none |
| S011 | 当前spec/plan/tasks的未授权发布与not-requested | 本轮已授权完整推送与陈宣宇工程Issue | updated | E020、SPEC §10.2、Plan §13、Issue #402；业务版本不变 | none |
| S012 | verification.md与旧evidence、docs/verification历史材料 | 当时未发布及752入口验证不等于当前交付状态 | intentional-history | verification前期结论标本地阶段，新增本轮交付段；不改旧测试数 | none |
| S013 | prototype/build_release_manifest.mjs | 主规格054与旧覆盖765前值 | updated | 主规格058@1.2.0、specs追加058、coverage为15/85/765 | none |

## 3. Search Proof

| Search ID | Pattern / Old Term | Scope | Command / Method | Result | Evidence |
|---|---|---|---|---|---|
| Q001 | 752、84路由 | 当前README/CLAUDE/PRD/流程/设计 | rg限定当前文档；人工区分上一轮采集与当前覆盖 | 0 active conflicts；历史验收限定保留 | source-search.json |
| Q002 | 三列、三天、不做走势、09-18至20 | canonical058及旧版本 | rg限定058；查history与版本变更说明 | 0 active conflicts；局部三日验收窗口仍有效 | source-search.json |
| Q003 | AI费用、供应商、客户扣费、消息统计 | 当前主文档和费用PRD | rg及聚合边界验收 | 0 active conflicts；009不改，费用独立 | source-search.json、verification.md |
| Q004 | reference、演示配置、星瞳、碎银 | 当前模型配置与费用模块 | 按租户字段核查与Chrome15租户验证 | 0 active conflicts；3本租户来源/10参考标识 | evidence/models-1.2.0/checks.json |
| Q005 | 未授权、not-requested、不授权发布 | 当前spec/plan/tasks及verification | rg并登记E020当前授权 | 0 active conflicts；历史阶段明确保留 | source-search.json |

## 4. Verification Gate

- [x] 源SPEC为implemented且版本1.2.0。
- [x] §4.1每类来源都有处理记录，Remaining全部none。
- [x] 当前README/PRD/流程/设计规范已在原位置更新。
- [x] 搜索证据保存并区分历史记录和当前规则。
- [x] 运行validate-source-convergence.mjs，无错误后随交付包归档。

**结论**：verified  
**审核人**：Codex（来源核查）  
**审核日期**：2026-09-20

当前文档收敛；验证记录见delivery-validation.json。生产Q002–Q004仍是工程核实条件，不属于历史文档冲突。

## 5. Change Control

SPEC升版后重新收敛；不得编辑已经发布的旧版本包。本轮只更新058及当前文档，生产规则有变化先回源审核。
