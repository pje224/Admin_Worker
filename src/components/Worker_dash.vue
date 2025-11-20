<template>
  <!-- 기사 현황 (공통 컴포넌트 사용) -->
  <SearchTable
    :data="Workers"
    search-place-holder="기사명 또는 연락처로 검색.."
    :filter-options="workerFilterOptions"
    :search-fields="['name', 'phone']"
    table-title="기사 현황"
    :columns="workerColumns"
    :items-per-page="itemsPerPage"
    totallabel="명의 기사"
    :filter-fn="workerFilterFn"
    @row-click="handleWorkerRowClick"
  />
  <!-- 기사 상세 모달 -->
  <div
    v-if="selectedWorker"
    @click="closeModal"
    class="modal fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50"
  >
    <div
      @click.stop
      class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
    >
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">기사 상세 정보</h3>
          <button @click="closeModal" class="cursor-pointer text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- 기본정보 -->
            <div class="space-y-6">
              <div>
                <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">기본 정보</h4>
                <div class="space-y-2">
                  <div class="flex items-center">
                    <label class="w-32 text-sm font-medium text-gray-700 dark:text-gray-300">기사 ID</label>
                    <span class="text-sm text-gray-900 dark:text-white"> {{ selectedWorker.id }} </span>
                  </div>
                  <div class="flex items-center">
                    <label class="w-32 text-sm font-medium text-gray-700 dark:text-gray-300">이름</label>
                    <!-- <input
                      type="text"
                      class="ml-2 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    /> -->
                    <span>
                      {{ selectedWorker.name }}
                    </span>
                  </div>
                  <div class="flex items-center">
                    <label class="w-32 text-sm font-medium text-gray-700 dark:text-gray-300">연락처</label>
                    <input
                      v-model="selectedWorker.phone"
                      type="tel"
                      class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div class="flex items-center">
                    <label class="w-32 text-sm font-medium text-gray-700 dark:text-gray-300">평점</label>
                    <!-- step: 0.1 소수점 한자리까지 입력가능 -->
                    <input
                      v-model="selectedWorker.rating"
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div class="flex items-center">
                    <label class="w-32 text-sm font-medium text-gray-700 dark:text-gray-300">상태</label>
                    <select
                      v-model="selectedWorker.status"
                      class="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="활동중">활동중</option>
                      <option value="비활성화">비활성화</option>
                    </select>
                  </div>
                </div>
              </div>
              <div>
                <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">담당 예약</h4>
                <div class="space-y-2">
                  <div class="flex items-center">
                    <label class="w-32 text-sm font-medium text-gray-700 dark:text-gray-300">현재 예약</label>
                    <span class="text-sm text-gray-900 dark:text-white">{{ selectedWorker.reservations }}</span>
                  </div>
                  <div class="flex items-center">
                    <label class="w-32 text-sm font-medium text-gray-700 dark:text-gray-300">총 예약</label>

                    <span class="text-sm text-gray-900 dark:text-white">{{ selectedWorker.totalreser }}</span>
                  </div>
                </div>
              </div>
              <!-- 추가 정보 -->
            </div>
            <div class="space-y-6">
              <div>
                <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">활동 정보</h4>
                <div class="space-y-2">
                  <div class="flex items-center">
                    <label class="w-32 text-sm font-medium text-gray-700 dark:text-gray-300">가입일</label>
                    <span class="text-sm text-gray-900 dark:text-white">{{ selectedWorker.joinDate }}</span>
                  </div>
                  <div class="flex items-center">
                    <label class="w-32 text-sm font-medium text-gray-700 dark:text-gray-300">마지막 활동</label>
                    <span class="text-sm text-gray-900 dark:text-white">{{ selectedWorker.lastActivity }}</span>
                  </div>
                  <div class="flex items-center">
                    <label class="w-32 text-sm font-medium text-gray-700 dark:text-gray-300">활동 지역</label>
                    <input
                      v-model="selectedWorker.area"
                      type="text"
                      class="ml-2 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">메모</h4>
                <textarea
                  v-model="selectedWorker.memo"
                  rows="3"
                  class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="기사에 대한 메모를 입력하세요"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700 flex justify-end space-x-3">
        <button
          @click="closeModal"
          class="cursor-pointer px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
        >
          닫기
        </button>
        <button
          @click="saveWorker"
          class="cursor-pointer px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          저장
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import SearchTable from "@/components/SearchTable.vue";
import { workersData } from "@/data/workers";

