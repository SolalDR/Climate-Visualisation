// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Bourgeon from 'bourgeon'
import App from './App'
import * as VueGoogleMaps from 'vue2-google-maps'
 import VueResource from 'vue-resource'

Vue.use(Bourgeon, {
  locales: ['fr', 'en']
})

Vue.use(VueResource)

Vue.use(VueGoogleMaps, {
  load: { key: 'AIzaSyC6JTJVlQ3EZHiNF9V9yim91Wh1tlhJuI0' }
})

/* eslint-disable no-new */
window.app = new Vue({
  render: h => h(App)
}).$mount('#app')


