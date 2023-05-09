<template>
  <div>
    <el-form v-loading="loading" ref="form" :model="form" label-position="left" label-width="100px">
      <el-form-item label="原来上级">
        <el-input type="text" placeholder="请输入" v-model="form.no" />
      </el-form-item>
      <el-form-item label="修改后的上级">
        <el-input type="text" placeholder="请输入" v-model="form.no" />
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  props : {
    mode : {
      type : String,
      default : 'add'
    },
    currentRowData : {
      type : Object,
      default : () => ( {} )
    }
  },
  data() {
    return {
      loading : false,
      form : {
        no : '',
        img : ''
      }
    }
  },
  created() {},
  methods : {
    submitForm() {
      // 给父组件返回promise对象用于回调
      return new Promise( resolve => {
        this.$refs.form.validate( async valid => {
          if ( !valid ) return false
          resolve( true )
        } )
      } )
    }
  }
}
</script>
<style lang="scss" scoped></style>
