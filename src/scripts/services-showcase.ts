/**
 * services-showcase.ts
 * --------------------
 * Controlador del "service browser" interactivo de la home (`#servicios`).
 *
 * Funciones:
 *  - Activar pestañas (lista vertical) y sincronizar con el preview/panel.
 *  - Auto-rotación con barra de progreso pintada en `requestAnimationFrame`.
 *  - Pausar la rotación al hacer hover, focus o si el usuario pidió reducir
 *    movimiento.
 *  - Navegación con teclado (↑/↓/←/→) y atajos numéricos 1-4.
 *  - Crossfade entre videos y entre paneles de detalle.
 */

const ROTATION_MS = 7000;

const reducedMotion = (): boolean =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const pad2 = (n: number): string => String(n).padStart(2, '0');

export function initServicesShowcase(): void {
  const root = document.querySelector<HTMLElement>('[data-services-showcase]');
  if (!root) return;

  const tabs = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-showcase-tab]'));
  const videos = Array.from(root.querySelectorAll<HTMLVideoElement>('[data-showcase-video]'));
  const panels = Array.from(root.querySelectorAll<HTMLElement>('[data-showcase-panel]'));
  const counter = root.querySelector<HTMLElement>('[data-showcase-counter]');
  const total = tabs.length;
  if (total === 0) return;

  let active = 0;
  let isPaused = false;
  let raf = 0;
  let cycleStart = performance.now();
  /** Si está en true, los focus events ignoran su efecto (evita bucles cuando
   *  movemos foco programáticamente desde teclado). */
  let suppressFocusActivation = false;

  const setProgress = (ratio: number): void => {
    const fill = tabs[active]?.querySelector<HTMLElement>('[data-showcase-progress-fill]');
    if (fill) fill.style.transform = `scaleX(${ratio.toFixed(4)})`;
    tabs.forEach((tab, i) => {
      if (i === active) return;
      const otherFill = tab.querySelector<HTMLElement>('[data-showcase-progress-fill]');
      if (otherFill) otherFill.style.transform = 'scaleX(0)';
    });
  };

  const setActive = (next: number): void => {
    active = ((next % total) + total) % total;

    tabs.forEach((tab, i) => {
      const isActive = i === active;
      tab.dataset.active = isActive ? 'true' : 'false';
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
      tab.setAttribute('tabindex', isActive ? '0' : '-1');
    });

    videos.forEach((video, i) => {
      const isActive = i === active;
      video.dataset.active = isActive ? 'true' : 'false';
      if (isActive) {
        video.play().catch(() => {
          /* navegadores estrictos: ignorar silencio si no logra autoplay */
        });
      } else {
        video.pause();
      }
    });

    panels.forEach((panel, i) => {
      panel.dataset.active = i === active ? 'true' : 'false';
      panel.setAttribute('aria-hidden', i === active ? 'false' : 'true');
    });

    if (counter) counter.textContent = pad2(active + 1);

    cycleStart = performance.now();
    setProgress(0);
  };

  const tick = (now: number): void => {
    if (!isPaused && !reducedMotion()) {
      const elapsed = now - cycleStart;
      const ratio = Math.min(elapsed / ROTATION_MS, 1);
      setProgress(ratio);
      if (ratio >= 1) {
        setActive(active + 1);
      }
    }
    raf = requestAnimationFrame(tick);
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => setActive(i));
    tab.addEventListener('focus', () => {
      if (suppressFocusActivation) return;
      setActive(i);
    });
  });

  /** Mueve foco a la pestaña indicada sin disparar la lógica del focus listener. */
  const focusTab = (idx: number): void => {
    const tab = tabs[idx];
    if (!tab) return;
    suppressFocusActivation = true;
    tab.focus({ preventScroll: true });
    // Liberamos en el siguiente tick para dejar pasar el evento focus actual.
    requestAnimationFrame(() => {
      suppressFocusActivation = false;
    });
  };

  const pause = (): void => {
    isPaused = true;
  };
  const resume = (): void => {
    isPaused = false;
    cycleStart = performance.now();
  };
  root.addEventListener('mouseenter', pause);
  root.addEventListener('mouseleave', resume);
  root.addEventListener('focusin', pause);
  root.addEventListener('focusout', resume);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pause();
    else resume();
  });

  root.addEventListener('keydown', (event) => {
    const key = event.key;
    const navigateTo = (idx: number): void => {
      setActive(idx);
      focusTab(((idx % total) + total) % total);
    };
    if (key === 'ArrowDown' || key === 'ArrowRight') {
      event.preventDefault();
      navigateTo(active + 1);
    } else if (key === 'ArrowUp' || key === 'ArrowLeft') {
      event.preventDefault();
      navigateTo(active - 1);
    } else if (key === 'Home') {
      event.preventDefault();
      navigateTo(0);
    } else if (key === 'End') {
      event.preventDefault();
      navigateTo(total - 1);
    } else if (/^[1-9]$/.test(key)) {
      const idx = parseInt(key, 10) - 1;
      if (idx >= 0 && idx < total) {
        event.preventDefault();
        navigateTo(idx);
      }
    }
  });

  setActive(0);
  if (!reducedMotion()) {
    raf = requestAnimationFrame(tick);
  }

  // Cleanup de RAF al descargar la página (evita warnings en HMR durante dev).
  window.addEventListener('beforeunload', () => {
    if (raf) cancelAnimationFrame(raf);
  });
}
