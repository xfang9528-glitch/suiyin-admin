---
plan_for: SPEC-SUIYIN-ADMIN-053
spec_version: 1.0.2
status: implemented
artifact_class: static-html
exception_status: not-required
exception_approved_by: none
exception_approved_at: none
operational_profile: none
last_updated: 2026-09-20
---

> 本轮修订（2026-09-20）：2026-09-20 用户对四张对照截图要求“像素级的同频”，修正后明确“行，现在看着又好不少，先完整推送一次，我们继续迭代”。这是已批准范围的视觉/证据纠偏和本次静态发布授权，不代表全部像素验收通过，也不声称用户逐字审阅生成文件。 不新增业务规则，保留 R-ID、AC-ID、统计口径、租户和菜单范围。状态为 implemented；在线最终对照及未采集证据继续保留。

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
日期控件为静态重建且非生产引擎；当前主操作 #00c4af 取自本路由直接截图，hover和完整滚动仍需在线复核。钩子移除即可退回旧渲染，旧JSON保留，既有变声页不改业务规则。
## 10. 预览计划
复用8148；Chrome打开深圳/锦帛/萌爪代表页；提供正常URL与有数据的采集日期。

联动范围：052@1.2.0 按最新用户要求完整复用本页筛选，包含单日/范围、对应日历、快捷日、部门与搜索/重置/导出。变声计数与分页仍由052定义，各页使用自身数据来源。本 053@1.0.2 只更新过期旁述，不改变销售使用统计自身行为。

1.0.1 视觉恢复：分段式单日/范围、32px筛选控件、220px部门选择、淡蓝部门标签、横向边线和分组小计；结果区自然滚动，短页保持白色背景。与本轮直接截图同应用尺寸比较，残余偏差如实记录。
