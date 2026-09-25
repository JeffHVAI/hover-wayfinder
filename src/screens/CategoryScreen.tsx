import React, { useMemo, useState } from 'react';
import { useStore } from '../state/store';
import { TenantList } from '../components/TenantList';
import type { LocationItem } from '../types';

export const CategoryScreen: React.FC = () => {
  const { currentScreen, controller, popScreen, openLocation, toggleNav } = useStore();
  const [activeLetter, setActiveLetter] = useState<string | null>(null);

  const category = currentScreen.selectedCategory;
  const isAZ = category?.id === '__az__';

  const allLocations = controller?.index?.locations || [];

  const categoryLocations = useMemo(() => {
    if (!category) return allLocations;
    if (isAZ) return allLocations;

    return allLocations.filter((loc) =>
      loc.categoryNames.some((c) => c.toLowerCase() === category.name.toLowerCase())
    );
  }, [category, isAZ, allLocations]);

  // Alphabet letters available
  const letters = useMemo(() => {
    const set = new Set<string>();
    categoryLocations.forEach((loc) => {
      const char = loc.name.charAt(0).toUpperCase();
      if (char >= 'A' && char <= 'Z') set.add(char);
    });
    return Array.from(set).sort();
  }, [categoryLocations]);

  // Filtered by letter if chosen
  const displayedLocations = useMemo(() => {
    if (!activeLetter) return categoryLocations;
    return categoryLocations.filter(
      (loc) => loc.name.charAt(0).toUpperCase() === activeLetter
    );
  }, [categoryLocations, activeLetter]);

  return (
    <div className="category-screen">
      {/* Navigation Header */}
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
          aria-label="Back to previous screen"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <span>Back</span>
        </button>

        <div className="screen-title-group">
          <h1>{category?.name || 'Store Directory'}</h1>
          <span className="screen-badge">
            {displayedLocations.length} {displayedLocations.length === 1 ? 'location' : 'locations'}
          </span>
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

      {/* Alphabet Fast Jump Bar (for A-Z mode or large lists) */}
      {letters.length > 5 && (
        <div className="alphabet-bar">
          <button
            type="button"
            className={`alpha-btn touch-interactive ${activeLetter === null ? 'active' : ''}`}
            data-touch-target="true"
            onClick={() => setActiveLetter(null)}
          >
            All
          </button>
          {letters.map((ltr) => (
            <button
              key={ltr}
              type="button"
              className={`alpha-btn touch-interactive ${activeLetter === ltr ? 'active' : ''}`}
              data-touch-target="true"
              onClick={() => setActiveLetter(ltr)}
            >
              {ltr}
            </button>
          ))}
        </div>
      )}

      {/* Scrollable Tenant List */}
      <TenantList
        locations={displayedLocations}
        onSelect={(loc: LocationItem) => openLocation(loc)}
        emptyMessage={`No locations found in ${category?.name || 'this category'}`}
      />
    </div>
  );
};
