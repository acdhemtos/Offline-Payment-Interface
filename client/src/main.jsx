import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { loadMessages, messages } from './utils/loadMessages.js';

async function init() {
  await loadMessages();
  console.log("Messages after loading:", messages);
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

init();