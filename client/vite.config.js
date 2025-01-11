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
import { base } from './src/config'

// https://vite.dev/config/
export default defineConfig({
  // server: {
  //   host: '0.0.0.0', // This allows access from other devices
  //   port: 5173
  // },
  base: base,
  plugins: [react()],
  build: {
    outDir: "..",
    emptyOutDir:false,
  }
})