import Vue from 'vue';
import VueWorker from "vue-worker";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import { ToFromDateFilter } from './filters/ToFromDate';
import { PlainDateFilter } from './filters/PlainDate';
import { NumberSuffix } from './filters/NumberSuffix';

import App from './App.vue';
import router from './router';
import './registerServiceWorker';
import webworkerActions from './webworker.actions';
import store from './sharedservice';

Vue.use(ElementUI);
Vue.use(VueWorker);

Vue.filter('ToFromDate', ToFromDateFilter);
Vue.filter('PlainDate', PlainDateFilter);
Vue.filter('NumberSuffix', NumberSuffix);

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App),
  created() {
    store.setItem('worker', this.$worker.create(webworkerActions));
  }
}).$mount('#app')
