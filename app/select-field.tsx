"use client";

import { useEffect, useId, useRef, useState } from "react";

type Props = {
  name: string;
  label: string;
  placeholder: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
};

/**
 * Custom listbox. Native <select> can't be styled past its trigger — the option
 * panel is OS-drawn — so this renders its own panel and keeps the chosen value
 * in a hidden input for the form payload.
 */
export default function SelectField({ name, label, placeholder, options, value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const id = useId();

  // Close on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  // Keep the highlighted option scrolled into view.
  useEffect(() => {
    if (!open) return;
    listRef.current?.children[active]?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  function choose(option: string) {
    onChange(option);
    setOpen(false);
  }

  function onKeyDown(event: React.KeyboardEvent) {
    if (!open) {
      if (["Enter", " ", "ArrowDown", "ArrowUp"].includes(event.key)) {
        event.preventDefault();
        setActive(Math.max(0, options.indexOf(value)));
        setOpen(true);
      }
      return;
    }
    switch (event.key) {
      case "Escape":
        event.preventDefault();
        setOpen(false);
        break;
      case "ArrowDown":
        event.preventDefault();
        setActive((i) => (i + 1) % options.length);
        break;
      case "ArrowUp":
        event.preventDefault();
        setActive((i) => (i - 1 + options.length) % options.length);
        break;
      case "Home":
        event.preventDefault();
        setActive(0);
        break;
      case "End":
        event.preventDefault();
        setActive(options.length - 1);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        choose(options[active]);
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  }

  return (
    <div className="field">
      <label id={`${id}-label`} htmlFor={`${id}-trigger`}>
        {label}
      </label>
      <div className="select" ref={wrapRef} data-open={open || undefined}>
        <button
          id={`${id}-trigger`}
          type="button"
          className="select-trigger"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={`${id}-list`}
          aria-labelledby={`${id}-label ${id}-trigger`}
          onClick={() => {
            setActive(Math.max(0, options.indexOf(value)));
            setOpen((o) => !o);
          }}
          onKeyDown={onKeyDown}
        >
          <span className={value ? undefined : "select-placeholder"}>{value || placeholder}</span>
          <svg className="select-chevron" width="12" height="8" viewBox="0 0 12 8" fill="none" aria-hidden="true">
            <path d="M1 1.5 6 6.5 11 1.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {open ? (
          <ul className="select-panel" id={`${id}-list`} role="listbox" ref={listRef} aria-labelledby={`${id}-label`}>
            {options.map((option, index) => (
              <li
                key={option}
                role="option"
                aria-selected={option === value}
                className="select-option"
                data-active={index === active || undefined}
                onPointerEnter={() => setActive(index)}
                onClick={() => choose(option)}
              >
                {option}
                {option === value ? (
                  <svg width="13" height="10" viewBox="0 0 13 10" fill="none" aria-hidden="true">
                    <path d="M1 5l4 4 7-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : null}
              </li>
            ))}
          </ul>
        ) : null}

        <input type="hidden" name={name} value={value} />
      </div>
    </div>
  );
}
