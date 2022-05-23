<template>
  <v-navigation-drawer permanent app expand-on-hover>
    <v-list>
      <router-link to="/">
        <v-list-item class="px-2">
          <v-avatar>
            <v-img
              alt="Logo Constellation"
              class="shrink mr-2"
              contain
              :src="require('@/assets/logo.svg')"
              transition="scale-transition"
              width="40"
            />
          </v-avatar>
        </v-list-item>
      </router-link>
    </v-list>

    <v-divider></v-divider>

    <v-list nav dense>
      <v-list-item
        v-for="l in liens"
        :key="l.texte"
        link
        @click="$router.push({ path: '/'.concat(l.page) })"
      >
        <v-list-item-icon>
          <v-icon> {{ l.icône }} </v-icon>
        </v-list-item-icon>
        <v-list-item-title
          :class="{ 'ms-4': l.page === 'compte' && imageCompte }"
        >
          {{ l.title }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'NavigationMenu',
  data() {
    return {
      liens: [
        {
          page: '',
          title: 'Home',
          icône: 'mdi-home',
        },
        {
          page: 'myData',
          title: 'My data',
          icône: 'mdi-database',
        },
        {
          page: 'allData',
          title: 'All data',
          icône: 'mdi-web',
        },

      ],
    };
  },
});
</script>

<style></style>
