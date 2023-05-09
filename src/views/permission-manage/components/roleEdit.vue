<template>
  <div>
    <el-form v-loading="loading" ref="form" :model="formAdjust" label-position="left" label-width="80px">
      <el-form-item label="角色名称">
        <el-input type="text" placeholder="请输入角色名称" v-model="formAdjust.no" />
      </el-form-item>
      <el-form-item class="subtitle" label="权限配置"> </el-form-item>
      <el-form-item label="超级管理">
        <el-switch v-model="formAdjust.delivery" />
        <span class="des">开启超级管理员后，该角色拥有后台所有权限，请慎重选择</span>
      </el-form-item>
      <el-form-item label="上传视频">
        <el-checkbox-group v-model="formAdjust.tag">
          <el-checkbox label="Online activities" v-for="item in 6" :key="item" name="type" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="视频转码">
        <el-checkbox-group v-model="formAdjust.tag">
          <el-checkbox label="Online activities" v-for="item in 6" :key="item" name="type" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="视频列表">
        <el-checkbox-group v-model="formAdjust.tag">
          <el-checkbox label="Online activities" v-for="item in 6" :key="item" name="type" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="备注信息">
        <el-input type="textarea" :row="4" placeholder="请输入" v-model="formAdjust.no" />
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
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
      formAdjust : {
        no : '',
        delivery : 1
      }
    }
  },
  created() {},
  methods : {
    submitForm() {
      // 给父组件返回promise对象用于回调
      return new Promise( resolve => {
        this.$refs.form.validate( async valid => {
          if ( !valid ) return false
          resolve( true )
        } )
      } )
    }
  }
}
</script>
<style lang="scss" scoped>
.subtitle {
  color: #000;
  font-size: 16px;
  font-weight: 600;
}
.el-input {
  width: 40%;
}
.des {
  margin-left: 20px;
}
</style>
