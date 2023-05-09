import http from '/@/utils/request'

/**
 * 充值订单列表
 * @param {*} data
 * @returns
 */
export function getOrderList( data ) {
  return http.request( {
    method : 'get',
    url : '/finance/order/list',
    data
  } )
}

/**
 * 统计
 * @param {*} data
 * @returns
 */
export function apiCountOrder( data ) {
  return http.request( {
    method : 'get',
    url : '/finance/order/count',
    data
  } )
}

/**
 * 支付通道成功率统计
 * @param {*} data
 * @returns
 */
export function apiPayCountOrder( data ) {
  return http.request( {
    method : 'get',
    url : '/finance/pay/count',
    data
  } )
}

/**
 * 充值订单操作
 * @param {*} data
 * @returns
 */
export function apiEditRecharge( data ) {
  return http.request( {
    method : 'get',
    url : '/finance/order/edit',
    data
  } )
}
