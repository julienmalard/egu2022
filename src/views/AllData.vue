<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <h1>All data</h1>
      </v-col>
    </v-row>

    <v-row>
      <v-list width="100%">
        <v-list-item>
          <v-chip label outlined>
            Currently online: {{ online.length }}
          </v-chip>
        </v-list-item>
        <v-list-item>
          <v-switch v-model="graph" inset prepend-icon="mdi-table" append-icon="mdi-chart-line"/>
        </v-list-item>
        <span v-if="graph">
          <D3LineChart :config="chart_config" :datum="points"></D3LineChart>
        </span>
        <span v-else>
          <v-list-item
            v-for="d in allData"
            :key="d.élément.empreinte"
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
        </span>
      </v-list>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';

// https://saigesp.github.io/vue-d3-charts/#/linechart
import { D3LineChart } from 'vue-d3-charts';

import { réseau, utils } from '@constl/ipa';
import { WorkshopData } from '@/plugins/constl/client';

export default Vue.extend({
  name: 'AllData',
  data() {
    return {
      graph: true,

      forgetFuncs: [] as utils.schémaFonctionOublier[],
      tableId: undefined as undefined | string,
      dataFile: undefined as undefined | File,
      allData: [] as réseau.élémentDeMembre<WorkshopData>[],
      online: [] as réseau.infoMembreRéseau[],
    };
  },
  components: {
    D3LineChart,
  },
  watch: {
    async dataFile(file?: File) {
      if (file) {
        await this.$client.readDataFromFile({ file });
      }
    },
  },
  computed: {
    chart_config() {
      return {
        values: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'],
        date: {
          key: 'date',
          inputFormat: '%Y-%m-%d',
          outputFormat: '%Y-%m-%d',
        },
        axis: {
          yTicks: 3,
        },
      };
    },
    points(): {[key: string]: number | string}[] {
      const dateToString = (d: number): string => (new Date(d)).toISOString().slice(0, 10);
      const points: {[key: string]: number | string}[] = [];
      const sites = new Set<string>();
      this.allData.forEach((d) => {
        const { date, samplingSite, streamflow } = d.élément.données;
        sites.add(String(samplingSite));
        const existant = points.find((p) => p.date === dateToString(date));
        if (existant) {
          existant[samplingSite] = streamflow;
        } else {
          const dataPoint = Object.fromEntries([...sites].map((s) => [s, NaN]));
          Object.assign(dataPoint, { [samplingSite]: streamflow, date: dateToString(date) });
          points.push(dataPoint);
        }
      });
      return points;
    },

  },
  methods: {

  },
  async mounted() {
    const forgetAllData = await this.$client.followAllData(
      {
        f: (data: réseau.élémentDeMembre<WorkshopData>[]) => {
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
    this.forgetFuncs.push(forgetOnline);
  },
  destroyed() {
    this.forgetFuncs.forEach((f) => f());
  },
});
</script>
