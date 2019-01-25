import ProcessUtil from '@/tools/process-util.js';
export default class Server extends ProcessUtil {

  constructor(params) {
    super(params);
  }

  // 发起流程--查询请假流程信息
  queryLeaveInfoStart() {
    return $store.dispatch("queryLeaveInfoStart", {});    
  }

  // 已经发起流程后--查询请假流程信息 todo...
  queryLeaveInfo() {
    return $store.dispatch("queryLeaveInfo", {id: this.flowParams.formInstId});    
  }

  // 业务接口--提交流程
  submitProcess(params) {
    return $store.dispatch("submitProcess", params);
  }

  // 业务接口--二次提交流程
  secondSubmitProcess(params) {
    return $store.dispatch("secondSubmitProcess", params);
  }

  // 业务接口--保存流程
  saveProcessDraft(params) {
    return $store.dispatch("saveProcessDraft", params);
  }

  // 业务接口--审批流程
  approveProcess(params) {
    return $store.dispatch("approveProcess", params);
  }

  // 业务接口--驳回流程
  rejectProcess(params) {
    return $store.dispatch("rejectProcess", params);
  }

  // 业务接口--撤回流程
  withdrawProcess(params) {
    return $store.dispatch("withdrawProcess", params);
  }
}