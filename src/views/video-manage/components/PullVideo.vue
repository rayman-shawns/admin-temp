<template>
  <YuLayout title="">
    <template #body>
      <el-form v-loading="loading" ref="form" inline :model="form" label-position="left" label-width="70px">
        <el-form-item class="upload-block" label="录入水印"></el-form-item>
        <el-form-item class="upload-block" label="">
          <div class="upload">
            <span>左上角</span>
            <upload-img
              :default-img="coverDomain + form.avatar"
              @onSuccess="getUploadRes($event, 'avatar')"
              @beforeUpload="beforeUpload"
              @uploadDone="uploadDone"
            />
          </div>
          <div class="upload">
            <span>右上角</span>
            <upload-img
              :default-img="coverDomain + form.avatar"
              @onSuccess="getUploadRes($event, 'avatar')"
              @beforeUpload="beforeUpload"
              @uploadDone="uploadDone"
            />
          </div>
          <div class="upload">
            <span>左下角</span>
            <upload-img
              :default-img="coverDomain + form.avatar"
              @onSuccess="getUploadRes($event, 'avatar')"
              @beforeUpload="beforeUpload"
              @uploadDone="uploadDone"
            />
          </div>
          <div class="upload">
            <span>右上角</span>
            <upload-img
              :default-img="coverDomain + form.avatar"
              @onSuccess="getUploadRes($event, 'avatar')"
              @beforeUpload="beforeUpload"
              @uploadDone="uploadDone"
            />
          </div>
        </el-form-item>
      </el-form>
      <div class="app-container">
        <div class="filter-container">
          <div class="filter-item-right">
            <el-button v-wave class="filter-item" type="primary" @click="handleImport"> 导入 </el-button>
            <el-select v-model="searchParams.posId" placeholder="定位标签" clearable class="filter-item">
              <el-option v-for="item in posTaglist" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
            <el-select v-model="searchParams.topicId" placeholder="视频专题" clearable class="filter-item">
              <el-option v-for="item in topicList" :key="item.topicId" :label="item.name" :value="item.topicId" />
            </el-select>
            <el-select v-model="searchParams.tagId" placeholder="播放标签" clearable class="filter-item">
              <el-option v-for="item in tagList" :key="item.tagId" :label="item.name" :value="item.tagId" />
            </el-select>
            <el-input
              v-model="searchParams.name"
              placeholder="请输入视频名称的关键字"
              class="filter-item input-item"
              clearable
              @keyup.enter="handleFilter"
            />
            <el-button v-wave class="filter-item" type="primary" @click="handleFilter"> 搜索 </el-button>
            <el-button v-wave class="filter-item" type="primary" @click="handleResetFilter"> 重置 </el-button>
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
          <el-table-column type="selection" width="45" />
          <!-- <el-table-column label="视频编号" prop="videoId" align="center" /> -->
          <el-table-column label="名称" prop="name" align="center" />
          <el-table-column label="封面" prop="cover" align="center">
            <template #default="{ row }">
              <el-image
                style="width: 100px; height: 100px"
                :src="coverDomain + row.cover"
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
          <el-table-column label="定位标签" prop="videoPoses" align="center">
            <template #default="{ row }">
              <span v-for="(item, index) in row.videoPoses"
