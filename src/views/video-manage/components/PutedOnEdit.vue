<template>
  <div>
    <el-form v-loading="loading" ref="form" :model="form" label-position="top" label-width="100px">
      <el-tabs v-model="activeTabName" type="card" @tab-click="handleClick">
        <el-tab-pane label="基础信息" name="basic">
          <el-form-item
            label="此为批量修改操作，会影响到您选中的所有内容，为防止操作错误，需要修改哪一个内容，就选择哪一个，请谨慎修改"
          >
          </el-form-item>
          <!-- <el-form-item label="已选择视频编号">
        <el-input :rows="2" type="textarea" v-model="form.no" />
      </el-form-item> -->
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
          <el-form-item label="新的定位标签">
            <el-checkbox
              @change="changeClearHandle('pos', $event)"
              class="clear-checkbox"
              v-model="form.resetPos"
              label="无"
              :true-label="1"
              :false-label="0"
              size="large"
            />
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
          <el-form-item label="新的专题">
            <el-checkbox
              @change="changeClearHandle('topic', $event)"
              class="clear-checkbox"
              v-model="form.resetTopic"
              label="无"
              :true-label="1"
              :false-label="0"
              size="large"
            />
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
            />
            <el-radio-group v-model="form.uperId" :disabled="form.resetUp === 1">
              <el-radio :label="item.uid" v-for="item in tagTopicListComputed.uperList" :key="item.uid">{{
                item.nickname
              }}</el-radio>
            </el-radio-group>
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
          <el-form-item label="推荐排序" prop="priority">
            <el-input type="text" class="priority" placeholder="请输入" clearable v-model.number="form.priority" />
          </el-form-item>
          <el-form-item class="interval-block" label="上架时间">
            <el-date-picker v-model="date" class="filter-item" type="datetime" clearable placeholder="请选择日期" />
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="统计信息" name="statistics">
          <el-form-item class="interval-block" label="播放量">
            <!-- <el-button>随机区间</el-button> -->
            <div class="interval">
              <el-input type="text" placeholder="请输入" clearable v-model.number="countForm.minPlayNum" /> ~
              <el-input type="text" placeholder="请输入" clearable v-model.number="countForm.maxPlayNum" />
            </div>
            <div class="des">输入的区间内，随机给数量</div>
            <el-radio-group class="clear" v-model="countForm.playNumMode">
              <el-radio v-for="item in countModeOptions" :key="item.key" :label="item.key">{{ item.name }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item class="interval-block" label="收藏量">
            <!-- <el-button>随机区间</el-button> -->
            <div class="interval">
              <el-input type="text" placeholder="请输入" clearable v-model.number="countForm.minFavoriteNum" /> ~
              <el-input type="text" placeholder="请输入" clearable v-model.number="countForm.maxFavoriteNum" />
            </div>
            <div class="des">输入的区间内，随机给数量</div>
            <el-radio-group class="clear" v-model="countForm.favoriteNumMode">
              <el-radio v-for="item in countModeOptions" :key="item.key" :label="item.key">{{ item.name }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item class="interval-block" label="点赞量">
            <!-- <el-button>随机区间</el-button> -->
            <div class="interval">
              <el-input type="text" placeholder="请输入" clearable v-model.number="countForm.minLikeNum" /> ~
              <el-input type="text" placeholder="请输入" clearable v-model.number="countForm.maxLikeNum" />
            </div>
            <div class="des">输入的区间内，随机给数量</div>
            <el-radio-group class="clear" v-model="countForm.likeNumMode">
              <el-radio v-for="item in countModeOptions" :key="item.key" :label="item.key">{{ item.name }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item class="interval-block" label="被踩量">
            <!-- <el-button>随机区间</el-button> -->
            <div class="interval">
              <el-input type="text" placeholder="请输入" clearable v-model.number="countForm.minDisLikeNum" /> ~
              <el-input type="text" placeholder="请输入" clearable v-model.number="countForm.maxDisLikeNum" />
            </div>
            <div class="des">输入的区间内，随机给数量</div>
            <el-radio-group class="clear" v-model="countForm.disLikeNumMode">
              <el-radio v-for="item in countModeOptions" :key="item.key" :label="item.key">{{ item.name }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </div>
</template>
<script>
import { batchTagVideos, batchStatisticsVideos } from '/@/api/video-manage/pulledOn.js'

export default {
  props : {
    selectedRowData : {
      type : Array,
      default : () => []
    },
    tagTopicList : {
      type : Object,
      default : () => ( {
        topicList : [],
        tagList : [],
        posTaglist : [],
        uperList : []
      } )
    },
    currentRowData : {
      type : Object,
      default : () => ( {} )
    }
  },
  data() {
    return {
      loading : false,
      activeTabName : 'basic',
      date : '',
      form : {
        videoId : [],
        posId : [],
        tagId : [],
        uperId : '',
        topicId : [],
        reqType : 0,
        playType : 0,
        playCostCoin : 0,
        putOnTime : 0,
        priority : 0,
        resetTag : 0,
        resetPos : 0,
        resetTopic : 0,
        resetUp : 0
      },
      countForm : {
        videoIds : [],
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
      },
      playTypeOptions : [
        { key : 1, name : '免费' },
        { key : 2, name : 'VIP' },
        { key : 3, name : '金币' }
      ],
      countModeOptions : [
        { key : 1, name : '新增' },
        { key : 2, name : '重置' }
      ]
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
    try {
      this.form.videoId =
        this.selectedRowData &&
        this.selectedRowData.map( item => {
          return item.videoId
        } )

      this.countForm.videoIds = this.form.videoId
    } catch ( error ) {}
  },
  methods : {
    handleClick( val ) {},
    changeClearHandle( type, val ) {
      // console.log( 'ddd', type, val )
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
          if ( !valid ) return resolve( false )
          try {
            if ( this.activeTabName === 'basic' ) {
              if ( this.date ) {
                this.form.putOnTime = this.date.getTime() / 1000
              }

              const params = {}
              for ( const key in this.form ) {
                if ( Object.hasOwnProperty.call( this.form, key ) ) {
                  if ( this.form[`${key}`] || this.form[`${key}`] === 0 ) {
                    params[`${key}`] = this.form[`${key}`]
                  }
                }
              }
              await batchTagVideos( params )
            } else {
              const searchParams = {}
              for ( const key in this.countForm ) {
                if ( Object.hasOwnProperty.call( this.countForm, key ) ) {
                  if ( this.countForm[`${key}`] || this.countForm[`${key}`] === 0 ) {
                    searchParams[`${key}`] = this.countForm[`${key}`]
                  } else {
                    searchParams[`${key}`] = 0
                  }
                }
              }
              await batchStatisticsVideos( searchParams )
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
.priority {
  width: 220px;
}
.clear-checkbox {
  margin-right: 30px;
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
.checkmode {
  margin-right: 4px;
  width: 100px;
}
</style>
