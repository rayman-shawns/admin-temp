<template>
  <div class="topic-edit">
    <el-form v-loading="loading" ref="form" :model="form" :rules="rules" label-position="left" label-width="140px">
      <el-form-item label="名称" prop="title">
        <el-input type="text" placeholder="请输入" clearable v-model="form.title" />
      </el-form-item>
      <el-form-item label="code">
        <el-input type="text" placeholder="请输入" clearable v-model="form.code" />
      </el-form-item>
      <el-form-item label="md5密钥">
        <el-input type="text" placeholder="请输入" clearable v-model="form.md5_key" />
      </el-form-item>
      <el-form-item label="加密密钥">
        <el-input type="text" placeholder="请输入" clearable v-model="form.secret_key" />
      </el-form-item>
      <el-form-item label="api_url">
        <el-input type="text" placeholder="请输入" clearable v-model="form.api_url" />
      </el-form-item>
      <el-form-item label="agent_account">
        <el-input type="text" placeholder="请输入" clearable v-model="form.agent_account" />
      </el-form-item>
      <el-form-item label="agent_id">
        <el-input type="text" placeholder="请输入" clearable v-model="form.agent_id" />
      </el-form-item>
      <el-form-item label="注册Url">
        <el-input type="text" placeholder="请输入" clearable v-model="form.reg_url" />
      </el-form-item>
      <el-form-item label="登录地址">
        <el-input type="text" placeholder="请输入" clearable v-model="form.login_url" />
      </el-form-item>
      <el-form-item label="转账地址">
        <el-input type="text" placeholder="请输入" clearable v-model="form.trans_url" />
      </el-form-item>
      <el-form-item label="获取投注记录地址">
        <el-input type="text" placeholder="请输入" clearable v-model="form.bet_url" />
      </el-form-item>
      <el-form-item label="其他参数">
        <el-input type="text" placeholder="请输入" clearable v-model="form.others" />
      </el-form-item>
      <el-form-item label="公钥">
        <el-input type="text" placeholder="请输入" clearable v-model="form.public_key" />
      </el-form-item>
      <el-form-item label="私钥">
        <el-input type="text" placeholder="请输入" clearable v-model="form.private_key" />
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { apiAddGamePlat, apiEditGamePlat } from '/@/api/game-manage/settings.js'

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
        title : '',
        code : '',
        md5_key : '',
        secret_key : '',
        api_url : '',
        agent_account : '',
        agent_id : '',
        reg_url : '',
        login_url : '',
        trans_url : '',
        bet_url : '',
        others : '',
        public_key : '',
        private_key : ''
      },
      rules : {
        title : [{ required : true, message : '请输入名称', trigger : 'blur' }]
      }
    }
  },
  created() {
    if ( this.mode === 'edit' ) {
      for ( const key in this.form ) {
        if ( Object.hasOwnProperty.call( this.form, key ) ) {
          this.form[`${key}`] = this.currentRowData[`${key}`]
            ? this.currentRowData[`${key}`]
            : this.currentRowData[key] === 0
              ? 0
              : null
        }
      }
      this.form.id = this.currentRowData.id
    }
  },
  methods : {
    submitForm() {
      // 给父组件返回promise对象用于回调
      return new Promise( resolve => {
        this.$refs.form.validate( async valid => {
          if ( !valid ) return resolve( false )
          try {
            if ( this.mode === 'add' ) {
              await apiAddGamePlat( this.form )
            } else {
              await apiEditGamePlat( this.form )
            }
            resolve( true )
          } catch ( error ) {
            resolve( false )
          }
        } )
      } )
    }
  }
}
</script>
<style lang="scss" scoped>
.topic-edit {
  .el-input {
    width: 50%;
  }
  .el-select {
    width: 50%;
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
.interval {
  .el-input {
    width: 200px;
  }
  .des {
    margin-left: 10px;
  }
}
</style>
