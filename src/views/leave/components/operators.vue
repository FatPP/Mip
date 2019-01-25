<template>
  <div class="fixed-bar" style="position: fixed;left: 0; bottom: 0;top: auto;z-index: 7;width: 100%;box-shadow: 0 -1px 10px rgba(0,0,0,0.3)">
    <Card>
      <!-- <p slot="title">
        <Icon type="settings"></Icon>
        操作选项
      </p> -->
      <Form>
        <Form-item>
          <div style="text-align: center;">
            <!-- 提交、退回、撤回、作废、沟通、转办、知会 -->
            <Button size="large" type="success" icon="checkmark-round" :loading="submitLoading" @click="handleSubmit">提交</Button>
            <!-- <Button v-if="actions.agree" size="large" type="success" icon="checkmark-round">暂存</Button>
            <Button v-if="actions.agree" size="large" type="success" icon="checkmark-round">退回</Button>
            <Button v-if="actions.agree" size="large" type="success" icon="checkmark-round">撤回</Button>
            <Button v-if="actions.agree" size="large" type="success" icon="checkmark-round">作废</Button>
            <Button v-if="actions.reject" size="large" type="error" icon="close-round" style="margin-left: 8px">沟通</Button>
            <Button v-if="actions.agree" size="large" type="success" icon="checkmark-round">转办</Button>
            <Button v-if="actions.agree" size="large" type="success" icon="checkmark-round">知会</Button> -->
          </div>
        </Form-item>
      </Form>
    </Card>
  </div>
</template>
<script>
export default {
  components: {},
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
      submitLoading: false,
      actions: {
        agree: true,
        reject: true
      },
    };
  },
  computed: {},
  created: function () {
    $channel.$on('submitBtnLoadingFalse', () => {
      this.submitLoading = false;
    });
    $channel.$on('submitBtnLoadingTrue', () => {
      this.submitLoading = true;
    });
  },
  beforeMount: function () { },
  mounted: function () { },
  beforeDestroy: function () { },
  destroyed: function () { },
  methods: {
    handleSubmit() {
      $channel.$emit('emitSubmit');
    }
  },
  watch: {},
  directives: {}
};
</script>
<style lang="less">
  .fixed-bar {
    // background: #fff;
    // box-shadow: 0 -1px 10px rgba(0, 0, 0, 0.3);
    // padding: 13px 0;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    min-width: 1200px;
    z-index: 99999;
  }
</style>
