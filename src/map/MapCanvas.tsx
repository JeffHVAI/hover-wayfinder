import React, { useEffect, useRef } from 'react';
import { show3dMap } from '@mappedin/mappedin-js';
import { useStore } from '../state/store';
import { buildIndex } from './directoryIndex';
import { createController } from './mapController';
import { attachMapScrollZoom } from '../input/mapScrollZoom';

export const MapCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { mapData, setController, openLocationForSpace, controller, site } = useStore();

  useEffect(() => {
    if (!mapData || !containerRef.current) return;
    let cancelled = false;

    show3dMap(containerRef.current, mapData).then((mapView: any) => {
      if (cancelled) return;

      // Enable space interactivity
      const spaces = mapData.getByType('space') || [];
      spaces.forEach((s: any) => {
        mapView.updateState(s, {
          interactive: true,
          hoverColor: '#4F8CFF',
        });
        if (s.name && s.name.trim().length > 0) {
          try {
            mapView.Labels.add(s, s.name, {
              options: { interactive: true },
            });
          } catch {
            // ignore
          }
        }
      });

      // Handle map click
      mapView.on('click', ({ spaces }: any) => {
        if (spaces && spaces.length > 0) {
          openLocationForSpace(spaces[0]);
        }
      });

      // Handle floor change
      mapView.on('floor-change', (event: any) => {
        if (event?.floor) {
          const store = useStore.getState();
          const ctrl = store.controller;
          if (ctrl) {
            const floorItem = ctrl.index.floors.find((f) => f.id === event.floor.id);
            if (floorItem) {
              store.setCurrentFloor(floorItem);
            }
          }
        }
      });

      // Listen for webgl context lost to recover kiosk
      const canvas = containerRef.current?.querySelector('canvas');
      if (canvas) {
        canvas.addEventListener('webglcontextlost', (e) => {
          e.preventDefault();
          console.warn('WebGL context lost. Reloading kiosk page...');
          setTimeout(() => window.location.reload(), 1000);
        });
      }

      // Initialize controller and index
      const index = buildIndex(mapData);
      const ctrl = createController(mapView, mapData, index, site);
      setController(ctrl);

      const initialFloor = index.floors[0] || null;
      if (initialFloor) {
        useStore.getState().setCurrentFloor(initialFloor);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [mapData]);

  // Hook map scroll/drag to camera zoom adapter
  useEffect(() => {
    if (!containerRef.current || !controller) return;
    const cleanup = attachMapScrollZoom(containerRef.current, (delta) => {
      controller.zoom(delta);
    });
    return cleanup;
  }, [controller]);

  return <div id="mappedin-map" ref={containerRef} />;
};
