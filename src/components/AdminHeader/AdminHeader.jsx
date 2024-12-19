import {  useNavigate } from 'react-router-dom';
import styles from './AdminHeader.module.scss';
import React, { useEffect, useState } from 'react';
import { PATH } from "src/utils/path";

const AdminHeader = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();


    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // width를 1000px 이상으로 늘리면 isMenuOpen를 다시 false
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 1000 && isMenuOpen) {
                setIsMenuOpen(false); // 화면 크기가 1000px 이상일 때 메뉴 닫기
            }
        }

        window.addEventListener('resize', handleResize); // 이벤트 리스너 등록

        return () => {
            window.removeEventListener('resize', handleResize); // 클린업
        };
    }, [isMenuOpen])

    return (
        <div className={styles.adminHeader}>
            <div className={styles.adminHeaderComponent}>
                <div className={styles.adminHeaderTitle}>관리자 페이지</div>

                <div className={styles.adminHeaderMenuBar}>
                    <button className={styles.adminButton} onClick={toggleMenu}>
                        <img src='/src/assets/icons/mobileMenuIcon.svg' alt="menu" />
                    </button>
                </div>

                <div className={styles.adminHeaderLogout}>로그아웃</div>
            </div>

            {/* 메뉴가 열렸을 때 SideNav 내용 렌더링 */}
            {isMenuOpen && (
                <>
                    <div
                        className={styles.overlay}
                        onClick={() => setIsMenuOpen(false)}
                    ></div>
                    <div className={`${styles.adminSideNav} ${isMenuOpen ? styles.open : ''}`}>
                        <div className={styles.sideNavContent}>
                            <div className={styles.userInfo}>
                                <span>ADMIN 님</span>
                            </div>
                            <ul className={styles.menuList}>
                                <li onClick={() => {
                                    navigate(PATH.ADMIN_MAIN);
                                    setIsMenuOpen(false);
                                }}>대시보드</li>
                                <li onClick={() => {
                                    navigate(PATH.ADMIN_USER_LIST);
                                    setIsMenuOpen(false);
                                }}>사용자 조회</li>
                                <li onClick={() => {
                                    navigate(PATH.ADMIN_INQUIRE_LIST);
                                    setIsMenuOpen(false);
                                }}>1:1 문의</li>
                                <li onClick={() => {
                                    navigate(PATH.ADMIN_EMAIL_INQUIRE_LIST);
                                    setIsMenuOpen(false);
                                }}>이메일 문의</li>
                                <li>로그아웃</li>
                                <li onClick={() => {
                                    navigate(PATH.ADMIN_INQUIRE_LIST);
                                    setIsMenuOpen(false);
                                }}>고객센터</li>
                            </ul>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminHeader;
