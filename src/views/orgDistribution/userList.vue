<template>
  <div>
    <PageTable ref="userTable" action="findUserByCondition" :columnsFn="generateColumns">
      <Form :model="formSearch" ref="roleFormSearch" slot="search-bar" class="ivu-form-no-margin-bottom" inline>
        <Form-item prop="userCode" :label="$t('module.userManage.account')">
          <Input type="text" v-model="formSearch.userCode" placeholder="" maxlength="30" size="small" />
        </Form-item>
        <Form-item prop="userName" :label="$t('module.userManage.name')">
          <Input type="text" v-model="formSearch.userName" placeholder="" maxlength="30" size="small" />
        </Form-item>
        <Form-item prop="hasOrg" label="是否含有组织">
          <el-select v-model="formSearch.hasOrg" size="small" clearable>
            <el-option value="1" label='有'></el-option>
            <el-option value="0" label="无"></el-option>
          </el-select>
        </Form-item>
         <Form-item prop="orgNameAbbr" label="所属组织简称" v-if='formSearch.hasOrg=="1"'>
          <Input type="text" v-model="formSearch.orgNameAbbr " placeholder="" maxlength="30" size="small" />
        </Form-item>
         <Form-item prop="orgId" label="所属组织ID" v-if='formSearch.hasOrg=="1"'>
          <Input type="text" v-model="formSearch.orgId " placeholder="" maxlength="30" size="small" />
        </Form-item>
      </Form>
      <div slot="handle-bar">
        <Button size="small" @click.native="search" type="warning" icon="search">{{$t("common.search")}}</Button>
        <Button size="small" @click.native="formReset" type="info" icon="loop">{{$t("common.reset")}}</Button>
      </div>
      <div slot="table-bar">
        <Button type="ghost" icon="plus-round" size="small" @click="edit(orgId)">{{$t("common.create")}}</Button>
      </div>
    </PageTable>
  
  </div>
