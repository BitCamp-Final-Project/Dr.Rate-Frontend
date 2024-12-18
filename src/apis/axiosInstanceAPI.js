import axios from 'axios';
import {PATH} from "../utils/path.js";

// axios 인스턴스 생성
const api = axios.create({
  baseURL: 'http://localhost:8080', // 서버의 기본 URL
  timeout: 10000,  // 타임아웃 설정
});

// Request 인터셉터
api.interceptors.request.use(
  (config) => {
    // JWT 토큰을 localStorage에서 가져옴
    const token = localStorage.getItem('accessToken');
    if (token) {
      // 요청 헤더에 JWT 토큰 추가
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response 인터셉터
api.interceptors.response.use(
  (response) => {
    return response;  // 응답을 그대로 반환
  },
  async (error) => {
    // 응답 에러가 발생하고, 토큰 만료가 원인인 경우
    if (error.response && error.response.status === 401) {
      const originalRequest = error.config;  // 원래 요청 정보

      // 이미 토큰 재발급 요청 중인 경우 재시도 하지 않도록 설정
      if (originalRequest._retry) {
        return Promise.reject(error);  // 재시도 방지
      }

      // 토큰 재발급 요청을 보내기 전에 _retry를 true로 설정
      originalRequest._retry = true;

      try {
        // Redis에 저장된 accessToken을 서버로 요청해서 비교하고, 새로운 accessToken 발급 받기
        const currentAccessToken = localStorage.getItem('accessToken');

        const response = await api.post('/api/auth/refresh', { access_token: currentAccessToken });

        // 새로운 액세스 토큰을 받아온 후
        const newAccessToken = response.data.token;
        localStorage.setItem('accessToken', newAccessToken); // 새로운 토큰을 저장

        // 새로운 토큰을 요청 헤더에 추가하고, 원래의 요청을 재전송
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        // 원래 요청을 다시 보냄
        return api(originalRequest);
      } catch (refreshError) {
        console.error("토큰 갱신 실패", refreshError);
        // 토큰 갱신 실패 시 처리 (예: 로그인 페이지로 이동)
        window.location.href = `${PATH.SIGN_IN}`;
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);  // 다른 에러는 그대로 반환
  }
);

export default api;
