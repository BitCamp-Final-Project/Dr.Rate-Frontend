/* 마이페이지 즐겨찾기; MyDepositPage, MyInstallmentPage */

import { atom } from 'jotai';

// category 상태 관리 (deposit 또는 installment)
export const categoryAtom = atom('deposit'); // 기본 상품 유형

// favoriteData 상태
export const favoriteDataAtom = atom([]);

// 검색 키와 검색 값 상태
export const searchKeyAtom = atom('bankName'); // 기본 검색 키
export const searchValueAtom = atom(''); // 검색 값

// 전체 체크박스 상태
export const allCheckedAtom = atom(false);

// 개별 체크박스 상태 배열
export const individualCheckedAtom = atom([]);

// 전체 체크박스 상태를 업데이트하고, 개별 체크박스 상태도 동기화
export const setAllCheckedAtom = atom(
    null,
    (get, set, allChecked) => {
        const individualLength = get(individualCheckedAtom).length;
        set(individualCheckedAtom, new Array(individualLength).fill(allChecked));
        set(allCheckedAtom, allChecked);
    }
);

// 개별 체크박스 상태를 업데이트하고, 전체 체크박스 상태를 동기화
export const setIndividualCheckedAtom = atom(
    (get) => get(individualCheckedAtom),
    (get, set, updatedArray) => {
        const allChecked = Array.isArray(updatedArray) && updatedArray.every((val) => val);
        set(individualCheckedAtom, updatedArray);
        set(allCheckedAtom, allChecked);
    }
);

// 선택된 항목 여부 atom 추가
export const hasSelectedItemsAtom = atom(
    (get) => get(individualCheckedAtom).some((checked) => checked) 
);
