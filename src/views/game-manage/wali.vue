<template>
  <YuLayout title="">
    <template #body>
      <div class="app-container">
        <div class="filter-container">
          <div class="filter-item-left">
            <el-button class="filter-item" @click="handleDialogShow('VipConvertEdit')"> 启用 </el-button>
            <el-button class="filter-item" @click="handleDialogShow('VipConvertEdit')"> 停用 </el-button>
            <el-button class="filter-item" type="primary" @click="handleDialogShow('WaliEdit', 'add')">
              添加
            </el-button>
          </div>
        </div>

        <el-table
          v-loading="listLoading"
          :data="list"
          border
          fit
          highlight-current-row
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column label="游戏名称" prop="title" align="center" />
          <el-table-column label="游戏ID" prop="id" align="center" />
          <el-table-column label="游戏封面" prop="icon" width="180" align="center">
            <template #default="{ row }">
              <el-image
                style="width: 100px; height: 100px"
                :src="coverDomain + row.icon"
                loading="lazy"
                :initial-index="4"
                :z-index="3000"
                fit="cover"
              >
                <template #placeholder>
                  <el-icon><Loading size="16" /></el-icon>
                </template>
                <template #error>
                  <span>无图</span>
                </template>
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="标签名" prop="tag" align="center" />
          <el-table-column label="排序（倒序）" prop="sort" align="center">
            <template #default="{ row }">
              <el-input v-if="row.checked" v-model.number="row.sort" @blur="handlePriorityBlur(row)" />
              <span v-else @click="priorityFoucs(row)">{{ row.sort }}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" prop="state" align="center">
            <template #default="{ row }">
              <el-switch
                :loading="switchLoading"
                :active-value="1"
                :inactive-value="2"
                @change="handleSetStatus(row)"
                v-model="row.state"
              />
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="create_at" align="center">
            <template #default="{ row }">
              <span>{{ parseTime(row.create_at) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
            <template #default="{ row, $index }">
              <el-button size="small" type="danger" @click="handleDialogShow('WaliEdit', 'edit', row)">
                编辑
              </el-button>
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
      <component
        ref="dialog"
        v-if="dialogVisible"
        :is="currentComponent"
        :mode="mode"
        :current-row-data="currentRowData"
        :game-config-list="gameConfigList"
        @beforeUpload="beforeUpload"
        @uploadDone="uploadDone"
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
import { parseTime } from '/@/utils'
import YuLayout from '/@/components/YuLayout'
import WaliEdit from './components/WaliEdit.vue'
// import { useUserStore } from '/@/store'
import { apiGetGameList, apiEditGame, apiGetGameConfigList, delGame } from '/@/api/game-manage/wali.js'
import { imgContainer, coverDomain } from '/@/config/constant.js'
export default {
  components : {
    YuLayout,
    WaliEdit
  },
  setup() {
    // const userStore = useUserStore()
    // const { imgContainer, coverDomain } = userStore
    return {
      imgContainer,
      coverDomain
    }
  },
  data() {
    return {
      dialogVisible : false,
      dialogPromptVisible : false,
      dialogLoading : false,
      switchLoading : false,
      currentComponent : 'WaliEdit',
      mode : '',
      currentRowData : {},
      multipleSelection : [],
      listLoading : false,
      searchParams : {
        time : '',
        size : ''
      },
      list : [],
      tableParams : {
        total : 40,
        listQuery : {
          pageNo : 1,
          pageSize : 10
        },
        data : []
      },
      gameConfigList : []
    }
  },
  computed : {
    dialogWidth() {
      return {
        WaliEdit : '700'
      }[this.currentComponent]
    },
    dialogTitle() {
      return {
        add : '游戏添加',
        edit : '游戏编辑'
      }[this.mode]
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    this.$nextTick( () => {
      this.getGameConfigList()
    } )
  },
  methods : {
    async getList() {
      const searchParams = {}
      for ( const key in this.searchParams ) {
        if ( Object.hasOwnProperty.call( this.searchParams, key ) ) {
          if ( this.searchParams[`${key}`] ) {
            searchParams[`${key}`] = this.searchParams.filter[`${key}`]
          }
        }
      }

      this.listLoading = true

      const params = {
        ...this.tableParams.listQuery,
        filter : searchParams
      }

      try {
        const res = await apiGetGameList( params )
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
    async getGameConfigList() {
      const params = {
        plat : '',
        pageNo : 1,
        pageSize : 1000
      }
      try {
        const res = await apiGetGameConfigList( params )
        this.gameConfigList = res.data.list
      } catch ( error ) {}
    },
    priorityFoucs( row ) {
      row.checked = !row.checked
    },
    handlePriorityBlur( row ) {
      const params = {
        ...row
      }
      apiEditGame( params ).then( res => {
        if ( res ) {
          this.getList()
          this.$emit( 'updateOptions' )
        }
      } )
    },
    async handleSetStatus( row ) {
      const params = {
        ...row
      }
      this.switchLoading = true
      apiEditGame( params )
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
    handleDialogShow( type, mode = 'add', row ) {
      this.mode = mode
      this.currentRowData = row
      this.currentComponent = type
      this.dialogVisible = true
    },
    handlePreview() {},
    handleDelete( row ) {
      this.listLoading = true
      const params = {
        id : row.id
      }
      delGame( params )
        .then( res => {
          this.listLoading = false
          if ( res ) {
            this.getList()
          }
        } )
        .catch( () => {
          this.listLoading = false
        } )
    },
    handleSelectionChange( val ) {
      console.log( 'handleSelectionChange', val )
      this.multipleSelection = val
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
    beforeUpload() {
      this.dialogLoading = true
    },
    uploadDone() {
      this.dialogLoading = false
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
      width: auto;
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
  .input-item {
    width: 160px;
    height: 36px;
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
</style>
<style lang="scss">
.prompt-dialog {
  .content {
    font-size: 16px;
    text-align: center;
  }
}
</style>
