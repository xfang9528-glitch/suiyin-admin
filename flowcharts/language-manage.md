# 话术管理流程

2026-09-30术语适配：按[077@1.0.1](../docs/sdd/SPEC-SUIYIN-ADMIN-077/1.0.1/spec.md)，六艺星及画美/傲丽的系统人员称谓显示为咨询，其他租户仍为销售；下文共享业务定义与历史采集值不改。画美/傲丽仅有最小待采集框架，不据此新增本页权限、数据或菜单。

更新：2026-09-29。入口按[073@1.0.0](../docs/sdd/SPEC-SUIYIN-ADMIN-073/1.0.0/spec.md)的R001–R003改为工具管理下二级话术，原路由与隐藏/权限、本地业务状态保持。页面继续继承[051@1.1.0](../docs/sdd/SPEC-SUIYIN-ADMIN-051/1.1.0/spec.md)的R002–R006、R008–R010。流程仅作用于当前浏览器的本地原型；数据范围见[产品说明](../prd/language-manage.md)。

```mermaid
flowchart TD
    Enter[当前租户 工具管理下话术管理或旧直达链接] --> Permission{原话术隐藏和权限允许}
    Permission -->|否| Denied[不显示业务页面 工具父级不扩大权限]
    Permission -->|是| Load{同一languageManage加载本租户独立样本}
    Load -->|失败| Retry[显示失败原因 可重试]
    Retry --> Load
    Load -->|成功| Tree[分类树与默认未选分类空态]
    Tree --> Search[输入搜索草稿 按搜索或Enter提交]
    Search --> Match[显示匹配分类及其祖先]
    Match --> Choose{选择分类}
    Tree --> Choose
    Choose -->|父级或未选| Prompt[请选择无子分类的话术分类]
    Choose -->|末级| State{该分类是否已采}
    State -->|未采| Unknown[显示未采集 不显示真实零条]
    State -->|已采| List[本租户六列表格 样本量与来源总量分开]
    List --> Detail{打开话术编辑}
    Detail -->|已采详情| Form[回显标题归属备注及文本或媒体占位]
    Detail -->|未采详情| Gap[说明详情未采 不猜正文]
    Gap --> Form
    Form --> Draft[编辑本地草稿]
    Draft -->|取消或Escape| Keep[保持已存状态]
    Draft -->|保存| Valid{本地校验}
    Valid -->|失败| Draft
    Valid -->|通过| Save[只保存本租户本地状态]
    Save --> List
```

```mermaid
flowchart TD
    Node[分类节点] --> Capability{该节点操作是否可用}
    Capability -->|禁用| Preserve[保留来源禁用状态]
    Capability -->|添加或编辑| Category[分类草稿 已有未知范围保持未知]
    Category -->|取消| Unchanged[不改变已存内容]
    Category -->|校验通过并保存| Local[本租户本地变更及记录]
    Capability -->|隐藏或显示| Local
    Capability -->|删除| Confirm{本地删除确认}
    Confirm -->|取消| Unchanged
    Confirm -->|确认| Local
    Update[来源captureRevision更新] --> Merge[以旧基线比较 仅保留真正的本地修改]
    Merge --> Latest[新补采详情与本地修改共同回显]
```

分类显示状态来自本轮图标采样，未在真实后台点击隐藏/删除/保存；图中操作均为本地反馈。部门、销售和商品候选项按本租户已采范围提供，未采字段不转换成“全部”或其他租户选项。新增本地内容与源样本分开，媒体仅占位。
