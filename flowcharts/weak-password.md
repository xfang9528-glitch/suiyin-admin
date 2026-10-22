# 弱口令强制改密交互流程（管理后台）

合同：[WEAK-PASSWORD-4746@0.1.0](../docs/sdd/SPEC-SUIYIN-ADMIN-WEAK-PASSWORD-4746/0.1.0/spec.md)。产品说明见 [weak-password.md](../prd/weak-password.md)。

```mermaid
flowchart TD
  L[登录页 / 点登录] --> R{登录返回}
  R -->|42910| LK[toast 锁提示，留在登录页]
  R -->|无 passwordStatus| HOME[进入 Shell]
  R -->|warn 或 enforced（D2：提示期即强制）| S2[强制改密页 第 2 步 设置密码<br/>旧密码在内存]
  OLD[旧会话任意接口收到 HTTP 428 / 42800<br/>不清 token、并发只跳一次] --> S1[强制改密页 第 1 步 校验身份<br/>手机号只读，输入旧密码]
  S1 -->|下一步| S2
  S2 --> V{6 条强度规则<br/>按顺序只显示第一条}
  V -->|未过| S2
  V -->|通过| P[POST /login/login + setPassword]
  P -->|40020| E1[标在新密码框] --> S2
  P -->|code 401| E2[回第 1 步，旧密码框标红<br/>清内存旧密码，新密码草稿保留] --> S1
  P -->|42900| E3[按钮禁用「请 n 秒后重试」<br/>倒计时结束恢复，不自动重发] --> S2
  P -->|成功| OK[第 3 步 修改成功<br/>倒计时进入系统] --> HOME
  P -->|50020| B1[回登录页：密码已修改，请用新密码登录]
  P -->|网络错误 / 5xx| B2[回登录页：密码可能已修改成功，请用新密码登录<br/>不静默登录，清内存旧密码]
  S1 -->|退出登录| L
  S2 -->|退出登录| L
  KICK[旧凭证收到 401 password_changed] --> B3[回登录页：密码已被修改，<br/>请向使用该账号的同事获取新密码]
```

```mermaid
flowchart TD
  A[碎银账号 / 重置密码] --> B[确认框 .menu-delete-dialog<br/>新密码为手机号后 6 位，下次登录必须先改，记审计]
  B -->|取消 / ×| A
  B -->|确定| C[密码改为默认、写审计 RESET_PASSWORD、旧登录失效]
  C --> D[toast：重置成功，对方下次登录需先修改密码]
  D --> E[对方下次登录 → 强制改密页]
```

原型的服务端返回由 URL 参数模拟（见产品说明「演示入口」），不接真实接口。
