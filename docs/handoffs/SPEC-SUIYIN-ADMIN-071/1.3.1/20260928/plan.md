---
plan_for: SPEC-SUIYIN-ADMIN-071
spec_version: 1.3.1
status: approved
artifact_class: static-html
exception_status: not-required
exception_approved_by: none
exception_approved_at: none
operational_profile: none
last_updated: 2026-09-28
---

# Prototype Plan — 首次与最近一次直接作为基准选项

E028为用户明确纠正和具体实施授权。1.3.0合同已保存history/1.3.0/，原位交互已完成，E029另行授权当前1.3.1完整推送；不重复要求批准。

## 1. Constitution Check

用户选择一次即可明确事件和次数；静态合成演示、六租户隔离、原权限、节点和21/26条件保持。精确依赖不变，模型真实事件来源和PC名单仍未接入。

## 2. Artifact Boundary

artifact_class为static-html，无服务器、登录、API或共享持久化；仅既有本地演示存储。exception_status为not-required，不进入生产仓。

## 3. 复用地图

复用admin-revisit-rules.js原下拉及M.anchors目录、M.validate、M.summary、M.evaluate。模型保留12类基准定义，UI按事件类型展开首次/最近一次，得到15项显示选项；不需要更改模型或CSS。

## 4. 文件与路由

唯一产品改动：原型仓prototype/admin-revisit-rules.js，六艺星revisitRules共用。业务不改菜单或其他页面；完整推送另同步README、PRD、流程图、设计规范、验证说明、_inline-check.html和生成_shell_inline.html、版本化SDD及release.json。基准选项ID在UI中使用visit:first等复合值；存储依旧写anchor=visit、anchorOccurrence=first。

## 5. 信息与数据结构

5日期+4等级+6事件选项=15。六事件名称：首次到店、最近一次到店、首次购买、最近一次购买、首次划扣、最近一次划扣。原appointment显示预约日期。事件解析/首次最近/未知/未来/自然日差继续继承1.3.0，不改计算。

## 6. 交互实现

选中事件复合项同时回填类型和次数，取消独立“事件取值”控件。等级仍显示人工/AI来源，初次进入等级默认人工，等级内切换保留来源。返回日期清理无关参数。合法旧事件配对正确回显；缺失或非法次数显示请选择有效基准，保留原数据和错误，显式选择正确复合项后才修复。保存/取消/写失败与节点复制语义保持。

## 7. Mock 方案

不改1.3.0合成fixtures。旧配置与新选择都使用相同模型和配对，不发真实请求，不新增客户数据。

## 8. 验证计划

独立focused Chrome检查六tenant15选项、无事件二级控件、六个配对保存刷新及旧配对不迁写、坏次数显式修复、等级来源回归、正常下拉滚动与1120窄窗。使用隔离QA context。结果写checks/v1.3.1/，不覆盖旧证据；模型源码未变，不重跑无关79项。另执行JS语法、diff检查、SPEC和Plan校验。

## 9. 风险与回退

底层ID/存储键不变且不进行读取迁移；无效旧次数不可自动猜测。失败保留已存规则，取消保留旧pair。history/1.3.0保留旧合同；上一轮未提交产品差异继续保留，不git reset。

## 10. 预览计划

复用8148服务，Chrome打开现有深圳shell回访规则页面；六tenant共享已验证UI。截图展示正常滚动上/下与窄窗，不用改变高度或隐藏元素取得截图。

## 11. 当前发布授权与交付计划

E029已授权完整推送。沿用原型仓master，补齐当前文档与Source Convergence，生成并验证真实file://单文件和综合自检，公开数据审计通过后冻结docs/sdd/SPEC-SUIYIN-ADMIN-071/1.3.1及release.json，再commit/push master及独立tag。通过GH CLI回读分支/tag/SDD正文及发布清单，确认ahead=0，检查对应提交的Cloudflare部署；最后只向SCRUM发送交付通知并回读。未要求工程交付，不建Issue/Handoff/Test Contract，不更新进度表，不改生产仓。
