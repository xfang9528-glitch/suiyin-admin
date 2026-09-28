# Tasks — 首次与最近一次直接作为基准选项

> Spec: SPEC-SUIYIN-ADMIN-071@1.3.1
> Plan: plan.md
> Status: implemented and locally verified; UI 7/7, file 13/13, HTTP 155/155 PASS; static-html; E029 publication in progress

- [x] T001 将1.3.0的SPEC/Plan/Tasks逐字归档history/1.3.0，保留旧证据。
- [x] T002 记录E028并更新R016/R019、AC及1.3.1 Plan，运行SPEC和Plan校验。
- [x] T003 原下拉展开六个事件选项，总15项；移除事件取值控件，合法旧pair回显和非法pair修复，等级来源保留。
- [x] T004 focused Chrome验证六tenant、保存/刷新、旧pair取消无迁写、非法参数修复、等级来源与窄窗，7/7 PASS、无脚本异常及外部请求；JS语法/diff检查PASS。
- [x] T005 视检正常下拉六个事件选项及1120窄窗，已启动Chrome打开8148深圳revisitRules（v=1.3.1）；证据见checks/v1.3.1/README.md。

E029明确授权完整推送，以下交付任务按真实证据逐项完成；不进入生产仓，不创建工程Issue，不更新进度表。

- [x] T006 同步现行PRD/流程图/设计规范/README及来源收敛；原位置替代冲突。23条来源、24组搜索、SPEC/Plan/收敛校验均通过。
- [x] T007 构建并验证单文件离线及综合自检，审计公开样本与交付包。file 13/13、HTTP 155/155（回访50/50）；公开样本审计0失败，66文件交付包审计通过、14个README相对链接可解析。
- [ ] T008 冻结版本化SDD与release清单，校验SPEC/Plan/收敛/远端包。
- [ ] T009 原型仓master提交并push，推独立tag，回读远端正文和文件树，确认ahead/behind=0/0。
- [ ] T010 核验对应commit的Cloudflare部署和实际可用的在线证据，打开Chrome预览。
- [ ] T011 SCRUM单独交付通知发送并回读，记录publication-receipt.json。
