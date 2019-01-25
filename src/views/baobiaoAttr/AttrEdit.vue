<template>
  <div class="sidelip-box">
    <FormBlock title="参数列表">
      <div style="padding-left:20px;">
        <div slot="table-bar">
          <Button
            type="ghost"
            v-bind:disabled="isButtonDisabled"
            icon="plus-round"
            size="small"
            @click="menuEdit=true"
          >{{$t("common.create")}}</Button>
          <Modal
            v-model="menuEdit"
            on-text="确定"
            @on-ok="onOk"
            :closable="false"
            @on-cancel="onCancel"
            cancle-text="取消"
            scrollable="true"
            :title="TipForm.paraId==''?'新建参数':'参数修改'"
          >
            <Form
              ref="TipForm"
              :model="TipForm"
              :rules="rules"
              label-position="right"
              :label-width="100"
            >
              <Row :gutter="20" class="code-row-bg">
                <Col span="20">
                  <FormItem prop="colName" label="字段名称">
                    <Poptip trigger="focus">
                      <Input
                        v-model="TipForm.colName"
                        placeholder
                        v-bind:disabled="isOrNoteRead"
                        style="width:280px;"
                      ></Input>
                      <div slot="content">
                        <span style="font-size:10px">输入的格式为："表名"."字段名"</span>
                      </div>
                    </Poptip>
                  </FormItem>
                </Col>
              </Row>
              <Row :gutter="20" class="code-row-bg">
                <Col span="20">
                  <FormItem prop="paraName" label="标签">
                    <Input v-model="TipForm.paraName" placeholder v-bind:readonly="isReadOnly"></Input>
                  </FormItem>
                </Col>
              </Row>
              <Row :gutter="20" class="code-row-bg">
                <Col span="20">
                  <FormItem prop="paraDes" label="说明">
                    <Input type="textarea" name v-model="TipForm.paraDes" :rows="2"></Input>
                  </FormItem>
                </Col>
              </Row>
              <Row :gutter="20" class="code-row-bg">
                <Col span="20">
                  <FormItem prop="paraOperator" label="运算符">
                    <el-select v-model="TipForm.paraOperator" style="width:280px" v-bind:disabled="isOrNoteRead">
                      <el-option
                        v-for="item in pro"
                        :value="item"
                        :key="item"
                        :label="item"
                      >{{ item}}</el-option>
                    </el-select>
                  </FormItem>
                </Col>
              </Row>
              <Row :gutter="20" class="code-row-bg">
                <Col span="20">
                  <FormItem prop="inputType"  label="用户输入">
                    <el-select v-model="TipForm.inputType" @change='inputTypeChange' style="width:280px" v-bind:disabled="isOrNoteRead">
                      <el-option
                        v-for="item in userIn"
                        :value="item"
                        :key="item"
                        :label="item"
                      >{{ item}}</el-option>
                    </el-select>
                  </FormItem>
                </Col>
              </Row>
               <Row :gutter="20" class="code-row-bg" v-if="TipForm.inputType=='日历'">
                <Col span="20">
                  <FormItem prop="dateFormat"  label="日期格式">
                    <el-select v-model="TipForm.dateFormat" style="width:280px" v-bind:disabled="isOrNoteRead">
                      <el-option
                        v-for="item in dateFormats"
                        :value="item"
                        :key="item"
                        :label="item"
                      >{{ item}}</el-option>
                    </el-select>
                  </FormItem>
                </Col>
              </Row>
              <Row :gutter="20" class="code-row-bg" v-if="TipForm.inputType=='选项列表'">
                <Col span="20">
                  <FormItem prop="hasMoreValue"  required label="是否允许多选">
                    <el-select v-model="TipForm.hasMoreValue" style="width:280px" v-bind:disabled="isOrNoteRead">
                      <el-option value="1" label="是">是</el-option>
                      <el-option value="0" label="否">否</el-option>
                    </el-select>
                  </FormItem>
                </Col>
              </Row>
              <Row :gutter="20" class="code-row-bg">
                <Col span="20">
                  <FormItem prop="paraType" label="参数类型">
                    <el-select
                    style="width:280px"
                      v-model="TipForm.paraType"
                      aria-placeholder="请选择"
                      v-bind:disabled="isOrNoteRead"
                    >
                      <el-option v-for="item in pT" :value="item" :key="item" :label="item">{{item}}</el-option>
                    </el-select>
                  </FormItem>
                </Col>
              </Row>
              <Row :gutter="20" class="code-row-bg" v-if="TipForm.inputType=='选项列表'">
                <Col span="20">
                  <FormItem prop="paraStyle" label="参数选择">
                    <el-select
                    @change="change"
                      v-model="TipForm.paraStyle"
                      aria-placeholder="请选择"
                      v-bind:disabled="isOrNoteRead"
                      style="width:280px"
                    >
                      <el-option v-for="item in pS" :value="item" :key="item" :label="item">{{item}}</el-option>
                    </el-select>
                  </FormItem>
                </Col>
              </Row>
              <Row :gutter="20" class="code-row-bg" v-if="TipForm.paraStyle=='自定义'&&TipForm.inputType=='选项列表'">
                <Col span="20">
                  <FormItem prop="paraValue" label="参数值">
                    <Poptip trigger="focus" >
                      <Input v-model="TipForm.paraValue" placeholder="请输入参数值" style="width:280px"></Input>
                      <div class="api" slot="content">
                        <span style="font-size:10px">各个参数值之间用逗号隔开</span>
                      </div>
                    </Poptip>
                  </FormItem>
                </Col>
              </Row>
               <Row :gutter="20" class="code-row-bg" v-if="TipForm.paraStyle=='sql结果'&&TipForm.inputType=='选项列表'">
                <Col span="20">
                  <FormItem prop="paraSelectSql" label="SQL结果">
                    <Poptip trigger="focus" >
                    <Input type="textarea" name v-model="TipForm.paraSelectSql" rows="2" style="width:280px"></Input>                      
                      <div class="api" slot="content">
                        <span style="font-size:10px">只能输入以SELECT开头的SQL语句,注意去重</span>
                      </div>
                    </Poptip>
                   <span style="color:red" v-if="errShow&&TipForm.sqlErrorMsg!=''" @click="errorShow">{{TipForm.sqlErrorMsg.substring(0,60)+'......'}}</span>
                   <span style="color:red" v-if="!errShow&&TipForm.sqlErrorMsg!=''" @click="errorShow">{{TipForm.sqlErrorMsg.replace(/\s*/g,"")}}</span>
                  </FormItem>
                </Col>
              </Row>
              <Row :gutter="20" class="code-row-bg">
                <Col span="20">
                  <FormItem prop="defaultValue" label="参数的默认值">
                     <el-select
                      v-model="TipForm.defaultValue"
                      aria-placeholder="请选择"
                      v-bind:disabled="isOrNoteRead"
                      style="width:280px"
                      v-if="TipForm.inputType=='日历'"
                    >
                      <el-option v-for="item in defaultTime" :value="item" :key="item" :label="item">{{item}}</el-option>
                    </el-select>
                    <Input v-else v-model="TipForm.defaultValue" style="width:280px" v-bind:disabled="isOrNoteRead"></Input>
                  </FormItem>
                </Col>
              </Row>
              <Row :gutter="20" class="code-row-bg">
                <Col span="20">
                  <FormItem prop="paraSort" label="参数序号">
                    <Poptip trigger="focus">
                    <Input v-model="TipForm.paraSort" style="width:280px" v-bind:disabled="isOrNoteRead"></Input>
                    <div class="api" slot="content">
                      <span style="font-size:10px">参数序号需为数字类型</span>
                    </div>
                    </Poptip>
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </Modal>
          <Button
            type="ghost"
            v-bind:disabled="isButtonDisabled"
            icon="trash-a"
            size="small"
            @click="deleted()"
          >{{$t("common.delete")}}</Button>
        </div>
        <Table
          border
          stripe
          height="450"
          ref="selection"
          @on-row-click="rowClick"
          @on-selection-change="selectChange"
          :columns="columns4"
          :data="data1"
          style="overflow-x:hidden"
          :default-sort="{prop:'paraSort',order:'ascending'}"
        ></Table>
      </div>
    </FormBlock>
    <FormBlock title="显示">
      <Form
        ref="inputData"
        :model="inputData"
        :rules="rules"
        label-position="right"
        :label-width="100"
      >
        <Row :gutter="20" class="code-row-bg">
          <Col span="24" v-if="data1!=''">
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
              <Button type="success" disabled @click.native="onApply">应用</Button>
              <Button type="primary" @click.native="onRest">重置</Button>
            </div>
          </Col>
        </Row>
        <Row :gutter="20" class="code-row-bg">
          <Col span="24">
            <FormItem label="备注:" :label-width="50">
              <span style="font-size:10px;color:red">{{promptRemark}}</span>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </FormBlock>
  </div>
