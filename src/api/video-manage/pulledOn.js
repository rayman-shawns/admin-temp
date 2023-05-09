import http from '/@/utils/request'

/**
 * 批量给视频打标签
 * @param {*} data
 * @returns
 */
export function batchTagVideos( data ) {
  return http.request( {
    method : 'post',
    url : `/video/tagVideos`,
    data
  } )
}

/**
 * 增加视频统计信息
 * @param {*} data
 * @returns
 */
export function batchStatisticsVideos( data ) {
  return http.request( {
    method : 'post',
    url : `/video/stat`,
    data
  } )
}

/**
 * 批量给视频打tag新增加模式ad
 * @param {*} data
 * @returns
 */
export function batchTagVideoAdd( data ) {
  return http.request( {
    method : 'post',
    url : `/video/tagVideoAdd`,
    data
  } )
}
