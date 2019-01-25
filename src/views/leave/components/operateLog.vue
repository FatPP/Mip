<template>
  <div style="margin-bottom: 40px;">
    <Card>
      <p slot="title">
        <Icon type="ios-paper"></Icon>
        审批记录
      </p>
      <Table height="200" :loading="loading" :columns="tableColumns1" :data="tableData"></Table>
    </Card>
  </div>
</template>
<script>
export default {
  props: {
    childProps: {
      type: Object,
      default() {
        return {};
      }
    },
    server: {
      type: Object,
      default() {
        return {};
      }
    },
  },
  data() {
    return {
      loading: false,
      tableData: [],
      tableColumns1: [
        {
          type: 'index',
          width: 60,
          align: 'center',
        },
        {
          title: '执行环节',
          width: 200,
          key: 'activityName'
        },
        {
          title: '执行人',
          width: 160,
          key: 'assignee'
        },
        {
          title: '开始时间',
          width: 140,
          key: 'startTime'
        },
        {
          title: '结束时间',
          width: 140,
          key: 'endTime'
        },
        {
          title: '历时时间',
          width: 160,
          key: 'durationTime'
        },
        {
          title: '提交意见',
          render: (h, params) => {
            return h('div', {
              attrs: {
                class: 'ivu-table-cell ivu-table-cell-ellipsis',
                title: params.row.comment
              }
            }, params.row.comment);
          }
        },
      ],
    }
  },
  computed: {},
  created: function() {
    if(this.childProps.actionType != 'start') {
      this.getOperateLog();
    }
    
  },
  beforeMount: function() {},
  mounted: function() {},
  beforeDestroy: function() {},
  destroyed: function() {},
  methods: {
    getOperateLog() {
      this.loading = true;
      this.server.queryFlowOperateLog()
      .then(response => {
        if (response.statusCode == "0") {
          this.loading = false;
          this.tableData = response.dataResult;
        }
      });
    },
  },
  watch: {},
  directives: {}
};
</script>
<style lang="less">
  .info-span {
    color: red;
  }
</style>
