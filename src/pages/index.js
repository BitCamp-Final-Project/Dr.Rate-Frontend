/* src/pages/index.js; 모든 페이지 컴포넌트를 모아 PageRoutes로 관리 */

import HomePage from "./HomePage";
import MyDepositPage from "./MyDepositPage";
import MyInstallmentPage from "./MyInstallmentPage";
import MyPage from "./MyPage";
import MyEditPage from "./MyEditPage";
import MyWithdrawPage from "./MyWithdrawPage";
import MyCalendarPage from "./MyCalendarPage";
import AdminMainPage from "./AdminMainPage";
import ProductDetailPage from "./ProductDetailPage";
import AdminInquirePage from "./AdminInquirePage";
import AdminUserListPage from "./AdminUserListPage/AdminUserListPage";
import AdminInquireListPage from "./AdminInquireListPage/AdminInquireListPage";
import ProductInsListPage from "./ProductInsListPage";
import ProductDepListPage from "./ProductDepListPage";
import ServiceCenterPage from "./ServiceCenterPage";

// 각 페이지 컴포넌트를 PageRoutes 객체에 모아 내보내기
const PageRoutes = {
  // 사용자 페이지 컴포넌트
  HomePage,
  MyDepositPage,
  MyInstallmentPage,
  MyPage,
  MyEditPage,
  MyWithdrawPage,
  MyCalendarPage,
  ProductInsListPage,
  ProductDepListPage,
  ProductDetailPage,
  ServiceCenterPage,

  // 관리자 페이지 컴포넌트
  AdminMainPage,
  AdminInquireListPage,
  AdminInquirePage,
  AdminUserListPage,
};

export default PageRoutes;
