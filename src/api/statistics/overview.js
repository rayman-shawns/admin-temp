import http from '/@/utils/request'

/**
 * 首页统计
 * @param {*} data
 * @returns
 */
export function apiGetDayOverview( data ) {
  return http.request( {
    method : 'get',
    url : '/agent/day/overview',
    data
  } )
}
