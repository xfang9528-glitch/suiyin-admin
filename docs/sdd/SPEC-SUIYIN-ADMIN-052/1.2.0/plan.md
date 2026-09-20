---
plan_for: SPEC-SUIYIN-ADMIN-052
spec_version: 1.2.0
status: implemented
artifact_class: static-html
exception_status: not-required
exception_approved_by: none
exception_approved_at: none
operational_profile: none
last_updated: 2026-09-20
---

# Prototype Plan — 销售变声统计筛选完整对齐

## 1. Constitution Check
本轮来自 SPEC 052 E012 的直接 USER 指令，覆盖旧直接区间特例，按 R002/AC-R002-01/02/03 完整复用销售使用统计筛选。R003 计数与 R004/R005 菜单、权限、租户边界保持；依赖仍为 051@1.1.0。2026-09-20 房总最新指令“完整推送，并给陈宣宇在管理页代码仓建立 Issue 实现管理页销售变声统计的这个功能，提出环境深圳艺星，提出人ZHONG”授权本轮完整原型交付与销售变声统计工程建单。生产实施继续由目标代码仓正式工程流程完成。

## 2. Artifact Boundary
static-html：仅现有 HTML/CSS/JS 与本地合成事件；不新增认证、服务端 API、共享持久化、数据库或 migration。例外 not-required，Operational Profile none；不进入任何生产仓。

## 3. 复用地图
当前 admin-sales-usage.js/css 的筛选 DOM 与局部样式、AdminUsageDatePicker 日历、AdminControls 部门下拉、已有 Shell 和权限。颜色、分段、日期输入、快捷日、部门及动作区全部直接对照当前使用统计。使用统计冻结样本来源不复制到变声计数。

## 4. 文件与路由
仅 E:/AI 项目/佰智德三/碎银原型/suiyin-admin/prototype 内 salesVoiceStats 的 admin-sales-voice-stats.js/css、admin-voice-pixel.css 及必要共享样式；为准确复用可提取局部共用结构，但不得改变使用统计业务规则。菜单和数据文件非本次预期修改面；如必须改变则先核对 R001/R003/R004/R005 边界。

## 5. 信息结构
统计时间 → 单日/范围分段 → 日期控件 → 今天/昨天/前天 → 部门 → 搜索/重置/导出。保持使用统计的顺序、尺寸、间距、标签、图标、颜色和分段选中反馈；变声表的说明、次数、合计、分页继续存在（R002/R007）。

## 6. 交互实现
默认单日今天；范围显示起止，切回单日取开始日并归一结束日期。模式、日历和部门编辑为草稿，搜索提交；快捷日按上海运行日计算、关闭日历并立即查询，范围模式可继续显示同日起止；重置回单日今天、全部本租户部门、默认排序并查询。日历 Escape/外部点击取消不提交，焦点和禁用状态对齐使用统计。非法日期不覆盖旧结果；导出仍覆盖全筛选数据。加载、错误重试及租户可见性保持（R002/R005/R006/R007）。

## 7. Mock 方案
沿用当前独立任务首次成功事件与本租户合成销售/部门，不改任务去重、首次成功时间、跨日归属、零值与失败判定。变声使用运行日合成样本；使用统计使用冻结本租户采集，不为视觉一致改写任一数据来源（R003/R005）。

## 8. 验证计划
- AC-R002-03：同租户同视口比较两页单日/范围、日期弹层、快捷、部门及三项动作的 DOM、几何、样式和反馈；实际 Chrome 截图是视觉证据，源码相似不代替截图。
- AC-R002-01/02：模式草稿不提交，快捷立即查询，重置、非法日期、全量导出；同时复核 R003 固定任务次数无变化。
- AC-R005-01/006-01：租户切换、无权限、空/零/错误、重试、日期取消和键盘焦点。
- 保留旧版本验证为历史，本次证据单列于 evidence/，不把旧检查数算本次结果。

## 9. 风险与回退
共享样式可能误伤使用统计或日期弹层；只修改必要规则，保存原文件摘要，对两页同时回归。模式切换不得改变首次成功计数和已提交结果；视图一致不能造成跨租户或跨指标数据回退。

## 10. 预览计划
复用 http://127.0.0.1:8169/prototype/_shell.html?tenant=yestar-sz&page=salesVoiceStats ，在 Chrome 与同租户 salesMessageUsage 对照，并抽查非艺星租户。本轮已收到新的完整推送指令，原型、当前文档、inline 和新版本 SDD 同步交付；旧版本保持不可变。
