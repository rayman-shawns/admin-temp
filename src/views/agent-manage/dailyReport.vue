<template>
  <div>
    <daily-report-comp @sub="onSub" />
    <el-dialog :key="title" :title="title" v-model="dialogVisible" width="90%" :before-close="handleClose">
      <daily-report-comp :showSubAgent="false" :parentAgentId="parentAgentId" />
    </el-dialog>
  </div>
</template>

<script>
import DailyReportComp from './components/DailyReportComp.vue'
export default {
  name : 'DailyReport',
  data() {
    return {
      dialogVisible : false,
      title : '',
      parentAgentId : ''
    }
  },
  components : {
    DailyReportComp
  },
  methods : {
    onSub( row ) {
      console.log( row )
      this.title = `子代理详情 (${row.account} ${row.agentId})`
      this.dialogVisible = true
      this.parentAgentId = row.agentId
    },
    handleClose() {
      this.dialogVisible = false
      this.parentAgentId = ''
    }
  }
}
</script>
