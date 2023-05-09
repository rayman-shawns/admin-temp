import http from '/@/utils/request'

/**
 * 用户注册
 * @param {*} data
 * @returns
 */
export function apiRegister( data ) {
  return http.request( {
    method : 'post',
    url : '/admin/register',
    data
  } )
}

/**
 * 用户登录
 * @param {*} data
 * @returns
 */
export function apiLogin( data ) {
  return http.request( {
    method : 'post',
    url : '/admin/login',
    data
  } )
}
