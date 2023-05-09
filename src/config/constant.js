export const COOKIE_PREFIX = 'vite_'
export const TOKEN = `${COOKIE_PREFIX}_token`
export const AVATAR = 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'

export const GLOBAL_DATA = {
  env : 'fat',
  // dev : {
  //   baseUrl : '/api'
  // },
  fat : {
    baseUrl : '/api'
  },
  uat : {
    baseUrl : '/api'
  },
  pro : {
    baseUrl : '/api'
  }
}

export const WHITE_CODE_LIST = [
  {
    code : 200,
    msg : ''
  },
  {
    code : 0,
    msg : ''
  },
  {
    code : 5006,
    msg : '验证码错误或已过期'
  }
]

export const LOGIN_ERROR_CODE = [
  {
    code : 5004,
    msg : '无效token'
  },
  {
    code : 401,
    msg : '无效token，请重新登陆'
  }
]

export const coverDomain = import.meta.env.VITE_COVER_DOMAIN // cover domain
export const imgContainer = import.meta.env.VITE_IMG_CONTAINER // img container
