/* Independent business-oracle checks for SPEC-SUIYIN-ADMIN-071@1.3.0.
 * Synthetic inputs only. This file does not change the prototype or old checks.
 */
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
const sandbox = {}; vm.createContext(sandbox); vm.runInContext(source, sandbox, { filename: modelPath });
const registry = sandbox.RevisitRuleModel;
const tenants = ['yestar-sz','yestar','yestar-bj','yestar-gz','yestar-hz','yestar-jx'];
const legacy = ['added','consulted','filed','appointment','revisited'];
const events = ['visit','purchase','redemption'];
const grades = ['A','B','C','D'];
const expectedAnchors = [...legacy,...grades.map(value=>'grade-'+value),...events];
const at = Date.parse('2026-09-28T01:00:00+08:00');
const clone = value => JSON.parse(JSON.stringify(value));
const results = [];
function test(name, fn) { try { fn(); results.push({name,status:'PASS'}); } catch(error) { results.push({name,status:'FAIL',error:error.message}); } }
function base(anchor='added', extra={}) {
  const rule = registry.seedRules()[0]; rule.anchor=anchor;
  rule.nodes=[{id:'test-node',day:'3',note:'',include:[],exclude:[]}];
  return Object.assign(rule,extra);
}
function friend(extra={}) {
  return Object.assign({ id:'independent-fixture', accountId:'media-01', values:{grade:'A级',aiGrade:'B级'},
    dates:{added:'2026-09-20',consulted:'2026-09-21',filed:'2026-09-22',appointment:'2026-09-23',revisited:'2026-09-24'},
    events:{visit:[],purchase:[],redemption:[],gradeManual:[],gradeAI:[]}},extra);
}
function resolved(rule, data, instant=at) { return registry.resolveAnchor(rule,data,instant); }
function known(rule, data, expectedDate, instant=at) {
  const actual=resolved(rule,data,instant); assert.equal(actual.status,'known',JSON.stringify(actual));
  assert.equal(actual.date,expectedDate); assert.equal(typeof actual.label,'string'); assert.ok(actual.label);
}
function status(rule,data,expected,instant=at) { assert.equal(resolved(rule,data,instant).status,expected); }

test('12个独立基准包含旧5项、成为A/B/C/D级、到店/购买/划扣',()=>{
  assert.equal(typeof registry.resolveAnchor,'function'); assert.equal(typeof registry.anchorLabel,'function');
  assert.deepEqual(clone(registry.anchors).map(item=>item.id).sort(),expectedAnchors.slice().sort());
  assert.equal(new Set(registry.anchors.map(item=>item.id)).size,12);
  assert.equal(registry.anchors.find(item=>item.id==='appointment').label,'预约日期');
  for(const grade of grades) assert.equal(registry.anchors.find(item=>item.id==='grade-'+grade).grade,grade+'级');
});

test('旧21项选中与26项排除身份/类型原样保留，不把新基准混进筛选维度',()=>{
  const expected=['account','grade','aiGrade','demand1','hasPhone','status','consulted','added','demand2','region','filed','developer','manager','membership','appointment','improvement','traits','equipment','doctor','style','revisited','inbound','outbound','both','newDays','commonGroup'];
  assert.deepEqual(clone(registry.fields).map(item=>item.id),expected);
  assert.equal(registry.fields.filter(item=>item.include).length,21); assert.equal(registry.fields.filter(item=>item.exclude).length,26);
  assert.deepEqual(clone(registry.fields).filter(item=>item.type==='date').map(item=>item.id),['consulted','added','filed','appointment','revisited']);
});

test('旧v2规则不需要新字段仍可校验，旧5日期只读取对应dates',()=>{
  for(const id of legacy) {
    const rule=base(id), data=friend(); delete rule.gradeSource; delete rule.anchorOccurrence;
    assert.deepEqual(clone(registry.validate(rule)),[]); known(rule,data,data.dates[id]);
  }
});

test('旧日期缺失或非法为unknown，不从其他日期或当前等级猜测',()=>{
  for(const id of legacy) for(const value of [null,undefined,'','not-date','2026-02-30']) {
    const data=friend(); data.dates[id]=value; status(base(id),data,'unknown');
  }
});

