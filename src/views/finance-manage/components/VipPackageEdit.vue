<template>
  <div class="vip-edit">
    <el-form v-loading="loading" ref="form" :rules="rules" :model="form" label-position="left" label-width="80px">
      <el-form-item label="套餐名字" prop="title">
        <el-input type="text" clearable placeholder="请输入" v-model.trim="form.title" />
      </el-form-item>
      <el-form-item label="时限">
        <el-radio-group v-model="form.is_forever">
          <el-radio v-for="item in timeOptions" :key="item.key" :label="item.key">{{ item.display_name }}</el-radio>
        </el-radio-group>
        <el-input
          class="des"
          :readonly="form.is_forever === 1"
          type="text"
          placeholder="请输入"
          v-model.number="form.day_num"
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-switch :active-value="1" :inactive-value="2" v-model="form.state" />
      </el-form-item>
      <el-form-item label="排序">
        <el-input type="text" placeholder="请输入" v-model.number="form.sort" />
        <span class="des">数值越大越靠前</span>
      </el-form-item>
      <el-form-item label="现价">
        <el-input type="text" placeholder="请输入" v-model.number="form.gold" />
      </el-form-item>
      <el-form-item label="原价">
        <el-input type="text" placeholder="请输入" v-model.number="form.price" />
      </el-form-item>
      <el-form-item class="upload-block" label="等级标识">
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
          :default-img="coverDomain + form.bg_img"
          @onSuccess="getUploadRes($event, 'bg_img')"
          @beforeUpload="beforeUpload"
          @uploadDone="uploadDone"
        >
        </upload-img>
      </el-form-item>
      <el-form-item label="赠送金币">
        <el-input type="text" placeholder="请输入" v-model.number="form.extra" />
      </el-form-item>
      <!-- <el-form-item label="特权选择">
        <el-checkbox-group v-model="form.c_id">
          <el-checkbox :label="item.id" v-for="item in privilegeOptions" :key="item.id" name="type">{{
            item.title
          }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item> -->
      <el-form-item label="等级">
        <el-select v-model="form.level" placeholder="" clearable class="filter-item">
          <el-option v-for="item in levelOptions" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="说明">
        <el-input type="textarea" clearable :rows="4" placeholder="请输入" v-model="form.content" />
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import UploadImg from '/@/components/UploadImg'
// import { useUserStore } from '/@/store'
import { editVip, addVip } from '/@/api/finance-manage/vipPackage.js'
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
    privilegeOptions : {
      type : Array,
      default : () => []
    }
  },
  data() {
    return {
      loading : false,
      form : {
        title : '',
        is_forever : 1,
        day_num : 0,
        sort : 0,
        extra : 0,
        gold : '',
        price : '',
        icon : '',
        bg_img : '',
        level : 0,
        content : '',
        state : 2
      },
      privilegeOptions2 : [
        { key : 1, display_name : '身份标识' },
        { key : 2, display_name : 'VIP资源' },
        { key : 3, display_name : '自定义头像' },
        { key : 4, display_name : '播放免广告' },
        { key : 5, display_name : 'HD高清' },
        { key : 6, display_name : '收益提现' },
        { key : 7, display_name : '私信聊天' },
        { key : 8, display_name : '动态优先审核' },
        { key : 9, display_name : '评论区权限' },
        { key : 10, display_name : '专属客服' },
        { key : 11, display_name : '全站无限看' },
        { key : 12, display_name : '高速专线' }
      ],
      levelOptions : [10, 20, 30, 40, 100],
      timeOptions : [
        { key : 1, display_name : '永久' },
        { key : 2, display_name : '非永久' }
      ],
      rules : {
        title : [{ required : true, message : '请输入套餐名字', trigger : 'blur' }]
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
              await addVip( this.form )
            } else {
              await editVip( this.form )
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
