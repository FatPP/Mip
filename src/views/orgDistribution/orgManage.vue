<template>
  <div v-if="!noData" class="padding-20 page-box-row-left">
    <FormBlock title="组织树" direction="column" style="width:380px">
      <el-tree
        :data="orgTree"
        :props="defaultProps"
        highlight-current
        check-strictly
        :default-expand-all="true"
        indent="10"
        node-key="orgId"
        ref="orgTree"
        @node-click="handleNodeClick"
        :expand-on-click-node="false"
      ></el-tree>
    </FormBlock>
    <div class="run-mod-box" style=" overflow: auto;">
      <PageTable ref="roleTable" action="findUserByOrgId" :columnsFn="columns" :autoFirst="false">
        <div slot="table-bar">
          <Button
            type="ghost"
            v-bind:disabled="isButtonDisabled"
            icon="plus-round"
            size="small"
            @click="add(orgId)"
          >{{$t("common.create")}}</Button>
          <Button
            type="ghost"
            v-bind:disabled="isButtonDisabled"
            icon="trash-a"
            size="small"
            @click="deleted"
          >{{$t("common.delete")}}</Button>
        </div>
      </PageTable>
    </div>
  </div>
</template>

<style>
.el-input__inner {
  font-size: 12px !important;
}
</style>

