import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../state/store';

interface ProbeLogEntry {
  t: number;
  type: string;
  x?: number;
  y?: number;
  pointerType?: string;
  deltaY?: number;
  key?: string;
  target?: string;
  scrollTop?: number;
  state?: any;
}

export const ProbePage: React.FC = () => {
  const [logs, setLogs] = useState<ProbeLogEntry[]>([]);
  const [tapCount, setTapCount] = useState(0);
  const [sendStatus, setSendStatus] = useState<string | null>(null);
  const logsRef = useRef<ProbeLogEntry[]>([]);
  const t0Ref = useRef<number>(performance.now());
  const { popScreen } = useStore();

  useEffect(() => {
    t0Ref.current = performance.now();

    // Push 5 history entries so back swipe produces popstate instead of leaving page
    for (let i = 1; i <= 5; i++) {
      window.history.pushState({ probeStep: i }, '', `#probe-step-${i}`);
    }

    const rec = (e: Event, extra: Record<string, any> = {}) => {
      const p = e as any;
      const entry: ProbeLogEntry = {
        t: Math.round(performance.now() - t0Ref.current),
        type: e.type,
        x: p.clientX ?? p.touches?.[0]?.clientX,
        y: p.clientY ?? p.touches?.[0]?.clientY,
        pointerType: p.pointerType,
        deltaY: p.deltaY,
        key: p.key,
        target: (e.target as Element)?.id || (e.target as Element)?.tagName,
        ...extra,
      };

      logsRef.current.push(entry);
      // Keep state with last 100 entries for rendering performance
      setLogs((prev) => [...prev.slice(-120), entry]);
    };

    const monitoredEvents = [
      'pointerdown',
      'pointerup',
      'pointermove',
      'touchstart',
      'touchmove',
      'touchend',
      'click',
      'wheel',
      'keydown',
    ];

    monitoredEvents.forEach((t) =>
      window.addEventListener(t, rec, { capture: true, passive: true })
    );

    const onPopState = (e: PopStateEvent) => rec(e, { state: e.state });
    window.addEventListener('popstate', onPopState);

    const scrollerEl = document.getElementById('probe-scroller');
    const onScroll = (e: Event) =>
      rec(e, { scrollTop: (e.target as HTMLElement).scrollTop });
    scrollerEl?.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      monitoredEvents.forEach((t) => window.removeEventListener(t, rec, { capture: true }));
      window.removeEventListener('popstate', onPopState);
      scrollerEl?.removeEventListener('scroll', onScroll);
    };
  }, []);

  const handleTapTargetClick = () => {
    setTapCount((prev) => prev + 1);
  };

  const handleSendLogs = async () => {
    setSendStatus('Sending...');
    try {
      const res = await fetch('/api/probe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
          viewport: { width: window.innerWidth, height: window.innerHeight },
          totalEntries: logsRef.current.length,
          events: logsRef.current,
        }),
      });

      if (res.ok) {
        setSendStatus(`Saved! Sent ${logsRef.current.length} events to /api/probe`);
      } else {
        setSendStatus(`API response: ${res.status}. Stored locally.`);
      }
    } catch {
      setSendStatus(`Network fallback: ${logsRef.current.length} events logged in memory.`);
    }
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logsRef.current, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', `surfaceware-probe-${Date.now()}.json`);
    dlAnchorElem.click();
  };

  return (
    <div className="probe-page-container">
      {/* Probe Control Bar */}
      <header className="probe-header">
        <div className="probe-title-area">
          <h1>SurfaceWare CDP Event Probe</h1>
          <span className="probe-subtitle">Capture tap, scroll & back gestures on kiosk</span>
        </div>
        <div className="probe-bar-actions">
          <button type="button" className="probe-btn send-btn" onClick={handleSendLogs}>
            📤 Send to /api/probe
          </button>
          <button type="button" className="probe-btn export-btn" onClick={handleExportJSON}>
            💾 Export JSON
          </button>
          <button type="button" className="probe-btn back-app-btn" onClick={popScreen}>
            ← Return to Kiosk
          </button>
        </div>
      </header>

      {sendStatus && (
        <div className="probe-status-banner">
          <span>{sendStatus}</span>
        </div>
      )}

      {/* Main Testing Matrix */}
      <div className="probe-grid">
        {/* Left Column: Interactive Test Targets */}
        <div className="probe-targets-panel">
          {/* Target 1: Tap target */}
          <div className="probe-section">
            <h3>Test 1: Tap Gesture (Target: 10 Taps)</h3>
            <button
              id="tap-target"
              type="button"
              className="probe-tap-target"
              onClick={handleTapTargetClick}
            >
              <span className="tap-badge">{tapCount} / 10</span>
              <span className="tap-label">TAP HERE (id: #tap-target)</span>
            </button>
          </div>

          {/* Target 2: Scroll list */}
          <div className="probe-section">
            <h3>Test 2: Scroll Gesture over List</h3>
            <div id="probe-scroller" className="probe-scroll-box" tabIndex={0}>
              {Array.from({ length: 30 }).map((_, idx) => (
                <div key={idx} className="probe-scroll-item" id={`item-${idx + 1}`}>
                  Item #{idx + 1} — Scroll up and down here
                </div>
              ))}
            </div>
          </div>

          {/* Target 3: Empty space */}
          <div className="probe-section">
            <h3>Test 3: Scroll over Empty Space & Back Swipe</h3>
            <div id="empty-space" className="probe-empty-zone">
              <span>Empty Space Zone (#empty-space)</span>
              <p>Scroll here to test wheel/touch on map background, then swipe left 5 times to test back navigation.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Live Event Feed */}
        <div className="probe-log-panel">
          <div className="log-panel-header">
            <h3>Live Event Stream ({logs.length} logged)</h3>
            <button
              type="button"
              className="clear-log-btn"
              onClick={() => {
                logsRef.current = [];
                setLogs([]);
                setTapCount(0);
              }}
            >
              Clear
            </button>
          </div>

          <div className="probe-log-table-wrapper">
            <table className="probe-log-table">
              <thead>
                <tr>
                  <th>t (ms)</th>
                  <th>type</th>
                  <th>target</th>
                  <th>x, y</th>
                  <th>pointerType</th>
                  <th>deltaY</th>
                  <th>key</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((entry, idx) => (
                  <tr key={idx} className={`event-row event-${entry.type}`}>
                    <td className="mono">{entry.t}</td>
                    <td className="mono bold">{entry.type}</td>
                    <td>{entry.target || '-'}</td>
                    <td className="mono">
                      {entry.x !== undefined ? `${entry.x}, ${entry.y}` : '-'}
                    </td>
                    <td>{entry.pointerType || '-'}</td>
                    <td className="mono">{entry.deltaY !== undefined ? entry.deltaY : '-'}</td>
                    <td>{entry.key || (entry.state ? `state: ${JSON.stringify(entry.state)}` : '-')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
