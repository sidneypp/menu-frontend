<template>
  <vx-card :title="title">
    <template slot="no-body">
      <div class="mt-10">
        <vue-apex-charts
          type="radialBar"
          height="240"
          :options="chartOptions"
          :series="chartData"
        />
      </div>
    </template>

    <div slot="no-body-bottom" class="flex justify-between text-center mt-6">
      <div
        class="w-1/2 border border-solid d-theme-border-grey-light border-r-0 border-b-0 border-l-0"
      >
        <p class="mt-4">Entregue</p>
        <p class="mb-4 text-3xl font-semibold">{{ ordersDelivered }}</p>
      </div>
      <div
        class="w-1/2 border border-solid d-theme-border-grey-light border-r-0 border-b-0"
      >
        <p class="mt-4">Pendente</p>
        <p class="mb-4 text-3xl font-semibold">{{ ordersPending }}</p>
      </div>
    </div>
  </vx-card>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
import chartConfigs from "./chartConfigs.js";
export default {
  components: {
    VueApexCharts
  },
  props: {
    title: {
      type: String,
      required: true
    },
    chartData: {
      type: Array,
      default: () => []
    },
    ordersDelivered: {
      type: Number,
      default: 0
    },
    ordersPending: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      chartOptions: chartConfigs.chartOptions
    };
  }
};
</script>
