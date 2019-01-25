<template>
  <div v-if="!noData" class="padding-20 page-box-row-left">
    <FormBlock title="组织树" direction="column" style="width:380px">
      <el-tree
        :data="baseData"
        :props="defaultProps"
        highlight-current
        check-strictly
        :default-expand-all="true"
        indent="10"
        node-key="orgId"
        ref="menuTree"
        @node-click="handleNodeClick"
        :render-content="renderContent"
        :expand-on-click-node="false"
      ></el-tree>
    </FormBlock>
    <FormBlock title="组织树详情" direction="column">
      <Form
        ref="orgForm"
        :model="orgForm"
        :rules="rules"
        label-position="right"
        :label-width="100"
        v-if="showDetail"
      >
        <div class>
          <!-- <Row :gutter="20" class="code-row-bg">
            <Col span="20">
              <Form-item prop="dsId" :label="$t('module.bieet.dsId')">
                <el-select v-model="orgForm.dsId" style="width:100%" v-bind:readonly="isReadOnly">
                  <el-option
                    value="biee"
                    :label="$t('module.bieet.biee')"
                  >{{$t('module.bieet.biee')}}</el-option>
                  <el-option
                    value
                    :label="$t('module.bieet.nothing')"
                  >{{$t('module.bieet.nothing')}}</el-option>
                </el-select>
              </Form-item>
            </Col>
          </Row>-->
          <Row :gutter="20" class="code-row-bg">
            <Col span="20">
              <Form-item prop="orgId" label="机构编码">
                <Input v-model="orgForm.orgId" placeholder v-bind:disabled="isOrNoteRead"></Input>
              </Form-item>
            </Col>
          </Row>
          <Row :gutter="20" class="code-row-bg">
            <Col span="20">
              <Form-item prop="orgName" label="机构全称">
                <Input v-model="orgForm.orgName" placeholder v-bind:readonly="isReadOnly"></Input>
                <!-- <Icon class="global-icon" v-show="isShow"  @click.native="menuEdit"></Icon>               -->
              </Form-item>
            </Col>
          </Row>
          <Row :gutter="20" class="code-row-bg">
            <Col span="20">
              <Form-item prop="orgNameAbbr" label="机构简称">
                <Input v-model="orgForm.orgNameAbbr" placeholder v-bind:readonly="isReadOnly"></Input>
                <!-- <Icon class="global-icon" v-show="isShow"  @click.native="menuEdit"></Icon>               -->
              </Form-item>
            </Col>
          </Row>
          <Row :gutter="20" class="code-row-bg">
            <Col span="20">
              <Form-item prop="parentName" label="上级机构名称">
                <Input v-model="orgForm.parentName" placeholder readonly></Input>
                <!-- <Icon class="global-icon" v-show="isShow"  @click.native="menuEdit"></Icon>               -->
              </Form-item>
            </Col>
          </Row>
          <Row :gutter="20" class="code-row-bg">
            <Col span="20">
              <Form-item prop="orgLevelCd" label="机构层级">
                <el-select v-model="orgForm.orgLevelCd" style="width:100%;">
                  <el-option v-for="para in orgLevels" :key="para" :value="para" :label="para"></el-option>
                </el-select>
              </Form-item>
            </Col>
          </Row>
          <Row :gutter="20" class="code-row-bg">
            <Col span="20">
              <Form-item prop="orgStat" label="机构状态">
                <el-select v-model="orgForm.orgStat" style="width:100%">
                  <el-option v-for="para in orgStates" :key="para" :value="para" :label="para"></el-option>
                </el-select>
              </Form-item>
            </Col>
          </Row>
          <Row :gutter="20" class="code-row-bg">
            <Col span="20">
              <Form-item prop="pbcFinLicenseCd" label="人行金融机构代码">
                <Input v-model="orgForm.pbcFinLicenseCd" placeholder v-bind:readonly="isReadOnly"></Input>
              </Form-item>
            </Col>
          </Row>
          <Row :gutter="20" class="code-row-bg">
            <Col span="20">
              <Form-item prop="orgDes" label="机构描述">
                <Input v-model="orgForm.orgDes" placeholder v-bind:readonly="isReadOnly"></Input>
              </Form-item>
            </Col>
          </Row>
          <Row :gutter="20" class="code-row-bg">
            <Col span="20">
              <Form-item prop="orgAddress" label="机构地址">
                <Input v-model="orgForm.orgAddress" placeholder v-bind:readonly="isReadOnly"></Input>
              </Form-item>
            </Col>
          </Row>
          <Row :gutter="20" class="code-row-bg" v-show="!isReadOnly">
            <Col span="20">
              <Button
                class="ivu-btn-hr"
                type="primary"
                @click="saveOrUpdateMenu"
                style="margin-left:100px;"
                :loading="saveLoading"
              >{{btnTitle}}</Button>
            </Col>
          </Row>
        </div>
      </Form>
      <!-- 暂无数据 -->
      <div class="noInfoShow">{{$t("module.bieet.noData")}}</div>
    </FormBlock>
  </div>
  <div class="sidelip-noInfor" v-else style=" text-align: center;margin-top: 100px;">
    <span class="infor-icon" style="cursor:pointer;">
      <Icon type="person-add"/>
    </span>
    <p>{{$t("module.bieet.addMenuTip")}}</p>
    <Button
      type="primary"
      icon="plus"
      style="width:100px"
      @click="addMenu(true)"
    >{{$t("common.creat")}}</Button>
  </div>
