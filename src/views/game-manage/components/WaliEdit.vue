<template>
  <div class="topic-edit">
    <el-form v-loading="loading" ref="form" :model="form" :rules="rules" label-position="left" label-width="80px">
      <el-form-item label="游戏名称" prop="title">
        <el-input type="text" placeholder="请输入" clearable v-model="form.title" />
      </el-form-item>

      <el-form-item label="游戏ID">
        <el-select v-model="gameConfig" value-key="code" class="filter-item" clearable placeholder="">
          <el-option v-for="item in gameConfigList" :key="item.id" :label="item.title" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="游戏标签">
        <el-input type="text" placeholder="请输入" clearable v-model="form.tag" />
        <!-- <el-radio-group v-model="form.tag">
          <el-radio label="无" />
          <el-radio label="最受欢迎" />
          <el-radio label="收益最高" />
        </el-radio-group> -->
      </el-form-item>

      <el-form-item class="upload-block" label="游戏封面">
        <!-- <el-input type="text" placeholder="请输入" v-model="form.no" /> -->
        <upload-img
          :default-img="coverDomain + form.icon"
          @onSuccess="getUploadRes($event, 'icon')"
          @beforeUpload="beforeUpload"
          @uploadDone="uploadDone"
        >
        </upload-img>
      </el-form-item>
      <el-form-item class="interval" label="在线人数">
        <el-input type="text" placeholder="请输入" clearable v-model.number="form.min_num" />&nbsp;~&nbsp;
        <el-input type="text" placeholder="请输入" clearable v-model.number="form.max_num" />
        <div class="des">默认的随机人数</div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import UploadImg from '/@/components/UploadImg'
// import { useUserStore } from '/@/store'
import { apiAddGame, apiEditGame } from '/@/api/game-manage/wali.js'
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
    gameConfigList : {
      type : Array,
      default : () => []
    }
  },
  data() {
    return {
      loading : false,
      gameConfig : {
        flag : '',
        code : '',
        plat : ''
      },
      form : {
        plat : '',
        title : '',
        flag : '',
        code : '',
        icon : '',
        min_num : '',
        max_num : '',
        tag : '',
        sort : 0
      },
      rules : {
        title : [{ required : true, message : '请输入游戏名称', trigger : 'blur' }]
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
      this.gameConfig.code = this.currentRowData.code
      this.gameConfig.flag = this.currentRowData.flag
      this.gameConfig.plat = this.currentRowData.plat
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
    gameConfigChange( val ) {
      console.log( val )
    },
    submitForm() {
      // 给父组件返回promise对象用于回调
      return new Promise( resolve => {
        this.$refs.form.validate( async valid => {
          if ( !valid ) return resolve( false )
          try {
            const { plat, code, flag } = this.gameConfig
            this.form = { ...this.form, plat, code, flag }
            if ( this.mode === 'add' ) {
              await apiAddGame( this.form )
            } else {
              await apiEditGame( this.form )
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
