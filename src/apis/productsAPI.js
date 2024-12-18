/* src/apis/productsAPI.js */

import { PATH } from "src/utils/path";
import axios from "axios";



/**
 * 세션 토큰 가져오기
 * @returns {string} - 세션 토큰
 */
export const getSessionToken = () => {
    return localStorage.getItem('sessionToken');
};


/**
 * 특정 상품의 상세 정보를 가져오는 API
 * @param {string} prdId - 상품 ID
 * @returns {Promise<object>} - 상품 상세 정보
 */
export const getProductDetails = async (prdId) => {
    try {
        const response = await axios.get(`${PATH.SERVER}/product/getOneProduct/${prdId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching product details:", error);
        throw error;
    }
};

export const banks = [
    { name: '전체', code: null },
    { name: '국민은행', code: 10001 },
    { name: '농협은행', code: 10927 },
    { name: '신한은행', code: 11625 },
    { name: '우리은행', code: 13175 },
    { name: '카카오뱅크', code: 13909 },
    { name: '토스뱅크', code: 15130 },
    { name: '하나은행', code: 17801 },
    { name: '기타', code: 10000 }
];

/* 상품 가져오면 사라질 부분 */
export const products = [
    {
        prdCo: '0',
        bankLogo: 'kookminLogo.png',
        bankName: '국민은행',
        productName: 'KB Star 정기적금',
        spclrate: '최고금리 4.3%',
        basicRate: '기본금리 3.2%',
        bankCode: 10001
    },
    {
        prdCo: '1',
        bankLogo: 'nonghyupLogo.png',
        bankName: '농협은행',
        productName: 'NH 농협 정기적금',
        spclrate: '최고금리 4.1%',
        basicRate: '기본금리 3.0%',
        bankCode: 10927
    },
    {
        prdCo: '2',
        bankLogo: 'shinhanLogo.png',
        bankName: '신한은행',
        productName: '신한 정기적금',
        spclrate: '최고금리 4.0%',
        basicRate: '기본금리 3.1%',
        bankCode: 11625
    },
    {
        prdCo: '3',
        bankLogo: 'wooriLogo.png',
        bankName: '우리은행',
        productName: '우리 정기적금',
        spclrate: '최고금리 4.5%',
        basicRate: '기본금리 3.3%',
        bankCode: 13175
    },
    {
        prdCo: '4',
        bankLogo: 'kakaoLogo.png',
        bankName: '카카오뱅크',
        productName: '카카오 정기적금',
        spclrate: '최고금리 4.2%',
        basicRate: '기본금리 3.0%',
        bankCode: 13909
    },
    {
        prdCo: '5',
        bankLogo: 'tossLogo.png',
        bankName: '토스뱅크',
        productName: '토스 정기적금',
        spclrate: '최고금리 4.4%',
        basicRate: '기본금리 3.2%',
        bankCode: 15130
    },
    {
        prdCo: '6',
        bankLogo: 'hanaLogo.png',
        bankName: '하나은행',
        productName: '하나 정기적금',
        spclrate: '최고금리 4.0%',
        basicRate: '기본금리 3.1%',
        bankCode: 17801
    },
    {
        prdCo: '7',
        bankLogo: 'remainLogo.png',
        bankName: '기타',
        productName: '기타 정기적금',
        spclrate: '최고금리 4.6%',
        basicRate: '기본금리 3.4%',
        bankCode: 10000
    },
    {
        prdCo: '8',
        bankLogo: 'wooriLogo.png',
        bankName: '우리은행',
        productName: '우리 기본 정기적금',
        spclrate: '최고금리 3.8%',
        basicRate: '기본금리 2.9%',
        bankCode: 13175
    },
    {
        prdCo: '9',
        bankLogo: 'shinhanLogo.png',
        bankName: '신한은행',
        productName: '신한 베스트 정기적금',
        spclrate: '최고금리 4.3%',
        basicRate: '기본금리 3.0%',
        bankCode: 11625
    }
];