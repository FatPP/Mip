import { systemRouter } from 'ripples-core'
import {pscRouter} from 'ripples-psc'
import resolve from 'any-promise';

// systemRouter.otherRouter.children[0] ={
//   path: 'home',
//   title: '首页',
//   name: 'home_index',
//   component: resolve => { require(['./views/home/home.vue'], resolve); }
// }

systemRouter.appRouter.children = systemRouter.appRouter.children.concat([
//   {name:'home',
//    path:'/',
//    title:"首页",
//    component:resolve=>{require(['../node_modules/ripples-core/src/views/home/home.vue'])}
// },
  {
    name:'mul-manage',
    path:'mul-manage',    
    title:'综合管理',
    component: resolve => {require(['./views/zongheguanli.vue'],resolve);}
  },{
    name:'indv-fina',
    path:'indv-fina',    
    title:'个金报表专题',
    component: resolve => {require(['./views/gejinbaobiao.vue'],resolve);}
  },{
    name:'bieet',
    path:'bieet',
    title:'bieet报表',
    component:resolve=>{require(['./views/Bieet.vue'],resolve);}
  },{
    name:'BieetManage',
    path:'BieetManage',
    title:'报表树管理',
    component:resolve=>{require(['./views/BieetManage/BieetManage.vue'],resolve);}
  },{
    name:'baobiaoAccess',
    path:'baobiaoAccess',
    title:'报表权限管理',
    component:resolve=>{require(['./views/baobiaoAccess/UserList.vue'],resolve);}
  },{
    name:'baobiaoAttr',
    path:'baobiaoAttr',
    title:'报表属性',
    component:resolve=>{require(['./views/baobiaoAttr/baobiaoAttr.vue'],resolve);}
  }
  ,{
    name:"crbOrg",
    path:"crbOrg",
    title:"组织树",
    component:resolve=>{require(['./views/crbOrg/orgManage.vue'],resolve);}
  },{
    name:"orgDistribution",
    path:"orgDistribution",
    title:"组织分配",
    component:resolve=>{require(['./views/orgDistribution/orgManage.vue'],resolve);}
  }
],pscRouter)

const appRouter = systemRouter.appRouter;

const routers = systemRouter.routers.concat(appRouter)

const beforeEach = systemRouter.afterEach

const afterEach = systemRouter.afterEach;

export {
  appRouter,
  routers,
  beforeEach,
  afterEach
}