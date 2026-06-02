import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/auth': 'http://localhost:5001',
      '/animals': 'http://localhost:5001',
      '/shelters': 'http://localhost:5001',
      '/adoptions': 'http://localhost:5001',
      '/uploads': 'http://localhost:5001',
    },
  },
})