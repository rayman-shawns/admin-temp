import http from '/@/utils/request'

/**
 * 获取列表-根据模块
 * @param {*} data
 * @returns
 */
export function apiGetAppConfig( data ) {
  return new Promise( ( resolve, reject ) => {
    http
      .request( {
        method : 'get',
        url : `/base/appConfig/${data.m}`
      } )
      .then( res => {
        const items = res?.data?.list?.splice( 2, 1 )
        res?.data?.list?.splice( 5, 0, items[0] )
        resolve( res )
      } )
      .catch( e => {
        reject( e )
      } )
  } )
  // return
}

/**
 * 修改（或新增）配置
 * @param {*} data
 * @returns
 */
export function apiUpdateAppConfig( data ) {
  return http.request( {
    method : 'post',
    url : '/base/appConfig',
    data
  } )
}

/**
 * 批量修改（或新增）配置
 * @param {*} data
 * @returns
 */
export function apiBatchUpdateAppConfig( data ) {
  return http.request( {
    method : 'post',
    url : '/base/appConfig/batch',
    data
  } )
}
