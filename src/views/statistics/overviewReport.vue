<template>
  <YuLayout title="">
    <template #body>
      <div class="app-container">
        <div class="filter-container">
          <div class="filter-item-left"></div>
          <div class="filter-item-right">
            <el-button type="primary"
class="filter-item"
:loading="downloadLoading"
@click="handleDownload"
              >导出</el-button
            >
          </div>
        </div>

        <el-table v-loading="listLoading" :data="list" class="head-table" border fit highlight-current-row>
          <el-table-column label="时间" prop="date" min-width="100" align="center" />
          <el-table-column label="新增用户人数" prop="registerNum" align="center" />
          <el-table-column label="活跃用户人数" prop="stayUserNum" align="center" />
          <el-table-column label="充值总金额" prop="totalCharge" align="center"></el-table-column>
          <el-table-column label="单个注册平均充值金额" prop="singleCharge" align="center"> </el-table-column>
          <el-table-column label="中心钱包充值金额" prop="centerCharge" align="center" />
          <el-table-column label="游戏钱包充值金额" prop="gameRecharge" align="center" />
          <el-table-column label="充值总笔数" prop="totalChargeNum" align="center"></el-table-column>
          <el-table-column label="首充笔数" prop="firstRechargeNum" align="center"></el-table-column>
          <el-table-column label="续充笔数" prop="secondRechargeNum" align="center"></el-table-column>
          <el-table-column label="中心钱包充值笔数" prop="centerChargeNum" align="center" />
          <el-table-column label="游戏钱包充值笔数" prop="gameRechargeNum" align="center"></el-table-column>
          <el-table-column label="提现金额" prop="withdrawMoney" align="center" />
          <el-table-column label="提现笔数" prop="withdrawCount" align="center" />
          <el-table-column label="游戏负盈利" prop="gameBidMoney" align="center" />
          <el-table-column label="访问IP数" prop="accessIpNum" align="center" />
        </el-table>

        <el-pagination
          background
          small
          class="pagination-center"
          :total="tableParams.total"
          :page-sizes="[10, 20, 50, 100, 200]"
          v-model:currentPage="tableParams.listQuery.pageNo"
          v-model:page-size="tableParams.listQuery.pageSize"
          layout="prev, pager, next, sizes,jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </template>
    <!-- 确认弹窗 -->
    <el-dialog
      width="400"
      class="prompt-dialog"
      append-to-body
      :close-on-click-modal="false"
      v-model="dialogPromptVisible"
      title="确认信息"
    >
      <div class="content">删除之后无法恢复，真的需要删除吗？</div>
      <template #footer>
        <span class="dialog-footer">
          <el-button :loading="dialogLoading" size="large" type="primary" @click="submitDelete">确认提交</el-button>
          <el-button size="large" type="default" @click="dialogPromptVisible = false">取消</el-button>
        </span>
      </template>
    </el-dialog>
  </YuLayout>
</template>

<script>
import YuLayout from '/@/components/YuLayout'
import { parseTime } from '/@/utils'
import { apiGetAgentDayListOld } from '/@/api/agent-manage/dailyReport.js'
import { tHeader, filterVal } from './components/data.js'

export default {
  components : {
    YuLayout
  },
  data() {
    return {
      dialogPromptVisible : false,
      dialogLoading : false,
      downloadLoading : false,
      walletOptions : [
        { key : 1, display_name : '中心钱包充值' },
        { key : 2, display_name : '游戏钱包充值' }
      ],
      currentComponent : '',
      listLoading : false,
      date : '',
      searchParams : {
        min_unix : '',
        max_unix : '',
        agentId : -1
      },
      list : [],
      tableParams : {
        total : 10,
        listQuery : {
          pageNo : 1,
          pageSize : 10
        },
        data : []
      }
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
  mounted() {},
  methods : {
    async getList() {
      this.listLoading = true

      const searchParams = {}
      for ( const key in this.searchParams ) {
        if ( Object.hasOwnProperty.call( this.searchParams, key ) ) {
          if ( this.searchParams[`${key}`] || this.searchParams[`${key}`] === 0 ) {
            searchParams[`${key}`] = this.searchParams[`${key}`]
          }
        }
      }

      const params = {
        ...this.tableParams.listQuery,
        ...searchParams
      }

      try {
        const res = await apiGetAgentDayListOld( params )
        this.tableParams.total = res.data?.count
        this.list = res.data.list.map( item => {
          item.totalCharge = item.centerCharge * 1 + item.gameRecharge * 1
          item.singleCharge = item.registerNum
            ? Number( ( item.centerCharge * 1 + item.gameRecharge * 1 ) / item.registerNum ).toFixed( 2 )
            : 0
          item.totalChargeNum = item.centerChargeNum * 1 + item.gameRechargeNum * 1
          item.firstRechargeNum = item.centerFirstRechargeNum * 1 + item.gameFirstRechargeNum * 1
          item.secondRechargeNum =
            item.centerChargeNum * 1 +
            item.gameRechargeNum * 1 -
            ( item.centerFirstRechargeNum * 1 + item.gameFirstRechargeNum * 1 )

          return item
        } )
        if ( this.list.length > 0 ) {
          this.list.forEach( item => {
            item.gameBidMoney = Number( item.gameBidMoney ).toFixed( 2 )
            item.gameProfit = Number( item.gameProfit ).toFixed( 2 )
          } )
        }

        this.listLoading = false
      } catch ( error ) {
        this.listLoading = false
      }
    },
    changeDate( date ) {
      // this.searchParams.startTime = date[0].getTime() / 1000
      if ( date && date.length > 0 ) {
        this.searchParams.min_unix = date[0].getTime() / 1000
        this.searchParams.max_unix = date[1].getTime() / 1000
      } else {
        this.searchParams.min_unix = ''
        this.searchParams.max_unix = ''
      }
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
            filename : '每日报表'
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
          if ( j === 'timestamp' ) {
            return parseTime( v[j] )
          } else {
            return v[j]
          }
        } )
      )
    },
    handleDialogShow( type ) {
      this.currentComponent = type
      this.dialogAdjustVisible = true
    },
    handleFilter() {
      this.tableParams.listQuery.pageNo = 1
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
      this.tableParams.listQuery.pageNo = val
      this.getList()
    },
    submitDelete() {
      this.dialogPromptVisible = false
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
  margin-bottom: 20px;

  .filter-item-left {
    display: flex;
    align-items: center;
  }

  .filter-item-right {
    .el-button {
      width: auto;
      // height: 40px;
    }
  }

  .filter-item {
    width: 140px;
    // height: 40px;
    margin-right: 4px;
    margin-left: 0;
    margin-bottom: 0;
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
    width: 200px;
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

.pagination-center {
  margin: 60px 0 30px;
}

.el-table {
  flex: 1;
  & ::v-deep(th.el-table__cell),
  ::v-deep(td.el-table__cell) {
    position: static;
  }
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
