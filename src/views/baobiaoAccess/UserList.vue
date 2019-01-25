<template>
  <div>
    <PageTable ref="userTable" action="QueryUser" :columnsFn="generateColumns">
      <Form :model="formSearch" ref="roleFormSearch" slot="search-bar" class="ivu-form-no-margin-bottom" inline>
        <Form-item prop="userCode" :label="$t('module.userManage.account')">
          <Input type="text" v-model="formSearch.userCode" placeholder="" maxlength="30" size="small" />
        </Form-item>
        <Form-item prop="userName" :label="$t('module.userManage.name')">
          <Input type="text" v-model="formSearch.userName" placeholder="" maxlength="30" size="small" />
        </Form-item>
        <!-- <Form-item prop="mobile" :label="$t('module.userManage.tel')">
          <Input type="text" v-model="formSearch.mobile" placeholder="" maxlength="20" size="small" />
        </Form-item> -->
        <Form-item prop="total" :label="$t('module.userManage.assignRoles')">
          <el-select v-model="formSearch.total" size="small" clearable>
            <el-option value="1" :label="$t('common.yes')">{{$t("common.yes")}}</el-option>
            <el-option value="0" :label='$t("common.no")'>{{$t("common.no")}}</el-option>
          </el-select>
        </Form-item>
        <Form-item prop="enabled" :label="$t('module.userManage.status')">
          <el-select v-model="formSearch.enabled" size="small" clearable>
            <el-option value="1" :label="$t('common.enable')">{{$t("common.enable")}}</el-option>
            <el-option value="0" :label="$t('common.disable')">{{$t("common.disable")}}</el-option>
          </el-select>
        </Form-item>
        <Form-item prop="type" :label="$t('module.userManage.type')">
          <el-select v-model="formSearch.type" size="small" clearable style="width:120px;">
            <el-option value="0" :label="$t('module.userManage.systemUser')">{{$t('module.userManage.systemUser')}}</el-option>
            <el-option value="1" :label="$t('module.userManage.LDAPUser')">{{$t("module.userManage.LDAPUser")}}</el-option>
            <el-option value="2" :label="$t('module.userManage.customUser')">{{$t('module.userManage.customUser')}}</el-option>
          </el-select>
        </Form-item>
        <Form-item prop="effectBegin" :label="$t('module.userManage.validDateBegin')">
          <DatePicker type="date" transfer="true" v-model="formSearch.effectBegin" @input="check" placeholder="" size="small"></DatePicker>
        </Form-item>
        <Form-item prop="effectEnd" :label="$t('module.userManage.validDateEnd')">
          <DatePicker type="date" transfer="true" v-model="formSearch.effectEnd" placeholder="" size="small" @input='check'></DatePicker>
        </Form-item>
        <span class="warning" v-if="error">结束时间必须大于生效时间</span>
      </Form>
      <div slot="handle-bar">
        <Button size="small" @click.native="search" type="warning" icon="search">{{$t("common.search")}}</Button>
        <Button size="small" @click.native="formReset" type="info" icon="loop">{{$t("common.reset")}}</Button>
      </div>
    </PageTable>
    <Modal v-model="modal" width="820" :closable="true">
      <div slot="header">
        <span class="send-mail-title">{{$t("module.userManage.importOrganizations")}}</span>
      </div>
      <div class="modal-group">
        <el-tree :data="baseData" :props="defaultProps" accordion lazy :load="loadNode" @node-expand="nodeExpand" @node-collapse="nodeCollapse" @node-click="nodeCallback"></el-tree>
      </div>
      <div class="modal-group-person">

        <div class="group-person-item" v-for="(item,index) in userList" :key="index" :class="item.isCheck?'active':''" @click="selectUser(item)">{{item.userName}}</div>
        <div class="transfer-panel-empty">{{$t("module.userManage.noData")}}</div>
      </div>
      <div class="modal-group-button">
        <div class="modal-center ivu-transfer-operation">
          <Button type="ghost" size="small" @click.native="plusUser">
            <Icon type="chevron-right"></Icon>
          </Button>
          <Button type="ghost" size="small" @click.native="minusUser">
            <Icon type="chevron-left"></Icon>
          </Button>
        </div>
      </div>
      <div class="modal-group-select">
        <div class="group-person-select" v-for="(item,index) in selectList" :key="index" :class="item.isCheck?'active':''" @click="deleteSelected(item)">{{item.value.userName}}</div>
        <div class="transfer-panel-empty">{{$t("module.userManage.noData")}}</div>
      </div>
      <div slot="footer">
        <Button type="ghost" @click.native="onCancel">{{$t("module.userManage.cancelImport")}}</Button>
        <Button type="primary" @click.native="onOk">{{$t("module.userManage.confirmImport")}}</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import AccessEditPage from "./AccessEdit.vue";
