/* src/components/MyNav/MyNav.jsx */

import React, { useState } from 'react';
import styles from './MyNav.module.scss';
import { useNavigate, useLocation } from "react-router-dom";
import { PATH } from "src/utils/path";
import downArrowIcon from 'src/assets/icons/downDetailArrow.svg';


const MyNav = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isPathActive = (paths) => paths.some((path) => location.pathname.includes(path));
    const [isDropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };

    
    return (
        <nav id="MyNav" className={styles.myNav}>
            <ul className={styles.myMenuList}>
                <li 
                    className={styles.myMenuItem} 
                    onClick={toggleDropdown}
                    style={{
                        color: isPathActive([PATH.MY_DEPOSIT, PATH.MY_INSTALLMENT]) ? 'var(--main1)' : 'inherit',
                    }}                
                >
                    즐겨찾기
                    <img src={downArrowIcon} alt="Down arrow" className={styles.myNavDownArrow} />
                    {isDropdownOpen && (
                        <ul className={styles.dropdownMenu}>
                            <li className={styles.dropdownItem} onClick={() => navigate(PATH.MY_DEPOSIT)}>
                                예금 즐겨찾기
                            </li>
                            <li className={styles.dropdownItem} onClick={() => navigate(PATH.MY_INSTALLMENT)}>
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
            </ul>
        </nav>
    );
};

export default MyNav;