// 기사 목록 더미 데이터 > 외부 파일에서 가져오기
const Workers = ref([...workersData]);

const selectedWorker = ref(null);

// 필터 옵션
const workerFilterOptions = [
  {
    key: "statusFilter",
    options: [
      { value: "", label: "전체 상태" },
      { value: "활동중", label: "활동중" },
      { value: "비활성화", label: "비활성화" },
    ],
  },
  {
    key: "ratingFilter",
    options: [
      { value: "", label: "전체 평점" },
      { value: "4", label: "4점 이상" },
      { value: "3", label: "3점 이상" },
    ],
  },
];

// 테이블 칼럼 정의
const workerColumns = [
  { label: "기사ID", key: "id" },
  { label: "이름", key: "name" },
  { label: "연락처", key: "phone" },
  {
    label: "평점",
    key: "rating",
    render: (item) =>
      `<div class="flex items-center"><span class="text-yellow-400 mr-1"><i class="fas fa-star"></i></span>${item.rating}</div>`,
  },
  {
    label: "현재상태",
    key: "status",
    render: (item) =>
      `<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(item.status)}">${
        item.status
      }</span>`,
  },
  { label: "담당예약", key: "reservations" },
  {
    label: "액션",
    key: "action",
    render: (item) => {
      const detailBtn = `<button onclick="window.handleWorkerDetail('${item.id}')" class="cursor-pointer text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-3"><i class="fas fa-eye mr-1"></i>상세</button>`;
      const toggleBtn = `<button onclick="window.handleWorkerToggle('${item.id}')" class="cursor-pointer mr-3 ${
        item.status === "활동중"
          ? "text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
          : "text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300"
      }"><i class="${item.status === "활동중" ? "fas fa-ban" : "fas fa-check"}" class="mr-1"></i>${
        item.status === "활동중" ? "비활성화" : "활성화"
      }</button>`;
      return detailBtn + toggleBtn;
    },
  },
];

// 예약 상태 css
// 상태 css
const getStatusClass = (status) => {
  const statusClasses = {
    활동중: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300",
    비활성화: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300",
  };
  return statusClasses[status] || "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-300";
};

// 커스텀 필터 함수
const workerFilterFn = (data, filters) => {
  let result = [...data];
  // console.log(result);
  // console.log(filters);

  // 상태 필터링
  if (filters.statusFilter) {
    result = result.filter((worker) => worker.status === filters.statusFilter);
  }

  // 평점 필터링
  if (filters.ratingFilter) {
    result = result.filter((worker) => worker.rating >= parseFloat(filters.ratingFilter));
  }

  return result;
};

// 기사 상세 모달
const showWorkerDetails = (worker) => {
  selectedWorker.value = { ...worker };
};

// 행 클릭 핸들러
const handleWorkerRowClick = (item) => {
  showWorkerDetails(item);
};

// 전역 함수로 등록
window.handleWorkerDetail = (id) => {
  const worker = Workers.value.find((w) => w.id === id);
  if (worker) {
    showWorkerDetails(worker);
  }
};

// 모달창 닫기
const closeModal = () => {
  selectedWorker.value = null;
};

// 기사 정보 저장
const saveWorker = () => {
  // 기존 기사 목록에서 해당 ID기사 찾기
  const index = Workers.value.findIndex((w) => w.id === selectedWorker.value.id);
  if (index !== -1) {
    Workers.value[index] = { ...selectedWorker.value };
  }
  closeModal();
};
// 기사 상태 토글 함수
const toggleWorkerStatus = (worker) => {
  const index = Workers.value.findIndex((w) => w.id === worker.id);
  if (index !== -1) {
    Workers.value[index].status = worker.status === "활동중" ? "비활성화" : "활동중";
  }
};
// 비활성화 토글기능
window.handleWorkerToggle = (id) => {
  const worker = Workers.value.find((w) => w.id === id);
  if (worker) {
    toggleWorkerStatus(worker);
  }
};
</script>
