import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { loadMessages } from './utils/loadMessages.js';
import { setIsConnected } from './globals.js';
import { useNavigate } from 'react-router-dom';

setIsConnected(null);


async function init() {
  await loadMessages();
  .useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("message", (event) => {
        const { type, isConnected } = event.data;
  
        if (type === "updateConnectionStatus") {
          setIsConnectedState(isConnected); // optional
        } else if (type === "logout") {
          alert("Session expired or invalid response from server. Logging out.");
          document.cookie = "session_key=; path=/; max-age=0";
          document.cookie = "username=; path=/; max-age=0";
          document.cookie = "private_key=; path=/; max-age=0";
          window.location.href = "/";
        }
      });
    }
  }, []);
  
  // Register service worker and listen for messages
 

  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

init();