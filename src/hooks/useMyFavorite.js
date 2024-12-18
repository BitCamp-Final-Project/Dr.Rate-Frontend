/* src/hooks/useMyFavorite.js */
/* 마이페이지 즐겨찾기; MyDepositPage, MyInstallmentPage */

import { useLocation } from 'react-router-dom';
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
import { useCallback, useState, useEffect } from 'react';
import { getFavorite, searchFavorite, deleteFavorite } from 'src/apis/myFavoriteAPI';

// const useMyFavorite = (dataLength) => {
const useMyFavorite = () => {
    const location = useLocation();

    // 상태 및 Atom 관리
    const category = useAtomValue(categoryAtom);
    const [favoriteData, setFavoriteData] = useAtom(favoriteDataAtom);
    const [searchKey, setSearchKey] = useAtom(searchKeyAtom);
    const [searchValue, setSearchValue] = useAtom(searchValueAtom);
    const individualChecked = useAtomValue(individualCheckedAtom);
    const setIndividualChecked = useSetAtom(setIndividualCheckedAtom);
    const setAllCheckedState = useSetAtom(setAllCheckedAtom);
    const hasSelectedItems = useAtomValue(hasSelectedItemsAtom); //  선택된 항목이 있는지 확인

    const [loading, setLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState(null); // 에러 상태


    /* 개별 체크박스 상태 업데이트 */
    const handleIndividualCheck = (index, isChecked) => {
        setIndividualChecked((prev) => {
            const updatedArray = [...prev];
            updatedArray[index] = isChecked;
            console.log(updatedArray);
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
    }, [category, setFavoriteData, setIndividualChecked, setAllCheckedState]);


    /* 페이지 URL 변경 감지 시 데이터 리로드 */
    useEffect(() => {
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
    const handleDelete = async (openAlertModal) => { 
        if (!hasSelectedItems) {
            openAlertModal('삭제할 항목이 없습니다', '삭제할 상품을 선택해주세요');
            return;
        }

        const selectedIds = favoriteData
            .filter((_, index) => individualChecked[index]) // 선택된 항목 필터링
            .map((item) => item.favoriteId); // ID만 추출

        try {
            await deleteFavorite(selectedIds); // API 호출
            await fetchFavorites(); // 삭제 후 목록 갱신
        } catch (error) {
            console.error('삭제 중 에러 발생:', error);
            throw error;
        }
    };







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
        handleDelete,

    };
};

export default useMyFavorite;
