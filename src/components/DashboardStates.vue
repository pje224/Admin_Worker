<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
    <div
      v-for="(card, index) in states"
      :key="index"
      class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-lg transition-shadow"
    >
      <div class="flex items-center">
        <div :class="`w-12 h-12 ${card.bg} rounded-lg flex items-center justify-center`">
          <i :class="`${card.icon} ${card.color} text-xl`"></i>
        </div>
        <div class="ml-4">
          <p class="text-gray-500 dark:text-gray-400 text-sm">{{ card.title }}</p>
          <p class="text-2xl font-bold text-gray-800 dark:text-white">{{ card.value }}</p>
          <span class="text-sm text-green-600 dark:text-green-400">{{ card.change }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  states: {
    type: Array, // 배열 타입
    required: true, // 필수 속성 (반드시 전달돼야 함)
    default: () => [], // 기본값 []배열로 초기화
  },
});
</script>

<style scoped></style>
