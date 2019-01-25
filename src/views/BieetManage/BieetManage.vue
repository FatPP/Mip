<template>
  <div v-if="!noData" class="padding-20 page-box-row-left">
    <FormBlock :title="$t('module.bieet.menuInfo')" direction="column" style="width:380px">
      <el-tree
        :data="baseData"
        :props="defaultProps"
        highlight-current
        check-strictly
        :default-expand-all="true"
        indent="10"
        node-key="menuId"
        ref="menuTree"
        @node-click="handleNodeClick"
        :render-content="renderContent"
        :expand-on-click-node="false"
      ></el-tree>
    </FormBlock>
    <FormBlock :title="$t('module.bieet.menuDetail')" direction="column">
      <Form
        ref="menuForm"
        :model="menuForm"
        :rules="rules"
        label-position="right"
        :label-width="100"
        v-if="showDetail"
      >
        <div class>
          <Row :gutter="20" class="code-row-bg">
            <Col span="20">
              <Form-item prop="dsId" :label="$t('module.bieet.dsId')">
                <el-select v-model="menuForm.dsId" style="width:100%" v-bind:readonly="isReadOnly">
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
          </Row>
          <Row :gutter="20" class="code-row-bg">
            <Col span="20">
              <Form-item prop="menuId" :label="$t('module.menu.code')">
                <Input v-model="menuForm.menuId" placeholder v-bind:disabled="isOrNoteRead"></Input>
              </Form-item>
            </Col>
          </Row>
          <Row :gutter="20" class="code-row-bg">
            <Col span="20">
              <Form-item prop="menuName" :label="$t('module.bieet.name')">
                <Input v-model="menuForm.menuName" placeholder v-bind:readonly="isReadOnly"></Input>
                <!-- <Icon class="global-icon" v-show="isShow"  @click.native="menuEdit"></Icon>               -->
              </Form-item>
            </Col>
          </Row>
          <Row :gutter="20" class="code-row-bg">
            <Col span="20">
              <Form-item prop="parentMenuName" :label="$t('module.bieet.parentNode')">
                <Input v-model="menuForm.parentMenuName" placeholder readonly="true"></Input>
              </Form-item>
            </Col>
          </Row>
          <Row :gutter="20" class="code-row-bg">
            <Col span="20">
              <Form-item prop="menuType" :label="$t('module.bieet.type')">
                <el-select v-model="menuForm.menuType" style="width:100%" v-bind:disabled="isOrNoteRead">
                  <el-option
                    value="100"
                    :label="$t('module.bieet.categoryType')"
                  >{{$t('module.bieet.categoryType')}}</el-option>
                  <el-option
                    value="101"
                    :label="$t('module.bieet.menuType')"
                  >{{$t('module.bieet.menuType')}}</el-option>
                </el-select>
              </Form-item>
            </Col>
          </Row>
          <Row :gutter="20" class="code-row-bg" v-if="menuForm.menuType != 100">
            <Col span="20">
              <Form-item prop="hasPara" label="是否自建参数">
                <el-select v-model="menuForm.hasPara" style="width:100%">
                  <el-option value="1" label="是">是</el-option>
                  <el-option value="0" label="否">否</el-option>
                </el-select>
              </Form-item>
            </Col>
          </Row>
          <Row
            :gutter="20"
            class="code-row-bg"
            v-if="menuForm.menuType != 100&&menuForm.hasPara==1"
          >
            <Col span="20">
              <Form-item  prop="promptId" required  label="提示器ID">
                <Input v-model="menuForm.promptId" placeholder v-bind:readonly="isReadOnly"></Input>
              </Form-item>
            </Col>
          </Row>
          <Row
            :gutter="20"
            class="code-row-bg"
            v-if="menuForm.menuType != 100&&menuForm.hasPara==1"
          >
            <Col span="20">
              <Form-item prop="reportPath" label="分析页路径">
                <Input v-model="menuForm.reportPath" placeholder v-bind:readonly="isReadOnly"></Input>
              </Form-item>
            </Col>
          </Row>
          <Row
            :gutter="20"
            class="code-row-bg"
            v-if="menuForm.menuType != 100&&menuForm.hasPara!=1"
          >
            <Col span="20">
              <Form-item prop="PORTALPATH" :label="$t('module.bieet.PORTALPATH')">
                <Input v-model="menuForm.portalPath" placeholder v-bind:readonly="isReadOnly"></Input>
              </Form-item>
            </Col>
          </Row>
          <Row
            :gutter="20"
            class="code-row-bg"
            v-if="menuForm.menuType != 100&&menuForm.hasPara!=1"
          >
            <Col span="20">
              <Form-item prop="PAGE" :label="$t('module.bieet.PAGE')">
                <Input v-model="menuForm.page" placeholder v-bind:readonly="isReadOnly"></Input>
              </Form-item>
            </Col>
          </Row>
          <Row :gutter="20" class="code-row-bg" v-if="menuForm.menuType != 100">
            <Col span="20">
              <Form-item prop="mntUser" :label="$t('module.bieet.mntuser')">
                <Input v-model="menuForm.mntUser" placeholder v-bind:readonly="isReadOnly"></Input>
              </Form-item>
            </Col>
          </Row>
          <Row :gutter="20" class="code-row-bg" v-if="menuForm.menuType != 100">
            <Col span="20">
              <Form-item prop="demandUser" :label="$t('module.bieet.demanduser')">
                <Input v-model="menuForm.demandUser" placeholder v-bind:readonly="isReadOnly"></Input>
              </Form-item>
            </Col>
          </Row>
          <Row :gutter="20" class="code-row-bg" v-if="menuForm.menuType != 100">
            <Col span="20">
              <Form-item prop="demandDep" :label="$t('module.bieet.demanddep')">
                <Input v-model="menuForm.demandDep" placeholder v-bind:readonly="isReadOnly"></Input>
              </Form-item>
            </Col>
          </Row>
          <Row :gutter="20" class="code-row-bg">
            <Col span="20">
              <Form-item prop="reportDec" :label="$t('module.bieet.reportdec')">
                <Input v-model="menuForm.reportDec" placeholder v-bind:readonly="isReadOnly"></Input>
              </Form-item>
            </Col>
          </Row>
          <Row :gutter="20" class="code-row-bg">
            <Col span="20">
              <Form-item prop="sort" :label="$t('module.bieet.sortNo')">
                <InputNumber
                  min="0"
                  max="99"
                  v-model="menuForm.sort"
                  placeholder
                  style="width:100%"
                  v-bind:readonly="isReadOnly"
                ></InputNumber>
              </Form-item>
            </Col>
          </Row>
          <Row :gutter="20" class="code-row-bg" v-if="menuForm.menuType != 100">
            <Col span="20">
              <Form-item prop="actionUrl" :label="$t('module.bieet.frontModule')">
                <Input v-model="menuForm.actionUrl" placeholder v-bind:readonly="isReadOnly"></Input>
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
</style>

