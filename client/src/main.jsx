import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { loadMessages } from './utils/loadMessages.js';
import { setIsConnected } from './globals.js';

setIsConnected(null);

async function init() {
  await loadMessages();

  // Register service worker and listen for messages
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('Service Worker registered:', registration.scope);
      })
      .catch(err => {
        console.error('Service Worker registration failed:', err);
      });

    navigator.serviceWorker.addEventListener('message', event => {
      const { type, isConnected } = event.data;
      console.log('Service Worker message received:', event.data);

      if (type === 'updateConnectionStatus') {
        setIsConnected(isConnected);
      } else if (type === 'logout') {
        console.warn("Session expired or logged in elsewhere. Logging out.");
        document.cookie = "session_key=; path=/; max-age=0;";
        document.cookie = "username=; path=/; max-age=0;";
        document.cookie = "private_key=; path=/; max-age=0;";
        window.location.href = "/";
        break;
      }
    });
  }

  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

init();
