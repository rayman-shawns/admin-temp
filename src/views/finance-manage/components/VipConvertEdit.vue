<template>
  <div class="vip-edit">
    <el-form v-loading="loading" ref="form" :model="form" label-position="left" label-width="80px">
      <el-form-item label="生成数量">
        <el-input type="text" placeholder="请输入" v-model="form.no" />
      </el-form-item>
      <el-form-item class="upload-block" label="会员套餐">
        <el-radio-group v-model="form.vip">
          <el-radio label="黄金月卡" />
          <el-radio label="白金季度卡" />
          <el-radio label="钻石永久卡" />
          <el-radio label="至尊永久卡" />
        </el-radio-group>
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
        img : '',
        vip : []
      },
      formatOptions : [
        { key : '10', display_name : '横版' },
        { key : '20', display_name : '竖版' }
      ]
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
.vip-edit {
  .el-input {
    width: 50%;
  }
  .el-select {
    width: 50%;
  }
  .des {
    margin-left: 10px;
  }
}

:deep(.upload-block) {
  .el-form-item__content {
    display: flex;
    flex-wrap: wrap;
  }
  .upload {
    display: flex;
    justify-content: space-between;
    width: 47%;
    span {
      width: 100px;
    }
  }
}
</style>
