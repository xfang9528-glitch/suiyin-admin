# 全部账号状态交互流程

更新：2026-10-02。执行 [SPEC-SUIYIN-ADMIN-ACCOUNT-TYPE-001@0.2.0](../docs/sdd/SPEC-SUIYIN-ADMIN-ACCOUNT-TYPE-001/0.2.0/spec.md)，产品范围见[产品说明](../prd/all-account-status.md)。仅 `bzds / allWeChatStatus` 使用本专用数据和呈现；其他租户维持原路由与权限。

## 读取、两类与汇总

```mermaid
flowchart TD
    Entry[平台管理 全部账号状态] --> Access{原页面权限与租户范围有效}
    Access -->|否| Denied[沿用原权限反馈 不提供bzds数据]
    Access -->|是| Read[读取本地账号状态快照]
    Read --> Valid{每条类型wx或qw且计数格式合法}
    Valid -->|否| Existing{已有正确页面}
    Existing -->|是| Keep[保留原正确页面]
    Existing -->|否| Error[页面读取失败及重试]
    Error --> Read
    Valid -->|是| Group[按环境和各条账号创建类型分组 保留重名]
    Group --> Stats[个微 企微 汇总 每行总数在线掉线]
    Group --> Lists[在线及掉线各含个微组和企微组]
    Lists --> Empty{对应分组已确认无账号}
    Empty -->|是| Zero[0 与 无账号]
    Empty -->|否| Names[各条账号恰好出现一次 长名称换行]
    Stats --> View[表头冻结及类型标题 长名单可滚动]
    Zero --> View
    Names --> View
```

“待核对”不属于业务流程或类型；旧0.1.0第三分类已由用户纠正撤销。缺/非法类型在开发校验中阻断，不默认个微、不丢条目，不回退旧演示列表。来源汇总与名单条数不一致时保留来源汇总、内部诊断，不静默配平。整行数据已变化时，先形成同批完整快照再显示；明细类型不改变总览在线/掉线口径。

## 排序、页签与滚动

```mermaid
flowchart LR
    Original[原始环境顺序] -->|点击排序| Asc[升序 同值稳定]
    Asc -->|再点击| Desc[降序 同值稳定]
    Desc -->|再点击| Original
    Wechat[微信账号 两类及汇总] -->|保存微信滚动位置| Proxy[代理账号 原卡片与状态]
    Proxy -->|保存代理滚动并恢复微信位置| Wechat
    Wechat --> Scroll[表头固定 组标题位于表头下且限于本组]
    Proxy --> ProxyScroll[代理区域独立滚动]
```

排序、页签可键盘操作并保留可见焦点。代理118卡是本次原型快照而非生产固定规则；读取当前代理样本，已替代2026-09-27未采代理页提示。分类不增加账号创建、编辑、发送、启停或其他真实业务操作。
