<template>
  <div>
    <el-form-item v-for="column in columns" :key="column.k" :label="column.name">
      <slot v-if="column.slot" :name="column.slot" :row="formDataComputed[column.k]" />
      <template v-else-if="column.type === '1'">
        <el-input v-model="formDataComputed[column.k]" placeholder="请输入" clearable :disabled="column.disabled" />
      </template>
      <template v-else-if="column.type === '2'">
        <el-input
          v-model="formDataComputed[column.k]"
          placeholder="请输入"
          clearable
          :autosize="{ minRows: 4 }"
          resize="none"
          type="textarea"
        />
      </template>
    </el-form-item>
    <!-- <template v-else-if="column.type === 'NUMBER'">
        <el-input v-model="formDataComputed[column.k]" placeholder="请输入" clearable type="number" />
      </template>
      <template v-else-if="column.type === 'PASSWORD'">
        <el-input v-model="formDataComputed[column.k]" placeholder="请输入" clearable type="password" />
      </template>
      <template v-else-if="column.type === 'TIME_PICKER'">
        <el-date-picker
          v-model="formDataComputed[column.k]"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          placeholder="选择日期"
        />
      </template> -->
    <!-- <template v-else-if="column.type === 'DATE_PICKER'">
        <el-date-picker v-model="formDataComputed[column.k]" value-format="yyyy-MM-dd" type="date" placeholder="选择日期" />
      </template>
      <template v-else-if="column.type === 'DATE_TIME_PICKER'">
        <el-date-picker
          v-model="formDataComputed[column.k]"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          placeholder="选择日期"
        />
      </template> -->
    <!-- <template v-else-if="column.type === 'RICH_TEXT'">
          <editor v-model="formData[column.k]" :min-height="192" />
        </template> -->
    <!-- <template v-else-if="column.type === 'SWITCH'">
          <el-switch
            v-model="formData[column.k]"
            active-color="#67C23A"
            inactive-color="#909399"
            :active-value="1"
            :inactive-value="0"
          />
        </template> -->
    <!-- <template v-else-if="column.type === 'MULTIPLE_CHECK_BOX'">
        <el-checkbox-group v-model="formDataComputed[column.k]">
          <el-checkbox v-for="item in column.drop_list" :key="item.k" :label="item.name">{{ item.value }}</el-checkbox>
        </el-checkbox-group>
      </template>
      <template v-else-if="column.type === 'CHECK_BOX'">
        <el-radio-group v-model="formDataComputed[column.k]">
          <el-radio v-for="item in column.drop_list" :key="item.k" :label="item.name">{{ item.value }}</el-radio>
        </el-radio-group>
      </template>
      <template v-else-if="column.type === 'SELECT' || column.type === 'MULTIPLE_SELECT' || column.type === 'SWITCH'">
        <el-select
          v-model="formDataComputed[column.k]"
          clearable
          :multiple="column.type === 'MULTIPLE_SELECT'"
          placeholder="请选择"
        >
          <el-option v-for="item in column.drop_list" :key="item.k" :label="item.name" :value="item.v" />
        </el-select>
      </template>
    </el-form-item> -->
    <slot />
  </div>
</template>
<script>
// enum Types {
//   NUMBER, //数字
//   PASSWORD, // 密码框
//   1, // 简单文本输入
//   2, //多行文本
//   RICH_TEXT, // 富文本
//   SELECT, // 下拉框
//   MULTIPLE_SELECT, // 复选下拉框
//   TIME_PICKER, // 时间选择 HH:mm:ss
//   DATE_PICKER, // 日期选择 yy:mm:dd
//   DATE_TIME_PICKER, // 时间日期选择 yy:mm:dd HH:mm:ss
//   CHECK_BOX, // 单选框
//   MULTIPLE_CHECK_BOX, // 复选框
//   RADIO, // radio
//   SWITCH, // 开关
//   4, // 文件上传
//   3, // 图片上传
// }
// import Editor from '@/components/Editor'

export default {
  name : 'FormFilter',
  //   components : {
  //     Editor
  //   },
  props : {
    columns : {
      type : Array,
      default : () => []
    },
    formData : {
      type : Object,
      default : () => {}
    }
  },
  data() {
    return {}
  },
  computed : {
    formDataComputed() {
      return this.formData
    }
  },
  created() {}
}
</script>
<style lang="scss" scoped></style>
