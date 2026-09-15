import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
  plugins: [react()],
  server: {
    proxy: {
      // Avoid browser CORS during local Google auth / guest API calls
      '/api': {
        target: 'https://api.varalabs.in',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