:key="item.id"
                >{{ item.name }}{{ row.videoPoses.length - 1 === index ? '' : ',' }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="专题" prop="topics" align="center">
            <template #default="{ row }">
              <span v-for="(item, index) in row.topics"
:key="item.topicId + index"
                >{{ item.name }}{{ row.topics.length - 1 === index ? '' : ',' }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="播放标签" prop="videoTags" align="center">
            <template #default="{ row }">
              <span v-for="(item, index) in row.videoTags"
:key="item.tagId"
                >{{ item.name }}{{ row.videoTags.length - 1 === index ? '' : ',' }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="视频时长" prop="duration" align="center">
            <template #default="{ row }">
              {{ formatSecondTime(row.duration) }}
            </template>
          </el-table-column>
          <!-- <el-table-column label="视频版式" prop="width" align="center">
            <template #default="{ row }">
              {{ isHorizontal(row.width, row.height) }}
            </template>
          </el-table-column>
          <el-table-column label="视频大小" prop="size" align="center">
            <template #default="{ row }">
              {{ formatByteSize(row.size) }}
            </template>
          </el-table-column>
          <el-table-column label="分辨率" prop="width" align="center">
            <template #default="{ row }">
              {{ `${row.width}*${row.height}` }}
            </template>
          </el-table-column> -->
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
  </YuLayout>
</template>
<script>
import YuLayout from '/@/components/YuLayout'
import UploadImg from '/@/components/UploadImg'
import { formatSecondTime, formatByteSize } from '/@/utils'
// import { useUserStore } from '/@/store'
import { videoImportToH5, getVideoList } from '/@/api/video-manage/pulledOff.js'
import { getVideoTagList } from '/@/api/video-manage/tag.js'
import { getTopicList } from '/@/api/video-manage/topic.js'
import { getVideoPosTagList } from '/@/api/video-manage/template.js'
import { imgContainer, coverDomain } from '/@/config/constant.js'

export default {
  components : {
    YuLayout,
    UploadImg
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
    selectedRowData : {
      type : Array,
      default : () => []
    },
    currentRowData : {
      type : Object,
      default : () => ( {} )
    },
    tagTopicList : {
      type : Object,
      default : () => ( {
        topicList : [],
        tagList : [],
        posTaglist : []
      } )
    }
  },
  data() {
    return {
      loading : false,
      multipleSelection : [],
      listLoading : false,
      searchParams : {
        posId : '',
        tagId : '',
        topicId : '',
        name : ''
      },
      form : {
        avatar : ''
      },
      list : [],
      tableParams : {
        total : 10,
        listQuery : {
          pageNo : 1,
          pageSize : 100,
          reqType : 1,
          hasSerialNo : 1
        },
        data : []
      },
      topicList : [
        {
          name : '',
          topicId : ''
        }
      ],
      tagList : [
        {
          name : '',
          tagId : ''
        }
      ],
      posTaglist : [
        {
          name : '',
          id : ''
        }
      ]
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    this.$nextTick( () => {
      this.getVideoTagList()
      this.getTopicList()
      this.getPosTagList()
    } )
  },
  methods : {
    async getList() {
      this.listLoading = true
      const params = {
        ...this.tableParams.listQuery,
        ...this.searchParams
      }

      try {
        const res = await getVideoList( params )
        this.tableParams.total = res.data.count
        this.list = res.data.list
        this.listLoading = false
      } catch ( error ) {
        this.listLoading = false
      }
    },
    handleResetFilter() {
      this.tableParams.listQuery.pageNo = 1
      this.searchParams = {
        posId : '',
        tagId : '',
        topicId : '',
        name : ''
      }
      this.getList()
    },
    async getTopicList() {
      const params = {
        pageNo : 1,
        pageSize : 500,
        reqType : 1
      }
      try {
        const res = await getTopicList( params )
        this.topicList = res.data.list
      } catch ( error ) {}
    },
    async getPosTagList() {
      const params = {
        pageNo : 1,
        pageSize : 500,
        reqType : 1
      }
      try {
        const res = await getVideoPosTagList( params )
        this.posTaglist = res.data.list
      } catch ( error ) {}
    },
    async getVideoTagList() {
      const params = {
        pageNo : 1,
        pageSize : 500,
        reqType : 1
      }
      try {
        const res = await getVideoTagList( params )
        this.tagList = res.data.list
      } catch ( error ) {}
    },
    handleFilter() {
      this.tableParams.listQuery.pageNo = 1
      this.getList()
    },
    isHorizontal( width, height ) {
      return width * 1 >= height * 1 ? '横版' : '竖版'
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
    // 获取上传文件成功返回的数据
    getUploadRes( file, key ) {
      console.log( 'getUploadRes', file, file.name, key )
      this.form[key] = this.imgContainer ? `/${this.imgContainer}/${file.name}` : `/${file.name}`
      this.$emit( 'uploadDone' )
    },
    beforeUpload() {
      this.$emit( 'beforeUpload' )
    },
    uploadDone() {
      this.$emit( 'uploadDone' )
    },
    handleImport() {
      this.$emit( 'submit' )
    },
    submitForm() {
      // 给父组件返回promise对象用于回调
      // eslint-disable-next-line no-async-promise-executor
      return new Promise( async resolve => {
        try {
          const videoId =
            this.multipleSelection &&
            this.multipleSelection.map( item => {
              return item.videoId
            } )
          const params = {
            videoId
          }
          await videoImportToH5( params )
          resolve( true )
        } catch ( error ) {
          resolve( false )
        }
      } )
    },
    formatSecondTime,
    formatByteSize
  }
}
</script>
<style scoped lang="scss">
.app-container {
  margin-top: 40px;
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
    width: 180px;
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
