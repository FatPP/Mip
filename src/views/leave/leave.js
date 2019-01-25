import 'babel-polyfill';
import Promise from 'es6-promise'
Promise.polyfill()
import Vue from 'vue';
import iView from 'iview';
import Vuex from 'vuex';
import store from '@/vuex/index.js'
import '@/tools/index.js'
import 'iview/dist/styles/iview.css';
import '@/axios.config.js'
import filters from '@/filters.js';
import { system, routerEvent, Locales } from 'ripples-core';
import App from './index.vue';

Vue.use(system, {
    app: {
        title: '通用开发平台'
    }
});

Vue.use(Vuex);
Vue.use(iView);

import VueI18n from 'vue-i18n';
import zhLocale from 'iview/src/locale/lang/zh-CN';
import enLocale from 'iview/src/locale/lang/en-US';
import langModule from '@/lang/index.js'
Vue.use(VueI18n);
// 自动设置语言
const navLang = navigator.language;
const localLang = (navLang === 'zh-CN' || navLang === 'en-US') ? navLang : false;
const lang = window.localStorage.getItem('language') || localLang || 'zh-CN';

Vue.config.lang = lang;
// 多语言配置
Vue.locale('zh-CN', {
    ...zhLocale,
    ...Locales['zh-CN'],
    ...langModule['zh-CN']
});
Vue.locale('en-US', {
    ...enLocale,
    ...Locales['en-US'],
    ...langModule['en-US']
});
window.$store = store;
window.$app = new Vue({
    el: '#app',
    store: store,
    render: h => h(App),
    data: {

    },
    mounted() {

    },
    created() {

    }
});