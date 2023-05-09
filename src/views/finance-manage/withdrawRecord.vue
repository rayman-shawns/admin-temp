<template>
  <YuLayout title="">
    <template #body>
      <div class="app-container">
        <el-table v-loading="listLoading" :data="countList" class="head-table" border fit highlight-current-row>
          <el-table-column label="总提现金额" prop="total" align="center" />
          <el-table-column label="总提现笔数" prop="count" align="center" />
          <el-table-column label="今日提现金额" prop="day_total" align="center" />
          <el-table-column label="今日提现笔数" prop="day_count" align="center" />
        </el-table>
        <p class="tips">提示：未支付的订单将不会统计在下列汇总数据内。</p>

        <div class="filter-container">
          <div class="filter-item-left">
            <!-- <el-form-item label="提现金额" class="filter-item input-block">
              <el-input v-model="searchParams.keyword" placeholder="最小值" clearable @keyup.enter="handleFilter" />
              &nbsp;~&nbsp;
              <el-input v-model="searchParams.keyword" placeholder="最大值" clearable @keyup.enter="handleFilter" />
            </el-form-item> -->
            <el-form-item label="提现时间" class="filter-item date-item">
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
            <el-select v-model="searchParams.state" placeholder="所有状态" clearable class="filter-item">
              <el-option v-for="item in stateOptions" :key="item.key" :label="item.display_name" :value="item.key" />
            </el-select>
            <el-input
              v-model="searchParams.account"
              placeholder="请输入用户账号"
              class="filter-item input-item"
              clearable
              @keyup.enter="handleFilter"
            />
            <el-button v-wave class="filter-item" type="primary" @click="handleFilter"> 搜索 </el-button>
            <!-- <el-button class="filter-item" type="primary" @click="dialogPromptVisible = true">
                删除超过1小时内未支付的订单
              </el-button> -->
          </div>
        </div>

        <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
          <el-table-column label="会员账号" prop="account" align="center" />
          <el-table-column label="提现信息" prop="bank_title" align="left">
            <template #default="{ row }">
              <p>账号：{{ row.card_number }}</p>
              <p>姓名：{{ row.card_name }}</p>
              <p>银行：{{ row.bank_title }}</p>
            </template>
          </el-table-column>
          <el-table-column label="提现金额" prop="amount" align="center">
            <template #default="{ row }">
              <p>到账金额：{{ row.real_amount }}</p>
              <p>扣除余额：{{ row.amount * 1 - row.real_amount * 1 }}</p>
            </template>
          </el-table-column>
          <el-table-column label="提现方式" prop="flag" align="center">
            <template #default="{ row }">
              {{ row.flag === 1 ? '线上' : '' }}
            </template>
          </el-table-column>
          <el-table-column label="首提/续提" prop="is_first" align="center">
            <template #default="{ row }">
              <span v-if="row.state !== 1"> {{ row.is_first === 1 ? '首提' : '续提' }}</span>
              <span v-else></span>
            </template>
          </el-table-column>
          <el-table-column label="申请时间/处理时间" prop="create_at" align="left">
            <template #default="{ row }">
              <p>申请：{{ parseTime(row.create_at) }}</p>
              <p>处理：{{ parseTime(row.update_at) }}</p>
            </template>
          </el-table-column>
          <el-table-column label="状态" prop="state" align="center">
            <template #default="{ row }">
              <p v-if="row.state === 2">已打款</p>
              <div v-else-if="row.state === 3">
                <p>已拒绝</p>
                <p>理由：{{ row.note }}</p>
              </div>
              <p v-else>
                <span @click="handleDialogShow(2, row)">确认打款</span>
                | <span @click="handleDialogShow(3, row)">拒绝申请</span> |
                <el-popover :visible="row.visible" placement="top" :width="100">
                  <p style="margin: 6px 0 10px">确定删除?</p>
                  <div>
                    <el-button size="small" text @click="row.visible = false">否</el-button>
                    <el-button size="small" type="warning" @click="handleDelete(row)">是</el-button>
                  </div>
                  <template #reference>
                    <span @click="row.visible = true">删除</span>
                  </template>
                </el-popover>
              </p>
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
    <!-- 确认弹窗 -->
    <el-dialog
      width="500"
      class="prompt-dialog"
      append-to-body
      :close-on-click-modal="false"
      v-model="dialogPromptVisible"
      :title="dialogTitle"
    >
      <el-form v-if="form.state === 3" :model="form" label-position="left" label-width="90px">
        <el-form-item label="拒绝缘由：">
          <el-input type="textarea" :rows="3" placeholder="请输入" v-model="form.note" />
        </el-form-item>
      </el-form>
      <div v-if="form.state === 2" class="content">是否确认打款？</div>
      <template #footer>
        <span class="dialog-footer">
          <el-button size="large" type="default" @click="dialogPromptVisible = false">取消</el-button>
          <el-button :loading="dialogLoading" size="large" type="primary" @click="submit">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </YuLayout>
