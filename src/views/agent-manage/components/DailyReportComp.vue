<template>
  <YuLayout title="">
    <template #body>
      <div class="app-container">
        <div class="filter-container">
          <div class="filter-item-left">
            <el-form-item label="时间筛选" class="filter-item date-item">
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
            <span class="input-label">代理ID:</span>
            <el-input
              v-model="searchParams.id"
              placeholder="请输入代理ID"
              class="filter-item input-item"
              clearable
              @keyup.enter="handleFilter"
            />
            <span class="input-label">代理账号:</span>
            <el-input
              v-model="searchParams.account"
              placeholder="请输入代理账号"
              class="filter-item input-item"
              clearable
              @keyup.enter="handleFilter"
            />
            <el-button v-wave class="filter-item" type="primary" @click="handleFilter"> 搜索 </el-button>
          </div>
        </div>
        <el-table v-loading="listLoading" :data="list" class="head-table" border fit highlight-current-row>
          <el-table-column label="时间" prop="date" align="center" />
          <el-table-column label="代理账号" prop="account" align="center">
            <template #default="{ row }">
              <span>{{ row.account ? row.account : '平台' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="代理ID" prop="agentId" align="center" />
          <el-table-column label="访问IP数" prop="accessIp" align="center" />
          <el-table-column label="注册用户人数" prop="userCount" align="center" />
          <el-table-column label="APP安装数" prop="androidDownloadCount" align="center">
            <template #default="{ row }">
              <span>{{ row.androidDownloadCount * 1 + row.iosDownloadCount * 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="视频充值金额" prop="centerRecharge" align="center">
            <template #default="{ row }">{{ Number(row.centerRecharge).toFixed(2) }}</template>
          </el-table-column>
          <el-table-column label="游戏充值金额" prop="gameRecharge" align="center">
            <template #default="{ row }">{{ Number(row.gameRecharge).toFixed(2) }}</template>
          </el-table-column>
          <!-- <el-table-column label="中心钱包充值金额1" prop="centerCharge" align="center">
            <template #default="{ row }">{{ Number(row.centerCharge).toFixed(2) }}</template>
          </el-table-column> -->
          <el-table-column label="游戏负盈利" prop="gameBidCoin" align="center">
            <template #default="{ row }">{{ Number(row.gameBidCoin).toFixed(2) }}</template>
          </el-table-column>
          <el-table-column label="业绩类型" prop="centerRate" align="center">
            <template #default="{ row }">
              <span>{{ row.centerRechargeRate > 0 ? '中心钱包充值' : '' }}</span
              ><br />
              <span>{{ row.gameProfitRate > 0 ? '游戏负盈利' : '' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="业绩" prop="centerCharge" align="center">
            <template #default="{ row }">
              <span>{{ row.centerRechargeRate > 0 ? Number(row.centerRecharge).toFixed(2) : '' }}</span
              ><br />
              <span>{{ row.gameProfitRate > 0 ? Number(row.gameBidCoin).toFixed(2) : '' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="收益比例" prop="centerRate" align="center">
            <template #default="{ row }">
              <span>{{ row.centerRechargeRate > 0 ? `${row.centerRechargeRate / 100}%` : '' }}</span
              ><br />
              <span>{{ row.gameProfitRate > 0 ? `${row.gameProfitRate / 100}%` : '' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="收益" prop="centerProfit" align="center">
            <template #default="{ row }">
              <span>{{ row.centerRechargeRate > 0 ? Number(row.centerProfitCoin).toFixed(2) : '' }}</span
              ><br />
              <span>{{ row.gameProfitRate > 0 ? Number(row.gameProfitCoin).toFixed(2) : '' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="首充笔数" prop="centerFirstRechargeCount" align="center">
            <template #default="{ row }">
              <span>{{ row.centerFirstRechargeCount * 1 + row.gameFirstRechargeCount * 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column label="续充笔数" prop="centerRechargeCount" align="center">
            <template #default="{ row }">
              <span>{{
                row.centerRechargeCount * 1 +
                row.gameRechargeCount * 1 -
                (row.centerFirstRechargeCount * 1 + row.gameFirstRechargeCount * 1)
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="提现金额" prop="gameWithdrawCoin" align="center">
            <template #default="{ row }">{{ Number(row.gameWithdrawCoin).toFixed(2) }}</template>
          </el-table-column>
          <el-table-column label="留存业绩" prop="stayUserCoin" align="center">
            <template #default="{ row }">
              <span>{{ Number(row.stayUserCoin).toFixed(2) }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="访问IP数(新)?" prop="accessIpNum" align="center">
            <template #default="{ row }">
              <span v-if="agentList[row.agentId] && agentList[row.agentId][row.date]">{{
                agentList[row.agentId][row.date]
              }}</span>
              <span v-else> 无数据...</span>
            </template>
          </el-table-column> -->
          <el-table-column label="子代理业绩" prop="subSales" align="center" v-if="showSubAgent">
            <template #default="{ row }">
              <el-button type="primary" link size="small" @click="$emit('sub', row)">{{ row.subSales }}</el-button>
            </template>
          </el-table-column>
          <el-table-column label="子代理收益" prop="subProfit" align="center" v-if="showSubAgent">
            <template #default="{ row }">
              <el-button type="primary" link size="small" @click="$emit('sub', row)">{{ row.subProfit }}</el-button>
            </template>
          </el-table-column>
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
import { parseTime, getBJTimezoneMill } from '/@/utils'
import { apiGetAgentDayList, apiGetAgentDayListSub } from '/@/api/agent-manage/dailyReport.js'

export default {
  props : {
    showSubAgent : {
      type : Boolean,
      default : true
    },
    parentAgentId : {
      type : Number,
      default : 0
    }
  },
  components : {
    YuLayout
  },
  data() {
    return {
      dialogPromptVisible : false,
      dialogLoading : false,
      walletOptions : [
        { key : 1, display_name : '中心钱包充值' },
        { key : 2, display_name : '游戏钱包充值' }
      ],
      key : '',
      currentComponent : '',
      listLoading : false,
      date : '',
      searchParams : {
        id : '',
        acount : '',
        min_unix : '',
        max_unix : '',
        agentId : 0
      },
      agentList : {},
      list : [],
      countList : [],
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
    this.key = this.getNowFormatDate()
    this.getAgentTest()
  },
  mounted() {},
  methods : {
    getNowFormatDate( t ) {
      const date = new Date( t )
      const year = date.getFullYear() // 获取完整的年份(4位)
      let month = date.getMonth() + 1 // 获取当前月份(0-11,0代表1月)
      let strDate = date.getDate() // 获取当前日(1-31)
      if ( month < 10 ) month = `0${month}` // 如果月份是个位数，在前面补0
      if ( strDate < 10 ) strDate = `0${strDate}` // 如果日是个位数，在前面补0

      return `${year}-${month}-${strDate}`
    },
    getAgentTest( time ) {
      this.getList()
      // apiTestAgent( { time } )
      //   .then( res => {
      //     this.agentList = res
      //   } )
      //   .finally( () => {
      //     this.getList()
      //   } )
    },
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
      if ( searchParams.id ) {
        // 通过agentId筛选
        searchParams.agentId = searchParams.id
      }

      if ( !this.showSubAgent ) {
        searchParams.parentAgentId = this.parentAgentId
      }

      const params = {
        ...this.tableParams.listQuery,
        ...searchParams
      }

      try {
        const api = !this.showSubAgent ? apiGetAgentDayListSub : apiGetAgentDayList
        const res = await api( params )
        this.tableParams.total = res.data?.count
        this.list = res.data.list
        if ( this.list.length > 0 ) {
          this.list.forEach( item => {
            item.gameBidCoin = Number( item.gameBidCoin ).toFixed( 2 )
            item.gameProfit = Number( item.gameProfit ).toFixed( 2 )
          } )
        }

        this.listLoading = false
      } catch ( error ) {
        this.listLoading = false
      }
    },
    changeDate( date ) {
      this.getAgentTest( this.getNowFormatDate( date[0] ) )
      // this.searchParams.startTime = date[0].getTime() / 1000
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
    width: 100px;
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
  .input-label {
    color: var(--el-text-color-regular);
    font-size: 14px;
    margin-left: 10px;
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
