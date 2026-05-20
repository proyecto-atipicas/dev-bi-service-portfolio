import { animate, stagger } from 'animejs';

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Duración del fundido; debe coincidir con `global.css` (`[data-hero-carousel-slide]`). */
const HERO_CAROUSEL_CROSSFADE_MS = 1150;

const SL_ACTIVE = 'hero-slide--active';
const SL_IDLE = 'hero-slide--idle';
const SL_TOP = 'hero-slide--top';

/**
 * Carrusel de vídeos de fondo en el hero: fundido cruzado con leve zoom,
 * avance automático al terminar cada clip (salvo movimiento reducido) y
 * controles de flechas y puntos.
 */
export function initHeroVideoCarousel(): void {
  const root = document.querySelector<HTMLElement>('[data-hero-video-carousel]');
  if (!root) return;

  const controls = document.querySelector<HTMLElement>('[data-hero-carousel-controls]');
  const slides = Array.from(root.querySelectorAll<HTMLElement>('[data-hero-carousel-slide]'));
  const videos = slides
    .map((s) => s.querySelector('video'))
    .filter((v): v is HTMLVideoElement => v instanceof HTMLVideoElement);

  if (videos.length === 0) return;

  const dots = controls
    ? Array.from(controls.querySelectorAll<HTMLButtonElement>('[data-hero-carousel-dot]'))
    : [];
  const btnPrev = controls?.querySelector<HTMLButtonElement>('[data-hero-carousel-prev]');
  const btnNext = controls?.querySelector<HTMLButtonElement>('[data-hero-carousel-next]');
  const btnPlay = controls?.querySelector<HTMLButtonElement>('[data-hero-carousel-play]');
  const btnFullscreen = controls?.querySelector<HTMLButtonElement>('[data-hero-carousel-fullscreen]');
  const fsEnterIcon = btnFullscreen?.querySelector<SVGElement>('[data-fs-enter]');
  const fsExitIcon = btnFullscreen?.querySelector<SVGElement>('[data-fs-exit]');
  const fullscreenRoot = document.querySelector<HTMLElement>('[data-hero-fullscreen-root]');

  const rm = reducedMotion();
  let index = 0;
  let transitioning = false;
  let transitionTimer: ReturnType<typeof window.setTimeout> | null = null;
  let autoplayEnabled = !rm;
  let heroVisible = true;

  if (videos.length === 1) {
    videos[0].loop = true;
  }

  const syncPlaySwitch = (): void => {
    if (!btnPlay) return;
    btnPlay.setAttribute('aria-checked', autoplayEnabled ? 'true' : 'false');
    btnPlay.setAttribute(
      'aria-label',
      autoplayEnabled ? 'Pausar reproducción del carrusel' : 'Reanudar reproducción del carrusel',
    );
  };

  const syncFullscreenUi = (): void => {
    if (!btnFullscreen || !fullscreenRoot) return;
    const isFs =
      document.fullscreenElement === fullscreenRoot ||
      (document as Document & { webkitFullscreenElement?: Element }).webkitFullscreenElement ===
        fullscreenRoot;
    btnFullscreen.setAttribute(
      'aria-label',
      isFs ? 'Salir de pantalla completa' : 'Ver en pantalla completa',
    );
    fsEnterIcon?.classList.toggle('hidden', isFs);
    fsExitIcon?.classList.toggle('hidden', !isFs);
  };

  const pauseAllVideos = (): void => {
    videos.forEach((v) => v.pause());
  };

  const playActiveIfAllowed = (): void => {
    if (!autoplayEnabled || !heroVisible) return;
    void videos[index].play().catch(() => {});
  };

  const applySlide = (slide: HTMLElement, mode: 'active' | 'idle'): void => {
    slide.classList.toggle(SL_ACTIVE, mode === 'active');
    slide.classList.toggle(SL_IDLE, mode === 'idle');
    if (mode === 'idle') slide.classList.remove(SL_TOP);
  };

  const setAriaSlides = (activeIndex: number): void => {
    slides.forEach((slide, i) => {
      slide.setAttribute('aria-hidden', i === activeIndex ? 'false' : 'true');
    });
  };

  const syncControls = (): void => {
    dots.forEach((d, i) => {
      if (i === index) {
        d.setAttribute('data-active', '');
        d.setAttribute('aria-current', 'true');
      } else {
        d.removeAttribute('data-active');
        d.removeAttribute('aria-current');
      }
    });
  };

  const goTo = async (raw: number): Promise<void> => {
    const n = ((raw % videos.length) + videos.length) % videos.length;
    if (n === index) return;
    if (transitioning) return;

    const prev = index;
    transitioning = true;

    videos[prev].pause();
    videos.forEach((v) => {
      v.loop = false;
    });

    index = n;
    syncControls();

    const prevSlide = slides[prev];
    const nextSlide = slides[n];
    const nextVideo = videos[n];

    nextVideo.currentTime = 0;
    if (rm) nextVideo.loop = true;

    if (rm) {
      slides.forEach((s, i) => applySlide(s, i === n ? 'active' : 'idle'));
      setAriaSlides(n);
      transitioning = false;
      playActiveIfAllowed();
      return;
    }

    nextVideo.loop = false;
    nextSlide.classList.add(SL_TOP);

    playActiveIfAllowed();

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        applySlide(nextSlide, 'active');
        applySlide(prevSlide, 'idle');
        setAriaSlides(n);
      });
    });

    transitionTimer = window.setTimeout(() => {
      nextSlide.classList.remove(SL_TOP);
      transitioning = false;
      transitionTimer = null;
    }, HERO_CAROUSEL_CROSSFADE_MS + 50);
  };

  videos.forEach((v) => {
    v.loop = false;
  });
  if (rm) videos[0].loop = true;

  if (!rm && videos.length > 1) {
    videos.forEach((v, i) => {
      v.addEventListener('ended', () => {
        if (index !== i || !autoplayEnabled) return;
        void goTo(i + 1);
      });
    });
  }

  dots.forEach((d, i) => {
    d.addEventListener('click', (e) => {
      e.stopPropagation();
      void goTo(i);
    });
  });
  btnPrev?.addEventListener('click', (e) => {
    e.stopPropagation();
    void goTo(index - 1);
  });
  btnNext?.addEventListener('click', (e) => {
    e.stopPropagation();
    void goTo(index + 1);
  });

  controls?.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      void goTo(index - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      void goTo(index + 1);
    } else if (e.key === 'Home') {
      e.preventDefault();
      void goTo(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      void goTo(videos.length - 1);
    }
  });

  syncControls();
  syncPlaySwitch();

  if (autoplayEnabled) {
    playActiveIfAllowed();
  } else {
    pauseAllVideos();
  }

  btnPlay?.addEventListener('click', (e) => {
    e.stopPropagation();
    autoplayEnabled = !autoplayEnabled;
    syncPlaySwitch();
    if (autoplayEnabled) {
      playActiveIfAllowed();
    } else {
      pauseAllVideos();
    }
  });

  btnFullscreen?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!fullscreenRoot) return;
    const doc = document as Document & {
      webkitFullscreenElement?: Element;
      webkitExitFullscreen?: () => Promise<void>;
    };
    const isFs =
      document.fullscreenElement === fullscreenRoot ||
      doc.webkitFullscreenElement === fullscreenRoot;
    const requestFs =
      fullscreenRoot.requestFullscreen?.bind(fullscreenRoot) ??
      (fullscreenRoot as HTMLElement & { webkitRequestFullscreen?: () => void })
        .webkitRequestFullscreen?.bind(fullscreenRoot);
    try {
      if (isFs) {
        if (document.exitFullscreen) void document.exitFullscreen();
        else void doc.webkitExitFullscreen?.();
      } else if (requestFs) {
        void requestFs();
      }
    } catch {
      /* API no disponible */
    }
  });

  document.addEventListener('fullscreenchange', syncFullscreenUi);
  document.addEventListener('webkitfullscreenchange', syncFullscreenUi);
  syncFullscreenUi();

  const hero = root.closest('.hero-visual');
  if (hero) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          heroVisible = e.isIntersecting;
          if (heroVisible) playActiveIfAllowed();
          else pauseAllVideos();
        });
      },
      { threshold: 0.06 },
    );
    io.observe(hero);
  }
}

