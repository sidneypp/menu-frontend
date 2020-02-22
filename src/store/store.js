import Vue from 'vue'
import Vuex from 'vuex'

import customers from './customers'
import orders from './orders'

import state from "./state"
import getters from "./getters"
import mutations from "./mutations"
import actions from "./actions"

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
      customers,
      orders
    },
    getters,
    mutations,
    state,
    actions,
    strict: process.env.NODE_ENV !== 'production'
})
