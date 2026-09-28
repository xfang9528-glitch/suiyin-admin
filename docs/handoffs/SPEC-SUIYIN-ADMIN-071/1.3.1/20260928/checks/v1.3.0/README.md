# 回访基准选项本地验收

对应 SPEC-SUIYIN-ADMIN-071@1.3.0。2026-09-28 更新；静态HTML、本地合成事件，没有真实CRM/等级历史接入、后台定时任务或PC每日名单。本轮为日常原型修改，不表示完整推送。

## 已执行检查

| 检查 | 实际结果 | 范围 |
| --- | --- | --- |
| anchor-model-verification.cjs | 36/36 PASS | 12个独立基准、预约名称及旧ID、21/26筛选、首次/最近一次、人工/AI来源、北京时间及毫秒边界、未来/未知/空/无效历史、当前等级条件独立、参数必填、六tenant独立事件与真实试算接线 |
| tenant-model-verification.cjs | 18/18 PASS | 原六租户模型回归，目录/权限/身份与实例隔离 |
| sz-compatibility-verification.cjs | 25/25 PASS | 原深圳模型回归，日期/消息/节点/范围/权限及旧默认结果 |
| anchor-ui-verification.cjs | 9/9 PASS | 六tenant12选项/存储隔离、新控件切换、摘要/试算/保存刷新、复制节点、取消、旧5日期无迁写、坏配置修复、写失败保留原数据、1120窄窗与帮助；零脚本异常/零外部请求 |

各结果JSON保存实际执行时间及模型SHA-256。当前三份均绑定 `e5f01e95983b3288735eb31e3eed9a908114365e1e946b13e126b084ce24aac7`。后两份脚本由1.2.0检查复制，仅替换版本说明后重新执行，旧证据保持原样。

总计88组检查全部通过。浏览器结果另外绑定UI JS与CSS的SHA-256。已视检编辑页、AI等级试算、下拉展开与1120窄窗：来源和运行时间控件可读，摘要一致，保存按钮可达，无横向溢出。下拉按现有组件滚动显示全部12项。

干净补图见anchor-clean-preview-results.json：使用新临时Chrome context、只改QA草稿且未保存，提示自然消失后截图，无DOM隐藏或高度修改。anchor-dropdown-options.png与anchor-dropdown-new-options.png展示正常下拉滚动的上下状态；anchor-grade-ai-editor.png、anchor-grade-narrow.png为附属控件及窄窗。补图已目视，无提示遮挡，新增7项可正常显示。

本地服务8148返回HTTP 200；已使用Google Chrome打开`/prototype/_shell.html?tenant=yestar-sz&page=revisitRules&v=1.3.0`。该入口是当前多文件本地预览，1.2.0单文件和线上发布保持原版本。独立CDP可见窗口方案连接失败后未用于验收，最终采用普通Chrome启动预览；自动检查使用前述独立临时Chrome context完成。

## 行为证据

- 旧5日期anchor ID不变；appointment在回访基准中显示“预约日期”，仍使用原日期值。旧规则无需新字段，默认添加日期试算保留原人数和节点分布。
- 到店、购买、划扣分开读取，先排除晚于筛选时点的事件，再取首次或最近一次。日期按北京时间自然日转换；完整空历史表示未发生，缺失或坏历史表示无法判断。
- 人工/AI等级历史互不回退。重复同级评定不重置；再次进入目标级别取最近一次。实测先D后A仍命中D的到期节点；显式添加当前D选中条件后未入选，显式排除当前A后被排除。
- 六个tenant各自产生独立合成账号、好友与历史；新增事件不意味着接入了实站数据。划扣沿用客户资料核销记录术语，不与购买收款混用。

## 复跑

从原型仓 `suiyin-admin` 根目录运行三个Node脚本；也可用 `PROTOTYPE_ROOT` 指向该仓。脚本只读取产品源文件并写本目录结果，不修改产品或浏览器用户数据。

```powershell
node '<checks-directory>/anchor-model-verification.cjs'
node '<checks-directory>/tenant-model-verification.cjs'
node '<checks-directory>/sz-compatibility-verification.cjs'
```

浏览器脚本需要本地预览服务（默认8148）、Google Chrome及Playwright。通过`PLAYWRIGHT_MODULE`指定已有模块，通过`PROTOTYPE_BASE_URL`指定服务。使用独立临时context，仅写合成QA数据，关闭后不改个人浏览器规则。截图仅内容iframe，不包含主壳真实账号姓名。产品JS语法与git diff --check另行通过。

本轮仅改3个产品文件：`prototype/admin-revisit-rules-model.js`、`prototype/admin-revisit-rules.js`、`prototype/admin-revisit-rules.css`。旧1.2.0发布包、inline、source-convergence和verification保留历史状态；本轮证据只在本目录记录。
