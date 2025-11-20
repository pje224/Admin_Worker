<template>
  <div class="space-y-6 bg-white text-black dark:bg-black dark:text-white p-4 rounded">
    <h1 class="text-3xl font-bold text-gray-800 dark:text-white">문의관리</h1>
    <!-- 통계카드 -->
    <DashboardStates :states="states" class="md:grid-cols-4" />
    <!-- 문의 목록 -->
    <SearchTable
      :data="inquiries"
      search-placeholder="고객명, 제목, 내용으로 검색..."
      :filter-options="inquiryFilterOptions"
      :search-fields="['title', 'content', 'customerName']"
      table-title="문의 관리"
      :columns="inquiryColumns"
      :items-per-page="itemsPerPage"
      total-label="개"
      :filter-fn="inquiryFilterFn"
      @row-click="handleInquiryRowClick"
    />
  </div>
  <!-- 문의 상세 모달 -->
  <div v-if="selectedInquiry" class="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
      <div class="p-6">
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-2xl font-bold">문의 상세</h3>
          <button @click="closeModal" class="cursor-pointer text-gray-400 hover:text-gray-600">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        <div class="space-y-4">
          <div class="border-b pb-4">
            <div class="flex items-center gap-2 mb-2">
              <span
                :class="['px-2 py-1 text-xs font-medium rounded-full', getCategoryClass(selectedInquiry.category)]"
                >{{ selectedInquiry.category }}</span
              >
              <span
                :class="[
                  'px-2 py-1 text-xs font-medium rounded-full',
                  selectedInquiry.answered ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800',
                ]"
                >{{ selectedInquiry.answered ? "답변완료" : " 답변대기" }}</span
              >
            </div>
          </div>
          <div class="border-b pb-4">
            <h5 class="font-semibold mb-2">문의 내용</h5>
            <p class="text-gray-700 whitespace-pre-wrap">
              {{ selectedInquiry.content }}
            </p>
          </div>
          <!-- 답변 내용이 있으면 -->
          <div v-if="selectedInquiry.answer" class="border-b pb-4">
            <h5 class="font-semibold mb-2 text-green-700">답변 내용</h5>
            <p class="text-gray-700 whitespace-pre-wrap">
              {{ selectedInquiry.answer }}
            </p>
            <p class="text-xs text-gray-500 mt-2">답변일: {{ formatDate(selectedInquiry.answeredDate) }}</p>
          </div>
          <!-- 답변 내용이 없으면 -->
          <div v-if="!selectedInquiry.answered" class="flex justify-end gap-3">
            <button
              @click="closeModal"
              class="cursor-pointer px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              닫기
            </button>
            <button
              @click="replyToInquiry(selectedInquiry)"
              class="cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <i class="fas fa-reply mr-2"></i>답변 작성
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- 답변 상세 모달 -->
  <div v-if="replyingToInquiry" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-lg max-w-2xl w-full">
      <div class="p-6">
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-2xl font-bold">답변 작성</h3>
          <button @click="replyingClose" class="cursor-pointer text-gray-400 hover:text-gray-600">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        <div class="space-y-4">
          <div class="border-b pb-4">
            <p class="text-sm text-gray-600 mb-2">문의 제목</p>
            <p class="font-semibold">{{ replyingToInquiry.title }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">답변 내용</label>
            <textarea
              v-model="replyContent"
              rows="8"
              placeholder="답변 내용을 입력하세요..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
            </textarea>
          </div>
          <div class="flex justify-end gap-3">
            <button
              @click="replyingClose"
              class="cursor-pointer px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              @click="submitReply"
              class="cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <i class="fas fa-check mr-2"></i>
              답변 등록
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { inquiryData } from "@/data/inquiry";
import SearchTable from "@/components/SearchTable.vue";
import DashboardStates from "../../components/DashboardStates.vue";

const selectedInquiry = ref(null);
const replyingToInquiry = ref(null);
const replyContent = ref("");

// 기사 목록
const inquiries = ref([...inquiryData]);

// 통계더미
const states = computed(() => [
  {
    title: "전체 문의",
    value: `${inquiries.value.length}`,
    icon: "fas fa-inbox",
    bg: "bg-blue-100",
    color: "text-blue-600",
  },
  {
    title: "답변 대기",
    value: `${inquiries.value.filter((i) => !i.answered).length}`,
    icon: "fas fa-clock",
    bg: "bg-yellow-100",
    color: "text-yellow-600",
  },
  {
    title: "답변 완료",
    value: `${inquiries.value.filter((i) => i.answered).length}`,
    icon: "fas fa-check-circle",
    bg: "bg-green-100",
    color: "text-green-600",
  },
  {
    title: "오늘 문의",
    value: `${
      inquiries.value.filter((i) => {
        const today = new Date();
        const inquiryDate = new Date(i.date);
        return (
          today.getFullYear() === inquiryDate.getFullYear() &&
          today.getMonth() === inquiryDate.getMonth() &&
          today.getDate() === inquiryDate.getDate()
        );
      }).length
    }`,
    icon: "fas fa-comments",
    bg: "bg-purple-100",
    color: "text-purple-600",
  },
]);

// 테이블 칼럼 정의
const inquiryColumns = [
  { label: "번호", key: "id" },
  {
    label: "카테고리",
    key: "category",
    render: (item) =>
      `<span class="px-2 py-1 text-xs font-medium rounded-full ${getCategoryClass(item.category)}">${
        item.category
      }</span>`,
  },
  {
    label: "제목",
    key: "title",
    render: (item) => {
      const attachmentIcon = item.hasAttachment ? '<i class="fas fa-paperclip ml-2 text-gray-400 text-xs"></i>' : "";
      return `<div class="flex items-center"><span>${item.title}</span>${attachmentIcon}</div>`;
    },
  },
  { label: "고객명", key: "customerName" },
  {
    label: "등록일",
    key: "date",
    render: (item) => formatDate(item.date),
  },
  {
    label: "상태",
    key: "answered",
    render: (item) => {
      const statusClass = item.answered ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800";
      const statusText = item.answered ? "답변완료" : "답변대기";
      return `<span class="px-2 py-1 text-xs font-medium rounded-full ${statusClass}">${statusText}</span>`;
    },
  },
  {
    label: "관리",
    key: "action",
    render: (item) => {
      const viewBtn = `<button onclick="window.handleInquiryView('${item.id}')" class=" text-indigo-600 hover:text-indigo-900 mr-3"><i class="cursor-pointer fas fa-eye"></i></button>`;
      const replyBtn = !item.answered
        ? `<button onclick="window.handleInquiryReply('${item.id}')" class="text-green-600 hover:text-green-900"><i class="cursor-pointer fas fa-reply"></i></button>`
        : "";
      return viewBtn + replyBtn;
    },
  },
];

// css 상태
function getCategoryClass(category) {
  const classes = {
    "서비스 문의": "bg-blue-100 text-blue-800",
    "결제 문의": "bg-green-100 text-green-800",
    "불만 접수": "bg-red-100 text-red-800",
    "예약 변경": "bg-yellow-100 text-yellow-800",
    기타: "bg-gray-100 text-gray-800",
  };
  return classes[category] || "bg-gray-100 text-gray-800";
}

// 날짜 변경
function formatDate(date) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

// 행 클릭 핸들러
const handleInquiryRowClick = (item) => {
  viewInquiry(item);
};

// 전역 함수 등록
window.handleInquiryView = (id) => {
  const inquiry = inquiries.value.find((i) => i.id === parseInt(id));
  if (inquiry) {
    viewInquiry(inquiry);
  }
};

window.handleInquiryReply = (id) => {
  const inquiry = inquiries.value.find((i) => i.id === parseInt(id));
  if (inquiry) {
    replyToInquiry(inquiry);
  }
};

function viewInquiry(inquiry) {
  selectedInquiry.value = inquiry;
}

function replyToInquiry(inquiry) {
  replyingToInquiry.value = inquiry;
}

// 모달창 닫기
const closeModal = () => {
  selectedInquiry.value = null;
};

const replyingClose = () => {
  replyingToInquiry.value = null;
};

function submitReply() {
  if (!replyContent.value.trim()) {
    alert("답변 내용을 입력하세요.");
    return;
  }
  const inquiryIndex = inquiries.value.findIndex((i) => i.id === replyingToInquiry.value.id);
  if (inquiryIndex !== -1) {
    inquiries.value[inquiryIndex].answered = true;
    inquiries.value[inquiryIndex].answer = replyContent.value;
    inquiries.value[inquiryIndex].answeredDate = new Date();
  }
  closeModal();
  replyingClose();
  replyContent.value = "";
  alert("답변이 등록 되었습니다.");
}
</script>
