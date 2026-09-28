# Tasks — 原位补齐回访基准

> Spec: SPEC-SUIYIN-ADMIN-071@1.3.0
> Plan: plan.md
> Status: implemented; 79 model + 9 browser checks PASS; Chrome preview opened; static-html; not published

> E023–E027批准在原下拉补事件与等级，并明确预约日期显示；E022只属于已完成1.2.0交付。本轮不重做布局、不扩展租户、不发布。

- [x] T001 升级前逐字保存1.2.0 spec.snapshot.md/plan.md/tasks.md到history/1.2.0，保留原source-convergence、verification及published包。
- [x] T002 更新1.3.0合同与R016–R019、5条新增AC，SPEC与Plan边界校验PASS（19规则/24 AC/0未决）；确认旧5日期ID、12基准与21/26条件独立。
- [x] T003 模型增加独立anchors、等级/业务事件解析及合成历史，明确首次/最近一次、人工/AI、未来截断、未知/空历史与旧日期兼容（R016–R019）；36项新增+18项租户+25项深圳模型检查PASS。
- [x] T004 原基准下拉补选项与最小附属控件，appointment显示预约日期，摘要/校验/保存恢复一致；不重排布局或改菜单（R007、R011、R016、R019）；产品JS语法检查通过，页面验收见T006。
- [x] T005 执行新增事件与等级模型、旧规则兼容、取消/失败、节点复制及六tenant隔离检查，79模型+9浏览器检查PASS；证据见checks/v1.3.0/README.md（AC-R016-01、AC-R017-01/02、AC-R018-01、AC-R019-01）。
- [x] T006 Google Chrome核对原下拉、附属选择、摘要与结果、刷新及1120窄窗，无溢出；4张截图已视检。8148服务HTTP 200，Chrome已启动打开深圳revisitRules本地预览（v=1.3.0）；干净补图单独记录。

1.2.0历史18+25+66+15结果不能证明1.3.0新增基准已完成。只改现有静态规则页及本地合成事件；不改PRD/流程图/设计规范、inline、远端SDD，不commit/push/tag，不创建Issue/Handoff/Test Contract，不更新进度表，不接真实CRM/等级服务或PC每日名单。
