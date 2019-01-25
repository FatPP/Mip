import qs from 'qs';
export default class ProcessUtil {

  /**
   * 构造方法
   * 
   * @param {*} params 
   */
  constructor(params={}) {
    this.formProcNo = params.formProcNo || '';
    this.formUrl = params.formUrl || '';
    // 提交流程基础数据，做流程提交时候需要该参数
    this.baseFlowRequest = {
      title: '',
      actionType: 'start',
      formId: '',
      formInstId: '',
      formInstanceId: '',
      formsetId: '',
      processInstanceId: '',
      procDefKey: '',
      procDefId: '',
      actId: '',
      comment: '',
  
      // 附件ID
      fileIds: '',
  
      // 先为空，后续根据提交窗口选择的操作类类型
      submitType: '',
  
      // 在流程发起的时候为空，待办、已办不为空
      taskId: '',
    };
    this._setProcessParams(params);

    // 首次提交流程结果
    this.preSubmitResult = {};
    this.entry = params.entry || '';

    // 设置crctoken
    if(params.crctoken) {
      $axios.defaults.headers.crctoken = params.crctoken;
      sessionStorage.crctoken = params.crctoken;
    }

    // if(this.formProcNo && this.actionType == 'start') {
    //   this.queryProcessParams(this.formProcNo);
    // }
  }

  /**
    * 
    * 触发发起流程页面跳转
    * 
    */
   startProcess(formProcNo, additionalParams = {}) {
    this._triggerProcess(Object.assign(additionalParams, {formProcNo, actionType: 'start'}));
  }

  /**
    * 
    * 触发待办流程页面跳转
    * 
    */
   todoProcess(formProcNo, additionalParams = {}) {
    this._triggerProcess(Object.assign(additionalParams, {formProcNo, actionType: 'todo'}));
  }

  /**
    * 
    * 触发草稿流程页面跳转
    * 
    */
  draftProcess(formProcNo, additionalParams = {}) {
    this._triggerProcess(Object.assign(additionalParams, {formProcNo, actionType: 'draft'}));
  }

  /**
    * 
    * 触发已办流程页面跳转
    * 
    */
  doneProcess(formProcNo, additionalParams = {}) {
    this._triggerProcess(Object.assign(additionalParams, {formProcNo, actionType: 'done'}));
  }

  _triggerProcess(params) {
    var {formProcNo} = params;
    if (!formProcNo) {
      $app.$Message.warning({
        content: '请提供流程发起编码',
        duration: 3
      });
      return;
    }
    return this.queryProcessParams(formProcNo)
    .then((response) => {
      if (response.statusCode == '0') {
        var origin = location.origin ? location.origin : location.href.split('/#')[0];
        var dataResult = response.dataResult;
        for(var key of Object.keys(dataResult)) {
          if(key != 'formUrl') {
            params[key] = dataResult[key];
          }
        }
        if(params.singlePage == 'YES') {
          window.open(
            `${origin}/#/?pageName=${dataResult.formUrl}&${qs.stringify(params)}&crctoken=${sessionStorage.crctoken}`
          );
        }else {
          window.open(
            `${origin}/${dataResult.formUrl}?${qs.stringify(params)}&crctoken=${sessionStorage.crctoken}`
          );
        }
      }
    });
  }

  // 通过流程发起编码查询其他工作流参数
  queryProcessParams(formProcNo) {
    return $store.dispatch("queryProcessParams", { formProcNo })
    .then((res) => {
      var data = res.dataResult;
      if(!data) {
        return;
      }
      this._setProcessParams(data);
      return res;
    });
  }

