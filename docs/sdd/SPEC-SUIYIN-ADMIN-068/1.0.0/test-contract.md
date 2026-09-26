---
test_contract_id: TEST-CONTRACT-SUIYIN-ADMIN-068
spec_id: SPEC-SUIYIN-ADMIN-068
spec_version: 1.0.0
status: approved
prepared_by: "Codex"
prepared_at: 2026-09-26
---

# 各租户菜单拖动排序与导航联动 — Test Contract

## 1. 测试摘要

- **源规格**：[SPEC-SUIYIN-ADMIN-068@1.0.0](./spec.md)，静态原型源状态为 `implemented`。
- **对应 Handoff**：[HANDOFF-SUIYIN-ADMIN-068](https://github.com/xfang9528-glitch/suiyin-admin/blob/v2026092601-admin-tenant-menu-drag/docs/sdd/SPEC-SUIYIN-ADMIN-068/1.0.0/issue-handoff.md)，单一 Slice `I001`，目标仓 `PetWebOrg/suiyin-admin`。
- **真实 Issue**：[PetWebOrg/suiyin-admin#432](https://github.com/PetWebOrg/suiyin-admin/issues/432)，负责人房昕 `xfang9528-glitch`，2026-09-26 GH CLI 复读确认 `OPEN` 及真实分配。
- **Issue 标题**：feat(menu): 为各租户菜单管理增加拖动排序与导航联动（管理者可以拖动整理本租户菜单，左侧导航同步更新并保留）。
- **覆盖**：9 条 MUST、12 个验收场景，映射 14 个 Test IDs；12 项自动化判定和 2 项人工体验检查。
- **边界**：本合同定义正式网页管理端“测什么”和通过条件。测试框架、实际代码路径与存储适配由生产仓在正式流程中决定；本工作区不写生产测试。
- **状态**：测试合同已随真实 Issue 下发，按校验器合法准备状态记为 `approved`，对应 Handoff 为 `issued`、I001 为 `created`。以下全部生产 Evidence 仍为 `planned`；当前原型结果不等于本合同已 `implemented` 或 `verified`。
- **原型版本**：tag `v2026092601-admin-tenant-menu-drag`，远端包路径 `docs/sdd/SPEC-SUIYIN-ADMIN-068/1.0.0/`，完整推送后的可访问性由交付主流程复核。

## 2. Strategy

| 范围 | 验证方式 | 判定要求 |
|---|---|---|
| 所有系统租户入口及旧字段接续 | parameterized / integration | 从正式系统实际租户/Profile 来源参数化；15 个原型租户仅作参考样本，不写死租户名单 |
| 结构、局部覆盖与平台优先级 | domain / integration | 比较稳定身份集合、父级、同级相对顺序及平台独立可见性条件 |
| 用户移动、保存、撤销及多窗口 | e2e / integration | 表格与导航使用同一成功状态；事务失败不得传播半成品 |
| 权限与租户隔离 | security | 操作范围限定当前租户；隐藏、删除和既有权限不可被拖动绕过 |
| 键盘、触控、取消与页面状态 | e2e | 判定可操作状态、事件取消、页签/输入保留与只读禁用 |
| 拖影、落点可读性与视觉布局 | visual，人工 | 记录实际桌面与窄窗操作视频/截图，并按明确 Oracle 判定 |

表内 `Planned Test Path` 为生产仓内的建议相对路径，尚未创建，需由正式仓 Phase 1 确认；允许适配现有目录和框架，不允许省略 ID、降低 Oracle 或复用原型结果冒充正式结果。R005 的实际持久化和失败注入点应适配正式系统当前机制，本合同不替生产决定接口或数据库设计。

既有 [管理端 #408](https://github.com/PetWebOrg/suiyin-admin/issues/408) 已关闭，其最终范围只覆盖旧 `sort` / `pid` 接口的前端拖动，保留数字/父级输入，失败依顺序写入与回读处理，无原子回滚、撤销或全租户实时联动承诺。该任务仅作技术参考，不能作为 068 的 T-R001、T-R003、T-R005、T-R007 已通过证据。正式 Phase 1 应先论证 068 的保存一致性、并发和撤销能力；旧接口不支持时提交可审核方案/阻塞，不能降低本合同 Oracle，也不能自动重建已删除的 #4072 后端任务。

## 3. Coverage Matrix

| Test ID | Slice ID | Rule | Acceptance | Layer | Automation | Target Repo | Planned Test Path | Oracle | CI Evidence | Manual Reason |
|---|---|---|---|---|---|---|---|---|---|---|
| T-R001-01 | I001 | R001 | AC-R001-01 | parameterized | automated | PetWebOrg/suiyin-admin | tests/menu-sort/tenant-entry.spec.ts | 遍历实际系统租户/Profile，普通 menu 可编辑行有独立手柄、保留六列；顺序为同层只读 1…N，编辑不再提供数字排序输入；名称/显示/权限及原操作边界保持；bzds/menu 与 allMenu 不混用 | planned | — |
| T-R002-01 | I001 | R002 | AC-R002-01 | integration | automated | PetWebOrg/suiyin-admin | tests/menu-sort/tree-moves.spec.ts | 一级整组移动保持子项相对顺序与业务字段；二级组内及跨组移动仅改变归属/顺序；直落一级追加，空一级接收首项、移空后库存保留；携页一级接收子项后自身入口仍唯一且可打开；移动前后身份集合相同 | planned | — |
| T-R002-02 | I001 | R002 | AC-R002-01 | visual | manual | PetWebOrg/suiyin-admin | docs/qa/menu-sort/T-R002-02.md | 人工依次完成展开/收起整组、二级跨组、空一级及携页一级的拖放；拖影说明携带项，目标归属和插入位置可辨认，落下结果符合当时反馈；保存操作视频与判定记录 | planned | 拖影与落点是否清楚、用户是否能分辨整组和单项不能仅由 DOM 断言判断；正式环境录屏包含起点、目标反馈和落下结果，按本列逐项判定 |
| T-R003-01 | I001 | R003 | AC-R003-01 | e2e | automated | PetWebOrg/suiyin-admin | tests/menu-sort/navigation-sync.spec.ts | 同租户两个已开窗口移动/撤销后，所有导航的可见身份、父级和同级顺序与表格受限投影一致；仍可见业务页实例、页签及未提交输入保留；隐藏项仍在完整库存 | planned | — |
| T-R004-01 | I001 | R004 | AC-R004-01 | security | automated | PetWebOrg/suiyin-admin | tests/menu-sort/isolation-identity.spec.ts | A/menu 移动前后，B 与平台定义/配置及原有权限不变；同名不同身份不合并；重复身份/路由异常保留原数据、提示配置冲突并拒绝歧义拖动，不生成重复入口；冲突状态仍遵守平台隐藏/删除及既有有效覆盖 | planned | — |
| T-R005-01 | I001 | R005 | AC-R005-01 | e2e | automated | PetWebOrg/suiyin-admin | tests/menu-sort/save-undo-reopen.spec.ts | 每次有效移动只有一条含旧/新父级及位置记录；最近一次撤销同步还原树、导航和覆盖标记并单独记撤销；刷新/重开恢复已成功状态且清旧撤销；后续数据修改使撤销失效，折叠/滚动/编辑后取消不清除；旧显示/权限/名称不丢失 | planned | — |
| T-R005-02 | I001 | R005 | AC-R005-02 | integration | automated | PetWebOrg/suiyin-admin | tests/menu-sort/save-failure.spec.ts | 在正式保存、相关导航状态及多阶段后续写入点注入失败；移动/撤销失败后树、导航、覆盖、记录均保持上次成功值，所有窗口无半成品；显示未保存和重试提示，撤销失败仍可重试，重试成功才提交一次 | planned | — |
| T-R006-01 | I001 | R006 | AC-R006-01 | integration | automated | PetWebOrg/suiyin-admin | tests/menu-sort/platform-before-tenant.spec.ts | 平台已有排序/归属时，未覆盖 A 的表格和导航先反映当前有效规则；A 明确调整一组或一个父级后导航保持该结果，B 继续跟随平台；平台隐藏和原权限始终有效 | planned | — |
| T-R006-02 | I001 | R006 | AC-R006-02 | domain | automated | PetWebOrg/suiyin-admin | tests/menu-sort/platform-after-tenant.spec.ts | A 已覆盖的根列表/组 X 顺序及移动项 a 父级保留；平台后续仍改变未覆盖组 Y 与 b 父级，B 全部跟随；一级重排不冻结二级，组内重排不冻结未移动项父级；新有效成员按平台顺序追加、缺失成员不造节点，表格导航一致 | planned | — |
| T-R006-03 | I001 | R006 | AC-R006-03 | security | automated | PetWebOrg/suiyin-admin | tests/menu-sort/platform-visibility-fallback.spec.ts | a 从平台 X 移到租户 Y 后，平台隐藏 X 或 a 仍使 a 不可见，平台删除不能被覆盖复活；Y 失效时保留覆盖但暂不应用，回退平台有效父级或原始有效父级并提示；Y 恢复后再次应用覆盖，无新增路由或权限 | planned | — |
| T-R007-01 | I001 | R007 | AC-R007-01 | integration | automated | PetWebOrg/suiyin-admin | tests/menu-sort/legacy-and-concurrent.spec.ts | 旧数字排序、隐藏/权限与平台设置升级后保持原有效导航，不自动生成新拖动覆盖；另一同租户窗口修改时取消进行中拖动、清旧撤销、加载最新结构并提示；旧快照不得覆盖新设置，跨租户相同 row.id 不串用 | planned | — |
| T-R008-01 | I001 | R008 | AC-R008-01 | e2e | automated | PetWebOrg/suiyin-admin | tests/menu-sort/invalid-and-cancel.spec.ts | 一级嵌套、二级升一级/生成三级、循环、无效身份均拒绝；原位、表外松手、Escape、失焦与 pointercancel 不保存/记记录/更新导航，并恢复临时展开及焦点；历史深层完整保留、相关拖动禁用且原可见入口可打开 | planned | — |
| T-R009-01 | I001 | R009 | AC-R009-01 | e2e | automated | PetWebOrg/suiyin-admin | tests/menu-sort/keyboard-touch-states.spec.ts | Space/Enter 开始、方向键选位、Enter 提交、Escape 取消；桌面触控、悬停展开和边缘滚动可完成移动；未加载/空态/错误/只读/disabled/editable=false/无编辑操作不发起拖动，错误可重试且空态不造行；手柄不触发展开或行操作 | planned | — |
| T-R009-02 | I001 | R009 | AC-R009-01 | visual | manual | PetWebOrg/suiyin-admin | docs/qa/menu-sort/T-R009-02.md | 在长表、窄窗、收起目标下检查插入线、文字反馈、拖影、焦点、滚动和冻结表头；菜单名称/手柄/行操作热区对齐，无挡住目标或遮盖弹窗；附操作视频、视口尺寸和逐项判定 | planned | 可读性、手柄命中感和拖动过程是否遮挡需要真人观察；在正式环境至少记录常规桌面与窄窗两种视口，证据存入本路径并回链 PR |

## 4. Test Data & Profiles

| Data ID | Tenant / Profile | 前置数据 | 隐私处理 | 覆盖 Test IDs |
|---|---|---|---|---|
| D001 | 全部系统租户；环境 metadata 佰智德三 | 正式系统当前租户/Profile 清单、各自完整菜单及既有权限；原型 15 租户作参考覆盖 | 使用测试环境租户与脱敏/合成菜单，保留租户隔离；不上传真实业务资料 | T-R001-01、T-R003-01、T-R004-01 |
| D002 | 租户 A / B 与平台管理 | 一级含多个二级、同名不同路由、空一级、隐藏项及有自身页面的一级 | 独立测试账号和隔离配置；前后快照不含账号秘密 | T-R002-01、T-R002-02、T-R004-01、T-R005-01 |
| D003 | 平台默认 + 租户局部覆盖 | 根列表/组 X/组 Y 不同顺序；a/b 不同归属；新增项、消失项和暂失效父级；平台隐藏祖先/删除项 | 合成稳定身份，平台和租户样本各自保存 | T-R006-01、T-R006-02、T-R006-03 |
| D004 | 旧配置与同租户双窗口 | 旧数字重复值、旧显示/权限/名称、已有本地配置；窗口间相继编辑/移动/撤销 | 使用隔离测试会话，不清理实际用户设置 | T-R003-01、T-R005-01、T-R007-01 |
| D005 | 保存异常与配置冲突 | 正式保存每阶段可控失败；重复 key/row.id/路由；历史三级；只读/加载/错误/空态 | 仅在可回收测试环境注入，不修改客户生产配置 | T-R004-01、T-R005-02、T-R008-01、T-R009-01 |
| D006 | 长表与窄窗 | 足以溢出的菜单树，收起一级、可编辑/不可编辑混合、键盘和桌面触控输入 | 录屏只含测试菜单；报告标注浏览器版本、视口与输入方式 | T-R002-02、T-R009-01、T-R009-02 |

原型参考样本 ID：`yestar-sz、yestar、yestar-bj、yestar-gz、yestar-hz、yestar-jx、jbfs、mengzhua、bzds、crrm、hqjd、ykjl、ruixi-kh-xiaowen、rxxz、yzhb`。生产参数化清单应由真实注册源产生，不从这里硬编码功能授权。

## 5. CI Gates

- #432 已建立；领取后在正式仓独立 worktree 按 **Phase 1 → Phase 2 → Phase 3 → PR → 房总 review** 实施和测试。本文件不授权本原型 session 跨生产仓改代码、测试或 CI，不允许直推 `main`。
- PR 必须运行 I001 的全部自动化 Test IDs，并补齐两项人工检查；测试名称、报告标签、注释或 artifact 至少一种能机器检索 Test ID/AC-ID。
- 自动化失败、漏掉 MUST/AC、版本不匹配、人工无理由或缺实际判定记录，均不能宣称本单验收完成。
- API、持久化与跨窗口实现的具体接入点由正式仓确认；正式失败路径不得只复用浏览器本地存储 mock 证明实际写入原子性。
- #408 的顺序写入/回读方案本身不能证明 T-R005-02 要求的失败后完整一致状态。若需要额外能力，先保留失败证据和工程方案，正式评审后实施；不得宣称事务回滚已具备，或将 #408 标成待完成依赖。
- 当前 `planned` 仅标识生产验证待实施。全部真实证据闭合并重跑追踪校验后，才能把 Handoff/Test Contract 标为 `verified`。
- Slice `released` 还须真实 Issue Ref、`actual_issue_creation: true`、已 verified 的两份合同和实际发布依据；生产发布不由原型通过自动推导。

## 6. Evidence

| Evidence ID | Test IDs | 类型 | 位置 | 保留时机 |
|---|---|---|---|---|
| EV001 | T-R001-01、T-R002-01、T-R003-01、T-R004-01、T-R005-01、T-R005-02、T-R006-01、T-R006-02、T-R006-03、T-R007-01、T-R008-01、T-R009-01 | planned：正式仓 CI 报告/trace/失败截图 | planned：I001 实现 PR 的 CI artifact，按 Test ID 标注并回链本合同；尚无实际 URL | 正式 PR 与发布验收 |
| EV002 | T-R002-02、T-R009-02 | planned：正式环境人工截图/录屏及判定表 | planned：正式仓 `docs/qa/menu-sort/T-R002-02.md`、`T-R009-02.md` 或等价 PR 附件入口；尚未执行 | 正式 PR，UI 改动后按影响范围重验 |
| EV003 | T-R001-01、T-R002-01、T-R003-01、T-R004-01、T-R005-01、T-R005-02、T-R006-01、T-R006-02、T-R006-03、T-R007-01、T-R008-01、T-R009-01 | 原型参考证据，非生产 Test ID 执行结果 | 本包 [verification.md](./verification.md) 和 `checks/` 中的静态原型检查记录 | 本次原型交付时，仅支持复现与设计对照 |

原型现有记录包含 15 租户/29 场景、18 平台拖动回归、9 平台联动回归、历史三级和冲突场景核对。这些是 HTML 原型证据；Coverage Matrix 的生产 Evidence 仍全部保持 `planned`，不得据此填写生产 CI 通过或发布完成。

## 7. Change Control

- SPEC 版本或规则变更后，本合同立即 stale；先更新映射与 Oracle，再重跑 `validate-traceability.mjs`。
- 调整测试路径、框架和夹具不能反向改变业务 Oracle；有歧义时回到源 SPEC 审核。
- 新增跨仓依赖或产品能力不在本合同中默许，须正式流程明确并回链。
- 实际生产证据形成后才更新对应 CI Evidence 和执行阶段；不把原型记录改名为生产报告，不虚填 Issue/PR/CI 链接。
