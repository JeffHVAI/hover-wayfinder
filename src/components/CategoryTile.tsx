import React from 'react';
import type { CategoryItem } from '../types';

interface CategoryTileProps {
  category: CategoryItem;
  onClick: (category: CategoryItem) => void;
}

// Icon mapper for common mall/venue categories
function getCategoryIcon(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes('food') || lower.includes('dining') || lower.includes('restaurant') || lower.includes('cafe')) {
    return '🍔';
  }
  if (lower.includes('fashion') || lower.includes('apparel') || lower.includes('clothing') || lower.includes('shoe')) {
    return '👔';
  }
  if (lower.includes('tech') || lower.includes('electron') || lower.includes('phone') || lower.includes('mobile')) {
    return '📱';
  }
  if (lower.includes('health') || lower.includes('beauty') || lower.includes('salon') || lower.includes('spa')) {
    return '✨';
  }
  if (lower.includes('entertain') || lower.includes('movie') || lower.includes('game') || lower.includes('cinema')) {
    return '🎬';
  }
  if (lower.includes('service') || lower.includes('bank') || lower.includes('atm') || lower.includes('desk')) {
    return '🏢';
  }
  if (lower.includes('book') || lower.includes('gift') || lower.includes('toy')) {
    return '🎁';
  }
  if (lower.includes('restroom') || lower.includes('toilet')) {
    return '🚻';
  }
  return '🏷️';
}

export const CategoryTile: React.FC<CategoryTileProps> = ({ category, onClick }) => {
  return (
    <button
      type="button"
      className="category-tile touch-interactive"
      data-touch-target="true"
      onClick={() => onClick(category)}
      aria-label={`${category.name} (${category.count} locations)`}
    >
      <div className="tile-icon-wrapper">
        <span className="tile-icon">{category.icon || getCategoryIcon(category.name)}</span>
      </div>
      <div className="tile-info">
        <span className="tile-title">{category.name}</span>
        <span className="tile-count">{category.count} {category.count === 1 ? 'place' : 'places'}</span>
      </div>
    </button>
  );
};
