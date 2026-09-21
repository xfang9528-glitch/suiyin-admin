---
test_contract_id: TEST-CONTRACT-SUIYIN-ADMIN-060
spec_id: SPEC-SUIYIN-ADMIN-060
spec_version: 1.1.0
status: approved
prepared_by: Codex
prepared_at: 2026-09-21
---

# 平台菜单拖动与全租户联动 — Test Contract

## 1. 测试摘要

源规格 [060@1.1.0](https://github.com/xfang9528-glitch/suiyin-admin/blob/v2026092103-admin-menu-drag-global/docs/sdd/SPEC-SUIYIN-ADMIN-060/1.1.0/spec.md)，对应 I001。原型33项Chrome和2项容器检查只证明静态行为；以下生产测试证据均为 planned。

## 2. Strategy

树重排用稳定ID集合与父子关系判定，持久化/回滚/并发用接口集成测试，导航传播按实际生产租户参数化；输入与滚动用浏览器E2E，视觉可读性由人工附截图确认。测试路径为建议，由正式工程流程按仓内框架落地。

## 3. Coverage Matrix

| Test ID | Slice ID | Rule | Acceptance | Layer | Automation | Target Repo | Planned Test Path | Oracle | CI Evidence | Manual Reason |
|---|---|---|---|---|---|---|---|---|---|---|
| T-R001-01 | I001 | R001 | AC-R001-01 | e2e | automated | PetWebOrg/suiyin-admin | src/views/platform/menu.drag.test.ts 或 tests/e2e/platform-menu.spec.ts | 默认九列与独立手柄；同层自动编号，编辑无手填排序号，新增追加末尾 | planned | — |
| T-R002-01 | I001 | R002 | AC-R002-01 | integration | automated | PetWebOrg/suiyin-admin | src/views/platform/menu.drag.test.ts 或 tests/e2e/platform-menu.spec.ts | 展开及收起一级均携带所有二级；ID集合、子项顺序和字段不变，落点不拆分目标分支 | planned | — |
| T-R003-01 | I001 | R003 | AC-R003-01 | integration | automated | PetWebOrg/suiyin-admin | src/views/platform/menu.drag.test.ts 或 tests/e2e/platform-menu.spec.ts | 二级组内前后重排、跨组指定位置/末尾、空一级接收，原一级移空保留且无丢失重复 | planned | — |
| T-R004-01 | I001 | R004 | AC-R004-01 | integration | automated | PetWebOrg/suiyin-admin | src/views/platform/menu.drag.test.ts 或 tests/e2e/platform-menu.spec.ts | 原位/表外/Escape/失焦/pointercancel无写入；禁止一级嵌套和二级升降；旧三级保留并禁用相关拖动 | planned | — |
| T-R005-01 | I001 | R005 | AC-R005-01 | e2e | automated | PetWebOrg/suiyin-admin | src/views/platform/menu.drag.test.ts 或 tests/e2e/platform-menu.spec.ts | 长表边缘自动滚动，约600ms悬停展开，横向仍可拖；冻结表头与落点同步 | planned | — |
| T-R006-01 | I001 | R006 | AC-R006-01 | integration | automated | PetWebOrg/suiyin-admin | src/views/platform/menu.drag.test.ts 或 tests/e2e/platform-menu.spec.ts | 正式接口成功保存一次父级/顺序/记录；撤销、刷新、重新登录和保留已有字段均正确，后续编辑使撤销失效 | planned | — |
| T-R006-02 | I001 | R006 | AC-R006-02 | integration | automated | PetWebOrg/suiyin-admin | src/views/platform/menu.drag.test.ts 或 tests/e2e/platform-menu.spec.ts | 拒绝/超时/部分失败/版本冲突均不显示成功或发布半棵树；保持最近已保存结果，失败撤销可重试 | planned | — |
| T-R007-01 | I001 | R007 | AC-R007-01 | security | automated | PetWebOrg/suiyin-admin | src/views/platform/menu.drag.test.ts 或 tests/e2e/platform-menu.spec.ts | 同名不同ID/路由各自匹配；跨租户只共享导航规则，不复制业务数据，不增加未授权入口，服务端校验操作权限 | planned | — |
| T-R008-01 | I001 | R008 | AC-R008-01 | e2e | automated | PetWebOrg/suiyin-admin | src/views/platform/menu.drag.test.ts 或 tests/e2e/platform-menu.spec.ts | 键盘Space/方向键/Enter/Escape及触控等价；空、错误、未加载和不可编辑状态禁止拖动 | planned | — |
| T-R009-01 | I001 | R009 | AC-R009-01 | parameterized | automated | PetWebOrg/suiyin-admin | src/views/platform/menu.drag.test.ts 或 tests/e2e/platform-menu.spec.ts | 覆盖生产登记全部适用租户：当前/已开窗口即时更新根排序、子项顺序/归属、隐藏恢复及撤销；平台显示不解除本租户独立隐藏 | planned | — |
| T-R009-02 | I001 | R009 | AC-R009-02 | integration | automated | PetWebOrg/suiyin-admin | src/views/platform/menu.drag.test.ts 或 tests/e2e/platform-menu.spec.ts | 已有设置接续，刷新/新开/重新登录读回；失败不传播；有效当前页面不因导航变化而整页重置 | planned | — |
| T-R005-02 | I001 | R005 | AC-R005-01 | visual | manual | PetWebOrg/suiyin-admin | PR 附件/platform-menu-drag | 桌面宽窄视口核对手柄热区、拖影数量、插入线、目标提示、冻结表头与水平滚动不遮挡 | planned | 可读性和操作手感需人工；保留对比截图、操作录像和判定。 |

## 4. Test Data & Profiles

脱敏/合成菜单：两组多子项、同名异ID、空组、长表、旧三级、只读项、有页面的一级接收二级、目标容器在某租户不存在；两账号与多个权限/独立隐藏组合，测试正式持久化而非浏览器模拟。所有适用生产租户从注册表枚举，不能只写15个原型租户。

## 5. CI Gates

全部自动化Test IDs进入PR CI；人工可读性附截图和Oracle。保存原子性、重试与权限不得只通过UI隐藏验证。接口改动关联正式后端测试；所有MUST通过才能交付生产验收，当前不能标released。

## 6. Evidence

原型证据见 verification.md 和 evidence/；生产证据须由实际PR/CI填入，保留ID、用例、结果和时间。

## 7. Change Control

SPEC版本变化使本合同stale；不能修改测试Oracle来默改业务规则。本原型工作区不写生产测试。
