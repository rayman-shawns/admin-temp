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
            <el-select
              v-model="searchParams.filter.agentId"
              placeholder="所属代理"
              @change="handleFilter"
              clearable
              class="filter-item"
            >
              <el-option label="无" :value="0"></el-option>
              <el-option v-for="item in userAgentOptions" :key="item.id" :label="item.account" :value="item.id" />
            </el-select>
            <el-select
              v-model="searchParams.filter.terminal"
              placeholder="所属终端"
              @change="handleFilter"
              clearable
              class="filter-item"
            >
              <el-option
                v-for="item in userTerminalOptions"
                :key="item.key"
                :label="item.display_name"
                :value="item.key"
              />
            </el-select>
            <el-select
              v-model="searchParams.filter.userType"
              placeholder="请选择"
              @change="handleFilter"
              clearable
              class="filter-item"
            >
              <el-option v-for="item in userTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
            </el-select>
            <!-- <el-select v-model="searchParams.time" placeholder="在线状态" clearable class="filter-item">
              <el-option v-for="item in tagOptions" :key="item.key" :label="item.display_name" :value="item.key" />
            </el-select> -->
            <el-input
              v-model="searchParams.filter.phone"
              placeholder="请输入会员手机搜索"
              class="filter-item input-item"
              clearable
              @keyup.enter="handleFilter"
            />
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
            <el-button v-wave class="filter-item" :loading="listLoading" type="primary" @click="handleFilter">
              搜索
            </el-button>
          </div>
          <div class="filter-item-right">
            <!-- <el-button class="filter-item" type="primary" @click="dialogPromptVisible = true">
              删除所有账变记录
            </el-button> -->
            <el-button class="filter-item" type="primary" @click="dialogPromptVisible = true">
              删除七天之前的游客用户
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
          <el-table-column label="登录账号/手机号码" prop="login" width="230" align="center">
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
          <el-table-column label="会员ID" min-width="160" prop="id" align="center" />
          <el-table-column label="用户类型" min-width="90" prop="userType" align="center">
            <template #default="{ row }">
              <span>{{ userTypeFilter(row.userType) }}</span>
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
          <el-table-column label="所属代理" prop="agentId" min-width="100" align="center">
            <template #default="{ row }">
              <span>{{ userAgentFilter(row.agentId) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="用户终端" show-overflow-tooltip prop="terminal" min-width="120" align="center">
            <template #default="{ row }">
              <span>{{ userTerminalFilter(row.terminal) }}-- {{ row.browser }}</span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" min-width="170" prop="createTime" align="center">
            <template #default="{ row }">
              <span>{{ parseTime(row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="IP地址" min-width="120" prop="ipAddress" align="center" />
          <!-- <el-table-column label="在线状态" prop="id2" align="center" /> -->
          <el-table-column label="是否正常" prop="userStatus" width="90px" align="center">
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
          <el-table-column label="操作" fixed="right" align="center" width="270" class-name="small-padding fixed-width">
            <template #default="{ row, $index }">
              <el-button
                size="small"
                type="danger"
                :loading="editLoading"
                @click="handleDialogShow('memberListEdit', 'edit', row)"
              >
                编辑
              </el-button>
              <el-button
                size="small"
                type="danger"
                :loading="editLoading"
                @click="handleDialogShow('TeamList', '', row)"
              >
                团队
              </el-button>
              <el-button
                size="small"
                type="danger"
                :loading="editLoading"
                @click="handleDialogShow('AccountRecord', '', row)"
              >
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

        <div class="footer-total">
          <div class="item">
            <span>总游客用户</span>
            <span>{{ userBaseStaticis.guestCount }}</span>
          </div>
          <div class="item">
            <span>今日游客</span>
            <span>{{ userBaseStaticis.guestTotal }}</span>
          </div>
          <div class="item">
            <span>今日新增注册</span>
            <span>{{ userBaseStaticis.dayAdd }}</span>
          </div>
          <div class="item">
            <span>今日活跃人数</span>
            <span>{{ userBaseStaticis.activeNumber }}</span>
          </div>
          <div class="item">
            <span>今日IP</span>
            <span>{{ userBaseStaticis.ipCount }}</span>
          </div>
          <div class="item">
            <span>中心钱包余额</span>
            <span>{{ userBaseStaticis.walletBalance }}</span>
          </div>
          <div class="item">
            <span>游戏钱包余额</span>
            <span>{{ userBaseStaticis.gameWalletBalance }}</span>
          </div>
          <div class="item">
            <span>中心钱包充值</span>
            <span>{{ userBaseStaticis.walletRecharge }}</span>
          </div>
          <div class="item">
            <span>游戏钱包充值</span>
            <span>{{ userBaseStaticis.gameWalletRecharge }}</span>
          </div>
          <div class="item">
            <span>提现</span>
            <span>{{ userBaseStaticis.gameWalletWithdraw }}</span>
          </div>
        </div>
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
        @beforeUpload="beforeUpload"
        @uploadDone="uploadDone"
      ></component>
      <template #footer v-if="!['AccountRecord', 'TeamList'].includes(currentComponent)">
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
// import { useUserStore } from '/@/store'
import TeamList from './teamList.vue'
import { parseTime, getBJTimezoneMill, dayjs2 } from '/@/utils'
import {
  apiGetMemberList,
  apiSetMemberStatus,
  apiDelMember,
  apiGetGuestCount,
  apiGetUserBaseStaticis,
  apiDelGuest
} from '/@/api/member-manage/memberList.js'
import { apiGetAgentDetailList } from '/@/api/agent-manage/agentList.js'
import { imgContainer, coverDomain } from '/@/config/constant.js'
export default {
  components : {
    YuLayout,
    memberListEdit,
    AccountRecord,
    TeamList
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
      dialogPromptVisible : false,
      dialogLoading : false,
      switchLoading : false,
      statusLoading : false,
      editLoading : false,
      userTypeOptions : [
        { key : 0, display_name : '所有用户' },
        { key : 1, display_name : '平台用户' },
        { key : 2, display_name : '会员用户' },
        { key : 3, display_name : 'up主' }
      ],
      userTerminalOptions : [
        { key : 1, display_name : 'H5' },
        { key : 2, display_name : 'IOS' },
        { key : 3, display_name : 'ANDROID' }
        // { key : 4, display_name : 'PC' }
      ],
      // userTerminalOptions : [
      //   { key : 4, display_name : '--XX浏览器' },
      //   { key : 1, display_name : 'Android/IOS-XX浏览器' },
      //   // { key : 1, display_name : 'IOS-XX浏览器' },
      //   { key : 2, display_name : 'IOS轻量版' },
      //   { key : 3, display_name : '安卓APK' }
      // ],
      userAgentOptions : [],
      tagOptions : [],
      currentComponent : 'memberListEdit',
      currentRowData : {},
      mode : 'edit',
      multipleSelection : [],
      listLoading : false,
      guestCount : 0,
      userBaseStaticis : {},
      date : '',
      searchParams : {
        filter : {
          id : '',
          login : '',
          startTime : '',
          endTime : '',
          userType : 0,
          nickname : '',
          phone : '',
          terminal : '',
          agentId : ''
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
        TeamList : '90%'
      }[this.currentComponent]
    },
    dialogTitle() {
      return {
        memberListEdit : '编辑用户信息',
        AccountRecord : '账变记录',
        TeamList : '下级成员'
      }[this.currentComponent]
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    this.$nextTick( () => {
      // this.getGuestCount()
      this.getUserBaseStaticis()
      this.getAgentDetailList()
    } )
  },
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
    async getAgentDetailList() {
      const params = {
        pageNo : 1,
        pageSize : 1000,
        filter : {
          level : 1
        }
      }
      try {
        const res = await apiGetAgentDetailList( params )
        this.userAgentOptions = res.data.list
        if ( this.userAgentOptions.length > 0 ) {
          this.userAgentOptions = this.userAgentOptions.map( item => {
            item = { pAgent : item.pAgent, ...item.agent }
            return item
          } )
        }
      } catch ( error ) {}
    },
    async getGuestCount() {
      const params = {}
      try {
        const res = await apiGetGuestCount( params )
        this.guestCount = res.data.count
      } catch ( error ) {}
    },
    async getUserBaseStaticis() {
      const params = {}
      try {
        const res = await apiGetUserBaseStaticis( params )
        this.userBaseStaticis = res.data
      } catch ( error ) {}
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
      // this.editLoading = true
      // setTimeout( () => {
      //   this.editLoading = false
      // }, 500 )
      this.currentComponent = type
      this.mode = mode
      this.currentRowData = row
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
    userAgentFilter( id ) {
      if ( !id || this.userAgentOptions.length === 0 ) {
        return ''
      }
      const obj = this.userAgentOptions.filter( item => {
        return item.id === id
      } )[0]
      return obj ? obj.account : ''
    },
    userTerminalFilter( id ) {
      if ( !id || this.userTerminalOptions.length === 0 ) {
        return ''
      }
      const obj = this.userTerminalOptions.filter( item => {
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
      this.dialogLoading = true
      const params = {
        beginTime : 0,
        endTime : dayjs2().subtract( 7, 'day' ).unix()
      }
      apiDelGuest( params )
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
  flex-wrap: wrap;
  margin-bottom: 20px;

  .filter-item-left {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
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
  margin: 30px 0 20px;
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

.footer-total {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
  padding-top: 10px;
  padding-bottom: 10px;
  .item {
    margin-right: 20px;
    display: flex;
    flex-direction: column;
    text-align: center;
  }

  .item:nth-child(4) {
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
