<script setup>
import { ref, reactive, onMounted } from "vue";
import axios from "@/api/axios";

// Data untuk daftar transaksi
const transactions = ref([]);

// Data untuk transaksi yang dipilih
const selectedTransaction = reactive({
  id: "",
  amount: "",
  description: "",
  type: "",
  categoryId: "",
  date: "",
});

// Data kategori
const categories = ref([]);

// Modal state
const isModalOpen = ref(false);

// Fetch semua transaksi
const fetchTransactions = async () => {
  try {
    const response = await axios.get("/transactions");
    transactions.value = response.data;
  } catch (error) {
    console.error("Error fetching transactions:", error.response?.data || error.message);
  }
};

// Fetch semua kategori
const fetchCategories = async () => {
  try {
    const response = await axios.get("/categories");
    categories.value = response.data;
  } catch (error) {
    console.error("Error fetching categories:", error.response?.data || error.message);
  }
};

const formatDateToInput = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const openModal = (transaction) => {
  Object.assign(selectedTransaction, transaction);
  selectedTransaction.date = formatDateToInput(transaction.date); // Format tanggal
  isModalOpen.value = true;
};

// Fungsi untuk menutup modal
const closeModal = () => {
  isModalOpen.value = false;
};

// Fungsi untuk memperbarui transaksi
const updateTransaction = async () => {
  try {
    const updatedData = {
      amount: selectedTransaction.amount,
      description: selectedTransaction.description,
      type: selectedTransaction.type,
      categoryId: selectedTransaction.categoryId,
      date: new Date(selectedTransaction.date).toISOString(), // Format ke ISO
    };

    await axios.patch(`/transactions/${selectedTransaction._id}`, updatedData);

    alert("Transaksi berhasil diperbarui!");
    fetchTransactions(); // Refresh daftar transaksi
    closeModal(); // Tutup modal
  } catch (error) {
    console.error("Error updating transaction:", error.response?.data || error.message);
    alert(error.response?.data?.message || "Gagal memperbarui transaksi.");
  }
};

// Fungsi untuk menghapus transaksi
const deleteTransaction = async (id) => {
  try {
    const confirmed = confirm("Apakah Anda yakin ingin menghapus transaksi ini?");
    if (!confirmed) return;

    await axios.delete(`/transactions/${id}`);
    alert("Transaksi berhasil dihapus!");
    fetchTransactions(); // Refresh daftar transaksi
  } catch (error) {
    console.error("Error deleting transaction:", error.response?.data || error.message);
    alert(error.response?.data?.message || "Gagal menghapus transaksi.");
  }
};

// Fetch data saat komponen di-mount
onMounted(() => {
  fetchTransactions();
  fetchCategories();
});
</script>

<template>
  <div class="card">
    <div class="card-header pb-0">
      <h6>Daftar Transaksi</h6>
    </div>
    <div class="card-body px-0 pt-0 pb-2">
      <div class="table-responsive p-0">
        <table class="table align-items-center mb-0">
          <thead>
            <tr>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Tanggal</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Deskripsi</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Kategori</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Jenis</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Jumlah</th>
              <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="transaction in transactions" :key="transaction.id">
              <td>
                <span class="text-sm font-weight-bold mb-0">
                  {{ new Date(transaction.date).toLocaleDateString() }}
                </span>
              </td>
              <td>
                <p class="text-sm font-weight-bold mb-0">
                  {{ transaction.description || "Tidak ada deskripsi" }}
                </p>
              </td>
              <td>
                <p class="text-sm font-weight-bold mb-0">
                  {{ categories.find((cat) => cat._id === transaction.categoryId)?.name || "Tidak Diketahui" }}
                </p>
              </td>
              <td>
                <span class="text-sm font-weight-bold">
                  {{ transaction.type === "income" ? "Pemasukan" : "Pengeluaran" }}
                </span>
              </td>
              <td>
                <p class="text-sm font-weight-bold mb-0">Rp {{ parseInt(transaction.amount).toLocaleString("id-ID") }}</p>
              </td>
              <td>
                <button class="btn btn-link text-secondary mb-0" @click="openModal(transaction)">
                  <i class="fa fa-edit text-xs" aria-hidden="true"></i> Edit
                </button>
                <button class="btn btn-link text-danger mb-0" @click="deleteTransaction(transaction._id)">
                  <i class="fa fa-trash text-xs" aria-hidden="true"></i> Hapus
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="isModalOpen" class="modal d-block" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Edit Transaksi</h5>
            <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="updateTransaction">
              <div class="form-group">
                <label for="amount">Jumlah</label>
                <input
                  v-model="selectedTransaction.amount"
                  type="number"
                  class="form-control"
                  id="amount"
                  required
                />
              </div>
              <div class="form-group">
                <label for="description">Deskripsi</label>
                <input
                  v-model="selectedTransaction.description"
                  type="text"
                  class="form-control"
                  id="description"
                />
              </div>
              <div class="form-group">
                <label for="type">Jenis</label>
                <select v-model="selectedTransaction.type" class="form-control" id="type" required>
                  <option value="income">Pemasukan</option>
                  <option value="expense">Pengeluaran</option>
                </select>
              </div>
              <div class="form-group">
                <label for="categoryId">Kategori</label>
                <select
                  v-model="selectedTransaction.categoryId"
                  class="form-control"
                  id="categoryId"
                  required
                >
                  <option v-for="category in categories" :key="category._id" :value="category._id">
                    {{ category.name }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label for="date">Tanggal</label>
                <input
                  v-model="selectedTransaction.date"
                  type="date"
                  class="form-control"
                  id="date"
                  required
                />
              </div>
              <button type="submit" class="btn btn-success">Simpan</button>
              <button type="button" class="btn btn-secondary" @click="closeModal">Batal</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
