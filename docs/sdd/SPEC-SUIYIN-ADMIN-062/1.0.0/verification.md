# 预约记录组合图本地验收

对应 SPEC-SUIYIN-ADMIN-062@1.0.0；2026-09-21 本地静态原型。

## 实现落点

- R001：预约记录列表/图表切换；保留分页和只读详情。
- R002/R004/R005：稳定预约键、上海日期、两组日期取交集、实体筛选和全筛选结果聚合；列表/图表同源。
- R003：每日柱形、范围内累计折线；双轴、鼠标提示、键盘左右/Home/End与Escape。
- R006：无效条件保留旧结果、空结果、缺日期、载入失败重试、一年范围内部横向滚动。
- R007：深圳20条样本明确为部分采样，未知日期留空；完整演示318条与采样JSON独立。
- R008：已有四租户范围、参考样本不当当前租户统计；保留共享表头冻结和预约设置页。

## 检查与证据

执行 `node verify.cjs`：30项通过，Google Chrome headless，无浏览器脚本错误。数值核对包括2/0/3→2/2/5、重复稳定键、相同客户不同预约、跨租户排除、上海时区和缺日期。所有检查名称、时间和结果见 [checks.json](evidence/checks.json)。

- [主图表](evidence/appointment-chart.png)：1513×1050，当前原型已人工查看。
- [列表](evidence/appointment-list.png)：保留字段、查看动作和分页。
- [日期提示](evidence/tooltip.png)：按日期显示两项数值。
- [窄窗](evidence/narrow.png)：1060×860，筛选自然换行，图表内部水平滚动；可通过页面纵向滚动查看下方内容。
- [交叉筛选](evidence/filtered.png)：独立预约日期与创建时间筛选。

源码语法、SPEC和Plan边界校验通过。页面改动仅新增两份预约专用资源及admin-content.html引用；其余工作任务留下的admin-content.js、admin-menu-tree.css/js、admin-navigation.js修改未覆盖。

## 真实能力与交付范围

上述为静态原型和本地演示验证，不证明真实数据库全量、服务端权限、PDM结果或生产统计已经实现。本次未触碰原采样JSON。用户后续授权完整推送，已创建工程Issue #404并分配陈宣宇；发布、单文件重验和通知以本次发布检查及独立交付回执为准。

预览由本目录preview-server.cjs仅监听127.0.0.1:8134；主预览URL为：

http://127.0.0.1:8134/prototype/_shell.html?tenant=yestar-sz&page=appointmentRecords&appointmentDemo=1&appointmentView=chart

完整演示URL参数仅控制本地数据和初始视图，界面显式标明“演示数据”。去掉两个appointment参数时，普通入口默认显示原采样列表。

## v2026092101-admin-appointment-chart 发布候选实测

从基线 255c2cd3f32181bedb7320f206b60cce0575177c 导出静态文件，仅覆盖本次11个源码/文档文件后生成离线单文件；其他任务的4个未提交文件未包含。生成物重新执行30项完整功能检查，全部通过、0脚本错误。file:// 打开离线HTML、阻断全部HTTP(S)请求后6项通过，包括318条演示、20条原样本、三参考租户隔离、视图切换、预约设置页，0外部请求与0脚本错误。

单文件检查发现生成器会将 parent.location.origin 替换成非法表达式，本次改用父地址解析origin，修复后重跑通过。离线页面见 [inline-chart.png](evidence/inline-chart.png)、[inline-checks.json](evidence/inline-checks.json)。公开样本检查15租户、765入口、11263行，无失败。

[生产Issue #404](https://github.com/PetWebOrg/suiyin-admin/issues/404) 已实际创建并分配陈宣宇，创建前后用户导向校验通过，status:todo。生产测试合同仍为计划，不代表已开工或已上线。SPEC、Plan、来源收敛、追踪与版本包结构均通过机器校验；提交/标签、远端字节、部署和两条SCRUM通知由独立交付回执记录，候选包不预写成功。