import AssignDimension from "../../../node_modules/ripples-core/src/views/system/dimension/AssignDimension.vue";
export default {
  name: 'user-list',
  components: {
  },
  data() {
    return {
      error:false,
      editIconLoading: false,
      formSearch: {
        userCode: "",
        userName: "",
        mobile: "",
        total: "",
        enabled: "",
        type: "",
        effectBegin: "",
        effectEnd: ''
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
    }
  },
  created() {

  },
  mounted() {

  },
watch(){
  if(this.formSearch.effectBegin!=''){
    console.log(1);
  }
  
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
          title: this.$t('module.baobiaoAccess.operating'),
          align: "center",
          width: 50,
          fixed: 'left',
          render: (h, params) => {
            return h("RowTools", {
              props: {
                data: this.getOperation(params.row.userId, params.row.version)
              }
            });
          }
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
          key: "orgNames"
        },
        {
          title: this.$t('common.role'),
          width: 80,
          align: "center",
          key: "roleNames",
          render: (h, params) => {
            var roles = params.row.roleNames ? params.row.roleNames.split(",") : [];
            return h(
              "Poptip",
              {
                props: {
                  trigger: "hover",
                  title: (!!params.row.roleNames ? roles.length : 0) + this.$t('module.userManage.roles'),
                  placement: "bottom"
                }
              },
              [
                h("Tag", !!params.row.roleNames ? roles.length : 0),
                h(
                  "div",
                  {
                    slot: "content"
                  },
                  [
                    h(
                      "ul",
                      roles.map(item => {
                        return h(
                          "li",
                          {
                            style: {
                              textAlign: "center",
                              padding: "4px"
                            }
                          },
                          item
                        );
                      })
                    )
                  ]
                )
              ]
            );
          }
        },
        {
          title: this.$t('common.status'),
          width: 110,
          align: "center",
          key: "enabled",
          render: (h, params) => {
            return h(
              "Tag",
              {
                props: {
                  type: "dot",
                  color: !!params.row.enabled ? "blue" : "red"
                }
              },
              !!params.row.enabled ? this.$t('common.enable') : this.$t('common.disable')
            );
          }
        },
        {
          title: this.$t('module.userManage.type'),
          key: "type",
          align: "center",
          width: 120,
          render: (h, params) => {
            return h(
              "span",
              this.userTypeText(params.row.type)
            );
          }
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
    check(){
      if(this.formSearch.effectBegin!=''&&this.formSearch.effectBegin!=''){
        if((this.formSearch.effectEnd).getTime()<(this.formSearch.effectBegin).getTime()){
          this.error=true;
        }else{
          this.error=false;
        }
      }
    },
    search(page) {
      if(this.error==false){
          this.$refs["userTable"].load(Object.assign({}, this.formSearch, {
        effectBegin: this.formSearch.effectBegin && new Date(this.formSearch.effectBegin).Format('yyyy-MM-dd'),
        effectEnd: this.formSearch.effectEnd && new Date(this.formSearch.effectEnd).Format('yyyy-MM-dd')
      }), page);
      }else{
        return;
      }
     
    },
    edit(roleId, version) {
      // if (this.editIconLoading) {
      //   return;
      // }
      new this.$sidelipPage(
        AccessEditPage,
        {
          props: {
            roleId,
            version
          }
        },
        () => {
          this.search(!!roleId ? "" : 1);
        }
      );
      // this.editIconLoading = true;
      // setTimeout(() => this.editIconLoading = false, 1000);
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
    toggleLock(status) {
      var ids = this.getIds();
      if (ids == "") {
        this.$Message.warning({
          content: status == 0 ? this.$t('module.userManage.warning.selectUserByDisable') : this.$t('module.userManage.warning.selectUserByEnable'),
          duration: 1.5
        });
        return;
      }
      new $confirm(`${this.$t('common.confirm')} ${status == 0 ? this.$t('common.disable') : this.$t('common.enable')}?`, this).then(() => {
        this.$store
          .dispatch("ToggleLockUser", {
            ids,
            status
          })
          .then(res => {
            if (!res.success) {
              this.$Message.warning({
                content: res.msg,
                duration: 3
              });
              return;
            }
            this.search();
          });
      });
    },
    deleteUser(user) {
      var userCode = user.userCode;
      var currentUserCode = this.currentUser.userCode;
      if (userCode == currentUserCode) {
        this.$Message.warning({
          content: this.$t('module.userManage.warning.deleteCurrentUser'),
          duration: 1.5
        });
        return;
      }
      var roleId = user.userId;
      var deleteStr = this.getIds();
      if (deleteStr == "" && typeof roleId != "string") {
        this.$Message.warning({
          content: this.$t('module.userManage.warning.selectDeleteUser'),
          duration: 1.5
        });
        return;
      }
      new $confirm(`${this.$t('common.confirmDeletion')}`, this).then(() => {
        this.$store.dispatch("DeleteUser", {
          ids: typeof roleId == "string" ? roleId : this.getIds()
        }).then(res => {
          if (!res.success) {
            this.$Message.warning({
              content: res.msg,
              duration: 3
            });
            return;
          }
          this.search();
        });
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
    importGroup() {
      if (!!this.userListStore) {
        for (var i = 0; i < this.selectList.length; i++) {
          var item = this.selectList[i];
          if (
            this.userListStore[item.key] &&
            this.userListStore[item.key].length > 0
          ) {
            for (var k = 0; k < this.userListStore[item.key].length; k++) {
              var storeItem = this.userListStore[item.key][k];
              if (storeItem.userId == item.value.userId) {
                storeItem.isCheck = false;
              }
            }
          }
        }
      }
      this.userList = [];
      this.selectList = [];
      this.modal = true;
    },
    formReset() {
      this.$refs["roleFormSearch"].resetFields();
      this.search(1);
    },
    importUser() {
      //this.modal = true;
      new this.$pageModal(
        ImportExcel,
        {

        }, (data) => {
          this.search();
        }
      )
    },
    exportUser() {
      this.sortData = this.$refs["userTable"].getSortData();
      var ids = this.getIds();
      // if(!!ids){
        this.DownloadFile({
          url: '/sys/account/excel/export/sync',
          method: 'post',
          data: {
            sortDTO: {
              fieldName: this.sortData.fieldName,
              orderBy: this.sortData.orderBy
            },
            userCode: this.formSearch.userCode,
            userName: this.formSearch.userName,
            enabled: this.formSearch.enabled,
            total: this.formSearch.total,
            mobile: this.formSearch.mobile,
            type: this.formSearch.type,
            userIds: ids,
            effectBegin: this.formSearch.effectBegin,
            effectEnd: this.formSearch.effectEnd
          }
        }, this)
      // }else{
      //   this.$Message.warning({
      //     content: this.$t('module.userManage.selectExportItems'),
      //     duration: 2
      //   })
      // }
    },
    // 异步加载数据方法
    loadNode(node, resolve) {
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
        this.$store.dispatch("GetGroupByOrg", { orgId: this.currnodeId }).then(response => {
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
          text: this.$t('module.baobiaoAccess.access'),
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
  }
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
.warning{
  display: inline-block;
  color:red;
  text-align: center;
  margin-top:5px;
}
</style>