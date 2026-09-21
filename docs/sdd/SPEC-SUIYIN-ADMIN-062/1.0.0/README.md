# SPEC-SUIYIN-ADMIN-062@1.0.0 — 预约记录组合图

已批准并实现的静态原型；2026-09-21房总要求完整推送并安排陈宣宇实现。提出环境深圳艺星，提出人李愉，平台PC管理页。

- [SPEC](spec.md) · [Plan](plan.md) · [Tasks](tasks.md)
- [来源收敛](source-convergence.md) · [工程交接](issue-handoff.md) · [测试合同](test-contract.md)
- [本次验证](verification.md) · [图表](evidence/appointment-chart.png) · [离线验证](evidence/inline-checks.json)
- [实际工程Issue #404](https://github.com/PetWebOrg/suiyin-admin/issues/404)，负责人陈宣宇（cxy-chenxuanyu），待开发。
- [深圳完整合成演示](https://suiyin-admin.pages.dev/prototype/_shell.html?tenant=yestar-sz&page=appointmentRecords&appointmentDemo=1&appointmentView=chart)；[单文件](../../../../prototype/_shell_inline.html)。

精确依赖：[051@1.1.0](../../SPEC-SUIYIN-ADMIN-051/1.1.0/spec.md)、[055@1.1.0](../../SPEC-SUIYIN-ADMIN-055/1.1.0/spec.md)。062只替代预约页不得添加汇总的默认限制，不修改其他统计页。原型318条为明确合成演示，深圳原样本20条不能代表真实全量；工程必须取得权限范围内的全量统计。

版本化远端入口：[v2026092101-admin-appointment-chart](https://github.com/xfang9528-glitch/suiyin-admin/tree/v2026092101-admin-appointment-chart/docs/sdd/SPEC-SUIYIN-ADMIN-062/1.0.0)。发布结果以提交/tag/部署回执为准；本包的原型验证不证明生产接口、真实权限或生产上线。
