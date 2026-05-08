/**
 * vertical-timeline.ts
 * --------------------
 * Comportamiento del componente compartido `VerticalTimeline.astro`.
 *
 * Responsabilidades:
 *  1. Preparar el estado inicial oculto de marcador, fecha lateral, tarjeta y
 *     embebidos para cada evento, y revelar todo en cascada con anime.js
 *     cuando el evento entra al viewport.
 *  2. Rellenar la barra de progreso (`.vt-rail-progress`) según el avance del
 *     usuario sobre el riel.
 *  3. Lazy-load real de iframes (`[data-vt-iframe]`) cuando el embebido aparece
 *     en pantalla, para no penalizar el TTI con 20+ tableros de Power BI.
 *  4. Resaltar el chip activo de la mini-nav superior, manteniendo el foco
 *     dentro del carril horizontal sin afectar el scroll vertical de la página.
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
    const marker = event.querySelector<HTMLElement>('.vt-marker');
    const dateSide = event.querySelector<HTMLElement>('.vt-date-side');
    const card = event.querySelector<HTMLElement>('[data-vt-card]');
    const embeds = event.querySelectorAll<HTMLElement>('[data-vt-embed]');

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
    embeds.forEach((embed) => {
      embed.style.opacity = '0';
      embed.style.transform = 'translateY(18px) scale(0.96)';
    });
  });
};

/**
 * Revela un evento completo en cascada cuando entra en viewport: marcador con
 * rebote, fecha lateral con stagger entre día y mes, tarjeta deslizándose
 * hacia arriba y sub-tarjetas embebidas en oleadas.
 */
const revealEvent = (eventEl: HTMLElement): void => {
  if (reducedMotion()) return;

  // El atributo dispara el "ping" CSS sobre `.vt-marker::before`.
  eventEl.setAttribute('data-vt-arrived', 'true');

  const marker = eventEl.querySelector<HTMLElement>('.vt-marker');
  const dateSide = eventEl.querySelector<HTMLElement>('.vt-date-side');
  const card = eventEl.querySelector<HTMLElement>('[data-vt-card]');
  const embeds = eventEl.querySelectorAll<HTMLElement>('[data-vt-embed]');

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

  if (embeds.length > 0) {
    animate(Array.from(embeds), {
      opacity: [0, 1],
      y: [18, 0],
      scale: [0.96, 1],
      duration: 620,
      delay: stagger(85, { start: 280 }),
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

const initLazyEmbeds = (root: HTMLElement): IntersectionObserver | null => {
  const iframes = root.querySelectorAll<HTMLIFrameElement>('[data-vt-iframe]');
  if (iframes.length === 0) return null;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const iframe = entry.target as HTMLIFrameElement;
        const src = iframe.dataset.vtIframeSrc;
        if (src && iframe.src !== src) {
          iframe.src = src;
          iframe.addEventListener(
            'load',
            () => {
              const skeleton = iframe.parentElement?.querySelector<HTMLElement>(
                '.vt-embed-skeleton'
              );
              if (skeleton) skeleton.style.opacity = '0';
            },
            { once: true }
          );
        }
        obs.unobserve(iframe);
      });
    },
    { threshold: 0.05, rootMargin: '120px 0px' }
  );
  iframes.forEach((iframe) => observer.observe(iframe));
  return observer;
};

const initJumpHighlights = (root: HTMLElement): IntersectionObserver | null => {
  const chips = Array.from(root.querySelectorAll<HTMLAnchorElement>('[data-vt-jump]'));
  const events = root.querySelectorAll<HTMLElement>('[data-vt-event]');
  if (chips.length === 0 || events.length === 0) return null;

  const chipById = new Map<string, HTMLAnchorElement>();
  chips.forEach((chip) => {
    const target = chip.dataset.vtTarget;
    if (target) chipById.set(target, chip);
  });

  const track = root.querySelector<HTMLElement>('.vt-jumper-track');

  /**
   * Centra horizontalmente el chip activo dentro del carril de la mini-nav,
   * sin tocar el scroll vertical de la página. Antes se usaba
   * `scrollIntoView({ block: 'nearest' })`, pero ese método propaga el
   * desplazamiento a todos los ancestros y al final del timeline (cuando la
   * mini-nav sticky ya salió del viewport) terminaba devolviendo la página al
   * inicio para "traer" el chip a la vista.
   */
  const ensureChipVisibleInNav = (chip: HTMLAnchorElement): void => {
    if (!track) return;
    const trackRect = track.getBoundingClientRect();
    const chipRect = chip.getBoundingClientRect();
    const fullyVisible =
      chipRect.left >= trackRect.left && chipRect.right <= trackRect.right;
    if (fullyVisible) return;
    const target =
      chip.offsetLeft - track.clientWidth / 2 + chip.clientWidth / 2;
    track.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });
  };

  const setActive = (target: HTMLAnchorElement | null): void => {
    chips.forEach((chip) => {
      const isActive = chip === target;
      chip.classList.toggle('vt-jump-active', isActive);
      chip.setAttribute('aria-current', isActive ? 'true' : 'false');
      if (isActive) {
        chip.style.boxShadow = '0 0 0 1px rgba(96,165,250,0.65)';
      } else {
        chip.style.boxShadow = '';
      }
    });
    if (target) ensureChipVisibleInNav(target);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting);
      if (visible.length === 0) return;
      visible.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      const top = visible[0];
      const eventId = top.target.id;
      const chip = chipById.get(eventId) ?? null;
      setActive(chip);
    },
    { threshold: [0.25, 0.5, 0.75], rootMargin: '-30% 0px -50% 0px' }
  );
  events.forEach((event) => observer.observe(event));
  return observer;
};

export function initVerticalTimelines(): void {
  const sections = document.querySelectorAll<HTMLElement>('[data-vertical-timeline]');
  sections.forEach((section) => {
    prepareEvents(section);
    observeRevealEvents(section);
    initRailProgress(section);
    initLazyEmbeds(section);
    initJumpHighlights(section);
  });
}
