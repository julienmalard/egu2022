import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import vuetify from './plugins/vuetify';
import myConstellationApp from './plugins/constl';

Vue.config.productionTip = false;
Vue.use(myConstellationApp);

new Vue({
  router,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
