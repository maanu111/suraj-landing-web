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

    setText(format(0));

    let frame = 0;
    let startedAt = 0;
    const tick = (now: number) => {
      if (!startedAt) startedAt = now;
      const progress = Math.min(1, (now - startedAt) / durationMs);
      const eased = 1 - Math.pow(1 - progress, 3);
      setText(format(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
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
