## Meta

- 租户：佰智德三
- 平台：PC
- 代码仓：suiyin-admin
- 提出人（群内昵称）：房昕

## 用户问题

管理员只想切换菜单显示或隐藏，也要逐行进入编辑弹窗；操作步骤多，保存失败时还需要确认原状态是否保留。

## 完成后用户能感受到的变化

普通菜单和平台菜单都可在表格当前行直接点选“显示 / 隐藏”，保存成功后导航立即按原作用范围更新；保存失败恢复此前状态并提示重试。

## 已批准合同与截图

- SPEC：[SPEC-SUIYIN-ADMIN-076@1.0.1](https://github.com/xfang9528-glitch/suiyin-admin/blob/master/docs/sdd/SPEC-SUIYIN-ADMIN-076/1.0.1/spec.md)。
- Handoff：[I002](https://github.com/xfang9528-glitch/suiyin-admin/blob/master/docs/sdd/SPEC-SUIYIN-ADMIN-076/1.0.1/issue-handoff.md)。
- Test Contract：[菜单胶囊8项测试](https://github.com/xfang9528-glitch/suiyin-admin/blob/master/docs/sdd/SPEC-SUIYIN-ADMIN-076/1.0.1/test-contract.md)。
- 稳定追踪：`SPEC-SUIYIN-ADMIN-076@1.0.1 → R005–R008 → AC-R005-01/02、AC-R006-01/02、AC-R007-01、AC-R008-01 → I002 → T-R005-01/02/03、T-R006-01/02、T-R007-01、T-R008-01/02`。
- 本单只承接下面截图第4项。

![房昕确认的两项工程范围：本单对应第4项](https://github.com/xfang9528-glitch/suiyin-admin/blob/master/docs/verification/admin-iteration-20260930/requested-engineering-scope.png?raw=true)

## 实现范围

1. 普通菜单`menu`与佰智德三平台菜单`allMenu`的状态列共用“显示 / 隐藏”双段胶囊，保留原可编辑范围。点不同值直接提交，提交中阻止重复；点已选项不重复保存、不加记录或成功提示。
2. 两个选项始终有文字、选中态和可见键盘焦点；支持键盘激活；点击状态不触发拖动或树展开。原编辑弹窗读取同一状态，取消不保存，其他编辑字段保持。
3. 普通菜单只影响本租户，平台菜单沿用原平台范围。父级隐藏后整支导航隐藏，恢复父级仍保留子菜单独立隐藏；租户显示不能绕过平台限制。隐藏项继续留在表中便于恢复。
4. 成功后导航、刷新/重开、既有跨窗口同步和隐藏当前页的回退均沿用原规则，不清空排序、父级覆盖、权限或自定义名。
5. 保存失败恢复此前值和相关记录，不传播新导航、不报成功，提示“未能保存，菜单状态已恢复，请重试”；允许重试。读取外部更新后再操作，不用过时整树覆盖其他修改。
6. 保留普通六列、平台九列、冻结表头、操作列、树层级、拖动与滚动。在1280×720和1480×900核对胶囊文字、选中/焦点、禁用态及横纵滚动后的可用性。

## 开工核实与验收

- 提出环境为佰智德三，普通菜单适用于原有各租户，平台菜单仅在原平台能力范围内；不新增权限或扩大作用范围。
- 复用生产现有保存、鉴权与租户模型；以真实服务回执决定成功和导航变化，禁止用原型localStorage代替生产持久化。SPEC R008的静态边界继续约束原型证据。
- Phase 1核对失败原子性及外部更新处理；如现有接口无法保证，先列依赖并走对应正式流程，不跨仓直推、不悄悄改变业务规则。
- 自动化覆盖不同值提交、同值无操作、编辑取消、父子/平台限制、刷新/多窗口、失败回滚与外部更新。T-R005-03、T-R008-02保留人工视觉Oracle与可访问截图证据。
- 以本单6条AC与8个Test ID验收，PR/CI报告保留编号。当前测试合同为planned，原型通过不代表生产通过。
- 上下班时间入口移除另单交付；新增租户、账号改名、咨询称谓与岗位角色不在本单范围。

## 负责人及执行边界

- 负责人：@kitesky（王争）。状态为status:todo，分配不代表已开工。
- 一般功能需求，建议P2 / enhancement；排期由负责人和房总确认。
- 生产按 Issue → worktree → Phase 1/2/3 → PR → 房总review；本交接不授权生产主分支直推。

<!-- issue-meta
tenant: 佰智德三
platform: PC
repo: suiyin-admin
reporter: 房昕
-->
