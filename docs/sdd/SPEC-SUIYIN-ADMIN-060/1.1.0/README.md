# SPEC-SUIYIN-ADMIN-060@1.1.0

平台菜单拖动、二级跨组、全租户侧栏联动与刷新记忆。版本：v2026092103-admin-menu-drag-global。

- [SPEC](spec.md) · [Plan](plan.md) · [Tasks](tasks.md)
- [来源收敛](source-convergence.md) · [工程交接](issue-handoff.md) · [测试合同](test-contract.md)
- [验证记录](verification.md) · [离线检查](evidence/inline-results.json) · [全租户检查](evidence/platform-navigation-results.json)
- [工程Issue #408](https://github.com/PetWebOrg/suiyin-admin/issues/408)：梁晨（vvphp），PC，提出环境佰智德三，提出人房昕。
- [在线原型](https://suiyin-admin.pages.dev/prototype/_shell.html?tenant=bzds&page=allMenu)；[离线单文件](../../../../prototype/_shell_inline.html)。在线入口沿用Access登录。

本包是批准并实现的静态原型交付快照。39项Chrome检查（33项交互/记忆/15租户联动+6项离线）与2项模型边界检查通过；生产实现尚未开始，生产测试保持planned。

平台规则取代旧051/052以及060@1.0.0在平台手工排序和不联动侧栏上的语义，普通menu与历史来源其他规则保留。15个原型租户仅为测试清单，生产应覆盖全部适用租户并使用服务端持久化、稳定ID与权限校验。

本地verification历史引用checks/的证据在本包对应evidence/；本机脚本路径仅记录测试环境，不是工程依赖。工程以本包SPEC/Handoff/Test Contract为唯一版本合同。
