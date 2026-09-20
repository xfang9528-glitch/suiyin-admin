# AI 辅助消息使用统计流程

更新：2026-09-20。业务口径继续 009@1.0.0，当前 Shell 结构依 051@1.1.0、055/056@1.0.0。入口为 `aiAssistStats`；旧独立页的固定默认值和快捷日期组合不作为当前页面结构承诺。

## 原型查询与部门汇总

```mermaid
flowchart TD
    Enter[数据展示 AI辅助统计] --> Source[加载本租户页面及可见来源说明]
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
    Mode -->|部门| Sum[筛选后按部门累加三类消息]
    Sum --> Ratio[用汇总后的分子分母重算比例]
    Accounts --> Result[表格与来源要求的分页]
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

第二图是已批准业务合同，不能拿静态页面结构检查当作真实生产数据验收。当前原型参考和合成样本有来源标签；不展示消息正文，不据使用量推断客户升级、到店或成交效果。
