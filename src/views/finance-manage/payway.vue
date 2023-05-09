<template>
  <YuLayout title="">
    <template #body>
      <div class="app-container">
        <div class="filter-container">
          <div class="filter-item-left">
            <el-button class="filter-item" type="primary" @click="handleDialogShow('PaywayEdit', 'add')">
              添加
            </el-button>
            <el-button class="filter-item" type="primary" :loading="checkLoading" @click="handleCheckAvailable('all')">
              一键检测
            </el-button>
          </div>
          <div class="filter-item-right">
            <!-- <el-select v-model="searchParams.state" placeholder="所有状态" clearable class="filter-item">
              <el-option v-for="item in stateOptions" :key="item.key" :label="item.display_name" :value="item.key" />
            </el-select> -->
            <el-input
              v-model="tableParams.listQuery.title"
              placeholder="支付应用名称关键字"
              class="filter-item input-item"
              clearable
              @keyup.enter="getList(true)"
            />
            <el-button v-wave class="filter-item" type="primary" @click="getList(true)"> 搜索 </el-button>
          </div>
        </div>
        <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
          <el-table-column label="ID" prop="id" align="center" />
          <el-table-column label="支付应用名称" prop="title" align="center" />
          <el-table-column label="支付商家" prop="mer" align="center" />
          <el-table-column label="支付方式" prop="flag" align="center">
            <template #default="{ row }">
              <span>{{ flagFilter(row.flag) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="支付标识" prop="code" align="center" />
          <el-table-column label="通道编码" prop="channel" align="center" />
          <el-table-column label="支持终端" prop="device" align="center">
            <template #default="{ row }">
              <span>{{ deviceFilter(row.device) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="测试额度" prop="amount" align="center" />
          <el-table-column label="排序" prop="sort" align="center">
            <template #default="{ row }">
              <el-input v-if="row.checked" v-model.number="row.sort" @blur="handlePriorityBlur(row)" />
              <span v-else @click="priorityFoucs(row)">{{ row.sort }}</span>
            </template>
          </el-table-column>
          <el-table-column label="是否可用" prop="device" align="center">
            <template #default="{ row }">
              <el-switch
                :loading="switchLoading2"
                :active-value="1"
                :inactive-value="2"
                @change="handleSetAvailable(row)"
                v-model="row.is_available"
              />
              <!-- <span>{{ row.is_available===1?'可用':row.is_available===2?'不可用':'' }}</span> -->
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
          <el-table-column label="操作" fixed="right" align="center" width="220" class-name="small-padding fixed-width">
            <template #default="{ row, $index }">
              <el-button size="small" type="danger" @click="handleCheckAvailable('single', row)"> 检测 </el-button>
              <el-button size="small" type="danger" @click="handleDialogShow('PaywayEdit', 'edit', row)">
                配置
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
      ></component>
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
import PaywayEdit from './components/PaywayEdit.vue'

import {
  getPayList,
  editPay,
  delPay,
  apiCheckAvailable,
  apiCheckSingelAvailable
} from '/@/api/finance-manage/payway.js'

export default {
  components : {
    YuLayout,
    PaywayEdit
  },
  data() {
    return {
      dialogVisible : false,
      dialogLoading : false,
      switchLoading : false,
      switchLoading2 : false,
      checkLoading : false,
      currentComponent : 'PaywayEdit',
      mode : 'add',
      currentRowData : {},
      listLoading : false,
      list : [],
      tableParams : {
        total : 10,
        listQuery : {
          title : '', // 过滤条件
          page_no : 1,
          page_size : 10
        },
        data : []
      },
      flagOptions : [
        { key : 1, display_name : '支付宝' },
        { key : 2, display_name : '微信' },
        { key : 3, display_name : '银行卡' },
        { key : 4, display_name : '手工充值' }
      ],
      deviceOptions : [
        { key : 1, display_name : '移动端' }
        // { key : 2, display_name : 'PC端' },
        // { key : 3, display_name : '移动端和PC端' }
      ]
    }
  },
  computed : {
    dialogWidth() {
      return {
        PaywayEdit : '80%'
      }[this.currentComponent]
    },
    dialogTitle() {
      return {
        add : '添加支付配置参数',
        edit : '编辑支付配置参数'
      }[this.mode]
    }
  },
  created() {
    this.getList()
  },
  methods : {
    async getList( search ) {
      this.listLoading = true
      if ( search === true ) {
        this.tableParams.listQuery.page_no = 1
      }
      const params = {
        ...this.tableParams.listQuery
      }
      try {
        const res = await getPayList( params )
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
    handleFilter() {
      this.tableParams.listQuery.page = 1
      this.getList()
    },
    priorityFoucs( row ) {
      row.checked = !row.checked
    },
    handlePriorityBlur( row ) {
      const params = {
        ...row
      }
      editPay( params ).then( res => {
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
      delPay( params )
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
    handleSetAvailable( row ) {
      const params = {
        ...row
      }
      this.switchLoading2 = true
      editPay( params )
        .then( res => {
          this.switchLoading2 = false
          if ( res ) {
            this.getList()
          }
        } )
        .catch( err => {
          console.log( err )
          this.switchLoading2 = false
        } )
    },
    async handleSetStatus( row ) {
      const params = {
        ...row
      }
      this.switchLoading = true
      editPay( params )
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
    flagFilter( id ) {
      if ( !id || this.flagOptions.length === 0 ) {
        return ''
      }
      const obj = this.flagOptions.filter( item => {
        return item.key === id
      } )[0]
      return obj ? obj.display_name : ''
    },
    deviceFilter( id ) {
      if ( !id || this.deviceOptions.length === 0 ) {
        return ''
      }
      const obj = this.deviceOptions.filter( item => {
        return item.key === id
      } )[0]
      return obj ? obj.display_name : ''
    },
    handleCheckAvailable( type, row = {} ) {
      if ( type === 'all' ) {
        this.checkLoading = true
        apiCheckAvailable()
          .then( res => {
            this.checkLoading = false
            if ( res ) {
              this.getList()
            }
          } )
          .catch( () => {
            this.checkLoading = false
          } )
      } else {
        const params = {
          id : row.id
        }
        apiCheckSingelAvailable( params )
          .then( res => {
            if ( res ) {
              this.getList()
            }
          } )
          .catch( () => {} )
      }
    },
    handleSizeChange( val ) {
      this.getList()
    },
    handleCurrentChange( val ) {
      this.tableParams.listQuery.page_no = val
      this.getList()
    },
    handleDialogShow( type, mode, row ) {
      this.mode = mode
      this.currentRowData = row
      this.currentComponent = type
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
