import {
  createRouter,
  // createWebHistory,
  createWebHashHistory
} from 'vue-router'

import Layout from '/@/layout/index.vue'
// import nested from './modules/nested'
import customComponents from './modules/customComponents'

// 配置路由信息
export const constantRoutes = [
  {
    path : '/redirect',
    name : 'Redirect',
    component : Layout,
    meta : {
      title : 'Redirect',
      hidden : true
    },
    children : [
      {
        path : '/redirect/:path(.*)',
        name : 'Redirect',
        component : () => import( '/@/views/redirect/index.vue' ),
        meta : {
          title : 'Redirect',
          hidden : true
        }
      }
    ]
  },
  {
    path : '/login',
    name : 'Login',
    component : () => import( '/@/views/login/index.vue' ),
    meta : {
      hidden : true,
      title : '登录'
    }
  },
  {
    path : '/register',
    name : 'Register',
    component : () => import( '/@/views/register/index.vue' ),
    meta : {
      hidden : true,
      title : '注册'
    }
  },
  {
    path : '/404',
    name : 'Error404',
    component : () => import( '/@/views/error/404.vue' ),
    meta : {
      hidden : true,
      title : '404'
    }
  },
  {
    path : '/401',
    name : 'Error401',
    component : () => import( '/@/views/error/401.vue' ),
    meta : {
      hidden : true,
      title : '401'
    }
  },
  {
    path : '/500',
    name : 'Error500',
    component : () => import( '/@/views/error/500.vue' ),
    meta : {
      hidden : true,
      title : '500'
    }
  }
]

export const asyncRoutes = [
  // {
  //   path : '/',
  //   name : 'Dashboard',
  //   component : Layout,
  //   redirect : '/dashboard',
  //   meta : {
  //     title : '主页'
  //   },
  //   children : [
  //     {
  //       path : 'dashboard',
  //       name : 'Dashboard',
  //       component : () => import( '/@/views/dashboard/index.vue' ),
  //       meta : {
  //         title : '主页',
  //         icon : 'dashboard',
  //         noCache : true,
  //         affix : true
  //       }
  //     }
  //   ]
  // },

  ...customComponents,

  // nested,

  // {
  //   path : '/table',
  //   name : 'Table',
  //   component : Layout,
  //   redirect : '/table/complex',
  //   meta : { title : '表格', icon : 'table', noCache : true },
  //   children : [
  //     {
  //       path : 'complex',
  //       component : () => import( '/@/views/table/complexTable.vue' ),
  //       name : 'ComplexTable',
  //       meta : { title : '综合表格', noCache : true }
  //     }
  //   ]
  // },

  {
    path : '/:pathMatch(.*)',
    redirect : '/404',
    name : 'Redirect404',
    meta : {
      title : '404',
      hidden : true
    }
  }
]

const router = createRouter( {
  history : createWebHashHistory( './' ),
  routes : constantRoutes.concat( asyncRoutes ),
  scrollBehavior : () => ( { left : 0, top : 0 } )
} )

export function resetRouter() {
  const WHITE_NAME_LIST = ['Login']
  router.getRoutes().forEach( route => {
    const { name } = route
    if ( name && !WHITE_NAME_LIST.includes( name ) ) {
      router.hasRoute( name ) && router.removeRoute( name )
    }
  } )
}

export default router
