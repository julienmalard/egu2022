<template>
  <v-app>
    <v-main class="pl-4">
      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>
      <Navigation />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';

import Navigation from '@/components/Navigation.vue';

export default Vue.extend({
  name: 'App',
  components: { Navigation },
  data: () => ({
    //
  }),
});
</script>
