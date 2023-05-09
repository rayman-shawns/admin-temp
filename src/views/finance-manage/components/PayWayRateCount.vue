<template>
  <YuLayout title="">
    <template #body>
      <div class="app-container">
        <div class="filter-container">
          <div class="filter-item-left">
            <el-form-item label="" class="filter-item date-item">
              <el-date-picker
                v-model="searchParams.date"
                class="filter-item"
                type="datetime"
                value-format="YYYY-MM-DD"
                clearable
                placeholder="请选择日期"
                @change="handleFilter"
              />
            </el-form-item>
          </div>
          <div class="filter-item-right">
            <el-select
              v-model.number="searchParams.pay_id"
              placeholder="所有通道"
              clearable
              class="filter-item"
              @change="handleFilter"
            >
              <el-option v-for="item in payList" :key="item.id" :label="item.title" :value="item.id" />
            </el-select>
          </div>
        </div>

        <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
          <el-table-column label="日期" prop="unix" align="center">
            <template #default="{ row }">
              {{ parseTime(row.unix) }}
            </template>
          </el-table-column>
          <el-table-column label="通道名称" prop="Title" align="center"> </el-table-column>
          <el-table-column label="成功率" prop="count" align="center">
            <template #default="{ row }">
              <span>{{ calcSuccess(row) }}</span>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          background
          small
          class="pagination-center"
          :total="tableParams.total"
          :page-sizes="[10, 20, 50, 100, 200]"
          v-model:currentPage="tableParams.listQuery.page_no"
          v-model:page-size="tableParams.listQuery.page_size"
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
import { apiPayCountOrder } from '/@/api/finance-manage/rechargeRecord.js'
import { getPayList } from '/@/api/finance-manage/payway.js'
import { parseTime } from '/@/utils'

export default {
  components : {
    YuLayout
  },
  data() {
    return {
      dialogVisible : false,
      dialogLoading : false,
      walletOptions : [
        { key : 1, display_name : '中心钱包充值' },
        { key : 2, display_name : '游戏钱包充值' }
      ],
      mode : 'add',
      listLoading : false,
      searchParams : {
        date : '',
        pay_id : ''
      },
      list : [],
      tableParams : {
        total : 10,
        listQuery : {
          page_no : 1,
          page_size : 10
        },
        data : []
      },
      payList : []
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    this.$nextTick( () => {
      this.getPaywayList()
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
        const res = await apiPayCountOrder( params )
        this.tableParams.total = res.data?.count
        this.list = res.data.list

        this.listLoading = false
      } catch ( error ) {
        this.listLoading = false
      }
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
    handleFilter() {
      this.tableParams.listQuery.page_no = 1
      this.getList()
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
      if ( row.count ) {
        rate = ( row.success * 1 * 100 ) / row.count
      }
      return `${rate}%`
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
  }
  :deep(.el-form-item__label) {
    height: 40px;
    line-height: 40px;
  }
}

.pagination-center {
  margin: 30px 0 0;
}

.el-table {
  flex: 1;
  & ::v-deep(th.el-table__cell),
  ::v-deep(td.el-table__cell) {
    position: static;
  }
}
</style>
