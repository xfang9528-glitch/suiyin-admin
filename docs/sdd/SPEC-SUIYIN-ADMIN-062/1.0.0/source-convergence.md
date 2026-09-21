---
ledger_id: CONVERGENCE-SUIYIN-ADMIN-062
spec_id: SPEC-SUIYIN-ADMIN-062
spec_version: 1.0.0
status: verified
prepared_by: Codex
prepared_at: 2026-09-21
---

# 预约图表 — 来源收敛

## 1. 收敛摘要

用户2026-09-21授权完整推送；本规格仅对预约记录页增加总量/组合图。父规格及已发布历史快照保留，不追改其批准版本。

## 2. Source Ledger

| Source ID | Old Source | Conflict / Superseded Rule | Resolution | Evidence | Remaining |
|---|---|---|---|---|---|
| S001 | docs/design-spec.md 表格规则；055@1.1.0 R004 | 默认不得给普通统计页增加汇总卡 | updated | 现行设计规范原句后直接添加062预约专属例外，README/PRD/流程入口同步 | none |
| S002 | docs/sdd/SPEC-SUIYIN-ADMIN-055/1.1.0/spec.md | 历史规格不包含本次明确授权图表 | intentional-history | README合同表说明后续规格只覆盖自己的范围，062精确依赖055且显式限定预约例外 | none |
| S003 | prototype/data/content/yestar-sz.json appointmentRecords | 20条采样和历史分页293并非完整数据 | intentional-history | 原JSON保持历史；R007与实现分别显示样本20/独立演示318，不按293编曲线；checks.json样本检查通过 | none |
| S004 | 2026-09-18 JSON与2026-09-21用户附件 | 不同时间窗口不能合并补齐全量 | intentional-history | PRD来源段明确两者分别用于结构/部分样本，图表只依同批记录；当前查询来源检查 | none |

## 3. Search Proof

| Search ID | Pattern / Old Term | Scope | Command / Method | Result | Evidence |
|---|---|---|---|---|---|
| Q001 | 汇总卡、预约、062 | docs/design-spec.md、README.md、prd、flowcharts | rg -n -e 汇总卡 -e 预约 -e 062 后逐项审阅 | 预约显式例外；使用统计、AI辅助等原规则仅作用于各自页面 | source-search.txt |
| Q002 | 20、293、318、partial、reference | 062合同、admin-appointment-chart.js、预约原JSON | 定向读取源样本与30项Chrome/聚合检查 | 只有来源历史和明确合成演示，不制造全量趋势 | verification.md、evidence/checks.json |
| Q003 | 2026-09-18、2026-09-21、采样 | 062/spec.md、prd/appointment-chart.md | 对照E002/E005与PRD来源段 | 时间窗口分别表达，不拼接历史和新截图数据 | spec.md §4.1、prd/appointment-chart.md |

## 4. Verification Gate

各冲突均保留来源、范围和处置；无待定规则。结构校验输出与定向搜索结果保存于本包。

**结论**：verified
**审核人**：Codex（已批准规则的机械收敛）
**审核日期**：2026-09-21

## 5. Change Control

仅对062@1.0.0有效；新发现冲突或规格升版需重新收敛。
