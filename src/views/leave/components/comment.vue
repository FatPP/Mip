<style lang="less">

</style>
<template>
  <div>
    <Card>
      <p slot="title">
        <Icon type="person"></Icon>
        处理意见及附件
      </p>
      <Form :model="formInfo" ref="formInfoForm" :label-width="100">
        <Row :gutter="5" class="code-row-bg" v-if="submitTypes.length>0">
          <Col span="24">
            <Form-item label="操作：" prop="submitType">
              <RadioGroup v-model="formInfo.submitType" @on-change="changeSubmitType">
                <Radio v-for="item in submitTypes" :label="item.value" :key="item.value">{{item.label}}</Radio>
              </RadioGroup>
            </Form-item>
          </Col>
        </Row>
        <Row :gutter="5" class="code-row-bg" v-if="formInfo.submitType=='驳回到指定节点'">
          <Col span="24">
            <Form-item label="驳回节点：" prop="rejectNode" class="ivu-form-item-required">
              <Select v-model="formInfo.rejectNode" filterable placeholder="请选择驳回到的节点">
                <Option v-for="item in rejectNodes" :value="item.value" :key="item.value">{{item.label}}</Option>
              </Select>
            </Form-item>
          </Col>
        </Row>
        <Row :gutter="5" class="code-row-bg">
          <Col span="24">
            <Form-item label="常用意见：">
              <Select placeholder="选择常用意见即可快速填写处理意见" filterable @on-change="changeComment">
                <Option value="同意">同意</Option>
                <Option value="不同意">不同意</Option>
                <Option value="中立">中立</Option>
                <Option value="不发表意见">不发表意见</Option>
              </Select>
            </Form-item>
          </Col>
        </Row>
        <Row :gutter="5" class="code-row-bg">
          <Col span="24">
            <Form-item 
              label="处理意见：" 
              prop="comment"
              :rules="{
                trigger: 'blur',
                required: true,
                validator: (rules, value, callback) => {
                  if (value==='' || value ===null) {
                    callback('请输入处理意见');
                    return;
                  }
                  if(value.length > 1500) {
                    callback('处理意见最多为1500个字符');
                    return;
                  }
                  callback();
                }
              }"
            >
              <Input v-model="formInfo.comment" type="textarea" :rows="4" :maxlength=1500 placeholder=""></Input>
            </Form-item>
          </Col>
        </Row>
        <Row :gutter="5" class="code-row-bg">
          <Col span="24">
          <Form-item label="附件：">
            <Upload
              multiple
              action="//jsonplaceholder.typicode.com/posts/">
              <Button type="ghost" icon="ios-cloud-upload-outline">点击选择文件</Button>
            </Upload>
          </Form-item>
          </Col>
        </Row>
        <Row :gutter="5" class="code-row-bg" v-if="childProps.actionType!='start'">
          <Col span="24">
            <Form-item label="当前处理人：">
              <Input disabled v-model="formInfo.currentMan"></Input>
            </Form-item>
          </Col>
        </Row>
      </Form>
    </Card>
    <Modal v-model="modal" @on-cancel="onCancel" width="60">
      <p slot="header">
        <span>选择节点</span>
      </p>
      <Table ref="searchTable" :data="tableData" :columns="tableColumns1">
      </Table>
      <div slot="footer" class="run-modal-ftbButton">
        <Button type="primary" @click="onDialogConfirm()" :loading="modalLoading">确定</Button>
      </div>
      <Spin size="large" fix v-if="modalPageLoading"></Spin>
    </Modal>
    <Modal v-model="modal2" width="60" height="300">
      <p slot="header">
        <span>选择人员</span>
      </p>
      <PageTable ref="searchTable2" :autoFirst="false" action="queryEmployee" :columns="tableColumns2" :onSelectionChange="onEmployeeSelectionChange">
        <Form :model="formSearch" ref="formSearch" slot="search-bar" label-position="top" class="ivu-form-no-margin-bottom" inline>
          <Form-item label="帐户">
            <Input type="text" style="display: none;"></Input>
            <Input type="text" v-model="formSearch.employeeOprid" @keyup.enter.native="search"></Input>
          </Form-item>
          <Form-item label="姓名">
            <Input type="text" v-model="formSearch.employeeChnName" @keyup.enter.native="search"></Input>
          </Form-item>
        </Form>
        <div slot="handle-bar">
          <Button size="small" @click="queryEmployee" type="warning" icon="search">查询</Button>
        </div>
      </PageTable>
      <div slot="footer" class="run-modal-ftbButton">
        <Button type="primary" @click="onEmployeeDialogConfirm" :loading="modalLoading">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import util from '@/tools/util.js';
