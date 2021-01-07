<template>
    <div>
        <div class='container-fluid layout px-0'>
            <loading :active.sync="isLoading" >
                <template slot="default">
                    <img src="../assets/images/ajax-loader.gif">
                </template>
            </loading>
            <Navbar/>
            <Alert/>
            <transition mode='out-in' name='fade'>
                <router-view :key="$router.fullPath"></router-view>
            </transition>
            <Totop/>
            <Footer/>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Navbar from '../components/Navigation_bar'
import Footer from '../components/Footer'
import Alert from '../components/AlertMessage'
import Totop from '../components/Totop'
export default {
  name: 'Layout',
  components: {
    Navbar,
    Alert,
    Footer,
    Totop
  },
  computed:{
      ...mapGetters(['isLoading']),
  }
}
</script>
<style lang="scss" scoped>
.layout{
    min-width:320px;
    margin:0;
    display: grid;
    grid-template-rows: auto 1fr auto;
    overflow-x: hidden;
}
.layout .content{
  min-height: 100%;
}
.input{
    outline:0;
}
.fade-enter{
    opacity: 0;
}
.fade-enter-to{
    opacity: 1;
}
.fade-enter-active{
    transition:opacity 0.4s;
}
.fade-leave{
    opacity: 1;
}
.fade-leave-to{
    opacity: 0;
}
.fade-leave-active{
    transition:opacity 0.4s;
}
</style>
