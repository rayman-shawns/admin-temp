import http from '/@/utils/request'

/**
 * 支付列表查询接口
 * @param {*} data
 * @returns
 */
export function getPayList( data ) {
  return http.request( {
    method : 'get',
    url : '/finance/pay/list',
    data
  } )
}

/**
 * 新增支付
 * @param {*} data
 * @returns
 */
export function addPay( data ) {
  return http.request( {
    method : 'post',
    url : '/finance/pay/create',
    data
  } )
}

/**
 * 编辑支付
 * @param {*} data
 * @returns
 */
export function editPay( data ) {
  return http.request( {
    method : 'post',
    url : '/finance/pay/edit',
    data
  } )
}

/**
 * 删除支付
 * @param {*} data
 * @returns
 */
export function delPay( data ) {
  return http.request( {
    method : 'get',
    url : '/finance/pay/del',
    data
  } )
}

/**
 * 一键检测支付是否可用
 * @param {*} data
 * @returns
 */
export function apiCheckAvailable( data ) {
  return http.request( {
    method : 'get',
    url : '/finance/pay/available',
    data
  } )
}

/**
 * 检测支付是否可用
 * @param {*} data
 * @returns
 */
export function apiCheckSingelAvailable( { id } ) {
  return http.request( {
    method : 'get',
    url : `/finance/pay/available/single?id=${id}`
  } )
}
