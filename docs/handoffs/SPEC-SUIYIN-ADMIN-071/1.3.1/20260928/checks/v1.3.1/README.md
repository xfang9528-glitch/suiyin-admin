# 首次与最近一次直接选项验收

SPEC-SUIYIN-ADMIN-071@1.3.1，2026-09-28。日常迭代已完成，E029随后明确授权本版完整推送；远端成功由发布回执另记。上一轮产品修改保留，本轮仅增量调整admin-revisit-rules.js：5日期+4等级+6明确事件选项，共15项；移除独立事件取值控件。

`event-option-ui-verification.cjs`实际7/7 PASS，结果见`event-option-ui-results.json`：

- 六个艺星租户下拉均为15项，六事件标签直接可选，无额外事件取值下拉。
- 首次/最近一次到店、购买、划扣逐一保存/刷新后正确回显，仍保留原anchor与anchorOccurrence配对，账号/节点/时间不变。
- 已有六种配对打开、修改后取消不迁写；缺失或非法次数不默改，只有显式选择复合项才能修复。
- 等级人工/AI来源继续有效；切换事件/日期正常清理不适用参数。
- 正常滚动显示全部选项，1120窄窗无横向溢出；无脚本异常，无外部请求。

独立临时Chrome context中只使用合成QA数据。正常滚动下拉截图`event-options-top.png`、`event-options-bottom.png`，窄窗`event-options-narrow.png`；已目视六个明确事件项、取消二级控件及摘要，无遮挡。未注入隐藏DOM或修改弹层高度。

模型及CSS未改变；模型SHA-256仍为`e5f01e95983b3288735eb31e3eed9a908114365e1e946b13e126b084ce24aac7`，与1.3.0模型验收记录一致，因此没有重跑无关模型检查。新UI SHA记录在本轮JSON。JS语法、git diff --check、SPEC与Plan边界校验均通过。

8148多文件服务复用，已用Google Chrome打开`/prototype/_shell.html?tenant=yestar-sz&page=revisitRules&v=1.3.1`。旧1.3.0合同与验证留历史目录；E029完整推送阶段已同步PRD/流程图/设计规范并生成单文件，版本化SDD与远端commit/push/tag、部署和SCRUM通知由实际发布回执确认。

## 完整推送阶段实际检查

- 真正file://离线13/13 PASS，见inline-event-options-results.json；阻断HTTP仍完成六tenant事件与人工/AI等级保存刷新、启停、隔离、旧配对兼容、非法参数修复及非艺星限制，0外部请求/0脚本异常。
- HTTP综合对照155/155 PASS，其中回访50/50；见inline-check-page-results.json，此项不代替真正离线测试。
- model-evidence-binding.json核实1.3.0的36+18+25共79模型检查与当前源码同SHA，不冒称重跑。
- inline-event-options-top/bottom/narrow.png及inline-grade-ai.png为合成数据内容iframe截图，已视检。
- 单文件SHA-256：d61e8c5006c2c238b98868b75966ab13c68c6ceb4de108af195a4eccde402f87。

运行verify-inline-event-options.cjs及verify-inline-check-page.cjs需要已有Google Chrome和Playwright（PLAYWRIGHT_MODULE可指定）；verify-model-evidence-binding.cjs默认读取相邻v1.3.0证据或MODEL_EVIDENCE_ROOT，不更改旧结果。
