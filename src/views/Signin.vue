<script setup>
import { onBeforeUnmount, onBeforeMount, ref } from "vue";
import { useStore } from "vuex";
import Navbar from "@/examples/PageLayout/Navbar.vue";
import ArgonInput from "@/components/ArgonInput.vue";
// import ArgonSwitch from "@/components/ArgonSwitch.vue";
import ArgonButton from "@/components/ArgonButton.vue";
import axios from "@/api/axios";
const body = document.getElementsByTagName("body")[0];
const email = ref('');
const password = ref('');

const handleSignIn = async () => {
  if (!email.value || !password.value) {
    alert("Email dan password wajib diisi!");
    return;
  }

  try {
    const response = await axios.post("/auth/login", {
      email: email.value,
      password: password.value,
    });

    const { access_token } = response.data;

    // Simpan token ke localStorage
    localStorage.setItem("token", access_token);

    // Redirect ke halaman dashboard
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 5000); // Tambahkan delay kecil untuk memastikan token disimpan
  } catch (error) {
    console.error("Login failed:", error.response?.data || error.message);
    alert("Login gagal. Silakan periksa kembali email dan password Anda.");
  }
};

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
</script>
<template>
  <div class="container top-0 position-sticky z-index-sticky">
    <div class="row">
      <div class="col-12">
        <navbar
          isBlur="blur  border-radius-lg my-3 py-2 start-0 end-0 mx-4 shadow"
          v-bind:darkMode="true"
          isBtn="bg-gradient-success"
        />
      </div>
    </div>
  </div>
  <main class="mt-0 main-content">
    <section>
      <div class="page-header min-vh-100">
        <div class="container">
          <div class="row">
            <div
              class="mx-auto col-xl-4 col-lg-5 col-md-7 d-flex flex-column mx-lg-0"
            >
              <div class="card card-plain">
                <div class="pb-0 card-header text-start">
                  <h4 class="font-weight-bolder">Sign In</h4>
                  <p class="mb-0">Masukkan Email dan Password anda</p>
                </div>
                <div class="card-body">
                  <form @submit.prevent="handleSignIn" role="form">
                      <div class="mb-3">
                        <argon-input
                          id="email"
                          type="email"
                          placeholder="Email"
                          name="email"
                          size="lg"
                          v-model="email"
                        />
                      </div>
                      <div class="mb-3">
                        <argon-input
                          id="password"
                          type="password"
                          placeholder="Password"
                          name="password"
                          size="lg"
                          v-model="password"
                        />
                      </div>

                      <div class="text-center">
                        <argon-button
                          class="mt-4"
                          variant="gradient"
                          color="success"
                          fullWidth
                          size="lg"
                        >
                          Sign in
                        </argon-button>
                      </div>
                    </form>

                </div>
                <div class="px-1 pt-0 text-center card-footer px-lg-2">
                  <p class="mx-auto mb-4 text-sm">
                    Tidak Memiliki Akun?
                    <a
                      href="/signup"
                      class="text-success text-gradient font-weight-bold"
                      >Daftar</a
                    >
                  </p>
                </div>
              </div>
            </div>
            <div
              class="top-0 my-auto text-center col-6 d-lg-flex d-none h-100 pe-0 position-absolute end-0 justify-content-center flex-column"
            >
              <div
                class="position-relative bg-gradient-primary h-100 m-3 px-7 border-radius-lg d-flex flex-column justify-content-center overflow-hidden"
                style="
                  background-image: url(&quot;https://raw.githubusercontent.com/creativetimofficial/public-assets/master/argon-dashboard-pro/assets/img/signin-ill.jpg&quot;);
                  background-size: cover;
                "
              >
                <span class="mask bg-gradient-success opacity-6"></span>
                <h4
                  class="mt-5 text-white font-weight-bolder position-relative"
                >
                  "Manage your money, or it will manage you"
                </h4>
                <p class="text-white position-relative">
                  Jangan biarkan uang menguasai hidupmu, sebaliknya,
                  kuasailah uangmu agar dapat menjalani hidup sesuai dengan nilai dan tujuanmu.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
