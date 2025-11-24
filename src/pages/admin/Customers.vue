<template>
  <div class="space-y-6 bg-white text-black dark:bg-black dark:text-white p-4 rounded">
    <h1 class="text-3xl font-bold text-gray-800 dark:text-white">고객관리</h1>
    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">고객 정보를 관리하고 상태를 확인할 수 있습니다.</p>
    <!-- 통계카드 -->
    <DashboardStates :states="states" />
    <!-- 고객 목록 (공통 컴포넌트 사용) -->
    <SearchTable
      :data="customers"
      :columns="customerColumns"
      search-placeholder="고객명 또는 이메일로 검색"
      :search-fields="['name', 'email']"
      :filter-options="customerFilterOptions"
      :filter-fn="customerFilterFn"
      :items-per-page="itemsPerPage"
      table-title="고객 목록"
      total-label="명의 고객"
    />
  </div>
  <!-- 상세 모달  -->
  <div
    @click="closeCustomerModal"
    v-if="selectedCustomer"
    class="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
  >
    <div @click.stop class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">고객 상세</h3>
          <button @click="closeCustomerModal" class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
      <div class="px-6 py-4">
        <div class="space-y-6">
          <!-- 프로필 섹션 -->
          <div class="flex items-center space-x-4">
            <img
              class="h-20 w-20 rounded-full object-cover border-4 border-indigo-100 dark:border-indigo-900"
              :src="selectedCustomer.avatar"
              :alt="selectedCustomer.name"
            />
            <div>
              <h4 class="text-xl font-bold text-gray-900 dark:text-white">
                {{ selectedCustomer.name }}
              </h4>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ selectedCustomer.email }}
              </p>
              <div class="mt-2 flex flex-wrap gap-2">
                <span
                  v-for="tag in selectedCustomer.tags"
                  :key="tag"
                  class="px-2 py-1 text-xs font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-300 rounded-full"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
          <!-- 기본 정보 섹션 -->
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h5 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">연락처</h5>
              <input
                v-model="selectedCustomer.phone"
                type="tel"
                class="w-full bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-0 text-gray-900 dark:text-white"
              />
            </div>
            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h5 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">가입일</h5>
              <p class="text-gray-900 dark:text-white">
                {{ selectedCustomer.joinDate }}
              </p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h5 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">마지막 방문</h5>
              <p class="text-gray-900 dark:text-white">
                {{ selectedCustomer.lastVisit }}
              </p>
            </div>
            <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h5 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">상태</h5>
              <select
                v-model="selectedCustomer.status"
                class="w-full bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-0 text-gray-900 dark:text-white"
              >
                <option value="active">활성</option>
                <option value="inactive">비활성</option>
                <option value="blocked">차단</option>
              </select>
            </div>
          </div>
          <!-- 이용 정보 섹션 -->
          <div class="flex items-center space-x-4">
            <div class="flex-1/2 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h5 class="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">이용 정보</h5>

              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">예약 건수</p>
                <p class="text-lg font-semibold text-gray-900 dark:text-white">
                  {{ selectedCustomer.reservationCount }}건
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">총 이용금액</p>
                <p class="text-lg font-semibold text-gray-900 dark:text-white">
                  {{ formatCurrency(selectedCustomer.totalSpent) }}
                </p>
              </div>
            </div>

            <!-- 선호 메뉴 섹션 -->
            <div class="flex-1/2 w-full bg-white dark:bg-gray-700 rounded-lg p-4">
              <h5 class="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">선호 메뉴</h5>
              <div class="grid grid-cols-2 gap-4 pb-2">
                <div
                  v-for="(item, index) in selectedCustomer.favoriteItems"
                  :key="index"
                  class="flex items-center gap-2"
                >
                  <input
                    v-model="selectedCustomer.favoriteItems[index]"
                    type="text"
                    class="border border-gray-300 dark:border-gray-500 w-full p-1 bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <button @click="removeFavoriteItem(index)" class="text-red-500 hover:text-red-700">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
              </div>
              <button
                @click="addFavoriteItem"
                class="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-300 rounded-full text-sm hover:bg-indigo-200 dark:hover:bg-indigo-800"
              >
                <i class="fas fa-plus mr-1"></i>메뉴 추가
              </button>
            </div>
          </div>
          <!-- 메모 섹션 -->
          <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h5 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">메모</h5>
            <textarea
              v-model="selectedCustomer.notes"
              rows="3"
              class="w-full bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white"
            ></textarea>
          </div>
        </div>
      </div>
      <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700 flex justify-end space-x-3">
        <button
          @click="closeCustomerModal"
          class="cursor-pointer px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
        >
          취소
        </button>
        <button
          @click="saveCustomerD"
          class="cursor-pointer px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          저장
        </button>
      </div>
    </div>
  </div>
  <!-- 삭제 확인 모달 -->
  <div v-if="showDelModal" class="fixed inset-0 bg-black/80 flex items-center justify-center p-4">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">고객 삭제</h3>
          <button @click="closeDeletModal" class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="p-6">
          <p class="text-sm text-gray-900 dark:text-white">{{ customerToDel.name }}고객을 삭제 하시겠습니까?</p>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">삭제된 고객 정보는 복구할 수 없습니다.</p>
        </div>
        <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700 flex justify-end space-x-3">
          <button
            @click="closeDeletModal"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            취소
          </button>
          <button
            @click="deleteCustomer"
            class="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import DashboardStates from "@/components/DashboardStates.vue";
