import Bunting from "./Bunting";
import Tape from "./Tape";
import { Butterfly, Flower, ScribbleCircle, Sparkle } from "./Doodles";

const FACE = {
  backfaceVisibility: "hidden",
  WebkitBackfaceVisibility: "hidden",
};
const TORN =
  "polygon(0 0,100% 0,98% 30%,100% 55%,98% 80%,100% 100%,0 100%,2% 75%,0 50%,2% 25%)";

// Sampul ini menempel persis di atas panel pertama scrapbook (satu objek yang sama).
// Saat dibuka, sampul berputar ke kiri dan memperlihatkan panel pertama di bawahnya.
// Ayunan + seluruh timeline animasinya kini dikendalikan CSS lewat atribut
// `data-open` (lihat .cover di index.css), bukan inline style dari JS.
// Semua ukuran dalam cqw karena sampul selalu berada di dalam panel.
export default function Cover({ name, age, isOpen, onOpen }) {
  return (
    <div
      className="cover absolute inset-0 z-20"
      data-open={isOpen}
      inert={isOpen}
    >
      <div className="cover-swing">
        <div
          className="paper absolute inset-0 rounded-[3px] shadow-[0_6.667cqw_13.889cqw_rgba(0,0,0,0.6)]"
          style={FACE}
        >
          <div
            aria-hidden="true"
            className="absolute inset-[3.333cqw] rounded-[2px] border border-dashed border-chalk/35"
          />
          <Tape className="-left-[3.333cqw] top-[5.556cqw]" rotate={-38} />
          <Butterfly className="absolute right-[5.556cqw] top-[46%] w-[13.333cqw] rotate-12" />
          <Flower className="absolute bottom-[26.667cqw] left-[4.444cqw] w-[13.333cqw] -rotate-12" />
          <Sparkle className="absolute left-[8.889cqw] top-[42%] w-[3.889cqw] text-chalk/80" />
          <Sparkle className="absolute bottom-[44.444cqw] right-[10cqw] w-[2.778cqw] text-chalk/70" />

          <div className="relative flex h-full flex-col items-center justify-around px-[6.667cqw] pb-[10cqw] pt-[11.111cqw] text-center">
            <div className="flex flex-col items-center" aria-hidden="true">
              <Bunting text="HAPPY" w={200} className="w-[55.556cqw]" />
              <Bunting
                text="BIRTHDAY"
                w={290}
                className="-mt-[3.333cqw] w-[80.556cqw]"
              />
            </div>

            <div className="relative">
              <ScribbleCircle className="absolute -inset-x-[7.778cqw] -inset-y-[4.444cqw] h-[calc(100%+8.889cqw)] w-[calc(100%+15.556cqw)] text-chalk/70" />
              <p className="relative font-hand text-[37.778cqw] leading-[0.9]">
                {age}
              </p>
            </div>

            <p className="font-type text-[3.889cqw] text-chalk/70">
              untuk {name}
            </p>

            <button
              type="button"
              onClick={onOpen}
              className="relative -rotate-2 bg-bunting px-[11.111cqw] py-[2.778cqw] font-hand text-[10cqw] leading-none text-ink shadow-[0_3px_0_rgba(0,0,0,0.35)] transition-transform active:translate-y-px hover:rotate-0"
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
