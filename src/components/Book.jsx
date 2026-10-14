import { useRef, useState } from "react";
import Bunting from "./Bunting";
import Photo from "./Photo";
import { Arrow, Butterfly, Flower, Heart, Plane, Sparkle } from "./Doodles";

function Panel({ children, fold = false, label }) {
  return (
    <article
      aria-label={label}
      className="paper relative flex min-h-[640px] w-[88vw] max-w-[440px] shrink-0 snap-center flex-col gap-6 overflow-hidden rounded-[3px] p-6 pt-8 shadow-[0_18px_40px_rgba(0,0,0,0.55)] lg:w-auto lg:max-w-none lg:rounded-none lg:shadow-none"
    >
      {fold && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 hidden w-7 bg-gradient-to-r from-black/45 to-transparent lg:block"
        />
      )}
      {children}
    </article>
  );
}

// Tulisan tangan ala kapur putih; tiap paragraf sedikit miring.
function Letter({ lines, className = "" }) {
  return (
    <div className={`space-y-2 font-hand text-[1.7rem] leading-[1.08] tracking-wide text-chalk ${className}`}>
      {lines.map((line, i) => (
        <p key={i} style={{ transform: `rotate(${i % 2 ? 0.6 : -0.8}deg)` }}>
          {line}
        </p>
      ))}
    </div>
  );
}

const TILES = [
  { c: "1 / span 2", r: "1 / span 2", rot: -1.5 },
  { c: "3 / span 2", r: "1 / span 2", rot: 1.5 },
  { c: "1", r: "3", rot: 2 },
  { c: "2", r: "3", rot: -1 },
  { c: "3", r: "3", rot: 1.5 },
  { c: "4", r: "3", rot: -2 },
  { c: "2", r: "4", rot: -1.5 },
  { c: "3", r: "4", rot: 1 },
];

export default function Book({ data, name }) {
  const { left, center, right } = data;
  const trackRef = useRef(null);
  const [index, setIndex] = useState(0);

  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const mid = el.scrollLeft + el.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    [...el.children].forEach((c, i) => {
      const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    setIndex(best);
  };

  const goTo = (i) => {
    const el = trackRef.current;
    const c = el?.children[i];
    if (!c) return;
    el.scrollTo({ left: c.offsetLeft + c.offsetWidth / 2 - el.clientWidth / 2, behavior: "smooth" });
  };

  return (
    <section aria-label="Scrapbook ulang tahun" className="mx-auto w-full max-w-[1120px] py-8">
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="book-track relative flex snap-x snap-mandatory gap-3 overflow-x-auto py-4 lg:grid lg:grid-cols-[1fr_1.3fr_1fr] lg:gap-0 lg:snap-none lg:overflow-visible lg:py-0 lg:shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
      >
        {/* panel kiri */}
        <Panel label="Surat pembuka">
          <div className="relative">
            <Photo {...left.photoTop} rotate={-2} ratio="aspect-[5/4]" className="w-[64%]" tape />
            <Flower className="absolute -bottom-5 right-3 w-16 rotate-12" />
            <Heart className="absolute right-6 top-2 w-6 text-chalk/80" />
          </div>
          <div>
            <p className="font-type text-xs leading-relaxed text-chalk/80">{left.intro}</p>
            <Letter lines={left.body} className="mt-3" />
          </div>
          <div className="relative mt-auto pt-2">
            <Photo {...left.photoBottom} rotate={2} ratio="aspect-[5/4]" className="w-[70%]" tape tapeClass="-top-2 -left-3" />
            <Plane className="absolute bottom-2 right-4 w-9 -rotate-6 text-chalk/80" />
            <Heart className="absolute bottom-10 right-14 w-4 text-chalk/70" />
          </div>
        </Panel>

        {/* panel tengah */}
        <Panel fold label="Foto favorit">
          <p className="text-center font-hand text-3xl text-chalk">
            {center.greeting} {name}
          </p>
          <div className="-mt-2 flex flex-col items-center" aria-hidden="true">
            <Bunting text="HAPPY" w={200} />
            <Bunting text="BIRTHDAY" w={290} className="-mt-3" />
          </div>
          <div className="flex items-end gap-2 font-hand text-3xl text-chalk">
            <span>{center.favourite}</span>
            <Arrow className="mb-1 w-5 text-chalk/80" />
          </div>
          <div className="grid aspect-square grid-cols-4 grid-rows-4 gap-1.5 px-1">
            {TILES.map((t, i) => (
              <Photo
                key={i}
                {...center.collage[i]}
                rotate={t.rot}
                ratio=""
                className="h-full w-full p-1"
                style={{ gridColumn: t.c, gridRow: t.r }}
              />
            ))}
          </div>
          <div className="mt-auto space-y-2">
            <p className="flex items-center gap-2 font-type text-xs text-chalk/75">
              <Heart className="w-4 shrink-0" /> {center.call}
            </p>
            <p className="font-hand text-2xl leading-[1.1] text-chalk">{center.note}</p>
          </div>
          <Sparkle className="absolute right-6 top-24 w-3 text-chalk/70" />
        </Panel>

        {/* panel kanan */}
        <Panel fold label="Surat penutup">
          <Butterfly className="absolute left-4 top-4 w-12 -rotate-12" />
          <div className="relative flex justify-end">
            <Photo {...right.photoTop} rotate={2} ratio="aspect-[4/5]" className="w-[60%]" tape tapeClass="-top-2 -right-3" />
          </div>
          <div>
            <p className="font-type text-xs text-chalk/80">{right.intro}</p>
            <Letter lines={right.body} className="mt-3" />
          </div>
          <span className="-mt-2 inline-block w-fit rotate-6 self-end rounded-full bg-bunting px-3 py-0.5 font-hand text-2xl leading-none text-ink ring-2 ring-chalk">
            Besties
          </span>
          <div className="relative mt-auto flex justify-end">
            <Photo {...right.photoBottom} rotate={-2} ratio="aspect-[5/4]" className="w-[68%]" tape tapeClass="-top-2 -left-3" />
          </div>
        </Panel>
      </div>

      <div className="mt-2 flex justify-center gap-3 lg:hidden" role="tablist" aria-label="Pilih panel">
        {["Surat pembuka", "Foto favorit", "Surat penutup"].map((l, i) => (
          <button
            key={l}
            type="button"
            role="tab"
            aria-selected={index === i}
            aria-label={l}
            onClick={() => goTo(i)}
            className={`h-2.5 w-2.5 rounded-full border border-chalk/70 transition-colors ${index === i ? "bg-chalk" : "bg-transparent"}`}
          />
        ))}
      </div>
    </section>
  );
}
