import Vue from "vue";
import App from "@/app";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import "ant-design-vue/dist/antd.css";
import {Tabs, Icon, Select} from 'ant-design-vue';

Vue.use(Tabs);
Vue.use(Icon);
Vue.use(Select);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
