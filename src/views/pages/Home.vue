<template>
  <div id="dashboard-analytics">
    <div class="vx-row">
      <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 mb-base">
        <statistics-card-line
          icon="UsersIcon"
          :statistic="customersGained.customers"
          statistic-title="Clientes Conquistados"
          :chart-data="customersGained.series"
          type="area"
        ></statistics-card-line>
      </div>

      <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 mb-base">
        <statistics-card-line
          icon="DollarSignIcon"
          :statistic="revenueGenerated.revenues"
          statistic-title="Receita Gerada"
          :chart-data="revenueGenerated.series"
          color="success"
          type="area"
          :formatter="formatMoney"
        ></statistics-card-line>
      </div>

      <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 mb-base">
        <statistics-card-line
          icon="XIcon"
          :statistic="ordersRejected.analyticsData.orders"
          statistic-title="Pedidos Rejeitados"
          :chart-data="ordersRejected.series"
          color="danger"
          type="area"
        ></statistics-card-line>
      </div>

      <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 mb-base">
        <statistics-card-line
          icon="ShoppingBagIcon"
          :statistic="ordersRecevied.orders"
          statistic-title="Pedidos Recebidos"
          :chart-data="ordersRecevied.series"
          color="warning"
          type="area"
        ></statistics-card-line>
      </div>
    </div>

    <div class="vx-row">
      <!-- LINE CHART -->
      <div class="vx-col w-full md:w-2/3 mb-base">
        <vx-card title="Receita">
          <div slot="no-body" class="p-6 pb-0">
            <div v-if="revenueComparisonLine.analyticsData" class="flex">
              <div class="mr-6">
                <p class="mb-1 font-semibold">Esse Mês</p>
                <p class="text-3xl text-success">
                  {{
                    formatMoney(revenueComparisonLine.analyticsData.thisMonth)
                  }}
                </p>
              </div>
            </div>
            <vue-apex-charts
              type="line"
              height="266"
              :options="analyticsData.revenueComparisonLine.chartOptions"
              :series="revenueComparisonLine.series"
            />
          </div>
        </vx-card>
      </div>

      <!-- RADIAL CHART -->
      <div class="vx-col w-full md:w-1/3 mb-base">
        <vx-card title="Pedidos Entregues">
          <!-- CHART -->
          <template slot="no-body">
            <div class="mt-10">
              <vue-apex-charts
                type="radialBar"
                height="240"
                :options="analyticsData.goalOverviewRadialBar.chartOptions"
                :series="ordersDelivered.series"
              />
            </div>
          </template>

          <!-- DATA -->
          <div
            slot="no-body-bottom"
            class="flex justify-between text-center mt-6"
          >
            <div
              class="w-1/2 border border-solid d-theme-border-grey-light border-r-0 border-b-0 border-l-0"
            >
              <p class="mt-4">Entregue</p>
              <p class="mb-4 text-3xl font-semibold">
                {{ ordersDelivered.analyticsData.delivered }}
              </p>
            </div>
            <div
              class="w-1/2 border border-solid d-theme-border-grey-light border-r-0 border-b-0"
            >
              <p class="mt-4">Pendente</p>
              <p class="mb-4 text-3xl font-semibold">
                {{ ordersDelivered.analyticsData.pending }}
              </p>
            </div>
          </div>
        </vx-card>
      </div>
    </div>
  </div>
</template>

<script>
import StatisticsCardLine from "@/components/statistics-cards/StatisticsCardLine.vue";
import VueApexCharts from "vue-apexcharts";
import analyticsData from "../analyticsData";
import { formatMoney } from "@/utils";
export default {
  components: {
    StatisticsCardLine,
    VueApexCharts
  },
  data() {
    return {
      formatMoney,
      customersGained: {
        series: [],
        customers: 0
      },
      revenueGenerated: {
        series: [],
        revenues: 0
      },
      ordersRejected: {
        series: [],
        analyticsData: {
          orders: 0
        }
      },
      ordersRecevied: {
        series: [],
        orders: 0
      },
      revenueComparisonLine: {
        series: [],
        analyticsData: {
          thisMonth: 0,
          lastMonth: 0
        }
      },
      ordersDelivered: {
        series: [],
        analyticsData: {
          delivered: 0,
          pending: 0
        }
      },
      analyticsData
    };
  },
  created() {
    this.$http.get("/statistics/customers-gained").then(({ data }) => {
      this.customersGained = data;
    });

    this.$http.get("/statistics/revenue-generated").then(({ data }) => {
      this.revenueGenerated = data;
    });

    this.$http.get("/statistics/orders-rejected").then(({ data }) => {
      this.ordersRejected = data;
    });

    this.$http.get("/statistics/orders-received").then(({ data }) => {
      this.ordersRecevied = data;
    });

    this.$http.get("/statistics/revenue-comparison").then(({ data }) => {
      this.revenueComparisonLine = data;
    });

    this.$http.get("/statistics/orders-delivered").then(({ data }) => {
      this.ordersDelivered = data;
    });
  }
};
</script>
