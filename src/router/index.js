import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '*',
    redirect: '/'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login.vue')
  },
  {
    path: '/admin',
    name: 'Dashboard',
    component: () => import('../views/dashboard.vue'),
    children: [
      {
        path: 'products',
        name: 'Products',
        component: () => import('../views/back/products.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'orders',
        name: 'Orders',
        component: () => import('../views/back/orders.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'coupon',
        name: 'Coupon',
        component: () => import('../views/back/coupon.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'analysis',
        name: 'Analysis',
        component: () => import('../views/back/Analysis.vue'),
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: '/back',
    component: () => import('../views/dashboard.vue'),
    children: [
      {
        path: 'customer_orders',
        name: 'Customerorders',
        component: () => import('../views/back/CustomerOrders.vue')
      },
      {
        path: 'customer_checkout/:order_id',
        name: 'CustomerCheckout',
        component: () => import('../views/back/CustomerCheckout.vue')
      }
    ]
  },
  {
    path: '/',
    // name:"Layout",
    component: () => import('../views/Layout.vue'),
    children: [
      {
        path: '/',
        name: 'Home',
        component: () => import('../views/front/home.vue')
      },
      {
        path: 'productlist',
        name: 'Productlist',
        component: () => import('../views/front/Productlist.vue')
      },
      {
        path: 'product_detail/:product_id',
        name: 'ProductDetail',
        component: () => import('../views/front/Product_detail.vue')
      },
      {
        path: 'checkorders',
        name: 'CheckOrders',
        component: () => import('../views/front/CheckOrders.vue')
      },
      {
        path: 'billinginfo',
        name: 'Billinginfo',
        component: () => import('../views/front/Billinginfo.vue')
      },
      {
        path: 'checkout/:order_id',
        name: 'Checkout',
        component: () => import('../views/front/Checkout.vue')
      }
    ]
  }
]

const router = new VueRouter({
  linkActiveClass: 'active',
  routes,
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

export default router

