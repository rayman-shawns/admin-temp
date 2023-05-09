import http from '/@/utils/request'

/**
 * 获取用户中心钱包账变记录
 * @param {*} data
 * @returns
 */
export function apiGetWalletChangeLog( data ) {
  return http.request( {
    method : 'post',
    url : '/member/account/getWalletChangeLog',
    data
  } )
}

/**
 * 获取用户游戏钱包账变记录
 * @param {*} data
 * @returns
 */
export function apiGetGameWalletChangeLog( data ) {
  return http.request( {
    method : 'post',
    url : '/member/account/getGameWalletChangeLog',
    data
  } )
}
