<template>
    <div class='product_detail'>
        <Bannerimg>
            <nav aria-label="breadcrumb" class='breadmark'>
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a href="#" @click.prevent="$router.push('/')">{{ $t("Product_detail.bread_home") }}</a></li>
                    <li class="breadcrumb-item"><a href="#" @click.prevent="$router.push('/productlist')">{{ $t("Product_detail.bread_store") }}</a></li>
                    <li class="breadcrumb-item"><a href="#" @click.prevent="$router.push({name:'Productlist',params:{series:currentProduct.category}})">{{ $t("Product_detail.series") }}</a></li>
                    <li class="breadcrumb-item active" aria-current="page">{{currentProduct.title}}</li>
                </ol>
            </nav>
        </Bannerimg>
        <div class='container'>
            <div class='row product_info' v-if='currentProduct.imageUrl'>
                <div class='col-lg-6 col-md-7'>
                    <div class='product_pic'>
                        <img :src="currentProduct.imageUrl" alt="">
                    </div>
                </div>
                <div class='col-lg-6 col-md-5'>
                    <ul class='product_meta'>
                       <li>
                           <h3>{{currentProduct.title}}</h3>
                       </li>
                       <li>
                           <p class='origin_pricesolo' v-if="!currentProduct.price">NT{{currentProduct.origin_price | currency}}</p>
                           <del class='origin_price' v-if="currentProduct.price">NT{{currentProduct.origin_price|currency}}</del>
                       </li>
                       <li>
                           <p class="salesprice" v-if='currentProduct.price'>NT{{currentProduct.price | currency}}</p>
                       </li>
                       <li>
                           <div class='numControl'>
                               <button type="button" class=" btn-minus" data-quantity="minus" data-field="quantity" @click.prevent="changeNum(-1)">
                                <i class="fa fa-minus" aria-hidden="true"></i>
                                </button>
                                <input class="amount" type="number" max="10" min='1' v-model="productnum" @change='changeAmount(productnum)'>
                                <button type="button" class=" btn-plus" data-quantity="plus" data-field="quantity" @click.prevent="changeNum(1)">
                                <i class="fa fa-plus" aria-hidden="true"></i>
                                </button>
                           </div>
                           <button class='btn btn-cart' @click.prevent='addToCart(currentProduct, productnum)'><i class='fas fa-shopping-cart'></i>加入購物車</button>
                       </li>
                       <li>
                           <p class='product_des'>{{currentProduct.description}}</p>
                       </li>
                       <li>
                           <p class='product_con'>{{currentProduct.content}}</p>
                       </li>
                     </ul>
                </div>
            </div>
            <div class='product_intro'>
                <h4 class='mb-4 h4'>{{ $t("Product_detail.howtouse_title") }}</h4>
                <p class='mb-4'>{{ $t("Product_detail.howtouse") }}</p>
                <h4 class='mb-4 h4'>{{ $t("Product_detail.warning_title") }}</h4>
                <p class='mb-4'>{{ $t("Product_detail.warning") }}</p>
                <h4 class='mb-4 h4'>{{ $t("Product_detail.notice_title") }}</h4>
                <div class="notice">
                    <div class='return'>
                        <h4 @click.prevent='accordion' class='notice_title'><i class="fas fa-exclamation-triangle"></i>{{ $t("Product_detail.noticesub1") }}<i class="fas fa-exclamation-triangle"></i></h4>
                        <p class='notice_txt'>{{ $t("Product_detail.noticesub1_con") }}</p>
                    </div>
                    <div class='aware'>
                        <h4 @click.prevent='accordion' class='notice_title'><i class="fas fa-exclamation-triangle"></i>{{ $t("Product_detail.noticesub2") }}<i class="fas fa-exclamation-triangle"></i></h4>
                        <p class='notice_txt'>{{ $t("Product_detail.noticesub2_con") }}</p>
                    </div>
                      <div class='ship'>
                        <h4 @click.prevent='accordion' class='notice_title'><i class="fas fa-exclamation-triangle"></i>{{ $t("Product_detail.noticesub3") }}<i class="fas fa-exclamation-triangle"></i></h4>
                        <p class='notice_txt'>{{ $t("Product_detail.noticesub3_con") }}</p>
                    </div>
                </div>
            </div>
            <div class='related'>
                <h3>{{ $t("Product_detail.related") }}</h3>
                <hr>
                <div class="related_content row">
                    <div class='col-md-4 col-sm-6 col-12 d-flex justify-content-start align-item-center'  v-for='item in filterSimilars' :key='item.id'>
                        <div class='productCard' @click.prevent='goRelated(item.id)'>
                            <div class='top'>
                                <img :src="item.imageUrl" alt="">
                                <div class='tag'>特價中</div>
                            </div>
                            <div class='bottom'>
                                <h3>{{item.title}}</h3>
                                  <div class='price'>NT${{item.origin_price}}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Bannerimg from '../../components/Bannerimg'
import $ from 'jquery'
import { mapGetters, mapState, mapActions } from 'vuex'
export default {
  name: 'ProductDetail',
  components: {
    Bannerimg
  },
  data () {
    return {
      productId: '',
      productnum: 1
    }
  },
  methods: {
    getProduct () {
      const vm = this
      vm.productId = vm.$route.params.product_id
      this.$store.dispatch('productModule/getCurrentProduct', vm.productId)
      vm.productnum = 1
    },
    getCart () {
      this.$store.commit('cartModules/CART')
      this.$store.dispatch('cartModules/getCartinfo')
    },
    addToCart (product, qty = 1) {
      this.getCart()
      this.$store.dispatch('cartModules/addTocart', { product, qty })
      this.getCart()
    },
    changeNum (qty) {
      const amount = this.productnum + qty
      this.changeAmount(amount)
    },
    changeAmount (num) {
      const qty = num
      if (qty >= 10) {
        this.productnum = 10
      } else if (qty <= 1) {
        this.productnum = 1
      } else {
        this.productnum = qty
      }
    },
    goRelated (id) {
      this.$router.push(`/product_detail/${id}`)
      this.getProduct()// 轉換至對應商品的路徑，並且接住商品id參數，從api取得該商品資料，呈現於畫面上
    },
    accordion (e) {
      const { currentTarget } = e
      $(currentTarget).toggleClass('active')
      $(currentTarget).parent().find('.notice_txt').slideToggle()
      $(currentTarget).parent().siblings().find('.notice_txt').slideUp()
      $(currentTarget).parent().siblings().find('.notice_title').removeClass('active')
    },
    ...mapActions('productModule', ['getAllProducts'])
  },
  computed: {
    filterSimilars () {
      const vm = this
      return vm.allProducts.filter(item => (item.id !== vm.productId) && (item.category === vm.currentProduct.category) && (item.is_enabled))
    },
    ...mapGetters('cartModules',['cart']),
    ...mapState('productModule', ['allProducts', 'currentProduct'])
  },
  created () {
    this.getProduct()
    this.getAllProducts()
    this.getCart()
  }
}
</script>