import SearchTable from "@/components/SearchTable.vue";
import { customersData } from "@/data/customers";
import { computed, ref } from "vue";

const itemsPerPage = ref(5);
const customers = ref(customersData);
const states = computed(() => [
  {
    title: "전체 고객",
    value: `10명`,
    value: customers.value.length,
    change: "+2명",
    icon: "fas fa-users",
    bg: "bg-blue-100 dark:bg-blue-900",
    color: "text-blue-600",
  },
  {
    title: "활성 고객",
    // value: `7명`,
    value: customers.value.filter((c) => c.status === "active").length,
    change: "+1명",
    icon: "fas fa-check-circle",
    bg: "bg-green-100 dark:bg-green-900",
    text: "text-green-600 dark:text-green-300",
    color: "text-green-600",
  },
  {
    title: "평균 예약",
    // value: "3.2건",
    value:
      customers.value.length > 0
        ? Math.round(customers.value.reduce((sum, c) => sum + c.reservationCount, 0) / customers.value.length)
        : 0,
    change: "+0.5건",
    icon: "fas fa-calendar-check",
    bg: "bg-yellow-100 dark:bg-yellow-900",
    text: "text-yellow-600 dark:text-yellow-300",
    color: "text-yellow-600",
  },
]);

// console.log(customers.value);
// 필터 옵션
const customerColumns = [
  {
    label: "고객",
    key: "name",
    render: (item) => `
      <div class="flex items-center">
        <div class="relative">
          <img src="${item.avatar}" alt="${item.name}" class="max-h-10 max-w-10 rounded-full object-cover" />
          <span class="absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white dark:ring-gray-800 ${getStatusDotClass(
            item.status
          )}"></span>
        </div>
        <div class="ml-4">
          <div class="text-sm font-medium text-gray-900 dark:text-white flex items-center">
            ${item.name}
            ${
              item.tags.includes("VIP")
                ? '<span class="ml-2 px-2 py-0.5 text-xs font-medium bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300 rounded-full">VIP</span>'
                : ""
            }
          </div>
          <div class="text-sm text-gray-500 dark:text-gray-400">${item.email}</div>
          <div class="text-xs text-gray-400 dark:text-gray-500 mt-1">가입일: ${item.joinDate}</div>
        </div>
      </div>
    `,
  },
  {
    label: "연락처",
    key: "phone",
    render: (item) => `
      <div class="text-sm text-gray-900 dark:text-white">${item.phone}</div>
      <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">마지막 방문: ${item.lastVisit}</div>
    `,
  },
  {
    label: "예약",
    key: "reservationCount",
    render: (item) => `
      <div class="flex items-center text-indigo-600 dark:text-indigo-400">
        <i class="fas fa-calendar mr-1"></i>
        ${item.reservationCount}건
      </div>
      <div class="text-sm text-gray-900 dark:text-white mt-1">
        총 이용금액: ${formatCurrency(item.totalSpent)}
      </div>
    `,
  },
  {
    label: "상태",
    key: "status",
    render: (item) => `
      <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
        item.status
      )}">${getStatusText(item.status)}</span>
      <div class="mt-2 flex flex-wrap gap-1">
        ${item.tags
          .map(
            (tag) =>
              `<span class="px-2 py-0.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-full">${tag}</span>`
          )
          .join("")}
      </div>
    `,
  },
  {
    label: "액션",
    key: "action",
    render: (item) => `
      <div class="flex flex-col space-y-2">
        <button onclick="window.handleCustomerDetail('${item.id}')" class="cursor-pointer text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 flex items-center">
          <i class="fas fa-eye mr-1"></i>상세
        </button>
        <button onclick="window.handleCustomerDelete('${item.id}')" class="cursor-pointer text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 flex items-center">
          <i class="fas fa-trash mr-1"></i>삭제
        </button>
      </div>
    `,
  },
];

