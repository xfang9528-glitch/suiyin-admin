/* Independent business-oracle checks for SPEC-SUIYIN-ADMIN-071@1.1.0.
 * Loads the saved static model without modifying it or the historical v1 checks.
 */
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');

const modelRelativePath = 'prototype/admin-revisit-rules-model.js';
function findPrototypeRoot() {
  if (process.env.PROTOTYPE_ROOT) {
    const candidate = path.resolve(process.env.PROTOTYPE_ROOT);
    if (fs.existsSync(path.join(candidate, modelRelativePath))) return candidate;
    throw new Error('PROTOTYPE_ROOT must point to the prototype repository containing ' + modelRelativePath);
  }
  for (const start of [__dirname, process.cwd()]) {
    let candidate = start;
    while (true) {
      if (fs.existsSync(path.join(candidate, modelRelativePath))) return candidate;
      const parent = path.dirname(candidate);
      if (parent === candidate) break;
      candidate = parent;
    }
  }
  throw new Error('Prototype repository not found. Run this check from its repository or set PROTOTYPE_ROOT to that checkout.');
}
const file = path.join(findPrototypeRoot(), modelRelativePath);
const source = fs.readFileSync(file, 'utf8');
const sandbox = { console };
vm.createContext(sandbox);
vm.runInContext(source, sandbox, { filename: modelRelativePath });
const m = sandbox.RevisitRuleModel;
const results = [];
const plain = value => JSON.parse(JSON.stringify(value));
const clone = plain;
const condition = (field, op, value = '', values = []) => ({ field, op, value: String(value), values, start: '', end: '', min: '', max: '' });
const node = (id, day, include = [], exclude = []) => ({ id, day: String(day), note: '', include, exclude });
function base(days = [3, 5, 7]) {
  return { ...m.emptyRule(), id: 'test-rule', name: '独立节点验收', anchor: 'added',
    scope: { groupIds: ['media'], accountIds: ['douyin-01'] },
    nodes: days.map(day => node('test-day-' + day, day)), runAt: '01:00', enabled: false };
}
function test(name, requirements, fn) {
  try { fn(); results.push({ name, requirements, status: 'PASS' }); }
  catch (error) { results.push({ name, requirements, status: 'FAIL', error: error.message }); }
}
function evaluate(rule, date = '2026-09-27') {
  const result = m.evaluate(rule, date);
  assert.ok(!result.errors?.length, 'Unexpected validation errors: ' + JSON.stringify(result.errors));
  return result;
}
function row(rule, date, friendId = 'demo-f01') {
  const found = evaluate(rule, date).rows.find(item => item.friend.id === friendId);
  assert.ok(found, friendId + ' should remain in the authorized candidate evidence');
  return found;
}
function ids(rows, status) { return Array.from(rows.filter(item => item.status === status), item => item.friend.id).sort(); }

