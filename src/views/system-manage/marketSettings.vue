<template>
  <div class="base-settings">
    <el-form ref="form" :model="form" label-position="left" label-width="150px">
      <el-card shadow="hover" class="wrapper">
        <h2>推广设置</h2>
        <!-- <el-form-item label="分享奖励类型">
          <el-radio-group v-model="form.vip">
            <el-radio label="vip" />
            <el-radio label="svip" />
          </el-radio-group>
          <span class="des">选择奖励类型</span>
        </el-form-item>
        <el-form-item label="分享奖励数量">
          <el-input type="text" placeholder="请输入" v-model="form.no" />
          <span class="des">选择奖励类型</span>
        </el-form-item> -->
        <!-- <el-form-item label="宣传海报">
          <upload-img :default-img="form.img" @onSuccess="getUploadRes($event, 'img_path')" />
        </el-form-item>
        <el-form-item label="宣传文案">
          <YuTinymce :value="form.contents" :height="500" @input="getEditorContent" />
        </el-form-item> -->
        <el-form-item v-for="item in promoteFormList" :key="item && item.k" :label="item && item.label">
          <template v-if="item">
            <FormFilter :column="item" @updateKeyValue="updateKeyValue"></FormFilter>
          </template>
          <span class="des">{{ item && item.des }}</span>
        </el-form-item>
      </el-card>
      <el-button :loading="btnLoading"
class="btn"
size="large"
type="primary"
@click="batchUpdateAppConfig"
        >保存</el-button
      >
    </el-form>
  </div>
</template>
<script>
import FormFilter from '/@/components/FormFilter'
import { promoteModule } from './config/marketSettingsConfig.js'
import { apiGetAppConfig, apiUpdateAppConfig, apiBatchUpdateAppConfig } from '/@/api/system-manage/index.js'

const moduleName = ['promote']
export default {
  components : { FormFilter },
  data() {
    return {
      loading : false,
      btnLoading : false,
      form : {
        no : '',
        delivery : 1,
        vip : '',
        contents : '',
        img : ''
      },
      promoteFormList : [],
      promoteModule
    }
  },
  created() {
    this.init()
  },
  methods : {
    init() {
      this.getAppConfig( moduleName[0] )
    },
    async getAppConfig( module ) {
      this.loading = true
      const params = {
        m : module
      }
      try {
        const res = await apiGetAppConfig( params )
        const { list } = res.data

        if ( module === moduleName[0] ) {
          this.promoteFormList = list
          if ( list.length <= this.promoteModule.length ) {
            this.initDataBase( module )
          }
        }
        this.mapStaticFormList( module )
        // console.log( this.promoteFormList )
        this.loading = false
      } catch ( error ) {
        this.loading = false
      }
    },
    async batchUpdateAppConfig() {
      this.btnLoading = true
      let list = [...this.promoteFormList]
      list = list
        .filter( item => item )
        .map( item => {
          delete item.label
          delete item.des
          return item
        } )
      const params = {
        list
      }
      try {
        await apiBatchUpdateAppConfig( params )
        this.init()
        this.btnLoading = false
      } catch ( error ) {
        this.btnLoading = false
      }
    },
    async updateAppConfig( block ) {
      this.loading = true
      const blockCopy = JSON.parse( JSON.stringify( block ) )
      delete blockCopy.label
      delete blockCopy.des
      const params = {
        data : blockCopy
      }

      try {
        await apiUpdateAppConfig( params )
        this.loading = false
      } catch ( error ) {
        this.loading = false
      }
    },
    initDataBase( module ) {
      let targetModule = []
      if ( module === moduleName[0] ) {
        targetModule = this.promoteModule
      }

      targetModule.map( block => {
        this.updateAppConfig( block )
        return block
      } )

      if ( module === moduleName[0] ) {
        setTimeout( () => {
          if ( this.promoteFormList.length === 0 ) {
            this.getAppConfig( moduleName[0] )
          }
        }, 800 )
      }
    },
    updateKeyValue( obj ) {
      let targetArr = []
      // let targetObj = {}
      if ( obj.m === moduleName[0] ) {
        targetArr = this.promoteFormList
      }
      targetArr.forEach( item => {
        if ( item && obj && item.k === obj.k ) {
          item.v = obj.v
          // targetObj = item
        }
      } )
      // this.updateAppConfig( targetObj )
    },
    mapStaticFormList( module ) {
      let targetArr = []
      let staticArr = []
      if ( module === moduleName[0] ) {
        targetArr = this.promoteFormList
        staticArr = this.promoteModule
      }

      targetArr.forEach( item => {
        staticArr.forEach( item2 => {
          if ( item.k === item2.k ) {
            item.label = item2.label
            item.des = item2.des
          }
        } )
      } )
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
      .form-item-wrapper {
        width: 80%;
      }
    }
    .btn {
      width: 140px;
      height: 50px;
    }
  }
}
</style>
