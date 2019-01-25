export default {

  // 未发起时请假流程信息查询
  queryLeaveInfoStart: function ({ commit }, param) {
    return new Promise((resolve) => {
      $axios.post(`/${process.env.API.pscURL}/psc/leaveforminsta/pscleaveforminsta/getLeaveFormInstPersonInfo`, param).then((response) => {
        resolve(response.data);
      })
        .catch((error) => {
          console.log(error)
          var responseData = { "dataResult": [], "extra": "", "msg": "服务异常，请联系管理员", "statusCode": "-1" };
          resolve(responseData);
        })
    })
  },

  // 已发起时请假流程信息查询
  queryLeaveInfo: function ({ commit }, param) {
    return new Promise((resolve) => {
      $axios.post(`/${process.env.API.pscURL}/psc/leaveforminsta/pscleaveforminsta2/getForm`, param).then((response) => {
        resolve(response.data);
      })
        .catch((error) => {
          console.log(error)
          var responseData = { "dataResult": [], "extra": "", "msg": "服务异常，请联系管理员", "statusCode": "-1" };
          resolve(responseData);
        })
    })
  },
  
  // 提交请假流程
  submitProcess: function ({ commit }, param) {
    return new Promise((resolve) => {
      $axios.post(`/${process.env.API.pscURL}/psc/leaveforminsta/pscleaveforminsta2/submitForm`, param).then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.log(error)
        var responseData = { "dataResult": [], "extra": "", "msg": "服务异常，请联系管理员", "statusCode": "-1" };
        resolve(responseData);
      })
    })
  },
  
  // 请假流程保存
  saveProcess: function ({ commit }, param) {
    return new Promise((resolve) => {
      $axios.post(`/${process.env.API.pscURL}/psc/leaveforminsta/pscleaveforminsta2/saveForm`, param).then((response) => {
        resolve(response.data);
      })
        .catch((error) => {
          console.log(error)
          var responseData = { "dataResult": [], "extra": "", "msg": "服务异常，请联系管理员", "statusCode": "-1" };
          resolve(responseData);
        })
    })
  },

  // 审批流程 todo
  approveProcess: function ({ commit }, param) {
    return new Promise((resolve) => {
      $axios.post(`/${process.env.API.pscURL}/psc/ems/claimBase/tcliamwf/approveflow`, param).then((response) => {
        resolve(response.data);
      })
        .catch((error) => {
          console.log(error)
          var responseData = { "dataResult": [], "extra": "", "msg": "服务异常，请联系管理员", "statusCode": "-1" };
          resolve(responseData);
        })
    })
  },

  // 驳回流程 todo
  rejectProcess: function ({ commit }, param) {
    return new Promise((resolve) => {
      $axios.post(`/${process.env.API.pscURL}/psc/ems/claimBase/tcliamwf/rejectflow`, param).then((response) => {
        resolve(response.data);
      })
        .catch((error) => {
          console.log(error)
          var responseData = { "dataResult": [], "extra": "", "msg": "服务异常，请联系管理员", "statusCode": "-1" };
          resolve(responseData);
        })
    })
  },

  // 废除（作废） todo
  deleteProcess: function ({ commit }, param) {
    return new Promise((resolve) => {
      $axios.post(`/${process.env.API.pscURL}/psc/ems/claimBase/tcliamwf/deleteflow`, param).then((response) => {
        resolve(response.data);
      })
        .catch((error) => {
          console.log(error)
          var responseData = { "dataResult": [], "extra": "", "msg": "服务异常，请联系管理员", "statusCode": "-1" };
          resolve(responseData);
        })
    })
  },

  // 申述流程 todo
  stateProcess: function ({ commit }, param) {
    return new Promise((resolve) => {
      $axios.post(`/${process.env.API.pscURL}/psc/ems/claimBase/tcliamwf/stateflow`, param).then((response) => {
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
