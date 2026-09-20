> 本文记录发布前真实完成的本地验收，状态仍为implemented。公开证据为筛去业务数据和本机路径的检查投影，每份投影附原报告SHA256；它不等同于原始实站截图，也不预先宣称远端发布成功。

# 销售使用统计纠偏验收 — SPEC-SUIYIN-ADMIN-053@1.0.0

2026-09-20。状态 implemented；当前线上逐像素对照及11租户真实数据采集仍未完成。

## 已修复
- D01 标题和一行人数/消息/好友合计；移除额外大指标卡。
- D02–D05 日期取值、有效性与查询、上海今天、单日/范围与静态日历；保留样本日期并明确缺快照。范围含未采集日期不会伪造总量。
- D06 部门从本租户明细构造，不读取跨租户全局选项；标注仅为样本出现部门。
- D07–D09 按销售分组、合并序号/姓名、各组小计、tfoot全表合计，按销售汇总排序，不强制分页。
- D10–D12 数值和数值表头右对齐、空列为空，搜索/重置/导出同组，无列设置/刷新业务工具。
- D13 萌爪恢复采集空态；空、未采集、缺日期样本与错误分开，导出禁用条件完整。
- D14 全表合计不带销售姓名。CSV仅导出明细，避免小计/总计重复求和。
- 052@1.1.1同步主按钮蓝色、计数右对齐、直接区间日历，不恢复模式选择，不改计数逻辑。

## 验证
| 项目 | 结果 | 证据 |
|---|---|---|
| 15租户、统计结构、日期、分组排序、明细导出 | 258/258 PASS | evidence/usage-check.json |
| 菜单直链、错误/重试、跨租户响应拒绝 | 33/33 PASS | evidence/usage-boundary-check.json |
| 手输/日历与变声页联动 | 31/31 PASS | evidence/voice-integration-check.json |
| 日历键盘、取消、手输和共享CSS集成 | 34项 PASS | evidence/date-picker-check.json |
| 静态服务与本地字节一致 | 37/37 HTTP 200 | evidence/http-check.json |
| 4份真实采集独立交叉核验 | PASS | evidence/usage-data-check.json |
| JS语法、SPEC、Plan、diff空白检查 | PASS | 本轮命令输出 |

DOM使用实际本地HTML/CSS/JS与独立QA存储，不能证明Chrome像素、原生焦点或真实线上交互。日历为静态重建，hover部分为属性模拟校验，非真实指针截图。

## 来源覆盖与未完成
深圳94人/7679消息/1939好友；锦帛4/94/41；佰智德三1/12/1；萌爪0/0/0，均是2026-09-18快照。其他11租户展示“本租户销售使用统计尚未采集”，未从深圳复制。未知数据不是业务零值。

CUA直接打开Chrome仍nodeRepl.fetch request failed，公网只读访问也未成功。该路由当前按钮/hover色值、日期和部门弹层精确形态、同视口几何及导出生产格式仍待对照。蓝色主按钮参照用户提供的同后台截图，不能称为该路由本轮实测值。

## 预览
- 深圳：https://suiyin-admin.pages.dev/prototype/_shell.html?tenant=yestar-sz&page=salesMessageUsage
- 锦帛：https://suiyin-admin.pages.dev/prototype/_shell.html?tenant=jbfs&page=salesMessageUsage
- 萌爪：https://suiyin-admin.pages.dev/prototype/_shell.html?tenant=mengzhua&page=salesMessageUsage
- 变声：https://suiyin-admin.pages.dev/prototype/_shell.html?tenant=yestar-sz&page=salesVoiceStats

以下验收来自本地静态修改，未写真实后台；本轮后续已授权完整推送，远端完成以发布回执为准。旧通用数据文件保留，专用route不再消费参考样本。
