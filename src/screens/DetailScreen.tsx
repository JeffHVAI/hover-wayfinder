import React, { useState } from 'react';
import { useStore } from '../state/store';
import type { RouteDetails } from '../types';

export const DetailScreen: React.FC = () => {
  const { currentScreen, controller, popScreen, pushScreen, setActiveRoute, toggleNav } = useStore();
  const [isRouting, setIsRouting] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);

  const location = currentScreen.selectedLocation;

  if (!location) {
    return (
      <div className="detail-screen empty">
        <button
          type="button"
          className="back-btn touch-interactive"
          data-touch-target="true"
          onClick={popScreen}
          onPointerDown={(e) => {
            e.stopPropagation();
            popScreen();
          }}
        >
          <span>← Back</span>
        </button>
        <p>No location selected</p>
      </div>
    );
  }

  const initial = location.name.charAt(0).toUpperCase();

  const handleTakeMeThere = async () => {
    if (!controller) return;
    setIsRouting(true);
    setRouteError(null);

    try {
      const routeDetails = await controller.route(location);

      if (!routeDetails) {
        setRouteError('No direct route could be calculated from the kiosk origin to this location.');
        setIsRouting(false);
        return;
      }

      setActiveRoute(routeDetails);
      pushScreen({
        type: 'route',
        selectedLocation: location,
      });
    } catch (err: any) {
      console.error('Route calculation error:', err);
      setRouteError('Unable to generate route path. Please try again.');
    } finally {
      setIsRouting(false);
    }
  };

  return (
    <div className="detail-screen">
      {/* Header with Back Button */}
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
          aria-label="Back to store list"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span>Back</span>
        </button>

        <div className="detail-floor-pill">
          <span className="dot" />
          <span>{location.floorName || 'Main Level'}</span>
        </div>

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
      </div>

      {/* Main Tenant Card */}
      <div className="detail-card-content" id="scroller" tabIndex={0}>
        <div className="detail-profile-header">
          <div className="detail-avatar-large">
            {location.logoUrl ? (
              <img src={location.logoUrl} alt="" className="detail-logo-img" />
            ) : (
              <span className="detail-monogram-large">{initial}</span>
            )}
          </div>
          <div className="detail-titles">
            <h1 className="detail-title">{location.name}</h1>
            <div className="detail-tags">
              {location.categoryNames.map((cat, idx) => (
                <span key={idx} className="category-tag">{cat}</span>
              ))}
            </div>
          </div>
        </div>

        {location.description && (
          <div className="detail-section">
            <h3 className="section-label">About</h3>
            <p className="detail-description">{location.description}</p>
          </div>
        )}

        {location.hours && (
          <div className="detail-section">
            <h3 className="section-label">Hours of Operation</h3>
            <div className="detail-hours">
              <span className="hours-icon">🕒</span>
              <span>{location.hours}</span>
            </div>
          </div>
        )}

        {routeError && (
          <div className="detail-route-alert">
            <span>⚠️ {routeError}</span>
          </div>
        )}
      </div>

      {/* Bottom Action Footer with 96px "Take Me There" Target */}
      <div className="detail-action-footer">
        <button
          type="button"
          className="take-me-there-btn touch-interactive"
          data-touch-target="true"
          onClick={handleTakeMeThere}
          disabled={isRouting}
          aria-label={`Get directions to ${location.name}`}
        >
          <span className="btn-icon">
            {isRouting ? '⏳' : '🚶'}
          </span>
          <span className="btn-label">
            {isRouting ? 'Calculating Path...' : 'Take Me There'}
          </span>
        </button>
      </div>
    </div>
  );
};
