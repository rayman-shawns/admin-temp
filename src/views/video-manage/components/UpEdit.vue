<template>
  <div class="topic-edit">
    <el-form v-loading="loading" ref="form" :model="form" label-position="left" label-width="140px">
      <el-form-item label="账号">
        <el-input type="text" readonly placeholder="请输入" v-model="form.username" />
      </el-form-item>
      <el-form-item label="个性签名">
        <el-input type="textarea" placeholder="请输入" clearable v-model="form.signature" />
      </el-form-item>
      <el-form-item label="昵称">
        <el-input type="text" placeholder="请输入" v-model="form.nickname" />
      </el-form-item>
      <el-form-item class="upload-block" label="头像">
        <upload-img
          :default-img="coverDomain + form.avatar"
          @onSuccess="getUploadRes($event, 'avatar')"
          @beforeUpload="beforeUpload"
          @uploadDone="uploadDone"
        >
        </upload-img>
      </el-form-item>
      <el-form-item class="interval-block" label="粉丝">
        <div class="interval">
          <el-input type="text" placeholder="请输入" clearable v-model.number="form.minFansNum" /> ~
          <el-input type="text" placeholder="请输入" clearable v-model.number="form.maxFansNum" />
        </div>
        <el-radio-group class="clear" v-model="form.fansNumMode">
          <el-radio v-for="item in countModeOptions" :key="item.key" :label="item.key">{{ item.name }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- <el-form-item label="收到打赏">
        <div class="reward-block">
          <p class="bal">当前收到打赏金币：0</p>
          <div class="action">
            <span class="label">增加</span>
            <el-input type="text" placeholder="请输入" clearable v-model="form.no" />
          </div>
          <div class="action">
            <span class="label">减少</span>
            <el-input type="text" placeholder="请输入" clearable v-model="form.no" />
          </div>
        </div>
      </el-form-item> -->
      <el-form-item label="排序">
        <el-input type="text" placeholder="请输入" v-model.number="form.priority" />
      </el-form-item>
      <el-form-item label="是否显示在原创大神">
        <el-radio-group v-model.number="form.level">
          <el-radio v-for="item in creator" :key="item.key" :label="item.key">{{ item.display_name }}</el-radio>
        </el-radio-group>
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
import { apiAddVideoUper, apiEditVideoUper } from '/@/api/video-manage/uper.js'
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
        username : '',
        nickname : '',
        avatar : '',
        signature : '',
        level : 1,
        status : 1,
        pushTypes : [],
        priority : 0,
        minFansNum : '',
        maxFansNum : '',
        fansNumMode : 0
      },
      creator : [
        { key : 10, display_name : '是' },
        { key : 1, display_name : '否' }
      ],
      devices : [
        { key : 1, display_name : 'H5' },
        { key : 2, display_name : 'ios' },
        { key : 3, display_name : 'android' }
        // { key : 4, display_name : 'pc' }
      ],
      countModeOptions : [
        { key : 1, name : '新增' },
        { key : 2, name : '重置' }
      ]
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
      this.form.uid = this.currentRowData.uid
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
            const params = {}
            for ( const key in this.form ) {
              if ( Object.hasOwnProperty.call( this.form, key ) ) {
                if ( this.form[`${key}`] || this.form[`${key}`] === 0 ) {
                  params[`${key}`] = this.form[`${key}`]
                }
              }
            }

            if ( this.mode === 'add' ) {
              await apiAddVideoUper( { data : { ...params }} )
            } else {
              await apiEditVideoUper( { data : { ...params }} )
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

:deep(.reward-block) {
  .bal {
    height: 40px;
  }
  .action {
    display: flex;
    align-items: center;
    margin-bottom: 6px;
    .label {
      width: 60px;
      margin-right: 10px;
    }
    .el-input {
      width: 100%;
    }
  }
}

.interval-block {
  .interval {
    .el-input {
      width: 120px;
    }
  }
  .clear {
    margin-left: 20px;
    .el-radio {
      margin-right: 24px;
    }
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
