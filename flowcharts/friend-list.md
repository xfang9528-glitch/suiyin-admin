# 好友管理流程

更新：2026-09-20。当前路由为 `customerManagement` 与 `yxCustomerList`，按租户来源分别实现；旧独立页流程已 [归档](../docs/history/before-admin-wide-alignment/README.md)。本图依 051@1.1.0、055/056@1.0.0，不能用于证明未采集展开已完成。

```mermaid
flowchart TD
    Enter[进入本租户好友页] --> Source[读取本租户路由与样本来源]
    Source --> Route{好友页面类型}
    Route -->|普通好友| Ordinary[来源顶部入口 筛选 列表]
    Route -->|艺星好友| Yestar[顶部操作 初态筛选 独立关键词区]
    Ordinary --> Category[点击全部好友或四类信息]
    Category --> Pending[展开状态未采集 明确说明]
    Yestar --> Expand[点击高级筛选展开]
    Expand --> Pending
    Yestar --> Account[所在账号占位 禁用并说明缺选项证据]
    Ordinary --> Draft[修改已采集筛选草稿]
    Yestar --> Draft
    Draft --> Search[按对应搜索或执行筛选提交]
    Search --> Result[过滤当前可用样本]
    Result --> Empty[没有匹配 显示相应状态]
    Result --> Table[表格按来源字段与分页展示]
    Table --> Select[选中记录 启用适用批量操作]
    Table --> Edit[本地编辑 记录 或删除确认]
    Edit --> Cancel[取消保持原样]
    Edit --> Local[合法确认 只影响当前租户本地数据]
    Draft --> Reset[重置来源默认条件 不重复生成控件]
    Reset --> Route
```

参考内容必须说明来源，不借入其他租户销售或账号。当前保留已知入口不等于分类 Popover、完整高级筛选或账号级联已完成；不得沿用旧流程中的合成分类人数。独立关键词区按来源放置，其与高级条件的完整实站组合语义仍需展开采集核对。
