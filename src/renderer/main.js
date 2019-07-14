import Vue from 'vue'

import App from './App'
import router from './router'
import store from './store'
import VueLazyload from 'vue-lazyload'
import BootstrapVue from 'bootstrap-vue'
import CKEditor from '@ckeditor/ckeditor5-vue'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(VueLazyload)
Vue.use(BootstrapVue)
Vue.use(CKEditor)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
