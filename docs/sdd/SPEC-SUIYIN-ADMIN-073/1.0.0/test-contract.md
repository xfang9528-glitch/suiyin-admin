---
test_contract_id: TEST-CONTRACT-SUIYIN-ADMIN-073
spec_id: SPEC-SUIYIN-ADMIN-073
spec_version: 1.0.0
status: approved
prepared_by: "Codex"
prepared_at: 2026-09-29
---

# 工具管理与辅助线管理 — Test Contract

## 1. 测试摘要

源规格：[SPEC-SUIYIN-ADMIN-073@1.0.0](https://github.com/xfang9528-glitch/suiyin-admin/blob/v2026092902-admin-tools-guide-lines/docs/sdd/SPEC-SUIYIN-ADMIN-073/1.0.0/spec.md)，交接：[HANDOFF-SUIYIN-ADMIN-073](https://github.com/xfang9528-glitch/suiyin-admin/blob/v2026092902-admin-tools-guide-lines/docs/sdd/SPEC-SUIYIN-ADMIN-073/1.0.0/issue-handoff.md)。本合同给I001定义生产验收，框架和真实路径在Phase 1确定。下述路径是建议计划，不代表已在生产仓创建测试。

## 2. Strategy

菜单/权限按真实租户参数化；草稿和上传用延迟/失败注入；初始化按真实脱敏对账清单；预览验证纯展示和独立对象；视觉人工比对已批准原型。生产证据全部planned。

## 3. Coverage Matrix

| Test ID | Slice ID | Rule | Acceptance | Layer | Automation | Target Repo | Planned Test Path | Oracle | CI Evidence | Manual Reason |
|---|---|---|---|---|---|---|---|---|---|---|
| T-R001-01 | I001 | R001 | AC-R001-01 | e2e | automated | PetWebOrg/suiyin-admin | tests/admin-tools/r001-01.spec.ts | 任意租户工具父级占原话术位置，话术稳定二级入口；艺星辅助线唯一入口；普通/平台菜单一致 | planned | — |
| T-R002-01 | I001 | R002 | AC-R002-01 | integration | automated | PetWebOrg/suiyin-admin | tests/admin-tools/r002-01.spec.ts | 旧话术链接/状态/隐藏/权限与其他菜单排序保留，隐藏入口不被新父级复活 | planned | — |
| T-R003-01 | I001 | R003 | AC-R003-01 | parameterized | automated | PetWebOrg/suiyin-admin | tests/admin-tools/r003-01.spec.ts | 所有登记艺星中有既有菜单和操作权限的用户可用；非艺星及同租户无权限账号拒绝；原型六艺星不是生产白名单 | planned | — |
| T-R003-02 | I001 | R003 | AC-R003-01 | security | automated | PetWebOrg/suiyin-admin | tests/admin-tools/r003-02.spec.ts | 真实鉴权下伪造tenant或复用资源标识不能读取/修改他租户；平台目录可见不授予素材权限；旧请求不得落入新租户 | planned | — |
| T-R004-01 | I001 | R004 | AC-R004-01 | integration | automated | PetWebOrg/suiyin-admin | tests/admin-tools/r004-01.spec.ts | 以逐租户核实的当前可见清单初始化，默认/专属都可编辑，数量/身份/引用对账无遗漏和跨店混入 | planned | — |
| T-R004-02 | I001 | R004 | AC-R004-01 | integration | automated | PetWebOrg/suiyin-admin | tests/admin-tools/r004-02.spec.ts | 未初始化、已保存空、全部停用和读取失败分别处理；初始化重复执行不复制条目或复活已删除内容 | planned | — |
| T-R005-01 | I001 | R005 | AC-R005-01 | e2e | automated | PetWebOrg/suiyin-admin | tests/admin-tools/r005-01.spec.ts | 分类必填/同租户重名、CRUD、排序、启停与删除确认取消符合AC；清空刷新仍为空 | planned | — |
| T-R006-01 | I001 | R006 | AC-R006-01 | e2e | automated | PetWebOrg/suiyin-admin | tests/admin-tools/r006-01.spec.ts | 图片添加/名称/排序/删除；替换保身份和顺序；取消/失败原图仍在 | planned | — |
| T-R006-02 | I001 | R006 | AC-R006-01 | integration | automated | PetWebOrg/suiyin-admin | tests/admin-tools/r006-02.spec.ts | 同源图在两个分类及两租户重复引用，替换/删除仅影响当前条目；不改共享原文件或已输出图片 | planned | — |
| T-R007-01 | I001 | R007 | AC-R007-01 | integration | automated | PetWebOrg/suiyin-admin | tests/admin-tools/r007-01.spec.ts | 批次混合格式/大小/损坏图逐项失败；重试/重选不重复；未成功项不能保存 | planned | — |
| T-R007-02 | I001 | R007 | AC-R007-01 | integration | automated | PetWebOrg/suiyin-admin | tests/admin-tools/r007-02.spec.ts | 上传中删除条目/分类、放弃或切租户后，迟到结果不能恢复内容或写入其他租户 | planned | — |
| T-R008-01 | I001 | R008 | AC-R008-01 | integration | automated | PetWebOrg/suiyin-admin | tests/admin-tools/r008-01.spec.ts | 保存只提交有效草稿；重复提交受限；成功刷新一致，失败保留草稿与旧服务端版本；按Phase 1确认的并发协议验证双管理者冲突，保留双方草稿与最新已存版本，不无提示覆盖 | planned | — |
| T-R008-02 | I001 | R008 | AC-R008-01 | e2e | automated | PetWebOrg/suiyin-admin | tests/admin-tools/r008-02.spec.ts | 切页/关闭/切租户/外部菜单隐藏提供保存放弃继续；继续保留页；保存失败不放行；关闭后无遮罩残留；浏览器原生离开提示 | planned | — |
| T-R009-01 | I001 | R009 | AC-R009-01 | e2e | automated | PetWebOrg/suiyin-admin | tests/admin-tools/r009-01.spec.ts | 预览只读当前启用内容与顺序，纯缩略图，草稿有标记；多对象变换/删除互相独立且不写配置 | planned | — |
| T-R010-01 | I001 | R010 | AC-R010-01 | visual | manual | PetWebOrg/suiyin-admin | docs/issues/admin-tools/acceptance.md | 1280×720检查默认、空态、长列表、编辑/上传失败弹窗及PC预览，关键按钮和焦点可用，无页面横向滚动 | planned | 视觉可读性或真实跨端发布口径需人工检查；在PR附截图及回执链接，判定按Oracle |
| T-R010-02 | I001 | R010 | AC-R010-01 | e2e | automated | PetWebOrg/suiyin-admin | tests/admin-tools/r010-02.spec.ts | 读取失败有重试且不覆盖旧配置，素材加载失败有反馈，Esc和键盘排序/返回可操作 | planned | — |
| T-R011-01 | I001 | R011 | AC-R011-01 | manual | manual | PetWebOrg/suiyin-admin | docs/issues/admin-tools/acceptance.md | 逐项核对演示数据与真实服务边界；真实保存/上传反馈必须有服务回执，未完成PC联调不得声称客户端已同步 | planned | 视觉可读性或真实跨端发布口径需人工检查；在PR附截图及回执链接，判定按Oracle |

## 4. Test Data & Profiles

| Data ID | Tenant / Profile | 前置数据 | 隐私处理 | 覆盖 Test IDs |
|---|---|---|---|---|
| D001 | 任意已登记艺星A、艺星B和非艺星C | 默认、专属、跨分类同源引用、已保存空、停用和读取错误状态 | 生产素材清单需脱敏核实，测试使用合成透明PNG | T-R001-01、T-R002-01、T-R003-01、T-R003-02、T-R004-01、T-R004-02、T-R005-01、T-R006-01、T-R006-02、T-R007-01、T-R007-02、T-R008-01、T-R008-02、T-R009-01、T-R010-01、T-R010-02、T-R011-01 |

## 5. CI Gates

PR运行I001全部自动化项并保留Test/AC标识；人工项附可访问证据与结论。未初始化与已清空、失败原值、并发保存、越权及迟到回调必须有负向检查。不能拿原型报告替代生产接口/安全/存量迁移验收。未完成真实PC消费联调时，在发布说明明确仅Admin完成。

## 6. Evidence

| Evidence ID | Test IDs | 类型 | 位置 | 保留时机 |
|---|---|---|---|---|
| EV001 | T-R001-01、T-R002-01、T-R003-01、T-R003-02、T-R004-01、T-R004-02、T-R005-01、T-R006-01、T-R006-02、T-R007-01、T-R007-02、T-R008-01、T-R008-02、T-R009-01、T-R010-01、T-R010-02、T-R011-01 | 生产CI、真实服务回执、人工视觉和初始化对账 | planned | PR验收时由负责人补真实链接 |

已完成的静态原型证据见[verification.md](https://github.com/xfang9528-glitch/suiyin-admin/blob/v2026092902-admin-tools-guide-lines/docs/sdd/SPEC-SUIYIN-ADMIN-073/1.0.0/verification.md)，只支持设计演示，不把本测试合同标为verified。

## 7. Change Control

SPEC版本或规则变化后更新此合同；Oracle有争议先回规格审核。生产测试路径/框架可在Phase 1明确，不静默改变验收条件。