/** Nav + textos con scroll: todas las páginas que usan Layout. */
export function initNavAndTextAnimations(): void {
  if (reducedMotion()) return;

  const navItems = document.querySelectorAll('[data-animate-nav]');
  if (navItems.length > 0) {
    navItems.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(-14px)';
    });
    animate(Array.from(navItems), {
      opacity: [0, 1],
      y: [-14, 0],
      duration: 550,
      delay: stagger(80),
      ease: 'outCubic',
    });
  }

  const animatedText = document.querySelectorAll('[data-animate-text]');
  if (animatedText.length === 0) return;

  animatedText.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
  });

  const textObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const target = entry.target;
        animate(target, {
          opacity: [0, 1],
          y: [20, 0],
          duration: 780,
          ease: 'outCubic',
          onComplete: () => {
            if (target instanceof HTMLElement) {
              target.style.removeProperty('opacity');
              target.style.removeProperty('transform');
            }
          },
        });
        obs.unobserve(target);
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -4% 0px' }
  );

  animatedText.forEach((el) => textObserver.observe(el));
}

/** Bloques, grid de servicios y videos: solo home. */
export function initHomePageEffects(): void {
  document.querySelectorAll('[data-service-preview]').forEach((el) => {
    if (!(el instanceof HTMLVideoElement)) return;
    el.loop = true;
    el.addEventListener('ended', () => {
      el.currentTime = 0;
      void el.play();
    });
  });

  if (reducedMotion()) return;

  const fadeBlocks = document.querySelectorAll('[data-animate]');
  fadeBlocks.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(22px)';
  });

  const staggerContainers = document.querySelectorAll('[data-stagger]');
  staggerContainers.forEach((container) => {
    container.style.opacity = '1';
    container.style.transform = 'none';
    Array.from(container.children).forEach((child) => {
      child.style.opacity = '0';
      child.style.transform = 'translateY(22px)';
    });
  });

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const target = entry.target;
        if (target.hasAttribute('data-stagger')) {
          const items = Array.from(target.children);
          animate(items, {
            opacity: [0, 1],
            y: [22, 0],
            duration: 580,
            delay: stagger(90, { start: 0 }),
            ease: 'outCubic',
            onComplete: () => {
              items.forEach((node) => {
                if (node instanceof HTMLElement) {
                  node.style.removeProperty('opacity');
                  node.style.removeProperty('transform');
                }
              });
            },
          });
        } else {
          animate(target, {
            opacity: [0, 1],
            y: [22, 0],
            duration: 620,
            ease: 'outCubic',
            onComplete: () => {
              if (target instanceof HTMLElement) {
                target.style.removeProperty('opacity');
                target.style.removeProperty('transform');
              }
            },
          });
        }
        obs.unobserve(target);
      });
    },
    { threshold: 0.15 }
  );

  fadeBlocks.forEach((block) => observer.observe(block));
  staggerContainers.forEach((block) => observer.observe(block));

  const serviceCards = document.querySelectorAll('[data-service-card]');
  const cardObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const card = entry.target;
        const media = card.querySelector('.service-media');
        if (media instanceof HTMLElement) {
          media.style.opacity = '0.55';
          media.style.transform = 'scale(1.08)';
          animate(media, {
            opacity: [0.55, 1],
            scale: [1.08, 1],
            duration: 900,
            ease: 'outCubic',
            onComplete: () => {
              media.style.removeProperty('opacity');
              media.style.removeProperty('transform');
            },
          });
        }
        obs.unobserve(card);
      });
    },
    { threshold: 0.2 }
  );
  serviceCards.forEach((card) => cardObserver.observe(card));
}

