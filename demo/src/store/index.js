import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    htmlMapData:null

  },
  mutations: {
    htmlMapData(state, payload) {
      state.htmlChartData = payload;
    },
  },
  actions: {
  },
  modules: {
  }
})
