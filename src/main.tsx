import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { useStore } from './state/store';

// Check if direct URL path is /probe
if (window.location.pathname.endsWith('/probe') || window.location.hash.startsWith('#probe')) {
  useStore.setState({
    stack: [{ type: 'probe' }],
    currentScreen: { type: 'probe' },
  });
}

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

// Register Service Worker to automatically cache all assets locally in Chromium
if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
  window.addEventListener('load', () => {
    const swUrl = `${(import.meta as any).env?.BASE_URL || './'}sw.js`;
    navigator.serviceWorker.register(swUrl).catch((err) => {
      console.warn('Service worker registration failed:', err);
    });
  });
}