</template>

<script>
import YuLayout from '/@/components/YuLayout'
import {
  getWithdrawList,
  apiCountWithdraw,
  apiDelWithdraw,
  apiEditWithdraw
} from '/@/api/finance-manage/withdrawRecord.js'
import { parseTime, getBJTimezoneMill } from '/@/utils'

export default {
  components : {
    YuLayout
  },
  data() {
    return {
      dialogPromptVisible : false,
      dialogLoading : false,
      stateOptions : [
        { key : 2, display_name : '已打款' },
        { key : 1, display_name : '未处理' },
        { key : 3, display_name : '已拒绝' }
      ],
      currentComponent : '',
      listLoading : false,
      date : '',
      form : {
        state : '',
        note : '',
        id : ''
      },
      searchParams : {
        min_unix : 0,
        max_unix : 0,
        account : '',
        state : ''
      },
      list : [],
      countList : [],
      tableParams : {
        total : 10,
        listQuery : {
          page_no : 1,
          page_size : 10
        },
        data : []
      },
      mapState : {
        1 : '未处理',
        2 : '已打款',
        3 : '已拒绝'
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
        2 : '确认打款',
        3 : '拒绝申请'
      }[this.form.state * 1]
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    this.$nextTick( () => {
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
        const res = await getWithdrawList( params )
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
      apiCountWithdraw().then( res => {
        if ( res ) {
          this.countList = [res.data]
        }
      } )
    },
    changeDate( date ) {
      if ( date && date.length > 0 ) {
        this.searchParams.min_unix = getBJTimezoneMill( date[0] ) / 1000
        this.searchParams.max_unix = getBJTimezoneMill( date[1] ) / 1000
      } else {
        this.searchParams.min_unix = ''
        this.searchParams.max_unix = ''
      }
      this.handleFilter()
    },
    handleDialogShow( state, row ) {
      this.form.state = state
      this.form.id = row.id
      this.dialogPromptVisible = true
    },
    handleFilter() {
      this.tableParams.listQuery.page_no = 1
      this.getList()
    },
    handleDelete( row ) {
      if ( !row.id ) {
        return
      }

      const params = {
        id : row.id
      }

      apiDelWithdraw( params ).then( res => {
        if ( res ) {
          this.getList()
        }
      } )
    },
    handleSizeChange( val ) {
      this.getList()
    },
    handleCurrentChange( val ) {
      this.tableParams.listQuery.page_no = val
      this.getList()
    },
    submit() {
      this.dialogLoading = true
      apiEditWithdraw( this.form )
        .then( res => {
          this.dialogLoading = false
          if ( res ) {
            this.getList()
            this.countOrder()
            this.dialogPromptVisible = false
          }
        } )
        .catch( () => {
          this.dialogLoading = false
        } )
    },
    submit2() {
      this.dialogLoading = true
      this.$refs.dialog
        .submitForm()
        .then( res => {
          this.dialogLoading = false
          this.dialogAdjustVisible = false
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
  margin: 0 0 20px;
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
