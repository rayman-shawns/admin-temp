import http from '/@/utils/request'

/**
 * 视频定位标签列表
 * @param {*} data
 * @returns
 */
export function getVideoPosTagList( data ) {
  return http.request( {
    method : 'post',
    url : '/video/pos/page',
    data
  } )
}

/**
 * 查询全部视频定位标签列表
 * @param {*} data
 * @returns
 */
export function getAllVideoPosTagList( data ) {
  return http.request( {
    method : 'get',
    url : '/video/pos/list',
    data
  } )
}

/**
 * 添加视频定位标签
 * @param {*} data
 * @returns
 */
export function addVideoPosTag( data ) {
  return http.request( {
    method : 'put',
    url : '/video/pos',
    data
  } )
}

/**
 * 编辑视频定位标签
 * @param {*} data
 * @returns
 */
export function editVideoPosTag( data ) {
  return http.request( {
    method : 'post',
    url : `/video/pos`,
    data
  } )
}

/**
 * 删除视频定位标签
 * @param {*} data
 * @returns
 */
export function deleteVideoPosTag( data ) {
  return http.request( {
    method : 'delete',
    url : `/video/pos`,
    data
  } )
}

/**
 * 查询全部视频定位标签列表
 * @param {*} data
 * @returns
 */
export function apiGetVideoPosList( data ) {
  return http.request( {
    method : 'get',
    url : `/video/pos/list`,
    data
  } )
}
