<template>
  <div class="topic-edit">
    <el-form v-loading="loading" ref="form" :model="form" :rules="rules" label-position="left" label-width="100px">
      <el-form-item label="标签名称" prop="name">
        <el-input type="text" placeholder="请输入" clearable v-model="form.name" />
      </el-form-item>
      <!-- <el-form-item label="排序（倒序）">
        <el-input type="text" placeholder="请输入" clearable v-model.number="form.priority" />
      </el-form-item> -->
    </el-form>
  </div>
</template>
<script>
import { addVideoTag, editVideoTag } from '/@/api/video-manage/tag.js'

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
        name : '',
        reqType : 0,
        priority : 0
      },
      rules : {
        name : [{ required : true, message : '请输入标签名称', trigger : 'blur' }]
      }
    }
  },
  created() {
    if ( this.mode === 'edit' ) {
      for ( const key in this.form ) {
        if ( Object.hasOwnProperty.call( this.form, key ) ) {
          this.form[key] = this.currentRowData[key]
            ? this.currentRowData[key]
            : this.currentRowData[key] === 0
              ? 0
              : null
        }
      }
      this.form.reqType = 0
    }
  },
  methods : {
    // 获取上传文件成功返回的数据
    getUploadRes( res, key ) {
      console.log( 'getUploadRes', res, key )
    },
    handleFilter() {},
    submitForm() {
      // 给父组件返回promise对象用于回调
      return new Promise( resolve => {
        this.$refs.form.validate( async valid => {
          if ( !valid ) return resolve( false )
          try {
            if ( this.form.priority === '' ) {
              this.form.priority = 0
            }

            if ( this.mode === 'add' ) {
              await addVideoTag( this.form )
            } else {
              await editVideoTag( { id : this.currentRowData.tagId, data : { ...this.form }} )
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
}
</style>
