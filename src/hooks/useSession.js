/* src/hooks/useSession.js */

import { useAtom } from 'jotai';
import { isLoggedInAtom } from 'src/atoms/sessionAtom';

export const useSession = () => {
  const [isLoggedIn, setIsLoggedIn] = useAtom(isLoggedInAtom);

  // 로그인 상태 업데이트
  const updateSession = (token) => {
    if (token) {
      localStorage.setItem('Authorization', token); // 로컬 스토리지에 토큰 저장
      setIsLoggedIn(true); // 상태를 true로 설정
    } else {
      const savedToken = localStorage.getItem('Authorization'); // 저장된 토큰 확인
      if (savedToken) {
        setIsLoggedIn(true); // 토큰이 있으면 상태를 true로 업데이트
      }
    }
  };

  // 로그아웃 처리
  const clearSession = () => {
    localStorage.removeItem('Authorization'); // 로컬 스토리지에서 토큰 삭제
    setIsLoggedIn(false); // 상태를 false로 업데이트
  };

  return { isLoggedIn, updateSession, clearSession };
};