</template>
<script>
// import UserEditPage from "./UserEdit.vue";
// import ImportExcel from "./ImportExcel.vue";
import AssignDimension from "../../../node_modules/ripples-core/src/views/system/dimension/AssignDimension.vue";
export default {
  name: 'user-list',
  components: {
  },
  props: {
    orgId: {
      type: String,
      default() {
        return "";
      }
    },
    reflesh:{
     
    }
  },
  data() {
    return {
      editIconLoading: false,
      formSearch: {
        userCode: "",
        userName: "",
        hasOrg: "",
        orgId:'',
        orgNameAbbr:'',
        effectBegin:'',
        effectEnd:''
      },
      file: {
        excelFile: ""
      },
      modal: false,
      baseData: [],
      currnodeId: "CR000",
      userListStore: {},
      userList: [],
      selectList: [],
      defaultProps: {
        children: "children",
        label: "name",
        depId: "CR000"
      },
      uploader: undefined,
      sortData: ""
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.userInfo;
    },
    test(){
     
    }
  },
  created() {
  },
  methods: {
    generateColumns() {
      return [
        {
          type: "selection",
          width: 50,
          align: "center",
          fixed: 'left'
        },

        {
          title: `${this.$t('module.userManage.account')}／LDAP ${this.$t('common.account')}`,
          width: 150,
          align: "center",
          key: "userCode",
          sortable: 'custom'
        },
        {
          title: this.$t('module.userManage.name'),
          width: 150,
          align: "center",
          key: "userName",
          sortable: 'custom'
        },
        // {
        //   title: '职位',
        //   key: 'orgUnitId'
        // },
        {
          title: this.$t('module.userManage.org'),
          width: 120,
          align: "center",
          key: "orgNameAbbr"
        },
        {
          title: this.$t('module.userManage.validDateBegin'),
          key: "effectBegin",
          width: 120,
          align: "center",
          render: (h, params) => {
            return h('format', {
              props: {
                type: 'date',
                value: params.row.effectBegin,
                param: 'yyyy-MM-dd'
              }
            })
          }
        },
        {
          title: this.$t('module.userManage.validDateEnd'),
          key: "effectEnd",
          minWidth: 120,
          align: "center",
          render: (h, params) => {
            return h('format', {
              props: {
                type: 'date',
                value: params.row.effectEnd,
                param: 'yyyy-MM-dd'
              }
            })
          }
        }
      ]
    },  
    search(page) {
      this.$refs["userTable"].load(Object.assign({}, this.formSearch, {
        effectBegin: this.formSearch.effectBegin && new Date(this.formSearch.effectBegin).Format('yyyy-MM-dd'),
        effectEnd: this.formSearch.effectEnd && new Date(this.formSearch.effectEnd).Format('yyyy-MM-dd')
      }), page);
    },
    edit(id) {
    //  console.log(id);
      var addStr = this.getIds();
      $store.dispatch('addOrgUser',{orgId:id,userIds:addStr}).then((res)=>{
        if(res.statusCode=='0'){
          this.$Message.success({
                content: res.msg,
                duration: 3
              });
              this.search();
             this.reflesh();
        }else{
              this.$Message.warning({
                content:res.msg,
                duration:3
              })
            }
      })
    },
    editDimension(userId, version) {
      new this.$pageModal(
        AssignDimension,
        {
          props: {
            objectId: userId
          }
        }, (data) => {
        });
    },
    getIds() {
      var list = this.$refs["userTable"].getSelectioned() || [];
      var ids = [];
      for (var u of list) {
        ids.push(u.userId);
      }
      return ids.join(",");
    },

    formReset() {
      this.$refs["roleFormSearch"].resetFields();
      this.search(1);
    },
  
    // 异步加载数据方法
    loadNode(node, resolve) {
      // console.log(node);
      if (node.data.depId) {
        this.currnodeId = node.data.depId;
        if (
          this.userListStore[this.currnodeId] &&
          this.userListStore[this.currnodeId].length > 0
        ) {
          this.userList = this.userListStore[this.currnodeId];
          return;
        }
        this.$store
          .dispatch("GetGroupByOrg", { orgId: this.currnodeId })
          .then(response => {
            var nextNodes = [];
            if (response.depList.length > 0) {
              for (var i = 0; i < response.depList.length; i++) {
                var depItem = response.depList[i];
                nextNodes.push({
                  name: depItem.orgName,
                  depId: depItem.orgId,
                  children: []
                });
                resolve(nextNodes);
              }
            } else {
              resolve(nextNodes);
            }
            this.userListStore[this.currnodeId] = response.empList;
            this.userList = this.userListStore[this.currnodeId];
            this.$forceUpdate();
          });
      } else {
        $store.dispatch("GetGroupByOrg", { orgId: this.currnodeId }).then(response => {
          for (var i = 0; i < response.depList.length; i++) {
            var item = response.depList[i];
            this.baseData.push({
              name: item.orgName,
              depId: item.orgId,
              children: []
            });
          }
          this.userListStore[this.currnodeId] = response.empList;
          for (
            var i = 0;
            i < this.userListStore[this.currnodeId].length;
            i++
          ) {
            var item = this.userListStore[this.currnodeId];
            item.isCheck = false;
          }
          this.$forceUpdate();
        });
      }
    },
    nodeCallback(data) {
      // console.log(data);
    },
    nodeCollapse(data, node) {
      this.userList = [];
    },
    nodeExpand(data, node) {
      this.userList = this.userListStore[data.depId];
      this.$forceUpdate();
    },
    // 选择人员方法
    selectUser(item) {
      item.isCheck = !item.isCheck;
      this.$forceUpdate();
    },
    // 删除选中的人员
    deleteSelected(item) {
      item.isCheck = !item.isCheck;
      this.$forceUpdate();
    },
    // 选中添加处理
    plusUser() {
      if (this.selectList <= 0) {
        for (var i = 0; i < this.userListStore[this.currnodeId].length; i++) {
          var noItem = this.userListStore[this.currnodeId][i];
          if (noItem.isCheck) {
            this.selectList.push({
              key: this.currnodeId,
              value: noItem,
              isCheck: false
            });
          }
        }
      } else {
        for (var i = 0; i < this.userListStore[this.currnodeId].length; i++) {
          var hasItem = this.userListStore[this.currnodeId][i];
          if (hasItem.isCheck) {
            var Index = "";
            Index = this.selectList.findIndex((item, index, arr) => {
              return hasItem.userId == item.value.userId;
            });
            console.log(Index);
            if (Index < 0) {
              this.selectList.push({
                key: this.currnodeId,
                value: hasItem,
                isCheck: false
              });
            }
            Index = "";
          }
        }
      }
      this.$forceUpdate();
    },
    // 去掉选中处理
    minusUser() {
      var indexArr = [];
      for (var i = 0; i < this.selectList.length; i++) {
        var selItem = this.selectList[i];
        if (selItem.isCheck) {
          indexArr.push(i);
          var userIndex = "";
          userIndex = this.userListStore[
            selItem.key
          ].findIndex((value, index, arr) => {
            return value.userId == selItem.value.userId;
          });

          if (userIndex >= 0) {
            this.userListStore[selItem.key][userIndex].isCheck = false;
          }
          userIndex = "";
        }
      }
      for (var k = 0; k < indexArr.length; k++) {
        var i = this.selectList.findIndex(row => {
          return row.isCheck == true;
        });
        this.selectList.splice(i, 1);
      }
      this.$forceUpdate();
    },
    onOk() {
      if (this.selectList.length <= 0) {
        this.$Message.warning(this.$t('module.userManage.warning.selectFiles'));
        return;
      }
      var userList = [];
      for (var i = 0; i < this.selectList.length; i++) {
        var seItem = this.selectList[i];
        userList.push({
          userCode: seItem.value.userCode,
          userName: seItem.value.userName,
          userId: seItem.value.userId
        });
      }
      this.$store
        .dispatch("ImportGroup", { userList: userList })
        .then(response => {
          this.modal = false;
          if (response.statusCode != "0") {
            this.$Message.warning({
              content: res.msg,
              duration: 3
            });
            return;
          }
          this.search(1);
        });
    },
    onCancel() {
      this.modal = false;
    },
    userTypeText(type) {
      switch (type) {
        case 0:
          return this.$t('module.userManage.systemUser');
        case 1:
          return this.$t('module.userManage.LDAPUser');
        case 2:
          return this.$t('module.userManage.customUser');
        default:
          return ''
      }
    },
    getOperation(userId, version) {
      var operations = [];
      operations.push(
        {
          loading: this.editIconLoading,
          type: "icon",
          icon: "edit",
          text: this.$t('common.edit'),
          handle: () => {
            this.edit(userId, version);
          }
        }
      );
      var dimensionOperationType = this.$store.state.dimensionOperationType;
      if (dimensionOperationType != 1) {
        operations.push(this.getDimension(userId, version));
      }
      return operations;
    },
    getDimension(userId, version) {
      return {
        type: "icon",
        icon: "gear-b",
        text: this.$t('module.userManage.dimensionManage'),
        handle: () => {
          this.editDimension(userId, version);
        }
      };
    }
  },
};
</script>
<style lang="less">
.modal-group-person {
  .group-person-item {
    padding: 5px 10px;
    margin-bottom: 1px;
    // height: 20px;
    // line-height: 20px;
  }
  .group-person-item.active {
    background-color: #f8f8f9 !important;
  }
}
.transfer-panel-empty {
  display: block;
  color: #b4bccc;
}
.group-person-item + .transfer-panel-empty {
  display: none;
}
.group-person-select + .transfer-panel-empty {
  display: none;
}
.group-person-select {
  width: 100%;
  padding: 5px 10px;
  margin-bottom: 1px;
}
</style>