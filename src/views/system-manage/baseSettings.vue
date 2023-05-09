<template>
  <div class="base-settings">
    <el-form v-loading="loading" ref="form" :model="form" label-position="left" label-width="150px">
      <el-card shadow="hover" class="wrapper">
        <h2>通用设置</h2>
        <!-- <el-form-item label="系统状态">
          <el-switch v-model="form.delivery" />
          <span class="des">关闭或开启系统</span>
        </el-form-item> -->
        <el-form-item v-for="item in generalFormList" :key="item.k" :label="item.label">
          <FormFilter :column="item" @updateKeyValue="updateKeyValue"></FormFilter>
          <span class="des">{{ item.des }}</span>
        </el-form-item>
        <!-- <el-form-item label="系统名称">
          <el-input type="text" placeholder="请输入" v-model="form.no" />
          <span class="des">系统名称</span>
        </el-form-item>
        <el-form-item label="应用LOGO">
          <upload-img :default-img="form.img" @onSuccess="getUploadRes($event, 'img_path')" />
        </el-form-item>
        <el-form-item label="启动时间">
          <el-input type="text" placeholder="请输入" v-model="form.no" />
          <span class="des">单位秒钟，启动动画播放时间</span>
        </el-form-item>
        <el-form-item label="搜索间隔时间">
          <el-input type="text" placeholder="请输入" v-model="form.no" />
          <span class="des">单位秒，用户搜索视频间隔时间</span>
        </el-form-item>
        <el-form-item label="前端api接口缓存时间">
          <el-switch v-model="form.delivery" />
          <el-input type="text" placeholder="请输入" v-model="form.no" />
          <span class="des"
            >单位分，可设置时间区间（例如 5,9），节省服务器资源，减少数据库压力，更新资源后如需即时生效请清理缓存</span
          >
        </el-form-item> -->
        <!-- <el-form-item label="app启动图">
          <upload-img :default-img="form.img" btn-text="更改app启动图" @onSuccess="getUploadRes($event, 'img_path')" />
        </el-form-item> -->
      </el-card>
      <el-card shadow="hover" class="wrapper">
        <h2>财务配置</h2>
        <el-form-item v-for="item in moneyFormList" :key="item.k" :label="item.label">
          <FormFilter :column="item" @updateKeyValue="updateKeyValue"></FormFilter>
          <span class="des">{{ item.des }}</span>
        </el-form-item>
        <!-- <el-form-item label="最低限额">
          <el-input type="text" placeholder="请输入" v-model="form.no" />
          <span class="des">申请提现最低提余额数</span>
        </el-form-item>
        <el-form-item label="手续费">
          <el-input type="text" placeholder="请输入" v-model="form.no" />
          <span class="des">申请提现时扣除的手续费，？%</span>
        </el-form-item>
        <el-form-item label="游戏钱包剩余金币">
          <el-input type="text" placeholder="请输入" v-model="form.no" />
          <span class="des">游戏钱包必须剩余金币，不能全部下分</span>
        </el-form-item> -->
      </el-card>
      <el-button :loading="btnLoading"
