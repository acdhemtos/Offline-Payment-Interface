import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

// https://vite.dev/config/
export default defineConfig({
  server: {
    hmr: false,
    historyApiFallback: true,
    host: "myapp.local",
    https: process.env.VITE_HTTPS === 'true' && {
      key: fs.readFileSync(process.env.VITE_SSL_KEY_FILE), 
      cert: fs.readFileSync(process.env.VITE_SSL_CRT_FILE), 
    },
    proxy: {
      '/api': {
        target: process.env.VITE_API_BASE_URL, 
        changeOrigin: true,
      },
    },
    // host: '0.0.0.0',
    port: parseInt(process.env.VITE_PORT, 10) || 3000, 
  },
  base: '/',
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  publicDir: 'public',
});