  _setProcessParams(data) {
    for(var key of Object.keys(data)) {
      if(key.toUpperCase() == 'PROCDEFID') {
        this.baseFlowRequest['procDefId'] = data[key];
      }else if(key.toUpperCase() == 'PROCDEFKEY') {
        this.baseFlowRequest['procDefKey'] = data[key];
      }else if(key.toUpperCase() == 'FORMPROCNO') {
        this.formProcNo = data[key];
      }else if(key.toUpperCase() == 'FORMURL') {
        this.formUrl = data[key];
      }else if(key.toUpperCase() == 'FORMSETID') {
        this.baseFlowRequest['formsetId'] = data[key];
      }else if(key.toUpperCase() == 'PROCINSTID') {
        this.baseFlowRequest['processInstanceId'] = data[key];
      }else {
        // 只赋值 baseFlowRequest 定义的参数
        this.baseFlowRequest[key] !== undefined && (this.baseFlowRequest[key] = data[key]);
      }
    }
  }

  // 业务接口--查询是否拥有发起权限
  queryFormSetStartPower() {
    return $store.dispatch("queryStartProcessPower", { id: this.baseFlowRequest.formsetId });
  }

  // 业务接口--查询是否拥有待办权限
  queryFormSetTodoPower(taskId) {
    return $store.dispatch("queryTodoProcessPower", { id: this.baseFlowRequest.taskId });
  }

  // 业务接口--查询是否拥有已办权限
  queryFormSetDonePower(taskId) {
    return $store.dispatch("queryDoneProcessPower", { id: this.baseFlowRequest.taskId });
  }

  // 业务接口--查询可驳回节点
  queryRejectNodes() {
    return $store.dispatch("queryRejectNodes", { 
      actId: this.baseFlowRequest.actId,
      procInstId: this.baseFlowRequest.processInstanceId,
    });
  }

  // 业务接口--查询业务表单vue组件相对路径
  queryProcessVueUrl(formId) {
    return $store.dispatch("queryProcessVueUrl", { id: formId });
  }

  // 业务接口--查询是否拥有撤回权限
  queryWithDrawPower(params) {
    var processInstanceId = this.baseFlowRequest.processInstanceId;
    var taskId = this.baseFlowRequest.taskId;
    var actionType = this.baseFlowRequest.actionType;
    var startUserCode = params.startUserCode;
    var currentNode = params.currentNode;
    if(processInstanceId && taskId && actionType && startUserCode && currentNode) {
      return $store.dispatch("queryWithDrawPower", {
        processInstanceId: this.baseFlowRequest.processInstanceId,
        taskId: this.baseFlowRequest.taskId,
        actionType: this.baseFlowRequest.actionType,
        startUserCode: params.startUserCode,
        currentNode: params.currentNode,
      });
    }else {
      // 查询条件不足时，直接返回false - 没有撤回权限
      return new Promise((resolve) => {
        var responseData = { "dataResult": false, "msg": "", "statusCode": "0" };
        resolve(responseData);
      })
    }
  }

  // 业务接口--撤回
  transferProcessManager(params) {
    return $store.dispatch("transferProcessManager", params);
  }

  

  // 业务接口--查询流程图URL
  queryProcessPictureUrl() {
    return $store.dispatch("queryProcessPictureUrl", { 
      processDefinitionId: this.baseFlowRequest.procDefId,
      processInstanceId: this.baseFlowRequest.processInstanceId,
    });
  }

  // 业务接口--查询审批记录
  queryProcessOperateLog() {
    return $store.dispatch("queryProcessOperateLog", { 
      processInstanceId: this.baseFlowRequest.processInstanceId,
    });
  }

  // 业务接口--查询baseInfo，包含当前处理人等信息
  queryProcessBaseInfo() {
    return $store.dispatch("queryProcessBaseInfo", { 
      id: this.baseFlowRequest.taskId,
    });
  }

  // 业务接口--查询员工信息
  queryEmployeeInfo() {
    return $store.dispatch("queryEmployeeInfo", { 
      id: this.baseFlowRequest.taskId,
    });
  }

  

