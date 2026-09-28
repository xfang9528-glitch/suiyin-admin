# Tasks — 六个艺星租户补齐回访规则

> Spec: SPEC-SUIYIN-ADMIN-071@1.2.0
> Plan: plan.md
> Status: implementation completed; static-html validation passed; full-push completed; remote and SCRUM receipts verified

> 房总2026-09-28以E021批准六艺星补齐，完成本地验证后以E022再次明确“完整推送”；原节点行为保持。1.1.0已发布合同快照在history/1.1.0/，本次发布单独依据E022授权。

- [x] T001 保存并核对1.1.0已发布SPEC/Plan/Tasks快照，确认六艺星名单、各自聊天父级与当前仅深圳入口（R013）。
- [x] T002 更新1.2.0合同、AC-R013-01/02/03及静态Plan，验证精确依赖和运行边界（R001–R015）。
- [x] T003 创建六tenant独立模型配置及精确白名单，新增五家合成实体/ID/选项，保留21/26维度及原计算；深圳旧API/稳定ID不改（R001–R005、R009–R011、R013–R015）。
- [x] T004 UI按当前tenant选择模型、隔离存储与演示结果；深圳原v1/v2完整保留，非艺星不加载艺星数据（R006–R010、R013；AC-R013-03）。
- [x] T005 新增其余五艺星聊天菜单与各自menu库存，复用德三唯一平台定义；按revision做增量并保留旧排序/名称/隐藏/删除/权限（R013；AC-R013-02）。
- [x] T006 验证六艺星入口/字段/编辑/复制/保存/启停/刷新与跨tenant隔离，核对非艺星负向访问、深圳回归及旧群发/统计未变（R001–R015；AC-R013-01/02/03）。模型18项、深圳兼容25项、菜单66项、Chrome15项均通过，见verification.md及checks/v1.2.0/。
- [x] T007 用Google Chrome核对新增租户的桌面/窄窗页面并打开最终预览，记录实际完成、来源与延期范围（R011–R014）。已视检成都/北京/嘉兴及1120窄窗内容截图，Chrome已打开成都Shell。

history/1.1.0/verification.md和checks/nodes-*结果仅为既有回归基线；本轮1.2.0实际证据见verification.md和checks/v1.2.0/。真实调度、PC名单和实际权限接口不在范围内。

E021日常补齐阶段已经完成，彼时没有发布授权；E022现已进入本版完整推送阶段：

- [x] T008 记录E022授权及真实本地实施状态，按1.2.0更新来源收敛，逐项覆盖§4.1并通过SPEC/Plan/Convergence校验；旧1.1.0合同不改（R001–R015）。
- [x] T009 同步原型仓现行README/CLAUDE/PRD/流程图/设计规范，生成本版单文件，制作1.2.0版本化SDD包，校验来源、隐私、链接和包完整性（R012、R013）。
- [x] T010 完成本版单文件与最终Chrome校验，提交并推送原型仓分支与tag，回读远端SDD和部署页面；每一项只在真实成功后记完成（R012、R013）。
- [x] T011 按工作区规则发送原型交付通知并核对真实回执，记录完成或阻塞，不把待办写成已送达。

源规格版本保持1.2.0，当前source-convergence.md只证明本地来源收敛，不代替远端回执。旧1.1.0版本包/history不回写；不创建Issue/Handoff/Test Contract，不更新APP/PC开发进度表，不进入生产仓。发布状态由主线依据实际commit/tag、远端SDD、部署及通知证据更新；以上未勾选项不能因E022授权或本地PASS提前完成。

本版完整推送于09/28/2026 03:29:59完成：commit bf1b785b2df0bfc702300187f68510663018e2af、tag v2026092802-admin-revisit-tenants，master/origin/master为0/0，远端730文件/43份SDD及7份正文回读通过；Cloudflare对应提交部署成功，SCRUM回读已核验。在线Access保护，未进行登录后DOM验收。实际证据见delivery/v1.2.0/publication-receipt.json。已发布包tasks.md保留推送前冻结状态，不回写。
