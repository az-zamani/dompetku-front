<script setup>
import { ref, onMounted } from "vue";
import ArgonButton from "@/components/ArgonButton.vue";
import axios from "@/api/axios";

// Data transaksi
const transactions = ref([]);

// Fetch data transaksi
const fetchTransactions = async () => {
  try {
    const response = await axios.get("/transactions");
    console.log("Data Transaksi:", response.data); // Log untuk debug
    transactions.value = response.data;
  } catch (error) {
    console.error("Error fetching transactions:", error.response?.data || error.message);
  }
};

// Format tanggal untuk tampilan
const formatDate = (dateString) => {
  const options = {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleString("id-ID", options);
};

// Grupkan transaksi berdasarkan tanggal
const groupTransactionsByDate = () => {
  const today = new Date().toLocaleDateString("id-ID");
  const yesterday = new Date(Date.now() - 86400000).toLocaleDateString("id-ID");

  const newest = transactions.value.filter(
    (t) => new Date(t.date).toLocaleDateString("id-ID") === today
  );
  const yesterdayGroup = transactions.value.filter(
    (t) => new Date(t.date).toLocaleDateString("id-ID") === yesterday
  );
  const older = transactions.value.filter(
    (t) => new Date(t.date).toLocaleDateString("id-ID") < yesterday
  );

  return { newest, yesterday: yesterdayGroup, older };
};


// Fetch data saat komponen dimuat
onMounted(() => {
  fetchTransactions();
});
</script>

<template>
  <div class="card h-100 mb-4">
    <div class="card-header pb-0 px-3">
      <div class="row">
        <div class="col-md-6">
          <h6 class="mb-0">Your Transactions</h6>
        </div>
        <div class="col-md-6 d-flex justify-content-end align-items-center">
          <i class="far fa-calendar-alt me-2" aria-hidden="true"></i>
          <small>{{ new Date().toLocaleDateString("id-ID") }}</small>
        </div>
      </div>
    </div>
    <div class="card-body pt-4 p-3">
      <!-- Newest Transactions -->
      <h6 class="text-uppercase text-body text-xs font-weight-bolder mb-3">Newest</h6>
      <ul class="list-group">
        <li
          v-for="transaction in groupTransactionsByDate().newest"
          :key="transaction._id"
          class="list-group-item border-0 d-flex justify-content-between ps-0 mb-2 border-radius-lg"
        >
          <div class="d-flex align-items-center">
            <argon-button
              :color="transaction.type === 'income' ? 'success' : 'danger'"
              variant="outline"
              size="sm"
              class="btn-icon-only btn-rounded mb-0 me-3 d-flex align-items-center justify-content-center"
            >
              <i :class="transaction.type === 'income' ? 'fas fa-arrow-up' : 'fas fa-arrow-down'" aria-hidden="true"></i>
            </argon-button>
            <div class="d-flex flex-column">
              <h6 class="mb-1 text-dark text-sm">{{ transaction.description || "No Description" }}</h6>
              <span class="text-xs">{{ formatDate(transaction.date) }}</span>
            </div>
          </div>
          <div
            :class="[
              'd-flex align-items-center text-sm font-weight-bold',
              transaction.type === 'income' ? 'text-success text-gradient' : 'text-danger text-gradient',
            ]"
          >
            {{ transaction.type === 'income' ? '+ ' : '- ' }}Rp {{ parseInt(transaction.amount).toLocaleString("id-ID") }}
          </div>
        </li>
      </ul>

      <!-- Yesterday's Transactions -->
      <h6 class="text-uppercase text-body text-xs font-weight-bolder my-3">Yesterday</h6>
      <ul class="list-group">
        <li
          v-for="transaction in groupTransactionsByDate().yesterday"
          :key="transaction._id"
          class="list-group-item border-0 d-flex justify-content-between ps-0 mb-2 border-radius-lg"
        >
          <div class="d-flex align-items-center">
            <argon-button
              :color="transaction.type === 'income' ? 'success' : 'danger'"
              variant="outline"
              size="sm"
              class="btn-icon-only btn-rounded mb-0 me-3 d-flex align-items-center justify-content-center"
            >
              <i :class="transaction.type === 'income' ? 'fas fa-arrow-up' : 'fas fa-arrow-down'" aria-hidden="true"></i>
            </argon-button>
            <div class="d-flex flex-column">
              <h6 class="mb-1 text-dark text-sm">{{ transaction.description || "No Description" }}</h6>
              <span class="text-xs">{{ formatDate(transaction.date) }}</span>
            </div>
          </div>
          <div
            :class="[
              'd-flex align-items-center text-sm font-weight-bold',
              transaction.type === 'income' ? 'text-success text-gradient' : 'text-danger text-gradient',
            ]"
          >
            {{ transaction.type === 'income' ? '+ ' : '- ' }}Rp {{ parseInt(transaction.amount).toLocaleString("id-ID") }}
          </div>
        </li>
      </ul>

      <!-- Older Transactions -->
      <h6 class="text-uppercase text-body text-xs font-weight-bolder my-3">Older</h6>
      <ul class="list-group">
        <li
          v-for="transaction in groupTransactionsByDate().older"
          :key="transaction._id"
          class="list-group-item border-0 d-flex justify-content-between ps-0 mb-2 border-radius-lg"
        >
          <div class="d-flex align-items-center">
            <argon-button
              :color="transaction.type === 'income' ? 'success' : 'danger'"
              variant="outline"
              size="sm"
              class="btn-icon-only btn-rounded mb-0 me-3 d-flex align-items-center justify-content-center"
            >
              <i :class="transaction.type === 'income' ? 'fas fa-arrow-up' : 'fas fa-arrow-down'" aria-hidden="true"></i>
            </argon-button>
            <div class="d-flex flex-column">
              <h6 class="mb-1 text-dark text-sm">{{ transaction.description || "No Description" }}</h6>
              <span class="text-xs">{{ formatDate(transaction.date) }}</span>
            </div>
          </div>
          <div
            :class="[
              'd-flex align-items-center text-sm font-weight-bold',
              transaction.type === 'income' ? 'text-success text-gradient' : 'text-danger text-gradient',
            ]"
          >
            {{ transaction.type === 'income' ? '+ ' : '- ' }}Rp {{ parseInt(transaction.amount).toLocaleString("id-ID") }}
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
