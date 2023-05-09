<template>
  <YuLayout title="">
    <template #body>
      <div class="app-container">
        <el-table v-loading="listLoading" :data="countList" class="head-table" border fit highlight-current-row>
          <el-table-column label="总充值金额" prop="total" align="center" />
          <el-table-column label="总充值笔数" prop="success" align="center" />
          <el-table-column label="今日充值金额" prop="day_total" align="center" />
          <el-table-column label="今日充值笔数" prop="day_success" align="center" />
          <el-table-column label="今日充值成功率" prop="day_success" align="center">
            <template #default="{ row }">
              <span>{{ calcSuccess(row) }}</span>
            </template>
          </el-table-column>
        </el-table>
        <p class="tips">
          <span>提示：未支付的订单将不会统计在上列汇总数据内。</span>
          <el-button type="primary" @click="handleDialogShow()"> 查看通道成功率 </el-button>
        </p>

        <div class="filter-container">
          <div class="filter-item-left">
            <el-form-item label="充值时间" class="filter-item date-item">
              <el-date-picker
                v-model="date"
                type="daterange"
                range-separator="~"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                @change="changeDate"
              />
            </el-form-item>
          </div>
          <div class="filter-item-right">
            <el-select v-model="searchParams.pay_id" placeholder="充值通道" clearable class="filter-item">
              <el-option v-for="item in payList" :key="item.id" :label="item.title" :value="item.id" />
            </el-select>
            <el-select v-model="searchParams.wallet_flag" placeholder="钱包类型" clearable class="filter-item">
              <el-option v-for="item in walletOptions" :key="item.key" :label="item.display_name" :value="item.key" />
            </el-select>
            <el-select v-model="searchParams.state" placeholder="所有状态" clearable class="filter-item">
              <el-option v-for="item in stateOptions" :key="item.key" :label="item.display_name" :value="item.key" />
            </el-select>
            <el-input
              v-model="searchParams.orderNumber"
              placeholder="请输入订单号"
              class="filter-item input-item"
              clearable
              @keyup.enter="handleFilter"
            />
            <el-input
              v-model="searchParams.account"
              placeholder="请输入用户账号"
              class="filter-item input-item"
              clearable
              @keyup.enter="handleFilter"
            />
            <el-input
              v-model="searchParams.user_id"
              placeholder="请输入用户ID"
              class="filter-item input-item"
              clearable
              @keyup.enter="handleFilter"
            />
            <el-button v-wave class="filter-item" type="primary" @click="handleFilter"> 搜索 </el-button>
            <el-button class="filter-item" type="primary">删除超过1小时内未支付的订单</el-button>
            <el-button type="primary"
