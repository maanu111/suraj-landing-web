"use client";

import { useEffect } from "react";

export default function MotionEnhancer() {
  useEffect(() => {
    const root = document.documentElement;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const items = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const nav = document.querySelector<HTMLElement>("[data-nav]");
    const rail = document.querySelector<HTMLElement>("#work-rail");

    root.classList.add("motion-ready");

    // Frosted-glass nav state, coalesced into an animation frame.
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        nav?.classList.toggle("is-stuck", window.scrollY > 12);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Arrow controls for the horizontal work rail.
    const railButtons = Array.from(document.querySelectorAll<HTMLButtonElement>("[data-rail-scroll]"));
    const railHandlers = railButtons.map((button) => {
      const onClick = () => {
        const card = rail?.querySelector<HTMLElement>(".rail-card");
        const gap = card ? parseFloat(getComputedStyle(rail as HTMLElement).columnGap || "20") : 20;
        const distance = card ? card.offsetWidth + gap : (rail?.clientWidth ?? 0) * 0.8;
        rail?.scrollBy({
          left: Number(button.dataset.railScroll) * distance,
          behavior: prefersReducedMotion ? "auto" : "smooth",
        });
      };
      button.addEventListener("click", onClick);
      return { button, onClick };
    });

    // Six autoplay loops at once exceeds what the browser keeps decoding, so
    // only the clips actually on screen run. Also saves battery and CPU.
    const videos = Array.from(document.querySelectorAll<HTMLVideoElement>("video[autoplay]"));
    const videoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            video.play().catch(() => {
              /* autoplay can still be refused — the poster stays visible */
            });
          } else if (!video.paused) {
            video.pause();
          }
        });
      },
      { threshold: 0.2 },
    );
    if (!prefersReducedMotion) videos.forEach((video) => videoObserver.observe(video));

    const cleanup = () => {
      videoObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      railHandlers.forEach(({ button, onClick }) => button.removeEventListener("click", onClick));
      cancelAnimationFrame(frame);
      root.classList.remove("motion-ready");
    };

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return cleanup;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );

    items.forEach((item) => observer.observe(item));

    return () => {
      observer.disconnect();
      cleanup();
    };
  }, []);

  return null;
}
