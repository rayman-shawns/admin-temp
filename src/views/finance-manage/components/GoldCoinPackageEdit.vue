<template>
  <div class="vip-edit">
    <el-form v-loading="loading" ref="form" :rules="rules" :model="form" label-position="left" label-width="80px">
      <el-form-item label="套餐名字" prop="title">
        <el-input type="text" clearable placeholder="请输入" v-model.trim="form.title" />
      </el-form-item>
      <el-form-item label="可得金币">
        <el-input type="text" placeholder="请输入" v-model.number="form.gold" />
      </el-form-item>
      <el-form-item label="价格">
        <el-input type="text" placeholder="请输入" v-model.number="form.amount" />
      </el-form-item>
      <el-form-item label="推送" v-if="activePlatForm === 1">
        <el-checkbox-group v-model="form.flag">
          <el-checkbox :label="item.key" v-for="item in devices" :key="item.key" name="type">{{
            item.display_name
          }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="状态">
        <el-switch :active-value="1" :inactive-value="2" v-model="form.state" />
      </el-form-item>
      <el-form-item label="排序">
        <el-input type="text" placeholder="请输入" v-model.number="form.sort" />
        <span class="des">数值越大越靠前</span>
      </el-form-item>
      <el-form-item class="upload-block" label="支付方式">
        <el-radio-group v-model="payChannel">
          <el-radio-button :label="item.key" v-for="item in payChannelOptions" :key="item.key" name="type">{{
            item.display_name
          }}</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="支付ID">
        <el-checkbox-group v-if="payChannel === 'wechat'" v-model="form.wechat">
          <el-checkbox :label="item.id" v-for="item in wechatPaywayOptions" :key="item.id" name="type">{{
            item.title
          }}</el-checkbox>
        </el-checkbox-group>
        <el-checkbox-group v-model="form.ali" v-else-if="payChannel === 'ali'">
          <el-checkbox :label="item.id" v-for="item in aliPaywayOptions" :key="item.id" name="type">{{
            item.title
          }}</el-checkbox>
        </el-checkbox-group>
        <el-checkbox-group v-model="form.bank" v-else-if="payChannel === 'bank'">
          <el-checkbox :label="item.id" v-for="item in bankPaywayOptions" :key="item.id" name="type">{{
            item.title
          }}</el-checkbox>
        </el-checkbox-group>
        <el-checkbox-group v-model="form.bank" v-else>
          <el-checkbox :label="item.id" v-for="item in manulPaywayOptions" :key="item.id" name="type">{{
            item.title
          }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { editGold, addGold } from '/@/api/finance-manage/goldCoinPackage.js'
import { ElMessage } from 'element-plus'
export default {
  props : {
    mode : {
      type : String,
      default : 'add'
    },
    activePlatForm : {
      type : Number,
      default : 1
    },
    currentRowData : {
      type : Object,
      default : () => ( {} )
    },
    paywayOptions : {
      type : Array,
      default : () => []
    }
  },
  data() {
    return {
      loading : false,
      wechatPayIds : [],
      aliPayIds : [],
      bankPayIds : [],
      pushTypes : [],
      payChannel : 'wechat',
      form : {
        title : '',
        gold : '',
        amount : '',
        sort : 0,
        wallet_flag : 1,
        note : '',
        wechat : [],
        ali : [],
        bank : [],
        state : 2,
        flag : [1] // flag:1=h5，2=pc，3=全支持
      },
      payChannelOptions : [
        { key : 'wechat', display_name : '微信' },
        { key : 'ali', display_name : '支付宝' },
        { key : 'bank', display_name : '银行卡' },
        { key : 'manul', display_name : '手工充值' }
      ],
      devices : [
        { key : 1, display_name : '移动端' }
        // { key : 2, display_name : 'PC端' }
      ],
      rules : {
        title : [{ required : true, message : '请输入套餐名字', trigger : 'blur' }]
      },
      isSwitching : false
    }
  },
  computed : {
    // paywayOptionsComputed() {
    //   const payMap = {
    //     'wechat' : 2,
    //     'ali' : 1,
    //     'bank' : 3
    //   }
    //   const payType = payMap[this.payChannel]
    //   let arr = []
    //   if ( this.paywayOptions.length > 0 ) {
    //     arr = this.paywayOptions.filter( ( item ) => {
    //       return item.flag === payType
    //     } )
    //   }
    //   return arr
    // },
    devicePaywayOptions() {
      let arr = []
      if ( this.paywayOptions.length > 0 ) {
        if ( this.form.flag.length === 2 ) {
          arr = this.paywayOptions.filter( item => {
            return item
          } )
        } else if ( this.form.flag.length === 1 ) {
          const device = this.form.flag[0]
          arr = this.paywayOptions.filter( item => {
            return item.device === device * 1 || item.device === 3
          } )
        } else {
          arr = []
        }
      }
      return arr
    },
    wechatPaywayOptions() {
      let arr = []
      if ( this.devicePaywayOptions.length > 0 ) {
        arr = this.devicePaywayOptions.filter( item => {
          return item.flag === 2
        } )
      }
      return arr
    },
    aliPaywayOptions() {
      let arr = []
      if ( this.devicePaywayOptions.length > 0 ) {
        arr = this.devicePaywayOptions.filter( item => {
          return item.flag === 1
        } )
      }
      return arr
    },
    bankPaywayOptions() {
      let arr = []
      if ( this.devicePaywayOptions.length > 0 ) {
        arr = this.devicePaywayOptions.filter( item => {
          return item.flag === 3
        } )
      }
      return arr
    },
    manulPaywayOptions() {
      let arr = []
      if ( this.devicePaywayOptions.length > 0 ) {
        arr = this.devicePaywayOptions.filter( item => {
          return item.flag === 4
        } )
      }
      return arr
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
      // if ( this.form.flag === 3 ) {
      //   this.pushTypes = ['pc', 'h5']
      // } else {
      //   this.pushTypes = this.form.flag === 1 ? ['h5'] : ['pc']
      // }

      this.form.id = this.currentRowData.id
    }
    this.form.wallet_flag = this.activePlatForm
    if ( this.activePlatForm === 2 ) {
      this.form.flag = [1]
    }
  },
  methods : {
    formatForm() {
      const idsStr = this[`${this.payChannel}PayIds`].join( ',' )
      if ( this.pushTypes.length === 2 ) {
        this.form.flag = 3
        this.form[`h5_${this.payChannel}`] = idsStr
        this.form[`pc_${this.payChannel}`] = idsStr
      } else {
        const device = this.pushTypes[0]
        this.form.flag = device === 'h5' ? 1 : 2
        this.form[`${device}_${this.payChannel}`] = idsStr
      }
    },
    submitForm() {
      // 给父组件返回promise对象用于回调
      return new Promise( resolve => {
        this.$refs.form.validate( async valid => {
          if ( !valid ) return resolve( false )
          try {
            // if ( this.wechatPayIds.length === 0 || this.aliPayIds.length === 0 || this.bankPayIds.length === 0 ) {
            //   ElMessage.error( '请选择支付ID' )
            //   resolve( false )
            // }
            if ( this.form.flag.length === 0 ) {
              ElMessage.error( '请选择推送端' )
              return resolve( false )
            }
            // if ( this.payChannel === '' ) {
            //   ElMessage.error( '请选择支付方式' )
            //   resolve( false )
            // }

            if ( this.mode === 'add' ) {
              await addGold( this.form )
            } else {
              await editGold( this.form )
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
.vip-edit {
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

:deep(.upload-block) {
  .el-form-item__content {
    display: flex;
    flex-wrap: wrap;
  }
  .upload {
    display: flex;
    justify-content: space-between;
    width: 47%;
    span {
      width: 100px;
    }
  }
}
</style>
