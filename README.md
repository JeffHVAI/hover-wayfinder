# Hover Wayfinder

**Hover Wayfinder** is a cloud-hosted, zero-install 3D directory and wayfinding web application deployed to Cloudflare Pages and designed to run in HoverOS Chromium over CDP without installing anything on the NUC or modifying SurfaceWare.

---

## Quick Start

### 1. Install & Run Locally
```bash
npm install
npm run dev
```
Open [http://localhost:3001/](http://localhost:3001/) in your browser.

### 2. URL Parameters
- `?site=mall-a` (loads `public/sites/mall-a.json`)
- `/probe` or `#probe` (opens the SurfaceWare CDP Event Probe harness)

### 3. Build for Production
```bash
npm run build
```

---

## Documentation
- [SurfaceWare Input Contract](docs/surfaceware-contract.md)
- [Demo Runbook & Deployment Guide](docs/demo-runbook.md)
