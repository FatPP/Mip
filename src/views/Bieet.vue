
<template>
  <div class="padding-20 page-box-row-left" style="overflow:hidden">
    <FormBlock
      :title="$t('module.baobiaoManage.affiliation')"
      v-show="!hideMenuText"
      class="ivu-menu"
      direction="column"
      style="width:auto;"
    >
      <Button
        class="btn"
        style="padding:0;"
        :style="{color:'#aaa',transform: 'rotateZ(' + (this.hideMenuText ? '-90' : '0') + 'deg)'}"
        type="text"
        @click="toggleClick"
      >
        <Icon type="navicon" size="20"></Icon>
      </Button>
      <el-tree
        :data="orgTree"
        :load="loadData"
        lazy
        ref="orgTree"
        :props="orgTreeProps"
        @node-click="handleNodeClick"
      ></el-tree>
    </FormBlock>
    <FormBlock
      v-show="hideMenuText"
      direction="column"
      class="ivu-menu"
      style="width:20px;float:left"
    >
      <Button
        class="btn2"
        style="padding:0;"
        :style="{color:'#aaa',transform: 'rotateZ(' + (this.hideMenuText ? '-90' : '0') + 'deg)'}"
        type="text"
        @click="toggleClick"
      >
        <Icon type="navicon" size="20"></Icon>
      </Button>
    </FormBlock>
    <!-- <div class="run-mod-box"> -->
    <FormBlock title="" direction="column"  class="show" style="width:auto;height:100%;">
      <Form
        ref="inputData"
        :model="inputData"
        :rules="rules"
        label-position="right"
        :label-width="100"
        class="formb"
        v-if="showItem"
      >
        <Row :gutter="20" class="code-row-bg">
          <Col span="24">
            <FormItem
              :label-width="60"
              :label="item.paraName"
              v-for="(item,index) in data1"
              :key="item"
              style="display:inline-block;"
            >
              <Input
                v-if="item.inputType=='文本字段' "
                v-model="inputData[index]"
                style="width:200px;"
                v-bind:disabled="isOrNoteRead"
                :value="item.defaultValue"
              ></Input>
              <el-date-picker
                type="date"
                v-if='item.inputType=="日历"'
                v-model="inputData[index]"
                style="width:200px"
                size="small"
                :format="item.dateFormat"
                :value-format="item.dateFormat"
              ></el-date-picker>
              <el-select
                v-model="inputData[index]"
                v-if="item.inputType=='选项列表'"
                v-bind:multiple="item.hasMoreValue==1"
                collapse-tags
                @focus="focus(item.paraValues)"
                class="tes"
                style="width:2 00px"
              >
                <el-option v-for="para in paraValues" :key="para" :value="para" :label="para"></el-option>
              </el-select>
            </FormItem>
            <div style="margin-left:25px;display:inline-block">
              <Button type="success" @click.native="onApply">应用</Button>
              <Button type="primary" @click.native="onRest()">重置</Button>
            </div>
            <FormItem label="备注:" :label-width="50" style="display:block">
              <span style="font-size:10px;color:red">{{promptRemark}}</span>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div id="test">
        <iframe
          :src="actionUrl"
          name="lastUrl"
          id="biee"
          width="100%"
          height="100%"
          frameborder="0"
        ></iframe>
      </div>
    </FormBlock>
    <!-- </div> -->
  </div>
