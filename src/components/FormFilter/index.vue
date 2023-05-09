<template>
  <!-- <div v-for="column in columns" :key="column.k"> -->
  <div class="form-item-wrapper">
    <slot v-if="column.slot" :name="column.slot" />
    <template v-else-if="column.t === 1">
      <el-input
        type="text"
        v-model="formData.v"
        @blur="finishListener"
        placeholder="请输入"
        clearable
        :disabled="column.disabled"
      />
    </template>
    <template v-else-if="column.t === 2">
      <el-input
        placeholder="请输入"
        clearable
        v-model="formData.v"
        @blur="finishListener"
        :autosize="{ minRows: 4 }"
        resize="none"
        type="textarea"
      />
    </template>
    <template v-else-if="column.t === 3">
      <upload-file
        :default-img="`${column.v ? coverDomain + column.v : ''}`"
        @onSuccess="getUploadFileRes($event, column.k)"
        @beforeUpload="beforeUpload"
        @uploadDone="uploadDone"
      >
      </upload-file>
    </template>
    <template v-else-if="column.t === 4">
      <upload-img
        :default-img="coverDomain + column.v"
        @onSuccess="getUploadRes($event, column.k)"
        @beforeUpload="beforeUpload"
        @uploadDone="uploadDone"
      >
      </upload-img>
    </template>
    <template v-else-if="column.t === 5">
      <YuTinymce :value="formData.v" :height="500" @input="getEditorContent" />
    </template>
    <template v-else-if="column.t === 6">
      <el-input
        type="textarea"
        :rows="3"
        v-model="formData.v"
        @blur="finishListener"
        placeholder="请输入"
        clearable
        :disabled="column.disabled"
      />
    </template>
    <slot />
  </div>
</template>
<script>
import UploadImg from '/@/components/UploadImg'
import UploadFile from '/@/components/UploadFile'
import YuTinymce from '/@/components/YuTinymce'
// import { useUserStore } from '/@/store'
import { imgContainer, coverDomain } from '/@/config/constant.js'

export default {
  name : 'FormFilter',
  setup() {
    // const userStore = useUserStore()
    // const { imgContainer, coverDomain } = userStore
    return {
      imgContainer,
      coverDomain
    }
  },
  components : {
    UploadImg,
    UploadFile,
    YuTinymce
  },
  props : {
    column : {
      type : Object,
      default : () => {}
    }
  },
  data() {
    return {
      formData : {
        k : '',
        v : '',
        m : ''
      }
    }
  },
  created() {
    this.formData = { ...this.column }
  },
  methods : {
    // 富文本更新内容
    getEditorContent( info ) {
      try {
        this.formData.v = info
        this.$emit( 'updateKeyValue', this.formData )
      } catch ( error ) {
        console.log( 'getEditorContent', error )
      }
    },
    getUploadFileRes( file, key ) {
      console.log( 'getUploadRes', file, file.name, key )
      this.formData.v = this.imgContainer ? `/${this.imgContainer}/${file.name}` : `/${file.name}`
      // this.formData.forEach( item => {
      //   if ( item.key === key ) {
      //     item.v = `/${this.imgContainer}/${file.name}`
      //   }
      // } )
      this.$emit( 'updateKeyValue', this.formData )
      this.$emit( 'uploadDone' )
    },
    // 获取上传文件成功返回的数据
    getUploadRes( file, key ) {
      console.log( 'getUploadRes', file, file.name, key )
      this.formData.v = this.imgContainer ? `/${this.imgContainer}/${file.name}` : `/${file.name}`
      // this.formData.forEach( item => {
      //   if ( item.key === key ) {
      //     item.v = `/${this.imgContainer}/${file.name}`
      //   }
      // } )
      this.$emit( 'updateKeyValue', this.formData )
      this.$emit( 'uploadDone' )
    },
    beforeUpload() {
      this.$emit( 'beforeUpload' )
    },
    uploadDone() {
      this.$emit( 'uploadDone' )
    },
    finishListener() {
      this.$emit( 'updateKeyValue', this.formData )
    }
  }
}
</script>
<style lang="scss" scoped>
.form-item-wrapper {
  .el-input {
    width: 300px;
  }
  .el-textarea {
    width: 500px;
  }
}
</style>
