<template>
  <div class="section-container login-container un-select">
    <div class="body fix-width">
      <div class="top">
        <div class="top-title">用户注册</div>
      </div>
      <div class="main">
        <el-form ref="ruleForm" :model="formState" :rules="rules" label-width="0" status-icon class="login-ruleForm">
          <el-form-item prop="userName">
            <el-input
              ref="account"
              v-model="formState.userName"
              class="h40"
              name="account"
              placeholder="请输入账号"
              :clearable="true"
              tabindex="1"
              type="text"
              maxlength="100"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item prop="passwd">
            <el-input
              ref="password"
              v-model="formState.passwd"
              class="h40"
              show-password
              name="password"
              placeholder="请输入密码"
              :clearable="true"
              tabindex="2"
              maxlength="16"
              type="password"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              class="h40"
              :loading="loading"
              :disabled="disabledLogin"
              type="primary"
              style="width: 100%"
              @click.prevent="registerHandle"
            >
              注册
            </el-button>
          </el-form-item>
        </el-form>
        <div class="foot-link clearFix" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, reactive, computed, ref } from 'vue'
import { debounce } from 'lodash-unified'
import { useRouter } from 'vue-router'
import { apiRegister } from '/@/api/login/index.js'
import { useUserStore } from '/@/store'

const router = useRouter()
const userStore = useUserStore()
const resizeCb = debounce( () => {}, 50 )

const formState = reactive( {
  userName : '',
  passwd : '',
  avatar : ''
} )

const ruleForm = ref()
const loading = ref( false )
const trigger = ['blur', 'change']

const rules = {
  userName : [{ required : true, message : '请输入账号', trigger }],
  passwd : [{ required : true, message : '请输入密码', trigger }]
}

const disabledLogin = computed( () => {
  const { userName, passwd } = formState
  return !userName || !passwd
} )

onMounted( () => {
  window.addEventListener( 'resize', resizeCb )
} )

onUnmounted( () => {
  window.removeEventListener( 'resize', resizeCb )
} )

function registerHandle() {
  loading.value = true
  ruleForm.value.validate( async valid => {
    if ( valid ) {
      apiRegister( formState )
        .then( res => {
          loading.value = false
          if ( res ) {
            userStore.userStroeKeyValue( {
              key : 'userInfo',
              value : res.data
            } )
            router.push( '/login' )
          }
        } )
        .catch( err => {
          console.error( err )
          loading.value = false
        } )
    } else {
      loading.value = false
    }
  } )
}

defineOptions( {
  name : 'Login'
} )
</script>

<style lang="scss" scoped>
.login-container {
  width: 100%;
  min-height: 100vh;
  padding: 15vh 0 100px;
  position: relative;
  background: #fff;
}
.body {
  padding: 30px 40px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  border: 1px solid #e6ebf5;
  background-color: #fff;
  vertical-align: middle;
  min-width: 260px;
  width: 380px;
  margin: 0 auto;
}

.logos {
  margin: 0 auto 20px;
}
.top-title {
  color: rgba(16, 16, 16, 1);
  font-size: 20px;
  height: 29px;
  line-height: 29px;
  text-align: center;
}
.main {
  margin-top: 20px;
  .foot-link {
    text-align: center;
    margin-top: 1px;
    .link-item {
      margin: 0;
      font-size: 12px;
      line-height: 18px;
      color: #1890ff;
    }
  }
}

.foot-link {
  .el-button {
    font-size: 12px;
  }
}

// 适配移动端
@media screen and (max-width: 768px) {
  .body {
    padding: 0 30px;
    box-shadow: none;
    border: 0;
    background: transparent;
    border-radius: 0;
  }
  .w380 {
    margin: 0 auto;
    width: 100vw;
    min-width: 100vw;
  }
}
</style>
