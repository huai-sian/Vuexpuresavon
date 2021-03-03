<template>
    <div>
        <Bannerimg>
            <ProgressStep :current='step'></ProgressStep>
        </Bannerimg>
        <div class='container checkOut'>
            <h3>{{ $t("Checkout.orderInfo") }}</h3>
            <div class="row listRow">
                <div class='col-md-6 col-12' :class="{ 'typo__center': order.is_paid }">
                    <ul class='order'>
                        <p>{{ $t("Checkout.orderDate") }} - {{order.create_at | date}}</p>
                        <p>{{ $t("Checkout.orderid") }} - <span class="orderid">{{order.id}}</span></p>
                        <li class="orderList" v-for='item in order.products' :key='item.id'>
                            <div class="row">
                                <div class="col-6 p-0">
                                    <div class="pro-title" @click.prevent="$router.push(`/product_detail/${item.product.id}`)">{{item.product.title}}</div>
                                    </div>
                                <div class="col-2 p-0">
                                    <div class="pro-qty">{{item.qty}}</div>
                                    </div>
                                <div class="col-4 p-0">
                                    <div class='pro-price'>NT{{ item.final_total / item.qty | floor | currency }}</div>
                                    </div>
                            </div>
                        </li>
                        <li class='pt-2 summaryBlock'>
                            <div class='row summaryList'>
                                <div class='col-8 p-0 summary'>{{ $t("Checkout.summary") }}</div>
                                <div class='col-4 p-0 summary'>NT{{order.total | currency}}</div>
                            </div>
                        </li>
                    </ul>
                    <div class='order_info'>
                        <table class='table'>
                            <tr>
                                <td class="title">{{ $t("Checkout.name") }}</td>
                                <td>{{order.user.name}}</td>
                            </tr>
                            <tr>
                                <td class="title">{{ $t("Checkout.telephone") }}</td>
                                <td>{{order.user.tel}}</td>
                            </tr>
                            <tr>
                                <td class="title">Email</td>
                                <td>{{order.user.email}}</td>
                            </tr>
                            <tr>
                                <td class="title">{{ $t("Checkout.address") }}</td>
                                <td>{{order.user.address}}</td>
                            </tr>
                            <tr>
                                <td class="title">{{ $t("Checkout.order_pay") }}</td>
                                <td v-if='order.user.payment==="CVS"'>{{ $t("Checkout.order_op1") }}</td>
                                <td v-if='order.user.payment==="CTP"'>{{ $t("Checkout.order_op2") }}</td>
                            </tr>
                            <tr>
                                <td class="title">{{ $t("Checkout.paid_condition") }}</td>
                                <td v-if='!order.is_paid' class='incomplete'>{{ $t("Checkout.not_paid") }}</td>
                                <td v-else class='complete'>{{ $t("Checkout.paid") }}</td>
                            </tr>
                        </table>
                        <div class='endpay'>
                            <button v-if='order.is_paid' @click.prevent="$router.push('/productlist')">{{ $t("Checkout.backtoshop") }}</button>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 col-12" v-if="!order.is_paid">
                  <div class="order_info">
                    <h3 class="h3">信用卡資訊</h3>
                    <div class="d-flex card_support">
                      <p>支援使用卡種類</p>
                      <span class="d-flex">
                        <div class="imagefr"><img src="../../assets/images/visa.svg" alt=""></div>
                        <div class="imagefr"><img src="../../assets/images/mastercard.svg" alt=""></div>
                        <div class="imagefr"><img src="../../assets/images/jcb.svg" alt=""></div>
                      </span>
                    </div>
                    <ValidationObserver v-slot="{ handleSubmit }">
                    <form @submit.prevent="handleSubmit(completePay)" class="form_card">
                      <div class="form-group">
                        <label for="card_number">{{ $t("Checkout.card_number") }}<span class='marker'>*</span>
                        </label>
                        <ValidationProvider rules='required|cardnum' v-slot='{ errors , classes }'>
                          <div :class="classes">
                            <input type="text" class="form-control" name="card_number" id="card_number" placeholder="xxxx-xxxx-xxxx-xxxx" v-model="cardmeta.num">
                            <span class="text-danger">{{ errors[0] }}</span>
                          </div>
                        </ValidationProvider>
                      </div>
                      <div class="form-group">
                        <label for="card_owner">{{ $t("Checkout.card_owner") }}<span class='marker'>*</span>
                        </label>
                        <ValidationProvider rules='required' v-slot='{ errors , classes }'>
                          <div :class="classes">
                            <input type="text" class="form-control" name="card_owner" id="card_owner" v-model="cardmeta.owner">
                            <span class="text-danger">{{ errors[0] }}</span>
                          </div>
                        </ValidationProvider>
                      </div>
                      <div class="form-group">
                        <label for="verify_num">{{ $t("Checkout.verify_num") }}<span class='marker'>*</span>
                        </label>
                        <ValidationProvider rules='required' v-slot='{ errors , classes }'>
                          <div :class="classes">
                            <input type="text" class="form-control" name="verify_num" id="verify_num" maxlength="3" v-model="cardmeta.verify">
                            <span class="text-danger">{{ errors[0] }}</span>
                          </div>
                        </ValidationProvider>
                      </div>
                      <div class="form-group">
                        <label for="expired">{{ $t("Checkout.expired") }}<span class='marker'>*</span>
                        </label>
                        <ValidationProvider rules='required|date' v-slot='{ errors , classes }'>
                          <div :class="classes">
                            <input type="text" class="form-control" name="expired" id="expired" max-length="5" placeholder="MM/YY" v-model="cardmeta.expiry">
                            <span class="text-danger">{{ errors[0] }}</span>
                          </div>
                        </ValidationProvider>
                      </div>
                      <div class='endpay'>
                        <button v-if='!order.is_paid' type="submit">{{ $t("Checkout.go_paid") }}</button>
                      </div>
                    </form>
                    </ValidationObserver>
                </div>
              </div>
            </div>
        </div>
        <div class="modal fade" id="endPayModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                <div class="modal-header" >
                    <h5 class="modal-title">PURE SAVON</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body p-3 d-flex align-items-center justify-content-center">
                    <i class="fas fa-clipboard-check"></i>
                    <h3 class='ml-2'>{{ $t("Checkout.checkoutModal1") }}<br>{{ $t("Checkout.checkoutModal2") }}</h3>
                </div>
                </div>
        </div>
        </div>
    </div>
