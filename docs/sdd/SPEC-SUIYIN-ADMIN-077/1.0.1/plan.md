---
plan_for: SPEC-SUIYIN-ADMIN-077
spec_version: 1.0.1
status: approved
artifact_class: static-html
exception_status: not-required
exception_approved_by: none
exception_approved_at: none
operational_profile: none
last_updated: 2026-09-30
---

# Prototype Plan — 咨询术语与岗位角色

## 1. Constitution Check

用户结果、来源区分、租户隔离、状态覆盖、生产边界和精确依赖均PASS；依据077@1.0.1（行为继承1.0.0）及房总2026-09-30“执行”。

## 2. Artifact Boundary

static-html：仅现有HTML/JS/CSS和静态JSON、本地浏览器存储。无认证、服务端业务API、共享持久化、数据库、migration或正式在线入口。例外not-required，Operational Profile none。不进入任何Flutter/React/Go生产仓。

## 3. 复用地图

复用admin-account-profile.js的租户能力、现有Admin表格/表单/多选和菜单模型。术语只在系统展示处转换，保留源字段和路由身份；角色值单独兼容。

## 4. 文件与路由

| 文件 | 动作 | 规则 |
|---|---|---|
| prototype/admin-account-profile.js | 八租户术语投影和角色配置 | R001 R003 |
| prototype/admin-content.js | 通用表头/表单/提示、角色兼容、严格保存及待采展示 | R002 R003 R004 R005 |
| prototype/admin-navigation.js、admin-menu-tree.js | 导航/页签/菜单显示术语，原始身份保持 | R001 R002 |
| prototype/admin-sales-usage.js、admin-sales-voice-stats.js、admin-ai-stats-aligned.js、admin-sales-dashboard.js | 统计UI及导出人员称谓 | R002 |
| prototype/admin-chat.js、admin-extra-flows.js、admin-expanded-flows.js、admin-revisit-rules.js、admin-domain-views.js及相关现有展示模块 | 跨页咨询称谓，保留字段匹配与自由文本 | R002 R005 |
| 本目录验证记录 | 浏览器矩阵、角色保存与失败、截图 | R001–R005 |

## 5. 信息结构

账号入口继续碎银账号；当前布局和操作位置保持。旧销售角色默认回填线上咨询，新增两岗位沿用当前角色多选；其他角色保持。两新租户继续待采，不新增伪造账号；展示明确已批准的岗位定义。

## 6. 交互实现

所有显示用词不改变字段key、查询、统计和自由文本；角色打开只在内存兼容，不自动写存储。保存校验沿用，严格本地写入成功后关闭并刷新；失败恢复旧model并保留弹窗草稿。取消不写。各tenant隔离。

## 7. Mock 方案

沿用本租户静态脱敏数据，不把参考角色目录当真实权限。新三岗位为用户批准的原型配置，不新增权限矩阵；未知角色和两新租户待采边界保留。

## 8. 验证计划

八目标和九对照tenant名称/角色矩阵；截图所示弹窗；角色新增编辑多选、取消、刷新、旧缓存和存储失败；代表性统计/聊天/菜单/导出；不改自由文本。只运行与改动相关的浏览器回归，保存完整Shell截图。

## 9. 风险与回退

不对数据全局替换“销售”，避免人员名字和商品指标变义。字段身份保持原值，展示层转换。保存失败恢复model和历史。QA使用独立浏览器和qa存储命名空间，不覆盖用户已有原型状态。

## 10. 预览计划

复用5200静态服务，Google Chrome打开深圳账号编辑及新租户待采页。初次日常阶段止于本地迭代；现已获完整推送授权，生成_inline并验证后随076发布，远端commit/tag回读留证。
