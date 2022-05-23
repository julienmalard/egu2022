import Client from '@/plugins/constl/client';

declare module 'vue/types/vue' {
  interface Vue {
    $client: Client;
  }
}
