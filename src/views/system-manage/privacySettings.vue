<template>
  <div class="base-settings">
    <el-form v-loading="loading" ref="form" :model="form" label-position="left" label-width="150px">
      <el-card shadow="hover" class="wrapper">
        <h2>隐私政策</h2>
        <el-form-item label="版本名称">
          <el-input type="text" placeholder="请输入" v-model="form.no" />
          <span class="des">最新版本名称或描述，请咨询技术员</span>
        </el-form-item>
      </el-card>
      <el-button class="btn" size="large" type="primary">保存</el-button>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading : false,
      form : {
        no : '',
        delivery : 1,
        img : ''
        // img : 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
      }
    }
  },
  methods : {}
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
      width: 140px;
      height: 50px;
    }
  }
}
</style>
