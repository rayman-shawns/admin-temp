<template>
  <YuLayout title="">
    <template #body>
      <div class="app-container">
        <div class="filter-container">
          <div class="filter-item-left">
            <el-button class="filter-item" type="primary" @click="handleDialogShow('BatchAdjust')"> 启用 </el-button>
            <el-button class="filter-item" type="primary" @click="handleDialogShow('BatchAdjust')"> 禁用 </el-button>
            <el-button class="filter-item"> 删除 </el-button>
            <el-form-item label="创建时间" class="filter-item date-item">
              <el-date-picker
                v-model="searchParams.date"
                type="daterange"
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="YYYY-MM-DD"
                @change="changeDate"
              />
            </el-form-item>
            <el-select v-model="searchParams.time" placeholder="在线状态" clearable class="filter-item">
              <el-option v-for="item in tagOptions" :key="item.key" :label="item.display_name" :value="item.key" />
            </el-select>
            <el-input
              v-model="searchParams.keyword"
              placeholder="请输入会员ID搜索"
              class="filter-item input-item"
              clearable
              @keyup.enter="handleFilter"
            />
            <el-button v-wave class="filter-item" type="primary" @click="handleFilter"> 搜索 </el-button>
          </div>
          <div class="filter-item-right">
            <el-button class="filter-item" type="primary" @click="dialogPromptVisible = true">
              删除七天内没有上线的游客用户
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
          <el-table-column label="头像/账号/昵称" prop="id" align="center" />
          <el-table-column label="会员ID" prop="id" align="center" />
          <el-table-column label="创建时间" prop="id" align="center" />
          <el-table-column label="IP地址" prop="id" align="center" />
          <el-table-column label="最后在线时间" prop="id" align="center" />
          <el-table-column label="状态" prop="id" align="center" />
          <el-table-column label="操作" align="center" width="270" class-name="small-padding fixed-width">
            <template #default="{ row, $index }">
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
      :width="dialogWidth"
      append-to-body
      :close-on-click-modal="false"
      v-model="dialogAdjustVisible"
      :title="dialogTitle"
    >
      <component ref="dialog" v-if="currentComponent" :is="currentComponent"></component>
      <template #footer v-if="currentComponent !== 'AccountRecord'">
        <span class="dialog-footer">
          <el-button v-loading="dialogLoading" size="large" type="primary" @click="submit">确认提交</el-button>
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
import { apiGetMemberList } from '/@/api/member-manage/memberList.js'

export default {
  components : {
    YuLayout
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
        { key : '10', display_name : '专题1' },
        { key : '30', display_name : '专题1' }
      ],
      tagOptions : [
        { key : '10', display_name : '制服诱惑' },
        { key : '30', display_name : '日韩' }
      ],
      currentComponent : 'BatchAdjust',
      multipleSelection : [],
      listLoading : false,
      searchParams : {
        time : '',
        startTime : '',
        endTime : '',
        size : '',
        format : '',
        keyword : '',
        filter : {}
      },
      list : [],
      tableParams : {
        total : 10,
        listQuery : {
          pageNo : 1,
          pageSize : 10,
          filter : {}
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

      const params = {
        ...this.tableParams.listQuery
      }

      try {
        const res = await apiGetMemberList( params )
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
    handleDialogShow( type ) {
      this.currentComponent = type
      this.dialogAdjustVisible = true
    },
    changeDate( date ) {
      // this.searchParams.startTime = date[0].getTime() / 1000
      if ( date && date.length > 0 ) {
        this.searchParams.startTime = date[0]
        this.searchParams.endTime = date[1]
      } else {
        this.searchParams.startTime = ''
        this.searchParams.endTime = ''
      }
    },
    handleFilter() {
      this.tableParams.listQuery.pageNo = 1
      this.getList()
    },
    handleDelete( index ) {
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

.footer-total {
  display: flex;
  align-items: center;
  justify-content: center;
  .item {
    margin-right: 20px;
    display: flex;
    flex-direction: column;
    text-align: center;
  }
  .item:nth-child(6) {
    margin-right: 100px;
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
