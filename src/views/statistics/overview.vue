<template>
  <div class="statistics">
    <el-card shadow="hover" class="box" v-loading="listLoading">
      <div class="item title">
        <span class="label">总用户（人数）</span>
        <span class="value">{{ total.registerNum || 0 }}</span>
      </div>
      <div class="item">
        <span class="label">今日新增（人数）</span>
        <span class="value">{{ today.registerNum || 0 }}</span>
      </div>
      <div class="item">
        <span class="label">昨日新增（人数）</span>
        <span class="value">{{ yesterday.registerNum || 0 }}</span>
      </div>
      <div class="item">
        <span class="label">今日活跃（人数）</span>
        <span class="value">{{ today.stayUserNum || 0 }}</span>
      </div>
      <div class="item">
        <span class="label">昨日活跃（人数）</span>
        <span class="value">{{ yesterday.stayUserNum || 0 }}</span>
      </div>
    </el-card>
    <el-card shadow="hover" class="box" v-loading="listLoading">
      <div class="item title">
        <span class="label">总充值金额</span>
        <span class="value">{{ total.centerCharge * 1 + total.gameRecharge * 1 || 0 }}</span>
      </div>
      <div class="item">
        <span class="label">今日充值金额</span>
        <span class="value">{{ today.centerCharge * 1 + today.gameRecharge * 1 || 0 }}</span>
      </div>
      <div class="item">
        <span class="label">昨日充值金额</span>
        <span class="value">{{ yesterday.centerCharge * 1 + yesterday.gameRecharge * 1 || 0 }}</span>
      </div>
      <div class="item">
        <span class="label">今日首充金额</span>
        <span class="value">{{ today.centerFirstRecharge * 1 || 0 }}</span>
      </div>
      <div class="item">
        <span class="label">今日续充金额</span>
        <span class="value">{{
          today.centerCharge * 1 + today.gameRecharge * 1 - today.centerFirstRecharge * 1 || 0
        }}</span>
      </div>
      <div class="item">
        <span class="label">昨日首充金额</span>
        <span class="value">{{ yesterday.centerFirstRecharge * 1 || 0 }}</span>
      </div>
      <div class="item">
        <span class="label">昨日续充金额</span>
        <span class="value">{{
          yesterday.centerCharge * 1 + yesterday.gameRecharge * 1 - yesterday.centerFirstRecharge * 1 || 0
        }}</span>
      </div>
    </el-card>
    <el-card shadow="hover" class="box" v-loading="listLoading">
      <div class="item title">
        <span class="label">总充值笔数</span>
        <span class="value">{{ total.centerChargeNum * 1 + +total.gameRechargeNum * 1 || 0 }}</span>
      </div>
      <div class="item">
        <span class="label">今日充值笔数</span>
        <span class="value">{{ today.centerChargeNum * 1 + +today.gameRechargeNum * 1 || 0 }}</span>
      </div>
      <div class="item">
        <span class="label">昨日充值笔数</span>
        <span class="value">{{ yesterday.centerChargeNum * 1 + +yesterday.gameRechargeNum * 1 || 0 }}</span>
      </div>
      <div class="item">
        <span class="label">今日首充笔数</span>
        <span class="value">{{ today.centerFirstRechargeNum * 1 + today.gameFirstRechargeNum * 1 || 0 }}</span>
      </div>
      <div class="item">
        <span class="label">今日续充笔数</span>
        <span class="value">{{
          today.centerChargeNum * 1 +
            +today.gameRechargeNum * 1 -
            today.centerFirstRechargeNum * 1 -
            today.gameFirstRechargeNum * 1 || 0
        }}</span>
      </div>
      <div class="item">
        <span class="label">昨日首充笔数</span>
        <span class="value">{{ yesterday.centerFirstRechargeNum * 1 + yesterday.gameFirstRechargeNum * 1 || 0 }}</span>
      </div>
      <div class="item">
        <span class="label">昨日续充笔数</span>
        <span class="value">{{
          yesterday.centerChargeNum * 1 +
            +yesterday.gameRechargeNum * 1 -
            yesterday.centerFirstRechargeNum * 1 -
            yesterday.gameFirstRechargeNum * 1 || 0
        }}</span>
      </div>
    </el-card>
    <el-card shadow="hover" class="box" v-loading="listLoading">
      <div class="item title">
        <span class="label">总提现金额</span>
        <span class="value">{{ total.withdrawMoney || 0 }}</span>
      </div>
      <div class="item">
        <span class="label">今日提现金额</span>
        <span class="value">{{ today.withdrawMoney || 0 }}</span>
      </div>
      <div class="item">
        <span class="label">昨日提现金额</span>
        <span class="value">{{ yesterday.withdrawMoney || 0 }}</span>
      </div>
      <div class="item">
        <span class="label">今日提现笔数</span>
        <span class="value">{{ today.withdrawCount || 0 }}</span>
      </div>
      <div class="item">
        <span class="label">昨日提现笔数</span>
        <span class="value">{{ yesterday.withdrawCount || 0 }}</span>
      </div>
    </el-card>
    <div class="box"></div>
  </div>
</template>
<script>
import { apiGetDayOverview } from '/@/api/statistics/overview.js'

export default {
  data() {
    return {
      listLoading : false,
      searchParams : {},
      today : {
        registerNum : 0,
        stayUserNum : 0
      },
      total : {},
      yesterday : {},
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
  created() {
    this.getList()
  },
  methods : {
    async getList() {
      this.listLoading = true

      const params = {
        ...this.tableParams.listQuery
      }
      try {
        const res = await apiGetDayOverview( params )
        const { today, total, yesterday } = res.data
        this.today = today
        this.total = total
        this.yesterday = yesterday

        this.listLoading = false
      } catch ( error ) {
        this.listLoading = false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.statistics {
  padding: 40px 20px 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.box {
  margin-bottom: 20px;
  padding: 20px;
  width: 30%;
  &:last-child {
    visibility: hidden;
  }
  .item {
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    font-size: 16px;
    &:last-child {
      margin-bottom: 0;
    }
    .label {
      flex: 3;
    }
    .value {
      flex: 1;
    }
  }
  .title {
    font-size: 20px;
    color: #000;
    font-weight: 600;
    margin-bottom: 20px;
  }
}
</style>
