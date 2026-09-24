import React, { useState } from 'react';
import { useStore } from '../state/store';
import { CategoryTile } from '../components/CategoryTile';
import { SearchModal } from '../components/SearchModal';
import { VenueSwitcher } from '../components/VenueSwitcher';
import { DEMO_VENUES, type DemoVenue } from '../config';
import type { CategoryItem, LocationItem } from '../types';

export const HomeScreen: React.FC = () => {
  const { controller, pushScreen, openLocation, site, activeVenueId, switchVenue, isVenueLoading } = useStore();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isVenueModalOpen, setIsVenueModalOpen] = useState(false);

  const categories = controller?.index?.categories || [];
  const locations = controller?.index?.locations || [];

  const currentVenue = DEMO_VENUES.find((v) => v.id === activeVenueId) || DEMO_VENUES[0];

  const handleSelectCategory = (category: CategoryItem) => {
    pushScreen({
      type: 'category',
      selectedCategory: category,
    });
  };

  const handleOpenAZ = () => {
    pushScreen({
      type: 'category',
      selectedCategory: {
        id: '__az__',
        name: 'All Locations (A–Z)',
        count: locations.length,
      },
    });
  };

  const handleSelectVenue = (venue: DemoVenue) => {
    if (venue.id !== activeVenueId) {
      switchVenue(venue.id);
    }
  };

  return (
    <div className="home-screen">
      {/* Top Search & Navigation Bar */}
      <div className="home-header">
        <div className="home-header-branding">
          <div className="brand-text-group">
            <span className="brand-venue">{site.name}</span>
            <span className="brand-tagline">3D Wayfinding & Interactive Kiosk</span>
          </div>

          <button
            type="button"
            className="home-venue-selector-btn touch-interactive"
            data-touch-target="true"
            onClick={() => setIsVenueModalOpen(true)}
            aria-label="Change demo venue map"
          >
            <span className="venue-indicator-icon">{currentVenue.icon}</span>
            <div className="venue-indicator-labels">
              <span className="venue-indicator-title">{currentVenue.shortName}</span>
              <span className="venue-indicator-hint">Change Map ▾</span>
            </div>
          </button>
        </div>

        <div className="home-search-actions">
          <button
            type="button"
            className="home-search-btn touch-interactive"
            data-touch-target="true"
            onClick={() => setIsSearchOpen(true)}
            aria-label="Open directory search"
          >
            <span className="search-icon">🔍</span>
            <span className="search-placeholder">Search departments, spaces, services...</span>
          </button>

          <button
            type="button"
            className="home-az-btn touch-interactive"
            data-touch-target="true"
            onClick={handleOpenAZ}
            aria-label="Browse all locations A to Z"
          >
            <span>A–Z</span>
          </button>
        </div>
      </div>

      {/* 1-Tap Demo Venue Switcher Bar */}
      <div className="home-venue-bar-wrapper">
        <div className="venue-bar-header">
          <span className="venue-bar-title">DEMO VENUE MAPS:</span>
        </div>
        <VenueSwitcher
          mode="bar"
          activeVenueId={activeVenueId}
          onSelectVenue={handleSelectVenue}
        />
      </div>

      {/* Categories Grid Header */}
      <div className="home-section-header">
        <h2>Browse by Category</h2>
        <span className="section-count">{categories.length} Categories</span>
      </div>

      {/* Category Tiles Grid with 96px min targets */}
      <div className="home-categories-scroller" id="scroller" tabIndex={0}>
        {isVenueLoading ? (
          <div className="venue-loading-placeholder">
            <span className="venue-loading-spinner">🔄</span>
            <p>Loading 3D venue data from Mappedin cloud...</p>
          </div>
        ) : (
          <div className="home-categories-grid">
            {categories.map((cat) => (
              <CategoryTile
                key={cat.id}
                category={cat}
                onClick={handleSelectCategory}
              />
            ))}
          </div>
        )}
      </div>

      {/* Search Modal */}
      <SearchModal
        locations={locations}
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectLocation={(loc: LocationItem) => openLocation(loc)}
      />

      {/* Venue Selection Modal */}
      <VenueSwitcher
        mode="modal"
        isOpen={isVenueModalOpen}
        activeVenueId={activeVenueId}
        onClose={() => setIsVenueModalOpen(false)}
        onSelectVenue={handleSelectVenue}
      />
    </div>
  );
};
