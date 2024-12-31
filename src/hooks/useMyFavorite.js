/* src/hooks/useMyFavorite.js */
/* 마이페이지 즐겨찾기; MyDepositPage, MyInstallmentPage */

import { useLocation } from 'react-router-dom';
import { useCallback, useState, useEffect } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
    categoryAtom,
    searchKeyAtom,
    searchValueAtom,
    individualCheckedAtom,
    setIndividualCheckedAtom,
    setAllCheckedAtom,
    favoriteDataAtom,
    hasSelectedItemsAtom,
} from 'src/atoms/myFavoriteAtom';
import { getFavorite, searchFavorite, deleteFavorite } from 'src/apis/myFavoriteAPI';
import useModal from 'src/hooks/useModal';



const useMyFavorite = () => {
    const location = useLocation();

    // 상태 및 Atom 관리
    const [category, setCategory] = useAtom(categoryAtom);
    const [favoriteData, setFavoriteData] = useAtom(favoriteDataAtom);
    const [searchKey, setSearchKey] = useAtom(searchKeyAtom);
    const [searchValue, setSearchValue] = useAtom(searchValueAtom);
    const individualChecked = useAtomValue(individualCheckedAtom);
    const setIndividualChecked = useSetAtom(setIndividualCheckedAtom);
    const setAllCheckedState = useSetAtom(setAllCheckedAtom);
    const hasSelectedItems = useAtomValue(hasSelectedItemsAtom); // 선택된 항목이 있는지 확인

    const [loading, setLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState(null); // 에러 상태
    const [prevCategory, setPrevCategory] = useState("");



    const {         
        isAlertOpen,
        openAlertModal,
        closeAlertModal,
        alertContent,
        isConfirmOpen,
        openConfirmModal,
        closeConfirmModal,
        confirmContent, 
    } = useModal();



    /* 개별 체크박스 상태 업데이트 */
    const handleIndividualCheck = (index, isChecked) => {
        setIndividualChecked((prev) => {
            const updatedArray = [...prev];
            updatedArray[index] = isChecked;
            return updatedArray;
        });
    };


    /* 마이페이지 즐겨찾기 조회 */
    const fetchFavorites = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getFavorite(category);
            setFavoriteData(data);
            setIndividualChecked(new Array(data.length).fill(false));
            setAllCheckedState(false);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [category, setFavoriteData]);


    /* 페이지 URL 변경 감지 시 데이터 리로드 */
    useEffect(() => {
        setSearchValue('');
        fetchFavorites();
    }, [fetchFavorites, location.pathname]); 


    /* 마이페이지 즐겨찾기 검색 */
    const handleSearch = useCallback(async () => {
        try {
            setLoading(true);
            const searchResults = await searchFavorite(category, searchKey, searchValue);
            setFavoriteData(searchResults);
            setIndividualChecked(new Array(searchResults.length).fill(false));
            setAllCheckedState(false);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [category, searchKey, searchValue, setFavoriteData, setIndividualChecked, setAllCheckedState]);

    




    /* 마이페이지 즐겨찾기 삭제 */
    // const handleConfirm = async () => {
    //     const selectedIds = favoriteData
    //         .filter((_, index) => individualChecked[index]) // 선택된 항목 필터링
    //         .map((item) => item.favoriteId); // ID만 추출

    //     try {
    //         await deleteFavorite(selectedIds); // API 호출
    //         await fetchFavorites(); // 삭제 후 목록 갱신
    //         closeConfirmModal();
    //     } catch (error) {
    //         console.error('삭제 중 에러 발생:', error);
    //         throw error;
    //     }
    // };

    // /* 취소 버튼 클릭 */
    // const handleCancel = () => {
    //     closeConfirmModal(); 
    // };

    // /* 삭제 버튼 클릭 */
    // const handleDeleteClick = () => {
    //     if (!hasSelectedItems) {
    //         openAlertModal('삭제할 항목이 없습니다', '삭제할 상품을 선택해주세요');
    //         return;
    //     }

    //     // 확인 모달 표시
    //     openConfirmModal(
    //         '선택한 항목을 삭제하시겠습니까?',
    //         '삭제할 항목을 확인해주세요.',
    //         handleConfirm, 
    //         handleCancel
    //     );
    // };


    const handleDeleteClick = useCallback(() => {
        if (!hasSelectedItems) {
            openAlertModal('삭제할 항목이 없습니다', '삭제할 상품을 선택해주세요.');
            return;
        }

        openConfirmModal(
            '선택한 항목을 삭제하시겠습니까?',
            '삭제할 항목을 확인해주세요.',
            async () => {
                const selectedIds = favoriteData
                    .filter((_, index) => individualChecked[index])
                    .map((item) => item.favoriteId);

                try {
                    setLoading(true);
                    await deleteFavorite(selectedIds);
                    await fetchFavorites();
                } catch (error) {
                    console.error('삭제 중 에러 발생:', error);
                } finally {
                    closeConfirmModal();
                    setLoading(false);
                }
            },
            closeConfirmModal
        );
    }, [
        hasSelectedItems,
        favoriteData,
        individualChecked,
        fetchFavorites,
        openConfirmModal,
        closeConfirmModal,
        openAlertModal,
    ]);





    return {
        individualChecked,
        handleIndividualCheck,
        favoriteData,
        fetchFavorites,
        loading,
        error,
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
    };
};

export default useMyFavorite;
