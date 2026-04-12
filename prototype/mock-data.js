/**
 * 碎银管理后台 Mock 数据
 * 与 PC 端 / APP 端 mock-data.js 对齐
 */

// ===== 人设号（3个） =====
const PERSONAS = [
  { id: '1号', label: '1号', color: '#e8613a' },
  { id: '2号', label: '2号', color: '#e8613a' },
  { id: '3号', label: '3号', color: '#e8613a' },
];

// ===== 角色 =====
const ROLE_MAP = {
  superadmin: { label: '超级管理员', cls: 'role-superadmin', avatarCls: 'superadmin' },
  admin:      { label: '管理员',     cls: 'role-admin',      avatarCls: 'admin' },
  sales:      { label: '销售',       cls: 'role-sales',      avatarCls: '' },
  bookclub:   { label: '读书会管理员', cls: 'role-admin',    avatarCls: 'admin' },
  engineer:   { label: '工程师',     cls: 'role-sales',      avatarCls: '' },
  referral:   { label: '拉新人',     cls: 'role-sales',      avatarCls: '' },
};

const STATUS_MAP = {
  on:   { dot: 'on',   text: '在线' },
  off:  { dot: 'off',  text: '离线' },
  busy: { dot: 'busy', text: '忙碌' },
};

// ===== 销售人员（12人） =====
const SALES_DATA = [
  { id:1, name:'房昕',   phone:'138****8888', role:'superadmin', single:9999, group:9999, mentor:'—',     accounts:['1号','2号','3号'], status:'on',  created:'2024-03-01' },
  { id:2, name:'王晓琳', phone:'139****2201', role:'admin',      single:500,  group:100,  mentor:'—',     accounts:['1号','2号'],       status:'on',  created:'2024-03-05' },
  { id:3, name:'陈文博', phone:'186****3357', role:'admin',      single:500,  group:100,  mentor:'—',     accounts:['2号','3号'],       status:'on',  created:'2024-03-05' },
  { id:4, name:'周海燕', phone:'177****1102', role:'sales',      single:200,  group:50,   mentor:'王晓琳', accounts:['1号','2号'],       status:'on',  created:'2024-04-10' },
  { id:5, name:'刘建国', phone:'155****6643', role:'sales',      single:200,  group:50,   mentor:'王晓琳', accounts:['3号'],             status:'on',  created:'2024-04-10' },
  { id:6, name:'赵思远', phone:'135****8821', role:'sales',      single:200,  group:50,   mentor:'陈文博', accounts:['1号'],             status:'on',  created:'2024-05-03' },
  { id:7, name:'杨雪梅', phone:'158****4490', role:'sales',      single:200,  group:50,   mentor:'陈文博', accounts:['2号'],             status:'busy',created:'2024-05-03' },
  { id:8, name:'吴国强', phone:'130****7713', role:'sales',      single:200,  group:50,   mentor:'王晓琳', accounts:['3号'],             status:'off', created:'2024-06-18' },
  { id:9, name:'孙丽华', phone:'181****2230', role:'sales',      single:150,  group:30,   mentor:'周海燕', accounts:['2号'],             status:'on',  created:'2024-07-22' },
  { id:10,name:'张明宇', phone:'136****5587', role:'sales',      single:150,  group:30,   mentor:'周海燕', accounts:['1号','3号'],       status:'on',  created:'2024-08-14' },
  { id:11,name:'李婷',   phone:'159****3348', role:'sales',      single:150,  group:30,   mentor:'刘建国', accounts:['3号'],             status:'off', created:'2024-09-01' },
  { id:12,name:'黄伟',   phone:'176****9902', role:'sales',      single:100,  group:20,   mentor:'刘建国', accounts:['1号'],             status:'on',  created:'2025-01-15' },
];

