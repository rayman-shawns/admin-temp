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
          <el-table-column label="显示终端" prop="t" align="center">
            <template #default="{ row }">
              <span>{{ terminalFilter(row.t) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="广告位置" prop="posType" align="center">
            <template #default="{ row }">
              <p>{{ posTypeFilter(row.posType) }}</p>
              <p v-if="row.posType === 10">{{ videoPosIdsFilter(row.videoPosIds) }}</p>
            </template>
          </el-table-column>
          <!-- <el-table-column label="定位标签" prop="videoPosIds" align="center">
            <template #default="{ row }">
              <span v-if="row.posType===10">{{ videoPosIdsFilter(row.videoPosIds) }}</span>
            </template>
          </el-table-column> -->
          <el-table-column label="广告标题" prop="title" align="center" />
          <el-table-column label="广告图片" prop="pic" align="center">
            <template #default="{ row }">
              <el-image
                style="width: 100px; height: 100px"
                :src="coverDomain + row.pic"
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
          <el-table-column label="跳转链接" prop="href" align="center" />
          <el-table-column label="点击次数" prop="id2" align="center" />
          <el-table-column label="到期时间" prop="endTime" align="center">
            <template #default="{ row }">
              <span>{{ parseTime(row.endTime, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="推送设备" prop="pushTypes" align="center">
            <template #default="{ row }">
              <span>{{ deviceFilter(row.pushTypes) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="排序（降序）" prop="priority" align="center">
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
      <edit
        ref="dialog"
        v-if="dialogVisible"
        :mode="mode"
        :current-row-data="currentRowData"
        :pos-tag-list="posTaglist"
      ></edit>
      <template #footer>
        <span class="dialog-footer">
          <el-button :loading="dialogLoading" size="large" type="primary" @click="submit">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </YuLayout>
</template>

<script>
import { parseTime } from '/@/utils'
import YuLayout from '/@/components/YuLayout'
import edit from './components/listEdit'
// import { useUserStore } from '/@/store'
import { apiGetAdvertiseList, apiDeleteAdvertise, apiEditAdvertise } from '/@/api/advertisement-manage/list.js'
import { getAllVideoPosTagList } from '/@/api/video-manage/template.js'
import { imgContainer, coverDomain } from '/@/config/constant.js'

export default {
  components : {
    YuLayout,
    edit
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
        posType : 10,
        videoPosId : 1
      },
      tableParams : {
        total : 10,
        listQuery : {
          pageNo : 1,
          pageSize : 10
        },
        data : []
      },
      posTaglist : [
        {
          name : '',
          id : ''
        }
      ],
      terminal : [
        { key : 1, display_name : '移动端' }
        // { key : 2, display_name : 'PC端' }
      ],
      devices : [
        { key : 1, display_name : 'H5' },
        { key : 2, display_name : 'ios' },
        { key : 3, display_name : 'android' }
        // { key : 4, display_name : 'pc' }
      ],
      locationOptions : [
        { key : 5, display_name : '启动图' },
        { key : 10, display_name : '首页banner' },
        { key : 30, display_name : '发现banner' },
        { key : 20, display_name : '色点banner' },
        { key : 40, display_name : '游戏banner' },
        { key : 50, display_name : '模块穿插' },
        { key : 60, display_name : '列表穿插' },
        { key : 70, display_name : '播放详情页' }
      ]
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
        add : '添加广告',
        edit : '编辑广告'
      }[this.mode]
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    this.$nextTick( () => {
      this.getPosTagList()
    } )
  },
  methods : {
    async getList() {
      this.listLoading = true

      const params = {
        ...this.tableParams.listQuery
      }

      try {
        const res = await apiGetAdvertiseList( params )
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
    async getPosTagList() {
      const params = {
        pid : -1
      }
      try {
        const res = await getAllVideoPosTagList( params )
        const tag = [
          {
            id : -11,
            name : '最新',
            posType : 1
          },
          {
            id : -22,
            name : '最热',
            posType : 1
          }
        ]
        res.data.list = res.data.list.filter( item => {
          return item.status === 2
        } )
        this.posTaglist = [...tag, ...res.data.list]
      } catch ( error ) {}
    },
    priorityFoucs( row ) {
      row.checked = !row.checked
    },
    handlePriorityBlur( row ) {
      row.checked = false
      const params = {
        data : { ...row }
      }
      apiEditAdvertise( params ).then( res => {
        if ( res ) {
          this.getList()
        }
      } )
    },
    handleSetStatus( row ) {
      const params = {
        data : { ...row }
      }
      this.switchLoading = true
      apiEditAdvertise( params )
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
    terminalFilter( id ) {
      if ( !id || this.terminal.length === 0 ) {
        return ''
      }
      const obj = this.terminal.filter( item => {
        return item.key === id
      } )[0]
      return obj ? obj.display_name : ''
    },
    posTypeFilter( id ) {
      if ( !id || this.locationOptions.length === 0 ) {
        return ''
      }
      const obj = this.locationOptions.filter( item => {
        return item.key === id
      } )[0]
      return obj ? obj.display_name : ''
    },
    deviceFilter( pushTypes ) {
      if ( !pushTypes || pushTypes.length === 0 || this.devices.length === 0 ) {
        return ''
      }
      const arr = this.devices.filter( item => {
        return pushTypes.includes( item.key )
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
    videoPosIdsFilter( videoPosIds ) {
      if ( !videoPosIds || videoPosIds.length === 0 || this.posTaglist.length === 0 ) {
        return ''
      }
      const arr = this.posTaglist.filter( item => {
        return videoPosIds.includes( item.id )
      } )
      let str = ''
      if ( arr && arr.length > 0 ) {
        str = arr
          .map( item => {
            return item.name
          } )
          .join( ',' )
      }
      return str
    },
    handleFilter() {
      this.tableParams.listQuery.page = 1
      this.getList()
    },
    async handleDelete( row, index ) {
      this.listLoading = true
      const params = {
        ids : [row.id]
      }
      apiDeleteAdvertise( params )
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
