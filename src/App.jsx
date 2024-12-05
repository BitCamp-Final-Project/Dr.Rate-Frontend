/* src/App.jsx */
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'; 
import { PATH } from "./utils/path";
import PageRoutes from "./pages";
import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";

function App() {
  return (
    <div className="app">
      <Routes>
          {/* 사용자 페이지 라우트 */}
          <Route path="/" element={<UserLayout />}>
              <Route index element={<PageRoutes.HomePage />} /> {/* 기본 경로 */}
              <Route path={PATH.MY_DEPOSIT} element={<PageRoutes.MyDepositPage />} />
              <Route path={PATH.MY_INSTALLMENT} element={<PageRoutes.MyInstallmentPage />} />
              <Route path={PATH.MY_INFO} element={<PageRoutes.MyInfoPage />} />
              <Route path={PATH.MY_EDIT} element={<PageRoutes.MyEditPage />} />
              <Route path={PATH.MY_WITHDRAW} element={<PageRoutes.MyWithdrawPage />} />
              <Route path={PATH.MY_CALENDAR} element={<PageRoutes.MyCalendarPage />} />
              <Route path={PATH.INSTALLMENT_LIST} element={<PageRoutes.ProductInsListPage />} />
              <Route path={PATH.DEPOSIT_LIST} element={<PageRoutes.ProductDepListPage />} />
              <Route path={PATH.SERVICE_CENTER} element={<PageRoutes.ServiceCenterPage />} />
              <Route path={PATH.USER_INQUIRE} element = {<PageRoutes.UserInquirePage/>}/>              
              <Route path={PATH.PRODUCT_DETAIL} element={<PageRoutes.ProductDetailPage />} />{/* path={`${PATH.PRODUCT_DETAIL}/:productId`} */}
          </Route>





          

          {/* 관리자 페이지 라우트 */}
          <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<PageRoutes.AdminMainPage />} /> {/* /admin 기본 경로 */}
              <Route path={PATH.ADMIN_MAIN} element={<PageRoutes.AdminMainPage />} />
              <Route path={PATH.ADMIN_INQUIRE_LIST} element={<PageRoutes.AdminInquireListPage/>} />
              <Route path={PATH.ADMIN_INQUIRE} element={<PageRoutes.AdminInquirePage />} />{/* path={`${PATH.ADMIN_INQUIRE}/:inquireId`} */}
              <Route path={PATH.ADMIN_USER_LIST} element={<PageRoutes.AdminUserListPage/>} />
          </Route>
      </Routes>


    </div>
  );
}

export default App;



{/* <Route path='/about' element={ <About/> } />
<Route path='/profile' element={ <Profile/> } />
<Route path='/front/:name' element={ <Front data={ data }/> } />  */}
{/* name : 내가 정한 이름 */}
{/* :name은 URL 파라미터(url 경로 일부; :name은 URL 파라미터 ) */}



