# 完整推送前本地验收

- 验收日期：2026-09-28，Asia/Shanghai；SPEC-SUIYIN-ADMIN-071@1.1.0。
- 目标：suiyin-admin HTML 原型，深圳艺星的「聊天管理 → 回访规则」。
- 本地入口：`http://127.0.0.1:8148/prototype/_shell.html?tenant=yestar-sz&page=revisitRules`；本次复用已有静态服务，以 Google Chrome 无头模式执行交互验收。
- 验收范围：一条规则包含多个节点，共享账号范围、日期基准、每日运行时间和启停；节点独立选中/排除、复制条件、整条保存/取消、示例试算以及旧数据保留。
- 状态：用户已要求完整推送；本报告确认本地验收，不作为远端分支、tag、SDD 或通知成功的证明。远端交付由完整推送收口另行核验。

## 2026-09-28 实际通过结果

| 检查 | 结果 | 本次证据 |
|---|---|---|
| 独立模型业务断言 | **25/25 PASS，失败0** | `checks/nodes-model-results.json`，UTC `2026-09-28T02:21:16.596Z` |
| Chrome交互验收 | **9/9组 PASS** | `checks/nodes-browser-results.json`，UTC `2026-09-28T02:23:22.534Z` |
| 新版列表/编辑预览 | PASS；错误0、外部请求0 | `checks/nodes-preview.json`及本次重拍截图 |
| 菜单升级守卫 | **17/17组 PASS** | `checks/menu-migration-071-results.json`；删除、排序、改名、隐藏、跨父级、旧版本和租户隔离 |
| 真实file协议单文件 | **6/6组 PASS**；HTTP已拦截、外部请求0、脚本错误0 | `checks/inline-071-results.json`及`checks/verify-inline-071.cjs` |
| 公开数据审计 | PASS；检查2456个身份单元格、36个敏感字段，失败0 | `prototype/sanitize-public-data.mjs --check`，覆盖15租户771个数据页11309行 |
| 产品JS语法 | 4/4 PASS | `node --check`检查model、UI、admin-content及admin-menu-state四份JS |
| 便携验收脚本语法 | 3/3 PASS | `node --check`检查nodes-model-verification、nodes-browser-verification及nodes-preview |
| 原型仓补丁空白检查 | PASS | `git diff --check`；仅有Git换行转换提示，无检查错误 |

模型源文件为`prototype/admin-revisit-rules-model.js`，SHA-256：

`578ab40f44803af7fdd34d9da5634330aa7c7752c387a605d48a8e05a64b2019`

单文件由`prototype/build_admin_inline.mjs`生成。菜单升级修复后重新验收6组，内嵌79份JSON、39份JS、25份CSS和7个资源；单文件确切摘要见`checks/inline-071-results.json`。覆盖合并试算、字段完整、节点复制/保存、整体启停/刷新、重复节点及取消、深圳菜单/德三平台登记和其他租户无新入口。

### 额外菜单回归的范围与已知限制

交付前发现并修复相邻两次菜单升级的基线选择问题：新加回访入口时，应使用已保存配置对应的9月27日菜单基线判断用户改动；更老配置仍使用既有基线。否则用户删除的喜报等行可能重新出现。当前两份菜单JSON保留按revision索引的基线，检查记录见`checks/menu-migration-071-results.json`。

额外复跑已发布068的全菜单离线脚本时，前6组通过，平台一级拖动撤销后“案例库管理”位置断言失败；对未修改的HEAD基线（425e40f）运行同一脚本，出现完全相同失败。这是既有平台菜单撤销排序问题，未计为本轮通过项，本轮未改该行为。当前回访功能6组离线验收独立通过；原始诊断材料保留本机，不公开含主壳身份的失败截图。

25项模型断言覆盖唯一到期节点、节点复制纯条件与深拷贝、空/重复/非法节点、共同账号权限、48小时边界、双方AND、未知与未来消息、日期基准切换、附加日期条件AND以及非当天节点修改隔离。

9组Chrome验收覆盖合并列表与试算、21项选中/26项排除、复制取消及确认后独立修改、新增/重复天数/排序/最后节点守卫、整条取消、整体启停与刷新、新建及零结果保存、1120px窄窗、旧规则显式导入、损坏存储保护、写入失败保留草稿。主验收页记录到页面异常0、外部请求0；旧存储、损坏存储和写入失败的辅助浏览器上下文按对应功能断言验收，未将其请求日志混入主页面计数。

固定样本仍以**2026-09-27 01:00北京时间**试算，运行验收的日期不改变测试数据：范围13、应回访5、排除5、未入选1、无法判断2。应回访分别来自第3天3人、第5天1人、第7天1人；均为合成样本，不能解释为实际客户人数。

