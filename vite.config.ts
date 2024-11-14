// vite.config.ts
import { defineConfig } from 'vite'; // Vite 설정을 정의하는 함수 불러오기
import react from '@vitejs/plugin-react-swc'; // React SWC 플러그인 불러오기
import * as path from 'path'; // Node.js의 path 모듈을 불러옴

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000, // 개발 서버 포트 설정
  },
  plugins: [react()], // 사용 플러그인 설정
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // '@'를 src 디렉터리로 매핑
    },
  },
});
