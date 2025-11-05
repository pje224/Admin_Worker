<template>
  <!-- min-h-screen : 최소 100vh -->
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-8">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 class="text-center text-2xl font-bold text-gray-800 mb-8">로그인</h2>
      <!-- space-y 자식간의 간격을 띄우는 것 -->
      <form @submit.prevent="handleLogin" class="space-y-6">
        <div class="space-y-2">
          <label for="email" class="block text-sm font-medium text-gray-700">이메일</label>
          <input
            type="email"
            id="email"
            placeholder="이메일을 입력해 주세요"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div class="space-y-2">
          <label for="password" class="block text-sm font-medium text-gray-700">비밀번호</label>
          <div class="relative">
            <input
              v-model="password"
              id="password"
              placeholder="비밀번호를 입력해 주세요"
              :type="showPassword ? 'text' : 'password'"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="button"
              @click="togglePassword"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
            >
              {{ showPassword ? "숨기기" : "보기" }}
            </button>
          </div>
        </div>
        <!-- w-full : 100% -->
        <button
          type="submit"
          class="w-full py-3 bg-green-500 text-white font-medium rounded-md hover:bg-green-600 transition-colors duration-200"
        >
          로그인
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const password = ref("");
const showPassword = ref(false);
const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const handleLogin = () => {
  router.push("admin/dashboard");
};
</script>

<style scoped></style>