</template>
<style>
.sidelip-box {
  height: 100%;
  width: 100%;
  scroll-behavior: hidden;
}

.el-input__inner {
  height: 30px !important;
  line-height: 30px !important;
}
.el-date-picker{
  width: 275px !important;
}
.el-date-picker .el-picker-panel__content{
  width: 240px !important;
}
.el-picker-panel{
  line-height: 15px !important;
}
.el-input__icon {
  line-height: 30px !important;
  line-height: 25px !important\0;
}
.el-tag--small {
  line-height: 20px !important\0;
}
.formItem .ivu-FormItem-content {
  margin-left: 50px !important;
}
</style>

<script>
export default {
  name: "AccessEdit",
  components: {},
  props: {
    promptId: {
      type: String,
      default() {
        return "";
      }
    },
    version: {
      type: String,
      default() {
        return "";
      }
    },
    promptRemark: {
      type: String,
      default() {
        return "";
      }
    }
  },
  data() {
    const validateOperator = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("运算符不能为空"));
      }
      callback();
    };
    const validateInput = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("用户输入不能为空"));
      }
      callback();
    };
    const validateCol = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("字段名称不能为空"));
      }
      callback();
    };
     const validateSelect = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("SQL语句不能为空"));
      }
      callback();
    };
    const validateParaName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("参数名称不能为空"));
      }
      callback();
    };
    const validatehasMoreValue = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("是否允许多选不能为空"));
      }
      callback();
    };
    const validateParaValue = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("参数值不能为空"));
      }
      callback();
    };
     const validateSort = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("排序值不能为空"));
      }else if(isNaN(value)){
        callback(new Error("排序值只能为数字"));
      }
      callback();
    };
    // const validateSort = (rule, value, callback) => {
    //   if (
    //     !new RegExp("^[0-9]d*$").test(value) &&
    //     !value.replace(/(^\s*)|(\s*$)/g, "")
    //   ) {
    //     callback(new Error(this.$t("module.bieet.warning.sortNoMustBeNum")));
    //   }
    //   callback();
    // };
    return {
      errShow:true,
      isOrNoteRead: false,
      tableData: [],
      paraValue: "",
      paraType: "",
      hasMoreValue: "",
      Tips: [],
      dateFormat:'',
      paraSelectSql:'',
      inputData:[],
      paraSort: "", //参数排序
      colName: "", //字段名称
      menuEdit: false,
      paraName: "", //标签/参数名称
      paraDes: "", //说明
      paraOperator: "",
      inputType: "",
      defaultValue: "",
      paraIds: "",
      paraStyle: "",
      pro: [],
      userIn: [],
      dateFormats:[],
      defaultTime:[],
      columns4: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "提示标签",
          key: "paraName",
          // sortable: true,
          // sortby:'paraSort',
          align: "center"
        },
        {
          title: "类型",
          key: "inputType",
          align: "center"
        },
        {
          title: "提示",
          key: "colName",
          align: "center"
        },
        {
          title: "说明",
          key: "paraDec",
          align: "center"
        },
        {
          title: "排序",
          key: "paraSort",
          align: "center"
        }
      ],
      data1: [],
      pS: [],
      pT: [],
      paraValues: [],
      TipForm: {
        paraId: "", //参数ID
        paraName: "", //标签/参数名称
        paraDes: "", //说明
        paraOperator: "", //运算符
        colName: "", //字段名称
        hasMoreValue: "",
        paraType: "", //参数类型
        paraValue: "",
        defaultValue: "",
        version: "",
        paraSort: "",
        inputType: "",
        paraStyle: "",
        dateFormat:"",
        paraSelectSql:'',
        sqlErrorMsg:''
      },
      rules: {
        paraOperator: [
          {
            validator: validateOperator,
            trigger: "blur",
            required: true
          }
        ],
         paraSelectSql: [
          {
            validator: validateSelect,
            trigger: "blur",
            required: true
          }
        ],
        inputType: [
          {
            validator: validateInput,
            trigger: "blur",
            required: true
          }
        ],    
          paraSort:[{
            validator:validateSort,
            trigger:"blur",
            required:true
          }],
        colName: [
          {
            validator: validateCol,
            trigger: "blur",
            required: true
          }
        ],
        paraName: [
          {
            validator: validateParaName,
            trigger: "blur",
            required: true
          }
        ],
        paraValue: [
          {
            validator: validateParaValue,
            trigger: "blur",
            required: true
          }
        ],
        hasMoreValue: [
          {
            validator: validatehasMoreValue,
            trigger: "blur",
            required: true
          }
        ]
        //menuDesc: [{ validator: validateMenuDesc, trigger: "blur" }]
      }
    };
  },
  computed: {},
  created: function() {
    // console.log(this.promptId);
    this.paramList();
    this.$emit("SetTitle", "参数编辑");
  },
  beforeMount: function() {},
  mounted: function() {},
  beforeDestroy: function() {},
  destroyed: function() {},
  methods: {
    // inputTypeChange(){
    //   // console.log(this.TipForm.inputType);
    //   if(this.TipForm.inputType!='选项列表'){
    //     this.TipForm.paraStyle='';
    //     this.TipForm.paraValue='';
    //     this.TipForm.hasMoreValue='';
    //     // this.TipForm.paraSelectSql='';
    //   }
    // },
    errorShow(){
      this.errShow=!this.errShow;
    },
    focus(paraValues) {
      this.paraValues = paraValues.sort(function compare(a, b) {
        return a.localeCompare(b, "zh");
      });
    },
    paramList() {
      return $store
        .dispatch("paramList", {
          promptId: this.promptId
        })
        .then(res => {
          this.pro = res.dataResult.operator;
          this.userIn = res.dataResult.inputTypes;
          this.data1 = res.dataResult.paraList;
          this.pT = res.dataResult.paraTypes;
          this.pS = res.dataResult.paraStyles;
          this.dateFormats=res.dataResult.dateFormats;
          this.defaultTime=res.dataResult.defaultValues;
          //对象数组排序
          function compare(property){
            return function(a,b){
              var value1=a[property];
              var value2=b[property];
              return value1-value2;
            }
          }
          this.data1.sort(compare('paraSort'));
         this.compute();
        });
    },
     compute() {
      //创建对象数组并赋值
      var test1 = this.data1;
      var reformattedArray = test1.map(function(obj, index) {
        // console.log(index);
        var rObj = {};
        rObj.promptId = obj.promptId; //添加id属性
        rObj.colName = obj.colName;
        rObj.colName = obj.colName;
        rObj.paraOperator = obj.paraOperator;
        rObj.currentValue = obj.defaultValues;

        // rObj[obj.colName] = obj.colName; //修改属性

        return rObj;
      });
      // console.log(reformattedArray[0].currentValue);
      for (var i = 0; i < reformattedArray.length; i++) {
        // if (test1[i].hasMoreValue == 0) {
        //   this.inputData[i] = reformattedArray[i].currentValue;
        // } else {
          if (reformattedArray[i].currentValue != []) {
            if(test1[i].inputType=='日历'){
            this.inputData[i] = reformattedArray[i].currentValue.toString();
            }else{
            this.inputData[i] = reformattedArray[i].currentValue;

            }
          } else {
            this.inputData[i] = [];
          }
        // }
      }
      // console.log(this.inputData);
      this.paraList = reformattedArray;
    },
    onRest() {
      for (var item in this.inputData) {
        this.inputData[item] = [];
      }
    },
    rowClick(data, index) {
      this.menuEdit = true;
      this.TipForm = Object.assign({}, data);
    },
    selectChange(selection) {
      var paras = [];
      for (var item of selection) {
        paras.push(item.paraId);
      }
      this.paraIds = paras.join(",");
    },
    onOk() {
      this.$refs["TipForm"].validate(valid => {
        if (valid) {
          var paramEdit = {
            paraId: this.TipForm.paraId,
            promptId: this.promptId,
            paraName: this.TipForm.paraName,
            colName: this.TipForm.colName,
            paraType: this.TipForm.paraType,
            inputType: this.TipForm.inputType,
            paraValue: this.TipForm.paraValue,
            // version: this.version,
            paraSort: this.TipForm.paraSort,
            hasMoreValue: this.TipForm.hasMoreValue,
            paraOperator: this.TipForm.paraOperator,
            paraDes: this.TipForm.paraDes,
            defaultValue: this.TipForm.defaultValue,
            version: this.TipForm.version,
            paraStyle: this.TipForm.paraStyle,
            dateFormat:this.TipForm.dateFormat,
            paraSelectSql:this.TipForm.paraSelectSql
          };
          var paramAdd = {
            promptId: this.promptId,
            paraName: this.TipForm.paraName,
            colName: this.TipForm.colName,
            paraType: this.TipForm.paraType,
            inputType: this.TipForm.inputType,
            paraValue: this.TipForm.paraValue,
            // version: this.version,
            paraSort: this.TipForm.paraSort,
            hasMoreValue: this.TipForm.hasMoreValue,
            paraOperator: this.TipForm.paraOperator,
            paraDes: this.TipForm.paraDes,
            defaultValue: this.TipForm.defaultValue,
            paraStyle: this.TipForm.paraStyle,
            dateFormat:this.TipForm.dateFormat,
            paraSelectSql:this.TipForm.paraSelectSql
          };
          if (this.TipForm.paraId == "") {
            $store.dispatch("addParam", paramAdd).then(response => {
              if (response.statusCode == "0") {
                // console.log(response);
                // this.isShow = true;
                // //添加后刷新页面
                this.paramList();
                this.onRest();
                this.$refs["TipForm"].resetFields();
                this.TipForm.paraValue = "";
                this.TipForm.paraType = "";

                // //此处更新功能
                this.$Message.success({
                  content: this.$t("module.bieet.createSuccess"),
                  duration: 3
                });
                this.isOrNoteRead = false;
              } else {
                this.$Message.error({
                  content: response.msg
                });
              }
            });
          } else {
            if (this.TipForm.inputType == "文本字段") {
              paramEdit.hasMoreValue = "";
              paramEdit.paraValue = "";
            }
            $store.dispatch("modifyParam", paramEdit).then(response => {
              if (response.statusCode == "0") {
                this.paramList();
                // //此处更新功能
                this.$refs["TipForm"].resetFields();
                this.TipForm.paraValue = "";
                this.TipForm.paraType = "";
                this.onRest();
                this.$Message.success({
                  content: this.$t("module.bieet.modifySuccess"),
                  duration: 3
                });
                this.isOrNoteRead = false;
              } else {
                this.$Message.error({
                  content: response.msg
                });
              }
            });
          }
        } else {
          this.$Message.error(this.$t("module.bieet.validateFail"));
        }
      });
    },
    onCancel() {
      this.$refs["TipForm"].resetFields();
      this.TipForm.paraValue = "";
      this.TipForm.paraType = "";
    },
    onApply() {
      $store.dispatch("", this.inputData).then(res => {
        if (response.statusCode == "0") {
          this.onRest();
          // //此处更新功能
          this.$Message.success({
            content: this.$t("module.bieet.createSuccess"),
            duration: 3
          });
        } else {
          this.$Message.error({
            content: response.msg
          });
        }
      });
    },
    deleted() {
      if (this.paraIds == "") {
        this.$Message.error({
          content: "未选中任何项",
          duration: 3
        });
      } else {
        new $confirm(this.$t("module.role.warning.ensureToDelete"), this).then(
          () => {
            $store
              .dispatch("deleteParam", {
                paraIds: this.paraIds,
                promptId: this.promptId
              })
              .then(res => {
                if (res.statusCode == "-1") {
                  this.$Message.warning({
                    content: res.msg,
                    duration: 3
                  });
                  return;
                }
                this.paramList();
                this.$Message.success({
                  content: this.$t("module.bieet.deleteSuccess"),
                  duration: 3
                });
              });
          }
        );
      }
    }
  },
  watch: {},
  directives: {}
};
</script>