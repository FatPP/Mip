export default {

  // 查询是否拥有表单集发起权限
  queryStartProcessPower: function ({ commit }, param) {
    return new Promise((resolve) => {
      $axios.post(`/${process.env.API.pscURL}/psc/form/pscFormSet/hasFormsetPrivilege`, param).then((response) => {
        resolve(response.data);
      })
        .catch((error) => {
          console.log(error)
          var responseData = { "dataResult": [], "extra": "", "msg": "服务异常，请联系管理员", "statusCode": "-1" };
          resolve(responseData);
        })
    })
  },

  // 查询是否拥有表单集待办权限
  queryTodoProcessPower: function ({ commit }, param) {
    return new Promise((resolve) => {
      $axios.post(`/${process.env.API.pscURL}/psc/task/hasTodoPrivilege`, param).then((response) => {
        resolve(response.data);
      })
        .catch((error) => {
          console.log(error)
          var responseData = { "dataResult": [], "extra": "", "msg": "服务异常，请联系管理员", "statusCode": "-1" };
          resolve(responseData);
        })
    })
  },

  // 查询是否拥有表单集已办权限
  queryDoneProcessPower: function ({ commit }, param) {
    return new Promise((resolve) => {
      $axios.post(`/${process.env.API.pscURL}/psc/task/hasHistoricPrivilege`, param).then((response) => {
        resolve(response.data);
      })
        .catch((error) => {
          console.log(error)
          var responseData = { "dataResult": [], "extra": "", "msg": "服务异常，请联系管理员", "statusCode": "-1" };
          resolve(responseData);
        })
    })
  },

  // 查询可驳回节点
  queryRejectNodes: function ({ commit }, param) {
    return new Promise((resolve) => {
      $axios.post(`/${process.env.API.pscURL}/psc/act/pscActConfig/getHiActinst/${param.procInstId}/${param.actId}`).then((response) => {
        resolve(response.data);
      })
        .catch((error) => {
          console.log(error)
          var responseData = { "dataResult": [], "extra": "", "msg": "服务异常，请联系管理员", "statusCode": "-1" };
          resolve(responseData);
        })
    })
  },

  // vue组件相对路径查询
  queryProcessVueUrl: function ({ commit }, param) {
    return new Promise((resolve) => {
      $axios.post(`/${process.env.API.pscURL}/psc/form/pscForm/get`, param).then((response) => {
        resolve(response.data);
      })
        .catch((error) => {
          console.log(error)
          var responseData = { "dataResult": [], "extra": "", "msg": "服务异常，请联系管理员", "statusCode": "-1" };
          resolve(responseData);
        })
    })
  }, 
  
  // 查询是否可以撤回
  queryWithDrawPower: function ({ commit }, param) {
    return new Promise((resolve) => {
      $axios.post(`/${process.env.API.pscURL}/psc/runtime/isCanWithdraw/${param.procInstId}/${param.taskId}/${param.actionType}/${param.startUserCode}/${param.currentNodeName}`).then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.log(error)
        var responseData = { "dataResult": [], "extra": "", "msg": "服务异常，请联系管理员", "statusCode": "-1" };
        resolve(responseData);
      })
    })
  },
  
  // 流程图URL查询
  queryProcessPictureUrl: function ({ commit }, param) {
    return new Promise((resolve) => {
      $axios.post(`/${process.env.API.pscURL}/psc/task/getDiagramUrl`, param).then((response) => {
        resolve(response.data);
      })
        .catch((error) => {
          console.log(error)
          var responseData = { "dataResult": [], "extra": "", "msg": "服务异常，请联系管理员", "statusCode": "-1" };
          resolve(responseData);
        })
    })
  },

  // 流程审批日志查询
  queryProcessOperateLog: function ({ commit }, param) {
    return new Promise((resolve) => {
      $axios.post(`/${process.env.API.pscURL}/psc/task/histoicFlow/${param.processInstanceId}`).then((response) => {
        resolve(response.data);
      })
        .catch((error) => {
          console.log(error)
          var responseData = { "dataResult": [], "extra": "", "msg": "服务异常，请联系管理员", "statusCode": "-1" };
          resolve(responseData);
        })
    })
  },

  // 流程BaseInfo查询
  queryProcessBaseInfo: function ({ commit }, param) {
    return new Promise((resolve) => {
      $axios.post(`/${process.env.API.pscURL}/psc/task/getTaskInfoById `, param).then((response) => {
        resolve(response.data);
      })
        .catch((error) => {
          console.log(error)
          var responseData = { "dataResult": [], "extra": "", "msg": "服务异常，请联系管理员", "statusCode": "-1" };
          resolve(responseData);
        })
    })
  },

  // 查询员工信息
  queryEmployeeInfo: function ({ commit }, param) {
    return new Promise((resolve) => {
      $axios.post(`/${process.env.API.pscURL}/psc/employee/list`, param).then((response) => {
        resolve(response.data.dataResult);
      })
        .catch((error) => {
          console.log(error)
          var responseData = { "dataResult": [], "extra": "", "msg": "服务异常，请联系管理员", "statusCode": "-1" };
          resolve(responseData);
        })
    })
  },

  // 流程功能所需参数查询
  queryProcessParams: function ({ commit }, param) {
    return new Promise((resolve) => {
      debugger;
      $axios.post(`/${process.env.API.pscURL}/psc/formproc/pscFormProc/selectFlowParam/${param.formProcNo}`).then((response) => {
        resolve(response.data);
      })
        .catch((error) => {
          console.log(error)
          var responseData = { "dataResult": [], "extra": "", "msg": "服务异常，请联系管理员", "statusCode": "-1" };
          resolve(responseData);
        })
    })
  },
}
