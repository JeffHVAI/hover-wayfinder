import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../state/store';

export const StatusOverlay: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentFps, setCurrentFps] = useState(60);
  const [version, setVersion] = useState('1.0.0');

  const { site, telemetry, stack, pushScreen } = useStore();
  const tapTimesRef = useRef<number[]>([]);
  const frameCountRef = useRef(0);
  const lastFpsCalcRef = useRef(performance.now());

  // Load version
  useEffect(() => {
    const basePath = (import.meta.env.BASE_URL || './').replace(/\/$/, '');
    fetch(`${basePath}/version.json`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.version) setVersion(data.version);
      })
      .catch(() => {});
  }, []);

  // Compute FPS
  useEffect(() => {
    let animId: number;
    const calcLoop = () => {
      frameCountRef.current++;
      const now = performance.now();
      if (now - lastFpsCalcRef.current >= 1000) {
        const fps = Math.round((frameCountRef.current * 1000) / (now - lastFpsCalcRef.current));
        setCurrentFps(fps);
        frameCountRef.current = 0;
        lastFpsCalcRef.current = now;
      }
      animId = requestAnimationFrame(calcLoop);
    };
    animId = requestAnimationFrame(calcLoop);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Top-left hidden corner tap handler (5 taps within 3000ms)
  const handleCornerTap = () => {
    const now = Date.now();
    const recentTaps = [...tapTimesRef.current.filter((t) => now - t <= 3000), now];
    tapTimesRef.current = recentTaps;

    if (recentTaps.length >= 5) {
      setIsOpen(true);
      tapTimesRef.current = [];
    }
  };

  return (
    <>
      {/* Invisible 120x120 corner trigger in top-left */}
      <div
        className="status-corner-trigger"
        onClick={handleCornerTap}
        aria-hidden="true"
        title="Tap 5 times to open debug status"
      />

      {isOpen && (
        <div className="status-modal-backdrop" role="dialog" aria-modal="true">
          <div className="status-modal-card">
            <div className="status-modal-header">
              <h2>Diagnostic Status HUD</h2>
              <button
                type="button"
                className="status-close-btn touch-interactive"
                data-touch-target="true"
                onClick={() => setIsOpen(false)}
              >
                ✕ Close
              </button>
            </div>

            <div className="status-grid">
              <div className="status-item">
                <span className="status-label">App Version</span>
                <span className="status-val highlight">{version}</span>
              </div>
              <div className="status-item">
                <span className="status-label">Active Site</span>
                <span className="status-val">{site.name} ({site.mapId})</span>
              </div>
              <div className="status-item">
                <span className="status-label">Mappedin SDK</span>
                <span className="status-val">{telemetry.sdkVersion}</span>
              </div>
              <div className="status-item">
                <span className="status-label">Map Load Time</span>
                <span className="status-val">
                  {telemetry.mapLoadTimeMs > 0 ? `${telemetry.mapLoadTimeMs} ms` : 'Loaded'}
                </span>
              </div>
              <div className="status-item">
                <span className="status-label">Render FPS</span>
                <span className={`status-val ${currentFps >= 50 ? 'good' : currentFps >= 30 ? 'warn' : 'bad'}`}>
                  {currentFps} FPS
                </span>
              </div>
              <div className="status-item">
                <span className="status-label">Last Error</span>
                <span className="status-val">{telemetry.lastError || 'None (Healthy)'}</span>
              </div>
              <div className="status-item full-width">
                <span className="status-label">Screen Stack</span>
                <span className="status-val stack-trail">
                  {stack.map((s, idx) => (
                    <span key={idx} className="stack-pill">{s.type}</span>
                  ))}
                </span>
              </div>
              <div className="status-item full-width">
                <span className="status-label">Viewport & User Agent</span>
                <span className="status-val small-val">
                  {window.innerWidth} × {window.innerHeight} | {navigator.userAgent.slice(0, 70)}...
                </span>
              </div>
            </div>

            <div className="status-actions">
              <button
                type="button"
                className="status-action-btn touch-interactive"
                data-touch-target="true"
                onClick={() => {
                  setIsOpen(false);
                  pushScreen({ type: 'probe' });
                }}
              >
                Launch Event Probe (/probe)
              </button>
              <button
                type="button"
                className="status-action-btn secondary touch-interactive"
                data-touch-target="true"
                onClick={() => window.location.reload()}
              >
                Reload App
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
