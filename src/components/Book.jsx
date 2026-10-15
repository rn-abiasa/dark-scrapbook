import { useEffect, useRef, useState } from "react";
import Bunting from "./Bunting";
import Cover from "./Cover";
import { LightboxProvider } from "./Lightbox";
import Photo from "./Photo";
import SongCard from "./SongCard";
import { GardenSticker, TimelineSticker } from "./Stickers";
import { Arrow, Butterfly, Flower, Heart, Sparkle } from "./Doodles";
import {
  DESK_RATIO,
  PANEL_H,
  PANEL_W,
  TRACK_PAD,
  useFit,
} from "../hooks/useFit";

const TABS = ["Surat", "Kenangan", "Penutup"];
const PANEL_LABELS = ["Surat pembuka", "Foto favorit", "Surat penutup"];

// Pembungkus tiap panel. Panel 2 dan 3 dilipat (Z-fold) saat tertutup: tiap panel
// berputar dari garis lipat di tepi kirinya. Pembungkus luar tidak ikut berputar,
// jadi snap, ukuran, dan IntersectionObserver tetap memakai kotak aslinya.
function Slot({ i, children, folded = false, delay = 0 }) {
  return (
    <div
      data-i={i}
      className="relative flex w-[360px] shrink-0 snap-center flex-col lg:w-auto"
      style={{ perspective: "2400px" }}
    >
      {i === 0 ? (
        children
      ) : (
        <div
          className="fold relative flex min-h-0 flex-1 flex-col"
          style={{
            transform: folded ? "rotateY(-172deg)" : "rotateY(0deg)",
            "--fold-delay": `${delay}ms`,
            // buka: lebih lambat dan sedikit "memantul" saat kertas mendarat; tutup: tetap seperti semula
            "--fold-dur": folded ? "800ms" : "1000ms",
            "--fold-ease": folded
              ? "cubic-bezier(0.5, 0.05, 0.25, 1)"
              : "cubic-bezier(0.25, 1.15, 0.4, 1)",
          }}
        >
          {children}
          {/* bayangan lipatan: gelap saat terlipat, terang saat terbuka (hanya animasi opacity) */}
          <span
            aria-hidden="true"
            className="fold-shade"
            style={{ opacity: folded ? 1 : 0 }}
          />
        </div>
      )}
    </div>
  );
}

