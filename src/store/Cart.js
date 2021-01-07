import axios from 'axios'
export default {
  namespaced: true,
  state: {
    cart: [],
    cartlength: 0,
    total:0,
    carts:[],// api購物車資料
    coupon_success:true,
  },
  actions: {
    getCartinfo(context){
      //購物車數量
      context.commit('CARTLENGTH')
      //購物車小計
      context.commit('CARTTOTAL')
    },
    addTocart(context, { product, qty}){
      let productIndex = -1
      if (context.state.cart.length > 0) {
        context.state.cart.forEach((item, index) => {
          if (item.id === product.id) {
            productIndex = index
          }
        })
      }
      if (productIndex === -1) {
        const total = parseInt((product.origin_price * qty), 10)
        let tempProduct = { ... product}
        tempProduct.qty=qty
        tempProduct.total=total
        context.commit('ADDTOCART', tempProduct)
      } else {
        let tempProduct =  { ... context.state.cart[productIndex]}
        tempProduct.qty += qty
        const total = parseInt((product.origin_price * qty), 10)
        tempProduct.total += total
        context.commit('REMOVECART', productIndex)
        context.commit('ADDTOCART', tempProduct)
      }
      context.commit('UPDATECART')
      //跨module溝通需加上{root: true}
      context.dispatch('alertMessageModules/updateMessage', { message: '商品已加入購物車', status: 'success'}, {root: true})
    },
    changeCartnum(context, { product, qty }){
      let productIndex = -1
      let num = qty
      if (context.state.cart.length > 0) {
        context.state.cart.forEach((item, index) => {
          if (item.id === product.id) {
            productIndex = index
          }
        })
      }
      if(qty >= 10){
        num=10
        context.commit('CHANGEAMOUNT', { productIndex, num });
      }else if(qty <=1){
        num = 1
        context.commit('CHANGEAMOUNT', { productIndex, num })
      }else{
        num=qty
        context.commit('CHANGEAMOUNT', { productIndex, num })
      }
      const total = parseInt((context.state.cart[productIndex].origin_price * context.state.cart[productIndex].qty), 10)
      context.commit('CHANGETOTAL', { productIndex, total} )
      context.commit('UPDATECART')
    },
    confirmCart(context){
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/cart`
      context.state.cart.forEach((item) => {
        const cartinfo = {
          product_id: item.id,
          qty: item.qty
        }
        axios.post(api, { data: cartinfo}).then((response)=>{
          if(!response.data.succes){
            context.dispatch('alertMessageModules/updateMessage', { message: '商品加入購物車失敗', status: 'danger'}, {root: true})
          }else{
            context.dispatch('alertMessageModules/updateMessage', { message: '商品已加入購物車', status: 'success'}, {root: true})
          }
        })
      })
    },
    getCart(context){
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/cart`
      context.dispatch('updateLoading', true, { root: true})
      axios.get(api).then((response) => {
        if(!response.data.success){
          context.dispatch('alertMessageModules/updateMessage', { message: response.data.message, status: 'danger'}, {root: true})
        }else{
          context.commit('CARTAPI', response.data.data)
          context.commit('CARTAPILENGTH')
          context.dispatch('updateLoading', false, { root: true})
        }
      })
    },
    removeCart(context){
      context.state.carts.carts.forEach((item) => {
        const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/cart/${item.id}`
        axios.delete(api).then((response) => {
          if(!response.data.succes){
            context.dispatch('alertMessageModules/updateMessage', { message: response.data.message, status: 'danger'}, {root: true})
          }
        })
      })
    },
    addCouponCode(context, coupon_num){
      const coupon = { code: coupon_num }
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/coupon`
      context.dispatch('updateLoading', true, { root: true})
      axios.post(api, { data: coupon }).then((response) => {
        if (response.data.success) {
          context.commit('COUPONSUCCESS', true)
          context.dispatch('alertMessageModules/updateMessage', { message: response.data.message, status: 'success'}, {root: true})
        } else {
          context.commit('COUPONSUCCESS', false)
          context.dispatch('alertMessageModules/updateMessage', { message: response.data.message, status: 'danger'}, {root: true})
        }
        context.dispatch('updateLoading', false, { root: true})
      })
    }
  },
  mutations: {
    CART(state){//localstorage的cart資料
      state.cart=JSON.parse(localStorage.getItem('cart')) || []
    },
    ADDTOCART(state, payload){
      state.cart.push(payload)
    },
    REMOVECART(state, payload){
      state.cart.splice(payload, 1)
    },
    CHANGEAMOUNT(state, payload){
      state.cart[payload.productIndex].qty = payload.num
    },
    CHANGETOTAL(state, payload){
      state.cart[payload.productIndex].total=payload.total
    },
    CARTLENGTH(state){
      state.cartlength=0
      state.cart.forEach(item=>{
        state.cartlength+=item.qty
      })
    },
    CARTTOTAL(state){
      state.total=0
      state.cart.forEach((item) => {
        state.total+= item.total
      })
    },
    UPDATECART(state){
      state.cart=localStorage.setItem('cart', JSON.stringify(state.cart))
    },
    CARTAPI(state, payload){
      state.carts=payload
    },
    CARTAPILENGTH(state){
      state.cartlength= state.carts.carts.length
    },
    COUPONSUCCESS(state, payload){
      state.coupon_success= payload
    }
  },
  getters: {
    cart: state => state.cart,
    carts: state => state.carts,
    cartlength: state => state.cartlength,
    total: state => state.total,
    coupon_success: state => state.coupon_success
  }
}