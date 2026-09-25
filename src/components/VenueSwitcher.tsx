import React from 'react';
import { DEMO_VENUES, type DemoVenue } from '../config';
import pointGif from '../assets/surfaceware-point.gif';

interface VenueSwitcherProps {
  activeVenueId?: string;
  onSelectVenue: (venue: DemoVenue) => void;
  isOpen?: boolean;
  onClose?: () => void;
  mode?: 'rail' | 'bar' | 'modal';
}

export const VenueSwitcher: React.FC<VenueSwitcherProps> = ({
  activeVenueId,
  onSelectVenue,
  isOpen = false,
  onClose,
  mode = 'rail',
}) => {
  if (mode === 'rail') {
    return (
      <aside className="venue-rail" aria-label="Demo Venues Navigation">
        <div className="venue-rail-header">
          <div className="venue-rail-badge">
            <span className="rail-badge-dot" />
            <span className="rail-badge-title">DEMO VENUES</span>
            <span className="rail-badge-count">{DEMO_VENUES.length}</span>
          </div>
          <span className="venue-rail-hint">Select to explore 3D map</span>
        </div>

        <div className="venue-rail-list" role="tablist" aria-label="Select Demo Venue">
          {DEMO_VENUES.map((venue) => {
            const isActive = activeVenueId === venue.id || (!activeVenueId && venue.id === 'mall-a');
            return (
              <button
                key={venue.id}
                type="button"
                className={`venue-rail-btn touch-interactive ${isActive ? 'active' : ''}`}
                data-touch-target="true"
                onClick={() => onSelectVenue(venue)}
                onPointerDown={(e) => {
                  e.stopPropagation();
                }}
                role="tab"
                aria-selected={isActive}
                aria-label={`Switch to ${venue.name}`}
              >
                <div className="rail-btn-icon-wrapper">
                  <span className="rail-btn-icon">{venue.icon}</span>
                </div>
                <div className="rail-btn-labels">
                  <span className="rail-btn-name">{venue.shortName}</span>
                  <span className="rail-btn-cat">{venue.category}</span>
                </div>
                {isActive && <span className="rail-active-dot" title="Active Map" />}
              </button>
            );
          })}
        </div>

        {/* Lower Left Corner Touchless Point Guide GIF */}
        <div className="venue-rail-footer">
          <div className="touchless-guide-card">
            <div className="touchless-guide-media">
              <img
                src={pointGif}
                alt="SurfaceWare Touchless Point Interaction"
                className="touchless-gif"
                loading="eager"
              />
            </div>
            <div className="touchless-guide-info">
              <span className="guide-dot-pulse" />
              <span className="guide-label">Touchless Point Guide</span>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  if (mode === 'bar') {
    return (
      <div className="venue-switcher-bar" role="tablist" aria-label="Demo Venues">
        {DEMO_VENUES.map((venue) => {
          const isActive = activeVenueId === venue.id || (!activeVenueId && venue.id === 'mall-a');
          return (
            <button
              key={venue.id}
              type="button"
              className={`venue-bar-btn touch-interactive ${isActive ? 'active' : ''}`}
              data-touch-target="true"
              onClick={() => onSelectVenue(venue)}
              onPointerDown={(e) => {
                e.stopPropagation();
              }}
              role="tab"
              aria-selected={isActive}
              aria-label={`Switch to ${venue.name}`}
            >
              <span className="venue-bar-icon">{venue.icon}</span>
              <div className="venue-bar-labels">
                <span className="venue-bar-name">{venue.shortName}</span>
                <span className="venue-bar-cat">{venue.category}</span>
              </div>
              {isActive && <span className="active-dot" title="Active Map" />}
            </button>
          );
        })}
      </div>
    );
  }

  if (!isOpen) return null;

  return (
    <div className="venue-modal-backdrop" role="dialog" aria-modal="true" aria-label="Select Demo Venue">
      <div className="venue-modal-card">
        <div className="venue-modal-header">
          <div className="modal-header-titles">
            <h2>Select Demo Venue</h2>
            <p>Choose an interactive 3D venue map to explore</p>
          </div>
          {onClose && (
            <button
              type="button"
              className="venue-close-btn touch-interactive"
              data-touch-target="true"
              onClick={onClose}
              aria-label="Close venue selector"
            >
              ✕
            </button>
          )}
        </div>

        <div className="venue-cards-grid">
          {DEMO_VENUES.map((venue) => {
            const isActive = activeVenueId === venue.id || (!activeVenueId && venue.id === 'mall-a');
            return (
              <button
                key={venue.id}
                type="button"
                className={`venue-card touch-interactive ${isActive ? 'active' : ''}`}
                data-touch-target="true"
                onClick={() => {
                  onSelectVenue(venue);
                  onClose?.();
                }}
                aria-pressed={isActive}
              >
                <div className="venue-card-icon-wrapper">
                  <span className="venue-icon">{venue.icon}</span>
                </div>
                <div className="venue-card-details">
                  <div className="venue-card-top">
                    <span className="venue-type-tag">{venue.category}</span>
                    {isActive && <span className="venue-active-pill">CURRENT MAP</span>}
                  </div>
                  <h3 className="venue-name">{venue.name}</h3>
                  <p className="venue-desc">{venue.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
