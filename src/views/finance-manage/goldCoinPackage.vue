<template>
  <YuLayout title="">
    <template #body>
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="VIP套餐" :name="3">
          <vip-package v-if="activeName === 3" />
        </el-tab-pane>
        <el-tab-pane label="中心钱包金币" :name="1"></el-tab-pane>
        <el-tab-pane label="游戏钱包金币" :name="2"></el-tab-pane>
      </el-tabs>
      <div class="app-container" v-if="activeName !== 3">
        <div class="filter-container">
          <div class="filter-item-left">
            <el-button class="filter-item" type="primary" @click="handleDialogShow('GoldCoinPackageEdit', 'add')">
              添加
            </el-button>
          </div>
        </div>

        <el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
          <el-table-column label="ID" prop="id" align="center" />
          <el-table-column label="套餐名称" prop="title" align="center" />
          <el-table-column label="金币数量" prop="gold" align="center" />
          <el-table-column label="价格" prop="amount" align="center" />
          <el-table-column v-if="activeName === 1" label="推送终端" prop="flag" align="center">
            <template #default="{ row }">
              <span>{{ deviceFilter(row.flag) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="排序" prop="sort" align="center">
            <template #default="{ row }">
              <el-input v-if="row.checked" v-model.number="row.sort" @blur="handlePriorityBlur(row)" />
              <span v-else @click="priorityFoucs(row)">{{ row.sort }}</span>
            </template>
          </el-table-column>
          <el-table-column label="支付ID" prop="id" align="center" />
          <el-table-column label="状态" prop="state" align="center">
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
          <el-table-column label="操作" fixed="right" align="center" width="160" class-name="small-padding fixed-width">
            <template #default="{ row, $index }">
              <el-button size="small" type="danger" @click="handleDialogShow('GoldCoinPackageEdit', 'edit', row)">
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
      class="component-dialog"
      :width="dialogWidth"
      append-to-body
      :close-on-click-modal="false"
      v-model="dialogVisible"
      :title="dialogTitle"
    >
      <component
        v-if="dialogVisible"
        ref="dialog"
        :is="currentComponent"
        :mode="mode"
        :active-plat-form="activeName"
        :current-row-data="currentRowData"
        :payway-options="payList"
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
import GoldCoinPackageEdit from './components/GoldCoinPackageEdit.vue'
import { getGoldList, editGold, delGold } from '/@/api/finance-manage/goldCoinPackage.js'
import { getPayList } from '/@/api/finance-manage/payway.js'
import { localStorageHandle } from '/@/utils/storage'
import VipPackage from './vipPackage.vue'
// wallet_flag:1=中心钱包，2=游戏钱包
export default {
  components : {
    YuLayout,
    GoldCoinPackageEdit,
    VipPackage
  },
  data() {
    return {
      dialogVisible : false,
      dialogLoading : false,
      currentComponent : 'GoldCoinPackageEdit',
      mode : 'add',
      currentRowData : {},
      listLoading : false,
      activeName : 3,
      list : [],
      tableParams : {
        total : 10,
        listQuery : {
          page_no : 1,
          page_size : 20
        },
        data : []
      },
      devices : [
        { key : 1, display_name : '移动端' }
        // { key : 2, display_name : 'PC端' },
        // { key : 3, display_name : '移动端和PC端' }
      ],
      payList : [],
      isSwitching : false
    }
  },
  computed : {
    dialogWidth() {
      return {
        GoldCoinPackageEdit : '700'
      }[this.currentComponent]
    },
    dialogTitle() {
      return {
        add : '添加金币套餐',
        edit : '编辑金币套餐'
      }[this.mode]
    }
  },
  created() {
    const financeSettings = localStorageHandle.getItem( 'financeSettings' )
    console.log( 'financeSettings', financeSettings )
    if ( financeSettings ) {
      this.activeName = financeSettings.goldCoinTab
    }
    if ( [1, 2].includes( this.activeName ) ) {
      this.getList()
    }
  },
  beforeRouteLeave( from, to, next ) {
    localStorageHandle.removeItem( 'financeSettings' )
    // console.log( to )
    next()
  },
  mounted() {
    this.$nextTick( () => {
      this.getPaywayList()
    } )
  },
  methods : {
    beforeChange( row ) {
      // 开关
      return () => [1, 2].includes( row.state )
    },
    onSwitch( row ) {
      console.log( row )
    },
    async getList() {
      this.listLoading = true

      const params = {
        ...this.tableParams.listQuery,
        wallet_flag : this.activeName
      }

      try {
        const res = await getGoldList( params )
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
    async getPaywayList() {
      const params = {
        page_no : 1,
        page_size : 500,
        is_available : 1
      }
      try {
        const res = await getPayList( params )
        this.payList = res.data.list
        if ( res.data.list.length > 0 ) {
          this.payList = res.data.list.filter( item => {
            return item.state === 1
          } )
        }
      } catch ( error ) {}
    },
    handleClick( val ) {
      // console.log( val, val.paneName )
      const financeSettings = {
        goldCoinTab : val.paneName
      }
      console.log( financeSettings )
      localStorageHandle.setItem( 'financeSettings', financeSettings )
      this.activeName = val.paneName
      this.tableParams.listQuery.page_no = 1
      this.getList()
    },
    handleFilter() {
      this.tableParams.listQuery.page_no = 1
      this.getList()
    },
    paywayFilter( c_id ) {
      if ( !c_id || c_id.length === 0 || this.payList.length === 0 ) {
        return ''
      }
      const arr = this.payList.filter( item => {
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
    deviceFilter( c_id ) {
      if ( !c_id || c_id.length === 0 || this.devices.length === 0 ) {
        return ''
      }
      const arr = this.devices.filter( item => {
        return c_id.includes( item.key )
      } )
      let str = ''
      if ( arr && arr.length > 0 ) {
        str = arr
          .map( item => {
            return item.display_name
          } )
          .join( ',' )
      }
      return str
    },
    priorityFoucs( row ) {
      row.checked = !row.checked
    },
    handlePriorityBlur( row, showMsg ) {
      const params = {
        ...row
      }
      if ( showMsg ) {
        row.isSwitching = true
      }
      editGold( params ).then( res => {
        if ( showMsg ) {
          row.isSwitching = false
        }
        // this.$message( { type : 'success', message : ( params.state === 1 ? '开启' : '关闭' ) + '成功' } )
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
      delGold( params )
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
  min-height: 92%;
  overflow-y: scroll;
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
