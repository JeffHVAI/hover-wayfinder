import React, { useState } from 'react';
import { useStore } from '../state/store';
import { CategoryTile } from '../components/CategoryTile';
import { SearchModal } from '../components/SearchModal';
import type { CategoryItem, LocationItem } from '../types';

export const HomeScreen: React.FC = () => {
  const { controller, pushScreen, openLocation, site } = useStore();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const categories = controller?.index?.categories || [];
  const locations = controller?.index?.locations || [];

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
        name: 'All Stores (A–Z)',
        count: locations.length,
      },
    });
  };

  return (
    <div className="home-screen">
      {/* Top Search & Navigation Bar */}
      <div className="home-header">
        <div className="home-header-branding">
          <span className="brand-venue">{site.name}</span>
          <span className="brand-tagline">Wayfinding & Directory</span>
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
            <span className="search-placeholder">Search stores, dining, services...</span>
          </button>

          <button
            type="button"
            className="home-az-btn touch-interactive"
            data-touch-target="true"
            onClick={handleOpenAZ}
            aria-label="Browse all stores A to Z"
          >
            <span>A–Z</span>
          </button>
        </div>
      </div>

      {/* Categories Grid Header */}
      <div className="home-section-header">
        <h2>Browse by Category</h2>
        <span className="section-count">{categories.length} Categories</span>
      </div>

      {/* Category Tiles Grid with 96px min targets */}
      <div className="home-categories-scroller" id="scroller" tabIndex={0}>
        <div className="home-categories-grid">
          {categories.map((cat) => (
            <CategoryTile
              key={cat.id}
              category={cat}
              onClick={handleSelectCategory}
            />
          ))}
        </div>
      </div>

      {/* Search Modal */}
      <SearchModal
        locations={locations}
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectLocation={(loc: LocationItem) => openLocation(loc)}
      />
    </div>
  );
};
