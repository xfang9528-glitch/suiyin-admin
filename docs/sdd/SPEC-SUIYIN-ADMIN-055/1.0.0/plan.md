---
plan_for: SPEC-SUIYIN-ADMIN-055
spec_version: 1.0.0
status: implemented
artifact_class: static-html
exception_status: not-required
exception_approved_by: none
exception_approved_at: none
operational_profile: none
last_updated: 2026-09-20
---

> 发布范围补充（2026-09-20）：用户在上述实施验收之后明确“完整推送”，授权当前管理后台静态原型、必要派生单文件及文档的提交、推送、tag和预览发布。此补充不改R-ID/AC、计数或租户规则，不批准生产实现、工程Issue或工程指派；静态原型交付通知按既有流程。合同仍为implemented，Chrome当前线上视觉与缺采集项保持未完成。远端成功须由实际发布回执证明。

# Prototype Plan — 管理列表筛选表格及来源一致性
## 1. Constitution Check
用户结果、证据分层、静态边界和租户隔离PASS；缺少视觉证据保留，不做伪验收。
## 2. Artifact Boundary
static-html，只有HTML/CSS/JS/本地JSON和本地浏览器状态；无认证、API、共享数据库，例外not-required。不进入生产仓。
## 3. 复用地图
Admin Shell、AdminLiveUI source profiles、真实captures、专用菜单/usage/voice；修共享模板并保持专用路由优先。
## 4. 文件与路由
admin-content.js/css，共享筛选/表格/来源。
## 5. 信息结构
真实字段和动作优先，不再通用注入；来源说明与业务表格分开；领域结构对应真实页面。
## 6. 交互实现
按R-ID执行；草稿、搜索、取消、本地保存、缺样本、读取失败和重试分别验证。
## 7. Mock 方案
现有脱敏数据保留来源身份；源采集可确认真实空态时不能把参考样本称为实采。
## 8. 验证计划
752入口证据矩阵，源字段/表头/按钮对照，代表行为，全部DOM载入，052/053回归，HTTP依赖字节对照；Chrome不可用记限制。
## 9. 风险与回退
共享模块影响广，按路由分层和旧专用组件回归。保留改前hash及拷贝，只安装本轮实际修改文件。
## 10. 预览计划
发布入口prototype/_shell.html，代表路由对应当前租户；本轮“完整推送”阶段另外生成派生单文件与版本化合同包。
