<template>
  <div class="base-settings">
    <el-form v-loading="loading" ref="form" :model="form" label-position="left" label-width="170px">
      <el-card shadow="hover" class="wrapper">
        <h2>域名配置</h2>
        <el-form-item v-for="item in domainFormList" :key="item.k" :label="item.label">
          <FormFilter :column="item" @updateKeyValue="updateKeyValue"></FormFilter>
          <span class="des">{{ item.des }}</span>
        </el-form-item>
        <!-- <el-form-item label="接口域名">
          <el-input type="textarea" :rows="4" placeholder="请输入" v-model="form.no" />
          <span class="des">Golang接口域名，一行一条</span>
        </el-form-item>
        <el-form-item label="图片文件域名">
          <el-input type="textarea" :rows="4" placeholder="请输入" v-model="form.no" />
          <span class="des">图片文件域名，一行一条</span>
        </el-form-item>
        <el-form-item label="落地页域名">
          <el-input type="textarea" :rows="4" placeholder="请输入" v-model="form.no" />
          <span class="des">落地页域名，一行一条</span>
        </el-form-item>
        <el-form-item label="官网域名">
          <el-input type="textarea" :rows="4" placeholder="请输入" v-model="form.no" />
          <span class="des">官网域名，一行一条</span>
        </el-form-item>
        <el-form-item label="VIP视频线路地址">
          <el-input type="textarea" :rows="4" placeholder="请输入" v-model="form.no" />
          <span class="des">VIP观看视频线路</span>
        </el-form-item>
        <el-form-item label="普通用户视频线路地址">
          <el-input type="textarea" :rows="4" placeholder="请输入" v-model="form.no" />
          <span class="des">普通用户观看视频线路</span>
        </el-form-item>
        <el-form-item label="免费视频线路地址">
          <el-input type="textarea" :rows="4" placeholder="请输入" v-model="form.no" />
          <span class="des">免费视频线路</span>
        </el-form-item> -->
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
import { domainModule } from './config/domainSettingsConfig.js'
import { apiGetAppConfig, apiUpdateAppConfig, apiBatchUpdateAppConfig } from '/@/api/system-manage/index.js'

const moduleName = ['domain']
export default {
  components : { FormFilter },
  data() {
    return {
      btnLoading : false,
      loading : false,
      form : {
        no : '',
        delivery : 1,
        img : ''
      },
      domainFormList : [],
      domainModule
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
          this.domainFormList = list
          if ( list.length < this.domainModule.length ) {
            this.initDataBase( module )
          }
        }
        this.mapStaticFormList( module )
        this.loading = false
      } catch ( error ) {
        this.loading = false
      }
    },
    async batchUpdateAppConfig() {
      this.btnLoading = true
      let list = [...this.domainFormList]
      list = list.map( item => {
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
        targetModule = this.domainModule
      }

      targetModule.map( block => {
        this.updateAppConfig( block )
        return block
      } )

      if ( module === moduleName[0] ) {
        setTimeout( () => {
          if ( this.domainFormList.length === 0 ) {
            this.getAppConfig( moduleName[0] )
          }
        }, 800 )
      }
    },
    updateKeyValue( obj ) {
      let targetArr = []
      // let targetObj = {}
      if ( obj.m === moduleName[0] ) {
        targetArr = this.domainFormList
      }
      targetArr.forEach( item => {
        if ( item.k === obj.k ) {
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
        targetArr = this.domainFormList
        staticArr = this.domainModule
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
      .el-textarea {
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
