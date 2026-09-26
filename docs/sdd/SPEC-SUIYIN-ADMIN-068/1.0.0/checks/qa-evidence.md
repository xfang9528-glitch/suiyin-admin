# SPEC-068 浏览器验收证据

- 合同：SPEC-SUIYIN-ADMIN-068@1.0.0。
- 最终结果：**29 PASS，0 FAIL，0 pageerror**。
- 浏览器：Google Chrome 153.0.8010.54，headless，独立非持久化 context。
- 运行完成：2026-09-26T10:36:10Z（Asia/Shanghai 18:36:10）。
- 地址：`http://127.0.0.1:8148/prototype/_shell.html?tenant=yestar-sz&page=menu&qa=1`。
- 存储隔离：所有用例均带 `qa=1`；未连接用户 Chrome profile，未清空或改写用户存储。
- 验收器只位于本 `checks/` 目录，未引入项目测试框架或依赖安装。
- 重跑命令：`node "E:/AI 项目/prototype-sdd/specs/068-admin-tenant-menu-drag-sort/checks/verify-tenant-menu.cjs"`。

## 覆盖与判定

| 情景 | 结果 | 关键 Oracle |
|---|---|---|
| 15 个登记租户各自的普通 menu | 15 PASS | 六列表头、同层顺序、独立手柄、无数字编辑；每租户真实执行组内、一级整组、跨组移动，每步比较表格与实际侧栏的父级/相对顺序；身份、权限、字段及页面库存不变 |
| persistence | PASS | 一条移动记录、撤销独立记录、先前字段保留、取消弹窗保留撤销、刷新及新窗口恢复 |
| windows | PASS | 同租户窗口实时联动、无整页重载、iframe 状态保留；其他租户及平台模型不变；外部更新清除旧撤销 |
| failure | PASS | QA 存储写入抛错后模型、记录、已保存值和另一窗口侧栏不变；失败撤销仍可重试 |
| cancel-keyboard | PASS | 原位、Escape、表外落下、失焦无修改；键盘组内移动、跨组取消 |
| disabled | PASS | 旧三级完整保留、相关分支禁拖；持久化后侧栏三级入口能实际打开且没有 undefined 路由；只读和空态无可用拖动 |
| platform-first | PASS | 先存的平台父级进入租户表格/侧栏，租户调整后不弹回；未调整租户继续继承 |
| platform-later | PASS | 租户移动项父级保留，未移动项父级继续跟平台；平台当前祖先隐藏独立生效，恢复后回到租户位置 |
| platform-order | PASS | 已调整一级与二级同级列表保留；未调整分组继续继承平台的新顺序 |
| invalid-parent | PASS | 租户目标被平台删除后回退有效父级，页面不丢；平台目标恢复后原覆盖重新生效 |
| external-drag | PASS | 另一窗口数据修改取消当前未提交拖动并载入新字段 |
| duplicate-route | PASS | 异常重复路由保留行库存、禁用拖动并给出冲突提示 |
| legacy-settings | PASS | 旧数字排序、名称、隐藏及权限保留，不自动生成新版拖动覆盖 |
| duplicate-hidden | PASS | 重复配置不能复活平台隐藏入口，无关的已有本地一级顺序仍有效 |
| scroll-touch | PASS | 收起分组悬停展开、取消恢复、真实边缘滚动、冻结表头、CDP touch 真实跨组移动 |

## 视觉核对

已实际查看最终 `verified-tenant-default.png` 与 `verified-tenant-drag.png`：六列布局、手柄、同层序号、本租户提示、拖影文字、目标一级高亮与插入线清楚可读；冻结表头没有随表体滚动。默认截图是完成三类移动后的可交互状态。

## 证据文件

- `tenant-menu-results.json`：本次完整 29 情景的逐项结果、耗时、浏览器版本及错误集合。
- `verify-tenant-menu.cjs`：可重跑的真实浏览器检查。
- `tested-product-files.sha256`：最终验收后记录的 5 个产品文件 SHA256；后续产品修改将使这份证据不再对应新字节。
- `verified-tenant-default.png`、`verified-tenant-drag.png`：最终运行的截图。

本文件验证静态原型的本地状态和导航行为；不代表服务端、跨设备、真实授权系统或生产交付已完成。平台既有 060 回归由主代理独立执行并在总验收文档汇总。
