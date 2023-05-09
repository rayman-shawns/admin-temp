<template>
  <YuLayout title="">
    <template #body>
      <div class="app-container">
        <div class="filter-container">
          <div class="filter-item-left">
            <el-button class="filter-item" type="primary" @click="handleDialogShow('PutedOnEdit')">
              批量调整
            </el-button>
            <el-button class="filter-item" type="primary" @click="handlePutOn('muti')"> 上架 </el-button>
            <el-button class="filter-item" type="primary" style="width: 150px" @click="handleDialogShow('PullVideo')">
              从资源库读取视频
            </el-button>
            <el-button class="filter-item" type="primary" @click="handleDialogShow('BatchAdd')"> 批量新增 </el-button>
          </div>
          <div class="filter-item-right">
            <el-select
              v-model="searchParams.hasCover"
              placeholder="有无封面"
              @change="handleFilter"
              clearable
              class="filter-item"
            >
              <el-option v-for="item in coverList" :key="item.key" :label="item.display_name" :value="item.key" />
            </el-select>
            <el-select
              v-model="searchParams.posId"
              placeholder="定位标签"
              @change="handleFilter"
              clearable
              class="filter-item"
            >
              <el-option v-for="item in posTaglist" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
            <el-select
              v-model="searchParams.playType"
              placeholder="收费模式"
              @change="handleFilter"
              clearable
              class="filter-item"
            >
              <el-option v-for="item in playTypeOptions" :key="item.key" :label="item.name" :value="item.key" />
            </el-select>
            <el-select
              v-model="searchParams.uperId"
              class="filter-item"
              clearable
              placeholder="UP主"
              @change="handleFilter"
            >
              <template v-if="uperList">
                <el-option v-for="item in uperList" :key="item.uid" :label="item.nickname" :value="item.uid" />
              </template>
            </el-select>
            <el-select
              v-model="searchParams.topicId"
              class="filter-item"
              clearable
              placeholder="视频专题"
              @change="handleFilter"
            >
              <el-option v-for="item in topicList" :key="item.topicId" :label="item.name" :value="item.topicId" />
            </el-select>
            <el-select
              v-model="searchParams.tagId"
              class="filter-item"
              clearable
              placeholder="播放标签"
              @change="handleFilter"
            >
              <el-option v-for="item in tagList" :key="item.tagId" :label="item.name" :value="item.tagId" />
            </el-select>
            <!-- <el-select
              v-model="searchParams.format"
              class="filter-item"
              clearable
              placeholder="视频板式"
              @change="handleFilter"
            >
              <el-option v-for="item in formatOptions" :key="item.key" :label="item.label" :value="item.key" />
            </el-select> -->
            <!-- <el-select
              v-model="searchParams.format"
              class="filter-item"
              clearable
              placeholder="视频时长"
              @change="handleFilter"
            >
              <el-option v-for="item in formatOptions" :key="item.key" :label="item.label" :value="item.key" />
            </el-select> -->
            <el-input
              v-model="searchParams.name"
              placeholder="请输入视频名称的关键字"
              class="filter-item input-item"
              clearable
              @keyup.enter="handleFilter"
            />
            <el-button v-wave class="filter-item" type="primary" @click="handleFilter"> 搜索 </el-button>
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
          <!-- <el-table-column label="ID" prop="id" align="center" /> -->
          <!-- <el-table-column label="视频编号" prop="videoId" align="center" /> -->
          <el-table-column label="视频标题" prop="name" align="center" />
          <el-table-column label="视频封面图" prop="cover" align="center">
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
          <el-table-column label="收费模式" prop="playType" align="center">
            <template #default="{ row }">
              {{ playTypeFilter(row.playType) }} {{ row.playType === 3 ? row.playCostCoin : '' }}
            </template>
          </el-table-column>
          <!-- <el-table-column label="子标签" prop="id" align="center" /> -->
          <el-table-column label="UP主" prop="uper" align="center">
            <template #default="{ row }">
              {{ row.uper && row.uper.nickname }}
              <!-- <span v-for="(item, index) in row.uper"