for(const event of events) {
  test(event+'首次/最近一次按发生时间选，输入无序且未来事件不参与',()=>{
    const data=friend(); data.events[event]=[{at:'2026-09-25T20:00:00+08:00'},{at:'2026-09-29T00:00:00+08:00'},{at:'2026-09-20T09:00:00+08:00'}];
    known(base(event,{anchorOccurrence:'first'}),data,'2026-09-20');
    known(base(event,{anchorOccurrence:'latest'}),data,'2026-09-25');
  });
  test(event+'独立于其他事件，不能以购买/划扣/到店互相填值',()=>{
    const data=friend(); for(const other of events) if(other!==event) data.events[other]=[{at:'2026-09-25'}];
    status(base(event,{anchorOccurrence:'latest'}),data,'none');
  });
  test(event+'已知空历史和仅未来历史为none，缺失/null/非法为unknown',()=>{
    const rule=base(event,{anchorOccurrence:'latest'});
    for(const value of [[],[{at:'2026-09-29'}]]) { const data=friend(); data.events[event]=value; status(rule,data,'none'); }
    for(const value of [undefined,null,'invalid',[{}],[{at:'bad'}],[{at:'2026-02-30'}]]) { const data=friend(); data.events[event]=value; status(rule,data,'unknown'); }
  });
  test(event+'日期记录按北京时间当天，时间戳按北京时间跨日',()=>{
    for(const [value,date] of [['2026-09-27','2026-09-27'],['2026-09-26T16:00:00Z','2026-09-27'],['2026-09-27T15:59:59Z','2026-09-27'],['2026-09-27T16:00:00Z','2026-09-28']]) {
      const data=friend(); data.events[event]=[{at:value}]; known(base(event,{anchorOccurrence:'latest'}),data,date);
    }
  });
  test(event+'运行瞬间可计入，晚1毫秒不计入，日期记录只从当日零点起生效',()=>{
    const data=friend(), rule=base(event,{anchorOccurrence:'latest'});
    data.events[event]=[{at:'2026-09-28T01:00:00+08:00'}]; known(rule,data,'2026-09-28');
    data.events[event]=[{at:'2026-09-28T01:00:00.001+08:00'}]; status(rule,data,'none');
    data.events[event]=[{at:'2026-09-28'}]; status(rule,data,'none',Date.parse('2026-09-27T23:59:59.999+08:00'));
    known(rule,data,'2026-09-28',Date.parse('2026-09-28T00:00:00+08:00'));
  });
}

for(const grade of grades) {
  test('成为'+grade+'级人工/AI分别使用自身变更历史，可接受首次从null进入',()=>{
    const data=friend(); data.events.gradeManual=[{at:'2026-09-20',from:null,to:grade+'级'}];
    data.events.gradeAI=[{at:'2026-09-25',from:null,to:grade+'级'}];
    known(base('grade-'+grade,{gradeSource:'manual'}),data,'2026-09-20');
    known(base('grade-'+grade,{gradeSource:'ai'}),data,'2026-09-25');
    const other=grade==='A'?'B':'A';
    status(base('grade-'+other,{gradeSource:'manual'}),data,'none');
  });
}

test('当前等级有值也不能推算成为日期，所选来源历史缺失不借用另一来源',()=>{
  for(const source of ['manual','ai']) {
    const data=friend(), selected=source==='manual'?'gradeManual':'gradeAI', other=source==='manual'?'gradeAI':'gradeManual';
    data.values={grade:'A级',aiGrade:'A级'}; data.events[other]=[{at:'2026-09-25',from:'B级',to:'A级'}];
    delete data.events[selected]; status(base('grade-A',{gradeSource:source}),data,'unknown');
    data.events[selected]=[]; status(base('grade-A',{gradeSource:source}),data,'none');
  }
});

test('同值等级评定不重置基准，重复事件不重置，无序多次进入取最后一次',()=>{
  const data=friend(), rule=base('grade-A',{gradeSource:'manual'});
  data.events.gradeManual=[{at:'2026-09-27',from:'A级',to:'A级'},{at:'2026-09-22',from:'B级',to:'A级'},{at:'2026-09-20',from:null,to:'A级'},{at:'2026-09-21',from:'A级',to:'B级'},{at:'2026-09-22',from:'B级',to:'A级'}];
  known(rule,data,'2026-09-22');
  data.events.gradeManual.push({at:'2026-09-29',from:'B级',to:'A级'}); known(rule,data,'2026-09-22');
});

test('grade不受event首次/最近一次参数影响，总取最近真正进入目标等级',()=>{
  const data=friend(); data.events.gradeAI=[{at:'2026-09-20',from:null,to:'B级'},{at:'2026-09-22',from:'A级',to:'B级'}];
  for(const occurrence of [undefined,'first','latest']) known(base('grade-B',{gradeSource:'ai',anchorOccurrence:occurrence}),data,'2026-09-22');
});

