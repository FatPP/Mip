<template>
  <div class="sidelip-box">
    <FormBlock :title="$t('module.role.functionPermissionList')">
    <div style="padding-left:30px;">
      <!-- <p slot="header">
        <span>功能权限列表</span>
      </p> -->
      <div style="height:100%;width:100%;overflow-y: auto;overflow-x: hidden">
        <el-tree :data="baseData" :show-checkbox="true" ref="menuTree" :props="treeProps" node-key="menuId" default-expand-all></el-tree>
      </div>
      <Spin size="large" fix v-if="isQueryMenusAndBtns"></Spin>
    </div>
    </FormBlock>
  </div>
</template>
<style scoped>
  .sidelip-box{
    height: 100%;
    width: 100%;
    scroll-behavior: hidden;
  }
</style>

<script>
import Three from "../../tools/getThree.js";
export default{
  name: 'AccessEdit',
  components:{

  },
  props:{
    roleId:{
      type: String,
      default(){
        return '';
      }
    },
    version:{
      type: String,
      default(){
        return '';
      }
    },
    orgId:{
      type: String,
      default(){
        return '';
      }
    },
    orgName:{
      type: String,
      default(){
        return '';
      }
    },
  },
  data(){
    const validateRoleCode = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t("module.role.warning.enterRoleCode")));
      } else if (value.length > 50) {
        callback(new Error(this.$t("module.role.warning.maxFifty")));
      } else if (!new RegExp("^([a-zA-z0-9]|_)+$").test(value)) {
        callback(new Error(this.$t("module.role.warning.codeFormat")));
      }
      callback();
    };
    return{
      rule: {
        roleName: [{ required: true, message: this.$t("module.role.warning.enterRoleName"), trigger: "blur" }],
        roleCode: [
          { validator: validateRoleCode, trigger: "blur", required: true }
        ]
      },
      templateList: [],
      baseData: [],
      treeProps: {
        label: "title",
        children: "children"
      },
      isQueryMenusAndBtns: false,
    }
  },
  computed:{

  },
  created:function(){
    // if(this.roleId){
    //   this.$emit("SetTitle", this.$t("module.role.editRole"));
    // }else{
    //   this.$emit("SetTitle", this.$t("module.role.createRole"));
    // }
    this.$emit("SetTitle","报表分配");
    this.$emit('SetPageActions', [
      {
        text: this.$t('common.confirm'),
        theme: "primary",
        icon: "edit",
        handle: () => {
          this.saveOrUpdateRole();
        }
      }
    ])
    // this.queryRole();
  },
  beforeMount:function(){

  },
  mounted:function(){
    this.onTemplateChange();
  },
  beforeDestroy:function(){

  },
  destroyed:function(){

  },
  methods:{
    render(arr,level){
	        var level=level||0;
	            level++;
	        var i=0,len=arr.length;
	        var str=[];
        	for(;i<len;i++){
            str=str.push(arr[i]);
		      if(arr[i].children&&arr[i].children.length>0){
			      str=render(arr[i].children,level);
		      }
	        }
	            return str;
    },
    saveOrUpdateRole() {
            var menusList = this.$refs["menuTree"].getHalfCheckedNodes().concat(this.$refs["menuTree"].getCheckedNodes());
            var menuIds = [];
            for (var item of menusList) {
                menuIds.push(item.menuId);
            }
            menuIds = menuIds.join(",");
            var param = {
              userId: this.roleId,
              menuIds: menuIds,
            };
            $store.dispatch("UpdateAccess", param).then(response => {
              if (response.statusCode == "0") {
                this.$Message.success({
                  content: this.$t("module.role.setAccessSuccess"),
                  duration: 3
                });
                this.$emit('Close');
              } else {
                this.$Message.warning({
                  content: response.msg,
                  duration: 3
                });
              }
            });
    },
    onTemplateChange(id){
      var id=this.roleId;
        //根据角色模板显示功能及资源权限
        this.isQueryMenusAndBtns = true;
        $store.dispatch("GetAllMenu", {
          commonPageDTO: {
            currentPage: 1,
            pageSize: 10000
          },
         userId:this.roleId
        }).then(response => {
          this.isQueryMenusAndBtns = false;
          this.baseData = new Three(response.data).json;
          this.$refs["menuTree"].setCheckedKeys(response.checkList,false);
        });
      
      }
  },
  watch:{

  },
  directives:{

  }
}
</script>
