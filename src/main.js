import 'babel-polyfill';
import Promise from 'es6-promise'
Promise.polyfill();
// import  'babel-polyfill';
import Vue from 'vue';
import iView from 'iview';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import App from './App.vue';
import Cookies from 'js-cookie';
import store from './vuex/index.js'
import './tools/index.js'
import util from "./tools/util.js";
import ElementUI from 'element-ui';
import 'iview/dist/styles/iview.css';
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.less'
// import { Tree, Select, Option } from 'element-ui'
import { routers, appRouter } from './router';
import './axios.config.js'

import filters from './filters.js'

import { system, routerEvent, Locales } from 'ripples-core'
Vue.config.devtools = process.env.API.devtools;
Vue.use(system, {
    // app: {
    //     title: '通用开发平台'
    // }
    // app: {
    //     title: '报账系统',
    //     logo: '../static/imgs/logo.png',
    //     logoMain: './static/imgs/logo-min.png',
    //     home: {
    //         "path": "home-page",
    //         "title": "首页",
    //         "name": "home-page"
    //     }
    // }
});

// 引入echarts
import echarts from 'echarts';

Vue.prototype.$echarts = echarts;

import VueI18n from 'vue-i18n';
import zhLocale from 'iview/src/locale/lang/zh-CN';
import enLocale from 'iview/src/locale/lang/en-US';



Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(VueI18n);
Vue.use(iView);
// Vue.use(Tree);
Vue.use(ElementUI);
// Vue.use(Select);
// Vue.use(Option);

Vue.prototype.ActionBarConfig = (config) => {
    $channel.$emit('ActionBarEvent', config);
}
Vue.prototype.$tt = (key) => {
    var realKey = key.split('$')[0];
    return Vue.prototype.$t(realKey);
}
for (var filter of filters) {
    Vue.filter(filter.name, filter.fn);
}

// 自动设置语言
const navLang = navigator.language;
const localLang = (navLang === 'zh-CN' || navLang === 'en-US') ? navLang : false;
const lang = window.localStorage.getItem('language') || localLang || 'zh-CN';

Vue.config.lang = lang;

// 多语言配置
Vue.locale('zh-CN', Object.assign(zhLocale, Locales['zh-CN']));
Vue.locale('en-US', Object.assign(enLocale, Locales['en-US']));

// 路由配置
const RouterConfig = {
    // mode: 'history',
    routes: routers
};

const router = new VueRouter(RouterConfig);

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    routerEvent.beforeEach(to, from, next);
    iView.LoadingBar.finish();
    $channel.$emit('RouterChangeBefore');
    $channel.$emit('ActionBarEvent', []);
});

router.afterEach(() => {
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});


var urlParams = util.getUrlParams();
var vueOption = {
  el: '#app',
  router: urlParams.singlePage=='YES' ? new VueRouter(RouterConfig) : router,
  store: store,
  render: h => h(App),
  data: {
    currentPageName: ''
  },
  mounted() {
    this.currentPageName = this.$route.name;
  },
  created() {
    if (!!sessionStorage.crctoken) {
      $axios.defaults.headers.crctoken = sessionStorage.crctoken
    } else {
      if (!!process.env.API.sso) {
        this.$Spin.show({
          render: (h) => {
            return h('div', [
              h('Icon', {
                'class': 'demo-spin-icon-load',
                props: {
                  type: 'load-c',
                  size: 18
                }
              }),
              h('div', '登录中...')
            ])
          }
        });
        axios.post(`${process.env.API.baseURL}/sys/ssologin`).then((response) => {
          
          this.$Spin.hide();
          sessionStorage.crctoken = response.data.dataResult.crctoken;
          $axios.defaults.headers.crctoken = sessionStorage.crctoken;
          if(urlParams.singlePage=='YES') {
            this.$router.replace({
              name: urlParams.pageName,
              query: urlParams,
            })        
          }else {
            this.$router.push({
              name: $store.getters.homePage.name
            });
          }
        })
      }
    }
    if(urlParams.singlePage=='YES') {
        this.$router.replace({
          name: urlParams.pageName,
          query: urlParams,
        })        
    }
    this.$store.commit('setTagsList', [...appRouter.children]);
  },
  mounted() {

  }  
};
window.$app = new Vue(vueOption);
window.$store = store;

window.$confirm = (text, vue) => {
    return new Promise((resolve) => {
        vue.$Modal.confirm({
            title: '操作提示',
            content: text,
            onOk: () => {
                resolve();
            }
        });
    })
};