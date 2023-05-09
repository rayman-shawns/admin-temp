<template>
  <YuLayout title="">
    <template #body>
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="中心钱包金币" :name="1"></el-tab-pane>
        <el-tab-pane label="游戏钱包金币" :name="2"></el-tab-pane>
      </el-tabs>
      <div class="app-container">
        <div class="filter-container">
          <div class="filter-item-left">
            <el-select
              v-model="searchParams.changeType"
              placeholder="账变类型"
              clearable
              class="filter-item"
              @change="handleFilter"
            >
              <el-option
                v-for="item in changeTypeOptions"
                :key="item.key"
                :label="item.display_name"
                :value="item.key"
              />
            </el-select>
            <el-form-item label="账变时间" class="filter-item date-item">
              <el-date-picker
                v-model="date"
                type="daterange"
                range-separator="~"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                @change="changeDate"
              />
            </el-form-item>
            <el-form-item label="当前余额（金币）：" class="filter-item">
              <span v-if="activeName === 1">{{ walletBalance }}</span>
              <span v-else>{{ walletGameBalance }}</span>
            </el-form-item>
          </div>
          <div class="filter-item-right">
            <div class="user-block">
              <el-avatar :size="40" :src="coverDomain + currentRowData.avatar" />
              <div class="info">
                <p>账号：{{ currentRowData.login }}</p>
                <p>昵称：{{ currentRowData.nickname }}</p>
                <p>手机号：{{ currentRowData.phone }}</p>
              </div>
            </div>
          </div>
        </div>

        <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
          <el-table-column label="账变前余额（金币）" prop="before" align="center" />
          <el-table-column label="账变内容" prop="note" align="center" />
          <el-table-column label="账变金额（金币）" prop="coinValue" align="center" />
          <el-table-column label="账变后余额（金币）" prop="after" align="center" />
          <el-table-column label="账变时间" prop="updateTime" align="center">
            <template #default="{ row }">
              {{ parseTime(row.updateTime) }}
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
  </YuLayout>
</template>

<script>
import YuLayout from '/@/components/YuLayout'
import { apiGetWalletChangeLog, apiGetGameWalletChangeLog } from '/@/api/account-record/index.js'
import { apiGetWalletBalance, apiGetGameWalletBalance } from '/@/api/member-manage/memberList.js'
import { parseTime, getBJTimezoneMill } from '/@/utils'
// import { useUserStore } from '/@/store'
import { imgContainer, coverDomain } from '/@/config/constant.js'

export default {
  setup() {
    // const userStore = useUserStore()
    // const { imgContainer, coverDomain } = userStore
    return {
      imgContainer,
      coverDomain
    }
  },
  components : {
    YuLayout
  },
  props : {
    currentRowData : {
      type : Object,
      default : () => ( {} )
    }
  },
  data() {
    return {
      listLoading : false,
      date : '',
      activeName : 1,
      walletBalance : 0,
      walletGameBalance : 0,
      searchParams : {
        uid : '',
        changeType : ''
      },
      list : [],
      tableParams : {
        total : 10,
        listQuery : {
          pageNo : 1,
          pageSize : 10
        },
        data : []
      },
      changeTypeOptions : [
        {
          key : 1,
          display_name : '购买视频'
        },
        {
          key : 2,
          display_name : '购买vip套餐'
        },
        {
          key : 3,
          display_name : '充值'
        },
        {
          key : 4,
          display_name : '客服补单'
        },
        {
          key : 5,
          display_name : '客服内部充值或扣费'
        }
      ]
    }
  },
  created() {
    if ( this.currentRowData?.id ) {
      this.searchParams.uid = this.currentRowData.id
      this.getList()
    }
  },
  mounted() {
    if ( this.currentRowData?.id ) {
      this.$nextTick( () => {
        this.getWalletBalance()
        this.getGameWalletBalance()
      } )
    }
  },
  methods : {
    async getList() {
      const searchParams = {}
      for ( const key in this.searchParams ) {
        if ( Object.hasOwnProperty.call( this.searchParams, key ) ) {
          if ( this.searchParams[`${key}`] ) {
            searchParams[`${key}`] = this.searchParams[`${key}`]
          }
        }
      }

      this.listLoading = true

      const params = {
        ...this.tableParams.listQuery,
        ...searchParams
      }

      try {
        let res = {}
        if ( this.activeName === 1 ) {
          res = await apiGetWalletChangeLog( params )
        } else {
          res = await apiGetGameWalletChangeLog( params )
        }
        this.tableParams.total = res.data?.count
        this.list = res.data.list

        this.listLoading = false
      } catch ( error ) {
        this.listLoading = false
      }
    },
    getWalletBalance() {
      const params = {
        uid : this.currentRowData.id
      }
      apiGetWalletBalance( params ).then( res => {
        if ( res ) {
          this.walletBalance = res.data.balance
        }
      } )
    },
    getGameWalletBalance() {
      const params = {
        uid : this.currentRowData.id
      }
      apiGetGameWalletBalance( params ).then( res => {
        if ( res ) {
          this.walletGameBalance = res.data.balance
        }
      } )
    },
    handleClick( val ) {
      this.activeName = val.paneName
      this.tableParams.listQuery.pageNo = 1
      this.getList()
    },
    handleFilter() {
      this.tableParams.listQuery.pageNo = 1
      this.getList()
    },
    changeDate( date ) {
      // this.searchParams.startTime = date[0].getTime() / 1000
      if ( date && date.length > 0 ) {
        this.searchParams.startTime = getBJTimezoneMill( date[0] ) / 1000
        this.searchParams.endTime = getBJTimezoneMill( date[1] ) / 1000
      } else {
        this.searchParams.startTime = ''
        this.searchParams.endTime = ''
      }
    },
    handleDialogShow( type ) {
      this.dialogVisible = true
    },
    handleSizeChange( val ) {
      this.getList()
    },
    handleCurrentChange( val ) {
      this.tableParams.listQuery.pageNo = val
      this.getList()
    },
    submit() {
      this.dialogLoading = true
      this.$refs.dialog
        .submitForm()
        .then( res => {
          this.dialogLoading = false
          this.dialogVisible = false
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

  .filter-item {
    min-width: 180px;
    height: 46px;
    margin-right: 4px;
    margin-left: 0;
    margin-bottom: 0;
    &:last-child {
      margin-right: 0;
    }
  }
  :deep(.el-date-editor) {
    height: 46px;
  }
  :deep(.el-select) {
    width: 180px;
    .el-input {
      height: 46px;
    }
  }
  .date-item {
    margin-left: 4px;
    margin-right: 80px;
    width: 300px;
    height: 46px;
  }
  :deep(.el-form-item__label) {
    height: 46px;
    line-height: 46px;
  }
  .user-block {
    display: flex;
    align-items: center;
    padding: 4px 24px;
    border: 1px solid #ccc;
    .info {
      margin-left: 10px;
      font-size: 14px;
    }
  }
}

.pagination-center {
  margin: 30px 0 0px;
}

.el-table {
  flex: 1;
  & ::v-deep(th.el-table__cell),
  ::v-deep(td.el-table__cell) {
    position: static;
  }
}
</style>