  // 业务接口--提交流程
  // 有两种情况：1.提交后接口返回要求选择节点 2.直接提交成功
  submitInfo(params) {

    // 如果是发起流程，设置submitType为：通过
    if(this.baseFlowRequest.actionType == 'start') {
      this.baseFlowRequest.submitType = '通过';
    }

    // 如果有最后校验函数，执行
    if(typeof params.finalValidate == 'function' && !params.finalValidate(params, this.baseFlowRequest)) return;

    // 待办且驳回节点有值
    if(params.rejectNode && params.actionType == 'todo') {
      Object.assign(this.baseFlowRequest, {procActs: [{actId: params.rejectNode}]});
      this.baseFlowRequest.toAct
    }

    var obj = Object.assign({}, params, {
      baseFlowRequest: this.baseFlowRequest
    });

    return $store.dispatch("PaymentApplySubmit", obj);
  }

  // 选择节点后提交流程
  // 有两种情况：1.提交后接口返回要求选择节点 2.直接提交成功
  secondSubmitInfo(params) {

    // 节点人员校验
    var employeeValid = true;

    // 设置流程参数
    for(var key of Object.keys(this.baseFlowRequest)) {
      this.baseFlowRequest[key] = params[key];
    }

    // 如果首次提交返回的结果里面有taskId、todo、done流程
    if((this.preSubmitResult.baseFlowRequest && this.preSubmitResult.baseFlowRequest.taskId && this.childProps.actionType == 'start') 
      || (this.preSubmitResult.baseFlowRequest && this.preSubmitResult.baseFlowRequest.taskId && this.childProps.actionType == 'todo') 
      || (this.preSubmitResult.baseFlowRequest && this.preSubmitResult.baseFlowRequest.taskId && this.childProps.actionType == 'done')) {
      
      if(params.actionType == 'start') {
        var base = this.preSubmitResult.baseFlowRequest;
        this.baseFlowRequest.taskId = base.taskId;
        this.baseFlowRequest.processInstanceId = base.processInstanceId;
        this.baseFlowRequest.formInstId = base.formInstId;
        this.baseFlowRequest.callBackUrl = base.callBackUrl;
        this.baseFlowRequest.actionType = 'todo';
      }

      var choices = this.preSubmitResult.choices;

      // 整理选择的节点信息
      if(choices && choices.length >0) {
        
        var procActs = [];
        
        for(var item of choices) {
          
          if(!employeeValid) {
            break;
          }
          var temp = {};
          temp.actId = item.actId;

          // 整理选择节点中人员信息
          var nameMap = {
            'id': 'id',
            'ldapId': 'employeeOprid',
            'chnName': 'employeeChnName',
            'engName': 'employeeEngName',
            'mobilePhone': 'employeeMobilePhone',
            'emailAddr': 'employeeEmailAddr',
            'deptId': 'employeeDeptId',
            'deptName': ' employeeDeptDescr',
          };
          if(item.actUsers && item.actUsers.length >0) {
            
            // 如果人员只有一个
            if(item.actUsers.length == 1) {
              var assignee = {};
              for(var key of Object.keys(nameMap)) {
                var realKey = nameMap[key];
                assignee[key] = item.actUsers[0][realKey];
              }
              temp.assignee = assignee;

            // 如果人员有多个
            }else if(item.actUsers.length > 1) {
              var candidateUser = [];
              for(var user of item.actUsers) {
                var employee = {};
                for(var key of Object.keys(nameMap)) {
                  var realKey = nameMap[key];
                  employee[key] = user[realKey];
                }
                candidateUser.push(employee);
              }
              temp.candidateUser = candidateUser;
            }
          }else {
            employeeValid = false;
            $app.$Message.warning({
              content: `节点: ${item.actName} 的人员为空，请添加人员`,
              duration: 3
            });
            break;
          }
          procActs.push(temp);
        }
        Object.assign(baseFlowRequest, {procActs: procActs});
      }
    }

    if(!employeeValid) {
      return;
    }

    // 待办且驳回节点有值
    if(params.rejectNode && params.actionType == 'todo') {
      Object.assign(baseFlowRequest, {procActs: {actId: params.rejectNode}});
    }

    var obj = Object.assign({}, params, {
      baseFlowRequest: baseFlowRequest
    });

    return $store.dispatch("PaymentApplySubmit", obj);
  }
};
