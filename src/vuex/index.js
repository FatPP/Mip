import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'
import process from './modules/process/index.js'
import leave from './modules/leave/index.js'

import { vuexModules, rootModules } from 'ripples-core';
import { vuexPscModules } from 'ripples-psc'

Vue.use(Vuex)

export default new Vuex.Store({
    state: Object.assign({}, state, rootModules.state),
    actions: Object.assign({}, actions, rootModules.actions),
    mutations: Object.assign({}, mutations, rootModules.mutations),
    getters: Object.assign({}, getters, rootModules.getters),
    modules: Object.assign({},vuexModules,vuexPscModules, {
        process,
        leave,
    })
})