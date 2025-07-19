import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'https://freshbasket-54ji.onrender.com',
        changeOrigin: true,
        secure: true,
      }
    }
  }
})
