import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { LightboxContext } from "./lightboxContext";
import { placeholderStyle } from "./placeholder";

function Viewer({ items, index, onClose, onStep }) {
  const item = items[index];
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const touchX = useRef(null);
  const name = item.alt || item.label || "Foto";

  useEffect(() => {
    closeRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") onStep(-1);
      else if (e.key === "ArrowRight") onStep(1);
      else if (e.key === "Tab") {
        const f = dialogRef.current?.querySelectorAll("button");
        if (!f?.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, onStep]);

  const many = items.length > 1;
  const navBtn =
    "absolute top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-chalk/40 bg-black/40 font-type text-xl text-chalk hover:bg-black/70";

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Pratinjau foto: ${name}`}
      className="lightbox fixed inset-0 z-50 grid place-items-center bg-black/85 p-4 backdrop-blur-sm"
      onClick={onClose}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current == null || !many) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > 50) onStep(dx < 0 ? 1 : -1);
      }}
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 font-hand text-3xl leading-none text-chalk underline underline-offset-4"
      >
        Tutup
      </button>

      {many && (
        <>
          <button type="button" aria-label="Foto sebelumnya" className={`${navBtn} left-2 sm:left-5`} onClick={(e) => { e.stopPropagation(); onStep(-1); }}>
            ‹
          </button>
          <button type="button" aria-label="Foto berikutnya" className={`${navBtn} right-2 sm:right-5`} onClick={(e) => { e.stopPropagation(); onStep(1); }}>
            ›
          </button>
        </>
      )}

      <figure
        className="lightbox-card relative max-w-[min(92vw,720px)] bg-chalk p-2 pb-3 shadow-[0_20px_60px_rgba(0,0,0,0.7)]"
        onClick={(e) => e.stopPropagation()}
      >
        {item.src ? (
          <img src={item.src} alt={item.alt || ""} className="max-h-[76dvh] w-auto max-w-full object-contain" />
        ) : (
          <div
            className="grid aspect-[4/5] w-[min(78vw,400px)] place-items-center font-hand text-4xl text-chalk/70"
            style={placeholderStyle(index)}
          >
            {item.label}
          </div>
        )}
        <figcaption className="flex items-baseline justify-between gap-4 px-1 pt-2 text-ink">
          <span className="font-hand text-2xl leading-none">{name}</span>
          <span className="font-type text-xs text-ink/60">
            {index + 1} / {items.length}
          </span>
        </figcaption>
      </figure>
    </div>
  );
}

export function LightboxProvider({ items, children }) {
  const [index, setIndex] = useState(null);
  const triggerRef = useRef(null);
  const count = items.length;

  const open = useCallback((i) => {
    triggerRef.current = document.activeElement;
    setIndex(i ?? 0);
  }, []);

  const close = useCallback(() => {
    setIndex(null);
    triggerRef.current?.focus?.();
  }, []);

  const step = useCallback(
    (d) => setIndex((i) => (i == null ? i : (i + d + count) % count)),
    [count],
  );

  const value = useMemo(() => ({ open }), [open]);

  return (
    <LightboxContext.Provider value={value}>
      {children}
      {index !== null &&
        createPortal(<Viewer items={items} index={index} onClose={close} onStep={step} />, document.body)}
    </LightboxContext.Provider>
  );
}
