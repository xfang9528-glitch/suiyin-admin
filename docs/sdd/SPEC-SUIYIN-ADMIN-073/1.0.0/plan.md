---
plan_for: SPEC-SUIYIN-ADMIN-073
spec_version: 1.0.0
status: approved
artifact_class: static-html
exception_status: not-required
exception_approved_by: none
exception_approved_at: none
operational_profile: none
last_updated: 2026-09-29
---

# Prototype Plan — 工具管理与辅助线管理

## 1. Constitution Check

| 原则 | 结论 | 证据 / 例外理由 |
|---|---|---|
| 用户结果优先 | PASS | 客户自行维护辅助线 |
| 事实与推断分离 | PASS | 现有目录与各店未采生产清单区分 |
| 逻辑先于界面 | PASS | 073@1.0.0已由房总“执行”批准 |
| 状态完整 | PASS | 草稿、保存、失败、清空、取消和隔离 |
| 平台与租户边界 | PASS | 全租户话术、所有艺星辅助线 |
| 真实能力承诺 | PASS | 仅本地保存与预览 |
| 运行类型与生产隔离 | PASS | 静态HTML目录内实施 |
| 精确依赖与证据闭环 | PASS | 051/060/068/030精确版本，11条验收 |

## 2. Artifact Boundary

- **运行类型**：static-html。
- **为什么**：HTML/CSS/JavaScript、静态目录、轻量本地图片及浏览器本地演示状态。
- **有状态信号**：无；不接入真实账户、远程业务接口或共享存储。
- **例外**：not-required。
- **Operational Profile**：none。
- **生产边界**：不进入Flutter、React、Go生产仓；不执行真实上传、迁移或PC同步。

## 3. 复用地图

| 类型 | 复用对象 | 路径 / 组件 | 复用理由 | 需要调整 |
|---|---|---|---|---|
| HTML | Admin壳与内容 | _shell.html / admin-content.html | 现有导航与弹层通信 | 注册新页面，离开草稿保护 |
| Token | Admin样式 | admin-content.css / admin-live-ui.css | 保持已对齐的控件 | 专用辅助线样式 |
| Component | 菜单树与状态 | admin-menu-state.js / admin-menu-tree.js | 同一有效树 | 原位置替换父级与旧状态接续 |
| Mock | PC医美目录 | assets/yestar-medical-tools/catalog.json | 真实分类和透明图 | 轻量副本；来源未知明确演示 |

## 4. 文件与路由

所有下列文件均位于 `E:/AI 项目/佰智德三/碎银原型/suiyin-admin/prototype/`。

| 文件 | 路由 / 页面 | 动作 | 对应规则 |
|---|---|---|---|
| admin-menu-state.js、admin-menu-tree.js、data/navigation-snapshot.json、data/content/*.json | menu / allMenu / languageManage | 工具父级、辅助线子级及旧本地状态兼容 | R001 R002 R003 |
| admin-navigation.js、_shell.html | Shell | 草稿离开与跨页消息，保持原有导航 | R002 R008 |
| admin-content.html、admin-content.js、admin-domain-views.js | guideLineManage | 专用模块接入与非适用页面反馈 | R003 R010 R011 |
| admin-guide-lines-model.js、data/guide-lines.js、assets/guide-lines/* | 本地辅助线数据 | 初始化、校验、保存及轻量素材 | R003 R004 R006 R007 R008 |
| admin-guide-lines.js、admin-guide-lines.css | 辅助线管理 | 分类区、图片网格、编辑、上传、保存及错误 | R004 R005 R006 R007 R008 R010 |
| admin-guide-lines-preview.js、admin-guide-lines-preview.css | PC效果预览 | 分类缩略图、插入与对象变换 | R009 R010 R011 |

## 5. 信息结构

复用既有白色后台：顶部标题与简短本地演示说明，左侧分类，右侧图片网格；新增分类、批量添加、保存更改、预览PC效果。来源标签用于管理识别，默认内容全部可编辑。长列表在所属区滚动，不增加无关统计卡。

## 6. 交互实现

| 触发 | 默认态 | 进行中 | 成功 | 失败 | 取消 / 重试 | 规则 |
|---|---|---|---|---|---|---|
| 分类/图片增删改 | 已存配置 | 编辑草稿 | 草稿标记 | 字段提示 | 单项取消保持旧草稿 | R004 R005 R006 |
| 批量PNG选择 | 当前分类 | 每项处理 | 轻量图待保存 | 格式/大小/解码原因 | 重选/重试/移除 | R007 |
| 保存 | 未保存更改 | 禁用重复提交 | 本地保存、草稿清除 | 保留草稿和原版本 | 重试 | R008 |
| 应用内离开 | 草稿存在 | 三选项对话框 | 保存或放弃后离开 | 保存失败留页 | 继续编辑 | R008 |
| PC预览 | 当前有效分类 | 图片加载 | 插入、拖动、缩放、旋转 | 素材错误提示 | 关闭恢复管理页 | R009 |

## 7. Mock 方案

本地030目录16类129条作为可核验初始演示来源，生成适合浏览器的透明轻量图；不把52MiB整套原图复制进Admin。各艺星按独立身份初始化；不伪造某店最新专属素材。新上传仅在浏览器解码和生成预览，10MiB示例上限；保存失败如实反馈。

## 8. 验证计划

| 验收 ID | 操作路径 | 预期 | 视觉检查 |
|---|---|---|---|
| AC-R001-01 / AC-R002-01 | 15租户导航、menu、平台、旧话术状态 | 原位置和唯一入口，隐藏/顺序兼容 | 话术页布局保持 |
| AC-R003-01 / AC-R004-01 | 六艺星、九非艺星、旧/新本地配置 | 隔离、不丢初始样例 | 来源提示清楚 |
| AC-R005-01 / AC-R006-01 | 分类和图片CRUD、替换与清空 | 保存后刷新一致，引用隔离 | 网格/确认可用 |
| AC-R007-01 / AC-R008-01 | 混合上传、移除、存储失败、离开 | 幂等和草稿恢复 | 异常与三选项 |
| AC-R009-01 / AC-R010-01 / AC-R011-01 | 预览对象操作、1280×720 | 无横向溢出，反馈真实 | Chrome截图及实际操作 |

## 9. 风险与回退

菜单旧覆盖与来源初始化分别处理；不清空用户已有话术或其他菜单状态。原型失败保留旧已存版本。PC预览仅本地，不写正式工具库；当前已保存为空不被默认数据覆盖。

## 10. 预览计划

- 复用本地Node静态服务 `http://127.0.0.1:8134`。
- Google Chrome打开 `prototype/_shell.html?tenant=yestar-sz&page=guideLineManage`。
- 检查默认分类、编辑/替换、上传失败、PC预览和工具下话术入口。
- 实施阶段不发布；房总2026-09-29另行授权完整推送，交付将补齐inline、文档、远端SDD及Admin Issue #442。
