# Tasks — 2026-09-29话术管理交付补充

- Source：SPEC-SUIYIN-ADMIN-051@1.1.0；[原字节规格](spec.md)、[本轮Plan](plan.md)。
- 状态：本地实施及验证完成；发布前冻结记录，远端结果由发布回执证明。
- 授权：房总本轮“执行”授权既有页纠偏，“完整推送”授权文档与静态发布。不扩写原R/AC，不新建工程Issue。

| Task | 状态 | 对应规则 / 验收 | 实际产物或证据 |
|---|---|---|---|
| T001 按当前租户采集树、末级样本及表单 | completed | R003 R005 R006 | 独立JSON：15租户1246节点、42分类155列表、48详情；原capture私有 |
| T002 公开内容过滤和媒体占位 | completed | R003 R006 R010 | 16媒体占位；97段文本；独立审计0失败，隔离副本重复清洗后话术JSON字节不变 |
| T003 专用树、默认空态、列表及弹窗 | completed | AC-R005-01 | admin-language-manage模块；本轮15租户几何检查≤1px |
| T004 本地交互、未知状态、隔离与源版本合并 | completed | AC-R002-01 AC-R003-01 AC-R004-01 AC-R006-01 | 26项本地行为通过；取消、保存刷新、失败回滚和更新合并 |
| T005 单文件与浮层协议回归 | completed | AC-R009-01 | 独立运行9项通过；常规单文件225项通过；报告绑定源数据及单文件SHA |
| T006 替换旧话术说明并补版本包 | completed | R005 R009 | PRD、流程、设计、README、CLAUDE、根索引和source-convergence |
| T007 发布与远端复核 | release-process | R009 | 计划tag：v2026092901-admin-language-parity；是否完成以分支/tag回读和部署回执为准 |

验证记录：[公开验收](../../../../../../docs/verification/language-parity-20260929/README.md)、[本地行为/几何摘要](../../../../../../docs/verification/language-parity-20260929/local-verification-summary.json)、[独立运行](../../../../../../docs/verification/language-parity-20260929/independent-runtime-report.json)、[单文件检查](../../../../../../docs/verification/language-parity-20260929/inline-check-page-report.json)、[公开数据审计](../../../../../../docs/verification/language-parity-20260929/public-data-audit.json)。原始DOM、截图和采集原料未发布。

当前样本与已测状态通过不代表全部分类内容已采，也不代表生产实现、部署或上线。没有更新APP/PC开发进度表；没有创建新Issue或工程交付合同。旧051原Tasks和其他合同继续作为当时版本历史，不修改其状态。
