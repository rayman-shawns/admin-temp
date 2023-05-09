<template>
  <div class="base-settings">
    <el-form v-loading="loading" ref="form" :model="form" label-position="left" label-width="150px">
      <el-card shadow="hover" class="wrapper">
        <h2>视频设置</h2>
        <!-- <el-form-item label="试看时长">
            <el-input type="text" placeholder="请输入" v-model="form.no" />
            <span class="des">游客和普通用户观看VIP视频的试看时长，单位秒</span>
          </el-form-item> -->
        <el-form-item v-for="item in videoFormList" :key="item && item.k" :label="item && item.label">
          <template v-if="item">
            <FormFilter :column="item" @updateKeyValue="updateKeyValue"></FormFilter>
          </template>
          <span class="des">{{ item && item.des }}</span>
        </el-form-item>
        <!-- <el-form-item label="免费观看次数">
            <el-input type="text" placeholder="请输入" v-model="form.no" />
            <span class="des">每天免费观看次数初始值(会员每天所得免费观看次数 = 每天免费观看次数初始值 + 奖励的免费观看次数</span>
          </el-form-item>
          <el-form-item label="web服务器">
            <el-input type="text" placeholder="请输入" v-model="form.no" />
            <span class="des">Web服务器储存域名，请加上http:// 或 https://</span>
          </el-form-item>
          <el-form-item label="首页模块分页数量">
            <el-input type="text" placeholder="请输入" v-model="form.no" />
            <span class="des">每页显示模块的个数（首页-推荐）</span>
          </el-form-item>
          <el-form-item label="二级页分页数量">
            <el-input type="text" placeholder="请输入" v-model="form.no" />
            <span class="des">每页显示视频的个数（各类二级页或使用2+2+2+2+2+2模块的）</span>
          </el-form-item> -->
      </el-card>
      <el-card shadow="hover" class="wrapper">
        <h2>视频存储</h2>
        <el-form-item v-for="item in strorageFormList" :key="item && item.k" :label="item && item.label">
          <template v-if="item">
            <FormFilter :column="item" @updateKeyValue="updateKeyValue"></FormFilter>
          </template>
          <span class="des">{{ item && item.des }}</span>
        </el-form-item>
        <!-- <el-form-item label="连接字符串">
            <el-input type="text" placeholder="请输入" v-model="form.no" />
            <span class="des"></span>
          </el-form-item>
          <el-form-item label="容器名称">
            <el-input type="text" placeholder="请输入" v-model="form.no" />
            <span class="des"></span>
          </el-form-item>
          <el-form-item label="SAS URL">
            <el-input type="text" placeholder="请输入" v-model="form.no" />
            <span class="des"></span>
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
import { videoModule, strorageModule } from './config/videoSettingsConfig.js'
import { apiGetAppConfig, apiUpdateAppConfig, apiBatchUpdateAppConfig } from '/@/api/system-manage/index.js'

const moduleName = ['video', 'strorage']
export default {
  components : { FormFilter },
  data() {
    return {
      loading : false,
      btnLoading : false,
      form : {
        no : '',
        delivery : 1,
        img : ''
        // img : 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
      },
      videoFormList : [],
      strorageFormList : [],
      videoModule,
      strorageModule
    }
  },
  created() {
    this.init()
  },
  methods : {
    init() {
      this.getAppConfig( moduleName[0] )
      this.getAppConfig( moduleName[1] )
    },
    async getAppConfig( module ) {
      this.loading = true
      const params = {
        m : module
      }
      try {
        const res = await apiGetAppConfig( params )
        let { list } = res.data
        list = list.filter( item => item !== undefined )

        if ( module === moduleName[0] ) {
          this.videoFormList = list
          if ( list.length < this.videoModule.length ) {
            this.initDataBase( module )
          }
        } else {
          this.strorageFormList = list
          if ( list.length < this.strorageModule.length ) {
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
      let list = [...this.videoFormList, ...this.strorageFormList]
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
        targetModule = this.videoModule
      } else {
        targetModule = this.strorageModule
      }

      targetModule.map( block => {
        this.updateAppConfig( block )
        return block
      } )

      if ( module === moduleName[0] ) {
        setTimeout( () => {
          if ( this.videoFormList.length === 0 ) {
            this.getAppConfig( moduleName[0] )
          }
        }, 800 )
      } else {
        setTimeout( () => {
          if ( this.strorageFormList.length === 0 ) {
            this.getAppConfig( moduleName[1] )
          }
        }, 800 )
      }
    },
    updateKeyValue( obj ) {
      let targetArr = []
      // let targetObj = {}
      if ( obj.m === moduleName[0] ) {
        targetArr = this.videoFormList
      } else {
        targetArr = this.strorageFormList
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
        targetArr = this.videoFormList
        staticArr = this.videoModule
      } else {
        targetArr = this.strorageFormList
        staticArr = this.strorageModule
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
