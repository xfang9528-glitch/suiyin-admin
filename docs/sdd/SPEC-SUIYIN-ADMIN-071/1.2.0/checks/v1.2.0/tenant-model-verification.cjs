/* SPEC-SUIYIN-ADMIN-071@1.2.0: independent tenant isolation checks. */
'use strict';
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const assert = require('node:assert/strict'), crypto = require('node:crypto');
const modelPath = 'prototype/admin-revisit-rules-model.js';
function findRoot() {
  if (process.env.PROTOTYPE_ROOT) {
    const candidate = path.resolve(process.env.PROTOTYPE_ROOT);
    if (fs.existsSync(path.join(candidate, modelPath))) return candidate;
    throw Error('PROTOTYPE_ROOT must contain ' + modelPath);
  }
  for (const initial of [process.cwd(), __dirname]) {
    let current = initial;
    while (true) {
      if (fs.existsSync(path.join(current, modelPath))) return current;
      const next = path.dirname(current); if (next === current) break; current = next;
    }
  }
  throw Error('Run from the prototype repository or set PROTOTYPE_ROOT.');
}
const root = findRoot(), source = fs.readFileSync(path.join(root, modelPath), 'utf8');
const sandbox = {}; vm.createContext(sandbox); vm.runInContext(source, sandbox, {filename:modelPath});
const registry = sandbox.RevisitRuleModel;
const tenants = [
  ['yestar-sz', '深圳'], ['yestar', '成都'], ['yestar-bj', '北京'],
  ['yestar-gz', '广州'], ['yestar-hz', '杭州'], ['yestar-jx', '嘉兴']
];
const results = [], clone = value => JSON.parse(JSON.stringify(value));
function test(name, fn) { try { fn(); results.push({name,status:'PASS'}); } catch(error) { results.push({name,status:'FAIL',error:error.message}); } }
const accounts = model => model.groups.flatMap(group => group.accounts);
const enumCondition = (field, value) => ({field,op:'in',values:[value],value:'',start:'',end:'',min:'',max:''});
const field = (model, id) => model.fields.find(item => item.id === id);

test('注册精确六个艺星租户，非艺星和未知租户返回null', () => {
  assert.equal(typeof registry.forTenant, 'function');
  assert.deepEqual(clone(registry.supportedTenants).map(item => item.id).sort(), tenants.map(item => item[0]).sort());
  for (const [id, city] of tenants) {
    const item = registry.supportedTenants.find(item => item.id === id);
    assert.equal(item.city, city); assert.equal(item.name, city + '艺星');
  }
  for (const id of ['bzds', 'mengzhua', 'unknown', '', null, undefined, '__proto__']) assert.equal(registry.forTenant(id), null);
});

for (const [id, city] of tenants) {
  test(id + '：独立目录、21/26维度、单规则3/5/7节点及17个合成样本', () => {
    const model = registry.forTenant(id), rule = model.seedRules()[0], fixture = model.getFixtures();
    assert.equal(model.tenantId,id); assert.equal(model.tenantLabel,city+'艺星');
    assert.equal(model.fields.filter(item=>item.include).length,21); assert.equal(model.fields.filter(item=>item.exclude).length,26);
    assert.equal(model.groups.length,5); assert.equal(accounts(model).length,10); assert.equal(fixture.length,17);
    assert.equal(new Set(fixture.map(item=>item.id)).size,17); assert.equal(model.seedRules().length,1);
    assert.equal(rule.id,id==='yestar-sz'?'demo-added-followup':id+':demo-added-followup');
    assert.deepEqual(clone(rule.nodes.map(item=>item.day)),['3','5','7']);
    assert.deepEqual(clone(model.validate(rule)),[]); assert.equal(rule.enabled,false);
    assert.deepEqual(clone(model.permissions.managementAccountIds).sort(),clone(accounts(model).map(item=>item.id)).sort());
    const allowed = new Set(accounts(model).map(item=>item.id));
    assert.equal(fixture.filter(item=>!allowed.has(item.accountId)).length,1,'one explicit revoked-account boundary fixture');
    if(id!=='yestar-sz') {
      for(const entity of [...model.groups,...accounts(model),...fixture]) assert.ok(entity.id.startsWith(id+':'));
      for(const account of accounts(model)) assert.ok(account.name.includes(city)&&account.name.includes('演示'));
      for(const personId of ['developer','manager','doctor']) {
        assert.ok(field(model,personId).options.every(value=>value.includes(city)&&value.includes('演示')));
        assert.ok(fixture.every(item=>field(model,personId).options.includes(item.values[personId])));
      }
      assert.ok(fixture.every(item=>item.name.includes(city)));
      for(const item of fixture) {
        if(item.values.region) assert.ok(item.values.region.join(' / ').includes(city));
        if(item.commonGroups) assert.ok(item.commonGroups.accountId.startsWith(id+':'));
      }
      assert.ok(field(model,'region').options.some(value=>value.includes(city)));
    }
  });
  test(id + '：相同业务场景试算及账号权限收窄，好友身份不跨租户', () => {
    const model=registry.forTenant(id), result=model.evaluate(model.seedRules()[0], '2026-09-27');
    assert.deepEqual(clone(result.counts),{scope:13,selected:11,excluded:5,included:5,unknown:2});
    assert.equal(result.rows.filter(item=>item.status==='not-matched').length,1);
    assert.equal(new Set(result.rows.map(item=>item.friend.id)).size,13);
    const allowed=accounts(model).map(item=>item.id), restricted=allowed[0];
    assert.ok(result.rows.every(item=>allowed.includes(item.friend.accountId)));
    const own=model.visibleForSales(result.rows,[restricted]);
    assert.ok(own.length>0); assert.ok(own.every(item=>item.status==='included'&&item.friend.accountId===restricted));
    for(const [otherId] of tenants.filter(item=>item[0]!==id)) {
      assert.equal(model.visibleForSales(result.rows,accounts(registry.forTenant(otherId)).map(item=>item.id)).length,0);
    }
  });
}