class="filter-item"
:loading="downloadLoading"
@click="handleDownload"
              >导出</el-button
            >
          </div>
        </div>

        <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
          <el-table-column label="会员账号" prop="account" align="center" />
          <el-table-column label="会员ID" prop="user_id" align="center" />
          <el-table-column label="订单号" prop="order_number" align="center" />
          <el-table-column label="充值类型" prop="wallet_flag" align="center">
            <template #default="{ row }">
              <span>{{ walletFlagFilter(row.wallet_flag) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="充值详情" prop="gold" align="center">
            <template #default="{ row }">
              <span>充值金币{{ row.gold }}个</span>
            </template>
          </el-table-column>
          <el-table-column label="价格" prop="amount" align="center" />
          <el-table-column label="通道" prop="title" align="center" />
          <el-table-column label="首充/续充" prop="is_first" align="center">
            <template #default="{ row }">
              <span v-if="row.state !== 1">{{ row.is_first === 1 ? '首充' : '续充' }}</span>
              <span v-else></span>
            </template>
          </el-table-column>
          <el-table-column label="订单时间" prop="create_at" width="280" align="center">
            <template #default="{ row }">
              <p>下单时间：{{ parseTime(row.create_at) }}</p>
              <p>支付时间：{{ parseTime(row.update_at) }}</p>
            </template>
          </el-table-column>
          <el-table-column label="状态" prop="state" align="center">
            <template #default="{ row }">
              <p v-if="row.state !== 1">{{ mapState[row.state] }}</p>
              <!-- <p>已支付  |   订单已处理</p> -->
              <p v-else>
                <span @click="handleOderDialogShow(row, 3)">未支付</span> |
                <span @click="handleOderDialogShow(row, 2)">确认到账</span>
                <!-- <span @click="editOrder(row, 3)">未支付</span> | <span @click="editOrder(row, 2)">确认到账</span> -->
                <!-- <span @click="editOrder(row, 4)">删除订单</span> -->
              </p>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          background
          small
          class="pagination-center"
          :total="tableParams.total"
          :page-sizes="[10, 15, 20, 50, 100, 200]"
          v-model:currentPage="tableParams.listQuery.page_no"
          v-model:page-size="tableParams.listQuery.page_size"
          layout="prev, pager, next, sizes,jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </template>

    <el-dialog
      width="900px"
      append-to-body
      :close-on-click-modal="false"
      v-model="dialogVisible"
      title="充值成功率详情"
    >
      <component ref="dialog" v-if="dialogVisible" :is="currentComponent" :mode="mode"></component>
      <template #footer>
        <!-- <span class="dialog-footer">
          <el-button :loading="dialogLoading" size="large" type="primary" @click="submit">确认提交</el-button>
        </span> -->
      </template>
    </el-dialog>
    <!-- 确认弹窗 -->
    <el-dialog
      width="400"
      class="prompt-dialog"
      append-to-body
      :close-on-click-modal="false"
      v-model="dialogPromptVisible"
      title="确认信息"
    >
      <div class="content" v-if="orderState === 2">是否变更订单状态，确认到账？</div>
      <div class="content" v-else-if="orderState === 3">是否变更订单状态，支付失败？</div>
      <div class="content" v-else>删除之后无法恢复，真的需要删除吗？</div>

      <template #footer>
        <span class="dialog-footer">
          <el-button :loading="dialogLoading" size="large" type="primary" @click="submitDialog">确认提交</el-button>
          <el-button size="large" type="default" @click="dialogPromptVisible = false">取消</el-button>
        </span>
      </template>
    </el-dialog>
  </YuLayout>
</template>

<script>
import YuLayout from '/@/components/YuLayout'
import { getOrderList, apiCountOrder, apiEditRecharge } from '/@/api/finance-manage/rechargeRecord.js'
import { parseTime, getBJTimezoneMill } from '/@/utils'
import { getPayList } from '/@/api/finance-manage/payway.js'
import PayWayRateCount from './components/PayWayRateCount'

import { tHeader, filterVal } from './components/data.js'

export default {
  components : {
    YuLayout,
    PayWayRateCount
  },
  data() {
    return {
      dialogPromptVisible : false,
      dialogVisible : false,
      dialogLoading : false,
      downloadLoading : false,
      walletOptions : [
        { key : 1, display_name : '中心钱包充值' },
        { key : 2, display_name : '游戏钱包充值' }
      ],
      stateOptions : [
        { key : 1, display_name : '支付中/未支付' },
        { key : 2, display_name : '支付成功' },
        { key : 3, display_name : '支付失败' }
      ],
      flagOptions : [
        { key : 1, display_name : '支付宝' },
        { key : 2, display_name : '微信' },
        { key : 3, display_name : '银行卡' },
        { key : 4, display_name : '手工充值' }
      ],
      currentComponent : 'PayWayRateCount',
      mode : 'add',
      currentRow : {},
      orderState : 0,
      listLoading : false,
      date : '',
      searchParams : {
        min_unix : 0,
        max_unix : 0,
        account : '',
        user_id : '',
        wallet_flag : '',
        state : '',
        pay_id : '',
        orderNumber : ''
      },
      list : [],
      countList : [],
      tableParams : {
        total : 10,
        listQuery : {
          page_no : 1,
          page_size : 15
        },
        data : []
      },
      mapState : {
        1 : '支付中',
        2 : '完成',
        3 : '支付失败'
      },
      payList : []
    }
  },
  computed : {
    dialogWidth() {
      return {
        memberListEdit : '700'
      }[this.currentComponent]
    },
    dialogTitle() {
      return {
        memberListEdit : '编辑用户信息'
      }[this.currentComponent]
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    this.$nextTick( () => {
      this.getPaywayList()
      this.countOrder()
    } )
  },
  methods : {
    async getList() {
      this.listLoading = true

      const searchParams = {}
      for ( const key in this.searchParams ) {
        if ( Object.hasOwnProperty.call( this.searchParams, key ) ) {
          if ( this.searchParams[`${key}`] ) {
            searchParams[`${key}`] = this.searchParams[`${key}`]
          }
        }
      }

      const params = {
        ...this.tableParams.listQuery,
        ...searchParams
      }

      try {
        const res = await getOrderList( params )
        this.tableParams.total = res.data?.count
        this.list = res.data.list
        if ( this.list.length > 0 ) {
          this.list = this.list.map( item => {
            item.checked = false
            item.visible = false
            return item
          } )
        }
        this.listLoading = false
      } catch ( error ) {
        this.listLoading = false
      }
    },
    countOrder() {
      apiCountOrder().then( res => {
        if ( res ) {
          this.countList = [res.data]
        }
      } )
    },
    async getPaywayList() {
      const params = {
        page_no : 1,
        page_size : 500
      }
      try {
        const res = await getPayList( params )
        this.payList = res.data.list
      } catch ( error ) {}
    },
    handleOderDialogShow( row, state ) {
      this.orderState = state
      this.currentRow = row
      this.dialogPromptVisible = true
    },
    submitDialog() {
      if ( this.orderState !== 0 ) {
        this.editOrder( this.currentRow, this.orderState )
      }
    },
    editOrder( row, state ) {
      const params = {
        id : row.order_number,
        state
      }
      apiEditRecharge( params )
        .then( res => {
          this.dialogPromptVisible = false
          if ( res ) {
            this.getList()
            this.countOrder()
          }
        } )
        .catch( () => {
          this.dialogPromptVisible = false
        } )
    },
    changeDate( date ) {
      // console.log( '222', getBJTimezoneMill( date[0] ), getBJTimezoneMill( date[1] ), date[0].getTime() / 1000 )
      if ( date && date.length > 0 ) {
        this.searchParams.min_unix = getBJTimezoneMill( date[0] ) / 1000
        this.searchParams.max_unix = getBJTimezoneMill( date[1] ) / 1000
      } else {
        this.searchParams.min_unix = ''
        this.searchParams.max_unix = ''
      }
      this.handleFilter()
    },
    walletFlagFilter( id ) {
      if ( !id || this.walletOptions.length === 0 ) {
        return ''
      }
      const obj = this.walletOptions.filter( item => {
        return item.key === id
      } )[0]
      return obj ? obj.display_name : ''
    },
    handleDownload() {
      this.downloadLoading = true
      import( '/@/vendor/Export2Excel' )
        .then( excel => {
          const data = this.formatJson( filterVal )
          excel.export_json_to_excel( {
            header : tHeader,
            data,
            filename : '充值记录'
          } )
          this.downloadLoading = false
        } )
        .catch( () => {
          this.downloadLoading = false
        } )
    },
    formatJson( filterVal ) {
      return this.list.map( v =>
        filterVal.map( j => {
          if ( j === 'create_at' || j === 'update_at' ) {
            return parseTime( v[j] )
          } else {
            return v[j]
          }
        } )
      )
    },
    handleDialogShow( type ) {
      // this.currentComponent = type
      this.dialogVisible = true
    },
    handleFilter() {
      this.tableParams.listQuery.page_no = 1
      this.getList()
    },
    handleDelete( index ) {
      this.dialogPromptVisible = true
      this.list.splice( index, 1 )
    },
    handleSizeChange( val ) {
      this.getList()
    },
    handleCurrentChange( val ) {
      this.tableParams.listQuery.page_no = val
      this.getList()
    },
    calcSuccess( row ) {
      let rate = 0
      if ( row.day_count ) {
        rate = ( row.day_success * 1 * 100 ) / row.day_count
      }
      return `${rate.toFixed( 2 )}%`
    },
    submit() {
      this.dialogLoading = true
      this.$refs.dialog
        .submitForm()
        .then( res => {
          this.dialogLoading = false
          if ( res ) {
            this.dialogAdjustVisible = false
            this.getList()
          }
        } )
        .catch( () => {
          this.dialogLoading = false
        } )
    },
    parseTime
  }
}
</script>

<style scoped lang="scss">
.app-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #fff;
}
.filter-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-bottom: 20px;

  .filter-item-left {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }

  .filter-item-right {
    .el-button {
      width: auto;
      // height: 40px;
    }
  }

  .filter-item {
    width: 100px;
    // height: 40px;
    margin-right: 4px;
    margin-left: 0;
    margin-bottom: 4px;
    &:last-child {
      margin-right: 0;
    }
  }
  .input-block {
    width: 380px;
    .el-input {
      width: 140px;
    }
  }
  .input-item {
    width: 180px;
  }
  :deep(.el-date-editor) {
    // height: 40px;
  }
  :deep(.el-select) {
    .el-input {
      // height: 40px;
    }
  }
  .date-item {
    margin-left: 4px;
    width: 300px;
    // height: 40px;
  }
  :deep(.el-form-item__label) {
    height: 40px;
    line-height: 40px;
  }
}

.tips {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 0 30px;
  color: #606266;
  font-size: 14px;
}

.el-table {
  flex: 1;
  & ::v-deep(th.el-table__cell),
  ::v-deep(td.el-table__cell) {
    position: static;
  }
}
.head-table {
  flex: 0 0 80px;
  margin-bottom: 24px;
}
</style>
<style lang="scss">
.prompt-dialog {
  .content {
    font-size: 16px;
    text-align: center;
  }
}
</style>
