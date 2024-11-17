import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://real-time-chat-app-backend-kob0.onrender.com', // replace with your backend URL
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
