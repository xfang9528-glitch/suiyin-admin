/* SPEC-SUIYIN-ADMIN-071@1.3.0: deterministic local demonstration only.
 * All groups, people and events below are synthetic. No API or scheduler is used.
 * Demo defaults: Asia/Shanghai, added day = 0, message lookback = rolling hours.
 */
(function (root) {
  'use strict';

  // These are synthetic tenant profiles, not captured work-account directories.
  var tenantProfiles = {
    'yestar-sz': { city: '深圳', regions: [['广东省', '深圳市', '南山区'], ['广东省', '深圳市', '福田区']] },
    'yestar': { city: '成都', regions: [['四川省', '成都市', '锦江区'], ['四川省', '成都市', '武侯区'], ['四川省', '成都市', '青羊区']] },
    'yestar-bj': { city: '北京', regions: [['北京市', '市辖区', '朝阳区'], ['北京市', '市辖区', '海淀区'], ['北京市', '市辖区', '东城区']] },
    'yestar-gz': { city: '广州', regions: [['广东省', '广州市', '天河区'], ['广东省', '广州市', '越秀区'], ['广东省', '广州市', '海珠区']] },
    'yestar-hz': { city: '杭州', regions: [['浙江省', '杭州市', '上城区'], ['浙江省', '杭州市', '拱墅区'], ['浙江省', '杭州市', '西湖区']] },
    'yestar-jx': { city: '嘉兴', regions: [['浙江省', '嘉兴市', '南湖区'], ['浙江省', '嘉兴市', '秀洲区']] }
  };
  function createModel(tenantId) {
  if (!Object.prototype.hasOwnProperty.call(tenantProfiles, tenantId)) return null;
  var profile = tenantProfiles[tenantId];
  var legacyShenzhen = tenantId === 'yestar-sz';
  function identity(id) { return legacyShenzhen ? id : tenantId + ':' + id; }
  function person(value) { return legacyShenzhen ? value : profile.city + value; }
  var DAY = 86400000;
  var OFFSET = 8 * 3600000;
  var groups = [
    { id: 'media', name: '自媒体', accounts: [{ id: 'media-01', name: '演示自媒体01' }, { id: 'media-02', name: '演示自媒体02' }] },
    { id: 'douyin', name: '抖音IP', accounts: [{ id: 'douyin-01', name: '演示抖音01' }, { id: 'douyin-02', name: '演示抖音02' }] },
    { id: 'xiaohongshu', name: '小红书', accounts: [{ id: 'xhs-01', name: '演示小红书01' }, { id: 'xhs-02', name: '演示小红书02' }] },
    { id: 'ecommerce', name: '电商', accounts: [{ id: 'ecommerce-01', name: '演示电商01' }, { id: 'ecommerce-02', name: '演示电商02' }] },
    { id: 'agency', name: '代运营', accounts: [{ id: 'agency-01', name: '演示代运营01' }, { id: 'agency-02', name: '演示代运营02' }] }
  ];
  if (!legacyShenzhen) groups.forEach(function (group) {
    group.id = identity(group.id);
    group.accounts.forEach(function (account) { account.id = identity(account.id); account.name = person(account.name); });
  });
  var permissions = { managementAccountIds: groups.reduce(function (list, g) { return list.concat(g.accounts.map(function (a) { return a.id; })); }, []) };
  function field(id, label, type, options, excludeOnly) {
    return { id: id, label: label, type: type, options: options || [], include: !excludeOnly, exclude: true };
  }
  var fields = [
    field('account', '所在账号', 'account'),
    field('grade', '等级', 'enum', ['A级', 'B级', 'C级', 'D级']),
    field('aiGrade', '等级(AI)', 'enum', ['A级', 'B级', 'C级', 'D级']),
    field('demand1', '第一需求(AI)', 'enum', ['眼部整形', '鼻部整形', '面部轮廓', '紧肤提升', '皮肤管理', '注射填充', '吸脂塑形']),
    field('hasPhone', '有电话', 'enum', ['是', '否']),
    field('status', '状态', 'enum', ['正常', '异常']),
    field('consulted', '末次咨询日期', 'date'),
    field('added', '添加日期', 'date'),
    field('demand2', '第二需求(AI)', 'enum', ['眼部整形', '鼻部整形', '面部轮廓', '紧肤提升', '皮肤管理']),
    field('region', '地区', 'region', ['广东省', '广东省 / 深圳市', '广东省 / 深圳市 / 南山区', '广东省 / 深圳市 / 福田区', '广东省 / 广州市', '广东省 / 广州市 / 天河区', '湖南省', '湖南省 / 长沙市', '湖南省 / 长沙市 / 岳麓区']),
    field('filed', '建档日期', 'date'),
    field('developer', '开发人', 'enum', ['演示开发人甲', '演示开发人乙', '演示开发人丙']),
    field('manager', '客服经理', 'enum', ['演示经理甲', '演示经理乙']),
    field('membership', '会员等级', 'enum', ['普通', '银卡', '金卡', '钻石']),
    field('appointment', '未次预约日期', 'date'),
    field('improvement', '建议改善', 'enum', ['眼部', '鼻部', '面部', '皮肤', '身体']),
    field('traits', '用户特征', 'enum', ['高意向', '犹豫中', '低意向']),
    field('equipment', '推荐设备/材料', 'enum', ['热玛吉', '超声刀', '玻尿酸', '肉毒素']),
    field('doctor', '推荐医生', 'enum', ['演示医生甲', '演示医生乙', '演示医生丙']),
    field('style', '喜好风格', 'enum', ['自然', '精致', '欧美', '韩系']),
    field('revisited', '末次回访日期', 'date'),
    field('inbound', '对方发过消息', 'days', [], true),
    field('outbound', '我方发过消息', 'days', [], true),
    field('both', '双方发过消息', 'days', [], true),
    field('newDays', '新加好友', 'days', [], true),
    field('commonGroup', '和工作号同在至少一个群', 'enum', ['是'], true)
  ];
  if (!legacyShenzhen) fields.forEach(function (item) {
    if (item.id === 'region') item.options = Array.from(new Set(profile.regions.reduce(function (list, parts) {
      return list.concat(parts.map(function (_, index) { return parts.slice(0, index + 1).join(' / '); }));
    }, [])));
    if (['developer', 'manager', 'doctor'].indexOf(item.id) >= 0) item.options = item.options.map(person);
  });
  var byId = Object.create(null);
  fields.forEach(function (f) { byId[f.id] = f; });
  // The time basis is independent of the unchanged 21/26 condition dimensions.
  var anchors = [
    { id: 'consulted', label: '末次咨询日期', type: 'date' },
    { id: 'added', label: '添加日期', type: 'date' },
    { id: 'filed', label: '建档日期', type: 'date' },
    { id: 'appointment', label: '预约日期', type: 'date' },
    { id: 'revisited', label: '末次回访日期', type: 'date' },
    { id: 'grade-A', label: '成为 A 级', type: 'grade', grade: 'A级' },
    { id: 'grade-B', label: '成为 B 级', type: 'grade', grade: 'B级' },
    { id: 'grade-C', label: '成为 C 级', type: 'grade', grade: 'C级' },
    { id: 'grade-D', label: '成为 D 级', type: 'grade', grade: 'D级' },
    { id: 'visit', label: '到店', type: 'event' },
    { id: 'purchase', label: '购买', type: 'event' },
    { id: 'redemption', label: '划扣', type: 'event' }
  ];
  var anchorsById = Object.create(null);
  anchors.forEach(function (anchor) { anchorsById[anchor.id] = anchor; });
  function anchorLabel(rule) {
    var anchor = rule && anchorsById[rule.anchor];
    if (!anchor) return '待选择回访基准';
    if (anchor.type === 'grade') return (rule.gradeSource === 'manual' ? '人工等级' : rule.gradeSource === 'ai' ? 'AI 等级' : '待选择等级来源') + ' · 最近一次' + anchor.label;
    if (anchor.type === 'event') return (rule.anchorOccurrence === 'first' ? '首次' : rule.anchorOccurrence === 'latest' ? '最近一次' : '待选择事件取值 · ') + anchor.label;
    return anchor.label;
  }
  function clone(value) { return JSON.parse(JSON.stringify(value)); }
  function allAccounts() { return groups.reduce(function (list, g) { return list.concat(g.accounts); }, []); }
  function accountName(id) { var a = allAccounts().find(function (item) { return item.id === id; }); return a ? a.name : '失效账号（' + id + '）'; }
  function unique(list) { return Array.from(new Set(list)); }
  function scopeIds(scope) {
    scope = scope || {};
    var raw = (scope.accountIds || []).slice();
    groups.forEach(function (g) { if ((scope.groupIds || []).indexOf(g.id) >= 0) raw = raw.concat(g.accounts.map(function (a) { return a.id; })); });
    var directory = allAccounts().map(function (a) { return a.id; });
    return unique(raw).filter(function (id) { return directory.indexOf(id) >= 0 && permissions.managementAccountIds.indexOf(id) >= 0; });
  }
  var nodeSequence = 0;
  function emptyNode() {
    nodeSequence += 1;
    return { id: 'node-' + Date.now().toString(36) + '-' + nodeSequence, day: '', note: '', include: [], exclude: [] };
  }
  function emptyRule() {
    return { id: null, name: '', purpose: '', scope: { groupIds: [], accountIds: [] }, anchor: 'added', nodes: [emptyNode()], runAt: '01:00', enabled: false };
  }
  function condition(id, op, value, values) {
    return { field: id, op: op, values: values || [], value: value == null ? '' : String(value), start: '', end: '', min: '', max: '' };
  }
  function seedRules() {
    var rule = emptyRule();
    rule.id = identity('demo-added-followup');
    rule.name = '添加好友后回访';
    rule.purpose = '按添加时间持续了解需求，近期已有联系时跳过';
    rule.scope = { groupIds: [identity('media')], accountIds: [identity('douyin-01')] };
    rule.nodes = [3, 5, 7].map(function (days) {
      var node = emptyNode();
      node.id = 'day-' + days;
      node.day = String(days);
      node.note = days === 7 ? '继续了解意向，异常好友暂不联系' : '了解近期需求，已有联系时跳过';
      node.exclude = [condition('outbound', 'within-days', 2), condition('inbound', 'within-days', 2)];
      if (days === 7) node.exclude.push(condition('status', 'in', '', ['异常']));
      return node;
    });
    return [rule];
  }
  function copyNodeConditions(source, target) {
    var copy = clone(target);
    copy.include = clone(source.include || []);
    copy.exclude = clone(source.exclude || []);
    return copy;
  }
  function dateNumber(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return NaN;
    var result = Date.parse(value + 'T00:00:00Z');
    return isFinite(result) && new Date(result).toISOString().slice(0, 10) === value ? result : NaN;
  }
  function eventTimestamp(value) {
    if (typeof value !== 'string') return NaN;
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return dateNumber(value) - OFFSET;
    var parts = /^(\d{4}-\d{2}-\d{2})T([01]\d|2[0-3]):([0-5]\d):([0-5]\d)(?:\.\d{1,3})?(Z|[+-](?:[01]\d|2[0-3]):[0-5]\d)$/.exec(value);
    return parts && isFinite(dateNumber(parts[1])) ? Date.parse(value) : NaN;
  }
  function resolveAnchor(rule, f, at) {
    var anchor = rule && anchorsById[rule.anchor], label = anchorLabel(rule);
    function unknown(reason) { return { status: 'unknown', label: label, reason: reason }; }
    if (!anchor || !f) return unknown('回访基准数据无法读取');
    if (anchor.type === 'date') {
      var date = f.dates && f.dates[anchor.id];
      return isFinite(dateNumber(date)) ? { status: 'known', label: label, date: date } : unknown(label + '数据缺失，无法判断到期节点');
    }
    if (!isFinite(at) || typeof at !== 'number') return unknown('运行时点无效，无法判断事件');
    if (anchor.type === 'grade' && ['manual', 'ai'].indexOf(rule.gradeSource) < 0) return unknown('请选择有效的等级来源');
    if (anchor.type === 'event' && ['first', 'latest'].indexOf(rule.anchorOccurrence) < 0) return unknown('请选择有效的事件取值');
    var key = anchor.type === 'grade' ? (rule.gradeSource === 'manual' ? 'gradeManual' : 'gradeAI') : anchor.id;
    var history = f.events && f.events[key];
    if (!Array.isArray(history)) return unknown(label + '历史缺失，无法判断到期节点');
    var invalid = false, eligible = [];
    history.forEach(function (event) {
      var stamp = event && eventTimestamp(event.at);
      if (!event || !isFinite(stamp)) { invalid = true; return; }
      if (anchor.type === 'grade' && ((event.from !== null && ['A级', 'B级', 'C级', 'D级'].indexOf(event.from) < 0) || ['A级', 'B级', 'C级', 'D级'].indexOf(event.to) < 0)) { invalid = true; return; }
      if (stamp > at) return;
      if (anchor.type === 'grade' && (event.to !== anchor.grade || event.from === event.to)) return;
      eligible.push(stamp);
    });
    if (invalid) return unknown(label + '历史存在无效记录，无法判断到期节点');
    if (!eligible.length) return { status: 'none', label: label, reason: '截至筛选时点尚未发生' + label + '，未命中时间节点' };
    var stamp = anchor.type === 'event' && rule.anchorOccurrence === 'first' ? Math.min.apply(null, eligible) : Math.max.apply(null, eligible);
    return { status: 'known', label: label, date: new Date(stamp + OFFSET).toISOString().slice(0, 10) };
  }
  function validTime(value) { return typeof value === 'string' && /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value); }
  function whole(value, minimum) { return value !== '' && value != null && /^\d+$/.test(String(value)) && Number(value) >= minimum && Number(value) <= 36500; }
  function isEmptyCondition(c) {
    var f = c && byId[c.field];
    if (!f) return false;
    if (['enum', 'region', 'account'].indexOf(f.type) >= 0) return c.op === 'in' && Array.isArray(c.values) && c.values.length === 0;
    if (f.type === 'days') return c.op === 'within-days' && (c.value === '' || c.value == null);
    if (c.op === 'relative-range') return (c.min === '' || c.min == null) && (c.max === '' || c.max == null);
    if (c.op === 'date-range') return !c.start && !c.end;
    if (['relative-day', 'within-days', 'on'].indexOf(c.op) >= 0) return c.value === '' || c.value == null;
    return false;
  }
  function activeConditions(list) { return (list || []).filter(function (c) { return !isEmptyCondition(c); }); }
  function validate(rule) {
    if (!rule || typeof rule !== 'object') return ['规则数据无法读取，请重新编辑'];
    var errors = [];
    if (typeof rule.name !== 'string' || !rule.name.trim()) errors.push('请填写规则名称');
    if (!validTime(rule.runAt)) errors.push('请填写有效的每日筛选时间');
    var anchor = anchorsById[rule.anchor];
    if (!anchor) errors.push('请选择有效的回访基准日期');
    else if (anchor.type === 'grade' && ['manual', 'ai'].indexOf(rule.gradeSource) < 0) errors.push('请选择有效的等级来源');
    else if (anchor.type === 'event' && ['first', 'latest'].indexOf(rule.anchorOccurrence) < 0) errors.push('请选择有效的事件取值（首次或最近一次）');
    var scope = rule.scope;
    if (!scope || !Array.isArray(scope.groupIds) || !Array.isArray(scope.accountIds)) {
      errors.push('账号范围格式有误，请重新选择');
    } else {
      if (!scope.groupIds.length && !scope.accountIds.length) errors.push('请至少选择一个账号群组或工作账号');
      scope.groupIds.forEach(function (id) {
        var group = groups.find(function (g) { return g.id === id; });
        if (!group) errors.push('所选群组已失效，请重新选择');
        else if (!group.accounts.some(function (a) { return permissions.managementAccountIds.indexOf(a.id) >= 0; })) errors.push(group.name + '暂无有权限的账号，请检查范围');
      });
      scope.accountIds.forEach(function (id) {
        if (!allAccounts().some(function (a) { return a.id === id; }) || permissions.managementAccountIds.indexOf(id) < 0) errors.push(accountName(id) + '已失效或无权限，请重新选择');
      });
    }
    if (!Array.isArray(rule.nodes) || !rule.nodes.length) {
      errors.push('请至少配置一个时间节点');
      return unique(errors);
    }
    var nodeIds = new Set(), nodeDays = new Set();
    rule.nodes.forEach(function (node, nodeIndex) {
      var nodeLabel = '节点' + (nodeIndex + 1) + '：';
      if (!node || typeof node !== 'object') { errors.push(nodeLabel + '数据格式有误'); return; }
      if (typeof node.id !== 'string' || !node.id.trim()) errors.push(nodeLabel + '缺少独立身份，请重新添加');
      else if (nodeIds.has(node.id)) errors.push(nodeLabel + '身份重复，请重新添加');
      else nodeIds.add(node.id);
      if (!whole(node.day, 0)) errors.push(nodeLabel + '请输入0至36500之间的整数天数');
      else if (nodeDays.has(Number(node.day))) errors.push(nodeLabel + '第' + Number(node.day) + '天已经配置，节点时间不能重复');
      else nodeDays.add(Number(node.day));
      ['include', 'exclude'].forEach(function (side) {
        if (!Array.isArray(node[side])) { errors.push(nodeLabel + (side === 'include' ? '选中' : '排除') + '条件格式有误'); return; }
        node[side].forEach(function (c, index) {
        var prefix = nodeLabel + (side === 'include' ? '选中' : '排除') + '条件' + (index + 1) + '：';
        var f = c && byId[c.field];
        if (!f || !f[side]) { errors.push(prefix + '维度不可用'); return; }
        var label = prefix + f.label;
        if (isEmptyCondition(c)) return;
        if (['enum', 'region', 'account'].indexOf(f.type) >= 0) {
          if (c.op !== 'in' || !Array.isArray(c.values) || !c.values.length) { errors.push(label + '请选择至少一个值'); return; }
          var options = f.type === 'account' ? allAccounts().map(function (a) { return a.id; }) : f.options;
          if (c.values.some(function (v) { return options.indexOf(v) < 0; })) errors.push(label + '包含已失效的选项');
          if (f.type === 'account' && c.values.some(function (v) { return permissions.managementAccountIds.indexOf(v) < 0; })) errors.push(label + '包含无权限的账号');
        } else if (f.type === 'days') {
          if (c.op !== 'within-days' || !whole(c.value, 1)) errors.push(label + '请输入1至36500之间的整数天数');
        } else if (f.type === 'date') {
          if (c.op === 'relative-day' || c.op === 'within-days') {
            if (!whole(c.value, c.op === 'relative-day' ? 0 : 1)) errors.push(label + '请输入有效的整数天数');
          } else if (c.op === 'relative-range') {
            if (!whole(c.min, 0) || !whole(c.max, 0) || Number(c.min) > Number(c.max)) errors.push(label + '请填写由小到大的天数区间');
          } else if (c.op === 'date-range') {
            if ((!c.start && !c.end) || (c.start && !isFinite(dateNumber(c.start))) || (c.end && !isFinite(dateNumber(c.end))) || (c.start && c.end && c.start > c.end)) errors.push(label + '请填写有效的日期区间');
          } else if (c.op === 'on') {
            if (!isFinite(dateNumber(c.value))) errors.push(label + '请选择有效日期');
          } else errors.push(label + '请选择有效判断方式');
        }
        });
      });
    });
    return unique(errors);
  }
  function describe(c) {
    var f = c && byId[c.field];
    if (!f) return '待选择条件';
    if (isEmptyCondition(c)) return f.label + '未配置（不参与筛选）';
    if (c.op === 'in') return f.label + '为' + ((c.values || []).map(function (v) { return f.type === 'account' ? accountName(v) : v; }).join('、') || '待选择');
    if (c.op === 'relative-day') return (f.id === 'added' ? '添加好友后的第' : f.label + '为回访日前第') + (c.value === '' ? '待填' : c.value) + '天';
    if (c.op === 'within-days') return (f.type === 'date' ? f.label + '在近' + (c.value || '待填') + '天内（含当天的自然日）' : '近' + (c.value || '待填') + '天内' + f.label + '（滚动' + (Number(c.value) * 24 || '—') + '小时）');
    if (c.op === 'relative-range') return f.label + '为回访日前' + (c.min || '0') + '至' + (c.max || '待填') + '天';
    if (c.op === 'date-range') return f.label + '为' + (c.start || '不限开始') + '至' + (c.end || '不限结束');
    if (c.op === 'on') return f.label + '为' + (c.value || '待选择日期');
    return f.label + '待配置';
  }
  function summary(rule) {
    rule = rule || emptyRule();
    var scope = rule.scope || { groupIds: [], accountIds: [] };
    var parts = (scope.groupIds || []).map(function (id) { var g = groups.find(function (item) { return item.id === id; }); return (g ? g.name : '失效群组') + '全部账号'; });
    parts = parts.concat((scope.accountIds || []).map(accountName));
    return {
      scope: parts.length ? parts.join('、') : '待选择账号范围',
      anchor: anchorsById[rule.anchor] ? anchorLabel(rule) + '为基准（当天第0天）' : '待选择回访基准',
      nodes: Array.isArray(rule.nodes) && rule.nodes.length ? rule.nodes.slice().sort(function (a, b) { return Number(a.day) - Number(b.day); }).map(function (node) { return whole(node.day, 0) ? '第' + Number(node.day) + '天' : '待填写时间节点'; }).join('、') + ' · 共' + rule.nodes.length + '个节点' : '尚未配置时间节点',
      schedule: '每天 ' + (rule.runAt || '待设置') + '（北京时间）筛选；' + (rule.enabled ? '已启用，仅本地演示' : '未启用')
    };
  }
  function nodeSummary(node) {
    node = node || { include: [], exclude: [] };
    return {
      include: activeConditions(node.include).length ? '全部满足：' + activeConditions(node.include).map(describe).join('；') : '无额外选中条件',
      exclude: activeConditions(node.exclude).length ? '任一命中即排除：' + activeConditions(node.exclude).map(describe).join('；') : '未设置额外排除条件'
    };
  }

  function message(direction, at, source, status) { return { direction: direction, at: at, source: source || 'normal', status: status || 'sent' }; }
  function friend(id, name, accountId, added, overrides) {
    var item = {
      id: id, name: name, accountId: accountId, addedAt: added ? added + 'T10:00:00+08:00' : null,
      values: { grade: 'A级', aiGrade: 'B级', demand1: '皮肤管理', demand2: '紧肤提升', hasPhone: '是', status: '正常',
        region: ['广东省', '深圳市', '南山区'], developer: '演示开发人甲', manager: '演示经理甲', membership: '普通',
        improvement: ['皮肤'], traits: ['高意向'], equipment: ['热玛吉'], doctor: '演示医生甲', style: ['自然'] },
      dates: { added: added, consulted: '2026-09-21', filed: '2026-09-01', appointment: '2026-09-30', revisited: '2026-09-20' },
      messages: [], commonGroups: { accountId: accountId, count: 0 }, events: null
    };
    overrides = overrides || {};
    Object.keys(overrides).forEach(function (key) {
      if (key === 'values' || key === 'dates') Object.assign(item[key], overrides[key]);
      else item[key] = overrides[key];
    });
    if (!legacyShenzhen) {
      item.id = identity(item.id); item.name = profile.city + ' · ' + item.name; item.accountId = identity(item.accountId);
      if (item.commonGroups) item.commonGroups.accountId = identity(item.commonGroups.accountId);
      ['developer', 'manager', 'doctor'].forEach(function (key) { if (item.values[key] != null) item.values[key] = person(item.values[key]); });
      if (item.values.region != null) item.values.region = profile.regions[item.values.region.at(-1) === '福田区' ? 1 : item.values.region.at(-1) === '岳麓区' ? profile.regions.length - 1 : 0].slice();
    }
    return item;
  }
  // Explicit fixtures make each outcome traceable; no id-modulo or random results.
  var fixtures = [
    friend('demo-f01', '示例好友甲', 'media-01', '2026-09-24', { messages: [message('outbound', '2026-09-24T15:00:00+08:00')] }),
    friend('demo-f02', '示例好友乙', 'media-01', '2026-09-24', { messages: [message('inbound', '2026-09-26T16:00:00+08:00')], values: { grade: 'B级' } }),
    friend('demo-f03', '示例好友丙', 'media-02', '2026-09-24', { messages: [message('outbound', '2026-09-26T09:00:00+08:00', 'broadcast')], values: { membership: '银卡' } }),
    friend('demo-f04', '示例好友丁', 'media-02', '2026-09-24', { messages: null }),
    friend('demo-f05', '示例好友戊', 'media-01', '2026-09-22', { values: { demand1: '眼部整形', improvement: ['眼部'], doctor: '演示医生乙' } }),
    friend('demo-f06', '示例好友己', 'douyin-01', '2026-09-22', { messages: [message('outbound', '2026-09-26T12:00:00+08:00', 'mobile')], values: { developer: '演示开发人乙' } }),
    friend('demo-f07', '示例好友庚', 'media-01', '2026-09-20', { values: { membership: '金卡', manager: '演示经理乙', region: ['广东省', '深圳市', '福田区'] } }),
    friend('demo-f08', '示例好友辛', 'media-02', '2026-09-20', { values: { status: '异常', hasPhone: '否', traits: ['低意向'] } }),
    friend('demo-f09', '示例好友壬', 'douyin-01', '2026-09-25', { values: { grade: 'C级', aiGrade: 'C级', style: ['精致'] } }),
    friend('demo-f10', '示例好友癸', 'media-01', null, { dates: { consulted: null }, values: { region: null } }),
    friend('demo-f11', '示例好友子', 'douyin-01', '2026-09-24', { messages: [message('inbound', '2026-09-26T10:00:00+08:00'), message('outbound', '2026-09-26T11:00:00+08:00')], commonGroups: { accountId: 'douyin-01', count: 1 } }),
    friend('demo-f12', '示例好友丑', 'media-01', '2026-09-24', { messages: [message('outbound', '2026-09-26T08:00:00+08:00', 'system'), message('outbound', '2026-09-26T08:30:00+08:00', 'normal', 'failed')] }),
    friend('demo-f13', '示例好友寅', 'xhs-01', '2026-09-24', { values: { region: ['湖南省', '长沙市', '岳麓区'], aiGrade: 'A级' }, commonGroups: { accountId: 'media-01', count: 2 } }),
    friend('demo-f14', '示例好友卯', 'ecommerce-01', '2026-09-24', { values: { demand1: '注射填充', equipment: ['玻尿酸'], membership: '钻石' } }),
    friend('demo-f15', '示例好友辰', 'agency-01', '2026-09-24', { values: { demand1: '鼻部整形', traits: ['犹豫中'], style: ['韩系'] }, commonGroups: { accountId: 'agency-01', count: null } }),
    // Same synthetic contact label, different account identity: never merged across permissions.
    friend('demo-f16', '示例好友甲', 'douyin-01', '2026-09-24', { values: { aiGrade: 'A级' } }),
    friend('demo-f17', '权限边界样本', 'revoked-account', '2026-09-24')
  ];
  // Explicit synthetic histories, created separately inside each tenant model.
  // They do not claim that CRM or grade-transition APIs are connected.
  function historyDates(dates) { return dates.map(function (at) { return { at: at }; }); }
  function gradeEvent(at, from, to) { return { at: at, from: from, to: to }; }
  fixtures[0].events = {
    visit: historyDates(['2026-09-20T14:00:00+08:00', '2026-09-24T11:00:00+08:00', '2026-09-30T11:00:00+08:00']),
    purchase: historyDates(['2026-09-20T15:00:00+08:00', '2026-09-24T12:00:00+08:00']),
    redemption: historyDates(['2026-09-22T14:00:00+08:00', '2026-09-24T13:00:00+08:00']),
    gradeManual: [gradeEvent('2026-09-24T10:00:00+08:00', 'C级', 'A级'), gradeEvent('2026-09-26T10:00:00+08:00', 'A级', 'A级')],
    gradeAI: [gradeEvent('2026-09-22T10:00:00+08:00', null, 'A级'), gradeEvent('2026-09-24T10:00:00+08:00', 'A级', 'B级')]
  };
  fixtures[1].events = { gradeManual: [gradeEvent('2026-09-24T10:00:00+08:00', 'C级', 'B级')], visit: historyDates(['2026-09-27T01:00:00+08:00', '2026-09-27T12:00:00+08:00']) };
  fixtures[2].events = { gradeManual: [gradeEvent('2026-09-24T10:00:00+08:00', 'C级', 'D级'), gradeEvent('2026-09-25T10:00:00+08:00', 'D级', 'A级')] };
  fixtures[5].events = { visit: [], purchase: [], redemption: [], gradeManual: [], gradeAI: [] };
  fixtures[8].events = { gradeManual: [gradeEvent('2026-09-24T10:00:00+08:00', 'D级', 'C级')], gradeAI: [gradeEvent('2026-09-24T11:00:00+08:00', 'D级', 'C级')] };
  fixtures[9].events = { visit: [{ at: 'invalid' }], purchase: null, redemption: [{ at: '2026-02-30' }], gradeManual: [{ at: 'unknown', from: 'C级', to: 'A级' }] };
  fixtures[15].events = { gradeAI: [gradeEvent('2026-09-24T09:00:00+08:00', 'B级', 'A级')], visit: historyDates(['2026-09-24']) };
  function threeAnd(list) { return list.indexOf(false) >= 0 ? false : list.indexOf(null) >= 0 ? null : true; }
  function threeOr(list) { return list.indexOf(true) >= 0 ? true : list.indexOf(null) >= 0 ? null : false; }
  function messageHit(f, direction, days, at) {
    if (!Array.isArray(f.messages)) return null;
    var unknown = false;
    var hit = f.messages.some(function (m) {
      if (!m || m.direction !== direction || m.source === 'system' || m.status === 'failed') return false;
      var timestamp = Date.parse(m.at);
      if (!isFinite(timestamp)) { unknown = true; return false; }
      if (timestamp < at - days * DAY || timestamp > at) return false;
      if (m.status === 'recalled' || m.status !== 'sent' || ['normal', 'broadcast', 'mobile'].indexOf(m.source) < 0) { unknown = true; return false; }
      return true;
    });
    return hit ? true : unknown ? null : false;
  }
  function matches(f, c, date, at) {
    var schema = byId[c.field];
    if (!schema) return null;
    if (schema.type === 'days') {
      if (c.field === 'both') return threeAnd([messageHit(f, 'inbound', Number(c.value), at), messageHit(f, 'outbound', Number(c.value), at)]);
      if (c.field === 'inbound' || c.field === 'outbound') return messageHit(f, c.field, Number(c.value), at);
      var addedAt = Date.parse(f.addedAt);
      return !isFinite(addedAt) ? null : addedAt >= at - Number(c.value) * DAY && addedAt <= at;
    }
    if (schema.type === 'date') {
      var actual = f.dates && f.dates[c.field], timestamp = dateNumber(actual);
      if (!isFinite(timestamp)) return null;
      var age = (dateNumber(date) - timestamp) / DAY;
      if (c.op === 'relative-day') return age === Number(c.value);
      if (c.op === 'within-days') return age >= 0 && age < Number(c.value);
      if (c.op === 'relative-range') return age >= Number(c.min) && age <= Number(c.max);
      if (c.op === 'date-range') return (!c.start || actual >= c.start) && (!c.end || actual <= c.end);
      if (c.op === 'on') return actual === c.value;
      return null;
    }
    if (c.field === 'account') return c.values.indexOf(f.accountId) >= 0;
    if (c.field === 'commonGroup') {
      if (!f.commonGroups || f.commonGroups.count == null || !isFinite(Number(f.commonGroups.count))) return null;
      var shared = f.commonGroups.accountId === f.accountId && Number(f.commonGroups.count) >= 1;
      return c.values.indexOf(shared ? '是' : '否') >= 0;
    }
    var value = f.values && f.values[c.field];
    if (value == null) return null;
    if (schema.type === 'region') {
      var path = Array.isArray(value) ? value : String(value).split(' / ');
      return c.values.some(function (candidate) { var parts = candidate.split(' / '); return parts.every(function (p, i) { return path[i] === p; }); });
    }
    var actualValues = Array.isArray(value) ? value : [value];
    return actualValues.some(function (item) { return c.values.indexOf(item) >= 0; });
  }
  function evaluate(rule, date) {
    date = date || '2026-09-27';
    var errors = validate(rule);
    if (!isFinite(dateNumber(date))) errors.push('试算日期无效');
    var atText = date + ' ' + (rule && rule.runAt || '01:00') + '（北京时间）';
    var result = { date: date, at: atText, counts: { scope: 0, selected: 0, excluded: 0, included: 0, unknown: 0 }, rows: [] };
    if (errors.length) { result.errors = errors; return result; }
    var at = Date.parse(date + 'T' + rule.runAt + ':00+08:00');
    var accounts = scopeIds(rule.scope);
    fixtures.filter(function (f) {
      var addedAt = Date.parse(f.addedAt);
      return accounts.indexOf(f.accountId) >= 0 && (!isFinite(addedAt) || addedAt <= at);
    }).forEach(function (f) {
      var row = { friend: { id: f.id, name: f.name, accountId: f.accountId }, nodeId: null, nodeDay: null, status: 'not-matched', reasons: [] };
      result.counts.scope += 1;
      var resolved = resolveAnchor(rule, f, at);
      if (resolved.status !== 'known') {
        row.status = resolved.status === 'unknown' ? 'unknown' : 'not-matched';
        row.reasons = [resolved.reason];
        if (row.status === 'unknown') result.counts.unknown += 1;
        result.rows.push(row);
        return;
      }
      var anchorDate = dateNumber(resolved.date);
      if (!isFinite(anchorDate)) {
        row.status = 'unknown';
        row.reasons = [resolved.label + '数据缺失，无法判断到期节点'];
        result.counts.unknown += 1;
        result.rows.push(row);
        return;
      }
      var daysSinceAnchor = (dateNumber(date) - anchorDate) / DAY;
      var node = rule.nodes.find(function (candidate) { return Number(candidate.day) === daysSinceAnchor; });
      var eventDetail = anchorsById[rule.anchor].type === 'date' ? '' : '（' + resolved.date + '）';
      if (!node) {
        row.reasons = [daysSinceAnchor < 0 ? '尚未到' + resolved.label + eventDetail + '，未命中时间节点' : '距' + resolved.label + eventDetail + '第' + daysSinceAnchor + '天，今天没有到期节点'];
        result.rows.push(row);
        return;
      }
      row.nodeId = node.id;
      row.nodeDay = String(node.day);
      var triggerReason = (rule.anchor === 'added' ? '添加好友后' : resolved.label + eventDetail + '后') + '第' + Number(node.day) + '天节点到期';
      var includes = activeConditions(node.include).map(function (c) { return { condition: c, hit: matches(f, c, date, at) }; });
      var selection = threeAnd(includes.map(function (entry) { return entry.hit; }));
      if (selection === false) {
        row.reasons = includes.filter(function (entry) { return entry.hit === false; }).map(function (entry) { return '未满足：' + describe(entry.condition); });
      } else if (selection === null) {
        row.status = 'unknown';
        row.reasons = includes.filter(function (entry) { return entry.hit === null; }).map(function (entry) { return byId[entry.condition.field].label + '数据缺失，无法判断'; });
        result.counts.unknown += 1;
      } else {
        result.counts.selected += 1;
        var exclusions = activeConditions(node.exclude).map(function (c) { return { condition: c, hit: matches(f, c, date, at) }; });
        var exclusion = threeOr(exclusions.map(function (entry) { return entry.hit; }));
        if (exclusion === true) {
          row.status = 'excluded';
          row.reasons = exclusions.filter(function (entry) { return entry.hit === true; }).map(function (entry) { return '命中排除：' + describe(entry.condition); });
          result.counts.excluded += 1;
        } else if (exclusion === null) {
          row.status = 'unknown';
          row.reasons = exclusions.filter(function (entry) { return entry.hit === null; }).map(function (entry) { return byId[entry.condition.field].label + '数据缺失，无法判断是否应排除'; });
          result.counts.unknown += 1;
        } else {
          row.status = 'included';
          row.reasons = includes.length ? includes.map(function (entry) { return '满足：' + describe(entry.condition); }) : ['属于所选账号范围'];
          row.reasons.push(exclusions.length ? '未命中任何排除条件' : '未设置额外排除条件');
          result.counts.included += 1;
        }
      }
      row.reasons.unshift(triggerReason);
      result.rows.push(row);
    });
    return result;
  }
  function evaluateNode(rule, nodeId, date) {
    var isolated = clone(rule);
    isolated.nodes = Array.isArray(isolated.nodes) ? isolated.nodes.filter(function (node) { return node && node.id === nodeId; }) : [];
    return evaluate(isolated, date);
  }
  function nextRun(rule, now) {
    if (!rule || !rule.enabled) return '未启用';
    if (validate(rule).length) return '配置需处理';
    var stamp = now == null ? Date.now() : now instanceof Date ? now.getTime() : typeof now === 'number' ? now : Date.parse(now);
    if (!isFinite(stamp)) return '无法确定下次时间';
    var localDate = new Date(stamp + OFFSET).toISOString().slice(0, 10);
    var next = Date.parse(localDate + 'T' + rule.runAt + ':00+08:00');
    if (next <= stamp) next += DAY;
    return new Date(next + OFFSET).toISOString().slice(0, 16).replace('T', ' ') + '（北京时间）';
  }
  function visibleForSales(rows, allowedAccountIds) {
    var allowed = Array.isArray(allowedAccountIds) ? allowedAccountIds : [];
    var directory = allAccounts().map(function (a) { return a.id; });
    return (Array.isArray(rows) ? rows : []).filter(function (row) {
      return row && row.status === 'included' && row.friend && allowed.indexOf(row.friend.accountId) >= 0 && directory.indexOf(row.friend.accountId) >= 0;
    }).map(clone);
  }
  return {
    tenantId: tenantId, tenantLabel: profile.city + '艺星',
    fields: fields, anchors: anchors, anchorLabel: anchorLabel, resolveAnchor: resolveAnchor, groups: groups, permissions: permissions,
    emptyRule: emptyRule, emptyNode: emptyNode, seedRules: seedRules, copyNodeConditions: copyNodeConditions, validate: validate,
    summary: summary, nodeSummary: nodeSummary, evaluate: evaluate, evaluateNode: evaluateNode, nextRun: nextRun, visibleForSales: visibleForSales,
    resolveAccountIds: scopeIds, describeCondition: describe, accountName: accountName,
    fixtureDate: '2026-09-27', getFixtures: function () { return clone(fixtures); }
  };
  }
  // Keep Shenzhen's published IDs and model API for existing v1/v2 browser data.
  root.RevisitRuleModel = createModel('yestar-sz');
  root.RevisitRuleModel.forTenant = createModel;
  root.RevisitRuleModel.supportedTenants = Object.keys(tenantProfiles).map(function (id) {
    return { id: id, name: tenantProfiles[id].city + '艺星', city: tenantProfiles[id].city };
  });
}(typeof window !== 'undefined' ? window : globalThis));
