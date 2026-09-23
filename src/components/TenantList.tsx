import React from 'react';
import type { LocationItem } from '../types';

interface TenantListProps {
  locations: LocationItem[];
  onSelect: (location: LocationItem) => void;
  emptyMessage?: string;
}

export const TenantList: React.FC<TenantListProps> = ({
  locations,
  onSelect,
  emptyMessage = 'No locations found',
}) => {
  if (locations.length === 0) {
    return (
      <div className="tenant-list-empty">
        <span className="empty-icon">🔍</span>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="tenant-list-scroller" id="scroller" tabIndex={0}>
      <div className="tenant-list-items">
        {locations.map((loc) => {
          const initial = loc.name.charAt(0).toUpperCase();
          return (
            <button
              key={loc.id}
              type="button"
              className="tenant-row touch-interactive"
              data-touch-target="true"
              onClick={() => onSelect(loc)}
              aria-label={`${loc.name}, ${loc.floorName || ''}`}
            >
              <div className="tenant-avatar">
                {loc.logoUrl ? (
                  <img src={loc.logoUrl} alt="" className="tenant-logo" />
                ) : (
                  <span className="tenant-monogram">{initial}</span>
                )}
              </div>
              <div className="tenant-details">
                <span className="tenant-name">{loc.name}</span>
                <div className="tenant-meta">
                  {loc.floorName && <span className="tenant-floor-badge">{loc.floorName}</span>}
                  {loc.categoryNames.length > 0 && (
                    <span className="tenant-category-tag">{loc.categoryNames[0]}</span>
                  )}
                </div>
              </div>
              <div className="tenant-arrow">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
