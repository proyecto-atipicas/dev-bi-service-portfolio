/**
 * vertical-timeline.ts
 * --------------------
 * Comportamiento del componente compartido `VerticalTimeline.astro`.
 *
 * Responsabilidades:
 *  1. Preparar el estado inicial oculto de marcador, fecha lateral, tarjeta y
 *     enlaces para cada evento, y revelar todo en cascada con anime.js cuando
 *     el evento entra al viewport.
 *  2. Rellenar la barra de progreso (`.vt-rail-progress`) según el avance del
 *     usuario sobre el riel.
 *  3. Apertura/cierre exclusivo de los `<dialog>` modales del modo horizontal
 *     (lg+): un solo modal abierto a la vez, marcado de nodo activo, y cierre
 *     por backdrop, botón X o tecla Escape (esto último nativo del <dialog>).
 */

import { animate, stagger } from 'animejs';

const reducedMotion = (): boolean =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Aplica los estilos iniciales (ocultos / desplazados) a las piezas que vamos a
 * animar al entrar en viewport. Si el usuario prefiere reducir movimiento, no
 * tocamos nada y todo queda visible desde el inicio.
 */
const prepareEvents = (root: HTMLElement): void => {
  if (reducedMotion()) return;
  const events = root.querySelectorAll<HTMLElement>('[data-vt-event]');
  events.forEach((event) => {
    const marker = event.querySelector<HTMLElement>('.vt-event-vertical .vt-marker');
    const dateSide = event.querySelector<HTMLElement>('.vt-date-side');
    const card = event.querySelector<HTMLElement>('[data-vt-card]');

    if (marker) {
      marker.style.opacity = '0';
      marker.style.transform = 'scale(0.3)';
    }
    if (dateSide) {
      Array.from(dateSide.children).forEach((child) => {
        if (!(child instanceof HTMLElement)) return;
        child.style.opacity = '0';
        child.style.transform = 'translateX(-22px)';
      });
    }
    if (card) {
      card.style.opacity = '0';
      card.style.transform = 'translateY(28px)';
    }
  });
};

/**
 * Revela un evento completo en cascada cuando entra en viewport.
 */
const revealEvent = (eventEl: HTMLElement): void => {
  if (reducedMotion()) return;

  eventEl.setAttribute('data-vt-arrived', 'true');

  const marker = eventEl.querySelector<HTMLElement>('.vt-event-vertical .vt-marker');
  const dateSide = eventEl.querySelector<HTMLElement>('.vt-date-side');
  const card = eventEl.querySelector<HTMLElement>('[data-vt-card]');

  if (marker) {
    animate(marker, {
      opacity: [0, 1],
      scale: [0.3, 1.18, 1],
      duration: 760,
      ease: 'outElastic(1, 0.55)',
    });
  }

  if (dateSide && dateSide.children.length > 0) {
    animate(Array.from(dateSide.children), {
      opacity: [0, 1],
      x: [-22, 0],
      duration: 560,
      delay: stagger(80, { start: 120 }),
      ease: 'outCubic',
    });
  }

  if (card) {
    animate(card, {
      opacity: [0, 1],
      y: [28, 0],
      duration: 720,
      delay: 80,
      ease: 'outCubic',
    });
  }
};

const observeRevealEvents = (root: HTMLElement): IntersectionObserver | null => {
  const events = root.querySelectorAll<HTMLElement>('[data-vt-event]');
  if (events.length === 0) return null;

  if (reducedMotion()) {
    events.forEach((event) => event.setAttribute('data-vt-arrived', 'true'));
    return null;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        revealEvent(entry.target as HTMLElement);
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.18, rootMargin: '0px 0px -8% 0px' }
  );
  events.forEach((event) => observer.observe(event));
  return observer;
};

const initRailProgress = (root: HTMLElement): (() => void) | null => {
  const rail = root.querySelector<HTMLElement>('.vt-rail');
  const progress = root.querySelector<HTMLElement>('.vt-rail-progress');
  if (!rail || !progress) return null;

  let frame = 0;

  const compute = (): void => {
    const rect = rail.getBoundingClientRect();
    const viewportH = window.innerHeight || document.documentElement.clientHeight;
    const total = rect.height + viewportH * 0.5;
    const traveled = Math.min(Math.max(viewportH * 0.5 - rect.top, 0), total);
    const ratio = total > 0 ? Math.min(traveled / total, 1) : 0;
    progress.style.transform = `scaleY(${ratio.toFixed(4)})`;
  };

  const onScroll = (): void => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      compute();
    });
  };

  compute();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  return () => {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
    if (frame) cancelAnimationFrame(frame);
  };
};

