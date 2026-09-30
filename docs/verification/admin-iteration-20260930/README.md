# 2026-09-30 Admin 原型发布验收

发布：v2026093001-admin-accounts-menu。运行类型static-html。两新租户真实资料仍not-captured；无真实后台写入。

|检查|结果|
|---|---|
|账号与租户范围|60 PASS|
|菜单状态交互|17 PASS|
|拖动和撤销|2 PASS|
|咨询称谓、角色及失败恢复|24 PASS|
|参考角色目录差异保留|3 PASS|
|目标租户页面用语扫描|137 tenant×route，0脚本错误|
|完整Shell|5 PASS|
|单文件完整自检及HTTP/file://追加|324 PASS，0 FAIL，0脚本错误，0外部请求|
|公开样本脱敏|17租户、777页、11345行，0失败|

各组存在重叠，不相加为独立页面数量。单文件SHA-256：d41f537d341721252f09f4baf224dc3b1a0709230ba5293f94e93727bafd86e0。

[076合同](../../sdd/SPEC-SUIYIN-ADMIN-076/1.0.1/README.md) · [077合同](../../sdd/SPEC-SUIYIN-ADMIN-077/1.0.1/README.md)。生产待办[#448](https://github.com/PetWebOrg/suiyin-admin/issues/448)、[#449](https://github.com/PetWebOrg/suiyin-admin/issues/449)；原型通过不代表生产验收。

已附用户指定工程范围截图与部分完整Shell截图。复跑脚本记录原验收环境（Windows、本机Chrome、Playwright、5200本地服务），路径按本地环境调整；consultation前缀文件来自077独立目录，原输出文件名保持脚本定义。
