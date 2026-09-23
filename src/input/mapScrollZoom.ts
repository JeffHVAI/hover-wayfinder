export function attachMapScrollZoom(el: HTMLElement, zoom: (delta: number) => void): () => void {
  let acc = 0;
  let last = 0;
  let lastY: number | null = null;

  const step = (dy: number) => {
    acc += dy;
    const now = performance.now();
    if (now - last > 100 && Math.abs(acc) > 40) {
      // Scroll up (negative delta) = zoom in (+0.5)
      zoom(acc < 0 ? 0.5 : -0.5);
      acc = 0;
      last = now;
    }
  };

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    step(e.deltaY);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (e.touches.length > 0) {
      const y = e.touches[0].clientY;
      if (lastY !== null) {
        e.preventDefault();
        e.stopPropagation();
        step(lastY - y);
      }
      lastY = y;
    }
  };

  const handleTouchEnd = () => {
    lastY = null;
  };

  el.addEventListener('wheel', handleWheel, { passive: false });
  el.addEventListener('touchmove', handleTouchMove, { passive: false, capture: true });
  el.addEventListener('touchend', handleTouchEnd, { capture: true });

  return () => {
    el.removeEventListener('wheel', handleWheel);
    el.removeEventListener('touchmove', handleTouchMove, { capture: true });
    el.removeEventListener('touchend', handleTouchEnd, { capture: true });
  };
}
