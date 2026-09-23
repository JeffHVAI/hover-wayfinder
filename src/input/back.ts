import { useStore } from '../state/store';

export function setupBackGuard(): () => void {
  // Ensure we have two history entries so back navigation doesn't exit Chromium
  try {
    history.replaceState({ root: true }, '');
    history.pushState({ guard: true }, '');
  } catch {
    // ignore
  }

  const handlePopState = () => {
    const store = useStore.getState();
    store.recordActivity();

    if (store.stack.length > 1) {
      store.popScreen();
    }

    // Re-arm the sentinel if we hit the root history state
    if (history.state?.root) {
      try {
        history.pushState({ guard: true }, '');
      } catch {
        // ignore
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'BrowserBack' || (e.altKey && e.key === 'ArrowLeft')) {
      e.preventDefault();
      const store = useStore.getState();
      store.recordActivity();
      if (store.stack.length > 1) {
        store.popScreen();
      }
    }
  };

  window.addEventListener('popstate', handlePopState);
  window.addEventListener('keydown', handleKeyDown);

  return () => {
    window.removeEventListener('popstate', handlePopState);
    window.removeEventListener('keydown', handleKeyDown);
  };
}

export const initBackGuard = setupBackGuard;

export function pushHistorySentinel() {
  try {
    history.pushState({ screen: true }, '');
  } catch {
    // ignore
  }
}
