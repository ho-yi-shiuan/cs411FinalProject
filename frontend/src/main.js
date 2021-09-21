import Vue from "vue"
import VueRouter from 'vue-router'
import App from './App.vue'
import routes from './router/routes'
import vuetify from './plugins/vuetify'

Vue.config.productionTip = false


// configure router
const router = new VueRouter({
  mode: 'history',
  routes // short for routes: routes
});

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