/**
 * Apertura/cierre exclusivo de modales del modo horizontal.
 *
 *  - Cada nodo (`button[data-vt-open-modal]`) abre su `<dialog>` modal.
 *  - Al abrir uno se cierran los demás (un solo modal abierto a la vez).
 *  - Marca el nodo activo con `data-vt-active='true'` para que el dot crezca y
 *    para hacer desaparecer el hint inferior mediante `data-vt-modal-open` en
 *    la sección.
 *  - El cierre por backdrop se implementa detectando clicks cuyo target sea el
 *    propio `<dialog>` (los nativos de Escape y `form[method=dialog]` ya
 *    cierran el modal por sí solos).
 */
const initHorizontalModals = (root: HTMLElement): void => {
  const triggers = root.querySelectorAll<HTMLButtonElement>('[data-vt-open-modal]');
  const modals = root.querySelectorAll<HTMLDialogElement>('[data-vt-modal]');
  if (triggers.length === 0 || modals.length === 0) return;

  const triggerByModalId = new Map<string, HTMLButtonElement>();
  triggers.forEach((trigger) => {
    const id = trigger.dataset.vtOpenModal;
    if (id) triggerByModalId.set(id, trigger);
  });

  const clearActiveTriggers = (): void => {
    triggers.forEach((t) => t.removeAttribute('data-vt-active'));
  };

  const closeAll = (except?: HTMLDialogElement): void => {
    modals.forEach((dialog) => {
      if (dialog === except) return;
      if (dialog.open) dialog.close();
    });
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      const modalId = trigger.dataset.vtOpenModal;
      if (!modalId) return;
      const dialog = root.querySelector<HTMLDialogElement>(
        `[data-vt-modal-id="${modalId}"]`
      );
      if (!dialog) return;
      closeAll(dialog);
      if (typeof dialog.showModal === 'function' && !dialog.open) {
        try {
          dialog.showModal();
        } catch {
          /* showModal puede lanzar si ya está abierto: ignorar. */
        }
      }
    });
  });

  modals.forEach((dialog) => {
    // Cierre por click en el backdrop (target === el propio dialog).
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });

    // Marca el nodo activo al abrir y limpia al cerrar.
    dialog.addEventListener('close', () => {
      const id = dialog.dataset.vtModalId ?? '';
      const trigger = triggerByModalId.get(id);
      if (trigger) trigger.removeAttribute('data-vt-active');
      const anyOpen = Array.from(modals).some((m) => m.open);
      if (!anyOpen) root.removeAttribute('data-vt-modal-open');
    });
  });

  // Observa cuándo se abre cada modal para reflejarlo en el trigger y en la sección.
  // `<dialog>` no emite evento "open", pero podemos detectarlo desde el click handler
  // pre-existente o vigilando el atributo "open" con MutationObserver.
  const openObserver = new MutationObserver((mutations) => {
    mutations.forEach((m) => {
      if (m.type !== 'attributes' || m.attributeName !== 'open') return;
      const dialog = m.target as HTMLDialogElement;
      const id = dialog.dataset.vtModalId ?? '';
      if (dialog.open) {
        clearActiveTriggers();
        const trigger = triggerByModalId.get(id);
        if (trigger) trigger.setAttribute('data-vt-active', 'true');
        root.setAttribute('data-vt-modal-open', 'true');
      }
    });
  });
  modals.forEach((dialog) => {
    openObserver.observe(dialog, { attributes: true, attributeFilter: ['open'] });
  });
};

export function initVerticalTimelines(): void {
  const sections = document.querySelectorAll<HTMLElement>('[data-vertical-timeline]');
  sections.forEach((section) => {
    prepareEvents(section);
    observeRevealEvents(section);
    initRailProgress(section);
    initHorizontalModals(section);
  });
}
