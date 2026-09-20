# Tasks — 销售变声统计筛选完整对齐

> Spec: SPEC-SUIYIN-ADMIN-052@1.2.0 · Plan: plan.md · Status: implemented; current local Chrome evidence recorded

当前直接 USER 来源为 E012。旧 1.1.0–1.1.2 的“移除单日/范围”实现及检查仅是历史，不构成本轮完成证据；旧版本 verification/source-convergence/source-search 也仅证明对应已发布版本。

- [x] T012 记录 E012 与旧日期模式冲突；052 升为 1.2.0，保留 R003/R004/R005，依赖 051@1.1.0 不变（R002/R007）。
- [x] T013 逐项复用使用统计筛选结构与样式：统计时间、单日/范围、日期、快捷、部门和三项动作（R002/R007；AC-R002-03）。
- [x] T014 对齐模式草稿、快捷即时查询、重置、日期取消/校验、焦点及禁用；保留变声运行日来源（R002/R006；AC-R002-01/02/03）。
- [x] T015 固定事实复算次数、全筛选导出，抽查全部登记租户与权限；记录变声和使用统计数据边界不变（R003/R005/R006；AC-R003-01/02、AC-R005-01、AC-R006-01）。
- [x] T016 Chrome 同视口双页筛选截图和关键状态实操；本次证据路径已记录于 verification.md（R007；AC-R002-03、AC-R007-01）。

本轮完整推送与销售变声统计工程建单已经明确授权。当前文档、inline、新版本包与 Source Convergence 一起交付；工程追踪见 issue-handoff.md / test-contract.md，旧版本包不变。

## 本轮完成证据

- [变声筛选 8/8 检查](evidence/voice-verification.json)、[1528/1080 两宽与单日/范围几何](evidence/voice-geometry.json)、[15 租户独立状态](evidence/voice-tenant-checks.json)。筛选截图在统一草稿日期下与本地使用统计 PNG 字节一致；未更改冻结样本或执行使用统计新查询。
- [安装后 Shell 预览与滚动](evidence/preview-check.json)、[独立边界复核 9/9](evidence/sticky-independent-review.json)。原计数与租户数据保持，不将此结果泛化为生产实时数据或全部实站像素验收。
