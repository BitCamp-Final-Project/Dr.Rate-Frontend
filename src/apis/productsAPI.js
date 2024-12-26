/* src/apis/productsAPI.js */

import { PATH } from 'src/utils/path';
import axios from 'axios';

/**
 * 특정 상품의 상세 정보를 가져오는 API
 * @param {string} prdId - 상품 ID
 * @returns {Promise<object>} - 상품 상세 정보
 */
export const getProductDetails = async (prdId) => {
    try {
        const response = await axios.get(`${PATH.SERVER}/api/product/getOneProduct/${prdId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching product details:", error);
        throw error;
    }
};

export const banks = [
    { name: '전체', code: null },
    { name: '기업은행', code: 10026 },
    { name: '국민은행', code: 10927 },
    { name: '농협은행', code: 13175 },
    { name: '부산은행', code: 10017 },
    { name: '아이엠뱅크', code: 10016 },
    { name: '우리은행', code: 10001 },
    { name: '신한은행', code: 11625 },
    { name: '카카오뱅크', code: 15130 },
    { name: '토스뱅크', code: 17801 },
    { name: '하나은행', code: 13909 },
    { name: '전북은행', code: 10022 },
    { name: '기타', code: 10000 }
];

/**
 * 모든 상품을 가져오는 API
 * @returns {Promise<Array>} - 상품 목록
 */
export const getAllProducts = async () => {
    try {
        const response = await axios.get(`${PATH.SERVER}/api/product/getAllProducts`);
        return response.data;
    } catch (error) {
        console.error("Error fetching product details:", error);
        throw error;
    }
};