import React, { useEffect, useState, useRef } from 'react';
import { useStore } from './state/store';
import { loadSiteConfig } from './config';
import { loadMapData } from './map/loadMapData';
import { MapCanvas } from './map/MapCanvas';
import { initBackGuard } from './input/back';
import { initTouchlessFeedback } from './input/touchlessFeedback';

// Screens & Overlays
import { AttractScreen } from './screens/AttractScreen';
import { HomeScreen } from './screens/HomeScreen';
import { CategoryScreen } from './screens/CategoryScreen';
import { DetailScreen } from './screens/DetailScreen';
import { RouteScreen } from './screens/RouteScreen';
import { ProbePage } from './probe/ProbePage';
import { FloorPicker } from './components/FloorPicker';
import { ControlPad } from './components/ControlPad';
import { StatusOverlay } from './components/StatusOverlay';
import { RetryScreen } from './components/RetryScreen';

// Styles
import './styles/kiosk.css';
import './styles/screens.css';
import './styles/components.css';
import './styles/probe.css';

export const App: React.FC = () => {
  const {
    site,
    setSite,
    setMapData,
    currentScreen,
    controller,
    isIdleWarning,
    setIdleWarning,
    lastActivityTime,
    resetToAttract,
    updateTelemetry,
    isNavCollapsed,
    toggleNav,
  } = useStore();

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [pendingUpdate, setPendingUpdate] = useState(false);
  const resetCountRef = useRef(0);

  // Initialize site config and map data
  const initApp = async () => {
    setIsLoading(true);
    setLoadError(null);
    const t0 = performance.now();

    try {
      const siteConfig = await loadSiteConfig();
      setSite(siteConfig);

      const data = await loadMapData(siteConfig);
      const loadTime = Math.round(performance.now() - t0);

      setMapData(data);
      updateTelemetry({ mapLoadTimeMs: loadTime });
      setIsLoading(false);
    } catch (err: any) {
      console.error('Map loading error:', err);
      const errMsg = err?.message || 'Failed to load venue map data from Mappedin cloud.';
      setLoadError(errMsg);
      updateTelemetry({ lastError: errMsg });
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initApp();
  }, []);

  // Back guard and touchless feedback initialization
  useEffect(() => {
    const cleanupBack = initBackGuard();
    const cleanupTouchless = initTouchlessFeedback();

    return () => {
      cleanupBack();
      cleanupTouchless();
    };
  }, []);

  // Idle Timer & Resilience Loop
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentScreen.type === 'attract' || currentScreen.type === 'probe') {
        return;
      }

      const elapsedSec = (Date.now() - lastActivityTime) / 1000;
      const warnSec = site.idle.warnSeconds || 45;
      const resetSec = site.idle.resetSeconds || 60;

      if (elapsedSec >= resetSec) {
        resetCountRef.current++;
        // Check if pending version update or memory restart threshold reached
        if (pendingUpdate || resetCountRef.current >= 200) {
          window.location.reload();
          return;
        }
        resetToAttract();
      } else if (elapsedSec >= warnSec && !isIdleWarning) {
        setIdleWarning(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentScreen.type, lastActivityTime, isIdleWarning, site, pendingUpdate, resetToAttract, setIdleWarning]);

  // Version polling every 5 minutes (/version.json)
  useEffect(() => {
    let currentVersion = '1.0.0';
    const basePath = ((import.meta as any).env?.BASE_URL || './').replace(/\/$/, '');

    fetch(`${basePath}/version.json`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.version) currentVersion = d.version;
      })
      .catch(() => {});

    const pollInterval = setInterval(() => {
      fetch(`${basePath}/version.json?t=${Date.now()}`, { cache: 'no-store' })
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (data?.version && data.version !== currentVersion) {
            console.log(`New version detected (${data.version} vs ${currentVersion}). Will update on next idle reset.`);
            setPendingUpdate(true);
          }
        })
        .catch(() => {});
    }, 5 * 60 * 1000);

    return () => clearInterval(pollInterval);
  }, []);

  // Nightly 03:00 memory reload
  useEffect(() => {
    const nightlyCheck = setInterval(() => {
      const now = new Date();
      if (now.getHours() === 3 && now.getMinutes() === 0 && currentScreen.type === 'attract') {
        window.location.reload();
      }
    }, 60 * 1000);

    return () => clearInterval(nightlyCheck);
  }, [currentScreen.type]);

  // Render directory panel screen
  const renderScreen = () => {
    switch (currentScreen.type) {
      case 'home':
        return <HomeScreen />;
      case 'category':
        return <CategoryScreen />;
      case 'detail':
        return <DetailScreen />;
      case 'route':
        return <RouteScreen />;
      default:
        return <HomeScreen />;
    }
  };

  const layoutClass = `layout-${site.layout || 'auto'}`;

  return (
    <div className={`app-shell ${layoutClass}`}>
      {/* 1. Loading Overlay */}
      {isLoading && (
        <div className="retry-screen-container">
          <div className="retry-card">
            <div className="gesture-icon-anim select-anim">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <h1 className="retry-title">Loading Venue Map</h1>
            <p className="retry-message">Connecting to Mappedin cloud services for {site.name}...</p>
          </div>
        </div>
      )}

      {/* 2. Load Error & Auto-Retry Screen */}
      {loadError && (
        <RetryScreen
          errorMessage={loadError}
          onRetry={initApp}
          autoRetrySeconds={15}
        />
      )}

      {/* 3. Idle Warning Banner */}
      {isIdleWarning && currentScreen.type !== 'attract' && (
        <div className="idle-warning-toast" role="alert">
          <span>Still there? Screen will reset shortly.</span>
        </div>
      )}

      {/* 4. Directory Screen Panel */}
      <section className={`directory-panel ${isNavCollapsed ? 'collapsed' : 'expanded'}`}>
        {renderScreen()}

        {/* Arrow Drawer Toggle Tab on panel edge */}
        <button
          type="button"
          className="nav-drawer-toggle-tab touch-interactive"
          data-touch-target="true"
          onClick={toggleNav}
          aria-label={isNavCollapsed ? "Expand directory menu" : "Collapse directory menu"}
          title={isNavCollapsed ? "Expand directory menu" : "Collapse directory menu"}
        >
          <span className="toggle-tab-arrow-desktop">◀</span>
          <span className="toggle-tab-arrow-mobile">▲</span>
          <span className="toggle-tab-text">Hide Menu</span>
        </button>
      </section>

      {/* Floating Expand Pill button when collapsed */}
      {isNavCollapsed && currentScreen.type !== 'attract' && (
        <button
          type="button"
          className="nav-floating-expand-pill touch-interactive"
          data-touch-target="true"
          onClick={toggleNav}
          aria-label="Expand directory menu"
          title="Show Directory Menu"
        >
          <span className="floating-expand-icon">🔍</span>
          <span className="floating-expand-arrow-desktop">▶</span>
          <span className="floating-expand-arrow-mobile">▼</span>
          <span className="floating-expand-text">Show Directory</span>
        </button>
      )}

      {/* 5. Map Panel with Single Long-Lived 3D Canvas */}
      <section className={`map-panel ${isNavCollapsed ? 'full-screen' : ''}`}>
        <MapCanvas />

        {/* Floor Picker stack (Top Right) */}
        {controller?.index?.floors && (
          <FloorPicker floors={controller.index.floors} />
        )}

        {/* Control Pad (Bottom Right) */}
        <ControlPad />
      </section>

      {/* 6. Attract Screen (Full Overlay when Idle) */}
      {currentScreen.type === 'attract' && !isLoading && !loadError && (
        <AttractScreen />
      )}

      {/* 7. Probe Page (/probe test harness) */}
      {currentScreen.type === 'probe' && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 10000 }}>
          <ProbePage />
        </div>
      )}

      {/* 8. Diagnostic Status HUD (Hidden 5-tap corner trigger) */}
      <StatusOverlay />
    </div>
  );
};
