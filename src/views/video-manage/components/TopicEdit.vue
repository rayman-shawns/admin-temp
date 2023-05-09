<template>
  <div class="topic-edit">
    <el-form v-loading="loading" ref="form" :model="form" label-position="left" :rules="rules" label-width="100px">
      <el-form-item label="专题名称" prop="name">
        <el-input type="text" clearable placeholder="请输入" v-model="form.name" />
      </el-form-item>
      <el-form-item class="upload-block" label="头像">
        <upload-img
          :default-img="coverDomain + form.avatar"
          @onSuccess="getUploadRes($event, 'avatar')"
          @beforeUpload="beforeUpload"
          @uploadDone="uploadDone"
        />
      </el-form-item>
      <el-form-item class="upload-block" label="封面">
        <upload-img
          :default-img="coverDomain + form.cover"
          @onSuccess="getUploadRes($event, 'cover')"
          @beforeUpload="beforeUpload"
          @uploadDone="uploadDone"
        />
      </el-form-item>
      <!-- <el-form-item class="upload-block" label="背景">
        <upload-img
          :default-img="coverDomain + form.bgImage"
          @onSuccess="getUploadRes($event, 'bgImage')"
          @beforeUpload="beforeUpload"
          @uploadDone="uploadDone"
        />
      </el-form-item> -->
      <el-form-item label="排序（倒序）" prop="priority">
        <el-input type="text" class="priority" placeholder="请输入" clearable v-model.number="form.priority" />
      </el-form-item>
      <el-form-item label="介绍">
        <el-input type="textarea" clearable row="2" placeholder="请输入" v-model="form.intro" />
      </el-form-item>
      <el-form-item label="推送">
        <el-checkbox-group v-model="form.pushTypes">
          <el-checkbox :label="item.key" v-for="item in devices" :key="item.key" name="type">{{
            item.display_name
          }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import UploadImg from '/@/components/UploadImg'
// import { useUserStore } from '/@/store'
import { addTopic, editTopic } from '/@/api/video-manage/topic.js'
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
        name : '',
        avatar : '',
        cover : '',
        bgImage : '',
        intro : '',
        pushTypes : [],
        priority : 0,
        reqType : 0
      },
      rules : {
        name : [{ required : true, message : '请输入专题名称', trigger : 'blur' }]
      },
      devices : [
        { key : 1, display_name : 'H5' },
        { key : 2, display_name : 'iOS' },
        { key : 3, display_name : 'android' }
        // { key : 4, display_name : 'pc' }
      ]
    }
  },
  created() {
    if ( this.mode === 'edit' ) {
      for ( const key in this.form ) {
        if ( Object.hasOwnProperty.call( this.form, key ) ) {
          this.form[key] = this.currentRowData[key]
        }
      }
      this.form.reqType = 0
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
    handleFilter() {},
    submitForm() {
      // 给父组件返回promise对象用于回调
      return new Promise( resolve => {
        this.$refs.form.validate( async valid => {
          if ( !valid ) return resolve( false )
          try {
            if ( this.mode === 'add' ) {
              await addTopic( this.form )
            } else {
              await editTopic( { id : this.currentRowData.topicId, data : this.form } )
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
