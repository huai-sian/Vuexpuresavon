<template>
    <div>
        <nav class="navbar navbar-expand-lg navbar-total fixed-top">
            <div class="container-fluid">
                <nav class='navbar'>
                  <router-link class="nav-title" to='/'><i class="fas fa-praying-hands"></i>Pure Savon</router-link>
                </nav>
                <div class='d-flex justify-content-end navContent'>
                    <div class='dropdown '>
                      <button class='btn-store' data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <router-link to='/productlist'><i class="fas fa-store"></i><span class='d-none d-md-inline-block' style='font-size:1.1rem align-self-center'>{{ $t("Navigation_bar.goshop") }}</span></router-link>
                      </button>
                      </div>
                      <div class='dropdown ml-md-5 ml-1'>
                        <button :class="{'disabled':avoidClick}" class='btn-heart' data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id='wishList'>
                            <i class="fas fa-heart"></i>
                            <span class="badge" v-if="wishlength||wishlength!==0">{{wishlength}}</span>
                        </button>
                      <div class="dropdown-menu dropdown-menu-right dropdown-menu-width p-2" aria-labelledby="wishList">
                            <h4 class='mb-2' v-if="wishlength||wishlength!==0">{{ $t("Navigation_bar.wishlist") }}</h4>
                            <h4 v-else>{{ $t("Navigation_bar.wish_notice") }}</h4>
                            <table class="table-cart table">
                              <tbody>
                                <tr class='pb-0' v-for='item in wish' :key='item.id'>
                                  <td width='10%'><i class="fas fa-shopping-cart" @click.prevent='addTocart(item)'></i></td>
                                  <td><div style="width:3rem;height:3rem"><img  class="img-fluid" :src="item.imageUrl" alt=""></div></td>
                                  <td width='50%' @click.prevent='$router.push(`/product_detail/${item.id}`)' class='wish_title'>{{item.title}}</td>
                                  <td width='10%'><span class='close' @click.prevent='removeWish(item)'>X</span></td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                    <div class='dropdown ml-md-5'>
                        <button :class="{'disabled':avoidClick}" type="button" class='btn-cart' data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id='cartList'>
                            <i class="fas fa-shopping-cart"></i><span class="badge" v-if='cartlength || cartlength !== 0'>{{cartlength}}</span>
                        </button>
                           <div class="dropdown-menu dropdown-menu-right dropdown-menu-width p-2" aria-labelledby="cartList">
                              <h4 class='mb-2'>{{ $t("Navigation_bar.cart") }}</h4>
                              <p v-if='!cartlength || cartlength === 0'>{{ $t("Navigation_bar.cart_notice") }}</p>
                              <table class="table-cart table">
                                <tbody>
                                    <tr class='pb-0' v-for='item in cart' :key='item.id'>
                                        <td><div style="width:3rem;height:3rem"><img  class="img-fluid" :src="item.imageUrl" :alt="item.title"></div></td>
                                        <td @click.prevent='$router.push(`/product_detail/${item.id}`)' class='wish_title'>{{item.title}}</td>
                                        <td>x{{item.qty}}</td>
                                        <td>{{item.origin_price | currency}}</td>
                                        <td><span class='close' @click.prevent='removeCart(item.id)'>X</span></td>
                                    </tr>
                                </tbody>
                              </table>
                              <div class='totalinfo'>
                                  <div style='display:inline-block' class='px-4' v-if='cartlength || cartlength !== 0'>{{ $t("Navigation_bar.total") }}</div>
                                  <div class="totalnum" style='display:inline-block' v-if='cartlength || cartlength !== 0'>{{total | currency}}</div>
                                  <div class='btn btn-goCart' v-if='!cartlength || cartlength === 0' @click.prevent="$router.push('/productlist')">{{ $t("Navigation_bar.gotoshop") }}</div>
                                  <div class='btn btn-goCart' v-else @click.prevent="$router.push('/checkorders')">{{ $t("Navigation_bar.gocheck") }}</div>
                              </div>
                          </div>
                    </div>
                </div>
            </div>
        </nav>
    </div>
</template>
<script>
import { mapGetters, mapState } from 'vuex'
import $ from 'jquery'
export default {
  name: 'Navigation_bar',
  data () {
    return {
      isClose: false,
    }
  },
  methods: {
    getCart () {
      const vm = this
      this.$store.commit('cartModules/CART')
      this.$store.dispatch('cartModules/getCartinfo')
    },
    getWish () {
      this.$store.commit('favoritesModules/WISHES')
      this.$store.commit('favoritesModules/WISHLENGTH')
    },
    addTocart (product, qty = 1) {
      this.getCart()
      this.$store.dispatch('cartModules/addTocart', { product, qty})
      this.getCart()
    },
    removeCart (id) {
      const vm = this
      let removingIndex = -1
      if (vm.cart.length > 0) {
        vm.cart.forEach((item, index) => {
          if (item.id === id) {
            removingIndex = index
          }
        })
      }
      this.$store.commit('cartModules/REMOVECART', removingIndex)
      this.$store.commit('cartModules/UPDATECART')
      vm.getCart()
    },
    removeWish (want) {
      const index = this.wish.indexOf(want)
      this.$store.commit('favoritesModules/DELETEWISH', index)
      this.$store.commit('favoritesModules/UPDATEWISH')
      // this.$bus.$emit('productFavor:get');
      this.getWish()
    }
  },
  computed: {
    avoidClick () {
      if (this.$route.path === '/checkorders' || this.$route.path === '/billinginfo') {
        $('#wishList').dropdown('hide')
        $('#cartList').dropdown('hide')
        return true
      } else {
        return false
      }
    },
    // store中的state變數資料
    ...mapState('favoritesModules', ['wish', 'wishlength']),
    ...mapState('cartModules',['cart', 'cartlength', 'total'])
  },
  created () {
    this.getCart()
    this.getWish()
  }
}
</script>
