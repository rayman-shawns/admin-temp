<template>
  <YuLayout title="">
    <template #body>
      <div class="app-container">
        <div class="filter-container">
          <div class="filter-item-left">
            <el-button class="filter-item" type="primary" @click="handleDialogShow('VipPackageEdit', 'add')">
              添加
            </el-button>
            <!-- <el-button class="filter-item" type="primary" @click="handleDialogShow('PrivilegeSettings', 'add')">
              特权配置
            </el-button> -->
          </div>
        </div>

        <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
          <el-table-column label="ID" prop="id" align="center" />
          <el-table-column label="套餐名称" prop="title" align="center" />
          <el-table-column label="缩略图" prop="icon" width="180" align="center">
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
          <el-table-column label="背景图" prop="bg_img" width="180" align="center">
            <template #default="{ row }">
              <el-image
                style="width: 100px; height: 100px"
                :src="coverDomain + row.bg_img"
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
          <el-table-column label="天数" prop="day_num" align="center" />
          <el-table-column label="现价" prop="gold" align="center" />
          <el-table-column label="原价" prop="price" align="center" />
          <el-table-column label="赠送金币" prop="extra" align="center" />
          <el-table-column label="等级" prop="level" align="center" />
          <!-- <el-table-column label="特权" prop="c_id" align="center">
            <template #default="{ row }">
              <span>{{ privilegeFilter(row.c_id) }}</span>
            </template>
          </el-table-column> -->
          <el-table-column label="说明" prop="content" align="center" />
          <el-table-column label="排序" prop="sort" align="center">
            <template #default="{ row }">
              <el-input v-if="row.checked" v-model.number="row.sort" @blur="handlePriorityBlur(row)" />
              <span v-else @click="priorityFoucs(row)">{{ row.sort }}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" prop="id" align="center">
            <template #default="{ row }">
              <el-switch
                :active-value="1"
                :inactive-value="2"
                v-model="row.state"
                :validate-event="false"
                :loading="row.isSwitching"
                @change="handlePriorityBlur(row, true)"
                :before-change="beforeChange(row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" align="center" width="150" class-name="small-padding fixed-width">
            <template #default="{ row, $index }">
              <el-button size="small" type="danger" @click="handleDialogShow('VipPackageEdit', 'edit', row)">
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
        :privilege-options="privilegeList"
        @updateOptions="updateOptions"
        @beforeUpload="beforeUpload"
        @uploadDone="uploadDone"
      ></component>
      <template #footer v-if="currentComponent !== 'PrivilegeSettings'">
        <span class="dialog-footer">
          <el-button :loading="dialogLoading" size="large" type="primary" @click="submit">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </YuLayout>
</template>

<script>
import YuLayout from '/@/components/YuLayout'
import VipPackageEdit from './components/VipPackageEdit.vue'
import PrivilegeSettings from './PrivilegeSettings.vue'
// import { useUserStore } from '/@/store'

import { getVipList, editVip, delVip } from '/@/api/finance-manage/vipPackage.js'
import { getPrivilegeList } from '/@/api/finance-manage/privilegeSettings.js'
import { imgContainer, coverDomain } from '/@/config/constant.js'

export default {
  components : {
    YuLayout,
    VipPackageEdit,
    PrivilegeSettings
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
      currentComponent : 'PrivilegeSettings',
      mode : 'add',
      currentRowData : {},
      listLoading : false,
      list : [],
      tableParams : {
        total : 10,
        listQuery : {
          pageNo : 1,
          pageSize : 10
        },
        data : []
      },
      privilegeList : [],
      isSwitching : false
    }
  },
  computed : {
    dialogWidth() {
      return {
        VipPackageEdit : '700',
        PrivilegeSettings : '80%'
      }[this.currentComponent]
    },
    dialogTitle() {
      return {
        VipPackageEdit : {
          add : '添加VIP套餐',
          edit : '编辑VIP套餐'
        },
        PrivilegeSettings : {
          add : '特权配置',
          edit : '特权配置'
        }
      }[this.currentComponent][this.mode]
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    // this.$nextTick( () => {
    //   this.getPrivilegeList()
    // } )
  },
  methods : {
    beforeChange( row ) {
      // 开关
      return () => [1, 2].includes( row.state )
    },
    async getList() {
      this.listLoading = true

      const params = {
        ...this.tableParams.listQuery
      }

      try {
        const res = await getVipList( params )
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
    async getPrivilegeList() {
      const params = {
        page_no : 1,
        page_size : 500
      }
      try {
        const res = await getPrivilegeList( params )
        this.privilegeList = res.data.list
      } catch ( error ) {}
    },
    handleFilter() {
      this.tableParams.listQuery.page = 1
      this.getList()
    },
    privilegeFilter( c_id ) {
      if ( !c_id || c_id.length === 0 || this.privilegeList.length === 0 ) {
        return ''
      }
      const arr = this.privilegeList.filter( item => {
        return c_id.includes( item.id )
      } )
      let str = ''
      if ( arr && arr.length > 0 ) {
        str = arr
          .map( item => {
            return item.title
          } )
          .join( ',' )
      }
      return str
    },
    priorityFoucs( row ) {
      row.checked = !row.checked
    },
    handlePriorityBlur( row, showMsg ) {
      console.log( row )
      const params = {
        ...row
      }
      if ( showMsg ) {
        row.isSwitching = true
      }
      editVip( params ).then( res => {
        if ( showMsg ) {
          // this.$message( { type : 'success', message : ( params.state === 1 ? '开启' : '关闭' ) + '成功' } )
          row.isSwitching = false
        }
        if ( res ) {
          this.getList()
        }
      } )
    },
    async handleDelete( row ) {
      this.listLoading = true
      const params = {
        id : row.id
      }
      delVip( params )
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
    handleDialogShow( type, mode, row ) {
      this.mode = mode
      this.currentRowData = row
      this.currentComponent = type
      this.dialogVisible = true
    },
    updateOptions() {
      this.getPrivilegeList()
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
