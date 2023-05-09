<template>
  <div class="topic-edit">
    <el-form v-loading="loading" ref="form" :rules="rules" :model="form" label-position="left" label-width="80px">
      <el-form-item label="银行名称" prop="title">
        <el-input type="text" placeholder="请输入" clearable v-model.trim="form.title" />
      </el-form-item>
      <el-form-item class="upload-block" label="银行LOGO">
        <upload-img
          :default-img="coverDomain + form.icon"
          @onSuccess="getUploadRes($event, 'icon')"
          @beforeUpload="beforeUpload"
          @uploadDone="uploadDone"
        >
        </upload-img>
      </el-form-item>
      <el-form-item class="upload-block" label="背景图">
        <upload-img
          :default-img="coverDomain + form.img"
          @onSuccess="getUploadRes($event, 'img')"
          @beforeUpload="beforeUpload"
          @uploadDone="uploadDone"
        >
        </upload-img>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import UploadImg from '/@/components/UploadImg'
// import { useUserStore } from '/@/store'
import { addBank, editBank } from '/@/api/finance-manage/bankList.js'
import { imgContainer, coverDomain } from '/@/config/constant.js'

export default {
  components : { UploadImg },
  setup() {
    // const userStore = useUserStore()
    // const { imgContainer, coverDomain } = userStore
    return {
      imgContainer,
      coverDomain
    }
  },
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
        img : '',
        icon : '',
        sort : 0,
        state : 1
      },
      rules : {
        title : [{ required : true, message : '请输入银行名称', trigger : 'blur' }]
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
    // 获取上传文件成功返回的数据
    getUploadRes( file, key ) {
      console.log( 'getUploadRes', file, file.name, key )
      this.form[key] = this.imgContainer ? `/${this.imgContainer}/${file.name}` : `/${file.name}`
      this.$emit( 'uploadDone' )
    },
    beforeUpload() {
      this.$emit( 'beforeUpload' )
    },
    uploadDone() {
      this.$emit( 'uploadDone' )
    },
    submitForm() {
      // 给父组件返回promise对象用于回调
      return new Promise( resolve => {
        this.$refs.form.validate( async valid => {
          if ( !valid ) return resolve( false )
          try {
            if ( this.mode === 'add' ) {
              await addBank( this.form )
            } else {
              await editBank( this.form )
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
</style>
