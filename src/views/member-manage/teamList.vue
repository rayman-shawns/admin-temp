<template>
  <YuLayout title="">
    <template #body>
      <div class="app-container">
        <div class="filter-container">
          <div class="filter-item-left">
            <el-button class="filter-item" :loading="statusLoading" type="primary" @click="setMemberStatus(0)">
              启用
            </el-button>
            <el-button class="filter-item" :loading="statusLoading" type="primary" @click="setMemberStatus(1)">
              禁用
            </el-button>
            <el-button class="filter-item" @click="handleDelete('muti')"> 删除 </el-button>
            <el-button class="filter-item" @click="handleDialogShow('AdjustLevel')"> 移线 </el-button>
            <el-form-item label="创建时间" class="filter-item date-item">
              <el-date-picker
                v-model="date"
                type="daterange"
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="changeDate"
              />
            </el-form-item>
            <el-select v-model="searchParams.filter.userType" placeholder="请选择" clearable class="filter-item">
              <el-option v-for="item in userTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
            </el-select>
            <!-- <el-select v-model="searchParams.time" placeholder="在线状态" clearable class="filter-item">
              <el-option v-for="item in tagOptions" :key="item.key" :label="item.display_name" :value="item.key" />
            </el-select> -->
            <el-input
              v-model="searchParams.filter.id"
              placeholder="请输入会员ID搜索"
              class="filter-item input-item"
              clearable
              @keyup.enter="handleFilter"
            />
            <el-input
              v-model="searchParams.filter.login"
              placeholder="请输入会员账号搜索"
              class="filter-item input-item"
              clearable
              @keyup.enter="handleFilter"
            />
            <el-button v-wave class="filter-item" type="primary" @click="handleFilter"> 搜索 </el-button>
          </div>
          <!-- <div class="filter-item-right">
            <el-button class="filter-item" type="primary" @click="dialogPromptVisible = true">
              删除所有账变记录
            </el-button>
            <el-button class="filter-item" type="primary" @click="dialogPromptVisible = true">
              删除七天内未上线且未充值未绑定手机号的普通用户
            </el-button>
          </div> -->
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
          <el-table-column label="登录账号/手机号码" prop="login" width="200" align="center">
            <template #default="{ row }">
              <div class="userinfo">
                <el-avatar :size="40" :src="coverDomain + row.avatar" />
                <div class="des">
                  <span>账号：{{ row.login }}</span>
                  <span>昵称：{{ row.nickname }}</span>
                  <span>手机号：{{ row.phone }}</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="会员ID" prop="id" align="center" />
          <el-table-column label="用户类型" prop="userType" align="center">
            <template #default="{ row }">
              <span>{{ userTypeFilter(row.userType) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="关系等级" prop="userType" align="center">
            <template #default>
              <span>直属下级</span>
            </template>
          </el-table-column>
          <el-table-column label="中心钱包余额（金币）" prop="userCoin" align="center">
            <template #default="{ row }">
              <span>{{ row.userCoin.toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="游戏钱包余额（金币）" prop="gameCoin" align="center">
            <template #default="{ row }">
              <span>{{ row.gameCoin.toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="中心钱包充值（金币）" prop="totalRecharge" align="center" />
          <el-table-column label="游戏钱包充值（金币）" prop="gameTotalRecharge" align="center" />
          <el-table-column label="提现（金币）" prop="withDrawCoin" align="center" />
          <el-table-column label="创建时间" prop="createTime" align="center">
            <template #default="{ row }">
              <span>{{ parseTime(row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="IP地址" prop="ipAddress" align="center" />
          <!-- <el-table-column label="在线状态" prop="id2" align="center" /> -->
          <el-table-column label="是否正常" prop="userStatus" width="110px" align="center">
            <template #default="{ row }">
              <el-switch
                :loading="switchLoading"
                :active-value="0"
                :inactive-value="1"
                @change="handleSetStatus(row)"
                v-model="row.userStatus"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" align="center" width="200" class-name="small-padding fixed-width">
            <template #default="{ row, $index }">
              <el-button size="small" type="danger" @click="handleDialogShow('memberListEdit', 'edit', row)">
                编辑
              </el-button>
              <el-button size="small" type="danger" @click="handleDialogShow('AccountRecord', '', row)">
                账变
              </el-button>
              <el-popover :visible="row.visible" placement="top" :width="100">
                <p style="margin: 6px 0 10px">确定删除?</p>
                <div>
                  <el-button size="small" text @click="row.visible = false">否</el-button>
                  <el-button size="small" type="warning" @click="handleDelete('single', row, $index)">是</el-button>
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
        :current-row-data="secondCurrentRowData"
        @beforeUpload="beforeUpload"
        @uploadDone="uploadDone"
      ></component>
      <template #footer v-if="currentComponent !== 'AccountRecord'">
        <span class="dialog-footer">
          <el-button :loading="dialogLoading" size="large" type="primary" @click="submit">确认提交</el-button>
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
          <el-button :loading="dialogLoading" size="large" type="primary" @click="submitDelete">确认提交</el-button>
          <el-button size="large" type="default" @click="dialogPromptVisible = false">取消</el-button>
        </span>
      </template>
    </el-dialog>
  </YuLayout>
</template>

<script>
import YuLayout from '/@/components/YuLayout'
import memberListEdit from './components/memberListEdit.vue'
import AccountRecord from '/@/views/account-record/index.vue'
import AdjustLevel from './components/adjustLevel.vue'
// import { useUserStore } from '/@/store'
import { parseTime, getBJTimezoneMill } from '/@/utils'
import { apiGetMemberList, apiSetMemberStatus, apiDelMember } from '/@/api/member-manage/memberList.js'
import { imgContainer, coverDomain } from '/@/config/constant.js'
export default {
  components : {
    YuLayout,
    memberListEdit,
    AccountRecord,
    AdjustLevel
  },
  setup() {
    // const userStore = useUserStore()
    // const { imgContainer, coverDomain } = userStore
    return {
      imgContainer,
      coverDomain
    }
  },
  props : {
    currentRowData : {
      type : Object,
      default : () => ( {} )
    }
  },
  data() {
    return {
      dialogVisible : false,
      dialogPromptVisible : false,
      dialogLoading : false,
      switchLoading : false,
      statusLoading : false,
      userTypeOptions : [
        { key : 0, display_name : '所有用户' },
        { key : 1, display_name : '平台用户' },
        { key : 2, display_name : '会员用户' },
        { key : 3, display_name : 'up主' }
      ],
      tagOptions : [],
      currentComponent : 'memberListEdit',
      mode : 'edit',
      multipleSelection : [],
      secondCurrentRowData : {},
      listLoading : false,
      date : '',
      searchParams : {
        filter : {
          id : '',
          login : '',
          startTime : '',
          endTime : '',
          userType : 0,
          nickname : '',
          pid : ''
        }
      },
      list : [],
      tableParams : {
        total : 10,
        listQuery : {
          pageNo : 1,
          pageSize : 10
        },
        data : []
      }
    }
  },
  computed : {
    dialogWidth() {
      return {
        memberListEdit : '850',
        AccountRecord : '80%',
        TeamList : '80%',
        AdjustLevel : '440'
      }[this.currentComponent]
    },
    dialogTitle() {
      return {
        memberListEdit : '编辑用户信息',
        AccountRecord : '账变记录',
        TeamList : '下级成员',
        AdjustLevel : '移线'
      }[this.currentComponent]
    }
  },
  created() {
    this.searchParams.filter.pid = this.currentRowData.id
    this.getList()
  },
  mounted() {},
  methods : {
    async getList() {
      const searchParams = {
        filter : {}
      }
      for ( const key in this.searchParams.filter ) {
        if ( Object.hasOwnProperty.call( this.searchParams.filter, key ) ) {
          if ( this.searchParams.filter[`${key}`] ) {
            searchParams.filter[`${key}`] = this.searchParams.filter[`${key}`]
          }
        }
      }

      this.listLoading = true

      const params = {
        ...this.tableParams.listQuery,
        ...searchParams
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
    async setMemberStatus( type ) {
      const params = {
        ids : [],
        userStatus : type
      }
      if ( this.multipleSelection.length === 0 ) {
        // eslint-disable-next-line no-undef
        ElMessage( {
          message : '请选择会员',
          type : 'error'
        } )
        return
      }
      params.ids = this.multipleSelection.map( item => {
        return item.id
      } )

      this.statusLoading = true
      apiSetMemberStatus( { data : params } )
        .then( res => {
          this.statusLoading = false
          if ( res ) {
            this.getList()
          }
        } )
        .catch( err => {
          console.log( err )
          this.statusLoading = false
        } )
    },
    async handleSetStatus( row ) {
      const params = {
        ids : [row.id],
        userStatus : row.userStatus
      }
      this.switchLoading = true
      apiSetMemberStatus( { data : params } )
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
    handleDelete( type, row, index ) {
      const params = {
        ids : [],
        delStatus : 2
      }
      if ( type === 'single' ) {
        params.ids.push( row.id )
      } else {
        if ( this.multipleSelection.length === 0 ) {
          // eslint-disable-next-line no-undef
          ElMessage( {
            message : '请选择会员',
            type : 'error'
          } )
          return
        }
        params.ids = this.multipleSelection.map( item => {
          return item.id
        } )
      }

      apiDelMember( params ).then( res => {
        if ( res ) {
          this.getList()
        }
      } )
    },
    handleDialogShow( type, mode = 'edit', row = {} ) {
      this.currentComponent = type
      this.mode = mode
      this.secondCurrentRowData = row
      this.dialogVisible = true
    },
    changeDate( date ) {
      // this.searchParams.startTime = date[0].getTime() / 1000
      if ( date && date.length > 0 ) {
        this.searchParams.filter.startTime = getBJTimezoneMill( date[0] ) / 1000
        this.searchParams.filter.endTime = getBJTimezoneMill( date[1] ) / 1000
      } else {
        this.searchParams.filter.startTime = ''
        this.searchParams.filter.endTime = ''
      }
      this.handleFilter()
    },
    handleFilter() {
      this.tableParams.listQuery.pageNo = 1
      this.getList()
    },
    userTypeFilter( id ) {
      if ( !id || this.userTypeOptions.length === 0 ) {
        return ''
      }
      const obj = this.userTypeOptions.filter( item => {
        return item.key === id
      } )[0]
      return obj ? obj.display_name : ''
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
    },
    parseTime
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
  .input-item {
    width: 160px;
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

.pagination-center {
  margin: 30px 0 0px;
}

.el-table {
  flex: 1;
  & ::v-deep(th.el-table__cell),
  ::v-deep(td.el-table__cell) {
    position: static;
  }
}

.userinfo {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  .des {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    text-align: left;
    margin-left: 10px;
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
