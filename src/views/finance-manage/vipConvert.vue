<template>
  <YuLayout title="">
    <template #body>
      <div class="app-container">
        <div class="filter-container">
          <div class="filter-item-left">
            <el-button class="filter-item" type="primary" @click="handleDialogShow('VipConvertEdit')">
              生成兑换码
            </el-button>
            <el-button class="filter-item" @click="handleDialogShow('VipConvertEdit')"> 导出 </el-button>
          </div>
          <div class="filter-item-right">
            <el-select v-model="searchParams.size" placeholder="全部" clearable class="filter-item">
              <el-option v-for="item in topicOptions" :key="item.key" :label="item.display_name" :value="item.key" />
            </el-select>
            <el-select v-model="searchParams.time" placeholder="全部" clearable class="filter-item">
              <el-option v-for="item in tagOptions" :key="item.key" :label="item.display_name" :value="item.key" />
            </el-select>
            <el-input
              v-model="searchParams.keyword"
              placeholder="请输入账号"
              class="filter-item input-item"
              clearable
              @keyup.enter="handleFilter"
            />
            <el-button v-wave class="filter-item" type="primary" @click="handleFilter"> 搜索 </el-button>
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
          <el-table-column label="兑换码" prop="id" align="center" />
          <el-table-column label="套餐名" prop="id" align="center" />
          <el-table-column label="是否被使用" prop="id" align="center" />
          <el-table-column label="使用用户" prop="id" align="center" />
          <el-table-column label="使用时间" prop="id" align="center" />
          <el-table-column label="生成时间" prop="id" align="center" />
          <el-table-column label="操作" align="center" width="270" class-name="small-padding fixed-width">
            <template #default="{ row, $index }">
              <el-button
                size="small"
                type="danger"
                v-clipboard:copy="handleClipboard('ddd')"
                v-clipboard:success="clipboardSuccess"
              >
                复制
              </el-button>
              <el-button size="small" type="danger" @click="handleDelete(row, $index)"> 删除 </el-button>
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
    <!-- 批量调整 -->
    <el-dialog
      :width="dialogWidth"
      append-to-body
      :close-on-click-modal="false"
      v-model="dialogAdjustVisible"
      :title="dialogTitle"
    >
      <component ref="dialog" v-if="currentComponent" :is="currentComponent"></component>
      <template #footer v-if="currentComponent !== 'AccountRecord'">
        <span class="dialog-footer">
          <el-button v-loading="dialogLoading" size="large" type="primary" @click="submit">提交</el-button>
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
import YuLayout from '/@/components/YuLayout'
import VipConvertEdit from './components/VipConvertEdit.vue'

export default {
  components : {
    YuLayout,
    VipConvertEdit
  },
  data() {
    return {
      dialogAdjustVisible : false,
      dialogPromptVisible : false,
      dialogLoading : false,
      formatOptions : [
        { key : '10', display_name : '横版' },
        { key : '20', display_name : '竖版' }
      ],
      topicOptions : [
        { key : '10', display_name : '已使用' },
        { key : '30', display_name : '未使用' }
      ],
      tagOptions : [
        { key : '10', display_name : '黄金月卡' },
        { key : '30', display_name : '白金季度卡' },
        { key : '40', display_name : '钻石永久卡' },
        { key : '50', display_name : '至尊永久卡' }
      ],
      currentComponent : 'TeamList',
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
          },
          {
            id : 2,
            type : '',
            image_uri : '',
            percent : 80,
            status : 'published'
          }
        ]
      }
    }
  },
  computed : {
    dialogWidth() {
      return {
        VipConvertEdit : '600'
      }[this.currentComponent]
    },
    dialogTitle() {
      return {
        VipConvertEdit : '生成兑换码'
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
    handlePreview() {},
    handleFilter() {
      this.tableParams.listQuery.page = 1
      this.getList()
    },
    handleDelete( index ) {
      this.dialogPromptVisible = true
      this.list.splice( index, 1 )
    },
    handleSelectionChange( val ) {
      console.log( 'handleSelectionChange', val )
      this.multipleSelection = val
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
    handleClipboard( text ) {
      return text
    },
    clipboardSuccess() {},
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
      height: 46px;
    }
  }

  .filter-item {
    width: 100px;
    height: 46px;
    margin-right: 4px;
    margin-left: 0;
    margin-bottom: 0;
    &:last-child {
      margin-right: 0;
    }
  }
  .input-item {
    width: 160px;
    height: 46px;
  }
  :deep(.el-date-editor) {
    height: 46px;
  }
  :deep(.el-select) {
    .el-input {
      height: 46px;
    }
  }
  .date-item {
    margin-left: 4px;
    width: 300px;
    height: 46px;
  }
  :deep(.el-form-item__label) {
    height: 46px;
    line-height: 46px;
  }
}

.pagination-center {
  margin: 60px 0 30px;
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
