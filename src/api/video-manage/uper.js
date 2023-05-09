import http from '/@/utils/request'

/**
 * 分页查询Up而列表
 * @param {*} data
 * @returns
 */
export function apiGetVideoUperList( data ) {
  return http.request( {
    method : 'get',
    url : '/video/uper/page',
    data
  } )
}

/**
 * 添加视频Uper
 * @param {*} data
 * @returns
 */
export function apiAddVideoUper( data ) {
  return http.request( {
    method : 'put',
    url : '/video/uper',
    data
  } )
}

/**
 * 编辑视频Uper
 * @param {*} data
 * @returns
 */
export function apiEditVideoUper( data ) {
  return http.request( {
    method : 'post',
    url : `/video/uper`,
    data
  } )
}

/**
 * 删除Uper
 * @param {*} data
 * @returns
 */
export function apiDeleteVideoUper( data ) {
  return http.request( {
    method : 'delete',
    url : `/video/uper`,
    data
  } )
}

/**
 * 设置Uper状态
 * @param {*} data
 * @returns
 */
export function apiSetStatus( data ) {
  return http.request( {
    method : 'post',
    url : `/video/uper/setTagStatus`,
    data
  } )
}
