<template>
  <div id="test">
   <!-- <object type="text/x-scriptlet" data="http://10.241.90.34:9704/analytics/saw.dll?Dashboard&NQUser=weblogic&NQPassword=biee123456&PortalPath=/shared/个金业务报表专题/_portal/个人金融业务情况日报&page=个人金融业务情况日报&Syndicate=page" width="100%" height="100%"></object> -->
    <iframe :src="actionUrl" width="100%" height="100%"   frameborder="0"></iframe>
  </div>
</template>
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
    this.actionUrl=encodeURI("http://biee.crbank.com.cn/analytics/saw.dll?Dashboard&PortalPath=/shared/个金业务报表专题/_portal/个人金融业务情况日报&page=个人金融业务情况日报&Syndicate=page");
    // this.actionUrl=encodeURI("http://10.241.90.34:9704/analytics/saw.dll?Dashboard&PortalPath=/shared/个金业务报表专题/_portal/个人金融业务情况日报&page=个人金融业务情况日报&Syndicate=page");
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
<style scoped>

#test{
  width: 100%;
  overflow: hidden;
}
</style>
