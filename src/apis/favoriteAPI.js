/* 상품상세페이지; ProductDetailPage */

import axiosInstanceAPI from 'src/apis/axiosInstanceAPI.js';
import { PATH } from 'src/utils/path';



/**
 * 즐겨찾기 여부 확인
 * @param {number} prdId - 상품 ID
 * @returns {Promise<boolean>} - 즐겨찾기 여부 (true/false)
 */
const checkFavorite = async (prdId) => {
  const response = await axiosInstanceAPI.get(
    `${PATH.SERVER}/api/favorite/checkFavorite/${prdId}`
  );
  return response.data.result;
};



/**
 * 즐겨찾기 추가
 * @param {number} prdId - 상품 ID
 * @returns {Promise<Object>} - API 응답 데이터
 */
const addFavorite = async (prdId) => {
    const response = await axiosInstanceAPI.post(
      `${PATH.SERVER}/api/favorite/addFavorite`, 
      { prdId } 
    );
    return response.data;
  };



/**
 * 즐겨찾기 취소
 * @param {number} prdId - 상품 ID
 * @returns {Promise<Object>} - API 응답 데이터
 */
const cancelFavorite = async (prdId) => {
  const response = await axiosInstanceAPI.delete(
    `${PATH.SERVER}/api/favorite/cancelFavorite/${prdId}`
  );
  return response.data;
};


export { checkFavorite, addFavorite, cancelFavorite };
