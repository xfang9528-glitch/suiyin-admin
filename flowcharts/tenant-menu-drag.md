# 各租户菜单拖动与导航联动流程

合同：[SPEC-SUIYIN-ADMIN-068@1.0.0](../docs/sdd/SPEC-SUIYIN-ADMIN-068/1.0.0/spec.md)。普通menu作用当前租户；平台allMenu仍通过默认结构和可见性规则影响全部租户。

```mermaid
flowchart TD
    Load[加载本租户完整库存 旧配置 平台当前树] --> Base[生成平台默认结构 含隐藏库存]
    Base --> Override[应用已调整同级顺序及被移动项父级]
    Override --> Parent{覆盖目标父级有效}
    Parent -->|否| Fallback[保留覆盖并提示 暂用当前默认父级]
    Parent -->|是| Tree[同一有效完整菜单树]
    Fallback --> Tree
    Tree --> Table[六列菜单表 同层顺序只读]
    Tree --> Filter[平台当前祖先隐藏 删除 租户权限和显示过滤]
    Filter --> Nav[本租户可见导航]
    Table --> Drag[手柄拖动 一级整组 二级组内或跨组]
    Drag --> Valid{可编辑 身份唯一 层级合法且位置变化}
    Valid -->|否或取消| Keep[保持原树 不保存不记操作]
    Valid -->|是| Save[树 局部覆盖 操作记录保存为同一成功状态]
    Save --> Result{保存成功}
    Result -->|否| Rollback[恢复上次成功状态 提示未保存和重试]
    Result -->|是| Notify[通知同租户已开窗口 保留仍可见页面状态]
    Notify --> Tree
    Notify --> Undo[可撤销最近移动 包括其覆盖标记]
    Undo --> Save
    External[外部平台或同租户菜单变更] --> Cancel[取消进行中拖动 清除旧撤销]
    Cancel --> Load
```

```mermaid
flowchart TD
    Platform[平台后来改顺序 父级 显示或删除] --> Group{本租户明确调整过该同级列表}
    Group -->|否| Follow[跟随当前平台顺序]
    Group -->|是| Retain[保留现存成员顺序 新进入成员按平台顺序追加]
    Follow --> Parent{该菜单有有效本租户父级覆盖}
    Retain --> Parent
    Parent -->|是| Local[只保留该被移动项父级]
    Parent -->|否或暂不可用| Default[当前平台父级 无定义则租户原始父级]
    Local --> Gate[始终检查平台当前祖先链隐藏 删除及原权限]
    Default --> Gate
    Gate --> Projection[同一完整树生成表格和可见导航]
```

刷新或后续数据修改清除会话撤销；单纯展开、滚动、打开后取消弹窗保留撤销。一级空组和隐藏项不从库存丢失，携页一级保留自身入口。异常重复身份/路由保留原数据并暂禁整树拖动，导航安全投影仍执行已有平台限制和租户覆盖；修复后恢复正常操作。所有保存都是静态原型本地行为，生产持久化和权限由正式工程流程实施。
