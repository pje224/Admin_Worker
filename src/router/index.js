import Admin_Home from "@/pages/admin/Admin_Home.vue";
import Communication from "@/pages/admin/Communication.vue";
import Customers from "@/pages/admin/Customers.vue";
import Dashboard_admin from "@/pages/admin/Dashboard_admin.vue";
import Inquiries from "@/pages/admin/Inquiries.vue";
import Login_admin from "@/pages/admin/Login_admin.vue";
import Reservations from "@/pages/admin/Reservations.vue";
import Settings from "@/pages/admin/Settings.vue";
import Worker_admin from "@/pages/admin/Worker_admin.vue";
import Calendar from "@/pages/worker/Calendar.vue";
import Dashboard_worker from "@/pages/worker/Dashboard_worker.vue";
import Jobs from "@/pages/worker/Jobs.vue";
import Login_worker from "@/pages/worker/Login_worker.vue";
import Payment from "@/pages/worker/Payment.vue";
import HomeVue from "@/views/Home.vue";
import ReserVue from "@/views/Reser.vue";
import ReviewVue from "@/views/Review.vue";
import { createRouter, createWebHistory } from "vue-router";
const routes = [
  { path: "/", component: HomeVue, name: "HomeVue" },
  { path: "/reser", component: ReserVue, name: "ReserVue" },
  { path: "/review", component: ReviewVue, name: "ReviewVue" },
  // 관리자 페이지
  { path: "/admin", component: Login_admin, name: "Login_admin" },
  {
    path: "/admin",
    component: Admin_Home,
    redirect: "admin/dashboard",
    children: [
      { path: "dashboard", component: Dashboard_admin },
      { path: "reservations", component: Reservations },
      { path: "workers", component: Worker_admin },
      { path: "customers", component: Customers },
      { path: "inquiries", component: Inquiries },
      { path: "communication", component: Communication },
      { path: "settings", component: Settings },
    ],
  },
  // 기사 페이지
  { path: "/worker", component: Login_worker, name: "Login_worker" },
  {
    path: "/worker/dashboard",
    component: Dashboard_worker,
    redirect: "worker/dashboard/jobs",
    children: [
      { path: "jobs", component: Jobs, name: "MobileJobs" },
      { path: "calendar", component: Calendar, name: "MobileCalendar" },
      { path: "payment", component: Payment, name: "MobilePayment" },
    ],
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
