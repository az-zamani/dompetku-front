<script setup>
import { onBeforeUnmount, onBeforeMount } from "vue";
import { useStore } from "vuex";
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "@/api/axios";

import Navbar from "@/examples/PageLayout/Navbar.vue";
import AppFooter from "@/examples/PageLayout/Footer.vue";
import ArgonInput from "@/components/ArgonInput.vue";
// import ArgonCheckbox from "@/components/ArgonCheckbox.vue";
import ArgonButton from "@/components/ArgonButton.vue";
const body = document.getElementsByTagName("body")[0];

const store = useStore();
onBeforeMount(() => {
  store.state.hideConfigButton = true;
  store.state.showNavbar = false;
  store.state.showSidenav = false;
  store.state.showFooter = false;
  body.classList.remove("bg-gray-100");
});
onBeforeUnmount(() => {
  store.state.hideConfigButton = false;
  store.state.showNavbar = true;
  store.state.showSidenav = true;
  store.state.showFooter = true;
  body.classList.add("bg-gray-100");
});

const email = ref("");
const password = ref("");
const errorMessage = ref("");
const router = useRouter();

// Fungsi untuk handle registrasi
const handleRegister = async () => {
  errorMessage.value = ""; // Reset pesan error
  if (!email.value || !password.value) {
    errorMessage.value = "Email dan Password tidak boleh kosong!";
    return;
  }

  try {
    await axios.post("/auth/register", { email: email.value, password: password.value });
    alert("Registrasi berhasil! Silakan login.");
    router.push("/signin"); // Redirect ke halaman login
  } catch (error) {
    console.error("Error during registration:", error);
    errorMessage.value =
      error.response?.data?.message || "Terjadi kesalahan saat registrasi.";
  }
};
</script>
<template>
  <div class="container top-0 position-sticky z-index-sticky">
    <div class="row">
      <div class="col-12">
        <navbar isBtn="bg-gradient-light" />
      </div>
    </div>
  </div>
  <main class="main-content mt-0">
    <div
      class="page-header align-items-start min-vh-50 pt-5 pb-11 m-3 border-radius-lg"
      style="
        background-image: url('https://raw.githubusercontent.com/creativetimofficial/public-assets/master/argon-dashboard-pro/assets/img/signup-cover.jpg');
        background-position: top;
      "
    >
      <span class="mask bg-gradient-dark opacity-6"></span>
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-5 text-center mx-auto">
            <h1 class="text-white mb-2 mt-5">Welcome!</h1>
            <p class="text-lead text-white">
              Buat akun anda dan mulai Managemen Uang
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="row mt-lg-n10 mt-md-n11 mt-n10 justify-content-center">
        <div class="col-xl-4 col-lg-5 col-md-7 mx-auto">
          <div class="card z-index-0 shadow-lg">
            <div class="card-header text-center pt-4">
              <h5>Register</h5>
            </div>
            <div class="card-body">
              <form @submit.prevent="handleRegister">
                <!-- Input Email -->
                <argon-input
                  v-model="email"
                  id="email"
                  type="email"
                  placeholder="Email"
                  aria-label="Email"
                  class="mb-3"
                />

                <!-- Input Password -->
                <argon-input
                  v-model="password"
                  id="password"
                  type="password"
                  placeholder="Password"
                  aria-label="Password"
                  class="mb-3"
                />

                <!-- Pesan Error -->
                <p v-if="errorMessage" class="text-danger text-center">
                  {{ errorMessage }}
                </p>

                <!-- Tombol Registrasi -->
                <div class="text-center">
                  <argon-button
                    fullWidth
                    color="dark"
                    variant="gradient"
                    class="my-4 mb-2"
                  >
                    Sign up
                  </argon-button>
                </div>

                <p class="text-sm mt-3 mb-0 text-center">
                  Sudah memiliki Akun?
                  <router-link to="/signin" class="text-dark font-weight-bolder"
                    >Masuk</router-link
                  >
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
  <app-footer />
</template>
