<template>
  <YuLayout title="">
    <template #body>
      <div class="app-container">
        <div class="filter-container">
          <div class="filter-item-left">
            <el-button class="filter-item" type="primary" @click="handleEdit('add')"> 添加定位标签 </el-button>
            <el-select v-model="searchParams.posType" @change="handleFilter" placeholder="全部定位" class="filter-item">
              <el-option v-for="item in posTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
            </el-select>
          </div>
        </div>

        <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
          <el-table-column label="ID" prop="id" align="center" />
          <el-table-column label="标签名" prop="name" align="center" />
          <el-table-column label="定位" prop="posType" align="center">
            <template #default="{ row }">
              {{ posTypeFilter(row.posType) }}
            </template>
          </el-table-column>
          <el-table-column label="上级标签" prop="pid" align="center">
            <template #default="{ row }">
              {{ pidFilter(row.pid) }}
            </template>
          </el-table-column>
          <el-table-column label="模板" prop="templateType" align="center">
            <template #default="{ row }">
              {{ templateFilter(row.templateType) }}
            </template>
          </el-table-column>
          <!-- <el-table-column label="PC端图片" prop="pcCover" align="center">
            <template #default="{ row }">
              <el-image
                style="width: 100px; height: 100px"
                :src="coverDomain + row.pcCover"
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
          </el-table-column> -->
          <el-table-column label="移动端图片" prop="h5Cover" align="center">
            <template #default="{ row }">
              <el-image
                style="width: 100px; height: 100px"
                :src="coverDomain + row.h5Cover"
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
      <template-edit ref="dialog" v-if="dialogVisible" :mode="mode" :current-row-data="currentRowData"></template-edit>
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
import TemplateEdit from './components/TemplateEdit.vue'
// import { useUserStore } from '/@/store'
import {
  getVideoPosTagList,
  deleteVideoPosTag,
  apiGetVideoPosList,
  editVideoPosTag
} from '/@/api/video-manage/template.js'
import { imgContainer, coverDomain } from '/@/config/constant.js'

export default {
  components : {
    YuLayout,
    TemplateEdit
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
      searchParams : {
        posType : 0
      },
      posAllList : [{ id : '10', name : '横版' }],
      posTypeOptions : [
        { key : 0, display_name : '全部定位' },
        { key : 1, display_name : '首页' },
        { key : 2, display_name : '色点' }
      ],
      templateOptions : [
        { key : '1', display_name : '1+2+2' },
        { key : '2', display_name : '2+2' },
        { key : '3', display_name : 's+1.5' },
        { key : '4', display_name : '2+2+2' },
        { key : '5', display_name : '1+2' },
        { key : '6', display_name : '2+2+2+2+2+2' },
        { key : 7, display_name : '无' }
      ],
      posAllTotal : 0,
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
        add : '添加标签',
        edit : '编辑标签'
      }[this.mode]
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    this.$nextTick( () => {
      this.getVideoPosList()
    } )
  },
  methods : {
    async getList() {
      this.listLoading = true

      const params = {
        ...this.tableParams.listQuery,
        filter : { ...this.searchParams }
      }

      try {
        const res = await getVideoPosTagList( params )
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
    async getVideoPosList() {
      const params = {
        posType : '',
        pid : -1
      }
      try {
        const res = await apiGetVideoPosList( params )
        this.posAllTotal = res.data?.count
        this.posAllList = res.data.list
      } catch ( error ) {}
    },
    pidFilter( pid ) {
      if ( !pid || this.posAllList.length === 0 ) {
        return ''
      }
      const obj = this.posAllList.filter( item => {
        return item.id === pid
      } )[0]
      return obj ? obj.name : ''
    },
    templateFilter( id ) {
      if ( !id ) {
        return ''
      }
      const obj = this.templateOptions.filter( item => {
        return item.key * 1 === id
      } )[0]
      return obj ? obj.display_name : ''
    },
    posTypeFilter( id ) {
      if ( !id ) {
        return ''
      }
      const obj = this.posTypeOptions.filter( item => {
        return item.key * 1 === id
      } )[0]
      return obj ? obj.display_name : ''
    },
    priorityFoucs( row ) {
      row.checked = !row.checked
    },
    handlePriorityBlur( row ) {
      const params = {
        data : { ...row }
      }
      editVideoPosTag( params ).then( res => {
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
        data : { ...row }
      }
      this.switchLoading = true
      editVideoPosTag( params )
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
    async handleDelete( row, index ) {
      this.listLoading = true
      const params = {
        ids : [row.id]
      }
      deleteVideoPosTag( params )
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
            this.getVideoPosList()
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
