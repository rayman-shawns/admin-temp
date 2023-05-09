<template>
  <YuLayout title="">
    <template #body>
      <div class="app-container">
        <div class="filter-container">
          <div class="filter-item-left">
            <el-button class="filter-item" type="text"> 今日（9999） </el-button>
            <el-button class="filter-item" type="text"> 全部（99999） </el-button>
            <el-button class="filter-item" type="primary" @click="dialogPromptVisible = true">
              删除三天前的足迹
            </el-button>
          </div>
          <div class="filter-item-right">
            <el-input
              v-model="searchParams.uid"
              placeholder="请输入用户ID"
              class="filter-item input-item"
              clearable
              @keyup.enter="handleFilter"
            />
            <el-button v-wave class="filter-item" :loading="listLoading" type="primary" @click="handleFilter">
              搜索
            </el-button>
          </div>
        </div>

        <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
          <el-table-column label="视频标题" prop="videoName" align="center" />
          <el-table-column label="用户ID" prop="uid" align="center" />
          <el-table-column label="IP地址" prop="iPAddr" align="center" />
          <el-table-column label="设备ID" prop="deviceNo" align="center" />
          <el-table-column label="观看时间" prop="playTime" align="center">
            <template #default="{ row }">
              {{ parseTime(row.playTime) }}
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
import { apiGetUserPlayRecord, apiDelUserPlayRecord3Day } from '/@/api/member-manage/userRecord.js'
import { parseTime } from '/@/utils'

export default {
  components : {
    YuLayout
  },
  data() {
    return {
      dialogPromptVisible : false,
      dialogLoading : false,
      multipleSelection : [],
      listLoading : false,
      searchParams : {
        time : '',
        size : '',
        format : '',
        uid : ''
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
        const res = await apiGetUserPlayRecord( params )
        this.tableParams.total = res.data?.count
        this.list = res.data.list

        this.listLoading = false
      } catch ( error ) {
        this.listLoading = false
      }
    },
    handleDialogShow( type ) {
      this.currentComponent = type
      this.dialogAdjustVisible = true
    },
    handlePreview() {},
    handleFilter() {
      this.tableParams.listQuery.pageNo = 1
      this.getList()
    },
    handleDelete( index ) {
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
      this.dialogLoading = true
      apiDelUserPlayRecord3Day()
        .then( res => {
          if ( res ) {
            this.dialogPromptVisible = false
            this.getList()
          }
          this.dialogLoading = false
        } )
        .catch( () => {
          this.dialogLoading = false
        } )
    },
    submit() {
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
      width: 140px;
      height: 46px;
    }
  }

  .filter-item {
    width: 140px;
    height: 46px;
    margin-right: 4px;
    margin-left: 0;
    margin-bottom: 0;
    &:last-child {
      margin-right: 0;
    }
  }
  .input-item {
    width: 180px;
    height: 46px;
  }
  :deep(.el-form-item__label) {
    height: 46px;
    line-height: 46px;
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
