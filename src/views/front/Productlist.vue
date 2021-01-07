<template>
    <div>
        <Bannerimg>
            <Series :serieslist='serieslist' :currentChoice='currentChoice' @getSeries='changeCat'></Series>
        </Bannerimg>
        <div class='container-fluid productContent'>
            <div class="row">
                <div class="col-xl-3 col-lg-4 col-sm-6 col-xs-12 " v-for="item in products" :key='item.id'>
                    <div class='productCard' :class="{'disabled':!item.is_enabled}" @click='$router.push(`/product_detail/${item.id}`)'>
                        <div class='soldOut' v-if="!item.is_enabled">
                           <h5>售完</h5>
                           <!-- 將未啟用的商品加上一層半透明遮照 -->
                        </div>
                        <div class='top'>
                            <img :src="item.imageUrl" alt="">
                            <div class='tag' v-if='item.price'>特價中</div>
                            <i class="fas fa-heart liked" v-if='isliked(item)' @click.stop="addTowish(item)"></i>
                            <i class='far fa-heart' v-else @click.stop="addTowish(item)"></i>
                        </div>
                        <div class='bottom'>
                            <h3>{{item.title}}</h3>
                            <div>
                                <div class='price'>NT{{item.origin_price | currency}}</div>
                                <i class="fas fa-spinner fa-spin" v-if="status.loadingItem===item.id"></i>
                                <i class="fas fa-shopping-cart" @click.stop='addTocart(item)' v-else></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
         <Pagination :pages='pagination' @switchpage="getPagination"></Pagination>
    </div>
</template>
<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import Bannerimg from '../../components/Bannerimg'
import Series from '../../components/Series'
import Pagination from '../../components/pagination'
export default {
  name: 'Productlist',
  components: {
    Bannerimg,
    Series,
    Pagination
  },
  data () {
    return {
      status: {
        loadingItem: ''
      },
    }
  },
  methods: {
    changeCat (option = '全部商品') {
      this.$store.commit('productModule/CURRENTCHOICE', option)
      this.getProducts()
    },
    addTocart (product, qty = 1) {
      this.status.loadingItem = product.id
      this.getCart()
      this.$store.dispatch('cartModules/addTocart', { product, qty})
      this.getCart()
     
      this.status.loadingItem = ''
    },
    getCart () {
      this.$store.commit('cartModules/CART')
      this.$store.dispatch('cartModules/getCartinfo')
      console.log(this.products)
    },
    addTowish (want) {
      this.$store.dispatch('favoritesModules/addTowish', want)
      this.$store.commit('favoritesModules/WISHLENGTH')
      // vm.$bus.$emit('message:push','已加入慾望清單','success');
    },
    getWish () {
      this.$store.commit('favoritesModules/WISHES')
    },
    isliked (want) {
      const liked = this.wish.filter(item => item.id === want.id)
      if (liked.length > 0) {
        return true
      } else {
        return false
      }
    },
    getPagination (page) {
      this.$store.dispatch('productModule/getProducts', page)
    },
    ...mapActions('productModule', ['getProducts'])
  },
  computed: {
    ...mapState('favoritesModules', ['wish']),
    ...mapGetters('productModule', ['serieslist', 'products', 'currentChoice', 'currentPagenum', 'pagination'])
  },
  created () {
    const vm = this
    if (vm.$route.params.series) {
      this.$store.commit('productModule/CURRENTCHOICE', vm.$route.params.series)
    }
    // 若是上一路徑元件push此元件有參數時，參數帶著類別，則接住此參數，把該類別賦予到當前呈現類別，進而將商品列表進行過濾，呈現出對應類別的結果
    this.getProducts()
    this.getCart()
    this.getWish()
    // vm.$bus.$on('productFavor:get', () => vm.getWish());每次於導覽列中刪除慾望清單，就會重新從localstorage中取得新的慾望清單
  }
}
</script>
