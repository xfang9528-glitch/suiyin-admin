# 碎银管理后台 设计规范

## 主题色
| 名称 | 色值 | 用途 |
|------|------|------|
| 微信绿（主色） | `#07c160` | 按钮、选中态、链接、左边条 |
| 微信绿深 | `#06ad56` | hover 态 |
| 微信绿浅 | `#e8f6ee` | 选中背景、Tag背景 |
| 文字主色 | `#1a1a1a` | 标题、正文 |
| 文字次色 | `#4a5564` | 说明文字 |
| 文字辅助 | `#8a96a3` | 提示、标签 |
| 文字灰 | `#6b7684` | 次要信息 |
| 边框色 | `#d0d7de` | 输入框、卡片边框 |
| 背景色 | `#f5f7fa` | 页面背景 |
| 分割线 | `#f0f2f5` | 表格行底、卡片内分割 |

## 状态色
| 状态 | 色值 | 背景 |
|------|------|------|
| 在线 | `#07c160` | — |
| 忙碌 | `#f59e0b` | — |
| 离线 | `#d0d7de` | — |
| 超级管理员 | `#dc2626` | `#fee2e2` |
| 管理员 | `#d97706` | `#fef3c7` |
| 销售 | `#07c160` | `#e8f6ee` |

## 字体
```
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif;
```

## 尺寸规范
| 元素 | 尺寸 |
|------|------|
| Header 高度 | 48px（React）/ 56px（HTML） |
| 侧边栏宽度 | 200px |
| Tab 栏高度 | 40px |
| 圆角 | 6px（默认）/ 8px（卡片）/ 22px（登录按钮） |
| 表格行高 | small（Ant Design） |

## 组件规范

### 分类Tab下拉按钮（好友列表）
- 外观：32px 高，灰色边框按钮，带下拉箭头
- 选中态：绿色背景 + 白字
- hover：边框变绿 + 文字变绿
- 弹窗：Popover，最小宽度 480px，圆角 8px，阴影 `0 6px 28px rgba(0,0,0,0.14)`

### 分类统计卡片（好友列表 Popover 内）
- 默认：白底 + 灰边框，居中排列
- hover/选中：绿色边框 + 浅绿背景
- 内容：分类名（12px）+ 数字（16px 加粗）
- 顶部「全部好友」卡片：大号（22px数字），绿色边框 2px，选中时右下角绿色勾

### 筛选栏
- Card 容器，padding 12px 16px
- 各筛选项横排 flex wrap
- 搜索框带 SearchOutlined 前缀图标

### 数据表格
- Ant Design Table size="small"
- 支持行选择 checkbox
- 操作列固定右侧
- 底部分页器 + 批量操作栏
- **分页器定位**：`position:sticky; bottom:0`，白底，始终固定在内容区底部右侧
- **横向滚动**：外层 `.table-wrap` 设 `overflow-x:auto`，表格设 `min-width`（好友列表 `1200px`、销售管理 `960px`），列不压缩不换行
- **列对齐**：数值列、比率列、操作列的表头与单元格统一**居中**（`.col-c { text-align:center }`，含 `.ratio-cell / .pct-strong / .pct-soft` 配合 `justify-content:center`）；文本列（账号/部门/标签）保持左对齐。stats_invite / stats_script 已落地

---

## v1.1 公众号风格切换（2026-05-06）

参照微信公众号后台的"白底克制"视觉，整体风格从"实心绿头"切到"白头 + 微信绿点缀"。

### Header（白底版）
| 元素 | 之前（实心绿） | 现在（公众号风格） |
|---|---|---|
| 背景 | `#07c160` | `#fff` + 1px 灰底边线 |
| Logo | 白色 ☁ on 绿底 | **绿色 ◉**（仅图标染色） |
| 品牌名 | 白字 600 16px | 黑字 `#1a1a1a` 600 15px |
| "管理后台"标签 | 半透明白底 + 白字 | 浅绿底 `#e8f6ee` + 微信绿字 |
| 用户头像 | 白底绿字（在绿头上）| 绿底白字（在白头上）28px |
| 通知图标 | 白色 🔔 | 灰色 🔔 + **右上角红点徽章**（数字+1.5px 白色描边）|

### 左侧菜单
- 激活背景：从 `#e8f6ee` → **`#f5fbf7`**（更浅，让左边条更显眼）
- 左边条 3px 微信绿（保留）
- 字体粗细 500（保留）
- padding：11px → **10px**（紧凑）

### Chrome Tab
- 背景：`#eef1f5` → **`#fafbfc`**（极浅灰）
- 激活态：白底 + **顶部 2px 绿色条** + 微信绿字
- 圆角：8px → 6px

