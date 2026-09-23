import React from 'react';
import { useStore } from '../state/store';

export const ControlPad: React.FC = () => {
  const { controller } = useStore();

  if (!controller) return null;

  const PAN_METERS = 15;

  return (
    <div className="control-pad" aria-label="Map Navigation Controls">
      {/* Pan controls cross */}
      <div className="pad-pan-cluster">
        <button
          type="button"
          className="pad-btn pan-up touch-interactive"
          data-touch-target="true"
          onClick={() => controller.pan(0, PAN_METERS)}
          aria-label="Pan North / Up"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>

        <div className="pad-horizontal-row">
          <button
            type="button"
            className="pad-btn pan-left touch-interactive"
            data-touch-target="true"
            onClick={() => controller.pan(-PAN_METERS, 0)}
            aria-label="Pan West / Left"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <button
            type="button"
            className="pad-btn pad-reset touch-interactive"
            data-touch-target="true"
            onClick={() => controller.reset()}
            aria-label="Reset Map View"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </button>

          <button
            type="button"
            className="pad-btn pan-right touch-interactive"
            data-touch-target="true"
            onClick={() => controller.pan(PAN_METERS, 0)}
            aria-label="Pan East / Right"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        <button
          type="button"
          className="pad-btn pan-down touch-interactive"
          data-touch-target="true"
          onClick={() => controller.pan(0, -PAN_METERS)}
          aria-label="Pan South / Down"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>

      {/* Zoom controls */}
      <div className="pad-zoom-cluster">
        <button
          type="button"
          className="pad-btn pad-zoom-in touch-interactive"
          data-touch-target="true"
          onClick={() => controller.zoom(1)}
          aria-label="Zoom in"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>

        <button
          type="button"
          className="pad-btn pad-zoom-out touch-interactive"
          data-touch-target="true"
          onClick={() => controller.zoom(-1)}
          aria-label="Zoom out"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>
    </div>
  );
};
