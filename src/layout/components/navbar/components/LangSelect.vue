<template>
  <el-dropdown trigger="click" class="international" @command="handleSetLanguage">
    <div>
      <svg-icon class-name="international-icon" icon-class="language" />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item :disabled="language === 'zh'" command="zh"> 中文 </el-dropdown-item>
        <el-dropdown-item :disabled="language === 'en'" command="en"> English </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from '/@/store'
import { useI18n } from 'vue-i18n'

const appStore = useAppStore()
const { locale } = useI18n()

const language = computed( () => {
  return appStore.lang
} )

locale.value = language.value

const handleSetLanguage = val => {
  appStore.SET_LANG( val )
  locale.value = val
}

defineOptions( {
  name : 'LangSelect'
} )
</script>

<style lang="scss" scoped></style>
