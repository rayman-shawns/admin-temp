<template>
  <div v-if="props.item.meta && !props.item.meta.hidden">
    <template
      v-if="
        hasOneShowingChild(props.item.children, props.item) &&
        (!onlyOneChild.children || onlyOneChild.noShowingChildren) &&
        props.item.meta &&
        !props.item.meta.alwaysShow
      "
    >
      <AppLink v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{ 'submenu-title-noDropdown': !props.isNest }">
          <svg-icon
            class-name="menu-icons"
            v-if="onlyOneChild.meta.icon || (props.item.meta && props.item.meta.icon)"
            :icon-class="onlyOneChild.meta.icon || (props.item.meta && props.item.meta.icon)"
          />
          <template #title>
            <span> {{ onlyOneChild.meta.title }} </span>
          </template>
        </el-menu-item>
      </AppLink>
    </template>

    <el-sub-menu v-else ref="subMenu" popper-class="sub-menu-test" :index="resolvePath(props.item.path)">
      <template #title>
        <svg-icon
          class-name="menu-icons"
          v-if="props.item.meta && props.item.meta.icon"
          :icon-class="props.item.meta && props.item.meta.icon"
        />
        <span> {{ props.item.meta.title }} </span>
      </template>
      <template v-if="props.item.children.length > 0">
        <SidebarItem
          v-for="child in props.item.children"
          :key="child.path"
          :is-nest="true"
          :item="child"
          :base-path="resolvePath(child.path)"
          class="nest-menu"
        />
      </template>
    </el-sub-menu>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import path from 'path-browserify'
import { isExternal } from '/@/utils/validate'
import AppLink from './Link.vue'

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
// To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
let onlyOneChild = null
const subMenu = ref( null )

function hasOneShowingChild( children = [], parent ) {
  const showingChildren = children.filter( item => {
    if ( item.meta?.hidden ) {
      return false
    } else {
      onlyOneChild = item
      return true
    }
  } )
  if ( showingChildren.length === 1 ) {
    return true
  }
  if ( showingChildren.length === 0 ) {
    onlyOneChild = { ...parent, path : '', noShowingChildren : true }
    return true
  }
  return false
}

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
  name : 'SidebarItem'
} )
</script>
