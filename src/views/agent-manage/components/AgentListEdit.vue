<template>
  <div class="agent-edit">
    <el-form v-loading="loading" ref="form" :model="form" :rules="rules" label-position="left" label-width="140px">
      <el-form-item label="代理账号" prop="account">
        <el-input type="text" placeholder="请输入" clearable v-model="form.account" />
      </el-form-item>
      <el-form-item label="密码">
        <el-input type="password" placeholder="请输入" clearable v-model="form.passwd" />
      </el-form-item>
      <!-- <el-form-item label="代理级别">
        <el-input type="text" placeholder="请输入" v-model.number="form.level" />
      </el-form-item> -->
      <el-form-item label="代理类型">
        <el-select v-model="form.level" placeholder="请选择" clearable>
          <el-option v-for="item in formatOptions" :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>
      </el-form-item>
      <el-form-item label="上级代理" v-if="form.level === 2">
        <el-select v-model="form.upAgentId" placeholder="请选择" clearable>
          <el-option v-for="item in agentList" :key="item.id" :label="item.account" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item class="profit-block" label="收益比例">
        <!-- <div class="block">
          <el-radio-group v-model="recharge" class="ml-4">
            <el-radio label="recharge" size="large">充值</el-radio>
          </el-radio-group>
          <el-input type="text" placeholder="请输入" v-model="form.no" />
        </div> -->
        <div class="block">
          <div class="item">
            <el-checkbox v-model="form.centerCommission"
:true-label="1"
:false-label="0"
@change="centerCChange"
              >中心钱包充值</el-checkbox
            >
            <el-input
              type="text"
              :disabled="!form.centerCommission"
              placeholder="请输入"
              v-model="form.centerCommissionRate"
            >
              <template #suffix>%</template>
            </el-input>
          </div>
          <div class="item">
            <el-checkbox v-model="form.gameCommission"
:true-label="1"
:false-label="0"
@change="gameCChange"
              >游戏负盈利</el-checkbox
            >
            <el-input
              type="text"
              placeholder="请输入"
              :disabled="!form.gameCommission"
              v-model="form.gameCommissionRate"
            >
              <template #suffix>%</template></el-input
            >
          </div>
          <div class="item">
            <el-checkbox v-model="form.appInstallCommission"
:true-label="1"
:false-label="0"
@change="appCChange"
              >APP安装数</el-checkbox
            >
            <el-input
              type="number"
              placeholder="请输入"
              :disabled="!form.appInstallCommission"
              v-model="form.appInstallCommissionRate"
            >
              <template #suffix>元/个</template></el-input
            >
          </div>
          <div class="item">
            <el-checkbox v-model="form.accessIPCommission"
