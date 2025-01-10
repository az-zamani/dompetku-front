import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import Tables from "../views/Tables.vue";
import Billing from "../views/Billing.vue";
import VirtualReality from "../views/VirtualReality.vue";
import RTL from "../views/Rtl.vue";
import Profile from "../views/Profile.vue";
import Signup from "../views/Signup.vue";
import Signin from "../views/Signin.vue";
import DashboardRecap from '@/views/DashboardRecap.vue';
import TransactionForm from '@/views/TransactionForm.vue';
import JwtDecodeTest from "@/views/JwtDecodeTest.vue";

const routes = [
  {
    path: "/",
    name: "/",
    redirect: "/signin",
    meta: { title: "Dompetku - Sign In" },
  },
  {
    path: "/dashboard-default",
    name: "DashboardDefault",
    component: Dashboard,
    meta: { title: "Dompetku - Dashboard Default" },
  },
  {
    path: "/tables",
    name: "Tables",
    component: Tables,
    meta: { title: "Dompetku - Tables" },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: DashboardRecap,
    meta: { title: "Dompetku - Dashboard Recap" },
  },
  {
    path: "/transactions/add",
    name: "AddTransaction",
    component: TransactionForm,
    meta: { title: "Dompetku - Add Transaction" },
  },
  {
    path: "/recap",
    name: "Recap",
    component: Billing,
    meta: { title: "Dompetku - Recap" },
  },
  {
    path: "/virtual-reality",
    name: "Virtual Reality",
    component: VirtualReality,
    meta: { title: "Dompetku - Virtual Reality" },
  },
  {
    path: "/rtl-page",
    name: "RTL",
    component: RTL,
    meta: { title: "Dompetku - RTL Page" },
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    meta: { title: "Dompetku - Profile" },
  },
  {
    path: "/signin",
    name: "Signin",
    component: Signin,
    meta: { title: "Dompetku - Sign In" },
  },
  {
    path: "/jwt-decode-test",
    name: "JwtDecodeTest",
    component: JwtDecodeTest,
    meta: { title: "Dompetku - JWT Decode Test" },
  },
  {
    path: "/signup",
    name: "Signup",
    component: Signup,
    meta: { title: "Dompetku - Sign Up" },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: "active",
});

// Tambahkan logika untuk mengatur judul halaman
router.afterEach((to) => {
  document.title = to.meta.title || "Dompetku";
});

export default router;
