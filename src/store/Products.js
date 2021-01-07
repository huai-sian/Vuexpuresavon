import axios from 'axios'
export default {
	namespaced: true,
	state: {
		products: [],
		serieslist: [],
		currentChoice: '全部商品',
		pagination: {
			total_pages: '',
			current_page: '',
			has_pre: false,
			has_next: true
		},
		currentPagenum: 1,
		allProducts: [],
		currentProduct: []
	},
	actions: {
		getProducts (context, page = 1) {
			const vm = this
      		const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/products/all`
			context.dispatch('updateLoading', true, { root: true })
			axios.get(api).then((response) => {
				if(!response.data.success){
					context.dispatch('alertMessageModules/updateMessage', { message: response.data.message, status: 'danger'}, { root: true})
				}else{
					context.commit('PRODUCTS', response.data.products)
					context.commit('RENDERSerieslist')
					context.commit('FILTERDATA', page)
				} 
				context.dispatch('updateLoading', false, { root: true })
			})
		},
		getAllProducts (context){
			const vm = this
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/products/all`
			context.dispatch('updateLoading', true, { root: true })
			axios.get(api).then((response) => {
				if(!response.data.success){
					context.dispatch('alertMessageModules/updateMessage', { message: '出現異常，請稍後再試', status: 'danger'}, { root: true})
				}else{
					context.commit('GETALLPRODUCTS', response.data.products)
				}
				context.dispatch('updateLoading', false, { root: true })
			})
		},
		getCurrentProduct(context, id) {
			const vm = this
      const api = `${process.env.VUE_APP_APIPATH}/api/${process.env.VUE_APP_CUSTOMPATH}/product/${id}`
			context.dispatch('updateLoading', true, { root: true })
			axios.get(api).then((response) => {
				if(!response.data.success){
					context.dispatch('alertMessageModules/updateMessage', { message: '出現異常，請稍後再試', status: 'danger'}, { root: true})
				}else{
					context.commit('GETCURRENTPRODUCT', response.data.product)
				}
				context.dispatch('updateLoading', false, { root: true })
			})
		}
	},
	mutations: {
		PRODUCTS(state, payload) {
			state.products= payload
		},
		RENDERSerieslist(state) {
			const allseries = []
			state.products.forEach((item)=> allseries.push(item.category))
			state.serieslist=allseries.filter((item, i, arr) => arr.indexOf(item)===i)
			state.serieslist.unshift('全部商品')
		},
		CURRENTCHOICE(state, payload) {
			state.currentChoice=payload
		},
		FILTERDATA(state, payload) {
			if (state.currentChoice !== '全部商品') {
        state.products = state.products.filter((item) => item.category=== state.currentChoice)
			}else{
				state.products= state.products
			}
			const pages = Math.ceil(state.products.length / 8)
			state.pagination.total_pages = pages
			state.currentPagenum= payload
			state.pagination.current_page=state.currentPagenum
			if (payload <= 1) {
        state.pagination.has_pre = false
      } else {
        state.pagination.has_pre = true
      }
      if (payload >= state.pagination.total_pages) {
        state.pagination.has_next = false
      } else {
        state.pagination.has_next = true
			}
			const startNum = (parseInt(state.currentPagenum, 10) - 1) * 8
			const endNum = ((parseInt(state.currentPagenum, 10) - 1) * 8 + 8)
			state.products= state.products.slice(startNum, endNum) 
		},
		GETALLPRODUCTS(state, payload) {
			state.allProducts=payload
		},
		GETCURRENTPRODUCT(state, payload) {
			state.currentProduct= payload
		}
	},
	getters: {
		products: state => state.products,
		serieslist: state => state.serieslist,
		currentChoice: state => state.currentChoice,
		pagination: state => state.pagination,
		currentPagenum: state => state.currentPagenum
	}
}