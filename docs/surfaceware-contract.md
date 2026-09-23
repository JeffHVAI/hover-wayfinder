# SurfaceWare CDP Input Contract

This document defines the input contract between **SurfaceWare** (running on the HoverOS NUC) and the **hover-wayfinder** kiosk web application. 

SurfaceWare injects touch, scroll, and back gestures over the Chrome DevTools Protocol (CDP) into the running Chromium instance without modifying HoverOS. The web application is architected to consume these exact event forms.

---

## 1. Gesture Event Matrix

| User Gesture | SurfaceWare CDP Command | Browser Event Emitted | Application Adapter Action |
| :--- | :--- | :--- | :--- |
| **Tap / Press** | `Input.dispatchTouchEvent` (`touchStart` / `touchEnd`) or `Input.dispatchMouseEvent` (`mousePressed` / `mouseReleased`) | `pointerdown` followed by `click` | • **On `pointerdown`**: Trigger instantaneous fill change + 150ms ripple animation.<br>• **On `click`**: Commit action.<br>• **De-dupe**: 350ms filter drops duplicate taps on the same target.<br>• **Gap Flash**: Tap landing in a gap flashes the nearest target outline. |
| **Scroll (Over List)** | `Input.dispatchMouseEvent` (`mouseWheel`) or `Input.dispatchTouchEvent` (`touchMove` stream @ 30 FPS) | `wheel` or `touchmove` with vertical delta | Native list scrolling handled smoothly via `touch-action: pan-y`. |
| **Scroll (Over Map)** | `Input.dispatchMouseEvent` (`mouseWheel`) or `Input.dispatchTouchEvent` (`touchMove` stream @ 30 FPS) | `wheel` (non-passive) or `touchmove` | Captured by `attachMapScrollZoom()`: throttled to 100ms rate limit and accumulated `deltaY > 40px` converts to `Camera.animateTo({ zoomLevel: +/- 0.5 })`. |
| **Back Swipe** | `Page.navigateToHistoryEntry`, `history.back()`, or `Input.dispatchKeyEvent` (`BrowserBack` / `Alt+ArrowLeft`) | `popstate` or `keydown` | Captured by `initBackGuard()`: pops screen stack. Protected by dual sentinels (`root` and `guard`) so back from Home re-arms and never navigates away from the web application. |

---

## 2. Touch Target Sizing & Spacing Contract

* **Minimum Target Dimensions**: `96px × 96px` (`--target-min: 96px`)
* **Minimum Inter-Target Gap**: `20px` (`--gap: 20px`)
* **Placement**: Primary interactive actions (e.g., "Take Me There", "Clear Route") are positioned in the **lower-centre band** of the directory panel to accommodate natural reach and touchless aim comfort.
* **Gap Feedback**: Taps landing within gaps trigger a momentary cyan glow (`aim-flash`) on the nearest `data-touch-target="true"` element to confirm sensor reception without firing an unwanted click.

---

## 3. History & Navigation Guard Contract

To ensure Chromium never navigates backward away from the web app or loads a blank start page:

1. **At Initialization**:
   ```javascript
   history.replaceState({ root: true }, '');
   history.pushState({ guard: true }, '');
   ```
2. **On Each Screen Transition**:
   ```javascript
   history.pushState({ screen: true }, '');
   ```
3. **On `popstate`**:
   - If screen stack depth > 1, pops to previous screen.
   - If at root (Home/Attract), automatically pushes `{ guard: true }` to re-arm the sentinel.
4. **Viewport & Overscroll Guards**:
   - `html, body { overscroll-behavior: none; }`
   - `<meta name="viewport" content="... user-scalable=no ...">`
   - Prevents Chromium pull-to-refresh, edge swipe history gestures, or stray zoom pinches.

---

## 4. Verification with `/probe`

The `/probe` test harness is deployed directly inside the application:
1. Open `https://<host>/probe` on the kiosk.
2. Perform 10 taps on `#tap-target`.
3. Scroll `#scroller` up and down.
4. Scroll over `#empty-space`.
5. Perform 5 back gestures.
6. Press **"Send to /api/probe"** or **"Export JSON"** to review the captured telemetry.
