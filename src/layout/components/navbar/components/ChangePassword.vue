<template>
  <el-dialog
    width="30%"
    ref="dialog"
    append-to-body
    :close-on-click-modal="false"
    model-value="dialogVisible"
    title="修改密码"
    @close="close"
  >
    <el-form v-loading="loading" ref="form" :model="formAdjust" label-position="left" label-width="90px">
      <el-form-item label="旧密码">
        <el-input type="text" placeholder="请输入" v-model="formAdjust.no" />
      </el-form-item>
      <el-form-item label="新密码">
        <el-input type="text" placeholder="请输入" v-model="formAdjust.no" />
      </el-form-item>
      <el-form-item label="确认密码">
        <el-input type="text" placeholder="请输入" v-model="formAdjust.no" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button v-loading="dialogLoading" size="large" type="primary" @click="close">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script>
export default {
  emits : ['close'],
  props : {
    dialogVisible : {
      type : Boolean,
      default : false
    }
  },
  data() {
    return {
      loading : false,
      //   dialogVisible : false,
      formAdjust : {
        no : '',
        delivery : 1
      }
    }
  },
  methods : {
    close() {
      this.$emit( 'close' )
    }
  }
}
</script>
<style lang="scss" scoped>
.subtitle {
  color: #000;
  font-size: 16px;
  font-weight: 600;
}
.el-input {
  width: 100%;
}
.des {
  margin-left: 20px;
}
</style>
