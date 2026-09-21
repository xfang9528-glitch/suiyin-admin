# 平台菜单拖动与全租户导航流程

合同：[060@1.1.0](../docs/sdd/SPEC-SUIYIN-ADMIN-060/1.1.0/spec.md)。

~~~mermaid
flowchart TD
    Load[加载平台完整树和已保存设置] --> Action[拖动一级整组或二级 编辑显示状态]
    Action --> Target{位置和层级合法且有变化}
    Target -->|取消或无变化| Keep[保留原结构 不新增记录]
    Target -->|有效| Save[保存结构 顺序与记录]
    Save --> Result{写入成功}
    Result -->|否| Rollback[还原结构 明确未保存 可重试]
    Result -->|是| Shared[更新统一平台菜单规则]
    Shared --> Tenant[每个租户保留自己的可用入口与独立隐藏]
    Tenant --> Nav[应用平台顺序 父级与显示状态]
    Nav --> Refresh[当前和已开租户侧栏即时重绘 保留有效页面]
    Refresh --> Reload[刷新或重新开页仍恢复]
    Shared --> Undo[撤销最近移动 后续菜单修改使其失效]
    Undo --> Save
~~~

隐藏一级抑制其当前子项；恢复显示不解除租户独立隐藏。跨组不增加页面权限；同名项通过原始路由和平台稳定 ID 对应。静态原型只保存同浏览器同源状态，工程需真实持久化与授权校验。
