import { useEffect, useRef } from "react";

const clamp = (v) => Math.max(-1, Math.min(1, v));

// Fisika ringan: kursor menggerakkan target, lalu nilai mengejar target dengan
// pegas (sedikit memantul). Hasilnya dipublikasikan sebagai CSS variable
// --tx dan --ty (-1..1) di elemen root, jadi seluruh efek 3D murni lewat CSS.
export function useSpringTilt() {
  const rootRef = useRef(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduce.matches) return;

    const s = { x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0 };
    let raf = 0;
    let last = 0;

    const step = (now) => {
      const dt = Math.min((now - last) / 1000, 0.032);
      last = now;
      s.vx += ((s.tx - s.x) * 90 - s.vx * 13) * dt;
      s.vy += ((s.ty - s.y) * 90 - s.vy * 13) * dt;
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      el.style.setProperty("--tx", s.x.toFixed(4));
      el.style.setProperty("--ty", s.y.toFixed(4));
      const settled =
        Math.abs(s.tx - s.x) < 0.001 &&
        Math.abs(s.ty - s.y) < 0.001 &&
        Math.abs(s.vx) < 0.001 &&
        Math.abs(s.vy) < 0.001;
      raf = settled ? 0 : requestAnimationFrame(step);
    };

    const kick = () => {
      if (raf) return;
      last = performance.now();
      raf = requestAnimationFrame(step);
    };

    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      s.tx = clamp(((e.clientX - r.left) / r.width - 0.5) * 2);
      s.ty = clamp(((e.clientY - r.top) / r.height - 0.5) * 2);
      kick();
    };
    const onLeave = () => {
      s.tx = 0;
      s.ty = 0;
      kick();
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return rootRef;
}
