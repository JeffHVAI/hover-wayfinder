# Hover Wayfinder — Demo Runbook

This guide covers deployment, pre-demo verification, operation, and troubleshooting for the **Hover Wayfinder** touchless kiosk web application.

---

## 1. Architecture Summary

- **Static Web App**: Cloudflare Pages / Static CDN.
- **Serverless Token Function**: `functions/api/mappedin-token.ts` provides ephemeral access tokens using Cloudflare Pages Secrets.
- **Client Runtime**: Pure client-side WebGL using `@mappedin/mappedin-js` v6.
- **Zero NUC Modification**: Runs inside HoverOS Chromium connected to SurfaceWare over CDP.

---

## 2. Setting Up Cloudflare Pages

### A. Environment Variables & Secrets
In the Cloudflare Dashboard under **Workers & Pages > hover-wayfinder > Settings > Environment variables**:

| Variable Name | Type | Value / Purpose |
| :--- | :--- | :--- |
| `MAPPEDIN_KEY` | Secret | Mappedin demo venue API Key |
| `MAPPEDIN_SECRET` | Secret | Mappedin demo venue API Secret |
| `MAPPEDIN_TOKEN_URL` | Plaintext / Env | Mappedin OAuth / Token URL |

*(For fallback local demos, `VITE_MI_KEY` and `VITE_MI_SECRET` can be defined in `.env.local`)*

### B. Deployment Domains
- **Production**: `https://wayfinder-demo.hoververse.ai` (Targeted by tag `v*.*.*`)
- **Staging**: `https://staging.hover-wayfinder.pages.dev` (Targeted by `main`)
- **Preview**: `https://<pr-branch>.hover-wayfinder.pages.dev` (Every PR)

---

## 3. Launching on the Kiosk

### Option 1: Kiosk Start URL (Recommended)
Set the kiosk's Chromium start URL in HoverOS settings:
```
https://wayfinder-demo.hoververse.ai/?site=mall-a
```

### Option 2: Fallback Device
If the kiosk hardware or SurfaceWare is temporarily unavailable, open the identical URL on any touchscreen laptop, iPad, or tablet browser. All gestures fall back gracefully to standard touch and mouse events.

---

## 4. Pre-Demo Checklist (15 Minutes Before Live Demo)

- [ ] **1. Attract Screen Active**: Kiosk displays the animated gesture showcase cards ("Point & Push", "Move Up & Down", "Swipe Left") with venue name.
- [ ] **2. Diagnostic HUD Check**: Tap 5 times quickly in the top-left corner to reveal the Diagnostic Status HUD:
  - App Version matches release tag (e.g., `1.0.0`)
  - Active Site ID matches venue
  - Render FPS is ≥ 55 FPS
  - Map Load Time is < 5000 ms
  - Last Error reads `None (Healthy)`
- [ ] **3. Tap Test**: Tap a Category Tile (e.g., "Dining"). Confirm instant fill highlight + ripple on press, navigating to category list.
- [ ] **4. Scroll Test**: Scroll the store list up and down. Confirm smooth list scrolling with `touch-action: pan-y`.
- [ ] **5. Map Zoom & Pan**:
  - Test scroll gesture over the 3D map canvas: confirms zoom in / out with rate limit.
  - Test Control Pad arrows (pan 15m) and Reset button.
- [ ] **6. Wayfinding Route**:
  - Tap a store to open Detail screen.
  - Tap the 96px "Take Me There" button in the lower-centre band.
  - Confirm animated wayfinding route draws on the 3D map, floor transitions are indicated, and turn-by-turn instruction steps populate.
- [ ] **7. Back Navigation**:
  - Swipe left: navigates back from Route to Detail, and Detail to Home.
  - Swipe left on Home: app remains on Home without navigating to a blank page or exiting Chromium.
- [ ] **8. Idle Reset**: Leave untouched for 45s: toast appears ("Still there?"). At 60s: resets to Attract screen and camera homes.

---

## 5. Resilience & Self-Updating

1. **Self-Updating**: The app queries `/version.json` every 5 minutes. If a new version is detected, it reloads silently on the next idle reset.
2. **Auto-Recovery**: If a network glitch occurs, the branded retry screen auto-retries every 15 seconds.
3. **WebGL Loss**: Listens for `webglcontextlost` on the canvas and triggers a clean reload.
4. **Memory Hygiene**: Full page refresh every night at 03:00 local time, and after every 200 idle resets.
