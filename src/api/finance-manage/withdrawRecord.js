import http from '/@/utils/request'

/**
 * 提现记录
 * @param {*} data
 * @returns
 */
export function getWithdrawList( data ) {
  return http.request( {
    method : 'get',
    url : '/finance/withdraw/list',
    data
  } )
}

/**
 * 提现统计
 * @param {*} data
 * @returns
 */
export function apiCountWithdraw( data ) {
  return http.request( {
    method : 'get',
    url : '/finance/withdraw/count',
    data
  } )
}

/**
 * 更新订单
 * @param {*} data
 * @returns
 */
export function apiEditWithdraw( data ) {
  return http.request( {
    method : 'post',
    url : '/finance/withdraw/edit',
    data
  } )
}

/**
 * 删除订单
 * @param {*} data
 * @returns
 */
export function apiDelWithdraw( data ) {
  return http.request( {
    method : 'get',
    url : '/finance/withdraw/del',
    data
  } )
}

/**
 * 提现密码修改
 * @param {*} data
 * @returns
 */
export function apiEditWithdrawPwd( data ) {
  return http.request( {
    method : 'get',
    url : '/finance/withdraw/pwd/edit',
    data
  } )
}
