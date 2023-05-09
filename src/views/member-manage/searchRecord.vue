<template>
  <YuLayout title="">
    <template #body>
      <div class="app-container">
        <div class="filter-container">
          <div class="filter-item-left">
            <el-button class="filter-item" type="primary" @click="dialogPromptVisible = true">
              删除搜索次数不足100的记录
            </el-button>
          </div>
        </div>

        <div class="wrapper">
          <div class="item" v-for="(item, index) in list" :key="index">
            <span class="text">{{ item.keyWord }}</span>
            <span class="count">x{{ item.count }}</span>
          </div>
        </div>
        <!-- <el-table
            v-loading="listLoading"
            :data="list"
            border
            fit
            highlight-current-row
          >
            <el-table-column label="视频标题" prop="id" align="center" />
            <el-table-column label="用户账号" prop="id" align="center" />
            <el-table-column label="IP地址" prop="id" align="center" />
            <el-table-column label="设备ID" prop="id" align="center" />
            <el-table-column label="观看时间" prop="id" align="center" />
          </el-table>

          <el-pagination
            background
            small
            class="pagination-center"
            :total="tableParams.total"
            :page-sizes="[10,20, 50, 100, 200]"
            v-model:currentPage="tableParams.listQuery.page"
            v-model:page-size="tableParams.listQuery.pagesize"
            layout="prev, pager, next, sizes,jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          /> -->
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
import { apiGetHotList, apiDelHotKey } from '/@/api/member-manage/memberList.js'

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
        keyword : ''
      },
      list : [],
      tableParams : {
        total : 10,
        listQuery : {
          page : 1,
          pagesize : 10
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
      this.listLoading = true

      const params = {
        count : 100
      }

      try {
        const res = await apiGetHotList( params )
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
      this.tableParams.listQuery.page = 1
      this.getList()
    },
    handleDelete( index ) {
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
      this.dialogLoading = true
      const params = {
        count : 100
      }
      apiDelHotKey( params )
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
      width: 140px;
      height: 46px;
    }
  }

  .filter-item {
    width: 200px;
    height: 46px;
    margin-right: 4px;
    margin-left: 0;
    margin-bottom: 0;
    &:last-child {
      margin-right: 0;
    }
  }
}

.el-table {
  flex: 1;
  & ::v-deep(th.el-table__cell),
  ::v-deep(td.el-table__cell) {
    position: static;
  }
}

.wrapper {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .item {
    margin-bottom: 20px;
    margin-right: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 20px;
    width: calc((100% - 20 * 7px) / 8);
    border: 1px solid #ccc;
    &:last-child {
      margin-right: 0;
    }
    .text {
      margin-right: 6px;
      color: #000;
      font-size: 16px;
    }
    .count {
      width: 60%;
      text-align: center;
      line-height: 60px;
      height: 60px;
      border: 1px solid #ccc;
      border-radius: 40%;
    }
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
