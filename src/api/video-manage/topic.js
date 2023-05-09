import http from '/@/utils/request'

/**
 * 专题列表
 * @param {*} data
 * @returns
 */
export function getTopicList( data ) {
  return http.request( {
    method : 'get',
    url : '/video/topic/list',
    data
  } )
}

/**
 * 添加视频专题
 * @param {*} data
 * @returns
 */
export function addTopic( data ) {
  return http.request( {
    method : 'post',
    url : '/video/topic/add',
    data
  } )
}

/**
 * 编辑视频专题
 * @param {*} data
 * @returns
 */
export function editTopic( { id, data } ) {
  return http.request( {
    method : 'post',
    url : `/video/topic/${id}`,
    data
  } )
}

/**
 * 删除视频专题
 * @param {*} data
 * @returns
 */
export function deleteTopic( data ) {
  return http.request( {
    method : 'post',
    url : `/video/topic/del`,
    data
  } )
}

/**
 * 设置topic状态
 * @param {*} data
 * @returns
 */
export function apiSetStatus( data ) {
  return http.request( {
    method : 'post',
    url : `/video/topic/setTopicStatus`,
    data
  } )
}
