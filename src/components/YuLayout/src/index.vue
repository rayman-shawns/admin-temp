<template>
  <div ref="wrapperRef" class="yu-layout">
    <div class="header">
      <!-- <div class="header-tt ellipsis" v-if="title">{{ title }}</div> -->
      <!-- <div v-if="subtitle" class="header-desc ellipsis-col ellipsis-col2" v-html="subtitle"></div> -->
      <slot name="head" />
    </div>
    <div class="body">
      <slot name="body" />
    </div>
    <div class="footer">
      <slot name="foot" />
    </div>
    <slot />
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent( {
  name : 'YuLayout',
  props : {
    title : {
      type : String,
      default : ''
    },
    subtitle : {
      type : String,
      default : ''
    }
  },
  setup() {
    const wrapperRef = ref()
    return {
      wrapperRef
    }
  }
} )
</script>

<style lang="scss" scoped>
.yu-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #fff;
  .header {
    box-sizing: border-box;
    margin: 0;
    font-size: 14px;
    position: relative;
    padding: 0 20px;
    background: #fff;
    .header-tt {
      margin-right: 12px;
      margin-bottom: 0;
      color: #181818;
      font-weight: 600;
      font-size: 20px;
      line-height: 32px;
    }
    .header-desc {
      color: #29282b;
      padding-top: 12px;
      line-height: 20px;
    }
  }
  .body {
    flex: 1;
    padding: 16px;
    overflow: hidden;
    box-sizing: border-box;
    .section-container {
    }
  }
  .footer {
    background: #fff;
    padding-left: 16px;
    line-height: 1.6;
    color: #29282b;
    font-size: 14px;
  }
}
</style>
