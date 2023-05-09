import http from '/@/utils/request'

/**
 * 会员列表
 * @param {*} data
 * @returns
 */
export function apiGetMemberList( data ) {
  return http.request( {
    method : 'post',
    url : '/member/account/page',
    data
  } )
}

/**
 * 设置up主
 * @param {*} data
 * @returns
 */
export function apiSetMemberUpStatus( data ) {
  return http.request( {
    method : 'post',
    url : '/member/account/SetMemberUpStatus',
    data
  } )
}

/**
 * 会员启用禁用
 * @param {*} data
 * @returns
 */
export function apiSetMemberStatus( data ) {
  return http.request( {
    method : 'post',
    url : '/member/account/SetMemberStatus',
    data
  } )
}

/**
 * 会员删除
 * @param {*} data
 * @returns
 */
export function apiDelMember( data ) {
  return http.request( {
    method : 'post',
    url : '/member/account/delMember',
    data
  } )
}

/**
 * 编辑会员基本信息
 * @param {*} data
 * @returns
 */
export function apiEditMember( data ) {
  return http.request( {
    method : 'post',
    url : '/member/account/editMember',
    data
  } )
}

/**
 * 会员银行卡列表
 * @param {*} data
 * @returns
 */
export function apiGetMemberBankList( data ) {
  return http.request( {
    method : 'post',
    url : '/member/bank/getMemberBankList',
    data
  } )
}

/**
 * 中心钱包加减额
 * @param {*} data
 * @returns
 */
export function apiSetUserCoin( data ) {
  return http.request( {
    method : 'post',
    url : '/member/account/SetUserCoin',
    data
  } )
}

/**
 * 游戏钱包加减额
 * @param {*} data
 * @returns
 */
export function apiSetGameCoin( data ) {
  return http.request( {
    method : 'post',
    url : '/member/account/SetGameCoin',
    data
  } )
}

/**
 * 获取用户中心钱包余额
 * @param {*} data
 * @returns
 */
export function apiGetWalletBalance( data ) {
  return http.request( {
    method : 'post',
    url : '/member/account/getWalletBalance',
    data
  } )
}

/**
 * 获取用户游戏钱包余额
 * @param {*} data
 * @returns
 */
export function apiGetGameWalletBalance( data ) {
  return http.request( {
    method : 'post',
    url : '/member/account/getGameWalletBalance',
    data
  } )
}

/**
 * 获取搜索记录排行榜
 * @param {*} data
 * @returns
 */
export function apiGetHotList( data ) {
  return http.request( {
    method : 'get',
    url : '/video/getHotList',
    data
  } )
}

/**
 * 用户VIP套餐修改
 * @param {*} data
 * @returns
 */
export function apiAccountchangeUserVip( data ) {
  return http.request( {
    method : 'post',
    url : '/member/account/changeUserVip',
    data
  } )
}

/**
 * 获取游客数量
 * @param {*} data
 * @returns
 */
export function apiGetGuestCount( data ) {
  return http.request( {
    method : 'get',
    url : '/member/account/getGuestCount',
    data
  } )
}

/**
 * 获取会员基本统计信息
 * @param {*} data
 * @returns
 */
export function apiGetUserBaseStaticis( data ) {
  return http.request( {
    method : 'post',
    url : '/member/account/getUserBaseStaticis',
    data
  } )
}

/**
 * 删除搜索热词
 * @param {*} data
 * @returns
 */
export function apiDelHotKey( data ) {
  return http.request( {
    method : 'post',
    url : '/video/delHotKey',
    data
  } )
}

/**
 * 按时间删除游客
 * @param {*} data
 * @returns
 */
export function apiDelGuest( data ) {
  return http.request( {
    method : 'post',
    url : '/member/account/delGuest',
    data
  } )
}
