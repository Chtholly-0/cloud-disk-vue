import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import 'element-ui/lib/theme-chalk/index.css';
import '@/plugins/element.js';
import api from '@/static/api/index';
import '@/assets/icons/iconfont.js';
import '@/assets/css/icon.css';
import uploader from 'vue-simple-uploader';

Vue.config.productionTip = false
Vue.prototype.$api = api
Vue.prototype.Bus = new Vue();
Vue.use(uploader)

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
