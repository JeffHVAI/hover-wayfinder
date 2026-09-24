import { useStore } from '../state/store';

let lastTapTarget: EventTarget | null = null;
let lastTapTime = 0;

export function setupTouchlessFeedback(): () => void {
  const handlePointerDown = (e: PointerEvent) => {
    useStore.getState().recordActivity();

    const target = (e.target as HTMLElement)?.closest('button, [role="button"], .kiosk-tap-target') as HTMLElement | null;

    if (target) {
      const now = performance.now();
      if (lastTapTarget === target && now - lastTapTime < 300) {
        return;
      }
      lastTapTarget = target;
      lastTapTime = now;

      // Add instant press feedback
      target.classList.add('kiosk-pressed');

      // Create 150ms ripple element on body to avoid mutating target's internal DOM
      const rect = target.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'touchless-ripple';
      const size = Math.max(rect.width, rect.height) * 1.5;
      ripple.style.position = 'fixed';
      ripple.style.pointerEvents = 'none';
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - size / 2}px`;
      ripple.style.top = `${e.clientY - size / 2}px`;

      document.body.appendChild(ripple);
      setTimeout(() => ripple.remove(), 250);

      const clearPress = () => {
        target.classList.remove('kiosk-pressed');
        target.removeEventListener('pointerup', clearPress);
        target.removeEventListener('pointercancel', clearPress);
      };
      target.addEventListener('pointerup', clearPress);
      target.addEventListener('pointercancel', clearPress);
    } else {
      // Tap landed in gap between targets -> flash nearest target's outline
      flashNearestTarget(e.clientX, e.clientY);
    }
  };

  window.addEventListener('pointerdown', handlePointerDown, { capture: true });

  return () => {
    window.removeEventListener('pointerdown', handlePointerDown, { capture: true });
  };
}

export const initTouchlessFeedback = setupTouchlessFeedback;

function flashNearestTarget(x: number, y: number) {
  const interactiveElements = Array.from(
    document.querySelectorAll<HTMLElement>('button, [role="button"], .kiosk-tap-target')
  );

  let nearest: HTMLElement | null = null;
  let minDistance = 120; // Only flash if within 120px radius

  interactiveElements.forEach((el) => {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dist = Math.hypot(x - cx, y - cy);

    if (dist < minDistance) {
      minDistance = dist;
      nearest = el;
    }
  });

  if (nearest) {
    const target = nearest as HTMLElement;
    target.classList.add('kiosk-gap-hint');
    setTimeout(() => {
      target.classList.remove('kiosk-gap-hint');
    }, 300);
  }
}
