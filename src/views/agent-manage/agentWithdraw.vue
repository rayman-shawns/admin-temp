<template>
  <YuLayout title="">
    <template #body>
      <div class="app-container">
        <div class="filter-container">
          <div class="filter-item-left">
            <el-form-item label="申请时间" class="filter-item date-item">
              <el-date-picker
                v-model="searchParams.date"
                type="daterange"
                range-separator="~"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
              />
            </el-form-item>
          </div>
          <div class="filter-item-right">
            <el-select v-model="searchParams.time" placeholder="所有状态" clearable class="filter-item">
              <el-option v-for="item in tagOptions" :key="item.key" :label="item.display_name" :value="item.key" />
            </el-select>
            <el-input
              v-model="searchParams.keyword"
              placeholder="请输入关键字搜索"
              class="filter-item input-item"
              clearable
              @keyup.enter="handleFilter"
            />
            <el-button class="filter-item" type="primary"> 搜索 </el-button>
          </div>
        </div>

        <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
          <el-table-column label="代理账号" prop="id" align="center" />
          <el-table-column label="申请金额" prop="id" align="center" />
          <el-table-column label="地址" prop="id" align="center" />
          <el-table-column label="申请时间/处理时间" prop="id" align="center" />
          <el-table-column label="状态" prop="id" align="center" />
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template #default="{ row, $index }">
              <el-button size="small" type="danger" @click="handleDelete(row, $index)"> 确认打款 </el-button>
              <el-button size="small" type="danger" @click="handleDelete(row, $index)"> 拒绝打款 </el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          background
          small
          class="pagination-center"
          :total="tableParams.total"
          :page-sizes="[10, 20, 50, 100, 200]"
          v-model:currentPage="tableParams.listQuery.page"
          v-model:page-size="tableParams.listQuery.pagesize"
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
          <el-button v-loading="dialogLoading" size="large" type="primary" @click="submitDelete">确认提交</el-button>
          <el-button size="large" type="default" @click="dialogPromptVisible = false">取消</el-button>
        </span>
      </template>
    </el-dialog>
  </YuLayout>
</template>

<script>
import YuLayout from '/@/components/YuLayout'

export default {
  components : {
    YuLayout
  },
  data() {
    return {
      dialogPromptVisible : false,
      dialogLoading : false,
      topicOptions : [
        { key : '10', display_name : '中心钱包提现' },
        { key : '30', display_name : '游戏钱包提现' }
      ],
      tagOptions : [
        { key : '10', display_name : '已打款' },
        { key : '30', display_name : '未处理' },
        { key : '30', display_name : '已拒绝' }
      ],
      currentComponent : '',
      listLoading : false,
      searchParams : {
        time : '',
        size : '',
        format : '',
        keyword : ''
      },
      list : [],
      tableParams : {
        total : 40,
        listQuery : {
          page : 1,
          pagesize : 10
        },
        data : [
          {
            id : 1,
            type : '',
            image_uri : '',
            percent : 20,
            status : 'published'
          }
        ]
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
      this.listLoading = true

      this.tableParams.total = 20
      this.list = this.tableParams.data

      setTimeout( () => {
        this.listLoading = false
      }, 1.5 * 1000 )
    },
    handleDialogShow( type ) {
      this.currentComponent = type
      this.dialogAdjustVisible = true
    },
    handleFilter() {
      this.tableParams.listQuery.page = 1
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
      this.tableParams.listQuery.page = 1
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
          this.dialogAdjustVisible = false
        } )
        .catch( () => {
          this.dialogLoading = false
        } )
    }
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
    }
  }

  .filter-item {
    width: 100px;

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
  }
  :deep(.el-select) {
    .el-input {
    }
  }
  .date-item {
    margin-left: 4px;
    width: 300px;
  }
  :deep(.el-form-item__label) {
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
