import Bloom from "./Bloom";

// Warna dan jumlah kelopak tiap bunga (urutannya sama dengan `garden.flowers`).
const LOOKS = [
  { color: "#e9b6bf", center: "#e2b13c", petals: 6 },
  { color: "#e2b13c", center: "#8a5a3c", petals: 8 },
  { color: "#a9bfd4", center: "#ece7dc", petals: 5 },
  { color: "#f0b999", center: "#8a5a3c", petals: 7 },
  { color: "#c9b6e0", center: "#e2b13c", petals: 6 },
  { color: "#ece7dc", center: "#e2b13c", petals: 8 },
];

// Isi dialog "Kebun mini": ketuk tanah untuk menanam, ketuk bunga untuk membaca pesannya.
export default function Garden({ data, planted, active, onTap }) {
  const total = data.flowers.length;
  const count = planted.filter(Boolean).length;
  const done = count === total;
  const caption = active !== null ? data.flowers[active] : data.hint;

  return (
    <>
      <div className="pr-16">
        <p className="font-type text-xs text-chalk/70">{data.intro}</p>
        <h2 className="mt-1 font-hand text-4xl leading-none text-chalk">{data.title}</h2>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-x-2 gap-y-3">
        {data.flowers.map((_, i) => {
          const look = LOOKS[i % LOOKS.length];
          const isPlanted = planted[i];
          return (
            <button
              key={i}
              type="button"
              onClick={() => onTap(i)}
              aria-label={isPlanted ? `Baca pesan bunga ${i + 1}` : `Tanam bunga ${i + 1}`}
              className="relative h-[116px]"
            >
              <span className="absolute inset-x-0 bottom-3 top-0 block">
                <Bloom {...look} planted={isPlanted} />
              </span>
              <span className="absolute inset-x-1 bottom-0 grid h-6 place-items-center rounded-[50%] border border-dashed border-chalk/40 bg-white/[0.06] font-type text-[9px] text-chalk/55">
                {isPlanted ? "" : "tanam"}
              </span>
              {active === i && (
                <span
                  aria-hidden="true"
                  className="absolute -top-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-bunting"
                />
              )}
            </button>
          );
        })}
      </div>

      <p
        aria-live="polite"
        className="mt-4 min-h-[3.4rem] font-hand text-[1.5rem] leading-[1.1] text-chalk"
      >
        {caption}
      </p>
      <p className="mt-2 font-type text-xs text-chalk/70">
        {count}/{total} bunga{done ? ` · ${data.finale}` : ""}
      </p>
    </>
  );
}
