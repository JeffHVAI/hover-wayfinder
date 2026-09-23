import React, { useState, useMemo } from 'react';
import type { LocationItem } from '../types';
import { useStore } from '../state/store';
import { TenantList } from './TenantList';

interface SearchModalProps {
  locations: LocationItem[];
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (loc: LocationItem) => void;
}

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M', 'DEL'],
  ['SPACE', 'CLEAR'],
];

export const SearchModal: React.FC<SearchModalProps> = ({
  locations,
  isOpen,
  onClose,
  onSelectLocation,
}) => {
  const [query, setQuery] = useState('');
  const { mapData } = useStore();

  const filteredLocations = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();

    // Fast local filter first
    return locations.filter((loc) => {
      const matchName = loc.name.toLowerCase().includes(q);
      const matchCat = loc.categoryNames.some((c) => c.toLowerCase().includes(q));
      const matchDesc = loc.description?.toLowerCase().includes(q);
      return matchName || matchCat || matchDesc;
    });
  }, [query, locations]);

  if (!isOpen) return null;

  const handleKeyPress = (key: string) => {
    if (key === 'DEL') {
      setQuery((prev) => prev.slice(0, -1));
    } else if (key === 'CLEAR') {
      setQuery('');
    } else if (key === 'SPACE') {
      setQuery((prev) => prev + ' ');
    } else {
      setQuery((prev) => prev + key);
    }
  };

  return (
    <div className="search-modal-backdrop" role="dialog" aria-modal="true" aria-label="Search directory">
      <div className="search-modal-content">
        {/* Header with input and close button */}
        <div className="search-header">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              readOnly
              className="search-input-display"
              value={query}
              placeholder="Search stores, dining, services..."
              aria-label="Search term"
            />
            {query.length > 0 && (
              <button
                type="button"
                className="search-clear-btn touch-interactive"
                data-touch-target="true"
                onClick={() => setQuery('')}
                aria-label="Clear search input"
              >
                ✕
              </button>
            )}
          </div>
          <button
            type="button"
            className="search-close-btn touch-interactive"
            data-touch-target="true"
            onClick={onClose}
            aria-label="Close search"
          >
            Done
          </button>
        </div>

        {/* Results Area */}
        <div className="search-results-area">
          {query.trim().length === 0 ? (
            <div className="search-prompt">
              <span className="prompt-icon">⌨️</span>
              <p>Type above or tap letters below to find stores</p>
            </div>
          ) : (
            <TenantList
              locations={filteredLocations}
              onSelect={(loc) => {
                onSelectLocation(loc);
                onClose();
              }}
              emptyMessage={`No stores found matching "${query}"`}
            />
          )}
        </div>

        {/* Kiosk Touch Keyboard */}
        <div className="kiosk-keyboard">
          {KEYBOARD_ROWS.map((row, rIdx) => (
            <div key={rIdx} className="keyboard-row">
              {row.map((key) => {
                const isSpecial = key.length > 1;
                return (
                  <button
                    key={key}
                    type="button"
                    className={`key-btn touch-interactive ${isSpecial ? 'key-special' : ''} key-${key.toLowerCase()}`}
                    data-touch-target="true"
                    onClick={() => handleKeyPress(key)}
                  >
                    {key === 'DEL' ? '⌫' : key}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
