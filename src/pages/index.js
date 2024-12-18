/* src/pages/index.js; 모든 페이지 컴포넌트를 모아 PageRoutes로 관리 */

import HomePage from "./HomePage";
import MyDepositPage from "./MyDepositPage";
import MyInstallmentPage from "./MyInstallmentPage";
import MyInfoPage from "./MyInfoPage";
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
import ProductComparePage from "./ProductComparePage";
import ServiceCenterPage from "./ServiceCenterPage";
import UserInquirePage from "./UserInquirePage/UserInquirePage";
import SignInPage from "./SignInPage/index.js";
import SignUpPage from "./SignUpPage/index.js";
import EmailInquirePage from "./EmailInquirePage";
import OAuthCallbackHandlerPage from "./OAuthCallbackHandlerPage";

// 각 페이지 컴포넌트를 PageRoutes 객체에 모아 내보내기
const PageRoutes = {
  // 사용자 페이지 컴포넌트
  HomePage,
  SignInPage,
  SignUpPage,
  MyDepositPage,
  MyInstallmentPage,
  MyInfoPage,
  MyEditPage,
  MyWithdrawPage,
  MyCalendarPage,
  ProductInsListPage,
  ProductDepListPage,
  ProductDetailPage,
  ProductComparePage,
  OAuthCallbackHandlerPage,

  // 고객센터
  ServiceCenterPage,
  UserInquirePage,
  EmailInquirePage,

  // 관리자 페이지 컴포넌트
  AdminMainPage,
  AdminInquireListPage,
  AdminInquirePage,
  AdminUserListPage,
};

export default PageRoutes;