/**
 * Resalta el enlace del sub-nav de servicios correspondiente a la sección
 * actualmente visible. Usa `IntersectionObserver` para no atar el render
 * al scroll y respeta `prefers-reduced-motion` no cambiando la marca.
 */
export function initServicesSubnav(): void {
  const links = Array.from(
    document.querySelectorAll<HTMLAnchorElement>('[data-subnav-link]'),
  );
  if (links.length === 0) return;

  const sectionToLink = new Map<HTMLElement, HTMLAnchorElement>();
  links.forEach((link) => {
    const anchor = link.dataset.subnavLink;
    if (!anchor) return;
    const target = document.getElementById(anchor);
    if (target instanceof HTMLElement) sectionToLink.set(target, link);
  });

  if (sectionToLink.size === 0) return;

  const markActive = (anchor: string | null): void => {
    links.forEach((link) => {
      const isActive = link.dataset.subnavLink === anchor;
      if (isActive) link.dataset.active = 'true';
      else delete link.dataset.active;
    });
  };

  const visibility = new Map<HTMLElement, number>();
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!(entry.target instanceof HTMLElement)) return;
        visibility.set(entry.target, entry.intersectionRatio);
      });
      let top: { el: HTMLElement; ratio: number } | null = null;
      visibility.forEach((ratio, el) => {
        if (!top || ratio > top.ratio) top = { el, ratio };
      });
      if (top && top.ratio > 0) {
        markActive(top.el.id);
      } else {
        markActive(null);
      }
    },
    { rootMargin: '-30% 0px -55% 0px', threshold: [0, 0.15, 0.5, 1] },
  );
  sectionToLink.forEach((_, section) => observer.observe(section));
}

/**
 * Slider horizontal de palabras clave (home, sección contacto):
 * desplazamiento continuo + flechas; bucle con dos copias del contenido.
 */
export function initContactKeywordSlider(): void {
  const scroller = document.getElementById('contact-tags-slider');
  if (!scroller || !(scroller instanceof HTMLElement)) return;

  scroller.classList.add('scrollbar-none');

  const halfWidth = () => scroller.scrollWidth / 2;

  let running = false;
  const io = new IntersectionObserver(
    (entries) => {
      running = entries.some((e) => e.isIntersecting);
    },
    { threshold: 0.04, rootMargin: '40px 0px' }
  );
  io.observe(scroller);

  const speed = reducedMotion() ? 0 : 0.48;

  const tick = (): void => {
    if (!document.hidden && running && speed > 0) {
      scroller.scrollLeft += speed;
      const half = halfWidth();
      if (half > 0 && scroller.scrollLeft >= half - 0.5) {
        scroller.scrollLeft -= half;
      }
    }
    requestAnimationFrame(tick);
  };

  if (speed > 0) {
    requestAnimationFrame(tick);
  }
}
