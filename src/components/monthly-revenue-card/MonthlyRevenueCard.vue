<template>
  <vx-card title="Receita">
    <div slot="no-body" class="p-6 pb-0">
      <div class="flex">
        <div class="mr-6">
          <p class="mb-1 font-semibold">{{ title }}</p>
          <p class="text-3xl text-success">{{ monthRevenue }}</p>
        </div>
      </div>
      <vue-apex-charts
        ref="apexChart"
        type="line"
        height="266"
        :options="chartOptions"
        :series="chartData"
      />
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
    monthRevenue: {
      type: [Number, String],
      default: 0
    },
    chartData: {
      type: Array,
      default: () => []
    },
    chartCategories: {
      type: Array,
      default: () => ["01", "05", "09", "13", "17", "21", "26", "31"]
    },
    formatter: {
      type: Function,
      default: value => value
    }
  },
  data() {
    return {
      chartOptions: null
    };
  },
  watch: {
    chartCategories() {
      this.$refs.apexChart.updateOptions({
        xaxis: { categories: this.chartCategories }
      });
    }
  },
  created() {
    this.chartOptions = Object.assign({}, chartConfigs.chartOptions);
    this.chartOptions.yaxis.labels = {
      style: {
        cssClass: "text-grey fill-current"
      },
      formatter: this.formatter
    };
    this.chartOptions.xaxis.categories = this.chartCategories;
  }
};
</script>
