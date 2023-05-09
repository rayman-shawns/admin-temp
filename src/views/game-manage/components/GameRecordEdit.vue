<template>
  <div class="topic-edit">
    <el-form v-loading="loading" ref="form" :model="form" label-position="left" label-width="120px">
      <el-form-item label="投注单号">
        <el-input type="text" placeholder="请输入" readonly v-model="form.game_id" />
      </el-form-item>
      <el-form-item label="ServerID">
        <el-input type="text" placeholder="请输入" readonly v-model="form.title2" />
      </el-form-item>
      <el-form-item label="游戏">
        <el-input type="text" placeholder="请输入" readonly v-model="form.title" />
      </el-form-item>
      <el-form-item label="房间 / 台号">
        <el-input type="text" placeholder="请输入" readonly v-model="form.title2" />
      </el-form-item>
      <el-form-item label="总输赢">
        <el-input type="text" placeholder="请输入" readonly v-model="form.profit" />
      </el-form-item>
      <el-form-item label="余额">
        <el-input type="text" placeholder="请输入" readonly v-model="form.title2" />
      </el-form-item>
      <el-form-item label="结算时间">
        <span>{{ parseTime(form.record_time) }}</span>
      </el-form-item>
      <el-form-item label="玩家信息">
        <el-input type="text" placeholder="请输入" readonly v-model="form.user_id" />
      </el-form-item>
      <el-form-item label="详情">
        <el-input type="text" placeholder="请输入" readonly v-model="form.title2" />
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { apiGetGameInfo } from '/@/api/game-manage/gameRecord.js'
import { parseTime } from '/@/utils'

export default {
  props : {
    mode : {
      type : String,
      default : 'add'
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
        game_id : '',
        title : '',
        profit : '',
        record_time : '',
        user_id : ''
      }
    }
  },
  created() {
    if ( this.currentRowData.id ) {
      for ( const key in this.form ) {
        if ( Object.hasOwnProperty.call( this.form, key ) ) {
          this.form[`${key}`] = this.currentRowData[`${key}`]
            ? this.currentRowData[`${key}`]
            : this.currentRowData[key] === 0
              ? 0
              : null
        }
      }
      // this.getGameInfo()
    }
  },
  methods : {
    getGameInfo() {
      const params = {
        id : this.currentRowData.id
      }
      apiGetGameInfo( params ).then( res => {
        if ( res ) {
          this.form = res.data
        }
      } )
    },
    submitForm() {
      // 给父组件返回promise对象用于回调
      return new Promise( resolve => {
        this.$refs.form.validate( async valid => {
          if ( !valid ) return resolve( false )
          try {
            resolve( true )
          } catch ( error ) {
            resolve( false )
          }
        } )
      } )
    },
    parseTime
  }
}
</script>
<style lang="scss" scoped>
.topic-edit {
  .el-input {
    width: 50%;
  }
  .el-select {
    width: 50%;
  }
}

:deep(.upload-block) {
  .el-form-item__content {
    display: flex;
    flex-wrap: wrap;
  }
  .upload {
    display: flex;
    justify-content: space-between;
    width: 47%;
    span {
      width: 100px;
    }
  }
}
.interval {
  .el-input {
    width: 200px;
  }
  .des {
    margin-left: 10px;
  }
}
</style>
