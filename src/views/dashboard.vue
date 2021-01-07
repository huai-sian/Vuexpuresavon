<template>
    <div>
      <loading :active.sync="isLoading" >
      </loading>
        <Navbar/>
        <Alert/>
          <div class="container-fluid">
            <div class="row">
              <Sidebar/>
              <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-4">
                <router-view></router-view>
              </main>
          </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Sidebar from '../components/sidebar'
import Navbar from '../components/navbar'
import Alert from '../components/AlertMessage'
// 以上三個元件是dashboard組成子元件，而router-view則是會動態根據sidebar的link切換的子元件之呈現處
export default {
  components: {
    Sidebar,
    Navbar,
    Alert
  },
  computed:{
    ...mapGetters(['isLoading'])
  },
  created() {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)pureSavonVuex\s*=\s*([^;]*).*$)|^.*$/, '$1')
    this.$http.defaults.headers.common.Authorization = `${token}`
  },
}
</script>