</template>

<style>
.el-input__inner{
  font-size:12px !important;
}
</style>

<script>
import Three from "../../tools/getThreeByOrg.js";
export default {
  name: "menu-manage",
  title: "this.$t('module.bieet.manageMenu')",
  components: {},
  data() {
    const validateMenuId = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t("module.bieet.warning.enterMenuCode")));
      } else if (value.length > 50) {
        callback(
          new Error(this.$t("module.bieet.warning.menuCodeMoreThan50Charts"))
        );
      } else if (!new RegExp("^[a-zA-Z0-9_]{1,}$").test(value)) {
        callback(new Error(this.$t("module.bieet.warning.menuCodeForm")));
      }
      callback();
    };
    const validateorgLevelCd = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("机构层级不能为空"));
      }
      callback();
    };
    const validateOrgNameAbbr = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("机构简称不能为空"));
      }
      callback();
    };
    const validateMenuName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t("module.bieet.warning.enterMenuName")));
      } else if (value != value.trim()) {
        callback(new Error(this.$t("module.bieet.warning.menuNameNoSpace")));
      } else if (value.length > 50) {
        callback(
          new Error(this.$t("module.bieet.warning.menuNameMoreThan50Charts"))
        );
      }
      callback();
    };

    const validateMenuDesc = (rule, value, callback) => {
      if (value != null && value != value.trim() && value.trim() === "") {
        callback(
          new Error(this.$t("module.bieet.warning.enterMenuDescription"))
        );
      }
      if (value != null && value.length > 200) {
        callback(
          new Error(
            this.$t("module.bieet.warning.//menuDescriptionMoreThan200Charts")
          )
        );
      }
      callback();
    };
    const validateSort = (rule, value, callback) => {
      if (
        !new RegExp("^[0-9]d*$").test(value) &&
        !value.replace(/(^\s*)|(\s*$)/g, "")
      ) {
        callback(new Error(this.$t("module.bieet.warning.sortNoMustBeNum")));
      }
      callback();
    };
    return {
      isShow: false,
      currentId: "",
      isReadOnly: false,
      orgId: "",
      pbcFinLicenseCd: "", //人行金融机构代码
      parentId: "",
      orgLevels: [],
      orgStates: [],
      orgLevelCd: "",
      orgStat: "",
      orgName: "",
      dsId: "",
      PORTALPATH: "",
      PAGE: "",
      mntUser: "",
      demandUser: "",
      demandDep: "",
      orgDes: "",
      version: "",
      reportPath: "", //分析页路径
      hasPara: "", //是否自建参数
      promptId: "", //提示器ID
      actionUrl: "",
      menuType: "",
      noData: false,
      saveLoading: false,
      orgSelectWin: false,
      showDetail: false,
      btnTitle: this.$t("common.save"),
      firstLoading: true,
      currentNodeIsRootMenu: false,
      orgNameAbbr: "",
      orgAddress: "",
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

      rules: {
        orgId: [{ validator: validateMenuId, trigger: "blur", required: true }],
        orgNameAbbr: [
          {
            validator: validateOrgNameAbbr,
            trigger: "blur",
            required: true
          }
        ],
        orgLevelCd: [
          {
            validator: validateorgLevelCd,
            trigger: "blur",
            required: true
          }
        ],
        orgName: [
          { validator: validateMenuName, trigger: "blur", required: true }
        ]
        //menuDesc: [{ validator: validateMenuDesc, trigger: "blur" }]
      },
      baseData: [
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
    append(store, data, sonData) {
      store.append(sonData, data);
      var menuTree = this.$refs["menuTree"];
      menuTree.setCurrentKey(sonData.orgId);
      this.node = menuTree.getCurrentNode();
      this.btnTitle = this.$t("common.save");
    },
    gotoAddMenu(data) {
      this.selectedData = data;
      this.addMenu(false);
    },
    // clearValidate(orgForm){
    //   this.$refs[orgForm].clearValidate();
    //   console.log(1);
    // },
    //添加删除小图标
    renderContent(h, { node, data, store }) {
      return (
        <span>
          <span title={node.label}>{node.label}</span>
          <div class="orgEditMenu" id={"MENU" + data.orgId}>
            <span
              v-show={data.menuType != "101"} //条件过滤显示
              class="orgEditSonMenu"
              on-click={event => this.addMenu(false, node, event)} //传入event解决火狐兼容性问题
            >
              <i class="el-icon-plus" title={this.$t("module.bieet.create")}>
                {" "}
              </i>
            </span>
            <span
              v-show={data.orgId != "0"} //条件过滤显示
              class="orgEditSonMenu"
              on-click={event => this.deleteMenu(data, node, event)}
            >
              <i class="el-icon-delete" title={this.$t("module.bieet.delete")}>
                {" "}
              </i>
            </span>
          </div>
        </span>
      );
    },
    remove(store, data) {
      store.remove(data);
    },
    handleNodeClick(data, node, nodeElement) {
      // console.log(data.orgNameAbbr);
      if (data.orgNameAbbr !== "根节点") {
        $store.dispatch("getOrgDetail", { orgId: data.orgId }).then(res => {
          data = res.dataResult;
          this.version = data.version;
          this.isShow = true;
          this.currentId = data.orgId;
          this.isOrNoteRead = true;
          if (data.orgId == "0") {
            this.isReadOnly = true;
          } else {
            this.isReadOnly = false;
          }
          this.currentNodeIsRootMenu = false;
          this.node = node;

          this.showDetail = true;
          this.btnTitle = this.$t("common.save");
          var v_parentMenuName = node.parent.data.orgNameAbbr;
          //重置表单
          if (this.$refs["orgForm"] != undefined) {
            this.$refs["orgForm"].resetFields();
          }

          this.orgForm = {
            orgId: data.orgId,
            orgName: data.orgName,
            orgNameAbbr: data.orgNameAbbr,
            parentId: data.parentId,
            orgDes: data.orgDes,
            version: data.version,
            orgLevelCd: data.orgLevelCd,
            orgStat: data.orgStat,
            pbcFinLicenseCd: data.pbcFinLicenseCd,
            parentName: v_parentMenuName,
            orgAddress: data.orgAddress
          };
        });
      }
    },
    loadNode(node, resolve) {
      $store.dispatch("orgList").then(res => {
        this.orgLevels = res.dataResult.orgLevels;
        this.orgStates = res.dataResult.orgStats;
        // console.log(res.dataResult.orgList);
        var tree = new Three(res.dataResult.orgList, {
          sort: true
        });
        //console.log(res);
        this.baseData[0].children = tree.json;
      });

      //node.checked = checked;
    },
    addMenu(addTopMenu, node, event) {
      this.isShow = false;
      event.stopPropagation(); //阻止点击事件向上冒泡
      this.isOrNoteRead = false;
      var parentName = "";
      var parentId = "";
      this.node = node;
      this.isReadOnly = false;
      console.log(this.node.data.length)
      if (addTopMenu || this.node == null || this.node.data.length == 0) {
        this.noData = false;
        parentName = this.orgNameAbbr;
        parentId = "0";
      } else {
        parentName = this.node.data.orgNameAbbr;
        parentId = this.node.data.orgId == "0" ? "" : this.node.data.orgId;
      }
      this.showDetail = true;
      this.btnTitle = '创建新组织';
      console.log(parentId);
      this.orgForm = {
        orgId: this.orgId,
        orgName: "",   
        parentName: parentName,
        parentId: parentId,
        operation: "add"
      };
    },
    deleteMenu(data, node, event) {
      event.stopPropagation(); //火狐不支持
      this.handleNodeClick(data, node); //此处将当前详情页修改为当前点击条目，这样做，不太理想：Yelow
      var parentNode = node.parent;
      new $confirm(this.$t("module.bieet.confirmDelete"), this).then(() => {
        $store.dispatch("deleteCrbOrg", { orgId: data.orgId }).then(res => {
          if (res.statusCode == "-1") {
            this.$Message.warning({
              content: res.msg,
              duration: 3
            });
            return;
          }
          this.loadNode();
          this.$Message.success({
            content: this.$t("module.bieet.deleteSuccess"),
            duration: 3
          });
          //此处应该刷新功能树,右侧显示上级功能
          this.remove(node.store, node.data);
          if (parentNode.level > 0) {
            this.$refs["menuTree"].setCurrentKey(parentNode.data.orgId);
            this.handleNodeClick(parentNode.data, parentNode);
          } else {
            this.baseData = [];
            this.firstLoading = true;
            this.noData = true;
          }
        });
      });
    },
    saveOrUpdateMenu() {
      this.$refs["orgForm"].validate(valid => {
        var v_parentMenuName = this.orgForm.parentName;
        if (valid) {
          this.saveLoading = true;
          var paramEdit = {
            orgId: this.orgForm.orgId,
            //MenuCode: this.orgForm.MenuCode,
            orgName: this.orgForm.orgName,
            orgNameAbbr: this.orgForm.orgNameAbbr,
            parentId: this.orgForm.parentId,
            version: this.version,
            orgLevelCd: this.orgForm.orgLevelCd,
            orgDes: this.orgForm.orgDes,
            orgStat: this.orgForm.orgStat,
            pbcFinLicenseCd: this.orgForm.pbcFinLicenseCd,
            orgAddress: this.orgForm.orgAddress
          };
          var paramAdd = {
            orgId: this.orgForm.orgId,
            //MenuCode: this.orgForm.MenuCode,
            orgName: this.orgForm.orgName,
            orgNameAbbr: this.orgForm.orgNameAbbr,
            parentId: this.orgForm.parentId,
            version: this.version,
            orgLevelCd: this.orgForm.orgLevelCd,
            orgDes: this.orgForm.orgDes,
            orgStat: this.orgForm.orgStat,
            pbcFinLicenseCd: this.orgForm.pbcFinLicenseCd,
            orgAddress: this.orgForm.orgAddress
          };
          if (this.orgForm.operation != "add") {
            $store.dispatch("updateCrbOrg", paramEdit).then(response => {
              var param = paramEdit;
              if (response.statusCode == "0") {
                //编辑后刷新页面
                this.loadNode();
                this.$Message.success({
                  content:'组织修改成功',
                  duration: 3
                });
                this.saveLoading = false;
                if (this.currentNodeIsRootMenu) {
                  this.baseData[0].orgId = param.orgId;
                  this.baseData[0].orgName = param.orgName;
                  this.baseData[0].orgNameAbbr = param.orgNameAbbr;
                  this.baseData[0].parentId = param.parentId;
                  this.baseData[0].version = param.version;
                  this.baseData[0].orgDes = param.orgDes;
                  this.baseData[0].pbcFinLicenseCd = param.pbcFinLicenseCd;
                  this.baseData[0].orgAddress = param.orgAddress;
                } else {
                  //此处更新功能树
                  this.node.data.orgId = param.orgId;
                  this.node.data.orgName = param.orgName;
                  this.node.data.orgNameAbbr = param.orgNameAbbr;
                  this.node.data.pbcFinLicenseCd = param.pbcFinLicenseCd;
                  this.node.data.orgAddress = param.orgAddress;
                  this.node.data.orgDes = param.orgDes;
                  this.node.data.parentId = param.parentId;
                  this.node.data.version = param.version;
                }
              } else {
                this.$Message.error({
                  content: response.msg,
                  duration: 3
                });
              }
              this.saveLoading = false;
            });
          } else {
            $store.dispatch("addCrbOrg", paramAdd).then(response => {
              if (response.statusCode == "0") {
              var param = paramAdd;

                this.isShow = true;
                //添加后刷新页面
                this.loadNode();
                //此处更新功能
                this.$Message.success({
                  content:'组织添加成功',
                  duration: 3
                });
                this.isOrNoteRead = true;
                // this.saveLoading = false;
                // //console.log(param);
                // param.orgId = response.dataResult.orgList.orgId;
                this.orgForm.orgId = param.orgId; //此处有bug，应该是从response返回结果中取menuId
                var child = {
                  orgId: param.orgId,
                  orgName: param.orgName,
                  orgNameAbbr:param.orgNameAbbr,
                  parentId: param.parentId,
                  
                  parentName: v_parentMenuName,
                  children: []
                };

                if (this.baseData.length == 0) {
                  this.baseData.push(child);
                } else {
                  this.append(this.node.store, this.node.data, child);
                }
              } else {
                this.$Message.error({
                  content: response.msg
                });
              }
            });
            this.saveLoading = false;
          }
        } else {
          this.$Message.error(this.$t("module.bieet.validateFail"));
        }
      });
    }
  },
  watch: {},
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