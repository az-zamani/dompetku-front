<script setup>
defineProps({
  btnBackground: {
    type: String,
    default: "",
  },
  isBlur: {
    type: String,
    default: "",
  },
  darkMode: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <!-- Navbar -->
  <nav
    class="navbar navbar-expand-lg top-0 z-index-3 position-absolute mt-4 w-100"
    :class="isBlur ? isBlur : 'shadow-none navbar-transparent'"
  >
    <div class="container d-flex justify-content-between align-items-center">
      <!-- Logo -->
      <router-link
        class="navbar-brand font-weight-bolder"
        :class="darkMode ? 'text-black' : 'text-white'"
        to="/"
      >
        Dompetku
      </router-link>

      <!-- Menu -->
      <div
        class="d-flex justify-content-center align-items-center gap-4"
      >
        <router-link
          class="nav-link d-flex align-items-center"
          :class="isBlur ? 'text-dark' : 'text-white'"
          to="/signup"
        >
          <i class="fas fa-user-circle me-1" aria-hidden="true"></i>
          Sign Up
        </router-link>
        <router-link
          class="nav-link d-flex align-items-center"
          :class="isBlur ? 'text-dark' : 'text-white'"
          to="/signin"
        >
          <i class="fas fa-key me-1" aria-hidden="true"></i>
          Sign In
        </router-link>
      </div>
    </div>
  </nav>
  <!-- End Navbar -->
</template>
