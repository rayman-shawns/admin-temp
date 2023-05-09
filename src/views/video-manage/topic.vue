<template>
  <YuLayout title="">
    <template #body>
      <div class="app-container">
        <div class="filter-container">
          <div class="filter-item-left">
            <el-button class="filter-item" type="primary" @click="handleEdit('add')"> 添加专题 </el-button>
          </div>
        </div>

        <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
          <el-table-column label="ID" prop="topicId" align="center" />
          <el-table-column label="专题名称" prop="name" align="center" />
          <el-table-column label="头像" prop="avatar" align="center">
            <template #default="{ row }">
              <el-image
                style="width: 100px; height: 100px"
                :src="coverDomain + row.avatar"
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
          <el-table-column label="封面" prop="cover" align="center">
            <template #default="{ row }">
              <el-image
                style="width: 100px; height: 100px"
                :src="coverDomain + row.cover"
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
          <el-table-column label="背景" prop="bgImage" align="center">
            <template #default="{ row }">
              <el-image
                style="width: 100px; height: 100px"
                :src="coverDomain + row.bgImage"
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
          <el-table-column label="介绍" prop="intro" align="center"></el-table-column>
          <el-table-column label="包含视频" prop="videoNum" align="center" />
          <el-table-column label="排序（倒序）" prop="priority" align="center">
            <template #default="{ row }">
              <el-input v-if="row.checked" v-model.number="row.priority" @blur="handlePriorityBlur(row)" />
              <span v-else @click="priorityFoucs(row)">{{ row.priority }}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" prop="status" align="center">
            <template #default="{ row }">
              <el-switch
                :loading="switchLoading"
                :active-value="2"
                :inactive-value="1"
                @change="handleSetStatus(row)"
                v-model="row.status"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" align="center" width="150" class-name="small-padding fixed-width">
            <template #default="{ row, $index }">
              <el-button size="small" type="danger" @click="handleEdit('edit', row)"> 编辑 </el-button>
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
          v-model:current-page="tableParams.listQuery.pageNo"
          v-model:page-size="tableParams.listQuery.pageSize"
          layout="prev, pager, next, sizes,jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </template>
    <!-- 组件弹窗 -->
    <el-dialog
      class="component-dialog"
      :width="dialogWidth"
      append-to-body
      :close-on-click-modal="false"
      v-model="dialogVisible"
      :title="dialogTitle"
    >
      <topic-edit ref="dialog" v-if="dialogVisible" :mode="mode" :current-row-data="currentRowData"></topic-edit>
      <template #footer>
        <span class="dialog-footer">
          <el-button :loading="dialogLoading" size="large" type="primary" @click="submit">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </YuLayout>
</template>

<script>
import YuLayout from '/@/components/YuLayout'
import TopicEdit from './components/TopicEdit.vue'
// import { useUserStore } from '/@/store'
import { getTopicList, deleteTopic, editTopic, apiSetStatus } from '/@/api/video-manage/topic.js'
import { imgContainer, coverDomain } from '/@/config/constant.js'
export default {
  components : {
    YuLayout,
    TopicEdit
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
      currentRow : {},
      listLoading : false,
      list : [],
      tableParams : {
        total : 10,
        listQuery : {
          pageNo : 1,
          pageSize : 10,
          reqType : 0
        },
        data : []
      }
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
        add : '添加专题',
        edit : '编辑专题'
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
        const res = await getTopicList( params )
        this.tableParams.total = res.data?.count || 1
        this.list = res.data.list
        if ( this.list.length > 0 ) {
          this.list = this.list.map( item => {
            item.checked = false
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
        id : row.topicId,
        data : { ...row, reqType : 0 }
      }
      editTopic( params ).then( res => {
        if ( res ) {
          this.getList()
        }
      } )
    },
    handleFilter() {
      this.tableParams.listQuery.pageNo = 1
      this.getList()
    },
    async handleSetStatus( row ) {
      const params = {
        id : row.topicId,
        status : row.status
      }
      this.switchLoading = true
      apiSetStatus( params )
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
    handleDelete( row, index ) {
      this.listLoading = true
      const params = {
        topicId : [row.topicId],
        reqType : 0
      }
      deleteTopic( params )
        .then( res => {
          if ( res ) {
            // this.list.splice( index, 1 )
            this.getList()
            this.listLoading = false
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
      this.tableParams.listQuery.pageNo = val
      this.getList()
    },
    handleEdit( mode, row = {} ) {
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
