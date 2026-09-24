import React from 'react';
import { useStore } from '../state/store';
import { DEMO_VENUES } from '../config';

export const AttractScreen: React.FC = () => {
  const { site, resetToHome, activeVenueId, switchVenue } = useStore();

  const handleVenuePick = (e: React.MouseEvent, venueId: string) => {
    e.stopPropagation();
    switchVenue(venueId);
  };

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
        <p className="attract-subtitle">Explore departments, exhibits, stores, and live turn-by-turn routes</p>

        {/* Available Demo Venues Selection Row */}
        <div className="attract-venues-row" onClick={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()}>
          <span className="venues-row-label">Select Demo Venue:</span>
          <div className="venues-pills">
            {DEMO_VENUES.map((v) => {
              const isActive = activeVenueId === v.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  className={`venue-pill touch-interactive ${isActive ? 'active' : ''}`}
                  data-touch-target="true"
                  onClick={(e) => handleVenuePick(e, v.id)}
                  aria-pressed={isActive}
                >
                  <span className="pill-icon">{v.icon}</span>
                  <span className="pill-name">{v.shortName}</span>
                </button>
              );
            })}
          </div>
        </div>

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
            <p className="gesture-desc">Push toward screen to select locations and categories</p>
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
