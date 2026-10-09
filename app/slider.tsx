"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Horizontal rail that advances on its own and can also be driven by hand —
 * drag, wheel, swipe, arrow buttons or keyboard. Auto-advance pauses the
 * moment a person touches it and resumes a few seconds after they stop.
 *
 * Used by every section that holds a row of cards.
 */
export default function Slider({
  children,
  label,
  autoMs = 4000,
  className = "",
}: {
  children: ReactNode;
  label: string;
  /** Delay between automatic advances. 0 disables auto-advance. */
  autoMs?: number;
  className?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animation = useRef<number | null>(null);
  const fallback = useRef<ReturnType<typeof setTimeout> | null>(null);

  const syncEdges = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setAtStart(track.scrollLeft <= 2);
    setAtEnd(track.scrollLeft + track.clientWidth >= track.scrollWidth - 2);
  }, []);

  /** Width of one card plus the gap. */
  const step = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 0;
    const card = track.firstElementChild as HTMLElement | null;
    const gap = parseFloat(getComputedStyle(track).columnGap || "0") || 0;
    return card ? card.offsetWidth + gap : track.clientWidth * 0.8;
  }, []);

  /**
   * Scrolls with our own easing instead of `behavior: "smooth"`.
   * Chrome cancels native smooth scrolls on a scroll-snap container — the
   * call returns having moved nothing — so every write here is instant and
   * the animation is driven frame by frame.
   */
  const animateTo = useCallback((target: number) => {
    const track = trackRef.current;
    if (!track) return;
    if (animation.current) cancelAnimationFrame(animation.current);

    const max = track.scrollWidth - track.clientWidth;
    const to = Math.max(0, Math.min(max, target));
    const from = track.scrollLeft;
    const distance = to - from;
    if (Math.abs(distance) < 1) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      track.scrollLeft = to;
      return;
    }

    const duration = 620;
    let startedAt = 0;
    let ticked = false;

    const tick = (now: number) => {
      ticked = true;
      if (!startedAt) startedAt = now;
      const progress = Math.min(1, (now - startedAt) / duration);
      // easeInOutCubic: no hard kick at the start, settles instead of stopping dead
      const eased = progress < 0.5 ? 4 * progress ** 3 : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      track.scrollLeft = from + distance * eased;
      if (progress < 1) animation.current = requestAnimationFrame(tick);
      else syncEdges();
    };
    animation.current = requestAnimationFrame(tick);

    // Browsers suspend rAF in hidden or occluded tabs, which would leave the
    // scroll exactly where it started. Land it without animation instead.
    if (fallback.current) clearTimeout(fallback.current);
    fallback.current = setTimeout(() => {
      if (!ticked) track.scrollLeft = to;
      syncEdges();
    }, 150);
  }, [syncEdges]);

  /** Pause auto-advance while a person is interacting, then resume. */
  const holdAuto = useCallback(() => {
    setPaused(true);
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => setPaused(false), 5000);
  }, []);

  const scrollByCards = useCallback(
    (direction: number) => {
      holdAuto();
      const track = trackRef.current;
      if (track) animateTo(track.scrollLeft + direction * step());
    },
    [animateTo, holdAuto, step],
  );

  useEffect(() => {
    syncEdges();
    const track = trackRef.current;
    if (!track) return;
    track.addEventListener("scroll", syncEdges, { passive: true });
    window.addEventListener("resize", syncEdges);
    return () => {
      track.removeEventListener("scroll", syncEdges);
      window.removeEventListener("resize", syncEdges);
    };
  }, [syncEdges]);

  // Auto-advance, looping back to the start at the end.
  useEffect(() => {
    if (!autoMs || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = setInterval(() => {
      const track = trackRef.current;
      if (!track || track.scrollWidth <= track.clientWidth + 4) return;
      const atTheEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
      animateTo(atTheEnd ? 0 : track.scrollLeft + step());
    }, autoMs);

    return () => clearInterval(id);
  }, [animateTo, autoMs, paused, step]);

  // Drag to scroll with a mouse; touch already scrolls natively.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let down = false;
    let startX = 0;
    let startLeft = 0;

    const onDown = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      down = true;
      startX = event.clientX;
      startLeft = track.scrollLeft;
      holdAuto();
    };
    const onMove = (event: PointerEvent) => {
      if (!down) return;
      const delta = event.clientX - startX;
      if (Math.abs(delta) > 3) {
        track.classList.add("is-dragging");
        track.scrollLeft = startLeft - delta;
      }
    };
    const onUp = () => {
      down = false;
      track.classList.remove("is-dragging");
    };

    track.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      track.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [holdAuto]);

  useEffect(
    () => () => {
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
      if (fallback.current) clearTimeout(fallback.current);
      if (animation.current) cancelAnimationFrame(animation.current);
    },
    [],
  );

  return (
    <div className={`slider ${className}`.trim()} onPointerEnter={holdAuto} onFocusCapture={holdAuto}>
      <div
        className="slider-track"
        ref={trackRef}
        role="region"
        aria-label={label}
        tabIndex={0}
        onTouchStart={holdAuto}
        onWheel={holdAuto}
      >
        {children}
      </div>

      <div className="slider-controls">
        <button type="button" onClick={() => scrollByCards(-1)} disabled={atStart} aria-label={`Previous — ${label}`}>
          ←
        </button>
        <button type="button" onClick={() => scrollByCards(1)} disabled={atEnd} aria-label={`Next — ${label}`}>
          →
        </button>
      </div>
    </div>
  );
}
