import React, { useState, useEffect } from 'react';

interface RetryScreenProps {
  errorMessage: string;
  onRetry: () => void;
  autoRetrySeconds?: number;
}

export const RetryScreen: React.FC<RetryScreenProps> = ({
  errorMessage,
  onRetry,
  autoRetrySeconds = 15,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(autoRetrySeconds);

  useEffect(() => {
    setSecondsRemaining(autoRetrySeconds);
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          onRetry();
          return autoRetrySeconds;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [autoRetrySeconds, onRetry]);

  return (
    <div className="retry-screen-container">
      <div className="retry-card">
        <div className="retry-icon-wrapper">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        <h1 className="retry-title">Unable to Connect to Venue Map</h1>
        <p className="retry-message">{errorMessage}</p>

        <div className="retry-countdown">
          <span>Automatic reconnection in </span>
          <strong>{secondsRemaining}s</strong>
        </div>

        <div className="retry-actions">
          <button
            type="button"
            className="retry-btn primary touch-interactive"
            data-touch-target="true"
            onClick={onRetry}
          >
            Retry Now
          </button>
          <button
            type="button"
            className="retry-btn secondary touch-interactive"
            data-touch-target="true"
            onClick={() => window.location.reload()}
          >
            Reload Page
          </button>
        </div>
      </div>
    </div>
  );
};
