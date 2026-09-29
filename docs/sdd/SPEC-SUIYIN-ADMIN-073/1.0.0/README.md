# SPEC-SUIYIN-ADMIN-073@1.0.0

工具管理与艺星辅助线自助维护。固定源码和合同版本：`v2026092902-admin-tools-guide-lines`。

所有租户在原话术位置进入工具管理，下含原话术；所有艺星增加辅助线管理，每租户独立维护。当前原型登记15租户、808页面入口、90路由；6艺星只是现有样例，不是生产白名单。

- [SPEC](spec.md) · [Plan](plan.md) · [Tasks](tasks.md) · [来源收敛](source-convergence.md)
- [工程交接](issue-handoff.md) · [测试合同](test-contract.md) · [验证与截图](verification.md)
- [Admin #442](https://github.com/PetWebOrg/suiyin-admin/issues/442)，负责人王梓先（build996），提出环境佰智德三、提出人房昕，状态以远端Issue为准。

按 SPEC-ID@version → R-ID → AC-ID → I001 → Test ID → 生产CI/人工证据追踪。11条MUST/11项AC/17项生产测试；生产证据仍为planned，不能以原型通过宣称真实上传、迁移或PC同步完成。

## 打开原型

[当前在线深圳辅助线页](https://suiyin-admin.pages.dev/prototype/_shell.html?tenant=yestar-sz&page=guideLineManage&v=v2026092902-admin-tools-guide-lines) · [当前在线佰智德三工具/话术](https://suiyin-admin.pages.dev/prototype/_shell.html?tenant=bzds&page=languageManage&v=v2026092902-admin-tools-guide-lines)。Pages链接沿用Access登录，查询参数不是部署固定版本；固定内容以本tag为准。

仓内`prototype/_shell_inline.html`可单文件离线打开。默认素材集中内嵌，按租户独立保存到浏览器，未连接真实服务。客户上传的浏览器演示图也是预览副本，生产需要保留原始透明PNG。

## 工程边界

本交付只在HTML原型仓发布；生产Admin在正式Issue/worktree/Phase/PR/review流程实现。后端配置、真实存量初始化和PC消费生效要分别核实、联调留证。提出环境佰智德三不因此获得辅助线业务权限。
