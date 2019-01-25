<template>
  <div>
    <Card>
      <p slot="title">
        <Icon type="map"></Icon>
        流程图
      </p>
      <iframe id="pictureFrame" :height="frameHeight" width="100%" frameborder=0 scrolling=auto :src="pictureUrl">
      
      </iframe>
      <Spin size="large" fix v-if="frameLoading"></Spin>
      <!-- <iframe id="pictureFrame" :height="frameHeight" width="100%" frameborder=0 scrolling=auto src="http://10.52.194.150:8083/crc-psc-business-rest/MyJsp.jsp">
        <Spin size="large" fix v-if="frameLoading"></Spin>
      </iframe> -->
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
  components: {
  },
  data() {
    return {
      pictureUrl: "",
      frameLoading: true,
    }
  },
  computed: {
    frameHeight() {
      return window.innerHeight*0.9;
    } 
  },
  created: function() {
    this.server.queryProcessPictureUrl().then((response) => {
      if (response.statusCode == "0") {
        this.pictureUrl = response.dataResult;
      }
    });
  },
  beforeMount: function() {},
  mounted: function() {
    // 监测iframe内的页面是否加载完毕，加载完毕去除等待效果
    document.getElementById("pictureFrame").onload = () => this.frameLoading = false;
  },
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