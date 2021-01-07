export default {
  namespaced: true,
  state: {
    wish: [],
    wishlength: 0
  },
  actions: {
    addTowish(context, product){
      let wishIndex = -1
      if(context.state.wish.length > 0){
        context.state.wish.forEach((item, index) => {
          if (item.id === product.id) {
          wishIndex = index
          }
        })
      }
      // 不存在加入陣列
      if(wishIndex===-1){
        context.commit('ADDTOWISH', product)
      }else{
        // 存在則移除
        context.commit('DELETEWISH', wishIndex)
      }
      // 儲存致localstorage
      context.commit('UPDATEWISH')
      // 重新整理getwish
      context.commit('WISHES')
    }
  },
  mutations :{
    WISHES(state){
      state.wish=JSON.parse(localStorage.getItem('wish')) || []
    },
    ADDTOWISH(state, payload){
      state.wish.push(payload)
    },
    DELETEWISH(state, payload){
      state.wish.splice(payload, 1)
    },
    WISHLENGTH(state){
      state.wishlength=state.wish.length
    },
    UPDATEWISH(state){
      state.wish=localStorage.setItem('wish', JSON.stringify(state.wish))
    }
  },
  getters :{
  }
}
