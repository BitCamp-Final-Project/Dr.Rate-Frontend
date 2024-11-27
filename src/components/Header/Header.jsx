/* src/components/Header/Header.jsx */

import styles from './Header.module.scss';
import React, { useState, useEffect  } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PATH } from "src/utils/path";
import headerLogo from 'src/assets/images/headerLogo.png';
import downArrowIcon from 'src/assets/icons/downDetailArrow.svg';
import verticalDividerIcon from 'src/assets/icons/verticalDivider.svg';
import mobileMenuIcon from 'src/assets/icons/mobileMenuIcon.svg';
import mobileSideProfile from 'src/assets/icons/mobileSideProfile.svg';
import mobileSideCompare from 'src/assets/icons/mobileSideCompare.png';
import mobileSideDeposit from 'src/assets/icons/mobileSideDeposit.png';
import mobileSideInstallment from 'src/assets/icons/mobileSideInstallment.png';
import useDropdown from 'src/hooks/useDropdown';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isPathActive = (paths) => paths.some((path) => location.pathname.includes(path));
    const { isDropdownOpen, dropdownRef, handleMouseEnter, handleMouseLeave } = useDropdown();

    // 모바일 사이드 메뉴
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // 비교, 마이페이지 서브 메뉴 상태
    const [isCompareSubMenuOpen, setIsCompareSubMenuOpen] = useState(false);
    const [isMySubMenuOpen, setIsMySubMenuOpen] = useState(false);


    const mobileToggleMenu = () => { // 모바일 사이드 메뉴
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const toggleCompareSubMenu = () => { // 모바일 사이드 메뉴 - 비교 서브메뉴
        setIsCompareSubMenuOpen(!isCompareSubMenuOpen); 
    };

    const toggleMySubMenu = () => { // 모바일 사이드 메뉴 - 마이페이지 서브메뉴
        setIsMySubMenuOpen(!isMySubMenuOpen);
    };

    // 모바일 사이드 메뉴에서의 페이지 이동; 사이드 메뉴 닫혀야 함
    const sideNavigation = (path) => {
        navigate(path);
        setIsMobileMenuOpen(false);
    };

    // 화면 크기 변화 감지; 모바일 사이드 메뉴 닫기
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 1000 && isMobileMenuOpen) {
                setIsMobileMenuOpen(false); // 화면이 데스크톱 크기로 돌아가면 사이드 메뉴 닫기
                setIsCompareSubMenuOpen(false); // 서브 메뉴도 닫기
                setIsMySubMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [isMobileMenuOpen]);

    return (
        <header>
            <div className={styles.logoDiv} onClick={() => navigate(PATH.HOME)}>
                <img src={headerLogo} alt="header logo" className={styles.headerLogo} />
            </div>

            <nav className={styles.mainNav} >
                <ul className={styles.mainMenuList}>
                    <li 
                        className={styles.mainMenuItem} 
                        onClick={() => navigate(PATH.DEPOSIT_LIST)}
                        style={{
                            color: location.pathname.includes(PATH.DEPOSIT_LIST) ? 'var(--main1)' : 'inherit',
                        }}                    
                    >
                        예금
                    </li>
                    <li 
                        className={styles.mainMenuItem}
                        onClick={() => navigate(PATH.INSTALLMENT_LIST)}
                        style={{
                            color: location.pathname.includes(PATH.INSTALLMENT_LIST) ? 'var(--main1)' : 'inherit',
                        }}
                    >
                        적금
                    </li>
                    <li 
                        className={styles.mainMenuItem}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}     
                        style={{
                            color: isPathActive([PATH.DEPOSIT_COMPARE, PATH.INSTALLMENT_COMPARE]) ? 'var(--main1)' : 'inherit',
                        }}                 
                    >
                        비교
                        <img src={downArrowIcon} alt="Down arrow" className={styles.headerDownArrow} />
                        {isDropdownOpen && (
                        <ul className={styles.HeaderDropdownMenu} ref={dropdownRef}>
                            <li className={styles.HeaderDropdownItem} onClick={() => navigate(PATH.DEPOSIT_COMPARE)}>
                                예금 비교
                            </li>
                            <li className={styles.HeaderDropdownItem} onClick={() => navigate(PATH.INSTALLMENT_COMPARE)}>
                                적금 비교
                            </li>
                        </ul>
                    )}                        
                    </li>
                </ul>
            </nav>
            <nav className={styles.userNav} >
            <ul className={styles.userMenuList}>
                    <li className={styles.userMenuItem}>
                        {/* {Users tb 조회 혹은 세션 확인 === '로그인 세션 있으면' ? '로그인(경로: Sign_In)' : '로그아웃'} */}로그아웃
                    </li>
                    <li className={styles.userMenuItem}>
                        <img src={verticalDividerIcon} alt="세로 구분선" className={styles.verticalDivider} />
                    </li>                    
                    <li className={styles.userMenuItem} onClick={() => navigate(PATH.MY_DEPOSIT)}>
                        {/* {Users tb 조회 혹은 세션 확인 === '로그인 세션 있으면' ? '회원가입(경로: Sign_Up)' : '마이페이지(경로: MY_DEPOSIT)'} */}마이페이지
                    </li>
                    <li className={styles.userMenuItem}>
                        <img src={verticalDividerIcon} alt="세로 구분선" className={styles.verticalDivider} />
                    </li>
                    <li className={styles.userMenuItem} onClick={() => navigate(PATH.SERVICE_CENTER)}>
                        고객센터
                    </li>
                </ul>
            </nav>


            {/* ============================================ 모바일 사이드 메뉴 ============================================ */}
            <div className={styles.mobileMenuIconDiv} onClick={mobileToggleMenu}>
                <img src={mobileMenuIcon} alt="모바일 메뉴 아이콘" className={styles.mobileMenuIcon} />
            </div>

            {isMobileMenuOpen && (
                <div className={styles.mobileOverlay} onClick={mobileToggleMenu}>
                    <nav className={styles.mobileSideNav} onClick={(e) => e.stopPropagation()}>
                        <div className={ styles.mobileSideHeader }>
                            <div className={styles.sideLogoDiv} onClick={() => sideNavigation(PATH.HOME)}>
                                <img src={headerLogo} alt="header logo" className={styles.sideHeaderLogo} />
                            </div>

                            {/* (비회원) 로그인 안했을 때 */}
                            <div className={ styles.sideNonMemberMenu }>
                                <div className={ styles.sideBtnDiv }>
                                    <button className={ styles.signInBtn }>로그인</button>
                                    <button className={ styles.signUpBtn }>회원가입</button>
                                </div>
                            </div>

                            {/* (회원) 로그인 했을 때 */}
                            <div className={ styles.sideMemberMenu }>
                                <div className={ styles.sideUserInfo }>
                                    <div className={ styles.mobileSideProfileDiv } >
                                        <img src={mobileSideProfile} alt="mobileSideProfile" className={styles.mobileSideProfile} />
                                    </div>
                                    <div className={ styles.sideUserName }>
                                        <span>홍박사</span>님
                                    </div>
                                </div>
                            </div>

                        </div>{/* //<div className={ styles.mobileSideHeader }> */}



                        <div className={ styles.mobileSideMain }>
                            <ul className={ styles.sideMainList }>
                                <li className={ styles.sideMainItem } onClick={() => sideNavigation(PATH.DEPOSIT_LIST)}>
                                    <div className={ styles.sideMainIconDiv }>
                                        <img src={mobileSideDeposit} alt="mobileSideInstallment" className={styles.sideMainIcon} />
                                    </div>
                                    <div className={styles.sideMainItemDiv}>예금</div>
                                </li>

                                <li className={ styles.sideMainItem } onClick={() => sideNavigation(PATH.INSTALLMENT_LIST)}>
                                    <div className={ styles.sideMainIconDiv }>
                                        <img src={mobileSideInstallment} alt="mobileSideInstallment" className={styles.sideMainIcon} />
                                    </div>
                                    <div className={styles.sideMainItemDiv}>적금</div>
                                </li>
                                <li className={ styles.sideMainItem } onClick={() => setIsCompareSubMenuOpen(!isCompareSubMenuOpen)}>
                                    <div className={ styles.sideMainIconDiv }>
                                        <img src={mobileSideCompare} alt="mobileSideInstallment" className={styles.sideMainIcon} />
                                    </div>
                                    <div className={styles.sideMainItemDiv} >
                                        <div className={ styles.sideMainItemTextDiv}>
                                            비교
                                        </div>
                                        <div className={styles.sideMainItemArrowDiv}>
                                            <img
                                                src={downArrowIcon}
                                                alt="Down arrow"
                                                className={`${styles.sideMainItemArrow} ${isCompareSubMenuOpen ? styles.arrowUp : ''}`}
                                            />
                                        </div>                                   
                                    </div>
                                </li>
                                {isCompareSubMenuOpen && (
                                    <ul className={styles.compareSubMenuList}>
                                        <li
                                            className={styles.compareSubMenuItem}
                                            onClick={() => sideNavigation(PATH.DEPOSIT_COMPARE)}
                                        >
                                            예금 비교
                                        </li>
                                        <li
                                            className={styles.compareSubMenuItem}
                                            onClick={() => sideNavigation(PATH.INSTALLMENT_COMPARE)}
                                        >
                                            적금 비교
                                        </li>
                                    </ul>
                                )}
                                                                                              
                            </ul>{/* //<ul className={ styles.sideMainList }> */}


                            <ul className={ styles.sideUserList }>
                                
                                {/* (회원) 로그인 했을 때; 로그아웃, 마이페이지, 고객센터 모두 보여야함 */}
                                <div className={ styles.sideMemberMenu }>
                                    <li className={ styles.sideMainItem }>
                                        로그아웃
                                    </li>
                                    <li className={ styles.sideMainItem }  onClick={() => setIsMySubMenuOpen(!isMySubMenuOpen)}>
                                        <div className={ styles.mySubItemText }>
                                            마이페이지
                                        </div>
                                        <div className={ styles.mySubItemArrowDiv }>
                                            <img
                                                src={downArrowIcon}
                                                alt="Down arrow"
                                                className={`${styles.mySubItemArrow} ${isMySubMenuOpen ? styles.arrowUp : ''}`}
                                            />
                                        </div>
                                    </li>
                                    {isMySubMenuOpen && (
                                        <ul className={styles.mySubMenuList}>
                                            <li
                                                className={styles.mySubMenuItem}
                                            >
                                                즐겨찾기
                                            </li>
                                            <ul className={ styles.myFavSubMenuList }>
                                                <li 
                                                    className={styles.myFavSubMenuItem }
                                                    onClick={() => sideNavigation(PATH.MY_DEPOSIT)}
                                                >
                                                    <span>•</span>예금 즐겨찾기
                                                </li>
                                                <li 
                                                    className={styles.myFavSubMenuItem }
                                                    onClick={() => sideNavigation(PATH.MY_INSTALLMENT)}
                                                >
                                                    <span>•</span>적금 즐겨찾기
                                                </li>
                                            </ul>
                                            <li
                                                className={styles.mySubMenuItem}
                                                onClick={() => sideNavigation(PATH.MY_INFO)}
                                            >
                                                회원정보
                                            </li>
                                            <li
                                                className={styles.mySubMenuItem}
                                                onClick={() => sideNavigation(PATH.MY_CALENDAR)}
                                            >
                                                적금달력
                                            </li>
                                        </ul>
                                    )}
                                </div>


                                {/* (비회원, 회원) 비회원은 고객센터만 보여야함 */}
                                <li className={ styles.sideMainItem }>
                                    고객센터
                                </li>

                            </ul>{/* //<ul className={ styles.sideUserList }> */}


                        </div>{/* //<div className={ styles.mobileSideMain }> */}

                    </nav>
                </div>
            )}


        </header>
    );
};

export default Header;