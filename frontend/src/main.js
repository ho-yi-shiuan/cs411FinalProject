import Vue from "vue"
import VueRouter from 'vue-router'
import App from './App.vue'
import routes from './router/routes'
import vuetify from './plugins/vuetify'
import store from "./plugins/store"
var VueCookie = require('vue-cookie');
Vue.use(VueCookie);

Vue.use(VueRouter)

Vue.config.productionTip = false

// configure router
const router = new VueRouter({
  mode: 'history',
  routes, // short for routes: routes
  duplicateNavigationPolicy: 'reload'
});

new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
