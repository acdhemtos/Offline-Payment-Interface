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
  base: './',
  plugins: [react()],
  build: {
    outDir: "../../account",
    emptyOutDir:true,
  }
})