# 管理后台交互流程

更新：2026-09-20。静态原型共 15 租户、765 入口、85 路由；合同为 051@1.1.0、052@1.2.0、053@1.0.2、054@1.0.0、055@1.1.0、056@1.0.0、058@1.2.0，见 [合同入口](../README.md)。以下流程均不写真实后台。

## 入口、租户与证据

```mermaid
flowchart TD
    Start[打开 Shell 或生成的单文件] --> Tenant{登记租户且页面可见}
    Tenant -->|否| Denied[提示选择租户或无查看权限]
    Tenant -->|是| Config[读取本租户菜单和本地覆盖]
    Config --> Route[按稳定路由打开领域页面]
    Route --> Load{静态样本读取}
    Load -->|失败| Retry[说明错误并提供重试]
    Retry --> Route
    Load -->|成功| Source{样本性质}
    Source --> Captured[本租户采样 标注采集时间与状态]
    Source --> Reference[参考样本 标注参考租户]
    Source --> Mock[合成演示 明确不是业务实况]
    Source --> Missing[未采集 不填零或借用人员]
    Captured --> Page[对应领域结构及可见来源说明]
    Reference --> Page
    Mock --> Page
    Missing --> Page
    Page --> Switch[切换租户 新开对应本地页面]
    Switch --> Config
```

原始快照中的加载中不能判成确认空态。新窗口被浏览器阻止时提供目标链接。参考内容不授权跨租户借入实体选项；销售使用统计和 AI辅助统计没有参考租户数据回退。四页默认视图依据 [本轮发布勘误](../docs/sdd/pixel-correction-20260920.md)。

## 查询与本地编辑

```mermaid
flowchart TD
    Page[按来源显示字段 控件和动作] --> Draft[修改筛选草稿]
    Draft --> Calendar[日期输入或日历选择]
    Calendar --> Cancel[Escape或外部点击 取消未完成选择]
    Cancel --> Draft
    Calendar --> Submit[按页面原动作搜索或执行筛选]
    Submit --> Valid{条件合法}
    Valid -->|否| Error[提示错误 保留上次结果]
    Valid -->|是| Coverage{有适用样本}
    Coverage -->|缺快照| NoSnapshot[说明所选范围没有样本]
    Coverage -->|有| Result[筛选后显示结果或真实空态]
    Result --> Tools[仅显示来源要求的分页 排序和选择]
    Page --> Edit[已采集表单或明确标记的本地演示表单]
    Edit --> Choice{取消或确认}
    Choice -->|取消| Page
    Choice -->|确认且校验通过| Save[只保存当前租户及路由的本地状态]
    Save --> Page
```

## 数据展示与菜单管理同步

```mermaid
flowchart TD
    New[数据展示新增二级菜单 DR-095] --> Register[同次登记全部适用租户菜单库存]
    Register --> Platform[存在平台定义时同步定义]
    Platform --> Identity[核对稳定身份 名称 路由 父级]
    Identity --> Existing[继承父级 显示 排序 权限边界]
    Existing --> Tree[完整菜单专用树]
    Tree --> Edit[编辑显示和排序 或查看记录]
    Edit --> Decision{取消或确认}
    Decision -->|取消| Tree
    Decision -->|确认| Local[保存本租户本地配置]
    Local --> Nav[同租户侧栏联动]
    Nav --> Check[入口可打开且菜单管理配置可读回]
    Tree --> Hidden[隐藏项仍留库存 可恢复]
```

平台父级级联阻止自身或后代形成循环；本地分配先展示差异和影响租户，再确认。删除指明对象与影响范围，取消不修改；不借此开放隐藏父菜单或改变真实权限。

## 销售变声统计

```mermaid
flowchart TD
    Entry[所有登记租户 销售变声统计] --> Permission{菜单及父级允许}
    Permission -->|否| Denied[无权限说明]
    Permission -->|是| Form[与使用统计一致的单日范围 日期 快捷日 部门及动作]
    Form --> Draft[模式及输入只修改草稿]
    Draft --> Search[校验后搜索]
    Form --> Quick[今天昨天前天 立即查询且保留当前模式]
    Quick --> Search
    Form --> Reset[重置单日今天 全部部门 默认排序并查询]
    Reset --> Search
    Draft --> Cancel[日历取消 不提交 保留已有结果]
    Search --> Tenant[仅当前租户授权范围的合成事件]
    Tenant --> Dedup[按独立任务选首次成功记录]
    Dedup --> Exclude[失败 试听 取消 重试和重复回调不另计]
    Exclude --> Time[按首次成功上海自然日筛选]
    Time --> Aggregate[发起销售稳定身份及事件部门汇总]
    Aggregate --> Result[次数表 零次数或无匹配分别表达]
    Result --> Sort[次数数值排序及分页]
    Result --> Export[导出全部筛选结果]
```

单日仅显示开始日；范围显示起止日，切回单日以开始日归并起止。日期和部门编辑、模式切换不提前查询；非法范围保留已有结果。多工作账号归属同一销售，消息发送是否成功不改变计数。读取错误显示重试，不能将失败显示为全员 0。两页筛选一致不混用数据：变声基于本租户合成事件的运行日，使用统计基于本租户快照日。

## 销售使用统计

