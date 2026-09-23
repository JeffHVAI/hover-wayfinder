import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { useStore } from './state/store';

// Check if direct URL path is /probe
if (window.location.pathname === '/probe' || window.location.hash.startsWith('#probe')) {
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
