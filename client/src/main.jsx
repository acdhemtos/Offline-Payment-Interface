import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { loadMessages } from './utils/loadMessages.js';
import { setIsConnected } from './globals.js';
import { useNavigate } from 'react-router-dom';

setIsConnected(null);

let isLoggingOut = false; // Prevent multiple logout executions

async function init() {
  await loadMessages();

  // Register service worker and listen for messages
 

  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

init();