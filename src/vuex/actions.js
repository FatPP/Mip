import axios from 'axios'
export default {
    //报表树数据接口
    GetTrees:function({commit},param){
        return new Promise((resolve)=>{
            $axios.post(`${process.env.API.baseURL}/getTrees`,param).then((response)=>{
                resolve(response.data);
            })
        })
    },
    GetTreesId:function({commit},param){
        return new Promise((resolve)=>{
            $axios.post(`${process.env.API.baseURL}/crb/biee/menu/findMenuBycurrentId`,param).then((response)=>{
                resolve(response.data);
            })
        })
    },
    //userId,menuIds
    UpdateAccess:function({commit},param){
        return new Promise((resolve)=>{
            $axios.post(`${process.env.API.baseURL}/crb/biee/permission/modifyPermission`,param).then((response)=>{
                resolve(response.data);
            })
        })
    },
    //
   AddBieeMenu:function({commit},param){
        return new Promise((resolve)=>{
            $axios.post(`${process.env.API.baseURL}/crb/biee/menu/addBieeMenu`,param).then((response)=>{
                resolve(response.data);
            })
        })
    },
    GetBieeMenuDetail:function({commit},param){
        return new Promise((resolve)=>{
            $axios.post(`${process.env.API.baseURL}/crb/biee/menu/getBieeMenuDetail`,param).then((response)=>{
                resolve(response.data);
            })
        })
    },
    UpdateBieeMenu:function({commit},param){
        return new Promise((resolve)=>{
            $axios.post(`${process.env.API.baseURL}/crb/biee/menu/updateBieeMenu`,param).then((response)=>{
                resolve(response.data);
            })
        })
    },
    DeleteBieeMenu:function({commit},param){
        return new Promise((resolve)=>{
            $axios.post(`${process.env.API.baseURL}/crb/biee/menu/deleteBieeMenu`,param).then((response)=>{
                resolve(response.data);
            })
        })
    },
    MenuList:function({commit},param){
        return new Promise((resolve)=>{
            $axios.post(`${process.env.API.baseURL}/crb/biee/menu/menuList`,param).then((response)=>{
                resolve(response.data);
            })
        })
    },
    //所有提示器
    promptList:function({commit},param){
        return new Promise((resolve)=>{
            $axios.post(`${process.env.API.baseURL}/crb/biee/prompt/promptList`,param).then((response)=>{
                resolve(response.data);
            })
        })
    },
    //添加提示器
    addBieePrompt:function({commit},param){
        return new Promise((resolve)=>{
            $axios.post(`${process.env.API.baseURL}/crb/biee/prompt/addBieePrompt`,param).then((response)=>{
                resolve(response.data);
            })
        })
    },
    //获取提示器的详细
    getPromptDetail:function({commit},param){
        return new Promise((resolve)=>{
            $axios.post(`${process.env.API.baseURL}/crb/biee/prompt/getPromptDetail`,param).then((response)=>{
                resolve(response.data);
            })
        })
    },
    //修改提示器
    updateBieePrompt:function({commit},param){
        return new Promise((resolve)=>{
            $axios.post(`${process.env.API.baseURL}/crb/biee/prompt/updateBieePrompt`,param).then((response)=>{
                resolve(response.data);
            })
        })
    },
    //删除提示器
    deleteBieePrompt:function({commit},param){
        return new Promise((resolve)=>{
            $axios.post(`${process.env.API.baseURL}/crb/biee/prompt/deleteBieePrompt`,param).then((response)=>{
                resolve(response.data);
            })
        })
    },
    GetAllMenu:function({commit},param){
        return new Promise((resolve)=>{
            $axios.post(`${process.env.API.baseURL}/crb/biee/permission/findAllMenu`,param).then((response)=>{
                var list = [];
                var checkList = [];
                var choosedMenu=response.data.dataResult.choosedMenu;
                for (var menu of choosedMenu) {
                    if(menu.menuType=='101'){ 
                        checkList.push(menu.menuId);
                    }}
                list = response.data.dataResult.menuList;
                resolve({
                    data: list,
                    checkList
                });
            })
        })
    },
    //获取参数列表
    paramList:function({commit},param){
        return new Promise((resolve)=>{
            $axios.post(`${process.env.API.baseURL}/crb/biee/para/paraList`,param).then((response)=>{
                resolve(response.data);
            })
        })
    },
    //获取参数详情
    getParamDetail:function({commit},param){
        return new Promise((resolve)=>{
            $axios.post(`${process.env.API.baseURL}/crb/biee/para/getParaDetail`,param).then((response)=>{
                resolve(response.data);
            })
        })
    },
    //添加参数
    addParam:function({commit},param){
        return new Promise((resolve)=>{
            $axios.post(`${process.env.API.baseURL}/crb/biee/para/addPara`,param).then((response)=>{
                resolve(response.data);
            })
        })
    },
    //删除参数
    deleteParam:function({commit},param){
        return new Promise((resolve)=>{
            $axios.post(`${process.env.API.baseURL}/crb/biee/para/deletePara`,param).then((response)=>{
                resolve(response.data);
            })
        })
    },
    //修改参数
    modifyParam:function({commit},param){
        return new Promise((resolve)=>{
            $axios.post(`${process.env.API.baseURL}/crb/biee/para/updatePara`,param).then((response)=>{
                resolve(response.data);
            })
        })
    },
    loginSource:function({commit},param){
        return new Promise((resolve)=>{
            $axios.post(`${process.env.API.baseURL}/crb/biee/source/loginSource`,param).then((response)=>{
                resolve(response.data);
            })
        })
    },
    //获取后端传回的唯一URL
    getBieeParaUrl:function({commit},param){
        return new Promise((resolve)=>{
            $axios.post(`${process.env.API.baseURL}/crb/biee/menu/getBieeParaUrl`,param).then((response)=>{
                resolve(response.data);
            })
        })
    },
      //获取组织树
      orgList:function({commit},param){
        return new Promise((resolve)=>{
            $axios.post(`${process.env.API.baseURL}/crb/biee/org/orgList`).then((response)=>{
                resolve(response.data);
            })
        })
    },
    //获取组织树详情
    getOrgDetail:function({commit},param){
        return new Promise((resolve)=>{
            $axios.post(`${process.env.API.baseURL}/crb/biee/org/getOrgDetail`,param).then((response)=>{
                resolve(response.data);
            })
        })
    },
    //添加组织
    addCrbOrg:function({commit},param){
        return new Promise((resolve)=>{
            $axios.post(`${process.env.API.baseURL}/crb/biee/org/addCrbOrg`,param).then((response)=>{
                resolve(response.data);
            })
        })
    },
      //更新组织
      updateCrbOrg:function({commit},param){
        return new Promise((resolve)=>{
            $axios.post(`${process.env.API.baseURL}/crb/biee/org/updateCrbOrg`,param).then((response)=>{
                resolve(response.data);
            })
        })
    },
    //删除组织
    deleteCrbOrg:function({commit},param){
        return new Promise((resolve)=>{
            $axios.post(`${process.env.API.baseURL}/crb/biee/org/deleteCrbOrg`,param).then((response)=>{
                resolve(response.data);
            })
        })
    },
    //添加组织用户
    addOrgUser:function({commit},param){
        return new Promise((resolve)=>{
            $axios.post(`${process.env.API.baseURL}/crb/biee/orgUser/addOrgUser`,param).then((response)=>{
                resolve(response.data);
            })
        })
    },
    //通过组织ID查询用户
    findUserByOrgId:function({commit},param){
        return new Promise((resolve)=>{
            $axios.post(`${process.env.API.baseURL}/crb/biee/orgUser/findUserByOrgId`,param).then((response)=>{
                resolve(response.data.dataResult.page);
            })
        })
    },
    //通过条件查询用户
    findUserByCondition:function({commit},param){
        return new Promise((resolve)=>{
            $axios.post(`${process.env.API.baseURL}/crb/biee/orgUser/findUserByCondition`,param).then((response)=>{
                resolve(response.data.dataResult.page);
            })
        })
    },
    //删除组织用户
    deleteOrgUser:function({commit},param){
        return new Promise((resolve)=>{
            $axios.post(`${process.env.API.baseURL}/crb/biee/orgUser/deleteOrgUser`,param).then((response)=>{
                resolve(response.data);
            })
        })
    },
}