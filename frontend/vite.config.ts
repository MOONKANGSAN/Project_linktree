import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    // 컨테이너 외부(호스트 브라우저)에서 접근 허용
    host: true,
    port: 5173,
    proxy: {
      // docker compose watch 환경: 서비스명 'backend'으로 접근
      // 로컬 직접 실행 시에는 localhost:8080 으로 바꿔서 사용
      '/api': {
        target: 'http://backend:8080',
        changeOrigin: true,
      },
    },
  },
})
