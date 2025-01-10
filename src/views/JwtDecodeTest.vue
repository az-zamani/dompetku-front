<script setup>
import { ref } from "vue";
import { jwtDecode } from "jwt-decode"; // Gunakan impor sesuai dokumentasi

// State untuk menampilkan hasil decode
const token = ref("");
const decodedToken = ref(null);
const errorMessage = ref("");

// Fungsi untuk mendekode JWT
const handleDecode = () => {
  try {
    if (!token.value) {
      errorMessage.value = "Token tidak boleh kosong!";
      decodedToken.value = null;
      return;
    }

    // Dekode token JWT
    decodedToken.value = jwtDecode(token.value);
    errorMessage.value = "";
  } catch (error) {
    errorMessage.value = "Gagal mendekode token: " + error.message;
    decodedToken.value = null;
  }
};

// Fungsi untuk memuat token dari localStorage
const loadToken = () => {
  const storedToken = localStorage.getItem("token");
  if (storedToken) {
    token.value = storedToken;
  }
};
</script>
<template>
  <div class="container mt-5">
    <h2>JWT Decode Test</h2>
    <p>Gunakan halaman ini untuk menguji fungsi jwt-decode.</p>

    <!-- Input untuk Token -->
    <div class="form-group">
      <label for="token">Token JWT:</label>
      <textarea
        id="token"
        class="form-control"
        rows="3"
        v-model="token"
        placeholder="Masukkan token JWT Anda di sini"
      ></textarea>
    </div>

    <!-- Tombol untuk Decode -->
    <button class="btn btn-primary mt-3" @click="handleDecode">Decode</button>
    <button class="btn btn-secondary mt-3 ms-2" @click="loadToken">
      Load Token dari localStorage
    </button>

    <!-- Pesan Error -->
    <p v-if="errorMessage" class="text-danger mt-3">{{ errorMessage }}</p>

    <!-- Hasil Decode -->
    <div v-if="decodedToken" class="mt-3">
      <h4>Hasil Decode:</h4>
      <pre>{{ decodedToken }}</pre>
    </div>
  </div>
</template>
