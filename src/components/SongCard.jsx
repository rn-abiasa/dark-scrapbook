import { useState } from "react";
import Tape from "./Tape";

const ID_RE = /^[\w-]{11}$/;

function Eq({ on }) {
  return (
    <span className={`inline-flex h-3 items-end gap-[2px] ${on ? "eq-on" : ""}`} aria-hidden="true">
      <i className="eq-bar" />
      <i className="eq-bar" />
      <i className="eq-bar" />
    </span>
  );
}

// Kartu lagu dari YouTube ID. Thumbnail dan player memakai bingkai 16:9 yang sama,
// jadi ukuran kartu tidak berubah saat lagu diputar. Player baru dimuat setelah diklik.
export default function SongCard({ videoId, title, artist, className = "" }) {
  const [playing, setPlaying] = useState(false);
  if (!ID_RE.test(videoId ?? "")) return null;

  return (
    <section
      aria-label={`Lagu: ${title}`}
      className={`relative -rotate-1 rounded-[3px] border border-dashed border-chalk/40 bg-white/[0.04] p-3 pt-4 ${className}`}
    >
      <Tape className="-top-2 left-6" rotate={-4} />
      <p className="flex items-center gap-2 font-type text-[11px] text-chalk/70">
        <Eq on={playing} /> Lagu kita
      </p>

      <div className="mt-2 bg-chalk p-1 shadow-[0_1px_1px_rgba(0,0,0,0.6)]">
        <div className="relative aspect-video w-full overflow-hidden bg-black">
          {playing ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&playsinline=1`}
              title={`${title} - ${artist}`}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              className="absolute inset-0 h-full w-full"
            />
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              aria-label={`Putar lagu ${title} oleh ${artist}`}
              className="absolute inset-0"
            >
              <img
                src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <span className="absolute inset-0 grid place-items-center">
                <span className="grid h-10 w-10 place-items-center rounded-full border border-chalk bg-black/60">
                  <svg viewBox="0 0 24 24" className="ml-0.5 h-4 w-4 fill-chalk" aria-hidden="true">
                    <path d="M6 4v16l14-8z" />
                  </svg>
                </span>
              </span>
            </button>
          )}
        </div>
      </div>

      <div className="mt-2 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-hand text-[1.6rem] leading-none">{title}</p>
          <p className="mt-1 truncate font-type text-xs text-chalk/70">{artist}</p>
        </div>
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          className="shrink-0 font-hand text-2xl leading-none text-chalk/80 underline underline-offset-4 hover:text-chalk"
        >
          {playing ? "Berhenti" : "Putar"}
        </button>
      </div>
    </section>
  );
}