</template>
<style scoped>
.run-mod-box {
  width: auto !important;
  height: 100% !important;
}
.formb {
  height: 20%;
  width: 100%;
  margin-left: 20px;
  overflow-x: hidden;
}
.show::-webkit-scrollbar {
  display: none !important;
}
.show {
  overflow: hidden;
}
#test {
  width: 98% !important;
  height: 100%;
  /* height: 710px\0; */
  margin-left: 20px;
  overflow: hidden;
}
.ivu-menu {
  z-index: 0 !important;
}
.padding-20 {
  height: 100% !important;
}
.btn2 {
  float: left;
  margin-top: 200px;
}
.btn {
  position: absolute;
  top: 0px;
  right: 1px;
  z-index: 100;
}
</style>
<script>
// import Three from "../tools/bieetGetThree.js";
export default {
  data() {
    return {
      showItem: false,
      menuId: "",
      dsUrl: "",
      reportPath: "",
      promptId: "",
      inputData: [],
      // paraList:[{promptId:'',colName:'',paraOperator:'',currentValue:''}],
      paraList: [],
      hideMenuText: false,
      isQueryMenusAndBtns: false,
      rolePermissonModalTitle: this.$t("module.role.permissionMaList"),
      permissionModal: false,
      tableData: [],
      baseData: [],
      paraValues: [],
      promptRemark: "",
      treeProps: {
        label: "title",
        children: "children"
      },
      formSearch: {
        enabled: "",
        roleName: "",
        id: ""
      },
      data1: "",
      saveLoading: false,
      originMenuBtns: [], //存储从后台查询的原始功能及资源数据
      menuIdMap: {}, //key:menuId,value:parentID
      checkedNodes: [], //待选中的节点列表
      selectedMenuIds: [], //保存所有的已选中的功能ID
      selectedBtnIds: [], //保存所有的已选中的资源ID
      // 组织树
      orgTree: [],
      orgTreeProps: {
        children: "children",
        label: "menuName"
      },
      rootOrg: {},
      actionUrl: ""
    };
  },
  computed: {},

  created: function() {},
  mounted: function() {},

  methods: {
    loadData(currentMenu, callback) {
      $store
        .dispatch("GetTreesId", {
          currentId: currentMenu.data.menuId
        })
        .then(response => {
          var childrenMenu = response.dataResult;
          var childrenMenus = childrenMenu.sort(function compare(a, b) {
            return a.menuName.localeCompare(b.menuName, "zh");
          });
          callback(childrenMenus);
        });
    },
    onRest() {
      for (var item in this.inputData) {
        this.inputData[item] = [];
      }
      this.showItem = false;
      this.showItem = true;
    },
    compute() {
      //创建对象数组并赋值
      var test1 = this.data1;
      var reformattedArray = test1.map(function(obj, index) {
        var rObj = {};
        rObj.promptId = obj.promptId; //添加id属性
        rObj.colName = obj.colName;
        rObj.colName = obj.colName;
        rObj.paraOperator = obj.paraOperator;
        rObj.currentValue = obj.defaultValues;
        return rObj;
      });
      for (var i = 0; i < reformattedArray.length; i++) {
          if (reformattedArray[i].currentValue != []) {
            if(test1[i].inputType=='日历'){
            this.inputData[i] = reformattedArray[i].currentValue.toString();
            }else{
            this.inputData[i] = reformattedArray[i].currentValue;
            }
          } else {
            this.inputData[i] = [];
          }
      }
      this.paraList = reformattedArray;
    },
    onApply() {
      // console.log(this.inputData)
      for (var i = 0; i < this.inputData.length; i++) {
        if (this.inputData[i] == null) {
          this.paraList[i].currentValue = "";
        } else {
          this.paraList[i].currentValue = this.inputData[i].toString();
        }
      }
      $store
        .dispatch("getBieeParaUrl", {
          menuId: this.menuId,
          dsUrl: this.dsUrl,
          reportPath: this.reportPath,
          promptId: this.promptId,
          paraList: this.paraList
        })
        .then(res => {
          if (res.statusCode == "0") {
            // this.onRest();
            this.actionUrl = res.dataResult.currentUrl;
            // //此处更新功能
            this.$Message.success({
              content: "数据加载成功",
              duration: 3
            });
          } else {
            this.$Message.error({
              content: res.msg
            });
          }
        });
    },
    promptRemarkGet() {
      $store
        .dispatch("getPromptDetail", { promptId: this.promptId })
        .then(res => {
          var data = res.dataResult;
          this.promptRemark = data.promptRemark;
        });
    },
    focus(paraValues) {
      this.paraValues = paraValues.sort(function compare(a, b) {
        return a.localeCompare(b, "zh");
      });
    },
    paramList() {
      $store
        .dispatch("paramList", {
          promptId: this.promptId
        })
        .then(res => {
          this.data1 = res.dataResult.paraList;
          if (this.data1 != "") {
            this.showItem = true;
            function getBrowserInfo() {
              var Sys = {};
              var ua = navigator.userAgent.toLowerCase();
              var re = /(msie|firefox|chrome|opera|version).*?([\d.]+)/;
              var m = ua.match(re);
              Sys.browser = m[1].replace(/version/, "'safari");
              Sys.ver = m[2];
              return Sys;
            }
            //获取当前的浏览器信息
            var sys = getBrowserInfo();
            //sys.browser得到浏览器的类型，sys.ver得到浏览器的版本
            // console.log(sys.browser + "的版本是：" + sys.ver);
            if (sys.browser == "msie") {
              test.setAttribute("style", "height:80%");
            } else {
              test.setAttribute("style", "height:78%");
            }
            // test.style.height='80%';
          } else {
            this.showItem = false;
          }
          function compare(item) {
            return function(a, b) {
              var value1 = a[item];
              var value2 = b[item];
              return value1 - value2;
            };
          }
          this.data1.sort(compare("paraSort"));
          this.compute();
        });
    },
    handleNodeClick(data, node, nodeElement) {
      this.inputData=[];
      if (data.lastUrl) {
        this.showItem = false;
        var test = document.getElementById("test");
        test.setAttribute("style", "height:100%");
        if (data.hasPara == "1") {
          this.promptId = data.promptId;
          this.paramList();
          this.promptRemarkGet();
          if (data.paraList != "") {
            test.setAttribute("style", "margin-top:4%");
          }
        }
        this.actionUrl = data.lastUrl;
        this.menuId = data.menuId;
        this.dsUrl = data.dsUrl;
        this.reportPath = data.reportPath;
        this.promptId = data.promptId;
        // console.log(this.menuId);
      }
    },
    toggleClick() {
      this.hideMenuText = !this.hideMenuText;
    }
  },
  watch: function() {},
  directives: {}
};
</script>

