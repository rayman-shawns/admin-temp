<template>
  <div>
    <el-form v-loading="loading" ref="form" :rules="rules" :model="form" label-position="left" label-width="120px">
      <el-form-item label="标签名称" prop="name">
        <el-input type="text" placeholder="请输入" clearable v-model="form.name" />
      </el-form-item>
      <el-form-item label="定位">
        <el-select v-model="form.posType" class="filter-item" placeholder="" @change="changePosType">
          <el-option v-for="item in posTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>
      </el-form-item>
      <el-form-item label="推送">
        <el-checkbox-group v-model="form.pushTypes">
          <el-checkbox :label="item.key" v-for="item in devices" :key="item.key" name="type">{{
            item.display_name
          }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="关联上级标签">
        <el-select v-model.number="form.pid" class="filter-item" placeholder="">
          <el-option label="顶级标签" :value="0" />
          <el-option v-for="item in posAllList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="模板选择">
        <el-select v-model="form.templateType" class="filter-item" placeholder="">
          <el-option v-for="item in formatOptions" :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>
      </el-form-item>
      <el-form-item label="排序（倒序）" prop="priority">
        <el-input type="text" class="priority" placeholder="请输入" clearable v-model.number="form.priority" />
      </el-form-item>
      <el-form-item v-if="form.posType === 2" class="upload-block" label="图片">
        <!-- <div class="upload">
          <span>移动端</span>
          <upload-img
            :default-img="coverDomain + form.h5Cover"
            @onSuccess="getUploadRes($event, 'h5Cover')"
            @beforeUpload="beforeUpload"
            @uploadDone="uploadDone"
          >
          </upload-img>
        </div> -->
        <!-- <div class="upload">
          <span>PC端</span>
          <upload-img
            :default-img="coverDomain + form.pcCover"
            @onSuccess="getUploadRes($event, 'pcCover')"
            @beforeUpload="beforeUpload"
            @uploadDone="uploadDone"
          >
          </upload-img>
        </div>
        <div class="des">只有选择的定位为色点时，才出现图片的上传</div> -->
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
// import UploadImg from '/@/components/UploadImg'
// import { useUserStore } from '/@/store'
import { addVideoPosTag, editVideoPosTag, apiGetVideoPosList } from '/@/api/video-manage/template.js'
import { imgContainer, coverDomain } from '/@/config/constant.js'

export default {
  // components : { UploadImg },
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
    // posAllList : {
    //   type : Array,
    //   default : () => ( [] )
    // }
  },
  data() {
    return {
      loading : false,
      form : {
        name : '',
        h5Cover : '',
        pcCover : '',
        pid : 0,
        pushTypes : [],
        posType : 1,
        templateType : 1,
        priority : 0
      },
      rules : {
        name : [{ required : true, message : '请输入定位标签', trigger : 'blur' }]
      },
      posTypeOptions : [
        { key : 1, display_name : '首页' },
        { key : 2, display_name : '色点' }
      ],
      formatOptions : [
        { key : 1, display_name : '1+2+2' },
        { key : 2, display_name : '2+2' },
        { key : 3, display_name : 's+1.5' },
        { key : 4, display_name : '2+2+2' },
        { key : 5, display_name : '1+2' },
        { key : 6, display_name : '2+2+2+2+2+2' },
        { key : 7, display_name : '无' }
      ],
      devices : [
        { key : 1, display_name : 'H5' },
        { key : 2, display_name : 'iOS' },
        { key : 3, display_name : 'android' }
        // { key : 4, display_name : 'pc' }
      ],
      posAllList : []
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
      this.changePosType( this.currentRowData.posType )
    } else {
      this.changePosType( 1 )
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
    async changePosType( type ) {
      if ( this.mode === 'add' ) {
        this.form.pid = 0
      }
      const params = {
        posType : type,
        pid : -1
      }
      try {
        const res = await apiGetVideoPosList( params )
        this.posAllList = res.data.list
      } catch ( error ) {}
    },
    submitForm() {
      // 给父组件返回promise对象用于回调
      return new Promise( resolve => {
        this.$refs.form.validate( async valid => {
          if ( !valid ) return resolve( false )

          if ( this.form.posType === 1 ) {
            this.form.h5Cover = ''
            this.form.pcCover = ''
          } else {
            this.form.h5Cover = ''
          }

          try {
            if ( this.mode === 'add' ) {
              await addVideoPosTag( { data : { ...this.form }} )
            } else {
              await editVideoPosTag( { data : { ...this.form }} )
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
.priority {
  width: 190px;
}
</style>
