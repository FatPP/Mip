<template>
  <div class="process-container" style="padding: 20px;">
    <Row>
      <Col span="24">
        <operators :childProps="urlParams" :server="server"></operators>
      </Col>
    </Row>
    <Row>
      <Col span="24">
        <leave :childProps="urlParams" :server="server"></leave>
      </Col>
    </Row>
    <Row>
      <Col span="24">
        <comment :childProps="urlParams" :server="server"></comment>
      </Col>
    </Row>
    <Row>
      <Col span="24">
        <flow-picture :childProps="urlParams" :server="server"></flow-picture>
      </Col>
    </Row>
    <Row v-if="server.baseFlowRequest.actionType != 'start'">
      <Col span="24">
        <operate-log :childProps="urlParams" :server="server"></operate-log>
      </Col>
    </Row>
    <Spin size="large" fix v-if="pageLoading"></Spin>
  </div>
</template>
<script>
import leave from './components/leave';
import comment from './components/comment';
import operators from './components/operators';
import flowPicture from './components/flow-picture';
import operateLog from './components/operateLog';
import util from '@/tools/util.js';
import Server from './server.js';

const urlParams = util.getUrlParams(location.search);

// 初始化请假serverjs
const server = new Server(urlParams);
export default {
  components: {
    'comment': comment, // 流程审批意见组件
    'leave': leave, // 请假业务表单组件
    'operators': operators, // 操作按钮组件
    'flow-picture': flowPicture, // 流程图组件
    'operate-log': operateLog, // 流程审批日志组件
  },
  data() {
    return {
      urlParams: urlParams,
      server: server,
      pageLoading: true,
    }
  },
  computed: {
  },
  created: function() {
    $channel.$on('pageLoadingFalse', () => {
      this.pageLoading = false;
    });
    $channel.$on('pageLoadingTrue', () => {
      this.pageLoading = true;
    });
  },
  beforeMount: function() {},
  mounted: function() {},
  beforeDestroy: function() {},
  destroyed: function() {},
  methods: {
  },
  watch: {},
  directives: {}
};
</script>
<style lang="less">

</style>
