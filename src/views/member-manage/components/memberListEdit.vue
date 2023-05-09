<template>
  <div>
    <el-form v-loading="loading" ref="form" :model="form" label-position="left" label-width="100px">
      <el-tabs v-model="activeTabName" type="card" @tab-click="handleClick">
        <el-tab-pane label="基础信息" name="basic">
          <el-form-item label="用户账号">
            <el-input type="text" disabled placeholder="" v-model="form.login" />
          </el-form-item>
          <el-form-item label="昵称">
            <el-input type="text" placeholder="请输入" clearable v-model="form.nickname" />
          </el-form-item>
          <el-form-item label="个性签名">
            <el-input type="textarea" placeholder="请输入" clearable v-model="form.signature" />
          </el-form-item>
          <el-form-item class="upload-block" label="头像">
            <upload-img
              :default-img="coverDomain + form.avatar"
              @onSuccess="getUploadRes($event, 'avatar')"
              @beforeUpload="beforeUpload"
              @uploadDone="uploadDone"
            >
            </upload-img>
          </el-form-item>
          <el-form-item label="性别">
            <el-radio-group v-model.number="form.sex">
              <el-radio v-for="item in sexOptions" :key="item.key" :label="item.key">{{ item.display_name }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="地区">
            <el-input type="text" placeholder="" clearable v-model="form.region" />
          </el-form-item>
          <el-form-item label="登录密码">
            <el-input :type="userPasswordType" placeholder="" v-model="form.newPwd">
              <template #suffix>
                <el-icon :size="18"
@click="userPasswordType = 'text'"
v-if="userPasswordType === 'password'"
                  ><View
                /></el-icon>
                <el-icon :size="18" v-else @click="userPasswordType = 'password'"><Hide /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="绑定手机">
            <el-input type="text" placeholder="请输入手机号" v-model="form.phone" />
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="中心钱包" name="centerWallet">
          <el-form-item label="当前余额">
            <el-input type="text" disabled placeholder="" v-model="walletBalance" />
          </el-form-item>
          <el-form-item label="增加">
            <el-input type="text" placeholder="请输入" v-model.number="form.userCoinAdd" />
          </el-form-item>
          <el-form-item label="减少">
            <el-input type="text" placeholder="请输入" v-model.number="form.userCoinDeduction" />
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="游戏钱包" name="gameWallet">
          <el-form-item label="当前余额">
            <el-input type="text" disabled placeholder="" v-model="walletGameBalance" />
          </el-form-item>
          <el-form-item label="增加">
            <el-input type="text" placeholder="请输入" v-model.number="form.gameCoinAdd" />
          </el-form-item>
          <el-form-item label="减少">
            <el-input type="text" placeholder="请输入" v-model.number="form.gameCoinDeduction" />
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="VIP套餐" name="vipPackage">
          <el-form-item label="VIP套餐">
            <el-select
              v-model="vipPackage"
              placeholder="无"
              clearable
              class="filter-item"
              value-key="id"
              @change="vipchange"
            >
              <el-option v-for="item in vipList" :key="item.id" :value="item" :label="item.title"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="套餐有效期">
            <el-radio-group v-model="form.vipDeadline" @change="changeVipDeadline">
              <el-radio v-for="item in playTypeOptions"
:key="item.key"
:label="item.key"
                >{{ item.name }}
                <el-date-picker
                  v-if="item.key === 2"
                  :readonly="form.vipDeadline !== 2"
                  v-model="date"
                  class="filter-item"
                  type="datetime"
                  clearable
                  placeholder="请选择日期"
                  @change="changeVipDeadlineDate"
                />
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-tab-pane>
        <!-- <el-tab-pane label="变更上级" name="adjust">
          <el-form-item label="上级">
            <el-input type="text" placeholder="请输入" v-model="form.no" />
          </el-form-item>
        </el-tab-pane> -->
        <el-tab-pane label="UP主" name="uper">
          <el-form-item label="是否UP主">
            <el-radio-group v-model.number="form.up">
              <el-radio v-for="item in userTypeOptions" :key="item.key" :label="item.key">{{
                item.display_name
              }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="银行卡" name="bankcard">
          <el-form-item label="银行卡信息" v-if="bankList.length > 0">
            <div class="bankinfo" v-for="item in bankList" :key="item.id">
              <div>账号：{{ item.bankAccount }}</div>
              <div>姓名：{{ item.userName }}</div>
              <div>银行：{{ item.bankName }}</div>
            </div>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="提现密码" name="withdraw">
          <el-form-item label="密码">
            <el-input :type="withdrawPasswordType" placeholder="请输入" clearable v-model="form.pwd">
              <template #suffix>
                <el-icon :size="18"
@click="withdrawPasswordType = 'text'"
v-if="withdrawPasswordType === 'password'"
                  ><View
                /></el-icon>
                <el-icon :size="18" v-else @click="withdrawPasswordType = 'password'"><Hide /></el-icon>
              </template>
            </el-input>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </div>
</template>
<script>
import UploadImg from '/@/components/UploadImg'
// import { useUserStore } from '/@/store'
import {
  apiSetMemberUpStatus,
  apiEditMember,
  apiGetMemberBankList,
  apiSetUserCoin,
  apiSetGameCoin,
  apiGetWalletBalance,
  apiGetGameWalletBalance,
  apiAccountchangeUserVip
} from '/@/api/member-manage/memberList.js'
import { getVipList } from '/@/api/finance-manage/vipPackage.js'
import { apiEditWithdrawPwd } from '/@/api/finance-manage/withdrawRecord.js'
import { ElMessage } from 'element-plus'
import { getBJTimezoneMill, dayjs2 } from '/@/utils'
import { imgContainer, coverDomain } from '/@/config/constant.js'

export default {
  components : { UploadImg },
  setup() {
    // const userStore = useUserStore()
    // const { imgContainer, coverDomain } = userStore
    return {
      imgContainer,
      coverDomain
    }
  },
  props : {
    mode : {
      type : String,
      default : 'edit'
    },
    currentRowData : {
      type : Object,
      default : () => ( {} )
    }
  },
  data() {
    return {
      loading : false,
      balance : 99,
      date : 0,
      activeTabName : 'basic',
      withdrawPasswordType : 'password',
      userPasswordType : 'password',
      vipPackage : {
        id : '',
        title : '',
        level : ''
      },
      form : {
        login : '',
        nickname : '',
        sex : 0,
        region : '',
        newPwd : '',
        phone : '',
        avatar : '',
        up : 0,
        userCoinAdd : '',
        userCoinDeduction : '',
        gameCoinAdd : '',
        gameCoinDeduction : '',
        signature : '',
        vipId : '',
        vipLevel : '',
        vipDeadline : '',
        vipEndTime : '',
        pwd : ''
      },
      bankList : [],
      walletBalance : 0,
      walletGameBalance : 0,
      vipList : [],
      playTypeOptions : [
        { key : 1, name : '永久' },
        { key : 2, name : '' }
      ],
      userTypeOptions : [
        { key : 0, display_name : '否' },
        { key : 1, display_name : '是' }
      ],
      sexOptions : [
        { key : 0, display_name : '保密' },
        { key : 2, display_name : '男' },
        { key : 1, display_name : '女' }
      ]
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
      this.form.id = this.currentRowData.id
      this.vipPackage.id = this.currentRowData.vipId
      if ( this.currentRowData.vipEndTime === 0 ) {
        this.form.vipDeadline = 1
        this.form.vipEndTime = 0
      } else {
        this.form.vipDeadline = 2
        // this.date = dayjs2( new Date( this.currentRowData.vipEndTime * 1000 ) )
        this.date = dayjs2( this.currentRowData.vipEndTime * 1000 )
          .tz( 'Asia/Shanghai' )
          .format( 'YYYY-MM-DD HH:mm:ss' )
      }
    }
  },
  methods : {
    getWalletBalance() {
      const params = {
        uid : this.form.id
      }
      apiGetWalletBalance( params ).then( res => {
        if ( res ) {
          this.walletBalance = res.data.balance
        }
      } )
    },
    getGameWalletBalance() {
      const params = {
        uid : this.form.id
      }
      apiGetGameWalletBalance( params ).then( res => {
        if ( res ) {
          this.walletGameBalance = res.data.balance
        }
      } )
    },
    getVipPackageList() {
      const params = {
        pageNo : 1,
        pageSize : 500
      }
      getVipList( params ).then( res => {
        if ( res ) {
          this.vipList = res.data.list
        }
      } )
    },
    getMemberBankList() {
      const params = {
        userId : this.form.id
      }
      apiGetMemberBankList( params ).then( res => {
        if ( res ) {
          this.bankList = res.data.list
        }
      } )
    },
    changeVipDeadline( val ) {
      if ( val === 1 ) {
        this.form.vipEndTime = 0
      } else {
        if ( this.date ) {
          this.form.vipEndTime = getBJTimezoneMill( this.date ) / 1000
        } else {
          this.form.vipEndTime = ''
        }
      }
    },
    changeVipDeadlineDate( val ) {
      if ( val ) {
        this.form.vipEndTime = getBJTimezoneMill( val ) / 1000
      } else {
        this.form.vipEndTime = ''
      }
    },
    vipchange( obj ) {
      if ( obj?.id ) {
        this.form.vipId = obj.id
        this.form.vipLevel = obj.level
      } else {
        this.form.vipId = ''
        this.form.vipLevel = ''
      }
    },
    // 获取上传文件成功返回的数据
    getUploadRes( file, key ) {
      console.log( 'getUploadRes', file, file.name, key )
      this.form[key] = this.imgContainer ? `/${this.imgContainer}/${file.name}` : `/${file.name}`
      this.$emit( 'uploadDone' )
    },
    beforeUpload() {
      this.$emit( 'beforeUpload' )
    },
    uploadDone() {
      this.$emit( 'uploadDone' )
    },
    handleClick( val ) {
      // console.log( 'handleClick', val )
      if ( val.paneName === 'bankcard' ) {
        this.getMemberBankList()
      } else if ( val.paneName === 'centerWallet' || val.paneName === 'gameWallet' ) {
        this.$nextTick( () => {
          this.getWalletBalance()
          this.getGameWalletBalance()
        } )
      } else if ( val.paneName === 'vipPackage' ) {
        this.getVipPackageList()
      }
    },
    submitForm() {
      // 给父组件返回promise对象用于回调
      return new Promise( resolve => {
        this.$refs.form.validate( async valid => {
          if ( !valid ) return resolve( false )
          try {
            const {
              id,
              avatar,
              nickname,
              sex,
              phone,
              region,
              newPwd,
              up,
              signature,
              userCoinAdd,
              userCoinDeduction,
              gameCoinAdd,
              gameCoinDeduction,
              vipId,
              vipLevel,
              vipEndTime,
              pwd
            } = this.form
            if ( this.activeTabName === 'uper' ) {
              const params = {
                id,
                avatar,
                nickname,
                up
              }
              await apiSetMemberUpStatus( { data : params } )
            } else if ( this.activeTabName === 'basic' ) {
              const params = {
                id,
                avatar,
                nickname,
                sex,
                phone,
                region,
                newPwd,
                signature
              }
              await apiEditMember( { data : params } )
            } else if ( this.activeTabName === 'centerWallet' || this.activeTabName === 'gameWallet' ) {
              const params = {
                centerWallet : {
                  id,
                  userCoinAdd,
                  userCoinDeduction
                },
                gameWallet : {
                  id,
                  gameCoinAdd,
                  gameCoinDeduction
                }
              }
              const apis = {
                centerWallet : apiSetUserCoin,
                gameWallet : apiSetGameCoin
              }
              await apis[this.activeTabName]( { data : params[this.activeTabName] } )
            } else if ( this.activeTabName === 'vipPackage' ) {
              const params = {
                uid : id,
                vipId,
                vipLevel,
                vipEndTime
              }
              await apiAccountchangeUserVip( params )
            } else if ( this.activeTabName === 'bankcard' ) {
            } else if ( this.activeTabName === 'withdraw' ) {
              const params = {
                id,
                pwd
              }
              await apiEditWithdrawPwd( params )
            } else {
              ElMessage( {
                message : '无当前tab api',
                type : 'error'
              } )
              return resolve( false )
              // await apiSetMemberUpStatus( this.form )
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
  width: 50%;
}

.bankinfo {
  padding: 10px 20px;
  width: 70%;
  border: 1px solid #333;
}
</style>