// 필터 옵션
const customerFilterOptions = [
  {
    key: "statusFilter",
    options: [
      { value: "all", label: "전체 상태" },
      { value: "active", label: "활성" },
      { value: "inactive", label: "비활성" },
      { value: "blocked", label: "차단" },
    ],
  },
];
// 커스텀 필터 함수
const customerFilterFn = (data, filters) => {
  console.log(data);
  console.log(filters);

  let result = [...data];
  // 상태 필터링
  if (filters.statusFilter && filters.statusFilter !== "all") {
    result = result.filter((customer) => customer.status === filters.statusFilter);
  }
  return result;
};
const getStatusDotClass = (status) => {
  const statusClasses = {
    active: "bg-green-400 dark:bg-green-500",
    inactive: "bg-yellow-400 dark:bg-yellow-500",
    blocked: "bg-red-400 dark:bg-red-500",
  };
  return statusClasses[status] || "bg-gray-400 dark:bg-gray-500";
};
const getStatusClass = (status) => {
  const statusClasses = {
    active: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300",
    inactive: "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300",
    blocked: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300",
  };
  return statusClasses[status] || "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-300";
};
// 상태글자 변환
const getStatusText = (status) => {
  const statusMap = {
    active: "활성",
    inactive: "비활성",
    blocked: "차단",
  };
  return statusMap[status] || status;
};
// 기존 필터링 코드는 SearchTable 컴포넌트로 이동됨
// 숫자를 원화 동화 형식으로 포맷
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency", // 통화 형식
    currency: "KRW", // 원화(KRW)
    maximumFractionDigits: 0, // 소수점 없음
  }).format(amount);
};
// 상세 모달
window.handleCustomerDetail = (id) => {
  // console.log(id);
  const customer = customers.value.find((c) => c.id === parseInt(id));
  // console.log(customer);
  if (customer) {
    showCustomerDetails(customer);
  }
};
const selectedCustomer = ref(null);
const showCustomerDetails = (customer) => {
  selectedCustomer.value = customer; //선택된 고객 정보 저장
};
// 모달 닫기
const closeCustomerModal = () => {
  selectedCustomer.value = null;
};
// 특정 인덱스의 선호 메뉴 항목 삭제
const removeFavoriteItem = (index) => {
  // console.log(index);
  selectedCustomer.value.favoriteItems.splice(index, 1); //배열에서 제거
};
// 선호 메뉴 항목 추가
const addFavoriteItem = () => {
  if (!selectedCustomer.value.favoriteItems) {
    selectedCustomer.value.favoriteItems = []; //배열이 없으면 초기화
  }
  selectedCustomer.value.favoriteItems.push("");
};
// 고객 상세 정보 저장
const saveCustomerD = () => {
  // 고객 목록에서 현재 선택된 인덱스를 찾는다
  const index = customers.value.findIndex((c) => c.id === selectedCustomer.value.id);
  if (index !== -1) {
    // 빈 문자열로 된 선호 메뉴 항목은 제거
    selectedCustomer.value.favoriteItems = selectedCustomer.value.favoriteItems.filter((item) => item.trim() !== "");
    // 수정된 고객 정보를 고객 목록에 반영
    customers.value[index] = { ...selectedCustomer.value };
    // 상세 모달 닫기
    closeCustomerModal();
  }
};
// 고객 삭제
window.handleCustomerDelete = (id) => {
  // console.log(id);
  const customer = customers.value.find((c) => c.id === parseInt(id));
  if (customer) {
    confirmDelete(customer);
  }
};
// 고객 삭제 모달
const customerToDel = ref(null);
const showDelModal = ref(false);
const confirmDelete = (customer) => {
  customerToDel.value = customer; // 삭제할 고객 정보 저장
  showDelModal.value = true;
};
// 삭제모달 닫기
const closeDeletModal = () => {
  showDelModal.value = false;
};
// 실제 고객 삭제 처리
const deleteCustomer = () => {
  if (customerToDel.value) {
    // 고객삭제
    customers.value = customers.value.filter((c) => c.id !== customerToDel.value.id);
    closeDeletModal();
  }
};
// 메모저장
</script>
