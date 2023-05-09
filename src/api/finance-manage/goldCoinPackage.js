import http from '/@/utils/request'

/**
 * 金币套餐列表
 * @param {*} data
 * @returns
 */
export function getGoldList( data ) {
  return http.request( {
    method : 'get',
    url : '/finance/gold/list',
    data
  } )
}

/**
 * 新增金币套餐
 * @param {*} data
 * @returns
 */
export function addGold( data ) {
  return http.request( {
    method : 'post',
    url : '/finance/gold/create',
    data
  } )
}

/**
 * 编辑金币套餐
 * @param {*} data
 * @returns
 */
export function editGold( data ) {
  return http.request( {
    method : 'post',
    url : '/finance/gold/edit',
    data
  } )
}

/**
 * 删除金币套餐
 * @param {*} data
 * @returns
 */
export function delGold( data ) {
  return http.request( {
    method : 'get',
    url : '/finance/gold/del',
    data
  } )
}
