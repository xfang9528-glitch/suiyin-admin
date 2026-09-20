---
test_contract_id: TEST-CONTRACT-SUIYIN-ADMIN-052
spec_id: SPEC-SUIYIN-ADMIN-052
spec_version: 1.2.0
status: approved
prepared_by: "Codex"
prepared_at: 2026-09-20
---

# 销售变声统计 — Test Contract

## 1. 测试摘要

源规格 SPEC-SUIYIN-ADMIN-052@1.2.0；对应 [HANDOFF-SUIYIN-ADMIN-052 / I001](issue-handoff.md)。目标仓 PetWebOrg/suiyin-admin。此合同仅定义测什么，生产仓按既有框架调整建议测试路径；不得因路径不同省略Oracle。全部CI Evidence为planned，表示待工程实现并验证，非测试已经通过。

## 2. Strategy

用受控事件夹具判定去重、日期和归属；对真实统计接口做契约/授权集成；对生产注册表全部适用租户、筛选、导出和表头做E2E；原型15个键只是已覆盖证据，不构成生产白名单。原型本地报告只证明原型，不证明生产事件完整性、授权或性能。不能自动化的视觉语义保留人工原因与截图判定。

## 3. Coverage Matrix

| Test ID | Slice ID | Rule | Acceptance | Layer | Automation | Target Repo | Planned Test Path | Oracle | CI Evidence | Manual Reason |
|---|---|---|---|---|---|---|---|---|---|---|
| T-R001-01 | I001 | R001 | AC-R001-01 | parameterized | automated | PetWebOrg/suiyin-admin | tests/e2e/sales-voice-stats/tenant-menu.spec | 枚举生产租户注册表中的全部适用租户：数据展示保留销售使用统计并新增销售变声独立页面；本租户品牌/销售/部门正确；15个原型键仅为现有证据清单，不作生产白名单 | planned | — |
| T-R002-01 | I001 | R002 | AC-R002-01 | e2e | automated | PetWebOrg/suiyin-admin | tests/e2e/sales-voice-stats/filters.spec | 单日/范围、编辑、快捷日、搜索与重置符合R002；Asia/Shanghai自然日含首尾；默认今天与全部授权部门；草稿不提前提交 | planned | — |
| T-R002-02 | I001 | R002 | AC-R002-02 | integration | automated | PetWebOrg/suiyin-admin | tests/integration/sales-voice-stats/export.spec | 非法日期不覆盖旧结果；同一筛选超过20行时导出全部结果且总次数一致，不只导出当前页；取消不提交 | planned | — |
| T-R002-03 | I001 | R002 | AC-R002-03 | visual | automated | PetWebOrg/suiyin-admin | tests/visual/sales-voice-stats/filters.spec | 同租户同视口同日期草稿下两页筛选控件顺序、文案、颜色、图标、尺寸、间距及弹层一致；不复制使用统计消息数据 | planned | — |
| T-R002-04 | I001 | R002 | AC-R002-01 | e2e | automated | PetWebOrg/suiyin-admin | tests/e2e/sales-voice-stats/sort-pagination.spec | 次数按数值升降序；排序、分页和导出使用同一已提交筛选；跨页无漏重，改变筛选后页码有效 | planned | — |
| T-R003-01 | I001 | R003 | AC-R003-01 | contract | automated | PetWebOrg/suiyin-admin | tests/contract/sales-voice-stats/counting.spec | A首成及重复成功回调+B失败后重试成功+C始终失败+A两次试听：销售甲=2；销售乙独立D首成=1；发送失败不撤销生成成功次数 | planned | — |
| T-R003-02 | I001 | R003 | AC-R003-02 | contract | automated | PetWebOrg/suiyin-admin | tests/contract/sales-voice-stats/time-attribution.spec | 前日发起次日首次成功仅计次日；上海零点边界正确；无成功任务销售为0；多个工作账号按稳定销售ID聚合，部门取事件归属且转组不改历史 | planned | — |
| T-R004-01 | I001 | R004 | AC-R004-01 | e2e | automated | PetWebOrg/suiyin-admin | tests/e2e/sales-voice-stats/menu-parity.spec | 全部适用生产租户菜单库存和适用平台定义均有相同稳定身份/名称/路由/父级；隐藏恢复排序联动同租户侧栏；取消不保存，别租户配置不变 | planned | — |
| T-R005-01 | I001 | R005 | AC-R005-01 | security | automated | PetWebOrg/suiyin-admin | tests/security/sales-voice-stats/tenant-permissions.spec | 相同显示名不跨租户合并；切租户清理旧状态；越租户或越授权部门查询被服务端拒绝；隐藏父级或无权限直链不放行，不自动给账号配置变声 | planned | — |
| T-R006-01 | I001 | R006 | AC-R006-01 | integration | automated | PetWebOrg/suiyin-admin | tests/integration/sales-voice-stats/states.spec | 正常0、无匹配销售、加载中、读取失败、权限不足分别表达；失败不变全0；加载禁重复请求，失败重试保留已提交条件；查询不产生变声事件 | planned | — |
| T-R007-01 | I001 | R007 | AC-R007-01 | manual | manual | PetWebOrg/suiyin-admin | docs/qa/sales-voice-stats/visual-review.md | 以同租户销售使用统计为视觉参照核对数值、筛选、焦点、取消及说明；原型合成来源明确，生产接入使用真实统计结果不把Mock或普通消息数冒充变声次数 | planned | 页面原生字体、窄窗手感与原型/生产来源语义需人工综合判定；记录同视口截图和操作步骤，不能只写看过 |
| T-R007-02 | I001 | R007 | AC-R007-01 | e2e | automated | PetWebOrg/suiyin-admin | tests/e2e/sales-voice-stats/sticky-header.spec | 仅销售变声页引用055@1.1.0:R005/AC-R005-01/02：向下表头可见，至表尾退出；横向列对齐，排序分页重绘后有效；日历/部门/弹窗不被挡住，短表不增加高度 | planned | — |

