import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./tests/setup.js",
  },
  // Dev server proxy: same-origin requests → Django (fixes auth cookies locally)
  server: {
    proxy: {
      '/api': 'http://127.0.0.1:8000',
      '/photo': 'http://127.0.0.1:8000',
      '/profile': 'http://127.0.0.1:8000',
      '/support': 'http://127.0.0.1:8000',
      '/subsidy': 'http://127.0.0.1:8000',
      '/subsidies': 'http://127.0.0.1:8000',
      '/news': 'http://127.0.0.1:8000',
      '/notify': 'http://127.0.0.1:8000',
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          oauth: ['@react-oauth/google'],
          icons: ['react-icons'],
        },
      },
    },
  },
})
