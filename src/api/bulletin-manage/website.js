import http from '/@/utils/request'

/**
 * 分页获取公告列表
 * @param {*} data
 * @returns
 */
export function apiGetNoticeList( data ) {
  return http.request( {
    method : 'get',
    url : '/base/notice/page',
    data
  } )
}

/**
 * 添加配置
 * @param {*} data
 * @returns
 */
export function apiAddNotice( data ) {
  return http.request( {
    method : 'put',
    url : '/base/notice',
    data
  } )
}

/**
 * 修改公告
 * @param {*} data
 * @returns
 */
export function apiEditNotice( data ) {
  return http.request( {
    method : 'post',
    url : `/base/notice`,
    data
  } )
}

/**
 * 删除标签tag
 * @param {*} data
 * @returns
 */
export function apiDeleteNotice( data ) {
  return http.request( {
    method : 'delete',
    url : `/base/notice`,
    data
  } )
}
