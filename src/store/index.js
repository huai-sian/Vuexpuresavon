import Vue from 'vue'
import Vuex from 'vuex'
import alertMessageModules from './AlertMessage'
import favoritesModules from './Wish'
import cartModules from './Cart'
import productModule from './Products.js'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  state: {
    isLoading:false,
  },
  actions: {
    updateLoading(context, status){
      context.commit('LOADING', status);
    }
  },
  mutations: {
    LOADING(state, status){
      state.isLoading=status;
    }
  },
  getters:{
    isLoading: state => state.isLoading
  },
  modules: {
    alertMessageModules,
    favoritesModules,
    cartModules,
    productModule
  }
})
