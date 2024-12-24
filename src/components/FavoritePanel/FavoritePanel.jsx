/* src/components/FavoritePanel/FavoritePanel.jsx */

import styles from './FavoritePanel.module.scss';
import React, { useState, useEffect } from 'react';
import { PATH } from 'src/utils/path';
import { useLocation } from 'react-router-dom';
import { useAtom } from 'jotai';
import { categoryAtom, allCheckedAtom, setAllCheckedAtom } from 'src/atoms/myFavoriteAtom';
import useMyFavorite from 'src/hooks/useMyFavorite';
import useSelectDropdown from 'src/hooks/useSelectDropdown';
import rightArrowIcon from 'src/assets/icons/rightArrow.svg';
import downArrowIcon from 'src/assets/icons/downDetailArrow.svg';
import AlertModal from 'src/components/Modal/AlertModal';
import ConfirmModal from 'src/components/Modal/ConfirmModal';


const FavoritePanel = () => {
    const location = useLocation();
    // const isPathActive = (paths) => paths.some((path) => location.pathname.includes(path));
    const [, setCategory] = useAtom(categoryAtom); // category 설정


    /* 체크박스 상태 관리 */
    const [allChecked] = useAtom(allCheckedAtom);
    const [, setAllCheckedState] = useAtom(setAllCheckedAtom);

    const handleAllCheck = (e) => {
        setAllCheckedState(e.target.checked); // 전체 체크박스 상태 업데이트
    };

    const {
        searchKey,
        setSearchKey,
        searchValue,
        setSearchValue,
        handleSearch,
        hasSelectedItems,
        handleDeleteClick,
        isAlertOpen, 
        openAlertModal,
        closeAlertModal,
        alertContent,
        isConfirmOpen,
        openConfirmModal,
        closeConfirmModal,
        confirmContent, 
    } = useMyFavorite();

    /* 드롭다운 상태 관리 */
    const { isDropdownOpen, setDropdownOpen,handleToggleDropdown, dropdownRef } = useSelectDropdown();

    /* 드롭다운 항목 선택 시 상태 업데이트 */
    const handleSelectItemClick = (value) => {
        setSearchKey(value); // 검색 키 설정
        setDropdownOpen(false); // 드롭다운 닫기
    };
    

    /* 페이지 경로에 따라 category 설정 */
    useEffect(() => {
        if (location.pathname.includes(PATH.MY_DEPOSIT)) {
            setCategory('deposit');
        } else {
            setCategory('installment');
        }
    }, [location.pathname, setCategory]);
    
    
    /* searchKey 출력용 변환 함수 */
    const getDisplayText = (key) => {
        switch (key) {
            case 'bankName': return '은행';
            case 'prdName': return '상품';
            default: return '은행';
        }
    };



    return (
        <div className={ styles.favoritePanel }>

            {/* 즐겨찾기 카테고리 - 예금 or 적금 */}
            <div className={ styles.favoriteCategoryDiv }>
                <div className={ styles.favoriteCategoryItem }>즐겨찾기</div>
                <div className={ styles.favoriteCategoryItem }>
                    <img src={rightArrowIcon} alt="오른쪽 화살표" className={styles.rightArrowIcon} />
                </div>
                <div className={ styles.favoriteCategoryItem }>
                    {location.pathname.includes(PATH.MY_DEPOSIT) ? '예금' : '적금'}
                </div>
            </div>


            {/* src/components/FavoritePanel/FavoritePanel.jsx */}
            {/* 즐겨찾기 삭제 & 검색바 */}
            <div className={ styles.favoriteDeleteSearchDiv }>
                
                <input 
                    type="checkbox" 
                    name="allCheck" 
                    className={ styles.allCheck }
                    checked={allChecked}
                    onChange={handleAllCheck}
                />

                {/* 드롭다운 */}
                <div className={ styles.selectDiv } ref={dropdownRef} >
                    <div 
                        onClick={ handleToggleDropdown }
                        className={`${styles.selectDefaultDiv} ${isDropdownOpen ? styles.active : ''}`}
                    >
                        <div className={ styles.selectOptionDiv }>
                            <span className={ styles.selectOption }>{getDisplayText(searchKey)}</span>
                        </div>
                        <div className= {styles.selectArrowDiv }>
                            <img
                                src={downArrowIcon}
                                alt="Arrow"
                                className={`${styles.selectDownArrow} ${isDropdownOpen ? styles.rotated : ''}`}
                            />                            
                        </div>
                    </div>

                    {isDropdownOpen && (
                        <div className={styles.selectDropdownDiv} ref={dropdownRef}>
                            <div
                                className={styles.selectDropdownItem}
                                onClick={() => handleSelectItemClick('bankName')}
                            >
                                은행
                            </div>
                            <div
                                className={styles.selectDropdownItem}
                                onClick={() => handleSelectItemClick('prdName')}
                            >
                                상품
                            </div>
                        </div>
                    )}  
                </div>


                <input 
                    type="text"
                    value={searchValue} 
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSearch();
                        }
                    }}              
                    className={styles.favoriteSearchText}
                    placeholder="검색어"
                />

                <button 
                    className={styles.favoriteSearchBtn}
                    onClick={handleSearch}
                >
                    검색</button>

                <button 
                    className={styles.favoriteDeleteBtn}
                    onClick={() => handleDeleteClick()}
                >
                    삭제
                </button>
                <AlertModal
                    isOpen={isAlertOpen}           
                    closeModal={closeAlertModal}   
                    title={alertContent.title}     
                    message={alertContent.message} 
                />
                <ConfirmModal
                    isOpen={isConfirmOpen}           
                    closeModal={closeConfirmModal}   
                    title={confirmContent.title}     
                    message={confirmContent.message} 
                    onConfirm={confirmContent.onConfirm} 
                    onCancel={confirmContent.onCancel}   
                />                
            </div>
            
        </div>
    );
};

export default FavoritePanel;