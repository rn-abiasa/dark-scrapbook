import { useEffect, useRef } from "react";

const clamp = (v) => Math.max(-1, Math.min(1, v));

// Fisika ringan: kursor menggerakkan target, lalu nilai mengejar target dengan
// pegas (sedikit memantul). Hasilnya dipublikasikan sebagai CSS variable
// --tx dan --ty (-1..1) di elemen .tilt, jadi seluruh efek 3D murni lewat CSS.
//
// Catatan performa (biar hover terasa ringan):
// - rect elemen di-cache dan divalidasi lewat ResizeObserver, jadi TIDAK ada
//   pembacaan layout (getBoundingClientRect) di setiap pointermove.
// - pointermove hanya menyimpan koordinat terakhir (passive); target spring
//   dihitung maksimal 1x per frame saat loop fisika berjalan.
// - variabel CSS hanya ditulis jika nilainya benar-benar berubah.
export function useSpringTilt() {
  const rootRef = useRef(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduce.matches) return;

    const s = { x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0 };
    const pointer = { x: 0, y: 0 }; // posisi pointer terakhir (koordinat viewport)
    let rect = el.getBoundingClientRect(); // cache; di-refresh oleh observer & saat pointer masuk
    let inside = false;
    let raf = 0;
    let last = 0;
    let px = null;
    let py = null;

    const setVars = () => {
      const nx = s.x.toFixed(3);
      const ny = s.y.toFixed(3);
      if (nx !== px) {
        el.style.setProperty("--tx", nx);
        px = nx;
      }
      if (ny !== py) {
        el.style.setProperty("--ty", ny);
        py = ny;
      }
    };

    const step = (now) => {
      const dt = Math.min((now - last) / 1000, 0.032);
      last = now;
      s.vx += ((s.tx - s.x) * 90 - s.vx * 13) * dt;
      s.vy += ((s.ty - s.y) * 90 - s.vy * 13) * dt;
      s.x += s.vx * dt;
      s.y += s.vy * dt;
      const settled =
        Math.abs(s.tx - s.x) < 0.0015 &&
        Math.abs(s.ty - s.y) < 0.0015 &&
        Math.abs(s.vx) < 0.002 &&
        Math.abs(s.vy) < 0.002;
      if (settled) {
        // snap ke target lalu berhenti: mengakhiri loop rAF lebih cepat
        s.x = s.tx;
        s.y = s.ty;
        s.vx = 0;
        s.vy = 0;
        setVars();
        raf = 0;
        return;
      }
      setVars();
      raf = requestAnimationFrame(step);
    };

    const kick = () => {
      if (raf) return;
      last = performance.now();
      raf = requestAnimationFrame(step);
    };

    const aim = () => {
      s.tx = clamp(((pointer.x - rect.left) / rect.width - 0.5) * 2);
      s.ty = clamp(((pointer.y - rect.top) / rect.height - 0.5) * 2);
      kick();
    };

    const onMove = (e) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      if (!inside) {
        inside = true;
        rect = el.getBoundingClientRect(); // sekali saja saat pointer masuk
      }
      aim();
    };
    const onLeave = () => {
      inside = false;
      s.tx = 0;
      s.ty = 0;
      kick();
    };

    // ukuran/posisi elemen berubah (resize, rotate, dsb.) -> refresh cache rect
    const ro = new ResizeObserver(() => {
      rect = el.getBoundingClientRect();
    });
    ro.observe(el);

    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return rootRef;
}
