# SPEC-SUIYIN-ADMIN-068@1.0.0 交付包

各租户菜单拖动排序与本租户导航联动。源规则已由房总于2026-09-26批准，原型 implemented；生产待开发。

- [行为合同](spec.md) → [I001 工程交接](issue-handoff.md) → [Test Contract](test-contract.md)。追踪：SPEC-ID@version → R/AC → Issue Slice → Test ID → 实际证据。
- [Plan](plan.md)、[Tasks](tasks.md)、[来源收敛](source-convergence.md)、[原型验收](verification.md)。
- [真实工程 Issue #432](https://github.com/PetWebOrg/suiyin-admin/issues/432)：负责人房昕（xfang9528-glitch），提出人房昕，环境佰智德三，PC网页管理端。覆盖所有系统租户，15个原型样本不是生产白名单。
- [版本固定入口](https://github.com/xfang9528-glitch/suiyin-admin/tree/v2026092601-admin-tenant-menu-drag/docs/sdd/SPEC-SUIYIN-ADMIN-068/1.0.0)；发布标签 v2026092601-admin-tenant-menu-drag。
- [在线佰智德三菜单](https://suiyin-admin.pages.dev/prototype/_shell.html?tenant=bzds&page=menu)，沿用既有访问登录。离线文件位于仓库 prototype/_shell_inline.html。

本包冻结在远端推送前，发布/部署/通知的完成状态由交付回执单独记录。原型测试不代表生产验证；生产合同仍为 preparation，正式实现须独立worktree、Phase、PR与房总review。

精确依赖：

- [060@1.1.0](../../SPEC-SUIYIN-ADMIN-060/1.1.0/spec.md)：平台拖动交互；普通租户局部优先以068 R006为准。
- [051@1.1.0](../../SPEC-SUIYIN-ADMIN-051/1.1.0/spec.md)：静态管理端基线。
- [055@1.1.0](../../SPEC-SUIYIN-ADMIN-055/1.1.0/spec.md)：冻结表头与浮层。
