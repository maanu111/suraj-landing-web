"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Turns a YouTube watch/short link into an autoplaying embed URL. */
function youTubeEmbed(url: string): string | null {
  const match = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{6,})/.exec(url);
  return match ? `https://www.youtube-nocookie.com/embed/${match[1]}?autoplay=1&rel=0` : null;
}

/**
 * Plays any `[data-video]` trigger in-page instead of following its href.
 * The href stays a working fallback when JS hasn't loaded.
 */
export default function VideoLightbox() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [src, setSrc] = useState<string | null>(null);

  const close = useCallback(() => setSrc(null), []);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      // Let modified clicks (new tab, download) behave normally.
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return;
      const trigger = (event.target as HTMLElement | null)?.closest<HTMLElement>("[data-video]");
      const video = trigger?.dataset.video;
      if (!video) return;
      event.preventDefault();
      setSrc(video);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (src && !dialog.open) dialog.showModal();
    if (!src && dialog.open) dialog.close();
  }, [src]);

  const embed = src ? youTubeEmbed(src) : null;

  return (
    <dialog className="lightbox" ref={dialogRef} onClose={close}>
      <div className="lightbox-frame">
        {src ? (
          embed ? (
            <iframe
              src={embed}
              title="Showreel"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <video src={src} controls autoPlay playsInline preload="metadata" />
          )
        ) : null}
      </div>
      <button type="button" className="lightbox-close" onClick={close} aria-label="Close video">
        ✕
      </button>
    </dialog>
  );
}
