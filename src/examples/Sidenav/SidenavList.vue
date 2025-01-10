<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

import SidenavItem from "./SidenavItem.vue";
// import SidenavCard from "./SidenavCard.vue";

const store = useStore();
const isRTL = computed(() => store.state.isRTL);

const getRoute = () => {
  const route = useRoute();
  const routeArr = route.path.split("/");
  return routeArr[1];
};
</script>
<template>
  <div
    class="collapse navbar-collapse w-auto h-auto h-100"
    id="sidenav-collapse-main"
  >
    <ul class="navbar-nav">
      <!-- Menu Dashboard -->
      <li class="nav-item">
        <sidenav-item
          to="/dashboard"
          :class="getRoute() === 'dashboard-default' ? 'active' : ''"
          :navText="isRTL ? 'لوحة القيادة' : 'Dashboard'"
        >
          <template v-slot:icon>
            <i class="ni ni-tv-2 text-primary text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <!-- Menu Rekap Transaksi -->
      <li class="nav-item">
        <sidenav-item
          to="/recap"
          :class="getRoute() === 'transactions' && getRoute() === 'recap' ? 'active' : ''"
          :navText="isRTL ? 'ملخص المعاملات' : 'Rekap Transaksi'"
        >
          <template v-slot:icon>
            <i class="ni ni-chart-bar-32 text-success text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <!-- Menu Tambah Transaksi -->
      <li class="nav-item">
        <sidenav-item
          to="/transactions/add"
          :class="getRoute() === 'transactions' && getRoute() === 'add' ? 'active' : ''"
          :navText="isRTL ? 'إضافة معاملة' : 'Tambah Transaksi'"
        >
          <template v-slot:icon>
            <i class="ni ni-fat-add text-danger text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <!-- Menu lainnya -->
      <li class="nav-item">
        <sidenav-item
          to="/tables"
          :class="getRoute() === 'tables' ? 'active' : ''"
          :navText="isRTL ? 'الجداول' : 'Edit Transaksi'"
        >
          <template v-slot:icon>
            <i
              class="ni ni-calendar-grid-58 text-warning text-sm opacity-10"
            ></i>
          </template>
        </sidenav-item>
      </li>


    </ul>
  </div>

  <div class="pt-3 mx-3 mt-3 sidenav-footer">
    <!-- <sidenav-card
      :card="{
        title: 'Need Help?',
        description: 'Please check our docs',
        links: [
          {
            label: 'Documentation',
            route:
              'https://www.creative-tim.com/learning-lab/vue/overview/argon-dashboard/',
            color: 'dark',
          },
          {
            label: 'Buy now',
            route:
              'https://www.creative-tim.com/product/vue-argon-dashboard-pro?ref=vadp',
            color: 'success',
          },
        ],
      }"
    /> -->
  </div>
</template>