:key="item.uid + index"
                >{{ item.nickname }}{{ row.uper.length - 1 === index ? '' : ',' }}</span
              > -->
            </template>
          </el-table-column>
          <el-table-column label="视频专题" prop="topics" align="center">
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
          <el-table-column label="推荐排序" prop="priority" align="center">
            <template #default="{ row }">
              <el-input v-if="row.checked" v-model.number="row.priority" @blur="handlePriorityBlur(row)" />
              <span v-else @click="priorityFoucs(row)">{{ row.priority }}</span>
            </template>
          </el-table-column>
          <el-table-column label="视频版式" prop="width" align="center">
            <template #default="{ row }">
              {{ isHorizontal(row.width, row.height) }}
            </template>
          </el-table-column>
          <el-table-column label="视频时长" prop="duration" align="center">
            <template #default="{ row }">
              {{ formatSecondTime(row.duration) }}
            </template>
          </el-table-column>
          <el-table-column label="播放量" prop="playNum" align="center"> </el-table-column>
          <el-table-column label="收藏量" prop="favriteNum" align="center"> </el-table-column>
          <el-table-column label="点赞量" prop="likeNum" align="center"> </el-table-column>
          <el-table-column label="被踩量" prop="dsLikeNum" align="center"> </el-table-column>
          <el-table-column label="上架时间" prop="putOnTime" align="center">
            <template #default="{ row }">
              <span>{{ parseTime(row.putOnTime, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" align="center" width="140" class-name="small-padding fixed-width">
            <template #default="{ row, $index }">
              <el-button size="small" type="danger" @click="handlePutOn('single', row, $index)"> 上架 </el-button>
              <el-button size="small" type="danger" @click="handleDialogShow('PulledOffEdit', row)"> 编辑 </el-button>
              <el-button size="small" type="danger" @click="handleDelete(row, $index)"> 删除 </el-button>
              <el-button size="small" type="danger" @click="handlePreview(row)"> 预览 </el-button>
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
        :selected-row-data="multipleSelection"
        :current-row-data="currentRowData"
        :tag-topic-list="tagTopicList"
        :is="currentComponent"
        @submit="submit"
        @beforeUpload="beforeUpload"
        @uploadDone="uploadDone"
      ></component>
      <!-- <put-on-edit ref="dialog" v-if="dialogVisible" :mode="mode"></put-on-edit> -->
      <template #footer>
        <span class="dialog-footer">
          <el-button :loading="dialogLoading" size="large" type="primary" @click="submit">确认</el-button>
        </span>
      </template>
    </el-dialog>

    <div class="video-box" v-show="playerVisible">
      <div class="layer" @click="closeVideo"></div>
      <el-icon @click="closeVideo" class="icon-close" size="40"><CloseBold /></el-icon>
      <video ref="videoPlayer" class="video-js preview-video" id="video" controls v-if="playerVisible"></video>
    </div>
  </YuLayout>
</template>

<script>
import YuLayout from '/@/components/YuLayout'
import PutedOnEdit from './components/PutedOnEdit.vue'
import BatchAdd from './components/BatchAdd.vue'
import PulledOffEdit from './components/PulledOffEdit.vue'
import PullVideo from './components/PullVideo.vue'
import { formatSecondTime, formatByteSize, parseTime } from '/@/utils'
// import { useUserStore } from '/@/store'
import {
  getVideoList,
  deleteUploadedVideo,
  videoPutOn,
  editUploadedVideo,
  getM3u8
} from '/@/api/video-manage/pulledOff.js'
import { getVideoTagList } from '/@/api/video-manage/tag.js'
import { getTopicList } from '/@/api/video-manage/topic.js'
import { getAllVideoPosTagList } from '/@/api/video-manage/template.js'
import { apiGetVideoUperList } from '/@/api/video-manage/uper.js'
import { ElMessage } from 'element-plus'

// import videojs from 'video.js'
import Hls from 'hls.js'
import 'video.js/dist/video-js.css'
import { imgContainer, coverDomain } from '/@/config/constant.js'

let player = null
let hls = null

export default {
  components : {
    YuLayout,
    PutedOnEdit,
    PulledOffEdit,
    PullVideo,
    BatchAdd
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
      playerVisible : false,
      coverList : [
        { key : 2, display_name : '无' },
        { key : 1, display_name : '有' }
      ],
      formatOptions : [
        { key : '10', display_name : '横版' },
        { key : '20', display_name : '竖版' }
      ],
      tagOptions : [{ key : '10', display_name : '制服诱惑' }],
      playTypeOptions : [
        { key : 1, name : '免费' },
        { key : 2, name : 'VIP' },
        { key : 3, name : '金币' }
      ],
      currentComponent : 'PutedOnEdit',
      multipleSelection : [],
      currentRowData : {},
      listLoading : false,
      searchParams : {
        posId : '',
        tagId : '',
        topicId : '',
        uperId : '',
        name : '',
        playType : '',
        hasCover : ''
      },
      list : [],
      tableParams : {
        total : 10,
        listQuery : {
          pageNo : 1,
          pageSize : 10,
          reqType : 0,
          hasSerialNo : 1,
          putOn : 1,
          sortName : 'priority'
        },
        data : []
      },
      topicList : [],
      tagList : [],
      posTaglist : [],
      uperList : []
    }
  },
  computed : {
    dialogWidth() {
      return {
        PutedOnEdit : '70%',
        PulledOffEdit : '70%',
        PullVideo : '80%',
        BatchAdd : '70%'
      }[this.currentComponent]
    },
    dialogTitle() {
      return {
        PutedOnEdit : '批量修改',
        PulledOffEdit : '视频编辑',
        PullVideo : '从资源库读取视频',
        BatchAdd : '批量新增'
      }[this.currentComponent]
    },
    tagTopicList() {
      return {
        topicList : this.topicList,
        tagList : this.tagList,
        posTaglist : this.posTaglist,
        uperList : this.uperList
      }
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
      this.getUperList()
    } )
  },
  beforeUnmount() {
    if ( player ) {
      player.dispose()
      player = null
    }
  },
  methods : {
    async getList() {
      this.listLoading = true

      const searchParams = {}
      for ( const key in this.searchParams ) {
        if ( Object.hasOwnProperty.call( this.searchParams, key ) ) {
          if ( this.searchParams[`${key}`] !== '' ) {
            searchParams[`${key}`] = this.searchParams[`${key}`]
          }
        }
      }

      const params = {
        ...this.tableParams.listQuery,
        ...searchParams
      }

      try {
        const res = await getVideoList( params )
        this.tableParams.total = res.data.count
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
    async getTopicList() {
      const params = {
        pageNo : 1,
        pageSize : 500,
        reqType : 0
      }
      try {
        const res = await getTopicList( params )
        this.topicList = res.data.list
      } catch ( error ) {}
    },
    async getPosTagList() {
      const params = {}
      try {
        const res = await getAllVideoPosTagList( params )
        this.posTaglist = res.data.list
      } catch ( error ) {}
    },
    async getVideoTagList() {
      const params = {
        pageNo : 1,
        pageSize : 500,
        reqType : 0
      }
      try {
        const res = await getVideoTagList( params )
        this.tagList = res.data.list
      } catch ( error ) {}
    },
    async getUperList() {
      const params = {
        pageNo : 1,
        pageSize : 500,
        level : 0
      }
      try {
        const res = await apiGetVideoUperList( params )
        this.uperList = res.data.list
      } catch ( error ) {}
    },
    beforeUpload() {
      this.dialogLoading = true
    },
    uploadDone() {
      this.dialogLoading = false
    },
    handleDialogShow( type, row = {} ) {
      if ( ( type === 'PutedOnEdit' || type === 'BatchAdd' ) && this.multipleSelection.length === 0 ) {
        ElMessage( {
          message : '请选择需要调整的视频',
          type : 'error'
        } )
        return
      }
      this.currentComponent = type
      this.currentRowData = row
      this.dialogVisible = true
    },
    handleFilter() {
      this.tableParams.listQuery.pageNo = 1
      this.getList()
    },
    handlePutOn( type, row, index ) {
      const params = {
        videoId : [],
        put : 2
      }
      if ( type === 'single' ) {
        params.videoId.push( row.videoId )
      } else {
        if ( this.multipleSelection.length === 0 ) {
          // eslint-disable-next-line no-undef
          ElMessage( {
            message : '请选择需要上架的视频',
            type : 'error'
          } )
          return
        }
        params.videoId = this.multipleSelection.map( item => {
          return item.videoId
        } )
      }

      videoPutOn( params ).then( res => {
        if ( res ) {
          this.getList()
        }
      } )
    },
    priorityFoucs( row ) {
      row.checked = !row.checked
    },
    handlePriorityBlur( row ) {
      row.checked = false
      const params = {
        ...row,
        reqType : 0
      }
      editUploadedVideo( params ).then( res => {
        if ( res ) {
          this.getList()
        }
      } )
    },
    handleDelete( row ) {
      const params = {
        videoId : [],
        reqType : 0
      }
      params.videoId.push( row.videoId )

      deleteUploadedVideo( params ).then( res => {
        if ( res ) {
          this.getList()
        }
      } )
    },
    playTypeFilter( id ) {
      if ( !id ) {
        return ''
      }
      const obj = this.playTypeOptions.filter( item => {
        return item.key * 1 === id
      } )[0]
      return obj ? obj.name : ''
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
    handlePreview( row ) {
      this.initVideoPlayer( row )
      this.playerVisible = true
    },
    async initVideoPlayer( row ) {
      // const key = `${location.origin}/api/video/${row.videoId}/enc-key`
      const key = `${coverDomain}/${row.key}`
      const type = 'application/x-mpegURL' // application/vnd.apple.mpegurl, application/x-mpegURL
      const file = await getM3u8( row.videoId )
      const newFile = file.replace( /(URI=")(.*?)(")/g, `$1${key}$3` )
      var blob = new Blob( [newFile], { type } )
      const src = URL.createObjectURL( blob )
      console.log( src )

      player = document.getElementById( 'video' )
      hls = new Hls()
      hls.attachMedia( player )
      hls.on( Hls.Events.MEDIA_ATTACHED, function() {
        hls.loadSource( src )
        hls.on( Hls.Events.MANIFEST_PARSED, function( event, data ) {
          player.play()
        } )
      } )
      // const options = {
      //   autoplay : true,
      //   controls : true,
      //   muted : true,
      //   preload : 'auto',
      //   poster : `${this.coverDomain}${row.cover}`,
      //   language : 'zh-CN',
      //   playbackRates : [0.5, 1.0, 1.5, 2.0],
      //   sources : [
      //     {
      //       // src : 'http://vjs.zencdn.net/v/oceans.mp4',
      //       // src : 'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
      //       src : row.videoId ? `/api/video/${row.videoId}/play` : '',
      //       type : 'application/x-mpegURL',
      //       withCredentials : false
      //     }
      //   ]
      // }
      // this.$nextTick( () => {
      //   if ( player && row?.videoId ) {
      //     player.src( { src : row.videoId ? `/api/video/${row.videoId}/play` : '', type : 'application/x-mpegURL' } )
      //     player.load()
      //   } else {
      //     player = videojs( this.$refs.videoPlayer, options, () => {
      //       console.log( 'onPlayerReady', player )
      //     } )
      //   }
      // } )
    },
    closeVideo() {
      if ( player ) {
        // player.paused()
        // player.pause()
      }
      hls.destroy()
      hls = null
      this.playerVisible = false
    },
    formatSecondTime,
    formatByteSize,
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
.layer {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.2);
  z-index: 100;
}
.icon-close {
  cursor: pointer;
  position: fixed;
  right: 20%;
  top: 10%;
  z-index: 101;
}
.preview-video {
  position: fixed;
  z-index: 200;
  left: 50%;
  top: 50%;
  width: 600px;
  height: 400px;
  margin-left: -300px;
  margin-top: -200px;
}
</style>