</template>
<script>
import Bannerimg from '../../components/Bannerimg'
import ProgressStep from '../../components/progressStep'
import $ from 'jquery'
export default {
  name: 'Checkout',
  components: {
    Bannerimg,
    ProgressStep
  },
  data () {
    return {
      step: 3,
      orderId: '',
      order: {
        user: {}
      },
      cardmeta: {
        num: '',
        owner: '',
        verify: '',
        expiry: ''
      }
    }
  },
  methods: {
    getOrder () {
      const vm = this
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/order/${vm.orderId}`
      vm.$store.dispatch('updateLoading', true)
      vm.$http.get(api).then((response) => {
        console.log(response.data.order)
        if (response.data.success) {
          vm.order = response.data.order
        }else{
          this.$store.dispatch('alertMessageModules/updateMessage', { message: response.data.message, status: 'danger' })
          this.$router.push('/productlist')
        }
        vm.$store.dispatch('updateLoading', false)
      })
    },
    completePay () {
      const vm = this
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/pay/${vm.orderId}`
       vm.$store.dispatch('updateLoading', true)
      vm.$http.post(api).then((response) => {
        if (response.data.success) {
          vm.getOrder()
          $('#endPayModal').modal('show')
        } else {
          this.$store.dispatch('alertMessageModules/updateMessage', { message: response.data.message, status: 'danger' })
        }
        vm.$store.dispatch('updateLoading', false)
      })
    }
  },
  created () {
    this.orderId = this.$route.params.order_id
    this.getOrder()
  }
}
</script>
