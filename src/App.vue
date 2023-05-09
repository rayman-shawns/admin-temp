<template>
  <!--  <p class="test">{{ $t('header.home') }}</p>-->
  <el-config-provider :locale="locale" :size="size">
    <router-view />
  </el-config-provider>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { ElConfigProvider } from 'element-plus'
import zh from 'element-plus/lib/locale/lang/zh-cn'
import en from 'element-plus/lib/locale/lang/en'
import { useAppStore, useUserStore } from '/@/store'
// import { useI18n } from 'vue-i18n'
import { apiGetAppConfig } from '/@/api/system-manage/index.js'

export default defineComponent( {
  name : 'App',
  components : {
    [ElConfigProvider.name] : ElConfigProvider
  },
  setup() {
    // const { t } = useI18n()
    const appStore = useAppStore()
    const locale = computed( () => ( appStore.lang === 'zh' ? zh : en ) )
    const size = computed( () => appStore.size )

    const userStore = useUserStore()
    const { userStroeKeyValue } = userStore
    return {
      locale,
      size,
      userStroeKeyValue
    }
  },
  mounted() {
    this.getAppConfig()
  },
  methods : {
    async getAppConfig() {
      const params = {
        m : 'domain'
      }
      try {
        const res = await apiGetAppConfig( params )
        const list = res.data.list
        if ( list && list.length > 0 ) {
          list.forEach( item => {
            if ( item.k === 'domain_pic' ) {
              this.userStroeKeyValue( {
                key : 'coverDomain',
                value : item.v
              } )
            }
          } )
        }
      } catch ( error ) {}
    }
  }
} )
</script>
