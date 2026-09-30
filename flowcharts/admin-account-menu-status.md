# 碎银账号、咨询岗位与菜单状态流程

更新：2026-09-30。执行[076@1.0.1](../docs/sdd/SPEC-SUIYIN-ADMIN-076/1.0.1/spec.md)与[077@1.0.1](../docs/sdd/SPEC-SUIYIN-ADMIN-077/1.0.1/spec.md)，范围及来源见[产品说明](../prd/admin-account-menu-status.md)。所有保存为本地原型，不写真实后台。

## 租户与账号呈现

```mermaid
flowchart TD
    Entry[选择租户或打开旧链接] --> Tenant[按稳定tenant读取独立库存]
    Tenant --> Account[同一salesManage默认显示碎银账号]
    Account --> New{画美或傲丽}
    New -->|是| Pending[仅本租户最小框架 业务待采集]
    New -->|否| Existing[保留本租户原数据与权限]
    Pending --> Profile{属于指定八租户}
    Existing --> Profile
    Profile -->|是| Consult[系统人员称谓为咨询 移除两处时间入口]
    Profile -->|否| Original[保留原销售称谓 角色与时间设置]
    Consult --> Roles[原销售回显线上咨询 提供三类岗位多选]
    Roles --> Keep[保留其他角色 旧字段键及权限]
    Keep --> Edit[新增或编辑草稿]
    Edit -->|取消| Cancel[保持旧存储]
    Edit -->|保存| Save{本地校验与保存成功}
    Save -->|否| Retry[原值与草稿保留 提示重试]
    Save -->|是| Persist[更新本租户列表 刷新回填一致]
```

八租户为六个现有艺星及画美西安、傲丽西安。时间入口移除覆盖账号顶部、系统设置及可达表单；历史值不回填、不校验、不随新表单提交。上班记录、在线状态和离开状态可转交保持。用户文本、销售额等指标及其他九租户称谓不改；新增岗位不自动授权。

## 菜单状态直接保存

```mermaid
flowchart TD
    Load[读取最新有效树和状态] --> Scope{普通menu或平台allMenu}
    Scope --> Local[普通仅本租户]
    Scope --> Platform[平台原作用范围]
    Local --> Capsule[状态格显示或隐藏胶囊]
    Platform --> Capsule
    Capsule --> Choose{选择值是否改变}
    Choose -->|否| Noop[不保存 不记操作]
    Choose -->|是| Pending[提交中 防重复 不触发拖动或展开]
    Pending --> Save{本地保存成功}
    Save -->|否| Rollback[恢复旧值与记录 不传播导航 提示重试]
    Save -->|是| Publish[发布同一状态及操作记录]
    Publish --> Gate[平台祖先限制 父级状态 独立隐藏 原权限共同过滤]
    Gate --> Nav[相应窗口导航更新 隐藏当前页按原路径退出]
    Nav --> Reload[刷新或重开仍一致 保留合法顺序和归属]
    Edit[原编辑弹窗] --> Shared[回显同一状态 取消不保存]
    Shared --> Save
    External[外部相关状态更新] --> Load
```

图中编辑弹窗仅在用户确认保存时进入保存节点，取消直接保持现状。胶囊的显示选中不等于实际导航可见；恢复父级不清除子项独立隐藏。普通六列、平台九列、冻结表头、键盘焦点、行操作和拖动保持。平台默认与租户显式顺序/归属覆盖沿用060/068，不借状态切换清空。

用户本轮工程授权仅覆盖时间入口移除和胶囊两项；账号命名、两新租户及咨询岗位均为本次原型交付范围，不自动扩为工程实施任务。
