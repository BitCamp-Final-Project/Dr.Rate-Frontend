/* src/pages/index.js; 모든 페이지 컴포넌트를 모아 PageRoutes로 관리 */

import HomePage from './HomePage';
import MySavingsPage from './MySavingsPage';
import MyRecurringPage from './MyRecurringPage';
import MyPage from './MyPage';
import MyEditPage from './MyEditPage';
import MyWithdrawPage from './MyWithdrawPage';
import MyCalendarPage from './MyCalendarPage';
import AdminMainPage from './AdminMainPage';
import ProductDetailPage from './ProductDetailPage/ProductDetailPage';
import AdminInquirePage from './AdminInquirePage';


// 각 페이지 컴포넌트를 PageRoutes 객체에 모아 내보내기
const PageRoutes = {

    // 사용자 페이지 컴포넌트
    HomePage,
    MySavingsPage,     
    MyRecurringPage,   
    MyPage,
    MyEditPage,
    MyWithdrawPage,
    MyCalendarPage,

    ProductDetailPage,

    // 관리자 페이지 컴포넌트
    AdminMainPage,
    AdminInquirePage,
    
};

export default PageRoutes;