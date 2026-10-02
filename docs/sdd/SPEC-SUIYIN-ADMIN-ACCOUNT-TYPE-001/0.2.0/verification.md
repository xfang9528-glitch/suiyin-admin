# 0.2.0 完整两类验收与公开数据投影

2026-10-02最新执行：用户在剩余15条是否均为个微的明确问题后回复“好的，完整推送，并给房昕创建issue，提出人房昕，提出环境佰智德三”。确认原话、问题上下文及14个精确名/15个账号槽位保存在本地captures/user-confirmed-account-types.json；没有根据缺失字段默认个微。

- 43行环境、1,139个账号均有wx/qw类型，无第三业务分类或类型缺口。
- 个微970：在线748、掉线222；企微169：在线51、掉线118；合计1,139：在线799、掉线340。
- 画美西安使用同次全量总览/明细整行更新：174/104/70，个微113/98/15、企微61/6/55；旧171/88/83及来源时间保存在本地审计元数据，未混用新名单与旧计数。
- 3条历史显式provider证据仅补类型；其它原状态、名称顺序及重名槽位保持。
- 公开原型data仅将账号名中的13处完整手机号掩码为前三位+****+后四位。普通账号名、分类顺序、重名条目、各类及总汇总均不变；代理名使用相同规则，本次无需掩码。
- 公开data排除内部typeEvidence/statusSnapshotEvidence及本机证据路径。原始captures/分析JSON留在本机，不作为公开仓数据；public-projection-audit.json只含掩码计数、哈希和不变量，无真实手机号。
- build-account-classifications.cjs 13项自测通过；--write-prototype只有零缺口才成功。本次成功写入，公开投影完整手机号检测为0。
- 全量组件验收12组通过（component-verification.json），集成回归8组通过（component-integration-verification.json），无未处理JS错误/外部请求。
- captures/full-data-yestar.png、full-data-huamei.png来自实际完整43行公开投影Mock，没有页面内存fixture替换；full-data-visual-verification.json记录全量1139/799/340与图像路径。主线程已刷新可见Chrome全量43行，确认无第三业务类型并定位画美西安。
- check-inline-delivery.cjs只验证本页已有公开Mock：HTTP _shell.html、HTTP _shell_inline.html、file _shell_inline.html三种入口均通过。每种入口验证43环境/1139账号、个微970/748/222、企微169/51/118、汇总1139/799/340、118代理卡片、三态排序、页签返回后排序及滚动保持，未回退旧演示数据；JS异常、console.error及外部请求均为0。file入口仅允许file/data/about协议。
- 发行记录为inline-delivery-verification.json；_shell_inline.html SHA-256为a460fcb919bda7b95b2d57d7cff3217edf264a196920913a885305f07230150c，data/all-account-status.js文件SHA-256为1c7bed48063d4e002e6cc72fe43dbd338af18e0be940c0c0918cd7ac59227a04。
- 本节记录本地原型、数据及测试完成情况；远端推送、版本化SDD、Issue及发布验证由主交付链记录，不能以本节替代远端交付凭证。

以下为补齐数据前的历史状态，已由上述完整结果取代。

---
# 0.2.0 纠正后的验收状态（历史）

2026-10-02：用户明确账号类型在创建时确定，撤销第三分类。当前代码与SPEC/Plan已改为只含个微、企微及汇总；全量Mock仍有15个旧条目等待直接类型来源，尚未覆盖正式预览数据。

- 画美整行更新证据完整：174/104/70，个微113/98/15、企微61/6/55。
- 3条历史显式provider按精确环境及人设名补类型，不复制历史在线状态。
- 分类分析1139条：个微955、企微169、开发采集缺口15；缺口不是业务分类。
- build-account-classifications.cjs的12项自测通过。实际--write-prototype拒绝缺口数据，原Mock哈希不变。
- SPEC与Plan结构和运行边界通过。
- captures/corrected-huamei-example.png：仅在隔离headless页面内存使用画美及傲丽两行完整证据的视觉验收，未过滤或覆盖正式Mock；两类与汇总均清晰，页面无第三分类。
- 8组隔离集成fixture通过（component-integration-verification.json）：首次无效数据反馈、重试、保留正确旧DOM及快照、父级不回退旧演示数据、租户隔离、分组和sticky。无外部请求及未处理JS错误。
- 全量组件验收和Chrome全量数据刷新需补齐15条实际创建类型后执行；不声称已完成。

以下为0.1.0历史验收，第三分类语义已被用户纠正撤销，不代表当前验收结论。

---
# 个微与企微分类原型验收

日期：2026-10-02。用户“执行”批准设计与总览各环境账号明细只读核对。实现仅本地静态原型，未发布。

## 结果

- 43行原环境及1,136个账号条目保留，原名称、顺序、重名、在线/掉线归属和汇总均不变。
- 27个环境取得完整的本次类型明细；34行分类完整（含8个原总览零账号行），画美西安1行部分匹配，8行保留待核对。
- 已核实1,117个：个微948（在线737、掉线211）；企微169（在线45、掉线124）。未知19（在线1、掉线18）。
- 艺星：个微212/186/26，企微3/0/3，汇总215/186/29；右侧名单同口径分组。
- 缺口：2个环境切换进入登录页共5账号；6个环境无切换入口共13账号；画美西安1个原名称无法匹配。无推断分类或强行配平。
- 深圳和画美明细采集时数量已变化；明细只提供可靠类型，未将新账号或新在线状态混入原总览。

## 证据与验收

| 范围 | 证据 |
|---|---|
| R001 分类统计及布局 | captures/final-yestar-preview.png、captures/final-visible-geometry.json |
| R002/R003 名单守恒与重名 | classification-report.json、build-account-classifications.cjs内置多重集合校验 |
| R004/R005 未知、零、冲突 | component-verification.json边界fixture；captures/*-account-types.json |
| R006 交互及隔离 | component-verification.json：排序三态、固定表头、118代理卡、键盘页签和滚动恢复 |
| 不可读取环境 | captures/missing-environment-entry.json、available-environment-menu.txt、sytest-account-types.json、yxjd-account-types.json |

最终运行 `check-classification-preview.cjs` 11项通过，无JS错误、无外部请求；fixture仅在独立headless页面内存。语法检查及git diff --check通过（只有既有Windows换行提示）。SPEC及Plan校验0错误。正式Chrome在1670×1400视口定位艺星行，个微长名单分类标题滚动固定在表头下方（header bottom93.8、标题top94），不覆盖表头。

预览：http://127.0.0.1:5200/prototype/_shell.html?tenant=bzds&page=allWeChatStatus
