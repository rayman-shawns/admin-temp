import http from '/@/utils/request'

/**
 * 代理分页
 * @param {*} data
 * @returns
 */
export function apiGetAgentList( data ) {
  return http.request( {
    method : 'post',
    url : '/agent/info/page',
    data
  } )
}

/**
 * 添加代理
 * @param {*} data
 * @returns
 */
export function apiAddAgent( data ) {
  return http.request( {
    method : 'put',
    url : '/agent/info',
    data
  } )
}

/**
 * 修改代理
 * @param {*} data
 * @returns
 */
export function apiEditAgent( data ) {
  return http.request( {
    method : 'post',
    url : '/agent/info',
    data
  } )
}

/**
 * 删除代理
 * @param {*} data
 * @returns
 */
export function apiDelAgent( data ) {
  return http.request( {
    method : 'delete',
    url : '/agent/info',
    data
  } )
}

/**
 * 代理详情分页
 * @param {*} data
 * @returns
 */
export function apiGetAgentDetailList( data ) {
  return http.request( {
    method : 'post',
    url : '/agent/info/detail/page',
    data
  } )
}
