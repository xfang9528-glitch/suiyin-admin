## Meta

- 租户：佰智德三
- 平台：PC
- 代码仓：suiyin-admin
- 提出人（群内昵称）：房昕

## 用户问题

全部艺星、画美和傲丽的管理员在账号页顶部与系统设置中仍看到不再需要的上下班时间选项，不确定是否还需要填写和维护这些配置。

## 完成后用户能感受到的变化

艺星、画美、傲丽的管理员维护账号时，不再需要寻找或填写上下班时间；仍可查看上班记录、确认在线状态，并使用“离开状态可转交”。其他租户继续按原方式设置时间。

## 已批准合同与截图

- SPEC：[SPEC-SUIYIN-ADMIN-076@1.0.1](https://github.com/xfang9528-glitch/suiyin-admin/blob/master/docs/sdd/SPEC-SUIYIN-ADMIN-076/1.0.1/spec.md)。
- Handoff：[I001](https://github.com/xfang9528-glitch/suiyin-admin/blob/master/docs/sdd/SPEC-SUIYIN-ADMIN-076/1.0.1/issue-handoff.md)。
- Test Contract：[T-R004-01、T-R004-02](https://github.com/xfang9528-glitch/suiyin-admin/blob/master/docs/sdd/SPEC-SUIYIN-ADMIN-076/1.0.1/test-contract.md)。
- 稳定追踪：`SPEC-SUIYIN-ADMIN-076@1.0.1 → R004 → AC-R004-01/02 → I001 → T-R004-01/02`。
- 本单只承接下面截图第3项。

![房昕确认的两项工程范围：本单对应第3项](https://github.com/xfang9528-glitch/suiyin-admin/blob/master/docs/verification/admin-iteration-20260930/requested-engineering-scope.png?raw=true)

## 实现范围

1. 全部正式艺星租户，以及画美医美-西安（`huamei-xian`）、傲丽医美-西安（`aoli-xian`）移除上下班时间配置。
2. 同时覆盖账号页顶部自动下班时间、系统设置中的同义配置行/入口，以及可达的新增/编辑弹窗。旧存储不能重新补出04:00或旧时间；已移除字段不参与新的表单校验或提交。
3. 上班记录、在线/工作状态、“离开状态可转交”保持原有行为；其他租户的时间设置保留。
4. 只移除配置入口，不额外删除历史配置或记录，不把本单扩大为停用已有后台自动调度。若生产实现发现还需改变执行逻辑，先回SPEC确认。

## 范围核对与验收

- 提出环境“佰智德三”是需求来源，不是本单删除时间入口的适用租户。适用范围按上文判定。
- 原型六个艺星（yestar-sz、yestar、yestar-bj、yestar-gz、yestar-hz、yestar-jx）是当前样例；生产须核对全部正式艺星归属，不硬编码六店，不靠品牌色或中文片段识别。
- 按AC-R004-01逐租户核对两处页面和全部可达表单；加入旧默认时间及旧自定义时间回填场景。
- 按AC-R004-02验证非适用租户保留原入口，并回归记录、状态和离开转交。CI报告保留T-R004-01/02标识。
- 新租户建立、账号入口改名、咨询称谓与三类岗位角色不在本单范围；菜单状态胶囊另单交付。

## 负责人及执行边界

- 负责人：@kitesky（王争）。本单为status:todo，分配不代表已经开工。
- 一般功能需求，建议P2 / enhancement；排期由负责人和房总确认。
- 原型已实现，生产代码与生产验收尚未完成；Test Contract保持planned。
- 开工在正式suiyin-admin工作区执行 Issue → worktree → Phase 1/2/3 → PR → 房总review；本交接不授权生产主分支直推或跨仓实现。
- 若发现接口、鉴权或迁移依赖，先列明依赖，不能把原型本地行为当作生产服务已实现。

<!-- issue-meta
tenant: 佰智德三
platform: PC
repo: suiyin-admin
reporter: 房昕
-->
