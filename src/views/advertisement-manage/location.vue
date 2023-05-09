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
          <el-table-column label="广告位标题" prop="id" align="center" />
          <el-table-column label="是否支持GIF" prop="id" align="center" />
          <el-table-column label="广告位宽*高" prop="id" align="center" />
          <el-table-column label="状态" prop="id" align="center">
            <template #default="{ row }">
              <el-switch v-model="row.delivery" />
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="270" class-name="small-padding fixed-width">
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
      v-model="dialogVisible"
      :title="dialogTitle"
    >
      <!-- <component v-if="currentComponent" :is="currentComponent" :mode="mode" ></component> -->
      <edit ref="dialog" v-if="currentComponent" :mode="mode"></edit>
      <template #footer>
        <span class="dialog-footer">
          <el-button v-loading="dialogLoading" size="large" type="primary" @click="submit">提交</el-button>
        </span>
      </template>
    </el-dialog>
  </YuLayout>
</template>

<script>
import YuLayout from '/@/components/YuLayout'
import edit from './components/locationEdit'

export default {
  components : {
    YuLayout,
    edit
  },
  data() {
    return {
      dialogVisible : false,
      dialogLoading : false,
      currentComponent : 'Edit',
      mode : 'add',
      listLoading : false,
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
            delivery : 1,
            percent : 20,
            status : 'published'
          },
          {
            id : 2,
            type : '',
            delivery : 1,
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
        add : '40%',
        edit : '40%'
      }[this.mode]
    },
    dialogTitle() {
      return {
        add : '添加广告位',
        edit : '编辑广告位'
      }[this.mode]
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
    handleEdit( mode ) {
      this.mode = mode
      this.dialogVisible = true
    },
    submit() {
      this.dialogLoading = true
      this.$refs.dialog
        .submitForm()
        .then( res => {
          this.dialogLoading = false
          this.dialogVisible = false
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
