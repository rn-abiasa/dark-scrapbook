import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Tape from "./Tape";

function Shell({ label, onClose, children }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    const prevFocus = document.activeElement;
    closeRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "Tab") {
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
      prevFocus?.focus?.();
    };
  }, [onClose]);

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      className="lightbox fixed inset-0 z-50 grid place-items-center bg-black/80 p-4"
      onClick={onClose}
    >
      {/* kertas yang "ditempel" di atas halaman */}
      <div
        className="lightbox-card relative w-[min(92vw,400px)] -rotate-[0.8deg]"
        onClick={(e) => e.stopPropagation()}
      >
        <Tape className="-top-2 left-8 z-20" rotate={-5} />
        <Tape className="-top-2 right-8 z-20" rotate={4} />
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="absolute right-4 top-3 z-20 font-hand text-3xl leading-none text-chalk underline underline-offset-4"
        >
          Tutup
        </button>
        <div className="paper max-h-[88dvh] overflow-y-auto overscroll-contain rounded-[3px] border border-dashed border-chalk/35 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.7)]">
          {children}
        </div>
      </div>
    </div>
  );
}

// Dialog berbentuk kertas scrapbook. Hanya dirender (dan hanya memasang listener)
// saat `open`, jadi tidak membebani halaman saat tertutup.
export default function PaperDialog({ open, onClose, label, children }) {
  if (!open) return null;
  return createPortal(
    <Shell label={label} onClose={onClose}>
      {children}
    </Shell>,
    document.body,
  );
}