```mermaid
flowchart TD
    Entry[销售使用统计] --> Model{本租户专用快照}
    Model -->|11租户未采集| Missing[明确未采集 无外租户回退]
    Model -->|4租户已采集| Draft[快照日期 单日或范围 本租户样本部门]
    Draft --> Search[搜索提交]
    Search --> Complete{日期有完整快照}
    Complete -->|否| NoSnapshot[所选日期尚无本地样本]
    Complete -->|是| Groups[销售组及部门明细]
    Groups --> Sort[按销售组汇总排序 组内不拆散]
    Sort --> Table[部门明细 小计 全表合计]
    Table --> Summary[使用人数 消息与好友合计]
    Table --> CSV[仅导出筛选明细 不重复小计总计]
```

萌爪采集为空与未采集不同。此页无通用分页、汇总卡或列设置；变声页保留其已批准分页，不机械照抄。

## 全表格滚动列标题

```mermaid
flowchart TD
    Render[普通统计菜单小表或弹窗表格生成] --> Head{存在表头及行列语义}
    Head -->|是| Observe[按当前表及所属滚动可见区域定位]
    Observe --> Scroll[纵向滚动超过表头原位置]
    Scroll --> Freeze[完整表头冻结在可见区域顶部]
    Freeze --> Horizontal[横向滚动 表头正文同步且同列对齐]
    Freeze --> End[到达本表末尾或表格退出]
    End --> Leave[表头随本表退出 不遮挡后续内容]
    Observe --> Change[查询分页树展开尺寸或路由变化]
    Change --> Render
    Head -->|否| Unchanged[保持原布局 不新增虚构表头]
```

多层表头整组冻结，保留原排序、选择和焦点操作；日历、下拉与弹窗不被表头覆盖。短表不增加行或强造滚动；该交互不改变业务结果和分页。

## 拉新、消息占比和 AI 统计的样本边界

```mermaid
flowchart TD
    Route[按本租户路由进入] --> Recruitment[深圳拉新 日期及三个下拉]
    Recruitment --> Observed{日期及条件有已采快照}
    Observed -->|是| Empty[确认空态 七列表头 全高白表和零条分页]
    Empty --> Export[允许导出七列表头 0数据行]
    Observed -->|否| Missing[说明缺少样本 隐藏分页并禁用导出]
    Route --> Message[消息占比 日期 微信号 排除群发]
    Message --> Coverage{所选条件有快照}
    Coverage -->|是| Chart[单卡片 总量 顶部图例 柱形及红色折线]
    Chart --> Inspect[切换图例 悬浮或键盘查看提示]
    Coverage -->|否| ChartMissing[不沿用未筛选总量]
    Route --> AI[AI统计 只读取本租户文件]
    AI --> Partial[完整或部分样本明确标记 不借其他租户]
    Partial --> AIFlow[按AI专用流程检查日期和部门分配完整性]
```

拉新确认空态只适用于深圳已保存的 09-18/09-20 默认条件；其他日期和筛选不推断。消息占比深圳数据窗口仍为 09-12 至 18，不把参考截图 09-14 至 20 的总量混入。AI 22 行为截图完整可见部分，部门拆分缺采不能归给首部门。详见 [AI 流程](ai-assisted-message-stats.md)。

## AI费用与分类趋势

「AI管理 → AI费用统计」仅复用13个已有父级，菜单隐藏与本地直链门禁一致。提交日期后，图表、五类四列表格及合计共用82天固定样本；指标与类别仅重绘趋势，模型来自查询记录快照。未知费用、部分值和缺日期各自表达，不补成零或完整实线。完整查询、计数费用与模型链路见 [费用交互流程](ai-cost-stats.md)，业务合同为 [058@1.2.0](../docs/sdd/SPEC-SUIYIN-ADMIN-058/1.2.0/spec.md)。

## 领域页面与缺证据状态

```mermaid
flowchart TD
    Route[选择领域路由] --> Chat[聊天按各自初态 销售接待先查询]
    Route --> Config[配置按原表单与确定操作]
    Route --> Dashboard[销售统计12指标及4排行]
    Dashboard --> ChartGap[8处图表缺明细 保留区域并说明]
    Route --> Friends[好友页恢复已采集入口和独立搜索]
    Friends --> ExpandGap[未采集展开或账号选项 明确提示]
    Route --> Scripts[话术搜索按按钮或Enter提交]
    Scripts --> TreeGap[层级不明 不伪造原站树]
```

## 验收分层

```mermaid
flowchart LR
    DOM[上一轮752入口DOM与租户来源检查] --> Structure[证明加载和指定结构]
    Flows[专项操作与数据断言] --> Behavior[证明对应静态交互和规则]
    Visual[同租户同视口真实浏览器对照] --> Pixels[仅证明实际观察页面视觉]
    Structure --> Report[分别报告范围 缺口及证据日期]
    Behavior --> Report
    Pixels --> Report
    Remote[提交标签远端与Pages回执] --> Delivery[证明发布版本 不证明视觉全量一致]
```

上一轮本地 Chrome 已盘点 752 个入口、665 张表格，实际滚动 333 个场景无冻结失败或脚本错误，另有筛选 8/8、冻结 22 项断言和独立 9/9 检查。上一轮保留四页独立本地 Chrome 截图、与用户实站截图同尺寸测量及交互检查；实站 Chrome 连接及访问授权尚未完成，在线复核仍有缺口。此发布保存当前迭代，不能用结构或发布回执宣称 752 入口逐像素一致。
