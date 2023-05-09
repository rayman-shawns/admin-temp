<template>
  <div class="topic-edit">
    <el-form v-loading="loading" ref="form" :rules="rules" :model="form" label-position="left" label-width="100px">
      <p class="title">
        注意事项：1. 订单号内容以‘orderSn’通配。2. 订单金额以‘money’通配。3. IP地址以‘ip’通配。4.
        商品名称地址以‘goodName’通配。5. 如需支付方式代码以‘payCode’通配。6. 异步回调地址以‘backFun’通配。7.
        ‘payId’匹配本系统支付方式ID。
      </p>
      <el-form-item label="支付名称" prop="title">
        <el-input clearable type="text" placeholder="请输入" v-model.trim="form.title" />
        <div class="des">支付公司中文名称</div>
      </el-form-item>
      <el-form-item label="支付方式">
        <el-select v-model.number="form.flag" placeholder="支付宝" class="filter-item">
          <el-option v-for="item in flagOptions" :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>
      </el-form-item>
      <el-form-item label="支付标识">
        <el-input clearable type="text" placeholder="请输入" v-model="form.code" />
        <div class="des">支付标识以‘ | ’符分隔，支持公司英文标识|支持方式标识</div>
      </el-form-item>
      <el-form-item label="通道编码">
        <el-input clearable type="text" placeholder="请输入" v-model="form.channel" />
        <div class="des">支付通道独有的通道编码</div>
      </el-form-item>
      <el-form-item label="支付网关">
        <el-input clearable type="text" placeholder="请输入" v-model="form.create_url" />
        <div class="des">支付请求网关地址，必须包含http://或https://</div>
      </el-form-item>
      <el-form-item label="支持终端">
        <el-select v-model.number="form.device" placeholder="移动端" class="filter-item">
          <el-option v-for="item in deviceOptions" :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>
      </el-form-item>
      <el-form-item label="测试额度">
        <el-input clearable type="text" placeholder="请输入" v-model.number="form.amount" />
      </el-form-item>
      <!-- <el-form-item label="请求方式">
        <el-radio-group v-model="form.vip">
          <el-radio label="POST" />
          <el-radio label="GET" />
        </el-radio-group>
      </el-form-item> -->
      <el-divider content-position="left">支付请求参数</el-divider>
      <!-- <el-form-item label="mchld">
        <el-input type="text" placeholder="请输入" v-model="form.no" />
        <div class="des"><el-icon class="delete"><DeleteFilled /></el-icon> 支付中心分配的商户号</div>
      </el-form-item>
      <el-form-item label="productId">
        <el-input type="text" placeholder="请输入" v-model="form.no" />
        <div class="des"><el-icon class="delete"><DeleteFilled /></el-icon> 支付产品ID</div>
      </el-form-item>
      <el-form-item label="appId">
        <el-input type="text" placeholder="请输入" v-model="form.no" />
        <div class="des"><el-icon class="delete"><DeleteFilled /></el-icon> 商户应用ID</div>
      </el-form-item>
      <el-form-item label="mchKey">
        <el-input type="text" placeholder="请输入" v-model="form.no" />
        <div class="des"><el-icon class="delete"><DeleteFilled /></el-icon> 商户密钥</div>
      </el-form-item> -->
      <el-form-item v-for="(item, index) in templateList" :key="item.key + index" :label="item.mark">
        <el-input type="text" clearable placeholder="请输入" v-model="form[item.key]" />
        <div class="des">
          <el-icon class="delete" @click="delTemplate(index)"><DeleteFilled /></el-icon>
        </div>
      </el-form-item>
      <el-button v-if="others.length > 0">其他参数</el-button>
      <!-- <el-button @click="addTemplate"
        ><el-icon><Plus /></el-icon>其他参数</el-button
      >
      <div class="template-block">
        <el-input type="text" placeholder="字段（唯一的）" v-model="templateInput.key" />
        <el-input type="text" placeholder="字段内容" v-model="templateInput.value" />
        <el-input type="text" placeholder="参数说明" v-model="templateInput.mark" />
      </div> -->
      <el-form-item v-for="(item, index) in others" :key="item.key + index" :label="item.key">
        <el-input type="text" clearable placeholder="请输入" v-model="item.value" />
        <div class="des">
          <el-icon class="delete" @click="delTemplate(index)"><DeleteFilled /></el-icon>{{ item.mark }}
        </div>
      </el-form-item>
      <el-button @click="addTemplate"
        ><el-icon><Plus /></el-icon>自定义参数</el-button
      >
      <div class="template-block">
        <el-input type="text" clearable placeholder="字段（唯一的）" v-model="templateInput.key" />
        <el-input type="text" clearable placeholder="字段内容" v-model="templateInput.value" />
        <el-input type="text" clearable placeholder="参数说明" v-model="templateInput.mark" />
      </div>
      <!-- <el-form-item label="签名方式">
        <el-input type="text" placeholder="请求参数MD5加密或自定义函数，没有请留空" v-model="form.no" />
        <div class="des">
          普通签名格式：fxsign-money-ordersn-time(其中‘fxsign’为请求参数，time为当前时间戳，其它参数必须在上列参数里)，为空则不需要加密串
          自定义函数格式：sign-dataToKey，其中sign签名参数，dataToKey自定义函数名（需要去方法库文件添加，返回签名字符串）
        </div>
      </el-form-item> -->
      <!-- <el-divider content-position="left">请求返回参数</el-divider>
      <el-form-item label="参数返回类型">
        <el-radio-group v-model="form.vip">
          <el-radio label="JSON" />
          <el-radio label="HTML" />
        </el-radio-group>
        <div class="des">返回参数类型JSON或HTML(第三方支付API无返回参数说明，请选择HTML)</div>
      </el-form-item>
      <el-form-item label="返回状态参数">
        <el-input type="text" placeholder="请输入" v-model="form.no" />
        <div class="des">以-分隔，如：status-1-0(其中status为返回字段，1为返回正常代码，0为错误代码)</div>
      </el-form-item>
      <el-form-item label="返回信息参数">
        <el-input type="text" placeholder="请输入" v-model="form.no" />
        <div class="des">如：error(在请求成功或失败后返回参数)</div>
      </el-form-item>
      <el-form-item label="请求成功返回">
        <el-input type="text" placeholder="请输入" v-model="form.no" />
        <div class="des">payurl(正常状态下返回支付跳转路径，跳转到该路径即可支付)</div>
      </el-form-item>
      <el-divider content-position="left">请求返回参数</el-divider>
      <el-form-item label="商户订单号">
        <el-input type="text" placeholder="请输入" v-model="form.no" />
        <div class="des">如：fxddh(参数相关请参考第三方支付平台来设置)</div>
      </el-form-item>
      <el-form-item label="订单金额">
        <el-input type="text" placeholder="请输入" v-model="form.no" />
        <div class="des">如：fxfee(参数相关请参考第三方支付平台来设置)</div>
      </el-form-item>
      <el-form-item label="订单支付状态">
        <el-input type="text" placeholder="请输入" v-model="form.no" />
        <div class="des">以-分隔，如：fxstatus-1(其中fxstatus为返回字段，1为支付成功)</div>
      </el-form-item>
      <el-form-item label="异步处理成功">
        <el-input type="text" placeholder="请输入" v-model="form.no" />
        <div class="des">如：success(参数相关请参考第三方支付平台来设置)</div>
      </el-form-item> -->
    </el-form>
  </div>
