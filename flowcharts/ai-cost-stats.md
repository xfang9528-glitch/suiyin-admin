# AI费用统计交互流程

更新：2026-09-20。合同为 [SPEC-SUIYIN-ADMIN-058@1.2.0](../docs/sdd/SPEC-SUIYIN-ADMIN-058/1.2.0/spec.md)。日期、计次、金额、分类趋势与专属模型沿用同一合同；所有节点均为本地静态演示。

## 入口与统一日期查询

```mermaid
flowchart TD
    Entry[AI管理 AI费用统计] --> Permission{本租户有父级且页面可见}
    Permission -->|否| Denied[无查看权限 不显示统计]
    Permission -->|是| Today[默认上海今天 单日模式]
    Today --> Draft[编辑日期或单日范围草稿]
    Draft --> Cancel[取消未完成日历选择 保持查询]
    Draft --> Search[搜索 或快捷日立即查询]
    Search --> Valid{完整有效且起止顺序正确}
    Valid -->|否| Invalid[提示日期错误 保留原查询]
    Valid -->|是| Load[提交日期 禁用重复操作]
    Load --> Result{加载结果}
    Result -->|失败| Error[独立错误 不保留旧金额]
    Error --> Retry[原已应用日期重试]
    Retry --> Load
    Result -->|成功| Coverage{所选日期样本覆盖}
    Coverage -->|无| Missing[无本地演示样本 不补零]
    Coverage -->|部分| Partial[标明已覆盖部分与缺失日期]
    Coverage -->|完整| Complete[完整日期结果]
    Partial --> Render[同一结果更新四列表格 合计 趋势]
    Complete --> Render
    Render --> Reset[重置 今天单日 次数 全部已列项目]
    Reset --> Load
```

固定样本为 2026-07-01 至 2026-09-20，共 82 天；默认日期与重置取上海今天，覆盖外不自动外推。取消不提交，非法查询不覆盖旧结果。

## 次数、费用与模型各自取证

```mermaid
flowchart TD
    Records[当前租户固定合成记录] --> Tasks[全记录按业务任务首次成功去重]
    Tasks --> CountDate[按首次成功自然日筛选次数]
    Records --> Charges[独立费用记录去重与分类]
    Charges --> FeeDate[按客户费用发生日筛选]
    FeeDate --> Known{客户金额及币种已确认}
    Known -->|否| Pending[费用待确认 不补零或成本代替]
    Known -->|是| Money[整数微元汇总 按元展示]
    Records --> Models[读取本批记录保存的模型名称]
    Models --> ModelState{模型信息是否完整}
    ModelState -->|完整| Named[显示记录模型]
    ModelState -->|多种| Multi[并列模型]
    ModelState -->|缺失| Unknown[保留已知与模型待确认]
    ModelState -->|无调用| Config[演示配置及无调用或未启用]
    CountDate --> Rows[项目 专属模型 分析次数 费用]
    Pending --> Rows
    Money --> Rows
    Named --> Rows
    Multi --> Rows
    Unknown --> Rows
    Config --> Rows
    Rows --> Total{金额 项目归类 日期全部完整}
    Total -->|是| Full[完整合计]
    Total -->|否| Labeled[已列或已确认费用 加缺口说明]
```

同任务重试不增加成功分析次数；失败有已确认费用时金额仍保留，跨日费用不随成功次数搬日。当前配置不倒灌历史调用，一个模型服务多个项目不重复计费。模型版本缺失不编造。

## 分类趋势与表格的边界

```mermaid
flowchart TD
    Applied[已提交日期 同一批记录] --> Table[五项目四列表格及合计]
    Applied --> Choice[图表选择次数或费用 全部或单类]
    Choice --> Daily[按上海自然日建立日期点]
    Daily --> Kind{该日期指标状态}
    Kind -->|完整含零| Solid[完整点 仅连接相邻完整自然日]
    Kind -->|部分已知| Hollow[孤立空心点 说明已确认部分]
    Kind -->|未知缺样本或未启用无调用| Gap[保留日期位置 断线 不补零]
    Solid --> Tip[鼠标或键盘显示日期 项目 值及模型]
    Hollow --> Tip
    Gap --> Tip
    Choice --> Stable[只重绘图表 表格范围不变]
```

单日仅一个点；全部已列项目为多模型，单类提示显示对应记录模型；参考配置明确为演示配置。不存在双轴、模型筛选、小时粒度或预测趋势。结构、数据、Chrome 静态验收和真实发布分别留证，流程图本身不证明生产调用或扣费。
