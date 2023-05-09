<template>
  <div>
    <el-form v-loading="loading" ref="form" :model="form" label-position="left" label-width="100px">
      <el-form-item label="位置标题">
        <el-input type="text" placeholder="请输入" v-model="form.no" />
      </el-form-item>
      <el-form-item label="是否支持GIF">
        <el-radio-group v-model="form.vip">
          <el-radio label="支持" />
          <el-radio label="不支持" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="广告宽度">
        <el-input type="text" placeholder="请输入" v-model="form.no" />
      </el-form-item>
      <el-form-item label="广告高度">
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
        vip : 'vip'
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
