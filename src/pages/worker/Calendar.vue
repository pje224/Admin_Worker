<template>
  <div class="w-full">
    <!-- 상단 : 월 이동 -->
    <div class="flex items-center justify-between mb-3">
      <button
        @click="prevMonth"
        class="cursor-pointer px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 shrink-0 min-w-[60px] text-center"
      >
        이전
      </button>
      <div
        class="text-base font-semibold text-gray-900 dark:text-white flex-1 text-center"
      >
        {{ year }}년 {{ month + 1 }}월
      </div>
      <button
        @click="nextMonth"
        class="cursor-pointer px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 shrink-0 min-w-[60px] text-center"
      >
        다음
      </button>
    </div>
    <!-- 요일 헤더 -->
    <div
      class="grid grid-cols-7 text-center text-xs text-gray-500 dark:text-gray-400 mb-1"
    >
      <div>일</div>
      <div>월</div>
      <div>화</div>
      <div>수</div>
      <div>목</div>
      <div>금</div>
      <div>토</div>
    </div>
    <!-- 달력 그리드 -->
    <div class="grid grid-cols-7 gap-1">
      <div
        v-for="d in calendarDays"
        :key="d.key"
        :class="dayClass(d)"
        @click="selectDate(d)"
        class="aspect-square rounded-xl flex flex-col items-center justify-center text-sm cursor-pointer select-none"
      >
        <span>{{ d.date.getDate() }}</span>
        <span
          v-if="countJobs[d.key]"
          class="mt-1 text-[10px] px-1.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
          >{{ countJobs[d.key] }}건</span
        >
      </div>
    </div>
    <!-- 선택 날짜 일정 리스트 -->
    <div class="mt-4">
      <div class="flex items-center justify-between mb-2">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          {{ selectedDateLabel }} 일정
        </p>
        <select
          v-model="statusFilter"
          class="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="all">전체</option>
          <option value="scheduled">예약</option>
          <option value="onroute">이동중</option>
          <option value="working">작업중</option>
          <option value="done">완료</option>
        </select>
      </div>
    </div>
    <div class="text-center text-gray-500 dark:text-gray-400 text-sm py-6">
      일정이 없습니다
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import jobsData from "@/data/jobs.json";

const jobs = ref(jobsData);
// console.log(jobs.value);

// 현재 년 / 월 기본값
const today = new Date();
// console.log(today);

const viewDate = ref(new Date(today.getFullYear(), today.getMonth(), 1));
// console.log(viewDate);

// const year = ref(today.getFullYear());
const year = computed(() => viewDate.value.getFullYear());
// const month = ref(today.getMonth()); // 0 ~ 11
const month = computed(() => viewDate.value.getMonth());
// console.log(year.value, month.value);

const selectedDate = ref(new Date(today));
const statusFilter = ref("all");

// 날짜 key 포멧 함수
function fmtKey(d) {
  // console.log(d);

  const y = d.getFullYear();
  // console.log(y);

  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const calendarDays = computed(() => {
  const start = new Date(year.value, month.value, 1);
  const end = new Date(year.value, month.value + 1, 0);
  const startWeekday = start.getDay();
  const days = [];
  // 이전 달 채우기
  for (let i = 0; i < startWeekday; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() - (startWeekday - i));
    days.push({ date: d, key: fmtKey(d), outside: true });
  }
  // 이번 달
  for (let d = 1; d <= end.getDate(); d++) {
    const cur = new Date(year.value, month.value, d);
    days.push({ date: cur, key: fmtKey(cur), outside: false });
  }
  // 다음 달 채우기 (42칸)
  while (days.length < 42) {
    const last = days[days.length - 1].date;
    const next = new Date(last);
    next.setDate(next.getDate() + 1);
    days.push({ date: next, key: fmtKey(next), outside: true });
  }
  return days;
});

// 날짜와 오늘에 대한 class
function dayClass(d) {
  const isToday = fmtKey(d.date) === fmtKey(today);
  const isSelected = fmtKey(d.date) === fmtKey(selectedDate.value);
  return [
    d.outside ? "text-gray-400 dark:text-gray-400" : "text-gray-900 dark:text-gray-100",
    isToday ? "ring-1 ring-blue-500 dark:ring-blue-400" : "",
    isSelected ? "bg-blue-600 dark:bg-blue-500 text-white" : "bg-white dark:bg-gray-800",
  ];
}
// 이전 클릭시
function prevMonth() {
  viewDate.value = new Date(year.value, month.value - 1, 1);
}
// 방법1️⃣(year / month 가 ref일때)
// function prevMonth() {
//   if (month.value === 0) {
//     year.value -= 1;
//     month.value = 11;
//   } else {
//     month.value -= 1;
//   }
// }

// 방법2️⃣(year / month 가 ref일때)
// function prevMonth() {
//   const newDate = new Date(year.value, month.value - 1, 1);
//   year.value = newDate.getFullYear();
//   month.value = newDate.getMonth();
//   viewDate.value = newDate;
// }

// 다음 클릭시
function nextMonth() {
  viewDate.value = new Date(year.value, month.value + 1, 1);
}
// 방법1️⃣(year / month 가 ref일때)
// function nextMonth() {
//   if (month.value === 11) {
//     year.value += 1;
//     month.value = 0;
//   } else {
//     month.value += 1;
//   }
// }

// 방법2️⃣(year / month 가 ref일때)
// function nextMonth() {
//   const newDate = new Date(year.value, month.value + 1, 1);
//   year.value = newDate.getFullYear();
//   month.value = newDate.getMonth();
//   viewDate.value = newDate;
// }

// 달력에 표시되는 건수
const countJobs = computed(() => {
  const acc = {};
  for (const j of jobs.value) {
    acc[j.date] = (acc[j.date] || 0) + 1;
  }
  return acc;
});
// console.log(countJobs.value);

// 선택한 날짜
function selectDate(d) {
  selectedDate.value = new Date(d.date);
}
// 선택 날짜
const selectedDateLabel = computed(() => {
  const d = selectedDate.value;
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
});
</script>

<style scoped></style>
