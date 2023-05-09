<template>
  <div>
    <el-form v-loading="loading" ref="form" :model="form" label-position="top" label-width="100px">
      <el-form-item
        label="此为批量修改操作，会影响到您选中的所有内容，为防止操作错误，需要修改哪一个内容，就选择哪一个，请谨慎修改"
      >
      </el-form-item>
      <!-- <el-form-item label="已选择视频编号">
          <el-input :rows="2" type="textarea" v-model="form.no" />
        </el-form-item> -->
      <el-form-item label="新的播放标签">
        <!-- <el-checkbox @change="changeClearHandle('tag',$event)" class="clear-checkbox" v-model="form.resetTag" label="无" :true-label="1" :false-label="0" size="large" /> -->
        <el-checkbox-group v-model="form.tagId">
          <el-checkbox :label="item.tagId" v-for="item in tagTopicListComputed.tagList" :key="item.tagId" name="type">{{
            item.name
          }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="新的定位标签">
        <!-- <el-checkbox @change="changeClearHandle('pos',$event)" class="clear-checkbox" v-model="form.resetPos" label="无" :true-label="1" :false-label="0" size="large" /> -->
        <el-checkbox-group v-model="form.posId">
          <el-checkbox :label="item.id" v-for="item in tagTopicListComputed.posTaglist" :key="item.id" name="type">{{
            item.name
          }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="新的专题">
        <!-- <el-checkbox @change="changeClearHandle('topic',$event)" class="clear-checkbox" v-model="form.resetTopic" label="无" :true-label="1" :false-label="0" size="large" /> -->
        <el-checkbox-group v-model="form.topicId">
          <el-checkbox
            :label="item.topicId"
            v-for="item in tagTopicListComputed.topicList"
            :key="item.topicId"
            name="type"
            >{{ item.name }}</el-checkbox
          >
        </el-checkbox-group>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { batchTagVideoAdd } from '/@/api/video-manage/pulledOn.js'

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
      form : {
        videoId : [],
        posId : [],
        tagId : [],
        topicId : [],
        reqType : 0
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
  created() {
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
            const params = {}
            for ( const key in this.form ) {
              if ( Object.hasOwnProperty.call( this.form, key ) ) {
                if ( this.form[`${key}`] || this.form[`${key}`] === 0 ) {
                  params[`${key}`] = this.form[`${key}`]
                }
              }
            }
            await batchTagVideoAdd( params )

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
