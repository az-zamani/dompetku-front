<script setup>
// import DefaultInfoCard from "@/examples/Cards/DefaultInfoCard.vue";
import { ref, reactive } from "vue";
import { jwtDecode } from "jwt-decode"; // Perbaikan impor jwt-decode
import axios from "@/api/axios";
// import { format } from "date-fns"; // Pastikan date-fns sudah diinstal

// Data untuk form transaksi
const form = reactive({
  amount: "",
  description: "",
  type: "",
  categoryId: "",
  date: "",
});


// Fungsi untuk format ke Rupiah
// const formatRupiah = (angka) => {
//   return new Intl.NumberFormat("id-ID", {
//     style: "currency",
//     currency: "IDR",
//   }).format(angka);
// };

// Data untuk kategori
const categories = ref([]); // Daftar kategori
const newCategory = ref(""); // Nama kategori baru
const showNewCategoryInput = ref(false); // Tampilkan input kategori baru

// Total pemasukan dan pengeluaran
const totalIncome = ref(0);
const totalExpense = ref(0);
const transactions = ref([]);

// Fetch kategori
const fetchCategories = async () => {
  try {
    const response = await axios.get("/categories");
    categories.value = response.data;
  } catch (error) {
    console.error("Error fetching categories:", error.response?.data || error.message);
  }
};

// Buat kategori baru
const handleCreateCategory = async () => {
  if (!newCategory.value.trim()) {
    alert("Nama kategori tidak boleh kosong!");
    return;
  }

  try {
    const response = await axios.post("/categories", { name: newCategory.value });
    alert("Kategori berhasil dibuat!");

    // Tambahkan kategori baru ke daftar kategori
    categories.value.push(response.data);

    // Reset input kategori baru
    newCategory.value = "";
    showNewCategoryInput.value = false;
  } catch (error) {
    console.error("Error creating category:", error.response?.data || error.message);
    alert("Gagal membuat kategori.");
  }
};

// Submit Form
const handleSubmit = async () => {
  if (!form.amount || !form.type || !form.categoryId) {
    alert("Harap isi semua field!");
    return;
  }

  // Validasi tambahan
  if (form.amount <= 0) {
    alert("Jumlah harus lebih besar dari nol.");
    return;
  }

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Anda harus login terlebih dahulu!");
      return;
    }

    const decoded = jwtDecode(token); // Dekode token untuk mendapatkan userId
    const userId = decoded?.sub;

    if (!userId) {
      alert("Token tidak valid atau userId tidak ditemukan.");
      return;
    }

    const transactionData = {
      ...form,
      userId, // Tambahkan userId ke data transaksi
      date: form.date ? new Date(form.date).toISOString() : undefined, // Format ISO
    };

    console.log("Data yang dikirim ke backend:", transactionData);

    await axios.post("/transactions", transactionData);
    alert("Transaksi berhasil ditambahkan!");

    // Reset form
    form.amount = "";
    form.description = "";
    form.type = "";
    form.categoryId = "";
    form.date = "";

    fetchTransactions(); // Refresh data transaksi
  } catch (error) {
    console.error("Error submitting transaction:", error.response?.data || error.message);
    alert(error.response?.data?.message || "Gagal menambahkan transaksi.");
  }
};

// Fetch data transaksi
const fetchTransactions = async () => {
  try {
    const response = await axios.get("/transactions");
    transactions.value = response.data;

    // Hitung total pemasukan dan pengeluaran
    totalIncome.value = transactions.value
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    totalExpense.value = transactions.value
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
  } catch (error) {
    console.error("Error fetching transactions:", error.response?.data || error.message);
  }
};

// Fetch data saat komponen di-mount
fetchCategories();
fetchTransactions();
</script>
<template>
  <div class="container-fluid">
    <!-- Rekap Data -->
    <!-- <div class="row mt-4">
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
    </div> -->

    <!-- Form Transaksi -->
    <div class="row mt-4">
      <div class="col-lg-12">
        <div class="card p-4">
          <h4 class="text-center">Tambah Transaksi</h4>
          <form @submit.prevent="handleSubmit">
            <div class="mb-3">
              <input
                v-model="form.amount"
                type="number"
                placeholder="Jumlah"
                class="form-control"
                required
              />
            </div>
            <div class="mb-3">
              <input
                v-model="form.description"
                type="text"
                placeholder="Deskripsi"
                class="form-control"
              />
            </div>
            <div class="mb-3">
              <select v-model="form.type" class="form-select" required>
                <option value="" disabled>Pilih Jenis Transaksi</option>
                <option value="income">Pemasukan</option>
                <option value="expense">Pengeluaran</option>
              </select>
            </div>
            <div class="mb-3">
              <select v-model="form.categoryId" class="form-select" required>
                <option value="" disabled>Pilih Kategori</option>
                <option v-for="category in categories" :key="category._id" :value="category._id">
                  {{ category.name }}
                </option>
                <option value="new">+ Tambah Kategori Baru</option>
              </select>
            </div>

            <!-- Input Kategori Baru -->
            <div v-if="form.categoryId === 'new'" class="mb-3">
              <input
                v-model="newCategory"
                type="text"
                placeholder="Nama Kategori Baru"
                class="form-control"
              />
              <button type="button" class="btn btn-secondary mt-2" @click="handleCreateCategory">
                Buat Kategori
              </button>
            </div>

            <div class="mb-3">
              <input v-model="form.date" type="date" class="form-control" required />
            </div>
            <button type="submit" class="btn btn-success w-100">Tambah Transaksi</button>
          </form>
        </div>
      </div>
    </div>

    <!-- Daftar Transaksi -->
    

  </div>
</template>
