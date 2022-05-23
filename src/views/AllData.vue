<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <h1>All data</h1>
      </v-col>
    </v-row>

    <v-row>
      <v-list>
        <v-list-item>
          <v-chip label outlined>
            Currently online: {{ online.length }}
          </v-chip>
        </v-list-item>
        <v-list-item
          v-for="d in allData"
          :key="d.empreinte"
          two-line
        >
          <v-list-item-avatar>
            <v-avatar
              v-if="d.idBdCompte === $client.myAccountId"
              outlined color="#a4d9f2"
            >
              Me
            </v-avatar>
            <v-icon v-else>{{
              Math.random() < 0.5 ? 'mdi-face-man-profile' : 'mdi-face-woman-profile'
            }}</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>
              Date: {{ new Date(d.élément.données.date).toDateString() }}
            </v-list-item-title>
            <v-list-item-subtitle>
              Site: {{ d.élément.données.samplingSite }}
              Streamflow: {{ d.élément.données.streamflow }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import { réseau, utils } from '@constl/ipa';
import { WorkshopData } from '@/plugins/constl/client';

export default Vue.extend({
  name: 'AllData',
  data() {
    return {
      forgetFuncs: [] as utils.schémaFonctionOublier[],
      tableId: undefined as undefined | string,
      dataFile: undefined as undefined | File,
      allData: [] as réseau.élémentDeMembre<WorkshopData>[],
      online: [] as réseau.infoMembreRéseau[],
    };
  },
  watch: {
    async dataFile(file?: File) {
      if (file) {
        await this.$client.readDataFromFile({ file });
      }
    },
  },
  methods: {
    async deleteData() {
      await this.$client.deleteAllData();
    },
  },
  async mounted() {
    const forgetAllData = await this.$client.followAllData(
      {
        f: (data: réseau.élémentDeMembre<WorkshopData>[]) => {
          console.log(data);
          this.allData = data;
        },
      },
    );

    const forgetOnline = await this.$client.followOnline(
      {
        f: (online: réseau.infoMembreRéseau[]) => {
          this.online = online;
        },
      },
    );
    this.forgetFuncs.push(forgetAllData);
  },
  destroyed() {
    this.forgetFuncs.forEach((f) => f());
  },
});
</script>
