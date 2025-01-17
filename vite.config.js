import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // 환경 변수 로드
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    resolve: {
      alias: {
        src: '/src', // 절대 경로를 사용할 수 있도록 설정
      },
    },
    server: {
      port: parseInt(env.VITE_PORT) || 5173, // .env에서 VITE_PORT 가져오기, 기본값 5173
      proxy: {
        '/ws': {
          changeOrigin: true,
          ws: true, // WebSocket 프록시 활성화
        },
      },
    },
    define: {
      global: {},
      'process.env.REACT_ROUTER_USE_START_TRANSITION': true, // Future Flag for v7_startTransition
      'process.env.REACT_ROUTER_USE_RELATIVE_SPLAT_PATHS': true, // Future Flag for v7_relativeSplatPath
    },
    esbuild: {
      jsxFactory: 'React.createElement', // JSX 구문을 React.createElement로 처리
      jsxFragment: 'React.Fragment',    // Fragment를 React.Fragment로 처리
    },
  };
});