<script>
import Three from "../../tools/getThree.js";
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
    const validateDsId = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t("module.bieet.warning.selectDsId")));
      }
      callback();
    };
    const validatePromptId = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("提示器ID不能为空"));
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
      menuId: "",
      // //MenuCode: "",
      menuName: "",
      dsId: "",
      //menuDesc: "",
      sort: "",
      PORTALPATH: "",
      PAGE: "",
      mntUser: "",
      demandUser: "",
      demandDep: "",
      reportDec: "",
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
      menuForm: {
        portalPath: "", //仪表盘路径
        page: "", //仪表盘页名字
        //MenuCode: "",
        dsId: "", //数据源ID
        mntUser: "", //报表维护人
        demandUser: "", //需求提出人
        demandDep: "", //需求提出部门
        reportDec: "", //报表备注
        version: "", //版本
        menuName: "",
        menuId: "",
        parentMenuName: "",
        hasPara: "",
        promptId: "",
        reportPath: "",
        parentId: "", //parentMenuId
        //menuDesc: "",
        sort: "",
        Url: "",
        menuType: "",
        operation: ""
      },

      rules: {
        menuId: [
          { validator: validateMenuId, trigger: "blur", required: true }
        ],
        dsId: [
          {
            validator: validateDsId,
            trigger: "blur",
            required: true
          }
        ],
        // promptId: [
        //   {
        //     validator: validatePromptId,
        //     trigger: "blur",
        //     required: true
        //   }
        // ],
        menuName: [
          { validator: validateMenuName, trigger: "blur", required: true }
        ]
        //menuDesc: [{ validator: validateMenuDesc, trigger: "blur" }]
      },
      baseData: [
        //最外层虚拟功能，防止删除一级目录功能后整棵树消失
        {
          menuName: this.$t("module.bieet.rootNode"),
          menuId: "0",
          //MenuCode: "0",
          //menuDesc: this.$t('module.bieet.topMenu'),
          parentMenuName: this.$t("module.bieet.nothing"),
          parentId: "0",
          sort: "0",
          actionUrl: this.$t("module.bieet.nothing"),
          menuType: "100",
          children: [] //后天调取的树中的data放在这里
        }
      ],
      selectedData: {},
      defaultProps: {
        children: "children",
        label: "menuName"
      },
      node: {},
      nodeElement: {}
    };
  },
  computed: {},
  created: function() {
    this.$emit("setTitle", this.menuName);
    this.loadNode(); //初始化加载
  },
  mounted: function() {
    // this.selectFirstMenu(); //加载时默认显示页
  },
  methods: {
    append(store, data, sonData) {
      store.append(sonData, data);
      var menuTree = this.$refs["menuTree"];
      menuTree.setCurrentKey(sonData.menuId);
      this.node = menuTree.getCurrentNode();
      this.btnTitle = this.$t("common.save");
    },
    gotoAddMenu(data) {
      this.selectedData = data;
      this.addMenu(false);
    },
    // clearValidate(menuForm){
    //   this.$refs[menuForm].clearValidate();
    //   console.log(1);
    // },
    //添加删除小图标
    renderContent(h, { node, data, store }) {
      return (
        <span>
          <span title={node.label}>{node.label}</span>
          <div class="orgEditMenu" id={"MENU" + data.menuId}>
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
              v-show={data.menuId != "0"} //条件过滤显示
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
      if (data.menuName !== "根节点") {
        $store
          .dispatch("GetBieeMenuDetail", { menuId: data.menuId })
          .then(res => {
            data = res.dataResult;
            this.version = data.version;
            this.isShow = true;
            this.currentId = data.menuId;
            this.isOrNoteRead = true;
            if (data.menuId == "0") {
              this.isReadOnly = true;
            } else {
              this.isReadOnly = false;
            }
            this.currentNodeIsRootMenu = false;
            this.node = node;

            this.showDetail = true;
            this.btnTitle = this.$t("common.save");
            var v_parentMenuName = node.parent.data.menuName;
            //重置表单
            if (this.$refs["menuForm"] != undefined) {
              this.$refs["menuForm"].resetFields();
            }

            this.menuForm = {
              menuId: data.menuId,
              dsId: data.dsId,
              menuName: data.menuName,
              menuType: data.menuType,
              parentId: data.parentId,
              reportDec: data.reportDec,
              version: data.version,
              sort: data.sort,
              Url: data.url,
              parentMenuName: v_parentMenuName,
              portalPath: data.portalPath,
              page: data.page,
              mntUser: data.mntUser, //报表维护人
              demandUser: data.demandUser, //需求提出人
              demandDep: data.demandDep, //需求提出部门
              operation: "",
              hasPara: data.hasPara,
              promptId: data.promptId,
              reportPath: data.reportPath
            };
          });
      }
    },
    loadNode(node, resolve) {
      $store
        .dispatch("MenuList", {
          commonPageDTO: {
            currentPage: 1,
            pageSize: 10000
          }
        })
        .then(res => {
          // console.log(res.dataResult);
          var tree = new Three(res.dataResult.menuList, {
            sort: true
          });
          //console.log(res);
          this.baseData[0].children = tree.json;
        });

      //node.checked = checked;
    },
    addMenu(addTopMenu, node, event) {
      // node.data.menuId;
      this.isShow = false;
      event.stopPropagation(); //阻止点击事件向上冒泡
      this.isOrNoteRead = false;
      var parentMenuName = "";
      var parentId = "";
      this.node = node;
      this.isReadOnly = false;
      if (addTopMenu || this.node == null || this.node.data.length == 0) {
        this.noData = false;
        parentMenuName = this.menuName;
        parentId = "";
      } else {
        parentMenuName = this.node.data.menuName;
        parentId = this.node.data.menuId == "0" ? "" : this.node.data.menuId;
      }
      this.showDetail = true;
      this.btnTitle = this.$t("module.bieet.createNewMenu");
      this.menuForm = {
        menuId: this.menuId,
        //MenuCode: "",
        menuName: "",
        //menuDesc: "",
        actionUrl: "",
        menuType: "100",
        sort: "0",
        parentMenuName: parentMenuName,
        parentId: parentId,
        operation: "add"
      };
    },
    deleteMenu(data, node, event) {
      event.stopPropagation(); //火狐不支持
      this.handleNodeClick(data, node); //此处将当前详情页修改为当前点击条目，这样做，不太理想：Yelow
      var parentNode = node.parent;
      new $confirm(this.$t("module.bieet.confirmDelete"), this).then(() => {
        $store.dispatch("DeleteBieeMenu", { menuId: data.menuId }).then(res => {
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
            this.$refs["menuTree"].setCurrentKey(parentNode.data.menuId);
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
      this.$refs["menuForm"].validate(valid => {
        var v_parentMenuName = this.menuForm.parentMenuName;
        if (valid) {
          this.saveLoading = true;
          var paramEdit = {
            dsId: this.menuForm.dsId,
            menuId: this.menuForm.menuId,
            //MenuCode: this.menuForm.MenuCode,
            menuName: this.menuForm.menuName,
            //menuDesc: this.menuForm.//menuDesc,
            menuType: this.menuForm.menuType,
            actionUrl: this.menuForm.actionUrl,
            parentId: this.menuForm.parentId,
            version: this.version,
            sort: this.menuForm.sort,
            portalPath: this.menuForm.portalPath,
            page: this.menuForm.page,
            reportDec: this.menuForm.reportDec,
            mntUser: this.menuForm.mntUser, //报表维护人
            demandUser: this.menuForm.demandUser, //需求提出人
            demandDep: this.menuForm.demandDep, //需求提出部门,
            hasPara: this.menuForm.hasPara,
            promptId: this.menuForm.promptId,
            reportPath: this.menuForm.reportPath
          };
          var paramAdd = {
            dsId: this.menuForm.dsId,
            menuId: this.menuForm.menuId,
            //MenuCode: this.menuForm.MenuCode,
            menuName: this.menuForm.menuName,
            //menuDesc: this.menuForm.//menuDesc,
            menuType: this.menuForm.menuType,
            actionUrl: this.menuForm.actionUrl,
            parentId: this.menuForm.parentId,
            version: this.version,
            sort: this.menuForm.sort,
            portalPath: this.menuForm.portalPath,
            page: this.menuForm.page,
            reportDec: this.menuForm.reportDec,
            mntUser: this.menuForm.mntUser, //报表维护人
            demandUser: this.menuForm.demandUser, //需求提出人
            demandDep: this.menuForm.demandDep, //需求提出部门
            hasPara: this.menuForm.hasPara,
            promptId: this.menuForm.promptId,
            reportPath: this.menuForm.reportPath
          };
          if (this.menuForm.operation != "add") {
            $store.dispatch("UpdateBieeMenu", paramEdit).then(response => {
              var param = paramEdit;
              if (response.statusCode == "0") {
                //编辑后刷新页面
                this.loadNode();
                this.$Message.success({
                  content: this.$t("module.bieet.modifySuccess"),
                  duration: 3
                });
                this.saveLoading = false;
                if (this.currentNodeIsRootMenu) {
                  this.baseData[0].dsId = param.dsId;
                  this.baseData[0].menuId = param.menuId;
                  this.baseData[0].menuName = param.menuName;
                  this.baseData[0].menuType = param.menuType;
                  this.baseData[0].actionUrl = param.actionUrl;
                  this.baseData[0].parentId = param.parentId;
                  this.baseData[0].version = param.version;
                  this.baseData[0].sort = param.sort;
                  this.baseData[0].portalPath = param.portalPath;
                  this.baseData[0].page = param.page;
                  this.baseData[0].reportDec = param.reportDec;
                  this.baseData[0].mntUser = param.mntUser; //报表维护人
                  this.baseData[0].demandUser = param.demandUser; //需求提出人
                  this.baseData[0].demandDep = param.demandDep; //需求提出部门
                  this.baseData[0].hasPara = param.hasPara;
                  this.baseData[0].promptId = param.promptId;
                  this.baseData[0].reportPath = param.reportPath;
                } else {
                  //此处更新功能树
                  this.node.data.dsId = param.dsId;
                  this.node.data.menuId = param.menuId;
                  this.node.data.menuName = param.menuName;

                  this.node.data.menuType = param.menuType;
                  this.node.data.actionUrl = param.actionUrl;
                  this.node.data.parentId = param.parentId;
                  this.node.data.version = param.version;
                  this.node.data.sort = param.sort;
                  this.node.data.portalPath = param.portalPath;
                  this.node.data.page = param.page;
                  this.node.data.reportDec = param.reportDec;
                  this.node.data.mntUser = param.mntUser; //报表维护人
                  this.node.data.demandUser = param.demandUser; //需求提出人
                  this.node.data.demandDep = param.demandDep; //需求提出部门
                  this.baseData[0].hasPara = param.hasPara;
                  this.baseData[0].promptId = param.promptId;
                  this.baseData[0].reportPath = param.reportPath;
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
            $store.dispatch("AddBieeMenu", paramAdd).then(response => {
              var param=paramAdd;
              if (response.statusCode == "0") {
                this.isShow = true;
                //添加后刷新页面
                this.loadNode();
                //此处更新功能
                this.$Message.success({
                  content: this.$t("module.bieet.createSuccess"),
                  duration: 3
                });
                this.isOrNoteRead = true;
                // this.saveLoading = false;
                // //console.log(param);
                // param.menuId = response.dataResult.menuList.menuId;
                // this.menuForm.menuId = param.menuId; //此处有bug，应该是从response返回结果中取menuId
                var child = {
                  menuId: param.menuId,
                  menuName: param.menuName,
                  //MenuCode: param.//MenuCode,
                  //menuDesc: param.//menuDesc,
                  parentId: param.parentId,
                  sort: param.sort,
                  menuType: param.menuType,
                  parentMenuName: v_parentMenuName,
                  parentId: param.parentId,
                  actionUrl: param.actionUrl,
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