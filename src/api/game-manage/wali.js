import http from '/@/utils/request'

/**
 * 游戏列表
 * @param {*} data
 * @returns
 */
export function apiGetGameList( data ) {
  return http.request( {
    method : 'get',
    url : '/game/list',
    data
  } )
}

/**
 * 新增游戏
 * @param {*} data
 * @returns
 */
export function apiAddGame( data ) {
  return http.request( {
    method : 'post',
    url : '/game/create',
    data
  } )
}

/**
 * 编辑游戏
 * @param {*} data
 * @returns
 */
export function apiEditGame( data ) {
  return http.request( {
    method : 'post',
    url : '/game/edit',
    data
  } )
}

/**
 * 获取游戏配置(新增游戏的时候，下拉列表)
 * @param {*} data
 * @returns
 */
export function apiGetGameConfigList( data ) {
  return http.request( {
    method : 'get',
    url : '/game/conf/list',
    data
  } )
}

/**
 * 删除游戏
 * @param {*} data
 * @returns
 */
export function delGame( data ) {
  return http.request( {
    method : 'get',
    url : '/game/del',
    data
  } )
}
