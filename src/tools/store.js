/**
 * 解决在别的import 文件中 store 实例不能使用的问题
 */
import store from '@/vuex/index.js'
window.$store = store;
export default store;