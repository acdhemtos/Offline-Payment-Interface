// import { defineConfig } from 'vite';

// export default defineConfig({
//   build: {
//     rollupOptions: {
//       input: {
//         main: './index.html', 
//         login: './public/account/login.html', 
//         signup: './public/account/signup.html', 
//       },
//     },
//   },
// });

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://192.168.213.145:8081/',
        changeOrigin: true
      }
    },
    host: '0.0.0.0', // This allows access from other devices
    port: 443
  },
  base: './',
  plugins: [react()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  publicDir: "public",
})