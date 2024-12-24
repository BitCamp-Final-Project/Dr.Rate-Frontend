/* src/hooks/useFavorite.js */
/* 상품상세페이지; ProductDetailPage */

import { useState, useEffect } from 'react';
import { checkFavorite, addFavorite, cancelFavorite } from 'src/apis/favoriteAPI';

export const useFavorite = (prdId) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  /* 즐겨찾기 상태 확인 */
  useEffect(() => {
      const fetchFavoriteStatus = async () => {
          try {
              const isFavoriteStatus = await checkFavorite(prdId);
              setIsFavorite(isFavoriteStatus);
              setErrorMessage(null);
          } catch (error) {
                if (error.response && error.response.data && error.response.data.message) {
                    setErrorMessage(error.response.data.message); // 메시지 저장
                } else {
                    console.error("Error fetching favorite status:", error);
                }
          } 
      };

      if (prdId) { 
        fetchFavoriteStatus();
    }
  }, [prdId]);


  /* 즐겨찾기 토글 */
  const toggleFavorite = async () => {
      try {
          if (isFavorite) {
              await cancelFavorite(prdId);
              setIsFavorite(false);
              setErrorMessage(null);
          } else {
              await addFavorite(prdId);
              setIsFavorite(true);
              setErrorMessage(null);
          }
      } catch (error) {
        if (error.response?.data?.message) {
            setErrorMessage(error.response.data.message); 
            throw new Error(error.response.data.message); // 에러를 호출한 곳으로 전달
          } else {
            setErrorMessage("즐겨찾기 작업 중 알 수 없는 오류가 발생했습니다.");
            throw new Error(defaultError); // 기본 메시지 전달
          }
      }
  };

  return { isFavorite, toggleFavorite, errorMessage };


};
