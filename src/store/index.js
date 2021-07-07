import Vue from 'vue'
import Vuex from 'vuex'

import mutations from './mutations'
import actions from './actions'
import getters from './getters'
Vue.use(Vuex)
// 2.创建store对象->导入main.js 
const state = {
  cartList: [],
}
const store = new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})
export default store