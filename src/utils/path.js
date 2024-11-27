/* src/utils.path.js; PATH 객체를 사용하여 라우팅 경로를 관리 */

export const PATH = {
  /* 사용자 경로 */
  HOME: "/",
  MY_DEPOSIT: "/myDeposit", // 마이페이지; 예금 즐겨찾기
  MY_INSTALLMENT: "/myInstallment", // 마이페이지; 적금 즐겨찾기
  MY_INFO: "/myInfo", // 마이페이지; 회원 정보 (조회)
  MY_EDIT: "/myEdit", // 마이페이지; 회원 정보 수정
  MY_WITHDRAW: "/myWithdraw", // 마이페이지; 회원 탈퇴
  MY_CALENDAR: "/myCalendar", // 마이페이지; 나의 적금 달력

  INSTALLMENT_LIST: "/product/installmentList", // 상품-적금리스트페이지; 필터페이지 -혜진
  DEPOSIT_LIST: "/product/depositList", // 상품-예금리스트페이지; 필터페이지 -혜진
  PRODUCT_DETAIL: "/products/detail", // 상품페이지; 상품 상세페이지

  SERVICE_CENTER: '/serviceCenter',

  /* 관리자 경로 */
  ADMIN_MAIN: "/admin/adminMain",
  ADMIN_USER_LIST: "/admin/userList",
  ADMIN_INQUIRE_LIST: "/admin/adminInquireList",
  ADMIN_INQUIRE: "/admin/adminInquire",

  SERVER: "http://localhost:8080", // 배포 후 여기만 수정
};

// 환경 변수에서 deployHostName 값을 가져옴
// 기본값은 http://localhost:5173로 설정
export const deployHostName = import.meta.env.VITE_DEPLOY_HOSTNAME; // || 'http://localhost:5173';

/* 환경변수 유효성 검증 */
// if (!import.meta.env.VITE_DEPLOY_HOSTNAME) {
//     throw new Error('VITE_DEPLOY_HOSTNAME is not defined. Please check your .env file.');
// }
// export const deployHostName = import.meta.env.VITE_DEPLOY_HOSTNAME;
