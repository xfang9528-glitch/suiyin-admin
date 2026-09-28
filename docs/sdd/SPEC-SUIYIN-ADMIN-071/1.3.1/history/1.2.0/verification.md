# 六艺星回访规则静态原型验证

- SPEC：SPEC-SUIYIN-ADMIN-071@1.2.0，2026-09-28。
- 范围：深圳、成都、北京、广州、杭州、嘉兴六个现有艺星租户；新增其余五家入口，非艺星不新增。
- 运行类型：static-html；只保存本浏览器按tenant隔离的演示规则。
- 1.1.0验证已另存history/1.1.0/；已发布SDD包保持原样。

## 模型、菜单和数据检查

| 检查 | 结果 | 证据 |
|---|---|---|
| 六租户模型隔离 | 18/18 PASS | checks/v1.2.0/tenant-model-results.json |
| 深圳既有25个模型场景兼容 | 25/25 PASS | checks/v1.2.0/sz-compatibility-results.json；继承1.1.0场景，使用1.2.0源码 |
| 菜单升级与范围审计 | 66/66 PASS：52项迁移、14项schema/范围审计 | checks/v1.2.0/menu-extension-results.json；同目录便携脚本已归档并复跑 |
| Chrome六租户交互 | 15/15 PASS；脚本异常0、外部请求0 | checks/v1.2.0/tenant-browser-results.json |
| file协议离线单文件 | 12/12 PASS；脚本异常0、外部请求0 | checks/v1.2.0/inline-tenants-results.json |
| HTTP综合单文件检查页 | 137/137 PASS，其中本轮071检查32/32；脚本异常0 | checks/v1.2.0/inline-check-page-results.json |
| 公开数据审计 | PASS；15租户、771数据页、11314行，2456个身份单元格及36个敏感字段，失败0 | prototype/sanitize-public-data.mjs --check |
| SPEC及Plan | PASS；15规则、19验收；static-html | validate-spec.mjs、validate-plan-boundary.mjs |
| 产品JS及补丁 | PASS | node --check、git diff --check |

模型源码SHA-256：540b398aa6701b8b106ba3630a68f3585a13735aff67945f1592cc2290deb56e。

独立审查将深圳fields/groups/permissions/fixtures/seed/evaluate与已发布HEAD对照，结果一致。不同租户及同租户重复创建的实例都不共享可变集合；跨租户账号、群组、人员条件和销售权限过滤不能命中其他租户数据。非法tenant不会回退到深圳。

菜单新增仅涉及五个租户的聊天分支与本租户menu；各保留已发布菜单revision的准确快照用于迁移，更旧配置继续原fallback。深圳和德三JSON没有改动，德三平台仍只有一个revisitRules定义。总入口由797增加到802，唯一路由仍89。

## Chrome预览与交互

主流程已实际打开成都Shell并进入编辑、打开北京Shell列表；页面标题与账号城市一致。已查看内容区域截图，布局没有新增遮挡：

- checks/v1.2.0/preview-yestar-editor.png
- checks/v1.2.0/preview-yestar-bj-list.png

六租户在同一Chrome上下文中逐一完成入口、21/26维度、当地合成账号/人员、保存、启停、刷新和切店回看验证；普通模式与QA存储互不影响。真实壳切换深圳至北京后显示目标租户规则。9个现有非艺星租户及unknown直接访问均不挂载回访规则、不新增回访存储。

深圳旧v2实体ID、启用状态与附加条件保留，取消编辑不写入草稿；旧v1仅显式导入，其他租户不读取深圳旧规则。跨租户账号写入候选规则无法保存，原规则和其他租户保持不变。1120宽度下成都编辑页没有页面横向溢出，保存按钮可达。

浏览器验收另外保存六张列表、成都/嘉兴编辑页和成都窄窗共9张内容区截图，全部为合成验收数据。主代理实际视检以下桌面/窄窗截图，未见新增布局遮挡：

- checks/v1.2.0/tenant-yestar-jx-editor.png
- checks/v1.2.0/tenant-yestar-narrow.png

详细断言、源文件SHA-256和截图索引见checks/v1.2.0/tenant-browser-results.json；便携复跑说明见同目录README.md。T006/T007已完成。

本机Google Chrome已打开成都入口：http://127.0.0.1:8148/prototype/_shell.html?tenant=yestar&page=revisitRules&v=1.2.0 。

## 完整推送前的离线单文件

房总在本地验收后以E022再次授权完整推送，已从当前产品源生成prototype/_shell_inline.html。file协议实际验证六租户的21/26维度、保存、启停、刷新、跨租户隔离及QA/普通模式隔离；六店旧回访统计仍独立，非艺星不新增，德三平台只登记一次。内嵌模型/UI函数、六租户菜单及合成数据与当前源文件一致，验收期间源摘要未变。

- 单文件：10,534,771 bytes；SHA-256 85f3f91f4a6e61d9f742299cab3f85d72fce5a93824a56353264dce5eae40775。
- 合成内容截图：checks/v1.2.0/inline-yestar-editor.png、inline-yestar-jx-list.png。
- 独立file验收证据：checks/v1.2.0/inline-tenants-results.json；不借旧版本单文件结果证明本版。

prototype/_inline-check.html保留原检查并增加32项六艺星回访检查，本轮实际共137项通过。历史1.1.0验收记录的菜单撤销局限保持原证据；本轮综合检查未复现该项，不因此声称全部平台菜单状态已重新验收或修改了旧菜单业务逻辑。

## 来源与交付边界

其他五店群发页目前为reference，不能拿其中深圳样本当作别店配置。各店账号页有本租户样本，但缺稳定账号ID和完整权限目录；本期采用明确合成的独立账号、人员、地区和好友。通用医美词汇是演示选项，不冒充已采集的实际标签库。各默认示例均为固定日期的相同验证场景，试算人数不代表业务量。

深圳原v1/v2存储键、实体ID和迁移逻辑保留；其余五店使用带tenant前缀的模型实体与独立存储键。没有跨租户复制已保存规则。

E021日常原型阶段已经完成；E022另行授权本版完整推送。此验证记录在发布前冻结，只证明已执行的本地检查；commit/tag、远端SDD、Cloudflare与SCRUM通知以本次真实发布回执为准，不由本地PASS推断。未创建工程Issue。真实定时运行、PC名单与实际接待权限接口仍待后续工程实施。
