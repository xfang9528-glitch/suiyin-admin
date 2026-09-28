# 回访规则工程交付补充包

源规格为 SPEC-SUIYIN-ADMIN-071@1.3.1，业务规则不变。本补充包承接房总2026-09-28明确的“给张拓生成一个Issue实现”指令。

- **真实任务**：[管理页实现 Issue #438](https://github.com/PetWebOrg/suiyin-admin/issues/438)，负责人 @chinaszzt（张拓），状态以Issue为准。
- **本期范围**：[Handoff I001](issue-handoff.md)承接18条规则、23项验收，管理页规则配置、真实保存/读取、启停状态和摘要；[Test Contract](test-contract.md)列出可检索的测试ID。
- **后续计划**：I002只保留 R014 / AC-R014-01 的PC当前接待权限合同，未创建第二个真实Issue。真实调度、PC名单、发送、去重及执行闭环另期，不能把本单配置完成当成这些能力已上线。
- **提出环境**：成都、深圳、杭州、广州、嘉兴；完整昵称与逐项对应见正式Issue。规格中的北京艺星仍在既有六租户实现范围内。
- **不可变行为真源**：[原发布SPEC](https://github.com/xfang9528-glitch/suiyin-admin/blob/v2026092803-admin-revisit-anchors/docs/sdd/SPEC-SUIYIN-ADMIN-071/1.3.1/spec.md)；本包的[spec.md](spec.md)、[plan.md](plan.md)、[tasks.md](tasks.md)、[source-convergence.md](source-convergence.md)及旧验收均按原1.3.1包逐字复制，保持发布当时状态，不将旧“未请求工程交付”描述当成本次用户授权。
- **本次合同**：[issue-handoff.md](issue-handoff.md)、[test-contract.md](test-contract.md)、[追踪校验](traceability.json)。生产Evidence为planned，本地原型结果不等于生产通过。
- **页面参考**：[在线原型](https://suiyin-admin.pages.dev/prototype/_shell.html?tenant=yestar-sz&page=revisitRules&v=97e9205)，沿用Access登录；[固定版本单文件](https://github.com/xfang9528-glitch/suiyin-admin/blob/v2026092803-admin-revisit-anchors/prototype/_shell_inline.html)。页面与前一版相同，本次只补交付合同。

Q002、Q003、Q004、Q008仍需生产核实。真实接口、历史完整性、时间语义及权限的证据未闭合前，不将原型默认或合成样本当成生产事实；行为变化须回源规格审核。实施只在正式目标仓依Issue、独立worktree、Phase、PR和review流程执行。

原docs/sdd/SPEC-SUIYIN-ADMIN-071/1.3.1包及v2026092803标签不回写。本补充包锁定新标签v2026092804-admin-revisit-handoff，机器清单回链原始包与真实Issue。通知收件标识、凭据、私聊和私有发布辅助脚本不在本包。
