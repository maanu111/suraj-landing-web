"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

/** Splits "340+", "62M", "+218%" or "4.3" into prefix / number / suffix. */
const PARTS = /^([^\d.-]*)(-?\d*\.?\d+)(.*)$/;

type Props = {
  /** The final value, written exactly as it should read — e.g. "62M". */
  value: string;
  durationMs?: number;
};

export default function CountUp({ value, durationMs = 1700 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  // Render the finished value on the server so the markup is correct without JS.
  const [text, setText] = useState(value);

  useEffect(() => {
    const node = ref.current;
    const match = PARTS.exec(value);
    if (!node || !match) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    const [, prefix, numeric, suffix] = match;
    const target = Number(numeric);
    const decimals = numeric.includes(".") ? numeric.split(".")[1].length : 0;
    const format = (n: number) => `${prefix}${n.toFixed(decimals)}${suffix}`;

    let frame = 0;
    let startedAt = 0;
    let done = false;
    const tick = (now: number) => {
      if (!startedAt) startedAt = now;
      const progress = Math.min(1, (now - startedAt) / durationMs);
      const eased = 1 - Math.pow(1 - progress, 3);
      setText(format(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
      else done = true;
    };

    let settle: ReturnType<typeof setTimeout> | undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();
        // Drop to zero only once the animation is actually starting. Resetting
        // eagerly in the effect left the number stuck on "0" whenever the
        // observer never fired (hidden tab, or no IntersectionObserver).
        setText(format(0));
        frame = requestAnimationFrame(tick);
        // Browsers suspend rAF in hidden or occluded tabs. Without this the
        // counter would sit on "0" forever, which is worse than not animating.
        settle = setTimeout(() => {
          if (!done) setText(value);
        }, durationMs + 400);
      },
      { threshold: 0.4 },
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      if (settle) clearTimeout(settle);
    };
  }, [value, durationMs]);

  /* One text node, no overlay copy — nothing here can ever stack on itself.
     Styles are inline so the number always inherits its heading's type scale,
     and min-width reserves the final width so digits don't shift while counting. */
  const style: CSSProperties = {
    display: "inline-block",
    minWidth: `${value.length}ch`,
    font: "inherit",
    color: "inherit",
    letterSpacing: "inherit",
    fontVariantNumeric: "tabular-nums",
    whiteSpace: "nowrap",
  };

  return (
    <span style={style} ref={ref}>
      {text}
    </span>
  );
}
