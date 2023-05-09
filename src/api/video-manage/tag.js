import http from '/@/utils/request'

/**
 * 标签列表
 * @param {*} data
 * @returns
 */
export function getVideoTagList( data ) {
  return http.request( {
    method : 'get',
    url : '/video/tag/list',
    data
  } )
}

/**
 * 添加视频标签
 * @param {*} data
 * @returns
 */
export function addVideoTag( data ) {
  return http.request( {
    method : 'put',
    url : '/video/tag/add',
    data
  } )
}

/**
 * 编辑视频标签
 * @param {*} data
 * @returns
 */
export function editVideoTag( { id, data } ) {
  return http.request( {
    method : 'post',
    url : `/video/tag/${id}`,
    data
  } )
}

/**
 * 删除视频标签
 * @param {*} data
 * @returns
 */
export function deleteVideoTag( data ) {
  return http.request( {
    method : 'post',
    url : `/video/tag/del`,
    data
  } )
}

/**
 * 设置tag状态
 * @param {*} data
 * @returns
 */
export function apiSetStatus( data ) {
  return http.request( {
    method : 'post',
    url : `/video/tag/setTagStatus`,
    data
  } )
}