// ===== 好友/联系人（25人，与 PC/APP 端 USERS 对齐） =====
const FRIENDS_DATA = [
  { id:1,  name:'李美丽', phone:'138****5678', wechatId:'limeili_2023',     persona:'1号', gender:'female', addTime:'2024-02-15', source:'扫一扫',   tags:['意向客户','VIP'] },
  { id:2,  name:'张小花', phone:'136****5432', wechatId:'zhangxiaohua88',   persona:'2号', gender:'female', addTime:'2024-02-20', source:'手机号',   tags:['已消费','水光针'] },
  { id:4,  name:'王丽华', phone:'150****9876', wechatId:'wanglihua_vip',    persona:'3号', gender:'female', addTime:'2024-03-01', source:'群聊',     tags:['VIP','老客户'] },
  { id:5,  name:'赵燕子', phone:'133****6666', wechatId:'zhaoyanzi_88',     persona:'2号', gender:'female', addTime:'2024-03-05', source:'扫一扫',   tags:['意向客户'] },
  { id:6,  name:'陈小雨', phone:'136****6666', wechatId:'chenxiaoyu_99',    persona:'1号', gender:'female', addTime:'2024-03-10', source:'手机号',   tags:['新客户'] },
  { id:7,  name:'周婷婷', phone:'137****7777', wechatId:'zhoutingting_22',  persona:'2号', gender:'female', addTime:'2024-03-15', source:'群聊',     tags:['已消费'] },
  { id:8,  name:'刘芳芳', phone:'133****0008', wechatId:'liufangfang_08',   persona:'3号', gender:'female', addTime:'2024-03-20', source:'扫一扫',   tags:['意向客户'] },
  { id:9,  name:'黄小芳', phone:'159****0009', wechatId:'huangxiaofang_09', persona:'1号', gender:'female', addTime:'2024-04-01', source:'手机号',   tags:['新客户'] },
  { id:10, name:'吴丽丽', phone:'187****0010', wechatId:'wulili_10',        persona:'2号', gender:'female', addTime:'2024-04-05', source:'群聊',     tags:['已消费','热玛吉'] },
  { id:11, name:'孙小红', phone:'133****0011', wechatId:'sunxiaohong_11',   persona:'3号', gender:'female', addTime:'2024-04-10', source:'扫一扫',   tags:['意向客户'] },
  { id:13, name:'马小兰', phone:'176****0013', wechatId:'maxiaolan_13',     persona:'2号', gender:'female', addTime:'2024-04-20', source:'手机号',   tags:['新客户'] },
  { id:14, name:'杨晓梅', phone:'135****0014', wechatId:'yangxiaomei_14',   persona:'1号', gender:'female', addTime:'2024-05-01', source:'扫一扫',   tags:['已消费'] },
  { id:15, name:'何小云', phone:'188****0015', wechatId:'hexiaoyun_15',     persona:'3号', gender:'female', addTime:'2024-05-10', source:'群聊',     tags:['意向客户','VIP'] },
  { id:16, name:'郑小敏', phone:'152****0016', wechatId:'zhengxiaomin_16',  persona:'1号', gender:'female', addTime:'2024-05-15', source:'手机号',   tags:['新客户'] },
  { id:17, name:'许小琴', phone:'137****0017', wechatId:'xuxiaoqin_17',     persona:'2号', gender:'female', addTime:'2024-05-20', source:'群聊',     tags:['已消费'] },
  { id:18, name:'朱小燕', phone:'186****0018', wechatId:'zhuxiaoyan_18',    persona:'3号', gender:'female', addTime:'2024-06-01', source:'扫一扫',   tags:['意向客户'] },
  { id:19, name:'林小玲', phone:'150****0019', wechatId:'linxiaoling_19',   persona:'1号', gender:'female', addTime:'2024-06-10', source:'手机号',   tags:['新客户'] },
  { id:20, name:'高小慧', phone:'134****0020', wechatId:'gaoxiaohui_20',    persona:'2号', gender:'female', addTime:'2024-06-15', source:'群聊',     tags:['已消费'] },
  { id:21, name:'曹小丹', phone:'178****0021', wechatId:'caoxiaodan_21',    persona:'3号', gender:'female', addTime:'2024-07-01', source:'扫一扫',   tags:['新客户'] },
  { id:22, name:'魏小珍', phone:'156****0022', wechatId:'weixiaozhen_22',   persona:'1号', gender:'female', addTime:'2024-07-10', source:'手机号',   tags:['意向客户'] },
  { id:23, name:'蒋小莉', phone:'138****0023', wechatId:'jiangxiaoli_23',   persona:'2号', gender:'female', addTime:'2024-07-15', source:'群聊',     tags:['已消费'] },
  { id:24, name:'沈小婷', phone:'136****0024', wechatId:'shenxiaoting_24',  persona:'3号', gender:'female', addTime:'2024-08-01', source:'扫一扫',   tags:['新客户'] },
  { id:25, name:'韩小冰', phone:'159****0025', wechatId:'hanxiaobing_25',   persona:'1号', gender:'female', addTime:'2024-08-10', source:'手机号',   tags:['VIP','老客户'] },
  { id:26, name:'唐小静', phone:'187****0026', wechatId:'tangxiaojing_26',  persona:'2号', gender:'female', addTime:'2024-08-15', source:'群聊',     tags:['意向客户'] },
  { id:27, name:'冯小雪', phone:'133****0027', wechatId:'fengxiaoxue_27',   persona:'3号', gender:'female', addTime:'2024-09-01', source:'扫一扫',   tags:['新客户'] },
];

