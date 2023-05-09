<template>
  <div class="base-settings">
    <el-form v-loading="loading" ref="form" :model="form" label-position="left" label-width="150px">
      <el-card shadow="hover" class="wrapper">
        <h2>微软云</h2>
        <el-form-item v-for="item in pictureFormList" :key="item.k" :label="item.label">
          <FormFilter :column="item" @updateKeyValue="updateKeyValue"></FormFilter>
          <span class="des">{{ item.des }}</span>
        </el-form-item>
        <!-- <el-form-item label="连接字符串">
            <el-input type="text" placeholder="请输入" v-model="form.no" />
          </el-form-item>
          <el-form-item label="容器名称">
            <el-input type="text" placeholder="请输入" v-model="form.no" />
          </el-form-item>
          <el-form-item label="SAS URL">
            <el-input type="text" placeholder="请输入" v-model="form.no" />
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
import { pictureModule } from './config/pictureSettingsConfig.js'
import { apiGetAppConfig, apiUpdateAppConfig, apiBatchUpdateAppConfig } from '/@/api/system-manage/index.js'

const moduleName = ['picture']
export default {
  components : { FormFilter },
  data() {
    return {
      btnLoading : false,
      loading : false,
      form : {
        no : '',
        delivery : 1
      },
      pictureFormList : [],
      pictureModule
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
          this.pictureFormList = list
          if ( list.length < this.pictureModule.length ) {
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
      let list = [...this.pictureFormList]
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
        targetModule = this.pictureModule
      }

      targetModule.map( block => {
        this.updateAppConfig( block )
        return block
      } )

      if ( module === moduleName[0] ) {
        setTimeout( () => {
          if ( this.pictureFormList.length === 0 ) {
            this.getAppConfig( moduleName[0] )
          }
        }, 800 )
      }
    },
    updateKeyValue( obj ) {
      let targetArr = []
      // let targetObj = {}
      if ( obj.m === moduleName[0] ) {
        targetArr = this.pictureFormList
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
        targetArr = this.pictureFormList
        staticArr = this.pictureModule
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
    }
    .btn {
      width: 140px;
      height: 50px;
    }
  }
}
</style>
