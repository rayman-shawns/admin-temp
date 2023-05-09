import http from '/@/utils/request'

/**
 * 分页获取广告列表
 * @param {*} data
 * @returns
 */
export function apiGetAdvertiseList( data ) {
  return http.request( {
    method : 'get',
    url : '/base/advertise/page',
    data
  } )
}

/**
 * 添加配置
 * @param {*} data
 * @returns
 */
export function apiAddAdvertise( data ) {
  return http.request( {
    method : 'put',
    url : '/base/advertise',
    data
  } )
}

/**
 * 修改广告
 * @param {*} data
 * @returns
 */
export function apiEditAdvertise( data ) {
  return http.request( {
    method : 'post',
    url : `/base/advertise`,
    data
  } )
}

/**
 * 删除标签tag
 * @param {*} data
 * @returns
 */
export function apiDeleteAdvertise( data ) {
  return http.request( {
    method : 'delete',
    url : `/base/advertise`,
    data
  } )
}