test('六租户账号/群组/好友身份交集为空；无跨租户规则身份复用', () => {
  for(const type of ['account','group','friend','rule']) {
    const seen=new Set();
    for(const [id] of tenants) {
      const model=registry.forTenant(id);
      const entities=type==='account'?accounts(model):type==='group'?model.groups:type==='friend'?model.getFixtures():model.seedRules();
      for(const item of entities) { assert.ok(!seen.has(item.id),type+' identity collision'); seen.add(item.id); }
    }
  }
});

test('外租户账号、群组和人员选项不能用于当前租户有效规则', () => {
  for(const [id] of tenants) {
    const model=registry.forTenant(id), foreign=registry.forTenant(id==='yestar'?'yestar-bj':'yestar');
    for(const scope of [{groupIds:[foreign.groups[0].id],accountIds:[]},{groupIds:[],accountIds:[accounts(foreign)[0].id]}]) {
      const rule=model.seedRules()[0]; rule.scope=scope;
      assert.ok(model.validate(rule).length>0); assert.equal(model.evaluate(rule).rows.length,0);
    }
    for(const fieldId of ['account','developer','manager','doctor']) {
      const rule=model.seedRules()[0], value=fieldId==='account'?accounts(foreign)[0].id:field(foreign,fieldId).options[0];
      rule.nodes[0].include=[enumCondition(fieldId,value)]; assert.ok(model.validate(rule).length>0);
    }
  }
});

test('每次工厂调用的数组/对象/权限均独立，跨调用及跨租户修改不传播', () => {
  for(const [id] of tenants) {
    const a=registry.forTenant(id), b=registry.forTenant(id), foreign=registry.forTenant(id==='yestar'?'yestar-bj':'yestar');
    const baseline=clone({groups:b.groups,fields:b.fields,permissions:b.permissions});
    const foreignBaseline=clone({groups:foreign.groups,fields:foreign.fields,permissions:foreign.permissions});
    a.groups[0].name='验收变更'; a.groups[0].accounts[0].name='验收账号'; a.groups[0].accounts.push({id:'probe',name:'合成验收账号'});
    field(a,'grade').options.push('验收新增'); field(a,'developer').options[0]='验收人员'; a.permissions.managementAccountIds.splice(0);
    assert.deepEqual(clone({groups:b.groups,fields:b.fields,permissions:b.permissions}),baseline);
    assert.deepEqual(clone({groups:foreign.groups,fields:foreign.fields,permissions:foreign.permissions}),foreignBaseline);
    assert.deepEqual(clone({groups:registry.forTenant(id).groups,fields:registry.forTenant(id).fields,permissions:registry.forTenant(id).permissions}),baseline);
  }
});

test('种子规则/节点及只读fixture副本独立；修改返回值不会改后续样本', () => {
  for(const [id] of tenants) {
    const model=registry.forTenant(id), before=clone(model.getFixtures()), initial=clone(model.seedRules());
    const fixture=model.getFixtures(); fixture[0].values.grade='验收变更'; fixture[0].messages.push({direction:'inbound',at:'2026-09-27T00:00:00+08:00'});
    const rule=model.seedRules()[0]; rule.scope.groupIds.push('probe'); rule.nodes[0].exclude[0].value='99';
    assert.deepEqual(clone(model.getFixtures()),before); assert.deepEqual(clone(model.seedRules()),initial);
  }
});

test('顶层旧API保留深圳身份与目录，工厂深圳不共享顶层可变对象', () => {
  const local=registry.forTenant('yestar-sz');
  assert.equal(registry.tenantId,'yestar-sz'); assert.equal(registry.seedRules()[0].id,'demo-added-followup');
  assert.deepEqual(clone(local.groups),clone(registry.groups)); assert.deepEqual(clone(local.fields),clone(registry.fields));
  assert.deepEqual(clone(local.seedRules()),clone(registry.seedRules())); assert.deepEqual(clone(local.getFixtures()),clone(registry.getFixtures()));
  assert.ok(accounts(registry).some(item=>item.id==='media-01')); assert.ok(registry.groups.some(item=>item.id==='media'));
  local.groups[0].accounts[0].name='验收变更'; assert.equal(accounts(registry)[0].name,'演示自媒体01');
});

const report={spec:'SPEC-SUIYIN-ADMIN-071@1.2.0',verifiedAt:new Date().toISOString(),artifactClass:'static-html',
  source:{path:modelPath,sha256:crypto.createHash('sha256').update(source).digest('hex')},
  passed:results.filter(item=>item.status==='PASS').length,total:results.length,results};
fs.writeFileSync(path.join(__dirname,'tenant-model-results.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2)); if(report.passed!==report.total)process.exitCode=1;
