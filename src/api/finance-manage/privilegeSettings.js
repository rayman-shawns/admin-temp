import http from '/@/utils/request'

/**
 * 特权列表查询接口
 * @param {*} data
 * @returns
 */
export function getPrivilegeList( data ) {
  return http.request( {
    method : 'get',
    url : '/finance/privilege/list',
    data
  } )
}

/**
 * 新增特权
 * @param {*} data
 * @returns
 */
export function addPrivilege( data ) {
  return http.request( {
    method : 'post',
    url : '/finance/privilege/create',
    data
  } )
}

/**
 * 编辑特权
 * @param {*} data
 * @returns
 */
export function editPrivilege( data ) {
  return http.request( {
    method : 'post',
    url : '/finance/privilege/edit',
    data
  } )
}

/**
 * 删除特权
 * @param {*} data
 * @returns
 */
export function delPrivilege( data ) {
  return http.request( {
    method : 'get',
    url : '/finance/privilege/del',
    data
  } )
}
