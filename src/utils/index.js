import { validPhone } from './validate'

import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
dayjs.extend( utc )
dayjs.extend( timezone )
dayjs.tz.setDefault( 'Asia/Shanghai' )

// 单词首字母转大写
export function toUpperCaseWord( val ) {
  if ( !val ) return ''
  return val.toLowerCase().replace( /( |^)[a-z]/g, L => L.toUpperCase() )
}

// 返回北京时区时间戳
export function getBJTimezoneMill( time ) {
  const str = dayjs( time ).format( 'YYYY-MM-DD HH:mm:ss' )
  return new Date( `${str}  GMT+0800` ).getTime()
}

export const dayjs2 = dayjs

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime( time, cFormat ) {
  if ( arguments.length === 0 || !time ) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if ( typeof time === 'object' ) {
    date = time
  } else {
    if ( typeof time === 'string' ) {
      if ( /^[0-9]+$/.test( time ) ) {
        // support "1548221490638"
        time = parseInt( time )
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        // eslint-disable-next-line prefer-regex-literals
        time = time.replace( new RegExp( /-/gm ), '/' )
      }
    }

    if ( typeof time === 'number' && time.toString().length === 10 ) {
      time = time * 1000
    }
    // date = new Date( time )
    date = new Date( new Date( time ).getTime() + ( parseInt( new Date( time ).getTimezoneOffset() / 60 ) + 8 ) * 3600 * 1000 )
  }
  const formatObj = {
    y : date.getFullYear(),
    m : date.getMonth() + 1,
    d : date.getDate(),
    h : date.getHours(),
    i : date.getMinutes(),
    s : date.getSeconds(),
    a : date.getDay()
  }
  const time_str = format.replace( /{([ymdhisa])+}/g, ( result, key ) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if ( key === 'a' ) {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    return value.toString().padStart( 2, '0' )
  } )
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime( time, option ) {
  if ( ( '' + time ).length === 10 ) {
    time = parseInt( time ) * 1000
  } else {
    time = +time
  }
  const d = new Date( time )
  const now = Date.now()

  const diff = ( now - d ) / 1000

  if ( diff < 30 ) {
    return '刚刚'
  } else if ( diff < 3600 ) {
    // less 1 hour
    return Math.ceil( diff / 60 ) + '分钟前'
  } else if ( diff < 3600 * 24 ) {
    return Math.ceil( diff / 3600 ) + '小时前'
  } else if ( diff < 3600 * 24 * 2 ) {
    return '1天前'
  }
  if ( option ) {
    return parseTime( time, option )
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
  }
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function encryptionPhone( val ) {
  const phone = val + ''
  if ( !validPhone( phone ) ) {
    return ''
  }
  const reg = /^(\d{3})\d{4}(\d{4})$/
  return phone.replace( reg, '$1****$2' )
}

/**
 * 格式化秒时间
 * @param {*} time
 * @param {*} option
 */
export function formatSecondTime( result ) {
  let h = Math.floor( result / 3600 )
  h = h < 10 ? `0${h}` : h
  let m = Math.floor( ( result / 60 ) % 60 )
  m = m < 10 ? `0${m}` : m
  let s = Math.floor( result % 60 )
  s = s < 10 ? `0${s}` : s
  return h + ':' + m + ':' + s
}

/**
 * 格式化字节
 * @param {*} size
 * @returns
 */
export function formatByteSize( size ) {
  let size_int = size
  if ( typeof size === 'string' && size.constructor === String ) {
    size_int = parseInt( size )
  }
  let formatSize
  if ( parseInt( size_int / 1024 / 1024 / 1024 ) > 0 ) {
    formatSize = ( size_int / 1024 / 1024 / 1024 ).toFixed( 2 ) + 'G'
  } else if ( parseInt( size_int / 1024 / 1024 ) > 0 ) {
    formatSize = ( size_int / 1024 / 1024 ).toFixed( 2 ) + 'MB'
  } else if ( parseInt( size_int / 1024 ) > 0 ) {
    formatSize = ( size_int / 1024 ).toFixed( 2 ) + 'kB'
  } else {
    formatSize = size_int + 'Byte'
  }
  return formatSize
}

const START_TIME = ' 00:00:00'
const END_TIME = ' 23:59:59'
const MILLSECEND_DAY1 = 1000 * 60 * 60 * 24 // 一天的毫秒数

/**
 * 格式化日期（不含时间）
 * @param {*} date
 */
const formatterDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const monthFormat = month >= 10 ? month : `0${month}`
  const day = date.getDate()
  const dayFormat = day >= 10 ? day : `0${day}`
  return `${year}-${monthFormat}-${dayFormat}`
}
/**
 * 获取今天
 * @param {*} currentDate
 */
export const getToday = function() {
  const date = formatterDate( new Date() )
  return [date + START_TIME, date + END_TIME]
}
/**
 * 获取昨天
 */
export const getLastDay = function() {
  const lastDay = new Date().getTime() - MILLSECEND_DAY1
  const date = formatterDate( new Date( lastDay ) )
  return [date + START_TIME, date + END_TIME]
}

/**
 * 获取近三天时间
 * @param {*} currentDate
 */
export const getLatestDay = ( currentDate = new Date(), day ) => {
  // 起止日期数组
  const startStop = []
  const startDay = new Date( currentDate.getTime() - day * MILLSECEND_DAY1 )
  // 本周起始时间
  startStop.push( formatterDate( startDay ) + START_TIME )
  // 本周终止时间
  startStop.push( formatterDate( new Date() ) + END_TIME )
  // 返回
  return startStop
}

/**
 * 格式化数字，处理数字精度问题
 * @param number 需要处理的数字数据  number | string
 * @param fractionDigits=2 保留小数
 * @param isrounded=true 是否四舍五入
 * @return 已处理的数字数据
 */
export function toFixed( number, fractionDigits = 2, isrounded = true ) {
  let value = +number || 0
  if ( !value ) return 0
  const digits = +fractionDigits || 2
  let numstr = `${number}`
  const index = numstr.indexOf( '.' )
  if ( index === 0 ) numstr = '0' + numstr
  let raw = 0
  if ( index !== -1 ) {
    raw = numstr.length - 1 - index
    value = +numstr.replace( /\./g, '' )
  }
  if ( raw > digits ) {
    value = value / Math.pow( 10, raw - digits )
  } else if ( raw < digits ) {
    value = value * Math.pow( 10, digits - raw )
  }
  const rounded = typeof isrounded === 'boolean' ? isrounded : true
  return ( rounded ? Math.round( value ) : Math.floor( value ) ) / Math.pow( 10, digits )
}

/**
 * 格式化数字，处理数字精度问题
 * @param number 需要处理的数字数据 number | string
 * @param fractionDigits=2 保留小数
 * @param isrounded=true 是否四舍五入
 * @return 已处理的数字数据
 */
export function toFixedStr( number, fractionDigits = 2, isrounded = true ) {
  const value = toFixed( number, fractionDigits, isrounded )
  if ( typeof value === 'number' && !isNaN( value ) ) return value.toFixed( fractionDigits )
  return value
}
