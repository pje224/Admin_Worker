<template>
  <div>
    <!-- 로딩중 -->
    <div v-if="!job" class="p-4 text-center text-gray-500">작업 정보를 불러오는 중...</div>
    <!-- 작업 정보 요약 카드 -->
    <div v-else class="bg-linear-to-t from-purple-600 via-pink-400 to-blue-500 p-5 text-white shadow-lg">
      <div class="flex items-start justify-between mb-4">
        <div>
          <p class="text-sm opacity-90 mb-1">청소 작업</p>
          <p class="text-2xl font-bold">{{ job.storeName }}</p>
        </div>
        <div class="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-2xl">🧹</div>
      </div>
      <div class="bg-white/20 rounded-lg p-3 text-sm">
        <p class="font-medium mb-1">📍 {{ job.address }}</p>
        <p class="text-xs opacity-90">🕐 {{ job.time }}</p>
      </div>
    </div>
    <!-- 작업 정보 상세 -->
    <div v-if="job" class="bg-white border border-gray-200 p-4 space-y-3">
      <p class="font-semibold mb-3">📋 작업 정보</p>
      <div class="grid grid-cols-2 gap-2 text-sm">
        <div class="bg-blue-50 rounded-lg p-3">
          <p class="text-gray-500 text-xs mb-1">매장 유형</p>
          <p class="font-semibold text-blue-700">
            {{ job.type === "store" ? "매장" : "오피스" }}
          </p>
        </div>
        <div class="bg-green-50 rounded-lg p-3">
          <p class="text-gray-500 text-xs mb-1">청소 금액</p>
          <p class="font-semibold text-green-700">₩{{ job.price.toLocaleString() }}</p>
        </div>
      </div>
      <div v-if="job.memo" class="bg-orange-50 border border-orange-200 rounded-lg p-3">
        <p class="text-orange-600 text-xs mb-1">📌 특이사항</p>
        <p class="text-sm font-medium text-gray-900">{{ job.memo }}</p>
      </div>
    </div>
    <!-- 길찾기 및 상태 변경 버튼 -->
    <div v-if="job && job.status !== 'done'" class="bg-white border border-gray-200 p-4">
      <div class="grid grid-cols-2 gap-3">
        <a
          :href="mapLink(job.address)"
          class="flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 text-white font-medium shadow active:scale-[0.98] transition-transform"
        >
          <span>🗺️</span>
          <span class="text-white">길찾기</span>
        </a>
        <button
          @click="changeJobStatus"
          class="cursor-pointer flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-50 text-blue-700 font-medium border border-blue-200 active:scale-[0.98] transition-transform"
        >
          <span>↻</span>
          <span>{{ getNextStatus(job.status) }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getJobById, updateJob } from "@/data/worker_jobs";

const route = useRoute();
const router = useRouter();

// 라우터 쿼리에서 jobId 가져와서 작업 데이터 로드
const job = ref(null);
// jobId 변경 시 작업 데이터 로드
function loadJob() {
  const jobId = route.query.jobId;
  if (jobId) {
    const foundJob = getJobById(jobId);
    if (foundJob) {
      // console.log(foundJob);
      job.value = JSON.parse(JSON.stringify(foundJob));
    } else {
      // 작업을 찾을 수 없으면 목록으로 이동
      router.push({ name: "WorkerDetail" });
    }
  }
}

// 길찾기 링크 생성
function mapLink(address) {
  const q = encodeURIComponent(address);
  return `https://map.kakao.com/?q=${q}`;
}

// 상태 텍스트 변환
function statusText(status) {
  switch (status) {
    case "scheduled":
      return "예약";
    case "onroute":
      return "이동중";
    case "working":
      return "작업중";
    case "done":
      return "완료";
    default:
      return status;
  }
}

// 다음 상태 텍스트 가져오기
function getNextStatus(currentStatus) {
  const statusOrder = ["scheduled", "onroute", "working", "done"];
  const cIndex = statusOrder.indexOf(currentStatus);
  if (cIndex < statusOrder.length - 1) {
    const nextStatus = statusOrder[cIndex + 1];
    return `→ ${statusText(nextStatus)}`;
  }
}

// 작업 상태 변경 함수
function changeJobStatus() {}

// 초기 로드 및 라우트 변경 감지
onMounted(() => {
  loadJob();
});
watch(
  () => route.query.jobId,
  () => {
    loadJob();
  }
);
</script>
