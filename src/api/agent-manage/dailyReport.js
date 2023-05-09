import http from '/@/utils/request'

/**
 * 每日报表
 * @param {*} data
 * @returns
 */
export function apiGetAgentDayListOld( data ) {
  return http.request( {
    method : 'get',
    url : '/agent/day/page',
    data
  } )
}

/**
 * 代理每日统计分页
 * @param {*} data
 * @returns
 */
export function apiGetAgentDayList( data ) {
  // if ( data.account ) {
  //   data.agentAccount = data.account
  // }
  return new Promise( ( resolve, reject ) => {
    http.request( {
      method : 'get',
      url : 'agent/day/v2/page', // /agent/day/page
      data
    } ).then( res => {
      // const { data : { list }} = res
      // list.map( item => {
      //   item.agentAccount = item.account // 代理账号
      //   item.accessIpNum = item.accessIp
      //   item.registerNum = item.userCount
      //   item.androidDownloadNum = item.androidDownloadCount
      //   item.iosDownloadNum = item.iosDownloadCount
      //   item.centerCharge = item.centerRecharge
      //   // item.gameRecharge = item.gameRecharge
      //   item.gameBidMoney = item.gameBidCoin
      //   item.centerRate = item.centerRechargeRate
      //   item.gameRate = item.gameProfitRate
      //   item.centerProfit = item.centerProfitCoin
      //   item.gameProfit = item.gameProfitCoin
      //   item.centerFirstRechargeNum = item.centerFirstRechargeCount
      //   item.gameFirstRechargeNum = item.gameFirstRechargeCount
      //   item.centerChargeNum = item.centerRechargeCount
      //   item.gameRechargeNum = item.gameRechargeCount
      //   item.withdrawMoney = item.gameWithdrawCoin
      //   item.centerStayUserCoin = ( item.stayUserCoin / 1 ) / 2
      //   item.gameStayUserCoin = ( item.stayUserCoin / 1 ) / 2
      //   return item
      // } )
      resolve( res )
    } )
  } )
  // return
}
// 子代理业绩
export function apiGetAgentDayListSub( data ) {
  return http.request( {
    method : 'get',
    url : '/agent/day/page/sub',
    data
  } )
}

export function apiTestAgent( data ) {
  return http.request( {
    method : 'get',
    url : 'https://ip.yama13.com/node-api/total',
    data
    // url : 'https://ip.yama13.com/node-api/total'
  } )
}