test('新种子只有一条规则，含独立第3/5/7天节点', ['R004', 'R015'], () => {
  const rules = m.seedRules();
  assert.equal(rules.length, 1);
  assert.equal(rules[0].anchor, 'added');
  assert.deepEqual(Array.from(rules[0].nodes, item => String(item.day)).sort((a,b) => +a - +b), ['3', '5', '7']);
  assert.equal(new Set(rules[0].nodes.map(item => item.id)).size, 3);
  assert.equal(rules[0].enabled, false);
  assert.equal(rules[0].runAt, '01:00');
  assert.equal(m.validate(rules[0]).length, 0);
});
test('完整群发维度与共同日期基准保留', ['R002', 'R004'], () => {
  assert.equal(m.fields.filter(item => item.include).length, 21);
  assert.equal(m.fields.filter(item => item.exclude).length, 26);
  for (const anchor of ['added', 'consulted', 'filed', 'appointment', 'revisited']) {
    const rule = base(); rule.anchor = anchor;
    assert.equal(m.validate(rule).length, 0, anchor + ' must remain available as an anchor');
  }
});
test('同好友只有当日到期节点，3天/空档/5天/7天依次命中', ['AC-R004-01'], () => {
  const rule = base();
  for (const [date, status, day] of [['2026-09-27', 'included', '3'], ['2026-09-28', 'not-matched', null], ['2026-09-29', 'included', '5'], ['2026-10-01', 'included', '7']]) {
    const result = evaluate(rule, date), found = row(rule, date);
    assert.equal(found.status, status, date);
    assert.equal(found.nodeDay, day, date);
    assert.equal(found.nodeId, day === null ? null : 'test-day-' + day, date);
    assert.equal(result.rows.filter(item => item.friend.id === 'demo-f01').length, 1);
  }
});
test('同一运行日按每位好友日期分别命中3/5/7天，行身份不重复', ['R004', 'R011'], () => {
  const result = evaluate(base());
  assert.equal(result.rows.find(item => item.friend.id === 'demo-f01').nodeDay, '3');
  assert.equal(result.rows.find(item => item.friend.id === 'demo-f05').nodeDay, '5');
  assert.equal(result.rows.find(item => item.friend.id === 'demo-f07').nodeDay, '7');
  assert.equal(new Set(result.rows.map(item => item.friend.accountId + '|' + item.friend.id)).size, result.rows.length);
});
test('第0天合法且不能选中运行时点之后才添加的好友', ['R004', 'R008'], () => {
  const rule = base([0]);
  assert.equal(m.validate(rule).length, 0);
  rule.runAt = '09:59';
  assert.ok(!evaluate(rule, '2026-09-24').rows.some(item => item.friend.id === 'demo-f01'));
  rule.runAt = '10:00';
  assert.equal(row(rule, '2026-09-24').status, 'included');
  assert.equal(row(rule, '2026-09-24').nodeDay, '0');
});
test('来源节点复制只覆盖条件，目标身份/时间/说明及共同设置不变', ['AC-R015-01', 'AC-R015-02'], () => {
  const rule = base(), sourceNode = rule.nodes[0], targetNode = rule.nodes[1];
  sourceNode.note = '来源说明'; sourceNode.include = [condition('grade', 'in', '', ['A级'])];
  sourceNode.exclude = [condition('outbound', 'within-days', 2)];
  sourceNode.results = ['source-result']; sourceNode.permissions = ['source-permission'];
  targetNode.note = '目标说明保留'; targetNode.include = [condition('status', 'in', '', ['异常'])];
  const saved = clone(rule), copied = m.copyNodeConditions(sourceNode, targetNode);
  assert.equal(copied.id, targetNode.id); assert.equal(copied.day, '5'); assert.equal(copied.note, '目标说明保留');
  assert.deepEqual(plain(copied.include), plain(sourceNode.include)); assert.deepEqual(plain(copied.exclude), plain(sourceNode.exclude));
  assert.ok(!copied.results && !copied.permissions);
  assert.deepEqual(plain(rule), saved, 'Copy is pure and may not mutate the source rule or target argument');
});
test('复制条件双向独立，修改节点不联动来源或共同账号', ['AC-R015-01'], () => {
  const rule = base(); rule.nodes[0].include = [condition('grade', 'in', '', ['A级'])];
  rule.nodes[0].exclude = [condition('inbound', 'within-days', 2), condition('outbound', 'within-days', 2)];
  const copied = m.copyNodeConditions(rule.nodes[0], rule.nodes[1]);
  copied.include[0].values.push('B级'); copied.exclude[0].value = '3';
  assert.deepEqual(plain(rule.nodes[0].include[0].values), ['A级']); assert.equal(rule.nodes[0].exclude[0].value, '2');
  rule.nodes[0].exclude[1].value = '4'; assert.equal(copied.exclude[1].value, '2');
  assert.equal(rule.nodes[1].include.length, 0); assert.equal(rule.nodes.length, 3);
  assert.equal(rule.runAt, '01:00'); assert.deepEqual(plain(rule.scope), { groupIds: ['media'], accountIds: ['douyin-01'] });
});
test('新增节点无预猜日期且生成不同身份', ['R008', 'R015'], () => {
  const first = m.emptyNode(), second = m.emptyNode();
  assert.equal(first.day, ''); assert.equal(second.day, ''); assert.ok(first.id && second.id && first.id !== second.id);
  assert.deepEqual(plain(first.include), []); assert.deepEqual(plain(first.exclude), []);
});
test('空节点、缺失/非法/重复天数和重复身份均阻止保存', ['AC-R015-03', 'R008'], () => {
  const bad = [[], null, [node('a', '')], [node('a', -1)], [node('a', 1.5)], [node('a', 'abc')], [node('a', 3), node('b', 3)], [node('a', '03'), node('b', 3)], [node('same', 3), node('same', 5)]];
  for (const nodes of bad) { const rule = base(); rule.nodes = nodes; assert.ok(m.validate(rule).length, JSON.stringify(nodes)); }
  const rule = base(); rule.anchor = 'unknown-date'; assert.ok(m.validate(rule).length);
});
test('节点仅需到期，零额外条件或合法零命中仍可保存', ['AC-R008-01'], () => {
  const rule = base([999]);
  assert.equal(m.validate(rule).length, 0); assert.equal(evaluate(rule).counts.included, 0);
  rule.nodes = [node('due', 3)]; assert.equal(row(rule, '2026-09-27').status, 'included');
});
test('节点附加选中AND与同字段多值OR', ['AC-R003-01'], () => {
  const rule = base([3]);
  rule.nodes[0].include = [condition('grade', 'in', '', ['A级', 'B级']), condition('demand1', 'in', '', ['皮肤管理'])];
  assert.equal(row(rule, '2026-09-27', 'demo-f02').status, 'included');
  rule.nodes[0].include[1].values = ['眼部整形'];
  assert.equal(row(rule, '2026-09-27', 'demo-f02').status, 'not-matched');
});
test('节点排除取OR，未知消息不会当作无联系', ['AC-R003-01', 'AC-R010-01'], () => {
  const rule = base([3]); rule.nodes[0].exclude = [condition('inbound', 'within-days', 2), condition('outbound', 'within-days', 2)];
  const result = evaluate(rule);
  assert.deepEqual(ids(result.rows, 'included'), ['demo-f01', 'demo-f12', 'demo-f16']);
  assert.deepEqual(ids(result.rows, 'excluded'), ['demo-f02', 'demo-f03', 'demo-f11']);
  assert.deepEqual(ids(result.rows, 'unknown'), ['demo-f04', 'demo-f10']);
});
test('双方消息保持AND，单向不误排除', ['R003', 'R005'], () => {
  const rule = base([3]); rule.nodes[0].exclude = [condition('both', 'within-days', 2)];
  assert.equal(row(rule, '2026-09-27', 'demo-f02').status, 'included');
  assert.equal(row(rule, '2026-09-27', 'demo-f03').status, 'included');
  assert.equal(row(rule, '2026-09-27', 'demo-f11').status, 'excluded');
  assert.equal(row(rule, '2026-09-27', 'demo-f04').status, 'unknown');
});
test('48小时包含边界，超一分钟不命中，未来消息不计', ['R005', 'Q002'], () => {
  const rule = base([4]); rule.nodes[0].exclude = [condition('inbound', 'within-days', 2)];
  rule.runAt = '16:00'; assert.equal(row(rule, '2026-09-28', 'demo-f02').status, 'excluded');
  rule.runAt = '16:01'; assert.equal(row(rule, '2026-09-28', 'demo-f02').status, 'included');
  rule.nodes[0].day = '2'; rule.runAt = '15:59'; assert.equal(row(rule, '2026-09-26', 'demo-f02').status, 'included');
  rule.runAt = '16:00'; assert.equal(row(rule, '2026-09-26', 'demo-f02').status, 'excluded');
});
test('系统/失败消息不排除，成功群发与手机消息计入', ['R005', 'Q003'], () => {
  const rule = base([3, 5]); rule.nodes.forEach(item => { item.exclude = [condition('outbound', 'within-days', 2)]; });
  assert.equal(row(rule, '2026-09-27', 'demo-f12').status, 'included');
  assert.equal(row(rule, '2026-09-27', 'demo-f03').status, 'excluded');
  assert.equal(row(rule, '2026-09-27', 'demo-f06').status, 'excluded');
});
test('近期消息仅跳过本次节点，不取消后节点或重算锚点', ['AC-R005-01', 'INV004'], () => {
  const rule = base([3, 5]); rule.nodes.forEach(item => { item.exclude = [condition('inbound', 'within-days', 2), condition('outbound', 'within-days', 2)]; });
  const before = clone(rule);
  assert.equal(row(rule, '2026-09-27', 'demo-f02').status, 'excluded');
  assert.equal(row(rule, '2026-09-28', 'demo-f02').status, 'not-matched');
  const later = row(rule, '2026-09-29', 'demo-f02'); assert.equal(later.status, 'included'); assert.equal(later.nodeDay, '5');
  assert.deepEqual(plain(rule), before, 'Evaluation cannot mutate rule or progress state');
});
test('共同账号范围先约束，节点账号条件只能收窄', ['AC-R009-01', 'INV002'], () => {
  const rule = base([3]); rule.nodes[0].include = [condition('account', 'in', '', ['xhs-01'])];
  const result = evaluate(rule); assert.equal(result.counts.included, 0); assert.ok(!result.rows.some(item => item.friend.accountId === 'xhs-01'));
  rule.nodes[0].include = []; rule.nodes[0].exclude = [condition('account', 'in', '', ['media-01'])];
  assert.ok(evaluate(rule).rows.filter(item => item.status === 'included').every(item => item.friend.accountId !== 'media-01'));
});
test('权限收缩立即移出动态群组，显式失效账号阻止保存', ['AC-R010-01', 'R009'], () => {
  const saved = m.permissions.managementAccountIds;
  try {
    m.permissions.managementAccountIds = saved.filter(id => id !== 'media-01');
    const rule = base([3]); const result = evaluate(rule);
    assert.ok(!m.resolveAccountIds(rule.scope).includes('media-01'));
    assert.ok(!result.rows.some(item => item.friend.accountId === 'media-01'));
    rule.scope.accountIds.push('media-01'); assert.ok(m.validate(rule).length);
  } finally { m.permissions.managementAccountIds = saved; }
});
test('销售权限按当前账号过滤，同名跨账号不旁路', ['AC-R014-01'], () => {
  const result = evaluate(base([3])); const allowed = m.visibleForSales(result.rows, ['media-01']);
  assert.ok(allowed.length); assert.ok(allowed.every(item => item.friend.accountId === 'media-01'));
  assert.ok(allowed.some(item => item.friend.id === 'demo-f01')); assert.ok(!allowed.some(item => item.friend.id === 'demo-f16'));
  assert.equal(m.visibleForSales(result.rows, []).length, 0);
});
test('共同日期基准切换改变到期判断，添加日期仍是原值', ['R004'], () => {
  const rule = base([3]); assert.equal(row(rule, '2026-09-27').status, 'included');
  rule.anchor = 'consulted'; assert.equal(row(rule, '2026-09-27').status, 'not-matched');
  rule.nodes[0].day = '6'; assert.equal(row(rule, '2026-09-27').status, 'included');
  rule.anchor = 'appointment'; rule.nodes[0].day = '0'; assert.equal(row(rule, '2026-09-27').status, 'not-matched');
  assert.equal(row(rule, '2026-09-30').status, 'included');
  assert.equal(m.getFixtures().find(item => item.id === 'demo-f01').dates.added, '2026-09-24');
});
test('缺失基准是unknown，无到期节点是not-matched，两者不可混为0', ['R004', 'R010'], () => {
  const rule = base([3]), result = evaluate(rule);
  const missing = result.rows.find(item => item.friend.id === 'demo-f10'), notDue = result.rows.find(item => item.friend.id === 'demo-f05');
  assert.equal(missing.status, 'unknown'); assert.equal(missing.nodeId, null); assert.equal(missing.nodeDay, null);
  assert.equal(notDue.status, 'not-matched'); assert.equal(notDue.nodeId, null); assert.equal(notDue.nodeDay, null);
  assert.ok(result.counts.unknown >= 1);
});
test('附加日期限制与节点到期AND，不能绕过或替换节点日期', ['R004'], () => {
  const rule = base([3]);
  rule.nodes[0].include = [{ ...condition('added', 'date-range'), start: '2026-09-25', end: '2026-09-25' }];
  assert.equal(row(rule, '2026-09-27').status, 'not-matched');
  rule.nodes[0].include[0].start = '2026-09-24'; rule.nodes[0].include[0].end = '2026-09-24';
  assert.equal(row(rule, '2026-09-27').status, 'included');
  assert.equal(row(rule, '2026-09-28').status, 'not-matched');
  rule.nodes[0].include = [condition('added', 'relative-day', 5)];
  assert.equal(row(rule, '2026-09-27').status, 'not-matched'); assert.equal(row(rule, '2026-09-29').status, 'not-matched');
});
test('修改其他节点筛选不影响当前好友的当日节点结果', ['R004', 'R015'], () => {
  const rule = base(), before = plain(row(rule, '2026-09-27'));
  rule.nodes[1].include = [condition('grade', 'in', '', ['D级'])];
  rule.nodes[1].exclude = [condition('outbound', 'within-days', 36500)];
  rule.nodes[2].include = [condition('status', 'in', '', ['异常'])];
  assert.deepEqual(plain(row(rule, '2026-09-27')), before);
});
test('空筛选不参与，非法日期仍阻止保存', ['R003', 'R008'], () => {
  const rule = base([3]); rule.nodes[0].include = [condition('grade', 'in')]; rule.nodes[0].exclude = [condition('inbound', 'within-days')];
  assert.equal(m.validate(rule).length, 0); assert.equal(row(rule, '2026-09-27').status, 'included');
  rule.nodes[0].include = [condition('added', 'on', '2026-02-30')]; assert.ok(m.validate(rule).length);
});
test('共同运行时间跨日，恰好到点选择下一次，不补跑', ['AC-R006-01'], () => {
  const rule = base(); rule.enabled = true;
  assert.equal(m.nextRun(rule, '2026-09-27T00:59:59+08:00'), '2026-09-27 01:00（北京时间）');
  assert.equal(m.nextRun(rule, '2026-09-27T01:00:00+08:00'), '2026-09-28 01:00（北京时间）');
});

const report = { spec: 'SPEC-SUIYIN-ADMIN-071@1.1.0', verifiedAt: new Date().toISOString(), model: modelRelativePath,
  modelSha256: crypto.createHash('sha256').update(source).digest('hex'),
  status: results.some(item => item.status === 'FAIL') ? 'FAIL' : 'PASS',
  passed: results.filter(item => item.status === 'PASS').length, failed: results.filter(item => item.status === 'FAIL').length, results };
fs.writeFileSync(path.join(__dirname, 'nodes-model-results.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ status: report.status, passed: report.passed, failed: report.failed, modelSha256: report.modelSha256,
  failures: results.filter(item => item.status === 'FAIL') }, null, 2));
if (report.failed) process.exitCode = 1;
