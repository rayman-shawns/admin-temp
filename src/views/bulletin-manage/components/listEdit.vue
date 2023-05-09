<template>
  <div>
    <el-form v-loading="loading" ref="form" :model="form" :rules="rules" label-position="left" label-width="100px">
      <el-form-item label="公告标题" prop="title">
        <el-input type="text" placeholder="请输入" v-model="form.title" />
      </el-form-item>
      <el-form-item label="展示方式">
        <el-select v-model.number="form.showType" placeholder="" clearable class="filter-item">
          <el-option v-for="item in locationOptions" :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>
        <div class="des">内容展示方式，当用户点击公告标题后的内容展示形式选择</div>
      </el-form-item>
      <el-form-item label="展示内容">
        <YuTinymce :value="form.content" :height="500" @input="getEditorContent" />
      </el-form-item>
      <el-form-item label="排序（降序）">
        <el-input type="text" placeholder="请输入" v-model.number="form.priority" />
        <div class="des">数值越大越靠前</div>
      </el-form-item>
      <el-form-item label="到期日期">
        <el-date-picker v-model="date" class="filter-item" type="date" clearable placeholder="请选择日期" />
        <div class="des">过期后公告将不再显示</div>
      </el-form-item>
      <el-form-item label="推送设备">
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
import YuTinymce from '/@/components/YuTinymce'
import { apiAddNotice, apiEditNotice } from '/@/api/bulletin-manage/website.js'

export default {
  components : { YuTinymce },
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
      date : '',
      form : {
        title : '',
        showType : 10,
        content : '',
        endTime : '',
        priority : 1,
        pushTypes : []
      },
      locationOptions : [
        { key : 10, display_name : '滚动展示' },
        { key : 20, display_name : '弹窗展示' }
      ],
      posTypeOptions : [{ key : 1, display_name : '无' }],
      devices : [
        { key : 1, display_name : 'H5' },
        { key : 2, display_name : 'iOS' },
        { key : 3, display_name : 'android' }
        // { key : 4, display_name : 'pc' }
      ],
      rules : {
        title : [{ required : true, message : '请输入广告标题', trigger : 'blur' }]
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
  methods : {
    // 富文本更新内容
    getEditorContent( info ) {
      this.form.content = info
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
            if ( this.mode === 'add' ) {
              await apiAddNotice( { data : { ...this.form }} )
            } else {
              await apiEditNotice( { data : { ...this.form }} )
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
.des {
  margin-left: 10px;
}
</style>
