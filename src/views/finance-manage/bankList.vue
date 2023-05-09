<template>
  <YuLayout title="">
    <template #body>
      <div class="app-container">
        <div class="filter-container">
          <div class="filter-item-left">
            <el-button class="filter-item" type="primary" @click="handleEdit('add')"> 添加 </el-button>
          </div>
        </div>

        <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
          <el-table-column label="ID" prop="id" align="center" />
          <el-table-column label="银行LOGO" prop="icon" width="180" align="center">
            <template #default="{ row }">
              <el-image
                style="width: 100px; height: 100px"
                :src="coverDomain + row.icon"
                loading="lazy"
                :initial-index="4"
                :z-index="3000"
                fit="scale-down"
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
          <el-table-column label="背景图" prop="img" width="180" align="center">
            <template #default="{ row }">
              <el-image
                style="width: 100px; height: 100px"
                :src="coverDomain + row.img"
                loading="lazy"
                :initial-index="4"
                :z-index="3000"
                fit="scale-down"
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
          <el-table-column label="银行名称" prop="title" align="center" />
          <el-table-column label="排序" prop="sort" align="center">
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
                :inactive-value="3"
                @change="handleSetStatus(row)"
                v-model="row.state"
              />
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="create_at" align="center">
            <template #default="{ row }">
              <span>{{ parseTime(row.create_at, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width">
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
          v-model:currentPage="tableParams.listQuery.page_no"
          v-model:page-size="tableParams.listQuery.page_size"
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
      <bank-list-edit
        ref="dialog"
        v-if="dialogVisible"
        :mode="mode"
        :current-row-data="currentRowData"
        @beforeUpload="beforeUpload"
        @uploadDone="uploadDone"
      ></bank-list-edit>
      <template #footer>
        <span class="dialog-footer">
          <el-button :loading="dialogLoading" size="large" type="primary" @click="submit">提交</el-button>
        </span>
      </template>
    </el-dialog>
  </YuLayout>
</template>

<script>
import YuLayout from '/@/components/YuLayout'
import BankListEdit from './components/BankListEdit.vue'
// import { useUserStore } from '/@/store'
import { parseTime } from '/@/utils'
import { getBankList, editBank, delBank } from '/@/api/finance-manage/bankList.js'
import { imgContainer, coverDomain } from '/@/config/constant.js'

export default {
  components : {
    YuLayout,
    BankListEdit
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
      dialogLoading : false,
      switchLoading : false,
      currentComponent : 'Edit',
      mode : 'add',
      currentRowData : {},
      listLoading : false,
      list : [],
      tableParams : {
        total : 10,
        listQuery : {
          page_no : 1,
          page_size : 10
        },
        data : []
      }
    }
  },
  computed : {
    dialogWidth() {
      return {
        add : '50%',
        edit : '50%'
      }[this.mode]
    },
    dialogTitle() {
      return {
        add : '添加银行卡',
        edit : '编辑银行卡'
      }[this.mode]
    }
  },
  created() {
    this.getList()
  },
  methods : {
    async getList() {
      this.listLoading = true

      const params = {
        ...this.tableParams.listQuery
      }

      try {
        const res = await getBankList( params )
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
    priorityFoucs( row ) {
      row.checked = !row.checked
    },
    handlePriorityBlur( row ) {
      const params = {
        ...row
      }
      editBank( params ).then( res => {
        if ( res ) {
          this.getList()
        }
      } )
    },
    async handleSetStatus( row ) {
      const params = {
        ...row
      }
      this.switchLoading = true
      editBank( params )
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
    handleFilter() {
      this.tableParams.listQuery.page_no = 1
      this.getList()
    },
    async handleDelete( row ) {
      this.listLoading = true
      const params = {
        id : row.id
      }
      delBank( params )
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
    handleSizeChange( val ) {
      this.getList()
    },
    handleCurrentChange( val ) {
      this.tableParams.listQuery.page_no = val
      this.getList()
    },
    handleEdit( mode, row = {} ) {
      this.mode = mode
      this.currentRowData = row
      this.dialogVisible = true
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
}

.el-table {
  flex: 1;
  & ::v-deep(th.el-table__cell),
  ::v-deep(td.el-table__cell) {
    position: static;
  }
}
</style>
