<template>
  <div>
    <Card>
      <p slot="title">
        <Icon type="person"></Icon>
        {{formInfo.title}}
      </p>
      <Form :model="formInfo" ref="formInfo" :label-width="100"> 
        <Row :gutter="5" class="code-row-bg">
          <Col span="12">
          <Form-item label="单号：">
            <Input v-model="formInfo.formNo" placeholder="" disabled></Input>
          </Form-item>
          </Col>
          <Col span="12">
          <Form-item label="申请时间：">
            <Input v-model="formInfo.createDate" placeholder="" disabled></Input>
          </Form-item>
          </Col>
        </Row>
        <Row :gutter="5" class="code-row-bg">
          <Col span="12">
          <Form-item label="申请人：">
            <Input v-model="formInfo.createByName" placeholder="" disabled></Input>
          </Form-item>
          </Col>
          <Col span="12">
          <Form-item label="所在部门：">
            <Input v-model="formInfo.createUserDeptName" placeholder="" disabled></Input>
          </Form-item>
          </Col>
        </Row>
        <Row :gutter="5" class="code-row-bg">
          <Col span="24">
          <Form-item 
            label="请假事由：" 
            prop="leavereason"
            :rules="{
              trigger: 'blur',
              required: true,
              validator: (rules, value, callback) => {
                if (value==='' || value ===null) {
                  callback('请输入请假事由');
                  return;
                }
                callback();
              }
            }"
          >
            <Input 
              v-model="formInfo.leavereason" 
              type="textarea" 
              :rows="4" 
              :maxlength=1500 
              placeholder="" 
              :disabled="actionType!='start'"              
            >
            </Input>
          </Form-item>
          </Col>
        </Row>
        <Row :gutter="5" class="code-row-bg">
          <Col span="24">
          <Form-item label="请假详情：" class="ivu-form-item-required">
            <Table :row-class-name="setTableRowClass" ref="detailTable" stripe :columns="tableColumns" :data="formInfo.leaveDetail"></Table>
          </Form-item>
          </Col>
        </Row>
        <Row :gutter="5" class="code-row-bg" v-if="actionType=='start'">
          <Col span="24">
          <div style="text-align: center">
            <Button type="primary" shape="circle" icon="plus-round" @click="addDetail">添加请假详情</Button>
          </div>
          </Col>
        </Row>
      </Form>
    </Card>
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
    return {
      server: {},
      tableValid: true,
      startTimes: [
        {lable: '09:00', value: '09:00'},
        {lable: '13:00', value: '13:00'},
      ],
      endTimes: [
        {lable: '12:00', value: '12:00'},
        {lable: '17:30', value: '17:30'},
      ],
      leaveTypes: [
        {lable: '年假', value: '年假'},
        {lable: '病假', value: '病假'},
        {lable: '事假', value: '事假'},
        {lable: '产假', value: '产假'},
        {lable: '陪产假', value: '陪产假'},
        {lable: '调休假', value: '调休假'},
        {lable: '其它假', value: '其它假'},
      ],
      formInfo: {
        title: '',
        formNo: "",
        createByName: "",
        createDate: "",
        createUserDeptName: "",
        leavereason: "",
        leaveDetail: [
          {
            leaveType: '',
            leaveYear: new Date().Format('yyyy'),
            startDate: '',
            startTime: '09:00',
            endDate: '',
            endTime: '12:00',
            dayNum: 0,
            showValiMsg: false,
          }
        ],
      },
      singleLeave: {
        leaveType: '',
        leaveYear: new Date().Format('yyyy'),
        startDate: '',
        startTime: '09:00',
        endDate: '',
        endTime: '12:00',
        dayNum: 0,
      },
      baseTableColumns: [
        {
          type: 'index',
          width: 60,
          align: 'center',
        },
        {
          title: "请假类型",
          key: "leaveType",
          className: 'vali-column',
          ellipsis: true,
          width: 160,
          render: (h, params) => {
            if(this.actionType == 'start') {
              return h('Form-item',
                {
                  props: {
                    prop: `leaveDetail[${params.index}].leaveType`,
                    rules: {
                      trigger: 'blur, change',
                      required: true,
                      validator: (rules, value, callback) => {
                        if (value==='') {
                          callback('请选择请假类型');
                          this.setTableTdCss(params.index, value);
                          return;
                        }
                        callback();
                        this.setTableTdCss(params.index, value);
                      }
                    }
                  }
                },
                [
                  h('Select', {
                    props: {
                      filterable: true,
                      clearable: true,
                      value: this.formInfo.leaveDetail[params.index].leaveType
                    },  
                    on: {
                      'on-change':(value) => {
                        this.formInfo.leaveDetail[params.index].leaveType = value;
                      }
                    }           
                  }, this.leaveTypes.map((item, index) => {
                    return h('Option', {
                      props: {
                        value: item.value,
                        lable: item.lable,
                      }
                    });    
                  }))
                ]
              );
            }else {
              return h('span', params.row.leaveType);
            }
          }
        },
        {
          title: "假期所属年份",
          width: 160,
          render: (h, params) => {
            if(this.actionType == 'start') {
              return h('Select', {
                props: {
                  class: 'text-bottom',
                  value: this.formInfo.leaveDetail[params.index].leaveYear
                },  
                on: {
                  'on-change':(value) => {
                    this.formInfo.leaveDetail[params.index].leaveYear = value;
                  }
                }                    
              }, this.leaveYears.map((item, index) => {
                return h('Option', {
                  props: {
                    value: item.value,
                    lable: item.lable,
                  }
                });    
              }));
            }else {
              return h('span', params.row.leaveYear);
            }
          }
        },
        {
          title: "开始日期",
          width: 140,
          className: 'vali-column',
          render: (h, params) => {
            if(this.actionType == 'start') {
              return h('Form-item',
                {
                  props: {
                    prop: `leaveDetail[${params.index}].startDate`,
                    rules: {
                      trigger: 'blur, change',
                      required: true,
                      validator: (rules, value, callback) => {
                        if (value==='') {
                          this.setTableTdCss(params.index, value);
                          callback('请选择开始日期');
                          return;
                        }
                        callback();
                        this.setTableTdCss(params.index, value);
                      }
                    }
                  }
                },
                [
                  h('DatePicker', {
                    props: {
                      type: 'date',
                      value: this.formInfo.leaveDetail[params.index].startDate,
                    }, 
                    style: 'margin-right: 10px; width: 120px;',
                    on: {
                      'on-change': (value) => {
                        this.formInfo.leaveDetail[params.index].startDate = value;
                        this.calculateDays(this.formInfo.leaveDetail[params.index]);
                      },
                    }             
                  })
                ]
              );
            }else {
              return [
                h('span', {style: 'margin-right: 10px; width: 120px;'}, params.row.startDate),
                h('span', params.row.startTime),
              ];
            }
          }
        },
        {
          title: "开始时间",
          width: 100,
          className: 'vali-column',
          render: (h, params) => {
            if(this.actionType == 'start') {
              return h('Select', {
                props: {
                  value: this.formInfo.leaveDetail[params.index].startTime,
                }, 
                style: 'width: 80px;',    
                on: {
                  'on-change': (value) => {
                    this.formInfo.leaveDetail[params.index].startTime = value;
                    this.calculateDays(this.formInfo.leaveDetail[params.index]);
                  },
                }              
              }, this.startTimes.map((item, index) => {
                return h('Option', {
                  props: {
                    value: item.value,
                    lable: item.lable,
                  }
                });    
              }));
            }else {
              return [
                h('span', {style: 'margin-right: 10px; width: 120px;'}, params.row.startDate),
                h('span', params.row.startTime),
              ];
            }
            
          }
        },
        {
          title: "结束日期",
          width: 140,
          className: 'vali-column',
          render: (h, params) => {
            if(this.actionType == 'start') {
              return h('Form-item',
                {
                  props: {
                    prop: `leaveDetail[${params.index}].endDate`,
                    rules: {
                      trigger: 'blur, change',
                      required: true,
                      validator: (rules, value, callback) => {
                        if (value==='') {
                          this.setTableTdCss(params.index, value);
                          callback('请选择开始日期');
                          return;
                        }
                        callback();
                        this.setTableTdCss(params.index, value);
                      }
                    }
                  }
                },
                [
                  h('DatePicker', {
                    props: {
                      type: 'date',
                      value: this.formInfo.leaveDetail[params.index].endDate,
                    }, 
                    style: 'margin-right: 10px; width: 120px;',
                    on: {
                      'on-change': (value) => {
                        this.formInfo.leaveDetail[params.index].endDate = value;
                        this.calculateDays(this.formInfo.leaveDetail[params.index]);
                      },
                    }             
                  })
                ]
              );
            }else {
              return [
                h('span', {style: 'margin-right: 10px; width: 120px;'}, params.row.endDate),
                h('span', params.row.endTime),
              ];
            }
          }
        },
        {
          title: "结束时间",
          width: 100,
          render: (h, params) => {
            if(this.actionType == 'start') {
              return h('Select', {
                props: {
                  value: this.formInfo.leaveDetail[params.index].endTime,
                }, 
                style: 'width: 80px;',   
                on: {
                  'on-change': (value) => {
                    this.formInfo.leaveDetail[params.index].endTime = value;
                    this.calculateDays(this.formInfo.leaveDetail[params.index]);
                  },
                }               
              }, this.endTimes.map((item, index) => {
                return h('Option', {
                  props: {
                    value: item.value,
                    lable: item.lable,
                  }
                });    
              }))
            }else {
              return [
                h('span', {style: 'margin-right: 10px; width: 120px;'}, params.row.endDate),
                h('span', params.row.endTime),
              ];
            }
          }
        },
        {
          title: "天数",
          key: "dayNum",
        },
      ],
    };
  },
  computed: {
    leaveYears() {
      var currentYear = new Date().Format('yyyy');
      return [
        {lable: currentYear, value: currentYear},
        {lable: +(currentYear)-1, value: +(currentYear)-1},
      ];
    },
    actionType() {
      return this.childProps.actionType;
    },
    tableColumns() {
      if(this.actionType == 'start') {
        return [
          ...this.baseTableColumns, 
          {
            title: "操作",
            align: "center",
            fixed: "right",
            width: 80,
            render: (h, params) => {
              if(params.index > 0) {
                var data = [  
                  {
                    type: "icon",
                    icon: "trash-a",
                    text: "删除",
                    handle: () => {
                      this.deleteDetail(params.index);
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
          }
        ]
      }else {
        return this.baseTableColumns;
      }
    },
  },
  created: function() {
    
    // 发起流程--查询请假流程信息
    if(this.childProps.actionType == 'start') {
      this.queryLeaveInfoStart();
    
    // 已经发起流程后--查询请假流程信息
    }else {
      this.queryLeaveInfo();
    }

    // 监听提交事件
    $channel.$on('emitSubmit', (params) => {
      this.submitInfo();
    });
  },
  beforeMount: function() {},
  mounted: function() {

  },
  beforeDestroy: function() {},
  destroyed: function() {},
  methods: {

    // 给table行加上统一样式
    setTableRowClass(row, index) {
      return 'tip-row';
    },

    // 设置td样式
    setTableTdCss(index, value) {
      var commomRow = document.querySelectorAll('.tip-row')[index];
      var fixedRow = document.querySelector('.ivu-table-fixed-body').querySelectorAll('.tip-row')[index];
      setTimeout(() => {
        if(commomRow.querySelector('.ivu-form-item-error-tip')) {
          for(var item of commomRow.querySelectorAll('td')) {
            item.style.padding = '10px 0 25px 0';
          }
          for(var item of fixedRow.querySelectorAll('td')) {
            item.style.padding = '10px 0 25px 0';
          }
          
        }else {
          for(var item of commomRow.querySelectorAll('td')) {
            item.style.padding = '10px 0 10px 0';
          }
          for(var item of fixedRow.querySelectorAll('td')) {
            item.style.padding = '10px 0 10px 0';
          }
        }
      }, 100);
    },

    // 计算请假天数
    calculateDays(data) {
      var {startDate, startTime, endDate, endTime} = data;
      if(startDate && startTime && endDate && endTime) {
        var hourDay = 0;
        if(startTime == '09:00' && endTime == '17:30') {
          hourDay = 1;
        }else if((startTime == '09:00' && endTime == '12:00') || (startTime == '13:00' && endTime == '17:30')) {
          hourDay = 0.5;
        }
        data.dayNum = util.getDaysDiff(new Date(startDate), new Date(endDate)) + hourDay;
      }else {
        data.dayNum = 0;
      }
    },

    addDetail() { 

      // 使用Object.assign防止添加的对象都是同一个引用对象
      this.formInfo.leaveDetail.push(Object.assign({}, this.singleLeave));
    },

    deleteDetail(index) {
      this.formInfo.leaveDetail.splice(index, 1);
    },

    queryLeaveInfoStart() {
      this.server.queryLeaveInfoStart().then(response => {
        if (response.statusCode == "0") {
          util.copyPros(this.formInfo, response.dataResult, ['leaveDetail']);
        }
        this.formInfo.title = response.dataResult.title;
        $channel.$emit('pageLoadingFalse');
      });
    },

    leaveInfoQuery() {
      this.server.leaveInfoQuery().then(response => {
        if (response.statusCode == "0") {

          // 请假基本信息
          util.copyPros(this.formInfo, response.dataResult);

          // 请假组件title
          this.formInfo.title = response.dataResult.title;

          // 组装请假详情
          this.formInfo.leaveDetail = [];
          for(var item of response.dataResult.leaveDetailed) {
            var temp = Object.assign({}, this.singleLeave);
            for(var key of Object.keys(temp)) {
              if(key == 'startDate' || key == 'startTime') {
                temp.startDate = item.startDate.split(' ')[0];
                temp.startTime = item.startDate.split(' ')[1].substr(0, 5);
              }else if(key == 'endDate' || key== 'endTime') {
                temp.endDate = item.endDate.split(' ')[0];
                temp.endTime = item.endDate.split(' ')[1].substr(0, 5);
              }else {
                temp[key] = item[key];
              }
            }
            this.formInfo.leaveDetail.push(temp);
          }
          $channel.$emit('pageLoadingFalse');
        }
      });
    },

    // 提交业务表单
    submitInfo() {
      this.$refs['formInfo'].validate(valid => {
        if (valid) {
          // 校验请假详情
          var detailValid = true;
          for(var index =0;index<this.formInfo.leaveDetail.length;index++) {
            if(this.formInfo.leaveDetail[index]['dayNum'] <= 0) {
              this.$Message.warning({
                content: `请假详情第 ${index+1} 条数据的请假天数不正确`,
                duration: 5
              });
              detailValid = false;
              break;
            }
          }

          if(!detailValid) return;

          // 拼装请假详情
          var tempArr = [];
          for(var index =0;index<this.formInfo.leaveDetail.length;index++) {
            var nameArray = ['leaveType', 'leaveYear', 'startDate', 'endDate', 'dayNum'];
            var tempObj = {};
            for(var name of nameArray) {
              if(name == 'startDate') {
                tempObj[name] = `${this.formInfo.leaveDetail[index][name]} ${this.formInfo.leaveDetail[index]['startTime']}:00`;
              }else if(name == 'endDate') {
                tempObj[name] = `${this.formInfo.leaveDetail[index][name]} ${this.formInfo.leaveDetail[index]['endTime']}:00`;
              }else {
                tempObj[name] = this.formInfo.leaveDetail[index][name];
              }
            }
            tempArr.push(tempObj);
          }
          // $channel.$emit('emitFinalSubmit', this.packageBusinessParams({
          //   title: this.formInfo.title,
          //   formNo: this.formInfo.formNo,
          //   leavereason: this.formInfo.leavereason,
          //   leaveDetailed: tempArr,
          // }));

          $channel.$emit('emitFinalSubmit', {
            title: '',
            formInstance: {
              formNo: this.formInfo.formNo,
              leavereason: this.formInfo.leavereason,
              leaveDetailed: tempArr,
            },
          });
        }else {
          this.$Message.warning({
            content: `表单校验不通过，请检查表单输入`,
            duration: 5
          });
        }
      });
    },
  },
  watch: {},
  directives: {}
};
</script>
<style lang="less">
  .vali-column .ivu-form-item-error-tip {
    position: absolute !important;
  }
  .ivu-table-body, .ivu-table, .vali-column .ivu-table-cell {
    overflow: visible;
  }
</style>