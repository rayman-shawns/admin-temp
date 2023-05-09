<template>
  <div>
    <el-form v-loading="loading" ref="form" :model="form" label-position="left" label-width="100px">
      <el-tabs v-model="activeTabName" type="card" @tab-click="handleClick">
        <el-tab-pane label="基础信息" name="basic">
          <el-form-item label="视频标题">
            <el-input type="text" placeholder="请输入" v-model="form.name" />
          </el-form-item>
          <el-form-item label="新的定位标签">
            <el-checkbox
              @change="changeClearHandle('pos', $event)"
              class="clear-checkbox"
              v-model="form.resetPos"
              label="无"
              :true-label="1"
              :false-label="0"
              size="large"
            ></el-checkbox>
            <el-checkbox-group v-model="form.posId" :disabled="form.resetPos === 1">
              <el-checkbox
                :label="item.id"
                v-for="item in tagTopicListComputed.posTaglist"
                :key="item.id"
                name="type"
                >{{ item.name }}</el-checkbox
              >
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="新的视频专题">
            <el-checkbox
              @change="changeClearHandle('topic', $event)"
              class="clear-checkbox"
              v-model="form.resetTopic"
              label="无"
              :true-label="1"
              :false-label="0"
              size="large"
            ></el-checkbox>
            <el-checkbox-group v-model="form.topicId" :disabled="form.resetTopic === 1">
              <el-checkbox
                :label="item.topicId"
                v-for="item in tagTopicListComputed.topicList"
                :key="item.topicId"
                name="type"
                >{{ item.name }}</el-checkbox
              >
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="新的UP主">
            <el-checkbox
              @change="changeClearHandle('uper', $event)"
              class="clear-checkbox"
              v-model="form.resetUp"
              label="无"
              :true-label="1"
              :false-label="0"
              size="large"
            ></el-checkbox>
            <el-radio-group v-model="form.uperId" :disabled="form.resetUp === 1">
              <el-radio :label="item.uid" v-for="item in tagTopicListComputed.uperList" :key="item.uid">{{
                item.nickname
              }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="新的播放标签">
            <el-checkbox
              @change="changeClearHandle('tag', $event)"
              class="clear-checkbox"
              v-model="form.resetTag"
              label="无"
              :true-label="1"
              :false-label="0"
              size="large"
            />
            <el-checkbox-group v-model="form.tagId" :disabled="form.resetTag === 1">
              <el-checkbox
                :label="item.tagId"
                v-for="item in tagTopicListComputed.tagList"
                :key="item.tagId"
                name="type"
                >{{ item.name }}</el-checkbox
              >
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="收费模式">
            <el-radio-group v-model="form.playType">
              <el-radio v-for="item in playTypeOptions"
:key="item.key"
:label="item.key"
                >{{ item.name }}
                <el-input
                  v-if="item.key === 3"
                  class="checkmode"
                  type="text"
                  :readonly="form.playType !== 3"
                  placeholder="请输入"
                  v-model.number="form.playCostCoin"
              /></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="封面图">
            <upload-img
              btn-text="上传封面"
              :default-img="coverDomain + form.cover"
              @onSuccess="getUploadRes($event, 'cover')"
              @beforeUpload="beforeUpload"
              @uploadDone="uploadDone"
            />
          </el-form-item>
          <!-- <el-form-item label="地址">
            <el-input type="text" placeholder="请输入" v-model="form.no" />
          </el-form-item>
          <el-form-item label="视频文件路径">
            <el-input type="text" placeholder="请输入" v-model="form.no" />
          </el-form-item> -->
          <el-form-item class="interval-block" label="上架时间">
            <el-date-picker v-model="date" class="filter-item" type="datetime" clearable placeholder="请选择日期" />
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="统计信息" name="statistics">
          <el-form-item class="interval-block" label="播放量">
            <!-- <el-button>随机区间</el-button> -->
            <div class="interval">
              <el-input type="text" placeholder="请输入" clearable v-model.number="countMode.minPlayNum" /> ~
              <el-input type="text" placeholder="请输入" clearable v-model.number="countMode.maxPlayNum" />
            </div>
            <div class="des">输入的区间内，随机给数量</div>
            <el-radio-group class="clear" v-model="countMode.playNumMode">
              <el-radio v-for="item in countModeOptions" :key="item.key" :label="item.key">{{ item.name }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item class="interval-block" label="收藏量">
            <!-- <el-button>随机区间</el-button> -->
            <div class="interval">
              <el-input type="text" placeholder="请输入" clearable v-model.number="countMode.minFavoriteNum" /> ~
              <el-input type="text" placeholder="请输入" clearable v-model.number="countMode.maxFavoriteNum" />
            </div>
            <div class="des">输入的区间内，随机给数量</div>
            <el-radio-group class="clear" v-model="countMode.favoriteNumMode">
              <el-radio v-for="item in countModeOptions" :key="item.key" :label="item.key">{{ item.name }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item class="interval-block" label="点赞量">
            <!-- <el-button>随机区间</el-button> -->
            <div class="interval">
              <el-input type="text" placeholder="请输入" clearable v-model.number="countMode.minLikeNum" /> ~
              <el-input type="text" placeholder="请输入" clearable v-model.number="countMode.maxLikeNum" />
            </div>
            <div class="des">输入的区间内，随机给数量</div>
            <el-radio-group class="clear" v-model="countMode.likeNumMode">
              <el-radio v-for="item in countModeOptions" :key="item.key" :label="item.key">{{ item.name }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item class="interval-block" label="被踩量">
            <!-- <el-button>随机区间</el-button> -->
            <div class="interval">
              <el-input type="text" placeholder="请输入" clearable v-model.number="countMode.minDisLikeNum" /> ~
              <el-input type="text" placeholder="请输入" clearable v-model.number="countMode.maxDisLikeNum" />
            </div>
            <div class="des">输入的区间内，随机给数量</div>
            <el-radio-group class="clear" v-model="countMode.disLikeNumMode">
              <el-radio v-for="item in countModeOptions" :key="item.key" :label="item.key">{{ item.name }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </div>
</template>
<script>
import UploadImg from '/@/components/UploadImg'
// import { useUserStore } from '/@/store'
import { editUploadedVideo } from '/@/api/video-manage/pulledOff.js'
import { batchStatisticsVideos } from '/@/api/video-manage/pulledOn.js'
import { imgContainer, coverDomain } from '/@/config/constant.js'
export default {
  components : { UploadImg },
  setup() {
    // const userStore = useUserStore()
    // const { imgContainer, coverDomain } = userStore
    return {
      imgContainer,
      coverDomain
    }
  },
  props : {
    mode : {
      type : String,
      default : 'edit'
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
        posTaglist : [],
        uperList : []
      } )
    }
  },
  data() {
    return {
      loading : false,
      activeTabName : 'basic',
      date : '',
      form : {
        videoId : '',
        name : '',
        cover : '',
        reqType : 0,
        tagId : [],
        posId : [],
        uperId : '',
        topicId : [],
        playType : 0,
        playCostCoin : 0,
        putOnTime : 0,
        resetTag : 0,
        resetPos : 0,
        resetTopic : 0,
        resetUp : 0
      },
      playTypeOptions : [
        { key : 1, name : '免费' },
        { key : 2, name : 'VIP' },
        { key : 3, name : '金币' }
      ],
      countModeOptions : [
        { key : 1, name : '新增' },
        { key : 2, name : '重置' }
      ],
      countMode : {
        minPlayNum : '',
        maxPlayNum : '',
        minFavoriteNum : '',
        maxFavoriteNum : '',
        minLikeNum : '',
        maxLikeNum : '',
        minDisLikeNum : '',
        maxDisLikeNum : '',
        playNumMode : 0,
        favoriteNumMode : 0,
        likeNumMode : 0,
        disLikeNumMode : 0
      }
    }
  },
  computed : {
    tagTopicListComputed() {
      const topicList =
        this.tagTopicList?.topicList?.filter( item => {
          return item.status === 2
        } ) || []
      const tagList =
        this.tagTopicList?.tagList?.filter( item => {
          return item.status === 2
        } ) || []
      const posTaglist =
        this.tagTopicList?.posTaglist?.filter( item => {
          return item.status === 2
        } ) || []
      const uperList =
        this.tagTopicList?.uperList?.filter( item => {
          return item.status === 1
        } ) || []
      return {
        topicList,
        tagList,
        posTaglist,
        uperList
      }
    }
  },
  mounted() {
    if ( this.mode === 'edit' ) {
      try {
        for ( const key in this.form ) {
          if ( Object.hasOwnProperty.call( this.form, key ) ) {
            this.form[key] = this.currentRowData[key]
              ? this.currentRowData[key]
              : this.currentRowData[key] === 0
                ? 0
                : null
          }
        }
        this.form.reqType = 0
        this.form.tagId =
          ( this.currentRowData?.videoTags &&
            this.currentRowData.videoTags.map( item => {
              return item.tagId
            } ) ) ||
          []
        this.form.topicId =
          ( this.currentRowData?.topics &&
            this.currentRowData.topics.map( item => {
              return item.topicId
            } ) ) ||
          []
        this.form.posId =
          ( this.currentRowData?.videoPoses &&
            this.currentRowData.videoPoses.map( item => {
              return item.id
            } ) ) ||
          []

        if ( this.currentRowData.uper ) {
          this.form.uperId = this.currentRowData.uper.uid
        }

        this.$nextTick( () => {
          this.date = new Date( this.form.putOnTime * 1000 )
        } )
      } catch ( error ) {}
    }
  },
  methods : {
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
    handleClick( val ) {},
    changeClearHandle( type, val ) {
      switch ( type ) {
        case 'tag':
          if ( val === 1 ) {
            this.form.tagId = []
          }
          break
        case 'pos':
          if ( val === 1 ) {
            this.form.posId = []
          }
          break
        case 'topic':
          if ( val === 1 ) {
            this.form.topicId = []
          }
          break
        case 'uper':
          if ( val === 1 ) {
            this.form.uperId = ''
          }
          break
        default:
          break
      }
    },
    submitForm() {
      // 给父组件返回promise对象用于回调
      return new Promise( resolve => {
        this.$refs.form.validate( async valid => {
          if ( !valid ) return false
          try {
            if ( this.date ) {
              this.form.putOnTime = this.date.getTime() / 1000
            }

            if ( this.mode === 'add' ) {
              await editUploadedVideo( this.form )
            } else {
              if ( this.activeTabName === 'basic' ) {
                const params = {}
                for ( const key in this.form ) {
                  if ( Object.hasOwnProperty.call( this.form, key ) ) {
                    if ( this.form[`${key}`] || this.form[`${key}`] === 0 ) {
                      params[`${key}`] = this.form[`${key}`]
                    }
                  }
                }

                await editUploadedVideo( params )
              } else {
                const searchParams = {}
                for ( const key in this.countMode ) {
                  if ( Object.hasOwnProperty.call( this.countMode, key ) ) {
                    if ( this.countMode[`${key}`] || this.countMode[`${key}`] === 0 ) {
                      searchParams[`${key}`] = this.countMode[`${key}`]
                    } else {
                      searchParams[`${key}`] = 0
                    }
                  }
                }
                searchParams.videoIds = [this.currentRowData.videoId]
                await batchStatisticsVideos( searchParams )
              }
            }
            resolve( true )
          } catch ( error ) {
            resolve( false )
          }
        } )
      } )
    }
  }
}
</script>
<style lang="scss" scoped>
.el-input {
  width: 40%;
}
.clear-checkbox {
  margin-right: 30px;
}
.interval-block {
  .el-button {
    margin-right: 8px;
  }
  .interval {
    .el-input {
      width: 100px;
    }
  }
  .des {
    margin-left: 8px;
  }
  .clear {
    margin-left: 20px;
    .el-radio {
      margin-right: 24px;
    }
  }
}
:deep(.el-checkbox) {
  .el-checkbox__label {
    background: #e9e9eb;
    margin-left: 5px;
    border-radius: 4px;
    color: #909399;
    padding: 4px 8px;
  }
  .el-checkbox__inner {
    width: 16px;
    height: 16px;
  }
}
</style>
