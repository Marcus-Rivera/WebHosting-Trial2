import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  // For local dev server proxy (optional)
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // your backend dev server
        changeOrigin: true,
        secure: false
      }
    }
  },

  // Build settings for production (Render)
  build: {
    outDir: 'dist',
  },

  // Define environment variables
  define: {
    __BACKEND_URL__: JSON.stringify(
      process.env.BACKEND_URL || 'https://tara-backend.onrender.com'
    ),
  },
})
