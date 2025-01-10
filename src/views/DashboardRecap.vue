<script setup>
import { onMounted, ref, watch } from 'vue';
import Chart from 'chart.js/auto';
import axios from '@/api/axios';
import DefaultInfoCard from "@/examples/Cards/DefaultInfoCard.vue";

const totalIncome = ref(0);
const totalExpense = ref(0);
const filterType = ref('monthly'); // Default filter
const filterTypeText = ref('Bulanan');
const selectedDay = ref('');
const selectedMonth = ref('');
const selectedYear = ref(new Date().getFullYear());
const days = ref([...Array(31).keys()].map((d) => d + 1));
const months = ref(['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']);
const years = ref([...Array(10).keys()].map((y) => new Date().getFullYear() - y));
const categories = ref([]);

let categoryChart;

const fetchCategories = async () => {
  try {
    const response = await axios.get('/categories');
    categories.value = response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
};

const fetchRecapData = async () => {
  try {
    const response = await axios.get('/transactions');
    const transactions = response.data;

    const filteredTransactions = transactions.filter((t) => {
      const date = new Date(t.date);

      if (filterType.value === 'daily') {
        return (
          date.getDate() === parseInt(selectedDay.value) &&
          date.getMonth() === months.value.indexOf(selectedMonth.value) &&
          date.getFullYear() === parseInt(selectedYear.value)
        );
      }

      if (filterType.value === 'monthly') {
        return (
          date.getMonth() === months.value.indexOf(selectedMonth.value) &&
          date.getFullYear() === parseInt(selectedYear.value)
        );
      }

      if (filterType.value === 'yearly') {
        return date.getFullYear() === parseInt(selectedYear.value);
      }
    });

    totalIncome.value = filteredTransactions
      .filter((t) => t.type === 'income')
      .reduce((acc, curr) => acc + curr.amount, 0);

    totalExpense.value = filteredTransactions
      .filter((t) => t.type === 'expense')
      .reduce((acc, curr) => acc + curr.amount, 0);

    const categoryIncome = filteredTransactions
      .filter((t) => t.type === 'income')
      .reduce((acc, curr) => {
        acc[curr.categoryId] = (acc[curr.categoryId] || 0) + curr.amount;
        return acc;
      }, {});

    const categoryExpense = filteredTransactions
      .filter((t) => t.type === 'expense')
      .reduce((acc, curr) => {
        acc[curr.categoryId] = (acc[curr.categoryId] || 0) + curr.amount;
        return acc;
      }, {});

    const categoryLabels = [
      ...new Set([...Object.keys(categoryIncome), ...Object.keys(categoryExpense)]),
    ].map((id) => {
      const category = categories.value.find((cat) => cat._id === id);
      return category ? category.name : id;
    });

    const categoryData = {
      labels: categoryLabels,
      datasets: [
        {
          label: 'Pemasukan',
          data: categoryLabels.map((name) =>
            filteredTransactions
              .filter((t) => t.type === 'income' && categories.value.find((cat) => cat.name === name)?._id === t.categoryId)
              .reduce((acc, curr) => acc + curr.amount, 0)
          ),
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
        },
        {
          label: 'Pengeluaran',
          data: categoryLabels.map((name) =>
            filteredTransactions
              .filter((t) => t.type === 'expense' && categories.value.find((cat) => cat.name === name)?._id === t.categoryId)
              .reduce((acc, curr) => acc + curr.amount, 0)
          ),
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
      ],
    };

    if (categoryChart) categoryChart.destroy();
    categoryChart = new Chart(document.getElementById('categoryChart'), {
      type: 'bar',
      data: categoryData,
      options: {
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            return `${context.dataset.label}: ${formatRupiah(value)}`;
          },
        },
      },
    },
  },
    });
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

// Watchers untuk perubahan filter
watch([filterType, selectedDay, selectedMonth, selectedYear], () => {
  fetchRecapData();
});

onMounted(async () => {
  await fetchCategories();
  fetchRecapData();
});

const formatRupiah = (angka) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(angka);
};

</script>

<template>
  <argon-card class="p-4">
    <h2 class="text-center font-weight-bold">Dashboard Rekap</h2>
        <div class="row mt-4">
      <div class="col-lg-6">
        <default-info-card
          :icon="{ component: 'fas fa-wallet', background: 'bg-gradient-success' }"
          title="Total Pemasukan"
          :value="formatRupiah(totalIncome)"
          description="Jumlah total pemasukan Anda."
        />
      </div>
      <div class="col-lg-6">
        <default-info-card
          :icon="{ component: 'fas fa-shopping-cart', background: 'bg-gradient-danger' }"
          title="Total Pengeluaran"
          :value="formatRupiah(totalExpense)"
          description="Jumlah total pengeluaran Anda."
        />
      </div>
    </div>

    <!-- Pilihan Filter -->
    <div class="mt-4 text-center">
      <select v-model="filterType" class="form-select w-50 mx-auto" @change="applyFilter">
        <option value="daily">Harian</option>
        <option value="monthly">Bulanan</option>
        <option value="yearly">Tahunan</option>
      </select>

      <!-- Dropdown untuk hari, bulan, dan tahun -->
      <div v-if="filterType === 'daily'" class="mt-3 d-flex justify-content-center">
        <select v-model="selectedDay" class="form-select w-25 mx-1">
          <option v-for="day in days" :key="day" :value="day">{{ day }}</option>
        </select>
        <select v-model="selectedMonth" class="form-select w-25 mx-1">
          <option v-for="month in months" :key="month" :value="month">{{ month }}</option>
        </select>
        <select v-model="selectedYear" class="form-select w-25 mx-1">
          <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
        </select>
      </div>

      <div v-else-if="filterType === 'monthly'" class="mt-3 d-flex justify-content-center">
        <select v-model="selectedMonth" class="form-select w-25 mx-1">
          <option v-for="month in months" :key="month" :value="month">{{ month }}</option>
        </select>
        <select v-model="selectedYear" class="form-select w-25 mx-1">
          <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
        </select>
      </div>

      <div v-else-if="filterType === 'yearly'" class="mt-3 d-flex justify-content-center">
        <select v-model="selectedYear" class="form-select w-25 mx-1">
          <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
        </select>
      </div>
    </div>

    <!-- Grafik Chart -->
    <div class="row mt-5">
      <div class="col-md-6">
        <h5 class="text-center">Rekap {{ filterTypeText }}</h5>
        <div class="chart-container">
          <canvas id="summaryChart"></canvas>
        </div>
      </div>

      <!-- Persentase Kategori -->
      <div class="col-md-6">
        <h5 class="text-center">Persentase Kategori</h5>
        <div class="chart-container">
          <canvas id="categoryChart"></canvas>
        </div>
      </div>
    </div>
  </argon-card>
</template>
