import { useState } from "react";
import Bloom from "./Bloom";
import Garden from "./Garden";
import PaperDialog from "./PaperDialog";
import Timeline from "./Timeline";

// Stiker yang bisa diketuk: ditempel di panel, lalu membuka dialog kertas.
function Sticker({ label, rotate, onClick, className = "", children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-haspopup="dialog"
      aria-label={label}
      className={`sticker sticker-hint relative shadow-[0_1px_1px_rgba(0,0,0,0.6)] active:scale-95 ${className}`}
      style={{ "--r": `${rotate}deg` }}
    >
      {children}
    </button>
  );
}

// Stiker "Perjalanan kita" (kalender sobek) -> dialog garis waktu.
export function TimelineSticker({ data, className = "" }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Sticker
        label={`Buka ${data.title}`}
        rotate={5}
        onClick={() => setOpen(true)}
        className={`w-[104px] bg-chalk pb-2 text-ink ${className}`}
      >
        <span className="block bg-bunting py-0.5 font-type text-[10px] leading-none">kenangan</span>
        <svg viewBox="0 0 90 30" className="mx-auto mt-1 h-7 w-[88%]" fill="none" aria-hidden="true">
          <path d="M6 22C26 2 44 30 62 14s20-6 24-8" stroke="currentColor" strokeWidth="1.4" strokeDasharray="3 3" strokeLinecap="round" />
          <circle cx="6" cy="22" r="3" fill="currentColor" />
          <circle cx="44" cy="19" r="3" fill="currentColor" />
          <circle cx="85" cy="6" r="3.5" fill="#e9b6bf" stroke="currentColor" strokeWidth="1.2" />
        </svg>
        <span className="mt-1 block px-1 font-hand text-[1.55rem] leading-[0.95]">{data.title}</span>
      </Sticker>

      <PaperDialog open={open} onClose={() => setOpen(false)} label={data.title}>
        <Timeline data={data} />
      </PaperDialog>
    </>
  );
}

// Stiker "Kebun mini" (bungkus bibit) -> dialog kebun bunga.
// Progres menanam disimpan di sini, jadi tidak hilang saat dialog ditutup.
export function GardenSticker({ data, className = "" }) {
  const [open, setOpen] = useState(false);
  const [planted, setPlanted] = useState(() => data.flowers.map(() => false));
  const [active, setActive] = useState(null);

  const tap = (i) => {
    setPlanted((p) => p.map((v, j) => (j === i ? true : v)));
    setActive(i);
  };

  return (
    <>
      <Sticker
        label={`Buka ${data.title}`}
        rotate={-5}
        onClick={() => setOpen(true)}
        className={`w-[96px] bg-chalk text-ink ${className}`}
      >
        <span
          aria-hidden="true"
          className="block h-3 bg-bunting"
          style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
        />
        <span className="mx-auto -mt-0.5 block h-14 w-10">
          <Bloom />
        </span>
        <span className="block px-1 pb-1.5 font-hand text-[1.45rem] leading-none">{data.title}</span>
      </Sticker>

      <PaperDialog open={open} onClose={() => setOpen(false)} label={data.title}>
        <Garden data={data} planted={planted} active={active} onTap={tap} />
      </PaperDialog>
    </>
  );
}
