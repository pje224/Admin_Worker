<template>
  <div class="space-y-6 bg-white text-black dark:bg-black dark:text-white p-4 rounded">
    <h1 class="text-3xl font-bold text-gray-800 dark:text-white">기사관리</h1>
    <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">기사 정보를 관리하고 상태를 확인할 수 있습니다.</p>
    <!-- 통계카드 -->
    <DashboardStates :states="states" />
    <!-- 기사 현황 -->
    <Worker_dash />
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import DashboardStates from "../../components/DashboardStates.vue";
import Worker_dash from "@/components/Worker_dash.vue";
import { workersData } from "@/data/workers";

const Workers = ref([...workersData]);

const states = computed(() => [
  {
    title: "전체 기사",
    value: `${Workers.value.length}명`,
    // value: "15명",
    change: "+3명",
    icon: "fas fa-user-tie",
    bg: "bg-blue-100 dark:bg-blue-900",
    color: "text-blue-600 dark:text-blue-300",
  },
  {
    title: "활동중",
    value: `${Workers.value.filter((w) => w.status === "활동중").length}명`,
    change: "+1명",
    icon: "fas fa-check-circle",
    bg: "bg-green-100 dark:bg-green-900",
    color: "text-green-600 dark:text-green-300",
  },
  {
    title: "평균 평점",
    value:
      Workers.value.length > 0
        ? (Workers.value.reduce((sum, w) => sum + w.rating, 0) / Workers.value.length).toFixed(1)
        : "0.0",
    change: "+0.1",
    icon: "fas fa-star",
    bg: "bg-yellow-100 dark:bg-yellow-900",
    color: "text-yellow-600 dark:text-yellow-300",
  },
]);
</script>
