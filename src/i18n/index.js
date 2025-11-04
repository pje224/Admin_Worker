import { createI18n } from "vue-i18n";

// 한국어 번역
const ko = {
  lang: {
    label: "언어",
    ko: "한국어",
    en: "English",
    jp: "日本語",
  },
  common: {
    close: "닫기",
  },
  nav: {
    home: "홈",
    reserve: "예약하기",
    review: "리뷰보기",
    contact: "문의하기",
  },
  home: {
    title: "홈 페이지",
    goReserve: "예약하러 가기",
    goReview: "리뷰보러 가기",
  },
};

// 영어 번역
const en = {
  lang: {
    label: "Language",
    ko: "한국어",
    en: "English",
    jp: "日本語",
  },
  common: {
    close: "Close",
  },
  nav: {
    home: "Home",
    reserve: "Reserve",
    review: "Reviews",
    contact: "Contact",
  },
  home: {
    title: "Home Page",
    goReserve: "Go to Reservation",
    goReview: "Go to Reviews",
  },
};

// 일본어 번역
const jp = {
  lang: {
    label: "言語",
    ko: "한국어",
    en: "English",
    jp: "日本語",
  },
  common: {
    close: "閉じる",
  },
  nav: {
    home: "ホーム",
    reserve: "予約する",
    review: "レビューを見る",
    contact: "お問い合わせ",
  },
  home: {
    title: "ホームページ",
    goReserve: "予約しに行く",
    goReview: "レビューを見に行く",
  },
};

// i18n 인스턴스 생성
const i18n = createI18n({
  legacy: false, // Composition API사용 여부
  locale: localStorage.getItem("language") || "ko", // 기본언어 설정
  fallbackLocale: "ko", // 번역이 없을 경우 사용할 언어
  messages: {
    ko,
    en,
    jp,
  },
});
export default i18n;
