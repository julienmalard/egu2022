import _Vue from 'vue';

import Client from './client';

export default {
  install(Vue: typeof _Vue): void {
    /* eslint-disable */
    Vue.prototype.$client = new Client();
  },
};
