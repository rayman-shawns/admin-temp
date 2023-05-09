import { defineStore } from 'pinia'
import cookies from '/@/utils/cookies'
import { TOKEN, AVATAR } from '/@/config/constant'
// import { logout, getInfo } from '/@/api/user'
import { resetRouter } from '/@/router'
import useTagsViewStore from './tagsView'
import { localStorageHandle } from '/@/utils/storage'

// const imgContainer = import.meta.env.VITE_IMG_CONTAINER
// const coverDomain = import.meta.env.VITE_COVER_DOMAIN
// console.log( imgContainer, coverDomain )

const useUserStore = defineStore( {
  id : 'users',
  state : () => {
    return {
      token : cookies.get( TOKEN ),
      uid : '9528',
      avatar : AVATAR,
      name : '',
      phone : '',
      email : '',
      identity : '',
      roles : [],
      userInfo : {
        avatar : '',
        uid : '',
        token : '',
        userName : ''
      },
      imgContainer : import.meta.env.VITE_IMG_CONTAINER,
      coverDomain : import.meta.env.VITE_COVER_DOMAIN
    }
  },
  getters : {
    userInfoGetter() {
      if ( this.userInfo.uid ) {
        return this.userInfo
      } else {
        return localStorageHandle.getItem( 'userInfo' )
      }
    }
  },
  actions : {
    userStroeKeyValue( payload ) {
      this[payload.key] = payload.value
      if ( payload.key === 'userInfo' ) {
        localStorageHandle.setItem( 'userInfo', payload.value )
      }
    },
    SET_TOKEN( token = '' ) {
      token ? cookies.set( TOKEN, token ) : cookies.remove( TOKEN )
      this.token = token
    },
    async GET_USER_INFO() {
      try {
        const getInfo = {
          code : 200,
          message : 'success',
          data : {
            id : 9527,
            avatar : 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
            name : '',
            phone : '',
            email : '',
            identity : '',
            roles : ['admin']
          }
        }
        const { code, data } = getInfo
        // const { code, data } = await getInfo()
        if ( code == 200 ) {
          const { id, name, avatar, roles, phone, email, identity } = data
          this.uid = id || '9528'
          this.name = name || ''
          this.phone = phone || ''
          this.email = email || ''
          this.identity = identity || ''
          this.avatar = avatar || AVATAR
          this.roles = roles || ['editor']
          return {
            ...data,
            uid : this.uid,
            roles : this.roles
          }
        }
      } catch ( error ) {
        return error
      }
    },
    async LOGIN_OUT() {
      try {
        const code = 200
        // const { code } = await logout( this.token )
        if ( code == 200 ) {
          this.token = ''
          this.name = ''
          this.avatar = ''
          this.phone = ''
          this.email = ''
          this.identity = ''
          this.roles = []

          this.userInfo = {
            avatar : '',
            uid : '',
            token : '',
            userName : ''
          }
          localStorageHandle.removeItem( 'userInfo' )
          this.RESET_INFO()
        }
      } catch ( error ) {
        return error
      }
    },
    // 清空所有登录信息
    RESET_INFO() {
      return new Promise( resolve => {
        const tagsViewStore = useTagsViewStore()
        cookies.clearAll()
        resetRouter()
        tagsViewStore.DEL_ALL_VIEWS( null )
        resolve()
      } )
    }
  }
} )
export default useUserStore
