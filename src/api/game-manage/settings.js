import http from '/@/utils/request'

/**
 * 查询场馆配置列表
 * @param {*} data
 * @returns
 */
export function apiGetGamePlatList( data ) {
  return http.request( {
    method : 'get',
    url : '/game/plat/list',
    data
  } )
}

/**
 * 新增场馆配置
 * @param {*} data
 * @returns
 */
export function apiAddGamePlat( data ) {
  return http.request( {
    method : 'post',
    url : '/game/plat/create',
    data
  } )
}

/**
 * 修改场馆配置接口
 * @param {*} data
 * @returns
 */
export function apiEditGamePlat( data ) {
  return http.request( {
    method : 'post',
    url : '/game/plat/edit',
    data
  } )
}
