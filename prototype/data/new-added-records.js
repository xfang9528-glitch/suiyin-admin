/* A page-scoped observation, not a generated business-data fixture. */
'use strict';
window.AdminNewAddedRecordSources = {
  'yestar-sz': {
    tenant: 'yestar-sz',
    route: 'newAddedRecords',
    url: 'https://yestar-sz.wecarepet.com/admin/newAddedRecords',
    defaultDate: '2026-09-20',
    observations: [
      {date: '2026-09-20', state: 'empty', source: 'user-screenshot-2026-09-20', filters: {account: '', repeated: '', friend: ''}},
      {date: '2026-09-18', state: 'empty', source: 'tenant-page-capture-2026-09-18T08:47:26.889Z', filters: {account: '', repeated: '', friend: ''}}
    ],
    accountOptions: [{value: '', label: '全部人设'}],
    accountOptionsComplete: false,
    repeatedOptions: [{value: '', label: '全部'}],
    repeatedOptionsComplete: false,
    friendOptions: [{value: '', label: '全部'}, {value: 'friend', label: '仅好友'}, {value: 'lost', label: '仅已流失'}],
    friendOptionsComplete: true,
    columns: [
      {label: '头像昵称', width: 210},
      {label: '所在微信号', width: 230},
      {label: '微信备注', width: 200},
      {label: '其他已添加人设', width: 260},
      {label: '拉新时间', width: 170},
      {label: '好友状态', width: 120},
      {label: '流失时间', width: 170}
    ]
  }
};
