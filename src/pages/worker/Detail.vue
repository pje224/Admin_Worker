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
    <!-- 청소 사진 업로드 -->
    <div v-if="job" class="bg-white border border-gray-200 p-4">
      <div class="flex items-center justify-between mb-3">
        <p class="font-semibold">📷 청소 완료 사진</p>
        <span class="text-xs text-gray-500">{{ photos.length }}장</span>
      </div>
      <!-- 사진 그리드 -->
      <div class="grid grid-cols-3 gap-2 mb-3">
        <div
          v-for="(photo, index) in photos"
          :key="index"
          class="aspect-square rounded-lg overflow-hidden border-2 border-blue-200 relative"
        >
          <img :src="photo" alt="청소사진" class="w-full h-full object-cover" />
          <button
            @click="removePhoto(index)"
            class="cursor-pointer absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
          >
            ✕
          </button>
        </div>
        <label
          v-if="photos.length < 9"
          class="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-50 active:scale-[0.98] transition-transform"
        >
          <input type="file" accept="image/*" capture="environment" multiple class="hidden" @change="onFilesSelected" />
          <div class="text-center">
            <span class="text-2xl block mb-1">📸</span>
            <span class="text-xs text-gray-500">추가</span>
          </div>
        </label>
      </div>
      <p class="text-xs text-gray-500">작업 완료 후 사진을 촬영해주세요 (최대 9장)</p>
    </div>
    <!-- 고객 확인 서명 -->
    <div v-if="job" class="bg-white border border-gray-200 p-4">
      <div class="flex items-center justify-between mb-3">
        <p class="font-semibold">✍️ 고객 확인 서명</p>
        <button v-if="signature" @click="clearSignature" class="cursor-pointer text-xs text-red-600">삭제</button>
      </div>
      <!-- 서명 캔버스 -->
      <div class="border-2 border-dashed border-gray-300 rounded-lg p-2 mb-3">
        <!-- canvas : 그림판을 만들어주는 탭 -->
        <!-- touch-action: none : 화면이 움직이지 않도록 하는 속성 -->
        <!-- @mousedown   마우스로 꾹 누르기 시작할 때 → 그림 시작
             @mousemove   마우스를 움직일 때 → 선이 따라 그려짐
             @mouseup   마우스에서 손을 뗄 때 → 그리기 끝
             @mouseleave   캔버스 밖으로 나갔을 때 → 그리기 끝
             @touchstart   손가락으로 탭할 때 → 그림 시작
             @touchmove   손가락을 움직이면 → 선이 그려짐
             @touchend   손가락을 떼면 → 끝   -->
        <canvas
          ref="canvasRef"
          @mousedown="startDrawing"
          @mousemove="draw"
          @mouseup="stopDrawing"
          @mouseleave="stopDrawing"
          @touchstart="startDrawing"
          @touchmove="draw"
          @touchend="stopDrawing"
          class="w-full bg-white rounded border"
          style="touch-action: none"
        ></canvas>
      </div>
      <p class="text-xs text-gray-500 text-center">작업 완료 확인을 위해 고객님께 서명을 받아주세요</p>
    </div>
    <!-- 작업 완료 버튼 -->
    <div v-if="job" class="space-y-3 pb-4">
      <button
        @click="submitWork"
        :disabled="!canSubmit"
        class="cursor-pointer w-full py-4 bg-green-600 text-white rounded-xl font-semibold shadow-lg active:scale-[0.98] transition-transform disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        🎉 작업 완료 및 제출
      </button>

      <button @click="saveDraft" class="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-medium">임시 저장</button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getJobById, updateJob } from "@/data/worker_jobs";

const route = useRoute();
const router = useRouter();

// 라우터 쿼리에서 jobId 가져와서 작업 데이터 로드
const job = ref(null);
const photos = ref([]);
const signature = ref(null);
const canvasRef = ref(null);
const isDrawing = ref(false);

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
function changeJobStatus() {
  const statusOrder = ["scheduled", "onroute", "working", "done"];
  const currentIndex = statusOrder.indexOf(job.value.status);
  // console.log(currentIndex);
  if (currentIndex < statusOrder.length - 1) {
    const newStatus = statusOrder[currentIndex + 1];
    job.value.status = newStatus;
    // 공통 상태도 업데이트
    updateJob(job.value.id, { status: newStatus });
    alert(`작업 상태가 "${statusText(newStatus)}"로 변경 되었습니다.`);
  }
}
// 사진 업로드
function onFilesSelected(e) {
  const files = Array.from(e.target.files || []);
  // console.log(files);
  const readers = files.map((file) => {
    // console.log(file);

    return new Promise((resolve) => {
      // console.log(resolve);
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      // readAsDataURL() 파일을 DataURL 형식으로 읽어오는 메서드
      reader.readAsDataURL(file);
    });
  });
  // Promise.all() 모든 Promise 객체를 처리하는 메서드
  Promise.all(readers).then((list) => {
    photos.value = [...photos.value, ...list].slice(0, 9);
  });
}

// 사진 삭제
function removePhoto(index) {
  photos.value.splice(index, 1);
}

// 캔버스 초기화

onMounted(() => {
  nextTick(() => {
    if (canvasRef.value) {
      const canvas = canvasRef.value;
      const ctx = canvas.getContext("2d");
      canvas.width = 400;
      canvas.height = 200;
      // 초기배경
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // 그리기 설정
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
    }
  });
});

// 서명 기능
function startDrawing(e) {
  isDrawing.value = true;
  const canvas = canvasRef.value;
  const ctx = canvas.getContext("2d");
  // getBoundingClientRect() 요소의 뷰포트 좌표를 가져오는 메서드
  const rect = canvas.getBoundingClientRect();
  const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
  const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;

  // beginPath() 경로를 시작하는 메서드
  ctx.beginPath();
  // moveTo() 경로를 이동하는 메서드
  ctx.moveTo(x, y);
}
function draw(e) {
  if (!isDrawing.value) return;
  const canvas = canvasRef.value;
  const ctx = canvas.getContext("2d");
  const rect = canvas.getBoundingClientRect();
  const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
  const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
  ctx.lineTo(x, y); // 경로를 이동하는 메서드
  ctx.stroke(); // 경로를 그리는 메서드
  signature.value = canvas.toDataURL(); // 캔버스를 dataURL 형식으로 변환하는 메서드
}
function stopDrawing() {
  isDrawing.value = false;
  if (canvasRef.value) {
    signature.value = canvasRef.value.toDataURL();
  }
}
function clearSignature() {
  const canvas = canvasRef.value;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  signature.value = null;
}

// 작업 완료 버튼
const canSubmit = computed(() => {
  return photos.value.length > 0 && signature.value !== null;
});
function submitWork() {
  if (!canSubmit.value) {
    alert("청소 사진과 고객 서명이 필요합니다.");
    return;
  }
  if (!job.value) return;
  // 작업 완료 처리 및 공통 상태 업데이트
  updateJob(job.value.id, {
    status: "done",
    photos: [...photos.value],
  });
  alert("작업이 완료 되었습니다. 정산 내역을 확인할 수 있습니다.");
  // 작업 목록으로 이동
  router.push({ name: "MobileJobs" });
}

// 임시 저장
function saveDraft() {
  alert("임시 저장되었습니다.");
}

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
<style scoped>
canvas {
  cursor: crosshair;
}
</style>
