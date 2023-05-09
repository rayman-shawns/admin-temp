<template>
  <div class="base-settings">
    <el-form v-loading="loading" ref="form" :model="form" label-position="left" label-width="150px">
      <YuTinymce :value="form.contents" :height="500" @input="getEditorContent" />
      <el-button class="btn" size="large" type="primary">保存</el-button>
    </el-form>
  </div>
</template>
<script>
import YuTinymce from '/@/components/YuTinymce'
export default {
  components : { YuTinymce },
  data() {
    return {
      loading : false,
      form : {
        no : '',
        delivery : 1,
        vip : '',
        contents : '',
        img : ''
        // img : 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
      }
    }
  },
  methods : {
    // 获取上传文件成功返回的数据
    getUploadRes( res, key ) {
      console.log( 'getUploadRes', res, key )
    },
    // 富文本更新内容
    getEditorContent( info ) {
      this.form.contents = info
    }
  }
}
</script>
<style lang="scss" scoped>
.base-settings {
  padding: 40px 20px 40px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .el-form {
    width: 100%;
    .wrapper {
      margin-bottom: 10px;
      h2 {
        margin-bottom: 10px;
        font-size: 20px;
        color: #000;
        font-weight: 600;
      }
      .el-input {
        width: 40%;
      }
      .el-switch {
        margin-right: 10px;
      }
      .des {
        margin-left: 10px;
      }
    }
    .btn {
      margin-top: 20px;
      width: 140px;
      height: 50px;
    }
  }
}
</style>
