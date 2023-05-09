import http from '/@/utils/request'

/**
 * 获取用户(播放记录)足迹
 * @param {*} data
 * @returns
 */
export function apiGetUserPlayRecord( data ) {
  return http.request( {
    method : 'post',
    url : '/video/getUserPlayRecord',
    data
  } )
}

/**
 * 按3天前时间删除用户(播放记录)足迹
 * @param {*} data
 * @returns
 */
export function apiDelUserPlayRecord3Day( data ) {
  return http.request( {
    method : 'post',
    url : '/video/delUserPlayRecord3Day',
    data
  } )
}
