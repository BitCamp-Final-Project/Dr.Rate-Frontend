import React, {useEffect} from 'react';
import styles from './MyNav.module.scss';
import { useNavigate, useLocation } from "react-router-dom";
import { PATH } from "src/utils/path";
import downArrowIcon from 'src/assets/icons/downDetailArrow.svg';
import useDropdown from 'src/hooks/useDropdown';


const MyNav = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isPathActive = (paths) => paths.some((path) => location.pathname.includes(path));
    const {
        isDropdownOpen: isFavoritesDropdownOpen,
        dropdownRef: favoritesDropdownRef,
        handleMouseEnter: handleFavoritesMouseEnter,
        handleMouseLeave: handleFavoritesMouseLeave,
    } = useDropdown();

    const {
        isDropdownOpen: isInquiryDropdownOpen,
        dropdownRef: inquiryDropdownRef,
        handleMouseEnter: handleInquiryMouseEnter,
        handleMouseLeave: handleInquiryMouseLeave,
    } = useDropdown();

    return (
        <nav id="MyNav" className={styles.myNav}>
            <ul className={styles.myMenuList}>
                <li 
                    className={styles.myMenuItem} 
                    onMouseEnter={handleFavoritesMouseEnter}
                    onMouseLeave={handleFavoritesMouseLeave}                
                    style={{
                        color: isPathActive([PATH.MY_DEPOSIT, PATH.MY_INSTALLMENT]) ? 'var(--main1)' : 'inherit',
                    }}             
                >
                    즐겨찾기
                    <img src={downArrowIcon} alt="Down arrow" className={styles.myNavDownArrow} />
                    {isFavoritesDropdownOpen  && (
                        <ul className={styles.MyDropdownMenu} ref={favoritesDropdownRef}>
                            <li className={styles.MyDropdownItem} onClick={() => navigate(PATH.MY_DEPOSIT)}>
                                예금 즐겨찾기
                            </li>
                            <li className={styles.MyDropdownItem} onClick={() => navigate(PATH.MY_INSTALLMENT)}>
                                적금 즐겨찾기
                            </li>
                        </ul>
                    )}
                </li>

                <li 
                    className={styles.myMenuItem} 
                    onClick={() => navigate(PATH.MY_INFO)}
                    style={{
                        color: isPathActive([PATH.MY_INFO, PATH.MY_EDIT, PATH.MY_WITHDRAW]) ? 'var(--main1)' : 'inherit',
                    }}                    
                >
                    회원 정보
                </li>

                <li 
                    className={styles.myMenuItem} 
                    onClick={() => navigate(PATH.MY_CALENDAR)}
                    style={{
                        color: location.pathname.includes(PATH.MY_CALENDAR) ? 'var(--main1)' : 'inherit',
                    }}                    
                >
                    적금 달력
                </li>
                <li
                    className={styles.myMenuItem}
                    onMouseEnter={handleInquiryMouseEnter}
                    onMouseLeave={handleInquiryMouseLeave}
                    style={{
                        color: isPathActive([PATH.MY_EMAIL_INQUIRE, PATH.MY_1V1_INQUIRE]) ? 'var(--main1)' : 'inherit',
                    }} 
                >
                    문의 내역
                    <img src={downArrowIcon} alt="Down arrow" className={styles.myNavDownArrow} />
                    {isInquiryDropdownOpen && (
                        <ul className={styles.InquireDropdownMenu} ref={inquiryDropdownRef}>
                            <li className={styles.MyDropdownItem} onClick={() => navigate(PATH.MY_EMAIL_INQUIRE)}>
                                이메일 문의
                            </li>
                            <li className={styles.MyDropdownItem} onClick={() => navigate(PATH.MY_1V1_INQUIRE)}>
                                1:1 문의
                            </li>
                        </ul>
                    )}
                </li>
            </ul>
        </nav>
    );
};

export default MyNav;
