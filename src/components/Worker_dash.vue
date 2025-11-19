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
    @row-click="handleRowClick"
  />
</template>

<script setup>
import { ref } from "vue";
import SearchTable from "@/components/SearchTable.vue";
import { workersData } from "@/data/workers";

// 기사 목록 더미 데이터 > 외부 파일에서 가져오기
const Workers = ref([...workersData]);

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
</script>