### 按钮系统（克制）
| 类型 | 用途 | 样式 |
|---|---|---|
| `.btn` 默认 | 次要操作（查询/重置/导出）| 白底 + 浅灰边 `#e5e8ec` + 灰字，hover 变绿 |
| `.btn.primary` | 关键动作（创建/添加/确认）| 实心微信绿 + 白字 + 字重 500 |
| `.btn.ghost` | 次级强调（少用） | 白底 + 浅绿边 `#c8e6d2` + 绿字 |
| `.btn.link` | 文字链接 | 公众号蓝 `#576b95`，无边无背景 |
| `.btn.sm` | 紧凑场景（快捷日期）| 高 26px，字号 12px |

**通用尺寸**：高 30px / 字号 12.5px / padding 0 12px / 圆角 3px（之前是 32 / 13 / 14 / 4，现在更紧凑）

### 状态徽章（公众号配色）
| 类型 | 之前（鲜艳）| 现在（柔和饱和）| 用途 |
|---|---|---|---|
| 默认 | `#e8f6ee` + `#07c160` | `#f5fbf7` + `#07c160` | 已通过/在线 |
| `.gray` | `#f0f2f5` + `#8a96a3` | `#f7f8fa` + `#8a96a3` | 已下架/未操作 |
| `.warn` | `#fff5e8` + `#f59e0b` | **`#fff8f0` + `#d99a3d`** | 待审核/部分失败 |
| `.danger` | `#ffeded` + `#f56c6c` | **`#fef0f0` + `#fa5151`** | 失败/驳回（公众号红）|
| `.info` | `#e6f0ff` + `#3370ff` | **`#f0f4fa` + `#576b95`** | 执行中/系统（公众号蓝）|
| `.purple` | `#f3ebff` + `#8e44ad` | `#f6f1fa` + `#8e6cb0` | 专家角色 |

### 行操作（row-action）
- 默认色：从 `#3370ff` → **`#576b95`**（公众号蓝）
- danger 色：从 `#f56c6c` → **`#fa5151`**（公众号红）
- padding：4px 8px → **3px 6px**（更紧凑）

### 通用编辑弹窗（_edit_modal.js）
- 默认 560px 宽，复杂场景 720-1080px
- header 16px 标题 + ✕ 关闭
- body padding 20px，max-height 60vh + 内滚
- footer 浅灰 `#fafbfc` 分割 + 取消（默认 btn）+ 确认（primary btn）
- 必填字段 label 前 `*` 红色
- 字段类型：text / number / select / textarea / switch / radio / tags / image / rich-text

### 只读明细弹窗（房总 2026-05-07 拍）
- **不带 footer**，关闭走右上 ✕ 或点遮罩；footer 上单独"关闭"按钮属冗余
- 适用：纯展示型（话术统计明细、群邀请提及率明细等）
- 不适用：表单提交型（保留取消+确认 footer）
- 若需内嵌分页器，分页器条直接接在 body 后作为 modal 的视觉收尾

### 联动开关 + 固定说明（.em-fixed-row / .em-fixed-hint）· 表单字段通用
- 形态：开关 switch 在左、灰色说明文字在右，横向 flex 排列；说明用于告知员工"该项参数本期写死、不可自选"
- 说明文字 12px `var(--text-3)`，关键参数（时间段/阈值）用 `<b>` 加深到 `var(--text-2)` 强调
- **联动开关组**：两个语义绑定的开关共用一组联动监听，操作任一另一个自动跟随同步；外层列表两列状态永远一致
- 使用约束：仅当后端能力固定无法配置时使用；一旦后端开放配置，应升级为对应输入控件
- 首例：`ai_prompt_v1.0.html` 的「定时启动」「发起规则」（房总 2026-05-13 定，互为联动）

### 多选下拉框（.msd-trigger / .msd-panel）· 表单字段通用
- 形态：单行输入框样式的触发器，点击展开下拉面板（绝对定位）；面板内为 checkbox 选项列表
- trigger 高 34px，placeholder「请选择」灰字；已选时顿号「、」拼接选中项的文本展示
- panel：`top:38px; left:0; right:0; max-height:260px; overflow-y:auto`，点击外部关闭
- 箭头展开 / 收起带 transform: rotate(180deg) 过渡
- 适用：表单弹窗里需要多选且选项 ≤ 10 的场景（区别于 chip 风格的「多选筛选 chip」用于顶部筛选栏）
- 首例：`ai_prompt_v1.0.html` 的「自动填写的标签」字段（标签分析场景下显示，5 选项）

