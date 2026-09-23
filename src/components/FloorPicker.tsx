import React from 'react';
import type { FloorItem } from '../types';
import { useStore } from '../state/store';

interface FloorPickerProps {
  floors: FloorItem[];
}

export const FloorPicker: React.FC<FloorPickerProps> = ({ floors }) => {
  const { currentFloor, setCurrentFloor, controller } = useStore();

  if (!floors || floors.length <= 1) {
    return null;
  }

  // Display floors top-to-bottom (highest elevation at top)
  const displayFloors = [...floors].reverse();

  const handleSelectFloor = (floor: FloorItem) => {
    setCurrentFloor(floor);
    if (controller && floor.rawFloor) {
      controller.setFloor(floor.rawFloor);
    }
  };

  return (
    <div className="floor-picker-container" aria-label="Floor selector">
      <div className="floor-picker-stack">
        {displayFloors.map((floor) => {
          const isActive = currentFloor?.id === floor.id;
          return (
            <button
              key={floor.id}
              type="button"
              className={`floor-btn touch-interactive ${isActive ? 'active' : ''}`}
              data-touch-target="true"
              onClick={() => handleSelectFloor(floor)}
              aria-pressed={isActive}
              aria-label={`Switch to ${floor.name}`}
            >
              <span className="floor-code">
                {floor.name.replace(/Level|Floor/i, '').trim() || `${floor.elevation}`}
              </span>
              <span className="floor-label">{floor.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
