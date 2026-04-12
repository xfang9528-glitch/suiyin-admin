# Session 交接 · 2026-04-12

> 本 session 在 `D:/CC work/` 下工作，项目实际存储在 `E:/AI 项目/佰智德三/碎银原型/suiyin-admin/`。
> 下次房总在新目录起 session 时，读这一份就能无缝接手。

## 项目定位

**碎银管理页原型**（suiyin-admin）——佰智德三管理后台，是税银系统三端之一：
```
suiyin-pc-chat（PC端） + suiyin-app-chat（APP端） + suiyin-admin（管理页）
                                                     ↑ 本项目
```
线上参照：`bzds.wecarepet.com/admin`
架构：**每租户独立部署独立域名**，不做多租户切换（见 `suiyin-admin-architecture.md`）

## 关键技术决策（已拍板，不要再问）

| 项 | 选择 |
|---|---|
| 主题色 | **微信绿 `#07C160`**（不是现状青绿 teal，与 PC/APP 端对齐） |
| 技术栈 | 纯 HTML + 内联 CSS（DR-005 原型不引框架） |
| 布局 | 顶部 Header + 左侧 15 项一级菜单 + Chrome 式多 Tab + 主内容区（iframe） |
| Tab 机制 | **真做**：状态保留、可切可关、首页 pinned 不可关 |
| 未截图菜单 | 骨架照样显示并标 🚧 徽章，点击走 `_placeholder.html` |

## 已完成

```
suiyin-admin/
├── CLAUDE.md                         项目说明（15 菜单清单 + 开发顺序）
├── index.html                        入口页（原型索引 + 待开发清单）
├── prototype/
│   ├── _shell.html                   ⭐ 骨架（header/侧边栏/Tab/iframe），默认加载 sales_v1.0
│   ├── _placeholder.html             未截图菜单占位
│   ├── login_v1.0.html               ⭐ 登录页（左品牌 + 右表单，密码/短信双 tab）
│   └── sales_v1.0.html               ⭐ 销售管理（筛选+表格+分页，12 条 mock，房总手工扩写完整版）
├── prd/                              （空，待写）
├── flowcharts/                       （空，待写）
└── docs/
    └── SESSION-HANDOFF-2026-04-12.md 本文件
```

## 骨架已验证

- ✅ 15 项一级菜单 / 19 项子菜单 / 11 个 🚧 待补徽章
- ✅ Tab 新增 + 激活切换 + 关闭回退 pinned 首页
- ✅ iframe 懒加载（第一次点才 set src）
- ✅ 侧边栏与 Tab 双向联动高亮
- ✅ preview 截图确认渲染正常（desktop 视口 + 650px 窄视口都跑通）

## 数据展示快照（进度跟踪）

| 菜单 | 截图 | 原型 |
|---|---|---|
| 销售管理 | ✅ | ✅ v1.0 |
| 专家管理·专家信息 | ✅ | ⬜ |
| 好友管理（5子页全有） | ✅ | ⬜ |
| 话术管理 | ✅ | ⬜ |
| 商品管理 / 商品管理(小程序) | ✅ | ⬜ |
| 群发管理 | ✅ | ⬜ |
| PYQ管理 | ✅ | ⬜ |
| 分佣管理（6子页全有） | ✅ | ⬜ |
| 数据展示·拉新记录 | ✅ | ⬜ |
| 数据展示·另外6子页 | 🚧 | ⬜ |
| 聊天/微信/AI/系统/平台管理 | 🚧 | ⬜ |

所有已截图的现状细节全部记在 `memory/suiyin-admin-ui-snapshot.md`。

## 下一步建议（房总定）

按 `CLAUDE.md` 里的开发顺序：
1. **好友管理·好友列表** ← 数据量最大，5 子页都有截图
2. 话术管理（树形+列表特殊布局）
3. 分佣·收入确认（财务表格范式）
4. 商品管理
5. ……

或补截图优先：
- 数据展示剩余 6 子页
- 聊天/微信/AI/系统/平台 5 个管理类菜单

## Preview 启动

**在 `D:/CC work/` cwd 下**：
```
preview_start "suiyin-admin"   # 端口 3500
```

**原理**：由于 preview_start 限制 cwd 必须在 `D:/CC work/` 内，我在那里建了一个 junction：
```
D:/CC work/suiyin-admin  →  E:/AI 项目/佰智德三/碎银原型/suiyin-admin
```
`.claude/launch.json` 的 suiyin-admin 条目通过 junction 访问项目。

**如果新 session 在 `E:/AI 项目/佰智德三/碎银原型/suiyin-admin/` 下起**：
- 可以直接用 preview_start，launch.json 里改 cwd 或加相对路径即可
- 或者直接 `npx serve prototype -l 3500`

## 硬坑警告

1. **图片 >2000px 会让整个多图请求挂掉**——房总给管理页截图时每张图宽度限到 **1800px 以内**。上一次（2026-04-11）为了超限图片损失了 5 个菜单类 + 数据展示 6 子页的截图机会
2. **preview 面板默认视口约 650px**——登录页响应式断点设成 <560px 才隐藏品牌区，否则窄视口看不到双栏
3. **路径迁移**：2026-04-12 房总把 `D:/CC work/suiyin-*` 所有项目挪到 `E:/AI 项目/佰智德三/碎银原型/`。`project-registry.md` 已更新
