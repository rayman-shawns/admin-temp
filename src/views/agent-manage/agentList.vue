<template>
  <YuLayout title="">
    <template #body>
      <div class="app-container">
        <div class="filter-container">
          <div class="filter-item-left">
            <el-button class="filter-item" type="primary" @click="handleEdit('add')"> 新增 </el-button>
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
        <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
          <el-table-column label="ID" prop="id" align="center" />
          <el-table-column label="代理账号" prop="account" align="center" />
          <!-- <el-table-column label="代理级别" prop="level" align="center" /> -->
          <el-table-column label="代理类型" prop="level" align="center">
            <template #default="{ row }">
              {{ row.level === 1 ? '总代' : '子代' }}
            </template>
          </el-table-column>
          <el-table-column label="上级代理" prop="pAgent" align="center">
            <template #default="{ row }">
              {{ row.pAgent && row.pAgent.account }}
            </template>
          </el-table-column>
          <el-table-column label="业绩方式" prop="homeRights" align="center">
            <template #default="{ row }">
              <span>{{ row.centerCommissionRate > 0 ? '中心钱包充值' : '' }}</span
              ><br />
              <span>{{ row.gameCommissionRate > 0 ? '游戏负盈利' : '' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="收益比例" prop="centerCommissionRate" align="center">
            <template #default="{ row }">
              <span>{{ row.centerCommissionRate / 100 }}%, </span>
              <span style="margin-left: 10px"> {{ row.gameCommissionRate / 100 }}%</span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="createTime" align="center">
            <template #default="{ row }">
              {{ parseTime(row.createTime) }}
            </template>
          </el-table-column>
          <el-table-column label="状态" prop="enabled" align="center">
            <template #default="{ row }">
              <el-switch
                v-if="row.enabled !== 0"
                :loading="switchLoading"
                :active-value="2"
                :inactive-value="1"
                @change="handleSetStatus(row)"
                v-model="row.enabled"
              />
              <span v-else></span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
            <template #default="{ row, $index }">
              <el-button size="small" type="danger" @click="handleEdit('edit', row)"> 编辑 </el-button>
              <el-popover :visible="row.visible" placement="top" :width="100">
                <p style="margin: 6px 0 10px">确定删除?</p>
                <div>
                  <el-button size="small" text @click="row.visible = false">否</el-button>
                  <el-button size="small" type="warning" @click="handleDelete(row, $index)">是</el-button>
                </div>
                <template #reference>
                  <el-button size="small" type="danger" @click="row.visible = true"> 删除 </el-button>
                </template>
              </el-popover>
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
      <agen-list-edit
        ref="dialog"
        v-if="dialogVisible"
        :mode="mode"
        :agent-list="agentDetailList"
        :current-row-data="currentRowData"
      ></agen-list-edit>
      <template #footer>
        <span class="dialog-footer">
          <el-button :loading="dialogLoading" size="large" type="primary" @click="submit">提交</el-button>
          <el-button size="large" type="primary" @click="dialogVisible = false">取消</el-button>
        </span>
      </template>
    </el-dialog>
  </YuLayout>
</template>

<script>
import YuLayout from '/@/components/YuLayout'
import AgenListEdit from './components/AgentListEdit.vue'
import { apiEditAgent, apiDelAgent, apiGetAgentDetailList } from '/@/api/agent-manage/agentList.js'
import { homeRightOptions, dayRightOptions } from './components/data.js'
import { parseTime } from '/@/utils'

export default {
  components : {
    YuLayout,
    AgenListEdit
  },
  data() {
    return {
      dialogVisible : false,
      dialogLoading : false,
      switchLoading : false,
      currentComponent : 'Edit',
      currentRowData : {},
      mode : 'add',
      listLoading : false,
      list : [],
      searchParams : {
        id : '',
        account : ''
      },
      tableParams : {
        total : 10,
        listQuery : {
          pageNo : 1,
          pageSize : 10
        },
        data : []
      },
      homeRightOptions,
      dayRightOptions,
      agentDetailList : []
    }
  },
  computed : {
    dialogWidth() {
      return {
        add : '60%',
        edit : '60%'
      }[this.mode]
    },
    dialogTitle() {
      return {
        add : '新增代理',
        edit : '编辑代理'
      }[this.mode]
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    // this.$nextTick( () => {
    //   this.getAgentDetailList()
    // } )
  },
  methods : {
    getParams() {
      const searchParams = {}
      for ( const key in this.searchParams ) {
        console.log( 'key', key )
        if ( Object.hasOwnProperty.call( this.searchParams, key ) ) {
          if ( this.searchParams[`${key}`] ) {
            // if ( key === 'id' ) {
            //   searchParams.agentId = this.searchParams[`${key}`] / 1
            // } else {
            //   searchParams[`${key}`] = this.searchParams[`${key}`] / 1
            // }
            searchParams[`${key}`] = key === 'id' ? this.searchParams[`${key}`] / 1 : this.searchParams[`${key}`]
          }
        }
      }
      return searchParams
    },
    async getList() {
      const searchParams = this.getParams()
      // for ( const key in this.searchParams ) {
      //   console.log( 'key', key )
      //   if ( Object.hasOwnProperty.call( this.searchParams, key ) ) {
      //     if ( this.searchParams[`${key}`] ) {
      //       // if ( !this.searchParams.filter ) {
      //       //   this.searchParams.filter = {}
      //       // }
      //       searchParams[`${key}`] = key === 'id' ? this.searchParams[`${key}`] / 1 : this.searchParams[`${key}`]
      //     }
      //   }
      // }

      this.listLoading = true

      const params = {
        ...this.tableParams.listQuery,
        filter : searchParams
      }

      try {
        const res = await apiGetAgentDetailList( params )
        this.tableParams.total = res.data?.count
        this.list = res.data.list
        if ( this.list.length > 0 ) {
          this.list = this.list.map( item => {
            item.checked = false
            item.visible = false
            item = { pAgent : item.pAgent, ...item.agent }
            return item
          } )
        }
        this.$nextTick( () => {
          this.getAgentDetailList()
        } )
        this.listLoading = false
      } catch ( error ) {
        this.listLoading = false
      }
    },
    async getAgentDetailList() {
      // const _params = this.getParams()
      const params = {
        pageNo : 1,
        pageSize : 1000,
        filter : {
          // ..._params,
          level : 1
        }
      }
      try {
        const res = await apiGetAgentDetailList( params )
        this.agentDetailList = res.data.list
        if ( this.agentDetailList.length > 0 ) {
          this.agentDetailList = this.agentDetailList.map( item => {
            item = { pAgent : item.pAgent, ...item.agent }
            return item
          } )
        }
      } catch ( error ) {}
    },
    handleFilter() {
      this.tableParams.listQuery.pageNo = 1
      this.getList()
    },
    handleDelete( row ) {
      if ( !row.id ) {
        return
      }

      const params = {
        ids : []
      }
      params.ids.push( row.id )

      apiDelAgent( params ).then( res => {
        if ( res ) {
          this.getList()
        }
      } )
    },
    async handleSetStatus( row ) {
      const params = {
        data : { ...row }
      }
      this.switchLoading = true
      apiEditAgent( params )
        .then( res => {
          this.switchLoading = false
          if ( res ) {
            this.getList()
          }
        } )
        .catch( err => {
          console.log( err )
          this.switchLoading = false
        } )
    },
    homeRightsFilter( c_id ) {
      if ( !c_id || c_id.length === 0 || this.homeRightOptions.length === 0 ) {
        return ''
      }
      const arr = this.homeRightOptions.filter( item => {
        return c_id.includes( item.key )
      } )
      let str = ''
      if ( arr && arr.length > 0 ) {
        str = arr
          .map( item => {
            return item.display_name
          } )
          .join( ',' )
      }
      return str
    },
    dayRightsFilter( c_id ) {
      if ( !c_id || c_id.length === 0 || this.dayRightOptions.length === 0 ) {
        return ''
      }
      const arr = this.dayRightOptions.filter( item => {
        return c_id.includes( item.key )
      } )
      let str = ''
      if ( arr && arr.length > 0 ) {
        str = arr
          .map( item => {
            return item.display_name
          } )
          .join( ',' )
      }
      return str
    },
    handleSizeChange( val ) {
      this.getList()
    },
    handleCurrentChange( val ) {
      this.tableParams.listQuery.pageNo = val
      this.getList()
    },
    handleEdit( mode = 'edit', row = {} ) {
      this.mode = mode
      this.currentRowData = row
      this.dialogVisible = true
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

  .filter-item {
    width: 100px;
    margin-right: 4px;
    margin-left: 0;
    &:last-child {
      margin-right: 0;
    }
  }
  .input-item {
    width: 160px;
  }
  .input-label {
    color: var(--el-text-color-regular);
    font-size: 14px;
    margin-left: 10px;
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