单文件离线6组、菜单升级17组及公开数据审计均由完整推送主流程完成并补入上表。SPEC/Plan、15项来源收敛及28文件SDD包也分别通过校验；这些结果不由模型或截图结果替代。

## 本次视觉证据

以下5张已于2026-09-28重拍并逐张查看。截图直接取回访内容iframe，未包含主壳右上角账号显示名；未对产品代码做隐私替换。

| 文件 | 说明 |
|---|---|
| `checks/nodes-list.png` | 一条合并规则、3/5/7天节点概览 |
| `checks/nodes-editor.png` | 共享设置、节点页签和摘要 |
| `checks/nodes-copy.png` | 第5天复制第3天条件；明确仅替换条件，目标时点不变。来源消息天数是交互验收临时修改值 |
| `checks/nodes-trial.png` | 合并节点后的五类统计与逐人原因 |
| `checks/nodes-narrow.png` | 1120px浏览器窄窗下内容区域；截图处于新增第9天后的验收状态，不代表默认种子多了节点 |

## 隐私与可公开证据

本次检查新增model/UI源码、3份便携脚本、3份当前结果JSON及5张当前截图。回访样本为17条固定合成好友；账号、开发人、经理、医生均使用演示身份，消息仅为方向、合成时间、来源和状态。没有把MCP原始返回、真实私聊内容、实际账号ID或访谈联系人导入页面。

源码/JSON扫描未发现访谈联系人标记、微信ID、群ID、手机号模式或Bearer凭据。便携脚本和当前结果JSON的个人绝对路径命中为0；该扫描与源码及截图复核共同组成证据，不单独宣称能发现所有隐私内容。

| 可发布范围 | 处理结论 |
|---|---|
| `nodes-model-verification.cjs`、`nodes-browser-verification.cjs`、`nodes-preview.cjs` | 已改便携入口，可随版本化SDD复制 |
| `nodes-model-results.json`、`nodes-browser-results.json`、`nodes-preview.json` | 当前通过结果，model路径已改为仓库相对路径，可复制 |
| 上述5张`nodes-*.png` | 当前iframe截图，已核对没有主壳个人显示名，可复制 |
| `model-verification.cjs`、`browser-interactions.cjs`、`editor-controls.cjs`、旧`revisitRules-*`结果及截图 | 1.0.0历史证据；不可混入当前验收集，其中旧脚本仍有本机路径 |
| `browser-preview.cjs`、`massMessageListYx-*` | 旧路由参考；本次未做公开化或重新验收，不进入本次公开证据集 |
| `failure.png`、`nodes-failure.png`（若存在）、原MCP证据目录 | 不复制到公开SDD；失败截图可能包含主壳身份，原始研究证据只保留本机 |

## 便携复跑入口

在原型仓根目录运行交付包`checks/`中的对应脚本。模型脚本从脚本所在目录或当前工作目录向上查找`prototype/admin-revisit-rules-model.js`；不在仓库中运行时，设置`PROTOTYPE_ROOT`为原型仓根目录。模型报告只写仓库相对文件名。

浏览器脚本使用以下环境变量，不再固定个人Windows路径：

| 环境变量 | 默认行为 |
|---|---|
| `PLAYWRIGHT_MODULE` | 默认加载可解析的`playwright`模块；缺少时输出安装或指定模块的操作提示 |
| `CHROME_PATH` | 默认使用Playwright的`chrome`通道；可指定已有Google Chrome可执行文件 |
| `PROTOTYPE_BASE_URL` | 默认`http://127.0.0.1:8148`；应指向已启动的原型仓静态服务根地址 |
| `PROTOTYPE_ROOT` | 供模型验收指定原型仓；默认按上述规则发现 |

本次已使用便携版本复跑，模型从原型仓当前目录自动定位，浏览器通过`PLAYWRIGHT_MODULE`读取现有运行时并使用默认Chrome通道。脚本不自动安装依赖、不启动生产调度；浏览器验收只使用独立QA存储键和临时浏览器上下文。

## 交付边界

本轮仍是可交互的静态原型。新版规则使用浏览器v2键，v1只读保留；启用只模拟状态，不运行真实定时任务，不生成真实PC回访名单，不发送消息。销售权限只在合成模型与产品说明中验证，未接实际权限接口或修改PC页面。

真实调度、PC列表、执行前重新排除、重复回访治理、完成状态与质检仍待正式工程切片。时间和消息口径的演示默认值不等同于生产业务最终确认。远端推送与通知必须以实际回读和发送回执为准，本地PASS不能替代这些交付证据。