:true-label="1"
:false-label="0"
@change="appCChange"
              >访问IP数</el-checkbox
            >
            <el-input
              type="number"
              placeholder="请输入"
              :disabled="!form.accessIPCommission"
              v-model="form.accessIPCommissionRate"
            >
              <template #suffix>元/万个</template></el-input
            >
          </div>
        </div>
        <!-- <div class="des">注：充值不能与平台消费和游戏负盈利同时选择</div> -->
      </el-form-item>
      <el-form-item label="首页权限选择">
        <el-checkbox-group v-model="form.homeRights" @change="checkingRights">
          <el-checkbox :label="item.key" v-for="item in homeRightOptions" :key="item.key" name="type">{{
            item.display_name
          }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="每日统计权限选择">
        <el-checkbox-group v-model="form.dayRights" @change="checkingRights">
          <el-checkbox :label="item.key" v-for="item in dayRightOptions" :key="item.key" name="type">{{
            item.display_name
          }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item class="profit-block agent-link" label="网页代理链接">
        <div class="block">
          <el-input type="text" placeholder="请输入" clearable v-model="form.webAgentUrls[0]" />
        </div>
        <div class="block">
          <el-input type="text" placeholder="请输入" clearable v-model="form.webAgentUrls[1]" />
        </div>
      </el-form-item>
      <el-form-item class="profit-block agent-link" label="APP代理链接">
        <div class="block">
          <el-input type="text" placeholder="请输入" clearable v-model="form.appAgentUrls[0]" />
        </div>
        <div class="block">
          <el-input type="text" placeholder="请输入" clearable v-model="form.appAgentUrls[1]" />
        </div>
      </el-form-item>
      <el-form-item class="profit-block agent-link" label="APK下载链接">
        <div class="block">
          <el-input type="text" placeholder="请输入" clearable v-model="form.apkDownloadUrls[0]" />
        </div>
        <div class="block">
          <el-input type="text" placeholder="请输入" clearable v-model="form.apkDownloadUrls[1]" />
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { apiAddAgent, apiEditAgent } from '/@/api/agent-manage/agentList.js'
import { homeRightOptions, dayRightOptions } from './data.js'

export default {
  props : {
    mode : {
      type : String,
      default : 'add'
    },
    currentRowData : {
      type : Object,
      default : () => ( {} )
    },
    agentList : {
      type : Array,
      default : () => []
    }
  },
  data() {
    return {
      loading : false,
      // centerCommission : 0,
      // gameCommission : 0,
      //  appInstallCommission : 0,
      centerHomeRights : [40, 50, 150, 160, 170, 180],
      centerDayRights : [540],
      gameHomeRights : [60, 70, 80, 90, 130, 140],
      gameDayRights : [550],
      appHomeRights : [100, 110, 120, 210, 220],
      appDayRights : [530, 570, 610],
      form : {
        account : '',
        passwd : '',
        level : 1,
        upAgentId : 0,
        centerCommissionRate : '',
        gameCommissionRate : '',
        appInstallCommissionRate : '',
        accessIPCommissionRate : '',
        // homeRights : [10, 20, 30, 100, 110, 120, 190, 200],
        homeRights : [],
        // dayRights : [520, 530, 560, 570, 610, 620],
        dayRights : [],
        webAgentUrls : ['', ''],
        appAgentUrls : ['', ''],
        apkDownloadUrls : ['', ''],
        centerCommission : 0,
        gameCommission : 0,
        appInstallCommission : 0,
        accessIPCommission : 0
      },
      recharge : '',
      formatOptions : [
        { key : 1, display_name : '总代' },
        { key : 2, display_name : '子代' }
      ],
      homeRightOptions,
      dayRightOptions,
      rules : {
        account : [{ required : true, message : '请输入代理账号', trigger : 'blur' }]
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
      if ( !this.currentRowData?.apkDownloadUrls ) {
        // 给apk下载链接赋值
        this.form.apkDownloadUrls = ['', '']
      }
      this.form.id = this.currentRowData.id
      this.form.upAgentId = this.currentRowData.pAgent.id
      this.form.centerCommissionRate = this.currentRowData.centerCommissionRate / 100
      if ( this.form.centerCommissionRate ) {
        this.form.centerCommission = 1
      }
      this.form.gameCommissionRate = this.currentRowData.gameCommissionRate / 100
      if ( this.form.gameCommissionRate ) {
        this.form.gameCommission = 1
      }
      if ( ![undefined, null, ''].includes( this.form.appInstallCommissionRate ) ) {
        this.form.appInstallCommissionRate = this.form.appInstallCommissionRate / 100
        this.form.appInstallCommission = 1
      }
      if ( ![undefined, null, ''].includes( this.form.accessIPCommissionRate ) ) {
        this.form.accessIPCommissionRate = this.form.accessIPCommissionRate / 100
        this.form.accessIPCommission = 1
      }
      this.checkingRights()
    }
  },
  methods : {
    centerCChange( val ) {
      // console.log( '222', val )
      // if ( val === 0 ) {
      //   this.form.homeRights = this.form.homeRights.filter( item => {
      //     return !this.centerHomeRights.includes( item )
      //   } )
      //   this.form.dayRights = this.form.dayRights.filter( item => {
      //     return !this.centerDayRights.includes( item )
      //   } )
      // } else {
      //   this.form.homeRights = [...this.centerHomeRights, ...this.form.homeRights]
      //   this.form.dayRights = [...this.centerDayRights, ...this.form.dayRights]
      // }
    },
    gameCChange( val ) {
      // if ( val === 0 ) {
      //   this.form.homeRights = this.form.homeRights.filter( item => {
      //     return !this.gameHomeRights.includes( item )
      //   } )
      //   this.form.dayRights = this.form.dayRights.filter( item => {
      //     return !this.centerDayRights.includes( item )
      //   } )
      // } else {
      //   this.form.homeRights = [...this.gameHomeRights, ...this.form.homeRights]
      //   this.form.dayRights = [...this.centerDayRights, ...this.form.dayRights]
      // }
    },
    appCChange( val ) {
      // if ( val === 0 ) {
      //   this.form.homeRights = this.form.homeRights.filter( item => {
      //     return !this.appHomeRights.includes( item )
      //   } )
      //   this.form.dayRights = this.form.dayRights.filter( item => {
      //     return !this.appDayRights.includes( item )
      //   } )
      // } else {
      //   this.form.homeRights = [...this.appHomeRights, ...this.form.homeRights]
      //   this.form.dayRights = [...this.appDayRights, ...this.form.dayRights]
      // }
    },
    checkingRights() {
      // if (
      //   this.includes( this.form.homeRights, this.centerHomeRights ) &&
      //   this.includes( this.form.dayRights, this.centerDayRights )
      // ) {
      //   this.centerCommission = 1
      // } else {
      //   this.centerCommission = 0
      // }
      // if (
      //   this.includes( this.form.homeRights, this.gameHomeRights ) &&
      //   this.includes( this.form.dayRights, this.gameDayRights )
      // ) {
      //   this.gameCommission = 1
      // } else {
      //   this.gameCommission = 0
      // }
    },
    includes( arr1, arr2 ) {
      return arr2.every( val => arr1.includes( val ) )
    },
    submitForm() {
      // 给父组件返回promise对象用于回调
      return new Promise( resolve => {
        this.$refs.form.validate( async valid => {
          if ( !valid ) return resolve( false )
          try {
            // if ( !this.commission.includes( '中心钱包充值' ) ) {
            //   this.form.centerCommissionRate = 0
            // }

            // if ( !this.commission.includes( '游戏负盈利' ) ) {
            //   this.form.gameCommissionRate = 0
            // }

            const params = {
              ...this.form,
              centerCommissionRate : this.form.centerCommissionRate * 100,
              gameCommissionRate : this.form.gameCommissionRate * 100,
              appInstallCommissionRate : ( this.form.appInstallCommissionRate / 1 ) * 100,
              accessIPCommissionRate : ( this.form.accessIPCommissionRate / 1 ) * 100
            }
            const api = this.mode === 'add' ? apiAddAgent : apiEditAgent
            // if ( this.mode === 'add' ) {
            //   await apiAddAgent( { data : params } )
            // } else {
            //   await apiEditAgent( { data : params } )
            // }
            await api( { data : params } )
            // console.log( params, api )
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
.agent-edit {
  .el-input {
    width: 50%;
  }

  .el-select {
    width: 50%;
  }

  .des {
    margin-left: 10px;
  }
}

:deep(.profit-block) {
  .el-form-item__content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    .block {
      display: flex;
      align-items: center;
      flex-direction: column;
      margin-bottom: 8px;

      .item {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        margin-bottom: 8px;

        .el-checkbox {
          width: 120px;
        }
      }
    }

    .el-checkbox-group {
      display: flex;
      align-items: center;

      .el-checkbox {
        margin-right: 0;
      }
    }

    .el-input {
      margin-left: 10px;
      margin-right: 10px;
      width: 200px;
    }
  }
}

:deep(.agent-link) {
  .el-form-item__content {
    .el-input {
      width: 300px;
    }
  }
}

:deep(.el-checkbox) {
  .el-checkbox__label {
    background: #e9e9eb;
    margin-left: 5px;
    border-radius: 4px;
    color: #909399;
    padding: 4px 8px;
  }

  .el-checkbox__inner {
    width: 16px;
    height: 16px;
  }
}
</style>
