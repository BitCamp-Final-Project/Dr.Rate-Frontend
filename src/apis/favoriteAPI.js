/* src/apis/favoriteAPI.js */
/* 상품상세페이지; ProductDetailPage */

import axios from 'axios';
import { PATH } from 'src/utils/path';

const getSessionToken = () => {
  // return localStorage.getItem('sessionToken'); 
  // 그냥 토큰키 넣어서 함.
  return "eyJhbGciOiJIUzI1NiJ9.eyJpZCI6OCwiY2F0ZWdvcnkiOiJhY2Nlc3MiLCJyb2xlIjoiUk9MRV9VU0VSIiwiaWF0IjoxNzM0NDg0NTUyLCJleHAiOjE3MzQ1NzA5NTJ9.hTBolZi4LYfZ9vwOxVtxOjQW0ZNthnUEh9kwDCCORpA";
};


const checkFavorite = async (prdId) => {
  const response = await axios.get(`${PATH.SERVER}/api/favorite/checkFavorite/${prdId}`, { 
    headers : { 'Authorization' : `Bearer ${getSessionToken()}`}
  });
  return response.data.result;
}


const addFavorite = async (prdId) => {
  const response = await axios.post(`${PATH.SERVER}/api/favorite/addFavorite`, 
    { prdId },
    { headers : { 'Authorization' : `Bearer ${getSessionToken()}`}}
    
  );
  return response.data;
};

const cancelFavorite = async (prdId) => {
  const response = await axios.delete(`${PATH.SERVER}/api/favorite/cancelFavorite/${prdId}`, {
    headers : { 'Authorization' : `Bearer ${getSessionToken()}`}
  });
  return response.data;
};

export { checkFavorite, addFavorite, cancelFavorite };
