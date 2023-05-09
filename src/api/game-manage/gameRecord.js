import http from '/@/utils/request'

/**
 * 游戏记录查询
 * @param {*} data
 * @returns
 */
export function apiGetGameBetList( data ) {
  return http.request( {
    method : 'get',
    url : '/game/bet/list',
    data
  } )
}

/**
 * 游戏信息
 * @param {*} data
 * @returns
 */
export function apiGetGameInfo( data ) {
  return http.request( {
    method : 'get',
    url : '/game/info',
    data
  } )
}
