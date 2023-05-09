<template>
  <el-menu
    :active-text-color="variables.menuActiveText"
    :background-color="variables.menuBg"
    :text-color="variables.menuText"
    :default-active="set.activeMenu"
    :unique-opened="true"
    :collapse-transition="false"
    :mode="set.layoutMod"
    class="topbar-menu"
  >
    <template v-if="set.routerLists && set.routerLists.length > 0">
      <TopbarItem v-for="item in set.routerLists" :key="item.path" :item="item" :base-path="item.path" />
    </template>
  </el-menu>
</template>

<script setup>
import { computed, reactive, onMounted } from 'vue'
import variables from '/@/styles/variables.module.scss'
import TopbarItem from './TopbarItem'

import { useRoute } from 'vue-router'
import { useAppStore, usePermissionStore } from '/@/store'
import { localStorageHandle } from '/@/utils/storage'

const route = useRoute()
const appStore = useAppStore()
// const settingsStore = useSettingsStore()
const permissionStore = usePermissionStore()

const set = reactive( {
  layoutMod : computed( () => {
    // return settingsStore.layoutMod
    return 'horizontal'
  } ),
  isCollapse : computed( () => {
    return !appStore.sidebar.opened
  } ),
  activeMenu : computed( () => {
    const { meta, path } = route
    if ( meta.activeMenu ) {
      return meta.activeMenu
    }
    return path
  } ),
  routerLists : computed( () => {
    return permissionStore.routes
  } )
} )

onMounted( () => {
  initCurrentRoutes()
} )

function initCurrentRoutes() {
  const route = useRoute()
  const currentRoutes = localStorageHandle.getItem( 'currentRoutes' )
  if ( currentRoutes && currentRoutes.length > 0 ) {
    try {
      const { path } = route
      const findroute = currentRoutes && currentRoutes.find( item => item.path === path )
      if ( !findroute ) {
        return
        // route = this.routes.find(item => item.path === '/')
      }
      permissionStore.SET_CURRENT_RUTE( currentRoutes )
    } catch ( error ) {
      console.log( error )
    }
  }
}
</script>

<style scoped lang="scss">
.horizontal-logo {
  width: 210px;
  display: flex;
}

.scrollbar-wrapper {
  /*width: calc(  );*/
}

.topbar-menus {
  width: calc(100% - 250px);
}
</style>
