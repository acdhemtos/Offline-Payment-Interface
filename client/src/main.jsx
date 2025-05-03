import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { loadMessages } from './utils/loadMessages.js';
import { isLogin } from "./utils/isLogin";

async function init() {
  // const loggedIn = await isLogin();

  // if (!loggedIn && "serviceWorker" in navigator) {
  //   const registrations = await navigator.serviceWorker.getRegistrations();
  //   for (const registration of registrations) {
  //     await registration.unregister();
  //     console.log("Service Worker unregistered for unauthenticated user.");
  //   }
  // }
  await loadMessages();
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

init();

// if ("serviceWorker" in navigator) {
//   window.addEventListener("load", () => {
//     navigator.serviceWorker
//       .register("/service-worker.js")
//       .then((registration) => {
//         console.log("Service Worker registered with scope:", registration.scope);
//       })
//       .catch((error) => {
//         console.error("Service Worker registration failed:", error);
//       });
//   });
// }

// window.addEventListener('beforeinstallprompt', (event) => {
//   event.preventDefault(); 
//   alert("HELLO");
// });