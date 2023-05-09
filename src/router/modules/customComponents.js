import Layout from '/@/layout/index.vue'

export default [
  {
    path : '/',
    component : Layout,
    name : 'Statistics',
    redirect : '/overview',
    meta : { title : '数据总览', icon : 'devices' },
    children : [
      {
        path : '/overview',
        component : () => import( '/@/views/statistics/overview.vue' ),
        name : 'Overview',
        meta : { title : '数据总览', noCache : true }
      },
      {
        path : '/overview-report',
        component : () => import( '/@/views/statistics/overviewReport.vue' ),
        name : 'OverviewReport',
        meta : { title : '每日报表', noCache : true }
      }
    ]
  },
  {
    path : '/system-manage',
    component : Layout,
    name : 'SystemManage',
    redirect : '/system-manage/base-settings',
    meta : { title : '系统管理', icon : 'devices' },
    children : [
      {
        path : '/system-manage/base-settings',
        component : () => import( '/@/views/system-manage/baseSettings.vue' ),
        name : 'BaseSettings',
        meta : { title : '基础设置', noCache : true }
      },
      {
        path : '/system-manage/video-settings',
        component : () => import( '/@/views/system-manage/videoSettings.vue' ),
        name : 'VideoSettings',
        meta : { title : '视频设置', noCache : true }
      },
      {
        path : '/system-manage/market-settings',
        component : () => import( '/@/views/system-manage/marketSettings.vue' ),
        name : 'MarketSettings',
        meta : { title : '推广设置', noCache : true }
      },
      {
        path : '/system-manage/sms-settings',
        component : () => import( '/@/views/system-manage/smsSettings.vue' ),
        name : 'SmsSettings',
        meta : { title : '短信设置', noCache : true }
      },
      {
        path : '/system-manage/domain-settings',
        component : () => import( '/@/views/system-manage/domainSettings.vue' ),
        name : 'DomainSettings',
        meta : { title : '域名设置', noCache : true }
      },
      {
        path : '/system-manage/picture-settings',
        component : () => import( '/@/views/system-manage/pictureSettings.vue' ),
        name : 'PictureSettings',
        meta : { title : '图片存储', noCache : true }
      },
      {
        path : '/system-manage/app-settings',
        component : () => import( '/@/views/system-manage/appSettings.vue' ),
        name : 'AppSettings',
        meta : { title : 'APP设置', noCache : true }
      },
      // {
      //   path : 'version-settings',
      //   component : () => import( '/@/views/system-manage/versionSettings.vue' ),
      //   name : 'VersionSettings',
      //   meta : { title : '版本控制', noCache : true }
      // },
      // {
      //   path : 'serve-settings',
      //   component : () => import( '/@/views/system-manage/serveSettings.vue' ),
      //   name : 'ServeSettings',
      //   meta : { title : '服务协议', noCache : true }
      // },
      // {
      //   path : 'privacy-settings',
      //   component : () => import( '/@/views/system-manage/privacySettings.vue' ),
      //   name : 'PrivacySettings',
      //   meta : { title : '隐私政策', noCache : true }
      // },
      {
        path : '/system-manage/aboutus-settings',
        component : () => import( '/@/views/system-manage/aboutusSettings.vue' ),
        name : 'AboutusSettings',
        meta : { title : '关于我们', noCache : true }
      }
    ]
  },
  {
    path : '/bulletin-manage',
    component : Layout,
    name : 'BulletinManage',
    redirect : '/bulletin-manage/website',
    meta : { title : '公告管理', icon : 'devices' },
    children : [
      {
        path : '/bulletin-manage/website',
        component : () => import( '/@/views/bulletin-manage/website.vue' ),
        name : 'Website',
        meta : { title : '站内公告', noCache : true }
      },
      {
        path : '/bulletin-manage/maintain',
        component : () => import( '/@/views/bulletin-manage/maintain.vue' ),
        name : 'Maintain',
        meta : { title : '维护公告', noCache : true }
      }
    ]
  },
  {
    path : '/advertisement-manage',
    component : Layout,
    name : 'AdvertisementManage',
    redirect : '/advertisement-manage/list',
    meta : { title : '广告管理', icon : 'devices' },
    children : [
      // {
      //   path : '/advertisement-manage/location',
      //   component : () => import( '/@/views/advertisement-manage/location.vue' ),
      //   name : 'Location',
      //   meta : { title : '广告位管理', noCache : true }
      // },
      {
        path : '/advertisement-manage/list',
        component : () => import( '/@/views/advertisement-manage/list.vue' ),
        name : 'List',
        meta : { title : '广告设置', noCache : true }
      }
    ]
  },
  {
    path : '/video-manage',
    component : Layout,
    name : 'VideoManage',
    redirect : '/video-manage/putedon',
    meta : { title : '视频管理', icon : 'devices' },
    children : [
      {
        path : '/video-manage/putedon',
        component : () => import( '/@/views/video-manage/putedOn.vue' ),
        name : 'PutedOn',
        meta : { title : '已上架视频', noCache : true }
      },
      {
        path : '/video-manage/pulledoff',
        component : () => import( '/@/views/video-manage/pulledOff.vue' ),
        name : 'PulledOff',
        meta : { title : '待上架视频', noCache : true }
      },
      {
        path : '/video-manage/template',
        component : () => import( '/@/views/video-manage/template.vue' ),
        name : 'Template',
        meta : { title : '定位标签', noCache : true }
      },
      {
        path : '/video-manage/topic',
        component : () => import( '/@/views/video-manage/topic.vue' ),
        name : 'Topic',
        meta : { title : '专题管理', noCache : true }
      },
      {
        path : '/video-manage/up',
        component : () => import( '/@/views/video-manage/up.vue' ),
        name : 'Up',
        meta : { title : 'UP主管理', noCache : true }
      },
      {
        path : '/video-manage/tag',
        component : () => import( '/@/views/video-manage/tag.vue' ),
        name : 'Tag',
        meta : { title : '播放标签', noCache : true }
      }
    ]
  },
  {
    path : '/member-manage',
    component : Layout,
    name : 'MemberManage',
    redirect : '/member-manage/member-list',
    meta : { title : '会员管理', icon : 'devices' },
    children : [
      {
        path : '/member-manage/member-list',
        component : () => import( '/@/views/member-manage/memberList.vue' ),
        name : 'MemberList',
        meta : { title : '会员列表', noCache : true }
      },
      // {
      //   path : '/member-manage/visitor-list',
      //   component : () => import( '/@/views/member-manage/visitorList.vue' ),
      //   name : 'VisitorList',
      //   meta : { title : '游客列表', noCache : true }
      // },
      {
        path : '/member-manage/user-record',
        component : () => import( '/@/views/member-manage/userRecord.vue' ),
        name : 'UserRecord',
        meta : { title : '用户足迹', noCache : true }
      },
      {
        path : '/member-manage/search-record',
        component : () => import( '/@/views/member-manage/searchRecord.vue' ),
        name : 'SearchRecord',
        meta : { title : '搜索记录', noCache : true }
      }
    ]
  },
  {
    path : '/finance-manage',
    component : Layout,
    name : 'FinanceManage',
    redirect : '/finance-manage/recharge-record',
    meta : { title : '财务管理', icon : 'devices' },
    children : [
      {
        path : '/finance-manage/recharge-record',
        component : () => import( '/@/views/finance-manage/rechargeRecord.vue' ),
        name : 'RechargeRecord',
        meta : { title : '充值记录', noCache : true }
      },
      {
        path : '/finance-manage/withdraw-record',
        component : () => import( '/@/views/finance-manage/withdrawRecord.vue' ),
        name : 'WithdrawRecord',
        meta : { title : '提现记录', noCache : true }
      },
      // {
      //   path : 'consume-record',
      //   component : () => import( '/@/views/finance-manage/consumeRecord.vue' ),
      //   name : 'ConsumeRecord',
      //   meta : { title : '消费记录', noCache : true }
      // },
      // {
      //   path : 'transfer-record',
      //   component : () => import( '/@/views/finance-manage/transferRecord.vue' ),
      //   name : 'TransferRecord',
      //   meta : { title : '转账记录', noCache : true }
      // },
      {
        path : '/finance-manage/bank-list',
        component : () => import( '/@/views/finance-manage/bankList.vue' ),
        name : 'BankList',
        meta : { title : '银行列表', noCache : true }
      },
      // {
      //   path : '/finance-manage/vip-package',
      //   component : () => import( '/@/views/finance-manage/vipPackage.vue' ),
      //   name : 'VipPackage',
      //   meta : { title : 'VIP套餐', noCache : true }
      // },
      {
        path : '/finance-manage/goldcoin-package',
        component : () => import( '/@/views/finance-manage/goldCoinPackage.vue' ),
        name : 'GoldCoinPackage',
        meta : { title : '金币套餐', noCache : true }
      },
      // {
      //   path : '/finance-manage/vip-convert',
      //   component : () => import( '/@/views/finance-manage/vipConvert.vue' ),
      //   name : 'VipConvert',
      //   meta : { title : 'VIP兑换', noCache : true }
      // },
      {
        path : '/finance-manage/payway',
        component : () => import( '/@/views/finance-manage/payway.vue' ),
        name : 'Payway',
        meta : { title : '支付方式', noCache : true }
      }
    ]
  },
  {
    path : '/game-manage',
    component : Layout,
    name : 'GameManage',
    redirect : '/game-manage/wali',
    meta : { title : '游戏管理', icon : 'devices' },
    children : [
      {
        path : '/game-manage/wali',
        component : () => import( '/@/views/game-manage/wali.vue' ),
        name : 'Wali',
        meta : { title : '瓦力游戏', noCache : true }
      },
      {
        path : '/game-manage/game-record',
        component : () => import( '/@/views/game-manage/gameRecord.vue' ),
        name : 'GameRecord',
        meta : { title : '游戏记录', noCache : true }
      },
      {
        path : '/game-manage/settings',
        component : () => import( '/@/views/game-manage/settings.vue' ),
        name : 'Settings',
        meta : { title : '配置', noCache : true }
      }
    ]
  },
  {
    path : '/agent-manage',
    component : Layout,
    name : 'AgentManage',
    redirect : '/agent-manage/agent-list',
    meta : { title : '代理管理', icon : 'devices' },
    children : [
      {
        path : '/agent-manage/agent-list',
        component : () => import( '/@/views/agent-manage/agentList.vue' ),
        name : 'AgentList',
        meta : { title : '代理列表', noCache : true }
      },
      {
        path : '/agent-manage/daily-report',
        component : () => import( '/@/views/agent-manage/dailyReport.vue' ),
        name : 'DailyReport',
        meta : { title : '代理每日统计', noCache : true }
      },
      {
        path : '/agent-manage/agent-withdraw',
        component : () => import( '/@/views/agent-manage/agentWithdraw.vue' ),
        name : 'AgentWithdraw',
        meta : { title : '代理提现申请', noCache : true }
      },
      {
        path : '/agent-manage/agent-bulletin',
        component : () => import( '/@/views/agent-manage/agentBulletin.vue' ),
        name : 'AgentBulletin',
        meta : { title : '代理公告', noCache : true }
      }
    ]
  }
]