test('等级事件空/仅未来/仅同值为none，缺失或非法时间/变更值为unknown',()=>{
  const rule=base('grade-C',{gradeSource:'manual'});
  for(const value of [[],[{at:'2026-09-29',from:'B级',to:'C级'}],[{at:'2026-09-25',from:'C级',to:'C级'}]]) { const data=friend(); data.events.gradeManual=value; status(rule,data,'none'); }
  for(const value of [undefined,null,'invalid',[{}],[{at:'bad',from:'B级',to:'C级'}],[{at:'2026-02-30',from:'B级',to:'C级'}],[{at:'2026-09-25',from:'invalid',to:'C级'}],[{at:'2026-09-25',from:'B级',to:'invalid'}]]) { const data=friend(); data.events.gradeManual=value; status(rule,data,'unknown'); }
});

test('等级日期、UTC跨日及运行瞬间使用北京时间，晚1毫秒不提前触发',()=>{
  const rule=base('grade-D',{gradeSource:'ai'}), data=friend();
  for(const [value,date] of [['2026-09-27','2026-09-27'],['2026-09-26T16:00:00Z','2026-09-27'],['2026-09-28T01:00:00+08:00','2026-09-28']]) { data.events.gradeAI=[{at:value,from:null,to:'D级'}]; known(rule,data,date); }
  data.events.gradeAI=[{at:'2026-09-28T01:00:00.001+08:00',from:null,to:'D级'}]; status(rule,data,'none');
});

test('标签区分人工/AI和首次/最近一次且非法基准配置不能保存',()=>{
  assert.notEqual(registry.anchorLabel(base('grade-A',{gradeSource:'manual'})),registry.anchorLabel(base('grade-A',{gradeSource:'ai'})));
  assert.notEqual(registry.anchorLabel(base('visit',{anchorOccurrence:'first'})),registry.anchorLabel(base('visit',{anchorOccurrence:'latest'})));
  for(const rule of [base('not-real'),base('grade-A',{gradeSource:'invalid'}),base('visit',{anchorOccurrence:'invalid'})]) assert.ok(registry.validate(rule).length);
});

test('resolver纯读取，不改变规则、好友历史或事件顺序',()=>{
  const data=friend(), rule=base('redemption',{anchorOccurrence:'first'}); data.events.redemption=[{at:'2026-09-25'},{at:'2026-09-20'}];
  const before=clone({rule,data}); known(rule,data,'2026-09-20'); assert.deepEqual(clone({rule,data}),before);
});

test('六租户基准目录与事件副本独立，变更不传播给同店或其他店',()=>{
  for(const tenant of tenants) {
    const model=registry.forTenant(tenant), another=registry.forTenant(tenant), baseline=clone(another.anchors), fixtures=model.getFixtures(), original=clone(model.getFixtures());
    assert.deepEqual(clone(model.anchors).map(item=>item.id).sort(),expectedAnchors.slice().sort());
    model.anchors[0].label='验收变化'; assert.deepEqual(clone(another.anchors),baseline); assert.deepEqual(clone(registry.forTenant(tenant).anchors),baseline);
    assert.ok(fixtures.some(item=>item.events&&Object.keys(item.events).length),'tenant requires explicit synthetic event examples');
    for(const item of fixtures) if(item.events) { item.events.visit=[{at:'2099-01-01'}]; break; }
    assert.deepEqual(clone(model.getFixtures()),original);
  }
});