export default {
  props: {
    childProps: {
      type: Object,
      default() {
        return {};
      }
    },
    server: {
      type: Object,
      default() {
        return {};
      }
    },
  },
  data() {
    var vm = this;
    return {
      modal: false,
      modal2: false,
      modalLoading: false,
      modalPageLoading: false,
      formSearch: {
        employeeOprid: '',
        employeeChnName: '',
      },
      selectEmployee: {
        tableDataIndex: -1,
        selection: [],
      },
      tableData: [],

      personName:'',

      tableColumns1: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: "当前节点",
          width: 250,
          ellipsis: true,
          render: (h, params) => {
            return h("span", {
              domProps: {
                title: params.row.actName,
                innerHTML: params.row.actName
              }
            });
          }
        },
        {
          title: "人员",
          render: (h, params) => {
            return [
              params.row.actUsers.map((item, index) => {  
                return h('Tag', {
                  props: {
                    closable: true,
                    color: 'yellow',
                  },
                  on: {
                    'on-close': () => {
                      this.deletePerson(params, index);
                    }
                  }
                }, `${item.employeeChnName}(${item.employeeOprid})`);    
              })
            ];
          }
        },
        {
          title: "操作",
          align: "center",
          fixed: "right",
          width: 40,
          render: (h, params) => {
            var data = [  
              {
                type: "icon",
                icon: "plus-round",
                text: "添加人员",
                handle: () => {
                  this.modal2 = true;
                  this.selectEmployee.tableDataIndex = params.index;
                }
              },
            ];
            return h("RowTools", {
              props: {
                data: data
              }
            });
          }
        }
      ],

      tableColumns2: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: "帐号",
          key: "employeeOprid",
          width: 120,
        },
        {
          title: "姓名",
          key: "employeeChnName",
          width: 120,
        },
        {
          title: "公司 -- 部门",
          ellipsis: true,
          render: (h, params) => {
            return h("span", {
              domProps: {
                title: params.row.employeeBusinessUnitDescr +' -- '+ params.row.employeeDeptDescr,
                innerHTML: params.row.employeeBusinessUnitDescr +' -- '+ params.row.employeeDeptDescr
              }
            });
          }
        },
      ],
      
      preSubmitResult: {},
     
      rejectNodes: [],
      rules: {
        submitType: [
          { required: true, message: "请选择操作", trigger: "change" },
        ],
        rejectNode: [
          { validator(rule, value, callback, source, options ) {
            if (value == "" && vm.formInfo.submitType == "驳回到指定节点") {
              callback(new Error("请选择驳回到的节点"));
            }
            callback();
          }}
        ],
        comment: [
          { required: true, message: "请输入处理意见", trigger: "blur" },
          { max: 1500, message: "处理意见最多为1500个字符", trigger: "blur" },
        ],
      },
      
      formInfo: {
        submitType: "",
        rejectNode: "",
        comment: "",
        currentMan: "",
      },
    };
  },
  computed: {

    submitTypes() {
      if(this.childProps.actionType == 'start') {
        return [];
      }else if(this.childProps.actionType == 'todo') {
        return [
          {label: '通过', value: '通过'},
          {label: '驳回到发起节点', value: '驳回到发起节点'},
          {label: '驳回到上一节点', value: '驳回到上一节点'},
          {label: '驳回到指定节点', value: '驳回到指定节点'},
          {label: '转办', value: '转办'},
          {label: '沟通', value: '沟通'},
          {label: '抄送', value: '抄送'},
          // {label: '加签', value: '加签'},
        ];
      }else if(this.childProps.actionType == 'done') {
        return [
          {label: '撤回', value: '撤回'},
        ];
      }
    },
  },
  created: function() {

    this.taskId = this.childProps.taskId;

    // 当是我的待办跳转，查询可驳回节点
    if(this.childProps.actionType == 'todo') {
      this.getRejectNodes();
    }

    // 当是我的待办、我的已办跳转，查询baseInfo，目的是查询回来当前处理人
    if(this.childProps.actionType != 'start') {
      this.getBaseInfo();
    }
    
    // 监听提交事件
    $channel.$on('emitFinalSubmit', (params) => {
      this.submitInfo(params);
    });
  },
  beforeMount: function() {},
  mounted: function() {},
  beforeDestroy: function() {},
  destroyed: function() {},
  methods: {

    changeComment(val) {
      this.formInfo.comment = val;
    },

    getRejectNodes() {
      this.server.getRejectNodes()
      .then((response) => {
        this.rejectNodes = response.dataResult ? response.dataResult : [];
      });
    },
    
    getBaseInfo() {
      this.server.getBaseInfo()
      .then((response) => {
        this.formInfo.currentMan = response.dataResult.peoples;
      });
    },

    changeSubmitType(val) {
      if(val != "驳回到指定节点") {
        this.formInfo.rejectNode = "";
      }
    },

    onCancel() {
      this.preSubmitResult = {};
      this.tableData = [];
    },

    deletePerson(data, persoIindex) {
      this.tableData[data.index].actUsers.splice(persoIindex, 1);
    },

    queryEmployee(page = 1) {
      this.$refs["searchTable2"].load(this.formSearch, page);
    },

    onEmployeeSelectionChange(selection) {
      this.selectEmployee.selection = selection;
    },

    _includesEmployee(actUsers, employee) {
      var includesFlag = false;
      for(var item of actUsers) {
        if(item.employeeOprid == employee.employeeOprid) {
          includesFlag = true;
          break;
        }
      }
      return includesFlag;
    },

    onEmployeeDialogConfirm() {
      if(this.selectEmployee.selection.length > 0) {
        var index = this.selectEmployee.tableDataIndex;
        var actUsers = this.tableData[index].actUsers;
        var selection = this.selectEmployee.selection;

        // 选择节点人员数量为零，直接添加
        if(actUsers && actUsers.length <= 0) {
          for(var employee of selection) {
            this.tableData[index].actUsers.push(employee);
          }
        
        // 选择节点人员数量不为领，需要过滤重复数据
        }else if(actUsers && actUsers.length > 0){
          for(var employee of selection) {
            if(!this._includesEmployee(actUsers, employee)) {
              this.tableData[index].actUsers.push(employee);
            }
          }
        }
        this.modal2 = false;
      }else {
        this.$Message.warning({
          content: `请选择人员`,
          duration: 3
        });
      }
    },

    onDialogConfirm() {
      $channel.$emit('emitSubmit');
    },

    submitInfo(params) {
      // 如果是发起流程，设置submitType为：通过
      if(this.server.baseFlowRequest.actionType == 'start') {
        this.server.baseFlowRequest.submitType = '通过';
      }

      // 待办且驳回节点有值
      if(this.formInfo.rejectNode && this.server.baseFlowRequest.actionType == 'todo') {
        Object.assign(this.server.baseFlowRequest, {procActs: {actId: this.formInfo.rejectNode}});
      }

      // 构造提交流程参数
      var obj = Object.assign({}, params, {
        baseFlowRequest: this.server.baseFlowRequest,
      });

      this.$refs['formInfoForm'].validate(valid => {
        if (valid) {
          // 显示全局页面等待效果
          $channel.$emit('submitBtnLoadingTrue');
          this.server.submitProcess(obj)
          .then(response => {
            if (response.statusCode == "0") {

              // 流程直接结束
              if(response.dataResult.status.status == 'success') {
                this.$Modal.success({
                  title: '操作成功',
                  content: '<p>流程提交成功，点击确定关闭当前页签</p>',
                  onOk() {
                    util.closeWebPage();
                  },
                });
              }
            } else {
              this.$Message.warning({
                content: response.msg,
                duration: 3
              });
            }
          })
          .done(() => {
            $channel.$emit('submitBtnLoadingFalse');
          });
        }else {
          this.$Message.warning({
            content: `表单校验不通过，请检查表单输入`,
            duration: 5
          });
        }
      });
    },

    // submitInfo(params) {
    //   // 节点人员校验
    //   var employeeValid = true;

    //   // 如果是发起流程，设置submitType为：通过
    //   if(this.childProps.actionType == 'start') {
    //     baseFlowRequest.submitType = '通过';
    //   }
      
    //   // 如果首次提交返回的结果里面有taskId、todo、done流程
    //   if((this.preSubmitResult.baseFlowRequest && this.preSubmitResult.baseFlowRequest.taskId && this.childProps.actionType == 'start') 
    //     || (this.preSubmitResult.baseFlowRequest && this.preSubmitResult.baseFlowRequest.taskId && this.childProps.actionType == 'todo') 
    //     || (this.preSubmitResult.baseFlowRequest && this.preSubmitResult.baseFlowRequest.taskId && this.childProps.actionType == 'done')) {
        
    //     if(this.childProps.actionType == 'start') {
    //       var base = this.preSubmitResult.baseFlowRequest;
    //       baseFlowRequest.taskId = base.taskId;
    //       baseFlowRequest.porcInstId = base.porcInstId;
    //       baseFlowRequest.formInstId = base.formInstId;
    //       baseFlowRequest.callBackUrl = base.callBackUrl;
    //       baseFlowRequest.actionType = 'todo';
    //     }

    //     var choices = this.preSubmitResult.choices;

    //     // 整理选择的节点信息
    //     if(choices && choices.length >0) {
          
    //       var procActs = [];
          
    //       for(var item of choices) {
            
    //         if(!employeeValid) {
    //           break;
    //         }
    //         var temp = {};
    //         temp.actId = item.actId;

    //         // 整理选择节点中人员信息
    //         var nameMap = {
    //           'id': 'id',
    //           'ldapId': 'employeeOprid',
    //           'chnName': 'employeeChnName',
    //           'engName': 'employeeEngName',
    //           'mobilePhone': 'employeeMobilePhone',
    //           'emailAddr': 'employeeEmailAddr',
    //           'deptId': 'employeeDeptId',
    //           'deptName': ' employeeDeptDescr',
    //         };
    //         if(item.actUsers && item.actUsers.length >0) {
              
    //           // 如果人员只有一个
    //           if(item.actUsers.length == 1) {
    //             var assignee = {};
    //             for(var key of Object.keys(nameMap)) {
    //               var realKey = nameMap[key];
    //               assignee[key] = item.actUsers[0][realKey];
    //             }
    //             temp.assignee = assignee;

    //           // 如果人员有多个
    //           }else if(item.actUsers.length > 1) {
    //             var candidateUser = [];
    //             for(var user of item.actUsers) {
    //               var employee = {};
    //               for(var key of Object.keys(nameMap)) {
    //                 var realKey = nameMap[key];
    //                 employee[key] = user[realKey];
    //               }
    //               candidateUser.push(employee);
    //             }
    //             temp.candidateUser = candidateUser;
    //           }
    //         }else {
    //           employeeValid = false;
    //           this.$Message.warning({
    //             content: `节点: ${item.actName} 的人员为空，请添加人员`,
    //             duration: 3
    //           });
    //           break;
    //         }
    //         procActs.push(temp);
    //       }
    //       Object.assign(baseFlowRequest, {procActs: procActs});
    //     }
    //   }

    //   if(!employeeValid) {
    //     return;
    //   }

    //   // 待办且驳回节点有值
    //   if(this.formInfo.rejectNode && this.childProps.actionType == 'todo') {
    //     Object.assign(baseFlowRequest, {procActs: {actId: this.formInfo.rejectNode}});
    //   }

    //   var obj = Object.assign({}, params, {
    //     baseFlowRequest: baseFlowRequest
    //   });

    //   this.$refs['formInfoForm'].validate(valid => {
    //     if (valid) {
    //       // 显示全局页面等待效果
    //       $channel.$emit('submitBtnLoadingTrue');
    //       this.modalLoading = true;
    //       this.modalPageLoading = true;
    //       this.$store
    //         .dispatch("otherFlowSubmit", obj)
    //         .then(response => {
    //           if (response.statusCode == "0") {

    //             // 流程直接结束
    //             if(response.dataResult.status.status == 'success') {
    //               this.$Modal.success({
    //                 title: '操作成功',
    //                 content: '<p>流程提交成功，点击确定关闭当前页签</p>',
    //                 onOk() {
    //                   util.closeWebPage();
    //                 },
    //               });
    //             }else if(response.dataResult.status.status == 'select_node') {
    //               this.modal = true;
    //               this.$nextTick(function() {
    //                 this.preSubmitResult = response.dataResult;
    //                 this.tableData = response.dataResult.choices || [];
    //                 for(var item of this.tableData) {
    //                   this.$set(item, '_checked', true);
    //                   this.$set(item, '_disabled', true);
    //                 }
    //               });
    //             }
    //           } else {
    //             this.$Message.warning({
    //               content: response.msg,
    //               duration: 3
    //             });
    //           }
    //         })
    //         .done(() => {
    //           $channel.$emit('submitBtnLoadingFalse');
    //           this.modalLoading = false;
    //           this.modalPageLoading = false;
    //         });
    //     }
    //   });
    // },
  },
  watch: {},
  directives: {}
};
</script>
