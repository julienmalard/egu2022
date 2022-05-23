<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-img
          :src="require('../assets/logo.svg')"
          class="my-6 mx-auto"
          contain
          height="150"
        />
      </v-col>

      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">
          Welcome to our workshop's citizen science app
        </h1>

        <p class="subheading font-weight-regular">
          In case you haven't noticed, this isn't really a citizen science app.
          <br>But if you like it you can make a real one just like it.
        </p>
      </v-col>

      <v-col
        class="mb-5"
        cols="12"
      >
        <h2 class="headline font-weight-bold mb-6">
          What's next?
        </h2>

        <v-row justify="center">
          <v-btn
            class="ma-5"
            text
            outlined
            @click="()=>$router.push('/myData')"
          >
            <v-icon left>mdi-database</v-icon>
            Go to my data
          </v-btn>
          <v-btn
            class="ma-5"
            text
            outlined
            @click="()=>$router.push('/allData')"
          >
            <v-icon left>mdi-web</v-icon>
            See all data
          </v-btn>
        </v-row>
      </v-col>

    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import { utils } from '@constl/ipa';

export default Vue.extend({
  name: 'HomeView',
});
</script>
