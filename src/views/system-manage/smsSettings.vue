<template>
  <div class="base-settings">
    <el-form v-loading="loading" ref="form" :model="form" label-position="left" label-width="120px">
      <el-card shadow="hover" class="wrapper">
        <h2>短信设置</h2>
        <el-form-item label="登录账号">
          <el-input type="text" placeholder="请输入" v-model="form.no" />
          <span class="des">短信平台登录账号</span>
        </el-form-item>
        <el-form-item label="登录密码">
          <el-input type="text" placeholder="留空表示不修改" v-model="form.no" />
          <span class="des">短信平台登录密码</span>
        </el-form-item>
        <el-form-item label="短信签名">
          <el-input type="text" placeholder="请输入" v-model="form.no" />
          <span class="des">平台名称</span>
        </el-form-item>
        <el-form-item label="短信网关">
          <el-input type="text" placeholder="请输入" v-model="form.no" />
          <span class="des"></span>
        </el-form-item>
        <el-form-item label="短信内容模板">
          <el-input type="text" placeholder="验证码为：{s6}，打死也不要告诉别人" v-model="form.no" />
          <span class="des">注意：{s6}其中6表示位数，必须与&lt;验证码数&gt;保持一致</span>
        </el-form-item>
        <el-form-item label="验证码数">
          <el-input type="text" placeholder="请输入" v-model="form.no" />
          <span class="des"
            >用户接受验证码位数，最低4位，最高9位。注意：必须与&lt;短信内容模板&gt;中的{s6}保持一致</span
          >
        </el-form-item>
        <el-form-item label="间隔时间">
          <el-input type="text" placeholder="请输入" v-model="form.no" />
          <span class="des">单位秒钟，发送验证码间隔时间，最少30秒</span>
        </el-form-item>
        <el-form-item label="过期时间">
          <el-input type="text" placeholder="请输入" v-model="form.no" />
          <span class="des">单位分钟，验证码有效时间，最少3分钟</span>
        </el-form-item>
        <el-form-item label="手机号限制">
          <el-input type="text" placeholder="请输入" v-model="form.no" />
          <span class="des">每个手机号每天最多可发送多少条验证码，最低设置5</span>
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
