<template>
  <div v-if="!props.item.meta?.hidden">
    <AppLink @click="setCurrentRute" :to="resolvePath(props.item.path)">
      <el-menu-item :index="resolvePath(props.item.path)" :class="{ 'submenu-title-noDropdown': !props.isNest }">
        <svg-icon
          class-name="menu-icons"
          v-if="props.item.meta.icon || (props.item.meta && props.item.meta.icon)"
          :icon-class="props.item.meta.icon || (props.item.meta && props.item.meta.icon)"
        />
        <template #title>
          <span> {{ props.item.meta.title }} </span>
        </template>
      </el-menu-item>
    </AppLink>

    <!-- <el-sub-menu v-else ref="subMenu"  :index="resolvePath(props.item.path)">
        <template #title>
          <svg-icon
            class-name="menu-icons"
            v-if="props.item.meta && props.item.meta.icon"
            :icon-class="props.item.meta && props.item.meta.icon"
          />
          <span> {{ props.item.meta.title }} </span>
        </template>
        <TopbarItem
          v-for="child in props.item.children"
          :key="child.path"
          :is-nest="true"
          :item="child"
          :base-path="resolvePath(child.path)"
          class="nest-menu"
        />
      </el-sub-menu> -->
  </div>
</template>

<script setup>
// import { ref } from 'vue'
import path from 'path-browserify'
import { isExternal } from '/@/utils/validate'
import AppLink from './TopLink.vue'
import { usePermissionStore } from '/@/store'

// eslint-disable-next-line no-undef
const props = defineProps( {
  item : {
    type : Object,
    required : true
  },
  isNest : {
    type : Boolean,
    default : false
  },
  basePath : {
    type : String,
    default : ''
  }
} )

const permissionStore = usePermissionStore()

function setCurrentRute() {
  // console.log( 'setCurrentRute----', props )
  // const routes = props.item.children.map( ( item ) => {
  //   item.path = props.item.path === '/' ? `${props.item.path}${item.path}` : `${props.item.path}/${item.path}`
  //   return item
  // } )
  try {
    const routes = props.item.children
    permissionStore.SET_CURRENT_RUTE( routes )
  } catch ( error ) {
    console.log( 'setCurrentRute', error )
  }
}
// const onlyOneChild = ref( null )
// const subMenu = ref( null )

// function hasOneShowingChild( children = [], parent ) {
//   const showingChildren = children.filter( item => {
//     if ( item.meta?.hidden ) {
//       return false
//     } else {
//       onlyOneChild.value = item
//       return true
//     }
//   } )
//   if ( showingChildren.length === 1 ) {
//     return true
//   }
//   if ( showingChildren.length === 0 ) {
//     onlyOneChild.value = { ...parent, path : '', noShowingChildren : true }
//     return true
//   }
//   return false
// }

const resolvePath = routePath => {
  try {
    if ( isExternal( routePath ) ) {
      return routePath
    }
    if ( isExternal( props.basePath ) ) {
      return props.basePath
    }
    return path.resolve( props.basePath, routePath )
  } catch ( error ) {
    console.log( error )
    return ''
  }
}

defineOptions( {
  name : 'TopbarItem'
} )
</script>