### 微信号级联选择器（.wx-picker / .wx-panel）· 统计页筛选栏通用
- 形态：筛选栏内 trigger（高 30px，placeholder「请选择」灰字）→ 点击展开两列级联面板；区别于 `.msd` 单列多选——这是**部门→账号两级**结构，适合选项很多（百级账号）的场景
- 面板：`position: fixed`（**必须 fixed**，否则被 `.filter-bar` 的 `overflow:auto` 裁掉），按 trigger 的 getBoundingClientRect 定位，z-index 1200；带指向 trigger 的三角（`--arrow-left` 动态对齐），右缘防溢出钳制
- 左列分组（部门），每组带 checkbox 支持全选 / 半选（partial）态；右列为当前组账号，逐个 checkbox 多选；顶部搜索框按账号名即时过滤右列
- 底部 foot：「已选 N 个微信号 + 清空 + 确定」；草稿态（wxDraft）确定后才落到 wxChecked，触发框显示「首个账号 +N」绿色角标
- 数据源：mock-data.js 的 `SALES_ACCOUNTS`，按 `dept` 分组（非 window 全局，用 `typeof` 取 const 全局）
- 首例：拉新记录 `stats_referral_v1.0.html`（2026-06-16）

### 多选筛选 chip（.chip）· 统计页通用
- 容器：`height:30px; padding:0 12px; border-radius:15px`（圆角胶囊）
- 默认态：白底灰边灰字，hover 变绿边
- 激活态：浅绿背景 `#e8f6ee` + 微信绿边 + 微信绿字 + 加粗 + 前置 ✓
- 至少保留 1 个激活；点击最后一个会被 toast 拦截
- 首例：群邀请提及率 `stats_invite_v1.0.html`（3 个目标群多选）

### Modal 内分页器（.modal-pager）
- 与主页面分页器统一：`共 N 条 | [20/50/100] 条/页 | ‹ 1 2 3 ›`
- 上边框 `1px solid var(--border)` 与表格区分隔
- 双 tab 模式下，每个 tab 各自记忆当前页码（切 tab 不重置）
- 页码按钮采用 1+5+1 模式（首页 + 当前 ±2 + 末页 + 省略号）
- **避坑**：项目共享的 `.pager` 基类是 `position:fixed; bottom:0`，modal 里要在 `.modal-pager` 显式覆盖回 `position:static`，否则会跑到视窗底部
- **弹窗布局**：`.modal` 改 `display:flex; flex-direction:column; max-height:88vh`，列表 wrap `flex:1 1 auto; min-height:0` 可伸缩，pager `flex:0 0 auto` 锁底
- 仅页码翻页，**不放跳页输入**（外层表格分页器同此约定，1-N 页都直接点）
- 首例：群邀请提及率明细 modal、话术统计明细 modal

### 类目路径展示（.cat-path） · 统计明细通用
- 形式：`二级：三级：四级`，全角冒号 `：` 作为分隔符（避免和大类名内部的 `/` 混淆）
- 颜色层次：`l2` 主色 + 加粗、`l3` 次色、`l4` 辅助色；`：` 分隔符用辅助色
- 缺级时省略对应段（无 `l3` 时只展示 `l2`，无 `l4` 时只展示 `l2：l3`）
- 不展示一级（`l1` = 公共/私有/收藏/常用，是话术库 tab）；不展示具体内容（`l5` = 单条消息）
- 首例：话术统计 `stats_script_v1.0.html`

### 口径说明气泡（.scope-pop）· 浮窗避坑
- 父容器 `.filter-bar` 是 `position:fixed; overflow-x:auto`，内部用 `position:absolute` 的浮窗会被裁掉
- 解法：浮窗用 `position:fixed; right:16px; top:56px`（top 取 filter-bar 高度），脱离父级
- `z-index` 至少 200，避免被表格内容覆盖
- 首例：话术统计 `stats_script_v1.0.html`

### 维度切换段（.seg） · 统计页通用
- 容器：`border:1px solid #e5e8ec; border-radius:3px; height:30px; overflow:hidden`
- 内按钮间用 1px 分隔线区隔，激活态填充 **微信绿** 文字白色
- 适用场景：表格视图维度切换（如「按销售账号 / 按部门」），同段内最多 4 个选项
- 首例：话术统计 `stats_script_v1.0.html`

### 使用率/比率条形（.ratio-cell）
- 表格内嵌横条 + 数值，`max-width:90px` 横条 + 6px 高 + 微信绿填充
- 数值后缀单位（如「2.00 条/人」），不显示百分号，避免与百分比混淆
- 用于「派生指标」列，纯数字无需此格式
- 首例：话术统计 `stats_script_v1.0.html`

### AI 等级胶囊（.ai-pill） · 跨页通用（2026-05-25）
- 用途：展示 AI 自动判定的客户等级（DR-027 状态机：客户/A/B/C/D；销售不可手填）
- 外观：`padding:2px 10px; border-radius:12px; font-size:12px; font-weight:600; color:#fff`
- 颜色映射（对齐 PC 端 `_AI_GRADE_COLOR`）：
  | 等级 | 背景色 | 含义 |
  |---|---|---|
  | 客户 | `#07c160` | 未聊够 5 句，AI 未判定 |
  | A | `#e74c3c` | 高意向 |
  | B | `#e67e22` | 中意向 |
  | C | `#3498db` | 低意向 |
  | D | `#95a5a6` | 沉睡 |
