import _Vue from 'vue';

import Client from './client';

export default {
  install(Vue: typeof _Vue): void {
    Vue.prototype.$client = new Client();
  },
};
