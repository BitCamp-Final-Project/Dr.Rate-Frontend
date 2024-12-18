/* src/apis/myFavoriteAPI.js */
/* 마이페이지 즐겨찾기; MyDepositPage, MyInstallmentPage */

import axios from 'axios';
import { PATH } from 'src/utils/path';


const getSessionToken = () => {
    // return localStorage.getItem('sessionToken'); 
    // 그냥 토큰키 넣어서 함.
    return "eyJhbGciOiJIUzI1NiJ9.eyJpZCI6OCwiY2F0ZWdvcnkiOiJhY2Nlc3MiLCJyb2xlIjoiUk9MRV9VU0VSIiwiaWF0IjoxNzM0NDg0NTUyLCJleHAiOjE3MzQ1NzA5NTJ9.hTBolZi4LYfZ9vwOxVtxOjQW0ZNthnUEh9kwDCCORpA";
};



const getFavorite= async (category) => {
    const response = await axios.get(`${PATH.SERVER}/api/favorite/getFavorite`, { 
        params: { category }, // deposit 또는 installment
        headers : { 'Authorization' : `Bearer ${getSessionToken()}`}
      });
      return response.data.result;
};

const searchFavorite= async (category, searchKey, searchValue) => {
    const response = await axios.get(`${PATH.SERVER}/api/favorite/searchFavorite`, {
      params: { 
        category,   // deposit 또는 installment
        searchKey,  // bankName 또는 prdName
        searchValue // 입력값
      }, 
        headers : { 'Authorization' : `Bearer ${getSessionToken()}`}
      });
      return response.data.result;
};

const deleteFavorite = async (favoriteIds) => {
  const response = await axios.delete(`${PATH.SERVER}/api/favorite/deleteFavorite`, {
      headers: { 'Authorization': `Bearer ${getSessionToken()}` },
      data: { favoriteIds }, 
  });
  return response.data;
};





export { getFavorite, searchFavorite, deleteFavorite };