- AI 小标：胶囊内右上半透明白底圆角小字 `AI`（`font-size:9px; background:rgba(255,255,255,0.28)`），表明非人工判定
- 首例：群发统计 → 回复列表 `stats_mass_v1.0.html`

### 第一需求胶囊（.need-pill） · AI 标注通用（2026-05-25）
- 用途：展示 AI 识别的客户第一需求（取自 PC 端 17 项 `demandOptions`）
- 外观：`padding:1px 8px; border-radius:10px; font-size:11.5px; background:#f0f4fa; color:#576b95`（公众号蓝）
- AI 小标：右侧 `AI` 圆角小字，背景 `rgba(87,107,149,0.18)`，与等级胶囊视觉一致
- 空态：AI 未识别出明确需求显 `—`（灰色 `var(--text-3)`）

### 顶栏企业切换器（用户下拉内）· 2026-06-18
- 位置：顶栏「房昕」用户下拉菜单内（头部 房昕/超级管理员 → 「切换企业」标签 + 企业列表 → 分隔线 → 退出登录），不单独占顶栏 pill
- 显隐：仅多租户权限显示（`ENTERPRISES.length > 1`），单租户隐藏整段
- 列表项：左侧灰点 + 企业名 + （当前项）绿底高亮 + 绿色「当前」tag；列表 `max-height:260px` 超出滚动
- 点菜单内部不关闭（`stopPropagation`），点外部关闭；切换后更新顶栏品牌名 + toast
- 企业列表与 PC / APP 原型同源（见 [tenant-id-registry]）

### CRM 多维筛选（.bc-fp-filters）· 好友列表（艺星）· 2026-06-18
- 直接 1:1 复用 PC 端 suiyin-pc-chat 群发选好友·第一步的 `bc-fp-*` 组件（DOM/CSS/JS 整体搬运），保证三端同款
- 4 列网格；`.collapsed` 时仅显前 8 项（`:nth-child(n+9)` 隐藏），展开看全部 21 维
- 子控件：`.bc-fp-sel`（自定义单/多选，多选展示标签 + `+N`）、`.bc-fp-cascader-input`（地区省/市/区三列级联 + 所在账号渠道/人设号两列级联，含搜索/全选/Shift 区间）、`.bc-fp-date-trigger`（日期，admin 无 wxDatePicker → 退化原生 date input）
- 收起/展开切换 + 重置 / 搜索按钮
- 因筛选高度可变，承载页改自然流式布局（非固定定位）

### 即输即建组合框（.grp-combo）· 通用 · 2026-06-18
- 逻辑沿用 PC 端 DR-028「话术名称组合框」：输入框 + 可筛选下拉，输入关键字过滤已有项；**无完全匹配时末尾出现绿色「＋ 创建「X」」**，点击即输即建
- 触发器为普通输入框，下拉 `position:absolute` 挂在 `.grp-combo` 内（弹窗里需把 `.modal-body` 改 `overflow:visible` 防裁切）
- 失焦延时关闭（150ms），候选用 `onmousedown + preventDefault` 抢在 blur 前选中
- 首例：好友列表「批量分组」弹窗（分组名录入）

### 可拖动 + 四边四角缩放弹窗（.grp-rsz）· 2026-06-18
- 沿用 PC 端 DR-050「带标题栏浮窗统一拖动 + 四边四角缩放」：弹窗 `position:fixed`，打开时设默认大尺寸并居中（首例批量分组 720×520）
- 标题栏 `cursor:move` 拖动整窗（点关闭 × 不触发拖动）；8 个手柄（n/s/w/e 四边 + nw/ne/sw/se 四角）按方向改 left/top/width/height，最小 420×300
- 承载 `.modal` 改 `display:flex; flex-direction:column`，body `flex:1; overflow:visible`（组合框下拉不被裁），footer 锁底
- 首例：好友列表「批量分组」弹窗

### 列表「微信昵称」列显示规则（DR-057）· 2026-06-18
- 有备注 → 显示备注名；无备注 → 显示原微信昵称；都没有 → 「(未命名)」
- 有备注时主名下加 `.user-sub` 灰字副行「昵称：{原微信昵称}」（原昵称为空则不加）
- 首例：好友列表 `friend_list_v1.0.html`（艺星）

### 总原则
> "微信绿"是品牌色，但用法克制：只在主按钮、激活态、关键徽章、logo 出现。
> 大面积留白 + 灰阶层次 + 公众号蓝 / 红做次要强调。
