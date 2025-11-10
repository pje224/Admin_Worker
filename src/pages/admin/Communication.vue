<template>
  <div class="space-y-6 bg-white text-black dark:bg-black dark:text-white p-4 rounded">
    <h1 class="text-3xl font-bold text-gray-800 dark:text-white">고객 소통</h1>
    <!-- 통계카드 -->
    <DashboardStates :states="states" />
  </div>
</template>

<script setup>
import DashboardStates from "../../components/DashboardStates.vue";
</script>

<style scoped></style>
