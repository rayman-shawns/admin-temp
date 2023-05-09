import http from '/@/utils/request'

/**
 * VIP套餐查询接口
 * @param {*} data
 * @returns
 */
export function getVipList( data ) {
  return http.request( {
    method : 'get',
    url : '/finance/vip/list',
    data
  } )
}

/**
 * 新增VIP套餐
 * @param {*} data
 * @returns
 */
export function addVip( data ) {
  return http.request( {
    method : 'post',
    url : '/finance/vip/create',
    data
  } )
}

/**
 * 编辑VIP套餐
 * @param {*} data
 * @returns
 */
export function editVip( data ) {
  return http.request( {
    method : 'post',
    url : '/finance/vip/edit',
    data
  } )
}

/**
 * 删除VIP套餐
 * @param {*} data
 * @returns
 */
export function delVip( data ) {
  return http.request( {
    method : 'get',
    url : '/finance/vip/del',
    data
  } )
}
