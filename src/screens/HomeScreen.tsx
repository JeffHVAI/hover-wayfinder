import React, { useState } from 'react';
import { useStore } from '../state/store';
import { CategoryTile } from '../components/CategoryTile';
import { SearchModal } from '../components/SearchModal';
import { VenueSwitcher } from '../components/VenueSwitcher';
import { DEMO_VENUES, type DemoVenue } from '../config';
import type { CategoryItem, LocationItem } from '../types';

export const HomeScreen: React.FC = () => {
  const {
    controller,
    pushScreen,
    openLocation,
    site,
    activeVenueId,
    switchVenue,
    isVenueLoading,
    resetToAttract,
    toggleNav,
  } = useStore();
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
        {/* Row 1: Reach-anchored Navigation Bar */}
        <div className="home-header-top-nav">
          <button
            type="button"
            className="home-back-btn touch-interactive"
            data-touch-target="true"
            onClick={resetToAttract}
            onPointerDown={(e) => e.stopPropagation()}
            aria-label="Back to welcome screen and venue selection"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            <span>Welcome</span>
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
            <span className="mode-btn-text">Full 3D Map ⤢</span>
          </button>
        </div>

        {/* Row 2: Venue Identity & Switcher trigger */}
        <div className="home-venue-identity">
          <div className="venue-title-group">
            <span className="venue-hero-icon">{currentVenue.icon}</span>
            <div className="venue-hero-text">
              <h1 className="brand-venue-title">{site.name}</h1>
              <span className="brand-venue-subtitle">Interactive 3D Wayfinding & Kiosk</span>
            </div>
          </div>

          <button
            type="button"
            className="home-venue-change-pill touch-interactive"
            data-touch-target="true"
            onClick={() => setIsVenueModalOpen(true)}
            onPointerDown={(e) => e.stopPropagation()}
            aria-label="Change demo venue map"
          >
            <span>Change ▾</span>
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
