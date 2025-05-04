import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { loadMessages } from './utils/loadMessages.js';
import { setIsConnected } from './globals.js';

// Initialize connection status
setIsConnected(null);

// Track logout status to prevent loops
let isLoggingOut = false;
let lastLogoutTime = 0;
const LOGOUT_COOLDOWN = 5000; // 5 seconds between logout attempts

async function init() {
  try {
    await loadMessages();
    
    // Register service worker and listen for messages
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/service-worker.js');
        console.log('Service Worker registered:', registration.scope);
        
        // Set up message listener for service worker
        navigator.serviceWorker.addEventListener('message', event => {
          const { type, isConnected } = event.data;
          console.log('Service Worker message received:', event.data);

          if (type === 'updateConnectionStatus') {
            setIsConnected(isConnected);
          } 
          else if (type === 'logout') {
            handleLogout();
          }
        });
      } catch (err) {
        console.error('Service Worker registration failed:', err);
      }
    }

    // Render the app
    const rootElement = document.getElementById('root');
    if (rootElement) {
      createRoot(rootElement).render(
        <StrictMode>
          <App />
        </StrictMode>
      );
    } else {
      console.error('Root element not found');
    }
  } catch (error) {
    console.error('Initialization error:', error);
  }
}

// Separate function to handle logout logic
function handleLogout() {
  const now = Date.now();
  
  // Check if we're already logging out or if cooldown is active
  if (isLoggingOut || (now - lastLogoutTime < LOGOUT_COOLDOWN)) {
    console.log("Ignoring duplicate logout request (cooldown active)");
    return;
  }
  
  // Set flags to prevent multiple logout executions
  isLoggingOut = true;
  lastLogoutTime = now;
  
  console.warn("Session expired or logged in elsewhere. Logging out.");
  
  // Clear cookies
  document.cookie = "session_key=; path=/; max-age=0;";
  document.cookie = "username=; path=/; max-age=0;";
  document.cookie = "private_key=; path=/; max-age=0;";
  
  // Add a small delay before redirecting
  setTimeout(() => {
    console.log("Redirecting to /...");
    
    // Use replace instead of href to prevent adding to browser history
    window.location.replace("/");
    
    // Reset the logout flag after redirecting
    setTimeout(() => {
      isLoggingOut = false;
    }, 2000);
  }, 100);
}

// Start initialization
init().catch(error => {
  console.error('Fatal initialization error:', error);
});