---
test_contract_id: TEST-CONTRACT-SUIYIN-ADMIN-076
spec_id: SPEC-SUIYIN-ADMIN-076
spec_version: 1.0.1
status: approved
prepared_by: "Codex"
prepared_at: 2026-09-30
---

# 指定租户时间入口移除与菜单状态胶囊 — Test Contract

## 1. 测试摘要

- 源规格：[SPEC-SUIYIN-ADMIN-076@1.0.1](https://github.com/xfang9528-glitch/suiyin-admin/blob/master/docs/sdd/SPEC-SUIYIN-ADMIN-076/1.0.1/spec.md)。
- 对应：[HANDOFF-SUIYIN-ADMIN-076](https://github.com/xfang9528-glitch/suiyin-admin/blob/master/docs/sdd/SPEC-SUIYIN-ADMIN-076/1.0.1/issue-handoff.md)。
- 8条MUST规则、11条AC、13个Test ID；I001/I002为本次生产建单范围，I003仅记录原型交付覆盖。
- 所有Evidence保持 planned；既有原型测试通过不等于生产验证完成，不因创建Issue而标记verified。

## 2. Strategy

- 租户范围、字段去除、状态值和权限/父子关系使用参数化及自动化测试。
- 保存失败、外部更新、刷新/跨窗口和旧值回填使用可控状态及integration/e2e测试。
- 胶囊的可辨识性、焦点、窄屏列宽、冻结表头与滚动后视觉关系保留人工检查，证据按Test ID落盘。
- Planned Test Path为正式工作区应实现的建议位置；Phase 1可按已有框架调整路径，必须保留Test ID/Oracle并在PR留证。本文不在生产仓写测试。
- SPEC静态本地存储边界适用于原型；生产保存路径以正式服务回执验证，不照搬localStorage。接口缺口单列依赖。

## 3. Coverage Matrix

| Test ID | Slice ID | Rule | Acceptance | Layer | Automation | Target Repo | Planned Test Path | Oracle | CI Evidence | Manual Reason |
|---|---|---|---|---|---|---|---|---|---|---|
| T-R001-01 | I003 | R001 | AC-R001-01 | parameterized | automated | xfang9528-glitch/suiyin-admin | docs/verification/admin-iteration-20260930/verify-account.cjs | 17个原型租户各出现一次；画美/傲丽的tenant与品牌正确；切换无跨租户写入 | planned | — |
| T-R002-01 | I003 | R002 | AC-R002-01 | integration | automated | xfang9528-glitch/suiyin-admin | docs/verification/admin-iteration-20260930/verify-account.cjs | 两新租户未采区域显示待采集且不含其他租户账号/部门行及艺星专属授权 | planned | — |
| T-R003-01 | I003 | R003 | AC-R003-01 | e2e | automated | xfang9528-glitch/suiyin-admin | docs/verification/admin-iteration-20260930/verify-account.cjs | 新旧route均进入同一账号页；默认名称为碎银账号；自定义名称、账号内容与稳定身份不变 | planned | — |
| T-R004-01 | I001 | R004 | AC-R004-01 | parameterized | automated | PetWebOrg/suiyin-admin | tests/e2e/admin-duty-time.spec.ts | 全部正式艺星及huamei-xian/aoli-xian的账号页、设置页和可达表单均无时间配置；旧04:00/旧值不回填、不参与新校验或提交 | planned | — |
| T-R004-02 | I001 | R004 | AC-R004-02 | integration | automated | PetWebOrg/suiyin-admin | tests/e2e/admin-duty-time.spec.ts | 非适用租户保留原时间设置；适用租户上班记录、在线状态及离开状态可转交的行为与基线一致 | planned | — |
| T-R005-01 | I002 | R005 | AC-R005-01 | e2e | automated | PetWebOrg/suiyin-admin | tests/e2e/menu-status-capsule.spec.ts | 普通/平台可编辑行点击不同值及键盘激活均直接提交一次；无弹窗；不触发拖动或树展开；提交中禁重复 | planned | — |
| T-R005-02 | I002 | R005 | AC-R005-02 | integration | automated | PetWebOrg/suiyin-admin | tests/e2e/menu-status-capsule.spec.ts | 重复点击已选值不保存、不加记录；原编辑弹窗读取同一值，取消不改变状态；其他编辑字段仍可用 | planned | — |
| T-R005-03 | I002 | R005 | AC-R005-01 | visual | manual | PetWebOrg/suiyin-admin | docs/qa/SPEC-SUIYIN-ADMIN-076/T-R005-03/ | 普通/平台胶囊始终清楚显示两个文字选项；选中值和键盘焦点可辨，无颜色单独传义，禁用/提交态可区分 | planned | 文字和选中/焦点的视觉辨识需人工判断；在1280×720及1480×900逐态检查，截图/记录存EV003位置 |
| T-R006-01 | I002 | R006 | AC-R006-01 | parameterized | automated | PetWebOrg/suiyin-admin | tests/integration/menu-status-scope.spec.ts | 普通改动只影响当前租户；平台限制沿用既有范围；父级隐藏整支、恢复保留子项独立隐藏；租户不能越过平台禁用，隐藏行仍可恢复 | planned | — |
| T-R006-02 | I002 | R006 | AC-R006-02 | e2e | automated | PetWebOrg/suiyin-admin | tests/e2e/menu-status-sync.spec.ts | 保存后范围内导航同步，隐藏当前页按原路径回退；刷新读回新状态；其他租户、排序、父级和权限未被重置 | planned | — |
| T-R007-01 | I002 | R007 | AC-R007-01 | integration | automated | PetWebOrg/suiyin-admin | tests/integration/menu-status-recovery.spec.ts | 注入保存失败后恢复原值和记录，无成功提示或导航传播且能重试；外部更新后按新状态操作，不以旧整树覆盖其他更改 | planned | — |
| T-R008-01 | I002 | R008 | AC-R008-01 | e2e | automated | PetWebOrg/suiyin-admin | tests/e2e/menu-status-layout.spec.ts | 普通六列与平台九列结构保留；胶囊不破坏树折叠、拖动、操作列及冻结表头；工程测试只访问隔离测试服务，不把原型本地保存当生产完成证据 | planned | — |
| T-R008-02 | I002 | R008 | AC-R008-01 | visual | manual | PetWebOrg/suiyin-admin | docs/qa/SPEC-SUIYIN-ADMIN-076/T-R008-02/ | 1280/1480视口下纵横滚动及折叠后胶囊不遮挡文案，表头和操作列仍可读可用；原型反馈保留本地边界，生产反馈符合实际保存结果 | planned | 列间遮挡、滚动视觉关系和焦点裁切需人工对照完整Shell；各视口和普通/平台截图存EV004位置 |

## 4. Test Data & Profiles

| Data ID | Tenant / Profile | 前置数据 | 隐私处理 | 覆盖 Test IDs |
|---|---|---|---|---|
| D001 | 全部艺星、huamei-xian、aoli-xian | 正式租户归属清单，配置存在/缺省/旧04:00/旧自定义值；原型六艺星为样例 | 专用测试账号与合成配置，不复制客户个人信息 | T-R004-01、T-R004-02 |
| D002 | 非适用租户，对照bzds及其他真实登记 | 原有时间设置、上班记录、在线/离开转交状态 | 合成数据，不更改真实客户设置 | T-R004-02 |
| D003 | 普通menu双租户与平台allMenu | 父子树、独立隐藏子项、平台禁止项、可编辑/只读身份、排序及自定义名 | 隔离测试租户/服务 | T-R005-01、T-R005-02、T-R005-03、T-R006-01、T-R006-02 |
| D004 | 同源多窗口、失败及外部更新 | 可控制保存失败与外部更新时序；当前页被隐藏；重复点击及重试 | 故障注入限测试环境 | T-R007-01、T-R008-01、T-R008-02 |
| D005 | 原型17租户和旧默认命名 | 独立本地样本，新租户not-captured，自定义名与sales旧链接 | 不补造真实人员、数据或权限 | T-R001-01、T-R002-01、T-R003-01 |

## 5. CI Gates

- I001必须运行T-R004-01/02；I002必须运行其8个Test ID并补齐2项人工视觉证据。
- PR和报告保留Test ID/AC-ID，生产框架与路径在正式Phase 1核实；不得只提交截图而跳过可自动判定规则。
- planned代表约定测什么，不是成功；正式CI、接口保存及实际范围证据未完成前不能宣告生产验收通过。
- I003不触发第三张Issue。完整静态原型证明与生产证明分别保留。
- released需真实Issue链接、actual_issue_creation:true及verified合同；本轮不得设置released。

## 6. Evidence

| Evidence ID | Test IDs | 类型 | 位置 | 保留时机 |
|---|---|---|---|---|
| EV001 | T-R004-01、T-R004-02 | 生产CI报告与租户参数列表 | PetWebOrg/suiyin-admin正式PR的admin-duty-time CI artifact，按Test ID命名 | 实现PR时生成，当前planned |
| EV002 | T-R005-01、T-R005-02、T-R006-01、T-R006-02、T-R007-01、T-R008-01 | 生产CI报告及失败/同步轨迹 | PetWebOrg/suiyin-admin正式PR的menu-status CI artifact，按Test ID命名 | 实现PR时生成，当前planned |
| EV003 | T-R005-03 | 人工逐态截图与检查结论 | PetWebOrg/suiyin-admin/docs/qa/SPEC-SUIYIN-ADMIN-076/T-R005-03/，PR附可访问artifact | 视觉验收时生成，当前planned |
| EV004 | T-R008-02 | 完整Shell截图或录屏及检查结论 | PetWebOrg/suiyin-admin/docs/qa/SPEC-SUIYIN-ADMIN-076/T-R008-02/，PR附可访问artifact | 视觉验收时生成，当前planned |
| EV005 | T-R001-01、T-R002-01、T-R003-01 | 原型回归记录 | xfang9528-glitch/suiyin-admin/docs/verification/admin-iteration-20260930/ | 原型交付独立记录；本合同覆盖矩阵保持planned，不替代生产证据 |

## 7. Change Control

- SPEC版本变化后本合同stale，更新版本与受影响Oracle后重跑traceability。
- API、权限或并发规则如与规格冲突先回源，不因框架实现改变业务预期。
- 本文件是交付合同；生产实现和测试只在正式工作区进行。
