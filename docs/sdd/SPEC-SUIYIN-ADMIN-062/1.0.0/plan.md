---
plan_for: SPEC-SUIYIN-ADMIN-062
spec_version: 1.0.0
status: approved
artifact_class: static-html
exception_status: not-required
exception_approved_by: none
exception_approved_at: none
operational_profile: none
last_updated: 2026-09-21
---

# Prototype Plan — 预约记录组合图

## 1. Constitution Check
| 原则 | 结论 | 证据 / 例外理由 |
|---|---|---|
| 用户结果优先 | PASS | 预约总量和日期高峰可直接读取 |
| 事实与推断分离 | PASS | Q001/Q002由房总“按这个来”明确批准；样本与演示分开 |
| 逻辑先于界面 | PASS | SPEC 1.0.0 R001–R008先行 |
| 状态完整 | PASS | 空、失败、缺日期、部分采样和键盘提示 |
| 平台与租户边界 | PASS | 只在已有四租户预约记录入口启用 |
| 真实能力承诺 | PASS | 静态数据；完整演示不代表实时预约 |
| 运行类型与生产隔离 | PASS | 本地HTML/CSS/JS与JSON，无服务端业务 |
| 精确依赖与证据闭环 | PASS | 051@1.1.0、055@1.1.0；本轮校验和截图留存 |

## 2. Artifact Boundary
- **运行类型**：static-html。
- **为什么**：既有静态Shell，浏览器从同目录读取本地JSON；统计在内存完成。
- **有状态信号**：无；没有登录、服务端业务接口、共享持久化、数据库或迁移。
- **例外**：not-required。
- **Operational Profile**：none。
- **生产边界**：不进入Flutter、React、Go或其他生产仓；本次只实施已批准HTML原型。

## 3. 复用地图
| 类型 | 复用对象 | 路径 / 组件 | 复用理由 | 需要调整 |
|---|---|---|---|---|
| HTML | 内容页加载入口 | prototype/admin-content.html | 既有Shell内页 | 挂载预约专用JS/CSS |
| Token | 后台颜色和32px控件 | admin-live-ui.css、admin-content.css | 保持原页面风格 | 仅预约局部覆盖 |
| Component | 原筛选、日期、列表、详情、冻结 | Admin.filterPanel/renderResults/details、AdminFilterCalendars | 保留列与弹层 | 专用查询接管同批结果聚合 |
| Mock | 当前预约采样 | data/content/{tenant}.json | 来源透明 | 不改采样，另有固定完整演示数据 |

## 4. 文件与路由
| 文件 | 路由 / 页面 | 动作 | 对应规则 |
|---|---|---|---|
| prototype/admin-content.html | appointmentRecords | 仅加入局部资源引用 | R001/R008 |
| prototype/admin-appointment-chart.js | appointmentRecords | 新增聚合、筛选、视图与本地演示 | R001–R008 |
| prototype/admin-appointment-chart.css | appointmentRecords | 新增组合图、视图栏样式 | R001/R003/R006 |
| 当前SPEC目录下verification脚本和evidence | 本地验收 | 生成本轮检查与截图 | 全部AC |

保留已有 admin-content.js、admin-menu-tree.css/js、admin-navigation.js 未提交改动。2026-09-21 用户要求完整推送后，同步本功能 PRD、流程、设计规范和版本化 SDD；从已提交基线加本次文件生成 _shell_inline.html，不包含其他任务的未提交改动。生产实现仅创建独立 Issue 交陈宣宇。

## 5. 信息结构
- 原筛选区→列表/图表切换→单个总量+来源/应用范围→柱线图；列表保持原表与详情。
- 主操作：查询。次操作：重置、视图切换。日期提示仅解释数据，不下钻。
- 来源入口说明采样与完整合成演示；演示通过预览URL参数加载，不新增业务配置。

## 6. 交互实现
| 触发 | 默认态 | 进行中 | 成功 | 失败 | 取消 / 重试 | 规则 |
|---|---|---|---|---|---|---|
| 查询 | 筛选草稿 | 短暂忙态防重复 | 同步图表和全筛选列表 | 日期字段提示、旧结果保留 | 修正重查 | R004/R006 |
| 切图表 | 默认列表 | 无远端请求 | 同批结果可视化 | 缺来源明确提示 | 切回保留分页 | R001/R007 |
| 提示 | 隐藏 | 鼠标/键盘/触控定位 | 展示日期/两项数量 | N/A | Escape/失焦关闭 | R003 |

## 7. Mock 方案
| 数据集 | 表达的场景 | 关键字段 | 敏感信息处理 |
|---|---|---|---|
| 原样本 | 深圳20条部分明细；其他三租户参考 | 来源、日期、字段与稳定行键 | 沿用脱敏客户 |
| 完整演示 | 固定2026-09-01至2026-10-12；不同时点创建及预约 | tenant+id、预约时间、创建时间、当前部门 | 虚构客户/创建人/部门，显式标识 |
| 验收场景 | 2/0/3、重复键、缺日期、空、失败、权限 | 参数化本地场景 | 不访问真实数据 |

完整演示是独立数据集，只有明确演示参数时在内存替换当前列表；刷新普通URL恢复原样本。任何场景都不修改原采集JSON或真实记录。

## 8. 验证计划
| 验收 ID | 操作路径 | 预期 | 视觉检查 |
|---|---|---|---|
| AC-R001-01 | 列表/图表反复切换 | 条件、列表分页保留 | 按钮与表布局 |
| AC-R002-01、AC-R003-01、AC-R005-01 | 固定2/0/3和跨日去重集 | 总量5、累计2/2/5；单日一柱一点 | 双轴与提示 |
| AC-R004-01 | 两组日期+实体筛选、翻页 | 同一全匹配集 | 应用条件与草稿分开 |
| AC-R006-01/02 | 空、失败、缺日期、非法日期、长区间 | 区分状态、可恢复 | 无横向页面溢出 |
| AC-R007-01、AC-R008-01 | 原样本、参考租户、不同租户、无菜单 | 不编全量、不串数据 | 来源清楚 |

## 9. 风险与回退
- 局部AdminViews路由钩子，仅命中appointmentRecords；共享筛选和原表复用。
- 原样本缺当前部门时不猜部门归属；带该条件仅匹配已知值并说明覆盖限制。
- 回退移除新增两资源引用即可恢复原列表；保留其他未提交文件。
- 不承诺实时服务端统计或PDM结果。

## 10. 预览计划
- 本地服务：复用或启动仅127.0.0.1的静态服务，目标端口8134。
- Chrome目标：/prototype/_shell.html?tenant=yestar-sz&page=appointmentRecords&appointmentDemo=1&appointmentView=chart。
- 演示入口直接定位图表；普通入口仍默认列表。
- 展示默认图表、筛选、单日、列表和来源边界；保存截图与检查JSON。
