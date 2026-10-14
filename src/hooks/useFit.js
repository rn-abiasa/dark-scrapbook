import { useEffect, useState } from "react";

// Ukuran desain satu panel (px). Seluruh buku diskalakan agar muat di layar
// tanpa perlu scroll vertikal.
export const PANEL_W = 360;
export const PANEL_H = 640;
export const TRACK_PAD = 16; // ruang untuk bayangan atas dan bawah
export const DESK_RATIO = 3.3; // lebar buku di desktop = 3.3 panel (1fr 1.3fr 1fr)

function measure() {
  const vw = document.documentElement.clientWidth;
  const vh = window.innerHeight;
  const desktop = window.innerWidth >= 1024;
  const w = desktop ? PANEL_W * DESK_RATIO : PANEL_W;
  const h = PANEL_H + TRACK_PAD * 2;
  const reserveY = desktop ? 120 : 180; // ruang untuk navigasi dan jarak
  const max = desktop ? 0.9 : 1;
  const s = Math.min((vw - 64) / w, (vh - reserveY) / h, max);
  return { vw, desktop, s: Math.max(s, 0.35) };
}

export function useFit() {
  const [fit, setFit] = useState(measure);

  useEffect(() => {
    const on = () => setFit(measure());
    window.addEventListener("resize", on);
    window.addEventListener("orientationchange", on);
    return () => {
      window.removeEventListener("resize", on);
      window.removeEventListener("orientationchange", on);
    };
  }, []);

  return fit;
}
