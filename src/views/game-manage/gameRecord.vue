<template>
  <YuLayout title="">
    <template #body>
      <div class="app-container">
        <el-table v-loading="listLoading" :data="countList" class="head-table" border fit highlight-current-row>
          <el-table-column label="总下注金币" prop="totalBet" align="center">
            <template #default="{ row }">
              <span>{{ Number(row.totalBet).toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="当前筛选下注金币" prop="bet" align="center">
            <template #default="{ row }">
              <span>{{ Number(row.bet).toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="总返奖金币" prop="totalRebate" align="center">
            <template #default="{ row }">
              <span>{{ Number(row.totalRebate).toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="当前筛选总返奖金币" prop="rebate" align="center">
            <template #default="{ row }">
              <span>{{ Number(row.rebate).toFixed(2) }}</span>
            </template>
          </el-table-column>
        </el-table>

        <div class="filter-container">
          <div class="filter-item-left"></div>
          <div class="filter-item-right">
            <el-select v-model="date" placeholder="全部" clearable class="filter-item" @change="dateFilter">
              <el-option v-for="item in dateOptions" :key="item.key" :label="item.display_name" :value="item.key" />
            </el-select>
            <el-select
              v-model="searchParams.gameId"
              placeholder="全部"
              clearable
              class="filter-item"
              @change="handleFilter"
            >
              <el-option v-for="item in gameList" :key="item.id" :label="item.title" :value="item.id" />
            </el-select>
            <el-input
              v-model="searchParams.account"
              placeholder="按平台账号搜索"
              class="filter-item input-item"
              clearable
              @keyup.enter="handleFilter"
            />
            <el-button class="filter-item" type="primary" @click="handleFilter"> 搜索 </el-button>
          </div>
        </div>

        <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
          <el-table-column label="会员账号" prop="account" align="center" />
          <el-table-column label="会员ID" prop="user_id" align="center" />
          <el-table-column label="游戏ID（玩家游戏平台的ID）" prop="code" align="center" />
          <el-table-column label="游戏名称" prop="title" align="center" />
          <el-table-column label="投注单号" prop="game_id" align="center" />
          <el-table-column label="下注金额" prop="bet" align="center" />
          <el-table-column label="返奖金额" prop="profit" align="center" />
          <el-table-column label="结算时间" prop="record_time" align="center">
            <template #default="{ row }">
              <span>{{ parseTime(row.game_time) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="100" class-name="small-padding fixed-width">
            <template #default="{ row }">
              <el-button size="small" type="danger" @click="handleDialogShow('GameRecordEdit', 'edit', row)">
                详情
              </el-button>
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
    <!-- 批量调整 -->
    <el-dialog
      class="component-dialog"
      :width="dialogWidth"
      append-to-body
      :close-on-click-modal="false"
      v-model="dialogVisible"
      :title="dialogTitle"
    >
      <component
        ref="dialog"
        v-if="dialogVisible"
        :is="currentComponent"
        :mode="mode"
        :current-row-data="currentRowData"
      ></component>
      <template #footer>
        <span class="dialog-footer">
          <el-button :loading="dialogLoading" size="large" type="primary" @click="submit">提交</el-button>
        </span>
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
      <div class="content">删除之后无法恢复，真的需要删除吗？</div>
      <template #footer>
        <span class="dialog-footer">
          <el-button v-loading="dialogLoading" size="large" type="primary" @click="submitDelete">确认提交</el-button>
          <el-button size="large" type="default" @click="dialogPromptVisible = false">取消</el-button>
        </span>
      </template>
    </el-dialog>
  </YuLayout>
</template>

<script>
import { parseTime, getLatestDay, getLastDay, getToday, getBJTimezoneMill } from '/@/utils'
import YuLayout from '/@/components/YuLayout'
import GameRecordEdit from './components/GameRecordEdit.vue'
import { apiGetGameBetList } from '/@/api/game-manage/gameRecord.js'
import { apiGetGameList } from '/@/api/game-manage/wali.js'

export default {
  components : {
    YuLayout,
    GameRecordEdit
  },
  data() {
    return {
      dialogVisible : false,
      dialogPromptVisible : false,
      dialogLoading : false,
      dateOptions : [
        { key : 'today', display_name : '今日' },
        { key : 'yesterday', display_name : '昨日' },
        { key : 'three', display_name : '三日内' }
      ],
      tagOptions : [
        { key : '10', display_name : '世界杯' },
        { key : '30', display_name : '捕鱼' },
        { key : '30', display_name : '斗地主' }
      ],
      mode : '',
      currentComponent : 'GameRecordEdit',
      currentRowData : {},
      listLoading : false,
      date : '',
      searchParams : {
        account : '',
        gameId : '',
        startUnix : '',
        endUnix : ''
      },
      list : [],
      countList : [
        {
          bet : 0,
          totalBet : 0,
          totalRebate : 0,
          rebate : 0
        }
      ],
      gameList : [],
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
        GameRecordEdit : '注单详情'
      }[this.currentComponent]
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    this.$nextTick( () => {
      this.getGameList()
    } )
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
        const res = await apiGetGameBetList( params )
        const { count, list, pageNo, ...statistics } = res.data
        this.tableParams.total = count
        this.list = list
        if ( pageNo === 1 ) {
          this.countList = [statistics]
        }
        this.listLoading = false
      } catch ( error ) {
        this.listLoading = false
      }
    },
    async getGameList() {
      const params = {
        pageNo : 1,
        pageSize : 500
      }
      try {
        const res = await apiGetGameList( params )
        this.gameList = res.data.list
      } catch ( error ) {}
    },
    handleDialogShow( type, mode = 'add', row ) {
      window.open( row.detail_url, '_blank' )
      // this.mode = mode
      // this.currentRowData = row
      // this.currentComponent = type
      // this.dialogVisible = true
    },
    dateFilter( val ) {
      const day = getToday()
      const yesterday = getLastDay()
      const three = getLatestDay( new Date(), 2 )

      switch ( val ) {
        case 'today':
          this.searchParams.startUnix = getBJTimezoneMill( day[0] ) / 1000
          this.searchParams.endUnix = getBJTimezoneMill( day[1] ) / 1000
          break
        case 'yesterday':
          this.searchParams.startUnix = getBJTimezoneMill( yesterday[0] ) / 1000
          this.searchParams.endUnix = getBJTimezoneMill( yesterday[1] ) / 1000
          break
        case 'three':
          this.searchParams.startUnix = getBJTimezoneMill( three[0] ) / 1000
          this.searchParams.endUnix = getBJTimezoneMill( three[1] ) / 1000
          break
        default:
          this.searchParams.startUnix = ''
          this.searchParams.endUnix = ''
          break
      }
      this.handleFilter()
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
            this.dialogVisible = false
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
      width: 120px;
      height: 36px;
    }
  }

  .filter-item {
    width: 100px;
    height: 36px;
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
    height: 36px;
  }
  :deep(.el-select) {
    .el-input {
      height: 36px;
    }
  }
  .date-item {
    margin-left: 4px;
    width: 300px;
    height: 36px;
  }
  :deep(.el-form-item__label) {
    height: 36px;
    line-height: 36px;
  }
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
  margin-bottom: 20px;
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
