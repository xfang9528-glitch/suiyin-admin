# 碎银管理后台 HTML 原型

这是十五租户的静态管理后台原型，用于对照真实页面、评审操作和统计规则。2026-09-27 当前登记 **15 个租户、796 个租户×页面入口、88 种路由**。其中783个入口属于本轮源环境采集队列，741个可见页面已有有效DOM和截图，42个保持源隐藏状态；另13个为既有批准的AI费用原型扩展。采集覆盖不等于全部页面、全部状态逐像素一致。

本轮按各租户当前来源刷新左侧导航、完整菜单库存、品牌、图标和客户端版本，并校准好友、通用列表、统计及专用页面。新增录音管理、喜报设置和喜报记录共25个租户×页面。数据包含本租户脱敏采样、明确标识的参考样本和合成演示；不是实时后台，所有修改只影响本地原型。

- [好友列表](https://suiyin-admin.pages.dev/prototype/_shell.html?tenant=bzds&page=customerManagement) · [录音管理](https://suiyin-admin.pages.dev/prototype/_shell.html?tenant=rxxz&page=recordingAdmin) · [喜报设置](https://suiyin-admin.pages.dev/prototype/_shell.html?tenant=yestar-hz&page=goodNewsSettings)
- [当前产品说明](prd/admin-live-reference.md) · [交互流程](flowcharts/admin-live-reference.md) · [设计规范](docs/design-spec.md)
- [本轮交付合同](docs/sdd/SPEC-SUIYIN-ADMIN-REFRESH-001/0.2.0/README.md) · [公开验证摘要](docs/verification/live-refresh-20260927/README.md) · [公开样本审计](docs/verification/live-refresh-20260927/public-data-audit.md)
- [验收与已知边界](docs/verification/admin-live-reference.md) · [离线单文件](prototype/_shell_inline.html)

## 本轮实际验证

| 范围 | 结果 |
|---|---|
| 当前导航与完整库存 | 15租户；保留源隐藏项、平台限制和本地改名/隐藏/拖动覆盖；7项设置迁移检查通过 |
| 普通及艺星好友 | 15租户，381项几何、161项交互/控件检查通过 |
| 通用列表 | 410份布局配置中395页实际测量通过，15页由专用渲染器承接；覆盖64种路由＋表头组合 |
| 录音、喜报、质检、词库与平台专用主体 | 54个租户×页面通过；专用弹层12项交叉检查通过 |
| 备注需求词库及拉新 | 65项本地检查通过；需求组、警示空态、日期与导出边界按本租户保留 |
| 专用统计及主列表尾差 | 初轮107项、最终补充81项几何通过；后者包括厚全商品榜、成都拉群、瑞熙小周统计、销售管理及全部账号状态 |

同源视口与DPR对照采用1 CSS px几何容差；395个通用列表的表格起点纵向最大偏差0.006px、横向0px、宽度最大偏差0.409px。记录中的JS错误与外部请求均为0。上述分组可能覆盖相同页面，不相加作为独立页面数；截图行内容、头像、实时总量及未采曲线不纳入全图像素相等声明。

## 保留的行为合同

| 合同 | 当前职责 |
|---|---|
| [REFRESH-001@0.2.0](docs/sdd/SPEC-SUIYIN-ADMIN-REFRESH-001/0.2.0/README.md) | 录音与喜报三新页面、对应入口迁移、本地演示及证据边界；既有页面继续各自原合同 |
| [051@1.1.0](docs/sdd/SPEC-SUIYIN-ADMIN-051/1.1.0/README.md) | 十五租户、Shell、领域页面及公开样本基线 |
| [052@1.2.0](docs/sdd/SPEC-SUIYIN-ADMIN-052/1.2.0/README.md) | 变声独立任务首次成功计次；失败、试听、重复回调不重复计 |
| [053@1.0.2](docs/sdd/SPEC-SUIYIN-ADMIN-053/1.0.2/README.md) | 销售使用统计分组、日期、部门、小计/合计及租户隔离 |
| [054@1.0.0](docs/sdd/SPEC-SUIYIN-ADMIN-054/1.0.0/README.md)、[055@1.1.0](docs/sdd/SPEC-SUIYIN-ADMIN-055/1.1.0/README.md)、[056@1.0.0](docs/sdd/SPEC-SUIYIN-ADMIN-056/1.0.0/README.md) | 页面证据、筛选与表头冻结、领域结构 |
| [060@1.1.0](docs/sdd/SPEC-SUIYIN-ADMIN-060/1.1.0/README.md)、[068@1.0.0](docs/sdd/SPEC-SUIYIN-ADMIN-068/1.0.0/README.md) | 平台默认结构、各租户菜单拖动、局部覆盖与同租户导航联动 |
| [062@1.0.0](docs/sdd/SPEC-SUIYIN-ADMIN-062/1.0.0/README.md) | 四个既有预约入口的列表/总量/柱线组合图 |
| [058@1.2.0](docs/sdd/SPEC-SUIYIN-ADMIN-058/1.2.0/README.md) | 13租户AI费用、82天固定合成样本、分类趋势与模型 |

菜单表与导航共用有效完整树。平台提供默认顺序和归属，租户明确调整的同级列表及被移动项父级优先；平台当前祖先链隐藏、删除和原权限始终生效。本轮刷新不把旧快照中的默认位置误判为用户明确拖动，也不删除已批准的拖动、预约图表和统计扩展。

变声页补回本轮已见的销售姓名筛选，仍按稳定销售身份计次，姓名相同不合并。销售使用统计只读取本租户专用快照；未知日期或未采集时保留表头与说明，不补0或借其他租户总量。工作账号样本汇总不冒充跨账号去重人数。

## 预览与发布边界

在仓根运行 `python -m http.server 8148 --bind 127.0.0.1`，用Google Chrome打开 `http://127.0.0.1:8148/prototype/_shell.html?tenant=bzds&page=customerManagement`。业务演示状态按租户与路由隔离；验收使用隔离浏览器或独立QA存储。单文件由生成器产出，不手工编辑。

真实后台只读；不接真实认证、发送、录音上传、共享数据库或生产写接口。原始客户截图、DOM捕获、连接配置和本机诊断资料不放入公开包。未采曲线点、其他筛选区间和未查看详情继续明确为未知或未采集。

当前候选的提交、tag、单文件验收和远端部署以 [release.json](release.json) 与实际发布回执为准；上述链接不单独证明本轮已部署。旧 [2026-09-20纠偏](docs/verification/pixel-correction-20260920.md)、[冻结验收](docs/verification/filters-sticky-20260920.md) 和版本化SDD仅证明各自当时范围。旧主题及好友独立页见 [历史入口](docs/history/before-admin-live-reference/README.md)，不作为当前Shell实现指令。

原型发布不等于生产上线。本轮没有新增工程Issue；既有工程执行分别由销售变声[#401](https://github.com/PetWebOrg/suiyin-admin/issues/401)、AI费用[#402](https://github.com/PetWebOrg/suiyin-admin/issues/402)、预约图表[#404](https://github.com/PetWebOrg/suiyin-admin/issues/404)、租户菜单[#432](https://github.com/PetWebOrg/suiyin-admin/issues/432)及各自精确合同承接，状态以远端Issue为准。15租户是原型验证清单，不是生产白名单；不更新开发进度表。