// ===== 专家列表（15人，与 PC/APP 端对齐） =====
const EXPERTS_DATA = [
  { id:901, name:'张兽医',   specialty:'宠物外科', gender:'male',   status:'on',  phone:'139****1001', created:'2023-06-01' },
  { id:902, name:'李营养师', specialty:'宠物营养', gender:'female', status:'on',  phone:'136****1002', created:'2023-06-15' },
  { id:903, name:'王皮肤科', specialty:'皮肤病',   gender:'male',   status:'on',  phone:'155****1003', created:'2023-07-01' },
  { id:904, name:'赵行为师', specialty:'行为矫正', gender:'female', status:'off', phone:'177****1004', created:'2023-07-10' },
  { id:905, name:'孙眼科',   specialty:'眼科',     gender:'male',   status:'on',  phone:'138****1005', created:'2023-08-01' },
  { id:906, name:'周骨科',   specialty:'骨科',     gender:'male',   status:'off', phone:'186****1006', created:'2023-08-15' },
  { id:907, name:'吴内科',   specialty:'内科',     gender:'female', status:'on',  phone:'130****1007', created:'2023-09-01' },
  { id:908, name:'郑牙科',   specialty:'口腔科',   gender:'male',   status:'off', phone:'158****1008', created:'2023-09-10' },
  { id:909, name:'陈中医',   specialty:'中兽医',   gender:'male',   status:'on',  phone:'181****1009', created:'2023-10-01' },
  { id:910, name:'黄心脏科', specialty:'心脏科',   gender:'female', status:'off', phone:'135****1010', created:'2023-10-15' },
  { id:911, name:'林繁殖师', specialty:'繁殖',     gender:'female', status:'on',  phone:'159****1011', created:'2023-11-01' },
  { id:912, name:'徐美容师', specialty:'宠物美容', gender:'female', status:'off', phone:'176****1012', created:'2023-11-10' },
  { id:913, name:'马训犬师', specialty:'训犬',     gender:'male',   status:'on',  phone:'136****1013', created:'2023-12-01' },
  { id:914, name:'高急诊',   specialty:'急诊',     gender:'male',   status:'off', phone:'187****1014', created:'2023-12-15' },
  { id:915, name:'刘康复师', specialty:'康复理疗', gender:'female', status:'off', phone:'133****1015', created:'2024-01-01' },
];

// ===== 群列表 =====
const GROUPS_DATA = [
  { id:101, name:'艺星客户群',  memberCount:128, persona:'1号', created:'2024-02-01' },
  { id:102, name:'VIP客户群',   memberCount:56,  persona:'1号', created:'2024-03-01' },
  { id:103, name:'新客咨询群',  memberCount:32,  persona:'2号', created:'2024-04-01' },
];

// ===== 标签列表 =====
const TAGS_DATA = [
  { id:1, name:'VIP',       count:4,  color:'#dc2626' },
  { id:2, name:'意向客户',   count:8,  color:'#f59e0b' },
  { id:3, name:'已消费',     count:7,  color:'#07c160' },
  { id:4, name:'新客户',     count:8,  color:'#3b82f6' },
  { id:5, name:'老客户',     count:2,  color:'#8b5cf6' },
  { id:6, name:'水光针',     count:1,  color:'#06b6d4' },
  { id:7, name:'热玛吉',     count:1,  color:'#ec4899' },
];
