import http from '/@/utils/request'

/**
 * 视频列表
 * @param {*} data
 * @returns
 */
export function getVideoList( data ) {
  return http.request( {
    method : 'get',
    url : '/video/list',
    data
  } )
}

/**
 * 编辑视频
 * @param {*} data
 * @returns
 */
export function editUploadedVideo( data ) {
  return http.request( {
    method : 'post',
    url : `/video/edit`,
    data
  } )
}

/**
 * 删除视频
 * @param {*} data
 * @returns
 */
export function deleteUploadedVideo( data ) {
  return http.request( {
    method : 'post',
    url : `/video/del`,
    data
  } )
}

/**
 * 视频导入到H5资源库
 * @param {*} data
 * @returns
 */
export function videoImportToH5( data ) {
  return http.request( {
    method : 'post',
    url : `/video/videoImportToH5`,
    data
  } )
}

/**
 * 视频上下架
 * @param {*} data
 * @returns
 */
export function videoPutOn( data ) {
  return http.request( {
    method : 'post',
    url : `/video/videoPutOn`,
    data
  } )
}

/**
 * 获取key
 * @param {*} data
 * @returns
 */
export function getM3u8( videoId ) {
  return http.request( {
    method : 'GET',
    url : `/video/${videoId}/play`
  } )
}
