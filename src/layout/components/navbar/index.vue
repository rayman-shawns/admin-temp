<template>
  <div class="navbar" :class="set.layoutMod + '-nav-section'">
    <!-- <div v-if="set.layoutMod === 'horizontal'" class="horizontal-sidebar-container">
      <Logo :class="set.layoutMod + '-logo'" :collapse="set.isCollapse" />
      <MenuBar />
    </div> -->

    <HamBurger
      id="hamburger-container"
      :is-active="set.sidebar.opened"
      class="hamburger-container"
      @toggle-click="toggleSideBar"
    />
    <TopMenuBar />
    <!-- <BreadCrumb v-if="set.layoutMod === 'vertical'" id="breadcrumb-container" class="breadcrumb-container" /> -->

    <div class="right-menu" :class="{ mobile: set.device === 'mobile' }">
      <!-- <LangSelect class="p8 hover-effect" /> -->

      <el-dropdown class="p8 avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img :src="set.avatar + '?imageView2/1/w/80/h/80'" class="user-avatar" />

          <div class="username">
            {{ set.userName }}
            <el-icon class="arrow">
              <ArrowDown />
            </el-icon>
          </div>
        </div>

        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="handleChangePassword">修改密码</el-dropdown-item>
            <el-dropdown-item divided @click="logout">
              <span style="display: block">退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <!-- <div class="p8 el-icon-setting hover-effect" @click="openSettings">
        <el-icon class="setting">
          <Setting />
        </el-icon>
      </div> -->
    </div>
    <change-password
      v-if="isShowPasswordDialog"
      @close="isShowPasswordDialog = false"
      :dialog-visible="isShowPasswordDialog"
    ></change-password>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useAppStore, useUserStore, useSettingsStore } from '/@/store'
import { useRouter } from 'vue-router'
import HamBurger from './components/HamBurger'
// import BreadCrumb from './components/BreadCrumb'
// import LangSelect from './components/LangSelect'
import ChangePassword from './components/ChangePassword'
// import { emitter } from '/@/utils/mitt'

// import Logo from '/@/layout/components/sidebar/Logo'
// import MenuBar from '../sidebar/Menu'
import TopMenuBar from '../sidebar/TopMenu'

const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()
const settingsStore = useSettingsStore()

const toggleSideBar = () => {
  appStore.TOGGLE_SIDEBAR()
}

const isShowPasswordDialog = ref( false )

const set = reactive( {
  showLogo : computed( () => {
    return settingsStore.sidebarLogo
  } ),
  layoutMod : computed( () => {
    return 'horizontal'
    // return settingsStore.layoutMod
  } ),
  sidebar : computed( () => {
    return appStore.sidebar
  } ),
  avatar : computed( () => {
    return userStore.avatar
  } ),
  userName : computed( () => {
    return userStore.userInfoGetter.userName
  } ),
  device : computed( () => {
    return appStore.device
  } )
} )

// 修改密码
const handleChangePassword = () => {
  isShowPasswordDialog.value = true
}

// 退出登录
const logout = async() => {
  await userStore.LOGIN_OUT()
  router.push( '/login' )
  window.location.reload()
}

// const openSettings = () => {
//   emitter.emit( 'openSettings' )
// }

defineOptions( {
  name : 'NavBar'
} )
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #545c64;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    height: 100%;
    display: flex;
    min-width: 200px;
    align-items: center;
    color: #000000d9;
    justify-content: flex-end;
    padding-right: 10px;

    .icons {
      height: 100%;
      line-height: 50px;
      display: inline-block;
    }

    &:focus {
      outline: none;
    }

    .hover-effect {
      cursor: pointer;
      transition: background 0.3s;

      &:hover {
        background: rgba(0, 0, 0, 0.025);
      }
    }

    .p8 {
      padding: 0 8px;
    }

    .right-menu-item {
      display: inline-block;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;
    }

    .avatar-container {
      margin-right: 20px;

      .avatar-wrapper {
        vertical-align: middle;
        margin-top: 5px;
        position: relative;
        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          vertical-align: middle;
          display: inline-block;
        }

        .username {
          margin-left: 12px;
          vertical-align: middle;
          display: inline-block;
          font-size: 14px;
          position: relative;
        }

        .arrow {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 0;
          font-size: 12px;
        }
      }
    }

    .el-icon-setting {
      font-size: 16px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-around;
      .setting {
        color: #000;
      }
    }
  }

  &.horizontal-nav-section {
    height: 50px;
    display: flex;
    justify-content: space-between;
    width: 100%;
    align-items: center;

    .horizontal-sidebar-container {
      flex: 1 1;
      min-width: 0;
      height: 50px;
      background: rgba(0, 0, 0, 0.2);
      position: relative !important;
      align-items: center;
      .horizontal-logo {
        float: left;
        width: 210px;
      }
      .sidebar-menus {
        float: left;
        width: calc(100% - 250px) !important;
      }
      .scrollbar-wrapper {
      }
      ::v-deep(.el-menu) {
        .el-menu-item,
        .submenu-title-noDropdown,
        .el-sub-menu__title {
          height: 50px;
          line-height: 50px;
        }
      }
    }

    .right-menu {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      /*min-width: 690px;*/
      color: #fff;
      ::v-deep(.header-search) {
        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
      ::v-deep(.svg-icon) {
        color: #fff;
      }
      .icons {
        color: #fff;
      }

      .hover-effect {
        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
      .right-menu-item {
        color: #fff;
      }
      .el-icon-setting {
        .setting {
          color: #fff;
        }
      }
    }
  }
}
</style>
