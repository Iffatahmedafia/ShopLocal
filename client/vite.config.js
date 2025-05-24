import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/

const isDocker = process.env.REACT_APP_API_URL?.includes("backend");

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3001,
    host: true,
    proxy: {
      "/api": {
        target: isDocker ? "http://backend:8000" : "http://localhost:8000",
        changeOrigin: true,
      },
    },
  }
})

