<template>
  <el-form ref="ruleForm" :model="formState" :rules="rules" label-width="0" status-icon class="login-ruleForm">
    <el-form-item prop="account">
      <el-input
        ref="account"
        v-model="formState.account"
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

    <el-form-item prop="password">
      <el-input
        ref="password"
        v-model="formState.password"
        class="h40"
        show-password
        name="password"
        placeholder="请输入密码"
        :clearable="true"
        tabindex="2"
        maxlength="16"
        type="password"
        autocomplete="off"
        @keyup.enter="loginHandle"
      />
    </el-form-item>

    <el-form-item prop="captcha">
      <el-input
        ref="password"
        v-model="formState.captcha"
        class="h40"
        show-password
        name="password"
        placeholder="请输入谷歌验证码"
        :clearable="true"
        tabindex="2"
        maxlength="16"
        type="password"
        autocomplete="off"
        @keyup.enter="loginHandle"
      />
    </el-form-item>

    <el-form-item style="margin-bottom: 14px">
      <el-button
        class="h40"
        :loading="loading"
        :disabled="disabledLogin"
        type="primary"
        style="width: 100%"
        @click.prevent="loginHandle"
      >
        快速登录
      </el-button>
    </el-form-item>
    <!-- <el-form-item>
      <el-button
        class="h40"
        :loading="loading"
        type="primary"
        style="width: 100%"
        @click.prevent="registerHandle"
      >
        用户注册
      </el-button>

    </el-form-item> -->
  </el-form>
</template>

<script setup>
import { ref, onBeforeMount, reactive, computed } from 'vue'
import { useUserStore } from '/@/store'
import { useRouter, useRoute } from 'vue-router'
import { apiLogin } from '/@/api/login/index.js'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const ruleForm = ref()
const trigger = ['blur', 'change']
const formState = reactive( {
  country : '86',
  captcha : '',
  account : '',
  password : ''
} )
const rules = {
  account : [{ required : true, message : '请输入账号', trigger }],
  password : [{ required : true, message : '请输入密码', trigger }],
  captcha : [{ required : true, message : '请输入校验码', trigger }]
}
const bindToken = ref( '' )
const loading = ref( false )

const disabledLogin = computed( () => {
  const { account, password } = formState
  return !account || !password
} )

onBeforeMount( () => {
  const { userInfo } = userStore
  if ( userInfo?.userName ) {
    formState.account = userInfo.userName
  }
  getQueryParams()
} )

function getQueryParams() {
  const query = route.query
  // 微信 登录
  bindToken.value = query.bindToken || ''
}

function loginHandle() {
  loading.value = true
  ruleForm.value.validate( async valid => {
    if ( valid ) {
      try {
        const params = {
          userName : formState.account,
          passwd : formState.password,
          authCode : formState.captcha
        }
        const { data } = await apiLogin( params )
        if ( data ) {
          userStore.userStroeKeyValue( {
            key : 'userInfo',
            value : data
          } )
          const token = data.token
          userStore.SET_TOKEN( token )
          router.push( '/' )
        }
      } catch ( e ) {
      } finally {
        loading.value = false
      }
    } else {
      loading.value = false
    }
  } )
}

// function registerHandle() {
//   router.push( '/register' )
// }

defineOptions( {
  name : 'LoginPwd'
} )
</script>

<style lang="scss" scoped>
.code-inp {
  width: calc(100% - 125px);
  display: inline-block;
  vertical-align: middle;
  margin-right: 15px;
}
.code {
  display: inline-block;
  height: 40px;
  width: 110px;
  cursor: pointer;
  vertical-align: middle;
  img {
    display: inline-block;
    width: 100%;
    height: 100%;
    border-radius: 4px;
  }
  &:hover {
    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
  }
}
</style>
