import React from 'react';
import { useStore } from '../state/store';

export const RouteScreen: React.FC = () => {
  const { activeRoute, currentScreen, controller, popScreen, resetToHome, toggleNav } = useStore();

  const location = currentScreen.selectedLocation;

  const handleClearRoute = () => {
    controller?.reset();
    resetToHome();
  };

  const getStepIcon = (action: any) => {
    const act = String(action?.type || action?.action || action || '').toLowerCase();
    if (act.includes('left')) return '↰';
    if (act.includes('right')) return '↱';
    if (act.includes('elevator') || act.includes('lift')) return '🛗';
    if (act.includes('escalator') || act.includes('stairs')) return '🪜';
    if (act.includes('floor') || act.includes('level')) return '↕️';
    if (act.includes('destination') || act.includes('arrive')) return '🏁';
    return '↑';
  };

  return (
    <div className="route-screen">
      {/* Route Header with Back, Collapse and Clear Actions */}
      <div className="screen-header">
        <button
          type="button"
          className="back-btn touch-interactive"
          data-touch-target="true"
          onClick={popScreen}
          onPointerDown={(e) => {
            e.stopPropagation();
            popScreen();
          }}
          aria-label="Back to store detail"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span>Back</span>
        </button>

        <button
          type="button"
          className="header-mode-toggle-btn touch-interactive"
          data-touch-target="true"
          onClick={toggleNav}
          onPointerDown={(e) => e.stopPropagation()}
          aria-label="Maximize 3D Map"
          title="Switch to Full Screen Map View"
        >
          <span className="mode-btn-icon">🗺️</span>
          <span className="mode-btn-text">Full Map ⤢</span>
        </button>

        <button
          type="button"
          className="clear-route-btn touch-interactive"
          data-touch-target="true"
          onClick={handleClearRoute}
          onPointerDown={(e) => {
            e.stopPropagation();
            handleClearRoute();
          }}
          aria-label="Clear active route and return home"
        >
          <span>Clear Route</span>
        </button>
      </div>

      {/* Route Summary Card */}
      <div className="route-summary-card">
        <div className="route-destination-info">
          <span className="route-to-label">Directions to</span>
          <h1 className="route-destination-name">{location?.name || activeRoute?.destinationName || 'Destination'}</h1>
        </div>

        <div className="route-metrics-row">
          <div className="metric-pill">
            <span className="metric-icon">⏱️</span>
            <span className="metric-val">{activeRoute?.estimatedMinutes ?? 2} min walk</span>
          </div>
          <div className="metric-pill">
            <span className="metric-icon">📏</span>
            <span className="metric-val">{activeRoute?.totalDistanceMeters ?? 50} m</span>
          </div>
          {location?.floorName && (
            <div className="metric-pill floor">
              <span className="metric-icon">🏢</span>
              <span className="metric-val">{location.floorName}</span>
            </div>
          )}
        </div>
      </div>

      {/* Turn-by-Turn Instruction Steps */}
      <div className="route-steps-scroller" id="scroller" tabIndex={0}>
        <div className="route-steps-list">
          <div className="route-step-item start-step">
            <div className="step-indicator start">
              <span className="dot" />
            </div>
            <div className="step-content">
              <span className="step-label">Start Point</span>
              <p className="step-text">You are at this kiosk</p>
            </div>
          </div>

          {(activeRoute?.steps || []).map((step, idx) => (
            <div key={idx} className="route-step-item">
              <div className="step-indicator">
                <span className="step-symbol">{getStepIcon(step.action)}</span>
              </div>
              <div className="step-content">
                <p className="step-text">{step.text}</p>
                {step.distanceMeters > 0 && (
                  <span className="step-distance">in {step.distanceMeters} meters</span>
                )}
              </div>
            </div>
          ))}

          <div className="route-step-item end-step">
            <div className="step-indicator end">
              <span className="flag">🏁</span>
            </div>
            <div className="step-content">
              <span className="step-label">Destination</span>
              <p className="step-text">Arrive at {location?.name}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="route-action-footer">
        <button
          type="button"
          className="finish-route-btn touch-interactive"
          data-touch-target="true"
          onClick={handleClearRoute}
          aria-label="Finished wayfinding, return home"
        >
          <span>Done Wayfinding</span>
        </button>
      </div>
    </div>
  );
};
