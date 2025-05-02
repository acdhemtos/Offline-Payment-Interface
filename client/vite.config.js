import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

// https://vite.dev/config/
export default defineConfig({
  server: {
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
    port: parseInt(process.env.VITE_PORT, 10) || 3000,
    hmr: {
      protocol: 'wss',
      host: 'myapp.local',
      port: 3000,
      clientPort: 3000
    },
  base: '/',
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  publicDir: 'public',
});