<script>
import Three from "../../tools/getThreeByOrg.js";
import userList from './userList.vue'
export default {
  name: "menu-manage",
  title: "this.$t('module.bieet.manageMenu')",
  components: {},
  data() {
    return {
      orgForm: {
        orgDes: "", //机构描述
        version: "", //版本
        orgName: "",
        orgId: "",
        parentName: "",
        hasPara: "",
        promptId: "",
        reportPath: "",
        parentId: "", //parentMenuId
        orgNameAbbr: "", //机构简称
        orgLevelCd: "",
        orgStat: "",
        pbcFinLicenseCd: "",
        orgAddress: "",
        operation: ""
      },
      isQueryMenusAndBtns: false,
      rolePermissonModalTitle: this.$t("module.role.permissionMaList"),
      permissionModal: false,
      tableData: [],
      formInfo: {
        orgName: "",
        roleName: "",
        remark: "",
        roleId: "",
        menuIds: "",
        effectBegin: "",
        effectEnd: "",
        roleCode: ""
      },
      formSearch: {
        enabled: "",
        roleName: "",
        orgId: ""
      },
      orgId:'',
      saveLoading: false,
      originMenuBtns: [], //存储从后台查询的原始功能及资源数据
      menuIdMap: {}, //key:menuId,value:parentID
      checkedNodes: [], //待选中的节点列表
      selectedMenuIds: [], //保存所有的已选中的功能ID
      selectedBtnIds: [], //保存所有的已选中的资源ID
      orgTree: [
        //最外层虚拟功能，防止删除一级目录功能后整棵树消失
        {
          orgNameAbbr: this.$t("module.bieet.rootNode"),
          orgId: "0",
          parentName: this.$t("module.bieet.nothing"),
          parentId: "0",
          children: [] //后天调取的树中的data放在这里
        }
      ],
      selectedData: {},
      defaultProps: {
        children: "children",
        label: "orgNameAbbr"
      },
      node: {},
      nodeElement: {}
    };
  },
  computed: {},
  created: function() {
    this.$emit("setTitle", this.orgName);
    this.loadNode(); //初始化加载
  },
  mounted: function() {
    // this.selectFirstMenu(); //加载时默认显示页
  },
  methods: {
    columns() {
      return [
        {
          type: "selection",
          width: 55,
          fixed: "left",
          align: "center"
        },
        {
          title: `${this.$t("module.userManage.account")}／LDAP ${this.$t(
            "common.account"
          )}`,
          width: 150,
          align: "center",
          key: "userCode",
          sortable: "custom"
        },
        {
          title:'用户名称',
          key: "userName",
          sortable: "custom",
          align: "center",
          width: 130,
          render: (h, params) => {
            return h(
              "div",
              {
                attrs: {
                  class: "ivu-table-cell ivu-table-cell-ellipsis",
                  title: params.row.userName
                }
              },
              params.row.userName
            );
          }
        },
        {
          title: this.$t("module.userManage.affiliation"),
          sortable: "custom",
          key: "orgNameAbbr",
          align: "center",
          width: 130,
          render: (h, params) => {
            return h(
              "div",
              {
                attrs: {
                  class: "ivu-table-cell ivu-table-cell-ellipsis",
                  title: params.row.orgNameAbbr
                }
              },
              params.row.orgNameAbbr
            );
          }
        },
        {
          title: this.$t("module.role.effectBegin"),
          sortable: "custom",
          align: "center",
          key: "effectBegin",
          render: (h, params) => {
            return h("span", {}, this.getDateString(params.row.effectBegin));
          },
          width: 120
        },
        {
          title: this.$t("module.role.effectEnd"),
          sortable: "custom",
          align: "center",
          key: "effectEnd",
          render: (h, params) => {
            return h("span", {}, this.getDateString(params.row.effectEnd));
          },
          width: 110
        },

        {
          title: this.$t("common.remark"),
          key: "remark",
          align: "center",
          render: (h, params) => {
            return h(
              "div",
              {
                attrs: {
                  class: "ivu-table-cell ivu-table-cell-ellipsis",
                  title: params.row.remark
                }
              },
              params.row.remark
            );
          }
        }
      ];
    },
    append(store, data, sonData) {
      store.append(sonData, data);
      var orgTree = this.$refs["orgTree"];
      orgTree.setCurrentKey(sonData.orgId);
      this.node = orgTree.getCurrentNode();
      this.btnTitle = this.$t("common.save");
    },
    gotoAddMenu(data) {
      this.selectedData = data;
      this.addMenu(false);
    },
    handleNodeClick() {
      // if(this.$refs["orgTree"].getCurrentNode()){
      //   this.isButtonDisabled = false;
      //   console.log(1);
      //   this.reflesh();
      // }else{
      //   this.isButtonDisabled = true;
      //   console.log(2)
      //   //刷新列表
      //   this.$refs["roleTable"].tableData = [];
      //   this.$refs["roleTable"].total = 0;
      //   this.$refs["roleTable"].param.commonPageDTO.currentPage = 1;
      // }
      this.reflesh();
    },
    add(orgId) {
      new this.$sidelipPage(
        userList,
        {
        props: {
            orgId: orgId,
            reflesh:this.reflesh
          }
        }, (data) => {
          this.reflesh();
      });
    },
     deleted() {
      var deleteStr = this.getIds();
      if (!deleteStr || deleteStr == undefined || deleteStr == "") {
        this.$Message.warning(this.$t("module.role.warning.selectRole"));
      }
      if (deleteStr == "" || deleteStr == undefined) return;
      new $confirm(this.$t("module.role.warning.ensureToDelete"), this).then(() => {
        this.$store
          .dispatch("deleteOrgUser", {
            userIds: deleteStr
          })
          .then(res => {
            if (res.statusCode=='0') {
              this.$Message.success({
                content: res.msg,
                duration: 3
              });
            }else{
              this.$Message.warning({
                content:res.msg,
                duration:3
              })
            }
            this.reflesh();             
          });
      });
    },
    loadNode(node, resolve) {
      $store.dispatch("orgList").then(res => {
        // console.log(res.dataResult.orgList);
        var tree = new Three(res.dataResult.orgList, {
          sort: true
        });
        //console.log(res);
        this.orgTree[0].children = tree.json;
      });

      //node.checked = checked;
    },
      reflesh(page) {
      // 选择根组织时，级联查询下级角色
      var orgId = this.$refs["orgTree"].getCurrentNode().orgId;
        this.orgId=orgId;
        this.formSearch.orgId = orgId;
      this.$refs["roleTable"].load(this.formSearch, page);
    },
    reset() {
      this.$refs["roleFormSearch"].resetFields();
      this.reflesh(1);
    },
    getIds() {
      var list = this.$refs["roleTable"].getSelectioned() || [];
      var ids = [];
      for (var u of list) {
        ids.push(u.userId);
      }
      return ids.join(",");
    },
    getDateString(DateStr) {
      if (
        DateStr == undefined ||
        DateStr == null ||
        DateStr == "" ||
        DateStr.trim() == ""
      ) {
        return "";
      }
      // return DateStr.split(" ")[0];
      var dateList = DateStr.split(" ")[0].split("-");
      var newDateList = [];
      var newItem = "";
      for(var key = 0; key < dateList.length; key++){
        var newNummber = parseInt(dateList[key]);
        if(newNummber < 10){
          newNummber = "0" + newNummber;
        }
          newDateList.push(newNummber); 
        
      };
      return newDateList.join("-");
    },
  },
  watch: {
   
  },
  directives: {}
};
</script>

<style lang="less">
.noInfoShow {
  display: block;
  text-align: center;
  margin: 5% 0;
}
.ivu-form + .noInfoShow {
  display: none;
}
</style>