<template>
  <div>
    <el-form v-loading="loading" ref="form" :model="formAdjust" label-position="left" label-width="80px">
      <el-form-item label="所属角色">
        <el-input type="text" placeholder="请输入" v-model="formAdjust.no" />
      </el-form-item>
      <el-form-item label="管理账号">
        <el-input type="text" placeholder="请输入" v-model="formAdjust.no" />
      </el-form-item>
      <el-form-item label="登录密码">
        <el-input type="text" placeholder="请输入" v-model="formAdjust.no" />
      </el-form-item>
      <el-form-item label="联系手机">
        <el-input type="text" placeholder="请输入" v-model="formAdjust.no" />
      </el-form-item>
      <el-form-item label="备注信息">
        <el-input type="textarea" :row="4" placeholder="请输入" v-model="formAdjust.no" />
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
      formAdjust : {
        no : '',
        delivery : 1
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
