---
ledger_id: CONVERGENCE-SUIYIN-ADMIN-051-LANGUAGE-20260929
spec_id: SPEC-SUIYIN-ADMIN-051
spec_version: 1.1.0
status: verified
prepared_by: "Codex"
prepared_at: 2026-09-29
---

# 话术管理 — Source Convergence Ledger

## 1. 收敛摘要

- **源规格**：SPEC-SUIYIN-ADMIN-051@1.1.0，原字节副本，无版本或R/AC变更。
- **触发**：房总明确要求本轮既有话术页对齐并授权“完整推送”。
- **目标**：替换当前入口中的旧通用话术、层级未知和过时发布口径；不增加业务规则。
- **既有§4.1**：[051原收敛账本](../../source-convergence.md)保留其6项旧来源处理；本补充承接话术再次发现的有效入口偏差，其他领域范围不重开。
- **范围**：本仓当前PRD/流程/设计/维护入口/根索引，以及话术路由和独立数据绑定。历史发布包保持不可变。

## 2. Source Ledger

| Source ID | Old Source | Conflict / Superseded Rule | Resolution | Evidence | Remaining |
|---|---|---|---|---|---|
| S001 | prd/admin-live-reference.md 页面与交互 | 话术与其他内容合并，仍称树父子关系未采集 | updated | 话术独立行及prd/language-manage.md，本轮1246节点/采样边界 | none |
| S002 | flowcharts/admin-live-reference.md 话术分支 | TreeGap把全部树当作层级不明 | updated | TenantTree与末级分类采集状态分支；flowcharts/language-manage.md | none |
| S003 | docs/design-spec.md 领域结构 | 旧“树父子关系未采集”说明未反映当前来源 | updated | 话术管理几何表、默认空态和本租户数据条款 | none |
| S004 | README.md、CLAUDE.md | 维护入口未列话术专用模块，容易回到通用模板 | updated | 主线新增模块/数据、样本边界及本轮SDD/验收链接 | none |
| S005 | index.html | 主卡与当前版本仍指2026-09-20、752入口/84类 | updated | 2026-09-29话术首卡，15/802/89及固定新tag；旧功能改为保留/历史 | none |
| S006 | prototype/admin-domain-views.js scriptWorkspace | 通用扁平去重和自动首条编辑与真实树不符 | superseded | render的languageManage分支直接调用AdminLanguageManage；旧函数不在此路由执行；CLAUDE明确标注兼容边界 | none |
| S007 | prototype/sanitize-public-data.mjs legacy page.text | 八个通用分类可能被误认为当前话术来源 | superseded | 独立language-manage.json受专门审计，重复清洗字节不变；旧page.text只作兼容并在CLAUDE注明 | none |
| S008 | docs/sdd既有051/054/056版本包及docs/history | 旧采集不足和旧时间数量可能被当作现在状态 | intentional-history | 包路径保持原日期/版本，当前入口改链本补充及9月29日验收；原规格副本SHA保持一致 | none |

## 3. Search Proof

2026-09-29在仓根执行下列只读搜索；命中说明与判定限于当前话术有效入口，不批量清理历史合同。当前文档本账本会引用旧词用于证明，属于审核记录。

| Search ID | Pattern / Old Term | Scope | Command / Method | Result | Evidence |
|---|---|---|---|---|---|
| Q001 | 话术树父子关系未完整采集、树父子关系未采集、TreeGap | prd/admin-live-reference.md、docs/design-spec.md、flowcharts/admin-live-reference.md | rg -n逐个固定词搜索 | 0 active conflicts | 旧正文已被本租户树及字段级未采边界替换 |
| Q002 | scriptWorkspace、AdminLanguageManage.render | prototype/admin-domain-views.js及CLAUDE.md | rg -n核对定义与实际分支 | superseded legacy only | 旧函数仍定义，实际languageManage调用专用模块；CLAUDE明确不作为有效入口 |
| Q003 | 演示话术分类、language-manage.json | sanitizer、CLAUDE.md及公开数据审计 | rg -n与隔离副本重复清洗结果 | superseded legacy only | 旧模板仅page.text；独立JSON两次清洗SHA不变，审计0失败 |
| Q004 | 752、84 类页面、2026.09.20、v2026092003 | index.html | rg -n逐个固定词搜索 | 0 active conflicts | 当前15/802/89、新话术首卡与2026-09-29tag；保留功能仅有明确历史日期 |
| Q005 | spec.md原字节一致 | 新包spec.md与已发布051/1.1.0/spec.md | SHA-256及字节比较 | equal | fdea0faf0173367f3fe8f5dbbd5dcf1843f0059c94ae3f8ae189f6ad478a4517 |

## 4. Verification Gate

- [x] 源SPEC状态和版本仍有效，原字节一致；不修改051依赖。
- [x] §4.1已有冲突仍由原账本承接，本轮直接旧来源逐项列于上表。
- [x] 每行Resolution合法且Evidence非空。
- [x] Remaining全部为none。
- [x] Search Proof覆盖本轮旧说明、模板和入口。
- [x] 已运行validate-source-convergence.mjs且无error。

**结论**：verified
**审核人**：Codex（文档一致性与本地校验；不代替用户新增业务批准）
**审核日期**：2026-09-29

## 5. Change Control

源SPEC未来升版则本账本stale；新增冲突需补证据并重新验证。本包作为日期固定交付补充冻结，不改已发布父目录快照。原始capture与DOM仅本地私有，不复制公开。远端发布另取回执，结构校验通过不代表已经push或上线。
