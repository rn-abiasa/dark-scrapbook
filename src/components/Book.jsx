import { useEffect, useRef, useState } from "react";
import Bunting from "./Bunting";
import Cover from "./Cover";
import { LightboxProvider } from "./Lightbox";
import Photo from "./Photo";
import SongCard from "./SongCard";
import { GardenSticker, TimelineSticker } from "./Stickers";
import { Arrow, Butterfly, Flower, Heart, Sparkle } from "./Doodles";

const TABS = ["Surat", "Kenangan", "Penutup"];
const PANEL_LABELS = ["Surat pembuka", "Foto favorit", "Surat penutup"];

// Pembungkus tiap panel. Panel 2 dan 3 dilipat (Z-fold) saat tertutup: tiap panel
// berputar dari garis lipatan di tepi kirinya. Pembungkus luar tidak ikut berputar,
// jadi snap, ukuran, dan IntersectionObserver tetap memakai kotak aslinya.
// Arah lipatan, durasi, easing, dan jeda diatur CSS lewat atribut `data-open`
// (lihat .fold di index.css); JS hanya mengubah satu boolean `isOpen`.
function Slot({ i, isOpen, delayClose = 0, delayOpen = 0, children }) {
  return (
    <div
      data-i={i}
      className="slot relative flex w-[var(--pw)] shrink-0 snap-center flex-col lg:w-auto"
    >
      {i === 0 ? (
        children
      ) : (
        <div
          className="fold relative flex min-h-0 flex-1 flex-col"
          data-open={isOpen}
          style={{
            "--d-close": `${delayClose}ms`,
            "--d-open": `${delayOpen}ms`,
          }}
        >
          {children}
          {/* bayangan lipatan: gelap saat terlipat, terang saat terbuka (hanya animasi opacity) */}
          <span aria-hidden="true" className="fold-shade" />
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
      className="paper panel-shadow relative flex min-h-0 flex-1 flex-col gap-[4.444cqw] overflow-hidden rounded-[3px] p-[5.556cqw] pt-[7.778cqw] lg:rounded-none"
    >
      {fold && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 hidden w-[7.778cqw] bg-gradient-to-r from-black/45 to-transparent lg:block"
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
      className={`space-y-[2.222cqw] font-hand text-[6.667cqw] leading-[1.08] tracking-wide text-chalk ${className}`}
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

export default function Book({ data, isOpen, onOpen, onClose }) {
  const { name, age, song, left, center, right, timeline, garden } = data;
  const closed = !isOpen;
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

  useEffect(() => {
    if (closed) trackRef.current?.scrollTo({ left: 0, behavior: "smooth" });
  }, [closed]);

  // Halaman aktif dideteksi lewat IntersectionObserver: hanya terpicu saat panel
  // berganti, bukan di setiap event scroll (hemat render dan baca layout).
  // Di desktop semua panel terlihat sekaligus, jadi observer tidak dipasang.
  useEffect(() => {
    const track = trackRef.current;
    if (!track || window.matchMedia("(min-width: 1024px)").matches) return;
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
  }, []);

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
        {/* Panggung: tinggi akhir buku diatur CSS (.stage); `.unit` adalah
            container ukuran (cqw) pengganti transform:scale lama. */}
        <div className="stage">
          <div className="unit">
            <div
              ref={trackRef}
              className={`book-track ${closed ? "book-closed" : "is-open"}`}
            >
              {/* panel kiri + sampul yang menempel di atasnya */}
              <Slot i={0} isOpen={isOpen}>
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
                    <Flower className="absolute -bottom-[4.444cqw] right-[6.667cqw] w-[15.556cqw] rotate-12" />
                    <Heart className="absolute right-[8.889cqw] top-[2.222cqw] w-[6.667cqw] text-chalk/80" />
                  </div>
                  <div>
                    <p className="font-type text-[3.333cqw] leading-relaxed text-chalk/80">
                      {left.intro}
                    </p>
                    <Letter lines={left.body} className="mt-[2.222cqw]" />
                  </div>
                  <div className="relative mt-auto">
                    <Photo
                      {...left.photoBottom}
                      index={1}
                      rotate={2}
                      ratio="aspect-[5/4]"
                      className="w-[62%]"
                      tape
                      tapeClass="-top-[2.222cqw] -left-[3.333cqw]"
                    />
                    <TimelineSticker
                      data={timeline}
                      className="absolute bottom-[7.778cqw] right-[-1.778cqw]"
                    />
                  </div>
                </Panel>
                <Cover name={name} age={age} isOpen={isOpen} onOpen={onOpen} />
              </Slot>

              {/* panel tengah */}
              <Slot i={1} isOpen={isOpen} delayClose={400} delayOpen={450}>
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
                    <Bunting text="HAPPY" w={200} className="w-[55.556cqw]" />
                    <Bunting
                      text="BIRTHDAY"
                      w={260}
                      className="-mt-[3.333cqw] w-[72.222cqw]"
                    />
                  </div>
                  <p className="text-center font-hand text-[10cqw] leading-none text-chalk">
                    {name}
                  </p>
                  <div className="flex items-end gap-[2.222cqw] font-hand text-[8.333cqw] leading-none text-chalk">
                    <span>{center.favourite}</span>
                    <Arrow className="mb-[2.778cqw] w-[5.556cqw] text-chalk/80" />
                  </div>
                  <div className="mx-auto grid aspect-square w-full max-w-[69.444cqw] grid-cols-4 grid-rows-4 gap-[1.667cqw]">
                    {TILES.map((t, i) => (
                      <Photo
                        key={i}
                        {...center.collage[i]}
                        index={i + 2}
                        rotate={t.rot}
                        ratio=""
                        className="h-full w-full p-[1.111cqw]"
                        style={{ gridColumn: t.c, gridRow: t.r }}
                      />
                    ))}
                  </div>
                  <div className="mt-5 space-y-[1.111cqw]">
                    <p className="flex items-center gap-[1.111cqw] font-type text-[3.333cqw] text-chalk/75">
                      <Heart className="w-[4.444cqw] shrink-0" /> {center.call}
                    </p>
                    <p className="font-hand text-[6.667cqw] leading-[1.08] text-chalk">
                      {center.note}
                    </p>
                  </div>
                  <Sparkle className="absolute right-[6.667cqw] top-[26.667cqw] w-[3.333cqw] text-chalk/70" />
                </Panel>
              </Slot>
              {/* panel kanan */}
              <Slot i={2} isOpen={isOpen} delayClose={0} delayOpen={850}>
                <Panel
                  fold
                  label={PANEL_LABELS[2]}
                  inert={closed}
                  dim={!closed && index !== 2}
                >
                  <Butterfly className="absolute left-[40%] top-[1.111cqw] w-[11.111cqw] -rotate-12" />
                  <div className="flex items-start gap-[3.333cqw]">
                    <div className="min-w-0 flex-1 pt-[3.333cqw]">
                      <p className="font-type text-[3.333cqw] text-chalk/80">
                        {right.intro}
                      </p>
                      <Letter lines={right.body} className="mt-[2.222cqw]" />
                    </div>
                    <Photo
                      {...right.photoTop}
                      index={10}
                      rotate={2}
                      ratio="aspect-[4/5]"
                      className="w-[42%] shrink-0"
                      tape
                      tapeClass="-top-[2.222cqw] -right-[2.222cqw]"
                    />
                  </div>
                  <div className="relative mx-auto w-[88%]">
                    <SongCard
                      videoId={song.id}
                      title={song.title}
                      artist={song.artist}
                    />
                    <span className="absolute -bottom-[3.333cqw] -right-[2.222cqw] rotate-6 rounded-full bg-bunting px-[3.333cqw] py-[0.556cqw] font-hand text-[6.667cqw] leading-none text-ink ring-2 ring-chalk">
                      Besties
                    </span>
                  </div>
                  <div className="flex items-end justify-between">
                    <GardenSticker
                      data={garden}
                      className="mb-[2.222cqw] ml-[3.333cqw]"
                    />
                    <Photo
                      {...right.photoBottom}
                      index={11}
                      rotate={-2}
                      ratio="aspect-[5/4]"
                      className="w-[40%]"
                      tape
                      tapeClass="-top-[2.222cqw] -left-[3.333cqw]"
                    />
                  </div>
                </Panel>
              </Slot>
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

        {/* muncul setelah animasi buka selesai (close-late di index.css) */}
        {isOpen && (
          <button
            type="button"
            onClick={onClose}
            className="close-late mx-auto mt-2 block font-hand text-2xl text-chalk/60 underline underline-offset-4 hover:text-chalk"
          >
            Tutup scrapbook
          </button>
        )}
      </section>
    </LightboxProvider>
  );
}
