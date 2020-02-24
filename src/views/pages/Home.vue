<template>
  <div id="dashboard-analytics">
    <div class="vx-row">
      <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 mb-base">
        <statistics-card-line
          icon="UsersIcon"
          :statistic="customersGained.analyticsData.customers"
          statistic-title="Clientes Conquistados"
          :chart-data="customersGained.series"
          type="area"
        ></statistics-card-line>
      </div>

      <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 mb-base">
        <statistics-card-line
          icon="DollarSignIcon"
          :statistic="revenueGenerated.analyticsData.revenues"
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
          :statistic="ordersRecevied.analyticsData.orders"
          statistic-title="Pedidos Recebidos"
          :chart-data="ordersRecevied.series"
          color="warning"
          type="area"
        ></statistics-card-line>
      </div>
    </div>

    <div class="vx-row">
      <div class="vx-col w-full md:w-2/3 mb-base">
        <monthly-revenue-card
          title="Esse Mês"
          :month-revenue="monthlyRevenue.analyticsData.thisMonth"
          :chart-data="monthlyRevenue.series"
          :chart-categories="monthlyRevenue.categories"
          :formatter="formatMoney"
        />
      </div>

      <div class="vx-col w-full md:w-1/3 mb-base">
        <orders-delivered
          title="Pedidos Entregues"
          :chart-data="ordersDelivered.series"
          :orders-delivered="ordersDelivered.analyticsData.delivered"
          :orders-pending="ordersDelivered.analyticsData.pending"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { formatMoney } from "@/utils";

import StatisticsCardLine from "@/components/statistics-cards/StatisticsCardLine";
import MonthlyRevenueCard from "@/components/monthly-revenue-card/MonthlyRevenueCard";
import OrdersDelivered from "@/components/orders-delivered-card/OrdersDeliveredCard";

export default {
  components: {
    StatisticsCardLine,
    MonthlyRevenueCard,
    OrdersDelivered
  },
  data() {
    return {
      formatMoney,
      customersGained: {
        series: [],
        analyticsData: {
          customers: 0
        }
      },
      revenueGenerated: {
        series: [],
        analyticsData: {
          revenues: 0
        }
      },
      ordersRejected: {
        series: [],
        analyticsData: {
          orders: 0
        }
      },
      ordersRecevied: {
        series: [],
        analyticsData: {
          orders: 0
        }
      },
      monthlyRevenue: {
        series: [],
        analyticsData: {
          thisMonth: 0
        }
      },
      ordersDelivered: {
        series: [],
        analyticsData: {
          delivered: 0,
          pending: 0
        }
      }
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

    this.$http.get("/statistics/monthly-revenue").then(({ data }) => {
      this.monthlyRevenue = data;
    });

    this.$http.get("/statistics/orders-delivered").then(({ data }) => {
      this.ordersDelivered = data;
    });
  }
};
</script>