// Di mobile, panel yang tidak sedang dilihat diredupkan lewat lapisan tipis (`dim`).
// Yang dianimasikan hanya opacity lapisan solid ini, bukan seluruh panel, supaya
// browser tidak perlu me-render ulang panel (foto, tekstur, bayangan) tiap pindah halaman.
function Panel({ children, fold = false, label, inert = false, dim = false }) {
  return (
    <article
      aria-label={label}
      inert={inert}
      className="paper panel-shadow relative flex min-h-0 flex-1 flex-col gap-4 overflow-hidden rounded-[3px] p-5 pt-7 lg:rounded-none"
    >
      {fold && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 hidden w-7 bg-gradient-to-r from-black/45 to-transparent lg:block"
        />
      )}
      {children}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 z-20 bg-night opacity-0 transition-opacity duration-300 ${dim ? "max-lg:opacity-55" : ""}`}
      />
    </article>
  );
}

// Tulisan tangan ala kapur putih; tiap paragraf sedikit miring.
function Letter({ lines, className = "" }) {
  return (
    <div
      className={`space-y-2 font-hand text-[1.5rem] leading-[1.08] tracking-wide text-chalk ${className}`}
    >
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

export default function Book({ data, phase, onOpen, onClose }) {
  const { name, age, song, left, center, right, timeline, garden } = data;
  const closed = phase === "closed";
  const { s, desktop, vw } = useFit();
  const trackRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [seen, setSeen] = useState(false);

  // urutan galeri lightbox: sama dengan urutan foto di halaman
  const items = [
    left.photoTop,
    left.photoBottom,
    ...center.collage,
    right.photoTop,
    right.photoBottom,
  ];

  const trackH = PANEL_H + TRACK_PAD * 2;
  // ukuran desain (belum diskalakan): desktop = 3 panel, mobile = selebar layar / skala
  const innerW = desktop ? PANEL_W * DESK_RATIO : null;
  const mobilePad = desktop ? 0 : Math.max((vw / s - PANEL_W) / 2, 0);

  useEffect(() => {
    if (closed) trackRef.current?.scrollTo({ left: 0, behavior: "smooth" });
  }, [closed]);

  // Halaman aktif dideteksi lewat IntersectionObserver: hanya terpicu saat panel
  // berganti, bukan di setiap event scroll (hemat render dan baca layout).
  useEffect(() => {
    const track = trackRef.current;
    if (!track || desktop) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.intersectionRatio < 0.6) return;
          const i = Number(e.target.dataset.i);
          setIndex(i);
          if (i > 0) setSeen(true);
        });
      },
      { root: track, threshold: 0.6 },
    );
    [...track.children].forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, [desktop]);

  const goTo = (i) => {
    const el = trackRef.current;
    const c = el?.children[i];
    if (!c) return;
    setSeen(true);
    el.scrollTo({
      left: c.offsetLeft + c.offsetWidth / 2 - el.clientWidth / 2,
      behavior: "smooth",
    });
  };

  return (
    <LightboxProvider items={items}>
      <section
        aria-label="Scrapbook ulang tahun"
        className="w-full min-w-0 py-4"
      >
        <div>
          {/* stage: kotak berukuran akhir (sudah diskalakan) */}
          <div
            className="relative mx-auto"
            style={{ width: desktop ? innerW * s : "100%", height: trackH * s }}
          >
            {/* isi berukuran desain, diskalakan dari pojok kiri atas */}
            <div
              style={{
                width: desktop ? innerW : `${100 / s}%`,
                height: trackH,
                transform: `scale(${s})`,
                transformOrigin: "top left",
              }}
            >
              <div
                ref={trackRef}
                style={{ paddingInline: desktop ? 0 : mobilePad }}
                className={`book-track relative flex h-full w-full snap-x snap-mandatory gap-3 py-4 lg:grid lg:snap-none lg:grid-cols-[1fr_1.3fr_1fr] lg:gap-0 lg:overflow-visible ${
                  closed
                    ? "book-closed overflow-x-hidden"
                    : "is-open overflow-x-auto"
                } overflow-y-hidden`}
              >
                {/* panel kiri + sampul yang menempel di atasnya */}
                <Slot i={0}>
                  <Panel
                    label={PANEL_LABELS[0]}
                    inert={closed}
                    dim={!closed && index !== 0}
                  >
                    <div className="relative">
                      <Photo
                        {...left.photoTop}
                        index={0}
                        rotate={-2}
                        ratio="aspect-[5/4]"
                        className="w-[58%]"
                        tape
                      />
                      <Flower className="absolute -bottom-4 right-6 w-14 rotate-12" />
                      <Heart className="absolute right-8 top-2 w-6 text-chalk/80" />
                    </div>
                    <div>
                      <p className="font-type text-xs leading-relaxed text-chalk/80">
                        {left.intro}
                      </p>
                      <Letter lines={left.body} className="mt-2" />
                    </div>
                    <div className="relative mt-auto">
                      <Photo
                        {...left.photoBottom}
                        index={1}
                        rotate={2}
                        ratio="aspect-[5/4]"
                        className="w-[62%]"
                        tape
                        tapeClass="-top-2 -left-3"
                      />
                      <TimelineSticker
                        data={timeline}
                        className="absolute bottom-1 right-1"
                      />
                    </div>
                  </Panel>
                  <Cover name={name} age={age} phase={phase} onOpen={onOpen} />
                </Slot>

                {/* panel tengah */}
                <Slot i={1} folded={closed} delay={closed ? 400 : 450}>
                  <Panel
                    fold
                    label={PANEL_LABELS[1]}
                    inert={closed}
                    dim={!closed && index !== 1}
                  >
                    <div
                      className="flex flex-col items-center"
                      aria-hidden="true"
                    >
                      <Bunting text="HAPPY" w={200} />
                      <Bunting text="BIRTHDAY" w={260} className="-mt-3" />
                    </div>
                    <p className="text-center font-hand text-4xl leading-none text-chalk">
                      {name}
                    </p>
                    <div className="flex items-end gap-2 font-hand text-3xl leading-none text-chalk">
                      <span>{center.favourite}</span>
                      <Arrow className="mb-1 w-5 text-chalk/80" />
                    </div>
                    <div className="mx-auto grid aspect-square w-full max-w-[250px] grid-cols-4 grid-rows-4 gap-1.5">
                      {TILES.map((t, i) => (
                        <Photo
                          key={i}
                          {...center.collage[i]}
                          index={i + 2}
                          rotate={t.rot}
                          ratio=""
                          className="h-full w-full p-1"
                          style={{ gridColumn: t.c, gridRow: t.r }}
                        />
                      ))}
                    </div>
                    <div className="mt-auto space-y-1">
                      <p className="flex items-center gap-2 font-type text-xs text-chalk/75">
                        <Heart className="w-4 shrink-0" /> {center.call}
                      </p>
                      <p className="font-hand text-2xl leading-[1.08] text-chalk">
                        {center.note}
                      </p>
                    </div>
                    <Sparkle className="absolute right-6 top-24 w-3 text-chalk/70" />
                  </Panel>
                </Slot>

                {/* panel kanan */}
                <Slot i={2} folded={closed} delay={closed ? 0 : 850}>
                  <Panel
                    fold
                    label={PANEL_LABELS[2]}
                    inert={closed}
                    dim={!closed && index !== 2}
                  >
                    <Butterfly className="absolute left-[40%] top-1 w-10 -rotate-12" />
                    <div className="flex items-start gap-3">
                      <div className="min-w-0 flex-1 pt-3">
                        <p className="font-type text-xs text-chalk/80">
                          {right.intro}
                        </p>
                        <Letter lines={right.body} className="mt-2" />
                      </div>
                      <Photo
                        {...right.photoTop}
                        index={10}
                        rotate={2}
                        ratio="aspect-[4/5]"
                        className="w-[42%] shrink-0"
                        tape
                        tapeClass="-top-2 -right-2"
                      />
                    </div>
                    <div className="relative mx-auto w-[88%]">
                      <SongCard
                        videoId={song.id}
                        title={song.title}
                        artist={song.artist}
                      />
                      <span className="absolute -bottom-3 -right-2 rotate-6 rounded-full bg-bunting px-3 py-0.5 font-hand text-2xl leading-none text-ink ring-2 ring-chalk">
                        Besties
                      </span>
                    </div>
                    <div className="mt-auto flex items-end justify-between">
                      <GardenSticker data={garden} className="mb-2 ml-3" />
                      <Photo
                        {...right.photoBottom}
                        index={11}
                        rotate={-2}
                        ratio="aspect-[5/4]"
                        className="w-[40%]"
                        tape
                        tapeClass="-top-2 -left-3"
                      />
                    </div>
                  </Panel>
                </Slot>
              </div>
            </div>
          </div>
        </div>

        {/* navigasi mobile: geser, atau ketuk judul halaman */}
        <div
          className={`mt-3 flex min-h-[84px] flex-col items-center gap-1 transition-opacity duration-500 lg:hidden ${closed ? "pointer-events-none opacity-0" : "opacity-100"}`}
          inert={closed}
        >
          <p
            aria-hidden="true"
            className={`h-7 font-hand text-2xl leading-7 text-chalk/70 transition-opacity duration-500 motion-reduce:animate-none ${!seen && index === 0 ? "animate-pulse opacity-100" : "opacity-0"}`}
          >
            geser ke kanan →
          </p>
          <nav
            aria-label="Halaman scrapbook"
            className="flex items-center justify-center"
          >
            {TABS.map((label, i) => {
              const active = index === i;
              return (
                <button
                  key={label}
                  type="button"
                  aria-label={PANEL_LABELS[i]}
                  aria-current={active ? "page" : undefined}
                  onClick={() => goTo(i)}
                  className={`relative min-h-11 px-4 font-hand text-[1.7rem] leading-none transition-colors ${active ? "text-chalk" : "text-chalk/50"}`}
                >
                  {label}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-3 bottom-1.5 h-[2px] rounded-full bg-chalk transition-opacity ${active ? "opacity-100" : "opacity-0"}`}
                  />
                </button>
              );
            })}
          </nav>
        </div>

        {phase === "open" && (
          <button
            type="button"
            onClick={onClose}
            className="mx-auto mt-2 block font-hand text-2xl text-chalk/60 underline underline-offset-4 hover:text-chalk"
          >
            Tutup scrapbook
          </button>
        )}
      </section>
    </LightboxProvider>
  );
}
