import Bunting from "./Bunting";
import Tape from "./Tape";
import { Butterfly, Flower, ScribbleCircle, Sparkle } from "./Doodles";

const FACE = { backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" };
const TORN =
  "polygon(0 0,100% 0,98% 30%,100% 55%,98% 80%,100% 100%,0 100%,2% 75%,0 50%,2% 25%)";

// Sampul ini menempel persis di atas panel pertama scrapbook (satu objek yang sama).
// Saat dibuka, sampul berputar ke kiri dan memperlihatkan panel pertama di bawahnya.
export default function Cover({ name, age, phase, onOpen }) {
  const closed = phase === "closed";

  return (
    <div
      className="absolute inset-0 z-20"
      inert={!closed}
      style={{
        perspective: "1800px",
        opacity: closed ? 1 : 0,
        // disembunyikan total setelah ayunan selesai agar tidak ikut dirender/di-composite
        visibility: closed ? "visible" : "hidden",
        // memudar hanya di akhir ayunan, saat sampul sudah tegak lurus layar
        transition: closed
          ? "opacity 120ms"
          : "opacity 350ms ease 750ms, visibility 0s linear 1.1s",
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          transformStyle: "preserve-3d",
          transformOrigin: "left center",
          transform: closed ? "rotateY(0deg)" : "rotateY(-172deg)",
          transition: "transform 1050ms cubic-bezier(0.55, 0.04, 0.25, 1)",
        }}
      >
        <div
          className="paper absolute inset-0 rounded-[3px] shadow-[0_24px_50px_rgba(0,0,0,0.6)]"
          style={FACE}
        >
          <div
            aria-hidden="true"
            className="absolute inset-3 rounded-[2px] border border-dashed border-chalk/35"
          />
          <Tape className="-left-3 top-5" rotate={-38} />
          <Butterfly className="absolute right-5 top-[46%] w-12 rotate-12" />
          <Flower className="absolute bottom-24 left-4 w-12 -rotate-12" />
          <Sparkle className="absolute left-8 top-[42%] w-3.5 text-chalk/80" />
          <Sparkle className="absolute bottom-40 right-9 w-2.5 text-chalk/70" />

          <div className="relative flex h-full flex-col items-center justify-between px-6 pb-9 pt-10 text-center">
            <div className="flex flex-col items-center" aria-hidden="true">
              <Bunting text="HAPPY" w={200} />
              <Bunting text="BIRTHDAY" w={290} className="-mt-3" />
            </div>

            <div className="relative">
              <ScribbleCircle className="absolute -inset-x-7 -inset-y-4 h-[calc(100%+2rem)] w-[calc(100%+3.5rem)] text-chalk/70" />
              <p className="relative font-hand text-[8.5rem] leading-[0.9]">{age}</p>
            </div>

            <p className="font-type text-sm text-chalk/70">untuk {name}</p>

            <button
              type="button"
              onClick={onOpen}
              className="relative -rotate-2 bg-bunting px-10 py-2.5 font-hand text-4xl leading-none text-ink shadow-[0_3px_0_rgba(0,0,0,0.35)] transition-transform active:translate-y-px hover:rotate-0"
              style={{ clipPath: TORN }}
            >
              Buka
            </button>
          </div>
        </div>

        {/* sisi dalam sampul */}
        <div
          aria-hidden="true"
          className="paper absolute inset-0 rounded-[3px]"
          style={{ ...FACE, transform: "rotateY(180deg)" }}
        />
      </div>
    </div>
  );
}
