<template>
  <div class="space-y-6 bg-white text-black dark:bg-black dark:text-white p-4 rounded">
    <h1 class="text-3xl font-bold text-gray-800 dark:text-white">관리자 대시보드</h1>
    <!-- 통계카드 -->
    <DashboardStates :states="states" />
    <!-- 예약현황 -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow text-gray-700 dark:text-gray-300">
      <!-- 검색 필터 -->
      <div class="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-white mb-2">예약 현황</h2>
        <div class="flex flex-col space-y-4 xl:space-y-0 xl:flex-row xl:items-center xl:justify-between xl:space-x-4">
          <!-- 날짜 선택 -->
          <div class="flex flex-col space-y-2 xl:space-y-0 xl:flex-row xl:items-center xl:space-x-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">기준일</label>
            <div class="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <input
                type="date"
                v-model="dateRange.start"
                class="w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <span class="text-gray-500 dark:text-gray-400">~</span>
              <input
                v-model="dateRange.end"
                type="date"
                class="w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <!-- 접수 구분 -->
          <!-- <div class="flex flex-col space-y-2 xl:space-y-0 xl:flex-row xl:items-center xl:space-x-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">접수 구분</label>
            <select
              v-model="serviceType"
              class="w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">전체</option>
              <option value="일반청소">일반청소</option>
              <option value="입주청소">입주청소</option>
              <option value="이사청소">이사청소</option>
            </select>
          </div> -->
          <!-- 접수 상태 -->
          <!-- <div class="flex flex-col space-y-2 xl:space-y-0 xl:flex-row xl:items-center xl:space-x-2">
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">접수상태</label>
            <select
              v-model="receiptStatus"
              class="w-full sm:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">전체</option>
              <option value="예약완료">예약완료</option>
              <option value="진행중">진행중</option>
              <option value="대기중">대기중</option>
            </select>
          </div> -->
        </div>
      </div>
      <!-- 스크립트에서 대문자 > 하이픈(-)으로 대체 -->
      <SearchTable
        :data="filteredReservations"
        search-place-holder="고객명 또는 예약번호로 검색.."
        :filter-options="dashboardFilterOptions"
        :search-fields="['customerName', 'id']"
        table-title="예약 목록"
        :columns="reserveColumns"
        :items-per-page="itemsPerPage"
        totallabel="건의 예약"
        :filter-fn="dashFilterFn"
        @row-click="handleRowClick"
      />
    </div>
    <!-- 예약 상세 모달 -->
    <div
      v-if="selectedReserve"
      class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">예약 상세 정보</h3>
            <button
              @click="closeModal"
              class="cursor-pointer text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
          <!-- 정보 -->
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- 기본 정보 -->
              <div class="space-y-6">
                <div>
                  <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">기본 정보</h4>
                  <div class="space-y-2">
                    <div class="flex items-center">
                      <label class="w-32 text-sm font-medium text-gray-700 dark:text-gray-300">예약번호</label>
                      <span class="text-sm text-gray-900 dark:text-white">{{ selectedReserve.id }}</span>
                    </div>
                    <div class="flex items-center">
                      <label class="w-32 text-sm font-medium text-gray-700 dark:text-gray-300">고객명</label>
                      <span>{{ selectedReserve.customerName }}</span>
                    </div>
                    <div class="flex items-center">
                      <label class="w-32 text-sm font-medium text-gray-700 dark:text-gray-300">청소 유형</label>
                      <select
                        v-model="selectedReserve.type"
                        class="cursor-pointer px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="일반청소">일반청소</option>
                        <option value="입주청소">입주청소</option>
                        <option value="이사청소">이사청소</option>
                      </select>
                    </div>
                    <div class="flex items-center">
                      <label class="w-32 text-sm font-medium text-gray-700 dark:text-gray-300">예약 일시</label>
                      <input
                        type="datetime-local"
                        v-model="selectedReserve.date"
                        class="cursor-pointer px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <!-- 상태 정보 -->
              <div class="space-y-6">
                <div>
                  <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">상태 정보</h4>
                  <div class="space-y-2">
                    <div class="flex items-center">
                      <label class="w-32 text-sm font-medium text-gray-700 dark:text-gray-300">상태</label>
                      <select
                        v-model="selectedReserve.status"
                        class="cursor-pointer px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="예약완료">예약완료</option>
                        <option value="진행중">진행중</option>
                        <option value="대기중">대기중</option>
                      </select>
                    </div>
                    <div class="flex items-center">
                      <label class="w-32 text-sm font-medium text-gray-700 dark:text-gray-300">담당 기사</label>
                      <select
                        v-model="selectedReserve.worker"
                        class="cursor-pointer px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="-">미배정</option>
                        <option value="이지은">이지은</option>
                        <option value="최윤호">최윤호</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">메모</h4>
                  <textarea
                    rows="3"
                    v-model="selectedReserve.memo"
                    class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="예약에 대한 메모를 입력하세요"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 저장버튼 -->
        <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700 flex justify-end space-x-3">
          <button
            @click="closeModal"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            닫기
          </button>
          <button
            @click="saveReservaton"
            class="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            저장
          </button>
        </div>
      </div>
    </div>
    <!-- 기사현황 -->
    <Worker_dash />
    <!-- 차트/최근 예약 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">예약 추이</h2>
        <!-- 차트 -->
        <div class="h-64">
          <Chart />
        </div>
      </div>
      <!-- 최근 예약 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">최근 예약</h2>
        <div class="space-y-4">
          <div
            v-for="reservation in recentReservations"
            :key="reservation.id"
            class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div>
              <p class="font-medium text-gray-900 dark:text-white">
                {{ reservation.customerName }}
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ reservation.date }}
              </p>
            </div>
            <span :class="getStatusClass(reservation.status)" class="px-2 py-1 text-xs font-semibold rounded-full">
              {{ reservation.status }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import Chart from "@/components/Chart.vue";
import DashboardStates from "../../components/DashboardStates.vue";
import SearchTable from "@/components/SearchTable.vue";
import Worker_dash from "@/components/Worker_dash.vue";

// 선택된 예약 정보
const selectedReserve = ref(null);

// 통계카드 더미
const states = [
  {
    title: "전체 예약",
    value: "120",
    change: "+12%",
    icon: "fas fa-calendar-check",
    bg: "bg-blue-100",
    color: "text-blue-600",
  },
  {
    title: "전체 사용자",
    value: "50",
    change: "+5%",
    icon: "fas fa-users",
    bg: "bg-green-100",
    color: "text-green-600",
  },
  {
    title: "평균 평점",
    value: "4.8",
    change: "+0.2",
    icon: "fas fa-star",
    bg: "bg-yellow-100",
    color: "text-yellow-600",
  },
];
// 최근 예약
const recentReservations = ref([
  { id: 1, customerName: "김철수", date: "2024-03-20", status: "확정" },
  { id: 2, customerName: "이영희", date: "2024-03-21", status: "대기" },
  { id: 3, customerName: "박민수", date: "2024-03-22", status: "취소" },
  { id: 4, customerName: "정지은", date: "2024-03-23", status: "확정" },
]);

// 예약 상태 css
// 상태 css
const getStatusClass = (status) => {
  const statusClasses = {
    예약완료: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300",
    진행중: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300",
    대기중: "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-300",
    확정: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300",
    대기: "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300",
    취소: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300",
    활동중: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300",
  };
  return statusClasses[status] || "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-300";
};

// 날짜 범위 필터
const dateRange = ref({
  start: "", // 시작일
  end: "", // 종료일
});
// 예약 정보
const reservations = ref([
  {
    id: "#1001",
    customerName: "김철수",
    type: "일반청소",
    date: "2025-11-10 14:00",
    status: "예약완료",
    worker: "이지은",
  },
  {
    id: "#1002",
    customerName: "박영희",
    type: "입주청소",
    date: "2025-11-11 10:00",
    status: "진행중",
    worker: "최윤호",
  },
  {
    id: "#1003",
    customerName: "이민수",
    type: "이사청소",
    date: "2025-11-12 15:00",
    status: "대기중",
    worker: "-",
  },
  {
    id: "#1004",
    customerName: "정다은",
    type: "일반청소",
    date: "2025-11-13 11:00",
    status: "예약완료",
    worker: "이지은",
  },
  {
    id: "#1005",
    customerName: "최준호",
    type: "입주청소",
    date: "2025-11-14 09:00",
    status: "대기중",
    worker: "-",
  },
  {
    id: "#1006",
    customerName: "한미영",
    type: "이사청소",
    date: "2025-11-15 13:00",
    status: "예약완료",
    worker: "최윤호",
  },
  {
    id: "#1007",
    customerName: "송민준",
    type: "일반청소",
    date: "2025-11-16 15:00",
    status: "진행중",
    worker: "이지은",
  },
  {
    id: "#1008",
    customerName: "윤서연",
    type: "입주청소",
    date: "2025-11-17 10:00",
    status: "대기중",
    worker: "-",
  },
]);
// 서비스 유형
const serviceType = ref("all");
// 서비스 상태
const receiptStatus = ref("all");

// 날짜 포맷 변경 함수
const formatDate = (date) => {
  return new Date(date).toLocaleDateString("ko-KR", {
    year: "numeric", // 년도
    month: "long", // 월 (한글 월 이름)
    day: "numeric", // 일
    weekday: "long", // 요일 (한글 요일 이름)
  });
};
// 날짜 문자열에서 YYYY-MM-DD 형식만 추출하는 함수
// 시간 문자열만 비교하도록 변경
const extractDateOnly = (dateString) => {
  // console.log(dateString);

  // "2025-11-17 10:00" 형식에서 "2025-11-17"만 추출
  // 또는 이미 "2025-11-17" 형식이면 그대로 반환
  if (!dateString) return "";
  return dateString.split(" ")[0].split("T")[0];
  // return dateString
};

// 필터링된 예약 목록 계산
const filteredReservations = computed(() => {
  let result = [...reservations.value]; // 예약 정보 복사
  // 날짜를 필터링
  if (dateRange.value.start && dateRange.value.end) {
    const startDate = extractDateOnly(dateRange.value.start);
    const endDate = extractDateOnly(dateRange.value.end);
    // console.log(startDate, endDate);
    result = result.filter((reserve) => {
      const reservedate = extractDateOnly(reserve.date);

      // console.log(reservedate);

      // 문자열 비교로 날자 범위 확인 (종료일 포함)
      return reservedate >= startDate && reservedate <= endDate;
    });
  }

  // 청소 서비스 유형 필터링
  if (serviceType.value !== "all") {
    result = result.filter((reservation) => reservation.type === serviceType.value);
  }
  // 접수 상태 필터링
  if (receiptStatus.value !== "all") {
    result = result.filter((reservation) => reservation.type === receiptStatus.value);
  }
  return result;
});
// 필터 옵션 설정
const dashboardFilterOptions = [
  {
    key: "serviceType",
    options: [
      { value: "all", label: "전체" },
      { value: "일반청소", label: "일반청소" },
      { value: "입주청소", label: "입주청소" },
      { value: "이사청소", label: "이사청소" },
    ],
  },
  {
    key: "receiptStatus",
    options: [
      { value: "all", label: "전체" },
      { value: "예약완료", label: "예약완료" },
      { value: "진행중", label: "진행중" },
      { value: "대기중", label: "대기중" },
    ],
  },
];
// 테이블 칼럼 정의
const reserveColumns = [
  { label: "예약번호", key: "id" },
  { label: "고객명", key: "customerName" },
  { label: "청소유형", key: "type" },
  {
    label: "예약일시",
    key: "date",

    render: (item) => formatDate(item.date),
  },
  {
    label: "상태",
    key: "status",
    render: (item) =>
      `<span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(item.status)}">${
        item.status
      }</span>`,
  },
  { label: "담당기사", key: "worker" },
  {
    label: "액션",
    key: "action",
    render: (item) =>
      `<button onclick="window.handleReservationClick('${item.id}')" class="cursor-pointer text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 mr-3"><i class="fa-solid fa-eye mr-1"></i> 상세</button>`,
  },
];
// 행 클릭 핸들러
const handleRowClick = (item) => {
  showReserveDetails(item);
};

// 예약 관리 상세 모달
const showReserveDetails = (reservation) => {
  selectedReserve.value = { ...reservation };
};

// 전역 함수로 등록(컴포넌트 내부에서 사용)
window.handleReservationClick = (id) => {
  // console.log(id);
  const reservation = reservations.value.find((r) => r.id === id);
  if (reservation) {
    showReserveDetails(reservation);
  }
};

// 예약 상세 모달 닫기
const closeModal = () => {
  selectedReserve.value = null;
};

// 예약 상세 모달 저장
const saveReservaton = () => {
  // 입력값 유효성 검사
  if (!selectedReserve.value.date) {
    alert("예약일시는 필수 입력 항목입니다.");
    return;
  }
  const index = reservations.value.findIndex((r) => r.id === selectedReserve.value.id);
  if (index !== -1) {
    reservations.value[index] = { ...selectedReserve.value };
  }
  // 모달 닫기
  closeModal();
};

// 커스텀 필터 함수 (날짜 범위 포함)
const dashFilterFn = (data, filters) => {
  let result = [...data];
  // console.log(result);
  // console.log(filters);

  // 서비스 필터링
  if (filters.serviceType && filters.serviceType !== "all") {
    result = result.filter((reserve) => reserve.type === filters.serviceType);
  }

  // 접수 상태 필터링
  if (filters.receiptStatus && filters.receiptStatus !== "all") {
    result = result.filter((reserve) => reserve.status === filters.receiptStatus);
  }
  return result;
};
</script>
