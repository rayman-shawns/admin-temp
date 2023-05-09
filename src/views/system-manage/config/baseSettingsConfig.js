const generalModule = [
  {
    m : 'general',
    k : 'general_app_name',
    v : '',
    t : 1,
    label : '系统名称',
    des : '系统名称'
  },
  {
    m : 'general',
    k : 'general_app_logo',
    v : '',
    t : 4,
    label : '应用LOGO',
    des : ''
  },
  {
    m : 'general',
    k : 'general_app_start_time',
    v : '',
    t : 1,
    label : '启动时间',
    des : '单位秒钟，启动动画播放时间'
  },
  {
    m : 'general',
    k : 'general_search_interval_time',
    v : '',
    t : 1,
    label : '搜索间隔时间',
    des : '单位秒，用户搜索视频间隔时间'
  },
  {
    m : 'general',
    k : 'general_api_cache_time',
    v : '',
    t : 1,
    label : '前端api接口缓存时间',
    des : '单位分，可设置时间区间（例如 5,9），节省服务器资源，减少数据库压力，更新资源后如需即时生效请清理缓存'
  }
]
const moneyModule = [
  {
    m : 'money',
    k : 'money_withdraw_lowest_money',
    v : '',
    t : 1,
    label : '最低限额',
    des : '申请提现最低提余额数'
  },
  {
    m : 'money',
    k : 'money_withdraw_percentage',
    v : '',
    t : 1,
    label : '手续费',
    des : '申请提现时扣除的手续费，？%'
  },
  {
    m : 'money',
    k : 'money_withdraw_remain_money',
    v : '',
    t : 1,
    label : '游戏钱包剩余金币',
    des : '游戏钱包必须剩余金币，不能全部下分'
  },
  {
    m : 'money',
    k : 'money_rigster_gift_gamecoin',
    v : '',
    t : 1,
    label : '注册即送游戏金币',
    des : '成为正式会员赠送金币数量'
  }
]

export { generalModule, moneyModule }