test('六租户新基准试算沿用共享账号权限、同一天节点和真实resolver日期',()=>{
  for(const tenant of tenants) {
    let exercised=0;
    const model=registry.forTenant(tenant), accountIds=model.groups.flatMap(group=>group.accounts.map(account=>account.id));
    const fixture=model.getFixtures().find(item=>accountIds.includes(item.accountId)&&item.events); assert.ok(fixture);
    for(const anchor of [...events,...grades.map(grade=>'grade-'+grade)]) {
      const variations=events.includes(anchor)?[{anchorOccurrence:'first'},{anchorOccurrence:'latest'}]:[{gradeSource:'manual'},{gradeSource:'ai'}];
      for(const variant of variations) {
        const rule=Object.assign(model.seedRules()[0],{anchor,...variant,scope:{groupIds:[],accountIds:[fixture.accountId]}}), resolution=model.resolveAnchor(rule,fixture,at);
        if(resolution.status!=='known') continue;
        const day=(Date.parse('2026-09-28T00:00:00+08:00')-Date.parse(resolution.date+'T00:00:00+08:00'))/86400000;
        if(day<0) continue;
        rule.nodes=[{id:'verify-'+anchor,day:String(day),note:'',include:[],exclude:[]}];
        const evaluated=model.evaluate(rule,'2026-09-28'); assert.ok(!evaluated.errors?.length,JSON.stringify(evaluated.errors));
        const row=evaluated.rows.find(item=>item.friend.id===fixture.id); assert.ok(row,tenant+' '+anchor); assert.equal(row.status,'included'); assert.equal(row.nodeDay,String(day));
        assert.ok(evaluated.rows.every(item=>item.friend.accountId===fixture.accountId));
        exercised++;
      }
    }
    assert.ok(exercised>0,tenant+' requires at least one known new anchor to exercise evaluation');
  }
});

test('成为D级后又变A仍按原D进入事件到期，显式当前等级条件才限制候选',()=>{
  const rule=base('grade-D',{gradeSource:'manual'}), fixtureId='demo-f03';
  const current=registry.getFixtures().find(item=>item.id===fixtureId); assert.equal(current.values.grade,'A级');
  known(rule,current,'2026-09-24',Date.parse('2026-09-27T01:00:00+08:00'));
  const row=()=>registry.evaluate(rule,'2026-09-27').rows.find(item=>item.friend.id===fixtureId);
  assert.equal(row().status,'included'); assert.equal(row().nodeDay,'3');
  rule.nodes[0].include=[{field:'grade',op:'in',values:['D级'],value:'',start:'',end:'',min:'',max:''}];
  assert.equal(row().status,'not-matched');
  rule.nodes[0].include=[]; rule.nodes[0].exclude=[{field:'grade',op:'in',values:['A级'],value:'',start:'',end:'',min:'',max:''}];
  assert.equal(row().status,'excluded');
});

test('混合有效和坏历史保持unknown，不丢掉坏行后冒称可靠首次/最近进入',()=>{
  for(const event of events) for(const occurrence of ['first','latest']) {
    const data=friend(); data.events[event]=[{at:'2026-09-25'},{at:'not-a-date'}];
    status(base(event,{anchorOccurrence:occurrence}),data,'unknown');
  }
  for(const source of ['manual','ai']) {
    const data=friend(); data.events[source==='manual'?'gradeManual':'gradeAI']=[{at:'2026-09-25',from:'B级',to:'A级'},{at:'not-a-date',from:'C级',to:'A级'}];
    status(base('grade-A',{gradeSource:source}),data,'unknown');
  }
});

test('新等级缺少gradeSource或新事件缺少anchorOccurrence均不能保存',()=>{
  for(const grade of grades) for(const value of [undefined,null,'']) {
    const rule=base('grade-'+grade,{gradeSource:value}); assert.ok(registry.validate(rule).length);
  }
  for(const event of events) for(const value of [undefined,null,'']) {
    const rule=base(event,{anchorOccurrence:value}); assert.ok(registry.validate(rule).length);
  }
});

test('旧默认添加规则人数及节点分布不被新增历史改变',()=>{
  const result=registry.evaluate(registry.seedRules()[0],'2026-09-27');
  assert.deepEqual(clone(result.counts),{scope:13,selected:11,excluded:5,included:5,unknown:2});
  const included=result.rows.filter(item=>item.status==='included');
  assert.equal(included.filter(item=>item.nodeDay==='3').length,3);
  assert.equal(included.filter(item=>item.nodeDay==='5').length,1);
  assert.equal(included.filter(item=>item.nodeDay==='7').length,1);
});

const report={spec:'SPEC-SUIYIN-ADMIN-071@1.3.0',verifiedAt:new Date().toISOString(),artifactClass:'static-html',
  source:{path:modelPath,sha256:crypto.createHash('sha256').update(source).digest('hex')},
  status:results.some(item=>item.status==='FAIL')?'FAIL':'PASS',passed:results.filter(item=>item.status==='PASS').length,
  total:results.length,results};
fs.writeFileSync(path.join(__dirname,'anchor-model-results.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({status:report.status,passed:report.passed,total:report.total,source:report.source,failures:results.filter(item=>item.status==='FAIL')},null,2));
if(report.status==='FAIL')process.exitCode=1;
