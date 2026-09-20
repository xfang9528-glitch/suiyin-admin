---
plan_for: SPEC-SUIYIN-ADMIN-053
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

# Prototype Plan — 销售使用统计对齐

## 1. Constitution Check
用户结果、证据分层、状态和租户隔离 PASS；直接纠偏授权来自E001。视觉未验证单独记录，不扩大验证声明。
## 2. Artifact Boundary
static-html，仅HTML/CSS/JS与静态JSON，无认证/API/共享持久化。例外not-required，Operational Profile none；不进入任何生产仓。
## 3. 复用地图
复用Admin Shell、SVG、部门选择器、菜单可见性；该route新建专用renderer以避免影响其它统计页。
## 4. 文件与路由
admin-sales-usage.js/css（R001–R007），data/sales-usage/15份JSON（R003），admin-content.html加载钩子；不改全局通用统计逻辑。
## 5. 信息结构
同一筛选组包含统计时间模式/日期/快捷日、部门、搜索重置导出；业务标题及摘要；分组表和tfoot；底部轻量样本日期/来源说明。
## 6. 交互实现
日期和部门草稿，搜索提交；单日/范围切换；日历popover可取消；组级排序，汇总保持末尾；CSV只明细。JSON错误重试，隐藏菜单禁止直链。
## 7. Mock 方案
3个本租户非空、1个本租户空态、11个未采集；历史日期样本不伪装为实时，保持既有人员展示名与统计数字。
## 8. 验证计划
独立数据交叉核验、15租户DOM、深圳/锦帛主要交互、JS语法/HTTP；Chrome同视口检验尝试，失败保留限制。
## 9. 风险与回退
日期控件为静态重建且非生产引擎；当前路由色值以用户后台截图为临时基准。钩子移除即可退回旧渲染，旧JSON保留，既有变声页不改业务规则。
## 10. 预览计划
复用静态预览服务；Chrome打开深圳/锦帛/萌爪代表页；提供正常URL与有数据的采集日期。

联动范围：052@1.1.1仅同步变声页统计主按钮、数字对齐和共享日期弹层；仍直接日期区间，无模式切换，计数与分页不变。