class="btn"
size="large"
type="primary"
@click="batchUpdateAppConfig"
        >保存</el-button
      >
      <!-- <el-card shadow="hover" class="wrapper">
        <h2>基础设置</h2>
        <el-form-item label="AppKey">
          <el-input type="text" placeholder="请输入" v-model="form.no" />
          <span class="des">APP与接口通讯KEY值，必须与APP内KEY值保持一致，否则APP将启动失败</span>
        </el-form-item>
        <el-form-item label="App schemes">
          <el-input type="text" placeholder="请输入" v-model="form.no" />
          <span class="des">支付成功调起App schemes值</span>
        </el-form-item>
        <el-form-item label="启动时间">
          <el-input type="text" placeholder="请输入" v-model="form.no" />
          <span class="des">单位秒钟，启动动画播放时间</span>
        </el-form-item>
        <el-form-item label="账户生成">
          <el-switch v-model="form.delivery" />
          <el-input type="text" placeholder="请输入" v-model="form.no" />
          <span class="des"
            >首次打开APP自动生成账户(统一密码为123456，用户必须同意授权)，
            生成规则：如cms|2，以“|”分隔，其中cms指生成账号前辍，2指随生成2位字母或数字(最低2位最高8位)，0表示不加随字符串</span
          >
        </el-form-item>
        <el-form-item label="后端数据缓存">
          <el-switch v-model="form.delivery" />
          <el-input type="text" placeholder="请输入" v-model="form.no" />
          <span class="des"
            >单位分，可设置时间区间（例如 5,9），节省服务器资源，减少数据库压力，更新资源后如需即时生效请清理缓存</span
          >
        </el-form-item>
        <el-form-item label="前端数据缓存">
          <el-switch v-model="form.delivery" />
          <el-input type="text" placeholder="请输入" v-model="form.no" />
          <span class="des"
            >单位分，可设置时间区间（例如 5,9），节省服务器资源，减少数据库压力，更新资源后如需即时生效请清理缓存</span
          >
        </el-form-item>
        <el-form-item label="搜索间隔时间">
          <el-input type="text" placeholder="请输入" v-model="form.no" />
          <span class="des">单位秒，用户搜索视频间隔时间</span>
        </el-form-item>
      </el-card> -->
      <!-- <el-card shadow="hover" class="wrapper">
        <h2>金币与余额</h2>
        <el-form-item label="提现开关">
          <el-switch v-model="form.delivery" />
          <span class="des">是否开启提现功能</span>
        </el-form-item>
        <el-form-item label="提现汇率">
          <el-input type="text" placeholder="请输入" v-model="form.no" />
          <span class="des">金币提现汇率1:1</span>
        </el-form-item>
        <el-form-item label="金币汇率">
          <el-input type="text" placeholder="请输入" v-model="form.no" />
          <span class="des">充值金币汇率，1元人民币可得多少金币，最低1:1</span>
        </el-form-item>
        <el-form-item label="最低限额">
          <el-input type="text" placeholder="请输入" v-model="form.no" />
          <span class="des">申请提现最低提余额数</span>
        </el-form-item>
        <el-form-item label="充值开关">
          <el-switch v-model="form.delivery" />
          <span class="des">是否开启充值功能，关闭后用户将无法使用充值功能</span>
        </el-form-item>
      </el-card> -->
    </el-form>
  </div>
</template>
<script>
import FormFilter from '/@/components/FormFilter'
import { generalModule, moneyModule } from './config/baseSettingsConfig.js'
import { apiGetAppConfig, apiUpdateAppConfig, apiBatchUpdateAppConfig } from '/@/api/system-manage/index.js'

const moduleName = ['general', 'money']
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
      },
      generalFormList : [],
      moneyFormList : [],
      generalModule,
      moneyModule
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
        const { list } = res.data
        if ( module === moduleName[0] ) {
          this.generalFormList = list
          if ( list.length < this.generalModule.length ) {
            this.initDataBase( module )
          }
        } else {
          this.moneyFormList = list
          if ( list.length < this.moneyModule.length ) {
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
      let list = [...this.generalFormList, ...this.moneyFormList]
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
        targetModule = this.generalModule
      } else {
        targetModule = this.moneyModule
      }

      targetModule.map( block => {
        this.updateAppConfig( block )
        return block
      } )

      if ( module === moduleName[0] ) {
        if ( this.generalFormList.length === 0 ) {
          this.getAppConfig( moduleName[0] )
        }
      } else {
        if ( this.moneyFormList.length === 0 ) {
          this.getAppConfig( moduleName[1] )
        }
      }
    },
    updateKeyValue( obj ) {
      let targetArr = []
      // const targetObj = {}
      if ( obj.m === moduleName[0] ) {
        targetArr = this.generalFormList
      } else {
        targetArr = this.moneyFormList
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
        targetArr = this.generalFormList
        staticArr = this.generalModule
      } else {
        targetArr = this.moneyFormList
        staticArr = this.moneyModule
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
