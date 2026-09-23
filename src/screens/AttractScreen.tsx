import React from 'react';
import { useStore } from '../state/store';

export const AttractScreen: React.FC = () => {
  const { site, resetToHome } = useStore();

  return (
    <div
      className="attract-screen"
      onClick={resetToHome}
      onPointerDown={resetToHome}
      role="button"
      tabIndex={0}
      aria-label="Start using directory kiosk"
    >
      <div className="attract-background-glow" />

      <div className="attract-content">
        <div className="attract-venue-badge">
          <span className="badge-dot" />
          <span>Interactive Directory & Wayfinding</span>
        </div>

        <h1 className="attract-title">{site.name}</h1>
        <p className="attract-subtitle">Explore stores, dining, services, and live turn-by-turn routes</p>

        {/* 3 Gesture Showcase Cards */}
        <div className="attract-gestures-grid">
          <div className="gesture-card">
            <div className="gesture-icon-anim select-anim">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="4" fill="currentColor" />
              </svg>
            </div>
            <h3 className="gesture-name">Point & Push</h3>
            <p className="gesture-desc">Push toward screen to select stores and categories</p>
          </div>

          <div className="gesture-card">
            <div className="gesture-icon-anim scroll-anim">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <polyline points="19 12 12 19 5 12" />
                <polyline points="5 12 12 5 19 12" />
              </svg>
            </div>
            <h3 className="gesture-name">Move Up & Down</h3>
            <p className="gesture-desc">Scroll through lists or zoom the 3D map</p>
          </div>

          <div className="gesture-card">
            <div className="gesture-icon-anim swipe-anim">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </div>
            <h3 className="gesture-name">Swipe Left</h3>
            <p className="gesture-desc">Wave sideways to go back one screen</p>
          </div>
        </div>

        <div className="attract-call-to-action">
          <div className="pulse-ripple" />
          <span className="cta-text">Point at the screen or tap to start</span>
        </div>
      </div>
    </div>
  );
};
