<template>
  <div id="test">
    <iframe :src="actionUrl" width="100%" height="100%" frameborder="0"></iframe>
    <!-- <Object type="text/x-scriptlet" data="http://10.241.90.34:9704/analytics/saw.dll?Dashboard&NQUser=weblogic&NQPassword=biee123456&PortalPath=/users/weblogic/test_20180808/demo_20180808&Syndicate=page" width="100%" height="100%"></Object> -->
  </div>
</template>
<style scoped>
#test{
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
<script>

export default {
  components: {

  },
  data() {
    return{
     actionUrl:''
    }
  },
  computed: {

  },
  created: function () {
    this.actionUrl=encodeURI("http://biee.crbank.com.cn/analytics/saw.dll?Dashboard&PortalPath=/shared/新管理驾驶舱/_portal/新管理驾驶舱&Syndicate=page")
    // this.actionUrl=encodeURI("http://10.241.90.34:9704/analytics/saw.dll?Dashboard&PortalPath=/users/weblogic/test_20180808/demo_20180808&Syndicate=page")
  },
  beforeMount: function () {

  },
  mounted(){
    
  },
  beforeDestroy: function () {

  },
  destroyed: function () {

  },
  methods: {
    
  },
  watch: {
    
  },
  directives: {

  }
}
</script>

