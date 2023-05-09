<template>
  <div>
    <el-form v-loading="loading" ref="form" :model="form" :rules="rules" label-position="left" label-width="100px">
      <el-form-item label="显示终端">
        <el-radio-group v-model.number="form.t">
          <el-radio v-for="item in terminal" :key="item.key" :label="item.key">{{ item.display_name }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="广告位置">
        <el-select v-model="form.posType" placeholder="" clearable class="filter-item">
          <template v-if="form.t === 1">
            <el-option v-for="item in locationOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </template>
          <el-option
            v-else
            v-for="item2 in locationPcOptions"
            :key="item2.key"
            :label="item2.display_name"
            :value="item2.key"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="isShowPosTag" label="">
        <el-checkbox-group v-model="form.videoPosIds">
          <el-checkbox :label="item.id" v-for="item in homePosTagList" :key="item.id" name="type">{{
            item.name
          }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="广告标题" prop="title">
        <el-input type="text" placeholder="请输入" v-model="form.title" />
      </el-form-item>
      <el-form-item label="广告图片" prop="pic">
        <upload-img
          :default-img="coverDomain + form.pic"
          @onSuccess="getUploadRes($event, 'pic')"
          @beforeUpload="beforeUpload"
          @uploadDone="uploadDone"
        >
        </upload-img>
      </el-form-item>
      <el-form-item label="广告链接">
        <el-input type="text" placeholder="请输入" v-model="form.href" />
      </el-form-item>
      <el-form-item label="到期日期">
        <el-date-picker v-model="date" class="filter-item" type="date" clearable placeholder="请选择日期" />
      </el-form-item>
      <el-form-item label="排序（倒序）" prop="priority">
        <el-input type="text" class="priority" placeholder="请输入" clearable v-model.number="form.priority" />
      </el-form-item>
      <el-form-item label="推送设备" v-if="form.t === 1">
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
import { apiAddAdvertise, apiEditAdvertise } from '/@/api/advertisement-manage/list.js'
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
    },
    posTagList : {
      type : Array,
      default : () => []
    }
  },
  data() {
    return {
      loading : false,
      date : '',
      form : {
        t : 1,
        posType : 10,
        videoPosIds : [],
        pic : '',
        title : '',
        href : '',
        endTime : '',
        priority : 1,
        pushTypes : []
      },
      locationOptions : [
        { key : 5, display_name : '启动图' },
        { key : 10, display_name : '首页banner' },
        { key : 30, display_name : '发现banner' },
        { key : 20, display_name : '色点banner' },
        { key : 40, display_name : '游戏banner' },
        { key : 50, display_name : '模块穿插' },
        { key : 60, display_name : '列表穿插' },
        { key : 70, display_name : '播放详情页' }
      ],
      locationPcOptions : [
        { key : 10, display_name : '首页banner' },
        { key : 70, display_name : '播放详情页' }
      ],
      posTypeOptions : [{ key : 1, display_name : '无' }],
      devices : [
        { key : 1, display_name : 'H5' },
        { key : 2, display_name : 'ios' },
        { key : 3, display_name : 'android' }
        // { key : 4, display_name : 'pc' }
      ],
      terminal : [
        { key : 1, display_name : '移动端' }
        // { key : 2, display_name : 'PC端' }
      ],
      rules : {
        title : [{ required : true, message : '请输入广告标题', trigger : 'blur' }],
        pic : [{ required : true, message : '请上传广告图片', trigger : 'blur' }]
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
      this.date = new Date( this.form.endTime * 1000 )
      this.form.id = this.currentRowData.id
    }
  },
  computed : {
    isShowPosTag() {
      return this.form.t === 1 && this.homePosTagList && this.form.posType === 10
    },
    homePosTagList() {
      const arr = []
      if ( this.posTagList.length > 0 ) {
        return this.posTagList.filter( item => {
          return item.posType === 1
        } )
      }
      return arr
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
            if ( this.date ) {
              this.form.endTime = this.date.getTime() / 1000
            }
            if ( this.form.posType !== 10 ) {
              this.form.videoPosIds = []
            }

            if ( this.form.t === 2 ) {
              this.form.pushTypes = []
            }

            if ( this.mode === 'add' ) {
              await apiAddAdvertise( { data : { ...this.form }} )
            } else {
              await apiEditAdvertise( { data : { ...this.form }} )
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
.el-input {
  width: 40%;
}
:deep(.el-checkbox) {
  .el-checkbox__label {
    background: #e9e9eb;
    margin-left: 5px;
    border-radius: 4px;
    color: #909399;
    padding: 4px 8px;
  }
  .el-checkbox__inner {
    width: 16px;
    height: 16px;
  }
}
</style>
