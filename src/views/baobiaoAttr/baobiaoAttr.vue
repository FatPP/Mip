
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
        node-key="promptId"
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
              <Form-item prop="promptId" :label="$t('module.menu.promptId')">
                <Input v-model="menuForm.promptId"  v-bind:disabled="isOrNoteRead"></Input>
              </Form-item>
            </Col>
          </Row>
          <Row :gutter="20" class="code-row-bg">
            <Col span="20">
              <Form-item prop="promptName" :label="$t('module.bieet.name')">
                <Input v-model="menuForm.promptName" placeholder v-bind:readonly="isReadOnly"></Input>
              </Form-item>
            </Col>
          </Row>
          <Row :gutter="20" class="code-row-bg">
            <Col span="20">
              <Form-item prop="parentpromptName" :label="$t('module.bieet.parentNode')">
                <Input v-model="menuForm.parentpromptName" placeholder readonly="true"></Input>
              </Form-item>
            </Col>
          </Row>
          <Row :gutter="20" class="code-row-bg">
            <Col span="20">
              <Form-item prop="promptType" :label="$t('module.bieet.type')">
                <el-select v-model="menuForm.promptType" style="width:100%" v-bind:disabled="isOrNoteRead">
                  <el-option value="100" :label="$t('module.bieet.categoryType')">{{$t('module.bieet.categoryType')}}</el-option>
                  <el-option value="101" :label="$t('module.bieet.menuType')">{{$t('module.bieet.menuType')}}</el-option>
                </el-select>
              </Form-item>
            </Col>
          </Row>
          <Row :gutter="20" class="code-row-bg">
            <Col span="20">
              <Form-item prop="promptRemark" label="备注">
               <Input v-model="menuForm.promptRemark" placeholder v-bind:readonly="isReadOnly"></Input>
              </Form-item>
            </Col>
          </Row>
          <Row :gutter="20" class="code-row-bg" v-if="menuForm.promptType=='101'">
            <Col span="20">
              <Form-item prop="promptProp" :label="$t('module.menu.promptProp')">
                <Icon
                  type="plus-circled"
                  size="120px"
                  @click.native="menuEdit(menuForm.promptId,menuForm.version,menuForm.promptRemark)"
                  style="margin-top:10px;cursor:pointer;"
                ></Icon>
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
import Three from "../../tools/getThrees.js";
import AttrEditPage from "./AttrEdit.vue";
// import test from './test.vue';
import AssignDimension from "../../../node_modules/ripples-core/src/views/system/dimension/AssignDimension.vue";
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
            this.$t("module.bieet.warning.menuDescriptionMoreThan200Charts")
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
      promptProp: "",
      isShow: false,
      currentId: "",
      isReadOnly: false,
      promptId: "",
      // //MenuCode: "",
      promptName: "",
      version: "",
      promptType: "",
      parentpromptName: "",
      promptRemark:"",
      noData: false,
      saveLoading: false,
      orgSelectWin: false,
      showDetail: false,
      btnTitle: this.$t("common.save"),
      firstLoading: true,
      currentNodeIsRootMenu: false,
      menuForm: {
        promptId: "", //提示器ID,
        promptName: "", //提示器名称
        parentId: "",
        createTime: "",
        createUser: "",
        updateTime: "",
        updteUser: "",
        promptType: "", //提示器类型
        version: "",
        promptRemark :""//备注
      },

      rules: {
        promptId: [
          { validator: validateMenuId, trigger: "blur", required: true }
        ],
        dsId: [
          {
            validator: validateDsId,
            trigger: "blur",
            required: true
          }
        ],
        promptName: [
          { validator: validateMenuName, trigger: "blur", required: true }
        ]
        //menuDesc: [{ validator: validateMenuDesc, trigger: "blur" }]
      },
      baseData: [
        //最外层虚拟功能，防止删除一级目录功能后整棵树消失
        {
          promptName: this.$t("module.bieet.rootNode"),
          promptId: "0",
          //MenuCode: "0",
          //menuDesc: this.$t('module.bieet.topMenu'),
          parentpromptName: this.$t("module.bieet.nothing"),
          parentId: "0",
          sort: "0",
          promptType: "100",
          children: [] //后天调取的树中的data放在这里
        }
      ],
      selectedData: {},
      defaultProps: {
        children: "children",
        label: "promptName"
      },
      node: {},
      nodeElement: {}
    };
  },
  computed: {},
  created: function() {
    this.$emit("setTitle", this.promptName);
    this.loadNode(); //初始化加载
  },
  mounted: function() {
    // this.selectFirstMenu(); //加载时默认显示页
  },
  methods: {
    menuEdit(promptId, version,promptRemark) {
      // console.log(promptId);
      new this.$sidelipPage(
        AttrEditPage,
        // test,
        {
          props: {
            promptId,
            version,
            promptRemark
          }
        },
        () => {
          // this.search(!!promptId ? "" : 1);
        }
      );
    },
   
    editDimension(userId, version) {
      new this.$pageModal(
        AssignDimension,
        {
          props: {
            objectId: userId
          }
        },
        data => {}
      );
    },
    getDimension(userId, version) {
      return {
        type: "icon",
        icon: "gear-b",
        text: this.$t("module.userManage.dimensionManage"),
        handle: () => {
          this.editDimension(userId, version);
        }
      };
    },
    append(store, data, sonData) {
      store.append(sonData, data);
      var menuTree = this.$refs["menuTree"];
      menuTree.setCurrentKey(sonData.promptId);
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
          <div class="orgEditMenu" id={"MENU" + data.promptId}>
            <span
              v-show={data.promptType != "101"} //条件过滤显示
              class="orgEditSonMenu"
              on-click={event => this.addMenu(false, node, event)} //传入event解决火狐兼容性问题
            >
              <i class="el-icon-plus" title={this.$t("module.bieet.create")}>
                {" "}
              </i>
            </span>
            <span
              v-show={data.promptId != "0"} //条件过滤显示
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
      if (data.promptName !== "根节点") {
        $store
          .dispatch("getPromptDetail", { promptId: data.promptId })
          .then(res => {
            data = res.dataResult;
            this.version = data.version;
            this.isShow = true;
            this.currentId = data.promptId;
            this.isOrNoteRead = true;
            if (data.promptId == "0") {
              this.isReadOnly = true;
            } else {
              this.isReadOnly = false;
            }
            this.currentNodeIsRootMenu = false;
            this.node = node;

            this.showDetail = true;
            this.btnTitle = this.$t("common.save");
            var v_parentpromptName = node.parent.data.promptName;
            //重置表单
            if (this.$refs["menuForm"] != undefined) {
              this.$refs["menuForm"].resetFields();
            }

            this.menuForm = {
              promptId: data.promptId,
              promptName: data.promptName,
              promptType: data.promptType,
              parentId: data.parentId,
              version: data.version,
              parentpromptName: v_parentpromptName,
              promptProp: data.promptProp,
              promptRemark:data.promptRemark
            };
          });
      }
    },
    loadNode(node, resolve) {
      $store.dispatch("promptList").then(res => {
        console.log(res.dataResult);
        var tree = new Three(res.dataResult.prompts, {
          sort: true
        });
        //console.log(res);
        this.baseData[0].children = tree.json;
      });

      //node.checked = checked;
    },
    addMenu(addTopMenu, node, event) {
      // node.data.promptId;
      this.isShow = false;
      event.stopPropagation(); //阻止点击事件向上冒泡
      this.isOrNoteRead = false;
      var parentpromptName = "";
      var parentId = "";
      this.node = node;
      this.isReadOnly = false;
      if (addTopMenu || this.node == null || this.node.data.length == 0) {
        this.noData = false;
        parentpromptName = this.promptName;
        parentId = "";
      } else {
        parentpromptName = this.node.data.promptName;
        parentId =
          this.node.data.promptId == "0" ? "" : this.node.data.promptId;
      }
      this.showDetail = true;
      this.btnTitle = this.$t("module.bieet.createNewMenu");
      this.menuForm = {
        promptId: this.promptId,
        promptName: "",
        promptType: "100",
        parentpromptName: parentpromptName,
        parentId: parentId,
        operation: "add"
      };
    },
    deleteMenu(data, node, event) {
      event.stopPropagation(); //火狐不支持
      this.handleNodeClick(data, node); //此处将当前详情页修改为当前点击条目，这样做，不太理想：Yelow
      var parentNode = node.parent;
      // console.log(data.promptId);
      new $confirm(this.$t("module.bieet.confirmDelete"), this).then(() => {
        $store
          .dispatch("deleteBieePrompt", { promptId: data.promptId })
          .then(res => {
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
              this.$refs["menuTree"].setCurrentKey(parentNode.data.promptId);
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
        var v_parentpromptName = this.menuForm.parentpromptName;
        if (valid) {
          this.saveLoading = true;
          var paramEdit = {
            promptId: this.menuForm.promptId,
            promptName: this.menuForm.promptName,
            promptType: this.menuForm.promptType,
            parentId: this.menuForm.parentId,
            version: this.version,
            promptRemark:this.menuForm.promptRemark
          };
          var paramAdd = {
            promptId: this.menuForm.promptId,
            promptName: this.menuForm.promptName,
            promptType: this.menuForm.promptType,
            parentId: this.menuForm.parentId,
            version: this.version,
            promptRemark:this.menuForm.promptRemark
          };
          if (this.menuForm.operation != "add") {
            $store.dispatch("updateBieePrompt", paramEdit).then(response => {
              var param = paramEdit;
              if (response.statusCode == "0") {
                //编辑后刷新页面
                this.loadNode();
                this.$Message.success({
                  content: '提示器修改成功',
                  duration: 3
                });
                this.saveLoading = false;
                if (this.currentNodeIsRootMenu) {
                  this.baseData[0].promptId = param.promptId;
                  this.baseData[0].promptName = param.promptName;
                  this.baseData[0].promptType = param.promptType;
                  this.baseData[0].parentId = param.parentId;
                  this.baseData[0].version = param.version;
                  this.baseData[0].promptRemark=param.promptRemark;
                } else {
                  //此处更新功能树
                  this.node.data.promptId = param.promptId;
                  this.node.data.promptName = param.promptName;
                  this.node.data.promptType = param.promptType;
                  this.node.data.parentId = param.parentId;
                  this.node.data.version = param.version;
                  this.node.data.promptRemark=param.promptRemark;

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
            $store.dispatch("addBieePrompt", paramAdd).then(response => {
              if (response.statusCode == "0") {
                this.isShow = true;
                //添加后刷新页面
                this.loadNode();
                //此处更新功能
                this.$Message.success({
                  content: '提示器添加成功',
                  duration: 3
                });
                this.isOrNoteRead = true;
                param.promptId = response.dataResult.prompts.promptId;
                this.menuForm.promptId = param.promptId; //此处有bug，应该是从response返回结果中取promptId
                var child = {
                  promptId: param.promptId,
                  promptName: param.promptName,
                  parentId: param.parentId,
                  promptType: param.promptType,
                  parentpromptName: v_parentpromptName,
                  parentId: param.parentId,
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