T-R007-02 对应052 AC-R007-01滚动视觉，辅助依据055@1.1.0:R005/AC-R005-01/02，只限销售变声页。T-R007-01保留R007静态原型边界：工程产品必须接真实数据，不能将原型演示本地能力当生产能力。

## 4. Test Data & Profiles

| Data ID | Tenant / Profile | 前置数据 | 隐私处理 | 覆盖 Test IDs |
|---|---|---|---|---|
| D001 | 生产注册表全部适用租户；15原型键为现有证据 | 各自独立销售ID、部门ID、菜单身份；设置跨租户同显示名 | 仅测试环境假名，不含语音内容或客户联系方式 | T-R001-01、T-R004-01、T-R005-01 |
| D002 | 深圳艺星 | A重复首成回调，B失败后首成，C一直失败，D属于另一销售；试听/取消不计 | 可复现事件fixture，taskId稳定且tenant隔离 | T-R003-01、T-R003-02 |
| D003 | 深圳艺星 | 23:59:59与00:00:00上海边界、同销售多工作账号、历史部门与现部门不同 | 受控时间、稳定ID；测试数据不得注入生产 | T-R002-01、T-R003-02 |
| D004 | 深圳艺星 | 21条以上销售、数值2/10/100、两部门、零/无结果/拒绝/网络失败 | 测试接口控制状态；不以Mock报告生产完成 | T-R002-02、T-R002-04、T-R006-01 |
| D005 | 深圳艺星和非艺星代表租户 | 同视口两页筛选、长/短表、窄窗、日期/部门浮层 | 截图不含账号凭证和客户联系资料 | T-R002-03、T-R007-01、T-R007-02 |

## 5. CI Gates

- PR须运行I001自动化Test IDs；事件/统计接口若缺失，应记录阻塞与对接证据，不得用消息数/模拟值替代。
- 生产服务端授权及统计数据源必须通过集成验收；前端隐藏按钮不等于权限验证。后端具体实现未调查，自动化测试在既有接口可用或正式对接完成后执行。
- Test ID / AC-ID 至少一种出现在测试名、标签、报告或CI artifact。Manual项目附步骤、同视口截图、审核结果。
- planned不得解释为通过；真实Issue完成前，全部MUST须有实际证据。verified/released前替换计划Evidence并重跑validate-traceability。

## 6. Evidence

| Evidence ID | Test IDs | 类型 | 位置 | 保留时机 |
|---|---|---|---|---|
| EV001 | T-R001-01、T-R002-01、T-R002-02、T-R002-04、T-R004-01、T-R005-01、T-R006-01、T-R007-02 | CI E2E / security / integration | planned：目标仓PR的sales-voice-stats测试artifact，回填实际URL | PR / release |
| EV002 | T-R003-01、T-R003-02 | 真实事件/接口契约集成 | planned：接口核实记录、fixture输入及实际聚合输出和CI URL | 接入前 / PR |
| EV003 | T-R002-03、T-R007-01 | 视觉截图与人工记录 | planned：目标仓PR附件或可访问QA记录 | PR / release |

## 7. Change Control

只调整测试实现不能改变业务Oracle；SPEC升版后合同stale。未经授权不跨仓写生产代码、测试或CI。本合同不自动创建后端Issue，也不扩大成全管理页表头工程。
