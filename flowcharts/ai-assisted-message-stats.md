# AI 辅助消息使用统计流程

更新：2026-09-20。业务口径继续 009@1.0.0，当前 Shell 结构依 051@1.1.0、055@1.1.0、056@1.0.0。四页恢复说明见 [发布勘误](../docs/sdd/pixel-correction-20260920.md)。入口为 `aiAssistStats`；当前专用页只使用本租户快照，旧独立页与参考样本不再作为本页数据回退。

结果表格纵向滚动按 055@1.1.0 冻结表头；横向同步，查询重绘后继续生效，表格末尾退出，不改变统计结果与查询流程。

## 原型查询与部门汇总

```mermaid
flowchart TD
    Enter[数据展示 AI辅助统计] --> Source[加载本租户专用快照及来源说明]
    Source --> Form[按源表单显示日期 维度及筛选]
    Form --> Draft[编辑查询草稿]
    Draft --> Submit[提交页面原有查询动作]
    Submit --> Valid{条件合法}
    Valid -->|否| Error[字段错误 旧结果保留]
    Valid -->|是| Rows[筛选适用样本]
    Rows --> Missing[缺少样本或未采集 明确说明]
    Rows --> Empty[已知无匹配 显示空态]
    Rows --> Mode{来源维度}
    Mode -->|销售账号| Accounts[账号明细]
    Mode -->|部门| Allocation{部门分配数据完整}
    Allocation -->|否| DeptMissing[说明部门维度未采集 不归给首个部门]
    Allocation -->|是| Sum[筛选后按部门累加三类消息]
    Sum --> Ratio[用汇总后的分子分母重算比例]
    Accounts --> Result[九列表格 部分截图样本明确标记]
    Ratio --> Result
```

## 业务合同的数据边界

```mermaid
flowchart TD
    Message[候选销售消息] --> Tenant{属于当前租户}
    Tenant -->|否| Drop1[排除]
    Tenant -->|是| Launch{不早于该环境实际上线时刻}
    Launch -->|否| Drop2[排除 不追溯不估算]
    Launch -->|是| Type{查询范围内单聊文本}
    Type -->|否| Drop3[排除]
    Type -->|是| Label{已有来源标签}
    Label --> Direct[AI直发]
    Label --> Reference[AI参考]
    Label --> Manual[手动录入]
    Label --> Unknown[无有效标签 不进入三类]
    Direct --> Assist[AI辅助合计]
    Reference --> Assist
    Assist --> Rate[辅助合计除以三类总数 零分母按合同显示破折号]
    Manual --> Rate
```

第二图是已批准业务合同，不能拿静态页面结构检查当作真实生产数据验收。当前专用原型只读取本租户 captured、partial 或 not-captured 文件，不使用参考租户或合成数量回退。深圳 22 行为截图部分样本，日期和部门拆分缺采分别说明；不展示消息正文，不据使用量推断客户升级、到店或成交效果。