</template>
<script>
import { editPay, addPay } from '/@/api/finance-manage/payway.js'
import { ElMessage } from 'element-plus'

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
      form : {
        title : '',
        flag : 2,
        device : 1,
        state : 1,
        code : '',
        channel : '',
        create_url : '',
        order_url : '',
        call_back : '',
        md5_key : '',
        public_key : '',
        private_key : '',
        app_id : '',
        mer : '',
        others : '',
        amount : 0,
        sort : 0
      },
      templateInput : {
        key : '',
        value : '',
        mark : ''
      },
      flagOptions : [
        { key : 2, display_name : '微信' },
        { key : 1, display_name : '支付宝' },
        { key : 3, display_name : '银行卡' },
        { key : 4, display_name : '手工充值' }
      ],
      deviceOptions : [
        { key : 1, display_name : '移动端' }
        // { key : 2, display_name : 'PC端' },
        // { key : 3, display_name : '移动端和PC端' }
      ],
      templateList : [
        // {
        //   key : 'create_url',
        //   value : '',
        //   mark : '订单创建地址'
        // },
        {
          key : 'order_url',
          value : '',
          mark : '订单查询地址'
        },
        {
          key : 'call_back',
          value : '',
          mark : '异步回调地址'
        },
        {
          key : 'mer',
          value : '',
          mark : '商户号'
        },
        {
          key : 'md5_key',
          value : '',
          mark : 'MD5秘钥'
        },
        {
          key : 'public_key',
          value : '',
          mark : '公钥'
        },
        {
          key : 'private_key',
          value : '',
          mark : '私钥'
        },
        {
          key : 'app_id',
          value : '',
          mark : 'appid'
        }
      ],
      others : [],
      rules : {
        title : [{ required : true, message : '请输入支付名字', trigger : 'blur' }]
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
      this.form.id = this.currentRowData.id
      if ( this.currentRowData.others.indexOf( '{' ) !== -1 ) {
        this.others = []
        const othersObj = JSON.parse( this.currentRowData.others )
        for ( const key in othersObj ) {
          if ( Object.hasOwnProperty.call( othersObj, key ) ) {
            const val = othersObj[key]
            this.others.push( { key, value : val, mark : '' } )
          }
        }
      }
    }
  },
  methods : {
    addTemplate() {
      if ( !this.templateInput.key ) {
        ElMessage.error( '请填写字段' )
        return
      }
      this.others.push( this.templateInput )

      this.templateInput = {
        key : '',
        value : '',
        mark : ''
      }
    },
    delTemplate( index ) {
      this.others.splice( index, 1 )
    },
    submitForm() {
      // 给父组件返回promise对象用于回调
      return new Promise( resolve => {
        this.$refs.form.validate( async valid => {
          if ( !valid ) return resolve( false )
          try {
            if ( this.others.length > 0 ) {
              const others = {}
              this.others.forEach( item => {
                others[item.key] = item.value
              } )
              this.form.others = JSON.stringify( others )
            }

            if ( this.mode === 'add' ) {
              await addPay( this.form )
            } else {
              await editPay( this.form )
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
.topic-edit {
  .el-input {
    width: 40%;
  }
  .el-select {
    width: 40%;
  }
  .delete {
    margin-right: 10px;
    cursor: pointer;
    font-size: 20px;
  }
}

.title {
  margin-bottom: 20px;
  font-size: 18px;
}

.des {
  margin-left: 8px;
  display: flex;
  align-items: center;
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
.template-block {
  margin-top: 10px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  .el-input {
    width: 200px;
  }
}
</style>
