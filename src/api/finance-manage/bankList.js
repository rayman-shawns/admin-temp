import http from '/@/utils/request'

/**
 * 银行列表查询接口
 * @param {*} data
 * @returns
 */
export function getBankList( data ) {
  return http.request( {
    method : 'get',
    url : '/finance/bank/list',
    data
  } )
}

/**
 * 新增银行
 * @param {*} data
 * @returns
 */
export function addBank( data ) {
  return http.request( {
    method : 'post',
    url : '/finance/bank/create',
    data
  } )
}

/**
 * 编辑银行
 * @param {*} data
 * @returns
 */
export function editBank( data ) {
  return http.request( {
    method : 'post',
    url : '/finance/bank/edit',
    data
  } )
}

/**
 * 删除银行
 * @param {*} data
 * @returns
 */
export function delBank( data ) {
  return http.request( {
    method : 'get',
    url : '/finance/bank/del',
    data
  } )
}
