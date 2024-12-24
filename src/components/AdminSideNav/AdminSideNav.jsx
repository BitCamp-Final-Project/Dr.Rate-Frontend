import styles from './AdminSideNav.module.scss';
import React from 'react';
import { PATH } from 'src/utils/path';
import { useNavigate, useLocation } from 'react-router-dom';
import adminLogo from 'src/assets/images/adminLogo.png';
import dashboard from 'src/assets/images/adminDashboard.png';
import userManagement from 'src/assets/images/adminUserManagement.png';
import inquiryHistory from 'src/assets/images/adminInquiryHistory.png';
import inquiryEmailHistory from 'src/assets/images/adminEmailInquiryHistory.png';
import whiteRightArrow from 'src/assets/icons/whiteRightArrow.svg';

const AdminSideNav = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isPathActive = (paths) => paths.some((path) => location.pathname.includes(path));


    return (
        <div className={ styles.adminNav }>
            {/* 관리자 페이지 로고 */}
            <div className={ styles.adminLogoDiv } onClick={() => navigate(PATH.ADMIN_MAIN)}>
                <img src={adminLogo} alt="admin logo" className={styles.adminLogo} />
            </div>


            {/* 관리자 메뉴 */}
            <div className={ styles.adminMenuDiv }>
                {/* <div> */}
                    <div className={ styles.adminMenuList } onClick={()=>navigate(PATH.ADMIN_MAIN)}> 
                        <div className={ styles.adminMenuItemImg}>
                            <img src={dashboard} alt="대시보드" className={styles.adminMenuImg} />
                        </div>
                        <div 
                            className={ styles.adminMenuItemText }
                            style={{
                                fontWeight: location.pathname.includes(PATH.ADMIN_MAIN) ? '700' : 'inherit',
                                fontSize : location.pathname.includes(PATH.ADMIN_MAIN) ? '18px' : 'inherit',
                            }} 
                        >
                            대시보드
                        </div>
                    </div>
                    <div className={ styles.adminMenuList } onClick={()=> navigate(PATH.ADMIN_USER_LIST)}>
                        <div className={ styles.adminMenuItemImg}>
                            <img src={userManagement} alt="사용자 조회" className={styles.adminMenuImg} />
                        </div>
                        <div 
                            className={ styles.adminMenuItemText }
                            style={{
                                fontWeight: location.pathname.includes(PATH.ADMIN_USER_LIST) ? '700' : 'inherit',
                                fontSize : location.pathname.includes(PATH.ADMIN_USER_LIST) ? '18px' : 'inherit',
                            }} 
                        >
                            사용자 조회
                        </div>                        
                    </div>
                    <div className={ styles.adminMenuList } onClick={()=> navigate(PATH.ADMIN_INQUIRE_LIST)}>
                        <div className={ styles.adminMenuItemImg}>
                            <img src={inquiryHistory} alt="1:1 문의 내역" className={styles.adminMenuImg} />
                        </div>
                        <div 
                            className={ styles.adminMenuItemText }
                            style={{
                                fontWeight: isPathActive([PATH.ADMIN_INQUIRE_LIST, PATH.ADMIN_INQUIRE]) ? '700' : 'inherit',
                                fontSize : isPathActive([PATH.ADMIN_INQUIRE_LIST, PATH.ADMIN_INQUIRE]) ? '18px' : 'inherit',
                            }}  
                        >
                            1:1 문의 내역
                        </div>
                    </div>
                    <div className={ styles.adminMenuList } onClick={()=> navigate(PATH.ADMIN_EMAIL_INQUIRE_LIST)}>
                        <div className={ styles.adminMenuItemImg}>
                            <img src={inquiryEmailHistory} alt="이메일 문의 내역" className={styles.adminMenuImg} />
                        </div>
                        <div 
                            className={ styles.adminMenuItemText }
                            style={{
                                fontWeight: isPathActive([PATH.ADMIN_EMAIL_INQUIRE_LIST, PATH.ADMIN_EMAIL_INQUIRE]) ? '700' : 'inherit',
                                fontSize : isPathActive([PATH.ADMIN_EMAIL_INQUIRE_LIST, PATH.ADMIN_EMAIL_INQUIRE]) ? '18px' : 'inherit',
                            }}  
                        >
                            이메일 문의 내역
                        </div>
                    </div>
                {/* </div> */}
            </div>{/* //<div className={ styles.adminMenuDiv }> */}


            {/* 사용자 페이지 이동 */}
            <div className={ styles.userNavigateDiv } onClick={() => navigate(PATH.HOME)}>
                사용자 페이지 이동
                <img src={whiteRightArrow} alt="이동 오른쪽 >" className={styles.whiteRightArrowImg} />
            </div>

            
        </div>
    );
};

export default AdminSideNav;