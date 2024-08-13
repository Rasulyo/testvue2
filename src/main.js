import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store/store";
import "./axios";
import VueNotification from "vue-notification";

Vue.config.productionTip = false;
Vue.use(VueNotification);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
